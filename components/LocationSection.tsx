
import React from 'react';
import { WeddingConfig } from '../types';

interface LocationSectionProps {
  config: WeddingConfig;
}

const LocationSection: React.FC<LocationSectionProps> = ({ config }) => {
  // Use config from props instead of the missing WEDDING_CONFIG constant
  const { venueName, timeRange, location } = config.event;
  const { contacts } = config;

  return (
    <section id="location" className="py-24 text-center">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-display text-[#333333] mb-4">Lokasi Majlis</h2>
        <p className="text-primary font-serif italic text-2xl font-medium">{venueName}</p>
        <p className="text-[#777] mt-2 font-medium tracking-widest uppercase text-sm">{timeRange}</p>
        <div className="w-24 h-px bg-primary mx-auto mt-6 opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 relative border-8 border-white">
        <iframe 
          src={location.embedUrl} 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          title="Wedding Venue"
        ></iframe>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        <a 
          href={location.googleMaps} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center px-8 py-4 bg-primary text-white rounded-full hover:bg-primary/90 transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20 text-xs font-bold tracking-widest uppercase"
        >
          Google Maps
        </a>
        <a 
          href={location.waze} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center px-8 py-4 bg-white border-2 border-secondary text-secondary rounded-full hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1 text-xs font-bold tracking-widest uppercase shadow-sm"
        >
          Waze Navigation
        </a>
      </div>

      <div className="mt-24 max-w-4xl mx-auto px-4">
        <h3 className="text-2xl font-display mb-8 text-[#333]">Hubungi Kami</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {contacts && contacts.length > 0 ? (
            contacts.map((contact, idx) => (
              <a 
                key={idx} 
                href={contact.link} 
                className={`bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all border group ${contact.side === 'groom' ? 'border-primary/5' : 'border-secondary/5'}`}
              >
                <div className={`text-[10px] font-bold tracking-[0.2em] mb-1 group-hover:scale-110 transition-transform ${contact.side === 'groom' ? 'text-primary' : 'text-secondary'}`}>
                  {contact.side === 'groom' ? 'PIHAK LELAKI' : 'PIHAK PEREMPUAN'} ({contact.label})
                </div>
                <div className="text-lg font-medium">{contact.name}</div>
                <div className="text-sm opacity-60 mt-1">{contact.phone}</div>
              </a>
            ))
          ) : (
            <p className="col-span-2 text-muted italic">Sila hubungi pihak keluarga untuk maklumat lanjut.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
