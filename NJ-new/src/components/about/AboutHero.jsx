import React from 'react'

export default function AboutHero() {
  return (
    <section id="hero" className="about-hero" style={{
      backgroundImage: 'url("/images/congragation2.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="hero-overlay"></div>
      <div className="hero-church-name">
        <img src="/images/another_logo.png" alt="Church Logo" />
      </div>
      <div className="container">
        <div className="hero-content">
          <p className="hero-scripture">About Us</p>
          <h1 className="hero-title">Growing Together in Faith and Community</h1>
          <p className="hero-subtitle">
            Learn more about our story, mission, and the dedicated team behind our church family.
          </p>
          <div className="hero-buttons">
            <a href="#who-we-are" className="btn btn-primary">
              Explore More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
