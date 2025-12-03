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
      const response = await api.put(
        `/contact-messages/${messageId}/status`,
        {
          status: currentStatus ? "pending" : "read",
        }
      );

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
      const response = await api.put(
        `/contact-messages/${messageId}/status`,
        {
          status: "archived",
        }
      );

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
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "read":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "replied":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
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
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement des messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Messages de contact
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les demandes de renseignements de vos clients et prospects
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Non lus</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.unread}
                  </p>
                </div>
                <EyeOff className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    En attente
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Répondu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.replied}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Archivé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.archived}
                  </p>
                </div>
                <Archive className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher dans les messages..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Statut:{" "}
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
                        className="mr-2 bg-yellow-100 text-yellow-800"
                      >
                        En attente
                      </Badge>
                      ({stats.pending})
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("read")}>
                      <Badge
                        variant="outline"
                        className="mr-2 bg-blue-100 text-blue-800"
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
                        className="mr-2 bg-green-100 text-green-800"
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
                        className="mr-2 bg-gray-100 text-gray-800"
                      >
                        Archivé
                      </Badge>
                      ({stats.archived})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Type:{" "}
                      {typeFilter === "all" ? "Tous" : getTypeLabel(typeFilter)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                      Tous les types
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTypeFilter("service")}>
                      <Briefcase className="h-4 w-4 mr-2" />
                      Service
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("metier")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Métier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTypeFilter("professional")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Professionnel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("general")}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Général
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" onClick={fetchMessages}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des messages */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">
              Liste ({filteredMessages.length})
            </TabsTrigger>
            <TabsTrigger value="grid">Grille</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun message trouvé
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    typeFilter !== "all"
                      ? "Aucun message ne correspond à vos critères de recherche"
                      : "Vous n'avez pas encore de messages de contact"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    !message.isRead ? "border-l-4 border-l-blue-500" : ""
                  }`}
                  onClick={() => viewMessageDetails(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getStatusColor(message.status)}>
                            {getStatusLabel(message.status)}
                          </Badge>
                          <Badge variant="outline">
                            {getMessageTypeIcon(message.messageType)}
                            <span className="ml-1">
                              {getTypeLabel(message.messageType)}
                            </span>
                          </Badge>
                          {message.priority === "high" ||
                          message.priority === "urgent" ? (
                            <Badge
                              variant="destructive"
                              className="animate-pulse"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {getPriorityLabel(message.priority)}
                            </Badge>
                          ) : null}
                          {!message.isRead && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-800"
                            >
                              <EyeOff className="h-3 w-3 mr-1" />
                              Non lu
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-1">
                          {message.subject}
                        </h3>

                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="h-3 w-3 mr-1" />
                          <span className="font-medium mr-2">
                            {message.senderName}
                          </span>
                          <Mail className="h-3 w-3 mr-1 ml-3" />
                          <span>{message.senderEmail}</span>
                          {message.senderPhone && (
                            <>
                              <Phone className="h-3 w-3 mr-1 ml-3" />
                              <span>{message.senderPhone}</span>
                            </>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                          {message.message}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(message.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            {message.service && (
                              <Badge variant="outline" className="text-xs">
                                <Briefcase className="h-3 w-3 mr-1" />
                                {message.service.libelle}
                              </Badge>
                            )}
                            {message.isReplied && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-50"
                              >
                                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
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
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              toggleReadStatus(message.id, message.isRead)
                            }
                          >
                            {message.isRead ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Marquer comme non lu
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Marquer comme lu
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowReplyModal(true);
                            }}
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            Répondre
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => archiveMessage(message.id)}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => viewMessageDetails(message)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    !message.isRead ? "border-l-4 border-l-blue-500" : ""
                  }`}
                  onClick={() => viewMessageDetails(message)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(message.status)}>
                          {getStatusLabel(message.status)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getMessageTypeIcon(message.messageType)}
                          <span className="text-xs text-gray-500">
                            {getTypeLabel(message.messageType)}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {message.subject}
                      </h3>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{message.senderName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {message.senderEmail}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-3">
                        {message.message}
                      </p>

                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(message.createdAt)}
                          </div>
                          {message.isReplied && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50"
                            >
                              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                              Répondu
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de réponse */}
      <AlertDialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Répondre à {selectedMessage?.senderName}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Votre réponse sera envoyée à {selectedMessage?.senderEmail}
              {selectedMessage?.senderPhone &&
                ` (${selectedMessage.senderPhone})`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {/* Message original */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getStatusColor(selectedMessage?.status)}
                      >
                        {getStatusLabel(selectedMessage?.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getMessageTypeIcon(selectedMessage?.messageType)}
                        <span className="ml-1">
                          {getTypeLabel(selectedMessage?.messageType)}
                        </span>
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(selectedMessage?.createdAt)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedMessage?.subject}
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage?.message}
                  </p>
                  {selectedMessage?.service && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">
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
                <Label htmlFor="reply">Votre réponse</Label>
                <Textarea
                  id="reply"
                  placeholder="Tapez votre réponse ici..."
                  className="min-h-[150px] mt-1"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Soyez précis et professionnel dans votre réponse
                </p>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={sendReply}
              disabled={!replyContent.trim()}
            >
              <Reply className="h-4 w-4 mr-2" />
              Envoyer la réponse
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de détails du message */}
      <AlertDialog open={showMessageDetail} onOpenChange={setShowMessageDetail}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Détails du message</AlertDialogTitle>
                <AlertDialogDescription>
                  Informations complètes sur la demande
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-6 py-4">
                {/* En-tête */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getStatusColor(selectedMessage.status)}>
                        {getStatusLabel(selectedMessage.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getMessageTypeIcon(selectedMessage.messageType)}
                        <span className="ml-1">
                          {getTypeLabel(selectedMessage.messageType)}
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        Priorité: {getPriorityLabel(selectedMessage.priority)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>

                <Separator />

                {/* Informations de l'expéditeur */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Expéditeur
                  </h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Nom complet
                          </p>
                          <p className="text-gray-900">
                            {selectedMessage.senderName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Email
                          </p>
                          <p className="text-gray-900">
                            {selectedMessage.senderEmail}
                          </p>
                        </div>
                        {selectedMessage.senderPhone && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Téléphone
                            </p>
                            <p className="text-gray-900">
                              {selectedMessage.senderPhone}
                            </p>
                          </div>
                        )}
                        {selectedMessage.userId && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Utilisateur
                            </p>
                            <p className="text-gray-900">
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
                  <h3 className="font-semibold text-gray-900 mb-3">Message</h3>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Informations complémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedMessage.service && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Service concerné
                      </h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedMessage.service.libelle}
                              </p>
                              <Button
                                variant="link"
                                className="p-0 h-auto"
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
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Métier concerné
                      </h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="font-medium text-gray-900">
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
                {selectedMessage.isReplied && selectedMessage.replyMessage && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Votre réponse
                    </h3>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Répondu le{" "}
                            {new Date(
                              selectedMessage.repliedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedMessage.replyMessage}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {!selectedMessage.isReplied && (
                    <Button
                      onClick={() => {
                        setShowMessageDetail(false);
                        setShowReplyModal(true);
                      }}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Répondre
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() =>
                      toggleReadStatus(
                        selectedMessage.id,
                        selectedMessage.isRead
                      )
                    }
                  >
                    {selectedMessage.isRead ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Marquer comme non lu
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Marquer comme lu
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => archiveMessage(selectedMessage.id)}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archiver
                  </Button>
                </div>
              </div>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactMessagesPage;
