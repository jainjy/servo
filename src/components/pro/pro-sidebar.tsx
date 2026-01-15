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
  Heart,
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
  allowedCategories?: ProfessionalCategory[];
  // Exclusions par catégorie
  excludedCategories?: ProfessionalCategory[];
  // Priorité d'affichage (optionnel)
  priority?: number;
}

// Types de professionnels - Mise à jour
export type ProfessionalCategory = 
  | 'immobilier'
  | 'ameublement'
  | 'prestataire'
  | 'bien-etre'  // Renommé de 'sante' pour plus de clarté
  | 'default';

interface CategoryConfig {
  title: string;
  matcher: (item: NavigationItem) => boolean;
}

interface CategoryConfigMap {
  [key: string]: CategoryConfig;
}

// Tous les items de navigation possibles - REVU POUR CHAQUE CATÉGORIE
const allNavigationItems: NavigationItem[] = [
  // === TABLEAU DE BORD === (COMMUN À TOUS)
  { 
    name: "Tableau de Bord", 
    href: "/pro", 
    icon: LayoutDashboard,
    allowedCategories: ['immobilier', 'ameublement', 'prestataire', 'bien-etre', 'default'],
    priority: 0
  },

  // === IMMOBILIER ===
  { 
    name: "Mes Annonces Immobilier", 
    href: "/pro/listings", 
    icon: Building2,
    allowedCategories: ['immobilier'],
    priority: 1
  },
  { 
    name: "Projets Immobiliers", 
    href: "/pro/projet", 
    icon: Hammer,
    allowedCategories: ['immobilier'],
    priority: 2
  },
  {
    name: "Demandes de locations/achats",
    href: "/pro/demandes-immobilier",
    icon: FileText,
    allowedCategories: ['immobilier'],
    priority: 3
  },
  {
    name: "Mes Rendez-vous",
    href: "/pro/calendar",
    icon: Calendar,
    allowedCategories: ['immobilier'],
    priority: 4
  },

  // === AMEUBLEMENT ===
  { 
    name: "Mes Produits Ameublement", 
    href: "/pro/products", 
    icon: ShoppingBag,
    allowedCategories: ['ameublement'],
    priority: 1
  },
  { 
    name: "Mes Commandes", 
    href: "/pro/orders", 
    icon: ShoppingCart,
    allowedCategories: ['ameublement'],
    priority: 2
  },
  {
    name: "Devis & Factures",
    href: "/pro/billing",
    icon: FileText,
    allowedCategories: ['ameublement'],
    priority: 3
  },
  { 
    name: "Mon Art et Création", 
    href: "/pro/art-et-creation-page", 
    icon: Brush,
    allowedCategories: ['ameublement'],
    priority: 4
  },

  // === PRESTATAIRE DE SERVICES ===
  { 
    name: "Mes Services", 
    href: "/pro/services", 
    icon: Wrench,
    allowedCategories: ['prestataire'],
    priority: 1
  },
  { 
    name: "Mon Agenda", 
    href: "/pro/calendar", 
    icon: Calendar,
    allowedCategories: ['prestataire'],
    priority: 2
  },
  {
    name: "Demandes de devis",
    href: "/pro/demandes-devis",
    icon: FileText,
    allowedCategories: ['prestataire'],
    priority: 3
  },
  { 
    name: "Mes Projets", 
    href: "/pro/projet", 
    icon: Hammer,
    allowedCategories: ['prestataire'],
    priority: 4
  },
  {
    name: "Mes Formations",
    href: "/pro/gestion-formations",
    icon: GraduationCap,
    allowedCategories: ['prestataire'],
    priority: 5
  },

  // === BIEN-ÊTRE ===
  { 
    name: "Mes Prestations Bien-Être", 
    href: "/pro/services", 
    icon: Heart,
    allowedCategories: ['bien-etre'],
    priority: 1
  },
  { 
    name: "Mon Agenda Bien-Être", 
    href: "/pro/calendar", 
    icon: Calendar,
    allowedCategories: ['bien-etre'],
    priority: 2
  },
  {
    name: "Réservations Bien-Être",
    href: "/pro/reservationbien-etre",
    icon: ShoppingBag,
    allowedCategories: ['bien-etre'],
    priority: 3
  },
  {
    name: "Gestion des Rendez-vous",
    href: "/pro/reservations-cours",
    icon: Plus,
    allowedCategories: ['bien-etre'],
    priority: 4
  },

  // === COMMUNS À TOUS === (mais avec certaines exclusions)
  { 
    name: "Abonnement", 
    href: "/pro/subscription", 
    icon: WalletCards,
    allowedCategories: ['immobilier', 'ameublement', 'prestataire', 'bien-etre', 'default'],
    excludedCategories: [],
    priority: 90
  },
  { 
    name: "Mes Documents", 
    href: "/pro/documents", 
    icon: FileText,
    allowedCategories: ['immobilier', 'ameublement', 'prestataire', 'bien-etre', 'default'],
    excludedCategories: [],
    priority: 91
  },
  { 
    name: "Demandes Financement", 
    href: "/pro/financement-demandes", 
    icon: Building2,
    allowedCategories: ['immobilier', 'ameublement', 'prestataire', 'bien-etre', 'default'],
    priority: 92
  },
  { 
    name: "Services Financiers", 
    href: "/pro/financement-services", 
    icon: Wallet2Icon,
    allowedCategories: ['immobilier', 'ameublement', 'prestataire', 'bien-etre', 'default'],
    priority: 93
  },
  { 
    name: "Messages & Contacts", 
    href: "/pro/contact-messages", 
    icon: Contact2Icon,
    allowedCategories: ['immobilier', 'ameublement', 'prestataire', 'bien-etre', 'default'],
    priority: 94
  },
  { 
    name: "Avis Clients", 
    href: "/pro/reviews", 
    icon: Star,
    allowedCategories: ['immobilier', 'ameublement', 'prestataire', 'bien-etre', 'default'],
    priority: 95
  },
  { 
    name: "Paramètres", 
    href: "/pro/settings", 
    icon: Settings,
    allowedCategories: ['immobilier', 'ameublement', 'prestataire', 'bien-etre', 'default'],
    priority: 96
  },

  // === ÉVÉNEMENTS (Optionnel selon besoin) ===
  { 
    name: "Événements", 
    href: "/pro/events-discoveries", 
    icon: CalendarDays,
    allowedCategories: ['prestataire', 'bien-etre'], // Seulement prestataire et bien-être
    priority: 50
  },
];

