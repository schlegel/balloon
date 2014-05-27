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

package org.balloon_project.overflight.service;

import com.google.common.collect.Lists;
import org.balloon_project.overflight.model.Ressource;
import org.balloon_project.overflight.repository.RessourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RessourceService {

    @Autowired
    private RessourceRepository ressourceRepository;

    @Transactional
    public long getNumberOfDifferentRessources() {
        return ressourceRepository.countDistinct();
    }

    @Transactional
    public List<Ressource> findCluster (String url) {
        Iterable<Ressource> results = ressourceRepository.findCluster(url);
        return Lists.newArrayList(results);
    }

    @Transactional
    public List<Ressource> findTypes( String url) {
        Iterable<Ressource> results = ressourceRepository.findTypes(url);
        return Lists.newArrayList(results);
    }

    @Transactional
    public List<Ressource> commonTypes(String url1, String url2) {
        Iterable<Ressource> results = ressourceRepository.commonTypes(url1, url2);
        return Lists.newArrayList(results);
    }

}
