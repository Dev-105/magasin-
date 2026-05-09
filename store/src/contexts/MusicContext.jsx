import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const MusicContext = createContext(null);

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if user has already chosen and initialize audio
    const musicPreference = localStorage.getItem('musicEnabled');

    // IndexedDB helpers
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

    const init = async () => {
      const blob = await getStoredBlob();
      let src = '/car.mp3';
      if (blob) {
        const url = URL.createObjectURL(blob);
        src = url;
      } else {
        const storedDataUrl = localStorage.getItem('musicDataUrl');
        if (storedDataUrl) src = storedDataUrl;
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
        // Try autoplay on load; if blocked, wait for first user gesture
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          const onFirstClick = () => {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.warn('Audio play blocked on first click', e));
            document.removeEventListener('click', onFirstClick);
          };
          document.addEventListener('click', onFirstClick, { once: true });
        });
      }
    };

    init();

    return () => { /* noop */ };
  }, []);

  const enableMusic = () => {
    setIsMusicEnabled(true);
    setIsPlaying(true);
    localStorage.setItem('musicEnabled', 'true');
    setShowMusicPrompt(false);
    
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio('/car.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    // Play immediately because this action was triggered by a user gesture (button click)
    audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log('Audio play failed:', e));
  };

  // let user pick a local file; store as data URL in localStorage (may be large)
  const setCustomMusic = (file) => {
    if (!file) return Promise.reject(new Error('No file provided'));
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const dataUrl = reader.result;
          // store blob in IndexedDB for persistence across reloads (avoids localStorage size limits)
          try {
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
              tx.onerror = () => console.warn('IDB tx error', tx.error);
            };
            req.onerror = () => console.warn('IDB open error', req.error);
          } catch (e) {
            console.warn('Saving music to IDB failed', e);
          }
          // also store a data URL as fallback (may fail for large files)
          try {
            localStorage.setItem('musicDataUrl', dataUrl);
            localStorage.setItem('musicFileName', file.name || 'custom');
          } catch (e) {
            console.warn('Saving music dataUrl to localStorage failed (size limit?)', e);
          }

          if (!audioRef.current) {
            audioRef.current = new Audio(dataUrl);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
          } else {
            audioRef.current.src = dataUrl;
          }

          setIsMusicEnabled(true);
          // remember preference so next load will attempt playback
          try { localStorage.setItem('musicEnabled', 'true'); } catch (e) {}
          // do not auto-play — require user gesture; caller can call enableMusic()
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '/car.mp3';
      audioRef.current.load();
    }
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
  };

  const toggleMusic = () => {
    if (!isMusicEnabled) {
      enableMusic();
    } else {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <MusicContext.Provider value={{
      isMusicEnabled,
      showMusicPrompt,
      isPlaying,
      enableMusic,
      disableMusic,
      toggleMusic,
      setShowMusicPrompt,
      setCustomMusic,
      clearCustomMusic
    }}>
      {children}
    </MusicContext.Provider>
  );
};