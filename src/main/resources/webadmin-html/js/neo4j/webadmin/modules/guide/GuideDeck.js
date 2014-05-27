(function() {
  /*
  Copyright (c) 2002-2011 "Neo Technology,"
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
  define(['./guide', 'ribcage/storage/CookieStorage', 'lib/amd/jQuery', 'neo4j/webadmin/modules/baseui/models/MainMenuModel', 'lib/amd/Deck'], function(template, CookieStorage, $, MainMenuModel, Deck) {
    var GuideDeck;
    return GuideDeck = (function() {
      GuideDeck.COOKIE_NAME = "guideShown2.0.2";
      function GuideDeck() {
        this.cookies = new CookieStorage;
      }
      GuideDeck.prototype.init = function() {
        this.guide = $(template());
        $("body").append(this.guide);
        $('.close-guide').click(__bind(function(event) {
          return this.hide();
        }, this));
        $('.start-guide').click(__bind(function(event) {
          return this.show();
        }, this));
        if (!this.hasBeenShownForThisSession()) {
          this.show("/webadmin/deck/welcome.html");
          return setTimeout(__bind(function() {
            return this.show();
          }, this), 3000);
        }
      };
      GuideDeck.prototype.hasBeenShownForThisSession = function() {
        return this.cookies.get(this.COOKIE_NAME) !== null;
      };
      GuideDeck.prototype.show = function(deckUrl) {
        deckUrl = deckUrl != null ? deckUrl : "/webadmin/deck/guide.html";
        $('.deck-container').load(deckUrl, __bind(function(responseTxt, statusTxt, xhr) {
          Deck('.slide');
          return $('.deck-url').click(__bind(function(event) {
            event.preventDefault();
            return this.show($(event.target).attr("href"));
          }, this));
        }, this));
        this.guide.fadeIn(200);
        return this.cookies.set(this.COOKIE_NAME, "1");
      };
      GuideDeck.prototype.hide = function() {
        this.clearDeck();
        return this.guide.fadeOut(400, __bind(function() {
          return this.cookies.set(this.COOKIE_NAME, "0");
        }, this));
      };
      GuideDeck.prototype.clearDeck = function() {
        $(document).unbind('keydown.deckscale');
        return $(document).unbind('keydown.deck');
      };
      return GuideDeck;
    })();
  });
}).call(this);
