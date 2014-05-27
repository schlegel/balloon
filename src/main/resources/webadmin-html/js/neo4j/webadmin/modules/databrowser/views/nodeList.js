(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<table cellspacing=\"0\" class=\"data-table\"><tbody><tr><th><h3>Id</h3></th>" +
(function () { var __result__ = [], __key__, key; for (__key__ in nodeList.getPropertyKeys()) { if (nodeList.getPropertyKeys().hasOwnProperty(__key__)) { key = nodeList.getPropertyKeys()[__key__]; __result__.push(
"<th><h3>" + 
htmlEscape(key) + 
"</h3></th>"
); } } return __result__.join(""); }).call(this) + 
"</tr>" +
(function () { var __result__ = [], __key__, node; for (__key__ in nodeList.getNodes()) { if (nodeList.getNodes().hasOwnProperty(__key__)) { node = nodeList.getNodes()[__key__]; __result__.push(
"<tr><td><a href=\"#/data/search/" +
htmlEscape(node.getId()) +
"/\" class=\"micro-button\">" + 
"Node " + htmlEscape(node.getId()) + 
"</a></td>" +
(function () { var __result__ = [], __key__, key; for (__key__ in nodeList.getPropertyKeys()) { if (nodeList.getPropertyKeys().hasOwnProperty(__key__)) { key = nodeList.getPropertyKeys()[__key__]; __result__.push(
"<td class=\"small\">" + 
(function () { if (node.getPropertyByKey(key)) { return (
node.getPropertyByKey(key).getTruncatedHtmlValue(50)
);} else { return ""; } }).call(this) + 
"</td>"
); } } return __result__.join(""); }).call(this) + 
"</tr>"
); } } return __result__.join(""); }).call(this) + 
"</tbody></table><div class=\"break\"></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