// Configuration des catégories (groupement visuel) - SIMPLIFIÉE
const categoryConfig: {
  categories: CategoryConfigMap;
  defaultCategory: CategoryConfig;
} = {
  categories: {
    principal: {
      title: "Principal",
      matcher: (item) => item.priority! < 10,
    },
    gestion: {
      title: "Gestion",
      matcher: (item) => item.priority! >= 10 && item.priority! < 50,
    },
    evenements: {
      title: "Événements",
      matcher: (item) => item.name.includes("Événements"),
    },
    financier: {
      title: "Financier",
      matcher: (item) => 
        item.name.includes("abonnement") || 
        item.name.includes("Factures") || 
        item.name.includes("financier") ||
        item.name.includes("Financement"),
    },
    communication: {
      title: "Communication",
      matcher: (item) => 
        item.name.includes("Messages") || 
        item.name.includes("Contacts") ||
        item.name.includes("Avis"),
    },
    administration: {
      title: "Administration",
      matcher: (item) => 
        item.name.includes("Documents") || 
        item.name.includes("Paramètres"),
    },
  },

  defaultCategory: {
    title: "Autres",
    matcher: () => true,
  },
};

// Mapper les rôles/catégories d'utilisateur - SIMPLIFIÉ
const getUserProfessionalCategory = (user: User | null): ProfessionalCategory => {
  if (!user || !user.role) return 'default';
  
  const userCategory = (user.professionalCategory || user.category || user.role || '').toLowerCase();
  
  // Mapping simplifié pour les 4 catégories
  const categoryMap: Record<string, ProfessionalCategory> = {
    // Immobilier
    'immobilier': 'immobilier',
    'agent_immobilier': 'immobilier',
    'real_estate': 'immobilier',
    'propriétaire': 'immobilier',
    
    // Ameublement
    'ameublement': 'ameublement',
    'decorateur': 'ameublement',
    'furniture': 'ameublement',
    'artisanat': 'ameublement',
    
    // Prestataire
    'prestataire': 'prestataire',
    'prestataires': 'prestataire',
    'service': 'prestataire',
    'freelance': 'prestataire',
    'consultant': 'prestataire',
    'conseil': 'prestataire',
    
    // Bien-être
    'bien-etre': 'bien-etre',
    'bien_etre': 'bien-etre',
    'sante': 'bien-etre',
    'health': 'bien-etre',
    'therapeute': 'bien-etre',
    'coach': 'bien-etre',
    'yoga': 'bien-etre',
    'massage': 'bien-etre',
    'esthetique': 'bien-etre',
  };
  
  return categoryMap[userCategory] || 'default';
};

