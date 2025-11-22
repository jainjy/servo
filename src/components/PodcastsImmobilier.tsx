// components/PodcastsImmobilier.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Headphones, Clock, Heart, Star, Download, Video, Home, Calendar } from 'lucide-react';
import { MediaService } from '../lib/api';

interface VideoEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  views: number;
  featured: boolean;
  videoUrl: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  mimeType?: string;
  fileSize?: number;
}

const PodcastsImmobilier: React.FC = () => {
  const [videoEpisodes, setVideoEpisodes] = useState<VideoEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<VideoEpisode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Images par défaut pour les vidéos sans thumbnail
  const defaultThumbnails = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1570126618953-d437176e8c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  ];

  // Image de background pour le titre
  const headerBackgroundImage = "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg";

  // Ajoutez cette fonction dans votre composant

  // États supplémentaires à ajouter
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hoverProgress, setHoverProgress] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Formatage du temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Mise à jour du temps et de la progression
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 0;

      setCurrentTime(current);
      setDuration(total);
      setProgress(total > 0 ? (current / total) * 100 : 0);
    }
  };

  // Clic sur la barre de progression
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;

    const newTime = (percentage / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage);
  };

  // Gestion du survol de la barre de progression
  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (hoverX / width) * 100;

    setHoverProgress(percentage);
    setHoverTime((percentage / 100) * duration);
  };

  // Gestion de la fin du survol
  const handleProgressLeave = () => {
    setHoverProgress(0);
    setHoverTime(0);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      // Entrer en plein écran
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen();
      }
    } else {
      // Sortir du plein écran
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Gestionnaire d'événement pour les changements de plein écran
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      // Vous pouvez ajouter un état pour gérer l'état du plein écran si besoin
      console.log('Fullscreen changed');
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);
  // Charger les vidéos de la catégorie Immobilier
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Début du chargement des vidéos Immobilier...');

        // Utilisation de MediaService pour récupérer les vidéos
        const response = await MediaService.getVideos({
          category: 'Immobilier',
          limit: 50
        });

        console.log('📦 Réponse COMPLÈTE de l\'API:', response);
        console.log('🔍 Structure de la réponse Axios:', {
          data: response.data, // ← C'est ici que se trouvent vos données !
          status: response.status,
          statusText: response.statusText
        });

        // CORRECTION : Les données sont dans response.data (Axios)
        const apiData = response.data;

        console.log('🔍 Structure des données API:', {
          success: apiData.success,
          hasData: !!apiData.data,
          dataIsArray: Array.isArray(apiData.data),
          dataLength: apiData.data?.length,
          pagination: apiData.pagination
        });

        if (apiData.success && Array.isArray(apiData.data)) {
          console.log('✅ Structure de réponse valide');
          console.log('🎯 Nombre total de vidéos dans apiData.data:', apiData.data.length);
          console.log('🔍 Détail de la première vidéo:', apiData.data[0]);

          const immobilierVideos: VideoEpisode[] = apiData.data
            .filter((video: any) => {
              const isImmobilier = video.category === "Immobilier";
              const isActive = video.isActive !== false;
              const hasVideoUrl = video.videoUrl && video.videoUrl.trim() !== '';

              console.log('📋 Filtrage vidéo:', {
                id: video.id,
                title: video.title,
                category: video.category,
                isImmobilier: isImmobilier,
                isActive: isActive,
                hasVideoUrl: hasVideoUrl,
                videoUrl: video.videoUrl
              });

              const shouldInclude = isImmobilier && isActive && hasVideoUrl;
              console.log(`📊 Vidéo "${video.title}" incluse: ${shouldInclude}`);

              return shouldInclude;
            })
            .map((video: any, index: number) => {
              console.log(`🔄 Mapping de la vidéo "${video.title}":`, {
                id: video.id,
                videoUrl: video.videoUrl,
                thumbnailUrl: video.thumbnailUrl,
                createdAt: video.createdAt
              });

              const mappedVideo = {
                id: video.id,
                title: video.title,
                description: video.description || 'Aucune description disponible',
                duration: video.duration || "00:00:00",
                date: new Date(video.createdAt || new Date()).toLocaleDateString('fr-FR'),
                category: video.category,
                views: video.views || 0,
                featured: video.featured || video.isPremium || false,
                videoUrl: video.videoUrl,
                thumbnailUrl: video.thumbnailUrl || defaultThumbnails[index % defaultThumbnails.length],
                isActive: video.isActive !== false,
                mimeType: video.mimeType || 'video/mp4',
                fileSize: video.fileSize || 0
              };

              console.log(`✅ Vidéo mappée "${video.title}":`, mappedVideo);
              return mappedVideo;
            });

          console.log('🎉 Vidéos Immobilier après filtrage:', immobilierVideos.length);
          console.log('📺 Liste complète des vidéos filtrées:', immobilierVideos);

          setVideoEpisodes(immobilierVideos);

          if (immobilierVideos.length === 0) {
            console.log('⚠️ Aucune vidéo trouvée après filtrage, mais apiData.data contenait:', apiData.data.length, 'éléments');
            console.log('🔍 Contenu de apiData.data:', apiData.data);
          }

        } else {
          console.warn('⚠️ Structure de réponse inattendue:', {
            success: apiData.success,
            hasData: !!apiData.data,
            dataIsArray: Array.isArray(apiData.data),
            apiData: apiData
          });
          setVideoEpisodes([]);
        }
      } catch (err: any) {
        console.error('❌ Erreur lors du chargement des vidéos:', err);
        console.error('📋 Détails de l\'erreur:', {
          message: err.message,
          stack: err.stack,
          response: err.response
        });
        setError(err.message);
        setVideoEpisodes([]);
      } finally {
        console.log('🏁 Chargement terminé');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Test de débogage supplémentaire
  useEffect(() => {
    console.log('📊 État actuel de videoEpisodes:', {
      count: videoEpisodes.length,
      videos: videoEpisodes
    });
  }, [videoEpisodes]);

  // Le reste du code reste inchangé...
  const handlePlayMedia = () => {
    if (selectedEpisode && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (selectedEpisode) {
      const link = document.createElement('a');
      link.href = selectedEpisode.videoUrl;
      link.download = `${selectedEpisode.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleFavorite = (episodeId: string) => {
    setFavorites(prev =>
      prev.includes(episodeId)
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  const isFavorite = (episodeId: string) => favorites.includes(episodeId);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Immobilier': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'Bâtiment & Construction': 'bg-gradient-to-r from-orange-500 to-amber-500',
      'Bien-être & Santé': 'bg-gradient-to-r from-green-500 to-teal-500',
      'Entreprise': 'bg-gradient-to-r from-purple-500 to-pink-500',
      'Investissement': 'bg-gradient-to-r from-amber-500 to-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  // Composant de carte vidéo
  const VideoCard = ({ episode }: { episode: VideoEpisode }) => {
    console.log('🎬 Rendu de VideoCard pour:', episode.title);
    return (
      <div
        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border group cursor-pointer ${episode.featured ? 'border-2 border-purple-500' : 'border-gray-100'
          }`}
      >
        {episode.featured && (
          <div className="bg-purple-500 text-white px-3 py-1 text-xs font-medium rounded-t-xl">
            ⭐ Vedette
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = defaultThumbnails[0];
            }}
          />

          {/* Overlay play */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(episode.category)}`}>
              {episode.category}
            </span>
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {episode.duration}
            </div>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2 text-sm leading-tight">
            {episode.title}
          </h4>

          {/* Description */}
          <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
            {episode.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center">
                <Headphones className="w-3 h-3 mr-1" />
                {episode.views.toLocaleString()}
              </div>
              <div>{episode.date}</div>
            </div>
            <button
              onClick={() => {
                setSelectedEpisode(episode);
                setIsModalOpen(true);
              }}
              className="flex items-center px-3 py-1.5 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors text-xs font-medium"
            >
              <Video className="w-3 h-3 mr-1" />
              Voir
            </button>
          </div>
        </div>
      </div>
    );
  };

  console.log('📱 Rendu du composant principal:', {
    loading,
    error,
    videoCount: videoEpisodes.length,
    videos: videoEpisodes
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <img src="/loading.gif" alt="" />
            <div className="text-gray-600">Chargement des vidéos Immobilier...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec Image de Background */}
      <div
        className="relative mt-16 py-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${headerBackgroundImage})` }}
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            {/* Titre Principal */}
            <h1 className="text-xl md:text-4xl font-bold mb-2 leading-tight">
              Podcast <span className="text-purple-400">Immobilier</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-md md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Découvrez nos visites virtuelles, conseils d'experts et analyses de marché en vidéo
            </p>

            {/* Statistiques */}
            <div className="flex flex-wrap justify-center items-center gap-6">
              {/* Glassmorphism Badge */}
              <div className="relative group">
                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-7 py-3 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                    <Headphones className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-white drop-shadow-lg">
                      {videoEpisodes.reduce((total, ep) => total + ep.views, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-300 font-light tracking-wide">
                      Vues Totales
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-7 py-3 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/20">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                    <Video className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-white drop-shadow-lg">
                      {videoEpisodes.length}
                    </div>
                    <div className="text-sm text-gray-300 font-light tracking-wide">
                      Vidéos Disponibles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Vidéos */}
        <section className="mb-16">
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <Video className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Podcasts Immobilier</h2>
                <p className="text-gray-600">Visites virtuelles, conseils experts et démonstrations pratiques</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border">
              {activeTab === 'all' ? videoEpisodes.length : favorites.length} vidéo(s) disponible(s)
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-4 px-6 font-semibold text-lg transition-all duration-300 border-b-2 ${activeTab === 'all'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span className='text-xs'>Tous les podcasts ({videoEpisodes.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-4 px-6 font-semibold text-lg transition-all duration-300 border-b-2 ${activeTab === 'favorites'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span className='text-xs'>Mes favoris ({favorites.length})</span>
              </div>
            </button>
          </div>

          {/* Contenu de l'onglet */}
          {activeTab === 'all' ? (
            videoEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {videoEpisodes.map((episode) => (
                  <VideoCard key={episode.id} episode={episode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
                <Video className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucune vidéo disponible</h3>
                <p className="text-gray-500">
                  {error
                    ? "Une erreur est survenue lors du chargement des vidéos"
                    : "Aucune vidéo immobilier n'est disponible pour le moment"
                  }
                </p>
              </div>
            )
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {videoEpisodes
                .filter((episode) => favorites.includes(episode.id))
                .map((episode) => (
                  <VideoCard key={episode.id} episode={episode} />
                ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
              <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun podcast en favoris</h3>
              <p className="text-gray-500">
                Cliquez sur le cœur d'un podcast pour l'ajouter à vos favoris
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Modal Vidéo */}
      {isModalOpen && selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Modal Container - Layout vertical sur mobile */}
          <div className="relative w-full max-w-7xl h-[90vh] bg-slate-900/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

            {/* Bouton fermeture */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsPlaying(false);
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
              className="absolute top-2 right-2 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 backdrop-blur-sm lg:top-4 lg:right-4 lg:p-3"
            >
              <svg className="h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Colonne de gauche - Vidéo */}
            <div className="flex-1 flex lg:mr-5 rounded-lg flex-col min-w-0">
              {/* Container vidéo */}
              <div className="relative flex-1 rounded-t-lg overflow-hidden bg-black/60 flex items-center justify-center min-h-[200px] lg:min-h-0">
                <video
                  ref={videoRef}
                  src={selectedEpisode.videoUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                  controls={false}
                  poster={selectedEpisode.thumbnailUrl}
                  onTimeUpdate={handleTimeUpdate}
                />

                {/* Overlay de contrôle custom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 lg:p-4">

                  {/* Barre de progression */}
                  <div className="mb-3 lg:mb-4 px-1 lg:px-2">
                    <div
                      className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer group"
                      onClick={handleProgressClick}
                      ref={progressBarRef}
                    >
                      {/* Barre de fond */}
                      <div className="absolute inset-0 bg-gray-600 rounded-full"></div>

                      {/* Barre de progression */}
                      <div
                        className="absolute h-full bg-red-600 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      ></div>

                      {/* Point de progression */}
                      <div
                        className="absolute top-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        style={{ left: `calc(${progress}% - 6px)` }}
                      ></div>

                      {/* Tooltip de temps */}
                      <div
                        className="absolute bottom-6 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{ left: `${hoverProgress}%` }}
                      >
                        {formatTime(hoverTime)}
                      </div>
                    </div>

                    {/* Temps actuel et total */}
                    <div className="flex justify-between items-center mt-1 lg:mt-2 text-xs text-gray-300">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <button
                        onClick={handlePlayMedia}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 lg:p-3 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                      >
                        {isPlaying ? (
                          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>

                      <div className="text-white">
                        <div className="text-xs lg:text-sm font-medium">
                          {isPlaying ? 'En lecture' : 'En pause'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 lg:space-x-3">
                      {/* Bouton plein écran */}
                      <button
                        onClick={toggleFullscreen}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 lg:p-2 transition-all duration-200"
                        title="Plein écran"
                      >
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>

                      <button
                        onClick={() => selectedEpisode && toggleFavorite(selectedEpisode.id)}
                        className={`p-1.5 lg:p-2 rounded-full transition-all duration-200 ${selectedEpisode && isFavorite(selectedEpisode.id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                      >
                        <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${selectedEpisode && isFavorite(selectedEpisode.id) ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={handleDownload}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 lg:p-2 transition-all duration-200"
                      >
                        <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Titre de la vidéo sous la vidéo */}
              <div className="p-3 lg:p-4 rounded-b-lg bg-gray-800 border-t border-gray-700">
                <h1 className="text-base lg:text-lg font-bold text-white line-clamp-2">
                  {selectedEpisode.title}
                </h1>
                <div className="flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm text-gray-400 mt-1">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    {selectedEpisode.duration}
                  </span>
                  <span className="flex items-center">
                    <Headphones className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    {selectedEpisode.views.toLocaleString()} vues
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne de droite - Contenu */}
            <div className="w-full lg:w-96 bg-gray-800 border-t lg:border-l border-gray-700 flex flex-col max-h-[50vh] lg:max-h-none">
              {/* En-tête avec informations */}
              <div className="p-4 lg:p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                  {/* Avatar */}
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Video className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Ma Chaîne</div>
                    <div className="text-xs text-gray-400">Contenu premium</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(selectedEpisode.category)}`}>
                    {selectedEpisode.category}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Vidéo
                  </span>
                  {selectedEpisode.featured && (
                    <span className="flex items-center text-yellow-400 text-xs font-medium">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Vedette
                    </span>
                  )}
                </div>
              </div>

              {/* Contenu défilant */}
              <div className="flex-1 overflow-y-auto">
                {/* Description */}
                <div className="p-4 lg:p-6 border-b border-gray-700">
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-2 lg:mb-3">Description</h3>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 lg:line-clamp-none">
                    {selectedEpisode.description}
                  </p>
                </div>

                {/* Informations techniques */}
                <div className="p-4 lg:p-6 border-b border-gray-700">
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Informations techniques</h3>
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Format</span>
                      <span className="text-white font-medium text-sm">{selectedEpisode.mimeType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Taille</span>
                      <span className="text-white font-medium text-sm">{formatFileSize(selectedEpisode.fileSize || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Durée</span>
                      <span className="text-white font-medium text-sm">{selectedEpisode.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Date</span>
                      <span className="text-white font-medium text-sm">{selectedEpisode.date}</span>
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-3 lg:mb-4">Statistiques</h3>
                  <div className="space-y-2 lg:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Vues totales</span>
                      <span className="text-white font-medium text-sm">{selectedEpisode.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Qualité</span>
                      <span className="text-green-400 font-medium text-sm">HD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="p-4 lg:p-6 border-t border-gray-700 bg-gray-900/50">
                <div className="space-y-3">
                  <button
                    onClick={handlePlayMedia}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 lg:py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 text-sm lg:text-base"
                  >
                    {isPlaying ? (
                      <>
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                        <span>Mettre en pause</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Lire la vidéo</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-all duration-200 border border-gray-600 text-xs lg:text-sm"
                    >
                      <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>Télécharger</span>
                    </button>

                    <button
                      onClick={() => selectedEpisode && toggleFavorite(selectedEpisode.id)}
                      className={`flex items-center justify-center space-x-2 py-2 rounded-lg font-medium transition-all duration-200 border text-xs lg:text-sm ${selectedEpisode && isFavorite(selectedEpisode.id)
                          ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
                          : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        }`}
                    >
                      <Heart className={`w-3 h-3 lg:w-4 lg:h-4 ${selectedEpisode && isFavorite(selectedEpisode.id) ? 'fill-current' : ''}`} />
                      <span>{selectedEpisode && isFavorite(selectedEpisode.id) ? 'Favori' : 'J\'aime'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastsImmobilier;