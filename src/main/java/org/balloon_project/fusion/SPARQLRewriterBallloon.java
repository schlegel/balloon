//package org.balloon_project.fusion;
//
//import com.hp.hpl.jena.graph.Node;
//import com.hp.hpl.jena.graph.NodeFactory;
//import com.hp.hpl.jena.graph.Triple;
//import com.hp.hpl.jena.sparql.algebra.Op;
//import com.hp.hpl.jena.sparql.algebra.TransformCopy;
//import com.hp.hpl.jena.sparql.algebra.op.OpBGP;
//import com.hp.hpl.jena.sparql.algebra.op.OpJoin;
//import com.hp.hpl.jena.sparql.algebra.op.OpService;
//import com.hp.hpl.jena.sparql.algebra.op.OpUnion;
//import com.hp.hpl.jena.sparql.core.BasicPattern;
//import org.balloon_project.overflight.model.Endpoint;
//import org.balloon_project.overflight.model.Ressource;
//
//import java.util.*;
//
//public class SPARQLRewriterBallloon extends TransformCopy {
//    private boolean serviceClause;
//
//    public SPARQLRewriterBallloon(boolean serviceClause) {
//        this.serviceClause = serviceClause;
//    }
//
//    @Override
//    public Op transform(OpBGP opBGP) {
//        BasicPattern pattern = opBGP.getPattern();
//        List<Triple> triples = pattern.getList();
//
//        Collection<Op> ops = new LinkedList<Op>();
//
//        // rewrite each triple
//        for(Triple triple : triples) {
//            ops.add(rewrite(triple));
//        }
//
//        if(ops.size() > 0) {
//            return createJoins(ops);
//        } else {
//            return opBGP;
//        }
//    }
//
//    @SuppressWarnings("unchecked")
//    private Op rewrite (Triple triple) {
//        Op result = null;
//        Node subject = triple.getSubject();
//        Node object = triple.getObject();
//
//        if(subject.isURI() && object.isURI()) {
//            result =  rewriteBoth(triple);
//        }   else if(subject.isURI()) {
//            result = rewriteURI(subject, triple, true);
//        } else if(object.isURI()){
//            result = rewriteURI(object, triple, false);
//        }
//
//        // return input as Op if no rewriting was possible
//        if(result == null) {
//            BasicPattern bp = new BasicPattern();
//            bp.add(triple);
//            result = new OpBGP(bp);
//        }
//
//        return result;
//    }
//
//    private Op rewriteBoth(Triple triple) {
//        Node subject = triple.getSubject();
//        Node object = triple.getObject();
//
//        Set<String> subjects = new HashSet<String>();
//        subjects.add(subject.getURI());
//
//        List<Ressource> clusterSubject = AppContext.getInstance().getRessourceService().findCluster(subject.getURI());
//
//        for(Ressource item : clusterSubject) {
//            subjects.add(item.getUrl());
//        }
//
//        Set<String> objects = new HashSet<String>();
//        objects.add(object.getURI());
//
//        List<Ressource> clusterObject = AppContext.getInstance().getRessourceService().findCluster(object.getURI());
//        for(Ressource item : clusterObject) {
//            objects.add(item.getUrl());
//        }
//
//        Collection<Op> unionTriples = new LinkedList<Op>();
//        Set<String> sparqlEndpoints = new HashSet<String>();
//        for(String sub : subjects) {
//            for(String ob : objects) {
//                Node newSubject = NodeFactory.createURI(sub);
//                Node newObject = NodeFactory.createURI(ob);
//                Triple t = new Triple(newSubject, triple.getPredicate(), newObject);
//                BasicPattern bp = new BasicPattern();
//                bp.add(t);
//                unionTriples.add(new OpBGP(bp));
//
//                Endpoint subjectEndpoint = AppContext.getInstance().getEndPointRepository().resolveConcept(sub);
//                if(subjectEndpoint != null) {
//                    sparqlEndpoints.add(subjectEndpoint.getSparqlEndpoint().trim());
//                }
//
//                Endpoint objectEndpoint = AppContext.getInstance().getEndPointRepository().resolveConcept(ob);
//                if(objectEndpoint != null) {
//                    sparqlEndpoints.add(objectEndpoint.getSparqlEndpoint().trim());
//                }
//            }
//        }
//
//        Op equivalentUnionBlock = createUnion(unionTriples);
//
//        if(this.serviceClause) {
//            Collection<Op> resultBlocks = new LinkedList<Op>();
//            resultBlocks.add(equivalentUnionBlock);
//
//            for(String sparqlEndpoint : sparqlEndpoints) {
//                OpService service = new OpService(NodeFactory.createURI(sparqlEndpoint), equivalentUnionBlock, false);
//                resultBlocks.add(service);
//            }
//
//            return createUnion(resultBlocks);
//        }  else {
//            return equivalentUnionBlock;
//        }
//    }
//
//    private Op rewriteURI(Node nodes, Triple triple, boolean subject) {
//        String uri = nodes.getURI();
//
//        List<Ressource> cluster = AppContext.getInstance().getRessourceService().findCluster(uri);
//
//        Set<String> equivalentSet = null;
//        equivalentSet.add(uri);
//
//        for(Ressource item : cluster) {
//            equivalentSet.add(item.getUrl());
//        }
//
//        if(equivalentSet == null) {
//            equivalentSet = new HashSet<String>();
//            equivalentSet.add(uri);
//        }
//
//        Set<String> sparqlEndpoints = new HashSet<String>();
//
//        if(equivalentSet.size() > 0) {
//            Collection<Op> unionTriples = new LinkedList<Op>();
//
//            for(String synonym : equivalentSet) {
//                Node newSubject = NodeFactory.createURI(synonym);
//
//                Triple t;
//
//                if(subject) {
//                    t = new Triple(newSubject, triple.getPredicate(), triple.getObject());
//                }   else {
//                    t = new Triple(triple.getSubject(), triple.getPredicate(), newSubject);
//                }
//
//                BasicPattern bp = new BasicPattern();
//                bp.add(t);
//                unionTriples.add(new OpBGP(bp));
//
//                //search for suitable sparql endpoint
//                Endpoint endpoint = AppContext.getInstance().getEndPointRepository().resolveConcept(synonym);
//
//                if(endpoint != null) {
//                    sparqlEndpoints.add(endpoint.getSparqlEndpoint().trim());
//                }
//            }
//
//            Op equivalentUnionBlock = createUnion(unionTriples);
//
//            if(this.serviceClause) {
//                Collection<Op> resultBlocks = new LinkedList<Op>();
//                resultBlocks.add(equivalentUnionBlock);
//
//                for(String sparqlEndpoint : sparqlEndpoints) {
//                    OpService service = new OpService(NodeFactory.createURI(sparqlEndpoint), equivalentUnionBlock, false);
//                    resultBlocks.add(service);
//                }
//
//                return createUnion(resultBlocks);
//            }  else {
//                return equivalentUnionBlock;
//            }
//        }
//
//        return null;
//    }
//
//    @SuppressWarnings("unchecked")
//    private Op createJoins(Collection<Op> ops) {
//        Stack<Op> stack = new Stack();
//        stack.addAll(ops);
//
//        if(stack.size() > 0) {
//            Op result = stack.pop();
//
//            while(!stack.isEmpty()){
//                result = OpJoin.create(stack.pop(), result);
//            }
//
//            return result;
//        }  else {
//            throw new IllegalStateException("Ops collection is empty");
//        }
//    }
//
//    @SuppressWarnings("unchecked")
//    private Op createUnion(Collection<Op> ops) {
//        Stack<Op> stack = new Stack();
//        stack.addAll(ops);
//
//        if(stack.size() > 0) {
//            Op result = stack.pop();
//
//            while(!stack.isEmpty()){
//                result = new OpUnion(stack.pop(), result);
//            }
//
//            return result;
//        }  else {
//            throw new IllegalStateException("Ops collection is empty");
//        }
//    }
//}
