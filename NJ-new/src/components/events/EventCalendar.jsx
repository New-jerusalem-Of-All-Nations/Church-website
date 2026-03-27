import React from 'react'

export default function EventCalendar({ currentMonth, setCurrentMonth, events }) {
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const hasEventOnDate = (day) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString()
    return events.some(event => event.date.toDateString() === dateStr)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3 id="calendar-month">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <div className="calendar-nav">
          <button id="prev-month" onClick={handlePrevMonth} aria-label="Previous month">← Prev</button>
          <button id="next-month" onClick={handleNextMonth} aria-label="Next month">Next →</button>
        </div>
      </div>

      <div className="weekdays">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
      </div>

      <div className="calendar-grid" id="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? '' : 'empty'} ${day && hasEventOnDate(day) ? 'has-event' : ''}`}
          >
            {day && (
              <>
                <div className="day-number">{day}</div>
                {hasEventOnDate(day) && <div className="event-indicator"></div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
