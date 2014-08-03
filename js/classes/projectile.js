/**
 * projectile.js
 *
 * Base projectile class
 */

/* global Movable */

var Projectile;

(function () {
  "use strict";

  var vertices = [
    0.0,  0.2,  0.0,
    -0.2, -0.2,  0.0,
    0.2, -0.2,  0.0,
  ];

  var colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];

  var indices = [
    0, 1, 2
  ];

  var INITIAL_VELOCITY = 1.0
    , BASE_RADIUS = 0.2
    , BASE_DAMAGE = 5
  ;

  Projectile = function (params) {
    Movable.call(this, params);

    this.radius = BASE_RADIUS;
    this.damage = BASE_DAMAGE;

    if (!params) {
      return;
    }

    if (params.accelDir) {
      vec3.normalize(this.accelDir, params.accelDir);
      vec3.scale(this.velocity, this.accelDir, INITIAL_VELOCITY);
    }

    if (params.velocity) {
      vec3.add(this.velocity, this.velocity, params.velocity);
    }

    if (params.ownder) {
      this.owner = params.owner;
    }
  };
  // Inherits from movable
  Projectile.prototype = Object.create(Movable.prototype);

  Projectile.prototype.initBuffers = function () {
    this.initBuffersParams(Projectile, vertices, colors, indices);
  };

}());
