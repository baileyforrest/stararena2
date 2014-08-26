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
    , BASE_RAD = 2.0
    , BASE_ACCEL = 0.5
    , BASE_MASS = 10.0
    , BASE_ENERGY = 10.0
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

    this.maxHull = BASE_DEFENSE;
    this.maxArmor = BASE_DEFENSE;
    this.maxShield = BASE_DEFENSE;
    this.maxEnergy = BASE_ENERGY;

    this.shooting = false;
    this.target = null;
    this.dead = false;

    if (!params) {
      return;
    }

    if (params.target) {
      this.target = params.target;
    }
  };
  // Inherits from Movable
  Ship.prototype = Object.create(Movable.prototype);

  /**
   * Initialize shared but class specific state
   */
  Ship.prototype.initState = function () {
    this.hull = this.maxHull;
    this.armor = this.maxArmor;
    this.shield = this.maxShield;
    this.energy = this.maxEnergy;
  };

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
    this.dead = true;

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

  /**
   * Perform Elastic collision
   *
   * Doesn't check if they collide, should be checked first using
   * Movable.collides
   */
  Ship.doCollision = function (s1, s2) {
    var v1p = vec3.create()
      , d = vec3.create()
      , md = vec3.create()
      , v2pp = vec3.create()
      , u1 = vec3.create()
      , u2 = vec3.create()
      , m1v1 = vec3.create()
      , m2v2 = vec3.create()
      , m2u2 = vec3.create()
    ;

    vec3.subtract(v1p, s1.velocity, s2.velocity);
    vec3.subtract(d, s1.position, s2.position);
    vec3.normalize(d, d);
    vec3.scale(md, d, -1.0);

    vec3.scale(v2pp, d, 2 * (s1.mass / (s1.mass + s2.mass)) * vec3.dot(v1p, d));

    vec3.add(u2, s2.velocity, v2pp);
    vec3.scale(m1v1, s1.velocity, s1.mass);
    vec3.scale(m2v2, s2.velocity, s2.mass);
    vec3.scale(m2u2, u2, s2.mass);

    vec3.add(u1, m1v1, m2v2);
    vec3.subtract(u1, u1, m2u2);
    vec3.scale(u1, u1, 1.0 / s1.mass);

    vec3.copy(s1.velocity, u1);
    vec3.copy(s2.velocity, u2);

    var lenVdiff = vec3.length(v1p);

    // Take damage from collisions
    s1.takeDamage(lenVdiff * 2.0 * (s2.mass / s1.mass + s2.mass), md);
    s2.takeDamage(lenVdiff * 2.0 * (s1.mass / s1.mass + s2.mass), d);
  };

  Ship.prototype.slowDown = function () {
    vec3.scale(this.accelDir, this.velocity, -1.0);
    vec3.normalize(this.accelDir, this.accelDir);
  };

}());
