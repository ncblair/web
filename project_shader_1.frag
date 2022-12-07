// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform sampler2D vel_x;
uniform sampler2D vel_y;
uniform float h;
uniform float resolution;

void main() {
    vec2 uv = vPosition.xy * 0.5 + 0.5;
    float r = 1.0 / resolution;
    gl_FragColor = vec4(vec3(-0.5 * h * (texture2D(vel_x, uv + vec2(r, 0.0)) - texture2D(vel_x, uv - vec2(r, 0.0)) + texture2D(vel_y, uv - vec2(0.0, r)) - texture2D(vel_y, uv + vec2(0.0, r)))), 1.0);
}
