package org.balloon_project.overflight.endpoints;

import org.balloon_project.overflight.model.Endpoint;
import org.balloon_project.overflight.task.endpointSource.CKANLoader;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"/applicationContext.xml"})
public class CKANLoaderTest {

    @Autowired
    CKANLoader ckanLoader;

    @Test
    public void testLoadEndpoints() throws Exception {
        // some endpoints should be retrieved
        List<Endpoint> endpoints = ckanLoader.loadEndpoints();
        Assert.assertTrue(endpoints.size() > 0);

        // dbpedia should be retrieved
        Endpoint dbpedia = null;
        for(Endpoint endpoint : endpoints) {
            if("dbpedia".equals(endpoint.getEndpointID())) {
                dbpedia = endpoint;
                break;
            }
        }

        Assert.assertNotNull(dbpedia);
    }
}
