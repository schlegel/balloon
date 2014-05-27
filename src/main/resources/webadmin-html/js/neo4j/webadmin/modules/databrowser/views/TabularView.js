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
  define(['./NodeView', './RelationshipView', './RelationshipListView', './NodeListView', './CypherResultView', 'neo4j/webadmin/modules/databrowser/models/DataBrowserState', 'ribcage/View', './notfound', 'lib/amd/jQuery'], function(NodeView, RelationshipView, RelationshipListView, NodeListView, CypherResultView, DataBrowserState, View, notFoundTemplate, $) {
    var SimpleView, State;
    State = DataBrowserState.State;
    return SimpleView = (function() {
      __extends(SimpleView, View);
      function SimpleView() {
        this.remove = __bind(this.remove, this);
        this.render = __bind(this.render, this);
        SimpleView.__super__.constructor.apply(this, arguments);
      }
      SimpleView.prototype.initialize = function(options) {
        this.dataModel = options.dataModel;
        this.nodeView = new NodeView({
          dataModel: this.dataModel
        });
        this.relationshipView = new RelationshipView({
          dataModel: this.dataModel
        });
        this.relationshipListView = new RelationshipListView;
        this.nodeListView = new NodeListView;
        this.cypherResultView = new CypherResultView;
        return this.dataModel.bind("change:data", this.render);
      };
      SimpleView.prototype.render = function() {
        var state, view;
        state = this.dataModel.getState();
        switch (state) {
          case State.SINGLE_NODE:
            view = this.nodeView;
            break;
          case State.NODE_LIST:
            view = this.nodeListView;
            break;
          case State.SINGLE_RELATIONSHIP:
            view = this.relationshipView;
            break;
          case State.RELATIONSHIP_LIST:
            view = this.relationshipListView;
            break;
          case State.CYPHER_RESULT:
            view = this.cypherResultView;
            break;
          case State.EMPTY:
            $(this.el).html(notFoundTemplate());
            return this;
          case State.NOT_EXECUTED:
            return this;
          case State.ERROR:
            return this;
        }
        view.setData(this.dataModel.getData());
        $(this.el).html(view.render().el);
        view.delegateEvents();
        return this;
      };
      SimpleView.prototype.remove = function() {
        this.dataModel.unbind("change", this.render);
        this.nodeView.remove();
        this.nodeListView.remove();
        this.relationshipView.remove();
        this.relationshipListView.remove();
        return SimpleView.__super__.remove.call(this);
      };
      return SimpleView;
    })();
  });
}).call(this);
