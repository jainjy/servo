// pages/Therapeute.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Video, Users, Heart, Clock, Star, CheckCircle, Award, Calendar, Search, Filter, ChevronDown, X, Sparkles, Zap, Shield, Brain, Target, TrendingUp } from "lucide-react";
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
      <div className={`p-3 rounded-xl bg-logo/10 flex-shrink-0`}>
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

// Composant de carte de service amélioré
const ServiceCard = ({ service, index, onOpenModal }) => {
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

  // Déterminer le type (thérapeute ou masseur)
  const serviceType = service.type || service.category?.name || 'Thérapeute';

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-border hover:border-primary-dark transform hover:-translate-y-1">

      <div className="relative h-56 overflow-hidden">
        <img
          src={service.images?.[0] || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
          alt={service.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-logo text-white px-4 py-2 rounded-full shadow-lg font-bold text-lg">
            {service.price ? `${service.price}€` : "Sur devis"}
          </div>
          {service.popular && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Populaire
            </div>
          )}
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-primary-dark text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {service.durationFormatted || formatDuration(service.duration)}
          </div>
          {service.therapist?.rating && (
            <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {service.therapist.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2 flex-1 min-h-[3.5rem]">
            {service.libelle}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
            serviceType === 'Masseur' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {serviceType}
          </span>
        </div>

        {service.therapist && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-logo/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-logo" />
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-foreground">{service.therapist.name}</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">
                {service.therapist.specialty || "Spécialiste bien-être"}
              </div>
              {service.therapist.experience && (
                <div className="text-xs text-gray-400 mt-1">
                  {service.therapist.experience}
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
          {service.description}
        </p>

        {service.benefits && (
          <div className="pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">Bénéfices :</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{service.benefits}</p>
          </div>
        )}

        {service.features && service.features.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Inclus :</p>
            <div className="space-y-1">
              {service.features.slice(0, 2).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Zap className="w-4 h-4 text-logo flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {service.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
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

const Therapeute = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalTherapists: 0,
    totalMasseurs: 0,
    totalSessions: 1250,
    satisfactionRate: 98,
    avgResponseTime: "2h",
    onlineTherapists: 12,
    certifiedMasseurs: 8
  });

  // États pour les filtres avancés
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('pertinence');
  const [durationFilter, setDurationFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  const { trackBienEtreTabChange, trackBienEtreSearch } = useBienEtreTracking();

  useEffect(() => {
    if (activeTab) {
      trackBienEtreTabChange(activeTab);
    }
  }, [activeTab]);

  // Récupérer les services depuis l'API
  const fetchServices = async () => {
    setIsLoading(true);
    try {
    
      // Test d'abord la route simple
      try {
      
        const testResponse = await api.get('/therapeutes-bienetre/test');
       
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

      
      
      const response = await api.get('/therapeutes-bienetre', { params });
      
 
      
      if (response.data.success) {
        setServices(response.data.services);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
       
      } else {
        console.error('❌ Erreur API:', response.data.message);
        // Fallback aux données simulées
        setServices(getSimulatedServices().filter(service => 
          activeTab === 'Tous' || 
          (service.category && service.category.name === activeTab)
        ));
      }
      
    } catch (error) {
      console.error('❌ Erreur récupération services thérapeutes:', {
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
    
      const response = await api.get('/therapeutes-bienetre/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
        // console.log('✅ Catégories thérapeutes chargées:', response.data.categories);
      } else {
        console.warn('⚠️ Erreur chargement catégories, utilisation par défaut');
        setCategories(['Tous', 'Thérapeute', 'Masseur', 'Psychologie', 'Massothérapie']);
      }
    } catch (error) {
      console.error('❌ Erreur récupération catégories thérapeutes:', error.message);
      setCategories(['Tous', 'Thérapeute', 'Masseur', 'Psychologie', 'Massothérapie']);
    }
  };

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      // console.log('📡 Récupération statistiques thérapeutes...');
      const response = await api.get('/therapeutes-bienetre/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        // console.log('✅ Statistiques thérapeutes mises à jour');
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques thérapeutes:', error.message);
    }
  };

  useEffect(() => {
    // console.log('🔄 Therapeute component mounted, chargement initial...');
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
    // console.log('❌ Fermeture modal');
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    trackBienEtreSearch(value);
  };

  const handleClearFilters = () => {
    // console.log('🗑️ Réinitialisation des filtres');
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSortBy('pertinence');
    setDurationFilter('all');
    setServiceTypeFilter('all');
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

    // Filtre par type de service
    if (serviceTypeFilter !== 'all') {
      const serviceType = service.type || service.category?.name;
      if (serviceTypeFilter === 'therapeute' && serviceType !== 'Thérapeute' && serviceType !== 'Psychologie') {
        return false;
      }
      if (serviceTypeFilter === 'masseur' && serviceType !== 'Masseur' && serviceType !== 'Massothérapie') {
        return false;
      }
    }

    return (
      service.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.therapist?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (service.category?.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
      case 'rating':
        return (b.therapist?.rating || 0) - (a.therapist?.rating || 0);
      default:
        return 0; // pertinence
    }
  });

  // Statistiques cards
  const statCards = [
    {
      icon: Users,
      value: stats.totalTherapists || 0,
      label: "Thérapeutes",
      description: "Spécialistes disponibles",
      color: "logo"
    },
    {
      icon: Heart,
      value: stats.totalMasseurs || 0,
      label: "Masseurs",
      description: "Professionnels certifiés",
      color: "primary-dark"
    },
    {
      icon: TrendingUp,
      value: stats.satisfactionRate ? `${stats.satisfactionRate}%` : "98%",
      label: "Satisfaction",
      description: "Taux de satisfaction client",
      color: "logo"
    },
    {
      icon: Clock,
      value: stats.avgResponseTime || "2h",
      label: "Réponse moyenne",
      description: "Temps de réponse",
      color: "primary-dark"
    }
  ];

  // Tabs dynamiques basées sur les catégories
  const tabs = categories.map(category => ({
    id: category,
    label: category === 'Tous' ? 'Tous les services' : category,
    icon: category === 'Tous' ? <Users className="w-5 h-5" /> : 
           category === 'Thérapeute' ? <Brain className="w-5 h-5" /> :
           category === 'Masseur' ? <Heart className="w-5 h-5" /> :
           category === 'Psychologie' ? <Target className="w-5 h-5" /> :
           <Award className="w-5 h-5" />,
    description: category === 'Tous' ? 'Tous nos services' : 
                 `Services de ${category.toLowerCase()}`
  }));

  // Options de tri
  const sortOptions = [
    { value: 'pertinence', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-az', label: 'Nom A-Z' },
    { value: 'duration', label: 'Durée' },
    { value: 'popular', label: 'Populaire' },
    { value: 'rating', label: 'Meilleures notes' }
  ];

  // Options de durée
  const durationOptions = [
    { value: 'all', label: 'Toutes durées' },
    { value: 'short', label: '≤ 1h' },
    { value: 'medium', label: '1h-2h' },
    { value: 'long', label: '≥ 2h' }
  ];

  // Options de type de service
  const serviceTypeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'therapeute', label: 'Thérapeutes uniquement' },
    { value: 'masseur', label: 'Masseurs uniquement' }
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
        </div>
      </SlideIn> */}

      {/* BARRE DE RECHERCHE ET FILTRES AMÉLIORÉE */}
      <SlideIn direction="down">
        <LayoutGroup>
          <div className="bg-white dark:bg-card rounded-3xl shadow-lg px-4 py-6 mb-8 w-full mx-auto border border-gray-200 dark:border-gray-700/40">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="lg:w-1/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un thérapeute, un massage..."
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type de service
                        </label>
                        <select
                          value={serviceTypeFilter}
                          onChange={(e) => setServiceTypeFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                        >
                          {serviceTypeOptions.map(option => (
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
            <div className=" md:flex flex-wrap gap-2 hidden  justify-center">
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
              <div className="text-gray-600 dark:text-muted-foreground">Chargement des services...</div>
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
                    {activeTab === 'Tous' ? 'Thérapeutes & Masseurs' : activeTab}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''} disponible{sortedServices.length !== 1 ? 's' : ''}
                    {searchTerm && ` pour "${searchTerm}"`}
                  </p>
                </div>
                
                {(searchTerm || priceRange.min || priceRange.max || durationFilter !== 'all' || serviceTypeFilter !== 'all' || sortBy !== 'pertinence') && (
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
                        <ServiceCard
                          service={service}
                          index={index}
                          onOpenModal={handleOpenModal}
                        />
                      </SlideIn>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {searchTerm ? 'Aucun service ne correspond à votre recherche' : 'Aucun service disponible'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {searchTerm 
                        ? "Essayez de modifier vos critères de recherche ou vos filtres." 
                        : "Les services seront bientôt disponibles."}
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
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Notre approche thérapeutique</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Brain className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Approches validées scientifiquement</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Nous utilisons des méthodes thérapeutiques dont l'efficacité est démontrée par la recherche.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Shield className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Confidentialité absolue</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Votre intimité est protégée selon les normes éthiques les plus strictes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Video className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Flexibilité horaire</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Séances en ligne disponibles 7j/7 selon vos disponibilités.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700/40">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Nos engagements qualité</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Diplômes reconnus</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Supervision régulière</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Formation continue</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Approche personnalisée</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Suivi progressif</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION FORFAITS */}
      {/* <SlideIn direction="up" delay={400}>
        <div className="mt-12 bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-2xl p-8 border border-logo/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-logo">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Forfaits d'Accompagnement</h3>
              <p className="text-gray-600 dark:text-gray-400">Suivis à long terme pour des résultats durables</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Forfait Découverte</div>
              <div className="text-2xl font-bold text-logo mb-2">200€<span className="text-sm text-gray-500">/3 séances</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>3 séances de 1h</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Bilan initial complet</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Valable 2 mois</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Recommandé
              </div>
              <div className="font-bold text-lg mb-2">Forfait Équilibre</div>
              <div className="text-2xl font-bold text-logo mb-2">350€<span className="text-sm text-gray-500">/6 séances</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Séances hebdomadaires</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Support entre séances</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Valable 3 mois</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-6 border border-separator dark:border-border">
              <div className="font-bold text-lg mb-2">Forfait Transformation</div>
              <div className="text-2xl font-bold text-logo mb-2">600€<span className="text-sm text-gray-500">/12 séances</span></div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Accompagnement complet</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Priorité des rendez-vous</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </div>
                  <span>Valable 6 mois</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SlideIn> */}

      {/* MODAL */}
      <ReservationBienEtreModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
};

// Fonction de fallback pour les données simulées
function getSimulatedServices() {

  return [
    {
      id: 1,
      libelle: "Consultation Psychologie en ligne",
      description: "Séance de psychothérapie en ligne avec un psychologue clinicien pour travailler sur le bien-être mental et émotionnel.",
      price: 75,
      duration: 60,
      durationFormatted: "1h",
      images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      category: { name: "Thérapeute" },
      benefits: "Gestion du stress, anxiété, développement personnel",
      therapist: {
        name: "Dr. Sophie Martin",
        specialty: "Psychologue clinicienne",
        experience: "12 ans d'expérience",
        rating: 4.9,
        reviews: 234,
        languages: ["Français", "Anglais"],
        availability: "Lun-Ven, 9h-18h"
      },
      features: [
        "Consultation sécurisée",
        "Support entre séances",
        "Exercices personnalisés"
      ],
      tags: ["psychologie", "en ligne", "thérapie"],
      popular: true,
      type: "Thérapeute"
    },
    {
      id: 2,
      libelle: "Massage Thérapeutique Professionnel",
      description: "Massage profond pour soulager les douleurs musculaires, les tensions chroniques et améliorer la mobilité articulaire.",
      price: 90,
      duration: 75,
      durationFormatted: "1h15",
      images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      category: { name: "Masseur" },
      benefits: "Soulagement douleurs, mobilité améliorée",
      therapist: {
        name: "Pierre Moreau",
        specialty: "Massothérapeute",
        experience: "9 ans d'expérience",
        rating: 4.9,
        reviews: 198,
        languages: ["Français"],
        availability: "Lun-Sam, 8h-20h"
      },
      features: [
        "Évaluation pré-massage",
        "Techniques adaptées",
        "Conseils post-massage"
      ],
      tags: ["massage", "thérapeutique", "douleurs"],
      popular: true,
      type: "Masseur"
    }
  ];
}

export default Therapeute;