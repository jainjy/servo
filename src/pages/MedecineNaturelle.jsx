import React, { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Sprout, Leaf, Heart, Pill, Flower, Shield, Apple, Thermometer, Coffee, Brain, Zap, Star, Users, Clock, Award, CheckCircle, Calendar, Search } from "lucide-react";
import { useBienEtreTracking } from '@/hooks/useBienEtreTracking';

// Données de simulation pour les médecines naturelles
const simulatedMedecinesNaturelles = [
  {
    id: 1,
    libelle: "Consultation Phytothérapie",
    description: "Bilan personnalisé et conseils en plantes médicinales pour traiter vos troubles de santé naturellement.",
    price: 75,
    duration: "1h",
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Consultation" },
    benefits: "Solutions naturelles, approche holistique, résultats durables",
    specialist: {
      name: "Dr. Sophie Laurent",
      specialty: "Phytothérapeute",
      experience: "12 ans d'expérience",
      rating: 4.9,
      reviews: 198,
      languages: ["Français", "Anglais"],
      availability: "Lun-Ven, 9h-18h"
    },
    features: [
      "Bilan de santé complet",
      "Prescription de plantes adaptées",
      "Préparation de tisanes personnalisées",
      "Suivi mensuel"
    ],
    included: ["Consultation initiale", "Formule personnalisée", "Guide d'utilisation", "Suivi à 1 mois"],
    popular: true,
    tags: ["Plantes", "Personnalisé", "Complet"]
  },
  {
    id: 2,
    libelle: "Atelier Plantes Médicinales",
    description: "Apprenez à reconnaître et utiliser les plantes médicinales locales pour votre santé au quotidien.",
    price: 60,
    duration: "2h",
    images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Atelier" },
    benefits: "Autonomie santé, connaissances pratiques, approche locale",
    specialist: {
      name: "Thomas Dubois",
      specialty: "Herboriste",
      experience: "8 ans d'expérience",
      rating: 4.7,
      reviews: 134,
      languages: ["Français"],
      availability: "Sam-Dim, 10h-17h"
    },
    features: [
      "Reconnaissance des plantes",
      "Techniques de récolte",
      "Préparation de remèdes",
      "Guide de cueillette"
    ],
    included: ["Matériel fourni", "Cahier de notes", "Échantillons de plantes", "Guide pratique"],
    popular: true,
    tags: ["Pratique", "Atelier", "Éducatif"]
  },
  {
    id: 3,
    libelle: "Programme Dépuration Naturelle",
    description: "Cure de 21 jours pour détoxifier l'organisme avec des plantes spécifiques et une alimentation adaptée.",
    price: 150,
    duration: "3 semaines",
    images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Programme" },
    benefits: "Détoxification, énergie retrouvée, santé renforcée",
    specialist: {
      name: "Marie Lambert",
      specialty: "Naturopathe",
      experience: "10 ans d'expérience",
      rating: 4.8,
      reviews: 167,
      languages: ["Français", "Espagnol"],
      availability: "Lun-Sam, 8h-20h"
    },
    features: [
      "Plan détaillé jour par jour",
      "Tisanes dépuratives",
      "Conseils alimentaires",
      "Support quotidien"
    ],
    included: ["Consultation initiale", "Guide 21 jours", "Tisanes préparées", "Groupe de support", "Suivi hebdomadaire"],
    popular: true,
    tags: ["Détox", "Programme", "Long terme"]
  }
];

// Statistiques globales
const globalStats = {
  totalServices: 9,
  expertsCount: 15,
  satisfactionRate: 96,
  naturalApproaches: 8,
  traditionalTherapies: 5
};

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

// Composant Statistique
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

