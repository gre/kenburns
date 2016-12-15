//@flow
import drawImageNormalized from "draw-image-normalized";
import cssRgba from "./utils/cssRgba";
import KenBurnsBase from "./Base";
import type { Bound } from "./Base";

type DrawableElement = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;

/**
 * Canvas2D KenBurns implementation.
 *
 * **supported source:** Image | Video | Canvas2D
 *
 * @example
 *
 * import KenBurnsCanvas2D from "kenburns/lib/Canvas2D";
 * var canvas2d = document.createElement("canvas");
 * canvas2d.style.width = "400px";
 * canvas2d.style.height = "400px";
 * canvas2d.width = 800;
 * canvas2d.height = 800;
 * const ctx = canvas2d.getContext("2d");
 * const kenBurnsCanvas2d = new KenBurnsCanvas2D(ctx);
 * // kenBurnsCanvas2d.animate(...).then(...);
 * // kenBurnsCanvas2d.animateStep(...);
 */
export default class KenBurnsCanvas2D extends KenBurnsBase<DrawableElement> {
  ctx: CanvasRenderingContext2D;
  /**
   * Create a Canvas2D KenBurns with a Canvas 2D Context.
   *
   */
  constructor (ctx: CanvasRenderingContext2D) {
    super();
    this.ctx = ctx;
  }
  draw (image: DrawableElement, rect: Bound) {
    const {ctx, background} = this;
    const viewport = [ 0, 0, ctx.canvas.width, ctx.canvas.height ];
    if (background[3]!==1) {
      ctx.clearRect.apply(ctx, viewport);
    }
    if (background[3]!==0) {
      ctx.fillStyle = cssRgba(this.background);
      ctx.fillRect.apply(ctx, viewport);
    }
    drawImageNormalized.apply(null, [ ctx, image ].concat(rect).concat(viewport));
  }
  getViewport () {
    return this.ctx.canvas;
  }
  getSourceSize (source: DrawableElement) {
    if (source instanceof HTMLVideoElement) {
      const { videoWidth, videoHeight } = source;
      return {
        width: videoWidth,
        height: videoHeight,
      };
    }
    return source; // other case is a valid object that have {width,height}
  }
}
