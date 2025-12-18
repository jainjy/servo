import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Users,
  Tag,
  Search,
  Star,
  Loader2,
  X,
} from "lucide-react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

// Interfaces
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  companyName?: string;
  commercialName?: string;
  userType?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  rating?: number;
  experience?: number;
}

interface Metier {
  id: number;
  libelle: string;
  services: Service[];
  users: User[];
  _count: {
    services: number;
    users: number;
  };
}

interface Service {
  id: number;
  libelle: string;
  name?: string;
  description?: string;
  images: string[];
  duration?: number;
  price?: number;
  category?: Category;
  metiers?: Array<{ id: string; libelle: string; name?: string }>;
  rating?: number;
  _count?: {
    users: number;
  };
}

interface Category {
  id: number;
  name: string;
}

const PartnersPage = ({ AdvancedSearchBar, filters, setFilters, showFilters, setShowFilters, sortBy, setSortBy }: any) => {
  const [showExperts, setShowExperts] = useState(false);
  const [selectedMetier, setSelectedMetier] = useState<Metier | null>(null);
  const [metiers, setMetiers] = useState<Metier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // États pour les recherches
  const [metierSearchQuery, setMetierSearchQuery] = useState("");
  const [expertSearchQuery, setExpertSearchQuery] = useState("");

  // Récupérer les métiers depuis l'API
  useEffect(() => {
    const fetchMetiers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/metiers");
        setMetiers(response.data);
      } catch (err: any) {
        setError(err.message);
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetiers();
  }, []);

  // Gérer le clic sur "VOIR" pour afficher les experts du métier
  const handleViewExperts = (metier: Metier) => {
    setSelectedMetier(metier);
    setShowExperts(true);
  };

  // Retour à la liste des métiers
  const handleBackToMetiers = () => {
    setSelectedMetier(null);
    setShowExperts(false);
    setExpertSearchQuery("");
  };

  // Fonction utilitaire pour obtenir une image par défaut
  const getDefaultImage = (libelle: string) => {
    const colors = [
      "#556B2F", // Vert olive profond
      "#6B8E23", // Vert olive clair
      "#8B4513", // Brun chaud
    ];
    const color = colors[libelle.length % colors.length];
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="${color}"><rect width="32" height="32" fill="${color}"/><text x="16" y="20" text-anchor="middle" fill="white" font-size="12">${libelle.charAt(0)}</text></svg>`;
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackText: string
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23D3D3D3"/><text x="150" y="100" text-anchor="middle" fill="%23556B2F" font-family="Arial" font-size="14">${fallbackText}</text></svg>`;
  };

  // Filtrer les métiers
  const getFilteredMetiers = () => {
    return metiers.filter((metier) =>
      metier.libelle.toLowerCase().includes(metierSearchQuery.toLowerCase())
    );
  };

  // Filtrer les experts selon la recherche
  const getFilteredExperts = () => {
    if (!selectedMetier) return [];
    if (!expertSearchQuery) return selectedMetier.users;

    return selectedMetier.users.filter(
      (expert) =>
        expert.firstName
          ?.toLowerCase()
          .includes(expertSearchQuery.toLowerCase()) ||
        expert.lastName
          ?.toLowerCase()
          .includes(expertSearchQuery.toLowerCase()) ||
        expert.companyName
          ?.toLowerCase()
          .includes(expertSearchQuery.toLowerCase()) ||
        expert.commercialName
          ?.toLowerCase()
          .includes(expertSearchQuery.toLowerCase()) ||
        expert.email?.toLowerCase().includes(expertSearchQuery.toLowerCase())
    );
  };

  // Composant de carte pour les experts
  const renderExpertCard = (expert: User, index: number) => {
    const displayName =
      expert.commercialName ||
      expert.companyName ||
      `${expert.firstName} ${expert.lastName}` ||
      "Expert";

    return (
      <div
        key={expert.id || `expert-${index}`}
        className="bg-[#FFFFF0] rounded-xl shadow-lg border border-[#556B2F]/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={() => navigate(`/professional/${expert.id}`)}
      >
        {/* Avatar/Image */}
        <div className="aspect-square bg-gradient-to-br from-[#556B2F]/10 to-[#6B8E23]/10 relative">
          {expert.avatar ? (
            <img
              src={expert.avatar}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-16 h-16 text-[#556B2F]/30" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-[#556B2F] text-white px-2 py-1 rounded-full text-xs font-medium">
              Expert
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
            {displayName}
          </h3>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {expert.firstName && expert.lastName && (
              <p className="line-clamp-1">
                <span className="font-medium">Nom:</span> {expert.firstName}{" "}
                {expert.lastName}
              </p>
            )}
            {expert.userType && (
              <p className="line-clamp-1">
                <span className="font-medium">Type:</span> {expert.userType}
              </p>
            )}
          </div>

          {/* Note moyenne */}
          <div className="flex items-center justify-between text-sm text-gray-600 border-t border-[#D3D3D3] pt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">{expert.rating || "0"}/5</span>
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            className="w-full mt-4 bg-[#556B2F] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#6B8E23] transition-colors duration-300"
            onClick={() => navigate(`/professional/${expert.id}`)}
          >
            Voir le Profil
          </button>
        </div>
      </div>
    );
  };

  // Composant pour afficher les experts d'un métier
  const ExpertsSection = ({ metier }: { metier: Metier }) => {
    const filteredExperts = getFilteredExperts();

    return (
      <div className="space-y-6 animate-fade-in">
        {/* En-tête avec bouton retour et recherche */}
        <div className="bg-[#FFFFF0] rounded-xl shadow-lg border border-[#556B2F]/20 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToMetiers}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#8B4513] text-[#8B4513] font-medium hover:bg-[#8B4513] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="w-5 h-5" />
                Tous les Métiers
              </button>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Experts en {metier.libelle}
                </h1>
                <p className="text-[#556B2F] mt-1">
                  {filteredExperts.length} expert
                  {filteredExperts.length > 1 ? "s" : ""} disponible
                  {filteredExperts.length > 1 ? "s" : ""}
                  {expertSearchQuery && " (recherche appliquée)"}
                </p>
              </div>
            </div>

            {/* Barre de recherche pour les experts */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un expert..."
                  value={expertSearchQuery}
                  onChange={(e) => setExpertSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#D3D3D3] rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grille des experts */}
        <div className="bg-[#FFFFF0] rounded-xl shadow-lg border border-[#556B2F]/20 p-6">
          {filteredExperts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {expertSearchQuery
                  ? "Aucun expert trouvé pour votre recherche"
                  : "Aucun expert disponible pour ce métier."}
              </p>
              {expertSearchQuery && (
                <button
                  onClick={() => setExpertSearchQuery("")}
                  className="mt-4 text-[#556B2F] hover:text-[#6B8E23] underline"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExperts.map((expert, index) =>
                renderExpertCard(expert, index)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Cartes de métiers professionnelles
  const MetierCard = ({ metier, index }: { metier: Metier; index: number }) => (
    <div
      key={metier.id}
      className="bg-[#FFFFF0] rounded-xl shadow-lg border border-[#556B2F]/20 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => handleViewExperts(metier)}
    >
      {/* Image en haut */}
      <div className="h-48 bg-gradient-to-br from-[#556B2F]/10 to-[#6B8E23]/10">
        <img
          src={metier.users[0]?.avatar || getDefaultImage(metier.libelle)}
          alt={metier.libelle}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, metier.libelle)}
        />
      </div>

      {/* Contenu en bas */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          {metier.libelle}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Tag className="w-4 h-4 text-[#556B2F]" />
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-4 h-4 text-[#8B4513]" />
              <span>{metier._count.users} experts</span>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-[#556B2F] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#6B8E23] transition-colors duration-300 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            handleViewExperts(metier);
          }}
        >
          Voir
          <Users className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Affichage principal des métiers
  const MetiersGrid = () => {
    const filteredMetiers = getFilteredMetiers();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    return (
      <div className="space-y-8">
        {/* Barre de recherche pour les métiers */}
        <div className="mb-2 mt-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Recherche avec dropdown */}
            <div className="relative min-w-[300px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#556B2F]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="RECHERCHER UN MÉTIER..."
                value={metierSearchQuery}
                onChange={(e) => setMetierSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  if (metierSearchQuery.length > 0 || document.activeElement === e.target) {
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  } else {
                    setIsFocused(false);
                  }
                }}
                onMouseDown={(e) => {
                  if (document.activeElement !== e.currentTarget) {
                    e.preventDefault();
                    e.currentTarget.focus();
                  }
                }}
                className="search-input pl-10 pr-4 py-3 border border-[#D3D3D3] rounded-full bg-white text-gray-900 placeholder-gray-500 text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] transition-all"
                autoComplete="off"
                autoFocus
              />
              
              {/* Bouton Effacer la recherche */}
              {metierSearchQuery && (
                <button
                  onClick={() => setMetierSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] hover:text-[#6B8E23] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredMetiers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {metierSearchQuery
                ? "Aucun métier trouvé pour votre recherche"
                : "Aucun métier disponible pour le moment."}
            </p>
            {metierSearchQuery && (
              <button
                onClick={() => setMetierSearchQuery("")}
                className="mt-4 text-[#556B2F] hover:text-[#6B8E23] underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMetiers.map((metier, index) => (
              <MetierCard key={metier.id} metier={metier} index={index} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFFF0] py-8">
      <div className="container mx-auto px-4">
        {/* Indicateurs de chargement et d'erreur */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F]"></div>
              <span className="text-[#556B2F]">Chargement des Métiers...</span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-[#556B2F]/10 border border-[#556B2F]/30 text-[#556B2F] px-4 py-3 rounded mb-4">
            <p className="font-semibold">Attention</p>
            <p>{error}</p>
          </div>
        )}

        {/* Barre de recherche avancée */}
        <AdvancedSearchBar />

        {/* Affichage conditionnel */}
        {!showExperts && !loading && <MetiersGrid />}
        {showExperts && selectedMetier && (
          <ExpertsSection metier={selectedMetier} />
        )}
      </div>
    </div>
  );
};

export default PartnersPage;