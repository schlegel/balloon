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

package org.balloon_project.overflight.task.importer;

import org.balloon_project.Configuration;
import org.balloon_project.overflight.task.indexing.IndexingTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;


public class ImporterFileListener extends Thread{

    @Autowired
    private Importer importer;

    @Autowired
    Configuration configuration;

    private Logger logger = LoggerFactory.getLogger(ImporterFileListener.class);

    public ImporterFileListener(){
    }

    @Override
    public void run() {
        // TODO initial import start
        // initial import of existing file
        logger.info("Scanning for files to import");
        File importDir = new File(configuration.getDatabaseImportDirectory());
        if(importDir.exists() && importDir.isDirectory()) {
            for(File file : importDir.listFiles()) {
                if(file.isFile() && file.getPath().endsWith(IndexingTask.N_TRIPLES_EXTENSION)) {
                    logger.info("File event: Adding " + file.toString() + " to importer queue");
                    importer.startImporting(file);
                }
            }
        }

        // starting file watch service for future files
        try {
            String path = configuration.getDatabaseImportDirectory();
            logger.info("Starting import file listener for path " + path);
            Path tmpPath = Paths.get(path);
            WatchService watchService = FileSystems.getDefault().newWatchService();
            tmpPath.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);

            for(;;) {
                WatchKey key = watchService.take();

                for(WatchEvent event : key.pollEvents()){
                    if (event.kind().name() == "OVERFLOW") {
                        continue;
                    }  else {
                        WatchEvent<Path> ev = (WatchEvent<Path>)event;
                        Path filename = ev.context();
                        logger.info("File event: Adding " + filename.toString() + " to importer queue");
                        importer.startImporting(tmpPath.resolve(filename).toFile());
                    }
                }

                // Reset the key -- this step is critical if you want to
                // receive further watch events.  If the key is no longer valid,
                // the directory is inaccessible so exit the loop.
                boolean valid = key.reset();
                if (!valid) {
                    break;
                }

            }
        } catch (IOException|InterruptedException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } finally {
          logger.debug("Stopping import file listener");
        }
    }
}
