
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { Wish } from '../types';

const GuestbookSection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Real-time listener
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
    <section id="wishes" className="py-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-display mb-4">Wishes for the Couple</h2>
        <p className="text-primary font-serif italic text-xl">Send your love and prayers</p>
        <div className="w-24 h-px bg-primary mx-auto mt-6 opacity-30"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-stone-100 h-fit hover:shadow-2xl transition-all duration-500">
          <h3 className="text-2xl font-display mb-8">Write a Wish</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase px-2">Your Name</label>
              <input 
                type="text" 
                required
                disabled={isSubmitting}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase px-2">Message</label>
              <textarea 
                required
                disabled={isSubmitting}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Your wish..."
                className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none h-40 resize-none transition-all text-sm"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="relative w-full py-5 bg-primary text-white rounded-2xl font-bold tracking-[0.4em] text-[10px] hover:bg-primary/90 transition-all transform hover:-translate-y-1 shadow-xl shadow-primary/20 uppercase active:scale-95 overflow-hidden"
            >
              <span className={isSubmitting ? 'opacity-0' : 'opacity-100'}>POST WISH</span>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Feed */}
        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
          {wishes.length > 0 ? (
            wishes.map(wish => (
              <div key={wish.id} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-50 animate-fade-in relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-20 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg">{wish.name}</h4>
                  <span className="text-[10px] text-primary opacity-50 uppercase tracking-widest font-bold">
                    {new Date(wish.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#555] leading-relaxed italic font-serif text-lg">
                  "{wish.message}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-24 opacity-30">
              <p className="italic font-serif text-xl">Be the first to send a wish!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestbookSection;
