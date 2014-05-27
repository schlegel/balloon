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
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(['ribcage/Model', 'lib/amd/Underscore'], function(Model, _) {
    var MainMenuModel;
    return MainMenuModel = (function() {
      __extends(MainMenuModel, Model);
      MainMenuModel.Item = (function() {
        __extends(Item, Model);
        function Item() {
          Item.__super__.constructor.apply(this, arguments);
        }
        Item.prototype.getTitle = function() {
          return this.get("title");
        };
        Item.prototype.getSubtitle = function() {
          return this.get("subtitle");
        };
        Item.prototype.getUrl = function() {
          return this.get("url");
        };
        Item.prototype.setUrl = function(url) {
          return this.set({
            "url": url
          });
        };
        return Item;
      })();
      function MainMenuModel() {
        MainMenuModel.__super__.constructor.call(this);
        this._items = [];
      }
      MainMenuModel.prototype.addMenuItem = function(item) {
        this._items.push(item);
        this.trigger("change:items");
        return item.bind("change", __bind(function() {
          return this.trigger("change:items");
        }, this));
      };
      MainMenuModel.prototype.getMenuItems = function() {
        return this._items;
      };
      MainMenuModel.prototype.getCurrentItem = function() {
        var item, url, _i, _len, _ref;
        url = location.hash;
        _ref = _(this.getMenuItems()).sortBy(function(i) {
          return -i.getUrl().length;
        });
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (url.indexOf(item.getUrl()) === 0 || (url.length === 0 && item.getUrl() === "#")) {
            return item;
          }
        }
        return null;
      };
      return MainMenuModel;
    })();
  });
}).call(this);
