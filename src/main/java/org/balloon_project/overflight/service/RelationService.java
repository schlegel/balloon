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

import com.google.common.base.Stopwatch;
import com.google.common.collect.Lists;
import com.hp.hpl.jena.reasoner.IllegalParameterException;
import org.balloon_project.overflight.TripleBlacklist;
import org.balloon_project.overflight.model.*;
import org.balloon_project.overflight.repository.RessourceRepository;
import org.neo4j.graphdb.Node;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.core.GraphDatabase;
import org.springframework.data.neo4j.support.Neo4jTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class RelationService {

    private Logger logger = LoggerFactory.getLogger(RelationService.class);

    @Autowired
    private RessourceRepository ressourceRepository;

    @Transactional
    public void save (List<Triple> triples) {
        Stopwatch watchComplete = Stopwatch.createStarted();
        logger.info(triples.size() + " triples to persist");

        for(Triple triple : triples) {
            save(triple);
        }
        long miliseconds =  watchComplete.stop().elapsed(TimeUnit.MILLISECONDS);

        if(triples.size() != 0) {
            logger.info(triples.size() + " relations persisted. (Duration: " + miliseconds + "ms => " + (miliseconds/triples.size()) + " ms/triple)");
        }
    }

    @Transactional
    public RessourceRelation save(Triple triple) {

        if(triple.getSubject().equals(triple.getObject())) {
            return null;
        }

        if(TripleBlacklist.isBlackListed(triple)) {
            logger.debug("Skipped " + triple.toString() +  " because it's blacklisted");
            return null;
        }

        RelEntity relEntity = triple.getRelEntity();
        if(relEntity.getType().equals(RelType.INSTANCE)) {
            return ressourceRepository.createOrGetInstanceRel(triple.getSubject(), triple.getObject(), triple.getEndpoint().getEndpointID(), triple.getRelEntity().getPredicate());
        } else if(relEntity.getType().equals(RelType.EQUIVALENCE)) {
            return ressourceRepository.createOrGetEquivalenceRel(triple.getSubject(), triple.getObject(), triple.getEndpoint().getEndpointID(), triple.getRelEntity().getPredicate());
        } else if(relEntity.getType().equals(RelType.INHERITANCE)) {
            return ressourceRepository.createOrGetInheritanceRel(triple.getSubject(), triple.getObject(), triple.getEndpoint().getEndpointID(), triple.getRelEntity().getPredicate());
        } else {
            throw new IllegalParameterException("RelType not implemented: " + relEntity.getType());
        }
    }

    @Transactional
    public List<RessourceRelation> findClusterRelations (String url) {
        Iterable<RessourceRelation> results = ressourceRepository.findClusterRelations(url);
        return Lists.newArrayList(results);
    }
}