// ResultatSearch.tsx
import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Bed,
  Ruler,
  Wrench,
  Home,
  Car,
  Utensils,
  Star,
  Heart,
  Eye,
  Share2,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  images: string[];
  metiers?: Array<{ id: string; libelle: string; name?: string }>;
  rating?: number;
  type: "service";
  category?: string;
  tags?: string[];
}

interface Property {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  address?: string;
  images: string[];
  rooms?: number;
  bathrooms?: number;
  surface?: number;
  rating?: number;
  type: "property";
  propertyType?: "maison" | "appartement" | "terrain" | "commercial";
  tags?: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  rating?: number;
  type: "product";
  brand?: string;
  tags?: string[];
}

interface Aliment {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  rating?: number;
  type: "aliment";
  origin?: string;
  tags?: string[];
}

type Item = Service | Property | Product | Aliment;

interface ResultatSearchProps {
  searchQuery: string;
  searchResults: Item[] | null;
  favorites: Set<string>;
  setFavorites: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const ResultatSearch: React.FC<ResultatSearchProps> = ({
  searchQuery,
  searchResults,
  favorites,
  setFavorites,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  // États pour le modal de devis
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  // Configuration des couleurs par type
  const getTypeConfig = (type: string) => {
    const configs = {
      service: {
        color: "#10B981",
        lightColor: "#D1FAE5",
        icon: Wrench,
        label: "Service",
        gradient: "from-emerald-50 to-emerald-100",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800",
      },
      property: {
        color: "#8B5CF6",
        lightColor: "#EDE9FE",
        icon: Home,
        label: "Immobilier",
        gradient: "from-violet-50 to-violet-100",
        border: "border-violet-200",
        badge: "bg-violet-100 text-violet-800",
      },
      product: {
        color: "#3B82F6",
        lightColor: "#DBEAFE",
        icon: Car,
        label: "Produit",
        gradient: "from-blue-50 to-blue-100",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-800",
      },
      aliment: {
        color: "#EF4444",
        lightColor: "#FEE2E2",
        icon: Utensils,
        label: "Aliment",
        gradient: "from-red-50 to-red-100",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800",
      },
    };
    return configs[type as keyof typeof configs] || configs.service;
  };

  // Gestion du clic sur le bouton "Voir détails"
  const handleViewDetails = (item: Item) => {
    // Si c'est un service, ouvrir le modal de devis
    if (item.type === "service") {
      if (!isLoggedIn) {
        toast.info("Vous devez être connecté pour demander un devis !");
        return;
      }
      setCurrentItem(item);
      setIsDevisModalOpen(true);
    } else {
      // Pour les autres types, naviguer vers la page de détails
      navigate(`/item/${item.type}/${item.id}`);
    }
  };

  // Gestion de la soumission du devis
  const handleDevisSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      const demandeData = {
        contactNom: data.nom as string,
        contactPrenom: data.prenom as string,
        contactEmail: data.email as string,
        contactTel: data.telephone as string,
        lieuAdresse: data.adresse as string,
        lieuAdresseCp: data.codePostal as string || "75000",
        lieuAdresseVille: data.ville as string || "Paris",
        optionAssurance: false,
        description: data.message as string || `Demande de devis pour: ${currentItem?.name}`,
        devis: `Budget: ${data.budget}, Date souhaitée: ${data.dateSouhaitee}`,
        serviceId: currentItem?.id,
        serviceName: (currentItem as Service)?.name,
        nombreArtisans: "UNIQUE",
        createdById: user?.id || "user-anonymous",
        status: "pending",
        type: "devis",
        source: "resultat-search"
      };

      const response = await api.post("/demandes/immobilier", demandeData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Votre demande a été créée avec succès !");
        setIsDevisModalOpen(false);
        setCurrentItem(null);
      } else {
        throw new Error(`Statut inattendu: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      toast.error(error.response?.data?.message || "Erreur lors de la création de la demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Composant de carte d'item
  const ItemCard = ({ item, index }: { item: Item; index: number }) => {
    const config = getTypeConfig(item.type);
    const IconComponent = config.icon;
    const displayName =
      (item as any).name || (item as any).title || config.label;
    const displayPrice = item.price;
    const displayDescription =
      (item as any).description || "Aucune description disponible";
    const images = (item as any).images || [];
    const isFavorite = favorites.has(item.id);

    return (
      <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        {/* Badge de type */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge} flex items-center gap-1`}
          >
            <IconComponent className="w-3 h-3" />
            {config.label}
          </span>
        </div>

        {/* Bouton favori */}
        <button
          onClick={() => {
            const newFavorites = new Set(favorites);
            if (isFavorite) {
              newFavorites.delete(item.id);
            } else {
              newFavorites.add(item.id);
            }
            setFavorites(newFavorites);
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Image avec overlay */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {images.length > 0 ? (
            <>
              <img
                src={images[0]}
                alt={displayName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconComponent className="w-16 h-16 text-gray-300" />
            </div>
          )}


         
        </div>

        {/* Contenu */}
        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {displayName}
          </h3>

          {/* Adresse pour les propriétés */}
          {(item as Property).address && (
            <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{(item as Property).address}</span>
            </div>
          )}

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {displayDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.type === "service" &&
              (item as Service).metiers?.slice(0, 2).map((metier, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                >
                  {metier.libelle || metier.name}
                </span>
              ))}
            {(item as Property).propertyType && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                {(item as Property).propertyType}
              </span>
            )}
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Services */}
            {(item as Service).duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>{(item as Service).duration} min</span>
              </div>
            )}

            {/* Immobilier */}
            {(item as Property).rooms && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bed className="w-4 h-4 text-violet-500" />
                <span>{(item as Property).rooms} chambres</span>
              </div>
            )}
            {(item as Property).surface && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Ruler className="w-4 h-4 text-violet-500" />
                <span>{(item as Property).surface}m²</span>
              </div>
            )}

            {/* Rating */}
            {(item as any).rating && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{(item as any).rating}/5</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2 group/btn ${
                item.type === "service"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
              onClick={() => handleViewDetails(item)}
            >
              {item.type === "service" ? (
                <>
                  <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Demander un devis
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Voir détails
                </>
              )}
            </button>
            <button
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Lien copié !");
              }}
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Si pas de résultats
  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Aucun résultat ne correspond à votre recherche "{searchQuery}".
            Essayez avec d'autres mots-clés.
          </p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Réinitialiser la recherche
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        {/* En-tête des résultats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Résultats de recherche
              </h2>
              <p className="text-gray-600">
                {searchResults.length} résultat(s) trouvé(s) pour "
                <span className="font-semibold text-emerald-600">
                  {searchQuery}
                </span>
                "
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Effacer la recherche
              </button>
            </div>
          </div>
        </div>

        {/* Grille des résultats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((item, index) => (
            <ItemCard key={`${item.id}-${index}`} item={item} index={index} />
          ))}
        </div>

        {/* Pagination (optionnelle) */}
        {searchResults.length > 12 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Précédent
              </button>
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg">
                1
              </span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de devis */}
      {isDevisModalOpen && currentItem && currentItem.type === "service" && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFFF0] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-[#D3D3D3] sticky top-0 bg-[#FFFFF0] z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#556B2F]/10 rounded-lg">
                  <FileText className="h-6 w-6 text-[#556B2F]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Demande de Devis
                  </h2>
                  <p className="text-[#556B2F] text-xs lg:text-sm">
                    {currentItem.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDevisModalOpen(false)}
                className="h-8 w-8 bg-[#556B2F] text-white font-bold rounded-full hover:bg-[#6B8E23] flex items-center justify-center transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDevisSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input 
                    name="nom" 
                    placeholder="Votre nom" 
                    required 
                    className="w-full border border-[#D3D3D3] p-3 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input 
                    name="prenom" 
                    placeholder="Votre prénom" 
                    required 
                    className="w-full border border-[#D3D3D3] p-3 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                    className="w-full border border-[#D3D3D3] p-3 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input 
                    name="telephone" 
                    placeholder="06 12 34 56 78" 
                    required 
                    className="w-full border border-[#D3D3D3] p-3 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse du projet
                </label>
                <input 
                  name="adresse" 
                  placeholder="Adresse complète du projet" 
                  className="w-full border border-[#D3D3D3] p-3 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                  disabled={isSubmitting}
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message supplémentaire
                </label>
                <textarea 
                  name="message" 
                  placeholder="Décrivez votre projet en détail..." 
                  rows={4} 
                  className="w-full border border-[#D3D3D3] p-3 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                  disabled={isSubmitting}
                />
              </div>

              <div className="bg-[#556B2F]/10 rounded-lg p-4">
                <h3 className="font-semibold text-[#556B2F] mb-2">
                  Prestation sélectionnée
                </h3>
                <p className="text-[#556B2F] text-sm">{currentItem.name}</p>
                {currentItem.description && (
                  <p className="text-[#556B2F]/80 text-xs mt-1">{currentItem.description}</p>
                )}
              </div>

              <div className="grid lg:flex gap-3 pt-4 border-t border-[#D3D3D3]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Envoyer la demande</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDevisModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 border border-[#D3D3D3] text-gray-700 py-3 rounded-lg font-semibold hover:bg-[#FFFFF0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultatSearch;