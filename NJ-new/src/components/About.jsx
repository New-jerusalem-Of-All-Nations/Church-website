import React, { useEffect, useState } from 'react'

export default function About() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('about')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className={`content-section fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      <div className="container about-container">
        <div className="about-image">
          <img src="images/congregation.jpg" alt="Church interior" />
        </div>
        <div className="about-content">
          <h2 className="section-title">
            Welcome to New Jerusalem of All Nations
          </h2>
          <p className="section-subtitle">
            A place of faith, hope, and community.
          </p>
          <p>
            We are a vibrant community dedicated to sharing the love of Christ
            and the teachings of the Bible. Our mission is to create a
            welcoming environment where people can grow in their faith,
            connect with others, and make a positive impact in the world.
          </p>
          <p>
            Whether you are new to the area or searching for a spiritual home,
            we invite you to join us for our services and events.
          </p>
          <a href="#beliefs" className="btn btn-tertiary">
            Our Beliefs <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  )
}
