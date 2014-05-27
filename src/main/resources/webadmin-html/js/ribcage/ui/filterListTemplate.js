(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<p><input type=\"text\" value=\"" +
htmlEscape(filter) +
"\" class=\"filterText\" /></p><p class=\"selectWrap\"></p>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
