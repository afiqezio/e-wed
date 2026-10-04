
import React from 'react';
import { WeddingConfig } from '../types';
import { Eyebrow, OrnamentDivider, PhotoFrame, SectionTitle } from './ui';
import { Reveal, floatStyle, useNarrow } from './motion';
import { sectionPad } from './helpers';
import { useI18n, useInvitation } from '../i18n';

interface CoupleSectionProps {
  config: WeddingConfig;
}

type Person = WeddingConfig['couple']['groom'];

const PersonBlock: React.FC<{ person: Person; role: string; relation: string; index: number; compact: boolean }> = ({ person, role, relation, index, compact }) => (
  <Reveal index={index} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 4 : 12 }}>
    <Eyebrow size="xs">{role}</Eyebrow>
    <h3 style={{ margin: 0, fontFamily: 'var(--font-script)', fontWeight: 400, fontSize: compact ? 'clamp(28px,8.2vw,38px)' : 'clamp(40px,5vw,var(--script-md))', lineHeight: 1.2, color: 'var(--text-primary)' }}>{person.fullName}</h3>
    <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: compact ? 16 : 'var(--serif-lead)', color: 'var(--text-secondary)' }}>{relation}</p>
    <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: compact ? 15 : 'var(--serif-body)', lineHeight: compact ? 1.4 : 1.65, color: 'var(--text-primary)' }}>
      {person.parents.father}<br />
      &amp; {person.parents.mother}
    </p>
  </Reveal>
);

const CoupleSection: React.FC<CoupleSectionProps> = ({ config }) => {
  const narrow = useNarrow();
  const { groom, bride } = config.couple;
  const { t } = useI18n();
  const { photos, text } = useInvitation(config);
  const dir = narrow ? 'column' : 'row';
  const rule: React.CSSProperties = narrow
    ? { display: 'block', width: 40, height: 1, background: 'var(--line-accent)' }
    : { display: 'block', width: 1, height: 72, background: 'var(--line-accent)' };

  return (
    <section id="couple" className="wl-screen" style={{ position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <div data-parallax="0.12" style={{ position: 'absolute', top: '-15%', bottom: '-15%', left: 0, right: 0, opacity: 0.55 }}>
        <PhotoFrame fill src={photos.couple} grade="none" scrim="vignette" />
      </div>
      <div style={{ position: 'relative', padding: sectionPad(narrow), width: '100%', maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 14 : 'clamp(48px,7vw,80px)', textAlign: 'center' }}>
        <Reveal style={{ width: '100%' }}>
          <SectionTitle compact={narrow} eyebrow={t.couple.eyebrow} title={text.coupleTitle} subtitle={text.coupleSubtitle} />
        </Reveal>
        <div style={{ width: '100%', display: 'flex', flexDirection: dir, alignItems: 'center', justifyContent: 'center', gap: narrow ? 12 : 'clamp(24px,5vw,64px)' }}>
          <PersonBlock person={groom} role={t.couple.groom} relation={t.couple.sonOf} index={0} compact={narrow} />
          <div className="wl-float" style={{ ...floatStyle(6, 5), flex: 'none', display: 'flex', flexDirection: dir, alignItems: 'center', gap: narrow ? 10 : 16 }}>
            <span style={rule}></span>
            <span style={{ fontFamily: 'var(--font-script)', fontWeight: 400, fontSize: narrow ? 34 : 'clamp(56px,7vw,88px)', lineHeight: 1, color: 'var(--text-accent)' }}>&amp;</span>
            <span style={rule}></span>
          </div>
          <PersonBlock person={bride} role={t.couple.bride} relation={t.couple.daughterOf} index={1} compact={narrow} />
        </div>
        {!narrow && <OrnamentDivider width={220} />}
      </div>
    </section>
  );
};

export default CoupleSection;
