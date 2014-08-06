/**
 * particle_vertex.glsl
 */

uniform float uTime;
uniform vec3 uScale;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

attribute float aLifetime;
attribute vec3 aStartPosition;
attribute vec3 aEndPosition;
attribute vec2 aOffset;

varying float vLifetime;

void main(void) {
  if (uTime <= aLifetime) {
    gl_Position.xyz = aStartPosition + (uTime * aEndPosition) * uScale;
    gl_Position.w = 1.0;
  } else {
    gl_Position = vec4(-1000, -1000, 0, 0);
  }

  vLifetime = 1.0 - (uTime / aLifetime);
  vLifetime = clamp(vLifetime, 0.0, 1.0);
  float size = 0.05;
  gl_Position.xy += aOffset.xy * size;

  gl_Position = uPMatrix * uMVMatrix * vec4(gl_Position.xyz, 1.0);
}
