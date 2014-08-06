/**
 * ship.js
 *
 * Main ship class
 */

/* global Movable, Particle, Util */
/* global stage */
/* global SHIELD_COLOR, ARMOR_COLOR, HULL_COLOR */

var Ship;

(function () {
  "use strict";

  var BASE_DEFENSE = 10.0
    , BASE_RAD = 1.0
    , BASE_ACCEL = 0.5
    , BASE_MASS = 10.0
  ;

  /**
   * Base Ship class
   * @class
   */
  Ship = function (params) {
    Movable.call(this, params);

    this.radius = BASE_RAD;
    this.accel = BASE_ACCEL;
    this.mass = BASE_MASS;

    this.hull = BASE_DEFENSE;
    this.maxHull = BASE_DEFENSE;
    this.armor = BASE_DEFENSE;
    this.maxArmor = BASE_DEFENSE;
    this.shield = BASE_DEFENSE;
    this.maxShield = BASE_DEFENSE;

    this.shooting = false;
  };
  // Inherits from Movable
  Ship.prototype = Object.create(Movable.prototype);

  /**
   * Update orientation, acceleration, target, etc
   *
   * AI implementation goes here
   */
  Ship.prototype.react = function () {
  };

  Ship.prototype.faceCoord = function (coord) {
    var dir = vec3.create();
    vec3.subtract(dir, coord, this.position);
    this.rotation = Math.atan2(dir[1], dir[0]);
  };

  Ship.prototype.shoot = function (tick) {
    if (!this.weapon) {
      return;
    }

    this.weapon.update(tick, this.shooting);
  };

  Ship.prototype.update = function (tick) {
    this.react();
    Movable.prototype.update.call(this, tick);

    // Process collision with edges
    stage.collide(this);

    // TODO: collide with other ships

    this.shoot(tick);
  };

  /**
   * Process damage taken from given direction
   *
   * Direction used for particle effects
   */
  Ship.prototype.takeDamage = function (damage, direction) {
    var dShield = 0
      , dArmor = 0
      , dHull = 0
      , died = false
      , particleParams
    ;

    if (damage <= this.shield) {
      dShield += damage;
      this.shield -= damage;
    } else {
      dShield = this.shield;
      damage -= this.shield;
      this.shield = 0;

      if (damage <= this.armor) {
        dArmor += damage;
        this.armor -= damage;
      } else {
        dArmor += this.armor;
        damage -= this.armor;
        this.armor = 0;

        if (damage <= this.hull) {
          dHull += damage;
          this.hull -= damage;
        } else {
          dHull += this.hull;
          this.hull = 0;
        }

        if (this.hull <= 0) {
          died = true;
        }
      }
    }

    // Percent damage used for particle effects
    particleParams = {
      pdShield: dShield / this.maxShield
    , pdArmor: dArmor / this.maxArmor
    , pdHull: dHull / this.maxHull
    , direction: direction
    };

    this.particles(particleParams);

    if (died) {
      this.die();
    }
  };

  Ship.prototype.die = function () {
    stage.removeShip(this);

    // Blow up with all particle effects from center of ship
    this.particles({
      pdShield: 1.0
    , pdArmor: 1.0
    , pdHull: 1.0
    , direction: vec3.fromValues(0.0, 0.0, 0.0)
    });
  };

  /**
   * Setup particle effects to be rendered
   */
  Ship.prototype.particles = function (params) {
    var direction = vec3.create()
      , dirScale = vec3.create()
      , location = vec3.create()
    ;

    vec3.normalize(direction, params.direction);
    vec3.scale(dirScale, direction, this.radius);
    vec3.add(location, this.position, dirScale);

    if (params.pdShield > 0.0) {
      stage.addParticle(new Particle({
        position: location
      , color: SHIELD_COLOR
      , radius: this.radius
      , velocity: this.velocity
      , percent: params.pdShield
      , scale: Util.uniformScale(params.pdShield * 1.5)
      }));
    }

    if (params.pdArmor > 0.0) {
      stage.addParticle(new Particle({
        position: location
      , color: ARMOR_COLOR
      , radius: this.radius
      , velocity: this.velocity
      , percent: params.pdArmor
      , scale: Util.uniformScale(params.pdArmor * 1.5)
      }));
    }

    if (params.pdHull > 0.0) {
      stage.addParticle(new Particle({
        position: location
      , color: HULL_COLOR
      , radius: this.radius
      , velocity: this.velocity
      , percent: params.pdHull
      , scale: Util.uniformScale(params.pdHull * 1.5)
      }));
    }

  };

}());
