import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle, Shield, Target, Users, TrendingUp, CheckCircle,
  FileText, Award, Lightbulb, BarChart, Handshake, Zap,
  ArrowRight, Search, Filter, Clock, Star, MapPin, Phone, Mail,
  Calendar, ChevronRight, Users2, Building2, Scale, Brain, Rocket,
  GraduationCap, Globe, Target as TargetIcon, Shield as ShieldIcon,
  Award as AwardIcon, ThumbsUp, X, Send, AlertCircle, User, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { conseilService } from "@/services/conseilService";

// Palette de couleurs basée sur vos spécifications
const colors = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFF0",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  primaryLight: "#8FBC8F",
  secondaryLight: "#A0522D",
  cardBg: "#FFFFFF",
  textPrimary: "#2C3E50",
  textSecondary: "#5D6D7E",
  success: "#27AE60",
  warning: "#F39C12",
  error: "#E74C3C",
  accentGold: "#D4AF37",
};

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const cardHoverVariants = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
};

// Types de conseil
interface ConseilType {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  details: string[];
  duration: string;
  price: string;
  category: 'audit' | 'mediation' | 'strategie' | 'juridique' | 'finance';
  featured?: boolean;
  popular?: boolean;
}

// Conseillers experts
interface Conseiller {
  id: number;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  rating: number;
  avatarColor: string;
  disponibilite: 'disponible' | 'limitee' | 'complet';
  projets: number;
  certifications: string[];
}

// Témoignages
interface Temoignage {
  id: number;
  name: string;
  entreprise: string;
  texte: string;
  rating: number;
  date: string;
  avatarColor: string;
  resultat: string;
}

