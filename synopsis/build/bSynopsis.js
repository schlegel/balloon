/**
 * bSynopsis is a JQuery Plugin for RDF visualization.
 * 
 * @module bSynopsis
 * @main Plugin
 * @param {} $
 * @param {}
 *           window
 * @param {}
 *           document
 * @param {}
 *           undefined
 */

// safety net for unclosed plugins and/or chained functions
;
(function($, window, document, undefined) {

	// get global vars
	var $window = $(window);

	// ========================= bSynopsis Constants
	// ===============================
	var CONS = {
		// Part of CSS class to indicate a filterable
		FA_TAG : "synopsis_filter_",
		// Part of CSS class to indicate a token
		TOKEN_TAG : "synopsis_token_",
		NODE_TYPES : {
			stdNode : "stdNode",
			literal : "literal",
			blankNode : "blankNode",
			resNode : "resNode"
		},
		COMP_TYPES : {
			predicate : "predicate",
			label : "label",
			uri : "uri"
		},
		CSS_PREFIX : "synopsis_",

		// CSS classes to use
		CSS_CLASSES : {
			outerContainer : "outerContainer",
			viewContainer : "container",
			options : "options",
			optionCombo : "option-combo",
			optionSet : "option-set",
			optionButton : "option-button",
			groupLabel : "groupLabel",
			filter : "filter",
			clearfix : "clearfix",
			loader : "loading",
			preview : "preview",
			previewItem : "preview-item",
			previewContent : "previewContent",
			overlay : "overlay",
			overlayContent : "overlayContent",
			refresh : "refresh",
			innerScroll : "innerScroll",
			innerNoScroll : "innerNoScroll",
			buttonClose : "close",
			timelineContainer : "timelineContainer",
			timeline : "timeline",
			buttonTimeline : "btnTimeline",
			sorter : "sorter",
			textScale : "textScale",
			textScaleDone : "textScaleDone",
			tileClasses : {
				tile : "tile",
				content : "tileContent",
				label : "label",
				showURI : "showURI",
				predicate : "predicate",
				predicateLabel : "predicateLabel",
				typeImage : "typeImage",
				number : "number"
			},
			typeClasses : {
				incoming : "incoming",
				outgoing : "outgoing"
			},
			patternClasses : {
				uri : "uri",
				literal : "literal",
				blanknode : "blank"
			}
		},
		// Placeholder in query strings
		DUMMY : "#replaceMe#",
		// Event types for Pub/Sub system
		EVENT_TYPES : {
			store : {
				insert : "dataInsert"
			},
			loading : {
				done : "loadingDone",
				start : "loadingStarted"
			},
			layout : {
				done : "layoutingDone"
			}
		},
		MESSAGES : {
			out : {
				selectAllFilters : "Select All"
			},
			error : {
				ajax : "Error on loading data.",
				remote : "Error on loading remote data.",
				template : "Error on loading template data.",
				tokenType : "Unknown token type of item.",
				compType : "Unknown component type of item."
			},
			warn : {
				cssAppend : "CSS classes already defined",
				fileTypeNotKnown : "Couldn't get filetype. Using: ",
				filterInput : "Filterinput is empty",
				filterName : "Filtername duplicate found"
			}
		}
	};

	var UTIL = {
		toClass : function(str) {
			return CONS.CSS_PREFIX + str;
		},
		toToken : function(str) {
			return CONS.TOKEN_TAG + str;
		},
		toFilterable : function(str) {
			return CONS.FA_TAG + str;
		},
		toClassSelector : function(str) {
			return "." + CONS.CSS_PREFIX + str;
		},
		toSelector : function(str) {
			return "." + str;
		}
	};

	// Add prefix to given objects strings
	function objPrefixer(prefix, obj) {
		$.each(obj, function(i, val) {
			if (typeof val === "string") {
				obj[i] = prefix + val;
			} else {
				objPrefixer(prefix, val);
			}
		});
	}

	// Add css_prefix to css_classes
	objPrefixer(CONS.CSS_PREFIX, CONS.CSS_CLASSES);

	// ========================= Extend Isotope ===============================
	// Extend Isotope - groupRows custom layout mode
	// Modified Version of
	// http://isotope.metafizzy.co/custom-layout-modes/category-rows.html
	// $
	// .extend(
	// $.Isotope.prototype,
	// {
	// _groupRowsReset : function() {
	// this.groupRows = {
	// x : 0,
	// y : 0,
	// gutter : 0,
	// height : 0,
	// currentGroup : null
	// };
	// },
	// _groupRowsLayout : function($elems) {
	// var instance = this, containerWidth = this.element.width(), sortBy =
	// this.options.sortBy, props = this.groupRows;
	//
	// $elems
	// .each(function() {
	// var $this = $(this), atomW = $this.outerWidth(true), atomH = $this
	// .outerHeight(true), group = $.data(this, 'isotope-sort-data')[sortBy];
	//
	// if (group !== props.currentGroup) {
	// // new group, new row
	// props.x = 0;
	// props.height += props.currentGroup ? instance.groupRows.gutter : 0;
	// props.y = props.height;
	// props.currentGroup = group;
	//
	// if (instance.groupRows.gutter < atomH) {
	// instance.groupRows.gutter = atomH;
	// }
	//
	// } else {
	//
	// if (props.x !== 0 && atomW + props.x > containerWidth) {
	//
	// // if this item cannot fit in
	// // the current row
	// props.x = 0;
	// props.y = props.height;
	// }
	// }
	//
	// $this.find(UTIL.toSelector(CONS.CSS_CLASSES.groupLabel)).remove();
	// // label for new group
	// if (group !== '') {
	// var prefix = group.split("_")[0] + "_";
	// var groups = group.split(prefix), divBox = "<div class='"
	// + CONS.CSS_CLASSES.groupLabel + "' >";
	// for (var i = 1; i < groups.length; i++) {
	// divBox += groups[i];
	// }
	// divBox += "</div>";
	// $this.append(divBox);
	// }
	//
	// // position the atom
	// instance._pushPosition($this, props.x, props.y);
	//
	// props.height = Math.max(props.y + atomH, props.height);
	// props.x += atomW;
	// });
	// },
	// _groupRowsGetContainerSize : function() {
	// return {
	// height : this.groupRows.height
	// };
	// },
	// _groupRowsResizeChanged : function() {
	// return true;
	// }
	//
	// });

	// ========================= JQuery custom selectors
	/**
	 * class JQuery custom selectors
	 * 
	 * @class bSynopsis_JQuery_Custom
	 */

	/**
	 * JQuery custom class prefix selector.
	 * 
	 * @method class-prefix
	 * @param {}
	 *           ele
	 * @param {}
	 *           index
	 * @param {}
	 *           match
	 */
	$.expr[':']['class-prefix'] = function(ele, index, match) {
		var prefix = match[3];

		if (prefix) {
			var sel = '[class^="' + prefix + '"], [class*=" ' + prefix + '"]';
			return $(ele).is(sel);
		} else {
			return true;
		}
	};

	/**
	 * JQuery custom regex selector. (modified the version of James Padolsey -
	 * http://james.padolsey.com/javascript/regex-selector-for-jquery/)
	 * 
	 * @method regex
	 * @param {}
	 *           elem
	 * @param {}
	 *           index
	 * @param {}
	 *           match
	 */
	$.expr[':'].regex = function(elem, index, match) {
		var matchParams = match[3].split(','), validLabels = /^(data|css):/, attr = {
			method : matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
			property : matchParams.shift().replace(validLabels, '')
		}, regexFlags = 'ig', regex;
		try {
			regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
		} catch (e) {
			return false;
		}
		return regex.test(jQuery(elem)[attr.method](attr.property));
	};

	// ========================= JQuery textfill
	// https://gist.github.com/mekwall/1263939 by Marcus Ekwall
	// Additions by Thomas Weißgerber
	(function($) {
		$.fn.textfill = function(maxFontSize, minFontSize, fail) {
			maxFontSize = parseInt(maxFontSize, 10);
			minFontSize = parseInt(minFontSize, 10);
			return this
					.each(function(i, val) {
						var ourText = $(val), parent = ourText.parent(), maxHeight = parent.height(), maxWidth = parent
								.width(), fontSize = parseInt(ourText.css("fontSize"), 10), tmpMultW = maxWidth
								/ ourText.width(), tmpMultH = maxHeight / ourText.height(), multiplier = (tmpMultW < tmpMultH) ? tmpMultW
								: tmpMultH, newSize = (fontSize * (multiplier - 0.1));
						if (maxFontSize > 0 && newSize > maxFontSize) {
							newSize = maxFontSize;
						}
						if (minFontSize > 0 && newSize < minFontSize) {
							newSize = minFontSize;
							fail(parent);
						}
						ourText.css("fontSize", newSize);
					});
		};
	})(jQuery);

	// ========================= bSynopsis class private utility functions
	/**
	 * class private utility functions
	 * 
	 * @class bSynopsis_GLOBAL_UTIL
	 */

	/**
	 * Checks if given variable is undenfined or null.
	 * 
	 * @method isUndefinedOrNull
	 * @param {Object}
	 *           a Variable to check
	 * @return {Boolean} Returns true on success
	 */
	function isUndefinedOrNull(a) {
		return ((typeof a === "undefined") || (a === null));
	}

	function construct(constructor, args) {
		function F() {
			return constructor.apply(this, args);
		}
		F.prototype = constructor.prototype;
		return new F();
	}

	// Only print to console, if DEBUG mode is enabled
	var print = console.log.bind(console);
	function appendCssClasses(obj) {
		if (obj) {
			if (!obj.CSS_CLASSES) {
				obj.CSS_CLASSES = CONS.CSS_CLASSES;
			} else {
				console.log(CONS.MESSAGES.warn.cssAppend);
			}
		}
		return obj;
	}

	/**
	 * Replace the DUMMY constants of given query with the given
	 * replacementstring.
	 * 
	 * @method replaceDummy
	 * @param {String}
	 *           query Query to work with
	 * @param {String}
	 *           replacement String to replace the CONS.DUMMY of given query
	 * @return {String} Returns the query with replaced DUMMY constants
	 */
	function replaceDummy(query, replacement) {
		return query.replace(new RegExp(CONS.DUMMY, "g"), replacement);
	}

	/**
	 * Gets the current window size of the browser.
	 * 
	 * @method getWindowSize
	 * @param {Boolean}
	 *           withoutScrollbar Flag to assign if the scrollbar should be
	 *           considered
	 * @return {Object} Object which contains the width and the height of the
	 *         window.
	 */
	function getWindowSize(withoutScrollbar) {
		var w = null, h = null;
		if (withoutScrollbar) {
			if ($('BODY').hasClass('noscroll')) {
				w = $window.width(), h = $window.height();
			} else {
				$('BODY').addClass('noscroll');
				w = $window.width(), h = $window.height();
				$('BODY').removeClass('noscroll');
			}
		} else {
			w = $window.width(), h = $window.height();
		}
		return {
			width : w,
			height : h
		};
	}

	/**
	 * Gets the clip data of given type of div box
	 * 
	 * @method getClip
	 * @param {String}
	 *           name CSS name as defined in CONS.CSS_CLASSES of given div box
	 * @return {Object} Rectangle Object / Clip data
	 */
	function getClip(name) {
		var winsize;
		switch (name) {
		case CONS.CSS_CLASSES.overlay:
			winsize = getWindowSize(true);
			return 'rect(0px ' + winsize.width + 'px ' + winsize.height + 'px 0px)';
			break;
		case CONS.CSS_CLASSES.preview:
			winsize = getWindowSize(false);
			return 'rect(' + winsize.height * 0.25 + 'px ' + winsize.width * 0.75 + 'px ' + winsize.height
					* 0.75 + 'px ' + winsize.width * 0.25 + 'px)';
			break;
		default:
			console.log("No clip data found.");
			return "";
		}
	}

	/**
	 * Gets the layoutprop of given item
	 * 
	 * @method getItemLayoutProp
	 * @param {$item}
	 *           $item JQuery item
	 * @return {Object} Object which contains the layoutprops
	 */
	function getItemLayoutProp($item) {
		var scrollT = $window.scrollTop(), scrollL = $window.scrollLeft(), itemOffset = $item.offset();
		return {
			left : itemOffset.left - scrollL,
			top : itemOffset.top - scrollT,
			width : $item.outerWidth(),
			height : $item.outerHeight()
		};
	}

	/**
	 * Get browser dependent event names. (Uses Modernizr)
	 * 
	 * @method getTransEndEventName
	 * @return {String} TransitionEnd event name of the current browser
	 */
	function getTransEndEventName() {
		var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		};
		// transition end event name
		return transEndEventNames[Modernizr.prefixed('transition')];
	}

	// ========================= bSynopsis: RemoteEngine Class
	/**
	 * Class to provide a function for SPARQL querying of the service located at
	 * the given url. YQL is used to fetch the queryresults.
	 * 
	 * @class RemoteEngine
	 * @constructor
	 */
	var RemoteEngine = function() {

		// TODO YQL timeout??

		var counter = 0;

		// This function uses YQL to give a SPARQL query to a remote service.
		// Accepts a query, the adress of the service and a callback function to
		// run.
		this._corsRequestSPARQL = function(query, url, callback) {

			var that = this, success = false, cnt = counter++;

			// Use cnt to stop callbackoverwriting on simultan calls
			window["cbFunc" + cnt] = function(data, textStatus, jqXHR) {
				// If we have something to work with...
				if (data && data.results && data.results.bindings) {
					success = true;
					callback(data.results.bindings, success);
				}

				// Else, Maybe we requested a site that doesn't exist, and
				// nothing returned.
				else {
					console.log('Nothing returned from getJSON.');
					callback(null, success);

					// Delete old callbackfunction
					window["cbFunc" + cnt] = undefined;
				}
			};

			// TODO cors timeout?
			var service = url + "?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + encodeURI(query)
					+ "&format=application%2Fsparql-results%2Bjson&timeout=300000"
			""
			// If no query was passed, exit.
			if (!query) {
				alert('No query was passed.');
			}
			$.ajax({
				type : 'post',
				dataType : "json",
				url : service,
				success : window["cbFunc" + cnt],
				error : function(jqXHR, textStatus, errorThrown) {
					console.log("Error on cors query.");
					console.log(errorThrown);
					window["cbFunc" + cnt]();
				}
			});
		};

		this._yqlRequestSPARQL = function(query, url, callback) {
			var success = false, cnt = counter++;
			// Use cnt to stop callbackoverwriting on simultan calls
			window["cbFunc" + cnt] = function(data, textStatus, jqXHR) {

				// If we have something to work with...
				if (data && data.query && data.query.results) {
					success = true;
					callback(data.query.results.sparql.result, success);
				}

				// Else, Maybe we requested a site that doesn't exist, and
				// nothing returned.
				else {
					console.log('Nothing returned from getJSON.');
					callback(null, success);

					// Delete old callbackfunction
					window["cbFunc" + cnt] = undefined;
				}
			};

			// If no query was passed, exit.
			if (!query) {
				alert('No query was passed.');
			}

			// Take the provided url, and add it to a YQL query. Make sure you
			// encode it!
			var yql = 'http://query.yahooapis.com/v1/public/yql?q='
					+ encodeURIComponent('use "http://triplr.org/sparyql/sparql.xml" as sparql; select * from sparql where query="'
							+ query + '" and service="' + url) + '"&format=json';

			// Request that YSQL string, and run a callback function.
			// Pass a defined function to prevent cache-busting.
			// $.getJSONP(yql, cbFunc);
			$.ajax({
				type : 'post',
				dataType : 'json',
				url : yql,
				success : window["cbFunc" + cnt],
				error : function(jqXHR, textStatus, errorThrown) {
					// console.log(yql);
					console.log("Error on yql query.");
					// console.log(textStatus);
					// console.log(jqXHR);
					console.log(errorThrown);
					window["cbFunc" + cnt]();
				}
			});
		};

	};

	/**
	 * Method for querying the given url with given query. Executes given
	 * callback function with results.
	 * 
	 * @method executeQuery
	 * @param {String}
	 *           query Query to execute
	 * @param {String}
	 *           url URL of service to execute the query on
	 * @param {Function}
	 *           callback Callback function to be executed with query results
	 */
	RemoteEngine.prototype.executeQuery = function(query, url, callback) {
		if (url.indexOf("yql:") === 0) {
			this._yqlRequestSPARQL(query, url.slice(4), callback);
		} else {
			this._corsRequestSPARQL(query, url, callback);
		}
	};

	// ========================= Cache class ===============================
	/**
	 * This class defines a cache.
	 * 
	 * @class Cache
	 * @constructor
	 */
	var Cache = function() {
		this.values = {};
	};

	/**
	 * Adds the key and value to the cache.
	 * 
	 * @method add
	 * @param {String}
	 *           key Key to map to the value
	 * @param {String}
	 *           val Value to add to the cache
	 */
	Cache.prototype.add = function(key, val) {
		this.values[key] = val;
	};

	/**
	 * Retrives the to the key correspondending value
	 * 
	 * @method retrieve
	 * @param {String}
	 *           key Key to map to the value
	 * @return {String} Value to which the key maps
	 */
	Cache.prototype.retrieve = function(key) {
		return this.values[key];
	};

	/**
	 * Check if the cache contains a value for the given key
	 * 
	 * @method contains
	 * @param {String}
	 *           key Key to map to the value
	 * @return {Boolean} true if cache contains a value for the given key
	 */
	Cache.prototype.contains = function(key) {
		return key in this.values;
	};

	// ========================= Variables for all bSynopsis instances
	/**
	 * class public functions
	 * 
	 * @class bSynopsis_GLOBAL
	 */

	// Deferred to inform if the plugin was already initialized once
	var globalInitDfd = $.Deferred(),
	// Name of the plugin
	pluginName = "bSynopsis",
	// rdf store instance(SPARQL endpoint)
	rdfStore,
	// remoteEngine for remote queries
	remoteDataLoader, queryStore,
	// rdf store instance(SPARQL endpoint)
	eventManagers = [],
	// cache for predicate labels
	labelCache = new Cache(),
	// transition end event name
	transEndEventName = getTransEndEventName(),
	// transitions support available?
	supportTransitions = Modernizr.csstransitions,
	// namespaces variable with defaultnamespaces
	namespaces = {
		'rdf' : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
		'rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
		'owl' : 'http://www.w3.org/2002/07/owl#',
		'rif' : 'http://www.w3.org/2007/rif#',
		'foaf' : 'http://xmlns.com/foaf/0.1/',
		'dbpedia' : 'http://dbpedia.org/resource/',
		'dbpedia-owl' : 'http://dbpedia.org/ontology/',
		'dbpprop' : 'http://dbpedia.org/property/',
		'geo' : 'http://www.w3.org/2003/01/geo/wgs84_pos#',
		'dc' : 'http://purl.org/dc/terms/'
	},
	// handlebars templates for the plugin
	templates = {},
	// Counter for plugin ids
	idCounter = 0,
	// Counter for layer ids
	layerIdCounter = 0,
	// Counter for view ids
	viewIdCounter = 0,
	// zIndex counter to show overlays
	zIndex = 2,
	// Counter for listener ids
	listenerId = 0;
	// Returns a unique PluginID
	/**
	 * Generate an ID for the plugin.
	 * 
	 * @method generateId
	 * @return {Integer} ID of the plugin
	 */
	function generateId() {
		return idCounter++;
	}

	// ========================= bSynopsis: Event Class
	Plugin.Event = function(sender) {
		this._sender = sender;
		this._listeners = {};
		this._oneTimeListeners = {};
	};

	Plugin.Event.prototype = {
		attach : function(listener) {
			this._listeners[listener.id] = listener;
		},
		once : function(listener) {
			this._oneTimeListeners[listener.id] = listener;
		},
		dettach : function(listener) {
			delete this._listeners[listener.id];
		},
		notify : function(args) {
			var sender = this._sender, that = this;
			$.each(this._listeners, function(i, val) {
				val.fn(sender, args);
			});
			$.each(this._oneTimeListeners, function(i, val) {
				val.fn(sender, args);
				delete that._oneTimeListeners[i];
			});
		}
	};

	// ========================= bSynopsis: Switch Class
	Plugin.Switch = function(sender) {
		this._sender = sender;
		this._listeners = {};
		this._triggered = false;
	};

	Plugin.Switch.prototype = {
		attach : function(listener) {
			if (this._triggered) {
				listener.fn(this._sender, this._args);
			} else {
				this._listeners[listener.id] = listener;
			}
		},
		trigger : function(args) {
			this._triggered = true;
			this._args = args;
			var that = this;
			$.each(this._listeners, function(i, val) {
				val.fn(that._sender, args);
				delete that._listeners[i];
			});
		}
	};

	// ========================= bSynopsis: Listener Class
	Plugin.Listener = function(fn) {
		this.id = "listener" + listenerId++;
		this.fn = fn;
	};
	// ========================= bSynopsis: eventManager Class
	/**
	 * Class to manage eventHandlers
	 * 
	 * @class Plugin.EventManager
	 * @constructor
	 * @param {jQuery}
	 *           stdObject Default object for adding of eventHandlers
	 */
	Plugin.EventManager = function(stdObject) {
		if (!stdObject) {
			print("EventManager not created");
			return false;
		}
		this.stdObject = stdObject;

		// History of event handler bindings
		this._evHandlerHistory = {};
	};

	/**
	 * Add an event handler to given object. Save it in the history for cleanup
	 * purposes.
	 * 
	 * @method addEventHandler
	 * @param {String}
	 *           eventType Type of the event as defined in cons
	 * @param {Function}
	 *           handler Eventhandler function to trigger on event
	 * @param {String}
	 *           object Object to add the eventhandler to
	 * @param {String}
	 *           id ID to add to the eventhandler
	 */
	Plugin.EventManager.prototype.addEventHandler = function(eventType, handler, object, id) {
		var that = this;
		if (object === undefined) {
			object = that.stdObject;
		}
		if (that._evHandlerHistory[eventType] === undefined) {
			that._evHandlerHistory[eventType] = [];
		}
		that._evHandlerHistory[eventType].push({
			"id" : id,
			"object" : object,
			"handler" : handler
		});
		object.on(eventType, handler);
	};

	/**
	 * Remove an event handler from given object and history. Removal by id is
	 * possible.
	 * 
	 * @method removeEventHandler
	 * @param {String}
	 *           eventType Type of the event as defined in CONS
	 * @param {Function}
	 *           id ID of the eventHandler to be removed
	 * @param {String}
	 *           object Object to remove the eventhandler from
	 */
	Plugin.EventManager.prototype.removeEventHandler = function(eventType, id, object) {
		var that = this;
		$.each(that._evHandlerHistory[eventType], function(i, val) {
			if (id === val.id) {
				if (object !== undefined) {
					if ($.data(val.object) === $.data(object)) {
						val.object.off(eventType, val.handler);

						// Stop each on find
						return false;
					}
				} else {

					// Else delete all entries with id
					val.object.off(eventType, val.handler);
				}
			}
		});
	};

	/**
	 * Trigger the event with given parameters on given object.
	 * 
	 * @method trigger
	 * @param {String}
	 *           eventType Type of the event as defined in CONS
	 * @param {Object}
	 *           param Array of parameters to give to the triggered function
	 * @param {String}
	 *           object Object to trigger the event on
	 */
	Plugin.EventManager.prototype.trigger = function(eventType, param, object) {
		if (object) {
			object.trigger(eventType, param);
		} else {
			this.stdObject.trigger(eventType, param);
		}
	};

	/**
	 * Destroy this event manager and all his event handlers.
	 * 
	 * @method destroy
	 */
	Plugin.EventManager.prototype.destroy = function() {
		$.each(this._evHandlerHistory, function(eventType, binding) {
			$.each(binding, function(i, val) {
				val.object.off(eventType, val.handler);
			});
		});
	};

	// ========================= bSynopsis: rdfStore Class
	/**
	 * Class to wrap and create a rdfStore Object. Default: rdfstore-js
	 * https://github.com/antoniogarrote/rdfstore-js
	 * 
	 * @class Plugin.RdfStore
	 * @constructor
	 * @param {Object}
	 *           options Options object for the rdf store
	 * @param {Function}
	 *           callback Callback function to execute after class creation
	 */
	Plugin.RdfStore = function(options, callback) {
		var that = this;
		this._store = null;

		// Prefixes for SPARQL queries
		this._queryPrefixes = "";

		this._generateQueryPrefix = function(prefix, uri) {
			that._queryPrefixes += "PREFIX " + prefix + ": <" + uri + "> ";
		};

		$.each(namespaces, function(i, val) {
			that._generateQueryPrefix(i, val);
		});

		// Init rdfstore-js
		new rdfstore.Store(options, function(store) {
			that._store = store;
			callback();
		});
		// TODO store as worker?
		// rdfstore.connect("js/lib/rdfstore-js/index.js", options,
		// function(success, store) {
		// if(success) {
		// // store is a connection to the worker
		// console.log(store.isWebWorkerConnection === true);
		// } else {
		// // connection was not possible. A store object has been returned
		// instead
		// print("fail on webworker store");
		// }
		// that._store = store;
		// callback();
		// });
	};

	/**
	 * Inserts given data in the store
	 * 
	 * @method insertData
	 * @param {String}
	 *           data Data to insert into the store
	 * @param {String}
	 *           dataFormat Format of given data
	 * @param {Function}
	 *           callback Callback function to be called after loading in the
	 *           store.
	 */
	Plugin.RdfStore.prototype.insertData = function(data, dataFormat, callback) {
		var that = this;

		if (dataFormat === "text/turtle" || dataFormat === "text/plain" || dataFormat === "text/n3") {
			// get prefix terms and update namespaces
			var prefixTerms = data.match(/.*@prefix.*>(\s)*./g);
			if (prefixTerms) {
				$.each(prefixTerms, function(i, val) {
					var prefixTerm = (val.split(/>(\s)*./)[0]).split(/:(\s)*</);
					var prefix = prefixTerm[0].replace(/@prefix(\s)*/, "");
					var uri = prefixTerm[2];
					if (isUndefinedOrNull(namespaces[prefix])) {
						namespaces[prefix] = uri;
						that._generateQueryPrefix(prefix, uri);
					}
				});
			}
		} else if (dataFormat === "application/ld+json" || dataFormat === "application/json") {
			var prefixes = data["@context"];
			if (prefixes) {
				$.each(prefixes, function(i, val) {
					if (isUndefinedOrNull(namespaces[val])) {
						namespaces[i] = val;
						that._generateQueryPrefix(i, val);
					}
				});
			}
		}
		this._store.load(dataFormat, data, function(store) {
			callback();
		});
	};

	/**
	 * Executes given query on the store
	 * 
	 * @method executeQuery
	 * @param {String}
	 *           query Data to insert into the store
	 * @param {Function}
	 *           callback Callback function to be called with the results of the
	 *           execution.
	 * @param {Function}
	 *           fail Callback function to be called if the execution fails.
	 */
	Plugin.RdfStore.prototype.executeQuery = function(query, callback, fail) {
		this._store.execute(this._queryPrefixes + query, function(success, results) {
			if (success) {
				callback(results, success);
			} else {
				print("Error on executing: " + query);
				callback(null, success);
			}
		});
	};

	// ========================= bSynopsis: LayoutEngine Class
	/**
	 * Layout engine to add items to. Default: jQuery.isotope
	 * http://isotope.metafizzy.co/
	 * 
	 * @class Plugin.LayoutEngine
	 * @constructor
	 * @param {jQuery}
	 *           container Container to use the layout engine on
	 * @param {Object}
	 *           options Options object for the layout engine
	 */
	Plugin.LayoutEngine = function($container, options) {
		var engine = this;
		this._options = options;
		this._container = $container;
		this._funcQueue = [];
		this._occupied = false;
		this._internDoneEvent = new Plugin.Event(this);
		this.partialDoneEvent = new Plugin.Event(this);
		this.doneEvent = new Plugin.Event(this);
		this._internDoneEvent.attach(new Plugin.Listener(function(sender) {
			engine._addNext();
		}));

		$container.addClass("layoutEngine");
		$container.css({
			"overflow" : "hidden"
		});
	};

	Plugin.LayoutEngine.prototype._addNext = function(items) {
		if (this._funcQueue.length > 0) {
			setTimeout(this._funcQueue.shift(), this._options.clusterWait);
		} else {
			this._occupied = false;
			if (this.startTime) {
				print("Unoccupy. All layouting done after " + (new Date().getTime() - this.startTime) + " ms");
				this.doneEvent.notify();
				this.startTime = undefined;
			}
		}
	}

	Plugin.LayoutEngine.prototype._setStartTime = function(items) {
		if (!this.startTime) {
			this.startTime = new Date().getTime();
		}
	}

	Plugin.LayoutEngine.prototype.add = function(items) {
	};

	Plugin.LayoutEngine.prototype.remove = function(items, callback) {
	};

	Plugin.LayoutEngine.prototype.removeAll = function(callback) {
	};

	Plugin.LayoutEngine.prototype.updateOptions = function(options) {
	};

	Plugin.LayoutEngine.prototype.sort = function(opts) {
	};

	Plugin.LayoutEngine.prototype.filter = function(fn) {
	};

	Plugin.LayoutEngines = {};

	Plugin.LayoutEngines.Isotope = function($container, options) {
		Plugin.LayoutEngine.call(this, $container, options);
		var engine = this;
		this._container.isotope(options.isotope.options);
		this._container.isotope('on', 'layoutComplete', function() {
			engine._internDoneEvent.notify();
		});
	}

	Plugin.LayoutEngines.Isotope.prototype = Object.create(Plugin.LayoutEngine.prototype);
	Plugin.LayoutEngines.Isotope.prototype.constructor = Plugin.LayoutEngines.Isotope;

	/**
	 * Adds items to the layout engine
	 * 
	 * @method add
	 * @param {jQuery}
	 *           items Div boxes which are to be added
	 * @param {Function}
	 *           callback Callback function
	 */
	Plugin.LayoutEngines.Isotope.prototype.add = function(items) {
		var engine = this;
		engine._setStartTime();
		var fn = function(input) {
			return function() {
				engine._occupied = true;
				var stepSize = engine._options.clusterSize;
				if (items.length > stepSize && stepSize > 0) {
					var tmp = items;
					tmp = tmp.slice(stepSize);
					items = items.slice(0, stepSize);
					engine.add(tmp);
				}
				var timeStamp = new Date().getTime();
				engine._container.isotope('once', 'layoutComplete', function() {
					print("Added items to layoutEngine in " + (new Date().getTime() - timeStamp) + " ms");
					engine.partialDoneEvent.notify(items);
				});
				engine._container.isotope("insert", items);
			};
		};
		if (items) {
			if (!this._occupied) {
				fn(items)();
			} else {
				this._funcQueue.push(fn(items));
			}
		}
	};

	/**
	 * Redo the layout of the div boxes
	 * 
	 * @method reLayout
	 */
	Plugin.LayoutEngines.Isotope.prototype.reLayout = function() {
		this._container.isotope("reLayout");
	};

	/**
	 * Remove items from the layout engine
	 * 
	 * @method remove
	 * @param {jQuery}
	 *           items Div boxes which are to be removed
	 * @param {Function}
	 *           callback Callback function
	 */
	Plugin.LayoutEngines.Isotope.prototype.remove = function(items, callback) {
		this._container.isotope("remove", items, callback);
	};

	Plugin.LayoutEngines.Isotope.prototype.removeAll = function(callback) {
		this._container.html('');
	};

	/**
	 * Update the options of the layout engine
	 * 
	 * @method updateSortData
	 * @param {Object}
	 *           options Options object of the layout engine
	 */
	Plugin.LayoutEngines.Isotope.prototype.updateOptions = function(options) {
		this._container.isotope(options);
	};

	/**
	 * Update the sort data of the layout engine on specified items
	 * 
	 * @method updateSortData
	 * @param {item}
	 *           item Items for which sort data should be updated
	 */
	Plugin.LayoutEngines.Isotope.prototype.sort = function(name, fn) {
		this.startTime = new Date().getTime();
		if (!this._options.isotope.options.getSortData.hasOwnProperty(name)) {
			var tmpSD = {};
			tmpSD[name] = fn;
			print("adding tmpSD");
			this.updateOptions({
				getSortData : tmpSD
			});
		}
		this.updateOptions({
			sortBy : name
		});
	};

	Plugin.LayoutEngines.Isotope.prototype.filter = function(selector) {
		this.startTime = new Date().getTime();
		if (selector !== '') {
			if (selector !== '*') {
				if (this._options.supportRegExpFilter) {
					try {
						selector = "div:regex(class, " + selector + "), div > div:contains(" + selector + ")";
					} catch (e) {
						selector = "div > div:contains(" + selector + ")";
					}
				} else {
					selector = "div > div:contains(" + selector + ")";
				}
			}
		} else {
			selector = '*';
		}
		this.updateOptions({
			filter : selector
		});
	};
	Plugin.LayoutEngines.Shuffle = function($container, options) {
		Plugin.LayoutEngine.call(this, $container, options);
		var engine = this;
		this._container.shuffle(options.shuffle.options);
		this._container.on('layout.shuffle', function() {
			engine._internDoneEvent.notify();
		});
	}

	Plugin.LayoutEngines.Shuffle.prototype = Object.create(Plugin.LayoutEngine.prototype);
	Plugin.LayoutEngines.Shuffle.prototype.constructor = Plugin.LayoutEngines.Shuffle;

	/**
	 * Adds items to the layout engine
	 * 
	 * @method add
	 * @param {jQuery}
	 *           items Div boxes which are to be added
	 * @param {Function}
	 *           callback Callback function
	 */
	Plugin.LayoutEngines.Shuffle.prototype.add = function(items) {
		var engine = this;
		engine._setStartTime();
		var fn = function(items) {
			return function() {
				engine._occupied = true;
				var stepSize = engine._options.clusterSize;
				if (items.length > stepSize && stepSize > 0) {
					var tmp = items;
					tmp = tmp.slice(stepSize);
					items = items.slice(0, stepSize);
					engine.add(tmp);
				}
				var timeStamp = new Date().getTime();
				engine._container.one('layout.shuffle', function() {
					print("Added items to layoutEngine in " + (new Date().getTime() - timeStamp) + " ms");
					engine.partialDoneEvent.notify(items);
				});
				engine._container.append(items);
				engine._container.shuffle("appended", items);
			};
		};
		if (items) {
			if (!this._occupied) {
				fn(items)();
			} else {
				this._funcQueue.push(fn(items));
			}
		}
	};

	/**
	 * Remove items from the layout engine
	 * 
	 * @method remove
	 * @param {jQuery}
	 *           items Div boxes which are to be removed
	 * @param {Function}
	 *           callback Callback function
	 */
	Plugin.LayoutEngines.Shuffle.prototype.remove = function(items) {
		this._container.shuffle('remove', items);
	};

	Plugin.LayoutEngines.Shuffle.prototype.removeAll = function(callback) {
		this._container.html('');
	};

	/**
	 * Update the options of the layout engine
	 * 
	 * @method updateOptions
	 * @param {Object}
	 *           options Options object of the layout engine
	 */
	Plugin.LayoutEngines.Shuffle.prototype.updateOptions = function(options) {
		this._container.shuffle(options);
	};

	Plugin.LayoutEngines.Shuffle.prototype.sort = function(name, fn) {
		this.startTime = new Date().getTime();
		this._container.shuffle('sort', {
			by : fn
		});
	};

	Plugin.LayoutEngines.Shuffle.prototype.filter = function(selector, type, fn) {
		this.startTime = new Date().getTime();
		var tmp;
		if (typeof fn === "function") {
			tmp = fn;
		} else if (this.options.shuffle.filterFns.hasOwnProperty(type)) {
			tmp = this.options.shuffle.filterFns[type];
		}
		this._container.shuffle('shuffle', tmp);
	};
	Plugin.LayoutEngineFactory = {
		make : function($container, options) {
			var engine;
			print(options);
			switch (options.useEngine) {
			case "isotope":
				engine = new Plugin.LayoutEngines.Isotope($container, options);
				break;
			case "shuffle":
				engine = new Plugin.LayoutEngines.Shuffle($container, options);
				break;
			default:
				alert("No layout engine defined.");
			}
			return engine;
		}
	}

	// ========================= bSynopsis: Node Class
	/**
	 * Base node to represent an abstract element of the rdf graph.
	 * 
	 * @class Plugin.Node
	 * @constructor
	 * @param {Object}
	 *           data Data of a single resource of a select query. Must contain
	 *           index.
	 */
	Plugin.Node = function(data, style) {
		this.id = data.index; // ID for this node
		this.type = CONS.NODE_TYPES.stdNode; // Node Type
		this.useTemplateID = this.type; // Use Templated stored under this name
		this.filterables = []; // Classes used for filtering
		this.components = {}; // Components of the node
		this.style = style;
		if (data.predicate) { // Empty predicates are possible on init view
			this.filterables.push(UTIL.toFilterable(data.predicate.type));
			data.predicate.value = decodeURIComponent(data.predicate.value);
			this.addComponent("predicate", data.predicate);
		}
		if (data.description) {
			data.description.value = decodeURIComponent(data.description.value);
			this.addComponent("description", data.description);
		}
	};

	/**
	 * Add a new component to this node
	 * 
	 * @method addNewComponent
	 */
	Plugin.Node.prototype.addComponent = function(type, data, style) {
		if (!this.components[type]) { // Increase counter
			this.components[type] = [];
		}
		var id = type + this.components[type].length;
		this.components[type].push(Plugin.ComponentFactory.makeComp(id, type, data, style));
	}

	/**
	 * Check if node has this component type and get the first component of this
	 * type. Returns false if no object is found.
	 * 
	 * @method getFComponentOT
	 * @param {String}
	 *           type Type to look for.
	 * @returns {Object}
	 */
	Plugin.Node.prototype.getFComponentOT = function(type) { // Increment
		// counter and
		// return
		if (this.components[type]) {
			return this.components[type][0];
		} else {
			return false;
		}
	}

	/**
	 * Check if node has a component of this type. Returns Boolean.
	 * 
	 * @method hasComponentType
	 * @param {String}
	 *           type Type to look for.
	 * @returns {Boolean}
	 */
	Plugin.Node.prototype.hasComponentType = function(type) { // Increment
		// counter and
		// return
		return this.components.hasOwnProperty(type);
	}

	/**
	 * Execute function for each component of given type.
	 * 
	 * @method forEachComponentType
	 * @param {string}
	 *           type Type to look for.
	 * @param {function}
	 *           fn Function to execute.
	 * @returns {Object}
	 */
	Plugin.Node.prototype.forEachComponentType = function(type, fn) {
		if (this.components[type]) {
			for (var i = 0; i < this.components[type].length; i++) {
				fn(this.components[type][i]);
			}
		}
	}

	/**
	 * Return type of node
	 * 
	 * @method getType
	 */
	Plugin.Node.prototype.getType = function() {
		return this.type;
	};

	/**
	 * Return template name to use for this node
	 * 
	 * @method getTemplateIdentifier
	 * @returns {String}
	 */
	Plugin.Node.prototype.getTemplateIdentifier = function() {
		return this.useTemplateID;
	};

	/**
	 * Set label of predicate with given position number.
	 * 
	 * @method setPredicateLabel
	 * @param {Integer}
	 *           ind
	 * @param{String} label
	 */
	Plugin.Node.prototype.setPredicateLabel = function(i, label) {
		this.components.predicate[i].label = label;
	};

	/**
	 * Generate tile out of the node and return it.
	 * 
	 * @method generateTile
	 * @returns {jQuery}
	 */
	Plugin.Node.prototype.generateTile = function() {
		var $tile = $(templates["tileWrapper"](appendCssClasses({
			node : this
		}))).append($(templates[this.useTemplateID](appendCssClasses({
			node : this
		}))));
		$tile.data("node", this);
		return $tile;
	};

	// TODO do this in workers cause of performance
	/**
	 * Merges data of given node with own data.
	 * 
	 * @method setPredicateLabel
	 * @param {Node}
	 *           otherNode
	 * @returns {Boolean}
	 */
	Plugin.Node.prototype.merge = function(otherNode) {
		var that = this, update = false;
		$.each(otherNode.components, function(typeID, comps) {
			$.each(comps, function(i, comp) {
				var insert = true;
				if (that.components[typeID]) {
					for (var j = 0; j < that.components[typeID].length; j++) {
						if (comp.equals(that.components[typeID][j])) {
							insert = false;
							break;
						}
					}
				}
				if (insert) {
					that.addComponent(typeID, comp.data);
					update = true;
				}
			});
		});
		return update;
	};

	/**
	 * Node component to be shown on a tile
	 * 
	 * @class Plugin.Node
	 * @constructor
	 * @param {Object}
	 *           data Data of a single resource of a select query. Must contain
	 *           label and index.
	 */
	Plugin.Node.Component = function(id, type, data, style) {
		this.id = id;
		this.type = type;
		this.data = data;
		this.style = style;
	};

	/**
	 * Class to construct nodes out of sparql result sets.
	 * 
	 * @class Plugin.ComponentFactory
	 * @constructor
	 * @param {Object}
	 *           data Data of a single resource of a select query.
	 */
	Plugin.ComponentFactory = {
		// TODO equality etc
		makeComp : function(id, type, data, style) {
			var comp;
			if (style) {
				comp = new Plugin.Node.Component(id, type, data, style);
			} else {
				comp = new Plugin.Node.Component(id, type, data);
			}
			switch (type) {
			case CONS.COMP_TYPES.predicate:
				comp.equals = function(other) {
					return (this.type === other.type) && (this.data.value === other.data.value);
				}
				break;
			case CONS.COMP_TYPES.label:
				comp.equals = function(other) {
					return (this.type === other.type) && (this.data.value === other.data.value);
				}
				break;
			case CONS.COMP_TYPES.uri:
				comp.equals = function(other) {
					return (this.type === other.type) && (this.data === other.data);
				}
				break;
			default:
				comp.equals = function(other) {
					return (this.type === other.type) && (this.data.value === other.data.value);
				}
				console.log(CONS.MESSAGES.error.compType + type);
			}
			return comp;
		}
	};

	Plugin.Nodes = {};

	/**
	 * Extension of base node to represent an std element of the rdf graph.
	 * 
	 * @class Plugin.Nodes.Res
	 * @extendes Plugin.Node
	 * @constructor
	 * @param {Object}
	 *           data Data of a single resource of a select query. Must contain
	 *           label and index.
	 */
	Plugin.Nodes.Res = function(data) {
		// Call node constructor
		Plugin.Node.call(this, data);
		var that = this;
		// Function for ID generation
		var generateID = function() {
			var id = that.components.uri[0].data;
			that.forEachComponentType("predicate", function(predicate) {
				id += "_" + predicate.data.value;
			});
			return id;
		};
		this.type = CONS.NODE_TYPES.resNode; // Overwrite std node type
		this.addComponent("uri", data.subject.value, {
			display : "none"
		});
		if (isUndefinedOrNull(data.label)) {
			this.addComponent("label", {
				value : decodeURIComponent(this.uri)
			});
		} else {
			data.label.value = decodeURIComponent(data.label.value);
			this.addComponent("label", data.label);
		}
		this.id = generateID(); // Overwrite id
	};

	Plugin.Nodes.Res.prototype = Object.create(Plugin.Node.prototype);
	Plugin.Nodes.Res.prototype.constructor = Plugin.Nodes.Res;

	/**
	 * Generate tile out of node and return it.
	 * 
	 * @overwrites Plugin.Node.prototype.generateTile
	 * @method generateTile
	 * @returns {jQuery}
	 */
	Plugin.Nodes.Res.prototype.generateTile = function() {
		var $tile = Plugin.Node.prototype.generateTile.call(this);
		return $tile;
	}

	/**
	 * Extension of base node to represent an literal element of the rdf graph.
	 * 
	 * @class Plugin.Nodes.Literal
	 * @extendes Plugin.Node
	 * @constructor
	 * @param {Object}
	 *           data Data of a single resource of a select query.
	 */
	Plugin.Nodes.Literal = function(data) {
		var that = this;
		// Call node constructor
		Plugin.Node.call(this, data);
		// Function for ID generation
		var generateID = function() {
			var id = that.getFComponentOT("label").data.value;
			that.forEachComponentType("predicate", function(predicate) {
				id += "_" + predicate.data.value;
			});
			return id;
		};
		this.type = CONS.NODE_TYPES.literal;
		data.subject.value = decodeURIComponent(data.subject.value);
		this.addComponent("label", data.subject);
		this.id = generateID();
	};

	Plugin.Nodes.Literal.prototype = Object.create(Plugin.Node.prototype);
	Plugin.Nodes.Literal.prototype.constructor = Plugin.Nodes.Literal;

	/**
	 * Generate tile out of node and return it.
	 * 
	 * @overwrites Plugin.Node.prototype.generateTile
	 * @method generateTile
	 * @returns {jQuery}
	 */
	Plugin.Nodes.Literal.prototype.generateTile = function() {
		var $tile = Plugin.Node.prototype.generateTile.call(this);
		return $tile;
	};

	/**
	 * Extension of base node to represent an literal element of the rdf graph.
	 * 
	 * @class Plugin.Nodes.Blank
	 * @extendes Plugin.Node
	 * @constructor
	 * @param {Object}
	 *           data Data of a single resource of a select query.
	 */
	Plugin.Nodes.Blank = function(data) {
		// Call node constructor
		Plugin.Node.call(this, data);
		// Function for ID generation
		var generateID = function() {
			return '_' + Math.random().toString(36).substr(2, 9); // TODO
		};
		this.type = CONS.NODE_TYPES.blankNode;
		this.addComponent("label", {
			value : "BlankNode - TODO"
		});
		this.id = generateID();
	};

	Plugin.Nodes.Blank.prototype = Object.create(Plugin.Node.prototype);
	Plugin.Nodes.Blank.prototype.constructor = Plugin.Nodes.Blank;

	/**
	 * Generate tile out of node and return it.
	 * 
	 * @overwrites Plugin.Node.prototype.generateTile
	 * @method generateTile
	 * @returns {jQuery}
	 */
	Plugin.Nodes.Blank.prototype.generateTile = function() {
		var $tile = Plugin.Node.prototype.generateTile.call(this);
		return $tile;
	};

	/**
	 * Class to construct nodes out of sparql result sets.
	 * 
	 * @class Plugin.NodeFactory
	 * @constructor
	 * @param {Object}
	 *           data Data of a single resource of a select query.
	 */
	Plugin.NodeFactory = {
		make : function(data, options) {
			var node;
			switch (data.subject.token) {
			case UTIL.toToken(CONS.CSS_CLASSES.patternClasses.blanknode):
				node = new Plugin.Nodes.Blank(data);
				break;
			case UTIL.toToken(CONS.CSS_CLASSES.patternClasses.literal):
				node = new Plugin.Nodes.Literal(data);
				break;
			case UTIL.toToken(CONS.CSS_CLASSES.patternClasses.uri):
				if (data.label && (data.label.lang === undefined || data.label.lang === "en")) {
					node = new Plugin.Nodes.Res(data);
				}
				break;
			default:
				console.log(CONS.MESSAGES.error.tokenType + data.subject.token);
			}
			return node;
		}
	};

	// ========================= bSynopsis: Timeline Class
	/**
	 * Timeline
	 * 
	 * @class Plugin.TimeLine
	 * @constructor
	 */
	Plugin.TimeLine = function($parent) {
		this._$timelineContainer = $('<div class="' + CONS.CSS_CLASSES.timelineContainer + '">');
		$parent.prepend(this._$timelineContainer);
		this._$timeline = $('<ul class="' + CONS.CSS_CLASSES.timeline + '"></ul>');
		this._$timelineContainer.append(this._$timeline);
		this.timeLineNodes = [];
	};

	/**
	 * Open timeline overlay.
	 * 
	 * @method open
	 */
	Plugin.TimeLine.prototype.open = function() {
		if (this._$timelineContainer.data("isExpanded")) {
			this._$timelineContainer.data("isExpanded", false);
			this._$timelineContainer.css({
				opacity : 0,
				zIndex : -1
			});
		} else {
			this._$timelineContainer.data("isExpanded", true);
			this._$timelineContainer.css({
				"background-color" : "grey",
				opacity : 1,
				zIndex : zIndex++
			});
		}
	};

	/**
	 * Close timeline overlay.
	 * 
	 * @method close
	 */
	Plugin.TimeLine.prototype.close = function() {
		this._$timelineContainer.data("isExpanded", false);
		this._$timelineContainer.css({
			opacity : 0,
			zIndex : -1
		});
	};

	/**
	 * Add layer to timeline via timeLineNode generation.
	 * 
	 * @method addLayer
	 * @param {Plugin.Layer}
	 *           layer Layer object to be added to timeline.
	 */
	Plugin.TimeLine.prototype.addLayer = function(layer) {
		this.addNode(new Plugin.TimeLine.Node(layer));
	};

	/**
	 * Add TimeLineNode to timeline.
	 * 
	 * @method addNode
	 * @param {Plugin.TimeLine.Node}
	 *           timeLineNode TimeLineNode added to timeline.
	 */
	Plugin.TimeLine.prototype.addNode = function(timeLineNode) {
		var that = this;
		this.timeLineNodes.push(timeLineNode);
		this._$timeline.prepend(timeLineNode.getJQueryObj());
		timeLineNode.clickEvent.attach(new Plugin.Listener(function() {
			that.close();
		}));
	};

	// ========================= bSynopsis: Timeline.Node Class
	/**
	 * Timeline node object to be used in timelines.
	 * 
	 * @class Plugin.TimeLine.Node
	 * @constructor
	 */
	Plugin.TimeLine.Node = function(layer) {
		var that = this;
		this.clickEvent = new Plugin.Event(this);
		this.layer = layer;
		this.$timelineNode = $(templates
				.timelineItem({
					label : (layer.node && layer.node.hasComponentType("label")) ? layer.node
							.getFComponentOT("label").data.value : layer.id
				}));
		if (layer.$tile) {
			this.$timelineNode.css({
				"background-color" : layer.$tile.css("background-color")
			});
		}
		this.$timelineNode.click(function() {
			that.clickEvent.notify();
			that.layer.open();
			that.layer.update();
		});
	};

	/**
	 * Return jQuery object of timeline node
	 * 
	 * @method getJQueryObj
	 * @returns {JQuery}
	 */
	Plugin.TimeLine.Node.prototype.getJQueryObj = function() {
		return this.$timelineNode;
	};

	// ========================= bSynopsis: Layer Class
	/**
	 * Layer to be shown
	 * 
	 * @class Plugin.Layer
	 * @constructor
	 * @param {jQuery}
	 *           $parent Parent div container
	 * @param {Object}
	 *           options Options object of the view
	 * @param {Object}
	 *           queries Queries to use in the view
	 */
	Plugin.Layer = function($parent, options, queries) {
		var that = this;

		this.initSwitch = new Plugin.Switch(this);
		this.openEvent = new Plugin.Event(this);
		this.closeEvent = new Plugin.Event(this);
		this.filterEvent = new Plugin.Event(this);

		this.id = "layer" + layerIdCounter++;
		this.initDfd = $.Deferred();
		this.$parent = $parent;
		this.options = options;

		// When open
		this.openEvent.once(new Plugin.Listener(function(sender) {
			// When rest is init
			that.initSwitch.attach(new Plugin.Listener(function(sender) {
				that._initContent();
			}));
		}));
		$.when(that._addOverlay()).done(function() {
			$.when(that._addOverlayContent()).done(function() {
				that._initLayerData(queries);
			});
		});
	};

	/**
	 * Private method to init Layer object.
	 * 
	 * @method _initLayerData
	 * @param {Object}
	 *           queries Queries to use for layer init
	 */
	Plugin.Layer.prototype._initLayerData = function(queries) {
		var that = this;

		this.model = new Plugin.Layer.Model(queries, this.options.modelOptions, queryStore.label);
		this.view = new Plugin.Layer.View(this.model, this.$content, this.options.viewOptions);
		// Repaint on added items
		this.model.itemsAdded.attach(new Plugin.Listener(function(sender, args) {
			that.view.addTiles(that.getTilesToPaint(args.addedNodes, that.options.nodeFilters,
					that.options.tileFilters));
		}));

		// Clear view on model clearing
		this.model.modelCleared.attach(new Plugin.Listener(function(sender) {
			print("Clearing view.");
			that.view.layoutEngine.remove($(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.tile)));
		}));

		if (this.options.generateSortOptions || this.options.generateFilterOptions) {
			this.view.addOptionsBox();
			if (this.options.generateSortOptions) {
				this.view.addSorter();
			}
			if (this.options.generateFilterOptions) {
				this.view.appendFilterDiv(function() {
					that.view.addFilterLinkFn();
					that.view.addFilterBoxFn();
				});
			}
		}
		this._addCloseOnClick();
		this._addRefreshOnClick();
		this._addBackgroundColor();
		this.initSwitch.trigger();
	};

	Plugin.Layer.prototype._addBackgroundColor = function() {
		this.$overlay.css("background-color", "grey");
	};

	Plugin.Layer.prototype._addCloseOnClick = function() {
		var that = this;
		var $close = this.$overlay.find('> span' + UTIL.toSelector(CONS.CSS_CLASSES.buttonClose));
		$close.on("click", function() {
			that.close();
		});
	};

	Plugin.Layer.prototype._addRefreshOnClick = function() {
		var that = this;
		var $refresh = this.$overlay.find(UTIL.toSelector(CONS.CSS_CLASSES.refresh));
		$refresh.on("click", function() {
			that.update();
		});
	};

	Plugin.Layer.prototype.getTimeLineButton = function() {
		return this.$overlay.find(UTIL.toSelector(CONS.CSS_CLASSES.buttonTimeline));
	};

	Plugin.Layer.prototype._addOverlay = function() {
		var overlayAddedDfd = $.Deferred();
		this.$overlay = $(templates.overlayWrapper(appendCssClasses({
			"id" : this.id,
		})));
		this.$parent.append(this.$overlay);
		overlayAddedDfd.resolve();
		return overlayAddedDfd.promise();
	};

	Plugin.Layer.prototype._addOverlayContent = function() {
		var overlayContentAddedDfd = $.Deferred();
		// Dummy content (overwrite it)
		this.$content = $("<div></div>");
		this.$overlay.append(this.$content);
		overlayContentAddedDfd.resolve();
		return overlayContentAddedDfd.promise();
	};

	Plugin.Layer.prototype._initContent = function() {
		var that = this;
		print("initContent");
		if (that.options.remoteOptions.remoteDynamically) {
			if (!that.options.remoteOptions.waitForRemote) {
				that.update();

			}
			if (this.loadByRemote) {
				this.loadByRemote();
			} else {
				print("LoadByRemote currently not defined");
			}
		} else {
			this.update();
		}
	};

	/**
	 * Get the div box of the overlay
	 * 
	 * @method getJQueryObj
	 */
	Plugin.Layer.prototype.getJQueryObj = function() {
		return this.$overlay;
	};

	/**
	 * Remove the div box of the overlay
	 * 
	 * @method removeHtml
	 */
	Plugin.Layer.prototype.removeHtml = function() {
		return this.$overlay.remove();
	};

	/**
	 * Call the model update function to start selfupdating of the model
	 * 
	 * @method update
	 */
	Plugin.Layer.prototype.update = function() {
		print("Layer " + this.id + " is updating.");
		// print("Caller is " + arguments.callee.caller.toString());
		this.model.update();
	};

	/**
	 * Method to show the layer
	 * 
	 * @method open
	 */
	Plugin.Layer.prototype.open = function() {
		this.$overlay.data("isExpanded", true);
		this.show();
	};

	Plugin.Layer.prototype.show = function() {
		// Make overlay visible
		this.zIndex = zIndex++;
		this.$overlay.css({
			clip : getClip(CONS.CSS_CLASSES.overlay),
			opacity : 1,
			zIndex : this.zIndex,
			pointerEvents : 'auto'
		});
		this.openEvent.notify();
	};

	Plugin.Layer.prototype.close = function() {
		this.$overlay.data("isExpanded", false);
		this.closeEvent.notify();
		this.hide();
	};

	Plugin.Layer.prototype.hide = function() {
		this.$overlay.css({
			opacity : 0,
			zIndex : -1
		});
	};

	/**
	 * Clear the view
	 * 
	 * @method removeAllItems
	 */
	Plugin.Layer.prototype.removeAllItems = function() {
		this.model.clearModel();
	};

	Plugin.Layer.prototype.getTilesToPaint = function(nodes, nodeFilters, tileFilters) {
		return this.runTileFilters(this.generateTiles(this.runNodeFilters(nodes, nodeFilters)), tileFilters)
	};

	Plugin.Layer.prototype.runNodeFilters = function(nodes, nodeFilters) {
		var that = this;
		if (nodeFilters) {
			filters = nodeFilters;
		} else {
			filters = this.options.nodeFilters;
		}

		// Run nodeFilters on nodes
		var allStart = new Date().getTime();
		var startTime = allStart;
		var tmp;
		print("Start node filters:");
		$.each(filters, function(i, filter) {
			if (tmp) {
				print("Filter " + tmp + " done in: " + (new Date().getTime() - startTime) + " milisec");
			}
			tmp = i;
			startTime = new Date().getTime();
			if (!$.isEmptyObject(nodes)) {
				nodes = filter.fn(nodes, filter.config, that);
			} else {
				console.log(CONS.MESSAGES.warn.filterInput);
			}
		});
		print("Filter " + tmp + " done in: " + (new Date().getTime() - startTime) + " milisec");
		print("All node filter done after: " + (new Date().getTime() - startTime) + " milisec");
		return nodes;
	};

	Plugin.Layer.prototype.generateTiles = function(nodes, nodeFilters) {
		// Generate all tiles
		var $tiles = $("<div>");
		$.each(nodes, function(i, node) {
			$tiles.append($(node.generateTile()));
		});
		return $tiles;
	};

	Plugin.Layer.prototype.runTileFilters = function($tiles, tileFilters) {
		var that = this;

		// Generate all tiles
		if (tileFilters) {
			filters = tileFilters;
		} else {
			filters = this.options.tileFilters;
		}

		// Run tileFilters on tiles
		$tiles = $tiles.children();
		var allStart = new Date().getTime();
		var startTime = allStart;
		var tmp;
		$.each(filters, function(i, filter) {
			if (tmp) {
				print("Filter " + tmp + " done in: " + (new Date().getTime() - startTime) + " milisec");
			}
			tmp = i;
			startTime = new Date().getTime();
			$tiles = filter.fn($tiles, filter.config, that);
		});
		print("Filter " + tmp + " done in: " + (new Date().getTime() - startTime) + " milisec");
		print("All tile filters done after: " + (new Date().getTime() - allStart) + " milisec");
		return $tiles;
	};

	Plugin.Layer.Model = function(viewQueries, options, labelQuery) {

		// TODO Workers
		// var that = this;
		// var nodes = JSON.stringify(this._nodes);
		// print(nodes);
		// //Test
		// $.Hive.create({
		// // optional. if no 'count' property is set, Hive creates only 1 worker
		// count: 1,
		// // the worker file
		// worker: '../../workers/model.js',
		// // the receive ( convenience to writing out the addEventListener)
		// receive: function (filtered) {
		// /*
		// jQuery.Hive manages serialization/deserialization
		// */
		// console.log(filtered.data);
		//			 
		// },
		// created: function ( $hive ) {
		// /*
		// the `created` callback fires after the worker is created,
		// the first argument is an array of the workers
		// $().send() is the wrapper for postMessage() with complete
		// serialization/deserialization
		// */
		// $( $hive ).send({test : nodes});
		// }
		// });
		// print(JSON.parse(nodes));

		var that = this;
		this.viewQueries = viewQueries;
		this.labelQuery = labelQuery;
		this.options = options;

		// List of added items.
		this._nodes = {};
		this.nodesLength = 0;

		this.itemsAdded = new Plugin.Event(this);
		this.modelCleared = new Plugin.Event(this);
		this.itemUpdated = new Plugin.Event(this);

		// Helper for batch adding
		this._checkItemsHelp = function(items, batchSize) {
			var rest = items.slice(batchSize);
			if (rest.length > 0) {
				that.checkItems(rest);
			}
		};

		/**
		 * Fetches and updates the labels of the predicates of given node
		 * 
		 * @private
		 * @method _fetchPredicateLabel
		 * @param {Plugin.Node}
		 *           node Node to fetch the predicate labels for
		 */
		this._fetchPredicateLabel = function(node) {

			if (node.hasComponentType("predicate")) {
				for (var i = 0; i < node.components.predicate.length; i++) {
					var predicate = node.components.predicate[i];
					if (!labelCache.contains(predicate.value)) {
						var labelQuery = replaceDummy(that.labelQuery, predicate.value);
						rdfStore.executeQuery(labelQuery, function(results) {
							if (results && results[0]) {
								$.each(results, function(i, result) {
									node.setPredicateLabel(i, result.label.value);
									labelCache.add(predicate.value, result.label.value);
								});
							}
						});
					} else {
						node.setPredicateLabel(i, labelCache.retrieve(predicate.value));
					}
				}
			}
			return node;
		};

	};

	/**
	 * Give back a copy of in model stored nodes
	 * 
	 * @return {Object} nodes A copy of the stored nodes
	 */
	Plugin.Layer.Model.prototype.getNodes = function() {
	};

	/**
	 * Look in given resultSet for Items to add to the model.
	 * 
	 * @method checkItems
	 * @param {Object}
	 *           resultSet ResultSet of a Select query
	 */
	Plugin.Layer.Model.prototype.checkItems = function(resultSet) {
		var length = resultSet.length, that = this, batchSize = ((length < that.options.batchSize) ? length
				: that.options.batchSize);

		// current batch
		var batch = resultSet.slice(0, batchSize);
		var addedNodes = {};

		$.each(batch, function(i, val) {
			val.subject.token = UTIL.toToken(UTIL.toClass(val.subject.token));
			val.index = that.nodesLength + 1;
			var node = Plugin.NodeFactory.make(val, that.options);

			if (node) {

				switch (node.getType()) {
				case CONS.NODE_TYPES.resNode:
					if (!(node.id in that._nodes)) {
						that._nodes[node.id] = node;
						that.nodesLength++;
					} else {
						print("resNodeUpdate, fix me");
						if (that._nodes[node.id].merge(node)) {
							node = that._nodes[node.id];
							that.itemUpdated.notify(node);
						} else {
							node = undefined;
						}
					}
					break;
				case CONS.NODE_TYPES.literal:
					if (!(node.id in that._nodes)) {
						that._nodes[node.id] = node;
						that.nodesLength++;
					} else {
						print("literalupdate");
						if (that._nodes[node.id].merge(node)) {
							node = that._nodes[node.id];
							that.itemUpdated.notify(node);
						} else {
							node = undefined;
						}
					}
					break;
				case CONS.NODE_TYPES.blankNode:
					if (!(node.id in that._nodes)) {
						that._nodes[node.id] = node;
						that.nodesLength++;
					} else {
						// TODO check blankNode UPDATE ?
						print("blankNodeupdate");
						node = undefined;
					}
					break;
				}
				if (node) {
					node = that._fetchPredicateLabel(node);
					addedNodes[node.id] = node;
				}
			}
		});
		print(addedNodes);
		this.itemsAdded.notify({
			"addedNodes" : addedNodes,
			"allNodes" : this.getNodes()
		});
		that._checkItemsHelp(resultSet, batchSize);
	};

	/**
	 * Get data for the model by querying the local store
	 * 
	 * @method update
	 */
	Plugin.Layer.Model.prototype.update = function() {
		print("START");
		var that = this;
		this.allResults = [];
		// Concat all results for filtering before adding
		for (var i = 0; i < this.viewQueries.length; i++) {
			print(this.viewQueries[i].query);
			rdfStore.executeQuery(this.viewQueries[i].query, function(results) {
				print(results);
				if (results && results.length !== 0) {
					for (var j = 0; j < results.length; j++) {
						// Add types for filtering
						if (that.viewQueries[i].type) {
							results[j].predicate.type = that.viewQueries[i].type;
						}
						that.allResults.push(results[j]);
					}
				}
			});
		}

		if (this.allResults.length > 0) {
			that.checkItems(this.allResults);
		} else {
			print("Nothing to add to View");
		}
	};

	Plugin.Layer.Model.prototype.clearModel = function() {
		this._nodes = {};
		this.modelCleared.notify();
	};

	Plugin.Layer.View = function(model, $container, viewOptions) {
		this.id = "view" + viewIdCounter++;
		this.options = viewOptions;
		this._model = model;
		this.$outerContainer = $('<div class="' + CONS.CSS_CLASSES.outerContainer + '"></div>');
		this.$outerContainer.css({
			"border-radius" : "18px",
			"padding" : "5px 5px 5px 5px"
		});
		this.$viewContainer = $('<div class="' + CONS.CSS_CLASSES.viewContainer + '"></div>');
		$container.append(this.$outerContainer);
		this.$outerContainer.append(this.$viewContainer);
		this.$viewContainer.css("width", "100%");
		this.layoutEngine = Plugin.LayoutEngineFactory.make(this.$viewContainer,
				viewOptions.layoutEngineOptions);

		this._getCorrespondingTile = function(node) {
			var $tile = this.$viewContainer.find(UTIL.toClassSelector(node.id));
			print("CorrespondingTile");
			print($tile);
			return $tile;
		};
	};

	Plugin.Layer.View.prototype.clearView = function(callback) {
		this.layoutEngine.removeAll(callback);
	};

	Plugin.Layer.View.prototype.removeTiles = function($tiles, callback) {
		var that = this;
		$.each($tiles, function(i, tile) {
			var $tile = $(tile);
			that.layoutEngine.remove($tile);
		});
	};

	Plugin.Layer.View.prototype.addTiles = function($tiles) {
		this.layoutEngine.add($tiles);
	};

	Plugin.Layer.View.prototype.addOptionsBox = function() {
		this.$optionsContainer = $('<section class="' + CONS.CSS_CLASSES.options + '" class="'
				+ CONS.CSS_CLASSES.clearfix + '"></section>');
		this.$outerContainer.prepend(this.$optionsContainer);
	};

	Plugin.Layer.View.prototype.addSorter = function() {
		// Add sortoptions
		var that = this;
		var sortData = $.extend({}, this.options.sortFns);
		var sortOptions = templates.sortOptions(appendCssClasses({
			optionSet : sortData
		}));
		this.$optionsContainer.prepend(sortOptions);
		var $sorter = this.$optionsContainer.find(' > ' + UTIL.toSelector(CONS.CSS_CLASSES.sorter));
		var $sortLinks = this.$optionsContainer.find('a');

		// Add onClick
		$sortLinks.click(function() {
			// get href attribute, minus the '#'
			var sortName = $(this).attr('data-sort-value');
			// $sorterGroup.val("Group by...");
			that.$optionsContainer.find(UTIL.toSelector(CONS.CSS_CLASSES.sorter) + ' > > > .selected')
					.removeClass("selected");
			// that.$outerContainer.find("> > " +
			// UTIL.toSelector(CONS.CSS_CLASSES.groupLabel)).remove();
			$(this).addClass("selected");
			that.layoutEngine.sort(sortName, sortData[sortName]);
			return false;
		});
	};

	Plugin.Layer.View.prototype.appendFilterDiv = function(callback) {
		var filterOptions = templates.filterOptions(appendCssClasses({
			filterOptions : this.options.filterBy
		}));
		this.$filter = $(filterOptions);
		this.$optionsContainer.append(this.$filter);
		this.$filterLinks = this.$filter.filter(UTIL.toSelector(CONS.CSS_CLASSES.filter)).find("a");
		this.$filterBox = this.$filter.find('#filterField');
		if (callback) {
			callback();
		}
	}

	Plugin.Layer.View.prototype.addFilterBoxFn = function() {
		var that = this;
		// Add onKey
		this.$filterBox.keyup(function(e) {
			var selector = $(this).val().toLowerCase();
			that.$filterLinks.removeClass('selected');
			that.layoutEngine.filter(selector, "contains");
		});
	};

	Plugin.Layer.View.prototype.addFilterLinkFn = function() {
		var that = this;
		// Add onClick
		this.$filterLinks.click(function() {
			var selector = $(this).attr('data-filter-value');
			if (selector !== '*') {
				selector = "." + CONS.FA_TAG + selector;
			}
			that.$filterLinks.removeClass('selected');
			that.$filterBox.val('Enter search here.');
			$(this).addClass('selected');
			// TODO filter
			that.layoutEngine.filter(selector, "class");
			return false;
		});
	};

	// Object for all layer types
	Plugin.Layers = {};

	// ========================= bSynopsis: ResNodeLayer Class
	/**
	 * Initialization view of the plugin
	 * 
	 * @class Plugin.Layers.Res
	 * @extends Plugin.Layer
	 * @constructor
	 * @param {jQuery}
	 *           $container Container of the initialization view
	 * @param {Object}
	 *           options Options object
	 * @param {Plugin}
	 *           plugin The parent plugin of the initialization view
	 */
	Plugin.Layers.Res = function($container, options, $tile) {
		this.$tile = $tile;
		this.node = $tile.data("node");

		// Get queries
		var queries = []
		var subjectOfQuery = replaceDummy(queryStore.selectSubjectOf, this.node.getFComponentOT("uri").data);
		var objectOfQuery = replaceDummy(queryStore.selectObjectOf, this.node.getFComponentOT("uri").data);
		queries.push({
			query : subjectOfQuery,
			type : CONS.CSS_CLASSES.typeClasses.outgoing
		});
		queries.push({
			query : objectOfQuery,
			type : CONS.CSS_CLASSES.typeClasses.incoming
		});
		Plugin.Layer.call(this, $container, options, queries);
	};

	// pseudo class inheritance
	Plugin.Layers.Res.prototype = Object.create(Plugin.Layer.prototype);
	Plugin.Layers.Res.prototype.constructor = Plugin.Layers.Res;

	Plugin.Layers.Res.prototype._addOverlayContent = function() {
		var overlayContentAddedDfd = $.Deferred();
		var $content = this.$overlay.find(UTIL.toSelector(CONS.CSS_CLASSES.overlayContent));
		$content.append($(templates.overlayContent(appendCssClasses({
			node : this.node
		}))));
		this.$content = $content.find(UTIL.toSelector(CONS.CSS_CLASSES.innerScroll));
		// Set innerScrollBox width and height
		this.$content.css("width",
				($window.width() - parseInt(this.$overlay.css("padding-left")) - parseInt(this.$overlay
						.css("padding-right")))
						+ "px");
		this.$content.css("height", $window.height()
				- this.$overlay.find(UTIL.toSelector(CONS.CSS_CLASSES.innerNoScroll)).height() + "px");
		overlayContentAddedDfd.resolve();
		return overlayContentAddedDfd.promise();
	};

	Plugin.Layers.Res.prototype._addBackgroundColor = function() {
		var color = new RGBColor(this.$tile.css("background-color"));
		this.$overlay.css("background-color", color.toRGB());
		$.each(this.$content.children('div' + UTIL.toSelector("innerScroll")), function(i, val) {
			color.r -= 10;
			color.b -= 10;
			color.g -= 10;
			$(val).css("background", color.toRGB());
		});
	};

	/**
	 * Load children by remote service
	 * 
	 * @method loadByRemote
	 */
	Plugin.Layers.Res.prototype.loadByRemote = function() {

		var that = this;
		var $innerNoScroll = that.$overlay.find(UTIL.toSelector(CONS.CSS_CLASSES.innerNoScroll));

		$innerNoScroll.css({
			"background-image" : "url('img/loader.gif')",
			"background-repeat" : "no-repeat",
			"background-position" : "center"
		});

		// Get items who are in a relation to
		// current item
		var remoteSubjectOf = replaceDummy(queryStore.remoteSubjectOf, that.node.getFComponentOT("uri").data)
				+ " LIMIT " + that.options.remoteOptions.remoteLimit;
		var remoteObjectOf = replaceDummy(queryStore.remoteObjectOf, that.node.getFComponentOT("uri").data)
				+ " LIMIT " + that.options.remoteOptions.remoteLimit;

		// multiplactor 2 is num of queries
		var remoteToDo = remoteDataLoader.backends.length * 2;
		var remoteDoneCount = 0;
		remoteDataLoader.loadingDone.attach(new Plugin.Listener(function(e, query) {
			if (query === remoteSubjectOf || query === remoteObjectOf) {
				remoteDoneCount++;
				print("remoteDoneCount " + remoteDoneCount);
				that.update();
				if (remoteDoneCount === remoteToDo) {
					$innerNoScroll.css({
						"background-image" : ""
					});
					remoteDataLoader.loadingDone.dettach(this);
				}
			}
		}));

		// remote needed?
		remoteDataLoader.insertByQuery(remoteSubjectOf);
		remoteDataLoader.insertByQuery(remoteObjectOf);
	};

	Plugin.Layers.Res.prototype.show = function() {
		// <---- overlay show function ---->
		var that = this;
		this.zIndex = zIndex++;
		var previewClip = getClip(CONS.CSS_CLASSES.preview), overlayClip = getClip(CONS.CSS_CLASSES.overlay);

		// Make overlay visible
		this.$overlay.css({
			clip : supportTransitions ? previewClip : overlayClip,
			opacity : 1,
			zIndex : this.zIndex,
			pointerEvents : 'auto'
		});

		if (supportTransitions) {
			that.$overlay.on(transEndEventName, function() {
				that.$overlay.off(transEndEventName);
				setTimeout(function() {
					that.$overlay.css('clip', overlayClip).on(transEndEventName, function() {
						that.$overlay.off(transEndEventName);
						that.openEvent.notify();
					});
				}, 25);

			});
		} else {
			that.openEvent.notify();
		}
		// <!--- overlay show function ---->
	};

	Plugin.Layers.Res.prototype.hide = function() {
		var that = this;
		var layoutProp = getItemLayoutProp(this.$tile), itemClip = 'rect(' + layoutProp.top + 'px '
				+ (layoutProp.left + layoutProp.width) + 'px ' + (layoutProp.top + layoutProp.height) + 'px '
				+ layoutProp.left + 'px)';
		// this.$overlay.children().remove('');
		this.$overlay.css({
			clip : itemClip,
			opacity : 1,
			pointerEvents : 'none'
		});

		// <---- overlay hide ---->
		if (supportTransitions) {
			that.$overlay.on(transEndEventName, function() {
				that.$overlay.off(transEndEventName);
				setTimeout(function() {
					that.$overlay.css('opacity', 0).on(transEndEventName, function() {
						that.$overlay.off(transEndEventName).css({
							clip : 'auto',
							zIndex : -1
						});
						// that.$overlay.remove();
						that.$tile.data('isExpanded', false);
					});
				}, 25);
			});
		} else {
			that.$overlay.css({
				opacity : 0,
				zIndex : -1
			});
			// that.$overlay.remove();
			that.$tile.data('isExpanded', false);
		}
		// <!--- overlay hide ---->
	};

	Plugin.Layers.InlayRes = function($container, options, uri) {
		this.uri = uri;
		// Get queries
		var queries = []
		var subjectOfQuery = replaceDummy(queryStore.selectSubjectOf, uri);
		var objectOfQuery = replaceDummy(queryStore.selectObjectOf, uri);
		queries.push({
			query : subjectOfQuery,
			type : CONS.CSS_CLASSES.typeClasses.outgoing
		});
		queries.push({
			query : objectOfQuery,
			type : CONS.CSS_CLASSES.typeClasses.incoming
		});
		Plugin.Layer.call(this, $container, options, queries);
	};

	// pseudo class inheritance
	Plugin.Layers.InlayRes.prototype = Object.create(Plugin.Layer.prototype);
	Plugin.Layers.InlayRes.prototype.constructor = Plugin.Layers.Res;

	Plugin.Layers.InlayRes.prototype.loadByRemote = function() {
		print("loadrem");
		var that = this;
		var remoteSubjectOf = replaceDummy(queryStore.remoteSubjectOf, that.uri) + " LIMIT "
				+ that.options.remoteOptions.remoteLimit;
		var remoteObjectOf = replaceDummy(queryStore.remoteObjectOf, that.uri) + " LIMIT "
				+ that.options.remoteOptions.remoteLimit;

		// multiplactor 2 is num of queries
		var remoteToDo = remoteDataLoader.backends.length * 2;
		var remoteDoneCount = 0;
		remoteDataLoader.loadingDone.attach(new Plugin.Listener(function(e, query) {
			if (query === remoteSubjectOf || query === remoteObjectOf) {
				remoteDoneCount++;
				print("remoteDoneCount " + remoteDoneCount);
				that.update();
				if (remoteDoneCount === remoteToDo) {
					remoteDataLoader.loadingDone.dettach(this);
				}
			}
		}));

		// remote needed?
		remoteDataLoader.insertByQuery(remoteSubjectOf);
		remoteDataLoader.insertByQuery(remoteObjectOf);
	};

	Plugin.Layers.InlayRes.prototype._addOverlay = function() {
		var overlayContentAddedDfd = $.Deferred();
		this.$overlay = this.$parent;
		overlayContentAddedDfd.resolve();
		return overlayContentAddedDfd.promise();
	};

	Plugin.Layers.InlayRes.prototype._addBackgroundColor = function() {

	};

	Plugin.Layers.InlayRes.prototype._addOverlayContent = function() {
		var overlayContentAddedDfd = $.Deferred();
		this.$content = $("<div class=" + CONS.CSS_CLASSES.overlayContent + "></div>");
		this.$overlay.append(this.$content);
		overlayContentAddedDfd.resolve();
		return overlayContentAddedDfd.promise();
	};

	Plugin.Layers.InlayRes.prototype.open = function() {
		this.openEvent.notify();
	};

	Plugin.Layers.InlayRes.prototype.show = function() {
		this.$overlay.css({
			position : "static",
			opacity : 1,
			pointerEvents : 'auto'
		});
	};

	Plugin.Layers.InlayRes.prototype.hide = function() {
		this.$overlay.css({
			opacity : 0
		});
	};

	// ========================= bSynopsis: LiteralNodeLayer Class
	/**
	 * Initialization view of the plugin
	 * 
	 * @class Plugin.Layers.Literal
	 * @extends Plugin.Layer
	 * @constructor
	 * @param {jQuery}
	 *           $container Container of the initialization view
	 * @param {Object}
	 *           options Options object
	 * @param {Plugin}
	 *           plugin The parent plugin of the initialization view
	 */
	Plugin.Layers.Literal = function($container, options, $tile) {
		this.$tile = $tile;
		this.node = $tile.data("node");

		// Get queries
		var queries = []
		var literalIsObjectOf = replaceDummy(queryStore.literalIsObjectOf,
				this.node.getFComponentOT("label").data.value);
		queries.push({
			query : literalIsObjectOf,
			type : CONS.CSS_CLASSES.typeClasses.incoming
		});
		Plugin.Layer.call(this, $container, options, queries);
	};

	// pseudo class inheritance
	Plugin.Layers.Literal.prototype = Object.create(Plugin.Layer.prototype);
	Plugin.Layers.Literal.prototype.constructor = Plugin.Layers.Literal;

	Plugin.Layers.Literal.prototype._addOverlayContent = function() {
		return Plugin.Layers.Res.prototype._addOverlayContent.call(this);
	};

	Plugin.Layers.Literal.prototype._addBackgroundColor = function() {
		Plugin.Layers.Res.prototype._addBackgroundColor.call(this);
	};

	/**
	 * Load children by remote service
	 * 
	 * @method loadByRemote
	 */
	Plugin.Layers.Literal.prototype.loadByRemote = function() {

		var that = this;
		// Get items who are in a relation to
		// current item
		var remoteLiteralIsObjectOf = replaceDummy(queryStore.remoteLiteralIsObjectOf, that.node
				.getFComponentOT("value"));

		// remote needed?
		remoteDataLoader.insertByQuery(remoteLiteralIsObjectOf + " LIMIT "
				+ that.options.remoteOptions.remoteLimit);
	};

	// ========================= bSynopsis: BlankNodeLayer Class
	/**
	 * Initialization view of the plugin
	 * 
	 * @class Plugin.Layers.Blank
	 * @extends Plugin.Layer
	 * @constructor
	 * @param {jQuery}
	 *           $container Container of the initialization view
	 * @param {Object}
	 *           options Options object
	 * @param {Plugin}
	 *           plugin The parent plugin of the initialization view
	 */
	Plugin.Layers.Blank = function($container, options) {
		// TODO
	};

	// pseudo class inheritance
	Plugin.Layers.Blank.prototype = Object.create(Plugin.Layer.prototype);
	Plugin.Layers.Blank.prototype.constructor = Plugin.Layers.Blank;

	// ========================= bSynopsis: Layers Inlay Class
	/**
	 * Initialization view of the plugin
	 * 
	 * @class Plugin.Layers.Inlay
	 * @extends Plugin.Layer
	 * @constructor
	 * @param {jQuery}
	 *           $container Container of the initialization view
	 * @param {Object}
	 *           options Options object
	 * @param {Plugin}
	 *           plugin The parent plugin of the initialization view
	 */
	Plugin.Layers.Inlay = function($container, options, queries) {
		Plugin.Layer.call(this, $container, options, queries);
	};

	// pseudo class inheritance
	Plugin.Layers.Inlay.prototype = Object.create(Plugin.Layer.prototype);
	Plugin.Layers.Inlay.prototype.constructor = Plugin.Layers.Blank;

	Plugin.Layers.Inlay.prototype._addOverlay = function() {
		var overlayContentAddedDfd = $.Deferred();
		this.$overlay = this.$parent;
		overlayContentAddedDfd.resolve();
		return overlayContentAddedDfd.promise();
	};

	Plugin.Layers.Inlay.prototype._addBackgroundColor = function() {

	};

	Plugin.Layers.Inlay.prototype._addOverlayContent = function() {
		var overlayContentAddedDfd = $.Deferred();
		this.$content = this.$overlay;
		overlayContentAddedDfd.resolve();
		return overlayContentAddedDfd.promise();
	};

	Plugin.Layers.Inlay.prototype.show = function() {
		this.$overlay.css({
			position : "static",
			opacity : 1,
			pointerEvents : 'auto'
		});
	};

	Plugin.Layers.Inlay.prototype.hide = function() {
		this.$overlay.css({
			opacity : 0
		});
	};

	// ========================= bSynopsis: Preview Class
	// TODO preview

	// ========================= bSynopsis: TemplatesLoader Class
	/**
	 * Handlebars templates loader to load precompiled or nonprecompiled
	 * templates
	 * 
	 * @class Plugin.TemplatesLoader
	 * @constructor
	 * @param {Deferred
	 *           Object} dfd Deferred Object to resolve when loading is done
	 */
	Plugin.TemplatesLoader = function(dfd) {
		this._templateInitDfd = dfd;
		this._neededTemps = [ "filterOptions", "sortOptions", "tileWrapper", "stdNode", "groupDropDown",
				"overlayContent", "overlayWrapper", "previewItem", "timelineWrapper", "timelineItem" ];

		this._methodsAreLoaded = function(/*
														 * array of templatenames which must
														 * be loaded
														 */) {
			var i = 0, methodName;
			while (arguments[0[i++]] !== undefined) {
				if (typeof templates[arguments[i]] !== 'function') {
					return false;
				}
			}
			return true;
		};
	};

	Plugin.TemplatesLoader.prototype._isLoaded = function() {
		if (this._methodsAreLoaded(this._neededTemps)) {
			this._templateInitDfd.resolve();
			return true;
		} else {
			console.log(CONS.MESSAGES.error.template);
			this._templateInitDfd.reject();
			return false;
		}
	};

	Plugin.TemplatesLoader.prototype.getPrecompiledTemplates = function() {
		templates = window[pluginName]["templates"];
		return this._isLoaded();
	};

	// ========================= bSynopsis: RemoteDataLoader Class
	/**
	 * Loader to load remote data from services at the given urls and add them to
	 * the view
	 * 
	 * @class Plugin.RemoteDataLoader
	 * @constructor
	 * @param {Array}
	 *           remoteBackends Array of URLs of SPARQL services to query
	 * @param {Integer}
	 *           pluginID ID of parten plugin
	 */
	Plugin.RemoteDataLoader = function(remoteBackends) {
		this.backends = remoteBackends;
		this.remoteEngine = new RemoteEngine();
		this.loadingStarted = new Plugin.Event(this);
		this.loadingDone = new Plugin.Event(this);
	};

	Plugin.RemoteDataLoader.prototype.addBackend = function(backend) {
		if (!this.backends.find(backend)) {
			this.backends.push(backend);
		}
	};

	Plugin.RemoteDataLoader.prototype.removeBackend = function(backend) {
		var index = this.backends.indexOf(backend);
		if (index > -1) {
			this.backends.splice(index, 1);
		}
	};

	Plugin.RemoteDataLoader.prototype.generateTypeInsertionQuery = function(data) {
		var insertionQuery = "INSERT DATA {";
		$.each(data, function(i, val) {
			if (val.res && val.type) {
				insertionQuery += "<" + val.res.value + "> a " + "<" + val.type.value + ">.";
			}
		});
		insertionQuery += "}";
		return insertionQuery;
	};

	Plugin.RemoteDataLoader.prototype.generateInsertionQuery = function(data) {
		var insertionQuery = "INSERT DATA {";
		$.each(data, function(i, val) {
			if (val.subject === undefined) {
				print("Resultset disfigured.");
			} else if (val.subject.type === "uri") {
				insertionQuery += "<" + val.subject.value + "> ";
			} else {
				// TODO BlankNodes
				insertionQuery += "<" + val.subject.value + "> ";
			}
			insertionQuery += "<" + val.predicate.value + "> ";
			if (val.object.type === "uri") {
				insertionQuery += "<" + val.object.value + ">. ";
			} else if (val.object.type === "literal") {
				insertionQuery += '"' + encodeURIComponent(val.object.value) + '". ';
			} else if (val.object.type === "typed-literal") {
				// TODO typed-literals
				insertionQuery += '"' + encodeURIComponent(val.object.value) + '". ';
			}
			if (val.labelSub) {
				insertionQuery += '<' + val.subject.value + '> rdfs:label "'
						+ encodeURIComponent(val.labelSub.value) + '". ';
			}
			if (val.labelObj) {
				insertionQuery += '<' + val.object.value + '> rdfs:label "'
						+ encodeURIComponent(val.labelObj.value) + '". ';
			}
			if (val.labelPred) {
				labelCache.add(encodeURIComponent(val.predicate.value), encodeURIComponent(val.labelPred.value));
			}
		});
		insertionQuery += "}";
		return insertionQuery;
	};

	Plugin.RemoteDataLoader.prototype._loadRemoteAndInsert = function(query, service, fn, callback) {
		// Execute selection query
		this.remoteEngine.executeQuery(query, service, function(data, success) {

			print("Remotequery: '" + query + "' was a success on " + service + "? \n" + success);
			// Generate insertionQuery out of the resultset.
			if (data && success) {
				if (data.subject !== undefined) {
					data = [ data ];
				}
				print("Gives this results: ");
				print(data);
				// Execute insertion
				rdfStore.executeQuery(fn(data), function() {
					if (callback) {
						callback(success);
					}
				});
			} else {
				if (callback) {
					callback(success);
				}
			}
		});
	};

	Plugin.RemoteDataLoader.prototype.executeQuery = function(query, backends, fn) {
		var that = this;
		// Inform the plugin something is loading
		this.loadingStarted.notify();
		var count = -1;
		var backendFlags = [];
		$.each(backends, function(i, val) {
			count++;
			backendFlags[count] = false;
			that._loadRemoteAndInsert(query, val, fn, function(success) {
				backendFlags[count] = true;
				var done = true;
				for (var j = 0; j < backendFlags.length; j++) {
					if (!backendFlags[j]) {
						done = false;
					}
				}
				if (done) {
					that.loadingDone.notify(query);
				}
			});
		});
	};

	Plugin.RemoteDataLoader.prototype.insertByResultset = function(data, callback) {
		var that = this;
		rdfStore.executeQuery(this.generateInsertionQuery(data), function() {
			that.loadingDone.notify("");
			if (callback) {
				callback();
			}
		});
	};

	// Inserts Data by querying all services
	Plugin.RemoteDataLoader.prototype.insertByQuery = function(query, backends) {
		if (backends) {
			this.executeQuery(query, backends, this.generateInsertionQuery);
		} else {
			this.executeQuery(query, this.backends, this.generateInsertionQuery);
		}
	};

	Plugin.RemoteDataLoader.prototype.insertTypesByQuery = function(query, backends) {
		if (backends) {
			this.executeQuery(query, backends, this.generateTypeInsertionQuery);
		} else {
			this.executeQuery(query, this.backends, this.generateTypeInsertionQuery);
		}
	};

	// ========================= bSynopsis ===============================

	// Plugin constructor
	/**
	 * Main plugin class of bSynopsis
	 * 
	 * @class Plugin
	 * @constructor
	 * @param {jQuery}
	 *           obj Parent object of the plugin
	 * @param {Object}
	 *           options Options for the plugin
	 */

	// Default options
	/**
	 * Default options for bSynopsis.
	 * 
	 * @property defaults
	 * @type Object
	 */
	var defaults = {
		// TODO workers
		pathToWorkers : "../../workers/",
		language : "en",
		/**
		 * Raw RDF data given on plugin startup. This data will be loaded into the
		 * store.
		 * 
		 * @property defaults.data
		 * @type String
		 * @default undefined
		 */
		data : undefined,
		/**
		 * Path to file with Raw RDF data given on plugin startup. This file will
		 * be parsed and loaded into the store.
		 * 
		 * @property defaults.dataLoc
		 * @type String
		 * @default undefined
		 */
		dataLoc : undefined,
		/**
		 * Format of the RDF data which is given on plugin startup.
		 * 
		 * @property defaults.dataFormat
		 * @type String
		 * @default undefined
		 */
		dataFormat : undefined,
		/**
		 * SPARQL resultset bindings which can be used to insert data into the
		 * store on init.
		 * 
		 * @property defaults.sparqlData
		 * @type Object
		 * @default undefined
		 */
		sparqlData : undefined,
		/**
		 * Flag to indicate whether a timeline should be generated and used.
		 * 
		 * @property defaults.generateTimeline
		 * @type Boolean
		 * @default true
		 */
		generateTimeline : true,
		initLayer : {
			name : "Inlay",
			args : [ [ {
				query : "SELECT ?subject ?label ?description ?type WHERE { ?subject rdfs:label ?label . OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }. OPTIONAL {?subject rdfs:type ?type}}"
			} ] ]
		// name : "Res",
		// args : ["http://dbpedia.org/resource/Passau"]
		},
		openDetailOnInit : "",
		/**
		 * Options for the rdf store class. Uses rdfstore-js
		 * https://github.com/antoniogarrote/rdfstore-js options structure.
		 * 
		 * @property defaults.rdfstoreOptions
		 * @type Object
		 */
		rdfstoreOptions : {
			persistence : true,
			name : '',
			overwrite : true,
			engine : '',
			engineData : {
				mongoDomain : '',
				mongoPort : '',
				mongoOptions : {}
			}
		},
		/**
		 * Options for the bSynopsis view layer.
		 * 
		 * @property defaults.layerOptions
		 * @type Object
		 */
		layerOptions : {
			/**
			 * Filters to be used before node display. Filters only work on single
			 * batches. The batchSize should be chosen big enough if Nodefilters
			 * are to be used. New filters must have a unique identifier.
			 * 
			 * @property defaults.filters
			 * @type Object
			 */
			nodeFilters : {
				/**
				 * Filters blacklisted resources defined by predicate URIs in config
				 * options. Only RegEx allowed.
				 * 
				 * @property defaults.layerOptions.nodeFilters.blacklistPredURI
				 * @type Object
				 */
				blacklistPredURI : {
					fn : function(nodes, config) {
						$.each(nodes, function(i, node) {
							if (node.hasComponentType("predicate") && config) {
								$.each(config, function(j, exp) {
									for (var i = 0; i <= node.componentTypes.predicate; i++) {
										var res = new RegExp(exp).exec(node.components.predicate[i].value);
										if (res !== null) {
											delete nodes[i];
										}
									}
								});
							}
						});
						return nodes;
					},
					config : new Array()
				// Regex to be filtered
				},

				/**
				 * Filters blacklisted resources defined by URIs in config options.
				 * Only RegEx allowed.
				 * 
				 * @property defaults.layerOptions.nodeFilters.blacklistURI
				 * @type Object
				 */
				blacklistURI : {
					fn : function(nodes, config) {
						$.each(nodes, function(i, node) {
							if (node.hasComponentType("uri") && config) {
								$.each(config, function(j, exp) {
									var res = new RegExp(exp).exec(node.components.uri[0]);
									if (res !== null) {
										delete nodes[i];
									}
								});
							}
						});
						return nodes;
					},
					config : new Array()
				// Regex to be filtered
				},

				/**
				 * Merges resNodes describing the same resource (subject or object).
				 * 
				 * @property defaults.layerOptions.nodeFilters.multiResNode
				 * @type Object
				 */
				multiResNode : {
					fn : function(nodes, config) {
						var tempArray = new Array();
						$.each(nodes, function(i, node) {
							if (node.type === "resNode" || node.type === "multiResNode") {
								if (node.components.uri[0].data in tempArray) {
									tempArray[node.components.uri[0].data].type = "multiResNode";
									tempArray[node.components.uri[0].data].merge(node);
									delete nodes[i];
								} else {
									tempArray[node.components.uri[0].data] = node;
								}
							}
						});
						return nodes;
					}
				},

				blankNode : {
					fn : function(nodes, config) {
						$.each(nodes, function(i, node) {
							if (node.getType() == CONS.NODE_TYPES.blankNode) {
								// TODO Blanknode
								print("TODO Blanknode");
							}
						});
						return nodes;
					},
					config : {

					}
				}

			},
			/**
			 * Define ilters for tiles
			 * 
			 * @property defaults.layerOptions.tileFilters
			 * @type Object
			 */
			tileFilters : {
				/**
				 * Scales tiles
				 * 
				 * @property defaults.layerOptions.tileFilters.scale
				 * @type Object
				 */
				scale : {
					fn : function($tiles, config) {

						$.each($tiles, function(i, tile) {
							var $tile = $(tile);
							var node = $tile.data("node");
							var nStyle;
							if (node.style) { // Style passed via
								// node
								nStyle = node.style;
							} else if (config.defaultStyles[node.getType()]) { // Style
								// chosen
								// via node type
								nStyle = config.defaultStyles[node.getType()];
							} else { // Default style
								nStyle = config.defaultStyles["stdNode"];
							}
							if (typeof nStyle.height != "number") { // If
								// height of iles should be dynamic (depending on
								// components)
								if (node.dynLayoutFn) { // Function
									// passed
									// via node
									node.dynLayoutFn($tile, node, nStyle, config);
								} else if (config.defaultDynLayoutFns[node.getType()]) { // Function
									// chosen
									// via node
									// type
									config.defaultDynLayoutFns[node.getType()]($tile, node, nStyle, config);
								} else { // Default function
									config.defaultDynLayoutFns["stdNode"]($tile, node, nStyle, config);
								}
							} else { // If height should be
								// static
								if (node.layoutFn) { // Function
									// passed
									// via node
									node.layoutFn($tile, node, nStyle, config);
								} else if (config.defaultLayoutFns[node.getType()]) { // Function
									// chosen
									// via
									// node
									// type
									config.defaultLayoutFns[node.getType()]($tile, node, nStyle, config);
								} else { // Default function
									config.defaultLayoutFns["stdNode"]($tile, node, nStyle, config);
								}
							}
						});
						return $tiles;
					},
					config : {
						multiplicator : 1,
						defaultLayoutFns : {
							stdNode : function($tile, node, nStyle, config) {
								var anchorY = $tile.height() + nStyle.topPadding;
								var mult = config.multiplicator;
								$tile.width(nStyle.width * mult);
								var height = nStyle.height * mult;
								$tile.height(height);
								var contentHeight = height - (nStyle.topPadding + nStyle.bottomPadding * mult);
								var temp = 0;
								var cStyles = {};
								$.each(node.components, function(j, componentType) {
									$.each(componentType, function(i, component) {
										var id = component.id;
										if (component.style) {
											cStyles[id] = component.style;
										} else if (config.defaultContentStyles[component.type]) {
											cStyles[id] = config.defaultContentStyles[component.type];
										} else {
											cStyles[id] = config.defaultContentStyles["stdComponent"];
										}
										if (cStyles[id] && (!cStyles[id].display || cStyles[id].display != "none")) {
											temp += cStyles[id].height;
										}
									});
								});
								$.each(node.components, function(j, componentType) {
									$.each(componentType, function(i, component) {
										var id = component.id;
										if (cStyles[id] && (!cStyles[id].display || cStyles[id].display != "none")) {
											var cStyle = cStyles[id];
											if (component.layoutFn) {
												anchorY = component.layoutFn($tile, node, nStyle, component, cStyle,
														config, anchorY, contentHeight, temp);
											} else if (config.defaultContentLayoutFns[component.type]) {
												anchorY = config.defaultContentLayoutFns[component.type]($tile, node,
														nStyle, component, cStyle, config, anchorY, contentHeight, temp);
											} else {
												anchorY = config.defaultContentLayoutFns["stdComponent"]($tile, node,
														nStyle, component, cStyle, config, anchorY, contentHeight, temp);
											}
										}
									});
								});
							}
						},
						defaultDynLayoutFns : {
							stdNode : function($tile, node, nStyle, config) {
								var startY = $tile.height();
								var mult = config.multiplicator;
								var anchorY = startY + (nStyle.topPadding * mult);
								$tile.width(nStyle.width * mult);
								$.each(node.components, function(j, componentType) {
									$.each(componentType, function(i, component) {
										var cStyle;
										if (component.style) {
											cStyle = component.style;
										} else if (config.defaultContentStyles[component.type]) {
											cStyle = config.defaultContentStyles[component.type];
										} else {
											cStyle = config.defaultContentStyles["stdComponent"];
										}
										if (cStyle && (!cStyle.display || cStyle.display != "none")) {
											if (component.dynLayoutFn) {
												anchorY = component.dynLayoutFn($tile, node, nStyle, component, cStyle,
														config, anchorY);
											} else if (config.defaultContentDynLayoutFns[component.type]) {
												anchorY = config.defaultContentDynLayoutFns[component.type]($tile, node,
														nStyle, component, cStyle, config, anchorY);
											} else {
												anchorY = config.defaultContentDynLayoutFns["stdComponent"]($tile, node,
														nStyle, component, cStyle, config, anchorY);
											}
										}
									});
								});
								$tile.height(anchorY + (nStyle.bottomPadding * mult) - startY);
							}
						},
						defaultContentLayoutFns : {
							predicate : function($tile, node, nStyle, component, cStyle, config, anchorY,
									contentHeight, divisor) {
								var $component = $tile.find(UTIL.toClassSelector(component.id));
								print(UTIL.toClassSelector(component.id));
								console.log($component)
								var mult = config.multiplicator;
								var cHeight = contentHeight * (cStyle.height / divisor) - nStyle.spacing * mult;
								var cWidth = ((nStyle.width - nStyle.leftPadding - nStyle.rightPadding) * mult);
								$component.height(cHeight);
								$component.width(cWidth);
								$component.css("top", anchorY);
								$component.css("left", nStyle.leftPadding);
								anchorY += (cHeight + nStyle.spacing * mult);
								$component.children().height(cHeight);
								var $typeImage = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.typeImage));
								var $predicate = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.predicate));
								var $predicateLabel = $tile.find(UTIL
										.toSelector(CONS.CSS_CLASSES.tileClasses.predicateLabel));
								var imageWidth = cWidth * 0.2;
								$typeImage.height("auto");
								$typeImage.width(imageWidth);
								$predicateLabel.css("left", imageWidth);
								$predicateLabel.width(cWidth - imageWidth);
								$predicate.width(cWidth);
								return anchorY;
							},
							stdComponent : function($tile, node, nStyle, component, cStyle, config, anchorY,
									contentHeight, divisor) {
								var $component = $tile.find(UTIL.toClassSelector(component.id));
								var mult = config.multiplicator;
								var cHeight = contentHeight * (cStyle.height / divisor) - nStyle.spacing * mult;
								$component.width((nStyle.width - nStyle.leftPadding - nStyle.rightPadding) * mult);
								$component.height(cHeight);
								$component.css("top", anchorY);
								$component.css("left", nStyle.leftPadding);
								anchorY += (cHeight + nStyle.spacing * mult);
								return anchorY;
							}
						},
						defaultContentDynLayoutFns : {
							predicate : function($tile, node, nStyle, component, cStyle, config, anchorY) {
								var $component = $tile.find(UTIL.toClassSelector(component.id));
								var mult = config.multiplicator;
								var cHeight = cStyle.height * mult;
								var cWidth = (nStyle.width - nStyle.leftPadding - nStyle.rightPadding) * mult;
								$component.height(cHeight);
								$component.width(cWidth);
								$component.css("top", anchorY);
								$component.css("left", nStyle.leftPadding);
								anchorY += (cHeight + nStyle.spacing * mult);
								$component.children().height(cHeight);
								var $typeImage = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.typeImage));
								var $predicate = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.predicate));
								var $predicateLabel = $tile.find(UTIL
										.toSelector(CONS.CSS_CLASSES.tileClasses.predicateLabel));
								var imageWidth = cWidth * 0.2;
								$typeImage.height("auto");
								$typeImage.width(imageWidth);
								$predicateLabel.css("left", imageWidth);
								$predicateLabel.width(cWidth - imageWidth);
								$predicate.width(cWidth);
								return anchorY;
							},
							stdComponent : function($tile, node, nStyle, component, cStyle, config, anchorY) {
								var $component = $tile.find(UTIL.toClassSelector(component.id));
								var mult = config.multiplicator;
								$component.width((nStyle.width - nStyle.leftPadding - nStyle.rightPadding) * mult);
								$component.height(cStyle.height * mult);
								$component.css("top", anchorY);
								$component.css("left", nStyle.leftPadding);
								anchorY += ((cStyle.height + nStyle.spacing) * mult);
								return anchorY;
							}
						},
						defaultStyles : {
							/**
							 * Styles of literal items.
							 * 
							 * @property defaults.layerOptions.tileFilters.scale.config.defaultStyles.literal
							 * @type Object
							 */
							// literal : {
							/**
							 * Width of literal items.
							 * 
							 * @property defaults.layerOptions.tileFilters.scale.config.defaultStyles.literal.width
							 * @type Integer
							 * @default 200
							 */
							// width : 200,
							/**
							 * Height of literal items.
							 * 
							 * @property defaults.layerOptions.tileFilters.scale.config.defaultStyles.literal.height
							 * @type Integer
							 * @default 100
							 */
							// height : 100
							// },
							/**
							 * Styles of res nodes.
							 * 
							 * @property defaults.layerOptions.tileFilters.scale.config.defaultStyles.stdNode
							 * @type Object
							 */
							stdNode : {
								/**
								 * Width of items.
								 * 
								 * @property defaults.layerOptions.tileFilters.scale.config.defaultStyles.stdNode.width
								 * @type Integer
								 * @default 200
								 */
								width : 200,
								/**
								 * Height of items.
								 * 
								 * @property defaults.layerOptions.tileFilters.scale.config.defaultStyles.stdNode.width
								 * @type Integer or String
								 * @default 200 / dynamic
								 */
								height : "dynamic",
								topPadding : 10,
								leftPadding : 10,
								rightPadding : 10,
								bottomPadding : 10,
								spacing : 5
							}
						},
						defaultContentStyles : {
							predicate : {
								height : 20
							},
							label : {
								height : 60
							},
							stdComponent : {
								height : 40
							}
						}
					}
				},

				/**
				 * Scales text of tiles
				 * 
				 * @property defaults.layerOptions.tileFilters.textScale
				 * @type Object
				 */
				textScale : {
					fn : function($tiles, config, layer) {
						// On layout done event
						// TODO fix if hidden
						layer.view.layoutEngine.partialDoneEvent.attach(new Plugin.Listener(function(e,
								newInsertions) {
							newInsertions = $(newInsertions);
							if (newInsertions) {
								var startTime = new Date().getTime();
								var $fitHere = newInsertions.find(UTIL.toSelector(CONS.CSS_CLASSES.textScale));
								$fitHere.textfill(config.maxFontPixels, config.minFontPixels, function($parent) {
									$parent.css({
										"overflow-y" : "auto",
										"word-wrap" : "break-word"
									});
								});
								$fitHere.removeClass(CONS.CSS_CLASSES.textScale);
								$fitHere.addClass(CONS.CSS_CLASSES.textScaleDone);
								print("Event textScaleEvent done after: " + (new Date().getTime() - startTime)
										+ " milisec");
							}
						}));
						return $tiles;
					},
					config : {
						maxFontPixels : 80,
						minFontPixels : 12
					}
				},

				/**
				 * Sets backgroundColor for tiles
				 * 
				 * @property defaults.layerOptions.tileFilters.backgroundColor
				 * @type Object
				 */
				backgroundColor : {
					fn : function($tiles, config) {
						var colorizeFn = function(res, $tile) {
							var color, rdfsColor;
							$.each(res, function(i, val) {
								var currentUri = val.type.value;
								if (currentUri.indexOf(namespaces.rdfs) !== -1
										|| currentUri.indexOf(namespaces.owl) !== -1) {
									if (!color) {
										if (rdfsColor) {
											var scale = chroma.scale(
													[ rdfsColor.hex(), "#" + md5(currentUri).substring(0, 6) ])
													.mode('lab');
											rdfsColor = chroma(scale(0.5).hex());
										} else {
											rdfsColor = chroma("#" + md5(currentUri).substring(0, 6));
										}
									}
								} else {
									if (color) {
										var scale = chroma
												.scale([ color.hex(), "#" + md5(currentUri).substring(0, 6) ])
												.mode('lab');
										color = chroma(scale(0.5).hex());
									} else {
										color = chroma("#" + md5(currentUri).substring(0, 6));
									}
								}
							});
							if (color) {
								// TODO
								// Dirty brightness fix;
								if (color._rgb[0] > 200 && color._rgb[1] > 200 && color._rgb[2] > 200) {
									color._rgb[0] = color._rgb[0] - 50;
									color._rgb[1] = color._rgb[1] - 50;
									color._rgb[2] = color._rgb[2] - 50;
								}
								$tile.css("background-color", color);
							} else if (rdfsColor) {
								// TODO
								// Dirty brightness fix;
								if (rdfsColor._rgb[0] > 200 && rdfsColor._rgb[1] > 200 && rdfsColor._rgb[2] > 200) {
									rdfsColor._rgb[0] = rdfsColor._rgb[0] - 50;
									rdfsColor._rgb[1] = rdfsColor._rgb[1] - 50;
									rdfsColor._rgb[2] = rdfsColor._rgb[2] - 50;
								}
								$tile.css("background-color", rdfsColor);
							}
						};
						var counter = 0;
						var cbTiles = [];
						var batches = [];
						var queryStart = "SELECT DISTINCT ?res ?type WHERE { VALUES ?res {"
						var remoteQuery = "SELECT DISTINCT ?res ?type WHERE { VALUES ?res {"
						batches.push({
							count : 0,
							cbTiles : [],
							query : queryStart
						});
						$.each($tiles, function(i, tile) {
							var $tile = $(tile);
							var node = $tile.data("node");
							if (node.getType() === CONS.NODE_TYPES.resNode || node.getType() === "multiResNode") {
								var uri = node.getFComponentOT('uri').data;
								var bLeng = batches.length - 1;
								if (batches[bLeng].count < config.batchSize) {
									batches[bLeng].count++;
									batches[bLeng].cbTiles.push($tile);
									batches[bLeng].query += "<" + uri + ">";
								} else {
									// finish query
									batches[bLeng].query += "} ?res a ?type}";
									bLeng++;
									batches.push({
										count : 1,
										cbTiles : [],
										query : queryStart
									});
									batches[bLeng].cbTiles.push($tile);
									batches[bLeng].query += "<" + uri + ">";
								}
							} else {
								counter++;
								var colorArray, color;
								if (node.style && node.style.bgColors) {
									colorArray = node.style.bgColors;
									color = new RGBColor(colorArray[counter % colorArray.length]);
								} else if (config.defaultStyles[node.getType()]) {
									colorArray = config.defaultStyles[node.getType()].bgColors;
									color = new RGBColor(colorArray[counter % colorArray.length]);
								}
								if (color) {
									$tile.css("background-color", "rgba(" + color.r + ", " + color.g + ", " + color.b
											+ " ,1)");
								}
							}
						});

						// finish last query
						batches[batches.length - 1].query += "} ?res a ?type}";

						// For each batch
						if (batches[0].count > 0) {
							$.each(batches, function(i, batch) {
								remoteDataLoader.insertTypesByQuery(batch.query);
								remoteDataLoader.loadingDone.attach(new Plugin.Listener(function(e, query) {
									if (query == batch.query) {
										remoteDataLoader.loadingDone.dettach(this);
										$.each(batch.cbTiles, function(j, tile) {
											var $tile = $(tile);
											var node = $tile.data("node");
											var uri = node.getFComponentOT('uri').data;
											var localQuery = replaceDummy(queryStore.typeQuery, uri);
											rdfStore.executeQuery(localQuery, function(res) {
												colorizeFn(res, $tile);
											});
										});
									}
								}));
							});
						}
						return $tiles;
					},
					config : {
						batchSize : 100,
						defaultStyles : {
							literal : {
								/**
								 * Color of literal items.
								 * 
								 * @property defaults.layerOptions.tileFilters.backgroundColor.config.defaultStyles.literal.bgColors
								 * @type Array
								 * @default [ '#777777' ]
								 */
								bgColors : [ '#555555' ]
							},
							blankNode : {
								bgColors : [ '#999999' ]
							}
						// ,
						// stdNode : {
						// /**
						// * Colors of items.
						// *
						// * @property
						// defaults.layerOptions.tileFilters.backgroundColor.config.defaultStyles.stdNode.bgColors
						// * @type Array
						// * @default [ '#e2674a', '#99CC99', '#3399CC',
						// * '#33CCCC', '#996699', '#C24747', '#FFCC66',
						// * '#669999', '#CC6699', '#339966', '#666699' ]
						// */
						// bgColors : [ '#e2674a', '#99CC99', '#3399CC', '#33CCCC',
						// '#996699',
						// '#C24747',
						// '#FFCC66', '#669999', '#CC6699', '#339966', '#666699' ]
						// }
						}
					}
				},

				/**
				 * Loads background images
				 * 
				 * @property defaults.layerOptions.tileFilters.backgroundImg
				 * @type Object
				 */
				backgroundImg : {
					fn : function($tiles, config) {
						// TODO image path?
						return $tiles;
						$.each($tiles, function(i, tile) {
							var $tile = $(tile);
							var node = $tile.data("node"), image_url = "";
							switch (node.getType()) {
							case CONS.NODE_TYPES.resNode:
								image_url = node.getFComponentOT("uri").data;
								break;

							case CONS.NODE_TYPES.literal:
								image_url = node.getFComponentOT("label").data.value;
								break;
							}
							var tmpArray = image_url.replace(">", "").split(".");
							image_url.replace("<", "");
							switch (tmpArray[tmpArray.length - 1]) {
							case "png":
							case "jpeg":
							case "svg":
							case "jpg":

								if (image_url) {
									var $img = $('<img src="en.wikipedia.org/wiki/File:' + image_url + '">');
									$img.load(function() {
										var width = $img.width();
										var height = $img.height();
										var ratio = width / height;
										var tile_width = $tile.width();
										var tile_height = $tile.height();
										var tile_ration = tile_width / tile_height;
										var actual_width = 0;

										if (tile_ration > ratio) {
											actual_width = tile_width / ratio;
											$img.width(tile_width / ratio);
											$img.height(tile_height);
										} else {
											$img.width(actual_width);
											$img.height(tile_width * ratio);
										}
										$img.css({
											"left" : (tile_width - actual_width) / 2,
											"opacity" : config.opacity,
											"position" : "absolute"
										});
									});
									$tile.prepend($img);
								}
								break;
							}
						});
						return $tiles;
					},
					config : {
						opacity : 0.5
					}
				},

				/**
				 * Enables mouseover for URIs
				 * 
				 * @property defaults.layerOptions.tileFilters.predicateLabel
				 * @type Object
				 */
				predicateLabel : {
					fn : function($tiles) {
						$.each($tiles, function(i, tile) {
							var $tile = $(tile);
							var $predicate = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.predicate));
							var $typeImage = $tile.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.typeImage));
							var $predicateLabel = $tile.find(UTIL
									.toSelector(CONS.CSS_CLASSES.tileClasses.predicateLabel));

							// Show full URI on mouse right
							// click / prevent default
							// contextmenu
							$tile.get()[0].addEventListener('contextmenu', function(ev) {
								ev.preventDefault();
								if ($predicate.css("visibility") !== "visible") {
									$predicate.css("visibility", "visible");
									$typeImage.css("visibility", "hidden");
									$predicateLabel.css("visibility", "hidden");

								} else {
									$predicate.css("visibility", "hidden");
									$typeImage.css("visibility", "visible");
									$predicateLabel.css("visibility", "visible");
								}
								return false;
							}, false);
						});
						return $tiles;
					}
				},

				/**
				 * Initializes the browsability of tiles
				 * 
				 * @property defaults.layerOptions.tileFilters.browsablity
				 * @type Object
				 */
				browsablity : {
					fn : function($tiles, config, layer) {
						$.each($tiles, function(i, tile) {
							var $tile = $(tile);
							var node = $tile.data("node");
							var nodeType = node.getType();
							var layerGenFn;
							var layerOptionsFn;
							var onInitFn;
							if (node.browsablity) {
								if (node.browsablity.layerGenFn) {
									layerGenFn = node.browsablity.layerGenFn;
								}
								if (node.browsablity.layerOptionsFn) {
									layerOptionsFn = node.browsablity.layerOptionsFn;
								}
								if (node.browsablity.onInitFn) {
									layerOptionsFn = node.browsablity.onInitFn;
								}
							} else if (nodeType in config.types) {
								if (config.types[nodeType].layerGenFn) {
									layerGenFn = config.types[nodeType].layerGenFn;
								}
								if (config.types[nodeType].layerOptionsFn) {
									layerOptionsFn = config.types[nodeType].layerOptionsFn;
								}
								if (config.types[nodeType].onInitFn) {
									layerOptionsFn = config.types[nodeType].onInitFn;
								}
							}
							if (!layerGenFn) {
								layerGenFn = config.defaultFns.layerGenFn;
							}
							if (!layerOptionsFn) {
								layerOptionsFn = config.defaultFns.layerOptionsFn;
							}
							if (!onInitFn) {
								onInitFn = config.defaultFns.onInitFn;
							}
							$tile.click(
							// Save fns in function
							function() {
								return function() {
									$tile.data('isExpanded', true);
									var newLayer = layerGenFn(node, $tile, layer.$parent,
											layerOptionsFn(layer.options));
									if (newLayer) {
										newLayer.initSwitch.attach(new Plugin.Listener(function() {
											return function(sender) {
												onInitFn(sender, layer);
											}
										}(onInitFn, layer)));
									}
								}(layerGenFn, layerOptionsFn, onInitFn, layer);
							});
						});
						return $tiles;
					},
					config : {
						types : {
							blankNode : {
								layerGenFn : function(node, $tile, $parent, newLayerOptions) {
									// TODO
								}
							},
							stdNode : {
								layerGenFn : function(node, $tile, $parent, newLayerOptions) {
									return new Plugin.Layers.Res($parent, newLayerOptions, $tile);
								}
							},
							literal : {
								layerGenFn : function(node, $tile, $parent, newLayerOptions) {
									return new Plugin.Layers.Literal($parent, newLayerOptions, $tile);
								}
							}
						},
						defaultFns : {
							layerOptionsFn : function(options) {
								return $.extend(true, {}, options, {
									viewOptions : {
										filterBy : [ {
											value : "*",
											label : "showAll"
										}, {
											value : CONS.CSS_CLASSES.typeClasses.incoming,
											label : "in"
										}, {
											value : CONS.CSS_CLASSES.typeClasses.outgoing,
											label : "out"
										} ]
									}
								});
							},
							layerGenFn : function(node, $tile, $parent, newLayerOptions) {
								return new Plugin.Layers.Res($parent, newLayerOptions, $tile);
							},
							onInitFn : function(sender, layer) {
								layer.closeEvent.attach(new Plugin.Listener(function(sender) {
									sender.filterEvent.notify({
										"action" : "removeLayer"
									});
								}));
								layer.filterEvent.notify({
									"action" : "addLayer",
									"args" : sender
								});
							}
						}
					}
				},
				weight : {
					fn : function($tiles, config) {
						$.each($tiles, function(i, tile) {
							var $tile = $(tile);
							var node = $tile.data("node");
							node.weight = 0;
							$.each(config, function(ruleName, rule) {
								node.weight = rule.fn(node, rule.data);
							});
							$tile.data("node", node);
						});
						return $tiles;
					},
					config : {
						uriRule : {
							fn : function(node, data) {
								var uri = node.getFComponentOT("uri").data;
								var weight = node.weight;
								if (uri) {
									$.each(data, function(str, value) {
										if (uri.indexOf(str) !== -1) {
											weight += value * Math.random();
										}
									});
								}
								return weight;
							},
							data : {
								'http://www.w3.org/2000/01/rdf-schema#' : -1,
								'http://www.w3.org/2002/07/owl#' : -1
							}
						},
						predicateRule : {
							fn : function(node, data) {
								var weight = node.weight;
								node.forEachComponentType("predicate", function() {
									weight += data.val * Math.random();
								});
								return weight;
							},
							data : {
								val : 0.5
							}
						},
						templateRule : {
							fn : function(node, data) {
								var tempalteID = node.useTemplateID;
								var weight = node.weight;
								if (tempalteID) {
									$.each(data, function(str, value) {
										if (tempalteID === str) {
											weight += value * (Math.random() + 0.1);
										}
									});
								}
								return weight;
							},
							data : {
								'maps' : 2,
								'cityChart' : 1
							}
						}

					}
				}
			},
			/**
			 * Flag to indicate whether the sort interface should be generated.
			 * 
			 * @property defaults.layerOptions.generateSortOptions
			 * @type Boolean
			 * @default true
			 */
			generateSortOptions : true,
			/**
			 * Flag to indicate whether previews should be used.
			 * 
			 * @property defaults.layerOptions.generateSortOptions
			 * @type Boolean
			 * @default true
			 */
			usePreviews : false,
			/**
			 * Flag to indicate which kind of previews should be used. Possible
			 * options are
			 * 
			 * @property defaults.layerOptions.previewAsOverlay
			 * @type Boolean
			 * @default Overlay
			 */
			previewAsOverlay : true,
			/**
			 * Flag to indicate whether the filter interface should be generated.
			 * 
			 * @property defaults.layerOptions.generateFilterOptions
			 * @type Boolean
			 * @default true
			 */
			generateFilterOptions : true,

			/**
			 * Options for the model holding node results.
			 * 
			 * @property defaults.layerOptions.modelOptions
			 * @type Object
			 */
			modelOptions : {
				/**
				 * Batch size of items which can be loaded simultaniosly in the
				 * view. Filters only work on single batches. The batchSize should
				 * be chosen big enough if Nodefilters are to be used.
				 * 
				 * @property defaults.layerOptions.modelOptions.batchSize
				 * @type Integer
				 * @default 2000
				 */
				batchSize : 2000

			},
			/**
			 * Options for remote loading of data.
			 * 
			 * @property defaults.layerOptions.remoteOptions
			 * @type Object
			 */
			remoteOptions : {
				/**
				 * Default remote load query. Used on insertRemoteData() if no query
				 * parameter is given.
				 * 
				 * @property defaults.layerOptions.remoteOptions.defaultInitRemoteQuery
				 * @type String
				 * @default "SELECT ?subject ?predicate ?object { VALUES ?subject {
				 *          <http://dbpedia.org/resource/Berlin>
				 *          <http://dbpedia.org/resource/Passau>
				 *          <http://dbpedia.org/resource/Munich>
				 *          <http://dbpedia.org/resource/Frankfurt> } VALUES
				 *          ?predicate { rdfs:label } ?subject ?predicate ?object.
				 *          FILTER (lang(?object) = 'en') } LIMIT 150"
				 */
				defaultInitRemoteQuery : "SELECT ?subject ?predicate ?object { VALUES ?subject { <http://dbpedia.org/resource/Berlin> <http://dbpedia.org/resource/Passau> <http://dbpedia.org/resource/Munich> <http://dbpedia.org/resource/Frankfurt> } VALUES ?predicate { rdfs:label } ?subject ?predicate ?object. FILTER (lang(?object) = 'en') } LIMIT 150",
				/**
				 * Backend services to query on remote loading.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteBackends
				 * @type Array
				 * @default ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql"]
				 */
				remoteBackends : [ "http://dbpedia.org/sparql" ],

				/**
				 * Limit for items loaded by a single remote load.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteLimit
				 * @type Integer } *
				 * @default 1000
				 */
				remoteLimit : 1000,
				/**
				 * Flag to indicate whether automatic remote load on detail view
				 * should be done.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteDynamically
				 * @type Boolean
				 * @default true
				 */
				remoteDynamically : true,
				waitForRemote : false,
				/**
				 * Remote backends to query for predicate label information.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteLabelBackend
				 * @type Array
				 * @default ["http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql","http://dbpedia.org/sparql"]
				 */
				remoteLabelBackend : [ "http://zaire.dimis.fim.uni-passau.de:8080/bigdata/sparql",
						"http://dbpedia.org/sparql" ],
				/**
				 * Flag to indicate whether remote label information should be
				 * loaded if needed.
				 * 
				 * @property defaults.layerOptions.remoteOptions.remoteLabels
				 * @type Boolean
				 * @default true
				 */
				remoteLabels : true
			},
			/**
			 * Options for the bSynopsis views.
			 * 
			 * @property defaults.layerOptions.viewOptions
			 * @type Object
			 */
			viewOptions : {
				sortFns : {
					weight : function(elem) {
						var $elem = $(elem);
						var node = $elem.data("node");
						var weight = node.weight;
						if (!isUndefinedOrNull(weight)) {
							return -1 * weight;
						} else {
							return 0;
						}
					},
					alphabetical : function(elem) {
						var $elem = $(elem);
						var label = $elem.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.label)), itemText = label.length ? label
								: $elem;
						return itemText.text();
					}
				},

				/**
				 * Default filter to be added to the filter interface.
				 * 
				 * @property defaults.layerOptions.viewOptions.filterBy
				 * @type Object
				 * @default [ { value : "*", label : "showAll" } ]
				 */
				filterBy : [ {
					value : "*",
					label : "showAll"
				} ],

				/**
				 * Options for the layoutEngine. Uses isotope
				 * http://isotope.metafizzy.co/ options structure.
				 * 
				 * @property defaults.layerOptions.viewOptions.layoutEngineOptions
				 * @type Object
				 */
				layoutEngineOptions : {
					/**
					 * Flag to indicate whether the filter should use regular
					 * expressions if the chosen layout supports it.
					 * 
					 * @property defaults.layerOptions.viewOptions.layoutEngineOptions.supportRegExpFilter
					 * @type Boolean
					 * @default true
					 */
					supportRegExpFilter : true,
					useEngine : "isotope",
					clusterSize : 10,
					clusterWait : 10
					,
					shuffle : {
						filterFns : {
							"contains" : function($el, shuffle) {
								// Only search elements in the current group
								if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
									return false;
								}
								var text = $.trim($el.text()).toLowerCase();
								return text.indexOf(selector) !== -1;
							},
							"class" : function($el, shuffle) {
								return $el.hasClass(selector);
							}
						},
						options : {
							itemSelector : UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.tile),
							columnWidth : 1,
							sequentialFadeDelay : 0,
							supported : false
						}
					}
					,
					isotope : {
						options : {
							itemSelector : UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.tile),
							transitionDuration : 0,
							layoutMode : 'packery',
							sortBy : 'weight',
							getSortData : {
								weight : function(elem) {
									var $elem = $(elem);
									var node = $elem.data("node");
									var weight = node.weight;
									if (!isUndefinedOrNull(weight)) {
										return -1 * weight;
									} else {
										return 0;
									}
								},
								alphabetical : function(elem) {
									var $elem = $(elem);
									var label = $elem.find(UTIL.toSelector(CONS.CSS_CLASSES.tileClasses.label)), itemText = label.length ? label
											: $elem;
									return itemText.html();
								}
							}
						}
					}
				}
			}
		}
	};

	function Plugin(obj, options) {
		// <---- private utility functions ---->
		/**
		 * Uses $.proxy() to overwrite the context of a given function with the
		 * widget context.
		 * 
		 * @private
		 * @method _selfProxy
		 * @param {Function}
		 *           fn Function to modifie
		 * @return function with modified context
		 */
		this._selfProxy = function(fn) {
			return $.proxy(fn, this);
		};
		// <!--- instance private utility functions ---->

		this.pluginID = generateId();

		this._extendedLayers = {};
		this._topLayer;

		this._$parent = $(obj);
		this.$body = $('BODY');

		eventManagers[this.pluginID] = new Plugin.EventManager(this._$parent);

		// Give parentobj of the plugin a correspondending plugin class
		this._$parent.addClass(pluginName + "_" + this.pluginID);
		this._$parent.addClass(pluginName);

		// Use $.extend to merge the given plugin options with the defaults
		this.options = $.extend(true, {}, defaults, options);
		this._defaults = defaults;

		this._name = pluginName;

		this._expandedOverlaysCount = 0;

		this.init();
	}

	Plugin.prototype = {
		// <---- private functions ---->

		/**
		 * Initializes the rdf store
		 * 
		 * @private
		 * @method _initRdfStore
		 */
		_initRdfStore : function() {
			var that = this, rdfStoreInitDfd = $.Deferred();
			print("Init RDFSTORE");
			if (isUndefinedOrNull(rdfStore)) {
				rdfStore = new Plugin.RdfStore(that.options.rdfstoreOptions, function(store) {
					rdfStoreInitDfd.resolve();
				});
			}
			return rdfStoreInitDfd.promise();
		},
		/**
		 * Initializes the remote data loader
		 * 
		 * @private
		 * @method ;
		 */
		_initRemoteDataLoader : function() {
			var that = this;
			if (isUndefinedOrNull(remoteDataLoader)) {
				remoteDataLoader = new Plugin.RemoteDataLoader(
						this.options.layerOptions.remoteOptions.remoteBackends);
			} else {
				$.each(this.options.layerOptions.remoteOptions.remoteBackends, function(i, val) {
					remoteDataLoader.addBackend(val);
				});
			}
			// TODO update on datainsertion
			// remoteDataLoader.loadingDone.attach(new Plugin.Listener(function() {
			// that.updateTopLayer();
			// }));
		},
		/**
		 * Initializes the templating
		 * 
		 * @private
		 * @method _initTemplating
		 */
		_initTemplating : function() {
			var that = this, templateInitDfd = $.Deferred();

			// Helper to get first component of given type
			Handlebars.registerHelper('toClass', function(str) {
				return UTIL.toClass(str);
			});

			// Helper to get first component of given type
			Handlebars.registerHelper('tScaleWrap', function(str) {
				str = Handlebars.Utils.escapeExpression(str);// escape
				return new Handlebars.SafeString("<span class='" + CONS.CSS_CLASSES.textScale
						+ "' style='position:static'>" + str + "</span>");// mark
				// as
				// encoded
			});

			// Helper to get first component of given type
			Handlebars.registerHelper('firstComp', function(context, type, options) {
				var out = '';
				if (context.hasComponentType(type)) {
					out += options.fn(context.components[type][0]);
				}
				return out;
			});

			// Helper to get first component of given type
			Handlebars.registerHelper('hasCompType', function(context, type, options) {
				if (context.hasComponentType(type)) {
					return options.fn(this);
				}
			});

			// Helper to get each component of given type
			Handlebars.registerHelper('compsEach', function(context, type, options) {
				var out = '';
				context.forEachComponentType(type, function(component) {
					out += options.fn(component);
				});
				return out;
			});

			// Helper to iterate over keys of given context
			Handlebars.registerHelper('keysEach', function(context, options) {
				var out = '';
				for ( var key in context) {
					out += options.fn(key);
				}
				return out;
			});

			// Helper to check if language of given context is undefined or "en"
			Handlebars.registerHelper('ifLang', function(context, options) {
				if (context && (context.lang === undefined || context.lang === "en")) {
					return options.fn(this);
				}
			});

			Handlebars.registerHelper('predicateLabelRetriver', function(ctx, options) {
				if (ctx && !ctx.label) {
					var uriArray = ctx.value.split("#");
					if (uriArray.length === 1) {
						uriArray = uriArray[0].split("/");
					}
					ctx.label = uriArray[uriArray.length - 1];
				}
				return options.fn(this);
			});

			var loader = new Plugin.TemplatesLoader(templateInitDfd);
			loader.getPrecompiledTemplates();
			return templateInitDfd.promise();
		},
		/**
		 * Generate the queries of the Plugin
		 * 
		 * @private
		 * @method _generateQueries
		 */
		_generateQueries : function() {
			var that = this;

			// Generate SPARQL queries
			queryStore = {
				defaultInitRemoteQuery : this.options.layerOptions.remoteOptions.defaultInitRemoteQuery,
				remoteResByLabel : "SELECT DISTINCT ?subject ?predicate ?object WHERE { VALUES ?predicate {rdfs:label} VALUES ?object {'"
						+ CONS.DUMMY + "'@" + that.options.language + "} ?subject ?predicate ?object}",
				remoteResByUri : "SELECT DISTINCT ?subject ?predicate ?object WHERE { VALUES ?subject {<" + CONS.DUMMY + ">} VALUES ?predicate { rdfs:label } ?subject ?predicate ?object. FILTER(LANG(?object) = '' || LANGMATCHES(LANG(?object), '"
						+ that.options.language
						+ "'))}",
				remoteSubjectOf : " SELECT DISTINCT ?subject ?predicate ?object ?labelObj ?labelPred WHERE { VALUES ?subject {<"
						+ CONS.DUMMY
						+ ">} ?subject ?predicate ?object. OPTIONAL { ?object rdfs:label ?labelObj }. OPTIONAL { ?predicate rdfs:label ?labelPred }. FILTER(isIRI(?object)  || (LANG(?object) = '' || LANGMATCHES(LANG(?object), '"
						+ that.options.language
						+ "'))). FILTER(LANG(?labelPred) = '' || LANGMATCHES(LANG(?labelPred), '"
						+ that.options.language
						+ "')). FILTER(LANG(?labelObj) = '' || LANGMATCHES(LANG(?labelObj), '"
						+ that.options.language + "'))}",
				remoteObjectOf : " SELECT DISTINCT ?subject ?predicate ?object ?labelSub ?labelPred WHERE {VALUES ?object {<"
						+ CONS.DUMMY
						+ ">} ?subject ?predicate ?object. OPTIONAL { ?subject rdfs:label ?labelSub }. OPTIONAL { ?predicate rdfs:label ?labelPred }. FILTER(isIRI(?subject)  || (LANG(?subject) = '' || LANGMATCHES(LANG(?subject), '"
						+ that.options.language
						+ "'))). FILTER(LANG(?labelPred) = '' || LANGMATCHES(LANG(?labelPred), '"
						+ that.options.language
						+ "')). FILTER(LANG(?labelSub) = '' || LANGMATCHES(LANG(?labelSub), '"
						+ that.options.language + "'))}",
				remoteLiteralIsObjectOf : " SELECT DISTINCT ?subject ?predicate ?object ?labelSub ?labelPred WHERE {VALUES ?object {'"
						+ CONS.DUMMY
						+ "'} ?subject ?predicate ?object. OPTIONAL { ?subject rdfs:label ?labelSub }. OPTIONAL { ?predicate rdfs:label ?labelPred }}",
				selectSubjectOf : " SELECT DISTINCT ?subject ?predicate ?label ?description WHERE {<"
						+ CONS.DUMMY
						+ "> ?predicate ?subject. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
				selectObjectOf : " SELECT DISTINCT ?subject ?predicate ?label ?description WHERE {?subject ?predicate <"
						+ CONS.DUMMY
						+ ">. OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
				typeQuery : "SELECT DISTINCT ?type WHERE {<" + CONS.DUMMY + "> a ?type} ORDER BY ?type",
				getLabelOf : "SELECT DISTINCT ?label WHERE { <" + CONS.DUMMY + "> rdfs:label ?label } LIMIT 1",
				labelIsObjectOf : "SELECT DISTINCT ?subject ?label WHERE { ?subject rdfs:label ?label. FILTER (STR(?label)='"
					+ CONS.DUMMY
					+ "')}",
				literalIsObjectOf : "SELECT DISTINCT ?subject ?predicate ?type ?label ?description WHERE {?subject ?predicate ?oLiteral. FILTER (STR(?oLiteral)='"
						+ CONS.DUMMY
						+ "'). OPTIONAL { ?subject rdfs:label ?label}. OPTIONAL { ?subject rdfs:description ?description } . OPTIONAL { ?subject rdfs:comment ?description }}",
				previewQuery : " SELECT DISTINCT ?label ?description ?type WHERE { <" + CONS.DUMMY
						+ "> rdfs:label ?label . OPTIONAL { <" + CONS.DUMMY
						+ "> rdfs:description ?description } . OPTIONAL { <" + CONS.DUMMY
						+ "> rdfs:comment ?description } . OPTIONAL { <" + CONS.DUMMY + "> rdfs:type ?type}}",
				label : "SELECT DISTINCT ?label WHERE { <" + CONS.DUMMY
						+ "> rdfs:label ?label . FILTER(LANG(?label) = '' || LANGMATCHES(LANG(?label), '"
						+ that.options.language + "'))}",
				blankNodeQuery : "SELECT DISTINCT ?object WHERE {<" + CONS.DUMMY + "> ?predicate ?object}"
			};
		},
		/**
		 * Check whether the plugin is initialized with insertion options and call
		 * insertion methods if needed.
		 * 
		 * @private
		 * @method _checkInsertion
		 * @returns {Boolean} true if data was inserted, false if not
		 */
		_checkInsertion : function() {
			var that = this, inserted = false;
			if (!isUndefinedOrNull(that.options.dataFormat)) {
				if (!isUndefinedOrNull(that.options.dataLoc)) {
					inserted = true;
					that._ajaxLoadData(that.options.dataLoc, that.options.dataFormat,
							function(rdfData, dataFormat) {
								rdfStore.insertData(rdfData, dataFormat, function() {
									eventManagers[that.pluginID].trigger(CONS.EVENT_TYPES.store.insert, that);
								});
							});
				} else if (!isUndefinedOrNull(that.options.data)) {
					inserted = true;
					rdfStore.insertData(that.options.data, that.options.dataFormat, function() {
						eventManagers[that.pluginID].trigger(CONS.EVENT_TYPES.store.insert, that);
					});
				}
			}
			return inserted;
		},
		/**
		 * Loads file at dataURL and invokes callback with loaded data
		 * 
		 * @private
		 * @method _ajaxLoadData
		 * @param {String}
		 *           dataURL URL where the data is located
		 * @param {String}
		 *           dataFormat Format of the data
		 * @param {String}
		 *           callback Function to call after loading with results
		 * @return function with modified context
		 */
		_ajaxLoadData : function(dataURL, dataFormat, callback) {
			var that = this;
			eventManagers[that.pluginID].trigger(CONS.EVENT_TYPES.loading.start, that);

			// print("_ajaxLoadData");
			$.ajax({
				url : dataURL,
				dataType : "text",
				success : function(rdfData) {
					callback(rdfData, dataFormat);
				}
			}).fail(function() {
				eventManagers[that.pluginID].trigger(CONS.EVENT_TYPES.loading.done, that);
				alert(CONS.MESSAGES.error.ajax);
			});
		},
		// <!--- instance private functions ---->

		/**
		 * Init the plugin. Called by the constructor.
		 * 
		 * @method init
		 */
		init : function() {
			var that = this;

			// Generate SPARQL Queries
			that._generateQueries();
			that._initRemoteDataLoader();

			// Add insertion listener
			eventManagers[this.pluginID].addEventHandler(CONS.EVENT_TYPES.store.insert, function(ev) {
				// TODO update on insertion
				$.each(that._layers, function(key, layer) {
					// layer.update();
					print("view " + key + " has to be updated updating");
				});
			});

			// Add a smartresize listener (smartresize to be found in
			// jQuery.isotope)
			eventManagers[this.pluginID].addEventHandler('throttledresize', function(ev, $invoker) {

				// <---- overlay modification ---->
				var $overlays = that._$parent.children(UTIL.toSelector(CONS.CSS_CLASSES.overlay));
				$overlays.css('clip', getClip(CONS.CSS_CLASSES.overlay));
				var innerScrolls = $overlays.find(UTIL.toSelector(CONS.CSS_CLASSES.innerScroll));
				innerScrolls.css("width",
						($window.width() - parseInt($overlays.css("padding-left")) - parseInt($overlays
								.css("padding-right")))
								+ "px");
				innerScrolls.css("height", $window.height()
						- $overlays.find(UTIL.toSelector(CONS.CSS_CLASSES.innerNoScroll)).height() + "px");
				// <!--- overlay modification ---->
			}, $window);

			if (that.options.generateTimeline) {
				this.timeLine = new Plugin.TimeLine(this._$parent);
			}

			// Init templating and RdfStore if needed
			if (globalInitDfd.state() === "pending") {
				globalInitDfd = $.Deferred();
				$.when(that._initRdfStore(), that._initTemplating()).done(function() {

					// Load runtime templates
					var tmp_templates = {};
					$.each(that.options.layerOptions.nodeFilters, function(i, filter) {
						if (filter.template) {
							if (templates[i]) {
								console.log("Template with identifier " + i + " already defined");
							} else {
								tmp_templates[i] = Handlebars.compile(filter.template);
							}
						}
					});

					$.extend(true, templates, tmp_templates);
					globalInitDfd.resolve();
				});
			}

			// when done check if sort options have to be initialized and data
			// is to be inserted
			$.when(globalInitDfd.promise()).done(
					function() {

						// Init Layer
						that._layers = {};
						var args = [];
						args.push(that._$parent);
						args.push(that.options.layerOptions);
						// prepend parent and options to arg array
						args = args.concat(that.options.initLayer.args);
						// call constructor with apply args
						var layer = construct(Plugin.Layers[that.options.initLayer.name], args);
						that.addLayer(layer);
						that._topLayer = layer.id;
						that._layers[layer.id].initSwitch.attach(new Plugin.Listener(function(sender) {
							if(that.options.initLayer.hide) {
								that._$parent.find(UTIL.toSelector(CONS.CSS_CLASSES.outerContainer)).css({opacity : 0, visibility : "hidden"});
							}

							// Open detail on init
							if (that.options.openDetailOnInit != "") {
								layer.view.layoutEngine.doneEvent.once(new Plugin.Listener(function(sender) {
									setTimeout(function() {
										layer.view.layoutEngine._container.find(
												"div:contains(" + that.options.openDetailOnInit + ")").click();
									}, 200);
								}));
							}
							// Insert data
							if (!that._checkInsertion()) {
								if (that.options.sparqlData === undefined) {
									layer.update();
								} else {
									remoteDataLoader.insertByResultset(that.options.sparqlData, function() {
										layer.update();
									});
								}
							}
						}));
					});
		},
		/**
		 * Add given Layer object to the plugin
		 * 
		 * @method addLayer
		 * @param {Plugin.Layer}
		 *           layer Layer object to add to the plugin
		 */
		addLayer : function(layer) {
			var that = this;
			this._layers[layer.id] = layer;

			// Add listener for timeLine opening
			var listener = new Plugin.Listener(function(sender) {
				if (that.timeLine) {
					that.timeLine.addLayer(sender);
					sender.getTimeLineButton().on("click", function() {
						that.timeLine.open();
					});
				}
			});
			layer.initSwitch.attach(listener);
			layer.openEvent.attach(new Plugin.Listener(function(sender) {
				that._topLayer = sender.id;
				that._extendedLayers[sender.id] = sender.zIndex;
				that.$body.addClass('noscroll');
			}));
			layer.closeEvent.attach(new Plugin.Listener(function(sender) {
				delete that._extendedLayers[sender.id];
				if ($.isEmptyObject(that._extendedLayers)) {
					that.$body.removeClass('noscroll');
					var tmp = 0;
					$.each(that._extendedLayers, function(layerID, zIndex) {
						if (tmp < zIndex) {
							tmp = zIndex;
							that._topLayer = layerID;
						}
					});
				} else {
					delete that._topLayer;
				}
			}));
			layer.filterEvent.attach(new Plugin.Listener(function(sender, args) {
				switch (args.action) {
				case "addLayer":
					that.addLayer(args.args);
					break;
				case "removeLayer":
					that.removeLayer(sender);
					break;
				}
			}));
			layer.open();
		},

		/**
		 * Remove given Layer object from the plugin
		 * 
		 * @method removeLayer
		 * @param {Plugin.Layer}
		 *           view Layer object to remove from the plugin
		 */
		removeLayer : function(layer) {
			delete this._layers[layer.id];
		},

		/**
		 * Update all layers of the plugin
		 * 
		 * @method updateLayers
		 */
		updateTopLayer : function() {
			if (this._topLayer) {
				this._layers[this._topLayer].update();
			}
		},
		/**
		 * Insert given rdf-data in the store.
		 * 
		 * @method insertData
		 * @param {String}
		 *           data Rdf-data to be inserted
		 * @param {String}
		 *           dataFormat Format of the data
		 */
		insertData : function(data, dataFormat) {
			var that = this;
			$.when(globalInitDfd.promise()).done(function() {
				rdfStore.insertData(data, dataFormat, function() {
					eventManagers[that.pluginID].trigger(CONS.EVENT_TYPES.store.insert, that);
					that.updateTopLayer();
				});
			});
		},
		/**
		 * Insert rdf-data of given location in the store. Consider cross domain
		 * restrictions when using this method.
		 * 
		 * @method insertDataPath
		 * @param {String}
		 *           dataURL URL where rdf data is to be found
		 * @param {String}
		 *           dataFormat Format of the data
		 */
		insertDataPath : function(dataURL, dataFormat) {
			var that = this;
			$.when(globalInitDfd.promise()).done(function() {
				that._ajaxLoadData(dataURL, dataFormat, that._selfProxy(that.insertData));
			});
		},
		/**
		 * Insert rdf-data of given file in the store.
		 * 
		 * @method insertDataFile
		 * @param {File}
		 *           file File to parse
		 * @param {String}
		 *           dataFormat Format of the data
		 */
		insertDataFile : function(file) {
			var that = this, reader = new FileReader();
			reader.onload = function() {
				var result = this.result;
				var type = "text/turtle";
				if (file.type === "") {
					var extension = file.name.split(".").pop();
					switch (extension) {
					case "ttl":
						type = "text/turtle";
						break;
					case "turtle":
						type = "text/turtle";
						break;
					case "n3":
						type = "text/n3";
						break;
					case "json":
						type = "application/json";
						break;
					case "jsld":
						type = "application/ld+json";
						break;
					default:
						console.log(CONS.MESSAGES.warn.fileTypeNotKnown + type);
					}
				} else {
					type = file.type;
				}
				$.when(globalInitDfd.promise()).done(function() {
					that.insertData(result, type);
				});
			};
			reader.readAsText(file);
		},
		insertRemoteByUri : function(str) {
			$.when(globalInitDfd.promise()).done(function() {
				var query = replaceDummy(queryStore.remoteResByUri, str);
				remoteDataLoader.insertByQuery(query);
			});
		},
		openViewByUri : function(str) {
			var that = this;
			var fail = function() {
				alert("Didn't find an entry for " + str + ".");
			};
			var openLayer = function(data) {
				var node = new Plugin.Nodes.Res(data);
				var tile = node.generateTile();
				// TODO no layer given hack
				// TODO Backgroundcolor event?
				tile.css({ "background-color" : "#444444"});
				var tileWrapped = that.options.layerOptions.tileFilters.backgroundColor.fn({
					0 : tile
				}, that.options.layerOptions.tileFilters.backgroundColor.config, this._topLayer);
				remoteDataLoader.loadingDone.once(new Plugin.Listener(function() {
					var layer = new Plugin.Layers.Res(that._$parent, that.options.layerOptions, tileWrapped[0]);
					that.addLayer(layer);
				}));
			};
			var query = replaceDummy(queryStore.getLabelOf, str);
			rdfStore.executeQuery(
							query,
							function(results) {
								if (results && results.length > 0) {
									results[0].subject = {};
									results[0].subject.token = "uri";
									results[0].subject.value = str;
									openLayer(results[0]);
								} else {
									fail();
								}
							}, fail);
		},
		insertRemoteByLabel : function(str) {
			$.when(globalInitDfd.promise()).done(function() {
				var query = replaceDummy(queryStore.remoteResByLabel, str);
				remoteDataLoader.insertByQuery(query);
			});
		},
		openViewByLabel : function(str) {
			var that = this;
			var fail = function() {
				alert("Didn't find an entry for " + str + ".");
			};
			var openLayer = function(data) {
				var node = new Plugin.Nodes.Res(data);
				var tile = node.generateTile();
				// TODO no layer given hack
				// TODO Backgroundcolor event?
				tile.css({ "background-color" : "#444444"});
				var tileWrapped = that.options.layerOptions.tileFilters.backgroundColor.fn({
					0 : tile
				}, that.options.layerOptions.tileFilters.backgroundColor.config, this._topLayer);
				remoteDataLoader.loadingDone.once(new Plugin.Listener(function() {
					var layer = new Plugin.Layers.Res(that._$parent, that.options.layerOptions, tileWrapped[0]);
					that.addLayer(layer);
				}));
			};
			var query = replaceDummy(queryStore.labelIsObjectOf, str);
			rdfStore.executeQuery(
							query,
							function(results) {
								if (results && results.length > 0) {
									if (results.length === 1) {
										openLayer(results[0]);
									} else {
										var div = $("<div style='height: auto; width: auto; margin-right: auto; margin-left: auto; max-width: 500px; background-color: #111111'> What item should be viewed?<ul></ul></div>");
										var ul = div.find("ul");
										for (var i = 0; i < results.length; i++) {
											var data = results[i];
											var li = $("<li><a>" + data.subject.value + "</a></li>");
											li.click(function(data) {
												return function(e) {
													openLayer(data);
													$.magnificPopup.close();
												}
											}(data));
											ul.append(li);
										}
										$.magnificPopup.open({
											items : {
												src : div,
												type : 'inline'
											}
										});
									}
								} else {
									fail();
								}
							}, fail);
		},
		insertRemoteAndOpenViewByUri : function(str) {
			var that = this;
			that.insertRemoteByUri(str);
			remoteDataLoader.loadingDone.once(new Plugin.Listener(function() {
				that.openViewByUri(str);
			}));
		},
		insertRemoteAndOpenViewByLabel : function(str) {
			var that = this;
			that.insertRemoteByLabel(str);
			remoteDataLoader.loadingDone.once(new Plugin.Listener(function() {
				that.openViewByLabel(str);
			}));
		},
		/**
		 * Insert rdf-data of given url SPARQL service in the store. Use the given
		 * query. Is no query given use the default query.
		 * 
		 * @method insertRemoteDataQuery
		 * @param {String}
		 *           url URL of the SPARQL service
		 * @param {String}
		 *           query Query to fetch data
		 */
		insertRemoteDataQuery : function(url, query) {
			var that = this;
			$.when(globalInitDfd.promise()).done(function() {
				if (query === undefined || query === "") {
					query = queryStore.defaultInitRemoteQuery;
				}
				remoteDataLoader.insertByQuery(query, [ url ]);
				remoteDataLoader.loadingDone.once(new Plugin.Listener(function() {
					that.updateTopLayer();
				}));
			});
		},
		/**
		 * Clear the store and Layers.
		 * 
		 * @method clearStore
		 */
		clearStore : function() {
			var that = this;
			rdfStore.executeQuery("CLEAR ALL", function() {
				print("store cleared");
				$.each(that._layers, function(i, view) {
					view.removeAllItems();
				});
			});
		},
		/**
		 * Runs query on local store.
		 * 
		 * @method runQuery
		 * @param query
		 *           Query to run.
		 * @return results of query
		 */
		runQuery : function(query, callback) {
			rdfStore.executeQuery(query, function(results) {
				if (callback) {
					callback(results);
				}
			});
		},
		/**
		 * Clean up after plugin (destroy bindings, clear events..)
		 * 
		 * @method destroy
		 */
		destroy : function() {
			var that = this;
			eventManagers[that.pluginID].destory();
			eventManagers[that.pluginID] = undefined;
			that._$parent[pluginName] = null;
		}
	};

	// Lightweight plugin frame.
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);

