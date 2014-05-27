(function(define){
define(function(){return function(vars){
with(vars||{}) {
return (function () { if (engines.length > 1) { return (
"<div id=\"console-tabs\"><ul class=\"button-bar grouped\">" + 
(function () { if (_(engines).indexOf('shell') > -1) { return (
"<li><a href=\"#/console/shell\" class=\"button " +
(current == 'shell' ? 'current':'') +
"\">Neo4j Shell</a></li>"
);} else { return ""; } }).call(this) +
(function () { if (_(engines).indexOf('gremlin') > -1) { return (
"<li><a href=\"#/console/gremlin\" class=\"button " +
(current == 'gremlin' ? 'current':'') +
"\">Gremlin</a></li>"
);} else { return ""; } }).call(this) +
(function () { if (_(engines).indexOf('http') > -1) { return (
"<li><a href=\"#/console/http\" class=\"button " +
(current == 'http' ? 'current':'') +
"\">HTTP</a></li>"
);} else { return ""; } }).call(this) + 
"</ul></div>"
);} else { return ""; } }).call(this) +
"<div class=\"pad\" id=\"console\"><ul>" + 
(function () { var __result__ = [], __key__, line; for (__key__ in lines) { if (lines.hasOwnProperty(__key__)) { line = lines[__key__]; __result__.push(
"<li>" + 
htmlEscape(line, true) + 
"</li>"
); } } return __result__.join(""); }).call(this) +
"<li>" + 
(function () { if (showPrompt) { return (
htmlEscape(promptPrefix) +
"<input type=\"text\" value=\"" +
htmlEscape(prompt) +
"\" id=\"console-input\" />"
);} else { return ""; } }).call(this) + 
"</li>" +
(function () { if (showMultilineHelp) { return (
"<li class=\"console-multiline-help\">(Hit return again to execute)</li>"
);} else { return ""; } }).call(this) + 
"</ul></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
