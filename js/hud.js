/**
 * hud.js
 *
 * Basic UI for the game
 */

var Hud;

(function () {
  "use strict";

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

  /**
   * Render the UI on the screen
   */
  Hud.prototype.render = function () {
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
    //this.ctx.fillStyle = "#444444";
    this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
    this.ctx.fillRect(15, 15, 30, 30);
  };

}());
