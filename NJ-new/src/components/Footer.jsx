import React from 'react'

export default function Footer() {
  return (
    <footer id="footer">
      <div className="container footer-grid">
        <div className="footer-column">
          <h4>About NJIM</h4>
          <p>
            A community of believers dedicated to growing in faith and serving
            the world with the love of Christ.
          </p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#sermons">Sermons</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/NewJerusalemMinistr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/messaiahchannel/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.youtube.com/@messiahchannel6023"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://www.tiktok.com/@njerusalemministry"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
        <div className="footer-column">
          <h4>Service Times</h4>
          <p><strong>Sunday:</strong> 10:00 AM & 1:30 PM</p>
          <p><strong>Wednesday:</strong> 10:00 AM Restoration Service</p>
          <p><strong>Friday:</strong> 5:00 PM Miracle service</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 NJOAN - The Holy City of God. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
