
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeddingConfig } from '../types';

interface WelcomeScreenProps {
  config: WeddingConfig;
  onEnter: () => void;
  isVisible: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ config, onEnter, isVisible }) => {
  const { groom, bride } = config.couple;
  const { fullDateDisplay, day } = config.event;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FCFAF7] overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            className="absolute inset-0 bg-islamic-pattern pointer-events-none animate-float-slow"
          />
          
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-8"
            >
              <span className="text-primary text-xs md:text-sm uppercase tracking-[0.6em] font-bold">Walimatul Urus</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
              className="mb-10"
            >
              <h1 className="text-6xl md:text-9xl font-display text-[#2D2D2D] leading-none">
                {groom.shortName} <span className="text-primary">&</span> {bride.shortName}
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mb-16"
            >
              <p className="text-secondary font-serif text-xl md:text-3xl italic">
                {day}, {fullDateDisplay}
              </p>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              whileHover={{ scale: 1.05, letterSpacing: '0.3em' }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnter}
              className="group relative px-14 py-6 overflow-hidden rounded-full border border-primary/30 text-primary transition-all shadow-2xl shadow-primary/5 bg-white/50 backdrop-blur-sm"
            >
              <span className="relative z-10 text-xs tracking-[0.4em] font-black uppercase">BUKA UNDANGAN</span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 text-xs tracking-[0.4em] font-black uppercase">
                BUKA UNDANGAN
              </span>
            </motion.button>
          </div>

          {/* Decorative Corner Ornaments */}
          <motion.div 
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 0.1, rotate: 0 }}
            transition={{ delay: 1.8, duration: 2 }}
            className="absolute -top-20 -left-20 w-64 h-64 border-[40px] border-primary rounded-full pointer-events-none"
          />
          <motion.div 
            initial={{ opacity: 0, rotate: 45 }}
            animate={{ opacity: 0.1, rotate: 0 }}
            transition={{ delay: 1.8, duration: 2 }}
            className="absolute -bottom-20 -right-20 w-64 h-64 border-[40px] border-secondary rounded-full pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
