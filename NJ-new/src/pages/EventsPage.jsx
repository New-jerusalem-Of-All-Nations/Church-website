import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
// import EventsHero from '../components/events/EventsHero'
import EventCalendar from '../components/events/EventCalendar'
import EventsList from '../components/events/EventsList'
import EventsRegistrationModal from '../components/events/EventsRegistrationModal'
import EventNotificationForm from '../components/events/EventNotificationForm'
import { API_ENDPOINTS } from '../config/api'

export default function EventsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState([])
  const [viewMode, setViewMode] = useState('both')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fade-in observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('events-page')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Sample events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${API_ENDPOINTS.EVENTS}?limit=100`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        
        const result = await response.json()
        const fetchedEvents = result.data || []
        
        // Transform API data to match component expectations
        const transformedEvents = fetchedEvents.map(event => ({
          id: event._id || event.id,
          title: event.title,
          date: new Date(event.date),
          time: event.time || '10:00 AM',
          description: event.description || 'Event details coming soon',
          location: event.location || 'TBA'
        }))
        
        setEvents(transformedEvents)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <div className="App">
      <Header />
      <main>
        {/* <EventsHero /> */}
        <section id="events-page" className={`content-section fade-in-section ${isVisible ? 'is-visible' : ''}`}>
          <div className="container">
            <h2 className="section-title">Event Calendar & Schedule</h2>
            <p className="section-subtitle">
              Browse our comprehensive event calendar to see all upcoming activities, meetings, and services.
            </p>

            {/* View Toggle */}
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'both' ? 'active' : ''}`}
                onClick={() => setViewMode('both')}
              >
                <i className="fas fa-border-all"></i> Calendar View
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i> List View
              </button>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p>Loading events...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#e74c3c' }}>
                <p>Error loading events: {error}</p>
              </div>
            ) : events.length > 0 ? (
              /* Events Grid */
              <div className={`events-grid ${viewMode}`}>
                {(viewMode === 'both' || viewMode === 'both') && (
                  <EventCalendar 
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    events={events}
                    onDateSelect={setSelectedDate}
                  />
                )}
                <EventsList 
                  events={events}
                  selectedDate={selectedDate}
                  onEventClick={handleEventClick}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p>No events available</p>
              </div>
            )}
          </div>
        </section>

        {isModalOpen && (
          <EventsRegistrationModal 
            event={selectedEvent}
            onClose={handleModalClose}
          />
        )}

        <EventNotificationForm />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
