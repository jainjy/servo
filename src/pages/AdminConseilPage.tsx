// src/pages/admin/AdminConseilPage.tsx - Version corrigée
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, ChevronDown, ChevronUp, Eye,
  MessageSquare, CheckCircle, XCircle, Clock, User,
  Star, Mail, Phone, Building, Calendar, MapPin,
  Download, Send, Users, BarChart, RefreshCw,
  MoreVertical, Edit, Trash2, FileText, EyeOff,
  Shield, AlertCircle, UserCheck, UserPlus,
  Loader2, Briefcase, Target, TrendingUp,
  Handshake, PieChart, Coins, Rocket
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
import { accompagnementService } from "@/services/accompagnementService";

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

interface DemandeAccompagnement {
  id: number;
  conseilType: string;
  besoin: string;
  budget: string;
  message: string;
  nom: string;
  email: string;
  telephone: string;
  entreprise: string;
  expertId: string | null;
  statut: string;
  origine: string;
  createdAt: string;
  updatedAt: string;
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
  const [activeTab, setActiveTab] = useState("conseil");
  
  // États pour les demandes de conseil
  const [demandesConseil, setDemandesConseil] = useState<DemandeConseil[]>([]);
  const [filteredDemandesConseil, setFilteredDemandesConseil] = useState<DemandeConseil[]>([]);
  
