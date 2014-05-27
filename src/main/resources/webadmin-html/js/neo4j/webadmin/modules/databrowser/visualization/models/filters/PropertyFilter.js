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
  define(['./Filter', './propertyFilterTemplate', '../../views/AbstractFilterView'], function(Filter, template, AbstractFilterView) {
    var PropertyFilter, PropertyFilterView;
    PropertyFilterView = (function() {
      __extends(PropertyFilterView, AbstractFilterView);
      function PropertyFilterView() {
        this.compareValueChanged = __bind(this.compareValueChanged, this);
        this.propertyNameChanged = __bind(this.propertyNameChanged, this);
        this.methodChanged = __bind(this.methodChanged, this);
        PropertyFilterView.__super__.constructor.apply(this, arguments);
      }
      PropertyFilterView.prototype.events = {
        'change .method': 'methodChanged',
        'change .propertyName': 'propertyNameChanged',
        'change .compareValue': 'compareValueChanged',
        "click button.removeFilter": "deleteFilter"
      };
      PropertyFilterView.prototype.render = function() {
        var definition, label, method, select, _ref;
        $(this.el).html(template());
        select = $(".method", this.el);
        select.append("<option value='exists'>exists</option>");
        select.append("<option value='!exists'>doesn't exist</option>");
        _ref = PropertyFilter.compareMethods;
        for (method in _ref) {
          definition = _ref[method];
          label = definition.label;
          select.append("<option value='" + (htmlEscape(method)) + "'>" + (htmlEscape(label)) + "</option>");
        }
        this.uiSetMethod(this.filter.getMethodName());
        this.uiSetPropertyName(this.filter.getPropertyName());
        this.uiSetCompareValue(this.filter.getCompareValue());
        return this;
      };
      PropertyFilterView.prototype.methodChanged = function() {
        var method;
        method = $(".method", this.el).val();
        this.uiSetMethod(method);
        return this.filter.setMethodName(method);
      };
      PropertyFilterView.prototype.propertyNameChanged = function() {
        var name;
        name = $('.propertyName', this.el).val();
        return this.filter.setPropertyName(name);
      };
      PropertyFilterView.prototype.compareValueChanged = function() {
        var val;
        val = $('.compareValue', this.el).val();
        return this.filter.setCompareValue(val);
      };
      PropertyFilterView.prototype.uiSetMethod = function(method) {
        $(".method", this.el).val(method);
        if (PropertyFilter.compareMethods[method] != null) {
          return $('.compareValue', this.el).show();
        } else {
          return $('.compareValue', this.el).hide();
        }
      };
      PropertyFilterView.prototype.uiSetPropertyName = function(prop) {
        return $('.propertyName', this.el).val(prop);
      };
      PropertyFilterView.prototype.uiSetCompareValue = function(val) {
        return $('.compareValue', this.el).val(val);
      };
      return PropertyFilterView;
    })();
    return PropertyFilter = (function() {
      __extends(PropertyFilter, Filter);
      function PropertyFilter() {
        this.matches = __bind(this.matches, this);
        PropertyFilter.__super__.constructor.apply(this, arguments);
      }
      PropertyFilter.type = 'propertyFilter';
      PropertyFilter.compareMethods = {
        '==': {
          label: "is",
          cmp: function(actual, expected) {
            return actual === expected;
          }
        },
        '!=': {
          label: "isn't",
          cmp: function(actual, expected) {
            return actual !== expected;
          }
        },
        '>': {
          label: ">",
          cmp: function(actual, expected) {
            return actual > expected;
          }
        },
        '<': {
          label: "<",
          cmp: function(actual, expected) {
            return actual < expected;
          }
        },
        '>=': {
          label: ">=",
          cmp: function(actual, expected) {
            return actual >= expected;
          }
        },
        '<=': {
          label: "<=",
          cmp: function(actual, expected) {
            return actual <= expected;
          }
        }
      };
      PropertyFilter.prototype.defaults = {
        'method': 'exists'
      };
      PropertyFilter.prototype.getViewClass = function() {
        return PropertyFilterView;
      };
      PropertyFilter.prototype.getType = function() {
        return PropertyFilter.type;
      };
      PropertyFilter.prototype.getMethodName = function() {
        return this.get('method');
      };
      PropertyFilter.prototype.getPropertyName = function() {
        return this.get('propertyName');
      };
      PropertyFilter.prototype.getCompareValue = function() {
        return this.get('compareValue');
      };
      PropertyFilter.prototype.setMethodName = function(v) {
        return this.set('method', v);
      };
      PropertyFilter.prototype.setPropertyName = function(v) {
        return this.set('propertyName', v);
      };
      PropertyFilter.prototype.setCompareValue = function(v) {
        return this.set('compareValue', v);
      };
      PropertyFilter.prototype.matches = function(item) {
        var cmp, cmpVal, method, node, val;
        method = this.getMethodName();
        if (item.neoNode != null) {
          node = item.neoNode;
          if (method === 'exists') {
            return node.hasProperty(this.getPropertyName());
          } else if (method === '!exists') {
            return !node.hasProperty(this.getPropertyName());
          } else if (PropertyFilter.compareMethods[method] != null) {
            cmp = PropertyFilter.compareMethods[method].cmp;
            val = node.getProperty(this.getPropertyName());
            cmpVal = this.getCompareValue();
            if (_(val).isNumber()) {
              cmpVal = Number(cmpVal);
            }
            return cmp(val, cmpVal);
          }
        }
        return false;
      };
      return PropertyFilter;
    })();
  });
}).call(this);
