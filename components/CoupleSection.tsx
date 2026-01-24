
import React from 'react';
import { WEDDING_CONFIG } from '../constants';

const CoupleSection: React.FC = () => {
  const { groom, bride } = WEDDING_CONFIG.couple;

  return (
    <section id="couple" className="py-24 relative overflow-hidden">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-display text-[#2D2D2D] mb-4">Mempelai</h2>
        <div className="w-24 h-px bg-primary mx-auto opacity-30"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-20 items-center max-w-5xl mx-auto">
        {/* Groom */}
        <div className="text-center space-y-8 animate-slide-up">
          <div className="relative inline-block">
            <div className="w-64 h-80 rounded-t-full border-[10px] border-white shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-primary/10">
              <img 
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=600" 
                alt={groom.fullName} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white text-3xl">{groom.emoji}</span>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="text-3xl font-display text-primary mb-1 uppercase tracking-tight">{groom.fullName}</h3>
            <p className="text-secondary font-serif text-xl italic mb-6">Putra Kepada</p>
            <div className="text-base text-[#555] leading-loose font-light">
              {groom.parents.father}<br />
              & {groom.parents.mother}
            </div>
          </div>
        </div>

        {/* Bride */}
        <div className="text-center space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative inline-block">
            <div className="w-64 h-80 rounded-t-full border-[10px] border-white shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-secondary/10">
              <img 
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600" 
                alt={bride.fullName} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white text-3xl">{bride.emoji}</span>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-3xl font-display text-primary mb-1 uppercase tracking-tight">{bride.fullName}</h3>
            <p className="text-secondary font-serif text-xl italic mb-6">Putri Kepada</p>
            <div className="text-base text-[#555] leading-loose font-light">
              {bride.parents.father}<br />
              & {bride.parents.mother}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
