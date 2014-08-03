/**
 * stage.js
 *
 * Class for holding the map and all of its ships
 */
/* global Renderable */

var Stage;

(function () {
  "use strict";

  // TODO: need to render background and edges

  Stage = function (params) {
    Renderable.call(this, params);

    this.ships = [];
    this.projectiles = [];
  };
  // Inherits from Renderable
  Stage.prototype = Object.create(Renderable.prototype);

  Stage.prototype.addShip = function (ship) {
    this.ships.push(ship);
  };

  Stage.prototype.addProjectile = function (projectile) {
    this.projectiles.push(projectile);
  };

  Stage.prototype.update = function (tick) {
    for (var i = 0; i < this.ships.length; i += 1) {
      this.ships[i].update(tick);
    }

    for (var j = 0; j < this.projectiles.length; j += 1) {
      this.projectiles[j].update(tick);
    }
  };

  Stage.prototype.render = function () {
    Renderable.prototype.render.call(this);

    for (var i = 0; i < this.ships.length; i += 1) {
      this.ships[i].render();
    }

    for (var j = 0; j < this.projectiles.length; j += 1) {
      this.projectiles[j].render();
    }
  };

}());
