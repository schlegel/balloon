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
  */  define(['lib/DateFormat', 'ribcage/security/HtmlEscaper'], function(DateFormat, HtmlEscaper) {
    /* Used to generate x-axis time ticks for
    time series charts.
    */
    var LineChartTimeTicker;
    return LineChartTimeTicker = (function() {
      LineChartTimeTicker.prototype.timezoneOffset = new Date().getTimezoneOffset() * 60;
      LineChartTimeTicker.prototype.scales = [
        {
          maxSpan: 31 * 60,
          tickLength: 5 * 60,
          dateFormat: "HH:MM",
          findFirstTickFrom: function(startTime) {
            var time, timezoneOffset;
            timezoneOffset = new Date().getTimezoneOffset();
            time = new Date((startTime + timezoneOffset * 60) * 1000);
            return new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, timezoneOffset, 0).getTime() / 1000;
          }
        }, {
          maxSpan: 7 * 60 * 60,
          tickLength: 60 * 60,
          dateFormat: "HH:MM",
          findFirstTickFrom: function(startTime) {
            var time, timezoneOffset;
            timezoneOffset = new Date().getTimezoneOffset();
            time = new Date((startTime + timezoneOffset * 60) * 1000);
            return new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, timezoneOffset, 0).getTime() / 1000;
          }
        }, {
          maxSpan: 25 * 60 * 60,
          tickLength: 6 * 60 * 60,
          dateFormat: "dddd HH:MM",
          findFirstTickFrom: function(startTime) {
            var time, timezoneOffset;
            timezoneOffset = new Date().getTimezoneOffset();
            time = new Date((startTime + timezoneOffset * 60) * 1000);
            return new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, timezoneOffset, 0).getTime() / 1000;
          }
        }, {
          maxSpan: 8 * 24 * 60 * 60,
          tickLength: 2 * 24 * 60 * 60,
          dateFormat: "dddd dd mmmm",
          findFirstTickFrom: function(startTime) {
            var time, timezoneOffset;
            timezoneOffset = new Date().getTimezoneOffset();
            time = new Date((startTime + timezoneOffset * 60) * 1000);
            return new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, timezoneOffset, 0).getTime() / 1000;
          }
        }, {
          maxSpan: 32 * 24 * 60 * 60,
          tickLength: 6 * 24 * 60 * 60,
          dateFormat: "dd mmmm",
          findFirstTickFrom: function(startTime) {
            var time, timezoneOffset;
            timezoneOffset = new Date().getTimezoneOffset();
            time = new Date((startTime + timezoneOffset * 60) * 1000);
            return new Date(time.getFullYear(), time.getMonth(), 0, 0, timezoneOffset, 1).getTime() / 1000;
          }
        }, {
          maxSpan: 370 * 24 * 60 * 60,
          tickLength: 60 * 24 * 60 * 60,
          dateFormat: "dd mmmm",
          findFirstTickFrom: function(startTime) {
            var time, timezoneOffset;
            timezoneOffset = new Date().getTimezoneOffset();
            time = new Date((startTime + timezoneOffset * 60) * 1000);
            return new Date(time.getFullYear(), time.getMonth(), 0, 0, timezoneOffset, 1).getTime() / 1000;
          }
        }
      ];
      function LineChartTimeTicker() {}
      /* Get an array of flot-formatted x-axis ticks
      appropriate for a given time span.
      
      Returns ticks in this format:
      
      [[0, "zero"], [1.2, "one mark"], [2.4, "two marks"]]
      */
      LineChartTimeTicker.prototype.getTicks = function(startTime, stopTime) {
        var currentPosition, label, scale, ticks;
        ticks = [];
        scale = this._getScaleFor(stopTime - startTime);
        currentPosition = scale.findFirstTickFrom(startTime);
        while (currentPosition <= stopTime) {
          if (currentPosition >= startTime) {
            label = DateFormat.format((currentPosition + this.timezoneOffset) * 1000, scale.dateFormat);
            ticks.push([currentPosition, label]);
          }
          currentPosition += scale.tickLength;
        }
        return ticks;
      };
      LineChartTimeTicker.prototype._getScaleFor = function(timeSpan) {
        var scale, _i, _len, _ref;
        _ref = this.scales;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          scale = _ref[_i];
          if (scale.maxSpan > timeSpan) {
            return scale;
          }
        }
        return this.scales[this.scales.length - 1];
      };
      return LineChartTimeTicker;
    })();
  });
}).call(this);
