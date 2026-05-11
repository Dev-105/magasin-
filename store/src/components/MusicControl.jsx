// MusicControl.jsx
import { useMusic } from '../contexts/MusicContext';
import { useRef, useState } from 'react';

const MusicControl = () => {
  const { 
    isMusicEnabled, 
    isPlaying, 
    toggleMusic, 
    setCustomMusic, 
    clearCustomMusic, 
    setYouTubeUrl,
    clearYouTubeUrl,
    youtubeUrl,
    sourceType
  } = useMusic();
  
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState(localStorage.getItem('musicFileName') || '');
  const [showChooser, setShowChooser] = useState(false);
  const [ytInput, setYtInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isMusicEnabled) return null;

  const handlePick = () => {
    fileRef.current?.click();
  };

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLoading(true);
    try {
      await setCustomMusic(f);
      setFileName(f.name || 'custom');
      setShowChooser(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSetYouTube = async () => {
    if (!ytInput) return;
    setLoading(true);
    try {
      await setYouTubeUrl(ytInput);
      setShowChooser(false);
      setYtInput('');
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleClearSource = () => {
    clearCustomMusic();
    clearYouTubeUrl();
    setFileName('');
    setYtInput('');
  };

  const getSourceLabel = () => {
    if (sourceType === 'youtube') return 'YouTube Music';
    if (sourceType === 'file') return fileName || 'Custom File';
    return 'Default Track';
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFile} />

      {/* Main Play/Pause Button - Gold Royal */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-black to-[#0a0a0a] backdrop-blur-md border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/30 flex items-center justify-center hover:scale-110 transition-all duration-300 group"
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} text-[#D4AF37] text-2xl group-hover:scale-110 transition-transform`}></i>
        {isPlaying && (
          <span className="absolute inset-0 rounded-full animate-ping bg-[#D4AF37]/20"></span>
        )}
      </button>

      {/* Music Source Button */}
      <button
        onClick={() => setShowChooser(!showChooser)}
        className="fixed bottom-28 right-6 z-50 w-11 h-11 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 shadow-md flex items-center justify-center hover:scale-105 hover:border-[#D4AF37] transition-all duration-300"
        title="Change music source"
      >
        <i className="bi bi-music-note text-[#D4AF37] text-lg"></i>
      </button>

      {/* Clear Source Button */}
      <button
        onClick={handleClearSource}
        className="fixed bottom-28 right-20 z-50 w-11 h-11 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 shadow-md flex items-center justify-center hover:scale-105 hover:border-[#D4AF37] transition-all duration-300"
        title="Reset to default music"
      >
        <i className="bi bi-arrow-repeat text-[#D4AF37] text-lg"></i>
      </button>

      {/* Music Chooser Panel - Glassmorphism Gold */}
      {showChooser && (
        <div className="fixed bottom-44 right-6 z-50 w-80 p-5 rounded-2xl bg-black/90 backdrop-blur-xl border border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/20">
          <div className="text-white text-sm font-bold mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#D4AF37]">
              <i className="bi bi-music-note-beamed"></i>
              Royal Sound
            </span>
            <span className="text-xs text-[#D4AF37]/70">{getSourceLabel()}</span>
          </div>
          
          {/* File Upload - Gold Hover */}
          <button
            onClick={handlePick}
            disabled={loading}
            className="w-full mb-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 hover:from-[#D4AF37]/30 hover:to-[#FFD700]/30 border border-[#D4AF37]/40 transition-all duration-300 text-[#D4AF37] text-sm flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
          >
            <i className="bi bi-upload"></i>
            Upload Local File (MP3)
          </button>
          
          {/* YouTube Input */}
          <div className="flex gap-2 mb-2">
            <input
              value={ytInput}
              onChange={(e) => setYtInput(e.target.value)}
              placeholder="Paste YouTube URL"
              className="flex-1 bg-black/60 rounded-xl px-3 py-2.5 text-white text-sm outline-none border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
            />
            <button
              onClick={handleSetYouTube}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold transition-all duration-300 text-sm disabled:opacity-50 hover:shadow-lg hover:shadow-[#D4AF37]/30 min-h-[44px]"
            >
              {loading ? <i className="bi bi-arrow-repeat animate-spin"></i> : 'Play'}
            </button>
          </div>
          
          {/* Info Text */}
          <div className="mt-3 pt-3 border-t border-[#D4AF37]/20">
            <p className="text-xs text-[#D4AF37]/60 flex items-center gap-1">
              <i className="bi bi-info-circle"></i>
              {sourceType === 'youtube' && `Playing: ${youtubeUrl?.slice(0, 40)}...`}
              {sourceType === 'file' && `Playing: ${fileName}`}
              {sourceType === 'default' && 'Playing: Default background music'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicControl;