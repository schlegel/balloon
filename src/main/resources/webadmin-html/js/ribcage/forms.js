(function() {
  /*
  Copyright (c) 2002-2014 "Neo Technology,"
  Network Engine for Objects in Lund AB [http://neotechnology.com]
  
  This file is part of Neo4j.
  
  Neo4j is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  define(['ribcage/View', 'ribcage/security/HtmlEscaper', 'ribcage/ui/Nano', 'ribcage/ui/Dialog', 'ribcage/ui/ImagePicker', 'lib/colorpicker', 'lib/rgbcolor'], function(View, HtmlEscaper, Nano, Dialog, ImagePicker) {
    var ColorField, Field, FieldSet, FormChooserField, FormChooserOption, ImageURLField, ModelForm, NumberField, TextField, ValueException, exports;
    exports = {};
    exports.ModelForm = ModelForm = (function() {
      __extends(ModelForm, View);
      function ModelForm() {
        this.render = __bind(this.render, this);
        ModelForm.__super__.constructor.apply(this, arguments);
      }
      ModelForm.prototype.createFields = function() {
        return {};
      };
      ModelForm.prototype.initialize = function(opts) {
        var field, key, _ref, _results;
        this.fields = this.createFields();
        _ref = this.fields;
        _results = [];
        for (key in _ref) {
          field = _ref[key];
          field.setPropertyKey(key);
          _results.push(field.setModel(this.model));
        }
        return _results;
      };
      ModelForm.prototype.render = function() {
        var fieldset, key, wrap, _ref;
        wrap = $("<ul class='form'></ul>");
        _ref = this._getFieldSets();
        for (key in _ref) {
          fieldset = _ref[key];
          wrap.append(fieldset.renderLi(this.model));
        }
        $(this.el).html(wrap);
        return this;
      };
      ModelForm.prototype.validates = function() {
        var field, k, _ref;
        _ref = this.fields;
        for (k in _ref) {
          field = _ref[k];
          if (!field.validates()) {
            return false;
          }
        }
        return true;
      };
      ModelForm.prototype._getFieldSets = function() {
        var fieldDef, hasDefaultFieldset, key, sets, _ref;
        sets = {
          _default: new FieldSet
        };
        hasDefaultFieldset = false;
        _ref = this.fields;
        for (key in _ref) {
          fieldDef = _ref[key];
          if (fieldDef instanceof FieldSet) {
            sets[key] = fieldDef;
          } else {
            hasDefaultFieldset = true;
            sets._default.fields[key] = fieldDef;
          }
        }
        if (!hasDefaultFieldset) {
          delete sets._default;
        }
        return sets;
      };
      return ModelForm;
    })();
    exports.FieldSet = FieldSet = (function() {
      function FieldSet(label, fields) {
        this.label = label != null ? label : "";
        this.fields = fields != null ? fields : {};
        this.setPropertyKey = __bind(this.setPropertyKey, this);
        this.setModel = __bind(this.setModel, this);
        if (!_(this.label).isString()) {
          this.fields = this.label;
          this.label = null;
        }
      }
      FieldSet.prototype.setModel = function(model) {
        var field, key, _ref, _results;
        _ref = this.fields;
        _results = [];
        for (key in _ref) {
          field = _ref[key];
          field.setPropertyKey(key);
          _results.push(field.setModel(model));
        }
        return _results;
      };
      FieldSet.prototype.setPropertyKey = function(propertyKey) {};
      FieldSet.prototype.renderLi = function(model) {
        var field, key, ul, wrap, _ref;
        ul = $("<ul class='form-fieldset'></ul>");
        _ref = this.fields;
        for (key in _ref) {
          field = _ref[key];
          ul.append(field.renderLi());
        }
        wrap = $("<li></li>");
        if (this.label) {
          wrap.append("<h3>" + (htmlEscape(this.label)) + "</h3>");
        }
        wrap.append(ul);
        return wrap;
      };
      FieldSet.prototype.validates = function() {
        var field, k, _ref;
        _ref = this.fields;
        for (k in _ref) {
          field = _ref[k];
          if (!field.validates()) {
            return false;
          }
        }
        return true;
      };
      return FieldSet;
    })();
    exports.ValueException = ValueException = (function() {
      __extends(ValueException, Error);
      function ValueException(errorMessage) {
        this.errorMessage = errorMessage;
        ValueException.__super__.constructor.call(this, this.errorMessage);
      }
      return ValueException;
    })();
    exports.Field = Field = (function() {
      Field.prototype.LI_TEMPLATE = "<li>\n  {label}\n  {tooltip}\n  <div class='form-error' style='display:none;'></div>\n  {input} \n</li>";
      Field.prototype.errors = [];
      function Field(label, opts) {
        this.label = label;
        this.opts = opts != null ? opts : {};
        this.setPropertyKey = __bind(this.setPropertyKey, this);
        this.setModel = __bind(this.setModel, this);
        this.tooltip = this.opts.tooltip || "";
      }
      Field.prototype.setModel = function(model) {
        this.model = model;
      };
      Field.prototype.setPropertyKey = function(propertyKey) {
        this.propertyKey = propertyKey;
      };
      Field.prototype.renderLi = function() {
        return this.renderWithTemplate(this.LI_TEMPLATE);
      };
      Field.prototype.renderWithTemplate = function(tpl) {
        var tooltipHtml;
        tooltipHtml = this.tooltip.length > 0 ? "<div class='form-tooltip'><a><span class='form-tooltip-icon'></span><span class='form-tooltip-text'>" + this.tooltip + "</span></a></div>" : "";
        this.el = $(Nano.compile(tpl, {
          label: "<label class='form-label'>" + this.label + "</label>",
          input: "<div class='__PLACEHOLDER__'></div>",
          tooltip: tooltipHtml
        }));
        this.widget = this.renderWidget();
        $('.__PLACEHOLDER__', this.el).replaceWith(this.widget);
        this.updateUIValue();
        return this.el;
      };
      /* Update the UI value to match that
      of the underlying model.
      */
      Field.prototype.updateUIValue = function() {
        return this.setUIValue(this.model.get(this.propertyKey));
      };
      /* Set the value to be displayed in the UI
      */
      Field.prototype.setUIValue = function(val) {
        return this.widget.val(val);
      };
      /* Set the value in the model. Fields are expected
      to call this method (or an overridden version) whenever
      the user changes the value in the UI.
      */
      Field.prototype.setModelValue = function(val) {
        try {
          this.setErrors([]);
          val = this.cleanUIValue(val);
          return this.model.set(this.propertyKey, val);
        } catch (e) {
          return this.setErrors([e.errorMessage]);
        }
      };
      /* Called with a value from the UI, meant to make
      sure the value is ready to be inserted into the model.
      
      Override this to add UI validation code. If the value is
      not to your liking, throw a ValueException with a description
      of why the value is incorrect.
      */
      Field.prototype.cleanUIValue = function(value) {
        return value;
      };
      /* Set a list of errors that currently applies to this field.
      Used by the #validates() method.
      */
      Field.prototype.setErrors = function(errors) {
        this.errors = errors;
        if (this.errors.length === 0) {
          return this.hideErrorBox();
        } else {
          return this.showErrorBox(this.errors[0]);
        }
      };
      Field.prototype.validates = function() {
        return this.errors.length === 0;
      };
      Field.prototype.hideErrorBox = function() {
        return $('.form-error', this.el).hide();
      };
      Field.prototype.showErrorBox = function(errorMessage) {
        var errorEl;
        errorEl = $('.form-error', this.el);
        errorEl.html(errorMessage);
        return errorEl.show();
      };
      return Field;
    })();
    exports.TextField = TextField = (function() {
      __extends(TextField, Field);
      function TextField() {
        this.renderWidget = __bind(this.renderWidget, this);
        TextField.__super__.constructor.apply(this, arguments);
      }
      TextField.prototype.renderWidget = function() {
        var el;
        el = $("<input type='text' class='form-input' value='' />");
        el.change(__bind(function() {
          return this.setModelValue(el.val());
        }, this));
        return el;
      };
      return TextField;
    })();
    exports.NumberField = NumberField = (function() {
      __extends(NumberField, TextField);
      function NumberField() {
        NumberField.__super__.constructor.apply(this, arguments);
      }
      NumberField.prototype.cleanUIValue = function(value) {
        value = Number(value);
        if (!_(value).isNumber()) {
          throw new ValueException("Value must be a number");
        }
        return value;
      };
      return NumberField;
    })();
    exports.ImageURLField = ImageURLField = (function() {
      __extends(ImageURLField, Field);
      function ImageURLField() {
        this.updateImageElementUrl = __bind(this.updateImageElementUrl, this);
        this.setUIValue = __bind(this.setUIValue, this);
        this.renderWidget = __bind(this.renderWidget, this);
        ImageURLField.__super__.constructor.apply(this, arguments);
      }
      ImageURLField.prototype.renderWidget = function() {
        var metaBar, pickerButton, wrap, _ref, _ref2;
        this.urlInput = $("<input type='text' class='form-input' value='' />");
        this.urlInput.change(__bind(function() {
          this.setModelValue(this.urlInput.val());
          return this.updateImageElementUrl(this.urlInput.val());
        }, this));
        this.imageElement = $("<img class='form-image-url-field-preview'/>");
        wrap = $("<div class='form-image-url-field'></div>");
        metaBar = $("<div class='form-image-url-field-metabar'></div>");
        metaBar.append("<span class='form-image-url-field-preview-title small'>Preview:</span>");
        wrap.append(this.urlInput);
        wrap.append(metaBar);
        if (this.opts['imageUrls'] != null) {
          if ((_ref = this.imagePicker) == null) {
            this.imagePicker = new ImagePicker(this.opts['imageUrls']);
          }
          $(this.imagePicker.el).addClass("imagepicker-dialog");
          if ((_ref2 = this.dialog) == null) {
            this.dialog = new Dialog(this.imagePicker);
          }
          this.dialog.el.prepend("<h1>Pick an image you like</h1>");
          this.imagePicker.bind('image:clicked', __bind(function(ev) {
            this.setUIValue(ev.url);
            this.setModelValue(ev.url);
            return this.dialog.hide();
          }, this));
          pickerButton = $("<a href='#' class='form-image-url-field-builtin micro-button'>Built in images</a>");
          pickerButton.click(__bind(function(ev) {
            ev.preventDefault();
            return this.dialog.show();
          }, this));
          metaBar.append(pickerButton);
        }
        wrap.append(this.imageElement);
        return wrap;
      };
      ImageURLField.prototype.setUIValue = function(value) {
        this.urlInput.val(value);
        return this.updateImageElementUrl(value);
      };
      ImageURLField.prototype.updateImageElementUrl = function(value) {
        return this.imageElement.attr('src', value);
      };
      return ImageURLField;
    })();
    exports.ColorField = ColorField = (function() {
      __extends(ColorField, Field);
      function ColorField() {
        this.setUIValue = __bind(this.setUIValue, this);
        this.renderWidget = __bind(this.renderWidget, this);
        ColorField.__super__.constructor.apply(this, arguments);
      }
      ColorField.prototype.renderWidget = function() {
        var el;
        el = $("<div class='colorpicker-input'></div>");
        el.ColorPicker({
          onChange: function(hsb, hex, rgb) {
            return el.css({
              'background-color': "#" + hex
            });
          },
          onBeforeShow: function() {
            var color;
            color = new RGBColor(el.css('background-color'));
            return el.ColorPickerSetColor(color.toHex());
          },
          onHide: __bind(function(hsb, hex, rgb) {
            var color;
            color = new RGBColor(el.css('background-color'));
            return this.setModelValue(color.toRGB());
          }, this)
        });
        return el;
      };
      ColorField.prototype.setUIValue = function(color) {
        return this.widget.css('background-color', color);
      };
      return ColorField;
    })();
    exports.FormChooserField = FormChooserField = (function() {
      __extends(FormChooserField, Field);
      function FormChooserField(label, options) {
        this.label = label;
        this.options = options;
        this.showForm = __bind(this.showForm, this);
        this.setUIValue = __bind(this.setUIValue, this);
        this.renderWidget = __bind(this.renderWidget, this);
        FormChooserField.__super__.constructor.call(this, this.label);
      }
      FormChooserField.prototype.renderWidget = function() {
        var key, option, wrapper, _ref;
        this.select = $("<select></select>");
        _ref = this.options;
        for (key in _ref) {
          option = _ref[key];
          this.select.append("<option value='" + (htmlEscape(key)) + "'>" + (htmlEscape(option.label)) + "</option>");
        }
        this.select.change(__bind(function(ev) {
          this.setModelValue($(ev.target).val());
          return this.showForm($(ev.target).val());
        }, this));
        wrapper = $("<div class='form-chooser-field'></div>");
        this.formContainer = $("<div class='form-chooser-form-container'></div>");
        wrapper.append(this.select);
        wrapper.append(this.formContainer);
        return wrapper;
      };
      FormChooserField.prototype.setUIValue = function(formKey) {
        this.select.val(formKey);
        return this.showForm(formKey);
      };
      FormChooserField.prototype.showForm = function(formKey) {
        var key, opt, _ref;
        if (!(this.options[formKey] != null)) {
          _ref = this.options;
          for (key in _ref) {
            opt = _ref[key];
            formKey = key;
            break;
          }
        }
        this.formContainer.html("");
        return this.formContainer.append(this.options[formKey].form.render().el);
      };
      return FormChooserField;
    })();
    exports.FormChooserOption = FormChooserOption = (function() {
      function FormChooserOption(label, form) {
        this.label = label;
        this.form = form;
      }
      return FormChooserOption;
    })();
    return exports;
  });
}).call(this);
