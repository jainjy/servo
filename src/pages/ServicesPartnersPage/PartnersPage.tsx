import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  Tag,
  Search,
  Star,
  Clock,
  Wrench,
  FileText,
  Loader2,
  X,
  Mail,
  Phone,
  Building,
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

// Composant Modal Contact
const ContactModal = ({ expert, isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  if (!isOpen) return null;

  const displayName =
    expert.commercialName ||
    expert.companyName ||
    `${expert.firstName} ${expert.lastName}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Contacter l'expert
              </h2>
              <p className="text-gray-600 text-xs lg:text-sm">{displayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 flex items-center justify-center transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                name="nom"
                placeholder="Votre nom"
                required
                value={formData.nom}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                value={formData.prenom}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                value={formData.telephone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              placeholder="Décrivez votre projet ou votre demande..."
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Expert contacté
            </h3>
            <p className="text-blue-800 text-sm">{displayName}</p>
            {expert.userType && (
              <p className="text-blue-600 text-xs mt-1">{expert.userType}</p>
            )}
          </div>

          <div className="grid lg:flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PartnersPage = () => {
  const [showExperts, setShowExperts] = useState(false);
  const [selectedMetier, setSelectedMetier] = useState<Metier | null>(null);
  const [metiers, setMetiers] = useState<Metier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate()
  // États pour les recherches
  const [metierSearchQuery, setMetierSearchQuery] = useState("");
  const [expertSearchQuery, setExpertSearchQuery] = useState("");

  // Récupérer les métiers depuis l'API
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
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
    ];
    const color = colors[libelle.length % colors.length];
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="${color.replace(
      "bg-",
      ""
    )}"><rect width="32" height="32" fill="${color.replace(
      "bg-",
      ""
    )}"/><text x="16" y="20" text-anchor="middle" fill="white" font-size="12">${libelle.charAt(
      0
    )}</text></svg>`;
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackText: string
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23E5E7EB"/><text x="150" y="100" text-anchor="middle" fill="%23374151" font-family="Arial" font-size="14">${fallbackText}</text></svg>`;
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
        className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={() => navigate(`/professional/${expert.id}`)}
      >
        {/* Avatar/Image */}
        <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 relative">
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
              <Users className="w-16 h-16 text-gray-300" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
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
          <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">{expert.rating || "0"}/5</span>
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
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
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToMetiers}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Tous les Métiers
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Experts en {metier.libelle}
                </h1>
                <p className="text-gray-600 mt-1">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un expert..."
                  value={expertSearchQuery}
                  onChange={(e) => setExpertSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grille des experts */}
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
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
                  className="mt-4 text-green-600 hover:text-green-700 underline"
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
      className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={() => handleViewExperts(metier)}
    >
      {/* Image en haut */}
      <div className="h-48 bg-gray-100">
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
              <Tag className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-4 h-4 text-green-500" />
              <span>{metier._count.users} experts</span>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
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

    return (
      <div className="space-y-8">
        {/* Barre de recherche pour les métiers */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un métier..."
            value={metierSearchQuery}
            onChange={(e) => setMetierSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
                className="mt-4 text-blue-600 hover:text-blue-700 underline"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Indicateurs de chargement et d'erreur */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">
              Chargement des métiers...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Attention</p>
            <p>{error}</p>
          </div>
        )}

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
