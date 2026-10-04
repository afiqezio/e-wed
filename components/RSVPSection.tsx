
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { WeddingConfig, RSVPData, Wish } from '../types';
import { Button, Dialog, Eyebrow, PhotoFrame, RadioGroup, SelectField, TextField } from './ui';
import { Reveal, floatStyle, useNarrow } from './motion';
import { sectionPad } from './helpers';
import { useI18n, useInvitation } from '../i18n';

interface RSVPSectionProps {
  config: WeddingConfig;
}

const GUEST_COUNTS = [1, 2, 3, 4, 5];

const STAT_VALUE: React.CSSProperties = { fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'var(--serif-h2)', color: 'var(--text-primary)', lineHeight: 1 };

const RSVPSection: React.FC<RSVPSectionProps> = ({ config }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'attending',
    guests: 1,
    message: ''
  });
  const [stats, setStats] = useState({ attending: 0, notAttending: 0, totalGuests: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reply, setReply] = useState<{ name: string; status: string } | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t, formatDate } = useI18n();
  const { photos, text } = useInvitation(config);
  const statusOptions = [
    { value: 'attending', label: t.rsvp.attending },
    { value: 'not_attending', label: t.rsvp.notAttending }
  ];
  const guestOptions = GUEST_COUNTS.map(n => ({ value: String(n), label: t.rsvp.guestOption(n) }));
  const narrow = useNarrow();
  const rsvpDeadline = new Date(config.event.rsvpDeadline);
  const isDeadlinePassed = new Date() > rsvpDeadline;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await storage.getRSVPs();
      const attending = data.filter(d => d.status === 'attending').length;
      const totalGuests = data.reduce((acc, curr) => acc + (curr.status === 'attending' ? curr.guests : 0), 0);
      setStats({ attending, notAttending: 0, totalGuests });
    } catch (e) {
      console.error("Error fetching stats:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeadlinePassed || isSubmitting) return;
    const name = formData.name.trim();
    if (!name) {
      setNameError(t.rsvp.nameRequired);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const newRSVP: RSVPData = {
        id: Date.now().toString(),
        ...formData,
        name,
        status: formData.status as 'attending' | 'not_attending',
        timestamp: Date.now()
      };

      await storage.saveRSVP(newRSVP);

      if (formData.message.trim()) {
        const newWish: Wish = {
          id: `rsvp-${Date.now()}`,
          name,
          message: formData.message.trim(),
          timestamp: Date.now()
        };
        await storage.saveWish(newWish);
      }

      setReply({ name, status: formData.status });
      setDialogOpen(false);
      await fetchStats();
    } catch (error) {
      setSubmitError(t.rsvp.failed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const message = reply
    ? reply.status === 'attending'
      ? t.rsvp.thanksAttending(reply.name)
      : t.rsvp.thanksDeclined(reply.name)
    : isDeadlinePassed
      ? t.rsvp.closed
      : text.rsvpMessage;

  return (
    <section id="rsvp" className="wl-screen-m" style={{ position: 'relative', overflow: 'hidden', padding: narrow ? sectionPad(true) : 'clamp(96px,14vw,192px) var(--page-gutter)', textAlign: 'center' }}>
      <div data-parallax="0.2" style={{ position: 'absolute', top: '-15%', bottom: '-15%', left: 0, right: 0 }}>
        <PhotoFrame fill src={photos.hero} grade="none" scrim="vignette" position="30% 50%" />
      </div>
      <Reveal style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Eyebrow wide>{t.rsvp.eyebrow}</Eyebrow>
        <h2 style={{ margin: '4px 0 20px', fontFamily: 'var(--font-script)', fontWeight: 400, fontSize: 'var(--script-lg)', lineHeight: 1.1, color: 'var(--text-primary)' }}>{t.rsvp.title}</h2>
        <p aria-live="polite" style={{ margin: 0, maxWidth: '34ch', fontFamily: 'var(--font-serif)', fontSize: 'var(--serif-body)', lineHeight: 1.6, color: 'var(--text-primary)', textWrap: 'balance' } as React.CSSProperties}>
          {message}
        </p>
        {!reply && !isDeadlinePassed && (
          <div style={{ marginTop: 36 }}>
            <Button size="lg" onClick={() => setDialogOpen(true)}>{t.rsvp.cta}</Button>
          </div>
        )}
        <div style={{ display: 'flex', marginTop: 48 }}>
          <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, borderRight: 'var(--border-soft)' }}>
            <span style={STAT_VALUE}>{stats.attending}</span>
            <Eyebrow size="xs">{t.rsvp.responses}</Eyebrow>
          </div>
          <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={STAT_VALUE}>{stats.totalGuests}</span>
            <Eyebrow size="xs">{t.rsvp.guests}</Eyebrow>
          </div>
        </div>
        <div style={{ marginTop: 48 }}>
          <Eyebrow size="xs">{t.rsvp.replyBy(formatDate(rsvpDeadline))}</Eyebrow>
        </div>
        <span className="wl-float" style={{ ...floatStyle(5, 5.6), display: 'inline-block', fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--ornament)', marginTop: 4 }}>⚘︎</span>
      </Reveal>

      <Dialog open={dialogOpen} onClose={() => !isSubmitting && setDialogOpen(false)} eyebrow={t.rsvp.eyebrow} title={t.rsvp.title}>
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}>
          <TextField
            label={t.rsvp.name}
            placeholder={t.rsvp.namePlaceholder}
            disabled={isSubmitting}
            value={formData.name}
            onChange={v => {
              setFormData({ ...formData, name: v });
              setNameError(null);
            }}
            error={nameError}
          />
          <RadioGroup
            label={t.rsvp.attendance}
            direction="column"
            disabled={isSubmitting}
            options={statusOptions}
            value={formData.status}
            onChange={v => setFormData({ ...formData, status: v })}
          />
          {formData.status === 'attending' && (
            <SelectField
              label={t.rsvp.guestCount}
              disabled={isSubmitting}
              options={guestOptions}
              value={String(formData.guests)}
              onChange={v => setFormData({ ...formData, guests: parseInt(v) })}
            />
          )}
          <TextField
            label={t.rsvp.message}
            multiline
            rows={2}
            placeholder={t.rsvp.optional}
            disabled={isSubmitting}
            value={formData.message}
            onChange={v => setFormData({ ...formData, message: v })}
            error={submitError}
          />
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? t.rsvp.sending : t.rsvp.submit}
          </Button>
        </form>
      </Dialog>
    </section>
  );
};

export default RSVPSection;
