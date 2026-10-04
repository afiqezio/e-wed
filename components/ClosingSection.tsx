
import React from 'react';
import { WeddingConfig } from '../types';
import { Footer, PhotoFrame } from './ui';
import { Reveal } from './motion';
import { LABEL, coupleInitials, resolveMusic } from './helpers';
import { useI18n, useInvitation } from '../i18n';

interface ClosingSectionProps {
  config: WeddingConfig;
}

const ClosingSection: React.FC<ClosingSectionProps> = ({ config }) => {
  const { credit } = resolveMusic(config);
  const { t } = useI18n();
  const { photos, text } = useInvitation(config);
  return (
  <div style={{ position: 'relative', overflow: 'hidden', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
    <div data-parallax="0.2" style={{ position: 'absolute', top: '-15%', bottom: '-15%', left: 0, right: 0 }}>
      <PhotoFrame fill src={photos.closing} grade="none" scrim="vignette" />
    </div>
    <Reveal style={{ position: 'relative', width: '100%' }}>
      <Footer transparent quote={text.closingQuote} attribution={text.closingSource} initials={coupleInitials(config)} />
    </Reveal>
    {credit && (
      <p style={{ ...LABEL, position: 'absolute', left: 0, right: 0, bottom: 16, margin: 0, textAlign: 'center', fontSize: 'var(--label-xs)', color: 'var(--text-faint)' }}>
        {t.closing.music(credit)}
      </p>
    )}
  </div>
  );
};

export default ClosingSection;
