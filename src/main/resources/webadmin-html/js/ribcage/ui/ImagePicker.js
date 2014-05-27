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
    var ImagePicker;
    ImagePicker = (function() {
      __extends(ImagePicker, View);
      ImagePicker.prototype.tagName = "ul";
      function ImagePicker(imgUrls, cols) {
        this.imgUrls = imgUrls;
        this.cols = cols != null ? cols : 8;
        this.imageClicked = __bind(this.imageClicked, this);
        ImagePicker.__super__.constructor.call(this);
        this.el = $(this.el);
        this.el.addClass("image-picker");
        this.el.addClass("grid");
      }
      ImagePicker.prototype.render = function() {
        var i, li, ul, url, _fn, _ref;
        this.el.html("");
        _fn = __bind(function(url) {
          return li.click(__bind(function() {
            return this.imageClicked(url);
          }, this));
        }, this);
        for (i = 0, _ref = this.imgUrls.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          if (i % this.cols === 0) {
            ul = $('<ul></ul>');
            li = $('<li></li>');
            li.append(ul);
            this.el.append(li);
          }
          url = this.imgUrls[i];
          li = $("<li><div class='imagepicker-image' style='background:url(" + url + ") no-repeat center center;'><div/></li>");
          _fn(url);
          ul.append(li);
        }
        return this;
      };
      ImagePicker.prototype.imageClicked = function(url) {
        return this.trigger("image:clicked", {
          url: url
        });
      };
      return ImagePicker;
    })();
    _(ImagePicker.prototype).extend(Backbone.Events);
    return ImagePicker;
  });
}).call(this);
