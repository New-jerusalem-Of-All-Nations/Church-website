import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'

export default function ComingSoonPage() {
  return (
    <>
      <Header />
      <main className="coming-soon-main">
        <div className="coming-soon-container">
          <div className="coming-soon-content">
            <h1 className="coming-soon-title">Coming Soon</h1>
            <p className="coming-soon-subtitle">
              We're working hard to bring something amazing to you!
            </p>
            <div className="coming-soon-icon">
              <i className="fas fa-hourglass-half"></i>
            </div>
            <p className="coming-soon-message">
              This page is under construction. Check back soon for updates.
            </p>
            <a href="/" className="btn btn-primary coming-soon-btn">
              ← Back to Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
