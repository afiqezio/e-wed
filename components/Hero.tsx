
import React from 'react';
import { motion } from 'framer-motion';
import { WeddingConfig } from '../types';

interface HeroProps {
  config: WeddingConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  const { groom, bride } = config.couple;
  const { shortDateDisplay } = config.event;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern opacity-10 animate-float-slow"></div>
      
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.05, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"
      />

      <div className="relative text-center z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-1 border-y border-primary/20 text-primary tracking-[0.4em] font-medium text-xs uppercase">
            Bismillahirrahmannirrahim
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="text-7xl md:text-9xl font-display text-[#2D2D2D] mb-4"
        >
          {groom.shortName} <span className="block md:inline text-primary">&</span> {bride.shortName}
        </motion.h1>

        <div className="flex flex-col items-center gap-4 mt-8">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 48 }}
            transition={{ duration: 1, delay: 1 }}
            className="w-px bg-primary opacity-20"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-2xl md:text-3xl font-serif italic text-primary"
          >
            {shortDateDisplay}
          </motion.div>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 48 }}
            transition={{ duration: 1, delay: 1 }}
            className="w-px bg-primary opacity-20"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 space-y-10"
        >
          <p className="text-[10px] md:text-xs text-[#555] max-w-lg mx-auto leading-loose tracking-[0.4em] font-bold uppercase opacity-60 px-4">
            KAMI MEMPERSILAKAN ANDA UNTUK MERAIKAN PENYATUAN CINTA DAN PERJALANAN HIDUP KAMI
          </p>
          
          <motion.a 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            href="#rsvp"
            className="group relative inline-block px-12 py-5 bg-white border border-primary/20 text-primary font-bold tracking-[0.2em] text-[10px] rounded-full transition-all shadow-xl hover:shadow-primary/10 overflow-hidden"
          >
            <span className="relative z-10">SAY YES, I'M COMING!</span>
            <div className="absolute inset-0 bg-primary/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </motion.a>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
      >
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
