
import React, { useState, useEffect } from 'react';
import { WeddingConfig, ContactPerson, EventSchedule, Gift } from '../types';
import { storage } from '../services/storage';

interface AdminPanelProps {
  config: WeddingConfig;
}

const THEME_PRESETS = [
  {
    name: 'Classic Pink',
    colors: { primary: '#A64B6D', secondary: '#A1B39D', accent: '#D4AF37', background: '#FCFAF7', text: '#2D2D2D', muted: '#777777' }
  },
  {
    name: 'Emerald Garden',
    colors: { primary: '#2D5A27', secondary: '#8BA888', accent: '#C5A059', background: '#F4F7F2', text: '#1A2E19', muted: '#6B7F6A' }
  },
  {
    name: 'Midnight Gold',
    colors: { primary: '#1B263B', secondary: '#415A77', accent: '#E0E1DD', background: '#0D1B2A', text: '#FFFFFF', muted: '#778DA9' }
  },
  {
    name: 'Modern Minimalist',
    colors: { primary: '#333333', secondary: '#666666', accent: '#999999', background: '#FFFFFF', text: '#000000', muted: '#AAAAAA' }
  }
];

const FONT_OPTIONS = {
  display: ["'Playfair Display', serif", "'Cinzel', serif", "'Prata', serif", "'Great Vibes', cursive"],
  body: ["'Montserrat', sans-serif", "'Open Sans', sans-serif", "'Roboto', sans-serif", "'Lato', sans-serif"],
  serif: ["'Cormorant Garamond', serif", "'Lora', serif", "'EB Garamond', serif", "'Merriweather', serif"]
};

