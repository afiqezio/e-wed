
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
    date: new Date('2028-02-20T10:00:00'),
    fullDateDisplay: '20 February 2028',
    shortDateDisplay: '20 • 02 • 2028',
    day: 'Thursday',
    timeRange: '10:00 AM - 10:00 PM',
    venueName: 'Dewan Serbaguna',
    rsvpDeadline: new Date('2028-02-10T23:59:59'),
    location: {
      googleMaps: 'https://share.google/gBeYPTauLpFdon0E5',
      waze: 'https://ul.waze.com/ul?place=ChIJM5Us5N2HyzERChOfRMQCI_s&ll=3.69345430%2C101.52215270&navigate=yes',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.684128522676!2d101.52055!3d3.6934543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d10e8e0409%3A0xc3f8e58129e9d6d0!2sDewan%20Serbaguna!5e0!3m2!1sen!2smy!4v1620000000000!5m2!1sen!2smy'
    }
  },
  registry: {
    bankName: 'MAYBANK ISLAMIC',
    accountNumber: '1642 1234 5678',
    accountHolder: 'Afiq Nurhariz bin Nurhariz',
    gifts: [
      { id: '1', name: 'Peralatan Dapur Set', reserved: false, image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=600', buyLink: 'https://shopee.com.my/search?keyword=kitchenware%20set' },
      { id: '2', name: 'Tempat Tidur Queen', reserved: false, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600', buyLink: 'https://shopee.com.my/search?keyword=queen%20bed' },
      { id: '3', name: 'Periuk Nasi Premium', reserved: false, image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27bd8b?auto=format&fit=crop&q=80&w=600', buyLink: 'https://shopee.com.my/search?keyword=rice%20cooker%20premium' },
      { id: '4', name: 'Set Pinggan Mangkuk', reserved: false, image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&q=80&w=600', buyLink: 'https://shopee.com.my/search?keyword=dinnerware%20set' },
      { id: '5', name: 'Vacuum Cleaner', reserved: false, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=600', buyLink: 'https://shopee.com.my/search?keyword=vacuum%20cleaner' },
      { id: '6', name: 'Air Fryer', reserved: false, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=600', buyLink: 'https://shopee.com.my/search?keyword=air%20fryer' },
    ] as Gift[]
  },
  schedule: [
    { time: '10:00 AM', title: 'Majlis Akad Nikah', description: 'Upacara penyatuan yang suci.' },
    { time: '12:00 PM', title: 'Sesi Fotografi', description: 'Sesi merakam kenangan manis bersama keluarga.' },
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
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
    volume: 0.4
  }
};

// Simplified exports
export const SCHEDULE = WEDDING_CONFIG.schedule;
export const INITIAL_GIFTS = WEDDING_CONFIG.registry.gifts;
export const RSVP_DEADLINE = WEDDING_CONFIG.event.rsvpDeadline;
