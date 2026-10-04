
// Walimah Design System primitives (ported from the design project's component bundle).
import React, { useEffect, useId, useState } from 'react';
import { useI18n } from '../i18n';

type Style = React.CSSProperties;

// --- Icon -------------------------------------------------------------------

const LUCIDE = 'https://unpkg.com/lucide-static@0.344.0/icons/';
const SIMPLE = 'https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  label?: string;
  style?: Style;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, color = 'currentColor', label, style }) => {
  const src = name.indexOf('si:') === 0 ? SIMPLE + name.slice(3) + '.svg' : LUCIDE + name + '.svg';
  const mask = `url(${src}) center / contain no-repeat`;
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ display: 'inline-block', flex: 'none', width: size, height: size, backgroundColor: color, WebkitMask: mask, mask, ...style }}
    />
  );
};

// --- Button -----------------------------------------------------------------

const BUTTON_SIZES = {
  sm: { padding: '9px 24px', fontSize: 'var(--label-sm)' },
  md: { padding: '12px 30px', fontSize: 'var(--label-md)' },
  lg: { padding: '15px 38px', fontSize: 'var(--label-lg)' }
};

interface ButtonProps {
  variant?: 'outline' | 'solid' | 'ghost';
  size?: keyof typeof BUTTON_SIZES;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: Style;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'outline', size = 'md', disabled = false, fullWidth = false, href, target, rel, type = 'button', onClick, children, style
}) => {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const h = hover && !disabled;
  const base: Style = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    boxSizing: 'border-box',
    fontFamily: 'var(--font-label)',
    fontWeight: 'var(--weight-label)' as any,
    textTransform: 'uppercase',
    letterSpacing: '.2em',
    lineHeight: 1.2,
    textDecoration: 'none',
    borderRadius: 0,
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background-color var(--dur-base) var(--ease-editorial), color var(--dur-base) var(--ease-editorial), border-color var(--dur-base) var(--ease-editorial)',
    outline: focus ? '1px solid var(--focus-ring)' : 'none',
    outlineOffset: 4,
    opacity: disabled ? 0.4 : 1,
    ...BUTTON_SIZES[size]
  };
  const variants: Record<string, Style> = {
    outline: {
      background: h ? 'color-mix(in srgb,var(--cream-100) 10%,transparent)' : 'transparent',
      color: h ? 'var(--text-highlight)' : 'var(--text-primary)',
      border: '1px solid ' + (h ? 'var(--cream-100)' : 'var(--line-strong)')
    },
    solid: {
      background: h ? 'var(--cream-50)' : 'var(--champagne-200)',
      color: 'var(--brown-950)',
      border: '1px solid var(--champagne-200)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: h ? 'var(--text-highlight)' : 'var(--text-secondary)',
      border: '1px solid transparent',
      paddingLeft: 0,
      paddingRight: 0,
      backgroundImage: 'linear-gradient(currentColor,currentColor)',
      backgroundSize: (h ? '100%' : '24px') + ' 1px',
      backgroundPosition: '0 100%',
      backgroundRepeat: 'no-repeat',
      transition: 'background-size var(--dur-base) var(--ease-editorial), color var(--dur-base) var(--ease-editorial)'
    }
  };
  const props = {
    style: { ...base, ...variants[variant], ...style },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onClick: disabled ? undefined : onClick
  };
  if (href && !disabled) return <a href={href} target={target} rel={rel} {...props}>{children}</a>;
  return <button type={type} disabled={disabled} {...props}>{children}</button>;
};

// --- Eyebrow ----------------------------------------------------------------

const TONES = {
  muted: 'var(--text-muted)',
  secondary: 'var(--text-secondary)',
  accent: 'var(--text-accent)',
  primary: 'var(--text-primary)'
};
const LABEL_SIZES = { xs: 'var(--label-xs)', sm: 'var(--label-sm)', md: 'var(--label-md)', lg: 'var(--label-lg)' };

