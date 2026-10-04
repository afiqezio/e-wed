
import React from 'react';
import { EventSchedule, InvitationSettings, WeddingConfig } from '../types';
import { BASE_LANG, Lang, languageDef } from '../i18n/config';
import { FALLBACK_CONFIG } from '../constants_dummy';

export const BASMALAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
export const CALLIGRAPHY_FONT = "'Khat Diwani',var(--font-arabic)";

// The script ampersand between the couple's names
export const AMPERSAND: React.CSSProperties = {
  fontFamily: 'var(--font-script)',
  fontWeight: 400,
  fontSize: '1em',
  lineHeight: 1,
  color: 'var(--text-accent)',
  padding: '0 .08em'
};

// The invitation's own soundtrack. The template's old sample track counts as "not set".
export const DESIGN_MUSIC = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kevin_MacLeod_-_Canon_in_D_Major.ogg',
  credit: 'Canon in D — Kevin MacLeod (CC BY 3.0)'
};
const LEGACY_SAMPLE_TRACK = /soundhelix\.com/i;

export const resolveMusic = (config: WeddingConfig) => {
  const { url, volume, credit } = config.music;
  if (!url || LEGACY_SAMPLE_TRACK.test(url)) return { ...DESIGN_MUSIC, volume };
  return { url, volume, credit: credit || '' };
};

export const INVITATION_DEFAULTS: InvitationSettings = FALLBACK_CONFIG.invitation;

const nonEmpty = <T extends object>(values?: T): Partial<T> =>
  Object.fromEntries(Object.entries(values || {}).filter(([, v]) => v !== '' && v != null)) as Partial<T>;

/**
 * The invitation settings with every gap filled from the design defaults.
 * For a language other than the base one, the text is that language's default wording
 * overlaid with whatever the couple has written for it in the admin panel.
 */
export const invitationOf = (config: WeddingConfig, lang: Lang = BASE_LANG): InvitationSettings => {
  const d = INVITATION_DEFAULTS;
  const v: Partial<InvitationSettings> = config.invitation || {};
  const baseText = { ...d.text, ...v.text };
  const photos = { ...d.photos, ...v.photos };
  (Object.keys(d.photos) as (keyof InvitationSettings['photos'])[]).forEach(k => {
    if (!photos[k]) photos[k] = d.photos[k];
  });
  return {
    photos,
    text: lang === BASE_LANG
      ? baseText
      : { ...(languageDef(lang).content ?? baseText), ...nonEmpty(v.i18n?.[lang]?.text) },
    colors: { ...d.colors, ...v.colors },
    // Only the options this version knows: settings retired from older versions are dropped on the next save
    options: Object.fromEntries(
      Object.keys(d.options).map(k => [k, (v.options as Record<string, unknown> | undefined)?.[k] ?? (d.options as Record<string, unknown>)[k]])
    ) as InvitationSettings['options'],
    i18n: v.i18n || {}
  };
};

/** A schedule item with its wording in the given language, falling back to the base wording. */
export const localizedItem = (item: EventSchedule, lang: Lang): EventSchedule =>
  lang === BASE_LANG ? item : { ...item, ...nonEmpty(item.i18n?.[lang]) };

/**
 * Pushes the admin's palette and motion switch onto the page.
 * A colour left at its default is not overridden, so the stock look stays exactly the design's.
 */
export const applyInvitationLook = (config: WeddingConfig) => {
  const { colors: c, options } = invitationOf(config);
  const d = INVITATION_DEFAULTS.colors;
  const custom = (k: keyof typeof d) => (c[k] || '').trim().toLowerCase() !== d[k].toLowerCase() && !!c[k];
  const mix = (a: string, pct: number, b: string) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

  const vars: Record<string, string | null> = {
    '--brown-900': custom('background') ? c.background : null,
    '--brown-850': custom('background') ? mix(c.background, 92, 'white') : null,
    '--brown-950': custom('deep') ? c.deep : null,
    '--brown-975': custom('deep') ? mix(c.deep, 78, 'black') : null,
    '--cream-100': custom('text') ? c.text : null,
    '--cream-50': custom('text') ? mix(c.text, 60, 'white') : null,
    '--champagne-200': custom('secondary') ? c.secondary : null,
    '--sepia-400': custom('muted') ? c.muted : null,
    '--brown-500': custom('muted') || custom('background') ? mix(c.muted, 60, c.background) : null,
    '--gold-300': custom('accent') ? c.accent : null,
    '--gold-400': custom('accent') ? mix(c.accent, 88, 'black') : null,
    '--gold-500': custom('accent') ? mix(c.accent, 75, 'black') : null
  };
  const root = document.documentElement;
  Object.entries(vars).forEach(([name, value]) => {
    if (value) root.style.setProperty(name, value);
    else root.style.removeProperty(name);
  });
  root.dataset.motion = options.motion ? 'on' : 'off';
};

/** The moment the event begins: the event date plus the start of the time range (Malaysia time). */
export const eventStart = (config: WeddingConfig) => {
  const { date, timeRange } = config.event;
  const m = startTime(timeRange || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m && /^\d{4}-\d{2}-\d{2}/.test(String(date))) {
    let h = parseInt(m[1]) % 12;
    if (m[3].toUpperCase() === 'PM') h += 12;
    const t = new Date(`${String(date).slice(0, 10)}T${String(h).padStart(2, '0')}:${m[2]}:00+08:00`).getTime();
    if (!isNaN(t)) return t;
  }
  return new Date(date).getTime();
};

const initialsOf = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');

export const coupleInitials = (config: WeddingConfig): [string, string] => [
  initialsOf(config.couple.groom.fullName),
  initialsOf(config.couple.bride.fullName)
];

/** "10:00 AM - 10:00 PM" -> "10:00 AM" */
export const startTime = (timeRange: string) => timeRange.split(/\s*[-–—]\s*/)[0];

// Shared type styles
export const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-label)',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '.2em'
};

export const SECTION_PAD = 'clamp(96px,12vw,128px) var(--page-gutter)';
// Phones: tighter, and tied to the screen height so a section can fit in one screen
export const SECTION_PAD_MOBILE = 'clamp(36px,6svh,64px) var(--page-gutter)';
export const sectionPad = (narrow: boolean) => (narrow ? SECTION_PAD_MOBILE : SECTION_PAD);
