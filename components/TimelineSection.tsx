
import React, { useRef } from 'react';
import { WeddingConfig } from '../types';
import { DetailGrid, Eyebrow, OrnamentDivider, PhotoFrame, SectionTitle } from './ui';
import { Reveal, useNarrow, useSmoothList } from './motion';
import { localizedItem, sectionPad, startTime } from './helpers';
import { useI18n, useInvitation } from '../i18n';

interface TimelineSectionProps {
  config: WeddingConfig;
}

// "07:30 PM" -> the reception session once the clock reaches 6 PM
const sessionOf = (time: string) => {
  const m = time.match(/(\d{1,2})(?::\d{2})?\s*(AM|PM)?/i);
  if (!m) return null;
  let hour = parseInt(m[1]) % 12;
  if ((m[2] || '').toUpperCase() === 'PM') hour += 12;
  else if (!m[2]) hour = parseInt(m[1]);
  return hour >= 18 ? 'evening' : 'day';
};

const TimelineSection: React.FC<TimelineSectionProps> = ({ config }) => {
  const narrow = useNarrow();
  const listRef = useRef<HTMLDivElement>(null);
  const listOverflows = useSmoothList(listRef);
  const { t, lang, eventDate } = useI18n();
  const schedule = config.schedule.map(item => localizedItem(item, lang));
  const { timeRange, venueName, venueCity } = config.event;
  const { day, full: fullDateDisplay } = eventDate(config);

  const { photos, text } = useInvitation(config);
  const sessionLabels = { day: text.sessionDay, evening: text.sessionEvening };

  const sessions = schedule.map(item => {
    const session = sessionOf(item.time);
    return session ? sessionLabels[session] : null;
  });
  // Session headings only earn their place when the day actually has two parts
  const showSessions = new Set(sessions.filter(Boolean)).size > 1;

  return (
    <section id="timeline" className="wl-screen-m" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-page)', padding: sectionPad(narrow) }}>
      <div data-parallax="0.12" style={{ position: 'absolute', top: '-15%', bottom: '-15%', right: 0, width: narrow ? '100%' : '30%', opacity: narrow ? 0.3 : 1 }}>
        <PhotoFrame fill src={photos.flowers} grade="none" scrim="side" />
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: narrow ? 20 : 64 }}>
        <Reveal style={{ width: '100%' }}>
          <SectionTitle compact={narrow} eyebrow={t.timeline.eyebrow} title={t.timeline.title} />
        </Reveal>
        <Reveal index={1} style={{ width: '100%' }}>
          <DetailGrid
            compact={narrow}
            items={[
              { icon: 'calendar', label: t.timeline.date, primary: fullDateDisplay, secondary: day },
              { icon: 'clock', label: t.timeline.time, primary: startTime(timeRange), secondary: text.timeNote },
              { icon: 'map-pin', label: t.timeline.venue, primary: venueName, secondary: venueCity }
            ]}
          />
        </Reveal>
        {/* On a short phone a long programme scrolls inside its own frame so the section still fits one screen */}
        <div
          ref={listRef}
          className={narrow ? 'wl-scroll' : undefined}
          {...(listOverflows ? { 'data-lenis-prevent': '' } : {})}
          style={{ width: '100%', maxWidth: 640, ...(narrow ? { maxHeight: 'max(160px, calc(100svh - 362px))', overflowY: 'auto' } : null) }}
        >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {schedule.map((item, index) => {
            // Stagger follows the order of revealed blocks, headings included
            const headingsBefore = showSessions ? sessions.slice(0, index).filter((s, i) => s && s !== sessions[i - 1]).length : 0;
            const order = index + headingsBefore;
            const [clock, period] = item.time.split(' ');
            const heading = showSessions && sessions[index] && sessions[index] !== sessions[index - 1] ? sessions[index] : null;
            return (
              <React.Fragment key={index}>
                {heading && (
                  <Reveal index={order} style={{ padding: narrow ? (index === 0 ? '0 0 10px' : '16px 0 10px') : (index === 0 ? '0 0 24px' : '48px 0 24px'), textAlign: 'center' }}>
                    <Eyebrow tone="accent" rule="center">{heading}</Eyebrow>
                  </Reveal>
                )}
                <Reveal index={heading ? order + 1 : order} style={{ display: 'grid', gridTemplateColumns: narrow ? '84px minmax(0,1fr)' : 'minmax(96px,150px) minmax(0,1fr)', gap: narrow ? 12 : 'clamp(16px,3vw,32px)', padding: narrow ? '8px 0' : '24px 0', borderTop: 'var(--border-hairline)', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: narrow ? 19 : 'clamp(22px,3vw,var(--serif-h3))', lineHeight: 1, color: 'var(--text-accent)', whiteSpace: 'nowrap' }}>
                    {clock}
                    {period && <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 'var(--label-sm)', letterSpacing: '.2em', marginLeft: 6, verticalAlign: '.35em' }}>{period}</span>}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: narrow ? 0 : 4 }}>
                    <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: narrow ? '.16em' : 'var(--tracking-label)', fontSize: narrow ? 'var(--label-md)' : 'var(--label-lg)', color: 'var(--text-primary)' }}>{item.title}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: narrow ? 15 : 'var(--serif-body)', lineHeight: narrow ? 1.35 : undefined, color: 'var(--text-secondary)' }}>{item.description}</span>
                  </div>
                </Reveal>
              </React.Fragment>
            );
          })}
          <div style={{ borderTop: 'var(--border-hairline)' }}></div>
        </div>
        </div>
        {!narrow && <OrnamentDivider width={260} />}
      </div>
    </section>
  );
};

export default TimelineSection;
