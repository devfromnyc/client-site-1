import { useEffect, useRef, useState } from 'react'
import content from '../data/site-content.json'

const PATH_D =
  'M 500 360 C 500 480, 200 530, 200 700 C 200 860, 500 900, 500 1060 C 500 1220, 800 1260, 800 1430 C 800 1500, 500 1540, 500 1580'

const NODE_POSITIONS = [
  { x: 500, y: 360 },
  { x: 200, y: 700 },
  { x: 500, y: 1060 },
  { x: 800, y: 1430 },
]


export default function ProgressSection() {
  const containerRef = useRef(null)
  const pathRef = useRef(null)
  const [pathLength, setPathLength] = useState(0)
  const [progress, setProgress] = useState(0)
  const { backgroundImage, steps } = content.progress

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [])

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

  const dashOffset = pathLength * (1 - progress)

  return (
    <section
      id="consultations"
      ref={containerRef}
      className="relative h-[750vh] md:h-[600vh] lg:h-[500vh]"
    >
      <div className="sticky top-0 h-screen overflow-visible">
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

        <div className="relative z-10 mx-auto h-full max-w-6xl px-4 pb-20 pt-40 md:px-6 md:pb-16 md:pt-44">
          <svg
            viewBox="0 0 1000 1600"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d={PATH_D}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="4"
            />
            <path
              d={PATH_D}
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
            {NODE_POSITIONS.map((pos, i) => {
              const stepProgress = (i + 1) / steps.length
              const active = progress >= stepProgress - 0.1
              return (
                <circle
                  key={pos.y}
                  cx={pos.x}
                  cy={pos.y}
                  r={active ? 16 : 10}
                  fill={active ? 'white' : 'rgba(255,255,255,0.4)'}
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>

          {steps.map((step, i) => {
            const n = steps.length
            const enterAt = Math.max(0, (i - 0.05) / n)
            const exitAt = i < n - 1 ? (i + 1.2) / n : 1
            const visible = progress >= enterAt && progress < exitAt
            const pos = NODE_POSITIONS[i] ?? NODE_POSITIONS[NODE_POSITIONS.length - 1]
            const isLeft = i % 2 === 0
            const topPct = Math.max((pos.y / 1600) * 100, i === 0 ? 28 : 22)

            return (
              <div
                key={step.title}
                className={`absolute w-[calc(100%-2rem)] max-w-[18rem] transition-all duration-700 sm:max-w-xs md:w-[40%] md:max-w-sm ${
                  isLeft
                    ? 'left-4 text-left md:left-10'
                    : 'right-4 text-left md:right-10'
                } ${
                  visible
                    ? 'translate-y-0 opacity-100 md:-translate-y-1/2'
                    : 'translate-y-5 opacity-0 md:translate-y-[calc(-50%+1.25rem)]'
                }`}
                style={{
                  top: `${topPct}%`,
                }}
              >
                <h3 className="font-serif text-lg font-medium leading-snug text-white sm:text-xl md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">
                  {step.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
