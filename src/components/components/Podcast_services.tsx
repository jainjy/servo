import React, { useState, useEffect } from 'react';
import { Play, Headphones, Mic, Video, BookOpen, Users, Download, Share2, Clock, Heart, MessageCircle, ArrowRight, Sparkles, TrendingUp, Lightbulb, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MediaService } from '../../lib/api'; // Ajustez le chemin selon votre structure

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  guests?: string[];
  listens: number;
  featured: boolean;
  audioUrl: string;
  downloadUrl: string;
  isActive?: boolean;
  thumbnailUrl?: string;
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
  cta: string;
}

interface ResourceItem {
  title: string;
  type: 'ebook' | 'template' | 'checklist' | 'worksheet';
  description: string;
  downloadCount: number;
}

const PodcastsServices: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [podcastEpisodes, setPodcastEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Charger les podcasts depuis l'API
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await MediaService.getPodcasts({ limit: 50 });
        
        // Extraire les données selon la structure de votre API
        const podcastsData = response.data?.data || response.data || response;
        
        if (Array.isArray(podcastsData)) {
          // Transformer les données de l'API en format compatible avec le frontend
          const formattedPodcasts: PodcastEpisode[] = podcastsData
            .filter((podcast: any) => podcast.isActive !== false && (podcast.category === 'Entreprise' || !podcast.category)) // Filtrer les podcasts actifs de la catégorie Entreprise uniquement
            .map((podcast: any) => ({
              id: podcast.id,
              title: podcast.title,
              description: podcast.description || 'Aucune description disponible',
              duration: podcast.duration || "00:00:00",
              date: new Date(podcast.createdAt).toLocaleDateString('fr-FR'),
              category: podcast.category || 'Entreprise',
              listens: podcast.listens || 0,
              featured: podcast.listens > 1000, // Exemple de logique pour "featured"
              audioUrl: podcast.audioUrl || '#',
              downloadUrl: podcast.audioUrl || '#',
              thumbnailUrl: podcast.thumbnailUrl
            }));
          
          setPodcastEpisodes(formattedPodcasts);
        } else {
          console.error('Format de données inattendu:', podcastsData);
          setError('Erreur lors du chargement des podcasts');
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

  const services: ServiceCardProps[] = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Studio d'enregistrement",
      description: "Studio professionnel équipé pour vos podcasts, interviews et contenus audio.",
      features: [
        "Équipement professionnel audio/vidéo",
        "Ingénieur du son dédié",
        "Montage et post-production",
        "Plateforme de diffusion"
      ],
      color: "blue",
      cta: "Réserver le studio"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Production vidéo",
      description: "Création de contenus vidéo professionnels pour vos réseaux sociaux et site web.",
      features: [
        "Tournage et réalisation",
        "Motion design et animation",
        "Sous-titrage multilingue",
        "Optimisation pour les réseaux"
      ],
      color: "purple",
      cta: "Voir les réalisations"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Formations interactives",
      description: "Modules de formation en ligne et ateliers pratiques pour développer vos compétences.",
      features: [
        "Formations certifiantes",
        "Coaching personnalisé",
        "Communauté d'entrepreneurs",
        "Ressources exclusives"
      ],
      color: "green",
      cta: "Découvrir les formations"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Réseau & Networking",
      description: "Rencontres et événements pour connecter avec d'autres entrepreneurs et experts.",
      features: [
        "Événements mensuels",
        "Mastermind groups",
        "Rencontres B2B",
        "Annuaire des membres"
      ],
      color: "orange",
      cta: "Rejoindre le réseau"
    }
  ];

  const resources: ResourceItem[] = [
    {
      title: "Guide du business plan",
      type: 'ebook',
      description: "Modèle complet et conseils pour un business plan convaincant",
      downloadCount: 2840
    },
    {
      title: "Template de pitch deck",
      type: 'template',
      description: "Structure optimale pour présenter votre projet aux investisseurs",
      downloadCount: 1950
    },
    {
      title: "Checklist création d'entreprise",
      type: 'checklist',
      description: "Toutes les étapes pour lancer votre entreprise sans rien oublier",
      downloadCount: 3120
    },
    {
      title: "Calculateur de prévisionnel",
      type: 'worksheet',
      description: "Outil Excel pour construire vos prévisions financières",
      downloadCount: 1670
    }
  ];

  // Catégories basées sur les données réelles
  const categories = [
    { id: 'tous', label: 'Tous les épisodes', count: podcastEpisodes.length },
    { id: 'favoris', label: 'Favoris', count: podcastEpisodes.filter(ep => favorites.includes(ep.id)).length }
  ];

  const filteredEpisodes = activeCategory === 'tous'
    ? podcastEpisodes
    : activeCategory === 'favoris'
      ? podcastEpisodes.filter(ep => favorites.includes(ep.id))
      : podcastEpisodes.filter(ep => ep.category === activeCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Entreprise': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'croissance': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'financement': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'marketing': 'bg-gradient-to-r from-purple-500 to-pink-500',
      'productivite': 'bg-gradient-to-r from-orange-500 to-red-500',
      'rh': 'bg-gradient-to-r from-indigo-500 to-blue-500',
      'international': 'bg-gradient-to-r from-teal-500 to-green-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getServiceColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color as keyof typeof colors];
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
      link.href = selectedEpisode.downloadUrl;
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

  if (loading) {
    return (
      <section className="py-8 mt-12 rounded-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des podcasts...</p>
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
      <div className="container mx-auto px-4 max-w-7xl">
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img src="https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg" alt="" />
          <div className="absolute left-2 bottom-0 inline-flex items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Ressources & Contenus Exclusifs
          </div>
        </div>

        {/* En-tête avec animation */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Podcasts & Services
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos ressources gratuites et services premium pour booster
            votre parcours entrepreneurial. De l'inspiration à l'action.
          </p>
        </div>

        {/* Podcasts Section */}
        <div className="mb-20 pt-5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Headphones className="w-8 h-8 mr-3 text-slate-900" />
                Podcast "Entrepreneurial Spirit"
              </h3>
              <p className="text-gray-600 text-sm">Des interviews inspirantes et conseils pratiques pour entrepreneurs</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-200 bg-gray-950 px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>{podcastEpisodes.reduce((total, ep) => total + ep.listens, 0).toLocaleString()} écoutes totales</span>
            </div>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {category.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
                  }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Épisodes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEpisodes.length === 0 ? (
              <div className="col-span-full text-center py-16">
                {activeCategory === 'favoris' ? (
                  <>
                    <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun favoris pour le moment</h3>
                    <p className="text-gray-500 mb-6">Ajoutez vos épisodes préférés en cliquant sur le cœur dans la modale</p>
                    <button
                      onClick={() => setActiveCategory('tous')}
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Découvrir les épisodes
                    </button>
                  </>
                ) : (
                  <>
                    <Headphones className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun podcast disponible</h3>
                    <p className="text-gray-500">Revenez plus tard pour découvrir nos nouveaux épisodes</p>
                  </>
                )}
              </div>
            ) : (
              filteredEpisodes.map((episode) => (
                <div
                  key={episode.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${episode.featured ? 'border-2 border-blue-500' : 'border-gray-200'
                    }`}
                >
                  {episode.featured && (
                    <div className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl">
                      ⭐ Épisode en vedette
                    </div>
                  )}
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

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {episode.description}
                    </p>

                    {episode.guests && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Avec :</p>
                        {episode.guests.map((guest, index) => (
                          <p key={index} className="text-sm text-gray-700">{guest}</p>
                        ))}
                      </div>
                    )}

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
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors group/btn"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Écouter
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ressources Gratuites */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Download className="w-8 h-8 mr-3 text-green-600" />
                Ressources Gratuites
              </h3>
              <p className="text-gray-600">Téléchargez nos outils et templates pour entrepreneurs</p>
            </div>
            <div className="text-sm text-gray-500">
              <Lightbulb className="w-5 h-5 inline mr-1" />
              Mises à jour régulières
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Download className="w-3 h-3 mr-1" />
                    {resource.downloadCount}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {resource.description}
                </p>
                <button className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center">
                  Télécharger gratuitement
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Rejoignez Notre Communauté
            </h3>
            <p className="text-blue-100 text-sm mb-6 max-w-2xl mx-auto">
              Accédez à l'ensemble de nos ressources, participez aux événements exclusifs
              et connectez-vous avec une communauté d'entrepreneurs passionnés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg text-sm flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Rejoindre gratuitement
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors text-sm flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                <Link to="/services-partners">
                  Découvrir tous les services
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

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
                <div className="w-16 h-16 rounded-lg bg-blue-500 flex items-center justify-center">
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
    </section>
  );
};

export default PodcastsServices;