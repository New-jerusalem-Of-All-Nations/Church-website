import React, { useState } from 'react'
import { API_ENDPOINTS } from '../../config/api'

export default function EventsRegistrationModal({ event, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      // Split fullName into firstName and lastName
      const nameParts = formData.fullName.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || formData.fullName

      const response = await fetch(API_ENDPOINTS.EVENT_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone,
          eventId: event.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to register')
      }

      setMessage('Registration successful! We look forward to seeing you.')
      setTimeout(() => {
        setFormData({ fullName: '', email: '', phone: '' })
        setMessage('')
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Event registration error:', err)
      setError(err.message || 'Failed to register. Please try again.')
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  if (!event) return null

  return (
    <div id="registration-modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="modal-event-title">Event Registration</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          <p id="modal-event-info" className="event-info-text">
            <strong>{event.title}</strong><br />
            {event.date.toLocaleDateString()} at {event.time}<br />
            Location: {event.location}
          </p>
          <form id="event-registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name *</label>
              <input
                type="text"
                id="reg-name"
                name="fullName"
                placeholder="Your Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email Address *</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number</label>
              <input
                type="tel"
                id="reg-phone"
                name="phone"
                placeholder="(optional)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {message && <div id="registration-message" className="form-message success">{message}</div>}
            {error && <div id="registration-error" className="form-message error" style={{ color: '#e74c3c', backgroundColor: '#fadbd8', borderColor: '#e74c3c' }}>{error}</div>}
            <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>{isLoading ? 'Registering...' : 'Complete Registration'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
