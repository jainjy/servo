import { 
  X, MapPin, Calendar, Mountain, Star, ExternalLink, 
  Users, Globe, Shield, Clock, TrendingUp, Image as ImageIcon,
  ChevronLeft, ChevronRight, Edit, Trash2, Share2, Download,
  Heart, Bookmark, Navigation, Phone, Mail, Facebook, Twitter,
  Instagram, Linkedin, AlertCircle, CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (item && isOpen) {
      setCurrentImageIndex(0);
      setIsFavorite(false);
      setIsBookmarked(false);
    }
  }, [item, isOpen]);

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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez ${item.title} - ${item.description.substring(0, 100)}...`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success("Lien copié dans le presse-papier !");
        break;
    }
    setShareMenuOpen(false);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header avec navigation */}
        <div className="sticky top-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                  title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="p-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                  title={isBookmarked ? "Retirer des signets" : "Ajouter aux signets"}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShareMenuOpen(!shareMenuOpen)}
                    className="p-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                    title="Partager"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  {shareMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Twitter className="w-4 h-4 text-sky-500" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">WA</span>
                        </div>
                        WhatsApp
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <CopyIcon className="w-4 h-4 text-gray-600" />
                        Copier le lien
                      </button>
                    </div>
                  )}
                </div>

                <div className="h-6 w-px bg-white/30"></div>

                <button
                  onClick={() => onEdit(item)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Image principale avec navigation */}
            <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-gray-900 to-black">
              {item.images && item.images.length > 0 ? (
                <>
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  
                  {/* Navigation images */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {item.images.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white w-6"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Image count */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {item.images.length}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <ImageIcon className="w-24 h-24 mx-auto opacity-30 mb-4" />
                    <p className="text-xl font-medium">Aucune image disponible</p>
                  </div>
                </div>
              )}

              {/* Overlay avec titre */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${typeColor} text-white text-sm font-semibold mb-3`}>
                      <span className="text-lg">{typeIcon}</span>
                      {getTypeLabel(item.type)}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {item.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">{item.location}</span>
                      </div>
                      {item.year && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span className="text-lg">Découvert en {item.year}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.rating !== undefined && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 min-w-[120px] text-center">
                      <div className="text-3xl font-bold text-white mb-1">{item.rating.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(item.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-white/40"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-white/70 text-sm">
                        {item.reviewCount || 0} avis
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contenu détaillé */}
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-10">
                  {/* Description */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <FileTextIcon className="w-6 h-6 text-green-600" />
                      Description
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  </section>

                  {/* Caractéristiques */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      Caractéristiques principales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Globe className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Type</div>
                            <div className="font-bold text-gray-900 text-lg">{getTypeLabel(item.type)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <TagIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Catégorie</div>
                            <div className="font-bold text-gray-900 text-lg">{getCategoryLabel(item.category)}</div>
                          </div>
                        </div>
                      </div>

                      {item.altitude && (
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-2xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Mountain className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Altitude</div>
                              <div className="font-bold text-gray-900 text-lg">{item.altitude}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Shield className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Statut</div>
                            <div className={`font-bold text-lg ${item.available !== false ? 'text-green-600' : 'text-red-600'}`}>
                              {item.available !== false ? '✅ Ouvert au public' : '❌ Temporairement fermé'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Galerie d'images */}
                  {item.images && item.images.length > 1 && (
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <ImageIcon className="w-6 h-6 text-green-600" />
                        Galerie ({item.images.length} photos)
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {item.images.map((image: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                              index === currentImageIndex
                                ? 'border-green-500 ring-2 ring-green-200'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${item.title} - ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Carte d'action rapide */}
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Visiter ce site</h3>
                    
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all">
                        <Navigation className="w-5 h-5" />
                        Voir l'itinéraire
                      </button>

                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Phone className="w-5 h-5" />
                        Contacter
                      </button>

                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-5 h-5" />
                        Télécharger la brochure
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Statistiques</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Popularité</span>
                          <span className="font-semibold text-gray-900">
                            {item.featured ? 'Élevée' : 'Moyenne'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Accessibilité</span>
                          <span className="font-semibold text-green-600">Facile</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Meilleure période</span>
                          <span className="font-semibold text-gray-900">Avril - Octobre</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations pratiques */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Informations pratiques
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Horaires</div>
                          <div className="text-sm text-gray-600">Ouvert tous les jours de 8h à 18h</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Visites guidées</div>
                          <div className="text-sm text-gray-600">Disponibles sur réservation</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Recommandations</div>
                          <div className="text-sm text-gray-600">Prévoir de bonnes chaussures</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="space-y-3">
                    {item.featured && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">Site en vedette</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">Éco-responsable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-8 py-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  © {new Date().getFullYear()} Tourism Platform • Tous droits réservés
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Partager :</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleShare('facebook')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleShare('twitter')} className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleShare('whatsapp')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-sm font-bold">WA</span>
                      </div>
                    </button>
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

// Composants d'icônes supplémentaires
function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
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
  success: (message: string) => console.log('Success:', message),
};