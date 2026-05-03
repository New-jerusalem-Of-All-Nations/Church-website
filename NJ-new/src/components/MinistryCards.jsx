import React, { useState, useEffect } from 'react'

export default function MinistryCards() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('ministries')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const ministries = [
    {
      id: 1,
      title: 'Cell Groups Ministry',
      description: 'Connecting people. Activating faith.',
      bgColor: 'bg-blue-900',
      link: '#'
    },
    {
      id: 2,
      title: 'Evangelism Ministry',
      description: 'Making an impact – locally and globally.',
      bgColor: 'bg-green-600',
      link: '#'
    },
    {
      id: 3,
      title: 'Children\'s Ministry',
      description: 'Partnering with parents to develop kids\' faith.',
      bgColor: 'bg-cyan-500',
      link: '#'
    },
    {
      id: 4,
      title: 'Youth Ministry',
      description: 'Developing youth who influence culture.',
      bgColor: 'bg-gray-900',
      link: '#'
    },
    {
      id: 5,
      title: 'Young Adult (singles) Ministry',
      description: 'Building community. Deepening faith.',
      bgColor: 'bg-orange-500',
      link: '#'
    },
    {
      id: 6,
      title: 'Foundation Ministry',
      description: 'Inspiring your faith and creating an atmosphere of worship to God.',
      bgColor: 'bg-black',
      link: '#'
    }
  ]

  return (
    <section 
      id="ministries" 
      className={`content-section fade-in-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="container">
        <h2 className="section-title text-center mb-12">A platform for Spiritual Growth</h2>
        <p className="text-center text-2xl font-bold text-gray-600 mb-12">Discover ways to  grow your faith and join the ministries that are shaping <br/> lives and building community.</p>
        
        {/* Top row - 2 cards */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
            {ministries.slice(0, 2).map(ministry => (
              <div
                key={ministry.id}
                className={`${ministry.bgColor} rounded-2xl p-12 text-white flex flex-col justify-between min-h-96 transform transition-transform cursor-pointer`}
              >
                <div className="mt-20">
                  <h3 className="text-lg font-semibold mb-3 opacity-90">{ministry.title}</h3>
                  <p className="text-3xl font-bold leading-tight">{ministry.description}</p>
                </div>
                <div className="flex mt-8">
                  <a href={ministry.link} className="inline-flex items-center font-semibold text-white group">
                    <span className="border-b-2 border-transparent group-hover:border-brand-gold transition-all duration-300 group-hover:text-brand-gold">Learn more</span> <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">›</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle row - 3 cards */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {ministries.slice(2, 5).map(ministry => (
              <div
                key={ministry.id}
                className={`${ministry.bgColor} rounded-2xl p-12 text-white flex flex-col justify-between min-h-96 transform transition-transform cursor-pointer`}
              >
                <div className="mt-20">
                  <h3 className="text-lg font-semibold mb-3 opacity-90">{ministry.title}</h3>
                  <p className="text-3xl font-bold leading-tight">{ministry.description}</p>
                </div>
                <a href={ministry.link} className="inline-flex items-center mt-8 font-semibold text-white group">
                  <span className="border-b-2 border-transparent group-hover:border-brand-gold transition-all duration-300 group-hover:text-brand-gold">Learn more</span> <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">›</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row - 1 card */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            {ministries.slice(5).map(ministry => (
              <div
                key={ministry.id}
                className={`${ministry.bgColor} rounded-2xl p-12 text-white flex flex-col justify-between min-h-96 transform transition-transform cursor-pointer`}
              >
                <div className="mt-20">
                  <h3 className="text-lg font-semibold mb-3 opacity-90">{ministry.title}</h3>
                  <p className="text-3xl font-bold leading-tight">{ministry.description}</p>
                </div>
                <a href={ministry.link} className="inline-flex items-center mt-8 font-semibold text-white group">
                  <span className="border-b-2 border-transparent group-hover:border-brand-gold transition-all duration-300 group-hover:text-brand-gold">Learn more</span> <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">›</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
