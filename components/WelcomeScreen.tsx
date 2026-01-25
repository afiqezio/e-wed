
import React, { useState } from 'react';
import { WeddingConfig } from '../types';

interface WelcomeScreenProps {
  config: WeddingConfig;
  onEnter: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ config, onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { groom, bride } = config.couple;
  const { fullDateDisplay, day } = config.event;

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onEnter, 800);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FCFAF7] overflow-hidden transition-all duration-1000 ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-islamic-pattern pointer-events-none opacity-20"></div>
      
      <div className="relative z-10 text-center px-4">
        <div className="mb-6 animate-fade-in">
          <span className="text-primary text-lg uppercase tracking-[0.4em] font-medium opacity-80">Walimatul Urus</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display text-[#2D2D2D] mb-8 animate-slide-up">
          {groom.shortName} <span className="text-primary">&</span> {bride.shortName}
        </h1>
        
        <p className="text-secondary font-serif text-xl md:text-2xl mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {day}, {fullDateDisplay}
        </p>

        <button 
          onClick={handleStart}
          className="group relative px-12 py-5 overflow-hidden rounded-full border-2 border-primary text-primary transition-all hover:bg-primary hover:text-white shadow-2xl shadow-primary/10 animate-pulse-soft"
        >
          <span className="relative z-10 text-lg tracking-[0.2em] font-bold">BUKA UNDANGAN</span>
          <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
