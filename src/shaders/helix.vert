uniform float uTime;
uniform float uScrollProgress;
varying float vGlow;

#pragma glslify: snoise = require('./noise.glsl')

void main() {
    vec3 pos = position;
    
    // Twist based on scroll progress
    float angle = pos.y * 0.5 + uScrollProgress * 10.0;
    float s = sin(angle);
    float c = cos(angle);
    
    float nx = pos.x * c - pos.z * s;
    float nz = pos.x * s + pos.z * c;
    
    pos.x = nx;
    pos.z = nz;
    
    // Bioluminescent pulse
    vGlow = (sin(uTime * 2.0 + pos.y) + 1.0) * 0.5;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
