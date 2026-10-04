
import React, { useEffect, useState } from 'react';
import { FieldDef, ListDef } from './schema';
import { useAdminI18n } from '../../i18n/admin';

// --- path helpers -----------------------------------------------------------

export const getPath = (obj: any, path: string) =>
  path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** Returns a copy of `obj` with the value at `path` replaced. */
export const setPath = <T,>(obj: T, path: string, value: any): T => {
  const clone = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  let current: any = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] == null || typeof current[keys[i]] !== 'object') current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return clone;
};

// --- time helpers ("07:30 PM" <-> "19:30") ----------------------------------

export const to24h = (time12: string) => {
  const m = String(time12 || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return '';
  let h = parseInt(m[1], 10);
  if (m[3]) {
    h = h % 12;
    if (m[3].toUpperCase() === 'PM') h += 12;
  }
  return `${String(h).padStart(2, '0')}:${m[2]}`;
};

export const to12h = (time24: string, pad = false) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h24 = parseInt(hours, 10);
  const h = h24 % 12 || 12;
  return `${pad ? String(h).padStart(2, '0') : h}:${minutes} ${h24 >= 12 ? 'PM' : 'AM'}`;
};

// --- field ------------------------------------------------------------------

const LABEL_CLASS = 'text-[10px] font-bold text-stone-400 uppercase tracking-widest';
const isLink = (v: string) => /^(https?:\/\/|\/|tel:|mailto:)/i.test(v);

interface FieldProps {
  def: FieldDef;
  value: any;
  /** When given and different from `value`, a one-tap "Asal" reset is offered */
  defaultValue?: any;
  onChange: (value: any) => void;
  compact?: boolean;
}

