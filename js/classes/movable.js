/**
 * movable.js
 *
 * Class for any movable object
 */
/* global Renderable */

var Movable;

(function () {
  "use strict";

  var BASE_ACCEL = 0.0;

  Movable = function (params) {
    Renderable.call(this, params);

    this.velocity = vec3.fromValues(0.0, 0.0, 0.0);
    this.accelDir = vec3.fromValues(0.0, 0.0, 0.0);
    this.accelVec = vec3.fromValues(0.0, 0.0, 0.0);
    this.accel = BASE_ACCEL;
  };
  // Inherits from renderable
  Movable.prototype = Object.create(Renderable.prototype);

  /**
   * Update velocity and position
   */
  Movable.prototype.update = function (tick) {
    this.react();
    vec3.scale(this.accelVec, this.accelDir, this.accel * tick / 1000.0);

    vec3.add(this.velocity, this.velocity, this.accelVec);
    vec3.add(this.position, this.position, this.velocity);
  };


}());
