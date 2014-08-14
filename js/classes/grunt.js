/**
 * grunt.js
 *
 * Grunt basic enemy class
 */
/* global Orbiter, Weapon */

var Grunt;

(function () {
  "use strict";

  var VERTICES = [
    1.0,  0.0,  0.0,
    -1.0, 1.0,  0.0,
    -1.0, -1.0,  0.0,
  ];

  var COLORS = [
    1.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
  ];

  var INDICES = [
    0, 1, 2
  ];

  var ORBIT_DIST = 5.0;
  var SLACK = 1.0;
  var MAX_SPEED = 0.5;
  var VEL_FACTOR = 1.0;

  Grunt = function (params) {
    Orbiter.call(this, params);

    this.weapon = new Weapon({
      ship: this
    });
  };
  // Inherits from Orbiter
  Grunt.prototype = Object.create(Orbiter.prototype);

  // Override buffers
  Grunt.prototype.initBuffers = function () {
    this.initBuffersParams(Grunt, VERTICES, COLORS, INDICES);
  };

}());
