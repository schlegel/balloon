(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<ul class=\"property-list\">" + 
(function () { var __result__ = [], __key__, property; for (__key__ in properties) { if (properties.hasOwnProperty(__key__)) { property = properties[__key__]; __result__.push(
"<li><ul class=\"property-row\"><li class=\"property-key-wrap\"><div class=\"property-input-wrap\"><input type=\"hidden\" value=\"" +
htmlEscape(property.getLocalId()) +
"\" class=\"property-id\" />" +
(function () { if (property.hasKeyError()) { return (
"<div class=\"form-error\">" + 
htmlEscape(property.getKeyError()) + 
"</div>"
);} else { return ""; } }).call(this) +
(function () { if (!property.hasKeyError()) { return (
"<div style=\"display:none;\" class=\"form-error\"></div>"
);} else { return ""; } }).call(this) +
"<input type=\"text\" value=\"" +
htmlEscape(property.getKey()) +
"\" class=\"property-key\" /></div></li><li class=\"property-value-wrap\"><div class=\"property-input-wrap\">" + 
(function () { if (property.hasValueError()) { return (
"<div class=\"form-error\">" + 
htmlEscape(property.getValueError()) + 
"</div>"
);} else { return ""; } }).call(this) +
(function () { if (!property.hasValueError()) { return (
"<div style=\"display:none;\" class=\"form-error\"></div>"
);} else { return ""; } }).call(this) +
"<input type=\"text\" value=\"" +
property.getValueAsHtml() +
"\" class=\"property-value\" /></div></li><li class=\"property-actions-wrap\"><div class=\"property-input-wrap\"><div class=\"delete-property bad-button\">Remove</div></div></li></ul><div class=\"break\"></div></li>"
); } } return __result__.join(""); }).call(this) +
"<li class=\"property-controls\"><div title=\"Add a new property\" class=\"add-property text-icon-button\"><span class=\"icon\"></span>Add property</div><div class=\"break\"></div></li></ul>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
