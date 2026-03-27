import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import SermonLibraryDrawer from '../components/SermonLibraryDrawer'
import { API_ENDPOINTS } from '../config/api'

export default function SermonArchivePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allSermons, setAllSermons] = useState([])
  const [featuredSermon, setFeaturedSermon] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('sermons-archive')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Fetch sermons from API
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${API_ENDPOINTS.SERMONS}?limit=100`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch sermons')
        }
        
        const result = await response.json()
        const sermons = result.data || []
        
        // Set all sermons
        setAllSermons(sermons)
        
        // Set featured sermon (first one or marked as featured)
        const featuredSerm = sermons.find(s => s.isFeatured) || sermons[0]
        if (featuredSerm) {
          // Extract YouTube video ID from URL if needed
          let embedUrl = featuredSerm.videoUrl
          if (embedUrl && !embedUrl.includes('embed')) {
            const videoId = featuredSerm.videoId || embedUrl.split('v=')[1]?.split('&')[0]
            if (videoId) {
              embedUrl = `https://www.youtube.com/embed/${videoId}`
            }
          }
          
          setFeaturedSermon({
            ...featuredSerm,
            videoUrl: embedUrl,
            pastor: featuredSerm.speaker,
            date: new Date(featuredSerm.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            summary: featuredSerm.description
          })
        }
      } catch (err) {
        console.error('Error fetching sermons:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSermons()
  }, [])

  return (
    <div className="App">
      <Header />
      <main>
        {/* Featured Sermon Section - Full Width */}
        <section className="featured-sermon-section" style={{ paddingTop: '80px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p>Loading sermons...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#e74c3c' }}>
              <p>Error loading sermons: {error}</p>
            </div>
          ) : featuredSermon ? (
            <>
              <div className="featured-video">
                <iframe
                  width="100%"
                  height="600"
                  src={featuredSermon.videoUrl}
                  title={featuredSermon.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="container">
                <div className="featured-details">
                  <h3 className="featured-title">{featuredSermon.title}</h3>
                  <div className="sermon-meta">
                    <span className="pastor-name">{featuredSermon.pastor}</span>
                    <span className="sermon-date">{featuredSermon.date}</span>
                  </div>
                  <div className="sermon-actions">
                    <a href="/giving" className="btn btn-primary sermon-btn">
                      <i className="fas fa-heart"></i> Give
                    </a>
                    <a href="https://www.youtube.com/@messiahchannel6023" target="_blank" rel="noopener noreferrer" className="btn btn-subscribe sermon-btn">
                      <i className="fas fa-bell"></i> Subscribe
                    </a>
                  </div>
                  <p className="sermon-summary">{featuredSermon.summary}</p>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p>No sermons available</p>
            </div>
          )}
        </section>

        {/* Sermon Catalog Section */}
        <section id="sermons-archive" className={`content-section fade-in-section ${isVisible ? 'is-visible' : ''}`}>
          <div className="container">
            <h2 className="section-title">Sermon Archive</h2>
            <p className="section-subtitle">
              Listen to our latest and greatest sermons from our pastors.
            </p>

            {/* Sermon Carousel */}
            <div className="sermon-carousel-container">
              <div className="carousel-header">
                <h3 className="catalog-title">Recent Sermons</h3>
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="btn btn-primary btn-see-all"
                >
                  See All
                </button>
              </div>
              
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p>Loading sermons...</p>
                </div>
              ) : allSermons.length > 0 ? (
                <div className="sermon-carousel">
                  <div className="sermon-carousel-items">
                    {allSermons.slice(0, 6).map(sermon => (
                      <div key={sermon._id || sermon.id} className="carousel-sermon-item">
                        <div className="sermon-thumbnail">
                          <img 
                            src={sermon.thumbnail || 'https://via.placeholder.com/800x450?text=Sermon'} 
                            alt={sermon.title}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/800x450?text=Sermon'
                            }}
                          />
                        </div>
                        <h4 className="carousel-card-title">{sermon.title}</h4>
                        <p className="carousel-card-pastor">{sermon.speaker}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p>No sermons found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />

      {/* Sermon Library Drawer */}
      <SermonLibraryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sermons={allSermons.map(s => ({
          ...s,
          id: s._id || s.id,
          pastor: s.speaker,
          year: new Date(s.date).getFullYear(),
          topic: s.category || 'General',
          testimony: s.description
        }))}
      />
    </div>
  )
}
