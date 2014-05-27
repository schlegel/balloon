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

package org.balloon_project.overflight.task.endpointSource;


import com.google.common.base.Stopwatch;
import com.google.gson.Gson;
import org.balloon_project.overflight.model.Endpoint;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * This class is responsible for endpoint loading from the datahub.io database
 */
@Component
@Scope(value = "singleton")
public class CKANLoader {

    public static final String DATAHUB_QUERY_LODCLOUD = "http://datahub.io/api/3/action/package_search?rows=1000&q=organization:lodcloud";
    public static final String DATAHUB_QUERY_LOD = "http://datahub.io/api/3/action/package_search?rows=1000&q=organization:lod";
    public static final String DATAHUB_FORMAT_SPARQL = "api/sparql";
    public static final String DATAHUB_RESOURCE_NAMESPACE = "namespace";

    private Logger logger = LoggerFactory.getLogger(CKANLoader.class);

    /**
     * Loads all Linked Open Data endpoints from Datahub.io which offer a SPARQL endpoint
     * @return List of Linked Open Data SPARQL endpoints
     */
    public List<Endpoint> loadEndpoints() throws IOException {
        logger.info("CKAN endpoint loading started");
        Stopwatch timer = Stopwatch.createStarted();

        List<Endpoint> result = new LinkedList<>();
        result.addAll(queryCKAN(DATAHUB_QUERY_LODCLOUD));
        result.addAll(queryCKAN(DATAHUB_QUERY_LOD));

        logger.info(result.size() + " CKAN endpoints loaded. (Duration: " + timer.stop().elapsed(TimeUnit.SECONDS) + "s)");

        return result;
    }

    private List<Endpoint> queryCKAN(String url) throws IOException {
        List<Endpoint> result = new LinkedList<>();
        Gson gson = new Gson();
        ClientResource datahubQuery = new ClientResource(url);
        Representation datahubRepresentation = datahubQuery.get();

        if (datahubQuery.getStatus().isSuccess()) {
            DatahubReponse datahubReponse = gson.fromJson(datahubRepresentation.getText(), DatahubReponse.class);

            // navigate the entry to get all endpoints which offer a sparql endpoint
            if(datahubReponse != null) {
                ResultEntry resultEntry = datahubReponse.getResult();
                if(resultEntry != null) {
                    List<EndpointEntry> endpointEntries = resultEntry.getResults();
                    if(endpointEntries !=null) {
                        for(EndpointEntry endpointEntry : endpointEntries) {
                            List<ResourceEntry> resourceEntries = endpointEntry.getResources();
                            if(resourceEntries != null) {
                                for(ResourceEntry resourceEntry : resourceEntries) {
                                    if(DATAHUB_FORMAT_SPARQL.equals(resourceEntry.getFormat())) {
                                        Endpoint endpoint = new Endpoint();
                                        endpoint.setEndpointID(endpointEntry.getName());
                                        endpoint.setTitle(endpointEntry.getTitle());
                                        endpoint.setUrl(endpointEntry.getUrl());
                                        endpoint.setSparqlEndpoint(resourceEntry.getUrl());

                                        // search for resource namespace
                                        List<ExtraEntry> extrasEntries = endpointEntry.getExtras();
                                        if(extrasEntries != null) {
                                            for(ExtraEntry extraEntry : extrasEntries) {
                                                if(DATAHUB_RESOURCE_NAMESPACE.equals(extraEntry.getKey())) {
                                                    endpoint.setNamespace(extraEntry.getValue());
                                                    break;
                                                }
                                            }
                                        }

                                        result.add(endpoint);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return result;
    }

    /**
     * GSON Bean for response deserialization
     */
    private class DatahubReponse {
        private ResultEntry result;

        private DatahubReponse() {
        }

        public ResultEntry getResult() {
            return result;
        }

        public void setResult(ResultEntry result) {
            this.result = result;
        }


    }

    /**
     * GSON Bean for response deserialization
     */
    private class ResultEntry {
        private List<EndpointEntry> results;

        private ResultEntry() {
        }

        public List<EndpointEntry> getResults() {
            return results;
        }

        public void setResults(List<EndpointEntry> results) {
            this.results = results;
        }
    }

    /**
     * GSON Bean for response deserialization
     */
    private class EndpointEntry {
        private List<ResourceEntry> resources;
        private List<ExtraEntry> extras;
        private String title;
        private String name;
        private String url;

        private EndpointEntry() {

        }

        public List<ResourceEntry> getResources() {
            return resources;
        }

        public void setResources(List<ResourceEntry> resources) {
            this.resources = resources;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public List<ExtraEntry> getExtras() { return extras; }

        public void setExtras(List<ExtraEntry> extras) { this.extras = extras; }
    }

    /**
     * GSON Bean for response deserialization
     */
    private class ResourceEntry {
        private String format;
        private String url;

        private ResourceEntry() {
        }

        public String getFormat() {
            return format;
        }

        public void setFormat(String format) {
            this.format = format;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

    /**
     * GSON Bean for response deserialization
     */
    private class ExtraEntry {
        private String key;
        private String value;

        private ExtraEntry() {
        }

        public String getKey() { return key; }

        public void setKey(String key) { this.key = key; }

        public String getValue() { return value; }

        public void setValue(String value) { this.value = value; }
    }
}