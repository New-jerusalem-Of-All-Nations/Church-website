import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { type: 'image', src: '/images/The man of god 1.jpg', alt: 'Pastor speaking' },
    { type: 'image', src: '/images/man4.jpg', alt: 'Youth ministry' },
    { type: 'image', src: '/images/The Man of God 3.jpg', alt: 'Man of God' },
    { type: 'video', src: '/videos/HeroVideo.mp4', alt: 'Hero video' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 10000) // Change every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const currentSlideData = slides[currentSlide]

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark pt-24 lg:pt-0">
      {/* Background Image/Video Container */}
      <div className="absolute inset-0 z-0">
        {currentSlideData.type === 'image' && (
          <motion.img
            key={`img-${currentSlide}`}
            src={currentSlideData.src}
            alt={currentSlideData.alt}
            className="w-full h-full object-cover object-top opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.8 }}
          />
        )}
        {currentSlideData.type === 'video' && (
          <motion.video
            key={`vid-${currentSlide}`}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover object-top opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            <source src={currentSlideData.src} type="video/mp4" />
          </motion.video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row items-center justify-between">
        
        {/* Massive Background Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:absolute lg:left-8 lg:top-1/2 lg:-translate-y-1/2 z-0 pointer-events-none mt-10 lg:mt-0"
        >
          <h1 className="text-[12vw] lg:text-[9rem] xl:text-[11rem] font-serif font-bold text-white/90 leading-[0.85] tracking-tighter drop-shadow-2xl">
            NEW JERUSALEM<br />
            <span className="text-[10vw] lg:text-[8rem] xl:text-[10rem]">OF ALL NATIONS</span>
          </h1>
        </motion.div>

        {/* Spacer for desktop to push card to the right */}
        <div className="hidden lg:block w-1/3"></div>

        {/* Floating Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full lg:w-[600px] xl:w-[700px] relative z-20 mt-10 lg:mt-32 mb-10 lg:mb-0 lg:ml-auto"
        >
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative">
            
            {/* Card Content */}
            <div className="relative z-10 lg:pr-32">
              <p className="text-gray-500 tracking-[0.2em] text-xs md:text-sm font-bold uppercase mb-3">
                Impacting Nations
              </p>
              <p className="text-brand-gold font-serif text-lg md:text-xl mb-4">
                New Jerusalem of All Nations
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6 leading-tight">
                The Mouth Piece Of GOD
              </h2>
              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                Welcome to the home of Prophet V.Dyani and New Jerusalem Church. We are the Word of God at Work, Teaching, Healing and Deliverance.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="bg-[#1e3a8a] text-white px-6 py-3.5 rounded-full text-xs md:text-sm font-bold tracking-wider hover:bg-blue-900 transition-colors shadow-lg">
                  FACEBOOK LIVE
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="bg-[#1e3a8a] text-white px-6 py-3.5 rounded-full text-xs md:text-sm font-bold tracking-wider hover:bg-blue-900 transition-colors shadow-lg">
                  YOUTUBE LIVE
                </a>
                <a href="#contact" className="bg-[#8b0000] text-white px-6 py-3.5 rounded-full text-xs md:text-sm font-bold tracking-wider hover:bg-red-900 transition-colors shadow-lg">
                  SUBMIT PRAYER
                </a>
              </div>
              <div className=" absolute bottom-0 -right-16 w-[210px] h-[90%] pointer-events-none">
              <img 
                src="../public/images/The_man_of_god_1copy.png" 
                alt="Prophet" 
                className="w-full h-full object-cover object-top rounded-t-full shadow-[-10px_0_20px_rgba(0,0,0,0.1)]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              />
            </div>
            </div>

            {/* Overlapping Image (Desktop Only) */}
            
          </div>
        </motion.div>

      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-brand-gold w-8'
                : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
