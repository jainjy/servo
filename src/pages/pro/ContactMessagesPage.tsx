// pages/pro/ContactMessagesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MessageSquare,
  User,
  Calendar,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Archive,
  Reply,
  Star,
  MoreVertical,
  RefreshCw,
  Clock,
  AlertCircle,
  FileText,
  Briefcase,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

// Constantes de couleur basées sur votre palette
const COLORS = {
  logo: "#556B2F",           /* Olive green - logo/accent */
  primary: "#6B8E23",        /* Yellow-green - primary-dark */
  lightBg: "#FFFFFF",        /* White - light-bg */
  separator: "#D3D3D3",      /* Light gray - separator */
  secondaryText: "#8B4513",  /* Saddle brown - secondary-text */
  smallText: "#000000",      /* Black for small text */
};

const ContactMessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    pending: 0,
    replied: 0,
    archived: 0,
  });

  // Charger les messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact-messages");

      if (response.data.success) {
        setMessages(response.data.data);
        setFilteredMessages(response.data.data);

        // Calculer les statistiques
        const total = response.data.data.length;
        const unread = response.data.data.filter((msg) => !msg.isRead).length;
        const pending = response.data.data.filter(
          (msg) => msg.status === "pending"
        ).length;
        const replied = response.data.data.filter(
          (msg) => msg.status === "replied"
        ).length;
        const archived = response.data.data.filter(
          (msg) => msg.status === "archived"
        ).length;

        setStats({ total, unread, pending, replied, archived });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = messages;

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((msg) => msg.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== "all") {
      filtered = filtered.filter((msg) => msg.messageType === typeFilter);
    }

    // Filtre par recherche
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          msg.subject.toLowerCase().includes(term) ||
          msg.message.toLowerCase().includes(term) ||
          msg.senderName.toLowerCase().includes(term) ||
          msg.senderEmail.toLowerCase().includes(term) ||
          msg.service?.libelle?.toLowerCase().includes(term) ||
          false
      );
    }

    setFilteredMessages(filtered);
  }, [messages, statusFilter, typeFilter, searchTerm]);

  // Marquer comme lu/non lu
  const toggleReadStatus = async (messageId, currentStatus) => {
    try {
      const response = await api.put(`/contact-messages/${messageId}/status`, {
        status: currentStatus ? "pending" : "read",
      });

      if (response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  isRead: !currentStatus,
                  status: currentStatus ? "pending" : "read",
                }
              : msg
          )
        );

        toast({
          title: "Succès",
          description: `Message marqué comme ${
            currentStatus ? "non lu" : "lu"
          }`,
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  // Archiver un message
  const archiveMessage = async (messageId) => {
    try {
      const response = await api.put(`/contact-messages/${messageId}/status`, {
        status: "archived",
      });

      if (response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status: "archived" } : msg
          )
        );

        toast({
          title: "Succès",
          description: "Message archivé",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'archiver le message",
        variant: "destructive",
      });
    }
  };

  // Répondre à un message
  const sendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    try {
      const response = await api.put(
        `/contact-messages/${selectedMessage.id}/status`,
        {
          replyMessage: replyContent,
          status: "replied",
        }
      );

      if (response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === selectedMessage.id
              ? {
                  ...msg,
                  replyMessage: replyContent,
                  isReplied: true,
                  repliedAt: new Date().toISOString(),
                  status: "replied",
                }
              : msg
          )
        );

        toast({
          title: "Réponse envoyée",
          description: "Votre réponse a été envoyée avec succès",
        });

        setShowReplyModal(false);
        setReplyContent("");
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    }
  };

  // Voir les détails d'un message
  const viewMessageDetails = async (message) => {
    try {
      // Récupérer les détails complets
      const response = await api.get(`/contact-messages/${message.id}`);

      if (response.data.success) {
        setSelectedMessage(response.data.data);
        setShowMessageDetail(true);

        // Marquer comme lu si ce n'est pas déjà fait
        if (!message.isRead) {
          toggleReadStatus(message.id, false);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du message",
        variant: "destructive",
      });
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      });
    } catch (error) {
      return dateString;
    }
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#FEF3C7", color: "#92400E", borderColor: "#F59E0B" }; // yellow
      case "read":
        return { backgroundColor: "#DBEAFE", color: "#1E40AF", borderColor: COLORS.primary }; // blue avec primary
      case "replied":
        return { backgroundColor: "#D1FAE5", color: "#065F46", borderColor: "#10B981" }; // green
      case "archived":
        return { backgroundColor: "#F3F4F6", color: COLORS.smallText, borderColor: COLORS.separator }; // gray
      default:
        return { backgroundColor: "#F3F4F6", color: COLORS.smallText, borderColor: COLORS.separator };
    }
  };

  // Obtenir l'icône selon le type
  const getMessageTypeIcon = (type) => {
    switch (type) {
      case "service":
        return <Briefcase className="h-4 w-4" />;
      case "metier":
        return <FileText className="h-4 w-4" />;
      case "professional":
        return <User className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "read":
        return "Lu";
      case "replied":
        return "Répondu";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  // Obtenir le libellé du type
  const getTypeLabel = (type) => {
    switch (type) {
      case "service":
        return "Service";
      case "metier":
        return "Métier";
      case "professional":
        return "Professionnel";
      case "general":
        return "Général";
      default:
        return type;
    }
  };

  // Obtenir le libellé de la priorité
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "low":
        return "Basse";
      case "normal":
        return "Normale";
      case "high":
        return "Haute";
      case "urgent":
        return "Urgent";
      default:
        return priority;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des messages de contact" />;
  }

  return (
    <div className="min-h-screen pt-2" style={{ backgroundColor: COLORS.lightBg }}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* En-tête */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.secondaryText }}>
            Messages de contact
          </h1>
          <p className="text-sm sm:text-base mt-2" style={{ color: COLORS.logo }}>
            Gérez les demandes de renseignements de vos clients et prospects
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card style={{ borderColor: COLORS.separator }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.logo }}>
                    Total
                  </p>
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.secondaryText }}>
                    {stats.total}
                  </p>
                </div>
                <MessageSquare className="h-6 sm:h-8 w-6 sm:w-8 flex-shrink-0" style={{ color: COLORS.primary }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ borderColor: COLORS.separator }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.logo }}>
                    Non lus
                  </p>
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.secondaryText }}>
                    {stats.unread}
                  </p>
                </div>
                <EyeOff className="h-6 sm:h-8 w-6 sm:w-8 flex-shrink-0" style={{ color: COLORS.primary }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ borderColor: COLORS.separator }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.logo }}>
                    En attente
                  </p>
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.secondaryText }}>
                    {stats.pending}
                  </p>
                </div>
                <Clock className="h-6 sm:h-8 w-6 sm:w-8 flex-shrink-0" style={{ color: COLORS.primary }} />
              </div>
            </CardContent>
          </Card>

          <Card style={{ borderColor: COLORS.separator }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.logo }}>
                    Répondu
                  </p>
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.secondaryText }}>
                    {stats.replied}
                  </p>
                </div>
                <CheckCircle className="h-6 sm:h-8 w-6 sm:w-8 flex-shrink-0" style={{ color: COLORS.primary }} />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 sm:col-span-1" style={{ borderColor: COLORS.separator }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.logo }}>
                    Archivé
                  </p>
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.secondaryText }}>
                    {stats.archived}
                  </p>
                </div>
                <Archive className="h-6 sm:h-8 w-6 sm:w-8 flex-shrink-0" style={{ color: COLORS.logo }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-4 sm:mb-6" style={{ borderColor: COLORS.separator }}>
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Recherche */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: COLORS.logo }} />
                  <Input
                    placeholder="Rechercher dans les messages..."
                    className="pl-10 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      borderColor: COLORS.separator,
                      color: COLORS.smallText
                    }}
                  />
                </div>
              </div>

              {/* Filtres */}
              <div className="flex flex-col sm:flex-row gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-xs sm:text-sm w-full sm:w-auto"
                      style={{ borderColor: COLORS.separator }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Statut:</span>
                      {statusFilter === "all"
                        ? "Tous"
                        : getStatusLabel(statusFilter)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      Tous les statuts
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("pending")}
                    >
                      <Badge
                        variant="outline"
                        className="mr-2"
                        style={{ backgroundColor: "#FEF3C7", color: "#92400E", borderColor: "#F59E0B" }}
                      >
                        En attente
                      </Badge>
                      ({stats.pending})
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("read")}>
                      <Badge
                        variant="outline"
                        className="mr-2"
                        style={{ backgroundColor: "#DBEAFE", color: "#1E40AF", borderColor: COLORS.primary }}
                      >
                        Lu
                      </Badge>
                      ({stats.total - stats.unread - stats.pending})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("replied")}
                    >
                      <Badge
                        variant="outline"
                        className="mr-2"
                        style={{ backgroundColor: "#D1FAE5", color: "#065F46", borderColor: "#10B981" }}
                      >
                        Répondu
                      </Badge>
                      ({stats.replied})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("archived")}
                    >
                      <Badge
                        variant="outline"
                        className="mr-2"
                        style={{ backgroundColor: "#F3F4F6", color: COLORS.smallText, borderColor: COLORS.separator }}
                      >
                        Archivé
                      </Badge>
                      ({stats.archived})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-xs sm:text-sm w-full sm:w-auto"
                      style={{ borderColor: COLORS.separator }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Type:</span>
                      {typeFilter === "all" ? "Tous" : getTypeLabel(typeFilter)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                      Tous les types
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTypeFilter("service")}>
                      <Briefcase className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                      Service
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("metier")}>
                      <FileText className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                      Métier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTypeFilter("professional")}
                    >
                      <User className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                      Professionnel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("general")}>
                      <MessageSquare className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                      Général
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={fetchMessages}
                  className="text-xs sm:text-sm w-full sm:w-auto"
                  style={{ borderColor: COLORS.separator }}
                >
                  <RefreshCw className="h-4 w-4" style={{ color: COLORS.smallText }} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des messages */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4 grid grid-cols-2 sm:w-auto" style={{ backgroundColor: `${COLORS.separator}30` }}>
            <TabsTrigger value="list" className="text-xs sm:text-sm">
              Liste ({filteredMessages.length})
            </TabsTrigger>
            <TabsTrigger value="grid" className="text-xs sm:text-sm">
              Grille
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-3 sm:space-y-4">
            {filteredMessages.length === 0 ? (
              <Card style={{ borderColor: COLORS.separator }}>
                <CardContent className="p-6 sm:p-8 text-center">
                  <MessageSquare className="h-10 sm:h-12 w-10 sm:w-12 mx-auto mb-4" style={{ color: COLORS.separator }} />
                  <h3 className="text-base sm:text-lg font-medium mb-2" style={{ color: COLORS.secondaryText }}>
                    Aucun message trouvé
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.logo }}>
                    {searchTerm ||
                    statusFilter !== "all" ||
                    typeFilter !== "all"
                      ? "Aucun message ne correspond à vos critères de recherche"
                      : "Vous n'avez pas encore de messages de contact"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => {
                const statusColor = getStatusColor(message.status);
                return (
                  <Card
                    key={message.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    style={{ 
                      borderColor: COLORS.separator,
                      borderLeftWidth: !message.isRead ? '4px' : '1px',
                      borderLeftColor: !message.isRead ? COLORS.primary : COLORS.separator
                    }}
                    onClick={() => viewMessageDetails(message)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                        <div className="flex-1 w-full min-w-0">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge style={statusColor}>
                              {getStatusLabel(message.status)}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
                            >
                              {getMessageTypeIcon(message.messageType)}
                              <span className="ml-1">
                                {getTypeLabel(message.messageType)}
                              </span>
                            </Badge>
                            {message.priority === "high" ||
                            message.priority === "urgent" ? (
                              <Badge
                                variant="destructive"
                                className="animate-pulse text-xs"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {getPriorityLabel(message.priority)}
                              </Badge>
                            ) : null}
                            {!message.isRead && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
                              >
                                <EyeOff className="h-3 w-3 mr-1" />
                                Non lu
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-sm sm:text-base mb-1 truncate" style={{ color: COLORS.secondaryText }}>
                            {message.subject}
                          </h3>

                          <div className="flex flex-col gap-1 text-xs sm:text-sm mb-2" style={{ color: COLORS.logo }}>
                            <div className="flex items-center flex-wrap gap-1">
                              <User className="h-3 w-3 flex-shrink-0" />
                              <span className="font-medium truncate" style={{ color: COLORS.smallText }}>
                                {message.senderName}
                              </span>
                            </div>
                            <div className="flex items-center flex-wrap gap-1">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">
                                {message.senderEmail}
                              </span>
                            </div>
                            {message.senderPhone && (
                              <div className="flex items-center flex-wrap gap-1">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {message.senderPhone}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm line-clamp-2 mb-3" style={{ color: COLORS.smallText }}>
                            {message.message}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs" style={{ color: COLORS.logo }}>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                              {formatDate(message.createdAt)}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {message.service && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                  style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
                                >
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {message.service.libelle}
                                </Badge>
                              )}
                              {message.isReplied && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{ backgroundColor: "#D1FAE5", borderColor: "#10B981", color: "#065F46" }}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Répondu
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0"
                            >
                              <MoreVertical className="h-4 w-4" style={{ color: COLORS.smallText }} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                toggleReadStatus(message.id, message.isRead)
                              }
                              style={{ color: COLORS.smallText }}
                            >
                              {message.isRead ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                                  Marquer comme non lu
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                                  Marquer comme lu
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMessage(message);
                                setShowReplyModal(true);
                              }}
                              style={{ color: COLORS.smallText }}
                            >
                              <Reply className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                              Répondre
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => archiveMessage(message.id)}
                              style={{ color: COLORS.smallText }}
                            >
                              <Archive className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                              Archiver
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => viewMessageDetails(message)}
                              style={{ color: COLORS.smallText }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                              Voir les détails
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredMessages.map((message) => {
                const statusColor = getStatusColor(message.status);
                return (
                  <Card
                    key={message.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    style={{ 
                      borderColor: COLORS.separator,
                      borderLeftWidth: !message.isRead ? '4px' : '1px',
                      borderLeftColor: !message.isRead ? COLORS.primary : COLORS.separator
                    }}
                    onClick={() => viewMessageDetails(message)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            className="text-xs"
                            style={statusColor}
                          >
                            {getStatusLabel(message.status)}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs" style={{ color: COLORS.logo }}>
                            {getMessageTypeIcon(message.messageType)}
                            <span className="hidden sm:inline">
                              {getTypeLabel(message.messageType)}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-sm line-clamp-2" style={{ color: COLORS.secondaryText }}>
                          {message.subject}
                        </h3>

                        <div className="space-y-1 text-xs sm:text-sm">
                          <div className="flex items-center truncate" style={{ color: COLORS.logo }}>
                            <User className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate" style={{ color: COLORS.smallText }}>{message.senderName}</span>
                          </div>
                          <div className="flex items-center truncate" style={{ color: COLORS.logo }}>
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {message.senderEmail}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm line-clamp-3" style={{ color: COLORS.smallText }}>
                          {message.message}
                        </p>

                        <div className="pt-2" style={{ borderTopColor: COLORS.separator, borderTopWidth: '1px' }}>
                          <div className="flex items-center justify-between text-xs" style={{ color: COLORS.logo }}>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(message.createdAt)}
                            </div>
                            {message.isReplied && (
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{ backgroundColor: "#D1FAE5", borderColor: "#10B981", color: "#065F46" }}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Répondu
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de réponse */}
      <AlertDialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <div className="sticky top-0 p-4 sm:p-6 flex items-center justify-between" style={{ borderBottomColor: COLORS.separator, backgroundColor: COLORS.lightBg }}>
            <AlertDialogTitle className="text-lg sm:text-xl" style={{ color: COLORS.secondaryText }}>
              Répondre à {selectedMessage?.senderName}
            </AlertDialogTitle>
            <button
              onClick={() => setShowReplyModal(false)}
              style={{ color: COLORS.logo }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 sm:px-6 py-4">
            <AlertDialogDescription className="mb-4 text-sm" style={{ color: COLORS.logo }}>
              Votre réponse sera envoyée à {selectedMessage?.senderEmail}
              {selectedMessage?.senderPhone &&
                ` (${selectedMessage.senderPhone})`}
            </AlertDialogDescription>

            <div className="space-y-4">
              {/* Message original */}
              <Card style={{ borderColor: COLORS.separator }}>
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Badge
                          className="text-xs"
                          style={getStatusColor(selectedMessage?.status)}
                        >
                          {getStatusLabel(selectedMessage?.status)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
                        >
                          {getMessageTypeIcon(selectedMessage?.messageType)}
                          <span className="ml-1">
                            {getTypeLabel(selectedMessage?.messageType)}
                          </span>
                        </Badge>
                      </div>
                      <span className="text-xs sm:text-sm" style={{ color: COLORS.logo }}>
                        {formatDate(selectedMessage?.createdAt)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm" style={{ color: COLORS.secondaryText }}>
                      {selectedMessage?.subject}
                    </h4>
                    <p className="text-xs sm:text-sm whitespace-pre-wrap" style={{ color: COLORS.smallText }}>
                      {selectedMessage?.message}
                    </p>
                    {selectedMessage?.service && (
                      <div className="pt-2" style={{ borderTopColor: COLORS.separator, borderTopWidth: '1px' }}>
                        <p className="text-xs" style={{ color: COLORS.logo }}>
                          <Briefcase className="h-3 w-3 inline mr-1" />
                          Service concerné: {selectedMessage.service.libelle}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Formulaire de réponse */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reply" className="text-sm" style={{ color: COLORS.secondaryText }}>
                    Votre réponse
                  </Label>
                  <Textarea
                    id="reply"
                    placeholder="Tapez votre réponse ici..."
                    className="min-h-[120px] sm:min-h-[150px] mt-1 text-sm"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    style={{ 
                      borderColor: COLORS.separator,
                      color: COLORS.smallText
                    }}
                  />
                  <p className="text-xs mt-1" style={{ color: COLORS.logo }}>
                    Soyez précis et professionnel dans votre réponse
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 p-4 sm:p-6 flex flex-col sm:flex-row gap-2 justify-end" style={{ borderTopColor: COLORS.separator, backgroundColor: COLORS.lightBg }}>
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1" style={{ borderColor: COLORS.separator }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={sendReply}
              disabled={!replyContent.trim()}
              className="w-full sm:w-auto order-1 sm:order-2"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Reply className="h-4 w-4 mr-2" />
              Envoyer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de détails du message */}
      <AlertDialog open={showMessageDetail} onOpenChange={setShowMessageDetail}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="sticky top-0 p-4 sm:p-6 flex items-center justify-between z-10" style={{ borderBottomColor: COLORS.separator, backgroundColor: COLORS.lightBg }}>
            <AlertDialogTitle className="text-lg sm:text-xl" style={{ color: COLORS.secondaryText }}>
              Détails du message
            </AlertDialogTitle>
            <button
              onClick={() => setShowMessageDetail(false)}
              style={{ color: COLORS.logo }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
              {selectedMessage && (
                <>
                  {/* En-tête */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: COLORS.secondaryText }}>
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge
                        className="text-xs"
                        style={getStatusColor(selectedMessage.status)}
                      >
                        {getStatusLabel(selectedMessage.status)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
                      >
                        {getMessageTypeIcon(selectedMessage.messageType)}
                        <span className="ml-1">
                          {getTypeLabel(selectedMessage.messageType)}
                        </span>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
                      >
                        Priorité: {getPriorityLabel(selectedMessage.priority)}
                      </Badge>
                      <div className="text-xs sm:text-sm ml-auto" style={{ color: COLORS.logo }}>
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {formatDate(selectedMessage.createdAt)}
                      </div>
                    </div>
                  </div>

                  <Separator style={{ backgroundColor: COLORS.separator }} />

                  {/* Informations de l'expéditeur */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm" style={{ color: COLORS.secondaryText }}>
                      Expéditeur
                    </h3>
                    <Card style={{ borderColor: COLORS.separator }}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <p className="text-xs font-medium" style={{ color: COLORS.logo }}>
                              Nom complet
                            </p>
                            <p className="text-sm" style={{ color: COLORS.smallText }}>
                              {selectedMessage.senderName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium" style={{ color: COLORS.logo }}>
                              Email
                            </p>
                            <p className="text-sm break-all" style={{ color: COLORS.smallText }}>
                              {selectedMessage.senderEmail}
                            </p>
                          </div>
                          {selectedMessage.senderPhone && (
                            <div>
                              <p className="text-xs font-medium" style={{ color: COLORS.logo }}>
                                Téléphone
                              </p>
                              <p className="text-sm" style={{ color: COLORS.smallText }}>
                                {selectedMessage.senderPhone}
                              </p>
                            </div>
                          )}
                          {selectedMessage.userId && (
                            <div>
                              <p className="text-xs font-medium" style={{ color: COLORS.logo }}>
                                Utilisateur
                              </p>
                              <p className="text-sm" style={{ color: COLORS.smallText }}>
                                Connecté (ID: {selectedMessage.userId})
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Message */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm" style={{ color: COLORS.secondaryText }}>
                      Message
                    </h3>
                    <Card style={{ borderColor: COLORS.separator }}>
                      <CardContent className="p-3 sm:p-4">
                        <p className="text-sm whitespace-pre-wrap" style={{ color: COLORS.smallText }}>
                          {selectedMessage.message}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Informations complémentaires */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {selectedMessage.service && (
                      <div>
                        <h3 className="font-semibold mb-3 text-sm" style={{ color: COLORS.secondaryText }}>
                          Service concerné
                        </h3>
                        <Card style={{ borderColor: COLORS.separator }}>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                              <div className="min-w-0">
                                <p className="font-medium text-sm" style={{ color: COLORS.smallText }}>
                                  {selectedMessage.service.libelle}
                                </p>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-xs"
                                  style={{ color: COLORS.primary }}
                                  onClick={() =>
                                    navigate(
                                      `/services/digitalisation/${selectedMessage.service.id}`
                                    )
                                  }
                                >
                                  Voir le service
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {selectedMessage.metier && (
                      <div>
                        <h3 className="font-semibold mb-3 text-sm" style={{ color: COLORS.secondaryText }}>
                          Métier concerné
                        </h3>
                        <Card style={{ borderColor: COLORS.separator }}>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                              <div>
                                <p className="font-medium text-sm" style={{ color: COLORS.smallText }}>
                                  {selectedMessage.metier.libelle}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Réponse existante */}
                  {selectedMessage.isReplied &&
                    selectedMessage.replyMessage && (
                      <div>
                        <h3 className="font-semibold mb-3 text-sm" style={{ color: COLORS.secondaryText }}>
                          Votre réponse
                        </h3>
                        <Card style={{ backgroundColor: "#D1FAE5", borderColor: "#10B981" }}>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: "#065F46" }} />
                              <span className="text-xs sm:text-sm font-medium" style={{ color: "#065F46" }}>
                                Répondu le{" "}
                                {new Date(
                                  selectedMessage.repliedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap" style={{ color: COLORS.smallText }}>
                              {selectedMessage.replyMessage}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 p-4 sm:p-6" style={{ borderTopColor: COLORS.separator, backgroundColor: COLORS.lightBg }}>
            <div className="flex flex-col sm:flex-row gap-2">
              {selectedMessage && !selectedMessage.isReplied && (
                <Button
                  onClick={() => {
                    setShowMessageDetail(false);
                    setShowReplyModal(true);
                  }}
                  className="w-full sm:w-auto text-sm"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Répondre
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() =>
                  selectedMessage &&
                  toggleReadStatus(selectedMessage.id, selectedMessage.isRead)
                }
                className="w-full sm:w-auto text-sm"
                style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
              >
                {selectedMessage?.isRead ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                    Marquer comme non lu
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                    Marquer comme lu
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  selectedMessage && archiveMessage(selectedMessage.id)
                }
                className="w-full sm:w-auto text-sm"
                style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
              >
                <Archive className="h-4 w-4 mr-2" style={{ color: COLORS.primary }} />
                Archiver
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowMessageDetail(false)}
                className="w-full sm:w-auto text-sm"
                style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
              >
                Fermer
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactMessagesPage;