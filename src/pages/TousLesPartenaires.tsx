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
import Allpub from "@/components/Allpub";
import AdvertisementPopup from "@/components/AdvertisementPopup";

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
  const [isMetierModalOpen, setIsMetierModalOpen] = useState(false);
  const [metierSearchTerm, setMetierSearchTerm] = useState("");

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
        // console.log("Réponse API professionnels:", res.data);
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
    <div className="bg-white min-h-screen pb-4">
      <main className="container mx-auto px-0 max-w-7xl">
        {/* En-tête */}
        <div className="relative pt-16 mb-2">
          <div
            className="absolute inset-0 bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200")',
            }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </div>

          <div className="relative text-center py-10 px-0">
            <h1 className="text-3xl md:text-5xl font-medium uppercase text-white mb-4 drop-shadow-lg">
              Tous Nos Partenaires
            </h1>
            <p className="text-sm md:text-md text-gray-100 max-w-3xl mx-auto drop-shadow-md">
              Découvrez notre réseau complet de professionnels et partenaires de
              confiance
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Métiers */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold underline text-gray-900 ">
              Métiers :
            </h3>
            {loadingMetiers ? (
              <div className="text-gray-500">Chargement des métiers...</div>
            ) : metiers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMetier("")}
                  className={`px-4 py-2 text-xs rounded-lg border-2 transition-all ${
                    selectedMetier === ""
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  Tous les métiers
                </button>
                {metiers.slice(0, 4).map((metier) => (
                  <button
                    key={metier.id}
                    onClick={() => setSelectedMetier(metier.id.toString())}
                    className={`px-2 py-1 text-xs rounded-lg border-2 transition-all ${
                      selectedMetier === metier.id.toString()
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50"
                    }`}
                  >
                    {metier.libelle} ({metier.count})
                  </button>
                ))}
                {metiers.length > 5 && (
                  <button
                    onClick={() => setIsMetierModalOpen(true)}
                    className="px-4 py-2 text-xs rounded-lg border-2 border-green-600 bg-green-50 text-green-600 hover:bg-green-100 transition-all font-semibold"
                  >
                    + {metiers.length - 5} métiers
                  </button>
                )}
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

        <AdvertisementPopup position="page-partenaires-nos-partenaires" showOnMobile={true}/>

        {/* Contenu */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Chargement des partenaires...</p>
          </div>
        ) : professionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
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
        position="bottom-left"
        className="bg-green-600 hover:bg-green-700"
        category="all"
      />

      {/* Modal pour afficher tous les métiers */}
      {isMetierModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* En-tête du modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Tous les métiers</h2>
              <button
                onClick={() => {
                  setIsMetierModalOpen(false);
                  setMetierSearchTerm("");
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un métier..."
                  value={metierSearchTerm}
                  onChange={(e) => setMetierSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Liste des métiers */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {metiers
                  .filter((metier) =>
                    metier.libelle.toLowerCase().includes(metierSearchTerm.toLowerCase())
                  )
                  .map((metier) => (
                    <button
                      key={metier.id}
                      onClick={() => {
                        setSelectedMetier(metier.id.toString());
                        setIsMetierModalOpen(false);
                        setMetierSearchTerm("");
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedMetier === metier.id.toString()
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-500 hover:bg-green-50"
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{metier.libelle}</p>
                      <p className="text-sm text-gray-600 mt-1">{metier.count} professionnel{metier.count > 1 ? "s" : ""}</p>
                    </button>
                  ))}
              </div>

              {metiers.filter((m) =>
                m.libelle.toLowerCase().includes(metierSearchTerm.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun métier ne correspond à votre recherche</p>
                </div>
              )}
            </div>

            {/* Pied du modal */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsMetierModalOpen(false);
                  setMetierSearchTerm("");
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
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
  className="relative bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col items-center text-center p-0"
>
  {/* Bannière incurvée compacte */}
  <div className="relative w-full h-24 bg-logo/70 rounded-b-3xl mb-10 overflow-hidden">
    {/* Éléments décoratifs d'arrière-plan */}
    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full"></div>
    
    {/* Badge "PRO" en haut à droite */}
    <div className="absolute top-4 right-4 bg-white text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-md">
      PRO
    </div>
    
  </div>

  {/* Avatar compact */}
  <div className="relative -mt-20 mb-3 z-10">
    <div className="w-24 h-24 rounded-full border-8 border-white overflow-hidden bg-white mx-auto shadow-sm">
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
                "w-full h-full flex items-center justify-center bg-logo text-white text-xl font-bold";
                initial.textContent =
                  professional.firstName?.[0]?.toUpperCase() ||
                  professional.companyName?.[0]?.toUpperCase() ||
                  "P";
              parent.appendChild(initial);
            }
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-logo text-white text-xl font-bold">
          {professional.firstName?.[0]?.toUpperCase() ||
            professional.companyName?.[0]?.toUpperCase() ||
            "P"}
        </div>
      )}
    </div>
    
    {/* Badge de vérification compact */}
    <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>

  {/* Contenu principal compact */}
  <div className="px-4 pb-4 w-full">
    {/* Nom et prénom compacts */}
    <div className="mb-2">
      <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
        {professional.firstName || ""}
      </h3>
      <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
        {professional.lastName || ""}
      </h3>
    </div>

    {/* Titre/Poste compact */}
    <div className="mb-3">
      <p className="text-xs font-semibold text-emerald-700 px-3 py-1 rounded-full bg-emerald-50 inline-block">
        {getJob()}
      </p>
    </div>

    {/* Note compacte */}
    {professional.rating && (
      <div className="absolute top-3 left-4 flex items-center justify-center mb-3">
        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full border border-amber-100 text-xs">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span className="ml-1 font-bold text-gray-900">
            {professional.rating.toFixed(1)}
          </span>
          <span className="ml-1 text-gray-500">
            ({professional.reviewCount})
          </span>
        </div>
      </div>
    )}

    {/* Métier et localisation compacts */}
    <div className="space-y-2 mb-3 grid grid-cols-1 lg:grid-cols-2 w-full">
      {professional.metiers?.[0]?.metier.libelle && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <Briefcase size={10} className="text-emerald-600 flex-shrink-0" />
          <span className="text-gray-600 truncate">
            {professional.metiers[0].metier.libelle}
          </span>
        </div>
      )}

      {professional.city && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <MapPin size={10} className="text-blue-600 flex-shrink-0" />
          <span className="text-gray-600 truncate">{professional.city}</span>
        </div>
      )}
    </div>

    {/* Contact compact */}
    <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 mb-3 w-full">
      {professional.phone && (
        <a
          href={`tel:${professional.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <Phone size={10} className="text-gray-500 flex-shrink-0" />
          <span className="truncate font-medium">{professional.phone}</span>
        </a>
      )}

      {professional.email && (
        <a
          href={`mailto:${professional.email}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <Mail size={10} className="text-gray-500 flex-shrink-0" />
          <span className="truncate max-w-full font-medium">{professional.email}</span>
        </a>
      )}
    </div>

    {/* Bouton principal compact */}
    <button
      onClick={handleClick}
      className="w-full py-2 bg-logo text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      Voir profil
    </button>
    
    {/* Footer minimaliste */}
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-[10px] text-gray-400">
        Membre depuis {formatDate(professional.createdAt)}
      </p>
    </div>
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
