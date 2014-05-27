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
  define(['./menuTemplate', 'ribcage/View', 'lib/amd/jQuery'], function(template, View, $) {
    var MenuView;
    return MenuView = (function() {
      __extends(MenuView, View);
      MenuView.prototype.template = template;
      MenuView.prototype.tagName = "ul";
      function MenuView(menuModel) {
        this.menuModel = menuModel;
        this.remove = __bind(this.remove, this);
        this.render = __bind(this.render, this);
        this.onMenuChange = __bind(this.onMenuChange, this);
        this.menuModel.bind('change', this.onMenuChange);
        MenuView.__super__.constructor.call(this);
      }
      MenuView.prototype.onMenuChange = function(event) {
        return this.render();
      };
      MenuView.prototype.render = function() {
        $(this.el).html(this.template({
          menuitems: this.menuModel.getMenuItems(),
          current: this.menuModel.getCurrentItem()
        }));
        return this;
      };
      MenuView.prototype.remove = function() {
        this.menuModel.unbind('change', this.onMenuChange);
        return MenuView.__super__.remove.call(this);
      };
      return MenuView;
    })();
  });
}).call(this);
