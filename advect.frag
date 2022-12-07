// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform sampler2D prev;
uniform sampler2D vel_x;
uniform sampler2D vel_y;
uniform float dt;

void main() {
    vec2 uv = vPosition.xy * 0.5 + 0.5;
    vec2 p = uv - dt * 2.0 * (vec2(texture2D(vel_x, uv).x, texture2D(vel_y, uv).x) - 0.5);
    gl_FragColor = texture2D(prev, p);
}