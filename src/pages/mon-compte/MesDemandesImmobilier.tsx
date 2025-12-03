import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  MapPin,
  Calendar,
  ArrowRight,
  Clock,
  Trash2,
  Phone,
  Mail,
  User,
  DollarSign,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const DemandeImmoCard = ({
  demande,
  onDeleted,
  onStatusChange,
  onAddHistory,
}: any) => {
  // Helpers for safe display
  const formatDate = (d: any) => {
    const dateStr = d?.createdAt || d?.date;
    if (!dateStr) return "—";
    const dt = new Date(dateStr);
    if (isNaN(dt.getTime())) return String(dateStr);
    return dt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatLieu = () => {
    // prefer composed adresse fields, then lieu, then fallback
    const parts = [
      demande?.lieuAdresse,
      demande?.lieuAdresseVille,
      demande?.lieuAdresseCp,
    ].filter(Boolean);
    const joined = parts.join(", ");
    if (joined) return joined;
    if (
      demande?.lieu &&
      typeof demande.lieu === "string" &&
      !/null/i.test(demande.lieu)
    )
      return demande.lieu;
    return "Adresse non renseignée";
  };

  const formatHeure = (d: any) => {
    return demande?.heureSouhaitee || "—";
  };

  const statutColor = (statut: string) => {
    switch ((statut || "").toLowerCase()) {
      case "en attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "en cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "devis reçus":
        return "bg-green-100 text-green-800 border-green-200";
      case "terminé":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  // Fonction pour les styles de statut version sombre
  const getStatutStyles = (statut) => {
    const baseStyles = "backdrop-blur-sm border";

    switch (statut?.toLowerCase()) {
      case "en cours":
      case "pending":
        return `${baseStyles} bg-orange-500/10 text-orange-300 border-orange-500/30`;
      case "terminé":
      case "completed":
        return `${baseStyles} bg-green-500/10 text-green-300 border-green-500/30`;
      case "annulé":
      case "cancelled":
        return `${baseStyles} bg-red-500/10 text-red-300 border-red-500/30`;
      case "confirmé":
      case "confirmed":
        return `${baseStyles} bg-blue-500/10 text-blue-300 border-blue-500/30`;
      default:
        return `${baseStyles} bg-gray-500/10 text-gray-300 border-gray-500/30`;
    }
  };
  return (
    <div className=" bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-2xl border border-gray-700 p-4 md:p-6 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 group">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-3">
          <div className="flex-1 flex gap-3 md:gap-2 pr-0 md:pr-4">
            {demande.property?.images?.length > 0 && (
              <img
                src={demande.property.images[0]}
                alt={demande.property?.title || "Propriété"}
                className="w-24 h-20 md:w-32 md:h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex flex-col">
              <h3 className="font-bold text-white text-base md:text-xl group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                {demande.property?.title || "Demande pour un bien"}
              </h3>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold tracking-wider">
                  <span className="text-white font-bold tracking-wider">
                    {(() => {
                      const price = demande.property?.price;
                      const duration = demande.property?.duration;
                      const status = demande.property?.status;
                      const rentType = demande.property?.rentType;

                      if (!price) return "—";

                      // Formatter le prix avec l'euro
                      const formattedPrice = `${price.toLocaleString(
                        "fr-FR"
                      )}€`;

                      if (status === "for_rent") {
                        // Pour les locations
                        if (rentType === "saisonniere") {
                          return `${formattedPrice}/jour`;
                        }
                        return `${formattedPrice}/mois`;
                      }

                      // Pour les ventes
                      return formattedPrice;
                    })()}
                  </span>
                </span>
              </div>

              {/* Localisation */}
              <div className="mt-2 md:mt-3 flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-xs md:text-sm line-clamp-1">
                  {demande.property?.address || formatLieu()}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-400 mt-3 md:mt-4 mb-3 line-clamp-2 md:line-clamp-3 leading-relaxed text-xs md:text-sm">
                <span className="underline">Déscription </span>: &nbsp;
                {demande.property?.description || "Aucune description fournie."}
              </p>
            </div>
          </div>

          {/* Statut et Date */}
          <div className="w-full md:w-auto text-left md:text-right min-w-[unset] md:min-w-[120px]">
            <div className="flex md:justify-end items-center gap-2 text-gray-400 text-xs md:text-sm mb-2 md:mb-3">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{formatDate(demande)}</span>
            </div>
            <div className="flex md:justify-end items-center gap-2 text-gray-400 text-xs md:text-sm mb-2 md:mb-3">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{formatHeure(demande)}</span>
            </div>
            {/* <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${statutColor(demande.statut)}`}>
                            <div className="w-2 h-2 rounded-full mr-2 bg-current opacity-80"></div>
                            {demande.statut || '—'}
                        </div> */}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-700/50 pt-3 md:pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4">
          {/* Action Button */}
          <div className="flex items-center gap-2 order-2 md:order-1">
            <Link
              to={
                demande.propertyId || demande.property?.id
                  ? `/immobilier/${demande.propertyId || demande.property?.id}`
                  : "#"
              }
              className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-blue-500/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <span>Voir le bien</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Actions: pending -> allow cancel. If validated or refused -> allow delete. Otherwise show badge */}
          <div className="order-1 md:order-2">
            {(() => {
              const status = String(demande.statut || "").toLowerCase();

              if (["en attente", "en cours"].includes(status)) {
                return (
                  <div className="flex items-center gap-2">
                    <CancelButton
                      demande={demande}
                      onDeleted={onDeleted}
                      onAddHistory={onAddHistory}
                      onStatusChange={onStatusChange}
                    />
                    <span className="px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold bg-orange-500 text-white">
                      En attente
                    </span>
                  </div>
                );
              }

              if (/refus/i.test(status)) {
                return (
                  <div className="flex items-center gap-2">
                    <DeleteButton
                      demande={demande}
                      onDeleted={onDeleted}
                      onAddHistory={onAddHistory}
                      onStatusChange={onStatusChange}
                    />
                    <span className="px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold bg-red-500 text-white">
                      Refusée
                    </span>
                  </div>
                );
              }

              if (/validée|validee|valide/i.test(status)) {
                console.log("Demande:", demande);
                console.log("Status:", status);
                console.log("Property:", demande.property);
                console.log("Owner:", demande.property?.owner);
                return (
                  <div className="flex items-center gap-2">
                    <DeleteButton
                      demande={demande}
                      onDeleted={onDeleted}
                      onAddHistory={onAddHistory}
                      onStatusChange={onStatusChange}
                    />
                    <span className="px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold bg-green-500 text-white">
                      Validée
                    </span>

                    {/* Informations de contact du propriétaire */}
                    {demande.property?.owner && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-300 px-2.5 py-1.5 rounded-lg">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs md:text-sm">
                            {demande.property.owner.phone || "Non renseigné"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-300 px-2.5 py-1.5 rounded-lg">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs md:text-sm">
                            {demande.property.owner.email || "Non renseigné"}
                          </span>
                        </div>
                        {demande.property.owner.companyName && (
                          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-300 px-2.5 py-1.5 rounded-lg">
                            <User className="w-4 h-4" />
                            <span className="text-xs md:text-sm">
                              {demande.property.owner.companyName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div className="px-2 md:px-4  py-2">
                  <span
                    className={`grid grid-cols-2 items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatutStyles(
                      demande.statut
                    )}`}
                  >
                    {demande.statut}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResendButton = ({ demande, onStatusChange }: any) => {
  const [sending, setSending] = React.useState(false);
  const handleResend = async () => {
    let toastRef: any = null;
    toastRef = toast({
      title: "Confirmer le renvoi",
      description: "Cliquez confirmer pour renvoyer la demande.",
      action: (
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
          onClick={async () => {
            toastRef?.dismiss?.();
            setSending(true);
            try {
              await api.patch(`/demandes/${demande.id}/statut`, {
                statut: "en attente",
              });
              onStatusChange?.(demande.id, "en attente");
              toast({
                title: "Demande renvoyée",
                description: "Votre demande est de nouveau en attente.",
              });
            } catch (err) {
              console.error("Erreur en renvoyant la demande", err);
              const msg =
                err?.response?.data?.error ||
                err?.message ||
                "Impossible de renvoyer la demande.";
              toast({ title: "Erreur", description: msg });
            } finally {
              setSending(false);
            }
          }}
        >
          Confirmer
        </button>
      ),
    });
  };

  return (
    <button
      onClick={handleResend}
      disabled={sending}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
    >
      {sending ? "Envoi..." : "Renvoyer"}
    </button>
  );
};

const CancelButton = ({
  demande,
  onDeleted,
  onAddHistory,
  onStatusChange,
}: any) => {
  const [deleting, setDeleting] = React.useState(false);
  const handleCancel = async () => {
    let toastRef: any = null;
    toastRef = toast({
      title: "Confirmer l'annulation",
      description: "Confirmez pour annuler cette demande.",
      action: (
        <button
          className="px-3 py-1 rounded bg-red-600 text-white text-sm"
          onClick={async () => {
            toastRef?.dismiss?.();
            setDeleting(true);
            try {
              // create a history entry locally (optimistic)
              const entry = {
                title: "Demande annulée",
                message: "Vous avez annulé cette demande.",
                date: new Date().toISOString(),
                demandeId: demande.id,
                _sourceTitre: demande.titre,
              };
              try {
                onAddHistory?.(entry);
              } catch (e) {
                /* ignore */
              }

              await api.patch(`/demandes/${demande.id}/statut`, {
                statut: "annulée",
              });
              onStatusChange?.(demande.id, "annulée");
              toast({ title: "Demande annulée" });
            } catch (err) {
              console.error("Erreur lors de l'annulation de la demande", err);
              toast({
                title: "Erreur",
                description:
                  "Impossible d'annuler la demande. Réessayez plus tard.",
              });
            } finally {
              setDeleting(false);
            }
          }}
        >
          Confirmer
        </button>
      ),
    });
  };

  return (
    <button
      onClick={handleCancel}
      disabled={deleting}
      className="bg-transparent text-red-400 border border-red-500/20 hover:bg-red-500/5 px-4 py-2 rounded-lg text-sm font-semibold transition"
    >
      {deleting ? "Annulation..." : "Annuler"}
    </button>
  );
};

const DeleteButton = ({
  demande,
  onDeleted,
  onAddHistory,
  onStatusChange,
}: any) => {
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {
    let toastRef: any = null;
    toastRef = toast({
      title: "Confirmer la suppression",
      description: "Cette action supprimera définitivement la demande.",
      action: (
        <button
          className="px-3 py-1 rounded bg-red-600 text-white text-sm"
          onClick={async () => {
            toastRef?.dismiss?.();
            setDeleting(true);
            try {
              // create a history entry locally (optimistic)
              const entry = {
                title: "Demande supprimée",
                message: "Vous avez supprimé cette demande.",
                date: new Date().toISOString(),
                demandeId: demande.id,
                _sourceTitre: demande.titre,
              };
              try {
                onAddHistory?.(entry);
              } catch (e) {
                /* ignore */
              }

              // Pour l'utilisateur, on fait une vraie suppression avec le paramètre hardDelete
              const response = await api.delete(
                `/demandes/immobilier/${demande.id}?hardDelete=true`
              );
              if (
                response.data.message === "Demande supprimée définitivement"
              ) {
                onDeleted?.(demande.id);
                toast({
                  title: "Supprimé",
                  description: "La demande a été supprimée définitivement.",
                });
              } else {
                toast({
                  title: "Erreur",
                  description:
                    "Une erreur est survenue lors de la suppression.",
                });
              }
            } catch (err) {
              console.error("Erreur lors de la suppression de la demande", err);
              toast({
                title: "Erreur",
                description:
                  "Impossible de supprimer la demande pour le moment.",
              });
            } finally {
              setDeleting(false);
            }
          }}
        >
          Confirmer
        </button>
      ),
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="bg-transparent text-red-400 border border-red-500/20 hover:bg-red-500/5 px-4 py-2 rounded-lg text-sm font-semibold transition"
    >
      {deleting ? "Suppression..." : "Supprimer"}
    </button>
  );
};

const MesDemandesImmobilier = () => {
  const { user, isAuthenticated } = useAuth();
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [activeDemande, setActiveDemande] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredDemandes = React.useMemo(() => {
    if (activeTab === "all") return demandes;
    return demandes.filter((demande) => {
      const status = (demande.statut || "").toLowerCase();
      switch (activeTab) {
        case "en_attente":
          return status === "en attente";
        case "validees":
          return (
            status === "validée" || status === "validee" || status === "valide"
          );
        case "refusees":
          return (
            status === "refusée" || status === "refusee" || status === "refus"
          );
        case "archivees":
          return (
            demande.archived || status === "archivée" || status === "archivee"
          );
        default:
          return true;
      }
    });
  }, [demandes, activeTab]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const load = async () => {
      setLoading(true);
      try {
        const resp = await api.get(`/demandes/immobilier/user/${user.id}`);
        const all = resp.data || [];
        console.log("Données reçues de l'API:", all);
        setDemandes(all); // Émettre un événement pour recharger les notifications
        window.dispatchEvent(new CustomEvent("notifications:reload"));
      } catch (err) {
        console.error("Erreur en chargeant demandes immobilières", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    const handler = (e: any) => {
      const detail = e?.detail || {};
      // support both shapes: { id, statut } and { demandeId, status }
      const id = detail.id || detail.demandeId;
      const statut = detail.statut || detail.status;
      if (!id) return;
      setDemandes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, statut } : d))
      );
    };
    window.addEventListener("demande:statusChanged", handler as EventListener);
    return () =>
      window.removeEventListener(
        "demande:statusChanged",
        handler as EventListener
      );
  }, [isAuthenticated, user?.id]);

  const handleDeleted = (id: string) => {
    setDemandes((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddHistory = (entry: any) => {
    // prepend to historyItems so modal shows recent entries immediately (optimistic)
    const tmp = { ...entry, _optimistic: true };
    setHistoryItems((prev) => [tmp, ...(prev || [])]);
    // also attach to the demande in the list if present
    if (entry?.demandeId) {
      setDemandes((prev) =>
        prev.map((d) =>
          d.id === entry.demandeId
            ? { ...d, history: [...(d.history || []), tmp] }
            : d
        )
      );
      // try to persist on server
      (async () => {
        try {
          const resp = await api.post(`/demandes/${entry.demandeId}/history`, {
            entry,
          });
          const serverHistory = resp.data?.history || [];
          // replace optimistic entries for that demande with server data
          setDemandes((prev) =>
            prev.map((d) =>
              d.id === entry.demandeId ? { ...d, history: serverHistory } : d
            )
          );
          // replace the global historyItems with server entries merged with local
          setHistoryItems((prev) => {
            // remove optimistic entries for this demande
            const cleaned = (prev || []).filter(
              (it: any) => !(it._optimistic && it.demandeId === entry.demandeId)
            );
            // prepend server entries
            return [...(serverHistory || []), ...cleaned];
          });
        } catch (err) {
          console.error(
            "Impossible de sauvegarder l'historique sur le serveur",
            err
          );
          toast({
            title: "Erreur",
            description:
              "Impossible de sauvegarder l'historique sur le serveur.",
          });
        }
      })();
    }
  };

  const handleStatusChange = (id: string, statut: string) => {
    setDemandes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, statut } : d))
    );
  };

  const openHistory = async (demande: any) => {
    setActiveDemande(demande);
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      if (demande.history || demande.histories || demande.events) {
        setHistoryItems(
          demande.history || demande.histories || demande.events || []
        );
        return;
      }

      // try backend
      try {
        const resp = await api.get(
          `/demandes/immobilier/${demande.id}/history`
        );
        setHistoryItems(resp.data || []);
        return;
      } catch (err) {
        // fallback to fetching demande and inspect
      }

      try {
        const r2 = await api.get(`/demandes/immobilier/${demande.id}`);
        const dd = r2.data || {};
        setHistoryItems(dd.history || dd.histories || dd.events || []);
      } catch (err2) {
        setHistoryItems([]);
      }
    } catch (e) {
      console.error("Erreur openHistory", e);
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen mt-12 bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            Veuillez vous connecter pour voir vos demandes immobilières.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Chargement des demandes immobilières" />;
  }

  return (
    <div className="min-h-screen mt-12">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex relative overflow-hidden h-24 lg:h-44 w-full items-center gap-3">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40 backdrop-blur-[1px]"></div>
            {/* Effet de lumière */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>

            <img
              className="absolute -z-0 w-full opacity-45 object-cover object-center"
              src="https://i.pinimg.com/1200x/23/26/d5/2326d5fc9fdbff00492a8f7c6390a88c.jpg"
            />
            <h1 className="text-xl lg:text-5xl tracking-wider font-serif font-bold text-slate-100 z-10">
              Mes demandes immobilières
            </h1>
          </div>
          {/* <button title="Historique global" onClick={async () => {
                        // aggregate local histories from demandes and open modal (do NOT call backend automatically to avoid 404s)
                        setHistoryLoading(true);
                        setHistoryItems([]);
                        try {
                            const collected: any[] = [];
                            for (const d of demandes) {
                                const entries = d.history || d.histories || d.events;
                                if (entries && entries.length) {
                                    for (const e of entries) collected.push({ ...e, _sourceDemandeId: d.id, _sourceTitre: d.titre });
                                }
                            }
                            setHistoryItems(collected);
                            setHistoryOpen(true);
                        } catch (e) {
                            console.error('Erreur aggregation historique', e);
                            setHistoryItems([]);
                            setHistoryOpen(true);
                        } finally {
                            setHistoryLoading(false);
                        }
                    }} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
                        <Clock className="w-5 h-5" />
                    </button> */}
          {/* <p className="text-gray-600 mt-2">Toutes les demandes de visite et demandes liées à vos biens</p> */}
        </div>

        <div className="flex flex-col space-y-4 px-6 py-2">
          {/* Tabs de filtrage */}
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200 self-stretch md:self-start overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("all")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
                activeTab === "all"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveTab("en_attente")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
                activeTab === "en_attente"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setActiveTab("validees")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
                activeTab === "validees"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Validées
            </button>
            <button
              onClick={() => setActiveTab("refusees")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
                activeTab === "refusees"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Refusées
            </button>
            <button
              onClick={() => setActiveTab("archivees")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
                activeTab === "archivees"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Archivées
            </button>
          </div>

          {/* Liste des demandes filtrées */}
          <div className="grid grid-cols-1 gap-4">
            {filteredDemandes.filter((d) => d !== null).length > 0 ? (
              filteredDemandes
                .filter((d) => d !== null)
                .map((d) => (
                  <DemandeImmoCard
                    key={d.id}
                    demande={d}
                    onDeleted={handleDeleted}
                    onStatusChange={handleStatusChange}
                    onAddHistory={handleAddHistory}
                  />
                ))
            ) : (
              <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <h4 className="text-gray-700 text-lg font-medium mb-2">
                  Aucune demande{" "}
                  {activeTab !== "all" ? "dans cette catégorie" : "immobilière"}
                </h4>
                <p className="text-gray-500 text-sm mb-6">
                  {activeTab !== "all"
                    ? "Essayez de sélectionner une autre catégorie"
                    : "Vous n'avez pas encore envoyé de demande liée à un bien."}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Global History modal (Sheet) - moved to parent so a single modal shows aggregated histories */}
        <Sheet
          open={historyOpen}
          onOpenChange={async (open) => {
            setHistoryOpen(open);
            if (!open) {
              setActiveDemande(null);
              setHistoryItems([]);
            } else if (user?.id) {
              // Charger automatiquement l'historique à l'ouverture
              setHistoryLoading(true);
              try {
                const resp = await api.get(
                  `/demandes/immobilier/user/${user.id}/history`
                );
                const items = resp.data || [];
                items.sort((a: any, b: any) => {
                  const da = new Date(a.date || a.createdAt || 0).getTime();
                  const db = new Date(b.date || b.createdAt || 0).getTime();
                  return db - da;
                });
                setHistoryItems(items.map((it: any) => ({ ...it })));
              } catch (e) {
                console.error("Erreur chargement historique", e);
                setHistoryItems([]);
              } finally {
                setHistoryLoading(false);
              }
            }
          }}
        >
          <SheetTrigger asChild>
            {/* hidden trigger: we open programmatically from the button in the header */}
            <span style={{ display: "none" }} />
          </SheetTrigger>
          <SheetContent side="right" className="w-[420px] p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Historique</h4>
            </div>

            {/* Chargement automatique de l'historique lors de l'ouverture */}
            <div className="mb-3 flex items-center justify-end gap-2">
              {historyLoading && (
                <div className="text-sm text-gray-500">Chargement...</div>
              )}
            </div>

            {historyLoading ? (
              <div className="text-center text-sm text-gray-500">
                Chargement...
              </div>
            ) : historyItems && historyItems.length > 0 ? (
              <div className="space-y-3 overflow-auto max-h-[70vh]">
                {historyItems.map((h: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {h.title || h.action || h.type || "Événement"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {h.message || h.note || h.description || ""}
                        </div>
                        {h._sourceTitre && (
                          <div className="text-xs text-gray-400 mt-1">
                            Source: {h._sourceTitre}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {h.date
                          ? new Date(h.date).toLocaleString("fr-FR")
                          : h.createdAt
                          ? new Date(h.createdAt).toLocaleString("fr-FR")
                          : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500">
                Aucun historique disponible.
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MesDemandesImmobilier;
