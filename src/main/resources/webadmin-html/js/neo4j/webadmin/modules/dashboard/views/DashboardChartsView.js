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
  define(['ribcage/ui/LineChart', 'ribcage/ui/LineChartTimeTicker', 'ribcage/View', './charts', 'lib/amd/jQuery'], function(LineChart, LineChartTimeTicker, View, template, $) {
    var DashboardChartsView;
    return DashboardChartsView = (function() {
      __extends(DashboardChartsView, View);
      function DashboardChartsView() {
        this.unbind = __bind(this.unbind, this);
        this.bind = __bind(this.bind, this);
        this.remove = __bind(this.remove, this);
        this.highlightZoomTab = __bind(this.highlightZoomTab, this);
        this.highlightChartSwitchTab = __bind(this.highlightChartSwitchTab, this);
        this.switchZoomClicked = __bind(this.switchZoomClicked, this);
        this.switchChartClicked = __bind(this.switchChartClicked, this);
        this.redrawChart = __bind(this.redrawChart, this);
        this.redrawAllCharts = __bind(this.redrawAllCharts, this);
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        DashboardChartsView.__super__.constructor.apply(this, arguments);
      }
      DashboardChartsView.prototype.template = template;
      DashboardChartsView.prototype.events = {
        'click .switch-dashboard-chart': 'switchChartClicked',
        'click .switch-dashboard-zoom': 'switchZoomClicked'
      };
      DashboardChartsView.prototype.initialize = function(opts) {
        this.statistics = opts.statistics;
        this.dashboardState = opts.dashboardState;
        this.timeTicker = new LineChartTimeTicker();
        return this.bind();
      };
      DashboardChartsView.prototype.render = function() {
        $(this.el).html(this.template());
        this.monitorChart = new LineChart($("#monitor-chart"));
        this.redrawAllCharts();
        this.highlightChartSwitchTab(this.dashboardState.getChartKey());
        this.highlightZoomTab(this.dashboardState.getZoomLevelKey());
        return this;
      };
      DashboardChartsView.prototype.redrawAllCharts = function() {
        return this.redrawChart(this.monitorChart, "primitives");
      };
      DashboardChartsView.prototype.redrawChart = function(chart, name) {
        var chartDef, data, endTime, i, metricKeys, metrics, settings, startTime, v, zoomLevel;
        if (chart != null) {
          chartDef = this.dashboardState.getChart(name);
          zoomLevel = this.dashboardState.getZoomLevel();
          metricKeys = (function() {
            var _i, _len, _ref, _results;
            _ref = chartDef.layers;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              v = _ref[_i];
              _results.push(v.key);
            }
            return _results;
          })();
          endTime = Math.round(new Date().getTime() / 1000) - this.statistics.timezoneOffset;
          startTime = endTime - zoomLevel.xSpan;
          metrics = this.statistics.getMetrics(metricKeys, startTime, zoomLevel.granularity);
          data = (function() {
            var _ref, _results;
            _results = [];
            for (i = 0, _ref = metrics.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
              _results.push(_.extend({
                data: metrics[i]
              }, chartDef.layers[i]));
            }
            return _results;
          })();
          settings = {
            xaxis: {
              min: startTime,
              ticks: this.timeTicker.getTicks(startTime, endTime)
            }
          };
          return chart.render(data, _.extend(chartDef.chartSettings || {}, settings));
        }
      };
      DashboardChartsView.prototype.switchChartClicked = function(ev) {
        this.highlightChartSwitchTab($(ev.target).val());
        return this.dashboardState.setChartByKey($(ev.target).val());
      };
      DashboardChartsView.prototype.switchZoomClicked = function(ev) {
        this.highlightZoomTab($(ev.target).val());
        return this.dashboardState.setZoomLevelByKey($(ev.target).val());
      };
      DashboardChartsView.prototype.highlightChartSwitchTab = function(tabKey) {
        $("button.switch-dashboard-chart", this.el).removeClass("current");
        return $("button.switch-dashboard-chart[value='" + tabKey + "']", this.el).addClass("current");
      };
      DashboardChartsView.prototype.highlightZoomTab = function(tabKey) {
        $("button.switch-dashboard-zoom", this.el).removeClass("current");
        return $("button.switch-dashboard-zoom[value='" + tabKey + "']", this.el).addClass("current");
      };
      DashboardChartsView.prototype.remove = function() {
        this.unbind();
        if (this.monitorChart != null) {
          this.monitorChart.remove();
        }
        return DashboardChartsView.__super__.remove.call(this);
      };
      DashboardChartsView.prototype.bind = function() {
        this.dashboardState.bind("change:chart", this.redrawAllCharts);
        this.dashboardState.bind("change:zoomLevel", this.redrawAllCharts);
        return this.statistics.bind("change:metrics", this.redrawAllCharts);
      };
      DashboardChartsView.prototype.unbind = function() {
        this.dashboardState.unbind("change:chart", this.redrawAllCharts);
        this.dashboardState.unbind("change:zoomLevel", this.redrawAllCharts);
        return this.statistics.unbind("change:metrics", this.redrawAllCharts);
      };
      return DashboardChartsView;
    })();
  });
}).call(this);
