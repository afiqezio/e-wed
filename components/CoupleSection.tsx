
import React from 'react';
import { WeddingConfig } from '../types';

interface CoupleSectionProps {
  config: WeddingConfig;
}

const CoupleSection: React.FC<CoupleSectionProps> = ({ config }) => {
  const { groom, bride } = config.couple;

  return (
    <section id="couple" className="py-24 relative overflow-hidden">
      <div className="text-center mb-20 reveal-on-scroll slide-up">
        <h2 className="text-4xl md:text-5xl font-display text-[#2D2D2D] mb-4">Mempelai</h2>
        <div className="w-24 h-px bg-primary mx-auto opacity-30"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-20 items-center max-w-5xl mx-auto">
        {/* Groom */}
        <div className="text-center space-y-8 reveal-on-scroll slide-left">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-primary/20 rounded-t-full scale-105 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative w-64 h-80 rounded-t-full border-[10px] border-white shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-primary/20">
              <img 
                src={groom.imageUrl} 
                alt={groom.fullName} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
              />
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
        <div className="text-center space-y-8 reveal-on-scroll slide-right">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-secondary/20 rounded-t-full scale-105 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative w-64 h-80 rounded-t-full border-[10px] border-white shadow-2xl overflow-hidden transition-all duration-700 hover:shadow-secondary/20">
              <img 
                src={bride.imageUrl} 
                alt={bride.fullName} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
              />
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
