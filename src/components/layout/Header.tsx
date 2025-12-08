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
import { X, Search, Building2Icon } from "lucide-react";

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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const openRecherchePage = () => {
    navigate("/recherche");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Rediriger vers la page de résultats ou exécuter la recherche
      navigate(`/recherche?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?$%*#";
    const speed = 20;
    const step = 0.5;
    const activeIntervals = new Map<HTMLElement, number>();
    const busy = new Set<HTMLElement>();

    function scrambleOnce(el: HTMLElement) {
      const original = el.dataset.original ?? el.textContent ?? "";
      el.dataset.original = original;

      if (busy.has(el)) return;
      busy.add(el);

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
          el.innerText = original;
          clearInterval(id);
          activeIntervals.delete(el);
          busy.delete(el);
        }
      }, speed);

      activeIntervals.set(el, id);
    }

    function onPointerOver(e: Event) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest(".scramble") as HTMLElement | null;
      if (!el) return;
      scrambleOnce(el);
    }

    document.addEventListener("pointerover", onPointerOver);

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
        loadNotifications(); // Recharge la listes des notifications
      }
    };

    window.addEventListener("notifications:reload", handler);
    return () => window.removeEventListener("notifications:reload", handler);
  }, [user?.id, notifOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setIsLoading(true);

      const timeoutId = setTimeout(() => {
        // Données simulées
        const mockResults = [
          {
            id: 1,
            title: "Appartement moderne",
            description: "Bel appartement 3 pièces en centre-ville",
            price: "250,000",
            href: "/immobilier/appartement-1",
            image:
              "https://i.pinimg.com/736x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg",
          },
          {
            id: 2,
            title: "Maison de ville",
            description: "Maison spacieuse avec jardin",
            price: "350,000",
            href: "/immobilier/maison-2",
            image:
              "https://i.pinimg.com/736x/ba/4f/6c/ba4f6c637fdcdb2cb0d371a6a38db7a2.jpg",
          },
          {
            id: 3,
            title: "Studio étudiant",
            description: "Studio meublé proche université",
            price: "120,000",
            href: "/immobilier/studio-3",
            image:
              "https://i.pinimg.com/736x/8c/c1/22/8cc122eb07f85e3b4881b3d20b318bd2.jpg",
          },
        ].filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(mockResults);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // ... le reste de vos fonctions existantes (handleLogin, handleLogout, etc.) ...
  const handleResultClick = (result: any) => {
    navigate(result.href);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const loadNotifications = async () => {
    if (!user?.id) return;

    setNotifLoading(true);
    try {
      console.log("📨 Chargement des notifications...");
      const response = await api.get(`/notifications/user/${user.id}`);
      const { notifications = [], unreadCount = 0 } = response.data || {};

      console.log(
        `✅ ${notifications.length} notifications chargées, ${unreadCount} non lues`
      );

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
      console.log(`📨 Marquer comme lu: ${notificationId}`);
      await api.post(`/notifications/user/${user.id}/read/${notificationId}`);

      // Mettre à jour localement
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );

      // Mettre à jour le compteur WebSocket
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
      console.log(`📨 Marquer comme non lu: ${notificationId}`);
      await api.post(`/notifications/user/${user.id}/unread/${notificationId}`);

      // Mettre à jour localement
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n))
      );

      // Mettre à jour le compteur WebSocket
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
      console.log("📨 Marquer toutes comme lues");
      await api.post(`/notifications/user/${user.id}/read-all`);

      // Mettre à jour localement
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      // Réinitialiser le compteur WebSocket
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
      console.log("🗑️ Supprimer toutes les notifications");
      await api.post(`/notifications/user/${user.id}/clear-all`);

      // Recharger les notifications
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
      console.log(`🗑️ Supprimer notification: ${notificationId}`);
      await api.delete(
        `/notifications/user/${user.id}/delete/${notificationId}`
      );

      // Recharger les notifications
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
        // {
        //   title: "Annonces immobilières",
        //   description: "Trouvez votre prochaine maison",
        //   href: "/immobilier",
        //   image:
        //     "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg",
        // },
        {
          title: "Achat",
          description: "Trouvez votre prochaine article",
          href: "/immobilier",
          image:
            "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg",
        },
        {
          title: "Location",
          description: "Trouvez des arcticle à louer",
          href: "/immobilier",
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

        // {
        //   title: "PSLA",
        //   description: "Profitez du Prêt Social Location Accession",
        //   href: "/PSLA",
        //   image:
        //     "https://i.pinimg.com/736x/cb/99/bd/cb99bd1328705c93baeed915b9e10d5d.jpg",
        // },

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
          href: "/financement#assurances",
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
        // {
        //   title: "Droit & formation immobilière",
        //   description: "Divorce, succession, donation, . . .",
        //   href: "/droitFamille",
        //   image:
        //     "https://i.pinimg.com/736x/a1/91/eb/a191ebeb94928180470add7e2e1284e2.jpg",
        // },
        // {
        //   title: "Programme neuf",
        //   description: "Investissez dans du neuf",
        //   href: "/programme-neuf",
        //   image:
        //     "https://i.pinimg.com/1200x/8c/c1/22/8cc122eb07f85e3b4881b3d20b318bd2.jpg",
        // },
        // {
        //   title: "Audit patrimonial & finance",
        //   description: "Optimisez votre patrimoine immobilier",
        //   href: "/immobilier-sections",
        //   image:
        //     "https://i.pinimg.com/736x/41/d8/69/41d8699229ed3bd63cf723faa543fc95.jpg",
        // },
        // {
        //   title: "Blogs et conseils",
        //   description: "Actualités et astuces immobilières",
        //   href: "/blog",
        //   image:
        //     "https://i.pinimg.com/1200x/aa/e0/7d/aae07d295ac376efa051410403eacfec.jpg",
        // },
        // {
        //   title: "Estimation & expertise",
        //   description: " Évaluez la valeur de votre bien",
        //   href: "/estimation-immobilier",
        //   image: "https://i.pinimg.com/1200x/2a/33/c7/2a33c7347de60d0c65be83a72c4495be.jpg"
        // },
        // {
        //   title: "Podcasts",
        //   description: "Vidéos fournies par des experts",
        //   href: "/podcasts/immobilier",
        //   image:
        //     "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
        // },
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
        //   title: "Vivre à la Réunion",
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
      ],
    },
    // {
    //   title: "BATIMENT",
    //   items: [
    //     // {
    //     //   title: "Rénovation & construction",
    //     //   description: "Experts en rénovation de bâtiments",
    //     //   href: "/batiments#renovation-chantiers",
    //     //   image: "https://i.pinimg.com/736x/7a/f7/95/7af795aa69261731feae01375ad824df.jpg"
    //     // },
    //     // {
    //     //   title: "Construction & plans",
    //     //   description: " De la conception à la réalisation",
    //     //   href: "/batiments#construction-plans",
    //     //   image: "https://i.pinimg.com/1200x/75/d5/84/75d5848fde7b30cac973164b34836730.jpg"
    //     // },

    //     {
    //       title: "Rénovation & construction",
    //       description: " Services de rénovation et construction professionnels",
    //       href: "/travaux",
    //       image:
    //         "https://i.pinimg.com/1200x/75/d5/84/75d5848fde7b30cac973164b34836730.jpg",
    //     },
    //     {
    //       title: "Plan & administratifs",
    //       description: "Documents administratifs simplifiés",
    //       href: "/plan_administratif",
    //       image:
    //         "https://i.pinimg.com/736x/7d/05/6d/7d056d506f943d48a0ca9ad81b85e018.jpg",
    //     },
    //     {
    //       title: "Matériaux de construction",
    //       description: " Solutions durables pour vos projets",
    //       href: "/batiments#materiaux-viabilisations",
    //       image:
    //         "https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg",
    //     },
    //     // {
    //     //   title: "Division parcellaire",
    //     //   description: " Optimisation de l'espace foncier",
    //     //   href: "/batiments#division-parcellaire",
    //     //   image: "https://i.pinimg.com/1200x/67/fe/59/67fe591357a9c5d9d5175476cc28d20a.jpg"
    //     // },
    //     {
    //       title: "Formation",
    //       description: " Formations pour professionnels du bâtiment",
    //       href: "/formation-batiment",
    //       image:
    //         "https://i.pinimg.com/1200x/ff/71/1f/ff711ff866a562d1b9ee1c5ce68f8ecc.jpg",
    //     },
    //     {
    //       title: "Podcasts",
    //       description: " Ressources pour le secteur du bâtiment",
    //       href: "/batiments#podcasts-videos",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "DOMICILE",
    //   items: [
    //     {
    //       title: "Produits & commerces",
    //       description: " Trouvez tout pour votre maison",
    //       href: "/domicile#produits-commerces",
    //       image:
    //         "https://i.pinimg.com/1200x/e0/6a/9b/e06a9b44678d5ddd2a06c07ed8f1871f.jpg",
    //     },
    //     {
    //       title: "Service maison",
    //       description: " Services à domicile de qualité",
    //       href: "/domicile#service-maison",
    //       image:
    //         "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg",
    //     },
    //     {
    //       title: "Equipements & livraison",
    //       description: " Solutions pour un domicile moderne",
    //       href: "/domicile#équipements-livraison",
    //       image:
    //         "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg",
    //     },
    //     {
    //       title: "Design & décoration (art)",
    //       description: " Inspirez-vous pour votre intérieur",
    //       href: "/domicile#design-decoration",
    //       image:
    //         "https://i.pinimg.com/1200x/db/1e/d6/db1ed633dae5dd89cf4610c3f93a8103.jpg",
    //     },
    //     {
    //       title: "Cours & formations",
    //       description: " Apprenez de nouvelles compétences",
    //       href: "/domicile#cours-formations",
    //       image:
    //         "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg",
    //     },
    //     {
    //       title: "Utilities (eau, électricité, internet)",
    //       description: "Gestion efficace de votre domicile",
    //       href: "/domicile#utilities",
    //       image:
    //         "https://i.pinimg.com/1200x/2a/55/75/2a5575106b8bab32940c640840e1602b.jpg",
    //     },
    //     // {
    //     //   title: "Matériaux",
    //     //   description: "Matériaux de construction qualité premium",
    //     //   href: "/domicile#materiaux",
    //     //   image: "https://i.pinimg.com/736x/03/d7/70/03d7704dad409f8713915bcee69314b1.jpg"
    //     // },
    //     {
    //       title: "Podcasts",
    //       description: "Ressources pour l'aménagement",
    //       href: "/podcasts/domicile",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },

    ///**********************service
    {
      title: "SERVICES",
      items: [
        // {
        //   title: "Devenir partenaire",
        //   description: "Rejoignez notre réseau d'experts",
        //   href: "/entreprise#partenaire",
        //   image: "https://i.pinimg.com/736x/6a/9a/66/6a9a661a89881207fcc24bf0c16e5bf5.jpg"
        // },
        {
          title: "Trouver un professionnel",
          description: "Experts pour vos besoins spécifiques",
          href: "/services-partners",
          image:
            "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
        },
        // {
        //   title: "Création & reprise",
        //   description: "Accompagnement pour entrepreneurs",
        //   href: "/reprise",
        //   image:
        //     "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
        // },
        {
          title: "Formation",
          description: "Formations pour entrepreneurs",
          href: "/entreprise#services",
          image:
            "https://i.pinimg.com/736x/a2/60/55/a260554ed14acf6dbcf9b19ed6e40429.jpg",
        },

        // {
        //   title: "Audit & médiation",
        //   description: "Experts en audit & résolution de conflits",
        //   href: "/auditMediation",
        //   image:
        //     "https://i.pinimg.com/736x/5a/d7/d2/5ad7d27a5bdf37ce1826d5c9ac03b6f4.jpg",
        // },
        {
          title: "Entreprise",
          description: "Accompagnement pour entrepreneurs",
          href: "/reprise",
          image:
            "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
        },
        {
          title: "Conseil",
          description: "Experts en audit & résolution de conflits",
          href: "#",
          image:
            "https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg",
        },
        // {
        //   title: "Aides & levées de fonds",
        //   description: " Soutien financier pour entreprises",
        //   href: "/aideFonds",
        //   image:
        //     "https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg",
        // },
        // {
        //   title: "Juridique & liquidation",
        //   description: " Services juridiques pour entreprises",
        //   href: "/juridiqueLiquidation",
        //   image:
        //     "https://i.pinimg.com/736x/06/b1/dc/06b1dc5f7bcca0813ec75fc60af71120.jpg",
        // },
        {
          title: "Accompagnement",
          description: "Accompagnement juridique pour entreprises",
          href: "#",
          image:
            "https://i.pinimg.com/736x/6d/a9/3e/6da93e9378f71ef13bf0e1f360d55ed3.jpg",
        },
        // {
        //   title: "Comptabilité",
        //   description: " Services comptables professionnels",
        //   href: "/comptabilite",
        //   image:
        //     "https://i.pinimg.com/736x/6d/a9/3e/6da93e9378f71ef13bf0e1f360d55ed3.jpg",
        // },
        // {
        //   title: "Formation",
        //   description: "Formations pour entrepreneurs",
        //   href: "/entreprise#services",
        //   image:
        //     "https://i.pinimg.com/736x/a2/60/55/a260554ed14acf6dbcf9b19ed6e40429.jpg",
        // },
        // {
        //   title: "Podcasts",
        //   description: " Ressources pour entrepreneurs",
        //   href: "/podcast_service",
        //   image:
        //     "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
        // },
      ],
    },

    // {
    //   title: "CREDIT & ASSURANCE",
    //   items: [
    //     {
    //       title: "Financement",
    //       description: "Solutions de crédit adaptées à votre projet",
    //       href: "/financement#partenaires",
    //       image:
    //         "https://i.pinimg.com/1200x/95/70/a7/9570a740dff319b472f298de32eec435.jpg",
    //     },
    //     {
    //       title: "Assurance",
    //       description: "Protection complète pour votre logement",
    //       href: "/financement#assurances",
    //       image:
    //         "https://i.pinimg.com/1200x/23/18/ba/2318ba8d8dd3bcc8f5e0bd17347032bd.jpg",
    //     },
    //     {
    //       title: "Aides",
    //       description: "Solutions d'aides au financement",
    //       href: "/aide_financement",
    //       image:
    //         "https://i.pinimg.com/736x/0b/7c/04/0b7c04864983a272502185b97c5b9c35.jpg",
    //     },
    //     {
    //       title: "Formations ",
    //       description: "Formations au financement et crédit",
    //       href: "/formation_finance",
    //       image:
    //         "https://i.pinimg.com/1200x/ff/71/1f/ff711ff866a562d1b9ee1c5ce68f8ecc.jpg",
    //     },
    //     {
    //       title: "Podcasts",
    //       description: " Ressources sur le financement",
    //       href: "/podcasts/assurance-finance",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "ENTREPRISE",
    //   items: [
    //     // {
    //     //   title: "Devenir partenaire",
    //     //   description: "Rejoignez notre réseau d'experts",
    //     //   href: "/entreprise#partenaire",
    //     //   image: "https://i.pinimg.com/736x/6a/9a/66/6a9a661a89881207fcc24bf0c16e5bf5.jpg"

    //     // },

    //     {
    //       title: "Création & reprise",
    //       description: "Accompagnement pour entrepreneurs",
    //       href: "/reprise",
    //       image:
    //         "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
    //     },
    //     {
    //       title: "Audit & médiation",
    //       description: "Experts en audit & résolution de conflits",
    //       href: "/auditMediation",
    //       image:
    //         "https://i.pinimg.com/736x/5a/d7/d2/5ad7d27a5bdf37ce1826d5c9ac03b6f4.jpg",
    //     },
    //     {
    //       title: "Aides & levées de fonds",
    //       description: " Soutien financier pour entreprises",
    //       href: "/aideFonds",
    //       image:
    //         "https://i.pinimg.com/736x/14/aa/e2/14aae20d25a8740ae4c4f2228c97bc3f.jpg",
    //     },
    //     {
    //       title: "Juridique & liquidation",
    //       description: " Services juridiques pour entreprises",
    //       href: "/juridiqueLiquidation",
    //       image:
    //         "https://i.pinimg.com/736x/06/b1/dc/06b1dc5f7bcca0813ec75fc60af71120.jpg",
    //     },
    //     {
    //       title: "Comptabilité",
    //       description: " Services comptables professionnels",
    //       href: "/comptabilite",
    //       image:
    //         "https://i.pinimg.com/736x/6d/a9/3e/6da93e9378f71ef13bf0e1f360d55ed3.jpg",
    //     },
    //     {
    //       title: "Formation",
    //       description: "Formations pour entrepreneurs",
    //       href: "/entreprise#services",
    //       image:
    //         "https://i.pinimg.com/736x/a2/60/55/a260554ed14acf6dbcf9b19ed6e40429.jpg",
    //     },
    //     {
    //       title: "Podcasts",
    //       description: " Ressources pour entrepreneurs",
    //       href: "/podcast_service",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "TOURISME",
    //   items: [
    //     {
    //       title: "Hôtels & gîtes",
    //       description: "Réservations d'hébergements",
    //       href: "/tourisme",
    //       image:
    //         "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
    //     },
    //     {
    //       title: "Activités & loisirs",
    //       description: "Découvertes & aventures",
    //       href: "/activiteLoisirs",
    //       image:
    //         "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg",
    //     },
    //     {
    //       title: "Lieux historiques & culturels",
    //       description: "Explorez le patrimoine local",
    //       href: "/lieux_historique",
    //       image:
    //         "https://i.pinimg.com/1200x/91/01/6a/91016ac95b54c8a72d47945497fc1ddc.jpg",
    //     },
    //     {
    //       title: "Formations",
    //       description: "Cours & ateliers locaux",
    //       href: "/formationTourisme",
    //       image:
    //         "https://i.pinimg.com/1200x/ff/71/1f/ff711ff866a562d1b9ee1c5ce68f8ecc.jpg",
    //     },
    //     {
    //       title: "Voyages",
    //       description: "Cours & ateliers locaux",
    //       href: "/voyages",
    //       image:
    //         "https://i.pinimg.com/736x/d9/23/b0/d923b0be1d7ff9ca3e729cf83a4e3a60.jpg",
    //     },
    //     {
    //       title: "Podcasts",
    //       description: "Ressources sur le tourisme",
    //       href: "/podcasts/tourisme",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "ALIMENTATION",
    //   items: [
    //     {
    //       title: "Courses & épicerie",
    //       description: "Livraison de produits frais & épicerie",
    //       href: "/alimentation#cours-epicerie",
    //       image:
    //         "https://i.pinimg.com/1200x/11/80/35/11803586e48bb4b954c93493a2fae78d.jpg",
    //     },
    //     {
    //       title: "Boulangerie & charcuterie",
    //       description: "Produits artisanaux livrés chez vous",
    //       href: "/alimentation#boulangerie-charcuterie",
    //       image:
    //         "https://i.pinimg.com/736x/28/42/f2/2842f2dfe1ffa1cbbee9b4401ed3b07c.jpg",
    //     },
    //     {
    //       title: "Cave & vins",
    //       description: "Sélection de vins & spiritueux",
    //       href: "/alimentation#cave-vins",
    //       image:
    //         "https://i.pinimg.com/1200x/90/22/b3/9022b34f5669bf2657f32acb26d1d554.jpg",
    //     },
    //     {
    //       title: "Restaurants",
    //       description: "Livraison de plats de vos restaurants favoris",
    //       href: "/alimentation#restaurant",
    //       image:
    //         "https://i.pinimg.com/1200x/52/4e/ea/524eea16c0ef4ed64a19a32f4c43652d.jpg",
    //     },
    //     {
    //       title: "Podcasts ",
    //       description: " Ressources sur l'alimentation",
    //       href: "/podcasts/alimentation",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "BIEN-ÊTRE",
    //   items: [
    //     {
    //       title: "Cours à domicile",
    //       description: "Formations & ateliers personnalisés",
    //       href: "/bien-etre",
    //       image:
    //         "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg",
    //     },
    //     {
    //       title: "Arts & commerces",
    //       description: "Artisans & boutiques bien-être",
    //       href: "/art-commerce",
    //       image:
    //         "https://i.pinimg.com/736x/86/53/78/86537889c9adc8cd402651170f22c712.jpg",
    //     },
    //     {
    //       title: "Thérapeutes & soins",
    //       description: "Professionnels du bien-être à domicile",
    //       href: "/bien-etre",
    //       image:
    //         "https://i.pinimg.com/1200x/32/9c/de/329cde5ea55b482c491c64cbee4048ea.jpg",
    //     },
    //     {
    //       title: "Boutique & produits naturels",
    //       description: "Produits pour le bien-être",
    //       href: "/produits-naturels",
    //       image:
    //         "https://i.pinimg.com/1200x/a7/a7/78/a7a778dfbb4199b45d864581411e7c0a.jpg",
    //     },
    //     {
    //       title: "Podcasts",
    //       description: "Ressources pour le bien-être",
    //       href: "/podcasts-bien_etre",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },

    {
      title: "VIVRE À LA RÉUNION",
      items: [
        {
          title: "Produits et accessoires",
          description: "Tout pour votre domicile",
          href: "/batiments#materiaux-viabilisations",
          image:
            "https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg",
        },
        {
          title: "Explorer la Réunion",
          description: "Réservations d'hébergements",
          href: "/tourisme",
          image:
            "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
        },
        {
          title: "Manger à la Réunion",
          description: "Restaurants & courses & bien être",
          href: "/#",
          image:
            "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg",
        },
      ],
    },

    /*** Nos partenaire*/
    {
      title: "NOS PARTENAIRES",
      items: [
        {
          title: "Agences",
          description: "Decouvrir notre partenariat agences",
          href: "/agences",
          image:
            "https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg",
        },
        {
          title: "Rchizcte",
          description: "Fiche présentation et projets réalisés",
          href: "#",
          image:
            "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
        },
        {
          title: "Constructeurs",
          description: "Fiche présentation et projets réalisés",
          href: "#",
          image:
            "https://i.pinimg.com/1200x/31/cf/76/31cf76206178401a11c24710c63e7c43.jpg",
        },
        {
          title: "Plombiers",
          description: "Fiche présentation et projets réalisés",
          href: "#",
          image:
            "https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg",
        },
      ],
    },

    // {
    //   title: "ALIMENTATION",
    //   items: [
    //     {
    //       title: "Courses & épicerie",
    //       description: "Livraison de produits frais & épicerie",
    //       href: "/alimentation#cours-epicerie",
    //       image:
    //         "https://i.pinimg.com/1200x/11/80/35/11803586e48bb4b954c93493a2fae78d.jpg",
    //     },
    //     {
    //       title: "Boulangerie & charcuterie",
    //       description: "Produits artisanaux livrés chez vous",
    //       href: "/alimentation#boulangerie-charcuterie",
    //       image:
    //         "https://i.pinimg.com/736x/28/42/f2/2842f2dfe1ffa1cbbee9b4401ed3b07c.jpg",
    //     },
    //     {
    //       title: "Cave & vins",
    //       description: "Sélection de vins & spiritueux",
    //       href: "/alimentation#cave-vins",
    //       image:
    //         "https://i.pinimg.com/1200x/90/22/b3/9022b34f5669bf2657f32acb26d1d554.jpg",
    //     },
    //     {
    //       title: "Restaurants",
    //       description: "Livraison de plats de vos restaurants favoris",
    //       href: "/alimentation#restaurant",
    //       image:
    //         "https://i.pinimg.com/1200x/52/4e/ea/524eea16c0ef4ed64a19a32f4c43652d.jpg",
    //     },
    //     {
    //       title: "Podcasts ",
    //       description: " Ressources sur l'alimentation",
    //       href: "/podcasts/alimentation",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },
    // {
    //   title: "BIEN-ÊTRE",
    //   items: [
    //     {
    //       title: "Cours à domicile",
    //       description: "Formations & ateliers personnalisés",
    //       href: "/bien-etre",
    //       image:
    //         "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg",
    //     },
    //     {
    //       title: "Arts & commerces",
    //       description: "Artisans & boutiques bien-être",
    //       href: "/art-commerce",
    //       image:
    //         "https://i.pinimg.com/736x/86/53/78/86537889c9adc8cd402651170f22c712.jpg",
    //     },
    //     {
    //       title: "Thérapeutes & soins",
    //       description: "Professionnels du bien-être à domicile",
    //       href: "/bien-etre",
    //       image:
    //         "https://i.pinimg.com/1200x/32/9c/de/329cde5ea55b482c491c64cbee4048ea.jpg",
    //     },
    //     {
    //       title: "Boutique & produits naturels",
    //       description: "Produits pour le bien-être",
    //       href: "/produits-naturels",
    //       image:
    //         "https://i.pinimg.com/1200x/a7/a7/78/a7a778dfbb4199b45d864581411e7c0a.jpg",
    //     },
    //     {
    //       title: "Podcasts",
    //       description: "Ressources pour le bien-être",
    //       href: "/podcasts-bien_etre",
    //       image:
    //         "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     },
    //   ],
    // },

    // {
    //   title: "INVESTISSEMENT",
    //   items: [
    //     {
    //       title: "SCPI & immobilier",
    //       description: "Investissez dans l'immobilier locatif",
    //       href: "/investir/scpi",
    //       image:
    //         "https://i.pinimg.com/1200x/20/79/83/207983f864b7c516a64be40bc990df17.jpg",
    //     },
    //     {
    //       title: "Crowdfunding & actions ",
    //       description: "Investissez dans des projets innovants",
    //       href: "/investir/crowdfunding",
    //       image:
    //         "https://i.pinimg.com/736x/50/f9/69/50f969a3d27b9d0cb7dfc4bff0b8a80a.jpg",
    //     },
    //     {
    //       title: "Obligations & associations",
    //       description: "Soutenez des causes tout en investissant",
    //       href: "/investir/isr",
    //       image:
    //         "https://i.pinimg.com/736x/7e/d6/5a/7ed65a934c44e7486ba52a5c813b45b8.jpg",
    //     },
    //     // {
    //     //   title: "Podcasts",
    //     //   description: "Ressources sur l'investissement",
    //     //   href: "/podcasts/investissement",
    //     //   image:
    //     //     "https://i.pinimg.com/736x/3e/72/20/3e7220bc57aa103638b239e0ba4742b4.jpg",
    //     // },
    //   ],
    // },
    // {
    //   title: "ACTUALITÉS",
    //   href: "/actualites",
    // },
    // {
    //   title: "SERVICES ET PARTENAIRES",
    //   href: "/service",
    // },
    // {
    //   title: "DIGITALISATION",
    //   href: "/digitalisation",
    // },
    // {
    //   title: "ART & COMMERCES",
    //   href: "/art-commerce",
    // },
    // {
    //   title: "DONS",
    //   href: "/don",
    // },
    // {
    //   title: "NOS OFFRES EXCLUSIVES",
    //   href: "/pack",
    // },
  ];

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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
            <div key={index} className="border-b border-gray-100 pb-4">
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

      <div className="p-4 border-t border-gray-200">
        {!isAuthenticated ? (
          <div className="space-y-3">
            <Button
              className="w-full bg-black hover:bg-gray-800 text-white"
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
                  <AvatarFallback className="bg-gray-900 text-white text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-600 transition-transform flex-shrink-0 ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Menu utilisateur pour mobile */}
            {role === "user" && isUserMenuOpen && (
              <nav className="space-y-2 py-3 border-t border-gray-200">
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

                {/* <button
                  onClick={() => {
                    navigate("/mon-compte/mes-reservations-cours");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <List className="h-4 w-4" />
                  <span>Mes réservations en cours</span>
                </button> */}

                <button
                  onClick={() => {
                    navigate("/mon-compte/reservation");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Réservations</span>
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
                    navigate("/mon-compte/payement");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Paiements</span>
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

  return (
    <>
      <header
        id="head"
        className="fixed w-screen top-0 z-50 bg-white backdrop-blur-md border shadow-lg"
      >
        <div className="container flex h-16 items-center justify-between px-6">
          <Link to={"/"}>
            <ServoLogo />
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
                    className="absolute z-50 text-white text-5xl font-extralight right-10 top-4"
                    onClick={() => setIsPopoverOpen(false)}
                    aria-label="Close popover"
                  >
                    &times;
                  </button>

                  <div className="w-full h-screen overflow-auto">
                    <div className="flex flex-col lg:flex-row h-full w-full">
                      {/* Left: Titles column */}
                      <div className="w-full lg:w-64 border-gray-800/40 border-b lg:border-b-0 lg:border-r p-4 lg:sticky lg:top-4 lg:h-[500px]">
                        <Link to="/" onClick={() => setIsPopoverOpen(false)}>
                          <div className="flex items-center gap-2 mb-4">
                            <ServoLogo />
                            <div className="azonix text-lg font-bold text-slate-300">
                              SERVO
                            </div>
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
                                  isActive ? "bg-white/10" : "hover:bg-white/5"
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
                                className="group relative bg-white text-black py-2 px-6 rounded-full font-semibold overflow-hidden transition-colors duration-300"
                              >
                                <span className="relative z-10 group-hover:text-white">
                                  Se connecter
                                </span>
                                <span className="absolute inset-0 bg-black border-black scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></span>
                              </Link>
                            ) : (
                              <Link
                                to="/"
                                onClick={handleLogout}
                                className="group relative border-2 border-red-600 text-red-600 py-2 px-6 rounded-full font-semibold overflow-hidden transition-colors duration-300"
                              >
                                <span className="relative z-10 group-hover:text-white">
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
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-black text-white border-gray-800 hover:bg-gray-800"
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

            {/* Icône Notifications avec WebSocket - CORRIGÉ */}
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
                    className="relative hidden lg:flex"
                  >
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge className="absolute bottom-1 right-1 h-3 w-3 flex items-center justify-center p-1 text-[10px] bg-blue-500 text-white">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[400px] p-0 overflow-hidden"
                >
                  <div className="flex flex-col h-full">
                    {/* Header des notifications */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold">
                          Notifications{" "}
                          {notificationCount > 0 && `(${notificationCount})`}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {notifications.length} notification
                          {notifications.length !== 1 ? "s" : ""} au total
                        </p>
                      </div>
                      {notifications.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Tout supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Contenu des notifications */}
                    <div className="flex-1 overflow-y-auto">
                      {notifLoading ? (
                        <div className="text-center flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">
                          <img
                            src="/loading.gif"
                            alt=""
                            className="w-24 h-24"
                          />
                          <p className="mt-4 text-xl font-semibold text-gray-700">
                            Chargement des notifications...
                          </p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mb-3" />
                          <div className="text-sm text-gray-500 mb-1">
                            Aucune notification
                          </div>
                          <div className="text-xs text-gray-400">
                            Les nouvelles notifications apparaîtront ici
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 p-2">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg border transition-colors ${
                                notification.isRead
                                  ? "bg-gray-50"
                                  : "bg-white border-blue-200 shadow-sm"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="text-sm font-medium text-gray-800 truncate">
                                      {notification.titre ||
                                        "Nouvelle notification"}
                                    </div>
                                    {!notification.isRead && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                    )}
                                  </div>

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
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-purple-100 text-purple-800"
                                      }`}
                                    >
                                      {notification.source === "demande"
                                        ? "Demande"
                                        : "Système"}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() =>
                                      notification.isRead
                                        ? handleMarkAsUnread(notification.id)
                                        : handleMarkAsRead(notification.id)
                                    }
                                    title={
                                      notification.isRead
                                        ? "Marquer comme non lu"
                                        : "Marquer comme lu"
                                    }
                                  >
                                    {notification.isRead ? (
                                      <EyeOff className="h-3 w-3 text-gray-500" />
                                    ) : (
                                      <Eye className="h-3 w-3 text-blue-500" />
                                    )}
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
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
                                        className="text-xs text-blue-600 hover:underline font-medium"
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
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
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
                        onClick={() =>
                          navigate("/mon-compte/locationSaisonniere")
                        }
                      >
                        <BookDashed className="mr-2 h-4 w-4" />
                        Gestion des locations saisonnières
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        onClick={() =>
                          navigate("/mon-compte/mes-reservations-cours")
                        }
                      >
                        <List className="mr-2 h-4 w-4" />
                        Mes réservations en cours
                      </DropdownMenuItem> */}
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
                      <DropdownMenuItem
                        onClick={() => navigate("/mon-compte/documents")}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Mes documents
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/mon-compte/agenda")}
                      >
                        <Calendar1 className="mr-2 h-4 w-4" />
                        Mon agenda
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
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
                  <MobileMenu />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Logout Confirmation Dialog */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelLogout}
          />
          <div className="relative z-50 w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirmer la déconnexion
                </h2>
                <p className="text-sm text-gray-500">
                  Cette action ne peut pas être annulée
                </p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous
                reconnecter pour accéder à votre compte.
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <Button
                variant="outline"
                onClick={handleCancelLogout}
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