// Titres par catégorie pour l'affichage
const categoryTitles: Record<ProfessionalCategory, string> = {
  'immobilier': 'Professionnel Immobilier',
  'ameublement': 'Professionnel Ameublement',
  'prestataire': 'Prestataire de Services',
  'bien-etre': 'Professionnel Bien-Être',
  'default': 'Espace Professionnel'
};

export function ProSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const [userCategory, setUserCategory] = useState<ProfessionalCategory>('default');
  const [filteredNavigation, setFilteredNavigation] = useState<NavigationItem[]>([]);
  const { user } = useAuth();
  const { notifications, loading } = useOrderNotifications();

  useEffect(() => {
    if (user) {
      const category = getUserProfessionalCategory(user);
      setUserCategory(category);
      
      // Filtrer les items selon la catégorie de l'utilisateur
      const filtered = allNavigationItems.filter(item => {
        // Vérifier les exclusions d'abord
        if (item.excludedCategories && item.excludedCategories.includes(category)) {
          return false;
        }
        
        // Vérifier les permissions
        if (item.allowedCategories && item.allowedCategories.length > 0) {
          // Vérifier si la catégorie est autorisée
          // Ne pas inclure 'default' automatiquement sauf si explicitement listé
          return item.allowedCategories.includes(category);
        }
        
        // Si pas de allowedCategories défini, on n'affiche pas (sécurité)
        return false;
      }).sort((a, b) => {
        // Trier par priorité (plus petit = plus haut)
        const priorityA = a.priority || 100;
        const priorityB = b.priority || 100;
        return priorityA - priorityB;
      });
      
      console.log(`Catégorie utilisateur: ${category}`);
      console.log(`Items filtrés:`, filtered.map(i => i.name));
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
      case "Messages & Contacts":
        return notifications.messages || 0;
      case "Réservations Bien-Être":
        return notifications.reservations || 0;
      case "Demandes de devis":
        return notifications.quotes || 0;
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
      case "Messages & Contacts":
        return "bg-red-500 text-white";
      case "Réservations Bien-Être":
        return "bg-[#556B2F] text-white";
      case "Demandes de devis":
        return "bg-blue-500 text-white";
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

    // Trier les éléments filtrés
    filteredNavigation.forEach((item) => {
      let assigned = false;

      // Essayer de trouver une catégorie correspondante
      Object.entries(categoryConfig.categories).forEach(
        ([categoryKey, config]) => {
          if (!assigned && config.matcher(item)) {
            sections[categoryKey].push(item);
            assigned = true;
          }
        }
      );

      // Si aucune catégorie ne correspond, mettre dans "Autres"
      if (!assigned) {
        sections.default.push(item);
      }
    });

    // Supprimer les sections vides (sauf default si elle contient quelque chose)
    Object.keys(sections).forEach(key => {
      if (key !== 'default' && sections[key].length === 0) {
        delete sections[key];
      }
    });

    return sections;
  };

  const sections = getNavigationSections();

  // Composant Section
  interface SectionProps {
    title: string;
    items: NavigationItem[];
  }

  const Section: React.FC<SectionProps> = ({ title, items }) => {
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
                key={`${item.href}-${item.name}`}
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
            <p className="text-xs text-[#8B4513]">{categoryTitles[userCategory]}</p>
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
            sections[categoryKey] && (
              <Section
                key={categoryKey}
                title={config.title}
                items={sections[categoryKey]}
              />
            )
          )
        )}

        {/* Afficher la section "Autres" si elle contient des éléments */}
        {sections.default && sections.default.length > 0 && (
          <Section
            title={categoryConfig.defaultCategory.title}
            items={sections.default}
          />
        )}

        {/* Message si pas d'items disponibles */}
        {filteredNavigation.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun menu disponible pour votre catégorie.</p>
            <p className="text-sm mt-2">Contactez l'administrateur pour configurer vos accès.</p>
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