import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Headphones, Mic, Video, BookOpen, Users, Download, Share2, Clock, Heart, MessageCircle, ArrowRight, Sparkles, TrendingUp, Lightbulb, Calendar, Star, Home, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MediaService } from '../../lib/api';

interface MediaEpisode {
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
  mimeType: string;
  fileSize: number;
  type: 'audio' | 'video';
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

const PodcastsDomicile: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('tous');
  const [activeMediaType, setActiveMediaType] = useState<'tous' | 'audio' | 'video'>('tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<MediaEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mediaEpisodes, setMediaEpisodes] = useState<MediaEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Charger les médias depuis l'API
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await MediaService.getPodcasts({ limit: 50 });
        
        const mediaData = response.data?.data || response.data || response;
        
        if (Array.isArray(mediaData)) {
          const formattedMedia: MediaEpisode[] = mediaData
            .filter((media: any) => media.isActive !== false && media.category === 'Domicile')
            .map((media: any) => ({
              id: media.id,
              title: media.title,
              description: media.description || 'Aucune description disponible',
              duration: media.duration || "00:00",
              date: new Date(media.createdAt).toLocaleDateString('fr-FR'),
              category: media.category || 'Domicile',
              listens: media.listens || 0,
              featured: media.listens > 1000,
              audioUrl: media.audioUrl || '#',
              downloadUrl: media.audioUrl || '#',
              thumbnailUrl: media.thumbnailUrl,
              mimeType: media.mimeType || 'audio/mpeg',
              fileSize: media.fileSize || 0,
              type: media.mimeType?.startsWith('video/') ? 'video' : 'audio'
            }));
          
          setMediaEpisodes(formattedMedia);
        } else {
          console.error('Format de données inattendu:', mediaData);
          setError('Erreur lors du chargement des médias');
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des médias:', err);
        setError(err.response?.data?.error || err.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const services: ServiceCardProps[] = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Conseil en décoration",
      description: "Expertise personnalisée pour l'aménagement et la décoration de votre intérieur.",
      features: [
        "Audit de votre espace",
        "Plan d'aménagement 3D",
        "Sélection de mobilier",
        "Accompagnement shopping"
      ],
      color: "green",
      cta: "Demander un devis"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Visite virtuelle",
      description: "Création de visites 360° pour présenter votre bien immobilier.",
      features: [
        "Photographie professionnelle",
        "Montage vidéo",
        "Integration web",
        "Optimisation SEO"
      ],
      color: "blue",
      cta: "Voir des exemples"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Ateliers DIY",
      description: "Apprenez les techniques de bricolage et décoration lors d'ateliers pratiques.",
      features: [
        "Matériel fourni",
        "Groupes réduits",
        "Support vidéo",
        "Communauté d'entraide"
      ],
      color: "orange",
      cta: "Voir le calendrier"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Réseau d'artisans",
      description: "Mise en relation avec des artisans qualifiés pour vos travaux.",
      features: [
        "Artisans vérifiés",
        "Devis comparatifs",
        "Suivi de chantier",
        "Garantie de qualité"
      ],
      color: "purple",
      cta: "Trouver un artisan"
    }
  ];

  const resources: ResourceItem[] = [
    {
      title: "Guide d'aménagement petit espace",
      type: 'ebook',
      description: "50 astuces pour optimiser les petites surfaces",
      downloadCount: 3240
    },
    {
      title: "Planificateur de rénovation",
      type: 'template',
      description: "Calendrier et checklist pour vos travaux",
      downloadCount: 2870
    },
    {
      title: "Checklist entretien saisonnier",
      type: 'checklist',
      description: "Tâches d'entretien pour chaque saison",
      downloadCount: 2560
    },
    {
      title: "Calculateur budget déco",
      type: 'worksheet',
      description: "Outil Excel pour gérer votre budget déco",
      downloadCount: 1980
    }
  ];

  // Catégories basées sur les données réelles
  const categories = [
    { id: 'tous', label: 'Tous les épisodes', count: mediaEpisodes.length },
    { id: 'favoris', label: 'Favoris', count: mediaEpisodes.filter(ep => favorites.includes(ep.id)).length },
    { id: 'deco', label: 'Décoration', count: mediaEpisodes.filter(ep => ep.title.toLowerCase().includes('déco') || ep.description.toLowerCase().includes('décoration')).length },
    { id: 'renovation', label: 'Rénovation', count: mediaEpisodes.filter(ep => ep.title.toLowerCase().includes('rénovation') || ep.description.toLowerCase().includes('rénovation')).length }
  ];

  const mediaTypes = [
    { id: 'tous', label: 'Tous', icon: null, count: mediaEpisodes.length },
    { id: 'audio', label: 'Audio', icon: <Headphones className="w-4 h-4" />, count: mediaEpisodes.filter(ep => ep.type === 'audio').length },
    { id: 'video', label: 'Vidéos', icon: <Video className="w-4 h-4" />, count: mediaEpisodes.filter(ep => ep.type === 'video').length }
  ];

  const filteredEpisodes = mediaEpisodes.filter(episode => {
    const categoryMatch = activeCategory === 'tous' || 
      (activeCategory === 'favoris' ? favorites.includes(episode.id) :
       activeCategory === 'deco' ? (episode.title.toLowerCase().includes('déco') || episode.description.toLowerCase().includes('décoration')) :
       activeCategory === 'renovation' ? (episode.title.toLowerCase().includes('rénovation') || episode.description.toLowerCase().includes('rénovation')) :
       true);
    
    const typeMatch = activeMediaType === 'tous' || episode.type === activeMediaType;
    
    return categoryMatch && typeMatch;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Domicile': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'deco': 'bg-gradient-to-r from-pink-500 to-rose-500',
      'renovation': 'bg-gradient-to-r from-orange-500 to-amber-500',
      'amenagement': 'bg-gradient-to-r from-blue-500 to-cyan-500'
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

  const getMediaTypeColor = (type: 'audio' | 'video') => {
    return type === 'audio' 
      ? 'bg-blue-500 text-white' 
      : 'bg-purple-500 text-white';
  };

  const handlePlayPause = () => {
    if (selectedEpisode) {
      if (selectedEpisode.type === 'audio' && audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } else if (selectedEpisode.type === 'video' && videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (selectedEpisode?.type === 'audio' && audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((currentTime / duration) * 100);
    } else if (selectedEpisode?.type === 'video' && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleDownload = () => {
    if (selectedEpisode) {
      const link = document.createElement('a');
      link.href = selectedEpisode.downloadUrl;
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <section className="py-8 mt-12 rounded-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des médias...</p>
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
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Décoration intérieure" 
            className="w-full h-full object-cover"
          />
          <div className="absolute left-2 bottom-0 inline-flex items-center bg-green-100 text-green-700 px-3 py-2 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Inspiration & Conseils Maison
          </div>
        </div>

        {/* En-tête avec animation */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Domicile & Décoration
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Transformez votre intérieur avec nos conseils déco, astuces d'aménagement 
            et guides pratiques. De l'inspiration à la réalisation.
          </p>
        </div>

        {/* Médias Section */}
        <div className="mb-20 pt-5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Home className="w-8 h-8 mr-3 text-blue-600" />
                Médiathèque "Ma Maison Mon Style"
              </h3>
              <p className="text-gray-600 text-sm">Conseils déco, rénovation et aménagement pour créer l'intérieur de vos rêves</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-200 bg-gray-950 px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>{mediaEpisodes.reduce((total, ep) => total + ep.listens, 0).toLocaleString()} écoutes totales</span>
            </div>
          </div>

          {/* Filtres par type de média */}
          <div className="flex flex-wrap gap-3 mb-4">
            {mediaTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveMediaType(type.id as any)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeMediaType === type.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {type.icon && <span className="mr-2">{type.icon}</span>}
                {type.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeMediaType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {type.count}
                </span>
              </button>
            ))}
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
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
                    <p className="text-gray-500 mb-6">Ajoutez vos médias préférés en cliquant sur le cœur</p>
                    <button
                      onClick={() => setActiveCategory('tous')}
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Découvrir les médias
                    </button>
                  </>
                ) : (
                  <>
                    <Home className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">Aucun média disponible</h3>
                    <p className="text-gray-500">Revenez plus tard pour découvrir nos nouveaux contenus</p>
                  </>
                )}
              </div>
            ) : (
              filteredEpisodes.map((episode) => (
                <div
                  key={episode.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${
                    episode.featured ? 'border-2 border-blue-600' : 'border-gray-200'
                  }`}
                >
                  {episode.featured && (
                    <div className="bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl">
                      ⭐ Contenu en vedette
                    </div>
                  )}
                  
                  {/* Miniature pour vidéos */}
                  {episode.type === 'video' && episode.thumbnailUrl && (
                    <div className="relative aspect-video rounded-t-2xl overflow-hidden">
                      <img 
                        src={episode.thumbnailUrl} 
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(episode.category)}`}>
                          {episode.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getMediaTypeColor(episode.type)}`}>
                          {episode.type === 'audio' ? 'AUDIO' : 'VIDÉO'}
                        </span>
                      </div>
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
                          setIsPlaying(false);
                          setProgress(0);
                        }}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors group/btn"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {episode.type === 'audio' ? 'Écouter' : 'Regarder'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-purple-600" />
                Nos Services Domicile
              </h3>
              <p className="text-gray-600">Des services professionnels pour vous accompagner dans tous vos projets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getServiceColor(service.color)} flex items-center justify-center text-white mb-4`}>
                  {service.icon}
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-green-50 text-green-700 py-3 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors">
                  {service.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ressources Gratuites */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Download className="w-8 h-8 mr-3 text-blue-600" />
                Ressources Gratuites
              </h3>
              <p className="text-gray-600">Téléchargez nos guides et outils pour vos projets maison</p>
            </div>
            <div className="text-sm text-gray-500">
              <Lightbulb className="w-5 h-5 inline mr-1" />
              Outils pratiques
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 rounded-lg text-blue-600">
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
                <button className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-green-50 hover:text-blue-600 transition-colors flex items-center justify-center">
                  Télécharger gratuitement
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Rejoignez Notre Communauté Maison
            </h3>
            <p className="text-green-100 text-sm mb-6 max-w-2xl mx-auto">
              Accédez à l'ensemble de nos ressources, participez à nos ateliers DIY
              et échangez avec une communauté passionnée par la décoration et l'aménagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg text-sm flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Rejoindre gratuitement
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors text-sm flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                <Link to="/services-domicile">
                  Découvrir tous les services
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Media */}
      {isModalOpen && selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false);
              setIsPlaying(false);
              setProgress(0);
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
          <div className="relative z-50 w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Audio/Video Elements */}
            <audio
              ref={audioRef}
              src={selectedEpisode.audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              muted={isMuted}
            />
            
            {selectedEpisode.type === 'video' && (
              <video
                ref={videoRef}
                src={selectedEpisode.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                muted={isMuted}
                className="w-full"
                controls={false}
              />
            )}

            {/* Bouton fermeture */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsPlaying(false);
                setProgress(0);
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
              className="absolute top-3 right-3 z-20 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex p-4 border-b border-gray-200 bg-white">
              {/* Image */}
              <div className="flex-shrink-0 mr-4">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white ${
                  selectedEpisode.type === 'audio' ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {selectedEpisode.type === 'audio' ? (
                    <Headphones className="w-8 h-8" />
                  ) : (
                    <Video className="w-8 h-8" />
                  )}
                </div>
              </div>

              {/* Informations */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(selectedEpisode.category)}`}>
                    {selectedEpisode.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getMediaTypeColor(selectedEpisode.type)}`}>
                    {selectedEpisode.type === 'audio' ? 'AUDIO' : 'VIDÉO'}
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
                  <span>{formatFileSize(selectedEpisode.fileSize)}</span>
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
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex gap-3 mb-3">
                <button
                  onClick={handlePlayPause}
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white px-3 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      {selectedEpisode.type === 'audio' ? 'Pause' : 'Pause'}
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {selectedEpisode.type === 'audio' ? 'Écouter' : 'Regarder'}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center justify-center border border-gray-300 text-gray-700 px-3 py-3 rounded-lg text-sm hover:bg-white transition-colors"
                  title={isMuted ? 'Activer le son' : 'Désactiver le son'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center border border-gray-300 text-gray-700 px-3 py-3 rounded-lg text-sm hover:bg-white transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => selectedEpisode && toggleFavorite(selectedEpisode.id)}
                  className={`flex items-center justify-center border px-3 py-3 rounded-lg text-sm transition-colors ${
                    selectedEpisode && isFavorite(selectedEpisode.id)
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Ajouter aux favoris"
                >
                  <Heart className={`w-5 h-5 ${selectedEpisode && isFavorite(selectedEpisode.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PodcastsDomicile;