var Q = require("q");
var requestAnimationFrame = require("raf");
var now = require("performance-now");

// KenBurns abstract implementation.
// abstract functions to implement:
// - a draw() function.
// - a getViewport() function. returns an object with {width,height}. (returning a canvas works)

function KenBurns () {
  this.animationDefer = null;
}

KenBurns.prototype = {
  // Can be overrided by implementations
  runStart: noop,
  runEnd: noop,
  destroy: noop,

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
    var fromCropBound = typeof startCrop === "function" ? startCrop(this.getViewport(), image) : startCrop;
    var toCropBound = typeof endCrop === "function" ? endCrop(this.getViewport(), image) : endCrop;

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
        var bound = clampedBound(interpolateBound(fromCropBound, toCropBound, easing(p)), image.width, image.height);
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

function clampedBound (bound, maxWidth, maxHeight) {
  var w = bound[2], h = bound[3];
  var ratio = w / h;
  if (w > maxWidth) {
    w = maxWidth;
    h = ~~(w / ratio);
  }
  if (h > maxHeight) {
    h = maxHeight;
    w = ~~(h * ratio);
  }
  return [
    Math.max(0, Math.min(bound[0], maxWidth-w)),
    Math.max(0, Math.min(bound[1], maxHeight-h)),
    w,
    h
  ];
}

function invalidArgument (value, reason) {
  console.error(value, "<- "+reason);
  throw new Error(reason);
}

function interpolate (a, b, p) {
  return a * (1-p) + b * p;
}

function interpolateBound (a, b, p) {
  var bound = [];
  for (var i=0; i<4; ++i)
    bound[i] = ~~(interpolate(a[i], b[i], p));
  return bound;
}

function KenBurnsAbortedError (message) {
  this.message = message;
  this.stack = (new Error()).stack;
}
KenBurnsAbortedError.prototype = new Error();
KenBurnsAbortedError.prototype.name = "KenBurnsAbortedError";

module.exports = KenBurns;
