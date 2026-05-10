import React, { useState, useEffect, useRef } from 'react'
import { API_ENDPOINTS } from '../config/api'
import { CalendarDays, Clock, MapPin } from 'lucide-react'

export default function Events() {
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  
  const scrollRef = useRef(null)
  const autoPlayIntervalRef = useRef(null)

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    const section = document.getElementById('events')
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_ENDPOINTS.EVENTS}?limit=4`)
        const result = await response.json()
        const fetchedEvents = result.data || []
        
        // Transform API data to match component format
        const transformedEvents = fetchedEvents.map(event => {
          const eventDate = new Date(event.date)
          const endTime = event.endTime || event.time
          return {
            id: event._id || event.id,
            date: eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
            title: event.title,
            time: event.time && endTime ? `${event.time} - ${endTime}` : event.time || 'Time TBA',
            location: event.location || '10 Robert Sobukwe Road, Belleville',
            description: event.description || '',
            image: event.image || '/images/event-placeholder.jpg'
          }
        })
        
        setEvents(transformedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Handle scroll to update the active dot indicator
  const handleScroll = () => {
    if (!scrollRef.current) return
    
    const scrollPosition = scrollRef.current.scrollLeft
    const cardWidth = scrollRef.current.children[0].offsetWidth
    const newIndex = Math.round(scrollPosition / cardWidth)
    
    if (newIndex !== currentPage) {
      setCurrentPage(newIndex)
    }
  }

  // Handle clicking a dot to scroll to that specific card
  const scrollToCard = (index) => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.children[0].offsetWidth
    const gap = window.innerWidth >= 1024 ? 32 : window.innerWidth >= 768 ? 24 : 16 
    
    scrollRef.current.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    })
    setCurrentPage(index)
  }

  // Auto-slide functionality
  useEffect(() => {
    // Don't auto-slide if hovering, or if there's 1 or 0 events
    if (events.length <= 1 || isHovering) return

    autoPlayIntervalRef.current = setInterval(() => {
      if (!scrollRef.current) return
      
      const container = scrollRef.current
      const cardWidth = container.children[0].offsetWidth
      const gap = window.innerWidth >= 1024 ? 32 : window.innerWidth >= 768 ? 24 : 16
      
      let nextIndex = currentPage + 1
      if (nextIndex >= events.length) {
        nextIndex = 0 // Loop back to start
      }
      
      container.scrollTo({
        left: nextIndex * (cardWidth + gap),
        behavior: 'smooth'
      })
    }, 10000) // Slides every 4 seconds

    return () => clearInterval(autoPlayIntervalRef.current)
  }, [events.length, currentPage, isHovering])

  return (
    <section id="events" className={`fade-in-section ${isVisible ? 'is-visible' : ''} bg-brand-light`}>
      <div className="w-full py-12 md:py-20 overflow-hidden">
        
        {/* Header Section - Constrained Width */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-15">
          <h2 className="section-title text-center mb-4 text-3xl md:text-4xl font-bold text-brand-dark">
            Discover ways to connect
          </h2>
          <p className="text-center text-lg md:text-xl font-semibold text-gray-600 max-w-2xl mx-auto">
            There are always new ways to participate in what God is doing through our church
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading events...</p>
            </div>
          </div>
        ) : events.length > 0 ? (
          <div 
            className="w-full relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={() => setIsHovering(true)}
            onTouchEnd={() => setIsHovering(false)}
          >
            {/* Carousel Container - Full Width with calculated padding for perfect centering */}
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[7.5vw] md:px-[12.5vw] lg:px-[17.5vw] pb-8 w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {events.map((event) => (
                <a
                  key={event.id}
                  href="/events"
                  className="block relative w-[85vw] md:w-[75vw] lg:w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl shadow-2xl h-[500px] md:h-[600px] group cursor-pointer"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%), url(${event.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Hover Overlay Effect */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content Container */}
                  <div className="relative h-full p-6 md:p-12 flex flex-col justify-between z-10">
                    {/* Top Section - Badge */}
                    <div>
                      <div className="inline-block">
                        <span className="bg-brand-gold text-brand-dark font-bold px-4 py-2 rounded-full text-xs md:text-sm tracking-wider uppercase shadow-lg">
                          Special Event
                        </span>
                      </div>
                    </div>

                    {/* Middle Section - Title and Details */}
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                      <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {event.title}
                      </h3>

                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-3">
                          <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-brand-gold flex-shrink-0" />
                          <span className="text-white text-base md:text-xl font-semibold">
                            {event.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 md:w-6 md:h-6 text-brand-gold flex-shrink-0" />
                          <span className="text-white text-base md:text-xl font-semibold">
                            {event.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 md:w-6 md:h-6 text-brand-gold flex-shrink-0" />
                          <span className="text-white text-base md:text-xl font-semibold truncate pr-4">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section - Button */}
                    <div>
                      <div className="inline-flex items-center justify-center bg-brand-gold text-brand-dark font-bold py-3 px-8 rounded-lg transition-all duration-300 text-base md:text-lg shadow-lg group-hover:bg-white">
                        View Event Details
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Centered Pagination Dots */}
            {events.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-2 px-4">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToCard(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentPage
                        ? 'bg-brand-gold w-8'
                        : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to event ${index + 1}`}
                  />
                ))}
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-gray-600 text-lg font-medium">No events available at the moment</p>
          </div>
        )}
      </div>

      {/* Hide Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  )
}
