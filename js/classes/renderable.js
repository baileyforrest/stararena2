/**
 * renderable.js
 *
 * Renderable object
 */

/* global Util */

/**
 * Class for any renderable object.
 *
 * To use the same shaders, a class can simply replace vertices, colors, and
 * indices and override initBuffers to use the new values
 *
 * @class
 */
var Renderable;

(function () {
  "use strict";

  var VERTICES = [
    1.0,  0.0,  0.0,
    -1.0, 1.0,  0.0,
    -1.0, -1.0,  0.0,
  ];

  var COLORS = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];

  var INDICES = [
    0, 1, 2
  ];

  var vertexShaderPath = "assets/glsl/basic_vertex.glsl";
  var fragmentShaderPath = "assets/glsl/basic_fragment.glsl";

  Renderable = function (params) {
    this.position = vec3.fromValues(0.0, 0.0, 0.0);
    this.rotation = 0.0;
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);

    this.initView();

    if (!params) {
      return;
    }

    if (params.position) {
      this.position = vec3.clone(params.position);
    }

    if (params.rotation) {
      this.rotation = params.rotation;
    }

    if (params.scale) {
      this.scale = vec3.clone(params.scale);
    }
  };

  Renderable.prototype.initView = function () {
    this.initBuffers();
    this.initShaders();
  };

  Renderable.prototype.initBuffers = function () {
    this.initBuffersParams(Renderable, VERTICES, COLORS, INDICES);
  };

  Renderable.vertexPositionBuffer = null;
  Renderable.vertexColorBuffer = null;
  Renderable.vertexIndexBuffer = null;

  Renderable.prototype.initBuffersParams =
    function (thisClass, vertices, colors, indices) {


    // Ensure that the class only has one copy of the buffers
    if (thisClass.vertexPositionBuffer) {
      this.vertexPositionBuffer = thisClass.vertexPositionBuffer;
      this.vertexColorBuffer = thisClass.vertexColorBuffer;
      this.vertexIndexBuffer = thisClass.vertexIndexBuffer;
      return;
    }
    console.log("INITALIZING RENDERABLE BUFFERS");

    // Vertex Position Buffer
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW
    );

    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = vertices.length / 3;


    // Vertex Color Buffer
    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = colors.length / 4;


    // Vertex Index Buffer
    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW
    );
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = indices.length / 1;

    thisClass.vertexPositionBuffer = this.vertexPositionBuffer;
    thisClass.vertexColorBuffer = this.vertexColorBuffer;
    thisClass.vertexIndexBuffer = this.vertexIndexBuffer;

  };

  Renderable.prototype.initShaders = function () {
    this.initShadersPath(Renderable, vertexShaderPath, fragmentShaderPath);
  };

  Renderable.shaderProgram = null;

  Renderable.prototype.initShadersPath =
    function (thisClass, vertexShaderPath, fragmentShaderPath) {

    if (thisClass.shaderProgram) {
      this.shaderProgram = thisClass.shaderProgram;
      return;
    }

    var self = this;

    Util.loadFiles(
      [vertexShaderPath, fragmentShaderPath], function (textArray) {

      var vertexShader, fragmentShader;
      vertexShader = Util.loadShader(gl, gl.VERTEX_SHADER, textArray[0]);
      fragmentShader = Util.loadShader(gl, gl.FRAGMENT_SHADER, textArray[1]);

      self.shaderProgram = gl.createProgram();
      gl.attachShader(self.shaderProgram, vertexShader);
      gl.attachShader(self.shaderProgram, fragmentShader);
      gl.linkProgram(self.shaderProgram);

      if (!gl.getProgramParameter(self.shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
      }

      self.shaderProgram.vertexPositionAttribute =
        gl.getAttribLocation(self.shaderProgram, "aVertexPosition");

      self.shaderProgram.vertexColorAttribute =
        gl.getAttribLocation(self.shaderProgram, "aVertexColor");

      self.shaderProgram.pMatrixUniform =
        gl.getUniformLocation(self.shaderProgram, "uPMatrix");

      self.shaderProgram.mvMatrixUniform =
        gl.getUniformLocation(self.shaderProgram, "uMVMatrix");

      thisClass.shaderProgram = self.shaderProgram;
    });

  };

  /**
   * Selects this class's shaderProgram and binds any variables which are not
   * position or color
   */
  Renderable.prototype.useShaders = function () {
    gl.useProgram(this.shaderProgram);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
  };

  Renderable.prototype.setMatrixUniforms = function () {
    gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, mvMatrix);
  };

  Renderable.prototype.render = function () {
    this.useShaders();

    Util.mvPushMatrix();

    // Transform
    mat4.translate(mvMatrix, mvMatrix, this.position);
    mat4.rotateZ(mvMatrix, mvMatrix, this.rotation);
    mat4.scale(mvMatrix, mvMatrix, this.scale);

    // Render
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(
      this.shaderProgram.vertexPositionAttribute,
      this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.vertexAttribPointer(
      this.shaderProgram.vertexColorAttribute,
      this.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    this.setMatrixUniforms();
    gl.drawElements(
      gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0
    );

    Util.mvPopMatrix();
  };

}());
