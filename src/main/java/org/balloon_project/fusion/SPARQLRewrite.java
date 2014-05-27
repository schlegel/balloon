//package org.balloon_project.fusion;
//
//import com.hp.hpl.jena.query.Query;
//import com.hp.hpl.jena.query.QueryFactory;
//import com.hp.hpl.jena.sparql.algebra.*;
//import com.hp.hpl.jena.sparql.algebra.optimize.TransformJoinStrategy;
//import com.hp.hpl.jena.sparql.algebra.optimize.TransformMergeBGPs;
//import com.hp.hpl.jena.sparql.algebra.optimize.TransformReorder;
//
//public class SPARQLRewrite {
//
//    private SPARQLRewrite() {
//    }
//
//    public static String rewrite(String sparql, boolean serviceClause) {
//        Query query = QueryFactory.create(sparql) ;
//        if(query.isSelectType())  {
//
//            Op op = Algebra.compile(query);
//
//            Transform transform = new SPARQLRewriterBallloon(serviceClause);
//            op = Transformer.transform(transform, op);
//
//            Transform joinReordering = new TransformJoinStrategy();
//            op = Transformer.transform(joinReordering, op);
//
//            Transform mergeBGPs = new TransformMergeBGPs();
//            op = Transformer.transform(mergeBGPs, op);
//
//            Transform reordering = new TransformReorder();
//            op = Transformer.transform(reordering, op);
//
//            op =  Algebra.optimize(op);
//            Query optmimizedquery = OpAsQuery.asQuery(op) ;
//
//            return OpAsQuery.asQuery(op).serialize();
//        }  else {
//            throw new IllegalStateException("Only SELECT queries allowed");
//        }
//    }
//
//    public static boolean isRewriteableSELECTQuery(String sparql) {
//        try {
//            Query query = QueryFactory.create(sparql) ;
//            return query.isSelectType();
//        } catch (Exception e) {
//            return false;
//        }
//    }
//}
