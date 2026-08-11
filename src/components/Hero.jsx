import content from '../data/site-content.json'

export default function Hero() {
  const {
    subtitle,
    headlineLines,
    videoPoster,
    youtubeVideoId = 'vQkqavvta7I',
    youtubeStartSeconds = 8,
    primaryCta,
    secondaryCta,
  } = content.hero

  const embedSrc = [
    `https://www.youtube.com/embed/${youtubeVideoId}`,
    `?autoplay=1`,
    `&mute=1`,
    `&controls=0`,
    `&playsinline=1`,
    `&loop=1`,
    `&playlist=${youtubeVideoId}`,
    `&start=${youtubeStartSeconds}`,
    `&modestbranding=1`,
    `&rel=0`,
    `&showinfo=0`,
    `&iv_load_policy=3`,
    `&disablekb=1`,
  ].join('')

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Scale 16:9 embed to cover the viewport like object-fit: cover */}
        <iframe
          title="Hero background video"
          src={embedSrc}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={false}
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-full min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
          style={
            videoPoster
              ? { backgroundImage: `url(${videoPoster})`, backgroundSize: 'cover' }
              : undefined
          }
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
