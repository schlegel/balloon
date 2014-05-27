(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<div class=\"headline-bar pad\"><div class=\"title\"><h3>" + 
"Node " + htmlEscape(item.getId()) + 
"</h3><p class=\"small\">" + 
htmlEscape(item.getSelf()) + 
"</p></div><ul class=\"button-bar item-controls\"><li><a title=\"Show a list of relationships for this node\" href=\"#/data/search/rels:" +
htmlEscape(item.getId()) +
"/\" class=\"data-show-relationships button\">Show relationships</a></li><li><div disabled=\"true\" class=\"data-save-properties button\">Saved</div></li><li><div class=\"data-delete-item bad-button\">Delete</div></li></ul><div class=\"break\"></div></div><div class=\"properties\"></div><div class=\"break\"></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
