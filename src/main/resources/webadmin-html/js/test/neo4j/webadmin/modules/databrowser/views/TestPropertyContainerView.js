(function() {
  define(['lib/amd/Backbone', 'neo4j/webadmin/modules/databrowser/views/PropertyContainerView'], function(Backbone, PropertyContainerView) {
    return describe("PropertyContainerView", function() {
      var pcv;
      pcv = new PropertyContainerView({
        template: null
      });
      it("recognizes ascii characters as strings", function() {
        expect(pcv.shouldBeConvertedToString("a")).toBe(true);
        return expect(pcv.shouldBeConvertedToString("abcd123 ")).toBe(true);
      });
      it("recognizes strings containing odd characters as strings", function() {
        return expect(pcv.shouldBeConvertedToString(";åäö #$ asd  ")).toBe(true);
      });
      return it("recognizes valid JSON values as not being strings", function() {
        expect(pcv.shouldBeConvertedToString("1")).toBe(false);
        expect(pcv.shouldBeConvertedToString("12")).toBe(false);
        expect(pcv.shouldBeConvertedToString("12.523")).toBe(false);
        expect(pcv.shouldBeConvertedToString("['1','2','3']")).toBe(false);
        expect(pcv.shouldBeConvertedToString("[1,2,3]")).toBe(false);
        return expect(pcv.shouldBeConvertedToString('"a quoted string"')).toBe(false);
      });
    });
  });
}).call(this);
