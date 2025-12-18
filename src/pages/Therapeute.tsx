// pages/Therapeute.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import api from "@/lib/api"
import { Video, Users, Heart, Clock, Star, CheckCircle, Award, Calendar } from "lucide-react";
import { useBienEtreTracking } from '@/hooks/useBienEtreTracking';

// Données de simulation pour les thérapeutes
const simulatedTherapeutes = [
  {
    id: 1,
    libelle: "Consultation Psychologie",
    description: "Séance de psychothérapie en ligne avec un psychologue clinicien pour travailler sur le bien-être mental et émotionnel.",
    price: 75,
    duration: "1h",
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
    popular: true
  },
  {
    id: 2,
    libelle: "Thérapie Cognitive",
    description: "Approche TCC pour modifier les schémas de pensée négatifs et améliorer la gestion des émotions.",
    price: 85,
    duration: "1h",
    images: ["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Thérapeute" },
    benefits: "Techniques concrètes, résultats mesurables",
    therapist: {
      name: "Thomas Dubois",
      specialty: "Thérapeute TCC",
      experience: "8 ans d'expérience",
      rating: 4.8,
      reviews: 187,
      languages: ["Français"],
      availability: "Mar-Sam, 10h-20h"
    },
    features: [
      "Feuilles de travail",
      "Suivi des progrès",
      "Accès aux ressources"
    ],
    popular: true
  },
  {
    id: 3,
    libelle: "Sophrologie en Visio",
    description: "Séances de relaxation et de gestion du stress par des techniques de respiration et de visualisation.",
    price: 60,
    duration: "45min",
    images: ["https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Thérapeute" },
    benefits: "Réduction stress, meilleur sommeil, concentration",
    therapist: {
      name: "Marie Lambert",
      specialty: "Sophrologue certifiée",
      experience: "6 ans d'expérience",
      rating: 4.7,
      reviews: 156,
      languages: ["Français", "Espagnol"],
      availability: "Lun-Ven, 8h-19h"
    },
    features: [
      "Enregistrements audio",
      "Exercices pratiques",
      "Guidance continue"
    ],
    popular: false
  },
  {
    id: 4,
    libelle: "Hypnothérapie",
    description: "Accompagnement par l'hypnose pour travailler sur les dépendances, phobies et troubles du comportement.",
    price: 95,
    duration: "1h30",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Thérapeute" },
    benefits: "Changements profonds, résultats rapides",
    therapist: {
      name: "Dr. Laurent Petit",
      specialty: "Hypnothérapeute",
      experience: "15 ans d'expérience",
      rating: 4.9,
      reviews: 289,
      languages: ["Français", "Anglais"],
      availability: "Mer-Dim, 11h-21h"
    },
    features: [
      "Séances sur mesure",
      "Suivi à long terme",
      "Support personnalisé"
    ],
    popular: true
  },
  {
    id: 5,
    libelle: "Thérapie de Couple",
    description: "Séances en ligne pour couples souhaitant améliorer leur communication et résoudre leurs conflits.",
    price: 120,
    duration: "1h30",
    images: ["https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Thérapeute" },
    benefits: "Communication, résolution conflits, intimité",
    therapist: {
      name: "Julie et Marc",
      specialty: "Thérapeutes de couple",
      experience: "10 ans d'expérience",
      rating: 4.8,
      reviews: 176,
      languages: ["Français"],
      availability: "Sam-Dim, 9h-17h"
    },
    features: [
      "Séances conjointes",
      "Exercices pratiques",
      "Guidance individuelle"
    ],
    popular: false
  },
  {
    id: 6,
    libelle: "Coaching Personnel",
    description: "Accompagnement individuel pour atteindre vos objectifs personnels et professionnels.",
    price: 70,
    duration: "1h",
    images: ["https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Thérapeute" },
    benefits: "Objectifs clairs, plan d'action, suivi",
    therapist: {
      name: "Alexandre Roux",
      specialty: "Coach professionnel",
      experience: "7 ans d'expérience",
      rating: 4.6,
      reviews: 142,
      languages: ["Français", "Anglais"],
      availability: "Lun-Ven, 7h-22h"
    },
    features: [
      "Plan personnalisé",
      "Suivi hebdomadaire",
      "Ressources exclusives"
    ],
    popular: true
  }
];

