import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, ChevronDown, ChevronUp, Eye,
  MessageSquare, CheckCircle, XCircle, Clock, User,
  Star, Mail, Phone, Building, Calendar, MapPin,
  Download, Send, Users, BarChart, RefreshCw,
  MoreVertical, Edit, Trash2, FileText, EyeOff,
  Shield, AlertCircle, UserCheck, UserPlus,
  MessageCircle, Plus, ChevronRight, FileIcon,
  CheckCircle2, XCircle as XCircleIcon, Loader2,
  AlertTriangle, Briefcase, Rocket, TrendingUp,
  Handshake, Target, Trophy, Award, Globe,
  GraduationCap, HeartHandshake, ShieldCheck,
  PieChart, Coins
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { conseilService } from "@/services/conseilService";
import { accompagnementService } from "@/services/accompagnementService";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  expert: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    avatar: string;
  } | null;
  user: any;
  suivis: Suivi[];
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
  expert: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    avatar: string;
  } | null;
  user: any;
  suivis: Suivi[];
}

interface Suivi {
  id: number;
  message: string;
  type: string;
  rendezVous: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
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

const UserConseilPage = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("conseil");
  
  // États pour les demandes de conseil
  const [demandesConseil, setDemandesConseil] = useState<DemandeConseil[]>([]);
  const [filteredDemandesConseil, setFilteredDemandesConseil] = useState<DemandeConseil[]>([]);
  
  // États pour les demandes d'accompagnement
  const [demandesAccompagnement, setDemandesAccompagnement] = useState<DemandeAccompagnement[]>([]);
  const [filteredDemandesAccompagnement, setFilteredDemandesAccompagnement] = useState<DemandeAccompagnement[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingAccompagnement, setLoadingAccompagnement] = useState(false);
  
