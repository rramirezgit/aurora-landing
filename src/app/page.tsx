import { Hero } from '@/features/hero/Hero'
import { Manifesto } from '@/features/manifesto/Manifesto'
import { Specs } from '@/features/specs/Specs'
import { Colorways } from '@/features/colorways/Colorways'
import { Finale } from '@/features/finale/Finale'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Specs />
      <Colorways />
      <Finale />
    </main>
  )
}