interface EyebrowProps {
  children?: React.ReactNode;
  tone?: keyof typeof TONES;
  size?: keyof typeof LABEL_SIZES;
  wide?: boolean;
  rule?: 'none' | 'left' | 'center';
  style?: Style;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ children, tone = 'secondary', size = 'sm', wide = false, rule = 'none', style }) => {
  const text = (
    <div
      style={{
        margin: 0,
        fontFamily: 'var(--font-label)',
        fontWeight: 'var(--weight-label)' as any,
        textTransform: 'uppercase',
        fontSize: LABEL_SIZES[size],
        letterSpacing: wide ? 'var(--tracking-label-wide)' : 'var(--tracking-label)',
        lineHeight: 1.6,
        color: TONES[tone],
        ...(rule === 'none' ? style : null)
      }}
    >
      {children}
    </div>
  );
  if (rule === 'none') return text;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: rule === 'center' ? 'center' : 'flex-start', gap: 12, ...style }}>
      {text}
      <span aria-hidden="true" style={{ display: 'block', width: rule === 'center' ? 96 : 32, height: 1, background: 'var(--line-accent)' }} />
    </div>
  );
};

// --- OrnamentDivider --------------------------------------------------------

interface OrnamentDividerProps {
  glyph?: string;
  width?: number;
  tone?: 'accent' | 'soft';
  style?: Style;
}

export const OrnamentDivider: React.FC<OrnamentDividerProps> = ({ glyph = '⚘︎', width = 240, tone = 'accent', style }) => {
  const line = tone === 'accent' ? 'var(--line-accent)' : 'var(--line-soft)';
  const ink = tone === 'accent' ? 'var(--ornament)' : 'var(--text-muted)';
  return (
    <div role="separator" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 12, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg,transparent,${line} 30%)` }} />
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1, color: ink }}>{glyph}</span>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${line} 70%,transparent)` }} />
    </div>
  );
};

// --- SectionTitle -----------------------------------------------------------

const SCRIPT_SIZES = { sm: 'var(--script-sm)', md: 'var(--script-md)', lg: 'var(--script-lg)', xl: 'var(--script-xl)' };

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  size?: keyof typeof SCRIPT_SIZES;
  rule?: boolean;
  /** Phone layout: smaller script and tighter spacing */
  compact?: boolean;
  style?: Style;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ eyebrow, title, subtitle, align = 'center', size = 'lg', rule = true, compact = false, style }) => {
  const center = align === 'center';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: center ? 'center' : 'flex-start', textAlign: align, gap: compact ? 10 : 20, ...style }}>
      {eyebrow && <Eyebrow rule={rule ? (center ? 'center' : 'left') : 'none'}>{eyebrow}</Eyebrow>}
      <h2 style={{ margin: compact ? '4px 0 0' : '8px 0 0', fontFamily: 'var(--font-script)', fontWeight: 400, fontSize: compact ? 'clamp(34px,10.5vw,48px)' : SCRIPT_SIZES[size], lineHeight: 'var(--leading-script)', color: 'var(--text-primary)' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: 0, maxWidth: 'var(--measure)', fontFamily: 'var(--font-serif)', fontSize: compact ? 16 : 'var(--serif-body)', lineHeight: compact ? 1.45 : 1.6, color: 'var(--text-primary)', textWrap: 'pretty' } as Style}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

// --- PhotoFrame -------------------------------------------------------------

const GRADES = { cinematic: 'var(--photo-filter)', soft: 'var(--photo-filter-soft)', none: 'none' };
const SCRIMS = { none: null, 'top-bottom': 'var(--photo-scrim)', side: 'var(--photo-scrim-side)', vignette: 'var(--photo-vignette)' };

interface PhotoFrameProps {
  src?: string;
  alt?: string;
  aspect?: string;
  fill?: boolean;
  grade?: keyof typeof GRADES;
  scrim?: keyof typeof SCRIMS;
  grain?: boolean;
  position?: string;
  style?: Style;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  src, alt = '', aspect = '4 / 5', fill = false, grade = 'cinematic', scrim = 'none', grain = true, position = 'center', style
}) => {
  const wrap: Style = fill ? { position: 'absolute', inset: 0 } : { position: 'relative', width: '100%', aspectRatio: aspect };
  return (
    <div style={{ ...wrap, overflow: 'hidden', background: 'var(--brown-850)', ...style }}>
      {src ? (
        <img src={src} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', objectPosition: position, filter: GRADES[grade] }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 55% 40%, var(--brown-600) 0%, var(--brown-800) 50%, var(--brown-950) 100%)' }} />
      )}
      {SCRIMS[scrim] && <div style={{ position: 'absolute', inset: 0, background: SCRIMS[scrim]!, pointerEvents: 'none' }} />}
      {grain && <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--grain)', opacity: 'var(--grain-opacity)', mixBlendMode: 'overlay', pointerEvents: 'none' }} />}
    </div>
  );
};

