// src/pages/expert/ExpertDashboardPage.tsx - VERSION COMPLÈTE ET CORRIGÉE
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, Calendar, CheckCircle, Clock, AlertCircle,
  Users, Star, FileText, Mail, Phone, MapPin, Building,
  Download, Send, Eye, Filter, Search, RefreshCw, User,
  TrendingUp, BarChart, Bell, ChevronRight, ChevronDown,
  Shield, Target, Handshake, Rocket, Lightbulb, Globe,
  Award, ThumbsUp, X, MoreVertical, Loader2, MessageCircle,
  Check, XCircle, CalendarDays, Briefcase, ChartBar,
  UserPlus, EyeOff, ArrowUpRight, DownloadCloud, Zap,
  CheckSquare, Square, Clock3, UserCheck, MailCheck,
  PhoneCall, Video, FileCheck, FileText as FileTextIcon,
  MessageSquareText, AlertTriangle, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { conseilService } from "@/services/conseilService";
import { accompagnementService } from "@/services/accompagnementService";
import { expertService } from "@/services/expertService";

// Palette de couleurs
const colors = {
  primary: "#6B8E23",
  secondary: "#8B4513",
  accent: "#D4AF37",
  success: "#27AE60",
  warning: "#F39C12",
  error: "#E74C3C",
  info: "#3498DB",
  dark: "#2C3E50",
  light: "#FFFFF0",
  gray: "#D3D3D3",
  white: "#FFFFFF"
};

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
  statut: "en_attente" | "en_cours" | "terminee" | "annulee" | "en_revision";
  origine: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    avatar: string;
  };
  suivis: Array<{
    id: number;
    message: string;
    type: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
  service: any;
  metier: any;
  typeDemande?: "conseil" | "accompagnement";
}

interface Statistiques {
  total: number;
  en_attente: number;
  en_cours: number;
  terminee: number;
  annulee: number;
  en_revision: number;
  satisfaction: number;
  tempsMoyenReponse: string;
  revenuTotal: number;
  demandeMois: number;
  conseil: number;
  accompagnement: number;
}

interface ExpertInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  specialty: string;
  experience: string;
  rating: number;
  projects: number;
  avatar: string;
  companyName: string;
  availability: 'disponible' | 'limitee' | 'complet';
  certifications: string[];
  metiers: string[];
  services: string[];
}

const ExpertDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("en_cours");
  const [demandes, setDemandes] = useState<DemandeConseil[]>([]);
  const [filteredDemandes, setFilteredDemandes] = useState<DemandeConseil[]>([]);
  const [statistiques, setStatistiques] = useState<Statistiques>({
    total: 0,
    en_attente: 0,
    en_cours: 0,
    terminee: 0,
    annulee: 0,
    en_revision: 0,
    satisfaction: 95,
    tempsMoyenReponse: "24h",
    revenuTotal: 0,
    demandeMois: 0,
    conseil: 0,
    accompagnement: 0
  });
  const [expertInfo, setExpertInfo] = useState<ExpertInfo | null>(null);
  
  // États de chargement
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingDemandes, setLoadingDemandes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{[key: number]: boolean}>({});
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [typeFilter, setTypeFilter] = useState("tous");
  const [dateFilter, setDateFilter] = useState("tous");
  const [origineFilter, setOrigineFilter] = useState("tous");
  
  // États pour les modals
  const [selectedDemande, setSelectedDemande] = useState<DemandeConseil | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showSuiviModal, setShowSuiviModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  
  // États pour les formulaires
  const [responseMessage, setResponseMessage] = useState("");
  const [suiviMessage, setSuiviMessage] = useState("");
  const [suiviType, setSuiviType] = useState("message");
  const [newAvailability, setNewAvailability] = useState<'disponible' | 'limitee' | 'complet'>('disponible');
  const [newStatus, setNewStatus] = useState("");

  // Charger les données au montage
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filtrer les demandes
  useEffect(() => {
    filterDemandes();
  }, [demandes, searchTerm, statusFilter, typeFilter, dateFilter, origineFilter, activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadExpertInfo(),
        loadDemandes(),
        loadStatistics()
      ]);
    } catch (error) {
      console.error("❌ Erreur chargement dashboard:", error);
      toast.error("Erreur lors du chargement du dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadExpertInfo = async () => {
    try {
      const response = await expertService.getProfile();
      if (response.success && response.data) {
        setExpertInfo(response.data);
      } else {
        // Fallback
        const userResponse = await conseilService.getUserInfo();
        if (userResponse.success && userResponse.data) {
          const user = userResponse.data;
          setExpertInfo({
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email || '',
            phone: user.phone || '',
            title: user.role === 'expert' ? 'Expert Conseil' : 'Professionnel',
            specialty: user.metiers?.[0]?.metier?.libelle || 'Conseil stratégique',
            experience: "Expérience variable",
            rating: 4.5,
            projects: user._count?.expertDemandesConseil || 0,
            avatar: user.avatar || '',
            companyName: user.companyName || user.commercialName || '',
            availability: 'disponible',
            certifications: [],
            metiers: user.metiers?.map((m: any) => m.metier.libelle) || [],
            services: user.services?.map((s: any) => s.service.libelle) || []
          });
        }
      }
    } catch (error) {
      console.error("❌ Erreur chargement info expert:", error);
    }
  };

 const loadDemandes = async () => {
  try {
    setLoadingDemandes(true);
    
    console.log("🔄 Chargement des demandes via expertService...");
    
    // Utiliser directement le service expert
    const response = await expertService.getToutesDemandesExpert();
    
    if (response.success) {
      console.log(`✅ ${response.data.length} demandes chargées`);
      
      // Compter les types
      const counts = response.counts || {
        conseil: response.data.filter(d => d.typeDemande === "conseil").length,
        accompagnement: response.data.filter(d => d.typeDemande === "accompagnement").length
      };
      
      setDemandes(response.data);
      
      // Calculer les statistiques
      const stats = calculateStatistics(response.data);
      setStatistiques(stats);
      
      // Message informatif
      toast.success(`Dashboard chargé: ${counts.conseil} conseil(s) et ${counts.accompagnement} accompagnement(s)`);
      
    } else {
      console.error("❌ Erreur service expert:", response.error);
      toast.error("Erreur lors du chargement des demandes");
      
      // Fallback aux données de test
      const testData = expertService.getTestData();
      if (testData.success) {
        setDemandes(testData.data);
        setStatistiques(calculateStatistics(testData.data));
        toast.info("Utilisation des données de démonstration");
      }
    }
    
  } catch (error) {
    console.error("❌ Erreur chargement demandes:", error);
    toast.error("Erreur de connexion au serveur");
    
    // Fallback aux données de test
    const testData = expertService.getTestData();
    if (testData.success) {
      setDemandes(testData.data);
      setStatistiques(calculateStatistics(testData.data));
    }
  } finally {
    setLoadingDemandes(false);
  }
};

  const loadDemandesFallback = async () => {
    try {
      console.log("🔄 Utilisation fallback...");
      
      // Récupérer l'ID de l'expert
      const userInfo = await expertService.getUserInfo();
      const expertId = userInfo.data?.id;
      
      if (!expertId) {
        console.error("❌ Expert ID non trouvé");
        return;
      }
      
      // Récupérer toutes les demandes admin et filtrer
      const [conseilResponse, accompagnementResponse] = await Promise.all([
        conseilService.getMesDemandes(), // Essayons d'abord les demandes conseil
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accompagnement/demandes`).then(res => res.json())
      ]);
      
      let toutesDemandes = [];
      
      // Conseils
      if (conseilResponse.success && conseilResponse.data) {
        const mesConseils = conseilResponse.data.filter((d: any) => 
          d.expertId === expertId || d.expert?.id === expertId
        ).map((d: any) => ({
          ...d,
          typeDemande: "conseil",
          origine: d.origine || "page_conseil"
        }));
        
        toutesDemandes = [...toutesDemandes, ...mesConseils];
      }
      
      // Accompagnements (si API disponible)
      if (accompagnementResponse?.success && accompagnementResponse.data) {
        const mesAccomp = accompagnementResponse.data.filter((d: any) => 
          d.expertId === expertId || d.expert?.id === expertId
        ).map((d: any) => ({
          ...d,
          typeDemande: "accompagnement",
          origine: d.origine || "page_accompagnement"
        }));
        
        toutesDemandes = [...toutesDemandes, ...mesAccomp];
      }
      
      // Si aucune donnée, utiliser les données de test
      if (toutesDemandes.length === 0) {
        console.log("📝 Utilisation données de test...");
        toutesDemandes = getTestData(expertId);
      }
      
      setDemandes(toutesDemandes);
      const stats = calculateStatistics(toutesDemandes);
      setStatistiques(stats);
      
      console.log(`📊 Fallback - ${toutesDemandes.length} demandes chargées`);
      
    } catch (error) {
      console.error("❌ Erreur fallback:", error);
      // Données de test finales
      const testData = getTestData("expert-1");
      setDemandes(testData);
      setStatistiques(calculateStatistics(testData));
    }
  };

  const getTestData = (expertId: string) => {
    return [
      {
        id: 101,
        conseilType: "Audit Stratégique",
        besoin: "Test conseil - audit stratégique",
        budget: "2 500€",
        nom: "Test Client Conseil",
        email: "test@conseil.fr",
        statut: "en_cours" as const,
        origine: "page_conseil",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        typeDemande: "conseil" as const,
        expertId: expertId,
        user: {
          id: "user-101",
          firstName: "Test",
          lastName: "Client",
          email: "test@conseil.fr",
          phone: "+33 6 11 22 33 44",
          companyName: "Test Entreprise",
          avatar: ""
        },
        suivis: []
      },
      {
        id: 201,
        conseilType: "Accompagnement Création",
        besoin: "Test accompagnement - création startup",
        budget: "1 500€",
        nom: "Test Client Accompagnement",
        email: "test@accomp.fr",
        statut: "en_attente" as const,
        origine: "page_accompagnement",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        typeDemande: "accompagnement" as const,
        expertId: expertId,
        user: {
          id: "user-201",
          firstName: "Accomp",
          lastName: "Client",
          email: "test@accomp.fr",
          phone: "+33 6 99 88 77 66",
          companyName: "Startup Test",
          avatar: ""
        },
        suivis: []
      }
    ];
  };

  const loadStatistics = async () => {
    try {
      setLoadingStats(true);
      const response = await expertService.getStatsExpert();
      
      if (response.success) {
        setStatistiques(response.data);
      } else {
        // Calculer à partir des demandes
        const stats = calculateStatistics(demandes);
        setStatistiques(stats);
      }
    } catch (error) {
      console.error("❌ Erreur chargement statistiques:", error);
      const stats = calculateStatistics(demandes);
      setStatistiques(stats);
    } finally {
      setLoadingStats(false);
    }
  };

  const calculateStatistics = (demandesList: DemandeConseil[]): Statistiques => {
    if (!demandesList || !Array.isArray(demandesList)) {
      return {
        total: 0,
        en_attente: 0,
        en_cours: 0,
        terminee: 0,
        annulee: 0,
        en_revision: 0,
        satisfaction: 95,
        tempsMoyenReponse: "24h",
        revenuTotal: 0,
        demandeMois: 0,
        conseil: 0,
        accompagnement: 0
      };
    }
    
    const maintenant = new Date();
    const moisEnCours = maintenant.getMonth();
    const anneeEnCours = maintenant.getFullYear();
    
    const demandeMois = demandesList.filter(d => {
      if (!d.createdAt) return false;
      const date = new Date(d.createdAt);
      return date.getMonth() === moisEnCours && date.getFullYear() === anneeEnCours;
    }).length;
    
    const terminees = demandesList.filter(d => d.statut === "terminee");
    const revenuTotal = terminees.length * 1500; // Estimation
    
    return {
      total: demandesList.length,
      en_attente: demandesList.filter(d => d.statut === "en_attente").length,
      en_cours: demandesList.filter(d => d.statut === "en_cours").length,
      terminee: terminees.length,
      annulee: demandesList.filter(d => d.statut === "annulee").length,
      en_revision: demandesList.filter(d => d.statut === "en_revision").length,
      satisfaction: 95,
      tempsMoyenReponse: "24h",
      revenuTotal: revenuTotal,
      demandeMois: demandeMois,
      conseil: demandesList.filter(d => d.typeDemande === "conseil" || d.origine === "page_conseil").length,
      accompagnement: demandesList.filter(d => d.typeDemande === "accompagnement" || d.origine === "page_accompagnement").length
    };
  };

  const filterDemandes = () => {
    let filtered = [...demandes];
    
    // Filtrer par tab active
    if (activeTab !== "toutes") {
      filtered = filtered.filter(d => d.statut === activeTab);
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.nom.toLowerCase().includes(term) ||
        d.email.toLowerCase().includes(term) ||
        d.conseilType.toLowerCase().includes(term) ||
        d.entreprise?.toLowerCase().includes(term)
      );
    }
    
    // Filtre par statut
    if (statusFilter !== "tous") {
      filtered = filtered.filter(d => d.statut === statusFilter);
    }
    
    // Filtre par type de demande
    if (typeFilter !== "tous") {
      if (typeFilter === "conseil") {
        filtered = filtered.filter(d => d.typeDemande === "conseil" || d.origine === "page_conseil");
      } else if (typeFilter === "accompagnement") {
        filtered = filtered.filter(d => d.typeDemande === "accompagnement" || d.origine === "page_accompagnement");
      }
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
    
    // Filtre par origine
    if (origineFilter !== "tous") {
      filtered = filtered.filter(d => d.origine === origineFilter);
    }
    
    setFilteredDemandes(filtered);
  };

  const refreshData = async () => {
    setLoading(true);
    await loadDashboardData();
    toast.success("Dashboard actualisé");
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

  const handleAddSuivi = (demande: DemandeConseil) => {
    setSelectedDemande(demande);
    setSuiviMessage("");
    setSuiviType("message");
    setShowSuiviModal(true);
  };

  const handleUpdateStatus = async (demandeId: number, newStatut: string) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [demandeId]: true }));
      
      const response = await expertService.updateDemandeStatus(demandeId, newStatut);
      
      if (response.success) {
        toast.success(`Statut mis à jour: ${newStatut}`);
        await loadDemandes();
        await loadStatistics();
      } else {
        toast.error(response.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("❌ Erreur mise à jour statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [demandeId]: false }));
    }
  };

  const handleSendResponse = async () => {
    if (!selectedDemande || !responseMessage.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }

    try {
      const response = await expertService.addSuivi(selectedDemande.id, {
        message: responseMessage,
        type: "message"
      });

      if (response.success) {
        toast.success("Réponse envoyée avec succès");
        setShowResponseModal(false);
        setResponseMessage("");
        await loadDemandes();
      } else {
        toast.error(response.error || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("❌ Erreur envoi réponse:", error);
      toast.error("Erreur lors de l'envoi de la réponse");
    }
  };

  const handleAddSuiviSubmit = async () => {
    if (!selectedDemande || !suiviMessage.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }

    try {
      const response = await expertService.addSuivi(selectedDemande.id, {
        message: suiviMessage,
        type: suiviType
      });

      if (response.success) {
        toast.success("Suivi ajouté avec succès");
        setShowSuiviModal(false);
        setSuiviMessage("");
        await loadDemandes();
      } else {
        toast.error(response.error || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("❌ Erreur ajout suivi:", error);
      toast.error("Erreur lors de l'ajout du suivi");
    }
  };

  const handleUpdateAvailability = async () => {
    try {
      const response = await expertService.updateAvailability(newAvailability);
      
      if (response.success) {
        toast.success(`Disponibilité mise à jour: ${newAvailability}`);
        setShowAvailabilityModal(false);
        
        if (expertInfo) {
          setExpertInfo({
            ...expertInfo,
            availability: newAvailability
          });
        }
      } else {
        toast.error(response.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("❌ Erreur mise à jour disponibilité:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const exportToCSV = () => {
    try {
      const dataToExport = filteredDemandes;
      const headers = ['ID', 'Client', 'Email', 'Type', 'Catégorie', 'Budget', 'Statut', 'Date création'];
      const csvData = dataToExport.map(d => [
        d.id,
        d.nom,
        d.email,
        d.conseilType,
        d.typeDemande === "accompagnement" ? "Accompagnement" : "Conseil",
        d.budget,
        d.statut,
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
      link.setAttribute('download', `mes_demandes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export CSV réussi");
    } catch (error) {
      console.error("❌ Erreur export CSV:", error);
      toast.error("Erreur lors de l'export");
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          En attente
        </Badge>;
      case "en_cours":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <MessageSquare className="h-3 w-3 mr-1" />
          En cours
        </Badge>;
      case "terminee":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Terminée
        </Badge>;
      case "annulee":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Annulée
        </Badge>;
      case "en_revision":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Eye className="h-3 w-3 mr-1" />
          En révision
        </Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "en_attente": return colors.warning;
      case "en_cours": return colors.info;
      case "terminee": return colors.success;
      case "annulee": return colors.error;
      case "en_revision": return colors.accent;
      default: return colors.gray;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Audit")) return <BarChart className="h-4 w-4" />;
    if (type.includes("Médiation")) return <Handshake className="h-4 w-4" />;
    if (type.includes("Stratégie")) return <Target className="h-4 w-4" />;
    if (type.includes("Création")) return <Rocket className="h-4 w-4" />;
    if (type.includes("Croissance")) return <TrendingUp className="h-4 w-4" />;
    if (type.includes("Transition")) return <Shield className="h-4 w-4" />;
    return <Briefcase className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Test API
  const testAPI = async () => {
    console.log("🔍 Test API en cours...");
    
    try {
      // Test 1: Récupération info expert
      const profile = await expertService.getProfile();
      console.log("👤 Profile:", profile.success ? "OK" : "ERROR", profile.data?.id);
      
      // Test 2: Récupération demandes expert
      const demandes = await expertService.getToutesDemandesExpert();
      console.log("📊 Demandes:", demandes.success ? "OK" : "ERROR", demandes.data?.length);
      
      // Test 3: Vérification token
      const token = localStorage.getItem('auth-token');
      console.log("🔑 Token:", token ? "présent" : "absent");
      
      toast.success("Tests API terminés - Voir console");
      
    } catch (error) {
      console.error("❌ Erreur test API:", error);
      toast.error("Erreur lors des tests API");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 rounded-full mx-auto mb-4 border-t-transparent"
            style={{ borderColor: colors.primary }}
          />
          <p className="text-lg font-medium text-gray-700">
            Chargement de votre espace expert...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard Expert
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez vos demandes de conseil et d'accompagnement
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={testAPI}
              className="flex items-center gap-2 text-xs"
            >
              <Search className="h-3 w-3" />
              Tester API
            </Button>
            
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={loadingDemandes}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loadingDemandes ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={filteredDemandes.length === 0}
              className="flex items-center gap-2"
            >
              <DownloadCloud className="h-4 w-4" />
              Exporter
            </Button>
            
            <Button
              onClick={() => setShowStatsModal(true)}
              className="flex items-center gap-2"
              style={{ backgroundColor: colors.primary }}
            >
              <ChartBar className="h-4 w-4" />
              Statistiques
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-6 border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2" style={{ borderColor: colors.primary }}>
                  <AvatarImage src={expertInfo?.avatar} />
                  <AvatarFallback className="text-lg" style={{ backgroundColor: colors.primary, color: 'white' }}>
                    {expertInfo?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{expertInfo?.name}</h2>
                    <Badge className="capitalize" style={{ 
                      backgroundColor: expertInfo?.availability === 'disponible' ? colors.success + '20' :
                                      expertInfo?.availability === 'limitee' ? colors.warning + '20' :
                                      colors.error + '20',
                      color: expertInfo?.availability === 'disponible' ? colors.success :
                             expertInfo?.availability === 'limitee' ? colors.warning :
                             colors.error
                    }}>
                      {expertInfo?.availability}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600">{expertInfo?.title} • {expertInfo?.specialty}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" style={{ color: colors.accent, fill: colors.accent }} />
                      <span className="font-medium">{expertInfo?.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{expertInfo?.projects} projets</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{expertInfo?.experience}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAvailabilityModal(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Disponibilité
                </Button>
                
                <Button className="flex items-center gap-2" style={{ backgroundColor: colors.secondary }}>
                  <MessageSquare className="h-4 w-4" />
                  Nouveau message
                </Button>
              </div>
            </div>
            
            {/* Tags de spécialités */}
            <div className="flex flex-wrap gap-2 mt-4">
              {expertInfo?.metiers.slice(0, 3).map((metier, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {metier}
                </Badge>
              ))}
              {expertInfo?.metiers.length > 3 && (
                <Badge variant="outline" className="text-sm">
                  +{expertInfo.metiers.length - 3} autres
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <h3 className="text-2xl font-bold text-gray-900">{statistiques.total}</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                  <FileText className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">En cours</p>
                  <h3 className="text-2xl font-bold text-blue-600">{statistiques.en_cours}</h3>
                </div>
                <div className="p-2 rounded-lg bg-blue-50">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Terminées</p>
                  <h3 className="text-2xl font-bold text-green-600">{statistiques.terminee}</h3>
                </div>
                <div className="p-2 rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Conseil</p>
                  <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>{statistiques.conseil}</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                  <Target className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Accompagnement</p>
                  <h3 className="text-2xl font-bold" style={{ color: colors.success }}>{statistiques.accompagnement}</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: colors.success + '20' }}>
                  <Rocket className="h-5 w-5" style={{ color: colors.success }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Satisfaction</p>
                  <h3 className="text-2xl font-bold" style={{ color: colors.accent }}>{statistiques.satisfaction}%</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: colors.accent + '20' }}>
                  <ThumbsUp className="h-5 w-5" style={{ color: colors.accent }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ce mois</p>
                  <h3 className="text-2xl font-bold" style={{ color: colors.secondary }}>{statistiques.demandeMois}</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: colors.secondary + '20' }}>
                  <TrendingUp className="h-5 w-5" style={{ color: colors.secondary }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Filters */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>Filtrez vos demandes</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-1 block">Recherche</label>
                <div className="relative">
                  <Input
                    placeholder="Client, entreprise, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Statut</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="terminee">Terminée</SelectItem>
                    <SelectItem value="annulee">Annulée</SelectItem>
                    <SelectItem value="en_revision">En révision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Type de demande</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les types</SelectItem>
                    <SelectItem value="conseil">Conseil uniquement</SelectItem>
                    <SelectItem value="accompagnement">Accompagnement uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes les dates</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Origine Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">Origine</label>
                <Select value={origineFilter} onValueChange={setOrigineFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les origines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes les origines</SelectItem>
                    <SelectItem value="page_conseil">Page Conseil</SelectItem>
                    <SelectItem value="page_accompagnement">Page Accompagnement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("tous");
                  setTypeFilter("tous");
                  setDateFilter("tous");
                  setOrigineFilter("tous");
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Statistiques rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['en_attente', 'en_cours', 'terminee', 'annulee'].map((statut) => {
                  const count = demandes.filter(d => d.statut === statut).length;
                  const percentage = demandes.length > 0 ? (count / demandes.length * 100).toFixed(0) : 0;
                  
                  return (
                    <div key={statut} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getStatusColor(statut) }} />
                        <span className="text-sm capitalize">{statut.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{count}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Demandes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Vos demandes</CardTitle>
                  <CardDescription>
                    {filteredDemandes.length} demande{filteredDemandes.length > 1 ? 's' : ''} trouvée{filteredDemandes.length > 1 ? 's' : ''}
                    {statistiques.conseil > 0 && statistiques.accompagnement > 0 && (
                      <span className="ml-2">
                        ({statistiques.conseil} conseil{statistiques.conseil > 1 ? 's' : ''}, 
                        {statistiques.accompagnement} accompagnement{statistiques.accompagnement > 1 ? 's' : ''})
                      </span>
                    )}
                  </CardDescription>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                    <TabsTrigger value="toutes" className="text-xs">Toutes</TabsTrigger>
                    <TabsTrigger value="en_attente" className="text-xs">En attente</TabsTrigger>
                    <TabsTrigger value="en_cours" className="text-xs">En cours</TabsTrigger>
                    <TabsTrigger value="terminee" className="text-xs">Terminées</TabsTrigger>
                    <TabsTrigger value="annulee" className="text-xs">Annulées</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {loadingDemandes ? (
                <div className="p-8 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Chargement des demandes...</p>
                </div>
              ) : filteredDemandes.length === 0 ? (
                <div className="p-8 text-center">
                  <EyeOff className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Aucune demande trouvée</h3>
                  <p className="text-gray-400">Essayez avec d'autres critères de recherche</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDemandes.map((demande) => {
                        const isAccompagnement = demande.typeDemande === "accompagnement" || demande.origine === "page_accompagnement";
                        
                        return (
                          <TableRow key={demande.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">#{demande.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {demande.nom?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{demande.nom}</div>
                                  <div className="text-xs text-gray-500">{demande.entreprise}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getTypeIcon(demande.conseilType)}
                                <span className="text-sm">{demande.conseilType}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={isAccompagnement ? "outline" : "secondary"} 
                                     className={isAccompagnement ? "border-green-200 text-green-700" : ""}>
                                {isAccompagnement ? "Accompagnement" : "Conseil"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(demande.statut)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(demande.createdAt)}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewDetails(demande)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                <Select
                                  value={demande.statut}
                                  onValueChange={(value) => handleUpdateStatus(demande.id, value)}
                                  disabled={updatingStatus[demande.id]}
                                >
                                  <SelectTrigger className="h-8 w-28 text-xs">
                                    {updatingStatus[demande.id] ? (
                                      <div className="flex items-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>...</span>
                                      </div>
                                    ) : (
                                      <SelectValue />
                                    )}
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="en_attente">En attente</SelectItem>
                                    <SelectItem value="en_cours">En cours</SelectItem>
                                    <SelectItem value="terminee">Terminée</SelectItem>
                                    <SelectItem value="annulee">Annulée</SelectItem>
                                    <SelectItem value="en_revision">En révision</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            
            {filteredDemandes.length > 0 && (
              <CardFooter className="border-t px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm text-gray-500">
                    Affichage de {Math.min(filteredDemandes.length, 10)} sur {filteredDemandes.length} demandes
                  </p>
                  <Button variant="outline" size="sm">
                    Voir toutes les demandes
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Activité récente</span>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                  <span className="ml-2">Notifications</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandes.slice(0, 3).map((demande) => {
                  const isAccompagnement = demande.typeDemande === "accompagnement" || demande.origine === "page_accompagnement";
                  
                  return (
                    <div key={demande.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center" 
                           style={{ 
                             backgroundColor: isAccompagnement ? colors.success + '20' : colors.primary + '20' 
                           }}>
                        {getTypeIcon(demande.conseilType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{demande.nom}</h4>
                          <span className="text-xs text-gray-500">{formatDateTime(demande.updatedAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{demande.conseilType}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(demande.statut)}
                          <Badge variant="outline" className="text-xs">
                            {isAccompagnement ? "Accompagnement" : "Conseil"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Détails Demande */}
      {selectedDemande && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Demande #{selectedDemande.id} - {selectedDemande.conseilType}
                {selectedDemande.typeDemande === "accompagnement" || selectedDemande.origine === "page_accompagnement" ? (
                  <Badge className="ml-2 bg-green-100 text-green-800">Accompagnement</Badge>
                ) : (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Conseil</Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Détails complets de la demande
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations client
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nom complet</label>
                    <p className="font-medium">{selectedDemande.nom}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Entreprise</label>
                    <p className="font-medium">{selectedDemande.entreprise || "Non spécifié"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${selectedDemande.email}`} className="font-medium text-blue-600 hover:underline">
                        {selectedDemande.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Téléphone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedDemande.telephone}`} className="font-medium">
                        {selectedDemande.telephone || "Non spécifié"}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demande Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5" />
                    Détails de la demande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Type de service</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(selectedDemande.conseilType)}
                      <div>
                        <p className="font-medium">{selectedDemande.conseilType}</p>
                        <p className="text-sm text-gray-500">
                          {selectedDemande.typeDemande === "accompagnement" || selectedDemande.origine === "page_accompagnement" 
                            ? "Service d'accompagnement" 
                            : "Service de conseil"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Budget estimé</label>
                    <p className="font-medium">{selectedDemande.budget}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Besoin spécifique</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedDemande.besoin}</p>
                    </div>
                  </div>
                  {selectedDemande.message && (
                    <div>
                      <label className="text-sm text-gray-500">Message complémentaire</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        <p className="whitespace-pre-wrap">{selectedDemande.message}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Historique Suivis */}
              {selectedDemande.suivis && selectedDemande.suivis.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquareText className="h-5 w-5" />
                      Historique des suivis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedDemande.suivis.map((suivi, index) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {suivi.user?.firstName} {suivi.user?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDateTime(suivi.createdAt)}
                              </div>
                            </div>
                            <Badge variant="outline">{suivi.type}</Badge>
                          </div>
                          <div className="mt-2 p-2 bg-gray-50 rounded">
                            {suivi.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => handleAddSuivi(selectedDemande)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ajouter un suivi
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRespond(selectedDemande)}
              >
                <Send className="h-4 w-4 mr-2" />
                Répondre
              </Button>
              <Button onClick={() => setShowDetailModal(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Répondre */}
      <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Répondre à la demande #{selectedDemande?.id}</DialogTitle>
            <DialogDescription>
              Votre réponse sera envoyée au client et ajoutée aux suivis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Votre réponse *</label>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Tapez votre réponse ici..."
                rows={6}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponseModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendResponse} disabled={!responseMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Ajouter Suivi */}
      <Dialog open={showSuiviModal} onOpenChange={setShowSuiviModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un suivi</DialogTitle>
            <DialogDescription>
              Suivi pour la demande #{selectedDemande?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Type de suivi</label>
              <Select value={suiviType} onValueChange={setSuiviType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">Message</SelectItem>
                  <SelectItem value="rendez_vous">Rendez-vous</SelectItem>
                  <SelectItem value="devis">Devis</SelectItem>
                  <SelectItem value="facture">Facture</SelectItem>
                  <SelectItem value="appel">Appel téléphonique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                value={suiviMessage}
                onChange={(e) => setSuiviMessage(e.target.value)}
                placeholder="Décrivez l'avancement ou l'action réalisée..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuiviModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddSuiviSubmit} disabled={!suiviMessage.trim()}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Ajouter le suivi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Statistiques */}
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Statistiques détaillées</DialogTitle>
            <DialogDescription>
              Analyse de votre performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{statistiques.satisfaction}%</div>
                    <div className="text-sm text-gray-500">Taux de satisfaction</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{statistiques.tempsMoyenReponse}</div>
                    <div className="text-sm text-gray-500">Temps de réponse moyen</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(demandes.map(d => d.conseilType))).map((type) => {
                    const count = demandes.filter(d => d.conseilType === type).length;
                    const percentage = demandes.length > 0 ? (count / demandes.length * 100).toFixed(1) : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(type)}
                          <span className="text-sm">{type}</span>
                        </div>
                        <div className="text-sm">
                          {count} ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-2xl font-bold text-gray-900">{statistiques.demandeMois}</div>
                  <div className="text-sm text-gray-500">Demandes ce mois-ci</div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium" style={{ color: colors.success }}>
                      +{Math.round(statistiques.demandeMois / (statistiques.total / 12))}%
                    </span>
                    <span className="text-gray-500"> par rapport à la moyenne</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowStatsModal(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Disponibilité */}
      <Dialog open={showAvailabilityModal} onOpenChange={setShowAvailabilityModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour votre disponibilité</DialogTitle>
            <DialogDescription>
              Les clients verront votre statut de disponibilité
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={newAvailability === 'disponible' ? 'default' : 'outline'}
                onClick={() => setNewAvailability('disponible')}
                className={newAvailability === 'disponible' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Disponible
              </Button>
              <Button
                variant={newAvailability === 'limitee' ? 'default' : 'outline'}
                onClick={() => setNewAvailability('limitee')}
                className={newAvailability === 'limitee' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                <Clock className="h-4 w-4 mr-2" />
                Limité
              </Button>
              <Button
                variant={newAvailability === 'complet' ? 'default' : 'outline'}
                onClick={() => setNewAvailability('complet')}
                className={newAvailability === 'complet' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Complet
              </Button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                <div className="text-sm text-gray-600">
                  {newAvailability === 'disponible' && 'Les clients peuvent vous contacter directement'}
                  {newAvailability === 'limitee' && 'Votre disponibilité est limitée, les clients peuvent toujours vous contacter'}
                  {newAvailability === 'complet' && 'Vous ne recevrez plus de nouvelles demandes pour le moment'}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvailabilityModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateAvailability}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertDashboardPage;