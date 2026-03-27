import React, { useState, useEffect } from 'react'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { type: 'image', src: '/images/The man of god 1.jpg', alt: 'Church congregation' },
    { type: 'image', src: '/images/man4.jpg', alt: 'Youth ministry' },
    { type: 'image', src: '/images/The Man of God 3.jpg', alt: 'Man of God' },
    { type: 'video', src: '/videos/HeroVideo.mp4', alt: 'Hero video' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4) // slides.length = 4
    }, 10000) // Change every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const currentSlideData = slides[currentSlide]

  return (
    <section id="hero" style={{
      backgroundImage: currentSlideData.type === 'image' ? `url('${currentSlideData.src}')` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    }}>
      {currentSlideData.type === 'video' && (
        <video autoPlay muted key={currentSlide} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}>
          <source src={currentSlideData.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      <div className="hero-overlay"></div>
      <div className="hero-church-name">
        <img src="/images/another_logo.png" alt="Church Logo" />
      </div>
      <div className="container">
        <div className="hero-content">
          <p className="hero-scripture">Welcome To</p>
          <h1 className="hero-title">
            NEW JERUSALEM OF ALL NATIONS,
          </h1>
          <p className="hero-subtitle">
            The Holy City of GOD
          </p>
          <div className="hero-buttons">
            <a
              href="https://www.youtube.com/@messiahchannel6023"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Join Us Now
            </a>
            <a href="#sermons" className="btn btn-secondary">Read More</a>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
