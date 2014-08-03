/**
 * stage.js
 *
 * Class for holding the map and all of its ships
 */
/* global Renderable */

var Stage;

(function () {
  "use strict";

  var STAGE_WIDTH = 64
    , STAGE_HEIGHT = 64
    , BORDER_WIDTH = 0.3
    , BORDER_COLOR = [1.0, 0.0, 0.0, 1.0]
    , GRID_WIDTH = 0.04
    , GRID_COLOR = [0.0, 0.4, 0.0, 1.0]
    , ALT_GRID_COLOR = [0.0, 0.0, 0.4, 1.0]
    , GRID_SKIP = 2
    , ALT_GRID_SKIP = 4
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

  var COLORS = [];
  var i;

  for (i = 0; i < VERTICES.length / 3; i += 1) {
    COLORS.push.apply(COLORS, BORDER_COLOR);
  }

  // TODO: these functions duplicate code, consolidate similarities

  // Create vertical grid lines
  (function createVerticalGrids() {
    for (i = GRID_SKIP; i < STAGE_WIDTH; i += GRID_SKIP) {
      var nw = vec3.create()
        , ne = vec3.create()
        , se = vec3.create()
        , sw = vec3.create()
      ;

      sw[0] = -STAGE_WIDTH / 2 + i - GRID_WIDTH / 2.0;
      sw[1] = -STAGE_HEIGHT / 2;
      sw[2] = -0.1;

      se[0] = -STAGE_WIDTH / 2 + i + GRID_WIDTH / 2.0;
      se[1] = -STAGE_HEIGHT / 2;
      se[2] = -0.1;

      nw[0] = -STAGE_WIDTH / 2 + i - GRID_WIDTH / 2.0;
      nw[1] = STAGE_HEIGHT / 2;
      nw[2] = -0.1;

      ne[0] = -STAGE_WIDTH / 2 + i + GRID_WIDTH / 2.0;
      ne[1] = STAGE_HEIGHT / 2;
      ne[2] = -0.1;

      var offset = VERTICES.length / 3;

      VERTICES.push.apply(VERTICES, sw);
      VERTICES.push.apply(VERTICES, se);
      VERTICES.push.apply(VERTICES, nw);
      VERTICES.push.apply(VERTICES, ne);

      for (var j = 0; j < 4; j += 1) {
        if ((i / GRID_SKIP) % ALT_GRID_SKIP !== 0) {
          COLORS.push.apply(COLORS, GRID_COLOR);
        } else {
          console.log("foo");
          COLORS.push.apply(COLORS, ALT_GRID_COLOR);
        }
      }

      INDICES.push(offset + 0);
      INDICES.push(offset + 1);
      INDICES.push(offset + 3);

      INDICES.push(offset + 3);
      INDICES.push(offset + 2);
      INDICES.push(offset + 0);
    }
  })();

  // Create horizontal grid lines
  (function createHorizontalGrids() {
    for (i = GRID_SKIP; i < STAGE_WIDTH; i += GRID_SKIP) {
      var nw = vec3.create()
        , ne = vec3.create()
        , se = vec3.create()
        , sw = vec3.create()
      ;

      sw[0] = -STAGE_WIDTH / 2;
      sw[1] = -STAGE_HEIGHT / 2 + i - GRID_WIDTH / 2.0;
      sw[2] = -0.1;

      nw[0] = -STAGE_WIDTH / 2;
      nw[1] = -STAGE_HEIGHT / 2 + i + GRID_WIDTH / 2.0;
      nw[2] = -0.1;

      se[0] = STAGE_WIDTH / 2;
      se[1] = -STAGE_HEIGHT / 2 + i - GRID_WIDTH / 2.0;
      se[2] = -0.1;

      ne[0] = STAGE_WIDTH / 2;
      ne[1] = -STAGE_HEIGHT / 2 + i + GRID_WIDTH / 2.0;
      ne[2] = -0.1;

      var offset = VERTICES.length / 3;

      VERTICES.push.apply(VERTICES, sw);
      VERTICES.push.apply(VERTICES, se);
      VERTICES.push.apply(VERTICES, nw);
      VERTICES.push.apply(VERTICES, ne);

      for (var j = 0; j < 4; j += 1) {
        if ((i / GRID_SKIP) % ALT_GRID_SKIP !== 0) {
          COLORS.push.apply(COLORS, GRID_COLOR);
        } else {
          console.log("foo");
          COLORS.push.apply(COLORS, ALT_GRID_COLOR);
        }
      }

      INDICES.push(offset + 0);
      INDICES.push(offset + 1);
      INDICES.push(offset + 3);

      INDICES.push(offset + 3);
      INDICES.push(offset + 2);
      INDICES.push(offset + 0);
    }
  })();


  console.log(COLORS);
  console.log(VERTICES);
  console.log(INDICES);

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
