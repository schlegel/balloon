(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<div id=\"visualization\"><ul class=\"button-bar item-controls\"><li><div title=\"Control how the visualization looks\" class=\"text-icon-button\" id=\"visualization-profiles-button\"><span class=\"icon\"></span>Style</div></li><li><div title=\"Refresh graph auto-layout\" class=\"text-icon-button\" id=\"visualization-reflow\"><span class=\"icon\"></span>Re-layout</div></li><li><div title=\"Clear the visualization.\" class=\"text-icon-button\" id=\"visualization-clear\"><span class=\"icon\"></span>Clear</div></li></ul></div><div class=\"break\"></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
