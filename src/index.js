//@flow
import crop from "rect-crop";
import Canvas2D from "./Canvas2D";
import WebGL from "./WebGL";
import DOM from "./DOM";
export {
  Canvas2D,
  WebGL,
  DOM,
  /**
   * `import crop from `[`"react-crop"`](https://www.npmjs.com/package/rect-crop)`;`
   *
   * To ease the process of providing fromCrop and endCrop, `crop` is a helper that that computes the absolute croping rectangle for a given center and zoom.

   @param zoomRatio: The first parameter is the **zoom ratio**. (this zoom ratio must be in `]0.0, 1.0]` range) *For instance, 1.0 display the full image size, 0.01 display a very tiny part of the image*.
  @param center: The second parameter is the **center** of the effect (the [w,h] components are in percentage from 0.0 to 1.0). This parameter is optional, if not provided, the center is used.

   @example
   var from = crop(1.0, [0.5, 0.5]);
   var to = crop(0.2, [0.8, 0.5]);
   kenBurns.animate(img, from, to, 4000);
   // Checkout also this special value: `crop.largest`
   */
  crop,
};
