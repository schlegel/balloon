(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<ul class=\"metadata\"><li>" + 
"Returned <b>" + meta.getNumberOfRows() + (meta.getNumberOfRows() === 1 ? " row." : " rows.") + "</b>" + 
"</li><li>" + 
"Query took <b> " + meta.getExecutionTime() + "ms</b>" + 
"</li></ul><div class=\"break\"></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
