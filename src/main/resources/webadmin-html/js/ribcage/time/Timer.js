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
  */  define([], function() {
    var Timer;
    return Timer = (function() {
      function Timer() {}
      Timer.prototype.start = function() {
        return this._startTime = new Date().getTime();
      };
      Timer.prototype.stop = function() {
        return this._stopTime = new Date().getTime();
      };
      Timer.prototype.getTimePassed = function() {
        return this._stopTime - this._startTime;
      };
      return Timer;
    })();
  });
}).call(this);
