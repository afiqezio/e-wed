
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
  subscribeConfig: (callback: (config: WeddingConfig) => void, onError?: (error: unknown) => void) => {
    const settingsRef = ref(db, PATHS.SETTINGS);

    return onValue(settingsRef, async (snapshot) => {
      try {
        if (!snapshot.exists()) {
          // A brand-new database: the template is the real content until the admin edits it
          console.log("Database empty. Performing full initial seed...");
          set(settingsRef, FALLBACK_CONFIG).catch(err => console.error("Initial seed failed:", err));
          callback(FALLBACK_CONFIG as unknown as WeddingConfig);
          return;
        }

        const val = snapshot.val();

        // Deep merge logic to ensure missing subfields in DB are filled by fallback,
        // but existing DB fields are preserved and prioritized.
        const mergedConfig = {
          ...FALLBACK_CONFIG,
          ...val,
          couple: {
            groom: { ...FALLBACK_CONFIG.couple.groom, ...(val.couple?.groom || {}) },
            bride: { ...FALLBACK_CONFIG.couple.bride, ...(val.couple?.bride || {}) }
          },
          event: {
            ...FALLBACK_CONFIG.event,
            ...(val.event || {}),
            location: { ...FALLBACK_CONFIG.event.location, ...(val.event?.location || {}) }
          },
          registry: { ...FALLBACK_CONFIG.registry, ...(val.registry || {}) },
          music: { ...FALLBACK_CONFIG.music, ...(val.music || {}) },
          theme: {
            colors: { ...FALLBACK_CONFIG.theme.colors, ...(val.theme?.colors || {}) },
            fonts: { ...FALLBACK_CONFIG.theme.fonts, ...(val.theme?.fonts || {}) }
          },
          invitation: {
            photos: { ...FALLBACK_CONFIG.invitation.photos, ...(val.invitation?.photos || {}) },
            text: { ...FALLBACK_CONFIG.invitation.text, ...(val.invitation?.text || {}) },
            colors: { ...FALLBACK_CONFIG.invitation.colors, ...(val.invitation?.colors || {}) },
            options: { ...FALLBACK_CONFIG.invitation.options, ...(val.invitation?.options || {}) },
            i18n: val.invitation?.i18n || {}
          },
          contacts: val.contacts && val.contacts.length > 0 ? val.contacts : FALLBACK_CONFIG.contacts,
          schedule: val.schedule && val.schedule.length > 0 ? val.schedule : FALLBACK_CONFIG.schedule,
        } as WeddingConfig;

        callback(mergedConfig);

        // Seed fields added in newer code. This runs after the page has its data,
        // and a failed write (e.g. a read-only visitor) must not affect what they see.
        const gaps = getMissingGaps(val, FALLBACK_CONFIG);
        if (Object.keys(gaps).length > 0) {
          console.log("Seeding missing fields to database:", Object.keys(gaps));
          update(settingsRef, gaps).catch(err => console.error("Seeding failed:", err));
        }
      } catch (err) {
        console.error("Storage Error:", err);
        onError?.(err);
      }
    }, (err) => {
      console.error("Storage Error:", err);
      onError?.(err);
    });
  },

  updateConfig: async (config: WeddingConfig) => {
    try {
      const settingsRef = ref(db, PATHS.SETTINGS);
      // The database rejects `undefined`; a JSON round-trip drops any unset optional field
      return await set(settingsRef, JSON.parse(JSON.stringify(config)));
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
