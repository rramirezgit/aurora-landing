'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'
import { LAMP_PARTS } from '@/shared/webgl/Lamp'

const LampCanvas = dynamic(
  () => import('@/shared/webgl/LampCanvas').then((module) => module.LampCanvas),
  { ssr: false, loading: () => <div className="h-full w-full" /> }
)

export function Anatomy() {
  const scope = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-anatomy-pin]',
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 0.4,
          onUpdate: (self) => {
            progressRef.current = self.progress
          },
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-anatomy-label]').forEach((label, index) => {
        timeline.fromTo(
          label,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.12, ease: 'none' },
          0.18 + index * 0.18
        )
      })
    },
    { scope, dependencies: [reducedMotion] }
  )

  return (
    <section ref={scope} aria-label="Lamp anatomy">
      <div data-anatomy-pin className="relative flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <LampCanvas
            progressRef={progressRef}
            staticProgress={reducedMotion ? 0.85 : undefined}
          />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-zinc-50">
              Four parts. <span className="text-aurora">Zero noise.</span>
            </h2>
            <ul className="mt-10 space-y-6">
              {LAMP_PARTS.map((part) => (
                <li
                  key={part.id}
                  data-anatomy-label
                  className={reducedMotion ? '' : 'opacity-0'}
                >
                  <p className="font-display text-lg font-semibold text-zinc-100">
                    {part.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
