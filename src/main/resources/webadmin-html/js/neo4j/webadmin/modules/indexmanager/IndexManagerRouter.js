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
  define(['./views/IndexManagerView', './models/IndexManager', 'neo4j/webadmin/modules/baseui/models/MainMenuModel', 'ribcage/Router'], function(IndexManagerView, IndexManager, MainMenuModel, Router) {
    var IndexManagerRouter;
    return IndexManagerRouter = (function() {
      __extends(IndexManagerRouter, Router);
      function IndexManagerRouter() {
        this.getIndexManagerView = __bind(this.getIndexManagerView, this);
        this.idxManager = __bind(this.idxManager, this);
        this.init = __bind(this.init, this);
        IndexManagerRouter.__super__.constructor.apply(this, arguments);
      }
      IndexManagerRouter.prototype.routes = {
        "/index/": "idxManager"
      };
      IndexManagerRouter.prototype.init = function(appState) {
        this.appState = appState;
        this.menuItem = new MainMenuModel.Item({
          title: "Indexes",
          subtitle: "Add and remove",
          url: "#/index/"
        });
        return this.idxMgr = new IndexManager({
          server: this.appState.get("server")
        });
      };
      IndexManagerRouter.prototype.idxManager = function() {
        this.saveLocation();
        return this.appState.set({
          mainView: this.getIndexManagerView()
        });
      };
      IndexManagerRouter.prototype.getIndexManagerView = function() {
        var _ref;
        return (_ref = this.view) != null ? _ref : this.view = new IndexManagerView({
          state: this.appState,
          idxMgr: this.idxMgr
        });
      };
      IndexManagerRouter.prototype.getMenuItems = function() {
        return [this.menuItem];
      };
      return IndexManagerRouter;
    })();
  });
}).call(this);
