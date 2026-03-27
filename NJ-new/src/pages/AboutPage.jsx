import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import AboutHero from '../components/about/AboutHero'
import WhoWeAre from '../components/about/WhoWeAre'
import OurMission from '../components/about/OurMission'
import BeliefCards from '../components/about/BeliefCards'
import OurTeam from '../components/about/OurTeam'

function AboutPage() {
  return (
    <div className="App">
      <Header />
      <main className="about-page">
        <AboutHero />
        <WhoWeAre />
        <OurMission />
        <BeliefCards />
        <OurTeam />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}

export default AboutPage
