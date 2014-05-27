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
    var JmxBackedModel;
    return JmxBackedModel = (function() {
      __extends(JmxBackedModel, Model);
      function JmxBackedModel() {
        this.fetch = __bind(this.fetch, this);
        this.setPollingInterval = __bind(this.setPollingInterval, this);
        this.initialize = __bind(this.initialize, this);
        JmxBackedModel.__super__.constructor.apply(this, arguments);
      }
      JmxBackedModel.prototype.initialize = function(options) {
        this.server = options.server;
        this.jmx = this.server.manage.jmx;
        this.dataAvailable = false;
        if ((options.pollingInterval != null) && options.pollingInterval > 0) {
          this.fetch();
          return this.setPollingInterval(options.pollingInterval);
        }
      };
      JmxBackedModel.prototype.isDataAvailable = function() {
        return this.dataAvailable;
      };
      JmxBackedModel.prototype.setPollingInterval = function(ms) {
        if (this.interval != null) {
          clearInterval(this.interval);
        }
        return this.interval = setInterval(this.fetch, ms);
      };
      JmxBackedModel.prototype.fetch = function() {
        var def, key, _ref, _results;
        _ref = this.beans;
        _results = [];
        for (key in _ref) {
          def = _ref[key];
          _results.push(this.jmx.getBean(def.domain, def.name, this.beanParser(key)));
        }
        return _results;
      };
      JmxBackedModel.prototype.beanParser = function(key) {
        return __bind(function(bean) {
          var attribute, update, values, _i, _len, _ref;
          if ((bean != null) && (bean.attributes != null)) {
            this.setBeanDataAvailable(key);
            values = {};
            _ref = bean.attributes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              attribute = _ref[_i];
              values[attribute.name] = attribute.value;
            }
            update = {};
            update[key] = values;
            return this.set(update);
          }
        }, this);
      };
      JmxBackedModel.prototype.setBeanDataAvailable = function(key) {
        var b, dataAvailable, k, _ref;
        this.beans[key].dataAvailable = true;
        dataAvailable = true;
        _ref = this.beans;
        for (k in _ref) {
          b = _ref[k];
          if (!b.dataAvailable) {
            dataAvailable = false;
            break;
          }
        }
        return this.dataAvailable = dataAvailable;
      };
      return JmxBackedModel;
    })();
  });
}).call(this);
