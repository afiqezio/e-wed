
export interface RSVPData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'attending' | 'not_attending';
  guests: number;
  message?: string;
  timestamp: number;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

export interface Gift {
  id: string;
  name: string;
  reserved: boolean;
  buyLink?: string;
}

export interface EventSchedule {
  time: string;
  title: string;
  description: string;
  /** Translations of the wording, keyed by language code (the fields above are the base language) */
  i18n?: Record<string, { title?: string; description?: string }>;
}

export interface ContactPerson {
  name: string;
  phone: string;
  label: string;
  side: 'groom' | 'bride';
  link: string;
}

/** Everything about the invitation's look and wording that the admin panel can change. */
export interface InvitationSettings {
  photos: {
    hero: string;     // welcome screen, hero and RSVP
    couple: string;   // Mempelai
    flowers: string;  // quote interlude and Aturcara
    closing: string;  // closing section
  };
  text: {
    eventLabel: string;
    heroMessage: string;
    coupleTitle: string;
    coupleSubtitle: string;
    quote: string;
    quoteSource: string;
    timeNote: string;
    sessionDay: string;
    sessionEvening: string;
    registryNote: string;
    rsvpMessage: string;
    closingQuote: string;
    closingSource: string;
  };
  colors: {
    background: string;
    deep: string;
    text: string;
    secondary: string;
    muted: string;
    accent: string;
  };
  options: {
    showWelcome: boolean;
    motion: boolean;
    showCountdown: boolean;
    showRegistry: boolean;
    showGuestbook: boolean;
    /** Language the invitation is shown in (a code from i18n/config.ts) */
    language: string;
  };
  /** The editable text in other languages, keyed by language code. `text` above is the base language. */
  i18n?: Record<string, { text?: Partial<InvitationSettings['text']> }>;
}

export interface WeddingConfig {
  couple: {
    groom: {
      name: string;
      shortName: string;
      fullName: string;
      imageUrl: string;
      parents: { father: string; mother: string };
      contact: { phone: string; link: string };
    };
    bride: {
      name: string;
      shortName: string;
      fullName: string;
      imageUrl: string;
      parents: { father: string; mother: string };
      contact: { phone: string; link: string };
    };
  };
  event: {
    date: string; // Store as ISO string
    fullDateDisplay: string;
    shortDateDisplay: string;
    day: string;
    timeRange: string;
    venueName: string;
    venueCity: string;
    venueState: string;
    rsvpDeadline: string;
    location: {
      googleMaps: string;
      waze: string;
      embedUrl: string;
    };
  };
  contacts: ContactPerson[];
  registry: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  schedule: EventSchedule[];
  invitation: InvitationSettings;
  // Legacy palette: now only tints the admin panel
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      muted: string;
    };
    fonts: {
      display: string;
      body: string;
      serif: string;
    };
  };
  music: {
    url: string;
    volume: number;
    credit?: string; // e.g. "Canon in D — Kevin MacLeod (CC BY 3.0)", shown in the footer
  };
}
