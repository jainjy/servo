// components/pro/ProSidebar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Calendar,
  FileText,
  Star,
  Settings,
  Menu,
  X,
  ShoppingBag,
  ShoppingCart,
  Car,
  Brush,
  Briefcase,
  GraduationCap,
  Book,
  Users,
  Hammer,
  CalendarDays,
  WalletCards,
  Wallet2Icon,
  Contact2Icon,
  Plane,
  BookOpen,
  Plus,
} from "lucide-react";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import ServoLogo from "../components/ServoLogo";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";

// Interface pour les items de navigation
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  userTypes?: UserType[]; // Types d'utilisateurs autorisés (optionnel = tous)
}

// Types d'utilisateurs basés sur les plans
export type UserType =
  | "AGENCE"
  | "VENDEUR"
  | "PRESTATAIRE"
  | "ARTISAN"
  | "TOURISME"
  | "BIEN_ETRE"
  | "default";

// Types de professionnels
export type ProfessionalCategory =
  | "immobilier"
  | "ameublement"
  | "prestataire"
  | "artisan"
  | "commerçant"
  | "tourisme"
  | "education"
  | "sante"
  | "transport"
  | "restauration"
  | "evenementiel"
  | "finance"
  | "conseil"
  | "default";

interface CategoryConfig {
  title: string;
  matcher: (item: NavigationItem) => boolean;
}

interface CategoryConfigMap {
  [key: string]: CategoryConfig;
}

// Tous les items de navigation possibles avec filtrage par userType
const allNavigationItems: NavigationItem[] = [
  // === TABLEAU DE BORD ===
  {
    name: "Tableau de Bord",
    href: "/pro",
    icon: LayoutDashboard,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },

  // === GESTION DES ANNONCES & SERVICES ===
  {
    name: "Mes Annonces",
    href: "/pro/listings",
    icon: Building2,
    userTypes: ["AGENCE", "VENDEUR", "TOURISME"],
  },
  {
    name: "Mes Services",
    href: "/pro/services",
    icon: Wrench,
    userTypes: ["PRESTATAIRE", "ARTISAN", "BIEN_ETRE"],
  },
  {
    name: "Mes projets",
    href: "/pro/projet",
    icon: Hammer,
    userTypes: ["AGENCE", "VENDEUR", "PRESTATAIRE", "ARTISAN"],
  },

  // === ÉVÉNEMENTS & DÉCOUVERTES ===
  {
    name: "Événements & Découvertes",
    href: "/pro/events-discoveries",
    icon: CalendarDays,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },

  // === ART ET CRÉATION ===
  {
    name: "Art et Creation",
    href: "/pro/art-et-creation-page",
    icon: Brush,
    userTypes: ["ARTISAN"],
  },

  // === EMPLOI & FORMATIONS ===
  {
    name: "Gestion des Formations",
    href: "/pro/gestion-formations",
    icon: GraduationCap,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },
  {
    name: "Gestion des Offres d'Emploi",
    href: "/pro/gestion-emplois",
    icon: Briefcase,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },
  {
    name: "Gestion Alternance/Stages",
    href: "/pro/gestion-alternance",
    icon: Book,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },

  // === GESTION DES RÉSERVATIONS & COMMANDES ===
  {
    name: "Mon Agenda",
    href: "/pro/calendar",
    icon: Calendar,
    userTypes: ["PRESTATAIRE", "ARTISAN", "BIEN_ETRE"],
  },
  {
    name: "Reservations tourisme",
    href: "/pro/reservations",
    icon: ShoppingBag,
    userTypes: ["TOURISME"],
  },
  {
    name: "Gestion de locations des vehicules",
    href: "/pro/vehicules",
    icon: Car,
    userTypes: ["TOURISME", "PRESTATAIRE", "ARTISAN"],
  },
  {
    name: "Reservations bien-être",
    href: "/pro/reservationbien-etre",
    icon: ShoppingBag,
    userTypes: ["BIEN_ETRE"],
  },
  {
    name: "Mes Commandes",
    href: "/pro/orders",
    icon: ShoppingCart,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },
  {
    name: "Reservations Cours",
    href: "/pro/reservations-cours",
    icon: Plus,
    userTypes: ["BIEN_ETRE"],
  },

  // === GESTION DES PRODUITS ===
  {
    name: "Tourisme",
    href: "/pro/tourisme",
    icon: Plane,
    userTypes: ["TOURISME"],
  },
  {
    name: "Mes Produits",
    href: "/pro/products",
    icon: ShoppingBag,
    userTypes: ["AGENCE", "VENDEUR", "TOURISME"],
  },

  // === GESTION DES DEMANDES ===
  {
    name: "Mes Demandes de financement",
    href: "/pro/financement-demandes",
    icon: Building2,
    userTypes: ["AGENCE", "VENDEUR", "PRESTATAIRE", "ARTISAN"],
  },
  {
    name: "Mes Demandes de services",
    href: "/pro/demandes",
    icon: FileText,
    userTypes: ["AGENCE", "VENDEUR"],
  },
  {
    name: "Liste demande immobilier",
    href: "/pro/demandes-immobilier",
    icon: Building2,
    userTypes: ["AGENCE", "VENDEUR"],
  },
  {
    name: "Les demandes de devis",
    href: "/pro/demandes-devis",
    icon: FileText,
    userTypes: ["PRESTATAIRE", "ARTISAN"],
  },
  {
    name: "Demandes de conseil et accompagnement",
    href: "/pro/conseil",
    icon: Briefcase,
    userTypes: ["AGENCE", "VENDEUR", "PRESTATAIRE", "ARTISAN"],
  },

  // === GESTION FINANCIÈRE ===
  {
    name: "Mon abonnements",
    href: "/pro/subscription",
    icon: WalletCards,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },
  {
    name: "Devis & Factures",
    href: "/pro/billing",
    icon: FileText,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },
  {
    name: "Liste des services financiers",
    href: "/pro/financement-services",
    icon: Wallet2Icon,
    userTypes: ["AGENCE", "VENDEUR"],
  },

  // === GESTION DES CONTACTS & MESSAGES ===
  {
    name: "Listes des Contacts messages",
    href: "/pro/contact-messages",
    icon: Contact2Icon,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },

  // === DOCUMENTS & MÉDIAS ===
  {
    name: "Mes Documents",
    href: "/pro/documents",
    icon: FileText,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },

  // === ÉDUCATION ===
  {
    name: "Cours à Domicile",
    href: "/pro/cours-domicile",
    icon: BookOpen,
    userTypes: ["BIEN_ETRE"],
  },

  // === AVIS & PARAMÈTRES ===
  {
    name: "Avis",
    href: "/pro/reviews",
    icon: Star,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },
  {
    name: "Paramètres",
    href: "/pro/settings",
    icon: Settings,
    userTypes: [
      "AGENCE",
      "VENDEUR",
      "PRESTATAIRE",
      "ARTISAN",
      "TOURISME",
      "BIEN_ETRE",
    ],
  },
];

