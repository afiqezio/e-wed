
import React from 'react';
import { WEDDING_CONFIG } from '../constants';

interface WelcomeScreenProps {
  onEnter: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const { groom, bride } = WEDDING_CONFIG.couple;
  const { fullDateDisplay, day } = WEDDING_CONFIG.event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FCFAF7] overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern pointer-events-none opacity-40"></div>
      
      <div className="relative z-10 text-center px-4">
        <div className="mb-6 animate-fade-in">
          <span className="text-primary text-lg uppercase tracking-[0.4em] font-medium opacity-80">The Wedding of</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display text-[#2D2D2D] mb-8 animate-slide-up">
          {groom.shortName} <span className="text-primary">&</span> {bride.shortName}
        </h1>
        
        <p className="text-secondary font-serif text-xl md:text-2xl mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {day}, {fullDateDisplay}
        </p>

        <button 
          onClick={onEnter}
          className="group relative px-10 py-4 overflow-hidden rounded-full border-2 border-primary text-primary transition-all hover:bg-primary hover:text-white shadow-xl shadow-primary/10"
        >
          <span className="relative z-10 text-lg tracking-[0.2em] font-bold">BUKA UNDANGAN</span>
          <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
