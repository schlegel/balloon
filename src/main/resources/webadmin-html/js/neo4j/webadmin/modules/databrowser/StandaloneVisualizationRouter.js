(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./search/QueuedSearch', './views/StandaloneVisualizationView', './models/DataBrowserState', 'ribcage/Router'], function(QueuedSearch, StandaloneVisualizationView, DataBrowserState, Router) {
    var StandaloneVisualizationRouter;
    return StandaloneVisualizationRouter = (function() {
      __extends(StandaloneVisualizationRouter, Router);
      function StandaloneVisualizationRouter() {
        this.getView = __bind(this.getView, this);
        this.showResult = __bind(this.showResult, this);
        this.queryChanged = __bind(this.queryChanged, this);
        this.focusOnSearchField = __bind(this.focusOnSearchField, this);
        this.search = __bind(this.search, this);
        this.base = __bind(this.base, this);
        this.init = __bind(this.init, this);
        StandaloneVisualizationRouter.__super__.constructor.apply(this, arguments);
      }
      StandaloneVisualizationRouter.prototype.routes = {
        "": "base",
        "/search/*query": "search"
      };
      StandaloneVisualizationRouter.prototype.shortcuts = {
        "s": "focusOnSearchField"
      };
      StandaloneVisualizationRouter.prototype.init = function(appState) {
        this.appState = appState;
        this.server = appState.get("server");
        this.searcher = new QueuedSearch(this.server);
        this.dataModel = new DataBrowserState({
          server: this.server
        });
        this.dataModel.bind("change:query", this.queryChanged);
        return $("body").append(this.getView().el);
      };
      StandaloneVisualizationRouter.prototype.base = function() {
        return this.queryChanged();
      };
      StandaloneVisualizationRouter.prototype.search = function(query) {
        query = decodeURIComponent(query);
        while (query.charAt(query.length - 1) === "/") {
          query = query.substr(0, query.length - 1);
        }
        this.dataModel.setQuery(query);
        return this.getView().render();
      };
      StandaloneVisualizationRouter.prototype.focusOnSearchField = function(ev) {
        this.base();
        return setTimeout(function() {
          $("#data-console").val("");
          return $("#data-console").focus();
        }, 1);
      };
      StandaloneVisualizationRouter.prototype.queryChanged = function() {
        var query, url;
        query = this.dataModel.get("query");
        if (query === null) {
          return this.search("0");
        }
        url = "#/search/" + (encodeURIComponent(query)) + "/";
        if (location.hash !== url) {
          location.hash = url;
        }
        if (this.dataModel.get("queryOutOfSyncWithData")) {
          return this.searcher.exec(this.dataModel.get("query")).then(this.showResult, this.showResult);
        }
      };
      StandaloneVisualizationRouter.prototype.showResult = function(result) {
        return this.dataModel.setData(result);
      };
      StandaloneVisualizationRouter.prototype.getView = function() {
        var _ref;
        return (_ref = this.view) != null ? _ref : this.view = new StandaloneVisualizationView({
          state: this.appState,
          dataModel: this.dataModel
        });
      };
      return StandaloneVisualizationRouter;
    })();
  });
}).call(this);
