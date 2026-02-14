
import React, { useState, useRef, useEffect } from 'react';
import { WeddingConfig } from '../types';

interface MusicPlayerProps {
  config: WeddingConfig;
  autoStart?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ config, autoStart }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { url, volume } = config.music;

  useEffect(() => {
    if (autoStart && audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.log('Autoplay prevented or waiting for interaction'));
    }
  }, [autoStart, volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio error'));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-50 transition-all duration-500">
      <audio 
        ref={audioRef}
        loop
        src={url} 
      />
      
      <button 
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 transform hover:scale-110 active:scale-95 ${isPlaying ? 'bg-primary text-white' : 'bg-white text-primary'}`}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
        
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full rounded-full border-4 border-primary animate-ping opacity-20"></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
