// pages/admin/AdminSubscriptions.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Users,
  TrendingUp,
  CreditCard,
  Calendar,
  Mail,
  User,
  Crown,
  Zap,
  Star,
  Building,
  Wrench,
  Sofa,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [editSubscription, setEditSubscription] = useState(null);
  const [editEndDate, setEditEndDate] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    pending: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/subscriptions");
      setSubscriptions(response.data);
      calculateStats(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des abonnements");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const active = data.filter((sub) => sub.status === "active").length;
    const expired = data.filter((sub) => sub.status === "expired").length;
    const pending = data.filter((sub) => sub.status === "pending").length;
    const revenue = data
      .filter((sub) => sub.status === "active" && sub.plan?.price)
      .reduce((sum, sub) => sum + (sub.plan.price || 0), 0);

    setStats({ total, active, expired, pending, revenue });
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        variant: "default",
        label: "Actif",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      expired: {
        variant: "destructive",
        label: "Expiré",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
      pending: {
        variant: "secondary",
        label: "En attente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      },
      inactive: {
        variant: "outline",
        label: "Inactif",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertTriangle,
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} border gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPlanIcon = (planName) => {
    if (!planName) return Star;

    const name = planName.toLowerCase();
    if (name.includes("pro")) return Crown;
    if (name.includes("premium")) return Zap;
    if (name.includes("immobilier") || name.includes("real estate"))
      return Building;
    if (name.includes("service") || name.includes("artisan")) return Wrench;
    if (name.includes("meuble") || name.includes("furniture")) return Sofa;
    return Star;
  };

  const getPlanColor = (planName) => {
    if (!planName) return "blue";

    const name = planName.toLowerCase();
    if (name.includes("pro")) return "purple";
    if (name.includes("premium")) return "amber";
    if (name.includes("immobilier")) return "blue";
    if (name.includes("service")) return "green";
    if (name.includes("meuble")) return "pink";
    return "gray";
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        light: "bg-blue-500/10",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        light: "bg-purple-500/10",
      },
      amber: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        light: "bg-amber-500/10",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        light: "bg-green-500/10",
      },
      pink: {
        bg: "bg-pink-50",
        text: "text-pink-600",
        border: "border-pink-200",
        light: "bg-pink-500/10",
      },
      gray: {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
        light: "bg-gray-500/10",
      },
    };
    return colors[color] || colors.blue;
  };

  const handleStatusChange = async (subscriptionId, newStatus) => {
    try {
      await api.patch(`/admin/subscriptions/${subscriptionId}`, {
        status: newStatus,
      });
      toast.success("Statut mis à jour avec succès");
      fetchSubscriptions();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleEditSubscription = (subscription) => {
    setEditSubscription(subscription);
    setEditEndDate(new Date(subscription.endDate));
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editSubscription || !editEndDate) return;

    try {
      await api.patch(`/admin/subscriptions/${editSubscription.id}`, {
        endDate: editEndDate.toISOString(),
      });
      toast.success("Date d'expiration mise à jour avec succès");
      setIsEditDialogOpen(false);
      setEditSubscription(null);
      setEditEndDate(null);
      fetchSubscriptions();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la date d'expiration");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Utilisateur",
      "Email",
      "Plan",
      "Statut",
      "Début",
      "Fin",
      "Prix",
    ];
    const csvData = filteredSubscriptions.map((sub) => [
      sub.id,
      `${sub.user?.firstName} ${sub.user?.lastName}`,
      sub.user?.email,
      sub.plan?.name,
      sub.status,
      new Date(sub.startDate).toLocaleDateString("fr-FR"),
      new Date(sub.endDate).toLocaleDateString("fr-FR"),
      `${sub.plan?.price || 0}€`,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `abonnements-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <LoadingSpinner text="chargement des abonnements " />;
  }

  return (
    <div className="w-full space-y-4 md:space-y-6 px-3 md:px-6 py-4 md:py-6">
      {/* En-tête - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Gestion des Abonnements
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Gérez et surveillez les abonnements des professionnels
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="gap-2 text-xs sm:text-sm whitespace-nowrap">
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Exporter CSV</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Cartes de statistiques - Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Total */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Users className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-xl md:text-2xl font-bold text-blue-700">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actifs */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Actifs
                </p>
                <p className="text-xl md:text-2xl font-bold text-green-700">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expirés */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-red-100 rounded-lg flex-shrink-0">
                <Calendar className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Expirés
                </p>
                <p className="text-xl md:text-2xl font-bold text-red-700">
                  {stats.expired}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En attente */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <RefreshCw className="h-4 w-4 md:h-6 md:w-6 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  En attente
                </p>
                <p className="text-xl md:text-2xl font-bold text-yellow-700">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenu */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow col-span-1 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <CreditCard className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Revenu
                </p>
                <p className="text-xl md:text-2xl font-bold text-purple-700">
                  {stats.revenue}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche - Responsive */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur, email ou plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full text-sm">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="expired">Expirés</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cartes des abonnements */}
      <div>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-semibold">
            Abonnements ({filteredSubscriptions.length})
          </h2>
        </div>

        {filteredSubscriptions.length === 0 ? (
          <Card>
            <CardContent className="p-6 md:p-8 text-center">
              <Users className="h-8 md:h-12 w-8 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
              <p className="text-sm md:text-base text-muted-foreground">Aucun abonnement trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredSubscriptions.map((subscription) => {
              const PlanIcon = getPlanIcon(subscription.plan?.name);
              const planColor = getPlanColor(subscription.plan?.name);
              const colorClasses = getColorClasses(planColor);
              const daysRemaining = getDaysRemaining(subscription.endDate);
              const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
              const isExpired = daysRemaining <= 0;

              return (
                <Card
                  key={subscription.id}
                  className={`hover:shadow-lg transition-all duration-300 flex flex-col ${
                    isExpiringSoon
                      ? "border-yellow-300 ring-1 ring-yellow-200"
                      : ""
                  } ${isExpired ? "border-red-200" : ""}`}
                >
                  <CardHeader className="pb-2 md:pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <div className={`p-1.5 md:p-2 rounded-lg ${colorClasses.bg} flex-shrink-0`}>
                          <PlanIcon
                            className={`h-4 w-4 md:h-5 md:w-5 ${colorClasses.text}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm md:text-lg truncate">
                            {subscription.user?.firstName}{" "}
                            {subscription.user?.lastName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1 text-xs md:text-sm truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{subscription.user?.email}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(subscription.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2 md:pb-3 flex-1">
                    {/* Plan et prix */}
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div>
                        <p className="text-sm md:text-base font-semibold text-gray-900">
                          {subscription.plan?.name || "Essai Gratuit"}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {subscription.plan?.interval === "month"
                            ? "Mensuel"
                            : "Annuel"}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base md:text-lg font-bold text-gray-900">
                          {subscription.plan?.price
                            ? `${subscription.plan.price}€`
                            : "Gratuit"}
                        </p>
                        <Badge
                          variant={
                            subscription.autoRenew ? "default" : "outline"
                          }
                          className="text-xs mt-1"
                        >
                          {subscription.autoRenew
                            ? "Auto"
                            : "Manuel"}
                        </Badge>
                      </div>
                    </div>

                    {/* Période */}
                    <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm mb-3">
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Début
                        </p>
                        <p className="text-xs md:text-sm">{formatDate(subscription.startDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Fin</p>
                        <p
                          className={
                            isExpiringSoon
                              ? "text-yellow-600 font-semibold text-xs md:text-sm"
                              : "text-xs md:text-sm"
                          }
                        >
                          {formatDate(subscription.endDate)}
                          {isExpiringSoon && ` (${daysRemaining}j)`}
                        </p>
                      </div>
                    </div>

                    {/* Entreprise */}
                    {subscription.user?.companyName && (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Building className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{subscription.user.companyName}</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-3 border-t">
                    <div className="flex gap-2 w-full flex-col sm:flex-row">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs md:text-sm"
                            onClick={() =>
                              setSelectedSubscription(subscription)
                            }
                          >
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">Détails</span>
                            <span className="sm:hidden">Voir</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-11/12 md:max-w-md rounded-lg">
                          <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">Détails de l'abonnement</DialogTitle>
                          </DialogHeader>
                          {selectedSubscription && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    Utilisateur
                                  </p>
                                  <p className="text-sm md:text-base font-semibold">
                                    {selectedSubscription.user?.firstName}{" "}
                                    {selectedSubscription.user?.lastName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    Email
                                  </p>
                                  <p className="text-xs md:text-sm truncate">{selectedSubscription.user?.email}</p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    Plan
                                  </p>
                                  <p className="text-sm md:text-base font-semibold">
                                    {selectedSubscription.plan?.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    Statut
                                  </p>
                                  <div className="mt-1">
                                    {getStatusBadge(
                                      selectedSubscription.status
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs md:text-sm font-medium mb-2">
                                  Changer le statut
                                </p>
                                <Select
                                  value={selectedSubscription.status}
                                  onValueChange={(value) =>
                                    handleStatusChange(
                                      selectedSubscription.id,
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="text-xs md:text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">
                                      Actif
                                    </SelectItem>
                                    <SelectItem value="expired">
                                      Expiré
                                    </SelectItem>
                                    <SelectItem value="pending">
                                      En attente
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                      Inactif
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex gap-2 justify-end flex-col sm:flex-row">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs md:text-sm"
                                  onClick={() => {
                                    navigate(
                                      `/professional/${selectedSubscription.user?.id}`
                                    );
                                  }}
                                >
                                  <User className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  Profil
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs md:text-sm"
                                  onClick={() =>
                                    handleEditSubscription(selectedSubscription)
                                  }
                                >
                                  <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog de modification - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-11/12 md:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Modifier l'abonnement</DialogTitle>
          </DialogHeader>
          {editSubscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Utilisateur
                  </p>
                  <p className="text-sm md:text-base font-semibold">
                    {editSubscription.user?.firstName}{" "}
                    {editSubscription.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Plan
                  </p>
                  <p className="text-sm md:text-base font-semibold">{editSubscription.plan?.name}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Statut actuel
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(editSubscription.status)}
                  </div>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Date de début
                  </p>
                  <p className="text-xs md:text-sm">{formatDate(editSubscription.startDate)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs md:text-sm">Date d'expiration</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs md:text-sm",
                        !editEndDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      {editEndDate ? (
                        format(editEndDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={editEndDate}
                      onSelect={setEditEndDate}
                      initialFocus
                      locale={fr}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Sélectionnez la nouvelle date d'expiration
                </p>
              </div>

              <DialogFooter className="flex gap-2 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-xs md:text-sm"
                >
                  <X className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleSaveEdit} disabled={!editEndDate} className="text-xs md:text-sm">
                  <Save className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Enregistrer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubscriptions;
