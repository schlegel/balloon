(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['./StyleRules', './style', 'ribcage/LocalModel'], function(StyleRules, style, LocalModel) {
    var VisualizationProfile;
    return VisualizationProfile = (function() {
      __extends(VisualizationProfile, LocalModel);
      function VisualizationProfile() {
        VisualizationProfile.__super__.constructor.apply(this, arguments);
      }
      VisualizationProfile.prototype.initialize = function() {
        this.initNestedModel('styleRules', StyleRules);
        this._defaultNodeStyle = new style.NodeStyle;
        return this._defaultGroupStyle = new style.GroupStyle;
      };
      VisualizationProfile.prototype.setName = function(name) {
        return this.set({
          name: name
        });
      };
      VisualizationProfile.prototype.getName = function() {
        return this.get("name");
      };
      VisualizationProfile.prototype.isDefault = function() {
        return this.get("builtin");
      };
      VisualizationProfile.prototype.styleNode = function(visualNode) {
        var i, rule, rules, type, _ref;
        type = visualNode.type === "group" ? "group" : "node";
        switch (type) {
          case "group":
            this._defaultGroupStyle.applyTo(visualNode);
            break;
          case "node":
            this._defaultNodeStyle.applyTo(visualNode);
        }
        rules = this.styleRules.models;
        for (i = _ref = rules.length - 1; i >= 0; i += -1) {
          rule = rules[i];
          if (rule.appliesTo(visualNode, type)) {
            rule.applyStyleTo(visualNode);
          }
        }
        if (visualNode.type === "unexplored") {
          return visualNode.style.shapeStyle.alpha = 0.2;
        }
      };
      return VisualizationProfile;
    })();
  });
}).call(this);
