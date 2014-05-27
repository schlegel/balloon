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

package org.balloon_project.overflight.service;

import com.google.common.collect.Lists;
import org.balloon_project.overflight.model.Endpoint;
import org.balloon_project.overflight.model.RelEntity;
import org.balloon_project.overflight.repository.EndpointRepository;
import org.balloon_project.overflight.task.endpointSource.CKANLoader;
import org.balloon_project.overflight.task.indexing.IndexingStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

@Service
@Transactional
public class EndpointService {

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    private EndpointRepository repository;

    @Autowired
    private CKANLoader ckanLoader;

    private Logger logger = LoggerFactory.getLogger(EndpointService.class);

    public Endpoint save(Endpoint item) {
       return repository.save(item);
    }

    public void save(List<Endpoint> items) {
        repository.save(items);
    }

    public void loadAndSaveCKANEndpoints() {
        List<Endpoint> endpoints = null;
        try {
            endpoints = ckanLoader.loadEndpoints();
            repository.save(endpoints);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<Endpoint> getAll() {
        ArrayList < Endpoint > result = Lists.newArrayList(repository.gettAll().iterator());
        return result;
    }

    public Endpoint getByEndpointID(String endpointID) {
        return repository.get(endpointID);
    }

    public void updateSPARQLEndpoint(Endpoint endpoint, String redirectLocation) {
        Endpoint freshEndpoint = repository.findOne(endpoint.getId());

        if(freshEndpoint != null) {
            freshEndpoint.setSparqlEndpoint(redirectLocation);
            endpoint.setSparqlEndpoint(redirectLocation);
            repository.save(freshEndpoint);
        }
    }

    public void updateStatus(Endpoint endpoint, RelEntity relEntity, IndexingStatus status, String message) {
        setProperty(endpoint.getEndpointID(), "states-" + relEntity, status.name());
        setProperty(endpoint.getEndpointID(), "messages-" + relEntity, message);

        Endpoint freshEndpoint = repository.findOne(endpoint.getId());
        endpoint.setStates(freshEndpoint.getStates());
        endpoint.setMessages(freshEndpoint.getMessages());
    }

    public void initIndexing(Endpoint endpoint) {
        Endpoint freshEndpoint = repository.findOne(endpoint.getId());

        Date date = new Date();
        freshEndpoint.setStarted(date);
        endpoint.setStarted(date);

        repository.save(freshEndpoint);
    }

    public void initIndexing(Endpoint endpoint, RelEntity relEntity) {
        setProperty(endpoint.getEndpointID(), "states-" + relEntity, IndexingStatus.SCHEDULED.name());

        Endpoint freshEndpoint = repository.findOne(endpoint.getId());
        endpoint.setStates(freshEndpoint.getStates());
    }

    public void setStatusStarted(Endpoint endpoint, RelEntity relEntity) {
        setProperty(endpoint.getEndpointID(), "states-" + relEntity, IndexingStatus.PROCESSING.name());

        Endpoint freshEndpoint = repository.findOne(endpoint.getId());
        endpoint.setStates(freshEndpoint.getStates());
    }

    public void setStatusFinished(Endpoint endpoint, RelEntity relEntity) {
        setProperty(endpoint.getEndpointID(), "states-" + relEntity, IndexingStatus.CRAWLED.name());

        Endpoint freshEndpoint = repository.findOne(endpoint.getId());
        endpoint.setStates(freshEndpoint.getStates());
    }

    private void setProperty(String endpointID, String property, String value) {
        Map<String, Object> params = new HashMap<>();
        params.put("endpointID", endpointID);
        params.put("value", value);

        repository.query("MATCH (n:ENDPOINT {endpointID: {endpointID}}) SET n.`" + property + "` = {value}", params);
    }

    public Endpoint findOrigin(String url) {
        // TODO reimplement
        Endpoint result = null;

        try {
            URL concept = new URL(url);
            String urlString = concept.getHost() + concept.getPath();

            // to find a suitable endpoint by the namespace, strip a "slash-fragment" e.g. http://dbpedia.org/resource/Indonesia --> http://dbpedia.org/resource
            // some endpoints have the same url prefix e.g. http://www4.wiwiss.fu-berlin.de/factbook/resource/ and http://www4.wiwiss.fu-berlin.de/dailymed/resource/
            // endpoint namespaces can even be more abstract like http://enipedia.tudelft.nl and a concept is http://enipedia.tudelft.nl/wiki/Indonesia.
            // Hence, the stripping should be looped.
            // difficult e.g. http://openei.org/resources/Indonesia  -->  http://en.openei.org/

            do {
                int lastIndexofSlash = urlString.lastIndexOf("/");
                if(lastIndexofSlash != -1) {
                    urlString = urlString.substring(0, lastIndexofSlash);
                    // TODO find endpoint with suitable namespace --> build offline map of namespace to endpoint id
                    // TODO cache endpoint id if namepsace was found
                    //Query query = Query.query(Criteria.where("ns").regex(concept.getProtocol() + PROTOCOL_DIVIDER + urlString +".*","i"));
                    //result = mongo.findOne(query, Endpoint.class, COLLECTION);
                }
            }   while (result == null && urlString.lastIndexOf("/") != -1);

            // if no result was found, maybe the subdomain is wrong
            if(result == null) {
                urlString = concept.getHost() + concept.getPath();
                do {
                    int lastIndexofSlash = urlString.lastIndexOf("/");
                    if(lastIndexofSlash != -1) {
                        urlString = urlString.substring(0, lastIndexofSlash);
                        // TODO implement
                        // Query query = Query.query(Criteria.where("ns").regex(concept.getProtocol() + PROTOCOL_DIVIDER + ".*" + urlString +".*","i"));
                        // result = mongo.findOne(query, Endpoint.class, COLLECTION);
                    }
                }   while (result == null && urlString.lastIndexOf("/") != -1);
            }

        // TODO extend to query datahub.io
        } catch (MalformedURLException e) {
           return null;
        }

        if(result == null) {
            logger.debug("No endpoint found for URL=" + url);
        } else {
            logger.debug("Endpoints found for URL=" + url + " --> " + result.getEndpointID());
        }
       return result;
    }
}