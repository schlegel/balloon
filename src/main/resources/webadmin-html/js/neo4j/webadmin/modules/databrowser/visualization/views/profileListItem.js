(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<td class=\"name\">" + 
name + 
"</td><td><a href=\"#/data/visualization/settings/profile/" +
encodeURIComponent(id) +
"/\" class=\"edit-profile button\">Edit</a></td><td>" + 
(function () { if (!isBuiltin) { return (
"<button class=\"delete-profile bad-button\">Delete</button>"
);} else { return ""; } }).call(this) + 
"</td>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
