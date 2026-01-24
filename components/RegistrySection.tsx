
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { Gift } from '../types';
import { WEDDING_CONFIG } from '../constants';

const RegistrySection: React.FC = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const { bankName, accountNumber, accountHolder } = WEDDING_CONFIG.registry;

  useEffect(() => {
    setGifts(storage.getGifts());
  }, []);

  const handleOpenConfirm = (gift: Gift) => {
    setSelectedGift(gift);
  };

  const handleConfirmReservation = () => {
    if (selectedGift) {
      const updated = storage.reserveGift(selectedGift.id);
      setGifts(updated);
      setSelectedGift(null);
    }
  };

  return (
    <section id="registry" className="py-16 bg-white/30 relative">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-display text-[#2D2D2D] mb-3">Tanda Kasih</h2>
        <div className="max-w-xl mx-auto space-y-3">
          <p className="text-primary font-serif italic text-lg">Kehadiran & doa restu anda sudah mencukupi.</p>
          <p className="text-[13px] text-[#888] leading-relaxed px-4 font-light">
            Sekiranya anda ingin menghulurkan tanda kasih, berikut adalah beberapa keperluan yang amat kami hargai.
          </p>
        </div>
        <div className="w-16 h-px bg-primary mx-auto mt-6 opacity-20"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-5xl mx-auto">
        {gifts.map(gift => (
          <div key={gift.id} className="group relative bg-white rounded-[1.5rem] overflow-hidden shadow-sm transition-all duration-500 border border-[#F5F0EB]">
            <div className="p-6 text-center">
              {gift.reserved && (
                <div className="mb-4">
                  <span className="px-4 py-1.5 bg-secondary text-white text-[9px] font-bold tracking-[0.2em] rounded-full inline-block">
                    DIHADIAHKAN
                  </span>
                </div>
              )}
              <h4 className="text-base font-display mb-4 text-[#2D2D2D] tracking-tight">{gift.name}</h4>
              
              {!gift.reserved ? (
                <div className="space-y-3">
                  <button 
                    onClick={() => handleOpenConfirm(gift)}
                    className="w-full py-2.5 bg-primary text-white rounded-xl text-[9px] font-bold tracking-[0.2em] hover:bg-primary/90 transition-all shadow-sm active:scale-95 uppercase"
                  >
                    HADIAHKAN INI
                  </button>
                  {gift.buyLink && (
                    <a 
                      href={gift.buyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[9px] font-bold tracking-[0.2em] text-muted hover:text-primary transition-colors uppercase border-b border-transparent hover:border-primary/20 pb-0.5"
                    >
                      Lihat di Shopee
                    </a>
                  )}
                </div>
              ) : (
                <div className="py-2 text-[10px] italic text-secondary font-serif">
                  Terima kasih atas ingatan ikhlas anda.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center px-4">
        <div className="inline-block p-8 bg-white/80 rounded-[2rem] border border-[#F5F0EB] max-w-md w-full shadow-sm">
          <p className="text-[#444] mb-6 font-serif italic text-lg opacity-80">Sumbangan Digital</p>
          <div className="flex flex-col items-center gap-3">
            <div className="font-bold text-primary text-[9px] tracking-[0.3em] uppercase opacity-50">{bankName}</div>
            <div className="text-2xl font-mono tracking-[0.05em] text-[#333] font-bold">
              {accountNumber}
            </div>
            <div className="text-[9px] uppercase font-bold text-[#AAA] tracking-[0.15em]">{accountHolder}</div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedGift && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-[2rem] max-w-sm w-full p-8 shadow-2xl border border-stone-100 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="text-2xl">🎁</div>
              <h3 className="text-xl font-display text-[#2D2D2D]">Sahkan Pilihan</h3>
              <p className="text-[13px] text-[#777] leading-relaxed">
                Adakah anda pasti ingin menghadiahkan <span className="font-bold text-primary">{selectedGift.name}</span>?
                <br /><br />
                Pilihan ini akan ditanda sebagai 'Dihadiahkan' untuk mengelakkan pertindihan hadiah daripada tetamu lain.
              </p>
              
              <div className="flex flex-col gap-2 mt-6">
                <button 
                  onClick={handleConfirmReservation}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-bold tracking-[0.15em] text-[10px] hover:bg-primary/90 transition-all uppercase shadow-md"
                >
                  YA, SAYA SAHKAN
                </button>
                <button 
                  onClick={() => setSelectedGift(null)}
                  className="w-full py-3.5 border border-stone-200 text-[#AAA] rounded-xl font-bold tracking-[0.15em] text-[10px] hover:bg-stone-50 transition-all uppercase"
                >
                  BATALKAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RegistrySection;
