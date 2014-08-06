/**
 * entity.js
 *
 * Class for any object that has position, rotation, and scale
 */

var Entity;

(function () {
  "use strict";

  Entity = function (params) {
    this.position = vec3.fromValues(0.0, 0.0, 0.0);
    this.rotation = 0.0;
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);

    if (!params) {
      return;
    }

    if (params.position) {
      this.position = vec3.clone(params.position);
    }

    if (params.rotation) {
      this.rotation = params.rotation;
    }

    if (params.scale) {
      this.scale = vec3.clone(params.scale);
    }
  };

}());