const ConseilPage = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConseiller, setSelectedConseiller] = useState<Conseiller | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("tous");
  const [showMoreProcess, setShowMoreProcess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    entreprise: "",
    besoin: "",
    conseilType: "",
    budget: "",
    message: "",
    expertId: null
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("auth-token");
    setIsAuthenticated(!!token);
    
    if (token) {
      try {
        const response = await conseilService.getUserInfo();
        if (response.success && response.data) {
          setUserInfo(response.data);
          
          // Pré-remplir le formulaire avec les infos utilisateur
          setFormData(prev => ({
            ...prev,
            nom: `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim(),
            email: response.data.email || '',
            telephone: response.data.phone || '',
            entreprise: response.data.companyName || response.data.commercialName || ''
          }));
        }
      } catch (error) {
        console.error('Erreur chargement infos utilisateur:', error);
      }
    }
  };

  // Statistiques avec animations
  const stats = [
    { value: "98%", label: "Satisfaction client", icon: ThumbsUp, color: colors.success },
    { value: "500+", label: "Projets conseillés", icon: Target, color: colors.primaryDark },
    { value: "15", label: "Années d'expertise", icon: Award, color: colors.secondaryText },
    { value: "24h", label: "Réponse garantie", icon: Clock, color: colors.accentGold },
  ];

  // Types de conseil disponibles (données par défaut)
  const conseilTypes: ConseilType[] = [
    {
      id: 1,
      title: "Audit Stratégique",
      description: "Analyse approfondie de votre situation et recommandations stratégiques",
      icon: BarChart,
      color: colors.primaryDark,
      details: [
        "Analyse SWOT complète",
        "Benchmark concurrentiel",
        "Diagnostic organisationnel",
        "Recommandations stratégiques",
        "Plan d'action détaillé"
      ],
      duration: "2-4 semaines",
      price: "À partir de 2 500€",
      category: 'audit',
      featured: true,
      popular: true
    },
    {
      id: 2,
      title: "Médiation & Résolution",
      description: "Résolution amiable des conflits internes et externes",
      icon: Handshake,
      color: colors.success,
      details: [
        "Médiation commerciale",
        "Résolution de conflits internes",
        "Négociation stratégique",
        "Accords de partenariat",
        "Prévention des litiges"
      ],
      duration: "1-3 semaines",
      price: "À partir de 1 800€",
      category: 'mediation'
    },
    {
      id: 3,
      title: "Conseil en Stratégie",
      description: "Développement et optimisation de votre stratégie d'entreprise",
      icon: TargetIcon,
      color: colors.secondaryText,
      details: [
        "Définition de vision",
        "Plan stratégique sur 3-5 ans",
        "Allocation des ressources",
        "Suivi des indicateurs",
        "Ajustements stratégiques"
      ],
      duration: "3-6 semaines",
      price: "À partir de 3 500€",
      category: 'strategie'
    },
    {
      id: 4,
      title: "Conseil Juridique",
      description: "Expertise juridique pour vos décisions stratégiques",
      icon: Scale,
      color: colors.textPrimary,
      details: [
        "Analyse des risques juridiques",
        "Conformité réglementaire",
        "Contrats et accords",
        "Protection de la propriété intellectuelle",
        "Accompagnement juridique"
      ],
      duration: "Sur mesure",
      price: "À partir de 300€/heure",
      category: 'juridique'
    },
    {
      id: 5,
      title: "Conseil Financier",
      description: "Optimisation financière et gestion des risques",
      icon: TrendingUp,
      color: colors.accentGold,
      details: [
        "Analyse financière approfondie",
        "Optimisation des coûts",
        "Gestion des risques financiers",
        "Plan de financement",
        "Tableaux de bord financiers"
      ],
      duration: "2-4 semaines",
      price: "À partir de 2 000€",
      category: 'finance',
      featured: true
    },
    {
      id: 6,
      title: "Transformation Digitale",
      description: "Accompagnement dans votre transformation numérique",
      icon: Rocket,
      color: colors.warning,
      details: [
        "Audit digital",
        "Stratégie de transformation",
        "Sélection des technologies",
        "Plan de mise en œuvre",
        "Formation des équipes"
      ],
      duration: "4-8 semaines",
      price: "À partir de 4 000€",
      category: 'strategie'
    }
  ];

  // Conseillers experts (données par défaut)
  const conseillers: Conseiller[] = [
    {
      id: 1,
      name: "Dr. Sophie Laurent",
      title: "Experte en Audit Stratégique",
      specialty: "Stratégie d'entreprise & Organisation",
      experience: "20 ans d'expérience",
      rating: 4.9,
      avatarColor: "#6B8E23",
      disponibilite: 'disponible',
      projets: 156,
      certifications: ["MBA HEC", "Certified Management Consultant", "Six Sigma Black Belt"]
    },
    {
      id: 2,
      name: "Pierre Martin",
      title: "Spécialiste en Médiation",
      specialty: "Résolution de conflits & Négociation",
      experience: "15 ans d'expérience",
      rating: 4.8,
      avatarColor: "#8B4513",
      disponibilite: 'limitee',
      projets: 89,
      certifications: ["Médiateur certifié CNMA", "Expert en négociation Harvard", "Praticien PNL"]
    },
    {
      id: 3,
      name: "Marie Dubois",
      title: "Conseillère Financière Senior",
      specialty: "Optimisation financière & Risk Management",
      experience: "18 ans d'expérience",
      rating: 4.9,
      avatarColor: "#556B2F",
      disponibilite: 'disponible',
      projets: 127,
      certifications: ["CFA Charterholder", "Expert-comptable", "Risk Manager certifié"]
    },
    {
      id: 4,
      name: "Thomas Leroy",
      title: "Expert Juridique & Compliance",
      specialty: "Droit des affaires & Conformité",
      experience: "12 ans d'expérience",
      rating: 4.7,
      avatarColor: "#2C3E50",
      disponibilite: 'disponible',
      projets: 94,
      certifications: ["Avocat au Barreau de Paris", "Data Protection Officer", "Compliance Officer"]
    }
  ];

  // Témoignages
  const temoignages: Temoignage[] = [
    {
      id: 1,
      name: "Julie Moreau",
      entreprise: "TechStart Solutions",
      texte: "L'audit stratégique réalisé par l'équipe a été déterminant pour notre repositionnement sur le marché. Les recommandations étaient précises et actionnables.",
      rating: 5,
      date: "15 Jan 2024",
      avatarColor: "#6B8E23",
      resultat: "+150% croissance en 12 mois"
    },
    {
      id: 2,
      name: "Marc Lefebvre",
      entreprise: "Manufacturing Corp",
      texte: "La médiation a permis de résoudre un conflit interne qui durait depuis des mois. Professionnalisme et discrétion remarquables.",
      rating: 5,
      date: "22 Nov 2023",
      avatarColor: "#8B4513",
      resultat: "Conflit résolu en 3 semaines"
    },
    {
      id: 3,
      name: "Sarah Chen",
      entreprise: "Green Innovations",
      texte: "Le conseil en transformation digitale nous a permis d'optimiser nos processus et d'améliorer notre efficacité opérationnelle de 40%.",
      rating: 5,
      date: "5 Oct 2023",
      avatarColor: "#556B2F",
      resultat: "40% gain d'efficacité"
    }
  ];

  // Processus de conseil détaillé
  const processusConseil = [
    {
      step: 1,
      title: "Diagnostic initial",
      description: "Analyse approfondie de votre situation",
      icon: Search,
      color: colors.primaryDark,
      details: ["Entretien découverte", "Analyse documentaire", "Identification des enjeux"]
    },
    {
      step: 2,
      title: "Proposition sur mesure",
      description: "Élaboration d'une approche personnalisée",
      icon: Lightbulb,
      color: colors.success,
      details: ["Recommandations spécifiques", "Planning détaillé", "Budget prévisionnel"]
    },
    {
      step: 3,
      title: "Mise en œuvre",
      description: "Accompagnement dans la réalisation",
      icon: Rocket,
      color: colors.secondaryText,
      details: ["Suivi régulier", "Ajustements en temps réel", "Coordination des équipes"]
    },
    {
      step: 4,
      title: "Suivi & Évaluation",
      description: "Mesure des résultats et capitalisation",
      icon: BarChart,
      color: colors.accentGold,
      details: ["Tableaux de bord", "Reporting détaillé", "Recommandations finales"]
    },
    {
      step: 5,
      title: "Capitalisation",
      description: "Transfert de compétences et autonomisation",
      icon: GraduationCap,
      color: colors.primaryLight,
      details: ["Formation des équipes", "Documentation complète", "Support post-projet"]
    },
    {
      step: 6,
      title: "Partenariat durable",
      description: "Suivi à long terme et évolution",
      icon: Handshake,
      color: colors.secondaryLight,
      details: ["Revues trimestrielles", "Adaptation aux changements", "Optimisation continue"]
    }
  ];

  // Processus affiché (limité à 4 ou 6 selon l'état)
  const displayedProcessus = showMoreProcess ? processusConseil : processusConseil.slice(0, 4);

  // Avantages
  const avantages = [
    {
      title: "Expertise certifiée",
      description: "Nos conseillers sont certifiés et possèdent une expertise avérée",
      icon: ShieldIcon,
      color: colors.primaryDark
    },
    {
      title: "Approche sur mesure",
      description: "Chaque mission est adaptée à vos besoins spécifiques",
      icon: TargetIcon,
      color: colors.success
    },
    {
      title: "Confidentialité absolue",
      description: "Discrétion garantie dans toutes nos interventions",
      icon: Shield,
      color: colors.secondaryText
    },
    {
      title: "Résultats mesurables",
      description: "Des objectifs clairs avec des indicateurs de performance",
      icon: TrendingUp,
      color: colors.accentGold
    }
  ];

  // Filtrage
  const filteredTypes = conseilTypes.filter(type =>
    (activeCategory === "tous" || type.category === activeCategory) &&
    (type.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Catégories avec compteurs
  const categories = [
    { value: "tous", label: "Tous les conseils", count: conseilTypes.length, color: colors.primaryDark },
    { value: "audit", label: "Audit", count: conseilTypes.filter(t => t.category === 'audit').length, color: colors.primaryDark },
    { value: "mediation", label: "Médiation", count: conseilTypes.filter(t => t.category === 'mediation').length, color: colors.success },
    { value: "strategie", label: "Stratégie", count: conseilTypes.filter(t => t.category === 'strategie').length, color: colors.secondaryText },
    { value: "juridique", label: "Juridique", count: conseilTypes.filter(t => t.category === 'juridique').length, color: colors.textPrimary },
    { value: "finance", label: "Financier", count: conseilTypes.filter(t => t.category === 'finance').length, color: colors.accentGold }
  ];

  const handleTypeSelect = (type: ConseilType) => {
    setSelectedType(type.id);
    setFormData(prev => ({
      ...prev,
      conseilType: type.title,
      message: `Bonjour, je suis intéressé par votre conseil "${type.title}".\n\n${type.description}\n\nMes besoins spécifiques : `
    }));
  };

  const handleConseillerSelect = (conseiller: Conseiller) => {
    setSelectedConseiller(conseiller);
    setFormData(prev => ({
      ...prev,
      message: `Bonjour ${conseiller.name},\n\nJe souhaiterais prendre rendez-vous pour discuter de votre expertise en "${conseiller.specialty}".`,
      expertId: conseiller.id
    }));
    setShowContactModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Valider les champs requis
      if (!formData.nom || !formData.email || !formData.besoin || !formData.conseilType) {
        toast.error("Veuillez remplir tous les champs obligatoires", {
          description: "Nom, email, type de conseil et besoin sont requis"
        });
        setIsLoading(false);
        return;
      }

      // Préparer les données pour l'API
      const demandeData = {
        conseilType: formData.conseilType,
        besoin: formData.besoin,
        budget: formData.budget || "surdevis",
        message: formData.message || "",
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        entreprise: formData.entreprise,
        expertId: formData.expertId
      };

      // Envoyer la demande via l'API
      const response = await conseilService.sendDemandeConseil(demandeData);

      if (response.success) {
        // Réinitialiser le formulaire
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          entreprise: "",
          besoin: "",
          conseilType: "",
          budget: "",
          message: "",
          expertId: null
        });
        
        setSelectedConseiller(null);
        setShowContactModal(false);
        
        toast.success("Demande envoyée avec succès !", {
          description: response.message || "Un expert vous contactera dans les 24 heures."
        });

        // Rediriger vers la page des demandes si connecté
        if (isAuthenticated) {
          setTimeout(() => {
            // Pour React, on peut utiliser window.location ou un router client-side
            window.location.href = '/conseil';
          }, 2000);
        }
      } else {
        throw new Error(response.error || "Erreur lors de l'envoi");
      }
    } catch (error: any) {
      console.error('Erreur envoi demande:', error);
      
      if (error.message?.includes('Non authentifié') || error.response?.status === 401) {
        toast.error("Connexion requise", {
          description: "Veuillez vous connecter pour envoyer une demande de conseil",
          action: {
            label: "Se connecter",
            onClick: () => {
              window.location.href = '/login?redirect=/conseil';
            }
          }
        });
      } else {
        toast.error("Erreur lors de l'envoi", {
          description: error.message || "Une erreur est survenue. Veuillez réessayer."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenContactModal = () => {
    if (!isAuthenticated) {
      toast.info("Connexion recommandée", {
        description: "Pour un meilleur suivi, nous vous recommandons de vous connecter",
        action: {
          label: "Se connecter",
          onClick: () => {
            window.location.href = '/login?redirect=/conseil';
          }
        },
        duration: 5000
      });
    }
    setShowContactModal(true);
  };

  // Fonction pour gérer la navigation
  const navigateToLogin = () => {
    setShowContactModal(false);
    window.location.href = '/login?redirect=/conseil';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg')",
          }}
        />
        {/* Badge */}
        <div className="absolute bottom-0 left-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
      bg-white/10 backdrop-blur-md border border-white/20 mb-6">
          <span className="text-xs font-medium">Expertise en Audit & Stratégie</span>
        </div>
        {/* Content wrapper */}
        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">


          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Conseil <span className="text-secondary-text">Expert</span>
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-sm mb-10">
            Des experts en audit stratégique et résolution de conflits
            pour accompagner votre entreprise vers l'excellence.
          </p>

          {/* Stats with glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: "150+", label: "Audits réalisés" },
              { value: "98%", label: "Clients satisfaits" },
              { value: "12 ans", label: "d'expertise" },
              { value: "300+", label: "Conseils délivrés" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10"
              >
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-slate-300">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              className="px-6 py-2.5 rounded-xl bg-logo hover:bg-logo/80 font-semibold text-sm"
              onClick={() => document.getElementById('types-conseil')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Découvrir nos conseils
            </button>
            <button 
              className="px-6 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm"
              onClick={handleOpenContactModal}
            >
              Demander un conseil
            </button>
          </div>
        </div>
      </section>

      {/* Section Notre Processus améliorée */}
      <motion.section
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.primaryDark }}>
            Notre <span style={{ color: colors.secondaryText }}>Processus</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Une méthodologie éprouvée pour des résultats concrets et mesurables
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProcessus.map((etape) => (
            <motion.div
              key={etape.step}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card className="p-6 h-full rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: colors.cardBg }}>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${etape.color}15`,
                        border: `2px solid ${etape.color}`
                      }}>
                      <etape.icon className="h-6 w-6" style={{ color: etape.color }} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: etape.color }}>
                      {etape.step}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                      {etape.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                      {etape.description}
                    </p>
                    <ul className="space-y-1">
                      {etape.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-xs"
                          style={{ color: colors.textSecondary }}>
                          <CheckCircle className="h-3 w-3 mr-2" style={{ color: etape.color }} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {processusConseil.length > 4 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="rounded-xl px-6 py-3 font-medium transition-all duration-300"
              style={{
                borderColor: colors.primaryDark,
                color: colors.primaryDark,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => setShowMoreProcess(!showMoreProcess)}
            >
              {showMoreProcess ? (
                <>
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Voir moins
                </>
              ) : (
                <>
                  Voir les {processusConseil.length - 4} étapes supplémentaires
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.section>

      {/* Section Types de Conseil améliorée */}
      <motion.section
        className="container mx-auto px-4 py-1"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        id="types-conseil"
        style={{ backgroundColor: `${colors.primaryDark}03` }}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.primaryDark }}>
            Nos <span style={{ color: colors.secondaryText }}>Domaines d'Expertise</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: colors.textSecondary }}>
            Des solutions de conseil sur mesure pour chaque besoin spécifique
          </p>

          {/* Barre de recherche améliorée */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative mb-6">
              <Input
                placeholder="Rechercher un type de conseil..."
                className="pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300"
                style={{
                  borderColor: colors.separator,
                  backgroundColor: colors.cardBg,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primaryDark;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primaryDark}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.separator;
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                }}
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5" style={{ color: colors.textSecondary }} />
            </div>

            {/* Filtres avec compteurs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <motion.div key={category.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={activeCategory === category.value ? "default" : "outline"}
                    className="rounded-xl font-semibold px-4 py-2 transition-all duration-300 relative"
                    style={activeCategory === category.value ? {
                      backgroundColor: category.color,
                      color: colors.lightBg,
                      borderColor: category.color,
                      boxShadow: `0 4px 15px ${category.color}40`
                    } : {
                      borderColor: colors.separator,
                      color: colors.textPrimary,
                      backgroundColor: colors.cardBg,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}
                    onClick={() => setActiveCategory(category.value)}
                  >
                    {category.label}
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full"
                      style={activeCategory === category.value ? {
                        backgroundColor: colors.lightBg + '20',
                        color: colors.lightBg
                      } : {
                        backgroundColor: colors.separator + '40',
                        color: colors.textSecondary
                      }}>
                      {category.count}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grille des conseils améliorée */}
        {filteredTypes.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
            variants={containerVariants}
          >
            {filteredTypes.map((type) => (
              <motion.div
                key={type.id}
                variants={itemVariants}
                whileHover="hover"
                initial="initial"
                onClick={() => handleTypeSelect(type)}
                className="relative"
              >
                {type.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: type.color }}>
                      Recommandé
                    </div>
                  </div>
                )}

                <motion.div variants={cardHoverVariants} className="h-full">
                  <Card className={`p-6 h-full rounded-2xl cursor-pointer transition-all duration-500 group relative overflow-hidden ${selectedType === type.id ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{
                      borderColor: selectedType === type.id ? type.color : colors.separator,
                      backgroundColor: colors.cardBg,
                      borderWidth: selectedType === type.id ? '2px' : '1px',
                      boxShadow: selectedType === type.id ? `0 10px 30px ${type.color}30` : '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                  >
                    {/* Effet de fond au hover */}
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${type.color}20 0%, transparent 50%)`
                      }}
                    />

                    <div className="relative z-10">
                      <div className={`w-14 h-14 mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedType === type.id ? 'scale-110' : ''
                        }`}
                        style={{
                          backgroundColor: selectedType === type.id
                            ? type.color
                            : `${type.color}15`,
                          boxShadow: selectedType === type.id
                            ? `0 8px 20px ${type.color}40`
                            : '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        <type.icon
                          className={`h-6 w-6 transition-all duration-300 ${selectedType === type.id ? 'scale-110' : ''
                            }`}
                          style={{
                            color: selectedType === type.id
                              ? colors.lightBg
                              : type.color
                          }}
                        />
                      </div>

                      <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                        {type.title}
                      </h3>

                      <p className="leading-relaxed mb-4 text-sm" style={{ color: colors.textSecondary }}>
                        {type.description}
                      </p>

                      <div className="mb-4">
                        <ul className="space-y-2">
                          {type.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-2 group/item">
                              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover/item:scale-110"
                                style={{ color: type.color }} />
                              <span className="text-xs transition-colors duration-300 group-hover/item:text-gray-800"
                                style={{ color: colors.textSecondary }}>
                                {detail}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" style={{ color: colors.textSecondary }} />
                          <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                            {type.duration}
                          </span>
                        </div>
                        <div className="text-sm font-bold" style={{ color: type.color }}>
                          {type.price}
                        </div>
                      </div>

                      <Button
                        className="w-full font-semibold rounded-xl gap-2 py-3 border-2 transition-all duration-300 text-sm relative overflow-hidden group/btn"
                        variant={selectedType === type.id ? "default" : "outline"}
                        style={selectedType === type.id ? {
                          backgroundColor: type.color,
                          color: colors.lightBg,
                          borderColor: type.color
                        } : {
                          borderColor: type.color,
                          color: type.color,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedType !== type.id) {
                            e.currentTarget.style.backgroundColor = `${type.color}15`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedType !== type.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        onClick={() => handleTypeSelect(type)}
                      >
                        <span className="relative z-10">
                          {selectedType === type.id ? "✓ Sélectionné" : "Choisir ce conseil"}
                        </span>
                        <ChevronRight className="h-3 w-3 relative z-10" />
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${colors.separator}30`,
                border: `2px dashed ${colors.separator}`
              }}>
              <Search className="h-12 w-12" style={{ color: colors.textSecondary }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Aucun conseil trouvé
            </h3>
            <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
              Essayez avec d'autres critères de recherche
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("tous");
              }}
              style={{
                borderColor: colors.primaryDark,
                color: colors.primaryDark
              }}
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}

        {/* Statistiques de résultats */}
        {filteredTypes.length > 0 && (
          <motion.div
            className="mt-12 p-6 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              backgroundColor: `${colors.primaryDark}08`,
              border: `1px solid ${colors.separator}`
            }}
          >
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              <span className="font-bold" style={{ color: colors.primaryDark }}>
                {filteredTypes.length} conseil{filteredTypes.length > 1 ? 's' : ''}
              </span> trouvé{filteredTypes.length > 1 ? 's' : ''} correspondant à vos critères
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Section Nos Experts */}
      <motion.section
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Nos <span style={{ color: colors.secondaryText }}>Experts Conseil</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Rencontrez notre équipe d'experts certifiés et expérimentés
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {conseillers.map((conseiller) => (
            <motion.div
              key={conseiller.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="relative"
            >
              <Card className="p-6 rounded-2xl text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                style={{ backgroundColor: colors.cardBg }}>

                {/* Badge disponibilité avec animation */}
                <motion.div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10 ${conseiller.disponibilite === 'disponible' ? 'bg-green-100 text-green-800 border border-green-200' :
                      conseiller.disponibilite === 'limitee' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  animate={conseiller.disponibilite === 'disponible' ? {
                    scale: [1, 1.05, 1],
                    boxShadow: ['0 0 0 rgba(34, 197, 94, 0)', '0 0 0 3px rgba(34, 197, 94, 0.3)', '0 0 0 rgba(34, 197, 94, 0)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {conseiller.disponibilite === 'disponible' ? 'Disponible' :
                    conseiller.disponibilite === 'limitee' ? 'Limité' : 'Complet'}
                </motion.div>

                <motion.div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-xl font-bold relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundColor: conseiller.avatarColor,
                    boxShadow: `0 8px 25px ${conseiller.avatarColor}40`
                  }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {conseiller.name.split(' ').map(n => n[0]).join('')}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                </motion.div>

                <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                  {conseiller.name}
                </h3>

                <p className="text-sm mb-3 font-semibold" style={{ color: conseiller.avatarColor }}>
                  {conseiller.title}
                </p>

                <p className="text-sm mb-4 px-2" style={{ color: colors.textSecondary }}>
                  {conseiller.specialty}
                </p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3"
                        style={{
                          color: i < Math.floor(conseiller.rating) ? colors.warning : colors.separator,
                          fill: i < Math.floor(conseiller.rating) ? colors.warning : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                    {conseiller.rating}
                  </span>
                </div>

                <div className="flex justify-center items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                      {conseiller.projets}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Projets
                    </div>
                  </div>
                  <div className="h-8 w-px" style={{ backgroundColor: colors.separator }}></div>
                  <div className="text-center">
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {conseiller.experience}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Expérience
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Certifications :
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {conseiller.certifications.slice(0, 2).map((cert, index) => (
                      <motion.span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs cursor-default"
                        style={{
                          backgroundColor: `${conseiller.avatarColor}15`,
                          color: conseiller.avatarColor,
                          border: `1px solid ${conseiller.avatarColor}30`
                        }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {cert}
                      </motion.span>
                    ))}
                    {conseiller.certifications.length > 2 && (
                      <motion.span
                        className="px-2 py-1 rounded-full text-xs cursor-default"
                        style={{
                          backgroundColor: colors.separator,
                          color: colors.textSecondary
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        +{conseiller.certifications.length - 2}
                      </motion.span>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full font-semibold rounded-xl gap-2 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group/contact"
                  style={{
                    backgroundColor: colors.primaryDark,
                    color: colors.lightBg,
                    borderColor: colors.primaryDark
                  }}
                  disabled={conseiller.disponibilite === 'complet'}
                  onClick={() => handleConseillerSelect(conseiller)}
                >
                  <MessageCircle className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">
                    Contacter l'expert
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/contact:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section Avantages */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="rounded-3xl overflow-hidden border-0 relative"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.logo} 100%)`,
            color: colors.lightBg
          }}>
          {/* Effet de particules */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="p-8 lg:p-12 relative z-10">
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                Nos <span style={{ color: colors.accentGold }}>Avantages</span>
              </h2>
              <p className="text-lg max-w-3xl mx-auto text-white/80">
                Ce qui fait la différence dans notre approche du conseil
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {avantages.map((avantage, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-6 rounded-2xl h-full border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group/avantage">
                    <motion.div
                      className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center mx-auto"
                      style={{ backgroundColor: `${avantage.color}30` }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <avantage.icon className="h-7 w-7" style={{ color: avantage.color }} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover/avantage:text-white/90">
                      {avantage.title}
                    </h3>
                    <p className="text-sm text-white/80 group-hover/avantage:text-white/90">
                      {avantage.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Section Témoignages */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.primaryDark }}>
            Ils nous font <span style={{ color: colors.secondaryText }}>Confiance</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: colors.textSecondary }}>
            Découvrez les retours d'expérience de nos clients conseillés
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {temoignages.map((temoignage) => (
            <motion.div
              key={temoignage.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 rounded-2xl h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group/temoignage"
                style={{ backgroundColor: colors.cardBg }}>
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative overflow-hidden"
                    style={{
                      backgroundColor: temoignage.avatarColor,
                      boxShadow: `0 4px 15px ${temoignage.avatarColor}40`
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {temoignage.name.split(' ').map(n => n[0]).join('')}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold" style={{ color: colors.textPrimary }}>{temoignage.name}</h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>{temoignage.entreprise}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star
                        className="h-4 w-4"
                        style={{
                          color: colors.accentGold,
                          fill: colors.accentGold
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                <p className="italic mb-6 leading-relaxed" style={{ color: colors.textSecondary, fontSize: '0.95rem' }}>
                  "{temoignage.texte}"
                </p>

                <motion.div
                  className="mt-4 pt-4 border-t group-hover/temoignage:border-gray-300 transition-colors duration-300"
                  style={{ borderColor: colors.separator }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {temoignage.date}
                    </div>
                    <motion.div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: colors.success, color: colors.lightBg }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {temoignage.resultat}
                    </motion.div>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Statistiques supplémentaires */}
        <motion.div
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: "100%", label: "Clients satisfaits", color: colors.success },
            { value: "2M€", label: "Économies générées", color: colors.accentGold },
            { value: "50+", label: "Secteurs couverts", color: colors.primaryDark },
            { value: "10j", label: "Délai moyen", color: colors.secondaryText },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-xl"
              style={{
                backgroundColor: `${stat.color}08`,
                border: `1px solid ${stat.color}20`
              }}>
              <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Final amélioré */}
      <section className="py-16 relative overflow-hidden"
        style={{
          backgroundColor: colors.lightBg,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(107, 142, 35, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.05) 0%, transparent 50%)'
        }}>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: `${colors.primaryDark}15`,
                border: `1px solid ${colors.primaryDark}30`
              }}>
              <Lightbulb className="h-4 w-4" style={{ color: colors.primaryDark }} />
              <span className="text-sm font-medium" style={{ color: colors.primaryDark }}>
                Conseil personnalisé
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: colors.primaryDark }}>
              Prêt à <span style={{ color: colors.secondaryText }}>optimiser votre entreprise</span> ?
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
              Nos experts en conseil sont à votre disposition pour analyser votre
              situation et vous proposer des solutions sur mesure qui génèrent des résultats concrets.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Button
                  className="rounded-xl px-10 py-5 text-lg font-semibold border-2 transition-all duration-300 relative overflow-hidden group/cta"
                  style={{
                    backgroundColor: colors.primaryDark,
                    color: colors.lightBg,
                    borderColor: colors.primaryDark,
                    boxShadow: `0 8px 25px ${colors.primaryDark}40`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryLight;
                    e.currentTarget.style.borderColor = colors.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                    e.currentTarget.style.borderColor = colors.primaryDark;
                  }}
                  onClick={handleOpenContactModal}
                >
                  <Calendar className="h-5 w-5 mr-3 relative z-10" />
                  <span className="relative z-10">Demander un conseil personnalisé</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Button
                  variant="outline"
                  className="rounded-xl px-10 py-5 text-lg font-semibold border-2 transition-all duration-300 relative overflow-hidden group/outline"
                  style={{
                    borderColor: colors.primaryDark,
                    color: colors.primaryDark,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => document.getElementById('types-conseil')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Lightbulb className="h-5 w-5 mr-3 relative z-10" />
                  <span className="relative z-10">Explorer tous nos conseils</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent translate-x-[-100%] group-hover/outline:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </motion.div>
            </div>

            {/* Infos supplémentaires */}
            <motion.div
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Clock,
                  title: "Réponse sous 24h",
                  description: "Nos experts vous répondent dans les 24 heures ouvrables"
                },
                {
                  icon: Shield,
                  title: "Confidentialité garantie",
                  description: "Toutes nos interventions sont couvertes par des accords de confidentialité"
                },
                {
                  icon: TrendingUp,
                  title: "Résultats mesurables",
                  description: "Suivi des indicateurs de performance pour mesurer l'impact"
                }
              ].map((info, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    backgroundColor: `${colors.primaryDark}05`,
                    border: `1px solid ${colors.separator}`
                  }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.primaryDark}15` }}>
                    <info.icon className="h-5 w-5" style={{ color: colors.primaryDark }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {info.title}
                    </h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modal de Contact amélioré */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay avec animation */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowContactModal(false);
              setSelectedConseiller(null);
            }}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative z-10"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.separator}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête du modal avec info connexion */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                    {selectedConseiller
                      ? `Contacter ${selectedConseiller.name}`
                      : "Demande de conseil"}
                  </h2>
                  {!isAuthenticated && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                      style={{ backgroundColor: `${colors.warning}15`, color: colors.warning }}>
                      <AlertCircle className="h-3 w-3" />
                      <span>Non connecté</span>
                    </div>
                  )}
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Un expert vous répondra sous 24h
                </p>
                
                {/* Lien connexion pour non connectés */}
                {!isAuthenticated && (
                  <div className="mt-2 p-2 rounded-lg text-xs"
                    style={{ backgroundColor: `${colors.primaryDark}08` }}>
                    <p className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                      <User className="h-3 w-3" />
                      <span>Pour un meilleur suivi, </span>
                      <button
                        type="button"
                        className="font-semibold hover:underline focus:outline-none"
                        style={{ color: colors.primaryDark }}
                        onClick={navigateToLogin}
                      >
                        connectez-vous
                      </button>
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowContactModal(false);
                  setSelectedConseiller(null);
                }}
                className="h-10 w-10 p-0 rounded-xl transition-all duration-300 hover:bg-gray-100"
                style={{
                  color: colors.textSecondary
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmitContact} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Nom *
                  </label>
                  <Input
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    disabled={isAuthenticated && userInfo?.firstName}
                    className="w-full rounded-xl transition-all duration-300"
                    style={{
                      borderColor: colors.separator,
                      backgroundColor: isAuthenticated && userInfo?.firstName ? `${colors.separator}15` : colors.cardBg
                    }}
                    placeholder="Votre nom"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primaryDark;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.separator;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {isAuthenticated && userInfo?.firstName && (
                    <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                      Pré-rempli depuis votre profil
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isAuthenticated && userInfo?.email}
                    className="w-full rounded-xl transition-all duration-300"
                    style={{
                      borderColor: colors.separator,
                      backgroundColor: isAuthenticated && userInfo?.email ? `${colors.separator}15` : colors.cardBg
                    }}
                    placeholder="votre@email.com"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primaryDark;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.separator;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Téléphone *
                </label>
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  disabled={isAuthenticated && userInfo?.phone}
                  className="w-full rounded-xl transition-all duration-300"
                  style={{
                    borderColor: colors.separator,
                    backgroundColor: isAuthenticated && userInfo?.phone ? `${colors.separator}15` : colors.cardBg
                  }}
                  placeholder="Votre numéro"
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primaryDark;
                    e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.separator;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Entreprise
                </label>
                <Input
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleInputChange}
                  disabled={isAuthenticated && userInfo?.companyName}
                  className="w-full rounded-xl transition-all duration-300"
                  style={{
                    borderColor: colors.separator,
                    backgroundColor: isAuthenticated && userInfo?.companyName ? `${colors.separator}15` : colors.cardBg
                  }}
                  placeholder="Nom de votre entreprise"
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primaryDark;
                    e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.separator;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Type de conseil recherché *
                </label>
                <Select
                  value={formData.conseilType}
                  onValueChange={(value) => setFormData({ ...formData, conseilType: value })}
                  required
                >
                  <SelectTrigger className="w-full rounded-xl transition-all duration-300"
                    style={{
                      borderColor: colors.separator,
                      backgroundColor: colors.cardBg
                    }}>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {conseilTypes.map((type) => (
                      <SelectItem key={type.id} value={type.title}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" style={{ color: type.color }} />
                          {type.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Votre besoin spécifique *
                </label>
                <Textarea
                  name="besoin"
                  value={formData.besoin}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full rounded-xl resize-none transition-all duration-300"
                  style={{
                    borderColor: colors.separator,
                    backgroundColor: colors.cardBg
                  }}
                  placeholder="Décrivez votre situation et vos objectifs..."
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primaryDark;
                    e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.separator;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Budget estimé
                </label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                >
                  <SelectTrigger className="w-full rounded-xl"
                    style={{
                      borderColor: colors.separator,
                      backgroundColor: colors.cardBg
                    }}>
                    <SelectValue placeholder="Sélectionnez une tranche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1k-5k">1 000€ - 5 000€</SelectItem>
                    <SelectItem value="5k-10k">5 000€ - 10 000€</SelectItem>
                    <SelectItem value="10k+">Plus de 10 000€</SelectItem>
                    <SelectItem value="surdevis">Sur devis personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Message complémentaire
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl resize-none transition-all duration-300"
                  style={{
                    borderColor: colors.separator,
                    backgroundColor: colors.cardBg
                  }}
                  placeholder="Informations supplémentaires, contraintes particulières, questions..."
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primaryDark;
                    e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.separator;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Indicateur d'expert sélectionné */}
              {selectedConseiller && (
                <div className="p-3 rounded-lg flex items-center gap-3"
                  style={{ backgroundColor: `${colors.primaryDark}08` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedConseiller.avatarColor }}>
                    {selectedConseiller.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Demande adressée à {selectedConseiller.name}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {selectedConseiller.title}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedConseiller(null);
                      setFormData(prev => ({ ...prev, expertId: null }));
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full font-semibold gap-2 border-2 transition-all duration-300 py-4 rounded-xl relative overflow-hidden group/submit"
                style={{
                  backgroundColor: colors.primaryDark,
                  color: colors.lightBg,
                  borderColor: colors.primaryDark,
                  boxShadow: `0 4px 15px ${colors.primaryDark}40`
                }}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryLight;
                  e.currentTarget.style.borderColor = colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                  e.currentTarget.style.borderColor = colors.primaryDark;
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Envoi en cours...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">
                      {isAuthenticated ? 'ENVOYER MA DEMANDE' : 'ENVOYER SANS CONNEXION'}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-700" />
                  </>
                )}
              </Button>

              {/* Note de confidentialité */}
              <div className="text-center pt-4 border-t" style={{ borderColor: colors.separator }}>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Vos informations sont traitées de manière confidentielle et ne seront jamais partagées sans votre consentement.
                </p>
                {!isAuthenticated && (
                  <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                    Vous pourrez suivre votre demande en vous connectant ultérieurement.
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConseilPage;