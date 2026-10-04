
import React, { useEffect, useRef, useState } from 'react';
import { WeddingConfig } from '../../types';
import { PREVIEW_MESSAGE, PREVIEW_READY, PreviewMessage } from './preview';
import { Lang } from '../../i18n/config';
import { useAdminI18n } from '../../i18n/admin';

interface PreviewPaneProps {
  /** The unsaved draft */
  config: WeddingConfig;
  /** Section the current tab is about */
  section: string;
  /** The invitation language in the draft */
  lang: Lang;
}

/** The invitation itself, in a phone-sized frame, re-rendered from the draft as the admin types. */
const PreviewPane: React.FC<PreviewPaneProps> = ({ config, section, lang }) => {
  const { a } = useAdminI18n();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const lastSection = useRef<string | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.type === PREVIEW_READY) {
        lastSection.current = null;
        setReady(true);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Typing sends a burst of changes; the frame only needs the last one
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      const message: PreviewMessage = { type: PREVIEW_MESSAGE, config, welcome, lang };
      if (!welcome && lastSection.current !== section) {
        message.section = section;
        lastSection.current = section;
      }
      frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
    }, 200);
    return () => clearTimeout(timer);
  }, [ready, config, section, welcome, lang]);

  const toggleWelcome = () => {
    // Coming back from the welcome screen, return to the tab's section
    if (welcome) lastSection.current = null;
    setWelcome(!welcome);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="text-xs font-bold text-stone-700 uppercase tracking-widest">{a.preview.title}</div>
          <div className="text-[10px] text-stone-400">{a.preview.subtitle}</div>
        </div>
        <button
          type="button"
          onClick={toggleWelcome}
          aria-pressed={welcome}
          className={`px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase border transition-all ${welcome ? 'bg-primary text-white border-primary' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}
        >
          {a.preview.welcome}
        </button>
      </div>
      <div className="flex-1 min-h-0 rounded-[2rem] overflow-hidden border-8 border-stone-800 bg-stone-900 shadow-2xl">
        <iframe ref={frameRef} src={`${window.location.pathname}#preview`} title={a.preview.frameTitle} className="w-full h-full block bg-stone-900" />
      </div>
    </div>
  );
};

export default PreviewPane;
