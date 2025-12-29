import {
  Rocket,
  Briefcase,
  Scale,
  Megaphone,
  Calculator,
  ScaleIcon,
  Brain,
  Coins,
  BarChart3,
  TargetIcon,
  LucideIcon,
} from "lucide-react";

export interface Service {
  id: number;
  nom: string;
  description: string;
  icon: LucideIcon;
  category: string;
  details?: string;
  color: string;
  features: string[];
}

export interface ServiceCategory {
  value: string;
  label: string;
  color: string;
  icon: LucideIcon;
}

export const servicesEntreprisePro: Service[] = [
  {
    id: 1,
    nom: "Création d'entreprise",
    description:
      "Accompagnement complet pour la création de votre entreprise : choix du statut, formalités juridiques, immatriculation",
    icon: Rocket,
    category: "creation",
    details:
      "Statuts juridiques, immatriculation, domiciliation, formalités administratives",
    color: "#6B8E23", // primaryDark
    features: [
      "Choix du statut juridique",
      "Rédaction des statuts",
      "Immatriculation",
      "Domiciliation d'entreprise",
    ],
  },
  {
    id: 2,
    nom: "Rachat d'entreprise",
    description:
      "Acquisition d'entreprises existantes : due diligence, négociation, transmission",
    icon: Briefcase,
    category: "rachat",
    details:
      "Évaluation, vérification comptable, négociation, transmission de fonds de commerce",
    color: "#8B4513", // secondaryText
    features: [
      "Due diligence",
      "Évaluation financière",
      "Négociation",
      "Transmission juridique",
    ],
  },
  {
    id: 3,
    nom: "Cession",
    description:
      "Conseil et accompagnement pour la cession ou la liquidation de votre entreprise",
    icon: Scale,
    category: "cession",
    details:
      "Préparation à la cession, recherche d'acquéreurs, procédures de liquidation",
    color: "#F39C12", // warning
    features: [
      "Évaluation de l'entreprise",
      "Recherche d'acquéreurs",
      "Négociations",
      "Procédures légales",
    ],
  },
  {
    id: 4,
    nom: "Communication & Marketing",
    description:
      "Stratégies de communication et marketing digital pour développer votre entreprise",
    icon: Megaphone,
    category: "communication",
    details:
      "Stratégie digitale, branding, réseaux sociaux, publicité en ligne",
    color: "#9B59B6", // Violet pour communication
    features: [
      "Stratégie digitale",
      "Branding",
      "Social Media",
      "Campagnes publicitaires",
    ],
  },
  {
    id: 5,
    nom: "Comptabilité & Fiscalité",
    description:
      "Gestion comptable complète et optimisation fiscale pour votre entreprise",
    icon: Calculator,
    category: "comptabilite",
    details: "Tenue de comptabilité, déclarations fiscales, TVA, bilan annuel",
    color: "#2C3E50", // textPrimary
    features: [
      "Comptabilité générale",
      "Déclarations fiscales",
      "TVA",
      "Bilans annuels",
    ],
  },
  {
    id: 6,
    nom: "Conseil Juridique",
    description: "Accompagnement juridique et conseil en droit des affaires",
    icon: ScaleIcon,
    category: "juridique",
    details:
      "Droit des sociétés, contrats commerciaux, propriété intellectuelle, litiges",
    color: "#E74C3C", // error
    features: [
      "Droit des sociétés",
      "Contrats commerciaux",
      "Propriété intellectuelle",
      "Résolution de litiges",
    ],
  },
  {
    id: 7,
    nom: "Conseils & Accompagnement",
    description:
      "Coaching stratégique et accompagnement personnalisé pour entrepreneurs",
    icon: Brain,
    category: "conseil",
    details:
      "Stratégie d'entreprise, développement commercial, gestion d'équipe, pivot",
    color: "#3498DB", // Bleu pour conseil
    features: [
      "Stratégie business",
      "Développement commercial",
      "Gestion opérationnelle",
      "Coaching dirigeant",
    ],
  },
  {
    id: 8,
    nom: "Financement & Subventions",
    description:
      "Aide à l'obtention de financements, prêts et subventions pour entreprises",
    icon: Coins,
    category: "financement",
    details:
      "Business plan, recherche de financements, subventions, levée de fonds",
    color: "#27AE60", // success
    features: [
      "Business plan",
      "Recherche de financements",
      "Subventions",
      "Levée de fonds",
    ],
  },
  {
    id: 9,
    nom: "Transformation Digitale",
    description: "Accompagnement dans la digitalisation de votre entreprise",
    icon: BarChart3,
    category: "digital",
    details: "Solutions SaaS, automatisation, CRM, outils collaboratifs",
    color: "#556B2F", // logo
    features: [
      "Solutions SaaS",
      "Automatisation",
      "CRM",
      "Outils collaboratifs",
    ],
  },
  {
    id: 10,
    nom: "Développement International",
    description: "Conseil pour l'expansion internationale de votre entreprise",
    icon: TargetIcon,
    category: "international",
    details:
      "Étude de marchés étrangers, implantation à l'étranger, douanes et taxes",
    color: "#D35400", // Orange foncé
    features: [
      "Étude de marché",
      "Implantation internationale",
      "Logistique export",
      "Fiscalité internationale",
    ],
  }
];

export const serviceCategories: ServiceCategory[] = [
  {
    value: "tous",
    label: "Tous les services",
    color: "#6B8E23",
    icon: Briefcase,
  },
  { value: "creation", label: "Création", color: "#6B8E23", icon: Rocket },
  { value: "rachat", label: "Rachat", color: "#8B4513", icon: Briefcase },
  { value: "cession", label: "Cession", color: "#F39C12", icon: Scale },
  {
    value: "communication",
    label: "Communication",
    color: "#9B59B6",
    icon: Megaphone,
  },
  {
    value: "comptabilite",
    label: "Comptabilité",
    color: "#2C3E50",
    icon: Calculator,
  },
  {
    value: "juridique",
    label: "Juridique",
    color: "#E74C3C",
    icon: ScaleIcon,
  },
  { value: "conseil", label: "Conseil", color: "#3498DB", icon: Brain },
  {
    value: "financement",
    label: "Financement",
    color: "#27AE60",
    icon: Coins,
  },
  { value: "digital", label: "Digital", color: "#556B2F", icon: BarChart3 },
  {
    value: "international",
    label: "International",
    color: "#D35400",
    icon: TargetIcon,
  },
];