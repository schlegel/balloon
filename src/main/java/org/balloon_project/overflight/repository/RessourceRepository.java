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

package org.balloon_project.overflight.repository;

import org.balloon_project.overflight.model.Ressource;
import org.balloon_project.overflight.model.RessourceRelation;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.GraphRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RessourceRepository extends GraphRepository<Ressource>{
    @Query("MATCH (n:RESSOURCE) " +
            "RETURN count(DISTINCT n)")
    public long countDistinct();

    @Query("MATCH (n)-[r:EQUIVALENCE*]-(e) " +
            "WHERE n.url = {url} AND not(n=e) " +
            "RETURN DISTINCT e")
    public Iterable<Ressource> findCluster(@Param("url")String url);

    @Query( "MATCH (n)-[relations:EQUIVALENCE*]-(e) " +
            "WHERE n.url = {url} AND not(n=e) " +
            "WITH e " +
            "MATCH ()-[rel:EQUIVALENCE]-(e) " +
            "RETURN DISTINCT rel")
    public Iterable<RessourceRelation> findClusterRelations(@Param("url") String url);

    @Query("MATCH (n)-[r:INSTANCE]->(t) " +
            "WHERE n.url = {url} AND not(n=t) " +
            "OPTIONAL MATCH (t)-[r2:INHERITANCE*]->(ta)" +
            "RETURN collect(t)+collect(ta)")
    public Iterable<Ressource> findTypes(@Param("url")String url);
    // TODO equal beziehungen fehlen

    @Query("MATCH (x),(x2) " +
            "WHERE x.url = {url1} AND x2.url = {url2} " +
            "MATCH (x)-[:INSTANCE|INHERITANCE*]->(t)<-[:INSTANCE|INHERITANCE*]-(x2)" +
            "RETURN t")
    public Iterable<Ressource> commonTypes(@Param("url1") String url, @Param("url2") String url2);
    // TODO equal beziehungen fehlen


    @Query(value =  "MERGE (subject:RESSOURCE:`__TYPE__RESSOURCE` {url: '{subject}'}) " +
                    "MERGE (object:RESSOURCE:`__TYPE__RESSOURCE` {url: '{object}'}) " +
                    "MERGE (subject)-[r:INSTANCE{ type : 'INSTANCE', `__type__` : 'RESSOURCE_RELATION', predicate : '{predicate}', origin : '{origin}' }]->(object) " +
                    "RETURN r", elementClass = RessourceRelation.class)
    public RessourceRelation createOrGetInstanceRel(@Param("subject")String subject, @Param("object")String object, @Param("origin")String origin, @Param("predicate")String predicate);

    @Query(value =  "MERGE (subject:RESSOURCE:`__TYPE__RESSOURCE` {url : '{subject}'}) " +
                    "MERGE (object:RESSOURCE:`__TYPE__RESSOURCE` {url : '{object}'}) " +
                    "MERGE (subject)-[r:INHERITANCE{ type : 'INHERITANCE', `__type__` : 'RESSOURCE_RELATION', predicate : '{predicate}', origin : '{origin}' }]->(object) " +
                    "RETURN r", elementClass = RessourceRelation.class)
    public RessourceRelation createOrGetInheritanceRel(@Param("subject")String subject, @Param("object")String object, @Param("origin")String origin, @Param("predicate")String predicate);

    @Query(value =  "MERGE (subject:RESSOURCE:`__TYPE__RESSOURCE` {url: {subject}}) " +
                    "MERGE (object:RESSOURCE:`__TYPE__RESSOURCE` {url: {object}}) " +
                    "MERGE (subject)-[r:EQUIVALENCE{ type : 'EQUIVALENCE', `__type__` : 'RESSOURCE_RELATION', predicate : {predicate}, origin :{origin} }]->(object) " +
                    "RETURN r", elementClass = RessourceRelation.class)
    public RessourceRelation createOrGetEquivalenceRel(@Param("subject") String subject, @Param("object") String object, @Param("origin") String origin, @Param("predicate") String predicate);
}
