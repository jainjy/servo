// components/Header.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Import des icônes
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Calendar,
  CreditCard,
  CheckCheck,
  ListCheck,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/contexts/CartContext";
import Cart from "@/components/Cart";

// Authentification et Types
import AuthService from "@/services/authService";
import type { User as AuthUser } from "@/types/type";

// Import GSAP
import { gsap } from "gsap";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(
    AuthService.getCurrentUser()
  );
  const { logout } = useAuth();

  // Utiliser le contexte panier
  const { getCartItemsCount } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
    setRole(user?.role);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    navigate("/");
  };

  const menuSections = [
    {
      title: "IMMOBILIER",
      items: [
        {
          title: "Vente et location",
          description: "Vendre ou louer vos biens",
          href: "/immobilier",
        },
        {
          title: "Droit de la famille",
          description: "Divorce, succession, donation, . . .",
          href: "/droitFamille",
        },
        {
          title: "Gestion immobilière",
          description: "Gestion locative et syndic",
          href: "/gestion-immobilier",
        },
      ],
    },
    {
      title: "TRAVAUX & CONSTRUCTION",
      items: [
        {
          title: "Prestation Intérieur",
          description: "Services pour l'intérieur",
          href: "/travaux?categorie=interieurs",
        },
        {
          title: "Prestation Extérieur",
          description: "Services pour l'extérieur",
          href: "/travaux?categorie=exterieurs",
        },
        {
          title: "Construction",
          description: "Travaux de construction",
          href: "/travaux?categorie=constructions",
        },
      ],
    },
    {
      title: "PRODUITS & ACCESSOIRES",
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
    {
      title: "ENTREPRISE",
      items: [
        {
          title: "Solutions professionnelles",
          description: "Services sur mesure pour les entreprises",
          href: "/entreprise#services",
        },
        {
          title: "Devenir partenaire",
          description: "Rejoignez notre réseau d'experts",
          href: "/entreprise#partenaire",
        },
      ],
    },
    {
      title: "FINANCEMENT",
      items: [
        {
          title: "Financement immobilier",
          description: "Solutions de crédit adaptées à votre projet",
          href: "/financement#partenaires",
        },
        {
          title: "Assurance habitation",
          description: "Protection complète pour votre logement",
          href: "/financement#assurances",
        },
      ],
    },
    {
      title: "BIEN-ÊTRE",
      href: "/bien-etre",
    },
    {
      title: "INVESTISSEMENT",
      href: "/investissement",
    },
    {
      title: "ACTUALITÉS",
      href: "/actualites",
    },
    {
      title: "CONSULTATIONS/AIDES",
      href: "/service",
    },
    {
      title: "ART & COMMERCES",
      href: "/art-commerce",
    },
    {
      title: "TOURISME",
      href: "/tourisme",
    },
  ];

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

  // Animation GSAP pour le texte du popover
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Utiliser useEffect pour déclencher l'animation quand le popover s'ouvre
  useEffect(() => {
    if (isPopoverOpen) {
      // Petit délai pour s'assurer que le contenu est rendu
      const timer = setTimeout(() => {
        animatePopoverText();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isPopoverOpen]);

  const animatePopoverText = () => {
    const characters = "ABCDEFGHIJKstuvwxyz0123456789";
    const textElements =
      popoverContentRef.current?.querySelectorAll(".animated-text") || [];

    // Créer une timeline principale
    const masterTimeline = gsap.timeline();

    textElements.forEach((element, index) => {
      const finalText = element.textContent || "";

      // Sauvegarder le texte final
      element.setAttribute("data-final-text", finalText);

      // Ajouter chaque animation à la timeline avec un délai progressif
      masterTimeline.add(() => {
        let currentIteration = 0;
        const totalIterations = 5;
        const originalText = finalText;

        const scramble = () => {
          let scrambledText = "";

          for (let i = 0; i < originalText.length; i++) {
            if (currentIteration === totalIterations) {
              // Dernière itération - afficher le vrai caractère
              scrambledText += originalText[i];
            } else if (Math.random() < 0.7 && originalText[i] !== " ") {
              // Caractère aléatoire
              scrambledText +=
                characters[Math.floor(Math.random() * characters.length)];
            } else {
              // Garder le caractère original (ou espace)
              scrambledText += originalText[i];
            }
          }

          element.textContent = scrambledText;

          if (currentIteration < totalIterations) {
            currentIteration++;
            setTimeout(scramble, 50);
          }
        };

        scramble();
      }, index * 0.02); // 0.2 seconde entre chaque élément
    });
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      // Réinitialiser le texte quand le popover se ferme
      const textElements =
        popoverContentRef.current?.querySelectorAll(".animated-text") || [];
      textElements.forEach((element) => {
        const finalText = element.getAttribute("data-final-text");
        if (finalText) {
          element.textContent = finalText;
        }
      });
    }
  };

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
                              <Link
                                key={itemIndex}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
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
                      <Link
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
                <div className="space-y-3">
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
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                  {/* Icône Panier dans le menu mobile */}
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <div className="relative">
                      <ShoppingCart className="h-4 w-4 text-gray-700" />
                      {getCartItemsCount() > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                          {getCartItemsCount()}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">Panier</span>
                  </button>

                  <Link
                    to={profilePath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium">Profil</span>
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

  const sectionsWithItems = menuSections.filter(
    (s) => s.items && s.items.length > 0
  );
  const sectionsNoItems = menuSections.filter(
    (s) => !s.items || s.items.length === 0
  );

  return (
    <>
      <header
        id="head"
        className="fixed w-screen top-0 z-50 bg-white backdrop-blur-md border shadow-lg"
      >
        <div className="container flex h-16 items-center justify-between px-6">
          <Link to={"/"}>
            <div className="p-1 rounded-full bg-white border-black border-2">
              <img
                src={logo}
                alt="Servo Logo"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </Link>

          {/* Menu desktop */}
          <nav className="hidden md:hidden lg:flex items-center gap-2">
            <ul className="flex items-center">
              {menuSections.slice(0, 7).map((section, index) => (
                <li key={index} className="group relative">
                  {section.items ? (
                    <>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-[11px] font-bold text-gray-700 hover:text-gray-900 transition-all duration-200 px-3 py-1 rounded-lg border border-transparent hover:border-gray-200"
                      >
                        {section.title}
                        <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                      </Button>
                      <div className="absolute left-0 top-full w-[320px] p-2 rounded-lg border bg-white shadow-xl opacity-0 translate-y-1 scale-95 pointer-events-none transition ease-out duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto z-[1050]">
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
                      className="flex items-center gap-1 text-[11px] font-bold bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 px-4 py-2 rounded-lg border border-transparent hover:border-gray-200 group"
                    >
                      {section.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Desktop hamburger: Popover avec animation GSAP */}
            <div className="hidden lg:block">
              <Popover
                open={isPopoverOpen}
                onOpenChange={handlePopoverOpenChange}
              >
                <PopoverTrigger asChild>
                  <Button className="h-9 hover:bg-slate-800 bg-slate-900">
                    <Menu className="text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="center"
                  className="relative -mt-16 w-screen max-w-full p-0 overflow-hidden z-50 rounded-none shadow-lg bg-black text-white border-none"
                  ref={popoverContentRef}
                >
                  <button
                    className="absolute text-white text-5xl font-extralight right-10 top-4 z-10"
                    onClick={() => setIsPopoverOpen(false)}
                    aria-label="Close popover"
                  >
                    &times;
                  </button>
                  <div className="flex flex-row flex-wrap w-full justify-between gap-12 px-8 py-4">
                    {/* Branding/logo */}
                    <div className="flex items-center gap-2 mx-auto min-w-[180px]">
                      <div className="p-1 rounded-full bg-white border-black border-2">
                        <img
                          src={logo}
                          alt="Servo Logo"
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="azonix text-xl font-bold text-slate-400 animated-text">
                        SERVO
                      </div>
                    </div>
                    <div className="flex flex-row-reverse justify-between gap-10">
                      {/* Sections avec items */}
                      <div className="grid grid-cols-4 place-content-center gap-10">
                        {sectionsWithItems.map((section, i) => (
                          <div
                            key={i}
                            className="flex flex-col gap-2 min-w-[200px]"
                          >
                            <span className="font-semibold animated-text">
                              {section.title}
                            </span>
                            {section.items!.map((item, idx) => (
                              <Link
                                key={idx}
                                to={item.href}
                                onClick={() => setIsPopoverOpen(false)}
                                className="block text-sm ml-2 text-white hover:underline"
                              >
                                <div className="font-medium animated-text">
                                  {item.title}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-gray-400 animated-text">
                                    {item.description}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Sections sans items */}
                      {sectionsNoItems.length > 0 && (
                        <div className="flex flex-col gap-5 min-w-[180px]">
                          {sectionsNoItems.map((s, si) => (
                            <Link
                              key={si}
                              to={s.href}
                              onClick={() => setIsPopoverOpen(false)}
                              className="text-sm font-medium text-white hover:underline animated-text"
                            >
                              {s.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between w-full gap-1">
                      <Link
                        to="/login"
                        className="text-white text-end hover:underline text-xl animated-text"
                        onClick={() => setIsPopoverOpen(false)}
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </nav>
          <div className="flex items-center gap-4">
            {/* Icône Panier pour utilisateurs connectés */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden lg:flex"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  className="hidden text-xs lg:flex text bg-black hover:bg-gray-800 transition-all duration-200 text-white"
                  size="sm"
                  onClick={handleLogin}
                >
                  Se connecter
                </Button>
              </div>
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

      {/* Composant Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
