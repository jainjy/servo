import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Shield,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  FileText,
  Award,
  Lightbulb,
  BarChart,
  Handshake,
  Zap,
  ArrowRight,
  Search,
  Filter,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Users2,
  Building2,
  Scale,
  Brain,
  Rocket,
  GraduationCap,
  Globe,
  Target as TargetIcon,
  Shield as ShieldIcon,
  Award as AwardIcon,
  ThumbsUp,
  X,
  Send,
  AlertCircle,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { conseilService } from "@/services/conseilService";

// Mappage des icônes
const iconMap = {
  BarChart,
  Handshake,
  TargetIcon,
  Scale,
  TrendingUp,
  Rocket,
  Search,
  Filter,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  ShieldIcon,
  AwardIcon,
  ThumbsUp,
  MessageCircle,
  Lightbulb,
  Brain,
  Rocket,
  GraduationCap,
  Globe,
  ArrowRight,
  Send,
  X,
  AlertCircle,
  User,
  Loader2,
  Users,
  Building2,
  Shield,
  Zap,
  FileText,
  Award,
  GraduationCap,
  Globe,
};

// Palette de couleurs
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

// Types
interface ConseilType {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  details: string[];
  duration: string;
  price: string;
  category: "audit" | "mediation" | "strategie" | "juridique" | "finance";
  featured?: boolean;
  popular?: boolean;
}

interface Conseiller {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  rating: number;
  avatarColor: string;
  disponibilite: "disponible" | "limitee" | "complet";
  projets: number;
  certifications?: string[];
  avatar?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  commercialName?: string;
  role?: string;
  userType?: string;
  metiers?: any[];
  services?: any[];
}

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

interface EtapeProcessus {
  step: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  details: string[];
}

