import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import GivingPage from './pages/GivingPage'
import AboutPage from './pages/AboutPage'
import EventsPage from './pages/EventsPage'
import SermonArchivePage from './pages/SermonArchivePage'
import ComingSoonPage from './pages/ComingSoonPage'

function App() {
  useEffect(() => {
    // Function to set up fade-in observer
    const setupFadeInObserver = () => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      }, observerOptions)

      const fadeInElements = document.querySelectorAll('.fade-in-section')
      fadeInElements.forEach(element => {
        // Reset the class if switching routes
        element.classList.remove('is-visible')
        observer.observe(element)
      })

      return observer
    }

    // Initial setup
    let observer = setupFadeInObserver()

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/giving" element={<GivingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/sermons" element={<SermonArchivePage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
