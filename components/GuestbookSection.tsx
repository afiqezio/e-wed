
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { Wish } from '../types';

const GuestbookSection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = storage.subscribeWishes((updatedWishes) => {
      setWishes(updatedWishes);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newWish: Wish = {
        id: Date.now().toString(),
        name,
        message,
        timestamp: Date.now()
      };
      await storage.saveWish(newWish);
      setName('');
      setMessage('');
    } catch (e) {
      console.error("Error saving wish:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="py-16 md:py-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-display mb-4">Wishes for the Couple</h2>
        <p className="text-primary font-serif italic text-lg md:text-xl">Send your love and prayers</p>
        <div className="w-16 h-px bg-primary mx-auto mt-6 opacity-30"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-stone-100 h-fit">
          <h3 className="text-xl md:text-2xl font-display mb-6 md:mb-8">Write a Wish</h3>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-bold tracking-widest opacity-40 uppercase px-2">Your Name</label>
              <input 
                type="text" required disabled={isSubmitting}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-bold tracking-widest opacity-40 uppercase px-2">Message</label>
              <textarea 
                required disabled={isSubmitting}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Your wish..."
                className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none h-32 md:h-40 resize-none transition-all text-sm"
              ></textarea>
            </div>
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-4 md:py-5 bg-primary text-white rounded-xl font-bold tracking-widest text-[10px] shadow-xl uppercase active:scale-95"
            >
              {isSubmitting ? 'POSTING...' : 'POST WISH'}
            </button>
          </form>
        </div>

        <div className="space-y-4 max-h-[500px] md:max-h-[700px] overflow-y-auto pr-2 no-scrollbar">
          {wishes.length > 0 ? (
            wishes.map(wish => (
              <div key={wish.id} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-stone-50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-20 group-hover:opacity-100"></div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-base md:text-lg">{wish.name}</h4>
                  <span className="text-[8px] md:text-[10px] text-primary opacity-50 uppercase tracking-widest font-bold">
                    {new Date(wish.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm md:text-base text-[#555] leading-relaxed italic font-serif">
                  "{wish.message}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-16 opacity-30">
              <p className="italic font-serif text-lg">Be the first to send a wish!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestbookSection;
