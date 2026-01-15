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
  // Permissions par catégorie de professionnel
  allowedCategories?: string[];
  // Exclusions par catégorie
  excludedCategories?: string[];
}

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

// Tous les items de navigation possibles
const allNavigationItems: NavigationItem[] = [
  // === TABLEAU DE BORD ===
  { name: "Tableau de Bord", href: "/pro", icon: LayoutDashboard },

  // === GESTION DES ANNONCES & SERVICES ===
  {
    name: "Mes Annonces",
    href: "/pro/listings",
    icon: Building2,
    allowedCategories: ["immobilier", "ameublement", "tourisme", "commerçant"],
  },
  {
    name: "Mes Services",
    href: "/pro/services",
    icon: Wrench,
    allowedCategories: [
      "prestataire",
      "artisan",
      "sante",
      "transport",
      "restauration",
      "evenementiel",
      "conseil",
    ],
  },
  {
    name: "Mes projets",
    href: "/pro/projet",
    icon: Hammer,
    allowedCategories: ["artisan", "prestataire", "immobilier"],
  },

  // === ÉVÉNEMENTS & DÉCOUVERTES ===
  {
    name: "Événements & Découvertes",
    href: "/pro/events-discoveries",
    icon: CalendarDays,
    allowedCategories: ["evenementiel", "tourisme", "default"],
  },

  // === ART ET CRÉATION ===
  {
    name: "Art et Creation",
    href: "/pro/art-et-creation-page",
    icon: Brush,
    allowedCategories: ["artisan", "prestataire", "default"],
  },

  // === EMPLOI & FORMATIONS ===
  {
    name: "Gestion des Formations",
    href: "/pro/gestion-formations",
    icon: GraduationCap,
    allowedCategories: ["education", "prestataire", "conseil"],
  },
  {
    name: "Gestion des Offres d'Emploi",
    href: "/pro/gestion-emplois",
    icon: Briefcase,
    allowedCategories: ["default"], // Tous peuvent publier des offres
  },
  {
    name: "Gestion Alternance/Stages",
    href: "/pro/gestion-alternance",
    icon: Book,
    allowedCategories: ["default"], // Tous peuvent publier des stages
  },

  // === GESTION DES RÉSERVATIONS & COMMANDES ===
  {
    name: "Mon Agenda",
    href: "/pro/calendar",
    icon: Calendar,
    allowedCategories: [
      "prestataire",
      "artisan",
      "sante",
      "transport",
      "restauration",
      "evenementiel",
      "conseil",
      "education",
    ],
  },
  {
    name: "Reservations tourisme",
    href: "/pro/reservations",
    icon: ShoppingBag,
    allowedCategories: ["tourisme", "evenementiel"],
  },
  {
    name: "Gestion de locations des vehicules",
    href: "/pro/vehicules",
    icon: Car,
    allowedCategories: ["transport"],
  },
  {
    name: "Reservations bien-être",
    href: "/pro/reservationbien-etre",
    icon: ShoppingBag,
    allowedCategories: ["sante", "prestataire"],
  },
  {
    name: "Mes Commandes",
    href: "/pro/orders",
    icon: ShoppingCart,
    allowedCategories: ["commerçant", "ameublement", "artisan", "prestataire"],
  },
  {
    name: "Reservations Cours",
    href: "/pro/reservations-cours",
    icon: Plus,
    allowedCategories: ["education"],
  },

  // === GESTION DES PRODUITS ===
  {
    name: "Tourisme",
    href: "/pro/tourisme",
    icon: Plane,
    allowedCategories: ["tourisme"],
  },
  {
    name: "Mes Produits",
    href: "/pro/products",
    icon: ShoppingBag,
    allowedCategories: ["commerçant", "ameublement"],
  },

  // === GESTION DES DEMANDES ===
  {
    name: "Mes Demandes de financement",
    href: "/pro/financement-demandes",
    icon: Building2,
    allowedCategories: ["default"], // Tous peuvent faire des demandes
  },
  {
    name: "Mes Demandes de services",
    href: "/pro/demandes",
    icon: FileText,
    allowedCategories: ["prestataire", "artisan"],
  },
  {
    name: "Liste demande immobilier",
    href: "/pro/demandes-immobilier",
    icon: Building2,
    allowedCategories: ["immobilier"],
  },
  {
    name: "Les demandes de devis",
    href: "/pro/demandes-devis",
    icon: FileText,
    allowedCategories: ["artisan", "prestataire", "conseil"],
  },
  {
    name: "Demandes de conseil et accompagnement",
    href: "/pro/conseil",
    icon: Briefcase,
    allowedCategories: ["conseil"],
  },

  // === GESTION FINANCIÈRE ===
  {
    name: "Mon abonnements",
    href: "/pro/subscription",
    icon: WalletCards,
    allowedCategories: ["default"], // Tous ont des abonnements
  },
  {
    name: "Devis & Factures",
    href: "/pro/billing",
    icon: FileText,
    allowedCategories: ["default"], // Tous ont des factures
  },
  {
    name: "Liste des services financiers",
    href: "/pro/financement-services",
    icon: Wallet2Icon,
    allowedCategories: ["finance", "default"],
  },

  // === GESTION DES CONTACTS & MESSAGES ===
  {
    name: "Listes des Contacts messages",
    href: "/pro/contact-messages",
    icon: Contact2Icon,
    allowedCategories: ["default"], // Tous ont des contacts
  },

  // === DOCUMENTS & MÉDIAS ===
  {
    name: "Mes Documents",
    href: "/pro/documents",
    icon: FileText,
    allowedCategories: ["default"], // Tous ont des documents
  },

  // === ÉDUCATION ===
  {
    name: "Cours à Domicile",
    href: "/pro/cours-domicile",
    icon: BookOpen,
    allowedCategories: ["education"],
  },

  // === AVIS & PARAMÈTRES ===
  {
    name: "Avis",
    href: "/pro/reviews",
    icon: Star,
    allowedCategories: ["default"], // Tous ont des avis
  },
  {
    name: "Paramètres",
    href: "/pro/settings",
    icon: Settings,
    allowedCategories: ["default"], // Tous ont des paramètres
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

// Mapper les rôles/catégories d'utilisateur
const getUserProfessionalCategory = (
  user: User | null
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

export function ProSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const [userCategory, setUserCategory] =
    useState<ProfessionalCategory>("default");
  const [filteredNavigation, setFilteredNavigation] = useState<
    NavigationItem[]
  >([]);
  const { user } = useAuth();
  const { notifications, loading } = useOrderNotifications();

  useEffect(() => {
    if (user) {
      const category = getUserProfessionalCategory(user);
      setUserCategory(category);

      // Filtrer les items selon la catégorie de l'utilisateur
      const filtered = allNavigationItems.filter((item) => {
        // Si l'item a des catégories autorisées spécifiques
        if (item.allowedCategories && item.allowedCategories.length > 0) {
          return (
            item.allowedCategories.includes(category) ||
            item.allowedCategories.includes("default")
          );
        }

        // Si l'item a des catégories exclues
        if (item.excludedCategories && item.excludedCategories.length > 0) {
          return !item.excludedCategories.includes(category);
        }

        // Par défaut, on affiche l'item
        return true;
      });

      setFilteredNavigation(filtered);
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

  // Fonction pour grouper les éléments par catégorie
  const getNavigationSections = (): NavigationSections => {
    const sections: NavigationSections = {};

    // Initialiser toutes les sections
    Object.keys(categoryConfig.categories).forEach((categoryKey) => {
      sections[categoryKey] = [];
    });
    sections.default = [];

    // Trier les éléments non classés
    const unassignedItems = [...filteredNavigation];
    const assignedItems = new Set<string>();

    // Assigner chaque élément à sa catégorie
    Object.entries(categoryConfig.categories).forEach(
      ([categoryKey, config]) => {
        filteredNavigation.forEach((item) => {
          if (!assignedItems.has(item.name) && config.matcher(item)) {
            sections[categoryKey].push(item);
            assignedItems.add(item.name);

            // Retirer de la liste des non assignés
            const index = unassignedItems.findIndex(
              (i) => i.name === item.name
            );
            if (index !== -1) {
              unassignedItems.splice(index, 1);
            }
          }
        });
      }
    );

    // Ajouter les éléments non classés à la catégorie par défaut
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
                    : "text-gray-900 hover:bg-[#6B8E23]/5 hover:text-[#556B2F]"
                )}
              >
                <IconComponent
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isActive ? "text-[#556B2F]" : "text-[#8B4513]"
                  )}
                />
                <span className="flex-1">{item.name}</span>

                {showNotification && (
                  <span
                    className={cn(
                      "ml-auto text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1 font-medium",
                      notificationColor,
                      notificationCount > 99 ? "text-[10px]" : "text-xs"
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
      {/* Logo & header avec indication de la catégorie */}
      <div className="flex h-16 items-center justify-between border-b border-[#D3D3D3] px-6">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <ServoLogo />
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-[#8B4513]">Espace Pro</p>
            <span className="text-xs px-2 py-0.5 bg-[#556B2F]/10 text-[#556B2F] rounded-full capitalize">
              {userCategory}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation avec sections */}
      <nav className="flex-1 space-y-1 overflow-y-auto h-screen p-4">
        {/* Afficher toutes les sections qui ont des éléments */}
        {Object.entries(categoryConfig.categories).map(
          ([categoryKey, config]) => (
            <Section
              key={categoryKey}
              title={config.title}
              items={sections[categoryKey] || []}
              categoryKey={categoryKey}
            />
          )
        )}

        {/* Afficher la section "Autres" si elle contient des éléments */}
        {sections.default && sections.default.length > 0 && (
          <Section
            title={categoryConfig.defaultCategory.title}
            items={sections.default}
            categoryKey="default"
          />
        )}

        {/* Message si pas d'items disponibles */}
        {filteredNavigation.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun menu disponible pour votre catégorie.</p>
            <p className="text-sm mt-2">Contactez l'administrateur.</p>
          </div>
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
          <span className="text-xs px-2 py-0.5 bg-[#556B2F]/10 text-[#556B2F] rounded-full capitalize ml-2">
            {userCategory}
          </span>
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
          menuOpen ? "translate-x-0" : "-translate-x-full"
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
