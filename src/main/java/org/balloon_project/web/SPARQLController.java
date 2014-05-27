//package de.uop.dimis.code.balloon.web;
//
//import com.hp.hpl.jena.query.*;
//import com.hp.hpl.jena.rdf.model.ModelFactory;
//import com.hp.hpl.jena.sparql.core.DatasetImpl;
//import com.hp.hpl.jena.sparql.mgt.Explain;
//import de.uop.dimis.code.balloon.sparql.SPARQLRewrite;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.ResponseBody;
//
//import java.util.Iterator;
//
//@Controller
//public class SPARQLController {
//
//    private Logger logger = LoggerFactory.getLogger(SPARQLController.class);
//
//    @RequestMapping(value = "/sparql", method = RequestMethod.POST, produces = "application/json")
//    public  @ResponseBody SPARQLResponse getCluster(@RequestParam("query") String query, @RequestParam("serviceClause") boolean serviceClause,  Model model) {
//         // TODO log queries
//        String result = null;
//
//        if(SPARQLRewrite.isRewriteableSELECTQuery(query)) {
//            result = SPARQLRewrite.rewrite(query, serviceClause);
//        }
//
//        return new SPARQLResponse(result, query, serviceClause);
//    }
//
//    @RequestMapping(value = "/sparql/execute", method = RequestMethod.POST)
//    public  @ResponseBody String executeSPARL(@RequestParam("query") String query, @RequestParam(value = "table", defaultValue = "false") String table , Model model) {
//        ARQ.setExecutionLogging(Explain.InfoLevel.FINE);
//
//        if(SPARQLRewrite.isRewriteableSELECTQuery(query)) {
//            String rewriteQuery = SPARQLRewrite.rewrite(query, true);
//
//            QueryExecution exec =  QueryExecutionFactory.create(QueryFactory.create(rewriteQuery), new DatasetImpl(ModelFactory.createDefaultModel()));
//            ResultSet results = exec.execSelect();
//
//            String result = "";
//
//            if(table.equals("true")) {
//
//                for ( ; results.hasNext() ; ) {
//                    QuerySolution soln = results.nextSolution();
//
//                    result += "<tr>";
//                    Iterator<String> it = soln.varNames();
//                    for ( ; it.hasNext() ; ) {
//                        String var = it.next();
//                        String content = soln.get(var).toString();
//                        int index = content.indexOf("^^");
//                          if(index != -1) {
//                              content = content.substring(0,index);
//                          }
//
//                        result += "<td>" + content + "</td>";
//                    }
//                    result += "</tr>\n";
//                }
//
//            }  else {
//                result =  ResultSetFormatter.asXMLString(results);
//            }
//
//            return result;
//        }
//
//        return "ERROR - only SELECT queries allowed";
//    }
//
//
//    private class SPARQLResponse {
//        private String response;
//        private String status;
//        private String query;
//        private boolean serviceClause;
//        private String result;
//
//        private SPARQLResponse(String result, String query, boolean serviceClause) {
//            this.query = query;
//            this.serviceClause = serviceClause;
//
//            if(result == null) {
//                this.response = "NOT VALID";
//                this.status = "500";
//            }  else {
//                this.response = "TRANSFORMED";
//                this.status = "200";
//                this.result = result;
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
//        public boolean isServiceClause() {
//            return serviceClause;
//        }
//
//        public void setServiceClause(boolean serviceClause) {
//            this.serviceClause = serviceClause;
//        }
//
//        public String getResult() {
//            return result;
//        }
//
//        public void setResult(String result) {
//            this.result = result;
//        }
//    }
//}
