//@flow
import rectClamp from "rect-clamp";
import rectMix from "rect-mix";
import invariant from "invariant";
import raf from "raf";

/**
 * An array of [x, y, width, height]
 * @type {Array}
 */
type Bound = [ number, number, number, number ];

/**
 * A background color as an array of 0..1 numbers.
 * @type {Array}
 */
type RGBA = [ number, number, number, number ];

/**
 * An object with a width and height property.
 * @type {Object}
 */
type WidthHeight = {
  width: number,
  height: number
};

/**
 * A function that returns a bound crop for a given viewport and source size.
 */
type CropFunc = (viewport: WidthHeight, sourceSize: WidthHeight) => Bound;

/**
 * An easing function.
 */
type EasingFunc = (x: number) => number;

const clamp = (bound: Bound, sourceSize: WidthHeight): Bound =>
  rectClamp(bound, [ 0, 0, sourceSize.width, sourceSize.height ]);

const identity = <A>(x: A): A => x;

/**
 * KenBurns base class. 2 methods must be implemented: `draw()` and `getViewport()`.
 *
 * @property {boolean} clamped guarantees the rendering never goes out of bound. *(default: `true`)*.
 * @property {RGBA} background background color as an Array of 4 numbers (in 0..1 range). *(default: `[0,0,0,0]`, transparent)*
 */
export default class KenBurnsBase<Source> {
  clamped: boolean = true;
  background: RGBA = [0,0,0,0];

  /**
   * Start a KenBurns animation on `source` in a loop for the next `duration` milliseconds from `fromCrop` to `toCrop` with given `easing` function.
   * > `source` MUST be ready (e.g. image loaded) before calling `animate`.
   * Also, the animation is not interruptable, For better controls, please use `animateStep()`.
   *
   * @param source, the source to animate (the type depends on implementation, refer to implementation 'supported source')
   * @param fromCrop, an array of `[ x, y, width, height ]` which is the starting bound absolute coordinate. **OR** a `(viewportSize,imageSize)=>Bound` which returns this array *(the viewportSize and imageSize parameters have width and height fields)*. `KenBurns.crop()` provide such a function.
   * @param toCrop, same as `startCrop` but for the ending bound coordinate.
   * @param duration, the duration in millisecond of the animation.
   * @param easing, The easing function to use for the animation. We recommend the use of [Bezier-Easing](https://npmjs.org/package/bezier-easing).
   * @return a Promise that is resolved when the animation ends.
   */
  animate (
    source: Source,
    fromCrop: CropFunc | Bound,
    toCrop: CropFunc | Bound,
    duration: number,
    easing: EasingFunc = identity
  ): Promise<Source> {
    invariant(source, "source is required. Got: %s", source);
    invariant(duration && !isNaN(duration), "duration is required and must be a number. Got: %s", duration);
    invariant(typeof easing === "function", "easing must be a function. Got: %s", easing);
    return new Promise(resolve => {
      let start;
      const render = (now: number) => {
        if (!start) start = now;
        var p = Math.min((now - start) / duration, 1);
        if (p < 1) {
          raf(render);
        }
        else {
          resolve(source);
        }
        this.animateStep(source, fromCrop, toCrop, easing(p));
      };
      raf(render);
    });
  }

  /**
   * Perform a single frame of a Kenburns animation on `source` from `fromCrop` to `toCrop` with a `progress` interpolation value.
   * > `animateStep` provides a better rendering control than `animate` but also is low level. It's up to you to handle the animation loop.
   *
   * @param source (same as in `animate`)
   * @param fromCrop (same as in `animate`)
   * @param toCrop (same as in `animate`)
   * @param progress the interpolation value from 0 to 1.
   */
  animateStep (
    source: Source,
    fromCrop: CropFunc | Bound,
    toCrop: CropFunc | Bound,
    progress: number
  ): void {
    const sourceSize = this.getSourceSize(source);
    const viewport = this.getViewport();
    const applyClamp = this.clamped ? clamp : identity;
    const fromCropBound = applyClamp(typeof fromCrop==="function" ? fromCrop(viewport, sourceSize) : fromCrop, sourceSize);
    const toCropBound = applyClamp(typeof toCrop==="function" ? toCrop(viewport, sourceSize) : toCrop, sourceSize);
    let bound = applyClamp(rectMix(fromCropBound, toCropBound, progress), sourceSize);
    if (isNaN(bound[0])) {
      invariant(false, `NaN value found in bound=(${String(bound)}). Something was wrong for animateStep(${String(source)},(${String(fromCropBound)}),(${String(toCropBound)}),${progress}) sourceSize=(${sourceSize.width},${sourceSize.height}) viewport=(${viewport.width},${viewport.height})`);
    }
    this.draw(source, bound);
  }

  /**
   * **(abstract method)** Draw the source cropped to a given rectangle bound.
   */
  +draw: (source: Source, rect: Bound) => void;

  /**
   * **(abstract method)** Get and object with width and height of the container.
   */
  +getViewport: () => WidthHeight;

  /**
   * **(abstract method)** Get source size.
   */
  +getSourceSize: (source: Source) => WidthHeight;
}

export type { Bound, RGBA, WidthHeight, CropFunc, EasingFunc };
