'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'

const SPECS = [
  { value: 16, suffix: 'M', label: 'colors, individually tuned' },
  { value: 6500, suffix: 'K', label: 'max color temperature' },
  { value: 12, suffix: 'W', label: 'full brightness draw' },
  { value: 60, suffix: 's', label: 'from box to glowing' },
]

export function Specs() {
  const scope = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      gsap.utils.toArray<HTMLElement>('[data-spec-value]').forEach((element) => {
        const target = Number(element.dataset.specValue)
        const counter = { value: 0 }

        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: 'power2.out',
          snap: { value: 1 },
          scrollTrigger: { trigger: element, start: 'top 85%', once: true },
          onUpdate: () => {
            element.textContent = String(Math.round(counter.value))
          },
        })
      })

      gsap.from('[data-spec-card]', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope.current, start: 'top 75%', once: true },
      })
    },
    { scope, dependencies: [reducedMotion] }
  )

  return (
    <section ref={scope} className="mx-auto max-w-6xl px-6 py-[18vh]">
      <h2 className="font-display mb-16 text-[clamp(2rem,5vw,3.5rem)] font-bold text-zinc-50">
        Engineered to <span className="text-aurora">disappear</span>.
      </h2>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4">
        {SPECS.map((spec) => (
          <div key={spec.label} data-spec-card>
            <dt className="sr-only">{spec.label}</dt>
            <dd className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-none font-bold text-zinc-50 tabular-nums">
              <span data-spec-value={spec.value}>{spec.value}</span>
              <span className="text-aurora">{spec.suffix}</span>
            </dd>
            <p className="mt-3 text-sm text-zinc-500">{spec.label}</p>
          </div>
        ))}
      </dl>
    </section>
  )
}
