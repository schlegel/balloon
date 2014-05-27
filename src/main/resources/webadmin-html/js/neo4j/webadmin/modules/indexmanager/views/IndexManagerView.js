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
  define(['./base', './index', './IndexView', 'ribcage/View', 'lib/amd/jQuery'], function(template, indexTemplate, IndexView, View, $) {
    var IndexManagerView;
    return IndexManagerView = (function() {
      __extends(IndexManagerView, View);
      function IndexManagerView() {
        this.createRelationshipIndex = __bind(this.createRelationshipIndex, this);
        this.createNodeIndex = __bind(this.createNodeIndex, this);
        this.renderIndexList = __bind(this.renderIndexList, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        IndexManagerView.__super__.constructor.apply(this, arguments);
      }
      IndexManagerView.prototype.template = template;
      IndexManagerView.prototype.events = {
        "click .create-node-index": "createNodeIndex",
        "click .create-rel-index": "createRelationshipIndex"
      };
      IndexManagerView.prototype.initialize = function(opts) {
        this.appState = opts.state;
        this.server = this.appState.getServer();
        this.idxMgr = opts.idxMgr;
        return this.idxMgr.bind("change", this.renderIndexList);
      };
      IndexManagerView.prototype.render = function() {
        $(this.el).html(template());
        this.renderIndexList();
        return this;
      };
      IndexManagerView.prototype.renderIndexList = function() {
        var index, nodeIndexList, relIndexList, _i, _j, _len, _len2, _ref, _ref2, _results;
        nodeIndexList = $("#node-indexes", this.el).empty();
        _ref = this.idxMgr.get("nodeIndexes");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          index = _ref[_i];
          nodeIndexList.append(new IndexView({
            index: index,
            idxMgr: this.idxMgr,
            type: IndexView.prototype.NODE_INDEX_TYPE
          }).render().el);
        }
        relIndexList = $("#rel-indexes", this.el).empty();
        _ref2 = this.idxMgr.get("relationshipIndexes");
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          index = _ref2[_j];
          _results.push(relIndexList.append(new IndexView({
            index: index,
            idxMgr: this.idxMgr,
            type: IndexView.prototype.REL_INDEX_TYPE
          }).render().el));
        }
        return _results;
      };
      IndexManagerView.prototype.createNodeIndex = function() {
        return this.idxMgr.createNodeIndex({
          name: $("#create-node-index-name").val()
        });
      };
      IndexManagerView.prototype.createRelationshipIndex = function() {
        return this.idxMgr.createRelationshipIndex({
          name: $("#create-rel-index-name").val()
        });
      };
      return IndexManagerView;
    })();
  });
}).call(this);
