// pages/ProDiscussions.jsx
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
  FileDigit,
  DollarSign,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {useSocket} from "@/Contexts/SocketContext";
import { useMessaging } from "@/hooks/useMessaging";
import api from "@/lib/api";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

export default function ProDiscussions({
  artisanView,
}: { artisanView?: boolean } = {}) {
  const { id } = useParams();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  // États pour les modales et actions
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showRendezVousModal, setShowRendezVousModal] = useState(false);
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [showDevisModal, setShowDevisModal] = useState(false);


  // États pour les formulaires
  const [rendezVousDate, setRendezVousDate] = useState("");
  const [rendezVousHeure, setRendezVousHeure] = useState("");
  const [rendezVousNotes, setRendezVousNotes] = useState("");
  const [factureMontant, setFactureMontant] = useState("");
  const [factureFile, setFactureFile] = useState(null);
  const [devisMontant, setDevisMontant] = useState("");
  const [devisDescription, setDevisDescription] = useState("");
  const [devisFile, setDevisFile] = useState(null);

  const actionsMenuRef = useRef(null);

  const { socket, isConnected } = useSocket();
  const {
    messages,
    conversation,
    loading: messagesLoading,
    sendMessage,
    sending,
  } = useMessaging(id);

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

      // Upload du fichier
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await api.post("/upload/message-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Envoyer le message avec le fichier
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
    return message.expediteur?.userType === "PRESTATAIRE";
  };

  // Handlers pour les actions
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


  // Soumission des formulaires (simulé)
  const handleSubmitRendezVous = () => {
    // Simulation d'envoi
    toast.success("Rendez-vous proposé avec succès");
    setShowRendezVousModal(false);
    // Réinitialiser le formulaire
    setRendezVousDate("");
    setRendezVousHeure("");
    setRendezVousNotes("");
  };

  const handleSubmitFacture = () => {
    // Simulation d'envoi
    toast.success("Facture envoyée avec succès");
    setShowFactureModal(false);
    // Réinitialiser le formulaire
    setFactureMontant("");
    setFactureFile(null);
  };

  const handleSubmitDevis = () => {
    // Simulation d'envoi
    toast.success("Devis envoyé avec succès");
    setShowDevisModal(false);
    // Réinitialiser le formulaire
    setDevisMontant("");
    setDevisDescription("");
    setDevisFile(null);
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

  return (
    <div className="min-h-full">
      <div className="flex h-[calc(100vh-100px)]">
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
                    demande.statut === "acceptée"
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
              </div>
            )}
          </div>

          {/* Zone d'envoi de message avec bouton d'actions */}
          <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
            <div className="flex gap-3 items-center">
              {/* Bouton d'actions */}
              <div className="relative" ref={actionsMenuRef}>
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="flex items-center justify-center px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>

                {/* Menu déroulant des actions */}
                {showActionsMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                    <div className="p-2">
                      <button
                        onClick={handleProposerRendezVous}
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Proposer un rendez-vous</span>
                      </button>

                      <button
                        onClick={handleEnvoyerDevis}
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                      >
                        <FileDigit className="w-4 h-4" />
                        <span>Envoyer un devis</span>
                      </button>

                      <button
                        onClick={handleEnvoyerFacture}
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Envoyer une facture</span>
                      </button>

                      <div className="border-t border-gray-200 my-1"></div>
                    </div>
                  </div>
                )}
              </div>

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
                disabled={sending || uploadingFile}
              />

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold text-md transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={sending || uploadingFile || !input.trim()}
              >
                {sending ? (
                  <LoadingSpinner size="small" />
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

      {/* Modale Rendez-vous */}
      {showRendezVousModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Proposer un rendez-vous
              </h3>
              <button
                onClick={() => setShowRendezVousModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date du rendez-vous
                  </label>
                  <input
                    type="date"
                    value={rendezVousDate}
                    onChange={(e) => setRendezVousDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure du rendez-vous
                  </label>
                  <input
                    type="time"
                    value={rendezVousHeure}
                    onChange={(e) => setRendezVousHeure(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes supplémentaires (optionnel)
                  </label>
                  <textarea
                    value={rendezVousNotes}
                    onChange={(e) => setRendezVousNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Informations complémentaires sur le rendez-vous..."
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowRendezVousModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitRendezVous}
                  disabled={!rendezVousDate || !rendezVousHeure}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Proposer le rendez-vous
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale Facture */}
      {showFactureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Envoyer une facture
              </h3>
              <button
                onClick={() => setShowFactureModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant de la facture (€)
                  </label>
                  <input
                    type="number"
                    value={factureMontant}
                    onChange={(e) => setFactureMontant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier de facture (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange(setFactureFile)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {factureFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {factureFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowFactureModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitFacture}
                  disabled={!factureMontant || !factureFile}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Envoyer la facture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale Devis */}
      {showDevisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Envoyer un devis
              </h3>
              <button
                onClick={() => setShowDevisModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant du devis (€)
                  </label>
                  <input
                    type="number"
                    value={devisMontant}
                    onChange={(e) => setDevisMontant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description du devis
                  </label>
                  <textarea
                    value={devisDescription}
                    onChange={(e) => setDevisDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Détail des prestations et conditions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier du devis (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange(setDevisFile)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {devisFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {devisFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowDevisModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitDevis}
                  disabled={!devisMontant || !devisDescription || !devisFile}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Envoyer le devis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
