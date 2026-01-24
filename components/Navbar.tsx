
import React, { useState, useEffect } from 'react';
import { WEDDING_CONFIG } from '../constants';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { groom, bride } = WEDDING_CONFIG.couple;

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

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className={`font-display text-2xl transition-all tracking-tighter ${isScrolled ? 'text-primary scale-100' : 'text-[#333] scale-110'}`}>
            {initials}
          </a>
          
          <ul className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="inline-block text-[10px] font-bold tracking-[0.3em] py-1 uppercase relative group text-[#333] hover:text-primary transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out w-0 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="text-4xl font-display text-primary mb-8">{initials}</div>
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className="inline-block text-lg font-bold tracking-[0.4em] text-[#333] hover:text-primary uppercase transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5"
            >
              {item.label}
            </a>
          ))}
          <button 
            onClick={closeMenu}
            className="mt-12 text-[10px] tracking-[0.4em] uppercase font-bold text-muted border-b border-muted/20 pb-1"
          >
            Tutup Menu
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
