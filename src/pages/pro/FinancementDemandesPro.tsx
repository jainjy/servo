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
  ChevronRight,
  FileText,
  Percent,
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
  totalAmount: number;
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
    totalAmount: 0,
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
    const totalAmount = demandesList.reduce((sum, d) => 
      d.montant ? sum + d.montant : sum, 0
    );
    
    const newStats: Stats = {
      total: demandesList.length,
      pending: demandesList.filter((d) => d.status === "pending").length,
      processing: demandesList.filter((d) => d.status === "processing").length,
      approved: demandesList.filter((d) => d.status === "approved").length,
      rejected: demandesList.filter((d) => d.status === "rejected").length,
      totalAmount,
    };
    setStats(newStats);
  };

  const filterDemandes = () => {
    let filtered = demandes;

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

    if (statusFilter !== "all") {
      filtered = filtered.filter((demande) => demande.status === statusFilter);
    }

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
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      approved: "bg-[#6B8E23]/20 text-[#556B2F] border-[#6B8E23]/30",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-[#D3D3D3] text-[#8B4513] border-[#D3D3D3]"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4 text-amber-600" />,
      processing: <AlertCircle className="h-4 w-4 text-blue-600" />,
      approved: <CheckCircle className="h-4 w-4 text-[#6B8E23]" />,
      rejected: <XCircle className="h-4 w-4 text-red-600" />,
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

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
      <div className="min-h-screen bg-[#6B8E23]/5 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23] mx-auto"></div>
          <p className="mt-4 text-[#8B4513]/70">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6B8E23]/5 lg:p-0 p-2">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-1.5 bg-[#556B2F] rounded-full"></div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#8B4513]">
              Demandes de Financement
            </h1>
          </div>
          <p className="text-[#8B4513]/70">
            Gérez les demandes de financement liées à vos partenaires
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="border-[#D3D3D3] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">Total</p>
                  <p className="text-2xl font-bold text-[#8B4513]">
                    {stats.total}
                  </p>
                  <p className="text-xs text-[#8B4513]/50 mt-1">
                    Demandes actives
                  </p>
                </div>
                <div className="p-3 bg-[#6B8E23]/10 rounded-xl">
                  <Building2 className="h-6 w-6 text-[#6B8E23]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D3D3D3] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    En attente
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-[#8B4513]/50 mt-1">
                    En attente de traitement
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D3D3D3] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    En traitement
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.processing}
                  </p>
                  <p className="text-xs text-[#8B4513]/50 mt-1">
                    En cours d'étude
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D3D3D3] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    Approuvées
                  </p>
                  <p className="text-2xl font-bold text-[#6B8E23]">
                    {stats.approved}
                  </p>
                  <p className="text-xs text-[#8B4513]/50 mt-1">
                    Demandes validées
                  </p>
                </div>
                <div className="p-3 bg-[#6B8E23]/10 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-[#6B8E23]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D3D3D3] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">Rejetées</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                  <p className="text-xs text-[#8B4513]/50 mt-1">
                    Non éligibles
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D3D3D3] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    Montant total
                  </p>
                  <p className="text-2xl font-bold text-[#8B4513]">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                  <p className="text-xs text-[#8B4513]/50 mt-1">
                    Montant demandé
                  </p>
                </div>
                <div className="p-3 bg-[#6B8E23]/10 rounded-xl">
                  <Percent className="h-6 w-6 text-[#6B8E23]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-6 border-[#D3D3D3] bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/40 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, email, téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[#D3D3D3] text-[#8B4513] focus:border-[#6B8E23]"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] border-[#D3D3D3] text-[#8B4513] focus:border-[#6B8E23]">
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
                  <SelectTrigger className="w-full sm:w-[180px] border-[#D3D3D3] text-[#8B4513] focus:border-[#6B8E23]">
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
                className="whitespace-nowrap border-[#6B8E23] text-[#6B8E23] hover:bg-[#6B8E23]/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>

            {/* Résultats filtres */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#D3D3D3]">
              <div className="text-sm text-[#8B4513]/70">
                {filteredDemandes.length} demande(s) trouvée(s)
              </div>
              <div className="text-sm text-[#8B4513]/50 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des demandes */}
        <Card className="border-[#D3D3D3] bg-white shadow-sm">
          <CardHeader className="border-b border-[#D3D3D3]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#8B4513]">
                  Liste des demandes
                </CardTitle>
                <CardDescription className="text-[#8B4513]/70">
                  Demandes de financement liées à vos partenaires
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-[#6B8E23] text-[#6B8E23] bg-[#6B8E23]/10">
                {filteredDemandes.length} résultats
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredDemandes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-[#D3D3D3] mx-auto mb-4" />
                <p className="text-[#8B4513]/50">Aucune demande trouvée</p>
                {searchTerm && (
                  <p className="text-sm text-[#8B4513]/30 mt-2">
                    Aucun résultat pour "{searchTerm}"
                  </p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[#D3D3D3]">
                {filteredDemandes.map((demande, index) => (
                  <motion.div
                    key={demande.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#6B8E23]/5 transition-colors"
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => {
                        setSelectedDemande(demande);
                        setDetailOpen(true);
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                              <User className="h-4 w-4 text-[#6B8E23]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#8B4513]">
                                {demande.nom}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(demande.status)}
                                >
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(demande.status)}
                                    {getStatusText(demande.status)}
                                  </span>
                                </Badge>
                                <span className="text-xs text-[#8B4513]/50">
                                  {demande.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-[#8B4513]/70">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-[#8B4513]/60" />
                              <span>{demande.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-[#8B4513]/60" />
                              <span>{demande.telephone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-[#8B4513]/60" />
                              <span>
                                {demande.partenaire?.nom || "Aucun partenaire"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#8B4513]/60" />
                              <span>{formatDate(demande.createdAt)}</span>
                            </div>
                          </div>

                          {demande.montant && (
                            <div className="mt-3 flex items-center gap-2 bg-[#6B8E23]/5 p-2 rounded-lg w-fit">
                              <Euro className="h-4 w-4 text-[#6B8E23]" />
                              <span className="text-[#556B2F] font-semibold">
                                {formatCurrency(demande.montant)}
                              </span>
                              {demande.duree && (
                                <span className="text-sm text-[#8B4513]/50 ml-2">
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
                            <SelectTrigger className="w-full sm:w-[140px] border-[#D3D3D3]">
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
                            className="border-[#6B8E23] text-[#6B8E23] hover:bg-[#6B8E23]/10"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
    <div className="fixed inset-0 bg-[#8B4513]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D3D3D3] shadow-xl"
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-[#8B4513] to-[#556B2F] text-white rounded-t-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Détails de la demande
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/20 border-none">
                  {demande.type}
                </Badge>
                <Badge className={`${demande.status === 'approved' ? 'bg-[#6B8E23]/30' : ''}`}>
                  {demande.status === 'approved' ? 'Approuvé' : 
                   demande.status === 'pending' ? 'En attente' :
                   demande.status === 'processing' ? 'En traitement' : 'Rejeté'}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations client */}
          <Card className="border-[#D3D3D3] bg-white">
            <CardHeader className="border-b border-[#D3D3D3]">
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                  <User className="h-5 w-5 text-[#6B8E23]" />
                </div>
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#8B4513]/70">
                    Nom complet
                  </label>
                  <p className="text-[#8B4513] font-medium">{demande.nom}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#8B4513]/70">
                    Email
                  </label>
                  <p className="text-[#8B4513]">{demande.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#8B4513]/70">
                    Téléphone
                  </label>
                  <p className="text-[#8B4513]">{demande.telephone}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#8B4513]/70">
                    Type de demande
                  </label>
                  <Badge variant="outline" className="border-[#6B8E23] text-[#6B8E23] mt-1">
                    {demande.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations financement */}
          {(demande.montant || demande.duree || demande.estimation) && (
            <Card className="border-[#D3D3D3] bg-white">
              <CardHeader className="border-b border-[#D3D3D3]">
                <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                  <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                    <Euro className="h-5 w-5 text-[#6B8E23]" />
                  </div>
                  Informations financement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {demande.montant && (
                    <div className="text-center">
                      <label className="text-sm font-medium text-[#8B4513]/70 block mb-2">
                        Montant
                      </label>
                      <p className="text-2xl font-bold text-[#556B2F]">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(demande.montant)}
                      </p>
                    </div>
                  )}
                  {demande.duree && (
                    <div className="text-center">
                      <label className="text-sm font-medium text-[#8B4513]/70 block mb-2">
                        Durée
                      </label>
                      <p className="text-xl font-semibold text-[#8B4513]">
                        {demande.duree} mois
                      </p>
                    </div>
                  )}
                  {demande.estimation && (
                    <div className="text-center">
                      <label className="text-sm font-medium text-[#8B4513]/70 block mb-2">
                        Estimation
                      </label>
                      <p className="text-xl font-semibold text-[#8B4513]">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(demande.estimation)}
                        /mois
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Partenaires et services */}
          <Card className="border-[#D3D3D3] bg-white">
            <CardHeader className="border-b border-[#D3D3D3]">
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-[#6B8E23]" />
                </div>
                Partenaires et services
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#8B4513]/70">
                    Partenaire
                  </label>
                  <p className="text-[#8B4513] font-medium">
                    {demande.partenaire?.nom || "Non spécifié"}
                  </p>
                  {demande.partenaire?.type && (
                    <span className="text-xs text-[#8B4513]/50">
                      {demande.partenaire.type}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#8B4513]/70">
                    Service financier
                  </label>
                  <p className="text-[#8B4513] font-medium">
                    {demande.serviceFinancier?.nom || "Non spécifié"}
                  </p>
                  {demande.serviceFinancier?.type && (
                    <span className="text-xs text-[#8B4513]/50">
                      {demande.serviceFinancier.type}
                    </span>
                  )}
                </div>
                {demande.assurance && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#8B4513]/70">
                      Assurance
                    </label>
                    <p className="text-[#8B4513] font-medium">
                      {demande.assurance.nom}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          {demande.message && (
            <Card className="border-[#D3D3D3] bg-white">
              <CardHeader className="border-b border-[#D3D3D3]">
                <CardTitle className="text-[#8B4513]">Message du client</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-[#6B8E23]/5 rounded-lg p-4">
                  <p className="text-[#8B4513] italic whitespace-pre-wrap">
                    "{demande.message}"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Métadonnées */}
          <Card className="border-[#D3D3D3] bg-white">
            <CardHeader className="border-b border-[#D3D3D3]">
              <CardTitle className="text-[#8B4513]">Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#8B4513]/70">
                    Date de création
                  </label>
                  <p className="text-[#8B4513]">
                    {new Date(demande.createdAt).toLocaleString("fr-FR", {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#8B4513]/70">
                    Dernière mise à jour
                  </label>
                  <p className="text-[#8B4513]">
                    {new Date(demande.updatedAt).toLocaleString("fr-FR", {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-[#D3D3D3]">
            <Select
              value={demande.status}
              onValueChange={(value) => onStatusChange(demande.id, value)}
            >
              <SelectTrigger className="w-full sm:w-[180px] border-[#D3D3D3]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="processing">En traitement</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={onClose}
              className="bg-[#6B8E23] hover:bg-[#556B2F]"
            >
              Fermer
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}