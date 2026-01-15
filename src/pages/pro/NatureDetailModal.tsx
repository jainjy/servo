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
      className={`fixed inset-0 z-50 overflow-y-auto transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      ref={modalRef}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div
          className={`bg-white rounded-xl shadow-xl w-full max-w-6xl mx-auto overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
        >
          {/* Header compact avec titre */}
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="px-5 py-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">

                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
                      {item.title}
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${typeColor.replace('bg-gradient-to-r', 'bg')}`} />
                    </div>
                  </div>

                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] max-h-[700px]">
            {/* Section image - 60% */}
            <div
              className="lg:w-[60%] relative bg-gray-900"
              ref={imageContainerRef}
            >
              {item.images && item.images.length > 0 ? (
                <div className="relative h-full">
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay noir transparent */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Overlay gradient léger en bas */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-5 top-5 flex items-start justify-between">
                    {/* Badge de type et catégorie */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg">
                      <span className="flex items-center gap-1.5">
                        {typeIcon}
                        <span className="font-medium">{getTypeLabel(item.type)}</span>
                      </span>
                      {item.category && (
                        <span className="h-4 w-px bg-white/30" />
                      )}
                      {item.category && (
                        <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">
                          {getCategoryLabel(item.category)}
                        </span>
                      )}
                    </div>

                    {/* Note et évaluation - compact */}
                    {item.rating !== undefined && (
                      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 min-w-[100px]">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-lg font-bold text-white">
                            {item.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-white/60">/5</span>
                        </div>
                        <div className="flex justify-center gap-0.5 my-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${i < Math.floor(item.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-white/30"
                                }`}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] text-white/60 text-center tracking-tight">
                          {item.reviewCount || 0} avis
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Contenu sur l'image */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
                      <div className="flex-1">

                        <div className="flex flex-col items-start gap-3 text-white/90 text-sm mb-3">
                          <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-md">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.location}</span>
                          </div>
                          {item.year && (
                            <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-md">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Découvert en {item.year}</span>
                            </div>
                          )}
                          {item.altitude && (
                            <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-md">
                              <Mountain className="w-3.5 h-3.5" />
                              <span>{item.altitude}</span>
                            </div>
                          )}
                        </div>
                      </div>


                    </div>
                  </div>

                  {/* Contrôles image - affichés seulement s'il y a plus d'une image */}
                  {item.images.length > 1 && (
                    <div className="absolute top-1/2 left-3 right-3 transform -translate-y-1/2 flex justify-between">
                      <button
                        onClick={prevImage}
                        className="p-2 bg-black/70 text-white rounded-md hover:bg-black/90 transition-colors"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="p-2 bg-black/70 text-white rounded-md hover:bg-black/90 transition-colors"
                        aria-label="Image suivante"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Bottom controls */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      {item.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-6 h-1.5 rounded-sm transition-colors ${index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50 hover:bg-white/70"
                            }`}
                          aria-label={`Aller à l'image ${index + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.images.length > 1 && (
                        <div className="text-xs text-white/80 bg-black/60 px-2 py-1 rounded">
                          {currentImageIndex + 1} / {item.images.length}
                        </div>
                      )}

                      <button
                        onClick={handleFullscreen}
                        className="p-1.5 bg-black/60 text-white rounded hover:bg-black/80 transition-colors"
                        aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <ImageIcon className="w-12 h-12 mx-auto opacity-40 mb-3" />
                    <p className="text-sm">Aucune image disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section informations - 40% */}
            <div className="lg:w-[40%] overflow-y-auto bg-white">
              <div className="p-5 space-y-6">
                {/* Météo */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-blue-600" />
                      Conditions météo
                    </h3>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                      Temps réel
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-gray-900">{weatherData.temperature}</div>
                      <div className="text-sm text-gray-600">{weatherData.condition}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-gray-600">{weatherData.humidity}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Wind className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-gray-600">{weatherData.wind}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-gray-600">{weatherData.sunrise}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Sunrise className="w-3.5 h-3.5 text-orange-500 rotate-180" />
                        <span className="text-gray-600">{weatherData.sunset}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-600" />
                      Description
                    </h2>
                  </div>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <p className="text-gray-700 text-sm text-justify leading-relaxed whitespace-pre-line">
                      {item.description || "Aucune description disponible."}
                    </p>
                  </div>
                </section>

                {/* Caractéristiques */}
                <section>
                  <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-600" />
                    Caractéristiques
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-gray-500 text-xs">Type</div>
                        <div className="font-medium">{getTypeLabel(item.type)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <TagIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-gray-500 text-xs">Catégorie</div>
                        <div className="font-medium">{getCategoryLabel(item.category)}</div>
                      </div>
                    </div>
                    {item.area && (
                      <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <Map className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500 text-xs">Superficie</div>
                          <div className="font-medium">{item.area}</div>
                        </div>
                      </div>
                    )}
                    {item.visitors && (
                      <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <UsersIcon className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500 text-xs">Visiteurs</div>
                          <div className="font-medium">{item.visitors.toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-gray-500 text-xs">Statut</div>
                        <div className={`font-medium ${item.available !== false ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {item.available !== false ? 'Ouvert au public' : 'Fermé'}
                        </div>
                      </div>
                    </div>
                    {item.bestSeason && (
                      <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500 text-xs">Meilleure saison</div>
                          <div className="font-medium">{item.bestSeason}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Galerie miniatures */}
                {item.images && item.images.length > 1 && (
                  <section>
                    <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-gray-600" />
                      Galerie
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.images.length} photos
                      </span>
                    </h2>
                    <div className="grid grid-cols-4 gap-2">
                      {item.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square overflow-hidden rounded-md border transition-colors ${index === currentImageIndex
                            ? 'border-blue-500 ring-1 ring-blue-200'
                            : 'border-gray-300 hover:border-gray-400'
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
          <div className="bg-gray-50 border-t border-gray-200">
            <div className="px-5 py-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="text-xs text-gray-500">
                  Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors text-sm"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors text-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
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
    <div className={`bg-gradient-to-br rounded-xl p-4 border ${status ? statusClasses[status] : colorClasses[color as keyof typeof colorClasses] || 'from-gray-50 to-gray-100 border-gray-200'
      }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${status
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
    // console.log('Success:', message);
  },
};