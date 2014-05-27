(function(define){
define(function(){return function(vars){
with(vars||{}) {
return (function () { var __result__ = [], __key__, item; for (__key__ in menuitems) { if (menuitems.hasOwnProperty(__key__)) { item = menuitems[__key__]; __result__.push(
"<li class=\"title-button\">" + 
(function () { if (item === current) { return (
"<a href=\"" +
htmlEscape(item.getUrl()) +
"\" class=\"current\"><span class=\"subtitle\">" + 
htmlEscape(item.getSubtitle()) + 
"</span><span>" + 
htmlEscape(item.getTitle()) + 
"</span></a>"
);} else { return ""; } }).call(this) +
(function () { if (item !== current) { return (
"<a href=\"" +
htmlEscape(item.getUrl()) +
"\"><span class=\"subtitle\">" + 
htmlEscape(item.getSubtitle()) + 
"</span><span>" + 
htmlEscape(item.getTitle()) + 
"</span></a>"
);} else { return ""; } }).call(this) + 
"</li>"
); } } return __result__.join(""); }).call(this); 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
