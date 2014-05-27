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
  define(['ribcage/View', 'neo4j/webadmin/utils/Keys', 'lib/amd/CodeMirror', './consoleTemplate', 'lib/amd/jQuery.putCursorAtEnd'], function(View, Keys, CodeMirror, template, $) {
    var ConsoleView;
    return ConsoleView = (function() {
      __extends(ConsoleView, View);
      function ConsoleView() {
        this._saveCurrentEditorContents = __bind(this._saveCurrentEditorContents, this);
        this._adjustEditorHeightToNumberOfNewlines = __bind(this._adjustEditorHeightToNumberOfNewlines, this);
        this.onDataModelQueryChanged = __bind(this.onDataModelQueryChanged, this);
        this.onPaste = __bind(this.onPaste, this);
        this.onKeyUp = __bind(this.onKeyUp, this);
        this.onKeyPress = __bind(this.onKeyPress, this);
        this.onKeyEvent = __bind(this.onKeyEvent, this);
        this.onSearchClicked = __bind(this.onSearchClicked, this);
        this.focusOnEditor = __bind(this.focusOnEditor, this);
        this.render = __bind(this.render, this);
        ConsoleView.__super__.constructor.apply(this, arguments);
      }
      ConsoleView.prototype.template = template;
      ConsoleView.prototype.events = {
        "paste #data-console": "onPaste",
        "click #data-execute-console": "onSearchClicked"
      };
      ConsoleView.prototype.initialize = function(options) {
        this.dataModel = options.dataModel;
        return this.dataModel.bind("change:query", this.onDataModelQueryChanged);
      };
      ConsoleView.prototype.render = function() {
        $(this.el).html(template());
        this._editor = CodeMirror($("#data-console").get(0), {
          value: this.dataModel.getQuery(),
          onKeyEvent: this.onKeyEvent,
          mode: "text"
        });
        if (typeof document !== "undefined" && document !== null) {
          document.dataBrowserEditor = this._editor;
        }
        this._adjustEditorHeightToNumberOfNewlines();
        return this.el;
      };
      ConsoleView.prototype.focusOnEditor = function() {
        var end, start;
        if (this._editor != null) {
          this._editor.focus();
          start = {
            line: 0,
            ch: 0
          };
          end = {
            line: this._editor.lineCount() - 1,
            ch: this._editor.getLine(this._editor.lineCount() - 1).length
          };
          return this._editor.setSelection(start, end);
        }
      };
      ConsoleView.prototype.onSearchClicked = function(ev) {
        return this._executeQuery(this._getEditorValue());
      };
      ConsoleView.prototype.onKeyEvent = function(editor, ev) {
        switch (ev.type) {
          case "keyup":
            return this.onKeyUp(ev);
          case "keypress":
            return this.onKeyPress(ev);
        }
      };
      ConsoleView.prototype.onKeyPress = function(ev) {
        if (ev.which === Keys.ENTER && ev.ctrlKey || ev.which === 10) {
          ev.stop();
          return this._executeQuery(this._getEditorValue());
        }
      };
      ConsoleView.prototype.onKeyUp = function(ev) {
        this._adjustEditorHeightToNumberOfNewlines();
        return this._saveCurrentEditorContents();
      };
      ConsoleView.prototype.onPaste = function(ev) {
        setTimeout(this._adjustEditorHeightToNumberOfNewlines, 0);
        return setTimeout(this._saveCurrentEditorContents, 0);
      };
      ConsoleView.prototype.onDataModelQueryChanged = function(ev) {
        if (this.dataModel.getQuery() !== this._getEditorValue()) {
          return this.render();
        }
      };
      ConsoleView.prototype._saveQueryInModel = function(query) {
        return this.dataModel.setQuery(query, false);
      };
      ConsoleView.prototype._executeQuery = function(query) {
        this._saveQueryInModel(query);
        this.dataModel.trigger("change:query");
        return this.dataModel.executeCurrentQuery();
      };
      ConsoleView.prototype._adjustEditorHeightToNumberOfNewlines = function() {
        return this._setEditorLines(this._newlinesIn(this._getEditorValue()) + 1);
      };
      ConsoleView.prototype._saveCurrentEditorContents = function() {
        return this._saveQueryInModel(this._getEditorValue());
      };
      ConsoleView.prototype._setEditorLines = function(numberOfLines) {
        var height;
        height = 10 + 14 * numberOfLines;
        $(".CodeMirror-scroll", this.el).css("height", height);
        return this._editor.refresh();
      };
      ConsoleView.prototype._getEditorValue = function() {
        return this._editor.getValue();
      };
      ConsoleView.prototype._setEditorValue = function(v) {
        return this._editor.setValue(v);
      };
      ConsoleView.prototype._newlinesIn = function(string) {
        if (string.match(/\n/g)) {
          return string.match(/\n/g).length;
        } else {
          return 0;
        }
      };
      return ConsoleView;
    })();
  });
}).call(this);
