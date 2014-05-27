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

package org.balloon_project.overflight.task.importer;

import org.balloon_project.Configuration;
import org.balloon_project.overflight.model.Endpoint;
import org.balloon_project.overflight.model.RelEntity;
import org.balloon_project.overflight.model.Triple;
import org.balloon_project.overflight.service.EndpointService;
import org.balloon_project.overflight.service.RelationService;
import org.balloon_project.overflight.task.indexing.IndexingTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ImporterTask implements Runnable {
    private static Logger logger = LoggerFactory.getLogger(ImporterTask.class);
    private File importFile;

    @Autowired
    private RelationService relationService;

    @Autowired
    private EndpointService endpointService;

    @Autowired
    Configuration configuration;

    public void init (File importFile) {
        this.importFile = importFile;
    }

    @Override
    public void run() {
      if (importFile.exists() && importFile.isFile()) {
          try (FileReader fr = new FileReader(importFile);
              BufferedReader br = new BufferedReader(fr);){

              String line;
              boolean metadata_flag = true;
              // check if line contains a parameter in key/value style
              Pattern keyValue = Pattern.compile("^#\\s(.+?):\\s(.*)$");
              Map<String, String> metadataMap = new HashMap<>();
              Provenance provenance = null;
              LinkedList<Triple> bulk = new LinkedList<>();
              int counter = 0;

              // starte reading the file
              while((line = br.readLine()) != null) {
                  line = line.trim();

                  // first get the metadata header for triple provenance
                  if(metadata_flag) {
                      // switch to data mode if the command appears and create provenance object
                      if(line.startsWith(IndexingTask.BEGIN_DATA)) {
                          metadata_flag = false;
                          provenance = extractProvenance(metadataMap);

                          continue;
                      } else {
                          // extract key value pairs from each line of the metadata
                          Matcher m = keyValue.matcher(line);

                          if(m.find()) {
                             metadataMap.put(m.group(1).trim(), m.group(2).trim());
                          }
                      }
                  } else {
                      // extract triple from each line
                      Triple triple = extractAndSaveTriple(line, provenance);

                      if(triple != null) {
                          bulk.add(triple);
                          counter++;
                      }

                      // only save the triples if bulk size is reached
                      bulksave(bulk, false);
                  }
              }

              // definitely save all remaining bulk items
              bulksave(bulk, true);
// TODO save date of imported triples        endpointService.setImported(provenance.getEndpoint(), provenance.getDate());
              moveToImported();

              logger.info("Importing finished for endpoint " + provenance.getEndpoint().getId() + ". Triples =" +  counter);

          } catch (IOException e) {
              e.printStackTrace();
          }
      }
    }

    private void moveToImported() {
        // move file to imported directory
        File importedDir = new File(configuration.getDatabaseImportedDirectory());
        File destination = new File(importedDir, importFile.getName());
        importedDir.mkdirs();
        importFile.renameTo(destination);
    }

    private void bulksave(List<Triple> bulk, boolean force) {
        if(force || (bulk.size() >= configuration.getTripleBulkInsertSize())) {
            relationService.save(bulk);
            bulk.clear();
        }
    }

    private Triple extractAndSaveTriple(String line, Provenance provenance) {
        Pattern triplePattern = Pattern.compile("^<(.+?)> <(.+?)> <(.+?)>\\.$");
        Matcher m = triplePattern.matcher(line);
        Triple triple = null;

        if(m.find()) {
            triple = new Triple(provenance.getEndpoint(), m.group(1), provenance.getRelEntity(), m.group(3), provenance.getDate());
        }

        return triple;
    }

    private Provenance extractProvenance(Map<String, String> metatadaMap) {
        Provenance provenance = null;
        if (metatadaMap.containsKey(IndexingTask.KEY_ENDPOINT) && metatadaMap.containsKey(IndexingTask.KEY_PREDICATE) && metatadaMap.containsKey(IndexingTask.KEY_DATE)) {
            try {
                String endpointID = metatadaMap.get(IndexingTask.KEY_ENDPOINT).trim();
                Endpoint endpoint = endpointService.getByEndpointID(endpointID);

                if(endpoint == null) {
                    throw new IllegalStateException("Endpoint unknown");
                }

                Date importdate = new SimpleDateFormat("yyyy-MM-dd").parse(metatadaMap.get(IndexingTask.KEY_DATE).trim());
                String predicateString = metatadaMap.get(IndexingTask.KEY_PREDICATE).trim();

                for(RelEntity relEntity : RelEntity.values()) {
                    if(relEntity.getPredicate().equals(predicateString)) {
                        provenance = new Provenance(endpoint, relEntity, importdate);
                    }
                }
            } catch (ParseException e) {
                throw new IllegalStateException("Illegal Date Format");
            }
        } else {
            throw new IllegalStateException("Couldn't extract metadata");
        }

        if (provenance != null) {
            return provenance;
        } else {
            throw new IllegalStateException("Couldn't extract metadata");
        }
    }

    private class Provenance {
        private Endpoint endpoint;
        private RelEntity relEntity;
        private Date date;

        private Provenance(Endpoint endpoint, RelEntity relEntity, Date date) {
            this.endpoint = endpoint;
            this.relEntity = relEntity;
            this.date = date;
        }

        public Endpoint getEndpoint() {
            return endpoint;
        }

        public RelEntity getRelEntity() {
            return relEntity;
        }

        public Date getDate() {
            return date;
        }

        @Override
        public String toString() {
            return "Provenance{" +
                    "endpoint=" + endpoint +
                    ", relEntity=" + relEntity +
                    ", date=" + date +
                    '}';
        }
    }
}