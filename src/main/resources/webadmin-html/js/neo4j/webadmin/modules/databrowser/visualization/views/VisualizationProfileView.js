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
  define(['neo4j/webadmin/utils/ItemUrlResolver', './visualizationProfile', '../models/VisualizationProfile', '../models/StyleRule', './StyleRuleView', 'ribcage/View', 'lib/amd/jQuery', 'lib/amd/jQuery.sortable'], function(ItemUrlResolver, template, VisualizationProfile, StyleRule, StyleRuleView, View, $) {
    var VisualizationProfileView;
    return VisualizationProfileView = (function() {
      __extends(VisualizationProfileView, View);
      function VisualizationProfileView() {
        this.render = __bind(this.render, this);
        this.addStyleRule = __bind(this.addStyleRule, this);
        this.cancel = __bind(this.cancel, this);
        this.save = __bind(this.save, this);
        this.initialize = __bind(this.initialize, this);
        VisualizationProfileView.__super__.constructor.apply(this, arguments);
      }
      VisualizationProfileView.prototype.events = {
        "click button.save": "save",
        "click button.cancel": "cancel",
        "click button.addStyleRule": "addStyleRule"
      };
      VisualizationProfileView.prototype.initialize = function(opts) {
        this.profiles = opts.dataBrowserSettings.getVisualizationProfiles();
        this.settings = opts.dataBrowserSettings;
        this.browserState = opts.dataBrowserState;
        return this.styleViews = [];
      };
      VisualizationProfileView.prototype.save = function() {
        var name, ruleView, _i, _len, _ref;
        name = $('#profile-name', this.el).val();
        if (name.length === 0) {
          alert("Please enter a name for this profile.");
          return;
        }
        _ref = this.styleRuleViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ruleView = _ref[_i];
          if (!ruleView.validates()) {
            alert("There are errors in one or more of your style rules, please fix those before saving.");
            return;
          }
        }
        this.profile.setName(name);
        this._updateRuleOrderFromUI();
        if (this.isInCreateMode) {
          this.profiles.add(this.profile);
          this.settings.setCurrentVisualizationProfile(this.profile.id);
        }
        this.profile.save();
        return Backbone.history.navigate('#/data/search/' + this.browserState.getQuery(), true);
      };
      VisualizationProfileView.prototype.cancel = function() {
        return Backbone.history.navigate('#/data/search/' + this.browserState.getQuery(), true);
      };
      VisualizationProfileView.prototype.addStyleRule = function() {
        var rule;
        rule = new StyleRule();
        rule.setOrder(this.profile.styleRules.size());
        this.profile.styleRules.addLast(rule);
        return this.addStyleRuleElement(rule);
      };
      VisualizationProfileView.prototype.addStyleRuleElement = function(rule) {
        var li, view;
        view = new StyleRuleView({
          rule: rule,
          rules: this.profile.styleRules
        });
        this.styleRuleViews.push(view);
        li = $(view.render().el);
        li.attr('id', "styleRule_" + (rule.getOrder()));
        return this.styleRuleContainer.append(li);
      };
      VisualizationProfileView.prototype.render = function() {
        var sortId;
        $(this.el).html(template({
          name: this.profile.getName(),
          isInCreateMode: this.isInCreateMode
        }));
        this.styleRuleViews = [];
        this.styleRuleContainer = $('.styleRules', this.el);
        sortId = 0;
        this.profile.styleRules.each(__bind(function(rule) {
          return this.addStyleRuleElement(rule, sortId++);
        }, this));
        this.styleRuleContainer.sortable({
          handle: '.form-sort-handle'
        });
        return this;
      };
      VisualizationProfileView.prototype.setProfileToManage = function(profile) {
        this.profile = profile;
        return this.setIsCreateMode(false);
      };
      VisualizationProfileView.prototype.setIsCreateMode = function(isInCreateMode) {
        this.isInCreateMode = isInCreateMode;
        if (this.isInCreateMode) {
          return this.profile = new VisualizationProfile({
            name: "",
            styleRules: [{}]
          });
        }
      };
      VisualizationProfileView.prototype.hasUnsavedChanges = function() {
        return this.profile.name !== $('#profile-name', this.el).val();
      };
      VisualizationProfileView.prototype._updateRuleOrderFromUI = function() {
        var i, li, lis, order, rules, _ref;
        lis = this.styleRuleContainer.children();
        order = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = lis.length; _i < _len; _i++) {
            li = lis[_i];
            _results.push(Number(li.id.split('_')[1]));
          }
          return _results;
        })();
        rules = this.profile.styleRules;
        for (i = 0, _ref = order.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          rules.models[i].setOrder(order[i]);
        }
        return rules.sort();
      };
      return VisualizationProfileView;
    })();
  });
}).call(this);
