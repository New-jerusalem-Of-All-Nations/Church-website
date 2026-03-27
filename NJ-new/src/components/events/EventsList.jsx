import React from 'react'

export default function EventsList({ events, selectedDate, onEventClick }) {
  const upcomingEvents = selectedDate
    ? events.filter(event => event.date.toDateString() === selectedDate.toDateString())
    : events.sort((a, b) => a.date - b.date)

  return (
    <div className="events-list-wrapper">
      <div className="events-list-title">
        <span>📅</span>
        Upcoming Events
      </div>
      <div id="events-container" className="events-container">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <div key={event.id} className="event-card" onClick={() => onEventClick(event)}>
              <div className="event-date">
                <div className="event-day">{event.date.getDate()}</div>
                <div className="event-month">{event.date.toLocaleDateString('en-US', { month: 'short' })}</div>
              </div>
              <div className="event-details">
                <h4 className="event-title">{event.title}</h4>
                <p className="event-time">
                  <i className="fas fa-clock"></i> {event.time}
                </p>
                <p className="event-location">
                  <i className="fas fa-map-marker-alt"></i> {event.location}
                </p>
                <p className="event-description">{event.description}</p>
                <button className="btn-register">Register Now</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events-message">
            <i className="fas fa-calendar-times" style={{ fontSize: '2rem', color: 'var(--brand-gold)', marginBottom: '1rem' }}></i>
            <p>No events scheduled</p>
          </div>
        )}
      </div>
    </div>
  )
}
