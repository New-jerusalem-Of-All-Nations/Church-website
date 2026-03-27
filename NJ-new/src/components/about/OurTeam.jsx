import React from 'react'

export default function OurTeam() {
  const teamMembers = [
    {
      id: 1,
      name: 'Wndisile Xilinxa',
      position: 'Senior Pastor',
      image: 'https://via.placeholder.com/300x300?text=Senior+Pastor'
    },
    {
      id: 2,
      name: 'Odwa Christopher Dlelaphantsi',
      position: 'Youth President',
      image: 'https://via.placeholder.com/300x300?text=Youth+President'
    },
    {
      id: 3,
      name: 'Siya',
      position: 'Evangelist',
      image: 'https://via.placeholder.com/300x300?text=Evangelist'
    }
  ]

  return (
    <section className="content-section" id="our-team">
      <div className="container">
        <h2 className="section-title">Our Team</h2>
        <p className="section-subtitle">Meet the passionate leaders serving our community.</p>
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-card">
              <div className="team-thumbnail">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-info">
                <h4>{member.name}</h4>
                <p>{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
