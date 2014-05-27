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
  define(['./Filters', './style', 'ribcage/LocalModel'], function(Filters, style, LocalModel) {
    var NodeStyle, StyleRule;
    NodeStyle = style.NodeStyle;
    return StyleRule = (function() {
      __extends(StyleRule, LocalModel);
      function StyleRule() {
        StyleRule.__super__.constructor.apply(this, arguments);
      }
      StyleRule.prototype.defaults = {
        target: 'node',
        style: {},
        order: 0
      };
      StyleRule.prototype.initialize = function() {
        this.initNestedModel('filters', Filters);
        return this.initNestedModel('style', {
          deserialize: __bind(function(raw) {
            return new NodeStyle(raw);
          }, this)
        });
      };
      StyleRule.prototype.setTarget = function(target) {
        return this.set({
          target: target
        });
      };
      StyleRule.prototype.getTarget = function() {
        return this.get('target');
      };
      StyleRule.prototype.getStyle = function() {
        return this.style;
      };
      StyleRule.prototype.setStyle = function(s) {
        return this.style = s;
      };
      StyleRule.prototype.getOrder = function() {
        return this.get('order');
      };
      StyleRule.prototype.setOrder = function(order) {
        return this.set('order', order);
      };
      StyleRule.prototype.getTargetEntity = function() {
        return this.getTarget().split(':')[0];
      };
      StyleRule.prototype.getTargetEntityType = function() {
        return this.getTarget().split(':')[1];
      };
      StyleRule.prototype.hasTargetEntityType = function() {
        return this.getTarget().split(':').length > 1;
      };
      StyleRule.prototype.appliesTo = function(item, type) {
        var filter, _i, _len, _ref;
        if (type !== this.getTargetEntity() || (this.hasTargetEntityType() && item.type !== this.getTargetEntityType())) {
          return false;
        }
        _ref = this.filters.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (!filter.matches(item)) {
            return false;
          }
        }
        return true;
      };
      StyleRule.prototype.applyStyleTo = function(target) {
        style = this.getStyle();
        if (style != null) {
          return style.applyTo(target);
        }
      };
      return StyleRule;
    })();
  });
}).call(this);
