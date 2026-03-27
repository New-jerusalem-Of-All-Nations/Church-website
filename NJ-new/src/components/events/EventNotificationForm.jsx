import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../../config/api'

export default function EventNotificationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notifications: true
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('register')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const handleChange = (e) => {
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
    setMessage('')

    try {
      const response = await fetch(API_ENDPOINTS.NEWSLETTER_SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          subscribed: formData.notifications
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit RSVP')
      }

      setMessage('Thank you for your RSVP! We look forward to seeing you.')
      setTimeout(() => {
        setFormData({ name: '', email: '', notifications: true })
        setMessage('')
      }, 3000)
    } catch (err) {
      console.error('RSVP form error:', err)
      setError(err.message || 'Failed to submit RSVP. Please try again.')
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="register" className="content-section" style={{ background: 'linear-gradient(135deg, #f9f7f1 0%, #fdf5e6 100%)' }}>
      <div className={`container fade-in-section ${isVisible ? 'is-visible' : ''}`}>
        <h2 className="section-title">RSVP for Our Events</h2>
        <p className="section-subtitle">Let us know you're coming! RSVP for upcoming church events and activities</p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form id="event-notification-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                  required
                />
                <span>I plan to attend this event</span>
              </label>
            </div>
            {message && <div className="form-message success">{message}</div>}
            {error && <div className="form-message error" style={{ color: '#e74c3c', backgroundColor: '#fadbd8', borderColor: '#e74c3c' }}>{error}</div>}
            <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>{isLoading ? 'Submitting...' : 'RSVP Now'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
