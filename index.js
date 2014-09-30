var Q = require("q");
var requestAnimationFrame = require("raf");
var now = require("performance-now");

function identity (x) {
  return x;
}

function interpolate (a, b, p) {
  return a * (1-p) + b * p;
}

function interpolateBound (a, b, p) {
  return [
    interpolate(a[0], b[0], p),
    interpolate(a[1], b[1], p),
    interpolate(a[2], b[2], p),
    interpolate(a[3], b[3], p)
  ];
}

function KenBurnsAbortedError (message) {
  this.message = message;
  this.stack = (new Error()).stack;
}
KenBurnsAbortedError.prototype = new Error();
KenBurnsAbortedError.prototype.name = "KenBurnsAbortedError";

// KenBurns abstract implementation. requires a draw() function.

function KenBurns () {
  this.animationDefer = null;
}
KenBurns.prototype = {
  /**
   * a CropBound is an [x, y, width, height] array describing the area to crop in pixels.
   * 
   * The Ken Burns Effect will animate image from fromCropBound to toCropBound with a given duration and easing function.
   *
   * image MUST be loaded.
   */
  run: function (image, fromCropBound, toCropBound, duration, easing) {
    if (!easing) easing = identity;
    var self = this;
    var start = now();
    var d = Q.defer();
    self.animationDefer = d;
    (function render () {
      if (self.animationDefer !== d) return;
      try {
        var p = Math.min((now() - start) / duration, 1);
        var bound = interpolateBound(fromCropBound, toCropBound, easing(p));
        if (p < 1) {
          requestAnimationFrame(render);
        }
        else {
          d.resolve(image);
          self.animationDefer = null;
        }
        self.draw(image, bound);
      }
      catch (e) {
        d.reject(e);
        self.animationDefer = null;
      }
    }());
    return d.promise;
  },

  abort: function () {
    if (this.animationDefer) {
      this.animationDefer.reject(new KenBurnsAbortedError("KenBurns aborted by user."));
      this.animationDefer = null;
    }
  }
};

// Canvas 2D implementation

function KenBurnsCanvas2dTrait (canvas2d) {
  this.canvas = canvas2d;
  this.ctx = canvas2d.getContext("2d");
}
KenBurnsCanvas2dTrait.prototype = {
  draw: function (image, bound) {
    this.canvas.width = this.canvas.width;
    var params = [ image ].concat(bound).concat([ 0, 0, this.canvas.width, this.canvas.height ]);
    this.ctx.drawImage.apply(this.ctx, params);
  }
};


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

module.exports = {
  Canvas: mixin(KenBurnsCanvas2dTrait),
  mixin: mixin
};
