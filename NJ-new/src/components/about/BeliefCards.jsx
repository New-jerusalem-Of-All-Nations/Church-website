import React, { useState } from 'react'

export default function BeliefCards() {
  const [expandedId, setExpandedId] = useState(null)

  const beliefs = [
    { id: 1, icon: 'fas fa-book', title: 'THE BIBLE', description: 'We believe the Bible is the inspired, infallible, authoritative Word of God. It is our supreme authority in all matters of faith and conduct.' },
    { id: 2, icon: 'fas fa-church', title: 'THE CHURCH', description: 'We believe the Church is the body of Christ, composed of all true believers, called to worship God, nurture believers, and evangelize the world.' },
    { id: 3, icon: 'fas fa-wine-glass', title: 'COMMUNION', description: 'We believe Communion is a sacred ordinance instituted by Christ to remember His sacrifice until He returns, open to all believers.' },
    { id: 4, icon: 'fas fa-shield-alt', title: 'THE TRINITY', description: 'We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit, equal in power and glory.' },
    { id: 5, icon: 'fas fa-user', title: 'MAN', description: 'We believe humanity is created in God\'s image but fell into sin, requiring redemption through Jesus Christ for restoration.' },
    { id: 6, icon: 'fas fa-hands-helping', title: 'FIVE-FOLD MINISTRY', description: 'We believe in the five-fold ministry gifts (apostles, prophets, evangelists, pastors, teachers) for equipping believers and building the Church.' },
    { id: 7, icon: 'fas fa-hands-praying', title: 'THE FATHER', description: 'We believe in God the Father, creator of heaven and earth, perfect in holiness, infinite in wisdom, and measureless in power.' },
    { id: 8, icon: 'fas fa-cross', title: 'THE SON', description: 'We believe in Jesus Christ, God\'s only Son, conceived by the Holy Spirit, born of a virgin, crucified, risen, and coming again.' },
    { id: 9, icon: 'fas fa-dove', title: 'HOLY SPIRIT', description: 'We believe in the Holy Spirit who convicts of sin, regenerates, indwells, guides, teaches, and empowers believers for godly living and service.' },
    { id: 10, icon: 'fas fa-recycle', title: 'REPENTANCE', description: 'We believe repentance is a genuine turning from sin toward God, essential for salvation and ongoing Christian life.' },
    { id: 11, icon: 'fas fa-pray', title: 'PRAYER', description: 'We believe prayer is vital communion with God, through which we worship, seek guidance, present requests, and intercede for others.' },
    { id: 12, icon: 'fas fa-water', title: 'BAPTISM', description: 'We believe in water baptism by immersion as an outward expression of inward faith, identifying with Christ\'s death, burial, and resurrection.' },
    { id: 13, icon: 'fas fa-heartbeat', title: 'HEALTH & PROSPERITY', description: 'We believe God desires wholeness for His people—spiritual, emotional, and physical well-being according to His will and purpose.' },
    { id: 14, icon: 'fas fa-cloud', title: 'SECOND COMING', description: 'We believe in the personal, visible, and imminent return of Jesus Christ to establish His kingdom and judge the world in righteousness.' },
    { id: 15, icon: 'fas fa-infinity', title: 'ETERNITY', description: 'We believe in eternal life for believers in heaven and eternal separation from God for unbelievers, as taught in Scripture.' },
    { id: 16, icon: 'fas fa-heart', title: 'FAITH', description: 'We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit, equal in power and glory.' },
    { id: 17, icon: 'fas fa-users', title: 'LOVE', description: 'We believe in demonstrating God\'s love through compassion, mercy, and service to others in imitation of Christ.' },
    { id: 18, icon: 'fas fa-book-open', title: 'WORD', description: 'We believe the Word of God is living and active, transforming lives and empowering believers to live victoriously in Christ.' },
  ]

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Split beliefs into 6 columns (3 items per column for 18 items)
  const columns = [[], [], [], [], [], []]
  beliefs.forEach((belief, index) => {
    columns[index % 6].push(belief)
  })

  return (
    <section className="beliefs-section">
      <div className="section-header">
        <h1 className="section-title">What We NJOAN Stand for</h1>
        <p className="section-subtitle">
          These are the unshakable truths — the <em>CONCEPTS</em> — that guide how we live, love, serve, and represent Christ to the world.
        </p>
      </div>

      <div className="beliefs-grid">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="belief-column">
            {column.map(belief => (
              <div
                key={belief.id}
                className={`belief-item ${expandedId === belief.id ? 'expanded' : ''}`}
                onClick={() => toggleExpand(belief.id)}
              >
                <h3 className="belief-title">
                  <span className="belief-icon">
                    <i className={belief.icon}></i>
                  </span>
                  {belief.title}
                </h3>
                <p className="belief-description">
                  {belief.description}
                </p>
                <span className="expand-icon">
                  <i className="fas fa-chevron-down"></i>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
