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
  define(['./models/Console', './models/HttpConsole', './views/ShellConsoleView', './views/GremlinConsoleView', './views/HttpConsoleView', 'neo4j/webadmin/modules/baseui/models/MainMenuModel', 'ribcage/Router'], function(Console, HttpConsole, ShellConsoleView, GremlinConsoleView, HttpConsoleView, MainMenuModel, Router) {
    var ConsoleRouter;
    return ConsoleRouter = (function() {
      __extends(ConsoleRouter, Router);
      function ConsoleRouter() {
        this.showConsole = __bind(this.showConsole, this);
        this.init = __bind(this.init, this);
        ConsoleRouter.__super__.constructor.apply(this, arguments);
      }
      ConsoleRouter.prototype.routes = {
        "/console/": "showConsole",
        "/console/:type": "showConsole"
      };
      ConsoleRouter.prototype.consoleType = "http";
      ConsoleRouter.prototype.init = function(appState) {
        var self;
        this.appState = appState;
        this.menuItem = new MainMenuModel.Item({
          title: "Console",
          subtitle: "Power tool",
          url: "#/console/"
        });
        this.gremlinState = new Console({
          server: this.appState.get("server"),
          lang: "gremlin"
        });
        this.shellState = new Console({
          server: this.appState.get("server"),
          lang: "shell"
        });
        this.httpState = new HttpConsole({
          server: this.appState.get("server"),
          lang: "http"
        });
        self = this;
        return this.appState.getServer().manage.console.availableEngines(function(engines) {
          return self.onAvailableEnginesLoaded(engines);
        });
      };
      ConsoleRouter.prototype.showConsole = function(type) {
        var view;
        if (type == null) {
          type = false;
        }
        this.saveLocation();
        if (type === false) {
          type = this.consoleType;
        }
        this.consoleType = type;
        if (this.views != null) {
          if (this.views[type] != null) {
            view = this.views[type];
          } else {
            alert("Unsupported console type: '" + type + "', is it disabled in the server?.");
            view = this.views['http'];
          }
          this.appState.set({
            mainView: view
          });
          return view.focusOnInputField();
        } else {
          return this.renderWhenEnginesAreLoaded = true;
        }
      };
      ConsoleRouter.prototype.onAvailableEnginesLoaded = function(engines) {
        engines.push('http');
        this.views = {
          http: new HttpConsoleView({
            appState: this.appState,
            consoleState: this.httpState,
            lang: "http",
            engines: engines
          })
        };
        if (_(engines).indexOf('gremlin') > -1) {
          this.views.gremlin = new GremlinConsoleView({
            appState: this.appState,
            consoleState: this.gremlinState,
            lang: "gremlin",
            engines: engines
          });
        }
        if (_(engines).indexOf('shell') > -1) {
          this.views.shell = new ShellConsoleView({
            appState: this.appState,
            consoleState: this.shellState,
            lang: "shell",
            engines: engines
          });
          this.consoleType = "shell";
        }
        if (this.renderWhenEnginesAreLoaded != null) {
          return this.showConsole();
        }
      };
      ConsoleRouter.prototype.getMenuItems = function() {
        return [this.menuItem];
      };
      return ConsoleRouter;
    })();
  });
}).call(this);
