'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'

export function PointerGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const glow = glowRef.current
    if (!glow || reducedMotion) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const moveX = gsap.quickTo(glow, 'x', { duration: 0.9, ease: 'power3.out' })
    const moveY = gsap.quickTo(glow, 'y', { duration: 0.9, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      moveX(event.clientX)
      moveY(event.clientY)
      gsap.to(glow, { opacity: 1, duration: 0.5, overwrite: 'auto' })
    }

    const onLeave = () => gsap.to(glow, { opacity: 0, duration: 0.6 })

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [reducedMotion])

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen"
      style={{
        background:
          'radial-gradient(circle, rgba(245,177,76,0.10) 0%, rgba(233,106,141,0.07) 35%, rgba(139,92,246,0.05) 55%, transparent 70%)',
        filter: 'blur(20px)',
      }}
    />
  )
}
