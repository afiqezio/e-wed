
import { RSVPData, Wish, Gift } from '../types';
import { INITIAL_GIFTS } from '../constants';

const KEYS = {
  RSVP: 'wedding_rsvp',
  WISHES: 'wedding_wishes',
  GIFTS: 'wedding_gifts'
};

export const storage = {
  getRSVPs: (): RSVPData[] => {
    const data = localStorage.getItem(KEYS.RSVP);
    return data ? JSON.parse(data) : [];
  },
  saveRSVP: (rsvp: RSVPData) => {
    const current = storage.getRSVPs();
    localStorage.setItem(KEYS.RSVP, JSON.stringify([...current, rsvp]));
  },
  getWishes: (): Wish[] => {
    const data = localStorage.getItem(KEYS.WISHES);
    return data ? JSON.parse(data) : [];
  },
  saveWish: (wish: Wish) => {
    const current = storage.getWishes();
    localStorage.setItem(KEYS.WISHES, JSON.stringify([wish, ...current]));
  },
  getGifts: (): Gift[] => {
    const data = localStorage.getItem(KEYS.GIFTS);
    return data ? JSON.parse(data) : INITIAL_GIFTS;
  },
  reserveGift: (id: string) => {
    const gifts = storage.getGifts();
    const updated = gifts.map(g => g.id === id ? { ...g, reserved: true } : g);
    localStorage.setItem(KEYS.GIFTS, JSON.stringify(updated));
    return updated;
  }
};
