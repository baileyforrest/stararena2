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
var loadFile;
var loadFiles;
var loadShader;

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

  /**
   * Load an array of files and call callback when all complete.
   *
   * Based on source from here:
   * http://stackoverflow.com/questions/4878145/javascript-and-webgl-external-scripts
   */
  loadFiles = function (urls, callback) {
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
      loadFile(urls[i], i, partialCallback);
    }
  };

  loadFile = function (filename, index, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", filename);
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        callback(request.responseText, index);
      }
    };
    request.send();
  };

  loadShader = function (gl, type, shaderText) {
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
