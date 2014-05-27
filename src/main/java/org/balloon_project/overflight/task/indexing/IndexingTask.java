/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Distributed
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package org.balloon_project.overflight.task.indexing;

import com.google.common.base.Stopwatch;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.sparql.engine.http.QueryEngineHTTP;
import org.balloon_project.Configuration;
import org.balloon_project.overflight.model.Endpoint;
import org.balloon_project.overflight.model.RelEntity;
import org.balloon_project.overflight.model.Triple;
import org.balloon_project.overflight.service.EndpointService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Scope(value = "prototype")
public class IndexingTask implements Runnable {

    @Autowired
    Configuration configuration;

    @Autowired
    private EndpointService endpointService;

    private Endpoint endpoint;
    private RelEntity relEntity;
    private String filename;
    private File file;
    private Logger logger = LoggerFactory.getLogger(IndexingTask.class);

    public static final String N_TRIPLES_EXTENSION = ".nt";
    public static final String BEGIN_DATA = "# BEGIN DATA";
    public static final String KEY_ENDPOINT = "Endpoint";
    public static final String KEY_PREDICATE = "Predicate";
    public static final String KEY_DATE = "Date";
    public static final String FILE_NAME_IN_ZIP = "dump.n3";
    public static final String DUMP_COMMENT_PREFIX = "#";

    public IndexingTask() {
        // WORKAROUND: spring doesn't allow lookup methods with arguments. Therefore you have to call the init method after creation until this bug has been fixed.
    }

    public void init(Endpoint endpoint, RelEntity relEntity) {
        this.endpoint = endpoint;
        this.relEntity = relEntity;
        this.filename = endpoint.getEndpointID() + "_" + relEntity.getShortname() + N_TRIPLES_EXTENSION;
        try {
            this.file = getOrCreateDumpFile();
        } catch (IOException e) {
            throw new IllegalStateException("couldn't get access to filesystem");
        }
    }

    @Override
    public void run() {
        // TODO check if already running?

        String query = Statements.getInstace().getSameAsSparqlQuery(relEntity);
        int limit = configuration.getSparqlInitialQueryLimit();
        int offset = 0;
        try {
            offset = getOffset();
        } catch (IOException e) {
            logger.error("File access error");
            e.printStackTrace();
            return;
        }

        // reflect the starting status
        endpointService.setStatusStarted(this.endpoint, relEntity);
        logger.info("START indexing on endpoint " + endpoint.getEndpointID() + " with predicate " + relEntity.getPredicate() + " offset=" + offset);

        // start querying the endpoint for the specified predicate
        // fallback on simple query if there is a error (e.g. subquerries not allowed)
        // but fallback should be considered only once --> fallback boolean
        boolean fallback = false;
        boolean finished = false;
        try {
            while(!finished) {
                try {

                    List<Triple> results = queryEndpoint(query, limit, offset);
                    dumpIndexedTriples(results);

                    // update query configuration for next iteration and persist them
                    offset  += results.size();
                    limit = results.size();
                    finished = results.size() == 0;

                } catch (Throwable e) {
                    // consider fallback only once. update query if this wasn't the fallback already
                    if(fallback) {
                        throw e;
                    } else {
                        logger.debug(this.endpoint.getEndpointID() + ": ERROR --> Fallback to simple query predicate " + relEntity.getPredicate());
                        query = Statements.getInstace().getSimpleSameAsSparqlQuery(relEntity);
                        fallback = true;
                    }
                }
            }

            // the stored dump file will be prepared for importing in database and made available for public download
            finalizeDump();
            endpointService.setStatusFinished(endpoint, relEntity);
            logger.info(this.endpoint.getEndpointID() + ": Indexing service CRAWLED - " + offset + " entries indexed with predicate " + relEntity.getPredicate());
        }  catch (Throwable e) {
            e.printStackTrace();
            // catch different exceptions to detect reconsideration or exclusion of endpoints
            handleQueryException(e, offset, limit);
        }
    }

