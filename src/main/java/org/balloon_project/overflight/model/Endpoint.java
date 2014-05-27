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

package org.balloon_project.overflight.model;

import org.balloon_project.overflight.task.indexing.IndexingStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.neo4j.annotation.GraphId;
import org.springframework.data.neo4j.annotation.NodeEntity;
import org.springframework.data.neo4j.fieldaccess.DynamicProperties;
import org.springframework.data.neo4j.fieldaccess.DynamicPropertiesContainer;

import java.util.*;

@NodeEntity
@TypeAlias(value = Endpoint.TYPE)
public class Endpoint {

    public static final String TYPE = "ENDPOINT";

    @GraphId
    private Long id;

    // datahub information
//    @Indexed(unique = true, indexName = "searchByEndpointID" )
    private String endpointID;
    private String title;
    private String url;
    private String sparqlEndpoint;
//    @Indexed(indexType = IndexType.FULLTEXT, indexName = "searchByNamespace")
    private String namespace;

    // custom information
    private Date added = new Date();
    private String message;
    private Date lastUpdated;

    // index information
    private Date started = null;
    private DynamicProperties messages = new DynamicPropertiesContainer();
    private DynamicProperties states = new DynamicPropertiesContainer();

    @Transient
    private final Logger logger = LoggerFactory.getLogger(Endpoint.class);

    public Endpoint() {
    }

    public Endpoint(String endpointID, String title, String url, String sparqlEndpoint, String namespace) {
        if(endpointID != null) {
            this.endpointID = endpointID.trim();
        }

        if(title != null) {
            this.title = title.trim();
        }

        if(url != null) {
            this.url = url.trim();
        }

        if(sparqlEndpoint != null) {
            this.sparqlEndpoint = sparqlEndpoint.trim();
        }

        if(namespace != null) {
            this.namespace = namespace.trim();
        }
    }

    public boolean allFinished() {
        boolean finished = true;

        Map<String, Object> map = this.states.asMap();

        for(String key : map.keySet()) {
            IndexingStatus value = IndexingStatus.valueOf((String) map.get(key));
            finished = finished && (IndexingStatus.CRAWLED.equals(value) || IndexingStatus.EXCLUDED.equals(value)  || IndexingStatus.ERROR.equals(value));
        }

        return finished;
    }

    public void setState(RelEntity relEntity, IndexingStatus status) {
        states.setProperty(relEntity.getShortname(), status.name());
    }

    public void setMessage(RelEntity relEntity, String message) {
        messages.setProperty(relEntity.getShortname(), message);
    }

    public IndexingStatus getStatus() {
        Map<String, Object> statesMap = states.asMap();

        Set<IndexingStatus> stateSet = new HashSet<IndexingStatus>();
        for(String key : statesMap.keySet()) {
            IndexingStatus value = IndexingStatus.valueOf((String) statesMap.get(key));
            stateSet.add(value);
        }

        if(stateSet.contains(IndexingStatus.PROCESSING)) return IndexingStatus.PROCESSING;
        if(stateSet.contains(IndexingStatus.SCHEDULED)) return IndexingStatus.SCHEDULED;
        if(stateSet.contains(IndexingStatus.ERROR)) return IndexingStatus.ERROR;
        if(stateSet.contains(IndexingStatus.EXCLUDED)) return IndexingStatus.EXCLUDED;
        if(stateSet.contains(IndexingStatus.CRAWLED)) return IndexingStatus.CRAWLED;
        if(stateSet.contains(IndexingStatus.INDEXED)) return IndexingStatus.INDEXED;

        return IndexingStatus.NEW;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEndpointID() {
        return endpointID;
    }

    public void setEndpointID(String endpointID) {
        this.endpointID = endpointID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSparqlEndpoint() {
        return sparqlEndpoint;
    }

    public void setSparqlEndpoint(String sparqlEndpoint) {
        this.sparqlEndpoint = sparqlEndpoint;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public Date getAdded() {
        return added;
    }

    public void setAdded(Date added) {
        this.added = added;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getStarted() {
        return started;
    }

    public void setStarted(Date started) {
        this.started = started;
    }

    public DynamicProperties getMessages() {
        return messages;
    }

    public void setMessages(DynamicProperties messages) {
        this.messages = messages;
    }

    public DynamicProperties getStates() {
        return states;
    }

    public void setStates(DynamicProperties states) {
        this.states = states;
    }

    public void removeTemporaryFields() {
        this.messages = new DynamicPropertiesContainer();
        this.states = new DynamicPropertiesContainer();
    }

    @Override
    public String toString() {
        return "Endpoint{" +
                "states=" + states +
                ", id=" + id +
                ", endpointID='" + endpointID + '\'' +
                ", title='" + title + '\'' +
                ", url='" + url + '\'' +
                ", sparqlEndpoint='" + sparqlEndpoint + '\'' +
                ", namespace='" + namespace + '\'' +
                ", added=" + added +
                ", message='" + message + '\'' +
                ", lastUpdated=" + lastUpdated +
                ", started=" + started +
                ", messages=" + messages +
                '}';
    }
}