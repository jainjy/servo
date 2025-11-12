// components/Header.js
import { useState, useEffect } from "react";
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

// Import des images pour les sections


// Import des icônes
import {
  Menu,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Calendar,
  CreditCard,
  CheckCheck,
  ListCheck,
  ShoppingCart,
  Bell,
  BookDashed,
  Eye,
  EyeOff,
  Trash2,
  Package // Icône pour Mes Commandes
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/contexts/CartContext";
import Cart from "@/components/Cart";

// Authentification et Types
import AuthService from "@/services/authService";
import type { User as AuthUser } from "@/types/type";

import { toast } from "@/hooks/use-toast";
import api from "@/lib/api.js";

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
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?$%*#";
    const speed = 20; // <-- vitesse (ms) : plus petit = plus rapide
    const step = 0.5; // <-- incrément d'itérations (plus grand = plus vite)
    const activeIntervals = new Map<HTMLElement, number>();
    const busy = new Set<HTMLElement>(); // empêche le retrigger pendant l'anim

    function scrambleOnce(el: HTMLElement) {
      const original = el.dataset.original ?? el.textContent ?? "";
      el.dataset.original = original;

      // si déjà en cours, on ignore
      if (busy.has(el)) return;
      busy.add(el);

      // clear s'il y avait un interval pour cet élément
      const prev = activeIntervals.get(el);
      if (prev) {
        clearInterval(prev);
        activeIntervals.delete(el);
      }

      let iterations = 0;
      const id = window.setInterval(() => {
        el.innerText = original
          .split("")
          .map((char, i) => {
            if (i < iterations) return original[i];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        iterations += step;
        if (iterations >= original.length) {
          // assure le texte final exact
          el.innerText = original;
          clearInterval(id);
          activeIntervals.delete(el);
          busy.delete(el);
        }
      }, speed);

      activeIntervals.set(el, id);
    }

    // délégation : un seul listener pour tous les .scramble, évite null ou éléments recréés
    function onPointerOver(e: Event) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest(".scramble") as HTMLElement | null;
      if (!el) return;
      scrambleOnce(el);
    }

    document.addEventListener("pointerover", onPointerOver);

    // cleanup propre
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      activeIntervals.forEach((id) => clearInterval(id));
      activeIntervals.clear();
      busy.clear();
    };
  }, []); 


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
          title: "Vendre ou louer",
          description: "Vente & location de biens",
          href: "/immobilier",
          image: "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg"
        },
        {
          title: "Annonces & transactions",
          description: "Nos annonces et transactions",
          href: "/immobilier-sections",
          image: "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg"
        },
        {
          title: "Droit & formation immobilière",
          description: "Divorce, succession, donation, . . .",
          href: "/droitFamille",
          image: "https://i.pinimg.com/736x/a1/91/eb/a191ebeb94928180470add7e2e1284e2.jpg"
        },
        {
          title: "Gestion & services immobiliers",
          description: "Gestion locative & syndic",
          href: "/gestion-immobilier",
          image: "https://i.pinimg.com/1200x/a6/6e/47/a66e473e8ed32bb3d153017af507f83c.jpg"
        }, {
          title: "Audit patrimonial & finance",
          description: "Gestion locative & syndic",
          href: "/immobilier-sections",
          image: "https://i.pinimg.com/736x/41/d8/69/41d8699229ed3bd63cf723faa543fc95.jpg"
        }, {
          title: "Estimation & expertise",
          description: " Évaluez la valeur de votre bien",
          href: "/estimation-immobilier",
          image: "https://i.pinimg.com/1200x/2a/33/c7/2a33c7347de60d0c65be83a72c4495be.jpg"
        }
      ],
    },
    // {
    //   title: "TRAVAUX & CONSTRUCTION ",
    //   items: [
    //     {
    //       title: "Prestation Intérieur",
    //       description: "Services pour l'intérieur",
    //       href: "/travaux?categorie=interieurs",
    //       image: "https://i.pinimg.com/1200x/fe/5c/1a/fe5c1a7e46c506905b0e124d1f9a374d.jpg"
    //     },
    //     {
    //       title: "Prestation Extérieur",
    //       description: "Services pour l'extérieur",
    //       href: "/travaux?categorie=exterieurs",
    //       image: "https://i.pinimg.com/736x/90/49/46/9049462b0f6124398a68da38949985a8.jpg"
    //     },
    //     {
    //       title: "Construction",
    //       description: "Travaux de construction",
    //       href: "/travaux?categorie=constructions",
    //       image: "https://i.pinimg.com/736x/0d/78/24/0d7824617574c86c95a7d14399e90858.jpg"
    //     },
    //   ],
    // },
    // {
    //   title: "PRODUITS & ACCESSOIRES",
    //   items: [
    //     {
    //       title: "Équipements",
    //       description: "Matériel & équipements haute performance",
    //       href: "/produits#equipement",
    //       image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg"
    //     },
    //     {
    //       title: "Matériaux",
    //       description: "Matériaux de construction qualité premium",
    //       href: "/produits#materiaux",
    //       image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg"

    //     },
    //     {
    //       title: "Design & Décoration",
    //       description: "Solutions esthétiques pour votre intérieur",
    //       href: "/produits#design",
    //       image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg"

    //     },
    //   ],
    // },
    {
      title: "ENTREPRISE",
      items: [
        {
          title: "Solutions professionnelles",
          description: "Services sur mesure pour les entreprises",
          href: "/entreprise#services",
          image: "https://i.pinimg.com/736x/a2/60/55/a260554ed14acf6dbcf9b19ed6e40429.jpg"

        },
        {
          title: "Devenir partenaire",
          description: "Rejoignez notre réseau d'experts",
          href: "/entreprise#partenaire",
          image: "https://i.pinimg.com/736x/6a/9a/66/6a9a661a89881207fcc24bf0c16e5bf5.jpg"

        }, {
          title: "Création & reprise",
          description: "Accompagnement pour entrepreneurs",
          href: "/reprise",
          image: "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg"

        },
        {
          title: "Audit & médiation",
          description: "Experts en audit & résolution de conflits",
          href: "/auditMediation",
          image: "https://i.pinimg.com/736x/5a/d7/d2/5ad7d27a5bdf37ce1826d5c9ac03b6f4.jpg"

        }, {
          title: "Aides & levées de fonds",
          description: " Soutien financier pour entreprises",
          href: "/aideFonds",
          image: "https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg"

        },
        {
          title: "Juridique & liquidation",
          description: " Services juridiques pour entreprises",
          href: "/juridiqueLiquidation",
          image: "https://i.pinimg.com/736x/06/b1/dc/06b1dc5f7bcca0813ec75fc60af71120.jpg"

        }, {
          title: "Podcasts & autres services",
          description: " Ressources pour entrepreneurs",
          href: "/podcast_service",
          image: "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg"

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
          image: "https://i.pinimg.com/1200x/95/70/a7/9570a740dff319b472f298de32eec435.jpg"

        },
        {
          title: "Assurance habitation",
          description: "Protection complète pour votre logement",
          href: "/financement#assurances",
          image: "https://i.pinimg.com/1200x/23/18/ba/2318ba8d8dd3bcc8f5e0bd17347032bd.jpg"
        },
      ],
    }, {
      title: "BATIMENTS",
      items: [
        {
          title: "Rénovation & chantiers",
          description: "Experts en rénovation de bâtiments",
          href: "/batiments#renovation-chantiers",
          image: "https://i.pinimg.com/736x/7a/f7/95/7af795aa69261731feae01375ad824df.jpg"
        },
        {
          title: "Construction & plans",
          description: " De la conception à la réalisation",
          href: "/batiments#construction-plans",
          image: "https://i.pinimg.com/1200x/75/d5/84/75d5848fde7b30cac973164b34836730.jpg"
        }, {
          title: "Matériaux & viabilisations",
          description: " Solutions durables pour vos projets",
          href: "/batiments#materiaux-viabilisations",
          image: "https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg"
        },
        {
          title: "Division parcellaire",
          description: " Optimisation de l'espace foncier",
          href: "/batiments#division-parcellaire",
          image: "https://i.pinimg.com/1200x/67/fe/59/67fe591357a9c5d9d5175476cc28d20a.jpg"
        }, {
          title: "Formation & podcasts",
          description: " Formation continue et actualités",
          href: "/batiments#formation-podcasts",
          image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg"
        }, {
          title: "Travaux & construction",
          description: " Services de construction professionnels",
          href: "/travaux",
          image: "https://i.pinimg.com/1200x/75/d5/84/75d5848fde7b30cac973164b34836730.jpg"
        },
      ],
    }, {
      title: "DOMICILE",
      items: [
        {
          title: "Produits & commerces",
          description: " Trouvez tout pour votre maison",
          href: "/domicile#produits-commerces",
          image: "https://i.pinimg.com/1200x/e0/6a/9b/e06a9b44678d5ddd2a06c07ed8f1871f.jpg"
        },
        {
          title: "Service maison",
          description: " Services à domicile de qualité",
          href: "/domicile#service-maison",
          image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg"
        }, {
          title: "Equipements & livraison",
          description: " Solutions pour un domicile moderne",
          href: "/domicile#equipements-livraison",
          image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg"
        },
        {
          title: "Design & décoration (art)",
          description: " Inspirez-vous pour votre intérieur",
          href: "/domicile#design-decoration",
          image: "https://i.pinimg.com/1200x/db/1e/d6/db1ed633dae5dd89cf4610c3f93a8103.jpg"
        }, {
          title: "Cours & formations",
          description: " Apprenez de nouvelles compétences",
          href: "/domicile#cours-formations",
          image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg"
        }, {
          title: "Utilities (eau, électricité, internet)",
          description: "Gestion efficace de votre domicile",
          href: "/domicile#utilities",
          image: "https://i.pinimg.com/1200x/2a/55/75/2a5575106b8bab32940c640840e1602b.jpg"
        }, {
          title: "Matériaux",
          description: "Matériaux de construction qualité premium",
          href: "/domicile#utilities",
          image: "https://i.pinimg.com/736x/03/d7/70/03d7704dad409f8713915bcee69314b1.jpg"
        }
      ],
    },
    {
      title: "BIEN-ÊTRE",
      items: [
        {
          title: "Cours à domicile",
          description: "Formations & ateliers personnalisés",
          href: "/bien-etre",
          image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg"
        },
        {
          title: "Thérapeutes & soins",
          description: "Professionnels du bien-être à domicile",
          href: "/bien-etre",
          image: "https://i.pinimg.com/1200x/32/9c/de/329cde5ea55b482c491c64cbee4048ea.jpg"
        }, {
          title: "Boutique & produits naturels",
          description: "Produits pour le bien-être",
          href: "/bien-etre",
          image: "https://i.pinimg.com/1200x/a7/a7/78/a7a778dfbb4199b45d864581411e7c0a.jpg"
        },
        {
          title: "Podcasts & vidéos",
          description: "Ressources pour le bien-être",
          href: "/bien-etre",
          image: "https://i.pinimg.com/736x/a1/7f/6d/a17f6d0d7e4a0dd16e01f84d41b51da3.jpg"
        },
      ],
    },
    {
      title: "ALIMENTATION",
      items: [
        {
          title: "Courses & épicerie",
          description: "Livraison de produits frais & épicerie",
          href: "/alimentation",
          image: "https://i.pinimg.com/1200x/11/80/35/11803586e48bb4b954c93493a2fae78d.jpg"
        },
        {
          title: "Boulangerie & charcuterie",
          description: "Produits artisanaux livrés chez vous",
          href: "/alimentation",
          image: "https://i.pinimg.com/736x/28/42/f2/2842f2dfe1ffa1cbbee9b4401ed3b07c.jpg"
        }, {
          title: "Cave & vins",
          description: "Sélection de vins & spiritueux",
          href: "/alimentation",
          image: "https://i.pinimg.com/1200x/90/22/b3/9022b34f5669bf2657f32acb26d1d554.jpg"
        },
        {
          title: "Restaurants",
          description: "Livraison de plats de vos restaurants favoris",
          href: "/alimentation",
          image: "https://i.pinimg.com/1200x/52/4e/ea/524eea16c0ef4ed64a19a32f4c43652d.jpg"
        },
      ],
    },
    {
      title: "INVESTISSEMENT",
      items: [
        {
          title: "SCPI & immobilier",
          description: "Investissez dans l'immobilier locatif",
          href: "/investir/scpi",
          image: "https://i.pinimg.com/1200x/20/79/83/207983f864b7c516a64be40bc990df17.jpg"
        },
        {
          title: "Crowdfunding & actions ",
          description: "Investissez dans des projets innovants",
          href: "/investir/crowdfunding",
          image: "https://i.pinimg.com/736x/50/f9/69/50f969a3d27b9d0cb7dfc4bff0b8a80a.jpg"
        }, {
          title: "Obligations & associations",
          description: "Soutenez des causes tout en investissant",
          href: "/investir/isr",
          image: "https://i.pinimg.com/736x/7e/d6/5a/7ed65a934c44e7486ba52a5c813b45b8.jpg"
        },
      ],
    },
    // {
    //   title: "ACTUALITÉS",
    //   href: "/actualites",
    // },
    // {
    //   title: "CONSULTATIONS/AIDES",
    //   href: "/service",
    // },
    // {
    //   title: "ART & COMMERCES",
    //   href: "/art-commerce",
    // },
    {
      title: "TOURISME",
      items: [
        {
          title: "Hôtels & gîtes",
          description: "Réservations d'hébergements",
          href: "/tourisme",
          image: "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg"
        },
        {
          title: "Activités & loisirs",
          description: "Découvertes & aventures",
          href: "/activiteLoisirs",
          image: "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg"
        }, {
          title: "Formations",
          description: "Cours & ateliers locaux",
          href: "/formationTourisme",
          image: "https://i.pinimg.com/1200x/91/01/6a/91016ac95b54c8a72d47945497fc1ddc.jpg"
        },
      ],
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

  // État pour le popover et la section survolée
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);

  // Écouter les événements de rechargement des notifications
  useEffect(() => {
    const handler = () => {
      if (user?.id) {
        loadNotifications();
      }
    };
    window.addEventListener('notifications:reload', handler);
    return () => window.removeEventListener('notifications:reload', handler);
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    setNotifLoading(true);
    try {
      const response = await api.get(`/notifications/user/${user.id}`);
      const { notifications = [], unreadCount = 0 } = response.data || {};
      setNotifications(notifications);
      setNotifCount(unreadCount);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications"
      });
    } finally {
      setNotifLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      await api.post(`/notifications/user/${user.id}/read/${notificationId}`);
      loadNotifications(); // Recharger les notifications
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme lu"
      });
    }
  };

  const handleMarkAsUnread = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      await api.post(`/notifications/user/${user.id}/unread/${notificationId}`);
      loadNotifications(); // Recharger les notifications
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme non lu"
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await api.post(`/notifications/user/${user.id}/read-all`);
      loadNotifications(); // Recharger les notifications
      toast({
        description: "Toutes les notifications ont été marquées comme lues"
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de tout marquer comme lu"
      });
    }
  };

  const handleClearAll = async () => {
    if (!user?.id) return;

    try {
      await api.post(`/notifications/user/${user.id}/clear-all`);
      loadNotifications(); // Recharger les notifications
      toast({
        description: "Toutes les notifications ont été supprimées"
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les notifications"
      });
    }
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (open) {
      // définir la section survolée par défaut (première section qui a des items)
      const firstSectionWithItems = menuSections.find((s) => s.items && s.items.length > 0);
      setHoveredSection(firstSectionWithItems ? firstSectionWithItems.title : null);
    } else {
      setHoveredSection(null);
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
                            className={`w-4 h-4 transition-transform duration-200 ${openSubmenu === section.title ? "rotate-180" : ""
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
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === section.title
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

                  {/* Lien Mes Commandes - SEULEMENT pour les utilisateurs connectés */}
                  <Link
                    to="/mon-compte/mes-commandes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium">Mes Commandes</span>
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
                    <span className="text-sm font-medium">Mes demandes de services </span>
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
                >
                  <button
                    className="absolute  z-50 text-white text-5xl font-extralight right-10 top-4 "
                    onClick={() => setIsPopoverOpen(false)}
                    aria-label="Close popover"
                  >
                    &times;
                  </button>

                  {/* Layout: titles column (left) + content area (right) on desktop. On smaller screens fallback to stacked layout. */}
                  <div className="w-full h-screen overflow-auto">
                    <div className="flex flex-col lg:flex-row h-full w-full">
                      {/* Left: Titles column */}
                      <div className="w-full lg:w-64 border-gray-800/40 border-b lg:border-b-0 lg:border-r p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-1 rounded-full bg-white border-black border-2">
                            <img
                              src={logo}
                              alt="Servo Logo"
                              className="w-10 h-10 rounded-full"
                            />
                          </div>
                          <div className="azonix text-lg font-bold text-slate-300">
                            SERVO
                          </div>
                        </div>
                        <nav className="space-y-1">
                          {menuSections.map((section, si) => {
                            const hasItems =
                              !!section.items && section.items.length > 0;
                            const isActive = hoveredSection === section.title;
                            return (
                              <div
                                key={si}
                                onMouseEnter={() =>
                                  hasItems && setHoveredSection(section.title)
                                }
                                onFocus={() =>
                                  hasItems && setHoveredSection(section.title)
                                }
                                onMouseLeave={() => {}}
                                className={`py-1 px-4 rounded-md transition-colors cursor-pointer ${
                                  isActive ? "bg-white/10" : "hover:bg-white/5"
                                }`}
                              >
                                {hasItems ? (
                                  <button className="scramble  w-full text-left text-xs font-semibold text-white">
                                    {section.title}
                                  </button>
                                ) : (
                                  <Link
                                    to={section.href || "/"}
                                    onClick={() => setIsPopoverOpen(false)}
                                    className="w-full text-left text-xs font-semibold text-white hover:underline"
                                  >
                                    {section.title}
                                  </Link>
                                )}
                              </div>
                            );
                          })}
                        </nav>
                      </div>

                      {/* Right: Detail/content for hovered title */}
                      <div className="flex-1 p-6 relative">
                        {hoveredSection ? (
                          (() => {
                            const current = menuSections.find(
                              (s) => s.title === hoveredSection
                            );
                            if (!current) return null;
                            if (!current.items || current.items.length === 0) {
                              return (
                                <div className="relative z-10 text-white">
                                  <div className="p-6">
                                    <Link
                                      to={current.href || "/"}
                                      onClick={() => setIsPopoverOpen(false)}
                                      className="text-lg font-semibold hover:underline"
                                    >
                                      {current.title}
                                    </Link>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div className="relative">
                                {/* Content Grid */}
                                <div className="relative z-10 grid grid-cols-3 gap-6 p-6 mt-5">
                                  {current.items.map((item, idx) => (
                                    <Link
                                      key={idx}
                                      to={item.href}
                                      onClick={() => setIsPopoverOpen(false)}
                                      className="group block rounded-lg overflow-hidden hover:ring-2 hover:ring-white/20 transition-all"
                                    >
                                      <div className="relative aspect-video">
                                        {item.image && (
                                          <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-40"
                                          />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 p-4 flex flex-col justify-end">
                                          <div className="text-white font-semibold group-hover:translate-x-2 transition-transform">
                                            {item.title}
                                          </div>
                                          {item.description && (
                                            <div className="text-sm text-slate-300 mt-1 group-hover:translate-x-2 transition-transform">
                                              {item.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-slate-300 p-6">
                            Survolez un titre à gauche pour voir les détails
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-10 w-96 flex items-center justify-around z-50 gap-5 h-20">
                        <span>
                          <Link
                            to="/services-partners?section=partenaires"
                            onClick={() => setIsPopoverOpen(false)}
                            className="text-sm font-semibold hover:underline"
                          >
                            Consultations & aides
                          </Link>
                        </span>
                        <Link
                          to="/login"
                          className="group relative bg-white text-black py-2 px-6 rounded-full font-semibold overflow-hidden transition-colors duration-300"
                        >
                          <span className="relative z-10 group-hover:text-white">
                            Se connecter
                          </span>
                          <span className="absolute inset-0 bg-black border-black scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></span>
                        </Link>
                      </div>
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
            {/* notification icon for users — opens a modal (Sheet) with notifications */}
            {role === "user" && (
              <>
                <Sheet
                  open={notifOpen}
                  onOpenChange={(open) => {
                    setNotifOpen(open);
                    if (open) loadNotifications();
                  }}
                >
                  <SheetTrigger asChild>
                    <button className="relative mr-3 hidden lg:flex items-center">
                      <Bell className="w-5 h-5 text-gray-700" />
                      {notifCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {notifCount}
                        </span>
                      )}
                    </button>
                  </SheetTrigger>

                  <SheetContent side="right" className="w-[380px] p-4">
                    <div className="flex flex-col gap-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4
                            id="notifications-title"
                            className="text-lg font-semibold"
                          >
                            Notifications
                          </h4>
                        </div>
                      </div>
                      {notifications.length > 0 && (
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              Tout marquer comme lu
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Vider</span>
                          </Button>
                        </div>
                      )}
                    </div>

                    {notifLoading ? (
                      <div className="text-center text-sm text-gray-500">
                        Chargement...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center text-sm text-gray-500">
                        Aucune notification.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-lg border transition-colors ${
                              n.isRead ? "bg-gray-50" : "bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-800">
                                  {n.titre || "Nouvelle notification"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {n.statut} —{" "}
                                  {n.propertyId ? "Bien lié" : "Général"}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    n.isRead
                                      ? handleMarkAsUnread(n.id)
                                      : handleMarkAsRead(n.id)
                                  }
                                >
                                  {n.isRead ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-blue-500" />
                                  )}
                                </Button>
                                <div className="text-xs text-gray-400">
                                  {n.createdAt
                                    ? new Date(n.createdAt).toLocaleDateString(
                                        "fr-FR"
                                      )
                                    : ""}
                                </div>
                              </div>
                            </div>
                            {n.propertyId && (
                              <div className="mt-3">
                                <a
                                  href={`/immobilier/${n.propertyId}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  Voir le bien
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </>
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
                  className="w-64 z-[1050] shadow-lg"
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
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(profilePath)}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profil
                      </DropdownMenuItem>

                      {/* Lien Mes Commandes - SEULEMENT pour les utilisateurs connectés */}
                      <DropdownMenuItem
                        onClick={() => navigate("/mon-compte/mes-commandes")}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Mes Commandes
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => navigate("/mon-compte/demandes")}
                      >
                        <ListCheck className="mr-2 h-4 w-4" />
                        Mes demandes de services
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate("/mon-compte/demandes-immobilier")
                        }
                      >
                        <BookDashed className="mr-2 h-4 w-4" />
                        Mes demandes immobilieres
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