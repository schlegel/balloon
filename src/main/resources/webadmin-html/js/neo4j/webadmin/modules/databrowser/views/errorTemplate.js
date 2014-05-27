(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<p><b>" + 
title + 
"</b></p>" +
(function () { if (description) { return (
"<p>" + 
description + 
"</p>"
);} else { return ""; } }).call(this) +
(function () { if (monospaceDescription) { return (
"<pre>" + 
monospaceDescription + 
"</pre>"
);} else { return ""; } }).call(this); 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
