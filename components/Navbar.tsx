
import React, { useState, useEffect } from 'react';
import { WeddingConfig } from '../types';

interface NavbarProps {
  config: WeddingConfig;
}

const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { groom, bride } = config.couple;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Mempelai', id: 'couple' },
    { label: 'Aturcara', id: 'timeline' },
    { label: 'Lokasi', id: 'location' },
    { label: 'Tanda Kasih', id: 'registry' },
    { label: 'RSVP', id: 'rsvp' },
    { label: 'Ucapan', id: 'wishes' },
  ];

  const initials = `${groom.shortName.charAt(0)}&${bride.shortName.charAt(0)}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className={`font-display text-2xl transition-all tracking-tighter ${isScrolled ? 'text-primary' : 'text-[#333]'}`}>
          {initials}
        </a>
        
        {/* Desktop Menu Only */}
        <ul className="hidden md:flex space-x-10">
          {navItems.map((item) => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`}
                className="text-[10px] font-bold tracking-[0.3em] transition-colors text-[#333] hover:text-primary uppercase"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile View: No hamburger menu, just the initials branding */}
        <div className="md:hidden">
          {/* Empty div or minimal element to maintain flex balance if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
