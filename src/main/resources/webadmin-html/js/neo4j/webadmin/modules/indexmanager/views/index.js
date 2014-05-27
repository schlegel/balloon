(function(define){
define(function(){return function(vars){
with(vars||{}) {
return (function () { if (index.configAvailable()) { return (
"<td><h3>" + 
htmlEscape(index.name) + 
"</h3><p class=\"small\">" + 
htmlEscape(index.provider) + 
"</p></td><td><p class=\"small\">" + 
htmlEscape(JSON.stringify(index.getConfig()).replace(/,/gi,", ")) + 
"</p></td>"
);} else { return ""; } }).call(this) +
(function () { if (!index.configAvailable()) { return (
"<td><p>N/A</p></td><td><p>N/A</p></td>"
);} else { return ""; } }).call(this) +
"<td><button class=\"delete-index micro-button bad-button\">Delete</button></td>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
