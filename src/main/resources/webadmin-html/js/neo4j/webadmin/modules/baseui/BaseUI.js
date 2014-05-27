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
  define(['./base', './MenuView', 'ribcage/View', 'lib/amd/jQuery'], function(template, MenuView, View, $) {
    var BaseView;
    return BaseView = (function() {
      __extends(BaseView, View);
      function BaseView() {
        this.remove = __bind(this.remove, this);
        this.onMainViewChanged = __bind(this.onMainViewChanged, this);
        this.init = __bind(this.init, this);
        BaseView.__super__.constructor.apply(this, arguments);
      }
      BaseView.prototype.template = template;
      BaseView.prototype.init = function(appState) {
        this.appState = appState;
        $("body").append(this.el);
        this.appState.bind('change:mainView', this.onMainViewChanged);
        return this.menuView = new MenuView(this.appState.getMainMenuModel());
      };
      BaseView.prototype.onMainViewChanged = function(event) {
        if (this.mainView != null) {
          this.mainView.detach();
        }
        this.mainView = event.attributes.mainView;
        return this.render();
      };
      BaseView.prototype.render = function() {
        $(this.el).html(this.template());
        this._renderMainView();
        this._renderMenu();
        $('#guide-button').click(__bind(function(event) {
          event.preventDefault();
          return this.guide.show();
        }, this));
        return this;
      };
      BaseView.prototype.remove = function() {
        this.appState.unbind('change:mainView', this.mainViewChanged);
        if (this.mainView != null) {
          this.mainView.remove();
        }
        return BaseView.__super__.remove.call(this);
      };
      BaseView.prototype._renderMainView = function() {
        if (this.mainView != null) {
          this.mainView.attach($("#contents"));
          return this.mainView.render();
        }
      };
      BaseView.prototype._renderMenu = function() {
        this.menuView.attach($("#mainmenu"));
        return this.menuView.render();
      };
      BaseView.prototype.useGuide = function(guide) {
        return this.guide = guide;
      };
      return BaseView;
    })();
  });
}).call(this);
