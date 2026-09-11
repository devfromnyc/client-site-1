import { useEffect, useRef, useState } from 'react'
import content from '../data/site-content.json'

const VIDEO_START = 9
const VIDEO_END = 36

export default function Hero() {
  const {
    subtitle,
    headlineLines,
    primaryCta,
    secondaryCta,
  } = content.hero

  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const handlePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = VIDEO_START

    const handleTimeUpdate = () => {
      if (video.currentTime >= VIDEO_END || video.currentTime < VIDEO_START) {
        video.currentTime = VIDEO_START
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-full min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 object-cover"
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-[70vmin] w-[70vmin] rounded-full border border-white/20" />
        <div className="absolute h-[55vmin] w-[55vmin] rounded-full border border-white/15" />
        <div className="absolute h-[40vmin] w-[40vmin] rounded-full border border-white/10" />
      </div>

      <button
        type="button"
        onClick={handlePlayPause}
        className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <div className="flex max-w-4xl flex-col items-center gap-6">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/80">
            {subtitle}
          </p>
          <h1 className="font-serif text-3xl font-medium leading-tight tracking-wide sm:text-4xl md:text-7xl lg:text-8xl">
            {headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href={primaryCta.href}
              className="rounded-md bg-beige px-8 py-3.5 text-sm font-medium text-ink transition hover:bg-beige-dark"
            >
              {primaryCta.label}
            </a>
            <a
              href={secondaryCta.href}
              className="rounded-md border border-white/80 bg-transparent px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
