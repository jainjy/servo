import React, { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Search,
  Star,
  Briefcase,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import CarteBoutton from "./CarteBoutton";

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  commercialName?: string;
  city?: string;
  zipCode?: string;
  avatar?: string;
  createdAt: string;
  rating?: number;
  reviewCount?: number;
  metiers?: Array<{ metier: { id: number; libelle: string } }>;
}

interface MetierOption {
  id: number;
  libelle: string;
  count: number;
}

const TousLesPartenaires = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMetier, setSelectedMetier] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [metiers, setMetiers] = useState<MetierOption[]>([]);
  const [loadingMetiers, setLoadingMetiers] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  // Charger les métiers disponibles
  useEffect(() => {
    const loadMetiers = async () => {
      try {
        setLoadingMetiers(true);
        const res = await api.get("/pro/metiers/disponibles");
        if (res.data.success) {
          setMetiers(res.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des métiers:", error);
        setMetiers([]);
      } finally {
        setLoadingMetiers(false);
      }
    };

    loadMetiers();
  }, []);

  // Charger les professionnels avec filtres et tri
  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setLoading(true);
        let endpoint = "/pro";

        const params = new URLSearchParams();
        if (selectedMetier) params.append("metierId", selectedMetier);
        if (cityFilter) params.append("city", cityFilter);
        if (searchTerm) params.append("search", searchTerm);
        if (sortBy) params.append("sort", sortBy);

        const queryString = params.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }

        const res = await api.get(endpoint);
        if (res.data.success) {
          // Simuler des données de rating pour la démo
          const professionalsWithRating = res.data.data.map(
            (pro: Professional) => ({
              ...pro,
              rating: pro.rating || Math.random() * 2 + 3, // 3-5 étoiles
              reviewCount: pro.reviewCount || Math.floor(Math.random() * 50),
            })
          );
          setProfessionals(professionalsWithRating);
        }
      } catch (error) {
        console.error("Erreur API:", error);
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, [selectedMetier, cityFilter, searchTerm, sortBy]);

  const getName = (p: Professional) =>
    p.firstName && p.lastName
      ? `${p.firstName} ${p.lastName}`
      : p.commercialName || p.companyName || "Professionnel";

  const getJob = (p: Professional) =>
    p.metiers?.[0]?.metier.libelle ||
    p.companyName ||
    p.commercialName ||
    "Métier non spécifié";

  // Extraire les villes uniques
  const uniqueCities = Array.from(
    new Set(professionals.map((p) => p.city).filter(Boolean))
  ).sort();

  // Fonction pour afficher les étoiles
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= Math.floor(rating)
                ? "text-yellow-500 fill-yellow-500"
                : star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} ({Math.floor(Math.random() * 50)} avis)
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen pt-16">
      <main className="container mx-auto px-0 py-2 max-w-7xl">
        {/* En-tête */}
        <div className="relative mb-2">
          <div
            className="absolute inset-0 bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 to-blue-900/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.3)_80%)]" />
          </div>

          <div className="relative text-center py-20 px-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Tous Nos Partenaires
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-md">
              Découvrez notre réseau complet de professionnels et partenaires de
              confiance
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Métiers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Métiers
            </h3>
            {loadingMetiers ? (
              <div className="text-gray-500">Chargement des métiers...</div>
            ) : metiers.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2">
                <button
                  onClick={() => setSelectedMetier("")}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedMetier === ""
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  Tous les métiers
                </button>
                {metiers.map((metier) => (
                  <button
                    key={metier.id}
                    onClick={() => setSelectedMetier(metier.id.toString())}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedMetier === metier.id.toString()
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50"
                    }`}
                  >
                    {metier.libelle} ({metier.count})
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucun métier disponible</p>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Recherche */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom, email, métier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>

            {/* Filtre Ville */}
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              >
                <option value="">Toutes les villes</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
              >
                <option value="newest">Plus récents</option>
                <option value="rating">Meilleures notes</option>
                <option value="name">Nom A-Z</option>
              </select>
            </div>
          </div>

          {/* Compteur de résultats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Users size={20} />
              <span className="font-medium">
                {professionals.length} professionnel
                {professionals.length > 1 ? "s" : ""} trouvé
                {professionals.length > 1 ? "s" : ""}
                {searchTerm && ` pour "${searchTerm}"`}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {selectedMetier && "Filtré par métier • "}
              {cityFilter && `Ville: ${cityFilter}`}
            </div>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Chargement des partenaires...</p>
          </div>
        ) : professionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((p) => (
              <ProfessionalCardTLP
                key={p.id}
                professional={p}
                renderStars={renderStars}
              />
            ))}
          </div>
        ) : (
          <NoResultsTLP
            searchTerm={searchTerm}
            onReset={() => {
              setSearchTerm("");
              setCityFilter("");
              setSelectedMetier("");
              setSortBy("newest");
            }}
          />
        )}
      </main>

      <CarteBoutton
        size="lg"
        position="bottom-right"
        className="bg-green-600 hover:bg-green-700"
        category="all"
      />
    </div>
  );
};

// Composant Carte Professionnel amélioré
const ProfessionalCardTLP: React.FC<{
  professional: Professional;
  renderStars: (rating: number) => React.ReactNode;
}> = ({ professional, renderStars }) => {
  const navigate = useNavigate();

  const getName = () =>
    professional.firstName && professional.lastName
      ? `${professional.firstName} ${professional.lastName}`
      : professional.commercialName ||
        professional.companyName ||
        "Professionnel";

  const getJob = () =>
    professional.metiers?.[0]?.metier.libelle ||
    professional.companyName ||
    professional.commercialName ||
    "Métier non spécifié";

  const handleClick = () => {
    navigate(`/professional/${professional.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
    }).format(date);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group"
    >
      {/* En-tête avec avatar */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-green-100 overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
              {professional.avatar ? (
                <img
                  src={professional.avatar}
                  alt={getName()}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const initial = document.createElement("div");
                      initial.className =
                        "w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 text-white text-2xl font-bold";
                      initial.textContent =
                        professional.firstName?.[0]?.toUpperCase() ||
                        professional.companyName?.[0]?.toUpperCase() ||
                        "P";
                      parent.appendChild(initial);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 text-white text-2xl font-bold">
                  {professional.firstName?.[0]?.toUpperCase() ||
                    professional.companyName?.[0]?.toUpperCase() ||
                    "P"}
                </div>
              )}
            </div>
            {/* Badge de vérification */}
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Informations principales */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                  {getName()}
                </h3>
                <p className="text-sm text-green-600 font-medium truncate">
                  {getJob()}
                </p>
              </div>
              {/* Note */}
              {professional.rating && (
                <div className="flex flex-col items-end">
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="ml-1 font-bold text-gray-900">
                      {professional.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {professional.reviewCount} avis
                  </span>
                </div>
              )}
            </div>

            {/* Métier */}
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {professional.metiers?.[0]?.metier.libelle ||
                  "Métier non spécifié"}
              </span>
            </div>

            {/* Localisation */}
            {professional.city && (
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {professional.city}
                </span>
              </div>
            )}

            {/* Date d'inscription */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Inscrit {formatDate(professional.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-gray-100"></div>

      {/* Pied de carte - Contact */}
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          {/* Téléphone */}
          {professional.phone && (
            <a
              href={`tel:${professional.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors p-2 hover:bg-white rounded"
            >
              <Phone size={16} className="text-gray-400" />
              <span className="truncate">{professional.phone}</span>
            </a>
          )}

          {/* Email */}
          <a
            href={`mailto:${professional.email}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors p-2 hover:bg-white rounded col-span-2"
          >
            <Mail size={16} className="text-gray-400" />
            <span className="truncate">{professional.email}</span>
          </a>
        </div>

        {/* Bouton action */}
        <button
          onClick={handleClick}
          className="w-full mt-4 py-2.5 bg-white border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors group-hover:bg-green-600 group-hover:text-white"
        >
          Voir le profil
        </button>
      </div>
    </div>
  );
};

// Composant Aucun résultat amélioré
const NoResultsTLP: React.FC<{ searchTerm: string; onReset: () => void }> = ({
  searchTerm,
  onReset,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <Users size={40} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Aucun partenaire trouvé
        </h3>
        <p className="text-gray-600 mb-8">
          {searchTerm
            ? `Aucun résultat ne correspond à votre recherche "${searchTerm}"`
            : "Aucun partenaire n'est actuellement disponible avec ces critères"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Réinitialiser les filtres
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Nous contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default TousLesPartenaires;
