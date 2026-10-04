
// Language of the admin panel itself. Independent of the invitation's language:
// it is the admin's own preference and is remembered on their device.
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { BASE_LANG, Lang, isLang } from '../config';
import { AdminMessages, adminMs } from './ms';
import { adminEn } from './en';

// To add a panel language: write i18n/admin/<code>.ts (typed as AdminMessages) and list it here.
const ADMIN_MESSAGES: Record<Lang, AdminMessages> = { ms: adminMs, en: adminEn };

const STORAGE_KEY = 'e-wed:admin:lang';

const storedLang = (): Lang => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    // No storage access: use the base language
  }
  return BASE_LANG;
};

interface AdminI18n {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** The admin panel's message dictionary */
  a: AdminMessages;
}

const AdminI18nContext = createContext<AdminI18n | null>(null);

export const AdminI18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(storedLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice simply lasts for this visit
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang, a: ADMIN_MESSAGES[lang] }), [lang, setLang]);
  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
};

export const useAdminI18n = (): AdminI18n => {
  const context = useContext(AdminI18nContext);
  if (!context) throw new Error('useAdminI18n must be used inside <AdminI18nProvider>');
  return context;
};

export type { AdminMessages } from './ms';
