
import { 
  ref, 
  push, 
  set, 
  onValue, 
  get, 
  update, 
  serverTimestamp,
  query,
  orderByChild,
  limitToLast
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { db } from '../firebase';
import { RSVPData, Wish, Gift } from '../types';
import { INITIAL_GIFTS } from '../constants';

const PATHS = {
  RSVP: 'rsvps',
  WISHES: 'wishes',
  GIFTS: 'gifts'
};

/**
 * SCALABILITY STRATEGY:
 * Realtime Database is a JSON tree. To keep it scalable:
 * 1. Use flat paths (no deep nesting).
 * 2. Use serverTimestamp() for consistency across timezones.
 * 3. Use query() with limitToLast for the Guestbook to avoid downloading thousands of old messages.
 */

export const storage = {
  // --- RSVP ---
  saveRSVP: async (rsvp: Omit<RSVPData, 'id'>) => {
    const rsvpRef = ref(db, PATHS.RSVP);
    const newRsvpRef = push(rsvpRef);
    return await set(newRsvpRef, {
      ...rsvp,
      timestamp: serverTimestamp() // Use server clock for sorting
    });
  },

  getRSVPs: async (): Promise<RSVPData[]> => {
    try {
      const rsvpRef = ref(db, PATHS.RSVP);
      const snapshot = await get(rsvpRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        } as RSVPData)).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }
      return [];
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      return [];
    }
  },

  // --- WISHES / GUESTBOOK ---
  saveWish: async (wish: Omit<Wish, 'id'>) => {
    const wishesRef = ref(db, PATHS.WISHES);
    const newWishRef = push(wishesRef);
    return await set(newWishRef, {
      ...wish,
      timestamp: serverTimestamp()
    });
  },

  subscribeWishes: (callback: (wishes: Wish[]) => void) => {
    // Only fetch the last 100 wishes to keep the app fast and save bandwidth (Scalability!)
    const wishesRef = ref(db, PATHS.WISHES);
    const recentWishesQuery = query(wishesRef, orderByChild('timestamp'), limitToLast(100));
    
    return onValue(recentWishesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const wishes = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        } as Wish)).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        callback(wishes);
      } else {
        callback([]);
      }
    });
  },

  // --- GIFTS / REGISTRY ---
  subscribeGifts: (callback: (gifts: Gift[]) => void) => {
    const giftsRef = ref(db, PATHS.GIFTS);
    
    return onValue(giftsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        // One-time setup of the gift list if the database is fresh
        const initialGiftsData: Record<string, any> = {};
        INITIAL_GIFTS.forEach(gift => {
          initialGiftsData[gift.id] = {
            name: gift.name,
            reserved: false,
            buyLink: gift.buyLink || ''
          };
        });
        await set(giftsRef, initialGiftsData);
      } else {
        const data = snapshot.val();
        const gifts = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        } as Gift));
        // Sort by ID to keep the UI order stable
        gifts.sort((a, b) => a.id.localeCompare(b.id));
        callback(gifts);
      }
    });
  },

  reserveGift: async (id: string) => {
    const giftRef = ref(db, `${PATHS.GIFTS}/${id}`);
    // Atomic update to mark as reserved
    return await update(giftRef, { 
      reserved: true,
      reservedAt: serverTimestamp()
    });
  }
};
