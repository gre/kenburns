var KenBurns = require("..");
var Q = require("q");
var Qimage = require("qimage");
var GlslTransition = require("glsl-transition");

var div = document.createElement("div");
document.body.appendChild(div);

function display (elt) {
  var child = div.children[0];
  if (child) div.removeChild(child);
  div.appendChild(elt);
}

function displayF (elt) {
  return function (o) {
    display(elt);
    return o;
  };
}

var W = 640;
var H = 480;

var canvasTransition = document.createElement("canvas");
canvasTransition.width = W;
canvasTransition.height = H;

var canvas1 = document.createElement("canvas");
canvas1.width = W;
canvas1.height = H;

var canvas2 = document.createElement("canvas");
canvas2.width = W;
canvas2.height = H;

var fade = GlslTransition(canvasTransition)("#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D from, to;uniform float progress;uniform vec2 resolution;void main() {vec2 p = gl_FragCoord.xy / resolution.xy;gl_FragColor = mix(texture2D(from, p), texture2D(to, p), progress);}");
var kenBurns1 = new KenBurns.Canvas2D(canvas1);
var kenBurns2 = new KenBurns.Canvas2D(canvas2);

Q.all([
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Robert_Edward_Lee.jpg/692px-Robert_Edward_Lee.jpg",
  "http://upload.wikimedia.org/wikipedia/commons/2/2e/George_Gordon_Meade.jpg",
  "http://upload.wikimedia.org/wikipedia/commons/6/69/Battle_of_Gettysburg%2C_by_Currier_and_Ives.png",
  "http://upload.wikimedia.org/wikipedia/commons/3/33/Battle_of_Gettysburg.jpg"
].map(Qimage.anonymously))
.then(function (images) {
  var battleSteps = [
    KenBurns.crop(0.3, [0.15, 0.5]),
    KenBurns.crop(0.3, [0.5, 0.3]),
    KenBurns.crop(0.3, [0.5, 0.5]),
    KenBurns.crop(0.4, [0.6, 0.8]),
    KenBurns.crop.largest
  ];

  return Q(images[0])
  .then(displayF(canvas1))
  .then(kenBurns1.runPartial(KenBurns.crop(1, [0.5, 0.15]), KenBurns.crop(0.5, [0.5, 0.15]), 1000))
  .delay(0)
  /*
  .then(kenBurns1.runPartial(KenBurns.crop(1, [0.5, 0.15]), KenBurns.crop(0.5, [0.5, 0.15]), 5000))
  .delay(4000)
  */
  .thenResolve(canvas1)
  .then(function () {
    display(canvasTransition);
    return Q.all([
      kenBurns2.setClamped(false).run(images[1], KenBurns.crop(1.4, [0.5, 0.2]), KenBurns.crop(0.6, [0.5, 0.2]), 6000),
      fade({ from: canvas1, to: canvas2 }, 2000).then(displayF(canvas2))
    ]);
  })
  .delay(4000)
  .thenResolve(images[2])
  .then(kenBurns1.onePartial(battleSteps[0]))
  .then(displayF(canvas1))
  .delay(2000)
  .then(kenBurns1.runPartial(battleSteps[0], battleSteps[1], 400))
  .delay(2000)
  .then(kenBurns1.runPartial(battleSteps[1], battleSteps[2], 400))
  .delay(2000)
  .then(kenBurns1.runPartial(battleSteps[2], battleSteps[3], 400))
  .delay(2000)
  .then(kenBurns1.runPartial(battleSteps[3], battleSteps[4], 400))
  .delay(2000)
  .then(function () {
    display(canvasTransition);
    return fade({ from: canvas1, to: images[3] }, 2000);
  })
  .thenResolve(images[3])
  .then(kenBurns2.onePartial(KenBurns.crop.largest))
  .then(displayF(canvas2))
  .delay(1000)
  .then(kenBurns2.runPartial(KenBurns.crop.largest, KenBurns.crop(0.4, [0.7, 0.7]), 2000))
  ;
})
.done();