// --- DetailGrid -------------------------------------------------------------

export interface DetailItem {
  icon?: string;
  label: string;
  primary: string;
  secondary?: string;
}

export const DetailGrid: React.FC<{ items: DetailItem[]; stacked?: boolean; compact?: boolean; style?: Style }> = ({ items, stacked = false, compact = false, style }) => {
  const caps: Style = { fontFamily: 'var(--font-serif)', textTransform: 'uppercase', color: 'var(--text-primary)' };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : `repeat(${items.length}, minmax(0,1fr))`, width: '100%', ...style }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 6,
            padding: stacked ? '28px 0' : compact ? '2px 8px' : '4px 28px',
            borderLeft: !stacked && i > 0 ? '1px solid var(--line-soft)' : 'none',
            borderTop: stacked && i > 0 ? 'var(--border-hairline)' : 'none'
          }}
        >
          {it.icon && <span style={{ color: 'var(--text-primary)', marginBottom: compact ? 4 : 12, display: 'flex' }}><Icon name={it.icon} size={18} /></span>}
          <div style={{ ...caps, fontWeight: 500, fontSize: 'var(--label-xs)', letterSpacing: 'var(--tracking-label)', color: 'var(--text-secondary)' }}>{it.label}</div>
          <div style={{ ...caps, fontWeight: 400, fontSize: compact ? 12 : 15, letterSpacing: compact ? '.06em' : '.12em', lineHeight: compact ? 1.35 : 1.5, overflowWrap: 'anywhere' }}>{it.primary}</div>
          {it.secondary && (
            <div style={{ ...caps, fontWeight: 500, fontSize: 'var(--label-xs)', letterSpacing: '.16em', lineHeight: 1.7, color: 'var(--text-secondary)', textWrap: 'pretty' } as Style}>{it.secondary}</div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- Dialog -----------------------------------------------------------------

interface DialogProps {
  open: boolean;
  onClose?: () => void;
  eyebrow?: string;
  title?: string;
  width?: number;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onClose, eyebrow, title, width = 560, children }) => {
  const { t } = useI18n();
  const [shown, setShown] = useState(open);
  // Mount transparent first so the fade-in transition has something to run from.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShown(true);
      const r = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
    const t = setTimeout(() => setShown(false), 480);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);

  if (!shown) return null;
  return (
    <div
      onClick={onClose}
      data-lenis-prevent
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 55,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'var(--bg-overlay)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        overscrollBehavior: 'contain',
        opacity: visible ? 1 : 0,
        transition: 'opacity var(--dur-base) var(--ease-editorial)'
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: width,
          maxHeight: '100%',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--gold-500) transparent',
          padding: '64px clamp(28px,6vw,64px) 56px',
          background: 'var(--bg-page)',
          border: 'var(--border-hairline)',
          outline: '1px solid var(--line-hairline)',
          outlineOffset: -10,
          transform: visible ? 'none' : 'translateY(12px)',
          transition: 'transform var(--dur-slow) var(--ease-out-soft)'
        }}
      >
        {onClose && (
          <button
            aria-label={t.dialog.close}
            onClick={onClose}
            style={{ position: 'absolute', top: 18, right: 18, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 0, color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <Icon name="x" size={18} />
          </button>
        )}
        {(eyebrow || title) && (
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            {eyebrow && <Eyebrow style={{ marginBottom: 12 }}>{eyebrow}</Eyebrow>}
            {title && <h3 style={{ margin: 0, fontFamily: 'var(--font-script)', fontWeight: 400, fontSize: 'var(--script-md)', lineHeight: 1.05, color: 'var(--text-primary)' }}>{title}</h3>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// --- Form fields ------------------------------------------------------------

const FIELD_LABEL: Style = {
  display: 'block',
  padding: 0,
  marginBottom: 10,
  fontFamily: 'var(--font-label)',
  fontSize: 'var(--label-xs)',
  letterSpacing: 'var(--tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)'
};

interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  error?: string | null;
  disabled?: boolean;
  style?: Style;
}

export const TextField: React.FC<TextFieldProps> = ({
  label, value, onChange, placeholder, type = 'text', multiline = false, rows = 3, hint, error, disabled = false, style
}) => {
  const [focus, setFocus] = useState(false);
  const id = useId();
  const Tag: any = multiline ? 'textarea' : 'input';
  const color = error ? 'var(--text-error)' : focus ? 'var(--line-strong)' : 'var(--line-soft)';
  return (
    <div style={{ width: '100%', opacity: disabled ? 0.45 : 1, ...style }}>
      {label && <label htmlFor={id} style={FIELD_LABEL}>{label}</label>}
      <Tag
        id={id}
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          display: 'block',
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 0 12px',
          background: 'transparent',
          border: 0,
          borderBottom: '1px solid ' + color,
          borderRadius: 0,
          outline: 'none',
          boxShadow: 'none',
          resize: 'none',
          fontFamily: 'var(--font-serif)',
          fontSize: 20,
          fontWeight: 300,
          lineHeight: 1.4,
          color: 'var(--text-primary)',
          caretColor: 'var(--gold-400)',
          transition: 'border-color var(--dur-base) var(--ease-editorial)'
        }}
      />
      {(error || hint) && (
        <div style={{ marginTop: 8, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'var(--serif-small)', color: error ? 'var(--text-error)' : 'var(--text-muted)' }}>
          {error || hint}
        </div>
      )}
    </div>
  );
};

export interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  style?: Style;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, options, value, onChange, disabled = false, style }) => {
  const [focus, setFocus] = useState(false);
  const id = useId();
  return (
    <div style={{ width: '100%', opacity: disabled ? 0.45 : 1, ...style }}>
      {label && <label htmlFor={id} style={FIELD_LABEL}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            display: 'block',
            width: '100%',
            padding: '10px 28px 12px 0',
            background: 'transparent',
            border: 0,
            borderBottom: '1px solid ' + (focus ? 'var(--line-strong)' : 'var(--line-soft)'),
            borderRadius: 0,
            outline: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-serif)',
            fontSize: 20,
            fontWeight: 300,
            color: 'var(--text-primary)'
          }}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} style={{ background: 'var(--brown-900)', color: 'var(--cream-100)' }}>{o.label}</option>
          ))}
        </select>
        <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
          <Icon name="chevron-down" size={14} />
        </span>
      </div>
    </div>
  );
};

