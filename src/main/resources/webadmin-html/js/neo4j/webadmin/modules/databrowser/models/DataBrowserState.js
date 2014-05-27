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
  define(['neo4j/webadmin/modules/databrowser/search/QueuedSearch', './NodeProxy', './NodeList', './RelationshipProxy', './RelationshipList', 'ribcage/time/Timer', 'ribcage/Model'], function(QueuedSearch, NodeProxy, NodeList, RelationshipProxy, RelationshipList, Timer, Model) {
    var DataBrowserState;
    return DataBrowserState = (function() {
      __extends(DataBrowserState, Model);
      function DataBrowserState() {
        this._reportError = __bind(this._reportError, this);
        this.setData = __bind(this.setData, this);
        this.executeCurrentQuery = __bind(this.executeCurrentQuery, this);
        this.setQuery = __bind(this.setQuery, this);
        this.getQueryMetadata = __bind(this.getQueryMetadata, this);
        this.getState = __bind(this.getState, this);
        this.getData = __bind(this.getData, this);
        this.getQuery = __bind(this.getQuery, this);
        this.initialize = __bind(this.initialize, this);
        DataBrowserState.__super__.constructor.apply(this, arguments);
      }
      DataBrowserState.State = {
        ERROR: -1,
        EMPTY: 0,
        NOT_EXECUTED: 1,
        SINGLE_NODE: 2,
        SINGLE_RELATIONSHIP: 3,
        NODE_LIST: 4,
        RELATIONSHIP_LIST: 5,
        CYPHER_RESULT: 6
      };
      DataBrowserState.QueryMetaData = (function() {
        __extends(QueryMetaData, Model);
        function QueryMetaData() {
          QueryMetaData.__super__.constructor.apply(this, arguments);
        }
        QueryMetaData.prototype.defaults = {
          executionTime: 0,
          numberOfRows: 0
        };
        QueryMetaData.prototype.getExecutionTime = function() {
          return this.get("executionTime");
        };
        QueryMetaData.prototype.getNumberOfRows = function() {
          return this.get("numberOfRows");
        };
        QueryMetaData.prototype.setExecutionTime = function(t) {
          return this.set({
            executionTime: t
          });
        };
        QueryMetaData.prototype.setNumberOfRows = function(n) {
          return this.set({
            numberOfRows: n
          });
        };
        return QueryMetaData;
      })();
      DataBrowserState.prototype.defaults = {
        data: null,
        query: "START root=node(0) // Start with the reference node\n" + "RETURN root        // and return it.\n" + "\n" + "// Hit CTRL+ENTER to execute",
        queryOutOfSyncWithData: true,
        state: DataBrowserState.State.NOT_EXECUTED,
        querymeta: new DataBrowserState.QueryMetaData()
      };
      DataBrowserState.prototype.initialize = function(options) {
        this.searcher = new QueuedSearch(options.server);
        return this._executionTimer = new Timer;
      };
      DataBrowserState.prototype.getQuery = function() {
        return this.get("query");
      };
      DataBrowserState.prototype.getData = function() {
        return this.get("data");
      };
      DataBrowserState.prototype.getState = function() {
        return this.get("state");
      };
      DataBrowserState.prototype.getQueryMetadata = function() {
        return this.get("querymeta");
      };
      DataBrowserState.prototype.setQuery = function(val, isForCurrentData, opts) {
        var state;
        if (isForCurrentData == null) {
          isForCurrentData = false;
        }
        if (opts == null) {
          opts = {};
        }
        if (this.getQuery() !== val || opts.force === true) {
          if (!isForCurrentData) {
            state = DataBrowserState.State.NOT_EXECUTED;
          } else {
            state = this.getState();
          }
          this.set({
            "query": val,
            "state": state,
            "queryOutOfSyncWithData": !isForCurrentData
          }, opts);
          if (state === DataBrowserState.State.NOT_EXECUTED) {
            return this.set({
              "data": null
            }, opts);
          }
        }
      };
      DataBrowserState.prototype.executeCurrentQuery = function() {
        this._executionTimer.start();
        return this.searcher.exec(this.getQuery()).then(this.setData, this.setData);
      };
      DataBrowserState.prototype.setData = function(result, basedOnCurrentQuery, opts) {
        var data, executionTime, numberOfRows, originalState, state;
        if (basedOnCurrentQuery == null) {
          basedOnCurrentQuery = true;
        }
        if (opts == null) {
          opts = {};
        }
        this._executionTimer.stop();
        executionTime = this._executionTimer.getTimePassed();
        originalState = this.getState();
        state = null;
        data = null;
        numberOfRows = null;
        if (result instanceof neo4j.models.Node) {
          state = DataBrowserState.State.SINGLE_NODE;
          data = new NodeProxy(result, this._reportError);
        } else if (result instanceof neo4j.models.Relationship) {
          state = DataBrowserState.State.SINGLE_RELATIONSHIP;
          data = new RelationshipProxy(result, this._reportError);
        } else if (_(result).isArray() && result.length === 0) {
          state = DataBrowserState.State.EMPTY;
        } else if (_(result).isArray() && result.length === 1) {
          return this.setData(result[0], basedOnCurrentQuery, opts);
        } else if (_(result).isArray()) {
          if (result[0] instanceof neo4j.models.Relationship) {
            state = DataBrowserState.State.RELATIONSHIP_LIST;
            data = new RelationshipList(result);
          } else if (result[0] instanceof neo4j.models.Node) {
            state = DataBrowserState.State.NODE_LIST;
            data = new NodeList(result);
          }
        } else if (result instanceof neo4j.cypher.QueryResult && result.size() === 0) {
          state = DataBrowserState.State.EMPTY;
        } else if (result instanceof neo4j.cypher.QueryResult) {
          state = DataBrowserState.State.CYPHER_RESULT;
          data = result;
        } else if (result instanceof neo4j.exceptions.NotFoundException) {
          state = DataBrowserState.State.EMPTY;
        } else {
          state = DataBrowserState.State.ERROR;
          data = result;
        }
        if (state !== DataBrowserState.State.ERROR) {
          this._updateQueryMetaData(data, executionTime);
        }
        this.set({
          "state": state,
          "data": data,
          "queryOutOfSyncWithData": !basedOnCurrentQuery
        }, {
          silent: true
        });
        if (!opts.silent) {
          this.trigger("change:data");
          if (originalState !== state) {
            return this.trigger("change:state");
          }
        }
      };
      DataBrowserState.prototype._reportError = function(error) {
        return this.setData(error);
      };
      DataBrowserState.prototype._updateQueryMetaData = function(data, executionTime) {
        var meta, numberOfRows;
        if (data != null) {
          if (data instanceof neo4j.cypher.QueryResult) {
            numberOfRows = data.data.length;
          } else {
            numberOfRows = data.length != null ? data.length : 1;
          }
        } else {
          numberOfRows = 0;
        }
        meta = this.getQueryMetadata();
        meta.setNumberOfRows(numberOfRows);
        meta.setExecutionTime(executionTime);
        return this.trigger("change:querymeta");
      };
      return DataBrowserState;
    })();
  });
}).call(this);
