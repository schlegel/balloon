(function() {
  /*
  Copyright (c) 2002-2014 "Neo Technology,"
  Network Engine for Objects in Lund AB [http://neotechnology.com]
  
  This file is part of Neo4j.
  
  Neo4j is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./Console'], function(Console) {
    var HttpConsole;
    return HttpConsole = (function() {
      __extends(HttpConsole, Console);
      function HttpConsole() {
        this.callFailed = __bind(this.callFailed, this);
        this.callSucceeded = __bind(this.callSucceeded, this);
        this.initialize = __bind(this.initialize, this);
        HttpConsole.__super__.constructor.apply(this, arguments);
      }
      HttpConsole.prototype.statementRegex = /^((GET)|(PUT)|(POST)|(DELETE)) ([^ ]+)( (.+))?$/i;
      HttpConsole.prototype.initialize = function(opts) {
        this.server = opts.server;
        this.lang = opts.lang;
        this.setPromptPrefix("" + this.lang + "> ");
        return this.set({
          "showPrompt": true
        }, {
          silent: true
        });
      };
      HttpConsole.prototype.executeStatement = function(statement) {
        var data, method, result, url, _ref;
        if (this.statementRegex.test(statement)) {
          result = this.statementRegex.exec(statement);
          _ref = [result[1], result[6], result[8]], method = _ref[0], url = _ref[1], data = _ref[2];
          if (data) {
            try {
              return this.server.web.ajax(method, url, JSON.parse(data), this.callSucceeded, this.callFailed);
            } catch (e) {
              return this.setResult(["Invalid JSON data."]);
            }
          } else {
            return this.server.web.ajax(method, url, this.callSucceeded, this.callFailed);
          }
        } else {
          return this.setResult(["Invalid statement."]);
        }
      };
      HttpConsole.prototype.setResult = function(lines) {
        this.set({
          "showPrompt": true
        }, {
          silent: true
        });
        return this.pushLines(lines);
      };
      HttpConsole.prototype.callSucceeded = function(responseData, type, response) {
        var lines, status;
        status = [response.status + " " + response.statusText];
        lines = response.responseText.split("\n");
        return this.setResult(status.concat(lines));
      };
      HttpConsole.prototype.callFailed = function(response) {
        return this.callSucceeded(null, null, arguments[0].req);
      };
      return HttpConsole;
    })();
  });
}).call(this);
