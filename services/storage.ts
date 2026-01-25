
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
import { RSVPData, Wish, Gift, WeddingConfig } from '../types';
import { FALLBACK_CONFIG, INITIAL_GIFTS } from '../constants';

const PATHS = {
  SETTINGS: 'settings',
  RSVP: 'rsvps',
  WISHES: 'wishes',
  GIFTS: 'gifts'
};

export const storage = {
  // --- SETTINGS (The whole site config) ---
  subscribeConfig: (callback: (config: WeddingConfig) => void) => {
    const settingsRef = ref(db, PATHS.SETTINGS);
    let fired = false;

    // Safety timeout: If Firebase doesn't respond in 2 seconds, use fallback
    const timeout = setTimeout(() => {
      if (!fired) {
        console.warn("Firebase took too long. Using fallback data.");
        callback(FALLBACK_CONFIG as unknown as WeddingConfig);
        fired = true;
      }
    }, 2000);
    
    return onValue(settingsRef, async (snapshot) => {
      clearTimeout(timeout);
      try {
        if (!snapshot.exists()) {
          console.log("Database empty. Seeding with dummy fallback data...");
          await set(settingsRef, FALLBACK_CONFIG);
          if (!fired) {
            callback(FALLBACK_CONFIG as unknown as WeddingConfig);
            fired = true;
          }
        } else {
          if (!fired || snapshot.val()) {
            callback(snapshot.val() as WeddingConfig);
            fired = true;
          }
        }
      } catch (err) {
        console.error("Storage error in subscribeConfig:", err);
        if (!fired) {
          callback(FALLBACK_CONFIG as unknown as WeddingConfig);
          fired = true;
        }
      }
    }, (error) => {
      clearTimeout(timeout);
      console.error("Firebase permission/network error:", error);
      if (!fired) {
        callback(FALLBACK_CONFIG as unknown as WeddingConfig);
        fired = true;
      }
    });
  },

  // --- RSVP ---
  saveRSVP: async (rsvp: Omit<RSVPData, 'id'>) => {
    try {
      const rsvpRef = ref(db, PATHS.RSVP);
      const newRsvpRef = push(rsvpRef);
      return await set(newRsvpRef, {
        ...rsvp,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Failed to save RSVP:", e);
      throw e;
    }
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
        } as RSVPData)).sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  // --- WISHES ---
  saveWish: async (wish: Omit<Wish, 'id'>) => {
    try {
      const wishesRef = ref(db, PATHS.WISHES);
      const newWishRef = push(wishesRef);
      return await set(newWishRef, {
        ...wish,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Failed to save wish:", e);
    }
  },

  subscribeWishes: (callback: (wishes: Wish[]) => void) => {
    const wishesRef = ref(db, PATHS.WISHES);
    const recentWishesQuery = query(wishesRef, orderByChild('timestamp'), limitToLast(50));
    
    return onValue(recentWishesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const wishes = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        } as Wish)).sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
        callback(wishes);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error("Wishes subscription error:", error);
      callback([]);
    });
  },

  // --- GIFTS ---
  subscribeGifts: (callback: (gifts: Gift[]) => void) => {
    const giftsRef = ref(db, PATHS.GIFTS);
    return onValue(giftsRef, async (snapshot) => {
      try {
        if (!snapshot.exists()) {
          const initialGiftsData: Record<string, any> = {};
          INITIAL_GIFTS.forEach(gift => {
            initialGiftsData[gift.id] = {
              name: gift.name,
              reserved: false,
              buyLink: gift.buyLink || ''
            };
          });
          await set(giftsRef, initialGiftsData);
          callback(INITIAL_GIFTS);
        } else {
          const data = snapshot.val();
          const gifts = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          } as Gift));
          gifts.sort((a, b) => a.id.localeCompare(b.id));
          callback(gifts);
        }
      } catch (e) {
        console.error("Gifts subscription error:", e);
        callback(INITIAL_GIFTS);
      }
    }, (error) => {
      callback(INITIAL_GIFTS);
    });
  },

  reserveGift: async (id: string) => {
    const giftRef = ref(db, `${PATHS.GIFTS}/${id}`);
    return await update(giftRef, { 
      reserved: true,
      reservedAt: serverTimestamp()
    });
  }
};
