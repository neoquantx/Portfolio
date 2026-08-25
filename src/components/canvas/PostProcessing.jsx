import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

export default function PostProcessing({ 
  enableNoise = true, 
  bloomIntensity = 0.4, 
  aberrationOffset = 0.0008 
}) {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom 
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(aberrationOffset, aberrationOffset)}
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
