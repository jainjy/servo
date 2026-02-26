import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronDown,
  Search,
  X,
  Home,
  Send,
  Star,
  FileText,
  Loader2,
  Building,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

// Types TypeScript
interface Metier {
  id?: string;
  name?: string;
  libelle?: string;
}

interface ServiceType {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number | string;
  duration?: number;
  rating?: number;
  images?: string[];
  metiers?: Metier[];
  type?: string;
}

interface PropertyType {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface ServiceCategory {
  value: string;
  label: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ServicesPageProps {
  filters?: any;
  setFilters?: (filters: any) => void;
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
}

const ServicesPage = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
}: ServicesPageProps) => {
  // États principaux
  const [showStatuses, setShowStatuses] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  // États de recherche et filtres
  const [servicesSearchQuery, setServicesSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");

  // États d'interface
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownResults, setDropdownResults] = useState<ServiceType[]>([]);

  // États modaux
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceType | null>(
    null
  );
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // États pour la pagination backend
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Types de propriétés
  const propertyTypes: PropertyType[] = [
    { value: "maison", label: "Maison/Villa", icon: Home },
    { value: "appartement", label: "Appartement", icon: Building },
    { value: "terrain", label: "Terrain", icon: Home },
    { value: "hotel", label: "Hôtel/Gîte", icon: Building },
  ];

  // Catégories extraites des services réels
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    [{ value: "", label: "Toutes les catégories" }]
  );

  // Récupérer les services depuis l'API avec pagination
  const fetchServices = async (
    page: number = 1,
    limit: number = 10,
    filters?: any
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Construire les paramètres de requête
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Ajouter les filtres s'ils existent
      if (servicesSearchQuery) {
        params.append("search", servicesSearchQuery);
      }
      if (propertyType) {
        params.append("propertyType", propertyType);
      }
      if (serviceCategory) {
        params.append("category", serviceCategory);
      }

      const response = await api.get(`/services?${params.toString()}`);

      if (response.status === 200) {
        const data = response.data;

        // Vérifier si la réponse contient la structure de pagination
        if (data.success && data.data && data.pagination) {
          // Structure avec pagination
          const parsedServices = data.data.map((service: any) => ({
            id: service.id,
            name: service.name || service.libelle || "",
            description: service.description || "",
            category: service.category || service.category?.name || "",
            price: service.price || 0,
            duration: service.duration || 0,
            images: service.images || [],
            metiers: service.metiers || [],
            rating: service.rating || 0,
          }));

          setServices(parsedServices);
          setPagination(data.pagination);

          // Extraire les catégories uniques des services
          const uniqueCategories = [
            ...new Set(
              parsedServices.map((service) => service.category).filter(Boolean)
            ),
          ].map((category) => ({
            value: category as string,
            label:
              (category as string).charAt(0).toUpperCase() +
              (category as string).slice(1).toLowerCase(),
          }));

          setServiceCategories((prev) => [
            { value: "", label: "Toutes les catégories" },
            ...uniqueCategories,
          ]);
        } else if (Array.isArray(data)) {
          // Structure simple (array) - fallback à l'ancienne pagination frontend
          const parsedServices = data.map((service: any) => ({
            id: service.id,
            name: service.name || service.libelle || "",
            description: service.description || "",
            category: service.category || service.category?.name || "",
            price: service.price || 0,
            duration: service.duration || 0,
            images: service.images || [],
            metiers: service.metiers || [],
            rating: service.rating || 0,
          }));

          setServices(parsedServices);

          // Calculer la pagination frontend
          setPagination({
            page: 1,
            limit: limit,
            total: parsedServices.length,
            totalPages: Math.ceil(parsedServices.length / limit),
          });

          // Extraire les catégories uniques
          const uniqueCategories = [
            ...new Set(
              parsedServices.map((service) => service.category).filter(Boolean)
            ),
          ].map((category) => ({
            value: category as string,
            label:
              (category as string).charAt(0).toUpperCase() +
              (category as string).slice(1).toLowerCase(),
          }));

          setServiceCategories((prev) => [
            { value: "", label: "Toutes les catégories" },
            ...uniqueCategories,
          ]);
        } else {
          throw new Error("Format de réponse inattendu");
        }
      } else {
        throw new Error(`Statut de réponse: ${response.status}`);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Erreur lors du chargement des services:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les services au démarrage
  useEffect(() => {
    fetchServices();
  }, []);

  // Recharger les services quand les filtres changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServices(1, pagination.limit);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [servicesSearchQuery, propertyType, serviceCategory]);

  // Gestionnaires d'événements
  const handleResetFilters = () => {
    setServicesSearchQuery("");
    setPropertyType("");
    setServiceCategory("");
    fetchServices(1, pagination.limit);
  };

  const handlePageChange = (page: number) => {
    fetchServices(page, pagination.limit);
  };

  const handleLimitChange = (limit: number) => {
    fetchServices(1, limit);
  };

  const handleSendMessage = () => {
    if (!email || !message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setShowMessageCard(false);
    setEmail("");
    setMessage("");
    toast.success("Message envoyé avec succès!");
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackText: string
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/300x200/#D3D3D3/#556B2F?text=${encodeURIComponent(
      fallbackText
    )}`;
  };

  const handleDevisClick = (service: ServiceType) => {
    if (!isLoggedIn) {
      toast.info("Vous devez être connecté pour demander un devis !");
      return;
    }

    setCurrentService(service);
    setIsDevisModalOpen(true);
  };

  const handleDevisSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      // Récupérer les valeurs du formulaire
      const budget = data.budget as string;
      const dateSouhaitee = data.dateSouhaitee as string;
      const codePostal = data.codePostal as string;
      const ville = data.ville as string;

      // Construire le champ devis avec les informations spécifiques
      const devisInfos = `Budget: ${budget}${dateSouhaitee ? `, Date souhaitée: ${dateSouhaitee}` : ""
        }`;

      const demandeData = {
        contactNom: data.nom as string,
        contactPrenom: data.prenom as string,
        contactEmail: data.email as string,
        contactTel: data.telephone as string,
        lieuAdresse: data.adresse as string,
        lieuAdresseCp: codePostal || "",
        lieuAdresseVille: ville || "",
        description: (data.message as string) || `Demande de devis pour: ${currentService?.name}`,
        devis: devisInfos,
        serviceId: currentService?.id,
        serviceName: currentService?.name,
        nombreArtisans: "UNIQUE",
        createdById: user?.id,
        dateSouhaitee: dateSouhaitee || undefined,
      };

      console.log("📤 Envoi de la demande de devis:", demandeData);

      // Utiliser la route correcte
      const response = await api.post("/demandes/devis", demandeData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Votre demande de devis a été créée avec succès !");
        setIsDevisModalOpen(false);
        setCurrentService(null);
      } else {
        throw new Error(`Statut inattendu: ${response.status}`);
      }
    } catch (error: any) {
      console.error("❌ Erreur détaillée:", error);

      // Afficher un message d'erreur plus détaillé
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la création de la demande de devis";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Composant de pagination
  const PaginationComponent = () => {
    if (pagination.totalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
        {/* Info sur les résultats */}
        <div className="text-sm text-gray-600">
          Affichage de {Math.min(pagination.limit, services.length)} sur{" "}
          {pagination.total} services
        </div>

        {/* Sélecteur d'items par page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Afficher :</span>
          <select
            value={pagination.limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Contrôles de pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Numéros de page */}
          <div className="flex items-center gap-1">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${pagination.page === pageNum
                      ? "bg-[#556B2F] text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            {pagination.totalPages > 5 &&
              pagination.page < pagination.totalPages - 2 && (
                <>
                  <span className="mx-1">...</span>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Composant de section des services
  const ServicesSection = () => {
    const hasActiveFilters =
      servicesSearchQuery || propertyType || serviceCategory;

    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F]"></div>
            <span className="text-[#556B2F]">Chargement des services...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-[#556B2F]/10 rounded-lg mx-4">
          <div className="text-[#556B2F] text-lg mb-4">
            Erreur lors du chargement des services
          </div>
          <button
            onClick={() => fetchServices()}
            className="bg-[#556B2F] text-white px-6 py-3 rounded-lg hover:bg-[#6B8E23] transition-colors font-medium"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Résultats */}
        {services.length === 0 ? (
          <div className="text-center py-16 animate-fade-in bg-[#FFFFF0] rounded-2xl mx-4">
            <div className="text-[#556B2F] mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 text-lg mb-4">
              Aucun service trouvé avec ces critères.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="bg-[#556B2F] text-white px-6 py-3 rounded-lg hover:bg-[#6B8E23] transition-colors font-medium"
              >
                Tous les services
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Compteur de résultats */}
            <div className="flex justify-between items-center mb-6 px-4">
              <p className="text-white bg-[#556B2F] py-1 px-5 rounded-full text-xs font-bold">
                {pagination.total} service{pagination.total > 1 ? "s" : ""} au
                total
              </p>
            </div>

            {/* Grille des services */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 animate-fade-in px-4">
              {services.map((service, index) => (
                <div
                  key={service.id || index}
                  className="bg-[#FFFFF0] rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-[#D3D3D3] group"
                >
                  {/* Image du service */}
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        service.images?.[0] ||
                        `https://via.placeholder.com/300x200/#D3D3D3/#556B2F?text=${encodeURIComponent(
                          service.name || "Service"
                        )}`
                      }
                      alt={service.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) =>
                        handleImageError(e, service.name || "Service")
                      }
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 bg-[#556B2F] text-white px-3 py-1 rounded-full text-xs font-medium">
                      {service.images?.length || 1} photo
                      {service.images?.length > 1 ? "s" : ""}
                    </div>

                    {/* Catégorie */}
                    {service.category && (
                      <div className="absolute top-3 right-3 bg-[#FFFFF0] bg-opacity-90 text-[#556B2F] px-3 py-1 rounded-full text-xs font-medium">
                        {service.category}
                      </div>
                    )}
                  </div>

                  {/* Contenu du service */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 leading-tight text-base">
                        {service.name || "Service sans nom"}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {service.description || "Description non disponible"}
                      </p>

                      {/* Métiers */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.metiers?.slice(0, 3).map((metier, idx) => (
                          <span
                            key={metier.id || idx}
                            className="inline-block px-2 py-1 bg-[#556B2F]/10 text-[#556B2F] rounded-full text-xs font-medium"
                          >
                            {metier.libelle || metier.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bouton devis */}
                    <div className="mt-4 pt-4 border-t border-[#D3D3D3]">
                      <Button
                        className="text-white font-medium bg-[#556B2F] rounded-lg text-xs hover:bg-[#6B8E23] transition-colors duration-200 flex-1"
                        onClick={() => handleDevisClick(service)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        DEVIS
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Pagination */}
            <PaginationComponent />
          </>
        )}
      </>
    );
  };

  return (
    <>
      {/* Barre de recherche et filtres */}
      <div className="mb-8 px-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={servicesSearchQuery}
                onChange={(e) => setServicesSearchQuery(e.target.value)}
                placeholder="Rechercher un service..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] outline-none"
              />
              {servicesSearchQuery && (
                <button
                  onClick={() => setServicesSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtre type de propriété */}
          <div className="relative filter-dropdown">
            <button
              onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 w-full md:w-auto"
            >
              <Filter className="w-4 h-4" />
              {propertyType ? (
                <span className="flex items-center gap-2">
                  {propertyTypes.find((t) => t.value === propertyType)?.label}
                </span>
              ) : (
                <span>Type de bien</span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showPropertyDropdown ? "rotate-180" : ""
                  }`}
              />
            </button>

            {showPropertyDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setPropertyType(
                        type.value === propertyType ? "" : type.value
                      );
                      setShowPropertyDropdown(false);
                    }}
                    className={`flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-50 ${propertyType === type.value
                      ? "bg-[#556B2F]/10 text-[#556B2F]"
                      : ""
                      }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filtre catégorie */}
          <div className="relative category-dropdown">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 w-full md:w-auto"
            >
              <Filter className="w-4 h-4" />
              {serviceCategory ? (
                <span>
                  {
                    serviceCategories.find((c) => c.value === serviceCategory)
                      ?.label
                  }
                </span>
              ) : (
                <span>Catégorie</span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""
                  }`}
              />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {serviceCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      setServiceCategory(
                        category.value === serviceCategory ? "" : category.value
                      );
                      setShowCategoryDropdown(false);
                    }}
                    className={`flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-50 ${serviceCategory === category.value
                      ? "bg-[#556B2F]/10 text-[#556B2F]"
                      : ""
                      }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton réinitialiser */}
          {(servicesSearchQuery || propertyType || serviceCategory) && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 w-full md:w-auto"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Section principale des services */}
      <ServicesSection />

      {/* Modal de devis (inchangé) */}
      {/* Modal de devis */}
      {isDevisModalOpen && (
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
                    {currentService?.name}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date souhaitée
                  </label>
                  <input
                    name="dateSouhaitee"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-[#D3D3D3] p-3 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget estimé
                  </label>
                  <select
                    name="budget"
                    required
                    className="w-full border border-[#D3D3D3] p-3 rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F] bg-white"
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionnez un budget</option>
                    <option value="0-5000">0 - 5 000 €</option>
                    <option value="5000-15000">5 000 - 15 000 €</option>
                    <option value="15000-30000">15 000 - 30 000 €</option>
                    <option value="30000+">30 000 € et plus</option>
                  </select>
                </div>
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
                <p className="text-[#556B2F] text-sm">{currentService?.name}</p>
                {currentService?.description && (
                  <p className="text-[#556B2F]/80 text-xs mt-1">
                    {currentService?.description}
                  </p>
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

export default ServicesPage;
