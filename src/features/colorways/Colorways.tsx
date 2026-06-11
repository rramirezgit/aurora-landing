'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { Flip, gsap, SplitText } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'

interface Colorway {
  id: string
  name: string
  rgb: string
  swatch: string
}

const COLORWAYS: Colorway[] = [
  { id: 'dawn', name: 'Dawn', rgb: '245,177,76', swatch: 'bg-[#f5b14c]' },
  { id: 'dusk', name: 'Dusk', rgb: '233,106,141', swatch: 'bg-[#e96a8d]' },
  { id: 'nebula', name: 'Nebula', rgb: '139,92,246', swatch: 'bg-[#8b5cf6]' },
]

const EMBER_COUNT = 16

const orbGradient = (rgb: string) =>
  `radial-gradient(circle at 50% 45%, rgba(${rgb},0.95) 0%, rgba(${rgb},0.4) 38%, transparent 70%)`

export function Colorways() {
  const [active, setActive] = useState(COLORWAYS[0])
  const scope = useRef<HTMLElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const orbWrapRef = useRef<HTMLDivElement>(null)
  const orbGlowRef = useRef<HTMLDivElement>(null)
  const rippleRef = useRef<HTMLSpanElement>(null)
  const embersRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const quickX = useRef<((value: number) => void) | null>(null)
  const quickY = useRef<((value: number) => void) | null>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const heading = SplitText.create('[data-cw-heading]', { type: 'words' })

      if (reducedMotion) return

      gsap.from(heading.words, {
        y: 28,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true },
      })

      gsap.from('[data-cw-swatch]', {
        y: 24,
        opacity: 0,
        scale: 0.7,
        stagger: 0.1,
        duration: 0.7,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: scope.current, start: 'top 65%', once: true },
      })

      gsap.to(orbWrapRef.current, {
        scale: 1.06,
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.to('[data-cw-shimmer]', { rotate: 360, duration: 14, ease: 'none', repeat: -1 })

      const embers = gsap.utils.toArray<HTMLElement>('[data-ember]')
      embers.forEach((ember, index) => {
        const drift = () => {
          gsap.set(ember, {
            x: gsap.utils.random(-150, 150),
            y: gsap.utils.random(60, 150),
            opacity: 0,
            scale: gsap.utils.random(0.5, 1.2),
          })
          gsap.to(ember, {
            y: gsap.utils.random(-160, -240),
            x: `+=${gsap.utils.random(-40, 40)}`,
            opacity: gsap.utils.random(0.4, 0.9),
            duration: gsap.utils.random(3.5, 6),
            ease: 'sine.out',
            onComplete: drift,
          })
          gsap.to(ember, {
            opacity: 0,
            duration: 1.4,
            delay: gsap.utils.random(2, 3.4),
            ease: 'power1.in',
          })
        }
        gsap.delayedCall(index * 0.28, drift)
      })

      quickX.current = gsap.quickTo(orbWrapRef.current, 'x', { duration: 0.6, ease: 'power3.out' })
      quickY.current = gsap.quickTo(orbWrapRef.current, 'y', { duration: 0.6, ease: 'power3.out' })

      return () => heading.revert()
    },
    { scope, dependencies: [reducedMotion] }
  )

  const handlePointer = (event: React.PointerEvent) => {
    if (reducedMotion || !scope.current) return
    const rect = scope.current.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) * 0.05
    const y = (event.clientY - rect.top - rect.height / 2) * 0.05
    quickX.current?.(x)
    quickY.current?.(y)
  }

  const select = (colorway: Colorway) => {
    if (ringRef.current && !reducedMotion) {
      flipState.current = Flip.getState(ringRef.current)
    }
    setActive(colorway)
  }

  useLayoutEffect(() => {
    if (flipState.current && ringRef.current) {
      Flip.from(flipState.current, { targets: ringRef.current, duration: 0.55, ease: 'power3.inOut' })
      flipState.current = null
    }

    if (reducedMotion) return

    if (orbGlowRef.current) {
      gsap.fromTo(
        orbGlowRef.current,
        { opacity: 0.4, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      )
    }

    if (rippleRef.current) {
      gsap.fromTo(
        rippleRef.current,
        { scale: 0.3, opacity: 0.7 },
        { scale: 1.6, opacity: 0, duration: 1, ease: 'power2.out' }
      )
    }
  }, [active, reducedMotion])

  return (
    <section
      ref={scope}
      onPointerMove={handlePointer}
      className="relative mx-auto max-w-6xl overflow-hidden px-6 py-[18vh] text-center"
    >
      <h2
        data-cw-heading
        className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-zinc-50"
      >
        One lamp. <span className="text-aurora">Every mood.</span>
      </h2>

      <div className="relative mx-auto mt-10 flex h-[46vmin] w-[46vmin] items-center justify-center">
        <div ref={embersRef} aria-hidden className="pointer-events-none absolute inset-0">
          {Array.from({ length: EMBER_COUNT }).map((_, index) => (
            <span
              key={index}
              data-ember
              style={{ backgroundColor: `rgb(${active.rgb})` }}
              className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full opacity-0 blur-[1px]"
            />
          ))}
        </div>

        <div ref={orbWrapRef} className="relative h-full w-full">
          <div
            data-cw-shimmer
            aria-hidden
            style={{
              background: `conic-gradient(from 0deg, transparent, rgba(${active.rgb},0.35), transparent 55%, rgba(${active.rgb},0.2), transparent)`,
            }}
            className="pointer-events-none absolute inset-[14%] rounded-full blur-md"
          />
          <div
            ref={orbGlowRef}
            aria-hidden
            style={{ background: orbGradient(active.rgb) }}
            className="pointer-events-none absolute inset-0 rounded-full blur-sm"
          />
          <span
            ref={rippleRef}
            aria-hidden
            style={{ borderColor: `rgba(${active.rgb},0.6)` }}
            className="pointer-events-none absolute inset-[20%] rounded-full border opacity-0"
          />
        </div>
      </div>

      <div role="radiogroup" aria-label="Colorway" className="mt-12 flex justify-center gap-8">
        {COLORWAYS.map((colorway) => (
          <button
            key={colorway.id}
            data-cw-swatch
            role="radio"
            aria-checked={active.id === colorway.id}
            onClick={() => select(colorway)}
            style={{ ['--sw' as string]: `rgb(${colorway.rgb})` }}
            className="group relative flex flex-col items-center gap-3 p-2"
          >
            <span
              className={`h-12 w-12 rounded-full transition-transform duration-300 group-hover:scale-110 ${colorway.swatch}`}
              data-cw-dot
            >
              {active.id === colorway.id && (
                <span
                  ref={ringRef}
                  data-flip-id="colorway-ring"
                  className="absolute -inset-0 m-1 block h-14 w-14 rounded-full border-2 border-zinc-200"
                />
              )}
            </span>
            <span
              className={`text-sm transition-colors ${
                active.id === colorway.id ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}
            >
              {colorway.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
