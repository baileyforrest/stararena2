/**
 * player.js
 *
 * Player class
 */
/* global Ship, controller */

var Player;

(function () {
  "use strict";

  // TODO DEV only - dvorak keys
  var DEFAULT_UP = [188]
    , DEFAULT_DOWN = [79]
    , DEFAULT_LEFT = [65]
    , DEFAULT_RIGHT = [69]
  ;

  Player = function (params) {
    Ship.call(this, params);

    this.controller = controller;
    this.controls = {
      up: DEFAULT_UP
    , down: DEFAULT_DOWN
    , left: DEFAULT_LEFT
    , right: DEFAULT_RIGHT
    };

    if (params.updateCallback) {
      this.updateCallback = params.updateCallback;
    } else {
      this.updateCallback = null;
    }

    this.mousePos = controller.getMouseCoord();
  };
  // Inherits from Ship
  Player.prototype = Object.create(Ship.prototype);

  Player.prototype.react = function () {
    this.accelDir = vec3.fromValues(0.0, 0.0, 0.0);

    // Handle motion keys
    if (this.controller.keyUnion(this.controls.up)) {
      this.accelDir[1] += 1.0;
    }

    if (this.controller.keyUnion(this.controls.down)) {
      this.accelDir[1] -= 1.0;
    }

    if (this.controller.keyUnion(this.controls.left)) {
      this.accelDir[0] -= 1.0;
    }

    if (this.controller.keyUnion(this.controls.right)) {
      this.accelDir[0] += 1.0;
    }

    vec3.normalize(this.accelDir, this.accelDir);

    // Change direction to face mouse
    var x = this.mousePos[0]
      , y = gl.viewportHeight - this.mousePos[1];

    var transMat = mat4.create()
      , worldCoord = vec3.create()
    ;

    mat4.multiply(transMat, pMatrix, mvMatrix);
    mat4.invert(transMat, transMat);

    vec3.transformMat4(worldCoord, this.mousePos, transMat);
    console.log(worldCoord);
  };

  Player.prototype.update = function (tick) {
    Ship.prototype.update.call(this, tick);
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  };

}());
