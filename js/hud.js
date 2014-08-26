/**
 * hud.js
 *
 * Basic UI for the game
 */

var Hud;

(function () {
  "use strict";

  var STATUS_BAR_HEIGHT = 10
    , STATUS_BAR_WIDTH = 200
    , STATUS_BAR_OFFSET = 10
    , STATUS_BAR_PADDING = 5

    , UI_ALPHA = 0.6
    , DEFAULT_ALPHA = 1.0
  ;

  Hud = function (params) {
    if (!params) {
      throw "Invalid parameters";
    }

    if (!params.player) {
      throw "Player required";
    }
    this.player = params.player;

    if (!params.ctx) {
      throw "2d context required";
    }
    this.ctx = params.ctx;
  };

  Hud.prototype.renderBar = function (fillStyle, x, y, cur, max) {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(x, y, STATUS_BAR_WIDTH * cur / max, STATUS_BAR_HEIGHT);
  };

  Hud.prototype.renderStatusBars = function () {
    this.ctx.globalAlpha = UI_ALPHA;
    var spacing = STATUS_BAR_OFFSET + STATUS_BAR_PADDING;

    this.renderBar( // Shield
      "#0000FF", STATUS_BAR_OFFSET, this.ctx.height - 4 * spacing,
      this.player.shield, this.player.maxShield
    );

    this.renderBar( // Armor
      "#00FF00", STATUS_BAR_OFFSET, this.ctx.height - 3 * spacing,
      this.player.armor, this.player.maxArmor
    );

    this.renderBar( // Hull
      "#FF00FF", STATUS_BAR_OFFSET, this.ctx.height - 2 * spacing,
      this.player.hull, this.player.maxHull
    );

    this.renderBar( // Energy
      "#FFFF00", STATUS_BAR_OFFSET, this.ctx.height - 1 * spacing,
      this.player.energy, this.player.maxEnergy
    );

    this.ctx.globalAlpha = DEFAULT_ALPHA;
  };

  /**
   * Render the UI on the screen
   */
  Hud.prototype.render = function () {
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
    this.renderStatusBars();
  };

}());
