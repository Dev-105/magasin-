import { useMusic } from '../contexts/MusicContext';
import { useRef, useState } from 'react';

const MusicControl = () => {
  const { isMusicEnabled, isPlaying, toggleMusic, setCustomMusic, clearCustomMusic, enableMusic } = useMusic();
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState(localStorage.getItem('musicFileName') || '');

  if (!isMusicEnabled) return null;

  const handlePick = () => {
    fileRef.current?.click();
  };

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      await setCustomMusic(f);
      setFileName(f.name || 'custom');
      // try to start playback immediately (may be blocked); if blocked user can press Play
      try {
        await enableMusic();
      } catch (playErr) {
        console.warn('Playback after file set blocked', playErr);
        alert('Custom music saved. Click Play to start.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to set custom music');
    }
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFile} />

      {/* File picker button */}
      <button
        onClick={handlePick}
        className="fixed bottom-20 right-6 z-50 w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 shadow-md flex items-center justify-center hover:scale-105 transition-all duration-200"
        title="Choose music file"
      >
        <i className="bi bi-music-note-list text-white"></i>
      </button>

      {/* Clear custom music button */}
      <button
        onClick={() => { clearCustomMusic(); setFileName(''); }}
        className="fixed bottom-20 right-20 z-50 w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 shadow-md flex items-center justify-center hover:scale-105 transition-all duration-200"
        title="Clear custom music"
      >
        <i className="bi bi-x-lg text-white"></i>
      </button>

      {/* Main play/pause button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-zinc-900/90 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 group"
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} text-white text-xl group-hover:scale-110 transition-transform`}></i>
        {isPlaying && (
          <span className="absolute inset-0 rounded-full animate-ping-ring"></span>
        )}
      </button>
    </>
  );
};

export default MusicControl;