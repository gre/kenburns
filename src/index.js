var KenBurns = require("./kenburns");
var KenBurnsCanvas2dTrait = require("./canvas2d");
var KenBurnsWebGLTrait = require("./webgl");
var crop = require("./crop");

function extend (obj) {
  var source, prop;
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i];
    for (prop in source) {
      if (source.hasOwnProperty(prop)) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
}

function mixin (Clazz) {
  function Mixin () {
    KenBurns.call(this);
    Clazz.apply(this, arguments);
  }
  Mixin.prototype = extend({}, KenBurns.prototype, Clazz.prototype);
  return Mixin;
}

function webglSupported () {
  return !!document.createElement("canvas").getContext("webgl");
}

var Module = module.exports = {
  crop: crop,
  mixin: mixin,
  Canvas2D: mixin(KenBurnsCanvas2dTrait),
  WebGL: mixin(KenBurnsWebGLTrait),
  Canvas: function (canvas) {
    // Auto Detect what to use
    if (webglSupported())
      return new Module.WebGL(canvas);
    else
      return new Module.Canvas2D(canvas);
  }
};
