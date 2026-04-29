import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Calendar,
  Star,
  Clock,
  X,
  MessageSquare,
  Sparkles,
  Trash2,
  Search,
  Home,
  ArrowRight,
  Ban,
  ChevronDown,
  ChevronUp,
  Check,
  Euro,
  Brain,
  Eye,
  RefreshCw,
  AlertTriangle,
  Info,
  FileText,
  User,
  Mail,
  Phone,
  MoreVertical,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

// ─── Utils ────────────────────────────────────────────────────────────────────
const PROPERTY_ICONS = {
  maison: "🏡",
  appartement: "🏢",
  terrain: "🌿",
  commercial: "🏬",
  professionnel: "🏛️",
};

const PROPERTY_LABELS = {
  maison: "Maison / Villa",
  appartement: "Appartement",
  terrain: "Terrain",
  commercial: "Local commercial",
  professionnel: "Local professionnel",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(n) {
  if (!n) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function statutCfg(statut) {
  // Gérer les booléens (vue agence : accepte = true/false/null)
  if (statut === true) return { color: "bg-green-50 text-green-700 border-green-200", dot: "#16A34A", label: "Acceptée" };
  if (statut === false) return { color: "bg-red-50 text-red-700 border-red-200", dot: "#DC2626", label: "Refusée" };
  if (statut === null || statut === undefined) return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "#CA8A04", label: "En attente" };

  // Gérer les strings (vue client : statut = "en_attente", "acceptée", etc.)
  const s = String(statut).toLowerCase();
  if (s.includes("accept")) return { color: "bg-green-50 text-green-700 border-green-200", dot: "#16A34A", label: "Acceptée" };
  if (s.includes("attente") || s === "pending") return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "#CA8A04", label: "En attente" };
  if (s.includes("refus")) return { color: "bg-red-50 text-red-700 border-red-200", dot: "#DC2626", label: "Refusée" };
  
  return { color: "bg-gray-50 text-gray-600 border-gray-200", dot: "#888", label: String(statut) };
}

function formatAddress(estimation) {
  const parts = [
    estimation.address,
    estimation.commune,
  ].filter(Boolean);
  if (parts.length) return parts.join(", ");
  return "Adresse non renseignée";
}

