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
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['ribcage/LocalModel', 'ribcage/ui/Nano', 'ribcage/forms', 'ribcage/View', 'lib/rgbcolor'], function(LocalModel, Nano, forms, View) {
    var BoxOrCircleStyleForm, GroupStyle, IconForm, LABEL_PATTERN_TOOLTIP, NodeStyle, NodeStyleForm, exports;
    exports = {};
    LABEL_PATTERN_TOOLTIP = "You can use placeholders in the label.<br/>\n{id} for node id<br/>\n{propertyname} or {prop.propertyname} for properties.<br/>\n{props} for all properties.<br/><br/>\n<b>Truncate values</b><br/>\n{bigproperty|truncate:10}<br/><br/>\n<b>Use first matching property</b><br/>\n{name,title,id}<br/><br/>\n<b>Multiline labels</b><br/>\nUse \";\" to create multiline labels.<br/><br/>\n<b>Example</b><br/>\n{id};{description|truncate:20}..";
    BoxOrCircleStyleForm = (function() {
      __extends(BoxOrCircleStyleForm, forms.ModelForm);
      function BoxOrCircleStyleForm() {
        BoxOrCircleStyleForm.__super__.constructor.apply(this, arguments);
      }
      BoxOrCircleStyleForm.prototype.createFields = function() {
        return {
          shapeColor: new forms.ColorField("Background"),
          labelColor: new forms.ColorField("Label color")
        };
      };
      return BoxOrCircleStyleForm;
    })();
    IconForm = (function() {
      __extends(IconForm, forms.ModelForm);
      function IconForm() {
        IconForm.__super__.constructor.apply(this, arguments);
      }
      IconForm.prototype.createFields = function() {
        return {
          iconUrl: new forms.ImageURLField("Icon url", {
            imageUrls: ["img/icons/glyphish/21-skull.png", "img/icons/glyphish/07-map-marker.png", "img/icons/glyphish/08-chat.png", "img/icons/glyphish/10-medical.png", "img/icons/glyphish/11-clock.png", "img/icons/glyphish/12-eye.png", "img/icons/glyphish/13-target.png", "img/icons/glyphish/14-tag.png", "img/icons/glyphish/18-envelope.png", "img/icons/glyphish/19-gear.png", "img/icons/glyphish/21-skull.png", "img/icons/glyphish/22-skull-n-bones.png", "img/icons/glyphish/23-bird.png", "img/icons/glyphish/24-gift.png", "img/icons/glyphish/25-weather.png", "img/icons/glyphish/26-bandaid.png", "img/icons/glyphish/27-planet.png", "img/icons/glyphish/28-star.png", "img/icons/glyphish/29-heart.png", "img/icons/glyphish/52-pine-tree.png", "img/icons/glyphish/53-house.png", "img/icons/glyphish/56-cloud.png", "img/icons/glyphish/64-zap.png", "img/icons/glyphish/71-compass.png", "img/icons/glyphish/76-baby.png", "img/icons/glyphish/82-dog-paw.png", "img/icons/glyphish/84-lightbulb.png", "img/icons/glyphish/90-life-buoy.png", "img/icons/glyphish/94-pill.png", "img/icons/glyphish/99-umbrella.png", "img/icons/glyphish/102-walk.png", "img/icons/glyphish/109-chicken.png", "img/icons/glyphish/110-bug.png", "img/icons/glyphish/111-user.png", "img/icons/glyphish/112-group.png", "img/icons/glyphish/113-navigation.png", "img/icons/glyphish/114-balloon.png", "img/icons/glyphish/116-controller.png", "img/icons/glyphish/119-piggy-bank.png", "img/icons/glyphish/132-ghost.png", "img/icons/glyphish/133-ufo.png", "img/icons/glyphish/134-viking.png", "img/icons/glyphish/136-tractor.png", "img/icons/glyphish/145-persondot.png", "img/icons/glyphish/170-butterfly.png", "img/icons/glyphish/171-sun.png", "img/icons/glyphish/195-barcode.png", "img/icons/glyphish/196-radiation.png"]
          }),
          labelColor: new forms.ColorField("Label color")
        };
      };
      return IconForm;
    })();
    NodeStyleForm = (function() {
      __extends(NodeStyleForm, forms.ModelForm);
      function NodeStyleForm() {
        NodeStyleForm.__super__.constructor.apply(this, arguments);
      }
      NodeStyleForm.prototype.createFields = function() {
        return {
          shape: new forms.FormChooserField("Show as", {
            box: new forms.FormChooserOption("Box", new BoxOrCircleStyleForm({
              model: this.model
            })),
            dot: new forms.FormChooserOption("Circle", new BoxOrCircleStyleForm({
              model: this.model
            })),
            icon: new forms.FormChooserOption("Icon", new IconForm({
              model: this.model
            }))
          }),
          label: new forms.FieldSet({
            labelPattern: new forms.TextField("Label", {
              tooltip: LABEL_PATTERN_TOOLTIP
            }),
            labelSize: new forms.NumberField("Font size")
          })
        };
      };
      return NodeStyleForm;
    })();
    exports.NodeStyle = NodeStyle = (function() {
      __extends(NodeStyle, LocalModel);
      function NodeStyle() {
        NodeStyle.__super__.constructor.apply(this, arguments);
      }
      NodeStyle.prototype.defaults = {
        type: 'node',
        shape: 'box',
        shapeColor: '#000000',
        labelFont: "monospace",
        labelSize: 10,
        labelColor: "#eeeeee",
        labelPattern: "{id}"
      };
      NodeStyle.prototype.getViewClass = function() {
        return NodeStyleForm;
      };
      NodeStyle.prototype.getLabelPattern = function() {
        return this.get('labelPattern');
      };
      NodeStyle.prototype.applyTo = function(visualNode) {
        var labelCtx, labelPattern, shapeColor, _ref;
        if ((_ref = visualNode.style) == null) {
          visualNode.style = {};
        }
        shapeColor = new RGBColor(this.get('shapeColor'));
        visualNode.style.shapeStyle = {
          fill: shapeColor.toHex(),
          shape: this.get("shape")
        };
        visualNode.style.iconUrl = this.get("iconUrl");
        visualNode.style.labelStyle = {
          font: this.get('labelFont'),
          color: this.get('labelColor'),
          size: this.get('labelSize')
        };
        labelCtx = this.getLabelCtx(visualNode);
        labelPattern = this.getLabelPattern();
        if (labelPattern !== null && labelPattern.length > 0) {
          return visualNode.style.labelText = Nano.compile(this.getLabelPattern(), labelCtx);
        } else {
          return visualNode.style.labelText = "";
        }
      };
      NodeStyle.prototype.getLabelCtx = function(visualNode) {
        var ctx, k, v, _ref;
        ctx = {
          id: "N/A",
          props: "",
          prop: {}
        };
        if (visualNode.neoNode) {
          _ref = visualNode.neoNode.getProperties();
          for (k in _ref) {
            v = _ref[k];
            ctx[k] = JSON.stringify(v);
          }
          ctx['id'] = visualNode.neoNode.getId();
          ctx['props'] = JSON.stringify(visualNode.neoNode.getProperties());
          ctx['prop'] = visualNode.neoNode.getProperties();
        }
        return ctx;
      };
      return NodeStyle;
    })();
    exports.GroupStyle = GroupStyle = (function() {
      __extends(GroupStyle, NodeStyle);
      function GroupStyle() {
        GroupStyle.__super__.constructor.apply(this, arguments);
      }
      GroupStyle.prototype.defaults = {
        type: 'group',
        shape: 'dot',
        shapeColor: '#590101',
        labelSize: 10,
        labelFont: "monospace",
        labelColor: "#eeeeee",
        labelPattern: "{count};nodes"
      };
      GroupStyle.prototype.getLabelCtx = function(visualNode) {
        return {
          count: visualNode.group.nodeCount
        };
      };
      return GroupStyle;
    })();
    return exports;
  });
}).call(this);
