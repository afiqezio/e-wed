
import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../services/storage';
import { WeddingConfig, Gift } from '../types';
import { Button, Dialog, Eyebrow, OrnamentDivider, SectionTitle } from './ui';
import { Reveal, useNarrow, useSmoothList } from './motion';
import { LABEL, sectionPad } from './helpers';
import { useI18n, useInvitation } from '../i18n';

interface RegistrySectionProps {
  config: WeddingConfig;
}

const RegistrySection: React.FC<RegistrySectionProps> = ({ config }) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  // Keeps the name on screen while the dialog fades out
  const [dialogName, setDialogName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { bankName, accountNumber, accountHolder } = config.registry;
  const narrow = useNarrow();
  const { t } = useI18n();
  const { text } = useInvitation(config);
  const listRef = useRef<HTMLDivElement>(null);
  const listOverflows = useSmoothList(listRef);

  useEffect(() => {
    // Real-time listener for gifts
    const unsubscribe = storage.subscribeGifts((updatedGifts) => {
      setGifts(updatedGifts);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenConfirm = (gift: Gift) => {
    setDialogName(gift.name);
    setSelectedGift(gift);
  };

  const handleCancel = () => {
    if (!isProcessing) setSelectedGift(null);
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

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(accountNumber.replace(/\s+/g, '')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="registry" className="wl-screen-m" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-page)', padding: sectionPad(narrow) }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 20 : 56, textAlign: 'center' }}>
        <Reveal style={{ width: '100%' }}>
          <SectionTitle
            compact={narrow}
            eyebrow={t.registry.eyebrow}
            title={t.registry.title}
            subtitle={text.registryNote}
          />
        </Reveal>

        {gifts.length > 0 && (
          // On a phone a long list scrolls inside its own frame so the section still fits one screen
          <div
            ref={listRef}
            className={narrow ? 'wl-scroll' : undefined}
            {...(listOverflows ? { 'data-lenis-prevent': '' } : {})}
            style={{ width: '100%', textAlign: 'left', ...(narrow ? { maxHeight: 'max(150px, calc(100svh - 420px))', overflowY: 'auto' } : null) }}
          >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {gifts.map((gift, i) => (
              <Reveal key={gift.id} index={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: narrow ? 12 : 24, padding: narrow ? '9px 0' : '20px 0', borderTop: 'var(--border-hairline)', opacity: gift.reserved ? 0.6 : 1, transition: 'opacity var(--dur-base) var(--ease-editorial)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(16px,3vw,28px)', minWidth: 0 }}>
                    <span style={{ ...LABEL, flex: 'none', textTransform: 'none', fontSize: 'var(--label-sm)', color: 'var(--text-accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: narrow ? 0 : 4, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: narrow ? 17 : 'var(--serif-lead)', lineHeight: narrow ? 1.3 : undefined, color: 'var(--text-primary)' }}>{gift.name}</span>
                      {!gift.reserved && gift.buyLink && (
                        <a href={gift.buyLink} target="_blank" rel="noopener noreferrer" style={{ ...LABEL, fontSize: 'var(--label-xs)', color: 'var(--text-muted)' }}>
                          {t.registry.viewInShop}
                        </a>
                      )}
                    </div>
                  </div>
                  {gift.reserved ? (
                    <span style={{ ...LABEL, flex: 'none', letterSpacing: '.24em', fontSize: 'var(--label-xs)', color: 'var(--text-success)' }}>{t.registry.reserved}</span>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleOpenConfirm(gift)} style={{ flex: 'none' }}>{t.registry.reserve}</Button>
                  )}
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: 'var(--border-hairline)' }}></div>
          </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 4 : 12 }}>
          <Eyebrow tone="accent" size="xs">{t.registry.digital(bankName)}</Eyebrow>
          <button className="wl-account" style={narrow ? { fontSize: 24 } : undefined} onClick={handleCopyAccount} aria-label={t.registry.copyAria(accountNumber)}>{accountNumber}</button>
          <span aria-live="polite" style={{ ...LABEL, fontSize: 'var(--label-xs)', color: 'var(--text-muted)' }}>
            {copied ? t.registry.copied : t.registry.copyHint(accountHolder)}
          </span>
        </div>
        {!narrow && <OrnamentDivider width={200} />}
      </div>

      {/* Confirmation dialog */}
      <Dialog open={!!selectedGift} onClose={handleCancel} eyebrow={t.registry.confirmEyebrow} title={t.registry.title}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 'var(--serif-body)', lineHeight: 'var(--leading-body)', color: 'var(--text-primary)' }}>
            {t.registry.confirmBefore}<em style={{ color: 'var(--text-accent)' }}>{dialogName}</em>{t.registry.confirmAfter}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Button fullWidth disabled={isProcessing} onClick={handleConfirmReservation}>
              {isProcessing ? t.registry.saving : t.registry.confirm}
            </Button>
            <Button variant="ghost" size="sm" disabled={isProcessing} onClick={handleCancel}>{t.registry.cancel}</Button>
          </div>
        </div>
      </Dialog>
    </section>
  );
};

export default RegistrySection;
