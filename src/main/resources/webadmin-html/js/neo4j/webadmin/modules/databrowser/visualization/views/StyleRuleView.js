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
  define(['neo4j/webadmin/utils/ItemUrlResolver', './styleRule', '../models/Filters', '../models/filters/PropertyFilter', 'ribcage/View', 'lib/amd/jQuery'], function(ItemUrlResolver, template, Filters, PropertyFilter, View, $) {
    var StyleRuleView;
    return StyleRuleView = (function() {
      __extends(StyleRuleView, View);
      function StyleRuleView() {
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        StyleRuleView.__super__.constructor.apply(this, arguments);
      }
      StyleRuleView.prototype.tagName = 'li';
      StyleRuleView.prototype.events = {
        "click button.remove": "deleteRule",
        "click button.addFilter": "addFilter",
        "change select.target": 'targetChanged'
      };
      StyleRuleView.prototype.initialize = function(opts) {
        this.rule = opts.rule;
        return this.rules = opts.rules;
      };
      StyleRuleView.prototype.render = function() {
        $(this.el).html(template());
        $('.target', this.el).val(this.rule.getTarget());
        this.filterContainer = $('.filters', this.el);
        this.rule.filters.each(__bind(function(filter) {
          return this.addFilterElement(filter);
        }, this));
        this.renderStyleView();
        return this;
      };
      StyleRuleView.prototype.renderStyleView = function() {
        var StyleView;
        StyleView = this.rule.getStyle().getViewClass();
        this.styleView = new StyleView({
          model: this.rule.getStyle()
        });
        return $('.ruleStyle', this.el).append(this.styleView.render().el);
      };
      StyleRuleView.prototype.targetChanged = function(ev) {
        return this.rule.setTarget($(ev.target).val());
      };
      StyleRuleView.prototype.deleteRule = function() {
        this.rules.remove(this.rule);
        return this.remove();
      };
      StyleRuleView.prototype.addFilter = function() {
        var filter;
        filter = new PropertyFilter;
        this.rule.filters.add(filter);
        return this.addFilterElement(filter);
      };
      StyleRuleView.prototype.addFilterElement = function(filter) {
        var FilterView, view;
        FilterView = filter.getViewClass();
        view = new FilterView({
          filter: filter,
          filters: this.rule.filters
        });
        return this.filterContainer.append(view.render().el);
      };
      StyleRuleView.prototype.validates = function() {
        return this.styleView.validates();
      };
      return StyleRuleView;
    })();
  });
}).call(this);
