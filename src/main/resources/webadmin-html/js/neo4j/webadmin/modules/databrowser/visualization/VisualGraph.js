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
  define(['./Renderer', './RelationshipStyler', './VisualDataModel', './views/NodeFilterDialog', 'feature!arbor'], function(Renderer, RelationshipStyler, VisualDataModel, NodeFilterDialog, arbor) {
    var VisualGraph;
    return VisualGraph = (function() {
      function VisualGraph(server, profile, width, height, groupingThreshold) {
        this.server = server;
        this.profile = profile;
        if (width == null) {
          width = 800;
        }
        if (height == null) {
          height = 400;
        }
        this.groupingThreshold = groupingThreshold != null ? groupingThreshold : 10;
        this.detach = __bind(this.detach, this);
        this.attach = __bind(this.attach, this);
        this.start = __bind(this.start, this);
        this.stop = __bind(this.stop, this);
        this.floatNode = __bind(this.floatNode, this);
        this.reflow = __bind(this.reflow, this);
        this.nodeClicked = __bind(this.nodeClicked, this);
        this.addNodes = __bind(this.addNodes, this);
        this.addNode = __bind(this.addNode, this);
        this.setNodes = __bind(this.setNodes, this);
        this.setNode = __bind(this.setNode, this);
        this.clear = __bind(this.clear, this);
        this.steadyStateCheck = __bind(this.steadyStateCheck, this);
        this.el = $("<canvas width='" + width + "' height='" + height + "'></canvas>");
        this.labelProperties = [];
        this.relationshipStyler = new RelationshipStyler();
        this.dataModel = new VisualDataModel();
        if (arbor.works) {
          this.sys = arbor.ParticleSystem();
          this.sys.parameters({
            repulsion: 10,
            stiffness: 100,
            friction: 0.5,
            gravity: true,
            fps: 30,
            dt: 0.015,
            precision: 0.5
          });
          this.stop();
          this.sys.renderer = new Renderer(this.el, this.relationshipStyler);
          this.sys.renderer.bind("node:click", this.nodeClicked);
          this.sys.renderer.bind("node:dropped", this.nodeDropped);
          this.sys.screenPadding(20);
          this.steadStateWorker = setInterval(this.steadyStateCheck, 1000);
        } else {
          this.el = $("<div class='missing' style='height:" + height + "px'><div class='alert alert-error'><p><strong>Darn</strong>. I can see you have a beautiful graph. Sadly, I can't render that vision in this browser.</p></div></div>");
        }
      }
      VisualGraph.prototype.steadyStateCheck = function() {
        var energy, meanEnergy;
        energy = this.sys.energy();
        if (energy != null) {
          meanEnergy = energy.mean;
          if (meanEnergy < 0.01) {
            return this.sys.stop();
          }
        }
      };
      VisualGraph.prototype.clear = function() {
        this.dataModel.clear();
        return this._synchronizeUiWithData();
      };
      VisualGraph.prototype.setNode = function(node) {
        return this.setNodes([node]);
      };
      VisualGraph.prototype.setNodes = function(nodes) {
        this.dataModel.clear();
        return this.addNodes(nodes);
      };
      VisualGraph.prototype.addNode = function(node) {
        return this.addNodes([node]);
      };
      VisualGraph.prototype.addNodes = function(nodes) {
        var fetchCountdown, node, _i, _len, _results;
        fetchCountdown = nodes.length;
        this.stop();
        _results = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          _results.push(__bind(function(node) {
            var relPromise, relatedNodesPromise;
            relPromise = node.getRelationships();
            relatedNodesPromise = node.traverse({});
            return neo4j.Promise.join(relPromise, relatedNodesPromise).then(__bind(function(result) {
              var relatedNodes, rels;
              rels = result[0], relatedNodes = result[1];
              this.dataModel.addNode(node, rels, relatedNodes);
              if ((--fetchCountdown) === 0) {
                return this._synchronizeUiWithData();
              }
            }, this));
          }, this)(node));
        }
        return _results;
      };
      VisualGraph.prototype.nodeClicked = function(visualNode, event) {
        var completeCallback, dialog, groupedMeta, nodes, url;
        if (visualNode.data.type != null) {
          if (event.button === 2) {
            return 1;
          } else {
            switch (visualNode.data.type) {
              case "unexplored":
                return this.addNode(visualNode.data.neoNode);
              case "explored":
                this.dataModel.unexplore(visualNode.data.neoNode);
                return this._synchronizeUiWithData();
              case "group":
                nodes = (function() {
                  var _ref, _results;
                  _ref = visualNode.data.group.grouped;
                  _results = [];
                  for (url in _ref) {
                    groupedMeta = _ref[url];
                    _results.push(groupedMeta.node);
                  }
                  return _results;
                })();
                completeCallback = __bind(function(filteredNodes, dialog) {
                  dialog.remove();
                  this.dataModel.ungroup(filteredNodes);
                  return this._synchronizeUiWithData();
                }, this);
                dialog = new NodeFilterDialog(nodes, completeCallback);
                return dialog.show();
            }
          }
        }
      };
      VisualGraph.prototype.nodeDropped = function(dropped, target, event) {
        return neo4j.events.trigger("ui:node:dropped", {
          dropped: dropped.data.neoNode,
          target: target.data.neoNode,
          altKey: event.altKey,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          button: event.button
        });
      };
      VisualGraph.prototype.reflow = function() {
        this.sys.eachNode(this.floatNode);
        this.sys.parameters({
          gravity: true
        });
        return this.start();
      };
      VisualGraph.prototype.floatNode = function(node, pt) {
        return node.fixed = false;
      };
      VisualGraph.prototype.stop = function() {
        if (arbor.works) {
          if (this.sys.renderer != null) {
            this.sys.renderer.stop();
          }
          this.sys.parameters({
            gravity: false
          });
          return this.sys.stop();
        }
      };
      VisualGraph.prototype.start = function() {
        if (arbor.works) {
          if (this.sys.renderer != null) {
            this.sys.renderer.start();
          }
          this.sys.start(true);
          return this.sys.renderer.redraw();
        }
      };
      VisualGraph.prototype.attach = function(parent) {
        this.detach();
        $(parent).prepend(this.el);
        return this.start();
      };
      VisualGraph.prototype.detach = function() {
        this.stop();
        return this.el.detach();
      };
      VisualGraph.prototype.setProfile = function(profile) {
        this.profile = profile;
        return this._synchronizeUiWithData();
      };
      VisualGraph.prototype._synchronizeUiWithData = function() {
        var url, visualNode, _ref;
        _ref = this.dataModel.getVisualGraph().nodes;
        for (url in _ref) {
          visualNode = _ref[url];
          this.profile.styleNode(visualNode);
        }
        return this._preloadIcons(__bind(function() {
          this.sys.merge(this.dataModel.getVisualGraph());
          return this.start();
        }, this));
      };
      VisualGraph.prototype._preloadIcons = function(done) {
        var hasGoneThroughAllNodes, img, style, url, visualNode, _ref, _ref2, _ref3;
        if ((_ref = this._images) == null) {
          this._images = {};
        }
        if ((_ref2 = this.imagesLoading) == null) {
          this.imagesLoading = 0;
        }
        hasGoneThroughAllNodes = false;
        _ref3 = this.dataModel.getVisualGraph().nodes;
        for (url in _ref3) {
          visualNode = _ref3[url];
          style = visualNode.style;
          if (style.shapeStyle.shape === "icon") {
            url = style.iconUrl;
            if (!(this._images[url] != null)) {
              img = new Image();
              img.src = url;
              this._images[url] = img;
              this.imagesLoading += 1;
              img.onload = __bind(function() {
                this.imagesLoading -= 1;
                if (this.imagesLoading === 0 && hasGoneThroughAllNodes) {
                  return done();
                }
              }, this);
            }
            style.icon = this._images[url];
          }
        }
        hasGoneThroughAllNodes = true;
        if (this.imagesLoading === 0) {
          return done();
        }
      };
      return VisualGraph;
    })();
  });
}).call(this);
