import React from 'react'

export default function GivingCards() {
  return (
    <section className="giving-cards">
      <div className="giving-grid">
        <div className="card card-dark">
          <p>Thank you for your generosity. It is because of your faithfulness that we are able to see lives Restored in Christ.</p>
          <span className="divider"></span>
        </div>

        <div className="card card-darker">
          <h3>Give Now</h3>
          <span className="divider"></span>
          <a href="#" className="btn-give">Give Online</a>
        </div>

        <div className="card card-light">
          <h3>International Giving</h3>
          <small>Outside Lesotho &amp; RSA</small>
          <span className="divider"></span>
          <a href="#" className="btn-give">Give via PayPal</a>
        </div>
      </div>
    </section>
  )
}
