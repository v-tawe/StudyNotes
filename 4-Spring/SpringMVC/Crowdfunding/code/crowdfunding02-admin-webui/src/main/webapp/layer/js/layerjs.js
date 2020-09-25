// layerJS 0.6.4
// https://github.com/layerJS/layerJS
// contact us at developers@layerjs.org
// (c) 2017 - 2018
// this is open-source software. some restrictions apply.
// see https://github.com/layerJS/layerJS/blob/master/LICENSE
// branch: master
// commit: 096e17846510248af7d9c0bef063e3e3792d360f
// M package.json
// M src/framework/router/router.js


(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
var $ = require('./domhelpers.js');
var pluginManager = require('./pluginmanager.js');
var parseManager = require('./parsemanager.js');
var DOMObserver = require('./observer/domobserver.js');

/**
 * Base class for a view
 */
var BaseView = DOMObserver.extend({

  /**
   * Will initialise the view
   */
  constructor: function (options) {
    options = options || {};
    DOMObserver.call(this);

    this._cache = {}; // this will cache some properties. The cache can be deleted an the method will need to rebuild the data. Therefore don't query the _cache directly, but use the accessor functions.
    this.childType = options.childType;
    this._setDocument(options);

    // parent if defined
    this.parent = options.parent;
    this.innerEl = this.innerEl || options.el;
    // backlink from DOM to object
    if (this.innerEl._ljView) {
      throw "trying to initialialize view on element that already has a view";
    }
    this.innerEl._ljView = this;
    // possible wrapper element
    this.outerEl = this.outerEl || options.el || this.innerEl;
    this.outerEl._ljView = this;

    // if (!this.parent && this.outerEl._state && this.outerEl._state.view) {
    //   this.parent = this.outerEl._state.parent.view;
    // }
    //
    // var state = layerJS.getState(this.document);
    // state.registerView(this);

    this._parseChildren();
    this.registerEventHandlers();
    this.startObserving();
  },
  /* jshint ignore:start */
  /**
   *  Will start observing the current DOM Element. This is an abstract method and should be implemented
   *  by views who inherit from this class.
   */
  startObserving: function () {

  },
  /* jshint ignore:end */
  /**
   * Will add eventhandlers to specific events. By default is will call the _parseChildren when a
   * 'childrenChanged' event is triggered.
   */
  registerEventHandlers: function () {
    this.on('childrenChanged', function (result) {
      if ((result.addedNodes && result.addedNodes.length > 0) || (result.removedNodes && result.removedNodes.length > 0)) {
        this._parseChildren({
          addedNodes: result.addedNodes,
          removedNodes: result.removedNodes
        });
      }
    });
  },
  /**
   * Will parse the current DOM Element it's children.
   * Will trigger childAdded and/or childRemoved.
   * @param {object} options - optional: includes addedNodes, removedNodes
   */
  _parseChildren: function (options) {
    options = options || {};
    var that = this;
    this._cache.children = [];
    this._cache.childNames = {};
    this._cache.childIDs = {};

    // trigger remove nodes first. this is important for inter stage transitions
    if (options.removedNodes && options.removedNodes.length > 0) {
      options.removedNodes.forEach(function (removedNode) {
        if (removedNode._ljView) {
          that.trigger('childRemoved', removedNode._ljView);
        }
      });
    }
    var parsedNew = {}; // need to store newly parsed element to avoid double "childAdded" event
    if (this.childType) {
      for (var i = 0; i < this.innerEl.children.length; i++) {
        var child = this.innerEl.children[i];
        if (!child._ljView && $.getAttributeLJ(child, 'type') === this.childType) {
          pluginManager.createView(this.childType, {
            el: child,
            parent: this,
            document: this.document
          });
          this._renderChildPosition(child._ljView);
          this.trigger('childAdded', child._ljView);
          parsedNew[child._ljView.id()] = 1;
        }
        if (child._ljView && child._ljView.type() === this.childType) {
          var cv = child._ljView;
          this._cache.children.push(cv);
          this._cache.childNames[cv.name()] = cv;
          this._cache.childIDs[cv.id()] = cv;
        }
      }
    }
    var parsed = false;
    if (options.addedNodes && options.addedNodes.length > 0) {
      var length = options.addedNodes.length;
      for (var x = 0; x < length; x++) {
        // check if added nodes don't already have a view defined.
        if (options.addedNodes[x].parentElement !== this.innerEl) continue;
        if (!options.addedNodes[x]._ljView) {
          if (!parsed) { // we only need to parse once as we start parsing at the parent
            parseManager.parseElement(options.addedNodes[x].parentNode, {
              parent: this
            });
            parsed = true;
          }
        } else if (options.addedNodes[x]._ljView.parent !== this) {
          // check if added node has the same parent
          options.addedNodes[x]._ljView.parent = this;
        }
        if (options.addedNodes[x]._ljView && !parsedNew[options.addedNodes[x]._ljView.id()]) {
          this.trigger('childAdded', options.addedNodes[x]._ljView);
        }
      }
    }
  },
  /**
   * Will return a childview by a specific name
   *
   * @param {String} name - the name of the child view to get
   * @returns {Object} a child view
   */
  getChildViewByName: function (name) {
    if (!this._cache.childNames) this._parseChildren();
    return this._cache.childNames[name];
  },
  /**
   * Will return the child views of the view
   * @returns {Object} a hashed object with child views
   */
  getChildViews: function () {
    if (!this._cache.children) this._parseChildren();
    return this._cache.children;
  },
  /**
   * Will determin which document object should be associated with this view
   * @param {result} an object that contains what has been changed on the DOM element
   * @return {void}
   */
  _setDocument: function (options) {
    this.document = document;

    if (options) {
      if (options.document) {
        this.document = options.document;
      } else if (options.el) {
        this.document = options.el.ownerDocument;
      }
    }
  },
  /* jshint ignore:start */
  /**
   * Will place a child view at the correct position. This is an abstract method and should be implemented
   *  by views who inherit from this class.
   * @param {Object} childView - the childView
   */
  _renderChildPosition: function (childView) {

  },
  /* jshint ignore:end */
  /**
   * apply CSS styles to this view
   *
   * @param {Object} arguments - List of styles that should be applied
   * @returns {Type} Description
   */
  applyStyles: function () {
    var len = arguments.length;
    for (var j = 0; j < len; j++) {
      var props = Object.keys(arguments[j]); // this does not run through the prototype chain; also does not return special
      for (var i = 0; i < props.length; i++) {
        if ($.cssPrefix[props[i]]) this.outerEl.style[$.cssPrefix[props[i]]] = arguments[j][props[i]];
        // do standard property as well as newer browsers may not accept their own prefixes  (e.g. IE & edge)
        this.outerEl.style[props[i]] = arguments[j][props[i]];
      }
    }
  },
  /**
   * Will set an lj-* attribute on the outer element
   *
   * @param {String} name - the name of the attribute (without lj prefix)
   * @param {String} data - the value of the attribute
   */
  setAttributeLJ: function (name, data) {
    if ($.hasCssAttributeLJ(this.outerEl, name)) {
      $.setCssAttributeLJ(this.outerEl, name, data);
    } else {
      $.setAttributeLJ(this.outerEl, name, data);
    }
  },
  /**
   * Will get the value of an lj-* attribute on the outer element
   *
   * @param {String} name - the name of the attribute (without lj prefix)
   * @return {String} the value of the attribute
   */
  getAttributeLJ: function (name) {
    return $.getCssAttributeLJ(this.outerEl, name) || $.getAttributeLJ(this.outerEl, name);
  },
  /**
   * Will get the value of an attribute on the outer element
   *
   * @param {String} name - the name of the attribute
   * @return {String} the value of the attribute
   */
  getAttribute: function (name) {
    return this.outerEl.getAttribute(name);
  },
  /**
   * Will return the id of the view. Will use the value of the lj-id or id or an unique generated id.
   *
   * @return {String} the id of the view
   */
  id: function () {
    if (!this._id) {
      this._id = this.getAttributeLJ('id') || this.outerEl.id || $.uniqueID(this.type(), this.document);
    }
    return this._id;
  },
  /**
   * Will return the name of the view. Will use the value of lj-name or the id method.
   *
   * @return {String} the name of the view
   */
  name: function () {
    var name = this.getAttributeLJ('name') || this.id();
    if (name.match(/\./)) {
      if (this._name) return this._name;
      console.warn('unsuitable layerJS name "' + name + '" replaced by "' + (this._name = name = $.uniqueID(this.type(), this.document)) + '"');
    }
    if (this._name) this._name = name;
    return name;
  },
  /**
   * Will return the type of the view
   *
   * @return {String} the type of the view
   */
  type: function () {
    return this.getAttributeLJ('type');
  },
  /**
   * Will return the node type of the outer element
   *
   * @return {String} the node type of the outer element
   */
  nodeType: function () {
    return this.outerEl && this.outerEl.nodeType;
  },
  /**
   * Will return the width of the view
   *
   * @return {Number} the width of the view
   */
  width: function () {
    var width = this.getAttributeLJ('width') || this.getAttribute('width'); // prefer explicit width
    if (width !== null) {
      this.setWidth(width); // if we had an explicit width we need to apply this.
    } else {
      width = this.outerEl.offsetWidth || this.outerEl.style.width || 0; // else take width of element
    }
    return $.parseDimension(width, this.outerEl);
  },
  /**
   * Will return the height of the view (including the margins)
   *
   * @return {Number} the height of the view
   */
  height: function () {
    var height = this.getAttributeLJ('height') || this.getAttribute('height'); // prefer explicit height
    if (height !== null) {
      this.setHeight(height); // if we had an explicit height we need to apply this.
    } else {
      height = this.outerEl.offsetHeight || this.outerEl.style.height || 0; // else take height of element
    }
    return $.parseDimension(height, this.outerEl);
  },
  /**
   * Will set the width of the view (excluding the margins)
   *
   * @param {Number} width
   */
  setWidth: function (width) {
    width = $.parseDimension(width, this.outerEl);
    var margin = this.getMargin();
    var marginToSubtract = margin.left + margin.right;

    this.outerEl.style.width = width - marginToSubtract + 'px';
  },
  /**
   * Will set the width of the view (excluding the margins)
   *
   * @param {Number} height
   */
  setHeight: function (height) {
    height = $.parseDimension(height, this.outerEl);
    var margin = this.getMargin();
    var marginToSubtract = margin.top + margin.bottom;

    this.outerEl.style.height = height - marginToSubtract + 'px';
  },
  /**
   * Will return the x value of the view. This method will use
   *  the offsetLeft or style.left or the lj-x attribute of the outer element
   *
   * @return {Number} the x (left) of the outer element
   */
  x: function () {
    var x = this.getAttributeLJ('x');
    x = x || this.outerEl.offsetLeft || this.outerEl.style.left || 0;
    return $.parseDimension(x, this.outerEl);
  },
  /**
   * Will return the y value of the view. This method will use
   *  the offsetTop or style.top or the lj-y attribute of the outer element
   *
   * @return {Number} the y (top) of the outer element
   */
  y: function () {
    var y = this.getAttributeLJ('y');
    y = y || this.outerEl.offsetTop || this.outerEl.style.top || 0;
    return $.parseDimension(y);
  },
  /**
   * Will return the value of the lj-scale-x attribute on the outer element
   *
   * @return {string} the value of the lj-scale-x attribute
   */
  scaleX: function () {
    var scaleX = this.getAttributeLJ('scale') || this.getAttributeLJ('scale-x');

    return scaleX ? parseFloat(scaleX) : 1;
  },
  /**
   * Will return the value of the lj-scale-y attribute on the outer element
   *
   * @return {string} the value of the lj-scale-y attribute
   */
  scaleY: function () {
    var scaleY = this.getAttributeLJ('scale') || this.getAttributeLJ('scale-y');

    return scaleY ? parseFloat(scaleY) : 1;
  },
  /**
   * Will return the value of the lj-fit-to attribute on the outer element.
   * The default value is 'width'.
   *
   * @param {boolean} useFallBack (optional) when false, the fallback value will not be used
   * @return {string} the value of the lj-fit-to attribute
   */
  fitTo: function (useFallBack) {
    var fitTo = this.getAttributeLJ('fit-to');

    if (useFallBack !== false && !fitTo) {
      fitTo = 'width';
    }

    return fitTo;
  },
  /**
   * Will return the value of the lj-elastic-left attribute on the outer element
   *
   * @return {string} the value of the lj-elastic-left attribute
   */
  elasticLeft: function () {
    return this.getAttributeLJ('elastic-left');
  },
  /**
   * Will return the value of the lj-elastic-right attribute on the outer element
   *
   * @return {string} the value of the lj-elastic-right attribute
   */
  elasticRight: function () {
    return this.getAttributeLJ('elastic-right');
  },
  /**
   * Will return the value of the lj-elastic-top attribute on the outer element
   *
   * @return {string} the value of the lj-elastic-top attribute
   */
  elasticTop: function () {
    return this.getAttributeLJ('elastic-top');
  },
  /**
   * Will return the value of the lj-elastic-bottom attribute on the outer element
   *
   * @return {string} the value of the lj-elastic-bottom attribute
   */
  elasticBottom: function () {
    return this.getAttributeLJ('elastic-bottom');
  },
  /**
   * Will return the value of the lj-start-position attribute on the outer element.
   * The default value is 'toUpperCase'.
   *
   * @return {string} the value of the lj-start-position attribute
   */
  startPosition: function () {
    return this.getAttributeLJ('start-position') || 'top-left';
  },
  /**
   * Will return the value of the lj-no-scrolling attribute on the outer element.
   * The default value is false.
   *
   * @return {Boolean} the value of the lj-no-scrolling attribute
   */
  noScrolling: function () {
    var noScrolling = this.getAttributeLJ('no-scrolling');
    return noScrolling ? noScrolling === 'true' : false;
  },
  /**
   * Will return the value of the lj-rotation attribute on the outer element.
   *
   * @return {String} the value of the lj-rotation attribute
   */
  rotation: function () {
    return this.getAttributeLJ('rotation');
  },
  /**
   * Will return all the neighbors of a view
   *
   * @return {Object} object that returns the l,r,t,b neighbors of the view
   */
  neighbors: function () {
    var neighbors = {
      l: this.getAttributeLJ('neighbors-l') || this.getAttributeLJ('neighbors.l'),
      r: this.getAttributeLJ('neighbors-r') || this.getAttributeLJ('neighbors.r'),
      t: this.getAttributeLJ('neighbors-t') || this.getAttributeLJ('neighbors.t'),
      b: this.getAttributeLJ('neighbors-b') || this.getAttributeLJ('neighbors.b')
    };

    return neighbors;
  },
  /*layer*/
  /**
   * Will return the value of the lj-layout-type attribute on the outer element.
   * The default value is 'slide'.
   *
   * @return {string} the value of the lj-layout-type attribute
   */
  layoutType: function () {
    return this.getAttributeLJ('layout-type') || this.getAttributeLJ('layout') || 'slide';
  },
  /**
   * Will return the value of the lj-default-frame attribute on the outer element.
   *
   * @return {string} the value of the lj-default-frame attribute
   */
  defaultFrame: function () {
    return this.getAttributeLJ('default-frame');
  },
  /**
   * return the desired transition of a frame or layer of defined
   *
   * @returns {string} transition type
   */
  defaultTransition: function () {
    return this.getAttributeLJ('transition');
  },
  /**
   * Will return the value of the lj-native-scroll attribute on the outer element.
   * The default value is false.
   *
   * @return {Boolean} the value of the lj-native-scroll attribute
   */
  nativeScroll: function () {
    var nativeScroll = this.getAttributeLJ('native-scroll');
    return nativeScroll ? nativeScroll === 'true' : true;
  },
  /**
   * Will set the value of the lj-native-scroll attribute on the outer element.
   *
   * @param {Boolean} nativeScrolling - the value to set
   */
  setNativeScroll: function (nativeScroll) {
    this.setAttributeLJ('native-scroll', nativeScroll);
  },
  /**
   * Will return the margin for the outerEl
   *
   * @return {Object}
   */
  getMargin: function () {
    var computedStyle = this.getComputedStyle();

    return {
      top: $.parseDimension(computedStyle.getPropertyValue('margin-top') || '0'),
      bottom: $.parseDimension(computedStyle.getPropertyValue('margin-bottom') || '0'),
      right: $.parseDimension(computedStyle.getPropertyValue('margin-right') || '0'),
      left: $.parseDimension(computedStyle.getPropertyValue('margin-left') || '0'),
    };
  },
  /**
   * Will return if the layer should show it's frame in the url
   *
   * @return {Boolean} the value of the lj-no-url attribute
   */
  noUrl: function () {
    var noUrl = this.getAttributeLJ('no-url');

    return noUrl === 'true' ? true : false;
  },
  /**
   * returns the value for lj-timer which is used for auto trigger transitions.
   *
   * @param {Type} Name - Description
   * @returns {Type} Description
   */
  timer: function () {
    return this.getAttributeLJ('timer');
  },
  /**
   * returns the value for lj-auto-height
   *
   * @returns {string} A layername
   */
  autoHeight: function () {
    return this.getAttributeLJ('auto-height');
  },
  /**
   * returns the value for lj-auto-width
   *
   * @returns {string} A layername
   */
  autoWidth: function () {
    return this.getAttributeLJ('auto-width');
  },

  /** Will return if the layer allows dragging
   *
   * @return {Boolean} the value of the lj-draggable attribute
   */
  draggable: function () {
    var draggable = this.getAttributeLJ('draggable');
    return draggable === 'true' ? true : false;
  },
  /**
   * ##destroy
   * This element was requested to be deleted completly; before the delete happens
   * an event is triggerd on which this function id bound (in `initialialize`). It
   * will remove the DOM elements connected to this element.
   * @return {void}
   */
  destroy: function () {
    this.unobserve();
    this.outerEl.parentNode.removeChild(this.outerEl);
  },
  /**
  Save the style width  and computed width of the outer element
  */
  setOriginalWidth: function () {
    this.originalWidth = {
      width: '' === this.outerEl.style.width ? '' : this.outerEl.style.width,
      computedStyleWidth: $.parseDimension(this.getComputedStyle().getPropertyValue('width'), this.outerEl)
    };
  },
  /**
  Gets the original style width and computed width of the outer element
  @return {string}
  */
  getOriginalWidth: function () {
    return this.originalWidth;
  },
  /**
  Save the original style height and computed style height of the outer element
  */
  setOriginalHeight: function () {
    this.originalHeight = {
      height: '' === this.outerEl.style.height ? '' : this.outerEl.style.height,
      computedStyleHeight: $.parseDimension(this.getComputedStyle().getPropertyValue('height'), this.outerEl)
    };
  },
  /**
  Gets the original style height and computed style height of the outer element
  @return {string}
  */
  getOriginalHeight: function () {
    return this.originalHeight;
  },
  /**
  Gets the computedStyle off the outerEl
  @return {Object}
  */
  getComputedStyle: function () {
    return window.getComputedStyle(this.outerEl, null);
  },
  widthSet: function (set) {
    if (undefined !== set) {
      this.widthSetByLJ = set;
    }

    return this.widthSetByLJ;
  },
  heightSet: function (set) {
    if (undefined !== set) {
      this.heightSetByLJ = set;
    }

    return this.heightSetByLJ;
  }
});

module.exports = BaseView;
},{"./domhelpers.js":3,"./observer/domobserver.js":13,"./parsemanager.js":20,"./pluginmanager.js":21}],2:[function(require,module,exports){
module.exports = {
  version: 'default',
  defaultDuration: '1s',
  transitionParameters: {
    duration: 't',
    type: 'p',
    delay: 'd'
  },
  identifyPriority : {
    low: 1,
    normal: 2,
    high: 3
  },

  directions2neighbors : {
    up: 'b',
    down: 't',
    left: 'r',
    right: 'l'
  },

  neighbors2transition : {
    b: 'auto:up',
    t: 'auto:down',
    r: 'auto:left',
    l: 'auto:right'
    // b: 'slideOverUp',
    // t: 'slideOverDown',
    // r: 'slideOverLeft',
    // l: 'slideOverRight'
  },
  specialFrames: {
    none : '!none',
    left: '!left',
    right :'!right',
    top : '!top',
    bottom : '!bottom',
    next  :'!next',
    previous : '!prev',
    default : '!default',
    current: '!current',
    toggle: '!toggle'
  }
};

},{}],3:[function(require,module,exports){
'use strict';
var defaults = require('./defaults.js');
var TMat = require('./tmat.js');
var _debug = null;
var DomHelpers = {
  /**
   * wrap all children of element into a wrapper element
   *
   * @param {HTMLElement} element - the element who's children should be wrapped
   * @param {object} options - options.tag - the HTML tag of the wrapper
   * @returns {HTMLElement} the wrapper
   */
  wrapChildren: function(element, options) {
    options = options || {};
    var wrapper = element.ownerDocument.createElement(options.tag || "div");
    while (element.childNodes.length) {
      wrapper.appendChild(element.childNodes[0]);
    }
    element.appendChild(wrapper);
    return wrapper;
  },
  /**
   * unwrap the children of an element
   *
   * @param {HTMLElement} element - the element that contains a wrapper that should be removed. Copies all children of that wrapper into the element
   * @returns {void}
   */
  unwrapChildren: function(element) {
    var wrapper = element.removeChild(element.children[0]);
    while (wrapper.childNodes.length) {
      element.appendChild(wrapper.childNodes[0]);
    }
  },
  addClass: function(element, className) {
    element.className += (element.className ? " " : "") + className;
  },
  removeClass: function(element, className) {
    element.className = element.className.replace(new RegExp("(?:\\s+|^)" + className + "(?:\\s+|$)"), "");
  },
  /**
   * browser detection
   * no mobile detection
   */
  detectBrowser: function() {
    var match;
    if (typeof navigator === 'undefined') {
      this.browser = 'node';
      return;
    }
    if ((match = navigator.userAgent.match(/Edge\/([0-9]*)/))) {
      this.vendorPrefix = '-ms-';
      this.browserVersion = match[1];
      this.browser = "edge";
    } else if ((match = navigator.userAgent.match(/MSIE ([0-9]*)/))) {
      this.vendorPrefix = '-ms-';
      this.browserVersion = match[1];
      this.browser = "ie";
    } else if ((match = navigator.userAgent.match(/Trident.*rv\:([0-9]*)/))) {
      this.vendorPrefix = '-ms-';
      this.browserVersion = match[1];
      this.browser = "ie";
    } else if ((match = navigator.userAgent.match(/Chrome\/([0-9]*)/))) {
      this.vendorPrefix = '-webkit-';
      this.browserVersion = match[1];
      this.browser = "chrome";
    } else if ((match = navigator.userAgent.match(/Firefox\/([0-9]*)/))) {
      this.vendorPrefix = '';
      this.browserVersion = match[1];
      this.browser = "firefox";
    } else if ((match = navigator.userAgent.match(/iPad|iPhone|iPod/))) {
      this.vendorPrefix = '-webkit-';
      this.browserVersion = 0;
      this.browser = "ios";
    } else if ((match = navigator.userAgent.match(/Safari\/([0-9]*)/))) {
      this.vendorPrefix = '-webkit-';
      this.browserVersion = match[1];
      this.browser = "safari";
    } else if ((match = navigator.userAgent.match(/AppleWebKit/))) {
      this.vendorPrefix = '-webkit-';
      this.browserVersion = 0;
      this.browser = "webkit";
    }
  },
  calculatePrefixes: function(prefixable) {
    this.cssPrefix = this.cssPrefix || {};
    for (var i = 0; i < prefixable.length; i++) {
      this.cssPrefix[prefixable[i]] = (this.vendorPrefix && (this.vendorPrefix + prefixable[i])) || prefixable[i];
    }
  },
  /**
   * execute after the next renderloop
   * needed to ensure a previous transform has been applied so we can now apply a new transform with a transition
   * NOTE: if this is too slow (at least 16ms), we may try to apply the first transform also with a transision (1ms)
   * and listen for transitionEnd event
   *
   * @param {Function} callback - the function to be executed
   * @returns {void}
   */
  postAnimationFrame: function(callback) {
    var rf = window.requestAnimationFrame || function(cb) {
      setTimeout(cb, 1000 / 60);
    };
    rf(function() {
      // make sure to get behind the current render thread
      setTimeout(callback, 0);
    });
  },
  /**
   * select a layerJS view object using a CSS selector
   * returns only the first view it finds.
   *
   * @param {string} selector - a CSS selector that identifies an element that is associated with a NodeView OR the element itself
   * @returns {NodeView} the selected view object
   */
  selectView: function(selector) {
    var nodes;
    if (selector instanceof HTMLElement) {
      nodes = [selector];
    } else {
      nodes = document.querySelectorAll(selector);
    }
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i]._ljView) return nodes[i]._ljView;
    }
  },
  /**
   * similar to jquery delegated bind. Will "bind" to all elements matching selector, even if those are added after the listener was added.
   *
   * @param {HTMLElement} element - the root element within which elements specified by selector exist or will exist
   * @param {string} eventName - which event type should be bound
   * @param {string} selector - the selector for elements that shoud be bound
   * @param {funcion} fn - the listener
   * @returns {Type} Description
   */
  addDelegtedListener: function(element, eventName, selector, fn) {
    // install Element.matches polyfill method
    if (!window.Element.prototype.matches) {
      window.Element.prototype.matches =
        window.Element.prototype.matchesSelector ||
        window.Element.prototype.mozMatchesSelector ||
        window.Element.prototype.msMatchesSelector ||
        window.Element.prototype.oMatchesSelector ||
        window.Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {} // jshint ignore:line
          return i > -1;
        };
    }
    element.addEventListener(eventName, function(event) {
      var el = event.target;
      if (!el || !document.contains(el))
        return;
      while (el !== element && !el.matches(selector)) {
        el = el.parentNode;
      }
      if (el !== element) {
        fn.call(el, event);
      }
    });
  },
  /**
   * compare position of two HTML elements in source order
   *
   * @param {HTMLElement} a - the first element
   * @param {HTMLElement} b - the second element
   * @returns {Number} 1 if a is after b; -1 otherwise
   */
  comparePosition: function(a, b) {
    if (a === b) return 0;
    if (!a.compareDocumentPosition) {
      // support for IE8 and below
      return a.sourceIndex - b.sourceIndex;
    }
    var cmp = a.compareDocumentPosition(b);

    /*jslint bitwise: true */
    if ((cmp & window.Node.DOCUMENT_POSITION_DISCONNECTED)) throw "compare position: the two elements belong to different documents";
    if ((cmp & window.Node.DOCUMENT_POSITION_PRECEDING) || (cmp & window.Node.DOCUMENT_POSITION_CONTAINS)) return 1;
    return -1;
    /*jslint bitwise: false */
  },
  /**
   * Will get the value for a data-lj-* or lj-* attribute
   *
   * @param {HTMLElement} element
   * @param {string} name - the attribute name
   * @returns {string}
   */
  getAttributeLJ: function(element, name) {
    return element.getAttribute('data-lj-' + name) || element.getAttribute('lj-' + name);
  },

  /**
   * Will get the value for a --lj-* from the css
   *
   * @param {HTMLElement} element
   * @param {string} name - the attribute name
   * @returns {string}
   */
  getCssAttributeLJ: function(element, name) {
    var result = window.getComputedStyle(element, null).getPropertyValue('--lj-' + name);

    return result ? result.trim() : result;
  },

  /**
   * Check if the element has a data-lj-* or lj-* attribute defined
   *
   * @param {HTMLElement} element
   * @param {string} name - the attribute name
   * @returns {boolean}
   */
  hasAttributeLJ: function(element, name) {
    return element.hasAttribute('data-lj-' + name) || element.hasAttribute('lj-' + name);
  },

  /**
   * Check if the element has a --lj-* in the css
   *
   * @param {HTMLElement} element
   * @param {string} name - the attribute name
   * @returns {boolean}
   */
  hasCssAttributeLJ: function(element, name) {
    return window.getComputedStyle(element, null).getPropertyValue('--lj-' + name);
  },
  /**
   * Set the data-lj-* or lj-* attribute
   *
   * @param {HTMLElement} element
   * @param {string} name - the attribute name
   * @param {string} value - the attribute value
   */
  setAttributeLJ: function(element, name, value) {
    name = 'lj-' + name;
    if (element.getAttribute('data-' + name)) {
      element.setAttribute('data-' + name, value);
    } else {
      element.setAttribute(name, value);
    }
  },
  /**
   * Set the --lj-* in css
   *
   * @param {HTMLElement} element
   * @param {string} name - the attribute name
   * @param {string} value - the attribute value
   */
  setCssAttributeLJ: function(element, name, value) {
    var style = element.style;
    style['--lj-' + name] = value;
  },
  /**
   * Will try to find a parent view of a specific type
   *
   * @param {HTMLElement} element
   * @param {string} type - the view type to look
   * @returns {Object} a view
   */
  findParentViewOfType: function(element, type) {
    var parent = element.parentElement;
    var found = false;

    while (parent && !found) {
      if (parent._ljView && parent._ljView.type() === type) {
        found = true;
      } else {
        parent = parent.parentElement;
      }
    }

    return found ? parent._ljView : undefined;
  },
  timeToMS: function(time) {
    if (isFinite(time)) return time; // if number interprete as ms
    var match = time && time.match(/^([\d\.]*)(s|ms|min|h)$/);
    if (!match) return 0;
    switch (match[2]) {
      case 'ms':
        return match[1];
      case 's':
        return match[1] * 1000;
      case 'min':
        return match[1] * 60 * 1000;
      case 'h':
        return match[1] * 60 * 60 * 1000;
    }
    return 0;
  },
  /**
   * will convert a css dimension value (e.g. 3px, 4em, 6vh) into a number representing pixels
   *
   * @param {string|number} value - the value to be converted
   * @param {HTMLElement} element - needed for dimensions based on 'em'; note: 'ex' is not supported
   * @returns {number} dimension in pixels
   */
  parseDimension: function(value, element) {
    if (!isNaN(Number(value))) return Number(value);
    if (value.match(/px$/)) return parseInt(value);
    if (value.match(/em$/)) return parseInt(value) * parseInt(window.getComputedStyle(element)['font-size']);
    if (value.match(/vh$/)) return parseInt(value) * window.innerHeight / 100;
    if (value.match(/vw$/)) return parseInt(value) * window.innerWidth / 100;
    // FIXME: '%' missing
    return undefined;
  },
  /**
   * Will generate a unique id for a specific prefix (layerJS type). The id is scoped
   * to the current document.
   *
   * @param {string} prefix - a prefix (layerJS type)
   * @param {Object} doc - the document to generate a unique id from
   * @returns {string} a unique id
   */
  uniqueID: function(prefix, doc) {
    doc = doc || document;
    if (doc._ljUniqueHash === undefined) {
      doc._ljUniqueHash = {};
    }
    var uniqueHash = doc._ljUniqueHash;
    prefix = prefix || -1;
    if (uniqueHash[prefix] === undefined) {
      uniqueHash[prefix] = -1;
    }
    if (prefix !== -1) {
      return prefix + "[" + (++uniqueHash[prefix]) + "]";
    } else {
      return ++uniqueHash[prefix];
    }
  },
  /**
   * alternative console.log function that will supress output on live systems
   *
   * @param {...} ... - arguments to console.log
   */
  debug: function() {
    if (_debug === null) {
      _debug = document && document.body && DomHelpers.getAttributeLJ(document.body, "debug") ? true : false;
    }
    //if (!window || (window.location.protocol.match(/file/i)) || (window.location.host.match(/localhost/i)) || (window.location.host.match(/127\.0\./i))) {
    if (_debug) {
      console.log.apply(console, arguments);
    }
  },
  /**
   * Will parse the url for a location, queryString and hash
   *
   * @param {string} url - url to parse
   * @returns {Object} An object that contains the location, queryString and hash based on the provided url
   */
  splitUrl: function(url) {
    // this regular expression does not always works
    var match = url.match(/^([^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/);
    return {
      location: match[1],
      queryString: match[2],
      hash: match[3]
    };
    /*
        var splitted = url.split('?');
        var before = splitted[0];
        var queryString = '';
        var hash = '';

        if (splitted.length > 1) {
          splitted = splitted[1].split('#');
          queryString = splitted[0];
          hash = splitted.length > 1 ? splitted[1] : '';
        } else {
          splitted = splitted[0].split('#');
          before = splitted[0];
          hash = splitted.length > 1 ? (splitted[1]) : '';
        }

        return {
          location: before,
          queryString: queryString,
          hash: hash
        };*/
  },
  /**
   * take splitted url an rejoin
   *
   * @param {Object} splitted - the splitted url
   * @param {bool} noHash - when true, the hash will be ommitted
   * @returns {string} url
   */
  joinUrl: function(splitted, noHash) {
    var result = (splitted.location ? splitted.location : "") + (splitted.queryString ? "?" + splitted.queryString : "");

    if (noHash !== true)
      result += splitted.hash ? "#" + splitted.hash : "";

    return result;
  },
  /**
   * Will parse a string for transition parameters
   *
   * @param {string} string - A string to parse for transition parameters
   * @param {boolean} keepParameters - If true, the transitionParameters will not be removed from the string
   * @returns {Object} An object that contains a string and a transition object
   */
  parseStringForTransitions: function(string, keepParameters) {
    var transition = {};

    if (string) {

      for (var parameter in defaults.transitionParameters) {
        if (defaults.transitionParameters.hasOwnProperty(parameter)) {
          var parameterName = defaults.transitionParameters[parameter];
          var regEx = new RegExp("(?:^|[?&])" + parameterName + "=([^&]+)");
          var match = string.match(regEx);
          if (match) {
            transition[parameter] = match[1];
            if (true !== keepParameters) {
              string = string.replace(regEx, '');
            }
          }
        }
      }
    }

    return {
      string: string,
      transition: transition
    };
  },
  /**
   * Will parse an url for transition parameters
   *
   * @param {string} url - An url to parse
   * @param {boolean} keepParameters - If true, the transitionParameters will not be removed from the string
   * @returns {Object} An object that contains a url and a transition object
   */
  // parseQueryString: function(url, keepParameters) {
  //   var parsedUrl = this.splitUrl(url);
  //   var parsed = this.parseStringForTransitions(parsedUrl.queryString, keepParameters);
  //
  //   return {
  //     transition: parsed.transition,
  //     url: parsedUrl.location + (parsed.string.length > 0 ? (parsed.string) : '') + (parsedUrl.hash.length > 0 ? (parsedUrl.hash) : '')
  //   };
  // },
  /**
   *  Will transform a relative url to an absolute url
   * https://davidwalsh.name/get-absolute-url
   * @param {string} url to tranform to an absolute url
   * @return {string} an absolute url
   */
  getAbsoluteUrl: (function() {
    var a = document.createElement('a');
    return function(url) {
      a.href = url;
      return a.href;
    };
  })(),

  /**
   *  Will return all parents of a node in DOM order
   * https://gist.github.com/benpickles/4059636
   * @param {object} node an node who's parents we need to find
   * @return {array} Array of the DOM parents of the node. Tomost parent comes first
   */
  _parents: function(node) {
    // Place the first node into an array
    var nodes = [node];

    // As long as there is a node
    for (; node; node = node.parentNode) {
      // Place that node at the beginning of the array
      // This unravels the tree into an array with child/parents only
      nodes.unshift(node);
    }
    // Return the array
    return nodes;
  },

  /**
   *  Will return the common parent between 2 nodes
   * https://gist.github.com/benpickles/4059636
   * @param {object} node
   * @param {object} node
   * @return {object} common parent
   */
  commonParent: function(node1, node2) {
    // Get the hierarchy arrays
    var parents1 = this._parents(node1);
    var parents2 = this._parents(node2);

    /* At this point we have two hierarchies. Although DOM can go x steps up to
     ** a common parent node, top down will be equal for a common ancestor, as
     ** the difference to the top is only after we break past the common ancestor.
     ** After that, the common node has the same parent as the other node, so it's
     ** the same all the way to the top. (If that doesn't make sense, thing about
     ** it, and maybe draw it out).
     */

    // Ensure we have found a common ancestor, which will be the first one if anything
    if (parents1[0] !== parents2[0]) return null;

    /* Otherwise, traverse down the hierarchy until we reach where they're no longer
     ** the same. Then return one up, which is the closest, common ancestor.
     */
    for (var i = 0; i < parents1.length; ++i) {
      // If we found the split, return the one above it
      if (parents1[i] !== parents2[i]) return parents1[i - 1];
    }

    // Formality, even though we'll never make it this far
    return null;
  },
  getMatrixArray: function(element) {
    var st = window.getComputedStyle(element, null);
    var tr = st.getPropertyValue("-webkit-transform") ||
      st.getPropertyValue("-moz-transform") ||
      st.getPropertyValue("-ms-transform") ||
      st.getPropertyValue("-o-transform") ||
      st.getPropertyValue("transform") ||
      "FAIL";

    var array;
    if (tr === 'none' || undefined === tr || 'FAIL' === tr) {
      array = [1, 0, 0, 1, 0, 0];
    } else {

      tr = tr.toLowerCase();
      var values = tr.split('(')[1].split(')')[0].split(',').map(function(value) {
        return parseFloat(value.replace(/\s+/g, ''));
      });

      var a = values[0];
      var b = values[1];
      var c = values[2];
      var d = values[3];
      var e = values[4];
      var f = values[5];

      if (tr.startsWith('matrix3d(')) {
        a = values[0];
        b = values[1];
        c = values[4];
        d = values[5];
        e = values[12];
        f = values[13];
      }

      array = [a, b, c, d, e, f];
    }

    return array;
  },

  getMatrix: function(element) {
    var matrix = new TMat(this.getMatrixArray(element));
    var topLeftMatrix = this.getTopLeftMatrix(element);
    /*
    could contain translate -> correct this
    topLeftMatrix.tx = topLeftMatrix.tx - (matrix.tx * matrix.a);
    topLeftMatrix.ty = topLeftMatrix.ty - (matrix.ty * matrix.d);
    topLeftMatrix = topLeftMatrix.prod(TMat.Tscalexy(matrix.a, matrix.d));
    */
    //  matrix = matrix.prod(topLeftMatrix);
    matrix = topLeftMatrix.prod(matrix);

    return matrix;
  },

  getScaleAndRotationMatrix: function(element) {
    var matrix = new TMat(this.getMatrixArray(element));
    matrix.tx = matrix.ty = 0;

    return matrix;
  },

  applyTopLeftOnMatrix: function(element, matrix) {

    var degrees = matrix.get_rotation_equal();
    degrees = (degrees % 360);
    var rectAfter = element.getBoundingClientRect();
    var width = rectAfter.width,
      height = rectAfter.height;
    var rotation, rotationLeft, rotationTop, top = rectAfter.top,
      left = rectAfter.left;

    if ((degrees > 0 && degrees <= 90) || (degrees < -270 && degrees >= -360)) {
      //ok
      rotation = degrees * Math.PI / 180 * (-1);

      top = rectAfter.top;
      left = rectAfter.left - Math.sin(rotation) * height;
    } else if ((degrees > 90 && degrees <= 180) || (degrees < -180 && degrees >= -270)) {
      //ok
      rotationTop = ((180 - degrees) * Math.PI / 180);
      rotationLeft = ((degrees) * Math.PI / 180);

      top = rectAfter.top - Math.cos(rotationTop) * height * (-1);
      left = rectAfter.left + (Math.sin(rotationLeft) * height + Math.cos(rotationLeft) * (-1) * width); //NOK
    } else if ((degrees < 0 && degrees >= -90) || (degrees > 270 && degrees <= 360)) {
      //ok
      rotation = (-degrees) * Math.PI / 180;

      top = rectAfter.top + Math.sin(rotation) * width;
      left = rectAfter.left;
    } else if ((degrees < -90 && degrees >= -180) || (degrees > 180 && degrees <= 270)) {
      //ok
      rotationLeft = ((180 - degrees) * Math.PI / 180);
      rotationTop = ((-degrees) * Math.PI / 180);

      left = rectAfter.left + Math.cos(rotationLeft) * width;
      top = rectAfter.top + (Math.sin(rotationTop) * width + Math.cos(rotationTop) * (-1) * height); //ok
    }

    matrix.tx = left; // * matrix.a;
    matrix.ty = top; // * matrix.d;
    return matrix;
  }
};
DomHelpers.detectBrowser();
DomHelpers.calculatePrefixes(['transform', 'transform-origin']);

// enable this function to get timing information into the console logs
// var oldlog = console.log;
// var log0 = Date.now();
// console.log = function() {
//   oldlog.apply(this, [((Date.now() - log0) / 1000).toFixed(2) + "s"].concat(Array.prototype.slice.call(arguments)));
// };
module.exports = DomHelpers;

},{"./defaults.js":2,"./tmat.js":30}],4:[function(require,module,exports){
'use strict';
var pluginManager = require('./pluginmanager.js');
var $ = require('./domhelpers.js');
var BaseView = require('./baseview.js');
var defaults = require('./defaults.js');

/**
 * A View which can have child views
 * @param {FrameData} dataModel
 * @param {object}        options
 * @extends GroupView
 */
var FrameView = BaseView.extend({
  constructor: function(options) {
    this.renderRequiredAttributes = ['lj-fit-to', 'lj-elastic-left', 'lj-elastic-right', 'lj-elastic-top', 'lj-elastic-bottom', 'lj-width', 'lj-height', 'lj-x', 'lj-y', 'lj-scale-x', 'lj-scale-y', 'lj-rotation', 'lj-start-position'];
    this.transformData = undefined;

    BaseView.call(this, options);
    this.originalParent = this.parent;
  },
  /**
   * Specifies what will need to be observed on the DOM element. (Attributes, Children and size)
   */
  startObserving: function() {
    BaseView.prototype.observe.call(this, this.innerEl, {
      attributes: true,
      attributeFilter: ['name', 'lj-name', 'id'].concat(this.renderRequiredAttributes),
      children: true,
      size: true
    });
  },
  /**
   * Will add eventhandlers to specific events. It will handle a 'childrenChanged', 'sizeChanged' and
   * 'attributesChanged' event.
   */
  registerEventHandlers: function() {
    var that = this;

    BaseView.prototype.registerEventHandlers.call(this);

    this.on('sizeChanged', function() {
      if (that.parent) {
        if (that.inTransition) { // defer renderrequired after the transition finishes
          if (!that.inTransitionListening) {
            setTimeout(function f() {
              if (!that.inTransition) {
                that.inTransitionListening = false;
                that.trigger('renderRequired', that.name());
              } else {
                setTimeout(f, 100);
              }
            }, 100);
          }
          that.inTransitionListening = true;
        } else {
          that.trigger('renderRequired', that.name());
        }
      }
    });

    this.on('attributesChanged', this.attributesChanged);
  },
  /**
   * Will be invoked the an 'attributesChanged' event is triggered. Will trigger a 'renderRequired' when needed.
   * @param {Object} attributes - a hash object the contains the changed attributes
   */
  attributesChanged: function(attributes) {
    for (var i = 0; i < this.renderRequiredAttributes.length; i++) {
      var attributeNames = Object.getOwnPropertyNames(attributes);
      if (attributeNames.indexOf(this.renderRequiredAttributes[i]) !== -1 || attributeNames.indexOf('data-' + this.renderRequiredAttributes[i]) !== -1) {
        this.trigger('renderRequired', this.name());
        break;
      }
    }
  },
  /**
   * get the transformData of the frame that describes how to fit the frame into the stage
   *
   * @param {LayerView} layer - the layer of the frame
   * @param {String} transitionStartPosition -  [optional] the transition data for the current transition, only startPosition is considered
   * @param {Boolean} keepScroll - if true, scrollX and scrollY are not reset to their initial positions (unless transitionStartPosition requests a full recalculation)
   * @returns {TransformData} the transform data
   */
  getTransformData: function(layer, transitionStartPosition, keepScroll) {
    // check if we can return cached version of transfromData
    var d = this.transformData;
    if (!d || d.isDirty || d.layer !== layer || (transitionStartPosition && transitionStartPosition !== d.startPosition)) {
      // calculate transformData
      if (d) delete d.isDirty;
      this.unobserve();
      this.transformData = this.calculateTransformData(layer, transitionStartPosition);
      this.startObserving();
      return this.transformData;
    }
    if (!keepScroll) {
      d.scrollX = d.initialScrollX;
      d.scrollY = d.initialScrollY;
    }
    return d;
  },
  /**
   * Returns the scroll data for this frame in form of a transition record with only the values for scroll positions and startPosition set.   *
   * @returns {object} contains the scrollX and scrollY
   */
  getScrollData: function() {

    var scrollData = this.transformData ? {
      //  startPosition: this.transformData.startPosition,
      scrollX: this.transformData.scrollX,
      scrollY: this.transformData.scrollY
    } : {};
    return scrollData;
  },
  /**
   * calculate transform data (scale, scoll position and displacement) when fitting current frame into associated stage.
   * Note: this ignores the frame's scale and rotation property which have to be dealt with in the layer layout if necessary.
   *
   * @param {LayerView} layer - the layer the frame belongs to
   * @param {string} [transitionStartPosition] - the scroll position at start
   * @returns {TransformData} the transform data
   */
  calculateTransformData: function(layer, transitionStartPosition) {
    var stage = layer.parent;
    var sDim = layer.getStageDimensions(this);

    // data record contianing transformation and scrolling information of frame within given stage
    var d = this.transformData = {};
    var stageWidth = d.stageWidth = sDim ? sDim.width : 0;
    var stageHeight = d.stageHeight = sDim ? sDim.height : 0;
    if (stageHeight === 0 || stageWidth === 0) d.isDirty = true; //if this happens nothing will be shown, a stage dimension change should happen soon so we need to recalculate
    d.layer = layer;
    // scaling of frame needed to fit frame into stage
    d.scale = 1;
    d.frameWidth = this.width();
    d.frameHeight = this.height();

    // d.shiftX/Y indicate how much the top-left corner of the frame should be shifted from
    // the stage top-left corner (in stage space)
    d.shiftX = 0;
    d.shiftY = 0;
    // d.scrollX/Y give the initial scroll position in X and/or Y direction.
    d.scrollX = 0;
    d.scrollY = 0;
    // indicate whether scrolling in x or y directions is active
    d.isScrollX = false;
    d.isScrollY = false;
    d.margin = this.getMargin();

    var fitTo = this.fitTo(false) || layer.fitTo();

    if (-1 === ['responsive', 'responsive-width'].indexOf(fitTo) && this.widthSet()) {
      d.frameWidth = this.getOriginalWidth().computedStyleWidth;
      d.frameOriginalWidth = this.getOriginalWidth().width;
      this.widthSet(false);
    }

    if (-1 === ['responsive', 'responsive-height'].indexOf(fitTo) && this.heightSet()) {
      d.frameHeight = this.getOriginalHeight().computedStyleHeight;
      d.frameOriginalHeight = this.getOriginalHeight().height;
      this.heightSet(false);
    }

    var fitX = false, fitY = false;

    switch (fitTo) {
      case 'width':
        d.scale = stageWidth / d.frameWidth;
        d.isScrollY = true;
        fitX = true;
        break;
      case 'height':
        d.scale = stageHeight / d.frameHeight;
        fitY = true;
        d.isScrollX = true;
        break;
      case 'fixed':
        d.scale = 1;
        d.isScrollX = true;
        d.isScrollY = true;
        break;
      case 'contain':
        d.scaleX = stageWidth / d.frameWidth;
        d.scaleY = stageHeight / d.frameHeight;
        fitX = true;
        fitY = true;
        if (d.scaleX < d.scaleY) {
          d.scale = d.scaleX;
          d.isScrollY = true;
        } else {
          d.scale = d.scaleY;
          d.isScrollX = true;
        }
        break;
      case 'cover':
        d.scaleX = stageWidth / d.frameWidth;
        d.scaleY = stageHeight / d.frameHeight;
        fitX = true;
        fitY = true;
        if (d.scaleX > d.scaleY) {
          d.scale = d.scaleX;
          d.isScrollY = true;
        } else {
          d.scale = d.scaleY;
          d.isScrollX = true;
        }
        break;
      case 'elastic-width':
        if (stageWidth <= d.frameWidth && stageWidth >= d.frameWidth - this.elasticLeft() - this.elasticRight()) {
          d.scale = 1;
          d.shiftX = this.elasticLeft() * (d.frameWidth - stageWidth) / (parseInt(this.elasticLeft()) + parseInt(this.elasticRight()));
        } else if (stageWidth > d.frameWidth) {
          d.scale = stageWidth / d.frameWidth;
        } else {
          d.scale = stageWidth / (d.frameWidth - this.elasticLeft() - this.elasticRight());
          d.shiftX = this.elasticLeft();
        }
        fitX = true;
        d.isScrollY = true;
        break;
      case 'elastic-height':
        if (stageHeight <= d.frameHeight && stageHeight >= d.frameHeight - this.elasticTop() - this.elasticBottom()) {
          d.scale = 1;
          d.shiftY = this.elasticTop() * (d.frameHeight - stageHeight) / (parseInt(this.elasticTop()) + parseInt(this.elasticBottom()));
        } else if (stageHeight > d.frameHeight) {
          d.scale = stageHeight / d.frameHeight;
        } else {
          d.scale = stageHeight / (d.frameHeight - this.elasticTop() - this.elasticBottom());
          d.shiftY = this.elasticTop();
        }
        fitY = true;
        d.isScrollY = true;
        break;
      case 'responsive':
        d.scale = 1;
        //if (d.frameWidth !== stageWidth) {
        d.frameWidth = stageWidth;
        d.applyWidth = true;
        //}
        //if (d.frameHeight !== stageHeight) {
        d.applyHeight = true;
        d.frameHeight = stageHeight;
        fitX = true;
        fitY = true;
        //}
        break;
      case 'responsive-width':
        d.scale = 1;
        d.isScrollY = true;
        //if (d.frameWidth !== stageWidth) {
        d.applyWidth = true;
        d.frameWidth = stageWidth;
        fitX = true;
        // NOTE: Afterward the height of the frame most likely changed which is not reflected in the transformData; however, this should be dealt with by the sizechanged handler
        //}
        break;
      case 'responsive-height':
        d.scale = 1;
        d.isScrollX = true;
        //if (d.frameHeight !== stageHeight) {
        d.applyHeight = true;
        d.frameHeight = stageHeight;
        fitY = true;
        //}
        break;
      default:
        throw "unkown fitTo type '" + fitTo + "'";
    }

    if (fitX && stage.autoWidth()) {
      console.warn('we can\'t adapt stage width if we fit to width');
      d.stageWidth = stageWidth = d.width = 100;
    } else if (fitY && stage.autoHeight()) {
      console.warn('we can\'t adapt stage height if we fit to height');
      d.stageHeight = stageHeight = d.height = 100;
    }


    // calculate actual frame width height in stage space
    d.width = d.frameWidth * d.scale;
    d.height = d.frameHeight * d.scale;

    if (stage && stage.autoWidth()) {
      d.stageWidth = stageWidth = d.width;
    } else if (stage && stage.autoHeight()) {
      d.stageHeight = stageHeight = d.height;
    }
    // calculate maximum scroll positions (depend on frame and stage dimensions)
    // WARN: allow negative maxScroll for now
    d.maxScrollY = 0;
    d.maxScrollX = 0;
    if (d.isScrollY) d.maxScrollY = d.frameHeight - stageHeight / d.scale;
    if (d.isScrollX) d.maxScrollX = d.frameWidth - stageWidth / d.scale;
    // define initial positioning
    // take startPosition from transition or from frame
    d.startPosition = transitionStartPosition || this.startPosition();
    var partials = ({ // get startPositions for x and y direction from generic startPosition string
      top: ['top', 'center'],
      bottom: ['bottom', 'center'],
      left: ['left', 'middle'],
      right: ['right', 'middle'],
      'top-left': ['top', 'left'],
      'top-right': ['top', 'right'],
      'bottom-left': ['bottom', 'left'],
      'bottom-right': ['bottom', 'right'],
      'middle-center': ['middle', 'center'],
      middle: ['middle', 'center'],
      center: ['middle', 'center'],
    })[d.startPosition];
    for (var p = 0; p < partials.length; p++) {
      switch (partials[p]) {
        case 'top':
          if (d.isScrollY) d.scrollY = 0;
          break;
        case 'bottom':
          if (d.isScrollY) {
            d.scrollY = d.maxScrollY;
            if (d.scrollY < 0) {
              d.shiftY = d.scrollY;
              d.scrollY = 0;
            }
          }
          break;
        case 'left':
          if (d.isScrollX) d.scrollX = 0;
          break;
        case 'right':
          if (d.isScrollX) {
            d.scrollX = d.maxScrollX;
            if (d.scrollX < 0) {
              d.shiftX = d.scrollX;
              d.scrollX = 0;
            }
          }
          break;
        case 'center':
          if (d.isScrollX) {
            d.scrollX = (d.frameWidth - stageWidth / d.scale) / 2;
            if (d.scrollX < 0) {
              d.shiftX = d.scrollX;
              d.scrollX = 0;
            }
          }
          break;
        case 'middle':
          if (d.isScrollY) {
            d.scrollY = (d.frameHeight - stageHeight / d.scale) / 2;
            if (d.scrollY < 0) {
              d.shiftY = d.scrollY;
              d.scrollY = 0;
            }
          }
          break;
        default:
          if (d.isScrollX) d.scrollX = 0;
          if (d.isScrollY) d.scrollY = 0;
          break;
      }
    }
    // disable scrolling if maxscroll < 0
    if (d.maxScrollX <= 0) {
      d.shiftX += d.scrollX;
      d.scrollX = 0;
      d.maxScrollX = 0;
      d.isScrollX = false;
    }
    if (d.maxScrollY <= 0) {
      d.shiftY += d.scrollY;
      d.scrollY = 0;
      d.maxScrollY = 0;
      d.isScrollY = false;
    }
    // disable scrolling if configured in frame
    if (this.noScrolling()) {
      d.shiftX += d.scrollX;
      d.shiftY += d.scrollY;
      d.scrollX = 0;
      d.scrollY = 0;
      d.isScrollX = false;
      d.isScrollY = false;
      d.maxScrollX = 0;
      d.maxScrollY = 0;
    }

    d.shiftX *= d.scale;
    d.shiftY *= d.scale;

    // save inital scroll position to be able to reset this without recalculating the full transform data
    d.initialScrollX = d.scrollX;
    d.initialScrollY = d.scrollY;
    d.frame = this;

    if (d.applyWidth && !this.widthSet()) {
      this.setOriginalWidth();
      this.widthSet(true);
    }

    if (d.applyHeight && !this.heightSet()) {
      this.setOriginalHeight();
      this.heightSet(true);
    }

    return (this.transformData = d);
  },
  /**
   * Will return the width of the view (including the margins)
   *
   * @return {Number} the width of the view
   */
  width: function() {
    var margin = this.getMargin();
    var marginToAdd = margin.left + margin.right;
    return BaseView.prototype.width.call(this) + marginToAdd; // we always return width incl. margin to also fit margin into stage
  },
  /**
   * Will return the height of the view (including the margins)
   *
   * @return {Number} the height of the view
   */
  height: function() {
    var margin = this.getMargin();
    var marginToAdd = margin.top + margin.bottom;
    return BaseView.prototype.height.call(this) + marginToAdd; // we always return height incl. margin to also fit margin into stage
  },

}, {
    defaultProperties: {
      type: 'frame'
    },
    identify: function(element) {
      var type = $.getAttributeLJ(element, 'type');
      return null !== type && type.toLowerCase() === FrameView.defaultProperties.type;
    }
  });

pluginManager.registerType('frame', FrameView, defaults.identifyPriority.normal);
module.exports = FrameView;
},{"./baseview.js":1,"./defaults.js":2,"./domhelpers.js":3,"./pluginmanager.js":21}],5:[function(require,module,exports){
'use strict';
var Kern = require('../../kern/Kern.js');

var Gesture = Kern.Base.extend({
  constructor: function() {
    //this.altKey = false;
    this.buttons = [false, false, false];
    this.cancel = false; //
    this.click = false;
    //this.ctrlKey = false;
    //this.dbl = false;
    this.doubleClick = false;
    //this.event = null; // real event
    this.first = false;
    this.id = 0;
    this.last = false;
    //this.lng = false;
    //this.longClick = false;
    this.move = false;
    //this.multi = false;
    //this.rotation = 0;
    //this.scale = 1;

    this.shift = {
      x: 0,
      y: 0
    };
    this.shiftKey = false;
    this.start = {
      x: 0,
      y: 0
    };
    this.startTime = new Date().getTime();
    this.touch = false; // from finger not from mouse
    //this.transform = false;
    this.wheel = false;
    this.wheelDelta = 0; // orginal value from the event
    this.position = {
      x: 0,
      y: 0
    };
  },
  /**
   * Returns how long a go the event got fired
   */
  lifeTime: function() {
    return new Date().getTime() - this.startTime;

  },
  /**
   * Returns if the gesture has made enough distance to lock a direction
   */
  enoughDistance: function() {
    return Math.abs(this.shift.x) + Math.abs(this.shift.y) > 10;
  }
}, {});

module.exports = Gesture;

},{"../../kern/Kern.js":31}],6:[function(require,module,exports){
'use strict';
var Kern = require('../../kern/Kern.js');
var Gesture = require('./gesture.js');
var layerJS = require('../layerjs.js');

var GestureManager = Kern.EventManager.extend({
  constructor: function() {
    this.gesture = null;
    this.element = null;
    this.gesturecc = 0;
    this.timeoutWheel = null;

  },
  /**
   * Will register a layerView for events
   * @param {element} The actual dom element that needs to be listened to
   * @param {callback} The callback method
   * @param {options} additiional options
   */
  register: function(element, callback, options) {
    options = options || {};
    this._registerTouchEvents(element, callback, options);
    this._registerWheelEvents(element, callback, options);
  },
  /**
   * Will register a layerView for mouse/touche events
   * @param {element} The actual dom element that needs to be listened to
   * @param {callback} The callback method
   * @param {options} additiional options
   */
  _registerWheelEvents: function(element, callback, options) {
    var that = this;
    var wheel = function(e) {
      return that._wheel(e, element, callback, options);
    };

    element.addEventListener('wheel', wheel);
  },
  /**
   * Will register a layerView for mouse/touche events
   * @param {element} The actual dom element that needs to be listened to
   * @param {callback} The callback method
   * @param {options} additiional options
   */
  _registerTouchEvents: function(element, callback, options) {
    var that = this;
    var tap = function(e) {
      return that._tap(e, element, callback, options);
    };
    var drag = function(e) {
      return that._drag(e, element, callback, options);
    };
    var release = function(e) {
      return that._release(e, element, callback, options);
    };

    if (typeof window.ontouchstart !== 'undefined') {
      element.addEventListener('touchstart', tap);
      element.addEventListener('touchend', release);
      if (options.dragging) {
        element.addEventListener('touchmove', drag);
      }
    }

    if (options.mouseDragging) {
      element.addEventListener('mousedown', tap);
      element.addEventListener('mouseup', release);
      if (options.dragging) {
        element.addEventListener('mousemove', drag);
      }
    }
  },
  /**
   * Users starts a wheel event
   * @param {event} Actual dom event
   * @param {element} The actual dom element that needs to be listened to
   * @param {callback} The callback method
   * @param {options} additiional options
   */
  _wheel: function(event, element, callback, options) { //jshint unused:false
    var that = this;

    if (this.timeoutWheel) {
      clearTimeout(this.timeoutWheel);
    }
    // WARN: temporarily always create a new gesture on every wheel event. The gesture continuation leads
    // to hanging if gesture canceling is implemented
    if (true || !this.gesture || !this.gesture.wheel || this.element !== element) {
      this.gesture = new Gesture();
      this.gesture.wheel = true;
      this.gesture.first = true;
      this.gesture.start.x = this.gesture.position.x = this._xPosition(event);
      this.gesture.start.y = this.gesture.position.y = this._yPosition(event);
      this.element = element;
      this._raiseGesture(event, callback); // first
//    } else {
//      this.gesture.startTime = new Date().getTime();
    }
    this.gesture.first = false;
    this.gesture.wheelDelta = this._wheelDelta(event);

    this.gesture.position = {
      x: this.gesture.position.x + this.gesture.wheelDelta.x * 6,
      y: this.gesture.position.y + this.gesture.wheelDelta.y * 6
    };
    this.gesture.shift = {
      x: this.gesture.position.x - this.gesture.start.x,
      y: this.gesture.position.y - this.gesture.start.y
    };
    // temporary set gesture.last here as gesture continuation has been disabled
    this.gesture.last = true;
    this._raiseGesture(event, callback);
    // var thisgesture = this.gesturecc;
    // this.gesturecc++;
    // this.timeoutWheel = setTimeout(function() {
    //   if (that.gesture && that.gesture.wheel && that.gesture.gesturecc === thisgesture) {
    //     that.gesture = that.element = null; // FIXME we need to notify the listener that this gesture ended (either by sending another gesture with .last set or .cancel )
    //   }
    //   that.timeoutWheel = null;
    // }, 300);

    return false;
  },
  /**
   * return the wheel delta for the x- and y-axis
   * @param {event} Actual dom event
   */
  _wheelDelta: function(event) {
    var wheelDelta = {
      x: 0,
      y: 0
    };

    if (event.deltaY !== undefined && event.deltaX !== undefined) {
      wheelDelta.y = -event.deltaY / 3;
      wheelDelta.x = -event.deltaX / 3;
    } else if (event.wheelDeltaY !== undefined && event.wheelDeltaX !== undefined) {
      wheelDelta.y = -event.wheelDeltaY / 120;
      wheelDelta.x = -event.wheelDeltaX / 120;
    } else if (event.detail !== undefined) {
      // doesn't have an x and y variant, so by default we use it for the y axis
      wheelDelta.Y = -event.detail / 3;
    }
    return wheelDelta;
  },
  /**
   * Users starts a touch event
   * @param {event} Actual dom event
   * @param {element} The actual dom element that needs to be listened to
   * @param {callback} The callback method
   * @param {options} additiional options
   */
  _tap: function(event, element, callback, options) { //jshint unused:false
    this.element = element;
    this.gesture = new Gesture();
    this.gesture.first = true;
    this.gesture.start.x = this._xPosition(event);
    this.gesture.start.y = this._yPosition(event);
    this.gesture.touch = event.type !== "mousedown";
    this.gesture.click = event.type === "mousedown";
    this._raiseGesture(event, callback);

    return false;
  },
  /**
   * Users stops a touch event
   * @param {event} Actual dom event
   * @param {element} The actual dom element that needs to be listened to
   * @param {callback} The callback method
   * @param {options} additiional options
   */
  _release: function(event, element, callback, options) { //jshint unused:false
    this.gesture.move = false;
    this.gesture.last = true;
    this.gesture.position.x = this._xPosition(event);
    this.gesture.position.y = this._yPosition(event);
    this.gesture.shift.x = this.gesture.position.x - this.gesture.start.x;
    this.gesture.shift.y = this.gesture.position.y - this.gesture.start.y;

    this._raiseGesture(event, callback);

    this.gesture = this.element = null;
    return false;
  },
  /**
   * Users is dragging
   * @param {event} Actual dom event
   * @param {element} The actual dom element that needs to be listened to
   * @param {callback} The callback method
   * @param {options} additiional options
   */
  _drag: function(event, element, callback, options) { //jshint unused:false
    if (this.gesture !== null && (this.gesture.click || this.gesture.touch)) {
      this.gesture.first = false;
      this.gesture.move = true;
      this.gesture.position.x = this._xPosition(event);
      this.gesture.position.y = this._yPosition(event);
      this.gesture.shift.x = this.gesture.position.x - this.gesture.start.x;
      this.gesture.shift.y = this.gesture.position.y - this.gesture.start.y;
      this._raiseGesture(event, callback);
    }
    return false;
  },

  /**
   * Will get the Y postion (horizontal) of an avent
   * @param {event} Actual dom event
   */
  _yPosition: function(event) {
    // touch event
    if (event.targetTouches && (event.targetTouches.length >= 1)) {
      return event.targetTouches[0].clientY;
    } else if (event.changedTouches && (event.changedTouches.length >= 1)) {
      return event.changedTouches[0].clientY;
    }

    // mouse event
    return event.clientY;
  },
  /**
   * Will get the X postion (vertical) of an avent
   * @param {event} Actual dom event
   */
  _xPosition: function(event) {
    // touch event
    if (event.targetTouches && (event.targetTouches.length >= 1)) {
      return event.targetTouches[0].clientX;
    } else if (event.changedTouches && (event.changedTouches.length >= 1)) {
      return event.changedTouches[0].clientX;
    }

    // mouse event
    return event.clientX;
  },
  /**
   * Passes the gesture to the callback method
   * @param {callback} The callback method
   */
  _raiseGesture: function(event, callback) {
    if (callback && this.gesture) {
      this.gesture.event = event;
      if (!this.gesture.direction) { // is direction locked?
        var x = this.gesture.shift.x;
        var y = this.gesture.shift.y;
        if (this.gesture.enoughDistance()) { // has it moved considerably to lock direction?
          if (Math.abs(x) > Math.abs(y)) {
            this.gesture.direction = (x < 0 ? 'left' : 'right');
            this.gesture.axis = 'x';
          } else {
            this.gesture.direction = (y < 0 ? 'up' : 'down');
            this.gesture.axis = 'y';
          }
        }
      }
      // console.log(this.gesture.shift.x, this.gesture.shift.y);
      callback(this.gesture);

      if (this.gesture.preventDefault) { // should we stop propagation and prevent default?
        // console.log("gesturemanager: preventing default");
        event.preventDefault();
        event.stopPropagation();
      }
      if (this.gesture.cancelled) {
        // console.log("gesture cancelled");
        this.gesture = this.element = null;
      }
    }
  }
});

layerJS.gestureManager2 = new GestureManager();

module.exports = layerJS.gestureManager2;

},{"../../kern/Kern.js":31,"../layerjs.js":7,"./gesture.js":5}],7:[function(require,module,exports){
var $ = require('./domhelpers.js');
var defaults = require('./defaults.js');

require('./polyfill.js');
// this module defines a global namespace for all weblayer objects.
layerJS = {
  select: $.selectView,
  imagePath: "/",
  executeScriptCode: true,
  defaults: defaults
};

module.exports = layerJS;

},{"./defaults.js":2,"./domhelpers.js":3,"./polyfill.js":22}],8:[function(require,module,exports){
'use strict';
var $ = require('./domhelpers.js');
var Kern = require('../kern/Kern.js');
var pluginManager = require('./pluginmanager.js');
var layoutManager = require('./layoutmanager.js');
var ScrollTransformer = require('./scrolltransformer.js');
var gestureManager = require('./gestures/gesturemanager.js');
var defaults = require('./defaults.js');
var BaseView = require('./baseview.js');
var layerJS = require('./layerjs.js');

/**
 * A View which can have child views
 * @param {LayerData} dataModel
 * @param {object}        options
 * @extends GroupView
 */

var LayerView = BaseView.extend({
  constructor: function(options) {
    options = options || {};
    options.childType = 'frame';
    this.transitionQueue = new Kern.Queue();

    this.innerEl = this.outerEl = options.el;

    if (this.outerEl.children.length === 1 && $.getAttributeLJ(this.outerEl.children[0], 'helper') === 'scroller') {
      this.innerEl = this.outerEl.children[0];
    }

    BaseView.call(this, options);

    this._inTransition = false; // indicates that transition is still being animated
    this._transitionIDcounter = 1; // counts up every call of transitionTo()
    this.transitionID = 1; // in principle the same as _transitionIDcounter, but may be reset is transitionTo is not actually executing a transition
    this.scrollID = 1; // counts up every solitary scrollTo call (if duration>0);
    this.currentFrame = null;

    this.switchLayout(this.layoutType());
    this.switchScrolling(this.nativeScroll());

    // get upper layer where unuseable gestures should be sent to.
    // this.parentLayer = this.getParentOfType('layer');
    // register for gestures
    gestureManager.register(this.outerEl, this.gestureListener.bind(this), {
      dragging: true,
      mouseDragging: this.draggable()
    });

    var that = this;

    this.onResizeCallBack = function() {
      // when doing a transform, the callback should not be called
      //   if (!that.inTransition()) {
      that.render();
      //   }
    };

    // this is my stage and add listener to keep it updated
    this.stage = this.parent;

    /*    if (this.stage) {
          sizeObserver.register([this.stage], this.onResizeCallBack);
        }
    */
    /*  this.on('parent', function() {
      sizeObserver.unregister([that.stage]);
      that.stage = that.parent;
      sizeObserver.register([that.stage], that.onResizeCallBack);
      // FIXME trigger adaption to new stage
    });
*/
    // listen to scroll events
    this.on('scroll', function() { // jshint ignore:line
      //that._layout.updateTransitions(); // FIXME: notify layout about scroll and that prepared transitions may be outdated
      this.trigger('scrolled');
    });
    /*
    // register for gestures
    gestureManager.register(this.layer.outerEl,function(){
      that.gestureListener.apply(that,arguments);
    })
    */

    // set the initial frame if possible
    var currentFrame;
    var defaultFrame = this.defaultFrame();
    if (defaultFrame && defaultFrame !== defaults.specialFrames.none) {
      currentFrame = this._getFrame(defaultFrame) || null;
      if (!currentFrame) console.warn("layerJS: layer '" + this.name() + "': could not find defaultframe: '" + defaultFrame + "'");
    }
    // set first frame if possible
    if (!currentFrame && defaultFrame !== defaults.specialFrames.none) {
      currentFrame = this._getFrame(defaults.specialFrames.next) || null;
    }

    this.currentFrameTransformData = this.noFrameTransformdata();

    // set none otherwise
    if (!currentFrame) {
      this.currentFrame = null;
      this.showFrame(defaults.specialFrames.none, {
        lastFrameName: ''
      });
    } else {
      this.currentFrame = currentFrame;
      this.showFrame(currentFrame.name(), {
        lastFrameName: '',
        applyCurrentPostPosition: false
      });
    }

    this.autoTrigger();
  },
  /**
   * Specifies what will need to be observed on the DOM element. (Attributes, Children and size)
   */
  startObserving: function() {
    BaseView.prototype.observe.call(this, this.innerEl, {
      attributes: true,
      attributeFilter: ['name', 'lj-name', 'id', 'lj-layout-type', 'lj-native-scroll', 'lj-no-scrolling'],
      children: true
    });
  },
  /**
   * Will add eventhandlers to specific events. It will handle a 'childrenChanged', 'sizeChanged' and
   * 'attributesChanged' event. It will also handle it's parent 'renderRequired' event.
   */
  registerEventHandlers: function() {
    var that = this;
    BaseView.prototype.registerEventHandlers.call(this);

    this.on('attributesChanged', this.attributesChanged);

    if (this.parent) {
      this.parent.on('renderRequired', function() {
        // this check can be disabled
        //if (!that.inTransition()) {
        that.render();
        //  }
      });
    }

    this.on('transitionStarted', function() {
      that.autoTrigger();
    });
  },
  /**
   * Will be invoked the an 'attributesChanged' event is triggered.
   * @param {Object} attributes - a hash object the contains the changed attributes
   */
  attributesChanged: function(attributes) {

    if (attributes['lj-native-scroll'] || attributes['data-lj-native-scroll'] !== -1) {
      this.switchScrolling(this.nativeScroll());
    }

    if (attributes['lj-layout-type'] !== -1 || attributes['data-lj-layout-type'] !== -1) {
      this.switchLayout(this.layoutType());
    }

    if (attributes['lj-timer'] !== -1 || attributes['data-lj-timer'] !== -1) {
      this.autoTrigger();
    }

  },
  /**
   * will trigger a delayed transition after a previous transitions finished
   *
   * @param {Type} Name - Description
   * @returns {Type} Description
   */
  autoTrigger: function() {
    var timerRoute = this.timer();
    if (timerRoute) {
      if (timerRoute.match(/^[0-9]/)) timerRoute = "#!next&d=" + timerRoute; // interprete tie values (e.g. 2s) as #!next&d=2s
      layerJS.router.navigate(timerRoute, this);
    }
  },
  /**
   * Will place a child view at the correct position.
   * @param {Object} childView - the childView
   */
  renderChildPosition: function(childView) {
    // function is called when children are getting parsed. At that point, the layout can still be undefined
    if (!this._layout) {
      this.switchLayout(this.layoutType());
    }

    this._layout.renderFramePosition(childView, this._currentTransform);
  },
  /**
   * This method is called if a transition is started. It has a timeout function that will automatically remove
   * the _inTransition flag because DOM's transitionend is unreliable and this may block the whole swiping mechanism
   *
   * @param {number} duration - specify the expected length of the transition.
   * @returns {boolean} inTranstion or not
   */
  inTransition: function(_inTransition, transition) {
    if (_inTransition) {
      var that = this;
      var duration = (transition && transition.duration) ? 50 + Number.parseFloat(transition.duration) : 0; // add a safety time as the actual transition may start a bit later (syncing etc) and we don't want to interrupt the transition by a size-changed transition that doesn't know that a transition is still going on. If a transition is interupted, all the transitionend listeners will be called after the next successful transition only<

      this._inTransitionTimestamp = Date.now();
      this._inTransitionDuration = duration;
      this._intransitionID = transition.transitionID;
      this._inTransition = true;
      if (duration > 0) {
        setTimeout(function() {
          that._transitionEnd(transition);
          /*
          if (tID === that.transitionID) {
            delete that._inTransitionTimestamp;
            delete that._inTransitionDuration;
            delete that._intransitionID;
            that._inTransition = false;
          }*/
        }, duration);
      }
    } else if (_inTransition === false && this.transitionID === this._intransitionID) {
      delete this._inTransitionTimestamp;
      delete this._inTransitionDuration;
      delete this._intransitionID;
      this._inTransition = false;
    }
    return this._inTransition;
  },
  /**
   * returns the number of milliseconds left on the current transition or false if no transition is currently on going
   *
   * @returns {number/boolean} duration left in ms or false
   */
  getRemainingTransitionTime: function() {
    if (this._inTransition) {
      return Math.max(1, this._inTransitionDuration - (Date.now() - this._inTransitionTimestamp) - 50); // the 50 were added in inTransition()
    } else {
      return false;
    }
  },
  /**
   * Will toggle native and non-native scrolling
   *
   * @param {boolean} nativeScrolling
   * @returns {void}
   */
  switchScrolling: function(nativeScrolling) {
    this.unobserve();
    var hasScroller = this.outerEl.children.length === 1 && $.getAttributeLJ(this.outerEl.children[0], 'helper') === 'scroller';

    if (nativeScrolling) {
      this.innerEl = hasScroller ? this.outerEl.children[0] : $.wrapChildren(this.outerEl);
      $.setAttributeLJ(this.innerEl, 'helper', 'scroller');
      if (!this.innerEl._ljView) {
        this.innerEl._ljView = this.outerEl._ljView;
        this.innerEl._state = this.outerEl._state;
      }
      $.addClass(this.outerEl, 'nativescroll');
    } else {
      if (hasScroller) {
        $.unwrapChildren(this.outerEl);
      }
      this.innerEl = this.outerEl;
      $.removeClass(this.outerEl, 'nativescroll');
    }

    this._transformer = this._layout.getScrollTransformer() || new ScrollTransformer(this);
    this.setNativeScroll(nativeScrolling);

    if (this.currentFrame) {
      this.showFrame(this.currentFrame.name(), this.currentFrame.getScrollData());
    }

    this.startObserving();
  },
  /**
   * returns the current scrollX and scrollY
   *
   * @returns {Object} {scrollX: scrollX scrollY: scrollY}
   */
  getCurrentScroll: function() {
    return {
      scrollX: this.currentFrameTransformData.scrollX,
      scrollY: this.currentFrameTransformData.scrollY
    };
  },
  /**
   * resolves transition.scrollElement to actuall scrollX, scrollY coordinates
   * @param {object} transition the transitionrecord of the current transition
   */
  resolveScrollElement: function(transition, tfd) {
    var element = transition.scrollElement;
    var frameEl = transition.frame.innerEl;
    if (element && frameEl.contains(element)) {
      var ebb;
      // FIXME: using getBoundingClientBox assumes, that the stage itself is not scaled
      if (element instanceof Text) { // for text nodes its a bit more complicated to get bbox
        var range = document.createRange();
        range.selectNodeContents(element);
        ebb = range.getBoundingClientRect();
      } else {
        ebb = element.getBoundingClientRect();
      }
      var fbb = frameEl.getBoundingClientRect();
      if (transition.scrollIfNeeded) {
        // calculate align to top
        var scrollYt = (ebb.top - fbb.top) / tfd.scale;
        // calculate algin to bottom
        var scrollYb = (ebb.bottom - fbb.top - tfd.stageHeight) / tfd.scale + tfd.margin.top;
        //check if scrolling is necessary at all
        if (Math.min(scrollYt, scrollYb) > tfd.scrollY || Math.max(scrollYt, scrollYb) < tfd.scrollY) {
          // chose border which requires minimal scrolling
          transition.scrollY = (Math.abs(tfd.scrollY - scrollYt) < Math.abs(tfd.scrollY - scrollYb)) ? scrollYt : scrollYb;
        }
        // calculate align to left
        var scrollXl = (ebb.left - fbb.left) / tfd.scale;
        // calculate algin to right
        var scrollXr = (ebb.right - fbb.left - tfd.stageWidth) / tfd.scale + tfd.margin.left;
        //check if scrolling is necessary at all
        if (Math.min(scrollXl, scrollXr) > tfd.scrollX || Math.max(scrollXl, scrollXr) < tfd.scrollX) {
          // chose border which requires minimal scrolling
          transition.scrollX = (Math.abs(tfd.scrollX - scrollXl) < Math.abs(tfd.scrollX - scrollXr)) ? scrollXl : scrollXr;
        }
      } else {
        transition.scrollX = (ebb.left - fbb.left) / tfd.scale;
        transition.scrollY = (ebb.top - fbb.top) / tfd.scale;
      }
    }
  },
  /**
   * scrolls to a specified x,y position or a predefined postions using startPosition
   *
   * @param {Number} scrollX - optional: the new scroll x position
   * @param {Number} scrollY - optional: the new scroll y position
   * @param {object} transition - optional: includes duration: and optional scrollX, scrollY or startPosition
   * @returns {Promise} a promise that resolves when transition is finished
   */
  scrollTo: function(scrollX, scrollY, transition) {
    if (this.currentFrame === null) return;
    if (scrollX instanceof HTMLElement || scrollX instanceof Text) {
      transition = scrollY || {};
      transition.scrollElement = scrollX;
      scrollX = scrollY = undefined;
    } else if (typeof scrollX === 'object') {
      transition = scrollX;
      scrollX = scrollY = undefined;
    }
    transition = transition || {};
    if (transition.startPosition) { // need to recalculate transform data if startPosition has changed
      this.currentFrameTransformData = this.currentFrame.getTransformData(this, transition.startPosition);
    }
    var tfd = this.currentFrameTransformData;
    scrollX = (scrollX !== undefined ? scrollX : (transition.scrollX !== undefined ? transition.scrollX : tfd.scrollX || 0));
    scrollY = (scrollY !== undefined ? scrollY : (transition.scrollY !== undefined ? transition.scrollY : tfd.scrollY || 0));

    transition.scrollX = scrollX;
    transition.scrollY = scrollY;

    transition = Kern._extend({
      lastFrameName: this.currentFrame.name(),
      applyTargetPrePosition: false,
      applyCurrentPostPosition: false,
      applyCurrentPrePosition: false,
      duration: '',
      type: 'none'
    }, transition || {});

    return this.transitionTo(this.currentFrame.name(), transition);
  },
  /**
   * Will change the current layout with an other layout
   *
   * @param {string} layoutType - the name of the layout type
   * @returns {void}
   */
  switchLayout: function(layoutType) {
    this._layout = new (layoutManager.get(layoutType))(this);
    this._transformer = this._layout.getScrollTransformer() || new ScrollTransformer(this);

    if (this.currentFrame) {
      this.render();
    }
  },
  /**
   * set the scroll transform for the layer using the layouts setLayerTransform method. will check for the correct transition times if a transition is currently ongoing. CAVEAT: currently only support a plain transition property with only a time value e.g. setLayerTransform("translate(...)", {transition: "2s"})
   *
   * @param {string} transform - the transform for the scrolling
   * @param {Object} css - set the transitions property here
   * @returns {Promise} fullfilled after trnaisiton ends
   */
  setLayerTransform: function(transform, cssTransition) {
    var d = 0;
    if (cssTransition && cssTransition.transition) {
      d = $.timeToMS(cssTransition.transition); // FIXME there could be other values in transition and the duration may be set through transition-duration
    }
    d = this.inTransition() ? Math.max(this.getRemainingTransitionTime(), d) : d; // duration should be at least as long as currently ongoing transition;
    d = d ? d + "ms" : ''; // make ms time or empty string
    return this._layout.setLayerTransform(transform, {
      transition: d
    });
  },
  gestureListener: function(gesture) {
    if (gesture.event._ljEvtHndld && gesture.event._ljEvtHndld !== this) return; // check if some inner layer has already dealt with the gesture/event
    gesture.event._ljEvtHndld = this;
    if (this.currentFrame === null) { //this actually shouldn't happen as null frames don't have a DOM element that could receive a gesture. However it happens when the gesture still continues from before the transition. Still we can't do anything here as we can't define neighbors for null frames (maybe later)
      return;
    }
    var layerTransform = this._transformer.scrollGestureListener(gesture);

    if (gesture.first) {
      return;
    }
    if (gesture.event.type === 'wheel') {
      gesture.preventDefault = true; // set this as default. It's imporant as on macbooks horizonztal swipe gestures are used as history "Forward" / "Backward" which needs to be prevented. Only if we detect a potential native scrolling then we set it to false afterwards.
    }
    if (layerTransform === true) {
      // native scrolling possible
      gesture.preventDefault = false;
      return;
    } else if (layerTransform) {
      this.setLayerTransform(this.currentTransform = layerTransform);
      this.trigger('scrolled');
      // console.log("gestureListener: transformscrolling, prevented default");
      gesture.preventDefault = true;
    } else {
      if (this.inTransition()) {
        gesture.preventDefault = true; // we need to differentiate here later as we may have to check up stream handlers
        // console.log("gestureListener: intransform, prevented default");
      }
      // gesture.cancelled = true;
      var neighbors = this.currentFrame.neighbors();
      if (gesture.direction) {
        if (neighbors && neighbors[defaults.directions2neighbors[gesture.direction]]) {
          gesture.preventDefault = true;
          // console.log("gestureListener: directional gesture, prevented default");
          if (!this.inTransition() && (gesture.last || (gesture.wheel && gesture.enoughDistance()))) {
            var framename = neighbors[defaults.directions2neighbors[gesture.direction]];
            if (framename.match(/^#/)) {
              layerJS.router.navigate(framename);
            } else {
              this.transitionTo(neighbors[defaults.directions2neighbors[gesture.direction]], {
                type: defaults.neighbors2transition[defaults.directions2neighbors[gesture.direction]]
              });
            }
          }
        } else { //jshint ignore:line
          // FIXME: escalate/gesture bubbling ; ignore for now
          gesture.preventDefault = false;
          $.debug(gesture.direction);
          if (neighbors && (neighbors.l || neighbors.r) && (gesture.direction === 'left' || gesture.direction === 'right')) gesture.preventDefault = true; // bad hack, but there is an aggressive "back/forward" functionality on left / right swipe at least on mac computers that will impact UX severely
        }
      } else { //jshint ignore:line
        // this will prevent any bubbling for small movements
        gesture.event.stopPropagation();
        gesture.preventDefault = true;
        //console.log("gestureListener: bubble preventer, prevented default");
      }
    }
  },
  /**
   * simply returns the dimensions of the stage unless the layout defines this function as well and needs special treatments.
   * used by frame.calculateTransformData
   * @param {Frame} frame the frame for which the dimensions are needed
   */
  getStageDimensions(frame) {
    if (this._layout && this._layout.getStageDimensions) {
      return this._layout.getStageDimensions(frame);
    }
    if (this.parent) {
      return {
        width: this.parent.width(),
        height: this.parent.height()
      };
    }
  },
  /**
   * show current frame immidiately without transition/animation
   *
   * @param {string} framename - the frame to be active
   * @param {Object} scrollData - information about the scroll position to be set. Note: this is a subset of a
   * transition object where only startPosition, scrollX and scrollY is considered
   * @returns {Kern.Promise} a promise fullfilled after the show frame has finished.
   */
  showFrame: function(framename, scrollData) {
    if (!this.stage) {
      return;
    }

    scrollData = Kern._extend({
      scrollX: 0,
      scrollY: 0,
      lastFrameName: (this.currentFrame && this.currentFrame.name()) || defaults.specialFrames.none,
      applyTargetPrePosition: false,
      applyCurrentPostPosition: this.currentFrame ? framename !== this.currentFrame.name() && framename !== defaults.specialFrames.current : false,
      applyCurrentPrePosition: false,
      duration: '',
      type: 'none'
    }, scrollData || {});

    return this.transitionTo(framename, scrollData);
  },
  noFrameTransformdata: function(transitionStartPosition) {
    if (this._noframetd && this._noframetd.startPosition === transitionStartPosition) return this._noframetd;
    var d = this._noframetd = {};
    d.scale = 1;

    d.width = this.stage ? this.stage.width() : 0;
    d.height = this.stage ? this.stage.height() : 0;
    d.frameWidth = 0;
    d.frameHeight = 0;

    var fitTo = this.fitTo();
    switch (fitTo) {
      case 'width':
      case 'elastic-width':
      case 'responsive-width':
        d.frameWidth = d.width;
        break;
      case 'height':
      case 'elastic-height':
      case 'responsive-height':
        d.frameHeight = d.height;
        break;
      case 'fixed':
      case 'responsive':
      case 'contain':
      case 'cover':
        d.frameWidth = d.width;
        d.frameHeight = d.height;
        break;
      default:
        throw "unkown fitTo type '" + fitTo + "'";
    }

    if (this.stage && this.stage.autoHeight()) {
      d.height = d.frameHeight = 0;
    }

    if (this.stage && this.stage.autoWidth()) {
      d.width = d.frameWidth = 0;
    }

    d.shiftX = d.shiftY = d.scrollX = d.scrollY = 0;
    d.isScrollX = d.isScrollY = false;
    d.startPosition = transitionStartPosition || 'top';
    d.initialScrollX = d.scrollX;
    d.initialScrollY = d.scrollY;

    return d;
  },
  /**
   * transform to a given frame in this layer with given transition
   *
   * @param {string} [framename] - (optional) frame name to transition to
   * @param {Object} [transition] - (optional) transition object
   * @returns {Kern.Promise} a promise fullfilled after the transition finished. Note: if you start another transition before the first one finished, this promise will not be resolved.
   */
  transitionTo: function(framename, transition) {
    var that = this;
    transition = transition || {};
    // is framename  omitted?
    if (typeof framename === 'object' && null !== framename) {
      transition = framename;
      framename = transition.framename;
    } else if (null !== framename) {
      framename = framename || (transition && transition.framename);
    }

    var newGroupId = transition.groupId || (transition.groupId = $.uniqueID('group'));
    var addToQueue = this.lastgroupId !== newGroupId;
    this.lastgroupId = newGroupId;

    if (transition.delay) { // handle delayed transition
      if (transition.semaphore) transition.semaphore.skip();
      setTimeout(function() {
        if (transition.groupId !== that.lastgroupId) return; // skip if there was another transition triggered in between
        delete transition.semaphore;
        delete transition.delay;
        delete transition.transitionID;
        that.transitionTo(framename, transition); // trigger transition
      }, $.timeToMS(transition.delay));
      return;
    }


    var transitionFunction = function() {
      if (!framename && null !== framename) throw "transformTo: no frame given";
      // lookup frame by framename
      var frame = framename ? that._getFrame(framename, transition) : null;

      if (!frame && null !== frame) throw "transformTo: " + framename + " does not exist in layer";

      if (frame && null !== frame) {
        framename = frame.name();
      }
      // dealing with transition.type

      // autotransitions are transition types automatically generated e.g. by swipe gestures. They are "suggested" and hence have to be dealt with lower priority
      var autotransition;
      if (transition && transition.type && transition.type.match(/^auto:/)) {
        autotransition = transition.type.replace(/^auto:/, '');
        delete transition.type; // needs to be removed for now; othervise if will overwrite default transitions which is not desired for auto transitions
      }
      // merge defaults with given transition records; transition.type will overwrite default transitions (unless auto transition)
      transition = Kern._extend({
        type: transition && transition.type ? 'default' : (frame && frame.defaultTransition()) || that.defaultTransition() || autotransition || 'default',
        previousType: transition && transition.type ? undefined : (that.currentFrame && that.currentFrame.defaultTransition()) || undefined,
        duration: defaults.defaultDuration,
        lastFrameName: (that.currentFrame && that.currentFrame.name()) || defaults.specialFrames.none,
        frame: frame,
        framename: framename,
        applyTargetPrePosition: !transition.noActivation && (transition.applyTargetPrePosition || (frame && frame.parent && frame.parent === that)) || false, // we need to set this here for interstage transitions; loadframe doesn't know about the transition record.
        interStage: frame && frame.parent && frame.parent !== that,
        applyCurrentPostPosition: ((transition.applyCurrentPostPosition !== true && (that.currentFrame && that.currentFrame.parent && that.currentFrame.parent === that)) && !transition.noActivation) || false,
        applyCurrentPrePosition: ((transition.applyCurrentPrePosition !== true && (that.currentFrame && that.currentFrame.parent && that.currentFrame.parent === that)) && !transition.noActivation) || false
        // FIXME: add more default values like timing
      }, transition || {});

      // check for reverse transition; remove "r:"/"reverse:" indicator and set transition.reverse instead
      if (transition.type && transition.type.match(/^(?:r:|reverse:)/i)) {
        transition.type = transition.type.replace(/^(?:r:|reverse:)/i, '');
        transition.reverse = true;
      }
      if (transition.previousType && transition.previousType.match(/^(?:r:|reverse:)/i)) {
        transition.previousType = transition.previousType.replace(/^(?:r:|reverse:)/i, '');
        transition.previousReverse = true;
      }

      // create a dummy semaphore if there isn't any
      if (!transition.semaphore) {
        transition.semaphore = (new Kern.Semaphore()).register();
      }
      // add listener to the sempahore to get the moment the animation really startsWith
      transition.semaphore.listen(true).then(function(num) {
        if (num > 0 && (transition.applyTargetPrePosition !== false || transition.interStage)) that.trigger('transitionPrepared'); // notify listeners about prepared state. (unless all have skipped, e.g. delayed transitions)
      });
      transition.semaphore.listen().then(function() {
        that.updateClasses(); // update classes;
        that.transitionQueue.continue(); // allow processing of next transition from queue
      });


      if (that.inTransition()) transition.wasInTransition = true;
      transition.duration = Math.max(that.getRemainingTransitionTime() || 0, $.timeToMS(transition.duration) || 0) + 'ms';
      if (transition.duration === '0ms') transition.duration = '';
      that.trigger('beforeTransition', framename);
      transition.transitionID = that.transitionID = ++that._transitionIDcounter; // inc transition ID and save new ID into transition record; keep exiting transitionID if existing (delayed transitions)
      that.inTransition(true, transition);

      $.debug('running new transition', transition.transitionID, transition, framename, that.id());

      // make sure frame is there such that we can calculate dimensions and transform data
      return that._layout.loadFrame(frame).then(function() {
        // calculate the layer transform for the target frame. Note: that will automatically consider native scrolling
        // getScrollIntermediateTransform will not change the current native scroll position but will calculate
        // a compensatory transform for the target scroll position.
        var currentScroll = that.getCurrentScroll(); // get current scroll position before recalculating it for that frame
        var targetFrameTransformData = transition.targetFrameTransformData = null === frame ? that.noFrameTransformdata(transition.startPosition) : frame.getTransformData(that, transition.startPosition);
        if (transition.scrollElement) that.resolveScrollElement(transition, targetFrameTransformData); // if scrollElement is given calculate actual scrollX, scrollY from it
        var targetTransform = that._transformer.getScrollTransform(targetFrameTransformData, transition, true);


        // check if transition goes to exactly the same position
        if (that.currentFrame === frame && that.currentFrameTransformData === targetFrameTransformData) {

          if (targetFrameTransformData.scrollX !== currentScroll.scrollX || targetFrameTransformData.scrollY !== currentScroll.scrollY) {
            // just do a scroll using a transition
            transition = Kern._extend(transition, {
              applyTargetPrePosition: false,
              applyCurrentPostPosition: false,
              applyCurrentPrePosition: false,
              scrollX: targetFrameTransformData.scrollX,
              scrollY: targetFrameTransformData.scrollY,
              type: 'none'
            });
          } else {

            var p = new Kern.Promise();
            that.trigger('transitionStarted', framename, transition);
            transition.semaphore.sync().then(function() {

              if (!transition.wasInTransition) {
                that.trigger('transitionFinished', framename);
                that.inTransition(false);
              }
              p.resolve();
            });

            return p;
          }
        }
        if (frame) frame.inTransition = true;
        var layoutPromise = that._layout.transitionTo(frame, transition, targetFrameTransformData, targetTransform).then(function() {
          that._transitionEnd(transition);
        });

        if (!transition.noActivation) { // setup variables to new active frame
          that.currentFrameTransformData = targetFrameTransformData;
          that.currentFrame = frame;
          that.currentTransform = targetTransform;
        }
        that.trigger('transitionStarted', framename, transition);

        return layoutPromise;
      });

    };

    if (addToQueue) {
      return this.transitionQueue.add(transition.isEvent && 'event').then(function() {
        try {
          return transitionFunction();
        } catch (e) {
          that.transitionQueue.continue();
          throw e;
        }
      });
    } else { // if more than one transition should happen per layer in a group we can't queue (because the sync would hang). This can happen when we go back in history and a interstage transition is reversed (via non-activating transition) and at the same time a regular transition must take place.
      return transitionFunction();
    }
  },
  /**
   * Needs to be invoked when the transition is done or ended
   *
   * @param {Object} [transition] - transition object
   */
  _transitionEnd: function(transition) {
    // is that still the active transition?
    var that = this;
    if (transition.transitionID === this.transitionID) {
      $.debug('transition finished', transition.transitionID);
      if (!transition.noActivation) {
        // that will now calculate the currect layer transform and set up scroll positions in native scroll
        this.currentTransform = this._transformer.getScrollTransform(transition.targetFrameTransformData || {}, transition, false);
        // apply new transform (will be 0,0 in case of native scrolling)
      }
      this.inTransition(false);
      if (!transition.noActivation) {
        this.setLayerTransform(this.currentTransform);
      }
      this.updateClasses();
      if (transition.frame) transition.frame.inTransition = false;
      $.postAnimationFrame(function() {
        that.trigger('transitionFinished', transition.framename);
      });
    }
  },
  /**
   * Will get a frame based on the framename. Special names will be resolved.
   *
   * @param {string} [framename] - frame name
   * @param {Object} [transition] - (optional) transition object
   * @returns {Object} a frame
   */
  _getFrame: function(frameName, transition) {
    if (frameName === defaults.specialFrames.left || frameName === defaults.specialFrames.right || frameName === defaults.specialFrames.top || frameName === defaults.specialFrames.bottom) {

      if (null !== this.currentFrame) {
        var neighbors = this.currentFrame.neighbors();
        transition = transition || {};

        if (neighbors && neighbors.l && frameName === defaults.specialFrames.left) {
          frameName = neighbors.l;
        } else if (neighbors && neighbors.r && frameName === defaults.specialFrames.right) {
          frameName = neighbors.r;
        } else if (neighbors && neighbors.t && frameName === defaults.specialFrames.top) {
          frameName = neighbors.t;
        } else if (neighbors && neighbors.b && frameName === defaults.specialFrames.bottom) {
          frameName = neighbors.b;
        } else if (transition.type === defaults.neighbors2transition.r && frameName === defaults.specialFrames.left && ((neighbors && !neighbors.l) || !neighbors)) {
          frameName = defaults.specialFrames.next;
        } else if (transition.type === defaults.neighbors2transition.l && frameName === defaults.specialFrames.right && ((neighbors && !neighbors.r) || !neighbors)) {
          frameName = defaults.specialFrames.previous;
        } else if (transition.type === defaults.neighbors2transition.b && frameName === defaults.specialFrames.bottom && ((neighbors && !neighbors.u) || !neighbors)) {
          frameName = defaults.specialFrames.previous;
        } else if (transition.type === defaults.neighbors2transition.u && frameName === defaults.specialFrames.top && ((neighbors && !neighbors.b) || !neighbors)) {
          frameName = defaults.specialFrames.next;
        } else if (!neighbors) {
          frameName = defaults.specialFrames.next;
        }
      } else if (null === this.currentFrame) {
        if (frameName !== defaults.specialFrames.previous) {
          frameName = defaults.specialFrames.next;
        } else if (frameName !== defaults.specialFrames.next) {
          frameName = defaults.specialFrames.previous;
        }
      }
    }
    if (frameName === defaults.specialFrames.toggle) {
      if (null === this.currentFrame) {
        frameName = defaults.specialFrames.next;
      } else {
        frameName = defaults.specialFrames.none;
      }
    }
    if (frameName === defaults.specialFrames.next) {
      frameName = this._getNextFrameName();
    } else if (frameName === defaults.specialFrames.previous) {
      frameName = this._getPreviousFrameName();
    } else if (frameName === defaults.specialFrames.current) {
      frameName = null !== this.currentFrame ? this.currentFrame.name() : defaults.specialFrames.none;
    }

    var frameView;
    if (frameName === defaults.specialFrames.none) {
      frameView = null;
    } else {
      frameView = this.getChildViewByName(frameName);

      if (undefined === frameView && undefined !== frameName) {
        var paths = layerJS.getState().resolvePath(frameName);

        if (paths.length > 1) throw 'only 1 path should be expected';
        if (paths.length > 0) {
          frameView = paths[0].view;
        }
      }
    }

    return frameView;
  },
  /**
   * Will get the next framename based on the html order
   *
   * @returns {string} a framename
   */
  _getNextFrameName: function() {
    var frameName;
    var childViews = this.getChildViews();

    if (null === this.currentFrame && childViews.length > 0) {
      frameName = childViews[0].name();
    } else if (null !== this.currentFrame && childViews.length > 0) {
      var index = 0;
      for (; index < childViews.length; index++) {
        if (this.currentFrame.name() === childViews[index].name()) {
          break;
        }
      }
      if (index + 1 < childViews.length) {
        frameName = childViews[index + 1].name();
      } else {
        frameName = childViews[0].name();
      }
    }

    return frameName;
  },
  /**
   * Will get the previous framename based on the html order
   *
   * @returns {string} a framename
   */
  _getPreviousFrameName: function() {
    var frameName;
    var childViews = this.getChildViews();

    if (null === this.currentFrame && childViews.length > 0) {
      frameName = childViews[0].name();
    } else if (null !== this.currentFrame && childViews.length > 0) {
      var index = childViews.length - 1;
      for (; index >= 0; index--) {
        if (this.currentFrame.name() === childViews[index].name()) {
          break;
        }
      }
      if (index === 0) {
        frameName = childViews[childViews.length - 1].name();
      } else if (index > 0) {
        frameName = childViews[index - 1].name();
      }
    }

    return frameName;
  },
  getCurrentTransform: function() {
    return this.currentTransform;
  },
  /**
   * updates HTML classes for frames during transition or showFrame
   *
   * @param {Type} Name - Description
   * @returns {Type} Description
   */
  updateClasses: function() {
    var childViews = this.getChildViews();
    var length = childViews.length;
    for (var i = 0; i < length; i++) {
      $.removeClass(childViews[i].outerEl, 'lj-active');
      $.removeClass(childViews[i].outerEl, 'lj-transition');
    }
    if (null !== this.currentFrame) {
      $.addClass(this.currentFrame.outerEl, 'lj-active');
    }
    for (i = 0; i < arguments.length; i++) {
      if (arguments[i] && arguments[i].outerEl) {
        $.addClass(arguments[i].outerEl, 'lj-transition');
      }
    }
  },
  /**
   * render child positions. overriden default behavior of groupview
   *
   * @param {ElementView} childView - the child view that has changed
   * @returns {Type} Description
   */
  _renderChildPosition: function(childView) {
    if (!this._layout) {
      this.switchLayout(this.layoutType());
    }

    childView.unobserve();
    this._layout.renderFramePosition(childView, this.currentTransform);
    childView.startObserving();
  },
  /**
   * Method will render the layer
   */
  render: function() {
    var childViews = this.getChildViews();
    var length = childViews.length;
    var scrollData = this.currentFrame !== null ? this.currentFrame.getScrollData() : {};
    scrollData.isEvent = true;

    for (var i = 0; i < length; i++) {
      var childView = childViews[i];
      if (undefined !== childView.transformData) {
        childView.transformData.isDirty = true;
      }
    }

    this.showFrame(defaults.specialFrames.current, scrollData);
  },
  /**
   * Will parse the current DOM Element it's children.
   * @param {object} options - optional: includes addedNodes
   */
  _parseChildren: function(options) {

    BaseView.prototype._parseChildren.call(this, options);

    var childrenViews = this._cache.children;
    var that = this;

    if (options && options.removedNodes && options.removedNodes.length > 0) {
      options.removedNodes.forEach(function(removedNode) {
        if (removedNode._ljView) {
          removedNode._ljView.off('renderRequired', undefined, that);
        }
      });
    }


    if (options && options.addedNodes && options.addedNodes.length > 0) {
      childrenViews = [];
      for (var i = 0; i < options.addedNodes.length; i++) {
        if (options.addedNodes[i]._ljView) {
          childrenViews.push(options.addedNodes[i]._ljView);
        }
      }
    }


    var renderRequiredEventHandler = function(name) {
      if (that.currentFrame && null !== that.currentFrame && that.currentFrame.name() === name) {
        that._renderChildPosition(that._cache.childNames[name]);
        that.render();
      }
    };

    for (var y = 0; y < childrenViews.length; y++) {
      childrenViews[y].on('renderRequired', renderRequiredEventHandler, {
        context: this
      });
    }
  }
}, {
    defaultProperties: {
      type: 'layer'
    },
    identify: function(element) {
      var type = $.getAttributeLJ(element, 'type');
      return null !== type && type.toLowerCase() === LayerView.defaultProperties.type;
    }
  });

pluginManager.registerType('layer', LayerView, defaults.identifyPriority.normal);

module.exports = LayerView;

},{"../kern/Kern.js":31,"./baseview.js":1,"./defaults.js":2,"./domhelpers.js":3,"./gestures/gesturemanager.js":6,"./layerjs.js":7,"./layoutmanager.js":9,"./pluginmanager.js":21,"./scrolltransformer.js":27}],9:[function(require,module,exports){
'use strict';
var layerJS = require('./layerjs.js');
var Kern = require('../kern/Kern.js');

var LayoutManager = Kern.EventManager.extend({
  /**
   * create a LayoutManager
   * the LayoutManager is used to provide Layer layout function for specified layout types.
   * It can be dynamically extended by further layout types.
   *
   * @param {Object} map - a mapping from type to Function
   * @returns {This}
   */
  constructor: function(map) {
    Kern.EventManager.call(this);
    this.map = map || {}; // maps ObjData types to View constructors
  },
  /**
   * register a new layout function
   *
   * @param {string} type - the layout type as given in the layer data model
   * @param {LayerLayout} fn - the layout engine
   * @returns {Type} Description
   */
  registerType: function(type, layouter) {
    this.map[type] = layouter;
  },
  /**
   * return the layout function for a given layout type
   *
   * @param {string} type - the layout type
   * @returns {LayerLayout} the layout engine
   */
  get: function(type){
    return this.map[type];
  }
});
// initialialize layoutManager with default plugins
layerJS.layoutManager = new LayoutManager();
// this module does not return the class but a singleton instance, the layoutManager for the project.
module.exports = layerJS.layoutManager;

},{"../kern/Kern.js":31,"./layerjs.js":7}],10:[function(require,module,exports){
'use strict';
var $ = require('../domhelpers.js');
var Kern = require('../../kern/Kern.js');
var layoutManager = require('../layoutmanager.js');
var LayerLayout = require('./layerlayout.js');

var CanvasLayout = LayerLayout.extend({
  /**
   * initalize CanvasLayout with a layer
   *
   * @param {Type} Name - Description
   * @returns {Type} Description
   */
  constructor: function(layer) {
    LayerLayout.call(this, layer);
    this._frameTransforms = {};
  },
  /**
   * transform to a given frame in this layer with given transition
   *
   * @param {FrameView} frame - frame to transition to
   * @param {Object} transition - transition object
   * @param {Object} targetFrameTransformData - the transformData object of the target frame
   * @param {string} targetTransform - transform representing the scrolling after transition
   * @returns {Kern.Promise} a promise fullfilled after the transition finished. Note: if you start another transtion before the first one finished, this promise will not be resolved.
   */
  transitionTo: function(frame, transition, targetFrameTransformData, targetTransform) {
    var finished = new Kern.Promise();
    var that = this;

    var frames = this.layer.getChildViews();
    var framesLength = frames.length;
    var childFrame;

    var transformFrame = function(childFrame, duration) {
      var tfd = childFrame.getTransformData(that.layer); // this will NOT initialize dimensions for the frame; we need to check if we have to set them
      var otherCss = {
        transition: duration !== undefined ? duration : transition.duration,
        opacity: 1,
        display: 'block'
      };

      otherCss.width = tfd.applyWidth ? (tfd.frameWidth - tfd.margin.left - tfd.margin.right) + 'px' : tfd.frameOriginalWidth;
      otherCss.height = tfd.applyHeight ? (tfd.frameHeight - tfd.margin.top - tfd.margin.bottom) + 'px' : tfd.frameOriginalHeight;

      that._applyTransform(childFrame, that._reverseTransform, targetTransform, otherCss);
    };

    var currentFrame = that.layer.currentFrame;
    if (currentFrame && currentFrame.transformData.isDirty) { // we need to do a transition to current frame first if current frame isDirty. This may happen if the whole canvas layer was hidden before
      // now apply all transforms to all frames
      that._reverseTransform = that._calculateReverseTransform(currentFrame, currentFrame.getTransformData(that.layer, undefined, true));
      for (var i = 0; i < framesLength; i++) {
        transformFrame(frames[i],'none');
      }
      //force reflow;
      var reflowed = false;
      for (i = 0; i < framesLength; i++) {
        if (window.getComputedStyle(frames[i].outerEl).transform) {
          reflowed = true;
        }
      }


    }
    // we only listen to the transitionend of the target frame and hope that's fine
    // NOTE: other frame transitions may end closely afterwards and setting transition time to 0 will let
    // them jump to the final positions (hopefully jump will not be visible)

    // NOTE: Maybe this is a solution for not stopping the transitions
    var lastFrameToTransition = transition.noActivation ? frame : frames[framesLength - 1];

    var transitionEnd = function() {
      if (transition.transitionID === that.layer.transitionID) {
        for (var i = 0; i < (transition.noActivation ? 1 : framesLength); i++) {
          childFrame = transition.noActivation ? frame : frames[i];
          // console.log("canvaslayout transition off", transition.transitionID);
          childFrame.applyStyles({
            transition: 'none' // deactivate transitions for all frames
          });
        }
      }
      finished.resolve();
    };

    if (transition.duration !== '') {
      lastFrameToTransition.outerEl.addEventListener("transitionend", function f(e) { // FIXME needs webkitTransitionEnd etc
        if (lastFrameToTransition.outerEl === e.target) {
          e.target.removeEventListener(e.type, f); // remove event listener for transitionEnd.
          // console.log("canvaslayout transitionend", transition.transitionID);
          transitionEnd();
        }
      });
    }
    // wait for semaphore as there may be more transitions that need to be setup
    transition.semaphore.sync().then(function() {

      if (null !== frame) {

        if (transition.noActivation) {
          transformFrame(frame);
        } else {
          // now apply all transforms to all frames
          that._reverseTransform = that._calculateReverseTransform(frame, targetFrameTransformData);
          for (var i = 0; i < framesLength; i++) {
            transformFrame(frames[i]);
          }
        }
      } else {
        for (var x = 0; x < framesLength; x++) {
          childFrame = frames[x];
          childFrame.applyStyles({
            opacity: 0,
            transition: transition.duration
          });
        }
      }

      if (transition.duration === '') {
        transitionEnd();
      }
    });

    return finished;
  },
  /**
   * calculate the transform that transforms a frame into the stage (almost the inverse transform to the actual frame transform)
   *
   * @returns {string} the calculated transform
   */
  _calculateReverseTransform: function(frame, targetFrameTransformData) {
    var targetFrameX = (parseInt(frame.x(), 10) || 0);
    var targetFrameY = (parseInt(frame.y(), 10) || 0);

    // this block will make sure that the difference between the current rotation of the canvas and the new rotation is <=180° (so the animation will not rotate the long way)
    var rotation = frame.rotation() || 0;
    if (this._currentRotation) {
      if (rotation > this._currentRotation + 180) {
        rotation -= 360 * (1 + Math.floor((rotation - this._currentRotation) / 360));
      }
      if (rotation < this._currentRotation - 180) {
        rotation += 360 * (1 + Math.floor((this._currentRotation - rotation) / 360));
      }
    }
    this._currentRotation = rotation;

    var transform = "translate3d(" + parseInt(-targetFrameTransformData.shiftX, 10) + "px," + parseInt(-targetFrameTransformData.shiftY, 10) + "px,0px) scale(" + targetFrameTransformData.scale / (frame.scaleX() || 1) + "," + targetFrameTransformData.scale / (frame.scaleY() || 1) + ") rotate(" + (-rotation || 0) + "deg)  translate3d(" + (-targetFrameX) + "px," + (-targetFrameY) + "px,0px)";
    return transform;
  },
  /**
   * apply new scrolling transform to layer
   *
   * @param {string} transform - the scrolling transform
   * @param {Object} cssTransiton - css object containing the transition info (currently only single time -> transition: 2s)
   */
  setLayerTransform: function(transform, cssTransition) {
    var frames = this.layer.getChildViews();
    var framesLength = frames.length;
    var childFrame;
    var p = new Kern.Promise();
    if (cssTransition.transition) { // FIXME is this sufficient? should we rather pipe duration here, but what about other transtion properties like easing
      this.layer.currentFrame.outerEl.addEventListener("transitionend", function f(e) { // FIXME needs webkitTransitionEnd etc
        e.target.removeEventListener(e.type, f); // remove event listener for transitionEnd.
        p.resolve();
      });
    } else {
      p.resolve();
    }
    // console.log('canvaslayout: setLayerTransform');
    // now apply all transforms to all frames
    for (var i = 0; i < framesLength; i++) {
      childFrame = frames[i];
      this._applyTransform(childFrame, this._reverseTransform, transform, cssTransition);
    }
    return p;
  },
  /**
   * this functions puts a frame at its default position. It's called by layer's render() renderChildPosition()
   * and and will also react to changes in the child frames
   *
   * @param {FrameView} frame - the frame to be positioned
   * @returns {void}
   */
  renderFramePosition: function(frame, transform) {
    LayerLayout.prototype.renderFramePosition.call(this, frame, transform);
    delete this._frameTransforms[frame.id()]; // this will be recalculated in _applyTransform
    if (this._reverseTransform && transform) {
      // currentFrame is initialized -> we need to render the frame at new position
      this._applyTransform(frame, this._reverseTransform, this.layer.currentTransform, {});
    }
    //}
  },
  /**
   * apply transform by combining the frame transform with the reverse transform and the added scroll transform
   *
   * @param {FrameView} frame - the frame that should be transformed
   * @param {Object} baseTransform - a plain object containing the styles for the frame transform
   * @param {String} addedTransform - a string to be added to the "transform" style which represents the scroll transform
   * @param {Object} styles - additional styles for example for transition timing.
   * @returns {void}
   */
  _applyTransform: function(frame, reverseTransform, addedTransform, styles) {
    // console.log('canvaslayout: applystyles', frame.data.attributes.name, styles.transition);
    // we need to add the frame transform (x,y,rot,scale) the reverse transform (that moves the current frame into the stage) and the transform representing the current scroll/displacement
    styles = styles || {};
    var x = frame.x();
    var y = frame.y();
    if (x !== undefined) styles.left = $.parseDimension(x) + 'px';
    if (y !== undefined) styles.top = $.parseDimension(y) + 'px';
    frame.applyStyles(styles || {}, {
      transform: "translate3d(" + (-frame.x() || 0) + "px," + (-frame.y() || 0) + "px,0px)" + addedTransform + " " + reverseTransform + " " + (this._frameTransforms[frame.id()] = "translate3d(" + (frame.x() || 0) + "px," + (frame.y() || 0) + "px,0px) rotate(" + (frame.rotation() || 0) + "deg) scale(" + frame.scaleX() + "," + frame.scaleY() + ")")
    });
  },
});

layoutManager.registerType('canvas', CanvasLayout);

module.exports = CanvasLayout;

},{"../../kern/Kern.js":31,"../domhelpers.js":3,"../layoutmanager.js":9,"./layerlayout.js":11}],11:[function(require,module,exports){
'use strict';
var $ = require('../domhelpers.js');
var Kern = require('../../kern/Kern.js');
var TMat = require('../tmat.js');

/**
 * this is the base class for all LayerLayouts
 *
 */
var LayerLayout = Kern.EventManager.extend({
  /**
   * initalize LayerLayout with a layer
   *
   * @param {LayerView} layer - the layer to which this layout belongs
   * @returns {Type} Description
   */
  constructor: function(layer) {
    Kern.EventManager.call(this);
    if (!layer) throw "provide a layer";
    this.layer = layer;
  },
  /**
   * this functions puts a frame at its default position
   *
   * @param {FrameView} frame - the frame to be positioned
   * @returns {void}
   */
  renderFramePosition: function(frame) {
    // we need to initialize positions and dimensions, if they are defined through attributes
    frame.x();
    frame.y();
    frame.width();
    frame.height();
  },
  /**
   * make sure frame is rendered (i.e. has display: block)
   * Later: make sure frame is loaded and added to document
   * FIXME: should that go into layout?
   *
   * @param {Type} Name - Description
   * @returns {Type} Description
   */
  loadFrame: function(frame) {
    var finished = new Kern.Promise();
    var computedStyle = (null !== frame && frame.document.defaultView && frame.document.defaultView.getComputedStyle) || function(el) {
      return el.style;
    };
    if (frame === null || (frame.document.body.contains(frame.outerEl) && computedStyle(frame.outerEl).display !== 'none' && frame.parent === this.layer)) {
      finished.resolve();
    } else {

      // frame not in the layer
      if (frame.parent !== this.layer) {
        var targetElement = this.layer.outerEl;
        var commonParent = $.commonParent(frame.innerEl, targetElement);

        var calculateMatrix = function(element, stopElement) {
          var parentMatrix = new TMat();

          if (element !== stopElement) {
            parentMatrix = calculateMatrix(element.parentNode, stopElement);
          }

          var elementMatrix = $.getScaleAndRotationMatrix(element);
          var result = parentMatrix.prod(elementMatrix);
          return result;
        };

        var frameMatrix = calculateMatrix(frame.outerEl, commonParent);
        frameMatrix = $.applyTopLeftOnMatrix(frame.outerEl, frameMatrix);

        var targetLayerMatrix = calculateMatrix(targetElement, commonParent);
        targetLayerMatrix = $.applyTopLeftOnMatrix(targetElement, targetLayerMatrix);

        var resultMatrix = targetLayerMatrix.invert().prod(frameMatrix);
        var that = this;

        //frame.parent.innerEl.removeChild(frame.outerEl);
        if (frame.parent.currentFrame === frame) {
          frame.parent.currentFrame = null;
        }

        that.layer.innerEl.appendChild(frame.outerEl);
        frame.transformData = undefined;

        // reset top and left to 0 (important when doing an interstage from canva to slidelayout)
        frame.applyStyles({
          transform: resultMatrix.transform_nomatrix(),
          top: '0px',
          left: '0px'
        });
        $.debug("moved " + frame.id() + " to layer " + this.layer.id());
        // wait until rendered;
        $.postAnimationFrame(function() {
          finished.resolve();
        });

      } else {
        // FIXME: add to dom if not in dom
        // set display block
        frame.outerEl.style.display = 'block';
        // frame should not be visible; opacity is the best as "visibility" can be reverted by nested elements
        frame.outerEl.style.opacity = '0';

        // wait until rendered; NOTE: we don't need that. the next time we read any dimensions from frames the will cause a reflow and we have the displayed element
        //$.postAnimationFrame(function() {
          finished.resolve();
        //});
      }


    }
    return finished;
  },
  /**
   * get the width of associated stage. Use this method in sub classes to be compatible with changing interfaces in layer/stage
   *
   * @returns {number} the width
   */
  getStageWidth: function() {
    return this.layer.stage.width();
  },
  /**
   * get the height of associated stage. Use this method in sub classes to be compatible with changing interfaces in layer/stage
   *
   * @returns {number} the height
   */
  getStageHeight: function() {
    return this.layer.stage.height();
  },
  transitionTo: function() {
    throw "transitionTo() not implemented";
  },
  // jshint ignore:start
  prepareTransition: function() {},
  // jshint ignore:end
  parametricTransition: function() {
    throw "parametricTransition() not implemented";
  },
  getScrollTransformer: function() {
    return undefined;
  }
});

module.exports = LayerLayout;

},{"../../kern/Kern.js":31,"../domhelpers.js":3,"../tmat.js":30}],12:[function(require,module,exports){
'use strict';
var $ = require('../domhelpers.js');
var Kern = require('../../kern/Kern.js');
var layoutManager = require('../layoutmanager.js');
var LayerLayout = require('./layerlayout.js');

// partials
// define data for pre position / css of new frame (for in transition ) or post position / css of old frame
// ['adjacent',x,y,scale,rotation,css,org_css]
// x,y: position relative to stage (x=-1 left, x=+1 right, y=-1 top, y=+1 bottom), can be scaled (values <>1) and combined
// scale, rotation: only for the pre target frame or post current frame
// css: additional css parameters (e.g. opacity, clip) for the pre target frame or post current frame
// org_css: additional css parameters (e.g. opacity, clip) for the post target frame or pre current frame
var partials = {
  none: ["adjacent", 0, 0, 1, 0],
  left: ["adjacent", -1, 0, 1, 0],
  right: ["adjacent", 1, 0, 1, 0],
  bottom: ["adjacent", 0, 1, 1, 0],
  top: ["adjacent", 0, -1, 1, 0],
  fade: ["adjacent", 0, 0, 1, 0, {
    opacity: 0
  }],
  blur: ["adjacent", 0, 0, 1, 0, {
    filter: 'blur(5px)',
    opacity: 0
  }, {
    filter: 'blur(0px)'
  }],
  zoomout: ["adjacent", 0, 0, 0.666, 0, {
    opacity: 0
  }],
  zoomin: ["adjacent", 0, 0, 1.5, 0, {
    opacity: 0
  }],

};
// transitions
// the first element is the partial for the targetframe (tin) and the second is the partial for the current frame (tout)
// the third element defines the z direction: 1 - target frame is above current frame, -1 targetframe is below
var transitions = {
  default: [partials.right, partials.left, 1],
  none: [partials.none, partials.none, 1],
  left: [partials.right, partials.left, 1],
  right: [partials.left, partials.right, 1],
  up: [partials.bottom, partials.top, 1],
  down: [partials.top, partials.bottom, 1],
  fade: [partials.fade, partials.fade, -1],
  blur: [partials.blur, partials.blur, -1],
  slideOverLeft: [partials.right, partials.none, 1],
  slideOverRight: [partials.left, partials.none, 1],
  slideOverUp: [partials.bottom, partials.none, 1],
  slideOverDown: [partials.top, partials.none, 1],
  slideOverLeftFade: [partials.right, partials.fade, 1],
  slideOverRightFade: [partials.left, partials.fade, 1],
  slideOverUpFade: [partials.bottom, partials.fade, 1],
  slideOverDownFade: [partials.top, partials.fade, 1],
  zoomout: [partials.zoomin, partials.zoomout, 1],
  zoomin: [partials.zoomout, partials.zoomin, -1],
  inouttop: [partials.top, partials.top, 1],
  inoutleft: [partials.left, partials.left, 1],
  inoutright: [partials.right, partials.right, 1],
  inoutbottom: [partials.bottom, partials.bottom, 1]
};

var SlideLayout = LayerLayout.extend({
  /**
   * initalize SlideLayout with a layer
   *
   * @param {Type} Name - Description
   * @returns {Type} Description
   */
  constructor: function(layer) {
    LayerLayout.call(this, layer);
    this._preparedTransitions = {};
  },
  /**
   * Hides all other frames
   *
   * @param {FrameView} currentFrame - the current active frame
   * @param {FrameView} frame - the frame to activate
   * @returns {void}
   */
  hideOtherFrames: function(currentFrame, frame) {
    var frames = this.layer.getChildViews();

    for (var i = 0; i < frames.length; i++) {

      if (frames[i] !== frame && frames[i] !== currentFrame && null !== frames[i].outerEl.parentNode) {
        frames[i].applyStyles({
          display: 'none'
        });
      }
    }
  },
  /**
   * transform to a given frame in this layer with given transition
   *
   * @param {FrameView} frame - frame to transition to
   * @param {Object} transition - transition object
   * @param {Object} targetFrameTransformData - the transformData object of the target frame
   * @param {string} targetTransform - transform representing the scrolling after transition
   * @returns {Kern.Promise} a promise fullfilled after the transition finished. Note: if you start another transition before the first one finished, this promise will not be resolved.
   */
  transitionTo: function(frame, transition, targetFrameTransformData, targetTransform) {
    var that = this;
    var currentFrame = that.layer.currentFrame;
    return this.prepareTransition(frame, transition, targetFrameTransformData, targetTransform).then(function(t) {
      var finished = new Kern.Promise();
      var transitionEnds = 0; // number of transitions to wait for
      var transitionEnd = function(frame, oldcurrent) {
        if (!frame.transitionID || transition.transitionID === frame.transitionID) {
          frame.applyStyles(t.fix_css, oldcurrent ? {
            transition: 'none',
            display: 'none',
            'z-index': 'initial'
          } : {
            transition: 'none',
            'z-index': 'initial'
          });
          $.debug('slidelayout: fix ' + (oldcurrent ? 'c' : 't'));
        }
        transitionEnds--;
        if (transitionEnds === 0) {
          finished.resolve(); // do we need to wait here until it is rendered?
        }
        // wait until above styles are applied;
        // $.postAnimationFrame(function() {
        //   finished.resolve();
        // });
      };

      // wait for semaphore as there may be more transitions that need to be setup
      transition.semaphore.sync().then(function() {
        var otherCss = {
          transition: transition.duration,
          top: "0px",
          left: "0px",
          opacity: "1",
          width : targetFrameTransformData.frameOriginalWidth,
          height :  targetFrameTransformData.frameOriginalHeight
        };

        if (targetFrameTransformData.applyWidth) {
          otherCss.width = (targetFrameTransformData.frameWidth - targetFrameTransformData.margin.left - targetFrameTransformData.margin.right) + "px";
        }

        if (targetFrameTransformData.applyHeight) {
          otherCss.height = (targetFrameTransformData.frameHeight - targetFrameTransformData.margin.top - targetFrameTransformData.margin.bottom) + "px";
        }

        if (frame) frame.transitionID = transition.transitionID;

        // we need to listen for each frame individually because different frames may be affected by a later (but partially parallel) transition
        if (frame && transition.duration !== '') {
          frame.outerEl.addEventListener("transitionend", function f(e) { // FIXME needs webkitTransitionEnd etc
            if (e.target === frame.outerEl) {
              e.target.removeEventListener(e.type, f); // remove event listener for transitionEnd.
              transitionEnd(frame, !!transition.noActivation);
            }
          });
          transitionEnds++;
        }
        if (transition.noActivation) {
          that._applyTransform(frame, {
            opacity: 0,
            transition: transition.duration,
          }, {}, {});
        } else {
          that._applyTransform(frame, that._currentFrameTransform = t.t1, targetTransform, otherCss);
        }
        $.debug('slidelayout: apply t1');
        if (transition.applyCurrentPostPosition !== false) {
          if (currentFrame) currentFrame.transitionID = transition.transitionID;
          // we need to listen for each frame individually because different frames may be affected by a later (but partially parallel) transition
          if (currentFrame && transition.duration !== '') {
            currentFrame.outerEl.addEventListener("transitionend", function g(e) { // FIXME needs webkitTransitionEnd etc
              if (e.target === currentFrame.outerEl) {
                e.target.removeEventListener(e.type, g); // remove event listener for transitionEnd.
                transitionEnd(currentFrame, true);
              }
            });
            transitionEnds++;
          }
          that._applyTransform(currentFrame, t.c1, targetTransform, {
            transition: transition.duration,
            top: "0px",
            left: "0px"
          });
          $.debug('slidelayout: apply c1');
        }

        if (transition.duration === '') { // execute transitionend immediately if not transition is going on
          transitionEnds = ((currentFrame && currentFrame !== frame) && frame ? 2 : 1);
          if (currentFrame && currentFrame !== frame) {
            transitionEnd(currentFrame, true);
          }
          if (frame) {
            transitionEnd(frame);
          }
        }

        that._preparedTransitions = {};
      });
      return finished;
    });
  },
  /**
   * calculate pre and post transforms for current and target frame
   * needed for swipes
   * make sure targetFrame is at pre position
   *
   * @param {ViewFrame} frame - the target frame
   * @param {Object} transition - transition object
   * @param {Object} targetFrameTransformData - the transformData object of the target frame
   * @param {string} targetTransform - transform represenptg the scrolling after transition
   * @returns {Promise} will fire when pre transform to target frame is applied
   */
  prepareTransition: function(frame, transition, targetFrameTransformData, targetTransform) {
    // create a promise that will wait for the transform being applied
    var finished = new Kern.Promise();
    var prep;
    var currentFrame = this.layer.currentFrame;
    if (!transition.wasInTransition) this.hideOtherFrames(frame, currentFrame);
    if (frame && (prep = this._preparedTransitions[frame.id()])) {
      if (prep.transform === targetTransform && prep.applied) { // if also the targetTransform is already applied we can just conptue
        finished.resolve(prep);
      } else {
        prep = undefined;
      }
    }
    if (!prep) {
      var transitionfn = transitions[transition.type]; // transition function or record
      if (!transitionfn && transition.type && transition.type.match(/\:/)) {
        transitionfn = transition.type.split(':');
      } else if (!transitionfn) {
        transitionfn = [partials.none, partials.none, 1];
      }
      // call the transition type function to calculate all frame positions/transforms
      if (typeof transitionfn === 'function') { // custom transition function
        prep = transitionfn(transition.type, this.layer.currentFrameTransformData, targetFrameTransformData); // WARNING: this.layer.currentFrameTransformData should still be the old one here. careful: this.layer.currentFrameTransformData will be set by LayerView before transition ends!
      } else if (Array.isArray(transitionfn)) { // array of in and out partials
        var shuffled;
        // bringing in and out transitions into right order
        if (transition.reverse) {
          shuffled = [transitionfn[1], transitionfn[0], this.layer.currentFrameTransformData, targetFrameTransformData, (transitionfn[2] && -transitionfn[2]) || 0];
        } else {
          shuffled = [transitionfn[0], transitionfn[1], this.layer.currentFrameTransformData, targetFrameTransformData, transitionfn[2]];
          // WARNING: this.layer.currentFrameTransformData should still be the old one here. careful: this.layer.currentFrameTransformData will be set by LayerView before transition ends!
        }
        // when using default transitions, it may be different for the currentFrame and the targetFrame. So add here the transition for the currentFrame as out transition
        if (transition.previousType) {
          var ptransitionfn = transitions[transition.previousType]; // transition function or record for default transition of currentFrameTransformData
          if (Array.isArray(ptransitionfn)) { // only works if that is an array as well
            shuffled[1] = transition.previousReverse ? ptransitionfn[1] : ptransitionfn[0];
          }
        }
        prep = this.genericTransition.apply(this, shuffled);
      } else {
        throw "slidelayout: error in registered transition type.";
      }
      prep.transform = targetTransform; // FIXME: targetTransform is not enough, need to check current transform as well
      if (transition.applyTargetPrePosition === false && transition.applyCurrentPrePosition === false) { // shortcut if we don't hve to apply pre positions
        finished.resolve(prep);
        return finished;
      }
      if (frame === null && !prep.current_css) { // nothing to do as new frame is "none"
        prep.applied = true;
        finished.resolve(prep);
        return finished;
      }
      var otherCss = {
        transition: 'none',
        visibility: 'inital'
      };
      // apply frame dimensions. this should be the dimensions of the pre position, but in slide layout the pre position should have same frame dimensions as post position. (in all cases where this is not true [sizechanged, interstage, ?] applyTargetPrePosition would be false)
      if (targetFrameTransformData.applyWidth){
         otherCss.width = (targetFrameTransformData.frameWidth - targetFrameTransformData.margin.left - targetFrameTransformData.margin.right) + "px";
       }
       else {
         otherCss.width = targetFrameTransformData.frame.getOriginalWidth() + "px";
       }
      if (targetFrameTransformData.applyHeight) otherCss.height = (targetFrameTransformData.frameHeight - targetFrameTransformData.margin.top - targetFrameTransformData.margin.bottom) + "px";
      if (transition.applyTargetPrePosition !== false) {
        // apply pre position to target frame
        this._applyTransform(frame, prep.t0, this.layer.currentTransform, otherCss);
        $.debug('slidelayout: apply t0');
      }
      // apply pre position to current frame
      if (currentFrame && prep.current_css && transition.applyCurrentPrePosition !== false) {
        this._applyTransform(currentFrame, prep.c0, this.layer.currentTransform, {
          transition: 'none',
          'z-index': 'initial'
        });
        $.debug('slidelayout: apply c0');
      }
      // wait until new positions are rendered then resolve promise
      $.postAnimationFrame(function() {
        prep.applied = true;
        finished.resolve(prep);
      });
    }

    return finished;
  },
  /**
   * apply new scrolling transform to layer
   *
   * @param {string} transform - the scrolling transform
   * @param {Object} cssTransiton - css object containing the transition info (currently only single time -> transition: 2s)
   */
  setLayerTransform: function(transform, cssTransition) {
    cssTransition = cssTransition || {};
    var p = new Kern.Promise();
    if (cssTransition.transition) { // FIXME is this sufficient? should we rather pipe duration here, but what about other transition properties like easing
      this.layer.currentFrame.outerEl.addEventListener("transitionend", function f(e) { // FIXME needs webkitTransitionEnd etc
        e.target.removeEventListener(e.type, f); // remove event listener for transitionEnd.
        p.resolve();
      });
    } else {
      p.resolve();
    }
    this._applyTransform(this.layer.currentFrame, this._currentFrameTransform, transform, cssTransition);
    return p;
  },
  /**
   * apply transform by combining the frames base transform with the added scroll transform
   *
   * @param {FrameView} frame - the frame that should be transformed
   * @param {Object} baseTransform - a plain object containing the styles for the frame transform
   * @param {String} addedTransform - a string to be added to the "transform" style which represents the scroll transform
   * @param {Object} styles - additional styles for example for transition timing.
   * @returns {void}
   */
  _applyTransform: function(frame, frameTransform, addedTransform, styles) {
    if (frame) {
      var css = Kern._extend({}, frameTransform);
      css.transform = addedTransform + " " + (css.transform || "");
      frame.applyStyles({
        left: '0px', // force top, left to be 0 in slide layout
        top: '0px'
      }, styles || {}, css);
    }
  },
  /**
   * calculate the transform for a give frame using its transformData record
   *
   * @param {Object} frameTransformData - the transform data of the frame
   * @returns {object} the calculated transform
   */
  _calcFrameTransform: function(frameTransformData) {
    var x = -frameTransformData.shiftX;
    var y = -frameTransformData.shiftY;
    return {
      transform: "translate3d(" + x + "px," + y + "px,0px) scale(" + frameTransformData.scale + ")",
      opacity: 1
    };
  },
  /**
   * calculates pre and post position record based on data for the "in" partial transition (how target
   * frame comes in) and data for the "out" partial transition (how current frame goes out)
   *
   * @param {Array} tin - transition data for the "in" transition
   * @param {Array} tout - transition data for the "out" transition
   * @param {Object} ctfd - currentFrameTransformData - transform data of current frame
   * @param {Object} ttfd - targetFrameTransformData - transform data of target frame
   * @returns {Object} the "t" record containing pre and post transforms
   */
  genericTransition: function(tin, tout, ctfd, ttfd, z) {
    var that = this;
    // calculates the transform for the in or the out part of the transition
    var getPartialTransition = function(pt, ctfd, ttfd, z) {
      var scale = function(org, dis, scale) {
        return org + (dis - org) * Math.abs(scale);
      };
      var sw = that.getStageWidth(),
        sh = that.getStageHeight(),
        cx = -ctfd.shiftX,
        cy = -ctfd.shiftY,
        tx = -ttfd.shiftX,
        ty = -ttfd.shiftY,
        pt_x = pt[1],
        pt_y = pt[2],
        pt_scale = pt[3],
        pt_rot = pt[4],
        pt_css = pt[5] || {};
      switch (pt[0]) {
        case "adjacent":
          tx = (pt_x < 0) ? scale(tx, Math.min(cx, 0) - ttfd.width, pt_x) : scale(tx, Math.max(cx + ctfd.width, sw), pt_x);
          ty = (pt_y < 0) ? scale(ty, Math.min(cy, 0) - ttfd.height, pt_y) : scale(ty, Math.max(cy + ctfd.height, sh), pt_y);
          // adjust scroll difference, but only perpendicular to transition direction (the other direction is taken care of by applying currentTransform and targetTransform later on)
          if (pt_x === 0) tx += -ttfd.scrollX * ttfd.scale + ctfd.scrollX * ctfd.scale;
          if (pt_y === 0) ty += -ttfd.scrollY * ttfd.scale + ctfd.scrollY * ctfd.scale;
          return Kern._extend({
            // transform: "translate3d(" + tx + "px," + ty + "px," + z + "px) scale(" + ttfd.scale * pt_scale + ") rotate(" + pt_rot + "deg)",
            transform: "translate3d(" + tx + "px," + ty + "px," + z + "px) translate(" + sw / 2 + "px," + sh / 2 + "px) scale(" + pt_scale + ") rotate(" + pt_rot + "deg) translate(" + (-sw / 2) + "px," + (-sh / 2) + "px) scale(" + ttfd.scale + ")",            
            opacity: 1,
            'z-index': z
          }, pt_css);
      }
    };
    var tin_css_after = tin[6] || {};
    var tout_css_before = tout[6] || {};
    var t = { // record taking pre and post positions
      t1: Kern._extend(this._calcFrameTransform(ttfd), tin_css_after),
      c0: Kern._extend(this._calcFrameTransform(ctfd), tout_css_before)
    };
    if (Object.keys(tout_css_before).length) t.current_css = true; // notify that we need to apply something to currentframe before transition.
    t.t0 = getPartialTransition(tin, ctfd, ttfd, z || 0);
    t.c1 = getPartialTransition(tout, ttfd, ctfd, (z && -z) || 0); // WARNING: ctfd & ttfd are swapped here!
    t.fix_css = [tin[5], tout[5], tin[6], tout[6]].map(function(e) {
      return Object.keys(e || {});
    }).reduce(function(css, property) {
      if (property && property !== 'transform') {
        css[property] = 'initial';
      }
      return css;
    }, {}); // create a css record that sets all extra css properties back to inital
    return t;
  }
});

layoutManager.registerType('slide', SlideLayout);

module.exports = SlideLayout;

},{"../../kern/Kern.js":31,"../domhelpers.js":3,"../layoutmanager.js":9,"./layerlayout.js":11}],13:[function(require,module,exports){
'use strict';
var Kern = require('../../kern/Kern.js');
var observerFactory = require('./observerfactory.js');


/**
 * Base class that will observe a DOM element for attribute or children changes
 *
 */
var DOMObserver = Kern.EventManager.extend({
  /**
   * Will initialise the DOMObserver
   */
  constructor: function() {
    Kern.EventManager.call(this);
  },
  /**
   * Method that will be called when the DOM element has changed. Will trigger an "attributesChanged" and/or
   * a "childrenChanged" event when needed.
   *
   * @param {Object} result - An object that will contain which attributes have been changed
   *                          and which childnodes have been added or removed.
   */
  _domElementChanged: function(result) {
    if (Object.getOwnPropertyNames(result.attributes).length > 0) {
      this.trigger('attributesChanged', result.attributes);
    }

    if (result.removedNodes.length > 0 || result.addedNodes.length > 0) {
      this.trigger('childrenChanged', {
        addedNodes: result.addedNodes,
        removedNodes: result.removedNodes
      });
    }
  },
  /**
   * Will start observing a DOM Element. Depending on the options it will listen for
   * atribute changes, child changes and size changes.
   *
   * @param {domElement} domElement - the dom element to listen to
   * @param {Object} options - Will contain the option configuration
   */
  observe: function(domElement, options) {
    this.unobserve();
    var that = this;
    if (options.attributes || options.children) {
      this._observer = observerFactory.getObserver(domElement, {
        attributes: options.attributes,
        attributeFilter: options.attributeFilter,
        childList: options.children || false,
        timeout: options.timeout,
        callback: function(result) {
          that._domElementChanged(result);
        }
      });

      this._observer.observe();
    }

    if (options.size) {
      this._sizeObserver = observerFactory.getSizeObserver(domElement, {
        timeout: options.timeout,
        callback: function() {
          that.trigger('sizeChanged');
        }
      });

      this._sizeObserver.observe();
    }

  },
  /**
   * Will stop listening to modifications on the current DOM Element
   */
  unobserve: function() {
    if (this._observer) {
      this._observer.stop();
    }

    if (this._sizeObserver) {
      this._sizeObserver.stop();
    }
  },
  /**
   * Will return if we are observing a DOM Element at the moment
   *
   * @returns {boolean} True if it is still observing
   */
  isObserving: function() {
    return (undefined !== this._observer && this._observer.isObserving()) || (undefined !== this._sizeObserver && this._sizeObserver.isObserving());
  }
});

module.exports = DOMObserver;

},{"../../kern/Kern.js":31,"./observerfactory.js":17}],14:[function(require,module,exports){
'use strict';
var Observer = require('./observer.js');

/**
 * Base class for observing a DOM Element
 */
var ElementObserver = Observer.extend({
  constructor: function(element, options) {
    this.attributes = {};
    Observer.call(this, element, options);
  },
  /**
   * Will iterate over all the element attributes and will store them. This way
   * the old attribute value can be returned in the callback.
   */
  _initalizeAttributes: function() {
    this.attributes = {};

    var length = this.element.attributes.length;

    for (var i = 0; i < length; i++) {
      var attribute = this.element.attributes[i];
      this.attributes[attribute.name] = attribute.value;
    }
  },
  /**
   * Will invoke the callBack if all condition are ok
   *
   * @param {object} result - changes that the observer has detected
   */
  _invokeCallBack: function(result) {

    if (this.options.attributeFilter && result.attributes && Object.getOwnPropertyNames(result.attributes).length > 0) {
      var attributes = {};

      for (var attributeName in result.attributes) {

        if (result.attributes.hasOwnProperty(attributeName)) {
          var attribute = attributeName.toUpperCase();

          for (var x = 0; x < this.options.attributeFilter.length; x++) {
            var attributeFiltered = this.options.attributeFilter[x].toUpperCase();
            // attribute match filter or attribute match filter that ends with '*'
            var isMatch = attributeFiltered === attribute || (attributeFiltered.endsWith('*') && attribute.startsWith(attributeFiltered.slice(0, -1)));

            // when lj-attrbute is passed, also filter for data-lj-attribute
            if (!isMatch && attributeFiltered.startsWith('LJ-')) {
              attributeFiltered = 'DATA-' + attributeFiltered;
              isMatch = attributeFiltered === attribute || (attributeFiltered.endsWith('*') && attribute.startsWith(attributeFiltered.slice(0, -1)));
            }

            if (isMatch) {
              attributes[attributeName] = result.attributes[attributeName];
            }
          }
        }
      }

      result.attributes = attributes;
    }

    if (this.options.callback && ((result.attributes && Object.getOwnPropertyNames(result.attributes).length > 0) || (result.addedNodes && result.addedNodes.length > 0) || (result.removedNodes && result.removedNodes.length > 0) || result.characterData)) {
      this.options.callback(result);
    }
  }
});

module.exports = ElementObserver;

},{"./observer.js":16}],15:[function(require,module,exports){
'use strict';
var ElementObserver = require('./elementobserver.js');

/**
 * Class that will observe a DOM Element using a MutationObserver
 */
var MutationsObserver = ElementObserver.extend({
  constructor: function(element, options) {
    ElementObserver.call(this, element, options);

    var that = this;
    var elementWindow = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
    this.mutationObserver = new elementWindow.MutationObserver(function(mutations) {
      that.mutationCallback(mutations);
    });
  },
  /**
   * Will analyse if the element has changed. Will call the callback method that
   * is provided in the options.
   */
  mutationCallback: function(mutations) {
    var result = {
      attributes: [],
      addedNodes: [],
      removedNodes: []
    };
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      if (this.options.attributes && mutation.type === 'attributes') {
        result.attributes[mutation.attributeName] = {
          oldValue: this.attributes[mutation.attributeName],
          newValue: this.element.getAttribute(mutation.attributeName)
        };
        this.attributes[mutation.attributeName] = result.attributes[mutation.attributeName].newValue;
      }
      if (this.options.childList && mutation.type === 'childList') {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (var x = 0; x < mutation.addedNodes.length; x++) {
            result.addedNodes.push(mutation.addedNodes[x]);
          }
        }
        if (mutation.removedNodes && mutation.removedNodes.length > 0) {
          for (var y = 0; y < mutation.removedNodes.length; y++) {
            result.removedNodes.push(mutation.removedNodes[y]);
          }
        }
      }
    }

    this._invokeCallBack(result);
  },
  /**
   * Starts the observer
   */
  observe: function() {
    if (this.counter !== 0) {
      this.counter--;
    }

    if (this.counter === 0) {
      if (this.element.nodeType === 1 && this.options.attributes) {
        this._initalizeAttributes();
      }

      this.mutationObserver.observe(this.element, {
        attributes: this.options.attributes || false,
        childList: this.options.childList || false,
        characterData: this.options.characterData || false
      });
    }
  },
  /**
   * Stops the observer
   */
  stop: function() {
    if (this.counter === 0) {
      this.mutationObserver.disconnect();
    }

    this.counter++;
  }
});

module.exports = MutationsObserver;

},{"./elementobserver.js":14}],16:[function(require,module,exports){
'use strict';
var Kern = require('../../kern/Kern.js');

/**
 * Base class for an Observer
 */
var Observer = Kern.Base.extend({
  constructor: function(element, options) {
    options = options || {};
    this.element = element;
    this.options = options;
    this.counter = 1;
  },
  /**
   * Starts the observer
   */
  observe: function() {
    throw 'not implemented';
  },
  /**
   * Stops the observer
   */
  stop: function() {
    throw 'not implemented';
  },
  /**
   * Checks if the observer is observing
   *
   * @returns {bool} returns true if observer is observing
   */
  isObserving: function() {
    return this.counter === 0;
  },
  /**
   * Will invoke the callBack
   */
  _invokeCallBack: function() {
    if (this.options && this.options.callback) {
      this.options.callback();
    }
  }
});

module.exports = Observer;

},{"../../kern/Kern.js":31}],17:[function(require,module,exports){
'use strict';
var Kern = require('../../kern/Kern.js');
var MutationsObserver = require('./mutationsobserver.js');
var TimeoutObserver = require('./timeoutobserver.js');
var SizeObserver = require('./sizeobserver.js');

/**
 * A factory class to get an observer
 */
var ObserverFactory = Kern.Base.extend({
  constructor: function() {},
  /**
   * Creates an observer
   *
   * @param {object} element - a dom element
   * @returns {object} options
   */
  getObserver: function(element, options) {
    var elementWindow = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
    return (elementWindow && elementWindow.MutationObserver) ? new MutationsObserver(element, options) : new TimeoutObserver(element, options);
  },
  /**
   * Creates a  size observer
   *
   * @param {object} element - a dom element
   * @returns {object} options
   */
  getSizeObserver: function(element, options) {
    return new SizeObserver(element, options);
  }
});

module.exports = new ObserverFactory();

},{"../../kern/Kern.js":31,"./mutationsobserver.js":15,"./sizeobserver.js":18,"./timeoutobserver.js":19}],18:[function(require,module,exports){
'use strict';
var Observer = require('./observer.js');

/**
 * Class for observing the size of a DOM Element
 */
var SizeObserver = Observer.extend({
  constructor: function(element, options) {
    Observer.call(this, element, options);
    this.dimensions = undefined;
  },
  /**
   * Register the dimensions
   *
   */
  observe: function() {
    if (this.counter !== 0) {
      this.counter--;
    }

    if (this.counter === 0) {
      this.dimensions = {
        size_inner: {
          width: this.element.scrollWidth,
          height: this.element.scrollHeight
        },
        size: {
          width: this.element.clientWidth,
          height: this.element.clientHeight
        }
      };

      this.checkSize();
    }
  },
  /**
   * Stop observing the size
   *
   */
  stop: function() {
    this.counter++;

    if (this.counter === 1) {
      clearTimeout(this.myTimeout);
      this.myTimeout = undefined;
    }
  },
  /**
   * Will check if dimensions are changed for specified views
   *
   */
  checkSize: function() {

    var el = this.element;
    var iwidth = el.scrollWidth;
    var iheight = el.scrollHeight;
    var width = el.clientWidth;
    var height = el.clientHeight;
    if (width !== this.dimensions.size.width || height !== this.dimensions.size.height || iwidth !== this.dimensions.size_inner.width || iheight !== this.dimensions.size_inner.height) {
      // $.debug(`sizeChanged: inner: (${this.dimensions.size_inner.width},${this.dimensions.size_inner.height})->(${iwidth},${iheight}), outer: (${this.dimensions.size.width},${this.dimensions.size.height})->(${width},${height})`);
      // WARN this debug message accesses methods from sub classes. BAD! It uses ES6.
      this.dimensions.size = {
        width: width,
        height: height
      };
      this.dimensions.size_inner = {
        width: iwidth,
        height: iheight
      };
      this._invokeCallBack();

    }

    var that = this;
    this.myTimeout = setTimeout(function() {
      that.checkSize();
    }, this.options.timeout || 100);
  }
});

module.exports = SizeObserver;

},{"./observer.js":16}],19:[function(require,module,exports){
'use strict';
var ElementObserver = require('./elementobserver.js');

/**
 * Will observer the attributes and children of a DOM Element. This class
 * will not use the MutationObserver but will use a timeout to periodically
 * check the DOM ELement for modifications.
 */
var TimeoutObserver = ElementObserver.extend({
  constructor: function(element, options) {
    ElementObserver.call(this, element, options);
    this.childNodes = [];
    this.characterData = undefined;
    this.myTimeout = undefined;
  },
  /**
   * Checks if the elements has changed. Will call the callback method
   * that is provided in the options
   */
  elementModified: function() {
    var result = {
      attributes: {},
      addedNodes: [],
      removedNodes: [],
      characterData: false
    };

    if (this.options.attributes && this.element.nodeType === 1) {
      var attributeName;
      var found = {};
      for (attributeName in this.attributes) {
        if (this.attributes.hasOwnProperty(attributeName)) {
          found[attributeName] = false;
        }
      }
      for (var index = 0; index < this.element.attributes.length; index++) {
        var attribute = this.element.attributes[index];
        // attribute isn't mapped
        if (!this.attributes.hasOwnProperty(attribute.name)) {
          result.attributes[attribute.name] = {
            oldValue: undefined,
            newValue: attribute.value
          };
          this.attributes[attribute.name] = attribute.value;

        } else if (this.attributes[attribute.name] !== attribute.value) {
          // attribute is mapped but value has changed
          result.attributes[attribute.name] = {
            oldValue: this.attributes[attribute.name],
            newValue: attribute.value
          };
          this.attributes[attribute.name] = attribute.value;
        }
        found[attribute.name] = true;
      }

      // detect deleted attributes
      for (attributeName in found) {
        if (found.hasOwnProperty(attributeName) && !found[attributeName]) {
          result.attributes[attributeName] = {
            oldValue: this.attributes[attributeName],
            newValue: undefined
          };
          delete this.attributes[attributeName];
        }
      }
    }

    if (this.options.childList && this.element.nodeType === 1) {
      var i, child;
      //detect delete children
      for (i = 0; i < this.childNodes.length; i++) {
        child = this.childNodes[i];
        if (!this.element.contains(child)) {
          this.childNodes.splice(i, 1);
          result.removedNodes.push(child);
        }
      }
      //detect new children
      for (i = 0; i < this.element.childNodes.length; i++) {
        child = this.element.childNodes[i];
        if (-1 === this.childNodes.indexOf(child)) {
          result.addedNodes.push(child);
          this.childNodes.push(child);
        }
      }
    }

    // detect changes in characterData
    if (this.options.characterData && this.element.nodeType === 3) {
      if (this.characterData !== this.element.data) {
        result.characterData = true;
        this.characterData = this.element.data;
      }
    }

    this._invokeCallBack(result);

    this.observe();
  },
  /**
   * Starts the observer
   */
  observe: function() {
    if (this.counter !== 0) {
      this.counter--;
    }

    if (this.counter === 0) {

      if (this.element.nodeType === 1 && this.options.attributes) {
        this._initalizeAttributes();
      }

      if (this.element.nodeType === 3) {
        this.characterData = this.element.data;
      }

      this.childNodes = [];
      this.myTimeout = undefined;

      var length = this.element.childNodes.length;
      for (var i = 0; i < length; i++) {
        this.childNodes.push(this.element.childNodes[i]);
      }

      var that = this;
      this.myTimeout = setTimeout(function() {
        that.elementModified();
      }, this.options.timeout || 25);
    }
  },
  /**
   * Stops the observer
   */
  stop: function() {
    this.counter++;
    if (this.myTimeout !== undefined) {
      clearTimeout(this.myTimeout);
      this.myTimeout = undefined;
    }
  }
});

module.exports = TimeoutObserver;

},{"./elementobserver.js":14}],20:[function(require,module,exports){
'use strict';
var pluginManager = require('./pluginmanager.js');
var $ = require('./domhelpers.js');
var Kern = require('../kern/Kern.js');

var ParseManager = function() {
  /**
   * Parses a document for layerJs object
   * @param {HTMLDocument} doc - an optional root document
   *
   * @returns {void}
   */
  this.parseDocument = function(doc) {
    doc = doc || document;
    this._parse(doc, doc);
  };

  /**
   * Parses an existing node for LayerJS objects
   * @param {HTMLElement} Element
   * @param {object} Optional options
   * @returns {void}
   */
  this.parseElement = function(element, options) {
    if (element.nodeType === 1) {
      this._parse(element, element.ownerDocument, options);
    }
  };

  /**
   * Parses an Node for layerJs object
   * @param {HTMLNode} root - Nodes who's children needs to be parsed
   * @param {HTMLDocument} doc - an optional root document
   * @param {oobject} options - optional options
   *
   * @returns {void}
   */
  this._parse = function(root, doc, options) {
    var stageElements = root.querySelectorAll("[data-lj-type='stage'],[lj-type='stage']");
    var length = stageElements.length;
    options = options || {};
    var state = layerJS.getState(doc);

    for (var index = 0; index < length; index++) {
      var stageView = pluginManager.createView($.getAttributeLJ(stageElements[index], 'type'), Kern._extend(options, {
        el: stageElements[index],
        document: doc
      }));
      state.registerView(stageView); // register view with state recursively
    }
  };
};


layerJS.parseManager = new ParseManager();
module.exports = layerJS.parseManager;

},{"../kern/Kern.js":31,"./domhelpers.js":3,"./pluginmanager.js":21}],21:[function(require,module,exports){
'use strict';
var layerJS = require('./layerjs.js');
var Kern = require('../kern/Kern.js');

var PluginManager = Kern.EventManager.extend({
  /**
   * create a PluginManager
   * the PluginManager is used to create View objects from ObjData objects.
   * It contains a list of constructors for the corresponding data types.
   * It can be dynamically extended by further data types.
   *
   * @param {Object} map - an object mapping Obj types to {view:constructor, model: contructor} data sets
   * @returns {This}
   */
  constructor: function(map, identifyPriorities) {
    Kern.EventManager.call(this);
    this.map = map || {}; // maps ObjData types to View constructors
    this.identifyPriorities = identifyPriorities || {};
  },
  /**
   * create a view based on the type in the Obj's model
   *
   * @param {NodeData} model - the model from which the view should be created
   * @param {Object} [options] - create options
   * @param {HTMLElement} options.el - the element of the view
   * @returns {NodeView} the view object of type NodeView or a sub class
   */
  createView: function(model, options) {
    // return existing view if the provided element already has one
    if (options && options.el && options.el._ljView) {
      return options.el._ljView;
    }
    if (typeof model === 'string') {
      var type = model;
      if (this.map.hasOwnProperty(type)) {
        return new(this.map[type].view)(options);
      }
      throw "no constructor found for objects of type '" + type + "'";
    }

    throw "no constructor found for objects of type '" + model + "'";
  },
  /**
   * register a view class for a ObjData type
   *
   * @param {string} type - the name of the type
   * @param {function} constructor - the constructor of the view class of this type
   * @returns {This}
   */
  registerType: function(type, constructor, identifyPriority) {
    this.map[type] = {
      view: constructor,
      identify: constructor.identify
    };

    if (undefined === this.identifyPriorities[identifyPriority])
      this.identifyPriorities[identifyPriority] = [];

    this.identifyPriorities[identifyPriority].push(constructor);
  },
  /**
   * Will iterate over the registered ViewTypes and call it's identify
   * method to find the ViewType of a DOM element
   *
   * @param {object} element - A DOM element
   * @returns {string} the found ViewType
   */
  identify: function(element) {
      var type;

      var sortedKeys = Object.keys(this.identifyPriorities).sort(function(a, b) {
        return (a - b) * (-1);
      });

      for (var x = 0; x < sortedKeys.length; x++) {
        var key = sortedKeys[x];
        for (var i = 0; i < this.identifyPriorities[key].length; i++) {
          if (this.identifyPriorities[key][i].identify(element)) {
            type = this.identifyPriorities[key][i].defaultProperties.type;
            break;
          }
        }
        if (undefined !== type) {
          break;
        }
      }

      if (undefined === type) {
        throw "no ViewType found for element '" + element + "'";
      }

      return type;
    }
    /**
     * make sure a certain plugin is available, continue with callback
     *
     * @param {string} type - the type that shoud be present
     * @param {Function} callback - call when plugins is there
     * @returns {Type} Description
     */
    // requireType: function(type, callback) {
    //   if (!this.map[type]) throw "type " + type + " unkonw in pluginmanager. Have no means to load it"; //FIXME at some point this should dynamically load plugins
    //   return callback(); // FIXME should be refactored with promises or ES 6 yield
    // }
});
// initialialize pluginManager with default plugins
layerJS.pluginManager = new PluginManager({});
// this module does not return the class but a singleton instance, the pluginmanager for the project.
module.exports = layerJS.pluginManager;

},{"../kern/Kern.js":31,"./layerjs.js":7}],22:[function(require,module,exports){
'use strict';

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    value: function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
  });
}

