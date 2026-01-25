
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
      const { colors, fonts } = conf.theme;
      if (colors) {
        Object.entries(colors).forEach(([key, val]) => {
          if (val) root.style.setProperty(`--color-${key}`, val);
        });
      }
      if (fonts) {
        Object.entries(fonts).forEach(([key, val]) => {
          if (val) root.style.setProperty(`--font-${key}`, val);
        });
      }
    }
  };

  const handleEnter = () => {
    setShowMain(true);
    setShouldPlayMusic(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  if (currentRoute === '#admin') {
    return <AdminPanel config={config} />;
  }

  if (!showMain) {
    return <WelcomeScreen config={config} onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen transition-opacity duration-1000 animate-fade-in" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      <Navbar config={config} />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero config={config} />
        <CoupleSection config={config} />
        <TimelineSection config={config} />
        <LocationSection config={config} />
        <RegistrySection config={config} />
        <RSVPSection config={config} />
        <GuestbookSection />
      </main>
      
      <footer className="py-20 text-center border-t border-primary/10 reveal-on-scroll slide-up">
        <div className="text-3xl mb-4 text-primary" style={{ fontFamily: 'var(--font-display)' }}>
          {config.couple.groom.shortName} & {config.couple.bride.shortName}
        </div>
        <p className="text-sm opacity-50 uppercase tracking-widest">
          © {new Date().getFullYear()} — Created with love.
        </p>
      </footer>

      <MusicPlayer config={config} autoStart={shouldPlayMusic} />
    </div>
  );
};

export default App;
