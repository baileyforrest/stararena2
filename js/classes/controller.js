/**
 * controller.js
 *
 * Singleton class for handling input
 */
/* global controller:true, canvas */

(function () {
  "use strict";

  var Controller = function (params) {
    this.currentPressedKeys = {};
    this.isMouseDown = false;
    this.mousePos = vec3.fromValues(0.0, 0.0, 0.0);
    this.keyDownCallbacks = [];
  };

  Controller.prototype.keyDown = function (event) {
    var i;

    this.currentPressedKeys[event.keyCode] = true;

    for (i = 0; i < this.keyDownCallbacks.length; i += 1) {
      this.keyDownCallbacks[i](event.keyCode);
    }
  };

  Controller.prototype.keyUp = function (event) {
    this.currentPressedKeys[event.keyCode] = false;
  };

  Controller.prototype.registerKeyDownCallback = function (callback) {
    this.keyDownCallbacks.push(callback);
  };

  Controller.prototype.keyIntersect = function (keys) {
    for (var i = 0; i < keys.length; i += 1) {
      if (!this.currentPressedKeys[keys[i]]) {
        return false;
      }
    }

    return true;
  };

  Controller.prototype.keyUnion = function (keys) {
    for (var i = 0; i < keys.length; i += 1) {
      if (this.currentPressedKeys[keys[i]]) {
        return true;
      }
    }

    return false;
  };

  Controller.prototype.mouseDown = function (event) {
    this.isMouseDown = true;
  };

  Controller.prototype.mouseUp = function (event) {
    this.isMouseDown = false;
  };

  Controller.prototype.mouseMove = function (event) {
    this.mousePos[0] = event.offsetX;
    this.mousePos[1] = event.offsetY;
  };

  Controller.prototype.getMouseCoord = function () {
    return this.mousePos;
  };

  var ctrler = new Controller();

  // Set the singleton
  controller = ctrler;

  /**
   * Register event callbacks
   */
  Controller.prototype.registerEvents = function (canvas) {
    document.onkeydown = function (event) { ctrler.keyDown(event); };
    document.onkeyup = function (event) { ctrler.keyUp(event); };

    canvas.onmousedown = function (event) { ctrler.mouseDown(event); };
    canvas.onmouseup = function (event) { ctrler.mouseUp(event); };
    canvas.onmousemove = function (event) { ctrler.mouseMove(event); };

  };
}());