// Données de simulation pour les masseurs
const simulatedMasseurs = [
  {
    id: 7,
    libelle: "Massage Thérapeutique",
    description: "Massage profond pour soulager les douleurs musculaires et les tensions chroniques.",
    price: 90,
    duration: "1h15",
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
    popular: true
  },
  {
    id: 8,
    libelle: "Massage Relaxant",
    description: "Techniques douces pour détendre le corps et l'esprit, idéal pour le stress.",
    price: 75,
    duration: "1h",
    images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Masseur" },
    benefits: "Détente profonde, réduction tension",
    therapist: {
      name: "Clara Simon",
      specialty: "Masseuse bien-être",
      experience: "5 ans d'expérience",
      rating: 4.7,
      reviews: 132,
      languages: ["Français", "Italien"],
      availability: "Mar-Dim, 10h-19h"
    },
    features: [
      "Ambiance relaxante",
      "Huiles essentielles",
      "Musique douce"
    ],
    popular: true
  },
  {
    id: 9,
    libelle: "Réflexologie Plantaire",
    description: "Stimulation des points réflexes des pieds pour équilibrer l'ensemble du corps.",
    price: 65,
    duration: "45min",
    images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Masseur" },
    benefits: "Équilibre énergétique, bien-être général",
    therapist: {
      name: "Sophie Chen",
      specialty: "Réflexologue",
      experience: "8 ans d'expérience",
      rating: 4.8,
      reviews: 154,
      languages: ["Français", "Chinois"],
      availability: "Lun-Ven, 9h-18h"
    },
    features: [
      "Carte réflexologique",
      "Conseils d'auto-massage",
      "Suivi personnalisé"
    ],
    popular: false
  }
];

// Statistiques globales
const globalStats = {
  totalTherapists: 15,
  totalSessions: 1250,
  satisfactionRate: 98,
  avgResponseTime: "2h"
};

// Avis des clients
const clientReviews = [
  {
    id: 1,
    name: "Marie D.",
    service: "Consultation Psychologie",
    rating: 5,
    comment: "Excellent thérapeute, très à l'écoute. Les séances m'ont beaucoup aidée.",
    date: "Il y a 2 semaines"
  },
  {
    id: 2,
    name: "Thomas L.",
    service: "Massage Thérapeutique",
    rating: 4,
    comment: "Très professionnel, mes douleurs dorsales ont considérablement diminué.",
    date: "Il y a 1 mois"
  },
  {
    id: 3,
    name: "Sophie M.",
    service: "Thérapie Cognitive",
    rating: 5,
    comment: "Approche très structurée qui m'a permis de faire des progrès significatifs.",
    date: "Il y a 3 semaines"
  }
];

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

// Composant Statistiques
const StatsSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border text-center">
        <div className="text-3xl font-bold text-logo mb-2">{globalStats.totalTherapists}</div>
        <div className="text-gray-600 dark:text-muted-foreground">Thérapeutes</div>
      </div>
      <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border text-center">
        <div className="text-3xl font-bold text-logo mb-2">{globalStats.totalSessions}+</div>
        <div className="text-gray-600 dark:text-muted-foreground">Séances</div>
      </div>
      <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border text-center">
        <div className="text-3xl font-bold text-logo mb-2">{globalStats.satisfactionRate}%</div>
        <div className="text-gray-600 dark:text-muted-foreground">Satisfaction</div>
      </div>
      <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border text-center">
        <div className="text-3xl font-bold text-logo mb-2">{globalStats.avgResponseTime}</div>
        <div className="text-gray-600 dark:text-muted-foreground">Réponse moyenne</div>
      </div>
    </div>
  );
};

