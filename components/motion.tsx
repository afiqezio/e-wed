
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** True when the visitor's device asks for less motion, or the admin switched motion off. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && (
    document.documentElement.dataset.motion === 'off' ||
    (!!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  );

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.8 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
};

export const useNarrow = (max = 820) => {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth <= max);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${max}px)`);
    const f = () => setNarrow(mq.matches);
    f();
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [max]);
  return narrow;
};

/**
 * Drives smooth scrolling (Lenis) and the scroll-linked layers:
 * [data-parallax="<speed>"] photo layers and the [data-hero-fade] hero copy.
 */
export const useInvitationMotion = (scrollEnabled: boolean, motionOn = true) => {
  useEffect(() => {
    if (!motionOn || prefersReducedMotion()) return;
    let raf = 0;
    let lastY = -1;
    let lastVh = -1;
    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y === lastY && vh === lastVh) return;
      lastY = y;
      lastVh = vh;
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
        const r = el.parentElement!.getBoundingClientRect();
        if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return;
        const off = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0,${(-off * parseFloat(el.dataset.parallax || '0')).toFixed(1)}px,0)`;
      });
      const h = document.querySelector<HTMLElement>('[data-hero-fade]');
      if (h && y < vh * 1.2) {
        h.style.transform = `translate3d(0,${(y * 0.35).toFixed(1)}px,0)`;
        h.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)));
      }
    };
    const tick = (t: number) => {
      lenis?.raf(t);
      update();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.querySelectorAll<HTMLElement>('[data-parallax],[data-hero-fade]').forEach(el => {
        el.style.transform = '';
        el.style.opacity = '';
      });
    };
  }, [motionOn]);

  useEffect(() => {
    if (!scrollEnabled || !motionOn || prefersReducedMotion()) return;
    const instance = new Lenis({ duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis = instance;
    return () => {
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, [scrollEnabled, motionOn]);
};

/**
 * Gives an inner scroll list the same eased wheel as the page.
 * Returns whether the list overflows, so the caller only claims the wheel when there is something to scroll.
 */
export const useSmoothList = (ref: React.RefObject<HTMLElement | null>) => {
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    const content = el?.firstElementChild as HTMLElement | null;
    if (!overflowing || !el || !content || prefersReducedMotion()) return;
    const inner = new Lenis({ wrapper: el, content, duration: 1.1, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true, autoRaf: true });
    return () => inner.destroy();
  }, [overflowing]);

  return overflowing;
};

interface RevealProps {
  index?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Slow fade + rise as the block enters the viewport. `index` staggers siblings. */
export const Reveal: React.FC<RevealProps> = ({ index = 0, style, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(prefersReducedMotion);

  useEffect(() => {
    if (shown || !ref.current) return;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setShown(true);
        io.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const delay = (index % 6) * 0.09;
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(40px)',
        transition: `opacity 1.4s cubic-bezier(.22,.61,.36,1) ${delay}s, transform 1.6s cubic-bezier(.16,1,.3,1) ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

/** Gentle vertical bob. */
export const floatStyle = (amp: number, duration = 3.8) =>
  ({ '--float-amp': `${amp}px`, '--float-dur': `${duration}s` } as React.CSSProperties);

/** Drifting gold dust over the hero photograph. */
export const Motes: React.FC<{ count?: number }> = ({ count = 22 }) => {
  const motes = useMemo(() => Array.from({ length: count }, () => {
    const size = 1.5 + Math.random() * 2.5;
    const dur = 16 + Math.random() * 16;
    return {
      left: `${Math.random() * 100}%`,
      width: size,
      height: size,
      filter: `blur(${size > 3 ? 1 : 0.4}px)`,
      '--mote-drift': `${(Math.random() - 0.5) * 160}px`,
      '--mote-dur': `${dur}s`,
      '--mote-delay': `${-Math.random() * dur}s`
    } as React.CSSProperties;
  }), [count]);

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {motes.map((style, i) => <span key={i} className="wl-mote" style={style} />)}
    </div>
  );
};