const AdminPanel: React.FC<AdminPanelProps> = ({ config }) => {
  const [localConfig, setLocalConfig] = useState<WeddingConfig>(config);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'event' | 'schedule' | 'contacts' | 'registry' | 'theme'>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setLocalConfig(config);
    const unsub = storage.subscribeGifts(setGifts);
    return () => unsub();
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await storage.updateConfig(localConfig);
      await storage.updateGifts(gifts);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateNested = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(localConfig)); // Deep clone
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setLocalConfig(newConfig);
  };

  const handleDateSync = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return;

    const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];

    const dayName = days[d.getDay()];
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();

    const fullDisplay = `${dateNum} ${monthName} ${year}`;
    const shortDisplay = `${dateNum.toString().padStart(2, '0')} • ${(d.getMonth() + 1).toString().padStart(2, '0')} • ${year}`;

    const newConfig = { ...localConfig };
    newConfig.event.date = d.toISOString();
    newConfig.event.day = dayName;
    newConfig.event.fullDateDisplay = fullDisplay;
    newConfig.event.shortDateDisplay = shortDisplay;
    setLocalConfig(newConfig);
  };

  const formatTime12h = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  const handleTimeRangeSync = (start24: string, end24: string) => {
    const start12 = formatTime12h(start24);
    const end12 = formatTime12h(end24);
    const newRange = `${start12} - ${end12}`;
    updateNested('event.timeRange', newRange);
  };

  const parseTime24 = (time12: string) => {
    if (!time12) return "12:00";
    const parts = time12.split(' ');
    if (parts.length < 2) return "12:00";
    const [time, modifier] = parts;
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const addItem = (type: 'schedule' | 'contacts' | 'gifts') => {
    if (type === 'schedule') {
      const newItem: EventSchedule = { time: '12:00 PM', title: 'Acara Baru', description: '' };
      setLocalConfig({ ...localConfig, schedule: [...localConfig.schedule, newItem] });
    } else if (type === 'contacts') {
      const newItem: ContactPerson = { name: 'Nama Baru', phone: '', label: 'Keluarga', side: 'groom', link: '' };
      setLocalConfig({ ...localConfig, contacts: [...localConfig.contacts, newItem] });
    } else if (type === 'gifts') {
      const newItem: Gift = { id: Date.now().toString(), name: 'Hadiah Baru', reserved: false, buyLink: '' };
      setGifts([...gifts, newItem]);
    }
  };

  const removeItem = (type: 'schedule' | 'contacts' | 'gifts', index: number) => {
    if (type === 'schedule') {
      const newList = localConfig.schedule.filter((_, i) => i !== index);
      setLocalConfig({ ...localConfig, schedule: newList });
    } else if (type === 'contacts') {
      const newList = localConfig.contacts.filter((_, i) => i !== index);
      setLocalConfig({ ...localConfig, contacts: newList });
    } else if (type === 'gifts') {
      const newList = gifts.filter((_, i) => i !== index);
      setGifts(newList);
    }
  };

  const moveSchedule = (index: number, direction: 'up' | 'down') => {
    const newList = [...localConfig.schedule];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setLocalConfig({ ...localConfig, schedule: newList });
  };

  const renderBasicInfo = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 bg-stone-50 rounded-2xl">
          <h3 className="text-lg font-bold text-primary mb-4 uppercase tracking-widest">Pengantin Lelaki (Groom)</h3>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 block">Full Name (Formal)</label>
            <input className="admin-input" placeholder="Full Name" value={localConfig.couple.groom.fullName} onChange={e => updateNested('couple.groom.fullName', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 block">Short Name (Casual)</label>
            <input className="admin-input" placeholder="Short Name" value={localConfig.couple.groom.shortName} onChange={e => updateNested('couple.groom.shortName', e.target.value)} />
          </div>
          <input className="admin-input" placeholder="Image URL" value={localConfig.couple.groom.imageUrl} onChange={e => updateNested('couple.groom.imageUrl', e.target.value)} />
          <input className="admin-input" placeholder="Father's Name" value={localConfig.couple.groom.parents.father} onChange={e => updateNested('couple.groom.parents.father', e.target.value)} />
          <input className="admin-input" placeholder="Mother's Name" value={localConfig.couple.groom.parents.mother} onChange={e => updateNested('couple.groom.parents.mother', e.target.value)} />
        </div>
        <div className="space-y-4 p-6 bg-stone-50 rounded-2xl">
          <h3 className="text-lg font-bold text-secondary mb-4 uppercase tracking-widest">Pengantin Perempuan (Bride)</h3>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 block">Full Name (Formal)</label>
            <input className="admin-input" placeholder="Full Name" value={localConfig.couple.bride.fullName} onChange={e => updateNested('couple.bride.fullName', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 block">Short Name (Casual)</label>
            <input className="admin-input" placeholder="Short Name" value={localConfig.couple.bride.shortName} onChange={e => updateNested('couple.bride.shortName', e.target.value)} />
          </div>
          <input className="admin-input" placeholder="Image URL" value={localConfig.couple.bride.imageUrl} onChange={e => updateNested('couple.bride.imageUrl', e.target.value)} />
          <input className="admin-input" placeholder="Father's Name" value={localConfig.couple.bride.parents.father} onChange={e => updateNested('couple.bride.parents.father', e.target.value)} />
          <input className="admin-input" placeholder="Mother's Name" value={localConfig.couple.bride.parents.mother} onChange={e => updateNested('couple.bride.parents.mother', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderEventInfo = () => {
    const timeRangeStr = localConfig.event.timeRange || "11:00 AM - 4:00 PM";
    const [startTimeStr, endTimeStr] = timeRangeStr.includes(' - ') ? timeRangeStr.split(' - ') : ["11:00 AM", "4:00 PM"];
    const startTime24 = parseTime24(startTimeStr);
    const endTime24 = parseTime24(endTimeStr);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="p-6 bg-stone-50 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-primary mb-4 uppercase tracking-widest">Details Majlis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-muted mb-1 block">Tarikh Majlis Utama</label>
              <input 
                type="date" 
                className="admin-input" 
                value={localConfig.event.date.substring(0, 10)} 
                onChange={e => handleDateSync(e.target.value)} 
              />
            </div>
            
            <div className="md:col-span-2 border-t border-stone-200 pt-4 mt-2">
              <label className="text-xs font-bold text-muted mb-2 block uppercase tracking-tighter">Waktu Majlis (Time Range)</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-stone-400 mb-1 block uppercase">Waktu Mula</label>
                  <input 
                    type="time" 
                    className="admin-input" 
                    value={startTime24}
                    onChange={e => handleTimeRangeSync(e.target.value, endTime24)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-400 mb-1 block uppercase">Waktu Tamat</label>
                  <input 
                    type="time" 
                    className="admin-input" 
                    value={endTime24}
                    onChange={e => handleTimeRangeSync(startTime24, e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-muted mb-1 block">Nama Lokasi (Venue)</label>
              <input className="admin-input" value={localConfig.event.venueName} onChange={e => updateNested('event.venueName', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSchedule = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary uppercase tracking-widest">Aturcara Majlis</h3>
        </div>
        <button onClick={() => addItem('schedule')} className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">+ TAMBAH ACARA</button>
      </div>
      
      <div className="space-y-4">
        {localConfig.schedule.map((item, idx) => (
          <div key={`schedule-${idx}`} className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm flex items-start gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input className="admin-input" value={item.time} onChange={e => {
                const newList = [...localConfig.schedule];
                newList[idx] = { ...newList[idx], time: e.target.value };
                setLocalConfig({ ...localConfig, schedule: newList });
              }} />
              <input className="admin-input md:col-span-3" value={item.title} onChange={e => {
                const newList = [...localConfig.schedule];
                newList[idx] = { ...newList[idx], title: e.target.value };
                setLocalConfig({ ...localConfig, schedule: newList });
              }} />
            </div>
            <button onClick={() => removeItem('schedule', idx)} className="text-red-300 p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderThemeSettings = () => (
    <div className="space-y-12 animate-fade-in">
      {/* Theme Presets */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-6 uppercase tracking-widest">Pilih Tema Sedia Ada</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => updateNested('theme.colors', preset.colors)}
              className="p-4 bg-white border border-stone-100 rounded-2xl hover:shadow-xl transition-all group flex flex-col items-center gap-3"
            >
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.primary }}></div>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.secondary }}></div>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.accent }}></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 group-hover:text-primary">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 bg-stone-50 rounded-[2rem] space-y-4">
          <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-4">Warna Custom</h3>
          {[
            { label: 'Primary (Main)', key: 'primary' },
            { label: 'Secondary (Soft)', key: 'secondary' },
            { label: 'Accent (Highlight)', key: 'accent' },
            { label: 'Background', key: 'background' },
            { label: 'Text', key: 'text' },
            { label: 'Muted', key: 'muted' },
          ].map(color => (
            <div key={color.key} className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 block">{color.label}</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0" 
                    value={localConfig.theme.colors[color.key as keyof typeof localConfig.theme.colors]} 
                    onChange={e => updateNested(`theme.colors.${color.key}`, e.target.value)} 
                  />
                  <input 
                    type="text" 
                    className="admin-input flex-1 uppercase font-mono" 
                    value={localConfig.theme.colors[color.key as keyof typeof localConfig.theme.colors]} 
                    onChange={e => updateNested(`theme.colors.${color.key}`, e.target.value)} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-stone-50 rounded-[2rem] space-y-6">
          <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-4">Tipografi (Font)</h3>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 block">Font Utama (Display)</label>
            <select 
              className="admin-input" 
              value={localConfig.theme.fonts.display} 
              onChange={e => updateNested('theme.fonts.display', e.target.value)}
              style={{ fontFamily: localConfig.theme.fonts.display }}
            >
              {FONT_OPTIONS.display.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f.split(',')[0].replace(/'/g, '')}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 block">Font Badan (Body)</label>
            <select 
              className="admin-input" 
              value={localConfig.theme.fonts.body} 
              onChange={e => updateNested('theme.fonts.body', e.target.value)}
              style={{ fontFamily: localConfig.theme.fonts.body }}
            >
              {FONT_OPTIONS.body.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f.split(',')[0].replace(/'/g, '')}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 block">Font Serif (Italic/Formal)</label>
            <select 
              className="admin-input" 
              value={localConfig.theme.fonts.serif} 
              onChange={e => updateNested('theme.fonts.serif', e.target.value)}
              style={{ fontFamily: localConfig.theme.fonts.serif }}
            >
              {FONT_OPTIONS.serif.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f.split(',')[0].replace(/'/g, '')}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Music Settings */}
      <div className="p-8 bg-stone-50 rounded-[2rem] space-y-6">
        <h3 className="text-lg font-bold text-primary uppercase tracking-widest">Muzik & Audio Latar</h3>
        <div className="grid md:grid-cols-3 gap-8 items-end">
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 block">Pautan MP3 (URL)</label>
            <input 
              className="admin-input" 
              placeholder="https://example.com/song.mp3" 
              value={localConfig.music.url} 
              onChange={e => updateNested('music.url', e.target.value)} 
            />
            <p className="text-[10px] text-stone-400 mt-2 italic">Pastikan pautan berakhir dengan .mp3 atau merupakan direct link audio.</p>
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 block">Kekuatan Bunyi (Volume: {Math.round(localConfig.music.volume * 100)}%)</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              className="w-full accent-primary h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer" 
              value={localConfig.music.volume} 
              onChange={e => updateNested('music.volume', parseFloat(e.target.value))} 
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-white border border-stone-100 rounded-2xl flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400">TEST AUDIO</span>
          <audio controls className="h-8 max-w-[200px]" src={localConfig.music.url}>Your browser does not support audio.</audio>
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-primary uppercase tracking-widest">Hubungi Kami</h3>
        <button onClick={() => addItem('contacts')} className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold">+ TAMBAH</button>
      </div>
      {localConfig.contacts.map((item, idx) => (
        <div key={`contact-${idx}`} className="p-4 bg-stone-50 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <input className="admin-input" placeholder="Nama" value={item.name} onChange={e => {
            const newList = [...localConfig.contacts];
            newList[idx] = { ...newList[idx], name: e.target.value };
            setLocalConfig({ ...localConfig, contacts: newList });
          }} />
          <input className="admin-input" placeholder="Telefon" value={item.phone} onChange={e => {
            const newList = [...localConfig.contacts];
            newList[idx] = { ...newList[idx], phone: e.target.value };
            setLocalConfig({ ...localConfig, contacts: newList });
          }} />
          <select className="admin-input" value={item.side} onChange={e => {
            const newList = [...localConfig.contacts];
            newList[idx] = { ...newList[idx], side: e.target.value as 'groom' | 'bride' };
            setLocalConfig({ ...localConfig, contacts: newList });
          }}>
            <option value="groom">Pihak Lelaki</option>
            <option value="bride">Pihak Perempuan</option>
          </select>
          <div className="flex gap-2">
            <input className="admin-input flex-1" placeholder="Label (cth: Ayah)" value={item.label} onChange={e => {
              const newList = [...localConfig.contacts];
              newList[idx] = { ...newList[idx], label: e.target.value };
              setLocalConfig({ ...localConfig, contacts: newList });
            }} />
            <button onClick={() => removeItem('contacts', idx)} className="text-red-300 p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRegistry = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 bg-stone-50 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-primary mb-4 uppercase tracking-widest">Butiran Bank (Tanda Kasih)</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input className="admin-input" placeholder="Nama Bank" value={localConfig.registry.bankName} onChange={e => updateNested('registry.bankName', e.target.value)} />
          <input className="admin-input" placeholder="No Akaun" value={localConfig.registry.accountNumber} onChange={e => updateNested('registry.accountNumber', e.target.value)} />
          <input className="admin-input" placeholder="Nama Pemegang Akaun" value={localConfig.registry.accountHolder} onChange={e => updateNested('registry.accountHolder', e.target.value)} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-body text-stone-800">
      <aside className="w-full md:w-64 bg-white shadow-xl md:h-screen p-8 flex flex-col space-y-8 z-10 sticky top-0">
        <div className="text-2xl font-display text-primary border-b border-stone-100 pb-4">Admin Hub</div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'basic', label: 'Mempelai' },
            { id: 'event', label: 'Majlis' },
            { id: 'theme', label: 'Tema & Media' },
            { id: 'schedule', label: 'Aturcara' },
            { id: 'contacts', label: 'Hubungi' },
            { id: 'registry', label: 'Hadiah' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-xs tracking-widest uppercase ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:bg-stone-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="pt-8 border-t border-stone-100 space-y-4">
          <a href="#" className="block text-center text-[10px] font-bold tracking-widest text-primary uppercase underline hover:opacity-70 transition-opacity">Lihat Undangan</a>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={`w-full py-4 rounded-xl font-bold tracking-widest text-xs uppercase shadow-2xl transition-all active:scale-95 ${saveStatus === 'success' ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            {isSaving ? 'Menyimpan...' : saveStatus === 'success' ? 'Berjaya!' : 'Simpan Perubahan'}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-16 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-display text-stone-800">Wedding Configuration</h1>
          <p className="text-stone-400 mt-2">Kemas kini maklumat undangan anda secara langsung.</p>
        </header>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-stone-200">
          {activeTab === 'basic' && renderBasicInfo()}
          {activeTab === 'event' && renderEventInfo()}
          {activeTab === 'theme' && renderThemeSettings()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'contacts' && renderContacts()}
          {activeTab === 'registry' && renderRegistry()}
        </div>
      </main>

      <style>{`
        .admin-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background-color: white;
          border: 1px solid #e7e5e4;
          outline: none;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .admin-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(166, 75, 109, 0.05);
        }
        .admin-input:disabled {
          background-color: #f5f5f4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
