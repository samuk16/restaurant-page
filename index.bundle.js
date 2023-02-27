"use strict";
(self["webpackChunkrestaurant_page"] = self["webpackChunkrestaurant_page"] || []).push([["index"],{

/***/ "./node_modules/animejs/lib/anime.es.js":
/*!**********************************************!*\
  !*** ./node_modules/animejs/lib/anime.es.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * anime.js v3.2.1
 * (c) 2020 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */

// Defaults

var defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: 'normal',
  autoplay: true,
  timelineOffset: 0
};

var defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  endDelay: 0,
  easing: 'easeOutElastic(1, .5)',
  round: 0
};

var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'];

// Caching

var cache = {
  CSS: {},
  springs: {}
};

// Utils

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

function applyArguments(func, args) {
  return func.apply(null, args);
}

var is = {
  arr: function (a) { return Array.isArray(a); },
  obj: function (a) { return stringContains(Object.prototype.toString.call(a), 'Object'); },
  pth: function (a) { return is.obj(a) && a.hasOwnProperty('totalLength'); },
  svg: function (a) { return a instanceof SVGElement; },
  inp: function (a) { return a instanceof HTMLInputElement; },
  dom: function (a) { return a.nodeType || is.svg(a); },
  str: function (a) { return typeof a === 'string'; },
  fnc: function (a) { return typeof a === 'function'; },
  und: function (a) { return typeof a === 'undefined'; },
  nil: function (a) { return is.und(a) || a === null; },
  hex: function (a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a); },
  rgb: function (a) { return /^rgb/.test(a); },
  hsl: function (a) { return /^hsl/.test(a); },
  col: function (a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)); },
  key: function (a) { return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes'; },
};

// Easings

function parseEasingParameters(string) {
  var match = /\(([^)]+)\)/.exec(string);
  return match ? match[1].split(',').map(function (p) { return parseFloat(p); }) : [];
}

// Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js

function spring(string, duration) {

  var params = parseEasingParameters(string);
  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
  var velocity =  minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
  var w0 = Math.sqrt(stiffness / mass);
  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  var a = 1;
  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  function solver(t) {
    var progress = duration ? (duration * t) / 1000 : t;
    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }
    if (t === 0 || t === 1) { return t; }
    return 1 - progress;
  }

  function getDuration() {
    var cached = cache.springs[string];
    if (cached) { return cached; }
    var frame = 1/6;
    var elapsed = 0;
    var rest = 0;
    while(true) {
      elapsed += frame;
      if (solver(elapsed) === 1) {
        rest++;
        if (rest >= 16) { break; }
      } else {
        rest = 0;
      }
    }
    var duration = elapsed * frame * 1000;
    cache.springs[string] = duration;
    return duration;
  }

  return duration ? solver : getDuration;

}

// Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function

function steps(steps) {
  if ( steps === void 0 ) steps = 10;

  return function (t) { return Math.ceil((minMax(t, 0.000001, 1)) * steps) * (1 / steps); };
}

// BezierEasing https://github.com/gre/bezier-easing

var bezier = (function () {

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 }
  function C(aA1)      { return 3.0 * aA1 }

  function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT }
  function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) { aB = currentT; } else { aA = currentT; }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < 4; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) { return aGuessT; }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function bezier(mX1, mY1, mX2, mY2) {

    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) { return; }
    var sampleValues = new Float32Array(kSplineTableSize);

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {

      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample;

      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }

    }

    return function (x) {
      if (mX1 === mY1 && mX2 === mY2) { return x; }
      if (x === 0 || x === 1) { return x; }
      return calcBezier(getTForX(x), mY1, mY2);
    }

  }

  return bezier;

})();

var penner = (function () {

  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)

  var eases = { linear: function () { return function (t) { return t; }; } };

  var functionEasings = {
    Sine: function () { return function (t) { return 1 - Math.cos(t * Math.PI / 2); }; },
    Circ: function () { return function (t) { return 1 - Math.sqrt(1 - t * t); }; },
    Back: function () { return function (t) { return t * t * (3 * t - 2); }; },
    Bounce: function () { return function (t) {
      var pow2, b = 4;
      while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
      return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2)
    }; },
    Elastic: function (amplitude, period) {
      if ( amplitude === void 0 ) amplitude = 1;
      if ( period === void 0 ) period = .5;

      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, .1, 2);
      return function (t) {
        return (t === 0 || t === 1) ? t : 
          -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
      }
    }
  };

  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];

  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () { return function (t) { return Math.pow(t, i + 2); }; };
  });

  Object.keys(functionEasings).forEach(function (name) {
    var easeIn = functionEasings[name];
    eases['easeIn' + name] = easeIn;
    eases['easeOut' + name] = function (a, b) { return function (t) { return 1 - easeIn(a, b)(1 - t); }; };
    eases['easeInOut' + name] = function (a, b) { return function (t) { return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 
      1 - easeIn(a, b)(t * -2 + 2) / 2; }; };
    eases['easeOutIn' + name] = function (a, b) { return function (t) { return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : 
      (easeIn(a, b)(t * 2 - 1) + 1) / 2; }; };
  });

  return eases;

})();

function parseEasings(easing, duration) {
  if (is.fnc(easing)) { return easing; }
  var name = easing.split('(')[0];
  var ease = penner[name];
  var args = parseEasingParameters(easing);
  switch (name) {
    case 'spring' : return spring(easing, duration);
    case 'cubicBezier' : return applyArguments(bezier, args);
    case 'steps' : return applyArguments(steps, args);
    default : return applyArguments(ease, args);
  }
}

// Strings

function selectString(str) {
  try {
    var nodes = document.querySelectorAll(str);
    return nodes;
  } catch(e) {
    return;
  }
}

// Arrays

function filterArray(arr, callback) {
  var len = arr.length;
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  var result = [];
  for (var i = 0; i < len; i++) {
    if (i in arr) {
      var val = arr[i];
      if (callback.call(thisArg, val, i, arr)) {
        result.push(val);
      }
    }
  }
  return result;
}

function flattenArray(arr) {
  return arr.reduce(function (a, b) { return a.concat(is.arr(b) ? flattenArray(b) : b); }, []);
}

function toArray(o) {
  if (is.arr(o)) { return o; }
  if (is.str(o)) { o = selectString(o) || o; }
  if (o instanceof NodeList || o instanceof HTMLCollection) { return [].slice.call(o); }
  return [o];
}

function arrayContains(arr, val) {
  return arr.some(function (a) { return a === val; });
}

// Objects

function cloneObject(o) {
  var clone = {};
  for (var p in o) { clone[p] = o[p]; }
  return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o1) { o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p]; }
  return o;
}

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o2) { o[p] = is.und(o1[p]) ? o2[p] : o1[p]; }
  return o;
}

// Colors

function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? ("rgba(" + (rgb[1]) + ",1)") : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) { return r + r + g + g + b + b; } );
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return ("rgba(" + r + "," + g + "," + b + ",1)");
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1], 10) / 360;
  var s = parseInt(hsl[2], 10) / 100;
  var l = parseInt(hsl[3], 10) / 100;
  var a = hsl[4] || 1;
  function hue2rgb(p, q, t) {
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }
    if (t < 1/6) { return p + (q - p) * 6 * t; }
    if (t < 1/2) { return q; }
    if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
    return p;
  }
  var r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return ("rgba(" + (r * 255) + "," + (g * 255) + "," + (b * 255) + "," + a + ")");
}

function colorToRgb(val) {
  if (is.rgb(val)) { return rgbToRgba(val); }
  if (is.hex(val)) { return hexToRgba(val); }
  if (is.hsl(val)) { return hslToRgba(val); }
}

// Units

function getUnit(val) {
  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
  if (split) { return split[1]; }
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') { return 'px'; }
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) { return 'deg'; }
}

// Values

function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) { return val; }
  return val(animatable.target, animatable.id, animatable.total);
}

function getAttribute(el, prop) {
  return el.getAttribute(prop);
}

function convertPxToUnit(el, value, unit) {
  var valueUnit = getUnit(value);
  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) { return value; }
  var cached = cache.CSS[value + unit];
  if (!is.und(cached)) { return cached; }
  var baseline = 100;
  var tempEl = document.createElement(el.tagName);
  var parentEl = (el.parentNode && (el.parentNode !== document)) ? el.parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  var factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  var convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}

function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}

function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || (is.svg(el) && el[prop]))) { return 'attribute'; }
  if (is.dom(el) && arrayContains(validTransforms, prop)) { return 'transform'; }
  if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) { return 'css'; }
  if (el[prop] != null) { return 'object'; }
}

function getElementTransforms(el) {
  if (!is.dom(el)) { return; }
  var str = el.style.transform || '';
  var reg  = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m; while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }
  return transforms;
}

function getTransformValue(el, propName, animatable, unit) {
  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
  var value = getElementTransforms(el).get(propName) || defaultVal;
  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms['last'] = propName;
  }
  return unit ? convertPxToUnit(el, value, unit) : value;
}

function getOriginalTargetValue(target, propName, unit, animatable) {
  switch (getAnimationType(target, propName)) {
    case 'transform': return getTransformValue(target, propName, animatable, unit);
    case 'css': return getCSSValue(target, propName, unit);
    case 'attribute': return getAttribute(target, propName);
    default: return target[propName] || 0;
  }
}

function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);
  if (!operator) { return to; }
  var u = getUnit(to) || 0;
  var x = parseFloat(from);
  var y = parseFloat(to.replace(operator[0], ''));
  switch (operator[0][0]) {
    case '+': return x + y + u;
    case '-': return x - y + u;
    case '*': return x * y + u;
  }
}

function validateValue(val, unit) {
  if (is.col(val)) { return colorToRgb(val); }
  if (/\s/g.test(val)) { return val; }
  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  if (unit) { return unitLess + unit; }
  return unitLess;
}

// getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el) {
  return Math.PI * 2 * getAttribute(el, 'r');
}

function getRectLength(el) {
  return (getAttribute(el, 'width') * 2) + (getAttribute(el, 'height') * 2);
}

function getLineLength(el) {
  return getDistance(
    {x: getAttribute(el, 'x1'), y: getAttribute(el, 'y1')}, 
    {x: getAttribute(el, 'x2'), y: getAttribute(el, 'y2')}
  );
}

function getPolylineLength(el) {
  var points = el.points;
  var totalLength = 0;
  var previousPos;
  for (var i = 0 ; i < points.numberOfItems; i++) {
    var currentPos = points.getItem(i);
    if (i > 0) { totalLength += getDistance(previousPos, currentPos); }
    previousPos = currentPos;
  }
  return totalLength;
}

function getPolygonLength(el) {
  var points = el.points;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
}

// Path animation

function getTotalLength(el) {
  if (el.getTotalLength) { return el.getTotalLength(); }
  switch(el.tagName.toLowerCase()) {
    case 'circle': return getCircleLength(el);
    case 'rect': return getRectLength(el);
    case 'line': return getLineLength(el);
    case 'polyline': return getPolylineLength(el);
    case 'polygon': return getPolygonLength(el);
  }
}

function setDashoffset(el) {
  var pathLength = getTotalLength(el);
  el.setAttribute('stroke-dasharray', pathLength);
  return pathLength;
}

// Motion path

function getParentSvgEl(el) {
  var parentEl = el.parentNode;
  while (is.svg(parentEl)) {
    if (!is.svg(parentEl.parentNode)) { break; }
    parentEl = parentEl.parentNode;
  }
  return parentEl;
}

function getParentSvg(pathEl, svgData) {
  var svg = svgData || {};
  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
  var rect = parentSvgEl.getBoundingClientRect();
  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
  var width = rect.width;
  var height = rect.height;
  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox: viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width,
    h: height,
    vW: viewBox[2],
    vH: viewBox[3]
  }
}

function getPath(path, percent) {
  var pathEl = is.str(path) ? selectString(path)[0] : path;
  var p = percent || 100;
  return function(property) {
    return {
      property: property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    }
  }
}

function getPathProgress(path, progress, isPathTargetInsideSVG) {
  function point(offset) {
    if ( offset === void 0 ) offset = 0;

    var l = progress + offset >= 1 ? progress + offset : 0;
    return path.el.getPointAtLength(l);
  }
  var svg = getParentSvg(path.el, path.svg);
  var p = point();
  var p0 = point(-1);
  var p1 = point(+1);
  var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;
  var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;
  switch (path.property) {
    case 'x': return (p.x - svg.x) * scaleX;
    case 'y': return (p.y - svg.y) * scaleY;
    case 'angle': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  }
}

// Decompose value

function decomposeValue(val, unit) {
  // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
  // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var value = validateValue((is.pth(val) ? val.totalLength : val), unit) + '';
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: (is.str(val) || unit) ? value.split(rgx) : []
  }
}

// Animatables

function parseTargets(targets) {
  var targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
  return filterArray(targetsArray, function (item, pos, self) { return self.indexOf(item) === pos; });
}

function getAnimatables(targets) {
  var parsed = parseTargets(targets);
  return parsed.map(function (t, i) {
    return {target: t, id: i, total: parsed.length, transforms: { list: getElementTransforms(t) } };
  });
}

// Properties

function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings);
  // Override duration if easing is a spring
  if (/^spring/.test(settings.easing)) { settings.duration = spring(settings.easing); }
  if (is.arr(prop)) {
    var l = prop.length;
    var isFromTo = (l === 2 && !is.obj(prop[0]));
    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration)) { settings.duration = tweenSettings.duration / l; }
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = {value: prop};
    }
  }
  var propArray = is.arr(prop) ? prop : [prop];
  return propArray.map(function (v, i) {
    var obj = (is.obj(v) && !is.pth(v)) ? v : {value: v};
    // Default delay value should only be applied to the first tween
    if (is.und(obj.delay)) { obj.delay = !i ? tweenSettings.delay : 0; }
    // Default endDelay value should only be applied to the last tween
    if (is.und(obj.endDelay)) { obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0; }
    return obj;
  }).map(function (k) { return mergeObjects(k, settings); });
}


function flattenKeyframes(keyframes) {
  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) { return Object.keys(key); })), function (p) { return is.key(p); })
  .reduce(function (a,b) { if (a.indexOf(b) < 0) { a.push(b); } return a; }, []);
  var properties = {};
  var loop = function ( i ) {
    var propName = propertyNames[i];
    properties[propName] = keyframes.map(function (key) {
      var newKey = {};
      for (var p in key) {
        if (is.key(p)) {
          if (p == propName) { newKey.value = key[p]; }
        } else {
          newKey[p] = key[p];
        }
      }
      return newKey;
    });
  };

  for (var i = 0; i < propertyNames.length; i++) loop( i );
  return properties;
}

function getProperties(tweenSettings, params) {
  var properties = [];
  var keyframes = params.keyframes;
  if (keyframes) { params = mergeObjects(flattenKeyframes(keyframes), params); }
  for (var p in params) {
    if (is.key(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }
  return properties;
}

// Tweens

function normalizeTweenValues(tween, animatable) {
  var t = {};
  for (var p in tween) {
    var value = getFunctionValue(tween[p], animatable);
    if (is.arr(value)) {
      value = value.map(function (v) { return getFunctionValue(v, animatable); });
      if (value.length === 1) { value = value[0]; }
    }
    t[p] = value;
  }
  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}

function normalizeTweens(prop, animatable) {
  var previousTween;
  return prop.tweens.map(function (t) {
    var tween = normalizeTweenValues(t, animatable);
    var tweenValue = tween.value;
    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    var toUnit = getUnit(to);
    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    var previousValue = previousTween ? previousTween.to.original : originalValue;
    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    var fromUnit = getUnit(from) || getUnit(originalValue);
    var unit = toUnit || fromUnit;
    if (is.und(to)) { to = previousValue; }
    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
    tween.isColor = is.col(tween.from.original);
    if (tween.isColor) { tween.round = 1; }
    previousTween = tween;
    return tween;
  });
}

// Tween progress

var setProgressValue = {
  css: function (t, p, v) { return t.style[p] = v; },
  attribute: function (t, p, v) { return t.setAttribute(p, v); },
  object: function (t, p, v) { return t[p] = v; },
  transform: function (t, p, v, transforms, manual) {
    transforms.list.set(p, v);
    if (p === transforms.last || manual) {
      var str = '';
      transforms.list.forEach(function (value, prop) { str += prop + "(" + value + ") "; });
      t.style.transform = str;
    }
  }
};

// Set Value helper

function setTargetsValue(targets, properties) {
  var animatables = getAnimatables(targets);
  animatables.forEach(function (animatable) {
    for (var property in properties) {
      var value = getFunctionValue(properties[property], animatable);
      var target = animatable.target;
      var valueUnit = getUnit(value);
      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      var unit = valueUnit || getUnit(originalValue);
      var to = getRelativeValue(validateValue(value, unit), originalValue);
      var animType = getAnimationType(target, property);
      setProgressValue[animType](target, property, to, animatable.transforms, true);
    }
  });
}

// Animations

function createAnimation(animatable, prop) {
  var animType = getAnimationType(animatable.target, prop.name);
  if (animType) {
    var tweens = normalizeTweens(prop, animatable);
    var lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: lastTween.end,
      delay: tweens[0].delay,
      endDelay: lastTween.endDelay
    }
  }
}

function getAnimations(animatables, properties) {
  return filterArray(flattenArray(animatables.map(function (animatable) {
    return properties.map(function (prop) {
      return createAnimation(animatable, prop);
    });
  })), function (a) { return !is.und(a); });
}

// Create Instance

function getInstanceTimings(animations, tweenSettings) {
  var animLength = animations.length;
  var getTlOffset = function (anim) { return anim.timelineOffset ? anim.timelineOffset : 0; };
  var timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration; })) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.delay; })) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration - anim.endDelay; })) : tweenSettings.endDelay;
  return timings;
}

var instanceID = 0;

function createNewInstance(params) {
  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  var properties = getProperties(tweenSettings, params);
  var animatables = getAnimatables(params.targets);
  var animations = getAnimations(animatables, properties);
  var timings = getInstanceTimings(animations, tweenSettings);
  var id = instanceID;
  instanceID++;
  return mergeObjects(instanceSettings, {
    id: id,
    children: [],
    animatables: animatables,
    animations: animations,
    duration: timings.duration,
    delay: timings.delay,
    endDelay: timings.endDelay
  });
}

// Core

var activeInstances = [];

var engine = (function () {
  var raf;

  function play() {
    if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {
      raf = requestAnimationFrame(step);
    }
  }
  function step(t) {
    // memo on algorithm issue:
    // dangerous iteration over mutable `activeInstances`
    // (that collection may be updated from within callbacks of `tick`-ed animation instances)
    var activeInstancesLength = activeInstances.length;
    var i = 0;
    while (i < activeInstancesLength) {
      var activeInstance = activeInstances[i];
      if (!activeInstance.paused) {
        activeInstance.tick(t);
        i++;
      } else {
        activeInstances.splice(i, 1);
        activeInstancesLength--;
      }
    }
    raf = i > 0 ? requestAnimationFrame(step) : undefined;
  }

  function handleVisibilityChange() {
    if (!anime.suspendWhenDocumentHidden) { return; }

    if (isDocumentHidden()) {
      // suspend ticks
      raf = cancelAnimationFrame(raf);
    } else { // is back to active tab
      // first adjust animations to consider the time that ticks were suspended
      activeInstances.forEach(
        function (instance) { return instance ._onDocumentVisibility(); }
      );
      engine();
    }
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return play;
})();

function isDocumentHidden() {
  return !!document && document.hidden;
}

// Public Instance

function anime(params) {
  if ( params === void 0 ) params = {};


  var startTime = 0, lastTime = 0, now = 0;
  var children, childrenLength = 0;
  var resolve = null;

  function makePromise(instance) {
    var promise = window.Promise && new Promise(function (_resolve) { return resolve = _resolve; });
    instance.finished = promise;
    return promise;
  }

  var instance = createNewInstance(params);
  var promise = makePromise(instance);

  function toggleInstanceDirection() {
    var direction = instance.direction;
    if (direction !== 'alternate') {
      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
    }
    instance.reversed = !instance.reversed;
    children.forEach(function (child) { return child.reversed = instance.reversed; });
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
  }

  function seekChild(time, child) {
    if (child) { child.seek(time - child.timelineOffset); }
  }

  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (var i = 0; i < childrenLength; i++) { seekChild(time, children[i]); }
    } else {
      for (var i$1 = childrenLength; i$1--;) { seekChild(time, children[i$1]); }
    }
  }

  function setAnimationsProgress(insTime) {
    var i = 0;
    var animations = instance.animations;
    var animationsLength = animations.length;
    while (i < animationsLength) {
      var anim = animations[i];
      var animatable = anim.animatable;
      var tweens = anim.tweens;
      var tweenLength = tweens.length - 1;
      var tween = tweens[tweenLength];
      // Only check for keyframes if there is more than one tween
      if (tweenLength) { tween = filterArray(tweens, function (t) { return (insTime < t.end); })[0] || tween; }
      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      var strings = tween.to.strings;
      var round = tween.round;
      var numbers = [];
      var toNumbersLength = tween.to.numbers.length;
      var progress = (void 0);
      for (var n = 0; n < toNumbersLength; n++) {
        var value = (void 0);
        var toNumber = tween.to.numbers[n];
        var fromNumber = tween.from.numbers[n] || 0;
        if (!tween.isPath) {
          value = fromNumber + (eased * (toNumber - fromNumber));
        } else {
          value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
        }
        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round;
          }
        }
        numbers.push(value);
      }
      // Manual Array.reduce for better performances
      var stringsLength = strings.length;
      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];
        for (var s = 0; s < stringsLength; s++) {
          var a = strings[s];
          var b = strings[s + 1];
          var n$1 = numbers[s];
          if (!isNaN(n$1)) {
            if (!b) {
              progress += n$1 + ' ';
            } else {
              progress += n$1 + b;
            }
          }
        }
      }
      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }

  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough) { instance[cb](instance); }
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--;
    }
  }

  function setInstanceProgress(engineTime) {
    var insDuration = instance.duration;
    var insDelay = instance.delay;
    var insEndDelay = insDuration - instance.endDelay;
    var insTime = adjustTime(engineTime);
    instance.progress = minMax((insTime / insDuration) * 100, 0, 100);
    instance.reversePlayback = insTime < instance.currentTime;
    if (children) { syncInstanceChildren(insTime); }
    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback('begin');
    }
    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      setCallback('loopBegin');
    }
    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }
    if ((insTime >= insEndDelay && instance.currentTime !== insDuration) || !insDuration) {
      setAnimationsProgress(insDuration);
    }
    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback('changeBegin');
      }
      setCallback('change');
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback('changeComplete');
      }
    }
    instance.currentTime = minMax(insTime, 0, insDuration);
    if (instance.began) { setCallback('update'); }
    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();
      if (!instance.remaining) {
        instance.paused = true;
        if (!instance.completed) {
          instance.completed = true;
          setCallback('loopComplete');
          setCallback('complete');
          if (!instance.passThrough && 'Promise' in window) {
            resolve();
            promise = makePromise(instance);
          }
        }
      } else {
        startTime = now;
        setCallback('loopComplete');
        instance.loopBegan = false;
        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      }
    }
  }

  instance.reset = function() {
    var direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remaining = instance.loop;
    children = instance.children;
    childrenLength = children.length;
    for (var i = childrenLength; i--;) { instance.children[i].reset(); }
    if (instance.reversed && instance.loop !== true || (direction === 'alternate' && instance.loop === 1)) { instance.remaining++; }
    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  };

  // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)
  instance._onDocumentVisibility = resetTime;

  // Set Value helper

  instance.set = function(targets, properties) {
    setTargetsValue(targets, properties);
    return instance;
  };

  instance.tick = function(t) {
    now = t;
    if (!startTime) { startTime = now; }
    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
  };

  instance.seek = function(time) {
    setInstanceProgress(adjustTime(time));
  };

  instance.pause = function() {
    instance.paused = true;
    resetTime();
  };

  instance.play = function() {
    if (!instance.paused) { return; }
    if (instance.completed) { instance.reset(); }
    instance.paused = false;
    activeInstances.push(instance);
    resetTime();
    engine();
  };

  instance.reverse = function() {
    toggleInstanceDirection();
    instance.completed = instance.reversed ? false : true;
    resetTime();
  };

  instance.restart = function() {
    instance.reset();
    instance.play();
  };

  instance.remove = function(targets) {
    var targetsArray = parseTargets(targets);
    removeTargetsFromInstance(targetsArray, instance);
  };

  instance.reset();

  if (instance.autoplay) { instance.play(); }

  return instance;

}

// Remove targets from animation

function removeTargetsFromAnimations(targetsArray, animations) {
  for (var a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeTargetsFromInstance(targetsArray, instance) {
  var animations = instance.animations;
  var children = instance.children;
  removeTargetsFromAnimations(targetsArray, animations);
  for (var c = children.length; c--;) {
    var child = children[c];
    var childAnimations = child.animations;
    removeTargetsFromAnimations(targetsArray, childAnimations);
    if (!childAnimations.length && !child.children.length) { children.splice(c, 1); }
  }
  if (!animations.length && !children.length) { instance.pause(); }
}

function removeTargetsFromActiveInstances(targets) {
  var targetsArray = parseTargets(targets);
  for (var i = activeInstances.length; i--;) {
    var instance = activeInstances[i];
    removeTargetsFromInstance(targetsArray, instance);
  }
}

// Stagger helpers

function stagger(val, params) {
  if ( params === void 0 ) params = {};

  var direction = params.direction || 'normal';
  var easing = params.easing ? parseEasings(params.easing) : null;
  var grid = params.grid;
  var axis = params.axis;
  var fromIndex = params.from || 0;
  var fromFirst = fromIndex === 'first';
  var fromCenter = fromIndex === 'center';
  var fromLast = fromIndex === 'last';
  var isRange = is.arr(val);
  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  var val2 = isRange ? parseFloat(val[1]) : 0;
  var unit = getUnit(isRange ? val[1] : val) || 0;
  var start = params.start || 0 + (isRange ? val1 : 0);
  var values = [];
  var maxValue = 0;
  return function (el, i, t) {
    if (fromFirst) { fromIndex = 0; }
    if (fromCenter) { fromIndex = (t - 1) / 2; }
    if (fromLast) { fromIndex = t - 1; }
    if (!values.length) {
      for (var index = 0; index < t; index++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index));
        } else {
          var fromX = !fromCenter ? fromIndex%grid[0] : (grid[0]-1)/2;
          var fromY = !fromCenter ? Math.floor(fromIndex/grid[0]) : (grid[1]-1)/2;
          var toX = index%grid[0];
          var toY = Math.floor(index/grid[0]);
          var distanceX = fromX - toX;
          var distanceY = fromY - toY;
          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (axis === 'x') { value = -distanceX; }
          if (axis === 'y') { value = -distanceY; }
          values.push(value);
        }
        maxValue = Math.max.apply(Math, values);
      }
      if (easing) { values = values.map(function (val) { return easing(val / maxValue) * maxValue; }); }
      if (direction === 'reverse') { values = values.map(function (val) { return axis ? (val < 0) ? val * -1 : -val : Math.abs(maxValue - val); }); }
    }
    var spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + (spacing * (Math.round(values[i] * 100) / 100)) + unit;
  }
}

// Timeline

function timeline(params) {
  if ( params === void 0 ) params = {};

  var tl = anime(params);
  tl.duration = 0;
  tl.add = function(instanceParams, timelineOffset) {
    var tlIndex = activeInstances.indexOf(tl);
    var children = tl.children;
    if (tlIndex > -1) { activeInstances.splice(tlIndex, 1); }
    function passThrough(ins) { ins.passThrough = true; }
    for (var i = 0; i < children.length; i++) { passThrough(children[i]); }
    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    var tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    var ins = anime(insParams);
    passThrough(ins);
    children.push(ins);
    var timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();
    if (tl.autoplay) { tl.play(); }
    return tl;
  };
  return tl;
}

