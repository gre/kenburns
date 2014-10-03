
// WebGL implementation

var vertexShaderSource =
"uniform vec2 imgRes;"+ // image size
"uniform vec2 pos;"+ // bound position
"uniform vec2 dim;"+ // bound size
"attribute vec2 p;"+
"varying vec2 uv;"+
"void main() {"+
  "uv = pos/imgRes + ((p * vec2(1.,-1.)+1.)/2.) * (dim/imgRes);"+
  "gl_Position = vec4(p,0.,1.);"+
"}";
var fragmentShaderSource =
"#ifdef GL_ES\n"+
"precision highp float;\n"+
"#endif\n"+
"uniform sampler2D img;"+
"uniform vec3 bg;"+
"varying vec2 uv;"+
"void main() {"+
  "if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)"+
    "gl_FragColor = vec4(bg, 1.0);"+
  "else "+
    "gl_FragColor = texture2D(img, uv);"+
"}";

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

  this.positionLocation = gl.getAttribLocation(program, "p");
  this.imgResL = gl.getUniformLocation(program, "imgRes");
  this.posL = gl.getUniformLocation(program, "pos");
  this.dimL = gl.getUniformLocation(program, "dim");
  this.bgL = gl.getUniformLocation(program, "bg");
  this.buffer = gl.createBuffer();
}
KenBurnsWebGLTrait.prototype = {
  runStart: function (image) {
    var gl = this.gl;
    var canvas = this.canvas;
    gl.useProgram(this.program);

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

    var positionLocation = this.positionLocation;
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(this.imgResL, image.width, image.height);
    gl.uniform3fv(this.bgL, this.rgb);

    var texture = this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

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
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteProgram(this.program);
  },
  getViewport: function () {
    return this.canvas;
  }
};

module.exports = KenBurnsWebGLTrait;
