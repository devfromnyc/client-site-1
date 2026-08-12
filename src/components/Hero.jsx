import { useEffect, useRef } from 'react'
import content from '../data/site-content.json'
import { shouldRestartHeroLoop } from '../lib/heroLoop'

function loadYouTubeApi() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube API requires a browser'))
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT)
  }

  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous()
      resolve(window.YT)
    }

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
}

export default function Hero() {
  const {
    subtitle,
    headlineLines,
    videoPoster,
    youtubeVideoId = 'vQkqavvta7I',
    youtubeStartSeconds = 4,
    youtubeEndSeconds = 40,
    primaryCta,
    secondaryCta,
  } = content.hero

  const hostRef = useRef(null)
  const playerRef = useRef(null)
  const pollRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    const start = Number(youtubeStartSeconds)
    const end = Number(youtubeEndSeconds)

    const restartWindow = (player) => {
      if (!player?.seekTo) return
      player.seekTo(start, true)
      player.playVideo?.()
    }

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return

        playerRef.current = new YT.Player(hostRef.current, {
          videoId: youtubeVideoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            start,
          },
          events: {
            onReady: (event) => {
              event.target.mute()
              restartWindow(event.target)
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.ENDED) {
                restartWindow(event.target)
              }
            },
          },
        })

        pollRef.current = window.setInterval(() => {
          const player = playerRef.current
          if (!player?.getCurrentTime) return
          try {
            const t = player.getCurrentTime()
            if (shouldRestartHeroLoop(t, start, end)) {
              restartWindow(player)
            }
          } catch {
            /* player may not be ready yet */
          }
        }, 250)

        if (import.meta.env.DEV) {
          window.__heroYtPlayer = playerRef
        }
      })
      .catch((error) => {
        console.error('[hero] YouTube API failed to load', error)
      })

    return () => {
      cancelled = true
      window.clearInterval(pollRef.current)
      try {
        playerRef.current?.destroy?.()
      } catch {
        /* ignore */
      }
      playerRef.current = null
      if (import.meta.env.DEV && window.__heroYtPlayer === playerRef) {
        delete window.__heroYtPlayer
      }
    }
  }, [youtubeVideoId, youtubeStartSeconds, youtubeEndSeconds])

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden [&_iframe]:absolute [&_iframe]:left-1/2 [&_iframe]:top-1/2 [&_iframe]:h-[56.25vw] [&_iframe]:min-h-full [&_iframe]:w-full [&_iframe]:min-w-[177.78vh] [&_iframe]:-translate-x-1/2 [&_iframe]:-translate-y-1/2 [&_iframe]:border-0"
        aria-hidden="true"
        style={
          videoPoster
            ? { backgroundImage: `url(${videoPoster})`, backgroundSize: 'cover' }
            : undefined
        }
      >
        <div ref={hostRef} className="h-full w-full" title="Hero background video" />
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
