package org.balloon_project.overflight.service;

import org.balloon_project.overflight.model.Endpoint;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"/applicationContext.xml"})
public class EndpointServiceTest {
    private static final String ENDPOINT_ID = "austrian_ski_racers";
    private static final String ENDPOINT_TITLE = "Austrian Ski Racers";
    private static final String ENDPOINT_URL = "http://vocabulary.semantic-web.at/AustrianSkiTeam";
    private static final String ENDPOINT_SPARQL = "http://vocabulary.semantic-web.at/PoolParty/sparql/AustrianSkiTeam";
    private static final String ENDPOINT_NAMESPACE = "http://vocabulary.semantic-web.at/AustrianSkiTeam/";

    @Autowired
    private EndpointService endpointService;

    @Test
    public void testSave() throws Exception {
        String id = ENDPOINT_ID + System.currentTimeMillis();

        Endpoint endpoint = new Endpoint(id, ENDPOINT_TITLE, ENDPOINT_URL, ENDPOINT_SPARQL, ENDPOINT_NAMESPACE);
        endpointService.save(endpoint);

        Endpoint loadedEndpoint = endpointService.getByEndpointID(id);

        Assert.assertNotNull(loadedEndpoint);
        Assert.assertEquals(endpoint.getEndpointID(), loadedEndpoint.getEndpointID());
        Assert.assertEquals(endpoint.getTitle(), loadedEndpoint.getTitle());
        Assert.assertEquals(endpoint.getUrl(), loadedEndpoint.getUrl());
        Assert.assertEquals(endpoint.getSparqlEndpoint(), loadedEndpoint.getSparqlEndpoint());
    }

    @Test
    public void testGetAll() throws Exception {
        int origSize = endpointService.getAll().size();
        System.out.println(origSize);
        Endpoint endpoint = new Endpoint(ENDPOINT_ID + System.currentTimeMillis() , ENDPOINT_TITLE, ENDPOINT_URL, ENDPOINT_SPARQL, ENDPOINT_NAMESPACE);
        endpointService.save(endpoint);
        System.out.println(endpointService.getAll().size());

        Assert.assertEquals(origSize + 1, endpointService.getAll().size());
    }
}
