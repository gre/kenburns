
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

module.exports = KenBurnsCanvas2dTrait;
