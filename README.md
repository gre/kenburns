# kenburns

**kenburns** provides a [Ken Burns Effect](https://en.wikipedia.org/wiki/Ken_Burns_effect) on an image.

Kenburns currently have implementations for **Canvas 2D**, **Canvas WebGL**, and vanilla **DOM**.

```sh
npm install --save kenburns
```

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
