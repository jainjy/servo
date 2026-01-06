// components/pro/ProSidebar.tsx
import { useState } from "react";
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
  Leaf,
  ShoppingCart,
  Video,
  Plane,
  BookOpen,
  Plus,
  WalletCards,
  Wallet2Icon,
  UserCircle2,
  Contact2Icon,
  Car,
  Brush,
  Briefcase,
  GraduationCap,
  Book,
  Users,
  Hammer,
  CalendarDays,
  MapPin,
  Globe,
} from "lucide-react";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import ServoLogo from "../components/ServoLogo";

// Interface pour les items de navigation
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Interface pour les catégories
interface CategoryConfig {
  title: string;
  matcher: (item: NavigationItem) => boolean;
}

interface CategoryConfigMap {
  [key: string]: CategoryConfig;
}

const navigation: NavigationItem[] = [
  // === TABLEAU DE BORD ===
  { name: "Tableau de Bord", href: "/pro", icon: LayoutDashboard },

  // === GESTION DES ANNONCES & SERVICES ===
  { name: "Mes Annonces", href: "/pro/listings", icon: Building2 },
  { name: "Mes Services", href: "/pro/services", icon: Wrench },
  { name: "Mes projets", href: "/pro/projet", icon: Hammer },
  
  // === ÉVÉNEMENTS & DÉCOUVERTES === 🔥 NOUVELLE SECTION
  { 
    name: "Événements & Découvertes", 
    href: "/pro/events-discoveries", 
    icon: CalendarDays 
  },
  
  // === ART ET CRÉATION ===
  {
    name: "Art et Creation",
    href: "/pro/art-et-creation-page",
    icon: Brush,
  },

  // === EMPLOI & FORMATIONS ===
  {
    name: "Gestion des Formations",
    href: "/pro/gestion-formations",
    icon: GraduationCap,
  },
  {
    name: "Gestion des Offres d'Emploi",
    href: "/pro/gestion-emplois",
    icon: Briefcase,
  },
  {
    name: "Gestion Alternance/Stages",
    href: "/pro/gestion-alternance",
    icon: Book,
  },

  // === GESTION DES RÉSERVATIONS & COMMANDES ===
  { name: "Mon Agenda", href: "/pro/calendar", icon: Calendar },
  {
    name: "Reservations tourisme",
    href: "/pro/reservations",
    icon: ShoppingBag,
  },
  {
    name: "Gestion de locations des vehicules",
    href: "/pro/vehicules",
    icon: Car,
  },
  {
    name: "Reservations bien-être",
    href: "/pro/reservationbien-etre",
    icon: ShoppingBag,
  },
  {
    name: "Mes Commandes",
    href: "/pro/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reservations Cours",
    href: "/pro/reservations-cours",
    icon: Plus,
  },

  // === GESTION DES PRODUITS ===
  { name: "Tourisme", href: "/pro/tourisme", icon: Plane },
  { name: "Mes Produits", href: "/pro/products", icon: ShoppingBag },

  // === GESTION DES DEMANDES ===
  {
    name: "Mes Demandes de financement",
    href: "/pro/financement-demandes",
    icon: Building2,
  },
  { name: "Mes Demandes de services", href: "/pro/demandes", icon: FileText },
  {
    name: "Liste demande immobilier",
    href: "/pro/demandes-immobilier",
    icon: Building2,
  },
  {
    name: "Les demandes de devis",
    href: "/pro/demandes-devis",
    icon: FileText,
  },
  {
    name: "Demandes de conseil et accompagnement",
    href: "/pro/conseil",
    icon: Briefcase,
  },

  // === GESTION FINANCIÈRE ===
  { name: "Mon abonnements", href: "/pro/subscription", icon: WalletCards },
  { name: "Devis & Factures", href: "/pro/billing", icon: FileText },
  {
    name: "Liste des services financiers",
    href: "/pro/financement-services",
    icon: Wallet2Icon,
  },

  // === GESTION DES CONTACTS & MESSAGES ===
  {
    name: "Listes des Contacts messages",
    href: "/pro/contact-messages",
    icon: Contact2Icon,
  },

  // === DOCUMENTS & MÉDIAS ===
  { name: "Mes Documents", href: "/pro/documents", icon: FileText },

  // === ÉDUCATION ===
  {
    name: "Cours à Domicile",
    href: "/pro/cours-domicile",
    icon: BookOpen,
  },

  // === AVIS & PARAMÈTRES ===
  { name: "Avis", href: "/pro/reviews", icon: Star },
  { name: "Paramètres", href: "/pro/settings", icon: Settings },

];

// Configuration des catégories
const categoryConfig: {
  categories: CategoryConfigMap;
  defaultCategory: CategoryConfig;
} = {
  categories: {
    tableauDeBord: {
      title: "Tableau de bord",
      matcher: (item) => item.name === "Tableau de Bord",
    },
    // === NOUVELLE CATÉGORIE ===
    evenementsDecouvertes: {
      title: "Événements & Découvertes",
      matcher: (item) => [
        "Événements & Découvertes",
        "Gestion des Événements", 
        "Gestion des Découvertes",
        "Admin Événements"
      ].includes(item.name),
    },
    annoncesServices: {
      title: "Annonces & Services",
      matcher: (item) =>
        [
          "Mes Annonces",
          "Mes Services",
          "Art et Creation",
          "Mes projets"
        ].includes(item.name),
    },
    emploiFormations: {
      title: "Emploi & Formations",
      matcher: (item) =>
        [
          "Gestion des Formations",
          "Gestion des Offres d'Emploi",
          "Gestion Alternance/Stages",
        ].includes(item.name),
    },
    reservationsCommandes: {
      title: "Réservations & Commandes",
      matcher: (item) =>
        [
          "Mon Agenda",
          "Reservations tourisme",
          "Gestion de locations des vehicules",
          "Reservations bien-être",
          "Mes Commandes",
          "Reservations Cours",
        ].includes(item.name),
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
        [
          "Mon abonnements",
          "Devis & Factures",
          "Liste des services financiers",
        ].includes(item.name),
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

export function ProSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const { notifications, loading } = useOrderNotifications();

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
    const unassignedItems = [...navigation];
    const assignedItems = new Set<string>();

    // Assigner chaque élément à sa catégorie
    Object.entries(categoryConfig.categories).forEach(
      ([categoryKey, config]) => {
        navigation.forEach((item) => {
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

  // Composant Section avec TypeScript
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
      {/* Logo & header */}
      <div className="flex h-16 items-center gap-2 border-b border-[#D3D3D3] px-6">
         <div>
          <Link to="/" className="flex items-center gap-2">
            <ServoLogo />
          </Link>
            <p className="text-xs text-[#8B4513] text-center">Espace Pro</p>
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