    private void handleQueryException(Throwable e, int offset, int limit) {
        if(e instanceof UnknownHostException || e.getMessage() != null && (e.getMessage().contains("UnknownHostException") || e.getMessage().contains("Failed to connect to remote server"))) {
            // exclude endpoint if endpoint is not available
            endpointService.updateStatus(this.endpoint, relEntity, IndexingStatus.EXCLUDED, "endpoint not available");
            logger.error(this.endpoint.getEndpointID() + ": " + KEY_ENDPOINT + " unreachable. Exclude endpoint from indexing with predicate " + relEntity.getPredicate());

        } else if(e.getMessage() != null && e.getMessage().contains("Request forbidden")) {
            // exclude endpoint if endpoint is not public
            endpointService.updateStatus(this.endpoint, relEntity, IndexingStatus.EXCLUDED, "access forbidden");
            logger.error(this.endpoint.getEndpointID() + ": Access forbidden. Exclude endpoint from indexing with predicate " + relEntity.getPredicate());

        } else {
            // reconsider endpoint if any other error occurred
            endpointService.updateStatus(this.endpoint, relEntity, IndexingStatus.ERROR, e.getMessage());
            logger.error(this.endpoint.getEndpointID() + ": ERROR with predicate " + relEntity.getPredicate() + " Details: " + e.getClass() + " - " + e.getMessage());
        }
    }

    private List<Triple> queryEndpoint(String query, int limit, int offset) throws Exception {
        Stopwatch queryTimer = Stopwatch.createStarted();
        query += " LIMIT "  + limit;

        if(offset > 0 ) {
            query += " OFFSET " + offset;
        }

        logger.debug("Querying " + endpoint.getEndpointID() + ": " + query);

        List<Triple> results = new ArrayList<>();
        QueryEngineHTTP qeHTTP = (QueryEngineHTTP) QueryExecutionFactory.sparqlService(this.endpoint.getSparqlEndpoint(), query);
        qeHTTP.setTimeout(configuration.getSPARQLReadTimeout(), configuration.getSPARQLConnectTimeout());

        try {
            ResultSet rs = qeHTTP.execSelect();
            while(rs.hasNext()) {
                QuerySolution result = rs.next();

                if ( result.get("s") != null && result.get("s").isResource() && result.get("o") != null && result.get("o").isResource()) {
                    Triple item =  new Triple(this.endpoint, result.get("s").toString(), relEntity, result.get("o").toString());
                    results.add(item);
                }
            }

            qeHTTP.close();
            logger.info(this.endpoint.getEndpointID() + ": " + results.size() + " items retrieved => Total: " + offset + " (query duration: " + queryTimer.stop().elapsed(TimeUnit.MILLISECONDS) + " ms) predicate " + relEntity.getPredicate());

            return results;
        } catch (Exception e) {
            qeHTTP.abort();
            throw e;
        }
    }

    private void dumpIndexedTriples(List<Triple> results) throws IOException {
        Stopwatch storeTimer = Stopwatch.createStarted();

        if(results.size() > 0) {
            BufferedWriter writer  = new BufferedWriter(new FileWriter(file, true));

            try {
                for(Triple triple : results){
                    StringBuilder sb = new StringBuilder();
                    sb.append("<")
                            .append(triple.getSubject())
                            .append("> <")
                            .append(triple.getRelEntity().getPredicate())
                            .append("> <")
                            .append(triple.getObject())
                            .append(">.\n");
                    writer.append(sb.toString());
                }
            } finally {
                writer.flush();
                writer.close();
            }
        }

        logger.debug(this.endpoint.getEndpointID() + ": Intermediate result persisted (Size = " + results.size() + ") Continue query process" + " (save duration: " + storeTimer.stop().elapsed(TimeUnit.MILLISECONDS) + " ms) predicate " + relEntity.getPredicate());
    }


