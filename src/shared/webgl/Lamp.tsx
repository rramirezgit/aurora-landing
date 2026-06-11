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
  { id: 'diffuser', label: 'Opal glass dome', assembledY: 0.34, explodedY: 1.45 },
  { id: 'ring', label: 'Adaptive light ring', assembledY: 0.32, explodedY: 0.78 },
  { id: 'body', label: 'Aluminum stem', assembledY: -0.28, explodedY: -0.18 },
  { id: 'base', label: 'Weighted smart base', assembledY: -0.95, explodedY: -1.5 },
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
      const interactive = staticProgress === undefined
      const pointerYaw = interactive ? state.pointer.x * 0.3 : 0
      const pointerPitch = interactive ? -state.pointer.y * 0.14 : 0
      group.current.rotation.y =
        progress * Math.PI * 0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08 + pointerYaw
      group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, pointerPitch, 0.08)
    }
  })

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      <group ref={diffuser} position-y={partY('diffuser', initial)}>
        <mesh>
          <sphereGeometry args={[0.58, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial
            color="#fff7ed"
            emissive="#f5b14c"
            emissiveIntensity={1.1}
            roughness={0.25}
            transparent
            opacity={0.95}
          />
        </mesh>
        <pointLight color="#f5b14c" intensity={7} distance={6} position={[0, 0.1, 0]} />
      </group>

      <group ref={ring} position-y={partY('ring', initial)}>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.2, 0.035, 24, 96]} />
          <meshStandardMaterial
            color="#1c1a22"
            emissive="#e96a8d"
            emissiveIntensity={1.6}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      </group>

      <group ref={body} position-y={partY('body', initial)}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.095, 1.2, 48]} />
          <meshStandardMaterial color="#cfd0d6" roughness={0.25} metalness={0.9} />
        </mesh>
      </group>

      <group ref={base} position-y={partY('base', initial)}>
        <mesh>
          <cylinderGeometry args={[0.55, 0.62, 0.1, 64]} />
          <meshStandardMaterial color="#3a3543" roughness={0.4} metalness={0.75} />
        </mesh>
        <mesh position-y={-0.06} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.52, 0.014, 12, 96]} />
          <meshStandardMaterial color="#0d0c11" emissive="#8b5cf6" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  )
}
