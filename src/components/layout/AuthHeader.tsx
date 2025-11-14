import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
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
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthService from "@/services/authService";
import NotificationService, { Notification } from "@/services/notificationService";

interface SearchResult {
  id: string;
  type: "user" | "listing" | "service" | "booking";
  title: string;
  subtitle: string;
  url: string;
}

export function AuthHeader() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Récupérer l'utilisateur connecté et initialiser les notifications
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log("👤 Utilisateur connecté:", user);
    setCurrentUser(user);

    if (user) {
      NotificationService.connect();
      loadNotifications();
      NotificationService.onNewNotification((notif) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((c) => c + 1);
      });
    }

    return () => {
      NotificationService.disconnect();
    };
  }, []);

  const loadNotifications = async () => {
    const data = await NotificationService.fetchNotifications();
    setNotifications(data);
    setUnreadCount(data.filter((n) => !n.read).length);
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      AuthService.logout();
      navigate("/login");
    }
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // FONCTION HANDLE_SEARCH AJOUTÉE
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Logique de recherche
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

  const markAsRead = async (id: number) => {
    console.log(`🟡 Tentative de marquer comme lue la notification ${id}`);
    
    const success = await NotificationService.markAsRead(id);
    
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      console.log(`✅ Notification ${id} marquée comme lue avec succès`);
    } else {
      console.error(`❌ Échec du marquage comme lue pour la notification ${id}`);
    }
  };

  const markAllAsRead = async () => {
    console.log("🟡 Marquage de toutes les notifications comme lues");
    
    const unreadNotifications = notifications.filter(n => !n.read);
    let successCount = 0;

    const results = await Promise.allSettled(
      unreadNotifications.map(notif => NotificationService.markAsRead(notif.id))
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value === true) {
        successCount++;
      } else {
        console.warn(`⚠️ Échec pour la notification ${unreadNotifications[index].id}`);
      }
    });

    if (successCount > 0) {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      console.log(`✅ ${successCount}/${unreadNotifications.length} notifications marquées comme lues`);
    }
  };

  const deleteNotification = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette notification ?")) {
      const success = await NotificationService.deleteNotification(id);
      if (success) {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        const deletedNotif = notifications.find(n => n.id === id);
        if (deletedNotif && !deletedNotif.read) {
          setUnreadCount(prev => prev - 1);
        }
      } else {
        alert("Erreur lors de la suppression de la notification");
      }
    }
  };

  const getIcon = (type: string) => {
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

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white lg:mt-0 mt-16 px-0 lg:px-6">
      {/* Barre de Recherche */}
      <div className="relative flex flex-1 items-center">
        <div className="absolute -left-2 lg:hidden sm:hidden p-1 rounded-full bg-white border-black border-2">
          <img src={logo} alt="Servo Logo" className="w-10 h-10 rounded-full" />
        </div>
        <div
          className="lg:left-0 md:left-0 w-11/12 left-2 relative lg:ml-0 md:ml-0 md:w-96 lg:w-96"
          ref={searchRef}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher utilisateurs, annonces, services..."
            className="pl-10 bg-background border-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          />

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
                  <Link
                    key={result.id}
                    to={result.url}
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

      {/* Menus d'Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
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
                <div className="flex gap-2">
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
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b last:border-b-0 hover:bg-accent cursor-pointer group relative"
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        setShowNotifications(false);
                      }}
                    >
                      <button
                        onClick={(e) => deleteNotification(notification.id, e)}
                        className="absolute right-2 top-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 text-black"
                        title="Supprimer la notification"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      
                      <div className="flex gap-3 w-full pr-6">
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
                            {formatTime(notification.createdAt)}
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

        {/* Menu Utilisateur */}
        <div className="relative" ref={userMenuRef}>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {currentUser?.avatar ? (
              <img 
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm"
                src={currentUser.avatar} 
                alt="avatar"
              />
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
                {currentUser?.role === "admin" ? (
                  <>
                    <Link
                      to="/admin/profile"
                      className="flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/pro/profile"
                      className="flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                    <Link
                      to="/pro/settings"
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