import content from '../data/site-content.json'

export default function Hero() {
  const { subtitle, headlineLines, videoPoster, videoSrc, primaryCta, secondaryCta } =
    content.hero

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        controls
        poster={videoPoster}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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
