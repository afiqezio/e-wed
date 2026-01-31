
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoupleSection from './components/CoupleSection';
import TimelineSection from './components/TimelineSection';
import LocationSection from './components/LocationSection';
import RSVPSection from './components/RSVPSection';
import GuestbookSection from './components/GuestbookSection';
import RegistrySection from './components/RegistrySection';
import MusicPlayer from './components/MusicPlayer';
import AdminPanel from './components/AdminPanel';
import { storage } from './services/storage';
import { WeddingConfig } from './types';
import { FALLBACK_CONFIG } from './constants_dummy';

const App: React.FC = () => {
  const [config, setConfig] = useState<WeddingConfig>(FALLBACK_CONFIG as unknown as WeddingConfig);
  const [showMain, setShowMain] = useState(false);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    
    const unsubscribe = storage.subscribeConfig((newConfig) => {
      if (newConfig) {
        setConfig(newConfig);
        injectTheme(newConfig);
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!showMain || currentRoute === '#admin') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [showMain, currentRoute]);

  const injectTheme = (conf: WeddingConfig) => {
    if (conf.theme) {
      const root = document.documentElement;
      const { colors } = conf.theme;
      if (colors) {
        Object.entries(colors).forEach(([key, val]) => {
          if (val) root.style.setProperty(`--color-${key}`, val);
        });
      }
    }
  };

  const handleEnter = () => {
    setIsWelcomeVisible(false);
    setShouldPlayMusic(true);
    setTimeout(() => {
      setShowMain(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  if (currentRoute === '#admin') {
    return <AdminPanel config={config} />;
  }

  const quickNavItems = [
    { id: 'top', label: 'Top', icon: 'M5 10l7-7 7 7M12 3v18', href: '#' },
    { id: 'couple', label: 'Mempelai', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'location', label: 'Lokasi', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { id: 'rsvp', label: 'RSVP', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'wishes', label: 'Ucapan', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' }
  ];

  return (
    <>
      <WelcomeScreen config={config} onEnter={handleEnter} isVisible={isWelcomeVisible} />
      
      {showMain && (
        <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
          <Navbar config={config} />
          <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div id="top" className="h-0" />
            <Hero config={config} />
            <CoupleSection config={config} />
            <TimelineSection config={config} />
            <LocationSection config={config} />
            <RegistrySection config={config} />
            <RSVPSection config={config} />
            <GuestbookSection />
          </main>
          
          <footer className="py-20 text-center border-t border-primary/10 reveal-on-scroll slide-up">
            <div className="text-3xl mb-4 text-primary font-display">
              {`${config.couple.groom.shortName} & ${config.couple.bride.shortName}`}
            </div>
            <p className="text-xs opacity-50 uppercase tracking-widest font-bold">
              © {new Date().getFullYear()} — Created with love.
            </p>
          </footer>

          {/* Unified Mobile Quick-Nav Glass Bar */}
          <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/50 shadow-2xl z-40 flex items-center justify-around px-2">
            {quickNavItems.map(nav => (
              <a 
                key={nav.id} 
                href={nav.href || `#${nav.id}`} 
                className="flex flex-col items-center justify-center p-2 text-primary group transition-all"
              >
                <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={nav.icon} />
                </svg>
                <span className="text-[7px] font-black uppercase tracking-widest mt-0.5">{nav.label}</span>
              </a>
            ))}
          </div>

          <MusicPlayer config={config} autoStart={shouldPlayMusic} />
        </div>
      )}
    </>
  );
};

export default App;
