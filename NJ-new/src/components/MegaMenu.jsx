import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function MegaMenu({ isMobile, isExpanded, onLinkClick }) {
  const menuData = [
    {
      title: "COMMUNITY GROUPS",
      links: [
        { name: "Men's Ministry", path: "/coming-soon" },
        { name: "Women's Ministry", path: "/coming-soon" },
        { name: "Youth Group", path: "/coming-soon" },
        { name: "Blog", path: "/coming-soon" },
      ]
    },
    {
      title: "OUTREACH",
      links: [
        { name: "Evangelism", path: "/coming-soon" },
        { name: "Global Missions", path: "/coming-soon" },
        { name: "Community Service", path: "/coming-soon" },
      ]
    },
    {
      title: "EDUCATION",
      links: [
        { name: "Foundation School", path: "/coming-soon" },
        { name: "Sunday School", path: "/coming-soon" },
      ]
    }
  ];

  if (isMobile) {
    return (
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col space-y-6 pl-4 border-l-2 border-brand-gold/30 ml-2">
          {menuData.map((column, idx) => (
            <div key={idx}>
              <h3 className="font-serif text-brand-gold font-bold mb-3 uppercase tracking-wider text-sm">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link to={link.path} onClick={onLinkClick} className="text-gray-300 hover:text-white transition-colors block text-lg">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-max">
      <div className="bg-white rounded-xl shadow-2xl p-8 flex gap-12 relative before:content-[''] before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white">
        
        {/* Links Columns */}
        <div className="flex gap-12">
          {menuData.map((column, idx) => (
            <div key={idx} className="min-w-[160px]">
              <h3 className="font-serif text-gray-900 font-bold mb-6 uppercase tracking-widest text-sm">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link to={link.path} className="text-gray-500 hover:text-brand-gold font-medium transition-colors block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Featured Column */}
        <div className="w-[280px] bg-gray-50 rounded-lg p-4 border border-gray-100">
          <img 
            src="../public/images/Nj youth.jpg" 
            alt="Children's Ministry" 
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          <h4 className="font-serif text-gray-900 font-bold text-lg mb-2">Children's Ministry</h4>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">Programs available for all ages to grow in faith together.</p>
          <Link to="/coming-soon" className="inline-flex items-center text-brand-gold font-semibold hover:text-yellow-600 transition-colors text-sm group/link">
            Learn More <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
