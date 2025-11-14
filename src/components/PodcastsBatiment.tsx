// components/PodcastsBatiment.tsx
import React, { useState, useEffect } from 'react';
import { Play, Headphones, Clock, Heart, Star, Download } from 'lucide-react';
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
}

const PodcastsBatiment: React.FC = () => {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Charger les podcasts de la catégorie Bâtiment & Construction
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await MediaService.getPodcasts({ limit: 50 });
        
        const podcastsData = response.data?.data || response.data || response;
        
        if (Array.isArray(podcastsData)) {
          const batimentPodcasts: PodcastEpisode[] = podcastsData
            .filter((podcast: any) => 
              podcast.isActive !== false && 
              podcast.category === "Bâtiment & Construction"
            )
            .map((podcast: any) => ({
              id: podcast.id,
              title: podcast.title,
              description: podcast.description || 'Aucune description disponible',
              duration: podcast.duration || "00:00:00",
              date: new Date(podcast.createdAt).toLocaleDateString('fr-FR'),
              category: podcast.category,
              listens: podcast.listens || 0,
              featured: podcast.listens > 500,
              audioUrl: podcast.audioUrl || '#',
              thumbnailUrl: podcast.thumbnailUrl
            }));
          
          setPodcasts(batimentPodcasts);
        } else {
          setError('Format de données inattendu');
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des podcasts:', err);
        setError(err.response?.data?.error || err.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

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
      'Bâtiment & Construction': 'bg-gradient-to-r from-orange-500 to-amber-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">Chargement des podcasts...</div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Headphones className="w-10 h-10 mr-4 text-blue-600" />
          Podcasts Bâtiment & Construction
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Découvrez nos podcasts spécialisés sur les nouvelles réglementations, 
          les matériaux innovants et les meilleures pratiques du secteur du BTP.
        </p>
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Headphones className="w-4 h-4 mr-1" />
            {podcasts.reduce((total, ep) => total + ep.listens, 0).toLocaleString()} écoutes totales
          </div>
          <div>{podcasts.length} épisodes</div>
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
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors group/btn"
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
          <Headphones className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun podcast disponible</h3>
          <p className="text-gray-500">Revenez plus tard pour découvrir nos nouveaux épisodes</p>
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
                    <span className="flex items-center text-blue-600text-xs">
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
                  onClick={handlePlayAudio}
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
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
  );
};

export default PodcastsBatiment;