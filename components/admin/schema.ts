
// The admin panel is generated from this file.
// To expose a new setting: add it to types.ts and constants_dummy.tsx, add its label to
// i18n/admin/ms.ts and en.ts, then add one field line here.
import { Gift, InvitationSettings, WeddingConfig } from '../../types';
import { DESIGN_MUSIC, INVITATION_DEFAULTS } from '../helpers';
import { LANGUAGES, LANG_CODES } from '../../i18n/config';
import { AdminMessages } from '../../i18n/admin';

/** What the panel edits: the site config plus the gift list (stored separately). */
export type Draft = WeddingConfig & { gifts: Gift[] };

export type FieldType = 'text' | 'textarea' | 'url' | 'image' | 'color' | 'toggle' | 'range' | 'select' | 'time';

export interface FieldDef {
  /** Dot path into the draft (for a list column: the key within each item) */
  path: string;
  label: string;
  type?: FieldType;
  hint?: string;
  placeholder?: string;
  /** Columns taken in the section grid (or out of 12 inside a list row) */
  span?: number;
  options?: { value: string; label: string }[];
  /**
   * Wording that exists once per language. When the invitation language is not the base one,
   * the panel points this field at that language's copy instead (see AdminPanel.fieldFor).
   */
  translatable?: boolean;
}

export interface ListDef {
  path: string;
  columns: FieldDef[];
  addLabel: string;
  emptyText: string;
  reorder?: boolean;
  newItem: () => Record<string, any>;
  /** Keeps derived values in step after an edit (e.g. the tel: link of a phone number) */
  derive?: (item: any) => any;
}

export interface PresetDef {
  path: string;
  items: { name: string; value: Record<string, string> }[];
}

export interface ActionDef {
  label: string;
  run: (draft: Draft) => Draft;
}

export interface SectionDef {
  /** Stable key (titles change with the panel language) */
  id: string;
  title: string;
  description?: string;
  columns?: 1 | 2 | 3;
  fields?: FieldDef[];
  list?: ListDef;
  presets?: PresetDef;
  actions?: ActionDef[];
  /** A bespoke block rendered by AdminPanel (see CUSTOM_BLOCKS there) */
  custom?: 'eventDate' | 'palettePreview' | 'musicTest' | 'backup';
}

export interface TabDef {
  id: string;
  group: string;
  label: string;
  description: string;
  /** Section of the invitation the live preview scrolls to */
  preview: string;
  sections: SectionDef[];
}

const mapQuery = (draft: Draft) => encodeURIComponent([draft.event.venueName, draft.event.venueCity].filter(Boolean).join(' '));

