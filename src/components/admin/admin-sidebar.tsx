import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Wrench,
  Calendar,
  ShoppingBag,
  Plane,
  CreditCard,
  Newspaper,
  ShieldCheck,
  ChevronDown,
  MessageCircle,
  FileCheck,
  Ruler,
  Tag,
  FileText,
  WalletCards,
  Globe,
  Wallet2Icon,
  UserCog,
  Video,
  Image,
  Lightbulb,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import ServoLogo from "../components/ServoLogo";

const navigation = [
  // === DASHBOARD & ADMINISTRATION ===
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Audit", href: "/admin/audits", icon: ShieldCheck },

  // === ABONNEMENTS & FINANCES ===
  { name: "Abonnement Pro", href: "/admin/subscriptions", icon: WalletCards },
  { name: "Paiements", href: "/admin/payments", icon: CreditCard },

  // === GESTION DES ANNONCES & SERVICES ===
  { name: "Annonces", href: "/admin/listings", icon: Building2 },
  { name: "Services", href: "/admin/services", icon: Wrench },
  {
    name: "categorie de services",
    href: "/admin/service-categories",
    icon: Tag,
  },
  { name: "Métiers", href: "/admin/metiers", icon: Ruler },
  { name: "Entrepreneuriat", href: "/admin/entrepreneuriat", icon: Briefcase },

  // === GESTION DES RÉSERVATIONS & PRODUITS ===
  { name: "Réservations", href: "/admin/bookings", icon: Calendar },
  { name: "Produits", href: "/admin/products", icon: ShoppingBag },
  { name: "Tourisme", href: "/admin/tourism", icon: Plane },

  // === GESTION DES DEMANDES ===
  { name: "Demandes de services", href: "/admin/demandes", icon: FileCheck },
  { name: "Demandes de Conseil", href: "/admin/conseil", icon: UserCog },
  {
    name: "demandes de Financements",
    href: "/admin/financement-demandes",
    icon: FileText,
  },
  {
    name: "Investissement International",
    href: "/admin/investissement-demandes",
    icon: Globe,
  },
  { name: "Demandes de rendez-vous entreprise", href: "/admin/rendezvous", icon: Calendar },

  // === SERVICES FINANCIERS ===
  {
    name: "Liste des services financiers",
    href: "/admin/financement-services",
    icon: Wallet2Icon,
  },

  // === MARKETING & COMMUNICATION ===
  { name: "Publicité", href: "/admin/publicite", icon: MessageCircle },
  { name: "blog", href: "/admin/blog", icon: Newspaper },
  { name: "Portraits", href: "/admin/portraits", icon: Image },
  { name: "Gestion des Médias", href: "/admin/media", icon: Video },
  { name: "Bon Plans & Conseils", href: "/admin/conseils", icon: Lightbulb },
];

export function AdminSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fonction pour fermer le sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Fonction pour fermer le sidebar quand on clique sur un lien
  const handleLinkClick = () => {
    closeSidebar();
  };

  // Fermer le sidebar quand la route change
  useEffect(() => {
    closeSidebar();
  }, [pathname]);

  // Empêcher le scroll du body quand le sidebar est ouvert
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Fermer le sidebar avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Fonction pour grouper les éléments par catégorie
  const getNavigationSections = () => {
    const sections = {
      dashboard: [],
      finances: [],
      annoncesServices: [],
      reservationsProduits: [],
      demandes: [],
      servicesFinanciers: [],
      marketing: [],
    };

    navigation.forEach((item) => {
      if (["Dashboard", "Utilisateurs", "Audit"].includes(item.name)) {
        sections.dashboard.push(item);
      }
      else if (["Abonnement Pro", "Paiements"].includes(item.name)) {
        sections.finances.push(item);
      }
      else if (
        ["Annonces", "Services", "categorie de services", "Métiers", "Entrepreneuriat"].includes(
          item.name
        )
      ) {
        sections.annoncesServices.push(item);
      }
      else if (["Réservations", "Produits", "Tourisme"].includes(item.name)) {
        sections.reservationsProduits.push(item);
      }
      else if (
        item.name.includes("Demandes") ||
        item.name.includes("demandes") ||
        item.name === "Investissement International"
      ) {
        sections.demandes.push(item);
      }
      else if (
        item.name.includes("financiers") ||
        item.name.includes("Financement")
      ) {
        sections.servicesFinanciers.push(item);
      }
      else if (["Publicité", "blog", "Portraits", "Gestion des Médias", "Bon Plans & Conseils"].includes(item.name)) {
        sections.marketing.push(item);
      }
    });

    return sections;
  };

  const sections = getNavigationSections();

  const Section = ({ title, items }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#6B8E23]/10 text-[#556B2F]"
                    : "text-gray-900 hover:bg-[#6B8E23]/5 hover:text-[#556B2F]"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bouton Burger pour mobile */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#556B2F] text-white shadow-lg hover:bg-[#6B8E23] transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#D3D3D3] bg-[#FFFFFF] min-h-screen">
        <div className="flex h-16 items-center gap-2 border-b border-[#D3D3D3] px-6">
          <Link to="/" className="flex items-center gap-2">
            <ServoLogo />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <Section
            title="Dashboard & Administration"
            items={sections.dashboard}
          />
          <Section title="Abonnements & Finances" items={sections.finances} />
          <Section
            title="Annonces & Services"
            items={sections.annoncesServices}
          />
          <Section
            title="Réservations & Produits"
            items={sections.reservationsProduits}
          />
          <Section title="Demandes" items={sections.demandes} />
          <Section
            title="Services Financiers"
            items={sections.servicesFinanciers}
          />
          <Section
            title="Marketing & Communication"
            items={sections.marketing}
          />
        </nav>
      </aside>

      {/* Sidebar mobile - Version slide depuis la gauche */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-[#FFFFFF] border-r border-[#D3D3D3] z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* En-tête du sidebar mobile */}
        <div className="flex h-16 items-center justify-between border-b border-[#D3D3D3] px-6">

          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Contenu du sidebar mobile */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="p-4">
            <Section
              title="Dashboard & Administration"
              items={sections.dashboard}
            />
            <Section title="Abonnements & Finances" items={sections.finances} />
            <Section
              title="Annonces & Services"
              items={sections.annoncesServices}
            />
            <Section
              title="Réservations & Produits"
              items={sections.reservationsProduits}
            />
            <Section title="Demandes" items={sections.demandes} />
            <Section
              title="Services Financiers"
              items={sections.servicesFinanciers}
            />
            <Section
              title="Marketing & Communication"
              items={sections.marketing}
            />
          </nav>
        </div>
      </aside>
    </>
  );
}