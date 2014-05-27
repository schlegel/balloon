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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(["neo4j/webadmin/utils/ItemUrlResolver"], function(ItemUrlResolver) {
    var CypherSearcher;
    return CypherSearcher = (function() {
      function CypherSearcher(server) {
        this.exec = __bind(this.exec, this);        this.server = server;
      }
      CypherSearcher.prototype.match = function(statement) {
        return true;
      };
      CypherSearcher.prototype.exec = function(statement) {
        return this.server.query(statement);
      };
      return CypherSearcher;
    })();
  });
}).call(this);
