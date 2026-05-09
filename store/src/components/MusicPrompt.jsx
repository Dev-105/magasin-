import { useMusic } from '../contexts/MusicContext';

const MusicPrompt = () => {
  const { showMusicPrompt, enableMusic, disableMusic } = useMusic();

  if (!showMusicPrompt) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
      
      {/* Modal */}
      <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center mb-4 shadow-lg">
            <i className="bi bi-music-note-beamed text-white text-3xl"></i>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Enhance Your Experience</h3>
          <p className="text-gray-400 text-sm mb-6">
            Would you like to play ambient background music while browsing?
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={enableMusic}
              className="flex-1 bg-white text-zinc-900 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200"
            >
              <i className="bi bi-music-note mr-2"></i>
              Yes, Play Music
            </button>
            <button
              onClick={disableMusic}
              className="flex-1 bg-zinc-800 text-white py-2.5 rounded-xl font-medium hover:bg-zinc-700 transition-all duration-200 border border-white/10"
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