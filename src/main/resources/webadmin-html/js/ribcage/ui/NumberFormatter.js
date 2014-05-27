(function() {
  define([], function() {
    var NumberFormatter;
    return NumberFormatter = (function() {
      function NumberFormatter() {}
      NumberFormatter.fancy = function(number) {
        var i, out, pos;
        number = "" + number;
        out = [];
        i = number.length;
        pos = 0;
        while (--i >= 0) {
          if (pos++ % 3 === 0) {
            out.push(" ");
          }
          out.push(number[i]);
        }
        return out.reverse().join("");
      };
      return NumberFormatter;
    })();
  });
}).call(this);
