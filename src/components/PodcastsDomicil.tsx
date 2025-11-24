// components/PodcastsDomicile.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Headphones, Clock, Heart, Star, Download, Video, Home, Image as ImageIcon } from 'lucide-react';
import { MediaService } from '../lib/api';

interface MediaEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  views: number;
  featured: boolean;
  mediaUrl: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  mimeType?: string;
  fileSize?: number;
  mediaType: 'video' | 'image';
}

const PodcastsDomicile: React.FC = () => {
  const [mediaEpisodes, setMediaEpisodes] = useState<MediaEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<MediaEpisode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const mediaRef = React.useRef<HTMLVideoElement>(null);

  // Images par défaut pour les médias sans thumbnail
  const defaultThumbnails = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  ];

  // Image de background pour le titre
  const headerBackgroundImage = "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg";

  // États pour la barre de progression (uniquement pour les vidéos)
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

  // Mise à jour du temps (uniquement pour les vidéos)
  const handleTimeUpdate = () => {
    if (mediaRef.current && selectedEpisode?.mediaType === 'video') {
      const current = mediaRef.current.currentTime;
      const total = mediaRef.current.duration || 0;

      setCurrentTime(current);
      setDuration(total);
      setProgress(total > 0 ? (current / total) * 100 : 0);
    }
  };

  // Clic sur la barre de progression (uniquement pour les vidéos)
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mediaRef.current || !progressBarRef.current || selectedEpisode?.mediaType !== 'video') return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;

    const newTime = (percentage / 100) * duration;
    mediaRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage);
  };

  // Plein écran
  const toggleFullscreen = () => {
    const element = selectedEpisode?.mediaType === 'video' ? mediaRef.current : document.querySelector('.relative.flex-1');
    if (!element) return;

    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Charger les médias de la catégorie Domicile
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Début du chargement des médias Domicile...');

        // Récupérer les vidéos
        const videosResponse = await MediaService.getVideos({
          category: 'Domicile',
          limit: 50
        });

        console.log('📦 Réponse COMPLÈTE des vidéos:', videosResponse);

        const apiData = videosResponse.data;

        console.log('🔍 Structure des données API:', {
          success: apiData.success,
          hasData: !!apiData.data,
          dataIsArray: Array.isArray(apiData.data),
          dataLength: apiData.data?.length,
          pagination: apiData.pagination
        });

        let domicileMedia: MediaEpisode[] = [];

        if (apiData.success && Array.isArray(apiData.data)) {
          console.log('✅ Structure de réponse valide pour les vidéos');

          const videoMedia: MediaEpisode[] = apiData.data
            .filter((video: any) => {
              const isDomicile = video.category === "Domicile";
              const isActive = video.isActive !== false;
              const hasMediaUrl = video.videoUrl && video.videoUrl.trim() !== '';

              const shouldInclude = isDomicile && isActive && hasMediaUrl;
              console.log(`📊 Vidéo "${video.title}" incluse: ${shouldInclude}`);

              return shouldInclude;
            })
            .map((video: any, index: number) => ({
              id: video.id,
              title: video.title,
              description: video.description || 'Aucune description disponible',
              duration: video.duration || "00:00:00",
              date: new Date(video.createdAt || new Date()).toLocaleDateString('fr-FR'),
              category: video.category,
              views: video.views || 0,
              featured: video.featured || video.isPremium || false,
              mediaUrl: video.videoUrl,
              thumbnailUrl: video.thumbnailUrl || defaultThumbnails[index % defaultThumbnails.length],
              isActive: video.isActive !== false,
              mimeType: video.mimeType || 'video/mp4',
              fileSize: video.fileSize || 0,
              mediaType: 'video'
            }));

          domicileMedia = [...domicileMedia, ...videoMedia];
        }

        // Essayer de récupérer les images aussi
        try {
          const imagesResponse = await MediaService.getImages?.({
            category: 'Domicile',
            limit: 50
          });

          if (imagesResponse?.data?.success && Array.isArray(imagesResponse.data.data)) {
            console.log('🖼️ Données images trouvées:', imagesResponse.data.data.length);

            const imageMedia: MediaEpisode[] = imagesResponse.data.data
              .filter((image: any) => {
                const isDomicile = image.category === "Domicile";
                const isActive = image.isActive !== false;
                const hasMediaUrl = image.imageUrl && image.imageUrl.trim() !== '';

                return isDomicile && isActive && hasMediaUrl;
              })
              .map((image: any, index: number) => ({
                id: image.id,
                title: image.title || 'Image Domicile',
                description: image.description || 'Aucune description disponible',
                duration: "00:00", // Pas de durée pour les images
                date: new Date(image.createdAt || new Date()).toLocaleDateString('fr-FR'),
                category: image.category,
                views: image.views || 0,
                featured: image.featured || image.isPremium || false,
                mediaUrl: image.imageUrl,
                thumbnailUrl: image.imageUrl || defaultThumbnails[index % defaultThumbnails.length],
                isActive: image.isActive !== false,
                mimeType: image.mimeType || 'image/jpeg',
                fileSize: image.fileSize || 0,
                mediaType: 'image'
              }));

            domicileMedia = [...domicileMedia, ...imageMedia];
          }
        } catch (imageError) {
          console.log('ℹ️ Aucun service images disponible ou erreur:', imageError);
        }

        console.log('🎉 Médias Domicile après filtrage:', domicileMedia.length);
        console.log('📺 Liste complète des médias filtrés:', domicileMedia);

        setMediaEpisodes(domicileMedia);

        if (domicileMedia.length === 0) {
          console.log('⚠️ Aucun média trouvé après filtrage');
        }

      } catch (err: any) {
        console.error('❌ Erreur lors du chargement des médias:', err);
        console.error('📋 Détails de l\'erreur:', {
          message: err.message,
          stack: err.stack,
          response: err.response
        });
        setError(err.message);
        setMediaEpisodes([]);
      } finally {
        console.log('🏁 Chargement terminé');
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handlePlayMedia = () => {
    if (selectedEpisode && selectedEpisode.mediaType === 'video' && mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (selectedEpisode) {
      const link = document.createElement('a');
      link.href = selectedEpisode.mediaUrl;
      const extension = selectedEpisode.mediaType === 'video' ? 'mp4' : 'jpg';
      link.download = `${selectedEpisode.title}.${extension}`;
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
      'Domicile': 'bg-gradient-to-r from-yellow-500 to-rose-500',
      'Entreprise': 'bg-gradient-to-r from-purple-500 to-yellow-500',
      'Immobilier': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'Bâtiment & Construction': 'bg-gradient-to-r from-orange-500 to-amber-500',
      'Crédit & Assurance': 'bg-gradient-to-r from-teal-500 to-blue-500',
      'Bien-être & Santé': 'bg-gradient-to-r from-green-500 to-teal-500',
      'Investissement': 'bg-gradient-to-r from-amber-500 to-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getMediaIcon = (mediaType: 'video' | 'image') => {
    return mediaType === 'video' ? Video : ImageIcon;
  };

  const getMediaBadge = (mediaType: 'video' | 'image') => {
    return mediaType === 'video' ? ' ' : '';
  };

  const getActionButtonText = (mediaType: 'video' | 'image') => {
    return mediaType === 'video' ? 'Regarder' : 'Voir';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Composant de carte média
  const MediaCard = ({ episode }: { episode: MediaEpisode }) => {
    const MediaIcon = getMediaIcon(episode.mediaType);

    return (
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${episode.featured ? 'border-2 border-yellow-500' : 'border-gray-200'
          }`}
      >
        {episode.featured && (
          <div className="bg-yellow-500 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl">
            ⭐ Média en vedette
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



          {/* Bouton overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
              <MediaIcon className="w-8 h-8 text-yellow-500" />
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
              {episode.mediaType === 'video' ? episode.duration : 'Image'}
            </div>
          </div>

          <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2">
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
                console.log('🎯 Clic sur média pour:', episode.title);
                setSelectedEpisode(episode);
                setIsModalOpen(true);
                setIsPlaying(false);
              }}
              className="flex items-center px-4 py-2 rounded-lg text-white bg-yellow-500 hover:bg-yellow-500 transition-colors group/btn"
            >
              <MediaIcon className="w-4 h-4 mr-2" />
              {getActionButtonText(episode.mediaType)}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
            <div className="text-gray-600">Chargement des médias Domicile...</div>
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
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${headerBackgroundImage})` }}
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            {/* Titre Principal */}
            <h1 className="text-xl md:text-4xl font-bold mb-6 leading-tight">
              Podcast <span className="text-yellow-500">Domicile</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-sm md:text-md text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Décoration, aménagement, jardinage et solutions pour un habitat moderne et confortable
            </p>

            {/* Statistiques */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-200">
              <div className="flex items-center">
                <Headphones className="w-6 h-6 mr-2" />
                <span className="text-2xl font-bold text-white">{mediaEpisodes.reduce((total, ep) => total + ep.views, 0).toLocaleString()}</span>
                <span className="ml-2">vues totales</span>
              </div>
              <div className="flex items-center">
                <Video className="w-6 h-6 mr-2" />
                <span className="text-2xl font-bold text-white">{mediaEpisodes.filter(ep => ep.mediaType === 'video').length}</span>
                <span className="ml-2">vidéos</span>
              </div>
              <div className="flex items-center">
                <ImageIcon className="w-6 h-6 mr-2" />
                <span className="text-2xl font-bold text-white">{mediaEpisodes.filter(ep => ep.mediaType === 'image').length}</span>
                <span className="ml-2">images</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Médias */}
        <section className="mb-16">
          <div className="lg:flex hidden items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-100 rounded-2xl">
                <Home className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Médias Domicile</h2>
                <p className="text-gray-600">Inspirations déco, conseils aménagement et solutions pour votre habitat</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border">
              {activeTab === 'all' ? mediaEpisodes.length : favorites.length} média(s) disponible(s)
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-4 px-1 lg:px-6 font-semibold text-sm lg:text-lg transition-all duration-300 border-b-2 ${activeTab === 'all'
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Tous les médias ({mediaEpisodes.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-4 px-1 lg:px-6 font-semibold text-sm lg:text-lg transition-all duration-300 border-b-2 ${activeTab === 'favorites'
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
            mediaEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mediaEpisodes.map((episode) => (
                  <MediaCard key={episode.id} episode={episode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
                <Home className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun média disponible</h3>
                <p className="text-gray-500">
                  {error
                    ? "Une erreur est survenue lors du chargement des médias"
                    : "Aucun média Domicile n'est disponible pour le moment"
                  }
                </p>
              </div>
            )
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mediaEpisodes
                .filter((episode) => favorites.includes(episode.id))
                .map((episode) => (
                  <MediaCard key={episode.id} episode={episode} />
                ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
              <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun média en favoris</h3>
              <p className="text-gray-500">
                Cliquez sur le cœur d'un média pour l'ajouter à vos favoris
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Modal Média */}
      {isModalOpen && selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
          {/* Modal Container - Layout vertical sur mobile */}
          <div className="relative w-full max-w-7xl h-[95vh] sm:h-[90vh] bg-gray-900/40 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

            {/* Bouton fermeture */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsPlaying(false);
                if (mediaRef.current) {
                  mediaRef.current.pause();
                  mediaRef.current.currentTime = 0;
                }
              }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Colonne de gauche - Media */}
            <div className="flex-1 rounded-t-xl sm:rounded-t-2xl lg:mr-5 overflow-hidden flex flex-col min-w-0">
              {/* Container media */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[200px] sm:min-h-0">
                {selectedEpisode.mediaType === 'video' ? (
                  <video
                    ref={mediaRef}
                    src={selectedEpisode.mediaUrl}
                    onEnded={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-contain"
                    controls={false}
                    poster={selectedEpisode.thumbnailUrl}
                  />
                ) : (
                  <img
                    src={selectedEpisode.mediaUrl}
                    alt={selectedEpisode.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = defaultThumbnails[0];
                    }}
                  />
                )}

                {/* Overlay de contrôle custom pour les vidéos */}
                {selectedEpisode.mediaType === 'video' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">

                    {/* Barre de progression */}
                    <div className="mb-3 sm:mb-4 px-1 sm:px-2">
                      <div
                        className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer group"
                        onClick={handleProgressClick}
                        ref={progressBarRef}
                      >
                        <div className="absolute inset-0 bg-gray-600 rounded-full"></div>
                        <div
                          className="absolute h-full bg-yellow-500 rounded-full transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        ></div>
                        <div
                          className="absolute top-1/2 w-3 h-3 bg-yellow-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                          style={{ left: `calc(${progress}% - 6px)` }}
                        ></div>
                      </div>

                      {/* Temps */}
                      <div className="flex justify-between items-center mt-1 sm:mt-2 text-xs text-gray-300">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <button
                          onClick={handlePlayMedia}
                          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 sm:p-3 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        >
                          {isPlaying ? (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Bouton plein écran */}
                        <button
                          onClick={toggleFullscreen}
                          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2 transition-all duration-200"
                          title="Plein écran"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Titre du media */}
              <div className="p-3 sm:p-4 rounded-b-lg bg-gray-800 border-t border-gray-700">
                <h1 className="text-base sm:text-lg font-bold text-white line-clamp-2">
                  {selectedEpisode.title}
                </h1>
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-400 mt-1">
                  <span>{selectedEpisode.views.toLocaleString()} vues</span>
                  <span>{selectedEpisode.date}</span>
                </div>
              </div>
            </div>

            {/* Colonne de droite - Contenu */}
            <div className="w-full lg:w-80 bg-gray-800 border-t lg:border-l border-gray-700 flex flex-col max-h-[40vh] sm:max-h-none">
              {/* Contenu défilant */}
              <div className="flex-1 overflow-y-auto">

                {/* Informations de base */}
                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      {selectedEpisode.mediaType === 'video' ? (
                        <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {selectedEpisode.mediaType === 'video' ? 'Vidéothèque' : 'Galerie'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {selectedEpisode.mediaType === 'video' ? 'Contenu vidéo' : 'Contenu image'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(selectedEpisode.category)}`}>
                      {selectedEpisode.category}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {selectedEpisode.mediaType === 'video' ? 'Vidéo' : 'Image'}
                    </span>
                    {selectedEpisode.featured && (
                      <span className="flex items-center text-yellow-400 text-xs font-medium">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Vedette
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                    {selectedEpisode.mediaType === 'video' && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {selectedEpisode.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {selectedEpisode.description}
                  </p>
                </div>

                {/* Infos techniques */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-semibold text-white mb-2 sm:mb-3">Détails</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format</span>
                      <span className="text-white">{selectedEpisode.mimeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taille</span>
                      <span className="text-white">{formatFileSize(selectedEpisode.fileSize || 0)}</span>
                    </div>
                    {selectedEpisode.mediaType === 'video' && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Durée</span>
                        <span className="text-white">{selectedEpisode.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-900/50">
                  <div className="flex space-x-2">
                    {selectedEpisode.mediaType === 'video' ? (
                      <button
                        onClick={handlePlayMedia}
                        className="flex-1 flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm"
                      >
                        {isPlaying ? (
                          <>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>Lecture</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm"
                      >
                        <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Agrandir</span>
                      </button>
                    )}

                    <button
                      onClick={() => selectedEpisode && toggleFavorite(selectedEpisode.id)}
                      className={`p-2 rounded-lg transition-all duration-200 border text-xs ${selectedEpisode && isFavorite(selectedEpisode.id)
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        }`}
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${selectedEpisode && isFavorite(selectedEpisode.id) ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 border border-gray-600 text-xs"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
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

export default PodcastsDomicile;