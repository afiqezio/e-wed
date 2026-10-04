
import React, { useState, useRef, useEffect } from 'react';
import { WeddingConfig } from '../types';
import { Icon } from './ui';
import { resolveMusic } from './helpers';
import { useI18n } from '../i18n';

interface MusicPlayerProps {
  config: WeddingConfig;
  autoStart?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ config, autoStart }) => {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef(0);
  const { url, volume } = resolveMusic(config);

  const fadeTo = (to: number, ms: number, done?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    const from = audio.volume;
    const t0 = performance.now();
    cancelAnimationFrame(fadeRef.current);
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * p));
      if (p < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  };

  const play = (on: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (on) {
      if (audio.paused) audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        fadeTo(volume, 2500);
      }).catch(() => console.log('Autoplay prevented or waiting for interaction'));
    } else {
      setIsPlaying(false);
      fadeTo(0, 600, () => audio.pause());
    }
  };

  useEffect(() => {
    if (autoStart) play(true);
  }, [autoStart]);

  useEffect(() => () => cancelAnimationFrame(fadeRef.current), []);

  return (
    <>
      <audio ref={audioRef} loop src={url} />
      <button
        className="wl-music"
        onClick={() => play(!isPlaying)}
        aria-label={isPlaying ? t.music.pause : t.music.play}
      >
        <Icon name={isPlaying ? 'volume-2' : 'volume-x'} size={18} />
      </button>
    </>
  );
};

export default MusicPlayer;
