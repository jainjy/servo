import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Target, TrendingUp, CheckCircle, Clock, Shield,
  FileText, MessageCircle, Calendar, Star, ArrowRight,
  ChevronRight, Heart, Zap, BookOpen, Award, ThumbsUp,
  Users2, Briefcase, Handshake, Coins, Scale, Search,
  X, Send, MapPin, Phone, Mail, Brain, Rocket, GraduationCap,
  BarChart, PieChart, Lightbulb, Globe, Target as TargetIcon,
  Building2, Wallet, Sparkles, Globe2, ShieldCheck, Trophy,
  Award as AwardIcon, BarChart3, UsersIcon, HeartHandshake,
  Crown, Shield as ShieldIcon, Target as TargetIcon2, BadgeCheck,
  Zap as ZapIcon, TrendingUp as TrendingUpIcon, Award as AwardIcon2,
  Search as SearchIcon, Target as Target2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Palette de couleurs identique
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
  gradient1: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)",
  gradient2: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
  gradient3: "linear-gradient(135deg, #6B8E23 0%, #27AE60 100%)",
};

// Types d'accompagnement
interface AccompagnementType {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  details: string[];
  duration: string;
  price: string;
  category: 'creation' | 'croissance' | 'transition' | 'expertise';
  featured?: boolean;
  popular?: boolean;
}

