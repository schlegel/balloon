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

package org.balloon_project.overflight.model;

import org.springframework.data.neo4j.annotation.*;

import java.util.Date;

@RelationshipEntity(type = "RESSOURCE_RELATION" )
public class RessourceRelation {
    @GraphId
    private Long id;

    @Fetch
    @StartNode
    private Ressource source;

    @Fetch
    @EndNode
    private Ressource target;

    @Indexed
    private String type;

    @Indexed
    private String predicate;

    @Indexed
    private String origin;

    public RessourceRelation() {
    }

    public RessourceRelation(Ressource source, Ressource target, RelEntity relEntity, String origin) {
        this.source = source;
        this.target = target;
        this.predicate = relEntity.getPredicate();
        this.origin = origin;
        this.type = relEntity.getType().toString();
    }

    public void setPredicateAndType(RelEntity relEntity) {
        this.predicate = relEntity.getPredicate();
        this.type = relEntity.getType().toString();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ressource getSource() {
        return source;
    }

    public void setSource(Ressource source) {
        this.source = source;
    }

    public Ressource getTarget() {
        return target;
    }

    public void setTarget(Ressource target) {
        this.target = target;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPredicate() {
        return predicate;
    }

    public void setPredicate(String predicate) {
        this.predicate = predicate;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    @Override
    public String toString() {
        return "RessourceRelation{" +
                "id=" + id +
                ", source=" + source +
                ", target=" + target +
                ", type='" + type + '\'' +
                ", predicate='" + predicate + '\'' +
                ", origin='" + origin + '\'' +
                '}';
    }
}