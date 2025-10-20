import React, { useState } from "react";
// Remplacement du Link et du usePathname de Next.js
import { Link, useLocation } from "react-router-dom"; 
import { cn } from "@/lib/utils"; // Utilitaire cn (à s'assurer qu'il est disponible)
import {
  LayoutDashboard, Users, Building2, Wrench, Calendar,
  ShoppingBag, Plane, CreditCard, Newspaper, Settings,
  ChevronUp, ChevronDown,
  MessageCircle,
  FileCheck,
} from "lucide-react";
// Remplacement de Image de next/image par la balise <img>
import logo from '../../assets/logo.png'; 

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    // { name: "Prestataires", href: "/admin/vendors", icon: Building2 },
    { name: "Annonces", href: "/admin/listings", icon: Building2 },
    { name: "Services", href: "/admin/services", icon: Wrench },
    { name: "blog", href: "/admin/blog", icon: Newspaper },
    { name: "Réservations", href: "/admin/bookings", icon: Calendar },
    { name: "Produits", href: "/admin/products", icon: ShoppingBag },
    // { name: "Tourisme", href: "/admin/tourism", icon: Plane },
    { name: "Paiements", href: "/admin/payments", icon: CreditCard },
    { name: "Demandes", href: "/admin/demandes", icon:  FileCheck, },
    { name: "Métiers", href: "/admin/metiers", icon:  FileCheck, },
    { name: "Paramètres", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  // Remplacement de usePathname (Next.js) par useLocation (React Router DOM)
  const location = useLocation();
  const pathname = location.pathname;
  
  const [showAll, setShowAll] = useState(false);

  // Séparation pour la barre mobile
  const mainIcons = navigation.slice(0, 3);
  const otherIcons = navigation.slice(3);

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="p-1 rounded-full bg-white border-black border-2">
            {/* Remplacement de <Image> par <img> */}
            <img src={logo} alt="Servo Logo" className="w-10 h-10 rounded-full" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">SERVO</h1>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            // Logique d'activité du lien pour les routes exactes (ajustez si vous voulez des correspondances partielles)
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href} // Remplacement de 'href' par 'to'
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Sidebar mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-sidebar-border py-1 shadow-lg md:hidden">
        <div className={cn(
          "grid gap-1 px-2 place-items-center",
          showAll ? "grid-cols-4 sm:grid-cols-4" : "grid-cols-4"
        )}>
           {/* Logo mobile (occupant la première colonne) */}
           <div className="p-1 w-14 h-14 grid place-items-center rounded-full bg-white border-black border-2">
            {/* Remplacement de <Image> par <img> */}
            <img src={logo} alt="Servo Logo" className="w-10 h-10 rounded-full" />
          </div>
          
          {/* Les 3 premières icônes principales */}
          {mainIcons.map((item, i) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href} // Remplacement de 'href' par 'to'
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded transition-colors",
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className={cn(
                  "mt-1 text-xs truncate",
                  isActive && "font-bold"
                )}>{item.name}</span>
              </Link>
            )
          })}
          
          {/* Bouton Plus/Moins : Attention au positionnement absolu dans la grid */}
          {/* NOTE: Le positionnement absolu dans une grille pour ce bouton "Plus" peut nécessiter un ajustement du conteneur parent ou une refonte pour le rendre réactif et stable. */}
          <button
            aria-label={showAll ? "Réduire" : "Voir plus"}
            onClick={() => setShowAll(v => !v)}
            // Le style a été ajusté pour rester dans le flux de la grille pour la colonne 4
            className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded transition-colors w-full h-full",
                "border-t shadow-lg border-sidebar-border font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
            )}
          >
            {showAll ? <ChevronUp className="h-6 w-6" />
               : <ChevronDown className="h-6 w-6" />}
            <span className="mt-1 text-xs"> {showAll ? "Moins" : "Plus"} </span>
          </button>
          
          {/* Icônes additionnelles si ouvert. Ces icônes occuperont les lignes suivantes dans la grille. */}
          {showAll && otherIcons.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href} // Remplacement de 'href' par 'to'
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded transition-colors",
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className={cn(
                  "mt-1 text-xs truncate",
                  isActive && "font-bold"
                )}>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}