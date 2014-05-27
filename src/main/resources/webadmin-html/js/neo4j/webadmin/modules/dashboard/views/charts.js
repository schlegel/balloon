(function(define){
define(function(){return function(vars){
with(vars||{}) {
return "<div class=\"headline-bar\"><ul class=\"dashboard-zoom-tabs button-bar grouped\"><li><button value=\"year\" class=\"button switch-dashboard-zoom\">Year</button></li><li><button value=\"month\" class=\"button switch-dashboard-zoom\">One month</button></li><li><button value=\"week\" class=\"button switch-dashboard-zoom\">One week</button></li><li><button value=\"day\" class=\"button switch-dashboard-zoom\">One day</button></li><li><button value=\"six_hours\" class=\"button switch-dashboard-zoom\">6 hours</button></li><li><button value=\"thirty_minutes\" class=\"button switch-dashboard-zoom\">30 minutes</button></li></ul><div class=\"break\"></div></div><div id=\"monitor-chart-wrap\"><div id=\"monitor-chart\"></div></div><div class=\"footer-bar\"></div>"; 
}};
});})(typeof define=="function"?
define:
function(factory){module.exports=factory.apply(this, deps.map(require));});
