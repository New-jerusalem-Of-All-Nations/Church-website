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

      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-card-content">
          <p className="hero-card-tagline">IMPACTING NATIONS</p>
          <h1 className="hero-card-title">The mouth piece of God</h1>
          <p className="hero-card-description">
            Welcome to the home of Prophet V.Dyani and New Jerusalem Church 
            Experience divine healing, prophetic clarity, and spiritual transformation.
          </p>
          <div className="hero-card-buttons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="card-btn btn-navy">
              FACEBOOK LIVE
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="card-btn btn-navy">
              YOUTUBE LIVE
            </a>
            <a href="#contact" className="card-btn btn-maroon">
              SUBMIT PRAYER
            </a>
          </div>
        </div>
        {/* <div className="hero-card-image">
          <img src="/images/The_man_of_god_1copy.png" alt="Apostle" />
        </div> */}
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
