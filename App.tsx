
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
import { WEDDING_CONFIG } from './constants';

const App: React.FC = () => {
  const [showMain, setShowMain] = useState(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);

  // Scalable Theme Injection
  useEffect(() => {
    const root = document.documentElement;
    const { colors, fonts } = WEDDING_CONFIG.theme;
    
    // Inject Colors
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-bg', colors.background);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-muted', colors.muted);
    
    // Inject Fonts
    root.style.setProperty('--font-display', fonts.display);
    root.style.setProperty('--font-body', fonts.body);
    root.style.setProperty('--font-serif', fonts.serif);
  }, []);

  const handleEnter = () => {
    setShowMain(true);
    setShouldPlayMusic(true);
    window.scrollTo(0, 0);
  };

  if (!showMain) {
    return <WelcomeScreen onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <CoupleSection />
        <TimelineSection />
        <LocationSection />
        <RegistrySection />
        <RSVPSection />
        <GuestbookSection />
      </main>
      
      <footer className="py-20 text-center border-t" style={{ borderColor: 'rgba(var(--color-primary), 0.1)' }}>
        <div className="text-3xl mb-4 text-primary" style={{ fontFamily: 'var(--font-display)' }}>
          {WEDDING_CONFIG.couple.groom.shortName} & {WEDDING_CONFIG.couple.bride.shortName}
        </div>
        <p className="text-sm opacity-50 uppercase tracking-widest">
          © {new Date().getFullYear()} — Made with love for your special day.
        </p>
      </footer>

      <MusicPlayer autoStart={shouldPlayMusic} />
    </div>
  );
};

export default App;
