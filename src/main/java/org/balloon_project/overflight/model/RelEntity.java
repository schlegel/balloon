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

public enum RelEntity {

    // EQUIVALANCE
    OWL_SAMEAS(RelType.EQUIVALENCE,"http://www.w3.org/2002/07/owl#sameAs", "OWL_SAMEAS"),
    OWL_EQUAL_CLASS(RelType.EQUIVALENCE,"http://www.w3.org/2002/07/owl#equivalentClass", "EQUAL_CLASS"),
    SKOS_EXACT_MATCH(RelType.EQUIVALENCE,"http://www.w3.org/2004/02/skos/core#exactMatch", "SKOS_EXACT_MATCH"),
    RKB_COREFERENCE_DATA(RelType.EQUIVALENCE,"http://www.rkbexplorer.com/ontologies/coref#coreferenceData", "RKB_COREFERENCE"),
    GENONT_HAS_EXACT_SYNONYM(RelType.EQUIVALENCE,"http://www.geneontology.org/formats/oboInOwl#hasExactSynonym", "GENONT_SYNONYM"),

    // INHERITANCE
    RDFS_SUBCLASS_OF(RelType.INHERITANCE,"http://www.w3.org/2000/01/rdf-schema#subClassOf", "RDFS_SUBCLASS_OF"),

    // INSTANCE
    RDF_TYPE(RelType.INSTANCE,"http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "RDF_TYPE");

    private RelType type;
    private String predicate;
    private String shortname;

    RelEntity(RelType type, String predicate, String shortname) {
        this.type = type;
        this.predicate = predicate;
        this.shortname = shortname;
    }

    public RelType getType() {
        return type;
    }

    public String getPredicate() {
        return predicate;
    }

    public String getShortname() {
        return shortname;
    }
}
