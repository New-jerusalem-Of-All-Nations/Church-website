import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
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

    const section = document.getElementById('contact')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
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
    setSubmitMessage('')

    try {
      const response = await fetch(API_ENDPOINTS.GET_IN_TOUCH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      setSubmitMessage('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitMessage(''), 5000)
    } catch (err) {
      console.error('Contact form error:', err)
      setError(err.message || 'Failed to send message. Please try again.')
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className={`content-section fade-in-section alt-bg ${isVisible ? 'is-visible' : ''}`}>
      <div className="container contact-container">
        <div className="contact-info">
          <h2 className="section-title">Get In Touch</h2>
          <p>
            We'd love to hear from you. Visit us, call us, or send us a
            message.
          </p>
          <ul>
            <li>
              <i className="fas fa-map-marker-alt"></i> 10 Robert Sobukwe Road
              Belleville, 7530
            </li>
            <li><i className="fas fa-phone"></i>+27 64 961 6428</li>
            <li>
              <i className="fas fa-envelope"></i>
              newjerusalem.int.ministries@gmail.com
            </li>
          </ul>
          <h3 className="giving-title">Online Giving</h3>
          <p>
            Support our mission and ministries through secure online giving.
          </p>
          <a href="/giving" className="btn btn-primary">Give Now</a>
        </div>
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="6"
              value={formData.message}
              onChange={handleInputChange}
              data-gramm="false"
              required
            ></textarea>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {submitMessage && (
            <div className="form-message success">
              {submitMessage}
            </div>
          )}
          {error && (
            <div className="form-message error" style={{ color: '#e74c3c', backgroundColor: '#fadbd8', borderColor: '#e74c3c' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
