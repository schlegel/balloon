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

import org.balloon_project.overflight.model.Endpoint;
import org.balloon_project.overflight.model.RelEntity;
import org.balloon_project.overflight.model.RessourceRelation;
import org.balloon_project.overflight.model.Triple;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"/applicationContext.xml"})
public class RelationServiceTest {

    @Autowired
    private EndpointService endpointService;
    @Autowired
    private RelationService relationService;
    @Autowired
    private RessourceService ressourceService;

    @Test
    public void insertSameTriple() {
        Endpoint endpoint = new Endpoint("endpointID", "title" , "url" , "sparqlEndpoint" , "namespace" );
        endpoint = endpointService.save(endpoint);

        String subjectName = "subject" + System.currentTimeMillis();
        String objectName = "object" + System.currentTimeMillis();

        Triple triple = new Triple();
        triple.setDate(new Date());
        triple.setSubject(subjectName);
        triple.setObject(objectName);
        triple.setRelEntity(RelEntity.OWL_SAMEAS);
        triple.setEndpoint(endpoint);
        RessourceRelation relation =  relationService.save(triple);
        RessourceRelation relation2 =  relationService.save(triple);

        Assert.assertEquals(relation.getId(), relation2.getId());
        Assert.assertEquals(subjectName, relation.getSource().getUrl());
        Assert.assertEquals(objectName, relation.getTarget().getUrl());
        Assert.assertEquals(RelEntity.OWL_SAMEAS.getPredicate(), relation.getPredicate());
    }

    public void insertSameTripleFromDifferentEndpoints() {
        Endpoint endpoint = new Endpoint("endpointID", "title" , "url" , "sparqlEndpoint" , "namespace" );
        endpoint = endpointService.save(endpoint);

        Endpoint endpoint2 = new Endpoint("endpointID2", "title" , "url" , "sparqlEndpoint" , "namespace" );
        endpoint2 = endpointService.save(endpoint2);

        String subjectName = "subject" + System.currentTimeMillis();
        String objectName = "object" + System.currentTimeMillis();

        Triple triple = new Triple();
        triple.setDate(new Date());
        triple.setSubject(subjectName);
        triple.setObject(objectName);
        triple.setRelEntity(RelEntity.OWL_SAMEAS);
        triple.setEndpoint(endpoint);
        RessourceRelation relation =  relationService.save(triple);

        Triple triple2 = new Triple();
        triple2.setDate(new Date());
        triple2.setSubject(subjectName);
        triple2.setObject(objectName);
        triple2.setRelEntity(RelEntity.OWL_SAMEAS);
        triple2.setEndpoint(endpoint2);
        RessourceRelation relation2 =  relationService.save(triple);

        Assert.assertNotSame(relation.getId(), relation2.getId());
        Assert.assertNotSame(relation.getOrigin(), relation2.getOrigin());

        Assert.assertEquals(relation.getPredicate(), relation2.getPredicate());
    }

    @Test
    public void insertSameSubject() throws Exception {
        long numberOfRessourcesBefore = ressourceService.getNumberOfDifferentRessources();

        String subjectName = "subject" + System.currentTimeMillis();
        String object1Name = "object" + System.currentTimeMillis();
        String object2Name = object1Name + "ob2";

        Endpoint endpoint = new Endpoint("endpointID", "title" , "url" , "sparqlEndpoint" , "namespace" );
        endpoint = endpointService.save(endpoint);

        Triple triple = new Triple();
        triple.setDate(new Date());
        triple.setSubject(subjectName);
        triple.setObject(object1Name);
        triple.setRelEntity(RelEntity.OWL_SAMEAS);
        triple.setEndpoint(endpoint);
        relationService.save(triple);


        Assert.assertEquals(numberOfRessourcesBefore + 2, ressourceService.getNumberOfDifferentRessources());

        Triple triple2 = new Triple();
        triple2.setDate(new Date());
        triple2.setSubject(subjectName);
        triple2.setObject(object2Name);
        triple2.setRelEntity(RelEntity.OWL_SAMEAS);
        triple2.setEndpoint(endpoint);
        relationService.save(triple2);

        // subject is already in the databse. duplicates are not allowed. only one new ressource
        Assert.assertEquals(numberOfRessourcesBefore + 3, ressourceService.getNumberOfDifferentRessources());
    }
}
