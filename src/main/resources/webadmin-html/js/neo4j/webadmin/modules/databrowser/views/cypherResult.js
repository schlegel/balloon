(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<table cellspacing=\"0\" class=\"data-table\"><tbody><tr>" + 
(function () { var __result__ = [], __key__, column; for (__key__ in result.columns) { if (result.columns.hasOwnProperty(__key__)) { column = result.columns[__key__]; __result__.push(
"<th><h3>" + 
htmlEscape(column) + 
"</h3></th>"
); } } return __result__.join(""); }).call(this) + 
"</tr>" +
(function () { var __result__ = [], __key__, row; for (__key__ in result.data) { if (result.data.hasOwnProperty(__key__)) { row = result.data[__key__]; __result__.push(
"<tr>" + 
(function () { var __result__ = [], __key__, value; for (__key__ in row) { if (row.hasOwnProperty(__key__)) { value = row[__key__]; __result__.push(
"<td class=\"small\">" + 
(function () { if (value != null && typeof(value.self) !== "undefined" && typeof(value.type) === "undefined") { return (
"<a href=\"#/data/search/" +
htmlEscape(id(value)) +
"/\" class=\"micro-button\">" + 
"Node " + htmlEscape(id(value)) + 
"</a>"
);} else { return ""; } }).call(this) +
(function () { if (value != null && typeof(value.self) !== "undefined" && typeof(value.type) !== "undefined") { return (
"<a href=\"#/data/search/rel:" +
htmlEscape(id(value)) +
"/\" class=\"micro-button\">" + 
"Rel " + htmlEscape(id(value)) + 
"</a>"
);} else { return ""; } }).call(this) +
(function () { if (value != null && typeof(value.self) === "undefined") { return (
htmlEscape(JSON.stringify(value))
);} else { return ""; } }).call(this) +
(function () { if (value == null) { return (
"null"
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
