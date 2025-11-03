import { useState, useEffect } from "react";
import {
  saveDemande,
  loadDemandes,
  updateDemandeStatus,
  updateDemande,
} from "@/lib/requestStore";
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

export default function UserDiscussions() {
  const { id } = useParams();
  const location = useLocation();
  const demande = (location.state as any)?.demande;
  useEffect(() => {
    console.log("demandes ", demande);
  }, [demande]);
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

  const defaultIntro =
    demande?.description ||
    "Besoin de réparer le chauffe-eau et changer le compteur";
  const defaultTitle = demande?.titre || "Projet 01";
  const defaultClient = demande?.client || "Agence Guy Hoquet";
  const defaultDate = demande?.date || "09/03/2022";
  const defaultMetiers = demande?.metier?.libelle
    ? [demande.metier.libelle]
    : ["Électricien", "Plombier"];
  const defaultAdresse = demande?.lieu || "132 rue de la digue";
  const defaultUrgent = demande?.urgence;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  // Modal state for selecting an artisan to send to
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<string | null>(null);

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
  const [devisFile, setDevisFile] = useState<{
    name: string;
    dataUrl: string;
  } | null>(null);
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
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewTextInput, setReviewTextInput] = useState<string>("");

  useEffect(() => {
    // If there is an id param in route, try to load stored demande
    if (id) {
      const stored = loadDemandes();
      const found = stored.find((d) => d.id === id);
      if (found) {
        setActiveStoredDemande(found);
        // reflect stored status in local validation state
        if (found.status === "sent") setValidationState("sent");
        if (found.status === "accepted") setValidationState("accepted");
        if (found.status === "refused") setValidationState("refused");
        setSentToArtisanId(found.artisanId || null);
      }
    }
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

  const isClientPath =
    location.pathname && location.pathname.includes("/mon-compte");
  const isClientView = true;
  const clientStatusRaw = (
    activeStoredDemande?.status ||
    activeStoredDemande?.statut ||
    ""
  )
    .toString()
    .toLowerCase();
  const clientIsWaiting =
    clientStatusRaw.includes("en attente") || clientStatusRaw === "sent";
  const clientHasProposal =
    clientStatusRaw.includes("devis") ||
    clientStatusRaw === "accepted" ||
    clientStatusRaw === "confirmed";

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
        if (isClientView)
          appendMessage(
            "System",
            `Votre demande a été envoyée à ${payload.toName || artisanName}.`
          );
        break;
      case "artisan_accepted":
        if (isClientView)
          appendMessage(
            "Artisan",
            `${payload.artisanName || artisanName} a accepté votre demande.`
          );

        break;
      case "artisan_refused":
        if (isClientView)
          appendMessage(
            "Artisan",
            `${payload.artisanName || artisanName} a refusé votre demande.`
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
        if (isClientView)
          appendMessage(
            "Vous",
            payload.method === "upload"
              ? "Document signé envoyé (scan)."
              : "Devis signé numériquement."
          );

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

    if (isClientView) {
      setMessages([
        { sender: "Vous", text: base, time: "" },
        {
          sender: "System",
          text: "Demande enregistrée. Vous serez notifié dès qu’un artisan proposera une intervention.",
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
  }, [isClientView, isFinished, defaultIntro]);

  function handleClientSign() {
    if (!activeStoredDemande) return;
    setShowSignModal(true);
  }

  function handleClientRefuse() {
    if (!activeStoredDemande) return;
    updateDemandeStatus(activeStoredDemande.id, "refused");
    setValidationState("refused");
    setActiveStoredDemande((prev) =>
      prev ? { ...prev, status: "refused" } : prev
    );
    appendEvent("client_refuse");
  }

  function handleChooseSignMethod(method: "upload" | "digital") {
    setSignChoice(method);
  }

  function handleSignedFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSignedFile({ name: file.name, dataUrl });
    };
    reader.readAsDataURL(file);
  }

  function submitSignedDocument() {
    if (!activeStoredDemande) return;
    if (signChoice === "upload" && !signedFile) return;
    const updates: any = {
      status: "confirmed",
      signedAt: new Date().toISOString(),
    };
    if (signedFile) updates.signedFile = signedFile;
    updateDemande(activeStoredDemande.id, updates);
    updateDemandeStatus(activeStoredDemande.id, "confirmed");
    setActiveStoredDemande((prev) => (prev ? { ...prev, ...updates } : prev));
    setValidationState("confirmed" as any);
    setClientSigned(true);
    setShowSignModal(false);
    appendEvent("client_signed", { method: signChoice });
  }

  // Submit a client review once travaux finished
  function submitReview() {
    if (!activeStoredDemande) return;
    if (!rating) return;
    const updates: any = {
      rating,
      reviewText: reviewTextInput,
      reviewAt: new Date().toISOString(),
    };
    updateDemande(activeStoredDemande.id, updates);
    setActiveStoredDemande((prev) => (prev ? { ...prev, ...updates } : prev));
    appendEvent("review_left", { rating, text: reviewTextInput });
    setShowReviewModal(false);
  }

  // Mock list of artisans (if you have a real source, replace this)
  const artisans = [
    { id: "a1", name: "Société Durand - Jean Durand", metier: "Plombier" },
    { id: "a2", name: "ElecPro SARL - Alice Martin", metier: "Électricien" },
    { id: "a3", name: "Menuiserie Rive - Paul Lefevre", metier: "Menuisier" },
  ];

  function handleSend() {
    if (input.trim().length === 0) return;
    appendEvent("generic", { sender: "Vous", text: input });
    setInput("");
  }
  function handleSendToArtisan() {
    if (!selectedArtisan) return;
    const artisan = artisans.find((a) => a.id === selectedArtisan);
    const name = artisan ? artisan.name : "artisan sélectionné";
    // Add a confirmation message
    appendEvent("demande_sent", { toName: name, clientName: defaultClient });
    // Mark as sent to artisan and set validation state to 'sent'
    setSentToArtisanId(selectedArtisan);
    setValidationState("sent");
    // Persist a demande in the shared store so the artisan/pro can see it
    try {
      const demande = {
        id: `d_${Date.now()}`,
        titre: defaultTitle,
        description: defaultIntro,
        client: defaultClient,
        metier: defaultMetiers[0] || "",
        lieu: defaultAdresse,
        date: defaultDate,
        urgent: defaultUrgent,
        artisanId: selectedArtisan,
        status: "sent" as const,
        createdAt: new Date().toISOString(),
      };
      saveDemande(demande);
    } catch (e) {
      console.error("Failed to persist demande", e);
    }
    // Close modal and reset selection
    setIsModalOpen(false);
    setSelectedArtisan(null);
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
                          {demande.lieuAdresseVille}
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
            </div>
          </div>

          {/* Côté droit - Discussion */}
          <div className="w-1/2 flex flex-col bg-white">
            {/* Header discussion */}
            <div className="border-b border-gray-200 px-6 py-3">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Discussion</h2>
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
                      Le 18/03 à 9:00
                    </div>

                    {/* Boutons SIGNER/REFUSER collés en bas du message */}
                    <div className="flex gap-3 mt-4 items-center">
                      {/* If this view is the artisan opening the demande, show Accept/Refuse controls */}

                      {/* Client view: when the demander opens their demande */}
                      {isClientView && activeStoredDemande && !isFinished && (
                        <>
                          {clientIsWaiting && (
                            <div className="flex-1 flex flex-col items-start gap-3">
                              <div className="p-2 text-xs rounded-xl bg-yellow-100 text-yellow-800 font-semibold border border-yellow-200">
                                En attente
                              </div>
                              <div className="text-xs text-gray-600">
                                Votre demande a été envoyée aux artisans. Vous
                                serez notifié lors de la réception d'une
                                proposition.
                              </div>
                            </div>
                          )}

                          {(clientHasProposal ||
                            activeStoredDemande.proposalAt) && (
                            <div className="w-full">
                              {/* show proposal summary (we already prepare meetingDate, meetingTime, devisText, devisFile) */}
                              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-3">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Proposition reçue
                                </h4>
                                <div className="text-sm text-gray-700 mb-2">
                                  Rendez-vous proposé:{" "}
                                  <span className="font-medium">
                                    {activeStoredDemande?.date ||
                                      meetingDate ||
                                      "-"}{" "}
                                    à{" "}
                                    {activeStoredDemande?.time ||
                                      meetingTime ||
                                      "-"}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-700 mb-2">
                                  Devis:{" "}
                                  <span className="font-medium">
                                    {activeStoredDemande?.devis ||
                                      devisText ||
                                      "-"}
                                  </span>
                                </div>
                                {activeStoredDemande?.devisFile ? (
                                  <div className="mt-2">
                                    <a
                                      className="text-sm text-blue-600 underline"
                                      href={
                                        activeStoredDemande.devisFile.dataUrl
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Télécharger le PDF du devis
                                    </a>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500 mt-2">
                                    Aucun fichier PDF attaché.
                                  </div>
                                )}
                                {proposalTimestamp && (
                                  <div className="text-xs text-gray-500 mt-2">
                                    Envoyé le{" "}
                                    {new Date(
                                      proposalTimestamp
                                    ).toLocaleString()}
                                  </div>
                                )}
                              </div>

                              {/* hide client controls when signed or finished */}
                              {!clientSigned && !isFinished && (
                                <div className="flex gap-3">
                                  <button
                                    onClick={handleClientSign}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200"
                                  >
                                    SIGNER
                                  </button>
                                  <button
                                    onClick={handleClientRefuse}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200"
                                  >
                                    REFUSER
                                  </button>
                                </div>
                              )}
                              {/* show signed badge / file if signed */}
                              {(clientSigned ||
                                activeStoredDemande?.signedAt) && (
                                <div className="mt-3 text-sm text-green-700">
                                  Document signé{" "}
                                  {activeStoredDemande?.signedAt
                                    ? `le ${new Date(
                                        activeStoredDemande.signedAt
                                      ).toLocaleString()}`
                                    : ""}{" "}
                                  {activeStoredDemande?.signedFile ? (
                                    <a
                                      className="underline text-blue-600 ml-2"
                                      href={
                                        activeStoredDemande.signedFile.dataUrl
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Voir document
                                    </a>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
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

                {/* Autres messages */}
                {messages.slice(1).map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 ${
                      msg.sender === "Vous" ? "justify-end" : ""
                    }`}
                  >
                    {msg.sender !== "Vous" && (
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            msg.sender === "GH" ? "bg-blue-100" : "bg-green-100"
                          }`}
                        >
                          <User
                            className={`w-4 h-4 ${
                              msg.sender === "GH"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          />
                        </div>
                        {i < messages.slice(1).length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] ${
                        msg.sender === "Vous" ? "order-first" : ""
                      }`}
                    >
                      <div
                        className={`rounded-2xl p-4 ${
                          msg.sender === "Vous"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm font-semibold text-black/90">
                          {msg.text}
                        </p>
                      </div>
                      <div
                        className={`text-xs mt-2 ${
                          msg.sender === "Vous"
                            ? "text-gray-500 text-right"
                            : "text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>
                    {msg.sender === "Vous" && (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-purple-600" />
                        </div>
                        {i < messages.slice(1).length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
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
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-3">Choisir où envoyer</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez l'artisan à qui vous souhaitez envoyer la demande :
            </p>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">
                Artisan
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white"
                value={selectedArtisan ?? ""}
                onChange={(e) => setSelectedArtisan(e.target.value || null)}
              >
                <option value="">-- Sélectionner un artisan --</option>
                {artisans.map((a) => (
                  <option
                    key={a.id}
                    value={a.id}
                  >{`${a.name} — ${a.metier}`}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedArtisan(null);
                }}
              >
                Annuler
              </button>
              <button
                className={`px-4 py-2 rounded-xl text-white ${
                  selectedArtisan
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={handleSendToArtisan}
                disabled={!selectedArtisan}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review modal for client (after travaux finished) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-3">Laisser un avis</h3>
            <p className="text-sm text-gray-600 mb-4">
              Merci de noter l'intervention et laisser un commentaire si vous le
              souhaitez.
            </p>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className={`text-2xl ${
                      rating && rating >= s
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewTextInput}
                onChange={(e) => setReviewTextInput(e.target.value)}
                placeholder="Votre commentaire (optionnel)"
                className="w-full border border-gray-200 rounded-md p-3"
                rows={4}
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(null);
                  setReviewTextInput("");
                }}
                className="px-4 py-2 rounded-xl bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={submitReview}
                disabled={!rating}
                className={`px-4 py-2 rounded-xl text-white ${
                  !rating
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signing modal for client */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-bold mb-3">Signer le devis</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choisissez comment vous souhaitez signer le devis :
            </p>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleChooseSignMethod("upload")}
                className={`flex-1 px-4 py-2 rounded-xl border ${
                  signChoice === "upload"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Renvoyer le document signé (scan)
              </button>
              <button
                onClick={() => handleChooseSignMethod("digital")}
                className={`flex-1 px-4 py-2 rounded-xl border ${
                  signChoice === "digital"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Signer numériquement
              </button>
            </div>

            {signChoice === "upload" && (
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Téléversez le document signé (PDF ou image)
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleSignedFileChange}
                />
                {signedFile && (
                  <div className="mt-2 text-sm text-gray-700">
                    Fichier prêt:{" "}
                    <span className="font-medium">{signedFile.name}</span>
                  </div>
                )}
              </div>
            )}

            {signChoice === "digital" && (
              <div className="mb-4 text-sm text-gray-600">
                Vous allez signer numériquement le devis. (Simulation)
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSignModal(false);
                  setSignChoice(null);
                  setSignedFile(null);
                }}
                className="px-4 py-2 rounded-xl bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={submitSignedDocument}
                disabled={signChoice === "upload" && !signedFile}
                className={`px-4 py-2 rounded-xl text-white ${
                  signChoice === "upload" && !signedFile
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Envoyer & Signer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
