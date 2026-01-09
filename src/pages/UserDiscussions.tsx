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
  ArrowDown,
  ArrowLeft,
  Euro,
} from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSocket } from "../contexts/SocketContext";
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [loadingArtisanId, setLoadingArtisanId] = useState(null);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("espèces");
  const messagesContainerRef = useRef(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const actionsMenuRef = useRef(null);
  const navigate = useNavigate();
  const { isConnected } = useSocket();
  const {
    messages,
    conversation,
    loading: messagesLoading,
    sendMessage,
    sending,
    messagesEndRef,
    scrollToBottom,
    refreshMessages,
  } = useMessaging(id);

  useEffect(() => {
    if (!isConnected && autoRefresh) {
      const interval = setInterval(() => {
        refreshMessages();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isConnected, autoRefresh, refreshMessages]);

  const handleScroll = (e) => {
    const container = e.target;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    setShowScrollButton(!isAtBottom);
  };

  const handleScrollToBottom = () => {
    scrollToBottom();
    setShowScrollButton(false);
  };

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        if (id) {
          const response = await api.get(`/demandes/${id}`);
          setDemande(response.data);

          if (response.data.artisans) {
            setArtisans(response.data.artisans);
            // console.log("Artisans chargés:", response.data.artisans);
          }
        }
      } catch (error) {
        console.error("Erreur chargement artisans:", error);
      }
    };

    fetchArtisans();
  }, [id]);

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

    if (user.avatar) {
      return (
        <button
          onClick={() =>
            isCurrentUser(message) ? "" : navigate(`/professional/${user.id}`)
          }
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src={user.avatar}
            alt={getSenderName(message)}
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>
      );
    }

    return (
      <button
        onClick={() => navigate(`/professional/${user.id}`)}
        className="hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F0F8FF] text-[#556B2F] font-semibold text-xs">
          {getInitials(user)}
        </div>
      </button>
    );
  };

  const extractRatingFromMessage = (content) => {
    const match = content.match(/Note:\s*(\d+)\/5/);
    return match ? parseInt(match[1]) : 0;
  };

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
      setLoadingArtisanId(artisanId);
      const response = await api.post(`/demande-actions/${id}/signer-devis`, {
        artisanId,
      });

      toast.success("Devis signé avec succès ! L'artisan a été sélectionné.");

      const demandeResponse = await api.get(`/demandes/${id}`);
      setDemande(demandeResponse.data);
    } catch (error) {
      console.error("Erreur signature devis:", error);
      toast.error("Erreur lors de la signature du devis");
    } finally {
      setLoadingArtisanId(null);
    }
  };

  // NOUVEAU: Fonction pour confirmer le paiement (client)
  const handleConfirmerPaiementClient = async (
    artisanId,
    montant,
    modePaiement
  ) => {
    try {
      setLoadingArtisanId(artisanId);
      const response = await api.post(
        `/demande-actions/${id}/confirmer-paiement-client`,
        {
          artisanId,
          montant,
          modePaiement,
        }
      );

      toast.success(
        "Paiement confirmé ! En attente de confirmation de l'artisan"
      );
      setShowConfirmPaymentModal(false);
      setPaymentAmount("");
      setPaymentMethod("espèces");

      const demandeResponse = await api.get(`/demandes/${id}`);
      setDemande(demandeResponse.data);
    } catch (error) {
      console.error("Erreur confirmation paiement:", error);
      toast.error("Erreur lors de la confirmation du paiement");
    } finally {
      setLoadingArtisanId(null);
    }
  };

  // Fonction pour confirmer la fin des travaux
  const handleConfirmerTravauxTermines = async (confirmer) => {
    try {
      setLoadingArtisanId("confirming");
      const response = await api.post(
        `/demande-actions/${id}/confirmer-travaux-termines-client`,
        {
          confirmer,
        }
      );

      const message = confirmer
        ? "Travaux confirmés comme terminés"
        : "Confirmation refusée - Contactez l'artisan";
      toast.success(message);

      const demandeResponse = await api.get(`/demandes/${id}`);
      setDemande(demandeResponse.data);
    } catch (error) {
      console.error("Erreur confirmation travaux:", error);
      toast.error("Erreur lors de la confirmation des travaux");
    } finally {
      setLoadingArtisanId(null);
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

      const demandeResponse = await api.get(`/demandes/${id}`);
      setDemande(demandeResponse.data);
    } catch (error) {
      console.error("Erreur envoi avis:", error);
      toast.error("Erreur lors de l'envoi de l'avis");
    }
  };

  const hasDevis = (artisan) => {
    return artisan.devisFileUrl && artisan.devis;
  };

  const hasFacture = (artisan) => {
    return artisan.factureFileUrl && artisan.factureMontant;
  };

  const canReviewArtisan = (artisan) => {
    return artisan.recruited && artisan.clientConfirmeTravaux;
  };

  const canConfirmPayment = (artisan) => {
    return (
      artisan.recruited &&
      hasFacture(artisan) &&
      !artisan.clientConfirmePaiement
    );
  };

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        <div className="flex flex-col items-center justify-center">
          <img src="/loading.gif" className="h-32 w-32" alt="" />
          <span>Chargement des données en cours . . .</span>
        </div>
      </div>
    );
  }

  if (!demande) {
    return <div className="p-8 text-center">Demande non trouvée</div>;
  }

  const LoadingSpinnerSmall = () => (
    <div className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
  );

  return (
    <div className="min-h-full bg-[#FFFFFF]">
      <div className="flex flex-col lg:flex-row lg:h-screen">
        {/* Côté gauche - Informations du projet */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-sm border-b lg:border-b-0 lg:border-r border-[#D3D3D3] p-4 sm:p-6 lg:p-8 overflow-y-auto mt-16 lg:mt-20">
          <div className="max-w-2xl mx-auto">
            {/* Bouton de retour */}
            <div className="bg-white border-b border-[#D3D3D3] px-4 py-3 lg:px-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#8B4513] hover:text-[#6B8E23] transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
            </div>

            <div className="relative space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-[#8B4513]">
                    Demande #{demande.id}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {demande.contactNom} {demande.contactPrenom}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
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
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 pt-2">
                <h3 className="text-sm sm:text-md font-semibold text-[#8B4513]">
                  Date de la demande :
                </h3>
                <div className="flex items-center gap-2 text-sm sm:text-md font-semibold text-gray-900">
                  <Calendar className="w-4 h-4 text-[#556B2F] flex-shrink-0" />
                  <span>
                    {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm sm:text-md font-semibold text-[#8B4513] mb-3">
                  Service demandé
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {demande.metier && (
                    <div className="flex items-center gap-2 bg-[#F5F5DC] text-[#556B2F] border-[#D3D3D3] px-3 py-2 rounded-xl border text-sm">
                      <Wrench className="w-4 h-4 flex-shrink-0" />
                      <span className="font-semibold truncate">
                        {demande.metier.libelle}
                      </span>
                    </div>
                  )}
                  {demande.service && (
                    <div className="flex items-center gap-2 bg-[#F0FFF0] text-[#6B8E23] border-[#D3D3D3] px-3 py-2 rounded-xl border text-sm">
                      <Zap className="w-4 h-4 flex-shrink-0" />
                      <span className="font-semibold truncate">
                        {demande.service.libelle}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm sm:text-md font-semibold text-[#8B4513] mb-2">
                  Adresse du projet
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-900">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{demande.lieuAdresse}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 pl-0 sm:pl-6">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Ville
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">
                        {demande.lieuAdresseVille || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Code postal
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">
                        {demande.lieuAdresseCp || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#D3D3D3] my-4 sm:my-6"></div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#8B4513] mb-3">
                Description
              </h3>
              <div className="bg-[#F8F8FF] rounded-xl p-4 sm:p-6 border border-[#D3D3D3]">
                <p className="text-sm sm:text-md text-gray-700 leading-relaxed">
                  {demande.description}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-bold text-[#8B4513] mb-3">
                Vos informations
              </h3>
              <div className="bg-[#F8F8FF] rounded-xl p-4 sm:p-6 border border-[#D3D3D3]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Nom</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {demande.contactNom} {demande.contactPrenom}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Téléphone
                    </p>
                    <p className="font-semibold text-sm sm:text-base">
                      {demande.contactTel}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-sm sm:text-base break-all">
                      {demande.contactEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Artisans avec actions */}
            {artisans.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#8B4513] mb-4">
                  Artisans intéressés ({artisans.length})
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {artisans.map((artisan) => (
                    <div
                      key={artisan.userId}
                      className="bg-white border border-[#D3D3D3] rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() =>
                              navigate(`/professional/${artisan.userId}`)
                            }
                            className="text-left hover:opacity-80 transition-opacity w-full"
                          >
                            <h4 className="font-semibold text-[#556B2F] hover:text-[#6B8E23] transition-colors text-sm sm:text-base truncate">
                              {artisan.user.companyName ||
                                `${artisan.user.firstName} ${artisan.user.lastName}`}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              {artisan.user.phone}
                            </p>
                            {artisan.user.avatar && (
                              <div className="flex items-center gap-2 mt-2">
                                <img
                                  src={artisan.user.avatar}
                                  alt="Avatar"
                                  className="lg:w-8 lg:h-8 w-6 h-6 rounded-full object-cover flex-shrink-0"
                                />
                                <span className="text-xs text-[#6B8E23] font-medium">
                                  Consulter le profil professionnel
                                </span>
                              </div>
                            )}
                          </button>
                        </div>
                        <div
                          className="relative flex-shrink-0"
                          ref={actionsMenuRef}
                        >
                          <button
                            onClick={() => setShowActionsMenu(artisan.userId)}
                            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#D3D3D3] bg-white hover:bg-[#F8F8FF]"
                          >
                            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-[#556B2F]" />
                          </button>

                          {showActionsMenu === artisan.userId && (
                            <div className="absolute right-0 top-full mt-1 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-[#D3D3D3] z-10">
                              <div className="p-1 sm:p-2 space-y-1">
                                <button
                                  onClick={() => {
                                    setShowActionsMenu(false);
                                    navigate(`/professional/${artisan.userId}`);
                                  }}
                                  className="flex items-center gap-2 w-full px-2 sm:px-3 py-2 text-left text-xs sm:text-sm text-[#6B8E23] hover:bg-[#F0FFF0] rounded-md"
                                >
                                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Voir le profil
                                </button>

                                {hasDevis(artisan) &&
                                  artisan.recruited !== true && (
                                    <button
                                      onClick={() =>
                                        handleSignerDevis(artisan.userId)
                                      }
                                      className="flex items-center gap-2 w-full px-2 sm:px-3 py-2 text-left text-xs sm:text-sm text-green-600 hover:bg-green-50 rounded-md"
                                      disabled={artisan.recruited === true}
                                    >
                                      <FileSignature className="w-3 h-3 sm:w-4 sm:h-4" />
                                      {artisan.recruited === true ? (
                                        <>
                                          <span>Devis signé</span>
                                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                        </>
                                      ) : (
                                        <span>Signer le devis</span>
                                      )}
                                    </button>
                                  )}

                                {/* NOUVEAU: Bouton pour confirmer le paiement */}
                                {canConfirmPayment(artisan) && (
                                  <button
                                    onClick={() => {
                                      setSelectedArtisan(artisan);
                                      setShowConfirmPaymentModal(true);
                                      setShowActionsMenu(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-2 sm:px-3 py-2 text-left text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                                  >
                                    <Euro className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Confirmer paiement</span>
                                  </button>
                                )}

                                {artisan.recruited &&
                                  artisan.clientConfirmePaiement &&
                                  !artisan.artisanConfirmeReception && (
                                    <div className="px-2 py-1 text-xs text-blue-600">
                                      <CheckCircle className="w-3 h-3 inline mr-1" />
                                      Paiement confirmé (en attente artisan)
                                    </div>
                                  )}

                                {artisan.recruited &&
                                  artisan.artisanConfirmeReception && (
                                    <div className="px-2 py-1 text-xs text-green-600">
                                      <CheckCircle className="w-3 h-3 inline mr-1" />
                                      Paiement reçu
                                    </div>
                                  )}

                                {canReviewArtisan(artisan) && (
                                  <button
                                    onClick={() => handleNoterArtisan(artisan)}
                                    className="flex items-center gap-2 w-full px-2 sm:px-3 py-2 text-left text-xs sm:text-sm text-yellow-600 hover:bg-yellow-50 rounded-md"
                                  >
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Noter l'artisan</span>
                                  </button>
                                )}

                                {artisan.devisFileUrl && (
                                  <a
                                    href={artisan.devisFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full px-2 sm:px-3 py-2 text-left text-xs sm:text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                                  >
                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Voir le devis
                                  </a>
                                )}

                                {artisan.factureFileUrl && (
                                  <a
                                    href={artisan.factureFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full px-2 sm:px-3 py-2 text-left text-xs sm:text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                                  >
                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Voir la facture
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Statuts */}
                      <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
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
                        {artisan.clientConfirmePaiement && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Paiement confirmé
                          </span>
                        )}
                        {artisan.artisanConfirmeReception && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Paiement reçu
                          </span>
                        )}
                        {artisan.travauxTermines && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Travaux terminés
                          </span>
                        )}
                        {artisan.clientConfirmeTravaux && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Travaux validés
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

        {/* Bouton pour ouvrir la discussion sur mobile */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <button
            draggable
            onClick={() => setShowChatModal(true)}
            className="bg-[#6B8E23] hover:bg-[#556B2F] text-white p-4 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center w-16 h-16"
            title="Ouvrir la discussion"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Côté droit - Discussion (Desktop uniquement) */}
        <div className="hidden lg:flex w-1/2 flex-col bg-white mt-20">
          {/* Header discussion */}
          <div className="border-b border-[#D3D3D3] px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#556B2F]" />
                <h2 className="text-xl font-bold text-[#8B4513]">
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
            {showScrollButton && (
              <button
                onClick={handleScrollToBottom}
                className="fixed bottom-32 right-8 bg-[#6B8E23] hover:bg-[#556B2F] text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40 flex items-center justify-center"
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
                          <div className="w-0.5 h-full bg-[#D3D3D3] mt-2"></div>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] ${
                        isCurrentUser(message) ? "order-first" : ""
                      }`}
                    >
                      {!isCurrentUser(message) && (
                        <div className="text-xs font-medium text-[#8B4513] mb-1">
                          {getSenderName(message)}
                        </div>
                      )}

                      <div
                        className={`rounded-2xl p-4 ${
                          isCurrentUser(message)
                            ? "bg-[#6B8E23] text-white rounded-br-none"
                            : "bg-[#F8F8FF] text-gray-900 rounded-bl-none border border-[#D3D3D3]"
                        }`}
                      >
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
                                  : "text-[#556B2F]"
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

                        {/* NOUVEAU: Messages pour paiement direct */}
                        {message.evenementType ===
                          "PAIEMENT_CONFIRME_CLIENT" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-medium mb-2">
                              Client a confirmé le paiement
                            </p>
                            <p className="text-sm">
                              En attente de confirmation de l'artisan...
                            </p>
                          </div>
                        )}

                        {message.evenementType === "PAIEMENT_RECU_ARTISAN" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-medium mb-2 text-green-600">
                              ✅ Paiement confirmé par les deux parties
                            </p>
                            <p className="text-sm">
                              L'artisan peut maintenant procéder aux travaux
                            </p>
                          </div>
                        )}

                        {message.evenementType === "PROPOSITION_DEVIS" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-medium mb-2">
                              Nouveau devis reçu
                            </p>
                            {artisans.find(
                              (a) => a.userId === message.expediteurId
                            )?.devisFileUrl != null ||
                            artisans.find(
                              (a) => a.userId === message.expediteurId
                            )?.devis != null ? (
                              <div className="flex gap-2">
                               
                                {artisans.find(
                                  (a) => a.userId === message.expediteurId
                                )?.recruited !== true && (
                                  <button
                                    onClick={() => {
                                      const artisan = artisans.find(
                                        (a) => a.userId === message.expediteurId
                                      );
                                      if (artisan)
                                        handleSignerDevis(artisan.userId);
                                    }}
                                    disabled={
                                      loadingArtisanId ===
                                        message.expediteurId ||
                                      demande?.statut === "terminée"
                                    }
                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                  >
                                    {loadingArtisanId ===
                                    message.expediteurId ? (
                                      <>
                                        <LoadingSpinnerSmall />
                                        <span>Signature...</span>
                                      </>
                                    ) : (
                                      "Signer"
                                    )}
                                  </button>
                                )}
                                {artisans.find(
                                  (a) => a.userId === message.expediteurId
                                )?.recruited === true && (
                                  <span className="flex gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded">
                                    déjà signé{" "}
                                    <CheckCircle className="w-4 h-4" />
                                  </span>
                                )}
                                {demande?.statut !== "terminée" &&
                                  !artisans.find(
                                    (a) => a.userId === message.expediteurId
                                  )?.recruited && (
                                    <button className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                                      Refuser
                                    </button>
                                  )}
                                {artisans.find(
                                  (a) => a.userId === message.expediteurId
                                )?.recruited && (
                                  <span className="flex gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded">
                                    déjà signé{" "}
                                    <CheckCircle className="w-4 h-4" />
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <span className="flex gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded">
                                  déjà signé <CheckCircle className="w-4 h-4" />
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {message.evenementType === "TRAVAUX_TERMINES" && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-medium mb-2">
                              L'artisan a marqué les travaux comme terminés.
                            </p>
                            <div className="flex gap-2">
                              {demande.statut != "terminée" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleConfirmerTravauxTermines(true)
                                    }
                                    disabled={loadingArtisanId === "confirming"}
                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                  >
                                    {loadingArtisanId === "confirming" ? (
                                      <>
                                        <LoadingSpinnerSmall />
                                        <span>Confirmation...</span>
                                      </>
                                    ) : (
                                      "Confirmer"
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleConfirmerTravauxTermines(false)
                                    }
                                    disabled={loadingArtisanId === "confirming"}
                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    Signaler problème
                                  </button>
                                </>
                              ) : (
                                <span className="flex gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded">
                                  accepté <CheckCircle className="w-4 h-4" />
                                </span>
                              )}
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
                        {renderAvatar(message)}
                        {index < messages.length - 1 && (
                          <div className="w-0.5 h-full bg-[#D3D3D3] mt-2"></div>
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

                <div ref={messagesEndRef} />

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
          <div className="border-t border-[#D3D3D3] px-6 py-3 bg-[#F8F8FF]">
            <div className="flex gap-3">
              <label
                className={`flex items-center justify-center px-4 py-2 rounded-xl border border-[#D3D3D3] cursor-pointer ${
                  uploadingFile
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#F0F8FF]"
                }`}
              >
                <Paperclip className="w-4 h-4 text-[#556B2F]" />
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
                className="flex-1 px-4 py-2 rounded-xl bg-white text-gray-900 border border-[#D3D3D3] text-md focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent transition-all duration-200"
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
                className="bg-[#6B8E23] hover:bg-[#556B2F] text-white px-5 py-2 rounded-xl font-semibold text-md transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Modale de chat pour mobile */}
        {showChatModal && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
            <div className="fixed inset-0 flex flex-col bg-white">
              {/* Header modale */}
              <div className="border-b border-[#D3D3D3] px-4 py-3 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-[#556B2F]" />
                  <h2 className="text-xl font-bold text-[#8B4513]">
                    Discussion{" "}
                    {conversation && `(#${conversation.id.slice(0, 8)})`}
                  </h2>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 scroll-smooth"
                ref={messagesContainerRef}
                onScroll={handleScroll}
              >
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
                            {renderAvatar(message)}
                            {index < messages.length - 1 && (
                              <div className="w-0.5 h-full bg-[#D3D3D3] mt-2"></div>
                            )}
                          </div>
                        )}

                        <div
                          className={`max-w-[70%] ${
                            isCurrentUser(message) ? "order-first" : ""
                          }`}
                        >
                          {!isCurrentUser(message) && (
                            <div className="text-xs font-medium text-[#8B4513] mb-1">
                              {getSenderName(message)}
                            </div>
                          )}

                          <div
                            className={`rounded-2xl p-4 ${
                              isCurrentUser(message)
                                ? "bg-[#6B8E23] text-white rounded-br-none"
                                : "bg-[#F8F8FF] text-gray-900 rounded-bl-none border border-[#D3D3D3]"
                            }`}
                          >
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
                                      : "text-[#556B2F]"
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

                            {/* Messages système pour mobile */}
                            {message.evenementType ===
                              "PAIEMENT_CONFIRME_CLIENT" && (
                              <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                                <p className="text-sm font-medium mb-2">
                                  Client a confirmé le paiement
                                </p>
                                <p className="text-sm">
                                  En attente de confirmation de l'artisan...
                                </p>
                              </div>
                            )}

                            {message.evenementType ===
                              "PAIEMENT_RECU_ARTISAN" && (
                              <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                                <p className="text-sm font-medium mb-2 text-green-600">
                                  ✅ Paiement confirmé par les deux parties
                                </p>
                              </div>
                            )}

                            {message.evenementType === "TRAVAUX_TERMINES" && (
                              <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                                <p className="text-sm font-medium mb-2">
                                  L'artisan a marqué les travaux comme terminés.
                                </p>
                                <div className="flex gap-2">
                                  {demande.statut != "terminée" ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleConfirmerTravauxTermines(true)
                                        }
                                        disabled={
                                          loadingArtisanId === "confirming"
                                        }
                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                      >
                                        {loadingArtisanId === "confirming" ? (
                                          <>
                                            <LoadingSpinnerSmall />
                                            <span>Confirmation...</span>
                                          </>
                                        ) : (
                                          "Confirmer"
                                        )}
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleConfirmerTravauxTermines(false)
                                        }
                                        disabled={
                                          loadingArtisanId === "confirming"
                                        }
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        Signaler problème
                                      </button>
                                    </>
                                  ) : (
                                    <span className="flex gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded">
                                      accepté{" "}
                                      <CheckCircle className="w-4 h-4" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {isCurrentUser(message) && (
                          <div className="flex flex-col items-center">
                            {renderAvatar(message)}
                            {index < messages.length - 1 && (
                              <div className="w-0.5 h-full bg-[#D3D3D3] mt-2"></div>
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

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Zone d'envoi de message pour mobile */}
              <div className="border-t border-[#D3D3D3] px-4 py-3 bg-[#F8F8FF]">
                <div className="flex gap-3">
                  <label
                    className={`flex items-center justify-center px-4 py-2 rounded-xl border border-[#D3D3D3] cursor-pointer ${
                      uploadingFile
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#F0F8FF]"
                    }`}
                  >
                    <Paperclip className="w-4 h-4 text-[#556B2F]" />
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
                    className="flex-1 px-4 py-2 rounded-xl bg-white text-gray-900 border border-[#D3D3D3] text-sm focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent transition-all duration-200"
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
                    className="bg-[#6B8E23] hover:bg-[#556B2F] text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* NOUVEAU: Modale de confirmation de paiement */}
      {showConfirmPaymentModal && selectedArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 border border-[#D3D3D3]">
            <div className="flex items-center justify-between p-6 border-b border-[#D3D3D3]">
              <h3 className="text-lg font-bold text-[#8B4513]">
                Confirmer le paiement
              </h3>
              <button
                onClick={() => {
                  setShowConfirmPaymentModal(false);
                  setPaymentAmount("");
                  setPaymentMethod("espèces");
                }}
                disabled={loadingArtisanId === selectedArtisan.userId}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <Euro className="w-12 h-12 text-[#556B2F] mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-[#8B4513]">
                  Confirmation de paiement direct
                </h4>
                <p className="text-gray-600 mt-2">
                  Confirmez que vous avez effectué le paiement directement à
                  l'artisan.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">
                    Montant payé (€) *
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D3D3D3] rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F]"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">
                    Mode de paiement *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D3D3D3] rounded-lg focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F]"
                  >
                    <option value="espèces">Espèces</option>
                    <option value="virement">Virement bancaire</option>
                    <option value="lydia">Lydia</option>
                    <option value="paypal">PayPal</option>
                    <option value="chèque">Chèque</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Cette confirmation indique que vous avez effectué le
                    paiement directement à l'artisan. L'artisan devra confirmer
                    à son tour la réception du paiement.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => {
                    setShowConfirmPaymentModal(false);
                    setPaymentAmount("");
                    setPaymentMethod("espèces");
                  }}
                  disabled={loadingArtisanId === selectedArtisan.userId}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() =>
                    handleConfirmerPaiementClient(
                      selectedArtisan.userId,
                      paymentAmount,
                      paymentMethod
                    )
                  }
                  disabled={
                    !paymentAmount ||
                    loadingArtisanId === selectedArtisan.userId
                  }
                  className="px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#556B2F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loadingArtisanId === selectedArtisan.userId ? (
                    <>
                      <LoadingSpinnerSmall />
                      <span>Confirmation...</span>
                    </>
                  ) : (
                    "Confirmer le paiement"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale de notation (inchangée) */}
      {showReviewModal && reviewArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 border border-[#D3D3D3]">
            <div className="flex items-center justify-between p-6 border-b border-[#D3D3D3]">
              <h3 className="text-lg font-bold text-[#8B4513]">
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
                <h4 className="text-lg font-semibold text-[#8B4513]">
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
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-3">
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
                            : "bg-[#F8F8FF] text-gray-400 hover:bg-[#F0F8FF] border border-[#D3D3D3]"
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

                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">
                    Votre avis (optionnel)
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-[#D3D3D3] rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Partagez votre expérience avec cet artisan..."
                  />
                </div>

                <div className="bg-[#F0F8FF] border border-[#D3D3D3] rounded-lg p-3">
                  <p className="text-sm text-[#556B2F]">
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
