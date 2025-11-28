// src/pages/pro/FinancementDemandesPro.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { financementAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  Building2,
  User,
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";

interface FinancementDemande {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  type: string;
  montant: number | null;
  duree: number | null;
  estimation: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  partenaire: {
    id: number;
    nom: string;
    type: string;
  } | null;
  assurance: {
    id: number;
    nom: string;
  } | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  serviceFinancier: {
    id: string;
    nom: string;
    type: string;
  } | null;
}

interface FinancementPartenaire {
  id: number;
  nom: string;
  type: string;
  isActive: boolean;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  approved: number;
  rejected: number;
}

export default function FinancementDemandesPro() {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState<FinancementDemande[]>([]);
  const [filteredDemandes, setFilteredDemandes] = useState<
    FinancementDemande[]
  >([]);
  const [selectedDemande, setSelectedDemande] =
    useState<FinancementDemande | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [partenaires, setPartenaires] = useState<FinancementPartenaire[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    processing: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchDemandes();
    fetchPartenaires();
  }, []);

  useEffect(() => {
    filterDemandes();
  }, [demandes, searchTerm, statusFilter, typeFilter]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      // Pour les pros, on récupère toutes les demandes liées à leurs partenaires
      const response = await financementAPI.getAllDemandes();
      setDemandes(response.data.demandes || []);
      calculateStats(response.data.demandes || []);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartenaires = async () => {
    try {
      const response = await financementAPI.getPartenaires();
      setPartenaires(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des partenaires:", error);
    }
  };

  const calculateStats = (demandesList: FinancementDemande[]) => {
    const newStats: Stats = {
      total: demandesList.length,
      pending: demandesList.filter((d) => d.status === "pending").length,
      processing: demandesList.filter((d) => d.status === "processing").length,
      approved: demandesList.filter((d) => d.status === "approved").length,
      rejected: demandesList.filter((d) => d.status === "rejected").length,
    };
    setStats(newStats);
  };

  const filterDemandes = () => {
    let filtered = demandes;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (demande) =>
          demande.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          demande.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          demande.telephone.includes(searchTerm) ||
          demande.partenaire?.nom
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((demande) => demande.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== "all") {
      filtered = filtered.filter((demande) => demande.type === typeFilter);
    }

    setFilteredDemandes(filtered);
  };

  const handleStatusChange = async (demandeId: string, newStatus: string) => {
    try {
      await financementAPI.updateDemandeStatus(demandeId, newStatus);
      await fetchDemandes();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      processing: <AlertCircle className="h-4 w-4" />,
      approved: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: "En attente",
      processing: "En traitement",
      approved: "Approuvé",
      rejected: "Rejeté",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    const headers = [
      "Nom",
      "Email",
      "Téléphone",
      "Type",
      "Montant",
      "Statut",
      "Partenaire",
      "Date",
    ];
    const csvData = filteredDemandes.map((demande) => [
      demande.nom,
      demande.email,
      demande.telephone,
      demande.type,
      demande.montant ? `${demande.montant}€` : "N/A",
      getStatusText(demande.status),
      demande.partenaire?.nom || "N/A",
      formatDate(demande.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `demandes-financement-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demandes de Financement
          </h1>
          <p className="text-gray-600">
            Gérez les demandes de financement liées à vos partenaires
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    En attente
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    En traitement
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.processing}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Approuvées
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.approved}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejetées</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, email, téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En traitement</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="simulation">Simulation</SelectItem>
                    <SelectItem value="financement">Financement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={exportToCSV}
                variant="outline"
                className="whitespace-nowrap"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des demandes */}
        <Card>
          <CardHeader>
            <CardTitle>
              Liste des demandes ({filteredDemandes.length})
            </CardTitle>
            <CardDescription>
              Demandes de financement liées à vos partenaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDemandes.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune demande trouvée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDemandes.map((demande, index) => (
                  <motion.div
                    key={demande.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedDemande(demande);
                        setDetailOpen(true);
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {demande.nom}
                              </h3>
                              <Badge
                                variant="outline"
                                className={getStatusColor(demande.status)}
                              >
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(demande.status)}
                                  {getStatusText(demande.status)}
                                </span>
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{demande.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{demande.telephone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>
                                  {demande.partenaire?.nom ||
                                    "Aucun partenaire"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(demande.createdAt)}</span>
                              </div>
                            </div>

                            {demande.montant && (
                              <div className="mt-2 flex items-center gap-2">
                                <Euro className="h-4 w-4 text-green-600" />
                                <span className="text-green-600 font-semibold">
                                  {demande.montant} €
                                </span>
                                {demande.duree && (
                                  <span className="text-gray-500">
                                    sur {demande.duree} mois
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Select
                              value={demande.status}
                              onValueChange={(value) =>
                                handleStatusChange(demande.id, value)
                              }
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  En attente
                                </SelectItem>
                                <SelectItem value="processing">
                                  En traitement
                                </SelectItem>
                                <SelectItem value="approved">
                                  Approuvé
                                </SelectItem>
                                <SelectItem value="rejected">Rejeté</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDemande(demande);
                                setDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Détails
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de détail */}
      {detailOpen && selectedDemande && (
        <DemandeDetailModal
          demande={selectedDemande}
          onClose={() => setDetailOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

// Composant Modal de détail
interface DemandeDetailModalProps {
  demande: FinancementDemande;
  onClose: () => void;
  onStatusChange: (demandeId: string, newStatus: string) => void;
}

function DemandeDetailModal({
  demande,
  onClose,
  onStatusChange,
}: DemandeDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Détails de la demande
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Informations client */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nom complet
                    </label>
                    <p className="text-gray-900">{demande.nom}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{demande.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Téléphone
                    </label>
                    <p className="text-gray-900">{demande.telephone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Type de demande
                    </label>
                    <Badge variant="outline" className="mt-1">
                      {demande.type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations financement */}
            {(demande.montant || demande.duree || demande.estimation) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    Informations financement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {demande.montant && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Montant
                        </label>
                        <p className="text-2xl font-bold text-green-600">
                          {demande.montant} €
                        </p>
                      </div>
                    )}
                    {demande.duree && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Durée
                        </label>
                        <p className="text-xl font-semibold text-gray-900">
                          {demande.duree} mois
                        </p>
                      </div>
                    )}
                    {demande.estimation && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Estimation
                        </label>
                        <p className="text-xl font-semibold text-blue-600">
                          {demande.estimation} €/mois
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Partenaires et services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Partenaires et services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Partenaire
                    </label>
                    <p className="text-gray-900">
                      {demande.partenaire?.nom || "Non spécifié"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Service financier
                    </label>
                    <p className="text-gray-900">
                      {demande.serviceFinancier?.nom || "Non spécifié"}
                    </p>
                  </div>
                  {demande.assurance && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Assurance
                      </label>
                      <p className="text-gray-900">{demande.assurance.nom}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message */}
            {demande.message && (
              <Card>
                <CardHeader>
                  <CardTitle>Message du client</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {demande.message}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Métadonnées */}
            <Card>
              <CardHeader>
                <CardTitle>Métadonnées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date de création
                    </label>
                    <p className="text-gray-900">
                      {new Date(demande.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Dernière mise à jour
                    </label>
                    <p className="text-gray-900">
                      {new Date(demande.updatedAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Select
                value={demande.status}
                onValueChange={(value) => onStatusChange(demande.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processing">En traitement</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onClose}>Fermer</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
