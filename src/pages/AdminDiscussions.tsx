// pages/AdminDiscussions.jsx
import { useState, useEffect, useRef } from "react";
import {
  Send,
  Calendar,
  MapPin,
  Wrench,
  Zap,
  User,
  MessageCircle,
  AlertCircle,
  Clock,
  CheckCircle,
  Paperclip,
  FileText,
  Lock,
  Users,
  FileCheck,
  Euro,
  CheckCircle2,
  XCircle,
  Clock4,
  Star,
  ArrowDown,
  X,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useMessaging } from "@/hooks/useMessaging";
import api from "@/lib/api";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { useSocket } from "../contexts/SocketContext";

export default function AdminDiscussions() {
  const { id } = useParams();
  const location = useLocation();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [artisansStats, setArtisansStats] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showMobileActionsMenu, setShowMobileActionsMenu] = useState(false);
  const messagesContainerRef = useRef(null);

  const { socket, isConnected } = useSocket();
  const {
    messages,
    conversation,
    loading: messagesLoading,
    sendMessage,
    sending,
    messagesEndRef,
    scrollToBottom,
  } = useMessaging(id);

  // Gérer l'affichage du bouton scroll
  const handleScroll = (e) => {
    const container = e.target;
    const isAtBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollButton(!isAtBottom);
  };

  const handleScrollToBottom = () => {
    scrollToBottom();
    setShowScrollButton(false);
  };

  const getUrgencyBg = (urgency) => {
    switch (urgency) {
      case "Urgent":
        return "bg-red-500";
      case "Moyen":
        return "bg-orange-500";
      case "Faible":
        return "bg-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "Urgent":
        return <AlertCircle className="w-4 h-4" />;
      case "Moyen":
        return <Clock className="w-4 h-4" />;
      case "Faible":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const validate = async (valeur) => {
    try {
      const response = await api.put(`/admin/demandes/${demande.id}/validate`, {
        validate: valeur,
      });
      setDemande(response.data.demande);
      toast.info(response.data.message);
    } catch (error) {
      console.error("Erreur validation:", error);
      toast.error("Erreur lors de la validation");
    }
  };

  // Charger la demande et les statistiques des artisans
  useEffect(() => {
    const fetchDemande = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await api.get(`/demandes/${id}`);
          setDemande(response.data);

          // Charger les statistiques des artisans
          await fetchArtisansStats(response.data.id);
        }
      } catch (error) {
        console.error("Erreur chargement demande:", error);
        toast.error("Erreur lors du chargement de la demande");
      } finally {
        setLoading(false);
      }
    };

    fetchDemande();
  }, [id]);

  const fetchArtisansStats = async (demandeId) => {
    try {
      const response = await api.get(`/demandes/${demandeId}/artisans-stats`);
      setArtisansStats(response.data);
    } catch (error) {
      console.error("Erreur chargement stats artisans:", error);
    }
  };
  // Fonction pour extraire la note du message AVIS_LAISSE
  const extractRatingFromMessage = (content) => {
    const match = content.match(/Note:\s*(\d+)\/5/);
    return match ? parseInt(match[1]) : 0;
  };

  // Composant pour afficher les étoiles
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`p-1 rounded ${
              star <= rating ? "bg-yellow-400" : "bg-gray-300"
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? "text-yellow-600" : "text-gray-500"
              }`}
              fill="currentColor"
            />
          </div>
        ))}
      </div>
    );
  };
  const handleSend = async () => {
    if (input.trim().length === 0) return;

    try {
      await sendMessage(input);
      setInput("");
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingFile(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await api.post("/upload/message-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await sendMessage(`Fichier: ${file.name}`, getMessageType(file.type), {
        url: uploadResponse.data.url,
        name: file.name,
        type: file.type,
      });

      toast.success("Fichier envoyé avec succès");
    } catch (error) {
      console.error("Erreur upload fichier:", error);
      toast.error("Erreur lors de l'envoi du fichier");
    } finally {
      setUploadingFile(false);
      event.target.value = "";
    }
  };

  const getMessageType = (fileType) => {
    if (fileType.startsWith("image/")) return "IMAGE";
    if (fileType === "application/pdf") return "PDF";
    if (fileType.includes("document") || fileType.includes("word"))
      return "DOCUMENT";
    return "TEXT";
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSenderName = (message) => {
    if (message.expediteur) {
      return (
        message.expediteur.companyName ||
        `${message.expediteur.firstName} ${message.expediteur.lastName}`
      );
    }
    return "Utilisateur";
  };

  const isCurrentUser = (message) => {
    // L'utilisateur actuel est celui qui a créé la demande (le client)
    return message.expediteurId === demande?.createdById;
  };

  const getInitials = (user) => {
    if (!user) return "?";
    const firstName = user.firstName?.[0] ?? "";
    const lastName = user.lastName?.[0] ?? "";
    return `${firstName}${lastName}`.toUpperCase();
  };

  const renderAvatar = (message) => {
    const user = message.expediteur;
    if (!user) return null;

    // Si l'utilisateur a un avatar/logo, l'afficher
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={getSenderName(message)}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    // Sinon, afficher les initiales
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-xs">
        {getInitials(user)}
      </div>
    );
  };

  const getArtisanStatus = (artisan) => {
    if (artisan.travauxTermines) return "terminé";
    if (artisan.factureConfirmee) return "facture confirmée";
    if (artisan.factureStatus === "validee") return "facture validée";
    if (artisan.factureStatus === "en_attente") return "facture en attente";
    if (artisan.factureMontant) return "facture envoyée";
    if (artisan.recruited) return "recruté";
    if (artisan.devis) return "devis envoyé";
    if (artisan.rdv) return "rdv fixé";
    if (artisan.accepte === true) return "accepté";
    if (artisan.accepte === false) return "refusé";
    return "en attente";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "terminé":
        return "bg-green-100 text-green-800 border-green-200";
      case "facture confirmée":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "facture validée":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "facture en attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "facture envoyée":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "recruté":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "devis envoyé":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "rdv fixé":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "accepté":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "refusé":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "terminé":
        return <CheckCircle2 className="w-4 h-4" />;
      case "facture confirmée":
        return <Euro className="w-4 h-4" />;
      case "facture validée":
        return <FileCheck className="w-4 h-4" />;
      case "facture en attente":
        return <Clock4 className="w-4 h-4" />;
      case "facture envoyée":
        return <FileCheck className="w-4 h-4" />;
      case "recruté":
        return <Users className="w-4 h-4" />;
      case "devis envoyé":
        return <FileCheck className="w-4 h-4" />;
      case "rdv fixé":
        return <Calendar className="w-4 h-4" />;
      case "accepté":
        return <CheckCircle2 className="w-4 h-4" />;
      case "refusé":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock4 className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des données en cours..." />;
  }

  if (!demande) {
    return <div className="p-8 text-center">Demande non trouvée</div>;
  }

  return (
    <div className="min-h-full">
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-100px)]">
        {/* Côté gauche - Informations du projet */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-sm border-b lg:border-b-0 lg:border-r border-gray-200 p-4 sm:p-1 lg:p-8 overflow-y-auto lg:mt-0 mt-20">
          <div className="max-w-2xl mx-auto">
            {/* Informations principales */}
            <div className="relative space-y-1">
              <h1 className="text-xl font-bold text-gray-900">
                Demande #{demande.id}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {demande.contactNom} {demande.contactPrenom}
              </p>

              {/* Statut de la demande */}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    demande.statut === "validée"
                      ? "bg-green-100 text-green-800"
                      : demande.statut === "refusée"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {demande.statut || "En attente"}
                </span>
                {!isConnected && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Hors ligne
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center gap-5 mt-4">
                <h3 className="text-md font-semibold text-gray-500">
                  Date de la demande :
                </h3>
                <div className="flex items-center gap-3 text-md font-semibold text-gray-900">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>
                    {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              {/* Métier */}
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-500 mb-3 underline">
                  Artisan demandé
                </h3>
                <div className="flex flex-wrap gap-4">
                  {demande.metier && (
                    <div className="flex items-center gap-3 bg-blue-50 text-blue-700 border-blue-200 px-3 py-2 rounded-xl border">
                      <Wrench className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {demande.metier.libelle}
                      </span>
                    </div>
                  )}
                  {demande.service && (
                    <div className="flex items-center gap-3 bg-green-50 text-green-700 border-green-200 px-3 py-2 rounded-xl border">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {demande.service.libelle}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Adresse */}
              <div className="mt-4">
                <h3 className="text-md underline font-semibold text-gray-500 mb-2">
                  Adresse du projet
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{demande.lieuAdresse}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pl-9">
                    <div>
                      <p className="text-md text-gray-500 mb-2">Ville</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {demande.lieuAdresseVille || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-md text-gray-500 mb-2">Code postal</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {demande.lieuAdresseCp || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Description
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-md text-gray-700 leading-relaxed">
                  {demande.description}
                </p>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact</h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-semibold">
                      {demande.contactNom} {demande.contactPrenom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-semibold">{demande.contactTel}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{demande.contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions de validation */}
            {demande.statut !== "validée" && !demande.demandeAcceptee && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
                  onClick={() => validate(true)}
                >
                  ACCEPTER
                </button>
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
                  onClick={() => validate(false)}
                >
                  REFUSER
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Côté droit - Discussion (Desktop uniquement) */}
        <div className="hidden lg:flex w-1/2 flex-col bg-white">
          {/* Header discussion */}
          <div className="border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Discussion{" "}
                  {conversation && `(#${conversation.id.slice(0, 8)})`}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-500">
                  {isConnected ? "En ligne" : "Hors ligne"}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-6 scroll-smooth relative"
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {/* Bouton scroll vers le bas */}
            {showScrollButton && (
              <button
                onClick={handleScrollToBottom}
                className="fixed bottom-32 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40 flex items-center justify-center"
                title="Scroller vers le bas"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            )}
            {messagesLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner text="Chargement des messages..." />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Section Statistiques des Artisans */}
                {artisansStats.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Suivi des Artisans
                      </h3>
                    </div>
                    <div className="grid gap-3">
                      {artisansStats.map((artisan) => {
                        const status = getArtisanStatus(artisan);
                        return (
                          <div
                            key={artisan.userId}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {artisan.user.companyName ||
                                      `${artisan.user.firstName} ${artisan.user.lastName}`}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {artisan.user.email}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  status
                                )}`}
                              >
                                {getStatusIcon(status)}
                                <span className="capitalize">{status}</span>
                              </div>
                            </div>

                            {/* Détails des actions */}
                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                              {artisan.rdv && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  <span className="text-gray-600">
                                    RDV:{" "}
                                    {new Date(artisan.rdv).toLocaleDateString(
                                      "fr-FR"
                                    )}
                                  </span>
                                </div>
                              )}
                              {artisan.devis && (
                                <div className="flex items-center gap-2">
                                  <FileCheck className="w-4 h-4 text-green-500" />
                                  <span className="text-gray-600">
                                    Devis envoyé
                                  </span>
                                </div>
                              )}
                              {artisan.factureMontant && (
                                <div className="flex items-center gap-2">
                                  <Euro className="w-4 h-4 text-purple-500" />
                                  <span className="text-gray-600">
                                    Facture: {artisan.factureMontant}€
                                  </span>
                                </div>
                              )}
                              {artisan.travauxTermines && (
                                <div className="flex items-center gap-2 col-span-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  <span className="text-gray-600 font-medium">
                                    Travaux terminés
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Messages de la conversation */}
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      isCurrentUser(message) ? "justify-end" : ""
                    }`}
                  >
                    {!isCurrentUser(message) && (
                      <div className="flex flex-col items-center">
                        {renderAvatar(message)}
                        {index < messages.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] ${
                        isCurrentUser(message) ? "order-first" : ""
                      }`}
                    >
                      {!isCurrentUser(message) && (
                        <div className="text-xs font-medium text-gray-600 mb-1">
                          {getSenderName(message)}
                        </div>
                      )}

                      <div
                        className={`rounded-2xl p-4 ${
                          isCurrentUser(message)
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        {message.urlFichier && (
                          <div className="mb-2">
                            <a
                              href={message.urlFichier}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 text-sm underline ${
                                isCurrentUser(message)
                                  ? "text-blue-200"
                                  : "text-blue-600"
                              }`}
                            >
                              <FileText className="w-4 h-4" />
                              {message.nomFichier}
                            </a>
                          </div>
                        )}

                        <p className="text-sm whitespace-pre-wrap">
                          {message.contenu}
                        </p>
                        {message.evenementType === "AVIS_LAISSE" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <RatingStars
                              rating={extractRatingFromMessage(message.contenu)}
                            />
                          </div>
                        )}
                      </div>
                      <div
                        className={`text-xs mt-1 flex items-center gap-1 ${
                          isCurrentUser(message)
                            ? "text-gray-500 text-right"
                            : "text-gray-400"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                        {message.lu && " • Lu"}
                        {message.type === "SYSTEM" && " • Système"}
                      </div>
                    </div>

                    {isCurrentUser(message) && (
                      <div className="flex flex-col items-center">
                        {renderAvatar(message)}
                        {index < messages.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {messages.length === 0 && !messagesLoading && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucun message dans cette conversation</p>
                    <p className="text-sm">
                      Soyez le premier à envoyer un message !
                    </p>
                  </div>
                )}
                {/* Référence pour scroller vers le bas */}
                <div ref={messagesEndRef} />
                {/* Affichage si la demande est terminée */}
                {demande?.statut === "terminée" && (
                  <div className="mt-8 flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-green-50 to-green-100 rounded-2xl border-2 border-green-300">
                    <div className="mb-4 p-4 bg-green-500 rounded-full">
                      <img
                        src="/Completed.gif"
                        alt="complete"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-green-900 mb-2">
                      Travaux Terminés
                    </h3>
                    <p className="text-green-700 text-center mb-1">
                      Les travaux ont été complétés avec succès
                    </p>
                    <p className="text-sm text-green-600">
                      Cette demande est maintenant clôturée
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-green-700">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Conversation verrouillée
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Zone d'envoi de message */}
          <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
            <div className="flex gap-3">
              <label
                className={`flex items-center justify-center px-4 py-2 rounded-xl border border-gray-300 cursor-pointer ${
                  uploadingFile || demande?.statut == "terminée"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={
                    uploadingFile || sending || demande?.statut == "terminée"
                  }
                />
              </label>

              <input
                type="text"
                placeholder="Tapez votre message ici..."
                className="disabled:cursor-not-allowed flex-1 px-4 py-2 rounded-xl bg-white text-gray-900 border border-gray-200 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={
                  sending || uploadingFile || demande?.statut == "terminée"
                }
              />

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold text-md transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={
                  sending ||
                  uploadingFile ||
                  !input.trim() ||
                  demande?.statut == "terminée"
                }
              >
                {sending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bouton pour ouvrir la discussion sur mobile */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowChatModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center w-16 h-16"
            title="Ouvrir la discussion"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Modale de chat pour mobile */}
        {showChatModal && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
            <div className="fixed inset-0 flex flex-col bg-white">
              {/* Header modale */}
              <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Discussion{" "}
                    {conversation && `(#${conversation.id.slice(0, 8)})`}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {/* Bouton fermeture */}
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 scroll-smooth relative"
                ref={messagesContainerRef}
                onScroll={handleScroll}
              >
                {/* Bouton scroll vers le bas */}
                {showScrollButton && (
                  <button
                    onClick={handleScrollToBottom}
                    className="fixed bottom-32 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40 flex items-center justify-center"
                    title="Scroller vers le bas"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                )}
                {messagesLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <LoadingSpinner text="Chargement des messages..." />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Section Statistiques des Artisans */}
                    {artisansStats.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-bold text-gray-900">
                            Suivi des Artisans
                          </h3>
                        </div>
                        <div className="grid gap-3">
                          {artisansStats.map((artisan) => {
                            const status = getArtisanStatus(artisan);
                            return (
                              <div
                                key={artisan.userId}
                                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">
                                        {artisan.user.companyName ||
                                          `${artisan.user.firstName} ${artisan.user.lastName}`}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        {artisan.user.email}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                      status
                                    )}`}
                                  >
                                    {getStatusIcon(status)}
                                    <span className="capitalize">{status}</span>
                                  </div>
                                </div>

                                {/* Détails des actions */}
                                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                  {artisan.rdv && (
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-blue-500" />
                                      <span className="text-gray-600">
                                        RDV:{" "}
                                        {new Date(artisan.rdv).toLocaleDateString(
                                          "fr-FR"
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {artisan.devis && (
                                    <div className="flex items-center gap-2">
                                      <FileCheck className="w-4 h-4 text-green-500" />
                                      <span className="text-gray-600">
                                        Devis envoyé
                                      </span>
                                    </div>
                                  )}
                                  {artisan.factureMontant && (
                                    <div className="flex items-center gap-2">
                                      <Euro className="w-4 h-4 text-purple-500" />
                                      <span className="text-gray-600">
                                        Facture: {artisan.factureMontant}€
                                      </span>
                                    </div>
                                  )}
                                  {artisan.travauxTermines && (
                                    <div className="flex items-center gap-2 col-span-2">
                                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                                      <span className="text-gray-600 font-medium">
                                        Travaux terminés
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Messages de la conversation */}
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${
                          isCurrentUser(message) ? "justify-end" : ""
                        }`}
                      >
                        {!isCurrentUser(message) && (
                          <div className="flex flex-col items-center">
                            {renderAvatar(message)}
                            {index < messages.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                            )}
                          </div>
                        )}

                        <div
                          className={`max-w-[70%] ${
                            isCurrentUser(message) ? "order-first" : ""
                          }`}
                        >
                          {!isCurrentUser(message) && (
                            <div className="text-xs font-medium text-gray-600 mb-1">
                              {getSenderName(message)}
                            </div>
                          )}

                          <div
                            className={`rounded-2xl p-4 ${
                              isCurrentUser(message)
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                            }`}
                          >
                            {message.urlFichier && (
                              <div className="mb-2">
                                <a
                                  href={message.urlFichier}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 text-sm underline ${
                                    isCurrentUser(message)
                                      ? "text-blue-200"
                                      : "text-blue-600"
                                  }`}
                                >
                                  <FileText className="w-4 h-4" />
                                  {message.nomFichier}
                                </a>
                              </div>
                            )}

                            <p className="text-sm whitespace-pre-wrap">
                              {message.contenu}
                            </p>
                            {message.evenementType === "AVIS_LAISSE" && (
                              <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                                <RatingStars
                                  rating={extractRatingFromMessage(message.contenu)}
                                />
                              </div>
                            )}
                          </div>
                          <div
                            className={`text-xs mt-1 flex items-center gap-1 ${
                              isCurrentUser(message)
                                ? "text-gray-500 text-right"
                                : "text-gray-400"
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                            {message.lu && " • Lu"}
                            {message.type === "SYSTEM" && " • Système"}
                          </div>
                        </div>

                        {isCurrentUser(message) && (
                          <div className="flex flex-col items-center">
                            {renderAvatar(message)}
                            {index < messages.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {messages.length === 0 && !messagesLoading && (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Aucun message dans cette conversation</p>
                        <p className="text-sm">
                          Soyez le premier à envoyer un message !
                        </p>
                      </div>
                    )}
                    {/* Référence pour scroller vers le bas */}
                    <div ref={messagesEndRef} />
                    {/* Affichage si la demande est terminée */}
                    {demande?.statut === "terminée" && (
                      <div className="mt-8 flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-b from-green-50 to-green-100 rounded-2xl border-2 border-green-300">
                        <div className="mb-4 p-4 bg-green-500 rounded-full">
                          <img
                            src="/Completed.gif"
                            alt="complete"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-green-900 mb-2">
                          Travaux Terminés
                        </h3>
                        <p className="text-green-700 text-center mb-1">
                          Les travaux ont été complétés avec succès
                        </p>
                        <p className="text-sm text-green-600">
                          Cette demande est maintenant clôturée
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-green-700">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Conversation verrouillée
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Zone d'envoi de message */}
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex gap-3">
                  <label
                    className={`flex items-center justify-center px-4 py-2 rounded-xl border border-gray-300 cursor-pointer ${
                      uploadingFile || demande?.statut == "terminée"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Paperclip className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={
                        uploadingFile || sending || demande?.statut == "terminée"
                      }
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="Tapez votre message ici..."
                    className="disabled:cursor-not-allowed flex-1 px-4 py-2 rounded-xl bg-white text-gray-900 border border-gray-200 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={
                      sending || uploadingFile || demande?.statut == "terminée"
                    }
                  />

                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold text-md transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSend}
                    disabled={
                      sending ||
                      uploadingFile ||
                      !input.trim() ||
                      demande?.statut == "terminée"
                    }
                  >
                    {sending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
