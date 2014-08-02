/**
 * ship.js
 *
 * Main ship class
 */

/* global Renderable */

var Ship;

(function () {
  "use strict";

  var BASE_DEFENSE = 10.0
    , BASE_RAD = 1.0
    , BASE_ACCEL = 0.5;

  /**
   * Base Ship class
   * @class
   */
  Ship = function (params) {
    Renderable.call(this, params);

    this.velocity = vec3.fromValues(0.0, 0.0, 0.0);
    this.accelDir = vec3.fromValues(0.0, 0.0, 0.0);
    this.accelVec = vec3.fromValues(0.0, 0.0, 0.0);

    this.radius = BASE_RAD;
    this.hull = BASE_DEFENSE;
    this.armor = BASE_DEFENSE;
    this.shield = BASE_DEFENSE;
    this.accel = BASE_ACCEL;

    this.initView();
  };
  // Inherits from Renderable
  Ship.prototype = Object.create(Renderable.prototype);

  /**
   * Update velocity and position
   */
  Ship.prototype.update = function (tick) {
    this.react();
    vec3.scale(this.accelVec, this.accelDir, this.accel * tick / 1000.0);

    vec3.add(this.velocity, this.velocity, this.accelVec);
    vec3.add(this.position, this.position, this.velocity);
  };

  /**
   * Update orientation, acceleration, target, etc
   */
  Ship.prototype.react = function () {
  };

}());
