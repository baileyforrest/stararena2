/**
 * ship.js
 *
 * Main ship class
 */

/* global Movable */

var Ship;

(function () {
  "use strict";

  var BASE_DEFENSE = 10.0
    , BASE_RAD = 1.0
    , BASE_ACCEL = 0.4;

  /**
   * Base Ship class
   * @class
   */
  Ship = function (params) {
    Movable.call(this, params);

    this.radius = BASE_RAD;
    this.hull = BASE_DEFENSE;
    this.armor = BASE_DEFENSE;
    this.shield = BASE_DEFENSE;
    this.accel = BASE_ACCEL;
    this.shooting = false;
  };
  // Inherits from Movable
  Ship.prototype = Object.create(Movable.prototype);

  /**
   * Update orientation, acceleration, target, etc
   */
  Ship.prototype.react = function () {
  };

  Ship.prototype.faceCoord = function (coord) {
    var dir = vec3.create();
    vec3.subtract(dir, coord, this.position);
    this.rotation = Math.atan2(dir[1], dir[0]);
  };

  Ship.prototype.shoot = function (tick) {
    if (!this.weapon) {
      return;
    }

    this.weapon.update(tick, this.shooting);
  };

  Ship.prototype.update = function (tick) {
    this.react();
    Movable.prototype.update.call(this, tick);
    this.shoot(tick);
  };

}());
