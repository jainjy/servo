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
  Play,
  AlertCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthService from "@/services/authService";
import NotificationService, { Notification } from "@/services/notificationService";
import { api } from "@/lib/axios";
import { get } from "http";

interface SearchResult {
  id: string;
  type: "user" | "listing" | "service" | "booking";
  title: string;
  subtitle: string;
  url: string;
  image?: string;
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
  const [isSearching, setIsSearching] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    AuthService.logout();
    navigate("/login");
    setIsLogoutDialogOpen(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
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

  // FONCTION HANDLE_SEARCH AVEC DEBOUNCE
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    // Nettoyer le timeout précédent
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Ajouter un debounce de 500ms
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results: SearchResult[] = [];

        console.log("🔍 Recherche lancée pour:", query);

        // Recherche utilisateurs
        try {
          const usersResponse = await api.get(`/users`, {
            params: { search: query }
          });
          console.log("👥 Réponse utilisateurs:", usersResponse.data);

          // Gérer les différents formats de réponse
          let usersData = Array.isArray(usersResponse.data)
            ? usersResponse.data
            : usersResponse.data?.data || usersResponse.data?.users || [];

          if (usersData.length > 0) {
            results.push(
              ...usersData.slice(0, 2).map((user: any) => ({
                id: user.id,
                type: "user" as const,
                title: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur",
                subtitle: user.email || user.companyName || "Utilisateur",
                url: `/admin/users/${user.id}`,
                image: user.avatar,
              }))
            );
          }
        } catch (err) {
          console.warn("⚠️ Erreur recherche utilisateurs:", err);
        }

        // Recherche annonces
        try {
          const listingsResponse = await api.get(`/anonce/affiche_anonce`, {
            params: { search: query }
          });
          console.log("🏠 Réponse annonces brute:", listingsResponse.data);

          // Gérer le format {success, message, data}
          let listingsData = Array.isArray(listingsResponse.data)
            ? listingsResponse.data
            : listingsResponse.data?.data || [];

          if (listingsData && listingsData.length > 0) {
            results.push(
              ...listingsData.slice(0, 2).map((listing: any) => ({
                id: listing.id,
                type: "listing" as const,
                title: listing.titre || listing.title || "Annonce",
                subtitle: `${listing.prixVente || listing.price || "N/A"} Ar • ${listing.type || "Annonce"}`,
                url: `/admin/listings/${listing.id}`,
                image: listing.image || listing.photos?.[0]?.url || listing.photos?.[0],
              }))
            );
          }
        } catch (err) {
          console.warn("⚠️ Erreur recherche annonces:", err);
        }

        // Recherche services
        try {
          const servicesResponse = await api.get(`/services`, {
            params: { search: query }
          });
          console.log("🔧 Réponse services:", servicesResponse.data);

          let servicesData = Array.isArray(servicesResponse.data)
            ? servicesResponse.data
            : servicesResponse.data?.data || servicesResponse.data?.services || [];

          if (servicesData && servicesData.length > 0) {
            results.push(
              ...servicesData.slice(0, 2).map((service: any) => ({
                id: service.id,
                type: "service" as const,
                title: service.name || service.title || "Service",
                subtitle: service.description || "Service professionnel",
                url: `/admin/services/${service.id}`,
                image: service.image || service.logo,
              }))
            );
          }
        } catch (err) {
          console.warn("⚠️ Erreur recherche services:", err);
        }

        console.log("✅ Résultats trouvés:", results.length, results);
        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch (error) {
        console.error("❌ Erreur lors de la recherche:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
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
    <>
      <header className="flex h-16 items-center justify-between border-b border-border bg-white lg:mt-0 mt-16 px-0 lg:px-6">
      {/* Barre de Recherche */}
      <div className="flex flex-1 items-center">
        {currentUser?.role === "admin" && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 lg:hidden bg-white/95 backdrop-blur-sm border border-gray-300 shadow-xl z-50 rounded-2xl px-4 py-2 flex items-center gap-3">
            <img
              src={logo}
              alt="Servo Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200"
            />
            <span className="azonix tracking-widest text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">
              Servo Admin
            </span>
          </div>
        )}
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

          {/* Afficher le conteneur dès que l'utilisateur tape (même s'il n'y a pas de résultats encore) */}
          {searchQuery.length >= 2 && (
            <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-card shadow-lg z-50 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card">
                <span className="text-sm font-semibold">
                  {isSearching ? "Recherche en cours..." : `${searchResults.length} résultat(s) pour "${searchQuery}"`}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setShowResults(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* État de chargement */}
              {isSearching && (
                <div className="p-12 flex flex-col items-center justify-center gap-4">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">Recherche en cours...</p>
                </div>
              )}

              {/* Résultats en grille style YouTube */}
              {!isSearching && searchResults.length > 0 && (
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        to={result.url}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-background border-2 border-transparent hover:border-primary/30 transition-all duration-500"
                      >


                        {/* Album art */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-primary/20 to-primary/10">
                            {result.image ? (
                              <img
                                src={result.image}
                                alt={result.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-slate-900 group-hover:text-slate-900 transition-colors text-lg">
                                  {getIcon(result.type)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Track info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors">
                              {result.title}
                            </h3>
                            <p className="text-xs font-bold text-muted-foreground line-clamp-1 mt-1">
                              {result.subtitle}
                            </p>
                          </div>


                        </div>
                        {/* Genre tags */}
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-slate-900 border-0">
                            {result.type === "user" && " Utilisateur"}
                            {result.type === "listing" && " Immobilier"}
                            {result.type === "service" && " Service"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getIcon(result.type)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Aucun résultat */}
              {!isSearching && searchResults.length === 0 && (
                <div className="p-12 flex flex-col items-center justify-center gap-3">
                  <Search className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Aucun résultat trouvé</p>
                  <p className="text-xs text-muted-foreground">Essayez une autre recherche</p>
                </div>
              )}

              {/* Footer avec info */}
              {!isSearching && searchResults.length > 0 && (
                <div className="sticky bottom-0 p-3 border-t border-border bg-card text-center text-xs text-muted-foreground">
                  Affichage de {searchResults.length} résultat(s)
                </div>
              )}
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
                              className={`text-sm font-medium ${!notification.read
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
                  onClick={() => setIsLogoutDialogOpen(true)}
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

    {/* Logout Confirmation Dialog */}
    {isLogoutDialogOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCancelLogout}
        />

        {/* Dialog Content */}
        <div className="relative z-50 w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
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

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
            </p>
          </div>

          {/* Footer */}
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
}