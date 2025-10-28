import React, { useState } from "react";
// Remplacement du Link de Next.js par le Link de React Router DOM
import { Link, useLocation } from "react-router-dom";
// Remplacement de Image de Next.js par la balise <img>
import logo from "../../assets/logo.png";
// Les imports d'icônes Lucide et d'utilitaires restent les mêmes (assurez-vous d'avoir les dépendances)
import { cn } from "@/lib/utils"; // Assurez-vous que cette utilité existe et fonctionne
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Calendar,
  MessageSquare,
  Users,
  FileText,
  Star,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  Package,
  Menu,
  X,
  ShoppingBag,
  Leaf,
} from "lucide-react";
// Données de navigation (Inchangées)
const navigation = [
  { name: "Tableau de Bord", href: "/pro", icon: LayoutDashboard },
  { name: "Mes Annonces", href: "/pro/listings", icon: Building2 },
  { name: "Mes Services", href: "/pro/services", icon: Wrench },
  { name: "Harmonie", href: "/pro/harmonie", icon: Leaf },
  { name: "Mes Planning", href: "/pro/calendar", icon: Calendar },
  { name: "Mes Documents", href: "/pro/documents", icon: FileText },
  { name: "Mes Clients", href: "/pro/clients", icon: Users },
  { name: "Devis & Factures", href: "/pro/billing", icon: FileText },
  { name: "Tourisme", href: "/pro/tourisme", icon: FileText },
  { name: "Mes Produits", href: "/pro/products", icon: ShoppingBag },
  { name: "Mes Demandes", href: "/pro/demandes", icon: FileText },
  { name: "Liste demande immobilier", href: "/pro/demandes-immobilier", icon: Building2 },
  { name: "Avis", href: "/pro/reviews", icon: Star },
  { name: "Paramètres", href: "/pro/settings", icon: Settings },

];

export function ProSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const [menuOpen, setMenuOpen] = useState(false);

  // Définir la logique d'activité du lien
  const getIsActive = (href: string) => {
    // Pour les chemins exacts
    if (pathname === href) return true;
    if (href !== "/pro" && pathname.startsWith(href + "/")) return true;
    return false;
  };

  // Le contenu de la barre latérale pour le bureau et le mobile
  const sidebarContent = (
    <>
      {/* Logo & header */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="p-1 rounded-full bg-white border-black border-2">
          {/* Remplacement de <Image> par <img> */}
          <img
            src={logo}
            alt="Servo Logo"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            SERVO
          </h1>
          <p className="text-xs text-muted-foreground">Espace Pro</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          // Utilisation de la nouvelle fonction pour l'état actif
          const isActive = getIsActive(item.href);

          return (
            <Link
              key={item.name}
              to={item.href} // Remplacement de 'href' par 'to'
              onClick={() => setMenuOpen(false)} // Fermer le menu après la navigation mobile
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group",
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
              {item.name}
              {/* Notifications */}
              {item.name === "Messages" && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              )}
              {item.name === "Réservations" && (
                <span className="ml-auto bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  5
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

      {/* Mobile: header (Note: l'élément parent doit positionner correctement cette div) */}
      <div className="-z-0 flex md:hidden items-center h-16 border-b border-sidebar-border px-4 bg-sidebar w-screen fixed top-0 left-0">
        <div className="p-1 rounded-full  bg-white border-black border-2">
          {/* Remplacement de <Image> par <img> */}
          <img
            src={logo}
            alt="Servo Logo"
            className="w-10 h-10 rounded-full"
          />
        </div>

      </div>
       <button
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="absolute top-2 z-50 lg:hidden md:hidden right-28 ml-52 p-2 rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
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