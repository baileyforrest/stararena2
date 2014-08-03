/**
 * player.js
 *
 * Player class
 */
/* global Ship, controller, Util, Weapon */

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

    this.weapons = [
      new Weapon({
        ship: this
      })
    ];

    this.weapon = this.weapons[0];
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

    // Handle rotation
    var worldCoord = Util.screenToWorld(this.mousePos);
    console.log([worldCoord[0], worldCoord[1]]);
    this.faceCoord(worldCoord);

    // Handle Shooting
    if (this.controller.isMouseDown) {
      this.shooting = true;
    } else {
      this.shooting = false;
    }
  };

  Player.prototype.update = function (tick) {
    Ship.prototype.update.call(this, tick);
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  };

}());
