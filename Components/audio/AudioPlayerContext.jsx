import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const AudioPlayerContext = createContext(null);

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => {
        setIsPlaying(false);
        // Optional: play next track
    });

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    if (currentTrack) {
        audioRef.current.src = currentTrack.audio_url;
        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.error("Error playing audio:", e));
    }
  }, [currentTrack]);
  
  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
        // Toggle play/pause for the same track
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    } else {
        // Play new track
        setCurrentTrack(track);
    }
  };

  const togglePlayPause = () => {
      if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
      } else {
          audioRef.current.play();
          setIsPlaying(true);
      }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  const closePlayer = () => {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTrack(null);
  }

  const value = {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    playTrack,
    togglePlayPause,
    seek,
    closePlayer
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};