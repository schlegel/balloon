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

package org.balloon_project;

import org.balloon_project.overflight.service.EndpointService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class InitListener {
    Logger logger = LoggerFactory.getLogger(InitListener.class);

    @Autowired
    Configuration configuration;

    @Autowired
    EndpointService endpointService;

    public void contextInitialized() {

        logger.info("-------------------------------------");
        logger.info("Starting Balloon Server");
        logger.info("-------------------------------------");

        if(configuration.isAutoFetchSPARQLEndpoints() && endpointService.getAll().size() == 0) {
            logger.info("No endpoints in database. The system will fetch the Linked Open Data SPARQL endpoints from CKAN - This may take a minute");
            endpointService.loadAndSaveCKANEndpoints();
        }

//        List<Endpoint> unindexed =   endpoints.getToIndex();
//        logger.info("There are " + unindexed.size() + " unindexed tasks");
//
//        if(unindexed.size() > 0) {
//            logger.info("Resuming unindexed tasks");
//
//            for(Endpoint endpoint : unindexed) {
//                endpoint.setStatus(QueryStatus.SCHEDULED);
//                endpoints.save(endpoint);
//                Indexing.getInstance().addIndexingTask(endpoint);
//            }
//
//            logger.info("Resuming finished");
//        } else {
//            logger.info("No tasks to resume");
//        }

    }

    public void contextDestroyed() {
    }
}