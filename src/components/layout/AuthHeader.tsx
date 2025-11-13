import React, { useState, useRef, useEffect } from "react";
// Remplacement du Link de Next.js par celui de React Router
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
// Import des icônes
import {
  Bell,
  Search,
  User,
  Home,
  Package,
  Calendar,
  X,
  LogOut,
  Settings,
} from "lucide-react";

// NOTE: Assurez-vous que ces chemins et composants sont valides dans votre projet React.
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthService from "@/services/authService";

// --- Interfaces et Données Mockées (inchangées) ---
interface SearchResult {
  id: string;
  type: "user" | "listing" | "service" | "booking";
  title: string;
  subtitle: string;
  url: string;
}

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Nouvelle annonce en attente",
    message: "Villa à Ivandry nécessite une validation",
    time: "Il y a 5 min",
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Paiement reçu",
    message: "Transaction de 2,500,000 Ar confirmée",
    time: "Il y a 1h",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Nouveau prestataire",
    message: "Demande d'inscription de Plomberie Pro",
    time: "Il y a 2h",
    read: false,
  },
  {
    id: "4",
    type: "error",
    title: "Signalement utilisateur",
    message: "Comportement suspect détecté",
    time: "Il y a 3h",
    read: true,
  },
];
// ----------------------------------------------------

export function AuthHeader() {
  const navigate = useNavigate(); // Hook pour la navigation (remplace une partie de useRouter)

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null); // Ajout d'une réf pour le menu utilisateur

  // Récupérer l'utilisateur connecté au montage du composant
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log("👤 Utilisateur connecté:", user);
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      AuthService.logout();
      // Rediriger vers la page de connexion après la déconnexion
      navigate("/login");
    }
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fermer la recherche
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
      // Fermer les notifications
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      // Fermer le menu utilisateur (nécessite d'envelopper la DropdownButton dans une div reférencée ou de gérer le state)
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Logique de recherche (inchangée, utilise les données mockées)
    const mockResults: SearchResult[] = [
      {
        id: "1",
        type: "user",
        title: "Jean Rakoto",
        subtitle: "jean.rakoto@email.com",
        url: "/admin/users",
      },
      {
        id: "2",
        type: "listing",
        title: "Villa F4 à Ivandry",
        subtitle: "450,000,000 Ar • Vente",
        url: "/admin/listings",
      },
      {
        id: "3",
        type: "service",
        title: "Plomberie Express",
        subtitle: "Service de plomberie",
        url: "/admin/services",
      },
      {
        id: "4",
        type: "booking",
        title: "Réservation #12345",
        subtitle: "Visite guidée Andasibe",
        url: "/admin/bookings",
      },
    ].filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
    setShowResults(true);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    // ... (Logique inchangée)
    switch (type) {
      case "user":
        return <User className="h-4 w-4" />;
      case "listing":
        return <Home className="h-4 w-4" />;
      case "service":
        return <Package className="h-4 w-4" />;
      case "booking":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    // ... (Logique inchangée)
    switch (type) {
      case "warning":
        return "text-yellow-500";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white lg:mt-0 mt-16 px-0 lg:px-6">
      {/* Barre de Recherche */}
      <div className="relative flex flex-1 items-center">
        {/* L'ajustement des classes Tailwind 'w-40 left-24' est conservé */}
        <div
          className="lg:left-0 md:left-0 w-11/12 left-2 relative lg:ml-0 md:ml-0 md:w-96 lg:w-96"
          ref={searchRef}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher utilisateurs, annonces, services..."
            className=" pl-10 bg-background border-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          />

          {/* Résultats de Recherche */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-card shadow-lg z-50">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <span className="text-sm font-medium">
                  {searchResults.length} résultat(s)
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowResults(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link // Utilisateur de Link de react-router-dom
                    key={result.id}
                    to={result.url} // Changé 'href' en 'to'
                    onClick={() => {
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex items-center gap-3 p-3 hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {result.type}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menus d'Actions (Notifications, Utilisateur) */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown (Personnalisé) */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute -right-12 lg:right-0 top-full mt-2 w-96 rounded-lg border border-border bg-card shadow-lg z-50 max-h-96 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={markAllAsRead}
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b last:border-b-0 hover:bg-accent cursor-pointer"
                      onClick={() => {
                        markAsRead(notification.id);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex gap-3 w-full">
                        <div
                          className={`mt-1 flex-shrink-0 ${getNotificationColor(
                            notification.type
                          )}`}
                        >
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Aucune notification
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Menu Utilisateur (Personnalisé) */}
        <div className="relative" ref={userMenuRef}>
          {" "}
          {/* Réf ajoutée ici */}
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {currentUser?.avatar ? (
              <img className="flex h-full w-full object-cover items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm"
                src={currentUser.avatar} alt="avatar"/>
  
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                {currentUser
                  ? `${currentUser.firstName?.[0]}${currentUser.lastName?.[0]}`
                  : "US"}
              </div>
            )}
          </Button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-white shadow-lg z-50">
              <div className="p-3 border-b">
                <p className="text-sm font-medium">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              <div className="p-1">
                {currentUser.role == "admin" ? (
                  <>
                    <Link // Utilisateur de Link de react-router-dom
                      to="/admin/profile" // Changé 'href' en 'to'
                      className="flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                    <Link // Utilisateur de Link de react-router-dom
                      to="/admin/settings" // Changé 'href' en 'to'
                      className="flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </>
                ) : (
                  <>
                    <Link // Utilisateur de Link de react-router-dom
                      to="/pro/profile" // Changé 'href' en 'to'
                      className="flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                    <Link // Utilisateur de Link de react-router-dom
                      to="/pro/settings" // Changé 'href' en 'to'
                      className="flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </>
                )}
                <div className="border-t my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
