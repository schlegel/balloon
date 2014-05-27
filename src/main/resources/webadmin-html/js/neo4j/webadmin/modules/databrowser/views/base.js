(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<div class=\"workarea\"><div class=\"controls pad\"><div class=\"span-half data-console-wrap\"><div id=\"data-console-area\"></div><div class=\"form-tooltip\"><a href=\"#\"><span class=\"form-tooltip-icon\"></span><span class=\"form-tooltip-text\"><b>Global shortcuts:</b><br /><i>s</i> - Highlight query console<br /><i>v</i> - Toggle between visualizer and tabular view<br /><br /><b>Query console special keys:</b><br /><i>RETURN</i> Add new line<br /><i>CTRL+RETURN</i> Execute current query<br /><br /><b>Query console syntax:</b><br /><b>Cypher:</b> [any cypher query]<br /><b>Node:</b> [node id]<br /><b>Relationship:</b> rel:[relationship id]<br /><br /><b>Indexes</b><br /><b>Nodes:</b> node:index:[index]:[query]<br /><b>Rels:</b> rel:index:[index]:[query]<br /><i>Ex: node:index:myindex:name:*</i></span></a></div></div><div class=\"span-half last\"><ul class=\"data-toolbar button-bar\"><li><div title=\"Create a node\" class=\"text-icon-button\" id=\"data-create-node\"><span class=\"icon\"></span>Node</div></li><li><div title=\"Create a relationship\" class=\"text-icon-button\" id=\"data-create-relationship\"><span class=\"icon\"></span>Relationship</div></li>" +
(function () { if (viewType === "tabular"      ) { return (
"<li><div title=\"Switch view mode\" class=\"icon-button\" id=\"data-switch-view\"><span class=\"icon\"></span></div></li>"
);} else { return ""; } }).call(this) +
(function () { if (viewType !== "tabular"      ) { return (
"<li><div title=\"Switch view mode\" class=\"icon-button\" id=\"data-switch-view\"><span class=\"icon tabular\"></span></div></li>"
);} else { return ""; } }).call(this) + 
"</ul></div><div class=\"break\"></div></div><div class=\"pad\" id=\"data-query-metadata\"></div><div id=\"data-area\"></div></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
