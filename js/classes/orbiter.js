/**
 * Orbiter.js
 *
 * Ship types which orbit
 */
/* global Ship */

var Orbiter;

(function () {
  "use strict";

  var ORBIT_DIST = 5.0;
  var SLACK = 1.0;
  var MAX_SPEED = 0.5;
  var VEL_FACTOR = 1.0;

  Orbiter = function (params) {
    Ship.call(this, params);

    this.orbitDist = ORBIT_DIST;
    this.slack = SLACK;
    this.maxSpeed = MAX_SPEED;
    this.velFactor = VEL_FACTOR;
  };
  // Inherits from Ship
  Orbiter.prototype = Object.create(Ship.prototype);

  /**
   * Orbit enemy and shoot leading accounting for velocity
   *
   * TODO: avoid crashing into each other
   */
  Orbiter.prototype.react = function () {
    if (!this.target || this.target.dead) {
      this.shooting = false;
      this.target = null;
      this.slowDown();
      return;
    }

    var distance = vec2.distance(this.position, this.target.position);

    var velDiff = vec3.create();
    vec3.subtract(velDiff, this.target.velocity, this.velocity);
    vec3.scale(velDiff, velDiff, this.velFactor * distance);

    var shootPos = vec3.create();
    vec3.add(shootPos, this.target.position, velDiff);

    this.faceCoord(shootPos);
    this.shooting = true;

    this.accelDir = vec3.fromValues(0.0, 0.0, 0.0);
    if (distance > this.orbitDist + this.slack) {
      // Approach target if too far away
      vec2.subtract(this.accelDir, this.target.position, this.position);
      vec2.normalize(this.accelDir, this.accelDir);
    } else if (distance < this.orbitDist - this.slack) {
      // Avoid crashing into target
      vec2.subtract(this.accelDir, this.position, this.target.position);
      vec2.normalize(this.accelDir, this.accelDir);
    }

    // Don't accelerate out of control
    if (vec2.length(this.velocity) > this.maxSpeed) {
      this.slowDown();
    }
  };

}());
