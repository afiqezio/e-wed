
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
}

export interface ContactPerson {
  name: string;
  phone: string;
  label: string;
  side: 'groom' | 'bride';
  link: string;
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
  };
}
