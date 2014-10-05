var drawImageNormalized = require("draw-image-normalized");

// Canvas 2D implementation

function KenBurnsCanvas2dTrait (canvas2d) {
  this.canvas = canvas2d;
  this.ctx = canvas2d.getContext("2d");
}
KenBurnsCanvas2dTrait.prototype = {
  draw: function (image, rect) {
    var viewport = [ 0, 0, this.canvas.width, this.canvas.height ];
    var ctx = this.ctx;
    ctx.fillStyle = "rgb("+this.rgb.map(function(x){ return x * 255; })+")";
    ctx.fillRect.apply(ctx, viewport);
    drawImageNormalized.apply(null, [ ctx, image ].concat(rect).concat(viewport));
  },
  getViewport: function () {
    return this.canvas;
  }
};

module.exports = KenBurnsCanvas2dTrait;
