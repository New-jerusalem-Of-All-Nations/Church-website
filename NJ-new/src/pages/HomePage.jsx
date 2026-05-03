import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Sermons from '../components/Sermons'
import Events from '../components/Events'
import MinistryCards from '../components/MinistryCards'
import WatchSermon from '../components/WatchSermon'
import Contact from '../components/Contact'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'

function HomePage() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <About />
        <Sermons />
        <Events />
        <MinistryCards />
        <WatchSermon />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}

export default HomePage