const Choice: React.FC<{ opt: Option; checked: boolean; name: string; disabled?: boolean; onSelect: (v: string) => void }> = ({ opt, checked, name, disabled, onSelect }) => {
  const [h, setH] = useState(false);
  return (
    <label onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', minHeight: 44 }}>
      <input
        type="radio"
        name={name}
        value={opt.value}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(opt.value)}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
      />
      <span
        aria-hidden="true"
        style={{
          width: 16,
          height: 16,
          boxSizing: 'border-box',
          border: '1px solid ' + (checked || h ? 'var(--line-strong)' : 'var(--line-soft)'),
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
          transition: 'border-color var(--dur-fast)'
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-400)', opacity: checked ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-editorial)' }} />
      </span>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 300, color: checked ? 'var(--text-highlight)' : 'var(--text-secondary)', transition: 'color var(--dur-fast)' }}>
        {opt.label}
      </span>
    </label>
  );
};

interface RadioGroupProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  direction?: 'row' | 'column';
  disabled?: boolean;
  style?: Style;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange, direction = 'row', disabled, style }) => {
  const name = useId();
  return (
    <fieldset style={{ margin: 0, padding: 0, border: 0, minWidth: 0, ...style }}>
      {label && <legend style={FIELD_LABEL}>{label}</legend>}
      <div style={{ display: 'flex', flexDirection: direction, flexWrap: 'wrap', gap: direction === 'row' ? 40 : 4 }}>
        {options.map(o => <Choice key={o.value} opt={o} name={name} checked={value === o.value} disabled={disabled} onSelect={onChange} />)}
      </div>
    </fieldset>
  );
};

// --- Monogram / Footer / NavBar ---------------------------------------------

export const Monogram: React.FC<{ initials: [string, string]; size?: number; style?: Style }> = ({ initials, size = 12, style }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: 'var(--font-serif)',
      fontWeight: 500,
      fontSize: size,
      letterSpacing: 'var(--tracking-monogram)',
      textTransform: 'uppercase',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      marginRight: '-.42em',
      ...style
    }}
  >
    {initials[0]} &amp; {initials[1]}
  </span>
);

interface FooterProps {
  quote?: string;
  attribution?: string;
  initials: [string, string];
  transparent?: boolean;
  style?: Style;
}

