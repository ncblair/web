// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform sampler2D inputTexture;

void main() {
    vec4 color = texture2D(inputTexture, vPosition);
    gl_FragColor = vec4(vec3(color.rgb) + 1.0/1000.0, color.a);
}
