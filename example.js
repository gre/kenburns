var KenBurns = require(".");
var Qimage = require("qimage");

var canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 400;
document.body.appendChild(canvas);

var kenBurns = new KenBurns.Canvas(canvas);

var images = [ "http://i.imgur.com/YTq74uc.jpg", "http://i.imgur.com/6YSZBTf.jpg" ];

Qimage.anonymously(images[1])
  .then(function (img) {
    return kenBurns.run(img, [950, 650, 2*600, 2*400], [0, 0, img.width, img.height], 4000);
  })
  .delay(1000) // Here we could do a transition e.g; with GLSL Transitions :-)
  .thenResolve(Qimage.anonymously(images[0]))
  .then(function (img) {
    return kenBurns.run(img, [0, 1200, 4*600, 4*400], [1600, 1600, 1*600, 1*400], 4000, function (x) { return x * x; });
  })
  .done();
