// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform sampler2D background;
uniform sampler2D overlay;
uniform float time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 uv = vPosition.xy * 0.5 + 0.5;
    uv.y = 1.0 - uv.y;
    float rand = random(floor(uv * 10.0) + floor(time*5.0) / 5.0);
    // uv.x /= 4.0;
    vec3 overlay_color = texture2D(overlay, uv * 3.0 + rand).rgb - 30.0 / 255.0;
    float mask = (rand > 0.3 ? 1.0 : 0.0);
    vec3 final_color = texture2D(background, uv).rgb * mask  + overlay_color * (1.0 - mask);
    gl_FragColor = vec4(final_color, 1.0);
}