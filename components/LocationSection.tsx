
import React from 'react';
import { WeddingConfig } from '../types';
import { Button, Eyebrow, SectionTitle } from './ui';
import { Reveal, useNarrow } from './motion';
import { sectionPad } from './helpers';
import { useI18n } from '../i18n';

interface LocationSectionProps {
  config: WeddingConfig;
}

const LocationSection: React.FC<LocationSectionProps> = ({ config }) => {
  const narrow = useNarrow();
  const { t } = useI18n();
  const { venueName, venueCity, venueState, timeRange, location } = config.event;
  // "Kota Bharu, Kelantan · 10:00 AM — 10:00 PM"
  const subtitle = [[venueCity, venueState].filter(Boolean).join(', '), timeRange.replace(/\s*-\s*/, ' — ')].filter(Boolean).join(' · ');
  const contacts = config.contacts || [];

  return (
    <section id="location" className="wl-screen-m" style={{ position: 'relative', background: 'var(--bg-deep)', padding: sectionPad(narrow), textAlign: 'center' }}>
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 20 : 48 }}>
        <Reveal style={{ width: '100%' }}>
          <SectionTitle compact={narrow} eyebrow={t.location.eyebrow} title={venueName} subtitle={subtitle} />
        </Reveal>
        <Reveal index={1} style={{ width: '100%', border: 'var(--border-soft)', outline: '1px solid var(--line-hairline)', outlineOffset: 6, lineHeight: 0 }}>
          <iframe
            src={location.embedUrl}
            width="100%"
            style={{ border: 0, height: narrow ? 'min(300px,28svh)' : 420, filter: 'grayscale(1) invert(.9) sepia(.45) contrast(.85) brightness(.9)' }}
            allowFullScreen
            loading="lazy"
            title={t.location.mapTitle}
          ></iframe>
        </Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          <Button href={location.googleMaps} target="_blank" rel="noopener noreferrer">Google Maps</Button>
          <Button href={location.waze} target="_blank" rel="noopener noreferrer">Waze</Button>
        </div>
        {contacts.length > 0 ? (
          <div style={{ width: '100%', maxWidth: 640, display: 'grid', gridTemplateColumns: narrow && contacts.length > 1 ? 'repeat(2,minmax(0,1fr))' : 'repeat(auto-fit,minmax(min(220px,100%),1fr))', marginTop: narrow ? 0 : 32, borderTop: 'var(--border-hairline)' }}>
            {contacts.map((contact, idx) => (
              <a key={idx} href={contact.link} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 2 : 8, padding: narrow ? '12px 6px' : '32px 16px', borderBottom: 'var(--border-hairline)' }}>
                <Eyebrow size="xs">{contact.side === 'groom' ? t.location.groomSide : t.location.brideSide}</Eyebrow>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: narrow ? 17 : 'var(--serif-lead)', lineHeight: narrow ? 1.3 : undefined, color: 'var(--text-primary)' }}>{contact.name}</span>
                <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, letterSpacing: narrow ? '.08em' : '.2em', fontSize: 'var(--label-md)', color: 'var(--text-muted)' }}>{contact.phone}</span>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>
            {t.location.noContacts}
          </p>
        )}
      </div>
    </section>
  );
};

export default LocationSection;
