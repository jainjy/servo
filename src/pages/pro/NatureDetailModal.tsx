import { 
  X, MapPin, Calendar, Mountain, Star, 
   Globe, Shield, Image as ImageIcon,
  ChevronLeft, ChevronRight, Edit, Trash2, 
  Maximize2,
  Info, Award, Map, Users as UsersIcon, Thermometer,
  Droplets, Wind, Sunrise
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface NatureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const typeIcons = {
  nature: "🌿",
  patrimoine: "🏛️",
  marine: "🌊",
  montagne: "⛰️",
  default: "📍",
};

const typeColors = {
  nature: "bg-gradient-to-r from-green-500 to-emerald-600",
  patrimoine: "bg-gradient-to-r from-amber-500 to-orange-600",
  marine: "bg-gradient-to-r from-blue-500 to-cyan-600",
  montagne: "bg-gradient-to-r from-purple-500 to-violet-600",
  default: "bg-gradient-to-r from-gray-500 to-gray-600",
};

const categoryLabels: Record<string, string> = {
  lagon: "Lagon",
  foret: "Forêt",
  parc_naturel: "Parc Naturel",
  reserve: "Réserve Naturelle",
  site_historique: "Site Historique",
  monument: "Monument",
  plage: "Plage Naturelle",
  cascade: "Cascade",
  volcan: "Volcan",
  grottes: "Grottes",
  desert: "Désert",
  canyon: "Canyon",
};

export default function NatureDetailModal({
  isOpen,
  onClose,
  item,
  onEdit,
  onDelete,
}: NatureDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item && isOpen) {
      setCurrentImageIndex(0);
      setIsFavorite(false);
      setIsBookmarked(false);
    }
  }, [item, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen, onClose]);

  const handleFullscreen = () => {
    if (!imageContainerRef.current) return;
    
    if (!isFullscreen) {
      if (imageContainerRef.current.requestFullscreen) {
        imageContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !item) return null;

  const typeColor = typeColors[item.type as keyof typeof typeColors] || typeColors.default;
  const typeIcon = typeIcons[item.type as keyof typeof typeIcons] || typeIcons.default;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "nature": return "Site Naturel";
      case "patrimoine": return "Patrimoine Culturel";
      case "marine": return "Site Marin";
      case "montagne": return "Site Montagneux";
      default: return "Site";
    }
  };

  const getCategoryLabel = (category: string) => {
    return categoryLabels[category] || category.replace('_', ' ');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (item.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (item.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${item.title}" ?`)) {
      onDelete(item.id);
      onClose();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(item.title);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    }
  };

  // Données météo fictives (à remplacer par une API réelle)
  const weatherData = {
    temperature: "22°C",
    condition: "Ensoleillé",
    humidity: "65%",
    wind: "12 km/h",
    sunrise: "06:45",
    sunset: "18:30"
  };

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-y-auto transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      ref={modalRef}
    >
      {/* Overlay avec flou */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div 
          className={`bg-white rounded-3xl shadow-2xl w-full max-w-7xl mx-auto overflow-hidden transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="sticky top-0 z-40 bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-md border-b border-white/10">
            <div className="px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all hover:scale-105"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${typeColor.replace('bg-gradient-to-r', 'bg')}`} />
                    <span className="text-white/80 text-sm font-medium">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                 
                  <div className="h-6 w-px bg-white/20 mx-2" />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>

                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal avec disposition responsive */}
          <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] max-h-[800px]">
            {/* Section image - 60% sur desktop */}
            <div 
              className="lg:w-[60%] relative bg-gradient-to-br from-gray-900 to-black"
              ref={imageContainerRef}
            >
              {item.images && item.images.length > 0 ? (
                <div className="relative h-full">
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Contenu sur l'image */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                      <div className="flex-1">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${typeColor} text-white text-sm font-semibold mb-4 shadow-lg`}>
                          <span className="text-lg">{typeIcon}</span>
                          {getTypeLabel(item.type)}
                          <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                          {item.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{item.location}</span>
                          </div>
                          {item.year && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <Calendar className="w-4 h-4" />
                              <span>Découvert en {item.year}</span>
                            </div>
                          )}
                          {item.altitude && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <Mountain className="w-4 h-4" />
                              <span>{item.altitude}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.rating !== undefined && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 min-w-[140px] border border-white/20 shadow-2xl">
                          <div className="text-3xl font-bold text-white mb-2 text-center">
                            {item.rating.toFixed(1)}
                            <span className="text-lg text-white/70">/5</span>
                          </div>
                          <div className="flex justify-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(item.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-white/30"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-center">
                            <div className="text-white/70 text-sm">
                              {item.reviewCount || 0} avis
                            </div>
                            <div className="text-xs text-white/50 mt-1">
                              Basé sur {item.reviewCount || 0} évaluations
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contrôles image */}
                  <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 flex justify-between">
                    <button
                      onClick={prevImage}
                      className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all hover:scale-110 active:scale-95 shadow-lg"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all hover:scale-110 active:scale-95 shadow-lg"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Bottom controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      {item.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-8 h-1.5 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/40 hover:bg-white/60"
                          }`}
                          aria-label={`Aller à l'image ${index + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm">
                        {currentImageIndex + 1} / {item.images.length}
                      </div>
                      <button
                        onClick={handleFullscreen}
                        className="p-2 bg-black/60 text-white rounded-full backdrop-blur-sm hover:bg-black/80 transition-all"
                        aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <ImageIcon className="w-24 h-24 mx-auto opacity-30 mb-4" />
                    <p className="text-xl font-medium mb-2">Aucune image disponible</p>
                    <p className="text-white/60">Ajoutez des images pour améliorer cette fiche</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section informations - 40% sur desktop */}
            <div className="lg:w-[40%] overflow-y-auto bg-gradient-to-b from-white to-gray-50">
              <div className="p-6 lg:p-8 space-y-8">
                {/* En-tête météo */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-blue-600" />
                      Conditions météo
                    </h3>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      En temps réel
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{weatherData.temperature}</div>
                      <div className="text-sm text-gray-600">{weatherData.condition}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span>Humidité: {weatherData.humidity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Wind className="w-4 h-4 text-blue-500" />
                        <span>Vent: {weatherData.wind}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Sunrise className="w-4 h-4 text-amber-500" />
                        <span>Lever: {weatherData.sunrise}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Sunrise className="w-4 h-4 text-orange-500 rotate-180" />
                        <span>Coucher: {weatherData.sunset}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Info className="w-5 h-5 text-green-600" />
                      Description
                    </h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {item.description?.length || 0} caractères
                    </span>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {item.description || "Aucune description disponible."}
                    </p>
                  </div>
                </section>

                {/* Caractéristiques détaillées */}
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Caractéristiques
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FeatureCard
                      icon={<Globe className="w-5 h-5" />}
                      title="Type"
                      value={getTypeLabel(item.type)}
                      color="green"
                    />
                    <FeatureCard
                      icon={<TagIcon className="w-5 h-5" />}
                      title="Catégorie"
                      value={getCategoryLabel(item.category)}
                      color="blue"
                    />
                    {item.area && (
                      <FeatureCard
                        icon={<Map className="w-5 h-5" />}
                        title="Superficie"
                        value={item.area}
                        color="purple"
                      />
                    )}
                    {item.visitors && (
                      <FeatureCard
                        icon={<UsersIcon className="w-5 h-5" />}
                        title="Visiteurs annuels"
                        value={item.visitors.toLocaleString()}
                        color="amber"
                      />
                    )}
                    <FeatureCard
                      icon={<Shield className="w-5 h-5" />}
                      title="Statut"
                      value={item.available !== false ? 'Ouvert au public' : 'Fermé'}
                      status={item.available !== false ? 'success' : 'error'}
                    />
                    {item.bestSeason && (
                      <FeatureCard
                        icon={<Calendar className="w-5 h-5" />}
                        title="Meilleure saison"
                        value={item.bestSeason}
                        color="sky"
                      />
                    )}
                  </div>
                </section>

                

                {/* Galerie miniatures */}
                {item.images && item.images.length > 1 && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-indigo-600" />
                      Galerie ({item.images.length} photos)
                    </h2>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
                      {item.images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square overflow-hidden rounded-xl border-2 transition-all hover:scale-[1.02] ${
                            index === currentImageIndex
                              ? 'border-indigo-500 ring-2 ring-indigo-200'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${item.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">© {new Date().getFullYear()} Tourism Platform</span>
                  <span className="mx-2">•</span>
                  <span>Tous droits réservés</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-xs text-gray-500">
                    Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">ID:</span>
                    <code className="px-2 py-1 bg-gray-200 rounded text-xs font-mono text-gray-700">
                      {item.id?.substring(0, 8)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color?: string;
  status?: 'success' | 'error';
}

function FeatureCard({ icon, title, value, color, status }: FeatureCardProps) {
  const colorClasses = {
    green: 'from-green-50 to-emerald-50 border-green-100 text-green-700',
    blue: 'from-blue-50 to-cyan-50 border-blue-100 text-blue-700',
    purple: 'from-purple-50 to-violet-50 border-purple-100 text-purple-700',
    amber: 'from-amber-50 to-orange-50 border-amber-100 text-amber-700',
    sky: 'from-sky-50 to-blue-50 border-sky-100 text-sky-700',
  };

  const statusClasses = {
    success: 'text-green-700 bg-green-50 border-green-200',
    error: 'text-red-700 bg-red-50 border-red-200',
  };

  return (
    <div className={`bg-gradient-to-br rounded-xl p-4 border ${
      status ? statusClasses[status] : colorClasses[color as keyof typeof colorClasses] || 'from-gray-50 to-gray-100 border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${
          status 
            ? status === 'success' ? 'bg-green-100' : 'bg-red-100'
            : 'bg-white/50'
        }`}>
          {icon}
        </div>
        <div className="text-sm font-medium text-gray-500">{title}</div>
      </div>
      <div className="font-semibold text-lg">{value}</div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

function ActionButton({ icon, label, color, onClick }: ActionButtonProps) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      {icon}
      <span className="text-xs mt-1.5 font-medium">{label}</span>
    </button>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

// Utilitaire toast (à remplacer par votre implémentation)
const toast = {
  success: (message: string) => {
    // Implémentation réelle de votre système de notifications
    console.log('Success:', message);
  },
};