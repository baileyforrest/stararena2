/**
 * util.js
 *
 * Utility functions
 */

/* global mvMatrix:true */

var mvPushMatrix;
var mvPopMatrix;
var degToRad;
var getShader;

(function () {
  "use strict";

  var mvMatrixStack = [];

  mvPushMatrix = function () {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
  };

  mvPopMatrix = function () {
    if (mvMatrixStack.length === 0) {
      throw "Invalid popMatrix!";
    }

    mvMatrix = mvMatrixStack.pop();
  };

  degToRad = function (degrees) {
    return degrees * Math.PI / 180;
  };

  getShader = function (gl, id) {
    var shaderScript, str, k, shader;
    shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    str = "";
    k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  };

}());
