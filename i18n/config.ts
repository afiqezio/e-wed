
// The language registry. To add a language: write i18n/locales/<code>.ts (typed as Messages,
// plus its default content) and add one entry here. Everything else — the switcher, the admin
// panel's content-language picker, date formatting — reads from this list.
import { InvitationSettings } from '../types';
import { Messages, ms } from './locales/ms';
import { en, enContent } from './locales/en';

export interface LanguageDef {
  /** Name shown in menus, in the language itself */
  label: string;
  /** Short code shown on the switcher */
  short: string;
  /** BCP 47 tag for dates and numbers */
  dateLocale: string;
  messages: Messages;
  /** Default wording for the editable text; the base language takes its defaults from the site config */
  content?: InvitationSettings['text'];
}

export const LANGUAGES = {
  ms: { label: 'Bahasa Melayu', short: 'BM', dateLocale: 'ms-MY', messages: ms },
  en: { label: 'English', short: 'EN', dateLocale: 'en-GB', messages: en, content: enContent }
} satisfies Record<string, LanguageDef>;

export type Lang = keyof typeof LANGUAGES;

/** The language the stored config (names, schedule, stored dates) is written in */
export const BASE_LANG: Lang = 'ms';

export const LANG_CODES = Object.keys(LANGUAGES) as Lang[];

export const isLang = (value: unknown): value is Lang =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(LANGUAGES, value);

export const languageDef = (lang: Lang): LanguageDef => LANGUAGES[lang];
