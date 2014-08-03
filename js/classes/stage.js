/**
 * stage.js
 *
 * Class for holding the map and all of its ships
 */
/* global Renderable */

var Stage;

(function () {
  "use strict";

  var STAGE_WIDTH = 50
    , STAGE_HEIGHT = 50
    , BORDER_WIDTH = 0.3
    , GRID_WIDTH = 0.1
  ;

  var VERTICES = [
    // Borders
    // SW
    -STAGE_WIDTH / 2 - BORDER_WIDTH, -STAGE_HEIGHT / 2 - BORDER_WIDTH, -0.1,
    -STAGE_WIDTH / 2, -STAGE_HEIGHT / 2 - BORDER_WIDTH, -0.1,
    -STAGE_WIDTH / 2 - BORDER_WIDTH, -STAGE_HEIGHT / 2, -0.1,

    // NW
    -STAGE_WIDTH / 2 - BORDER_WIDTH, STAGE_HEIGHT / 2 + BORDER_WIDTH, -0.1,
    -STAGE_WIDTH / 2, STAGE_HEIGHT / 2 + BORDER_WIDTH, -0.1,
    -STAGE_WIDTH / 2 - BORDER_WIDTH, STAGE_HEIGHT / 2, -0.1,

    // NE
    STAGE_WIDTH / 2 + BORDER_WIDTH, STAGE_HEIGHT / 2 + BORDER_WIDTH, -0.1,
    STAGE_WIDTH / 2, STAGE_HEIGHT / 2 + BORDER_WIDTH, -0.1,
    STAGE_WIDTH / 2 + BORDER_WIDTH, STAGE_HEIGHT / 2, -0.1,

    // SE
    STAGE_WIDTH / 2 + BORDER_WIDTH, -STAGE_HEIGHT / 2 - BORDER_WIDTH, -0.1,
    STAGE_WIDTH / 2, -STAGE_HEIGHT / 2 - BORDER_WIDTH, -0.1,
    STAGE_WIDTH / 2 + BORDER_WIDTH, -STAGE_HEIGHT / 2, -0.1,
  ];

  var INDICES = [
    // West edge
    0, 1, 4,
    3, 0, 4,

    // North edge
    3, 5, 8,
    3, 8, 6,

    // East edge
    7, 10, 9,
    7, 9, 6,

    // South edge
    0, 9, 11,
    0, 11, 2,
  ];

  var BORDER_COLOR = [1.0, 0.0, 0.0, 1.0];
  var COLORS = [];

  for (var i = 0; i < VERTICES.length; i += 1) {
    COLORS.push.apply(COLORS, BORDER_COLOR);
  }
/*
  var VERTICES = [
    // Left border
    -STAGE_WIDTH / 2, -STAGE_HEIGHT / 2, 0.0,
    -STAGE_WIDTH / 2, STAGE_HEIGHT / 2, 0.0,
    -STAGE_WIDTH / 2 - 10, 0.0, 0.0,

    // top border
    -STAGE_WIDTH / 2, STAGE_HEIGHT / 2, 0.0,
    STAGE_WIDTH / 2, STAGE_HEIGHT / 2, 0.0,
    0.0, STAGE_HEIGHT / 2 + 10, 0.0
  ];

  var COLORS = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  var INDICES = [
    0, 1, 2,
    3, 4, 5
  ];
  */

  // TODO: need to render background and edges

  Stage = function (params) {
    Renderable.call(this, params);

    this.ships = [];
    this.projectiles = [];
    this.minX = -STAGE_WIDTH / 2;
    this.maxX = STAGE_WIDTH / 2;
    this.minY = -STAGE_HEIGHT / 2;
    this.maxY = STAGE_HEIGHT / 2;
  };
  // Inherits from Renderable
  Stage.prototype = Object.create(Renderable.prototype);

  Stage.prototype.addShip = function (ship) {
    this.ships.push(ship);
  };

  Stage.prototype.initBuffers = function () {
    this.initBuffersParams(Stage, VERTICES, COLORS, INDICES);
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

  Stage.prototype.isInside = function (movable) {
    return !(
      movable.position[0] > this.maxX ||
      movable.position[0] < this.minX ||
      movable.position[1] > this.maxY ||
      movable.position[1] < this.minY
    );
  };

}());
