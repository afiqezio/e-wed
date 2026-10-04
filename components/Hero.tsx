
import React from 'react';
import { WeddingConfig } from '../types';
import { Button, Eyebrow, Icon, NavBar, NavItem, PhotoFrame } from './ui';
import { Motes, floatStyle, scrollToId, useNarrow } from './motion';
import { AMPERSAND, BASMALAH, CALLIGRAPHY_FONT, LABEL, coupleInitials, startTime } from './helpers';
import { useI18n, useInvitation } from '../i18n';

interface HeroProps {
  config: WeddingConfig;
}


const Hero: React.FC<HeroProps> = ({ config }) => {
  const narrow = useNarrow();
  const { groom, bride } = config.couple;
  const { t, eventDate } = useI18n();
  const { timeRange, venueName, venueCity } = config.event;
  const fullDateDisplay = eventDate(config).full;
  const { photos, text, options } = useInvitation(config);
  const navLeft: NavItem[] = [
    { label: t.nav.couple, href: '#couple' },
    { label: t.nav.timeline, href: '#timeline' },
    { label: t.nav.location, href: '#location' }
  ];
  const NAV_RIGHT: NavItem[] = [
    { label: t.nav.registry, href: '#registry' },
    { label: t.nav.rsvp, href: '#rsvp' },
    { label: t.nav.wishes, href: '#wishes' }
  ];
  // Sections switched off in the admin panel drop out of the menu too
  const navRight = NAV_RIGHT.filter(item =>
    (item.href !== '#registry' || options.showRegistry) && (item.href !== '#wishes' || options.showGuestbook));
  const dateLine = `${fullDateDisplay} · ${startTime(timeRange)}`;
  // Each name stays on one line; long names may break on a phone rather than be clipped
  const nameStyle: React.CSSProperties = { whiteSpace: narrow ? 'normal' : 'nowrap' };
  const corner: React.CSSProperties = { ...LABEL, position: 'absolute', bottom: 48, fontSize: 'var(--label-sm)', color: 'var(--text-primary)' };

  return (
    <section id="home" className="wl-screen" style={{ position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div data-parallax="0.35" style={{ position: 'absolute', top: '-12%', bottom: '-12%', left: 0, right: 0 }}>
        <div className="wl-kenburns" style={{ position: 'absolute', inset: 0 }}>
          <PhotoFrame fill src={photos.hero} grade="none" scrim="top-bottom" />
        </div>
      </div>
      <Motes count={22} />

      <NavBar
        initials={coupleInitials(config)}
        mobile={narrow}
        emblem={<span dir="rtl" lang="ar" style={{ fontFamily: CALLIGRAPHY_FONT, fontSize: 22, lineHeight: 1.5, color: 'var(--text-accent)', whiteSpace: 'nowrap' }}>{BASMALAH}</span>}
        left={navLeft}
        right={navRight}
        onNavigate={item => scrollToId(item.href.slice(1))}
      />

      <div
        data-hero-fade="1"
        style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: narrow ? '16px var(--page-gutter) 112px' : '24px var(--page-gutter) 160px', textShadow: 'var(--shadow-text)' }}
      >
        <div className="wl-float" dir="rtl" lang="ar" style={{ ...floatStyle(8), fontFamily: CALLIGRAPHY_FONT, fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1.5, color: 'var(--text-accent)' }}>
          {BASMALAH}
        </div>
        <h1 style={{ margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', columnGap: '.28em', fontFamily: 'var(--font-script)', fontWeight: 400, fontSize: narrow ? 'clamp(32px,9.4vw,44px)' : 'clamp(44px,8vw,112px)', lineHeight: 1.15, color: 'var(--text-primary)' }}>
          <span style={nameStyle}>{groom.fullName}</span>
          <span style={AMPERSAND}>&amp;</span>
          <span style={nameStyle}>{bride.fullName}</span>
        </h1>
        <p style={{ ...LABEL, margin: '20px 0 16px', letterSpacing: '.22em', fontSize: 'clamp(11px,1.6vw,20px)', color: 'var(--text-primary)' }}>
          {text.eventLabel}
        </p>
        <p style={{ margin: narrow ? '0 0 24px' : '0 0 44px', maxWidth: 'var(--measure)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 'var(--serif-body)', lineHeight: 'var(--leading-body)', color: 'var(--text-secondary)', textWrap: 'balance' } as React.CSSProperties}>
          {text.heroMessage}
        </p>
        <Button
          href="#rsvp"
          onClick={e => {
            e.preventDefault();
            scrollToId('rsvp');
          }}
        >
          {t.hero.rsvpCta}
        </Button>
        {narrow && (
          <div style={{ ...LABEL, marginTop: 28, fontSize: 'var(--label-sm)', color: 'var(--text-primary)' }}>{dateLine}</div>
        )}
      </div>

      {!narrow && (
        <>
          <div style={{ ...corner, left: 'var(--page-gutter)' }}>{dateLine}</div>
          <div style={{ ...corner, right: 'var(--page-gutter)' }}>{[venueName, venueCity].filter(Boolean).join(' · ')}</div>
        </>
      )}

      <div className="wl-float" style={{ ...floatStyle(6, 4.4), position: 'absolute', left: 0, right: 0, bottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--text-primary)', pointerEvents: 'none' }}>
        <Icon name="move-down" size={26} />
        <Eyebrow tone="primary" size="xs">{t.hero.scroll}</Eyebrow>
      </div>
    </section>
  );
};

export default Hero;
