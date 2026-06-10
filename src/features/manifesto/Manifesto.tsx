'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'

const MANIFESTO =
  'Your room is not a spec sheet. It is dawn meetings, midnight ideas, slow Sunday mornings. Aurora reads the rhythm of your day and paints the light to match it — sixteen million colors, one intention: yours.'

export function Manifesto() {
  const scope = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      const split = SplitText.create('[data-manifesto]', { type: 'words' })

      gsap.fromTo(
        split.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: true,
          },
        }
      )

      return () => split.revert()
    },
    { scope, dependencies: [reducedMotion] }
  )

  return (
    <section ref={scope} className="mx-auto max-w-4xl px-6 py-[28vh]">
      <p
        data-manifesto
        className="font-display text-[clamp(1.6rem,4vw,3rem)] leading-snug font-medium text-zinc-100"
      >
        {MANIFESTO}
      </p>
    </section>
  )
}