// Configuration des catégories (groupement visuel)
const categoryConfig: {
  categories: CategoryConfigMap;
  defaultCategory: CategoryConfig;
} = {
  categories: {
    tableauDeBord: {
      title: "Tableau de bord",
      matcher: (item) => item.name === "Tableau de Bord",
    },
    evenementsDecouvertes: {
      title: "Événements & Découvertes",
      matcher: (item) =>
        item.name.includes("Événements") || item.name.includes("Découvertes"),
    },
    annoncesServices: {
      title: "Annonces & Services",
      matcher: (item) =>
        [
          "Mes Annonces",
          "Mes Services",
          "Art et Creation",
          "Mes projets",
        ].includes(item.name),
    },
    emploiFormations: {
      title: "Emploi & Formations",
      matcher: (item) =>
        item.name.includes("Formations") ||
        item.name.includes("Emploi") ||
        item.name.includes("Alternance") ||
        item.name.includes("Stages"),
    },
    reservationsCommandes: {
      title: "Réservations & Commandes",
      matcher: (item) =>
        item.name.includes("Réservations") ||
        item.name.includes("Reservations") ||
        item.name.includes("Commandes") ||
        item.name.includes("Agenda") ||
        item.name.includes("véhicules"),
    },
    produits: {
      title: "Produits",
      matcher: (item) => ["Tourisme", "Mes Produits"].includes(item.name),
    },
    demandes: {
      title: "Demandes",
      matcher: (item) =>
        item.name.toLowerCase().includes("demande") ||
        item.name.toLowerCase().includes("devis"),
    },
    financier: {
      title: "Financier",
      matcher: (item) =>
        item.name.includes("abonnements") ||
        item.name.includes("Factures") ||
        item.name.includes("financiers"),
    },
    contacts: {
      title: "Contacts",
      matcher: (item) => item.name.includes("Contacts"),
    },
    documentsMedias: {
      title: "Documents & Médias",
      matcher: (item) => ["Mes Documents"].includes(item.name),
    },
    education: {
      title: "Éducation",
      matcher: (item) => item.name.includes("Cours"),
    },
    avisParametres: {
      title: "Avis & Paramètres",
      matcher: (item) => ["Avis", "Paramètres"].includes(item.name),
    },
  },

  defaultCategory: {
    title: "Autres",
    matcher: () => true,
  },
};

// Interface pour les sections
interface NavigationSections {
  [key: string]: NavigationItem[];
}

