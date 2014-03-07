this["visaRDF"] = this["visaRDF"] || {};
this["visaRDF"]["templates"] = this["visaRDF"]["templates"] || {};

this["visaRDF"]["templates"]["filterOptions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                            <li><a data-filter-value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\r\n                    ";
  return buffer;
  }

  buffer += "    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionCombo)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.filter)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            <h2>Filter:</h2>\r\n            <ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionSet)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.clearfix)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-option-key=\"filter\">\r\n                    ";
  stack2 = helpers.each.call(depth0, depth0.filterOptions, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </ul>\r\n    </div>";
  return buffer;
  });

this["visaRDF"]["templates"]["groupDropDown"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <option value=";
  if (stack1 = helpers.val) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.val; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n            ";
  return buffer;
  }

  buffer += "    <select id=\"GroupDropDown\">\r\n            ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </select>";
  return buffer;
  });

this["visaRDF"]["templates"]["overlayContent"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.innerNoScroll)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                <h2>\r\n                    "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.label)),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n                </h2>\r\n                "
    + escapeExpression(((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.uri)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n            </div>\r\n            <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.innerScroll)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                    <div></div>\r\n            </div>\r\n    ";
  return buffer;
  }

  buffer += "    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.label), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["visaRDF"]["templates"]["overlayWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " <option value="
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " selected=\"selected\"> "
    + escapeExpression(((stack1 = ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " </option> ";
  return buffer;
  }

  buffer += "		<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                                                            <div style=\"visibility:hidden\">";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\r\n                                                            <select multiple=\"multiple\" id=\"filterSelect\">\r\n                                                            ";
  stack2 = helpers.each.call(depth0, depth0.nodeFilters, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                                                            ";
  stack2 = helpers.each.call(depth0, depth0.tileFilters, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                                                            </select>\r\n                                                            <span class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.buttonTimeline)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">history</span>\r\n			<span class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.buttonClose)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">close</span>\r\n			<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.overlayContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n			</div>\r\n		</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["previewItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.preview)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.preview)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "_";
  if (stack2 = helpers.index) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.index; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.cssClass),stack1 == null || stack1 === false ? stack1 : stack1.previewContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            TODO\r\n        </div>\r\n</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["sortOptions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n				<li><a data-sort-value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" class=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</a></li>\r\n			";
  return buffer;
  }

  buffer += "	<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionCombo)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.sorter)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n		<h2>Sort:</h2>\r\n		<ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionSet)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.clearfix)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-option-key=\"sortBy\">\r\n			";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.keysEach || depth0.keysEach),stack1 ? stack1.call(depth0, depth0.optionSet, options) : helperMissing.call(depth0, "keysEach", depth0.optionSet, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		</ul>\r\n	</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["stdNode"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                    <h3 class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.labelEN)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.label)),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3>\r\n            ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.descriptionEn)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.description)),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n            ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n            ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.predicates), {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  return buffer;
  }
function program6(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                    <img class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth1.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.typeImage)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" src=\"img/";
  if (stack2 = helpers.type) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.type; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ".png\">\r\n                    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth1.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth1.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"display:none\">";
  if (stack2 = helpers.value) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.value; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\r\n                    ";
  options = {hash:{},inverse:self.noop,fn:self.programWithDepth(7, program7, data, depth1),data:data};
  stack2 = ((stack1 = helpers.predicateLabelRetriver || depth0.predicateLabelRetriver),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "predicateLabelRetriver", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  return buffer;
  }
function program7(depth0,data,depth2) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n                        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth2.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth2.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.predicateLabel)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  if (stack2 = helpers.label) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.label; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\r\n                    ";
  return buffer;
  }

  buffer += "            ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.label), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.ifLang || depth0.ifLang),stack1 ? stack1.call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.description), options) : helperMissing.call(depth0, "ifLang", ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.description), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.predicates), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["visaRDF"]["templates"]["tileWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + " ";
  return buffer;
  }

function program3(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.token)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n			<h2 class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.showURI)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"display:none\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.subject)),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h2>\r\n		";
  return buffer;
  }

  buffer += "	<div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.tile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.filterables), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.token), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " "
    + escapeExpression(((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n		";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.subject), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		<p class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.number)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"display:none\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n	</div>";
  return buffer;
  });

this["visaRDF"]["templates"]["timelineItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>\r\n    "
    + escapeExpression(((stack1 = ((stack1 = depth0.label),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n</li>";
  return buffer;
  });

this["visaRDF"]["templates"]["timelineWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.timelineContainer)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n    <ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.timeline)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n    </ul>\r\n</div>";
  return buffer;
  });