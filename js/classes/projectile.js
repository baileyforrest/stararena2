/**
 * projectile.js
 *
 * Base projectile class
 */

/* global Movable, stage */

var Projectile;

(function () {
  "use strict";

  var VERTICES = [
    0.0,  0.2,  0.0,
    -0.2, -0.2,  0.0,
    0.2, -0.2,  0.0,
  ];

  var COLORS = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];

  var INDICES = [
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

    if (params.owner) {
      this.owner = params.owner;
    }
  };
  // Inherits from movable
  Projectile.prototype = Object.create(Movable.prototype);

  Projectile.prototype.initBuffers = function () {
    this.initBuffersParams(Projectile, VERTICES, COLORS, INDICES);
  };

  Projectile.prototype.update = function (tick) {
    Movable.prototype.update.call(this, tick);

    // Check if out of bounds
    if (!stage.isInside(this)) {
      stage.removeProjectile(this);
      return;
    }

    // Check if collided with target
    for (var i = 0; i < stage.ships.length; i += 1) {
      var ship = stage.ships[i];

      // Owner can't hit himself
      // TODO: maybe change this
      if (ship === this.owner) {
        continue;
      }
      var direction = vec3.create();
      vec3.subtract(direction, this.position, ship.position);

      if (Movable.collides(this, ship)) {
        ship.takeDamage(this.damage, direction);
        stage.removeProjectile(this);
        return;
      }
    }
  };

}());
