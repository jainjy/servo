import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const DemandeCard = ({ demande, onValidate, onRefuse, onRemove }: any) => {
  const formatMessage = (message: string) => {
    if (!message) return "—";
    // Enlever la partie automatique du message
    const parts = message.split(".");
    const userMessage = parts.find(
      (part) => !part.includes("Demande visite pour le bien")
    );
    return userMessage ? userMessage.trim() : "—";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          {/* Image de la propriété */}
          {demande.property?.images?.length > 0 ? (
            <img
              src={demande.property.images[0]}
              alt={demande.property?.title || "Propriété"}
              className="w-32 h-24 rounded-lg object-cover"
            />
          ) : (
            <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <HomeIcon />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
              {demande.property?.title || "Demande de visite"}
            </h3>
            <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1 text-gray-500">
                <MapPin className="w-3 h-3" />
                {formatAddress(demande)}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              demande.statut
            )}`}
          >
            {demande.statut}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Informations du demandeur
          </h4>
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Nom :</span> {demande.contactPrenom}{" "}
              {demande.contactNom}
            </p>
            <p>
              <span className="font-medium">Email :</span>{" "}
              {demande.contactEmail}
            </p>
            <p>
              <span className="font-medium">Téléphone :</span>{" "}
              {demande.contactTel}
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Détails de la visite
          </h4>
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Date souhaitée :</span>{" "}
              {new Date(demande.dateSouhaitee).toLocaleDateString("fr-FR")}
            </p>
            <p>
              <span className="font-medium">Heure souhaitée :</span>{" "}
              {demande.heureSouhaitee}
            </p>
            <p>
              <span className="font-medium">Message :</span>{" "}
              {formatMessage(demande.description)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {demande.date
              ? new Date(demande.date).toLocaleDateString("fr-FR")
              : "—"}
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <Link
            to={`/immobilier/${demande.propertyId}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Voir bien
          </Link>
          {["en attente", "en cours", "En attente", "En cours"].includes(
            String(demande.statut)
          ) ? (
            <>
              <button
                onClick={() => onValidate(demande.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Valider
              </button>

              <button
                onClick={() => onRefuse(demande.id)}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Refuser
              </button>
            </>
          ) : /refus/i.test(String(demande.statut || "")) ? (
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  demande.statut
                )}`}
              >
                {demande.statut}
              </span>
              <button
                onClick={() => onRemove?.(demande.id)}
                title="Supprimer"
                className="p-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span
              className={`px-3 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                demande.statut
              )}`}
            >
              {demande.statut}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const formatAddress = (demande: any) => {
  if (demande.property && (demande.property.address || demande.property.city)) {
    const parts = [demande.property.address, demande.property.city].filter(
      Boolean
    );
    return parts.join(", ");
  }
  const parts = [
    demande.lieuAdresse,
    demande.lieuAdresseVille,
    demande.lieuAdresseCp,
  ].filter(Boolean);
  if (parts.length) return parts.join(", ");
  const contactParts = [
    demande.contactAdresse,
    demande.lieuAdresseVille,
  ].filter(Boolean);
  if (contactParts.length) return contactParts.join(", ");
  return "Adresse non renseignée";
};

// Small placeholder icon to avoid additional imports
const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
  >
    <path
      d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getStatusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "en attente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "en cours":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "validée":
      return "bg-green-100 text-green-800 border-green-200";
    case "terminée":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "refusée":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// ... Reste du composant inchangé ...

const ListeDemandesImmobilier = () => {
  const { user, isAuthenticated } = useAuth();
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [debugVisible, setDebugVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const resp = await api.get(`/demandes/immobilier/owner/${user.id}`);
        setDemandes(resp.data || []);

        try {
          const props = await api.get("/properties", {
            params: { userId: user.id },
          });
          setProperties(props.data || []);
        } catch (pErr) {
          console.debug("Impossible de récupérer les propriétés du pro", pErr);
          setProperties([]);
        }
      } catch (err) {
        console.error("Erreur en chargeant demandes immobilieres", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, user?.id]);

  const handleAction = async (id: number, action: "validate" | "refuse") => {
    let toastRef: any = null;
    toastRef = toast({
      title:
        action === "validate"
          ? "Confirmer la validation"
          : "Confirmer le refus",
      description:
        action === "validate"
          ? "Valider cette demande la marquera comme validée."
          : "Refuser cette demande la marquera comme refusée.",
      action: (
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
          onClick={async () => {
            toastRef?.dismiss?.();
            setUpdatingIds((s) => [...s, id]);
            try {
              await api.patch(`/demandes/immobilier/${id}/statut`, {
                statut: action === "validate" ? "validée" : "refusée",
              });
              const newStatus = action === "validate" ? "validée" : "refusée";
              setDemandes((prev) =>
                prev.map((d) => (d.id === id ? { ...d, statut: newStatus } : d))
              );
              try {
                window.dispatchEvent(
                  new CustomEvent("demande:statusChanged", {
                    detail: { demandeId: id, status: newStatus },
                  })
                );
              } catch (e) {
                console.debug(
                  "Could not dispatch demande:statusChanged event",
                  e
                );
              }
              toast({ title: "Succès", description: `Demande ${newStatus}` });
            } catch (err) {
              console.error("Erreur action demande", err);
              const msg =
                err?.response?.data?.error ||
                err?.message ||
                "Impossible de traiter la demande pour le moment.";
              toast({ title: "Erreur", description: msg });
            } finally {
              setUpdatingIds((s) => s.filter((x) => x !== id));
            }
          }}
        >
          Confirmer
        </button>
      ),
    });
  };

  const handleRemove = async (id: number) => {
    let toastRef: any = null;
    toastRef = toast({
      title: "Confirmer la suppression",
      description: "Cette action supprimera définitivement la demande.",
      action: (
        <button
          className="px-3 py-1 rounded bg-red-600 text-white text-sm"
          onClick={async () => {
            toastRef?.dismiss?.();
            setUpdatingIds((s) => [...s, id]);
            try {
              await api.delete(`/demandes/immobilier/${id}`);
              setDemandes((prev) => prev.filter((d) => d.id !== id));
              toast({
                title: "Supprimé",
                description: "La demande a été supprimée.",
              });
            } catch (err) {
              console.error("Erreur suppression demande", err);
              toast({
                title: "Erreur",
                description:
                  "Impossible de supprimer la demande pour le moment.",
              });
            } finally {
              setUpdatingIds((s) => s.filter((x) => x !== id));
            }
          }}
        >
          Confirmer
        </button>
      ),
    });
  };

  if (!isAuthenticated)
    return (
      <div className="min-h-screen mt-12 bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">
          Veuillez vous connecter pour voir les demandes.
        </p>
      </div>
    );

  if (loading)
    return <LoadingSpinner text="Chargement des demandes immobilières" />;

  return (
    <div className="min-h-screen mt-12 bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Liste des demandes immobilières
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les demandes de visite liées à vos biens
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Vos biens publiés:{" "}
            <span className="font-semibold text-gray-700">
              {properties.length}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {demandes.length > 0 ? (
          demandes.map((d) => (
            <DemandeCard
              key={d.id}
              demande={d}
              onValidate={(id: number) => handleAction(id, "validate")}
              onRefuse={(id: number) => handleAction(id, "refuse")}
              onRemove={(id: number) => handleRemove(id)}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <h4 className="text-gray-700 text-lg font-medium mb-2">
              Aucune demande immobilière
            </h4>
            <p className="text-gray-500 text-sm mb-6">
              Aucune demande de visite liée à vos biens pour le moment.
            </p>
            {properties.length === 0 ? (
              <p className="text-sm text-gray-500">
                Vous n'avez pas encore de biens publiés. Ajoutez un bien pour
                recevoir des demandes de visite.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Vos biens sont listés ({properties.length}). Il n'y a
                actuellement aucune demande de visite pour ces biens.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeDemandesImmobilier;
