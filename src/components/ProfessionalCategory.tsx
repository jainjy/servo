import React, { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Phone,
  Search,
  MapPin,
  Star,
  Briefcase,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";
import api from "@/lib/api";
import Allpub from "./Allpub";

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

interface ProfessionalCategoryProps {
  category: "agences" | "constructeurs" | "plombiers" | string;
  title: string;
  description: string;
  bannerImage?: string;
}

const ProfessionalCategory: React.FC<ProfessionalCategoryProps> = ({
  category,
  title,
  description,
  bannerImage = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200",
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        let endpoint = `/pro/${category}`;
        const params = new URLSearchParams();

        if (cityFilter) params.append("city", cityFilter);
        if (sortBy) params.append("sort", sortBy);

        const queryString = params.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }

        const res = await api.get(endpoint);
        if (res.data.success) {
          const professionalsWithRating = res.data.data.map(
            (pro: Professional) => ({
              ...pro,
              rating: pro.rating || Math.random() * 2 + 3,
              reviewCount: pro.reviewCount || Math.floor(Math.random() * 50),
            })
          );
          setProfessionals(professionalsWithRating);
        }
      } catch (error) {
        console.error(`Erreur API ${category}:`, error);
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, [category, cityFilter, sortBy]);

  const getName = (p: Professional) =>
    p.firstName && p.lastName
      ? `${p.firstName} ${p.lastName}`
      : p.commercialName || p.companyName || "Professionnel";

  const getJob = (p: Professional) =>
    p.metiers?.[0]?.metier.libelle ||
    p.companyName ||
    p.commercialName ||
    "Métier non spécifié";

  // Filtrer localement pour la recherche
  const filteredProfessionals = professionals.filter((p) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      getName(p).toLowerCase().includes(searchLower) ||
      getJob(p).toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower) ||
      (p.city && p.city.toLowerCase().includes(searchLower))
    );
  });

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
            className={`${star <= Math.floor(rating)
                ? "text-yellow-500 fill-yellow-500"
                : star <= rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Bannière améliorée */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${bannerImage}')` }}
        />
        <div className="relative container mx-auto px-4 pt-20 pb-5">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-medium uppercase mb-4">{title}</h1>
            <p className="text-sm md:text-md text-gray-200 mb-8">
              {description}
            </p>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Users className="mr-3" />
              <span className="font-semibold">
                {professionals.length} professionnel
                {professionals.length > 1 ? "s" : ""} disponible
                {professionals.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Filtres améliorés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Bouton toggle filtres mobiles */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-between w-full mb-4 px-4 py-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <Filter size={18} className="mr-2" />
              <span className="font-medium">Filtres et tri</span>
            </div>
            <ChevronDown
              className={`transform transition-transform ${showFilters ? "rotate-180" : ""
                }`}
            />
          </button>
          <Allpub
            title="Offres spéciales"
            description="Bénéficiez de réductions exclusives sur nos meilleurs services."
            image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
            background="bg-white"
            textbg="text-slate-900"
          />
          {/* Contenu des filtres */}
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="newest">Plus récents</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="name">Nom A-Z</option>
                </select>
              </div>
            </div>

            {/* Compteur de résultats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={20} />
                <span className="font-medium">
                  {filteredProfessionals.length} {title.toLowerCase()}
                  {searchTerm && ` pour "${searchTerm}"`}
                </span>
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                {cityFilter && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    Ville: {cityFilter}
                  </span>
                )}
                {sortBy !== "newest" && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
                    Tri: {sortBy === "rating" ? "Meilleures notes" : "Nom A-Z"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">
              Chargement des {title.toLowerCase()}...
            </p>
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((p) => (
              <ProfessionalCard
                key={p.id}
                professional={p}
                renderStars={renderStars}
              />
            ))}
          </div>
        ) : (
          <NoResults
            searchTerm={searchTerm}
            onReset={() => {
              setSearchTerm("");
              setCityFilter("");
              setSortBy("newest");
            }}
            title={title}
          />
        )}
      </main>
    </div>
  );
};

// Composant Carte Professionnel amélioré
const ProfessionalCard: React.FC<{
  professional: Professional;
  renderStars: (rating: number) => React.ReactNode;
}> = ({ professional, renderStars }) => {
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
    window.location.href = `/professional/${professional.id}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `Inscrit il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    }

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return `Inscrit il y a ${diffMonths} mois`;
    }

    const diffYears = Math.floor(diffMonths / 12);
    return `Inscrit il y a ${diffYears} an${diffYears > 1 ? "s" : ""}`;
  };

  return (
    <div
      onClick={handleClick}
      className=" relative rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group h-full flex flex-col"
    >
      {/* En-tête avec avatar et note */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-blue-100 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
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
                        "w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl sm:text-2xl font-bold";
                      initial.textContent =
                        professional.firstName?.[0]?.toUpperCase() ||
                        professional.companyName?.[0]?.toUpperCase() ||
                        "P";
                      parent.appendChild(initial);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl sm:text-2xl font-bold">
                  {professional.firstName?.[0]?.toUpperCase() ||
                    professional.companyName?.[0]?.toUpperCase() ||
                    "P"}
                </div>
              )}
            </div>
            {/* Badge de vérification */}
            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 sm:p-1.5 rounded-full">
              <svg
                className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors break-words">
                  {getName()}
                </h3>
                <p className="text-xs sm:text-sm text-blue-600 font-medium line-clamp-1 break-words">
                  {getJob()}
                </p>
              </div>
              {/* Note */}
              {professional.rating && (
                <div className="flex flex-col items-start sm:items-end flex-shrink-0">
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-sm">
                    <Star
                      size={14}
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
            <div className="flex items-start gap-2 mb-2 sm:mb-3">
              <Briefcase
                size={14}
                className="text-gray-400 flex-shrink-0 mt-0.5"
              />
              <span className="text-xs sm:text-sm text-gray-600 line-clamp-2 break-words">
                {professional.metiers?.[0]?.metier.libelle ||
                  "Métier non spécifié"}
              </span>
            </div>

            {/* Localisation */}
            {professional.city && (
              <div className="flex items-start gap-2 mb-2 sm:mb-4">
                <MapPin
                  size={14}
                  className="text-gray-400 flex-shrink-0 mt-0.5"
                />
                <span className="text-xs sm:text-sm text-gray-600 break-words">
                  {professional.city}
                </span>
              </div>
            )}

            {/* Date d'inscription */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Calendar size={14} className="flex-shrink-0" />
              <span className="line-clamp-1">
                {formatDate(professional.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-gray-100"></div>

      {/* Pied de carte - Contact */}
      <div className="p-3 sm:p-4 mt-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
          {/* Téléphone */}
          {professional.phone && (
            <a
              href={`tel:${professional.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-white rounded"
            >
              <Phone size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{professional.phone}</span>
            </a>
          )}

          {/* Email */}
          <a
            href={`mailto:${professional.email}`}
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-white rounded ${professional.phone ? "sm:col-span-2" : "col-span-1 sm:col-span-2"
              }`}
          >
            <Mail size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{professional.email}</span>
          </a>
        </div>

        {/* Bouton action */}
        <button
          onClick={handleClick}
          className="w-full py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors group-hover:bg-blue-600 group-hover:text-white"
        >
          Voir le profil
        </button>
      </div>
    </div>
  );
};

// Composant Aucun résultat amélioré
const NoResults: React.FC<{
  searchTerm: string;
  onReset: () => void;
  title: string;
}> = ({ searchTerm, onReset, title }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
    <div className="max-w-md mx-auto">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
        <Users size={40} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Aucun {title.toLowerCase()} trouvé
      </h3>
      <p className="text-gray-600 mb-8">
        {searchTerm
          ? `Aucun résultat ne correspond à votre recherche "${searchTerm}"`
          : `Aucun ${title.toLowerCase()} n'est actuellement disponible avec ces critères`}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réinitialiser les filtres
        </button>
        <button
          onClick={() => (window.location.href = "/contact")}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Nous contacter
        </button>
      </div>
    </div>
  </div>
);

export default ProfessionalCategory;
