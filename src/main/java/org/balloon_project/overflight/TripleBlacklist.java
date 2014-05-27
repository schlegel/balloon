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

package org.balloon_project.overflight;


import org.balloon_project.overflight.model.Triple;

public class TripleBlacklist {
    private TripleBlacklist() {
    }

    public static boolean isBlackListed(String text) {
        return text.startsWith(Namespace.RDF.getPrefix())
                || text.startsWith(Namespace.RDFS.getPrefix())
                || text.startsWith(Namespace.OWL.getPrefix())
                || text.startsWith(Namespace.SKOS.getPrefix());
    }

    public static boolean isBlackListed(Triple triple) {
        return triple.getSubject().equals(triple.getObject()) || isBlackListed(triple.getSubject()) || isBlackListed(triple.getObject());
    }
}