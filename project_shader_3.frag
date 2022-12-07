// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform sampler2D inp;
uniform sampler2D p;
uniform float h;
uniform float resolution;

void main() {
    vec2 uv = vPosition.xy * 0.5 + 0.5;
    float r = 1.0 / resolution;
    vec3 color = texture2D(inp, uv).rgb;
    gl_FragColor = vec4(color - 0.5 * (texture2D(p, uv + vec2(0.0, r)).rgb - texture2D(p, uv - vec2(0.0, r)).rgb) / h, 1.0);
}