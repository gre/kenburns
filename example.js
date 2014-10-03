var KenBurns = require(".");
var Qimage = require("qimage");

var canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

var kenBurns = new KenBurns.Canvas(canvas);

var images = [ "http://i.imgur.com/6YSZBTf.jpg", "http://i.imgur.com/YTq74uc.jpg" ];

Qimage.anonymously(images[0])
  .then(kenBurns.runPartial(KenBurns.crop(0.2), KenBurns.crop(1.0), 4000))
  .delay(1000)
  .thenResolve(Qimage.anonymously(images[1]))
  .then(kenBurns.runPartial(KenBurns.crop.largest, KenBurns.crop(0.2, [3250/4200, 780/2800]), 4000, function (x) { return x * x; }))
  .done();