  // États de chargement pour les boutons
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingAddSuivi, setLoadingAddSuivi] = useState(false);
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  
  const [stats, setStats] = useState({
    // Stats pour les conseils
    totalConseil: 0,
    en_attenteConseil: 0,
    en_coursConseil: 0,
    termineeConseil: 0,
    annuleeConseil: 0,
    
    // Stats pour les accompagnements
    totalAccompagnement: 0,
    en_attenteAccompagnement: 0,
    en_coursAccompagnement: 0,
    termineeAccompagnement: 0,
    annuleeAccompagnement: 0,
    
    // Compatibilité
    total: 0,
    en_attente: 0,
    en_cours: 0,
    terminee: 0,
    annulee: 0
  });

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [typeFilter, setTypeFilter] = useState("tous");

  // États pour les modals
  const [selectedDemande, setSelectedDemande] = useState<DemandeConseil | DemandeAccompagnement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuiviModal, setShowSuiviModal] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // États pour les formulaires
  const [suiviMessage, setSuiviMessage] = useState("");
  const [suiviType, setSuiviType] = useState("message");
  const [newMessage, setNewMessage] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // Charger les données
  useEffect(() => {
    loadDemandes();
  }, []);

  // Filtrer les demandes
  useEffect(() => {
    filterDemandes();
  }, [demandesConseil, demandesAccompagnement, searchTerm, statusFilter, typeFilter]);

  const loadDemandes = async () => {
    try {
      setLoading(true);
      
      // Charger les demandes de conseil
      const conseilResponse = await conseilService.getMesDemandes();
      
      // Charger les demandes d'accompagnement
      setLoadingAccompagnement(true);
      const accompagnementResponse = await accompagnementService.getMesDemandes();
      setLoadingAccompagnement(false);
      
      if (conseilResponse.success) {
        const conseilData = conseilResponse.data || [];
        // Filtrer pour n'avoir que les demandes de conseil (origine différente de page_accompagnement)
        const demandesConseilFiltered = conseilData.filter((demande: DemandeConseil) => 
          demande.origine !== "page_accompagnement"
        );
        
        const demandesConseilWithSafeSuivis = demandesConseilFiltered.map(demande => ({
          ...demande,
          suivis: (demande.suivis || []).map(suivi => ({
            ...suivi,
            user: suivi.user || { id: 'unknown', firstName: 'Utilisateur', lastName: '', email: '' }
          }))
        }));
        
        setDemandesConseil(demandesConseilWithSafeSuivis);
        setFilteredDemandesConseil(demandesConseilWithSafeSuivis);
      }
      
      if (accompagnementResponse.success) {
        const accompagnementData = accompagnementResponse.data || [];
        // Filtrer pour n'avoir que les demandes d'accompagnement (origine = page_accompagnement)
        const demandesAccompagnementFiltered = accompagnementData.filter((demande: DemandeAccompagnement) => 
          demande.origine === "page_accompagnement"
        );
        
        const demandesAccompagnementWithSafeSuivis = demandesAccompagnementFiltered.map(demande => ({
          ...demande,
          suivis: (demande.suivis || []).map(suivi => ({
            ...suivi,
            user: suivi.user || { id: 'unknown', firstName: 'Utilisateur', lastName: '', email: '' }
          }))
        }));
        
        setDemandesAccompagnement(demandesAccompagnementWithSafeSuivis);
        setFilteredDemandesAccompagnement(demandesAccompagnementWithSafeSuivis);
      }
      
      // Calculer les stats combinées
      const allDemandes = [
        ...(conseilResponse.success ? conseilResponse.data || [] : []),
        ...(accompagnementResponse.success ? accompagnementResponse.data || [] : [])
      ];
      
      calculateStats(allDemandes);
      
    } catch (error) {
      console.error("Erreur chargement demandes:", error);
      toast.error("Erreur lors du chargement de vos demandes");
      
      // Données de démonstration en cas d'erreur
      const demoDemandesConseil: DemandeConseil[] = [
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          service: { id: 1, libelle: "Consulting Stratégique" },
          metier: { id: 2, libelle: "Consultant" },
          expert: {
            id: "1",
            firstName: "Sophie",
            lastName: "Laurent",
            email: "sophie@expert.fr",
            phone: "+33 6 23 45 67 89",
            companyName: "Expert Consulting",
            avatar: ""
          },
          user: {
            id: "user1",
            firstName: "Jean",
            lastName: "Dupont"
          },
          suivis: [
            {
              id: 1,
              message: "Premier contact établi avec le client",
              type: "message",
              rendezVous: null,
              createdAt: new Date().toISOString(),
              user: { 
                id: "1",
                firstName: "Sophie", 
                lastName: "Laurent", 
                email: "sophie@expert.fr" 
              }
            }
          ]
        },
        {
          id: 2,
          conseilType: "Conseil en Stratégie",
          besoin: "Développement d'une nouvelle stratégie de marché",
          budget: "10k-15k",
          message: "Nous souhaitons développer notre présence sur le marché européen...",
          nom: "Marie Martin",
          email: "marie@entreprise.fr",
          telephone: "+33 6 98 76 54 32",
          entreprise: "MarketCorp",
          serviceId: 3,
          metierId: 1,
          expertId: null,
          statut: "en_attente",
          origine: "page_conseil",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          service: { id: 3, libelle: "Stratégie Marketing" },
          metier: { id: 1, libelle: "Stratège" },
          expert: null,
          user: {
            id: "user2",
            firstName: "Marie",
            lastName: "Martin"
          },
          suivis: []
        }
      ];
      
      const demoDemandesAccompagnement: DemandeAccompagnement[] = [
        {
          id: 1001,
          conseilType: "Accompagnement Création",
          besoin: "Création d'une startup dans le domaine de la tech",
          budget: "1 500€ - 3 000€",
          message: "Je souhaite créer ma startup dans le domaine de la tech...",
          nom: "Jean Dupont",
          email: "jean@entreprise.fr",
          telephone: "+33 6 12 34 56 78",
          entreprise: "FutureTech Startup",
          expertId: "3",
          statut: "en_cours",
          origine: "page_accompagnement",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expert: {
            id: "3",
            firstName: "Thomas",
            lastName: "Petit",
            email: "thomas@expert.fr",
            phone: "+33 6 34 56 78 90",
            companyName: "Accompagnement Pro",
            avatar: ""
          },
          user: {
            id: "user1",
            firstName: "Jean",
            lastName: "Dupont"
          },
          suivis: [
            {
              id: 1,
              message: "Première séance de diagnostic réalisée",
              type: "message",
              rendezVous: null,
              createdAt: new Date().toISOString(),
              user: { 
                id: "3",
                firstName: "Thomas", 
                lastName: "Petit", 
                email: "thomas@expert.fr" 
              }
            }
          ]
        }
      ];
      
      setDemandesConseil(demoDemandesConseil);
      setFilteredDemandesConseil(demoDemandesConseil);
      setDemandesAccompagnement(demoDemandesAccompagnement);
      setFilteredDemandesAccompagnement(demoDemandesAccompagnement);
      
      // Calculer les stats pour les données de démo
      calculateStats([...demoDemandesConseil, ...demoDemandesAccompagnement]);
      
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoadingRefresh(true);
      await loadDemandes();
    } finally {
      setLoadingRefresh(false);
    }
  };

  const calculateStats = (demandesData: any[]) => {
    try {
      setLoadingStats(true);
      
      // Séparer les demandes par origine
      const demandesConseil = demandesData.filter(d => d.origine !== "page_accompagnement");
      const demandesAccompagnement = demandesData.filter(d => d.origine === "page_accompagnement");
      
      const newStats = {
        // Stats conseil
        totalConseil: demandesConseil.length,
        en_attenteConseil: demandesConseil.filter(d => d.statut === "en_attente").length,
        en_coursConseil: demandesConseil.filter(d => d.statut === "en_cours").length,
        termineeConseil: demandesConseil.filter(d => d.statut === "terminee").length,
        annuleeConseil: demandesConseil.filter(d => d.statut === "annulee").length,
        
        // Stats accompagnement
        totalAccompagnement: demandesAccompagnement.length,
        en_attenteAccompagnement: demandesAccompagnement.filter(d => d.statut === "en_attente").length,
        en_coursAccompagnement: demandesAccompagnement.filter(d => d.statut === "en_cours").length,
        termineeAccompagnement: demandesAccompagnement.filter(d => d.statut === "terminee").length,
        annuleeAccompagnement: demandesAccompagnement.filter(d => d.statut === "annulee").length,
        
        // Stats globales (compatibilité)
        total: demandesData.length,
        en_attente: demandesData.filter(d => d.statut === "en_attente").length,
        en_cours: demandesData.filter(d => d.statut === "en_cours").length,
        terminee: demandesData.filter(d => d.statut === "terminee").length,
        annulee: demandesData.filter(d => d.statut === "annulee").length
      };
      
      setStats(newStats);
    } catch (error) {
      console.error("Erreur calcul stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const filterDemandes = () => {
    // Filtrer les demandes de conseil
    let filteredConseil = [...demandesConseil];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredConseil = filteredConseil.filter(d =>
        d.conseilType.toLowerCase().includes(term) ||
        (d.expert?.firstName?.toLowerCase() || "").includes(term) ||
        (d.expert?.lastName?.toLowerCase() || "").includes(term) ||
        d.besoin.toLowerCase().includes(term) ||
        d.statut.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== "tous") {
      filteredConseil = filteredConseil.filter(d => d.statut === statusFilter);
    }
    
    if (typeFilter !== "tous") {
      filteredConseil = filteredConseil.filter(d => d.conseilType === typeFilter);
    }
    
    setFilteredDemandesConseil(filteredConseil);
    
    // Filtrer les demandes d'accompagnement
    let filteredAccompagnement = [...demandesAccompagnement];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredAccompagnement = filteredAccompagnement.filter(d =>
        d.conseilType.toLowerCase().includes(term) ||
        (d.expert?.firstName?.toLowerCase() || "").includes(term) ||
        (d.expert?.lastName?.toLowerCase() || "").includes(term) ||
        d.besoin.toLowerCase().includes(term) ||
        d.statut.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== "tous") {
      filteredAccompagnement = filteredAccompagnement.filter(d => d.statut === statusFilter);
    }
    
    if (typeFilter !== "tous") {
      filteredAccompagnement = filteredAccompagnement.filter(d => d.conseilType === typeFilter);
    }
    
    setFilteredDemandesAccompagnement(filteredAccompagnement);
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return (
          <Badge variant="outline" className="bg-[#FFF8E1] text-[#000000] border-[#D3D3D3]">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case "en_cours":
        return (
          <Badge variant="outline" className="bg-[#E8F5E9] text-[#000000] border-[#D3D3D3]">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            En cours
          </Badge>
        );
      case "terminee":
        return (
          <Badge variant="outline" className="bg-[#E8F5E9] text-[#000000] border-[#D3D3D3]">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Terminée
          </Badge>
        );
      case "annulee":
        return (
          <Badge variant="outline" className="bg-[#FFEBEE] text-[#000000] border-[#D3D3D3]">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Annulée
          </Badge>
        );
      default:
        return <Badge variant="outline" className="border-[#D3D3D3] text-[#000000]">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Clock className="h-4 w-4 text-[#8B4513]" />;
      case "en_cours":
        return <Loader2 className="h-4 w-4 text-[#6B8E23] animate-spin" />;
      case "terminee":
        return <CheckCircle2 className="h-4 w-4 text-[#556B2F]" />;
      case "annulee":
        return <XCircleIcon className="h-4 w-4 text-[#D32F2F]" />;
      default:
        return null;
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

  const handleViewDetails = (demande: DemandeConseil | DemandeAccompagnement) => {
    setSelectedDemande(demande);
    setShowDetailModal(true);
  };

  const handleAddSuivi = (demande: DemandeConseil | DemandeAccompagnement) => {
    setSelectedDemande(demande);
    setSuiviMessage("");
    setSuiviType("note");
    setShowSuiviModal(true);
  };

  const handleNewMessage = (demande: DemandeConseil | DemandeAccompagnement) => {
    setSelectedDemande(demande);
    setNewMessage("");
    setShowNewMessageModal(true);
  };

  const handleUpdateStatus = async (demandeId: number, newStatut: string, reason?: string) => {
    try {
      setLoadingUpdateStatus(true);
      
      // Utiliser le bon service selon l'origine
      let response;
      const demande = [...demandesConseil, ...demandesAccompagnement].find(d => d.id === demandeId);
      
      if (demande?.origine === "page_accompagnement") {
        response = await accompagnementService.updateStatut(demandeId, newStatut);
      } else {
        response = await conseilService.updateStatut(demandeId, newStatut);
      }
      
      if (response.success) {
        toast.success(`Statut mis à jour: ${getStatusLabel(newStatut)}`);
        // Recharger les demandes pour mettre à jour les stats
        await loadDemandes();
        setShowCancelModal(false);
        setShowStatusModal(false);
        setCancelReason("");
        setNewStatus("");
      } else {
        toast.error(response.error || "Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setLoadingUpdateStatus(false);
    }
  };

  const handleAddSuiviSubmit = async () => {
    if (!selectedDemande || !suiviMessage.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }

    try {
      setLoadingAddSuivi(true);
      
      // Utiliser le bon service selon l'origine
      let response;
      if (selectedDemande.origine === "page_accompagnement") {
        response = await accompagnementService.addSuivi(selectedDemande.id, {
          message: suiviMessage,
          type: suiviType
        });
      } else {
        response = await conseilService.addSuivi(selectedDemande.id, {
          message: suiviMessage,
          type: suiviType
        });
      }

      if (response.success) {
        toast.success("Note ajoutée avec succès");
        setShowSuiviModal(false);
        setSuiviMessage("");
        setSuiviType("note");
        // Recharger les demandes
        await loadDemandes();
      } else {
        toast.error(response.error || "Erreur lors de l'ajout de la note");
      }
    } catch (error) {
      console.error("Erreur ajout suivi:", error);
      toast.error("Erreur lors de l'ajout de la note");
    } finally {
      setLoadingAddSuivi(false);
    }
  };

  const handleSendNewMessage = async () => {
    if (!selectedDemande || !newMessage.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }

    try {
      setLoadingSendMessage(true);
      
      // Utiliser le bon service selon l'origine
      let response;
      if (selectedDemande.origine === "page_accompagnement") {
        response = await accompagnementService.addSuivi(selectedDemande.id, {
          message: newMessage,
          type: "message"
        });
      } else {
        response = await conseilService.addSuivi(selectedDemande.id, {
          message: newMessage,
          type: "message"
        });
      }

      if (response.success) {
        toast.success("Message envoyé avec succès");
        setShowNewMessageModal(false);
        setNewMessage("");
        // Recharger les demandes
        await loadDemandes();
      } else {
        toast.error(response.error || "Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setLoadingSendMessage(false);
    }
  };

  const handleCancelDemande = async () => {
    if (!selectedDemande) return;

    try {
      setLoadingCancel(true);
      await handleUpdateStatus(selectedDemande.id, "annulee", cancelReason);
    } catch (error) {
      console.error("Erreur annulation demande:", error);
    } finally {
      setLoadingCancel(false);
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "en_attente": return "En attente";
      case "en_cours": return "En cours";
      case "terminee": return "Terminée";
      case "annulee": return "Annulée";
      default: return statut;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      return format(date, "dd MMM yyyy 'à' HH:mm", { locale: fr });
    } catch (error) {
      return "Date invalide";
    }
  };

  const getTypeOptions = () => {
    // Combiner les types de conseil et d'accompagnement
    const conseilTypes = Array.from(new Set(demandesConseil.map(d => d.conseilType)));
    const accompagnementTypes = Array.from(new Set(demandesAccompagnement.map(d => d.conseilType)));
    const allTypes = [...conseilTypes, ...accompagnementTypes];
    
    return allTypes.map(type => (
      <SelectItem key={type} value={type}>
        {type}
      </SelectItem>
    ));
  };

  const exportToPDF = (demande: DemandeConseil | DemandeAccompagnement) => {
    toast.info("Export PDF en développement...");
    // Implémentation future de l'export PDF
  };

  // Fonction pour obtenir le nom d'utilisateur en toute sécurité
  const getSafeUserName = (user: any) => {
    if (!user) return "Utilisateur";
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Utilisateur";
  };

  // Fonction pour obtenir les initiales en toute sécurité
  const getSafeUserInitials = (user: any) => {
    if (!user) return "U";
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return `${first}${last}` || "U";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FFFFFF]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#556B2F]" />
          <p className="text-lg text-[#000000]">Chargement de vos demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-4 md:p-6 bg-[#FFFFFF]">
      {/* En-tête avec onglets */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#8B4513]">Mes Demandes</h1>
            <p className="text-[#000000] mt-2 opacity-80">
              Suivez l'avancement de vos demandes et échangez avec les experts
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loadingRefresh}
              className="flex items-center gap-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-[#F5F5F5] border border-[#D3D3D3]">
            <TabsTrigger 
              value="conseil" 
              className="data-[state=active]:bg-[#6B8E23] data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Conseils ({demandesConseil.length})
            </TabsTrigger>
            <TabsTrigger 
              value="accompagnement" 
              className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Accompagnements ({demandesAccompagnement.length})
              {loadingAccompagnement && (
                <Loader2 className="h-3 w-3 ml-2 animate-spin" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="tous" 
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Toutes ({demandesConseil.length + demandesAccompagnement.length})
            </TabsTrigger>
          </TabsList>

          {/* Boutons de création */}
          <div className="mt-4 flex gap-4">
            <Button 
              size="sm" 
              className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#556B2F] text-white"
            >
              <a href="/conseil" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouveau conseil
              </a>
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-2 bg-[#27AE60] hover:bg-[#219653] text-white"
            >
              <a href="/accompagnement" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvel accompagnement
              </a>
            </Button>
          </div>
        </Tabs>
      </div>

      {/* Cartes de statistiques - Afficher selon l'onglet actif */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {activeTab === "conseil" || activeTab === "tous" ? (
          <>
            <Card className="p-4 bg-gradient-to-br from-[#FFFFFF] to-[#F5F5F5] border-[#D3D3D3]">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#556B2F]">{stats.totalConseil}</div>
                <div className="text-sm text-[#000000]">Total Conseil</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-[#FFF8E1] to-[#FFF3E0] border-[#D3D3D3]">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#8B4513]">{stats.en_attenteConseil}</div>
                <div className="text-sm text-[#000000]">En Attente</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-[#D3D3D3]">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#556B2F]">{stats.en_coursConseil}</div>
                <div className="text-sm text-[#000000]">En Cours</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-[#D3D3D3]">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#556B2F]">{stats.termineeConseil}</div>
                <div className="text-sm text-[#000000]">Terminées</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-[#FFEBEE] to-[#FFEBEE] border-[#D3D3D3]">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#D32F2F]">{stats.annuleeConseil}</div>
                <div className="text-sm text-[#000000]">Annulées</div>
              </div>
            </Card>
          </>
        ) : null}
        
        {activeTab === "accompagnement" || activeTab === "tous" ? (
          activeTab === "accompagnement" ? (
            <>
              <Card className="p-4 bg-gradient-to-br from-[#FFFFFF] to-[#F5F5F5] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#27AE60]">{stats.totalAccompagnement}</div>
                  <div className="text-sm text-[#000000]">Total Accomp.</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#D4AF37]">{stats.en_attenteAccompagnement}</div>
                  <div className="text-sm text-[#000000]">En Attente</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#8FBC8F]">{stats.en_coursAccompagnement}</div>
                  <div className="text-sm text-[#000000]">En Cours</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#2E8B57]">{stats.termineeAccompagnement}</div>
                  <div className="text-sm text-[#000000]">Terminées</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#FFEBEE] to-[#FFEBEE] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#DC143C]">{stats.annuleeAccompagnement}</div>
                  <div className="text-sm text-[#000000]">Annulées</div>
                </div>
              </Card>
            </>
          ) : (
            // Afficher uniquement le total pour l'onglet "tous"
            <>
              <Card className="p-4 bg-gradient-to-br from-[#FFFFFF] to-[#F5F5F5] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#556B2F]">{stats.totalConseil}</div>
                  <div className="text-sm text-[#000000]">Conseils</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#FFFFFF] to-[#F5F5F5] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#27AE60]">{stats.totalAccompagnement}</div>
                  <div className="text-sm text-[#000000]">Accomp.</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#8B4513]">{stats.en_attente}</div>
                  <div className="text-sm text-[#000000]">En Attente</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#556B2F]">{stats.en_cours}</div>
                  <div className="text-sm text-[#000000]">En Cours</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-[#D3D3D3]">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#556B2F]">{stats.terminee}</div>
                  <div className="text-sm text-[#000000]">Terminées</div>
                </div>
              </Card>
            </>
          )
        ) : null}
      </div>

      {/* Filtres */}
      <Card className="p-4 mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-[#000000]">Recherche</label>
            <div className="relative">
              <Input
                placeholder="Type, expert, besoin, statut..."
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
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="terminee">Terminée</SelectItem>
                <SelectItem value="annulee">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#000000]">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                {getTypeOptions()}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Contenu avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Onglet Conseil */}
        <TabsContent value="conseil" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des demandes de conseil */}
            <div className="lg:col-span-2">
              <Card className="mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#8B4513]">
                      Mes Conseils ({filteredDemandesConseil.length})
                    </h2>
                    {loadingStats && (
                      <Badge variant="outline" className="text-xs border-[#D3D3D3] text-[#000000]">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Mise à jour...
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  {filteredDemandesConseil.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-[#D3D3D3]" />
                      <h3 className="text-lg font-medium text-[#8B4513] mb-2">
                        Aucun conseil trouvé
                      </h3>
                      <p className="text-[#000000] mb-6 opacity-80">
                        {searchTerm || statusFilter !== "tous" || typeFilter !== "tous"
                          ? "Aucun conseil ne correspond à vos critères de recherche."
                          : "Vous n'avez pas encore de demande de conseil."}
                      </p>
                      {!searchTerm && statusFilter === "tous" && typeFilter === "tous" && (
                        <Button 
                          className="bg-[#6B8E23] hover:bg-[#556B2F] text-white"
                        >
                          <a href="/conseil" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Demander un conseil
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-[#D3D3D3]">
                      {filteredDemandesConseil.map((demande) => (
                        <motion.div
                          key={demande.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 hover:bg-[#F5F5F5] cursor-pointer transition-colors border-b border-[#D3D3D3] last:border-0"
                          onClick={() => handleViewDetails(demande)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(demande.statut)}
                                <span className="font-semibold text-[#8B4513]">
                                  {demande.conseilType}
                                </span>
                                <Badge variant="outline" className="text-xs border-[#6B8E23] text-[#6B8E23]">
                                  Conseil
                                </Badge>
                                <span className="text-sm text-[#000000] opacity-70">
                                  #{demande.id}
                                </span>
                              </div>
                              
                              <p className="text-sm text-[#000000] mb-3 line-clamp-2 opacity-90">
                                {demande.besoin}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-[#000000] opacity-80">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(demande.createdAt)}</span>
                                </div>
                                
                                {demande.expert && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>
                                      {demande.expert.firstName} {demande.expert.lastName}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="ml-auto">
                                  {getStatusBadge(demande.statut)}
                                </div>
                              </div>
                            </div>
                            
                            <ChevronRight className="h-5 w-5 text-[#000000] ml-2" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Dernières activités pour conseils */}
            <div>
              <Card className="border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <h3 className="font-semibold flex items-center gap-2 text-[#8B4513]">
                    <MessageSquare className="h-4 w-4 text-[#556B2F]" />
                    Activités Récentes
                  </h3>
                </div>
                
                <div className="p-4">
                  {demandesConseil.length === 0 ? (
                    <div className="text-center py-4 text-[#000000] opacity-80">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 text-[#D3D3D3]" />
                      Aucune activité récente
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {demandesConseil
                        .flatMap(d => 
                          (d.suivis || []).map(s => ({
                            ...s,
                            demandeId: d.id,
                            demandeType: d.conseilType,
                            demandeStatus: d.statut,
                            user: s.user || { id: 'unknown', firstName: 'Utilisateur', lastName: '', email: '' }
                          })) || []
                        )
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5)
                        .map((suivi, index) => (
                          <div key={index} className="pb-4 border-b border-[#D3D3D3] last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8 border border-[#D3D3D3]">
                                <AvatarFallback className="bg-[#F5F5F5] text-[#000000]">
                                  {getSafeUserInitials(suivi.user)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="font-medium text-sm text-[#000000]">
                                    {getSafeUserName(suivi.user)}
                                  </span>
                                  <span className="text-xs text-[#000000] opacity-70">
                                    {formatDate(suivi.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-[#000000] mt-1 line-clamp-2 opacity-90">
                                  {suivi.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs border-[#D3D3D3] text-[#000000]">
                                    #{suivi.demandeId}
                                  </Badge>
                                  <span className="text-xs text-[#000000] opacity-70">
                                    {suivi.demandeType}
                                  </span>
                                  {suivi.type === "rendez_vous" && (
                                    <Badge variant="secondary" className="text-xs bg-[#F5F5F5] text-[#000000]">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      RDV
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </Card>

              {/* Conseils rapides */}
              <Card className="mt-6 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <h3 className="font-semibold flex items-center gap-2 text-[#8B4513]">
                    <Star className="h-4 w-4 text-[#8B4513]" />
                    Conseils rapides
                  </h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2 text-[#000000]">
                      <CheckCircle className="h-4 w-4 text-[#556B2F] mt-0.5" />
                      <span>Répondez rapidement aux messages des experts</span>
                    </li>
                    <li className="flex items-start gap-2 text-[#000000]">
                      <AlertTriangle className="h-4 w-4 text-[#8B4513] mt-0.5" />
                      <span>Vérifiez régulièrement l'avancement de vos demandes</span>
                    </li>
                    <li className="flex items-start gap-2 text-[#000000]">
                      <MessageSquare className="h-4 w-4 text-[#6B8E23] mt-0.5" />
                      <span>N'hésitez pas à poser des questions complémentaires</span>
                    </li>
                    <li className="flex items-start gap-2 text-[#000000]">
                      <Clock className="h-4 w-4 text-[#8B4513] mt-0.5" />
                      <span>Les demandes urgentes sont traitées en priorité</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Accompagnement */}
        <TabsContent value="accompagnement" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des demandes d'accompagnement */}
            <div className="lg:col-span-2">
              <Card className="mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#27AE60]">
                      Mes Accompagnements ({filteredDemandesAccompagnement.length})
                    </h2>
                    {loadingStats && (
                      <Badge variant="outline" className="text-xs border-[#D3D3D3] text-[#000000]">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Mise à jour...
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  {filteredDemandesAccompagnement.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-[#D3D3D3]" />
                      <h3 className="text-lg font-medium text-[#27AE60] mb-2">
                        Aucun accompagnement trouvé
                      </h3>
                      <p className="text-[#000000] mb-6 opacity-80">
                        {searchTerm || statusFilter !== "tous" || typeFilter !== "tous"
                          ? "Aucun accompagnement ne correspond à vos critères de recherche."
                          : "Vous n'avez pas encore de demande d'accompagnement."}
                      </p>
                      {!searchTerm && statusFilter === "tous" && typeFilter === "tous" && (
                        <Button 
                          className="bg-[#27AE60] hover:bg-[#219653] text-white"
                        >
                          <a href="/accompagnement" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Demander un accompagnement
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-[#D3D3D3]">
                      {filteredDemandesAccompagnement.map((demande) => (
                        <motion.div
                          key={demande.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 hover:bg-[#F5F5F5] cursor-pointer transition-colors border-b border-[#D3D3D3] last:border-0"
                          onClick={() => handleViewDetails(demande)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(demande.statut)}
                                {getTypeIcon(demande.conseilType)}
                                <span className="font-semibold text-[#27AE60]">
                                  {demande.conseilType}
                                </span>
                                <Badge className="bg-[#27AE60] text-white text-xs">
                                  Accompagnement
                                </Badge>
                                <span className="text-sm text-[#000000] opacity-70">
                                  #{demande.id}
                                </span>
                              </div>
                              
                              <p className="text-sm text-[#000000] mb-3 line-clamp-2 opacity-90">
                                {demande.besoin}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-[#000000] opacity-80">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(demande.createdAt)}</span>
                                </div>
                                
                                {demande.expert && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>
                                      {demande.expert.firstName} {demande.expert.lastName}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="ml-auto">
                                  {getStatusBadge(demande.statut)}
                                </div>
                              </div>
                            </div>
                            
                            <ChevronRight className="h-5 w-5 text-[#000000] ml-2" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Dernières activités pour accompagnements */}
            <div>
              <Card className="sticky top-6 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <h3 className="font-semibold flex items-center gap-2 text-[#27AE60]">
                    <Briefcase className="h-4 w-4 text-[#27AE60]" />
                    Activités Accompagnement
                  </h3>
                </div>
                
                <div className="p-4">
                  {demandesAccompagnement.length === 0 ? (
                    <div className="text-center py-4 text-[#000000] opacity-80">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 text-[#D3D3D3]" />
                      Aucune activité récente
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {demandesAccompagnement
                        .flatMap(d => 
                          (d.suivis || []).map(s => ({
                            ...s,
                            demandeId: d.id,
                            demandeType: d.conseilType,
                            demandeStatus: d.statut,
                            user: s.user || { id: 'unknown', firstName: 'Utilisateur', lastName: '', email: '' }
                          })) || []
                        )
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5)
                        .map((suivi, index) => (
                          <div key={index} className="pb-4 border-b border-[#D3D3D3] last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8 border border-[#D3D3D3]">
                                <AvatarFallback className="bg-[#E8F5E9] text-[#27AE60]">
                                  {getSafeUserInitials(suivi.user)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="font-medium text-sm text-[#000000]">
                                    {getSafeUserName(suivi.user)}
                                  </span>
                                  <span className="text-xs text-[#000000] opacity-70">
                                    {formatDate(suivi.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-[#000000] mt-1 line-clamp-2 opacity-90">
                                  {suivi.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs border-[#27AE60] text-[#27AE60]">
                                    #{suivi.demandeId}
                                  </Badge>
                                  <Badge className="text-xs bg-[#27AE60] text-white">
                                    Accomp.
                                  </Badge>
                                  {suivi.type === "rendez_vous" && (
                                    <Badge variant="secondary" className="text-xs bg-[#F5F5F5] text-[#000000]">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      RDV
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </Card>

              {/* Conseils spécifiques aux accompagnements */}
              <Card className="mt-6 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <h3 className="font-semibold flex items-center gap-2 text-[#27AE60]">
                    <Star className="h-4 w-4 text-[#27AE60]" />
                    Conseils Accompagnement
                  </h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2 text-[#000000]">
                      <CheckCircle className="h-4 w-4 text-[#27AE60] mt-0.5" />
                      <span>Préparez vos documents avant chaque session</span>
                    </li>
                    <li className="flex items-start gap-2 text-[#000000]">
                      <AlertTriangle className="h-4 w-4 text-[#D4AF37] mt-0.5" />
                      <span>Respectez les délais des livrables</span>
                    </li>
                    <li className="flex items-start gap-2 text-[#000000]">
                      <Clock className="h-4 w-4 text-[#27AE60] mt-0.5" />
                      <span>Les accompagnements sont planifiés sur plusieurs mois</span>
                    </li>
                    <li className="flex items-start gap-2 text-[#000000]">
                      <MessageSquare className="h-4 w-4 text-[#27AE60] mt-0.5" />
                      <span>Communiquez régulièrement avec votre expert</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Toutes les demandes */}
        <TabsContent value="tous" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste combinée */}
            <div className="lg:col-span-2">
              <Card className="mb-6 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#8B4513]">
                      Toutes mes demandes ({filteredDemandesConseil.length + filteredDemandesAccompagnement.length})
                    </h2>
                    {loadingStats && (
                      <Badge variant="outline" className="text-xs border-[#D3D3D3] text-[#000000]">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Mise à jour...
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  {filteredDemandesConseil.length === 0 && filteredDemandesAccompagnement.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-[#D3D3D3]" />
                      <h3 className="text-lg font-medium text-[#8B4513] mb-2">
                        Aucune demande trouvée
                      </h3>
                      <p className="text-[#000000] mb-6 opacity-80">
                        {searchTerm || statusFilter !== "tous" || typeFilter !== "tous"
                          ? "Aucune demande ne correspond à vos critères de recherche."
                          : "Vous n'avez pas encore de demande."}
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button 
                          className="bg-[#6B8E23] hover:bg-[#556B2F] text-white"
                        >
                          <a href="/conseil" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nouveau conseil
                          </a>
                        </Button>
                        <Button 
                          className="bg-[#27AE60] hover:bg-[#219653] text-white"
                        >
                          <a href="/accompagnement" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nouvel accompagnement
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#D3D3D3]">
                      {/* Afficher d'abord les demandes de conseil */}
                      {filteredDemandesConseil.map((demande) => (
                        <motion.div
                          key={`conseil-${demande.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 hover:bg-[#F5F5F5] cursor-pointer transition-colors border-b border-[#D3D3D3]"
                          onClick={() => handleViewDetails(demande)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(demande.statut)}
                                <span className="font-semibold text-[#8B4513]">
                                  {demande.conseilType}
                                </span>
                                <Badge variant="outline" className="text-xs border-[#6B8E23] text-[#6B8E23]">
                                  Conseil
                                </Badge>
                                <span className="text-sm text-[#000000] opacity-70">
                                  #{demande.id}
                                </span>
                              </div>
                              
                              <p className="text-sm text-[#000000] mb-3 line-clamp-2 opacity-90">
                                {demande.besoin}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-[#000000] opacity-80">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(demande.createdAt)}</span>
                                </div>
                                
                                {demande.expert && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>
                                      {demande.expert.firstName} {demande.expert.lastName}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="ml-auto">
                                  {getStatusBadge(demande.statut)}
                                </div>
                              </div>
                            </div>
                            
                            <ChevronRight className="h-5 w-5 text-[#000000] ml-2" />
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Afficher ensuite les demandes d'accompagnement */}
                      {filteredDemandesAccompagnement.map((demande) => (
                        <motion.div
                          key={`accompagnement-${demande.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 hover:bg-[#F5F5F5] cursor-pointer transition-colors border-b border-[#D3D3D3] last:border-0"
                          onClick={() => handleViewDetails(demande)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(demande.statut)}
                                {getTypeIcon(demande.conseilType)}
                                <span className="font-semibold text-[#27AE60]">
                                  {demande.conseilType}
                                </span>
                                <Badge className="text-xs bg-[#27AE60] text-white">
                                  Accompagnement
                                </Badge>
                                <span className="text-sm text-[#000000] opacity-70">
                                  #{demande.id}
                                </span>
                              </div>
                              
                              <p className="text-sm text-[#000000] mb-3 line-clamp-2 opacity-90">
                                {demande.besoin}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-[#000000] opacity-80">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(demande.createdAt)}</span>
                                </div>
                                
                                {demande.expert && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>
                                      {demande.expert.firstName} {demande.expert.lastName}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="ml-auto">
                                  {getStatusBadge(demande.statut)}
                                </div>
                              </div>
                            </div>
                            
                            <ChevronRight className="h-5 w-5 text-[#000000] ml-2" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Statistiques globales */}
            <div>
              <Card className="sticky top-6 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <h3 className="font-semibold flex items-center gap-2 text-[#8B4513]">
                    <BarChart className="h-4 w-4 text-[#556B2F]" />
                    Statistiques Globales
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#000000]">Conseils</span>
                      <div className="text-right">
                        <div className="font-medium text-[#556B2F]">{stats.totalConseil}</div>
                        <div className="text-xs text-[#000000] opacity-70">
                          {stats.termineeConseil} terminés
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#000000]">Accompagnements</span>
                      <div className="text-right">
                        <div className="font-medium text-[#27AE60]">{stats.totalAccompagnement}</div>
                        <div className="text-xs text-[#000000] opacity-70">
                          {stats.termineeAccompagnement} terminés
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#D3D3D3]">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[#000000]">Total</span>
                        <div className="text-right">
                          <div className="font-bold text-lg text-[#8B4513]">{stats.total}</div>
                          <div className="text-xs text-[#000000] opacity-70">
                            {stats.terminee} demandes terminées
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="text-xs text-[#000000] opacity-70">
                        Taux de complétion:{" "}
                        <span className="font-medium text-[#556B2F]">
                          {stats.total > 0 ? Math.round((stats.terminee / stats.total) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions rapides */}
              <Card className="mt-6 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="p-4 border-b border-[#D3D3D3]">
                  <h3 className="font-semibold flex items-center gap-2 text-[#8B4513]">
                    <Rocket className="h-4 w-4 text-[#8B4513]" />
                    Actions rapides
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
                    >
                      <a href="/conseil" className="flex items-center gap-2 w-full">
                        <MessageSquare className="h-4 w-4" />
                        Nouveau conseil
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-[#D3D3D3] text-[#000000] hover:bg-[#27AE60] hover:text-white"
                    >
                      <a href="/accompagnement" className="flex items-center gap-2 w-full">
                        <Briefcase className="h-4 w-4" />
                        Nouvel accompagnement
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-[#D3D3D3] text-[#000000] hover:bg-[#8B4513] hover:text-white"
                      onClick={handleRefresh}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Actualiser la liste
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Détails de la demande */}
      {selectedDemande && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#D3D3D3] bg-[#FFFFFF]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#8B4513]">
                <FileText className="h-5 w-5 text-[#556B2F]" />
                {selectedDemande?.origine === "page_accompagnement" ? "Accompagnement" : "Conseil"} #{selectedDemande?.id}
                <Badge 
                  variant="outline" 
                  className={`ml-2 border-[#D3D3D3] text-[#000000] ${
                    selectedDemande?.origine === "page_accompagnement" 
                      ? 'bg-[#E8F5E9] text-[#27AE60]' 
                      : 'bg-[#FFF8E1] text-[#8B4513]'
                  }`}
                >
                  {selectedDemande?.origine === "page_accompagnement" ? "Accompagnement" : "Conseil"}
                </Badge>
                <Badge variant="outline" className="border-[#D3D3D3] text-[#000000]">
                  {getStatusLabel(selectedDemande?.statut || "")}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Informations de base */}
              <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedDemande.statut)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Date de création</label>
                    <div className="font-medium text-[#000000]">{formatDate(selectedDemande.createdAt)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Dernière mise à jour</label>
                    <div className="font-medium text-[#000000]">{formatDate(selectedDemande.updatedAt)}</div>
                  </div>
                </div>
              </Card>

              {/* Détails de la demande */}
              <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                <h3 className="text-lg font-semibold mb-4 text-[#8B4513]">Détails de la demande</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {selectedDemande.origine === "page_accompagnement" && getTypeIcon(selectedDemande.conseilType)}
                    <div>
                      <label className="text-sm font-medium text-[#000000] opacity-80">Type de {selectedDemande.origine === "page_accompagnement" ? "d'accompagnement" : "conseil"}</label>
                      <div className="font-medium text-[#000000]">{selectedDemande.conseilType}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Budget estimé</label>
                    <div className="font-medium text-[#000000]">{selectedDemande.budget}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#000000] opacity-80">Description du besoin</label>
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
                  <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-[#8B4513]">
                    <span>Expert assigné</span>
                    <Badge variant="secondary" className="bg-[#F5F5F5] text-[#000000]">
                      <Star className="h-3 w-3 mr-1 text-[#000000]" />
                      Expert vérifié
                    </Badge>
                  </h3>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border border-[#D3D3D3]">
                      <AvatarFallback className="bg-[#F5F5F5] text-[#000000]">
                        {selectedDemande.expert.firstName?.charAt(0)}
                        {selectedDemande.expert.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-[#000000]">
                        {selectedDemande.expert.firstName} {selectedDemande.expert.lastName}
                      </div>
                      <div className="text-sm text-[#000000] opacity-80">{selectedDemande.expert.email}</div>
                      {selectedDemande.expert.companyName && (
                        <div className="text-sm text-[#000000] opacity-80 mt-1">
                          <Building className="h-3 w-3 inline mr-1" />
                          {selectedDemande.expert.companyName}
                        </div>
                      )}
                      {selectedDemande.expert.phone && (
                        <div className="text-sm text-[#000000] opacity-80 mt-1">
                          <Phone className="h-3 w-3 inline mr-1" />
                          {selectedDemande.expert.phone}
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
                      onClick={() => handleNewMessage(selectedDemande)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                  </div>
                </Card>
              )}

              {/* Suivis et discussion */}
              <Card className="p-4 border-[#D3D3D3] bg-[#FFFFFF]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#8B4513]">Discussion</h3>
                  <div className="flex gap-2">
                    {selectedDemande.statut === "en_attente" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={loadingCancel}
                        className="bg-[#FFEBEE] text-[#000000] border-[#D3D3D3] hover:bg-[#D32F2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setShowCancelModal(true)}
                      >
                        {loadingCancel ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Annulation...
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            Annuler
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleNewMessage(selectedDemande)}
                      className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#556B2F] text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Nouveau message
                    </Button>
                  </div>
                </div>
                
                {selectedDemande.suivis && selectedDemande.suivis.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDemande.suivis
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((suivi) => {
                        const isCurrentUser = suivi.user?.id === currentUser?.id;
                        return (
                          <div
                            key={suivi.id}
                            className={`p-3 rounded-lg border ${
                              isCurrentUser
                                ? 'bg-[#E8F5E9] border-[#D3D3D3] ml-8'
                                : 'bg-[#F5F5F5] border-[#D3D3D3] mr-8'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 border border-[#D3D3D3]">
                                  <AvatarFallback className="bg-[#FFFFFF] text-[#000000]">
                                    {getSafeUserInitials(suivi.user)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm text-[#000000]">
                                    {getSafeUserName(suivi.user)}
                                  </div>
                                  <Badge variant="outline" className="text-xs capitalize border-[#D3D3D3] text-[#000000]">
                                    {suivi.type.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-xs text-[#000000] opacity-70">
                                {formatDate(suivi.createdAt)}
                              </div>
                            </div>
                            <div className="text-sm text-[#000000]">{suivi.message}</div>
                            
                            {suivi.rendezVous && (
                              <div className="mt-2 p-2 bg-white rounded border border-[#D3D3D3]">
                                <div className="flex items-center gap-2 text-sm text-[#000000]">
                                  <Calendar className="h-3 w-3" />
                                  <span>Rendez-vous prévu le {formatDate(suivi.rendezVous)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#000000] opacity-80">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-[#D3D3D3]" />
                    <p>Aucun message pour le moment</p>
                    <p className="text-sm mt-2">Soyez le premier à lancer la discussion</p>
                    <Button
                      size="sm"
                      className="mt-4 bg-[#6B8E23] hover:bg-[#556B2F] text-white"
                      onClick={() => handleNewMessage(selectedDemande)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un message
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            <DialogFooter className="gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => handleAddSuivi(selectedDemande)}
                className="flex items-center gap-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
              >
                <FileText className="h-4 w-4" />
                Ajouter une note
              </Button>
              <Button
                variant="outline"
                onClick={() => exportToPDF(selectedDemande)}
                className="flex items-center gap-2 border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
              <Button
                onClick={() => handleNewMessage(selectedDemande)}
                className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#556B2F] text-white"
              >
                <MessageSquare className="h-4 w-4" />
                Nouveau message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Nouveau message */}
      <Dialog open={showNewMessageModal} onOpenChange={setShowNewMessageModal}>
        <DialogContent className="border-[#D3D3D3] bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">Nouveau message</DialogTitle>
            <DialogDescription className="text-[#000000] opacity-80">
              Envoyez un message concernant la demande #{selectedDemande?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#000000]">Destinataire</label>
              {selectedDemande?.expert ? (
                <div className="mt-1 p-3 bg-[#F5F5F5] rounded-lg border border-[#D3D3D3]">
                  <div className="font-medium text-[#000000]">
                    {selectedDemande.expert.firstName} {selectedDemande.expert.lastName}
                  </div>
                  <div className="text-sm text-[#000000] opacity-80">{selectedDemande.expert.email}</div>
                </div>
              ) : (
                <div className="mt-1 p-3 bg-[#FFF8E1] rounded-lg border border-[#D3D3D3]">
                  <div className="text-sm text-[#000000]">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Aucun expert assigné. Votre message sera visible par l'administration.
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#000000]">Votre message *</label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tapez votre message ici..."
                rows={6}
                className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewMessageModal(false)}
              disabled={loadingSendMessage}
              className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendNewMessage}
              disabled={loadingSendMessage || !newMessage.trim()}
              className="bg-[#6B8E23] hover:bg-[#556B2F] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingSendMessage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Ajouter une note */}
      <Dialog open={showSuiviModal} onOpenChange={setShowSuiviModal}>
        <DialogContent className="border-[#D3D3D3] bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">Ajouter une note personnelle</DialogTitle>
            <DialogDescription className="text-[#000000] opacity-80">
              Ajoutez une note personnelle à la demande #{selectedDemande?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#000000]">Type de note</label>
              <Select value={suiviType} onValueChange={setSuiviType}>
                <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note personnelle</SelectItem>
                  <SelectItem value="reminder">Rappel</SelectItem>
                  <SelectItem value="question">Question à poser</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#000000]">Votre note *</label>
              <Textarea
                value={suiviMessage}
                onChange={(e) => setSuiviMessage(e.target.value)}
                placeholder="Ajoutez vos notes personnelles sur cette demande..."
                rows={6}
                className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]"
              />
            </div>
            <div className="text-sm text-[#000000] opacity-80">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Cette note sera uniquement visible par vous et ne sera pas partagée avec l'expert.
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
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la note
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Annuler la demande */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="border-[#D3D3D3] bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#D32F2F]">
              <AlertTriangle className="h-5 w-5" />
              Annuler la demande #{selectedDemande?.id}
            </DialogTitle>
            <DialogDescription className="text-[#000000] opacity-80">
              Êtes-vous sûr de vouloir annuler cette demande ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#000000]">Raison de l'annulation (optionnel)</label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Pourquoi annulez-vous cette demande ?"
                rows={3}
                className="mt-1 border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]"
              />
            </div>
            
            <div className="p-3 bg-[#FFEBEE] rounded-lg border border-[#D3D3D3]">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-[#D32F2F] mt-0.5" />
                <div className="text-sm text-[#000000]">
                  <p className="font-medium">Attention :</p>
                  <p>L'annulation est définitive. Vous ne pourrez plus modifier cette demande.</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCancelModal(false)}
              disabled={loadingCancel}
              className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ne pas annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelDemande}
              disabled={loadingCancel}
              className="bg-[#FFEBEE] text-[#000000] border-[#D3D3D3] hover:bg-[#D32F2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCancel ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Annulation...
                </>
              ) : (
                <>
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Confirmer l'annulation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Changer le statut */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="border-[#D3D3D3] bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513]">Changer le statut de la demande #{selectedDemande?.id}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#000000]">Nouveau statut *</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23] text-[#000000]">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="terminee">Terminée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-[#000000] opacity-80">
              Certains changements de statut peuvent nécessiter la validation d'un administrateur.
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowStatusModal(false)}
              disabled={loadingUpdateStatus}
              className="border-[#D3D3D3] text-[#000000] hover:bg-[#556B2F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </Button>
            <Button 
              onClick={() => selectedDemande && handleUpdateStatus(selectedDemande.id, newStatus)}
              disabled={loadingUpdateStatus || !newStatus}
              className="bg-[#6B8E23] hover:bg-[#556B2F] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingUpdateStatus ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mettre à jour
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserConseilPage;