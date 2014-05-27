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
  /*
  A quick hack to get a standalone version
  of the graph visualization.
  */
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./standaloneVisualization', './DataBrowserView', 'ribcage/View', 'lib/amd/jQuery'], function(template, DataBrowserView, View, $) {
    var StandaloneVisualizationView;
    return StandaloneVisualizationView = (function() {
      __extends(StandaloneVisualizationView, View);
      function StandaloneVisualizationView() {
        this.remove = __bind(this.remove, this);
        StandaloneVisualizationView.__super__.constructor.apply(this, arguments);
      }
      StandaloneVisualizationView.prototype.template = template;
      StandaloneVisualizationView.prototype.initialize = function(opts) {
        this.dbView = new DataBrowserView(opts);
        return this.dbView.switchToVisualizedView();
      };
      StandaloneVisualizationView.prototype.render = function() {
        $(this.el).html(this.template());
        this.dbView.attach($("#contents"));
        this.dbView.render();
        return this;
      };
      StandaloneVisualizationView.prototype.remove = function() {
        return StandaloneVisualizationView.__super__.remove.call(this);
      };
      return StandaloneVisualizationView;
    })();
  });
}).call(this);
