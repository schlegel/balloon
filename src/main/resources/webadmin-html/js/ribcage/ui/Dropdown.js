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
  define(['ribcage/View'], function(View) {
    var Dropdown;
    return Dropdown = (function() {
      __extends(Dropdown, View);
      function Dropdown() {
        this.clickedAnywhere = __bind(this.clickedAnywhere, this);
        this.activateHideOnClickAnywhere = __bind(this.activateHideOnClickAnywhere, this);
        this.hide = __bind(this.hide, this);
        this.isVisible = __bind(this.isVisible, this);        Dropdown.__super__.constructor.call(this);
        this.el = $(this.el);
        this.el.hide();
        this.el.addClass("dropdown");
        this.listElement = $('<ul></ul>');
        this.el.append(this.listElement);
        $('body').append(this.el);
      }
      Dropdown.prototype.isVisible = function() {
        return this.el.is(":visible");
      };
      Dropdown.prototype.hide = function() {
        return this.el.hide();
      };
      Dropdown.prototype.render = function() {
        var li, _i, _len, _ref;
        this.listElement.html('');
        _ref = this.getItems();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          li = _ref[_i];
          this.listElement.append(li);
        }
        return this;
      };
      Dropdown.prototype.renderFor = function(target) {
        this.render();
        this.positionFor(target);
        this.el.show();
        return setTimeout(this.activateHideOnClickAnywhere, 0);
      };
      Dropdown.prototype.positionFor = function(target) {
        var left, ph, pw, th, top, tw, wh, ww, _ref;
        target = $(target);
        _ref = target.offset(), left = _ref.left, top = _ref.top;
        th = target.outerHeight();
        tw = target.outerWidth();
        ww = $(window).width();
        wh = $(window).height();
        pw = this.el.outerWidth();
        ph = this.el.outerHeight();
        if (left + pw > ww) {
          left = left - (pw - tw);
        }
        if (top + ph > wh && !top - ph < 0) {
          top = top - (th + ph);
        }
        return this.el.css({
          position: "absolute",
          top: top + th,
          left: left
        });
      };
      Dropdown.prototype.activateHideOnClickAnywhere = function() {
        return $('body').bind('click', this.clickedAnywhere);
      };
      Dropdown.prototype.clickedAnywhere = function() {
        $('body').unbind('click', this.clickedAnywhere);
        return this.hide();
      };
      Dropdown.prototype.title = function(title) {
        return "<li><h3>" + (htmlEscape(title)) + "</h3></li>";
      };
      Dropdown.prototype.divider = function() {
        return "<li><hr /></li>";
      };
      Dropdown.prototype.actionable = function(contents, clickhandler) {
        var el;
        el = $("<li class='actionable'></li>");
        el.click(clickhandler);
        el.append(contents);
        return el;
      };
      Dropdown.prototype.item = function(contents) {
        var el;
        el = $("<li></li>");
        el.append(contents);
        return el;
      };
      return Dropdown;
    })();
  });
}).call(this);
