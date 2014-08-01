/**
 * ship.js
 *
 * Main ship class
 */

var Ship;
(function () {
  "use strict";

  var BASE_DEFENSE = 10.0;

  Ship = function () {
    this.position = mat2.create();
    this.velocity = mat2.create();
    this.radius = 0.0;
    this.hull = BASE_DEFENSE;
    this.armor = BASE_DEFENSE;
    this.shield = BASE_DEFENSE;
  };

  Ship.prototype.render = function () {
  };

  Ship.prototype.think = function () {
  };

  Ship.prototype.update = function () {
  };

  return Ship;
}());
