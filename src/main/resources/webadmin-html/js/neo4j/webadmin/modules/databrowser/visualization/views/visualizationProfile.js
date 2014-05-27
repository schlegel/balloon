(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<div class=\"workarea\" id=\"visualization-settings\"><div class=\"pad\"><div class=\"span-half\">" + 
(function () { if (isInCreateMode) { return (
"<h2>Create new visualization profile</h2><input id=\"profile-name\" type=\"text\" placeholder=\"Enter a name for this profile\" class=\"big\" />"
);} else { return ""; } }).call(this) +
(function () { if (!isInCreateMode) { return (
"<h2>Manage visualization profile</h2><input id=\"profile-name\" type=\"text\" value=\"" +
htmlEscape(name) +
"\" placeholder=\"Enter a name for this profile\" class=\"big\" />"
);} else { return ""; } }).call(this) + 
"</div><div class=\"span-half last\"><ul class=\"button-bar data-toolbar\"><li><button class=\"button save\">Save</button></li><li><button class=\"button cancel\">Cancel</button></li></ul></div><div class=\"break\"></div></div><div class=\"styleRulesWrap\"><div class=\"span-half\"><div class=\"headline-bar pad\"><h2>Style rules</h2><div class=\"form-help-text\">Each style rule controls how either all nodes, or a filtered subset of nodes, should look in the visualization. The first matching style rule will be used, you can re-order the rules with the drag-handle under the each rules' Remove button.</div></div><div class=\"break\"></div></div><div class=\"break\"></div><ul class=\"styleRules\"></ul><div class=\"button-bar pad\"><button class=\"button addStyleRule\">Add style rule</button><div class=\"break\"></div></div></div><ul class=\"button-bar pad\"><li><button class=\"button save\">Save</button></li><li><button class=\"button cancel\">Cancel</button></li></ul></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
