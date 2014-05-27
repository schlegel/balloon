(function() {
  define(['lib/amd/Backbone', "neo4j/webadmin/modules/databrowser/DataBrowserRouter"], function(Backbone, DataBrowserRouter) {
    return describe("DataBrowserRouter", function() {
      return it("can pick out read-only queries", function() {
        var dbr;
        dbr = new DataBrowserRouter({
          getServer: function() {
            return null;
          }
        });
        expect(dbr._looksLikeReadOnlyQuery("1")).toBe(true);
        expect(dbr._looksLikeReadOnlyQuery("node:1")).toBe(true);
        expect(dbr._looksLikeReadOnlyQuery("start n=node(0) return n")).toBe(true);
        expect(dbr._looksLikeReadOnlyQuery("start n=node(0) match n--a return n")).toBe(false);
        expect(dbr._looksLikeReadOnlyQuery("create n return n")).toBe(false);
        expect(dbr._looksLikeReadOnlyQuery("start n=node(0) relate n--a return n")).toBe(false);
        return expect(dbr._looksLikeReadOnlyQuery("start n=node(0) set n.name='bob' return n")).toBe(false);
      });
    });
  });
}).call(this);
