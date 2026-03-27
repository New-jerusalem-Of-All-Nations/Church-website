import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

export default function Sermons() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSermonIndex, setActiveSermonIndex] = useState(0)
  const [sermons, setSermons] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('sermons')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Fetch sermons from API
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_ENDPOINTS.SERMONS}?limit=6`)
        const result = await response.json()
        const fetchedSermons = result.data || []
        
        // Transform API data
        const transformedSermons = fetchedSermons.map(sermon => ({
          id: sermon._id || sermon.id,
          title: sermon.title,
          description: sermon.description,
          thumbnail: sermon.thumbnail || 'https://via.placeholder.com/800x450?text=Sermon',
          date: new Date(sermon.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        }))
        
        setSermons(transformedSermons)
      } catch (error) {
        console.error('Error fetching sermons:', error)
        // Keep empty array on error (graceful fallback)
        setSermons([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSermons()
  }, [])

  useEffect(() => {
    if (sermons.length === 0) return
    
    const interval = setInterval(() => {
      setActiveSermonIndex(prev => (prev + 1) % sermons.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [sermons.length])

  return (
    <section id="sermons" className={`content-section fade-in-section alt-bg ${isVisible ? 'is-visible' : ''}`}>
      <div className="container">
        <div className="sermon-title-container">
          <div className="watch-text">Watch</div>
          <div className="latest-sermons-text">Latest Sermons</div>
          <div className="underline"></div>
        </div>
        <p className="section-subtitle">
          Listen to messages of hope and encouragement to build your <i>FAITH</i>.
        </p>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p>Loading sermons...</p>
          </div>
        ) : sermons.length > 0 ? (
          <div id="sermons-container" className="sermon-carousel">
            {sermons.map((sermon, index) => (
              <div
                key={sermon.id}
                className={`sermon-card ${index === activeSermonIndex ? 'active' : ''}`}
              >
                <div className="sermon-thumbnail">
                  <img 
                    src={sermon.thumbnail} 
                    alt={sermon.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x450?text=Sermon'
                    }}
                  />
                </div>
                <div className="sermon-info">
                  <h4>{sermon.title}</h4>
                  <p>{sermon.description}</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{sermon.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p>No sermons available</p>
          </div>
        )}

        <a
          href="/sermons"
          className="btn btn-primary"
          style={{ marginTop: '2rem' }}
        >
          View All Sermons
        </a>
      </div>
    </section>
  )
}
