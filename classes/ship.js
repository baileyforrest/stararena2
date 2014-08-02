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
    , BASE_ACCEL = 5.0;

  /**
   * @constructor Base Ship class
   */
  Ship = function (params) {
    Renderable.call(this, params);
    this.velocity = vec3.fromValues(0.0, 0.0, 0.0);
    this.radius = BASE_RAD;
    this.hull = BASE_DEFENSE;
    this.armor = BASE_DEFENSE;
    this.shield = BASE_DEFENSE;
    this.accel = BASE_ACCEL;
  };

  Ship.prototype = Object.create(Renderable.prototype);

  Ship.prototype.think = function () {
  };

  Ship.prototype.update = function () {
  };

}());
