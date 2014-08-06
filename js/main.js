/**
 * main.js
 *
 * Starting point and top level functions
 */
/* global gl:true, requestAnimFrame */
/* global stage:true, controller:true */
/* global Stage, Controller, Ship, Player, Particle */

var main;

(function () {
  "use strict";

  var CAM_DISTANCE = 25.0
    , cameraX = 0.0
    , cameraY = 0.0
  ;

  function initGL(canvas) {
    try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {
    }

    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
    } else {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
    }
  }

  function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(
      pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0
    );

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [-cameraX, -cameraY, -CAM_DISTANCE]);

    stage.render();
  }

  var lastTime = 0;

  function animate() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
      var elapsed = timeNow - lastTime;

      stage.update(elapsed);
    }
    lastTime = timeNow;
  }


  function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
  }


  main = function () {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    stage = new Stage();
    controller.registerEvents(canvas);

    stage.addShip(new Ship({ position: vec3.fromValues(-3.0, 0.0, 0.0) }));
    stage.addShip(new Player({
      position: vec3.fromValues(3.0, 0.0, 0.0)
    , updateCallback: function (player) {
        cameraX = player.position[0];
        cameraY = player.position[1];
      }
    }));

    stage.addParticle(new Particle());

    tick();
  };

}());
