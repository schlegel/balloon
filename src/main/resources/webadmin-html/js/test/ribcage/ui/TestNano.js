(function() {
  define(["ribcage/ui/Nano"], function(Nano) {
    return describe("Nano", function() {
      it("replaces placeholders", function() {
        expect(Nano.compile("{a}", {
          a: 'b'
        })).toBe('b');
        expect(Nano.compile("{a.b}", {
          a: {
            b: 'c'
          }
        })).toBe('c');
        return expect(Nano.compile("{a.b.x}", {
          a: {
            b: 'c'
          }
        })).toBe('N/A');
      });
      return it("allows truncating values", function() {
        return expect(Nano.compile("{a|truncate:1}", {
          a: '1234'
        })).toBe('1');
      });
    });
  });
}).call(this);
