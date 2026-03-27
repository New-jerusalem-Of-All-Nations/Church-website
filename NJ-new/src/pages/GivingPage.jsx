import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import GivingHero from '../components/giving/GivingHero'
import GivingCards from '../components/giving/GivingCards'
import BankDetails from '../components/giving/BankDetails'

function GivingPage() {
  return (
    <div className="App">
      <Header />
      <main className="giving-page">
        <GivingHero />
        <GivingCards />
        <BankDetails />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}

export default GivingPage
