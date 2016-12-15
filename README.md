# kenburns

**kenburns** provides a [Ken Burns Effect](https://en.wikipedia.org/wiki/Ken_Burns_effect) on an image.

Kenburns currently have implementations for **Canvas 2D**, **Canvas WebGL**, and vanilla **DOM**.

```sh
npm install --save kenburns
```

or [**standalone version**](https://unpkg.com/kenburns@latest/kenburns.js).

## Usage

You can specifically import only one implementation:

```js
import KenBurnsDOM from "kenburns/lib/DOM";
import KenBurnsWebGL from "kenburns/lib/WebGL";
import KenBurnsCanvas2D from "kenburns/lib/Canvas2D";
```

Or import them all (leads to more dependencies in your bundle):

```js
import KenBurns from "kenburns";
// KenBurns.DOM , KenBurns.WebGL , KenBurns.Canvas2D
// KenBurns.Canvas is also a variant that feature detect WebGL or Canvas2D
```

## [API](API.md)

Quick DOM example:

![](https://cloud.githubusercontent.com/assets/211411/21234525/4041de56-c2f3-11e6-8830-2a3cdeac89bb.gif)

```js
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
```

There is also `KenBurnsWebGL` (WebGL implementation) and `KenBurnsCanvas2D` (Canvas2D implementation).

## Example

- [source code](example)
- [website](http://kenburns.surge.sh/)
