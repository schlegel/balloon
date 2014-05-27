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
  define(['lib/amd/arb-or', 'lib/amd/Backbone', 'lib/amd/jQuery'], function(arbor, Backbone, $) {
    var Renderer;
    return Renderer = (function() {
      /*
            Based on the Halfviz renderer from Arbor.js
            */      function Renderer(canvas, relationshipStyler) {
        this.relationshipStyler = relationshipStyler;
        this.intersect_line_box = __bind(this.intersect_line_box, this);
        this.intersect_line_line = __bind(this.intersect_line_line, this);
        this.thesePointsAreReallyClose = __bind(this.thesePointsAreReallyClose, this);
        this.ghostify = __bind(this.ghostify, this);
        this.ptInBox = __bind(this.ptInBox, this);
        this.intersectingNode = __bind(this.intersectingNode, this);
        this.nodeDropped = __bind(this.nodeDropped, this);
        this.nodeDragged = __bind(this.nodeDragged, this);
        this.clicked = __bind(this.clicked, this);
        this.stop = __bind(this.stop, this);
        this.start = __bind(this.start, this);
        this.initMouseHandling = __bind(this.initMouseHandling, this);
        this.renderEdge = __bind(this.renderEdge, this);
        this.renderNode = __bind(this.renderNode, this);
        this.redraw = __bind(this.redraw, this);
        this.init = __bind(this.init, this);
        this.canvas = $(canvas).get(0);
        this.bgColor = "#EEEEEE";
        if (!this.canvas.getContext) {
          this.canvas = window.G_vmlCanvasManager.initElement(this.canvas);
        }
        this.ctx = this.canvas.getContext("2d");
        this.gfx = arbor.Graphics(this.canvas);
        _.extend(this, Backbone.Events);
      }
      Renderer.prototype.init = function(system) {
        this.particleSystem = system;
        this.particleSystem.screenSize(this.canvas.width, this.canvas.height);
        this.particleSystem.screenStep(0.000);
        this.particleSystem.screenPadding(40);
        return this.initMouseHandling();
      };
      Renderer.prototype.redraw = function() {
        if (!this.particleSystem || this.stopped === true) {
          return;
        }
        this.gfx.clear();
        this.nodeBoxes = {};
        this.particleSystem.eachNode(this.renderNode);
        return this.particleSystem.eachEdge(this.renderEdge);
      };
      Renderer.prototype.renderNode = function(node, pt) {
        var centerX, centerY, d, fadeStyle, fontSize, h, icon, k, label, labelSize, labels, lineHeight, ns, style, v, w, yOffset, _i, _j, _len, _len2, _ref, _ref2, _results;
        if (node.data.hidden === true) {
          return;
        }
        style = node.data.style;
        labels = [];
        fontSize = style.labelStyle.size;
        lineHeight = Math.ceil(fontSize + fontSize / 5);
        this.ctx.font = "" + fontSize + "px " + style.labelStyle.font;
        w = fontSize;
        h = Math.floor(fontSize - fontSize / 5);
        _ref = ("" + style.labelText).split(";");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          label = _ref[_i];
          labelSize = this.ctx.measureText("" + label);
          if ((labelSize.width + fontSize) > w) {
            w = labelSize.width + fontSize;
          }
          h += fontSize;
          labels.push(label);
        }
        if (labels.length > 0) {
          pt.x = Math.floor(pt.x);
          pt.y = Math.floor(pt.y);
        } else {
          labels = null;
        }
        ns = style.shapeStyle;
        if (this.hovered && node._id === this.hovered._id) {
          ns = {};
          _ref2 = style.shapeStyle;
          for (k in _ref2) {
            v = _ref2[k];
            ns[k] = v;
          }
          ns.stroke = {
            r: 0xff,
            g: 0,
            b: 0,
            a: node.data.alpha
          };
        }
        if (ns.shape === 'dot') {
          d = w > h ? w : h;
          this.gfx.oval(pt.x - d / 2, pt.y - d / 2, d, d, ns);
          this.nodeBoxes[node.name] = [pt.x - d / 2, pt.y - d / 2, d, d];
        } else if (ns.shape === 'icon') {
          icon = style.icon;
          centerX = pt.x - icon.width / 2;
          centerY = pt.y - icon.height / 2;
          try {
            icon = style.icon;
            this.ctx.drawImage(icon, centerX, centerY);
            if (ns.alpha != null) {
              fadeStyle = {
                alpha: 1 - ns.alpha,
                fill: this.bgColor
              };
              this.gfx.rect(centerX, centerY, icon.width, icon.height, 0, fadeStyle);
            }
          } catch (e) {

          }
          this.nodeBoxes[node.name] = [centerX, centerY, icon.width, icon.height];
        } else {
          this.gfx.rect(pt.x - w / 2, pt.y - h / 2, w, h, 4, ns);
          this.nodeBoxes[node.name] = [pt.x - w / 2, pt.y - h / 2, w, h];
        }
        if (labels) {
          this.ctx.textAlign = "center";
          this.ctx.fillStyle = style.labelStyle.color;
          if (style.shapeStyle.shape === 'icon') {
            yOffset = h + 2;
          } else {
            yOffset = (h / -2) + lineHeight;
          }
          _results = [];
          for (_j = 0, _len2 = labels.length; _j < _len2; _j++) {
            label = labels[_j];
            this.ctx.fillText(label || "", pt.x, pt.y + yOffset);
            _results.push(yOffset += lineHeight);
          }
          return _results;
        }
      };
      Renderer.prototype.renderEdge = function(edge, pt1, pt2) {
        var arrowLength, arrowWidth, dx, head, style, tail, wt;
        if (edge.data.hidden === true) {
          return;
        }
        style = this.relationshipStyler.getStyleFor(edge);
        tail = this.intersect_line_box(pt1, pt2, this.nodeBoxes[edge.source.name]);
        if (tail === false) {
          return;
        }
        head = this.intersect_line_box(tail, pt2, this.nodeBoxes[edge.target.name]);
        if (head === false) {
          return;
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = style.edgeStyle.width;
        this.ctx.strokeStyle = style.edgeStyle.color;
        this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
        this.ctx.moveTo(tail.x, tail.y);
        this.ctx.lineTo(head.x, head.y);
        this.ctx.stroke();
        this.ctx.restore();
        if (edge.data.directed) {
          this.ctx.save();
          wt = style.edgeStyle.width;
          arrowLength = 6 + wt;
          arrowWidth = 2 + wt;
          this.ctx.fillStyle = style.edgeStyle.color;
          this.ctx.translate(head.x, head.y);
          this.ctx.rotate(Math.atan2(head.y - tail.y, head.x - tail.x));
          this.ctx.clearRect(-arrowLength / 2, -wt / 2, arrowLength / 2, wt);
          this.ctx.beginPath();
          this.ctx.moveTo(-arrowLength, arrowWidth);
          this.ctx.lineTo(0, 0);
          this.ctx.lineTo(-arrowLength, -arrowWidth);
          this.ctx.lineTo(-arrowLength * 0.8, -0);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.restore();
        }
        if (style.labelText) {
          this.ctx.save();
          this.ctx.font = style.labelStyle.font;
          this.ctx.translate(head.x, head.y);
          dx = head.x - tail.x;
          if (dx < 0) {
            this.ctx.textAlign = "left";
            this.ctx.rotate(Math.atan2(head.y - tail.y, dx) - Math.PI);
            this.ctx.translate(20, style.edgeStyle.width - 5);
          } else {
            this.ctx.textAlign = "right";
            this.ctx.rotate(Math.atan2(head.y - tail.y, dx));
            this.ctx.translate(-20, style.edgeStyle.width - 5);
          }
          this.ctx.fillStyle = style.labelStyle.color;
          this.ctx.fillText(style.labelText || "", 0, 0);
          return this.ctx.restore();
        }
      };
      Renderer.prototype.initMouseHandling = function() {
        this.selected = null;
        this.nearest = null;
        this.dragged = null;
        this.hovered = null;
        return $(this.canvas).mousedown(this.clicked);
      };
      Renderer.prototype.start = function() {
        return this.stopped = false;
      };
      Renderer.prototype.stop = function() {
        return this.stopped = true;
      };
      Renderer.prototype.clicked = function(e) {
        var p, pos;
        pos = $(this.canvas).offset();
        this.dragStart = {
          x: e.pageX,
          y: e.pageY
        };
        p = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
        this.selected = this.nearest = this.dragged = this.particleSystem.nearest(p);
        if (this.dragged.node != null) {
          this.dragged.node.fixed = true;
          this.particleSystem.eachNode(function(node, pt) {
            node.data.flow = node.fixed;
            return node.fixed = true;
          });
        }
        $(this.canvas).bind('mousemove', this.nodeDragged);
        $(window).bind('mouseup', this.nodeDropped);
        return false;
      };
      Renderer.prototype.nodeDragged = function(e) {
        var intersecting, old_nearest, p, pos, s;
        old_nearest = this.nearest && this.nearest.node._id;
        pos = $(this.canvas).offset();
        s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
        this.ghostify(this.dragged.node);
        if (!this.nearest) {
          return;
        }
        if (this.dragged !== null && this.dragged.node !== null) {
          p = this.particleSystem.fromScreen(s);
          this.dragged.node.p = p;
          intersecting = this.intersectingNode(s);
          if (intersecting && intersecting !== this.hovered) {
            intersecting.data.alpha = 0;
            this.particleSystem.tweenNode(intersecting, 0.25, {
              alpha: 1
            });
          }
          this.hovered = intersecting;
        }
        return false;
      };
      Renderer.prototype.nodeDropped = function(e) {
        var nearest, p, pos;
        this.hovered = null;
        if (this.dragged === null || this.dragged.node === void 0) {
          return;
        }
        if (this.dragged.node != null) {
          this.dragged.node.fixed = this.dragged.node.data.fixated;
        }
        this.dragged.node.fixed = true;
        this.dragged.node.mass = 1;
        if ((this.dragged.node != null) && this.thesePointsAreReallyClose(this.dragStart, {
          x: e.pageX,
          y: e.pageY
        })) {
          this.trigger("node:click", this.dragged.node, e);
        }
        pos = $(this.canvas).offset();
        p = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
        this.particleSystem.eachNode(function(node, pt) {
          return node.fixed = node.data.flow;
        });
        nearest = this.intersectingNode(p);
        if (nearest) {
          this.trigger("node:dropped", this.dragged.node, nearest, e);
        }
        this.particleSystem.start();
        this.dragged = null;
        this.selected = null;
        $(this.canvas).unbind('mousemove', this.nodeDragged);
        $(window).unbind('mouseup', this.nodeDropped);
        return false;
      };
      Renderer.prototype.intersectingNode = function(pos) {
        var dragged, nearest;
        nearest = {
          node: null,
          distance: null
        };
        dragged = this.dragged.node;
        this.particleSystem.eachNode(function(node, pt) {
          var dist;
          if (node._id !== dragged._id) {
            dist = pos.subtract(pt).magnitude();
            if (nearest.distance === null || dist < nearest.distance) {
              nearest.node = node;
              return nearest.distance = dist;
            }
          }
        });
        if (nearest.node != null) {
          if (this.ptInBox(pos, this.nodeBoxes[nearest.node.name])) {
            return nearest.node;
          }
        }
      };
      Renderer.prototype.ptInBox = function(pt, box) {
        var delta, h, w, x, y, _ref;
        if (box != null) {
          x = box[0], y = box[1], w = box[2], h = box[3];
          _ref = [w - 2, h - 2], w = _ref[0], h = _ref[1];
          delta = pt.subtract(arbor.Point(x, y));
          return Math.abs(delta.x) < w && Math.abs(delta.y) < h;
        }
        return false;
      };
      Renderer.prototype.ghostify = function(node) {
        return node.fixed = true;
      };
      Renderer.prototype.thesePointsAreReallyClose = function(p1, p2) {
        return Math.abs(p1.x - p2.x) < 5 && Math.abs(p1.y - p2.y) < 5;
      };
      Renderer.prototype.intersect_line_line = function(p1, p2, p3, p4) {
        var denom, ua, ub;
        denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
        if (denom === 0) {
          return false;
        }
        ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
        ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
          return false;
        } else {
          return arbor.Point(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
        }
      };
      Renderer.prototype.intersect_line_box = function(p1, p2, boxTuple) {
        var bl, br, h, p3, tl, tr, w;
        p3 = {
          x: boxTuple[0],
          y: boxTuple[1]
        };
        w = boxTuple[2];
        h = boxTuple[3];
        tl = {
          x: p3.x,
          y: p3.y
        };
        tr = {
          x: p3.x + w,
          y: p3.y
        };
        bl = {
          x: p3.x,
          y: p3.y + h
        };
        br = {
          x: p3.x + w,
          y: p3.y + h
        };
        return this.intersect_line_line(p1, p2, tl, tr) || this.intersect_line_line(p1, p2, tr, br) || this.intersect_line_line(p1, p2, br, bl) || this.intersect_line_line(p1, p2, bl, tl) || false;
      };
      return Renderer;
    })();
  });
}).call(this);
