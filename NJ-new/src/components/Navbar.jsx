import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import MegaMenu from './MegaMenu';

export default function Navbar({ isMobile, isMobileMenuOpen, onMobileMenuClose }) {
  const location = useLocation();
  const [mobileMinistriesOpen, setMobileMinistriesOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Sermons', path: '/sermons' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (isMobile) {
      onMobileMenuClose();
    }
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-6 mt-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={handleLinkClick}
            className={`text-2xl font-medium transition-colors ${isActive(link.path) ? 'text-brand-gold' : 'text-white hover:text-brand-gold'}`}
          >
            {link.name}
          </Link>
        ))}
        
        {/* Mobile Ministries Accordion */}
        <div className="flex flex-col">
          <button 
            onClick={() => setMobileMinistriesOpen(!mobileMinistriesOpen)}
            className="flex items-center justify-between text-2xl font-medium text-white hover:text-brand-gold transition-colors w-full text-left"
          >
            Ministries
            <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${mobileMinistriesOpen ? 'rotate-180 text-brand-gold' : ''}`} />
          </button>
          <MegaMenu isMobile={true} isExpanded={mobileMinistriesOpen} onLinkClick={handleLinkClick} />
        </div>

        <Link
          to="/events"
          onClick={handleLinkClick}
          className={`text-2xl font-medium transition-colors ${isActive('/events') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'}`}
        >
          Events
        </Link>
        
        <div className="pt-6 mt-6 border-t border-white/10">
          <Link
            to="/giving"
            onClick={handleLinkClick}
            className="block w-full text-center bg-brand-gold hover:bg-yellow-500 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors shadow-lg"
          >
            GIVING
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`font-medium text-[15px] tracking-wide transition-colors hover:text-brand-gold ${isActive(link.path) ? 'text-brand-gold' : 'text-white'}`}
        >
          {link.name}
        </Link>
      ))}

      {/* Desktop Mega Menu Trigger */}
      <div className="relative group py-6">
        <button className="flex items-center font-medium text-[15px] tracking-wide text-white hover:text-brand-gold transition-colors">
          Ministries
          <ChevronDown className="w-4 h-4 ml-1 opacity-70 group-hover:rotate-180 transition-transform duration-300" />
        </button>
        <MegaMenu isMobile={false} />
      </div>

      <Link
        to="/events"
        className={`font-medium text-[15px] tracking-wide transition-colors hover:text-brand-gold ${isActive('/events') ? 'text-brand-gold' : 'text-white'}`}
      >
        Events
      </Link>

      <Link
        to="/giving"
        className="bg-brand-gold hover:bg-yellow-500 text-white px-8 py-2.5 rounded-full font-bold text-sm tracking-wider transition-all duration-300 shadow-[0_4px_14px_0_rgba(240,173,78,0.39)] hover:shadow-[0_6px_20px_rgba(240,173,78,0.23)] hover:-translate-y-0.5 ml-4"
      >
        GIVING
      </Link>
    </nav>
  );
}