// Mapper les rôles/catégories d'utilisateur (pour affichage seulement)
const getUserProfessionalCategory = (
  user: User | null,
): ProfessionalCategory => {
  if (!user || !user.role) return "default";

  const userCategory =
    user.professionalCategory || user.category || user.role.toLowerCase();

  // Mapping des rôles vers les catégories
  const categoryMap: Record<string, ProfessionalCategory> = {
    // Immobilier
    agent_immobilier: "immobilier",
    immobilier: "immobilier",
    real_estate: "immobilier",

    // Ameublement
    ameublement: "ameublement",
    furniture: "ameublement",
    decorateur: "ameublement",

    // Prestataires de services
    prestataire: "prestataire",
    service_provider: "prestataire",
    freelance: "prestataire",

    // Artisans
    artisan: "artisan",
    craftsman: "artisan",
    plombier: "artisan",
    electricien: "artisan",

    // Commerçants
    commercant: "commerçant",
    merchant: "commerçant",
    boutique: "commerçant",

    // Tourisme
    tourisme: "tourisme",
    tour_operator: "tourisme",
    hotel: "tourisme",

    // Éducation
    enseignant: "education",
    teacher: "education",
    formateur: "education",

    // Santé
    sante: "sante",
    health: "sante",
    therapeute: "sante",

    // Transport
    transport: "transport",
    driver: "transport",
    livreur: "transport",

    // Restauration
    restauration: "restauration",
    restaurant: "restauration",
    catering: "restauration",

    // Événementiel
    evenementiel: "evenementiel",
    event: "evenementiel",
    organisateur: "evenementiel",

    // Finance
    finance: "finance",
    financial: "finance",
    conseiller_financier: "finance",

    // Conseil
    conseil: "conseil",
    consultant: "conseil",
    advisor: "conseil",
  };

  return categoryMap[userCategory] || "default";
};

// Mapper les userTypes à partir des données utilisateur
const getUserType = (user: User | null): UserType => {
  if (!user) return "default";

  // Priorité: userType direct > planType > rôle
  const userType = user.userType || user.planType || user.role || "default";

  // Normaliser en majuscules pour correspondre aux plans
  const normalizedType = userType.toUpperCase();

  // Vérifier si c'est un type valide
  const validTypes: UserType[] = [
    "AGENCE",
    "VENDEUR",
    "PRESTATAIRE",
    "ARTISAN",
    "TOURISME",
    "BIEN_ETRE",
  ];

  return validTypes.includes(normalizedType as UserType)
    ? (normalizedType as UserType)
    : "default";
};

// Fonction pour filtrer les items de navigation selon le userType
const filterNavigationItemsByUserType = (
  items: NavigationItem[],
  userType: UserType,
): NavigationItem[] => {
  if (userType === "default") return items;

  return items.filter((item) => {
    // Si pas de userTypes spécifiés, l'item est visible pour tous
    if (!item.userTypes || item.userTypes.length === 0) return true;

    // Vérifie si le userType de l'utilisateur est dans la liste des userTypes autorisés
    return item.userTypes.includes(userType);
  });
};

