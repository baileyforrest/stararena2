/**
 * weapon.js
 *
 * Class for handling weapons
 */

/* global Projectile, stage */

var Weapon;

(function () {
  "use strict";

  var BASE_FIRE_RATE = 250;

  Weapon = function (params) {
    this.projectile = Projectile;
    this.fireRate = BASE_FIRE_RATE; // milliseconds
    this.fireCounter = 0;

    this.ship = params.ship;
  };

  /**
   * Basic projectile firing, just fire forward the direction the ship is
   * facing and with the ship's base velocity
   */
  Weapon.prototype.update = function (tick, tryShoot) {
    var shoot = this.fireCounter === 0;

    if (this.fireCounter > this.fireRate) {
      this.fireCounter = this.fireCounter % this.fireRate;
      shoot = true;

      if (!tryShoot) {
        this.fireCounter = 0;
      }
    }

    if (this.fireCounter !== 0 || (tryShoot && shoot)) {
      this.fireCounter += tick;
    }

    if (!tryShoot || !shoot) {
      return;
    }

    var accelDir = vec3.fromValues(0.0, 0.0, 0.0);
    accelDir[0] = Math.cos(this.ship.rotation);
    accelDir[1] = Math.sin(this.ship.rotation);

    var velocity = this.ship.velocity;
    var proj = new this.projectile({
      accelDir: accelDir
    , velocity: velocity
    , owner: this.ship
    , position: this.ship.position
    , rotation: this.ship.rotation
    });

    stage.addProjectile(proj);
  };

}());
