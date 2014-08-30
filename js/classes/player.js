/**
 * player.js
 *
 * Player class
 */
/* global Ship, controller, Util, Weapon, GatlingGun, Shotgun */

var Player;

(function () {
  "use strict";

  var VERTICES = [
    1.0,  0.0,  0.0,
    -1.0, 1.0,  0.0,
    -1.0, -1.0,  0.0,
  ];

  var COLORS = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
  ];

  var INDICES = [
    0, 1, 2
  ];

  // TODO DEV only - dvorak keys
  var DEFAULT_UP = [188]
    , DEFAULT_DOWN = [79]
    , DEFAULT_LEFT = [65]
    , DEFAULT_RIGHT = [69]

  // Weapon selection
    , DEFAULT_W1 = 49
    , DEFAULT_W2 = 219
    , DEFAULT_W3 = 222
    , DEFAULT_W4 = 191
    , DEFAULT_W5 = 53
  ;

  var START_MAX_DEFENSE = 100
    , START_MAX_ENERGY = 100
  ;

  Player = function (params) {
    Ship.call(this, params);

    this.maxHull = START_MAX_DEFENSE;
    this.maxArmor = START_MAX_DEFENSE;
    this.maxShield = START_MAX_DEFENSE;
    this.maxEnergy = START_MAX_ENERGY;

    this.controller = controller;
    this.controls = {
      up: DEFAULT_UP
    , down: DEFAULT_DOWN
    , left: DEFAULT_LEFT
    , right: DEFAULT_RIGHT
    , w1: DEFAULT_W1
    , w2: DEFAULT_W2
    , w3: DEFAULT_W3
    , w4: DEFAULT_W4
    , w5: DEFAULT_W5
    };

    if (params.updateCallback) {
      this.updateCallback = params.updateCallback;
    } else {
      this.updateCallback = null;
    }

    this.mousePos = controller.getMouseCoord();

    // TODO: implement other weapons
    this.weapons = [
      new Weapon({
        ship: this
      })
    , new GatlingGun({
        ship: this
      })
    , new Shotgun({
        ship: this
      })
    , new GatlingGun({
        ship: this
      })
    , new GatlingGun({
        ship: this
      })
    ];

    this.registerTapKeys();

    this.weapon = this.weapons[0];
  };
  // Inherits from Ship
  Player.prototype = Object.create(Ship.prototype);

  // Override buffers
  Player.prototype.initBuffers = function () {
    this.initBuffersParams(Player, VERTICES, COLORS, INDICES);
  };

  /**
   * Register key callbacks that need to be called on keyDown
   *
   * This should be used for keys that are not intended to be held down
   */
  Player.prototype.registerTapKeys = function () {
    var self = this;
    // Weapon selection callbacks
    controller.registerKeyDownCallback(function (keyCode) {
      if (keyCode === self.controls.w1) {
        self.weapon = self.weapons[0];
      }
    });
    controller.registerKeyDownCallback(function (keyCode) {
      if (keyCode === self.controls.w2) {
        self.weapon = self.weapons[1];
      }
    });
    controller.registerKeyDownCallback(function (keyCode) {
      if (keyCode === self.controls.w3) {
        self.weapon = self.weapons[2];
      }
    });
    controller.registerKeyDownCallback(function (keyCode) {
      if (keyCode === self.controls.w4) {
        self.weapon = self.weapons[3];
      }
    });
    controller.registerKeyDownCallback(function (keyCode) {
      if (keyCode === self.controls.w5) {
        self.weapon = self.weapons[4];
      }
    });

  };

  Player.prototype.handleKeys = function () {
    // Handle motion keys
    if (this.controller.keyUnion(this.controls.up)) {
      this.accelDir[1] += 1.0;
    }

    if (this.controller.keyUnion(this.controls.down)) {
      this.accelDir[1] -= 1.0;
    }

    if (this.controller.keyUnion(this.controls.left)) {
      this.accelDir[0] -= 1.0;
    }

    if (this.controller.keyUnion(this.controls.right)) {
      this.accelDir[0] += 1.0;
    }
    vec3.normalize(this.accelDir, this.accelDir);

  };


  Player.prototype.react = function () {
    this.accelDir = vec3.fromValues(0.0, 0.0, 0.0);

    this.handleKeys();

    // Handle rotation
    var worldCoord = Util.screenToWorld(this.mousePos);
    this.faceCoord(worldCoord);

    // Handle Shooting
    if (this.controller.isMouseDown) {
      this.shooting = true;
    } else {
      this.shooting = false;
    }
  };

  Player.prototype.update = function (tick) {
    Ship.prototype.update.call(this, tick);
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  };

  Player.prototype.die = function () {
    Ship.prototype.die.call(this);


    // TODO: Show gameover, etc
    console.log("Game Over!");
  };

}());
