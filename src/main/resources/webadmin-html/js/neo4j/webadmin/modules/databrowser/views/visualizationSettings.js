(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<p><label for=\"create-relationship-from\">Label keys</label><input type=\"text\" value=\"" +
htmlEscape(labels) +
"\" id=\"visualization-label-properties\" /><div class=\"helpbox break\">Comma separated list of property keys to use for labeling nodes.</div></p><ul class=\"button-bar popout-controls\"><li><div class=\"button\" id=\"save-visualization-settings\">Done</div></li></ul>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
