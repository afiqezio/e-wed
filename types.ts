
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
