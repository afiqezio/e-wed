
// Admin panel shell. The tabs and fields come from ./admin/schema.ts;
// this file owns the draft, saving, the live preview and the few bespoke blocks.
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WeddingConfig, Gift } from '../types';
import { storage } from '../services/storage';
import { FALLBACK_CONFIG } from '../constants_dummy';
import { invitationOf, resolveMusic } from './helpers';
import { Draft, FieldDef, SectionDef, buildTabs } from './admin/schema';
import { Field, ListEditor, getPath, setPath, to12h, to24h } from './admin/controls';
import PreviewPane from './admin/PreviewPane';
import { BASE_LANG, LANGUAGES, LANG_CODES, Lang, isLang, languageDef } from '../i18n/config';
import { AdminI18nProvider, useAdminI18n } from '../i18n/admin';

interface AdminPanelProps {
  config: WeddingConfig;
}

// The stored day and date strings are invitation content in the base language (Malay),
// whatever language the panel itself is shown in.
const DAYS = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
const MONTHS = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
const GRID_COLS = { 1: '', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' };
const COL_SPAN: Record<number, string> = { 2: 'md:col-span-2', 3: 'md:col-span-3' };
const LABEL_CLASS = 'text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 block';
const GHOST_BUTTON = 'px-4 py-2 bg-white border border-stone-200 text-primary rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-stone-50 transition-all';
const PREVIEW_PREF_KEY = 'e-wed:admin:preview';

// Older settings may predate the invitation block; fill it so every field is editable
const makeDraft = (config: WeddingConfig, gifts: Gift[]): Draft => ({ ...config, invitation: invitationOf(config), gifts });

// Only design settings get a one-tap reset; names and dates have no meaningful default
const defaultFor = (path: string) =>
  path.startsWith('invitation.') && !path.startsWith('invitation.i18n.') ? getPath(FALLBACK_CONFIG, path) : undefined;

const AdminPanelInner: React.FC<AdminPanelProps> = ({ config }) => {
  const { a, lang: panelLang, setLang: setPanelLang } = useAdminI18n();
  const tabs = useMemo(() => buildTabs(a), [a]);

  const [draft, setDraft] = useState<Draft>(() => makeDraft(config, []));
  const [saved, setSaved] = useState<Draft>(draft);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(() => {
    try { return localStorage.getItem(PREVIEW_PREF_KEY) !== 'off'; } catch { return true; }
  });
  const [importError, setImportError] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;
  const giftsRef = useRef<Gift[]>([]);
  const tab = tabs.find(t => t.id === activeTab) || tabs[0];
  const { gifts, ...draftConfig } = draft;

  // The invitation's language: guests see it, the preview shows it, and the translatable fields edit it
  const invitationLang: Lang = isLang(draft.invitation.options.language) ? draft.invitation.options.language : BASE_LANG;

  // Live settings: adopted only while there are no unsaved edits, so typing is never overwritten
  useEffect(() => {
    if (dirtyRef.current) return;
    const next = makeDraft(config, giftsRef.current);
    setDraft(next);
    setSaved(next);
  }, [config]);

  // Gifts change while the panel is open (guests reserve them)
  useEffect(() => {
    const unsub = storage.subscribeGifts((remote) => {
      giftsRef.current = remote;
      if (!dirtyRef.current) {
        setDraft(d => ({ ...d, gifts: remote }));
        setSaved(s => ({ ...s, gifts: remote }));
        return;
      }
      // Mid-edit: keep the edits, but never lose a reservation a guest just made
      const reservedIds = new Set(remote.filter(g => g.reserved).map(g => g.id));
      const mark = (list: Gift[]) => list.map(g => (reservedIds.has(g.id) && !g.reserved ? { ...g, reserved: true } : g));
      setDraft(d => ({ ...d, gifts: mark(d.gifts) }));
      setSaved(s => ({ ...s, gifts: mark(s.gifts) }));
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (isSaving || !dirtyRef.current) return;
    setIsSaving(true);
    setSaveStatus('idle');
    const snapshot = draft;
    try {
      const { gifts: draftGifts, ...settings } = snapshot;
      await storage.updateConfig(settings as WeddingConfig);
      await storage.updateGifts(draftGifts);
      setSaved(snapshot);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  const saveRef = useRef(handleSave);
  saveRef.current = handleSave;

  // Ctrl/Cmd+S saves; leaving with unsaved edits asks first
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onLeave);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', onLeave);
    };
  }, []);

  const update = (path: string, value: any) => setDraft(d => setPath(d, path, value));

  // When the invitation is in another language, a translatable field edits that language's copy
  // (invitation.i18n.<lang>.text.*). Its placeholder is that language's default wording, which is
  // what guests see while the field is left empty.
  const fieldFor = (field: FieldDef): FieldDef => {
    if (invitationLang === BASE_LANG || !field.translatable) return field;
    const key = field.path.split('.').pop() as string;
    return {
      ...field,
      path: field.path.replace(/^invitation\.text\./, `invitation.i18n.${invitationLang}.text.`),
      placeholder: (languageDef(invitationLang).content as Record<string, string> | undefined)?.[key],
      hint: a.shell.emptyUsesDefault
    };
  };
  const tabIsTranslatable = tab.sections.some(s => s.fields?.some(f => f.translatable) || s.list?.columns.some(c => c.translatable));

  const togglePreview = () => {
    const next = !showPreview;
    setShowPreview(next);
    try { localStorage.setItem(PREVIEW_PREF_KEY, next ? 'on' : 'off'); } catch { /* preference only */ }
  };

  // --- bespoke blocks -------------------------------------------------------

  const handleDateSync = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return;
    const dateNum = d.getDate();
    const year = d.getFullYear();
    setDraft(prev => ({
      ...prev,
      event: {
        ...prev.event,
        date: d.toISOString(),
        day: DAYS[d.getDay()],
        fullDateDisplay: `${dateNum} ${MONTHS[d.getMonth()]} ${year}`,
        shortDateDisplay: `${dateNum.toString().padStart(2, '0')} • ${(d.getMonth() + 1).toString().padStart(2, '0')} • ${year}`
      }
    }));
  };

  const renderEventDate = () => {
    const [startStr = '11:00 AM', endStr = '4:00 PM'] = (draft.event.timeRange || '').split(/\s+-\s+/);
    const start24 = to24h(startStr) || '11:00';
    const end24 = to24h(endStr) || '16:00';
    const setRange = (start: string, end: string) => update('event.timeRange', `${to12h(start)} - ${to12h(end)}`);
    const eventDate = new Date(draft.event.date);
    const dateHint = isNaN(eventDate.getTime())
      ? ''
      : eventDate.toLocaleDateString(languageDef(panelLang).dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>{a.event.date}</label>
          <input type="date" className="admin-input" value={String(draft.event.date).substring(0, 10)} onChange={e => handleDateSync(e.target.value)} />
          <p className="text-[10px] text-stone-400 mt-1 italic">{dateHint}</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>{a.event.rsvpDeadline}</label>
          <input type="date" className="admin-input" value={String(draft.event.rsvpDeadline).substring(0, 10)} onChange={e => e.target.value && update('event.rsvpDeadline', `${e.target.value}T23:59:59+08:00`)} />
          <p className="text-[10px] text-stone-400 mt-1 italic">{a.event.rsvpDeadlineHint}</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>{a.event.startTime}</label>
          <input type="time" className="admin-input" value={start24} onChange={e => e.target.value && setRange(e.target.value, end24)} />
          <p className="text-[10px] text-stone-400 mt-1 italic">{a.event.startTimeHint}</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>{a.event.endTime}</label>
          <input type="time" className="admin-input" value={end24} onChange={e => e.target.value && setRange(start24, e.target.value)} />
        </div>
      </div>
    );
  };

  const renderPalettePreview = () => {
    const { colors, text } = invitationOf(draftConfig as WeddingConfig, invitationLang);
    const serif = "'Cormorant Garamond', serif";
    return (
      <div className="md:col-span-2 p-8 text-center space-y-3" style={{ backgroundColor: colors.background, border: `1px solid ${colors.text}33` }}>
        <div style={{ color: colors.secondary, fontFamily: serif, fontWeight: 500, fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase' }}>{text.eventLabel}</div>
        <div style={{ color: colors.text, fontFamily: "'Pinyon Script', cursive", fontSize: 40, lineHeight: 1.15 }}>
          {draft.couple.groom.shortName} <span style={{ color: colors.accent }}>&amp;</span> {draft.couple.bride.shortName}
        </div>
        <div style={{ display: 'inline-block', padding: '10px 26px', border: `1px solid ${colors.text}9e`, color: colors.text, fontFamily: serif, fontWeight: 500, fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase' }}>
          {languageDef(invitationLang).messages.welcome.open}
        </div>
        <div className="p-3" style={{ backgroundColor: colors.deep, color: colors.accent, fontFamily: serif, fontSize: 18 }}>⚘︎</div>
      </div>
    );
  };

  const renderMusicTest = () => {
    const playing = resolveMusic(draftConfig as WeddingConfig);
    return (
      <div className="md:col-span-2 p-4 bg-white border border-stone-100 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-bold text-stone-400 block uppercase">{a.music.test}</span>
          <span className="text-[11px] text-stone-400 break-all">{playing.credit || playing.url}</span>
        </div>
        <audio controls className="h-8 max-w-[240px]" src={playing.url}>Your browser does not support audio.</audio>
      </div>
    );
  };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `undangan-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    setImportError(false);
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed?.couple?.groom || !parsed?.event || !Array.isArray(parsed?.schedule)) throw new Error('shape');
      const { gifts: importedGifts, ...settings } = parsed;
      setDraft(makeDraft({ ...draftConfig, ...settings } as WeddingConfig, Array.isArray(importedGifts) ? importedGifts : draft.gifts));
    } catch {
      setImportError(true);
    }
  };

  const renderBackup = () => (
    <div className="space-y-4">
      <p className="text-xs text-stone-500 leading-relaxed">{a.backup.explain}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={exportBackup} className={GHOST_BUTTON}>{a.backup.export}</button>
        <label className={`${GHOST_BUTTON} cursor-pointer`}>
          {a.backup.import}
          <input type="file" accept="application/json,.json" className="hidden" onChange={e => { importBackup(e.target.files?.[0]); e.target.value = ''; }} />
        </label>
      </div>
      {importError && <p className="text-xs text-red-500">{a.backup.invalid}</p>}
    </div>
  );

  const CUSTOM_BLOCKS: Record<NonNullable<SectionDef['custom']>, () => React.ReactNode> = {
    eventDate: renderEventDate,
    palettePreview: renderPalettePreview,
    musicTest: renderMusicTest,
    backup: renderBackup,
  };

  // --- schema renderer ------------------------------------------------------

  const renderSection = (section: SectionDef) => {
    const presetValue = section.presets ? getPath(draft, section.presets.path) : null;
    return (
      <section key={section.id} className="p-6 bg-stone-50 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest">{section.title}</h3>
            {section.description && <p className="text-[11px] text-stone-400 mt-1 max-w-2xl">{section.description}</p>}
          </div>
          {section.actions?.map(action => (
            <button key={action.label} type="button" onClick={() => setDraft(d => action.run(d))} className={GHOST_BUTTON}>{action.label}</button>
          ))}
        </div>

        {section.presets && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {section.presets.items.map(preset => {
              const active = Object.keys(preset.value).every(k => String(presetValue?.[k] || '').toLowerCase() === preset.value[k].toLowerCase());
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => update(section.presets!.path, preset.value)}
                  aria-pressed={active}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 hover:shadow-xl ${active ? 'border-primary shadow-lg' : 'border-transparent'}`}
                  style={{ backgroundColor: preset.value.background }}
                >
                  <div className="flex gap-1">
                    {['text', 'accent', 'muted'].map(k => <div key={k} className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.value[k] }}></div>)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: preset.value.text }}>{preset.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {(section.fields || section.custom) && !section.list && (
          <div className={`grid gap-4 ${GRID_COLS[section.columns || 1]}`}>
            {section.fields?.map(fieldFor).map(field => (
              <div key={field.path} className={COL_SPAN[field.span || 1] || ''}>
                <Field def={field} value={getPath(draft, field.path)} defaultValue={defaultFor(field.path)} onChange={v => update(field.path, v)} />
              </div>
            ))}
            {section.custom && CUSTOM_BLOCKS[section.custom]()}
          </div>
        )}

        {section.list && (
          <ListEditor def={section.list} lang={invitationLang === BASE_LANG ? undefined : invitationLang} items={getPath(draft, section.list.path) || []} onChange={items => update(section.list!.path, items)} />
        )}
      </section>
    );
  };

  const groups = tabs.reduce<Record<string, typeof tabs>>((acc, t) => ({ ...acc, [t.group]: [...(acc[t.group] || []), t] }), {});
  const saveLabel = isSaving ? a.shell.saving : saveStatus === 'success' ? a.shell.saved : saveStatus === 'error' ? a.shell.saveFailed : isDirty ? a.shell.save : a.shell.noChanges;
  const saveTone = saveStatus === 'success' ? 'bg-green-500 text-white' : saveStatus === 'error' ? 'bg-red-500 text-white' : 'bg-primary text-white hover:bg-primary/90';

  const panelLanguageSwitch = (
    <div className="flex rounded-xl border border-stone-200 overflow-hidden bg-white" role="group" aria-label={a.shell.panelLanguage}>
      {LANG_CODES.map(code => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => setPanelLang(code)}
          aria-pressed={panelLang === code}
          title={LANGUAGES[code].label}
          className={`flex-1 px-3 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${panelLang === code ? 'bg-primary text-white' : 'text-stone-500 hover:bg-stone-50'}`}
        >
          {LANGUAGES[code].short}
        </button>
      ))}
    </div>
  );

  return (
    <div lang={panelLang} className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-body text-stone-800">
      <aside className="w-full md:w-60 md:flex-none bg-white shadow-xl md:h-screen p-4 md:p-6 flex flex-col gap-4 md:gap-6 z-20 sticky top-0 md:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 md:border-b border-stone-100 md:pb-4">
          <div className="text-2xl font-display text-primary">{a.shell.title}</div>
          <div className="md:hidden w-24">{panelLanguageSwitch}</div>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible md:flex-1 -mx-1 px-1">
          {Object.entries(groups).map(([group, groupTabs]) => (
            <React.Fragment key={group}>
              <div className="hidden md:block text-[9px] font-bold text-stone-300 uppercase tracking-[0.2em] px-4 pt-4 pb-1">{group}</div>
              {groupTabs.map(t => (
                <button
                  key={t.id}
                  data-tab={t.id}
                  onClick={() => setActiveTab(t.id)}
                  aria-current={activeTab === t.id ? 'page' : undefined}
                  className={`flex-none md:w-full text-left px-4 py-2.5 rounded-xl transition-all font-bold text-xs tracking-widest uppercase whitespace-nowrap ${activeTab === t.id ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:bg-stone-50'}`}
                >
                  {t.label}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>
        <div className="hidden md:block pt-4 border-t border-stone-100 space-y-3">
          <div>
            <div className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.2em] mb-2">{a.shell.panelLanguage}</div>
            {panelLanguageSwitch}
          </div>
          <a href="#" target="_blank" rel="noopener noreferrer" className="block text-center text-[10px] font-bold tracking-widest text-primary uppercase underline hover:opacity-70 transition-opacity">{a.shell.viewInvitation} ↗</a>
          <button onClick={togglePreview} aria-pressed={showPreview} className="hidden xl:block w-full py-2.5 rounded-xl border border-stone-200 text-[10px] font-bold tracking-widest uppercase text-stone-500 hover:bg-stone-50 transition-all">
            {showPreview ? a.shell.hidePreview : a.shell.showPreview}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col md:h-screen md:overflow-y-auto">
        <div className="flex-1 p-4 md:p-10 max-w-4xl w-full mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display text-stone-800">{tab.label}</h1>
            <p className="text-stone-400 mt-2 text-sm">{tab.description}</p>
            {tabIsTranslatable && invitationLang !== BASE_LANG && (
              <p className="mt-4 px-4 py-3 bg-white border border-stone-200 rounded-xl text-[11px] text-stone-500" data-editing-language={invitationLang}>
                {a.shell.editingLanguage(LANGUAGES[invitationLang].label)}
              </p>
            )}
          </header>
          <div className="space-y-6">
            {tab.sections.map(renderSection)}
          </div>
        </div>

        {/* Save bar: always in reach, and says plainly whether anything is unsaved */}
        <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-stone-200 px-4 md:px-10 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className={`text-xs font-bold ${isDirty ? 'text-amber-600' : 'text-stone-400'}`} role="status" data-dirty={isDirty}>
            {isDirty ? a.shell.statusDirty : a.shell.statusSaved}
          </span>
          <div className="flex gap-2">
            {isDirty && !isSaving && (
              <button data-action="discard" onClick={() => setDraft(saved)} className="px-4 py-3 rounded-xl border border-stone-200 text-[10px] font-bold tracking-widest uppercase text-stone-500 hover:bg-stone-50 transition-all">
                {a.shell.discard}
              </button>
            )}
            <button
              data-action="save"
              onClick={handleSave}
              disabled={isSaving || (!isDirty && saveStatus === 'idle')}
              title="Ctrl+S"
              className={`px-6 py-3 rounded-xl font-bold tracking-widest text-[10px] uppercase shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none ${saveTone}`}
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </main>

      {showPreview && (
        <aside className="hidden xl:block w-[420px] flex-none h-screen sticky top-0 p-6 bg-stone-200/60 border-l border-stone-200">
          <PreviewPane config={draftConfig as WeddingConfig} section={tab.preview} lang={invitationLang} />
        </aside>
      )}

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

const AdminPanel: React.FC<AdminPanelProps> = (props) => (
  <AdminI18nProvider>
    <AdminPanelInner {...props} />
  </AdminI18nProvider>
);

export default AdminPanel;
