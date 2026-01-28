import React, { useEffect, useRef, useState } from "react";
import { 
  Home, 
  Sprout, 
  Droplets, 
  Shield, 
  CheckCircle, 
  Users, 
  Clock, 
  Award,
  Search,
  X,
  Filter,
  ChevronDown,
  Euro
} from "lucide-react";
import api from "@/lib/api";
import DemandeDevisModal from "@/components/DemandeDevisModal";

interface Service {
  id: number;
  libelle: string;
  description: string;
  price: number;
  duration: number;
  images: string[];
  category: { name: string };
  benefits?: string;
  tags?: string[];
  metiers?: Array<{
    metier: {
      libelle: string;
    };
  }>;
}

// Composant SlideIn intégré
const SlideIn = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : direction === "left"
            ? "opacity-0 -translate-x-10"
            : direction === "right"
              ? "opacity-0 translate-x-10"
              : direction === "up"
                ? "opacity-0 translate-y-10"
                : "opacity-0 translate-y-10"
        }
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Composant ServiceCard intégré
const ServiceCard = ({ service, index, onOpenModal }) => {
  const handleCardClick = () => {
    onOpenModal(service);
  };

  // Convertir les minutes en format "Xh"
  const formatDuration = (minutes: number) => {
    if (!minutes) return "À discuter";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}min`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
    }
  };

  // Image par défaut si aucune image
  const getDefaultImage = (serviceName: string) => {
    const serviceImages = {
      "Ménage": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Jardinage": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Piscine": "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Sécurité": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "default": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    };

    if (service.libelle.includes("Ménage") || service.libelle.includes("Nettoyage")) {
      return serviceImages["Ménage"];
    } else if (service.libelle.includes("Jardin") || service.libelle.includes("Tonte") || service.libelle.includes("Haies") || service.libelle.includes("Pelouse")) {
      return serviceImages["Jardinage"];
    } else if (service.libelle.includes("Piscine")) {
      return serviceImages["Piscine"];
    } else if (service.libelle.includes("Alarme") || service.libelle.includes("Sécurité") || service.libelle.includes("Caméra")) {
      return serviceImages["Sécurité"];
    }
    return serviceImages["default"];
  };

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-separator dark:border-border hover:border-primary-dark transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={service.images?.[0] || getDefaultImage(service.libelle)}
          alt={service.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = getDefaultImage(service.libelle);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 bg-logo text-white px-4 py-2 rounded-full shadow-lg font-bold">
          {service.price ? `${service.price}€` : "Devis"}
        </div>
        
        {service.duration && (
          <div className="absolute bottom-4 left-4 bg-primary-dark text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(service.duration)}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2 flex-1">
            {service.libelle}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
          {service.description}
        </p>

        {service.benefits && (
          <div className="pt-2 border-t border-separator">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Avantages :</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{service.benefits}</p>
          </div>
        )}

        {service.metiers && service.metiers.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Métiers associés :</p>
            <div className="flex flex-wrap gap-2">
              {service.metiers.slice(0, 3).map((metier, idx) => (
                <span key={idx} className="text-xs bg-[#556B2F]/10 text-[#556B2F] px-2 py-1 rounded-full">
                  {metier.metier.libelle}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleCardClick}
          className="w-full bg-logo hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 mt-4"
        >
          <CheckCircle className="w-5 h-5" />
          Demander un devis
        </button>
      </div>
    </div>
  );
};

const ServicesMaison = ({ searchTerm = "", onSearchChange }: { searchTerm?: string, onSearchChange?: (value: string) => void }) => {
  const [servicesMaison, setServicesMaison] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // États pour les filtres
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [selectedMetier, setSelectedMetier] = useState<string>("Tous");
  const [sortBy, setSortBy] = useState<string>("pertinence");

  useEffect(() => {
    fetchServicesMaison();
  }, []);

  const fetchServicesMaison = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer tous les services de la catégorie "Services Maison"
      const response = await api.get('/service-maison/maison');

      if (response.data && Array.isArray(response.data)) {
        setServicesMaison(response.data);
      } else {
        console.warn("Réponse API inattendue:", response.data);
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des services:", err);
      setError("Impossible de charger les services. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleSearch = (value: string) => {
    setLocalSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Fonction pour extraire les catégories uniques des services
  const getUniqueCategories = () => {
    const categories = servicesMaison.map(service => {
      const libelle = service.libelle.toLowerCase();
      if (libelle.includes("ménage") || libelle.includes("nettoyage")) {
        return "Ménage";
      } else if (libelle.includes("jardin") || libelle.includes("tonte") || libelle.includes("haies") || libelle.includes("pelouse")) {
        return "Jardinage";
      } else if (libelle.includes("piscine")) {
        return "Piscine";
      } else if (libelle.includes("alarme") || libelle.includes("sécurité") || libelle.includes("caméra")) {
        return "Sécurité";
      } else {
        return "Spécialisé";
      }
    });
    return ["Tous", ...Array.from(new Set(categories))];
  };

  // Fonction pour extraire les métiers uniques
  const getUniqueMetiers = () => {
    const metiers = new Set<string>();
    servicesMaison.forEach(service => {
      service.metiers?.forEach(m => metiers.add(m.metier.libelle));
    });
    return ["Tous", ...Array.from(metiers)];
  };

  // Fonction de tri
  const sortServices = (services: Service[]) => {
    switch (sortBy) {
      case "prix-croissant":
        return [...services].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "prix-dec":
        return [...services].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "duree-croissante":
        return [...services].sort((a, b) => (a.duration || 0) - (b.duration || 0));
      case "nom-az":
        return [...services].sort((a, b) => a.libelle.localeCompare(b.libelle));
      default:
        return services; // pertinence
    }
  };

  // Filtrer et trier les services
  const getFilteredServices = () => {
    let filtered = servicesMaison.filter(service => {
      // Filtre par recherche textuelle
      const matchesSearch = 
        service.libelle?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        service.category?.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        service.tags?.some(tag => tag.toLowerCase().includes(localSearchTerm.toLowerCase())) ||
        service.metiers?.some(m => m.metier.libelle.toLowerCase().includes(localSearchTerm.toLowerCase()));

      // Filtre par catégorie
      const matchesCategory = selectedCategory === "Tous" || 
        (selectedCategory === "Ménage" && (service.libelle.includes("Ménage") || service.libelle.includes("Nettoyage"))) ||
        (selectedCategory === "Jardinage" && (service.libelle.includes("Jardin") || service.libelle.includes("Tonte") || service.libelle.includes("Haies") || service.libelle.includes("Pelouse"))) ||
        (selectedCategory === "Piscine" && service.libelle.includes("Piscine")) ||
        (selectedCategory === "Sécurité" && (service.libelle.includes("Alarme") || service.libelle.includes("Sécurité") || service.libelle.includes("Caméra"))) ||
        (selectedCategory === "Spécialisé" && !service.libelle.includes("Ménage") && !service.libelle.includes("Jardin") && !service.libelle.includes("Piscine") && !service.libelle.includes("Alarme") && !service.libelle.includes("Sécurité"));

      // Filtre par métier
      const matchesMetier = selectedMetier === "Tous" || 
        service.metiers?.some(m => m.metier.libelle === selectedMetier);

      // Filtre par prix
      const matchesPrice = 
        (priceRange.min === null || (service.price || 0) >= priceRange.min) &&
        (priceRange.max === null || (service.price || 0) <= priceRange.max);

      return matchesSearch && matchesCategory && matchesMetier && matchesPrice;
    });

    // Trier les services
    return sortServices(filtered);
  };

  const filteredServices = getFilteredServices();

  // Grouper les services par type pour le comptage
  const getServiceCountByType = () => {
    const counts = {
      "Ménage": 0,
      "Jardinage": 0,
      "Piscine": 0,
      "Sécurité": 0,
      "Spécialisé": 0
    };

    servicesMaison.forEach(service => {
      const libelle = service.libelle.toLowerCase();
      if (libelle.includes("ménage") || libelle.includes("nettoyage")) {
        counts["Ménage"]++;
      } else if (libelle.includes("jardin") || libelle.includes("tonte") || libelle.includes("haies") || libelle.includes("pelouse")) {
        counts["Jardinage"]++;
      } else if (libelle.includes("piscine")) {
        counts["Piscine"]++;
      } else if (libelle.includes("alarme") || libelle.includes("sécurité") || libelle.includes("caméra")) {
        counts["Sécurité"]++;
      } else {
        counts["Spécialisé"]++;
      }
    });

    return counts;
  };

  const serviceCounts = getServiceCountByType();
  const categories = [
    { name: "Ménage", icon: <Home className="w-5 h-5" />, count: serviceCounts["Ménage"], color: "bg-blue-100 text-blue-600" },
    { name: "Jardinage", icon: <Sprout className="w-5 h-5" />, count: serviceCounts["Jardinage"], color: "bg-green-100 text-green-600" },
    { name: "Piscine", icon: <Droplets className="w-5 h-5" />, count: serviceCounts["Piscine"], color: "bg-cyan-100 text-cyan-600" },
    { name: "Sécurité", icon: <Shield className="w-5 h-5" />, count: serviceCounts["Sécurité"], color: "bg-red-100 text-red-600" },
    { name: "Spécialisé", icon: <Award className="w-5 h-5" />, count: serviceCounts["Spécialisé"], color: "bg-purple-100 text-purple-600" }
  ].filter(cat => cat.count > 0);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-logo mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Chargement des services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 max-w-md mx-auto">
          <Home className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchServicesMaison}
            className="mt-4 bg-logo hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Barre de recherche et filtres */}
        <SlideIn direction="left">
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un service maison..."
                value={localSearchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-card focus:ring-2 focus:ring-logo focus:border-logo"
              />
              {localSearchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Barre de filtres */}
            <div className="flex flex-wrap items-center gap-4 justify-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtres
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Tri */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-card border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-logo focus:border-logo appearance-none pr-8"
                >
                  <option value="pertinence">Pertinence</option>
                  <option value="prix-croissant">Prix croissant</option>
                  <option value="prix-dec">Prix décroissant</option>
                  <option value="duree-croissante">Durée croissante</option>
                  <option value="nom-az">Nom A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              {/* Filtre rapide par catégorie */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-logo text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white dark:bg-card border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Filtre par métier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Métier
                    </label>
                    <select
                      value={selectedMetier}
                      onChange={(e) => setSelectedMetier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                    >
                      {getUniqueMetiers().map(metier => (
                        <option key={metier} value={metier}>{metier}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtre par prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fourchette de prix (€)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min || ''}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value ? Number(e.target.value) : null})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max || ''}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value ? Number(e.target.value) : null})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex items-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory("Tous");
                        setSelectedMetier("Tous");
                        setPriceRange({ min: null, max: null });
                        setLocalSearchTerm("");
                        setSortBy("pertinence");
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-logo text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SlideIn>

        {/* Introduction */}
        <SlideIn direction="left">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-logo/10">
                <Home className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white drop-shadow-md">
                  Services Maison
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium">
                  Prenez soin de votre maison avec nos professionnels qualifiés
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-8 border-2 border-logo/30 shadow-md">
              <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                Confiez l'entretien de votre maison à des experts certifiés. Que ce soit pour le ménage, le jardinage, 
                l'entretien de votre piscine ou la sécurité de votre foyer, nous proposons des solutions complètes et personnalisées 
                pour répondre à tous vos besoins.
              </p>
            </div>

            {/* Catégories de services */}
            {categories.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-md">Nos domaines d'expertise</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {categories.map((category, index) => (
                    <div key={index} className="bg-white dark:bg-card rounded-xl p-4 text-center border border-separator dark:border-border hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-center mb-2">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          {category.icon}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{category.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{category.count} service{category.count > 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SlideIn>

        {/* Services */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Nos Services Maison
              </h3>
              {selectedCategory !== "Tous" || selectedMetier !== "Tous" || priceRange.min || priceRange.max || localSearchTerm ? (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredServices.length} résultat{filteredServices.length > 1 ? 's' : ''}
                  {selectedCategory !== "Tous" && ` • Catégorie: ${selectedCategory}`}
                  {selectedMetier !== "Tous" && ` • Métier: ${selectedMetier}`}
                  {(priceRange.min || priceRange.max) && ` • Prix: ${priceRange.min || '0'}€ - ${priceRange.max || '∞'}€`}
                  {localSearchTerm && ` • Recherche: "${localSearchTerm}"`}
                </p>
              ) : null}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
            </div>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredServices.map((service, index) => (
                <SlideIn key={service.id} direction="up" delay={index * 100}>
                  <ServiceCard
                    service={service}
                    index={index}
                    onOpenModal={handleOpenModal}
                  />
                </SlideIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {localSearchTerm || selectedCategory !== "Tous" || selectedMetier !== "Tous" || priceRange.min || priceRange.max 
                  ? "Aucun service ne correspond à vos critères" 
                  : "Aucun service maison disponible"}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {localSearchTerm || selectedCategory !== "Tous" || selectedMetier !== "Tous" || priceRange.min || priceRange.max 
                  ? "Essayez de modifier vos filtres ou votre recherche" 
                  : "Les services seront bientôt disponibles"}
              </p>
              {(localSearchTerm || selectedCategory !== "Tous" || selectedMetier !== "Tous" || priceRange.min || priceRange.max) && (
                <button
                  onClick={() => {
                    setSelectedCategory("Tous");
                    setSelectedMetier("Tous");
                    setPriceRange({ min: null, max: null });
                    setLocalSearchTerm("");
                  }}
                  className="mt-4 bg-logo hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section avantages */}
        <SlideIn direction="up" delay={300}>
          <div className="mt-12 pt-8 border-t border-separator">
            <h3 className="text-xl font-bold mb-6 text-logo">Nos engagements qualité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-logo/10">
                    <Users className="w-6 h-6 text-logo" />
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">Professionnels Formés</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Tous nos intervenants sont rigoureusement sélectionnés, formés et assurés pour un service irréprochable.
                </p>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-logo/10">
                    <CheckCircle className="w-6 h-6 text-logo" />
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">Satisfaction Garantie</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Nous garantissons la qualité de nos services. Insatisfait ? Nous réintervenons gratuitement.
                </p>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-logo/10">
                    <Sprout className="w-6 h-6 text-logo" />
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">Écologie Respectée</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Nous privilégions les produits écologiques et les méthodes respectueuses de l'environnement.
                </p>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-logo/10">
                    <Shield className="w-6 h-6 text-logo" />
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">Sécurité Totale</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Tous nos intervenants sont vérifiés et nos systèmes de sécurité sont aux normes les plus strictes.
                </p>
              </div>
            </div>
          </div>
        </SlideIn>

        {/* Abonnements */}
        {/* <SlideIn direction="up" delay={400}>
          <div className="mt-12 bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-2xl p-8 border border-logo/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-logo">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Formules Abonnement</h3>
                <p className="text-gray-600 dark:text-gray-400">Économisez avec nos forfaits mensuels</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
                <div className="font-bold text-lg mb-2">Forfait Ménage</div>
                <div className="text-2xl font-bold text-logo mb-2">150€<span className="text-sm text-gray-500">/mois</span></div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>2 nettoyages complets par mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>Produits fournis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>Même intervenant</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
                <div className="font-bold text-lg mb-2">Forfait Jardin</div>
                <div className="text-2xl font-bold text-logo mb-2">120€<span className="text-sm text-gray-500">/mois</span></div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>4 tontes par mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>Taille haies mensuelle</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>Évacuation déchets</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
                <div className="font-bold text-lg mb-2">Forfait Piscine</div>
                <div className="text-2xl font-bold text-logo mb-2">300€<span className="text-sm text-gray-500">/mois</span></div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>Entretien hebdomadaire</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>Produits chimiques inclus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      ✓
                    </div>
                    <span>Surveillance filtration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </SlideIn> */}
      </div>

      {/* Modal de demande de devis */}
      {showModal && selectedService && (
        <DemandeDevisModal
          isOpen={showModal}
          onClose={handleCloseModal}
          prestation={selectedService}
        />
      )}
    </>
  );
};

export default ServicesMaison;