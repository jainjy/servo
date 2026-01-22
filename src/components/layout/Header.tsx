import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import {
  Search,
  Building2Icon,
  Briefcase,
  Car,
  ChevronRight,
} from "lucide-react";
// Import des icônes
import {
  Menu,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ChevronLeft,
  Calendar,
  ListCheck,
  ShoppingCart,
  Bell,
  BookDashed,
  Eye,
  EyeOff,
  Trash2,
  Package,
  AlertCircle,
  Calendar1,
  FileText,
  List,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/contexts/CartContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import Cart from "@/components/Cart";
import AuthService from "@/services/authService";
import type { User as AuthUser } from "@/types/type";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api.js";
import ServoLogo from "../components/ServoLogo";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
  // Utiliser le hook WebSocket pour les notifications en temps réel
  const { notificationCount, setNotificationCount } = useWebSocket();
  // États pour les notifications
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 20);
    };

    // Vérifier immédiatement au chargement
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Nettoyage
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openRecherchePage = () => {
    navigate("/recherche");
  };

  // ... (le reste de vos fonctions restent inchangées) ...

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
    setRole(user?.role);
  }, [user]);

  // Charger les notifications au montage et quand l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  // Écouter les événements de rechargement des notifications
  useEffect(() => {
    if (!user?.id) return;
    const handler = () => {
      if (notifOpen) {
        loadNotifications();
      }
    };
    window.addEventListener("notifications:reload", handler);
    return () => window.removeEventListener("notifications:reload", handler);
  }, [user?.id, notifOpen]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    setNotifLoading(true);
    try {
      const response = await api.get(`/notifications/user/${user.id}`);
      const { notifications = [], unreadCount = 0 } = response.data || {};
      setNotifications(notifications);
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setNotifLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.id) return;
    try {
      await api.post(`/notifications/user/${user.id}/read/${notificationId}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setNotificationCount((prev) => Math.max(0, prev - 1));
      toast({
        description: "Notification marquée comme lue",
      });
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme lu",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsUnread = async (notificationId: string) => {
    if (!user?.id) return;
    try {
      await api.post(`/notifications/user/${user.id}/unread/${notificationId}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n))
      );
      setNotificationCount((prev) => prev + 1);
      toast({
        description: "Notification marquée comme non lue",
      });
    } catch (error) {
      console.error("❌ Error marking notification as unread:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme non lu",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await api.post(`/notifications/user/${user.id}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setNotificationCount(0);
      toast({
        description: "Toutes les notifications ont été marquées comme lues",
      });
    } catch (error) {
      console.error("❌ Error marking all as read:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme lu",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = async () => {
    if (!user?.id) return;
    try {
      await api.post(`/notifications/user/${user.id}/clear-all`);
      await loadNotifications();
      toast({
        description: "Toutes les notifications ont été supprimées",
      });
    } catch (error) {
      console.error("❌ Error clearing notifications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les notifications",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!user?.id) return;
    try {
      await api.delete(
        `/notifications/user/${user.id}/delete/${notificationId}`
      );
      await loadNotifications();
      toast({
        description: "Notification supprimée",
      });
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    setIsLogoutDialogOpen(false);
    navigate("/");
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (open) {
      const firstSectionWithItems = menuSections.find(
        (s) => s.items && s.items.length > 0
      );
      setHoveredSection(
        firstSectionWithItems ? firstSectionWithItems.title : null
      );
    } else {
      setHoveredSection(null);
    }
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const menuSections = [
    {
      title: "IMMOBILIER",
      items: [
        {
          title: "Achat",
          description: "Trouvez votre prochaine article",
          href: "/achat",
          image:
            "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg",
        },
        {
          title: "Location",
          description: "Trouvez des arcticle à louer",
          href: "/location",
          image:
            "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg",
        },
        {
          title: "Gestion",
          description: "Optimisez la gestion de vos biens",
          href: "/gestion-immobilier",
          image:
            "https://i.pinimg.com/1200x/a6/6e/47/a66e473e8ed32bb3d153017af507f83c.jpg",
        },
        {
          title: "Investissement",
          description: "Découvrez des opportunités mondiales",
          href: "/investir-etranger",
          image:
            "https://i.pinimg.com/1200x/46/bb/5d/46bb5df4d9ca65648383226b41de80ec.jpg",
        },
        {
          title: "Financement",
          description: "Solutions de crédit adaptées à votre projet",
          href: "/financement#partenaires",
          image:
            "https://i.pinimg.com/1200x/95/70/a7/9570a740dff319b472f298de32eec435.jpg",
        },
        {
          title: "Assurance",
          description: "Protection complète pour votre logement",
          href: "/assurance",
          image:
            "https://i.pinimg.com/1200x/23/18/ba/2318ba8d8dd3bcc8f5e0bd17347032bd.jpg",
        },
        {
          title: "Social",
          description: "Accédez à un logement abordable",
          href: "/SHLMR",
          image:
            "https://i.pinimg.com/1200x/ba/4f/6c/ba4f6c637fdcdb2cb0d371a6a38db7a2.jpg",
        },
        {
          title: "Podcasts",
          description: "Vidéos fournies par des experts",
          href: "/podcasts/immobilier",
          image:
            "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
        },
      ],
    },
    {
      title: "SERVICES",
      items: [
        {
          title: "Trouver un professionnel",
          description: "Experts pour vos besoins spécifiques",
          href: "/services-partners",
          image:
            "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
        },
        {
          title: "Entreprise et pro",
          description: "Support stratégique pour entrepreneurs",
          href: "/conseil",
          image:
            "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
        },
        {
          title: "Travaux & Matériaux",
          description: "Construction, rénovation et fournitures",
          href: "/travaux?categorie=interieurs",
          image:
            "https://i.pinimg.com/736x/6a/9a/66/6a9a661a89881207fcc24bf0c16e5bf5.jpg",
        },
        {
          title: "Entretien & Équipements",
          description: "Services maison, décoration et équipements",
          href: "/domicile",
          image:
            "https://i.pinimg.com/736x/5a/d7/d2/5ad7d27a5bdf37ce1826d5c9ac03b6f4.jpg",
        },
        {
          title: "Santé & Bien-être",
          description: "Soins, nutrition et médecines naturelles",
          href: "/bien-etre",
          image:
            "https://i.pinimg.com/736x/a2/60/55/a260554ed14acf6dbcf9b19ed6e40429.jpg",
        },
<<<<<<< Updated upstream
        {
          title: "Emploi & Formations",
          description: "Offres d'emploi, formations et alternance",
          href: "/emploi-formations",
          image:
            "https://i.pinimg.com/736x/06/b1/dc/06b1dc5f7bcca0813ec75fc60af71120.jpg", // Image d'illustration emploi
        },
        // {
        // title: "Comptabilité",
        // description: " Services comptables professionnels",
        // href: "/comptabilite",
        // image:
        // "https://i.pinimg.com/736x/6d/a9/3e/6da93e9378f71ef13bf0e1f360d55ed3.jpg",
        // },
        // {
        // title: "Formation",
        // description: "Formations pour entrepreneurs",
        // href: "/entreprise#services",
        // image:
        // "https://i.pinimg.com/736x/a2/60/55/a260554ed14acf6dbcf9b19ed6e40429.jpg",
        // },
=======
>>>>>>> Stashed changes
        {
          title: "Podcasts",
          description: " Ressources pour entrepreneurs",
          href: "/podcast_service",
          image:
            "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
        },
      ],
    },
    {
      title: "EXPLORER ET VIVRE",
      items: [
        {
          title: "Découvrir & Sortir",
          description:
            "Partez à la rencontre des expériences qui animent votre région : sorties, culture, nature et moments à partager.",
          href: "/activiteLoisirs",
          image:
            "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg",
        },
        {
          title: "Séjourner & Voyager",
          description:
            "Organisez vos déplacements et vos séjours facilement, qu’ils soient courts, longs ou insolites.",
          href: "/voyages",
          image:
            "https://i.pinimg.com/736x/d9/23/b0/d923b0be1d7ff9ca3e729cf83a4e3a60.jpg",
        },
        {
          title: "Manger & Consommer",
          description:
            "Savourez, consommez local et prenez soin de votre alimentation au quotidien.",
          href: "/alimentation",
          image:
            "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg",
        },
        {
          title: "Maison & Quotidien",
          description:
            "Tout ce qu’il faut pour améliorer, entretenir et faciliter la vie à la maison.",
          href: "/produits#equipement",
          image:
            "https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg",
        },
        {
          title: "Art & Créations",
          description:
            "Mettez en lumière la créativité locale et les talents artistiques.",
          href: "/art-et-creation",
          image:
            "https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg",
        },
        {
          title: "Inspirer  & Éveiller ",
          description:
            "Un espace pour apprendre, s’inspirer et découvrir autrement.",
          href: "/podcasts/reunion",
          image:
            "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
        },
      ],
    },
    /*** Nos partenaire*/
    {
      title: "NOS PARTENAIRES",
      items: [
        {
          title: "Tous nos partenaires",
          description: "Découvrez l'ensemble de nos partenaires",
          href: "/tous-les-partenaires",
          image:
            "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
        },
        {
          title: "Nos agences",
          description: "Decouvrir notre partenariat agences",
          href: "/agences",
          image:
            "https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg",
        },
        {
          title: "Nos constructeurs",
          description: "Professionnels en construction et rénovation",
          href: "/constructeurs",
          image:
            "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
        },
        {
          title: "Nos plombiers",
          description: "Experts en plomberie et installations sanitaires",
          href: "/plombiers",
          image:
            "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg",
        },
        {
          title: "Podcasts",
          description: "Témoignages et interviews de partenaires",
          href: "/podcasts/partenaires",
          image:
            "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
        },
      ],
    },
<<<<<<< Updated upstream
    // {
    //   title: "TRAVAUX & MATÉRIAUX",
    //   items: [
    //     {
    //       title: "Construction",
    //       description: "Travaux de construction",
    //       href: "/travaux?categorie=constructions",
    //       image:
    //         "https://i.pinimg.com/736x/0d/78/24/0d7824617574c86c95a7d14399e90858.jpg",
    //     },
    //     {
    //       title: "Travaux Intérieur",
    //       description: "Services pour l'intérieur",
    //       href: "/travaux?categorie=interieurs",
    //       image:
    //         "https://i.pinimg.com/1200x/fe/5c/1a/fe5c1a7e46c506905b0e124d1f9a374d.jpg",
    //     },
    //     {
    //       title: "Travaux Extérieur",
    //       description: "Services pour l'extérieur",
    //       href: "/travaux?categorie=exterieurs",
    //       image:
    //         "https://i.pinimg.com/736x/90/49/46/9049462b0f6124398a68da38949985a8.jpg",
    //     },

    //     {
    //       title: "Matériaux",
    //       description: "Fournitures de matériaux de construction",
    //       href: "/travaux?categorie=constructions",
    //       image:
    //         "https://i.pinimg.com/736x/0d/78/24/0d7824617574c86c95a7d14399e90858.jpg",
    //     },
    //     {
    //       title: "Autres services travaux",
    //       description: "Services divers pour vos travaux",
    //       href: "/travaux?categorie=constructions",
    //       image:
    //         "https://i.pinimg.com/736x/0d/78/24/0d7824617574c86c95a7d14399e90858.jpg",
    //     },
    //     {
    //       title: "Autres services travaux",
    //       description: "Services divers pour vos travaux",
    //       href: "/travaux?categorie=constructions",
    //       image:
    //         "https://i.pinimg.com/736x/0d/78/24/0d7824617574c86c95a7d14399e90858.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "ENTRETIEN & ÉQUIPEMENTS",
    //   items: [
    //     {
    //       title: "Services maison (ménage, jardinage, piscine, sécurité, etc.)",
    //       description: "Services professionnels pour votre domicile",
    //       href: "/domicile#service-maison",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Design & Décoration",
    //       description: "Solutions esthétiques pour votre intérieur",
    //       href: "/produits#design",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Équipements (électroménager, ameublement, etc.)",
    //       description: "Matériel & équipements haute performance",
    //       href: "/produits#equipement",
    //       image:
    //         "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg",
    //     },
    //     {
    //       title: "Outillages",
    //       description: "Outils et équipements de qualité professionnelle",
    //       href: "/produits#design",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Produits & accessoires",
    //       description: "Tout pour votre domicile",
    //       href: "/produits#design",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Marketplace d’occasion",
    //       description: "Achetez et vendez des articles d'occasion",
    //       href: "/produits#design",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "ART & CREATIONS",
    //   items: [
    //     {
    //       title: "Photographie",
    //       description: "Captures artistiques et professionnelles",
    //       href: "/photographie",
    //       image:
    //         "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg",
    //     },
    //     {
    //       title: "Sculpture",
    //       description: "Œuvres sculpturales uniques",
    //       href: "/sculpture",
    //       image:
    //         "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg",
    //     },
    //     {
    //       title: "Peinture",
    //       description: "Toiles et fresques originales",
    //       href: "/peinture",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Artisanat",
    //       description: "Créations artisanales authentiques",
    //       href: "/artisanat",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Marketplace créateurs",
    //       description: "Plateforme pour artistes et artisans",
    //       href: "/marketplace-createurs",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "ENTREPRISE & PRO",
    //   items: [
    //     {
    //       title: "Création",
    //       description: "Accompagnement à la création d'entreprise",
    //       href: "/reprise",
    //       image:
    //         "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg",
    //     },
    //     {
    //       title: "Rachat",
    //       description: "Accompagnement au rachat d'entreprise",
    //       href: "/rachat",
    //       image:
    //         "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg",
    //     },
    //     {
    //       title: "Cession & liquidation",
    //       description: "Accompagnement à la cession ou liquidation",
    //       href: "/juridiqueLiquidation",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Communication & marketing",
    //       description: "Stratégies pour développer votre activité",
    //       href: "/communicationMarketing",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Comptabilité",
    //       description: "Gestion comptable et financière",
    //       href: "/comptabilite",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Juridique",
    //       description: "Conseils et services juridiques pour entreprises",
    //       href: "/juridique",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //     {
    //       title: "Conseils & accompagnement",
    //       description: "Support stratégique pour entrepreneurs",
    //       href: "/Conseil_accompagnement",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //   ],
    // },
    // {
    // title: "ALIMENTATION",
    // items: [
    // {
    // title: "Courses & épicerie",
    // description: "Livraison de produits frais & épicerie",
    // href: "/alimentation#cours-epicerie",
    // image:
    // "https://i.pinimg.com/1200x/11/80/35/11803586e48bb4b954c93493a2fae78d.jpg",
    // },
    // {
    // title: "Boulangerie & charcuterie",
    // description: "Produits artisanaux livrés chez vous",
    // href: "/alimentation#boulangerie-charcuterie",
    // image:
    // "https://i.pinimg.com/736x/28/42/f2/2842f2dfe1ffa1cbbee9b4401ed3b07c.jpg",
    // },
    // {
    // title: "Cave & vins",
    // description: "Sélection de vins & spiritueux",
    // href: "/alimentation#cave-vins",
    // image:
    // "https://i.pinimg.com/1200x/90/22/b3/9022b34f5669bf2657f32acb26d1d554.jpg",
    // },
    // {
    // title: "Restaurants",
    // description: "Livraison de plats de vos restaurants favoris",
    // href: "/alimentation#restaurant",
    // image:
    // "https://i.pinimg.com/1200x/52/4e/ea/524eea16c0ef4ed64a19a32f4c43652d.jpg",
    // },
    // {
    // title: "Podcasts ",
    // description: " Ressources sur l'alimentation",
    // href: "/podcasts/alimentation",
    // image:
    // "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    // },
    // ],
    // },
    // {
    //   title: "SANTE & BIEN-ÊTRE",
    //   items: [
    //     {
    //       title: "Nutrition",
    //       description: "Conseils et plans alimentaires",
    //       href: "/nutrition",
    //       image:
    //         "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg",
    //     },
    //     {
    //       title: "Soins",
    //       description: "Produits et services de soins",
    //       href: "/soin",
    //       image:
    //         "https://i.pinimg.com/736x/86/53/78/86537889c9adc8cd402651170f22c712.jpg",
    //     },
    //     {
    //       title: "Thérapeutes",
    //       description: "Professionnels du bien-être à domicile",
    //       href: "/therapeute",
    //       image:
    //         "https://i.pinimg.com/1200x/32/9c/de/329cde5ea55b482c491c64cbee4048ea.jpg",
    //     },
    //     {
    //       title: "Huiles essentielles",
    //       description: "Bienfaits des huiles naturelles",
    //       href: "/huiles-essentielles",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //     {
    //       title: "Médecines naturelles (plantes, herbes, aliments)",
    //       description: "Remèdes et traitements naturels",
    //       href: "/produits-naturels",
    //       image:
    //         "https://i.pinimg.com/1200x/a7/a7/78/a7a778dfbb4199b45d864581411e7c0a.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "EMPLOI & FORMATIONS",
    //   items: [
    //     {
    //       title: "Formations (organismes, écoles, e‑learning)",
    //       description: "Développez vos compétences professionnelles",
    //       href: "/formations",
    //       image:
    //         "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg",
    //     },
    //     {
    //       title: "Offres d’emploi",
    //       description: "Trouvez des opportunités de carrière",
    //       href: "/emploi",
    //       image:
    //         "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg",
    //     },
    //     {
    //       title: "Alternance & stage",
    //       description: "Programmes pour étudiants et jeunes professionnels",
    //       href: "/alternance-stages",
    //       image:
    //         "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
    //     },
    //   ],
    // },
    // {
    // title: "INVESTISSEMENT",
    // items: [
    // {
    // title: "SCPI & immobilier",
    // description: "Investissez dans l'immobilier locatif",
    // href: "/investir/scpi",
    // image:
    // "https://i.pinimg.com/1200x/20/79/83/207983f864b7c516a64be40bc990df17.jpg",
    // },
    // {
    // title: "Crowdfunding & actions ",
    // description: "Investissez dans des projets innovants",
    // href: "/investir/crowdfunding",
    // image:
    // "https://i.pinimg.com/736x/50/f9/69/50f969a3d27b9d0cb7dfc4bff0b8a80a.jpg",
    // },
    // {
    // title: "Obligations & associations",
    // description: "Soutenez des causes tout en investissant",
    // href: "/investir/isr",
    // image:
    // "https://i.pinimg.com/736x/7e/d6/5a/7ed65a934c44e7486ba52a5c813b45b8.jpg",
    // },
    // // {
    // // title: "Podcasts",
    // // description: "Ressources sur l'investissement",
    // // href: "/podcasts/investissement",
    // // image:
    // // "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    // // },
    // ],
    // },
    // {
    // title: "ACTUALITÉS",
    // href: "/actualites",
    // },
    // {
    // title: "SERVICES ET PARTENAIRES",
    // href: "/service",
    // },
    // {
    // title: "DIGITALISATION",
    // href: "/digitalisation",
    // },
    // {
    // title: "ART & COMMERCES",
    // href: "/art-commerce",
    // },
    // {
    // title: "DONS",
    // href: "/don",
    // },
    // {
    // title: "NOS OFFRES EXCLUSIVES",
    // href: "/pack",
    // },
=======
    {
      title: "BLOG",
      href: "/blog",
    },
>>>>>>> Stashed changes
  ];

  const profilePath =
    role === "admin"
      ? "/admin"
      : role === "professional"
<<<<<<< Updated upstream
      ? "/pro"
      : "/mon-compte/profil";
=======
        ? "/pro"
        : "/mon-compte/profil";
  
>>>>>>> Stashed changes
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

  // Mobile Menu - version simplifiée
  const MobileMenu = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#D3D3D3]">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <ServoLogo />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(false)}
          className="h-10 w-10 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-4">
          {menuSections.map((section, index) => (
            <div key={index} className="border-b border-[#D3D3D3] pb-4">
              {section.items ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(section.title)}
                    className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-900 hover:text-gray-700 py-2"
                  >
                    {section.title}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openSubmenu === section.title ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openSubmenu === section.title && (
                    <div className="mt-2 space-y-2 pl-4">
                      {section.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={section.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-gray-900 hover:text-gray-700 py-2"
                >
                  {section.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-[#D3D3D3]">
        {!isAuthenticated ? (
          <div className="space-y-3">
            <Button
              className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogin();
              }}
            >
              Se connecter
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-8 h-8">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user?.firstName} ${user?.lastName}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-[#556B2F] text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-600 transition-transform flex-shrink-0 ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {role === "user" && isUserMenuOpen && (
              <nav className="space-y-2 py-3 border-t border-[#D3D3D3]">
                <button
                  onClick={() => {
                    navigate(profilePath);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profil</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/mes-commandes");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>Mes Commandes</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/demandes");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ListCheck className="h-4 w-4" />
                  <span>Mes demandes de services</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/demandes-immobilier");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <BookDashed className="h-4 w-4" />
                  <span>Mes demandes immobilières</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/mes-reservations-cours");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <List className="h-4 w-4" />
                  <span>Mes réservations de cours</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/location-voiture");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Car className="h-4 w-4" />
                  <span>Mes Locations de voitures </span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/reservation");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Réservations tourisme et bien etre</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/locationSaisonniere");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Building2Icon className="h-4 w-4" />
                  <span>Gestion des locations saisonnieres</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/documents");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Mes documents</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/mon-compte/agenda");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calendar1 className="h-4 w-4" />
                  <span>Mon agenda</span>
                </button>
              </nav>
            )}
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const profilePathDesktop =
    role === "admin"
      ? "/admin"
      : role === "professional"
<<<<<<< Updated upstream
      ? "/pro"
      : "/mon-compte/profil";
=======
        ? "/pro"
        : "/mon-compte/profil";
  
>>>>>>> Stashed changes
  return (
    <>
      <header
        id="head"
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white border-b shadow-md" 
            : "bg-transparent"
        }`}
      >
<<<<<<< Updated upstream
        <div className="container flex h-16 items-center justify-between px-6">
          <Link to={"/"}>
            <ServoLogo />
          </Link>
          {/* Menu desktop */}
          <nav className="hidden md:hidden lg:flex items-center gap-2">
            <ul className="flex items-center">
              {menuSections.slice(0, 4).map((section, index) => (
                <li key={index} className="group relative">
=======
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ServoLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuSections.slice(0, 4).map((section, index) => (
                <div key={index} className="relative group">
>>>>>>> Stashed changes
                  {section.items ? (
                    <>
                      <button
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isScrolled
                            ? "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            : "text-white hover:text-white/90 hover:bg-white/10"
                        }`}
                      >
                        {section.title}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {section.items.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              to={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={section.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isScrolled
                          ? "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                          : "text-white hover:text-white/90 hover:bg-white/10"
                      }`}
                    >
                      {section.title}
                    </Link>
                  )}
                </div>
              ))}
<<<<<<< Updated upstream
            </ul>
            {/* Desktop hamburger: Popover avec animation GSAP */}
            <div className="hidden lg:block">
              <Popover
                open={isPopoverOpen}
                onOpenChange={handlePopoverOpenChange}
              >
                <PopoverTrigger asChild>
                  {/* <Button className="h-9 hover:bg-logo/80 bg-logo">
                    <Menu className="text-white" />
                  </Button> */}
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="center"
                  className="relative -mt-16 w-screen max-w-full p-0 overflow-hidden z-50 rounded-none shadow-lg bg-black text-white border-none"
                >
                  <button
                    className="absolute z-50 text-white text-5xl font-extralight right-10 top-4"
                    onClick={() => setIsPopoverOpen(false)}
                    aria-label="Close popover"
                  >
                    &times;
                  </button>
                  <div className="w-full h-screen overflow-auto">
                    <div className="flex flex-col lg:flex-row h-full w-full">
                      {/* Left: Titles column */}
                      <div className="w-full lg:w-64 border-[#D3D3D3]/40 border-b lg:border-b-0 lg:border-r p-4 lg:sticky lg:top-4 lg:h-[500px]">
                        <Link to="/" onClick={() => setIsPopoverOpen(false)}>
                          <div className="flex items-center gap-2 mb-4">
                            <ServoLogo />
                          </div>
                        </Link>
                        <nav className="space-y-1 overflow-y-auto">
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
                                className={`py-1 px-4 rounded-md transition-colors cursor-pointer ${
                                  isActive
                                    ? "bg-[#FFFFFF]/10"
                                    : "hover:bg-[#FFFFFF]/5"
                                }`}
                              >
                                {hasItems ? (
                                  <button className="scramble w-full text-left text-xs font-semibold text-white">
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
                          <div className=" absolute -bottom-36 left-8 w-auto flex items-start justify-start z-50 gap-5 h-20">
                            {!isAuthenticated ? (
                              <Link
                                to="/login"
                                className="group relative bg-[#FFFFFF] text-[#556B2F] py-2 px-6 rounded-full font-semibold overflow-hidden transition-colors duration-300"
                              >
                                <span className="relative z-10 group-hover:text-[#FFFFFF]">
                                  Se connecter
                                </span>
                                <span className="absolute inset-0 bg-[#556B2F] border-[#556B2F] scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></span>
                              </Link>
                            ) : (
                              <Link
                                to="/"
                                onClick={handleLogout}
                                className="group relative border-2 border-red-600 text-red-600 py-2 px-6 rounded-full font-semibold overflow-hidden transition-colors duration-300"
                              >
                                <span className="relative z-10 group-hover:text-[#FFFFFF]">
                                  Déconnexion
                                </span>
                                <span className="absolute inset-0 bg-red-700 border-black scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></span>
                              </Link>
                            )}
                          </div>
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
                                <div className="relative z-10 text-[#FFFFFF]">
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
                                <div className="relative z-10 grid grid-cols-3 gap-6 p-6 mt-5">
                                  {current.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      onMouseEnter={() =>
                                        item.submenu &&
                                        setHoveredItem(item.title)
                                      }
                                      onMouseLeave={() => setHoveredItem(null)}
                                      className="relative group"
                                    >
                                      <Link
                                        to={item.href}
                                        onClick={() => setIsPopoverOpen(false)}
                                        className="block rounded-lg overflow-hidden hover:ring-2 hover:ring-[#FFFFFF]/20 transition-all"
                                      >
                                        <div className="relative aspect-video">
                                          {item.image && (
                                            <img
                                              src={item.image}
                                              alt={item.title}
                                              className="w-full h-full object-cover opacity-40"
                                            />
                                          )}
                                          <div className="absolute inset-0 bg-gradient-to-t from-black to-[#556B2F]/20 p-4 flex flex-col justify-end">
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <div className="text-[#FFFFFF] font-semibold group-hover:translate-x-2 transition-transform">
                                                  {item.title}
                                                </div>
                                                {item.description && (
                                                  <div className="text-sm text-[#D3D3D3] mt-1 group-hover:translate-x-2 transition-transform">
                                                    {item.description}
                                                  </div>
                                                )}
                                              </div>
                                              {item.submenu && (
                                                <ChevronLeft className="text-[#FFFFFF] h-5 w-5 transition-opacity" />
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                      {/* Submenu */}
                                      {item.submenu &&
                                        hoveredItem === item.title && (
                                          <div
                                            className="absolute left-full top-0 ml-2 w-64 bg-black rounded-lg border border-[#FFFFFF]/20 shadow-xl overflow-hidden z-[1100]"
                                            onMouseLeave={() =>
                                              setHoveredItem(null)
                                            }
                                          >
                                            <div className="p-4">
                                              <h3 className="text-[#FFFFFF] font-semibold mb-3 flex items-center gap-2">
                                                <ChevronLeft className="h-4 w-4" />
                                                {item.title}
                                              </h3>
                                              <div className="space-y-2">
                                                {item.submenu.map(
                                                  (subitem, subidx) => (
                                                    <Link
                                                      key={subidx}
                                                      to={subitem.href}
                                                      onClick={() =>
                                                        setIsPopoverOpen(false)
                                                      }
                                                      className="block p-2 rounded-lg hover:bg-[#FFFFFF]/10 transition-colors text-sm text-[#D3D3D3] hover:text-[#FFFFFF]"
                                                    >
                                                      <div className="font-medium">
                                                        {subitem.title}
                                                      </div>
                                                      {subitem.description && (
                                                        <div className="text-xs text-[#999999] mt-1">
                                                          {subitem.description}
                                                        </div>
                                                      )}
                                                    </Link>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-[#D3D3D3] p-6">
                            Survolez un titre à gauche pour voir les détails
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </nav>
          <div className="flex items-center gap-1">
            <div className="relative flex items-center">
              {/* Bouton de recherche */}
              <div className="relative flex items-center">
                {/* Option 1 : Simple bouton qui ouvre la page */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`
                    h-9 w-9 rounded-lg border transition-all duration-200 ml-2
                    ${
                      isSearchOpen
                        ? "bg-[#556B2F] text-[#FFFFFF] border-[#6B8E23]"
                        : "bg-[#556B2F] text-[#FFFFFF] border-[#556B2F] hover:bg-[#6B8E23]"
                    }
                  `}
                  onClick={openRecherchePage}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Icône Panier pour utilisateurs connectés */}
            {isAuthenticated && (
=======
            </nav>

            {/* Right side icons and buttons */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
>>>>>>> Stashed changes
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  isScrolled
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white hover:text-white/90 hover:bg-white/10"
                }`}
                onClick={openRecherchePage}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart for authenticated users */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative rounded-full ${
                    isScrolled
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white hover:text-white/90 hover:bg-white/10"
                  }`}
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {getCartItemsCount()}
                    </span>
                  )}
                </Button>
              )}

              {/* Notifications for authenticated users */}
              {isAuthenticated && role === "user" && (
                <Sheet
                  open={notifOpen}
                  onOpenChange={(open) => {
                    setNotifOpen(open);
                    if (open) loadNotifications();
                  }}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`relative rounded-full ${
                        isScrolled
                          ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                          : "text-white hover:text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <Bell className="h-5 w-5" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-[#556B2F] text-xs text-white">
                          {notificationCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[400px] p-0 overflow-hidden"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div className="space-y-1">
                          <h4 className="text-lg font-semibold text-[#8B4513]">
                            Notifications {notificationCount > 0 && `(${notificationCount})`}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {notifications.length} notification{notifications.length !== 1 ? "s" : ""} au total
                          </p>
                        </div>
                        {notifications.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {notifLoading ? (
                          <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F] mx-auto"></div>
                              <p className="mt-4 text-gray-700">Chargement...</p>
                            </div>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Bell className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">Aucune notification</p>
                          </div>
<<<<<<< Updated upstream
                        </div>
                      ) : (
                        <div className="space-y-2 p-2">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg border transition-colors ${
                                notification.isRead
                                  ? "bg-gray-50"
                                  : "bg-[#FFFFFF] border-[#556B2F] shadow-sm"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="text-sm font-medium text-gray-800 truncate">
                                      {notification.titre ||
                                        "Nouvelle notification"}
=======
                        ) : (
                          <div className="space-y-2 p-2">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-3 rounded-lg border ${
                                  notification.isRead ? "bg-gray-50" : "bg-white border-[#556B2F]"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-800">
                                      {notification.titre || "Nouvelle notification"}
>>>>>>> Stashed changes
                                    </div>
                                    {notification.message && (
                                      <div className="text-sm text-gray-600 mt-1">
                                        {notification.message}
                                      </div>
                                    )}
                                  </div>
<<<<<<< Updated upstream
                                  {notification.message && (
                                    <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                                      {notification.message}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {notification.statut && (
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          notification.statut === "validée" ||
                                          notification.statut === "validee"
                                            ? "bg-green-100 text-green-800"
                                            : notification.statut === "refusée"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {notification.statut}
                                      </span>
                                    )}
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        notification.source === "demande"
                                          ? "bg-[#556B2F] text-[#FFFFFF]"
                                          : "bg-[#8B4513] text-[#FFFFFF]"
                                      }`}
                                    >
                                      {notification.source === "demande"
                                        ? "Demande"
                                        : "Système"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
=======
>>>>>>> Stashed changes
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      notification.isRead
                                        ? handleMarkAsUnread(notification.id)
                                        : handleMarkAsRead(notification.id)
                                    }
                                    className="ml-2"
                                  >
                                    {notification.isRead ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
<<<<<<< Updated upstream
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#D3D3D3]">
                                <div className="text-xs text-gray-400">
                                  {notification.createdAt
                                    ? new Date(
                                        notification.createdAt
                                      ).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : ""}
                                </div>
                                <div className="flex items-center gap-2">
                                  {notification.source === "demande" &&
                                    notification.propertyId && (
                                      <a
                                        href={`/immobilier/${notification.propertyId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-[#556B2F] hover:underline font-medium"
                                      >
                                        👁️ Voir le bien
                                      </a>
                                    )}
                                  {notification.source === "demande" && (
                                    <a
                                      href={`/mon-compte/demandes-immobilier`}
                                      className="text-xs text-green-600 hover:underline font-medium"
                                    >
                                      📋 Voir la demande
                                    </a>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      handleDeleteNotification(notification.id)
                                    }
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Supprimer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
=======
                            ))}
                          </div>
                        )}
                      </div>
>>>>>>> Stashed changes
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              {/* Authentication */}
              {!isAuthenticated ? (
                <Button
                  className={`hidden lg:flex ${
                    isScrolled
                      ? "bg-[#556B2F] text-white hover:bg-[#6B8E23]"
                      : "bg-white text-[#556B2F] hover:bg-white/90"
                  }`}
                  size="sm"
                  onClick={handleLogin}
                >
                  Se connecter
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`h-10 w-10 rounded-full p-0 ${
                        isScrolled
                          ? "hover:bg-gray-100"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user?.firstName} ${user?.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className={`${
                            isScrolled
                              ? "bg-[#556B2F] text-white"
                              : "bg-white text-[#556B2F]"
                          }`}>
                            {initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(profilePath)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/mon-compte/mes-commandes")}>
                      <Package className="mr-2 h-4 w-4" />
                      Mes Commandes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${
                    isScrolled
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white hover:text-white/90 hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <MobileMenu />
          </SheetContent>
        </Sheet>
      </header>

      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Logout Confirmation Dialog */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirmer la déconnexion
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelLogout}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Se déconnecter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
<<<<<<< Updated upstream
export default Header;
=======

export default Header;
>>>>>>> Stashed changes
