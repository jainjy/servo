import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Home,
  Plus,
  RefreshCw,
  Mail,
  Phone,
  FileText,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type EstimationStatus = "en_attente" | "repondu" | "refuse" | "archive";

interface ProResponse {
  id: string;
  message: string;
  estimationMin: number;
  estimationMax: number;
  date: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
}

interface EstimationRequest {
  id: string;
  createdAt: string;
  propertyType: string;
  surface: string;
  rooms: string;
  address: string;
  commune: string;
  agencyName: string;
  agencyCity: string;
  agencyRating: number;
  agencySpecialty: string;
  status: EstimationStatus;
  response?: ProResponse;
  unreadMessages?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  EstimationStatus,
  { label: string; color: string; bg: string; icon: JSX.Element }
> = {
  en_attente: {
    label: "En attente",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: <Clock className="w-4 h-4" />,
  },
  repondu: {
    label: "Réponse reçue",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  refuse: {
    label: "Non disponible",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle className="w-4 h-4" />,
  },
  archive: {
    label: "Archivée",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    icon: <FileText className="w-4 h-4" />,
  },
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Transform : données API expéditeur → EstimationRequest ──────────────────

function transformApiToEstimation(apiEst: any): EstimationRequest {
  // getEstimationsAsExpediteur retourne déjà `details` parsé côté backend
  const details = apiEst.details || {};

  const repondu = apiEst.artisans?.find((a: any) => a.accepte === true);
  const refuse = apiEst.artisans?.find((a: any) => a.accepte === false);

  let status: EstimationStatus = "en_attente";
  if (repondu) status = "repondu";
  else if (refuse && !repondu) status = "refuse";

  // Messages non lus = messages envoyés par quelqu'un d'autre que l'expéditeur
  const unreadMessages =
    apiEst.conversations?.[0]?.messages?.filter(
      (m: any) => m.expediteurId !== apiEst.createdById
    ).length || 0;

  let response: ProResponse | undefined;
  if (repondu?.user) {
    const lastMsg = apiEst.dernierMessage;
    response = {
      id: repondu.userId,
      message:
        lastMsg?.contenu ||
        "Nous avons analysé votre bien et vous proposerons une estimation.",
      estimationMin: 0,
      estimationMax: 0,
      date: repondu.createdAt,
      agentName:
        repondu.user.companyName ||
        `${repondu.user.firstName} ${repondu.user.lastName}`,
      agentPhone: repondu.user.phone || "Non renseigné",
      agentEmail: repondu.user.email,
    };
  }

  const firstArtisan = apiEst.artisans?.[0]?.user;

  return {
    id: apiEst.id.toString(),
    createdAt: apiEst.createdAt,
    propertyType: details.propertyType || "Non spécifié",
    surface: details.surface?.toString() || "0",
    rooms: details.rooms || "—",
    address:
      details.address || apiEst.contactAdresse || "Adresse non spécifiée",
    commune:
      details.commune ||
      apiEst.contactAdresseVille ||
      "Commune non spécifiée",
    agencyName: firstArtisan
      ? firstArtisan.companyName ||
        `${firstArtisan.firstName} ${firstArtisan.lastName}`
      : `${apiEst.artisans?.length || 0} agence(s) contactée(s)`,
    agencyCity:
      details.commune || apiEst.contactAdresseVille || "Non spécifiée",
    agencyRating: 4.5,
    agencySpecialty: "Immobilier",
    status,
    response,
    unreadMessages,
  };
}

// ─── Transform : données API destinataire → EstimationRequest ────────────────

function transformAgencyEstimation(est: any): EstimationRequest {
  const details = est.details || {};
  const expediteur = est.expediteur || {};
  const expediteurNom =
    expediteur.companyName ||
    `${expediteur.firstName || ""} ${expediteur.lastName || ""}`.trim() ||
    "Client";

  const status: EstimationStatus =
    est.accepte === true
      ? "repondu"
      : est.accepte === false
      ? "refuse"
      : "en_attente";

  return {
    id: est.id.toString(),
    createdAt: est.createdAt,
    propertyType: details.propertyType || "Non spécifié",
    surface: details.surface?.toString() || "0",
    rooms: details.rooms || "—",
    address: details.address || "Adresse non spécifiée",
    commune: details.commune || "Non spécifiée",
    agencyName: expediteurNom,
    agencyCity: details.commune || "Non spécifiée",
    agencyRating: 4.5,
    agencySpecialty: "Immobilier",
    status,
    unreadMessages: 0,
    response:
      est.accepte === true
        ? {
            id: est.id.toString(),
            message: "Demande acceptée — en attente de votre estimation.",
            estimationMin: 0,
            estimationMax: 0,
            date: est.createdAt,
            agentName: expediteurNom,
            agentPhone: expediteur.phone || "Non renseigné",
            agentEmail: expediteur.email || "",
          }
        : undefined,
  };
}

// ─── EstimationCard ────────────────────────────────────────────────────────────

function EstimationCard({
  est,
  isAgencyView,
  onRefresh,
}: {
  est: EstimationRequest;
  isAgencyView: boolean;
  onRefresh?: () => void;
}) {
  const [expanded, setExpanded] = useState(
    est.status === "repondu" && !!est.response
  );
  const [loading, setLoading] = useState(false);
  const cfg = STATUS_CONFIG[est.status];

  const handleAccept = async () => {
    if (!confirm("Voulez-vous vraiment accepter cette estimation ?")) return;
    setLoading(true);
    try {
      await api.patch(`/estimations/${est.id}/repondre`, { accepte: true });
      toast.success("Estimation acceptée !");
      onRefresh?.();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'acceptation");
    } finally {
      setLoading(false);
    }
  };

  const handleRefuse = async () => {
    if (!confirm("Voulez-vous vraiment refuser cette estimation ?")) return;
    setLoading(true);
    try {
      await api.patch(`/estimations/${est.id}/repondre`, { accepte: false });
      toast.success("Estimation refusée");
      onRefresh?.();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du refus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={[
        "bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300",
        est.status === "repondu" ? "border-[#C0DD97]" : "border-gray-100",
      ].join(" ")}
    >
      {/* Header */}
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Agency / Client info */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-11 h-11 rounded-xl bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-[#3B6D11]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-[#1a2410] text-base">
                  {est.agencyName}
                </h3>
                {(est.unreadMessages ?? 0) > 0 && (
                  <span className="bg-[#8B4513] text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {est.unreadMessages} nouveau
                    {est.unreadMessages! > 1 ? "x" : ""}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" /> {est.agencyCity}
                </span>
                {!isAgencyView && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {est.agencyRating}
                  </span>
                )}
                <span className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2 py-0.5 rounded-full">
                  {est.agencySpecialty}
                </span>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}
            >
              {cfg.icon}
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Property summary */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Home className="w-4 h-4 text-gray-400" />
            {est.propertyType}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            {est.address}, {est.commune}
          </span>
          {est.surface && parseInt(est.surface) > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {est.surface} m²
            </span>
          )}
          {est.rooms && est.rooms !== "—" && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {est.rooms} pièces
            </span>
          )}
          <span className="text-xs text-gray-400">
            {isAgencyView ? "Reçue le" : "Envoyée le"} {formatDate(est.createdAt)}
          </span>
        </div>

        {/* Response preview (vue client : estimation reçue) */}
        {!isAgencyView && est.status === "repondu" && est.response && (
          <div className="mt-4 p-4 bg-[#F7FBF0] border border-[#C0DD97] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[#3B6D11] uppercase tracking-wider">
                Estimation reçue
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(est.response.date)}
              </p>
            </div>
            {est.response.estimationMin > 0 && est.response.estimationMax > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1a2410]">
                  {formatPrice(est.response.estimationMin)}
                </span>
                <span className="text-gray-500 text-sm">–</span>
                <span className="text-2xl font-bold text-[#1a2410]">
                  {formatPrice(est.response.estimationMax)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                En attente de la proposition de l'agence
              </p>
            )}
          </div>
        )}
      </div>

      {/* Boutons agence : Accepter / Refuser (seulement en attente) */}
      {isAgencyView && est.status === "en_attente" && (
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#3B6D11] text-white rounded-xl text-sm font-semibold hover:bg-[#2d5209] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Accepter la demande
          </button>
          <button
            onClick={handleRefuse}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Refuser
          </button>
        </div>
      )}

      {/* Bouton agence : Voir conversation (acceptée) */}
      {isAgencyView && est.status === "repondu" && (
        <div className="px-6 py-4 border-t border-gray-100">
          <a
            href={`/pro/demandes/messages/${est.id}`}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Voir la conversation
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Vue client : détails expandables si répondu */}
      {!isAgencyView && est.status === "repondu" && est.response && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium">
              {expanded ? "Masquer le message" : "Lire le message complet"}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expanded && (
            <div className="px-6 py-5 border-t border-gray-100 space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Message du conseiller
                </p>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  "{est.response.message}"
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Votre conseiller
                </p>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#1a2410] flex items-center justify-center text-white font-bold text-sm">
                      {est.response.agentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a2410] text-sm">
                        {est.response.agentName}
                      </p>
                      <p className="text-xs text-gray-500">{est.agencyName}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${est.response.agentPhone}`}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-[#EAF3DE] text-[#3B6D11] rounded-lg hover:bg-[#d4eab8] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {est.response.agentPhone}
                    </a>
                    <a
                      href={`mailto:${est.response.agentEmail}`}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`/mon-compte/demandes/messages/${est.id}`}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a2410] text-white rounded-xl text-sm font-semibold hover:bg-[#2d3d1a] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messagerie interne
                  {(est.unreadMessages ?? 0) > 0 && (
                    <span className="bg-[#8B4513] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {est.unreadMessages}
                    </span>
                  )}
                </a>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4" />
                  Prendre RDV
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Vue client : CTA "en attente" */}
      {!isAgencyView && est.status === "en_attente" && (
        <div className="px-6 py-4 bg-amber-50 border-t border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <Clock className="w-4 h-4" />
            <span>Le professionnel prépare votre estimation…</span>
          </div>
          <a
            href={`/mon-compte/demandes/messages/${est.id}`}
            className="text-sm text-amber-700 font-semibold hover:underline flex items-center gap-1"
          >
            Voir la discussion
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MesEstimationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [estimations, setEstimations] = useState<EstimationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | EstimationStatus>("all");

  // Dériver le rôle depuis useAuth (synchrone, pas de localStorage)
  const isAgencyView =
    user?.userType === "AGENCE" || user?.role === "professional";

  const fetchEstimations = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (isAgencyView) {
        const response = await api.get("/estimations/destinataire");
        if (response.data.success) {
          setEstimations(
            response.data.estimations.map(transformAgencyEstimation)
          );
        }
      } else {
        const response = await api.get("/estimations/expediteur");
        if (response.data.success) {
          setEstimations(
            response.data.estimations.map(transformApiToEstimation)
          );
        }
      }
    } catch (error: any) {
      console.error("Erreur chargement estimations:", error);
      toast.error("Erreur lors du chargement des estimations");
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated, isAgencyView]);

  // Un seul useEffect — se déclenche quand l'utilisateur est connu
  useEffect(() => {
    fetchEstimations();
  }, [fetchEstimations]);

  const tabs = [
    { id: "all", label: "Toutes", count: estimations.length },
    {
      id: "en_attente",
      label: "En attente",
      count: estimations.filter((e) => e.status === "en_attente").length,
    },
    {
      id: "repondu",
      label: isAgencyView ? "Acceptées" : "Réponses reçues",
      count: estimations.filter((e) => e.status === "repondu").length,
    },
    {
      id: "refuse",
      label: "Refusées",
      count: estimations.filter((e) => e.status === "refuse").length,
    },
  ] as const;

  const filtered =
    activeTab === "all"
      ? estimations
      : estimations.filter((e) => e.status === activeTab);

  const totalUnread = estimations.reduce(
    (acc, e) => acc + (e.unreadMessages || 0),
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Veuillez vous connecter pour voir vos estimations.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#3B6D11] mx-auto mb-4" />
          <p className="text-gray-500">Chargement de vos estimations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 pt-20 md:pt-24 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Building2 className="w-7 h-7 text-[#3B6D11]" />
              <h1 className="text-2xl font-bold text-[#1a2410]">
                {isAgencyView ? "Estimations reçues" : "Mes estimations"}
              </h1>
              {totalUnread > 0 && (
                <span className="bg-[#8B4513] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {totalUnread} nouveau{totalUnread > 1 ? "x" : ""}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {isAgencyView
                ? "Gérez les demandes d'estimation reçues"
                : "Suivez vos demandes et les réponses des professionnels"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchEstimations}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
            {!isAgencyView && (
              <a
                href="/vendre"
                className="flex items-center gap-2 px-5 py-2 bg-[#3B6D11] text-white text-sm font-semibold rounded-xl hover:bg-[#2d5209] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouvelle estimation
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: isAgencyView ? "Demandes reçues" : "Demandes envoyées",
              value: estimations.length,
              color: "text-[#1a2410]",
            },
            {
              label: isAgencyView ? "Acceptées" : "Réponses reçues",
              value: estimations.filter((e) => e.status === "repondu").length,
              color: "text-[#3B6D11]",
            },
            {
              label: "En attente",
              value: estimations.filter((e) => e.status === "en_attente")
                .length,
              color: "text-amber-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm"
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 mb-6 overflow-x-auto shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-[#1a2410] text-white shadow"
                  : "text-gray-500 hover:text-gray-800",
              ].join(" ")}
            >
              {tab.label}
              <span
                className={[
                  "px-1.5 py-0.5 text-xs rounded-full",
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600",
                ].join(" ")}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((est) => (
              <EstimationCard
                key={est.id}
                est={est}
                isAgencyView={isAgencyView}
                onRefresh={fetchEstimations}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-7 h-7 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-[#1a2410] mb-2">
                {isAgencyView
                  ? "Aucune estimation reçue"
                  : "Aucune estimation"}
              </h4>
              <p className="text-gray-500 text-sm mb-6">
                {isAgencyView
                  ? "Vous n'avez pas encore reçu de demande d'estimation."
                  : "Vous n'avez pas encore fait de demande d'estimation."}
              </p>
              {!isAgencyView && (
                <a
                  href="/vendre"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B6D11] text-white rounded-xl text-sm font-semibold hover:bg-[#2d5209] transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Demander une estimation gratuite
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}