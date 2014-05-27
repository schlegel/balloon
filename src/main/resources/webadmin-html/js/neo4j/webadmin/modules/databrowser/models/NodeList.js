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
  define(['neo4j/webadmin/utils/ItemUrlResolver', './NodeProxy', 'ribcage/Model'], function(ItemUrlResolver, NodeProxy, Model) {
    var NodeList;
    return NodeList = (function() {
      __extends(NodeList, Model);
      function NodeList() {
        this.getRawNodes = __bind(this.getRawNodes, this);
        this.getNodes = __bind(this.getNodes, this);
        this.getPropertyKeys = __bind(this.getPropertyKeys, this);
        this.setRawNodes = __bind(this.setRawNodes, this);
        this.initialize = __bind(this.initialize, this);
        NodeList.__super__.constructor.apply(this, arguments);
      }
      NodeList.prototype.initialize = function(nodes) {
        return this.setRawNodes(nodes || []);
      };
      NodeList.prototype.setRawNodes = function(nodes) {
        var key, node, propertyKeyMap, propertyKeys, proxiedNodes, value, _i, _len, _ref;
        this.set({
          "rawNodes": nodes
        });
        proxiedNodes = [];
        propertyKeyMap = {};
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          _ref = node.getProperties();
          for (key in _ref) {
            value = _ref[key];
            propertyKeyMap[key] = true;
          }
          proxiedNodes.push(new NodeProxy(node));
        }
        propertyKeys = (function() {
          var _results;
          _results = [];
          for (key in propertyKeyMap) {
            value = propertyKeyMap[key];
            _results.push(key);
          }
          return _results;
        })();
        this.set({
          "propertyKeys": propertyKeys
        });
        return this.set({
          "nodes": proxiedNodes
        });
      };
      NodeList.prototype.getPropertyKeys = function() {
        return this.get("propertyKeys");
      };
      NodeList.prototype.getNodes = function() {
        return this.get("nodes");
      };
      NodeList.prototype.getRawNodes = function() {
        return this.get("rawNodes");
      };
      return NodeList;
    })();
  });
}).call(this);
