
// Language of the invitation. It is chosen by the couple in the admin panel
// (invitation.options.language); guests see the invitation in that language.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { InvitationSettings, WeddingConfig } from '../types';
import { BASE_LANG, Lang, isLang, languageDef } from './config';
import { Messages } from './locales/ms';
import { invitationOf } from '../components/helpers';

export { BASE_LANG, LANGUAGES, LANG_CODES, isLang } from './config';
export type { Lang } from './config';

interface I18n {
  lang: Lang;
  /** The message dictionary for the current language */
  t: Messages;
  /** Set the invitation language (from the site config, or from the admin's live preview) */
  setLang: (lang: unknown) => void;
  /** "31 Januari 2026" / "31 January 2026" */
  formatDate: (date: Date | number | string) => string;
  /** The event's weekday and date, in the current language */
  eventDate: (config: WeddingConfig) => { day: string; full: string };
}

const I18nContext = createContext<I18n | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(BASE_LANG);

  const setLang = useCallback((next: unknown) => {
    if (isLang(next)) setLangState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18n>(() => {
    const def = languageDef(lang);
    const dateFormat: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return {
      lang,
      t: def.messages,
      setLang,
      formatDate: date => new Date(date).toLocaleDateString(def.dateLocale, dateFormat),
      eventDate: config => {
        const stored = { day: config.event.day, full: config.event.fullDateDisplay };
        // The stored strings are written in the base language; other languages derive theirs from the date
        if (lang === BASE_LANG) return stored;
        const date = new Date(config.event.date);
        if (isNaN(date.getTime())) return stored;
        return {
          day: date.toLocaleDateString(def.dateLocale, { weekday: 'long', timeZone: 'UTC' }),
          full: date.toLocaleDateString(def.dateLocale, { ...dateFormat, timeZone: 'UTC' })
        };
      }
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18n => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
};

/** The invitation's editable settings, with its text in the current language. */
export const useInvitation = (config: WeddingConfig): InvitationSettings => {
  const { lang } = useI18n();
  return useMemo(() => invitationOf(config, lang), [config, lang]);
};
