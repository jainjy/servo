// pages/Nutrition.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import api from "@/lib/api"
import { Apple, Utensils, Scale, Heart, Calendar, Clock, Star, Users, Award, CheckCircle, Leaf, Brain, Target, Zap, TrendingUp, Shield, GraduationCap } from "lucide-react";
import { useBienEtreTracking } from '@/hooks/useBienEtreTracking';

// Données de simulation pour la nutrition
const simulatedNutritionServices = [
  {
    id: 1,
    libelle: "Consultation Nutrition Initiale",
    description: "Bilan complet de vos habitudes alimentaires, analyse corporelle et définition d'un plan nutritionnel personnalisé.",
    price: 90,
    duration: "1h30",
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
    included: ["Bilan initial", "Recommandations personnalisées", "Guide nutrition", "Support email pendant 30 jours"],
    popular: true,
    tags: ["Complet", "Personnalisé", "Suivi inclus"]
  },
  {
    id: 2,
    libelle: "Suivi Nutritionnel Mensuel",
    description: "Séance de suivi pour ajuster votre programme, répondre à vos questions et maintenir votre motivation.",
    price: 60,
    duration: "45min",
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
    included: ["Suivi des progrès", "Ajustements personnalisés", "Nouvelles recettes", "Support motivationnel"],
    popular: true,
    tags: ["Suivi", "Motivation", "Adaptatif"]
  },
  {
    id: 3,
    libelle: "Programme Perte de Poids (3 mois)",
    description: "Accompagnement complet sur 3 mois avec plan alimentaire, recettes et suivi régulier pour atteindre vos objectifs.",
    price: 350,
    duration: "3 mois",
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
    included: ["4 consultations", "Plan alimentaire personnalisé", "50+ recettes", "Groupe de support", "Suivi quotidien"],
    popular: true,
    tags: ["Complet", "Long terme", "Éducatif"]
  },
  {
    id: 4,
    libelle: "Nutrition Sportive Optimale",
    description: "Optimisation de l'alimentation pour les sportifs : performance, récupération et composition corporelle.",
    price: 85,
    duration: "1h",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Sport" },
    benefits: "Performance optimale, récupération améliorée, énergie",
    nutritionist: {
      name: "Alexandre Roux",
      specialty: "Nutritionniste du sport",
      experience: "12 ans d'expérience",
      rating: 4.9,
      reviews: 189,
      languages: ["Français", "Anglais"],
      availability: "Lun-Ven, 7h-21h",
      certifications: ["Diplôme sportif", "Certification internationale"]
    },
    features: [
      "Analyse des besoins spécifiques",
      "Planning nutrition pré/post entraînement",
      "Supplémentation adaptée",
      "Optimisation de la récupération"
    ],
    included: ["Évaluation sportive", "Plan nutrition sportif", "Guide complémentation", "Suivi mensuel"],
    popular: true,
    tags: ["Sport", "Performance", "Récupération"]
  },
  {
    id: 5,
    libelle: "Atelier Cuisine Santé (Groupe)",
    description: "Atelier pratique pour apprendre à préparer des repas équilibrés, savoureux et bons pour la santé.",
    price: 75,
    duration: "2h",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Atelier" },
    benefits: "Compétences culinaires, recettes santé, autonomie",
    nutritionist: {
      name: "Clara Simon",
      specialty: "Chef nutritionniste",
      experience: "7 ans d'expérience",
      rating: 4.7,
      reviews: 132,
      languages: ["Français", "Italien"],
      availability: "Mer-Dim, 10h-19h",
      certifications: ["Diplôme cuisine", "Certification nutrition"]
    },
    features: [
      "Démonstration en direct",
      "Participation pratique",
      "Techniques culinaires saines",
      "Dégustation des préparations"
    ],
    included: ["Matériel fourni", "Livre de recettes", "Dégustation", "Support PDF"],
    popular: false,
    tags: ["Pratique", "Groupe", "Culinaire"]
  },
  {
    id: 6,
    libelle: "Nutrition Prénatale & Postnatale",
    description: "Accompagnement nutritionnel spécifique pour les femmes enceintes et jeunes mamans.",
    price: 80,
    duration: "1h",
    images: ["https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Spécialisé" },
    benefits: "Santé mère-enfant, allaitement, récupération",
    nutritionist: {
      name: "Laura Moreau",
      specialty: "Nutrition périnatale",
      experience: "9 ans d'expérience",
      rating: 4.8,
      reviews: 176,
      languages: ["Français"],
      availability: "Lun-Sam, 9h-18h",
      certifications: ["Spécialisation périnatale"]
    },
    features: [
      "Suivi grossesse trimestriel",
      "Nutrition pour allaitement",
      "Récupération post-accouchement",
      "Alimentation du nourrisson"
    ],
    included: ["Consultation mensuelle", "Guide nutrition grossesse", "Menu post-accouchement", "Support allaitement"],
    popular: true,
    tags: ["Grossesse", "Allaitement", "Famille"]
  },
  {
    id: 7,
    libelle: "Régime Anti-inflammatoire",
    description: "Programme alimentaire pour réduire l'inflammation chronique et améliorer la santé globale.",
    price: 95,
    duration: "1h15",
    images: ["https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Santé" },
    benefits: "Réduction inflammation, énergie, bien-être",
    nutritionist: {
      name: "Dr. Marc Bernard",
      specialty: "Nutrition fonctionnelle",
      experience: "15 ans d'expérience",
      rating: 4.9,
      reviews: 234,
      languages: ["Français", "Anglais"],
      availability: "Lun-Ven, 8h-17h",
      certifications: ["Doctorat Nutrition", "Spécialisation inflammation"]
    },
    features: [
      "Test d'inflammation",
      "Plan alimentaire anti-inflammatoire",
      "Supplémentation ciblée",
      "Suivi des marqueurs biologiques"
    ],
    included: ["Analyse complète", "Menu 30 jours", "Guide anti-inflammatoire", "Suivi trimestriel"],
    popular: false,
    tags: ["Santé", "Fonctionnel", "Spécialisé"]
  },
  {
    id: 8,
    libelle: "Transition Végétarienne/Végétalienne",
    description: "Accompagnement pour une transition vers une alimentation végétale équilibrée et nutritive.",
    price: 70,
    duration: "1h",
    images: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Végétal" },
    benefits: "Transition en douceur, équilibre nutritionnel, diversité",
    nutritionist: {
      name: "Julie Chen",
      specialty: "Nutrition végétale",
      experience: "8 ans d'expérience",
      rating: 4.8,
      reviews: 167,
      languages: ["Français", "Chinois"],
      availability: "Mar-Dim, 10h-20h",
      certifications: ["Spécialisation végétale"]
    },
    features: [
      "Plan de transition progressif",
      "Équilibre protéique végétal",
      "Recettes diversifiées",
      "Gestion des carences potentielles"
    ],
    included: ["Guide de transition", "100+ recettes végétales", "Liste de courses", "Suivi à 3 mois"],
    popular: true,
    tags: ["Végétal", "Transition", "Équilibré"]
  },
  {
    id: 9,
    libelle: "Défi 30 Jours Détox & Énergie",
    description: "Programme d'un mois pour purifier votre organisme et réapprendre à manger sainement.",
    price: 200,
    duration: "30 jours",
    images: ["https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    category: { name: "Détox" },
    benefits: "Purification, énergie, habitudes saines",
    nutritionist: {
      name: "Sophie Laurent",
      specialty: "Détox et bien-être",
      experience: "6 ans d'expérience",
      rating: 4.7,
      reviews: 145,
      languages: ["Français"],
      availability: "Lun-Dim, 8h-22h",
      certifications: ["Certification détox"]
    },
    features: [
      "Programme jour par jour",
      "Recettes détoxifiantes",
      "Routines quotidiennes",
      "Groupe de motivation"
    ],
    included: ["Guide quotidien", "Menus complets", "Liste de courses", "Groupe WhatsApp", "Support quotidien"],
    popular: true,
    tags: ["Détox", "Énergie", "30 jours"]
  }
];

// Statistiques globales
const globalStats = {
  totalClients: 1250,
  successRate: 92,
  avgWeightLoss: "4.2kg",
  satisfactionRate: 97,
  avgRating: 4.8,
  consultationsPerMonth: 156
};

// Témoignages clients
const clientTestimonials = [
  {
    id: 1,
    name: "Marie D.",
    service: "Programme Perte de Poids",
    rating: 5,
    comment: "J'ai perdu 8kg en 3 mois sans me sentir privée. Marie est une nutritionniste extraordinaire !",
    results: "-8kg en 12 semaines",
    duration: "Il y a 2 mois",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Thomas L.",
    service: "Nutrition Sportive",
    rating: 5,
    comment: "Ma performance a augmenté de 30% depuis que je suis le programme. Un accompagnement parfait !",
    results: "+30% performance",
    duration: "Il y a 3 semaines",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 3,
    name: "Sophie M.",
    service: "Transition Végétalienne",
    rating: 4,
    comment: "Transition réussie grâce à Julie. Je me sens mieux dans mon corps et ma conscience.",
    results: "Transition réussie",
    duration: "Il y a 1 mois",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
];

// Nutritionnistes experts
const expertNutritionists = [
  {
    id: 1,
    name: "Dr. Sophie Martin",
    specialty: "Diététicienne-nutritionniste",
    experience: "10 ans",
    rating: 4.9,
    clients: 450,
    image: "https://i.pravatar.cc/150?img=5",
    specialties: ["Perte de poids", "Nutrition sportive", "Troubles alimentaires"]
  },
  {
    id: 2,
    name: "Thomas Leroy",
    specialty: "Coach nutritionnel certifié",
    experience: "6 ans",
    rating: 4.8,
    clients: 280,
    image: "https://i.pravatar.cc/150?img=6",
    specialties: ["Motivation", "Habitudes alimentaires", "Nutrition pratique"]
  },
  {
    id: 3,
    name: "Marie Dubois",
    specialty: "Spécialiste perte de poids",
    experience: "8 ans",
    rating: 4.9,
    clients: 320,
    image: "https://i.pravatar.cc/150?img=7",
    specialties: ["Obésité", "Rééducation alimentaire", "Comportement alimentaire"]
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

// Composant Statistique amélioré
const StatCard = ({ icon: Icon, value, label, description, color = "logo" }) => (
  <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border hover:shadow-xl transition-all duration-300">
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

// Composant Expert Nutritionniste
const ExpertCard = ({ expert }) => (
  <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border hover:shadow-xl transition-all duration-300">
    <div className="flex items-start gap-4">
      <img src={expert.image} alt={expert.name} className="w-16 h-16 rounded-full object-cover" />
      <div className="flex-1">
        <h4 className="font-bold text-lg text-gray-800 dark:text-foreground">{expert.name}</h4>
        <p className="text-sm text-gray-600 dark:text-muted-foreground">{expert.specialty}</p>
        <div className="flex items-center mt-2">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">{expert.rating}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({expert.clients} clients)</span>
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-separator dark:border-border">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Spécialités :</p>
      <div className="flex flex-wrap gap-2">
        {expert.specialties.map((spec, idx) => (
          <span key={idx} className="text-xs bg-logo/10 text-logo px-3 py-1 rounded-full">
            {spec}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Composant Témoignage Client
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border">
    <div className="flex items-start gap-4 mb-4">
      <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-gray-800 dark:text-foreground">{testimonial.name}</div>
            <div className="text-sm text-gray-500 dark:text-muted-foreground">{testimonial.service}</div>
          </div>
          <div className="flex items-center bg-logo/10 text-logo px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span className="font-bold">{testimonial.rating}</span>
          </div>
        </div>
      </div>
    </div>
    <p className="text-gray-600 dark:text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
    <div className="flex justify-between items-center text-sm">
      <div className="text-gray-700 dark:text-gray-300 font-medium">{testimonial.results}</div>
      <div className="text-gray-400 dark:text-gray-500">{testimonial.duration}</div>
    </div>
  </div>
);

// Composant formulaire de rendez-vous amélioré
const AppointmentForm = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
    objectives: [],
    dietaryRestrictions: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const { trackBienEtreServiceBook } = useBienEtreTracking();

  // Objectifs possibles
  const objectivesList = [
    "Perte de poids",
    "Prise de masse musculaire",
    "Meilleure énergie",
    "Gestion maladie chronique",
    "Performance sportive",
    "Transition alimentaire",
    "Grossesse/allaitement",
    "Détoxification"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        objectives: checked 
          ? [...prev.objectives, value]
          : prev.objectives.filter(obj => obj !== value)
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
      
      // Simulation d'envoi
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
        objectives: [],
        dietaryRestrictions: ""
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
              {service?.nutritionist && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-logo/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-logo" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{service.nutritionist.name}</p>
                      <p className="text-sm text-gray-600">{service.nutritionist.specialty}</p>
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
                  Vos objectifs principaux *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {objectivesList.map((objective) => (
                    <label key={objective} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="objectives"
                        value={objective}
                        checked={formData.objectives.includes(objective)}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-5 w-5 rounded border-gray-300 text-logo focus:ring-logo"
                      />
                      <span className="text-gray-700">{objective}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3 text-left">
                  Restrictions alimentaires / Allergies
                </label>
                <textarea
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  rows={3}
                  disabled={isLoading}
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200 resize-none"
                  placeholder="Allergies, intolérances, régimes spécifiques..."
                />
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

// Composant de carte de service nutrition amélioré
const NutritionCard = ({ service, index, onOpenModal }) => {
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
              <div className="text-sm text-gray-500 dark:text-muted-foreground">{service.nutritionist.specialty}</div>
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

const Nutrition = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Consultation');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { trackBienEtreView, trackBienEtreTabChange, trackBienEtreSearch } = useBienEtreTracking();

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
      // Simulation de délai API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filtrage par catégorie
      const filteredServices = simulatedNutritionServices.filter(service => 
        activeTab === 'Consultation' 
          ? service.category.name === 'Consultation' || service.category.name === 'Suivi'
          : service.category.name === activeTab
      );
      
      setServices(filteredServices);
      
    } catch (error) {
      console.error('Erreur simulation:', error);
      const filteredServices = simulatedNutritionServices.filter(service => 
        activeTab === 'Consultation' 
          ? service.category.name === 'Consultation' || service.category.name === 'Suivi'
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
    service.nutritionist?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tabs = [
    {
      id: 'Consultation',
      label: 'Consultations',
      icon: <Apple className="w-5 h-5" />,
      description: 'Bilans et suivis individuels'
    },
    {
      id: 'Programme',
      label: 'Programmes',
      icon: <Scale className="w-5 h-5" />,
      description: 'Accompagnements long terme'
    },
    {
      id: 'Sport',
      label: 'Sport',
      icon: <Zap className="w-5 h-5" />,
      description: 'Performance et récupération'
    },
    {
      id: 'Atelier',
      label: 'Ateliers',
      icon: <Utensils className="w-5 h-5" />,
      description: 'Apprentissage pratique'
    },
    {
      id: 'Spécialisé',
      label: 'Spécialités',
      icon: <Heart className="w-5 h-5" />,
      description: 'Besoins spécifiques'
    }
  ];

  const stats = [
    {
      icon: Users,
      value: globalStats.totalClients.toLocaleString(),
      label: "Clients accompagnés",
      description: "Depuis notre création",
      color: "logo"
    },
    {
      icon: TrendingUp,
      value: globalStats.successRate + "%",
      label: "Taux de réussite",
      description: "Objectifs atteints",
      color: "primary-dark"
    },
    {
      icon: Target,
      value: globalStats.avgWeightLoss,
      label: "Perte de poids moyenne",
      description: "En 3 mois",
      color: "logo"
    },
    {
      icon: Star,
      value: globalStats.avgRating,
      label: "Satisfaction moyenne",
      description: "Basé sur 500+ avis",
      color: "primary-dark"
    }
  ];

  const successStories = [
    {
      name: "Marc D.",
      story: "Perte de 12kg en 4 mois",
      details: "Retrouvé énergie et confiance"
    },
    {
      name: "Julie T.",
      story: "Performance +40%",
      details: "Marathon en 3h20"
    },
    {
      name: "Pauline M.",
      story: "Transition végétale réussie",
      details: "2 ans sans carences"
    }
  ];

  return (
    <div className="font-sans text-foreground min-h-screen bg-light-bg dark:bg-background">

      {/* HERO */}
      <section
        className="relative h-80 py-20 lg:py-32 text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(85, 107, 47, 0.8), rgba(107, 142, 35, 0.6)), url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-logo/20 to-primary-dark/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <SlideIn direction="up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight" style={{ color: '#8B4513' }}>
              Nutrition & Diététique
            </h1>
          </SlideIn>
          <SlideIn direction="up" delay={200}>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed px-4 mb-8">
              Transformez votre alimentation, boostez votre santé. Un accompagnement personnalisé pour des résultats durables.
            </p>
          </SlideIn>
          
          {/* Badges d'expertise */}
          <SlideIn direction="up" delay={400}>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full">
                <Award className="w-4 h-4 text-white" />
                <span className="text-sm text-white">Diététiciens diplômés</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-sm text-white">Approche scientifique</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full">
                <CheckCircle className="w-4 h-4 text-white" />
                <span className="text-sm text-white">97% de satisfaction</span>
              </div>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* STATISTIQUES */}
      <SlideIn direction="up">
        <div className="container mx-auto px-4 -mt-10 relative z-20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="transform hover:-translate-y-2 transition-transform duration-300">
                <StatCard {...stat} />
              </div>
            ))}
          </div>
        </div>
      </SlideIn>

      {/* CONTAINER AVEC TABULATION */}
      <div className="bg-gray-50 dark:bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Menu de tabulation amélioré */}
          <SlideIn direction="down">
            <LayoutGroup>
              <div className="bg-white dark:bg-card rounded-3xl shadow-lg px-4 py-6 mb-8 w-full mx-auto border border-separator dark:border-gray-700/40">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="lg:w-1/3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher un service, un nutritionniste..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full px-6 py-4 pl-12 border border-separator rounded-2xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                      />
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
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
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-separator dark:border-gray-700/60'
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
                  <div className="mb-12">
                    <h2 className="text-2xl lg:text-3xl mb-4 font-bold" style={{ color: '#8B4513' }}>
                      {activeTab === 'Consultation' && 'Consultations Nutritionnelles'}
                      {activeTab === 'Programme' && 'Programmes Complets'}
                      {activeTab === 'Sport' && 'Nutrition Sportive'}
                      {activeTab === 'Atelier' && 'Ateliers Pratiques'}
                      {activeTab === 'Spécialisé' && 'Nutrition Spécialisée'}
                    </h2>
                    
                    <p className="text-gray-700 dark:text-muted-foreground mb-8 text-base lg:text-md leading-relaxed max-w-3xl">
                      {activeTab === 'Consultation' && 'Des consultations individuelles pour un bilan complet et un suivi personnalisé. Analyse de vos habitudes, définition d\'objectifs et création d\'un plan adapté à votre mode de vie.'}
                      {activeTab === 'Programme' && 'Des programmes structurés pour des transformations durables. Accompagnement sur plusieurs mois avec suivi régulier, ajustements et support continu.'}
                      {activeTab === 'Sport' && 'Optimisez vos performances et votre récupération. Des plans nutritionnels adaptés à votre sport, vos objectifs et votre planning d\'entraînement.'}
                      {activeTab === 'Atelier' && 'Apprenez par la pratique ! Ateliers en petit groupe pour maîtriser les bases d\'une alimentation saine et équilibrée au quotidien.'}
                      {activeTab === 'Spécialisé' && 'Des solutions adaptées aux besoins spécifiques : grossesse, allaitement, troubles digestifs, maladies chroniques, etc.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service, index) => (
                          <SlideIn key={service.id || index} direction="up" delay={index * 100}>
                            <NutritionCard
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
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* TÉMOIGNAGES */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Ils ont transformé leur santé</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {clientTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* NOS EXPERTS */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Nos nutritionnistes experts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {expertNutritionists.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          </div>

          {/* HISTOIRES DE RÉUSSITE */}
          <div className="bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-3xl p-8 border border-logo/20 mb-12">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Histoires de réussite</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <div key={index} className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-separator dark:border-border">
                  <div className="text-4xl font-bold text-logo mb-2">{story.story}</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-foreground mb-1">{story.name}</div>
                  <div className="text-gray-600 dark:text-muted-foreground">{story.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* POURQUOI NOUS CHOISIR */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-separator dark:border-gray-700/40">
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

            <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-8 border border-separator dark:border-gray-700/40">
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

export default Nutrition;