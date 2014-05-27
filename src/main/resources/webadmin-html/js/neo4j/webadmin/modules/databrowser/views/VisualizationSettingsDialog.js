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
  define(['neo4j/webadmin/utils/ItemUrlResolver', './visualizationSettings', 'ribcage/View', 'lib/amd/jQuery'], function(ItemUrlResolver, template, View, $) {
    var VisualizationSettingsDialog;
    return VisualizationSettingsDialog = (function() {
      __extends(VisualizationSettingsDialog, View);
      function VisualizationSettingsDialog() {
        this.render = __bind(this.render, this);
        this.position = __bind(this.position, this);
        this.save = __bind(this.save, this);
        this.initialize = __bind(this.initialize, this);
        VisualizationSettingsDialog.__super__.constructor.apply(this, arguments);
      }
      VisualizationSettingsDialog.prototype.className = "popout";
      VisualizationSettingsDialog.prototype.events = {
        "click #save-visualization-settings": "save"
      };
      VisualizationSettingsDialog.prototype.initialize = function(opts) {
        $("body").append(this.el);
        this.baseElement = opts.baseElement;
        this.closeCallback = opts.closeCallback;
        this.settings = opts.dataBrowserSettings;
        this.position();
        return this.render();
      };
      VisualizationSettingsDialog.prototype.save = function() {
        var key, keys;
        keys = $("#visualization-label-properties").val().split(",");
        keys = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            _results.push(key.trim());
          }
          return _results;
        })();
        this.settings.setLabelProperties(keys);
        return this.closeCallback();
      };
      VisualizationSettingsDialog.prototype.position = function() {
        var basePos, left, top;
        basePos = $(this.baseElement).offset();
        top = basePos.top + $(this.baseElement).outerHeight();
        left = basePos.left - ($(this.el).outerWidth() - $(this.baseElement).outerWidth());
        return $(this.el).css({
          position: "absolute",
          top: top + "px",
          left: left + "px"
        });
      };
      VisualizationSettingsDialog.prototype.render = function() {
        $(this.el).html(template({
          labels: this.settings.getLabelProperties().join(", ")
        }));
        return this;
      };
      return VisualizationSettingsDialog;
    })();
  });
}).call(this);
