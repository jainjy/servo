import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api"
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
export default function AdminDiscussions() {
  const { id } = useParams();
  const location = useLocation();
  // const demande = (location.state as any)?.demande;
  const [demandes,setDemandes]=useState<any>({});
  const [demande,setDemande]=useState<any>({});
  const [loading,setLoading]=useState(true)

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
  
  const validate=async(valeur)=>{
    const response = await api.put(`admin/demandes/${demande.id}/validate`,{validate:valeur});
    setDemande(response.data.demande)
    toast.info(response.data.message);
  }
  const defaultIntro =
    demande?.description ||
    "Besoin de réparer le chauffe-eau et changer le compteur";
  const defaultTitle = demande?.titre || "Projet 01";
  const defaultClient = demande?.client || "Agence Guy Hoquet";
  const defaultDate = demande?.createdAt || "09/03/2022";
  const defaultMetiers = demande?.metier?.libelle
    ? [demande.metier.libelle]
    : ["Électricien", "Plombier"];
  const defaultAdresse = demande?.lieuAdresse || "132 rue de la digue";
  const defaultUrgent = demande?.urgence;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  // Modal state for selecting an artisan to send to
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validation status: idle (before sending), sent (en attente), accepted, refused
  const [validationState, setValidationState] = useState<
    "idle" | "sent" | "accepted" | "refused"
  >("idle");
  const [sentToArtisanId, setSentToArtisanId] = useState<string | null>(null);
  const [activeStoredDemande, setActiveStoredDemande] = useState<any | null>(
    null
  );
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [devisText, setDevisText] = useState<string>("");
 
  const [factureFile, setFactureFile] = useState<{
    name: string;
    dataUrl: string;
  } | null>(null);
  const [proposalSent, setProposalSent] = useState<boolean>(false);
  const [proposalTimestamp, setProposalTimestamp] = useState<string | null>(
    null
  );
  // Signing modal state for client
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [signChoice, setSignChoice] = useState<"upload" | "digital" | null>(
    null
  );
  const [signedFile, setSignedFile] = useState<{
    name: string;
    dataUrl: string;
  } | null>(null);
  const [clientSigned, setClientSigned] = useState<boolean>(false);
  // Review modal state and inputs
 
  useEffect(() => {
    const fetchDemande = async () => {
      if (id) {
        const response = await api.get(`/demandes/${id}`);
        setDemandes(response.data);
        setDemande(response.data);
        console.log("demandes ", response.data, id);
        console.log("demandes state ", demande, id);
      }
      setLoading(false)
    };

    fetchDemande();
    console.log("demandes ", demandes, id);
  }, []);


  useEffect(() => {
    // Helper to map various status naming conventions to our internal states
    const mapStatus = (s) => {
      if (!s) return null;
      const lower = String(s).toLowerCase();
      if (lower === "sent" || lower === "en attente") return "sent";
      if (
        lower === "accepted" ||
        lower === "validée" ||
        lower === "validee" ||
        lower === "valide" ||
        lower.includes("devis")
      )
        return "accepted";
      if (
        lower === "refused" ||
        lower === "refusée" ||
        lower === "refusee" ||
        lower === "refuse"
      )
        return "refused";
      return null;
    };

    // If a demande was passed via router state (Link state), use it as the active stored demande
    if (demande) {
      // normalize status coming from admin sample data which uses `statut`
      const rawStatus = demande.status ?? demande.statut;
      const normalizedStatus = mapStatus(rawStatus);
      const normalizedDemande = {
        ...demande,
        status: normalizedStatus ?? demande.status,
      };
      setActiveStoredDemande(normalizedDemande);
      if (normalizedStatus === "sent") setValidationState("sent");
      if (normalizedStatus === "accepted") setValidationState("accepted");
      if (normalizedStatus === "refused") setValidationState("refused");
      setSentToArtisanId(demande.artisanId || null);
    }
  }, [id, location.search, demande]);

  const isAdminView = true;

  const statusRawAll = (
    activeStoredDemande?.status ||
    activeStoredDemande?.statut ||
    demande?.status ||
    demande?.statut ||
    ""
  )
    .toString()
    .toLowerCase();
  const isFinished =
    statusRawAll.includes("term") ||
    statusRawAll.includes("fini") ||
    statusRawAll.includes("finished");
  const isInProgress =
    statusRawAll.includes("en cours") ||
    statusRawAll.includes("in progress") ||
    statusRawAll.includes("ongoing");

  function appendMessage(sender: string, text: string) {
    setMessages((prev) => [...prev, { sender, text, time: "Maintenant" }]);
  }

  function appendEvent(event: string, payload: any = {}) {
    const artisanName =
      payload.artisanName ||
      (activeStoredDemande?.artisanId
        ? activeStoredDemande.artisanId
        : "Artisan");
    const clientName =
      payload.clientName ||
      (activeStoredDemande?.client ? activeStoredDemande.client : "Client");
    switch (event) {
      case "demande_sent":
        if (isAdminView)
          appendMessage(
            "Vous",
            `Demande envoyée à ${payload.toName || artisanName}.`
          );
        
        break;
      case "artisan_accepted":
        if (isAdminView)
          appendMessage(
            "Artisan",
            `${payload.artisanName || artisanName} a accepté la demande.`
          );
        break;
      case "artisan_refused":
        if (isAdminView)
          appendMessage(
            "Artisan",
            `${payload.artisanName || artisanName} a refusé la demande.`
          );
        break;
      case "proposal_meeting":
        appendMessage(
          "Artisan",
          `Proposition de rendez-vous : ${payload.date || meetingDate} à ${
            payload.time || meetingTime
          }`
        );
        break;
      case "proposal_devis":
        appendMessage(
          "Artisan",
          `Devis proposé : ${payload.devisText || devisText || "-"} `
        );
        break;
      case "client_signed":
        
        break;
      case "appointment_set":
        appendMessage(
          "Artisan",
          `Rendez-vous fixé : ${payload.date || meetingDate} à ${
            payload.time || meetingTime
          }`
        );
        break;
      case "facture_sent":
        appendMessage("Artisan", "Facture envoyée.");
        break;
      case "travaux_finished":
        appendMessage("System", "Travaux terminés.");
        break;
      case "review_left":
        appendMessage(
          "Vous",
          `Avis laissé: ${payload.rating}/5${
            payload.text ? ` — ${payload.text}` : ""
          }`
        );
        break;
      case "client_refuse":
        appendMessage("Vous", "Je refuse la proposition.");
        break;
      case "generic":
      default:
        appendMessage(
          payload.sender || "System",
          payload.text || "Mise à jour"
        );
        break;
    }
  }

  useEffect(() => {
    const base = defaultIntro;
    if (isFinished) {
      setMessages([
        {
          sender: "System",
          text: "Travaux terminés. Le dossier est clos.",
          time: "",
        },
        { sender: "Client", text: base, time: "" },
        {
          sender: "Artisan",
          text: "Intervention réalisée et facturation envoyée.",
          time: "",
        },
      ]);
      return;
    }


    setMessages([
      { sender: "Vous", text: base, time: "" },
      {
        sender: "System",
        text: "Prêt à valider: envoyez la demande à un artisan ou refusez-la.",
        time: "",
      },
    ]);
  }, [ isFinished, defaultIntro]);

  function handleSend() {
    if (input.trim().length === 0) return;
    appendEvent("generic", { sender: "Vous", text: input });
    setInput("");
  }

  function handleRefuse() {
    toast.info("Demande refusée.");
  }

  function handleSign() {
    // Open modal to choose artisan to send the validated demande
    setIsModalOpen(true);
  }
  useEffect(() => {
    if (!activeStoredDemande) {
      setProposalSent(false);
      setProposalTimestamp(null);
      return;
    }
    // pre-fill meeting fields if present
    if (activeStoredDemande.date) setMeetingDate(activeStoredDemande.date);
    if (activeStoredDemande.time) setMeetingTime(activeStoredDemande.time);
    if (activeStoredDemande.devis) setDevisText(activeStoredDemande.devis);
    // if the demande already contains a signed document, set clientSigned
    if (activeStoredDemande.signedAt) {
      setClientSigned(true);
      if (activeStoredDemande.signedFile)
        setSignedFile(activeStoredDemande.signedFile);
    }
    // pre-fill facture if present
    if (activeStoredDemande.factureFile)
      setFactureFile(activeStoredDemande.factureFile);

    // consider the proposal sent only if there is a proposalAt timestamp
    if (activeStoredDemande.proposalAt) {
      setProposalSent(true);
      setProposalTimestamp(activeStoredDemande.proposalAt);
    } else {
      setProposalSent(false);
      setProposalTimestamp(null);
    }
  }, [activeStoredDemande]);

  return (
    <>
      <div className="min-h-full">
        {loading ? (
          <LoadingSpinner text="chargement des donnes en cours " />
        ) : (
          <div className="flex h-[calc(100vh-100px)]">
            {/* Côté gauche - Informations du projet */}
            <div className="w-1/2 bg-white rounded-lg shadow-sm border-r border-gray-200 p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                {/* Informations principales */}
                <div className="relative space-y-1">
                  <h1 className="text-xl font-bold text-gray-900">
                    {defaultTitle}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">{defaultClient}</p>
                  <div className="absolute right-0 top-0 flex items-center gap-2">
                    <span
                      className={`text-xs font-medium flex items-center gap-1 ${getUrgencyBg(
                        defaultUrgent
                      )} p-2 rounded-full text-white`}
                    >
                      {getUrgencyIcon(defaultUrgent)}
                      {defaultUrgent}
                    </span>
                    {(clientSigned || activeStoredDemande?.signedAt) && (
                      <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-semibold">
                        Signé
                      </span>
                    )}
                  </div>
                  {/* Date */}
                  <div className="flex items-center gap-5">
                    <h3 className="text-md font-semibold text-gray-500">
                      Date de la demande :
                    </h3>
                    <div className="flex items-center gap-3 text-md font-semibold text-gray-900">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{defaultDate}</span>
                    </div>
                  </div>

                  {/* Artisans */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-500 mb-3 underline">
                      Artisan demandé
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {defaultMetiers.map((m) => (
                        <div
                          key={m}
                          className={`flex items-center gap-3 ${
                            m === "Électricien"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          } px-3 py-2 rounded-xl border`}
                        >
                          {m === "Électricien" ? (
                            <Zap className="w-4 h-4" />
                          ) : (
                            <Wrench className="w-4 h-4" />
                          )}
                          <span className="text-sm font-semibold">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adresse */}
                  <div>
                    <h3 className="text-md underline font-semibold text-gray-500 mb-2">
                      Adresse du projet
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{defaultAdresse}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pl-9">
                        <div>
                          <p className="text-md text-gray-500 mb-2">Ville</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {demande.lieuAdresseVille || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Séparateur */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Description
                  </h3>

                  {/* Description principale */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-md text-gray-700 leading-relaxed">
                      {defaultIntro}
                    </p>
                  </div>
                </div>
                {demande.statut !== "En attente" &&
                  !demande.demandeAcceptee && (
                    <div className="m-auto mt-4">
                      <button
                        className=" bg-green-500 p-2 mx-2 rounded-xl hover:bg-green-700"
                        onClick={() => validate(true)}
                      >
                        ACCEPTER
                      </button>
                      <button
                        className="bg-red-600 p-2 mx-2 rounded-xl hover:bg-red-700"
                        onClick={() => validate(false)}
                      >
                        REFUSER
                      </button>
                    </div>
                  )}
              </div>
            </div>

            {/* Côté droit - Discussion */}
            <div className="w-1/2 flex flex-col bg-white">
              {/* Header discussion */}
              <div className="border-b border-gray-200 px-6 py-3">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Discussion
                  </h2>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Premier message avec boutons collés en bas */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8  h-8 rounded-full flex items-center justify-center bg-blue-100">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="max-w-[70%] flex-1">
                      <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 rounded-bl-none">
                        <p className="text-sm font-semibold">{defaultIntro}</p>
                      </div>
                      <div className="text-xs mt-2 text-gray-400 mb-2">
                        {demande.createdAt}
                      </div>

                      {/* Status marker under the main message */}
                      {validationState !== "idle" && (
                        <div className="mt-3 pl-[3.25rem]">
                          {/* left padding to align under the message content */}
                          <div className="inline-flex items-center gap-2 text-sm">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                validationState === "sent"
                                  ? "bg-yellow-400"
                                  : validationState === "accepted"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            <span className="text-gray-600">
                              {validationState === "sent" &&
                                "En attente de la réponse de l'artisan"}
                              {validationState === "accepted" &&
                                "Artisan a accepté la demande"}
                              {validationState === "refused" &&
                                "Artisan a refusé la demande"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Zone d'envoi de message en bas */}
              <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Tapez votre message ici..."
                    className="flex-1 px-6 py-2 rounded-xl bg-white text-gray-900 border border-gray-200 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold text-md transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
                    onClick={handleSend}
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
