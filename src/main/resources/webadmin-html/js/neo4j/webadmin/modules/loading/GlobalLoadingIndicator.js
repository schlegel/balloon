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
  define(['lib/amd/jQuery'], function($) {
    var GlobalLoadingIndicator;
    return GlobalLoadingIndicator = (function() {
      function GlobalLoadingIndicator(target) {
        this.target = target != null ? target : "#global-loading-indicator";
        this.hide = __bind(this.hide, this);
        this.show = __bind(this.show, this);
        this.onAjaxComplete = __bind(this.onAjaxComplete, this);
        this.onAjaxSend = __bind(this.onAjaxSend, this);
        this.runningRequests = 0;
      }
      GlobalLoadingIndicator.prototype.init = function() {
        $(window).ajaxSend(this.onAjaxSend);
        return $(window).ajaxComplete(this.onAjaxComplete);
      };
      GlobalLoadingIndicator.prototype.onAjaxSend = function() {
        this.runningRequests++;
        if (this.runningRequests === 1) {
          return this.timeout = setTimeout(this.show, 1000);
        }
      };
      GlobalLoadingIndicator.prototype.onAjaxComplete = function() {
        this.runningRequests--;
        if (this.runningRequests <= 0) {
          this.runningRequests = 0;
          clearTimeout(this.timeout);
          return this.hide();
        }
      };
      GlobalLoadingIndicator.prototype.show = function() {
        return $(this.target).show();
      };
      GlobalLoadingIndicator.prototype.hide = function() {
        return $(this.target).hide();
      };
      return GlobalLoadingIndicator;
    })();
  });
}).call(this);