// ─── Estimation Card Component (MODIFIÉ POUR SUPPORTER LES DEUX MODES) ────────
const EstimationCard = ({ estimation, onDelete, onCancel, onRespond, isMobile = false, isAgencyView = false, loadingRespond }) => {
  // Pour la vue agence, on utilise accepte, pour la vue client on utilise statut
  const displayStatut = isAgencyView ? estimation.accepte : estimation.statut;
  const sc = statutCfg(displayStatut);
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showQualification, setShowQualification] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRefusing, setIsRefusing] = useState(false);

  // Pour la vue agence, extraire les détails du bien depuis details ou aiSummary
  const propertyType = isAgencyView 
    ? (estimation.details?.propertyType || estimation.propertyType || "maison")
    : estimation.propertyType;
  const surface = isAgencyView 
    ? (estimation.details?.surface || estimation.surface || "0")
    : estimation.surface;
  const rooms = isAgencyView 
    ? (estimation.details?.rooms || estimation.rooms || "—")
    : estimation.rooms;
  const commune = isAgencyView 
    ? (estimation.details?.commune || estimation.commune || "Commune non spécifiée")
    : estimation.commune;
  const address = isAgencyView 
    ? (estimation.details?.address || estimation.address || "")
    : estimation.address;
  const expediteur = isAgencyView ? estimation.expediteur : null;
  const expediteurNom = expediteur?.companyName || `${expediteur?.firstName || ""} ${expediteur?.lastName || ""}`.trim() || "Client";
  const demandeArtisanId = isAgencyView ? estimation.demandeArtisanId : null;

  const isAccepted = isAgencyView 
    ? estimation.accepte === true
    : estimation.agencies?.some((a) => (a.statut || "").toLowerCase().includes("accept"));
  const acceptedAgency = isAgencyView 
    ? null
    : estimation.agencies?.find((a) => (a.statut || "").toLowerCase().includes("accept"));
  const msgCount = acceptedAgency?.messages?.filter((m) => m.from === "agency").length || 0;

  const handleAccept = async () => {
    if (!onRespond) return;
    setIsAccepting(true);
    await onRespond(demandeArtisanId, true);
    setIsAccepting(false);
  };

  const handleRefuse = async () => {
    if (!onRespond) return;
    setIsRefusing(true);
    await onRespond(demandeArtisanId, false);
    setIsRefusing(false);
  };

  const getStatusIcon = () => {
    if (sc.label === "Acceptée") return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (sc.label === "En attente") return <Clock className="w-4 h-4 text-yellow-600" />;
    if (sc.label === "Refusée") return <X className="w-4 h-4 text-red-600" />;
    return <Info className="w-4 h-4" style={{ color: theme.secondaryText }} />;
  };

  const getStatusColor = () => {
    if (sc.label === "Acceptée") return "bg-green-50 text-green-700 border-green-200";
    if (sc.label === "En attente") return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (sc.label === "Refusée") return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const desktopView = () => (
    <div 
      className="rounded-2xl border p-6 hover:shadow-lg transition-all duration-500 group relative overflow-hidden"
      style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
        <div className="flex-1 flex flex-col md:flex-row gap-6">
          <div 
            className="relative overflow-hidden rounded-xl min-w-[80px] w-20 h-20 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: `${theme.primaryDark}20`, border: `1px solid ${theme.separator}` }}
          >
            <div className="text-4xl">
              {PROPERTY_ICONS[propertyType] || "🏠"}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h3 
                className="font-bold text-lg md:text-xl group-hover:text-green-700 transition-colors duration-300"
                style={{ color: theme.logo }}
              >
                {PROPERTY_LABELS[propertyType] || propertyType} · {surface} m²
              </h3>
              <p className="text-sm flex items-center gap-2 mt-2">
                <span 
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                  style={{ backgroundColor: `${theme.separator}20`, color: theme.secondaryText }}
                >
                  <MapPin className="w-3 h-3" />
                  {address ? `${address}, ` : ""}{commune}
                </span>
              </p>
            </div>

            {/* Info supplémentaire selon le mode */}
            <div className="mt-2">
              {isAgencyView ? (
                <p className="text-xs text-gray-400">
                  Demandé par : <strong>{expediteurNom}</strong> • {expediteur?.email || ""} • {expediteur?.phone || ""}
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  {estimation.agencies?.length || 0} professionnel{estimation.agencies?.length > 1 ? "s" : ""} contacté{estimation.agencies?.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-3 min-w-[160px]">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{sc.label}</span>
          </div>
          <div className="text-sm flex items-center gap-2" style={{ color: theme.secondaryText }}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(estimation.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Affichage des agences (seulement pour la vue client) */}
      {!isAgencyView && estimation.agencies && estimation.agencies.length > 0 && (
        <div className="mb-6 space-y-3">
          {estimation.agencies.map((agency) => {
            const asc = statutCfg(agency.statut);
            const isAgencyAccepted = (agency.statut || "").toLowerCase().includes("accept");
            const isAgencyRefused = (agency.statut || "").toLowerCase().includes("refus");
            const agencyMsgCount = agency.messages?.filter((m) => m.from === "agency").length || 0;

            return (
              <div
                key={agency.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isAgencyAccepted
                    ? "border-green-200 bg-green-50/30"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primaryDark}10`, border: `1px solid ${theme.separator}` }}
                >
                  <Building2 className="w-4 h-4" style={{ color: theme.primaryDark }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: theme.logo }}>{agency.name}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${asc.color}`}>
                      <span className="w-1 h-1 rounded-full" style={{ background: asc.dot }} />
                      {asc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {agency.rating}
                    </span>
                    <span className="text-gray-400">{agency.city}</span>
                    {agency.estimatedPrice && (
                      <span className="font-bold px-2 py-0.5 rounded-full" style={{ color: theme.primaryDark, backgroundColor: `${theme.primaryDark}10` }}>
                        {agency.estimatedPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isAgencyAccepted ? (
                    <Link
                      to={`/pro/estimations/messages/${estimation.id}`}
                      state={{ estimation, agency }}
                      className="relative bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 group/btn border border-green-200 text-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Voir détails
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      {agencyMsgCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                          {agencyMsgCount}
                        </span>
                      )}
                    </Link>
                  ) : isAgencyRefused ? (
                    <div className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100">
                      <Ban className="w-3 h-3" />
                      Refusé
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-100">
                      <Clock className="w-3 h-3" />
                      En attente
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Aperçu des détails du bien pour la vue agence */}
      {isAgencyView && (
        <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="font-medium" style={{ color: theme.logo }}>Type :</span> {PROPERTY_LABELS[propertyType] || propertyType}
            </span>
            <span className="flex items-center gap-2">
              <span>📐</span>
              <span className="font-medium" style={{ color: theme.logo }}>Surface :</span> {surface} m²
            </span>
            {rooms !== "—" && (
              <span className="flex items-center gap-2">
                <span>🚪</span>
                <span className="font-medium" style={{ color: theme.logo }}>Pièces :</span> {rooms}
              </span>
            )}
          </div>
          {estimation.description && (
            <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
              <span className="font-medium" style={{ color: theme.logo }}>Message :</span> "{estimation.description}"
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t" style={{ borderColor: theme.separator }}>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
            style={{ backgroundColor: `${theme.separator}20`, color: theme.secondaryText }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.separator}40`; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${theme.separator}20`; }}
          >
            <FileText className="w-4 h-4" />
            {showDetails ? "Masquer détails" : "Voir détails"}
          </button>
        </div>

        <div className="flex gap-3">
          {/* Vue agence : boutons Accepter/Refuser */}
          {isAgencyView && sc.label === "En attente" && (
            <>
              <button
                onClick={handleAccept}
                disabled={isAccepting || loadingRespond}
                className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isAccepting ? "Envoi..." : "Accepter"}
              </button>
              <button
                onClick={handleRefuse}
                disabled={isRefusing || loadingRespond}
                className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {isRefusing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                {isRefusing ? "Envoi..." : "Refuser"}
              </button>
            </>
          )}

          {/* Vue agence : bouton Voir la conversation quand acceptée */}
          {isAgencyView && sc.label === "Acceptée" && (
            <Link
              to={`/pro/estimations/messages/${estimation.id}`}
              state={{ estimation, agency: { name: expediteurNom, id: expediteur?.id } }}
              className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            >
              <MessageSquare className="w-4 h-4" />
              Voir la conversation
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          {/* Vue client : boutons Annuler/Supprimer */}
          {!isAgencyView && estimation.statut === "en attente" && (
            <button
              onClick={() => onCancel(estimation.id)}
              className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 border"
              style={{ borderColor: theme.separator, color: "#DC2626" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FEE2E2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          )}
          {!isAgencyView && (estimation.statut === "refusée" || estimation.statut === "acceptée") && (
            <button
              onClick={() => onDelete(estimation.id)}
              className="p-2.5 rounded-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: `${theme.separator}20`, color: theme.secondaryText }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.separator}40`; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${theme.separator}20`; }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Details expandable section */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.separator }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2" style={{ color: theme.logo }}>
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: theme.primaryDark }}></div>
                Informations du bien
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4" style={{ color: theme.secondaryText }} />
                  <span style={{ color: theme.secondaryText }}>
                    <span className="font-medium" style={{ color: theme.logo }}>Type :</span> {PROPERTY_LABELS[propertyType] || propertyType}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4" /> 📐
                  <span style={{ color: theme.secondaryText }}>
                    <span className="font-medium" style={{ color: theme.logo }}>Surface :</span> {surface} m²
                  </span>
                </div>
                {rooms !== "—" && (
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4" /> 🚪
                    <span style={{ color: theme.secondaryText }}>
                      <span className="font-medium" style={{ color: theme.logo }}>Pièces :</span> {rooms}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" style={{ color: theme.secondaryText }} />
                  <span style={{ color: theme.secondaryText }}>
                    <span className="font-medium" style={{ color: theme.logo }}>Adresse :</span> {address ? `${address}, ` : ""}{commune}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2" style={{ color: theme.logo }}>
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: theme.logo }}></div>
                {isAgencyView ? "Informations du demandeur" : "Détails de la demande"}
              </h4>
              <div className="space-y-3 text-sm">
                {isAgencyView ? (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4" style={{ color: theme.secondaryText }} />
                      <span style={{ color: theme.secondaryText }}>
                        <span className="font-medium" style={{ color: theme.logo }}>Nom :</span> {expediteurNom}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" style={{ color: theme.secondaryText }} />
                      <span style={{ color: theme.secondaryText }}>
                        <span className="font-medium" style={{ color: theme.logo }}>Email :</span> {expediteur?.email || "Non renseigné"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4" style={{ color: theme.secondaryText }} />
                      <span style={{ color: theme.secondaryText }}>
                        <span className="font-medium" style={{ color: theme.logo }}>Téléphone :</span> {expediteur?.phone || "Non renseigné"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" style={{ color: theme.secondaryText }} />
                      <span style={{ color: theme.secondaryText }}>
                        <span className="font-medium" style={{ color: theme.logo }}>Date :</span> {formatDate(estimation.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4" /> 📄
                      <span style={{ color: theme.secondaryText }}>
                        <span className="font-medium" style={{ color: theme.logo }}>Réf. :</span> #{estimation.id?.toString().slice(-6) || "—"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showActions && (
        <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
      )}
    </div>
  );

  const mobileView = () => (
    <div 
      className="rounded-xl border p-4 hover:shadow-lg transition-all duration-500"
      style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">{PROPERTY_ICONS[propertyType] || "🏠"}</div>
            <h3 className="font-bold text-base" style={{ color: theme.logo }}>
              {PROPERTY_LABELS[propertyType] || propertyType} · {surface} m²
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs mb-2" style={{ color: theme.secondaryText }}>
            <MapPin className="w-3 h-3" />
            <span className="truncate">{commune}</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            {getStatusIcon()}
            {sc.label}
          </div>
        </div>

        <button onClick={() => setShowDetails(!showDetails)} className="p-2" style={{ color: theme.secondaryText }}>
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs mb-4" style={{ color: theme.secondaryText }}>
        {isAgencyView ? (
          <>
            <User className="w-3 h-3" />
            <span className="truncate">{expediteurNom}</span>
            <span>•</span>
          </>
        ) : (
          <Calendar className="w-3 h-3" />
        )}
        <span>{formatDate(estimation.createdAt)}</span>
        {!isAgencyView && (
          <>
            <span>•</span>
            <span>{estimation.agencies?.length || 0} pro contacté(s)</span>
          </>
        )}
      </div>

      {!isAgencyView && acceptedAgency && (
        <div className="mb-4 p-3 rounded-xl border border-green-200 bg-green-50/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" style={{ color: theme.primaryDark }} />
              <span className="font-semibold text-sm" style={{ color: theme.logo }}>{acceptedAgency.name}</span>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Acceptée</span>
          </div>
          {acceptedAgency.estimatedPrice && (
            <div className="text-xs font-bold mb-2" style={{ color: theme.primaryDark }}>
              Estimation : {acceptedAgency.estimatedPrice}
            </div>
          )}
          <Link
            to={`/pro/estimations/messages/${estimation.id}`}
            state={{ estimation, agency: acceptedAgency }}
            className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border border-green-200"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Voir les messages
            {msgCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {msgCount}
              </span>
            )}
          </Link>
        </div>
      )}

      <div className="flex gap-2">
        {isAgencyView && sc.label === "En attente" && (
          <>
            <button
              onClick={handleAccept}
              disabled={isAccepting || loadingRespond}
              className="flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-green-600 text-white disabled:opacity-50"
            >
              {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Accepter
            </button>
            <button
              onClick={handleRefuse}
              disabled={isRefusing || loadingRespond}
              className="flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border border-red-300 text-red-600 disabled:opacity-50"
            >
              {isRefusing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
              Refuser
            </button>
          </>
        )}
        {isAgencyView && sc.label === "Acceptée" && (
          <Link
            to={`/pro/estimations/messages/${estimation.id}`}
            className="flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200"
          >
            <MessageSquare className="w-4 h-4" />
            Voir la conversation
          </Link>
        )}
        {!isAgencyView && (estimation.statut === "refusée" || estimation.statut === "acceptée") && (
          <button
            onClick={() => onDelete(estimation.id)}
            className="flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border"
            style={{ borderColor: theme.separator, color: "#DC2626" }}
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        )}
        {!isAgencyView && estimation.statut === "en attente" && (
          <button
            onClick={() => onCancel(estimation.id)}
            className="flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border"
            style={{ borderColor: theme.separator, color: "#DC2626" }}
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        )}
      </div>

      {showDetails && (
        <div className="pt-4 mt-4 border-t space-y-4" style={{ borderColor: theme.separator }}>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: theme.logo }}>
              {isAgencyView ? "Détails du demandeur" : "Détails du bien"}
            </h4>
            <div className="space-y-2 text-sm">
              {isAgencyView ? (
                <>
                  <div className="flex items-center gap-2" style={{ color: theme.secondaryText }}>
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{expediteur?.email || "Email non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: theme.secondaryText }}>
                    <Phone className="w-4 h-4" />
                    <span>{expediteur?.phone || "Téléphone non renseigné"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2" style={{ color: theme.secondaryText }}>
                    <Building2 className="w-4 h-4" />
                    <span>{PROPERTY_LABELS[propertyType]}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: theme.secondaryText }}>
                    <span>📐</span>
                    <span>{surface} m²</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return isMobile ? mobileView() : desktopView();
};

// ─── Main Page Component (MODIFIÉ POUR GÉRER LES DEUX MODES) ──────────────────
const ListeDemandesEstimation = () => {
  const { user, isAuthenticated } = useAuth();
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRespond, setLoadingRespond] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isAgencyView, setIsAgencyView] = useState(false); // Mode par défaut : client

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Déterminer si l'utilisateur est une agence (userType === "AGENCE")
  useEffect(() => {
    if (user?.userType === "AGENCE" || user?.role === "professional") {
      setIsAgencyView(true);
    }
  }, [user]);

  // Tabs configuration
  const tabs = [
    { id: "all", label: "Toutes" },
    { id: "en_attente", label: "En attente" },
    { id: "acceptee", label: "Acceptées" },
    { id: "refusee", label: "Refusées" },
  ];

  // Chargement depuis l'API (selon le mode)
  const fetchData = async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let resp;
      
      if (isAgencyView) {
        // Mode agence : récupérer les estimations reçues
        resp = await api.get(`/estimations/destinataire`);
        setEstimations(resp.data.estimations || []);
      } else {
        // Mode client : récupérer les estimations envoyées
        resp = await api.get(`/estimations/expediteur`);
        setEstimations(resp.data.estimations || []);
      }
    } catch (error) {
      console.error("Erreur chargement estimations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos estimations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAgencyView !== undefined) {
      fetchData();
    }
  }, [user?.id, isAuthenticated, isAgencyView]);

  // Statistiques (selon le mode)
  const stats = {
    all: estimations.length,
    en_attente: isAgencyView 
      ? estimations.filter((e) => e.accepte === null || e.accepte === undefined).length
      : estimations.filter((e) => (e.statut || "").toLowerCase().includes("attente")).length,
    acceptee: isAgencyView
      ? estimations.filter((e) => e.accepte === true).length
      : estimations.filter((e) => (e.statut || "").toLowerCase().includes("accept")).length,
    refusee: isAgencyView
      ? estimations.filter((e) => e.accepte === false).length
      : estimations.filter((e) => (e.statut || "").toLowerCase().includes("refus")).length,
  };

  const totalAccepted = isAgencyView
    ? stats.acceptee
    : estimations.reduce(
        (acc, e) => acc + (e.agencies || []).filter((a) => (a.statut || "").toLowerCase().includes("accept")).length,
        0
      );

  // Filtrage (selon le mode)
  const filteredEstimations = estimations.filter((e) => {
    let matchTab = true;
    if (isAgencyView) {
      if (activeTab === "en_attente") matchTab = e.accepte === null || e.accepte === undefined;
      else if (activeTab === "acceptee") matchTab = e.accepte === true;
      else if (activeTab === "refusee") matchTab = e.accepte === false;
    } else {
      matchTab =
        activeTab === "all" ||
        (activeTab === "en_attente" && (e.statut || "").toLowerCase().includes("attente")) ||
        (activeTab === "acceptee" && (e.statut || "").toLowerCase().includes("accept")) ||
        (activeTab === "refusee" && (e.statut || "").toLowerCase().includes("refus"));
    }

    const q = searchTerm.toLowerCase();
    let matchSearch = false;
    
    if (isAgencyView) {
      const expediteur = e.expediteur || {};
      const expediteurNom = expediteur.companyName || `${expediteur.firstName || ""} ${expediteur.lastName || ""}`;
      matchSearch =
        !q ||
        (e.details?.commune || "").toLowerCase().includes(q) ||
        expediteurNom.toLowerCase().includes(q) ||
        (expediteur.email || "").toLowerCase().includes(q);
    } else {
      matchSearch =
        !q ||
        (e.commune || "").toLowerCase().includes(q) ||
        (e.address || "").toLowerCase().includes(q) ||
        (PROPERTY_LABELS[e.propertyType] || "").toLowerCase().includes(q);
    }

    return matchTab && matchSearch;
  });

  // Répondre à une estimation (pour les agences)
  const handleRespond = async (demandeArtisanId, accepte) => {
    setLoadingRespond(true);
    try {
      await api.patch(`/estimations/${demandeArtisanId}/repondre`, { accepte });
      toast({
        title: "Succès",
        description: accepte ? "Estimation acceptée avec succès" : "Estimation refusée",
        variant: "default"
      });
      await fetchData();
    } catch (err) {
      console.error("Erreur réponse:", err);
      toast({
        title: "Erreur",
        description: "Impossible de répondre à la demande",
        variant: "destructive"
      });
    } finally {
      setLoadingRespond(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.patch(`/estimations/${id}/statut`, { statut: "annulée" });
      setEstimations((prev) => prev.map((e) => (e.id === id ? { ...e, statut: "annulée" } : e)));
      toast({
        title: "Succès",
        description: "Demande annulée avec succès",
        variant: "default"
      });
    } catch (err) {
      console.error("Erreur annulation:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la demande",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/estimations/${id}`);
      setEstimations((prev) => prev.filter((e) => e.id !== id));
      toast({
        title: "Succès",
        description: "Demande supprimée avec succès",
        variant: "default"
      });
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la demande",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen mt-12 p-4 md:p-6 flex items-center justify-center" style={{ backgroundColor: `${theme.separator}20` }}>
        <p style={{ color: theme.secondaryText }}>
          Veuillez vous connecter pour voir vos demandes d'estimation.
        </p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner text="Chargement des estimations" />;

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: `${theme.separator}20` }}>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8" style={{ color: theme.primaryDark }} />
              <h1 className="text-xl md:text-3xl font-bold" style={{ color: theme.logo }}>
                {isAgencyView ? "Demandes d'estimation reçues" : "Mes demandes d'estimation"}
              </h1>
            </div>
            <p style={{ color: theme.secondaryText }} className="text-sm md:text-base">
              {isAgencyView 
                ? `${stats.all} demande${stats.all > 1 ? "s" : ""} reçue${stats.all > 1 ? "s" : ""} · ${stats.acceptee} acceptée${stats.acceptee > 1 ? "s" : ""}`
                : `${estimations.length} demande${estimations.length > 1 ? "s" : ""} · ${totalAccepted} réponse${totalAccepted > 1 ? "s" : ""} reçue${totalAccepted > 1 ? "s" : ""}`
              }
            </p>
          </div>

          <button
            onClick={fetchData}
            className="flex-1 md:flex-none text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.secondaryText }}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">Actualiser</span>
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
          {[
            { label: isAgencyView ? "Total reçues" : "Total", value: stats.all, color: "bg-white" },
            { label: "En attente", value: stats.en_attente, color: "bg-yellow-50" },
            { label: "Acceptées", value: stats.acceptee, color: "bg-green-50" },
            { label: "Refusées", value: stats.refusee, color: "bg-red-50" },
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`${stat.color} rounded-lg md:rounded-xl p-3 md:p-4 border text-center shadow-sm`} 
              style={{ borderColor: theme.separator }}
            >
              <div className="text-lg md:text-2xl font-bold" style={{ color: theme.logo }}>{stat.value}</div>
              <div className="text-xs md:text-sm" style={{ color: theme.secondaryText }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Barre de recherche */}
        <div 
          className="rounded-lg md:rounded-xl p-3 md:p-4 border mb-4 md:mb-6 shadow-sm"
          style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}
        >
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <div className="flex-1 w-full relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.secondaryText }} />
              <input
                type="text"
                placeholder={isAgencyView ? "Rechercher par commune, client, email…" : "Rechercher par commune, adresse, type de bien…"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 text-sm md:text-base"
                style={{
                  borderColor: theme.separator,
                  backgroundColor: theme.lightBg,
                  color: theme.logo
                }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div 
          className="flex items-center space-x-1 rounded-lg md:rounded-xl p-1 md:p-2 border mb-4 md:mb-8 shadow-sm overflow-x-auto"
          style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}
        >
          {tabs.map((tab) => {
            let count = 0;
            if (tab.id === "all") count = stats.all;
            else if (tab.id === "en_attente") count = stats.en_attente;
            else if (tab.id === "acceptee") count = stats.acceptee;
            else if (tab.id === "refusee") count = stats.refusee;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium rounded-md md:rounded-lg transition-all duration-200 flex items-center gap-1 md:gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? "text-white shadow-md" : "hover:bg-gray-100"
                }`}
                style={activeTab === tab.id ? { backgroundColor: theme.primaryDark } : { color: theme.secondaryText }}
              >
                {tab.label}
                <span className={`px-1.5 md:px-2 py-0.5 md:py-1 text-xs rounded-full ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-200"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Liste des demandes */}
        <div className="space-y-4 md:space-y-6">
          {filteredEstimations.length > 0 ? (
            filteredEstimations.map((e) => (
              <EstimationCard
                key={e.id}
                estimation={e}
                onDelete={handleDelete}
                onCancel={handleCancel}
                onRespond={handleRespond}
                loadingRespond={loadingRespond}
                isMobile={isMobile}
                isAgencyView={isAgencyView}
              />
            ))
          ) : (
            <div 
              className="rounded-lg md:rounded-2xl border p-6 md:p-12 text-center shadow-sm"
              style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}
            >
              <div 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${theme.separator}20` }}
              >
                <Home className="w-6 h-6 md:w-8 md:h-8" style={{ color: theme.secondaryText }} />
              </div>
              <h4 className="text-base md:text-lg font-medium mb-2" style={{ color: theme.logo }}>
                {isAgencyView 
                  ? `Aucune demande ${activeTab !== "all" ? activeTab.replace("_", " ") : "reçue"}`
                  : `Aucune demande ${activeTab !== "all" ? activeTab.replace("_", " ") : ""}`
                }
              </h4>
              <p className="text-sm md:text-base mb-6" style={{ color: theme.secondaryText }}>
                {activeTab !== "all"
                  ? "Essayez de sélectionner une autre catégorie."
                  : isAgencyView 
                    ? "Vous n'avez pas encore reçu de demande d'estimation immobilière."
                    : "Vous n'avez pas encore envoyé de demande d'estimation."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeDemandesEstimation;