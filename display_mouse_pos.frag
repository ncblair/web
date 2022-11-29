// Nathan Blair
precision highp float;

varying vec2 vPosition;

uniform vec2 mouse;

void main() {
    float dist = distance(vPosition, mouse);
    // dist = min(dist, distance(vPosition + vec2(2.0, 0.0), mouse));
    // dist = min(dist, distance(vPosition - vec2(2.0, 0.0), mouse));
    // dist = min(dist, distance(vPosition + vec2(2.0, 2.0), mouse));
    // dist = min(dist, distance(vPosition - vec2(2.0, 2.0), mouse));
    // dist = min(dist, distance(vPosition + vec2(2.0, -2.0), mouse));
    // dist = min(dist, distance(vPosition - vec2(2.0, -2.0), mouse));
    // dist = min(dist, distance(vPosition + vec2(0.0, 2.0), mouse));
    // dist = min(dist, distance(vPosition - vec2(0.0, 2.0), mouse));
    gl_FragColor = vec4(vec3(max(1.0 - 8.0*dist, 0.0)), 1.0);
}
