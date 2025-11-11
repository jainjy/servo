import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Headphones, Video, Play, Clock, Calendar, Eye, ArrowLeft, Heart, Loader } from "lucide-react";
import MediaService from "../services/mediaService";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out animate-slideUp">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {type === 'podcasts' ? 'Tous nos Podcasts' : 'Toutes nos Vidéos'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
            {data.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className={`p-3 rounded-lg ${type === 'podcasts' ? 'bg-blue-600' : 'bg-red-600'}`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {type === 'podcasts' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-xs lg:text-base text-gray-800">{item.title}</h4>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className={`${type === 'podcasts' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} text-xs lg:text-sm px-2 py-1 rounded-full`}>
                      {item.category?.name || item.category}
                    </span>
                    <span>{item.duration}</span>
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all duration-300 font-medium">
                  {type === 'podcasts' ? 'Écouter' : 'Regarder'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
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
        await MediaService.incrementPodcastListens(podcast.id);
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
        src={`http://localhost:3001${podcast.audioUrl}`}
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
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isPlaying ? 'bg-red-500' : 'bg-blue-600'
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

// Composant Modal de Lecture Vidéo - TAILLE RÉDUITE
const VideoModal = ({ video, isOpen, onClose }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Fonction pour obtenir l'URL de la vidéo
  const getVideoUrl = () => {
    if (!video.videoUrl) return null;
    const baseUrl = 'http://localhost:3001';
    
    if (video.videoUrl.startsWith('/media/')) {
      return `${baseUrl}${video.videoUrl}`;
    }
    
    return `${baseUrl}/media/videos/${video.videoUrl}`;
  };

  const videoUrl = getVideoUrl();

  // Incrémenter les vues quand la vidéo commence à jouer
  const handlePlay = async () => {
    if (!hasPlayed) {
      try {
        await MediaService.incrementVideoViews(video.id);
        setHasPlayed(true);
      } catch (error) {
        console.error('Erreur incrémentation vues:', error);
      }
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  // Nettoyer à la fermeture
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4">
      
      {/* ==================== DÉBUT - CONFIGURATION TAILLE MODAL ==================== */}
      {/* 
        🎯 CONFIGURATION DE LA TAILLE DU MODAL :
        
        OPTIONS DE LARGEUR (max-w-*) :
        - max-w-xs  → 320px  (très petit)
        - max-w-sm  → 384px  (petit)
        - max-w-md  → 448px  (moyen - RECOMMANDÉ pour votre capture)
        - max-w-lg  → 512px  (moyen-grand)
        - max-w-xl  → 576px  (grand)
        - max-w-2xl → 672px  (très grand)
        
        OPTIONS DE HAUTEUR VIDÉO (max-h-*) :
        - max-h-[250px] → très compact
        - max-h-[300px] → compact
        - max-h-[350px] → moyen
        - max-h-[400px] → grand
        
        MODIFIER CES VALEURS POUR AJUSTER LA TAILLE :
      */}
      <div className="bg-black rounded-2xl shadow-2xl w-full max-w-md h-auto overflow-hidden transform transition-all duration-300">
      {/* ==================== FIN - CONFIGURATION TAILLE MODAL ==================== */}
        
        {/* En-tête du modal */}
        <div className="flex justify-between items-center p-4 bg-black border-b border-gray-800">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{video.title}</h3>
            <p className="text-gray-400 text-xs mt-1">
              {video.category?.name || 'Vidéo'} • {video.duration}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 ml-2 flex-shrink-0 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteneur principal */}
        <div className="flex flex-col">
          
          {/* Lecteur vidéo - Taille réduite */}
          <div className="relative bg-black">
            {isLoading && (
              <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                <div className="flex items-center gap-2 text-white">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span className="text-sm">Chargement...</span>
                </div>
              </div>
            )}
            
            {/* ==================== DÉBUT - CONFIGURATION TAILLE VIDÉO ==================== */}
            {/* 
              🎯 CONFIGURATION DE LA TAILLE DE LA VIDÉO :
              Modifier max-h-[300px] pour ajuster la hauteur de la vidéo
            */}
            <video
              ref={videoRef}
              key={videoUrl}
              crossOrigin="anonymous"
              className="w-full h-auto max-h-[300px] object-contain bg-black"
              controls
              playsInline
              autoPlay
              onPlay={handlePlay}
              onLoadedData={handleLoadedData}
              onLoadStart={handleLoadStart}
              onError={() => setIsLoading(false)}
            >
            {/* ==================== FIN - CONFIGURATION TAILLE VIDÉO ==================== */}
              <source src={videoUrl} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>

          {/* Informations de la vidéo - Style compact */}
          <div className="p-4 bg-black text-white">
            <div className="mb-3">
              <h4 className="text-base font-semibold mb-2">{video.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{video.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views || 0} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(video.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Carte pour Vidéo avec Modal de Lecture
const VideoCard = ({ video }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handlePlayClick = () => {
    setShowVideoModal(true);
  };

  return (
    <>
      {/* Carte Vidéo */}
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
              onClick={handlePlayClick}
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
            onClick={handlePlayClick}
          >
            Regarder maintenant
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal de Lecture Vidéo */}
      <VideoModal 
        video={video}
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
    </>
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

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [podcastsResponse, videosResponse] = await Promise.all([
          MediaService.getPodcasts({ limit: 6 }),
          MediaService.getVideos({ limit: 6 })
        ]);

        if (podcastsResponse.success) {
          setPodcasts(podcastsResponse.data);
        }

        if (videosResponse.success) {
          setVideos(videosResponse.data);
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
        const response = await MediaService.getPodcasts({ limit: 50 });
        if (response.success) {
          setPodcasts(response.data);
        }
      } else {
        const response = await MediaService.getVideos({ limit: 50 });
        if (response.success) {
          setVideos(response.data);
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
    <div className="min-h-screen bg-gray-50 text-gray-800 py-4 lg:py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="container mx-auto">
        
        {/* En-tête */}
        <SlideIn direction="up">
          <div className="text-center mb-12 flex relative">
            <div className="top-0 -left-8 lg:left-0 absolute">
              <button
                onClick={() => navigate("/bien-etre")}
                className="inline-flex items-center gap-3 animate-accordion-down bg-slate-900 text-white lg:px-6 px-3 py-1 lg:py-3 rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium shadow-lg border border-slate-700 hover:border-slate-600 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="mx-auto max-w-3xl">
              <h1 className="text-xl lg:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Bibliothèque de <span className="text-blue-600">Médias</span>
              </h1>
              <p className="text-sm lg:text-xl text-gray-600 max-w-3xl mx-auto">
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
                  <VideoCard video={video} />
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