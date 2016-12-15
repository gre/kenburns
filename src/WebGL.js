//@flow
import createShader from "gl-shader";
import KenBurnsBase from "./Base";
import type { Bound } from "./Base";

const vert = `
varying vec2 uv;
attribute vec2 p;
uniform vec2 imgRes;
uniform vec2 pos;
uniform vec2 dim;
void main() {
  uv = pos/imgRes + ((p * vec2(1.,-1.)+1.)/2.) * (dim/imgRes);
  gl_Position = vec4(p,0.,1.);
}`;
const frag = `
precision highp float;
varying vec2 uv;
uniform sampler2D img;
uniform vec4 bg;
void main() {
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)
    gl_FragColor = bg;
  else
    gl_FragColor = texture2D(img, uv);
}`;

type Texture = {
  bind: ()=>number,
  shape: Array<number>,
};

/**
 * WebGL KenBurns implementation.
 *
 * **supported source:** a `gl-texture2d` instance. (or an object with a bind() function and shape array)
 *
 * @example
 *
 * import KenBurnsWebGL from "kenburns/lib/WebGL";
 * var canvasWebGL = document.createElement("canvas");
 * canvasWebGL.style.width = "400px";
 * canvasWebGL.style.height = "400px";
 * canvasWebGL.width = 800;
 * canvasWebGL.height = 800;
 * const gl = canvasWebGL.getContext("webgl");
 * const kenBurnsWebGL = new KenBurnsWebGL(gl);
 * // import createTexture from "gl-texture2d";
 * // const texture = createTexture(gl, ...);
 * // kenBurnsWebGL.animate(texture, ...).then(...);
 * // kenBurnsWebGL.animateStep(texture, ...);
 */
export default class KenBurnsWebGL extends KenBurnsBase<Texture> {
  canvas: HTMLCanvasElement;
  gl: ?WebGLRenderingContext;
  shader: any;
  buffer: WebGLBuffer;
  /**
   * Create a KenBurnsWebGL with a WebGL Context.
   */
  constructor (gl: WebGLRenderingContext) {
    super();
    this.gl = gl;
    this.shader = createShader(gl, vert, frag);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
        1.0, -1.0,
        1.0,  1.0]),
      gl.STATIC_DRAW);
  }
  /**
   * clean up object created by the implementation. This allows to potentially continue using the WebGL Canvas for other things.
   */
  dispose () {
    const {gl} = this;
    if (!gl) return;
    if (this.shader) this.shader.dispose();
    gl.deleteBuffer(this.buffer);
    this.gl = null;
    this.shader = null;
    this.buffer = null;
  }
  draw (texture: Texture, bound: Bound) {
    var gl = this.gl;
    if (!gl) return;
    var shader = this.shader;
    var x = bound[0];
    var y = bound[1];
    var w = bound[2];
    var h = bound[3];
    shader.bind();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    shader.attributes.p.pointer();
    shader.uniforms.img = texture.bind();
    shader.uniforms.imgRes = texture.shape.slice(0, 2);
    shader.uniforms.bg = this.background;
    shader.uniforms.pos = [ x, y ];
    shader.uniforms.dim = [ w, h ];
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  getViewport () {
    const {gl} = this;
    if (!gl) return { width: 0, height: 0 };
    return {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight
    };
  }
  getSourceSize (texture: Texture) {
    const [width, height] = texture.shape;
    return { width, height };
  }
}
