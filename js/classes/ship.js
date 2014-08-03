/**
 * ship.js
 *
 * Main ship class
 */

/* global Movable, stage */

var Ship;

(function () {
  "use strict";

  var BASE_DEFENSE = 10.0
    , BASE_RAD = 1.0
    , BASE_ACCEL = 0.4
    , BASE_MASS = 10.0
  ;

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
    this.mass = BASE_MASS;

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

    // Process collision with edges
    stage.collide(this);

    Movable.prototype.update.call(this, tick);
    this.shoot(tick);
  };

  Ship.prototype.takeDamage = function (damage, direction) {
    // TDOO: implement this
  };

  Ship.prototype.die = function () {
    // TODO: here - remove from ship list, die animation
    // For player - die animation, game over screen
  };

}());
