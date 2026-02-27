// pages/ProDiscussions.jsx - VERSION COMPLÈTE AVEC TESTS IA
import { useState, useEffect, useRef } from "react";
import {
  Send,
  Calendar,
  MapPin,
  Wrench,
  Zap,
  MessageCircle,
  AlertCircle,
  Clock,
  Paperclip,
  FileText,
  MoreVertical,
  FileDigit,
  DollarSign,
  X,
  Edit,
  Download,
  CheckCircle,
  Eye,
  Lock,
  Star,
  ArrowDown,
  User,
  ArrowLeft,
  Euro,
  Sparkles, // IMPORTANT: Ajoute Sparkles ici
  Bug, // Pour le debug
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSocket } from "../contexts/SocketContext";
import { useMessaging } from "@/hooks/useMessaging";
import api from "@/lib/api";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import AIConversationSuggestion from '@/components/AIConversationSuggestion';

export default function ProDiscussions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [notAssignedMe, setNotAssignedMe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  // États pour les modales et actions
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showRendezVousModal, setShowRendezVousModal] = useState(false);
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [loadingRendezVous, setLoadingRendezVous] = useState(false);
  const [loadingFacture, setLoadingFacture] = useState(false);
  const [loadingDevis, setLoadingDevis] = useState(false);
  const [loadingEditRendezVous, setLoadingEditRendezVous] = useState(false);
  const [loadingEditDevis, setLoadingEditDevis] = useState(false);

  // États pour les formulaires
  const [artisanDetails, setArtisanDetails] = useState(null);
  const [showEditRendezVousModal, setShowEditRendezVousModal] = useState(false);
  const [showEditDevisModal, setShowEditDevisModal] = useState(false);
  const [currentRendezVous, setCurrentRendezVous] = useState(null);
  const [currentDevis, setCurrentDevis] = useState(null);
  const [rendezVousDate, setRendezVousDate] = useState("");
  const [rendezVousHeure, setRendezVousHeure] = useState("");
  const [rendezVousNotes, setRendezVousNotes] = useState("");
  const [factureMontant, setFactureMontant] = useState("");
  const [factureFile, setFactureFile] = useState(null);
  const [devisMontant, setDevisMontant] = useState("");
  const [devisDescription, setDevisDescription] = useState("");
  const [devisFile, setDevisFile] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showMobileActionsMenu, setShowMobileActionsMenu] = useState(false);

  // États pour les tests IA
  const [showIATestPanel, setShowIATestPanel] = useState(false);
  const [iaTestResults, setIaTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const messagesContainerRef = useRef(null);
  const actionsMenuRef = useRef(null);
  const { isConnected, socket } = useSocket(); // Assure-toi que socket est exporté
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
  const [currentUserId, setCurrentUserId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setCurrentUserId(user?.id);
  }, [user]);

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
    const fetchArtisanDetails = async () => {
      try {
        if (id) {
          const response = await api.get(
            `/demande-actions/${id}/details-artisan`
          );
          setArtisanDetails(response.data);

          if (response.data.rdv) {
            const rdvDate = new Date(response.data.rdv);
            setCurrentRendezVous({
              date: rdvDate.toISOString().split("T")[0],
              heure: rdvDate.toTimeString().slice(0, 5),
              notes: response.data.rdvNotes || "",
            });
          }

          if (response.data.devis) {
            setCurrentDevis({
              montant: response.data.factureMontant || "",
              description: response.data.devis || "",
              file: null,
            });
          }
        }
      } catch (error) {
        console.error("Erreur chargement détails artisan:", error);
      }
    };

    fetchArtisanDetails();
  }, [id]);

  // Fonctions pour les actions
  const handleSubmitRendezVous = async (date, heure, notes) => {
    try {
      setLoadingRendezVous(true);
      const response = await api.post(`/demande-actions/${id}/proposer-rdv`, {
        date,
        heure,
        notes,
      });

      toast.success("Rendez-vous proposé avec succès");
      setShowRendezVousModal(false);

      const detailsResponse = await api.get(
        `/demande-actions/${id}/details-artisan`
      );
      setArtisanDetails(detailsResponse.data);
    } catch (error) {
      console.error("Erreur proposition rendez-vous:", error);
      toast.error("Erreur lors de la proposition du rendez-vous");
    } finally {
      setLoadingRendezVous(false);
    }
  };

  const handleConfirmerReceptionPaiement = async () => {
    try {
      const response = await api.post(
        `/demande-actions/${id}/confirmer-reception-paiement`
      );

      toast.success("Réception du paiement confirmée avec succès");

      const detailsResponse = await api.get(
        `/demande-actions/${id}/details-artisan`
      );
      setArtisanDetails(detailsResponse.data);
    } catch (error) {
      console.error("Erreur confirmation réception paiement:", error);
      toast.error("Erreur lors de la confirmation de la réception");
    }
  };

  const handleTerminerTravaux = async () => {
    try {
      const response = await api.post(
        `/demande-actions/${id}/terminer-travaux`
      );

      toast.success("Travaux marqués comme terminés avec succès");

      const detailsResponse = await api.get(
        `/demande-actions/${id}/details-artisan`
      );
      setArtisanDetails(detailsResponse.data);
    } catch (error) {
      console.error("Erreur fin des travaux:", error);
      toast.error("Erreur lors du marquage des travaux comme terminés");
    }
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
            className={`p-1 rounded ${star <= rating ? "bg-yellow-400" : "bg-gray-300"
              }`}
          >
            <Star
              className={`w-5 h-5 ${star <= rating ? "text-yellow-600" : "text-gray-500"
                }`}
              fill="currentColor"
            />
          </div>
        ))}
      </div>
    );
  };

  const handleSubmitDevis = async (montant, description, file) => {
    try {
      setLoadingDevis(true);
      const formData = new FormData();
      formData.append("montant", montant);
      formData.append("description", description);
      formData.append("devisFile", file);

      const response = await api.post(
        `/demande-actions/${id}/envoyer-devis`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Devis envoyé avec succès");
      setShowDevisModal(false);

      const detailsResponse = await api.get(
        `/demande-actions/${id}/details-artisan`
      );
      setArtisanDetails(detailsResponse.data);
    } catch (error) {
      console.error("Erreur envoi devis:", error);
      toast.error("Erreur lors de l'envoi du devis");
    } finally {
      setLoadingDevis(false);
    }
  };

  const handleSubmitFacture = async (montant, file) => {
    try {
      setLoadingFacture(true);
      const formData = new FormData();
      formData.append("montant", montant);
      formData.append("factureFile", file);

      const response = await api.post(
        `/demande-actions/${id}/envoyer-facture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Facture envoyée avec succès");
      setShowFactureModal(false);

      const detailsResponse = await api.get(
        `/demande-actions/${id}/details-artisan`
      );
      setArtisanDetails(detailsResponse.data);
    } catch (error) {
      console.error("Erreur envoi facture:", error);
      toast.error("Erreur lors de l'envoi de la facture");
    } finally {
      setLoadingFacture(false);
    }
  };

  const handleModifierRendezVous = async (date, heure, notes) => {
    try {
      setLoadingEditRendezVous(true);
      const response = await api.put(`/demande-actions/${id}/modifier-rdv`, {
        date,
        heure,
        notes,
      });

      toast.success("Rendez-vous modifié avec succès");
      setShowEditRendezVousModal(false);

      const detailsResponse = await api.get(
        `/demande-actions/${id}/details-artisan`
      );
      setArtisanDetails(detailsResponse.data);
    } catch (error) {
      console.error("Erreur modification rendez-vous:", error);
      toast.error("Erreur lors de la modification du rendez-vous");
    } finally {
      setLoadingEditRendezVous(false);
    }
  };

  const handleModifierDevis = async (montant, description, file) => {
    try {
      setLoadingEditDevis(true);
      const formData = new FormData();
      formData.append("montant", montant);
      formData.append("description", description);
      if (file) {
        formData.append("devisFile", file);
      }

      const response = await api.put(
        `/demande-actions/${id}/modifier-devis`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Devis modifié avec succès");
      setShowEditDevisModal(false);

      const detailsResponse = await api.get(
        `/demande-actions/${id}/details-artisan`
      );
      setArtisanDetails(detailsResponse.data);
    } catch (error) {
      console.error("Erreur modification devis:", error);
      toast.error("Erreur lors de la modification du devis");
    } finally {
      setLoadingEditDevis(false);
    }
  };

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

  // Écouter les suggestions IA en temps réel
  useEffect(() => {
    if (!socket) {
      console.log('⚠️ Socket non disponible');
      return;
    }

    console.log('🎧 Écoute des suggestions IA activée');

    const handleAISuggestion = (data) => {
      console.log('💡 SUGGESTION IA REÇUE:', data);

      toast.success('💡 Nouvelle suggestion IA disponible', {
        description: `Intention: ${data.analyse.intention.replace(/_/g, ' ')}`,
        duration: 10000,
        action: {
          label: 'Voir le message',
          onClick: () => {
            const messageElement = document.getElementById(`message-${data.messageId}`);
            if (messageElement) {
              messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Ajoute un highlight temporaire
              messageElement.classList.add('bg-yellow-50', 'transition-colors', 'duration-1000');
              setTimeout(() => {
                messageElement.classList.remove('bg-yellow-50');
              }, 2000);
            }
          }
        }
      });
    };

    socket.on('ai-suggestion', handleAISuggestion);

    return () => {
      console.log('👋 Arrêt de l\'écoute des suggestions IA');
      socket.off('ai-suggestion', handleAISuggestion);
    };
  }, [socket]);

  // Charger la demande
  useEffect(() => {
    const fetchDemande = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await api.get(`/demandes/${id}`);
          setDemande(response.data);

          console.log("📦 Données de la demande:", {
            id: response.data.id,
            createdById: response.data.createdById,
            artisanId: response.data.artisanId,
            userId: user?.id,
          });

          const isNotCreator = response.data.createdById !== user?.id;
          const isNotArtisan = response.data.artisanId !== user?.id;
          setNotAssignedMe(isNotCreator && isNotArtisan);

          console.log("🔍 Vérification d'accès:", {
            isCreator: response.data.createdById === user?.id,
            isArtisan: response.data.artisanId === user?.id,
            hasAccess: !(isNotCreator && isNotArtisan),
            notAssignedMe: isNotCreator && isNotArtisan
          });
        }
      } catch (error) {
        console.error("Erreur chargement demande:", error);
        toast.error("Erreur lors du chargement de la demande");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDemande();
    }
  }, [id, user?.id]);

  // Ajoute ce useEffect pour diagnostiquer les messages
  useEffect(() => {
    if (messages.length > 0) {
      console.log('📨 Tous les messages:', messages.map(m => ({
        id: m.id,
        type: m.type,
        expediteurType: m.expediteur?.userType,
        contenu: m.contenu.substring(0, 30)
      })));

      // Vérifie spécifiquement les messages clients
      // Remplace la ligne 470-473 par :
      const clientsMessages = messages.filter(m => {
        console.log('📝 Message:', {
          id: m.id,
          type: m.type,
          expediteurType: m.expediteur?.userType,
          contenu: m.contenu?.substring(0, 30)
        });
        return m.expediteur?.userType === 'CLIENT';
      });
      console.log('👤 Messages clients trouvés:', clientsMessages.length);

      if (clientsMessages.length === 0) {
        console.log('⚠️ Aucun message client trouvé - Vérifie que userType est bien "CLIENT"');
      }
    }
  }, [messages]);

  // ✅ FONCTION DE TEST IA COMPLÈTE
  const testIA = async () => {
    setIsTesting(true);
    setIaTestResults(null);

    try {
      const results = {
        etapes: [],
        success: true
      };

      // ÉTAPE 1: Vérifier la santé du service
      toast.info('🔍 Test 1/5: Vérification du service IA...');
      const healthCheck = await api.get('/ai-commercial/health');
      results.etapes.push({
        nom: 'Santé du service',
        success: true,
        data: healthCheck.data
      });
      console.log('✅ Santé IA:', healthCheck.data);

      // ÉTAPE 2: Vérifier la connexion socket
      results.etapes.push({
        nom: 'Connexion Socket',
        success: !!socket,
        data: { connecte: !!socket, id: socket?.id }
      });

      if (!socket) {
        toast.warning('⚠️ Socket non connecté - les notifications temps réel ne fonctionneront pas');
      }

      // ÉTAPE 3: Tester sur un message client
      const messageClient = messages.find(m => m.expediteur?.userType === 'CLIENT');

      if (messageClient) {
        toast.info(`🔍 Test 2/5: Analyse du message #${messageClient.id}...`);

        const suggestion = await api.get(`/ai-commercial/suggestion/${messageClient.id}`);
        results.etapes.push({
          nom: 'Récupération suggestion',
          success: true,
          data: suggestion.data
        });

        if (suggestion.data.intention !== 'ANALYSE_EN_COURS') {
          toast.success(`✅ Intention détectée: ${suggestion.data.intention}`);
        }
      } else {
        results.etapes.push({
          nom: 'Récupération suggestion',
          success: false,
          error: 'Aucun message client trouvé'
        });
        toast.warning('⚠️ Aucun message client dans cette conversation');
      }

      // ÉTAPE 4: Tester génération devis
      if (conversation) {
        toast.info('🔍 Test 3/5: Génération devis pré-rempli...');

        const devis = await api.get(`/ai-commercial/devis-pre-rempli/${conversation.id}`);
        results.etapes.push({
          nom: 'Génération devis',
          success: true,
          data: devis.data
        });

        if (devis.data.montantEstime) {
          toast.success(`💰 Devis estimé à ${devis.data.montantEstime}€`);
        }
      }

      // ÉTAPE 5: Tester génération relance
      if (conversation) {
        toast.info('🔍 Test 4/5: Génération relance...');

        const relance = await api.post(`/ai-commercial/generer-relance/${conversation.id}`, {
          type: 'J+2'
        });
        results.etapes.push({
          nom: 'Génération relance',
          success: true,
          data: relance.data
        });

        toast.success(`📧 Relance générée (${relance.data.type})`);
      }

      // ÉTAPE 6: Vérifier les événements socket
      results.etapes.push({
        nom: 'Test écoute événements',
        success: true,
        data: {
          enEcoute: !!socket?._events?.['ai-suggestion'],
          message: 'Place un message client pour voir apparaître les suggestions'
        }
      });

      setIaTestResults(results);
      toast.success('✅ Tests IA terminés!', {
        description: `${results.etapes.filter(e => e.success).length}/${results.etapes.length} étapes réussies`,
        action: {
          label: 'Voir détails',
          onClick: () => setShowIATestPanel(true)
        }
      });

    } catch (error) {
      console.error('❌ Erreur test IA:', error);

      const errorResults = {
        etapes: [{
          nom: 'Erreur',
          success: false,
          error: error.message
        }],
        success: false
      };

      setIaTestResults(errorResults);

      toast.error('❌ Erreur lors des tests IA', {
        description: error.response?.data?.error || error.message,
        duration: 10000
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Fonction pour envoyer un message de test en tant que client simulé
  const simulerMessageClient = async () => {
    const messagesTest = [
      "Bonjour, j'aimerais un devis pour la rénovation de ma salle de bain. C'est pour une surface de 8m2.",
      "J'ai une fuite d'eau urgente ! Pouvez-vous venir aujourd'hui ?",
      "Je suis disponible jeudi après-midi pour une visite, vous pouvez ?",
      "Quel type de carrelage recommandez-vous pour une terrasse ?",
      "Le devis me semble un peu élevé, pouvez-vous me faire une offre ?",
    ];

    const randomMessage = messagesTest[Math.floor(Math.random() * messagesTest.length)];

    try {
      toast.info('📝 Envoi d\'un message test...');

      // Simule l'envoi d'un message (à adapter selon ton API)
      await sendMessage(randomMessage);

      toast.success('✅ Message test envoyé!', {
        description: 'L\'IA va analyser ce message dans quelques secondes'
      });
    } catch (error) {
      toast.error('Erreur envoi message test');
    }
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
    return message.expediteurId === currentUserId;
  };

  const renderMessageContent = (message) => {
    if (
      message.expediteurId !== currentUserId &&
      conversation?.creatorId !== currentUserId
    ) {
      return null;
    }
    return message;
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
        <img
          src={user.avatar}
          alt={getSenderName(message)}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F0F8FF] text-[#556B2F] font-semibold text-xs">
        {getInitials(user)}
      </div>
    );
  };

  const handleProposerRendezVous = () => {
    setShowActionsMenu(false);
    setShowRendezVousModal(true);
  };

  const handleEnvoyerFacture = () => {
    setShowActionsMenu(false);
    setShowFactureModal(true);
  };

  const handleEnvoyerDevis = () => {
    setShowActionsMenu(false);
    setShowDevisModal(true);
  };

  const handleAfficherActions = () => {
    setShowActionsMenu(false);
    setShowActionsPanel(true);
  };

  const handleFileChange = (setFileFunction) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileFunction(file);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des données en cours..." />;
  }

  if (!demande) {
    return <div className="p-8 text-center">Demande non trouvée</div>;
  }

  if (notAssignedMe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-100 p-4">
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-2xl border-2 border-red-300 shadow-lg max-w-2xl">
          <div className="mb-6 p-8 bg-red-500 rounded-full">
            <img
              src="/unauthorized.gif"
              alt="Non assignée"
              className="w-100 h-100 object-cover rounded-full"
            />
          </div>
          <h3 className="text-4xl font-bold text-red-900 mb-4">
            Accès non autorisé
          </h3>
          <p className="text-red-700 text-center mb-2 text-lg">
            Cette demande a été assignée à un autre artisan
          </p>
          <p className="text-base text-red-600 mb-6">
            Vous n'avez plus accès à cette conversation
          </p>
          <div className="mt-4 flex items-center gap-2 text-red-700">
            <Lock className="w-5 h-5" />
            <span className="text-base font-medium">
              Conversation verrouillée
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FFFFFF]">
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-100px)]">
        {/* Côté gauche - Informations du projet */}
        <div className="w-full lg:w-1/2 lg:h-auto h-[680px] bg-white rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-sm border-b lg:border-b-0 lg:border-r border-[#D3D3D3] p-4 sm:p-1 lg:p-8 overflow-y-auto lg:mt-0 mt-0">
          <div className="overflow-y-auto max-w-2xl mx-auto">
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

            {/* Header avec badge */}
            <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#556B2F] to-[#6B8E23] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-[#8B4513]">
                    Demande #{demande.id}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {demande.contactNom} {demande.contactPrenom}
                  </p>
                </div>
              </div>

              <div className="lg:relative absolute right-0 top-0 flex flex-col items-start sm:items-end gap-2">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${demande.statut === "validée" ||
                    demande.statut === "acceptée"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : demande.statut === "refusée"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                >
                  {demande.statut || "En attente"}
                </span>
                {!isConnected && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-[#D3D3D3]">
                    Hors ligne
                  </span>
                )}
              </div>
            </div>

            {/* Métadonnées */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F0F8FF] rounded-xl p-3 border border-[#D3D3D3]">
                <div className="flex items-center gap-2 text-[#556B2F]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Date de la demande
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div className="bg-[#F0FFF0] rounded-xl p-3 border border-[#D3D3D3]">
                <div className="flex items-center gap-2 text-[#6B8E23]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Localisation</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                  {demande.lieuAdresseVille || "Non spécifiée"}
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="mb-6">
              <h3 className="text-sm sm:text-md font-semibold text-[#8B4513] mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#556B2F]" />
                Services demandés
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                {demande.metier && (
                  <div className="flex items-center gap-2 bg-[#F5F5DC] text-[#556B2F] border border-[#D3D3D3] px-3 py-2 rounded-lg text-sm">
                    <Wrench className="w-4 h-4" />
                    <span className="font-medium">
                      {demande.metier.libelle}
                    </span>
                  </div>
                )}
                {demande.service && (
                  <div className="flex items-center gap-2 bg-[#F0FFF0] text-[#6B8E23] border border-[#D3D3D3] px-3 py-2 rounded-lg text-sm">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">
                      {demande.service.libelle}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse complète */}
            <div className="mb-6">
              <h3 className="text-sm sm:text-md font-semibold text-[#8B4513] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8B4513]" />
                Adresse du projet
              </h3>
              <div className="bg-[#F8F8FF] rounded-lg p-4 border border-[#D3D3D3]">
                <p className="text-sm text-gray-900 font-medium mb-2">
                  {demande.lieuAdresse}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Ville</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {demande.lieuAdresseVille || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Code postal</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {demande.lieuAdresseCp || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm sm:text-md font-semibold text-[#8B4513] mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#556B2F]" />
                Description
              </h3>
              <div className="bg-[#F8F8FF] rounded-xl p-4 border border-[#D3D3D3]">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {demande.description}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm sm:text-md font-semibold text-[#8B4513] mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#6B8E23]" />
                Informations de contact
              </h3>
              <div className="bg-[#F8F8FF] rounded-xl p-4 border border-[#D3D3D3]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nom complet</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {demande.contactNom} {demande.contactPrenom}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {demande.contactTel}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-semibold text-gray-900 break-all">
                      {demande.contactEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Côté droit - Discussion (Desktop uniquement) */}
        <div className="hidden lg:flex w-1/2 flex-col bg-white">
          {/* Header discussion avec boutons de test */}
          <div className="border-b border-[#D3D3D3] px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#556B2F]" />
                <h2 className="text-xl font-bold text-[#8B4513]">
                  Discussion{" "}
                  {conversation && `(#${conversation.id.slice(0, 8)})`}
                </h2>
              </div>

              {/* ZONE DE TEST IA */}
              <div className="flex items-center gap-2">
                {/* Bouton Simuler Message Client */}
                <button
                  onClick={simulerMessageClient}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  title="Simuler un message client"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden md:inline">Test Message</span>
                </button>

                {/* Bouton Test IA */}
                <button
                  onClick={testIA}
                  disabled={isTesting}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${isTesting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  title="Tester l'assistant IA"
                >
                  {isTesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden md:inline">Test en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden md:inline">Test IA</span>
                    </>
                  )}
                </button>

                {/* Indicateur de connexion */}
                <div className="flex items-center gap-2 ml-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm text-gray-500 hidden md:inline">
                    {isConnected ? "En ligne" : "Hors ligne"}
                  </span>
                </div>
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
                {messages.map((message, index) => {
                  return (
                    <div
                      id={`message-${message.id}`}
                      key={message.id}
                      className={`flex gap-4 ${isCurrentUser(message) ? "justify-end" : ""
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
                        className={`max-w-[70%] ${isCurrentUser(message) ? "order-first" : ""
                          }`}
                      >
                        {!isCurrentUser(message) && (
                          <div className="text-xs font-medium text-[#8B4513] mb-1">
                            {getSenderName(message)}
                          </div>
                        )}

                        <div
                          className={`rounded-2xl p-4 ${isCurrentUser(message)
                            ? "bg-[#6B8E23] text-white rounded-br-none"
                            : "bg-[#F8F8FF] text-gray-900 rounded-bl-none border border-[#D3D3D3]"
                            }`}
                        >
                          {message.urlFichier && (
                            <div className="mb-2">
                              <a
                                href={message.urlFichier}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 text-sm underline ${isCurrentUser(message)
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

                          {/* Badge de debug pour voir le type d'utilisateur */}
                          {process.env.NODE_ENV === 'development' && (
                            <div className="mt-1 text-xs opacity-50">
                              {message.expediteur?.userType === 'CLIENT' ? '👤 Client' : '🔨 Artisan'}
                            </div>
                          )}

                          {/* Messages pour paiement direct */}
                          {message.evenementType === "PAIEMENT_CONFIRME_CLIENT" && (
                            <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                              <p className="text-sm font-medium mb-2">
                                Le client a confirmé le paiement
                              </p>
                              {artisanDetails && !artisanDetails.artisanConfirmeReception && (
                                <button
                                  onClick={handleConfirmerReceptionPaiement}
                                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                >
                                  Confirmer réception
                                </button>
                              )}
                            </div>
                          )}

                          {message.evenementType === "PAIEMENT_RECU_ARTISAN" && (
                            <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                              <p className="text-sm font-medium mb-2 text-green-600">
                                ✅ Paiement confirmé par les deux parties
                              </p>
                              <p className="text-sm">
                                Vous pouvez maintenant procéder aux travaux
                              </p>
                            </div>
                          )}

                          {message.evenementType === "AVIS_LAISSE" && (
                            <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                              <RatingStars
                                rating={extractRatingFromMessage(message.contenu)}
                              />
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-xs mt-1 flex items-center gap-1 ${isCurrentUser(message)
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
                  );
                })}

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

          {/* Zone de suggestion IA (au-dessus de l'input) */}
          {conversation && (
            <AIConversationSuggestion
              conversationId={conversation.id}
              messageCount={messages.length}
              onUseSuggestion={(suggestion) => {
                setInput(suggestion);
                // Optionnel : faire défiler vers le champ de saisie
                document.querySelector('input[type="text"]')?.focus();
              }}
            />
          )}
          {/* Zone d'envoi de message */}
          <div className="border-t border-[#D3D3D3] px-6 py-3 bg-[#F8F8FF]">
            <div className="flex gap-3 items-center">
              <div className="relative" ref={actionsMenuRef}>
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#D3D3D3] bg-white hover:bg-[#F0F8FF] transition-colors shadow-sm"
                >
                  <MoreVertical className="w-4 h-4 text-[#556B2F]" />
                </button>

                {showActionsMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-[#D3D3D3] z-10 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={handleProposerRendezVous}
                        className="flex items-center gap-3 w-full px-3 py-3 text-left text-sm text-gray-700 hover:bg-[#F0F8FF] hover:text-[#6B8E23] rounded-lg transition-colors duration-200"
                        disabled={artisanDetails && artisanDetails.rdv}
                      >
                        <Calendar className="w-4 h-4" />
                        {artisanDetails && artisanDetails.rdv ? (
                          <>
                            <span>rendez-vous deja proposé </span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </>
                        ) : (
                          <span>Proposer un rendez-vous</span>
                        )}
                      </button>

                      <button
                        onClick={handleEnvoyerDevis}
                        className="flex items-center gap-3 w-full px-3 py-3 text-left text-sm text-gray-700 hover:bg-[#F0FFF0] hover:text-[#6B8E23] rounded-lg transition-colors duration-200"
                        disabled={artisanDetails && artisanDetails.devisFileUrl}
                      >
                        <FileDigit className="w-4 h-4" />
                        {artisanDetails && artisanDetails.devisFileUrl ? (
                          <>
                            <span>Devis déjà envoyé</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </>
                        ) : (
                          <span>Envoyer un devis</span>
                        )}
                      </button>

                      <button
                        onClick={handleEnvoyerFacture}
                        className="flex items-center gap-3 w-full px-3 py-3 text-left text-sm text-gray-700 hover:bg-[#F8F8FF] hover:text-[#556B2F] rounded-lg transition-colors duration-200"
                        disabled={artisanDetails && artisanDetails.factureFileUrl}
                      >
                        <DollarSign className="w-4 h-4" />
                        {artisanDetails && artisanDetails.factureFileUrl ? (
                          <>
                            <span>Facture déjà envoyée</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </>
                        ) : (
                          <span>Envoyer une facture</span>
                        )}
                      </button>

                      {artisanDetails?.clientConfirmePaiement && !artisanDetails?.artisanConfirmeReception && (
                        <button
                          onClick={handleConfirmerReceptionPaiement}
                          className="flex items-center gap-3 w-full px-3 py-3 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Euro className="w-4 h-4" />
                          <span>Confirmer réception paiement</span>
                        </button>
                      )}

                      {artisanDetails?.artisanConfirmeReception && !artisanDetails?.travauxTermines && (
                        <button
                          onClick={handleTerminerTravaux}
                          className="flex items-center gap-3 w-full px-3 py-3 text-left text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                          disabled={artisanDetails?.travauxTermines}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {artisanDetails?.travauxTermines ? (
                            <>
                              <span>Travaux terminés</span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </>
                          ) : (
                            <span>Marquer travaux terminés</span>
                          )}
                        </button>
                      )}

                      <div className="border-t border-[#D3D3D3] my-2"></div>
                      <button
                        onClick={handleAfficherActions}
                        className="flex items-center gap-3 w-full px-3 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Afficher mes actions</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <label
                className={`flex items-center justify-center w-10 h-10 rounded-xl border border-[#D3D3D3] cursor-pointer bg-white shadow-sm ${uploadingFile ? "opacity-50 cursor-not-allowed" : "hover:bg-[#F0F8FF]"
                  }`}
              >
                <Paperclip className="w-4 h-4 text-[#556B2F]" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadingFile || sending || demande?.statut == "terminée" || notAssignedMe}
                />
              </label>

              <input
                type="text"
                placeholder="Tapez votre message ici..."
                className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-900 border border-[#D3D3D3] text-md focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent transition-all duration-200 shadow-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={sending || uploadingFile || artisanDetails?.recruited === false || demande?.statut == "terminée" || notAssignedMe}
              />

              <button
                className="bg-[#6B8E23] hover:bg-[#556B2F] text-white px-5 py-3 rounded-xl font-semibold text-md transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={sending || uploadingFile || !input.trim() || demande?.statut == "terminée" || notAssignedMe}
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

        {/* Panneau des résultats de test IA */}
        {showIATestPanel && iaTestResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto border border-[#D3D3D3]">
              <div className="flex items-center justify-between p-6 border-b border-[#D3D3D3] sticky top-0 bg-white rounded-t-xl">
                <h3 className="text-xl font-bold text-[#8B4513] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Résultats des tests IA
                </h3>
                <button
                  onClick={() => setShowIATestPanel(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {iaTestResults.etapes.map((etape, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{etape.nom}</h4>
                      {etape.success ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          ✓ Succès
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          ✗ Échec
                        </span>
                      )}
                    </div>

                    {etape.data && (
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(etape.data, null, 2)}
                      </pre>
                    )}

                    {etape.error && (
                      <p className="text-sm text-red-600 mt-2">{etape.error}</p>
                    )}
                  </div>
                ))}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">📋 Comment tester l'IA :</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>1️⃣ Utilise le bouton "Test Message" pour simuler un message client</li>
                    <li>2️⃣ Attends 2-3 secondes après l'envoi</li>
                    <li>3️⃣ Une notification devrait apparaître</li>
                    <li>4️⃣ Un bandeau "Suggestion IA" apparaîtra sous le message</li>
                    <li>5️⃣ Clique sur "Utiliser cette réponse" pour pré-remplir le champ</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowIATestPanel(false)}
                    className="px-4 py-2 bg-[#556B2F] text-white rounded-lg hover:bg-[#6B8E23] transition-colors"
                  >
                    Fermer
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