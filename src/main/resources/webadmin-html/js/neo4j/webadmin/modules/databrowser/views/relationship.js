(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<div class=\"headline-bar pad\"><div class=\"title\"><h3>" + 
"Relationship " + htmlEscape(item.getId()) + 
"</h3><p class=\"small\">" + 
htmlEscape(item.getSelf()) + 
"</p></div><ul class=\"button-bar item-controls\"><li><div disabled=\"true\" class=\"data-save-properties button\">Saved</div></li><li><div class=\"data-delete-item bad-button\">Delete</div></li></ul><ul class=\"relationship-meta\"><li><a href=\"#/data/search/" +
htmlEscape(item.getStartId()) +
"/\" class=\"micro-button\">" + 
"Node " + htmlEscape(item.getStartId()) + 
"</a></li><li class=\"type\">" + 
htmlEscape(item.getItem().getType()) + 
"</li><li><a href=\"#/data/search/" +
htmlEscape(item.getEndId()) +
"/\" class=\"micro-button\">" + 
"Node " + htmlEscape(item.getEndId()) + 
"</a></li></ul><div class=\"break\"></div></div><div class=\"properties\"></div><div class=\"break\"></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
