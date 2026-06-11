'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'
import { MagneticButton } from '@/shared/ui/MagneticButton'

export function Hero() {
  const scope = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      const split = SplitText.create('[data-hero-title]', {
        type: 'chars',
        charsClass: 'hero-char',
      })
      gsap.set(split.chars, { transformOrigin: '50% 100%', transformPerspective: 600 })
      const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } })

      timeline
        .from(split.chars, {
          yPercent: 120,
          rotateX: -75,
          opacity: 0,
          filter: 'blur(14px)',
          stagger: 0.06,
          duration: 1.2,
        })
        .from('[data-hero-orb]', { scale: 0.4, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0.25)
        .from('[data-hero-tagline]', { y: 24, opacity: 0, duration: 0.8 }, '-=1')
        .from('[data-hero-cta]', { y: 16, opacity: 0, duration: 0.6 }, '-=0.5')
        .from('[data-hero-hint]', { opacity: 0, duration: 0.8 }, '-=0.2')

      gsap.to('[data-hero-orb]', {
        yPercent: 18,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      return () => split.revert()
    },
    { scope, dependencies: [reducedMotion] }
  )

  return (
    <section
      ref={scope}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <div
        data-hero-orb
        aria-hidden
        className="glow-orb pointer-events-none absolute top-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-[58%]"
      />

      <p data-hero-tagline className="relative z-10 mb-4 text-sm tracking-[0.4em] text-zinc-400 uppercase">
        Light that understands you
      </p>

      <h1
        data-hero-title
        className="hero-aurora-text font-display relative z-10 text-center text-[clamp(4rem,18vw,15rem)] leading-[0.9] font-bold tracking-tight"
      >
        AURORA
      </h1>

      <div data-hero-cta className="relative z-10 mt-10">
        <MagneticButton href="#waitlist">Join the waitlist</MagneticButton>
      </div>

      <p
        data-hero-hint
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-widest text-zinc-600 uppercase"
      >
        Scroll to explore
      </p>
    </section>
  )
}
