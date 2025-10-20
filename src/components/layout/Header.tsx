import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Import des icônes
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Calendar,
  CreditCard,
  MessageCircle,
  CheckCheck,
  CheckCircle2,
  ListCheck,
} from "lucide-react";

// Authentification et Types
import { AuthService } from "@/lib/auth";
import type { User as AuthUser } from "@/lib/auth";
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate(); // Utilisation de useNavigate de react-router-dom

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Charger les infos utilisateur
  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
    setRole(AuthService.getCurrentRole());
    setUser(AuthService.getCurrentUser());
  }, []);

  const handleLogin = () => {
    // Remplacement de router.push par navigate
    navigate("/login");
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/"); // Rediriger l'utilisateur vers la page d'accueil ou de connexion
  };

  // --- Données du Menu (Inchangées) ---
  const menuSections = [
    // ... (Sections du menu inchangées)
    {
      title: "IMMOBILIER",
      href: "/immobilier",
    },
    {
      title: "TRAVAUX",
      href: "/travaux",
    },
    {
      title: "PRODUITS",
      items: [
        {
          title: "Équipements",
          description: "Matériel et équipements haute performance",
          href: "/produits#equipement",
        },
        {
          title: "Matériaux",
          description: "Matériaux de construction qualité premium",
          href: "/produits#materiaux",
        },
        {
          title: "Design & Décoration",
          description: "Solutions esthétiques pour votre intérieur",
          href: "/produits#design",
        },
      ],
    },
    // {
    // title: "ENTREPRISE",
    //items: [
    //{ title: "Solutions professionnelles", description: "Services sur mesure pour les entreprises", href: "/entreprise#solution" },
    //{ title: "Devenir partenaire", description: "Rejoignez notre réseau d'experts", href: "/entreprise#partenaire" },
    //{ title: "Gestion de projet", description: "Accompagnement complet de A à Z", href: "/entreprise#gestion" },
    //],
    //},
    //*
    //   title: "FINANCEMENT",
    // items: [
    // { title: "Financement immobilier", description: "Solutions de crédit adaptées à votre projet", href: "/financement" },
    //   { title: "Assurance habitation", description: "Protection complète pour votre logement", href: "/financement" },
    //  { title: "Audit financier", description: "Analyse et optimisation de votre budget", href: "/financement" },
    // ],
    //  }
    {
      title: "ACTUALITÉS",
      href: "/actualites",
    },
    {
      title: "CONSULTATIONS/AIDES",
      href: "/service",
    },
    // {
    //     title: "TOURISME",
    //     href: "/tourisme",
    // },
  ];
  // ---------------------------------

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const profilePath =
    role === "admin"
      ? "/admin"
      : role === "professional"
      ? "/pro"
      : "/mon-compte/profil";

  const initials = user
    ? (() => {
        let base = "";
        if (user.firstName && user.firstName.trim().length > 0) {
          base = user.firstName.trim();
        } else if (user.email) {
          base = user.email.split("@")[0];
        }
        base = base.replace(/[^A-Za-z0-9]/g, "");
        const two = base.slice(0, 2).toUpperCase();
        if (two && two.length === 2) return two;
        if (!two && user.lastName)
          return user.lastName.slice(0, 2).toUpperCase();
        return two || "US";
      })()
    : "";

  const MobileMenu = () => (
    <div className="lg:hidden ">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[85vw] max-w-sm p-0 overflow-hidden bg-white border-r border-gray-200"
        >
          <div className="flex flex-col h-full">
            {/* Header Mobile */}
            <div className="border-b border-gray-200 p-6 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1 rounded-full bg-white border-black border-2">
                      {/* Remplacement de Next/Image par <img> */}
                      <img
                        src={logo}
                        alt="Servo Logo"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="text-xl font-bold text-gray-900">SERVO</div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Solutions Immobilières
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Mobile */}
            <nav className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                {menuSections.map((section, index) => (
                  <div key={index} className="group">
                    {section.items ? (
                      <div className="rounded-lg hover:bg-gray-50 transition-all duration-200">
                        <button
                          onClick={() => toggleSubmenu(section.title)}
                          className="flex items-center justify-between w-full p-4 text-left rounded-lg transition-all duration-200 hover:bg-gray-100"
                        >
                          <span className="font-semibold text-gray-900 text-sm">
                            {section.title}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openSubmenu === section.title ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openSubmenu === section.title
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pb-3 px-4 space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <Link // Remplacement des <a> par des Link
                                key={itemIndex}
                                to={item.href} // Utilisation de 'to'
                                onClick={() => setIsMobileMenuOpen(false)} // Fermer le menu après la navigation
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-transparent"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-gray-600 line-clamp-1">
                                    {item.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link // Remplacement des <a> par des Link
                        to={section.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                      >
                        <span className="font-semibold text-gray-900 text-sm">
                          {section.title}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Footer Mobile */}
            <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
              {!isAuthenticated ? (
                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 transition-all duration-200 text-white"
                  size="lg"
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="font-semibold">Se connecter</span>
                </Button>
              ) : (
                // Dropdown simplifié ou adapté pour le mobile
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                  <Link
                    to={profilePath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium">Profil</span>
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium">Messages</span>
                  </Link>
                  <Link
                    to="/mon-compte/reservation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium">Réservations</span>
                  </Link>
                  <Link
                    to="/mon-compte/demandes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <CheckCheck className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium">Mes demandes </span>
                  </Link>
                  <Link
                    to="/mon-compte/payement"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <CreditCard className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium">Paiements</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Déconnexion
                    </span>
                  </button>
                </div>
              )}
              <div className="text-center">
                <a
                  href="/devis"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Demander un devis gratuit
                </a>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  const played = useRef(false);

  // Animation (utilise la même logique gsap)
  useEffect(() => {}, []);

  return (
    <header
      id="head"
      className="fixed w-screen top-0 z-50 left-5 lg:left-9 lg:w-[95%] lg:max-w-full bg-white backdrop-blur-md border rounded-b-2xl shadow-lg px-5"
    >
      <div className=" container mx-auto flex h-16 items-center justify-between px-6">
        <Link to={"/"}>
          <div className="p-1 rounded-full bg-white border-black border-2">
            {/* Remplacement de Next/Image par <img> */}
            <img
              src={logo}
              alt="Servo Logo"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </Link>

        {/* Menu desktop (Remplacement du Shadcn NavigationMenu par un simple Dropdown/Flyout) */}
        <nav className="hidden lg:flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {menuSections.map((section, index) => (
              <li key={index} className="group relative">
                {section.items ? (
                  <>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-900 transition-all duration-200 px-4 py-2.5 rounded-lg border border-transparent hover:border-gray-200"
                    >
                      {section.title}
                      <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                    </Button>
                    <div className="absolute left-0 top-full w-[300px] p-2 rounded-lg border bg-white shadow-xl opacity-0 translate-y-1 scale-95 pointer-events-none transition ease-out duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto z-[1050]">
                      {section.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.href}
                          className="block p-2 rounded-lg hover:bg-gray-50 transition-all duration-150 text-sm text-gray-700"
                        >
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={section.href}
                    className="flex items-center gap-1 text-xs font-bold bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 px-4 py-2.5 rounded-lg border border-transparent hover:border-gray-200 group"
                  >
                    {section.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <Button
              className="hidden lg:flex bg-black hover:bg-gray-800 transition-all duration-200 text-white"
              size="default"
              onClick={handleLogin}
            >
              Se connecter
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden lg:flex p-0 w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 items-center justify-center z-50 relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-900 text-white text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 z-[1050] shadow-lg"
              >
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </DropdownMenuLabel>
                {role != "user" ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(profilePath)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Tableau de bord
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />{" "}
                  </>
                ) : (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(profilePath)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/mon-compte/demandes")}
                    >
                      <ListCheck className="mr-2 h-4 w-4" />
                      Mes demandes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/mon-compte/reservation")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Réservations
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/mon-compte/payement")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Paiements
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
