(function() {
  define(['./visualization/models/VisualizationProfiles'], function(VisualizationProfiles) {
    var DataBrowserSettings;
    return DataBrowserSettings = (function() {
      DataBrowserSettings.prototype.LABEL_PROPERTIES_KEY = 'databrowser.labelProperties';
      DataBrowserSettings.prototype.LABEL_PROPERTIES_DEFAULT = ['name'];
      DataBrowserSettings.prototype.VIZ_PROFILES_KEY = 'databrowser.visualization.profiles';
      DataBrowserSettings.prototype.VIZ_PROFILES_DEFAULT = [
        {
          id: 0,
          name: "Default profile",
          builtin: true
        }
      ];
      DataBrowserSettings.prototype.CURRENT_VIZ_PROFILE_KEY = 'databrowser.visualization.currentProfile';
      function DataBrowserSettings(settings) {
        this.settings = settings;
      }
      DataBrowserSettings.prototype.getLabelProperties = function() {
        var s;
        s = this.settings.get(this.LABEL_PROPERTIES_KEY);
        if (s && _(s).isArray()) {
          return s;
        } else {
          return this.LABEL_PROPERTIES_DEFAULT;
        }
      };
      DataBrowserSettings.prototype.setLabelProperties = function(properties) {
        var attr;
        attr = {};
        attr[this.LABEL_PROPERTIES_KEY] = properties;
        this.settings.set(attr);
        return this.settings.save();
      };
      DataBrowserSettings.prototype.labelPropertiesChanged = function(callback) {
        return this.settings.bind('change:' + this.LABEL_PROPERTIES_KEY, callback);
      };
      DataBrowserSettings.prototype.getVisualizationProfiles = function() {
        var prof;
        prof = this.settings.get(this.VIZ_PROFILES_KEY, VisualizationProfiles, this.VIZ_PROFILES_DEFAULT);
        if (prof.size() === 0) {
          this.settings.remove(this.VIZ_PROFILES_KEY);
          prof = this.settings.get(this.VIZ_PROFILES_KEY, VisualizationProfiles, this.VIZ_PROFILES_DEFAULT);
        }
        return prof;
      };
      DataBrowserSettings.prototype.getCurrentVisualizationProfile = function() {
        var id, profiles;
        id = this.settings.get(this.CURRENT_VIZ_PROFILE_KEY);
        profiles = this.getVisualizationProfiles();
        if ((id != null) && profiles.get(id)) {
          return profiles.get(id);
        } else {
          return profiles.first();
        }
      };
      DataBrowserSettings.prototype.setCurrentVisualizationProfile = function(id) {
        if (id.id != null) {
          id = id.id;
        }
        return this.settings.set(this.CURRENT_VIZ_PROFILE_KEY, id);
      };
      DataBrowserSettings.prototype.onCurrentVisualizationProfileChange = function(cb) {
        return this.settings.bind("change:" + this.CURRENT_VIZ_PROFILE_KEY, cb);
      };
      return DataBrowserSettings;
    })();
  });
}).call(this);
