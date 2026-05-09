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
    //   alert('Failed to set custom music');
    }
    setLoading(false);
  };

  const handleSetYouTube = async () => {
    if (!ytInput) {
    //   alert('Paste a YouTube URL first');
      return;
    }
    setLoading(true);
    try {
      await setYouTubeUrl(ytInput);
      setShowChooser(false);
      setYtInput('');
    } catch (e) {
      console.error(e);
    //   alert('Failed to play YouTube. Make sure the URL is valid.');
    }
    setLoading(false);
  };

  const handleClearSource = () => {
    clearCustomMusic();
    clearYouTubeUrl();
    setFileName('');
    setYtInput('');
    // alert('Music reset to default track');
  };

  const getSourceLabel = () => {
    if (sourceType === 'youtube') return 'YouTube Music';
    if (sourceType === 'file') return fileName || 'Custom File';
    return 'Default Track';
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFile} />

      {/* Main Play/Pause Button */}
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

      {/* Music Source Button */}
      <button
        onClick={() => setShowChooser(!showChooser)}
        className="fixed bottom-20 right-6 z-50 w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 shadow-md flex items-center justify-center hover:scale-105 transition-all duration-200"
        title="Change music source"
      >
        <i className="bi bi-music-note text-white"></i>
      </button>

      {/* Clear Source Button */}
      <button
        onClick={handleClearSource}
        className="fixed bottom-20 right-20 z-50 w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 shadow-md flex items-center justify-center hover:scale-105 transition-all duration-200"
        title="Reset to default music"
      >
        <i className="bi bi-arrow-repeat text-white"></i>
      </button>

      {/* Music Chooser Panel */}
      {showChooser && (
        <div className="fixed bottom-36 right-6 z-50 w-80 p-4 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="text-white text-sm font-medium mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <i className="bi bi-music-note-beamed"></i>
              Music Source
            </span>
            <span className="text-xs text-gray-400">{getSourceLabel()}</span>
          </div>
          
          {/* File Upload */}
          <button
            onClick={handlePick}
            disabled={loading}
            className="w-full mb-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50"
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
              className="flex-1 bg-zinc-800 rounded-xl px-3 py-2 text-white text-sm outline-none border border-white/10 focus:border-white/30"
            />
            <button
              onClick={handleSetYouTube}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-600 transition-colors text-white text-sm disabled:opacity-50"
            >
              {loading ? <i className="bi bi-arrow-repeat animate-spin"></i> : 'Play'}
            </button>
          </div>
          
          {/* Info Text */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-gray-400 flex items-center gap-1">
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