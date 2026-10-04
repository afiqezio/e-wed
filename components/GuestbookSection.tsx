
import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../services/storage';
import { Wish } from '../types';
import { Button, SectionTitle, TextField } from './ui';
import { Reveal, useNarrow, useSmoothList } from './motion';
import { LABEL, sectionPad } from './helpers';
import { useI18n } from '../i18n';

const GuestbookSection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const narrow = useNarrow();
  const { t, formatDate } = useI18n();
  const listRef = useRef<HTMLDivElement>(null);
  const listOverflows = useSmoothList(listRef);

  useEffect(() => {
    const unsubscribe = storage.subscribeWishes((updatedWishes) => {
      setWishes(updatedWishes);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name.trim() || !message.trim()) {
      setError(t.wishes.required);
      return;
    }

    setIsSubmitting(true);
    try {
      const newWish: Wish = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        timestamp: Date.now()
      };
      await storage.saveWish(newWish);
      setName('');
      setMessage('');
    } catch (e) {
      console.error("Error saving wish:", e);
      setError(t.wishes.failed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="wl-screen-m" style={{ position: 'relative', background: 'var(--bg-page)', padding: sectionPad(narrow) }}>
      <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 20 : 64 }}>
        <Reveal style={{ width: '100%' }}>
          <SectionTitle compact={narrow} eyebrow={t.wishes.eyebrow} title={t.wishes.title} subtitle={t.wishes.subtitle} />
        </Reveal>
        <Reveal index={1} style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: narrow ? 24 : 'clamp(48px,7vw,80px)', alignItems: 'start' }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: narrow ? 16 : 32 }}>
            <TextField
              label={t.wishes.name}
              disabled={isSubmitting}
              value={name}
              onChange={v => {
                setName(v);
                setError(null);
              }}
            />
            <TextField
              label={t.wishes.message}
              multiline
              rows={narrow ? 2 : 4}
              placeholder={t.wishes.placeholder}
              disabled={isSubmitting}
              value={message}
              onChange={v => {
                setMessage(v);
                setError(null);
              }}
              error={error}
            />
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? t.wishes.sending : t.wishes.submit}
            </Button>
          </form>

          {/* The wheel is only claimed when there is something to scroll; at either end it hands back to the page */}
          <div
            ref={listRef}
            className="wl-scroll"
            tabIndex={listOverflows ? 0 : undefined}
            aria-label={t.wishes.listLabel}
            {...(listOverflows ? { 'data-lenis-prevent': '' } : {})}
            style={{ maxHeight: narrow ? 'max(110px, calc(100svh - 526px))' : 560, overflowY: 'auto', borderTop: 'var(--border-hairline)' }}
          >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {wishes.length > 0 ? (
              wishes.map(wish => (
                <div key={wish.id} style={{ padding: narrow ? '14px 0' : '28px 0', borderBottom: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: narrow ? 17 : 'var(--serif-lead)', lineHeight: narrow ? 1.4 : 1.5, color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>
                    “{wish.message}”
                  </p>
                  <span style={{ ...LABEL, letterSpacing: '.22em', fontSize: 'var(--label-xs)', color: 'var(--text-muted)' }}>
                    — {wish.name}{wish.timestamp ? ` · ${formatDate(wish.timestamp)}` : ''}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ margin: 0, padding: narrow ? '20px 0' : '48px 0', textAlign: 'center', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'var(--serif-lead)', color: 'var(--text-muted)' }}>
                {t.wishes.empty}
              </p>
            )}
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default GuestbookSection;
