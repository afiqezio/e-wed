
import React, { useState, useEffect, useRef } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';
import CoupleSection from './components/CoupleSection';
import InterludeSection from './components/InterludeSection';
import TimelineSection from './components/TimelineSection';
import LocationSection from './components/LocationSection';
import RSVPSection from './components/RSVPSection';
import GuestbookSection from './components/GuestbookSection';
import RegistrySection from './components/RegistrySection';
import ClosingSection from './components/ClosingSection';
import MusicPlayer from './components/MusicPlayer';
import AdminPanel from './components/AdminPanel';
import { scrollToId, useInvitationMotion } from './components/motion';
import { applyInvitationLook, invitationOf } from './components/helpers';
import { PREVIEW_MESSAGE, PREVIEW_READY, PreviewMessage } from './components/admin/preview';
import { useI18n } from './i18n';
import { storage } from './services/storage';
import { WeddingConfig } from './types';
import { FALLBACK_CONFIG } from './constants_dummy';

// Last config seen on this device: lets a returning guest see the invitation at once
// while the live copy is fetched in the background.
const CACHE_KEY = 'e-wed:config:v1';
const LOAD_TIMEOUT_MS = 12000;
const ASSET_WAIT_MS = 2500;

const readCachedConfig = (): WeddingConfig | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.couple && parsed.event ? parsed : null;
  } catch {
    return null;
  }
};

const writeCachedConfig = (config: WeddingConfig) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(config));
  } catch {
    // Private mode or full storage: the cache is only a convenience
  }
};

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash);
  const isAdmin = currentRoute === '#admin';
  // #preview is the admin panel's live preview frame: it renders the draft it is sent
  const isPreview = currentRoute === '#preview';

  const [config, setConfig] = useState<WeddingConfig | null>(() => (window.location.hash === '#preview' ? null : readCachedConfig()));
  const [loadFailed, setLoadFailed] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [splashMounted, setSplashMounted] = useState(true);
  const [isWelcomeMounted, setIsWelcomeMounted] = useState(true);
  const [isLeavingWelcome, setIsLeavingWelcome] = useState(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);
  const [previewWelcome, setPreviewWelcome] = useState(false);
  const pendingSection = useRef<string | null>(null);
  const { lang, setLang } = useI18n();

  const { options } = invitationOf(config ?? (FALLBACK_CONFIG as unknown as WeddingConfig));
  const isReady = !!config && (isAdmin || assetsReady);
  const showWelcome = isPreview ? previewWelcome : options.showWelcome && isWelcomeMounted;
  const hasEntered = isPreview ? !previewWelcome : isLeavingWelcome || !options.showWelcome;

  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Live config
  useEffect(() => {
    if (isPreview) return;
    const unsubscribe = storage.subscribeConfig(
      (newConfig) => {
        if (!newConfig) return;
        setConfig(newConfig);
        setLoadFailed(false);
        writeCachedConfig(newConfig);
        injectTheme(newConfig);
      },
      () => setLoadFailed(true)
    );
    return () => unsubscribe();
  }, [isPreview]);

  // Draft config sent by the admin panel
  useEffect(() => {
    if (!isPreview) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as PreviewMessage;
      if (!data || data.type !== PREVIEW_MESSAGE) return;
      setConfig(data.config);
      setPreviewWelcome(!!data.welcome);
      if (data.lang) setLang(data.lang);
      if (data.section) pendingSection.current = data.section;
    };
    window.addEventListener('message', onMessage);
    window.parent?.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, [isPreview]);

  useEffect(() => {
    if (!isPreview || !isReady || previewWelcome || !pendingSection.current) return;
    const section = pendingSection.current;
    pendingSection.current = null;
    const raf = requestAnimationFrame(() => scrollToId(section));
    return () => cancelAnimationFrame(raf);
  });

  // No answer at all (offline, blocked): say so instead of waiting forever
  useEffect(() => {
    if (config || isPreview) return;
    const timer = setTimeout(() => setLoadFailed(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [config, isPreview]);

  // Hold the splash until the first photo and the fonts are in, so the page appears whole
  useEffect(() => {
    if (!config || assetsReady) return;
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setAssetsReady(true);
    };
    const hero = new Image();
    hero.src = invitationOf(config).photos.hero;
    const photo = hero.decode ? hero.decode().catch(() => undefined) : Promise.resolve();
    const fonts = document.fonts?.load
      ? Promise.all([
          document.fonts.load('400 48px "Pinyon Script"'),
          document.fonts.load('500 14px "Cormorant Garamond"')
        ]).catch(() => undefined)
      : Promise.resolve();
    Promise.all([photo, fonts]).then(finish);
    const timer = setTimeout(finish, ASSET_WAIT_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [config, assetsReady]);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => setSplashMounted(false), 700);
    return () => clearTimeout(timer);
  }, [isReady]);

  // The invitation stays put behind the splash and the welcome screen
  useEffect(() => {
    if (isAdmin || (isReady && hasEntered)) return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isAdmin, isReady, hasEntered]);

  useInvitationMotion(!isAdmin && isReady && hasEntered, options.motion);

  // Palette and motion switch chosen in the admin panel
  useEffect(() => {
    if (config) applyInvitationLook(config);
  }, [config]);

  // The invitation is shown in the language chosen in the admin panel
  useEffect(() => {
    if (config && !isPreview) setLang(options.language);
  }, [config, isPreview, options.language]);

  useEffect(() => {
    if (!config || isAdmin) return;
    const { groom, bride } = config.couple;
    document.title = `${groom.shortName} & ${bride.shortName} · ${invitationOf(config, lang).text.eventLabel}`;
  }, [config, isAdmin, lang]);

  // Legacy palette: only the admin panel reads these. The invitation's look comes from config.invitation.
  const injectTheme = (conf: WeddingConfig) => {
    if (conf.theme) {
      const root = document.documentElement;
      const { colors } = conf.theme;
      if (colors) {
        Object.entries(colors).forEach(([key, val]) => {
          if (val) root.style.setProperty(`--color-${key}`, val);
        });
      }
    }
  };

  const handleEnter = () => {
    if (isPreview) return;
    setIsLeavingWelcome(true);
    setShouldPlayMusic(true);
    setTimeout(() => setIsWelcomeMounted(false), 1400);
  };

  const splash = splashMounted && <LoadingScreen leaving={isReady} failed={loadFailed && !config} />;

  if (!config) {
    return <>{splash}</>;
  }

  if (isAdmin) {
    return <AdminPanel config={config} />;
  }

  return (
    <div className="wl">
      {splash}
      {showWelcome && <WelcomeScreen config={config} onEnter={handleEnter} leaving={isLeavingWelcome} />}

      <main>
        <Hero config={config} />
        <CoupleSection config={config} />
        <InterludeSection config={config} />
        <TimelineSection config={config} />
        <LocationSection config={config} />
        {options.showRegistry && <RegistrySection config={config} />}
        <RSVPSection config={config} />
        {options.showGuestbook && <GuestbookSection />}
        <ClosingSection config={config} />
      </main>

      <MusicPlayer config={config} autoStart={shouldPlayMusic} />
    </div>
  );
};

export default App;
