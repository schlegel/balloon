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
  define(['ribcage/Model'], function(Model) {
    var IndexManager;
    return IndexManager = (function() {
      __extends(IndexManager, Model);
      function IndexManager() {
        this._hasNodeIndex = __bind(this._hasNodeIndex, this);
        this._hasRelationshipIndex = __bind(this._hasRelationshipIndex, this);
        this.deleteRelationshipIndex = __bind(this.deleteRelationshipIndex, this);
        this.deleteNodeIndex = __bind(this.deleteNodeIndex, this);
        this.createRelationshipIndex = __bind(this.createRelationshipIndex, this);
        this.createNodeIndex = __bind(this.createNodeIndex, this);
        this.initialize = __bind(this.initialize, this);
        IndexManager.__super__.constructor.apply(this, arguments);
      }
      IndexManager.prototype.defaults = {
        nodeIndexes: [],
        relationshipIndexes: []
      };
      IndexManager.prototype.initialize = function(opts) {
        this.server = opts.server;
        this.server.index.getAllNodeIndexes().then(__bind(function(res) {
          return this.set({
            "nodeIndexes": res
          });
        }, this));
        return this.server.index.getAllRelationshipIndexes().then(__bind(function(res) {
          return this.set({
            "relationshipIndexes": res
          });
        }, this));
      };
      IndexManager.prototype.createNodeIndex = function(opts) {
        var name;
        name = opts.name;
        if (this._hasNodeIndex(name)) {
          return;
        }
        return this.server.index.createNodeIndex(name).then(__bind(function(index) {
          this.get("nodeIndexes").push(index);
          return this.trigger("change");
        }, this));
      };
      IndexManager.prototype.createRelationshipIndex = function(opts) {
        var name;
        name = opts.name;
        if (this._hasRelationshipIndex(name)) {
          return;
        }
        return this.server.index.createRelationshipIndex(name).then(__bind(function(index) {
          this.get("relationshipIndexes").push(index);
          return this.trigger("change");
        }, this));
      };
      IndexManager.prototype.deleteNodeIndex = function(opts) {
        var name;
        name = opts.name;
        return this.server.index.removeNodeIndex(name).then(__bind(function() {
          this.set({
            "nodeIndexes": this._removeIndexFromList(this.get("nodeIndexes"), name)
          });
          return this.trigger("change");
        }, this));
      };
      IndexManager.prototype.deleteRelationshipIndex = function(opts) {
        var name;
        name = opts.name;
        return this.server.index.removeRelationshipIndex(name).then(__bind(function() {
          this.set({
            "relationshipIndexes": this._removeIndexFromList(this.get("relationshipIndexes"), name)
          });
          return this.trigger("change");
        }, this));
      };
      IndexManager.prototype._hasRelationshipIndex = function(name) {
        var idx, _i, _len, _ref;
        _ref = this.get("relationshipIndexes");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          idx = _ref[_i];
          if (idx.name === name) {
            return true;
          }
        }
        return false;
      };
      IndexManager.prototype._hasNodeIndex = function(name) {
        var idx, _i, _len, _ref;
        _ref = this.get("nodeIndexes");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          idx = _ref[_i];
          if (idx.name === name) {
            return true;
          }
        }
        return false;
      };
      IndexManager.prototype._removeIndexFromList = function(idxs, name) {
        var i, _ref;
        for (i = _ref = idxs.length - 1; _ref <= 0 ? i <= 0 : i >= 0; _ref <= 0 ? i++ : i--) {
          if (idxs[i].name === name) {
            idxs.splice(i, 1);
            break;
          }
        }
        return idxs;
      };
      return IndexManager;
    })();
  });
}).call(this);
