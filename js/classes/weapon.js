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

  Weapon.prototype.fire = function () {
    this.fireProjectile(this.ship.rotation);
  };

  Weapon.prototype.fireProjectile = function (rotation) {
    var accelDir = vec3.create();
    accelDir[0] = Math.cos(rotation);
    accelDir[1] = Math.sin(rotation);

    var velocity = this.ship.velocity;
    var proj = new this.projectile({
      owner: this.ship
    , position: this.ship.position
    , rotation: this.ship.rotation
    });
    proj.launch({
      accelDir: accelDir
    , velocity: velocity
    });

    stage.addProjectile(proj);
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

    this.fire();
  };

}());
