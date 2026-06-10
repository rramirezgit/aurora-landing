'use client'

import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { MathUtils } from 'three'

export interface LampPartConfig {
  id: string
  label: string
  assembledY: number
  explodedY: number
}

export const LAMP_PARTS: LampPartConfig[] = [
  { id: 'diffuser', label: 'Opal glass diffuser', assembledY: 1.05, explodedY: 1.9 },
  { id: 'ring', label: 'Adaptive light ring', assembledY: 0.78, explodedY: 1.15 },
  { id: 'body', label: 'Anodized aluminum body', assembledY: 0.28, explodedY: 0.3 },
  { id: 'base', label: 'Weighted smart base', assembledY: -0.5, explodedY: -0.95 },
]

const partY = (id: string, progress: number): number => {
  const part = LAMP_PARTS.find((candidate) => candidate.id === id)
  if (!part) return 0
  return MathUtils.lerp(part.assembledY, part.explodedY, progress)
}

interface LampProps {
  progressRef: MutableRefObject<number>
  staticProgress?: number
}

export function Lamp({ progressRef, staticProgress }: LampProps) {
  const group = useRef<Group>(null)
  const diffuser = useRef<Group>(null)
  const ring = useRef<Group>(null)
  const body = useRef<Group>(null)
  const base = useRef<Group>(null)
  const initial = staticProgress ?? 0
  const smoothed = useRef(initial)

  useFrame((state) => {
    const target = staticProgress ?? progressRef.current
    smoothed.current = MathUtils.lerp(smoothed.current, target, 0.12)
    const progress = smoothed.current

    diffuser.current?.position.setY(partY('diffuser', progress))
    ring.current?.position.setY(partY('ring', progress))
    body.current?.position.setY(partY('body', progress))
    base.current?.position.setY(partY('base', progress))

    if (group.current) {
      group.current.rotation.y =
        progress * Math.PI * 0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08
    }
  })

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      <group ref={diffuser} position-y={partY('diffuser', initial)}>
        <mesh>
          <sphereGeometry args={[0.62, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#fff7ed"
            emissive="#f5b14c"
            emissiveIntensity={0.9}
            roughness={0.35}
          />
        </mesh>
        <pointLight color="#f5b14c" intensity={6} distance={6} position={[0, 0.2, 0]} />
      </group>

      <group ref={ring} position-y={partY('ring', initial)}>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.55, 0.055, 24, 96]} />
          <meshStandardMaterial
            color="#1c1a22"
            emissive="#e96a8d"
            emissiveIntensity={1.4}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      </group>

      <group ref={body} position-y={partY('body', initial)}>
        <mesh>
          <cylinderGeometry args={[0.34, 0.42, 0.7, 48]} />
          <meshStandardMaterial color="#4a4555" roughness={0.35} metalness={0.8} />
        </mesh>
      </group>

      <group ref={base} position-y={partY('base', initial)}>
        <mesh>
          <cylinderGeometry args={[0.66, 0.72, 0.16, 56]} />
          <meshStandardMaterial color="#332e3d" roughness={0.45} metalness={0.7} />
        </mesh>
        <mesh position-y={0.09} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.5, 0.012, 12, 80]} />
          <meshStandardMaterial
            color="#0d0c11"
            emissive="#8b5cf6"
            emissiveIntensity={1.1}
          />
        </mesh>
      </group>
    </group>
  )
}
