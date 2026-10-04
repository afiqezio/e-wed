
// English. Typed against the base locale, so a missing or misnamed key fails the type check.
import { InvitationSettings } from '../../types';
import { Messages } from './ms';

export const en: Messages = {
  loading: {
    label: 'Loading the invitation',
    failed: 'The invitation could not be loaded. Please check your internet connection and try again.',
    retry: 'Try again'
  },
  language: {
    label: 'Language'
  },
  welcome: {
    open: 'Open invitation'
  },
  nav: {
    couple: 'The Couple',
    timeline: 'Programme',
    location: 'Venue',
    registry: 'Gifts',
    rsvp: 'RSVP',
    wishes: 'Wishes',
    openMenu: 'Open menu',
    closeMenu: 'Close menu'
  },
  hero: {
    rsvpCta: 'RSVP here',
    scroll: 'Scroll down'
  },
  couple: {
    eyebrow: 'The Couple',
    groom: 'The groom',
    bride: 'The bride',
    sonOf: 'Son of',
    daughterOf: 'Daughter of'
  },
  countdown: {
    label: 'Counting the days',
    units: ['Days', 'Hours', 'Minutes', 'Seconds']
  },
  timeline: {
    eyebrow: 'Programme',
    title: 'The Programme',
    date: 'Date',
    time: 'Time',
    venue: 'Venue'
  },
  location: {
    eyebrow: 'Venue',
    groomSide: 'Groom’s family',
    brideSide: 'Bride’s family',
    noContacts: 'Kindly contact the family for further details.',
    mapTitle: 'Map of the venue'
  },
  registry: {
    eyebrow: 'Gifts',
    title: 'A Token of Love',
    viewInShop: 'View on Shopee',
    reserved: 'Taken',
    reserve: 'Gift this',
    digital: (bank: string) => `Monetary gift · ${bank}`,
    copyAria: (account: string) => `Copy account number ${account}`,
    copied: 'Copied',
    copyHint: (holder: string) => `${holder} · Tap to copy`,
    confirmEyebrow: 'Confirm your choice',
    confirmBefore: 'Would you like to gift ',
    confirmAfter: '? It will be marked as taken so that no one else chooses it.',
    saving: 'Saving…',
    confirm: 'Yes, I confirm',
    cancel: 'Cancel'
  },
  rsvp: {
    eyebrow: 'Kindly',
    title: 'RSVP',
    cta: 'Confirm your attendance',
    responses: 'Responses',
    guests: 'Guests',
    replyBy: (date: string) => `Kindly reply by ${date}`,
    closed: 'The reply period has ended. Thank you for your prayers and kind thoughts.',
    thanksAttending: (name: string) => `Thank you, ${name}. We look forward to having you with us.`,
    thanksDeclined: (name: string) => `Thank you, ${name}. Your prayers mean a great deal to us.`,
    name: 'Full name',
    namePlaceholder: 'As written on the invitation',
    attendance: 'Attendance',
    attending: 'Joyfully accepts',
    notAttending: 'Regretfully declines',
    guestCount: 'Number of guests',
    guestOption: (count: number) => (count === 1 ? '1 guest' : `${count} guests`),
    message: 'A message for the couple',
    optional: 'Optional',
    submit: 'Send reply',
    sending: 'Sending…',
    nameRequired: 'Kindly tell us your name',
    failed: 'Sorry, your reply could not be sent. Please try again.'
  },
  wishes: {
    eyebrow: 'Wishes',
    title: 'Prayers and Wishes',
    subtitle: 'Send us your love and prayers',
    name: 'Your name',
    message: 'Your wish',
    placeholder: 'Write your wish here',
    submit: 'Send wish',
    sending: 'Sending…',
    empty: 'Be the first to send a wish.',
    required: 'Kindly fill in your name and your wish',
    failed: 'Sorry, your wish could not be sent. Please try again.',
    listLabel: 'Wishes from guests'
  },
  closing: {
    music: (credit: string) => `Music · ${credit}`
  },
  music: {
    play: 'Play music',
    pause: 'Pause music'
  },
  dialog: {
    close: 'Close'
  }
};

// Default English wording for the text the couple can edit in the admin panel.
// Used until they write their own English version there.
export const enContent: InvitationSettings['text'] = {
  eventLabel: 'Walimatul Urus',
  heroMessage: 'We warmly invite you to celebrate our union and the journey we begin together',
  coupleTitle: 'Two Hearts, One Bond',
  coupleSubtitle: 'With Allah’s will, we unite two families',
  quote: 'And among His signs is that He created for you spouses from among yourselves, that you may find tranquillity in them, and He placed between you affection and mercy.',
  quoteSource: 'Surah Ar-Rum 30:21',
  timeNote: '(Akad & Reception)',
  sessionDay: 'Akad Nikah · Morning',
  sessionEvening: 'Reception · Evening',
  registryNote: 'Your presence and prayers are more than enough. Should you wish to offer a token of love, here are a few things we would truly appreciate.',
  rsvpMessage: 'We would be so honoured to have you with us on our special day.',
  closingQuote: 'And We created you in pairs',
  closingSource: 'Qur’an 78:8'
};
