// MusicPrompt.jsx
import { useMusic } from '../contexts/MusicContext';

const MusicPrompt = () => {
  const { showMusicPrompt, enableMusic, disableMusic } = useMusic();

  if (!showMusicPrompt) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      
      {/* Modal - Royal Gold */}
      <div className="relative bg-gradient-to-br from-black to-[#0a0a0a] backdrop-blur-xl rounded-2xl border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/30 max-w-md w-full p-6 md:p-8 animate-fade-in-up">
        <div className="text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center mb-5 shadow-xl shadow-[#D4AF37]/30">
            <i className="bi bi-crown-fill text-black text-4xl"></i>
          </div>
          
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mb-2">
            Royal Experience
          </h3>
          <p className="text-gray-300 text-sm mb-6">
            Enhance your luxury shopping journey with our curated ambient soundtrack.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={enableMusic}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 min-h-[44px]"
            >
              <i className="bi bi-music-note mr-2"></i>
              Yes, Play Music
            </button>
            <button
              onClick={disableMusic}
              className="flex-1 bg-black/60 text-[#D4AF37] py-3 rounded-xl font-bold hover:bg-black/80 transition-all duration-300 border border-[#D4AF37]/40 min-h-[44px]"
            >
              <i className="bi bi-x-lg mr-2"></i>
              No Thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPrompt;