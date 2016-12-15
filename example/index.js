import KenBurnsDOM from "../lib/DOM";
import KenBurnsCanvas2D from "../lib/Canvas2D";
import KenBurnsWebGL from "../lib/WebGL";
import bezierEasing from "bezier-easing";
import rectCrop from "rect-crop";

// Utility to load an Image by url
const loadCrossOriginImage = src => new Promise((success, failure) => {
  let img = new window.Image();
  img.crossOrigin = true;
  img.onload = () => success(img);
  img.onabort = img.onerror = failure;
  img.src = src;
});

// Utility to create a promise resolved after a delay
const delay = ms => new Promise(success => setTimeout(success, ms));

// describe our loop example
const exampleImageUrl = "http://i.imgur.com/Uw2EQEk.jpg";
const crops = [
  rectCrop(0.4, [0.15, 0.38]),
  rectCrop(0.3, [0.8, 0.0]),
  rectCrop(0.1, [0.54, 0.47]),
  rectCrop(0.2, [0.81, 0.48]),
  rectCrop.largest,
];
const easings = [
  bezierEasing(0.6, 0, 1, 1),
  bezierEasing(0, 0, 1, 1),
  bezierEasing(0.8, 0, 0.2, 1),
  bezierEasing(0.5, 0, 1, 1),
  bezierEasing(0, 0, 0.6, 1),
];
const durations = [
  3000,
  2000,
  3000,
  2000,
  3000,
];
const delays = [
  800,
  300,
  0,
  1000,
  0,
];
const exampleAnimation =
  kenBurns => // for a given kenBurns instance (impl agnostic)
  source => // and the 'source' (image / texture, dep on the impl)
  crops.reduce((p, crop, i) => p.then(() => // chain all the steps
    kenBurns.animate( // animate kenburns
      source,
      crop,
      crops[(i + 1) % crops.length], // next crop spot
      durations[i],
      easings[i]
    )
    .then(() => delay(delays[i])) // wait a bit
  ), Promise.resolve()) // start with a resolved promise
  .then(() => exampleAnimation(kenBurns)(source)); // loop again

// DOM example
var div = document.createElement("div");
div.style.width = "400px";
div.style.height = "400px";
var kenBurnsDOM = new KenBurnsDOM(div);
loadCrossOriginImage(exampleImageUrl)
.then(exampleAnimation(kenBurnsDOM))
.catch(e => console.error("DOM implementation failure:", e));

// Canvas2D example
var canvas2d = document.createElement("canvas");
canvas2d.style.width = "400px";
canvas2d.style.height = "400px";
canvas2d.width = 800;
canvas2d.height = 800;
const ctx = canvas2d.getContext("2d");
var kenBurnsCanvas2d = new KenBurnsCanvas2D(ctx);
loadCrossOriginImage(exampleImageUrl)
.then(exampleAnimation(kenBurnsCanvas2d))
.catch(e => console.error("Canvas2D implementation failure:", e));

// WebGL example
import createTexture from "gl-texture2d";
var canvasWebGL = document.createElement("canvas");
canvasWebGL.style.width = "400px";
canvasWebGL.style.height = "400px";
canvasWebGL.width = 800;
canvasWebGL.height = 800;
const gl = canvasWebGL.getContext("webgl");
var kenBurnsCanvasWebGL = new KenBurnsWebGL(gl);
loadCrossOriginImage(exampleImageUrl)
.then(image => createTexture(gl, image))
.then(exampleAnimation(kenBurnsCanvasWebGL))
.catch(e => console.error("WebGL implementation failure:", e));

// append the example
const container = document.createElement("div");
Object.assign(container.style, {
  width: "400px",
  margin: "0 auto",
});
document.body.appendChild(container);
const title = t => {
  const h2 = document.createElement("h2");
  h2.innerHTML = t;
  return h2;
};
container.appendChild(title("KenBurnsDOM"));
container.appendChild(div);
container.appendChild(title("KenBurnsCanvas2D"));
container.appendChild(canvas2d);
container.appendChild(title("KenBurnsWebGL"));
container.appendChild(canvasWebGL);




import KenBurnsDOM from "kenburns/lib/DOM";
import rectCrop from "rect-crop";
import bezierEasing from "bezier-easing";
const image = new Image();
image.src = "http://i.imgur.com/Uw2EQEk.jpg";
image.onload = () => {
  var div = document.createElement("div");
  document.body.appendChild(div);
  div.style.width = "400px";
  div.style.height = "400px";
  var kenBurns = new KenBurnsDOM(div);
  kenBurns.animate(
    image,
    rectCrop(0.4, [0.15, 0.38]),
    rectCrop.largest,
    5000,
    bezierEasing(0.6, 0.0, 1.0, 1.0)
  );
};
