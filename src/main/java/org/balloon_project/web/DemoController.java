//package de.uop.dimis.code.balloon.web;
//
//import de.uop.dimis.code.balloon.AppContext;
//import org.balloon_project.overflight.model.Endpoint;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//
//import java.util.List;
//
//@Controller
//public class DemoController {
//
//    private Logger logger = LoggerFactory.getLogger(DemoController.class);
//
//    @RequestMapping(value = "/demo", method = RequestMethod.GET)
//    public String getAllEndpoints( Model model) {
//
//        long sameAsCount = 0;
//        List<Endpoint> endpoints = AppContext.getInstance().getEndPointRepository().getAll();
//
//        for(Endpoint endpoint : endpoints) {
//            sameAsCount += endpoint.getSameAsCount();
//        }
//
//        model.addAttribute("sameAsCount", sameAsCount);
//        model.addAttribute("endpoints", AppContext.getInstance().getEndPointRepository().getAll().size());
//        model.addAttribute("numberOfClusters",  AppContext.getInstance().getClusterRepository().getClusterCount());
//
//        return "demo";
//    }
//}