// components/pro/ProSidebar.jsx
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
} from "lucide-react";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";

const navigation = [
  // === TABLEAU DE BORD ===
  { name: "Tableau de Bord", href: "/pro", icon: LayoutDashboard },

  // === GESTION DES ANNONCES & SERVICES ===
  { name: "Mes Annonces", href: "/pro/listings", icon: Building2 },
  { name: "Mes Services", href: "/pro/services", icon: Wrench },
  {
    name: "Art et commerce Services",
    href: "/pro/Art-commerce-services",
    icon: Wrench,
  },
  { name: "Mes services Bien-etre", href: "/pro/harmonie", icon: Leaf },

  // === GESTION DES RÉSERVATIONS & COMMANDES ===
  { name: "Mon Agenda", href: "/pro/calendar", icon: Calendar },
  {
    name: "Reservations tourisme",
    href: "/pro/reservations",
    icon: ShoppingBag,
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
  // { name: "Mes Clients", href: "/pro/clients", icon: Users },

  // === DOCUMENTS & MÉDIAS ===
  { name: "Mes Documents", href: "/pro/documents", icon: FileText },
  // 🔥 NOUVEL ITEM : Gestion des Médias
  // {
  //   name: "Gestion des Médias",
  //   href: "/pro/media",
  //   icon: Video,
  // },

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
        return notifications.pendingOrders;
      case "Messages":
        return notifications.messages;
      case "Réservations":
        return notifications.reservations;
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
  const getNavigationSections = () => {
    const sections = {
      tableauDeBord: [],
      annoncesServices: [],
      reservationsCommandes: [],
      produits: [],
      demandes: [],
      financier: [],
      contacts: [],
      documentsMedias: [],
      education: [],
      avisParametres: [],
    };

    navigation.forEach((item) => {
      // Tableau de bord
      if (item.name === "Tableau de Bord") {
        sections.tableauDeBord.push(item);
      }
      // Annonces & Services
      else if (
        ["Mes Annonces", "Mes Services", "Mes services Bien-etre"].includes(
          item.name
        )
      ) {
        sections.annoncesServices.push(item);
      }
      // Réservations & Commandes
      else if (
        [
          "Mon Agenda",
          "Reservations tourisme",
          "Reservations bien-être",
          "Mes Commandes",
        ].includes(item.name)
      ) {
        sections.reservationsCommandes.push(item);
      }
      // Produits
      else if (["Tourisme", "Mes Produits"].includes(item.name)) {
        sections.produits.push(item);
      }
      // Demandes
      else if (
        item.name.includes("Demandes") ||
        item.name.includes("demandes")
      ) {
        sections.demandes.push(item);
      }
      // Financier
      else if (
        [
          "Mon abonnements",
          "Devis & Factures",
          "Liste des services financiers",
        ].includes(item.name)
      ) {
        sections.financier.push(item);
      }
      // Contacts
      else if (["Listes des Contacts messages"].includes(item.name)) {
        sections.contacts.push(item);
      }
      // Documents & Médias
      else if (["Mes Documents"].includes(item.name)) {
        sections.documentsMedias.push(item);
      }
      // Éducation (commenté)
      else if (item.name.includes("Cours")) {
        sections.education.push(item);
      }
      // Avis & Paramètres
      else if (["Avis", "Paramètres"].includes(item.name)) {
        sections.avisParametres.push(item);
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
            const isActive = getIsActive(item.href);
            const notificationCount = getNotificationCount(item.name);
            const showNotification = shouldShowNotification(item.name);
            const notificationColor = getNotificationColor(item.name);

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
                <item.icon
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
        <Link to="/pro" className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-[#FFFFFF] border-black border-2">
            <img
              src={logo}
              alt="OLIPLUSLogo"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">SERVO</h1>
            <p className="text-xs text-[#8B4513]">Espace Pro</p>
          </div>
        </Link>
      </div>

      {/* Navigation avec sections */}
      <nav className="flex-1 space-y-1 overflow-y-auto h-screen p-4">
        <Section title="Tableau de bord" items={sections.tableauDeBord} />
        <Section
          title="Annonces & Services"
          items={sections.annoncesServices}
        />
        <Section
          title="Réservations & Commandes"
          items={sections.reservationsCommandes}
        />
        <Section title="Produits" items={sections.produits} />
        <Section title="Demandes" items={sections.demandes} />
        <Section title="Financier" items={sections.financier} />
        <Section title="Contacts" items={sections.contacts} />
        <Section title="Documents & Médias" items={sections.documentsMedias} />
        {sections.education.length > 0 && (
          <Section title="Éducation" items={sections.education} />
        )}
        <Section title="Avis & Paramètres" items={sections.avisParametres} />
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