export const Footer: React.FC<FooterProps> = ({ quote, attribution, initials, transparent = false, style }) => (
  <footer
    style={{
      position: 'relative',
      boxSizing: 'border-box',
      width: '100%',
      padding: 'var(--space-10) var(--page-gutter) var(--space-9)',
      background: transparent ? 'transparent' : 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      ...style
    }}
  >
    {quote && (
      <figure style={{ margin: '0 0 56px', maxWidth: 'var(--measure-wide)' }}>
        <blockquote style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 'var(--serif-lead)', lineHeight: 1.5, color: 'var(--text-primary)', textWrap: 'pretty' } as Style}>
          {'“'}{quote}{'”'}
        </blockquote>
        {attribution && (
          <figcaption style={{ marginTop: 10, fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 'var(--label-sm)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            {'—'} {attribution} {'—'}
          </figcaption>
        )}
      </figure>
    )}
    <Monogram initials={initials} />
    <span aria-hidden="true" style={{ display: 'block', width: 140, height: 1, marginTop: 14, background: 'var(--line-accent)' }} />
  </footer>
);

export interface NavItem {
  label: string;
  href: string;
}

const NavLink: React.FC<{ item: NavItem; onNavigate: (item: NavItem) => void; large?: boolean }> = ({ item, onNavigate, large }) => {
  const [h, setH] = useState(false);
  return (
    <a
      href={item.href}
      onClick={e => {
        e.preventDefault();
        onNavigate(item);
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: large ? 30 : 'var(--label-sm)',
        fontWeight: large ? 300 : 500,
        letterSpacing: large ? '.02em' : 'var(--tracking-nav)',
        textTransform: large ? 'none' : 'uppercase',
        textDecoration: 'none',
        color: h ? 'var(--text-highlight)' : 'var(--text-primary)',
        opacity: h ? 1 : 0.85,
        transition: 'color var(--dur-fast) var(--ease-editorial), opacity var(--dur-fast)',
        whiteSpace: 'nowrap'
      }}
    >
      {item.label}
    </a>
  );
};

interface NavBarProps {
  left: NavItem[];
  right: NavItem[];
  initials: [string, string];
  emblem?: React.ReactNode;
  mobile: boolean;
  onNavigate: (item: NavItem) => void;
}

/** Transparent, non-fixed nav. On mobile the menu overlay fills the nearest positioned ancestor (the hero). */
export const NavBar: React.FC<NavBarProps> = ({ left, right, initials, emblem, mobile, onNavigate }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const go = (item: NavItem) => {
    setOpen(false);
    onNavigate(item);
  };
  const bar: Style = { position: 'relative', zIndex: 2, boxSizing: 'border-box', width: '100%', padding: '0 var(--page-gutter)', background: 'transparent' };

  if (!mobile) {
    return (
      <nav style={{ ...bar, height: 'var(--nav-height)', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 48 }}>
          {left.map(it => <NavLink key={it.label} item={it} onNavigate={go} />)}
        </div>
        <a
          href="#home"
          onClick={e => {
            e.preventDefault();
            go({ label: 'Home', href: '#home' });
          }}
          style={{ textDecoration: 'none', display: 'flex', padding: '0 24px' }}
        >
          {emblem || <Monogram initials={initials} />}
        </a>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 48 }}>
          {right.map(it => <NavLink key={it.label} item={it} onNavigate={go} />)}
        </div>
      </nav>
    );
  }

  const line: Style = { display: 'block', width: 20, height: 1, background: 'var(--text-primary)', transition: 'transform var(--dur-base) var(--ease-editorial), opacity var(--dur-fast)' };
  return (
    <>
      <nav style={{ ...bar, height: 'var(--nav-height-mobile)', display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center' }}>
        <span />
        <span style={{ justifySelf: 'center', position: 'relative', zIndex: 3 }}>
          <Monogram initials={initials} size={11} />
        </span>
        <button
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          style={{ position: 'relative', zIndex: 3, width: 44, height: 44, padding: 12, background: 'none', border: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 5 }}
        >
          <span style={{ ...line, transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
          <span style={{ ...line, opacity: open ? 0 : 1 }} />
          <span style={{ ...line, transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--dur-base) var(--ease-editorial), visibility var(--dur-base)'
        }}
      >
        {[...left, ...right].map(it => <NavLink key={it.label} item={it} onNavigate={go} large />)}
      </div>
    </>
  );
};
