'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'

const INTERACTIVE = 'a, button, [role="radio"], [role="button"], input, [data-cursor="hover"]'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return

    document.documentElement.classList.add('cursor-none')

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const onOver = (event: PointerEvent) => {
      if ((event.target as Element)?.closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 2.2, borderColor: 'rgba(245,177,76,0.9)', duration: 0.3 })
        gsap.to(dot, { scale: 0, duration: 0.3 })
      }
    }

    const onOut = (event: PointerEvent) => {
      if ((event.target as Element)?.closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.6)', duration: 0.3 })
        gsap.to(dot, { scale: 1, duration: 0.3 })
      }
    }

    gsap.set([dot, ring], { opacity: 1 })
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    window.addEventListener('pointerout', onOut)

    return () => {
      document.documentElement.classList.remove('cursor-none')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
    }
  }, [reducedMotion])

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[60] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 opacity-0 mix-blend-difference"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[60] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 mix-blend-difference"
      />
    </>
  )
}