  // États pour les demandes d'accompagnement
  const [demandesAccompagnement, setDemandesAccompagnement] = useState<DemandeAccompagnement[]>([]);
  const [filteredDemandesAccompagnement, setFilteredDemandesAccompagnement] = useState<DemandeAccompagnement[]>([]);
  
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
    annulee: 0,
    totalAccompagnement: 0,
    en_attenteAccompagnement: 0
  });

  // États pour les filtres - Conseil
  const [searchTermConseil, setSearchTermConseil] = useState("");
  const [statusFilterConseil, setStatusFilterConseil] = useState("tous");
  const [expertFilterConseil, setExpertFilterConseil] = useState("tous");
  const [typeFilterConseil, setTypeFilterConseil] = useState("tous");
  const [dateFilterConseil, setDateFilterConseil] = useState("tous");

  // États pour les filtres - Accompagnement
  const [searchTermAccompagnement, setSearchTermAccompagnement] = useState("");
  const [statusFilterAccompagnement, setStatusFilterAccompagnement] = useState("tous");
  const [expertFilterAccompagnement, setExpertFilterAccompagnement] = useState("tous");
  const [typeFilterAccompagnement, setTypeFilterAccompagnement] = useState("tous");
  const [dateFilterAccompagnement, setDateFilterAccompagnement] = useState("tous");

  // États pour les modals
  const [selectedDemande, setSelectedDemande] = useState<DemandeConseil | DemandeAccompagnement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [isAccompagnement, setIsAccompagnement] = useState(false);

  // États pour les formulaires
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedExpertId, setSelectedExpertId] = useState<string>("non_assignee");
  const [newStatus, setNewStatus] = useState("");
  const [suiviMessage, setSuiviMessage] = useState("");
  const [suiviType, setSuiviType] = useState("message");

  // États pour le suivi
  const [showSuiviModal, setShowSuiviModal] = useState(false);

  // Types d'accompagnement
  const [accompagnementTypes, setAccompagnementTypes] = useState<any[]>([]);

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  // Filtrer les demandes de conseil
  useEffect(() => {
    filterDemandesConseil();
  }, [demandesConseil, searchTermConseil, statusFilterConseil, expertFilterConseil, typeFilterConseil, dateFilterConseil]);

  // Filtrer les demandes d'accompagnement
  useEffect(() => {
    filterDemandesAccompagnement();
  }, [demandesAccompagnement, searchTermAccompagnement, statusFilterAccompagnement, expertFilterAccompagnement, typeFilterAccompagnement, dateFilterAccompagnement]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les experts - utiliser le service conseil ou accompagnement
      const expertsResponse = await conseilService.getExperts();
      if (expertsResponse.success) {
        setExperts(expertsResponse.data);
      }

      // CORRECTION : utiliser getTypesAccompagnement au lieu de getTypes
      const typesResponse = await accompagnementService.getTypesAccompagnement();
      if (typesResponse.success) {
        setAccompagnementTypes(typesResponse.data);
      }

      // Charger les stats détaillées
      const statsResponse = await conseilAdminService.getDetailedStats();
      if (statsResponse.success) {
        setStats({
          total: statsResponse.data.totalDemandes || 0,
          en_attente: statsResponse.data.demandesEnAttente || 0,
          en_cours: statsResponse.data.demandesEnCours || 0,
          terminee: statsResponse.data.demandesTerminees || 0,
          annulee: statsResponse.data.demandesAnnulees || 0,
          totalAccompagnement: statsResponse.data.totalAccompagnement || 0,
          en_attenteAccompagnement: statsResponse.data.enAttenteAccompagnement || 0
        });
      }

      // Charger toutes les demandes de conseil
      await loadDemandesConseil();
      
      // Charger toutes les demandes d'accompagnement
      await loadDemandesAccompagnement();

    } catch (error) {
      console.error("Erreur chargement données:", error);
      toast.error("Erreur lors du chargement des données");
      
      // Charger des données par défaut pour les types d'accompagnement en cas d'erreur
      const defaultTypes = [
        {
          id: 1,
          title: "Accompagnement Création",
          description: "De l'idée à la création de votre entreprise",
          category: "creation",
          duration: "3-6 mois",
          price: "À partir de 1 500€",
          icon: "Rocket",
          color: "#6B8E23",
          details: [
            "Étude de faisabilité complète",
            "Business plan détaillé",
            "Choix de la structure juridique",
            "Formalités d'immatriculation",
            "Aides et subventions"
          ],
          isFeatured: true,
          isPopular: false
        },
        {
          id: 2,
          title: "Accompagnement Croissance",
          description: "Développez et optimisez votre entreprise existante",
          category: "croissance",
          duration: "6-12 mois",
          price: "À partir de 2 500€",
          icon: "TrendingUp",
          color: "#27AE60",
          details: [
            "Stratégie de développement",
            "Optimisation des processus",
            "Analyse de marché",
            "Plan de croissance",
            "Recrutement stratégique"
          ],
          isFeatured: false,
          isPopular: true
        },
        {
          id: 3,
          title: "Transition & Transmission",
          description: "Préparez la transmission ou la cession de votre entreprise",
          category: "transition",
          duration: "12-24 mois",
          price: "Sur devis personnalisé",
          icon: "Handshake",
          color: "#8B4513",
          details: [
            "Évaluation de l'entreprise",
            "Préparation à la transmission",
            "Recherche d'acquéreurs",
            "Négociation",
            "Accompagnement juridique"
          ],
          isFeatured: false,
          isPopular: false
        }
      ];
      
      setAccompagnementTypes(defaultTypes);
      
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

  const loadDemandesConseil = async () => {
    try {
      const response = await conseilAdminService.getAllDemandes();
      if (response.success) {
        // Filtrer pour n'avoir que les demandes de conseil (origine différente)
        const conseilDemandes = response.data.filter((d: DemandeConseil) => 
          d.origine !== "page_accompagnement"
        );
        setDemandesConseil(conseilDemandes);
        setFilteredDemandesConseil(conseilDemandes);
      }
    } catch (error) {
      console.error("Erreur chargement demandes conseil:", error);
      toast.error("Erreur lors du chargement des demandes de conseil");
    }
  };

  const loadDemandesAccompagnement = async () => {
    try {
      const response = await conseilAdminService.getAllDemandes();
      if (response.success) {
        // Filtrer pour n'avoir que les demandes d'accompagnement
        const accompagnementDemandes = response.data.filter((d: DemandeAccompagnement) => 
          d.origine === "page_accompagnement"
        );
        setDemandesAccompagnement(accompagnementDemandes);
        setFilteredDemandesAccompagnement(accompagnementDemandes);
      }
    } catch (error) {
      console.error("Erreur chargement demandes accompagnement:", error);
      toast.error("Erreur lors du chargement des demandes d'accompagnement");
    }
  };

  const filterDemandesConseil = () => {
    let filtered = [...demandesConseil];

    // Filtre par recherche
    if (searchTermConseil) {
      const term = searchTermConseil.toLowerCase();
      filtered = filtered.filter(d =>
        d.nom.toLowerCase().includes(term) ||
        d.email.toLowerCase().includes(term) ||
        d.conseilType.toLowerCase().includes(term) ||
        d.entreprise?.toLowerCase().includes(term) ||
        d.besoin.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilterConseil !== "tous") {
      filtered = filtered.filter(d => d.statut === statusFilterConseil);
    }

    // Filtre par expert
    if (expertFilterConseil !== "tous") {
      if (expertFilterConseil === "non_assignee") {
        filtered = filtered.filter(d => !d.expertId);
      } else {
        filtered = filtered.filter(d => d.expertId === expertFilterConseil);
      }
    }

    // Filtre par type
    if (typeFilterConseil !== "tous") {
      filtered = filtered.filter(d => d.conseilType === typeFilterConseil);
    }

    // Filtre par date
    if (dateFilterConseil === "today") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(d => d.createdAt.startsWith(today));
    } else if (dateFilterConseil === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(d => new Date(d.createdAt) > weekAgo);
    } else if (dateFilterConseil === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(d => new Date(d.createdAt) > monthAgo);
    }

    setFilteredDemandesConseil(filtered);
  };

  const filterDemandesAccompagnement = () => {
    let filtered = [...demandesAccompagnement];

    // Filtre par recherche
    if (searchTermAccompagnement) {
      const term = searchTermAccompagnement.toLowerCase();
      filtered = filtered.filter(d =>
        d.nom.toLowerCase().includes(term) ||
        d.email.toLowerCase().includes(term) ||
        d.conseilType.toLowerCase().includes(term) ||
        d.entreprise?.toLowerCase().includes(term) ||
        d.besoin.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilterAccompagnement !== "tous") {
      filtered = filtered.filter(d => d.statut === statusFilterAccompagnement);
    }

    // Filtre par expert
    if (expertFilterAccompagnement !== "tous") {
      if (expertFilterAccompagnement === "non_assignee") {
        filtered = filtered.filter(d => !d.expertId);
      } else {
        filtered = filtered.filter(d => d.expertId === expertFilterAccompagnement);
      }
    }

    // Filtre par type
    if (typeFilterAccompagnement !== "tous") {
      filtered = filtered.filter(d => d.conseilType === typeFilterAccompagnement);
    }

    // Filtre par date
    if (dateFilterAccompagnement === "today") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(d => d.createdAt.startsWith(today));
    } else if (dateFilterAccompagnement === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(d => new Date(d.createdAt) > weekAgo);
    } else if (dateFilterAccompagnement === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(d => new Date(d.createdAt) > monthAgo);
    }

    setFilteredDemandesAccompagnement(filtered);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Accompagnement Création":
        return <Rocket className="h-4 w-4 text-[#6B8E23]" />;
      case "Accompagnement Croissance":
        return <TrendingUp className="h-4 w-4 text-[#27AE60]" />;
      case "Transition & Transmission":
        return <Handshake className="h-4 w-4 text-[#8B4513]" />;
      case "Expertise Comptable & Fiscale":
        return <PieChart className="h-4 w-4 text-[#2C3E50]" />;
      case "Stratégie Marketing & Digital":
        return <Target className="h-4 w-4 text-[#D4AF37]" />;
      case "Financement & Levée de Fonds":
        return <Coins className="h-4 w-4 text-[#F39C12]" />;
      default:
        return <Briefcase className="h-4 w-4 text-[#556B2F]" />;
    }
  };

  const handleViewDetails = (demande: DemandeConseil | DemandeAccompagnement, isAccomp: boolean = false) => {
    setSelectedDemande(demande);
    setIsAccompagnement(isAccomp);
    setShowDetailModal(true);
  };

  const handleRespond = (demande: DemandeConseil | DemandeAccompagnement, isAccomp: boolean = false) => {
    setSelectedDemande(demande);
    setIsAccompagnement(isAccomp);
    setResponseMessage("");
    setShowResponseModal(true);
  };

  const handleAssignExpert = (demande: DemandeConseil | DemandeAccompagnement, isAccomp: boolean = false) => {
    setSelectedDemande(demande);
    setIsAccompagnement(isAccomp);
    setSelectedExpertId(demande.expertId || "non_assignee");
    setShowAssignModal(true);
  };

  const handleAddSuivi = (demande: DemandeConseil | DemandeAccompagnement, isAccomp: boolean = false) => {
    setSelectedDemande(demande);
    setIsAccompagnement(isAccomp);
    setSuiviMessage("");
    setSuiviType("message");
    setShowSuiviModal(true);
  };

  const handleUpdateStatus = async (demandeId: number, newStatut: string, isAccomp: boolean = false) => {
    try {
      setLoadingUpdateStatus(prev => ({ ...prev, [demandeId]: true }));
      const response = await conseilAdminService.updateDemandeStatus(demandeId, newStatut);
      if (response.success) {
        toast.success(`Statut mis à jour: ${newStatut}`);
        if (isAccomp) {
          await loadDemandesAccompagnement();
        } else {
          await loadDemandesConseil();
        }
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
        if (isAccompagnement) {
          await loadDemandesAccompagnement();
        } else {
          await loadDemandesConseil();
        }
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
        if (isAccompagnement) {
          await loadDemandesAccompagnement();
        } else {
          await loadDemandesConseil();
        }
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
        if (isAccompagnement) {
          await loadDemandesAccompagnement();
        } else {
          await loadDemandesConseil();
        }
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
      const dataToExport = activeTab === "conseil" ? filteredDemandesConseil : filteredDemandesAccompagnement;
      const headers = ['ID', 'Client', 'Email', 'Entreprise', 'Type', 'Budget', 'Statut', 'Expert', 'Date création'];
      const csvData = dataToExport.map(d => [
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
      link.setAttribute('download', `demandes_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#8B4513]">Gestion des Demandes</h1>
            <p className="text-[#000000] mt-2 opacity-80">
              Gérez et suivez toutes les demandes de conseil et d'accompagnement
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              disabled={loadingExport || 
                (activeTab === "conseil" ? filteredDemandesConseil.length === 0 : filteredDemandesAccompagnement.length === 0)}
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualisation...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#556B2F]">{stats.total}</div>
              <div className="text-sm text-[#000000]">Total Conseil</div>
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
              <div className="text-3xl font-bold text-[#27AE60]">{stats.totalAccompagnement}</div>
              <div className="text-sm text-[#000000]">Total Accomp.</div>
            </div>
          </Card>
          <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37]">{stats.en_attenteAccompagnement}</div>
              <div className="text-sm text-[#000000]">Attente Accomp.</div>
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

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-[#F5F5F5] border border-[#D3D3D3] h-auto grid grid-cols-1 md:grid-cols-2">
          <TabsTrigger 
            value="conseil" 
            className="data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Demandes de Conseil ({demandesConseil.length})
          </TabsTrigger>
          <TabsTrigger 
            value="accompagnement" 
            className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Demandes d'Accompagnement ({demandesAccompagnement.length})
          </TabsTrigger>
        </TabsList>

        {/* Onglet Conseil */}
        <TabsContent value="conseil" className="mt-6">
          {/* Filtres Conseil */}
          <Card className="p-4 mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#000000]">Recherche</label>
                <div className="relative">
                  <Input
                    placeholder="Nom, email, entreprise..."
                    value={searchTermConseil}
                    onChange={(e) => setSearchTermConseil(e.target.value)}
                    className="pl-10 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#000000]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#000000]">Statut</label>
                <Select value={statusFilterConseil} onValueChange={setStatusFilterConseil}>
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
                <Select value={expertFilterConseil} onValueChange={setExpertFilterConseil}>
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
                <Select value={typeFilterConseil} onValueChange={setTypeFilterConseil}>
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
                <Select value={dateFilterConseil} onValueChange={setDateFilterConseil}>
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

          {/* Tableau des demandes de conseil */}
          <Card className="mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="p-4 border-b border-[#D3D3D3]">
              <h2 className="text-lg font-semibold text-[#8B4513]">
                Demandes de Conseil ({filteredDemandesConseil.length})
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
                  {filteredDemandesConseil.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-[#000000] opacity-80">
                        <EyeOff className="h-8 w-8 mx-auto mb-2 text-[#D3D3D3]" />
                        <p>Aucune demande de conseil trouvée</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDemandesConseil.map((demande) => (
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
                              onClick={() => handleViewDetails(demande, false)}
                              className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRespond(demande, false)}
                              className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAssignExpert(demande, false)}
                              className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Select
                              value={demande.statut}
                              onValueChange={(value) => handleUpdateStatus(demande.id, value, false)}
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
        </TabsContent>

        {/* Onglet Accompagnement */}
        <TabsContent value="accompagnement" className="mt-6">
          {/* Filtres Accompagnement */}
          <Card className="p-4 mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#000000]">Recherche</label>
                <div className="relative">
                  <Input
                    placeholder="Nom, email, entreprise..."
                    value={searchTermAccompagnement}
                    onChange={(e) => setSearchTermAccompagnement(e.target.value)}
                    className="pl-10 border-[#D3D3D3] focus:border-[#27AE60] focus:ring-[#27AE60] text-[#000000]"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#000000]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#000000]">Statut</label>
                <Select value={statusFilterAccompagnement} onValueChange={setStatusFilterAccompagnement}>
                  <SelectTrigger className="border-[#D3D3D3] focus:border-[#27AE60] focus:ring-[#27AE60] text-[#000000]">
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
                <Select value={expertFilterAccompagnement} onValueChange={setExpertFilterAccompagnement}>
                  <SelectTrigger className="border-[#D3D3D3] focus:border-[#27AE60] focus:ring-[#27AE60] text-[#000000]">
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
                <Select value={typeFilterAccompagnement} onValueChange={setTypeFilterAccompagnement}>
                  <SelectTrigger className="border-[#D3D3D3] focus:border-[#27AE60] focus:ring-[#27AE60] text-[#000000]">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent className="border-[#D3D3D3]">
                    <SelectItem value="tous">Tous les types</SelectItem>
                    {accompagnementTypes && accompagnementTypes.length > 0 ? (
                      accompagnementTypes.map(type => (
                        <SelectItem key={type.id} value={type.title}>
                          {type.title}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Accompagnement Création">Accompagnement Création</SelectItem>
                        <SelectItem value="Accompagnement Croissance">Accompagnement Croissance</SelectItem>
                        <SelectItem value="Transition & Transmission">Transition & Transmission</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#000000]">Date</label>
                <Select value={dateFilterAccompagnement} onValueChange={setDateFilterAccompagnement}>
                  <SelectTrigger className="border-[#D3D3D3] focus:border-[#27AE60] focus:ring-[#27AE60] text-[#000000]">
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

          {/* Tableau des demandes d'accompagnement */}
          <Card className="mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
            <div className="p-4 border-b border-[#D3D3D3]">
              <h2 className="text-lg font-semibold text-[#27AE60]">
                Demandes d'Accompagnement ({filteredDemandesAccompagnement.length})
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
                  {filteredDemandesAccompagnement.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-[#000000] opacity-80">
                        <EyeOff className="h-8 w-8 mx-auto mb-2 text-[#D3D3D3]" />
                        <p>Aucune demande d'accompagnement trouvée</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDemandesAccompagnement.map((demande) => (
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
                          <div className="flex items-center gap-2">
                            {getTypeIcon(demande.conseilType)}
                            <div>
                              <div className="font-medium text-[#000000]">{demande.conseilType}</div>
                              <div className="text-sm text-[#000000] opacity-80">{demande.budget}</div>
                            </div>
                          </div>
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
                              onClick={() => handleViewDetails(demande, true)}
                              className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#27AE60] hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRespond(demande, true)}
                              className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#27AE60] hover:text-white"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAssignExpert(demande, true)}
                              className="h-8 px-2 border-[#D3D3D3] text-[#000000] hover:bg-[#27AE60] hover:text-white"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Select
                              value={demande.statut}
                              onValueChange={(value) => handleUpdateStatus(demande.id, value, true)}
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
        </TabsContent>
      </Tabs>

      {/* Modal Détails de la demande */}
      {selectedDemande && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#D3D3D3] bg-[#FFFFFF]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#8B4513]">
                <FileText className="h-5 w-5 text-[#556B2F]" />
                Détails de la demande #{selectedDemande.id}
                {isAccompagnement && (
                  <Badge className="ml-2 bg-[#27AE60] text-white">Accompagnement</Badge>
                )}
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
                    <label className="text-sm font-medium text-[#000000] opacity-80">Type de {isAccompagnement ? "d'accompagnement" : "conseil"}</label>
                    <div className="font-medium text-[#000000] flex items-center gap-2">
                      {isAccompagnement && getTypeIcon(selectedDemande.conseilType)}
                      {selectedDemande.conseilType}
                    </div>
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
                onClick={() => handleAddSuivi(selectedDemande, isAccompagnement)}
                className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2 text-[#556B2F]" />
                Ajouter un suivi
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAssignExpert(selectedDemande, isAccompagnement)}
                className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
              >
                <UserPlus className="h-4 w-4 mr-2 text-[#556B2F]" />
                {selectedDemande.expert ? "Changer l'expert" : "Assigner un expert"}
              </Button>
              <Button 
                onClick={() => handleRespond(selectedDemande, isAccompagnement)}
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
            <DialogTitle className="text-[#8B4513]">
              Répondre à la demande #{selectedDemande?.id}
              {isAccompagnement && " (Accompagnement)"}
            </DialogTitle>
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
            <DialogTitle className="text-[#8B4513]">
              Assigner un expert à la demande #{selectedDemande?.id}
              {isAccompagnement && " (Accompagnement)"}
            </DialogTitle>
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
            <DialogTitle className="text-[#8B4513]">
              Ajouter un suivi à la demande #{selectedDemande?.id}
              {isAccompagnement && " (Accompagnement)"}
            </DialogTitle>
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
                  <div className="text-2xl font-bold text-[#556B2F]">{demandesConseil.length}</div>
                  <div className="text-sm text-[#000000]">Demandes de conseil</div>
                </div>
              </Card>
              <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#27AE60]">{demandesAccompagnement.length}</div>
                  <div className="text-sm text-[#000000]">Demandes d'accompagnement</div>
                </div>
              </Card>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-[#8B4513]">Répartition par statut (Conseil)</h4>
              <div className="space-y-2">
                {['en_attente', 'en_cours', 'terminee', 'annulee'].map((statut) => {
                  const count = demandesConseil.filter(d => d.statut === statut).length;
                  const percentage = demandesConseil.length > 0 ? (count / demandesConseil.length * 100).toFixed(1) : 0;
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

            <div>
              <h4 className="font-medium mb-2 text-[#27AE60]">Répartition par statut (Accompagnement)</h4>
              <div className="space-y-2">
                {['en_attente', 'en_cours', 'terminee', 'annulee'].map((statut) => {
                  const count = demandesAccompagnement.filter(d => d.statut === statut).length;
                  const percentage = demandesAccompagnement.length > 0 ? (count / demandesAccompagnement.length * 100).toFixed(1) : 0;
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