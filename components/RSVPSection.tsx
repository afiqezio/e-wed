
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { RSVPData } from '../types';
import { RSVP_DEADLINE } from '../constants';

const RSVPSection: React.FC = () => {
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
  const isDeadlinePassed = new Date() > RSVP_DEADLINE;

  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    const data = storage.getRSVPs();
    const attending = data.filter(d => d.status === 'attending').length;
    const notAttending = data.filter(d => d.status === 'not_attending').length;
    const totalGuests = data.reduce((acc, curr) => acc + (curr.status === 'attending' ? curr.guests : 0), 0);
    setStats({ attending, notAttending, totalGuests });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeadlinePassed) return;

    const newRSVP: RSVPData = {
      id: Date.now().toString(),
      ...formData,
      status: formData.status as 'attending' | 'not_attending',
      timestamp: Date.now()
    };
    storage.saveRSVP(newRSVP);
    setSubmitted(true);
    refreshStats();
  };

  return (
    <section id="rsvp" className="py-24 bg-[#FAF7F5]" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg), black 2%)' }}>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-display text-[#2D2D2D] mb-4">Kehadiran</h2>
        <p className="text-primary font-serif italic text-lg">Mohon maklumbalas sebelum {RSVP_DEADLINE.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <div className="w-24 h-px bg-primary mx-auto mt-6 opacity-20"></div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12 px-4">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center border-t-4 border-primary">
            <div className="text-4xl font-display text-primary">{stats.attending}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mt-3">Hadir</div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center border-t-4 border-secondary">
            <div className="text-4xl font-display text-secondary">{stats.totalGuests}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mt-3">Jumlah Tetamu</div>
          </div>
        </div>

        <div className="md:col-span-2">
          {submitted ? (
            <div className="bg-white p-16 rounded-[3rem] shadow-2xl text-center animate-fade-in border border-[#F0E6DD]">
              <div className="w-24 h-24 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-3xl font-display mb-3">Terima Kasih!</h3>
              <p className="text-[#666] font-light">Maklumbalas anda telah kami terima. Jumpa di sana nanti!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl space-y-8 border border-[#F0E6DD]">
              {isDeadlinePassed && (
                <div className="bg-red-50 text-red-700/70 p-5 rounded-[1.5rem] text-[10px] tracking-[0.2em] text-center font-bold uppercase">
                  TARIKH TUTUP RSVP TELAH BERLALU
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.3em] opacity-60 uppercase px-2" style={{ color: 'var(--color-primary)' }}>Nama Penuh</label>
                <input 
                  type="text" 
                  required 
                  disabled={isDeadlinePassed}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-5 rounded-[1.5rem] bg-stone-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none text-sm placeholder:text-stone-300"
                  placeholder="Masukkan nama penuh anda"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <button 
                  type="button"
                  disabled={isDeadlinePassed}
                  onClick={() => setFormData({...formData, status: 'attending'})}
                  className={`py-5 rounded-[1.5rem] font-bold text-[10px] tracking-[0.3em] transition-all uppercase ${formData.status === 'attending' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-stone-50 text-primary hover:bg-stone-100'}`}
                >
                  AKAN HADIR
                </button>
                <button 
                  type="button"
                  disabled={isDeadlinePassed}
                  onClick={() => setFormData({...formData, status: 'not_attending'})}
                  className={`py-5 rounded-[1.5rem] font-bold text-[10px] tracking-[0.3em] transition-all uppercase ${formData.status === 'not_attending' ? 'bg-[#333] text-white shadow-xl' : 'bg-stone-50 text-gray-400 hover:bg-stone-100'}`}
                >
                  TIDAK HADIR
                </button>
              </div>

              {formData.status === 'attending' && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-[10px] font-bold tracking-[0.3em] opacity-60 uppercase px-2" style={{ color: 'var(--color-primary)' }}>Jumlah Tetamu</label>
                  <select 
                    disabled={isDeadlinePassed}
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                    className="w-full px-6 py-5 rounded-[1.5rem] bg-stone-50 border border-transparent outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 text-sm cursor-pointer"
                  >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Orang</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.3em] opacity-60 uppercase px-2" style={{ color: 'var(--color-primary)' }}>Ucapan Ringkas</label>
                <textarea 
                  disabled={isDeadlinePassed}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-6 py-5 rounded-[1.5rem] bg-stone-50 border border-transparent outline-none h-40 resize-none focus:bg-white focus:ring-4 focus:ring-primary/5 text-sm placeholder:text-stone-300"
                  placeholder="Tinggalkan ucapan buat pengantin..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isDeadlinePassed}
                className="w-full py-6 bg-primary text-white rounded-[1.5rem] font-bold tracking-[0.4em] text-[11px] hover:bg-primary/90 transition-all transform hover:-translate-y-1 shadow-2xl shadow-primary/20 disabled:opacity-30 active:scale-95 uppercase"
              >
                HANTAR RSVP
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVPSection;
