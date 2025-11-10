// pages/UserDiscussions.jsx
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
  MoreVertical,
  CreditCard,
  FileSignature,
  X,
  Star,
  ThumbsUp,
  Lock,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSocket } from "@/Contexts/SocketContext";
import { useMessaging } from "@/hooks/useMessaging";
import api from "@/lib/api";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

export default function UserDiscussions() {
  const { id } = useParams();
  const location = useLocation();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [artisans, setArtisans] = useState([]);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewArtisan, setReviewArtisan] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const actionsMenuRef = useRef(null);

  const isConnected = useSocket();
  const {
    messages,
    conversation,
    loading: messagesLoading,
    sendMessage,
    sending,
  } = useMessaging(id);

  // Charger les artisans et leurs détails
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        if (id) {
          const response = await api.get(`/demandes/${id}`);
          setDemande(response.data);

          // Extraire les artisans de la réponse
          if (response.data.artisans) {
            setArtisans(response.data.artisans);
          }
        }
      } catch (error) {
        console.error("Erreur chargement artisans:", error);
      }
    };

    fetchArtisans();
  }, [id]);

  // Fermer le menu d'actions en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target)
      ) {
        setShowActionsMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  // Dans UserDiscussions.jsx, ajoutez cette fonction
  const handleConfirmerTravauxTermines = async (confirmer) => {
    try {
      const response = await api.post(
        `/demande-actions/${id}/confirmer-travaux-termines`,
        {
          confirmer,
        }
      );

      const message = confirmer
        ? "Travaux confirmés comme terminés"
        : "Confirmation refusée - Contactez l'artisan";
      toast.success(message);

      // Recharger les données
      const demandeResponse = await api.get(`/demandes/${id}`);
      setDemande(demandeResponse.data);
    } catch (error) {
      console.error("Erreur confirmation travaux:", error);
      toast.error("Erreur lors de la confirmation des travaux");
    }
  };
  // Charger la demande
  useEffect(() => {
    const fetchDemande = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await api.get(`/demandes/${id}`);
          setDemande(response.data);
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
    return (
      message.expediteur?.userType === "user" ||
      message.expediteurId === demande?.createdById
    );
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

  // Fonction pour signer un devis
  const handleSignerDevis = async (artisanId) => {
    try {
      const response = await api.post(`/demande-actions/${id}/signer-devis`, {
        artisanId,
      });

      toast.success("Devis signé avec succès ! L'artisan a été sélectionné.");

      // Recharger les données
      const demandeResponse = await api.get(`/demandes/${id}`);
      setDemande(demandeResponse.data);
    } catch (error) {
      console.error("Erreur signature devis:", error);
      toast.error("Erreur lors de la signature du devis");
    }
  };

  // Fonction pour payer une facture
  const handlePayerFacture = async (artisanId) => {
    try {
      setSelectedArtisan(artisanId);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Erreur préparation paiement:", error);
      toast.error("Erreur lors de la préparation du paiement");
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const response = await api.post(`/demande-actions/${id}/payer-facture`, {
        artisanId: selectedArtisan,
      });

      toast.success("Paiement effectué avec succès !");
      setShowPaymentModal(false);
      setSelectedArtisan(null);

      // Recharger les données
      const demandeResponse = await api.get(`/demandes/${id}`);
      setDemande(demandeResponse.data);
    } catch (error) {
      console.error("Erreur paiement:", error);
      toast.error("Erreur lors du paiement");
    }
  };

  // Fonction pour noter un artisan
  const handleNoterArtisan = (artisan) => {
    setReviewArtisan(artisan);
    setReviewRating(0);
    setReviewComment("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    try {
      if (reviewRating === 0) {
        toast.error("Veuillez sélectionner une note");
        return;
      }

      const reviewData = {
        userId: reviewArtisan.userId,
        rating: reviewRating,
        comment: reviewComment,
        demandeId: parseInt(id),
        serviceId: demande.serviceId ? demande.serviceId : null,
      };

      const response = await api.post("/reviews", reviewData);

      toast.success("Avis envoyé avec succès !");
      setShowReviewModal(false);
      setReviewArtisan(null);
      setReviewRating(0);
      setReviewComment("");

      // Recharger les données pour afficher la nouvelle review
      const demandeResponse = await api.get(`/demandes/${id}`);
      setDemande(demandeResponse.data);
    } catch (error) {
      console.error("Erreur envoi avis:", error);
      toast.error("Erreur lors de l'envoi de l'avis");
    }
  };

  // Vérifier si un artisan a envoyé un devis
  const hasDevis = (artisan) => {
    return artisan.devisFileUrl && artisan.devis;
  };

  // Vérifier si un artisan a envoyé une facture
  const hasFacture = (artisan) => {
    return artisan.factureFileUrl && artisan.factureMontant;
  };

  // Vérifier si un artisan peut être noté (travaux terminés)
  const canReviewArtisan = (artisan) => {
    return artisan.recruited && artisan.factureStatus === "validee";
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des données en cours..." />;
  }

  if (!demande) {
    return <div className="p-8 text-center">Demande non trouvée</div>;
  }

  return (
    <div className="min-h-full">
      <div className="flex h-[calc(100vh-100px)] mt-20">
        {/* Côté gauche - Informations du projet */}
        <div className="w-1/2 bg-white rounded-lg shadow-sm border-r border-gray-200 p-8 overflow-y-auto">
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
                    demande.statut === "validée" ||
                    demande.statut === "assignée"
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
                  Service demandé
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Vos informations
              </h3>
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

            {/* Artisans avec actions */}
            {artisans.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Artisans intéressés
                </h3>
                <div className="space-y-4">
                  {artisans.map((artisan) => (
                    <div
                      key={artisan.userId}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {artisan.user.companyName ||
                              `${artisan.user.firstName} ${artisan.user.lastName}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {artisan.user.phone}
                          </p>
                        </div>
                        <div className="relative" ref={actionsMenuRef}>
                          <button
                            onClick={() => setShowActionsMenu(artisan.userId)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>

                          {showActionsMenu === artisan.userId && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <div className="p-2">
                                {hasDevis(artisan) && !artisan.recruited && (
                                  <button
                                    onClick={() =>
                                      handleSignerDevis(artisan.userId)
                                    }
                                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 rounded-md"
                                  >
                                    <FileSignature className="w-4 h-4" />
                                    Signer le devis
                                  </button>
                                )}
                                {hasFacture(artisan) &&
                                  artisan.factureStatus === "en_attente" && (
                                    <button
                                      onClick={() =>
                                        handlePayerFacture(artisan.userId)
                                      }
                                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                                    >
                                      <CreditCard className="w-4 h-4" />
                                      Payer la facture
                                    </button>
                                  )}
                                {canReviewArtisan(artisan) && (
                                  <button
                                    onClick={() => handleNoterArtisan(artisan)}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 rounded-md"
                                  >
                                    <Star className="w-4 h-4" />
                                    Noter l'artisan
                                  </button>
                                )}
                                {artisan.devisFileUrl && (
                                  <a
                                    href={artisan.devisFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Voir le devis
                                  </a>
                                )}
                                {artisan.factureFileUrl && (
                                  <a
                                    href={artisan.factureFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Voir la facture
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Statuts */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {artisan?.recruited && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Sélectionné
                          </span>
                        )}
                        {hasDevis(artisan) && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Devis envoyé
                          </span>
                        )}
                        {hasFacture(artisan) && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              artisan.factureStatus === "validee"
                                ? "bg-green-100 text-green-800"
                                : artisan.factureStatus === "refusee"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            Facture{" "}
                            {artisan.factureStatus === "validee"
                              ? "payée"
                              : artisan.factureStatus === "refusee"
                              ? "refusée"
                              : "en attente"}
                          </span>
                        )}
                        {canReviewArtisan(artisan) && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            À noter
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Côté droit - Discussion */}
        <div className="w-1/2 flex flex-col bg-white">
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
          <div className="flex-1 overflow-y-auto p-6">
            {messagesLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner text="Chargement des messages..." />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      isCurrentUser(message) ? "justify-end" : ""
                    }`}
                  >
                    {!isCurrentUser(message) && (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
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
                      {/* Nom de l'expéditeur pour les messages des autres */}
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
                        {/* Fichier joint */}
                        {message.urlFichier && (
                          <div className="mb-2">
                            <a
                              href={message.urlFichier}
                              target="_blank"
                              download={message.nomFichier}
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
                        {/* Actions pour les messages système de devis/facture */}
                        {message.evenementType === "PROPOSITION_DEVIS" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-medium mb-2">
                              Nouveau devis reçu
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const artisan = artisans.find(
                                    (a) => a.userId === message.expediteurId
                                  );
                                  if (artisan)
                                    handleSignerDevis(artisan.userId);
                                }}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                              >
                                Signer
                              </button>
                              <button className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                                Refuser
                              </button>
                            </div>
                          </div>
                        )}
                        {message.evenementType === "FACTURE_ENVOYEE" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            {artisans.find(
                              (a) => a.userId === message.expediteurId
                            ).factureStatus != "validee" ? (
                              <>
                                <p className="text-sm font-medium mb-2">
                                  Facture reçue
                                </p>
                                <button
                                  onClick={() => {
                                    const artisan = artisans.find(
                                      (a) => a.userId === message.expediteurId
                                    );
                                    if (artisan)
                                      handlePayerFacture(artisan.userId);
                                  }}
                                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                >
                                  Payer maintenant
                                </button>
                              </>
                            ) : (
                              <p className="text-sm font-medium mb-2 bg-green-500 p-4 text-white rounded">
                                Facture envoyer
                              </p>
                            )}
                          </div>
                        )}

                        {message.evenementType === "TRAVAUX_TERMINES" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-medium mb-2">
                              L'artisan a marqué les travaux comme terminés.
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleConfirmerTravauxTermines(true)
                                }
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                              >
                                Confirmer
                              </button>
                              <button
                                onClick={() =>
                                  handleConfirmerTravauxTermines(false)
                                }
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                              >
                                Refuser
                              </button>
                            </div>
                          </div>
                        )}

                        {message.evenementType === "AVIS_LAISSE" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-medium mb-2">
                              Avis déposé
                            </p>
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
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
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
              {/* Bouton d'upload de fichier */}
              <label
                className={`flex items-center justify-center px-4 py-2 rounded-xl border border-gray-300 cursor-pointer ${
                  uploadingFile
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadingFile || sending}
                />
              </label>

              <input
                type="text"
                placeholder="Tapez votre message ici..."
                className="flex-1 px-4 py-2 rounded-xl bg-white text-gray-900 border border-gray-200 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
      </div>

      {/* Modale de paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Paiement de la facture
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Simulation de paiement Stripe
                </h4>
                <p className="text-gray-600 mt-2">
                  Cette démonstration simule un paiement sécurisé via Stripe.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Montant à payer:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {artisans.find((a) => a.userId === selectedArtisan)
                      ?.factureMontant || 0}
                    €
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Artisan:</span>
                  <span className="text-sm text-gray-900">
                    {artisans.find((a) => a.userId === selectedArtisan)?.user
                      .companyName ||
                      artisans.find((a) => a.userId === selectedArtisan)?.user
                        .firstName +
                        " " +
                        artisans.find((a) => a.userId === selectedArtisan)?.user
                          .lastName}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 text-center">
                    ⚠️ Ceci est une simulation. Aucun vrai paiement ne sera
                    effectué.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Simuler le paiement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale de notation */}
      {showReviewModal && reviewArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Noter l'artisan
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-900">
                  {reviewArtisan.user.companyName ||
                    `${reviewArtisan.user.firstName} ${reviewArtisan.user.lastName}`}
                </h4>
                {demande.service && (
                  <p className="text-gray-600 mt-1">
                    Service: {demande.service.libelle}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {/* Notation par étoiles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Votre note *
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`p-2 rounded-lg transition-all ${
                          star <= reviewRating
                            ? "bg-yellow-100 text-yellow-500"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {reviewRating === 0
                      ? "Sélectionnez une note"
                      : reviewRating === 1
                      ? "Très mauvais"
                      : reviewRating === 2
                      ? "Mauvais"
                      : reviewRating === 3
                      ? "Moyen"
                      : reviewRating === 4
                      ? "Bon"
                      : "Excellent"}
                  </p>
                </div>

                {/* Commentaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre avis (optionnel)
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Partagez votre expérience avec cet artisan..."
                  />
                </div>

                {/* Informations sur ce qui sera noté */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note concernera :</strong>
                    <br />• L'artisan{" "}
                    {reviewArtisan.user.companyName ||
                      `${reviewArtisan.user.firstName} ${reviewArtisan.user.lastName}`}
                    {demande.service && (
                      <>
                        <br />• Le service "{demande.service.libelle}"
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewRating === 0}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Envoyer l'avis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
