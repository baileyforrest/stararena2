/**
 * particles.js
 *
 * Class for Particle effects
 *
 * Uses code based on this: http://learningwebgl.com/blog/?p=2042
 *
 */
/* global Movable, Util */
/* global stage */

var Particle;

(function () {
  "use strict";

  var DEFAULT_RADIUS = 2.0
    , MAX_TIME = 10000;

  var vertexShaderPath = "assets/glsl/particle_vertex.glsl";
  var fragmentShaderPath = "assets/glsl/particle_fragment.glsl";

  var pointLifetimesBuffer;
  var pointStartPositionsBuffer;
  var pointEndPositionsBuffer;
  var pointOffsetsBuffer;
  var buffersInit = false;

  Particle = function (params) {
    Movable.call(this, params);

    this.color = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.startTime = new Date().getTime();
    this.curTime = this.startTime;
    this.maxTime = MAX_TIME;
    this.radius = DEFAULT_RADIUS;
    this.percent = 1.0;
    this.rotation = 2 * Math.PI * Math.random();

    if (!params) {
      return;
    }

    if (params.color) {
      this.color = params.color;
    }

    if (params.radius) {
      this.radius = params.radius;
    }

    if (params.percent) {
      if (params.percent > 1.0 || params.percent < 0.0) {
        throw "Invalid Percent";
      }
      this.percent = params.percent;
    }

  };
  // Inherits from renderable
  Particle.prototype = Object.create(Movable.prototype);

  Particle.prototype.update = function (tick) {
    Movable.prototype.update.call(this, tick);
    this.curTime += tick;

    if (this.curTime - this.startTime > this.maxTime / 2) {
      stage.removeParticle(this);
    }
  };

  Particle.prototype.initBuffers = function () {
    if (buffersInit) {
      return;
    }

    var numParticles = 500;

    var lifetimes = []
      , startPositions = []
      , endPositions = []
      , offsets = []
      , offsetsCycle = [
        -1,  1,
        -1, -1,
        1,  1,
        1, -1,
        -1, -1,
        1,  1,
      ];

    for (var i = 0; i < numParticles; i += 1)  {
      var lifetime = (Math.random() * 0.05) + 0.05;

      var distance = Math.random() * 0.1 - 0.05;
      var theta = Math.random() * 2 * Math.PI;
      var phi =  Math.random() * 2 * Math.PI;

      var startX = distance * Math.cos(phi) * Math.sin(theta);
      var startY = distance * Math.cos(theta);
      var startZ = distance * Math.sin(phi) * Math.sin(theta);

      distance = 20 * Math.random();
      theta = Math.random() * 2 * Math.PI;
      phi =  Math.random() * 2 * Math.PI;

      var endX = distance * Math.cos(phi) * Math.sin(theta);
      var endY = distance * Math.cos(theta);
      var endZ = distance * Math.sin(phi) * Math.sin(theta);

      for (var v = 0; v < 6; v += 1) {
        lifetimes.push(lifetime);

        startPositions.push(startX);
        startPositions.push(startY);
        startPositions.push(startZ);

        endPositions.push(endX);
        endPositions.push(endY);
        endPositions.push(endZ);

        offsets.push(offsetsCycle[v * 2]);
        offsets.push(offsetsCycle[v * 2 + 1]);
      }
    }

    pointLifetimesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointLifetimesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lifetimes), gl.STATIC_DRAW);
    pointLifetimesBuffer.itemSize = 1;
    pointLifetimesBuffer.numItems = numParticles * 6;

    pointStartPositionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointStartPositionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startPositions), gl.STATIC_DRAW);
    pointStartPositionsBuffer.itemSize = 3;
    pointStartPositionsBuffer.numItems = numParticles * 6;

    pointEndPositionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointEndPositionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(endPositions), gl.STATIC_DRAW);
    pointEndPositionsBuffer.itemSize = 3;
    pointEndPositionsBuffer.numItems = numParticles * 6;

    pointOffsetsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointOffsetsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW);
    pointOffsetsBuffer.itemSize = 2;
    pointOffsetsBuffer.numItems = numParticles * 6;

    // Make sure we only init the buffers once
    buffersInit = true;
  };

  /**
   * Have to use completely different method because of how the particles work
   */
  Particle.prototype.initShaders = function () {
    if (Particle.shaderProgram) {
      this.shaderProgram = Particle.shaderProgram;
      return;
    }
    console.log("loading particle shaders");

    var self = this;

    Util.loadFiles(
      [vertexShaderPath, fragmentShaderPath], function (textArray) {

      var vertexShader, fragmentShader;
      vertexShader = Util.loadShader(gl, gl.VERTEX_SHADER, textArray[0]);
      fragmentShader = Util.loadShader(gl, gl.FRAGMENT_SHADER, textArray[1]);

      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
      }

      shaderProgram.pointLifetimeAttribute =
        gl.getAttribLocation(shaderProgram, "aLifetime");

      shaderProgram.pointStartPositionAttribute =
        gl.getAttribLocation(shaderProgram, "aStartPosition");

      shaderProgram.pointEndPositionAttribute =
        gl.getAttribLocation(shaderProgram, "aEndPosition");

      shaderProgram.pointOffsetAttribute =
        gl.getAttribLocation(shaderProgram, "aOffset");

      shaderProgram.scaleUniform =
        gl.getUniformLocation(shaderProgram, "uScale");

      shaderProgram.colorUniform =
        gl.getUniformLocation(shaderProgram, "uColor");

      shaderProgram.timeUniform =
        gl.getUniformLocation(shaderProgram, "uTime");

      shaderProgram.pMatrixUniform =
        gl.getUniformLocation(shaderProgram, "uPMatrix");

      shaderProgram.mvMatrixUniform =
        gl.getUniformLocation(shaderProgram, "uMVMatrix");


      self.shaderProgram = shaderProgram;
      Particle.shaderProgram = shaderProgram;
    });
  };

  Particle.prototype.useShaders = function () {
    gl.useProgram(this.shaderProgram);
    gl.enableVertexAttribArray(this.shaderProgram.pointLifetimeAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.pointStartPositionAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.pointEndPositionAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.pointOffsetAttribute);

  };

  Particle.prototype.render = function () {
    this.useShaders();

    Util.mvPushMatrix();

    // Transform
    mat4.translate(mvMatrix, mvMatrix, this.position);
    mat4.rotateZ(mvMatrix, mvMatrix, this.rotation);
    mat4.scale(mvMatrix, mvMatrix, this.scale);

    // Render
    gl.bindBuffer(gl.ARRAY_BUFFER, pointLifetimesBuffer);
    gl.vertexAttribPointer(
      this.shaderProgram.pointLifetimeAttribute,
      pointLifetimesBuffer.itemSize, gl.FLOAT, false, 0, 0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, pointStartPositionsBuffer);
    gl.vertexAttribPointer(
      this.shaderProgram.pointStartPositionAttribute,
      pointStartPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, pointEndPositionsBuffer);
    gl.vertexAttribPointer(
      this.shaderProgram.pointEndPositionAttribute,
      pointEndPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, pointOffsetsBuffer);
    gl.vertexAttribPointer(
      this.shaderProgram.pointOffsetAttribute,
      pointOffsetsBuffer.itemSize, gl.FLOAT, false, 0, 0
    );

    gl.uniform3f(
      this.shaderProgram.scaleUniform,
      this.scale[0], this.scale[1], this.scale[2]
    );

    gl.uniform4f(
      this.shaderProgram.colorUniform,
      this.color[0], this.color[1], this.color[2], this.color[3]
    );

    gl.uniform1f(
      this.shaderProgram.timeUniform,
      (this.curTime - this.startTime) / this.maxTime
    );

    this.setMatrixUniforms();

    // Only draw specified percent of the particles
    gl.drawArrays(
      gl.TRIANGLES, 0,
      Math.floor(pointLifetimesBuffer.numItems * this.percent)
    );

    Util.mvPopMatrix();
  };

}());
