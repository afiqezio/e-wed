
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
import { FALLBACK_CONFIG, INITIAL_GIFTS } from '../constants_dummy';

const PATHS = {
  SETTINGS: 'settings',
  RSVP: 'rsvps',
  WISHES: 'wishes',
  GIFTS: 'gifts'
};

/**
 * Utility to identify paths that exist in fallback but are missing in DB value.
 * This allows us to "seed" new fields without wiping user data.
 */
const getMissingGaps = (dbVal: any, fallback: any) => {
  const updates: any = {};
  if (!dbVal) return fallback;

  Object.keys(fallback).forEach(key => {
    const val = dbVal[key];
    const fallbackVal = fallback[key];

    // If key is totally missing or null
    if (val === undefined || val === null) {
      updates[key] = fallbackVal;
    } 
    // If it's an object (and not an array), check one level deeper (for couple/event/theme)
    else if (typeof fallbackVal === 'object' && !Array.isArray(fallbackVal) && fallbackVal !== null) {
      Object.keys(fallbackVal).forEach(subKey => {
        if (val[subKey] === undefined || val[subKey] === null) {
          updates[`${key}/${subKey}`] = fallbackVal[subKey];
        }
      });
    }
  });
  return updates;
};

export const storage = {
  // --- SETTINGS (The whole site config) ---
  subscribeConfig: (callback: (config: WeddingConfig) => void) => {
    const settingsRef = ref(db, PATHS.SETTINGS);

    // Remove the timeout fallback. App.tsx already starts with FALLBACK_CONFIG.
    // We only want to trigger the callback when we have REAL data or after the DB check completes.
    return onValue(settingsRef, async (snapshot) => {
      try {
        if (!snapshot.exists()) {
          console.log("Database empty. Performing full initial seed...");
          await set(settingsRef, FALLBACK_CONFIG);
          callback(FALLBACK_CONFIG as unknown as WeddingConfig);
        } else {
          const val = snapshot.val();
          
          // Identify gaps in the DB compared to our latest code constants
          const gaps = getMissingGaps(val, FALLBACK_CONFIG);
          
          if (Object.keys(gaps).length > 0) {
            console.log("Seeding missing fields to database:", Object.keys(gaps));
            await update(settingsRef, gaps);
          }

          // Deep merge logic to ensure missing subfields in DB are filled by fallback,
          // but existing DB fields are preserved and prioritized.
          const mergedConfig = {
            ...FALLBACK_CONFIG,
            ...val,
            couple: {
              groom: { ...FALLBACK_CONFIG.couple.groom, ...(val.couple?.groom || {}) },
              bride: { ...FALLBACK_CONFIG.couple.bride, ...(val.couple?.bride || {}) }
            },
            event: { ...FALLBACK_CONFIG.event, ...(val.event || {}) },
            theme: { 
              colors: { ...FALLBACK_CONFIG.theme.colors, ...(val.theme?.colors || {}) },
              fonts: { ...FALLBACK_CONFIG.theme.fonts, ...(val.theme?.fonts || {}) }
            },
            contacts: val.contacts && val.contacts.length > 0 ? val.contacts : FALLBACK_CONFIG.contacts,
            schedule: val.schedule && val.schedule.length > 0 ? val.schedule : FALLBACK_CONFIG.schedule,
          } as WeddingConfig;

          callback(mergedConfig);
        }
      } catch (err) {
        console.error("Storage Error:", err);
        // Fallback to constants only on hard error
        callback(FALLBACK_CONFIG as unknown as WeddingConfig);
      }
    });
  },

  updateConfig: async (config: WeddingConfig) => {
    try {
      const settingsRef = ref(db, PATHS.SETTINGS);
      return await set(settingsRef, config);
    } catch (e) {
      console.error("Failed to update config:", e);
      throw e;
    }
  },

  // --- RSVP ---
  saveRSVP: async (rsvp: Omit<RSVPData, 'id'>) => {
    const rsvpRef = ref(db, PATHS.RSVP);
    const newRsvpRef = push(rsvpRef);
    return await set(newRsvpRef, { ...rsvp, timestamp: serverTimestamp() });
  },

  getRSVPs: async (): Promise<RSVPData[]> => {
    const rsvpRef = ref(db, PATHS.RSVP);
    const snapshot = await get(rsvpRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] } as RSVPData))
        .sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
    }
    return [];
  },

  // --- WISHES ---
  saveWish: async (wish: Omit<Wish, 'id'>) => {
    const wishesRef = ref(db, PATHS.WISHES);
    const newWishRef = push(wishesRef);
    return await set(newWishRef, { ...wish, timestamp: serverTimestamp() });
  },

  subscribeWishes: (callback: (wishes: Wish[]) => void) => {
    const wishesRef = ref(db, PATHS.WISHES);
    const recentWishesQuery = query(wishesRef, orderByChild('timestamp'), limitToLast(50));
    return onValue(recentWishesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const wishes = Object.keys(data).map(key => ({ id: key, ...data[key] } as Wish))
          .sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
        callback(wishes);
      } else {
        callback([]);
      }
    });
  },

  // --- GIFTS ---
  subscribeGifts: (callback: (gifts: Gift[]) => void) => {
    const giftsRef = ref(db, PATHS.GIFTS);
    return onValue(giftsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        const initialGiftsData: Record<string, any> = {};
        INITIAL_GIFTS.forEach(gift => {
          initialGiftsData[gift.id] = { name: gift.name, reserved: false, buyLink: gift.buyLink || '' };
        });
        await set(giftsRef, initialGiftsData);
        callback(INITIAL_GIFTS);
      } else {
        const data = snapshot.val();
        const gifts = Object.keys(data).map(key => ({ id: key, ...data[key] } as Gift));
        gifts.sort((a, b) => a.id.localeCompare(b.id));
        callback(gifts);
      }
    });
  },

  updateGifts: async (gifts: Gift[]) => {
    const giftsRef = ref(db, PATHS.GIFTS);
    const giftsData: Record<string, any> = {};
    gifts.forEach(gift => {
      giftsData[gift.id] = { name: gift.name, reserved: gift.reserved, buyLink: gift.buyLink || '' };
    });
    return await set(giftsRef, giftsData);
  },

  reserveGift: async (id: string) => {
    const giftRef = ref(db, `${PATHS.GIFTS}/${id}`);
    return await update(giftRef, { reserved: true, reservedAt: serverTimestamp() });
  }
};
