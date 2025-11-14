// components/PodcastsImmobilier.tsx
import React, { useState, useEffect } from 'react';
import { Play, Headphones, Clock, Heart, Star, Download, Video, Home, TrendingUp, Sparkles } from 'lucide-react';
import { MediaService } from '../lib/api';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  listens: number;
  featured: boolean;
  audioUrl: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  mimeType?: string;
  fileSize?: number;
}

const PodcastsImmobilier: React.FC = () => {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // URLs audio fonctionnelles
  const workingAudioUrls = [
    "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    "https://www.soundjay.com/misc/sounds/bell-ringing-04.wav",
    "https://www.soundjay.com/button/sounds/button-09.wav",
    "https://www.soundjay.com/button/sounds/button-10.wav",
    "https://www.soundjay.com/nature/sounds/forest-ambience-1.wav",
    "https://www.soundjay.com/ambient/sounds/office-ambience-1.wav"
  ];

  // Charger les podcasts de la catégorie Immobilier
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Chargement des podcasts Immobilier...');
        const response = await MediaService.getPodcasts({ limit: 50 });
        
        console.log('📦 Réponse API:', response);
        
        const podcastsData = response.data?.data || response.data || response;
        
        if (Array.isArray(podcastsData)) {
          console.log('🎯 Données reçues:', podcastsData.length, 'éléments');
          
          const immobilierPodcasts: PodcastEpisode[] = podcastsData
            .filter((podcast: any) => {
              const isImmobilier = podcast.category === "Immobilier";
              const isActive = podcast.isActive !== false;
              console.log('📋 Filtrage:', podcast.title, '- Catégorie:', podcast.category, '- Actif:', isActive);
              return isImmobilier && isActive;
            })
            .map((podcast: any, index: number) => ({
              id: podcast.id,
              title: podcast.title,
              description: podcast.description || 'Aucune description disponible',
              duration: podcast.duration || "00:00:00",
              date: new Date(podcast.createdAt || podcast.date || new Date()).toLocaleDateString('fr-FR'),
              category: podcast.category,
              listens: podcast.listens || Math.floor(Math.random() * 1000) + 100,
              featured: podcast.listens > 500 || podcast.featured || false,
              audioUrl: podcast.audioUrl || workingAudioUrls[index % workingAudioUrls.length],
              thumbnailUrl: podcast.thumbnailUrl || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80`,
              isActive: podcast.isActive !== false,
              mimeType: podcast.mimeType || 'audio/mpeg',
              fileSize: podcast.fileSize || 0
            }));
          
          console.log('✅ Podcasts Immobilier chargés:', immobilierPodcasts.length);
          setPodcasts(immobilierPodcasts);
          
          // Si aucun podcast n'est trouvé, utiliser les données de fallback
          if (immobilierPodcasts.length === 0) {
            console.log('⚠️ Aucun podcast trouvé, utilisation des données de fallback');
            setPodcasts(getFallbackPodcasts());
          }
        } else {
          console.warn('⚠️ Format de données inattendu, utilisation des données de fallback');
          setPodcasts(getFallbackPodcasts());
        }
      } catch (err: any) {
        console.error('❌ Erreur lors du chargement des podcasts:', err);
        // Fallback en cas d'erreur
        setPodcasts(getFallbackPodcasts());
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  // Données de fallback
  const getFallbackPodcasts = (): PodcastEpisode[] => {
    return [
      {
        id: '1',
        title: "Investissement locatif : les bases pour bien débuter",
        description: "Guide complet pour se lancer dans l'investissement locatif. Rendement, fiscalité et choix du bien.",
        duration: "00:38:20",
        date: "15/03/2024",
        category: "Immobilier",
        listens: 2150,
        featured: true,
        audioUrl: workingAudioUrls[0],
        thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        mimeType: "audio/mpeg",
        fileSize: 36789123
      },
      {
        id: '2',
        title: "Marché immobilier 2024 : tendances et prévisions",
        description: "Analyse du marché actuel et perspectives pour l'année. Prix, taux d'emprunt et zones dynamiques.",
        duration: "00:42:15",
        date: "14/03/2024",
        category: "Immobilier",
        listens: 1870,
        featured: false,
        audioUrl: workingAudioUrls[1],
        thumbnailUrl: "https://images.unsplash.com/photo-1570126618953-d437176e8c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        mimeType: "audio/mpeg",
        fileSize: 41234567
      },
      {
        id: '3',
        title: "Crédit immobilier : optimiser son dossier d'emprunt",
        description: "Conseils pour obtenir le meilleur taux et monter un dossier solide. Apport, endettement et assurances.",
        duration: "00:35:40",
        date: "13/03/2024",
        category: "Immobilier",
        listens: 2420,
        featured: true,
        audioUrl: workingAudioUrls[2],
        thumbnailUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        mimeType: "audio/mpeg",
        fileSize: 34567890
      },
      {
        id: '4',
        title: "Rénovation : augmenter la valeur de son bien",
        description: "Travaux qui rapportent le plus et astuces pour optimiser son budget rénovation. ROI et priorisation.",
        duration: "00:31:55",
        date: "12/03/2024",
        category: "Immobilier",
        listens: 1650,
        featured: false,
        audioUrl: workingAudioUrls[3],
        thumbnailUrl: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        mimeType: "audio/mpeg",
        fileSize: 31234567
      },
      {
        id: '5',
        title: "Défiscalisation immobilière : Pinel, LMNP, Malraux",
        description: "Comparatif des dispositifs de défiscalisation. Avantages, inconvénients et critères d'éligibilité.",
        duration: "00:45:30",
        date: "11/03/2024",
        category: "Immobilier",
        listens: 1320,
        featured: false,
        audioUrl: workingAudioUrls[4],
        thumbnailUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        mimeType: "audio/mpeg",
        fileSize: 45678901
      }
    ];
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (selectedEpisode) {
      const link = document.createElement('a');
      link.href = selectedEpisode.audioUrl;
      link.download = `${selectedEpisode.title}.mp3`;
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
      'Entreprise': 'bg-gradient-to-r from-purple-500 to-pink-500'
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

  if (loading) {
    return (
      <section className="py-8 mt-12 rounded-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des podcasts Immobilier...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 mt-12 rounded-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-800 font-medium mb-2">Erreur de chargement</p>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 mt-12 rounded-lg">
      <div className=" mx-auto px-4 max-w-7xl">
        {/* En-tête avec background image */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0">
            <img 
              src="https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg" 
              alt="Immobilier" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative z-10 p-8 h-64 flex flex-col justify-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-xs font-semibold mb-4 self-start">
              <Sparkles className="w-4 h-4 mr-2" />
              Podcasts et vidéos
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Podcasts Immobilier
            </h2>
            <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
              Découvrez nos conseils experts pour investir, acheter, vendre et gérer votre patrimoine immobilier
            </p>
            
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-200">
              <div className="flex items-center">
                <Headphones className="w-4 h-4 mr-1" />
                {podcasts.reduce((total, ep) => total + ep.listens, 0).toLocaleString()} écoutes totales
              </div>
              <div>{podcasts.length} épisodes</div>
              <div>{podcasts.filter(ep => ep.featured).length} contenus en vedette</div>
            </div>
          </div>
        </div>

        {/* Liste des podcasts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${
                podcast.featured ? 'border-2 border-blue-600' : 'border-gray-200'
              }`}
            >
              {podcast.featured && (
                <div className="bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl">
                  ⭐ Épisode en vedette
                </div>
              )}
              
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-sm">
                <img
                  src={podcast.thumbnailUrl}
                  alt={podcast.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                
                {/* Bouton play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(podcast.category)}`}>
                    {podcast.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {podcast.duration}
                  </div>
                </div>

                <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {podcast.title}
                </h4>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {podcast.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Headphones className="w-4 h-4 mr-1" />
                      {podcast.listens.toLocaleString()}
                    </div>
                    <div>{podcast.date}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEpisode(podcast);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors group/btn"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Écouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun podcast */}
        {podcasts.length === 0 && (
          <div className="text-center py-16">
            <Home className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun podcast disponible</h3>
            <p className="text-gray-500">Revenez plus tard pour découvrir nos nouveaux épisodes sur l'immobilier</p>
          </div>
        )}

        {/* Modal Podcast */}
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
              }}
            />

            {/* Modal Content */}
            <div className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Audio Element */}
              <audio
                ref={audioRef}
                src={selectedEpisode.audioUrl}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Bouton fermeture */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsPlaying(false);
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
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
                  <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(selectedEpisode.category)}`}>
                      {selectedEpisode.category}
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
                    onClick={handlePlayAudio}
                    className="flex-1 flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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
                        <Play className="w-4 h-4 mr-2" />
                        Écouter
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-white transition-colors"
                    title="Télécharger l'épisode"
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
    </section>
  );
};

export default PodcastsImmobilier;