const Thumb: React.FC<{ src: string }> = ({ src }) => {
  const { a } = useAdminI18n();
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  return (
    <div className="w-16 h-20 flex-none rounded-xl overflow-hidden bg-stone-200 border border-stone-200 flex items-center justify-center">
      {src && !broken
        ? <img src={src} alt="" className="w-full h-full object-cover" onError={() => setBroken(true)} />
        : <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest text-center px-1">{src ? a.controls.imageFailed : a.controls.imageNone}</span>}
    </div>
  );
};

export const Field: React.FC<FieldProps> = ({ def, value, defaultValue, onChange, compact }) => {
  const { a } = useAdminI18n();
  const type = def.type || 'text';
  const canReset = defaultValue !== undefined && defaultValue !== value;
  const warning = (type === 'url' || type === 'image') && value && !isLink(String(value))
    ? a.controls.linkWarning
    : null;

  if (type === 'toggle') {
    return (
      <label className={`flex items-start gap-3 cursor-pointer ${compact ? 'pt-5' : 'p-4 bg-white border border-stone-100 rounded-2xl'}`}>
        <input type="checkbox" className="mt-0.5 w-4 h-4 accent-primary" checked={!!value} onChange={e => onChange(e.target.checked)} />
        <span>
          <span className="block text-xs font-bold text-stone-700 uppercase tracking-widest">{def.label}</span>
          {def.hint && <span className="block text-[11px] text-stone-400 mt-1">{def.hint}</span>}
        </span>
      </label>
    );
  }

  let control: React.ReactNode;
  if (type === 'textarea') {
    control = <textarea className="admin-input" rows={3} placeholder={def.placeholder} value={value ?? ''} onChange={e => onChange(e.target.value)} />;
  } else if (type === 'color') {
    control = (
      <div className="flex gap-2">
        <input type="color" className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 flex-none" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'} onChange={e => onChange(e.target.value)} aria-label={def.label} />
        <input type="text" className="admin-input flex-1 uppercase font-mono" value={value ?? ''} onChange={e => onChange(e.target.value.trim())} />
      </div>
    );
  } else if (type === 'image') {
    control = (
      <div className="flex gap-3 items-start">
        <Thumb src={value} />
        <input className="admin-input flex-1 min-w-0" placeholder={def.placeholder || 'https://…/foto.jpg'} value={value ?? ''} onChange={e => onChange(e.target.value.trim())} />
      </div>
    );
  } else if (type === 'range') {
    control = (
      <div className="flex items-center gap-3 h-10">
        <input type="range" min="0" max="1" step="0.05" className="flex-1 accent-primary h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer" value={value ?? 0} onChange={e => onChange(parseFloat(e.target.value))} />
        <span className="text-xs font-bold text-stone-500 w-10 text-right">{Math.round((value ?? 0) * 100)}%</span>
      </div>
    );
  } else if (type === 'select') {
    control = (
      <select className="admin-input" value={value ?? ''} onChange={e => onChange(e.target.value)}>
        {(def.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else if (type === 'time') {
    // Stored as "07:30 PM"; anything unparseable stays editable as plain text
    const t24 = to24h(value);
    control = t24 || !value
      ? <input type="time" className="admin-input" value={t24} onChange={e => e.target.value && onChange(to12h(e.target.value, true))} />
      : <input className="admin-input" value={value} placeholder="07:30 PM" onChange={e => onChange(e.target.value)} />;
  } else {
    control = <input className="admin-input" placeholder={def.placeholder} value={value ?? ''} onChange={e => onChange(type === 'url' ? e.target.value.trim() : e.target.value)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <label className={LABEL_CLASS}>{def.label}</label>
        {canReset && (
          <button type="button" onClick={() => onChange(defaultValue)} className="text-[10px] font-bold text-stone-400 hover:text-primary uppercase tracking-widest" title={a.controls.resetTitle}>
            {a.controls.reset}
          </button>
        )}
      </div>
      {control}
      {warning
        ? <p className="text-[10px] text-amber-600 mt-1">{warning}</p>
        : def.hint && !compact && <p className="text-[10px] text-stone-400 mt-1 italic">{def.hint}</p>}
    </div>
  );
};

// --- list editor ------------------------------------------------------------

const SPAN: Record<number, string> = {
  1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6',
  7: 'md:col-span-7', 8: 'md:col-span-8', 9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12'
};

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

interface ListEditorProps {
  def: ListDef;
  items: any[];
  onChange: (items: any[]) => void;
  /** When set, translatable columns edit that language's copy (item.i18n.<lang>.<key>) */
  lang?: string;
}

export const ListEditor: React.FC<ListEditorProps> = ({ def, items, onChange, lang }) => {
  const { a } = useAdminI18n();
  // In another content language the base wording is shown as the placeholder: leaving a field empty keeps it
  const columnFor = (col: FieldDef, item: any): FieldDef =>
    lang && col.translatable ? { ...col, path: `i18n.${lang}.${col.path}`, placeholder: item[col.path] || col.placeholder } : col;

  const update = (idx: number, key: string, value: any) => {
    const next = [...items];
    const item = setPath(next[idx], key, value);
    next[idx] = def.derive ? def.derive(item) : item;
    onChange(next);
  };
  const move = (idx: number, by: number) => {
    const target = idx + by;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-stone-400 italic">{def.emptyText}</p>}
      {items.map((item, idx) => (
        <div key={item.id ?? idx} className="p-4 bg-white border border-stone-100 rounded-2xl flex items-start gap-3">
          {def.reorder && (
            <div className="flex flex-col gap-1 pt-5">
              <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label={a.controls.moveUp} className="text-stone-300 hover:text-primary disabled:opacity-30 px-1 leading-none">▲</button>
              <button type="button" onClick={() => move(idx, 1)} disabled={idx === items.length - 1} aria-label={a.controls.moveDown} className="text-stone-300 hover:text-primary disabled:opacity-30 px-1 leading-none">▼</button>
            </div>
          )}
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-3">
            {def.columns.map(base => {
              const col = columnFor(base, item);
              return (
                <div key={col.path} className={SPAN[col.span || 12]}>
                  <Field compact def={col} value={getPath(item, col.path)} onChange={v => update(idx, col.path, v)} />
                </div>
              );
            })}
          </div>
          <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} aria-label={a.controls.remove} className="text-red-300 p-2 mt-4 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
            <TrashIcon />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, def.newItem()])} className="w-full py-3 border border-dashed border-stone-300 text-stone-500 rounded-2xl text-[10px] font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-all">
        + {def.addLabel}
      </button>
    </div>
  );
};
