(function() {
  define([], function() {
    var Nano;
    return Nano = (function() {
      function Nano() {}
      Nano.pipes = {
        'truncate': function(value, args) {
          var maxlen;
          maxlen = Number(args[0]);
          if (maxlen !== NaN && value.length > maxlen) {
            return value.slice(0, maxlen);
          }
          return value;
        }
      };
      Nano.compile = function(template, data) {
        return template.replace(/\{([\w\-\,\.\|:]*)}/g, function(str, key) {
          var args, keySets, keys, name, path, pipe, pipes, value, _i, _j, _k, _len, _len2, _len3, _ref;
          pipes = key.split('|');
          keySets = (function() {
            var _i, _len, _ref, _results;
            _ref = pipes.shift().split(",");
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              path = _ref[_i];
              _results.push(path.split("."));
            }
            return _results;
          })();
          for (_i = 0, _len = keySets.length; _i < _len; _i++) {
            keys = keySets[_i];
            value = data[keys.shift()];
            for (_j = 0, _len2 = keys.length; _j < _len2; _j++) {
              key = keys[_j];
              if ((value != null) && value.hasOwnProperty(key)) {
                value = value[key];
              } else {
                value = null;
              }
            }
            if (value != null) {
              for (_k = 0, _len3 = pipes.length; _k < _len3; _k++) {
                pipe = pipes[_k];
                _ref = pipe.split(':'), name = _ref[0], args = _ref[1];
                args = args.split(',');
                value = Nano.pipes[name](value, args);
              }
              return value;
            }
          }
          return "N/A";
        });
      };
      return Nano;
    })();
  });
}).call(this);
