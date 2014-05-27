(function(define){
define(function(){return function(vars){
with(vars||{}) {
return (function () { if (typeof(bean) != "undefined") { return (
"<div class=\"pad\"><h2>" + 
htmlEscape(bean.name) + 
"</h2><p class=\"small\">" + 
htmlEscape(bean.description) + 
"</p></div><table cellspacing=\"0\" class=\"data-table\"><tbody>" + 
(function () { var __result__ = [], __key__, attribute; for (__key__ in attributes) { if (attributes.hasOwnProperty(__key__)) { attribute = attributes[__key__]; __result__.push(
"<tr><td style=\"padding-left:" +
attribute.indent*20 +
"px;\"><h3>" + 
htmlEscape(attribute.name) + 
"</h3><p class=\"small\">" + 
htmlEscape(attribute.description) + 
"</p></td><td class=\"value\">" + 
htmlEscape(attribute.value) + 
"</td></tr>"
); } } return __result__.join(""); }).call(this) + 
"</tbody></table>"
);} else { return ""; } }).call(this) +
(function () { if (typeof(bean) == "undefined") { return (
"<div class=\"pad\"><h2>No information found</h2><p>Unable to locate any info for the specified JMX bean.</p></div>"
);} else { return ""; } }).call(this); 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
