import React, { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (cookieConsent) {
      setShowBanner(false)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setShowBanner(false)
  }

  return (
    <div id="cookie-banner" className={`cookie-banner ${!showBanner ? 'hidden' : ''}`}>
      <h4>We use cookies</h4>
      <p>
        This website uses essential cookies to function properly. With your
        permission, we may also use analytics cookies to improve the site.
      </p>

      <div className="cookie-buttons">
        <button id="reject-cookies" onClick={handleReject}>
          Reject
        </button>
        <button id="accept-cookies" onClick={handleAccept}>
          Accept all
        </button>
      </div>
    </div>
  )
}
