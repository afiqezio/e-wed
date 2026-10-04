
import React from 'react';
import { useI18n } from '../i18n';

interface LoadingScreenProps {
  leaving?: boolean;
  failed?: boolean;
}

/**
 * Shown until the real invitation data (and its first photo and fonts) are ready,
 * so guests never see placeholder content. Styles live in index.html, where the
 * same markup paints before any script has loaded.
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ leaving = false, failed = false }) => {
  const { t } = useI18n();
  return (
  <div className="wl-splash" role="status" aria-live="polite" data-leaving={leaving}>
    <span className="wl-splash-glyph" aria-hidden="true">⚘︎</span>
    {failed ? (
      <>
        <p className="wl-splash-message">{t.loading.failed}</p>
        <button className="wl-splash-button" onClick={() => window.location.reload()}>{t.loading.retry}</button>
      </>
    ) : (
      <>
        <span className="wl-splash-line" aria-hidden="true"></span>
        <span className="wl-splash-text">{t.loading.label}</span>
      </>
    )}
  </div>
  );
};

export default LoadingScreen;
