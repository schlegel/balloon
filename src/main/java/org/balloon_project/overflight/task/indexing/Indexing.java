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


import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;
import org.balloon_project.overflight.model.Endpoint;
import org.balloon_project.overflight.model.RelEntity;
import org.balloon_project.overflight.service.EndpointService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

public abstract class Indexing {

    @Autowired
    private EndpointService endpointService;

    @Resource(name = "indexingThreadPool")
    private  ExecutorService executorPool;
    private  Logger logger = LoggerFactory.getLogger(Indexing.class);

    private final static String CHECK_QUERY = "PREFIX  owl:  <http://www.w3.org/2002/07/owl#> SELECT  ?s ?o WHERE { { SELECT DISTINCT  ?s ?o WHERE { ?s owl:sameAs ?o } ORDER BY ASC(?s) }} LIMIT 1";

    public Indexing() {
    }

    protected abstract IndexingTask createIndexingTask();

    public void startIndexing(Endpoint endpoint) {
        checkEndpoint(endpoint);

        endpointService.initIndexing(endpoint);

        for(RelEntity relEntity : RelEntity.values()) {
            IndexingTask indexingTask = createIndexingTask();
            indexingTask.init(endpoint, relEntity);

            endpointService.initIndexing(endpoint, relEntity);
            logger.info(endpoint.getEndpointID() + ": Indexing task scheduled with predicate " + relEntity.getPredicate());
            executorPool.execute(indexingTask);
        }
    }

    private void checkEndpoint(Endpoint endpoint) {
        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
        nameValuePairs.add(new BasicNameValuePair("query", CHECK_QUERY));
        String entities = URLEncodedUtils.format(nameValuePairs, "UTF-8");

        // endpoint has to end with '/'
        String url = endpoint.getSparqlEndpoint();

        if (url.endsWith("/")) {
            url += "?" + entities;
        } else {
            url += "/?" + entities;
        }

        DefaultHttpClient httpClient = new DefaultHttpClient();
        httpClient.getParams().setParameter("http.socket.timeout", 10000);

        HttpGet getRequest = new HttpGet(url);

        HttpParams params = new BasicHttpParams().setParameter("http.protocol.handle-redirects", false);
        getRequest.setParams(params);
        getRequest.addHeader("accept", "application/sparql-results+xml");
        getRequest.addHeader("accept-encoding", "gzip, deflate");

        try {
            HttpResponse response = httpClient.execute(getRequest);

            // moved permanently
            if (response.getStatusLine().getStatusCode() == 301) {
                Header locationHeader = response.getFirstHeader("location");
                if (locationHeader != null) {
                    String redirectLocation = locationHeader.getValue().split("\\?query")[0];
                    logger.debug(endpoint.getEndpointID() + ": SPARQL Endpoint unreachable. Moved permanently to " + redirectLocation);

                    endpoint.setSparqlEndpoint(redirectLocation);
                    endpointService.updateSPARQLEndpoint(endpoint, redirectLocation);
                }
            }
        } catch (IOException e) {
            // don't react on exception, because this is only a check for HTTP moved endpoints
        }
    }

    public void waitUntilFinished(){
        executorPool.shutdown();
        try {
            executorPool.awaitTermination(60, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}