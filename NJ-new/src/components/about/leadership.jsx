import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Custom SVG for the hollow cross
const HollowCross = () => (
  <svg 
    width="48" 
    height="64" 
    viewBox="0 0 24 32" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5"
    className="text-gray-400"
  >
    <path d="M10 2v8H2v8h8v12h4V18h8v-8h-8V2h-4z" />
  </svg>
);

const InfoCard = ({ title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center h-full"
    >
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
        {description}
      </p>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gray-900 text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-black transition-colors shadow-md"
      >
        Learn more
      </motion.button>
    </motion.div>
  );
};

const SidebarItem = ({ text, id, isActive, onClick }) => {
  return (
    <li className="relative">
      <button 
        onClick={() => onClick(id)}
        className={`w-full text-right py-3 pr-6 text-sm md:text-base transition-colors ${
          isActive 
            ? 'text-gray-900 font-bold' 
            : 'text-gray-500 hover:text-gray-900 font-medium'
        }`}
      >
        {text}
      </button>
      {isActive && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute right-0 top-0 bottom-0 w-0.5 bg-gray-900"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </li>
  );
};

// Component to render specific content based on the section
const SectionContent = ({ id }) => {
  if (id === 'who-we-are') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gray-500 font-semibold tracking-wider text-sm md:text-base text-center mb-6 uppercase"
        >
          Who We Are
        </motion.h2>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 text-center leading-tight tracking-tight mb-16"
        >
          We exist so that people far from God will be raised to life in Christ.
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring" }}
          className="flex justify-center mb-16"
        >
          <HollowCross />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <InfoCard 
            title="Our Beliefs"
            description="What do we believe about God, faith, and the Bible? Check out how God's Word guides our beliefs."
            delay={0.2}
          />
          <InfoCard 
            title="Our Values"
            description="Learn more about the values that keep us focused on what truly matters — reaching people with the gospel."
            delay={0.3}
          />
        </div>
      </div>
    );
  }

  // Generic placeholder for other sections to demonstrate scrolling
  return (
    <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 capitalize">
        {id.replace(/-/g, ' ')}
      </h2>
      <p className="text-gray-500 text-center max-w-2xl text-lg">
        This is a placeholder section for {id.replace(/-/g, ' ')}. Scroll up or down to see the sidebar navigation update automatically based on your scroll position.
      </p>
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState('about');

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'who-we-are', label: 'Who we are' },
    { id: 'church-experiences', label: 'Church experiences' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'what-to-expect', label: 'What to expect' },
    { id: 'nextgen-ministries', label: 'NextGen Ministries' },
    { id: 'young-adults', label: 'Young Adults' },
    { id: 'outreach', label: 'Outreach' }
  ];

  // Set up Intersection Observer for scrollspy
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Adjust these values to trigger earlier/later
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section elements
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Handle smooth scrolling when clicking a sidebar item
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for visual padding
      const yOffset = -40; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 p-4 md:p-8 lg:p-12">
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 space-y-12 md:space-y-24">
          {navItems.map((item) => (
            <section 
              key={item.id} 
              id={item.id}
              className="bg-white rounded-[2.5rem] p-y8 md:p-16 lg:p-20 shadow-xl shadow-gray-200/50 border border-gray-100 scroll-mt-8"
            >
              <SectionContent id={item.id} />
            </section>
          ))}
        </main>

        {/* Sidebar Navigation - Hidden on mobile/tablet, sticky on desktop */}
        <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-12 lg:h-fit">
          <nav>
            <ul className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <SidebarItem 
                  key={item.id}
                  id={item.id}
                  text={item.label}
                  isActive={activeSection === item.id}
                  onClick={scrollToSection}
                />
              ))}
            </ul>
          </nav>
        </aside>

      </div>
    </div>
  );
}
