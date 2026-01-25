
import React from 'react';
import { WeddingConfig } from '../types';

interface HeroProps {
  config: WeddingConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  // Use config from props instead of the missing WEDDING_CONFIG constant
  const { groom, bride } = config.couple;
  const { shortDateDisplay } = config.event;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern opacity-10"></div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>

      <div className="relative text-center z-10 animate-fade-in px-4">
        <div className="mb-6">
          <span className="inline-block px-6 py-1 border-y border-primary text-primary tracking-[0.4em] font-medium text-xs uppercase opacity-80">
            Bismillahirrahmannirrahim
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl font-display text-[#2D2D2D] mb-4">
          {groom.shortName} <span className="block md:inline text-primary">&</span> {bride.shortName}
        </h1>

        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="w-px h-12 bg-primary opacity-20"></div>
          <div className="text-2xl md:text-3xl font-serif italic text-primary">
            {shortDateDisplay}
          </div>
          <div className="w-px h-12 bg-primary opacity-20"></div>
        </div>

        <div className="mt-12 space-y-10">
          <p className="text-sm md:text-base text-[#555] max-w-lg mx-auto leading-relaxed tracking-[0.2em] font-light uppercase opacity-80">
            KAMI MEMPERSILAKAN ANDA UNTUK MERAIKAN PENYATUAN CINTA DAN PERJALANAN HIDUP KAMI
          </p>
          
          <a 
            href="#rsvp"
            className="group relative inline-block px-12 py-4 bg-white border-2 border-primary text-primary font-bold tracking-[0.2em] text-xs rounded-full transition-all hover:bg-primary hover:text-white shadow-xl hover:shadow-primary/30 active:scale-95 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10">SAY YES, I'M COMING!</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
