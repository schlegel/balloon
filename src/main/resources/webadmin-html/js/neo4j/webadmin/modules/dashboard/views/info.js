(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<div class=\"pad\"><table cellspacing=\"0\" class=\"info-table\"><tbody>" + 
(function () { if (primitives.isDataAvailable()) { return (
"<tr><td><div class=\"box\"><div class=\"value\">" + 
htmlEscape(fancyNumber(primitives.get("primitives").NumberOfNodeIdsInUse)) + 
"</div><div class=\"title\">nodes</div></div></td><td><div class=\"box\"><div class=\"value\">" + 
htmlEscape(fancyNumber(primitives.get("primitives").NumberOfPropertyIdsInUse)) + 
"</div><div class=\"title\">properties</div></div></td><td><div class=\"box\"><div class=\"value\">" + 
htmlEscape(fancyNumber(primitives.get("primitives").NumberOfRelationshipIdsInUse)) + 
"</div><div class=\"title\">relationships</div></div></td><td><div class=\"box\"><div class=\"value\">" + 
htmlEscape(fancyNumber(primitives.get("primitives").NumberOfRelationshipTypeIdsInUse)) + 
"</div><div class=\"title\">relationship types</div></div></td></tr>"
);} else { return ""; } }).call(this) +
(function () { if (diskUsage.isDataAvailable()) { return (
"<tr><td></td><td><div class=\"box\"><div class=\"value\">" + 
htmlEscape(fancyNumber(Math.round( diskUsage.getDatabaseSize() / (1024 * 1024))) + " MB") + 
"</div><div class=\"title\">database disk usage</div></div></td><td><div class=\"box\"><div class=\"value\">" + 
htmlEscape(fancyNumber(Math.round( diskUsage.getLogicalLogSize() / (1024 * 1024))) + " MB") + 
"</div><div class=\"title\">logical log disk usage</div></div></td><td></td></tr>"
);} else { return ""; } }).call(this) + 
"</tbody></table><div class=\"break\"></div></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