// Copyright 2013 Thomas Weissgerber
//	
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//	
// http://www.apache.org/licenses/LICENSE-2.0
//	
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
;this["bSynopsis"] = this["bSynopsis"] || {};
this["bSynopsis"]["templates"] = this["bSynopsis"]["templates"] || {};

this["bSynopsis"]["templates"]["filterOptions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
  buffer += "\r\n            </ul>\r\n            <input id=\"filterField\" type=\"text\" size=\"25\" value=\"Enter search here.\">\r\n    </div>\r\n    <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionCombo)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            <ul class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.optionButton)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.clearfix)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                <li><a class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.refresh)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">Refresh</a></li>\r\n            </ul>\r\n    </div>";
  return buffer;
  });

this["bSynopsis"]["templates"]["groupDropDown"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["bSynopsis"]["templates"]["overlayContent"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n            <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.innerNoScroll)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n                <h2>\r\n                    ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.firstComp || depth0.firstComp),stack1 ? stack1.call(depth0, depth0.node, "label", options) : helperMissing.call(depth0, "firstComp", depth0.node, "label", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                    \r\n                </h2>\r\n                 ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.firstComp || depth0.firstComp),stack1 ? stack1.call(depth0, depth0.node, "uri", options) : helperMissing.call(depth0, "firstComp", depth0.node, "uri", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </div>\r\n            <div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.innerScroll)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            </div>\r\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program4(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.data) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.data; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

  buffer += "    ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.hasCompType || depth0.hasCompType),stack1 ? stack1.call(depth0, depth0.node, "label", options) : helperMissing.call(depth0, "hasCompType", depth0.node, "label", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["bSynopsis"]["templates"]["overlayWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "		      \r\n		<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.overlay)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n            <span class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.buttonTimeline)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">history</span>\r\n			<span class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.buttonClose)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">close</span>\r\n			<div class=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.overlayContent)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n			</div>\r\n		</div>";
  return buffer;
  });

