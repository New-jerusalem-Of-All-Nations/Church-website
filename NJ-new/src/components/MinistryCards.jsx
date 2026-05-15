import React, { useState, useEffect } from 'react';

export default function MinistryCards() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 }); // Added threshold for better triggering

    const section = document.getElementById('ministries');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const ministries = [
    {
      id: 1,
      title: 'Cell Groups Ministry',
      description: 'Connecting people. Activating faith.',
      imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=1000',
      link: '#'
    },
    {
      id: 2,
      title: 'Evangelism Ministry',
      description: 'Making an impact – locally and globally.',
      imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1000',
      link: '#'
    },  
    {
      id: 3,
      title: 'Children\'s Ministry',
      description: 'Partnering with parents to develop kids\' faith.',
      imageUrl: '',
      link: '#'
    },
    {
      id: 4,
      title: 'Youth Ministry',
      description: 'Developing youth who influence culture.',
      imageUrl: '../images/PM.png',
      link: '#'
    },
    {
      id: 5,
      title: 'Young Adult (singles) Ministry',
      description: 'Building community. Deepening faith.',
      imageUrl: '../images/people.jpg',
      link: '#'
    },
    {
      id: 6,
      title: 'Foundation Ministry',
      description: 'Inspiring your faith and creating an atmosphere of worship to God.',
      imageUrl: '../images/bible.jpg',
      link: '#'
    }
  ];

  // Reusable Card Component to keep code clean
  const MinistryCard = ({ ministry }) => (
    <div className="relative rounded-2xl text-white flex flex-col justify-between min-h-[24rem] transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer overflow-hidden group">
      
      {/* Background Image with zoom effect on hover */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${ministry.imageUrl})` }}
      />
      
      {/* Dark Overlay - This makes the image faint and text visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 transition-opacity duration-300 group-hover:opacity-90" />

      {/* Content - z-10 ensures it stays above the overlay */}
      <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-12">
        <div className="mt-12 md:mt-16">
          <h3 className="text-lg font-semibold mb-3 text-brand-gold tracking-wide uppercase text-sm">{ministry.title}</h3>
          <p className="text-3xl font-bold leading-tight drop-shadow-md">{ministry.description}</p>
        </div>
        
        <a href={ministry.link} className="inline-flex items-center mt-8 font-semibold text-white group/link w-fit">
          <span className="border-b-2 border-transparent group-hover/link:border-brand-gold transition-all duration-300 group-hover/link:text-brand-gold">
            Learn more
          </span> 
          <span className="ml-2 group-hover/link:translate-x-1 transition-transform duration-300 text-brand-gold">
            ›
          </span>
        </a>
      </div>
    </div>
  );

  return (
    <section 
      id="ministries" 
      className={`content-section fade-in-section px-4 md:px-8 ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">A platform for Spiritual Growth</h2>
        <p className="text-center text-xl md:text-2xl text-gray-600 mb-16 max-w-3xl mx-auto">
          Discover ways to grow your faith and join the ministries that are shaping lives and building community.
        </p>
        
        {/* Top row - 2 cards */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
            {ministries.slice(0, 2).map(ministry => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))}
          </div>
        </div>

        {/* Middle row - 3 cards */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {ministries.slice(2, 5).map(ministry => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))}
          </div>
        </div>

        {/* Bottom row - 1 card */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            {ministries.slice(5).map(ministry => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
