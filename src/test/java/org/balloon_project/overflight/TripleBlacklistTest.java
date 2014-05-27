package org.balloon_project.overflight;

import junit.framework.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"/applicationContext.xml"})
public class TripleBlacklistTest {

    @Test
    public void testIsBlackListed() throws Exception {
        Assert.assertFalse(TripleBlacklist.isBlackListed("http://www.dbpedia.org/ressource/Test"));

        Assert.assertTrue(TripleBlacklist.isBlackListed("http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement"));
        Assert.assertTrue(TripleBlacklist.isBlackListed("http://www.w3.org/2002/07/owl#sameAs"));
        Assert.assertTrue(TripleBlacklist.isBlackListed("http://www.w3.org/2000/01/rdf-schema#Class"));
        Assert.assertTrue(TripleBlacklist.isBlackListed("http://www.w3.org/2004/02/skos/core#Concept"));
    }
}