/** Builds the panel's tabs in the given panel language. */
export const buildTabs = (a: AdminMessages): TabDef[] => {
  const person = (side: 'groom' | 'bride'): FieldDef[] => [
    { path: `couple.${side}.fullName`, label: a.basic.fullName, hint: a.basic.fullNameHint },
    { path: `couple.${side}.shortName`, label: a.basic.shortName, hint: a.basic.shortNameHint },
    { path: `couple.${side}.parents.father`, label: a.basic.father },
    { path: `couple.${side}.parents.mother`, label: a.basic.mother },
  ];

  const text = (key: keyof InvitationSettings['text'], label: string, long = false, hint?: string): FieldDef => ({
    path: `invitation.text.${key}`, label, hint, type: long ? 'textarea' : 'text', translatable: true
  });

  return [
    {
      id: 'basic', group: a.groups.content, label: a.basic.label, preview: 'couple',
      description: a.basic.description,
      sections: [
        { id: 'groom', title: a.basic.groom, fields: person('groom') },
        { id: 'bride', title: a.basic.bride, fields: person('bride') },
      ]
    },
    {
      id: 'event', group: a.groups.content, label: a.event.label, preview: 'timeline',
      description: a.event.description,
      sections: [
        { id: 'date', title: a.event.dateSection, custom: 'eventDate' },
        {
          id: 'venue', title: a.event.venueSection, columns: 2,
          fields: [
            { path: 'event.venueName', label: a.event.venueName, span: 2 },
            { path: 'event.venueCity', label: a.event.city, hint: a.event.cityHint },
            { path: 'event.venueState', label: a.event.state },
          ]
        },
        {
          id: 'map', title: a.event.mapSection,
          description: a.event.mapDescription,
          actions: [{
            label: a.event.mapGenerate,
            run: draft => ({
              ...draft,
              event: {
                ...draft.event,
                location: {
                  googleMaps: `https://www.google.com/maps/search/?api=1&query=${mapQuery(draft)}`,
                  waze: `https://waze.com/ul?q=${mapQuery(draft)}&navigate=yes`,
                  embedUrl: `https://maps.google.com/maps?q=${mapQuery(draft)}&output=embed`
                }
              }
            })
          }],
          fields: [
            { path: 'event.location.googleMaps', label: a.event.googleMaps, type: 'url', placeholder: 'https://maps.app.goo.gl/...' },
            { path: 'event.location.waze', label: a.event.waze, type: 'url', placeholder: 'https://waze.com/ul?...' },
            { path: 'event.location.embedUrl', label: a.event.embed, type: 'url', placeholder: 'https://www.google.com/maps/embed?pb=...', hint: a.event.embedHint },
          ]
        },
      ]
    },
    {
      id: 'schedule', group: a.groups.content, label: a.schedule.label, preview: 'timeline',
      description: a.schedule.description,
      sections: [{
        id: 'schedule', title: a.schedule.section,
        description: a.schedule.sectionDescription,
        list: {
          path: 'schedule', reorder: true, addLabel: a.schedule.add, emptyText: a.schedule.empty,
          newItem: () => ({ time: '12:00 PM', title: a.schedule.newTitle, description: '' }),
          columns: [
            { path: 'time', label: a.schedule.time, type: 'time', span: 3 },
            { path: 'title', label: a.schedule.title, span: 9, placeholder: a.schedule.titlePlaceholder, translatable: true },
            { path: 'description', label: a.schedule.itemDescription, span: 12, placeholder: a.schedule.itemDescriptionPlaceholder, translatable: true },
          ]
        }
      }]
    },
    {
      id: 'contacts', group: a.groups.content, label: a.contacts.label, preview: 'location',
      description: a.contacts.description,
      sections: [{
        id: 'contacts', title: a.contacts.section,
        description: a.contacts.sectionDescription,
        list: {
          path: 'contacts', addLabel: a.contacts.add, emptyText: a.contacts.empty,
          newItem: () => ({ name: '', phone: '', label: '', side: 'groom', link: '' }),
          derive: item => {
            const digits = String(item.phone || '').replace(/[^\d+]/g, '');
            return { ...item, link: digits ? `tel:${digits}` : '' };
          },
          columns: [
            { path: 'name', label: a.contacts.name, span: 4, placeholder: a.contacts.name },
            { path: 'phone', label: a.contacts.phone, span: 3, placeholder: '+60 12-345 6789' },
            { path: 'side', label: a.contacts.side, type: 'select', span: 2, options: [{ value: 'groom', label: a.contacts.groomSide }, { value: 'bride', label: a.contacts.brideSide }] },
            { path: 'label', label: a.contacts.note, span: 3, placeholder: a.contacts.notePlaceholder },
          ]
        }
      }]
    },
    {
      id: 'registry', group: a.groups.content, label: a.registry.label, preview: 'registry',
      description: a.registry.description,
      sections: [
        {
          id: 'bank', title: a.registry.bankSection, columns: 3,
          fields: [
            { path: 'registry.bankName', label: a.registry.bankName, placeholder: 'Maybank Islamic' },
            { path: 'registry.accountNumber', label: a.registry.accountNumber, placeholder: '1642 1234 5678' },
            { path: 'registry.accountHolder', label: a.registry.accountHolder },
          ]
        },
        {
          id: 'gifts', title: a.registry.giftSection,
          description: a.registry.giftDescription,
          list: {
            path: 'gifts', addLabel: a.registry.add, emptyText: a.registry.empty,
            newItem: () => ({ id: Date.now().toString(), name: '', reserved: false, buyLink: '' }),
            columns: [
              { path: 'name', label: a.registry.gift, span: 4, placeholder: a.registry.giftPlaceholder },
              { path: 'buyLink', label: a.registry.shopLink, type: 'url', span: 5, placeholder: 'https://shopee.com.my/...' },
              { path: 'reserved', label: a.registry.reserved, type: 'toggle', span: 3 },
            ]
          }
        },
      ]
    },
    {
      id: 'look', group: a.groups.design, label: a.look.label, preview: 'home',
      description: a.look.description,
      sections: [
        {
          id: 'language', title: a.look.languageSection,
          description: a.look.languageDescription,
          fields: [
            { path: 'invitation.options.language', label: a.look.language, type: 'select', options: LANG_CODES.map(code => ({ value: code, label: LANGUAGES[code].label })) },
          ]
        },
        {
          id: 'palette', title: a.look.paletteSection, columns: 2,
          description: a.look.paletteDescription,
          presets: {
            path: 'invitation.colors',
            items: [
              { name: a.look.presets.sepia, value: INVITATION_DEFAULTS.colors },
              { name: a.look.presets.emerald, value: { background: '#16211c', deep: '#101914', text: '#e6e6d6', secondary: '#cfd3c0', muted: '#8f9a88', accent: '#d2c08e' } },
              { name: a.look.presets.indigo, value: { background: '#171c28', deep: '#10141d', text: '#e6e3da', secondary: '#cfccc4', muted: '#8f93a0', accent: '#d6c39a' } },
              { name: a.look.presets.garnet, value: { background: '#26171a', deep: '#1c1012', text: '#ecdfd4', secondary: '#dccbbf', muted: '#a58e86', accent: '#d9bf9a' } },
            ]
          },
          fields: [
            { path: 'invitation.colors.background', label: a.look.background, type: 'color', hint: a.look.backgroundHint },
            { path: 'invitation.colors.deep', label: a.look.deep, type: 'color', hint: a.look.deepHint },
            { path: 'invitation.colors.text', label: a.look.text, type: 'color', hint: a.look.textHint },
            { path: 'invitation.colors.secondary', label: a.look.secondary, type: 'color', hint: a.look.secondaryHint },
            { path: 'invitation.colors.muted', label: a.look.muted, type: 'color', hint: a.look.mutedHint },
            { path: 'invitation.colors.accent', label: a.look.accent, type: 'color', hint: a.look.accentHint },
          ],
          custom: 'palettePreview'
        },
        {
          id: 'photos', title: a.look.photoSection, columns: 2,
          description: a.look.photoDescription,
          fields: [
            { path: 'invitation.photos.hero', label: a.look.photoHero, type: 'image', hint: a.look.photoHeroHint },
            { path: 'invitation.photos.couple', label: a.look.photoCouple, type: 'image', hint: a.look.photoCoupleHint },
            { path: 'invitation.photos.flowers', label: a.look.photoFlowers, type: 'image', hint: a.look.photoFlowersHint },
            { path: 'invitation.photos.closing', label: a.look.photoClosing, type: 'image', hint: a.look.photoClosingHint },
          ]
        },
        {
          id: 'options', title: a.look.optionsSection,
          fields: [
            { path: 'invitation.options.showWelcome', label: a.look.showWelcome, type: 'toggle', hint: a.look.showWelcomeHint },
            { path: 'invitation.options.motion', label: a.look.motion, type: 'toggle', hint: a.look.motionHint },
            { path: 'invitation.options.showCountdown', label: a.look.showCountdown, type: 'toggle', hint: a.look.showCountdownHint },
            { path: 'invitation.options.showRegistry', label: a.look.showRegistry, type: 'toggle', hint: a.look.showRegistryHint },
            { path: 'invitation.options.showGuestbook', label: a.look.showGuestbook, type: 'toggle', hint: a.look.showGuestbookHint },
          ]
        },
      ]
    },
    {
      id: 'text', group: a.groups.design, label: a.text.label, preview: 'home',
      description: a.text.description,
      sections: [
        { id: 'hero', title: a.text.heroSection, fields: [text('eventLabel', a.text.eventLabel), text('heroMessage', a.text.heroMessage, true)] },
        { id: 'couple', title: a.text.coupleSection, columns: 2, fields: [text('coupleTitle', a.text.coupleTitle), text('coupleSubtitle', a.text.coupleSubtitle)] },
        { id: 'quote', title: a.text.quoteSection, fields: [text('quote', a.text.quote, true, a.text.quoteHint), text('quoteSource', a.text.quoteSource)] },
        {
          id: 'timeline', title: a.text.timelineSection, columns: 3,
          fields: [
            text('timeNote', a.text.timeNote),
            text('sessionDay', a.text.sessionDay, false, a.text.sessionDayHint),
            text('sessionEvening', a.text.sessionEvening, false, a.text.sessionEveningHint),
          ]
        },
        { id: 'registry', title: a.text.registrySection, fields: [text('registryNote', a.text.registryNote, true), text('rsvpMessage', a.text.rsvpMessage, true)] },
        { id: 'closing', title: a.text.closingSection, fields: [text('closingQuote', a.text.closingQuote, true), text('closingSource', a.text.closingSource)] },
      ]
    },
    {
      id: 'music', group: a.groups.design, label: a.music.label, preview: 'home',
      description: a.music.description,
      sections: [{
        id: 'music', title: a.music.section, columns: 2,
        actions: [{
          label: a.music.useOriginal,
          run: draft => ({ ...draft, music: { ...draft.music, url: DESIGN_MUSIC.url, credit: DESIGN_MUSIC.credit } })
        }],
        fields: [
          { path: 'music.url', label: a.music.url, type: 'url', span: 2, placeholder: DESIGN_MUSIC.url, hint: a.music.urlHint },
          { path: 'music.credit', label: a.music.credit, placeholder: DESIGN_MUSIC.credit, hint: a.music.creditHint },
          { path: 'music.volume', label: a.music.volume, type: 'range' },
        ],
        custom: 'musicTest'
      }]
    },
    {
      id: 'backup', group: a.groups.advanced, label: a.backup.label, preview: 'home',
      description: a.backup.description,
      sections: [{ id: 'backup', title: a.backup.section, custom: 'backup' }]
    },
  ];
};
