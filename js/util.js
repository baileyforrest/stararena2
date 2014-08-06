/**
 * util.js
 *
 * Utility functions
 */

/* global mvMatrix:true */

var Util;

(function () {
  "use strict";

  /**
   * Utility class
   */
  Util = function () {
  };

  var mvMatrixStack = [];

  Util.mvPushMatrix = function () {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
  };

  Util.mvPopMatrix = function () {
    if (mvMatrixStack.length === 0) {
      throw "Invalid popMatrix!";
    }

    mvMatrix = mvMatrixStack.pop();
  };

  /**
   * Load an array of files and call callback when all complete.
   *
   * Based on source from here:
   * http://stackoverflow.com/questions/4878145/javascript-and-webgl-external-scripts
   */
  Util.loadFiles = function (urls, callback) {
    var numUrls = urls.length
      , numComplete = 0
      , result = []
    ;

    function partialCallback(text, urlIndex) {
      result[urlIndex] = text;
      numComplete += 1;

      if (numComplete == numUrls) {
        callback(result);
      }
    }

    for (var i = 0; i < numUrls; i += 1) {
      Util.loadFile(urls[i], i, partialCallback);
    }
  };

  Util.loadFile = function (filename, index, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", filename, false);
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        callback(request.responseText, index);
      }
    };
    request.send();
  };

  Util.loadShader = function (gl, type, shaderText) {
    var shader;

    switch (type) {
      case gl.FRAGMENT_SHADER:
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        break;
      case gl.VERTEX_SHADER:
        shader = gl.createShader(gl.VERTEX_SHADER);
        break;
      default:
        return null;
    }

    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  };

  /**
   * Transformes screen coordinates to world coordinates
   *
   * Code based on this source:
   *
   * http://stackoverflow.com/questions/10985487/android-opengl-es-2-0-screen-coordinates-to-world-coordinates
   */
  Util.screenToWorld = function (screenCoord) {
    var x = screenCoord[0]
      , y = gl.viewportHeight - screenCoord[1]
    ;

    var transMat = mat4.create()
      , worldCoord = vec4.create()
      , normalizedPoint
      , result
    ;

    normalizedPoint = vec4.fromValues(
      x * 2.0 / gl.viewportWidth - 1.0, y * 2.0 / gl.viewportHeight - 1.0,
      -1.0, 1.0
    );

    mat4.multiply(transMat, pMatrix, mvMatrix);
    mat4.invert(transMat, transMat);

    vec4.transformMat4(worldCoord, normalizedPoint, transMat);

    if (worldCoord[3] !== 0.0) {
      return vec3.fromValues(
        worldCoord[0] / worldCoord[3], worldCoord[1] / worldCoord[3], 0.0
      );
    } else {
      return vec3.fromValues(0.0, 0.0, 0.0);
    }
  };

  /**
   * Removes an object from an array
   */
  Util.arrayRemove = function (arr, obj) {
    var index = arr.indexOf(obj);
    if (index > -1) {
      arr.splice(index, 1);
    }
  };

  Util.uniformScale = function (scale) {
    var out = vec3.fromValues(scale, scale, scale);
    return out;
  };

}());