if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    value: function(searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    }
  });
}

if (!Number.parseFloat) {
  //not all browsers support Number.parseFloat
  Number.parseFloat = parseFloat;
}

},{}],23:[function(require,module,exports){
'use strict';
var Kern = require('../../kern/Kern.js');
var parseManager = require("../parsemanager.js");
var $ = require('../domhelpers.js');
var StaticRouter = require('./staticrouter.js');

var FileRouter = StaticRouter.extend({
  constructor: function(options) {
    options = options || {};

    this._state = layerJS.getState();
    StaticRouter.call(this, options);

    if (options.cacheCurrent) {
      // remove layerJS parameters from the url before caching it the fist time
      var parsed = $.splitUrl(window.location.href);
      parsed.queryString = $.parseStringForTransitions(parsed.queryString, true).string;
      // FIXME: this need to wait for state.initialized
      this.addRoute($.joinUrl(parsed, true), {
        pageTitle: document.title,
        state: this._state.exportState()
      });
    }
  },
  /**
   * Will do the actual navigation to the url
   * @param {string} url an url
   * @param {object} options contains url, paths, transitions, globalTransition, context
   * @return {boolean} True if the router handled the url
   */
  handle: function(options) {
    var that = this;
    var promise = new Kern.Promise();

    // check static router if we have cached this url

    StaticRouter.prototype.handle.call(this, options).then(function(result) {
      if (result.handled || result.optout) {
        promise.resolve(result);
      } else {
        that._loadHTML($.joinUrl(options, true)).then(function(doc) {
            parseManager.parseDocument(doc);
            var globalStructureHash = {};

            var state = that._state;
            // create a hash that contains all paths for the current document
            state.exportStructure().forEach(function(path) {
              path = path.replace(/\$$/, '');
              globalStructureHash[path] = {};
            });

            var fileState = layerJS.getState(doc);
            var addedHash = [];


            fileState.exportStructure().forEach(function(path) {
              // check if new path exists in current state
              path = path.replace(/\$$/, '');
              if (!globalStructureHash[path]) {
                // check if the parent is already added in this run
                var found = addedHash.filter(function(addedPath) {
                  return path.startsWith(addedPath);
                }).length > 0;
                if (!found) {
                  // Path not yet added
                  var isRoot = !(path.match(/\./)); // is the new path a root path (a root stage)?
                  // get parent path
                  var parentPath = path.replace(/\.[^\.]*$/, '');
                  // only add the new path if the parent exists in current state
                  if (globalStructureHash[parentPath] || isRoot) {
                    var html = fileState.resolvePath(path)[0].view.outerEl.outerHTML; // this should always resolve to a single view
                    var parentHTML = isRoot ? document.body : state.resolvePath(parentPath)[0].view.innerEl;
                    parentHTML.insertAdjacentHTML('beforeend', html);
                    parentHTML.lastChild.style.display = "none"; // don't show currently added element (this should be done by the layerview/layout code)
                    // execute scripts manually (as we use insertAdjacentHTML those will not be executed)
                    var scripts = parentHTML.lastChild.getElementsByTagName('script');
                    for (var n = 0; n < scripts.length; n++) {
                      var oldScript = scripts[n];
                      var newScript = document.createElement("script");
                      newScript.text = oldScript.innerHTML;
                      for (var i = oldScript.attributes.length - 1; i >= 0; i--) {
                        newScript.setAttribute(oldScript.attributes[i].name, oldScript.attributes[i].value);
                      }
                      oldScript.parentNode.replaceChild(newScript, oldScript);
                    }
                    addedHash.push(path);
                  } else {
                    // this should never happen because structure is tranversered in DOM order
                    throw "filerouter: didn't find '" + parentPath + "' in current document to add new '" + path + "'";
                  }
                }
              }
            });

            if (addedHash.length === 0) {
              console.warn("layerJS: filerouter: loaded new document '" + $.joinUrl(options, true) + "' but didn't add any new content. You should give the frame that should be added a different name or id.");
            }
            var exportedState = fileState.exportState();

            // only transition is to paths that already existed or where just added
            var framesToTransitionTo = exportedState.filter(function(path) {
              var isSpecial = path.split('.').pop().startsWith('!');
              var pathToFind = path;
              // if it is a special frame, check if parent exists or was added
              if (isSpecial) {
                pathToFind = path.replace(/\.[^\.]*$/, '');
              }
              // only transition to a path if it was added directly (not through a parent) or if it was present before
              return globalStructureHash.hasOwnProperty(pathToFind) || addedHash.indexOf(pathToFind) !== -1;
            });

            // create a transition record for each frame path.
            var transitions = framesToTransitionTo.map(function() {
              return Kern._extend({}, options.globalTransition);
            });
            // cache the new state so that we don't need to request the same page again.
            that.addRoute($.joinUrl(options, true), {
              state: exportedState,
              pageTitle: doc.title
            });

            // we modified HTML. need to wait for rerender and mutation observers
            $.postAnimationFrame(function() {
              promise.resolve({
                stop: false,
                handled: true,
                paths: framesToTransitionTo,
                transitions: transitions
              });
            });
          },
          function() { // if load failed resolve with handled false
            promise.resolve({
              stop: false,
              handled: false,
              paths: [],
              transitions: []
            });
          });
      }
    });

    return promise;
  },
  /**
   * load an HTML document by AJAX and return it through a promise
   *
   * @param {string} URL - the url of the HMTL document
   * @returns {Promise} a promise that will return the HTML document
   */
  _loadHTML: function(URL) {
    var p = new Kern.Promise();

    try {
      var xhr = new XMLHttpRequest();
      xhr.onerror = function() {
        p.reject();
      };
      xhr.onload = function() {

        if (xhr.status === 200) {
          var doc = document.implementation.createHTMLDocument("framedoc");
          doc.documentElement.innerHTML = xhr.responseText;
          p.resolve(doc);
        } else {
          p.reject();
        }
      };
      xhr.open("GET", URL);
      xhr.responseType = "text";
      xhr.send();
    } catch (e) {
      p.reject(e);
    }

    return p;
  }
});

module.exports = FileRouter;

},{"../../kern/Kern.js":31,"../domhelpers.js":3,"../parsemanager.js":20,"./staticrouter.js":26}],24:[function(require,module,exports){
'use strict';
var Kern = require('../../kern/Kern.js');
var $ = require('../domhelpers.js');

var HashRouter = Kern.EventManager.extend({
  /**
   * Will do the actual navigation to a hash
   * @param {Object} options
   * @return {boolean} True if the router handled the url
   */
  handle: function(options) {

    var promise = new Kern.Promise();

    if (options.hash === undefined || options.hash === '#' || options.hash === '') {
      // not the same file or no hash in href
      promise.resolve({
        handled: false,
        stop: false,
        paths: []
      });
    } else {
      // split hash part by ";". This allows different transitions at the same time "#frame1&t=1s&p=left;menu&t=0.5"
      var hashPaths = (options.hash.startsWith('#') ? options.hash.substr(1) : options.hash).split(';');
      var paths = [];
      var transitions = [];
      var state = layerJS.getState();

      var filterFramesWithSameLayer = function(layerPath) {
        return function(framePath) {
          return layerPath === framePath.replace(/\.[^\.]*$/, '');
        };
      };

      for (var i = 0; i < hashPaths.length; i++) {
        var hashPath = hashPaths[i].split('?')[0].split('&')[0].replace('(', '').replace(')', '');
        var parsed = $.parseStringForTransitions(hashPaths[i]);
        var resolved = false;
        try {
          var resolvedPaths = state.resolvePath(hashPath);

          for (var x = 0; x < resolvedPaths.length; x++) {
            var resolvedPath = resolvedPaths[x];
            // if a frame and layer is found, add it to the list
            if (resolvedPath.hasOwnProperty('frameName') && resolvedPath.hasOwnProperty('layer')) {
              // push layer path and frameName ( can't use directly the view because !right will not resolve in a view)
              paths.push(resolvedPath.path);
              transitions.push(Kern._extend(options.globalTransition, parsed.transition));
              resolved = true;
            }
          }
        } catch (e) {

        }
        if (!resolved) {
          // if we didn't find any frame try to find a matching anchor element
          // an anchorId will be the first one in the list
          // check if it is an anchor element
          var anchor = document.getElementsByName(hashPath);
          anchor = anchor && anchor[0] || document.getElementById(hashPath); //anchor name or id
          // only proceed when an element is found and if that element is visible
          if (anchor && window.getComputedStyle(anchor).display !== 'none') {
            var frameView = $.findParentViewOfType(anchor, 'frame'); // the frame that contains the anchor
            // parent of the element has to be a frame
            if (undefined !== frameView) { // is part of a frame
              var transition;
              var path = state.buildPath(frameView.outerEl, false);
              var index = paths.indexOf(path);
              // check if there is already a transition path for this frame
              // FIXME: this only works if that path has been found already in this hashrouter run
              if (index !== -1) {
                // path found, reuse transition record
                // this happens when you want to go to a new frame and immideately scroll to an anchor. "#framename;#anchorname"
                transition = transitions[index];
              } else if (index === -1) {
                // check is the layer is getting a new current frame an verify if anchor also exists
                // in the new frame
                // FIXME: i don't know why this branch is here. The index!==-1 branch should already find a new current frame with the anchor inside. Why searching for the anchor again in another frame in the same layer??????
                var layerPath = path.replace(/\.[^\.]*$/, '');
                var framesWithSameLayer = options.paths.filter(filterFramesWithSameLayer(layerPath)); // find frames that will be transitoned to in the same layer as the frame which contains the anchor

                if (framesWithSameLayer.length === 1) {
                  var frameViewTemp = state.resolvePath(framesWithSameLayer[0])[0].view; // get the first of those frames
                  var anchorTemp = frameViewTemp.outerEl.querySelectorAll('[name=' + hashPath + '], #' + hashPath); // get the anchor element in that frame (name or id)
                  anchorTemp = anchorTemp && anchorTemp[0]; 

                  if (anchorTemp && window.getComputedStyle(anchorTemp).display !== 'none') { // if we have an anchor in this frame
                    var hidden = window.getComputedStyle(frameViewTemp.outerEl).display === 'none';

                    if ( hidden) // temporarily display the frame if hidden
                    {
                      frameViewTemp.outerEl.style.opacity = 0;
                      frameViewTemp.outerEl.style.display = '';
                    }

                      anchor = anchorTemp;
                      index = options.paths.indexOf(framesWithSameLayer[0]);
                      transition = options.transitions[index]; // get the transition record of the new frame

                      anchor = { // create fake anchor element with offsets
                        offsetTop: anchorTemp.offsetTop,
                        offsetLeft: anchorTemp.offsetLeft
                      };

                      if (hidden) // hide frame again
                      {
                        frameViewTemp.outerEl.style.display = 'none';
                        frameViewTemp.outerEl.style.opacity = 1;
                      }
                  }
                }
              }

              if (index === -1 && frameView.parent.currentFrame === frameView) { // if nothing is found; wee need to add a new path to the current frame with the transtion to the new sroll positions
                // if frame is active, add path and transition record
                paths.push(state.buildPath(frameView.outerEl, false));
                transition = Kern._extend({}, options.globalTransition, parsed.transition);
                transitions.push(transition);
              }
              // add scroll position of anchor to the transition record
              if (transition) {
                transition.scrollY = anchor.offsetTop;
                transition.scrollX = anchor.offsetLeft;
              }
            }
          }
        }
      }

      promise.resolve({
        stop: false,
        handled: paths.length > 0,
        paths: paths,
        transitions: transitions
      });
    }

    return promise;
  },
  /**
   * Will try to resolve the hash part for the url
   *
   * @param {Object} options - contains a url and a state (array)
   * @returns {Promise} a promise that will return the HTML document
   */
  buildUrl: function(options) {
    var state = layerJS.getState();
    var paths = [];

    for (var i = 0; i < options.state.length; i++) {
      // try to make the hash path as small as possible (still state.resolvePath should just return 1 path )
      var splittedPath = options.state[i].split('.');
      var path = undefined;
      var resolvedPaths = undefined;
      var ok = false;
      do {
        path = splittedPath.pop() + (path ? '.' + path : '');
        resolvedPaths = state.resolvePath(path);

        if (resolvedPaths.length === 1) { // if this returns 1 then the path is unique
          ok = true;
          path = resolvedPaths[0].view && resolvedPaths[0].view.originalParent && resolvedPaths[0].view.originalParent !== resolvedPaths[0].view.parent ? options.state[i] : path;
        }
      }
      while (!ok && splittedPath.length > 0);

      if (ok) {
        paths.push(path);
        options.state.splice(i, 1);
        i--;
      }
    }

    // NOTE: reset hash part; removes als all non-layerjs parts; not sure this is good or not.
    options.hash = paths.join(';');
  }
});

module.exports = HashRouter;

},{"../../kern/Kern.js":31,"../domhelpers.js":3}],25:[function(require,module,exports){
'use strict';
var layerJS = require('../layerjs.js');
var $ = require('../domhelpers.js');
var Kern = require('../../kern/Kern.js');
var StaticRouter = require('./staticrouter.js');

var Router = Kern.EventManager.extend({
  constructor: function(rootEl) {
    this._init(rootEl);
  },
  _init: function(rootEl) {
    this.rootElement = rootEl || document;
    this.routers = [];
    this._registerLinkClickedListener();
    this.addToHistory = true;
    this.isClickEvent = false;
    this.state = layerJS.getState();
    this.state.on('stateChanged', this._stateChanged, {
      context: this
    });
  },
  /**
   * Will add a new router to the lists of routers
   * @param {object} A new router
   */
  addRouter: function(router) {
    this.routers.push(router);
    if (router instanceof StaticRouter) {
      this.staticRouter = router; // mark if we have a static router
    }
  },
  /**
   * convenience function to add a static route to the StaticRouter. It will create a static router if none is present for convenience. Note, some routers like filerouter are also static routers
   *
   * @param {string} url - the url for the route
   * @param {Array} state - the state for the route
   * @param {boolean} nomodify - don't modify route if already set
   * @returns {Type} Description
   */
  // addStaticRoute: function(url, state, nomodify) {
  //   if (!this.staticRouter) this.addRouter(new StaticRouter);
  //   this.staticRouter.addRoute(url, state, nomodify);
  // },
  /**
   * Will clear all registered routers except the StaticRouter
   */
  clearRouters: function() {
    this.routers = [];
  },
  /**
   * register a listener to all link cliks that decides if the link target can be resolved using a layerJS transition or needs to be followed by a browser reload
   *
   * @returns {Type} Description
   */
  _registerLinkClickedListener: function() {
    var that = this;

    // listen to history buttons
    window.onpopstate = function(eventArg) {
      if (document.location.href === that.ignoreUrl) {
        delete that.ignoreUrl;
      } else if (eventArg && eventArg.state && eventArg.state.state) {
        that.state.transitionTo(eventArg.state.state, eventArg.state.transitions, {
          noHistory: true
        });
      } else {
        that.navigate(document.location.href, null, true);
      }
    };

    // register link listener
    $.addDelegtedListener(this.rootElement, 'click', 'a:not([data-lj-no-link=\'true\']):not([lj-no-link=\'true\'])', function(event) {
      //delete that.ignoreUrl;

      var _navigationHandler = function(result) {
        if (!result) {
          setTimeout(function() { // why do we have to get at the end of the queue?
              that.ignoreUrl = $.getAbsoluteUrl(href);
              window.location.href = href;
          }, 1);
        }
      };

      if (this.href !== '' && !this.href.startsWith('javascript:')) { // jshint ignore:line
        // get the explicitly given href (that is not extended) to see the intention of the user
        var href = this.getAttribute('href');

        // check for target attr
        var tget = this.getAttribute('target');
        // if target is != '_self', honor it as user intention
        if( tget && tget !== '_self' ) {
          return;
        }
        else {

          event.preventDefault(); // prevent default action, i.e. going to link target
          // do not stop propagation; other libraries may listen to link clicks
          that.navigate(href, $.findParentViewOfType(this, 'layer')).then( _navigationHandler );
        }
      }
    });
  },

  /**
   * When the router can navigate to the url, it will do this.
   * @param {string} Url where to navigate
   * @param {LayerView} context where the click event originated
   * @param {boolean} noHistory Indicate if the url should to be added to the history
   * @param {boolean} initial when true the router will not do a transition but instead will directly show it
   * @return {boolean} Indicates if the router could do the navigation to the url
   */
  navigate: function(href, context, noHistory, initial) {

    var options = Kern._extend($.splitUrl(href), {
      transitions: [],
      context: context,
      paths: [],
      globalTransition: {}
    });
    // make sure if location is given that it is a fully qualified url (not a relative)
    if (options.location || options.queryString) {
      options.explLoc = true; // indicate that location was given
      Kern._extend(options, $.splitUrl($.getAbsoluteUrl(href)));
    }
    // check if there are layerjs params in the querystring
    var qsljparams = options.queryString && $.parseStringForTransitions(options.queryString, false);
    if (qsljparams) {
      options.globalTransition = qsljparams.transition; // transition will be used to merge with other transitions that will be added by other routers
      options.queryString = qsljparams.string; // remove layerJS params from queryString
    }

    var count = this.routers.length;
    var that = this;
    var promise = new Kern.Promise();
    var handled = false;

    var resolve = function() {
      if (handled) {
        // determine is it was a clickevent and if we need to add this to the history
        if (initial === true) {
          // this is the initial navigation ( page just loaded) so we should do a show
          that.state.showState(options.paths, options.transitions, {
            paths: options.paths,
            transitions: options.transitions,
            noHistory: noHistory,
            originalUrl: href,
            initial: initial
          });
        } else {
          // do a transition
          that.state.transitionTo(options.paths, options.transitions, {
            paths: options.paths,
            transitions: options.transitions,
            noHistory: noHistory,
            originalUrl: href
          });
        }
      }

      promise.resolve(handled);
    };

    // iterate all routers
    var callRouter = function(index) {
      if (index < count) {
        that.routers[index].handle(options).then(function(result) {
          if (result.handled) {
            // the router handled the url -> add newly found paths to the options
            handled = result.handled;
            Array.prototype.push.apply(options.paths, result.paths);
            Array.prototype.push.apply(options.transitions, result.transitions);
          }
          if ((result.handled && !result.stop) || (!result.handled)) {
            // when the router couldn't handle the url or when the router indecated that we should try other routers, call other routers
            callRouter(index + 1);
          } else
          // end iteration
            resolve();
        });
      } else {
        // end iteration
        resolve();
      }
    };
    // if url is not of same domain as current document do not handle
    if (options.location && options.location.match(/^\w+:/) && !options.location.match(new RegExp('^' + window.location.origin))) {
      promise.resolve(false);
    } else {
      callRouter(0);
    }
    return promise;
  },
  /**
   * Will be called when the state is changed (stateChanged event).
   * Will create a url to represent the current (changed) state.
   * @param {Array} newState the minimized (changed) state
   */
  _stateChanged: function(state, payload) {
    payload = payload || {};
    payload.state = payload.state || [];
    payload.transitions = payload.transitions || [];

    var newState = (state && state.exportMinimizedState()) || {
      state: [],
      defaultState: [],
      omittedState: []
    };

    // remove state paths that are already added in the payload
    // this need to be done for inital load and also for non active frames who are not in there orginal panrent
    var tempState = newState.state.concat(newState.omittedState).concat(newState.defaultState).filter(function(path) {
      return payload.state.indexOf(path) < 0 && payload.state.indexOf(path.replace('$'));
    });

    var stateToSave = payload.state.concat(tempState);
    var transitions = payload.transitions;

    // prepare data for the routers
    var options = Kern._extend($.splitUrl(window.location.href), newState);

    // remove layerjs params from queryString
    options.queryString = $.parseStringForTransitions(options.queryString, false).string;

    for (var i = 0; i < this.routers.length; i++) {
      this.routers[i].buildUrl(options);
    }

    var url = $.joinUrl(options);

    // If the original url is different from the new url (no-url="true") we should do a push
    if (window.history && (!payload || !payload.noHistory) && window.location.href !== url) {
      window.history.pushState({
        state: stateToSave,
        transitions: transitions,
      }, "", url);
      if (options.pageTitle) {
        document.title = options.pageTitle;
      }
    } else if (window.history && (!payload || !payload.noHistory || payload.initial)) {
      // keep in account of the payload noHistory. This is imported when the a onpopstate event is fired. This event should not add anything to the history
      window.history.replaceState({
        state: stateToSave,
        transitions: transitions,
      }, "", url);
      if (options.pageTitle) {
        document.title = options.pageTitle;
      }
    }
  }
});

module.exports = layerJS.router = new Router();

},{"../../kern/Kern.js":31,"../domhelpers.js":3,"../layerjs.js":7,"./staticrouter.js":26}],26:[function(require,module,exports){
'use strict';
var Kern = require('../../kern/Kern.js');
var $ = require('../domhelpers.js');

var StaticRouter = Kern.EventManager.extend({
  constructor: function() {
    this.routes = {};
  },
  /**
   * add a static route to the routers
   *
   * @param {string} url - the url of the route
   * @param {object} options - contains the state and page title of the route
   * @param {boolean} nomodify - don't modify route if already set
   * @returns {Type} Description
   */
  addRoute: function(url, options, nomodify) {
    url = $.getAbsoluteUrl(url); // make url absolute
    if (!nomodify || !this.routes.hasOwnProperty(url)) {
      this.routes[url] = options;
    }
  },
  /**
   * check if a route for an url is already registered
   *
   * @param {string} url - the url of an route
   * @returns {Type} Description
   */
  hasRoute: function(url) {
    url = $.getAbsoluteUrl(url); // make url absolute
    return this.routes.hasOwnProperty(url);
  },
  /**
   * Will do the actual navigation to the url
   * @param {object} options contains url parts, paths, transitions, globalTransition, context
   * @return {void}
   */
  handle: function(options) {
    var result;
    var url = $.joinUrl(options, true); // we need to include the queryString as this may refer to different files if filerouter is used.
    // if currentl url equals new url and the url was not explicitly given in navigate() we should ignore the static router cache
    var optout = !url || (!options.explLoc && ($.joinUrl($.splitUrl(window.location.href), true) === url));
    result = optout ? false : this.hasRoute(url);
    var promise = new Kern.Promise();
    var activeFrames = [];
    var transitions = [];

    if (result) {
      activeFrames = this.routes[url].state;
      activeFrames.forEach(function() {
        transitions.push(Kern._extend({}, options.globalTransition)); // we need to add a transition record for each path, otherwise we get in trouble if other routers will add paths and transitions as well
      });
    }

    promise.resolve({
      stop: false,
      handled: result,
      transitions: transitions,
      optout: optout,
      paths: activeFrames
    });

    return promise;
  },
  /**
   * Will try to resolve an url based on it's cached states
   *
   * @param {Object} options - contains a url and a state (array)
   * @returns {Promise} a promise that will return the HTML document
   */
  buildUrl: function(options) {
    var state = options.state.concat(options.defaultState); //we only check state and defaultState but not omitted state for equivalence with router states
    var that = this;
    var foundUrl;
    var url = $.joinUrl(options, true);
    foundUrl = url;
    var find = function(path) {
      return that.routes[url] && that.routes[url].state.indexOf(path) !== -1;
    };
    // check how many state paths can be explained by the current url (we need to prefer the current url over other urls)
    var foundPaths = state.filter(find);
    var foundPathsLength = foundPaths.length;
    // search how many of the current state's paths can be explained by the state stored for each url in the routes hash
    for (url in this.routes) {
      if (this.routes.hasOwnProperty(url) && this.routes[url].state.length > foundPathsLength) {
        var found = state.filter(find);
        var count = found.length;
        if (count > foundPathsLength) {
          foundPaths = found;
          foundPathsLength = count;
          foundUrl = url;
        }
      }
    }

    if (this.routes.hasOwnProperty(foundUrl) && this.routes[foundUrl].pageTitle) {
      options.pageTitle = this.routes[foundUrl].pageTitle;
    }

    // update URL to be shown later on
    foundUrl = $.splitUrl(foundUrl);
    options.location = foundUrl.location;
    options.queryString = foundUrl.queryString; // NOTE: this removes all other query params, not sure this is good or not.

    // remove paths from state that are already explained by the cached URL
    foundPaths.forEach(function(path) {
      var index = options.state.indexOf(path);
      if (index !== -1) {
        options.state.splice(index, 1);
      } else {
        options.defaultState.splice(options.defaultState.indexOf(path), 1);
      }
    });
  }
});

module.exports = StaticRouter;

},{"../../kern/Kern.js":31,"../domhelpers.js":3}],27:[function(require,module,exports){
'use strict';
var Kern = require('../kern/Kern.js');
var $ = require('./domhelpers.js');

/**
 * this is the ScrollTransformer which handles native and transform scrolling for Layers.
 *
 */
var ScrollTransformer = Kern.EventManager.extend({
  /**
   * create a ScrollTransformer which handles native and transform scrolling for Layers.
   *
   * @param {LayerView} layer - the layer this ScrollTransformer belongs to
   * @returns {Type} Description
   */
  constructor: function(layer) {
    Kern.EventManager.call(this);
    var that = this;
    if (!layer) throw "provide a layer";
    this.layer = layer;

    // listen to scroll events
    this.layer.outerEl.addEventListener('scroll', function() {
      if (that.layer.nativeScroll()) {
        var tfd = that.layer.currentFrameTransformData;
        tfd.scrollX = that.layer.outerEl.scrollLeft / tfd.scale;
        tfd.scrollY = that.layer.outerEl.scrollTop / tfd.scale;
        that.layer.trigger("scroll");
      }
    });
  },

  /**
   * returns a transform for a specified scroll position
   *
   * @param {Number} scrollX - the scroll in x direction
   * @param {Number} scrollY - the scroll in y direction
   * @returns {string} the transform
   */
  scrollTransform: function(scrollX, scrollY) {
    return "translate3d(" + scrollX + "px," + scrollY + "px,0px)";
  },
  /**
   * will check if current gesture would lead to scrolling in a nested element
   * FIXME: what if the inner element is a layer itself?
   *
   * @param {object} gesture - current gesture
   * @returns {Boolean} true if inner scrolling would occur
   */
  _detectInnerScrolling: function(gesture) {
    var element = gesture.event.target;
    while (element && this.layer.innerEl.contains(element) && element !== this.layer.innerEl) {
      if (Math.abs(gesture.shift.x) > Math.abs(gesture.shift.y)) {
        if (element.clientWidth < element.scrollWidth && !(window.getComputedStyle(element)['overflow-x'] in {
            visible: 1,
            hidden: 1
          })) {
          if ((gesture.shift.x > 0 && element.scrollLeft > 0) || element.scrollLeft < element.scrollWidth - element.clientWidth) {
            gesture.event.stopPropagation();
            return true;
          }
        }
      } else {
        if (element.clientHeight < element.scrollHeight && !(window.getComputedStyle(element)['overflow-y'] in {
            visible: 1,
            hidden: 1
          })) {
          if ((gesture.shift.y > 0 && element.scrollTop > 0) || element.scrollTop < element.scrollHeight - element.clientHeight) {
            gesture.event.stopPropagation();
            return true;
          }
        }
      }
      element = element.parentElement;
    }
    return false;
  },
  /**
   * calculate current transform based on gesture
   *
   * @param {Gesture} gesture - the input gesture to be interpreted as scroll transform
   * @returns {string} the transform or false to indicate no scrolling
   */
  scrollGestureListener: function(gesture) {
    var tfd = this.layer.currentFrameTransformData;
    if (gesture.first) {
      this.scrollStartX = tfd.scrollX;
      this.scrollStartY = tfd.scrollY;
      return true;
    }
    // detect nested scrolling
    if (this._detectInnerScrolling(gesture)) return true;
    // primary direction
    var axis = (Math.abs(gesture.shift.x) > Math.abs(gesture.shift.y) ? "x" : "y");
    // check if can't scroll in primary direction
    if (axis === "x" && !tfd.isScrollX) return false;
    if (axis === "y" && !tfd.isScrollY) return false;
    if (this.layer.nativeScroll()) {
      if (Math.abs(gesture.shift.x) + Math.abs(gesture.shift.y) < 10) return true;
      if (axis === 'y') {
        if (gesture.shift.y > 0) { // Note: gesture.shift is negative
          return tfd.scrollY > 0; // return true if can scroll; false otherwise
        } else {
          return (this.layer.outerEl.scrollHeight - this.layer.outerEl.clientHeight - 1 > this.layer.outerEl.scrollTop);
        }
      } else if (axis === 'x') {
        if (gesture.shift.x > 0) {
          return tfd.scrollX > 0;
        } else {
          return (this.layer.outerEl.scrollWidth - this.layer.outerEl.clientWidth - 1 > this.layer.outerEl.scrollLeft);
        }
      }
    } else {
      if (axis === 'y') {
        if (gesture.shift.y > 0) { // Note: gesture.shift is negative
          if (tfd.scrollY === 0) return false; // return false if cannot scroll
        } else {
          if (tfd.maxScrollY - tfd.scrollY < 1) return false;
        }
      } else if (axis === 'x') {
        if (gesture.shift.x > 0) {
          if (tfd.scrollX === 0) return false;
        } else {
          if (tfd.maxScrollX - tfd.scrollX < 1) return false;
        }
      }
      tfd.scrollX = this.scrollStartX - gesture.shift.x / tfd.scale;
      tfd.scrollY = this.scrollStartY - gesture.shift.y / tfd.scale;
      if (!tfd.isScrollX) tfd.scrollX = this.scrollStartX;
      if (!tfd.isScrollY) tfd.scrollY = this.scrollStartY;
      if (tfd.scrollX < 0) tfd.scrollX = 0;
      if (tfd.scrollX > tfd.maxScrollX) tfd.scrollX = tfd.maxScrollX;
      if (tfd.scrollY < 0) tfd.scrollY = 0;
      if (tfd.scrollY > tfd.maxScrollY) tfd.scrollY = tfd.maxScrollY;
      return this.scrollTransform(-tfd.scrollX * tfd.scale, -tfd.scrollY * tfd.scale);
    }
  },
  switchNativeScroll: function(nativeScroll) { //jshint ignore:line

  },
  /**
   * Calculate the scroll transform and, in case of native scrolling, set the inner dimensions and scroll position.
   *
   * @param {Object} tfd - the transformdata of the frame for which the scrolling should be calculated / set
   * @param {Number} scrollX - the scroll x position in the frame
   * @param {Number} scrollY - the scroll y position in the frame
   * @param {Boolean} intermediate - true if the scroll transform should be calculated before the transition ends.
                                     here, the (possibly wrong/old native scroll position is taken into account)
   * @returns {Type} Description
   */
  getScrollTransform: function(tfd, transition, intermediate) {

    var scrollX = transition.scrollX || tfd.scrollX;
    var scrollY = transition.scrollY || tfd.scrollY;

    if (!intermediate) {
      scrollX = transition.scrollX || tfd.initialScrollX;
      scrollY = transition.scrollY || tfd.initialScrollY;
    }

    // update frameTransformData
    tfd.scrollX = scrollX !== undefined ? scrollX : tfd.scrollX;
    tfd.scrollY = scrollY !== undefined ? scrollY : tfd.scrollY;
    // limit scrolling to [0,maxScroll]
    if (tfd.scrollX > tfd.maxScrollX) {
      tfd.scrollX = tfd.maxScrollX;
    }
    if (tfd.scrollY > tfd.maxScrollY) {
      tfd.scrollY = tfd.maxScrollY;
    }
    if (tfd.scrollX < 0) {
      tfd.scrollX = 0;
    }
    if (tfd.scrollY < 0) {
      tfd.scrollY = 0;
    }
    if (this.layer.nativeScroll()) {
      if (intermediate) {
        // in nativescroll, the scroll position is not applied via transform, but we need to compensate for a displacement due to the different scrollTop/Left values in the current frame and the target frame. This displacement is set to 0 after correcting the scrollTop/Left in the transitionEnd listener in transitionTo()
        var shiftX = 0;
        var shiftY = 0;

        shiftX = (this.layer.outerEl.scrollLeft || 0) - (tfd.scrollX * tfd.scale || 0);
        shiftY = (this.layer.outerEl.scrollTop || 0) - (tfd.scrollY * tfd.scale || 0);

        return this.scrollTransform(shiftX, shiftY);
      } else {
        // set inner size to set up native scrolling
        // FIXME: we shouldn't set the dimension in that we don't scroll
        if (tfd.isScrollY) {
          this.layer.innerEl.style.height = tfd.height + "px";
        } else {
          this.layer.innerEl.style.height = "100%";
        }
        if (tfd.isScrollX) {
          this.layer.innerEl.style.width = tfd.width + "px";
        } else {
          this.layer.innerEl.style.width = "100%";
        }
        // apply inital scroll position
        this.layer.outerEl.scrollLeft = tfd.scrollX * tfd.scale;
        this.layer.outerEl.scrollTop = tfd.scrollY * tfd.scale;
        // fix ios scroll bug
        if ($.browser === 'ios') {
          // ios safari will by default not have inertial scrolling on nested scrolling divs
          // this can be activated by -webkit-overflow-scrolling:touch on the container
          // however this introduces a bug: if the content is changed causing a change of the scrolling behaviour
          // e.g. a div smaller than the container enlarges to be larger than the container, the scrolling will not be switch on anymore
          // when temporarily switching off -webkit-overflow-scrolling this will be fixed.
          this.layer.outerEl.style['-webkit-overflow-scrolling'] = "auto";
          var that = this;
          setTimeout(function() {
            that.layer.outerEl.style['-webkit-overflow-scrolling'] = "touch";
          }, 1);
        }
        // needed by iOS safari; otherwise scrolling will be disabled if the scrollhelper was too small for scrolling before
        return this.scrollTransform(0, 0); // no transforms as scrolling is achieved by native scrolling
      }
    } else {
      // in transformscroll we add a transform representing the scroll position.
      return this.scrollTransform(-tfd.scrollX * tfd.scale, -tfd.scrollY * tfd.scale);
    }
  }
});

module.exports = ScrollTransformer;

},{"../kern/Kern.js":31,"./domhelpers.js":3}],28:[function(require,module,exports){
'use strict';
var pluginManager = require('./pluginmanager.js');
var gestureManager = require('./gestures/gesturemanager.js');
var defaults = require('./defaults.js');
var $ = require('./domhelpers.js');
var BaseView = require('./baseview.js');
/**
 * A View which can have child views
 * @param {StageData} dataModel
 * @param {object}        options
 * @extends GroupView
 */
var StageView = BaseView.extend({
  constructor: function (options) {
    options = options || {};
    options.childType = 'layer';
    BaseView.call(this, options);
        // get upper layer where unuseable gestures should be sent to.
    // this.parentLayer = this.getParentOfType('layer');
    // register for gestures
    gestureManager.register(this.outerEl, this.gestureListener.bind(this), {
      dragging: true,
      mouseDragging: this.draggable()
    });
  },
  /**
   * send gestures to child layers or send them up
   * @param {object} gesture 
   */
  gestureListener(gesture){
    // if (gesture.event._ljEvtHndld) return; // check if some inner layer has already dealt with the gesture/event
    this.getChildViews()[0].gestureListener(gesture); // FIXME: currently only supports sending to first layer
  },
  /**
   * Will add eventhandlers to specific events. It will handle a 'childrenChanged', 'sizeChanged' and
   * 'attributesChanged' event. It will also handle it's parent 'renderRequired' event.
   */
  registerEventHandlers: function () {
    var that = this;

    var onResize = function () {
      that.trigger('renderRequired');
    };

    BaseView.prototype.registerEventHandlers.call(this);

    window.addEventListener('resize', onResize, false);

    this.on('sizeChanged', onResize);
  },
  /**
   * Specifies what will need to be observed on the DOM element. (Attributes, Children and size)
   */
  startObserving: function () {
    BaseView.prototype.observe.call(this, this.innerEl, {
      attributes: true,
      children: true,
      size: true
    });
  },
  /** Will place a child view at the correct position.
   * @param {Object} childView - the childView
   */
  _renderChildPosition: function (childView) {
    if (childView.nodeType() === 1) {
      childView.unobserve();
      childView.outerEl.style.left = "0px";
      childView.outerEl.style.top = "0px";
      childView.startObserving();
    }
  },
  /**
   * Will parse the current DOM Element it's children.
   * @param {object} options - optional: includes addedNodes
   */
  _parseChildren: function (options) {
    var that = this;
    var autoLength = this.autoWidth() || this.autoHeight();

    var layerTransitioned = function (layerView) {
      return function (frameName, transition) {
        transition = transition || {};
        var currentFrameTransformData = layerView.currentFrameTransformData;
        var style = {
          transition: transition.duration || ''
        };
        if (that.autoWidth()) {
          //that.setWidth(currentFrameTransformData.width);
          style.width = currentFrameTransformData.width + "px";
          //style.transform = 'scaleX(' + (1 / that.width()) * currentFrameTransformData.width + ')';
        }
        if (that.autoHeight()) {
          //that.setHeight(currentFrameTransformData.height);
          style.height = currentFrameTransformData.height + "px";
          //style.transform = 'scaleY(' + (1 / that.height()) * currentFrameTransformData.height + ')';
        }
        that.applyStyles(style);

      };
    };

    BaseView.prototype._parseChildren.call(this, options);

    if (autoLength) {
      var found = null;
      for (var x = 0; x < this._cache.children.length; x++) {
        if (this._cache.children[x].name() === autoLength) {
          this._cache.children[x].on('transitionStarted', layerTransitioned(this._cache.children[x]));
          found = this._cache.children[x];
        }
      }
      if (!found && this._cache.children[0]) {
        this._cache.children[0].on('transitionStarted', layerTransitioned(this._cache.children[0]));
        found = this._cache.children[0];
      }
      // initial call to set autolength 
      if (found) (layerTransitioned(found))(); // Note this should work w/o parameters

    }
  },
}, {
    defaultProperties: {
      type: 'stage'
    },
    identify: function (element) {
      var type = $.getAttributeLJ(element, 'type');
      return null !== type && type.toLowerCase() === StageView.defaultProperties.type;
    }
  });
pluginManager.registerType('stage', StageView, defaults.identifyPriority.normal);
module.exports = StageView;

},{"./baseview.js":1,"./defaults.js":2,"./domhelpers.js":3,"./gestures/gesturemanager.js":6,"./pluginmanager.js":21}],29:[function(require,module,exports){
'use strict';

var Kern = require('../kern/Kern.js');
var layerJS = require('./layerjs.js');
var $ = require('./domhelpers.js');
/**
 *  class that will contain the state off all the stages, layers, frames
 *
 * @extends Kern.EventManager
 */
var State = Kern.EventManager.extend({
  constructor: function(doc) {
    this.document = doc || document;
    this.document._ljState = this;
    this.viewTypes = ['stage', 'layer', 'frame'];
    this.views = {}; // contains view and path; indexed by id
    this.layers = []; // list of all layers (ids)
    this.paths = {}; // lookup by path (and all path endings) for all ids
    this._transitionGroup = {};

    Kern.EventManager.call(this);
    this.previousState = undefined;
  },
  /**
   * Will register a View with the state
   * @param {object} a layerJSView
   */
  registerView: function(view) {
    // only add to state structure if the frame is really shown (attached to DOM)
    if (view.document.body.contains(view.outerEl)) {
      var id = view.id();
      if (this.views[id]) {
        if (this.views[id].view !== view) throw "state.registerView: duplicate HTML id '" + id + "'";
        return; // already registered;
      }
      var path = this.buildPath(view.outerEl); // get full path of view
      this.views[id] = {
        view: view,
        path: path
      };
      var that = this;
      this.getTrailingPaths(path).forEach(function(tp) { // add paths index for all path endings
        (that.paths[tp] = that.paths[tp] || []).push(id);
      });
      if (view.type() === 'layer') this.layers.push(id);
      view.on('childRemoved', function(child) {
        if ((child.parent && view.id() === child.parent.id()) || undefined === child.parent) { // only unregister if the parent of the child is still (WARN: this assumes, that the parent hasn't been removed yet)
          that.unregisterView(child);
        }
      }, {
        context: this
      });
      view.on('childAdded', function(child) {
        if (that.views[child.id()]) { // need to unregister view, happens with interstage, where the childAdded comes before childRemoved
          that.unregisterView(child);
        }
        that.registerView(child);
      }, {
        context: this
      });
      view.on('transitionStarted', function(frameName, transition) {
        var trigger = true;
        var payload = {};
        // check if state really changed
        if (transition && transition.lastFrameName === frameName && !(transition.hasOwnProperty('groupId') && this._transitionGroup.hasOwnProperty(transition.groupId))) return;
        // when a transitiongroup is defined, only call stateChanged when all layers in group have invoked 'transitionStarted'
        //  console.log(transition);
        if (transition && transition.hasOwnProperty('groupId') && this._transitionGroup.hasOwnProperty(transition.groupId)) {
          //  console.log(this._transitionGroup);
          this._transitionGroup[transition.groupId].length--;
          if (transition.lastFrameName !== frameName) this._transitionGroup[transition.groupId].changed = true; // remember if any of the transitions in this group really changed the state
          trigger = this._transitionGroup[transition.groupId].length === 0 && this._transitionGroup[transition.groupId].changed;
          payload = this._transitionGroup[transition.groupId].payload;
        }
        if (trigger && (!transition || (transition && !transition.isEvent))) {
          // statechanged should not be triggered it the transition is triggered by an event
          // trigger the event and keep a copy of the new state to compare it to next time
          this.trigger("stateChanged", this, payload);
        }
      }, {
        context: this
      });
      view.on('attributesChanged', this._attributesChangedEvent(view), {
        context: this
      });
      view.getChildViews().forEach(function(v) {
        that.registerView(v);
      });
    }
  },
  /**
   * unregisters a view
   *
   * @param {Type} Name - Description
   * @returns {Type} Description
   */
  unregisterView: function(view) {
    var i,
      id = view.id(),
      that = this;
    this.getTrailingPaths(this.views[id].path).forEach(function(tp) {
      var i = that.paths[tp].indexOf(id);
      that.paths[tp].splice(i, 1);
      if (that.paths[tp].length === 0) delete that.paths[tp];
    });
    if (view.type() === 'layer') {
      i = this.layers.indexOf(view);
      this.layers.splice(i, 1);
    }
    delete this.views[id]; // remove from views hash
    view.off(undefined, undefined, this);

    view.getChildViews().forEach(function(v) {
      that.unregisterView(v);
    });
  },
  /**
   * Will return all paths to active frames. Will be sorted in DOM order
   * @returns {array} An array than contains the paths of the active frames
   */
  exportState: function() {
    return this._exportState().state;
  },
  /**
   * Will return all paths to active frames. Will be sorted in DOM order. layers at default frame or with noURL will be given in "omittedStates", all relevant active frames are retunred in "state"
   * @returns {object} An object than contains an array of active states and an array of omittedStates.
   */
  exportMinimizedState: function() {
    return this._exportState(true);
  },
  /**
   * Will return all paths to active frames. Will be sorted in DOM order
   * @param {boolean} minimize When true, minimize the returned paths
   * @returns {object} An object than contains an array of active states and an array of omittedStates.
   */
  _exportState: function(minimize) {
    minimize = minimize || false;
    var result = {
      state: [],
      defaultState: [],
      omittedState: []
    };
    var that = this;

    var framePaths = that.exportStructure('frame');

    framePaths.forEach(function(framePath) {

      var notActive = framePath.endsWith('$');
      var path = framePath;
      if (notActive) {
        path = path.substr(0, path.length - 1);
      }

      var frames = that.paths[path];

      if (frames.length > 1)
        throw "state.exportState: multiple frames found for " + framePath;

      var frame = that.views[frames[0]].view;
      var layer = frame.parent;
      if (frame === layer.currentFrame) {
        if ((true === minimize) && (layer.noUrl())) {
          result.omittedState.push(framePath);
        } else if ((true === minimize) && (layer.currentFrame.name() === layer.defaultFrame() ||
            (null === layer.defaultFrame() && null === layer.currentFrame.outerEl.previousElementSibling))) {
          result.defaultState.push(framePath);
        } else {
          result.state.push(framePath);
        }
      } else if (notActive && frame.parent !== frame.originalParent) {
        result.state.push(framePath);
      } else if (notActive) {
        result.omittedState.push(framePath);
      }

    });

    this.layers.map(function(layerId) {
      return that.views[layerId].view; // get the a list of the layer dom element
    }).filter(function(layer) {
      return layer.currentFrame === null || layer.currentFrame === undefined;
    }).forEach(function(layer) {
      if (true === minimize && layer.noUrl()) {
        result.omittedState.push(that.views[layer.id()].path + ".!none");
      } else if (true === minimize && (layer.defaultFrame() === '!none')){
        result.defaultState.push(that.views[layer.id()].path + ".!none");
      } else {
        result.state.push(that.views[layer.id()].path + ".!none");
      }
    });

    return result;
  },
  /**
   * Will return all paths to frames, layers and stages. Will be sorted in DOM order
   * @param {string} type type of views to return the path of
   * @returns {array} An array of strings pointing to alle frames within the document
   */
  exportStructure: function(type) {
    var that = this;
    var elements = Object.keys(this.views).map(function(key) {
      return that.views[key].view.outerEl;
    }).sort($.comparePosition);

    if (type) {
      elements = elements.filter(function(element) {
        return element._ljView.type() === type;
      });
    }
    return elements.map(function(element) {
      var active = true;
      if (element._ljView.type() === 'frame') {
        var frameView = element._ljView;
        var layerView = frameView.parent;

        active = layerView.currentFrame === frameView;
      }

      return that.views[element._ljView.id()].path + (active ? '' : '$');
    });
  },
  /**
   * Will transition to a state
   *
   * @param {array} states State paths to transition to
   * @param {object} transitions Array of transition records, one per state path, or a single transition record for all paths. Can be undefined in which case a default transition is triggered
   */
  transitionTo: function(states, transitions, payload) {
    this._transitionTo(false, states, transitions, payload);
  },
  /**
   * Will transition to a state without with showframe or transitionTo
   *
   * @param {array} states State paths to transition to
   */
  showState: function(states, transitions, payload) {
    return this._transitionTo(true, states, transitions, payload);
  },
  /**
   * Will transition to a state without with showframe or transitionTo
   *
   * @param {boolean} showframe use showFrame? transitionTo otherwise
   * @param {array} states State paths to transition to
   * @param {object} transitions Array of transition records, one per state path, or a single transition record for all
   * @param {object} payload data object that will be passed on to the stateChanged handler
   */
  _transitionTo: function(showFrame, states, transitions, payload) {
    var that = this;
    transitions = transitions || [];
    payload = payload || {};
    payload.state = states;
    payload.transitions = transitions.map(function(transition) {
      return Kern._extend({}, transition);
    });

    // map the given state (list of (reduced) paths) into a list of fully specified paths (may be more paths than in states list)
    var paths = {}; // path to transition to
    var seenLayers = {}; // for deduplicating paths
    var seenTransition = {};

    var seenPath = function(path) {
      var originalLayer = paths[path].layer.id();
      seenTransition = paths[path].transition;
      delete paths[path];
      delete seenLayers[originalLayer];
    };


    states.map(function(state) {
      return that.resolvePath(state);
    }).forEach(function(layerframes, index) {
      for (var i = 0; i < layerframes.length; i++) {
        var layerframe = layerframes[i];
        var layer = layerframe.layer.id();
        seenTransition = {};
        var transition = Kern._extend(seenTransition, transitions[Math.min(index, transitions.length - 1)] || {});


        if (layerframe.noActivation !== true) {
          if (layerframe.isInterStage && paths.hasOwnProperty(layerframe.originalPath)) {
            seenPath(layerframe.originalPath);
          }

          if (paths.hasOwnProperty(layerframe.path)) {
            seenPath(layerframe.path);
          }

          if (seenLayers.hasOwnProperty(layer)) {
            seenPath(seenLayers[layer]);
          }

          seenLayers[layer] = layerframe.path;
        }
        if (layerframe.noActivation !== true || layerframe.isInterStage) { // only do the transition if its an activating transitions or an non activating transition that actually really leads to a frame moving to a new layer -> reason: the history machanism will do transitions to the full state which will create a lot on "non-sense" interstage transitons (frames should move to layer in which they already are)
          paths[layerframe.path] = { // ignore currently active frames
            layer: layerframe.layer,
            frameName: layerframe.frameName,
            transition: Kern._extend({
              noActivation: layerframe.noActivation
            }, seenTransition, transition)
          };
        }

      }
    });



    var pathRoutes = Object.getOwnPropertyNames(paths);
    // semaphore is necessary to let all transition run in sync
    var semaphore = new Kern.Semaphore(pathRoutes.length);
    // group transitions to fire only one stateChanged event for all transitions triggered in this call
    var groupId = $.uniqueID('group');
    this._transitionGroup[groupId] = {
      length: pathRoutes.length,
      payload: payload
    };

    // execute transition
    for (var i = 0; i < pathRoutes.length; i++) {
      var path = paths[pathRoutes[i]];
      path.transition.semaphore = semaphore;
      path.transition.groupId = groupId;

      if (showFrame) {
        path.layer.showFrame(path.frameName, path.transition); // switch to frame
      } else {
        path.layer.transitionTo(path.frameName, path.transition); // switch to frame
      }
    }
    return transitions.length > 0;
  },
  /**
   * create the path of a particular view
   *
   * @param {HTMLElement} node - the HTML node for which the layerJS path should be build
   * @param {boolean} reCalculate - if true, no lookups will be used
   * @returns {string} the path
   */
  buildPath: function(node, reCalculate) {
    if (!node) return "";

    if (!node._ljView)
      return this.buildPath(node.parentNode);

    var parentView = node._ljView.parent;

    var parentPath = (!reCalculate && parentView) ? this.views[parentView.id()].path : this.buildPath(node.parentNode);

    if (parentPath !== '')
      parentPath += '.';

    var path = parentPath + node._ljView.name();

    return path;
  },
  /**
   * calculate all different endings of a path
   *
   * @param {string} path - the full path
   * @returns {Array} array of path endings
   */
  getTrailingPaths: function(path) {
    var paths = [path];
    while ((path = path.replace(/^[^\.]*\.?/, ''))) {
      paths.push(path);
    }
    return paths;
  },
  /**
   * Resolves the layer that will execute the transition for a given path and the frame name (could be a special name)
   *
   * @param {string} path - a path of the state
   * @param {HTMLElement} context - the HTML context where the name should be resolved (e.g. where the link was located)
   * @returns {Array} Array of layerViews and the frameNames;
   */
  resolvePath: function(path, context) {

    var noActivation = path.endsWith('$');

    if (noActivation) {
      path = path.substr(0, path.length - 1);
    }

    var i, contextpath = context && this.buildPath(context),
      segments = path.split('.'),
      frameName = segments.pop(),
      isSpecial = (frameName[0] === '!'),
      layerpath = segments.join('.'),
      candidates = (isSpecial ? (layerpath ? this.paths[layerpath] : this.layers) : this.paths[path]); // if special frame name, only search for layer

    if (!isSpecial && (!candidates || candidates.length === 0) && layerpath) {
      candidates = this.paths[layerpath];
    }

    if (!candidates || candidates.length === 0) return []; // couldn't find any matchin path; return empty array
    if (candidates.length > 1 && contextpath) { // check whether we can reduce list of candidates be resolving relative to the context path
      var reduced = [];
      while (reduced.length === 0 && contextpath) { // if we don't find any frames in context, move context path one up and try again
        for (i = 0; i < candidates.length; i++) {
          if (this.views[candidates[i]].path.startsWith(contextpath)) reduced.push(candidates[i]);
        }
        contextpath = contextpath.replace(/\.?[^\.]$/, '');
      }
      candidates = (reduced.length ? reduced : candidates); // take original candidates if context didn't contain any
    }
    var result = [];
    for (i = 0; i < candidates.length; i++) {
      var view = this.views[candidates[i]].view;
      var fullPath = this.views[candidates[i]].path;
      if (isSpecial) {
        if (view.type() !== 'layer') throw "state: expected layer name in front of '" + frameName + "'";
        result.push({
          layer: view,
          frameName: frameName,
          path: fullPath + "." + frameName + (noActivation ? '$' : '')
        });
      } else {
        if (view.type() === 'frame') { // for frames return a bit more information which is helpful to trigger the transition
          result.push({
            layer: view.parent,
            view: view,
            frameName: frameName,
            path: fullPath + (noActivation ? '$' : ''),
            active: (undefined !== view.parent.currentFrame && null !== view.parent.currentFrame) ? view.parent.currentFrame.name() === frameName : false,
            noActivation: noActivation
          });
        } else if (view.type() === 'layer') {

          if (fullPath.endsWith(path)) {
            result.push({
              view: view,
              path: fullPath
            });
          } else {
            var paths = this.resolvePath(frameName);

            if (paths.length === 1) {
              result.push({
                layer: view,
                frameName: frameName,
                view: paths[0].view,
                path: fullPath + '.' + frameName + (noActivation ? '$' : ''),
                active: false,
                isInterStage: true,
                originalPath: paths[0].path,
                noActivation: noActivation
              });
            }
          }
        } else {
          //stages
          result.push({
            view: view,
            path: fullPath
          });
        }
      }
    }

    return result;
  },
  /**
   * Will return the handler for an attributesChanged event
   *
   * @param {object}  a view
   * @returns {function} function that will be called when an attributesChanged event is invoked
   */
  _attributesChangedEvent: function(view) {
    var that = this;
    return function(attributes) {
      if (attributes['lj-name'] || attributes['data-lj-name'] || attributes.id) {
        that.unregisterView(view);
        that.registerView(view);
      }
    };
  },
  /**
   * Will return a view based on the path
   * @param {string} path document who's state will be exported
   * @returns {Object} A view
   */
  // getViewByPath: function(path) { // FIXME, shouldn't resolvePath be used for this? This may be faster, but then we could integrate this shortcut into resolvePath
  //   var result;
  //   if (undefined !== this.paths[path]) {
  //     for (var i = 0; i < this.paths[path].length; i++) {
  //       var id = this.paths[path][i];
  //       if (this.views[id].path === path) {
  //         result = this.views[id].view;
  //       }
  //     }
  //   }
  //
  //   return result;
  // }
});
/**
 * Resolves the state for a specific document
 *
 * @param {object} doc - A document where the state needs to be retrieved, if undefined the global document will be used
 * @returns {object} The current state object for the document
 */
layerJS.getState = function(doc) {
  doc = doc || document;
  return doc._ljState || new State(doc);
};
module.exports = State;

},{"../kern/Kern.js":31,"./domhelpers.js":3,"./layerjs.js":7}],30:[function(require,module,exports){
'use strict';
// class holding a 2D affine transform matrix
//     | a b tx |
// A = | c d ty |
//     | 0 0 1  |

var TMat = function(init) {
  if (init instanceof Array) {
    this.a = init[0];
    this.b = init[1];
    this.c = init[2];
    this.d = init[3];
    this.tx = init[4];
    this.ty = init[5];
  } else { // unit matrix
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
  }
};
TMat.prototype = {
  prod: function(o) {
    //matrix multiplication for our special matrix
    // A = this * o
    var a = this.a * o.a + this.b * o.c;
    var b = this.a * o.b + this.b * o.d;
    var tx = this.a * o.tx + this.b * o.ty + this.tx;
    var c = this.c * o.a + this.d * o.c;
    var d = this.c * o.b + this.d * o.d;
    var ty = this.c * o.tx + this.d * o.ty + this.ty;
    return new TMat([a, b, c, d, tx, ty]);
  },
  transform: function() {
    // create css transform string
    return "matrix(" + this.a.toFixed(4) + "," + this.c.toFixed(4) + "," + this.b.toFixed(4) + "," + this.d.toFixed(4) + "," + this.tx.toFixed(4) + "," + this.ty.toFixed(4) + ")";
  },
  /**
   * ##transform_nomatrix
   * create CSS transform string w/o matrix, here translation is last
   * @param {number?} addrot rotation to be added? as rotation is not unique add addrot to the rotate() part if supplied by caller
   * @return {string} css string
   */
  transform_nomatrix: function(addrot) {
    var transl = this.get_translation_equal();
    var scale = this.get_scale_equal();
    var rot = this.get_rotation_equal();
    transl = TMat.Tscale(scale > 0 ? (1 / scale) : scale).prod(TMat.Trot(-rot)).transform_vec(transl);
    // avoid 1.xe-xxx numbers
    if (Math.abs(transl.x) < 0.000001) transl.x = 0;
    // avoid 1.xe-xxx numbers
    if (Math.abs(transl.y) < 0.000001) transl.y = 0;
    var cssstring = "scale(" + this.get_scale_equal() + ") " + "rotate(" + (this.get_rotation_equal() + (addrot ? addrot : 0)) + "deg) " + TMat.getTranslateString(transl.x, transl.y);
    return cssstring;
  },
  transform_vec: function(v) {
    // transform a vector
    return {
      x: this.a * v.x + this.b * v.y + this.tx,
      y: this.c * v.x + this.d * v.y + this.ty
    };
  },
  invert: function() {
    // inverse matrix of an affine transform matrix
    var D = 1 / ((this.a * this.d - this.b * this.c) || 1);
    var a = D * this.d;
    var b = -D * this.b;
    var c = -D * this.c;
    var d = D * this.a;
    var tx = -a * this.tx - b * this.ty;
    var ty = -c * this.tx - d * this.ty;
    return new TMat([a, b, c, d, tx, ty]);
  },
  get_scale_equal: function() { // WARNING only works for equal x and y scale
    // return current scale of transform
    var x = this.a;
    var y = this.c;
    return Math.sqrt(x * x + y * y);
  },
  get_rotation_equal: function() { // WARNING only works for equal x and y scale
    //https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    return (Math.atan2(this.b, this.a) * (180 / Math.PI));
    /*var s = this.get_scale_equal();
    var phi = 180 * Math.acos(this.a / s) / Math.PI;
    if (this.c < 0) phi = 360 - phi;
    return phi;*/
  },
  get_translation_equal: function() { // WARNING only works for equal x and y scale and translation applied last
    return {
      x: this.tx,
      y: this.ty
    };
  },
  set_scale_equal: function(scale) { // WARNING only works for equal x and y scale and translation applied last
    var cs = this.get_scale_equal();
    this.a *= scale / cs;
    this.b *= scale / cs;
    this.c *= scale / cs;
    this.d *= scale / cs;
  },
  copy: function() {
    return new TMat([this.a, this.b, this.c, this.d, this.tx, this.ty]);
  },
  clearShift: function() {
    this.tx = 0;
    this.ty = 0;
    return this;
  }
};
TMat.Trot = function(r) {
  var t = r * Math.PI / 180;
  return new TMat([Math.cos(t), -Math.sin(t), Math.sin(t), Math.cos(t), 0, 0]);
};
TMat.Tscale = function(s) {
  return new TMat([s, 0, 0, s, 0, 0]);
};
TMat.Tscalexy = function(x, y) {
  return new TMat([x, 0, 0, y, 0, 0]);
};
TMat.Ttrans = function(x, y) {
  return new TMat([1, 0, 0, 1, x, y]);
};
TMat.Tall = function(x, y, s, r) {
  var t = r * Math.PI / 180;
  return new TMat([s * Math.cos(t), -s * Math.sin(t), s * Math.sin(t), s * Math.cos(t), x, y]);
};
/**
 * ##getTranslateString
 * Since Mac browsers have a problem with `translate3d` we will not use this
 * on any of their devices. This function is the switch.
 * @param {float} x
 * @param {float} y
 * @return {string} translate string for CSS transform
 */
TMat.getTranslateString = function(x, y) {
  return "translate3d(" + x + "px," + y + "px,0)";
};
// Return the model for the module
module.exports = TMat;

},{}],31:[function(require,module,exports){
'use strict';
//jshint unused:false

// Copyright (c) 2015, Thomas Handorf, ThomasHandorf@gmail.com, all rights reserverd.

(function() { // private scope

  var scope = function() { // a scope which could be given a dependency as parameter (e.g. AMD or node require)
    /**
     * extend an object with properties from one or multiple objects
     * @param {Object} obj the object to be extended
     * @param {arguments} arguments list of objects that extend the object
     */
    var _extend = function(obj) {
      var len = arguments.length;
      if (len < 2) throw ("too few arguments in _extend");
      if (obj === null) throw ("no object provided in _extend");
      // run through extending objects
      for (var i = 1; i < len; i++) {
        var props = Object.keys(arguments[i]); // this does not run through the prototype chain; also does not return special properties like length or prototype
        // run through properties of extending object
        for (var j = 0; j < props.length; j++) {
          obj[props[j]] = arguments[i][props[j]];
        }
      }
      return obj;
    };
    /**
     * extend an object with properties from one or multiple object. Keep properties of earlier objects if present.
     * @param {Object} obj the object to be extended
     * @param {arguments} arguments list of objects that extend the object
     */
    var _extendKeep = function(obj) {
      var len = arguments.length;
      if (len < 2) throw ("too few arguments in _extend");
      if (obj === null) throw ("no object provided in _extend");
      // run through extending objects
      for (var i = 1; i < len; i++) {
        var props = Object.keys(arguments[i]); // this does not run through the prototype chain; also does not return special properties like length or prototype
        // run through properties of extending object
        for (var j = 0; j < props.length; j++) {
          if (!obj.hasOwnProperty(props[j])) obj[props[j]] = arguments[i][props[j]];
        }
      }
      return obj;
    };
    /**
     * returns a simple deep copy of an object. Only considers plain object and arrays (and of course scalar values)
     *
     * @param {object} obj - The object to be deep cloned
     * @returns {obj} a fresh copy of the object
     */
    var _deepCopy = function(obj) {
      if (typeof obj === 'object') {
        var temp;
        if (Array.isArray(obj)) {
          temp = [];
          for (var i = obj.length - 1; i >= 0; i--) {
            temp[i] = _deepCopy(obj[i]);
          }
          return temp;
        }
        if (obj === null) {
          return null;
        }
        temp = {};
        for (var k in Object.keys(obj)) {
          if (obj.hasOwnProperty(k)) {
            temp[k] = _deepCopy(obj[k]);
          }
        }
        return temp;
      }
      return obj;
    };
    /**
     * extend an object with properties from one or multiple object. Keep properties of earlier objects if present.
     * Will deep copy object and arrays from the exteding objects (needed for copying default values in Model)
     * @param {Object} obj the object to be extended
     * @param {arguments} arguments list of objects that extend the object
     */
    var _extendKeepDeepCopy = function(obj) {
      var len = arguments.length;
      if (len < 2) throw ("too few arguments in _extend");
      if (obj === null) throw ("no object provided in _extend");
      // run through extending objects
      for (var i = 1; i < len; i++) {
        var props = Object.keys(arguments[i]); // this does not run through the prototype chain; also does not return special properties like length or prototype
        // run through properties of extending object
        for (var j = 0; j < props.length; j++) {
          if (!obj.hasOwnProperty(props[j])) {
            obj[props[j]] = _deepCopy(arguments[i][props[j]]);
          }
        }
      }
      return obj;
    };
    // the module
    var Kern = {
      _extend: _extend,
      _extendKeep: _extendKeep,
      _extendKeepDeepCopy: _extendKeepDeepCopy
    };
    /**
     * Kern.Base is the Base class providing extend capability
     */
    var Base = Kern.Base = function() {

    };
    // create a contructor with a (function) name
    function createNamedConstructor(name, constructor) {
      // wrapper function created dynamically constructor to allow instances to be identified in the debugger
      var fn = new Function('c', 'return function ' + name + '(){c.apply(this, arguments)}'); //jshint ignore:line
      return fn(constructor);
    }
    // this function can extend classes; it's a class function, not a object method
    Base.extend = function(prototypeProperties, staticProperties) {
      // create child as a constructor function which is
      // either supplied in prototypeProperties.constructor or set up
      // as a generic constructor function calling the parents contructor
      prototypeProperties = prototypeProperties || {};
      staticProperties = staticProperties || {};
      var parent = this; // Note: here "this" is the class (which is the constructor function in JS)
      var child = (prototypeProperties.hasOwnProperty('constructor') ? prototypeProperties.constructor : function() {
        return parent.apply(this, arguments); // Note: here "this" is actually the object (instance)
      });
      // name constructor (for beautiful stacktraces) if name is given
      if (staticProperties && staticProperties.className) {
        child = createNamedConstructor(staticProperties.className, child);
      }
      delete prototypeProperties.constructor; // this should not be set again.
      // create an instance of parent and assign it to childs prototype
      child.prototype = Object.create(parent.prototype); // NOTE: this does not call the parent's constructor (instead of "new parent()")
      child.prototype.constructor = child; //NOTE: this seems to be an oldish artefact; we do it anyways to be sure (http://stackoverflow.com/questions/9343193/why-set-prototypes-constructor-to-its-constructor-function)
      // extend the prototype by further (provided) prototyp properties of the new class
      _extend(child.prototype, prototypeProperties);
      // extend static properties (e.g. the extend static method itself)
      _extend(child, this, staticProperties);
      return child;
    };
    /**
     * a class that can handle events
     */
    var EventManager = Kern.EventManager = Base.extend({
      constructor: function() {
        this.__listeners__ = {};
      },
      /**
       * register event listerner
       * @param {string} event event name
       * @param {Function} callback the callback function
       * @param {Object} options { ignoreSender: this }
       * @return {Object} this object
       */
      on: function(event, callback, options) {
        this.__listeners__[event] = this.__listeners__[event] || [];
        this.__listeners__[event].push({
          callback: callback,
          options: options || {}
        });
        return this;
      },
      /**
       * register event listerner. will be called only once, then unregistered.
       * @param {string} event event name
       * @param {Function} callback the callback function
       * @param {Object} options { ignoreSender: this }
       * @return {Object} this object
       */
      once: function(event, callback, options) {
        var that = this;
        var helper = function() {
          callback.apply(this, arguments);
          that.off(event, helper);
        };
        this.on(event, helper, options);
        return this;
      },
      /**
       * unregister event handler.
       * @param {string} event the event name
       * @param {Function} callback the callback
       * @param {Object} context the object that registered the listener (if given as options.context when binding)
       * @return {Object} this object
       */
      off: function(event, callback, context) {
        var i, listeners;
        if (event) {
          if (callback || context) {
            // remove specific callback / context for given event
            listeners = this.__listeners__[event];
            for (i = 0; i < listeners.length; i++) {
              if ((!callback || listeners[i].callback === callback) && (!context || listeners[i].options.context === context)) {
                listeners.splice(i, 1);
              }
            }
          } else {
            // remove all callbacks for event
            delete this.__listeners__[event];
          }
        } else {
          if (callback || context) {
            // remove specific callback in all event
            for (var ev in this.__listeners__) {
              if (this.__listeners__.hasOwnProperty(ev)) {
                listeners = this.__listeners__[ev];
                for (i = 0; i < listeners.length; i++) {
                  if ((!callback || listeners[i].callback === callback) && (!context || listeners[i].options.context === context)) {
                    listeners.splice(i, 1);
                  }
                }
              }
            }
          } else {
            // remove all callbacks from all events
            this.__listeners__ = {};
          }
        }
        return this;
      },
      /**
       * trigger an event
       * @param {string} event event name
       * @param {...} arguments further arguments
       * @return {object} this object
       */
      trigger: function(event) {
        if (this.__listeners__[event]) {
          for (var i = 0; i < this.__listeners__[event].length; i++) {

            // copy arguments as we need to remove the first argument (event)
            // and arguments is read only
            // loop is faster then .slice method
            var length = arguments.length;
            var args = new Array(length - 1);
            for (var j = 0; j < length - 1; j++) {
              args[j] = arguments[j + 1];
            }
            // call the callback
            var listener = this.__listeners__[event][i];
            listener.callback.apply(listener.options.context || this, args);
          }
        }
        return this;
      },
      /**
       * trigger an event. This also notes the object or channel that sends the event. This is compared to the ignoreSender option provided during the .on() registration.
       * @param {object} object/channel that fired the event. You can use the object (e.g. this) or just a string that identifies a channel as long as it is consitien with what you have specified as ignoreSender option when registering the listener.
       * @param {string} event event name
       * @param {...} arguments further arguments
       * @return {object} this object
       */
      triggerBy: function(sender, event) {
        if (this.__listeners__[event]) {
          for (var i = 0; i < this.__listeners__[event].length; i++) {

            // check if the sender equals the ignoreSender from the options
            if (this.__listeners__[event][i].options.ignoreSender && this.__listeners__[event][i].options.ignoreSender === sender) {
              continue;
            }

            // copy arguments as we need to remove the first argument (event)
            // and arguments is read only
            var length = arguments.length;
            var args = new Array(length - 2);
            for (var j = 0; j < length - 2; j++) {
              args[j] = arguments[j + 2];
            }
            // call the callback
            var listener = this.__listeners__[event][i];
            listener.callback.apply(listener.options.context || this, args);
          }
        }
        return this;
      },
    });

    /**
     * A simple Promise implementation
     *
     */
    var Promise = Kern.Promise = Base.extend({
      constructor: function() {
        this.state = undefined;
        this.value = undefined;
        this.reason = undefined;
      },
      /**
       * register resolve and reject handlers
       *
       * @param {Function} fn - function to be called if Promise is resolved.
       * first parameter is the value of the Promise
       * can return a further promise whice is passes to the returned promise
       * @param {Function} errFn - function called if promise is rejected
       * first parameter is a reason1
       * @returns {Promise} return a further promise which allows chaining of then().then().then() calls
       */
      then: function(fn, errFn) {
        this.nextPromise = new Promise();
        this.fn = fn;
        this.errFn = errFn;
        if (this.state !== undefined) this.execute();
        return this.nextPromise;
      },
      /**
       * resolve the promise
       *
       * @param {Anything} value - value of the promise
       * @returns {void}
       */
      resolve: function(value) {
        if (this.state !== undefined) {
          console.warn("Promise: double resolve/reject (ignored).");
          return;
        }
        this.state = true;
        this.value = value;
        this.execute();
        return this;
      },
      /**
       * reject the promise
       *
       * @param {Anything} reason - specify the reason of rejection
       * @returns {void}
       */
      reject: function(reason) {
        if (this.state !== undefined) {
          console.warn("Promise: double resolve/reject (ignored).");
          return;
        }
        this.state = false;
        this.reason = reason;
        this.execute();
        return this;
      },
      /**
       * internal fulfilemnt function. Will pass the promise behaviour of the resolve function to the Promise returned in then()
       *
       * @returns {void}
       */
      execute: function() {
        if (!this.nextPromise) return;
        var that = this;
        if (this.state === true) {
          if (!this.fn) return;
          try {
            var result = this.fn(this.value);
            if (result instanceof Promise) {
              result.then(function(value) {
                that.nextPromise.resolve(value);
              }, function(reason) {
                that.nextPromise.reject(reason);
              });
            } else {
              that.nextPromise.resolve(result);
            }
          } catch (e) {
            console.log("in Promise handler:", e);
            this.nextPromise.reject(e);
          }
        } else if (this.state === false) {
          if (this.errFn) this.errFn(this.reason);
          this.nextPromise.reject(this.reason);
        }
      }
    });
    /**
     * a simple semaphore which registers a set of stakeholders (just counts up the number of them) and the lets them synchronize through calling semaphore.sync().then(...)
     *
     */
    var Semaphore = Kern.Semaphore = Base.extend({
      constructor: function(num) {
        this.num = num || 0;
        this.cc = 0;
        this.ps = [];
        this.ls = [];
        this.ls2 = [];
      },
      /**
       * register a stakeholder for this semaphore
       *
       * @returns {Semaphore} the semaphore itself to be passed on
       */
      register: function() {
        this.num++;
        return this;
      },
      /**
       * register a listener for this semaphore which will not influence the waiting process
       *
       * @param {boolean} before - determines if listener fires before stakeholders
       * @returns {Semaphore} the semaphore itself to be passed on
       */
      listen: function(before) {
        var p = new Kern.Promise();

        if (before) {
          this.ls.push(p);
        } else {
          this.ls2.push(p);
        }

        return p;
      },
      /**
       * reduces the number of stakeholders by one. If this was the last one it will actually trigger sync.
       *
       * @returns {void}
       */
      skip: function() {
        this.num--;
        if (this.num < 0) throw "semaphore: skipped stakeholder that was not registered";
        if (this.num === this.cc) {
          this.cc--; // let on more to go for triggering synchronization in normal syn method (may become negative)
          this.sync();
        }
      },
      /**
       * wait for all other stakeholders. returns a promise that will be fullfilled if all other stakeholders are in sync state as well (have called sync())
       *
       * @returns {Promise} the promise to be resolved when all stakeholders are in sync.
       */
      sync: function() {
        var p;
        this.cc++;
        this.ps.push(p = new Kern.Promise());
        if (this.cc === this.num) {
          for (var x = 0; x < this.ls.length; x++) {
            this.ls[x].resolve(this.num);
          }
          for (var i = 0; i < this.ps.length; i++) {
            this.ps[i].resolve(this.num);
          }
          var that = this;
          setTimeout(function() { // needs to be called with setTimeout to call listeners after then() function of last sync
            for (var i = 0; i < that.ls2.length; i++) {
              that.ls2[i].resolve(that.num);
            }
          }, 0);
        } else if (this.cc >= this.num) {
          throw "semaphore: more syncs than stakeholders";
        }
        return p;
      }
    });
    /**
     * Simple queue which makes sure entries are executed one after each other. Add a new entry with myQueue.add() which returns a promise. Do whatever has to be done with this entry within the promise's then() part and afterwards call myQueue.continue() to start triggering the next entry.
     *
     */
    var Queue = Kern.Queue = Base.extend({
      constructor: function() {
        this.q = []; // a queue of promises which will be fullfilled one after each other
        this.waiting = false; // are we waiting for a queue entry to complete (NOTE: this could be true even if q[] is empty)
      },
      /**
       * add an entry to the queue. A new promise is returned that will resolve when all previous entries have finished
       *
       * @param {string} category - a category so we can debounce
       * @returns {Type} Description
       */
      add: function(category) {
        var p = new Kern.Promise();
        if (!this.waiting) {
          p.resolve();
          this.waiting = true;
        } else {
          var debounce = this.q.length > 0 && category === this.q[this.q.length - 1].category;
          if (undefined !== category && debounce) {
            this.q.pop().promise.reject();
          }
          this.q.push({
            promise: p,
            category: category
          });
        }
        return p;
      },
      /**
       * indicate that the execution of the current entry has finished and that the next entry can resolve (if any)
       *
       * @param {Type} Name - Description
       * @returns {Type} Description
       */
      continue: function() {
        if (this.q.length) {
          var p = this.q.shift().promise;
          p.resolve();
        } else {
          this.waiting = false;
        }
      },
      /**
       * indicate that the execution of the current entry has finished and that the next entry can resolve (if any)
       *
       * @param {Type} Name - Description
       * @returns {Type} Description
       */
      clear: function() {
        while (this.q.length > 0) {
          var p = this.q.shift().promise;
          p.reject();
        }
        this.waiting = false;
      }
    });
    return Kern;
  };

  // export to the outside
  //
  // test whether this is in a requirejs environment
  if (typeof define === "function" && define.amd) {
    define("Kern", [], scope);
  } else if (typeof module !== 'undefined' && module.exports) { // node js environment
    var Kern = scope();
    module.exports = Kern;
    // this.Kern = Kern; export to the global object in nodejs
  } else { // standard browser environment
    window.Kern = scope(); // else just export 'Kern' globally using globally defined underscore (_)
  }
})();

},{}],32:[function(require,module,exports){
'use strict';

require("./kern/Kern.js");
require("./framework/layerjs.js");
require("./framework/state.js");

/* others*/
require("./framework/pluginmanager.js");
require("./framework/layoutmanager.js");
require("./framework/parsemanager.js");
require("./framework/layouts/layerlayout.js");
require("./framework/layouts/slidelayout.js");
require("./framework/layouts/canvaslayout.js");
require("./framework/gestures/gesturemanager.js");
require("./framework/router/router.js");

/* data objects*/
require("./framework/defaults.js");

/* view objects*/
/* The order in which the views are required is imported for the pluginmanager.identify */
require("./framework/layerview.js");
require("./framework/frameview.js");
require("./framework/stageview.js");
var href = window.location.href;
var FileRouter = require("./framework/router/filerouter.js");
var HashRouter = require("./framework/router/hashrouter.js");
var $ = require('./framework/domhelpers.js');
var initialized = false;

layerJS.init = function() {
  if (initialized) return;
  initialized = true;
  layerJS.parseManager.parseDocument();

  var routerAttribute = $.getAttributeLJ(document.body, 'router');
  if (routerAttribute && 'filerouter' === routerAttribute.toLowerCase()) {
    layerJS.router.addRouter(new FileRouter({
      cacheCurrent: true
    }));
  }

  layerJS.router.addRouter(new HashRouter());


  // disable cache completely until we find a solution for wrongly stored stages (see issue #45)
  layerJS.router.navigate(href, null, true, true).then(function() {
    // layerJS.router.cache = true;
  });
};
// initialze layerjs
if (document.readyState === "interactive") { // dom is ready -> initialize
  if (!$.getAttributeLJ(document.body, "no-init") && !initialized) {
    layerJS.init();
  }
} else {
  document.addEventListener("DOMContentLoaded", function() {
    if (!$.getAttributeLJ(document.body, "no-init") && !initialized) {
      layerJS.init();
    }
  });
}

console.log('*** layerJS *** checkout http://layerjs.org *** happy to help you: developers@layerjs.org ***');

},{"./framework/defaults.js":2,"./framework/domhelpers.js":3,"./framework/frameview.js":4,"./framework/gestures/gesturemanager.js":6,"./framework/layerjs.js":7,"./framework/layerview.js":8,"./framework/layoutmanager.js":9,"./framework/layouts/canvaslayout.js":10,"./framework/layouts/layerlayout.js":11,"./framework/layouts/slidelayout.js":12,"./framework/parsemanager.js":20,"./framework/pluginmanager.js":21,"./framework/router/filerouter.js":23,"./framework/router/hashrouter.js":24,"./framework/router/router.js":25,"./framework/stageview.js":28,"./framework/state.js":29,"./kern/Kern.js":31}]},{},[32]);
