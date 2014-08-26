/**
 * main.js
 *
 * Starting point and top level functions
 */
/* global gl:true, requestAnimFrame */
/* global stage:true, controller:true, player:true, ctx2d:true, hud:true */
/* global Stage, Controller, Ship, Player, Particle, Grunt, Hud */

var main;

(function () {
  "use strict";

  var CAM_DISTANCE = 50.0
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
      alert("Could not initialize WebGL!");
    } else {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
    }
  }

  function initCtx2d(canvas) {
    try {
      ctx2d = canvas.getContext("2d");
      ctx2d.width = canvas.width;
      ctx2d.height = canvas.height;
    } catch (e) {
    }

    if (!ctx2d) {
      alert("Could not initialize 2d context!");
    }
  }

  function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);


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

      hud.render();
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
    var canvas3d = document.getElementById("canvas3d");
    var canvas2d = document.getElementById("canvas2d");
    initGL(canvas3d);
    initCtx2d(canvas2d);

    stage = new Stage();
    controller.registerEvents(canvas2d);

    player = new Player({
      position: vec3.fromValues(40.0, 0.0, 0.0)
    , updateCallback: function (player) {
        cameraX = player.position[0];
        cameraY = player.position[1];
      }
    });

    hud = new Hud({
      player: player
    , ctx: ctx2d
    });

    stage.addShip(player);

    //stage.addShip(new Ship({
    //  position: vec3.fromValues(-40.0, 0.0, 0.0)
    //, target: player
    //}));
    stage.addShip(new Grunt({
      position: vec3.fromValues(-40.0, 0.0, 0.0)
    , target: player
    }));
    //stage.addShip(new Grunt({
    //  position: vec3.fromValues(-40.0, 10.0, 0.0)
    //, target: player
    //}));
    //stage.addShip(new Grunt({
    //  position: vec3.fromValues(-40.0, 20.0, 0.0)
    //, target: player
    //}));
    //stage.addShip(new Grunt({
    //  position: vec3.fromValues(-40.0, -10.0, 0.0)
    //, target: player
    //}));
    //stage.addShip(new Grunt({
    //  position: vec3.fromValues(-40.0, -20.0, 0.0)
    //, target: player
    //}));

    tick();
  };

}());
