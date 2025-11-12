import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Search, X, Home, Send, Star, FileText, Loader2, Building, Filter } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; // Import du hook d'authentification

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

const ServicesPage = () => {
  // États principaux
  const [showStatuses, setShowStatuses] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Récupération de l'utilisateur connecté
  const isLoggedIn = Boolean(user); // Vérification de la connexion
  
  // États de recherche et filtres
  const [servicesSearchQuery, setServicesSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [displayCount, setDisplayCount] = useState(8);
  
  // États d'interface
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownResults, setDropdownResults] = useState<ServiceType[]>([]);
  
  // États modaux
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Types de propriétés
  const propertyTypes: PropertyType[] = [
    { value: "maison", label: "Maison/Villa", icon: Home },
    { value: "appartement", label: "Appartement", icon: Building },
    { value: "terrain", label: "Terrain", icon: Home },
    { value: "hotel", label: "Hôtel/Gîte", icon: Building }
  ];

  // Catégories extraites des services réels
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    { value: "", label: "Toutes les catégories" }
  ]);

  // Récupérer les services depuis l'API
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/services");
      
      if (response.status === 200) {
        const data = response.data;
        
        const parseApiData = (data: any): ServiceType[] => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (data.services && Array.isArray(data.services)) return data.services;
          if (data.data && Array.isArray(data.data)) return data.data;
          if (data.items && Array.isArray(data.items)) return data.items;
          if (data.results && Array.isArray(data.results)) return data.results;
          return [data];
        };

        const parsedServices = parseApiData(data);
        console.log('Services chargés:', parsedServices.length);
        setServices(parsedServices);

        // Extraire les catégories uniques des services
        const uniqueCategories = [...new Set(parsedServices
          .map(service => service.category)
          .filter(Boolean)
        )].map(category => ({
            value: category as string,
            label: (category as string).charAt(0).toUpperCase() + (category as string).slice(1).toLowerCase()
          }));
        
        setServiceCategories(prev => [
          { value: "", label: "Toutes les catégories" },
          ...uniqueCategories
        ]);
      } else {
        throw new Error(`Statut de réponse: ${response.status}`);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur lors du chargement des services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filtrage des résultats pour l'autocomplétion
  useEffect(() => {
    if (!servicesSearchQuery.trim()) {
      setDropdownResults([]);
      return;
    }

    const results = services
      .filter((service) =>
        service.name?.toLowerCase().includes(servicesSearchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(servicesSearchQuery.toLowerCase()) ||
        service.category?.toLowerCase().includes(servicesSearchQuery.toLowerCase())
      )
      .slice(0, 6);
    
    setDropdownResults(results);
  }, [servicesSearchQuery, services]);

  // Filtrage principal des services
  const getFilteredServices = useCallback(() => {
    let filtered = services;

    // Filtre par recherche texte
    if (servicesSearchQuery.trim()) {
      const query = servicesSearchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.category?.toLowerCase().includes(query) ||
        (service.metiers && service.metiers.some(metier => 
          metier.libelle?.toLowerCase().includes(query) || 
          metier.name?.toLowerCase().includes(query)
        ))
      );
    }

    // Filtre par type de propriété
    if (propertyType) {
      const typeToCategoryMap: Record<string, string[]> = {
        'maison': ['ESTIMATION', 'FINANCEMENT', 'ASSURANCE', 'CONSTRUCTION', 'RENOVATION', 'SECURITE', 'ENTRETIEN'],
        'appartement': ['ESTIMATION', 'FINANCEMENT', 'ASSURANCE', 'RENOVATION', 'SECURITE', 'ENTRETIEN'],
        'terrain': ['ESTIMATION', 'FINANCEMENT', 'JURIDIQUE', 'CONSTRUCTION'],
        'hotel': ['ESTIMATION', 'FINANCEMENT', 'ASSURANCE', 'JURIDIQUE', 'CONSTRUCTION', 'RENOVATION', 'ENTRETIEN']
      };
      
      filtered = filtered.filter(service => {
        const serviceCategory = service.category || service.type || 'OTHER';
        return typeToCategoryMap[propertyType]?.includes(serviceCategory);
      });
    }

    // Filtre par catégorie de service
    if (serviceCategory) {
      filtered = filtered.filter(service => 
        service.category === serviceCategory
      );
    }

    return filtered;
  }, [services, servicesSearchQuery, propertyType, serviceCategory]);

  // Gestionnaires d'événements
  const handleResetFilters = () => {
    setServicesSearchQuery("");
    setPropertyType("");
    setServiceCategory("");
    setDisplayCount(8);
  };

  const handleSendMessage = () => {
    if (!email || !message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    console.log("Email:", email);
    console.log("Message:", message);
    setShowMessageCard(false);
    setEmail('');
    setMessage('');
    toast.success("Message envoyé avec succès!");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText: string) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/300x200/E5E7EB/374151?text=${encodeURIComponent(fallbackText)}`;
  };

  const handleDevisClick = (service: ServiceType) => {
    if (!isLoggedIn) {
      toast.info("Vous devez être connecté pour demander un devis !");
      return; // ne pas ouvrir le modal
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

      const demandeData = {
        contactNom: data.nom as string,
        contactPrenom: data.prenom as string,
        contactEmail: data.email as string,
        contactTel: data.telephone as string,
        lieuAdresse: data.adresse as string,
        lieuAdresseCp: data.codePostal as string || "75000",
        lieuAdresseVille: data.ville as string || "Paris",
        optionAssurance: false,
        description: data.message as string || `Demande de devis pour: ${currentService?.name}`,
        devis: `Budget: ${data.budget}, Date souhaitée: ${data.dateSouhaitee}`,
        serviceId: currentService?.id,
        serviceName: currentService?.name,
        nombreArtisans: "UNIQUE",
        createdById: user?.id || "user-anonymous", // Utilisation de l'ID utilisateur
        status: "pending",
        type: "devis",
        source: "services-page"
      };

      const response = await api.post("/demandes/immobilier", demandeData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Votre demande a été créée avec succès !");
        setIsDevisModalOpen(false);
        setCurrentService(null);
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

  // Gestion du focus simplifiée
  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsFocused(false), 150);
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown') && 
          !target.closest('.category-dropdown')) {
        setShowPropertyDropdown(false);
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Composant de section des services
  const ServicesSection = () => {
    const filteredServices = getFilteredServices();
    const displayedServices = filteredServices.slice(0, displayCount);
    const hasActiveFilters = servicesSearchQuery || propertyType || serviceCategory;

    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-gray-600">Chargement des services...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-red-50 rounded-lg mx-4">
          <div className="text-red-500 text-lg mb-4">
            Erreur lors du chargement des services
          </div>
          <button
            onClick={fetchServices}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Barre de recherche et filtres */}
        <div className="mb-8 mt-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Recherche - Version améliorée */}
            <div className="relative flex items-center gap-2 w-full sm:max-w-sm md:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="RECHERCHER UN SERVICE..."
                  value={servicesSearchQuery}
                  onChange={(e) => setServicesSearchQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all search-input"
                  autoComplete="off"
                />
                {servicesSearchQuery && (
                  <button
                    onClick={() => setServicesSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Bouton effacer tous les filtres */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-600 hover:text-gray-800 transition-colors px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                  Effacer
                </button>
              )}
            </div>

            {/* Dropdown suggestions */}
            {isFocused && dropdownResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full sm:max-w-sm md:max-w-md bg-white border border-gray-200 rounded-xl shadow-lg z-50 dropdown-results">
                {dropdownResults.map((result, idx) => (
                  <button
                    key={result.id || idx}
                    onClick={() => {
                      setServicesSearchQuery(result.name);
                      setIsFocused(false);
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{result.name}</div>
                    {result.category && (
                      <div className="text-xs text-gray-500 mt-1">{result.category}</div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Filtre Catégorie de service */}
            <div className="relative category-dropdown">
              <button 
                className={`flex items-center gap-2 border rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                  serviceCategory 
                    ? "border-purple-500 bg-purple-50 text-purple-700" 
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowPropertyDropdown(false);
                }}
              >
                <Filter className="w-4 h-4" />
                {serviceCategory ? serviceCategories.find(c => c.value === serviceCategory)?.label : "Catégorie"}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-30 animate-slide-down max-h-60 overflow-y-auto">
                  {serviceCategories.map((category) => (
                    <button
                      key={category.value}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        serviceCategory === category.value ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                      } first:rounded-t-xl last:rounded-b-xl`}
                      onClick={() => {
                        setServiceCategory(category.value === serviceCategory ? "" : category.value);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Indicateurs de filtres actifs */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {propertyType && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  {propertyTypes.find(p => p.value === propertyType)?.label}
                  <button onClick={() => setPropertyType("")} className="hover:text-green-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {serviceCategory && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                  {serviceCategories.find(c => c.value === serviceCategory)?.label}
                  <button onClick={() => setServiceCategory("")} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Résultats */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 animate-fade-in bg-gray-50 rounded-2xl mx-4">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 text-lg mb-4">Aucun service trouvé avec ces critères.</p>
            {hasActiveFilters && (
              <button 
                onClick={handleResetFilters}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Tous les services
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Compteur de résultats */}
            <div className="flex justify-between items-center mb-6 px-4">
              <p className="text-gray-600 text-sm">
                {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
                {hasActiveFilters && " avec les filtres actuels"}
              </p>
            </div>

            {/* Grille des services */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 animate-fade-in px-4">
              {displayedServices.map((service, index) => (
                <div
                  key={service.id || index}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 group"
                >
                  {/* Image du service */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={service.images?.[0] || `https://via.placeholder.com/300x200/E5E7EB/374151?text=${encodeURIComponent(service.name || 'Service')}`} 
                      alt={service.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => handleImageError(e, service.name || 'Service')}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {service.images?.length || 1} photo{service.images?.length > 1 ? 's' : ''}
                    </div>
                    
                    {/* Catégorie */}
                    {service.category && (
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {service.category}
                      </div>
                    )}
                    
                    {service.rating && (
                      <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {service.rating}
                      </div>
                    )}
                  </div>

                  {/* Contenu du service */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 leading-tight text-base">
                        {service.name || 'Service sans nom'}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {service.description || 'Description non disponible'}
                      </p>
                      
                      {/* Métiers */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.metiers?.slice(0, 3).map((metier, idx) => (
                          <span 
                            key={metier.id || idx}
                            className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                          >
                            {metier.libelle || metier.name}
                          </span>
                        ))}
                      </div>
                      
                      {/* Prix et durée */}
                      <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                        {service.price && (
                          <span className="font-semibold text-green-600 text-base">
                            {typeof service.price === 'number' ? service.price.toLocaleString() : service.price} €
                          </span>
                        )}
                        {service.duration && (
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            ⏱ {service.duration}min
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Bouton devis */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                          className="text-white font-medium bg-slate-900 rounded-lg text-xs hover:bg-black transition-colors duration-200 flex-1"
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
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
        <button 
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          onClick={() => setShowMessageCard(true)}
        >
          <Send className="w-4 h-4" />
          Envoyer un message
        </button>
      </div>

      {/* Section principale des services */}
      {!showStatuses && <ServicesSection />}

      {/* Modal de devis */}
      {isDevisModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Demande de Devis
                  </h2>
                  <p className="text-gray-600 text-xs lg:text-sm">
                    {currentService?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDevisModalOpen(false)}
                className="h-8 w-8 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 flex items-center justify-center transition-colors"
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
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Prestation sélectionnée
                </h3>
                <p className="text-blue-800 text-sm">{currentService?.name}</p>
                {currentService?.description && (
                  <p className="text-blue-600 text-xs mt-1">{currentService?.description}</p>
                )}
              </div>

              <div className="grid lg:flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour envoyer un message */}
      {showMessageCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-smooth overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Envoyer un message</h3>
                <button 
                  onClick={() => setShowMessageCard(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Votre message..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setShowMessageCard(false)}
                >
                  Annuler
                </button>

                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesPage;