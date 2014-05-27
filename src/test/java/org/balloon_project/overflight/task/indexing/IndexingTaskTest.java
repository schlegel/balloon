package org.balloon_project.overflight.task.indexing;

import org.balloon_project.overflight.model.Endpoint;
import org.balloon_project.overflight.service.EndpointService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"/applicationContext.xml"})
public class IndexingTaskTest {
    public static final String ENDPOINT_ID = "austrian_ski_racers";
    public static final String ENDPOINT_TITLE = "Austrian Ski Racers";
    public static final String ENDPOINT_URL = "http://vocabulary.semantic-web.at/AustrianSkiTeam";
    public static final String ENDPOINT_SPARQL = "http://vocabulary.semantic-web.at/PoolParty/sparql/AustrianSkiTeam";
    public static final String ENDPOINT_NAMESPACE = "http://vocabulary.semantic-web.at/AustrianSkiTeam/";

    @Autowired
    EndpointService endpointService;

    @Autowired
    Indexing indexing;

    @Test
    public void testRun() throws Exception {
        String id = ENDPOINT_ID + System.currentTimeMillis();

        Endpoint endpoint = new Endpoint(id, ENDPOINT_TITLE, ENDPOINT_URL, ENDPOINT_SPARQL, ENDPOINT_NAMESPACE);
        endpoint = endpointService.save(endpoint);

        indexing.startIndexing(endpoint);
        indexing.waitUntilFinished();
    }
}
