// src/pages/admin/AdminConseilPage.tsx - Version avec nouvelle palette
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, ChevronDown, ChevronUp, Eye,
  MessageSquare, CheckCircle, XCircle, Clock, User,
  Star, Mail, Phone, Building, Calendar, MapPin,
  Download, Send, Users, BarChart, RefreshCw,
  MoreVertical, Edit, Trash2, FileText, EyeOff,
  Shield, AlertCircle, UserCheck, UserPlus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { conseilService, conseilAdminService } from "@/services/conseilService";

// Types
interface DemandeConseil {
  id: number;
  conseilType: string;
  besoin: string;
  budget: string;
  message: string;
  nom: string;
  email: string;
  telephone: string;
  entreprise: string;
  serviceId: number | null;
  metierId: number | null;
  expertId: string | null;
  statut: string;
  origine: string;
  createdAt: string;
  updatedAt: string;
  service: any;
  metier: any;
  expert: any;
  user: any;
  suivis: any[];
}

interface Expert {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  title: string;
  rating: number;
  experience: string;
  avatar: string;
  metiers: any[];
  services: any[];
}

const AdminConseilPage = () => {
  const [demandes, setDemandes] = useState<DemandeConseil[]>([]);
  const [filteredDemandes, setFilteredDemandes] = useState<DemandeConseil[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États de chargement pour les boutons
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingSendResponse, setLoadingSendResponse] = useState(false);
  const [loadingAssignExpert, setLoadingAssignExpert] = useState(false);
  const [loadingAddSuivi, setLoadingAddSuivi] = useState(false);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState<{[key: number]: boolean}>({});
  const [loadingExport, setLoadingExport] = useState(false);
  
  const [stats, setStats] = useState({
    total: 0,
    en_attente: 0,
    en_cours: 0,
    terminee: 0,
    annulee: 0
  });

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [expertFilter, setExpertFilter] = useState("tous");
  const [typeFilter, setTypeFilter] = useState("tous");
  const [dateFilter, setDateFilter] = useState("tous");

  // États pour les modals
  const [selectedDemande, setSelectedDemande] = useState<DemandeConseil | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // États pour les formulaires
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedExpertId, setSelectedExpertId] = useState<string>("non_assignee");
  const [newStatus, setNewStatus] = useState("");
  const [suiviMessage, setSuiviMessage] = useState("");
  const [suiviType, setSuiviType] = useState("message");

  // États pour le suivi
  const [showSuiviModal, setShowSuiviModal] = useState(false);

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  // Filtrer les demandes
  useEffect(() => {
    filterDemandes();
  }, [demandes, searchTerm, statusFilter, expertFilter, typeFilter, dateFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les experts
      const expertsResponse = await conseilService.getExperts();
      if (expertsResponse.success) {
        setExperts(expertsResponse.data);
      }

      // Charger les stats détaillées
      const statsResponse = await conseilAdminService.getDetailedStats();
      if (statsResponse.success) {
        setStats({
          total: statsResponse.data.totalDemandes || 0,
          en_attente: statsResponse.data.demandesEnAttente || 0,
          en_cours: statsResponse.data.demandesEnCours || 0,
          terminee: statsResponse.data.demandesTerminees || 0,
          annulee: statsResponse.data.demandesAnnulees || 0
        });
      }

      // Charger toutes les demandes
      await loadDemandes();

    } catch (error) {
      console.error("Erreur chargement données:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoadingRefresh(true);
      await loadData();
    } finally {
      setLoadingRefresh(false);
    }
  };

  const loadDemandes = async () => {
    try {
      const response = await conseilAdminService.getAllDemandes();
      if (response.success) {
        setDemandes(response.data);
        setFilteredDemandes(response.data);
      }
    } catch (error) {
      console.error("Erreur chargement demandes:", error);
      toast.error("Erreur lors du chargement des demandes");
      // Données de test en cas d'erreur
      const testDemandes: DemandeConseil[] = [
        {
          id: 1,
          conseilType: "Audit Stratégique",
          besoin: "Besoin d'un audit complet pour notre stratégie digitale",
          budget: "5k-10k",
          message: "Nous souhaitons optimiser notre présence en ligne...",
          nom: "Jean Dupont",
          email: "jean@entreprise.fr",
          telephone: "+33 6 12 34 56 78",
          entreprise: "TechCorp",
          serviceId: 1,
          metierId: 2,
          expertId: "1",
          statut: "en_cours",
          origine: "page_conseil",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-16T14:20:00Z",
          service: { id: 1, libelle: "Consulting Stratégique" },
          metier: { id: 2, libelle: "Consultant" },
          expert: {
            id: "1",
            firstName: "Sophie",
            lastName: "Laurent",
            email: "sophie@expert.fr"
          },
          user: {
            id: "user1",
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@entreprise.fr",
            phone: "+33 6 12 34 56 78"
          },
          suivis: [
            {
              id: 1,
              message: "Premier contact établi avec le client",
              type: "message",
              createdAt: "2024-01-15T11:00:00Z",
              user: { firstName: "Sophie", lastName: "Laurent" }
            }
          ]
        },
      ];
      setDemandes(testDemandes);
      setFilteredDemandes(testDemandes);
    }
  };

  const filterDemandes = () => {
    let filtered = [...demandes];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.nom.toLowerCase().includes(term) ||
        d.email.toLowerCase().includes(term) ||
        d.conseilType.toLowerCase().includes(term) ||
        d.entreprise?.toLowerCase().includes(term) ||
        d.besoin.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilter !== "tous") {
      filtered = filtered.filter(d => d.statut === statusFilter);
    }

    // Filtre par expert
    if (expertFilter !== "tous") {
      if (expertFilter === "non_assignee") {
        filtered = filtered.filter(d => !d.expertId);
      } else {
        filtered = filtered.filter(d => d.expertId === expertFilter);
      }
    }

    // Filtre par type
    if (typeFilter !== "tous") {
      filtered = filtered.filter(d => d.conseilType === typeFilter);
    }

    // Filtre par date
    if (dateFilter === "today") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(d => d.createdAt.startsWith(today));
    } else if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(d => new Date(d.createdAt) > weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(d => new Date(d.createdAt) > monthAgo);
    }

    setFilteredDemandes(filtered);
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge variant="outline" className="bg-[#FFF8E1] text-[#000000] border-[#D3D3D3]">En attente</Badge>;
      case "en_cours":
        return <Badge variant="outline" className="bg-[#E8F5E9] text-[#000000] border-[#D3D3D3]">En cours</Badge>;
      case "terminee":
        return <Badge variant="outline" className="bg-[#E8F5E9] text-[#000000] border-[#D3D3D3]">Terminée</Badge>;
      case "annulee":
        return <Badge variant="outline" className="bg-[#FFEBEE] text-[#000000] border-[#D3D3D3]">Annulée</Badge>;
      default:
        return <Badge variant="outline" className="border-[#D3D3D3] text-[#000000]">Inconnu</Badge>;
    }
  };

  const handleViewDetails = (demande: DemandeConseil) => {
    setSelectedDemande(demande);
    setShowDetailModal(true);
  };

  const handleRespond = (demande: DemandeConseil) => {
    setSelectedDemande(demande);
    setResponseMessage("");
    setShowResponseModal(true);
  };

  const handleAssignExpert = (demande: DemandeConseil) => {
    setSelectedDemande(demande);
    setSelectedExpertId(demande.expertId || "non_assignee");
    setShowAssignModal(true);
  };

  const handleAddSuivi = (demande: DemandeConseil) => {
    setSelectedDemande(demande);
    setSuiviMessage("");
    setSuiviType("message");
    setShowSuiviModal(true);
  };

  const handleUpdateStatus = async (demandeId: number, newStatut: string) => {
    try {
      setLoadingUpdateStatus(prev => ({ ...prev, [demandeId]: true }));
      const response = await conseilAdminService.updateDemandeStatus(demandeId, newStatut);
      if (response.success) {
        toast.success(`Statut mis à jour: ${newStatut}`);
        await loadDemandes();
      } else {
        toast.error(response.error || "Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setLoadingUpdateStatus(prev => ({ ...prev, [demandeId]: false }));
    }
  };

  const handleSendResponse = async () => {
    if (!selectedDemande || !responseMessage.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }

    try {
      setLoadingSendResponse(true);
      const response = await conseilAdminService.sendAdminResponse(selectedDemande.id, responseMessage);
      if (response.success) {
        toast.success("Réponse envoyée avec succès");
        setShowResponseModal(false);
        setResponseMessage("");
        await loadDemandes();
      } else {
        toast.error(response.error || "Erreur lors de l'envoi de la réponse");
      }
    } catch (error) {
      console.error("Erreur envoi réponse:", error);
      toast.error("Erreur lors de l'envoi de la réponse");
    } finally {
      setLoadingSendResponse(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedDemande) {
      toast.error("Veuillez sélectionner une demande");
      return;
    }

    try {
      setLoadingAssignExpert(true);
      const expertIdToAssign = selectedExpertId === "non_assignee" ? null : selectedExpertId;
      const response = await conseilAdminService.assignExpert(selectedDemande.id, expertIdToAssign);
      if (response.success) {
        toast.success(expertIdToAssign ? "Expert assigné avec succès" : "Expert désassigné avec succès");
        setShowAssignModal(false);
        setSelectedExpertId("non_assignee");
        await loadDemandes();
      } else {
        toast.error(response.error || "Erreur lors de l'assignation");
      }
    } catch (error) {
      console.error("Erreur assignation:", error);
      toast.error("Erreur lors de l'assignation");
    } finally {
      setLoadingAssignExpert(false);
    }
  };

  const handleAddSuiviSubmit = async () => {
    if (!selectedDemande || !suiviMessage.trim()) {
      toast.error("Veuillez saisir un message de suivi");
      return;
    }

    try {
      setLoadingAddSuivi(true);
      const response = await conseilService.addSuivi(selectedDemande.id, {
        message: suiviMessage,
        type: suiviType
      });

      if (response.success) {
        toast.success("Suivi ajouté avec succès");
        setShowSuiviModal(false);
        setSuiviMessage("");
        setSuiviType("message");
        await loadDemandes();
      } else {
        toast.error(response.error || "Erreur lors de l'ajout du suivi");
      }
    } catch (error) {
      console.error("Erreur ajout suivi:", error);
      toast.error("Erreur lors de l'ajout du suivi");
    } finally {
      setLoadingAddSuivi(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setLoadingExport(true);
      const headers = ['ID', 'Client', 'Email', 'Entreprise', 'Type', 'Budget', 'Statut', 'Expert', 'Date création'];
      const csvData = filteredDemandes.map(d => [
        d.id,
        d.nom,
        d.email,
        d.entreprise || '',
        d.conseilType,
        d.budget,
        d.statut,
        d.expert ? `${d.expert.firstName} ${d.expert.lastName}` : 'Non assigné',
        new Date(d.createdAt).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `demandes_conseil_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export CSV réussi");
    } catch (error) {
      console.error("Erreur export CSV:", error);
      toast.error("Erreur lors de l'export CSV");
    } finally {
      setLoadingExport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FFFFFF]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#556B2F]" />
          <p className="text-lg text-[#000000]">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-[#FFFFFF]">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#8B4513]">Gestion des Demandes de Conseil</h1>
            <p className="text-[#000000] mt-2 opacity-80">
              Gérez et suivez toutes les demandes de conseil des clients
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStatsModal(true)}
              className="flex items-center gap-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
            >
              <BarChart className="h-4 w-4" />
              Statistiques
            </Button>
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={loadingExport || filteredDemandes.length === 0}
              className="flex items-center gap-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingExport ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Export...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Exporter
                </>
              )}
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={loadingRefresh}
              className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#556B2F] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingRefresh ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Actualisation...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#556B2F]">{stats.total}</div>
              <div className="text-sm text-[#000000]">Total Demandes</div>
            </div>
          </Card>
          <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#8B4513]">{stats.en_attente}</div>
              <div className="text-sm text-[#000000]">En Attente</div>
            </div>
          </Card>
          <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#6B8E23]">{stats.en_cours}</div>
              <div className="text-sm text-[#000000]">En Cours</div>
            </div>
          </Card>
          <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#556B2F]">{stats.terminee}</div>
              <div className="text-sm text-[#000000]">Terminées</div>
            </div>
          </Card>
          <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D32F2F]">{stats.annulee}</div>
              <div className="text-sm text-[#000000]">Annulées</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filtres */}
      <Card className="p-4 mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#000000]">Recherche</label>
            <div className="relative">
              <Input
                placeholder="Nom, email, entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#000000]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#000000]">Statut</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="border-[#D3D3D3]">
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="terminee">Terminée</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#000000]">Expert</label>
            <Select value={expertFilter} onValueChange={setExpertFilter}>
              <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                <SelectValue placeholder="Tous les experts" />
              </SelectTrigger>
              <SelectContent className="border-[#D3D3D3]">
                <SelectItem value="tous">Tous les experts</SelectItem>
                <SelectItem value="non_assignee">Non assignées</SelectItem>
                {experts.map(expert => (
                  <SelectItem key={expert.id} value={expert.id}>
                    {expert.firstName} {expert.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#000000]">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent className="border-[#D3D3D3]">
                <SelectItem value="tous">Tous les types</SelectItem>
                <SelectItem value="Audit Stratégique">Audit Stratégique</SelectItem>
                <SelectItem value="Médiation & Résolution">Médiation & Résolution</SelectItem>
                <SelectItem value="Conseil en Stratégie">Conseil en Stratégie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#000000]">Date</label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                <SelectValue placeholder="Toutes les dates" />
              </SelectTrigger>
              <SelectContent className="border-[#D3D3D3]">
                <SelectItem value="tous">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tableau des demandes */}
      <Card className="mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
        <div className="p-4 border-b border-[#D3D3D3]">
          <h2 className="text-lg font-semibold text-[#8B4513]">
            Demandes ({filteredDemandes.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#D3D3D3]">
                <TableHead className="text-[#000000] font-medium">ID</TableHead>
                <TableHead className="text-[#000000] font-medium">Client</TableHead>
                <TableHead className="text-[#000000] font-medium">Type</TableHead>
                <TableHead className="text-[#000000] font-medium">Expert</TableHead>
                <TableHead className="text-[#000000] font-medium">Statut</TableHead>
                <TableHead className="text-[#000000] font-medium">Date</TableHead>
                <TableHead className="text-right text-[#000000] font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemandes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#000000] opacity-80">
                    <EyeOff className="h-8 w-8 mx-auto mb-2 text-[#D3D3D3]" />
                    <p>Aucune demande trouvée</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDemandes.map((demande) => (
                  <TableRow key={demande.id} className="border-[#D3D3D3] hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#000000]">#{demande.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-[#D3D3D3]">
                          <AvatarFallback className="bg-[#F5F5F5] text-[#000000]">
                            {demande.nom.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[#000000]">{demande.nom}</div>
                          <div className="text-sm text-[#000000] opacity-80">{demande.entreprise}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#000000]">{demande.conseilType}</div>
                      <div className="text-sm text-[#000000] opacity-80">{demande.budget}</div>
                    </TableCell>
                    <TableCell>
                      {demande.expert ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-[#D3D3D3]">
                            <AvatarFallback className="bg-[#F5F5F5] text-[#000000]">
                              {demande.expert.firstName?.charAt(0)}{demande.expert.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm text-[#000000]">{demande.expert.firstName} {demande.expert.lastName}</div>
                            <div className="text-xs text-[#000000] opacity-70">{demande.expert.email}</div>
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-[#000000] border-[#D3D3D3]">
                          Non assigné
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(demande.statut)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-[#000000]">{new Date(demande.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-[#000000] opacity-70">
                        {new Date(demande.createdAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(demande)}
                          className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRespond(demande)}
                          className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignExpert(demande)}
                          className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Select
                          value={demande.statut}
                          onValueChange={(value) => handleUpdateStatus(demande.id, value)}
                          disabled={loadingUpdateStatus[demande.id]}
                        >
                          <SelectTrigger className={`h-8 w-32 border-[#D3D3D3] text-xs ${loadingUpdateStatus[demande.id] ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {loadingUpdateStatus[demande.id] ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Mise à jour...</span>
                              </div>
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent className="border-[#D3D3D3]">
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="terminee">Terminée</SelectItem>
                            <SelectItem value="annulee">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal Détails de la demande */}
      {selectedDemande && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#D3D3D3] bg-[#FFFFFF]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#8B4513]">
                <FileText className="h-5 w-5 text-[#556B2F]" />
                Détails de la demande #{selectedDemande.id}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Informations client */}
              <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#8B4513]">
                  <User className="h-5 w-5 text-[#556B2F]" />
                  Informations Client
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Nom complet</label>
                    <div className="font-medium text-[#000000]">{selectedDemande.nom}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Entreprise</label>
                    <div className="font-medium text-[#000000]">{selectedDemande.entreprise || "Non spécifié"}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Email</label>
                    <div className="font-medium flex items-center gap-2 text-[#000000]">
                      <Mail className="h-4 w-4 text-[#6B8E23]" />
                      {selectedDemande.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Téléphone</label>
                    <div className="font-medium flex items-center gap-2 text-[#000000]">
                      <Phone className="h-4 w-4 text-[#6B8E23]" />
                      {selectedDemande.telephone || "Non spécifié"}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Détails de la demande */}
              <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#8B4513]">
                  <FileText className="h-5 w-5 text-[#556B2F]" />
                  Détails de la Demande
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Type de conseil</label>
                    <div className="font-medium text-[#000000]">{selectedDemande.conseilType}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Budget estimé</label>
                    <div className="font-medium text-[#000000]">{selectedDemande.budget}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Besoin spécifique</label>
                    <div className="mt-1 p-3 bg-[#F5F5F5] rounded-lg border border-[#D3D3D3] text-[#000000]">
                      {selectedDemande.besoin}
                    </div>
                  </div>
                  {selectedDemande.message && (
                    <div>
                      <label className="text-sm font-medium text-[#000000] opacity-80">Message complémentaire</label>
                      <div className="mt-1 p-3 bg-[#F5F5F5] rounded-lg border border-[#D3D3D3] text-[#000000]">
                        {selectedDemande.message}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Expert assigné */}
              {selectedDemande.expert && (
                <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#8B4513]">
                    <UserCheck className="h-5 w-5 text-[#556B2F]" />
                    Expert Assigné
                  </h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-[#D3D3D3]">
                      <AvatarFallback className="bg-[#F5F5F5] text-[#000000]">
                        {selectedDemande.expert.firstName?.charAt(0)}{selectedDemande.expert.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-[#000000]">
                        {selectedDemande.expert.firstName} {selectedDemande.expert.lastName}
                      </div>
                      <div className="text-sm text-[#000000] opacity-80">{selectedDemande.expert.email}</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Suivis */}
              {selectedDemande.suivis && selectedDemande.suivis.length > 0 && (
                <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#8B4513]">
                    <MessageSquare className="h-5 w-5 text-[#556B2F]" />
                    Historique des Suivis
                  </h3>
                  <div className="space-y-4">
                    {selectedDemande.suivis.map((suivi, index) => (
                      <div key={index} className="border-l-2 border-[#556B2F] pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-[#000000]">
                              {suivi.user?.firstName} {suivi.user?.lastName}
                            </div>
                            <div className="text-sm text-[#000000] opacity-80">
                              {new Date(suivi.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize border-[#D3D3D3] text-[#000000]">
                            {suivi.type}
                          </Badge>
                        </div>
                        <div className="mt-2 p-2 bg-[#F5F5F5] rounded border border-[#D3D3D3] text-[#000000]">
                          {suivi.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => handleAssignExpert(selectedDemande)}
                className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
              >
                <UserPlus className="h-4 w-4 mr-2 text-[#556B2F]" />
                {selectedDemande.expert ? "Changer l'expert" : "Assigner un expert"}
              </Button>
              <Button 
                onClick={() => handleRespond(selectedDemande)}
                className="bg-[#6B8E23] hover:bg-[#556B2F] text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Répondre
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Répondre */}
      <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
        <DialogContent className="border-[#D3D3D3] bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">Répondre à la demande #{selectedDemande?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#000000]">Client</label>
              <div className="font-medium text-[#8B4513]">{selectedDemande?.nom} - {selectedDemande?.entreprise}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#000000]">Votre réponse *</label>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Tapez votre réponse ici..."
                rows={6}
                className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]"
              />
            </div>
            <div className="text-sm text-[#000000] opacity-80">
              Cette réponse sera envoyée par email au client et ajoutée aux suivis.
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowResponseModal(false)}
              disabled={loadingSendResponse}
              className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendResponse}
              disabled={loadingSendResponse || !responseMessage.trim()}
              className="bg-[#6B8E23] hover:bg-[#556B2F] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingSendResponse ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer la réponse
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Assigner Expert */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="border-[#D3D3D3] bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">Assigner un expert à la demande #{selectedDemande?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#000000]">Sélectionner un expert *</label>
              <Select value={selectedExpertId} onValueChange={setSelectedExpertId}>
                <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                  <SelectValue placeholder="Choisir un expert..." />
                </SelectTrigger>
                <SelectContent className="border-[#D3D3D3]">
                  <SelectItem value="non_assignee">Aucun (désassigner)</SelectItem>
                  {experts.map(expert => (
                    <SelectItem key={expert.id} value={expert.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-[#D3D3D3]">
                          <AvatarFallback className="bg-[#F5F5F5] text-[#000000]">
                            {expert.firstName?.charAt(0)}{expert.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-[#000000]">{expert.firstName} {expert.lastName}</div>
                          <div className="text-xs text-[#000000] opacity-80">{expert.title || expert.companyName}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-[#000000] opacity-80">
              L'expert recevra une notification et pourra commencer à traiter la demande.
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAssignModal(false)}
              disabled={loadingAssignExpert}
              className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={loadingAssignExpert}
              className="bg-[#6B8E23] hover:bg-[#556B2F] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAssignExpert ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assignation...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  {selectedExpertId !== "non_assignee" ? "Assigner l'expert" : "Désassigner"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Ajouter Suivi */}
      <Dialog open={showSuiviModal} onOpenChange={setShowSuiviModal}>
        <DialogContent className="border-[#D3D3D3] bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">Ajouter un suivi à la demande #{selectedDemande?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#000000]">Type de suivi</label>
              <Select value={suiviType} onValueChange={setSuiviType}>
                <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent className="border-[#D3D3D3]">
                  <SelectItem value="message">Message</SelectItem>
                  <SelectItem value="rendez_vous">Rendez-vous</SelectItem>
                  <SelectItem value="devis">Devis</SelectItem>
                  <SelectItem value="facture">Facture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#000000]">Message *</label>
              <Textarea
                value={suiviMessage}
                onChange={(e) => setSuiviMessage(e.target.value)}
                placeholder="Décrivez l'avancement ou l'action réalisée..."
                rows={4}
                className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSuiviModal(false)}
              disabled={loadingAddSuivi}
              className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAddSuiviSubmit}
              disabled={loadingAddSuivi || !suiviMessage.trim()}
              className="bg-[#6B8E23] hover:bg-[#556B2F] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAddSuivi ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ajouter le suivi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Statistiques */}
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="max-w-3xl border-[#D3D3D3] bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#8B4513]">
              <BarChart className="h-5 w-5 text-[#556B2F]" />
              Statistiques des Demandes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Graphiques et statistiques détaillées */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#556B2F]">{filteredDemandes.length}</div>
                  <div className="text-sm text-[#000000]">Demandes filtrées</div>
                </div>
              </Card>
              <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#556B2F]">
                    {demandes.filter(d => !d.expertId).length}
                  </div>
                  <div className="text-sm text-[#000000]">Non assignées</div>
                </div>
              </Card>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-[#8B4513]">Répartition par statut</h4>
              <div className="space-y-2">
                {['en_attente', 'en_cours', 'terminee', 'annulee'].map((statut) => {
                  const count = demandes.filter(d => d.statut === statut).length;
                  const percentage = demandes.length > 0 ? (count / demandes.length * 100).toFixed(1) : 0;
                  return (
                    <div key={statut} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(statut)}
                        <span className="text-sm text-[#000000] opacity-80">{statut.replace('_', ' ')}</span>
                      </div>
                      <div className="text-sm text-[#000000]">
                        {count} ({percentage}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowStatsModal(false)}
              className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminConseilPage;