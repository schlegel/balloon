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
  define(['./cypherResult', 'ribcage/View', 'lib/amd/jQuery'], function(template, View, $) {
    var CypherResultView;
    return CypherResultView = (function() {
      __extends(CypherResultView, View);
      function CypherResultView() {
        this.setData = __bind(this.setData, this);
        this.render = __bind(this.render, this);
        CypherResultView.__super__.constructor.apply(this, arguments);
      }
      CypherResultView.prototype.render = function() {
        $(this.el).html(template({
          result: this.queryResult,
          id: function(entity) {
            return entity.self.substr(entity.self.lastIndexOf("/") + 1);
          }
        }));
        return this;
      };
      CypherResultView.prototype.setData = function(queryResult) {
        return this.queryResult = queryResult;
      };
      return CypherResultView;
    })();
  });
}).call(this);
