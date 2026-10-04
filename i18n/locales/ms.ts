
// Bahasa Melayu — the base language. Its shape is the contract every other locale must satisfy.
// Wording the couple can edit (hero line, quotes, session headings…) is not here: it lives in the
// site config (invitation.text) and is managed from the admin panel.
export const ms = {
  loading: {
    label: 'Memuatkan undangan',
    failed: 'Undangan tidak dapat dimuatkan. Sila semak sambungan internet anda dan cuba sekali lagi.',
    retry: 'Cuba lagi'
  },
  language: {
    label: 'Bahasa'
  },
  welcome: {
    open: 'Buka undangan'
  },
  nav: {
    couple: 'Mempelai',
    timeline: 'Aturcara',
    location: 'Lokasi',
    registry: 'Tanda Kasih',
    rsvp: 'RSVP',
    wishes: 'Ucapan',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu'
  },
  hero: {
    rsvpCta: 'RSVP di sini',
    scroll: 'Tatal ke bawah'
  },
  couple: {
    eyebrow: 'Mempelai',
    groom: 'Pengantin lelaki',
    bride: 'Pengantin perempuan',
    sonOf: 'Putera kepada',
    daughterOf: 'Puteri kepada'
  },
  countdown: {
    label: 'Menghitung hari',
    units: ['Hari', 'Jam', 'Minit', 'Saat']
  },
  timeline: {
    eyebrow: 'Aturcara',
    title: 'Aturcara Majlis',
    date: 'Tarikh',
    time: 'Masa',
    venue: 'Tempat'
  },
  location: {
    eyebrow: 'Lokasi',
    groomSide: 'Pihak lelaki',
    brideSide: 'Pihak perempuan',
    noContacts: 'Sila hubungi pihak keluarga untuk maklumat lanjut.',
    mapTitle: 'Lokasi majlis'
  },
  registry: {
    eyebrow: 'Tanda Kasih',
    title: 'Tanda Kasih',
    viewInShop: 'Lihat di Shopee',
    reserved: 'Dihadiahkan',
    reserve: 'Hadiahkan',
    digital: (bank: string) => `Sumbangan digital · ${bank}`,
    copyAria: (account: string) => `Salin nombor akaun ${account}`,
    copied: 'Telah disalin',
    copyHint: (holder: string) => `${holder} · Ketik untuk salin`,
    confirmEyebrow: 'Sahkan pilihan',
    // The gift name is set in italics between these two halves
    confirmBefore: 'Adakah anda ingin menghadiahkan ',
    confirmAfter: '? Pilihan ini akan ditanda sebagai dihadiahkan supaya tidak berulang.',
    saving: 'Menyimpan…',
    confirm: 'Ya, saya sahkan',
    cancel: 'Batalkan'
  },
  rsvp: {
    eyebrow: 'Sudilah kiranya',
    title: 'RSVP',
    cta: 'Sahkan kehadiran',
    responses: 'Maklum balas',
    guests: 'Jumlah tetamu',
    replyBy: (date: string) => `Mohon maklum balas sebelum ${date}`,
    closed: 'Tempoh maklum balas telah berakhir. Terima kasih atas doa dan ingatan anda.',
    thanksAttending: (name: string) => `Terima kasih, ${name}. Kami menantikan kehadiran anda.`,
    thanksDeclined: (name: string) => `Terima kasih, ${name}. Doa anda amat bermakna bagi kami.`,
    name: 'Nama penuh',
    namePlaceholder: 'Seperti tertera pada undangan',
    attendance: 'Kehadiran',
    attending: 'Dengan sukacitanya hadir',
    notAttending: 'Dukacita tidak dapat hadir',
    guestCount: 'Bilangan tetamu',
    guestOption: (count: number) => `${count} orang`,
    message: 'Ucapan untuk pengantin',
    optional: 'Pilihan',
    submit: 'Hantar maklum balas',
    sending: 'Menghantar…',
    nameRequired: 'Sila nyatakan nama anda',
    failed: 'Maaf, maklum balas anda tidak dapat dihantar. Sila cuba sekali lagi.'
  },
  wishes: {
    eyebrow: 'Ucapan',
    title: 'Doa dan Ucapan',
    subtitle: 'Kirimkan kasih dan doa anda untuk kami',
    name: 'Nama anda',
    message: 'Ucapan',
    placeholder: 'Tulis ucapan anda di sini',
    submit: 'Kirim ucapan',
    sending: 'Menghantar…',
    empty: 'Jadilah yang pertama mengirim ucapan.',
    required: 'Sila isi nama dan ucapan anda',
    failed: 'Maaf, ucapan anda tidak dapat dihantar. Sila cuba sekali lagi.',
    listLabel: 'Senarai ucapan'
  },
  closing: {
    music: (credit: string) => `Muzik · ${credit}`
  },
  music: {
    play: 'Mainkan muzik',
    pause: 'Hentikan muzik'
  },
  dialog: {
    close: 'Tutup'
  }
};

export type Messages = typeof ms;