this["bSynopsis"]["templates"]["previewItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["bSynopsis"]["templates"]["sortOptions"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["bSynopsis"]["templates"]["stdNode"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this, functionType="function";

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                    <div class=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.type, options) : helperMissing.call(depth0, "toClass", depth0.type, options)))
    + " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.id, options) : helperMissing.call(depth0, "toClass", depth0.id, options)))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tScaleWrap || depth0.tScaleWrap),stack1 ? stack1.call(depth0, ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options) : helperMissing.call(depth0, "tScaleWrap", ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options)))
    + "</div>\r\n            ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifLang || depth0.ifLang),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "ifLang", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                        <div class=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.type, options) : helperMissing.call(depth0, "toClass", depth0.type, options)))
    + " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.id, options) : helperMissing.call(depth0, "toClass", depth0.id, options)))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tScaleWrap || depth0.tScaleWrap),stack1 ? stack1.call(depth0, ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options) : helperMissing.call(depth0, "tScaleWrap", ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options)))
    + "</div>\r\n                ";
  return buffer;
  }

function program6(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                    <div class=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, depth0.id, options) : helperMissing.call(depth0, "toClass", depth0.id, options)))
    + "\">\r\n                        <img class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth1.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.typeImage)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" src=\"img/"
    + escapeExpression(((stack1 = ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.type)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ".png\">\r\n                        <div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth1.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.predicate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"visibility:hidden; overflow-y:auto; word-wrap:break-word\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tScaleWrap || depth0.tScaleWrap),stack1 ? stack1.call(depth0, ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options) : helperMissing.call(depth0, "tScaleWrap", ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.value), options)))
    + "</div>\r\n                        ";
  options = {hash:{},inverse:self.noop,fn:self.programWithDepth(7, program7, data, depth1),data:data};
  stack2 = ((stack1 = helpers.predicateLabelRetriver || depth0.predicateLabelRetriver),stack1 ? stack1.call(depth0, depth0.data, options) : helperMissing.call(depth0, "predicateLabelRetriver", depth0.data, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                    </div>\r\n            ";
  return buffer;
  }
function program7(depth0,data,depth2) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n                            <div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth2.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.predicateLabel)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"overflow-y:auto; word-wrap:break-word\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tScaleWrap || depth0.tScaleWrap),stack1 ? stack1.call(depth0, ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.label), options) : helperMissing.call(depth0, "tScaleWrap", ((stack1 = depth0.data),stack1 == null || stack1 === false ? stack1 : stack1.label), options)))
    + "</div>\r\n                        ";
  return buffer;
  }

  buffer += "            ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.compsEach || depth0.compsEach),stack1 ? stack1.call(depth0, depth0.node, "label", options) : helperMissing.call(depth0, "compsEach", depth0.node, "label", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.compsEach || depth0.compsEach),stack1 ? stack1.call(depth0, depth0.node, "description", options) : helperMissing.call(depth0, "compsEach", depth0.node, "description", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            ";
  options = {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data};
  stack2 = ((stack1 = helpers.compsEach || depth0.compsEach),stack1 ? stack1.call(depth0, depth0.node, "predicate", options) : helperMissing.call(depth0, "compsEach", depth0.node, "predicate", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["bSynopsis"]["templates"]["tileWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  
  return escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  }

function program3(depth0,data) {
  
  var stack1, options;
  options = {hash:{},data:data};
  return escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.token), options) : helperMissing.call(depth0, "toClass", ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.token), options)));
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n			<h2 class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.showURI)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"display:none\">";
  if (stack2 = helpers.data) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.data; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
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
  buffer += " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.toClass || depth0.toClass),stack1 ? stack1.call(depth0, ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "toClass", ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.id), options)))
    + "\">\r\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.firstComp || depth0.firstComp),stack1 ? stack1.call(depth0, depth0.node, "uri", options) : helperMissing.call(depth0, "firstComp", depth0.node, "uri", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n		<p class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.CSS_CLASSES),stack1 == null || stack1 === false ? stack1 : stack1.tileClasses)),stack1 == null || stack1 === false ? stack1 : stack1.number)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"display:none\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.node),stack1 == null || stack1 === false ? stack1 : stack1.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n	</div>";
  return buffer;
  });

this["bSynopsis"]["templates"]["timelineItem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>\r\n    ";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n</li>";
  return buffer;
  });

this["bSynopsis"]["templates"]["timelineWrapper"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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