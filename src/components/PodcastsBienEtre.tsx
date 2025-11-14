// components/PodcastsBienEtre.tsx
import React, { useState, useEffect } from 'react';
import { Play, Headphones, Clock, Heart, Star, Download, Video, Music } from 'lucide-react';
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
}

const PodcastsBienEtre: React.FC = () => {
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
    "https://www.soundjay.com/ambient/sounds/office-ambience-1.wav",
    "https://www.soundjay.com/weather/sounds/light-rain-1.wav",
    "https://www.soundjay.com/weather/sounds/ocean-waves-1.wav",
    "https://www.soundjay.com/mechanical/sounds/wind-chimes-1.wav",
    "https://www.soundjay.com/mechanical/sounds/wind-chimes-2.wav"
  ];

  const freeVideoUrls = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  ];

  // Images pour les vidéos
  const videoThumbnails = [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1518607692856-c6d6d39d8e82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  ];

  // Images pour les podcasts audio
  const audioThumbnails = [
    "https://images.unsplash.com/photo-1590658165737-15a047b8b5e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  ];

  // Charger les médias de la catégorie Bien-être
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await MediaService.getPodcasts({ limit: 50 });

        const mediaData = response.data?.data || response.data || response;

        if (Array.isArray(mediaData)) {
          const bienEtreMedia: MediaEpisode[] = mediaData
            .filter((media: any) =>
              media.isActive !== false &&
              media.category === "Bien-être"  // Changé de "Bien-être & Santé" à "Bien-être"
            )
            .map((media: any, index: number) => ({
              id: media.id,
              title: media.title,
              description: media.description || 'Aucune description disponible',
              duration: media.duration || "00:00:00",
              date: new Date(media.createdAt).toLocaleDateString('fr-FR'),
              category: media.category,
              listens: media.listens || Math.floor(Math.random() * 1000) + 100,
              featured: media.listens > 500,
              audioUrl: media.audioUrl || freeAudioUrls[index % freeAudioUrls.length],
              videoUrl: freeVideoUrls[index % freeVideoUrls.length],
              thumbnailUrl: media.thumbnailUrl || getThumbnailByType(media.type || (index % 2 === 0 ? 'audio' : 'video'), index),
              type: media.type || (index % 2 === 0 ? 'audio' : 'video')
            }));

          setMediaEpisodes(bienEtreMedia);
        } else {
          // Fallback si l'API ne retourne pas de données
          setMediaEpisodes(getFallbackMedia());
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des médias:', err);
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

  // Données de fallback pour Bien-être
  const getFallbackMedia = (): MediaEpisode[] => {
    return [
      // Podcasts Audio - Bien-être
      {
        id: '1',
        title: "Méditation guidée : retrouvez votre paix intérieure",
        description: "Séance de méditation complète pour se recentrer et apaiser l'esprit. Techniques de respiration et visualisation pour un bien-être profond.",
        duration: "00:25:30",
        date: "15/03/2024",
        category: "Bien-être",
        listens: 1250,
        featured: true,
        audioUrl: freeAudioUrls[0],
        videoUrl: freeVideoUrls[0],
        thumbnailUrl: audioThumbnails[0],
        type: 'audio'
      },
      {
        id: '2',
        title: "Yoga du matin : énergie et vitalité",
        description: "Routine de yoga douce pour bien commencer la journée. Postures adaptées à tous les niveaux pour réveiller le corps en douceur.",
        duration: "00:32:15",
        date: "14/03/2024",
        category: "Bien-être",
        listens: 980,
        featured: false,
        audioUrl: freeAudioUrls[1],
        videoUrl: freeVideoUrls[1],
        thumbnailUrl: audioThumbnails[1],
        type: 'audio'
      },
      {
        id: '3',
        title: "Nutrition consciente : mangez en pleine conscience",
        description: "Découvrez comment transformer votre relation avec la nourriture. Techniques pour une alimentation intuitive et équilibrée.",
        duration: "00:28:45",
        date: "13/03/2024",
        category: "Bien-être",
        listens: 870,
        featured: false,
        audioUrl: freeAudioUrls[2],
        videoUrl: freeVideoUrls[2],
        thumbnailUrl: audioThumbnails[2],
        type: 'audio'
      },
      {
        id: '4',
        title: "Gestion du stress : techniques au quotidien",
        description: "Méthodes pratiques pour réduire le stress et l'anxiété dans votre vie quotidienne. Outils concrets et faciles à appliquer.",
        duration: "00:35:20",
        date: "12/03/2024",
        category: "Bien-être",
        listens: 1120,
        featured: true,
        audioUrl: freeAudioUrls[3],
        videoUrl: freeVideoUrls[3],
        thumbnailUrl: audioThumbnails[3],
        type: 'audio'
      },
      // Vidéos - Bien-être
      {
        id: '5',
        title: "Séance de yoga complète en vidéo",
        description: "Pratique guidée de yoga flow pour tous niveaux. Instructions détaillées et modifications pour chaque posture.",
        duration: "00:45:20",
        date: "12/03/2024",
        category: "Bien-être",
        listens: 1560,
        featured: true,
        audioUrl: freeAudioUrls[4],
        videoUrl: freeVideoUrls[4],
        thumbnailUrl: videoThumbnails[0],
        type: 'video'
      },
      {
        id: '6',
        title: "Méditation en pleine nature",
        description: "Séance de méditation immersive au cœur de la forêt. Sons naturels et guidance douce pour une connexion profonde.",
        duration: "00:35:15",
        date: "11/03/2024",
        category: "Bien-être",
        listens: 1120,
        featured: false,
        audioUrl: freeAudioUrls[5],
        videoUrl: freeVideoUrls[5],
        thumbnailUrl: videoThumbnails[1],
        type: 'video'
      },
      {
        id: '7',
        title: "Cours de pilates débutant",
        description: "Découverte du pilates avec des exercices fondamentaux. Renforcement musculaire en douceur et amélioration de la posture.",
        duration: "00:38:40",
        date: "10/03/2024",
        category: "Bien-être",
        listens: 890,
        featured: false,
        audioUrl: freeAudioUrls[6],
        videoUrl: freeVideoUrls[6],
        thumbnailUrl: videoThumbnails[2],
        type: 'video'
      },
      {
        id: '8',
        title: "Auto-massage détente : techniques simples",
        description: "Apprenez à vous masser pour relâcher les tensions du cou, des épaules et du dos. Techniques accessibles à tous.",
        duration: "00:28:30",
        date: "09/03/2024",
        category: "Bien-être",
        listens: 1340,
        featured: true,
        audioUrl: freeAudioUrls[7],
        videoUrl: freeVideoUrls[7],
        thumbnailUrl: videoThumbnails[3],
        type: 'video'
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
      'Bien-être': 'bg-gradient-to-r from-green-500 to-teal-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  // Filtrer les médias par type
  const audioEpisodes = mediaEpisodes.filter(episode => episode.type === 'audio');
  const videoEpisodes = mediaEpisodes.filter(episode => episode.type === 'video');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">Chargement des contenus bien-être...</div>
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
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${episode.featured ? 'border-2 border-green-500' : 'border-gray-200'
        }`}
    >
      {episode.featured && (
        <div className="bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl flex items-center justify-center">
          <Star className="w-3 h-3 mr-1" />
          {episode.type === 'video' ? ' Vidéo en vedette' : ' Audio en vedette'}
        </div>
      )}

      {/* Image/Thumbnail */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          src={episode.thumbnailUrl}
          alt={episode.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Badge type */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${episode.type === 'video'
              ? 'bg-purple-500 text-white'
              : 'bg-blue-500 text-white'
            }`}>
            {episode.type === 'video' ? 'VIDÉO' : 'AUDIO'}
          </span>
        </div>

        {/* Bouton play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
            {episode.type === 'video' ? (
              <Video className="w-8 h-8 text-blue-600" />
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
            className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors group/btn ${episode.type === 'video'
                ? 'bg-blue-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-green-700'
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
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}

      {/* Navigation par sections */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex space-x-2">
          <button
            onClick={() => setActiveSection('audio')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${activeSection === 'audio'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Music className="w-5 h-5" />
            <span>Podcasts Audio ({audioEpisodes.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('video')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${activeSection === 'video'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Video className="w-5 h-5" />
            <span>Vidéos ({videoEpisodes.length})</span>
          </button>
        </div>
      </div>

      {/* Section Audio */}
      {activeSection === 'audio' && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Music className="w-8 h-8 mr-3 text-blue-600" />
              Podcasts Bien-être
            </h2>
            <div className="text-sm text-gray-500">
              {audioEpisodes.length} contenu(s) disponible(s)
            </div>
          </div>

          {audioEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {audioEpisodes.map((episode) => (
                <MediaCard key={episode.id} episode={episode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Music className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun podcast audio disponible</h3>
              <p className="text-gray-500">Revenez plus tard pour découvrir nos nouveaux podcasts</p>
            </div>
          )}
        </section>
      )}

      {/* Section Vidéo */}
      {activeSection === 'video' && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Video className="w-8 h-8 mr-3 text-blue-600" />
              Vidéos Bien-être
            </h2>
            <div className="text-sm text-gray-500">
              {videoEpisodes.length} vidéo(s) disponible(s)
            </div>
          </div>

          {videoEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoEpisodes.map((episode) => (
                <MediaCard key={episode.id} episode={episode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucune vidéo disponible</h3>
              <p className="text-gray-500">Revenez plus tard pour découvrir nos nouvelles vidéos</p>
            </div>
          )}
        </section>
      )}

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
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${selectedEpisode.type === 'video' ? 'bg-blue-600' : 'bg-blue-600'
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
                  <span className={`px-2 py-1 rounded text-xs font-medium ${selectedEpisode.type === 'video'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-blue-100 text-blue-600'
                    }`}>
                    {selectedEpisode.type === 'video' ? 'Vidéo' : 'Audio'}
                  </span>
                  {selectedEpisode.featured && (
                    <span className="flex items-center text-yellow-600 text-xs">
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
            </div>

            {/* Footer - Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3 mb-3">
                <button
                  onClick={handlePlayMedia}
                  className={`flex-1 flex items-center justify-center text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedEpisode.type === 'video'
                      ? 'bg-blue-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-green-700'
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
                  className={`flex items-center justify-center border px-3 py-2 rounded-lg text-sm transition-colors ${selectedEpisode && isFavorite(selectedEpisode.id)
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

export default PodcastsBienEtre;