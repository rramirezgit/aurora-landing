'use client'

import { useRef, type ReactNode } from 'react'
import { gsap } from '@/shared/animation/gsap'
import { useReducedMotion } from '@/shared/animation/useReducedMotion'

interface MagneticButtonProps {
  children: ReactNode
  href: string
}

export function MagneticButton({ children, href }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reducedMotion = useReducedMotion()

  const handleMove = (event: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    gsap.to(ref.current, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power3.out' })
  }

  const handleLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-block rounded-full bg-zinc-100 px-8 py-4 font-medium text-zinc-950 transition-colors hover:bg-white"
    >
      {children}
    </a>
  )
}
