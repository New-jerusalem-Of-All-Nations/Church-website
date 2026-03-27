import React from 'react'

export default function WatchSermon() {
  return (
    <section className="watch-sermon-section">
      <div className="watch-container">
        <div className="watch-text">
          <h2>
            Watch Your<br />
            Favourite Sermon
          </h2>

          <p>
            Be inspired by powerful messages and teachings. Watch directly on
            our YouTube channel anytime.
          </p>

          <a
            href="https://www.youtube.com/@messiahchannel6023"
            target="_blank"
            rel="noopener noreferrer"
            className="watch-btn"
          >
            Watch on YouTube
          </a>
        </div>

        <div className="watch-visual">
          <div className="phone-shadow"></div>
          <img
            src="/images/youtube_page_mockup__2_-removebg-preview.png"
            alt="YouTube Channel Preview"
            className="phone phone-back"
          />
          <img
            src="/images/youtube_page_mockup__3_-removebg-preview.png"
            alt="YouTube Channel Preview"
            className="phone phone-front"
          />
        </div>
      </div>
    </section>
  )
}
