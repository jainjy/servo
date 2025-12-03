// pages/DigitalisationPartenaires.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building,
  Star,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  Users,
  CheckCircle,
  Award,
  TrendingUp,
  Shield,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

const DigitalisationPartenaires = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    rating: "all",
    experience: "all",
    location: "",
    services: [],
  });

  // Services de digitalisation disponibles
  const digitalisationServices = [
    "Site E-commerce",
    "Site Vitrine",
    "App Mobile",
    "Solutions Cloud",
    "Marketing Digital",
    "Transformation Digitale",
    "Design UI/UX",
    "Consulting Digital",
    "Maintenance & Support",
  ];

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [searchTerm, filters, professionals]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/digitalisation-services/professionals");

      if (response.data.success) {
        // Enrichir les données avec expérience (basée sur la date de création)
        const enrichedData = response.data.data.map((pro) => {
          const createdDate = new Date(pro.createdAt);
          const now = new Date();
          const yearsOfExperience =
            Math.floor((now - createdDate) / (1000 * 60 * 60 * 24 * 365)) || 1;

          return {
            ...pro,
            experienceYears: yearsOfExperience,
            satisfactionRate: pro.averageRating >= 4 ? 95 : 80,
            mainExpertise: pro.servicesCrees[0]?.libelle || "Digitalisation",
            services: pro.servicesCrees,
          };
        });

        setProfessionals(enrichedData);
        setFilteredProfessionals(enrichedData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des professionnels:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfessionals = () => {
    let filtered = [...professionals];

    // Recherche par nom, entreprise ou localisation
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pro) =>
          pro.companyName?.toLowerCase().includes(term) ||
          pro.firstName?.toLowerCase().includes(term) ||
          pro.lastName?.toLowerCase().includes(term) ||
          pro.city?.toLowerCase().includes(term) ||
          pro.services?.some((service) =>
            service.libelle.toLowerCase().includes(term)
          )
      );
    }

    // Filtre par note
    if (filters.rating !== "all") {
      const minRating = parseInt(filters.rating);
      filtered = filtered.filter((pro) => pro.averageRating >= minRating);
    }

    // Filtre par expérience
    if (filters.experience !== "all") {
      const minYears = parseInt(filters.experience);
      filtered = filtered.filter((pro) => pro.experienceYears >= minYears);
    }

    // Filtre par localisation
    if (filters.location) {
      filtered = filtered.filter((pro) =>
        pro.city?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filtre par services
    if (filters.services.length > 0) {
      filtered = filtered.filter((pro) =>
        filters.services.every((serviceName) =>
          pro.services?.some((service) =>
            service.libelle.toLowerCase().includes(serviceName.toLowerCase())
          )
        )
      );
    }

    setFilteredProfessionals(filtered);
  };

  const handleServiceFilter = (serviceName) => {
    setFilters((prev) => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName],
    }));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600 bg-green-50";
    if (rating >= 4.0) return "text-blue-600 bg-blue-50";
    if (rating >= 3.5) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">
              Chargement des professionnels...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section Amélioré */}
      <div className="min-h-[75vh] bg-gray-50 pt-0">
        <div className="container mx-auto px-4 pt-4 pb-16">
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{
                  backgroundImage: 'url("/partenaire.jpg")',
                }}
              />
              {/* Layer dégradé */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-purple-900/40 to-indigo-900/50" />
            </div>

            {/* Contenu */}
            <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                Experts en Digitalisation
              </h1>

              <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
                Découvrez nos partenaires spécialisés pour transformer votre
                présence numérique
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="text"
                  placeholder="Rechercher un service, un professionnel..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-md 
                       border border-white/30 text-white placeholder-white/70 
                       focus:ring-2 focus:ring-white/50 shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              </div>
            </div>

            {/* Effets lumineux décoratifs */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-[80px] -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-purple-500/30 rounded-full blur-[100px] translate-x-20 translate-y-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  <Filter className="inline-block mr-2 h-5 w-5" />
                  Filtres
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      rating: "all",
                      experience: "all",
                      location: "",
                      services: [],
                    });
                  }}
                >
                  Réinitialiser
                </Button>
              </div>

              {/* Filtre par note */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Note minimum</h3>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0, "all"].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === String(rating)}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            rating: String(rating),
                          }))
                        }
                        className="text-blue-600"
                      />
                      <span className="text-sm">
                        {rating === "all"
                          ? "Toutes notes"
                          : `${rating}+ étoiles`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtre par expérience */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Expérience</h3>
                <div className="space-y-2">
                  <select
                    value={filters.experience}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">Tous niveaux</option>
                    <option value="3">3+ années</option>
                    <option value="5">5+ années</option>
                    <option value="8">8+ années</option>
                  </select>
                </div>
              </div>

              {/* Filtre par localisation */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Localisation</h3>
                <Input
                  type="text"
                  placeholder="Ville, région..."
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="text-sm"
                />
              </div>

              {/* Filtre par services */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Services</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {digitalisationServices.map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filters.services.includes(service)}
                        onChange={() => handleServiceFilter(service)}
                        className="text-blue-600"
                      />
                      <span className="text-sm flex-1">{service}</span>
                      <Badge variant="outline" className="text-xs">
                        {
                          professionals.filter((pro) =>
                            pro.services?.some((s) =>
                              s.libelle
                                .toLowerCase()
                                .includes(service.toLowerCase())
                            )
                          ).length
                        }
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Professionnels</span>
                    <span className="font-semibold">
                      {professionals.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Moyenne des notes</span>
                    <span className="font-semibold">
                      {professionals.length > 0
                        ? (
                            professionals.reduce(
                              (sum, pro) => sum + pro.averageRating,
                              0
                            ) / professionals.length
                          ).toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Projets réalisés</span>
                    <span className="font-semibold">
                      {professionals.reduce(
                        (sum, pro) => sum + pro.totalProjects,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professionals Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredProfessionals.length} professionnel
                  {filteredProfessionals.length > 1 ? "s" : ""} trouvé
                  {filteredProfessionals.length > 1 ? "s" : ""}
                </h2>
                <p className="text-gray-600 mt-1">
                  Experts vérifiés en solutions digitales
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Recommandés
                </Badge>
              </div>
            </div>

            {filteredProfessionals.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun professionnel trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      rating: "all",
                      experience: "all",
                      location: "",
                      services: [],
                    });
                  }}
                >
                  Voir tous les professionnels
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProfessionals.map((professional) => (
                  <div
                    key={professional.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    {/* Header */}
                    <div className="relative p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {professional.avatar ? (
                              <img
                                src={professional.avatar}
                                alt={
                                  professional.companyName ||
                                  `${professional.firstName} ${professional.lastName}`
                                }
                                className="h-16 w-16 rounded-full object-cover border-4 border-white shadow"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white shadow">
                                <Building className="h-8 w-8 text-white" />
                              </div>
                            )}
                            {professional.averageRating >= 4.5 && (
                              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Top
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                              {professional.companyName ||
                                `${professional.firstName} ${professional.lastName}`}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {professional.mainExpertise}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full ${getRatingColor(
                            professional.averageRating
                          )}`}
                        >
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-current mr-1" />
                            <span className="font-bold">
                              {professional.averageRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      {professional.city && (
                        <div className="flex items-center mt-4 text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{professional.city}</span>
                          {professional.zipCode && (
                            <span className="ml-1 text-xs text-gray-500">
                              ({professional.zipCode})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Services badges */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {professional.services?.slice(0, 4).map((service) => (
                          <Badge
                            key={service.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {service.libelle}
                          </Badge>
                        ))}
                        {professional.services?.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{professional.services.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {professional.experienceYears}
                        </div>
                        <div className="text-xs text-gray-600">Années</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {professional.totalProjects}
                        </div>
                        <div className="text-xs text-gray-600">Projets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {professional.satisfactionRate}%
                        </div>
                        <div className="text-xs text-gray-600">
                          Satisfaction
                        </div>
                      </div>
                    </div>

                    {/* Description & Features */}
                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                          <span className="text-sm">Projets sur-mesure</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Shield className="h-4 w-4 text-blue-500 mr-3" />
                          <span className="text-sm">Support premium</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-4 w-4 text-purple-500 mr-3" />
                          <span className="text-sm">Livraison rapide</span>
                        </div>
                      </div>

                      {/* Contact & Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {professional.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Appeler
                            </Button>
                          )}
                          {professional.websiteUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Globe className="h-3 w-3 mr-1" />
                              Site web
                            </Button>
                          )}
                        </div>
                        <Button
                          onClick={() =>
                            navigate(
                              `/digitalisation/professionnel/${professional.id}`
                            )
                          }
                          className="group-hover:bg-blue-600 transition-colors"
                        >
                          Voir les services
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalisationPartenaires;
