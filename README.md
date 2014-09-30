[![npm install kenburns](https://nodei.co/npm/kenburns.png?mini=true)](http://npmjs.org/package/kenburns)

**kenburns** provides a [Ken Burns Effect](https://en.wikipedia.org/wiki/Ken_Burns_effect) on an image.

API
---

The general API looks like this:

```javascript
var kenBurns = new KenBurns.Canvas(canvas);
var promise = kenBurns.run(image, fromBound, toBound, duration, easing);
promise.then(...).then(...)...;
```

**The first line creates a KenBurns object from a Canvas.**

> **N.B.:** Current implementation is only using Canvas2D so you must give a Canvas and initialize it to a dimension (see example.js).

**Then we start an animation with `kenBurns.run`.**
Here, you can easily customize the KenBurns effect with the different parameters:

- **image**: the Image() element to animate on.
- **fromBound**: an array of [ x, y, width, height ] which is the starting bound coordinate.
- **toBound**: an array of [ x, y, width, height ] which is the ending bound coordinate.
- **duration**: the duration in millisecond of the animation.
- **easing** *(optional)*: The easing function to use for the animation.
For the best customization, the use of [Bezier-Easing](https://npmjs.org/package/bezier-easing) is recommended.


**Finally, the returned value of run is a Promise** which allows you to chain multiple KenBurns
or any other effects (like [glsl-transition](https://npmjs.org/package/glsl-transition) for instance).

Run the example
---

```bash
npm run example
```
