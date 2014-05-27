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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(['./connection_lost', 'lib/amd/jQuery'], function(template, $) {
    var CONNECTION_LOST_EVENT, ConnectionMonitor;
    CONNECTION_LOST_EVENT = "web.connection_lost";
    return ConnectionMonitor = (function() {
      function ConnectionMonitor() {
        this.connectionLost = __bind(this.connectionLost, this);
        this.visible = __bind(this.visible, this);
      }
      ConnectionMonitor.prototype.visible = function() {
        return this.connectionLostSplash.is(":visible");
      };
      ConnectionMonitor.prototype.init = function(appState) {
        var splash;
        this.db = appState.getServer();
        this.db.bind(CONNECTION_LOST_EVENT, this.connectionLost);
        this.db.heartbeat.addListener(function() {});
        splash = $(template());
        this.connectionLostSplash = splash;
        $("body").append(splash);
        return setTimeout((function() {
          return splash.hide();
        }), 0);
      };
      ConnectionMonitor.prototype.connectionLost = function() {
        var hideSplash;
        if (!this.visible()) {
          this.connectionLostSplash.fadeIn(200);
          hideSplash = __bind(function() {
            return this.connectionLostSplash.fadeOut(200);
          }, this);
          return this.db.heartbeat.waitForPulse(hideSplash);
        }
      };
      return ConnectionMonitor;
    })();
  });
}).call(this);
