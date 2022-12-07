// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform vec2 mouse;
// uniform vec2 mouse_vel;
uniform float time;

void main() {
    vec2 uv = vPosition * 0.5 + 0.5;
    // gl_FragColor = vec4(vec3(0.3), 1.0);
    // gl_FragColor = vec4(vec3(0.5 * vPosition.x * sin(time)), 1.0);
    float dist = distance(vPosition, mouse);
    if (dist < 0.2) {
        gl_FragColor = vec4(vec3(0.5 + 0.5 * sin(mouse.y * 10.0)), 1.0);
    } else {
        gl_FragColor = vec4(vec3(0.5), 1.0);
    }
}
