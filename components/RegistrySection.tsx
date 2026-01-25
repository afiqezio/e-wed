
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { WeddingConfig, Gift } from '../types';

interface RegistrySectionProps {
  config: WeddingConfig;
}

const RegistrySection: React.FC<RegistrySectionProps> = ({ config }) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // Use config from props instead of the missing WEDDING_CONFIG constant
  const { bankName, accountNumber, accountHolder } = config.registry;

  useEffect(() => {
    // Real-time listener for gifts
    const unsubscribe = storage.subscribeGifts((updatedGifts) => {
      setGifts(updatedGifts);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenConfirm = (gift: Gift) => {
    setSelectedGift(gift);
  };

  const handleConfirmReservation = async () => {
    if (selectedGift && !isProcessing) {
      setIsProcessing(true);
      try {
        await storage.reserveGift(selectedGift.id);
        setSelectedGift(null);
      } catch (e) {
        console.error("Error reserving gift:", e);
      } finally {
        setIsProcessing(false);
      }
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-5xl mx-auto">
        {gifts.map(gift => (
          <div key={gift.id} className="group relative bg-white rounded-[1.5rem] overflow-hidden shadow-sm transition-all duration-500 border border-[#F5F0EB] p-6 text-center hover:shadow-md hover:-translate-y-0.5">
            <h4 className="text-base font-display mb-1 text-[#2D2D2D] tracking-tight">{gift.name}</h4>
            
            {gift.reserved && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-[1.5rem] animate-fade-in">
                <span className="px-4 py-1.5 bg-secondary text-white text-[9px] font-bold tracking-[0.2em] rounded-full shadow-sm">
                  DIHADIAHKAN
                </span>
              </div>
            )}
            
            {!gift.reserved ? (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleOpenConfirm(gift)}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-[9px] font-bold tracking-[0.2em] hover:bg-primary/90 transition-all shadow-sm active:scale-95 uppercase hover:shadow-primary/20"
                >
                  HADIAHKAN INI
                </button>
                {gift.buyLink && (
                  <a 
                    href={gift.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[9px] font-bold tracking-[0.2em] text-muted hover:text-primary transition-all uppercase border-b border-transparent hover:border-primary/20 pb-0.5 hover:scale-105"
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
        ))}
      </div>

      <div className="mt-16 text-center px-4">
        <div className="inline-block p-8 bg-white/80 rounded-[2rem] border border-[#F5F0EB] max-w-md w-full shadow-sm hover:shadow-md transition-shadow duration-500">
          <p className="text-[#444] mb-6 font-serif italic text-lg opacity-80">Sumbangan Digital</p>
          <div className="flex flex-col items-center gap-3">
            <div className="font-bold text-primary text-[9px] tracking-[0.3em] uppercase opacity-50">{bankName}</div>
            <div className="text-2xl font-mono tracking-[0.05em] text-[#333] font-bold group cursor-pointer">
              <span className="hover:text-primary transition-colors">{accountNumber}</span>
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
              <h3 className="text-xl font-display text-[#2D2D2D]">Sahkan Pilihan</h3>
              <p className="text-[13px] text-[#777] leading-relaxed">
                Adakah anda pasti ingin menghadiahkan <span className="font-bold text-primary">{selectedGift.name}</span>?
                <br /><br />
                Pilihan ini akan ditanda sebagai 'Dihadiahkan' untuk mengelakkan pertindihan hadiah daripada tetamu lain.
              </p>
              
              <div className="flex flex-col gap-2 mt-6">
                <button 
                  onClick={handleConfirmReservation}
                  disabled={isProcessing}
                  className="relative w-full py-3.5 bg-primary text-white rounded-xl font-bold tracking-[0.15em] text-[10px] hover:bg-primary/90 transition-all uppercase shadow-md active:scale-95 disabled:opacity-50"
                >
                  <span className={isProcessing ? 'opacity-0' : 'opacity-100'}>YA, SAYA SAHKAN</span>
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
                <button 
                  onClick={() => setSelectedGift(null)}
                  disabled={isProcessing}
                  className="w-full py-3.5 border border-stone-200 text-[#AAA] rounded-xl font-bold tracking-[0.15em] text-[10px] hover:bg-stone-50 transition-all uppercase active:scale-95"
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