anime.version = '3.2.1';
anime.speed = 1;
// TODO:#review: naming, documentation
anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeTargetsFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;
anime.random = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (anime);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./KosugiMaru-Regular.ttf */ "./src/KosugiMaru-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./japFood1.png */ "./src/japFood1.png"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! ./sushiNew.png */ "./src/sushiNew.png"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! ./ramen.png */ "./src/ramen.png"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! ./udon.png */ "./src/udon.png"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(/*! ./yakitori.png */ "./src/yakitori.png"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(/*! ./tempuraNew.png */ "./src/tempuraNew.png"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_7___ = new URL(/* asset import */ __webpack_require__(/*! ./okonomiya.png */ "./src/okonomiya.png"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_8___ = new URL(/* asset import */ __webpack_require__(/*! ./tree.png */ "./src/tree.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);
var ___CSS_LOADER_URL_REPLACEMENT_7___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_7___);
var ___CSS_LOADER_URL_REPLACEMENT_8___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_8___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n*{\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n    font-family: 'KosugiMaru-Regular', sans-serif;\n}\n\n/* @font-face {\n    font-family: 'Roboto-Regular';\n    src: url('./Roboto-Regular.ttf') format('ttf');\n    font-weight: 600;\n    font-style: normal;\n} */\n@font-face {\n    font-family: 'KosugiMaru-Regular';\n    src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format('ttf');\n    font-weight: 600;\n    font-style: normal;\n}\n  \n\nbody{\n\n    background-color: #0E0605;\n}\n\n.content{\n\n    width: 100vw;\n    height: 100vh;\n    display: grid;\n\n    grid-template-columns: 30% 70%;\n\n}\n\n.containerImg{\n    height: 100vh;\n    background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n    opacity: 0;\n    background-repeat: no-repeat;\n\n}\n\n.containerPresentation{\n    \n    display: flex;\n    flex-direction: column;\n\n    align-items: center;\n    justify-content: center;\n    gap: 70px;\n\n    padding: 0 0 0 30px;\n\n    opacity: 0;\n}\n\n.containerTitlePresentation > p:nth-child(2){\n\n    font-size:5rem;\n}\n\n\n.textPresentation{\n    user-select: none;\n    color: #5F4A30;\n\n    transition: all .2s ease-in-out;\n\n}\n\n.textPresentation:hover{\n\n    filter: brightness(2);\n}\n\n.containerFloatMenu{\n\n    position: absolute;\n    width: 440px;\n    top: 30px;\n    right: 0;\n    left: 0;\n    margin: auto;\n    display: flex;\n\n    justify-content: center;\n    align-items: center;\n\n    gap: 30px;\n\n    border-radius: 16px;\n    backdrop-filter: blur(10px);\n\n    /* box-shadow:  0 0 15px #DBAF57; */\n\n    outline: 2px solid #dbaf57;\n\n    padding: 10px;\n    user-select: none;\n\n}\n\n.containerFloatMenu > p:nth-child(1){\n\n    cursor: pointer;\n\n    padding: 10px 16px;\n    border-radius: 16px;\n    transition: all .12s ease-in-out;\n\n    outline-width: 0px;\n\n    \n}\n.containerFloatMenu:nth-child(2){\n\n    cursor: pointer;\n    \n}\n\n.containerNameRestaurant > p:nth-child(2){\n\n    transition: all .12s ease-in-out;\n\n}\n\n.containerNameRestaurant:hover > p:nth-child(2){\n\n    filter: brightness(1.5);\n}\n.containerFloatMenu > p:nth-child(3){\n\n    cursor: pointer;\n\n    padding: 10px 16px ;\n    border-radius: 16px;\n    transition: all .13s ease-in-out;\n\n    /* outline: 2px transparent #DBAF57; */\n    \n}\n\n.containerFloatMenu > p:nth-child(1):hover{\n\n    transform: scale(1.05);\n    background-color: #dbaf57;\n    color: #0E0605;\n\n}\n\n.containerFloatMenu > p:nth-child(3):hover{\n\n    transform: scale(1.05);\n    background-color: #dbaf57;\n    color: #0E0605;\n \n}\n\n.containerNameRestaurant{\n\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    font-size: 1.5rem;\n    cursor: pointer;\n}\n\n.textFloatMenu{\n    color: #fff;\n}\n\np{\n    color: #fff;\n}\n\n.japLetters{\n\n    color: #DBAF57;\n    letter-spacing: 4px;\n}\n\n.titlePresentation{\n\n    font-size: 3.5rem;\n    font-weight: bold;\n    user-select: none;\n\n    transition: all .13s ease-in-out;\n\n}\n\n.titlePresentation:hover{\n\n    filter: brightness(1.3);\n}\n\n.btnMenu{\n\n    background-color: #BA8F47;\n\n    padding: 16px;\n\n    width: 200px;\n\n    text-align: center;\n\n    border-radius: 100px;\n\n    transition: all .13s ease-in-out;\n\n    cursor: pointer;\n\n    user-select: none;\n}\n\n\n.btnMenu:hover{\n    transform: scale(1.05);\n    filter: brightness(1.5);\n\n}\n\n.hoverBtnBrightness{ animation: hoverBtnBrightness .12s linear both;}\n\n@keyframes hoverBtnBrightness{\n    0%{\n        filter: brightness(1);\n    }\n\n    25%{\n        filter: brightness(1.1);\n    }\n\n    50%{\n        filter: brightness(1.2);\n    }\n\n    75%{\n        filter: brightness(1.3);\n    }\n\n    100%{\n        filter: brightness(1.4);    \n    }\n}\n\n.blur-out-contract{animation:blur-out-contract .3s linear both} \n\n@keyframes blur-out-contract{\n    0%{\n        position: absolute;\n        transform:scale(1);\n        filter:blur(.01px);\n        \n    }\n    100%{\n        position: absolute;\n        transform:scale(0);\n        filter:blur(12px);\n        opacity:0\n    }\n}\n\n/* MENU------------------------------------------------------------------------------- */\n\n.containerItemsMenu{\n    \n    width: 100vw;\n\n    display: grid;\n    \n    /* grid-template-columns: repeat(auto-fit, minmax(400px,max-content)); */\n    grid-template-columns: repeat(3,400px);\n    grid-template-rows: repeat(2, 300px);\n\n    /* justify-content: center; */\n    place-content: center;\n\n    gap: 30px;\n}\n\n.itemMenu{\n\n    border-radius: 16px;\n\n    border-style: solid;\n    border-color: #EFC279;\n    border-width: 4px;\n\n    display: flex;\n    flex-direction: column;\n    justify-content: end;\n\n    cursor: pointer;\n}\n\n.containerNameItem{\n\n    display: flex;\n\n    justify-content: center;\n    align-items: center;\n    padding: 16px;\n    backdrop-filter: blur(10px);\n\n    color: #fff;\n\n    /* border-radius: 0 0 16px 16px; */\n    border-radius: 10px;\n    user-select: none;\n    pointer-events: none;\n}\n\n.item1{\n\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ");\n    background-size: cover;\n    background-position: center;\n}\n.item2{\n\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ");\n    background-size: cover;\n    background-position: center;\n}\n.item3{\n\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ");\n    background-size: cover;\n    background-position: center;\n}\n.item4{\n\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ");\n    background-size: cover;\n    background-position: center;\n}\n.item5{\n\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_6___ + ");\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-position: center;\n}\n.item6{\n\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_7___ + ");\n    background-size: cover;\n    background-position: center;\n}\n\n.itemMenu:hover{\n\n    transform: scale(0.95);\n\n}\n\n.blur-out{\n    animation:blur-out .3s linear both;\n} \n\n@keyframes blur-out{\n    0%{\n        filter:blur(0px);\n        opacity:1\n    }\n    100%{\n            filter:blur(12px);\n            opacity:0\n    }\n}\n\n\n/* CONTACT------------------------------------------------------------------------------- */\n\n.containerItemsContact{\n\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_8___ + ");\n    background-repeat: no-repeat;\n    background-position: bottom;\n    width: 100vw;\n\n    display: flex;\n    flex-direction: column;\n\n    justify-content: center;\n    align-items: center;\n    gap: 30px;\n    \n\n}\n\n.itemsContact{\n\n    width: 500px;\n    height: 300px;\n\n    border-radius: 16px;\n\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n\n\n    backdrop-filter: blur(10px);\n\n    border: solid 4px #A66918;\n}\n\n.containerInfoContact{\n\n    display: flex;\n    gap: 30px;\n\n}\n\n.containerInfoAddress{\n    display: flex;\n\n    gap: 30px;\n}\n\n.pInfoAddress{\n    margin: auto;\n    font-size: 1.1rem;\n}\n\n.pInfoContact{\n    margin: auto;\n    font-size: 1.1rem;\n\n}\n\n.titleContact{\n    position: absolute;\n\n    top: 30px;\n    font-size: 1.5rem;\n}\n\n.titleAddress{\n    position: absolute;\n\n    top: 30px;\n    font-size: 1.5rem;\n}\n\n\n@media screen and (max-width: 560px){\n\n    .itemsContact{\n\n        width: 350px;\n        height: 200px;\n    }\n\n}\n@media screen and (max-width: 460px){\n    \n    .containerNameRestaurant{\n\n        font-size: 1rem;\n    }\n    .containerFloatMenu{\n\n        width: 350px;\n\n        gap: 10px;\n    }\n\n    .containerPresentation{\n        gap: 10px;\n    }\n\n}\n@media screen and (max-width: 1321px){\n    \n    .containerItemsMenu{\n\n        grid-template-columns: repeat(2, 400px);\n        grid-template-rows: repeat(3, 300px);\n\n        margin: 150px 0;\n        transition: all .13s ease-in-out;\n        padding: 0 0 100px 0;\n    }\n\n    \n\n    .containerImg{\n\n        background-image: none;\n    }\n\n    .containerPresentation{\n        width: 100vw;\n        padding: 0;\n    }\n    \n    .textPresentation{\n        width: 600px;\n    }\n\n}\n@media screen and (max-width: 896px){\n    \n    .containerItemsMenu{\n\n        grid-template-columns: repeat(2, 300px);\n        grid-template-rows: repeat(3, 200px);\n\n        margin: 150px 0;\n    }\n\n    \n}\n@media screen and (max-width: 678px){\n    \n    .containerItemsMenu{\n\n        grid-template-columns: repeat(1, 300px);\n        grid-template-rows: repeat(6, 200px);\n\n        margin: 150px 0;\n        padding: 0 0 100px 0;\n    }\n\n    .textPresentation{\n        width: 300px;\n    }\n\n}", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["\n*{\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n    font-family: 'KosugiMaru-Regular', sans-serif;\n}\n\n/* @font-face {\n    font-family: 'Roboto-Regular';\n    src: url('./Roboto-Regular.ttf') format('ttf');\n    font-weight: 600;\n    font-style: normal;\n} */\n@font-face {\n    font-family: 'KosugiMaru-Regular';\n    src: url('./KosugiMaru-Regular.ttf') format('ttf');\n    font-weight: 600;\n    font-style: normal;\n}\n  \n\nbody{\n\n    background-color: #0E0605;\n}\n\n.content{\n\n    width: 100vw;\n    height: 100vh;\n    display: grid;\n\n    grid-template-columns: 30% 70%;\n\n}\n\n.containerImg{\n    height: 100vh;\n    background-image: url(./japFood1.png);\n    opacity: 0;\n    background-repeat: no-repeat;\n\n}\n\n.containerPresentation{\n    \n    display: flex;\n    flex-direction: column;\n\n    align-items: center;\n    justify-content: center;\n    gap: 70px;\n\n    padding: 0 0 0 30px;\n\n    opacity: 0;\n}\n\n.containerTitlePresentation > p:nth-child(2){\n\n    font-size:5rem;\n}\n\n\n.textPresentation{\n    user-select: none;\n    color: #5F4A30;\n\n    transition: all .2s ease-in-out;\n\n}\n\n.textPresentation:hover{\n\n    filter: brightness(2);\n}\n\n.containerFloatMenu{\n\n    position: absolute;\n    width: 440px;\n    top: 30px;\n    right: 0;\n    left: 0;\n    margin: auto;\n    display: flex;\n\n    justify-content: center;\n    align-items: center;\n\n    gap: 30px;\n\n    border-radius: 16px;\n    backdrop-filter: blur(10px);\n\n    /* box-shadow:  0 0 15px #DBAF57; */\n\n    outline: 2px solid #dbaf57;\n\n    padding: 10px;\n    user-select: none;\n\n}\n\n.containerFloatMenu > p:nth-child(1){\n\n    cursor: pointer;\n\n    padding: 10px 16px;\n    border-radius: 16px;\n    transition: all .12s ease-in-out;\n\n    outline-width: 0px;\n\n    \n}\n.containerFloatMenu:nth-child(2){\n\n    cursor: pointer;\n    \n}\n\n.containerNameRestaurant > p:nth-child(2){\n\n    transition: all .12s ease-in-out;\n\n}\n\n.containerNameRestaurant:hover > p:nth-child(2){\n\n    filter: brightness(1.5);\n}\n.containerFloatMenu > p:nth-child(3){\n\n    cursor: pointer;\n\n    padding: 10px 16px ;\n    border-radius: 16px;\n    transition: all .13s ease-in-out;\n\n    /* outline: 2px transparent #DBAF57; */\n    \n}\n\n.containerFloatMenu > p:nth-child(1):hover{\n\n    transform: scale(1.05);\n    background-color: #dbaf57;\n    color: #0E0605;\n\n}\n\n.containerFloatMenu > p:nth-child(3):hover{\n\n    transform: scale(1.05);\n    background-color: #dbaf57;\n    color: #0E0605;\n \n}\n\n.containerNameRestaurant{\n\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    font-size: 1.5rem;\n    cursor: pointer;\n}\n\n.textFloatMenu{\n    color: #fff;\n}\n\np{\n    color: #fff;\n}\n\n.japLetters{\n\n    color: #DBAF57;\n    letter-spacing: 4px;\n}\n\n.titlePresentation{\n\n    font-size: 3.5rem;\n    font-weight: bold;\n    user-select: none;\n\n    transition: all .13s ease-in-out;\n\n}\n\n.titlePresentation:hover{\n\n    filter: brightness(1.3);\n}\n\n.btnMenu{\n\n    background-color: #BA8F47;\n\n    padding: 16px;\n\n    width: 200px;\n\n    text-align: center;\n\n    border-radius: 100px;\n\n    transition: all .13s ease-in-out;\n\n    cursor: pointer;\n\n    user-select: none;\n}\n\n\n.btnMenu:hover{\n    transform: scale(1.05);\n    filter: brightness(1.5);\n\n}\n\n.hoverBtnBrightness{ animation: hoverBtnBrightness .12s linear both;}\n\n@keyframes hoverBtnBrightness{\n    0%{\n        filter: brightness(1);\n    }\n\n    25%{\n        filter: brightness(1.1);\n    }\n\n    50%{\n        filter: brightness(1.2);\n    }\n\n    75%{\n        filter: brightness(1.3);\n    }\n\n    100%{\n        filter: brightness(1.4);    \n    }\n}\n\n.blur-out-contract{animation:blur-out-contract .3s linear both} \n\n@keyframes blur-out-contract{\n    0%{\n        position: absolute;\n        transform:scale(1);\n        filter:blur(.01px);\n        \n    }\n    100%{\n        position: absolute;\n        transform:scale(0);\n        filter:blur(12px);\n        opacity:0\n    }\n}\n\n/* MENU------------------------------------------------------------------------------- */\n\n.containerItemsMenu{\n    \n    width: 100vw;\n\n    display: grid;\n    \n    /* grid-template-columns: repeat(auto-fit, minmax(400px,max-content)); */\n    grid-template-columns: repeat(3,400px);\n    grid-template-rows: repeat(2, 300px);\n\n    /* justify-content: center; */\n    place-content: center;\n\n    gap: 30px;\n}\n\n.itemMenu{\n\n    border-radius: 16px;\n\n    border-style: solid;\n    border-color: #EFC279;\n    border-width: 4px;\n\n    display: flex;\n    flex-direction: column;\n    justify-content: end;\n\n    cursor: pointer;\n}\n\n.containerNameItem{\n\n    display: flex;\n\n    justify-content: center;\n    align-items: center;\n    padding: 16px;\n    backdrop-filter: blur(10px);\n\n    color: #fff;\n\n    /* border-radius: 0 0 16px 16px; */\n    border-radius: 10px;\n    user-select: none;\n    pointer-events: none;\n}\n\n.item1{\n\n    background: url(./sushiNew.png);\n    background-size: cover;\n    background-position: center;\n}\n.item2{\n\n    background: url(./ramen.png);\n    background-size: cover;\n    background-position: center;\n}\n.item3{\n\n    background: url(./udon.png);\n    background-size: cover;\n    background-position: center;\n}\n.item4{\n\n    background: url(./yakitori.png);\n    background-size: cover;\n    background-position: center;\n}\n.item5{\n\n    background: url(./tempuraNew.png);\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-position: center;\n}\n.item6{\n\n    background: url(./okonomiya.png);\n    background-size: cover;\n    background-position: center;\n}\n\n.itemMenu:hover{\n\n    transform: scale(0.95);\n\n}\n\n.blur-out{\n    animation:blur-out .3s linear both;\n} \n\n@keyframes blur-out{\n    0%{\n        filter:blur(0px);\n        opacity:1\n    }\n    100%{\n            filter:blur(12px);\n            opacity:0\n    }\n}\n\n\n/* CONTACT------------------------------------------------------------------------------- */\n\n.containerItemsContact{\n\n    background: url('./tree.png');\n    background-repeat: no-repeat;\n    background-position: bottom;\n    width: 100vw;\n\n    display: flex;\n    flex-direction: column;\n\n    justify-content: center;\n    align-items: center;\n    gap: 30px;\n    \n\n}\n\n.itemsContact{\n\n    width: 500px;\n    height: 300px;\n\n    border-radius: 16px;\n\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n\n\n    backdrop-filter: blur(10px);\n\n    border: solid 4px #A66918;\n}\n\n.containerInfoContact{\n\n    display: flex;\n    gap: 30px;\n\n}\n\n.containerInfoAddress{\n    display: flex;\n\n    gap: 30px;\n}\n\n.pInfoAddress{\n    margin: auto;\n    font-size: 1.1rem;\n}\n\n.pInfoContact{\n    margin: auto;\n    font-size: 1.1rem;\n\n}\n\n.titleContact{\n    position: absolute;\n\n    top: 30px;\n    font-size: 1.5rem;\n}\n\n.titleAddress{\n    position: absolute;\n\n    top: 30px;\n    font-size: 1.5rem;\n}\n\n\n@media screen and (max-width: 560px){\n\n    .itemsContact{\n\n        width: 350px;\n        height: 200px;\n    }\n\n}\n@media screen and (max-width: 460px){\n    \n    .containerNameRestaurant{\n\n        font-size: 1rem;\n    }\n    .containerFloatMenu{\n\n        width: 350px;\n\n        gap: 10px;\n    }\n\n    .containerPresentation{\n        gap: 10px;\n    }\n\n}\n@media screen and (max-width: 1321px){\n    \n    .containerItemsMenu{\n\n        grid-template-columns: repeat(2, 400px);\n        grid-template-rows: repeat(3, 300px);\n\n        margin: 150px 0;\n        transition: all .13s ease-in-out;\n        padding: 0 0 100px 0;\n    }\n\n    \n\n    .containerImg{\n\n        background-image: none;\n    }\n\n    .containerPresentation{\n        width: 100vw;\n        padding: 0;\n    }\n    \n    .textPresentation{\n        width: 600px;\n    }\n\n}\n@media screen and (max-width: 896px){\n    \n    .containerItemsMenu{\n\n        grid-template-columns: repeat(2, 300px);\n        grid-template-rows: repeat(3, 200px);\n\n        margin: 150px 0;\n    }\n\n    \n}\n@media screen and (max-width: 678px){\n    \n    .containerItemsMenu{\n\n        grid-template-columns: repeat(1, 300px);\n        grid-template-rows: repeat(6, 200px);\n\n        margin: 150px 0;\n        padding: 0 0 100px 0;\n    }\n\n    .textPresentation{\n        width: 300px;\n    }\n\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/contact.js":
/*!************************!*\
  !*** ./src/contact.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrElementsContact": () => (/* binding */ arrElementsContact),
/* harmony export */   "createElementsDomContact": () => (/* binding */ createElementsDomContact)
/* harmony export */ });
/* harmony import */ var _domCreation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domCreation.js */ "./src/domCreation.js");



const arrElementsContact = [

    // {
    //     elementType: 'div',
    //     attributes: {class:'content'},
    //     appendChild: 'body',
    // },
    {
        elementType: 'div',
        attributes: {class:'containerItemsContact'},
        appendChild: '.content',
    },

    //  childs containerItemsContact

    {
        elementType: 'div',
        attributes: {class:'itemsContact contact'},
        appendChild: '.containerItemsContact',
    },

    {
        elementType: 'div',
        attributes: {class:'itemsContact address'},
        appendChild: '.containerItemsContact',
    },

    //  child contact

    {
        elementType: 'p',
        attributes: {class:'titleContact'},
        innerText: 'Contact',
        appendChild: '.contact',
    },

    {
        elementType: 'div',
        attributes: {class:'containerInfoContact'},
        appendChild: '.contact',
    },
    
    {
        elementType: 'div',
        // attributes: {class:'containerInfoContact'},
        innerHTML: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="#DBAF57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        appendChild: '.containerInfoContact',
    },

    {
        elementType: 'p',
        attributes: {class:'pInfoContact'},
        innerText: '03-1234-5678',
        appendChild: '.containerInfoContact',
    },

    //  child address

    {
        elementType: 'p',
        attributes: {class:'titleAddress'},
        innerText: 'Address',
        appendChild: '.address',
    },

    {
        elementType: 'div',
        attributes: {class:'containerInfoAddress'},
        appendChild: '.address',
    },

    

    {
        elementType: 'div',
        // attributes: {class:'containerInfoContact'},
        innerHTML: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.6569 16.6569C16.7202 17.5935 14.7616 19.5521 13.4138 20.8999C12.6327 21.681 11.3677 21.6814 10.5866 20.9003C9.26234 19.576 7.34159 17.6553 6.34315 16.6569C3.21895 13.5327 3.21895 8.46734 6.34315 5.34315C9.46734 2.21895 14.5327 2.21895 17.6569 5.34315C20.781 8.46734 20.781 13.5327 17.6569 16.6569Z" stroke="#DBAF57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="#DBAF57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        appendChild: '.containerInfoAddress',
    },

    {
        elementType: 'p',
        attributes: {class:'pInfoAddress'},
        innerText: '123 Main St, Sakura City, Japan',
        appendChild: '.containerInfoAddress',
    },


];

function createElementsDomContact(arr) {
    
    arr.forEach(elementObject => {
        
        (0,_domCreation_js__WEBPACK_IMPORTED_MODULE_0__["default"])(elementObject.elementType,elementObject.attributes,elementObject.innerHTML,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
}



/***/ }),

/***/ "./src/domCreation.js":
/*!****************************!*\
  !*** ./src/domCreation.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createElementsDom(elementType,attributes,innerHTML,innerText,appendChild) {
    
    if(elementType){
        let element = document.createElement(elementType);
  
        if (attributes) {
            for (const key in attributes){
                element.setAttribute(key,attributes[key])
            }
        }

        if (innerHTML) {
            element.innerHTML= innerHTML;

        }    
        if (innerText) {
            element.innerText = innerText;

        }
        if(appendChild) {
            appendChild.appendChild(element);
            
        } 

        return element;
    }
    
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createElementsDom);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _domCreation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domCreation.js */ "./src/domCreation.js");
/* harmony import */ var animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! animejs/lib/anime.es.js */ "./node_modules/animejs/lib/anime.es.js");
/* harmony import */ var _menu_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu.js */ "./src/menu.js");
/* harmony import */ var _contact__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contact */ "./src/contact.js");









const arrElementsHome = [

    //  childs body

    {
        elementType: 'div',
        attributes: {class:'content'},
        appendChild: 'body',
    },

    {
        elementType: 'div',
        attributes: {class:'containerFloatMenu'},
        appendChild: 'body',
    },

    //  childs containerFloatMenu

    {
        elementType: 'p',
        attributes: {class:'textFloatMenu menu'},
        innerText: 'Menu',
        appendChild: '.containerFloatMenu',

    },

    {
        elementType: 'div',
        attributes: {class:'containerNameRestaurant'},
        appendChild: '.containerFloatMenu',

    },
    {
        elementType: 'p',
        attributes: {class:'textFloatMenu'},
        innerText: 'Sakura Kitchen',
        appendChild: '.containerNameRestaurant',

    },

    //  child containerNameRestaurant

    {
        elementType: 'p',
        attributes: {class:'textFloatMenu japLetters'},
        innerText: 'サクラキッチン',
        appendChild: '.containerNameRestaurant',

    },

    {
        elementType: 'p',
        attributes: {class:'textFloatMenu contact'},
        innerText: 'Contact',
        appendChild: '.containerFloatMenu',

    },

    //  Childs content

    {
        elementType: 'div',
        attributes: {class:'containerPresentation'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'containerImg'},
        appendChild: '.content',
    },

    //  Child containerPresentation

    

    {
        elementType: 'div',
        attributes: {class:'containerTitlePresentation'},
        appendChild: '.containerPresentation',
    },
    
    {
        elementType: 'p',
        attributes: {class:'titlePresentation japLetters'},
        innerText: 'ようこそ',
        appendChild: '.containerTitlePresentation',

    },
    {
        elementType: 'p',
        attributes: {class:'titlePresentation japLetters'},
        innerText: 'Yōkoso',
        appendChild: '.containerTitlePresentation',

    },

    {
        elementType: 'p',
        attributes: {class:'textPresentation'},
        innerText: 'Welcome to Sakura Kitchen, where we offer a wide range of authentic and delicious Japanese dishes that will tantalize your taste buds. From traditional sushi rolls to sizzling teppanyaki, our menu has something for everyone .\n\nWe use only the freshest and highest-quality ingredients to create our dishes, ensuring that every bite is packed with flavor and nutrition. Our experienced chefs are dedicated to perfecting each dish, so you can expect nothing but the best when you dine with us.\n\nIn addition to our mouth-watering cuisine, we offer a relaxing and welcoming atmosphere that\'s perfect for a romantic date night or a family dinner. Our friendly and attentive staff will make sure you have a memorable dining experience from start to finish.\n\nWhether you\'re a sushi lover or a fan of hearty ramen, we have something to satisfy every craving. Visit us today and experience the taste of Japan right here in our restaurant.',
        appendChild: '.containerPresentation',

    },

    // {
    //     elementType: 'div',
    //     attributes: {class:'btnMenu'},
    //     innerText: 'Menu',
    //     appendChild: '.containerPresentation',
    // },

    
    
];

const arrElementsHomeWithoutFloatMenu = [

    {
        elementType: 'div',
        attributes: {class:'containerPresentation'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'containerImg'},
        appendChild: '.content',
    },

    //  Child containerPresentation

    

    {
        elementType: 'div',
        attributes: {class:'containerTitlePresentation'},
        appendChild: '.containerPresentation',
    },
    
    {
        elementType: 'p',
        attributes: {class:'titlePresentation japLetters'},
        innerText: 'ようこそ',
        appendChild: '.containerTitlePresentation',

    },
    {
        elementType: 'p',
        attributes: {class:'titlePresentation japLetters'},
        innerText: 'Yōkoso',
        appendChild: '.containerTitlePresentation',

    },

    {
        elementType: 'p',
        attributes: {class:'textPresentation'},
        innerText: 'Welcome to Sakura Kitchen, where we offer a wide range of authentic and delicious Japanese dishes that will tantalize your taste buds. From traditional sushi rolls to sizzling teppanyaki, our menu has something for everyone .\n\nWe use only the freshest and highest-quality ingredients to create our dishes, ensuring that every bite is packed with flavor and nutrition. Our experienced chefs are dedicated to perfecting each dish, so you can expect nothing but the best when you dine with us.\n\nIn addition to our mouth-watering cuisine, we offer a relaxing and welcoming atmosphere that\'s perfect for a romantic date night or a family dinner. Our friendly and attentive staff will make sure you have a memorable dining experience from start to finish.\n\nWhether you\'re a sushi lover or a fan of hearty ramen, we have something to satisfy every craving. Visit us today and experience the taste of Japan right here in our restaurant.',
        appendChild: '.containerPresentation',

    },

    // {
    //     elementType: 'div',
    //     attributes: {class:'btnMenu'},
    //     innerText: 'Menu',
    //     appendChild: '.containerPresentation',
    // },
];

function domElementsHome(arr) {

    arr.forEach(elementObject => {
        
        (0,_domCreation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(elementObject.elementType,elementObject.attributes,null,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
   
}   


const arrSection = ['home'];

function changeSection() {
    

    const menu = document.querySelector('.menu');
    const contact = document.querySelector('.contact');
    const home = document.querySelector('.containerNameRestaurant');    
    

   
    menu.addEventListener('click', () => {
        
        if (arrSection[0] == 'home') {

            delContentHome()

            setTimeout(() => {
            
                ;(0,_menu_js__WEBPACK_IMPORTED_MODULE_3__.createElementsDomMenu)(_menu_js__WEBPACK_IMPORTED_MODULE_3__.arrElementsMenu);
                animationEntryMenu();
                hoverItemsMenu();
    
            },250)
    

            
        }else if(arrSection[0] == 'contact'){
            
            animationOutContact();
            setTimeout(() => {
                delContentContact();
            },200)

            setTimeout(() => {
            
                ;(0,_menu_js__WEBPACK_IMPORTED_MODULE_3__.createElementsDomMenu)(_menu_js__WEBPACK_IMPORTED_MODULE_3__.arrElementsMenu);
                animationEntryMenu();
                hoverItemsMenu();
    
            },250)
    


        }
        

        
        
        arrSection.pop()
        arrSection.push('menu');

    })

    contact.addEventListener('click', () => {

        if (arrSection[0] == 'menu') {

            
            animationOutMenu();

            setTimeout(() => {
                delContentMenu()
            },200)

            setTimeout(() => {
            
                ;(0,_contact__WEBPACK_IMPORTED_MODULE_4__.createElementsDomContact)(_contact__WEBPACK_IMPORTED_MODULE_4__.arrElementsContact);
                animationEntryContact();
            },200)

        }else if(arrSection[0] == 'home'){
      
            delContentHome()

            setTimeout(() => {
            
                ;(0,_contact__WEBPACK_IMPORTED_MODULE_4__.createElementsDomContact)(_contact__WEBPACK_IMPORTED_MODULE_4__.arrElementsContact);
                animationEntryContact();
            },200)
            
        }
        

        
        
        

        arrSection.pop()
        arrSection.push('contact');
        
    })

    home.addEventListener('click', () => {
        
        if (arrSection[0] == 'menu') {

            animationOutMenu();

            setTimeout(() => {
                delContentMenu()
            },200)

            setTimeout(() => {
            
                domElementsHome(arrElementsHomeWithoutFloatMenu);
                animationEntryHome();
            },202)
           
            
        }else if(arrSection[0] == 'contact'){
            
            animationOutContact()

            setTimeout(() => {
                delContentContact();
            },200)

            setTimeout(() => {
            
                domElementsHome(arrElementsHomeWithoutFloatMenu);
                animationEntryHome();
            },202)

        }
        
        

        arrSection.pop()
        arrSection.push('home');

    })

    



}

function animationEntryHome() {
    

    (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
        targets: ['.containerPresentation', '.containerImg'],
        opacity: [0, 1],
        filer: blur('12px', '0px'),
        easing:'easeInQuint',
        duration: 300,

    })

}

function animationEntryMenu() {
    
    let itemsMenu = document.querySelectorAll('.itemMenu');

    (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
        targets: itemsMenu,
        scale: [0, 1],
        duration: 500,
        easing: 'easeOutBack',
        delay: animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"].stagger(100, {from: 'first'}),

    });

}

function animationOutMenu() {
    
    (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
        targets: '.containerItemsMenu',

        opacity:[1, 0],
        duration: 500,
        easing: 'easeOutBack',        

    });
}

function animationEntryContact() {  
     
    let itemsContact = document.querySelectorAll('.itemsContact');

    (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
        targets: itemsContact,
        scale: [0, 1],
        duration: 500,
        easing: 'easeOutBack',
        delay: animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"].stagger(100, {from: 'first'}),

    });

}

function animationOutContact() {
    
    (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
        targets: '.containerItemsContact',
        opacity: [1, 0],
        duration: 500,
        easing: 'easeOutBack',

    });

}

function hoverItemsMenu() {
    
    const itemsMenuAll = document.querySelectorAll('.itemMenu');
    
    itemsMenuAll.forEach(item => {
        item.addEventListener('mouseover', () => {

          (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
                targets: item,
                scale: [1, 0.95],
                easing: 'easeOutElastic',
            })
        });
    
        item.addEventListener('mouseout', () => {
            (0,animejs_lib_anime_es_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
                targets: item,
                scale: 1,
                easing: 'easeOutElastic',

            })
        });
    });


}

function delContentHome() {
    
    const content = document.querySelector('.content');
    const containerPresentation = document.querySelector('.containerPresentation');
    const containerImg = document.querySelector('.containerImg');

    containerPresentation.classList.add('blur-out')
    containerImg.classList.add('blur-out')


    setTimeout(() => {
        content.removeChild(containerPresentation);
        content.removeChild(containerImg);    

    },150)
    
}
function delContentMenu() {
    
    const content = document.querySelector('.content');
    const containerItemsMenu = document.querySelector('.containerItemsMenu');



    content.removeChild(containerItemsMenu);

}

function delContentContact() {
    
    const content = document.querySelector('.content');
    const containerItemsContact = document.querySelector('.containerItemsContact');



    content.removeChild(containerItemsContact);

}


domElementsHome(arrElementsHome);
animationEntryHome();
changeSection();





/***/ }),

/***/ "./src/menu.js":
/*!*********************!*\
  !*** ./src/menu.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrElementsMenu": () => (/* binding */ arrElementsMenu),
/* harmony export */   "createElementsDomMenu": () => (/* binding */ createElementsDomMenu)
/* harmony export */ });
/* harmony import */ var _domCreation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domCreation.js */ "./src/domCreation.js");



const arrElementsMenu = [

    //  childs content
    {
        elementType: 'div',
        attributes: {class:'containerItemsMenu'},
        appendChild: '.content',
    },

    //  childs containerItemsMenu

    {
        elementType: 'div',
        attributes: {class:'itemMenu item1'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Sushi',
        appendChild: '.item1',
    },


    {
        elementType: 'div',
        attributes: {class:'itemMenu item2'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Ramen',
        appendChild: '.item2',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu item3'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Udon',
        appendChild: '.item3',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu item4'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Yakitori',
        appendChild: '.item4',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu item5'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Tempura',
        appendChild: '.item5',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu item6'},
        appendChild: '.containerItemsMenu',
    },
    
    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Okonomiyaki',
        appendChild: '.item6',
    },

];


function createElementsDomMenu(arr) {
    
    arr.forEach(elementObject => {
        
        (0,_domCreation_js__WEBPACK_IMPORTED_MODULE_0__["default"])(elementObject.elementType,elementObject.attributes,null,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
}





/***/ }),

/***/ "./src/KosugiMaru-Regular.ttf":
/*!************************************!*\
  !*** ./src/KosugiMaru-Regular.ttf ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "dc10c3fc0d79e669c966.ttf";

/***/ }),

