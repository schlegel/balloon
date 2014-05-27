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
  define(['./views/DashboardView', './models/ServerPrimitives', './models/DiskUsage', './models/CacheUsage', './models/ServerStatistics', './models/DashboardState', './models/KernelBean', 'neo4j/webadmin/modules/baseui/models/MainMenuModel', 'ribcage/Router'], function(DashboardView, ServerPrimitives, DiskUsage, CacheUsage, ServerStatistics, DashboardState, KernelBean, MainMenuModel, Router) {
    var DashboardRouter;
    return DashboardRouter = (function() {
      __extends(DashboardRouter, Router);
      function DashboardRouter() {
        this.getDashboardState = __bind(this.getDashboardState, this);
        this.getServerStatistics = __bind(this.getServerStatistics, this);
        this.getDiskUsage = __bind(this.getDiskUsage, this);
        this.getKernelBean = __bind(this.getKernelBean, this);
        this.getServerPrimitives = __bind(this.getServerPrimitives, this);
        this.getDashboardView = __bind(this.getDashboardView, this);
        this.dashboard = __bind(this.dashboard, this);
        this.init = __bind(this.init, this);
        DashboardRouter.__super__.constructor.apply(this, arguments);
      }
      DashboardRouter.prototype.routes = {
        "": "dashboard"
      };
      DashboardRouter.prototype.init = function(appState) {
        this.appState = appState;
        return this.menuItem = new MainMenuModel.Item({
          title: "Dashboard",
          subtitle: "Overview",
          url: "#"
        });
      };
      DashboardRouter.prototype.dashboard = function() {
        this.saveLocation();
        return this.appState.set({
          mainView: this.getDashboardView()
        });
      };
      DashboardRouter.prototype.getDashboardView = function() {
        var _ref;
        return (_ref = this.view) != null ? _ref : this.view = new DashboardView({
          state: this.appState,
          dashboardState: this.getDashboardState(),
          primitives: this.getServerPrimitives(),
          diskUsage: this.getDiskUsage(),
          statistics: this.getServerStatistics(),
          kernelBean: this.getKernelBean()
        });
      };
      DashboardRouter.prototype.getServerPrimitives = function() {
        var _ref;
        return (_ref = this.serverPrimitives) != null ? _ref : this.serverPrimitives = new ServerPrimitives({
          server: this.appState.getServer(),
          pollingInterval: 5000
        });
      };
      DashboardRouter.prototype.getKernelBean = function() {
        var _ref;
        return (_ref = this.kernelBean) != null ? _ref : this.kernelBean = new KernelBean({
          server: this.appState.getServer(),
          pollingInterval: 10000
        });
      };
      DashboardRouter.prototype.getDiskUsage = function() {
        var _ref;
        return (_ref = this.diskUsage) != null ? _ref : this.diskUsage = new DiskUsage({
          server: this.appState.getServer(),
          pollingInterval: 5000
        });
      };
      DashboardRouter.prototype.getServerStatistics = function() {
        var _ref;
        return (_ref = this.serverStatistics) != null ? _ref : this.serverStatistics = new ServerStatistics({
          server: this.appState.getServer()
        });
      };
      DashboardRouter.prototype.getDashboardState = function() {
        var _ref;
        return (_ref = this.dashboardState) != null ? _ref : this.dashboardState = new DashboardState({
          server: this.appState.getServer()
        });
      };
      DashboardRouter.prototype.getMenuItems = function() {
        return [this.menuItem];
      };
      return DashboardRouter;
    })();
  });
}).call(this);