// Conseillers/Experts
interface Conseiller {
  id: number;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  rating: number;
  avatarColor: string;
  disponibilite: 'disponible' | 'limitee' | 'complet';
  projects: number;
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

const AccompagnementPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConseiller, setSelectedConseiller] = useState<Conseiller | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllAccompagnements, setShowAllAccompagnements] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    entreprise: "",
    besoin: "",
    accompagnementType: "",
    budget: "",
    message: ""
  });

  // Statistiques impressionnantes
  const stats = [
    { value: "95%", label: "Taux de réussite", icon: Trophy, color: colors.accentGold },
    { value: "500+", label: "Entreprises accompagnées", icon: UsersIcon, color: colors.primaryDark },
    { value: "10", label: "Années d'expertise", icon: AwardIcon2, color: colors.secondaryText },
    { value: "24h", label: "Réponse garantie", icon: Clock, color: colors.success },
  ];

  // Données des types d'accompagnement
  const accompagnementTypes: AccompagnementType[] = [
    {
      id: 1,
      title: "Accompagnement Création",
      description: "De l'idée à la création de votre entreprise",
      icon: Rocket,
      color: colors.primaryDark,
      details: [
        "Étude de faisabilité complète",
        "Business plan détaillé",
        "Choix de la structure juridique",
        "Formalités d'immatriculation",
        "Aides et subventions"
      ],
      duration: "3-6 mois",
      price: "À partir de 1 500€",
      category: 'creation',
      featured: true
    },
    {
      id: 2,
      title: "Accompagnement Croissance",
      description: "Développez et optimisez votre entreprise existante",
      icon: TrendingUp,
      color: colors.success,
      details: [
        "Stratégie de développement",
        "Optimisation des processus",
        "Analyse de marché",
        "Plan de croissance",
        "Recrutement stratégique"
      ],
      duration: "6-12 mois",
      price: "À partir de 2 500€",
      category: 'croissance',
      popular: true
    },
    {
      id: 3,
      title: "Transition & Transmission",
      description: "Préparez la transmission ou la cession de votre entreprise",
      icon: Handshake,
      color: colors.secondaryText,
      details: [
        "Évaluation de l'entreprise",
        "Préparation à la transmission",
        "Recherche d'acquéreurs",
        "Négociation",
        "Accompagnement juridique"
      ],
      duration: "12-24 mois",
      price: "Sur devis personnalisé",
      category: 'transition'
    },
    {
      id: 4,
      title: "Expertise Comptable & Fiscale",
      description: "Optimisez votre gestion comptable et fiscale",
      icon: PieChart,
      color: colors.textPrimary,
      details: [
        "Tenue de comptabilité",
        "Optimisation fiscale",
        "Déclarations sociales",
        "Audit comptable",
        "Conseil en gestion"
      ],
      duration: "Continu ou ponctuel",
      price: "À partir de 300€/mois",
      category: 'expertise'
    },
    {
      id: 5,
      title: "Stratégie Marketing & Digital",
      description: "Développez votre présence en ligne et votre clientèle",
      icon: TargetIcon,
      color: colors.accentGold,
      details: [
        "Stratégie marketing digitale",
        "Branding et identité visuelle",
        "Référencement SEO",
        "Campagnes publicitaires",
        "Analyse des performances"
      ],
      duration: "3-12 mois",
      price: "À partir de 1 800€",
      category: 'croissance'
    },
    {
      id: 6,
      title: "Financement & Levée de Fonds",
      description: "Accédez aux financements adaptés à votre projet",
      icon: Coins,
      color: colors.warning,
      details: [
        "Préparation du dossier financier",
        "Recherche d'investisseurs",
        "Négociation avec les banques",
        "Subventions et aides",
        "Business angels & VC"
      ],
      duration: "2-6 mois",
      price: "5% des fonds levés (min. 2 000€)",
      category: 'croissance'
    }
  ];

  // Conseillers/Experts premium
  const conseillers: Conseiller[] = [
    {
      id: 1,
      name: "Marie Dubois",
      title: "Experte en création d'entreprise",
      specialty: "Business Plan & Financement",
      experience: "15 ans d'expérience",
      rating: 4.9,
      avatarColor: "#6B8E23",
      disponibilite: 'disponible',
      projects: 127
    },
    {
      id: 2,
      name: "Thomas Martin",
      title: "Spécialiste croissance",
      specialty: "Stratégie & Développement",
      experience: "12 ans d'expérience",
      rating: 4.8,
      avatarColor: "#8B4513",
      disponibilite: 'limitee',
      projects: 89
    },
    {
      id: 3,
      name: "Sophie Leroy",
      title: "Experte juridique",
      specialty: "Droit des affaires",
      experience: "18 ans d'expérience",
      rating: 5.0,
      avatarColor: "#556B2F",
      disponibilite: 'disponible',
      projects: 156
    },
    {
      id: 4,
      name: "Alexandre Petit",
      title: "Consultant financier",
      specialty: "Levée de fonds & Investissement",
      experience: "10 ans d'expérience",
      rating: 4.7,
      avatarColor: "#2C3E50",
      disponibilite: 'disponible',
      projects: 94
    }
  ];

  // Témoignages premium
  const temoignages: Temoignage[] = [
    {
      id: 1,
      name: "Julie Moreau",
      entreprise: "TechStart Solutions",
      texte: "L'accompagnement a été crucial pour le lancement de ma startup. L'expertise et le réseau mis à disposition ont fait toute la différence.",
      rating: 5,
      date: "15 Jan 2024",
      avatarColor: "#6B8E23",
      resultat: "+200% CA en 18 mois"
    },
    {
      id: 2,
      name: "Marc Lefebvre",
      entreprise: "Artisan & Co",
      texte: "Grâce à l'accompagnement stratégique, nous avons doublé notre chiffre d'affaires en 18 mois. Une équipe exceptionnelle !",
      rating: 5,
      date: "22 Nov 2023",
      avatarColor: "#8B4513",
      resultat: "Doublement du CA"
    },
    {
      id: 3,
      name: "Sarah Chen",
      entreprise: "Green Innovations",
      texte: "La transmission de mon entreprise s'est déroulée parfaitement grâce à leur expertise. Je recommande vivement leurs services.",
      rating: 5,
      date: "5 Oct 2023",
      avatarColor: "#556B2F",
      resultat: "Transmission réussie à 120% valeur"
    }
  ];

  // Étapes de l'accompagnement
  const etapesAccompagnement = [
    {
      step: 1,
      title: "Diagnostic initial",
      description: "Analyse approfondie de votre situation et définition des objectifs",
      icon: SearchIcon,
      color: colors.primaryDark,
      details: "Entretien personnalisé, analyse SWOT, benchmark concurrentiel"
    },
    {
      step: 2,
      title: "Plan d'action",
      description: "Élaboration d'une stratégie sur mesure avec des échéances claires",
      icon: Target2,
      color: colors.success,
      details: "Roadmap détaillée, KPIs, planning d'exécution"
    },
    {
      step: 3,
      title: "Mise en œuvre",
      description: "Accompagnement pas à pas dans la réalisation de votre projet",
      icon: Rocket,
      color: colors.secondaryText,
      details: "Suivi hebdomadaire, ajustements, reporting régulier"
    },
    {
      step: 4,
      title: "Suivi & Ajustements",
      description: "Réajustements réguliers pour garantir l'atteinte des objectifs",
      icon: TrendingUp,
      color: colors.accentGold,
      details: "Analyse des résultats, optimisation continue"
    },
    {
      step: 5,
      title: "Capitalisation",
      description: "Transfert de compétences et autonomisation pour l'avenir",
      icon: GraduationCap,
      color: colors.textPrimary,
      details: "Formation de l'équipe, documentation, support post-accompagnement"
    }
  ];

  // Avantages premium
  const avantages = [
    {
      title: "Expertise certifiée",
      description: "Nos experts sont certifiés et possèdent une expérience avérée",
      icon: ShieldCheck,
      color: colors.primaryDark
    },
    {
      title: "Approche personnalisée",
      description: "Chaque accompagnement est adapté à vos besoins spécifiques",
      icon: HeartHandshake,
      color: colors.success
    },
    {
      title: "Résultats mesurables",
      description: "Des objectifs clairs avec des indicateurs de performance",
      icon: BarChart3,
      color: colors.secondaryText
    },
    {
      title: "Réseau exclusif",
      description: "Accès à notre réseau de partenaires et investisseurs",
      icon: Globe2,
      color: colors.accentGold
    }
  ];

  // Filtrage des types d'accompagnement
  const filteredTypes = accompagnementTypes.filter(type =>
    type.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.details.some(detail => detail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Afficher seulement 3 accompagnements au début
  const displayedAccompagnements = showAllAccompagnements
    ? filteredTypes
    : filteredTypes.slice(0, 3);

  const handleTypeSelect = (type: AccompagnementType) => {
    setSelectedType(type.id);
    setFormData(prev => ({
      ...prev,
      accompagnementType: type.title,
      message: `Bonjour, je suis intéressé par votre accompagnement "${type.title}".\n\n${type.description}\n\nMes besoins spécifiques : `
    }));
  };

  const handleConseillerSelect = (conseiller: Conseiller) => {
    setSelectedConseiller(conseiller);
    setFormData(prev => ({
      ...prev,
      message: `Bonjour ${conseiller.name},\n\nJe souhaiterais prendre rendez-vous pour discuter de votre accompagnement "${conseiller.specialty}".`
    }));
    setShowContactModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'envoi
    setTimeout(() => {
      setIsLoading(false);
      setShowContactModal(false);
      toast.success("Votre demande d'accompagnement a été envoyée !");
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        entreprise: "",
        besoin: "",
        accompagnementType: "",
        budget: "",
        message: ""
      });
      setSelectedConseiller(null);
    }, 2000);
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      <Header />

      {/* Hero Section — Minimal + Glassmorphism */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />
        {/* Badge glass */}
        <div className="absolute bottom-0 left-4 inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-xs text-slate-200 tracking-wide">
            Accompagnement Premium
          </span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >


            {/* Title */}
            <h1 className="text-xl lg:text-3xl font-bold text-white mb-4">
              Accompagnement{" "}
              <span style={{ color: colors.primaryDark }}>Personnalisé</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm leading-relaxed mb-10">
              Des experts dédiés pour vous accompagner à chaque étape de votre
              projet entrepreneurial. De l'idée à la croissance, nous sommes à vos côtés.
            </p>

            {/* CTA Buttons Glass */}
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="rounded-xl px-7 py-4 text-base font-semibold border-2 
                       backdrop-blur-md bg-white/10 border-white/20 text-white"
                  style={{ backgroundColor: colors.primaryDark }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                  }}
                  onClick={() =>
                    document.getElementById("types-accompagnement")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Découvrir nos accompagnements
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="rounded-xl px-7 py-4 text-base font-semibold 
                       bg-white text-slate-900 border-2 border-white 
                       hover:bg-slate-100 transition-all"
                  onClick={() => setShowContactModal(true)}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Prendre rendez-vous
                </Button>
              </motion.div>
            </div>
          </motion.div>


        </div>
      </section>

      {/* Stats — Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-xl text-center bg-white shadow-lg"
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon className="h-7 w-7" style={{ color: stat.color }} />
            </div>

            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-700">{stat.label}</div>
          </div>
        ))}
      </motion.div>


      {/* Section Notre Méthode - Timeline horizontale avec ligne connectant les cercles */}
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
            Notre <span style={{ color: colors.secondaryText }}>Méthode</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Un processus structuré en 5 étapes pour garantir votre succès
          </p>
        </motion.div>

        {/* Timeline horizontale */}
        <div className="relative max-w-6xl mx-auto">
          {/* Ligne horizontale connectant les cercles */}
          <div className="absolute left-0 right-0 top-8 h-0.5 hidden lg:block"
            style={{
              backgroundColor: colors.separator,
              zIndex: 0
            }}
          ></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {etapesAccompagnement.map((etape, index) => (
              <motion.div
                key={etape.step}
                variants={itemVariants}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center text-center h-full">
                  {/* Cercle avec numéro */}
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto relative z-10"
                      style={{
                        backgroundColor: `${etape.color}15`,
                        border: `2px solid ${etape.color}`,
                      }}
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: etape.color,
                          color: colors.lightBg
                        }}
                      >
                        <span className="text-lg font-bold">{etape.step}</span>
                      </div>
                    </div>

                    {/* Lignes de connexion pour mobile */}
                    {index < etapesAccompagnement.length - 1 && (
                      <>
                        {/* Ligne horizontale pour mobile (sm) */}
                        <div className="absolute top-1/2 right-0 w-8 h-0.5 hidden sm:block lg:hidden -translate-y-1/2 z-0"
                          style={{ backgroundColor: colors.separator }}
                        ></div>
                        {/* Ligne verticale pour mobile (xs) */}
                        <div className="absolute top-full left-1/2 w-0.5 h-8 -translate-x-1/2 sm:hidden z-0"
                          style={{ backgroundColor: colors.separator }}
                        ></div>
                      </>
                    )}
                  </div>

                  {/* Contenu de l'étape */}
                  <div className="px-2 flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                      {etape.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                      {etape.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <etape.icon className="h-4 w-4" />
                      <span>{etape.details}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section Avantages - Carte Grand Format */}
      <motion.section
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="rounded-3xl overflow-hidden border-0"
          style={{
            background: colors.gradient1,
            color: colors.lightBg
          }}>
          <div className="p-8 lg:p-12">
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                Des <span style={{ color: colors.accentGold }}>avantages</span> exclusifs
              </h2>
              <p className="text-lg max-w-3xl mx-auto text-white/80">
                Ce qui fait la différence dans notre accompagnement
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {avantages.map((avantage, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6 rounded-2xl h-full border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center mx-auto"
                      style={{ backgroundColor: `${avantage.color}30` }}>
                      <avantage.icon className="h-7 w-7" style={{ color: avantage.color }} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{avantage.title}</h3>
                    <p className="text-sm text-white/80">{avantage.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Section Types d'Accompagnement - Seulement 3 cartes */}
      <motion.section
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        id="types-accompagnement"
        style={{ backgroundColor: `${colors.primaryDark}05` }}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.primaryDark }}>
            Choisissez votre <span style={{ color: colors.secondaryText }}>Accompagnement</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: colors.textSecondary }}>
            Des solutions sur mesure adaptées à chaque étape de votre parcours entrepreneurial
          </p>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                placeholder="Rechercher un type d'accompagnement..."
                className="pl-12 pr-4 py-3 rounded-xl border-2"
                style={{
                  borderColor: colors.separator,
                  backgroundColor: colors.cardBg
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5" style={{ color: colors.textSecondary }} />
            </div>
          </div>
        </motion.div>

        {/* Grille des accompagnements - Seulement 3 cartes */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
          variants={containerVariants}
        >
          {displayedAccompagnements.map((type) => (
            <motion.div
              key={type.id}
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
              onClick={() => handleTypeSelect(type)}
            >
              <motion.div variants={cardHoverVariants} className="h-full">
                <Card className={`p-8 h-full rounded-2xl cursor-pointer transition-all duration-500 group ${selectedType === type.id ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{
                    borderColor: selectedType === type.id ? type.color : colors.separator,
                    backgroundColor: colors.cardBg,
                    borderWidth: selectedType === type.id ? '2px' : '1px',
                    boxShadow: selectedType === type.id ? `0 10px 30px ${type.color}30` : '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                >
                  <div className={`w-16 h-16 mb-6 rounded-xl mx-auto flex items-center justify-center transition-colors duration-300 ${selectedType === type.id ? '' : 'group-hover:' + type.color + '15'
                    }`}
                    style={{
                      backgroundColor: selectedType === type.id
                        ? type.color
                        : `${type.color}15`
                    }}
                  >
                    <type.icon
                      className="h-8 w-8 transition-colors duration-300"
                      style={{
                        color: selectedType === type.id
                          ? colors.lightBg
                          : type.color
                      }}
                    />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: colors.textPrimary }}>
                    {type.title}
                  </h3>

                  <p className="leading-relaxed text-center mb-6" style={{ color: colors.textSecondary }}>
                    {type.description}
                  </p>

                  <div className="mb-6">
                    <ul className="space-y-2">
                      {type.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: type.color }} />
                          <span className="text-sm" style={{ color: colors.textSecondary }}>
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" style={{ color: colors.textSecondary }} />
                      <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {type.duration}
                      </span>
                    </div>
                    <div className="text-lg font-bold" style={{ color: type.color }}>
                      {type.price}
                    </div>
                  </div>

                  <Button
                    className="w-full font-semibold rounded-xl gap-3 py-4 border-2 transition-all duration-300"
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
                  >
                    {selectedType === type.id ? "Sélectionné" : "Choisir cet accompagnement"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bouton Voir Plus/Moins */}
        {filteredTypes.length > 3 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="outline"
              className="rounded-xl px-8 py-3 font-semibold border-2 transition-all duration-300"
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
              onClick={() => setShowAllAccompagnements(!showAllAccompagnements)}
            >
              {showAllAccompagnements ? (
                <>
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Voir moins
                </>
              ) : (
                <>
                  Voir les {filteredTypes.length - 3} autres accompagnements
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        {filteredTypes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.separator}30` }}>
              <Search className="h-12 w-12" style={{ color: colors.textSecondary }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Aucun résultat trouvé
            </h3>
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              Essayez avec d'autres mots-clés
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Section Nos Experts - Cartes avec bordures et ombres seulement */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="p-8 lg:p-12">
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Nos <span style={{ color: colors.secondaryText }}>Experts</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Rencontrez notre équipe d'experts dédiés à votre réussite
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {conseillers.map((conseiller) => (
              <motion.div
                key={conseiller.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <Card className="p-6 rounded-2xl text-center h-full transition-all duration-300 overflow-hidden group bg-white"
                  style={{
                    border: `2px solid ${colors.separator}`,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  }}>

                  {/* Badge disponibilité */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-md ${conseiller.disponibilite === 'disponible' ? 'bg-green-100 text-green-800 border border-green-200' :
                    conseiller.disponibilite === 'limitee' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {conseiller.disponibilite === 'disponible' ? 'Disponible' :
                      conseiller.disponibilite === 'limitee' ? 'Limité' : 'Complet'}
                  </div>

                  <div className="w-24 h-24 rounded-full mx-auto mb-6 mt-2 flex items-center justify-center text-white text-2xl font-bold relative group-hover:scale-105 transition-transform duration-300 border-4 border-white shadow-lg"
                    style={{
                      backgroundColor: conseiller.avatarColor,
                      boxShadow: `0 8px 25px ${conseiller.avatarColor}40`
                    }}>
                    {conseiller.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                    {conseiller.name}
                  </h3>

                  <div className="inline-block px-3 py-1 rounded-full mb-3 text-sm font-semibold"
                    style={{
                      backgroundColor: `${colors.primaryDark}10`,
                      color: colors.primaryDark,
                      border: `1px solid ${colors.primaryDark}20`
                    }}>
                    {conseiller.title}
                  </div>

                  <p className="text-sm mb-4 px-2" style={{ color: colors.textSecondary }}>
                    {conseiller.specialty}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4"
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
                        {conseiller.projects}
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

                  <Button
                    className="w-full font-semibold rounded-xl gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                    style={{
                      background: colors.gradient1,
                      color: colors.lightBg,
                      border: '1px solid transparent'
                    }}
                    disabled={conseiller.disponibilite === 'complet'}
                    onClick={() => handleConseillerSelect(conseiller)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contacter l'expert
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section Témoignages - Carte Grand Format */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="rounded-3xl overflow-hidden border-0"
          style={{
            background: colors.gradient2,
            color: colors.lightBg
          }}>
          <div className="p-8 lg:p-12">
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                Ils nous font <span style={{ color: colors.accentGold }}>Confiance</span>
              </h2>
              <p className="text-lg max-w-3xl mx-auto text-white/80">
                Découvrez les retours d'expérience de nos clients accompagnés
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {temoignages.map((temoignage) => (
                <motion.div
                  key={temoignage.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6 rounded-2xl h-full border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                        style={{
                          backgroundColor: temoignage.avatarColor,
                          boxShadow: `0 4px 15px ${temoignage.avatarColor}40`
                        }}>
                        {temoignage.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{temoignage.name}</h4>
                        <p className="text-sm text-white/80">{temoignage.entreprise}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4"
                          style={{
                            color: colors.accentGold,
                            fill: colors.accentGold
                          }}
                        />
                      ))}
                    </div>

                    <p className="italic mb-6 leading-relaxed text-white/90 text-sm">
                      "{temoignage.texte}"
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-white/60">
                          {temoignage.date}
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: colors.success, color: colors.lightBg }}>
                          {temoignage.resultat}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>

      {/* CTA Final */}
      <section className="py-16" style={{ backgroundColor: colors.lightBg }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: colors.primaryDark }}>
              Prêt à transformer votre projet ?
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
              Nos experts vous accompagnent personnellement pour concrétiser vos ambitions entrepreneuriales
            </p>

            <motion.div>
              <Button
                className="rounded-xl px-10 py-5 text-lg font-semibold border-2 transition-all duration-300"
                style={{
                  backgroundColor: colors.primaryDark,
                  color: colors.lightBg,
                  borderColor: colors.primaryDark
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryLight;
                  e.currentTarget.style.borderColor = colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                  e.currentTarget.style.borderColor = colors.primaryDark;
                }}
                onClick={() => setShowContactModal(true)}
              >
                <Calendar className="h-5 w-5 mr-3" />
                Demander un accompagnement
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modal de Contact */}
      {showContactModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={modalVariants}
            className="rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.separator}`
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {selectedConseiller
                  ? `Contacter ${selectedConseiller.name}`
                  : "Demande d'accompagnement"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowContactModal(false);
                  setSelectedConseiller(null);
                }}
                className="h-10 w-10 p-0 rounded-xl transition-all duration-300"
                style={{
                  color: colors.textSecondary
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitContact} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Nom complet *
                </label>
                <Input
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Téléphone *
                </label>
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="Votre numéro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Entreprise
                </label>
                <Input
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleInputChange}
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Type d'accompagnement recherché
                </label>
                <Select
                  value={formData.accompagnementType}
                  onValueChange={(value) => setFormData({ ...formData, accompagnementType: value })}
                >
                  <SelectTrigger className="w-full rounded-xl" style={{ borderColor: colors.separator }}>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accompagnementTypes.map((type) => (
                      <SelectItem key={type.id} value={type.title}>
                        {type.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Votre besoin spécifique *
                </label>
                <Textarea
                  name="besoin"
                  value={formData.besoin}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full rounded-xl resize-none"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="Décrivez votre projet ou votre besoin..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Message complémentaire
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl resize-none"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="Informations supplémentaires..."
                />
              </div>

              <Button
                type="submit"
                className="w-full font-semibold gap-2 border-2 transition-all duration-300 py-4 rounded-xl"
                style={{
                  backgroundColor: colors.primaryDark,
                  color: colors.lightBg,
                  borderColor: colors.primaryDark
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 rounded-full"
                    style={{
                      borderColor: colors.lightBg,
                      borderTopColor: 'transparent'
                    }}
                  />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    ENVOYER MA DEMANDE
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
};

export default AccompagnementPage;