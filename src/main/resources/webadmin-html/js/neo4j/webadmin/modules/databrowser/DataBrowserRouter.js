(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./search/QueuedSearch', './views/DataBrowserView', './visualization/views/VisualizationSettingsView', './visualization/views/VisualizationProfileView', './models/DataBrowserState', './DataBrowserSettings', 'neo4j/webadmin/modules/baseui/models/MainMenuModel', 'ribcage/Router'], function(QueuedSearch, DataBrowserView, VisualizationSettingsView, VisualizationProfileView, DataBrowserState, DataBrowserSettings, MainMenuModel, Router) {
    var DataBrowserRouter;
    return DataBrowserRouter = (function() {
      __extends(DataBrowserRouter, Router);
      function DataBrowserRouter() {
        this.getVisualizationProfileView = __bind(this.getVisualizationProfileView, this);
        this.getDataBrowserView = __bind(this.getDataBrowserView, this);
        this.onDataChangedInModel = __bind(this.onDataChangedInModel, this);
        this.onQueryChangedInModel = __bind(this.onQueryChangedInModel, this);
        this.onViewTypeToggleShortcut = __bind(this.onViewTypeToggleShortcut, this);
        this.onEditorFocusShortcut = __bind(this.onEditorFocusShortcut, this);
        this.editVisualizationProfile = __bind(this.editVisualizationProfile, this);
        this.createVisualizationProfile = __bind(this.createVisualizationProfile, this);
        this.visualizationSettings = __bind(this.visualizationSettings, this);
        this.search = __bind(this.search, this);
        this.init = __bind(this.init, this);
        DataBrowserRouter.__super__.constructor.apply(this, arguments);
      }
      DataBrowserRouter.prototype.routes = {
        "/data/visualization/settings/": "visualizationSettings",
        "/data/visualization/settings/profile/": "createVisualizationProfile",
        "/data/visualization/settings/profile/:id/": "editVisualizationProfile"
      };
      DataBrowserRouter.prototype.shortcuts = {
        "s": "onEditorFocusShortcut",
        "v": "onViewTypeToggleShortcut"
      };
      DataBrowserRouter.prototype.init = function(appState) {
        this.route(/data\/search\/([\s\S]*)/i, 'search', this.search);
        this.appState = appState;
        this.dataModel = new DataBrowserState({
          server: this.appState.getServer()
        });
        this.dataModel.bind("change:query", this.onQueryChangedInModel);
        this.dataModel.bind("change:data", this.onDataChangedInModel);
        return this.menuItem = new MainMenuModel.Item({
          title: "Data browser",
          subtitle: "Explore and edit",
          url: this._getCurrentQueryURI()
        });
      };
      DataBrowserRouter.prototype.search = function(query) {
        this.saveLocation();
        query = decodeURIComponent(query);
        while (query.charAt(query.length - 1) === "/") {
          query = query.substr(0, query.length - 1);
        }
        this.dataModel.setQuery(query);
        this.appState.set({
          mainView: this.getDataBrowserView()
        });
        if (this._looksLikeReadOnlyQuery(query)) {
          return this.dataModel.executeCurrentQuery();
        }
      };
      DataBrowserRouter.prototype.visualizationSettings = function() {
        var _ref;
        this.saveLocation();
        if ((_ref = this.visualizationSettingsView) == null) {
          this.visualizationSettingsView = new VisualizationSettingsView({
            dataBrowserSettings: this.getDataBrowserSettings()
          });
        }
        return this.appState.set({
          mainView: this.visualizationSettingsView
        });
      };
      DataBrowserRouter.prototype.createVisualizationProfile = function() {
        var v;
        this.saveLocation();
        v = this.getVisualizationProfileView();
        v.setIsCreateMode(true);
        return this.appState.set({
          mainView: v
        });
      };
      DataBrowserRouter.prototype.editVisualizationProfile = function(id) {
        var profile, profiles, v;
        this.saveLocation();
        profiles = this.getDataBrowserSettings().getVisualizationProfiles();
        profile = profiles.get(id);
        v = this.getVisualizationProfileView();
        v.setProfileToManage(profile);
        return this.appState.set({
          mainView: v
        });
      };
      DataBrowserRouter.prototype.getMenuItems = function() {
        return [this.menuItem];
      };
      DataBrowserRouter.prototype.onEditorFocusShortcut = function(ev) {
        this.search(this.dataModel.getQuery());
        return setTimeout((__bind(function() {
          return this.getDataBrowserView().focusOnEditor();
        }, this)), 1);
      };
      DataBrowserRouter.prototype.onViewTypeToggleShortcut = function(ev) {
        return this.getDataBrowserView().switchView();
      };
      DataBrowserRouter.prototype.onQueryChangedInModel = function() {
        var url;
        url = this._getCurrentQueryURI();
        return this.menuItem.setUrl(url);
      };
      DataBrowserRouter.prototype.onDataChangedInModel = function() {
        var url;
        url = this._getCurrentQueryURI();
        if (location.hash !== url) {
          return location.hash = url;
        }
      };
      DataBrowserRouter.prototype.getDataBrowserView = function() {
        var _ref;
        return (_ref = this.view) != null ? _ref : this.view = new DataBrowserView({
          state: this.appState,
          dataModel: this.dataModel
        });
      };
      DataBrowserRouter.prototype.getVisualizationProfileView = function() {
        var _ref;
        return (_ref = this.visualizationProfileView) != null ? _ref : this.visualizationProfileView = new VisualizationProfileView({
          dataBrowserSettings: this.getDataBrowserSettings(),
          dataBrowserState: this.dataModel
        });
      };
      DataBrowserRouter.prototype.getDataBrowserSettings = function() {
        var _ref;
        return (_ref = this.dataBrowserSettings) != null ? _ref : this.dataBrowserSettings = new DataBrowserSettings(this.appState.getSettings());
      };
      DataBrowserRouter.prototype._looksLikeReadOnlyQuery = function(query) {
        var pattern;
        pattern = /^((start\s+[a-z]+=node\(\d+\)\s+return\s+[a-z]+)|((node:)?\d+)|(rel:\d+)|(rels:\d+))$/i;
        return pattern.test(query);
      };
      DataBrowserRouter.prototype._getCurrentQueryURI = function() {
        var query;
        query = this.dataModel.getQuery();
        return "#/data/search/" + (encodeURIComponent(query)) + "/";
      };
      return DataBrowserRouter;
    })();
  });
}).call(this);
