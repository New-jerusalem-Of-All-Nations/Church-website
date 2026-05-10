import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import AboutHero from '../components/about/AboutHero'
// import WhoWeAre from '../components/about/WhoWeAre'
// import OurMission from '../components/about/OurMission'
import Leadership from '../components/about/leadership'
function AboutPage() {
  return (
    <div className="App">
      <Header />
      <main className="about-page">
        <AboutHero />
        {/* <WhoWeAre /> */}
        {/* <OurMission /> */}
        {/* <Leadership /> */}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}

export default AboutPage
