import content from '../data/site-content.json'

export default function StickyCardsSection() {
  const { headlineLines, body, cta, whatsIncludedLabel, cards } = content.training

  return (
    <section id="training" className="bg-beige">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 lg:grid-cols-2">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:px-12 lg:py-24">
          <div className="px-8 py-16 lg:px-0 lg:py-0">
            <h2 className="font-serif text-4xl font-medium leading-tight text-ink md:text-5xl lg:text-6xl">
              {headlineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">
              {body}
            </p>
            <a
              href={cta.href}
              className="mt-10 inline-block rounded-xl bg-ink px-8 py-4 font-serif text-lg text-beige transition hover:bg-charcoal"
            >
              {cta.label}
            </a>
          </div>
        </div>

        <div className="relative px-8 pb-16 lg:px-12 lg:pb-24 lg:pt-24">
          <p className="mb-8 text-sm font-semibold uppercase tracking-wider text-ink/50">
            {whatsIncludedLabel}
          </p>
          <div className="space-y-6">
            {cards.map((item, i) => (
              <div
                key={item.title}
                className="sticky rounded-none border border-ink/10 bg-beige p-8 shadow-sm transition-shadow"
                style={{
                  top: `${6 + i * 1.5}rem`,
                }}
              >
                <h3 className="font-serif text-2xl font-medium leading-snug text-ink md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/60 md:text-base">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
