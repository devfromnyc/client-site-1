import { useEffect } from 'react'
import content from './data/site-content.json'
import Header from './components/Header'
import Hero from './components/Hero'
import ScrollRevealSection from './components/ScrollRevealSection'
import ImageTextSection from './components/ImageTextSection'
import ProgressSection from './components/ProgressSection'
import StickyCardsSection from './components/StickyCardsSection'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    document.title = content.site.title
  }, [])

  return (
    <>
      <Header />
      <Hero />
      <main className="flex flex-col gap-16 pb-16 lg:gap-24 lg:pb-24">
        <ScrollRevealSection />
        <ImageTextSection
          id="benefits"
          imagePosition="left"
          {...content.benefits}
        />
        <ProgressSection />
        <StickyCardsSection />
        <ImageTextSection
          id="programs"
          imagePosition="right"
          {...content.programs}
        />
      </main>
      <Footer />
    </>
  )
}