    private File getOrCreateDumpFile() throws IOException {
        // create file if it not already exists
        File dir = new File(configuration.getTripleDumpStoreDirectory());
        dir.mkdirs();
        File dumpFile = new File(dir, filename);
        boolean newFile = dumpFile.createNewFile();

        // adding header to new file
        if(newFile) {
            BufferedWriter writer  = new BufferedWriter(new FileWriter(dumpFile));
            try {
                SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd");
                writer.append("# ---------------------------------------------------------------------------------------------------------------------------\n");
                writer.append("# Triples indexed by Balloon Overflight (https://www.dimis.fim.uni-passau.de/balloon/)\n");
                writer.append("# " + KEY_ENDPOINT + ": ").append(endpoint.getEndpointID()).append("\n");
                writer.append("# URL: ").append(endpoint.getUrl()).append("\n");
                writer.append("# SPARQL: ").append(endpoint.getSparqlEndpoint()).append("\n");
                writer.append("# Information: http://datahub.io/dataset/").append(endpoint.getEndpointID()).append("\n");
                writer.append("# " + KEY_PREDICATE + ": ").append(relEntity.getPredicate()).append("\n");
                writer.append("# PredicateIdentifier: ").append(relEntity.getShortname()).append("\n");
                writer.append("# PredicateType: ").append(relEntity.getType().toString()).append("\n");
                writer.append("# " + KEY_DATE + ": ").append(dateFormat.format(new Date())).append("\n");
                writer.append("# ---------------------------------------------------------------------------------------------------------------------------\n");
                writer.append(BEGIN_DATA);
                writer.append("\n");
            } finally {
                writer.flush();
                writer.close();
            }
        }

        return dumpFile;
    }

    private void finalizeDump() throws IOException {
        // move file to import directory
        File importDir = new File(configuration.getDatabaseImportDirectory());
        File destination = new File(importDir, filename);
        importDir.mkdirs();
        file.renameTo(destination);

        // Zip the file
//            logger.debug("Compressing the dump for the sameAs-Statements of endpoint " + endpoint.getEndpointID());
//            // create a temporary file path but do not create a file
//            File tempZipFile = new File(System.getProperty("java.io.tmpdir") + UUID.randomUUID() + ".zip");
//
//            try {
//                ZipFile zip = new ZipFile(tempZipFile);
//                ZipParameters parameters = new ZipParameters();
//                parameters.setCompressionMethod(Zip4jConstants.COMP_DEFLATE);
//                parameters.setCompressionLevel(Zip4jConstants.DEFLATE_LEVEL_NORMAL);
//                parameters.setFileNameInZip(FILE_NAME_IN_ZIP);
//                parameters.setSourceExternalStream(true);
//                zip.createZipFile(file, parameters);
//
//                // upload zip file to ftp server
//                logger.debug("Upload compressed dump for the sameAs-Statements of endpoint " + endpoint.getEndpointID());
//                FileSystemManager fsManager = VFS.getManager();
//                FileSystemOptions opts = new FileSystemOptions();
//                FtpFileSystemConfigBuilder.getInstance().setPassiveMode(opts, true);
//
//                FileObject sourceFile = null;
//                FileObject destinationFile = null;
//                try {
//                    sourceFile = fsManager.toFileObject(zip.getFile());
//                    String destinationPath = FTP_CONNECTION + endpoint.getEndpointID() + "_" + dateString + "_" + System.currentTimeMillis() + ".zip";
//                    destinationFile = fsManager.resolveFile(destinationPath, opts);
//                    destinationFile.copyFrom(sourceFile, new AllFileSelector());
//                } finally {
//                    sourceFile.close();
//                    destinationFile.close();
//                }
//
//            } finally {
//                if (tempZipFile.exists()) {
//                    tempZipFile.delete();
//                }
//            }
    }

    private int getOffset() throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(file));
        int tripleCount = 0;
        String line;

        while ((line = reader.readLine()) != null) {
            if(!line.trim().startsWith(DUMP_COMMENT_PREFIX)){
                tripleCount++;
            }
        }

        reader.close();
        return tripleCount;
    }
}