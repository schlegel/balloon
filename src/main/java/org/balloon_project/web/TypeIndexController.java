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

package org.balloon_project.web;

import org.balloon_project.overflight.model.Ressource;
import org.balloon_project.overflight.service.RessourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class TypeIndexController {

    @Autowired
    private RessourceService ressourceService;

    @RequestMapping(value = "/types", method = RequestMethod.GET, produces = "application/json")
    public  @ResponseBody TypeResponse getTypes(@RequestParam("url") String url) {
        if(url == null) {
            url = "";
        }

        List<Ressource> results = ressourceService.findTypes(url);

        return new TypeResponse(url, results);
    }

    @RequestMapping(value = "/commontypes", method = RequestMethod.GET, produces = "application/json")
    public  @ResponseBody TypeResponse getCommonTypes(@RequestParam("url1") String url1, @RequestParam("url2") String url2) {
        if(url1 == null) {
            url1 = "";
        }
        if(url1 == null) {
            url1 = "";
        }

        List<Ressource> results = ressourceService.commonTypes(url1, url2);

        return new TypeResponse(url1 + " AND " + url2, results);
    }

    private class TypeResponse {
        private String query;
        private List<Ressource> types;

        private TypeResponse(String query, List<Ressource> types) {
            this.query = query;
            this.types = types;
        }

        public String getQuery() {
            return query;
        }

        public void setQuery(String query) {
            this.query = query;
        }

        public List<Ressource> getTypes() {
            return types;
        }

        public void setTypes(List<Ressource> types) {
            this.types = types;
        }
    }
}
