import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api"
import { Headphones, Home, Video, MessageCircle, Activity, PencilIcon } from "lucide-react";
import PodcastCard from "@/components/PodcastCard";
import BoutiqueBienEtre from "@/components/components/BoutiqueNaturel";
//import Podcast from "@/pages/podcast";
import ArtCommerce from "./ArtCommerce";
import { useBienEtreTracking } from '@/hooks/useBienEtreTracking';
import PodcastsBienEtre from "@/components/PodcastsBienEtre";
import FormateurTabContent from "@/components/FormateurTabContent";


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

// Composant formulaire de rendez-vous - AGRANDI AVEC BOUTON FERMER EN CERCLE
const AppointmentForm = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const { trackBienEtreServiceBook } = useBienEtreTracking();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      trackBienEtreServiceBook(service.id, service.libelle, service.category?.name || 'general');

      const response = await api.post('/harmonie/appointments', {
        serviceId: service.id,
        date: formData.date,
        time: formData.time,
        message: formData.message
      });

      console.log("✅ Rendez-vous créé:", response.data);
      alert("Rendez-vous confirmé ! Nous vous contacterons rapidement.");
      onClose();

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        message: ""
      });

    } catch (error) {
      console.error("❌ Erreur création rendez-vous:", error);
      alert("Erreur lors de la création du rendez-vous. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal agrandi - max-w-2xl au lieu de max-w-md */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-8">
          {/* En-tête avec bouton fermer en cercle */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">
                Prendre rendez-vous
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {service?.libelle}
              </p>
            </div>
            {/* Bouton fermer en cercle */}
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

          {/* Formulaire avec plus d'espace */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
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
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-200"
                  placeholder="Votre nom complet"
                />
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
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-200"
                  placeholder="votre@email.com"
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
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-200"
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Heure *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                  Message (optionnel)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-200 resize-none"
                  placeholder="Informations supplémentaires, préférences, questions..."
                />
              </div>
            </div>

            {/* Actions avec boutons plus grands */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-5 text-lg font-semibold border-2 border-slate-900 hover:border-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmer le rendez-vous
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

// Composant de petite carte moderne - SANS LE MODAL INTÉGRÉ
const ServiceCard = ({ service, index, onOpenModal }) => {
  const { trackBienEtreServiceClick } = useBienEtreTracking();

  const handleCardClick = () => {
    trackBienEtreServiceClick(service.id, service.libelle, service.category?.name || 'general');
    onOpenModal(service);
  };

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-border hover:border-blue-300 dark:hover:border-primary transform hover:-translate-y-2">

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={service.images[0]}
          alt={service.libelle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Prix badge */}
        <div className="absolute top-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl font-bold">
          {service.price ? `${service.price}€` : "N/A"}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-blue-600 dark:group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
          {service.libelle || "Titre non disponible"}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
          {service.description || "Description non disponible"}
        </p>

        {/* Bouton */}
        <button
          onClick={handleCardClick}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Rendez-vous
        </button>
      </div>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
    </div>
  );
};

const BienEtre = () => {
  const navigate = useNavigate();
  const section2Ref = useRef(null);

  // États pour gérer le modal
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialisation du tracking
  const {
    trackBienEtreView,
    trackBienEtreSearch,
    trackBienEtreTabChange
  } = useBienEtreTracking();

  // Track le chargement de la page
  useEffect(() => {
    trackBienEtreView();
  }, []);

  const scrollToSection2 = () => {
    section2Ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Fonctions pour gérer le modal
  const handleOpenModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // State pour la tabulation
  const [activeTab, setActiveTab] = useState('Formateur');

  // Configuration des tabs avec icônes SVG
  const tabs = [
    {
      id: 'Formateur',
      label: 'Cours à domicile',
      icon: <Activity className="w-5 h-5" />
    },
    {
      id: 'Masseur',
      label: 'Arts & commerces',
      icon: <PencilIcon className="w-5 h-5" />
    },
    {
      id: 'Thérapeute',
      label: 'Thérapeutes & soins',
      icon: <Video className="w-5 h-5" />
    },
    {
      id: 'Podcasteur',
      label: 'Podcasts',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'BoutiqueNaturels',
      label: 'Boutique & produits naturels',
      icon: <MessageCircle className="w-5 h-5" />
    },
  ];

  const [servicesByCategory, setServicesByCategory] = useState({
    Formateur: [],
    Masseur: [],
    Thérapeute: [],
    Podcasteur: [],
    BoutiqueNaturels: []
  });

  // Track les changements d'onglet
  useEffect(() => {
    if (activeTab) {
      trackBienEtreTabChange(activeTab);
    }
  }, [activeTab, trackBienEtreTabChange]);

  const fetchServices = async () => {
    try {
      console.log("🔄 DÉBUT DE LA RÉCUPÉRATION DES DONNÉES");
      const response = await api.get('/harmonie/views');

      console.log("🎯 RÉPONSE COMPLÈTE DE L'API:", response);
      console.log("📦 DONNÉES BRUTES:", response.data);

      // Debug détaillé de chaque catégorie
      if (response.data) {
        console.log("🔍 DÉTAIL PAR CATÉGORIE:");
        console.log("Formateur:", response.data.Formateur);
        console.log("Masseur:", response.data.Masseur);
        console.log("Thérapeute:", response.data.Thérapeute);
        console.log("Podcasteur:", response.data.Podcasteur);

        // Vérifier la structure des données
        if (response.data.Formateur && response.data.Formateur.length > 0) {
          console.log("📝 STRUCTURE DU PREMIER SERVICE Formateur:", response.data.Formateur[0]);
        }
        if (response.data.Masseur && response.data.Masseur.length > 0) {
          console.log("📝 STRUCTURE DU PREMIER SERVICE Masseur:", response.data.Masseur[0]);
        }
        if (response.data.Thérapeute && response.data.Thérapeute.length > 0) {
          console.log("📝 STRUCTURE DU PREMIER SERVICE Thérapeute:", response.data.Thérapeute[0]);
        }
        if (response.data.Podcasteur && response.data.Podcasteur.length > 0) {
          console.log("📝 STRUCTURE DU PREMIER SERVICE Podcasteur:", response.data.Podcasteur[0]);
        }
      } else {
        console.warn("⚠️ AUCUNE DONNÉE DANS LA RÉPONSE");
      }

      setServicesByCategory(response.data || {
        Formateur: [],
        Masseur: [],
        Thérapeute: [],
        Podcasteur: []
      });

    } catch (error) {
      console.error('❌ ERREUR LORS DU CHARGEMENT DES SERVICES:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Ajouter un useEffect pour surveiller les changements de state
  useEffect(() => {
    console.log("🔄 SERVICES BY CATEGORY MIS À JOUR:", servicesByCategory);
  }, [servicesByCategory]);

  // Ajouter un log quand on change d'onglet
  useEffect(() => {
    console.log(`📌 ONGLET ACTIF: ${activeTab}`);
    console.log(`📊 DONNÉES POUR ${activeTab}:`, servicesByCategory[activeTab]);
    console.log(`🔢 NOMBRE DE SERVICES: ${servicesByCategory[activeTab]?.length || 0}`);
  }, [activeTab, servicesByCategory]);

  // Fonction pour obtenir tous les services
  const getAllServices = () => {
    const allServices = [
      ...(servicesByCategory.Formateur || []),
      ...(servicesByCategory.Masseur || []),
      ...(servicesByCategory.Thérapeute || []),
      ...(servicesByCategory.Podcasteur || [])
    ];
    return allServices;
  };

  // Fonction pour obtenir les services selon l'onglet actif
  const getCurrentServices = () => {
    if (activeTab === 'all') {
      return getAllServices();
    }
    return servicesByCategory[activeTab] || [];
  };

  // Track la recherche
  const handleSearch = (query: string) => {
    trackBienEtreSearch(query);
    // Implémentez votre logique de recherche ici
  };

  return (
    <div className="font-sans text-foreground min-h-screen bg-background">

      {/* HERO */}
      <section
        className="relative h-80 py-20 lg:py-32 text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.6)), url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1999&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 to-slate-900/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <SlideIn direction="up">
            <h1 className="text-4xl sm:text-5xl lg:text-4xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
              Bien-Être & Équilibre
            </h1>
          </SlideIn>
          <SlideIn direction="up" delay={200}>
            <p className="text-sm sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed px-4 mb-8 drop-shadow-lg">
              Découvrez nos expériences holistiques à domicile, en visio ou en compagnie de nos experts certifiés.
            </p>
          </SlideIn>
          <SlideIn direction="up" delay={400}>
            <button
              onClick={scrollToSection2}
              className="bg-slate-900 text-white px-8 py-2 -mt-11 rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-2xl font-semibold text-md">
              Commencer mon voyage
            </button>
          </SlideIn>
        </div>
      </section>

      {/* CONTAINER AVEC TABULATION */}
      <div ref={section2Ref} className="bg-gray-50 dark:bg-background p-4 sm:p-6 lg:p-0">
        <div className="mx-auto">

          {/* Menu de tabulation moderne */}
          <SlideIn direction="down">
            <div className="bg-white dark:bg-card rounded-2xl shadow-lg px-2 py-5 mb-12 grid place-items-center grid-cols-2 lg:grid-cols-6 justify-center items-center w-full mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-2 sm:gap-3 px-2 sm:px-2 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${activeTab === tab.id
                    ? 'text-white shadow-md'
                    : 'text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted/50'
                    }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-slate-900 animate-shimmer bg-[length:200%_100%]" />
                  )}
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {tab.icon}
                  </span>
                  <span className="text-xs sm:text-xs font-bold relative z-10">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </SlideIn>

          {/* Contenu des tabs */}
          <div className="px-10 min-h-[500px]">

            {/* FORMATEUR */}
            {activeTab === 'Formateur' && (
              <SlideIn direction="left">
                <FormateurTabContent 
                  onSelectCourse={(category, course) => {
                    console.log(`Formation sélectionnée: ${category} - ${course}`);
                    // Vous pouvez ajouter la logique pour réserver ou afficher plus de détails
                  }}
                />
              </SlideIn>
            )}

            {/* MASSEUR */}
            {activeTab === 'Masseur' && (
              <section className="mb-20">
                <SlideIn direction="right">
                  <ArtCommerce />
                </SlideIn>
              </section>
            )}

            {/* THERAPEUTE */}
            {activeTab === 'Thérapeute' && (
              <section className="mb-20">
                <SlideIn direction="left">
                  <div className="mb-12">
                    <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 dark:text-foreground">
                      Consultation en visio
                    </h2>
                    <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
                      Accédez à l'expertise où que vous soyez. Nos consultations à distance maintiennent la qualité d'un accompagnement personnalisé avec une flexibilité totale. Idéal pour un suivi régulier ou des conseils ponctuels.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {getCurrentServices().length > 0 ? (
                        getCurrentServices().map((service, index) => (
                          <SlideIn key={service.id || index} direction="up" delay={index * 100}>
                            <ServiceCard
                              service={service}
                              index={index}
                              onOpenModal={handleOpenModal}
                            />
                          </SlideIn>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-muted-foreground col-span-full">
                          Aucun service disponible pour cette catégorie
                        </div>
                      )}
                    </div>
                  </div>
                </SlideIn>
              </section>
            )}
            {activeTab === 'Podcasteur' && (
              <>
                <PodcastsBienEtre />
              </>
            )}

            {activeTab === 'BoutiqueNaturels' && (
              <>
                <BoutiqueBienEtre />
              </>
            )}

          </div>
        </div>
      </div>

      {/* MODAL AU NIVEAU RACINE - AGRANDI AVEC BOUTON FERMER EN CERCLE */}
      <AppointmentForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />

    </div>
  );
};

export default BienEtre;