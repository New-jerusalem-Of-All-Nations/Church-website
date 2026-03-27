import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

export default function Newsletter() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    consent: false
  })
  const [submitMessage, setSubmitMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('newsletter')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSubmitMessage('')

    try {
      const response = await fetch(API_ENDPOINTS.NEWSLETTER_SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          consent: formData.consent
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to subscribe')
      }

      setSubmitMessage('Thank you for subscribing! Check your email for confirmation.')
      setFormData({ name: '', email: '', consent: false })
      setTimeout(() => setSubmitMessage(''), 5000)
    } catch (err) {
      console.error('Newsletter subscription error:', err)
      setError(err.message || 'Failed to subscribe. Please try again.')
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="newsletter" className={`content-section fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      <div className="container">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2 className="section-title">Stay Connected</h2>
            <p className="section-subtitle">
              Subscribe to our newsletter for weekly updates, sermons, events
              and <i>Daily Devotion</i>.
            </p>
            <p>
              Get the latest news, spiritual insights, and event notifications
              delivered directly to your inbox.
            </p>
            <ul className="newsletter-benefits">
              <li><i className="fas fa-check"></i> Weekly sermon highlights</li>
              <li><i className="fas fa-check"></i> Upcoming event announcements</li>
              <li><i className="fas fa-check"></i> Spiritual encouragement</li>
              <li><i className="fas fa-check"></i> Community updates</li>
            </ul>
          </div>
          <div className="newsletter-form">
            <form id="newsletter-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="newsletter-name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="newsletter-consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="newsletter-consent">
                  I agree to receive email updates from New Jerusalem Church
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-newsletter" disabled={isLoading}>
                <span className="btn-text">{isLoading ? 'Subscribing...' : 'Subscribe Now'}</span>
              </button>
            </form>
            {submitMessage && (
              <div className="newsletter-message success">
                {submitMessage}
              </div>
            )}
            {error && (
              <div className="newsletter-message error" style={{ color: '#e74c3c', backgroundColor: '#fadbd8', borderColor: '#e74c3c' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
