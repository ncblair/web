// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform sampler2D field;
uniform sampler2D forces;
uniform float dt;

void main() {
    vec2 uv = vPosition.xy * 0.5 + 0.5;

    // gl_FragColor.a = 1.0;
    // gl_FragColor.rgb = vec3(1.0);
    gl_FragColor = vec4(vec3(texture2D(field, uv).rgb * dt * texture2D(forces, uv).rgb), 1.0);
    // gl_FragColor.rgb += texture2D(forces, uv).rgb;
    
    // gl_FragColor = vec4(1.0);
}
