
// Canvas 2D implementation

function KenBurnsCanvas2dTrait (canvas2d) {
  this.canvas = canvas2d;
  this.ctx = canvas2d.getContext("2d");
}
KenBurnsCanvas2dTrait.prototype = {
  draw: function (image, bound) {
    var viewport = [ 0, 0, this.canvas.width, this.canvas.height ];
    var ctx = this.ctx;
    ctx.fillStyle = "rgb("+this.rgb.map(function(x){ return x * 255; })+")";
    ctx.fillRect.apply(ctx, viewport);
    var params = normalizeDrawingParams(bound, viewport);
    ctx.drawImage.apply(ctx, [ image ].concat(params));
  },
  getViewport: function () {
    return this.canvas;
  }
};

function normalizeDrawingParams (bound, viewport) {
  // TODO implement for Firefox (more restrictive on out of bounds)
  // TODO rounding?
  // TODO external module
  var params = bound.concat(viewport);
  /*
  if (params[0] < 0) {
    params[4] -= params[0];
    //params[2] += params[0];
    params[6] += params[0];
    params[0] = 0;
  }
  if (params[1] < 0) {
    params[5] -= params[1];
    //params[3] += params[1];
    params[7] += params[1];
    params[1] = 0;
  }
  */
  return params;
}

module.exports = KenBurnsCanvas2dTrait;
