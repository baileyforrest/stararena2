/**
 * projectile.js
 *
 * Base projectile class
 */

/* global Movable */

var Projectile;

(function () {
  "use strict";

  Projectile = function (params) {
    Movable.call(this, params);

  };
  // Inherits from renderable
  Projectile.prototype = Object.create(Movable.prototype);


}());
