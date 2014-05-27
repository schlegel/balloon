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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(["neo4j/webadmin/ApplicationState", "ribcage/security/HtmlEscaper", "lib/amd/Backbone", "lib/amd/neo4js"], function(ApplicationState, HtmlEscaper, Backbone, neo4js) {
    var Bootstrapper;
    return Bootstrapper = (function() {
      function Bootstrapper() {}
      Bootstrapper.prototype.injectedModules = [];
      Bootstrapper.prototype.bootstrap = function(modules) {
        var htmlEscaper;
        htmlEscaper = new HtmlEscaper();
        window.htmlEscape = htmlEscaper.escape;
        jQuery.ajaxSetup({
          timeout: 1000 * 60 * 60 * 6
        });
        this.appState = new ApplicationState;
        this.appState.set({
          server: new neo4js.GraphDatabase(location.protocol + "//" + location.host)
        });
        return jQuery(__bind(function() {
          var module, _i, _len, _ref;
          _ref = modules.concat(this.injectedModules);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            module = _ref[_i];
            this._initModule(module);
          }
          return Backbone.history.start();
        }, this));
      };
      Bootstrapper.prototype.inject = function(module) {
        return this.injectedModules.push(module);
      };
      Bootstrapper.prototype._initModule = function(module) {
        var item, mainMenu, _i, _len, _ref, _results;
        mainMenu = this.appState.getMainMenuModel();
        module.init(this.appState);
        if (module.getMenuItems != null) {
          _ref = module.getMenuItems();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(mainMenu.addMenuItem(item));
          }
          return _results;
        }
      };
      return Bootstrapper;
    })();
  });
}).call(this);