/***/ "./src/japFood1.png":
/*!**************************!*\
  !*** ./src/japFood1.png ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "5d72ad769f77ba16fd08.png";

/***/ }),

/***/ "./src/okonomiya.png":
/*!***************************!*\
  !*** ./src/okonomiya.png ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "437e0eeea4d94eff4722.png";

/***/ }),

/***/ "./src/ramen.png":
/*!***********************!*\
  !*** ./src/ramen.png ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "df50726e841962da8371.png";

/***/ }),

/***/ "./src/sushiNew.png":
/*!**************************!*\
  !*** ./src/sushiNew.png ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "1b4a34316ac26b26790f.png";

/***/ }),

/***/ "./src/tempuraNew.png":
/*!****************************!*\
  !*** ./src/tempuraNew.png ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "a441c9803822ce953498.png";

/***/ }),

/***/ "./src/tree.png":
/*!**********************!*\
  !*** ./src/tree.png ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "1253358bef06b44e9935.png";

/***/ }),

/***/ "./src/udon.png":
/*!**********************!*\
  !*** ./src/udon.png ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "8653f5cf90bc2054554d.png";

/***/ }),

/***/ "./src/yakitori.png":
/*!**************************!*\
  !*** ./src/yakitori.png ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "d97aa2f47321f8bb7381.png";

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YUFBYSxhQUFhLGFBQWEsWUFBWSxhQUFhLFdBQVcsTUFBTSxNQUFNLFVBQVUsUUFBUSxLQUFLLFlBQVksWUFBWSxhQUFhLE9BQU8sTUFBTSxZQUFZLE9BQU8sTUFBTSxZQUFZLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxXQUFXLFlBQVksY0FBYyxZQUFZLFlBQVksY0FBYyxjQUFjLGNBQWMsV0FBVyxhQUFhLE9BQU8sTUFBTSxXQUFXLFlBQVksYUFBYSxjQUFjLGVBQWUsTUFBTSxNQUFNLFdBQVcsT0FBTyxNQUFNLGFBQWEsT0FBTyxNQUFNLFlBQVksTUFBTSxNQUFNLFdBQVcsWUFBWSxhQUFhLGNBQWMsY0FBYyxPQUFPLE1BQU0sWUFBWSxhQUFhLFlBQVksT0FBTyxNQUFNLFlBQVksYUFBYSxZQUFZLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLFVBQVUsWUFBWSxPQUFPLE1BQU0sWUFBWSxhQUFhLGNBQWMsY0FBYyxPQUFPLE1BQU0sWUFBWSxPQUFPLE1BQU0sYUFBYSxZQUFZLFdBQVcsYUFBYSxjQUFjLGNBQWMsWUFBWSxZQUFZLFFBQVEsS0FBSyxZQUFZLGNBQWMsT0FBTyx5QkFBeUIsTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksTUFBTSxNQUFNLG9CQUFvQixNQUFNLEtBQUssWUFBWSxhQUFhLGNBQWMsTUFBTSxLQUFLLFlBQVksYUFBYSxhQUFhLE1BQU0sS0FBSyxNQUFNLGFBQWEsT0FBTyxXQUFXLFdBQVcsWUFBWSxhQUFhLGNBQWMsYUFBYSxjQUFjLFdBQVcsTUFBTSxNQUFNLGFBQWEsYUFBYSxhQUFhLGNBQWMsV0FBVyxZQUFZLGNBQWMsV0FBVyxPQUFPLE1BQU0sV0FBVyxZQUFZLGFBQWEsV0FBVyxhQUFhLFlBQVksWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLE1BQU0sWUFBWSxhQUFhLGFBQWEsTUFBTSxN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QUFFQTs7O0FBR0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25kaUQ7OztBQUdqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHVCQUF1QjtBQUM1QztBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLHVCQUF1QjtBQUM1QztBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHFCQUFxQix1QkFBdUI7QUFDNUM7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLHVCQUF1QjtBQUM1QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7QUFDQSxLQUFLOztBQUVMOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsMkRBQWlCO0FBQ3pCO0FBQ0EsS0FBSztBQUNMIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVzdGF1cmFudC1wYWdlLy4vbm9kZV9tb2R1bGVzL2FuaW1lanMvbGliL2FuaW1lLmVzLmpzIiwid2VicGFjazovL3Jlc3RhdXJhbnQtcGFnZS8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vcmVzdGF1cmFudC1wYWdlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9yZXN0YXVyYW50LXBhZ2UvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL3Jlc3RhdXJhbnQtcGFnZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3Jlc3RhdXJhbnQtcGFnZS8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly9yZXN0YXVyYW50LXBhZ2UvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vcmVzdGF1cmFudC1wYWdlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9yZXN0YXVyYW50LXBhZ2UvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vcmVzdGF1cmFudC1wYWdlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3Jlc3RhdXJhbnQtcGFnZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3Jlc3RhdXJhbnQtcGFnZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3Jlc3RhdXJhbnQtcGFnZS8uL3NyYy9jb250YWN0LmpzIiwid2VicGFjazovL3Jlc3RhdXJhbnQtcGFnZS8uL3NyYy9kb21DcmVhdGlvbi5qcyIsIndlYnBhY2s6Ly9yZXN0YXVyYW50LXBhZ2UvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcmVzdGF1cmFudC1wYWdlLy4vc3JjL21lbnUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIGFuaW1lLmpzIHYzLjIuMVxuICogKGMpIDIwMjAgSnVsaWFuIEdhcm5pZXJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogYW5pbWVqcy5jb21cbiAqL1xuXG4vLyBEZWZhdWx0c1xuXG52YXIgZGVmYXVsdEluc3RhbmNlU2V0dGluZ3MgPSB7XG4gIHVwZGF0ZTogbnVsbCxcbiAgYmVnaW46IG51bGwsXG4gIGxvb3BCZWdpbjogbnVsbCxcbiAgY2hhbmdlQmVnaW46IG51bGwsXG4gIGNoYW5nZTogbnVsbCxcbiAgY2hhbmdlQ29tcGxldGU6IG51bGwsXG4gIGxvb3BDb21wbGV0ZTogbnVsbCxcbiAgY29tcGxldGU6IG51bGwsXG4gIGxvb3A6IDEsXG4gIGRpcmVjdGlvbjogJ25vcm1hbCcsXG4gIGF1dG9wbGF5OiB0cnVlLFxuICB0aW1lbGluZU9mZnNldDogMFxufTtcblxudmFyIGRlZmF1bHRUd2VlblNldHRpbmdzID0ge1xuICBkdXJhdGlvbjogMTAwMCxcbiAgZGVsYXk6IDAsXG4gIGVuZERlbGF5OiAwLFxuICBlYXNpbmc6ICdlYXNlT3V0RWxhc3RpYygxLCAuNSknLFxuICByb3VuZDogMFxufTtcblxudmFyIHZhbGlkVHJhbnNmb3JtcyA9IFsndHJhbnNsYXRlWCcsICd0cmFuc2xhdGVZJywgJ3RyYW5zbGF0ZVonLCAncm90YXRlJywgJ3JvdGF0ZVgnLCAncm90YXRlWScsICdyb3RhdGVaJywgJ3NjYWxlJywgJ3NjYWxlWCcsICdzY2FsZVknLCAnc2NhbGVaJywgJ3NrZXcnLCAnc2tld1gnLCAnc2tld1knLCAncGVyc3BlY3RpdmUnLCAnbWF0cml4JywgJ21hdHJpeDNkJ107XG5cbi8vIENhY2hpbmdcblxudmFyIGNhY2hlID0ge1xuICBDU1M6IHt9LFxuICBzcHJpbmdzOiB7fVxufTtcblxuLy8gVXRpbHNcblxuZnVuY3Rpb24gbWluTWF4KHZhbCwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbCwgbWluKSwgbWF4KTtcbn1cblxuZnVuY3Rpb24gc3RyaW5nQ29udGFpbnMoc3RyLCB0ZXh0KSB7XG4gIHJldHVybiBzdHIuaW5kZXhPZih0ZXh0KSA+IC0xO1xufVxuXG5mdW5jdGlvbiBhcHBseUFyZ3VtZW50cyhmdW5jLCBhcmdzKSB7XG4gIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xufVxuXG52YXIgaXMgPSB7XG4gIGFycjogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSk7IH0sXG4gIG9iajogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIHN0cmluZ0NvbnRhaW5zKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSwgJ09iamVjdCcpOyB9LFxuICBwdGg6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBpcy5vYmooYSkgJiYgYS5oYXNPd25Qcm9wZXJ0eSgndG90YWxMZW5ndGgnKTsgfSxcbiAgc3ZnOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYSBpbnN0YW5jZW9mIFNWR0VsZW1lbnQ7IH0sXG4gIGlucDogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGEgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50OyB9LFxuICBkb206IGZ1bmN0aW9uIChhKSB7IHJldHVybiBhLm5vZGVUeXBlIHx8IGlzLnN2ZyhhKTsgfSxcbiAgc3RyOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gdHlwZW9mIGEgPT09ICdzdHJpbmcnOyB9LFxuICBmbmM6IGZ1bmN0aW9uIChhKSB7IHJldHVybiB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJzsgfSxcbiAgdW5kOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gdHlwZW9mIGEgPT09ICd1bmRlZmluZWQnOyB9LFxuICBuaWw6IGZ1bmN0aW9uIChhKSB7IHJldHVybiBpcy51bmQoYSkgfHwgYSA9PT0gbnVsbDsgfSxcbiAgaGV4OiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gLyheI1swLTlBLUZdezZ9JCl8KF4jWzAtOUEtRl17M30kKS9pLnRlc3QoYSk7IH0sXG4gIHJnYjogZnVuY3Rpb24gKGEpIHsgcmV0dXJuIC9ecmdiLy50ZXN0KGEpOyB9LFxuICBoc2w6IGZ1bmN0aW9uIChhKSB7IHJldHVybiAvXmhzbC8udGVzdChhKTsgfSxcbiAgY29sOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gKGlzLmhleChhKSB8fCBpcy5yZ2IoYSkgfHwgaXMuaHNsKGEpKTsgfSxcbiAga2V5OiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gIWRlZmF1bHRJbnN0YW5jZVNldHRpbmdzLmhhc093blByb3BlcnR5KGEpICYmICFkZWZhdWx0VHdlZW5TZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShhKSAmJiBhICE9PSAndGFyZ2V0cycgJiYgYSAhPT0gJ2tleWZyYW1lcyc7IH0sXG59O1xuXG4vLyBFYXNpbmdzXG5cbmZ1bmN0aW9uIHBhcnNlRWFzaW5nUGFyYW1ldGVycyhzdHJpbmcpIHtcbiAgdmFyIG1hdGNoID0gL1xcKChbXildKylcXCkvLmV4ZWMoc3RyaW5nKTtcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0uc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHBhcnNlRmxvYXQocCk7IH0pIDogW107XG59XG5cbi8vIFNwcmluZyBzb2x2ZXIgaW5zcGlyZWQgYnkgV2Via2l0IENvcHlyaWdodCDCqSAyMDE2IEFwcGxlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gaHR0cHM6Ly93ZWJraXQub3JnL2RlbW9zL3NwcmluZy9zcHJpbmcuanNcblxuZnVuY3Rpb24gc3ByaW5nKHN0cmluZywgZHVyYXRpb24pIHtcblxuICB2YXIgcGFyYW1zID0gcGFyc2VFYXNpbmdQYXJhbWV0ZXJzKHN0cmluZyk7XG4gIHZhciBtYXNzID0gbWluTWF4KGlzLnVuZChwYXJhbXNbMF0pID8gMSA6IHBhcmFtc1swXSwgLjEsIDEwMCk7XG4gIHZhciBzdGlmZm5lc3MgPSBtaW5NYXgoaXMudW5kKHBhcmFtc1sxXSkgPyAxMDAgOiBwYXJhbXNbMV0sIC4xLCAxMDApO1xuICB2YXIgZGFtcGluZyA9IG1pbk1heChpcy51bmQocGFyYW1zWzJdKSA/IDEwIDogcGFyYW1zWzJdLCAuMSwgMTAwKTtcbiAgdmFyIHZlbG9jaXR5ID0gIG1pbk1heChpcy51bmQocGFyYW1zWzNdKSA/IDAgOiBwYXJhbXNbM10sIC4xLCAxMDApO1xuICB2YXIgdzAgPSBNYXRoLnNxcnQoc3RpZmZuZXNzIC8gbWFzcyk7XG4gIHZhciB6ZXRhID0gZGFtcGluZyAvICgyICogTWF0aC5zcXJ0KHN0aWZmbmVzcyAqIG1hc3MpKTtcbiAgdmFyIHdkID0gemV0YSA8IDEgPyB3MCAqIE1hdGguc3FydCgxIC0gemV0YSAqIHpldGEpIDogMDtcbiAgdmFyIGEgPSAxO1xuICB2YXIgYiA9IHpldGEgPCAxID8gKHpldGEgKiB3MCArIC12ZWxvY2l0eSkgLyB3ZCA6IC12ZWxvY2l0eSArIHcwO1xuXG4gIGZ1bmN0aW9uIHNvbHZlcih0KSB7XG4gICAgdmFyIHByb2dyZXNzID0gZHVyYXRpb24gPyAoZHVyYXRpb24gKiB0KSAvIDEwMDAgOiB0O1xuICAgIGlmICh6ZXRhIDwgMSkge1xuICAgICAgcHJvZ3Jlc3MgPSBNYXRoLmV4cCgtcHJvZ3Jlc3MgKiB6ZXRhICogdzApICogKGEgKiBNYXRoLmNvcyh3ZCAqIHByb2dyZXNzKSArIGIgKiBNYXRoLnNpbih3ZCAqIHByb2dyZXNzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2dyZXNzID0gKGEgKyBiICogcHJvZ3Jlc3MpICogTWF0aC5leHAoLXByb2dyZXNzICogdzApO1xuICAgIH1cbiAgICBpZiAodCA9PT0gMCB8fCB0ID09PSAxKSB7IHJldHVybiB0OyB9XG4gICAgcmV0dXJuIDEgLSBwcm9ncmVzcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldER1cmF0aW9uKCkge1xuICAgIHZhciBjYWNoZWQgPSBjYWNoZS5zcHJpbmdzW3N0cmluZ107XG4gICAgaWYgKGNhY2hlZCkgeyByZXR1cm4gY2FjaGVkOyB9XG4gICAgdmFyIGZyYW1lID0gMS82O1xuICAgIHZhciBlbGFwc2VkID0gMDtcbiAgICB2YXIgcmVzdCA9IDA7XG4gICAgd2hpbGUodHJ1ZSkge1xuICAgICAgZWxhcHNlZCArPSBmcmFtZTtcbiAgICAgIGlmIChzb2x2ZXIoZWxhcHNlZCkgPT09IDEpIHtcbiAgICAgICAgcmVzdCsrO1xuICAgICAgICBpZiAocmVzdCA+PSAxNikgeyBicmVhazsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdCA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBkdXJhdGlvbiA9IGVsYXBzZWQgKiBmcmFtZSAqIDEwMDA7XG4gICAgY2FjaGUuc3ByaW5nc1tzdHJpbmddID0gZHVyYXRpb247XG4gICAgcmV0dXJuIGR1cmF0aW9uO1xuICB9XG5cbiAgcmV0dXJuIGR1cmF0aW9uID8gc29sdmVyIDogZ2V0RHVyYXRpb247XG5cbn1cblxuLy8gQmFzaWMgc3RlcHMgZWFzaW5nIGltcGxlbWVudGF0aW9uIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2ZyL2RvY3MvV2ViL0NTUy90cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvblxuXG5mdW5jdGlvbiBzdGVwcyhzdGVwcykge1xuICBpZiAoIHN0ZXBzID09PSB2b2lkIDAgKSBzdGVwcyA9IDEwO1xuXG4gIHJldHVybiBmdW5jdGlvbiAodCkgeyByZXR1cm4gTWF0aC5jZWlsKChtaW5NYXgodCwgMC4wMDAwMDEsIDEpKSAqIHN0ZXBzKSAqICgxIC8gc3RlcHMpOyB9O1xufVxuXG4vLyBCZXppZXJFYXNpbmcgaHR0cHM6Ly9naXRodWIuY29tL2dyZS9iZXppZXItZWFzaW5nXG5cbnZhciBiZXppZXIgPSAoZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrU3BsaW5lVGFibGVTaXplID0gMTE7XG4gIHZhciBrU2FtcGxlU3RlcFNpemUgPSAxLjAgLyAoa1NwbGluZVRhYmxlU2l6ZSAtIDEuMCk7XG5cbiAgZnVuY3Rpb24gQShhQTEsIGFBMikgeyByZXR1cm4gMS4wIC0gMy4wICogYUEyICsgMy4wICogYUExIH1cbiAgZnVuY3Rpb24gQihhQTEsIGFBMikgeyByZXR1cm4gMy4wICogYUEyIC0gNi4wICogYUExIH1cbiAgZnVuY3Rpb24gQyhhQTEpICAgICAgeyByZXR1cm4gMy4wICogYUExIH1cblxuICBmdW5jdGlvbiBjYWxjQmV6aWVyKGFULCBhQTEsIGFBMikgeyByZXR1cm4gKChBKGFBMSwgYUEyKSAqIGFUICsgQihhQTEsIGFBMikpICogYVQgKyBDKGFBMSkpICogYVQgfVxuICBmdW5jdGlvbiBnZXRTbG9wZShhVCwgYUExLCBhQTIpIHsgcmV0dXJuIDMuMCAqIEEoYUExLCBhQTIpICogYVQgKiBhVCArIDIuMCAqIEIoYUExLCBhQTIpICogYVQgKyBDKGFBMSkgfVxuXG4gIGZ1bmN0aW9uIGJpbmFyeVN1YmRpdmlkZShhWCwgYUEsIGFCLCBtWDEsIG1YMikge1xuICAgIHZhciBjdXJyZW50WCwgY3VycmVudFQsIGkgPSAwO1xuICAgIGRvIHtcbiAgICAgIGN1cnJlbnRUID0gYUEgKyAoYUIgLSBhQSkgLyAyLjA7XG4gICAgICBjdXJyZW50WCA9IGNhbGNCZXppZXIoY3VycmVudFQsIG1YMSwgbVgyKSAtIGFYO1xuICAgICAgaWYgKGN1cnJlbnRYID4gMC4wKSB7IGFCID0gY3VycmVudFQ7IH0gZWxzZSB7IGFBID0gY3VycmVudFQ7IH1cbiAgICB9IHdoaWxlIChNYXRoLmFicyhjdXJyZW50WCkgPiAwLjAwMDAwMDEgJiYgKytpIDwgMTApO1xuICAgIHJldHVybiBjdXJyZW50VDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld3RvblJhcGhzb25JdGVyYXRlKGFYLCBhR3Vlc3NULCBtWDEsIG1YMikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgKytpKSB7XG4gICAgICB2YXIgY3VycmVudFNsb3BlID0gZ2V0U2xvcGUoYUd1ZXNzVCwgbVgxLCBtWDIpO1xuICAgICAgaWYgKGN1cnJlbnRTbG9wZSA9PT0gMC4wKSB7IHJldHVybiBhR3Vlc3NUOyB9XG4gICAgICB2YXIgY3VycmVudFggPSBjYWxjQmV6aWVyKGFHdWVzc1QsIG1YMSwgbVgyKSAtIGFYO1xuICAgICAgYUd1ZXNzVCAtPSBjdXJyZW50WCAvIGN1cnJlbnRTbG9wZTtcbiAgICB9XG4gICAgcmV0dXJuIGFHdWVzc1Q7XG4gIH1cblxuICBmdW5jdGlvbiBiZXppZXIobVgxLCBtWTEsIG1YMiwgbVkyKSB7XG5cbiAgICBpZiAoISgwIDw9IG1YMSAmJiBtWDEgPD0gMSAmJiAwIDw9IG1YMiAmJiBtWDIgPD0gMSkpIHsgcmV0dXJuOyB9XG4gICAgdmFyIHNhbXBsZVZhbHVlcyA9IG5ldyBGbG9hdDMyQXJyYXkoa1NwbGluZVRhYmxlU2l6ZSk7XG5cbiAgICBpZiAobVgxICE9PSBtWTEgfHwgbVgyICE9PSBtWTIpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga1NwbGluZVRhYmxlU2l6ZTsgKytpKSB7XG4gICAgICAgIHNhbXBsZVZhbHVlc1tpXSA9IGNhbGNCZXppZXIoaSAqIGtTYW1wbGVTdGVwU2l6ZSwgbVgxLCBtWDIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRGb3JYKGFYKSB7XG5cbiAgICAgIHZhciBpbnRlcnZhbFN0YXJ0ID0gMDtcbiAgICAgIHZhciBjdXJyZW50U2FtcGxlID0gMTtcbiAgICAgIHZhciBsYXN0U2FtcGxlID0ga1NwbGluZVRhYmxlU2l6ZSAtIDE7XG5cbiAgICAgIGZvciAoOyBjdXJyZW50U2FtcGxlICE9PSBsYXN0U2FtcGxlICYmIHNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlXSA8PSBhWDsgKytjdXJyZW50U2FtcGxlKSB7XG4gICAgICAgIGludGVydmFsU3RhcnQgKz0ga1NhbXBsZVN0ZXBTaXplO1xuICAgICAgfVxuXG4gICAgICAtLWN1cnJlbnRTYW1wbGU7XG5cbiAgICAgIHZhciBkaXN0ID0gKGFYIC0gc2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKSAvIChzYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZSArIDFdIC0gc2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKTtcbiAgICAgIHZhciBndWVzc0ZvclQgPSBpbnRlcnZhbFN0YXJ0ICsgZGlzdCAqIGtTYW1wbGVTdGVwU2l6ZTtcbiAgICAgIHZhciBpbml0aWFsU2xvcGUgPSBnZXRTbG9wZShndWVzc0ZvclQsIG1YMSwgbVgyKTtcblxuICAgICAgaWYgKGluaXRpYWxTbG9wZSA+PSAwLjAwMSkge1xuICAgICAgICByZXR1cm4gbmV3dG9uUmFwaHNvbkl0ZXJhdGUoYVgsIGd1ZXNzRm9yVCwgbVgxLCBtWDIpO1xuICAgICAgfSBlbHNlIGlmIChpbml0aWFsU2xvcGUgPT09IDAuMCkge1xuICAgICAgICByZXR1cm4gZ3Vlc3NGb3JUO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGJpbmFyeVN1YmRpdmlkZShhWCwgaW50ZXJ2YWxTdGFydCwgaW50ZXJ2YWxTdGFydCArIGtTYW1wbGVTdGVwU2l6ZSwgbVgxLCBtWDIpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgICBpZiAobVgxID09PSBtWTEgJiYgbVgyID09PSBtWTIpIHsgcmV0dXJuIHg7IH1cbiAgICAgIGlmICh4ID09PSAwIHx8IHggPT09IDEpIHsgcmV0dXJuIHg7IH1cbiAgICAgIHJldHVybiBjYWxjQmV6aWVyKGdldFRGb3JYKHgpLCBtWTEsIG1ZMik7XG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4gYmV6aWVyO1xuXG59KSgpO1xuXG52YXIgcGVubmVyID0gKGZ1bmN0aW9uICgpIHtcblxuICAvLyBCYXNlZCBvbiBqUXVlcnkgVUkncyBpbXBsZW1lbmF0aW9uIG9mIGVhc2luZyBlcXVhdGlvbnMgZnJvbSBSb2JlcnQgUGVubmVyIChodHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vZWFzaW5nKVxuXG4gIHZhciBlYXNlcyA9IHsgbGluZWFyOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmdW5jdGlvbiAodCkgeyByZXR1cm4gdDsgfTsgfSB9O1xuXG4gIHZhciBmdW5jdGlvbkVhc2luZ3MgPSB7XG4gICAgU2luZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIDEgLSBNYXRoLmNvcyh0ICogTWF0aC5QSSAvIDIpOyB9OyB9LFxuICAgIENpcmM6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZ1bmN0aW9uICh0KSB7IHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSB0ICogdCk7IH07IH0sXG4gICAgQmFjazogZnVuY3Rpb24gKCkgeyByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIHQgKiB0ICogKDMgKiB0IC0gMik7IH07IH0sXG4gICAgQm91bmNlOiBmdW5jdGlvbiAoKSB7IHJldHVybiBmdW5jdGlvbiAodCkge1xuICAgICAgdmFyIHBvdzIsIGIgPSA0O1xuICAgICAgd2hpbGUgKHQgPCAoKCBwb3cyID0gTWF0aC5wb3coMiwgLS1iKSkgLSAxKSAvIDExKSB7fVxuICAgICAgcmV0dXJuIDEgLyBNYXRoLnBvdyg0LCAzIC0gYikgLSA3LjU2MjUgKiBNYXRoLnBvdygoIHBvdzIgKiAzIC0gMiApIC8gMjIgLSB0LCAyKVxuICAgIH07IH0sXG4gICAgRWxhc3RpYzogZnVuY3Rpb24gKGFtcGxpdHVkZSwgcGVyaW9kKSB7XG4gICAgICBpZiAoIGFtcGxpdHVkZSA9PT0gdm9pZCAwICkgYW1wbGl0dWRlID0gMTtcbiAgICAgIGlmICggcGVyaW9kID09PSB2b2lkIDAgKSBwZXJpb2QgPSAuNTtcblxuICAgICAgdmFyIGEgPSBtaW5NYXgoYW1wbGl0dWRlLCAxLCAxMCk7XG4gICAgICB2YXIgcCA9IG1pbk1heChwZXJpb2QsIC4xLCAyKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gKHQgPT09IDAgfHwgdCA9PT0gMSkgPyB0IDogXG4gICAgICAgICAgLWEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpICogTWF0aC5zaW4oKCgodCAtIDEpIC0gKHAgLyAoTWF0aC5QSSAqIDIpICogTWF0aC5hc2luKDEgLyBhKSkpICogKE1hdGguUEkgKiAyKSkgLyBwKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIGJhc2VFYXNpbmdzID0gWydRdWFkJywgJ0N1YmljJywgJ1F1YXJ0JywgJ1F1aW50JywgJ0V4cG8nXTtcblxuICBiYXNlRWFzaW5ncy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lLCBpKSB7XG4gICAgZnVuY3Rpb25FYXNpbmdzW25hbWVdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIE1hdGgucG93KHQsIGkgKyAyKTsgfTsgfTtcbiAgfSk7XG5cbiAgT2JqZWN0LmtleXMoZnVuY3Rpb25FYXNpbmdzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGVhc2VJbiA9IGZ1bmN0aW9uRWFzaW5nc1tuYW1lXTtcbiAgICBlYXNlc1snZWFzZUluJyArIG5hbWVdID0gZWFzZUluO1xuICAgIGVhc2VzWydlYXNlT3V0JyArIG5hbWVdID0gZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGZ1bmN0aW9uICh0KSB7IHJldHVybiAxIC0gZWFzZUluKGEsIGIpKDEgLSB0KTsgfTsgfTtcbiAgICBlYXNlc1snZWFzZUluT3V0JyArIG5hbWVdID0gZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGZ1bmN0aW9uICh0KSB7IHJldHVybiB0IDwgMC41ID8gZWFzZUluKGEsIGIpKHQgKiAyKSAvIDIgOiBcbiAgICAgIDEgLSBlYXNlSW4oYSwgYikodCAqIC0yICsgMikgLyAyOyB9OyB9O1xuICAgIGVhc2VzWydlYXNlT3V0SW4nICsgbmFtZV0gPSBmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gZnVuY3Rpb24gKHQpIHsgcmV0dXJuIHQgPCAwLjUgPyAoMSAtIGVhc2VJbihhLCBiKSgxIC0gdCAqIDIpKSAvIDIgOiBcbiAgICAgIChlYXNlSW4oYSwgYikodCAqIDIgLSAxKSArIDEpIC8gMjsgfTsgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIGVhc2VzO1xuXG59KSgpO1xuXG5mdW5jdGlvbiBwYXJzZUVhc2luZ3MoZWFzaW5nLCBkdXJhdGlvbikge1xuICBpZiAoaXMuZm5jKGVhc2luZykpIHsgcmV0dXJuIGVhc2luZzsgfVxuICB2YXIgbmFtZSA9IGVhc2luZy5zcGxpdCgnKCcpWzBdO1xuICB2YXIgZWFzZSA9IHBlbm5lcltuYW1lXTtcbiAgdmFyIGFyZ3MgPSBwYXJzZUVhc2luZ1BhcmFtZXRlcnMoZWFzaW5nKTtcbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnc3ByaW5nJyA6IHJldHVybiBzcHJpbmcoZWFzaW5nLCBkdXJhdGlvbik7XG4gICAgY2FzZSAnY3ViaWNCZXppZXInIDogcmV0dXJuIGFwcGx5QXJndW1lbnRzKGJlemllciwgYXJncyk7XG4gICAgY2FzZSAnc3RlcHMnIDogcmV0dXJuIGFwcGx5QXJndW1lbnRzKHN0ZXBzLCBhcmdzKTtcbiAgICBkZWZhdWx0IDogcmV0dXJuIGFwcGx5QXJndW1lbnRzKGVhc2UsIGFyZ3MpO1xuICB9XG59XG5cbi8vIFN0cmluZ3NcblxuZnVuY3Rpb24gc2VsZWN0U3RyaW5nKHN0cikge1xuICB0cnkge1xuICAgIHZhciBub2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3RyKTtcbiAgICByZXR1cm4gbm9kZXM7XG4gIH0gY2F0Y2goZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG4vLyBBcnJheXNcblxuZnVuY3Rpb24gZmlsdGVyQXJyYXkoYXJyLCBjYWxsYmFjaykge1xuICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoID49IDIgPyBhcmd1bWVudHNbMV0gOiB2b2lkIDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChpIGluIGFycikge1xuICAgICAgdmFyIHZhbCA9IGFycltpXTtcbiAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbCwgaSwgYXJyKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuQXJyYXkoYXJyKSB7XG4gIHJldHVybiBhcnIucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmNvbmNhdChpcy5hcnIoYikgPyBmbGF0dGVuQXJyYXkoYikgOiBiKTsgfSwgW10pO1xufVxuXG5mdW5jdGlvbiB0b0FycmF5KG8pIHtcbiAgaWYgKGlzLmFycihvKSkgeyByZXR1cm4gbzsgfVxuICBpZiAoaXMuc3RyKG8pKSB7IG8gPSBzZWxlY3RTdHJpbmcobykgfHwgbzsgfVxuICBpZiAobyBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8IG8gaW5zdGFuY2VvZiBIVE1MQ29sbGVjdGlvbikgeyByZXR1cm4gW10uc2xpY2UuY2FsbChvKTsgfVxuICByZXR1cm4gW29dO1xufVxuXG5mdW5jdGlvbiBhcnJheUNvbnRhaW5zKGFyciwgdmFsKSB7XG4gIHJldHVybiBhcnIuc29tZShmdW5jdGlvbiAoYSkgeyByZXR1cm4gYSA9PT0gdmFsOyB9KTtcbn1cblxuLy8gT2JqZWN0c1xuXG5mdW5jdGlvbiBjbG9uZU9iamVjdChvKSB7XG4gIHZhciBjbG9uZSA9IHt9O1xuICBmb3IgKHZhciBwIGluIG8pIHsgY2xvbmVbcF0gPSBvW3BdOyB9XG4gIHJldHVybiBjbG9uZTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZU9iamVjdFByb3BzKG8xLCBvMikge1xuICB2YXIgbyA9IGNsb25lT2JqZWN0KG8xKTtcbiAgZm9yICh2YXIgcCBpbiBvMSkgeyBvW3BdID0gbzIuaGFzT3duUHJvcGVydHkocCkgPyBvMltwXSA6IG8xW3BdOyB9XG4gIHJldHVybiBvO1xufVxuXG5mdW5jdGlvbiBtZXJnZU9iamVjdHMobzEsIG8yKSB7XG4gIHZhciBvID0gY2xvbmVPYmplY3QobzEpO1xuICBmb3IgKHZhciBwIGluIG8yKSB7IG9bcF0gPSBpcy51bmQobzFbcF0pID8gbzJbcF0gOiBvMVtwXTsgfVxuICByZXR1cm4gbztcbn1cblxuLy8gQ29sb3JzXG5cbmZ1bmN0aW9uIHJnYlRvUmdiYShyZ2JWYWx1ZSkge1xuICB2YXIgcmdiID0gL3JnYlxcKChcXGQrLFxccypbXFxkXSssXFxzKltcXGRdKylcXCkvZy5leGVjKHJnYlZhbHVlKTtcbiAgcmV0dXJuIHJnYiA/IChcInJnYmEoXCIgKyAocmdiWzFdKSArIFwiLDEpXCIpIDogcmdiVmFsdWU7XG59XG5cbmZ1bmN0aW9uIGhleFRvUmdiYShoZXhWYWx1ZSkge1xuICB2YXIgcmd4ID0gL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaTtcbiAgdmFyIGhleCA9IGhleFZhbHVlLnJlcGxhY2Uocmd4LCBmdW5jdGlvbiAobSwgciwgZywgYikgeyByZXR1cm4gciArIHIgKyBnICsgZyArIGIgKyBiOyB9ICk7XG4gIHZhciByZ2IgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgdmFyIHIgPSBwYXJzZUludChyZ2JbMV0sIDE2KTtcbiAgdmFyIGcgPSBwYXJzZUludChyZ2JbMl0sIDE2KTtcbiAgdmFyIGIgPSBwYXJzZUludChyZ2JbM10sIDE2KTtcbiAgcmV0dXJuIChcInJnYmEoXCIgKyByICsgXCIsXCIgKyBnICsgXCIsXCIgKyBiICsgXCIsMSlcIik7XG59XG5cbmZ1bmN0aW9uIGhzbFRvUmdiYShoc2xWYWx1ZSkge1xuICB2YXIgaHNsID0gL2hzbFxcKChcXGQrKSxcXHMqKFtcXGQuXSspJSxcXHMqKFtcXGQuXSspJVxcKS9nLmV4ZWMoaHNsVmFsdWUpIHx8IC9oc2xhXFwoKFxcZCspLFxccyooW1xcZC5dKyklLFxccyooW1xcZC5dKyklLFxccyooW1xcZC5dKylcXCkvZy5leGVjKGhzbFZhbHVlKTtcbiAgdmFyIGggPSBwYXJzZUludChoc2xbMV0sIDEwKSAvIDM2MDtcbiAgdmFyIHMgPSBwYXJzZUludChoc2xbMl0sIDEwKSAvIDEwMDtcbiAgdmFyIGwgPSBwYXJzZUludChoc2xbM10sIDEwKSAvIDEwMDtcbiAgdmFyIGEgPSBoc2xbNF0gfHwgMTtcbiAgZnVuY3Rpb24gaHVlMnJnYihwLCBxLCB0KSB7XG4gICAgaWYgKHQgPCAwKSB7IHQgKz0gMTsgfVxuICAgIGlmICh0ID4gMSkgeyB0IC09IDE7IH1cbiAgICBpZiAodCA8IDEvNikgeyByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDsgfVxuICAgIGlmICh0IDwgMS8yKSB7IHJldHVybiBxOyB9XG4gICAgaWYgKHQgPCAyLzMpIHsgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjsgfVxuICAgIHJldHVybiBwO1xuICB9XG4gIHZhciByLCBnLCBiO1xuICBpZiAocyA9PSAwKSB7XG4gICAgciA9IGcgPSBiID0gbDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG4gICAgdmFyIHAgPSAyICogbCAtIHE7XG4gICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XG4gICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XG4gICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XG4gIH1cbiAgcmV0dXJuIChcInJnYmEoXCIgKyAociAqIDI1NSkgKyBcIixcIiArIChnICogMjU1KSArIFwiLFwiICsgKGIgKiAyNTUpICsgXCIsXCIgKyBhICsgXCIpXCIpO1xufVxuXG5mdW5jdGlvbiBjb2xvclRvUmdiKHZhbCkge1xuICBpZiAoaXMucmdiKHZhbCkpIHsgcmV0dXJuIHJnYlRvUmdiYSh2YWwpOyB9XG4gIGlmIChpcy5oZXgodmFsKSkgeyByZXR1cm4gaGV4VG9SZ2JhKHZhbCk7IH1cbiAgaWYgKGlzLmhzbCh2YWwpKSB7IHJldHVybiBoc2xUb1JnYmEodmFsKTsgfVxufVxuXG4vLyBVbml0c1xuXG5mdW5jdGlvbiBnZXRVbml0KHZhbCkge1xuICB2YXIgc3BsaXQgPSAvWystXT9cXGQqXFwuP1xcZCsoPzpcXC5cXGQrKT8oPzpbZUVdWystXT9cXGQrKT8oJXxweHxwdHxlbXxyZW18aW58Y218bW18ZXh8Y2h8cGN8dnd8dmh8dm1pbnx2bWF4fGRlZ3xyYWR8dHVybik/JC8uZXhlYyh2YWwpO1xuICBpZiAoc3BsaXQpIHsgcmV0dXJuIHNwbGl0WzFdOyB9XG59XG5cbmZ1bmN0aW9uIGdldFRyYW5zZm9ybVVuaXQocHJvcE5hbWUpIHtcbiAgaWYgKHN0cmluZ0NvbnRhaW5zKHByb3BOYW1lLCAndHJhbnNsYXRlJykgfHwgcHJvcE5hbWUgPT09ICdwZXJzcGVjdGl2ZScpIHsgcmV0dXJuICdweCc7IH1cbiAgaWYgKHN0cmluZ0NvbnRhaW5zKHByb3BOYW1lLCAncm90YXRlJykgfHwgc3RyaW5nQ29udGFpbnMocHJvcE5hbWUsICdza2V3JykpIHsgcmV0dXJuICdkZWcnOyB9XG59XG5cbi8vIFZhbHVlc1xuXG5mdW5jdGlvbiBnZXRGdW5jdGlvblZhbHVlKHZhbCwgYW5pbWF0YWJsZSkge1xuICBpZiAoIWlzLmZuYyh2YWwpKSB7IHJldHVybiB2YWw7IH1cbiAgcmV0dXJuIHZhbChhbmltYXRhYmxlLnRhcmdldCwgYW5pbWF0YWJsZS5pZCwgYW5pbWF0YWJsZS50b3RhbCk7XG59XG5cbmZ1bmN0aW9uIGdldEF0dHJpYnV0ZShlbCwgcHJvcCkge1xuICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKHByb3ApO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UHhUb1VuaXQoZWwsIHZhbHVlLCB1bml0KSB7XG4gIHZhciB2YWx1ZVVuaXQgPSBnZXRVbml0KHZhbHVlKTtcbiAgaWYgKGFycmF5Q29udGFpbnMoW3VuaXQsICdkZWcnLCAncmFkJywgJ3R1cm4nXSwgdmFsdWVVbml0KSkgeyByZXR1cm4gdmFsdWU7IH1cbiAgdmFyIGNhY2hlZCA9IGNhY2hlLkNTU1t2YWx1ZSArIHVuaXRdO1xuICBpZiAoIWlzLnVuZChjYWNoZWQpKSB7IHJldHVybiBjYWNoZWQ7IH1cbiAgdmFyIGJhc2VsaW5lID0gMTAwO1xuICB2YXIgdGVtcEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbC50YWdOYW1lKTtcbiAgdmFyIHBhcmVudEVsID0gKGVsLnBhcmVudE5vZGUgJiYgKGVsLnBhcmVudE5vZGUgIT09IGRvY3VtZW50KSkgPyBlbC5wYXJlbnROb2RlIDogZG9jdW1lbnQuYm9keTtcbiAgcGFyZW50RWwuYXBwZW5kQ2hpbGQodGVtcEVsKTtcbiAgdGVtcEVsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgdGVtcEVsLnN0eWxlLndpZHRoID0gYmFzZWxpbmUgKyB1bml0O1xuICB2YXIgZmFjdG9yID0gYmFzZWxpbmUgLyB0ZW1wRWwub2Zmc2V0V2lkdGg7XG4gIHBhcmVudEVsLnJlbW92ZUNoaWxkKHRlbXBFbCk7XG4gIHZhciBjb252ZXJ0ZWRVbml0ID0gZmFjdG9yICogcGFyc2VGbG9hdCh2YWx1ZSk7XG4gIGNhY2hlLkNTU1t2YWx1ZSArIHVuaXRdID0gY29udmVydGVkVW5pdDtcbiAgcmV0dXJuIGNvbnZlcnRlZFVuaXQ7XG59XG5cbmZ1bmN0aW9uIGdldENTU1ZhbHVlKGVsLCBwcm9wLCB1bml0KSB7XG4gIGlmIChwcm9wIGluIGVsLnN0eWxlKSB7XG4gICAgdmFyIHVwcGVyY2FzZVByb3BOYW1lID0gcHJvcC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciB2YWx1ZSA9IGVsLnN0eWxlW3Byb3BdIHx8IGdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUodXBwZXJjYXNlUHJvcE5hbWUpIHx8ICcwJztcbiAgICByZXR1cm4gdW5pdCA/IGNvbnZlcnRQeFRvVW5pdChlbCwgdmFsdWUsIHVuaXQpIDogdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QW5pbWF0aW9uVHlwZShlbCwgcHJvcCkge1xuICBpZiAoaXMuZG9tKGVsKSAmJiAhaXMuaW5wKGVsKSAmJiAoIWlzLm5pbChnZXRBdHRyaWJ1dGUoZWwsIHByb3ApKSB8fCAoaXMuc3ZnKGVsKSAmJiBlbFtwcm9wXSkpKSB7IHJldHVybiAnYXR0cmlidXRlJzsgfVxuICBpZiAoaXMuZG9tKGVsKSAmJiBhcnJheUNvbnRhaW5zKHZhbGlkVHJhbnNmb3JtcywgcHJvcCkpIHsgcmV0dXJuICd0cmFuc2Zvcm0nOyB9XG4gIGlmIChpcy5kb20oZWwpICYmIChwcm9wICE9PSAndHJhbnNmb3JtJyAmJiBnZXRDU1NWYWx1ZShlbCwgcHJvcCkpKSB7IHJldHVybiAnY3NzJzsgfVxuICBpZiAoZWxbcHJvcF0gIT0gbnVsbCkgeyByZXR1cm4gJ29iamVjdCc7IH1cbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudFRyYW5zZm9ybXMoZWwpIHtcbiAgaWYgKCFpcy5kb20oZWwpKSB7IHJldHVybjsgfVxuICB2YXIgc3RyID0gZWwuc3R5bGUudHJhbnNmb3JtIHx8ICcnO1xuICB2YXIgcmVnICA9IC8oXFx3KylcXCgoW14pXSopXFwpL2c7XG4gIHZhciB0cmFuc2Zvcm1zID0gbmV3IE1hcCgpO1xuICB2YXIgbTsgd2hpbGUgKG0gPSByZWcuZXhlYyhzdHIpKSB7IHRyYW5zZm9ybXMuc2V0KG1bMV0sIG1bMl0pOyB9XG4gIHJldHVybiB0cmFuc2Zvcm1zO1xufVxuXG5mdW5jdGlvbiBnZXRUcmFuc2Zvcm1WYWx1ZShlbCwgcHJvcE5hbWUsIGFuaW1hdGFibGUsIHVuaXQpIHtcbiAgdmFyIGRlZmF1bHRWYWwgPSBzdHJpbmdDb250YWlucyhwcm9wTmFtZSwgJ3NjYWxlJykgPyAxIDogMCArIGdldFRyYW5zZm9ybVVuaXQocHJvcE5hbWUpO1xuICB2YXIgdmFsdWUgPSBnZXRFbGVtZW50VHJhbnNmb3JtcyhlbCkuZ2V0KHByb3BOYW1lKSB8fCBkZWZhdWx0VmFsO1xuICBpZiAoYW5pbWF0YWJsZSkge1xuICAgIGFuaW1hdGFibGUudHJhbnNmb3Jtcy5saXN0LnNldChwcm9wTmFtZSwgdmFsdWUpO1xuICAgIGFuaW1hdGFibGUudHJhbnNmb3Jtc1snbGFzdCddID0gcHJvcE5hbWU7XG4gIH1cbiAgcmV0dXJuIHVuaXQgPyBjb252ZXJ0UHhUb1VuaXQoZWwsIHZhbHVlLCB1bml0KSA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRPcmlnaW5hbFRhcmdldFZhbHVlKHRhcmdldCwgcHJvcE5hbWUsIHVuaXQsIGFuaW1hdGFibGUpIHtcbiAgc3dpdGNoIChnZXRBbmltYXRpb25UeXBlKHRhcmdldCwgcHJvcE5hbWUpKSB7XG4gICAgY2FzZSAndHJhbnNmb3JtJzogcmV0dXJuIGdldFRyYW5zZm9ybVZhbHVlKHRhcmdldCwgcHJvcE5hbWUsIGFuaW1hdGFibGUsIHVuaXQpO1xuICAgIGNhc2UgJ2Nzcyc6IHJldHVybiBnZXRDU1NWYWx1ZSh0YXJnZXQsIHByb3BOYW1lLCB1bml0KTtcbiAgICBjYXNlICdhdHRyaWJ1dGUnOiByZXR1cm4gZ2V0QXR0cmlidXRlKHRhcmdldCwgcHJvcE5hbWUpO1xuICAgIGRlZmF1bHQ6IHJldHVybiB0YXJnZXRbcHJvcE5hbWVdIHx8IDA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpdmVWYWx1ZSh0bywgZnJvbSkge1xuICB2YXIgb3BlcmF0b3IgPSAvXihcXCo9fFxcKz18LT0pLy5leGVjKHRvKTtcbiAgaWYgKCFvcGVyYXRvcikgeyByZXR1cm4gdG87IH1cbiAgdmFyIHUgPSBnZXRVbml0KHRvKSB8fCAwO1xuICB2YXIgeCA9IHBhcnNlRmxvYXQoZnJvbSk7XG4gIHZhciB5ID0gcGFyc2VGbG9hdCh0by5yZXBsYWNlKG9wZXJhdG9yWzBdLCAnJykpO1xuICBzd2l0Y2ggKG9wZXJhdG9yWzBdWzBdKSB7XG4gICAgY2FzZSAnKyc6IHJldHVybiB4ICsgeSArIHU7XG4gICAgY2FzZSAnLSc6IHJldHVybiB4IC0geSArIHU7XG4gICAgY2FzZSAnKic6IHJldHVybiB4ICogeSArIHU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVWYWx1ZSh2YWwsIHVuaXQpIHtcbiAgaWYgKGlzLmNvbCh2YWwpKSB7IHJldHVybiBjb2xvclRvUmdiKHZhbCk7IH1cbiAgaWYgKC9cXHMvZy50ZXN0KHZhbCkpIHsgcmV0dXJuIHZhbDsgfVxuICB2YXIgb3JpZ2luYWxVbml0ID0gZ2V0VW5pdCh2YWwpO1xuICB2YXIgdW5pdExlc3MgPSBvcmlnaW5hbFVuaXQgPyB2YWwuc3Vic3RyKDAsIHZhbC5sZW5ndGggLSBvcmlnaW5hbFVuaXQubGVuZ3RoKSA6IHZhbDtcbiAgaWYgKHVuaXQpIHsgcmV0dXJuIHVuaXRMZXNzICsgdW5pdDsgfVxuICByZXR1cm4gdW5pdExlc3M7XG59XG5cbi8vIGdldFRvdGFsTGVuZ3RoKCkgZXF1aXZhbGVudCBmb3IgY2lyY2xlLCByZWN0LCBwb2x5bGluZSwgcG9seWdvbiBhbmQgbGluZSBzaGFwZXNcbi8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9TZWJMYW1ibGEvM2UwNTUwYzQ5NmMyMzY3MDk3NDRcblxuZnVuY3Rpb24gZ2V0RGlzdGFuY2UocDEsIHAyKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3cocDIueCAtIHAxLngsIDIpICsgTWF0aC5wb3cocDIueSAtIHAxLnksIDIpKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2lyY2xlTGVuZ3RoKGVsKSB7XG4gIHJldHVybiBNYXRoLlBJICogMiAqIGdldEF0dHJpYnV0ZShlbCwgJ3InKTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVjdExlbmd0aChlbCkge1xuICByZXR1cm4gKGdldEF0dHJpYnV0ZShlbCwgJ3dpZHRoJykgKiAyKSArIChnZXRBdHRyaWJ1dGUoZWwsICdoZWlnaHQnKSAqIDIpO1xufVxuXG5mdW5jdGlvbiBnZXRMaW5lTGVuZ3RoKGVsKSB7XG4gIHJldHVybiBnZXREaXN0YW5jZShcbiAgICB7eDogZ2V0QXR0cmlidXRlKGVsLCAneDEnKSwgeTogZ2V0QXR0cmlidXRlKGVsLCAneTEnKX0sIFxuICAgIHt4OiBnZXRBdHRyaWJ1dGUoZWwsICd4MicpLCB5OiBnZXRBdHRyaWJ1dGUoZWwsICd5MicpfVxuICApO1xufVxuXG5mdW5jdGlvbiBnZXRQb2x5bGluZUxlbmd0aChlbCkge1xuICB2YXIgcG9pbnRzID0gZWwucG9pbnRzO1xuICB2YXIgdG90YWxMZW5ndGggPSAwO1xuICB2YXIgcHJldmlvdXNQb3M7XG4gIGZvciAodmFyIGkgPSAwIDsgaSA8IHBvaW50cy5udW1iZXJPZkl0ZW1zOyBpKyspIHtcbiAgICB2YXIgY3VycmVudFBvcyA9IHBvaW50cy5nZXRJdGVtKGkpO1xuICAgIGlmIChpID4gMCkgeyB0b3RhbExlbmd0aCArPSBnZXREaXN0YW5jZShwcmV2aW91c1BvcywgY3VycmVudFBvcyk7IH1cbiAgICBwcmV2aW91c1BvcyA9IGN1cnJlbnRQb3M7XG4gIH1cbiAgcmV0dXJuIHRvdGFsTGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBnZXRQb2x5Z29uTGVuZ3RoKGVsKSB7XG4gIHZhciBwb2ludHMgPSBlbC5wb2ludHM7XG4gIHJldHVybiBnZXRQb2x5bGluZUxlbmd0aChlbCkgKyBnZXREaXN0YW5jZShwb2ludHMuZ2V0SXRlbShwb2ludHMubnVtYmVyT2ZJdGVtcyAtIDEpLCBwb2ludHMuZ2V0SXRlbSgwKSk7XG59XG5cbi8vIFBhdGggYW5pbWF0aW9uXG5cbmZ1bmN0aW9uIGdldFRvdGFsTGVuZ3RoKGVsKSB7XG4gIGlmIChlbC5nZXRUb3RhbExlbmd0aCkgeyByZXR1cm4gZWwuZ2V0VG90YWxMZW5ndGgoKTsgfVxuICBzd2l0Y2goZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnY2lyY2xlJzogcmV0dXJuIGdldENpcmNsZUxlbmd0aChlbCk7XG4gICAgY2FzZSAncmVjdCc6IHJldHVybiBnZXRSZWN0TGVuZ3RoKGVsKTtcbiAgICBjYXNlICdsaW5lJzogcmV0dXJuIGdldExpbmVMZW5ndGgoZWwpO1xuICAgIGNhc2UgJ3BvbHlsaW5lJzogcmV0dXJuIGdldFBvbHlsaW5lTGVuZ3RoKGVsKTtcbiAgICBjYXNlICdwb2x5Z29uJzogcmV0dXJuIGdldFBvbHlnb25MZW5ndGgoZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhc2hvZmZzZXQoZWwpIHtcbiAgdmFyIHBhdGhMZW5ndGggPSBnZXRUb3RhbExlbmd0aChlbCk7XG4gIGVsLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hhcnJheScsIHBhdGhMZW5ndGgpO1xuICByZXR1cm4gcGF0aExlbmd0aDtcbn1cblxuLy8gTW90aW9uIHBhdGhcblxuZnVuY3Rpb24gZ2V0UGFyZW50U3ZnRWwoZWwpIHtcbiAgdmFyIHBhcmVudEVsID0gZWwucGFyZW50Tm9kZTtcbiAgd2hpbGUgKGlzLnN2ZyhwYXJlbnRFbCkpIHtcbiAgICBpZiAoIWlzLnN2ZyhwYXJlbnRFbC5wYXJlbnROb2RlKSkgeyBicmVhazsgfVxuICAgIHBhcmVudEVsID0gcGFyZW50RWwucGFyZW50Tm9kZTtcbiAgfVxuICByZXR1cm4gcGFyZW50RWw7XG59XG5cbmZ1bmN0aW9uIGdldFBhcmVudFN2ZyhwYXRoRWwsIHN2Z0RhdGEpIHtcbiAgdmFyIHN2ZyA9IHN2Z0RhdGEgfHwge307XG4gIHZhciBwYXJlbnRTdmdFbCA9IHN2Zy5lbCB8fCBnZXRQYXJlbnRTdmdFbChwYXRoRWwpO1xuICB2YXIgcmVjdCA9IHBhcmVudFN2Z0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgdmlld0JveEF0dHIgPSBnZXRBdHRyaWJ1dGUocGFyZW50U3ZnRWwsICd2aWV3Qm94Jyk7XG4gIHZhciB3aWR0aCA9IHJlY3Qud2lkdGg7XG4gIHZhciBoZWlnaHQgPSByZWN0LmhlaWdodDtcbiAgdmFyIHZpZXdCb3ggPSBzdmcudmlld0JveCB8fCAodmlld0JveEF0dHIgPyB2aWV3Qm94QXR0ci5zcGxpdCgnICcpIDogWzAsIDAsIHdpZHRoLCBoZWlnaHRdKTtcbiAgcmV0dXJuIHtcbiAgICBlbDogcGFyZW50U3ZnRWwsXG4gICAgdmlld0JveDogdmlld0JveCxcbiAgICB4OiB2aWV3Qm94WzBdIC8gMSxcbiAgICB5OiB2aWV3Qm94WzFdIC8gMSxcbiAgICB3OiB3aWR0aCxcbiAgICBoOiBoZWlnaHQsXG4gICAgdlc6IHZpZXdCb3hbMl0sXG4gICAgdkg6IHZpZXdCb3hbM11cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRQYXRoKHBhdGgsIHBlcmNlbnQpIHtcbiAgdmFyIHBhdGhFbCA9IGlzLnN0cihwYXRoKSA/IHNlbGVjdFN0cmluZyhwYXRoKVswXSA6IHBhdGg7XG4gIHZhciBwID0gcGVyY2VudCB8fCAxMDA7XG4gIHJldHVybiBmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICBlbDogcGF0aEVsLFxuICAgICAgc3ZnOiBnZXRQYXJlbnRTdmcocGF0aEVsKSxcbiAgICAgIHRvdGFsTGVuZ3RoOiBnZXRUb3RhbExlbmd0aChwYXRoRWwpICogKHAgLyAxMDApXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFBhdGhQcm9ncmVzcyhwYXRoLCBwcm9ncmVzcywgaXNQYXRoVGFyZ2V0SW5zaWRlU1ZHKSB7XG4gIGZ1bmN0aW9uIHBvaW50KG9mZnNldCkge1xuICAgIGlmICggb2Zmc2V0ID09PSB2b2lkIDAgKSBvZmZzZXQgPSAwO1xuXG4gICAgdmFyIGwgPSBwcm9ncmVzcyArIG9mZnNldCA+PSAxID8gcHJvZ3Jlc3MgKyBvZmZzZXQgOiAwO1xuICAgIHJldHVybiBwYXRoLmVsLmdldFBvaW50QXRMZW5ndGgobCk7XG4gIH1cbiAgdmFyIHN2ZyA9IGdldFBhcmVudFN2ZyhwYXRoLmVsLCBwYXRoLnN2Zyk7XG4gIHZhciBwID0gcG9pbnQoKTtcbiAgdmFyIHAwID0gcG9pbnQoLTEpO1xuICB2YXIgcDEgPSBwb2ludCgrMSk7XG4gIHZhciBzY2FsZVggPSBpc1BhdGhUYXJnZXRJbnNpZGVTVkcgPyAxIDogc3ZnLncgLyBzdmcudlc7XG4gIHZhciBzY2FsZVkgPSBpc1BhdGhUYXJnZXRJbnNpZGVTVkcgPyAxIDogc3ZnLmggLyBzdmcudkg7XG4gIHN3aXRjaCAocGF0aC5wcm9wZXJ0eSkge1xuICAgIGNhc2UgJ3gnOiByZXR1cm4gKHAueCAtIHN2Zy54KSAqIHNjYWxlWDtcbiAgICBjYXNlICd5JzogcmV0dXJuIChwLnkgLSBzdmcueSkgKiBzY2FsZVk7XG4gICAgY2FzZSAnYW5nbGUnOiByZXR1cm4gTWF0aC5hdGFuMihwMS55IC0gcDAueSwgcDEueCAtIHAwLngpICogMTgwIC8gTWF0aC5QSTtcbiAgfVxufVxuXG4vLyBEZWNvbXBvc2UgdmFsdWVcblxuZnVuY3Rpb24gZGVjb21wb3NlVmFsdWUodmFsLCB1bml0KSB7XG4gIC8vIGNvbnN0IHJneCA9IC8tP1xcZCpcXC4/XFxkKy9nOyAvLyBoYW5kbGVzIGJhc2ljIG51bWJlcnNcbiAgLy8gY29uc3Qgcmd4ID0gL1srLV0/XFxkKyg/OlxcLlxcZCspPyg/OltlRV1bKy1dP1xcZCspPy9nOyAvLyBoYW5kbGVzIGV4cG9uZW50cyBub3RhdGlvblxuICB2YXIgcmd4ID0gL1srLV0/XFxkKlxcLj9cXGQrKD86XFwuXFxkKyk/KD86W2VFXVsrLV0/XFxkKyk/L2c7IC8vIGhhbmRsZXMgZXhwb25lbnRzIG5vdGF0aW9uXG4gIHZhciB2YWx1ZSA9IHZhbGlkYXRlVmFsdWUoKGlzLnB0aCh2YWwpID8gdmFsLnRvdGFsTGVuZ3RoIDogdmFsKSwgdW5pdCkgKyAnJztcbiAgcmV0dXJuIHtcbiAgICBvcmlnaW5hbDogdmFsdWUsXG4gICAgbnVtYmVyczogdmFsdWUubWF0Y2gocmd4KSA/IHZhbHVlLm1hdGNoKHJneCkubWFwKE51bWJlcikgOiBbMF0sXG4gICAgc3RyaW5nczogKGlzLnN0cih2YWwpIHx8IHVuaXQpID8gdmFsdWUuc3BsaXQocmd4KSA6IFtdXG4gIH1cbn1cblxuLy8gQW5pbWF0YWJsZXNcblxuZnVuY3Rpb24gcGFyc2VUYXJnZXRzKHRhcmdldHMpIHtcbiAgdmFyIHRhcmdldHNBcnJheSA9IHRhcmdldHMgPyAoZmxhdHRlbkFycmF5KGlzLmFycih0YXJnZXRzKSA/IHRhcmdldHMubWFwKHRvQXJyYXkpIDogdG9BcnJheSh0YXJnZXRzKSkpIDogW107XG4gIHJldHVybiBmaWx0ZXJBcnJheSh0YXJnZXRzQXJyYXksIGZ1bmN0aW9uIChpdGVtLCBwb3MsIHNlbGYpIHsgcmV0dXJuIHNlbGYuaW5kZXhPZihpdGVtKSA9PT0gcG9zOyB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QW5pbWF0YWJsZXModGFyZ2V0cykge1xuICB2YXIgcGFyc2VkID0gcGFyc2VUYXJnZXRzKHRhcmdldHMpO1xuICByZXR1cm4gcGFyc2VkLm1hcChmdW5jdGlvbiAodCwgaSkge1xuICAgIHJldHVybiB7dGFyZ2V0OiB0LCBpZDogaSwgdG90YWw6IHBhcnNlZC5sZW5ndGgsIHRyYW5zZm9ybXM6IHsgbGlzdDogZ2V0RWxlbWVudFRyYW5zZm9ybXModCkgfSB9O1xuICB9KTtcbn1cblxuLy8gUHJvcGVydGllc1xuXG5mdW5jdGlvbiBub3JtYWxpemVQcm9wZXJ0eVR3ZWVucyhwcm9wLCB0d2VlblNldHRpbmdzKSB7XG4gIHZhciBzZXR0aW5ncyA9IGNsb25lT2JqZWN0KHR3ZWVuU2V0dGluZ3MpO1xuICAvLyBPdmVycmlkZSBkdXJhdGlvbiBpZiBlYXNpbmcgaXMgYSBzcHJpbmdcbiAgaWYgKC9ec3ByaW5nLy50ZXN0KHNldHRpbmdzLmVhc2luZykpIHsgc2V0dGluZ3MuZHVyYXRpb24gPSBzcHJpbmcoc2V0dGluZ3MuZWFzaW5nKTsgfVxuICBpZiAoaXMuYXJyKHByb3ApKSB7XG4gICAgdmFyIGwgPSBwcm9wLmxlbmd0aDtcbiAgICB2YXIgaXNGcm9tVG8gPSAobCA9PT0gMiAmJiAhaXMub2JqKHByb3BbMF0pKTtcbiAgICBpZiAoIWlzRnJvbVRvKSB7XG4gICAgICAvLyBEdXJhdGlvbiBkaXZpZGVkIGJ5IHRoZSBudW1iZXIgb2YgdHdlZW5zXG4gICAgICBpZiAoIWlzLmZuYyh0d2VlblNldHRpbmdzLmR1cmF0aW9uKSkgeyBzZXR0aW5ncy5kdXJhdGlvbiA9IHR3ZWVuU2V0dGluZ3MuZHVyYXRpb24gLyBsOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRyYW5zZm9ybSBbZnJvbSwgdG9dIHZhbHVlcyBzaG9ydGhhbmQgdG8gYSB2YWxpZCB0d2VlbiB2YWx1ZVxuICAgICAgcHJvcCA9IHt2YWx1ZTogcHJvcH07XG4gICAgfVxuICB9XG4gIHZhciBwcm9wQXJyYXkgPSBpcy5hcnIocHJvcCkgPyBwcm9wIDogW3Byb3BdO1xuICByZXR1cm4gcHJvcEFycmF5Lm1hcChmdW5jdGlvbiAodiwgaSkge1xuICAgIHZhciBvYmogPSAoaXMub2JqKHYpICYmICFpcy5wdGgodikpID8gdiA6IHt2YWx1ZTogdn07XG4gICAgLy8gRGVmYXVsdCBkZWxheSB2YWx1ZSBzaG91bGQgb25seSBiZSBhcHBsaWVkIHRvIHRoZSBmaXJzdCB0d2VlblxuICAgIGlmIChpcy51bmQob2JqLmRlbGF5KSkgeyBvYmouZGVsYXkgPSAhaSA/IHR3ZWVuU2V0dGluZ3MuZGVsYXkgOiAwOyB9XG4gICAgLy8gRGVmYXVsdCBlbmREZWxheSB2YWx1ZSBzaG91bGQgb25seSBiZSBhcHBsaWVkIHRvIHRoZSBsYXN0IHR3ZWVuXG4gICAgaWYgKGlzLnVuZChvYmouZW5kRGVsYXkpKSB7IG9iai5lbmREZWxheSA9IGkgPT09IHByb3BBcnJheS5sZW5ndGggLSAxID8gdHdlZW5TZXR0aW5ncy5lbmREZWxheSA6IDA7IH1cbiAgICByZXR1cm4gb2JqO1xuICB9KS5tYXAoZnVuY3Rpb24gKGspIHsgcmV0dXJuIG1lcmdlT2JqZWN0cyhrLCBzZXR0aW5ncyk7IH0pO1xufVxuXG5cbmZ1bmN0aW9uIGZsYXR0ZW5LZXlmcmFtZXMoa2V5ZnJhbWVzKSB7XG4gIHZhciBwcm9wZXJ0eU5hbWVzID0gZmlsdGVyQXJyYXkoZmxhdHRlbkFycmF5KGtleWZyYW1lcy5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gT2JqZWN0LmtleXMoa2V5KTsgfSkpLCBmdW5jdGlvbiAocCkgeyByZXR1cm4gaXMua2V5KHApOyB9KVxuICAucmVkdWNlKGZ1bmN0aW9uIChhLGIpIHsgaWYgKGEuaW5kZXhPZihiKSA8IDApIHsgYS5wdXNoKGIpOyB9IHJldHVybiBhOyB9LCBbXSk7XG4gIHZhciBwcm9wZXJ0aWVzID0ge307XG4gIHZhciBsb29wID0gZnVuY3Rpb24gKCBpICkge1xuICAgIHZhciBwcm9wTmFtZSA9IHByb3BlcnR5TmFtZXNbaV07XG4gICAgcHJvcGVydGllc1twcm9wTmFtZV0gPSBrZXlmcmFtZXMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBuZXdLZXkgPSB7fTtcbiAgICAgIGZvciAodmFyIHAgaW4ga2V5KSB7XG4gICAgICAgIGlmIChpcy5rZXkocCkpIHtcbiAgICAgICAgICBpZiAocCA9PSBwcm9wTmFtZSkgeyBuZXdLZXkudmFsdWUgPSBrZXlbcF07IH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdLZXlbcF0gPSBrZXlbcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdLZXk7XG4gICAgfSk7XG4gIH07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0eU5hbWVzLmxlbmd0aDsgaSsrKSBsb29wKCBpICk7XG4gIHJldHVybiBwcm9wZXJ0aWVzO1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKHR3ZWVuU2V0dGluZ3MsIHBhcmFtcykge1xuICB2YXIgcHJvcGVydGllcyA9IFtdO1xuICB2YXIga2V5ZnJhbWVzID0gcGFyYW1zLmtleWZyYW1lcztcbiAgaWYgKGtleWZyYW1lcykgeyBwYXJhbXMgPSBtZXJnZU9iamVjdHMoZmxhdHRlbktleWZyYW1lcyhrZXlmcmFtZXMpLCBwYXJhbXMpOyB9XG4gIGZvciAodmFyIHAgaW4gcGFyYW1zKSB7XG4gICAgaWYgKGlzLmtleShwKSkge1xuICAgICAgcHJvcGVydGllcy5wdXNoKHtcbiAgICAgICAgbmFtZTogcCxcbiAgICAgICAgdHdlZW5zOiBub3JtYWxpemVQcm9wZXJ0eVR3ZWVucyhwYXJhbXNbcF0sIHR3ZWVuU2V0dGluZ3MpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb3BlcnRpZXM7XG59XG5cbi8vIFR3ZWVuc1xuXG5mdW5jdGlvbiBub3JtYWxpemVUd2VlblZhbHVlcyh0d2VlbiwgYW5pbWF0YWJsZSkge1xuICB2YXIgdCA9IHt9O1xuICBmb3IgKHZhciBwIGluIHR3ZWVuKSB7XG4gICAgdmFyIHZhbHVlID0gZ2V0RnVuY3Rpb25WYWx1ZSh0d2VlbltwXSwgYW5pbWF0YWJsZSk7XG4gICAgaWYgKGlzLmFycih2YWx1ZSkpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiBnZXRGdW5jdGlvblZhbHVlKHYsIGFuaW1hdGFibGUpOyB9KTtcbiAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDEpIHsgdmFsdWUgPSB2YWx1ZVswXTsgfVxuICAgIH1cbiAgICB0W3BdID0gdmFsdWU7XG4gIH1cbiAgdC5kdXJhdGlvbiA9IHBhcnNlRmxvYXQodC5kdXJhdGlvbik7XG4gIHQuZGVsYXkgPSBwYXJzZUZsb2F0KHQuZGVsYXkpO1xuICByZXR1cm4gdDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVHdlZW5zKHByb3AsIGFuaW1hdGFibGUpIHtcbiAgdmFyIHByZXZpb3VzVHdlZW47XG4gIHJldHVybiBwcm9wLnR3ZWVucy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICB2YXIgdHdlZW4gPSBub3JtYWxpemVUd2VlblZhbHVlcyh0LCBhbmltYXRhYmxlKTtcbiAgICB2YXIgdHdlZW5WYWx1ZSA9IHR3ZWVuLnZhbHVlO1xuICAgIHZhciB0byA9IGlzLmFycih0d2VlblZhbHVlKSA/IHR3ZWVuVmFsdWVbMV0gOiB0d2VlblZhbHVlO1xuICAgIHZhciB0b1VuaXQgPSBnZXRVbml0KHRvKTtcbiAgICB2YXIgb3JpZ2luYWxWYWx1ZSA9IGdldE9yaWdpbmFsVGFyZ2V0VmFsdWUoYW5pbWF0YWJsZS50YXJnZXQsIHByb3AubmFtZSwgdG9Vbml0LCBhbmltYXRhYmxlKTtcbiAgICB2YXIgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzVHdlZW4gPyBwcmV2aW91c1R3ZWVuLnRvLm9yaWdpbmFsIDogb3JpZ2luYWxWYWx1ZTtcbiAgICB2YXIgZnJvbSA9IGlzLmFycih0d2VlblZhbHVlKSA/IHR3ZWVuVmFsdWVbMF0gOiBwcmV2aW91c1ZhbHVlO1xuICAgIHZhciBmcm9tVW5pdCA9IGdldFVuaXQoZnJvbSkgfHwgZ2V0VW5pdChvcmlnaW5hbFZhbHVlKTtcbiAgICB2YXIgdW5pdCA9IHRvVW5pdCB8fCBmcm9tVW5pdDtcbiAgICBpZiAoaXMudW5kKHRvKSkgeyB0byA9IHByZXZpb3VzVmFsdWU7IH1cbiAgICB0d2Vlbi5mcm9tID0gZGVjb21wb3NlVmFsdWUoZnJvbSwgdW5pdCk7XG4gICAgdHdlZW4udG8gPSBkZWNvbXBvc2VWYWx1ZShnZXRSZWxhdGl2ZVZhbHVlKHRvLCBmcm9tKSwgdW5pdCk7XG4gICAgdHdlZW4uc3RhcnQgPSBwcmV2aW91c1R3ZWVuID8gcHJldmlvdXNUd2Vlbi5lbmQgOiAwO1xuICAgIHR3ZWVuLmVuZCA9IHR3ZWVuLnN0YXJ0ICsgdHdlZW4uZGVsYXkgKyB0d2Vlbi5kdXJhdGlvbiArIHR3ZWVuLmVuZERlbGF5O1xuICAgIHR3ZWVuLmVhc2luZyA9IHBhcnNlRWFzaW5ncyh0d2Vlbi5lYXNpbmcsIHR3ZWVuLmR1cmF0aW9uKTtcbiAgICB0d2Vlbi5pc1BhdGggPSBpcy5wdGgodHdlZW5WYWx1ZSk7XG4gICAgdHdlZW4uaXNQYXRoVGFyZ2V0SW5zaWRlU1ZHID0gdHdlZW4uaXNQYXRoICYmIGlzLnN2ZyhhbmltYXRhYmxlLnRhcmdldCk7XG4gICAgdHdlZW4uaXNDb2xvciA9IGlzLmNvbCh0d2Vlbi5mcm9tLm9yaWdpbmFsKTtcbiAgICBpZiAodHdlZW4uaXNDb2xvcikgeyB0d2Vlbi5yb3VuZCA9IDE7IH1cbiAgICBwcmV2aW91c1R3ZWVuID0gdHdlZW47XG4gICAgcmV0dXJuIHR3ZWVuO1xuICB9KTtcbn1cblxuLy8gVHdlZW4gcHJvZ3Jlc3NcblxudmFyIHNldFByb2dyZXNzVmFsdWUgPSB7XG4gIGNzczogZnVuY3Rpb24gKHQsIHAsIHYpIHsgcmV0dXJuIHQuc3R5bGVbcF0gPSB2OyB9LFxuICBhdHRyaWJ1dGU6IGZ1bmN0aW9uICh0LCBwLCB2KSB7IHJldHVybiB0LnNldEF0dHJpYnV0ZShwLCB2KTsgfSxcbiAgb2JqZWN0OiBmdW5jdGlvbiAodCwgcCwgdikgeyByZXR1cm4gdFtwXSA9IHY7IH0sXG4gIHRyYW5zZm9ybTogZnVuY3Rpb24gKHQsIHAsIHYsIHRyYW5zZm9ybXMsIG1hbnVhbCkge1xuICAgIHRyYW5zZm9ybXMubGlzdC5zZXQocCwgdik7XG4gICAgaWYgKHAgPT09IHRyYW5zZm9ybXMubGFzdCB8fCBtYW51YWwpIHtcbiAgICAgIHZhciBzdHIgPSAnJztcbiAgICAgIHRyYW5zZm9ybXMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgcHJvcCkgeyBzdHIgKz0gcHJvcCArIFwiKFwiICsgdmFsdWUgKyBcIikgXCI7IH0pO1xuICAgICAgdC5zdHlsZS50cmFuc2Zvcm0gPSBzdHI7XG4gICAgfVxuICB9XG59O1xuXG4vLyBTZXQgVmFsdWUgaGVscGVyXG5cbmZ1bmN0aW9uIHNldFRhcmdldHNWYWx1ZSh0YXJnZXRzLCBwcm9wZXJ0aWVzKSB7XG4gIHZhciBhbmltYXRhYmxlcyA9IGdldEFuaW1hdGFibGVzKHRhcmdldHMpO1xuICBhbmltYXRhYmxlcy5mb3JFYWNoKGZ1bmN0aW9uIChhbmltYXRhYmxlKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvcGVydGllcykge1xuICAgICAgdmFyIHZhbHVlID0gZ2V0RnVuY3Rpb25WYWx1ZShwcm9wZXJ0aWVzW3Byb3BlcnR5XSwgYW5pbWF0YWJsZSk7XG4gICAgICB2YXIgdGFyZ2V0ID0gYW5pbWF0YWJsZS50YXJnZXQ7XG4gICAgICB2YXIgdmFsdWVVbml0ID0gZ2V0VW5pdCh2YWx1ZSk7XG4gICAgICB2YXIgb3JpZ2luYWxWYWx1ZSA9IGdldE9yaWdpbmFsVGFyZ2V0VmFsdWUodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWVVbml0LCBhbmltYXRhYmxlKTtcbiAgICAgIHZhciB1bml0ID0gdmFsdWVVbml0IHx8IGdldFVuaXQob3JpZ2luYWxWYWx1ZSk7XG4gICAgICB2YXIgdG8gPSBnZXRSZWxhdGl2ZVZhbHVlKHZhbGlkYXRlVmFsdWUodmFsdWUsIHVuaXQpLCBvcmlnaW5hbFZhbHVlKTtcbiAgICAgIHZhciBhbmltVHlwZSA9IGdldEFuaW1hdGlvblR5cGUodGFyZ2V0LCBwcm9wZXJ0eSk7XG4gICAgICBzZXRQcm9ncmVzc1ZhbHVlW2FuaW1UeXBlXSh0YXJnZXQsIHByb3BlcnR5LCB0bywgYW5pbWF0YWJsZS50cmFuc2Zvcm1zLCB0cnVlKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBBbmltYXRpb25zXG5cbmZ1bmN0aW9uIGNyZWF0ZUFuaW1hdGlvbihhbmltYXRhYmxlLCBwcm9wKSB7XG4gIHZhciBhbmltVHlwZSA9IGdldEFuaW1hdGlvblR5cGUoYW5pbWF0YWJsZS50YXJnZXQsIHByb3AubmFtZSk7XG4gIGlmIChhbmltVHlwZSkge1xuICAgIHZhciB0d2VlbnMgPSBub3JtYWxpemVUd2VlbnMocHJvcCwgYW5pbWF0YWJsZSk7XG4gICAgdmFyIGxhc3RUd2VlbiA9IHR3ZWVuc1t0d2VlbnMubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IGFuaW1UeXBlLFxuICAgICAgcHJvcGVydHk6IHByb3AubmFtZSxcbiAgICAgIGFuaW1hdGFibGU6IGFuaW1hdGFibGUsXG4gICAgICB0d2VlbnM6IHR3ZWVucyxcbiAgICAgIGR1cmF0aW9uOiBsYXN0VHdlZW4uZW5kLFxuICAgICAgZGVsYXk6IHR3ZWVuc1swXS5kZWxheSxcbiAgICAgIGVuZERlbGF5OiBsYXN0VHdlZW4uZW5kRGVsYXlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QW5pbWF0aW9ucyhhbmltYXRhYmxlcywgcHJvcGVydGllcykge1xuICByZXR1cm4gZmlsdGVyQXJyYXkoZmxhdHRlbkFycmF5KGFuaW1hdGFibGVzLm1hcChmdW5jdGlvbiAoYW5pbWF0YWJsZSkge1xuICAgIHJldHVybiBwcm9wZXJ0aWVzLm1hcChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUFuaW1hdGlvbihhbmltYXRhYmxlLCBwcm9wKTtcbiAgICB9KTtcbiAgfSkpLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gIWlzLnVuZChhKTsgfSk7XG59XG5cbi8vIENyZWF0ZSBJbnN0YW5jZVxuXG5mdW5jdGlvbiBnZXRJbnN0YW5jZVRpbWluZ3MoYW5pbWF0aW9ucywgdHdlZW5TZXR0aW5ncykge1xuICB2YXIgYW5pbUxlbmd0aCA9IGFuaW1hdGlvbnMubGVuZ3RoO1xuICB2YXIgZ2V0VGxPZmZzZXQgPSBmdW5jdGlvbiAoYW5pbSkgeyByZXR1cm4gYW5pbS50aW1lbGluZU9mZnNldCA/IGFuaW0udGltZWxpbmVPZmZzZXQgOiAwOyB9O1xuICB2YXIgdGltaW5ncyA9IHt9O1xuICB0aW1pbmdzLmR1cmF0aW9uID0gYW5pbUxlbmd0aCA/IE1hdGgubWF4LmFwcGx5KE1hdGgsIGFuaW1hdGlvbnMubWFwKGZ1bmN0aW9uIChhbmltKSB7IHJldHVybiBnZXRUbE9mZnNldChhbmltKSArIGFuaW0uZHVyYXRpb247IH0pKSA6IHR3ZWVuU2V0dGluZ3MuZHVyYXRpb247XG4gIHRpbWluZ3MuZGVsYXkgPSBhbmltTGVuZ3RoID8gTWF0aC5taW4uYXBwbHkoTWF0aCwgYW5pbWF0aW9ucy5tYXAoZnVuY3Rpb24gKGFuaW0pIHsgcmV0dXJuIGdldFRsT2Zmc2V0KGFuaW0pICsgYW5pbS5kZWxheTsgfSkpIDogdHdlZW5TZXR0aW5ncy5kZWxheTtcbiAgdGltaW5ncy5lbmREZWxheSA9IGFuaW1MZW5ndGggPyB0aW1pbmdzLmR1cmF0aW9uIC0gTWF0aC5tYXguYXBwbHkoTWF0aCwgYW5pbWF0aW9ucy5tYXAoZnVuY3Rpb24gKGFuaW0pIHsgcmV0dXJuIGdldFRsT2Zmc2V0KGFuaW0pICsgYW5pbS5kdXJhdGlvbiAtIGFuaW0uZW5kRGVsYXk7IH0pKSA6IHR3ZWVuU2V0dGluZ3MuZW5kRGVsYXk7XG4gIHJldHVybiB0aW1pbmdzO1xufVxuXG52YXIgaW5zdGFuY2VJRCA9IDA7XG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld0luc3RhbmNlKHBhcmFtcykge1xuICB2YXIgaW5zdGFuY2VTZXR0aW5ncyA9IHJlcGxhY2VPYmplY3RQcm9wcyhkZWZhdWx0SW5zdGFuY2VTZXR0aW5ncywgcGFyYW1zKTtcbiAgdmFyIHR3ZWVuU2V0dGluZ3MgPSByZXBsYWNlT2JqZWN0UHJvcHMoZGVmYXVsdFR3ZWVuU2V0dGluZ3MsIHBhcmFtcyk7XG4gIHZhciBwcm9wZXJ0aWVzID0gZ2V0UHJvcGVydGllcyh0d2VlblNldHRpbmdzLCBwYXJhbXMpO1xuICB2YXIgYW5pbWF0YWJsZXMgPSBnZXRBbmltYXRhYmxlcyhwYXJhbXMudGFyZ2V0cyk7XG4gIHZhciBhbmltYXRpb25zID0gZ2V0QW5pbWF0aW9ucyhhbmltYXRhYmxlcywgcHJvcGVydGllcyk7XG4gIHZhciB0aW1pbmdzID0gZ2V0SW5zdGFuY2VUaW1pbmdzKGFuaW1hdGlvbnMsIHR3ZWVuU2V0dGluZ3MpO1xuICB2YXIgaWQgPSBpbnN0YW5jZUlEO1xuICBpbnN0YW5jZUlEKys7XG4gIHJldHVybiBtZXJnZU9iamVjdHMoaW5zdGFuY2VTZXR0aW5ncywge1xuICAgIGlkOiBpZCxcbiAgICBjaGlsZHJlbjogW10sXG4gICAgYW5pbWF0YWJsZXM6IGFuaW1hdGFibGVzLFxuICAgIGFuaW1hdGlvbnM6IGFuaW1hdGlvbnMsXG4gICAgZHVyYXRpb246IHRpbWluZ3MuZHVyYXRpb24sXG4gICAgZGVsYXk6IHRpbWluZ3MuZGVsYXksXG4gICAgZW5kRGVsYXk6IHRpbWluZ3MuZW5kRGVsYXlcbiAgfSk7XG59XG5cbi8vIENvcmVcblxudmFyIGFjdGl2ZUluc3RhbmNlcyA9IFtdO1xuXG52YXIgZW5naW5lID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJhZjtcblxuICBmdW5jdGlvbiBwbGF5KCkge1xuICAgIGlmICghcmFmICYmICghaXNEb2N1bWVudEhpZGRlbigpIHx8ICFhbmltZS5zdXNwZW5kV2hlbkRvY3VtZW50SGlkZGVuKSAmJiBhY3RpdmVJbnN0YW5jZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzdGVwKHQpIHtcbiAgICAvLyBtZW1vIG9uIGFsZ29yaXRobSBpc3N1ZTpcbiAgICAvLyBkYW5nZXJvdXMgaXRlcmF0aW9uIG92ZXIgbXV0YWJsZSBgYWN0aXZlSW5zdGFuY2VzYFxuICAgIC8vICh0aGF0IGNvbGxlY3Rpb24gbWF5IGJlIHVwZGF0ZWQgZnJvbSB3aXRoaW4gY2FsbGJhY2tzIG9mIGB0aWNrYC1lZCBhbmltYXRpb24gaW5zdGFuY2VzKVxuICAgIHZhciBhY3RpdmVJbnN0YW5jZXNMZW5ndGggPSBhY3RpdmVJbnN0YW5jZXMubGVuZ3RoO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGFjdGl2ZUluc3RhbmNlc0xlbmd0aCkge1xuICAgICAgdmFyIGFjdGl2ZUluc3RhbmNlID0gYWN0aXZlSW5zdGFuY2VzW2ldO1xuICAgICAgaWYgKCFhY3RpdmVJbnN0YW5jZS5wYXVzZWQpIHtcbiAgICAgICAgYWN0aXZlSW5zdGFuY2UudGljayh0KTtcbiAgICAgICAgaSsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aXZlSW5zdGFuY2VzLnNwbGljZShpLCAxKTtcbiAgICAgICAgYWN0aXZlSW5zdGFuY2VzTGVuZ3RoLS07XG4gICAgICB9XG4gICAgfVxuICAgIHJhZiA9IGkgPiAwID8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSgpIHtcbiAgICBpZiAoIWFuaW1lLnN1c3BlbmRXaGVuRG9jdW1lbnRIaWRkZW4pIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAoaXNEb2N1bWVudEhpZGRlbigpKSB7XG4gICAgICAvLyBzdXNwZW5kIHRpY2tzXG4gICAgICByYWYgPSBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpO1xuICAgIH0gZWxzZSB7IC8vIGlzIGJhY2sgdG8gYWN0aXZlIHRhYlxuICAgICAgLy8gZmlyc3QgYWRqdXN0IGFuaW1hdGlvbnMgdG8gY29uc2lkZXIgdGhlIHRpbWUgdGhhdCB0aWNrcyB3ZXJlIHN1c3BlbmRlZFxuICAgICAgYWN0aXZlSW5zdGFuY2VzLmZvckVhY2goXG4gICAgICAgIGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UgLl9vbkRvY3VtZW50VmlzaWJpbGl0eSgpOyB9XG4gICAgICApO1xuICAgICAgZW5naW5lKCk7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UpO1xuICB9XG5cbiAgcmV0dXJuIHBsYXk7XG59KSgpO1xuXG5mdW5jdGlvbiBpc0RvY3VtZW50SGlkZGVuKCkge1xuICByZXR1cm4gISFkb2N1bWVudCAmJiBkb2N1bWVudC5oaWRkZW47XG59XG5cbi8vIFB1YmxpYyBJbnN0YW5jZVxuXG5mdW5jdGlvbiBhbmltZShwYXJhbXMpIHtcbiAgaWYgKCBwYXJhbXMgPT09IHZvaWQgMCApIHBhcmFtcyA9IHt9O1xuXG5cbiAgdmFyIHN0YXJ0VGltZSA9IDAsIGxhc3RUaW1lID0gMCwgbm93ID0gMDtcbiAgdmFyIGNoaWxkcmVuLCBjaGlsZHJlbkxlbmd0aCA9IDA7XG4gIHZhciByZXNvbHZlID0gbnVsbDtcblxuICBmdW5jdGlvbiBtYWtlUHJvbWlzZShpbnN0YW5jZSkge1xuICAgIHZhciBwcm9taXNlID0gd2luZG93LlByb21pc2UgJiYgbmV3IFByb21pc2UoZnVuY3Rpb24gKF9yZXNvbHZlKSB7IHJldHVybiByZXNvbHZlID0gX3Jlc29sdmU7IH0pO1xuICAgIGluc3RhbmNlLmZpbmlzaGVkID0gcHJvbWlzZTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHZhciBpbnN0YW5jZSA9IGNyZWF0ZU5ld0luc3RhbmNlKHBhcmFtcyk7XG4gIHZhciBwcm9taXNlID0gbWFrZVByb21pc2UoaW5zdGFuY2UpO1xuXG4gIGZ1bmN0aW9uIHRvZ2dsZUluc3RhbmNlRGlyZWN0aW9uKCkge1xuICAgIHZhciBkaXJlY3Rpb24gPSBpbnN0YW5jZS5kaXJlY3Rpb247XG4gICAgaWYgKGRpcmVjdGlvbiAhPT0gJ2FsdGVybmF0ZScpIHtcbiAgICAgIGluc3RhbmNlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbiAhPT0gJ25vcm1hbCcgPyAnbm9ybWFsJyA6ICdyZXZlcnNlJztcbiAgICB9XG4gICAgaW5zdGFuY2UucmV2ZXJzZWQgPSAhaW5zdGFuY2UucmV2ZXJzZWQ7XG4gICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHsgcmV0dXJuIGNoaWxkLnJldmVyc2VkID0gaW5zdGFuY2UucmV2ZXJzZWQ7IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRqdXN0VGltZSh0aW1lKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnJldmVyc2VkID8gaW5zdGFuY2UuZHVyYXRpb24gLSB0aW1lIDogdGltZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VGltZSgpIHtcbiAgICBzdGFydFRpbWUgPSAwO1xuICAgIGxhc3RUaW1lID0gYWRqdXN0VGltZShpbnN0YW5jZS5jdXJyZW50VGltZSkgKiAoMSAvIGFuaW1lLnNwZWVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlZWtDaGlsZCh0aW1lLCBjaGlsZCkge1xuICAgIGlmIChjaGlsZCkgeyBjaGlsZC5zZWVrKHRpbWUgLSBjaGlsZC50aW1lbGluZU9mZnNldCk7IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN5bmNJbnN0YW5jZUNoaWxkcmVuKHRpbWUpIHtcbiAgICBpZiAoIWluc3RhbmNlLnJldmVyc2VQbGF5YmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7IHNlZWtDaGlsZCh0aW1lLCBjaGlsZHJlbltpXSk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSQxID0gY2hpbGRyZW5MZW5ndGg7IGkkMS0tOykgeyBzZWVrQ2hpbGQodGltZSwgY2hpbGRyZW5baSQxXSk7IH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRBbmltYXRpb25zUHJvZ3Jlc3MoaW5zVGltZSkge1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgYW5pbWF0aW9ucyA9IGluc3RhbmNlLmFuaW1hdGlvbnM7XG4gICAgdmFyIGFuaW1hdGlvbnNMZW5ndGggPSBhbmltYXRpb25zLmxlbmd0aDtcbiAgICB3aGlsZSAoaSA8IGFuaW1hdGlvbnNMZW5ndGgpIHtcbiAgICAgIHZhciBhbmltID0gYW5pbWF0aW9uc1tpXTtcbiAgICAgIHZhciBhbmltYXRhYmxlID0gYW5pbS5hbmltYXRhYmxlO1xuICAgICAgdmFyIHR3ZWVucyA9IGFuaW0udHdlZW5zO1xuICAgICAgdmFyIHR3ZWVuTGVuZ3RoID0gdHdlZW5zLmxlbmd0aCAtIDE7XG4gICAgICB2YXIgdHdlZW4gPSB0d2VlbnNbdHdlZW5MZW5ndGhdO1xuICAgICAgLy8gT25seSBjaGVjayBmb3Iga2V5ZnJhbWVzIGlmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgdHdlZW5cbiAgICAgIGlmICh0d2Vlbkxlbmd0aCkgeyB0d2VlbiA9IGZpbHRlckFycmF5KHR3ZWVucywgZnVuY3Rpb24gKHQpIHsgcmV0dXJuIChpbnNUaW1lIDwgdC5lbmQpOyB9KVswXSB8fCB0d2VlbjsgfVxuICAgICAgdmFyIGVsYXBzZWQgPSBtaW5NYXgoaW5zVGltZSAtIHR3ZWVuLnN0YXJ0IC0gdHdlZW4uZGVsYXksIDAsIHR3ZWVuLmR1cmF0aW9uKSAvIHR3ZWVuLmR1cmF0aW9uO1xuICAgICAgdmFyIGVhc2VkID0gaXNOYU4oZWxhcHNlZCkgPyAxIDogdHdlZW4uZWFzaW5nKGVsYXBzZWQpO1xuICAgICAgdmFyIHN0cmluZ3MgPSB0d2Vlbi50by5zdHJpbmdzO1xuICAgICAgdmFyIHJvdW5kID0gdHdlZW4ucm91bmQ7XG4gICAgICB2YXIgbnVtYmVycyA9IFtdO1xuICAgICAgdmFyIHRvTnVtYmVyc0xlbmd0aCA9IHR3ZWVuLnRvLm51bWJlcnMubGVuZ3RoO1xuICAgICAgdmFyIHByb2dyZXNzID0gKHZvaWQgMCk7XG4gICAgICBmb3IgKHZhciBuID0gMDsgbiA8IHRvTnVtYmVyc0xlbmd0aDsgbisrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9ICh2b2lkIDApO1xuICAgICAgICB2YXIgdG9OdW1iZXIgPSB0d2Vlbi50by5udW1iZXJzW25dO1xuICAgICAgICB2YXIgZnJvbU51bWJlciA9IHR3ZWVuLmZyb20ubnVtYmVyc1tuXSB8fCAwO1xuICAgICAgICBpZiAoIXR3ZWVuLmlzUGF0aCkge1xuICAgICAgICAgIHZhbHVlID0gZnJvbU51bWJlciArIChlYXNlZCAqICh0b051bWJlciAtIGZyb21OdW1iZXIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IGdldFBhdGhQcm9ncmVzcyh0d2Vlbi52YWx1ZSwgZWFzZWQgKiB0b051bWJlciwgdHdlZW4uaXNQYXRoVGFyZ2V0SW5zaWRlU1ZHKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm91bmQpIHtcbiAgICAgICAgICBpZiAoISh0d2Vlbi5pc0NvbG9yICYmIG4gPiAyKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlICogcm91bmQpIC8gcm91bmQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG51bWJlcnMucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICAvLyBNYW51YWwgQXJyYXkucmVkdWNlIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2VzXG4gICAgICB2YXIgc3RyaW5nc0xlbmd0aCA9IHN0cmluZ3MubGVuZ3RoO1xuICAgICAgaWYgKCFzdHJpbmdzTGVuZ3RoKSB7XG4gICAgICAgIHByb2dyZXNzID0gbnVtYmVyc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2dyZXNzID0gc3RyaW5nc1swXTtcbiAgICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBzdHJpbmdzTGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICB2YXIgYSA9IHN0cmluZ3Nbc107XG4gICAgICAgICAgdmFyIGIgPSBzdHJpbmdzW3MgKyAxXTtcbiAgICAgICAgICB2YXIgbiQxID0gbnVtYmVyc1tzXTtcbiAgICAgICAgICBpZiAoIWlzTmFOKG4kMSkpIHtcbiAgICAgICAgICAgIGlmICghYikge1xuICAgICAgICAgICAgICBwcm9ncmVzcyArPSBuJDEgKyAnICc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcm9ncmVzcyArPSBuJDEgKyBiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0UHJvZ3Jlc3NWYWx1ZVthbmltLnR5cGVdKGFuaW1hdGFibGUudGFyZ2V0LCBhbmltLnByb3BlcnR5LCBwcm9ncmVzcywgYW5pbWF0YWJsZS50cmFuc2Zvcm1zKTtcbiAgICAgIGFuaW0uY3VycmVudFZhbHVlID0gcHJvZ3Jlc3M7XG4gICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q2FsbGJhY2soY2IpIHtcbiAgICBpZiAoaW5zdGFuY2VbY2JdICYmICFpbnN0YW5jZS5wYXNzVGhyb3VnaCkgeyBpbnN0YW5jZVtjYl0oaW5zdGFuY2UpOyB9XG4gIH1cblxuICBmdW5jdGlvbiBjb3VudEl0ZXJhdGlvbigpIHtcbiAgICBpZiAoaW5zdGFuY2UucmVtYWluaW5nICYmIGluc3RhbmNlLnJlbWFpbmluZyAhPT0gdHJ1ZSkge1xuICAgICAgaW5zdGFuY2UucmVtYWluaW5nLS07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0SW5zdGFuY2VQcm9ncmVzcyhlbmdpbmVUaW1lKSB7XG4gICAgdmFyIGluc0R1cmF0aW9uID0gaW5zdGFuY2UuZHVyYXRpb247XG4gICAgdmFyIGluc0RlbGF5ID0gaW5zdGFuY2UuZGVsYXk7XG4gICAgdmFyIGluc0VuZERlbGF5ID0gaW5zRHVyYXRpb24gLSBpbnN0YW5jZS5lbmREZWxheTtcbiAgICB2YXIgaW5zVGltZSA9IGFkanVzdFRpbWUoZW5naW5lVGltZSk7XG4gICAgaW5zdGFuY2UucHJvZ3Jlc3MgPSBtaW5NYXgoKGluc1RpbWUgLyBpbnNEdXJhdGlvbikgKiAxMDAsIDAsIDEwMCk7XG4gICAgaW5zdGFuY2UucmV2ZXJzZVBsYXliYWNrID0gaW5zVGltZSA8IGluc3RhbmNlLmN1cnJlbnRUaW1lO1xuICAgIGlmIChjaGlsZHJlbikgeyBzeW5jSW5zdGFuY2VDaGlsZHJlbihpbnNUaW1lKTsgfVxuICAgIGlmICghaW5zdGFuY2UuYmVnYW4gJiYgaW5zdGFuY2UuY3VycmVudFRpbWUgPiAwKSB7XG4gICAgICBpbnN0YW5jZS5iZWdhbiA9IHRydWU7XG4gICAgICBzZXRDYWxsYmFjaygnYmVnaW4nKTtcbiAgICB9XG4gICAgaWYgKCFpbnN0YW5jZS5sb29wQmVnYW4gJiYgaW5zdGFuY2UuY3VycmVudFRpbWUgPiAwKSB7XG4gICAgICBpbnN0YW5jZS5sb29wQmVnYW4gPSB0cnVlO1xuICAgICAgc2V0Q2FsbGJhY2soJ2xvb3BCZWdpbicpO1xuICAgIH1cbiAgICBpZiAoaW5zVGltZSA8PSBpbnNEZWxheSAmJiBpbnN0YW5jZS5jdXJyZW50VGltZSAhPT0gMCkge1xuICAgICAgc2V0QW5pbWF0aW9uc1Byb2dyZXNzKDApO1xuICAgIH1cbiAgICBpZiAoKGluc1RpbWUgPj0gaW5zRW5kRGVsYXkgJiYgaW5zdGFuY2UuY3VycmVudFRpbWUgIT09IGluc0R1cmF0aW9uKSB8fCAhaW5zRHVyYXRpb24pIHtcbiAgICAgIHNldEFuaW1hdGlvbnNQcm9ncmVzcyhpbnNEdXJhdGlvbik7XG4gICAgfVxuICAgIGlmIChpbnNUaW1lID4gaW5zRGVsYXkgJiYgaW5zVGltZSA8IGluc0VuZERlbGF5KSB7XG4gICAgICBpZiAoIWluc3RhbmNlLmNoYW5nZUJlZ2FuKSB7XG4gICAgICAgIGluc3RhbmNlLmNoYW5nZUJlZ2FuID0gdHJ1ZTtcbiAgICAgICAgaW5zdGFuY2UuY2hhbmdlQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIHNldENhbGxiYWNrKCdjaGFuZ2VCZWdpbicpO1xuICAgICAgfVxuICAgICAgc2V0Q2FsbGJhY2soJ2NoYW5nZScpO1xuICAgICAgc2V0QW5pbWF0aW9uc1Byb2dyZXNzKGluc1RpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW5zdGFuY2UuY2hhbmdlQmVnYW4pIHtcbiAgICAgICAgaW5zdGFuY2UuY2hhbmdlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgaW5zdGFuY2UuY2hhbmdlQmVnYW4gPSBmYWxzZTtcbiAgICAgICAgc2V0Q2FsbGJhY2soJ2NoYW5nZUNvbXBsZXRlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGluc3RhbmNlLmN1cnJlbnRUaW1lID0gbWluTWF4KGluc1RpbWUsIDAsIGluc0R1cmF0aW9uKTtcbiAgICBpZiAoaW5zdGFuY2UuYmVnYW4pIHsgc2V0Q2FsbGJhY2soJ3VwZGF0ZScpOyB9XG4gICAgaWYgKGVuZ2luZVRpbWUgPj0gaW5zRHVyYXRpb24pIHtcbiAgICAgIGxhc3RUaW1lID0gMDtcbiAgICAgIGNvdW50SXRlcmF0aW9uKCk7XG4gICAgICBpZiAoIWluc3RhbmNlLnJlbWFpbmluZykge1xuICAgICAgICBpbnN0YW5jZS5wYXVzZWQgPSB0cnVlO1xuICAgICAgICBpZiAoIWluc3RhbmNlLmNvbXBsZXRlZCkge1xuICAgICAgICAgIGluc3RhbmNlLmNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgc2V0Q2FsbGJhY2soJ2xvb3BDb21wbGV0ZScpO1xuICAgICAgICAgIHNldENhbGxiYWNrKCdjb21wbGV0ZScpO1xuICAgICAgICAgIGlmICghaW5zdGFuY2UucGFzc1Rocm91Z2ggJiYgJ1Byb21pc2UnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IG1ha2VQcm9taXNlKGluc3RhbmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0VGltZSA9IG5vdztcbiAgICAgICAgc2V0Q2FsbGJhY2soJ2xvb3BDb21wbGV0ZScpO1xuICAgICAgICBpbnN0YW5jZS5sb29wQmVnYW4gPSBmYWxzZTtcbiAgICAgICAgaWYgKGluc3RhbmNlLmRpcmVjdGlvbiA9PT0gJ2FsdGVybmF0ZScpIHtcbiAgICAgICAgICB0b2dnbGVJbnN0YW5jZURpcmVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5zdGFuY2UucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGlyZWN0aW9uID0gaW5zdGFuY2UuZGlyZWN0aW9uO1xuICAgIGluc3RhbmNlLnBhc3NUaHJvdWdoID0gZmFsc2U7XG4gICAgaW5zdGFuY2UuY3VycmVudFRpbWUgPSAwO1xuICAgIGluc3RhbmNlLnByb2dyZXNzID0gMDtcbiAgICBpbnN0YW5jZS5wYXVzZWQgPSB0cnVlO1xuICAgIGluc3RhbmNlLmJlZ2FuID0gZmFsc2U7XG4gICAgaW5zdGFuY2UubG9vcEJlZ2FuID0gZmFsc2U7XG4gICAgaW5zdGFuY2UuY2hhbmdlQmVnYW4gPSBmYWxzZTtcbiAgICBpbnN0YW5jZS5jb21wbGV0ZWQgPSBmYWxzZTtcbiAgICBpbnN0YW5jZS5jaGFuZ2VDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICBpbnN0YW5jZS5yZXZlcnNlUGxheWJhY2sgPSBmYWxzZTtcbiAgICBpbnN0YW5jZS5yZXZlcnNlZCA9IGRpcmVjdGlvbiA9PT0gJ3JldmVyc2UnO1xuICAgIGluc3RhbmNlLnJlbWFpbmluZyA9IGluc3RhbmNlLmxvb3A7XG4gICAgY2hpbGRyZW4gPSBpbnN0YW5jZS5jaGlsZHJlbjtcbiAgICBjaGlsZHJlbkxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gY2hpbGRyZW5MZW5ndGg7IGktLTspIHsgaW5zdGFuY2UuY2hpbGRyZW5baV0ucmVzZXQoKTsgfVxuICAgIGlmIChpbnN0YW5jZS5yZXZlcnNlZCAmJiBpbnN0YW5jZS5sb29wICE9PSB0cnVlIHx8IChkaXJlY3Rpb24gPT09ICdhbHRlcm5hdGUnICYmIGluc3RhbmNlLmxvb3AgPT09IDEpKSB7IGluc3RhbmNlLnJlbWFpbmluZysrOyB9XG4gICAgc2V0QW5pbWF0aW9uc1Byb2dyZXNzKGluc3RhbmNlLnJldmVyc2VkID8gaW5zdGFuY2UuZHVyYXRpb24gOiAwKTtcbiAgfTtcblxuICAvLyBpbnRlcm5hbCBtZXRob2QgKGZvciBlbmdpbmUpIHRvIGFkanVzdCBhbmltYXRpb24gdGltaW5ncyBiZWZvcmUgcmVzdG9yaW5nIGVuZ2luZSB0aWNrcyAockFGKVxuICBpbnN0YW5jZS5fb25Eb2N1bWVudFZpc2liaWxpdHkgPSByZXNldFRpbWU7XG5cbiAgLy8gU2V0IFZhbHVlIGhlbHBlclxuXG4gIGluc3RhbmNlLnNldCA9IGZ1bmN0aW9uKHRhcmdldHMsIHByb3BlcnRpZXMpIHtcbiAgICBzZXRUYXJnZXRzVmFsdWUodGFyZ2V0cywgcHJvcGVydGllcyk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIGluc3RhbmNlLnRpY2sgPSBmdW5jdGlvbih0KSB7XG4gICAgbm93ID0gdDtcbiAgICBpZiAoIXN0YXJ0VGltZSkgeyBzdGFydFRpbWUgPSBub3c7IH1cbiAgICBzZXRJbnN0YW5jZVByb2dyZXNzKChub3cgKyAobGFzdFRpbWUgLSBzdGFydFRpbWUpKSAqIGFuaW1lLnNwZWVkKTtcbiAgfTtcblxuICBpbnN0YW5jZS5zZWVrID0gZnVuY3Rpb24odGltZSkge1xuICAgIHNldEluc3RhbmNlUHJvZ3Jlc3MoYWRqdXN0VGltZSh0aW1lKSk7XG4gIH07XG5cbiAgaW5zdGFuY2UucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICBpbnN0YW5jZS5wYXVzZWQgPSB0cnVlO1xuICAgIHJlc2V0VGltZSgpO1xuICB9O1xuXG4gIGluc3RhbmNlLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWluc3RhbmNlLnBhdXNlZCkgeyByZXR1cm47IH1cbiAgICBpZiAoaW5zdGFuY2UuY29tcGxldGVkKSB7IGluc3RhbmNlLnJlc2V0KCk7IH1cbiAgICBpbnN0YW5jZS5wYXVzZWQgPSBmYWxzZTtcbiAgICBhY3RpdmVJbnN0YW5jZXMucHVzaChpbnN0YW5jZSk7XG4gICAgcmVzZXRUaW1lKCk7XG4gICAgZW5naW5lKCk7XG4gIH07XG5cbiAgaW5zdGFuY2UucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRvZ2dsZUluc3RhbmNlRGlyZWN0aW9uKCk7XG4gICAgaW5zdGFuY2UuY29tcGxldGVkID0gaW5zdGFuY2UucmV2ZXJzZWQgPyBmYWxzZSA6IHRydWU7XG4gICAgcmVzZXRUaW1lKCk7XG4gIH07XG5cbiAgaW5zdGFuY2UucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIGluc3RhbmNlLnJlc2V0KCk7XG4gICAgaW5zdGFuY2UucGxheSgpO1xuICB9O1xuXG4gIGluc3RhbmNlLnJlbW92ZSA9IGZ1bmN0aW9uKHRhcmdldHMpIHtcbiAgICB2YXIgdGFyZ2V0c0FycmF5ID0gcGFyc2VUYXJnZXRzKHRhcmdldHMpO1xuICAgIHJlbW92ZVRhcmdldHNGcm9tSW5zdGFuY2UodGFyZ2V0c0FycmF5LCBpbnN0YW5jZSk7XG4gIH07XG5cbiAgaW5zdGFuY2UucmVzZXQoKTtcblxuICBpZiAoaW5zdGFuY2UuYXV0b3BsYXkpIHsgaW5zdGFuY2UucGxheSgpOyB9XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xuXG59XG5cbi8vIFJlbW92ZSB0YXJnZXRzIGZyb20gYW5pbWF0aW9uXG5cbmZ1bmN0aW9uIHJlbW92ZVRhcmdldHNGcm9tQW5pbWF0aW9ucyh0YXJnZXRzQXJyYXksIGFuaW1hdGlvbnMpIHtcbiAgZm9yICh2YXIgYSA9IGFuaW1hdGlvbnMubGVuZ3RoOyBhLS07KSB7XG4gICAgaWYgKGFycmF5Q29udGFpbnModGFyZ2V0c0FycmF5LCBhbmltYXRpb25zW2FdLmFuaW1hdGFibGUudGFyZ2V0KSkge1xuICAgICAgYW5pbWF0aW9ucy5zcGxpY2UoYSwgMSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVRhcmdldHNGcm9tSW5zdGFuY2UodGFyZ2V0c0FycmF5LCBpbnN0YW5jZSkge1xuICB2YXIgYW5pbWF0aW9ucyA9IGluc3RhbmNlLmFuaW1hdGlvbnM7XG4gIHZhciBjaGlsZHJlbiA9IGluc3RhbmNlLmNoaWxkcmVuO1xuICByZW1vdmVUYXJnZXRzRnJvbUFuaW1hdGlvbnModGFyZ2V0c0FycmF5LCBhbmltYXRpb25zKTtcbiAgZm9yICh2YXIgYyA9IGNoaWxkcmVuLmxlbmd0aDsgYy0tOykge1xuICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2NdO1xuICAgIHZhciBjaGlsZEFuaW1hdGlvbnMgPSBjaGlsZC5hbmltYXRpb25zO1xuICAgIHJlbW92ZVRhcmdldHNGcm9tQW5pbWF0aW9ucyh0YXJnZXRzQXJyYXksIGNoaWxkQW5pbWF0aW9ucyk7XG4gICAgaWYgKCFjaGlsZEFuaW1hdGlvbnMubGVuZ3RoICYmICFjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHsgY2hpbGRyZW4uc3BsaWNlKGMsIDEpOyB9XG4gIH1cbiAgaWYgKCFhbmltYXRpb25zLmxlbmd0aCAmJiAhY2hpbGRyZW4ubGVuZ3RoKSB7IGluc3RhbmNlLnBhdXNlKCk7IH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlVGFyZ2V0c0Zyb21BY3RpdmVJbnN0YW5jZXModGFyZ2V0cykge1xuICB2YXIgdGFyZ2V0c0FycmF5ID0gcGFyc2VUYXJnZXRzKHRhcmdldHMpO1xuICBmb3IgKHZhciBpID0gYWN0aXZlSW5zdGFuY2VzLmxlbmd0aDsgaS0tOykge1xuICAgIHZhciBpbnN0YW5jZSA9IGFjdGl2ZUluc3RhbmNlc1tpXTtcbiAgICByZW1vdmVUYXJnZXRzRnJvbUluc3RhbmNlKHRhcmdldHNBcnJheSwgaW5zdGFuY2UpO1xuICB9XG59XG5cbi8vIFN0YWdnZXIgaGVscGVyc1xuXG5mdW5jdGlvbiBzdGFnZ2VyKHZhbCwgcGFyYW1zKSB7XG4gIGlmICggcGFyYW1zID09PSB2b2lkIDAgKSBwYXJhbXMgPSB7fTtcblxuICB2YXIgZGlyZWN0aW9uID0gcGFyYW1zLmRpcmVjdGlvbiB8fCAnbm9ybWFsJztcbiAgdmFyIGVhc2luZyA9IHBhcmFtcy5lYXNpbmcgPyBwYXJzZUVhc2luZ3MocGFyYW1zLmVhc2luZykgOiBudWxsO1xuICB2YXIgZ3JpZCA9IHBhcmFtcy5ncmlkO1xuICB2YXIgYXhpcyA9IHBhcmFtcy5heGlzO1xuICB2YXIgZnJvbUluZGV4ID0gcGFyYW1zLmZyb20gfHwgMDtcbiAgdmFyIGZyb21GaXJzdCA9IGZyb21JbmRleCA9PT0gJ2ZpcnN0JztcbiAgdmFyIGZyb21DZW50ZXIgPSBmcm9tSW5kZXggPT09ICdjZW50ZXInO1xuICB2YXIgZnJvbUxhc3QgPSBmcm9tSW5kZXggPT09ICdsYXN0JztcbiAgdmFyIGlzUmFuZ2UgPSBpcy5hcnIodmFsKTtcbiAgdmFyIHZhbDEgPSBpc1JhbmdlID8gcGFyc2VGbG9hdCh2YWxbMF0pIDogcGFyc2VGbG9hdCh2YWwpO1xuICB2YXIgdmFsMiA9IGlzUmFuZ2UgPyBwYXJzZUZsb2F0KHZhbFsxXSkgOiAwO1xuICB2YXIgdW5pdCA9IGdldFVuaXQoaXNSYW5nZSA/IHZhbFsxXSA6IHZhbCkgfHwgMDtcbiAgdmFyIHN0YXJ0ID0gcGFyYW1zLnN0YXJ0IHx8IDAgKyAoaXNSYW5nZSA/IHZhbDEgOiAwKTtcbiAgdmFyIHZhbHVlcyA9IFtdO1xuICB2YXIgbWF4VmFsdWUgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24gKGVsLCBpLCB0KSB7XG4gICAgaWYgKGZyb21GaXJzdCkgeyBmcm9tSW5kZXggPSAwOyB9XG4gICAgaWYgKGZyb21DZW50ZXIpIHsgZnJvbUluZGV4ID0gKHQgLSAxKSAvIDI7IH1cbiAgICBpZiAoZnJvbUxhc3QpIHsgZnJvbUluZGV4ID0gdCAtIDE7IH1cbiAgICBpZiAoIXZhbHVlcy5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0OyBpbmRleCsrKSB7XG4gICAgICAgIGlmICghZ3JpZCkge1xuICAgICAgICAgIHZhbHVlcy5wdXNoKE1hdGguYWJzKGZyb21JbmRleCAtIGluZGV4KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZyb21YID0gIWZyb21DZW50ZXIgPyBmcm9tSW5kZXglZ3JpZFswXSA6IChncmlkWzBdLTEpLzI7XG4gICAgICAgICAgdmFyIGZyb21ZID0gIWZyb21DZW50ZXIgPyBNYXRoLmZsb29yKGZyb21JbmRleC9ncmlkWzBdKSA6IChncmlkWzFdLTEpLzI7XG4gICAgICAgICAgdmFyIHRvWCA9IGluZGV4JWdyaWRbMF07XG4gICAgICAgICAgdmFyIHRvWSA9IE1hdGguZmxvb3IoaW5kZXgvZ3JpZFswXSk7XG4gICAgICAgICAgdmFyIGRpc3RhbmNlWCA9IGZyb21YIC0gdG9YO1xuICAgICAgICAgIHZhciBkaXN0YW5jZVkgPSBmcm9tWSAtIHRvWTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBNYXRoLnNxcnQoZGlzdGFuY2VYICogZGlzdGFuY2VYICsgZGlzdGFuY2VZICogZGlzdGFuY2VZKTtcbiAgICAgICAgICBpZiAoYXhpcyA9PT0gJ3gnKSB7IHZhbHVlID0gLWRpc3RhbmNlWDsgfVxuICAgICAgICAgIGlmIChheGlzID09PSAneScpIHsgdmFsdWUgPSAtZGlzdGFuY2VZOyB9XG4gICAgICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIG1heFZhbHVlID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgdmFsdWVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChlYXNpbmcpIHsgdmFsdWVzID0gdmFsdWVzLm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiBlYXNpbmcodmFsIC8gbWF4VmFsdWUpICogbWF4VmFsdWU7IH0pOyB9XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAncmV2ZXJzZScpIHsgdmFsdWVzID0gdmFsdWVzLm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiBheGlzID8gKHZhbCA8IDApID8gdmFsICogLTEgOiAtdmFsIDogTWF0aC5hYnMobWF4VmFsdWUgLSB2YWwpOyB9KTsgfVxuICAgIH1cbiAgICB2YXIgc3BhY2luZyA9IGlzUmFuZ2UgPyAodmFsMiAtIHZhbDEpIC8gbWF4VmFsdWUgOiB2YWwxO1xuICAgIHJldHVybiBzdGFydCArIChzcGFjaW5nICogKE1hdGgucm91bmQodmFsdWVzW2ldICogMTAwKSAvIDEwMCkpICsgdW5pdDtcbiAgfVxufVxuXG4vLyBUaW1lbGluZVxuXG5mdW5jdGlvbiB0aW1lbGluZShwYXJhbXMpIHtcbiAgaWYgKCBwYXJhbXMgPT09IHZvaWQgMCApIHBhcmFtcyA9IHt9O1xuXG4gIHZhciB0bCA9IGFuaW1lKHBhcmFtcyk7XG4gIHRsLmR1cmF0aW9uID0gMDtcbiAgdGwuYWRkID0gZnVuY3Rpb24oaW5zdGFuY2VQYXJhbXMsIHRpbWVsaW5lT2Zmc2V0KSB7XG4gICAgdmFyIHRsSW5kZXggPSBhY3RpdmVJbnN0YW5jZXMuaW5kZXhPZih0bCk7XG4gICAgdmFyIGNoaWxkcmVuID0gdGwuY2hpbGRyZW47XG4gICAgaWYgKHRsSW5kZXggPiAtMSkgeyBhY3RpdmVJbnN0YW5jZXMuc3BsaWNlKHRsSW5kZXgsIDEpOyB9XG4gICAgZnVuY3Rpb24gcGFzc1Rocm91Z2goaW5zKSB7IGlucy5wYXNzVGhyb3VnaCA9IHRydWU7IH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7IHBhc3NUaHJvdWdoKGNoaWxkcmVuW2ldKTsgfVxuICAgIHZhciBpbnNQYXJhbXMgPSBtZXJnZU9iamVjdHMoaW5zdGFuY2VQYXJhbXMsIHJlcGxhY2VPYmplY3RQcm9wcyhkZWZhdWx0VHdlZW5TZXR0aW5ncywgcGFyYW1zKSk7XG4gICAgaW5zUGFyYW1zLnRhcmdldHMgPSBpbnNQYXJhbXMudGFyZ2V0cyB8fCBwYXJhbXMudGFyZ2V0cztcbiAgICB2YXIgdGxEdXJhdGlvbiA9IHRsLmR1cmF0aW9uO1xuICAgIGluc1BhcmFtcy5hdXRvcGxheSA9IGZhbHNlO1xuICAgIGluc1BhcmFtcy5kaXJlY3Rpb24gPSB0bC5kaXJlY3Rpb247XG4gICAgaW5zUGFyYW1zLnRpbWVsaW5lT2Zmc2V0ID0gaXMudW5kKHRpbWVsaW5lT2Zmc2V0KSA/IHRsRHVyYXRpb24gOiBnZXRSZWxhdGl2ZVZhbHVlKHRpbWVsaW5lT2Zmc2V0LCB0bER1cmF0aW9uKTtcbiAgICBwYXNzVGhyb3VnaCh0bCk7XG4gICAgdGwuc2VlayhpbnNQYXJhbXMudGltZWxpbmVPZmZzZXQpO1xuICAgIHZhciBpbnMgPSBhbmltZShpbnNQYXJhbXMpO1xuICAgIHBhc3NUaHJvdWdoKGlucyk7XG4gICAgY2hpbGRyZW4ucHVzaChpbnMpO1xuICAgIHZhciB0aW1pbmdzID0gZ2V0SW5zdGFuY2VUaW1pbmdzKGNoaWxkcmVuLCBwYXJhbXMpO1xuICAgIHRsLmRlbGF5ID0gdGltaW5ncy5kZWxheTtcbiAgICB0bC5lbmREZWxheSA9IHRpbWluZ3MuZW5kRGVsYXk7XG4gICAgdGwuZHVyYXRpb24gPSB0aW1pbmdzLmR1cmF0aW9uO1xuICAgIHRsLnNlZWsoMCk7XG4gICAgdGwucmVzZXQoKTtcbiAgICBpZiAodGwuYXV0b3BsYXkpIHsgdGwucGxheSgpOyB9XG4gICAgcmV0dXJuIHRsO1xuICB9O1xuICByZXR1cm4gdGw7XG59XG5cbmFuaW1lLnZlcnNpb24gPSAnMy4yLjEnO1xuYW5pbWUuc3BlZWQgPSAxO1xuLy8gVE9ETzojcmV2aWV3OiBuYW1pbmcsIGRvY3VtZW50YXRpb25cbmFuaW1lLnN1c3BlbmRXaGVuRG9jdW1lbnRIaWRkZW4gPSB0cnVlO1xuYW5pbWUucnVubmluZyA9IGFjdGl2ZUluc3RhbmNlcztcbmFuaW1lLnJlbW92ZSA9IHJlbW92ZVRhcmdldHNGcm9tQWN0aXZlSW5zdGFuY2VzO1xuYW5pbWUuZ2V0ID0gZ2V0T3JpZ2luYWxUYXJnZXRWYWx1ZTtcbmFuaW1lLnNldCA9IHNldFRhcmdldHNWYWx1ZTtcbmFuaW1lLmNvbnZlcnRQeCA9IGNvbnZlcnRQeFRvVW5pdDtcbmFuaW1lLnBhdGggPSBnZXRQYXRoO1xuYW5pbWUuc2V0RGFzaG9mZnNldCA9IHNldERhc2hvZmZzZXQ7XG5hbmltZS5zdGFnZ2VyID0gc3RhZ2dlcjtcbmFuaW1lLnRpbWVsaW5lID0gdGltZWxpbmU7XG5hbmltZS5lYXNpbmcgPSBwYXJzZUVhc2luZ3M7XG5hbmltZS5wZW5uZXIgPSBwZW5uZXI7XG5hbmltZS5yYW5kb20gPSBmdW5jdGlvbiAobWluLCBtYXgpIHsgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47IH07XG5cbmV4cG9ydCBkZWZhdWx0IGFuaW1lO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4vS29zdWdpTWFydS1SZWd1bGFyLnR0ZlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fID0gbmV3IFVSTChcIi4vamFwRm9vZDEucG5nXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzJfX18gPSBuZXcgVVJMKFwiLi9zdXNoaU5ldy5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfM19fXyA9IG5ldyBVUkwoXCIuL3JhbWVuLnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF80X19fID0gbmV3IFVSTChcIi4vdWRvbi5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfNV9fXyA9IG5ldyBVUkwoXCIuL3lha2l0b3JpLnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF82X19fID0gbmV3IFVSTChcIi4vdGVtcHVyYU5ldy5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfN19fXyA9IG5ldyBVUkwoXCIuL29rb25vbWl5YS5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfOF9fXyA9IG5ldyBVUkwoXCIuL3RyZWUucG5nXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMl9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfM19fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzNfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzRfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF80X19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF81X19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfNV9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfNl9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzZfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzdfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF83X19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF84X19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfOF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJcXG4qe1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBtYXJnaW46IDA7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgIGZvbnQtZmFtaWx5OiAnS29zdWdpTWFydS1SZWd1bGFyJywgc2Fucy1zZXJpZjtcXG59XFxuXFxuLyogQGZvbnQtZmFjZSB7XFxuICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvLVJlZ3VsYXInO1xcbiAgICBzcmM6IHVybCgnLi9Sb2JvdG8tUmVndWxhci50dGYnKSBmb3JtYXQoJ3R0ZicpO1xcbiAgICBmb250LXdlaWdodDogNjAwO1xcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XFxufSAqL1xcbkBmb250LWZhY2Uge1xcbiAgICBmb250LWZhbWlseTogJ0tvc3VnaU1hcnUtUmVndWxhcic7XFxuICAgIHNyYzogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKSBmb3JtYXQoJ3R0ZicpO1xcbiAgICBmb250LXdlaWdodDogNjAwO1xcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XFxufVxcbiAgXFxuXFxuYm9keXtcXG5cXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzBFMDYwNTtcXG59XFxuXFxuLmNvbnRlbnR7XFxuXFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG5cXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAzMCUgNzAlO1xcblxcbn1cXG5cXG4uY29udGFpbmVySW1ne1xcbiAgICBoZWlnaHQ6IDEwMHZoO1xcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fICsgXCIpO1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcblxcbn1cXG5cXG4uY29udGFpbmVyUHJlc2VudGF0aW9ue1xcbiAgICBcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGdhcDogNzBweDtcXG5cXG4gICAgcGFkZGluZzogMCAwIDAgMzBweDtcXG5cXG4gICAgb3BhY2l0eTogMDtcXG59XFxuXFxuLmNvbnRhaW5lclRpdGxlUHJlc2VudGF0aW9uID4gcDpudGgtY2hpbGQoMil7XFxuXFxuICAgIGZvbnQtc2l6ZTo1cmVtO1xcbn1cXG5cXG5cXG4udGV4dFByZXNlbnRhdGlvbntcXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAgIGNvbG9yOiAjNUY0QTMwO1xcblxcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjJzIGVhc2UtaW4tb3V0O1xcblxcbn1cXG5cXG4udGV4dFByZXNlbnRhdGlvbjpob3ZlcntcXG5cXG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDIpO1xcbn1cXG5cXG4uY29udGFpbmVyRmxvYXRNZW51e1xcblxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHdpZHRoOiA0NDBweDtcXG4gICAgdG9wOiAzMHB4O1xcbiAgICByaWdodDogMDtcXG4gICAgbGVmdDogMDtcXG4gICAgbWFyZ2luOiBhdXRvO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcblxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXG4gICAgZ2FwOiAzMHB4O1xcblxcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTBweCk7XFxuXFxuICAgIC8qIGJveC1zaGFkb3c6ICAwIDAgMTVweCAjREJBRjU3OyAqL1xcblxcbiAgICBvdXRsaW5lOiAycHggc29saWQgI2RiYWY1NztcXG5cXG4gICAgcGFkZGluZzogMTBweDtcXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuXFxufVxcblxcbi5jb250YWluZXJGbG9hdE1lbnUgPiBwOm50aC1jaGlsZCgxKXtcXG5cXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcblxcbiAgICBwYWRkaW5nOiAxMHB4IDE2cHg7XFxuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XFxuICAgIHRyYW5zaXRpb246IGFsbCAuMTJzIGVhc2UtaW4tb3V0O1xcblxcbiAgICBvdXRsaW5lLXdpZHRoOiAwcHg7XFxuXFxuICAgIFxcbn1cXG4uY29udGFpbmVyRmxvYXRNZW51Om50aC1jaGlsZCgyKXtcXG5cXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBcXG59XFxuXFxuLmNvbnRhaW5lck5hbWVSZXN0YXVyYW50ID4gcDpudGgtY2hpbGQoMil7XFxuXFxuICAgIHRyYW5zaXRpb246IGFsbCAuMTJzIGVhc2UtaW4tb3V0O1xcblxcbn1cXG5cXG4uY29udGFpbmVyTmFtZVJlc3RhdXJhbnQ6aG92ZXIgPiBwOm50aC1jaGlsZCgyKXtcXG5cXG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuNSk7XFxufVxcbi5jb250YWluZXJGbG9hdE1lbnUgPiBwOm50aC1jaGlsZCgzKXtcXG5cXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcblxcbiAgICBwYWRkaW5nOiAxMHB4IDE2cHggO1xcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjEzcyBlYXNlLWluLW91dDtcXG5cXG4gICAgLyogb3V0bGluZTogMnB4IHRyYW5zcGFyZW50ICNEQkFGNTc7ICovXFxuICAgIFxcbn1cXG5cXG4uY29udGFpbmVyRmxvYXRNZW51ID4gcDpudGgtY2hpbGQoMSk6aG92ZXJ7XFxuXFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkYmFmNTc7XFxuICAgIGNvbG9yOiAjMEUwNjA1O1xcblxcbn1cXG5cXG4uY29udGFpbmVyRmxvYXRNZW51ID4gcDpudGgtY2hpbGQoMyk6aG92ZXJ7XFxuXFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkYmFmNTc7XFxuICAgIGNvbG9yOiAjMEUwNjA1O1xcbiBcXG59XFxuXFxuLmNvbnRhaW5lck5hbWVSZXN0YXVyYW50e1xcblxcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4udGV4dEZsb2F0TWVudXtcXG4gICAgY29sb3I6ICNmZmY7XFxufVxcblxcbnB7XFxuICAgIGNvbG9yOiAjZmZmO1xcbn1cXG5cXG4uamFwTGV0dGVyc3tcXG5cXG4gICAgY29sb3I6ICNEQkFGNTc7XFxuICAgIGxldHRlci1zcGFjaW5nOiA0cHg7XFxufVxcblxcbi50aXRsZVByZXNlbnRhdGlvbntcXG5cXG4gICAgZm9udC1zaXplOiAzLjVyZW07XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG5cXG4gICAgdHJhbnNpdGlvbjogYWxsIC4xM3MgZWFzZS1pbi1vdXQ7XFxuXFxufVxcblxcbi50aXRsZVByZXNlbnRhdGlvbjpob3ZlcntcXG5cXG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMyk7XFxufVxcblxcbi5idG5NZW51e1xcblxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjQkE4RjQ3O1xcblxcbiAgICBwYWRkaW5nOiAxNnB4O1xcblxcbiAgICB3aWR0aDogMjAwcHg7XFxuXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXG4gICAgYm9yZGVyLXJhZGl1czogMTAwcHg7XFxuXFxuICAgIHRyYW5zaXRpb246IGFsbCAuMTNzIGVhc2UtaW4tb3V0O1xcblxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuXFxuICAgIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cXG5cXG4uYnRuTWVudTpob3ZlcntcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcXG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuNSk7XFxuXFxufVxcblxcbi5ob3ZlckJ0bkJyaWdodG5lc3N7IGFuaW1hdGlvbjogaG92ZXJCdG5CcmlnaHRuZXNzIC4xMnMgbGluZWFyIGJvdGg7fVxcblxcbkBrZXlmcmFtZXMgaG92ZXJCdG5CcmlnaHRuZXNze1xcbiAgICAwJXtcXG4gICAgICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxKTtcXG4gICAgfVxcblxcbiAgICAyNSV7XFxuICAgICAgICBmaWx0ZXI6IGJyaWdodG5lc3MoMS4xKTtcXG4gICAgfVxcblxcbiAgICA1MCV7XFxuICAgICAgICBmaWx0ZXI6IGJyaWdodG5lc3MoMS4yKTtcXG4gICAgfVxcblxcbiAgICA3NSV7XFxuICAgICAgICBmaWx0ZXI6IGJyaWdodG5lc3MoMS4zKTtcXG4gICAgfVxcblxcbiAgICAxMDAle1xcbiAgICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuNCk7ICAgIFxcbiAgICB9XFxufVxcblxcbi5ibHVyLW91dC1jb250cmFjdHthbmltYXRpb246Ymx1ci1vdXQtY29udHJhY3QgLjNzIGxpbmVhciBib3RofSBcXG5cXG5Aa2V5ZnJhbWVzIGJsdXItb3V0LWNvbnRyYWN0e1xcbiAgICAwJXtcXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICAgIHRyYW5zZm9ybTpzY2FsZSgxKTtcXG4gICAgICAgIGZpbHRlcjpibHVyKC4wMXB4KTtcXG4gICAgICAgIFxcbiAgICB9XFxuICAgIDEwMCV7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0cmFuc2Zvcm06c2NhbGUoMCk7XFxuICAgICAgICBmaWx0ZXI6Ymx1cigxMnB4KTtcXG4gICAgICAgIG9wYWNpdHk6MFxcbiAgICB9XFxufVxcblxcbi8qIE1FTlUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXFxuXFxuLmNvbnRhaW5lckl0ZW1zTWVudXtcXG4gICAgXFxuICAgIHdpZHRoOiAxMDB2dztcXG5cXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgXFxuICAgIC8qIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoNDAwcHgsbWF4LWNvbnRlbnQpKTsgKi9cXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMyw0MDBweCk7XFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDIsIDMwMHB4KTtcXG5cXG4gICAgLyoganVzdGlmeS1jb250ZW50OiBjZW50ZXI7ICovXFxuICAgIHBsYWNlLWNvbnRlbnQ6IGNlbnRlcjtcXG5cXG4gICAgZ2FwOiAzMHB4O1xcbn1cXG5cXG4uaXRlbU1lbnV7XFxuXFxuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XFxuXFxuICAgIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICAgIGJvcmRlci1jb2xvcjogI0VGQzI3OTtcXG4gICAgYm9yZGVyLXdpZHRoOiA0cHg7XFxuXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogZW5kO1xcblxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5jb250YWluZXJOYW1lSXRlbXtcXG5cXG4gICAgZGlzcGxheTogZmxleDtcXG5cXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIHBhZGRpbmc6IDE2cHg7XFxuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcXG5cXG4gICAgY29sb3I6ICNmZmY7XFxuXFxuICAgIC8qIGJvcmRlci1yYWRpdXM6IDAgMCAxNnB4IDE2cHg7ICovXFxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICAgIHVzZXItc2VsZWN0OiBub25lO1xcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLml0ZW0xe1xcblxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19fICsgXCIpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxufVxcbi5pdGVtMntcXG5cXG4gICAgYmFja2dyb3VuZDogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfM19fXyArIFwiKTtcXG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcbn1cXG4uaXRlbTN7XFxuXFxuICAgIGJhY2tncm91bmQ6IHVybChcIiArIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzRfX18gKyBcIik7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG59XFxuLml0ZW00e1xcblxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF81X19fICsgXCIpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxufVxcbi5pdGVtNXtcXG5cXG4gICAgYmFja2dyb3VuZDogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfNl9fXyArIFwiKTtcXG4gICAgYmFja2dyb3VuZC1zaXplOiBjb250YWluO1xcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxufVxcbi5pdGVtNntcXG5cXG4gICAgYmFja2dyb3VuZDogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfN19fXyArIFwiKTtcXG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcbn1cXG5cXG4uaXRlbU1lbnU6aG92ZXJ7XFxuXFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSk7XFxuXFxufVxcblxcbi5ibHVyLW91dHtcXG4gICAgYW5pbWF0aW9uOmJsdXItb3V0IC4zcyBsaW5lYXIgYm90aDtcXG59IFxcblxcbkBrZXlmcmFtZXMgYmx1ci1vdXR7XFxuICAgIDAle1xcbiAgICAgICAgZmlsdGVyOmJsdXIoMHB4KTtcXG4gICAgICAgIG9wYWNpdHk6MVxcbiAgICB9XFxuICAgIDEwMCV7XFxuICAgICAgICAgICAgZmlsdGVyOmJsdXIoMTJweCk7XFxuICAgICAgICAgICAgb3BhY2l0eTowXFxuICAgIH1cXG59XFxuXFxuXFxuLyogQ09OVEFDVC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG5cXG4uY29udGFpbmVySXRlbXNDb250YWN0e1xcblxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF84X19fICsgXCIpO1xcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBib3R0b207XFxuICAgIHdpZHRoOiAxMDB2dztcXG5cXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG5cXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGdhcDogMzBweDtcXG4gICAgXFxuXFxufVxcblxcbi5pdGVtc0NvbnRhY3R7XFxuXFxuICAgIHdpZHRoOiA1MDBweDtcXG4gICAgaGVpZ2h0OiAzMDBweDtcXG5cXG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcXG5cXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFxuXFxuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcXG5cXG4gICAgYm9yZGVyOiBzb2xpZCA0cHggI0E2NjkxODtcXG59XFxuXFxuLmNvbnRhaW5lckluZm9Db250YWN0e1xcblxcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBnYXA6IDMwcHg7XFxuXFxufVxcblxcbi5jb250YWluZXJJbmZvQWRkcmVzc3tcXG4gICAgZGlzcGxheTogZmxleDtcXG5cXG4gICAgZ2FwOiAzMHB4O1xcbn1cXG5cXG4ucEluZm9BZGRyZXNze1xcbiAgICBtYXJnaW46IGF1dG87XFxuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xcbn1cXG5cXG4ucEluZm9Db250YWN0e1xcbiAgICBtYXJnaW46IGF1dG87XFxuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xcblxcbn1cXG5cXG4udGl0bGVDb250YWN0e1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFxuICAgIHRvcDogMzBweDtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxufVxcblxcbi50aXRsZUFkZHJlc3N7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5cXG4gICAgdG9wOiAzMHB4O1xcbiAgICBmb250LXNpemU6IDEuNXJlbTtcXG59XFxuXFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTYwcHgpe1xcblxcbiAgICAuaXRlbXNDb250YWN0e1xcblxcbiAgICAgICAgd2lkdGg6IDM1MHB4O1xcbiAgICAgICAgaGVpZ2h0OiAyMDBweDtcXG4gICAgfVxcblxcbn1cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0NjBweCl7XFxuICAgIFxcbiAgICAuY29udGFpbmVyTmFtZVJlc3RhdXJhbnR7XFxuXFxuICAgICAgICBmb250LXNpemU6IDFyZW07XFxuICAgIH1cXG4gICAgLmNvbnRhaW5lckZsb2F0TWVudXtcXG5cXG4gICAgICAgIHdpZHRoOiAzNTBweDtcXG5cXG4gICAgICAgIGdhcDogMTBweDtcXG4gICAgfVxcblxcbiAgICAuY29udGFpbmVyUHJlc2VudGF0aW9ue1xcbiAgICAgICAgZ2FwOiAxMHB4O1xcbiAgICB9XFxuXFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEzMjFweCl7XFxuICAgIFxcbiAgICAuY29udGFpbmVySXRlbXNNZW51e1xcblxcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgNDAwcHgpO1xcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMywgMzAwcHgpO1xcblxcbiAgICAgICAgbWFyZ2luOiAxNTBweCAwO1xcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIC4xM3MgZWFzZS1pbi1vdXQ7XFxuICAgICAgICBwYWRkaW5nOiAwIDAgMTAwcHggMDtcXG4gICAgfVxcblxcbiAgICBcXG5cXG4gICAgLmNvbnRhaW5lckltZ3tcXG5cXG4gICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmU7XFxuICAgIH1cXG5cXG4gICAgLmNvbnRhaW5lclByZXNlbnRhdGlvbntcXG4gICAgICAgIHdpZHRoOiAxMDB2dztcXG4gICAgICAgIHBhZGRpbmc6IDA7XFxuICAgIH1cXG4gICAgXFxuICAgIC50ZXh0UHJlc2VudGF0aW9ue1xcbiAgICAgICAgd2lkdGg6IDYwMHB4O1xcbiAgICB9XFxuXFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDg5NnB4KXtcXG4gICAgXFxuICAgIC5jb250YWluZXJJdGVtc01lbnV7XFxuXFxuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCAzMDBweCk7XFxuICAgICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgzLCAyMDBweCk7XFxuXFxuICAgICAgICBtYXJnaW46IDE1MHB4IDA7XFxuICAgIH1cXG5cXG4gICAgXFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDY3OHB4KXtcXG4gICAgXFxuICAgIC5jb250YWluZXJJdGVtc01lbnV7XFxuXFxuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxLCAzMDBweCk7XFxuICAgICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCg2LCAyMDBweCk7XFxuXFxuICAgICAgICBtYXJnaW46IDE1MHB4IDA7XFxuICAgICAgICBwYWRkaW5nOiAwIDAgMTAwcHggMDtcXG4gICAgfVxcblxcbiAgICAudGV4dFByZXNlbnRhdGlvbntcXG4gICAgICAgIHdpZHRoOiAzMDBweDtcXG4gICAgfVxcblxcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCI7QUFDQTtJQUNJLFVBQVU7SUFDVixTQUFTO0lBQ1Qsc0JBQXNCO0lBQ3RCLDZDQUE2QztBQUNqRDs7QUFFQTs7Ozs7R0FLRztBQUNIO0lBQ0ksaUNBQWlDO0lBQ2pDLDBEQUFrRDtJQUNsRCxnQkFBZ0I7SUFDaEIsa0JBQWtCO0FBQ3RCOzs7QUFHQTs7SUFFSSx5QkFBeUI7QUFDN0I7O0FBRUE7O0lBRUksWUFBWTtJQUNaLGFBQWE7SUFDYixhQUFhOztJQUViLDhCQUE4Qjs7QUFFbEM7O0FBRUE7SUFDSSxhQUFhO0lBQ2IseURBQXFDO0lBQ3JDLFVBQVU7SUFDViw0QkFBNEI7O0FBRWhDOztBQUVBOztJQUVJLGFBQWE7SUFDYixzQkFBc0I7O0lBRXRCLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsU0FBUzs7SUFFVCxtQkFBbUI7O0lBRW5CLFVBQVU7QUFDZDs7QUFFQTs7SUFFSSxjQUFjO0FBQ2xCOzs7QUFHQTtJQUNJLGlCQUFpQjtJQUNqQixjQUFjOztJQUVkLCtCQUErQjs7QUFFbkM7O0FBRUE7O0lBRUkscUJBQXFCO0FBQ3pCOztBQUVBOztJQUVJLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osU0FBUztJQUNULFFBQVE7SUFDUixPQUFPO0lBQ1AsWUFBWTtJQUNaLGFBQWE7O0lBRWIsdUJBQXVCO0lBQ3ZCLG1CQUFtQjs7SUFFbkIsU0FBUzs7SUFFVCxtQkFBbUI7SUFDbkIsMkJBQTJCOztJQUUzQixtQ0FBbUM7O0lBRW5DLDBCQUEw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OztBQUdKO0FBQ0E7O0lBRUk7O1FBRUksdUNBQXVDO1FBQ3ZDLG9DQUFvQzs7UUFFcEMsZUFBZTtRQUNmLG9CQUFvQjtJQUN4Qjs7SUFFQTtRQUNJLFlBQVk7SUFDaEI7O0FBRUpcIixcInNvdXJjZXNDb250ZW50XCI6W1wiXFxuKntcXG4gICAgcGFkZGluZzogMDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBmb250LWZhbWlseTogJ0tvc3VnaU1hcnUtUmVndWxhcicsIHNhbnMtc2VyaWY7XFxufVxcblxcbi8qIEBmb250LWZhY2Uge1xcbiAgICBmb250LWZhbWlseTogJ1JvYm90by1SZWd1bGFyJztcXG4gICAgc3JjOiB1cmwoJy4vUm9ib3RvLVJlZ3VsYXIudHRmJykgZm9ybWF0KCd0dGYnKTtcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xcbn0gKi9cXG5AZm9udC1mYWNlIHtcXG4gICAgZm9udC1mYW1pbHk6ICdLb3N1Z2lNYXJ1LVJlZ3VsYXInO1xcbiAgICBzcmM6IHVybCgnLi9Lb3N1Z2lNYXJ1LVJlZ3VsYXIudHRmJykgZm9ybWF0KCd0dGYnKTtcXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xcbn1cXG4gIFxcblxcbmJvZHl7XFxuXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwRTA2MDU7XFxufVxcblxcbi5jb250ZW50e1xcblxcbiAgICB3aWR0aDogMTAwdnc7XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuXFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMzAlIDcwJTtcXG5cXG59XFxuXFxuLmNvbnRhaW5lckltZ3tcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4vamFwRm9vZDEucG5nKTtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG5cXG59XFxuXFxuLmNvbnRhaW5lclByZXNlbnRhdGlvbntcXG4gICAgXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBnYXA6IDcwcHg7XFxuXFxuICAgIHBhZGRpbmc6IDAgMCAwIDMwcHg7XFxuXFxuICAgIG9wYWNpdHk6IDA7XFxufVxcblxcbi5jb250YWluZXJUaXRsZVByZXNlbnRhdGlvbiA+IHA6bnRoLWNoaWxkKDIpe1xcblxcbiAgICBmb250LXNpemU6NXJlbTtcXG59XFxuXFxuXFxuLnRleHRQcmVzZW50YXRpb257XFxuICAgIHVzZXItc2VsZWN0OiBub25lO1xcbiAgICBjb2xvcjogIzVGNEEzMDtcXG5cXG4gICAgdHJhbnNpdGlvbjogYWxsIC4ycyBlYXNlLWluLW91dDtcXG5cXG59XFxuXFxuLnRleHRQcmVzZW50YXRpb246aG92ZXJ7XFxuXFxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygyKTtcXG59XFxuXFxuLmNvbnRhaW5lckZsb2F0TWVudXtcXG5cXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB3aWR0aDogNDQwcHg7XFxuICAgIHRvcDogMzBweDtcXG4gICAgcmlnaHQ6IDA7XFxuICAgIGxlZnQ6IDA7XFxuICAgIG1hcmdpbjogYXV0bztcXG4gICAgZGlzcGxheTogZmxleDtcXG5cXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFxuICAgIGdhcDogMzBweDtcXG5cXG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcXG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDEwcHgpO1xcblxcbiAgICAvKiBib3gtc2hhZG93OiAgMCAwIDE1cHggI0RCQUY1NzsgKi9cXG5cXG4gICAgb3V0bGluZTogMnB4IHNvbGlkICNkYmFmNTc7XFxuXFxuICAgIHBhZGRpbmc6IDEwcHg7XFxuICAgIHVzZXItc2VsZWN0OiBub25lO1xcblxcbn1cXG5cXG4uY29udGFpbmVyRmxvYXRNZW51ID4gcDpudGgtY2hpbGQoMSl7XFxuXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG5cXG4gICAgcGFkZGluZzogMTBweCAxNnB4O1xcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjEycyBlYXNlLWluLW91dDtcXG5cXG4gICAgb3V0bGluZS13aWR0aDogMHB4O1xcblxcbiAgICBcXG59XFxuLmNvbnRhaW5lckZsb2F0TWVudTpudGgtY2hpbGQoMil7XFxuXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgXFxufVxcblxcbi5jb250YWluZXJOYW1lUmVzdGF1cmFudCA+IHA6bnRoLWNoaWxkKDIpe1xcblxcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjEycyBlYXNlLWluLW91dDtcXG5cXG59XFxuXFxuLmNvbnRhaW5lck5hbWVSZXN0YXVyYW50OmhvdmVyID4gcDpudGgtY2hpbGQoMil7XFxuXFxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxLjUpO1xcbn1cXG4uY29udGFpbmVyRmxvYXRNZW51ID4gcDpudGgtY2hpbGQoMyl7XFxuXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG5cXG4gICAgcGFkZGluZzogMTBweCAxNnB4IDtcXG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcXG4gICAgdHJhbnNpdGlvbjogYWxsIC4xM3MgZWFzZS1pbi1vdXQ7XFxuXFxuICAgIC8qIG91dGxpbmU6IDJweCB0cmFuc3BhcmVudCAjREJBRjU3OyAqL1xcbiAgICBcXG59XFxuXFxuLmNvbnRhaW5lckZsb2F0TWVudSA+IHA6bnRoLWNoaWxkKDEpOmhvdmVye1xcblxcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGJhZjU3O1xcbiAgICBjb2xvcjogIzBFMDYwNTtcXG5cXG59XFxuXFxuLmNvbnRhaW5lckZsb2F0TWVudSA+IHA6bnRoLWNoaWxkKDMpOmhvdmVye1xcblxcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGJhZjU3O1xcbiAgICBjb2xvcjogIzBFMDYwNTtcXG4gXFxufVxcblxcbi5jb250YWluZXJOYW1lUmVzdGF1cmFudHtcXG5cXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLnRleHRGbG9hdE1lbnV7XFxuICAgIGNvbG9yOiAjZmZmO1xcbn1cXG5cXG5we1xcbiAgICBjb2xvcjogI2ZmZjtcXG59XFxuXFxuLmphcExldHRlcnN7XFxuXFxuICAgIGNvbG9yOiAjREJBRjU3O1xcbiAgICBsZXR0ZXItc3BhY2luZzogNHB4O1xcbn1cXG5cXG4udGl0bGVQcmVzZW50YXRpb257XFxuXFxuICAgIGZvbnQtc2l6ZTogMy41cmVtO1xcbiAgICBmb250LXdlaWdodDogYm9sZDtcXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuXFxuICAgIHRyYW5zaXRpb246IGFsbCAuMTNzIGVhc2UtaW4tb3V0O1xcblxcbn1cXG5cXG4udGl0bGVQcmVzZW50YXRpb246aG92ZXJ7XFxuXFxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxLjMpO1xcbn1cXG5cXG4uYnRuTWVudXtcXG5cXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI0JBOEY0NztcXG5cXG4gICAgcGFkZGluZzogMTZweDtcXG5cXG4gICAgd2lkdGg6IDIwMHB4O1xcblxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFxuICAgIGJvcmRlci1yYWRpdXM6IDEwMHB4O1xcblxcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjEzcyBlYXNlLWluLW91dDtcXG5cXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcblxcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuXFxuXFxuLmJ0bk1lbnU6aG92ZXJ7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XFxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxLjUpO1xcblxcbn1cXG5cXG4uaG92ZXJCdG5CcmlnaHRuZXNzeyBhbmltYXRpb246IGhvdmVyQnRuQnJpZ2h0bmVzcyAuMTJzIGxpbmVhciBib3RoO31cXG5cXG5Aa2V5ZnJhbWVzIGhvdmVyQnRuQnJpZ2h0bmVzc3tcXG4gICAgMCV7XFxuICAgICAgICBmaWx0ZXI6IGJyaWdodG5lc3MoMSk7XFxuICAgIH1cXG5cXG4gICAgMjUle1xcbiAgICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMSk7XFxuICAgIH1cXG5cXG4gICAgNTAle1xcbiAgICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMik7XFxuICAgIH1cXG5cXG4gICAgNzUle1xcbiAgICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMyk7XFxuICAgIH1cXG5cXG4gICAgMTAwJXtcXG4gICAgICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxLjQpOyAgICBcXG4gICAgfVxcbn1cXG5cXG4uYmx1ci1vdXQtY29udHJhY3R7YW5pbWF0aW9uOmJsdXItb3V0LWNvbnRyYWN0IC4zcyBsaW5lYXIgYm90aH0gXFxuXFxuQGtleWZyYW1lcyBibHVyLW91dC1jb250cmFjdHtcXG4gICAgMCV7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0cmFuc2Zvcm06c2NhbGUoMSk7XFxuICAgICAgICBmaWx0ZXI6Ymx1ciguMDFweCk7XFxuICAgICAgICBcXG4gICAgfVxcbiAgICAxMDAle1xcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgICAgdHJhbnNmb3JtOnNjYWxlKDApO1xcbiAgICAgICAgZmlsdGVyOmJsdXIoMTJweCk7XFxuICAgICAgICBvcGFjaXR5OjBcXG4gICAgfVxcbn1cXG5cXG4vKiBNRU5VLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xcblxcbi5jb250YWluZXJJdGVtc01lbnV7XFxuICAgIFxcbiAgICB3aWR0aDogMTAwdnc7XFxuXFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIFxcbiAgICAvKiBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDQwMHB4LG1heC1jb250ZW50KSk7ICovXFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDMsNDAwcHgpO1xcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgyLCAzMDBweCk7XFxuXFxuICAgIC8qIGp1c3RpZnktY29udGVudDogY2VudGVyOyAqL1xcbiAgICBwbGFjZS1jb250ZW50OiBjZW50ZXI7XFxuXFxuICAgIGdhcDogMzBweDtcXG59XFxuXFxuLml0ZW1NZW51e1xcblxcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xcblxcbiAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgICBib3JkZXItY29sb3I6ICNFRkMyNzk7XFxuICAgIGJvcmRlci13aWR0aDogNHB4O1xcblxcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGVuZDtcXG5cXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uY29udGFpbmVyTmFtZUl0ZW17XFxuXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBwYWRkaW5nOiAxNnB4O1xcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTBweCk7XFxuXFxuICAgIGNvbG9yOiAjZmZmO1xcblxcbiAgICAvKiBib3JkZXItcmFkaXVzOiAwIDAgMTZweCAxNnB4OyAqL1xcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5pdGVtMXtcXG5cXG4gICAgYmFja2dyb3VuZDogdXJsKC4vc3VzaGlOZXcucG5nKTtcXG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcbn1cXG4uaXRlbTJ7XFxuXFxuICAgIGJhY2tncm91bmQ6IHVybCguL3JhbWVuLnBuZyk7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG59XFxuLml0ZW0ze1xcblxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoLi91ZG9uLnBuZyk7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG59XFxuLml0ZW00e1xcblxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoLi95YWtpdG9yaS5wbmcpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxufVxcbi5pdGVtNXtcXG5cXG4gICAgYmFja2dyb3VuZDogdXJsKC4vdGVtcHVyYU5ldy5wbmcpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvbnRhaW47XFxuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG59XFxuLml0ZW02e1xcblxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoLi9va29ub21peWEucG5nKTtcXG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcbn1cXG5cXG4uaXRlbU1lbnU6aG92ZXJ7XFxuXFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSk7XFxuXFxufVxcblxcbi5ibHVyLW91dHtcXG4gICAgYW5pbWF0aW9uOmJsdXItb3V0IC4zcyBsaW5lYXIgYm90aDtcXG59IFxcblxcbkBrZXlmcmFtZXMgYmx1ci1vdXR7XFxuICAgIDAle1xcbiAgICAgICAgZmlsdGVyOmJsdXIoMHB4KTtcXG4gICAgICAgIG9wYWNpdHk6MVxcbiAgICB9XFxuICAgIDEwMCV7XFxuICAgICAgICAgICAgZmlsdGVyOmJsdXIoMTJweCk7XFxuICAgICAgICAgICAgb3BhY2l0eTowXFxuICAgIH1cXG59XFxuXFxuXFxuLyogQ09OVEFDVC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cXG5cXG4uY29udGFpbmVySXRlbXNDb250YWN0e1xcblxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoJy4vdHJlZS5wbmcnKTtcXG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogYm90dG9tO1xcbiAgICB3aWR0aDogMTAwdnc7XFxuXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBnYXA6IDMwcHg7XFxuICAgIFxcblxcbn1cXG5cXG4uaXRlbXNDb250YWN0e1xcblxcbiAgICB3aWR0aDogNTAwcHg7XFxuICAgIGhlaWdodDogMzAwcHg7XFxuXFxuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XFxuXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcblxcblxcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTBweCk7XFxuXFxuICAgIGJvcmRlcjogc29saWQgNHB4ICNBNjY5MTg7XFxufVxcblxcbi5jb250YWluZXJJbmZvQ29udGFjdHtcXG5cXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgZ2FwOiAzMHB4O1xcblxcbn1cXG5cXG4uY29udGFpbmVySW5mb0FkZHJlc3N7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuXFxuICAgIGdhcDogMzBweDtcXG59XFxuXFxuLnBJbmZvQWRkcmVzc3tcXG4gICAgbWFyZ2luOiBhdXRvO1xcbiAgICBmb250LXNpemU6IDEuMXJlbTtcXG59XFxuXFxuLnBJbmZvQ29udGFjdHtcXG4gICAgbWFyZ2luOiBhdXRvO1xcbiAgICBmb250LXNpemU6IDEuMXJlbTtcXG5cXG59XFxuXFxuLnRpdGxlQ29udGFjdHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcblxcbiAgICB0b3A6IDMwcHg7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbn1cXG5cXG4udGl0bGVBZGRyZXNze1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFxuICAgIHRvcDogMzBweDtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxufVxcblxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDU2MHB4KXtcXG5cXG4gICAgLml0ZW1zQ29udGFjdHtcXG5cXG4gICAgICAgIHdpZHRoOiAzNTBweDtcXG4gICAgICAgIGhlaWdodDogMjAwcHg7XFxuICAgIH1cXG5cXG59XFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDYwcHgpe1xcbiAgICBcXG4gICAgLmNvbnRhaW5lck5hbWVSZXN0YXVyYW50e1xcblxcbiAgICAgICAgZm9udC1zaXplOiAxcmVtO1xcbiAgICB9XFxuICAgIC5jb250YWluZXJGbG9hdE1lbnV7XFxuXFxuICAgICAgICB3aWR0aDogMzUwcHg7XFxuXFxuICAgICAgICBnYXA6IDEwcHg7XFxuICAgIH1cXG5cXG4gICAgLmNvbnRhaW5lclByZXNlbnRhdGlvbntcXG4gICAgICAgIGdhcDogMTBweDtcXG4gICAgfVxcblxcbn1cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAxMzIxcHgpe1xcbiAgICBcXG4gICAgLmNvbnRhaW5lckl0ZW1zTWVudXtcXG5cXG4gICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDQwMHB4KTtcXG4gICAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDMsIDMwMHB4KTtcXG5cXG4gICAgICAgIG1hcmdpbjogMTUwcHggMDtcXG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAuMTNzIGVhc2UtaW4tb3V0O1xcbiAgICAgICAgcGFkZGluZzogMCAwIDEwMHB4IDA7XFxuICAgIH1cXG5cXG4gICAgXFxuXFxuICAgIC5jb250YWluZXJJbWd7XFxuXFxuICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xcbiAgICB9XFxuXFxuICAgIC5jb250YWluZXJQcmVzZW50YXRpb257XFxuICAgICAgICB3aWR0aDogMTAwdnc7XFxuICAgICAgICBwYWRkaW5nOiAwO1xcbiAgICB9XFxuICAgIFxcbiAgICAudGV4dFByZXNlbnRhdGlvbntcXG4gICAgICAgIHdpZHRoOiA2MDBweDtcXG4gICAgfVxcblxcbn1cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA4OTZweCl7XFxuICAgIFxcbiAgICAuY29udGFpbmVySXRlbXNNZW51e1xcblxcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgMzAwcHgpO1xcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMywgMjAwcHgpO1xcblxcbiAgICAgICAgbWFyZ2luOiAxNTBweCAwO1xcbiAgICB9XFxuXFxuICAgIFxcbn1cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2NzhweCl7XFxuICAgIFxcbiAgICAuY29udGFpbmVySXRlbXNNZW51e1xcblxcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMSwgMzAwcHgpO1xcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoNiwgMjAwcHgpO1xcblxcbiAgICAgICAgbWFyZ2luOiAxNTBweCAwO1xcbiAgICAgICAgcGFkZGluZzogMCAwIDEwMHB4IDA7XFxuICAgIH1cXG5cXG4gICAgLnRleHRQcmVzZW50YXRpb257XFxuICAgICAgICB3aWR0aDogMzAwcHg7XFxuICAgIH1cXG5cXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuXG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcblxuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG5cbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG5cbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG5cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cblxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG5cbiAgY3NzICs9IG9iai5jc3M7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cblxuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsImltcG9ydCBjcmVhdGVFbGVtZW50c0RvbSBmcm9tICcuL2RvbUNyZWF0aW9uLmpzJztcblxuXG5jb25zdCBhcnJFbGVtZW50c0NvbnRhY3QgPSBbXG5cbiAgICAvLyB7XG4gICAgLy8gICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAvLyAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250ZW50J30sXG4gICAgLy8gICAgIGFwcGVuZENoaWxkOiAnYm9keScsXG4gICAgLy8gfSxcbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJJdGVtc0NvbnRhY3QnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGVudCcsXG4gICAgfSxcblxuICAgIC8vICBjaGlsZHMgY29udGFpbmVySXRlbXNDb250YWN0XG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidpdGVtc0NvbnRhY3QgY29udGFjdCd9LFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJdGVtc0NvbnRhY3QnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidpdGVtc0NvbnRhY3QgYWRkcmVzcyd9LFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJdGVtc0NvbnRhY3QnLFxuICAgIH0sXG5cbiAgICAvLyAgY2hpbGQgY29udGFjdFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ3AnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J3RpdGxlQ29udGFjdCd9LFxuICAgICAgICBpbm5lclRleHQ6ICdDb250YWN0JyxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFjdCcsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2NvbnRhaW5lckluZm9Db250YWN0J30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhY3QnLFxuICAgIH0sXG4gICAgXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIC8vIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVySW5mb0NvbnRhY3QnfSxcbiAgICAgICAgaW5uZXJIVE1MOiAnPHN2ZyB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk0zIDVDMyAzLjg5NTQzIDMuODk1NDMgMyA1IDNIOC4yNzkyNEM4LjcwOTY3IDMgOS4wOTE4MSAzLjI3NTQzIDkuMjI3OTIgMy42ODM3N0wxMC43MjU3IDguMTc3MjFDMTAuODgzMSA4LjY0OTMyIDEwLjY2OTQgOS4xNjUzMSAxMC4yMjQzIDkuMzg3ODdMNy45NjcwMSAxMC41MTY1QzkuMDY5MjUgMTIuOTYxMiAxMS4wMzg4IDE0LjkzMDggMTMuNDgzNSAxNi4wMzNMMTQuNjEyMSAxMy43NzU3QzE0LjgzNDcgMTMuMzMwNiAxNS4zNTA3IDEzLjExNjkgMTUuODIyOCAxMy4yNzQzTDIwLjMxNjIgMTQuNzcyMUMyMC43MjQ2IDE0LjkwODIgMjEgMTUuMjkwMyAyMSAxNS43MjA4VjE5QzIxIDIwLjEwNDYgMjAuMTA0NiAyMSAxOSAyMUgxOEM5LjcxNTczIDIxIDMgMTQuMjg0MyAzIDZWNVpcIiBzdHJva2U9XCIjREJBRjU3XCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz48L3N2Zz4nLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJbmZvQ29udGFjdCcsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdwJyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidwSW5mb0NvbnRhY3QnfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnMDMtMTIzNC01Njc4JyxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVySW5mb0NvbnRhY3QnLFxuICAgIH0sXG5cbiAgICAvLyAgY2hpbGQgYWRkcmVzc1xuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ3AnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J3RpdGxlQWRkcmVzcyd9LFxuICAgICAgICBpbm5lclRleHQ6ICdBZGRyZXNzJyxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuYWRkcmVzcycsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2NvbnRhaW5lckluZm9BZGRyZXNzJ30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmFkZHJlc3MnLFxuICAgIH0sXG5cbiAgICBcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICAvLyBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2NvbnRhaW5lckluZm9Db250YWN0J30sXG4gICAgICAgIGlubmVySFRNTDogJzxzdmcgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJNMTcuNjU2OSAxNi42NTY5QzE2LjcyMDIgMTcuNTkzNSAxNC43NjE2IDE5LjU1MjEgMTMuNDEzOCAyMC44OTk5QzEyLjYzMjcgMjEuNjgxIDExLjM2NzcgMjEuNjgxNCAxMC41ODY2IDIwLjkwMDNDOS4yNjIzNCAxOS41NzYgNy4zNDE1OSAxNy42NTUzIDYuMzQzMTUgMTYuNjU2OUMzLjIxODk1IDEzLjUzMjcgMy4yMTg5NSA4LjQ2NzM0IDYuMzQzMTUgNS4zNDMxNUM5LjQ2NzM0IDIuMjE4OTUgMTQuNTMyNyAyLjIxODk1IDE3LjY1NjkgNS4zNDMxNUMyMC43ODEgOC40NjczNCAyMC43ODEgMTMuNTMyNyAxNy42NTY5IDE2LjY1NjlaXCIgc3Ryb2tlPVwiI0RCQUY1N1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+PHBhdGggZD1cIk0xNSAxMUMxNSAxMi42NTY5IDEzLjY1NjkgMTQgMTIgMTRDMTAuMzQzMSAxNCA5IDEyLjY1NjkgOSAxMUM5IDkuMzQzMTUgMTAuMzQzMSA4IDEyIDhDMTMuNjU2OSA4IDE1IDkuMzQzMTUgMTUgMTFaXCIgc3Ryb2tlPVwiI0RCQUY1N1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIi8+PC9zdmc+JyxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVySW5mb0FkZHJlc3MnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAncCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczoncEluZm9BZGRyZXNzJ30sXG4gICAgICAgIGlubmVyVGV4dDogJzEyMyBNYWluIFN0LCBTYWt1cmEgQ2l0eSwgSmFwYW4nLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJbmZvQWRkcmVzcycsXG4gICAgfSxcblxuXG5dO1xuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50c0RvbUNvbnRhY3QoYXJyKSB7XG4gICAgXG4gICAgYXJyLmZvckVhY2goZWxlbWVudE9iamVjdCA9PiB7XG4gICAgICAgIFxuICAgICAgICBjcmVhdGVFbGVtZW50c0RvbShlbGVtZW50T2JqZWN0LmVsZW1lbnRUeXBlLGVsZW1lbnRPYmplY3QuYXR0cmlidXRlcyxlbGVtZW50T2JqZWN0LmlubmVySFRNTCxlbGVtZW50T2JqZWN0LmlubmVyVGV4dCxkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRPYmplY3QuYXBwZW5kQ2hpbGQpKTtcbiAgICAgICAgXG4gICAgfSk7XG59XG5cbmV4cG9ydCB7Y3JlYXRlRWxlbWVudHNEb21Db250YWN0LGFyckVsZW1lbnRzQ29udGFjdH07IiwiZnVuY3Rpb24gY3JlYXRlRWxlbWVudHNEb20oZWxlbWVudFR5cGUsYXR0cmlidXRlcyxpbm5lckhUTUwsaW5uZXJUZXh0LGFwcGVuZENoaWxkKSB7XG4gICAgXG4gICAgaWYoZWxlbWVudFR5cGUpe1xuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudFR5cGUpO1xuICBcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpe1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSxhdHRyaWJ1dGVzW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5uZXJIVE1MKSB7XG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTD0gaW5uZXJIVE1MO1xuXG4gICAgICAgIH0gICAgXG4gICAgICAgIGlmIChpbm5lclRleHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gaW5uZXJUZXh0O1xuXG4gICAgICAgIH1cbiAgICAgICAgaWYoYXBwZW5kQ2hpbGQpIHtcbiAgICAgICAgICAgIGFwcGVuZENoaWxkLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0gXG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICAgIFxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFbGVtZW50c0RvbTsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJztcbmltcG9ydCBjcmVhdGVFbGVtZW50c0RvbSBmcm9tICcuL2RvbUNyZWF0aW9uLmpzJztcbmltcG9ydCBhbmltZSBmcm9tICdhbmltZWpzL2xpYi9hbmltZS5lcy5qcyc7XG5cbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnRzRG9tTWVudSwgYXJyRWxlbWVudHNNZW51IH0gZnJvbSAnLi9tZW51LmpzJztcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnRzRG9tQ29udGFjdCwgYXJyRWxlbWVudHNDb250YWN0IH0gZnJvbSAnLi9jb250YWN0JztcblxuXG5cbmNvbnN0IGFyckVsZW1lbnRzSG9tZSA9IFtcblxuICAgIC8vICBjaGlsZHMgYm9keVxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGVudCd9LFxuICAgICAgICBhcHBlbmRDaGlsZDogJ2JvZHknLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJGbG9hdE1lbnUnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICdib2R5JyxcbiAgICB9LFxuXG4gICAgLy8gIGNoaWxkcyBjb250YWluZXJGbG9hdE1lbnVcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdwJyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOid0ZXh0RmxvYXRNZW51IG1lbnUnfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnTWVudScsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckZsb2F0TWVudScsXG5cbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyTmFtZVJlc3RhdXJhbnQnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVyRmxvYXRNZW51JyxcblxuICAgIH0sXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ3AnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J3RleHRGbG9hdE1lbnUnfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnU2FrdXJhIEtpdGNoZW4nLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJOYW1lUmVzdGF1cmFudCcsXG5cbiAgICB9LFxuXG4gICAgLy8gIGNoaWxkIGNvbnRhaW5lck5hbWVSZXN0YXVyYW50XG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAncCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczondGV4dEZsb2F0TWVudSBqYXBMZXR0ZXJzJ30sXG4gICAgICAgIGlubmVyVGV4dDogJ+OCteOCr+ODqeOCreODg+ODgeODsycsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lck5hbWVSZXN0YXVyYW50JyxcblxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAncCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczondGV4dEZsb2F0TWVudSBjb250YWN0J30sXG4gICAgICAgIGlubmVyVGV4dDogJ0NvbnRhY3QnLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJGbG9hdE1lbnUnLFxuXG4gICAgfSxcblxuICAgIC8vICBDaGlsZHMgY29udGVudFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyUHJlc2VudGF0aW9uJ30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRlbnQnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJJbWcnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGVudCcsXG4gICAgfSxcblxuICAgIC8vICBDaGlsZCBjb250YWluZXJQcmVzZW50YXRpb25cblxuICAgIFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyVGl0bGVQcmVzZW50YXRpb24nfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVyUHJlc2VudGF0aW9uJyxcbiAgICB9LFxuICAgIFxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdwJyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOid0aXRsZVByZXNlbnRhdGlvbiBqYXBMZXR0ZXJzJ30sXG4gICAgICAgIGlubmVyVGV4dDogJ+OCiOOBhuOBk+OBnScsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lclRpdGxlUHJlc2VudGF0aW9uJyxcblxuICAgIH0sXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ3AnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J3RpdGxlUHJlc2VudGF0aW9uIGphcExldHRlcnMnfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnWcWNa29zbycsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lclRpdGxlUHJlc2VudGF0aW9uJyxcblxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAncCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczondGV4dFByZXNlbnRhdGlvbid9LFxuICAgICAgICBpbm5lclRleHQ6ICdXZWxjb21lIHRvIFNha3VyYSBLaXRjaGVuLCB3aGVyZSB3ZSBvZmZlciBhIHdpZGUgcmFuZ2Ugb2YgYXV0aGVudGljIGFuZCBkZWxpY2lvdXMgSmFwYW5lc2UgZGlzaGVzIHRoYXQgd2lsbCB0YW50YWxpemUgeW91ciB0YXN0ZSBidWRzLiBGcm9tIHRyYWRpdGlvbmFsIHN1c2hpIHJvbGxzIHRvIHNpenpsaW5nIHRlcHBhbnlha2ksIG91ciBtZW51IGhhcyBzb21ldGhpbmcgZm9yIGV2ZXJ5b25lIC5cXG5cXG5XZSB1c2Ugb25seSB0aGUgZnJlc2hlc3QgYW5kIGhpZ2hlc3QtcXVhbGl0eSBpbmdyZWRpZW50cyB0byBjcmVhdGUgb3VyIGRpc2hlcywgZW5zdXJpbmcgdGhhdCBldmVyeSBiaXRlIGlzIHBhY2tlZCB3aXRoIGZsYXZvciBhbmQgbnV0cml0aW9uLiBPdXIgZXhwZXJpZW5jZWQgY2hlZnMgYXJlIGRlZGljYXRlZCB0byBwZXJmZWN0aW5nIGVhY2ggZGlzaCwgc28geW91IGNhbiBleHBlY3Qgbm90aGluZyBidXQgdGhlIGJlc3Qgd2hlbiB5b3UgZGluZSB3aXRoIHVzLlxcblxcbkluIGFkZGl0aW9uIHRvIG91ciBtb3V0aC13YXRlcmluZyBjdWlzaW5lLCB3ZSBvZmZlciBhIHJlbGF4aW5nIGFuZCB3ZWxjb21pbmcgYXRtb3NwaGVyZSB0aGF0XFwncyBwZXJmZWN0IGZvciBhIHJvbWFudGljIGRhdGUgbmlnaHQgb3IgYSBmYW1pbHkgZGlubmVyLiBPdXIgZnJpZW5kbHkgYW5kIGF0dGVudGl2ZSBzdGFmZiB3aWxsIG1ha2Ugc3VyZSB5b3UgaGF2ZSBhIG1lbW9yYWJsZSBkaW5pbmcgZXhwZXJpZW5jZSBmcm9tIHN0YXJ0IHRvIGZpbmlzaC5cXG5cXG5XaGV0aGVyIHlvdVxcJ3JlIGEgc3VzaGkgbG92ZXIgb3IgYSBmYW4gb2YgaGVhcnR5IHJhbWVuLCB3ZSBoYXZlIHNvbWV0aGluZyB0byBzYXRpc2Z5IGV2ZXJ5IGNyYXZpbmcuIFZpc2l0IHVzIHRvZGF5IGFuZCBleHBlcmllbmNlIHRoZSB0YXN0ZSBvZiBKYXBhbiByaWdodCBoZXJlIGluIG91ciByZXN0YXVyYW50LicsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lclByZXNlbnRhdGlvbicsXG5cbiAgICB9LFxuXG4gICAgLy8ge1xuICAgIC8vICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgLy8gICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonYnRuTWVudSd9LFxuICAgIC8vICAgICBpbm5lclRleHQ6ICdNZW51JyxcbiAgICAvLyAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVyUHJlc2VudGF0aW9uJyxcbiAgICAvLyB9LFxuXG4gICAgXG4gICAgXG5dO1xuXG5jb25zdCBhcnJFbGVtZW50c0hvbWVXaXRob3V0RmxvYXRNZW51ID0gW1xuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyUHJlc2VudGF0aW9uJ30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRlbnQnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJJbWcnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGVudCcsXG4gICAgfSxcblxuICAgIC8vICBDaGlsZCBjb250YWluZXJQcmVzZW50YXRpb25cblxuICAgIFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyVGl0bGVQcmVzZW50YXRpb24nfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVyUHJlc2VudGF0aW9uJyxcbiAgICB9LFxuICAgIFxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdwJyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOid0aXRsZVByZXNlbnRhdGlvbiBqYXBMZXR0ZXJzJ30sXG4gICAgICAgIGlubmVyVGV4dDogJ+OCiOOBhuOBk+OBnScsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lclRpdGxlUHJlc2VudGF0aW9uJyxcblxuICAgIH0sXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ3AnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J3RpdGxlUHJlc2VudGF0aW9uIGphcExldHRlcnMnfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnWcWNa29zbycsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lclRpdGxlUHJlc2VudGF0aW9uJyxcblxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAncCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczondGV4dFByZXNlbnRhdGlvbid9LFxuICAgICAgICBpbm5lclRleHQ6ICdXZWxjb21lIHRvIFNha3VyYSBLaXRjaGVuLCB3aGVyZSB3ZSBvZmZlciBhIHdpZGUgcmFuZ2Ugb2YgYXV0aGVudGljIGFuZCBkZWxpY2lvdXMgSmFwYW5lc2UgZGlzaGVzIHRoYXQgd2lsbCB0YW50YWxpemUgeW91ciB0YXN0ZSBidWRzLiBGcm9tIHRyYWRpdGlvbmFsIHN1c2hpIHJvbGxzIHRvIHNpenpsaW5nIHRlcHBhbnlha2ksIG91ciBtZW51IGhhcyBzb21ldGhpbmcgZm9yIGV2ZXJ5b25lIC5cXG5cXG5XZSB1c2Ugb25seSB0aGUgZnJlc2hlc3QgYW5kIGhpZ2hlc3QtcXVhbGl0eSBpbmdyZWRpZW50cyB0byBjcmVhdGUgb3VyIGRpc2hlcywgZW5zdXJpbmcgdGhhdCBldmVyeSBiaXRlIGlzIHBhY2tlZCB3aXRoIGZsYXZvciBhbmQgbnV0cml0aW9uLiBPdXIgZXhwZXJpZW5jZWQgY2hlZnMgYXJlIGRlZGljYXRlZCB0byBwZXJmZWN0aW5nIGVhY2ggZGlzaCwgc28geW91IGNhbiBleHBlY3Qgbm90aGluZyBidXQgdGhlIGJlc3Qgd2hlbiB5b3UgZGluZSB3aXRoIHVzLlxcblxcbkluIGFkZGl0aW9uIHRvIG91ciBtb3V0aC13YXRlcmluZyBjdWlzaW5lLCB3ZSBvZmZlciBhIHJlbGF4aW5nIGFuZCB3ZWxjb21pbmcgYXRtb3NwaGVyZSB0aGF0XFwncyBwZXJmZWN0IGZvciBhIHJvbWFudGljIGRhdGUgbmlnaHQgb3IgYSBmYW1pbHkgZGlubmVyLiBPdXIgZnJpZW5kbHkgYW5kIGF0dGVudGl2ZSBzdGFmZiB3aWxsIG1ha2Ugc3VyZSB5b3UgaGF2ZSBhIG1lbW9yYWJsZSBkaW5pbmcgZXhwZXJpZW5jZSBmcm9tIHN0YXJ0IHRvIGZpbmlzaC5cXG5cXG5XaGV0aGVyIHlvdVxcJ3JlIGEgc3VzaGkgbG92ZXIgb3IgYSBmYW4gb2YgaGVhcnR5IHJhbWVuLCB3ZSBoYXZlIHNvbWV0aGluZyB0byBzYXRpc2Z5IGV2ZXJ5IGNyYXZpbmcuIFZpc2l0IHVzIHRvZGF5IGFuZCBleHBlcmllbmNlIHRoZSB0YXN0ZSBvZiBKYXBhbiByaWdodCBoZXJlIGluIG91ciByZXN0YXVyYW50LicsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lclByZXNlbnRhdGlvbicsXG5cbiAgICB9LFxuXG4gICAgLy8ge1xuICAgIC8vICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgLy8gICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonYnRuTWVudSd9LFxuICAgIC8vICAgICBpbm5lclRleHQ6ICdNZW51JyxcbiAgICAvLyAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVyUHJlc2VudGF0aW9uJyxcbiAgICAvLyB9LFxuXTtcblxuZnVuY3Rpb24gZG9tRWxlbWVudHNIb21lKGFycikge1xuXG4gICAgYXJyLmZvckVhY2goZWxlbWVudE9iamVjdCA9PiB7XG4gICAgICAgIFxuICAgICAgICBjcmVhdGVFbGVtZW50c0RvbShlbGVtZW50T2JqZWN0LmVsZW1lbnRUeXBlLGVsZW1lbnRPYmplY3QuYXR0cmlidXRlcyxudWxsLGVsZW1lbnRPYmplY3QuaW5uZXJUZXh0LGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudE9iamVjdC5hcHBlbmRDaGlsZCkpO1xuICAgICAgICBcbiAgICB9KTtcbiAgIFxufSAgIFxuXG5cbmNvbnN0IGFyclNlY3Rpb24gPSBbJ2hvbWUnXTtcblxuZnVuY3Rpb24gY2hhbmdlU2VjdGlvbigpIHtcbiAgICBcblxuICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudScpO1xuICAgIGNvbnN0IGNvbnRhY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFjdCcpO1xuICAgIGNvbnN0IGhvbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyTmFtZVJlc3RhdXJhbnQnKTsgICAgXG4gICAgXG5cbiAgIFxuICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIFxuICAgICAgICBpZiAoYXJyU2VjdGlvblswXSA9PSAnaG9tZScpIHtcblxuICAgICAgICAgICAgZGVsQ29udGVudEhvbWUoKVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnRzRG9tTWVudShhcnJFbGVtZW50c01lbnUpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVudHJ5TWVudSgpO1xuICAgICAgICAgICAgICAgIGhvdmVySXRlbXNNZW51KCk7XG4gICAgXG4gICAgICAgICAgICB9LDI1MClcbiAgICBcblxuICAgICAgICAgICAgXG4gICAgICAgIH1lbHNlIGlmKGFyclNlY3Rpb25bMF0gPT0gJ2NvbnRhY3QnKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYW5pbWF0aW9uT3V0Q29udGFjdCgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVsQ29udGVudENvbnRhY3QoKTtcbiAgICAgICAgICAgIH0sMjAwKVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnRzRG9tTWVudShhcnJFbGVtZW50c01lbnUpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVudHJ5TWVudSgpO1xuICAgICAgICAgICAgICAgIGhvdmVySXRlbXNNZW51KCk7XG4gICAgXG4gICAgICAgICAgICB9LDI1MClcbiAgICBcblxuXG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBhcnJTZWN0aW9uLnBvcCgpXG4gICAgICAgIGFyclNlY3Rpb24ucHVzaCgnbWVudScpO1xuXG4gICAgfSlcblxuICAgIGNvbnRhY3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cbiAgICAgICAgaWYgKGFyclNlY3Rpb25bMF0gPT0gJ21lbnUnKSB7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYW5pbWF0aW9uT3V0TWVudSgpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBkZWxDb250ZW50TWVudSgpXG4gICAgICAgICAgICB9LDIwMClcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjcmVhdGVFbGVtZW50c0RvbUNvbnRhY3QoYXJyRWxlbWVudHNDb250YWN0KTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25FbnRyeUNvbnRhY3QoKTtcbiAgICAgICAgICAgIH0sMjAwKVxuXG4gICAgICAgIH1lbHNlIGlmKGFyclNlY3Rpb25bMF0gPT0gJ2hvbWUnKXtcbiAgICAgIFxuICAgICAgICAgICAgZGVsQ29udGVudEhvbWUoKVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnRzRG9tQ29udGFjdChhcnJFbGVtZW50c0NvbnRhY3QpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVudHJ5Q29udGFjdCgpO1xuICAgICAgICAgICAgfSwyMDApXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIFxuXG4gICAgICAgIGFyclNlY3Rpb24ucG9wKClcbiAgICAgICAgYXJyU2VjdGlvbi5wdXNoKCdjb250YWN0Jyk7XG4gICAgICAgIFxuICAgIH0pXG5cbiAgICBob21lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBcbiAgICAgICAgaWYgKGFyclNlY3Rpb25bMF0gPT0gJ21lbnUnKSB7XG5cbiAgICAgICAgICAgIGFuaW1hdGlvbk91dE1lbnUoKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVsQ29udGVudE1lbnUoKVxuICAgICAgICAgICAgfSwyMDApXG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZG9tRWxlbWVudHNIb21lKGFyckVsZW1lbnRzSG9tZVdpdGhvdXRGbG9hdE1lbnUpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkVudHJ5SG9tZSgpO1xuICAgICAgICAgICAgfSwyMDIpXG4gICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH1lbHNlIGlmKGFyclNlY3Rpb25bMF0gPT0gJ2NvbnRhY3QnKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYW5pbWF0aW9uT3V0Q29udGFjdCgpXG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbENvbnRlbnRDb250YWN0KCk7XG4gICAgICAgICAgICB9LDIwMClcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBkb21FbGVtZW50c0hvbWUoYXJyRWxlbWVudHNIb21lV2l0aG91dEZsb2F0TWVudSk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uRW50cnlIb21lKCk7XG4gICAgICAgICAgICB9LDIwMilcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcblxuICAgICAgICBhcnJTZWN0aW9uLnBvcCgpXG4gICAgICAgIGFyclNlY3Rpb24ucHVzaCgnaG9tZScpO1xuXG4gICAgfSlcblxuICAgIFxuXG5cblxufVxuXG5mdW5jdGlvbiBhbmltYXRpb25FbnRyeUhvbWUoKSB7XG4gICAgXG5cbiAgICBhbmltZSh7XG4gICAgICAgIHRhcmdldHM6IFsnLmNvbnRhaW5lclByZXNlbnRhdGlvbicsICcuY29udGFpbmVySW1nJ10sXG4gICAgICAgIG9wYWNpdHk6IFswLCAxXSxcbiAgICAgICAgZmlsZXI6IGJsdXIoJzEycHgnLCAnMHB4JyksXG4gICAgICAgIGVhc2luZzonZWFzZUluUXVpbnQnLFxuICAgICAgICBkdXJhdGlvbjogMzAwLFxuXG4gICAgfSlcblxufVxuXG5mdW5jdGlvbiBhbmltYXRpb25FbnRyeU1lbnUoKSB7XG4gICAgXG4gICAgbGV0IGl0ZW1zTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pdGVtTWVudScpO1xuXG4gICAgYW5pbWUoe1xuICAgICAgICB0YXJnZXRzOiBpdGVtc01lbnUsXG4gICAgICAgIHNjYWxlOiBbMCwgMV0sXG4gICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgIGVhc2luZzogJ2Vhc2VPdXRCYWNrJyxcbiAgICAgICAgZGVsYXk6IGFuaW1lLnN0YWdnZXIoMTAwLCB7ZnJvbTogJ2ZpcnN0J30pLFxuXG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gYW5pbWF0aW9uT3V0TWVudSgpIHtcbiAgICBcbiAgICBhbmltZSh7XG4gICAgICAgIHRhcmdldHM6ICcuY29udGFpbmVySXRlbXNNZW51JyxcblxuICAgICAgICBvcGFjaXR5OlsxLCAwXSxcbiAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgZWFzaW5nOiAnZWFzZU91dEJhY2snLCAgICAgICAgXG5cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0aW9uRW50cnlDb250YWN0KCkgeyAgXG4gICAgIFxuICAgIGxldCBpdGVtc0NvbnRhY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaXRlbXNDb250YWN0Jyk7XG5cbiAgICBhbmltZSh7XG4gICAgICAgIHRhcmdldHM6IGl0ZW1zQ29udGFjdCxcbiAgICAgICAgc2NhbGU6IFswLCAxXSxcbiAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgZWFzaW5nOiAnZWFzZU91dEJhY2snLFxuICAgICAgICBkZWxheTogYW5pbWUuc3RhZ2dlcigxMDAsIHtmcm9tOiAnZmlyc3QnfSksXG5cbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiBhbmltYXRpb25PdXRDb250YWN0KCkge1xuICAgIFxuICAgIGFuaW1lKHtcbiAgICAgICAgdGFyZ2V0czogJy5jb250YWluZXJJdGVtc0NvbnRhY3QnLFxuICAgICAgICBvcGFjaXR5OiBbMSwgMF0sXG4gICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgIGVhc2luZzogJ2Vhc2VPdXRCYWNrJyxcblxuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIGhvdmVySXRlbXNNZW51KCkge1xuICAgIFxuICAgIGNvbnN0IGl0ZW1zTWVudUFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pdGVtTWVudScpO1xuICAgIFxuICAgIGl0ZW1zTWVudUFsbC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IHtcblxuICAgICAgICAgIGFuaW1lKHtcbiAgICAgICAgICAgICAgICB0YXJnZXRzOiBpdGVtLFxuICAgICAgICAgICAgICAgIHNjYWxlOiBbMSwgMC45NV0sXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnZWFzZU91dEVsYXN0aWMnLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgXG4gICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICBhbmltZSh7XG4gICAgICAgICAgICAgICAgdGFyZ2V0czogaXRlbSxcbiAgICAgICAgICAgICAgICBzY2FsZTogMSxcbiAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0RWxhc3RpYycsXG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbn1cblxuZnVuY3Rpb24gZGVsQ29udGVudEhvbWUoKSB7XG4gICAgXG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XG4gICAgY29uc3QgY29udGFpbmVyUHJlc2VudGF0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lclByZXNlbnRhdGlvbicpO1xuICAgIGNvbnN0IGNvbnRhaW5lckltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXJJbWcnKTtcblxuICAgIGNvbnRhaW5lclByZXNlbnRhdGlvbi5jbGFzc0xpc3QuYWRkKCdibHVyLW91dCcpXG4gICAgY29udGFpbmVySW1nLmNsYXNzTGlzdC5hZGQoJ2JsdXItb3V0JylcblxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnRlbnQucmVtb3ZlQ2hpbGQoY29udGFpbmVyUHJlc2VudGF0aW9uKTtcbiAgICAgICAgY29udGVudC5yZW1vdmVDaGlsZChjb250YWluZXJJbWcpOyAgICBcblxuICAgIH0sMTUwKVxuICAgIFxufVxuZnVuY3Rpb24gZGVsQ29udGVudE1lbnUoKSB7XG4gICAgXG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XG4gICAgY29uc3QgY29udGFpbmVySXRlbXNNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lckl0ZW1zTWVudScpO1xuXG5cblxuICAgIGNvbnRlbnQucmVtb3ZlQ2hpbGQoY29udGFpbmVySXRlbXNNZW51KTtcblxufVxuXG5mdW5jdGlvbiBkZWxDb250ZW50Q29udGFjdCgpIHtcbiAgICBcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKTtcbiAgICBjb25zdCBjb250YWluZXJJdGVtc0NvbnRhY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVySXRlbXNDb250YWN0Jyk7XG5cblxuXG4gICAgY29udGVudC5yZW1vdmVDaGlsZChjb250YWluZXJJdGVtc0NvbnRhY3QpO1xuXG59XG5cblxuZG9tRWxlbWVudHNIb21lKGFyckVsZW1lbnRzSG9tZSk7XG5hbmltYXRpb25FbnRyeUhvbWUoKTtcbmNoYW5nZVNlY3Rpb24oKTtcblxuXG5cbiIsImltcG9ydCBjcmVhdGVFbGVtZW50c0RvbSBmcm9tICcuL2RvbUNyZWF0aW9uLmpzJztcblxuXG5jb25zdCBhcnJFbGVtZW50c01lbnUgPSBbXG5cbiAgICAvLyAgY2hpbGRzIGNvbnRlbnRcbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJJdGVtc01lbnUnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGVudCcsXG4gICAgfSxcblxuICAgIC8vICBjaGlsZHMgY29udGFpbmVySXRlbXNNZW51XG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidpdGVtTWVudSBpdGVtMSd9LFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJdGVtc01lbnUnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJOYW1lSXRlbSd9LFxuICAgICAgICBpbm5lclRleHQ6ICdTdXNoaScsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLml0ZW0xJyxcbiAgICB9LFxuXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidpdGVtTWVudSBpdGVtMid9LFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJdGVtc01lbnUnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJOYW1lSXRlbSd9LFxuICAgICAgICBpbm5lclRleHQ6ICdSYW1lbicsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLml0ZW0yJyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonaXRlbU1lbnUgaXRlbTMnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVySXRlbXNNZW51JyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyTmFtZUl0ZW0nfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnVWRvbicsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLml0ZW0zJyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonaXRlbU1lbnUgaXRlbTQnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVySXRlbXNNZW51JyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyTmFtZUl0ZW0nfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnWWFraXRvcmknLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5pdGVtNCcsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2l0ZW1NZW51IGl0ZW01J30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckl0ZW1zTWVudScsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2NvbnRhaW5lck5hbWVJdGVtJ30sXG4gICAgICAgIGlubmVyVGV4dDogJ1RlbXB1cmEnLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5pdGVtNScsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2l0ZW1NZW51IGl0ZW02J30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckl0ZW1zTWVudScsXG4gICAgfSxcbiAgICBcbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJOYW1lSXRlbSd9LFxuICAgICAgICBpbm5lclRleHQ6ICdPa29ub21peWFraScsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLml0ZW02JyxcbiAgICB9LFxuXG5dO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRzRG9tTWVudShhcnIpIHtcbiAgICBcbiAgICBhcnIuZm9yRWFjaChlbGVtZW50T2JqZWN0ID0+IHtcbiAgICAgICAgXG4gICAgICAgIGNyZWF0ZUVsZW1lbnRzRG9tKGVsZW1lbnRPYmplY3QuZWxlbWVudFR5cGUsZWxlbWVudE9iamVjdC5hdHRyaWJ1dGVzLG51bGwsZWxlbWVudE9iamVjdC5pbm5lclRleHQsZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50T2JqZWN0LmFwcGVuZENoaWxkKSk7XG4gICAgICAgIFxuICAgIH0pO1xufVxuXG5cblxuZXhwb3J0IHtjcmVhdGVFbGVtZW50c0RvbU1lbnUsYXJyRWxlbWVudHNNZW51fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=