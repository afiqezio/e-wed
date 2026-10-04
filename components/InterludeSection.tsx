
import React, { useEffect, useState } from 'react';
import { WeddingConfig } from '../types';
import { Eyebrow, OrnamentDivider, PhotoFrame } from './ui';
import { Reveal, useNarrow } from './motion';
import { LABEL, eventStart, sectionPad } from './helpers';
import { useI18n, useInvitation } from '../i18n';

interface InterludeSectionProps {
  config: WeddingConfig;
}

const InterludeSection: React.FC<InterludeSectionProps> = ({ config }) => {
  const narrow = useNarrow();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(clock);
  }, []);

  const { t } = useI18n();
  const { photos, text, options } = useInvitation(config);
  const ms = Math.max(0, eventStart(config) - now) || 0;
  const values = [Math.floor(ms / 864e5), Math.floor(ms / 36e5) % 24, Math.floor(ms / 6e4) % 60, Math.floor(ms / 1e3) % 60];

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: narrow ? '100svh' : '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: sectionPad(narrow), textAlign: 'center' }}>
      <div data-parallax="0.25" style={{ position: 'absolute', top: '-20%', bottom: '-20%', left: 0, right: 0 }}>
        <PhotoFrame fill src={photos.flowers} grade="none" scrim="vignette" />
      </div>
      <div style={{ position: 'relative', maxWidth: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 20 : 40, textShadow: 'var(--shadow-text)' }}>
        {text.quote && (
        <Reveal style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <OrnamentDivider width={160} />
          <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: narrow ? 'clamp(18px,5.2vw,24px)' : 'clamp(24px,3.4vw,40px)', lineHeight: 1.4, color: 'var(--text-primary)', textWrap: 'balance' } as React.CSSProperties}>
            “{text.quote}”
          </p>
          {text.quoteSource && <Eyebrow size="xs" tone="accent">— {text.quoteSource} —</Eyebrow>}
        </Reveal>
        )}
        {options.showCountdown && (
        <Reveal index={1} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 16 : 24, marginTop: narrow ? 12 : 32 }}>
          <Eyebrow wide size="xs">{t.countdown.label}</Eyebrow>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {t.countdown.units.map((label, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '0 clamp(14px,3.5vw,40px)', borderLeft: i ? 'var(--border-soft)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(34px,5vw,var(--serif-h1))', lineHeight: 1, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                  {i ? String(values[i]).padStart(2, '0') : values[i]}
                </span>
                <span style={{ ...LABEL, letterSpacing: '.24em', fontSize: 'var(--label-xs)', color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
        )}
      </div>
    </section>
  );
};

export default InterludeSection;