// Composant Avis Clients
const ReviewsSection = () => {
  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Avis de nos clients</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clientReviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-foreground">{review.name}</div>
                <div className="text-sm text-gray-500 dark:text-muted-foreground">{review.service}</div>
              </div>
              <div className="flex items-center bg-logo/10 text-logo px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="font-bold">{review.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-muted-foreground mb-3">{review.comment}</p>
            <div className="text-sm text-gray-400 dark:text-gray-500">{review.date}</div>
          </div>
        ))}
      </div>
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
  const { trackBienEtreServiceBook } = useBienEtreTracking();

  // Générer des créneaux horaires
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute of ["00", "30"]) {
      if (hour < 18 || minute === "00") {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
      }
    }
  }

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
      // Simulation d'envoi de données
      trackBienEtreServiceBook(service.id, service.libelle, service.category?.name || 'general');
      
      // Simulation de délai
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert("✅ Rendez-vous confirmé ! Un email de confirmation vous a été envoyé.");
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
      console.error("Erreur création rendez-vous:", error);
      alert("❌ Erreur lors de la création du rendez-vous. Veuillez réessayer.");
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
                Prendre rendez-vous
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {service?.libelle}
              </p>
              {service?.therapist && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800">{service.therapist.name}</p>
                  <p className="text-sm text-gray-600">{service.therapist.specialty}</p>
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

              <div className="grid grid-cols-2 gap-6">
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
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                    Heure *
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
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
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
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200 resize-none"
                  placeholder="Informations supplémentaires, préférences, questions..."
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
                    Création...
                  </>
                ) : (
                  <>
                    <Calendar className="w-6 h-6 mr-3" />
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

// Composant de carte de service amélioré
const ServiceCard = ({ service, index, onOpenModal }) => {
  const { trackBienEtreServiceClick } = useBienEtreTracking();

  const handleCardClick = () => {
    trackBienEtreServiceClick(service.id, service.libelle, service.category?.name || 'general');
    onOpenModal(service);
  };

  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-separator dark:border-border hover:border-primary-dark transform hover:-translate-y-1">

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
          {service.therapist?.rating && (
            <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {service.therapist.rating}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-foreground group-hover:text-logo transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
          {service.libelle || "Titre non disponible"}
        </h3>

        {service.therapist && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-logo/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-logo" />
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-foreground">{service.therapist.name}</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">{service.therapist.specialty}</div>
            </div>
          </div>
        )}

        <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
          {service.description || "Description non disponible"}
        </p>

        {service.benefits && (
          <div className="pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">Bénéfices :</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{service.benefits}</p>
          </div>
        )}

        {service.features && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Inclus :</p>
            <div className="flex flex-wrap gap-2">
              {service.features.slice(0, 2).map((feature, idx) => (
                <div key={idx} className="text-xs bg-logo/10 text-logo px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {feature}
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

const Therapeute = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Thérapeute');
  const [isLoading, setIsLoading] = useState(false);

  const { trackBienEtreView, trackBienEtreTabChange } = useBienEtreTracking();

  useEffect(() => {
    trackBienEtreView();
  }, []);

  useEffect(() => {
    if (activeTab) {
      trackBienEtreTabChange(activeTab);
    }
  }, [activeTab]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      // Simulation de délai pour simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Utilisation directe des données simulées
      const simulatedData = activeTab === 'Thérapeute' ? simulatedTherapeutes : simulatedMasseurs;
      setServices(simulatedData);
      
    } catch (error) {
      console.error('Erreur simulation:', error);
      // Utilisation des données simulées en cas d'erreur
      const simulatedData = activeTab === 'Thérapeute' ? simulatedTherapeutes : simulatedMasseurs;
      setServices(simulatedData);
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

  const tabs = [
    {
      id: 'Thérapeute',
      label: 'Thérapeutes',
      icon: <Users className="w-5 h-5" />,
      count: simulatedTherapeutes.length
    },
    {
      id: 'Masseur',
      label: 'Masseurs',
      icon: <Heart className="w-5 h-5" />,
      count: simulatedMasseurs.length
    }
  ];

  return (
    <div className="font-sans text-foreground min-h-screen bg-light-bg dark:bg-background">

      {/* HERO */}
      <section
        className="relative h-80 py-20 lg:py-32 text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(85, 107, 47, 0.8), rgba(107, 142, 35, 0.6)), url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1999&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-logo/20 to-primary-dark/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <SlideIn direction="up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight" style={{ color: '#8B4513' }}>
              Thérapeute
            </h1>
          </SlideIn>
          <SlideIn direction="up" delay={200}>
            <p className="text-sm sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed px-4 mb-8">
              Consultez nos thérapeutes certifiés pour un accompagnement personnalisé vers l'équilibre et le bien-être.
            </p>
          </SlideIn>
          
          {/* Statistiques Hero */}
          <SlideIn direction="up" delay={400}>
            <div className="flex justify-center gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{globalStats.totalTherapists}+</div>
                <div className="text-sm text-slate-200">Professionnels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{globalStats.totalSessions}+</div>
                <div className="text-sm text-slate-200">Séances</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{globalStats.satisfactionRate}%</div>
                <div className="text-sm text-slate-200">Satisfaction</div>
              </div>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* CONTAINER AVEC TABULATION */}
      <div className="bg-gray-50 dark:bg-background p-4 sm:p-6 lg:p-0">
        <div className="mx-auto max-w-7xl">
          {/* Menu de tabulation */}
          <SlideIn direction="down">
            <LayoutGroup>
              <div className="bg-white dark:bg-card rounded-3xl shadow-lg px-4 py-6 mb-12 w-full mx-auto border border-separator dark:border-slate-700/40">
                <div className="flex sm:flex-row gap-4 justify-center items-center">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden flex-1 sm:flex-none justify-center ${activeTab === tab.id
                          ? 'bg-logo text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-separator dark:border-gray-700/60'
                        }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-logo rounded-2xl -z-10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

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
                          x: activeTab === tab.id ? 2 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-xs sm:text-base font-bold relative z-10 whitespace-nowrap"
                      >
                        {tab.label}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          {tab.count}
                        </span>
                      </motion.span>
                    </button>
                  ))}
                </div>
              </div>
            </LayoutGroup>
          </SlideIn>

          {/* Statistiques */}
          <StatsSection />

          {/* Contenu des tabs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 md:p-12 min-h-[500px] border border-separator dark:border-gray-700/40"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo mb-4"></div>
                  <div className="text-gray-600 dark:text-muted-foreground">Chargement des services...</div>
                </div>
              ) : (
                <>
                  {activeTab === 'Thérapeute' && (
                    <SlideIn direction="left">
                      <div className="mb-12">
                        <h2 className="text-2xl lg:text-3xl mb-4 font-bold" style={{ color: '#8B4513' }}>
                          Consultation en visio
                        </h2>
                        <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
                          Accédez à l'expertise où que vous soyez. Nos consultations à distance maintiennent la qualité d'un accompagnement personnalisé avec une flexibilité totale. Idéal pour un suivi régulier ou des conseils ponctuels.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                          {services.length > 0 ? (
                            services.map((service, index) => (
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
                              Aucun service de thérapeute disponible
                            </div>
                          )}
                        </div>
                      </div>
                    </SlideIn>
                  )}

                  {activeTab === 'Masseur' && (
                    <SlideIn direction="left">
                      <div className="mb-12">
                        <h2 className="text-2xl lg:text-3xl mb-4 font-bold" style={{ color: '#8B4513' }}>
                          Massages et soins
                        </h2>
                        <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
                          Détendez votre corps et votre esprit avec nos massages thérapeutiques. Nos masseurs certifiés vous offrent des soins adaptés à vos besoins.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                          {services.length > 0 ? (
                            services.map((service, index) => (
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
                              Aucun service de massage disponible
                            </div>
                          )}
                        </div>
                      </div>
                    </SlideIn>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Avis Clients */}
          <ReviewsSection />

          {/* Section Pourquoi nous choisir */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 md:p-12 mb-12 border border-separator dark:border-gray-700/40">
            <h3 className="text-2xl font-bold mb-8" style={{ color: '#8B4513' }}>Pourquoi nous choisir ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-logo/10 rounded-xl">
                  <Award className="w-8 h-8 text-logo" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Professionnels certifiés</h4>
                  <p className="text-gray-600 dark:text-muted-foreground text-sm">Tous nos thérapeutes sont diplômés et régulièrement supervisés.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-logo/10 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-logo" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-foreground mb-2">Approche personnalisée</h4>
                  <p className="text-gray-600 dark:text-muted-foreground text-sm">Chaque accompagnement est adapté à vos besoins spécifiques.</p>
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

export default Therapeute;