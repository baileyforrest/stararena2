/**
 * Basic Fragment shader to emulate fixed functionality pipeline
 */
precision mediump float;

varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}
