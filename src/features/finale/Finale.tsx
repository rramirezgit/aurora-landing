'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'
import { MagneticButton } from '@/shared/ui/MagneticButton'

export function Finale() {
  const scope = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      const split = SplitText.create('[data-finale-title]', { type: 'lines', mask: 'lines' })

      gsap.from(split.lines, {
        yPercent: 110,
        stagger: 0.12,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true },
      })

      return () => split.revert()
    },
    { scope, dependencies: [reducedMotion] }
  )

  return (
    <section
      id="waitlist"
      ref={scope}
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        aria-hidden
        className="glow-orb pointer-events-none absolute bottom-[-40vmin] left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 opacity-60"
      />

      <h2
        data-finale-title
        className="font-display relative z-10 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] font-bold text-zinc-50"
      >
        Your light is about to get personal.
      </h2>

      <div className="relative z-10 mt-10">
        <MagneticButton href="https://github.com/rramirezgit/aurora-landing">
          Join the waitlist
        </MagneticButton>
      </div>

      <footer className="absolute bottom-6 z-10 text-xs text-zinc-600">
        AURORA is a fictional product — an animation craft showcase by{' '}
        <a
          href="https://github.com/rramirezgit"
          className="text-zinc-400 underline-offset-4 hover:underline"
        >
          Ricardo Ramirez
        </a>
        . Built with Next.js, GSAP & Lenis.
      </footer>
    </section>
  )
}
