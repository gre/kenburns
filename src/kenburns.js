var Q = require("q");
var requestAnimationFrame = require("raf");
var now = require("performance-now");
var rectClamp = require("rect-clamp");
var rectMix = require("rect-mix");

// KenBurns abstract implementation.
// abstract functions to implement:
// - a draw() function.
// - a getViewport() function. returns an object with {width,height}. (returning a canvas works)

function KenBurns () {
  this.animationDefer = null;
  this.clamped = true;
  this.rgb = [ 0, 0, 0 ]; // in percentage convention
}

KenBurns.prototype = {
  // Can be overrided by implementations
  runStart: noop,
  runEnd: noop,
  destroy: noop,

  getBound: function (cropBound, image) {
    var bnds = typeof cropBound === "function" ? cropBound(this.getViewport(), image) : cropBound;
    if (this.clamped) bnds = rectClamp(bnds, [ 0, 0, image.width, image.height ]);
    return bnds;
  },

  setClamped: function (c) {
    this.clamped = c;
    return this;
  },

  setRGB: function (rgb) {
    this.rgb = rgb;
    return this;
  },

  /**
   * Draw the image one time.
   */
  one: function (image, crop) {
    var boundCrop = this.getBound(crop, image);
    this.runStart(image, boundCrop, boundCrop, 0);
    this.draw(image, boundCrop);
    this.runEnd();
    return image;
  },

  /**
   * The Ken Burns Effect will animate image from fromCropBound to toCropBound with a given duration and easing function.
   *
   * image MUST be loaded.
   */
  run: function (image, startCrop, endCrop, duration, easing) {
    if (!image) invalidArgument(image, "image is required.");
    if (!duration || isNaN(duration)) invalidArgument(duration, "duration is required and must be a number.");
    if (!easing) easing = identity;
    if (typeof easing !== "function") invalidArgument(easing, "easing must be a function.");
    var self = this;
    var start = now();
    var d = Q.defer();
    var fromCropBound = this.getBound(startCrop, image);
    var toCropBound = this.getBound(endCrop, image);

    var startEndCropReason = "startCrop and endCrop are required and must be a bound array or a function returning a bound array.";

    if (!(fromCropBound instanceof Array) || fromCropBound.length !== 4)
      invalidArgument(startCrop, startEndCropReason);
    if (!(toCropBound instanceof Array) || toCropBound.length !== 4)
      invalidArgument(endCrop, startEndCropReason);

    self.runStart.apply(self, arguments);
    d.promise.then(self.runEnd.bind(self)).done();
    self.animationDefer = d;
    (function render () {
      if (self.animationDefer !== d) return;
      try {
        var p = Math.min((now() - start) / duration, 1);
        var bound = rectMix(fromCropBound, toCropBound, easing(p));
        if (self.clamped) bound = rectClamp(bound, [ 0, 0, image.width, image.height ]);
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

  onePartial: function (crop) {
    var self = this;
    return function (image) {
      return self.one(image, crop);
    };
  },
  runPartial: function (startCrop, endCrop, duration, easing) {
    var self = this;
    return function (image) {
      return self.run.call(self, image, startCrop, endCrop, duration, easing);
    };
  },

  abort: function () {
    if (this.animationDefer) {
      this.animationDefer.reject(new KenBurnsAbortedError("KenBurns aborted by user."));
      this.animationDefer = null;
    }
  }
};

function identity (x) {
  return x;
}

function noop (){}


function invalidArgument (value, reason) {
  console.error(value, "<- "+reason);
  throw new Error(reason);
}

function KenBurnsAbortedError (message) {
  this.message = message;
  this.stack = (new Error()).stack;
}
KenBurnsAbortedError.prototype = new Error();
KenBurnsAbortedError.prototype.name = "KenBurnsAbortedError";

module.exports = KenBurns;
