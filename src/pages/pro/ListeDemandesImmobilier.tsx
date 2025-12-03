import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
  Trash2,
  User,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  Home,
  Filter,
  Search,
  Download,
  Building,
  RefreshCw,
  MoreVertical,
  Edit,
  Send,
  Ban,
  CheckSquare,
  AlertTriangle,
  Info
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { getDemandesByUser, getAllDemandes, updateDemandeStatut, deleteDemande, initDemoData } from "@/lib/demandeStorage";

const DemandeCard = ({ demande, onValidate, onRefuse, onArchive, onRemove, isAdmin = false }: any) => {
  const [showActions, setShowActions] = useState(false);

  const formatMessage = (message: string) => {
    if (!message) return "—";
    const parts = message.split(".");
    const userMessage = parts.find(
      (part) => !part.includes("Demande visite pour le bien") && 
                !part.includes("Postulation pour logement intermédiaire")
    );
    return userMessage ? userMessage.trim() : "—";
  };

  const isActionDisabled = ["validée", "refusée", "archivée", "terminée"].includes(
    demande.statut?.toLowerCase()
  );

  const getStatusIcon = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "en attente":
      case "en cours":
        return <Clock className="w-4 h-4" />;
      case "validée":
      case "validee":
      case "valide":
        return <CheckCircle className="w-4 h-4" />;
      case "refusée":
      case "refusee":
      case "refus":
        return <XCircle className="w-4 h-4" />;
      case "archivée":
      case "archivee":
      case "archive":
        return <Archive className="w-4 h-4" />;
      case "terminée":
      case "terminee":
        return <CheckSquare className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
      {/* Effet de fond subtil au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-blue-50/10 transition-all duration-500 rounded-2xl"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-start gap-6">
          {/* Image avec effet de zoom */}
          {demande.property?.images?.length > 0 ? (
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={demande.property.images[0]}
                alt={demande.property?.title || "Propriété"}
                className="w-36 h-28 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-xl"></div>
            </div>
          ) : (
            <div className="w-36 h-28 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Home className="w-8 h-8" />
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-xl group-hover:text-blue-700 transition-colors duration-300 leading-tight">
              {demande.property?.title || "Demande de visite"}
            </h3>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <span className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4" />
                {formatAddress(demande)}
              </span>
            </p>
            {isAdmin && demande.createdBy && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                User ID: {demande.createdBy}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(demande.statut)}
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 backdrop-blur-sm ${getStatusColor(
                demande.statut
              )} shadow-sm`}
            >
              {demande.statut}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(demande.createdAt || demande.date).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>

      {/* Grille améliorée avec séparateurs */}
      <div className="grid grid-cols-2 gap-8 mb-6 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Informations du demandeur
            </h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                <span className="font-medium text-gray-800">
                  {demande.contactPrenom} {demande.contactNom}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{demande.contactEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{demande.contactTel}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-green-500 rounded-full"></div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Détails de la visite
            </h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                <span className="font-medium text-gray-800">
                  {demande.dateSouhaitee ? 
                    new Date(demande.dateSouhaitee).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "Non spécifiée"
                  }
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{demande.heureSouhaitee || "Non spécifiée"}</span>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-gray-400 mt-1" />
              <span className="text-gray-600 leading-relaxed">
                {formatMessage(demande.description)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de carte avec bordure élégante */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-100 relative z-10">
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <span className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
            <Calendar className="w-4 h-4" />
            {demande.createdAt
              ? new Date(demande.createdAt).toLocaleDateString("fr-FR")
              : "—"}
          </span>
          {demande.updatedAt && demande.updatedAt !== demande.createdAt && (
            <span className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg text-blue-600">
              <Edit className="w-4 h-4" />
              Modifié: {new Date(demande.updatedAt).toLocaleDateString("fr-FR")}
            </span>
          )}
        </div>

        <div className="flex gap-3 items-center">
          {/* <Link
            to={`/immobilier/${demande.propertyId}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            Voir le bien
          </Link> */}

          {/* Menu d'actions déroulant pour admin */}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 py-2">
                  {/* Actions pour demandes en attente */}
                  {["en attente", "en cours", "En attente", "En cours"].includes(
                    String(demande.statut)
                  ) && (
                    <>
                      <button
                        onClick={() => {
                          onValidate(demande.id);
                          setShowActions(false);
                        }}
                        disabled={isActionDisabled}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          isActionDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Valider
                      </button>

                      <button
                        onClick={() => {
                          onRefuse(demande.id);
                          setShowActions(false);
                        }}
                        disabled={isActionDisabled}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          isActionDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Refuser
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>
                    </>
                  )}

                  {/* Action Archiver pour tous les statuts sauf déjà archivé */}
                  {!["archivée", "archivee", "archive"].includes(
                    (demande.statut || "").toLowerCase()
                  ) && (
                    <button
                      onClick={() => {
                        onArchive(demande.id);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      Archiver
                    </button>
                  )}

                  {/* Action Supprimer */}
                  <button
                    onClick={() => {
                      onRemove(demande.id);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Boutons d'action principaux pour non-admin */}
          {!isAdmin && ["en attente", "en cours", "En attente", "En cours"].includes(
            String(demande.statut)
          ) && (
            <div className="flex gap-3">
              <button
                onClick={() => onValidate(demande.id)}
                disabled={isActionDisabled}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 ${
                  isActionDisabled
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Valider
              </button>

              <button
                onClick={() => onRefuse(demande.id)}
                disabled={isActionDisabled}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 ${
                  isActionDisabled
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-white hover:bg-red-50 text-red-600 border-2 border-red-200"
                }`}
              >
                <XCircle className="w-4 h-4" />
                Refuser
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fermer le menu déroulant en cliquant ailleurs */}
      {showActions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowActions(false)}
        />
      )}
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

const getStatusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "en attente":
    case "en cours":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "validée":
    case "validee":
    case "valide":
      return "bg-green-100 text-green-800 border-green-200";
    case "refusée":
    case "refusee":
    case "refus":
      return "bg-red-100 text-red-800 border-red-200";
    case "archivée":
    case "archivee":
    case "archive":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "terminée":
    case "terminee":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ListeDemandesImmobilier = () => {
  const { user, isAuthenticated } = useAuth();
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Fonction pour charger les demandes - AVEC STOCKAGE LOCAL
  const loadDemandes = async () => {
    if (!isAuthenticated || !user?.id) {
      console.log('❌ Utilisateur non authentifié ou ID manquant');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Chargement des demandes depuis stockage local...', { 
        isAdmin, 
        userId: user.id 
      });
      
      // Initialiser les données de démonstration
      initDemoData();
      
      let demandesData;
      
      if (isAdmin) {
        // Admin: charger toutes les demandes
        demandesData = getAllDemandes();
        console.log('👑 Mode ADMIN - Toutes les demandes:', demandesData);
      } else {
        // User: charger seulement ses demandes
        demandesData = getDemandesByUser(user.id);
        console.log('👤 Mode USER - Demandes utilisateur:', demandesData);
      }

      console.log(`✅ ${demandesData.length} demandes chargées`);
      
      setDemandes(demandesData);

    } catch (err: any) {
      console.error("❌ Erreur chargement demandes:", err);
      
      // En cas d'erreur, utiliser un tableau vide
      setDemandes([]);
      
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les demandes au montage
  useEffect(() => {
    loadDemandes();
  }, [isAuthenticated, user?.id, isAdmin]);

  // Écouter les événements de nouvelle demande
  useEffect(() => {
    const handleNewDemande = () => {
      console.log('🔄 Événement: Nouvelle demande détectée, rechargement...');
      loadDemandes();
    };

    // Écouter les événements personnalisés
    window.addEventListener('demande:created', handleNewDemande);
    window.addEventListener('demande:statusChanged', handleNewDemande);

    return () => {
      window.removeEventListener('demande:created', handleNewDemande);
      window.removeEventListener('demande:statusChanged', handleNewDemande);
    };
  }, []);

  // Filter demandes based on active tab and search
  const filteredDemandes = React.useMemo(() => {
    let filtered = demandes;

    // Filtre par statut
    if (activeTab !== "all") {
      filtered = filtered.filter((demande) => {
        const status = (demande.statut || "").toLowerCase();
        switch (activeTab) {
          case "en_attente":
            return status === "en attente" || status === "en cours";
          case "validees":
            return [
              "validée", "validee", "valide", 
              "terminée", "terminee"
            ].includes(status);
          case "refusees":
            return ["refusée", "refusee", "refus"].includes(status);
          case "archivees":
            return ["archivée", "archivee", "archive"].includes(status);
          default:
            return true;
        }
      });
    }

    // Filtre par recherche (admin seulement)
    if (isAdmin && searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((demande) =>
        demande.contactPrenom?.toLowerCase().includes(term) ||
        demande.contactNom?.toLowerCase().includes(term) ||
        demande.contactEmail?.toLowerCase().includes(term) ||
        demande.property?.title?.toLowerCase().includes(term) ||
        formatAddress(demande).toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [demandes, activeTab, searchTerm, isAdmin]);

  // Statistiques pour chaque onglet
  const stats = React.useMemo(() => {
    const total = demandes.length;
    const enAttente = demandes.filter(d => 
      ["en attente", "en cours"].includes((d.statut || "").toLowerCase())
    ).length;
    const validees = demandes.filter(d => 
      ["validée", "validee", "valide", "terminée", "terminee"].includes((d.statut || "").toLowerCase())
    ).length;
    const refusees = demandes.filter(d => 
      ["refusée", "refusee", "refus"].includes((d.statut || "").toLowerCase())
    ).length;
    const archivees = demandes.filter(d => 
      ["archivée", "archivee", "archive"].includes((d.statut || "").toLowerCase())
    ).length;

    return { total, enAttente, validees, refusees, archivees };
  }, [demandes]);

  // Actions communes
  const handleAction = async (id: number, action: "validate" | "refuse" | "archive") => {
    setUpdatingIds((s) => [...s, id]);
    try {
      let newStatus = "";
      let actionText = "";
      
      switch (action) {
        case "validate":
          newStatus = "validée";
          actionText = "validée";
          break;
        case "refuse":
          newStatus = "refusée";
          actionText = "refusée";
          break;
        case "archive":
          newStatus = "archivée";
          actionText = "archivée";
          break;
      }

      console.log(`🔄 Changement statut demande ${id} -> ${newStatus}`);
      
      // Utiliser le stockage local au lieu de l'API
      const demandeMiseAJour = updateDemandeStatut(id, newStatus as any);
      
      if (!demandeMiseAJour) {
        throw new Error('Demande non trouvée');
      }

      // Mettre à jour l'état local
      setDemandes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, statut: newStatus, updatedAt: new Date().toISOString() } : d))
      );

      // Émettre un événement pour les autres composants
      window.dispatchEvent(
        new CustomEvent("demande:statusChanged", {
          detail: { demandeId: id, status: newStatus },
        })
      );

      toast({ 
        title: "Succès", 
        description: `Demande ${actionText} avec succès`,
        variant: "default"
      });
    } catch (err: any) {
      console.error("❌ Erreur action demande", err);
      toast({ 
        title: "Erreur", 
        description: "Impossible de traiter la demande pour le moment.",
        variant: "destructive"
      });
    } finally {
      setUpdatingIds((s) => s.filter((x) => x !== id));
    }
  };

  const handleRemove = async (id: number) => {
    setUpdatingIds((s) => [...s, id]);
    try {
      // Utiliser le stockage local au lieu de l'API
      const success = deleteDemande(id);
      
      if (!success) {
        throw new Error('Demande non trouvée');
      }

      setDemandes((prev) => prev.filter((d) => d.id !== id));
      toast({
        title: "Supprimé",
        description: "La demande a été supprimée avec succès.",
        variant: "default"
      });
    } catch (err: any) {
      console.error("Erreur suppression demande", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la demande pour le moment.",
        variant: "destructive"
      });
    } finally {
      setUpdatingIds((s) => s.filter((x) => x !== id));
    }
  };

  // Export des données (admin seulement)
  const handleExport = () => {
    if (filteredDemandes.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucune demande à exporter",
        variant: "destructive"
      });
      return;
    }

    const csvData = filteredDemandes.map(d => ({
      ID: d.id,
      Statut: d.statut,
      'Prénom': d.contactPrenom,
      'Nom': d.contactNom,
      'Email': d.contactEmail,
      'Téléphone': d.contactTel,
      'Bien': d.property?.title,
      'Adresse': formatAddress(d),
      'Date souhaitée': d.dateSouhaitee,
      'Heure': d.heureSouhaitee,
      'Message': d.description,
      'Date création': d.createdAt || d.date,
      'User ID': d.createdBy || 'N/A'
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demandes-immobilier-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: `${filteredDemandes.length} demandes exportées`,
      variant: "default"
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? "Administration des demandes" : "Mes demandes immobilières"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin 
                ? "Gérez toutes les demandes de visite du système" 
                : "Gérez les demandes de visite liées à vos biens"
              }
            </p>
            {!isAdmin && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold text-gray-700">
                  {demandes.length} demande(s) trouvée(s)
                </span>
              </p>
            )}
          </div>

          {/* Boutons d'action pour admin */}
          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={filteredDemandes.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Exporter CSV
              </button>
              <button
                onClick={loadDemandes}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
            </div>
          )}
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-yellow-700">{stats.enAttente}</div>
            <div className="text-sm text-yellow-600">En attente</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-green-700">{stats.validees}</div>
            <div className="text-sm text-green-600">Validées</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-red-700">{stats.refusees}</div>
            <div className="text-sm text-red-600">Refusées</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-gray-700">{stats.archivees}</div>
            <div className="text-sm text-gray-600">Archivées</div>
          </div>
        </div>

        {/* Barre de recherche (admin seulement) */}
        {isAdmin && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, bien..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Filtrer:</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de filtrage améliorés */}
        <div className="flex items-center space-x-1 bg-white rounded-xl p-2 border border-gray-200 mb-8 shadow-sm">
          {[
            { id: "all", label: "Toutes", count: stats.total },
            { id: "en_attente", label: "En attente", count: stats.enAttente },
            { id: "validees", label: "Validées", count: stats.validees },
            { id: "refusees", label: "Refusées", count: stats.refusees },
            { id: "archivees", label: "Archivées", count: stats.archivees },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Liste des demandes */}
        <div className="space-y-6">
          {filteredDemandes.length > 0 ? (
            filteredDemandes.map((d) => (
              <DemandeCard
                key={d.id}
                demande={d}
                isAdmin={isAdmin}
                onValidate={(id: number) => handleAction(id, "validate")}
                onRefuse={(id: number) => handleAction(id, "refuse")}
                onArchive={(id: number) => handleAction(id, "archive")}
                onRemove={(id: number) => handleRemove(id)}
              />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-700 text-lg font-medium mb-2">
                Aucune demande{" "}
                {activeTab !== "all" ? "dans cette catégorie" : isAdmin ? "immobilière" : "pour vos biens"}
              </h4>
              {activeTab !== "all" ? (
                <p className="text-gray-500 text-sm mb-6">
                  Essayez de sélectionner une autre catégorie
                </p>
              ) : (
                <>
                  {isAdmin ? (
                    <p className="text-gray-500 text-sm">
                      Aucune demande de visite n'a été soumise pour le moment.
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm mb-6">
                      {demandes.length === 0 
                        ? "Vous n'avez pas encore postulé à des logements intermédiaires." 
                        : "Aucune demande ne correspond aux filtres actuels."}
                    </p>
                  )}
                </>
              )}
              {!isAdmin && demandes.length === 0 && (
                <Link
                  to="/logements-intermediaires"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Voir les logements disponibles
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeDemandesImmobilier;