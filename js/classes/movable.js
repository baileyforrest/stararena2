/**
 * movable.js
 *
 * Class for any movable object
 */
/* global Renderable */

var Movable;

(function () {
  "use strict";

  var BASE_ACCEL = 0.0
    , BASE_RADIUS = 1.0
  ;

  Movable = function (params) {
    Renderable.call(this, params);

    this.velocity = vec3.fromValues(0.0, 0.0, 0.0);
    this.accelDir = vec3.fromValues(0.0, 0.0, 0.0);
    this.accelVec = vec3.fromValues(0.0, 0.0, 0.0);
    this.accel = BASE_ACCEL;
    this.radius = BASE_RADIUS;

    if (!params) {
      return;
    }

    if (params.velocity) {
      this.velocity = vec3.clone(params.velocity);
    }

    if (params.accelDir) {
      this.accelDir = vec3.clone(params.accelDir);
    }

    if (params.accelVec) {
      this.accelVec = vec3.clone(params.accelVec);
    }

    if (params.accel) {
      this.accel = params.accel;
    }
  };
  // Inherits from renderable
  Movable.prototype = Object.create(Renderable.prototype);

  /**
   * Update velocity and position
   */
  Movable.prototype.update = function (tick) {
    vec3.scale(this.accelVec, this.accelDir, this.accel * tick / 1000.0);

    vec3.add(this.velocity, this.velocity, this.accelVec);
    vec3.add(this.position, this.position, this.velocity);
  };

  Movable.collides = function (s1, s2) {
    var direction = vec3.create();
    vec3.subtract(direction, s1.position, s2.position);
    var distance = vec3.length(direction);
    vec3.normalize(direction, direction);

    return distance < s1.radius + s2.radius;
  };

}());
