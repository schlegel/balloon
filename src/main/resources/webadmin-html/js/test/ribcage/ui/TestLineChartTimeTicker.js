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
  */  define(['ribcage/ui/LineChartTimeTicker'], function(LineChartTimeTicker) {
    var expectTicksToBe;
    expectTicksToBe = function(ticks, expected) {
      var expectedTick, gotTick, _i, _len, _results;
      expect(ticks.length).toBe(expected.length);
      _results = [];
      for (_i = 0, _len = expected.length; _i < _len; _i++) {
        expectedTick = expected[_i];
        gotTick = ticks.shift(0);
        expect(expectedTick[0]).toBe(gotTick[0]);
        _results.push(expect(expectedTick[0]).toBe(gotTick[0]));
      }
      return _results;
    };
    return describe("LineChartTimeTicker", function() {
      it("formats ticks with 30-minute scale appropriately", function() {
        var expected, max, min, ticker, ticks;
        ticker = new LineChartTimeTicker(5);
        min = 1335381282;
        max = 1335383082;
        ticks = ticker.getTicks(min, max);
        expected = [[1335381300, '19:15'], [1335381600, '19:20'], [1335381900, '19:25'], [1335382200, '19:30'], [1335382500, '19:35'], [1335382800, '19:40']];
        return expectTicksToBe(ticks, expected);
      });
      return it("formats ticks with 6-hour scale appropriately", function() {
        var expected, max, min, ticker, ticks;
        ticker = new LineChartTimeTicker(5);
        min = 1335361496;
        max = 1335383096;
        ticks = ticker.getTicks(min, max);
        expected = [[1335362400, '14:00'], [1335366000, '15:00'], [1335369600, '16:00'], [1335373200, '17:00'], [1335376800, '18:00'], [1335380400, '19:00']];
        return expectTicksToBe(ticks, expected);
      });
    });
  });
}).call(this);
