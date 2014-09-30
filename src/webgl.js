
// WebGL implementation

var vertexShaderSource = ""+
"uniform vec2 res;"+ // canvas size
"uniform vec2 imgRes;"+ // image size
"uniform vec2 pos;"+ // bound position
"uniform vec2 dim;"+ // bound size
"attribute vec2 p;"+
"varying vec2 uv;"+
"void main() {"+
  "uv = (p * vec2(1.0, -1.0)+1.0)/2.0;"+
  "uv = pos/imgRes + uv * (dim/imgRes);"+
  "gl_Position = vec4(p, 0.0, 1.0);"+
"}";
var fragmentShaderSource = ""+
"#ifdef GL_ES\n"+
"precision highp float;\n"+
"#endif\n"+
"uniform sampler2D img;"+
"varying vec2 uv;"+
"void main() {"+
  "gl_FragColor = texture2D(img, uv);"+
"}"+
"";

function KenBurnsWebGLTrait (canvas) {
  this.canvas = canvas;
  var gl = this.gl = canvas.getContext("webgl");


  var program = this.program = gl.createProgram();

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  gl.attachShader(program, vertexShader);

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  gl.useProgram(program);

  var positionLocation = gl.getAttribLocation(program, "p");
  this.resL = gl.getUniformLocation(program, "res");
  this.imgResL = gl.getUniformLocation(program, "imgRes");
  this.posL = gl.getUniformLocation(program, "pos");
  this.dimL = gl.getUniformLocation(program, "dim");

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
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
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}
KenBurnsWebGLTrait.prototype = {
  runStart: function (image) {
    var gl = this.gl;
    var canvas = this.canvas;
    gl.useProgram(this.program);

    gl.uniform2f(this.imgResL, image.width, image.height);
    gl.uniform2f(this.resL, canvas.width, canvas.height);

    var texture = this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  },
  runEnd: function () {
    this.gl.deleteTexture(this.texture);
  },
  draw: function (image, bound) {
    var gl = this.gl;
    gl.uniform2f(this.posL, bound[0], bound[1]);
    gl.uniform2f(this.dimL, bound[2], bound[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  },
  destroy: function () {
    this.gl.deleteProgram(this.program);
  }
};

module.exports = KenBurnsWebGLTrait;
