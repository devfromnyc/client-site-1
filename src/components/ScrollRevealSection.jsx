import { useEffect, useRef, useState } from 'react'
import content from '../data/site-content.json'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function linearSegment(progress, start, end) {
  if (progress <= start) return 0
  if (progress >= end) return 1
  return (progress - start) / (end - start)
}

function easeInCubic(t) {
  return t * t * t
}

function progressiveBlur(sharpness, maxBlur) {
  return maxBlur * (1 - easeInCubic(clamp(sharpness, 0, 1)))
}

const MAX_BLUR = 20

export default function ScrollRevealSection() {
  const containerRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const { headlineLines, body } = content.about
  const bodyLines = body.split(/(?<=[.!?])\s+/).filter(Boolean)

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable)
      setProgress(scrollable > 0 ? scrolled / scrollable : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerFade = linearSegment(progress, 0.34, 0.52)
  const headerVisible = progress < 0.52

  const paragraphVisible = progress >= 0.5
  const paragraphOpacity = paragraphVisible
    ? clamp(easeInCubic(linearSegment(progress, 0.5, 0.6)) * 0.85 + 0.15, 0, 1)
    : 0

  function headerLineStyle(index) {
    const stagger = index * 0.04
    const sharpIn = easeInCubic(linearSegment(progress, 0 + stagger, 0.26 + stagger))
    const sharpOut = easeInCubic(linearSegment(progress, 0.34 + stagger, 0.52 + stagger))
    const sharpness = progress < 0.34 ? sharpIn : Math.max(0, 1 - sharpOut)
    const opacity = progress < 0.34
      ? clamp(easeInCubic(linearSegment(progress, 0 + stagger, 0.14 + stagger)) * 0.9 + 0.1, 0, 1)
      : Math.max(0, 1 - easeInCubic(headerFade))

    return {
      opacity,
      filter: `blur(${progressiveBlur(sharpness, MAX_BLUR)}px)`,
    }
  }

  function bodyLineStyle(index) {
    const stagger = index * 0.05
    const sharpness = easeInCubic(linearSegment(progress, 0.5 + stagger, 0.88 + stagger))

    return {
      filter: `blur(${progressiveBlur(sharpness, MAX_BLUR)}px)`,
    }
  }

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative h-[500vh] bg-beige md:h-[450vh]"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 opacity-30" aria-hidden="true">
          <svg viewBox="0 0 120 800" className="h-full w-full" preserveAspectRatio="none">
            <path d="M0 0 Q80 200 40 400 Q0 600 60 800" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
            <path d="M20 0 Q100 200 60 400 Q20 600 80 800" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
            <path d="M40 0 Q120 200 80 400 Q40 600 100 800" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 opacity-30" aria-hidden="true">
          <svg viewBox="0 0 120 800" className="h-full w-full" preserveAspectRatio="none">
            <path d="M120 0 Q40 200 80 400 Q120 600 60 800" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
            <path d="M100 0 Q20 200 60 400 Q100 600 40 800" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
            <path d="M80 0 Q0 200 40 400 Q80 600 20 800" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-4xl items-center justify-center">
          <h2
            className="absolute w-full px-2 text-center font-serif text-5xl font-medium leading-tight text-ink md:text-7xl lg:text-8xl"
            style={{
              pointerEvents: headerVisible ? 'auto' : 'none',
              willChange: 'opacity, filter',
            }}
          >
            {headlineLines.map((line, index) => (
              <span
                key={line}
                className="block transition-none"
                style={headerLineStyle(index)}
              >
                {line}
              </span>
            ))}
          </h2>

          <div
            className="absolute w-full max-w-2xl px-2 text-center text-lg leading-relaxed text-ink/70 md:text-xl"
            style={{
              opacity: paragraphOpacity,
              pointerEvents: paragraphVisible ? 'auto' : 'none',
              willChange: 'opacity, filter',
            }}
          >
            {bodyLines.map((line, index) => (
              <span
                key={line}
                className="block transition-none"
                style={bodyLineStyle(index)}
              >
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
