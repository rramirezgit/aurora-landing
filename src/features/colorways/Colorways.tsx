'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { Flip, gsap } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'

const COLORWAYS = [
  {
    id: 'dawn',
    name: 'Dawn',
    swatch: 'bg-[#f5b14c]',
    gradient:
      'radial-gradient(circle at 50% 45%, rgba(245,177,76,0.9) 0%, rgba(245,177,76,0.35) 40%, transparent 70%)',
  },
  {
    id: 'dusk',
    name: 'Dusk',
    swatch: 'bg-[#e96a8d]',
    gradient:
      'radial-gradient(circle at 50% 45%, rgba(233,106,141,0.9) 0%, rgba(233,106,141,0.35) 40%, transparent 70%)',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    swatch: 'bg-[#8b5cf6]',
    gradient:
      'radial-gradient(circle at 50% 45%, rgba(139,92,246,0.9) 0%, rgba(139,92,246,0.35) 40%, transparent 70%)',
  },
]

export function Colorways() {
  const [active, setActive] = useState(COLORWAYS[0])
  const ringRef = useRef<HTMLSpanElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const reducedMotion = useReducedMotion()

  const select = (colorway: (typeof COLORWAYS)[number]) => {
    if (ringRef.current && !reducedMotion) {
      flipState.current = Flip.getState(ringRef.current)
    }
    setActive(colorway)
  }

  useLayoutEffect(() => {
    if (flipState.current && ringRef.current) {
      Flip.from(flipState.current, {
        targets: ringRef.current,
        duration: 0.55,
        ease: 'power3.inOut',
      })
      flipState.current = null
    }
    if (orbRef.current && !reducedMotion) {
      gsap.fromTo(orbRef.current, { opacity: 0.55 }, { opacity: 1, duration: 0.8 })
    }
  }, [active, reducedMotion])

  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-6 py-[18vh] text-center">
      <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-zinc-50">
        One lamp. <span className="text-aurora">Every mood.</span>
      </h2>

      <div
        ref={orbRef}
        aria-hidden
        style={{ background: active.gradient }}
        className="pointer-events-none mx-auto mt-8 h-[46vmin] w-[46vmin] rounded-full blur-sm"
      />

      <div role="radiogroup" aria-label="Colorway" className="mt-10 flex justify-center gap-6">
        {COLORWAYS.map((colorway) => (
          <button
            key={colorway.id}
            role="radio"
            aria-checked={active.id === colorway.id}
            onClick={() => select(colorway)}
            className="group relative flex flex-col items-center gap-3 p-2"
          >
            <span className={`h-12 w-12 rounded-full ${colorway.swatch}`}>
              {active.id === colorway.id && (
                <span
                  ref={ringRef}
                  data-flip-id="colorway-ring"
                  className="absolute -inset-0 m-1 block h-14 w-14 rounded-full border-2 border-zinc-200"
                />
              )}
            </span>
            <span
              className={`text-sm ${active.id === colorway.id ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'}`}
            >
              {colorway.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
