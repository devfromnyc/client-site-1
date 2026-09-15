import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import content from '../data/site-content.json'

export default function AboutPage() {
  const { aboutPage: about } = content

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header />
      <main className="bg-beige">
        <section className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
          <div className="mb-12 lg:mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-ink/60">
              {about.subtitle}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-medium leading-tight text-ink md:text-5xl lg:text-6xl">
              {about.headline}
            </h1>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src={about.imageSrc}
                alt={about.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="space-y-6 text-lg leading-relaxed text-ink/80">
                {about.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {about.quote && (
                <blockquote className="mt-10 border-l-4 border-ink/20 pl-6">
                  <p className="font-serif text-xl italic text-ink">
                    "{about.quote}"
                  </p>
                </blockquote>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
