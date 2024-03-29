/**
 * globals.js
 *
 * Global variables
 */
/* global gl:true, mvMatrix:true, pMatrix:true */

/** The gl context */
var gl;

/** The 2d canvas context */
var ctx2d;

/** The model view matrix */
var mvMatrix = mat4.create();

/** The perspective matrix */
var pMatrix = mat4.create();

/** Keyboard input controller */
var controller;

/** The stage */
var stage;

/** The player */
var player;

/** The UI */
var hud;
