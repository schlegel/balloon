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

package org.balloon_project;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.springframework.stereotype.Component;

@Component
public class Configuration {

    private static final String RESOURCE_NAME = "application.properties";

    private PropertiesConfiguration configuration;

    public Configuration() {
        try {
            this.configuration = new PropertiesConfiguration(RESOURCE_NAME);
        } catch (ConfigurationException e) {
            e.printStackTrace();
        }
    }

    public Integer getSparqlInitialQueryLimit(){
        return configuration.getInt("sparql.initial.query.limit");
    }

    public Long getSPARQLReadTimeout() {
        return configuration.getLong("sparql.read.timeout");
    }

    public Long getSPARQLConnectTimeout() {
        return configuration.getLong("sparql.connect.timeout");
    }

    public String getTripleDumpStoreDirectory() {
        return configuration.getString("triple.dump.storedirectory");
    }

    public String getDatabaseImportDirectory() {
        return configuration.getString("triple.dump.storedirectory") + "/import";
    }

    public String getDatabaseImportedDirectory() {
        return configuration.getString("triple.dump.storedirectory") + "/imported";
    }

    public int getTripleBulkInsertSize() {
        return configuration.getInt("triple.bulk.insert.size");
    }

    public boolean isAutoFetchSPARQLEndpoints() {
        return configuration.getBoolean("auto.fetch.sparql.endpoints");
    }
}