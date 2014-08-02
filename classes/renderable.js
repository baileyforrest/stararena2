/**
 * renderable.js
 *
 * Renderable object
 */

/* global mvPushMatrix, mvPopMatrix, getShader */

var Renderable;

(function () {
  "use strict";

  var vertices = [
    0.0,  1.0,  0.0,
    -1.0, -1.0,  0.0,
    1.0, -1.0,  0.0,
  ];

  var colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];

  var indices = [
    0, 1, 2
  ];

  /**
   * @constructor Class for any renderable object
   */
  Renderable = function (params) {
    this.position = vec3.fromValues(0.0, 0.0, 0.0);
    this.rotation = 0.0;
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);

    if (!params) {
      return;
    }

    if (params.position) {
      this.position = params.position;
    }

    if (params.rotation) {
      this.rotation = params.rotation;
    }

    if (params.scale) {
      this.scale = params.scale;
    }
  };

  Renderable.prototype.initView = function () {
    this.initBuffers();
    this.initShaders();
  };

  Renderable.prototype.initBuffers = function () {
    this.initBuffersParams(vertices, colors, indices);
  };

  Renderable.prototype.initBuffersParams =
    function (vertices, colors, indicies) {

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
  };

  Renderable.prototype.initShaders = function () {
    // TODO: I don't like this, we should load these from external files
    var vertexShader = getShader(gl, "shader-vs")
      , fragmentShader = getShader(gl, "shader-fs");

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    this.shaderProgram.vertexPositionAttribute =
      gl.getAttribLocation(this.shaderProgram, "aVertexPosition");

    this.shaderProgram.vertexColorAttribute =
      gl.getAttribLocation(this.shaderProgram, "aVertexColor");

    this.shaderProgram.pMatrixUniform =
      gl.getUniformLocation(this.shaderProgram, "uPMatrix");

    this.shaderProgram.mvMatrixUniform =
      gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
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

    mvPushMatrix();

    // Transform
    mat4.scale(mvMatrix, mvMatrix, this.scale);
    mat4.rotateZ(mvMatrix, mvMatrix, this.rotation);
    mat4.translate(mvMatrix, mvMatrix, this.position);

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

    this.setMatrixUniforms();

    gl.drawElements(
      gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0
    );

    mvPopMatrix();
  };

}());
