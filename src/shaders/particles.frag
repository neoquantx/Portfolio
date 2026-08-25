varying vec3 vColor;
varying float vAlpha;
uniform vec3 uColor;

void main() {
    // Circular particle shape with soft edge for light dust look
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;
    
    // Exponential falloff for softer glow
    float glow = exp(-r * 3.0);
    
    vec3 finalColor = mix(vColor, uColor, 0.3);
    
    gl_FragColor = vec4(finalColor, vAlpha * glow);
}
