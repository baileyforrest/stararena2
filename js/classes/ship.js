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
    , BASE_ACCEL = 0.5;

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

    this.initView();
  };
  // Inherits from Movable
  Ship.prototype = Object.create(Movable.prototype);

  /**
   * Update orientation, acceleration, target, etc
   */
  Ship.prototype.react = function () {
  };

}());
