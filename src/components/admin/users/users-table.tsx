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
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse {
  users: User[];
  pagination: PaginationData;
  dataProtection?: {
    sensitiveDataMasked: boolean;
    maskedFields: string[];
    timestamp: string;
  };
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

  // État pour la pagination
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filtres
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // Mode sécurisé
  const [sensitiveDataVisible, setSensitiveDataVisible] = useState(false);
  const [dataProtectionInfo, setDataProtectionInfo] = useState<{
    sensitiveDataMasked: boolean;
    maskedFields: string[];
  }>({
    sensitiveDataMasked: true,
    maskedFields: [],
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter, statusFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await api.get<ApiResponse>(
        `/users?${params.toString()}`
      );

      setUsers(response.data.users);
      setPagination(response.data.pagination);

      if (response.data.dataProtection) {
        setDataProtectionInfo(response.data.dataProtection);
        setSensitiveDataVisible(
          !response.data.dataProtection.sensitiveDataMasked
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Réinitialiser à la première page lors d'une nouvelle recherche
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    const newLimit = parseInt(value);
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }));
  };

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

  const maskSensitiveData = (data: string | null, fieldName: string) => {
    if (!data) return null;

    if (
      !sensitiveDataVisible &&
      dataProtectionInfo.maskedFields.includes(fieldName)
    ) {
      switch (fieldName) {
        case "phone":
          return data.replace(/(\d{2})\d+(\d{2})/, "$1****$2");
        case "email":
          const [local, domain] = data.split("@");
          return `${local.substring(0, 2)}***@${domain}`;
        case "address":
          return "*** Adresse masquée ***";
        case "siret":
          return data.replace(/\d(?=\d{4})/g, "*");
        default:
          return "***";
      }
    }
    return data;
  };

  const canViewSensitiveData =
    dataProtectionInfo && !dataProtectionInfo.sensitiveDataMasked;

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users
                  className="h-6 w-6"
                  style={{ color: colors.primaryDark }}
                />
              </div>
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: colors.primaryDark }}
                >
                  Gestion des Utilisateurs
                </h1>
                <p className="text-sm text-muted-foreground">
                  {pagination.total} utilisateur
                  {pagination.total !== 1 ? "s" : ""} au total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sécurité */}
              {canViewSensitiveData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSensitiveDataVisible(!sensitiveDataVisible)}
                  className="gap-2"
                  style={{
                    borderColor: sensitiveDataVisible
                      ? colors.success
                      : colors.warning,
                    color: sensitiveDataVisible
                      ? colors.success
                      : colors.warning,
                  }}
                >
                  {sensitiveDataVisible ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Données visibles
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Données masquées
                    </>
                  )}
                </Button>
              )}

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
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-background border-input text-sm sm:text-base h-11"
                />
              </div>

              <Button
                onClick={handleSearch}
                className="h-11"
                style={{
                  backgroundColor: colors.primaryDark,
                  color: colors.lightBg,
                }}
              >
                Rechercher
              </Button>

              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-11 border-input">
                    <SelectValue placeholder="Tous les rôles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Administrateurs</SelectItem>
                    <SelectItem value="professional">Professionnels</SelectItem>
                    <SelectItem value="user">Utilisateurs</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 border-input">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters and Sorting */}
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Trier par:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 border-input text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">
                      Date d'inscription
                    </SelectItem>
                    <SelectItem value="lastName">Nom</SelectItem>
                    <SelectItem value="firstName">Prénom</SelectItem>
                    <SelectItem value="companyName">Entreprise</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  }
                  className="h-8"
                >
                  {sortOrder === "desc" ? "↓" : "↑"}
                </Button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">Lignes:</span>
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={handleRowsPerPageChange}
                >
                  <SelectTrigger className="h-8 border-input text-sm w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Warning */}
        {!canViewSensitiveData && (
          <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-warning mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-warning">
                  Mode de sécurité activé
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Les données sensibles (téléphones, adresses, SIRET) sont
                  masquées. Seuls les administrateurs avec permissions
                  spécifiques peuvent voir toutes les données.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Users Content */}
        {loading ? (
          <LoadingSpinner text="Chargement des utilisateurs..." />
        ) : users.length === 0 ? (
          <Card className="bg-card border-border p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg font-medium">
              Aucun utilisateur trouvé
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                ? `Aucun résultat pour vos critères de recherche.`
                : "Commencez par ajouter des utilisateurs à votre plateforme."}
            </p>
            {(searchQuery ||
              roleFilter !== "all" ||
              statusFilter !== "all") && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                style={{
                  borderColor: colors.primaryDark,
                  color: colors.primaryDark,
                }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </Card>
        ) : viewMode === "grid" ? (
          // Grid View
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onActivate={handleActivate}
                  onSuspend={handleSuspend}
                  onDelete={handleDelete}
                  getInitials={getInitials}
                  formatDate={formatDate}
                  maskSensitiveData={maskSensitiveData}
                  sensitiveDataVisible={sensitiveDataVisible}
                />
              ))}
            </div>
          </>
        ) : (
          // List View
          <>
            <Card className="border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th
                        className="text-left p-4 font-medium"
                        style={{ color: colors.primaryDark }}
                      >
                        Utilisateur
                      </th>
                      <th
                        className="text-left p-4 font-medium"
                        style={{ color: colors.primaryDark }}
                      >
                        Contact
                      </th>
                      <th
                        className="text-left p-4 font-medium"
                        style={{ color: colors.primaryDark }}
                      >
                        Statistiques
                      </th>
                      <th
                        className="text-left p-4 font-medium"
                        style={{ color: colors.primaryDark }}
                      >
                        Statut
                      </th>
                      <th
                        className="text-left p-4 font-medium"
                        style={{ color: colors.primaryDark }}
                      >
                        Inscription
                      </th>
                      <th
                        className="text-right p-4 font-medium"
                        style={{ color: colors.primaryDark }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback
                                style={{
                                  background: `linear-gradient(135deg, ${colors.primaryDark}20, ${colors.primaryDark}10)`,
                                  color: colors.primaryDark,
                                }}
                              >
                                {getInitials(user)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div
                                className="font-medium"
                                style={{ color: colors.textPrimary }}
                              >
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {maskSensitiveData(user.email, "email")}
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
                                {maskSensitiveData(user.phone, "phone")}
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
                              style={
                                statusColors[
                                  user.status as keyof typeof statusColors
                                ]
                              }
                            >
                              {user.status === "active" ? "Actif" : "Inactif"}
                            </Badge>
                            <Badge
                              variant="outline"
                              style={
                                roleColors[user.role as keyof typeof roleColors]
                              }
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
          </>
        )}

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="text-sm text-muted-foreground">
              Affichage {(pagination.page - 1) * pagination.limit + 1} à{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              sur {pagination.total} utilisateurs
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pagination.page === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        style={
                          pagination.page === pageNum
                            ? {
                                backgroundColor: colors.primaryDark,
                                color: colors.lightBg,
                              }
                            : {}
                        }
                        className="w-8 h-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
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

// Composant UserCard séparé pour la vue grid
function UserCard({
  user,
  onEdit,
  onActivate,
  onSuspend,
  onDelete,
  getInitials,
  formatDate,
  maskSensitiveData,
  sensitiveDataVisible,
}: any) {
  return (
    <Card className="border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col group">
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
              <DropdownMenuItem onClick={() => onEdit(user)}>
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
            <AvatarFallback
              className="font-bold text-sm sm:text-base"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryDark}20, ${colors.primaryDark}10)`,
                color: colors.primaryDark,
              }}
            >
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {maskSensitiveData(user.email, "email")}
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
            <span className="truncate">
              {maskSensitiveData(user.phone, "phone")}
            </span>
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
            <Package
              className="h-4 w-4 mb-1"
              style={{ color: colors.primaryDark }}
            />
            <span className="text-sm font-semibold text-foreground">
              {user.productsCount}
            </span>
            <span className="text-xs text-muted-foreground">Produits</span>
          </div>
          <div
            className="flex flex-col items-center p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-help"
            title="Nombre de biens"
          >
            <Home
              className="h-4 w-4 mb-1"
              style={{ color: colors.primaryDark }}
            />
            <span className="text-sm font-semibold text-foreground">
              {user.propertiesCount}
            </span>
            <span className="text-xs text-muted-foreground">Biens</span>
          </div>
          <div
            className="flex flex-col items-center p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-help"
            title="Nombre d'articles"
          >
            <FileText
              className="h-4 w-4 mb-1"
              style={{ color: colors.primaryDark }}
            />
            <span className="text-sm font-semibold text-foreground">
              {user.articlesCount}
            </span>
            <span className="text-xs text-muted-foreground">Articles</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 sm:px-6 py-4 mt-auto border-t border-border/50 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2 bg-muted/20">
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(user)}
          className="border-border w-full text-xs sm:text-sm gap-1 transition-colors duration-300"
          style={{
            borderColor: colors.primaryDark,
            color: colors.primaryDark,
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Modifier</span>
        </Button> */}

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
              <DropdownMenuItem onClick={() => onActivate(user)}>
                <CheckCircle
                  className="h-4 w-4 mr-2"
                  style={{ color: colors.success }}
                />
                Activer l'utilisateur
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onSuspend(user)}>
                <Ban
                  className="h-4 w-4 mr-2"
                  style={{ color: colors.warning }}
                />
                Suspendre l'utilisateur
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              Supprimer définitivement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
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
