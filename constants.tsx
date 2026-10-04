
import { Gift, EventSchedule } from './types';

export const WEDDING_CONFIG = {
  couple: {
    groom: {
      name: 'AFIQ NURHARIZ',
      shortName: 'Afiq',
      fullName: 'Afiq Nurhariz',
      parents: {
        father: 'Encik Nurhariz bin Hassan',
        mother: 'Puan Aishah binti Ahmad'
      },
      contact: {
        phone: '+60 12-345 6789',
        link: 'tel:+60123456789'
      }
    },
    bride: {
      name: 'NURUL HUDA',
      shortName: 'Huda',
      fullName: 'Nurul Huda',
      parents: {
        father: 'Encik Mohd Hadi bin Ismail',
        mother: 'Puan Siti Maryam binti Rahman'
      },
      contact: {
        phone: '+60 12-987 6543',
        link: 'tel:+60129876543'
      }
    }
  },
  event: {
    date: new Date('2028-04-22T10:00:00+08:00'),
    fullDateDisplay: '22 April 2028',
    shortDateDisplay: '22 • 04 • 2028',
    day: 'Sabtu',
    timeRange: '10:00 AM - 10:00 PM',
    venueName: 'Rumah Abang Jamil',
    venueCity: 'Kota Bharu',
    venueState: 'Kelantan',
    rsvpDeadline: new Date('2028-04-10T23:59:59+08:00'),
    location: {
      googleMaps: 'https://www.google.com/maps/search/?api=1&query=Rumah%20Abang%20Jamil%20Kota%20Bharu',
      waze: 'https://waze.com/ul?q=Rumah%20Abang%20Jamil%20Kota%20Bharu&navigate=yes',
      embedUrl: 'https://maps.google.com/maps?q=Rumah%20Abang%20Jamil%20Kota%20Bharu&output=embed'
    }
  },
  registry: {
    bankName: 'MAYBANK ISLAMIC',
    accountNumber: '1642 1234 5678',
    accountHolder: 'Afiq Nurhariz bin Nurhariz',
    gifts: [
      { id: '1', name: 'Peralatan Dapur Set', reserved: false, buyLink: 'https://shopee.com.my/search?keyword=kitchenware%20set' },
      { id: '2', name: 'Tempat Tidur Queen', reserved: false, buyLink: 'https://shopee.com.my/search?keyword=queen%20bed' },
      { id: '3', name: 'Periuk Nasi Premium', reserved: false, buyLink: 'https://shopee.com.my/search?keyword=rice%20cooker%20premium' },
      { id: '4', name: 'Set Pinggan Mangkuk', reserved: false, buyLink: 'https://shopee.com.my/search?keyword=dinnerware%20set' },
      { id: '5', name: 'Vacuum Cleaner', reserved: false, buyLink: 'https://shopee.com.my/search?keyword=vacuum%20cleaner' },
      { id: '6', name: 'Air Fryer', reserved: false, buyLink: 'https://shopee.com.my/search?keyword=air%20fryer' },
    ] as Gift[]
  },
  schedule: [
    { time: '10:00 AM', title: 'Majlis Akad Nikah', description: 'Upacara penyatuan yang suci.' },
    { time: '12:00 PM', title: 'Sesi Fotografi', description: 'Merakam kenangan manis bersama keluarga.' },
    { time: '07:00 PM', title: 'Ketibaan Tetamu', description: 'Selamat datang ke dewan persandingan.' },
    { time: '07:30 PM', title: 'Ketibaan Pengantin', description: 'Perarakan masuk mempelai ke pelaminan.' },
    { time: '08:00 PM', title: 'Majlis Jamuan', description: 'Menikmati hidangan bersama para tetamu.' },
    { time: '09:30 PM', title: 'Majlis Berakhir', description: 'Terima kasih atas kehadiran dan doa restu.' },
  ] as EventSchedule[],
  theme: {
    colors: {
      primary: '#A64B6D',    // Rosewood
      secondary: '#A1B39D',  // Dusty Sage
      accent: '#D4AF37',     // Gold Touch
      background: '#FCFAF7', // Silk Ivory
      text: '#2D2D2D',
      muted: '#777777'
    },
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Montserrat', sans-serif",
      serif: "'Cormorant Garamond', serif"
    }
  },
  music: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kevin_MacLeod_-_Canon_in_D_Major.ogg',
    volume: 0.45,
    credit: 'Canon in D — Kevin MacLeod (CC BY 3.0)'
  }
};

// Simplified exports
export const SCHEDULE = WEDDING_CONFIG.schedule;
export const INITIAL_GIFTS = WEDDING_CONFIG.registry.gifts;
export const RSVP_DEADLINE = WEDDING_CONFIG.event.rsvpDeadline;
