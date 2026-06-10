'use client'

import { Suspense, type MutableRefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { Lamp } from './Lamp'

interface LampCanvasProps {
  progressRef: MutableRefObject<number>
  staticProgress?: number
}

export function LampCanvas({ progressRef, staticProgress }: LampCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.45, 6.2], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#cfd2ff" />
      <directionalLight position={[-4, 1, 3]} intensity={0.5} color="#e96a8d" />
      <Suspense fallback={null}>
        <Lamp progressRef={progressRef} staticProgress={staticProgress} />
      </Suspense>
    </Canvas>
  )
}
