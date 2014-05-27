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

package org.balloon_project.web;

import org.balloon_project.overflight.model.Endpoint;
import org.balloon_project.overflight.service.EndpointService;
import org.balloon_project.overflight.service.RessourceService;
import org.balloon_project.overflight.task.indexing.Indexing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/endpoints")
public class EndpointsController {

    @Autowired
    private EndpointService endpointService;

    @Autowired
    private RessourceService ressourceService;

    @Autowired
    private Indexing indexing;

    private Logger logger = LoggerFactory.getLogger(EndpointsController.class);

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String login(Model model) {
        return "redirect:/endpoints";
    }

    @RequestMapping(method = RequestMethod.GET)
    public String getAllEndpoints( Model model) {
        List<Endpoint> endpoints =  endpointService.getAll();
        model.addAttribute("endpoints", endpoints);
      //  model.addAttribute("numberOfRessources", ressourceService.getNumberOfDifferentRessources());

//        Map<IndexingStatus,List<Endpoint>> states = endpointService.getStatusCategories();
//        model.addAttribute("numberOfNew", Utils.size(states.get(IndexingStatus.NEW)));
//        model.addAttribute("numberOfFinished", Utils.size(states.get(IndexingStatus.CRAWLED)));
//        model.addAttribute("numberOfActive", (Utils.size(states.get(IndexingStatus.SCHEDULED)) + Utils.size(states.get(IndexingStatus.PROCESSING))));
//        model.addAttribute("numberOfError", (Utils.size(states.get(IndexingStatus.ERROR))+ Utils.size(states.get(IndexingStatus.EXCLUDED))));

       // model.addAttribute("unprocessedSameAs",  AppContext.getInstance().getSameAsRepository().getSameAsCount());
       // model.addAttribute("finishedSameAs", AppContext.getInstance().getSameAsRepository().getSameAsCountFinished());
       // model.addAttribute("unfinishedSameAs", AppContext.getInstance().getSameAsRepository().getSameAsCountUnFinished());
       // model.addAttribute("numberOfClusters",  AppContext.getInstance().getClusterRepository().getClusterCount());
        return "endpoints";
    }

    @RequestMapping(method = RequestMethod.POST)
    public String fetchEndpointsFromDataHub (Model model) {
        endpointService.loadAndSaveCKANEndpoints();
        return "redirect:/endpoints";
    }

    @RequestMapping(value = "index/endpoint/all", method = RequestMethod.GET)
    public String indexAllEndpoint(Model model) {
        List<Endpoint> endpoints =  endpointService.getAll();

        for(Endpoint endpoint : endpoints) {
            if(endpoint != null) {
                endpoint.setStarted(new Date());
                endpointService.save(endpoint);
                indexing.startIndexing(endpoint);
                logger.info("Scheduled endpoint " + endpoint.getTitle());
            }
        }

        return "redirect:/endpoints";
    }

    @RequestMapping(value = "index/endpoint/{endpointID}", method = RequestMethod.GET)
    public String indexEndpoint(@PathVariable String  endpointID, Model model) {
        Endpoint endpoint = endpointService.getByEndpointID(endpointID);
        if(endpoint != null) {
            endpoint.setStarted(new Date());
            endpointService.save(endpoint);
            indexing.startIndexing(endpoint);
            logger.info("Scheduled endpoint " + endpoint.getTitle());
        } else {
            logger.info("Couldnt find endpoint " + endpointID);
        }

        return "redirect:/endpoints";
    }


}