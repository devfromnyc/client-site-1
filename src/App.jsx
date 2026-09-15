import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import content from './data/site-content.json'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  useEffect(() => {
    document.title = content.site.title
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  )
}
