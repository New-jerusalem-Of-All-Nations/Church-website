import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'church-experiences', label: 'Church experiences' },
  { id: 'leadership', label: 'Leadership' },
  // { id: 'what-to-expect', label: 'What to expect' },
  // { id: 'nextgen', label: 'NextGen Ministries' },
  // { id: 'young-adults', label: 'Young Adults' },
  // { id: 'outreach', label: 'Outreach' },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// --- Section Components ---

const AboutSection = () => (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="w-full mt-9"
  >
    <motion.h1 
      variants={itemVariants}
      className="text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight text-gray-900 leading-[1.1] mb-6"
    >
      See What God Can Do Through You
    </motion.h1>
    
    <motion.h2 
      variants={itemVariants}
      className="text-xl md:text-2xl lg:text-[1.75rem] font-semibold text-gray-800 mb-8 leading-snug"
    >
      We are here to help you deepen your faith and discover your purpose.
    </motion.h2>
    
    <motion.p 
      variants={itemVariants}
      className="text-base md:text-lg text-gray-600 leading-relaxed mb-12 max-w-3xl"
    >
      Established in 2010 by Prophet V.Dyani and Prophetess Amorin Dyani, is a church grounded in the word of God and is guided by the Holy Spirit in all its endeavours.
      We believe in the redemptive power of Jesus Christ's sacrifice, through which we have been reconciled with God, and we identify as sons and daughters of the Most high.
      If you seek a congregation devoted to a Christ-centered life and global dissemination of the gospel, we warmly invite you to join us on our faith journey.
    </motion.p>

    <motion.div 
      variants={itemVariants}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/10]"
    >
      <img 
        src="../images/congragation2.jpg" 
        alt="Church teaching experience " 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
    </motion.div>
  </motion.div>
);

const WhoWeAreSection = () => (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="w-full bg-gray-50 rounded-[2rem] p-8 md:p-12 lg:p-16 flex flex-col items-center text-center border border-gray-100"
  >
    <motion.span 
      variants={itemVariants}
      className="text-gray-500 font-semibold tracking-wide mb-6 text-sm md:text-base uppercase"
    >
      Who We Are
    </motion.span>
    
    <motion.h2 
      variants={itemVariants}
      className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl leading-[1.1] mb-12"
    >
      We exist so that people far from God will be raised to life in Christ.
    </motion.h2>

    <motion.div variants={itemVariants} className="mb-16 text-gray-300">
      {/* Custom Hollow Cross Icon */}
      {/* <svg width="40" height="56" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto">
        <path d="M10 2V12H2V18H10V34H14V18H22V12H14V2Z" />
      </svg> */}
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      {/* Our Beliefs Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
        <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
          Making disciples of all nations. Teaching all nations to observe all that Jesus commanded. We are here to help you deepen your faith and discover your purpose. MATT 28:19-20
        </p>
        <button className="w-full py-3.5 px-6 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200">
          Learn more
        </button>
      </motion.div>

      {/* Our Values Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
        <p className="text-gray-600 mb-8 flex-grow leading-relaxed text-center">
          New Jerusalem of All Nations is a church rooted in the word of God with a vision of:
          Building Lives<br />Building homes <br />Building nations
        </p>
        <button className="w-full py-3.5 px-6 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200">
          Learn more
        </button>
      </motion.div>
    </div>
  </motion.div>
);

const LeadershipSection = () => (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="w-full"
  >
    <motion.h3 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="text-gray-500 font-semibold text-lg sm:text-xl mb-3"
           >
             Meet Our Prophets
    </motion.h3>
    
    <motion.h2 
      variants={itemVariants}
      className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-10 leading-[1.1]"
    >
      Prophet V.Dyani & Amorin Dyani
    </motion.h2>

    <motion.div 
      variants={itemVariants}
      className="relative w-full rounded-[2rem] overflow-hidden shadow-xl aspect-[4/3] md:aspect-[16/9]"
    >
      <img 
        src="../images/man.jpg" 
        alt="Prophet V.Dyani & Amorin Dyani" 
        className="w-full h-full object-cover object-top"
      />
    </motion.div>

      {/* Content Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl"
      >
        <p className="text-xl sm:text-2xl text-gray-800 font-medium mb-10 italic border-l-4 border-gray-900 pl-6 py-3">
          "Rooted in faith, united in love."
        </p>
        
        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            <strong className="text-gray-900 font-semibold">New Jerusalem of All Nations</strong>, established in 2010 by Prophet V.Dyani and Prophetess Amorin Dyani, is a church grounded in the word of God and is guided by the Holy Spirit in all its endeavours.
          </p>
          <p>
            We believe in the redemptive power of Jesus Christ's sacrifice, through which we have been reconciled with God, and we identify as sons and daughters of the Most high.
          </p>
          <p>
            Our unwavering faith, profound love for God, and steadfast commitment to serving His people define our ministry.
          </p>
          <p>
            If you seek a congregation devoted to a Christ-centered life and global dissemination of the gospel, we warmly invite you to join us on our faith journey.
          </p>
        </div>
      </motion.div>
  </motion.div>
);

const PlaceholderSection = ({ id, label }) => (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-[2rem] border border-gray-100 p-8 text-center"
  >
    <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-4">{label}</motion.h2>
    <motion.p variants={itemVariants} className="text-gray-500 font-medium">Content for this section is coming soon.</motion.p>
  </motion.div>
);

// --- Main App Component ---

function App() {
  const [activeSection, setActiveSection] = useState('about');

  // Scroll Spy Logic: Update active sidebar item based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px', // Triggers when section is in the upper middle of the screen
      }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section on click
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 lg:px-12 lg:py-24 flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Mobile Navigation (Horizontal Scroll - Sticky) */}
        <div className="hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md w-full overflow-x-auto no-scrollbar border-b border-gray-100 py-4 -mx-6 px-6 mb-8">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.id} className="flex-shrink-0">
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === item.id ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area (Scrollable Sections) */}
        <main className="flex-1 max-w-5xl flex flex-col gap-24 md:gap-32">
          <section id="about" className="scroll-mt-24">
            <AboutSection />
          </section>
          
          <section id="who-we-are" className="scroll-mt-24">
            <WhoWeAreSection />
          </section>

          {/* <section id="church-experiences" className="scroll-mt-24">
            <PlaceholderSection id="church-experiences" label="Church experiences" />
          </section> */}

          <section id="leadership" className="scroll-mt-24">
            <LeadershipSection />
          </section>

          {/* Render placeholders for the rest of the navigation items */}
          {navItems.slice(4).map((item) => (
            <section id={item.id} key={item.id} className="scroll-mt-24">
              <PlaceholderSection id={item.id} label={item.label} />
            </section>
          ))}
        </main>

        {/* Desktop Sidebar Navigation (Sticky) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 pt-4">
          <div className="sticky top-24 relative">
            {/* Background track line */}
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gray-200"></div>
            
            <ul className="flex flex-col space-y-6 relative z-10">
              {navItems.map((item) => (
                <li key={item.id} className="text-right relative pr-6">
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`text-base font-medium transition-all duration-200 ${
                      activeSection === item.id 
                        ? 'text-gray-900' 
                        : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                  
                  {/* Active Indicator Line */}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute right-0 top-0 bottom-0 w-[2px] bg-gray-900"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;
