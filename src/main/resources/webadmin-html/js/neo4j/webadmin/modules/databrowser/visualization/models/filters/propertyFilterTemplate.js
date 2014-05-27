(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<ul><li class=\"filter\"><div class=\"filterBooleanOp\">and</div><div class=\"filterType\">where property</div><input type=\"text\" placeholder=\"Property name\" class=\"small propertyName\" /><select class=\"method\"></select><input type=\"text\" placeholder=\"A value\" style=\"display:none\" class=\"small compareValue\" /></li><li class=\"removeFilterWrap\"><button class=\"bad-button micro-button removeFilter\">X</button></li></ul><div class=\"break\"></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
