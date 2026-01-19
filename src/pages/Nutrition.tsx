import React, { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Apple, Utensils, Scale, Heart, Clock, Star, Users, Award, CheckCircle, Leaf, Brain, Target, Zap, TrendingUp, Shield, GraduationCap, Calendar, Search, Filter, ChevronDown, Euro, X } from "lucide-react";
import { useBienEtreTracking } from '@/hooks/useBienEtreTracking';
import api from '@/lib/api';
import ReservationBienEtreModal from "@/components/ReservationBienEtreModal";

// Composant d'animation personnalisé
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

// Composant Statistique amélioré
const StatCard = ({ icon: Icon, value, label, description, color = "logo" }) => (
  <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-border hover:shadow-xl transition-all duration-300">
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl bg-${color}/10 flex-shrink-0`}>
        <Icon className={`w-8 h-8 text-${color}`} />
      </div>
      <div className="flex-1">
        <div className="text-3xl font-bold text-gray-800 dark:text-foreground">{value}</div>
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-1">{label}</div>
        <div className="text-sm text-gray-500 dark:text-muted-foreground mt-2">{description}</div>
      </div>
    </div>
  </div>
);

const AppointmentForm = ({ isOpen, onClose, service }) => {
  // Supprimez tout le contenu et remplacez par :
  return (
    <ReservationBienEtreModal
      isOpen={isOpen}
      onClose={onClose}
      service={service}
    />
  );
};

// Composant de carte de service nutrition amélioré
const NutritionCard = ({ service, index, onOpenModal }) => {
  const { trackBienEtreServiceClick } = useBienEtreTracking();

  const handleCardClick = () => {
    trackBienEtreServiceClick(service.id, service.libelle, service.category?.name || 'general');
    onOpenModal(service);
  };

  // Formater la durée
  const formatDuration = (minutes) => {
    if (!minutes) return "Sur mesure";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-border hover:border-primary-dark transform hover:-translate-y-1">

      <div className="relative h-56 overflow-hidden">
        <img
          src={service.images?.[0] || "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
          alt={service.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-logo text-white px-4 py-2 rounded-full shadow-lg font-bold text-lg">
            {service.price ? `${service.price}€` : "Sur devis"}
          </div>
          {service.popular && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Populaire
            </div>
          )}
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-primary-dark text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {service.durationFormatted || formatDuration(service.duration)}
          </div>
          {service.nutritionist?.rating && (
            <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {service.nutritionist.rating}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
          {service.libelle}
        </h3>

        {service.nutritionist && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-logo/10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-logo" />
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-foreground">{service.nutritionist.name}</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">
                {service.nutritionist.specialty || "Nutritionniste"}
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
          {service.description}
        </p>

        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {service.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs bg-logo/10 text-logo px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {service.features && service.features.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Comprend :</p>
            <div className="space-y-1">
              {service.features.slice(0, 2).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-logo flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleCardClick}
          className="w-full bg-logo hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 mt-4 group/btn"
        >
          <Calendar className="w-5 h-5" />
          <span>Prendre rendez-vous</span>
          <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Nutrition = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 1250,
    successRate: 92,
    avgWeightLoss: "4.2kg",
    satisfactionRate: 97,
    avgRating: 4.8,
    consultationsPerMonth: 156
  });

  // États pour les filtres avancés
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('pertinence');
  const [durationFilter, setDurationFilter] = useState('all');

  const { trackBienEtreTabChange, trackBienEtreSearch } = useBienEtreTracking();

  useEffect(() => {
    if (activeTab) {
      trackBienEtreTabChange(activeTab);
    }
  }, [activeTab]);

  // Récupérer les services depuis l'API avec débogage amélioré
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      // console.log('📡 [Nutrition] Début récupération services');
      
      // Test d'abord la route simple
      try {
        // console.log('🧪 Test route /test');
        const testResponse = await api.get('/nutrition-bienetre/test');
        // console.log('✅ Route test OK:', testResponse.data);
      } catch (testError) {
        console.warn('⚠️ Route test échouée, continuons...', testError.message);
      }

      // Ensuite la route principale avec filtres
      const params = {
        search: searchTerm,
        category: activeTab !== 'Tous' ? activeTab : undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        sortBy: sortBy,
        limit: 20
      };

    
      const response = await api.get('/nutrition-bienetre', { params });
      
   
      
      if (response.data.success) {
        setServices(response.data.services);
        // console.log(`✅ ${response.data.services.length} services chargés`);
      } else {
        console.error('❌ Erreur API:', response.data.message);
        // Fallback aux données simulées
        // console.log('🔄 Fallback aux données simulées');
        setServices(getSimulatedServices().filter(service => 
          activeTab === 'Tous' || 
          (service.category && service.category.name === activeTab)
        ));
      }
      
    } catch (error) {
      console.error('❌ Erreur récupération services:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // Fallback aux données simulées
     
      setServices(getSimulatedServices().filter(service => 
        activeTab === 'Tous' || 
        (service.category && service.category.name === activeTab)
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
 
      const response = await api.get('/nutrition-bienetre/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
     
      } else {
        console.warn('⚠️ Erreur chargement catégories, utilisation par défaut');
        setCategories(['Tous', 'Consultation', 'Programme', 'Suivi', 'Atelier']);
      }
    } catch (error) {
      console.error('❌ Erreur récupération catégories:', error.message);
      setCategories(['Tous', 'Consultation', 'Programme', 'Suivi', 'Atelier']);
    }
  };

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
     
      const response = await api.get('/nutrition-bienetre/stats');
      if (response.data.success) {
        setStats(prev => ({
          ...prev,
          totalServices: response.data.stats.totalServices,
          avgPrice: response.data.stats.avgPrice,
          // Garder les autres stats du backend si disponibles
          totalClients: response.data.stats.totalClients || prev.totalClients,
          successRate: response.data.stats.successRate || prev.successRate,
          avgWeightLoss: response.data.stats.avgWeightLoss || prev.avgWeightLoss,
          satisfactionRate: response.data.stats.satisfactionRate || prev.satisfactionRate,
          avgRating: response.data.stats.avgRating || prev.avgRating,
          consultationsPerMonth: response.data.stats.consultationsPerMonth || prev.consultationsPerMonth
        }));
        
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques:', error.message);
    }
  };

  useEffect(() => {
    // console.log('🔄 Nutrition component mounted, chargement initial...');
    fetchServices();
    fetchCategories();
    fetchStats();
  }, []);

  useEffect(() => {
    // console.log('🔄 Déclenchement rechargement services:', { activeTab, searchTerm, priceRange, sortBy });
    fetchServices();
  }, [activeTab, searchTerm, priceRange, sortBy]);

  const handleOpenModal = (service) => {
    // console.log('📋 Ouverture modal pour service:', service.libelle);
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
   
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    trackBienEtreSearch(value);
  };

  const handleClearFilters = () => {
    console.log('🗑️ Réinitialisation des filtres');
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSortBy('pertinence');
    setDurationFilter('all');
    setActiveTab('Tous');
  };

  const filteredServices = services.filter(service => {
    // Filtre par durée si spécifié
    if (durationFilter !== 'all') {
      if (durationFilter === 'short' && (!service.duration || service.duration > 60)) {
        return false;
      }
      if (durationFilter === 'medium' && (!service.duration || service.duration < 60 || service.duration > 120)) {
        return false;
      }
      if (durationFilter === 'long' && (!service.duration || service.duration < 120)) {
        return false;
      }
    }

    return (
      service.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.nutritionist?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  // Trier les services selon le critère sélectionné
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch(sortBy) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'name-az':
        return a.libelle.localeCompare(b.libelle);
      case 'duration':
        return (a.duration || 0) - (b.duration || 0);
      case 'popular':
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      default:
        return 0; // pertinence
    }
  });

  // Tabs dynamiques basées sur les catégories
  const tabs = categories.map(category => ({
    id: category,
    label: category === 'Tous' ? 'Tous les services' : category,
    icon: category === 'Tous' ? <Apple className="w-5 h-5" /> : 
           category === 'Consultation' ? <Utensils className="w-5 h-5" /> :
           category === 'Programme' ? <Scale className="w-5 h-5" /> :
           <Heart className="w-5 h-5" />,
    description: category === 'Tous' ? 'Tous nos services' : 
                 `Services de ${category.toLowerCase()}`
  }));

  const statCards = [
    {
      icon: Users,
      value: stats.totalClients.toLocaleString(),
      label: "Clients accompagnés",
      description: "Depuis notre création",
      color: "logo"
    },
    {
      icon: TrendingUp,
      value: stats.successRate + "%",
      label: "Taux de réussite",
      description: "Objectifs atteints",
      color: "primary-dark"
    },
    {
      icon: Target,
      value: stats.avgWeightLoss,
      label: "Perte de poids moyenne",
      description: "En 3 mois",
      color: "logo"
    },
    {
      icon: Star,
      value: stats.avgRating,
      label: "Satisfaction moyenne",
      description: "Basé sur 500+ avis",
      color: "primary-dark"
    }
  ];

  // Options de tri
  const sortOptions = [
    { value: 'pertinence', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-az', label: 'Nom A-Z' },
    { value: 'duration', label: 'Durée' },
    { value: 'popular', label: 'Populaire' }
  ];

  // Options de durée
  const durationOptions = [
    { value: 'all', label: 'Toutes durées' },
    { value: 'short', label: '≤ 1h' },
    { value: 'medium', label: '1h-2h' },
    { value: 'long', label: '≥ 2h' }
  ];

  return (
    <div className="font-sans text-foreground">
      {/* STATISTIQUES 
      <SlideIn direction="up">
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <div key={index} className="transform hover:-translate-y-2 transition-transform duration-300">
                <StatCard {...stat} />
              </div>
            ))}
          </div>
        </div>*/}

      {/* BARRE DE RECHERCHE ET FILTRES AMÉLIORÉE */}
      <SlideIn direction="down">
        <LayoutGroup>
          <div className="bg-white dark:bg-card rounded-3xl shadow-lg px-4 py-6 mb-8 w-full mx-auto border border-gray-200 dark:border-gray-700/40">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="lg:w-1/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un service nutrition..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-6 py-4 pl-12 border border-gray-200 rounded-2xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="lg:w-2/3 flex flex-col gap-4">
                {/* Boutons de filtre et tri */}
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filtres avancés
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Trier par:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-logo focus:border-logo"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filtres avancés */}
                {showFilters && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prix (€)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Durée
                        </label>
                        <select
                          value={durationFilter}
                          onChange={(e) => setDurationFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                        >
                          {durationOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end gap-2">
                        <button
                          onClick={handleClearFilters}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
            </div>

            {/* Onglets de catégories */}
            <div className="md:flex  hidden flex-wrap gap-2 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex flex-col items-center px-4 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden min-w-[120px] ${activeTab === tab.id
                      ? 'bg-logo text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60'
                    }`}
                >
                  <motion.span
                    animate={{
                      scale: activeTab === tab.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`relative z-10 ${activeTab === tab.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    {tab.icon}
                  </motion.span>

                  <motion.span
                    animate={{
                      y: activeTab === tab.id ? 2 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-bold relative z-10 mt-1"
                  >
                    {tab.label}
                  </motion.span>
                  
                  <span className="text-xs opacity-75 mt-1">{tab.description}</span>
                </button>
              ))}
            </div>
          </div>
        </LayoutGroup>
      </SlideIn>

      {/* CONTENU DES TABS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 md:p-12 min-h-[500px] border border-gray-200 dark:border-gray-700/40"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo mb-4"></div>
              <div className="text-gray-600 dark:text-muted-foreground">Chargement des services nutrition...</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {services.length === 0 ? 'Aucun service trouvé' : `${services.length} services disponibles`}
              </div>
            </div>
          ) : (
            <>
              {/* En-tête avec compteur */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
                    Nos Services Nutrition
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''} disponible{sortedServices.length !== 1 ? 's' : ''}
                    {searchTerm && ` pour "${searchTerm}"`}
                  </p>
                </div>
                
                {(searchTerm || priceRange.min || priceRange.max || durationFilter !== 'all' || sortBy !== 'pertinence') && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Effacer les filtres
                  </button>
                )}
              </div>

              {/* Liste des services */}
              <div className="mb-12">
                {sortedServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {sortedServices.map((service, index) => (
                      <SlideIn key={service.id || index} direction="up" delay={index * 100}>
                        <NutritionCard
                          service={service}
                          index={index}
                          onOpenModal={handleOpenModal}
                        />
                      </SlideIn>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                    <Apple className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {searchTerm ? 'Aucun service ne correspond à votre recherche' : 'Aucun service disponible'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {searchTerm 
                        ? "Essayez de modifier vos critères de recherche ou vos filtres." 
                        : "Les services de nutrition seront bientôt disponibles."}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-4 bg-logo hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Voir tous les services
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination (si nécessaire) */}
              {sortedServices.length > 0 && sortedServices.length >= 20 && (
                <div className="flex justify-center mt-8">
                  <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Charger plus de services
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* POURQUOI NOUS CHOISIR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700/40">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Notre approche</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Brain className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Approche personnalisée</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Chaque programme est adapté à vos besoins spécifiques, objectifs et mode de vie.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Leaf className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Alimentation durable</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Nous privilégions les habitudes alimentaires saines et durables plutôt que les régimes restrictifs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Shield className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Suivi scientifique</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Notre approche est basée sur les dernières recherches scientifiques en nutrition.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700/40">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Nos engagements</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Consultation initiale approfondie</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Plan nutritionnel personnalisé</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Suivi régulier inclus</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Support entre consultations</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Ressources éducatives</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION ABONNEMENTS */}
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
              <div className="font-bold text-lg mb-2">Forfait Découverte</div>
              <div className="text-2xl font-bold text-logo mb-2">75€<span className="text-sm text-gray-500">/mois</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>1 consultation par mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Plan nutritionnel personnalisé</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Suivi par email</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Populaire
              </div>
              <div className="font-bold text-lg mb-2">Forfait Équilibre</div>
              <div className="text-2xl font-bold text-logo mb-2">120€<span className="text-sm text-gray-500">/mois</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>2 consultations par mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Plan nutritionnel évolutif</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Suivi hebdomadaire</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Forfait Premium</div>
              <div className="text-2xl font-bold text-logo mb-2">200€<span className="text-sm text-gray-500">/mois</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Consultations illimitées</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Plan complet avec recettes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Support quotidien</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SlideIn> */}

      {/* MODAL */}
      <AppointmentForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
};

// Fonction de fallback pour les données simulées
function getSimulatedServices() {
  console.log('🔄 Chargement des données simulées');
  return [
    {
      id: 1,
      libelle: "Consultation Nutrition Initiale",
      description: "Bilan complet de vos habitudes alimentaires, analyse corporelle et définition d'un plan nutritionnel personnalisé.",
      price: 90,
      duration: 90,
      durationFormatted: "1h30",
      images: ["https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      category: { name: "Consultation" },
      benefits: "Plan personnalisé, objectifs clairs, suivi adapté",
      nutritionist: {
        name: "Dr. Sophie Martin",
        specialty: "Diététicienne-nutritionniste",
        experience: "10 ans d'expérience",
        rating: 4.9,
        reviews: 287,
        languages: ["Français", "Anglais"],
        availability: "Lun-Ven, 8h-19h",
        certifications: ["Diplôme d'État", "Spécialisation sportive"]
      },
      features: [
        "Analyse corporelle complète",
        "Évaluation des habitudes alimentaires",
        "Plan nutritionnel sur mesure",
        "Suivi à 1 mois inclus"
      ],
      tags: ["Complet", "Personnalisé", "Suivi inclus"],
      popular: true
    },
    {
      id: 2,
      libelle: "Suivi Nutritionnel Mensuel",
      description: "Séance de suivi pour ajuster votre programme, répondre à vos questions et maintenir votre motivation.",
      price: 60,
      duration: 45,
      durationFormatted: "45min",
      images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      category: { name: "Suivi" },
      benefits: "Ajustements, motivation, résultats durables",
      nutritionist: {
        name: "Thomas Leroy",
        specialty: "Coach nutritionnel",
        experience: "6 ans d'expérience",
        rating: 4.8,
        reviews: 154,
        languages: ["Français"],
        availability: "Mar-Sam, 9h-20h",
        certifications: ["Certification internationale"]
      },
      features: [
        "Réévaluation des objectifs",
        "Ajustement du plan alimentaire",
        "Stratégies de motivation",
        "Conseils pratiques"
      ],
      tags: ["Suivi", "Motivation", "Adaptatif"],
      popular: true
    },
    {
      id: 3,
      libelle: "Programme Perte de Poids (3 mois)",
      description: "Accompagnement complet sur 3 mois avec plan alimentaire, recettes et suivi régulier pour atteindre vos objectifs.",
      price: 350,
      duration: null,
      durationFormatted: "3 mois",
      images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      category: { name: "Programme" },
      benefits: "Perte de poids saine, éducation alimentaire, changement durable",
      nutritionist: {
        name: "Marie Dubois",
        specialty: "Spécialiste perte de poids",
        experience: "8 ans d'expérience",
        rating: 4.9,
        reviews: 203,
        languages: ["Français", "Espagnol"],
        availability: "Lun-Sam, 8h-18h",
        certifications: ["Master Nutrition", "Spécialisation obésité"]
      },
      features: [
        "Programme progressif sur 12 semaines",
        "Plan alimentaire évolutif",
        "Suivi hebdomadaire",
        "Ateliers éducatifs inclus"
      ],
      tags: ["Complet", "Long terme", "Éducatif"],
      popular: true
    }
  ];
}

export default Nutrition;