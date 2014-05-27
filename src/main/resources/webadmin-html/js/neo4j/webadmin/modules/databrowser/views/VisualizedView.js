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
  define(['neo4j/webadmin/modules/databrowser/visualization/VisualGraph', 'neo4j/webadmin/modules/databrowser/DataBrowserSettings', 'neo4j/webadmin/utils/ItemUrlResolver', './VisualizationSettingsDialog', 'ribcage/View', 'ribcage/security/HtmlEscaper', './visualization', 'ribcage/ui/Dropdown', 'neo4j/webadmin/modules/databrowser/models/DataBrowserState'], function(VisualGraph, DataBrowserSettings, ItemUrlResolver, VisualizationSettingsDialog, View, HtmlEscaper, template, Dropdown, DataBrowserState) {
    var ProfilesDropdown, State, VisualizedView;
    State = DataBrowserState.State;
    ProfilesDropdown = (function() {
      __extends(ProfilesDropdown, Dropdown);
      function ProfilesDropdown(profiles, settings) {
        this.profiles = profiles;
        this.settings = settings;
        this.deleteProfile = __bind(this.deleteProfile, this);
        ProfilesDropdown.__super__.constructor.call(this);
      }
      ProfilesDropdown.prototype.getItems = function() {
        var items;
        items = [];
        items.push(this.title("Profiles"));
        this.profiles.each(__bind(function(profile) {
          return items.push(this.actionable(this.renderProfileItem(profile), __bind(function(ev) {
            this.settings.setCurrentVisualizationProfile(profile.id);
            this.render();
            return ev.stopPropagation();
          }, this)));
        }, this));
        items.push(this.item("<a class='micro-button' href='#/data/visualization/settings/profile/'>New profile</a><div class='break'></div>"));
        return items;
      };
      ProfilesDropdown.prototype.renderProfileItem = function(profile) {
        var buttons, currentClass, currentProfileId, deleteButton, editButton, profileButton, wrap;
        currentProfileId = this.settings.getCurrentVisualizationProfile().id;
        if (currentProfileId === profile.id) {
          currentClass = 'selected';
        } else {
          currentClass = '';
        }
        profileButton = $("<span class='" + currentClass + "'>" + (profile.getName()) + "</span>");
        if (!profile.isDefault()) {
          editButton = $("<a class='micro-button' href='#/data/visualization/settings/profile/" + profile.id + "/'>Edit</a>");
          editButton.click(this.hide);
          deleteButton = $("<div class='bad-button micro-button'>Remove</div>");
          deleteButton.click(__bind(function(ev) {
            this.deleteProfile(profile);
            this.render();
            return ev.stopPropagation();
          }, this));
          buttons = $("<div class='dropdown-controls'></div>");
          buttons.append(editButton);
          buttons.append(deleteButton);
          wrap = $('<div></div>');
          wrap.append(profileButton);
          wrap.append(buttons);
          return wrap;
        }
        return profileButton;
      };
      ProfilesDropdown.prototype.deleteProfile = function(profile) {
        var currentProfileId;
        if (confirm("Are you sure?")) {
          currentProfileId = this.settings.getCurrentVisualizationProfile().id;
          if (profile.id === currentProfileId) {
            this.settings.setCurrentVisualizationProfile(this.profiles.first());
          }
          this.profiles.remove(profile);
          return this.profiles.save();
        }
      };
      return ProfilesDropdown;
    })();
    return VisualizedView = (function() {
      __extends(VisualizedView, View);
      function VisualizedView() {
        this.attach = __bind(this.attach, this);
        this.detach = __bind(this.detach, this);
        this.remove = __bind(this.remove, this);
        this.clearVisualization = __bind(this.clearVisualization, this);
        this.reflowGraphLayout = __bind(this.reflowGraphLayout, this);
        this.getViz = __bind(this.getViz, this);
        this.render = __bind(this.render, this);
        VisualizedView.__super__.constructor.apply(this, arguments);
      }
      VisualizedView.prototype.events = {
        'click #visualization-reflow': "reflowGraphLayout",
        'click #visualization-profiles-button': "showProfilesDropdown",
        'click #visualization-clear': "clearVisualization"
      };
      VisualizedView.prototype.initialize = function(options) {
        this.server = options.server;
        this.appState = options.appState;
        this.dataModel = options.dataModel;
        this.settings = new DataBrowserSettings(this.appState.getSettings());
        this.dataModel.bind("change:data", this.render);
        return this.settings.onCurrentVisualizationProfileChange(__bind(function() {
          return this.getViz().setProfile(this.settings.getCurrentVisualizationProfile());
        }, this));
      };
      VisualizedView.prototype.render = function() {
        if (this.vizEl != null) {
          this.getViz().detach();
        }
        $(this.el).html(template());
        this.vizEl = $("#visualization", this.el);
        this.getViz().attach(this.vizEl);
        switch (this.dataModel.getState()) {
          case State.SINGLE_NODE:
            this.visualizeFromNode(this.dataModel.getData().getItem());
            break;
          case State.NODE_LIST:
            this.visualizeFromNodes(this.dataModel.getData().getRawNodes());
            break;
          case State.SINGLE_RELATIONSHIP:
            this.visualizeFromRelationships([this.dataModel.getData().getItem()]);
            break;
          case State.RELATIONSHIP_LIST:
            this.visualizeFromRelationships(this.dataModel.getData().getRawRelationships());
            break;
          case State.CYPHER_RESULT:
            return this;
          case State.EMPTY:
            return this;
          case State.NOT_EXECUTED:
            return this;
          case State.ERROR:
            return this;
        }
        return this;
      };
      VisualizedView.prototype.showProfilesDropdown = function() {
        var _ref;
        if ((_ref = this._profilesDropdown) == null) {
          this._profilesDropdown = new ProfilesDropdown(this.settings.getVisualizationProfiles(), this.settings);
        }
        if (this._profilesDropdown.isVisible()) {
          return this._profilesDropdown.hide();
        } else {
          return this._profilesDropdown.renderFor($("#visualization-profiles-button"));
        }
      };
      VisualizedView.prototype.visualizeFromNode = function(node) {
        return this.getViz().addNode(node);
      };
      VisualizedView.prototype.visualizeFromNodes = function(nodes) {
        return this.getViz().addNodes(nodes);
      };
      VisualizedView.prototype.visualizeFromRelationships = function(rels) {
        var MAX, allNodes, i, nodeDownloadChecklist, nodePromises, rel, _ref;
        MAX = 10;
        nodeDownloadChecklist = {};
        nodePromises = [];
        for (i = 0, _ref = rels.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          rel = rels[i];
          if (i >= MAX) {
            alert("Only showing the first ten in the set, to avoid crashing the visualization. We're working on adding filtering here!");
            break;
          }
          if (!(nodeDownloadChecklist[rel.getStartNodeUrl()] != null)) {
            nodeDownloadChecklist[rel.getStartNodeUrl()] = true;
            nodePromises.push(rel.getStartNode());
          }
          if (!(nodeDownloadChecklist[rel.getEndNodeUrl()] != null)) {
            nodeDownloadChecklist[rel.getStartNodeUrl()] = true;
            nodePromises.push(rel.getEndNode());
          }
        }
        allNodes = neo4j.Promise.join.apply(this, nodePromises);
        return allNodes.then(__bind(function(nodes) {
          return this.getViz().addNodes(nodes);
        }, this));
      };
      VisualizedView.prototype.getViz = function() {
        var height, profile, width, _ref;
        width = $(document).width() - 40;
        height = $(document).height() - 160;
        profile = this.settings.getCurrentVisualizationProfile();
        if ((_ref = this.viz) == null) {
          this.viz = new VisualGraph(this.server, profile, width, height);
        }
        return this.viz;
      };
      VisualizedView.prototype.reflowGraphLayout = function() {
        if (this.viz != null) {
          return this.viz.reflow();
        }
      };
      VisualizedView.prototype.clearVisualization = function() {
        return this.viz.clear();
      };
      VisualizedView.prototype.remove = function() {
        this.dataModel.unbind("change:data", this.render);
        this.getViz().stop();
        return VisualizedView.__super__.remove.call(this);
      };
      VisualizedView.prototype.detach = function() {
        this.dataModel.unbind("change:data", this.render);
        this.getViz().stop();
        return VisualizedView.__super__.detach.call(this);
      };
      VisualizedView.prototype.attach = function(parent) {
        VisualizedView.__super__.attach.call(this, parent);
        if (this.vizEl != null) {
          this.getViz().start();
          return this.dataModel.bind("change:data", this.render);
        }
      };
      return VisualizedView;
    })();
  });
}).call(this);
