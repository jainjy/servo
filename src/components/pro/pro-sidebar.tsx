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
  { name: "Tableau de Bord", href: "/pro", icon: LayoutDashboard },
  { name: "Mes Annonces", href: "/pro/listings", icon: Building2 },
  { name: "Mes Services", href: "/pro/services", icon: Wrench },
  {
    name: "Art et commerce Services",
    href: "/pro/Art-commerce-services",
    icon: Wrench,
  },
  { name: "Harmonie", href: "/pro/harmonie", icon: Leaf },
  { name: "Mon Agenda", href: "/pro/calendar", icon: Calendar },
  { name: "Mes Documents", href: "/pro/documents", icon: FileText },
  { name: "Abonnements", href: "/pro/subscription", icon: WalletCards },
  // { name: "Mes Clients", href: "/pro/clients", icon: Users },
  { name: "Devis & Factures", href: "/pro/billing", icon: FileText },
  { name: "Tourisme", href: "/pro/tourisme", icon: Plane },
  { name: "Mes Produits", href: "/pro/products", icon: ShoppingBag },
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
    name: "Listes des Contacts messages",
    href: "/pro/contact-messages",
    icon: Contact2Icon,
  },
  {
    name: "Mes Demandes de financement",
    href: "/pro/financement-demandes",
    icon: Building2,
  },
  { name: "Mes Demandes de services", href: "/pro/demandes", icon: FileText },
  {
    name: "Liste des services financiers",
    href: "/pro/financement-services",
    icon: Wallet2Icon,
  },
  {
    name: "Les demandes de devis",
    href: "/pro/demandes-devis",
    icon: FileText,
  },
  {
    name: "Cours à Domicile",
    href: "/pro/cours-domicile",
    icon: BookOpen,
  },
  { name: "Reservations Cours", href: "/pro/reservations-cours", icon: Plus },
  // 🔥 NOUVEL ITEM : Gestion des Médias
  {
    name: "Gestion des Médias",
    href: "/pro/media",
    icon: Video,
  },
  { name: "Avis", href: "/pro/reviews", icon: Star },
  { name: "Paramètres", href: "/pro/settings", icon: Settings },
];
// const navigationPrestataire = [
//   { name: "Tableau de Bord", href: "/pro", icon: LayoutDashboard },
//   { name: "Mes Services", href: "/pro/services", icon: Wrench },
//   {
//     name: "Art et commerce Services",
//     href: "/pro/Art-commerce-services",
//     icon: Wrench,
//   },
//   { name: "Harmonie", href: "/pro/harmonie", icon: Leaf },
//   { name: "Mes Planning", href: "/pro/calendar", icon: Calendar },
//   { name: "Mes Documents", href: "/pro/documents", icon: FileText },
//   // { name: "Mes Clients", href: "/pro/clients", icon: Users },
//   { name: "Devis & Factures", href: "/pro/billing", icon: FileText },
//   { name: "Mes Produits", href: "/pro/products", icon: ShoppingBag },
//   { name: "Reservations", href: "/pro/reservations", icon: ShoppingBag },
//   {
//     name: "Mes Commandes",
//     href: "/pro/orders",
//     icon: ShoppingCart,
//   },
//   { name: "Mes Demandes de services", href: "/pro/demandes", icon: FileText },
//   {
//     name: "Les demandes de devis",
//     href: "/pro/demandes-devis",
//     icon: FileText,
//   },
//   {
//     name: "Gestion des Médias",
//     href: "/pro/media",
//     icon: Video,
//   },
//   { name: "Avis", href: "/pro/reviews", icon: Star },
//   { name: "Paramètres", href: "/pro/settings", icon: Settings },
// ];
// const navigationBienEtre = [
//   { name: "Tableau de Bord", href: "/pro", icon: LayoutDashboard },

//   { name: "Harmonie", href: "/pro/harmonie", icon: Leaf },
//   { name: "Mes Planning", href: "/pro/calendar", icon: Calendar },
//   { name: "Mes Documents", href: "/pro/documents", icon: FileText },
//   // { name: "Mes Clients", href: "/pro/clients", icon: Users },
//   { name: "Devis & Factures", href: "/pro/billing", icon: FileText },
//   { name: "Reservations", href: "/pro/reservations", icon: ShoppingBag },
//   {
//     name: "Mes Commandes",
//     href: "/pro/orders",
//     icon: ShoppingCart,
//   },
//   { name: "Mes Demandes de services", href: "/pro/demandes", icon: FileText },
//   {
//     name: "Liste demande immobilier",
//     href: "/pro/demandes-immobilier",
//     icon: Building2,
//   },
//   {
//     name: "Gestion des Médias",
//     href: "/pro/media",
//     icon: Video,
//   },
//   { name: "Avis", href: "/pro/reviews", icon: Star },
//   { name: "Paramètres", href: "/pro/settings", icon: Settings },
// ];

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
        return "bg-orange-500 text-white";
      case "Messages":
        return "bg-red-500 text-white";
      case "Réservations":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const sidebarContent = (
    <>
      {/* Logo & header */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Link to='/pro' className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-white border-black border-2">
            <img src={logo} alt="Servo Logo" className="w-10 h-10 rounded-full" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              SERVO
            </h1>
            <p className="text-xs text-muted-foreground">Espace Pro</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto h-screen p-4">
        {navigation.map((item) => {
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
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-muted-foreground"
                )}
              />
              <span className="flex-1">{item.name}</span>

              {/* Notifications dynamiques */}
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
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile: header */}
      <div className="flex md:hidden  items-center h-16 border-b border-sidebar-border px-4  w-screen fixed top-0 left-0 z-40">
        <div className="flex items-center gap-2">
          <Link to='/pro'>
            <div className="p-1 rounded-full bg-white border-black border-2">
              <img src={logo} alt="Servo Logo" className="w-8 h-8 rounded-full" />
            </div>
            {/* <div>
              <h1 className="text-sm font-semibold text-sidebar-foreground">
                SERVO
              </h1>
              <p className="text-xs text-muted-foreground">Espace Pro</p>
            </div> */}
          </Link>
        </div>


        {/* Bouton menu mobile */}
        <button
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile: Drawer sidebar */}
      <aside
        className={cn(
          "fixed bg-white inset-y-0 left-0 top-0 w-64 flex-col border-r border-sidebar-border z-50 transition-transform duration-300 ease-in-out md:hidden",
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