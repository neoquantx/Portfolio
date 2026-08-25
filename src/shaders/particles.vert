uniform float uTime;
uniform vec2 uMouse;
uniform float uScrollProgress;

attribute float size;
attribute float speed;
attribute float opacity;
attribute vec3 customColor;

varying vec3 vColor;
varying float vAlpha;

#include "./noise.glsl"

void main() {
    vColor = customColor;
    
    vec3 pos = position;
    
    // Organic floating motion using Perlin noise - slower and more graceful
    float noiseVal = snoise(vec3(pos.x * 0.02, pos.y * 0.02, uTime * speed * 0.1));
    pos.x += noiseVal * 0.8;
    pos.y += snoise(vec3(pos.y * 0.02, pos.z * 0.02, uTime * speed * 0.1)) * 0.8;
    pos.z += snoise(vec3(pos.z * 0.02, pos.x * 0.02, uTime * speed * 0.1)) * 0.8;
    
    // Gentle mouse repulsion
    vec3 mousePos = vec3(uMouse.x * 20.0, uMouse.y * 20.0, 0.0);
    float distToMouse = distance(pos.xy, mousePos.xy);
    if (distToMouse < 15.0) {
        vec2 dir = normalize(pos.xy - mousePos.xy);
        // Smoother, softer repulsion
        pos.xy += dir * smoothstep(15.0, 0.0, distToMouse) * 1.5;
    }
    
    // Add scroll drift
    pos.y += uScrollProgress * 15.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Distance-based opacity mixed with individual opacity
    float distAlpha = smoothstep(-60.0, -5.0, mvPosition.z) * smoothstep(15.0, -10.0, mvPosition.z);
    vAlpha = distAlpha * opacity * 0.8; // base transparency for ethereal look
    
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
