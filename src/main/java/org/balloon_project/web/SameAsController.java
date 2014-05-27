//package de.uop.dimis.code.balloon.web;
//
//import de.uop.dimis.code.balloon.AppContext;
//import de.uop.dimis.code.balloon.persistence.*;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.data.mongodb.core.mapping.Field;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Set;
//
//@Controller
//public class SameAsController {
//
//    private Logger logger = LoggerFactory.getLogger(SameAsController.class);
//
//    @RequestMapping(value = "/sameas", method = RequestMethod.POST, produces = "application/json")
//    public  @ResponseBody ClusterResponse getCluster(@RequestParam("url") String url,  Model model) {
//        if(url == null) {
//            url = "";
//        }
//
//        ClusterRepository clusterRepository = AppContext.getInstance().getClusterRepository();
//        Cluster cluster = clusterRepository.find(url.trim());
//
//        return new ClusterResponse(cluster, url);
//    }
//
//    @RequestMapping(value = "/sameas/resolve", method = RequestMethod.POST, produces = "application/json")
//    public  @ResponseBody ResolveEndpointResponse getEndpointForSameAs(@RequestParam("url") String url,  Model model) {
//      // TODO log queries which cannot be answered
//        if(url == null) {
//            url = "";
//        }
//
//        EndpointRepository endpointRepository = AppContext.getInstance().getEndPointRepository();
//        return new ResolveEndpointResponse(url, endpointRepository.resolveConcept(url.trim()));
//    }
//
//
//    private class ClusterResponse {
//
//        private String response;
//        private String status;
//        private String query;
//        private Set<String> sameAs;
//        private List<Cluster.RepoSameAs> sameAsRelations;
//
//        private ClusterResponse(Cluster cluster, String query) {
//           this.query = query;
//
//            if(cluster == null) {
//               this.response = "NOT FOUND";
//                this.status = "404";
//            }   else {
//                this.response = "FOUND";
//                this.status = "200";
//                this.sameAs = cluster.getSameAsSet();
//                this.sameAsRelations = cluster.getSameAsRelations();
//            }
//        }
//
//        public String getResponse() {
//            return response;
//        }
//
//        public void setResponse(String response) {
//            this.response = response;
//        }
//
//        public String getStatus() {
//            return status;
//        }
//
//        public void setStatus(String status) {
//            this.status = status;
//        }
//
//        public String getQuery() {
//            return query;
//        }
//
//        public void setQuery(String query) {
//            this.query = query;
//        }
//
//        public Set<String> getSameAs() {
//            return sameAs;
//        }
//
//        public void setSameAs(Set<String> sameAs) {
//            this.sameAs = sameAs;
//        }
//
//        public List<Cluster.RepoSameAs> getSameAsRelations() {
//            return sameAsRelations;
//        }
//
//        public void setSameAsRelations(List<Cluster.RepoSameAs> sameAsRelations) {
//            this.sameAsRelations = sameAsRelations;
//        }
//    }
//
//    private class ResolveEndpointResponse {
//        private String response;
//        private String status;
//        private String query;
//        private String endpointID;
//        private String sparql;
//
//
//        public ResolveEndpointResponse(String query, Endpoint endpoint) {
//            this.query = query;
//
//            if(endpoint == null) {
//                this.response = "NOT FOUND";
//                this.status = "404";
//            }   else {
//                this.response = "FOUND";
//                this.status = "200";
//                this.endpointID = endpoint.getEndpointID();
//                this.sparql = endpoint.getSparqlEndpoint();
//            }
//        }
//
//        public String getResponse() {
//            return response;
//        }
//
//        public void setResponse(String response) {
//            this.response = response;
//        }
//
//        public String getStatus() {
//            return status;
//        }
//
//        public void setStatus(String status) {
//            this.status = status;
//        }
//
//        public String getQuery() {
//            return query;
//        }
//
//        public void setQuery(String query) {
//            this.query = query;
//        }
//
//        public String getEndpointID() {
//            return endpointID;
//        }
//
//        public void setEndpointID(String endpointID) {
//            this.endpointID = endpointID;
//        }
//
//        public String getSparql() {
//            return sparql;
//        }
//
//        public void setSparql(String sparql) {
//            this.sparql = sparql;
//        }
//    }
//}
