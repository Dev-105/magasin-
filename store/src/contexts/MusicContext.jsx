import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const MusicContext = createContext(null);

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeUrl, setYoutubeUrlState] = useState(null);
  const [sourceType, setSourceType] = useState('default'); // 'default', 'file', 'youtube'
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const [ytApiReady, setYtApiReady] = useState(false);

  // Save source to localStorage
  const saveMusicSource = (type, url = null) => {
    localStorage.setItem('musicSourceType', type);
    if (url) localStorage.setItem('musicSourceUrl', url);
    else localStorage.removeItem('musicSourceUrl');
    setSourceType(type);
  };

  // IndexedDB helpers for storing custom music
  const openDB = () => new Promise((resolve, reject) => {
    const req = indexedDB.open('music-store', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const getStoredBlob = async () => {
    try {
      const db = await openDB();
      return new Promise((res, rej) => {
        const tx = db.transaction('files', 'readonly');
        const store = tx.objectStore('files');
        const r = store.get('custom-music');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    } catch (e) { return null; }
  };

  // Load YouTube API once
  useEffect(() => {
    const loadYouTubeApi = () => {
      if (window.YT && window.YT.Player) {
        setYtApiReady(true);
        return;
      }
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        setYtApiReady(true);
      };
    };
    loadYouTubeApi();
  }, []);

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const playYouTube = async (videoId) => {
    if (!ytApiReady) {
      await new Promise(resolve => {
        const check = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });
    }

    if (playerRef.current && playerRef.current.destroy) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    // Remove existing container
    const existingContainer = document.getElementById('youtube-audio-player');
    if (existingContainer) existingContainer.remove();

    // Create new container
    const container = document.createElement('div');
    container.id = 'youtube-audio-player';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    return new Promise((resolve, reject) => {
      playerRef.current = new YT.Player(container, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          autoplay: 1,
          loop: 1,
          playlist: videoId
        },
        events: {
          onReady: () => {
            resolve();
          },
          onError: (e) => {
            reject(new Error('YouTube player error'));
          },
          onStateChange: (e) => {
            if (e.data === 1) setIsPlaying(true);
            if (e.data === 2) setIsPlaying(false);
            if (e.data === 0) {
              // Restart when ended
              if (playerRef.current) {
                playerRef.current.playVideo();
              }
            }
          }
        }
      });
    });
  };

  const setYouTubeUrl = async (url) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    try {
      // Stop regular audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      await playYouTube(videoId);
      setYoutubeUrlState(url);
      saveMusicSource('youtube', url);
      setIsMusicEnabled(true);
      setIsPlaying(true);
      localStorage.setItem('musicEnabled', 'true');
      setShowMusicPrompt(false);
      return true;
    } catch (error) {
      console.error('YouTube play failed:', error);
      throw error;
    }
  };

  const clearYouTubeUrl = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    const container = document.getElementById('youtube-audio-player');
    if (container) container.remove();
    setYoutubeUrlState(null);
    if (sourceType === 'youtube') {
      saveMusicSource('default');
    }
  };

  // Initialize default audio on mount AND restore saved source
  useEffect(() => {
    const init = async () => {
      const musicPreference = localStorage.getItem('musicEnabled');
      const savedSourceType = localStorage.getItem('musicSourceType');
      const savedYoutubeUrl = localStorage.getItem('musicSourceUrl');

      // Restore YouTube if it was saved
      if (savedSourceType === 'youtube' && savedYoutubeUrl) {
        try {
          await setYouTubeUrl(savedYoutubeUrl);
          setIsMusicEnabled(true);
          setIsPlaying(true);
          setShowMusicPrompt(false);
          return;
        } catch (e) {
          console.warn('Failed to restore YouTube:', e);
        }
      }

      // Restore custom file if exists
      const blob = await getStoredBlob();
      let src = '/car.mp3';
      
      if (blob) {
        const url = URL.createObjectURL(blob);
        src = url;
        saveMusicSource('file');
      } else {
        const storedDataUrl = localStorage.getItem('musicDataUrl');
        if (storedDataUrl) {
          src = storedDataUrl;
          saveMusicSource('file');
        }
      }

      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
      } else {
        audioRef.current.src = src;
      }

      if (musicPreference === null) {
        setShowMusicPrompt(true);
      } else if (musicPreference === 'true') {
        setIsMusicEnabled(true);
        setShowMusicPrompt(false);
        
        if (savedSourceType !== 'youtube') {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            const onFirstClick = () => {
              audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.warn(e));
              document.removeEventListener('click', onFirstClick);
            };
            document.addEventListener('click', onFirstClick, { once: true });
          });
        }
      }
    };
    init();
  }, []);

  const enableMusic = () => {
    setIsMusicEnabled(true);
    localStorage.setItem('musicEnabled', 'true');
    setShowMusicPrompt(false);
    
    if (sourceType === 'youtube' && youtubeUrl) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        playYouTube(videoId).then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio('/car.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.log('Audio play failed:', e));
    }
  };

  const setCustomMusic = async (file) => {
    if (!file) throw new Error('No file provided');
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result;
          
          // Store blob in IndexedDB
          const req = indexedDB.open('music-store', 1);
          req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
          };
          req.onsuccess = () => {
            const db = req.result;
            const tx = db.transaction('files', 'readwrite');
            tx.objectStore('files').put(file, 'custom-music');
            tx.oncomplete = () => db.close();
          };
          
          // Store data URL as fallback
          localStorage.setItem('musicDataUrl', dataUrl);
          localStorage.setItem('musicFileName', file.name || 'custom');

          // Clear YouTube if playing
          if (playerRef.current) {
            clearYouTubeUrl();
          }

          if (!audioRef.current) {
            audioRef.current = new Audio(dataUrl);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
          } else {
            audioRef.current.src = dataUrl;
          }

          saveMusicSource('file');
          setIsMusicEnabled(true);
          localStorage.setItem('musicEnabled', 'true');
          
          // Auto-play
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(console.warn);
          
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const clearCustomMusic = () => {
    localStorage.removeItem('musicDataUrl');
    localStorage.removeItem('musicFileName');
    
    if (playerRef.current) {
      clearYouTubeUrl();
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '/car.mp3';
      audioRef.current.load();
    }
    
    saveMusicSource('default');
    setIsMusicEnabled(false);
    setIsPlaying(false);
  };

  const disableMusic = () => {
    setIsMusicEnabled(false);
    setIsPlaying(false);
    localStorage.setItem('musicEnabled', 'false');
    setShowMusicPrompt(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  const toggleMusic = () => {
    if (!isMusicEnabled) {
      enableMusic();
    } else {
      if (isPlaying) {
        if (playerRef.current) {
          playerRef.current.pauseVideo();
        } else {
          audioRef.current?.pause();
        }
        setIsPlaying(false);
      } else {
        if (playerRef.current) {
          playerRef.current.playVideo();
        } else {
          audioRef.current?.play();
        }
        setIsPlaying(true);
      }
    }
  };

  return (
    <MusicContext.Provider value={{
      isMusicEnabled,
      showMusicPrompt,
      isPlaying,
      youtubeUrl,
      sourceType,
      enableMusic,
      disableMusic,
      toggleMusic,
      setShowMusicPrompt,
      setCustomMusic,
      clearCustomMusic,
      setYouTubeUrl,
      clearYouTubeUrl
    }}>
      {children}
    </MusicContext.Provider>
  );
};