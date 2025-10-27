import React, { useState, useRef } from 'react';

const AutoPlayVideo = ({ src, className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer group ${className}`}
      onClick={togglePlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={src} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>

      {/* Overlay avec bouton centré */}
      <div className={`
        absolute inset-0 bg-black/20 transition-all duration-300 
        flex items-center justify-center
        ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}
        group-hover:opacity-100
      `}>
        <button
          className={`
            bg-white/90 hover:bg-white transition-all duration-300 
            rounded-full p-3 shadow-2xl transform
            ${showControls || !isPlaying ? 'scale-100' : 'scale-0'}
            hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50
            group-hover:scale-100
          `}
          aria-label={isPlaying ? "Mettre en pause" : "Lire la vidéo"}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default AutoPlayVideo;