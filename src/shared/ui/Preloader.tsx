'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'

const SIGNALS = ['fonts', 'load'] as const

export function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    let completed = 0

    const advance = () => {
      completed += 1
      const progress = completed / SIGNALS.length

      if (barRef.current) {
        gsap.to(barRef.current, { scaleX: progress, duration: 0.4, ease: 'power2.out' })
      }

      if (completed === SIGNALS.length) {
        gsap.to(overlayRef.current, {
          autoAlpha: 0,
          duration: reducedMotion ? 0 : 0.6,
          delay: reducedMotion ? 0 : 0.25,
          ease: 'power2.inOut',
          onComplete: () => setDone(true),
        })
      }
    }

    void document.fonts.ready.then(advance)

    if (document.readyState === 'complete') {
      advance()
    } else {
      window.addEventListener('load', advance, { once: true })
      return () => window.removeEventListener('load', advance)
    }
  }, [reducedMotion])

  if (done) return null

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#08070b]"
    >
      <span className="font-display text-sm font-bold tracking-[0.5em] text-zinc-400">
        AURORA
      </span>
      <div className="h-px w-40 overflow-hidden bg-white/10">
        <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-zinc-200" />
      </div>
    </div>
  )
}
