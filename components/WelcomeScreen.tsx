
import React from 'react';
import { WeddingConfig } from '../types';
import { Button, Eyebrow, PhotoFrame } from './ui';
import { AMPERSAND, BASMALAH, CALLIGRAPHY_FONT, LABEL } from './helpers';
import { useI18n, useInvitation } from '../i18n';

interface WelcomeScreenProps {
  config: WeddingConfig;
  onEnter: () => void;
  leaving: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ config, onEnter, leaving }) => {
  const { groom, bride } = config.couple;
  const { t, eventDate } = useI18n();
  const { day, full: fullDateDisplay } = eventDate(config);
  const { photos, text } = useInvitation(config);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-deep)',
        overflow: 'hidden',
        transition: 'opacity var(--dur-reveal) var(--ease-editorial)',
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? 'none' : 'auto'
      }}
    >
      <PhotoFrame fill src={photos.hero} grade="none" scrim="vignette" />
      <div style={{ position: 'relative', textAlign: 'center', padding: '0 var(--page-gutter)', display: 'flex', flexDirection: 'column', alignItems: 'center', textShadow: 'var(--shadow-text)' }}>
        <Eyebrow wide>{text.eventLabel}</Eyebrow>
        <div dir="rtl" lang="ar" style={{ fontFamily: CALLIGRAPHY_FONT, fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1.5, color: 'var(--text-accent)', marginTop: 32 }}>
          {BASMALAH}
        </div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-script)', fontWeight: 400, fontSize: 'clamp(48px,8vw,112px)', lineHeight: 1.15, color: 'var(--text-primary)' }}>
          {groom.shortName} <span style={AMPERSAND}>&amp;</span> {bride.shortName}
        </h1>
        <p style={{ ...LABEL, margin: '20px 0 56px', letterSpacing: '.22em', fontSize: 'clamp(11px,1.4vw,14px)', color: 'var(--text-primary)' }}>
          {day} · {fullDateDisplay}
        </p>
        <Button size="lg" onClick={onEnter}>{t.welcome.open}</Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
