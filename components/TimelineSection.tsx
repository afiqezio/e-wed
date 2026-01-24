
import React from 'react';
import { WEDDING_CONFIG } from '../constants';

const TimelineSection: React.FC = () => {
  const { schedule } = WEDDING_CONFIG;
  
  return (
    <section id="timeline" className="py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary), transparent 97%)' }}>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-display text-[#333333] mb-4">Aturcara Majlis</h2>
        <p className="text-secondary font-serif italic text-lg">Momen-momen indah yang akan diraikan</p>
        <div className="w-24 h-px bg-primary mx-auto mt-4 opacity-50"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-primary opacity-20"></div>

        <div className="space-y-12">
          {schedule.map((item, index) => (
            <div key={index} className={`flex items-center w-full ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-1/2 px-4 md:px-8">
                <div className={`p-6 bg-white shadow-xl rounded-2xl transition-transform hover:scale-105 duration-300 border-t-4 border-primary ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <span className="text-primary font-bold text-sm tracking-widest">{item.time}</span>
                  <h4 className="text-xl font-display mt-1 mb-2 text-[#333333]">{item.title}</h4>
                  <p className="text-sm text-[#666] leading-relaxed">{item.description}</p>
                </div>
              </div>
              <div className="z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white border-4 border-primary shadow-md"></div>
              <div className="w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
