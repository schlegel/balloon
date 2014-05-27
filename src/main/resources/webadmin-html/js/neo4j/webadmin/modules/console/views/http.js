(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<div class=\"sidebar\"><p class=\"pad\">HTTP Console, for prototyping REST calls to the neo4j server.</p><p class=\"pad\">Syntax:</p><pre class=\"pad\">[HTTP VERB] [URI] [JSON DATA]</pre><pre class=\"pad\">ex: GET /</pre><p class=\"pad\">See the <a href=\"http://docs.neo4j.org/chunked/milestone/rest-api.html\">Neo4j documentation</a> for details on the REST API.</p><div class=\"foldout\"><h2><a href=\"#\" class=\"foldout_trigger\">Cheat sheet</a></h2><div class=\"foldout_content\"><ul class=\"info_list\"><li><h3>Get database description</h3><p>GET /db/data/</p></li><li><h3>Create a node</h3><p>POST /db/data/node {\"name\":\"Steven\"}</p></li></ul></div></div><div class=\"foldout\"><h2><a href=\"#\" class=\"foldout_trigger\">If the console hangs</a></h2><div class=\"foldout_content\"><p class=\"pad\">If the console hangs, you can reset it by clearing your browser cookies for webadmin.</p></div></div></div><div class=\"workarea with-sidebar\" id=\"console-base\"></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
