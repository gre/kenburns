//@flow
import cssRgba from "./utils/cssRgba";
import KenBurnsBase from "./Base";
import type {Bound, WidthHeight} from "./Base";

type Source = HTMLElement | Image;

/**
  * DOM Kenburns effect.
  *
  * **Supported source:** any HTML Element or an `Image`.
  *
  * NB: the container & source DOM element style are getting mutated by KenBurnsDOM. Make sure you don't alter them while performing the effect.
  *
  *
  * @example
  *
  * import KenBurnsDOM from "kenburns/lib/DOM";
  * var div = document.createElement("div");
  * div.style.width = "400px";
  * div.style.height = "400px";
  * const kenBurnsDOM = new KenBurnsDOM(div);
  * // kenBurnsDOM.animate(...).then(...);
  * // kenBurnsDOM.animateStep(...);
  */
export default class KenBurnsDOM extends KenBurnsBase<Source> {
  container: HTMLElement;
  source: HTMLElement;
  _currentBackgroundColorStyle: ?string;
  /**
   * Create a DOM KenBurns with a container element (block element recommended).
   */
  constructor (container: HTMLElement) {
    super();
    this.container = container;
    this._currentBackgroundColorStyle = container.style.backgroundColor;
    // At least we need relative
    if (container.style.position !== "absolute") {
      container.style.position = "relative";
    }
    container.style.overflow = "hidden";
  }
  getViewport () {
    return this.container.getBoundingClientRect();
  }
  getSourceSize (source: Source): WidthHeight {
    return source instanceof Image || source instanceof HTMLImageElement
    ? source
    : source.getBoundingClientRect();
  }
  draw (source: Source, rect: Bound) {
    if (source !== this.source) {
      this.container.innerHTML = "";
      this.container.appendChild(source);
      source.style.position = "absolute";
      source.style.willChange = "transform"; // already supported by some browsers, ensures GPU acceleration
      source.style.top = "0px";
      source.style.left = "0px";
      source.style.transformOrigin = "0% 0%";
      this.source = source;
    }
    const backgroundColor = cssRgba(this.background);
    if (backgroundColor !== this._currentBackgroundColorStyle) {
      this._currentBackgroundColorStyle = backgroundColor;
      this.container.style.backgroundColor = backgroundColor;
    }
    const viewport = this.getViewport();
    const scale = (viewport.width / rect[2]).toFixed(4); // no need to handle the height dimension because ratio is preserved
    const translate = (-rect[0]).toFixed(2)+"px,"+(-rect[1]).toFixed(2)+"px";
    this.source.style.transform = "scale("+scale+") translate("+translate+") translateZ(0)"; // translateZ triggers GPU acceleration
  }
}
