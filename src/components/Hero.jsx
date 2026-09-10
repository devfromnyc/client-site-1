import { useEffect, useRef, useState } from 'react'
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
  const [isPlaying, setIsPlaying] = useState(true)
  const [isVideoReady, setIsVideoReady] = useState(false)

  const handlePlayPause = () => {
    const player = playerRef.current
    if (!player) return

    try {
      const state = player.getPlayerState?.()
      if (state === 1) {
        player.pauseVideo?.()
        setIsPlaying(false)
      } else {
        player.playVideo?.()
        setIsPlaying(true)
      }
    } catch {
      /* player may not be ready */
    }
  }

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
            // start,  // TEST: commenting out to see if this fixes the delay/play button issue
          },
          events: {
            onReady: (event) => {
              event.target.mute()
              event.target.playVideo()
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.ENDED) {
                restartWindow(event.target)
              }
              if (event.data === YT.PlayerState.PLAYING) {
                setIsPlaying(true)
                setIsVideoReady(true)
              } else if (event.data === YT.PlayerState.PAUSED) {
                setIsPlaying(false)
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
        className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 [&_iframe]:absolute [&_iframe]:left-1/2 [&_iframe]:top-1/2 [&_iframe]:h-[56.25vw] [&_iframe]:min-h-full [&_iframe]:w-full [&_iframe]:min-w-[177.78vh] [&_iframe]:-translate-x-1/2 [&_iframe]:-translate-y-1/2 [&_iframe]:border-0 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        <div ref={hostRef} className="h-full w-full" title="Hero background video" />
      </div>

      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
        style={
          videoPoster
            ? { backgroundImage: `url(${videoPoster})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />

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
