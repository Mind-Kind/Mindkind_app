import React from 'react';
import { useAudioPlayer } from './AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Music } from 'lucide-react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === 0) return '0:00';
  const floorSeconds = Math.floor(seconds);
  const minutes = Math.floor(floorSeconds / 60);
  const remainingSeconds = floorSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default function AudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    duration, 
    currentTime, 
    seek,
    closePlayer
  } = useAudioPlayer();

  if (!currentTrack) {
    return null;
  }

  const progress = (currentTime / duration) * 100;

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="glass-effect mx-auto max-w-4xl mb-4 rounded-2xl border border-purple-200/50 shadow-2xl shadow-purple-200/50 overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <img 
                src={currentTrack.cover_image} 
                alt={currentTrack.title} 
                className="w-16 h-16 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-purple-800">{currentTrack.title}</h3>
                <p className="text-sm text-purple-500">{currentTrack.narrator}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-mono text-purple-600">{formatTime(currentTime)}</span>
                  <div className="w-full bg-purple-200 rounded-full h-1.5 cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    seek((clickX / rect.width) * duration);
                  }}>
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-purple-600">{formatTime(duration)}</span>
                </div>
              </div>
              <button onClick={togglePlayPause} className="p-3 bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
               <button onClick={closePlayer} className="p-2 text-purple-500 hover:bg-purple-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}