interface Avantage {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Stat {
  value: string;
  label: string;
  icon: string;
  color: string;
}

const ConseilPage = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConseiller, setSelectedConseiller] =
    useState<Conseiller | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("tous");
  const [showMoreProcess, setShowMoreProcess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // États pour les données dynamiques
  const [conseilTypes, setConseilTypes] = useState<ConseilType[]>([]);
  const [conseillers, setConseillers] = useState<Conseiller[]>([]);
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [processusConseil, setProcessusConseil] = useState<EtapeProcessus[]>(
    []
  );
  const [avantages, setAvantages] = useState<Avantage[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    entreprise: "",
    besoin: "",
    conseilType: "",
    budget: "",
    message: "",
    expertId: null,
  });

  // Vérifier l'authentification et charger les données
  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const isAuth = conseilService.isAuthenticated();
    setIsAuthenticated(isAuth);

    if (isAuth) {
      try {
        const response = await conseilService.getUserInfo();
        if (response.success && response.data) {
          setUserInfo(response.data);
          prefillFormWithUserInfo(response.data);
        }
      } catch (error) {
        console.error("Erreur chargement infos utilisateur:", error);
      }
    }
  };

  const prefillFormWithUserInfo = (user: any) => {
    setFormData((prev) => ({
      ...prev,
      nom: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email || "",
      telephone: user.phone || "",
      entreprise: user.companyName || user.commercialName || "",
    }));
  };

  const fetchData = async () => {
    try {
      setIsDataLoading(true);

      console.log("🔍 Début du chargement des données pour la page Conseil...");

      // Charger toutes les données en parallèle
      const [
        typesResponse,
        expertsResponse,
        temoignagesResponse,
        statsResponse,
        etapesResponse,
        avantagesResponse,
      ] = await Promise.allSettled([
        conseilService.getTypesConseil(),
        conseilService.getExperts(),
        conseilService.getTemoignages(),
        conseilService.getStats(),
        conseilService.getEtapes(),
        conseilService.getAvantages(),
      ]);

      console.log("📊 Réponses API reçues:", {
        types: typesResponse.status,
        experts: expertsResponse.status,
        temoignages: temoignagesResponse.status,
        stats: statsResponse.status,
        etapes: etapesResponse.status,
        avantages: avantagesResponse.status,
      });

      // Gestion des types de conseil
      if (
        typesResponse.status === "fulfilled" &&
        typesResponse.value?.success
      ) {
        const typesData = typesResponse.value.data || [];
        console.log(`📋 Types de conseil reçus: ${typesData.length}`);
        setConseilTypes(
          typesData.map((type: any) => ({
            ...type,
            id: type.id || Date.now(),
            icon: type.icon || "BarChart",
            details: Array.isArray(type.details) ? type.details : [],
            category: type.category || "audit",
          }))
        );
      } else {
        console.log("⚠️ Utilisation des types de conseil par défaut");
        setConseilTypes(getDefaultConseilTypes());
      }

      // Gestion des experts - CORRECTION DÉTAILLÉE ICI
      if (
        expertsResponse.status === "fulfilled" &&
        expertsResponse.value?.success
      ) {
        const expertsData = expertsResponse.value.data || [];
        console.log(`👨‍💼 Experts reçus: ${expertsData.length}`, expertsData);

        const formattedExperts = expertsData.map(
          (expert: any, index: number) => {
            console.log(`Expert ${index}:`, expert);

            // DÉTERMINER LE NOM
            let name = expert.name;
            if (!name && (expert.firstName || expert.lastName)) {
              name = `${expert.firstName || ""} ${
                expert.lastName || ""
              }`.trim();
            }
            if (!name) {
              name =
                expert.commercialName ||
                expert.companyName ||
                `Expert ${index + 1}`;
            }

            // DÉTERMINER LE TITRE
            let title = expert.title;
            if (!title) {
              if (expert.role === "expert") title = "Expert Conseil";
              else if (expert.userType === "professional")
                title = "Professionnel";
              else if (expert.commercialName) title = expert.commercialName;
              else if (expert.metiers?.[0]?.metier?.libelle)
                title = `Expert ${expert.metiers[0].metier.libelle}`;
              else title = "Consultant";
            }

            // DÉTERMINER LA SPÉCIALITÉ
            let specialty = expert.specialty;
            if (!specialty) {
              if (expert.metiers?.[0]?.metier?.libelle) {
                specialty = expert.metiers[0].metier.libelle;
              } else if (expert.services?.[0]?.service?.libelle) {
                specialty = expert.services[0].service.libelle;
              } else {
                specialty = "Conseil stratégique";
              }
            }

            // DÉTERMINER L'EXPÉRIENCE
            let experience = expert.experience;
            if (!experience) {
              if (expert.createdAt) {
                const now = new Date();
                const joinDate = new Date(expert.createdAt);
                const years = Math.floor(
                  (now.getTime() - joinDate.getTime()) /
                    (1000 * 60 * 60 * 24 * 365)
                );
                if (years > 10) experience = "Plus de 10 ans d'expérience";
                else if (years > 5) experience = "5-10 ans d'expérience";
                else if (years > 3) experience = "3-5 ans d'expérience";
                else if (years > 1) experience = "1-3 ans d'expérience";
                else experience = "Moins d'un an d'expérience";
              } else {
                experience = "Expérience variable";
              }
            }

            // DÉTERMINER LE RATING
            let rating = expert.rating;
            if (!rating || typeof rating !== "number") {
              // Calculer un rating basé sur l'expérience et le nombre de projets
              rating = 4.0;
              if (expert._count?.expertDemandesConseil > 50) rating += 1.0;
              else if (expert._count?.expertDemandesConseil > 20) rating += 0.7;
              else if (expert._count?.expertDemandesConseil > 10) rating += 0.5;
              else if (expert._count?.expertDemandesConseil > 5) rating += 0.3;

              if (expert.createdAt) {
                const now = new Date();
                const joinDate = new Date(expert.createdAt);
                const years =
                  (now.getTime() - joinDate.getTime()) /
                  (1000 * 60 * 60 * 24 * 365);
                if (years > 5) rating += 0.5;
                else if (years > 3) rating += 0.3;
                else if (years > 1) rating += 0.2;
              }

              rating = Math.min(rating, 5);
            }

            // DÉTERMINER LES PROJETS
            let projets =
              expert.projets ||
              expert.projects ||
              expert._count?.expertDemandesConseil ||
              0;

            // DÉTERMINER LA DISPONIBILITÉ
            let disponibilite = expert.disponibilite;
            if (!disponibilite) {
              if (projets < 5) disponibilite = "disponible";
              else if (projets < 15) disponibilite = "limitee";
              else disponibilite = "complet";
            }

            // DÉTERMINER LA COULEUR DE L'AVATAR
            let avatarColor = expert.avatarColor;
            if (!avatarColor) {
              const colors = [
                "#6B8E23",
                "#8B4513",
                "#556B2F",
                "#2C3E50",
                "#27AE60",
                "#D4AF37",
                "#8FBC8F",
                "#A0522D",
              ];
              const idStr = expert.id || index.toString();
              const colorIndex =
                idStr
                  .split("")
                  .reduce(
                    (acc: number, char: string) => acc + char.charCodeAt(0),
                    0
                  ) % colors.length;
              avatarColor = colors[colorIndex];
            }

            // DÉTERMINER L'AVATAR
            const avatar = expert.avatar || null;

            // DÉTERMINER LES CERTIFICATIONS
            const certifications = expert.certifications || [];

            return {
              id: expert.id || `expert-${Date.now()}-${index}`,
              name,
              title,
              specialty,
              experience,
              rating: parseFloat(rating.toFixed(1)),
              avatarColor,
              disponibilite,
              projets,
              certifications,
              avatar,
              firstName: expert.firstName,
              lastName: expert.lastName,
              email: expert.email,
              phone: expert.phone,
              companyName: expert.companyName,
              commercialName: expert.commercialName,
              role: expert.role,
              userType: expert.userType,
              metiers: expert.metiers || [],
              services: expert.services || [],
            };
          }
        );

        console.log("✅ Experts formatés:", formattedExperts);
        setConseillers(formattedExperts);
      } else {
        console.log("⚠️ Utilisation des experts par défaut");
        setConseillers(getDefaultConseillers());
      }

      // Gestion des témoignages
      if (
        temoignagesResponse.status === "fulfilled" &&
        temoignagesResponse.value?.success
      ) {
        const temoignagesData = temoignagesResponse.value.data || [];
        console.log(`💬 Témoignages reçus: ${temoignagesData.length}`);
        const validatedTemoignages = temoignagesData.map((temoignage: any) => ({
          id: temoignage.id || Date.now(),
          name: temoignage.name || "Client",
          entreprise: temoignage.entreprise || "Entreprise",
          texte:
            temoignage.texte ||
            temoignage.message ||
            "Aucun témoignage disponible",
          rating: temoignage.rating || 5,
          date: temoignage.date || new Date().toLocaleDateString(),
          avatarColor: temoignage.avatarColor || colors.primaryDark,
          resultat: temoignage.resultat || "Résultat positif",
        }));
        setTemoignages(validatedTemoignages);
      } else {
        console.log("⚠️ Utilisation des témoignages par défaut");
        setTemoignages(getDefaultTemoignages());
      }

      // Gestion des statistiques
      if (
        statsResponse.status === "fulfilled" &&
        statsResponse.value?.success
      ) {
        const statsData = statsResponse.value.data;
        console.log(`📈 Statistiques reçues:`, statsData);
        if (Array.isArray(statsData)) {
          setStats(statsData);
        } else if (statsData && typeof statsData === "object") {
          // Si c'est un objet, le convertir en tableau
          const statsObj = statsData;
          const statsArray = [
            {
              value: statsObj.totalDemandes?.toString() || "500+",
              label: "Projets conseillés",
              icon: "Target",
              color: colors.primaryDark,
            },
            {
              value: (statsObj.tauxReussite?.toString() || "98") + "%",
              label: "Satisfaction client",
              icon: "ThumbsUp",
              color: colors.success,
            },
            {
              value: statsObj.experience || "15",
              label: "Années d'expertise",
              icon: "Award",
              color: colors.secondaryText,
            },
            {
              value: "24h",
              label: "Réponse garantie",
              icon: "Clock",
              color: colors.accentGold,
            },
          ];
          setStats(statsArray);
        } else {
          setStats(getDefaultStats());
        }
      } else {
        console.log("⚠️ Utilisation des statistiques par défaut");
        setStats(getDefaultStats());
      }

      // Gestion des étapes
      if (
        etapesResponse.status === "fulfilled" &&
        etapesResponse.value?.success
      ) {
        const etapesData = etapesResponse.value.data || [];
        console.log(`🔢 Étapes reçues: ${etapesData.length}`);
        if (Array.isArray(etapesData)) {
          setProcessusConseil(
            etapesData.map((etape: any) => ({
              ...etape,
              step: etape.step || 1,
              details:
                typeof etape.details === "string"
                  ? etape.details.split(", ")
                  : Array.isArray(etape.details)
                  ? etape.details
                  : [],
            }))
          );
        } else {
          setProcessusConseil(getDefaultProcessus());
        }
      } else {
        console.log("⚠️ Utilisation du processus par défaut");
        setProcessusConseil(getDefaultProcessus());
      }

      // Gestion des avantages
      if (
        avantagesResponse.status === "fulfilled" &&
        avantagesResponse.value?.success
      ) {
        const avantagesData = avantagesResponse.value.data || [];
        console.log(`🎯 Avantages reçus: ${avantagesData.length}`);
        setAvantages(avantagesData);
      } else {
        console.log("⚠️ Utilisation des avantages par défaut");
        setAvantages(getDefaultAvantages());
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des données:", error);
      toast.error("Erreur lors du chargement des données");
      setDefaultData();
    } finally {
      setIsDataLoading(false);
      console.log("✅ Chargement des données terminé");
    }
  };

  // Fonctions pour les données par défaut
  const getDefaultConseilTypes = (): ConseilType[] => [
    {
      id: 1,
      title: "Audit Stratégique",
      description:
        "Analyse approfondie de votre situation et recommandations stratégiques",
      icon: "BarChart",
      color: colors.primaryDark,
      details: [
        "Analyse SWOT complète",
        "Benchmark concurrentiel",
        "Diagnostic organisationnel",
        "Recommandations stratégiques",
        "Plan d'action détaillé",
      ],
      duration: "2-4 semaines",
      price: "À partir de 2 500€",
      category: "audit",
      featured: true,
      popular: true,
    },
    {
      id: 2,
      title: "Médiation & Résolution",
      description: "Résolution amiable des conflits internes et externes",
      icon: "Handshake",
      color: colors.success,
      details: [
        "Médiation commerciale",
        "Résolution de conflits internes",
        "Négociation stratégique",
        "Accords de partenariat",
        "Prévention des litiges",
      ],
      duration: "1-3 semaines",
      price: "À partir de 1 800€",
      category: "mediation",
    },
    {
      id: 3,
      title: "Conseil en Stratégie",
      description:
        "Développement et optimisation de votre stratégie d'entreprise",
      icon: "TargetIcon",
      color: colors.secondaryText,
      details: [
        "Définition de vision",
        "Plan stratégique sur 3-5 ans",
        "Allocation des ressources",
        "Suivi des indicateurs",
        "Ajustements stratégiques",
      ],
      duration: "3-6 semaines",
      price: "À partir de 3 500€",
      category: "strategie",
    },
  ];

  const getDefaultConseillers = (): Conseiller[] => [
    {
      id: "1",
      name: "Dr. Sophie Laurent",
      title: "Experte en Audit Stratégique",
      specialty: "Stratégie d'entreprise & Organisation",
      experience: "20 ans d'expérience",
      rating: 4.9,
      avatarColor: "#6B8E23",
      disponibilite: "disponible",
      projets: 156,
      certifications: [
        "MBA HEC",
        "Certified Management Consultant",
        "Six Sigma Black Belt",
      ],
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    },
    {
      id: "2",
      name: "Pierre Martin",
      title: "Spécialiste en Médiation",
      specialty: "Résolution de conflits & Négociation",
      experience: "15 ans d'expérience",
      rating: 4.8,
      avatarColor: "#8B4513",
      disponibilite: "limitee",
      projets: 89,
      certifications: [
        "Médiateur certifié CNMA",
        "Expert en négociation Harvard",
        "Praticien PNL",
      ],
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
  ];

  const getDefaultStats = (): Stat[] => [
    {
      value: "98%",
      label: "Satisfaction client",
      icon: "ThumbsUp",
      color: colors.success,
    },
    {
      value: "500+",
      label: "Projets conseillés",
      icon: "Target",
      color: colors.primaryDark,
    },
    {
      value: "15",
      label: "Années d'expertise",
      icon: "Award",
      color: colors.secondaryText,
    },
    {
      value: "24h",
      label: "Réponse garantie",
      icon: "Clock",
      color: colors.accentGold,
    },
  ];

  const getDefaultTemoignages = (): Temoignage[] => [
    {
      id: 1,
      name: "Julie Moreau",
      entreprise: "TechStart Solutions",
      texte:
        "L'audit stratégique réalisé par l'équipe a été déterminant pour notre repositionnement sur le marché. Les recommandations étaient précises et actionnables.",
      rating: 5,
      date: "15 Jan 2024",
      avatarColor: "#6B8E23",
      resultat: "+150% croissance en 12 mois",
    },
    {
      id: 2,
      name: "Marc Lefebvre",
      entreprise: "Manufacturing Corp",
      texte:
        "La médiation a permis de résoudre un conflit interne qui durait depuis des mois. Professionnalisme et discrétion remarquables.",
      rating: 5,
      date: "22 Nov 2023",
      avatarColor: "#8B4513",
      resultat: "Conflit résolu en 3 semaines",
    },
  ];

  const getDefaultProcessus = (): EtapeProcessus[] => [
    {
      step: 1,
      title: "Diagnostic initial",
      description: "Analyse approfondie de votre situation",
      icon: "Search",
      color: colors.primaryDark,
      details: [
        "Entretien découverte",
        "Analyse documentaire",
        "Identification des enjeux",
      ],
    },
    {
      step: 2,
      title: "Proposition sur mesure",
      description: "Élaboration d'une approche personnalisée",
      icon: "Lightbulb",
      color: colors.success,
      details: [
        "Recommandations spécifiques",
        "Planning détaillé",
        "Budget prévisionnel",
      ],
    },
    {
      step: 3,
      title: "Mise en œuvre",
      description: "Accompagnement dans la réalisation",
      icon: "Rocket",
      color: colors.secondaryText,
      details: [
        "Suivi régulier",
        "Ajustements en temps réel",
        "Coordination des équipes",
      ],
    },
    {
      step: 4,
      title: "Suivi & Évaluation",
      description: "Mesure des résultats et capitalisation",
      icon: "BarChart",
      color: colors.accentGold,
      details: [
        "Tableaux de bord",
        "Reporting détaillé",
        "Recommandations finales",
      ],
    },
  ];

  const getDefaultAvantages = (): Avantage[] => [
    {
      title: "Expertise certifiée",
      description:
        "Nos conseillers sont certifiés et possèdent une expertise avérée",
      icon: "ShieldIcon",
      color: colors.primaryDark,
    },
    {
      title: "Approche sur mesure",
      description: "Chaque mission est adaptée à vos besoins spécifiques",
      icon: "TargetIcon",
      color: colors.success,
    },
    {
      title: "Confidentialité absolue",
      description: "Discrétion garantie dans toutes nos interventions",
      icon: "Shield",
      color: colors.secondaryText,
    },
    {
      title: "Résultats mesurables",
      description: "Des objectifs clairs avec des indicateurs de performance",
      icon: "TrendingUp",
      color: colors.accentGold,
    },
  ];

  const setDefaultData = () => {
    setConseilTypes(getDefaultConseilTypes());
    setConseillers(getDefaultConseillers());
    setStats(getDefaultStats());
    setTemoignages(getDefaultTemoignages());
    setProcessusConseil(getDefaultProcessus());
    setAvantages(getDefaultAvantages());
  };

  // Fonction helper pour obtenir l'icône
  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || BarChart;
  };

  // Fonction helper pour extraire les initiales d'un nom
  const getInitiales = (name: string) => {
    if (!name || typeof name !== "string") return "??";
    const parts = name.split(" ").filter((part) => part.length > 0);
    if (parts.length === 0) return "??";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Fonction pour obtenir l'URL de l'avatar de manière sécurisée
  const getAvatarUrl = (expert: Conseiller) => {
    if (expert.avatar) {
      // Vérifier si c'est une URL valide
      try {
        new URL(expert.avatar);
        return expert.avatar;
      } catch {
        // Si ce n'est pas une URL valide, utiliser une image par défaut
        return getDefaultAvatar(expert);
      }
    }
    return getDefaultAvatar(expert);
  };

  // Fonction pour obtenir un avatar par défaut basé sur les propriétés de l'expert
  const getDefaultAvatar = (expert: Conseiller) => {
    // Utiliser des images Unsplash par défaut basées sur le nom
    const nameHash = expert.name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const avatars = [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop",
    ];
    return avatars[nameHash % avatars.length];
  };

  // Filtrage
  const filteredTypes = conseilTypes.filter(
    (type) =>
      (activeCategory === "tous" || type.category === activeCategory) &&
      (type.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Processus affiché
  const displayedProcessus = showMoreProcess
    ? processusConseil
    : processusConseil.slice(0, 4);

  // Catégories
  const categories = [
    {
      value: "tous",
      label: "Tous les conseils",
      count: conseilTypes.length,
      color: colors.primaryDark,
    },
    {
      value: "audit",
      label: "Audit",
      count: conseilTypes.filter((t) => t.category === "audit").length,
      color: colors.primaryDark,
    },
    {
      value: "mediation",
      label: "Médiation",
      count: conseilTypes.filter((t) => t.category === "mediation").length,
      color: colors.success,
    },
    {
      value: "strategie",
      label: "Stratégie",
      count: conseilTypes.filter((t) => t.category === "strategie").length,
      color: colors.secondaryText,
    },
    {
      value: "juridique",
      label: "Juridique",
      count: conseilTypes.filter((t) => t.category === "juridique").length,
      color: colors.textPrimary,
    },
    {
      value: "finance",
      label: "Financier",
      count: conseilTypes.filter((t) => t.category === "finance").length,
      color: colors.accentGold,
    },
  ];

  const handleTypeSelect = (type: ConseilType) => {
    setSelectedType(type.id);
    setFormData((prev) => ({
      ...prev,
      conseilType: type.title,
      message: `Bonjour, je suis intéressé par votre conseil "${type.title}".\n\n${type.description}\n\nMes besoins spécifiques : `,
    }));
  };

  const handleConseillerSelect = (conseiller: Conseiller) => {
    setSelectedConseiller(conseiller);
    setFormData((prev) => ({
      ...prev,
      message: `Bonjour ${conseiller.name},\n\nJe souhaiterais prendre rendez-vous pour discuter de votre expertise en "${conseiller.specialty}".`,
      expertId: conseiller.id,
    }));
    setShowContactModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (
        !formData.nom ||
        !formData.email ||
        !formData.besoin ||
        !formData.conseilType
      ) {
        toast.error("Veuillez remplir tous les champs obligatoires", {
          description: "Nom, email, type de conseil et besoin sont requis",
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
        expertId: formData.expertId,
      };

      // Envoyer la demande via l'API
      const response = await conseilService.sendDemandeConseil(demandeData);

      if (response.success) {
        // Réinitialiser le formulaire
        setFormData({
          nom: userInfo
            ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim()
            : "",
          email: userInfo?.email || "",
          telephone: userInfo?.phone || "",
          entreprise: userInfo?.companyName || userInfo?.commercialName || "",
          besoin: "",
          conseilType: "",
          budget: "",
          message: "",
          expertId: null,
        });

        setSelectedConseiller(null);
        setShowContactModal(false);

        toast.success("Demande envoyée avec succès !", {
          description:
            response.message || "Un expert vous contactera dans les 24 heures.",
        });

        // Rediriger vers la page des demandes si connecté
        if (isAuthenticated) {
          setTimeout(() => {
            window.location.href = "/conseil";
          }, 2000);
        }
      } else {
        throw new Error(response.error || "Erreur lors de l'envoi");
      }
    } catch (error: any) {
      console.error("Erreur envoi demande:", error);

      if (
        error.message?.includes("Non authentifié") ||
        error.response?.status === 401
      ) {
        toast.error("Connexion requise", {
          description:
            "Veuillez vous connecter pour envoyer une demande de conseil",
          action: {
            label: "Se connecter",
            onClick: () => {
              window.location.href = "/login?redirect=/conseil";
            },
          },
        });
      } else {
        toast.error("Erreur lors de l'envoi", {
          description:
            error.message || "Une erreur est survenue. Veuillez réessayer.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenContactModal = () => {
    if (!isAuthenticated) {
      toast.info("Connexion recommandée", {
        description:
          "Pour un meilleur suivi, nous vous recommandons de vous connecter",
        action: {
          label: "Se connecter",
          onClick: () => {
            window.location.href = "/login?redirect=/conseil";
          },
        },
        duration: 5000,
      });
    }
    setShowContactModal(true);
  };

  const navigateToLogin = () => {
    setShowContactModal(false);
    window.location.href = "/login?redirect=/conseil";
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const cardHoverVariants = {
    initial: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Afficher un spinner pendant le chargement
  if (isDataLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.lightBg }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 rounded-full mx-auto mb-4"
            style={{
              borderColor: colors.primaryDark,
              borderTopColor: "transparent",
            }}
          />
          <p className="text-lg" style={{ color: colors.textPrimary }}>
            Chargement des conseils...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      {/* Hero Section - Simplifiée */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg')",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Conseil <span className="text-secondary-text">Expert</span>
          </h1>

          <p className="text-slate-300 text-sm mb-10">
            Des experts en audit stratégique et résolution de conflits pour
            accompagner votre entreprise vers l'excellence.
          </p>

          {/* AFFICHAGE CORRIGÉ DES STATISTIQUES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {Array.isArray(stats) && stats.length > 0 ? (
              stats.map((s, i) => {
                const IconComponent = getIconComponent(s.icon);
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10"
                  >
                    <div className="text-xl font-bold">{s.value}</div>
                    <div className="text-xs text-slate-300">{s.label}</div>
                  </div>
                );
              })
            ) : (
              // Fallback si stats n'est pas un tableau
              <>
                {getDefaultStats().map((s, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10"
                  >
                    <div className="text-xl font-bold">{s.value}</div>
                    <div className="text-xs text-slate-300">{s.label}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="px-6 py-2.5 rounded-xl bg-logo hover:bg-logo/80 font-semibold text-sm"
              onClick={() =>
                document
                  .getElementById("types-conseil")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Découvrir nos conseils
            </button>
            <button
              className="px-6 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm"
              onClick={handleOpenContactModal}
            >
              Demander un conseil
            </button>
            <Link
              to="/accompagnement"
              className="px-6 py-2.5 rounded-xl bg-secondary-text hover:bg-secondary-text/80 text-white font-semibold text-sm transition-colors"
            >
              Voir nos accompagnements
            </Link>
          </div>
        </div>
      </section>

      {/* Section Notre Processus */}
      <motion.section
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: colors.primaryDark }}
          >
            Notre <span style={{ color: colors.secondaryText }}>Processus</span>
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Une méthodologie éprouvée pour des résultats concrets et mesurables
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProcessus.map((etape) => {
            const IconComponent = getIconComponent(etape.icon);
            return (
              <motion.div
                key={etape.step}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <Card
                  className="p-6 h-full rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${etape.color}15`,
                          border: `2px solid ${etape.color}`,
                        }}
                      >
                        <IconComponent
                          className="h-6 w-6"
                          style={{ color: etape.color }}
                        />
                      </div>
                      <div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: etape.color }}
                      >
                        {etape.step}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        {etape.title}
                      </h3>
                      <p
                        className="text-sm mb-3"
                        style={{ color: colors.textSecondary }}
                      >
                        {etape.description}
                      </p>
                      <ul className="space-y-1">
                        {etape.details.map((detail, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            <CheckCircle
                              className="h-3 w-3 mr-2"
                              style={{ color: etape.color }}
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {processusConseil.length > 4 && (
          <motion.div className="text-center mt-8">
            <Button
              variant="outline"
              className="rounded-xl px-6 py-3 font-medium"
              style={{
                borderColor: colors.primaryDark,
                color: colors.primaryDark,
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

      {/* Section Types de Conseil */}
      <motion.section
        className="container mx-auto px-4 py-1"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        id="types-conseil"
        style={{ backgroundColor: `${colors.primaryDark}03` }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: colors.primaryDark }}
          >
            Nos{" "}
            <span style={{ color: colors.secondaryText }}>
              Domaines d'Expertise
            </span>
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto mb-8"
            style={{ color: colors.textSecondary }}
          >
            Des solutions de conseil sur mesure pour chaque besoin spécifique
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative mb-6">
              <Input
                placeholder="Rechercher un type de conseil..."
                className="pl-12 pr-4 py-3 rounded-xl border-2"
                style={{
                  borderColor: colors.separator,
                  backgroundColor: colors.cardBg,
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-4 top-3.5 h-5 w-5"
                style={{ color: colors.textSecondary }}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <motion.div key={category.value} whileHover={{ scale: 1.05 }}>
                  <Button
                    variant={
                      activeCategory === category.value ? "default" : "outline"
                    }
                    className="rounded-xl font-semibold px-4 py-2"
                    style={
                      activeCategory === category.value
                        ? {
                            backgroundColor: category.color,
                            color: colors.lightBg,
                          }
                        : {
                            borderColor: colors.separator,
                            color: colors.textPrimary,
                          }
                    }
                    onClick={() => setActiveCategory(category.value)}
                  >
                    {category.label}
                    <span
                      className="ml-2 px-1.5 py-0.5 text-xs rounded-full"
                      style={
                        activeCategory === category.value
                          ? {
                              backgroundColor: colors.lightBg + "20",
                            }
                          : {
                              backgroundColor: colors.separator + "40",
                            }
                      }
                    >
                      {category.count}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {filteredTypes.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
            variants={containerVariants}
          >
            {filteredTypes.map((type) => {
              const IconComponent = getIconComponent(type.icon);
              return (
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
                      <div
                        className="px-4 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: type.color }}
                      >
                        Recommandé
                      </div>
                    </div>
                  )}

                  <motion.div variants={cardHoverVariants} className="h-full">
                    <Card
                      className={`p-6 h-full rounded-2xl cursor-pointer transition-all duration-500 ${
                        selectedType === type.id ? "ring-2 ring-offset-2" : ""
                      }`}
                      style={{
                        borderColor:
                          selectedType === type.id
                            ? type.color
                            : colors.separator,
                        backgroundColor: colors.cardBg,
                        borderWidth: selectedType === type.id ? "2px" : "1px",
                      }}
                    >
                      <div
                        className={`w-14 h-14 mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          selectedType === type.id ? "scale-110" : ""
                        }`}
                        style={{
                          backgroundColor:
                            selectedType === type.id
                              ? type.color
                              : `${type.color}15`,
                        }}
                      >
                        <IconComponent
                          className={`h-6 w-6 transition-all duration-300 ${
                            selectedType === type.id ? "scale-110" : ""
                          }`}
                          style={{
                            color:
                              selectedType === type.id
                                ? colors.lightBg
                                : type.color,
                          }}
                        />
                      </div>

                      <h3
                        className="text-xl font-bold mb-3"
                        style={{ color: colors.textPrimary }}
                      >
                        {type.title}
                      </h3>

                      <p
                        className="leading-relaxed mb-4 text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {type.description}
                      </p>

                      <div className="mb-4">
                        <ul className="space-y-2">
                          {type.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle
                                className="h-4 w-4 flex-shrink-0 mt-0.5"
                                style={{ color: type.color }}
                              />
                              <span
                                className="text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {detail}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock
                            className="h-3 w-3"
                            style={{ color: colors.textSecondary }}
                          />
                          <span
                            className="text-xs font-medium"
                            style={{ color: colors.textPrimary }}
                          >
                            {type.duration}
                          </span>
                        </div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: type.color }}
                        >
                          {type.price}
                        </div>
                      </div>

                      <Button
                        className="w-full font-semibold rounded-xl gap-2 py-3 border-2"
                        variant={
                          selectedType === type.id ? "default" : "outline"
                        }
                        style={
                          selectedType === type.id
                            ? {
                                backgroundColor: type.color,
                                color: colors.lightBg,
                                borderColor: type.color,
                              }
                            : {
                                borderColor: type.color,
                                color: type.color,
                              }
                        }
                        onClick={() => handleTypeSelect(type)}
                      >
                        {selectedType === type.id
                          ? "✓ Sélectionné"
                          : "Choisir ce conseil"}
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div className="text-center py-12">
            <div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${colors.separator}30`,
                border: `2px dashed ${colors.separator}`,
              }}
            >
              <Search
                className="h-12 w-12"
                style={{ color: colors.textSecondary }}
              />
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
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
                color: colors.primaryDark,
              }}
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}
      </motion.section>

      {/* Section Nos Experts - CORRECTION ICI */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="p-8 lg:p-12">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: colors.textPrimary }}
            >
              Nos <span style={{ color: colors.secondaryText }}>Experts</span>
            </h2>
            <p
              className="text-lg max-w-3xl mx-auto"
              style={{ color: colors.textSecondary }}
            >
              Rencontrez notre équipe d'experts dédiés à votre réussite
            </p>
          </motion.div>

          {conseillers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {conseillers.map((conseiller) => {
                console.log("Rendu expert:", conseiller);
                return (
                  <motion.div
                    key={conseiller.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      className="p-6 rounded-2xl text-center h-full bg-white relative"
                      style={{
                        border: `2px solid ${colors.separator}`,
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      }}
                    >
                      {/* Badge disponibilité */}
                      <div
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10 ${
                          conseiller.disponibilite === "disponible"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : conseiller.disponibilite === "limitee"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {conseiller.disponibilite === "disponible"
                          ? "Disponible"
                          : conseiller.disponibilite === "limitee"
                          ? "Limité"
                          : "Complet"}
                      </div>

                      {/* Avatar de l'expert */}
                      <div className="w-24 h-24 rounded-full mx-auto mb-6 mt-2 relative overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={getAvatarUrl(conseiller)}
                          alt={conseiller.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback si l'image ne charge pas
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                      </div>

                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: colors.textPrimary }}
                      >
                        {conseiller.name || "Expert"}
                      </h3>

                      <div
                        className="inline-block px-3 py-1 rounded-full mb-3 text-sm font-semibold"
                        style={{
                          backgroundColor: `${colors.primaryDark}10`,
                          color: colors.primaryDark,
                          border: `1px solid ${colors.primaryDark}20`,
                        }}
                      >
                        {conseiller.title || "Expert Conseil"}
                      </div>

                      <p
                        className="text-sm mb-4 px-2"
                        style={{ color: colors.textSecondary }}
                      >
                        {conseiller.specialty || "Conseil stratégique"}
                      </p>

                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4"
                              style={{
                                color:
                                  i < Math.floor(conseiller.rating || 4)
                                    ? colors.warning
                                    : colors.separator,
                                fill:
                                  i < Math.floor(conseiller.rating || 4)
                                    ? colors.warning
                                    : "transparent",
                              }}
                            />
                          ))}
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: colors.textPrimary }}
                        >
                          {conseiller.rating
                            ? conseiller.rating.toFixed(1)
                            : "4.0"}
                        </span>
                      </div>

                      <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="text-center">
                          <div
                            className="text-lg font-bold"
                            style={{ color: colors.textPrimary }}
                          >
                            {conseiller.projets || 0}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            Projets
                          </div>
                        </div>
                        <div
                          className="h-8 w-px"
                          style={{ backgroundColor: colors.separator }}
                        ></div>
                        <div className="text-center">
                          <div
                            className="text-sm font-semibold"
                            style={{ color: colors.textPrimary }}
                          >
                            {conseiller.experience || "Expérience variable"}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            Expérience
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full font-semibold rounded-xl gap-2"
                        style={{
                          backgroundColor: colors.primaryDark,
                          color: colors.lightBg,
                        }}
                        disabled={conseiller.disponibilite === "complet"}
                        onClick={() => handleConseillerSelect(conseiller)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Contacter l'expert
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${colors.separator}30` }}
              >
                <Users
                  className="h-12 w-12"
                  style={{ color: colors.textSecondary }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: colors.textPrimary }}
              >
                Aucun expert disponible pour le moment
              </h3>
              <p className="text-lg" style={{ color: colors.textSecondary }}>
                Revenez plus tard pour découvrir nos experts
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Section Avantages */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card
          className="rounded-3xl overflow-hidden border-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.logo} 100%)`,
            color: colors.lightBg,
          }}
        >
          <div className="p-8 lg:p-12">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                Nos <span style={{ color: colors.accentGold }}>Avantages</span>
              </h2>
              <p className="text-lg max-w-3xl mx-auto text-white/80">
                Ce qui fait la différence dans notre approche du conseil
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {avantages.map((avantage, index) => {
                const IconComponent = getIconComponent(avantage.icon);
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="p-6 rounded-2xl h-full border-0 bg-white/10 backdrop-blur-sm">
                      <div
                        className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center mx-auto"
                        style={{ backgroundColor: `${avantage.color}30` }}
                      >
                        <IconComponent
                          className="h-7 w-7"
                          style={{ color: avantage.color }}
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">
                        {avantage.title}
                      </h3>
                      <p className="text-sm text-white/80">
                        {avantage.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
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
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: colors.primaryDark }}
          >
            Ils nous font{" "}
            <span style={{ color: colors.secondaryText }}>Confiance</span>
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto mb-8"
            style={{ color: colors.textSecondary }}
          >
            Découvrez les retours d'expérience de nos clients conseillés
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.isArray(temoignages) && temoignages.length > 0 ? (
            temoignages.map((temoignage) => (
              <motion.div
                key={temoignage.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="p-6 rounded-2xl h-full border-0 shadow-lg"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                      style={{
                        backgroundColor:
                          temoignage.avatarColor || colors.primaryDark,
                      }}
                    >
                      {getInitiales(temoignage.name)}
                    </div>
                    <div>
                      <h4
                        className="font-bold"
                        style={{ color: colors.textPrimary }}
                      >
                        {temoignage.name || "Client"}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {temoignage.entreprise || "Entreprise"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        style={{
                          color:
                            i < Math.floor(temoignage.rating || 5)
                              ? colors.accentGold
                              : colors.separator,
                          fill:
                            i < Math.floor(temoignage.rating || 5)
                              ? colors.accentGold
                              : "transparent",
                        }}
                      />
                    ))}
                  </div>

                  <p
                    className="italic mb-6 leading-relaxed"
                    style={{ color: colors.textSecondary, fontSize: "0.95rem" }}
                  >
                    "{temoignage.texte || "Aucun témoignage disponible"}"
                  </p>

                  <div
                    className="mt-4 pt-4 border-t"
                    style={{ borderColor: colors.separator }}
                  >
                    <div className="flex justify-between items-center">
                      <div
                        className="text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        {temoignage.date || new Date().toLocaleDateString()}
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: colors.success,
                          color: colors.lightBg,
                        }}
                      >
                        {temoignage.resultat || "Résultat positif"}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            // Si pas de témoignages, afficher un message
            <div className="col-span-3 text-center py-12">
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${colors.separator}30` }}
              >
                <MessageCircle
                  className="h-12 w-12"
                  style={{ color: colors.textSecondary }}
                />
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: colors.textPrimary }}
              >
                Aucun témoignage pour le moment
              </h3>
              <p className="text-lg" style={{ color: colors.textSecondary }}>
                Soyez le premier à partager votre expérience
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA Final */}
      <section className="py-16" style={{ backgroundColor: colors.lightBg }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl lg:text-4xl font-bold mb-6"
              style={{ color: colors.primaryDark }}
            >
              Prêt à{" "}
              <span style={{ color: colors.secondaryText }}>
                optimiser votre entreprise
              </span>{" "}
              ?
            </h2>
            <p
              className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              Nos experts en conseil sont à votre disposition pour analyser
              votre situation et vous proposer des solutions sur mesure qui
              génèrent des résultats concrets.
            </p>

            <div className="flex flex-wrap gap-4 m-2 justify-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  className="rounded-xl  text-lg font-semibold"
                  style={{
                    backgroundColor: colors.primaryDark,
                    color: colors.lightBg,
                  }}
                  onClick={handleOpenContactModal}
                >
                  <Calendar className="h-5 w-5 " />
                  Demander un conseil personnalisé
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  className="rounded-xl px-10 py-5 text-lg font-semibold"
                  style={{
                    borderColor: colors.primaryDark,
                    color: colors.primaryDark,
                  }}
                  onClick={() =>
                    document
                      .getElementById("types-conseil")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Lightbulb className="h-5 w-5" />
                  Explorer tous nos conseils
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal de Contact */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative z-10 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {selectedConseiller
                      ? `Contacter ${selectedConseiller.name}`
                      : "Demande de conseil"}
                  </h2>
                  {!isAuthenticated && (
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: `${colors.warning}15`,
                        color: colors.warning,
                      }}
                    >
                      <AlertCircle className="h-3 w-3" />
                      <span>Non connecté</span>
                    </div>
                  )}
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Un expert vous répondra sous 24h
                </p>

                {!isAuthenticated && (
                  <div
                    className="mt-2 p-2 rounded-lg text-xs"
                    style={{ backgroundColor: `${colors.primaryDark}08` }}
                  >
                    <p
                      className="flex items-center gap-1"
                      style={{ color: colors.textSecondary }}
                    >
                      <User className="h-3 w-3" />
                      <span>Pour un meilleur suivi, </span>
                      <button
                        type="button"
                        className="font-semibold hover:underline"
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
                className="h-10 w-10 p-0 rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitContact} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Nom *
                  </label>
                  <Input
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    disabled={isAuthenticated && userInfo?.firstName}
                    className="w-full rounded-xl"
                    style={{
                      borderColor: colors.separator,
                      backgroundColor:
                        isAuthenticated && userInfo?.firstName
                          ? `${colors.separator}15`
                          : "white",
                    }}
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isAuthenticated && userInfo?.email}
                    className="w-full rounded-xl"
                    style={{
                      borderColor: colors.separator,
                      backgroundColor:
                        isAuthenticated && userInfo?.email
                          ? `${colors.separator}15`
                          : "white",
                    }}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Téléphone *
                </label>
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  disabled={isAuthenticated && userInfo?.phone}
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator,
                    backgroundColor:
                      isAuthenticated && userInfo?.phone
                        ? `${colors.separator}15`
                        : "white",
                  }}
                  placeholder="Votre numéro"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Entreprise
                </label>
                <Input
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleInputChange}
                  disabled={isAuthenticated && userInfo?.companyName}
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator,
                    backgroundColor:
                      isAuthenticated && userInfo?.companyName
                        ? `${colors.separator}15`
                        : "white",
                  }}
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Type de conseil recherché *
                </label>
                <Select
                  value={formData.conseilType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, conseilType: value })
                  }
                  required
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {conseilTypes.map((type) => {
                      const IconComponent = getIconComponent(type.icon);
                      return (
                        <SelectItem key={type.id} value={type.title}>
                          <div className="flex items-center gap-2">
                            <IconComponent
                              className="h-4 w-4"
                              style={{ color: type.color }}
                            />
                            {type.title}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Votre besoin spécifique *
                </label>
                <Textarea
                  name="besoin"
                  value={formData.besoin}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full rounded-xl resize-none"
                  placeholder="Décrivez votre situation et vos objectifs..."
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Budget estimé
                </label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) =>
                    setFormData({ ...formData, budget: value })
                  }
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Sélectionnez une tranche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1k-5k">1 000€ - 5 000€</SelectItem>
                    <SelectItem value="5k-10k">5 000€ - 10 000€</SelectItem>
                    <SelectItem value="10k+">Plus de 10 000€</SelectItem>
                    <SelectItem value="surdevis">
                      Sur devis personnalisé
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Message complémentaire
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl resize-none"
                  placeholder="Informations supplémentaires..."
                />
              </div>

              {selectedConseiller && (
                <div
                  className="p-3 rounded-lg flex items-center gap-3"
                  style={{ backgroundColor: `${colors.primaryDark}08` }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedConseiller.avatarColor }}
                  >
                    {getInitiales(selectedConseiller.name)}
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      Demande adressée à {selectedConseiller.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      {selectedConseiller.title}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedConseiller(null);
                      setFormData((prev) => ({ ...prev, expertId: null }));
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full font-semibold gap-2 py-4 rounded-xl"
                style={{
                  backgroundColor: colors.primaryDark,
                  color: colors.lightBg,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Envoi en cours...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {isAuthenticated
                      ? "ENVOYER MA DEMANDE"
                      : "ENVOYER SANS CONNEXION"}
                  </>
                )}
              </Button>

              <div
                className="text-center pt-4 border-t"
                style={{ borderColor: colors.separator }}
              >
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Vos informations sont traitées de manière confidentielle.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConseilPage;
