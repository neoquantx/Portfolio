uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

#pragma glslify: snoise = require('./noise.glsl')

void main() {
    vNormal = normal;
    
    vec3 pos = position;
    
    // Breathing/pulsing effect based on uTime and position
    float displacement = snoise(vec3(pos.x * 0.1, pos.y * 0.1, uTime * 0.5)) * 0.2;
    pos += normal * displacement;
    
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
