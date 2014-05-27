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

import java.util.Date;

public class Triple {

    private Endpoint endpoint;
    private String subject;
    private RelEntity relEntity;
    private String object;
    private Date date;

    public Triple() {
    }

    public Triple(Endpoint endpoint, String subject, RelEntity relEntity, String object) {
        this(endpoint, subject, relEntity, object, new Date());
    }

    public Triple(Endpoint endpoint, String subject, RelEntity relEntity, String object, Date date) {
        this.endpoint = endpoint;
        this.subject = subject;
        this.relEntity = relEntity;
        this.object = object;
        this.date = date;
    }

    public Endpoint getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(Endpoint endpoint) {
        this.endpoint = endpoint;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public RelEntity getRelEntity() {
        return relEntity;
    }

    public void setRelEntity(RelEntity relEntity) {
        this.relEntity = relEntity;
    }

    public String getObject() {
        return object;
    }

    public void setObject(String object) {
        this.object = object;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "Triple{" +
                "endpoint=" + endpoint +
                ", subject='" + subject + '\'' +
                ", relEntity=" + relEntity +
                ", object='" + object + '\'' +
                ", date=" + date +
                '}';
    }
}