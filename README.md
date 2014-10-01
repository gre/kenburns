[![npm install kenburns](https://nodei.co/npm/kenburns.png?mini=true)](http://npmjs.org/package/kenburns)

**kenburns** provides a [Ken Burns Effect](https://en.wikipedia.org/wiki/Ken_Burns_effect) on an image.

API
---

The general API looks like this:

```javascript
var kenBurns = new KenBurns.Canvas(canvas);
var promise = kenBurns.run(image, startCrop, endCrop, duration, easing);
promise.then(...).then(...)...;
```

**The first line creates a KenBurns object from a Canvas.**

> N.B.: a `new KenBurns.Canvas` will try to use WebGL implementation and fallback on Canvas2D implementation if not supported.
You can explicitely use a `new KenBurns.Canvas2D` or a `new KenBurns.WebGL`.

**Then we start an animation with `kenBurns.run`.**
Here, you can easily customize the KenBurns effect with the different parameters:

- **image**: the Image() element to animate on.
- **startCrop**: 
  - an array of `[ x, y, width, height ]` which is the starting bound absolute coordinate.
  - **OR** a `function(viewportSize,imageSize)` which returns this array *(the viewportSize and imageSize parameters have width and height fields)*.
- **endCrop**: same as `startCrop` but for the ending bound coordinate.
- **duration**: the duration in millisecond of the animation.
- **easing** *(optional)*: The easing function to use for the animation.
For the best customization, the use of [Bezier-Easing](https://npmjs.org/package/bezier-easing) is recommended.

**Finally, the returned value of run is a Promise** which allows you to chain multiple KenBurns
or any other effects (like [glsl-transition](https://npmjs.org/package/glsl-transition) for instance).

Utility to compute the CropBound
---

Because it is not easy to give an absolute crop bound for the `startCrop` and `endCrop`,
`kenburns` also provides a "crop" function which helps you computing a bound from some relative parameters.

```javascript
var boundFunction1 = KenBurns.crop(1.0, [0.5, 0.5]);
var boundFunction2 = KenBurns.crop(0.2, [0.8, 0.5]);
```

- The first parameter is the **zoom ratio**. (this zoom ratio must be in `]0.0, 1.0]` range) *For instance, 1.0 display the full image size, 0.01 display a very tiny part of the image*.
- The second parameter is the **center** of the effect (the [w,h] components are in percentage from 0.0 to 1.0). This parameter is optional, if not provided, the center is used.

You can directly use the crop result in parameter of the `run` function:

```javascript
  kenBurns.run(img, KenBurns.crop([0.8, 0.5], 0.2), KenBurns.crop([0.5, 0.5], 1.0), 4000);
```

Utility to simplify the use with Promise chain
---

runPartial is an alternative signature to the use of run:

```javascript
imagePromise
  .then(function (image) {
    kenBurns.run(image, startCrop, endCrop, duration, easing);
  });
```

can be rewritten as:

```javascript
imagePromise
  .then(kenBurns.runPartial(startCrop, endCrop, duration, easing));
```

Run the example
---

```bash
npm run example
```
