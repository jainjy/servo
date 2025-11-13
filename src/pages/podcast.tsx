import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Headphones, Video, Play, Clock, Calendar, Eye, ArrowLeft, Heart, Loader } from "lucide-react";
import mediaService from "../services/mediaService";

// Composant d'animation personnalisé
const SlideIn = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : direction === "left"
            ? "opacity-0 -translate-x-10"
            : direction === "right"
              ? "opacity-0 translate-x-10"
              : direction === "up"
                ? "opacity-0 translate-y-10"
                : "opacity-0 translate-y-10"
        }
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Composant Modal pour Podcasts et Vidéos
const MediaModal = ({ isOpen, onClose, type, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col transform transition-all duration-300 ease-out">
    
    {/* Header fixe */}
    <div className="flex-shrink-0 p-6 border-b border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {type === 'podcasts' ? 'Tous nos Podcasts' : 'Toutes nos Vidéos'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {data.length} {type === 'podcasts' ? 'épisodes disponibles' : 'vidéos disponibles'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    {/* Liste scrollable */}
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div className="space-y-3">
        {data.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
          >
            {/* Icône */}
            <div className={`p-3 rounded-xl ${type === 'podcasts' ? 'bg-blue-500' : 'bg-red-500'} flex-shrink-0`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {type === 'podcasts' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                )}
              </svg>
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${type === 'podcasts' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {item.category?.name || item.category}
                </span>
                <span className="text-xs text-gray-500">{item.duration}</span>
              </div>
            </div>

            {/* Bouton d'action */}
            <button className="flex-shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-200 text-sm font-medium group-hover:scale-105">
              {type === 'podcasts' ? 'Écouter' : 'Regarder'}
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* Footer fixe */}
    <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {data.length} éléments • {type === 'podcasts' ? 'Podcasts' : 'Vidéos'}
        </span>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all duration-200 font-medium"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
  <style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`}</style>
</div>
  );
};

// Composant Carte pour Podcast avec lecture réelle
const PodcastCard = ({ podcast }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);

        // Incrémenter le compteur seulement au début de la lecture
        await mediaService.incrementPodcastListens(podcast.id);
      }
    } catch (error) {
      console.error('Erreur de lecture:', error);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 group">
      {/* Player audio caché */}
      <audio
        ref={audioRef}
        src={podcast.audioUrl} // URL directe Supabase
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="relative">
        <img
          src={podcast.imageUrl}
          alt={podcast.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${isPlaying ? 'bg-red-500' : 'bg-blue-600'
              } text-white`}
            onClick={handlePlay}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <Play className="w-6 h-6" fill="currentColor" />
            )}
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {podcast.category?.name || 'Podcast'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {podcast.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {podcast.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{podcast.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            <span>{podcast.listens || 0} écoutes</span>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
          onClick={handlePlay}
        >
          {isPlaying ? 'Mettre en pause' : 'Écouter maintenant'}
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Composant Modal de Lecture Vidéo
const VideoModal = ({ video, isOpen, onClose }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // URL directe Supabase
  const videoUrl = video?.videoUrl;

  // Incrémenter les vues quand la vidéo commence à jouer
  const handlePlay = async () => {
    if (!hasPlayed && video?.id) {
      try {
        await mediaService.incrementVideoViews(video.id);
        setHasPlayed(true);
      } catch (error) {
        console.error('Erreur incrémentation vues:', error);
      }
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleFullscreen = async () => {
    if (videoRef.current) {
      try {
        if (!isFullscreen) {
          await videoRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
          }
          setIsFullscreen(false);
        }
      } catch (err) {
        console.error('Erreur fullscreen:', err);
      }
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Nettoyer à la fermeture
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-2xl shadow-2xl w-full max-w-6xl h-auto max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête du modal */}
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-white truncate">{video?.title}</h3>
            <p className="text-gray-400 text-sm mt-1">
              {video?.category?.name || 'Vidéo'} • {video?.duration}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 ml-2 flex-shrink-0 bg-gray-700/50 rounded-lg hover:bg-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteneur vidéo */}
        <div className="flex-1 min-h-0 bg-black flex items-center justify-center relative">
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-white text-lg">Chargement...</span>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            key={videoUrl}
            crossOrigin="anonymous"
            className="w-full h-full object-contain bg-black"
            playsInline
            autoPlay
            onPlay={handlePlay}
            onPause={handlePause}
            onLoadedData={handleLoadedData}
            onLoadStart={handleLoadStart}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleMetadataLoaded}
            onError={() => setIsLoading(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>

        {/* Barre de contrôle */}
        <div className="bg-gradient-to-t from-black/90 to-gray-900 p-6 border-t border-gray-700">
          {/* Barre de progression */}
          <div
            className="w-full h-1 bg-gray-700 rounded-full cursor-pointer mb-4 hover:h-2 transition-all group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="float-right w-3 h-3 -mt-1 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          {/* Heure */}
          <div className="text-gray-400 text-sm mb-4 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-700/50"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.3-2.5-4.06v8.12c1.48-.76 2.5-2.29 2.5-4.06zM14 3.23v2.06A7.007 7.007 0 0121 10c0 .82-.1 1.61-.29 2.38l1.46 1.46C23.54 12.14 24 11.14 24 10c0-4.42-3.58-8-8-8zm0 16.54v2.06c4.42 0 8-3.58 8-8c0-1.14-.46-2.14-1.21-2.88l-1.46 1.46c.19.77.29 1.56.29 2.38 0 2.05-.57 3.98-1.56 5.63z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* Infos de la vidéo */}
              <div className="text-gray-400 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <span>{video?.views || 0} vues</span>
              </div>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-700/50"
            >
              {isFullscreen ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Carte pour Vidéo avec Modal de Lecture
const VideoCard = ({ video, onPlayClick }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 group">
      <div className="relative">
        {/* Thumbnail seulement */}
        <img
          src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop'}
          alt={video.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay de lecture */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="p-4 rounded-full transition-all duration-300 transform hover:scale-110 bg-red-600 text-white"
            onClick={() => onPlayClick(video)}
          >
            <Play className="w-6 h-6" fill="currentColor" />
          </button>
        </div>

        <div className="absolute top-3 left-3">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {video.category?.name || 'Vidéo'}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
          {video.duration}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{video.views || 0} vues</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(video.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        <button
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
          onClick={() => onPlayClick(video)}
        >
          Regarder maintenant
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Composant principal
const Proadcast = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('podcasts');
  const [podcasts, setPodcasts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setSelectedVideo(null);
  };

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [podcastsResponse, videosResponse] = await Promise.all([
          mediaService.getPodcasts({ limit: 6 }),
          mediaService.getVideos({ limit: 6 })
        ]);

        if (podcastsResponse.success) {
          setPodcasts(podcastsResponse.data || []);
        }

        if (videosResponse.success) {
          setVideos(videosResponse.data || []);
        }

      } catch (err) {
        console.error('Erreur chargement médias:', err);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = async (type) => {
    try {
      setModalType(type);

      if (type === 'podcasts') {
        const response = await mediaService.getPodcasts({ limit: 50 });
        if (response.success) {
          setPodcasts(response.data || []);
        }
      } else {
        const response = await mediaService.getVideos({ limit: 50 });
        if (response.success) {
          setVideos(response.data || []);
        }
      }
      setModalOpen(true);
    } catch (err) {
      console.error('Erreur chargement modal:', err);
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-20">
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Chargement des médias...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-4 lg:py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">

        {/* En-tête */}
        <SlideIn direction="up">
          <div className="text-center mb-12 flex relative">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-xl lg:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Bibliothèque de <span className="text-blue-600">Médias</span>
              </h1>
              <p className="text-sm lg:text-md text-gray-600 max-w-3xl mx-auto">
                Découvrez nos podcasts inspirants et nos vidéos éducatives pour votre bien-être
              </p>
              {error && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        </SlideIn>

        {/* Section Podcasts */}
        <section id="podcastaudio" className="mb-16">
          <SlideIn direction="left" delay={300}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h2 className="text-xl lg:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  <Headphones className="w-8 h-8 text-blue-600" />
                  Nos Podcasts
                </h2>
                <p className="text-gray-600">
                  Des contenus audio inspirants pour votre développement personnel
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openModal('podcasts')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <Headphones className="w-5 h-5" />
                  Voir tous ({podcasts.length})
                </button>
              </div>
            </div>
          </SlideIn>

          {podcasts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts.map((podcast, index) => (
                <SlideIn key={podcast.id} direction="up" delay={400 + index * 100}>
                  <PodcastCard podcast={podcast} />
                </SlideIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Headphones className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun podcast disponible.</p>
            </div>
          )}
        </section>

        {/* Section Vidéos */}
        <section id="video" className="mb-16">
          <SlideIn direction="left" delay={300}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h2 className="text-xl lg:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  <Video className="w-8 h-8 text-red-600" />
                  Nos Vidéos
                </h2>
                <p className="text-gray-600">
                  Des tutoriels et séances guidées pour pratiquer où que vous soyez
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openModal('videos')}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <Video className="w-5 h-5" />
                  Voir toutes ({videos.length})
                </button>
              </div>
            </div>
          </SlideIn>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <SlideIn key={video.id} direction="up" delay={400 + index * 100}>
                  <VideoCard video={video} onPlayClick={handlePlayVideo} />
                </SlideIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune vidéo disponible.</p>
            </div>
          )}
        </section>

        {/* Call-to-Action */}
        <SlideIn direction="up" delay={500}>
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mt-16 text-center shadow-lg">
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">
              Rejoignez notre communauté de bien-être
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Accédez à tous nos contenus premium et transformez votre pratique quotidienne
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => openModal('podcasts')}
                className="bg-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-3 group"
              >
                Explorer les podcasts
                <Headphones className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => navigate("/bien-etre")}
                className="bg-slate-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-3 group"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Découvrir nos services
              </button>
            </div>
          </div>
        </SlideIn>
      </div>

      {/* Modal de liste */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        data={modalType === 'podcasts' ? podcasts : videos}
      />

      {/* Modal Grand Écran pour Vidéo */}
      <VideoModal
        video={selectedVideo}
        isOpen={videoModalOpen}
        onClose={closeVideoModal}
      />

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Proadcast;