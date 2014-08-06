/**
 * particle_fragment.glsl
 */

precision mediump float;

uniform vec4 uColor;
varying float vLifetime;

void main(void) {
  vec4 texColor;
  gl_FragColor = vec4(uColor);
  gl_FragColor.a *= vLifetime;
}
