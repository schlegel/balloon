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
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(['lib/amd/Backbone'], function(Backbone) {
    var LocalModel;
    return LocalModel = (function() {
      __extends(LocalModel, Backbone.Model);
      function LocalModel(args, opts) {
        this._nestedModels = [];
        LocalModel.__super__.constructor.call(this, args, opts);
      }
      LocalModel.prototype.get = function(key, defaultValue) {
        var val;
        if (defaultValue == null) {
          defaultValue = null;
        }
        val = LocalModel.__super__.get.call(this, key);
        if (!val) {
          return defaultValue;
        }
        return val;
      };
      LocalModel.prototype.set = function(update, val, opts) {
        var updateMap;
        if (_(update).isString()) {
          updateMap = {};
          updateMap[update] = val;
          update = updateMap;
        } else {
          opts = val;
        }
        return LocalModel.__super__.set.call(this, update, opts);
      };
      LocalModel.prototype.fetch = function(prop) {
        var json;
        if (prop == null) {
          prop = null;
        }
        json = this._fetch();
        if (prop === null) {
          this.clear({
            silent: true
          });
          return this.set(json);
        } else {
          return json[prop];
        }
      };
      LocalModel.prototype.save = function() {
        return this._save(this);
      };
      /* Boilerplate to set 
      a model or collection as an attribute.
      
      Takes care of setting fetch and save
      methods on the model/collection appropriately,
      and adds hooks into this models fetch
      and toJSON methods to ensure fetch calls
      and saves propagate correctly.
      
      @param name is the property name to use and to fetch data via
      @param type is the model or collection class (or any object with a deserialize method)
      */
      LocalModel.prototype.initNestedModel = function(name, type) {
        if (type.deserialize != null) {
          this[name] = type.deserialize(this.get(name));
        } else {
          this[name] = new type(this.get(name));
        }
        this[name].setFetchMethod(__bind(function() {
          return this.fetch(name);
        }, this));
        this[name].setSaveMethod(this.save);
        return this._nestedModels.push(name);
      };
      LocalModel.prototype.toJSON = function() {
        var data, name, _i, _len, _ref;
        data = LocalModel.__super__.toJSON.call(this);
        data.id = this.id;
        _ref = this._nestedModels;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          data[name] = this[name].toJSON();
        }
        return data;
      };
      LocalModel.prototype.setFetchMethod = function(_fetch) {
        this._fetch = _fetch;
      };
      LocalModel.prototype.setSaveMethod = function(_save) {
        this._save = _save;
      };
      return LocalModel;
    })();
  });
}).call(this);
