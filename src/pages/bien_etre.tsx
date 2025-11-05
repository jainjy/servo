import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api"
import { Headphones, Home, Video, MessageCircle, Activity } from "lucide-react";
import PodcastCard from "@/components/PodcastCard";
import BoutiqueBienEtre from "@/components/components/BoutiqueNaturel";
import Podcast from "@/pages/podcast";
import ArtCommerce from "./ArtCommerce";

interface Service {
  id: number
  libelle: string
  description: string
  category: {
    id: number
    name: string
  }
  categoryId: number
  images: string[]
  metiers: Array<{
    metier: {
      id: number
      libelle: string
    }
  }>
  users: Array<{
    id: string
    name: string
    rating: number
    bookings: number
  }>
  status: string
  duration: number
  price: number
}

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

// Composant formulaire de rendez-vous
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
      // Appel à l'API pour créer le rendez-vous
      const response = await api.post('/harmonie/appointments', {
        serviceId: service.id, // ID du service sélectionné
        date: formData.date,
        time: formData.time,
        message: formData.message
        // userId est récupéré automatiquement du token
      });

      console.log("✅ Rendez-vous créé:", response.data);
      alert("Rendez-vous confirmé ! Nous vous contacterons rapidement.");
      onClose();

      // Réinitialiser le formulaire
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-out animate-slideUp">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Prendre rendez-vous - {service?.libelle}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  min={new Date().toISOString().split('T')[0]} // Pas de dates passées
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (optionnel)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                placeholder="Informations supplémentaires, préférences, etc."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création...
                  </>
                ) : (
                  "Confirmer le rendez-vous"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Composant de petite carte moderne
const ServiceCard = ({ service, index }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
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
            onClick={() => setShowForm(true)}
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

      <AppointmentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        service={service}
      />
    </>
  );
};

const BienEtre = () => {
  const navigate = useNavigate();
  const section2Ref = useRef(null);

  const scrollToSection2 = () => {
    section2Ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  // State pour la tabulation
  const [activeTab, setActiveTab] = useState('all');

  // Configuration des tabs avec icônes SVG
  const tabs = [
    {
      id: 'all',
      label: 'Tous les services',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'Formateur',
      label: 'Cours à domicile',
      icon: <Activity className="w-5 h-5" />
    },
    {
      id: 'Masseur',
      label: 'Massages à domicile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      id: 'Thérapeute',
      label: 'Thérapeutes & soins',
      icon: <Video className="w-5 h-5" />
    },
    {
      id: 'Podcasteur',
      label: 'Podcasts & Vidéos',
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
              className="bg-slate-900 text-white px-8 py-2 rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-2xl font-semibold text-md">
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
            <div className="bg-white dark:bg-card rounded-2xl shadow-lg px-2 py-5 mb-12 grid grid-cols-2 lg:grid-cols-6 justify-center items-center w-full mx-auto">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 animate-shimmer bg-[length:200%_100%]" />
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

            {/* TOUS LES SERVICES */}
            {activeTab === 'all' && (
              <section className="mb-20">
                <SlideIn direction="left">
                  <div className="mb-12">
                    <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 dark:text-foreground">
                      Tous nos services de bien-être
                    </h2>
                    <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
                      Découvrez l'ensemble de nos services pour prendre soin de votre corps et de votre esprit.
                      Des cours personnalisés aux massages relaxants, en passant par les consultations en ligne
                      et nos contenus inspirants.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {getCurrentServices().length > 0 ? (
                        getCurrentServices().map((service, index) => (
                          <SlideIn key={service.id || index} direction="up" delay={index * 100}>
                            <ServiceCard service={service} index={index} />
                          </SlideIn>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-muted-foreground col-span-full">
                          Aucun service disponible pour le moment
                        </div>
                      )}
                    </div>
                  </div>
                </SlideIn>
              </section>
            )}

            {/* FORMATEUR */}
            {activeTab === 'Formateur' && (
              <>
                <section className="mb-20">
                  <SlideIn direction="left">
                    <div className="mb-12">
                      <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 dark:text-foreground">
                        Cours à domicile
                      </h2>
                      <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
                        Des séances personnalisées dans le confort de votre maison. Nos experts se déplacent chez vous avec tout le matériel nécessaire pour des cours sur mesure adaptés à vos objectifs et votre emploi du temps.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {getCurrentServices().length > 0 ? (
                          getCurrentServices().map((service, index) => (
                            <SlideIn key={service.id || index} direction="up" delay={index * 100}>
                              <ServiceCard service={service} index={index} />
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
                <ArtCommerce />
              </>
            )}

            {/* MASSEUR */}
            {activeTab === 'Masseur' && (
              <section className="mb-20">
                <SlideIn direction="right">
                  <div className="mb-12">
                    <h2 className="text-2xl lg:text-3xl mb-4 font-bold text-slate-900 dark:text-foreground">
                      Massages à domicile
                    </h2>
                    <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
                      Transformez votre espace en véritable spa avec nos thérapeutes certifiés. Installation professionnelle, huiles essentielles bio et ambiance relaxante pour une expérience sensorielle complète sans vous déplacer.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {getCurrentServices().length > 0 ? (
                        getCurrentServices().map((service, index) => (
                          <SlideIn key={service.id || index} direction="up" delay={index * 100}>
                            <ServiceCard service={service} index={index} />
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
                            <ServiceCard service={service} index={index} />
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

            {/* PODCASTEUR */}
            {activeTab === 'Podcasteur' && (
              <>
                <Podcast />
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

    </div>
  );
};

export default BienEtre;