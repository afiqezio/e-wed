
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { WeddingConfig, RSVPData, Wish } from '../types';

interface RSVPSectionProps {
  config: WeddingConfig;
}

const RSVPSection: React.FC<RSVPSectionProps> = ({ config }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'attending',
    guests: 1,
    message: ''
  });
  const [stats, setStats] = useState({ attending: 0, notAttending: 0, totalGuests: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rsvpDeadline = new Date(config.event.rsvpDeadline);
  const isDeadlinePassed = new Date() > rsvpDeadline;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await storage.getRSVPs();
      const attending = data.filter(d => d.status === 'attending').length;
      const totalGuests = data.reduce((acc, curr) => acc + (curr.status === 'attending' ? curr.guests : 0), 0);
      setStats({ attending, notAttending: 0, totalGuests });
    } catch (e) {
      console.error("Error fetching stats:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeadlinePassed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newRSVP: RSVPData = {
        id: Date.now().toString(),
        ...formData,
        status: formData.status as 'attending' | 'not_attending',
        timestamp: Date.now()
      };
      
      await storage.saveRSVP(newRSVP);

      if (formData.message.trim()) {
        const newWish: Wish = {
          id: `rsvp-${Date.now()}`,
          name: formData.name,
          message: formData.message,
          timestamp: Date.now()
        };
        await storage.saveWish(newWish);
      }

      setSubmitted(true);
      await fetchStats();
    } catch (error) {
      alert("Maaf, ralat berlaku.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-16 md:py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display text-[#2D2D2D] mb-4">Kehadiran</h2>
          <p className="text-primary font-serif italic text-base md:text-lg">Mohon maklumbalas sebelum {rsvpDeadline.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-xl text-center animate-fade-in">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-display mb-2">Terima Kasih!</h3>
              <p className="text-sm text-[#666] font-light">Maklumbalas anda telah direkodkan.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden">
              {/* Compact Stats Header - Replaces the big cards */}
              <div className="bg-stone-50/50 border-b border-stone-100 flex divide-x divide-stone-100">
                <div className="flex-1 p-5 text-center">
                  <span className="block text-2xl font-display text-primary leading-none">{stats.attending}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400 mt-1 block">Kehadiran</span>
                </div>
                <div className="flex-1 p-5 text-center">
                  <span className="block text-2xl font-display text-secondary leading-none">{stats.totalGuests}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400 mt-1 block">Jumlah Tetamu</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-6">
                {isDeadlinePassed && (
                  <div className="bg-red-50 text-red-700/70 p-4 rounded-xl text-[9px] tracking-widest text-center font-bold uppercase">
                    Pendaftaran Ditutup
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest uppercase px-2 text-primary/50">Nama Penuh</label>
                  <input 
                    type="text" required disabled={isDeadlinePassed || isSubmitting}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
                    placeholder="Nama anda"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button" disabled={isDeadlinePassed || isSubmitting}
                    onClick={() => setFormData({...formData, status: 'attending'})}
                    className={`py-4 rounded-xl font-bold text-[9px] tracking-widest uppercase transition-all ${formData.status === 'attending' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-50 text-primary'}`}
                  >
                    HADIR
                  </button>
                  <button 
                    type="button" disabled={isDeadlinePassed || isSubmitting}
                    onClick={() => setFormData({...formData, status: 'not_attending'})}
                    className={`py-4 rounded-xl font-bold text-[9px] tracking-widest uppercase transition-all ${formData.status === 'not_attending' ? 'bg-[#333] text-white' : 'bg-stone-50 text-stone-400'}`}
                  >
                    TIDAK HADIR
                  </button>
                </div>

                {formData.status === 'attending' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[9px] font-bold tracking-widest uppercase px-2 text-primary/50">Bilangan Tetamu</label>
                    <select 
                      disabled={isDeadlinePassed || isSubmitting}
                      value={formData.guests}
                      onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                      className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-transparent outline-none text-sm cursor-pointer"
                    >
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Orang</option>)}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest uppercase px-2 text-primary/50">Ucapan (Opsional)</label>
                  <textarea 
                    disabled={isDeadlinePassed || isSubmitting}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-transparent outline-none h-24 resize-none text-sm"
                    placeholder="Tulis ucapan anda di sini..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isDeadlinePassed || isSubmitting}
                  className="w-full py-5 bg-primary text-white rounded-xl font-bold tracking-widest text-[10px] shadow-xl disabled:opacity-30 uppercase transition-all active:scale-95"
                >
                  {isSubmitting ? 'MENGHANTAR...' : 'SAHKAN KEHADIRAN'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVPSection;
