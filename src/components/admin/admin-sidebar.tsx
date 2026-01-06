import React, { useState } from "react";
// Remplacement du Link et du usePathname de Next.js
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"; // Utilitaire cn (à s'assurer qu'il est disponible)
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
  Settings,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  FileCheck,
  Ruler,
  Tag,
  FileText,
  WalletCards,
  Globe,
  Wallet2Icon,
  Scale,
  UserCog,
  Video,
  Image,
  Lightbulb,
  Briefcase,
} from "lucide-react";
// Remplacement de Image de next/image par la balise <img>
import logo from "../../assets/logo.png";

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
  // { name: "Droit de famille", href: "/admin/demandeDroitFamille", icon: Scale },

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
  // Remplacement de usePathname (Next.js) par useLocation (React Router DOM)
  const location = useLocation();
  const pathname = location.pathname;

  const [showAll, setShowAll] = useState(false);

  // Séparation pour la barre mobile
  const mainIcons = navigation.slice(0, 3);
  const otherIcons = navigation.slice(3);

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
      // Dashboard & Administration
      if (["Dashboard", "Utilisateurs", "Audit"].includes(item.name)) {
        sections.dashboard.push(item);
      }
      // Abonnements & Finances
      else if (["Abonnement Pro", "Paiements"].includes(item.name)) {
        sections.finances.push(item);
      }
      // Annonces & Services
      else if (
        ["Annonces", "Services", "categorie de services", "Métiers", "Entrepreneuriat"].includes(
          item.name
        )
      ) {
        sections.annoncesServices.push(item);
      }
      // Réservations & Produits
      else if (["Réservations", "Produits", "Tourisme"].includes(item.name)) {
        sections.reservationsProduits.push(item);
      }
      // Demandes
      else if (
        item.name.includes("Demandes") ||
        item.name.includes("demandes") ||
        item.name === "Droit de famille" ||
        item.name === "Investissement International"
      ) {
        sections.demandes.push(item);
      }
      // Services Financiers
      else if (
        item.name.includes("financiers") ||
        item.name.includes("Financement")
      ) {
        sections.servicesFinanciers.push(item);
      }
      // Marketing & Communication
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
            // Logique d'activité du lien pour les routes exactes (ajustez si vous voulez des correspondances partielles)
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href} // Remplacement de 'href' par 'to'
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#6B8E23]/10 text-[#556B2F]"
                    : "text-gray-900 hover:bg-[#6B8E23]/5 hover:text-[#556B2F]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#D3D3D3] bg-[#FFFFFF]">
        <div className="flex h-16 items-center gap-2 border-b border-[#D3D3D3] px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-[#FFFFFF] border-black border-2">
              {/* Remplacement de <Image> par <img> */}
              <img
                src={logo}
                alt="OLIPLUSLogo"
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SERVO</h1>
              <p className="text-xs text-[#8B4513]">Administration</p>
            </div>
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

      {/* Sidebar mobile */}
      <nav className="fixed bg-[#FFFFFF] bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-[#D3D3D3] py-1 shadow-lg md:hidden">
        <div
          className={cn(
            "grid gap-1 px-2 place-items-center",
            showAll ? "grid-cols-4 sm:grid-cols-4" : "grid-cols-4"
          )}
        >
          {/* Les 3 premières icônes principales */}
          {mainIcons.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href} // Remplacement de 'href' par 'to'
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded transition-colors",
                  isActive
                    ? "bg-[#6B8E23]/10 text-[#556B2F] font-bold shadow-md"
                    : "text-gray-900 hover:bg-[#6B8E23]/5"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span
                  className={cn(
                    "mt-1 text-xs truncate",
                    isActive && "font-bold"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          <button
            aria-label={showAll ? "Réduire" : "Voir plus"}
            onClick={() => setShowAll((v) => !v)}
            // Le style a été ajusté pour rester dans le flux de la grille pour la colonne 4
            className={cn(
              " flex flex-col items-center justify-center py-1 rounded transition-colors w-full h-full",
              "border-t shadow-lg border-[#D3D3D3] font-bold text-white bg-[#556B2F]"
            )}
          >
            {showAll ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
            <span className="mt-1 text-xs"> {showAll ? "Moins" : "Plus"} </span>
          </button>

          {/* Icônes additionnelles si ouvert. Ces icônes occuperont les lignes suivantes dans la grille. */}
          {showAll &&
            otherIcons.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href} // Remplacement de 'href' par 'to'
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded transition-colors",
                    isActive
                      ? "bg-[#6B8E23]/10 text-[#556B2F] font-bold shadow-md"
                      : "text-gray-900 hover:bg-[#6B8E23]/5"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span
                    className={cn(
                      "mt-1 text-xs truncate",
                      isActive && "font-bold"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
        </div>
      </nav>
    </>
  );
}