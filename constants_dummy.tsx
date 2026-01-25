
import { Gift, EventSchedule, ContactPerson } from './types';

// These are explicit dummy data placeholders to show the user it's a template
export const FALLBACK_CONFIG = {
  couple: {
    groom: {
      name: 'NAMA PENGANTIN LELAKI',
      shortName: 'Groom',
      fullName: 'Nama Penuh Pengantin Lelaki bin Ayah',
      imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
      parents: {
        father: 'Nama Ayah Lelaki',
        mother: 'Nama Ibu Lelaki'
      },
      contact: {
        phone: '+60 12-000 0000',
        link: 'tel:+60120000000'
      }
    },
    bride: {
      name: 'NAMA PENGANTIN PEREMPUAN',
      shortName: 'Bride',
      fullName: 'Nama Penuh Pengantin Perempuan binti Ayah',
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      parents: {
        father: 'Nama Ayah Perempuan',
        mother: 'Nama Ibu Perempuan'
      },
      contact: {
        phone: '+60 12-000 0000',
        link: 'tel:+60120000000'
      }
    }
  },
  event: {
    date: '2029-01-01T10:00:00Z',
    fullDateDisplay: '1 Januari 2029',
    shortDateDisplay: '01 • 01 • 2029',
    day: 'Isnin',
    timeRange: '11:00 AM - 4:00 PM',
    venueName: 'NAMA LOKASI MAJLIS ANDA',
    rsvpDeadline: '2028-12-01T23:59:59Z',
    location: {
      googleMaps: 'https://maps.google.com',
      waze: 'https://waze.com',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.684!2d101.520!3d3.693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDEnMzYuNCJOIDEwMcKwMzEnMTQuMCJF!5e0!3m2!1sen!2smy!4v1620000000000!5m2!1sen!2smy'
    }
  },
  contacts: [
    {
      name: 'NAMA WAKIL 1',
      phone: '+60 12-000 0000',
      label: 'Hubungan',
      side: 'groom',
      link: 'tel:+60120000000'
    },
    {
      name: 'NAMA WAKIL 2',
      phone: '+60 12-000 0000',
      label: 'Hubungan',
      side: 'bride',
      link: 'tel:+60120000000'
    }
  ] as ContactPerson[],
  registry: {
    bankName: 'NAMA BANK (MAYBANK/CIMB)',
    accountNumber: '0000 0000 0000',
    accountHolder: 'NAMA PEMEGANG AKAUN',
  },
  schedule: [
    { time: '11:00 AM', title: 'Aturcara 1', description: 'Penerangan ringkas majlis anda.' },
    { time: '1:00 PM', title: 'Aturcara 2', description: 'Penerangan ringkas majlis anda.' },
  ],
  theme: {
    colors: {
      primary: '#A64B6D',
      secondary: '#A1B39D',
      accent: '#D4AF37',
      background: '#FCFAF7',
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

export const INITIAL_GIFTS: Gift[] = [
  { id: '1', name: 'Contoh Hadiah 1', reserved: false, buyLink: '#' },
  { id: '2', name: 'Contoh Hadiah 2', reserved: false, buyLink: '#' },
];
