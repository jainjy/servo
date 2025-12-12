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
        color: `${colors.primaryDark}20`,
        textColor: colors.primaryDark,
        borderColor: `${colors.primaryDark}30`,
        icon: CheckCircle,
      },
      expired: {
        variant: "destructive",
        label: "Expiré",
        color: `${colors.error}20`,
        textColor: colors.error,
        borderColor: `${colors.error}30`,
        icon: XCircle,
      },
      pending: {
        variant: "secondary",
        label: "En attente",
        color: `${colors.warning}20`,
        textColor: colors.warning,
        borderColor: `${colors.warning}30`,
        icon: Clock,
      },
      inactive: {
        variant: "outline",
        label: "Inactif",
        color: `${colors.textSecondary}15`,
        textColor: colors.textSecondary,
        borderColor: `${colors.textSecondary}25`,
        icon: AlertTriangle,
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;

    return (
      <Badge 
        className="gap-1 border"
        style={{
          backgroundColor: config.color,
          color: config.textColor,
          borderColor: config.borderColor,
        }}
      >
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
    const colorsMap = {
      blue: {
        bg: `${colors.primaryDark}15`,
        text: colors.primaryDark,
        border: `${colors.primaryDark}25`,
        light: `${colors.primaryDark}10`,
      },
      purple: {
        bg: `${colors.primaryDark}20`,
        text: colors.primaryDark,
        border: `${colors.primaryDark}30`,
        light: `${colors.primaryDark}15`,
      },
      amber: {
        bg: `${colors.warning}20`,
        text: colors.warning,
        border: `${colors.warning}30`,
        light: `${colors.warning}15`,
      },
      green: {
        bg: `${colors.success}20`,
        text: colors.success,
        border: `${colors.success}30`,
        light: `${colors.success}15`,
      },
      pink: {
        bg: `${colors.accentGold}15`,
        text: colors.accentGold,
        border: `${colors.accentGold}25`,
        light: `${colors.accentGold}10`,
      },
      gray: {
        bg: `${colors.textSecondary}15`,
        text: colors.textSecondary,
        border: `${colors.textSecondary}25`,
        light: `${colors.textSecondary}10`,
      },
    };
    return colorsMap[color] || colorsMap.blue;
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
          <h1 
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: colors.primaryDark }}
          >
            Gestion des Abonnements
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Gérez et surveillez les abonnements des professionnels
          </p>
        </div>
        <Button 
          onClick={exportToCSV} 
          variant="outline" 
          className="gap-2 text-xs sm:text-sm whitespace-nowrap"
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
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Exporter CSV</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Cartes de statistiques - Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Total */}
        <Card className="border-border hover:shadow-md transition-shadow"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryDark}15, ${colors.primaryDark}5)`,
            borderColor: colors.primaryDark,
          }}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div 
                className="p-1.5 md:p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${colors.primaryDark}20` }}
              >
                <Users className="h-4 w-4 md:h-6 md:w-6" style={{ color: colors.primaryDark }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: colors.primaryDark }}>
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actifs */}
        <Card className="border-border hover:shadow-md transition-shadow"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryDark}10, ${colors.success}10)`,
            borderColor: colors.primaryDark,
          }}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div 
                className="p-1.5 md:p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${colors.primaryDark}20` }}
              >
                <TrendingUp className="h-4 w-4 md:h-6 md:w-6" style={{ color: colors.primaryDark }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Actifs
                </p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: colors.primaryDark }}>
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expirés */}
        <Card className="border-border hover:shadow-md transition-shadow"
          style={{
            background: `linear-gradient(135deg, ${colors.error}10, ${colors.warning}10)`,
            borderColor: colors.error,
          }}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div 
                className="p-1.5 md:p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${colors.error}20` }}
              >
                <Calendar className="h-4 w-4 md:h-6 md:w-6" style={{ color: colors.error }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Expirés
                </p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: colors.error }}>
                  {stats.expired}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En attente */}
        <Card className="border-border hover:shadow-md transition-shadow"
          style={{
            background: `linear-gradient(135deg, ${colors.warning}10, ${colors.accentGold}10)`,
            borderColor: colors.warning,
          }}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div 
                className="p-1.5 md:p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${colors.warning}20` }}
              >
                <RefreshCw className="h-4 w-4 md:h-6 md:w-6" style={{ color: colors.warning }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  En attente
                </p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: colors.warning }}>
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenu */}
        <Card className="border-border hover:shadow-md transition-shadow col-span-1 sm:col-span-2 lg:col-span-1"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryDark}15, ${colors.accentGold}10)`,
            borderColor: colors.accentGold,
          }}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div 
                className="p-1.5 md:p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${colors.accentGold}20` }}
              >
                <CreditCard className="h-4 w-4 md:h-6 md:w-6" style={{ color: colors.accentGold }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Revenu
                </p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: colors.accentGold }}>
                  {stats.revenue}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche - Responsive */}
      <Card className="border-border">
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
              <SelectTrigger 
                className="w-full text-sm border-border"
                style={{ borderColor: colors.primaryDark }}
              >
                <Filter className="h-4 w-4 mr-2" style={{ color: colors.primaryDark }} />
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
          <h2 
            className="text-lg md:text-xl font-semibold"
            style={{ color: colors.primaryDark }}
          >
            Abonnements ({filteredSubscriptions.length})
          </h2>
        </div>

        {filteredSubscriptions.length === 0 ? (
          <Card className="border-border">
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
                  className={`border-border hover:shadow-lg transition-all duration-300 flex flex-col ${
                    isExpiringSoon
                      ? "ring-1"
                      : ""
                  }`}
                  style={{
                    borderColor: isExpiringSoon ? colors.warning : colors.separator,
                    borderWidth: isExpiringSoon ? '2px' : '1px',
                    boxShadow: isExpiringSoon ? `0 0 0 1px ${colors.warning}20` : 'none',
                  }}
                >
                  <CardHeader className="pb-2 md:pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <div 
                          className="p-1.5 md:p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: colorClasses.bg }}
                        >
                          <PlanIcon
                            className="h-4 w-4 md:h-5 md:w-5"
                            style={{ color: colorClasses.text }}
                          />
                        </div>
                        <div className="min-w-0">
                          <CardTitle 
                            className="text-sm md:text-lg truncate"
                            style={{ color: colors.textPrimary }}
                          >
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
                        <p className="text-sm md:text-base font-semibold" style={{ color: colors.textPrimary }}>
                          {subscription.plan?.name || "Essai Gratuit"}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {subscription.plan?.interval === "month"
                            ? "Mensuel"
                            : "Annuel"}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>
                          {subscription.plan?.price
                            ? `${subscription.plan.price}€`
                            : "Gratuit"}
                        </p>
                        <Badge
                          variant={subscription.autoRenew ? "default" : "outline"}
                          className="text-xs mt-1"
                          style={subscription.autoRenew ? {
                            backgroundColor: colors.primaryDark,
                            color: colors.lightBg,
                          } : {
                            borderColor: colors.primaryDark,
                            color: colors.primaryDark,
                          }}
                        >
                          {subscription.autoRenew ? "Auto" : "Manuel"}
                        </Badge>
                      </div>
                    </div>

                    {/* Période */}
                    <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm mb-3">
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Début
                        </p>
                        <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
                          {formatDate(subscription.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Fin</p>
                        <p
                          className="text-xs md:text-sm"
                          style={{
                            color: isExpiringSoon ? colors.warning : colors.textSecondary,
                            fontWeight: isExpiringSoon ? '600' : 'normal'
                          }}
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

                  <CardFooter className="pt-3 border-t" style={{ borderColor: colors.separator }}>
                    <div className="flex gap-2 w-full flex-col sm:flex-row">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs md:text-sm"
                            onClick={() => setSelectedSubscription(subscription)}
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
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">Détails</span>
                            <span className="sm:hidden">Voir</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-11/12 md:max-w-md rounded-lg border-border">
                          <DialogHeader>
                            <DialogTitle 
                              className="text-lg md:text-xl"
                              style={{ color: colors.primaryDark }}
                            >
                              Détails de l'abonnement
                            </DialogTitle>
                          </DialogHeader>
                          {selectedSubscription && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    Utilisateur
                                  </p>
                                  <p className="text-sm md:text-base font-semibold" style={{ color: colors.textPrimary }}>
                                    {selectedSubscription.user?.firstName}{" "}
                                    {selectedSubscription.user?.lastName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    Email
                                  </p>
                                  <p className="text-xs md:text-sm truncate" style={{ color: colors.textSecondary }}>
                                    {selectedSubscription.user?.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    Plan
                                  </p>
                                  <p className="text-sm md:text-base font-semibold" style={{ color: colors.textPrimary }}>
                                    {selectedSubscription.plan?.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    Statut
                                  </p>
                                  <div className="mt-1">
                                    {getStatusBadge(selectedSubscription.status)}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs md:text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                                  Changer le statut
                                </p>
                                <Select
                                  value={selectedSubscription.status}
                                  onValueChange={(value) =>
                                    handleStatusChange(selectedSubscription.id, value)
                                  }
                                >
                                  <SelectTrigger className="text-xs md:text-sm border-border">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Actif</SelectItem>
                                    <SelectItem value="expired">Expiré</SelectItem>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="inactive">Inactif</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex gap-2 justify-end flex-col sm:flex-row">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs md:text-sm"
                                  onClick={() => {
                                    navigate(`/professional/${selectedSubscription.user?.id}`);
                                  }}
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
                                  <User className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  Profil
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs md:text-sm"
                                  onClick={() => handleEditSubscription(selectedSubscription)}
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
        <DialogContent className="w-11/12 md:max-w-md rounded-lg border-border">
          <DialogHeader>
            <DialogTitle 
              className="text-lg md:text-xl"
              style={{ color: colors.primaryDark }}
            >
              Modifier l'abonnement
            </DialogTitle>
          </DialogHeader>
          {editSubscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Utilisateur
                  </p>
                  <p className="text-sm md:text-base font-semibold" style={{ color: colors.textPrimary }}>
                    {editSubscription.user?.firstName}{" "}
                    {editSubscription.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Plan
                  </p>
                  <p className="text-sm md:text-base font-semibold" style={{ color: colors.textPrimary }}>
                    {editSubscription.plan?.name}
                  </p>
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
                  <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
                    {formatDate(editSubscription.startDate)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="endDate" 
                  className="text-xs md:text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  Date d'expiration
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs md:text-sm border-border",
                        !editEndDate && "text-muted-foreground"
                      )}
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
                      <Calendar className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      {editEndDate ? (
                        format(editEndDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-border">
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
                  <X className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveEdit} 
                  disabled={!editEndDate} 
                  className="text-xs md:text-sm"
                  style={{
                    backgroundColor: colors.primaryDark,
                    color: colors.lightBg,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5D801F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                  }}
                >
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