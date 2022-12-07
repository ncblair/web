// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform sampler2D x;
uniform sampler2D x_prev;
uniform float a;
uniform float resolution;

void main() {
    vec2 uv = vPosition.xy * 0.5 + 0.5;
    uv.y = 1.0 - uv.y;
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    float prev_color = texture2D(x_prev, uv).r;
    float rolled = texture2D(x, uv + vec2(resolution, 0)).r + texture2D(x, uv + vec2(-resolution, 0)).r + texture2D(x, uv + vec2(0, resolution)).r + texture2D(x, uv + vec2(0, -resolution)).r;
    // float color = (prev_color + a * rolled) / (1.0 + 4.0 * a);
    // float n = 1.0 / norm_const;
    float color = (prev_color + a * rolled) / (1.0 + 4.0 * a);
    // gl_FragColor = vec4(vec3((prev_color + a * rolled)/(0.5 * normalizer)), 1.0);
    gl_FragColor = vec4(vec3(color), 1.0);
}
