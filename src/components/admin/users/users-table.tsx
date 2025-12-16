// components/admin/users/users-table.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserModal } from "./user-modal";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import {
  Search,
  Phone,
  Ban,
  CheckCircle,
  Edit,
  Building2,
  Package,
  Home,
  FileText,
  MapPin,
  Users,
  ChevronDown,
  Trash,
  MoreVertical,
  Mail,
  UserCheck,
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  companyName: string | null;
  demandType: string | null;
  address: string | null;
  city: string | null;
  metiers: any[];
  services: any[];
  productsCount: number;
  propertiesCount: number;
  articlesCount: number;
  createdAt: string;
  avatar?: string | null;
  userType?: string | null;
}

// Palette de couleurs du thème
const colors = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFF0",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  primaryLight: "#8FBC8F",
  secondaryLight: "#A0522D",
  cardBg: "#FFFFFF",
  textPrimary: "#2C3E50",
  textSecondary: "#5D6D7E",
  success: "#27AE60",
  warning: "#F39C12",
  error: "#E74C3C",
  accentGold: "#D4AF37",
  gradient1: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)",
  gradient2: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
  gradient3: "linear-gradient(135deg, #6B8E23 0%, #27AE60 100%)",
};

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (user.city?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleActivate = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, { status: "active" });
      toast.success("Utilisateur activé avec succès");
      fetchUsers();
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Erreur lors de l'activation");
    }
  };

  const handleSuspend = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, { status: "inactive" });
      toast.success("Utilisateur suspendu avec succès");
      fetchUsers();
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Erreur lors de la suspension");
    }
  };

  const handleDelete = async (user: User) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/users/${user.id}`);
      // console.log("User deleted successfully");
      toast.success("Utilisateur supprimé avec succès");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Une erreur est survenue lors de la suppression");
    }
  };

  const handleModalSuccess = () => {
    fetchUsers();
  };

  const getInitials = (user: User) => {
    return `${user.firstName?.[0] ?? ""}${
      user.lastName?.[0] ?? ""
    }`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6" style={{ color: colors.primaryDark }} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.primaryDark }}>
                  Gestion des Utilisateurs
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredUsers.length} utilisateur
                  {filteredUsers.length !== 1 ? "s" : ""} trouvé
                  {filteredUsers.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle View Mode */}
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                  style={
                    viewMode === "grid"
                      ? {
                          backgroundColor: colors.primaryDark,
                          color: colors.lightBg,
                        }
                      : {
                          color: colors.primaryDark,
                        }
                  }
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                  style={
                    viewMode === "list"
                      ? {
                          backgroundColor: colors.primaryDark,
                          color: colors.lightBg,
                        }
                      : {
                          color: colors.primaryDark,
                        }
                  }
                >
                  List
                </Button>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                style={{
                  borderColor: colors.primaryDark,
                  color: colors.primaryDark,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-card border-border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par nom, email, entreprise, ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-input text-sm sm:text-base h-11"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-border bg-transparent whitespace-nowrap gap-2 flex-1 sm:flex-none"
                  style={{
                    borderColor: colors.primaryDark,
                    color: colors.primaryDark,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Filter className="h-4 w-4" />
                  Filtres
                  <ChevronDown className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="border-border bg-transparent whitespace-nowrap gap-2 flex-1 sm:flex-none"
                  style={{
                    borderColor: colors.primaryDark,
                    color: colors.primaryDark,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <UserCheck className="h-4 w-4" />
                  Rôle
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${colors.primaryDark}20`,
                    color: colors.primaryDark,
                  }}
                >
                  {users.filter((u) => u.status === "active").length} Actifs
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${colors.textSecondary}15`,
                    color: colors.textSecondary,
                  }}
                >
                  {users.filter((u) => u.status === "inactive").length} Inactifs
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${colors.primaryDark}15`,
                    color: colors.primaryDark,
                  }}
                >
                  {users.filter((u) => u.role === "professional").length} Pros
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Content */}
        {loading ? (
          <LoadingSpinner text="Chargement des utilisateurs..." />
        ) : filteredUsers.length === 0 ? (
          <Card className="bg-card border-border p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg font-medium">
              Aucun utilisateur trouvé
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}". Essayez de modifier vos critères de recherche.`
                : "Commencez par ajouter des utilisateurs à votre plateforme."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery("")}
                style={{
                  borderColor: colors.primaryDark,
                  color: colors.primaryDark,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Effacer la recherche
              </Button>
            )}
          </Card>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col group"
              >
                {/* Card Header with Status Badges */}
                <div className="p-4 sm:p-6 pb-0">
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 flex-wrap">
                        <Badge
                          className="text-xs sm:text-sm"
                          style={statusColors[user.status as keyof typeof statusColors]}
                        >
                          {user.status === "active" ? "✓ Actif" : "○ Inactif"}
                        </Badge>
                        <Badge
                          className="text-xs sm:text-sm"
                          style={roleColors[user.role as keyof typeof roleColors]}
                        >
                          {user.role === "professional"
                            ? "👑 Pro"
                            : user.role === "admin"
                            ? "⚡ Admin"
                            : "👤 User"}
                        </Badge>
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Copier l'ID
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16 overflow-hidden flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={
                            `${user.firstName ?? ""} ${
                              user.lastName ?? ""
                            }`.trim() || user.email
                          }
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/placeholder-user.jpg";
                          }}
                        />
                      ) : (
                        <AvatarFallback 
                          className="font-bold text-sm sm:text-base"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primaryDark}20, ${colors.primaryDark}10)`,
                            color: colors.primaryDark,
                          }}
                        >
                          {getInitials(user)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                      {user.companyName && (
                        <div className="flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground truncate">
                            {user.companyName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="px-4 sm:px-6 py-3 space-y-2 border-t border-border/50 bg-muted/30">
                  {user.phone && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.phone}</span>
                    </div>
                  )}
                  {user.city && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span>Inscrit le {formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {/* Métiers for Professionals */}
                {user.role === "professional" && user.metiers.length > 0 && (
                  <div className="px-4 sm:px-6 py-3 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Métiers:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {user.metiers.slice(0, 2).map((metier: any) => (
                        <Badge
                          key={metier.id}
                          variant="outline"
                          className="text-xs"
                          style={{
                            backgroundColor: `${colors.primaryDark}15`,
                            color: colors.primaryDark,
                            borderColor: `${colors.primaryDark}25`,
                          }}
                        >
                          {metier.libelle}
                        </Badge>
                      ))}
                      {user.metiers.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.metiers.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="px-4 sm:px-6 py-3 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div
                      className="flex flex-col items-center p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-help"
                      title="Nombre de produits"
                    >
                      <Package className="h-4 w-4 mb-1" style={{ color: colors.primaryDark }} />
                      <span className="text-sm font-semibold text-foreground">
                        {user.productsCount}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Produits
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-help"
                      title="Nombre de biens"
                    >
                      <Home className="h-4 w-4 mb-1" style={{ color: colors.primaryDark }} />
                      <span className="text-sm font-semibold text-foreground">
                        {user.propertiesCount}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Biens
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-help"
                      title="Nombre d'articles"
                    >
                      <FileText className="h-4 w-4 mb-1" style={{ color: colors.primaryDark }} />
                      <span className="text-sm font-semibold text-foreground">
                        {user.articlesCount}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Articles
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 sm:px-6 py-4 mt-auto border-t border-border/50 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2 bg-muted/20">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="border-border w-full text-xs sm:text-sm gap-1 transition-colors duration-300"
                    style={{
                      borderColor: colors.primaryDark,
                      color: colors.primaryDark,
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Modifier</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="w-full text-xs sm:text-sm gap-1"
                        style={
                          user.status === "inactive"
                            ? {
                                backgroundColor: colors.success,
                                color: colors.lightBg,
                              }
                            : {
                                backgroundColor: colors.warning,
                                color: colors.lightBg,
                              }
                        }
                      >
                        {user.status === "inactive" ? (
                          <>
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Activer</span>
                          </>
                        ) : (
                          <>
                            <Ban className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Suspendre</span>
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.status === "inactive" ? (
                        <DropdownMenuItem onClick={() => handleActivate(user)}>
                          <CheckCircle className="h-4 w-4 mr-2" style={{ color: colors.success }} />
                          Activer l'utilisateur
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleSuspend(user)}>
                          <Ban className="h-4 w-4 mr-2" style={{ color: colors.warning }} />
                          Suspendre l'utilisateur
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(user)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer définitivement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <Card className="border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium" style={{ color: colors.primaryDark }}>Utilisateur</th>
                    <th className="text-left p-4 font-medium" style={{ color: colors.primaryDark }}>Contact</th>
                    <th className="text-left p-4 font-medium" style={{ color: colors.primaryDark }}>Statistiques</th>
                    <th className="text-left p-4 font-medium" style={{ color: colors.primaryDark }}>Statut</th>
                    <th className="text-left p-4 font-medium" style={{ color: colors.primaryDark }}>Inscription</th>
                    <th className="text-right p-4 font-medium" style={{ color: colors.primaryDark }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {user.avatar ? (
                              <img src={user.avatar} alt={getInitials(user)} />
                            ) : (
                              <AvatarFallback 
                                style={{
                                  background: `linear-gradient(135deg, ${colors.primaryDark}20, ${colors.primaryDark}10)`,
                                  color: colors.primaryDark,
                                }}
                              >
                                {getInitials(user)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium" style={{ color: colors.textPrimary }}>
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                            {user.companyName && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {user.companyName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                          {user.city && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3 w-3" />
                              {user.city}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">
                              {user.productsCount}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Produits
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">
                              {user.propertiesCount}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Biens
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">
                              {user.articlesCount}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Articles
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            style={statusColors[user.status as keyof typeof statusColors]}
                          >
                            {user.status === "active" ? "Actif" : "Inactif"}
                          </Badge>
                          <Badge
                            variant="outline"
                            style={roleColors[user.role as keyof typeof roleColors]}
                          >
                            {user.role}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            style={{
                              borderColor: colors.primaryDark,
                              color: colors.primaryDark,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === "inactive" ? (
                            <Button
                              size="sm"
                              onClick={() => handleActivate(user)}
                              style={{
                                backgroundColor: colors.success,
                                color: colors.lightBg,
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleSuspend(user)}
                              style={{
                                backgroundColor: colors.warning,
                                color: colors.lightBg,
                              }}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
      <UserModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        user={selectedUser}
        mode="edit"
        onSuccess={handleModalSuccess}
      />
    </>
  );
}

// Mise à jour des couleurs des badges pour utiliser le vert du thème
const roleColors = {
  user: {
    backgroundColor: `${colors.primaryDark}15`,
    color: colors.primaryDark,
    borderColor: `${colors.primaryDark}25`,
  },
  professional: {
    backgroundColor: `${colors.primaryDark}20`,
    color: colors.primaryDark,
    borderColor: `${colors.primaryDark}30`,
  },
  admin: {
    backgroundColor: `${colors.error}20`,
    color: colors.error,
    borderColor: `${colors.error}30`,
  },
};

// Mise à jour des couleurs des badges de statut pour utiliser le vert du thème
const statusColors = {
  active: {
    backgroundColor: `${colors.primaryDark}20`,
    color: colors.primaryDark,
    borderColor: `${colors.primaryDark}30`,
  },
  inactive: {
    backgroundColor: `${colors.textSecondary}15`,
    color: colors.textSecondary,
    borderColor: `${colors.textSecondary}25`,
  },
};