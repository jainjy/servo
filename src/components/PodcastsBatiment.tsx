// components/PodcastsBatiment.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Headphones, Clock, Heart, Star, Download, Video, Home } from 'lucide-react';
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

const PodcastsBatiment: React.FC = () => {
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
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  ];

  // États pour la barre de progression
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Formatage du temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Mise à jour du temps
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

  // Plein écran
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  // Charger les vidéos de la catégorie Bâtiment & Construction
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Début du chargement des vidéos Bâtiment & Construction...');

        // Utilisation de MediaService pour récupérer les vidéos
        const response = await MediaService.getVideos({
          category: 'Bâtiment & Construction',
          limit: 50
        });

        console.log('📦 Réponse COMPLÈTE de l\'API:', response);
        console.log('🔍 Structure de la réponse Axios:', {
          data: response.data,
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

          const batimentVideos: VideoEpisode[] = apiData.data
            .filter((video: any) => {
              const isBatiment = video.category === "Bâtiment & Construction";
              const isActive = video.isActive !== false;
              const hasVideoUrl = video.videoUrl && video.videoUrl.trim() !== '';

              console.log('📋 Filtrage vidéo:', {
                id: video.id,
                title: video.title,
                category: video.category,
                isBatiment: isBatiment,
                isActive: isActive,
                hasVideoUrl: hasVideoUrl,
                videoUrl: video.videoUrl
              });

              const shouldInclude = isBatiment && isActive && hasVideoUrl;
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

          console.log('🎉 Vidéos Bâtiment & Construction après filtrage:', batimentVideos.length);
          console.log('📺 Liste complète des vidéos filtrées:', batimentVideos);

          setVideoEpisodes(batimentVideos);

          if (batimentVideos.length === 0) {
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
      'Bâtiment & Construction': 'bg-gradient-to-r from-orange-500 to-amber-500',
      'Entreprise': 'bg-gradient-to-r from-purple-500 to-pink-500',
      'Immobilier': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'Crédit & Assurance': 'bg-gradient-to-r from-teal-500 to-blue-500',
      'Bien-être & Santé': 'bg-gradient-to-r from-green-500 to-teal-500',
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
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${episode.featured ? 'border-2 border-blue-600' : 'border-gray-200'
          }`}
      >
        {episode.featured && (
          <div className="bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl">
            ⭐ Vidéo en vedette
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              console.warn('❌ Erreur de chargement de l\'image:', episode.thumbnailUrl);
              e.currentTarget.src = defaultThumbnails[0];
            }}
            onLoad={() => console.log('✅ Image chargée:', episode.thumbnailUrl)}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Bouton play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(episode.category)}`}>
              {episode.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {episode.duration}
            </div>
          </div>

          <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {episode.title}
          </h4>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {episode.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Headphones className="w-4 h-4 mr-1" />
                {episode.views.toLocaleString()} vues
              </div>
              <div>{episode.date}</div>
            </div>
            <button
              onClick={() => {
                console.log('🎯 Clic sur Regarder pour:', episode.title);
                setSelectedEpisode(episode);
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-orange-700 transition-colors group/btn"
            >
              <Video className="w-4 h-4 mr-2" />
              Regarder
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-gray-600">Chargement des vidéos Bâtiment & Construction...</div>
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
      {/* Contenu Principal */}
      <div className="container mx-auto px-4">
        {/* Section Vidéos */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-gray-600 text-xl font-semibold">Expertises techniques, innovations matériaux et retours d'expérience chantier</p>
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
              className={`pb-4 px-6 font-semibold text-lg transition-all duration-300 border-b-2 ${
                activeTab === 'all'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Tous les podcasts ({videoEpisodes.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-4 px-6 font-semibold text-lg transition-all duration-300 border-b-2 ${
                activeTab === 'favorites'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Mes favoris ({favorites.length})</span>
              </div>
            </button>
          </div>

          {/* Contenu de l'onglet */}
          {activeTab === 'all' ? (
            videoEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoEpisodes.map((episode) => (
                  <VideoCard key={episode.id} episode={episode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
                <Home className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucune vidéo disponible</h3>
                <p className="text-gray-500">
                  {error
                    ? "Une erreur est survenue lors du chargement des vidéos"
                    : "Aucune vidéo Bâtiment & Construction n'est disponible pour le moment"
                  }
                </p>
              </div>
            )
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          {/* Modal Container - Layout horizontal YouTube */}
          <div className="relative w-full max-w-7xl h-[90vh] bg-gray-900/40 rounded-2xl shadow-2xl overflow-hidden flex">

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
              className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Colonne de gauche - Vidéo */}
            <div className="flex-1 rounded-t-lg overflow-hidden mr-5 flex flex-col min-w-0">
              {/* Container vidéo */}
              <div className="relative flex-1 bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={selectedEpisode.videoUrl}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-contain"
                  controls={false}
                  poster={selectedEpisode.thumbnailUrl}
                />

                {/* Overlay de contrôle custom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">

                  {/* Barre de progression */}
                  <div className="mb-4 px-2">
                    <div
                      className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer group"
                      onClick={handleProgressClick}
                      ref={progressBarRef}
                    >
                      <div className="absolute inset-0 bg-gray-600 rounded-full"></div>
                      <div
                        className="absolute h-full bg-blue-600 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <div
                        className="absolute top-1/2 w-3 h-3 bg-blue-600 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        style={{ left: `calc(${progress}% - 6px)` }}
                      ></div>
                    </div>

                    {/* Temps */}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayMedia}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-200 hover:scale-105"
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
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Bouton plein écran */}
                      <button
                        onClick={toggleFullscreen}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-200"
                        title="Plein écran"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Titre de la vidéo */}
              <div className="p-4 rounded-b-lg overflow-hidden bg-gray-800 border-t border-gray-700">
                <h1 className="text-lg font-bold text-white">
                  {selectedEpisode.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <span>{selectedEpisode.views.toLocaleString()} vues</span>
                  <span>{selectedEpisode.date}</span>
                </div>
              </div>
            </div>

            {/* Colonne de droite - Contenu */}
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">

              {/* Contenu défilant */}
              <div className="flex-1 overflow-y-auto">

                {/* Informations de base */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Habitat</div>
                      <div className="text-xs text-gray-400">Conseils maison</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(selectedEpisode.category)}`}>
                      {selectedEpisode.category}
                    </span>
                    {selectedEpisode.featured && (
                      <span className="flex items-center text-yellow-400 text-xs font-medium">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Vedette
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedEpisode.duration}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedEpisode.description}
                  </p>
                </div>

                {/* Infos techniques */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Détails</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format</span>
                      <span className="text-white">{selectedEpisode.mimeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taille</span>
                      <span className="text-white">{formatFileSize(selectedEpisode.fileSize || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Durée</span>
                      <span className="text-white">{selectedEpisode.duration}</span>
                    </div>
                  </div>
                </div>
                {/* Actions rapides */}
                <div className="p-4 border-y border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePlayMedia}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      {isPlaying ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                          <span className="text-sm">Pause</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span className="text-sm">Lecture</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => selectedEpisode && toggleFavorite(selectedEpisode.id)}
                      className={`p-2 rounded-lg transition-all duration-200 border ${selectedEpisode && isFavorite(selectedEpisode.id)
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        }`}
                    >
                      <Heart className={`w-4 h-4 ${selectedEpisode && isFavorite(selectedEpisode.id) ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 border border-gray-600"
                    >
                      <Download className="w-4 h-4" />
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

export default PodcastsBatiment;