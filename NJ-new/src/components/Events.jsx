import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

export default function Events() {
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('events')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_ENDPOINTS.EVENTS}?limit=4`)
        const result = await response.json()
        const fetchedEvents = result.data || []
        
        // Transform API data to match component format
        const transformedEvents = fetchedEvents.map(event => {
          const eventDate = new Date(event.date)
          return {
            id: event._id || event.id,
            date: eventDate.getDate(),
            month: eventDate.toLocaleDateString('en-US', { month: 'short' }),
            title: event.title,
            time: event.time || 'Time TBA',
            location: event.location || '10 Robert Sobukwe Road, Belleville'
          }
        })
        
        setEvents(transformedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <section id="events" className={`content-section fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      <div className="container">
        <h2 className="section-title">Discover ways to connect</h2>
        <p className="text-center text-2xl font-bold text-gray-600 mb-12">
          There are always new ways to participate in what God is doing through our church, including events, evengelism, worship, and so much more..
        </p>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p>Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <div id="events-container" className="event-list">
            {events.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-date">
                  <span>{event.month}</span>
                  <strong>{event.date}</strong>
                </div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p><i className="fas fa-clock"></i>{event.time}</p>
                  <p><i className="fas fa-map-marker-alt"></i>{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p>No events available</p>
          </div>
        )}
      </div>
    </section>
  )
}