// Composant formulaire de rendez-vous
const AppointmentForm = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
    healthGoals: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const { trackBienEtreServiceBook } = useBienEtreTracking();

  const healthGoalsList = [
    "Gestion du stress",
    "Problèmes digestifs",
    "Troubles du sommeil",
    "Douleurs chroniques",
    "Allergies",
    "Fatigue persistante"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        healthGoals: checked 
          ? [...prev.healthGoals, value]
          : prev.healthGoals.filter(goal => goal !== value)
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      trackBienEtreServiceBook(service.id, service.libelle, service.category?.name || 'general');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert("✅ Consultation confirmée ! Vous recevrez un email avec toutes les informations.");
      onClose();
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        message: "",
        healthGoals: []
      });

    } catch (error) {
      console.error("Erreur création rendez-vous:", error);
      alert("❌ Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">
                Réserver une consultation
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {service?.libelle}
              </p>
              {service?.specialist && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-logo/10 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-logo" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{service.specialist.name}</p>
                      <p className="text-sm text-gray-600">{service.specialist.specialty}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 flex items-center justify-center flex-shrink-0 ml-4"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Date souhaitée *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Créneau horaire *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                  >
                    <option value="">Sélectionnez un créneau</option>
                    <option value="09:00">09:00 - 10:00</option>
                    <option value="10:30">10:30 - 11:30</option>
                    <option value="14:00">14:00 - 15:00</option>
                    <option value="15:30">15:30 - 16:30</option>
                    <option value="17:00">17:00 - 18:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                  Vos objectifs de santé *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {healthGoalsList.map((goal) => (
                    <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="healthGoals"
                        value={goal}
                        checked={formData.healthGoals.includes(goal)}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-5 w-5 rounded border-gray-300 text-logo focus:ring-logo"
                      />
                      <span className="text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                  Message complémentaire
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200 resize-none"
                  placeholder="Autres informations, questions spécifiques..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-logo hover:bg-primary-dark text-white rounded-xl py-5 text-lg font-semibold border-2 border-logo hover:border-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Réservation...
                  </>
                ) : (
                  <>
                    <Calendar className="w-6 h-6 mr-3" />
                    Confirmer la consultation
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-xl py-5 text-lg font-semibold border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 transition-all duration-300 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Composant de carte de service
const MedecineCard = ({ service, index, onOpenModal }) => {
  const { trackBienEtreServiceClick } = useBienEtreTracking();

  const handleCardClick = () => {
    trackBienEtreServiceClick(service.id, service.libelle, service.category?.name || 'general');
    onOpenModal(service);
  };

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-border hover:border-primary-dark transform hover:-translate-y-1">

      <div className="relative h-56 overflow-hidden">
        <img
          src={service.images[0]}
          alt={service.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-logo text-white px-4 py-2 rounded-full shadow-lg font-bold text-lg">
            {service.price ? `${service.price}€` : "N/A"}
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
            {service.duration}
          </div>
          {service.specialist?.rating && (
            <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {service.specialist.rating}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
          {service.libelle}
        </h3>

        {service.specialist && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-logo/10 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-logo" />
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-foreground">{service.specialist.name}</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">{service.specialist.specialty}</div>
            </div>
          </div>
        )}

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
          {service.description}
        </p>

        {service.tags && (
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-logo/10 text-logo px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {service.features && (
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

const MedecinesNaturelles = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Consultation');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { trackBienEtreTabChange, trackBienEtreSearch } = useBienEtreTracking();

  useEffect(() => {
    if (activeTab) {
      trackBienEtreTabChange(activeTab);
    }
  }, [activeTab]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const filteredServices = simulatedMedecinesNaturelles.filter(service => 
        activeTab === 'Consultation' 
          ? service.category.name === 'Consultation' || service.category.name === 'Thérapie'
          : service.category.name === activeTab
      );
      
      setServices(filteredServices);
      
    } catch (error) {
      console.error('Erreur simulation:', error);
      const filteredServices = simulatedMedecinesNaturelles.filter(service => 
        activeTab === 'Consultation' 
          ? service.category.name === 'Consultation' || service.category.name === 'Thérapie'
          : service.category.name === activeTab
      );
      setServices(filteredServices);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeTab]);

  const handleOpenModal = (service) => {
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

  const filteredServices = services.filter(service =>
    service.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.specialist?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tabs = [
    {
      id: 'Consultation',
      label: 'Consultations',
      icon: <Sprout className="w-5 h-5" />,
      description: 'Bilans et suivis personnalisés'
    },
    {
      id: 'Thérapie',
      label: 'Thérapies',
      icon: <Leaf className="w-5 h-5" />,
      description: 'Soins naturels spécialisés'
    },
    {
      id: 'Atelier',
      label: 'Ateliers',
      icon: <Flower className="w-5 h-5" />,
      description: 'Apprentissage pratique'
    }
  ];

  const stats = [
    {
      icon: Sprout,
      value: globalStats.totalServices,
      label: "Approches naturelles",
      description: "Méthodes différentes",
      color: "logo"
    },
    {
      icon: Users,
      value: globalStats.expertsCount,
      label: "Experts certifiés",
      description: "À votre service",
      color: "primary-dark"
    },
    {
      icon: Heart,
      value: globalStats.satisfactionRate + "%",
      label: "Satisfaction clients",
      description: "Résultats garantis",
      color: "logo"
    },
    {
      icon: Shield,
      value: globalStats.traditionalTherapies,
      label: "Thérapies traditionnelles",
      description: "Sagesse ancestrale",
      color: "primary-dark"
    }
  ];

  return (
    <div className="font-sans text-foreground">
      {/* STATISTIQUES
      <SlideIn direction="up">
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="transform hover:-translate-y-2 transition-transform duration-300">
                <StatCard {...stat} />
              </div>
            ))}
          </div>
        </div>
      </SlideIn> */}

      {/* TABULATION INTERNE */}
      <SlideIn direction="down">
        <LayoutGroup>
          <div className="bg-white dark:bg-card rounded-3xl shadow-lg px-4 py-6 mb-8 w-full mx-auto border border-gray-200 dark:border-gray-700/40">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-1/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une approche, un spécialiste..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-6 py-4 pl-12 border border-gray-200 rounded-2xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <div className="flex flex-wrap gap-2 justify-center">
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
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service, index) => (
                    <SlideIn key={service.id || index} direction="up" delay={index * 100}>
                      <MedecineCard
                        service={service}
                        index={index}
                        onOpenModal={handleOpenModal}
                      />
                    </SlideIn>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-muted-foreground col-span-full">
                    {searchTerm ? 'Aucun service correspondant à votre recherche' : 'Aucun service disponible pour cette catégorie'}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* POURQUOI LES MÉDECINES NATURELLES */}
      <div className="bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-3xl p-8 border border-logo/20 mt-12">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Pourquoi choisir les médecines naturelles ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-border">
            <div className="p-3 bg-logo/10 rounded-xl w-fit mb-4">
              <Leaf className="w-8 h-8 text-logo" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Approche holistique</h4>
            <p className="text-gray-600 dark:text-muted-foreground text-sm">Considère l'individu dans sa globalité</p>
          </div>
          <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-border">
            <div className="p-3 bg-logo/10 rounded-xl w-fit mb-4">
              <Shield className="w-8 h-8 text-logo" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Prévention</h4>
            <p className="text-gray-600 dark:text-muted-foreground text-sm">Renforce les défenses naturelles</p>
          </div>
          <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-border">
            <div className="p-3 bg-logo/10 rounded-xl w-fit mb-4">
              <Brain className="w-8 h-8 text-logo" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Autonomie</h4>
            <p className="text-gray-600 dark:text-muted-foreground text-sm">Apprend à prendre soin de soi</p>
          </div>
          <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-border">
            <div className="p-3 bg-logo/10 rounded-xl w-fit mb-4">
              <Heart className="w-8 h-8 text-logo" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Durabilité</h4>
            <p className="text-gray-600 dark:text-muted-foreground text-sm">Solutions à long terme</p>
          </div>
        </div>
      </div>

      {/* APPROCHES DISPONIBLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700/40">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Nos approches</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Sprout className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Phytothérapie</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Utilisation des plantes médicinales pour traiter les troubles de santé.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Apple className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Nutrition thérapeutique</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Alimentation comme outil de prévention et de guérison.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-logo/10 rounded-xl">
                <Thermometer className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Aromathérapie</h4>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">Huiles essentielles pour la santé physique et émotionnelle.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700/40">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Nos engagements</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Produits 100% naturels</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Experts certifiés</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Approche personnalisée</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="font-medium text-gray-700 dark:text-gray-300">Suivi régulier inclus</span>
              <CheckCircle className="w-6 h-6 text-logo" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AppointmentForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
};

export default MedecinesNaturelles;