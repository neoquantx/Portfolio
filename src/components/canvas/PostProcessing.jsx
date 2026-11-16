import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// Low tier: Vignette only (no Bloom/CA) — keeps 60fps on phones with 8500+ particles
// High tier: full Bloom + ChromaticAberration + Vignette as before
export default function PostProcessing({ 
  enableNoise = true, 
  bloomIntensity = 0.4, 
  aberrationOffset = 0.0008,
  quality = 'high'
}) {
  if (quality === 'low') {
    return (
      <EffectComposer disableNormalPass multisampling={0} frameBufferType={THREE.HalfFloatType}>
        <Vignette eskil={false} offset={0.1} darkness={0.7} />
      </EffectComposer>
    )
  }
  // Cache aberration offset vector to avoid new allocation per render
  const aberrationVec = new THREE.Vector2(aberrationOffset, aberrationOffset)
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom 
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={aberrationVec}
      />
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={0.7}
      />
      {enableNoise && (
        <Noise 
          premultiply 
          blendFunction={BlendFunction.ADD} 
          opacity={0.03} 
        />
      )}
    </EffectComposer>
  )
}
