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
  define(['neo4j/webadmin/utils/ItemUrlResolver', './TabularView', './VisualizedView', './ConsoleView', './CreateRelationshipDialog', 'neo4j/webadmin/modules/databrowser/models/DataBrowserState', 'ribcage/View', './base', './queryMetadataTemplate', './notExecutedTemplate', './errorTemplate', 'lib/amd/jQuery'], function(ItemUrlResolver, TabularView, VisualizedView, ConsoleView, CreateRelationshipDialog, DataBrowserState, View, template, queryMetadataTemplate, notExecutedTemplate, errorTemplate, $) {
    var DataBrowserView, State;
    State = DataBrowserState.State;
    return DataBrowserView = (function() {
      __extends(DataBrowserView, View);
      function DataBrowserView() {
        this.canVisualize = __bind(this.canVisualize, this);
        this.remove = __bind(this.remove, this);
        this.switchToTabularView = __bind(this.switchToTabularView, this);
        this.switchToVisualizedView = __bind(this.switchToVisualizedView, this);
        this.switchView = __bind(this.switchView, this);
        this.hideCreateRelationshipDialog = __bind(this.hideCreateRelationshipDialog, this);
        this.createRelationship = __bind(this.createRelationship, this);
        this.createNode = __bind(this.createNode, this);
        this.renderDataView = __bind(this.renderDataView, this);
        this.renderQueryMetadataView = __bind(this.renderQueryMetadataView, this);
        this.renderConsoleView = __bind(this.renderConsoleView, this);
        this.detachConsoleView = __bind(this.detachConsoleView, this);
        this.render = __bind(this.render, this);
        this.focusOnEditor = __bind(this.focusOnEditor, this);
        DataBrowserView.__super__.constructor.apply(this, arguments);
      }
      DataBrowserView.prototype.template = template;
      DataBrowserView.prototype.events = {
        "click #data-create-node": "createNode",
        "click #data-create-relationship": "createRelationship",
        "click #data-switch-view": "switchView"
      };
      DataBrowserView.prototype.initialize = function(options) {
        this.dataModel = options.dataModel;
        this.appState = options.state;
        this.server = options.state.getServer();
        this.urlResolver = new ItemUrlResolver(this.server);
        this.consoleView = new ConsoleView(options);
        this.dataModel.bind("change:querymeta", this.renderQueryMetadataView);
        this.dataModel.bind("change:state", this.renderQueryMetadataView);
        return this.switchToTabularView();
      };
      DataBrowserView.prototype.focusOnEditor = function() {
        if (this.consoleView != null) {
          return this.consoleView.focusOnEditor();
        }
      };
      DataBrowserView.prototype.render = function() {
        this.detachConsoleView();
        $(this.el).html(this.template({
          viewType: this.viewType
        }));
        this.renderConsoleView();
        this.renderDataView();
        return this.renderQueryMetadataView();
      };
      DataBrowserView.prototype.detachConsoleView = function() {
        return this.consoleView.detach();
      };
      DataBrowserView.prototype.renderConsoleView = function() {
        this.consoleView.attach($("#data-console-area", this.el));
        if (!this.consoleViewRendered) {
          this.consoleViewRendered = true;
          this.consoleView.render();
        }
        return this;
      };
      DataBrowserView.prototype.renderQueryMetadataView = function() {
        var metaBar;
        metaBar = $("#data-query-metadata", this.el);
        switch (this.dataModel.getState()) {
          case State.NOT_EXECUTED:
            metaBar.html(notExecutedTemplate());
            return this;
          case State.ERROR:
            this.renderError(this.dataModel.getData());
            return this;
          default:
            metaBar.html(queryMetadataTemplate({
              meta: this.dataModel.getQueryMetadata()
            }));
        }
        return this;
      };
      DataBrowserView.prototype.renderDataView = function() {
        this.dataView.attach($("#data-area", this.el).empty());
        this.dataView.render();
        return this;
      };
      DataBrowserView.prototype.renderError = function(error) {
        var description, monospaceDescription, stackTraceToString, title;
        title = "Unknown error";
        description = "An unknown error occurred, was unable to retrieve a result for you.";
        monospaceDescription = null;
        stackTraceToString = function(stacktrace) {
          if (stacktrace != null) {
            return "StackTrace:\n" + (stacktrace.join('\n'));
          } else {
            return null;
          }
        };
        if (error instanceof neo4j.exceptions.HttpException) {
          if (error.data.exception === "SyntaxException") {
            title = "Invalid query";
            description = null;
            monospaceDescription = error.data.message;
          } else if (error.data.exception === "PropertyValueException") {
            title = "Issue with property value";
            description = error.data.message;
          } else if (error.data.fullname.indexOf("org.neo4j.cypher") === 0) {
            title = "Cypher error";
            description = error.data.message;
          } else {
            title = error.data.exception;
            description = error.data.message;
            monospaceDescription = stackTraceToString(error.data.stacktrace);
          }
        }
        return $("#data-query-metadata", this.el).html(errorTemplate({
          "title": title,
          "description": description,
          "monospaceDescription": monospaceDescription
        }));
      };
      DataBrowserView.prototype.createNode = function() {
        return this.server.node({}).then(__bind(function(node) {
          var id;
          id = this.urlResolver.extractNodeId(node.getSelf());
          this.dataModel.setQuery(id);
          return this.dataModel.executeCurrentQuery();
        }, this));
      };
      DataBrowserView.prototype.createRelationship = function() {
        var button;
        if (this.createRelationshipDialog != null) {
          return this.hideCreateRelationshipDialog();
        } else {
          button = $("#data-create-relationship");
          button.addClass("selected");
          return this.createRelationshipDialog = new CreateRelationshipDialog({
            baseElement: button,
            dataModel: this.dataModel,
            server: this.server,
            closeCallback: this.hideCreateRelationshipDialog
          });
        }
      };
      DataBrowserView.prototype.hideCreateRelationshipDialog = function() {
        if (this.createRelationshipDialog != null) {
          this.createRelationshipDialog.remove();
          delete this.createRelationshipDialog;
          return $("#data-create-relationship").removeClass("selected");
        }
      };
      DataBrowserView.prototype.switchView = function(ev) {
        if (this.viewType === "visualized") {
          if (ev != null) {
            $(ev.target).removeClass("tabular");
          }
          this.switchToTabularView();
        } else if (this.canVisualize()) {
          if (ev != null) {
            $(ev.target).addClass("tabular");
          }
          this.switchToVisualizedView();
        } else {
          alert("Apologies, while I can see you have beautiful data, I can't render any of it in this browser.");
        }
        return this.renderDataView();
      };
      DataBrowserView.prototype.switchToVisualizedView = function() {
        var _ref;
        if (this.dataView != null) {
          this.dataView.detach();
        }
        if ((_ref = this.visualizedView) == null) {
          this.visualizedView = new VisualizedView({
            dataModel: this.dataModel,
            appState: this.appState,
            server: this.server
          });
        }
        this.viewType = "visualized";
        return this.dataView = this.visualizedView;
      };
      DataBrowserView.prototype.switchToTabularView = function() {
        var _ref;
        if (this.dataView != null) {
          this.dataView.detach();
        }
        if ((_ref = this.tabularView) == null) {
          this.tabularView = new TabularView({
            dataModel: this.dataModel,
            appState: this.appState,
            server: this.server
          });
        }
        this.viewType = "tabular";
        return this.dataView = this.tabularView;
      };
      DataBrowserView.prototype.detach = function() {
        this.hideCreateRelationshipDialog();
        if (this.dataView != null) {
          this.dataView.detach();
        }
        if (this.consoleView != null) {
          this.consoleView.detach();
        }
        return DataBrowserView.__super__.detach.call(this);
      };
      DataBrowserView.prototype.remove = function() {
        this.hideCreateRelationshipDialog();
        return this.dataView.remove();
      };
      DataBrowserView.prototype.canVisualize = function() {
        return !($('html').hasClass('ie7') || $('html').hasClass('ie8'));
      };
      return DataBrowserView;
    })();
  });
}).call(this);
