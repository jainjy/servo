// components/PodcastsAlimentation.tsx
import React, { useState, useEffect } from 'react';
import { Play, Headphones, Clock, Heart, Star, Download, Video, Music, Apple, Utensils } from 'lucide-react';
import { MediaService } from '../lib/api';

interface MediaEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  listens: number;
  featured: boolean;
  audioUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  type: 'audio' | 'video';
  mimeType?: string;
  fileSize?: number;
}

const PodcastsAlimentation: React.FC = () => {
  const [mediaEpisodes, setMediaEpisodes] = useState<MediaEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<MediaEpisode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'audio' | 'video'>('audio');

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // URLs audio et vidéo gratuites qui fonctionnent
  const freeAudioUrls = [
    "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    "https://www.soundjay.com/misc/sounds/bell-ringing-04.wav",
    "https://www.soundjay.com/button/sounds/button-09.wav",
    "https://www.soundjay.com/button/sounds/button-10.wav",
    "https://www.soundjay.com/nature/sounds/forest-ambience-1.wav",
    "https://www.soundjay.com/ambient/sounds/office-ambience-1.wav"
  ];

  const freeVideoUrls = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  ];

  // Images pour les vidéos
  const videoThumbnails = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  ];

  // Images pour les podcasts audio
  const audioThumbnails = [
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  ];

  // Image de background pour le titre (image culinaire)
  const headerBackgroundImage = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

  // Charger les médias de la catégorie Alimentation
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Chargement des médias Alimentation...');
        const response = await MediaService.getPodcasts({ limit: 50 });
        
        console.log('📦 Réponse API:', response);
        
        const mediaData = response.data?.data || response.data || response;
        
        if (Array.isArray(mediaData)) {
          console.log('🎯 Données reçues:', mediaData.length, 'éléments');
          
          const alimentationMedia: MediaEpisode[] = mediaData
            .filter((media: any) => {
              const isAlimentation = media.category === "Alimentation";
              const isActive = media.isActive !== false;
              console.log('📋 Filtrage:', media.title, '- Catégorie:', media.category, '- Actif:', isActive);
              return isAlimentation && isActive;
            })
            .map((media: any, index: number) => {
              const isVideo = media.mimeType === "video/mp4";
              return {
                id: media.id,
                title: media.title,
                description: media.description || 'Aucune description disponible',
                duration: media.duration || "00:00:00",
                date: new Date(media.createdAt || media.date || new Date()).toLocaleDateString('fr-FR'),
                category: media.category,
                listens: media.listens || Math.floor(Math.random() * 1000) + 100,
                featured: media.listens > 500 || media.featured || false,
                audioUrl: media.audioUrl || freeAudioUrls[index % freeAudioUrls.length],
                videoUrl: isVideo ? freeVideoUrls[index % freeVideoUrls.length] : undefined,
                thumbnailUrl: media.thumbnailUrl || getThumbnailByType(isVideo ? 'video' : 'audio', index),
                isActive: media.isActive !== false,
                type: isVideo ? 'video' : 'audio',
                mimeType: media.mimeType,
                fileSize: media.fileSize || 0
              };
            });
          
          console.log('✅ Médias Alimentation chargés:', alimentationMedia.length);
          setMediaEpisodes(alimentationMedia);
          
          // Si aucun média n'est trouvé, utiliser les données de fallback
          if (alimentationMedia.length === 0) {
            console.log('⚠️ Aucun média trouvé, utilisation des données de fallback');
            setMediaEpisodes(getFallbackMedia());
          }
        } else {
          console.warn('⚠️ Format de données inattendu, utilisation des données de fallback');
          setMediaEpisodes(getFallbackMedia());
        }
      } catch (err: any) {
        console.error('❌ Erreur lors du chargement des médias:', err);
        // Fallback en cas d'erreur
        setMediaEpisodes(getFallbackMedia());
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const getThumbnailByType = (type: 'audio' | 'video', index: number) => {
    if (type === 'video') {
      return videoThumbnails[index % videoThumbnails.length];
    } else {
      return audioThumbnails[index % audioThumbnails.length];
    }
  };

  // Données de fallback
  const getFallbackMedia = (): MediaEpisode[] => {
    return [
      // Podcasts Audio
      {
        id: '1',
        title: "Nutrition santé : les bases d'une alimentation équilibrée",
        description: "Découvrez les fondamentaux de la nutrition : macronutriments, micronutriments et équilibre alimentaire au quotidien.",
        duration: "00:36:45",
        date: "20/03/2024",
        category: "Alimentation",
        listens: 3240,
        featured: true,
        audioUrl: freeAudioUrls[0],
        videoUrl: freeVideoUrls[0],
        thumbnailUrl: audioThumbnails[0],
        type: 'audio',
        mimeType: 'audio/mpeg',
        fileSize: 38765432
      },
      {
        id: '2',
        title: "Super-aliments : mythes et réalités",
        description: "Analyse des super-aliments tendance : baies de goji, graines de chia, spiruline. Quels sont leurs véritables bienfaits ?",
        duration: "00:32:20",
        date: "19/03/2024",
        category: "Alimentation",
        listens: 2780,
        featured: false,
        audioUrl: freeAudioUrls[1],
        videoUrl: freeVideoUrls[1],
        thumbnailUrl: audioThumbnails[1],
        type: 'audio',
        mimeType: 'audio/mpeg',
        fileSize: 35678901
      },
      {
        id: '3',
        title: "Cuisine végétale : débuter en douceur",
        description: "Guide pratique pour incorporer plus de végétal dans son alimentation sans carences et avec plaisir.",
        duration: "00:41:10",
        date: "18/03/2024",
        category: "Alimentation",
        listens: 3560,
        featured: true,
        audioUrl: freeAudioUrls[2],
        videoUrl: freeVideoUrls[2],
        thumbnailUrl: audioThumbnails[2],
        type: 'audio',
        mimeType: 'audio/mpeg',
        fileSize: 44567890
      },
      // Vidéos
      {
        id: '4',
        title: "Recette healthy : bowl vitaminé du matin",
        description: "Préparation pas à pas d'un petit-déjeuner nutritif et coloré pour bien commencer la journée.",
        duration: "00:15:30",
        date: "17/03/2024",
        category: "Alimentation",
        listens: 4230,
        featured: true,
        audioUrl: freeAudioUrls[3],
        videoUrl: freeVideoUrls[3],
        thumbnailUrl: videoThumbnails[0],
        type: 'video',
        mimeType: 'video/mp4',
        fileSize: 156789012
      },
      {
        id: '5',
        title: "Techniques de coupe : maîtriser les bases",
        description: "Démonstration des techniques essentielles de découpe pour gagner en efficacité en cuisine.",
        duration: "00:22:45",
        date: "16/03/2024",
        category: "Alimentation",
        listens: 3340,
        featured: false,
        audioUrl: freeAudioUrls[4],
        videoUrl: freeVideoUrls[4],
        thumbnailUrl: videoThumbnails[1],
        type: 'video',
        mimeType: 'video/mp4',
        fileSize: 198765432
      },
      {
        id: '6',
        title: "Cuisine anti-gaspi : recettes zéro déchet",
        description: "Astuces et recettes pour utiliser toutes les parties des aliments et réduire le gaspillage.",
        duration: "00:28:20",
        date: "15/03/2024",
        category: "Alimentation",
        listens: 2980,
        featured: false,
        audioUrl: freeAudioUrls[5],
        videoUrl: freeVideoUrls[5],
        thumbnailUrl: videoThumbnails[2],
        type: 'video',
        mimeType: 'video/mp4',
        fileSize: 234567890
      }
    ];
  };

  const handlePlayMedia = () => {
    if (selectedEpisode?.type === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (selectedEpisode?.type === 'video' && videoRef.current) {
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
      const url = selectedEpisode.type === 'audio' ? selectedEpisode.audioUrl : selectedEpisode.videoUrl;
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedEpisode.title}.${selectedEpisode.type === 'audio' ? 'mp3' : 'mp4'}`;
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
      'Alimentation': 'bg-gradient-to-r from-orange-500 to-amber-500',
      'Bien-être & Santé': 'bg-gradient-to-r from-green-500 to-teal-500',
      'Immobilier': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'Assurance et Finance': 'bg-gradient-to-r from-green-600 to-emerald-500'
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

  // Filtrer les médias par type
  const audioEpisodes = mediaEpisodes.filter(episode => episode.type === 'audio');
  const videoEpisodes = mediaEpisodes.filter(episode => episode.type === 'video');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">Chargement des contenus alimentation...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur:</strong> {error}
        </div>
      </div>
    );
  }

  // Composant de carte média réutilisable
  const MediaCard = ({ episode }: { episode: MediaEpisode }) => (
    <div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${
        episode.featured ? 'border-2 border-blue-600' : 'border-gray-200'
      }`}
    >
      {episode.featured && (
        <div className="bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl">
          ⭐ Contenu en vedette
        </div>
      )}
      
      {/* Image/Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={episode.thumbnailUrl}
          alt={episode.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Badge type */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
          episode.type === 'video' ? 'bg-slate-900' : 'bg-blue-600'
        }`}>
          {episode.type === 'video' ? '📹 Vidéo' : '🎧 Audio'}
        </div>
        
        {/* Bouton play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
            {episode.type === 'video' ? (
              <Video className="w-8 h-8 text-purple-600" />
            ) : (
              <Play className="w-8 h-8 text-blue-600" />
            )}
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
              {episode.listens.toLocaleString()}
            </div>
            <div>{episode.date}</div>
          </div>
          <button
            onClick={() => {
              setSelectedEpisode(episode);
              setIsModalOpen(true);
            }}
            className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors group/btn ${
              episode.type === 'video' 
                ? 'bg-slate-900 hover:bg-purple-700' 
                : 'bg-blue-600 hover:bg-orange-700'
            }`}
          >
            {episode.type === 'video' ? (
              <Video className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {episode.type === 'video' ? 'Regarder' : 'Écouter'}
          </button>
        </div>
      </div>
    </div>
  );

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Alimentation <span className="text-blue-600">&</span> Nutrition
            </h1>

            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Découvrez nos podcasts et vidéos sur la nutrition, la cuisine healthy, les recettes équilibrées et les astuces pour une alimentation saine au quotidien.
            </p>

            {/* Statistiques */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-200">
              <div className="flex items-center">
                <Headphones className="w-6 h-6 mr-2" />
                <span className="text-2xl font-bold text-white">{mediaEpisodes.reduce((total, ep) => total + ep.listens, 0).toLocaleString()}</span>
                <span className="ml-2">écoutes totales</span>
              </div>
              <div className="flex items-center">
                <Music className="w-6 h-6 mr-2" />
                <span className="text-2xl font-bold text-white">{audioEpisodes.length}</span>
                <span className="ml-2">podcasts audio</span>
              </div>
              <div className="flex items-center">
                <Video className="w-6 h-6 mr-2" />
                <span className="text-2xl font-bold text-white">{videoEpisodes.length}</span>
                <span className="ml-2">vidéos recettes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Cartes Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mediaEpisodes.length}</div>
            <div className="text-sm font-semibold text-gray-700">Contenus total</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mediaEpisodes.reduce((total, ep) => total + ep.listens, 0).toLocaleString()}
            </div>
            <div className="text-sm font-semibold text-gray-700">Écoutes totales</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-purple-600 mb-2">{audioEpisodes.length}</div>
            <div className="text-sm font-semibold text-gray-700">Podcasts audio</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-slate-600 mb-2">{videoEpisodes.length}</div>
            <div className="text-sm font-semibold text-gray-700">Vidéos recettes</div>
          </div>
        </div>

        {/* Navigation par sections */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-2 flex space-x-2 border border-gray-200">
            <button
              onClick={() => setActiveSection('audio')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                activeSection === 'audio'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Music className="w-6 h-6" />
              <span>Podcasts Audio ({audioEpisodes.length})</span>
            </button>
            <button
              onClick={() => setActiveSection('video')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
                activeSection === 'video'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Video className="w-6 h-6" />
              <span>Vidéos ({videoEpisodes.length})</span>
            </button>
          </div>
        </div>

        {/* Section Audio */}
        {activeSection === 'audio' && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-2xl">
                  <Music className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Podcasts Nutrition</h2>
                  <p className="text-gray-600">Écoutez nos experts en nutrition et alimentation</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border">
                {audioEpisodes.length} podcast(s) disponible(s)
              </div>
            </div>

            {audioEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {audioEpisodes.map((episode) => (
                  <MediaCard key={episode.id} episode={episode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
                <Music className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun podcast audio disponible</h3>
                <p className="text-gray-500">Revenez plus tard pour découvrir nos nouveaux podcasts nutrition</p>
              </div>
            )}
          </section>
        )}

        {/* Section Vidéo */}
        {activeSection === 'video' && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Video className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Vidéos Recettes & Cuisine</h2>
                  <p className="text-gray-600">Apprenez avec nos vidéos culinaires</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border">
                {videoEpisodes.length} vidéo(s) disponible(s)
              </div>
            </div>

            {videoEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoEpisodes.map((episode) => (
                  <MediaCard key={episode.id} episode={episode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border">
                <Video className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucune vidéo disponible</h3>
                <p className="text-gray-500">Revenez plus tard pour découvrir nos nouvelles vidéos recettes</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Modal Audio/Video */}
      {isModalOpen && selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false);
              setIsPlaying(false);
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
          />

          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Audio/Video Element */}
            {selectedEpisode.type === 'audio' ? (
              <audio
                ref={audioRef}
                src={selectedEpisode.audioUrl}
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <video
                ref={videoRef}
                src={selectedEpisode.videoUrl}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-64 object-cover"
                controls={false}
                poster={selectedEpisode.thumbnailUrl}
              />
            )}

            {/* Bouton fermeture */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsPlaying(false);
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
              className="absolute top-3 right-3 z-20 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1.5"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex p-4 border-b border-gray-200">
              {/* Image */}
              <div className="flex-shrink-0 mr-4">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                  selectedEpisode.type === 'video' ? 'bg-slate-900' : 'bg-blue-600'
                }`}>
                  {selectedEpisode.type === 'video' ? (
                    <Video className="w-8 h-8 text-white" />
                  ) : (
                    <Headphones className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>

              {/* Informations */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(selectedEpisode.category)}`}>
                    {selectedEpisode.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedEpisode.type === 'video' 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-orange-100 text-blue-600'
                  }`}>
                    {selectedEpisode.type === 'video' ? 'Vidéo' : 'Audio'}
                  </span>
                  {selectedEpisode.featured && (
                    <span className="flex items-center text-blue-600 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Vedette
                    </span>
                  )}
                </div>

                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {selectedEpisode.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedEpisode.duration}
                  </span>
                  <span className="flex items-center">
                    <Headphones className="w-3 h-3 mr-1" />
                    {selectedEpisode.listens.toLocaleString()}
                  </span>
                  <span>{selectedEpisode.date}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedEpisode.description}
                </p>
              </div>

              {/* Informations techniques */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Format</h4>
                  <p className="text-gray-600">{selectedEpisode.mimeType}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Taille</h4>
                  <p className="text-gray-600">{formatFileSize(selectedEpisode.fileSize || 0)}</p>
                </div>
              </div>
            </div>

            {/* Footer - Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3 mb-3">
                <button
                  onClick={handlePlayMedia}
                  className={`flex-1 flex items-center justify-center text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedEpisode.type === 'video'
                      ? 'bg-slate-900 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-orange-700'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                      En pause
                    </>
                  ) : (
                    <>
                      {selectedEpisode.type === 'video' ? (
                        <Video className="w-4 h-4 mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {selectedEpisode.type === 'video' ? 'Regarder' : 'Écouter'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-white transition-colors"
                  title={`Télécharger le ${selectedEpisode.type === 'video' ? 'vidéo' : 'podcast'}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </button>
                <button
                  onClick={() => selectedEpisode && toggleFavorite(selectedEpisode.id)}
                  className={`flex items-center justify-center border px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedEpisode && isFavorite(selectedEpisode.id)
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Ajouter aux favoris"
                >
                  <Heart className={`w-4 h-4 mr-2 ${selectedEpisode && isFavorite(selectedEpisode.id) ? 'fill-current' : ''}`} />
                  {selectedEpisode && isFavorite(selectedEpisode.id) ? 'Aimé' : 'J\'aime'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastsAlimentation;