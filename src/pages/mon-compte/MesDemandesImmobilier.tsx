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
        return `${baseStyles} bg-[#6B8E23]/10 text-[#556B2F] border-[#6B8E23]/20`;
      case "terminé":
      case "completed":
        return `${baseStyles} bg-[#556B2F]/10 text-[#556B2F] border-[#556B2F]/20`;
      case "annulé":
      case "cancelled":
        return `${baseStyles} bg-red-500/10 text-red-300 border-red-500/30`;
      case "confirmé":
      case "confirmed":
        return `${baseStyles} bg-[#6B8E23]/10 text-[#556B2F] border-[#6B8E23]/20`;
      default:
        return `${baseStyles} bg-[#D3D3D3]/10 text-[#8B4513] border-[#D3D3D3]/20`;
    }
  };
  return (
    <div className=" bg-[#FFFFFF] rounded-xl md:rounded-2xl border border-[#D3D3D3] p-4 md:p-6 hover:border-[#6B8E23]/20 hover:shadow-2xl transition-all duration-500 group">
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
              <h3 className="font-bold text-gray-900 text-base md:text-xl group-hover:text-[#556B2F] transition-colors duration-300 line-clamp-1">
                {demande.property?.title || "Demande pour un bien"}
              </h3>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#556B2F]" />
                <span className="text-gray-900 font-bold tracking-wider">
                  <span className="text-gray-900 font-bold tracking-wider">
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
              <div className="mt-2 md:mt-3 flex items-center gap-2 text-[#8B4513]">
                <MapPin className="w-4 h-4 text-[#556B2F]" />
                <span className="text-xs md:text-sm line-clamp-1">
                  {demande.property?.address || formatLieu()}
                </span>
              </div>

              {/* Description */}
              <p className="text-[#8B4513] mt-3 md:mt-4 mb-3 line-clamp-2 md:line-clamp-3 leading-relaxed text-xs md:text-sm">
                <span className="underline">Déscription </span>: &nbsp;
                {demande.property?.description || "Aucune description fournie."}
              </p>
            </div>
          </div>

          {/* Statut et Date */}
          <div className="w-full md:w-auto text-left md:text-right min-w-[unset] md:min-w-[120px]">
            <div className="flex md:justify-end items-center gap-2 text-[#8B4513] text-xs md:text-sm mb-2 md:mb-3">
              <Calendar className="w-4 h-4 text-[#556B2F]" />
              <span>{formatDate(demande)}</span>
            </div>
            <div className="flex md:justify-end items-center gap-2 text-[#8B4513] text-xs md:text-sm mb-2 md:mb-3">
              <Clock className="w-4 h-4 text-[#556B2F]" />
              <span>{formatHeure(demande)}</span>
            </div>
            {/* <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${statutColor(demande.statut)}`}>
                            <div className="w-2 h-2 rounded-full mr-2 bg-current opacity-80"></div>
                            {demande.statut || '—'}
                        </div> */}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-[#D3D3D3] pt-3 md:pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4">
          {/* Action Button */}
          <div className="flex items-center gap-2 order-2 md:order-1">
            <Link
              to={
                demande.propertyId || demande.property?.id
                  ? `/immobilier/${demande.propertyId || demande.property?.id}`
                  : "#"
              }
              className="group/btn bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#6B8E23] hover:to-[#556B2F] text-white px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-[#556B2F]/30 hover:border-[#6B8E23]/50 hover:shadow-lg hover:shadow-[#556B2F]/20"
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
                    <span className="px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold bg-[#6B8E23]/10 text-[#556B2F]">
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
                    <span className="px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold bg-red-500/10 text-red-500">
                      Refusée
                    </span>
                  </div>
                );
              }

              if (/validée|validee|valide/i.test(status)) {
                // console.log("Demande:", demande);
                // console.log("Status:", status);
                // console.log("Property:", demande.property);
                // console.log("Owner:", demande.property?.owner);
                return (
                  <div className="flex items-center gap-2">
                    <DeleteButton
                      demande={demande}
                      onDeleted={onDeleted}
                      onAddHistory={onAddHistory}
                      onStatusChange={onStatusChange}
                    />
                    <span className="px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold bg-[#6B8E23]/10 text-[#556B2F]">
                      Validée
                    </span>

                    {/* Informations de contact du propriétaire */}
                    {demande.property?.owner && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-[#6B8E23]/10 text-[#556B2F] px-2.5 py-1.5 rounded-lg">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs md:text-sm">
                            {demande.property.owner.phone || "Non renseigné"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#6B8E23]/10 text-[#556B2F] px-2.5 py-1.5 rounded-lg">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs md:text-sm">
                            {demande.property.owner.email || "Non renseigné"}
                          </span>
                        </div>
                        {demande.property.owner.companyName && (
                          <div className="flex items-center gap-2 bg-[#6B8E23]/10 text-[#556B2F] px-2.5 py-1.5 rounded-lg">
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
          className="px-3 py-1 rounded bg-[#556B2F] text-white text-sm"
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
      className="bg-[#556B2F] hover:bg-[#6B8E23] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
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


  // 🟢 LOG 1: Vérifier l'utilisateur connecté
  console.log("👤 Utilisateur connecté:", {
    id: user?.id,
    email: user?.email,
    isAuthenticated
  });


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
        // ✅ Utiliser la nouvelle route dédiée aux demandes du demandeur
        console.log(`📡 Chargement des demandes du client connecté (email: ${user?.email})...`);

        // OPTION RECOMMANDÉE : Nouvelle route dédiée
        const resp = await api.get(`/demandes/immobilier/as-demandeur/${user.id}`);

        // OPTION ALTERNATIVE : Avec paramètre type (si vous préférez)
        // const resp = await api.get(`/demandes/immobilier/user/${user.id}?type=asDemandeur`);

        console.log("✅ Demandes du client reçues:", resp.data);

        // Pas besoin de filtrer côté frontend car le backend fait déjà le travail
        setDemandes(resp.data || []);

        console.log(`📊 ${resp.data?.length || 0} demandes trouvées`);

        // Émettre un événement pour recharger les notifications
        window.dispatchEvent(new CustomEvent("notifications:reload"));
      } catch (err) {
        console.error("Erreur en chargeant demandes immobilières", err);
        if (err.response) {
          console.error("📡 Réponse d'erreur du serveur:", {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          });
        }
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
  }, [isAuthenticated, user?.id, user?.email]);

  // 🟢 LOG 7: Surveiller les changements de demandes
  useEffect(() => {
    console.log("🔄 Demandes mises à jour:", {
      nombre: demandes.length,
      emails: demandes.map(d => d.contactEmail),
      statuts: demandes.map(d => d.statut)
    });
  }, [demandes]);

  const handleDeleted = (id: string) => {
    console.log("🗑️ Suppression de la demande:", id);
    setDemandes((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddHistory = (entry: any) => {
    console.log("📝 Ajout d'une entrée d'historique:", entry);
    const tmp = { ...entry, _optimistic: true };
    setHistoryItems((prev) => [tmp, ...(prev || [])]);

    if (entry?.demandeId) {
      setDemandes((prev) =>
        prev.map((d) =>
          d.id === entry.demandeId
            ? { ...d, history: [...(d.history || []), tmp] }
            : d
        )
      );

      (async () => {
        try {
          const resp = await api.post(`/demandes/${entry.demandeId}/history`, {
            entry,
          });
          console.log("✅ Historique sauvegardé sur le serveur:", resp.data);
          const serverHistory = resp.data?.history || [];

          setDemandes((prev) =>
            prev.map((d) =>
              d.id === entry.demandeId ? { ...d, history: serverHistory } : d
            )
          );

          setHistoryItems((prev) => {
            const cleaned = (prev || []).filter(
              (it: any) => !(it._optimistic && it.demandeId === entry.demandeId)
            );
            return [...(serverHistory || []), ...cleaned];
          });
        } catch (err) {
          console.error("❌ Impossible de sauvegarder l'historique:", err);
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder l'historique sur le serveur.",
          });
        }
      })();
    }
  };

  const handleStatusChange = (id: string, statut: string) => {
    console.log("🔄 Changement de statut:", { id, statut });
    setDemandes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, statut } : d))
    );
  };

  const openHistory = async (demande: any) => {
    console.log("📜 Ouverture de l'historique pour la demande:", demande.id);
    setActiveDemande(demande);
    setHistoryOpen(true);
    setHistoryLoading(true);

    try {
      if (demande.history || demande.histories || demande.events) {
        const items = demande.history || demande.histories || demande.events || [];
        console.log("📜 Historique local trouvé:", items);
        setHistoryItems(items);
        return;
      }

      try {
        const resp = await api.get(`/demandes/immobilier/${demande.id}/history`);
        console.log("📜 Historique du backend:", resp.data);
        setHistoryItems(resp.data || []);
        return;
      } catch (err) {
        console.log("⚠️ Pas d'historique dédié, fallback...");
      }

      try {
        const r2 = await api.get(`/demandes/immobilier/${demande.id}`);
        const dd = r2.data || {};
        const items = dd.history || dd.histories || dd.events || [];
        console.log("📜 Historique via demande:", items);
        setHistoryItems(items);
      } catch (err2) {
        console.log("❌ Aucun historique trouvé");
        setHistoryItems([]);
      }
    } catch (e) {
      console.error("❌ Erreur openHistory:", e);
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen mt-12 bg-[#FFFFFF] p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8B4513]">
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
    <div className="min-h-screen mt-12 bg-[#FFFFFF]">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex relative overflow-hidden h-24 lg:h-44 w-full items-center gap-3">
            <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F]/80 via-[#556B2F]/60 to-[#556B2F]/40 backdrop-blur-[1px]"></div>
            {/* Effet de lumière */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#6B8E23]/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#556B2F]/10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>

            <img
              className="absolute -z-0 w-full opacity-45 object-cover object-center"
              src="https://i.pinimg.com/1200x/23/26/d5/2326d5fc9fdbff00492a8f7c6390a88c.jpg"
            />
            <h1 className="text-xl lg:text-5xl tracking-wider font-serif font-bold text-[#FFFFFF] z-10">
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
          <div className="flex items-center space-x-2 bg-[#FFFFFF] rounded-lg p-1 border border-[#D3D3D3] self-stretch md:self-start overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("all")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${activeTab === "all"
                ? "bg-[#556B2F] text-[#FFFFFF]"
                : "text-[#8B4513] hover:bg-[#6B8E23]/10"
                }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveTab("en_attente")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${activeTab === "en_attente"
                ? "bg-[#556B2F] text-[#FFFFFF]"
                : "text-[#8B4513] hover:bg-[#6B8E23]/10"
                }`}
            >
              En attente
            </button>
            <button
              onClick={() => setActiveTab("validees")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${activeTab === "validees"
                ? "bg-[#556B2F] text-[#FFFFFF]"
                : "text-[#8B4513] hover:bg-[#6B8E23]/10"
                }`}
            >
              Validées
            </button>
            <button
              onClick={() => setActiveTab("refusees")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${activeTab === "refusees"
                ? "bg-[#556B2F] text-[#FFFFFF]"
                : "text-[#8B4513] hover:bg-[#6B8E23]/10"
                }`}
            >
              Refusées
            </button>
            <button
              onClick={() => setActiveTab("archivees")}
              className={`shrink-0 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${activeTab === "archivees"
                ? "bg-[#556B2F] text-[#FFFFFF]"
                : "text-[#8B4513] hover:bg-[#6B8E23]/10"
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
              <div className="col-span-full bg-[#FFFFFF] rounded-2xl border border-[#D3D3D3] p-12 text-center shadow-sm">
                <h4 className="text-gray-700 text-lg font-medium mb-2">
                  Aucune demande{" "}
                  {activeTab !== "all" ? "dans cette catégorie" : "immobilière"}
                </h4>
                <p className="text-[#8B4513] text-sm mb-6">
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
            console.log("🔄 Sheet Historique:", { open, user: user?.id });
            setHistoryOpen(open);

            if (!open) {
              setActiveDemande(null);
              setHistoryItems([]);
            } else if (user?.id) {
              setHistoryLoading(true);
              try {
                // 🟢 LOG 8: Appel pour l'historique global
                console.log(`📡 Chargement de l'historique pour user/${user.id}/history...`);
                const resp = await api.get(`/demandes/immobilier/user/${user.id}/history`);

                // 🟢 LOG 9: Réponse de l'historique
                console.log("✅ Réponse historique reçue:", resp);
                console.log("📦 Données historiques:", resp.data);
                console.log("🔍 Structure:", {
                  aDesSuccess: resp.data?.success,
                  aDesStats: resp.data?.stats,
                  aDesHistorique: resp.data?.historique,
                  aDesDemandes: resp.data?.demandes,
                  nombreHistorique: resp.data?.historique?.length
                });

                const items = resp.data?.historique || resp.data?.data || resp.data || [];

                // 🟢 LOG 10: Vérifier les items d'historique
                console.log("📜 Items d'historique à afficher:", items);

                if (Array.isArray(items)) {
                  items.sort((a: any, b: any) => {
                    const da = new Date(a.date || a.createdAt || 0).getTime();
                    const db = new Date(b.date || b.createdAt || 0).getTime();
                    return db - da;
                  });
                  setHistoryItems(items);
                } else {
                  console.warn("⚠️ Les données d'historique ne sont pas un tableau:", items);
                  setHistoryItems([]);
                }
              } catch (e) {
                console.error("❌ Erreur chargement historique:", e);
                if (e.response) {
                  console.error("📡 Réponse d'erreur:", {
                    status: e.response.status,
                    data: e.response.data
                  });
                }
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
                <div className="text-sm text-[#8B4513]">Chargement...</div>
              )}
            </div>

            {historyLoading ? (
              <div className="text-center text-sm text-[#8B4513]">
                Chargement...
              </div>
            ) : historyItems && historyItems.length > 0 ? (
              <div className="space-y-3 overflow-auto max-h-[70vh]">
                {historyItems.map((h: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FFFFFF] rounded-lg border border-[#D3D3D3]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {h.title || h.action || h.type || "Événement"}
                        </div>
                        <div className="text-xs text-[#8B4513] mt-1">
                          {h.message || h.note || h.description || ""}
                        </div>
                        {h._sourceTitre && (
                          <div className="text-xs text-[#8B4513] mt-1">
                            Source: {h._sourceTitre}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-[#8B4513]">
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
              <div className="text-center text-sm text-[#8B4513]">
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