export function ProSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const [userCategory, setUserCategory] =
    useState<ProfessionalCategory>("default");
  const [userType, setUserType] = useState<UserType>("default");
  const [filteredNavigationItems, setFilteredNavigationItems] = useState<
    NavigationItem[]
  >([]);
  const { user } = useAuth();
  const { notifications, loading } = useOrderNotifications();

  useEffect(() => {
    if (user) {
      const category = getUserProfessionalCategory(user);
      const type = getUserType(user);

      setUserCategory(category);
      setUserType(type);

      // Filtrer les items de navigation selon le userType
      const filteredItems = filterNavigationItemsByUserType(
        allNavigationItems,
        type,
      );
      setFilteredNavigationItems(filteredItems);
    }
  }, [user]);

  const getIsActive = (href: string) => {
    if (pathname === href) return true;
    if (href !== "/pro" && pathname.startsWith(href + "/")) return true;
    return false;
  };

  const getNotificationCount = (itemName: string) => {
    switch (itemName) {
      case "Mes Commandes":
        return notifications.pendingOrders || 0;
      case "Messages":
        return notifications.messages || 0;
      case "Réservations":
        return notifications.reservations || 0;
      default:
        return 0;
    }
  };

  const shouldShowNotification = (itemName: string) => {
    const count = getNotificationCount(itemName);
    return count > 0;
  };

  const getNotificationColor = (itemName: string) => {
    switch (itemName) {
      case "Mes Commandes":
        return "bg-[#8B4513] text-white";
      case "Messages":
        return "bg-red-500 text-white";
      case "Réservations":
        return "bg-[#556B2F] text-white";
      default:
        return "bg-[#D3D3D3] text-[#8B4513]";
    }
  };

  // Fonction pour grouper les éléments filtrés par catégorie
  const getNavigationSections = (): NavigationSections => {
    const sections: NavigationSections = {};

    // Initialiser toutes les sections
    Object.keys(categoryConfig.categories).forEach((categoryKey) => {
      sections[categoryKey] = [];
    });
    sections.default = [];

    // Trier les éléments filtrés non classés
    const unassignedItems = [...filteredNavigationItems];
    const assignedItems = new Set<string>();

    // Assigner chaque élément filtré à sa catégorie
    Object.entries(categoryConfig.categories).forEach(
      ([categoryKey, config]) => {
        filteredNavigationItems.forEach((item) => {
          if (!assignedItems.has(item.name) && config.matcher(item)) {
            sections[categoryKey].push(item);
            assignedItems.add(item.name);

            // Retirer de la liste des non assignés
            const index = unassignedItems.findIndex(
              (i) => i.name === item.name,
            );
            if (index !== -1) {
              unassignedItems.splice(index, 1);
            }
          }
        });
      },
    );

    // Ajouter les éléments filtrés non classés à la catégorie par défaut
    sections.default = [...unassignedItems];

    return sections;
  };

  const sections = getNavigationSections();

  // Composant Section
  interface SectionProps {
    title: string;
    items: NavigationItem[];
    categoryKey: string;
  }

  const Section: React.FC<SectionProps> = ({ title, items, categoryKey }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = getIsActive(item.href);
            const notificationCount = getNotificationCount(item.name);
            const showNotification = shouldShowNotification(item.name);
            const notificationColor = getNotificationColor(item.name);
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group relative",
                  isActive
                    ? "bg-[#6B8E23]/10 text-[#556B2F] shadow-sm"
                    : "text-gray-900 hover:bg-[#6B8E23]/5 hover:text-[#556B2F]",
                )}
              >
                <IconComponent
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isActive ? "text-[#556B2F]" : "text-[#8B4513]",
                  )}
                />
                <span className="flex-1">{item.name}</span>

                {showNotification && (
                  <span
                    className={cn(
                      "ml-auto text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1 font-medium",
                      notificationColor,
                      notificationCount > 99 ? "text-[10px]" : "text-xs",
                    )}
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo & header avec indication de la catégorie et userType */}
      <div className="flex h-20 items-center justify-between border-b border-[#D3D3D3] px-6">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <ServoLogo />
          </Link>
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-xs text-[#8B4513]">Espace Pro</p>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs px-2 py-0.5 bg-[#556B2F]/10 text-[#556B2F] rounded-full capitalize">
                {userCategory}
              </span>
              <span className="text-xs px-2 py-0.5 bg-[#8B4513]/10 text-[#8B4513] rounded-full uppercase">
                {userType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation avec sections filtrées */}
      <nav className="flex-1 space-y-1 overflow-y-auto h-[calc(100vh-5rem)] p-4">
        {/* Afficher toutes les sections qui ont des éléments filtrés */}
        {Object.entries(categoryConfig.categories).map(
          ([categoryKey, config]) => (
            <Section
              key={categoryKey}
              title={config.title}
              items={sections[categoryKey] || []}
              categoryKey={categoryKey}
            />
          ),
        )}

        {/* Afficher la section "Autres" si elle contient des éléments filtrés */}
        {sections.default && sections.default.length > 0 && (
          <Section
            title={categoryConfig.defaultCategory.title}
            items={sections.default}
            categoryKey="default"
          />
        )}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#D3D3D3] bg-[#FFFFFF]">
        {sidebarContent}
      </aside>

      {/* Mobile: header */}
      <div className="flex md:hidden items-center h-16 border-b border-[#D3D3D3] px-4 w-screen fixed top-0 left-0 z-40 bg-white">
        <div className="flex items-center gap-2">
          <Link to="/pro">
            <div className="p-1 rounded-full bg-[#FFFFFF] border-black border-2">
              <img
                src={logo}
                alt="OLIPLUSLogo"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </Link>
          <div className="flex flex-col ml-2">
            <span className="text-xs px-1 py-0.5 bg-[#556B2F]/10 text-[#556B2F] rounded-full capitalize text-[10px]">
              {userCategory}
            </span>
            <span className="text-xs px-1 py-0.5 bg-[#8B4513]/10 text-[#8B4513] rounded-full uppercase text-[10px] mt-1">
              {userType}
            </span>
          </div>
        </div>

        {/* Bouton menu mobile */}
        <button
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto p-2 rounded-lg text-gray-900 hover:bg-[#6B8E23]/10"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile: Drawer sidebar */}
      <aside
        className={cn(
          "fixed bg-[#FFFFFF] inset-y-0 left-0 top-0 w-64 flex-col border-r border-[#D3D3D3] z-50 transition-transform duration-300 ease-in-out md:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile: Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer menu"
        />
      )}
    </>
  );
}
