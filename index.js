var KenBurnsCore = require("kenburns-core");
var KenBurnsCanvas2D = require("kenburns-canvas2d");
var KenBurnsWebGL = require("kenburns-webgl");
var KenBurnsDOM = require("kenburns-dom");
var rectCrop = require("rect-crop");
var rectClamp = require("rect-clamp");

var Module = module.exports = {
  crop: rectCrop,
  clamp: rectClamp,
  mixin: KenBurnsCore.mixin,
  Canvas2D: KenBurnsCore.mixin(KenBurnsCanvas2D),
  WebGL: KenBurnsCore.mixin(KenBurnsWebGL),
  DOM: KenBurnsCore.mixin(KenBurnsDOM)
};

Module.Canvas = !!window.WebGLRenderingContext ? Module.WebGL : Module.Canvas2D;
