// components/PodcastsAssuranceFinance.tsx
import React, { useState, useEffect } from 'react';
import { Play, Headphones, Clock, Heart, Star, Download, Video, Music, TrendingUp, Shield } from 'lucide-react';
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

const PodcastsAssuranceFinance: React.FC = () => {
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
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1554224154-2604b1ba14e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  ];

  // Images pour les podcasts audio
  const audioThumbnails = [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1554224154-2604b1ba14e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  ];

  // Charger les médias de la catégorie Assurance et Finance
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Chargement des médias Assurance et Finance...');
        const response = await MediaService.getPodcasts({ limit: 50 });
        
        console.log('📦 Réponse API:', response);
        
        const mediaData = response.data?.data || response.data || response;
        
        if (Array.isArray(mediaData)) {
          console.log('🎯 Données reçues:', mediaData.length, 'éléments');
          
          const assuranceFinanceMedia: MediaEpisode[] = mediaData
            .filter((media: any) => {
              const isAssuranceFinance = media.category === "Assurance et Finance";
              const isActive = media.isActive !== false;
              console.log('📋 Filtrage:', media.title, '- Catégorie:', media.category, '- Actif:', isActive);
              return isAssuranceFinance && isActive;
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
          
          console.log('✅ Médias Assurance et Finance chargés:', assuranceFinanceMedia.length);
          setMediaEpisodes(assuranceFinanceMedia);
          
          // Si aucun média n'est trouvé, utiliser les données de fallback
          if (assuranceFinanceMedia.length === 0) {
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
        title: "Assurance vie : optimiser son contrat en 2024",
        description: "Tout savoir sur l'assurance vie : supports d'investissement, fiscalité, arbitrage et transmission.",
        duration: "00:41:15",
        date: "18/03/2024",
        category: "Assurance et Finance",
        listens: 2890,
        featured: true,
        audioUrl: freeAudioUrls[0],
        videoUrl: freeVideoUrls[0],
        thumbnailUrl: audioThumbnails[0],
        type: 'audio',
        mimeType: 'audio/mpeg',
        fileSize: 42345678
      },
      {
        id: '2',
        title: "Épargne retraite : les meilleures solutions",
        description: "Comparatif PER, PERP, assurance vie et autres solutions pour préparer sa retraite sereinement.",
        duration: "00:37:50",
        date: "17/03/2024",
        category: "Assurance et Finance",
        listens: 2340,
        featured: false,
        audioUrl: freeAudioUrls[1],
        videoUrl: freeVideoUrls[1],
        thumbnailUrl: audioThumbnails[1],
        type: 'audio',
        mimeType: 'audio/mpeg',
        fileSize: 38901234
      },
      {
        id: '3',
        title: "Investissement boursier : débuter en Bourse",
        description: "Les bases pour investir en Bourse : actions, ETF, PEA et stratégies pour débutants.",
        duration: "00:44:20",
        date: "16/03/2024",
        category: "Assurance et Finance",
        listens: 3120,
        featured: true,
        audioUrl: freeAudioUrls[2],
        videoUrl: freeVideoUrls[2],
        thumbnailUrl: audioThumbnails[2],
        type: 'audio',
        mimeType: 'audio/mpeg',
        fileSize: 46789012
      },
      // Vidéos
      {
        id: '4',
        title: "Tableau de bord financier : suivi en temps réel",
        description: "Démonstration d'un tableau de bord Excel avancé pour suivre ses investissements et son patrimoine.",
        duration: "00:28:40",
        date: "15/03/2024",
        category: "Assurance et Finance",
        listens: 3560,
        featured: true,
        audioUrl: freeAudioUrls[3],
        videoUrl: freeVideoUrls[3],
        thumbnailUrl: videoThumbnails[0],
        type: 'video',
        mimeType: 'video/mp4',
        fileSize: 187654321
      },
      {
        id: '5',
        title: "Analyse graphique : lire les courbes boursières",
        description: "Formation vidéo sur l'analyse technique : supports, résistances et indicateurs clés.",
        duration: "00:35:20",
        date: "14/03/2024",
        category: "Assurance et Finance",
        listens: 2980,
        featured: false,
        audioUrl: freeAudioUrls[4],
        videoUrl: freeVideoUrls[4],
        thumbnailUrl: videoThumbnails[1],
        type: 'video',
        mimeType: 'video/mp4',
        fileSize: 245678901
      },
      {
        id: '6',
        title: "Simulateur de retraite : projection interactive",
        description: "Utilisation d'un simulateur pour estimer sa retraite et ajuster sa stratégie d'épargne.",
        duration: "00:22:15",
        date: "13/03/2024",
        category: "Assurance et Finance",
        listens: 2670,
        featured: false,
        audioUrl: freeAudioUrls[5],
        videoUrl: freeVideoUrls[5],
        thumbnailUrl: videoThumbnails[2],
        type: 'video',
        mimeType: 'video/mp4',
        fileSize: 167890123
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
      'Assurance et Finance': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'Immobilier': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'Bâtiment & Construction': 'bg-gradient-to-r from-orange-500 to-amber-500',
      'Bien-être & Santé': 'bg-gradient-to-r from-purple-500 to-pink-500',
      'Entreprise': 'bg-gradient-to-r from-indigo-500 to-blue-500',
      'Alimentation': 'bg-gradient-to-r from-orange-500 to-amber-500'
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
          <div className="text-gray-600">Chargement des contenus Assurance et Finance...</div>
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
    <div className="container mx-auto px-4 mt-10 py-8">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <div className="flex items-center">
            <TrendingUp className="w-10 h-10 mr-2 text-blue-600" />
            <Shield className="w-10 h-10 mr-4 text-blue-600" />
          </div>
          Contenus Assurance et Finance
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Maîtrisez vos finances et optimisez votre patrimoine avec nos experts en assurance, épargne, investissement et fiscalité.
        </p>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Headphones className="w-4 h-4 mr-1" />
            {mediaEpisodes.reduce((total, ep) => total + ep.listens, 0).toLocaleString()} écoutes totales
          </div>
          <div className="flex items-center">
            <Music className="w-4 h-4 mr-1" />
            {audioEpisodes.length} podcasts audio
          </div>
          <div className="flex items-center">
            <Video className="w-4 h-4 mr-1" />
            {videoEpisodes.length} vidéos
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{mediaEpisodes.length}</div>
          <div className="text-sm text-green-700">Contenus total</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mediaEpisodes.reduce((total, ep) => total + ep.listens, 0).toLocaleString()}
          </div>
          <div className="text-sm text-blue-700">Écoutes totales</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {audioEpisodes.length}
          </div>
          <div className="text-sm text-purple-700">Podcasts audio</div>
        </div>
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-slate-600">
            {videoEpisodes.length}
          </div>
          <div className="text-sm text-slate-700">Vidéos formation</div>
        </div>
      </div>

      {/* Navigation par sections */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex space-x-2">
          <button
            onClick={() => setActiveSection('audio')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              activeSection === 'audio'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Music className="w-5 h-5" />
            <span>Podcasts Audio ({audioEpisodes.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('video')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              activeSection === 'video'
                ? 'bg-slate-900 text-white shadow-md'
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
              Podcasts Finance
            </h2>
            <div className="text-sm text-gray-500">
              {audioEpisodes.length} podcast(s) disponible(s)
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
              <p className="text-gray-500">Revenez plus tard pour découvrir nos nouveaux podcasts finance</p>
            </div>
          )}
        </section>
      )}

      {/* Section Vidéo */}
      {activeSection === 'video' && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Video className="w-8 h-8 mr-3 text-purple-600" />
              Vidéos Formation
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
              <p className="text-gray-500">Revenez plus tard pour découvrir nos nouvelles vidéos formation</p>
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
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                  selectedEpisode.type === 'video' ? 'bg-slate-900' : 'bg-blue-600'
                }`}>
                  {selectedEpisode.type === 'video' ? (
                    <Video className="w-8 h-8 text-white" />
                  ) : (
                    <TrendingUp className="w-8 h-8 text-white" />
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
                      : 'bg-green-100 text-blue-600'
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
                      : 'bg-blue-600 hover:bg-blue-700'
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

export default PodcastsAssuranceFinance;