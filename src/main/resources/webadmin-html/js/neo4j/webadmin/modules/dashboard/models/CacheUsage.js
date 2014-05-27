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
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./JmxBackedModel'], function(JmxBackedModel) {
    var CacheUsage;
    return CacheUsage = (function() {
      __extends(CacheUsage, JmxBackedModel);
      function CacheUsage() {
        CacheUsage.__super__.constructor.apply(this, arguments);
      }
      CacheUsage.prototype.beans = {
        node: {
          domain: 'neo4j',
          name: 'Cache,name0=NodeCache'
        },
        relationship: {
          domain: 'neo4j',
          name: 'Cache,name0=RelationshipCache'
        }
      };
      return CacheUsage;
    })();
  });
}).call(this);
