// GestionAlternancePage.js - AVEC MODAL CANDIDATURES RÉEL
import { useState, useEffect, useCallback } from "react";
import { useAlternance } from "@/hooks/useAlternance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  Download,
  GraduationCap,
  BookOpen,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Zap,
  Target,
  Loader2,
  Mail,
  Phone,
  User,
  CalendarDays,
  File,
  ChevronUp,
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Statuts pour candidatures (comme dans votre base de données)
const candidatureStatuses = [
  { value: "en_attente", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "pending", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "acceptée", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "accepted", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "refusée", label: "Refusée", color: "bg-red-100 text-red-800" },
  { value: "rejected", label: "Refusée", color: "bg-red-100 text-red-800" },
  { value: "annulée", label: "Annulée", color: "bg-gray-100 text-gray-800" },
];

export default function GestionAlternancePage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    offres,
    isLoading,
    error,
    stats,
    pagination,
    fetchOffres,
    fetchStats,
    createOffre,
    updateOffre,
    deleteOffre,
    updateStatus,
    exportCSV,
    changePage
  } = useAlternance();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffre, setEditingOffre] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // États pour le modal des candidatures
  const [candidaturesModalOpen, setCandidaturesModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [loadingCandidatures, setLoadingCandidatures] = useState(false);
  const [candidatureStats, setCandidatureStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showCandidatureDetail, setShowCandidatureDetail] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    niveauEtude: "",
    duree: "",
    remuneration: "",
    location: "",
    dateDebut: "",
    dateFin: "",
    status: "draft",
    missions: [""],
    competences: [""],
    avantages: [""],
    ecolePartenaire: "",
    rythmeAlternance: "",
    pourcentageTemps: "",
    urgent: false,
  });

  const types = [
    "Alternance (Contrat pro)",
    "Alternance (Apprentissage)",
    "Stage conventionné",
    "Stage de fin d'études",
  ];

  const niveauxEtude = [
    "BAC",
    "BAC+2",
    "BAC+3",
    "BAC+4",
    "BAC+5 et plus",
  ];

  const statuses = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "archived", label: "Archivée", color: "bg-yellow-100 text-yellow-800" },
    { value: "filled", label: "Pourvu", color: "bg-blue-100 text-blue-800" },
  ];

  // Vérification d'authentification
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role !== 'professional' && user.role !== 'admin') {
    navigate('/unauthorized');
    return null;
  }

  // Initialiser les données au chargement
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchOffres({
            search: '',
            status: 'all',
            type: 'all',
            niveau: 'all',
            page: 1
          }),
          fetchStats()
        ]);
      } catch (err) {
        console.error('Erreur lors du chargement initial:', err);
      }
    };

    loadInitialData();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load data when filters change
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      loadData();
    }
  }, [debouncedSearch, typeFilter, statusFilter]);

  const loadData = async () => {
    try {
      await fetchOffres({
        search: debouncedSearch,
        status: statusFilter,
        type: typeFilter,
        niveau: 'all',
        page: 1
      });
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleSearch = useCallback(() => {
    fetchOffres({
      search: searchTerm,
      type: typeFilter,
      status: statusFilter,
      niveau: 'all',
      page: 1
    });
  }, [searchTerm, typeFilter, statusFilter, fetchOffres]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const handleEdit = (offre) => {
    setEditingOffre(offre);
    setFormData({
      title: offre.title || "",
      description: offre.description || "",
      type: offre.type || "",
      niveauEtude: offre.niveauEtude || "",
      duree: offre.duree || "",
      remuneration: offre.remuneration || "",
      location: offre.location || "",
      dateDebut: offre.dateDebut ? new Date(offre.dateDebut).toISOString().split('T')[0] : "",
      dateFin: offre.dateFin ? new Date(offre.dateFin).toISOString().split('T')[0] : "",
      status: offre.status || "draft",
      missions: Array.isArray(offre.missions) ? offre.missions : [""],
      competences: Array.isArray(offre.competences) ? offre.competences : [""],
      avantages: Array.isArray(offre.avantages) ? offre.avantages : [""],
      ecolePartenaire: offre.ecolePartenaire || "",
      rythmeAlternance: offre.rythmeAlternance || "",
      pourcentageTemps: offre.pourcentageTemps || "",
      urgent: offre.urgent || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      try {
        await deleteOffre(id);
        toast.success("Offre supprimée avec succès");
      } catch (error) {
        toast.error(error.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  // Fonction pour ouvrir le modal des candidatures
  const openCandidaturesModal = async (offre) => {
    setSelectedOffre(offre);
    setCandidaturesModalOpen(true);
    setLoadingCandidatures(true);
    
    try {
      const token = localStorage.getItem('auth-token') || 
                    localStorage.getItem('token') || 
                    localStorage.getItem('jwt-token');
      
      console.log('🔑 Token pour candidatures alternance:', token ? 'Présent' : 'Absent');
      console.log(`📤 Récupération candidatures pour offre alternance ID: ${offre.id}`);
      
      if (!token) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        navigate('/login');
        return;
      }
      
      // Utiliser l'API réelle pour récupérer les candidatures
      const response = await axios.get(
        `${API_URL}/candidatures/alternances/${offre.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('📊 Réponse candidatures alternance:', response.data);
      
      if (response.data.success) {
        const apiCandidatures = response.data.data || [];
        
        console.log(`📝 ${apiCandidatures.length} candidatures reçues pour alternance`);
        
        if (apiCandidatures.length === 0) {
          toast.info('Aucune candidature pour cette offre d\'alternance/stage');
          setCandidatures([]);
        } else {
          // Transformer les données de l'API en format utilisable par votre interface
          const formattedCandidatures = apiCandidatures.map(candidature => {
            // Extraire nom et prénom
            let nom = '';
            let prenom = '';
            const nomComplet = candidature.nomCandidat || '';
            
            if (nomComplet) {
              const nameParts = nomComplet.trim().split(' ');
              if (nameParts.length > 1) {
                nom = nameParts[nameParts.length - 1];
                prenom = nameParts.slice(0, -1).join(' ');
              } else {
                prenom = nameParts[0];
              }
            }
            
            return {
              id: candidature.id,
              nom: nom,
              prenom: prenom,
              nomComplet: nomComplet,
              email: candidature.emailCandidat || '',
              telephone: candidature.telCandidat || '',
              motivation: candidature.messageMotivation || '',
              cvPath: candidature.cvUrl || null,
              lettreMotivationUrl: candidature.lettreMotivationUrl || null,
              status: candidature.statut || 'en_attente',
              createdAt: candidature.appliedAt || candidature.createdAt,
              dateNaissance: null,
              niveauEtude: candidature.niveauEtude || '',
              ecole: candidature.ecole || '',
              offreType: candidature.offreType,
              titreOffre: candidature.titreOffre
            };
          });
          
          setCandidatures(formattedCandidatures);
          
          // Calculer les statistiques
          const stats = {
            total: formattedCandidatures.length,
            pending: formattedCandidatures.filter(c => c.status === 'en_attente' || c.status === 'pending').length,
            accepted: formattedCandidatures.filter(c => c.status === 'accepted' || c.status === 'acceptée').length,
            rejected: formattedCandidatures.filter(c => c.status === 'rejected' || c.status === 'refusée').length
          };
          setCandidatureStats(stats);
          
          console.log('📈 Stats calculées alternance:', stats);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement candidatures alternance:', error);
      console.error('❌ Détails erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 404) {
        toast.info('Aucune candidature trouvée pour cette offre');
        setCandidatures([]);
      } else if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        navigate('/login');
      } else {
        // Si la route spécifique n'existe pas, essayez avec la route générique
        try {
          const token = localStorage.getItem('auth-token');
          const response = await axios.get(
            `${API_URL}/candidatures/emplois/${offre.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.data.success) {
            toast.info(`Utilisation route générique - ${response.data.data.length} candidatures`);
            const formattedCandidatures = response.data.data.map(candidature => ({
              id: candidature.id,
              nomComplet: candidature.nomCandidat || '',
              email: candidature.emailCandidat || '',
              telephone: candidature.telCandidat || '',
              motivation: candidature.messageMotivation || '',
              status: candidature.statut || 'en_attente',
              createdAt: candidature.appliedAt || candidature.createdAt,
            }));
            
            setCandidatures(formattedCandidatures);
            const stats = {
              total: formattedCandidatures.length,
              pending: formattedCandidatures.filter(c => c.status === 'en_attente').length,
              accepted: formattedCandidatures.filter(c => c.status === 'acceptée').length,
              rejected: formattedCandidatures.filter(c => c.status === 'refusée').length
            };
            setCandidatureStats(stats);
          }
        } catch (secondError) {
          toast.error('Erreur lors du chargement des candidatures');
          setCandidatures([]);
        }
      }
    } finally {
      setLoadingCandidatures(false);
    }
  };

  // Fonction pour mettre à jour le statut d'une candidature
  const updateCandidatureStatus = async (candidatureId, newStatus) => {
    try {
      const token = localStorage.getItem('auth-token');
      
      // Convertir si nécessaire
      let statusToSend = newStatus;
      if (newStatus === 'acceptée') statusToSend = 'acceptée';
      else if (newStatus === 'accepted') statusToSend = 'acceptée';
      else if (newStatus === 'refusée') statusToSend = 'refusée';
      else if (newStatus === 'rejected') statusToSend = 'refusée';
      else if (newStatus === 'en_attente') statusToSend = 'en_attente';
      else if (newStatus === 'pending') statusToSend = 'en_attente';
      
      console.log('📤 Mise à jour statut candidature alternance:', {
        candidatureId,
        newStatus,
        sending: statusToSend
      });
      
      const response = await axios.patch(
        `${API_URL}/candidatures/${candidatureId}/status`,
        { status: statusToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Mettre à jour localement
        setCandidatures(prev => 
          prev.map(candidature => 
            candidature.id === candidatureId 
              ? { ...candidature, status: statusToSend }
              : candidature
          )
        );
        
        // Mettre à jour la candidature sélectionnée si elle est ouverte
        if (selectedCandidature?.id === candidatureId) {
          setSelectedCandidature(prev => ({ ...prev, status: statusToSend }));
        }
        
        toast.success('Statut mis à jour avec succès');
        
        // Recalculer les stats
        const updatedCandidatures = candidatures.map(c => 
          c.id === candidatureId ? { ...c, status: statusToSend } : c
        );
        
        const stats = {
          total: updatedCandidatures.length,
          pending: updatedCandidatures.filter(c => 
            c.status === 'en_attente' || c.status === 'pending'
          ).length,
          accepted: updatedCandidatures.filter(c => 
            c.status === 'acceptée' || c.status === 'accepted'
          ).length,
          rejected: updatedCandidatures.filter(c => 
            c.status === 'refusée' || c.status === 'rejected'
          ).length
        };
        setCandidatureStats(stats);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  // Fonction pour télécharger un CV
  const downloadCV = async (candidatureId, fileName, cvUrl) => {
    try {
      if (!cvUrl) {
        toast.error('Aucun CV disponible pour ce candidat');
        return;
      }
      
      toast.info('Téléchargement du CV...');
      
      // Si le CV est une URL relative, construire l'URL complète
      let downloadUrl = cvUrl;
      if (!cvUrl.startsWith('http')) {
        downloadUrl = `http://localhost:3001${cvUrl.startsWith('/') ? cvUrl : '/' + cvUrl}`;
      }
      
      // Créer un lien temporaire pour le téléchargement
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName || 'cv_candidat.pdf');
      link.setAttribute('target', '_blank');
      link.href = `${downloadUrl}?t=${Date.now()}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CV téléchargé');
    } catch (error) {
      console.error('Erreur téléchargement CV:', error);
      toast.error('Erreur lors du téléchargement du CV');
    }
  };

  // Fonction pour supprimer une candidature
  const deleteCandidature = async (candidatureId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      
      const response = await axios.delete(
        `${API_URL}/candidatures/${candidatureId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Candidature supprimée avec succès');
        
        // Recharger les candidatures
        if (selectedOffre) {
          await openCandidaturesModal(selectedOffre);
        }
        
        // Fermer le détail si c'était cette candidature
        if (selectedCandidature?.id === candidatureId) {
          setSelectedCandidature(null);
          setShowCandidatureDetail(false);
        }
      }
    } catch (error) {
      console.error('❌ Erreur suppression candidature:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  // Fonction pour voir les détails d'une candidature
  const handleViewCandidatureDetail = (candidature) => {
    setSelectedCandidature(candidature);
    setShowCandidatureDetail(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const missionsArray = Array.isArray(formData.missions) ? formData.missions : 
                           (formData.missions ? [formData.missions] : []);
      const competencesArray = Array.isArray(formData.competences) ? formData.competences : 
                             (formData.competences ? [formData.competences] : []);
      const avantagesArray = Array.isArray(formData.avantages) ? formData.avantages : 
                           (formData.avantages ? [formData.avantages] : []);

      const apiData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        niveauEtude: formData.niveauEtude,
        duree: formData.duree,
        remuneration: formData.remuneration,
        location: formData.location,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin || null,
        status: formData.status,
        missions: missionsArray.filter(m => m && m.trim() !== ''),
        competences: competencesArray.filter(c => c && c.trim() !== ''),
        avantages: avantagesArray.filter(a => a && a.trim() !== ''),
        ecolePartenaire: formData.ecolePartenaire || '',
        rythmeAlternance: formData.rythmeAlternance || '',
        pourcentageTemps: formData.pourcentageTemps || '',
        urgent: formData.urgent || false,
      };

      if (editingOffre) {
        await updateOffre(editingOffre.id, apiData);
        toast.success("Offre mise à jour avec succès");
      } else {
        await createOffre(apiData);
        toast.success("Offre créée avec succès");
      }
      
      setIsDialogOpen(false);
      setEditingOffre(null);
      resetForm();
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      niveauEtude: "",
      duree: "",
      remuneration: "",
      location: "",
      dateDebut: "",
      dateFin: "",
      status: "draft",
      missions: [""],
      competences: [""],
      avantages: [""],
      ecolePartenaire: "",
      rythmeAlternance: "",
      pourcentageTemps: "",
      urgent: false,
    });
  };

  const handleExportCSV = async () => {
    try {
      toast.info("Export CSV en cours...");
      await exportCSV();
    } catch (error) {
      console.error('Export CSV error:', error);
      let errorMessage = "Erreur lors de l'export CSV";
      
      if (error.message.includes('Session expirée')) {
        errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
      } else if (error.message.includes('Erreur réseau')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      }
      
      toast.error(errorMessage);
    }
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => pagination.page > 1 && changePage(pagination.page - 1)}
              className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            let pageNum;
            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => changePage(pageNum)}
                  isActive={pageNum === pagination.page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => pagination.page < pagination.pages && changePage(pagination.page + 1)}
              className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#556B2F] mb-2">
          Gestion Alternance/Stages
        </h1>
        <p className="text-gray-600">
          Gérez vos offres d'alternance et de stages pour étudiants
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offres total</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.total || 0}</p>
              </div>
              <Target className="h-8 w-8 text-[#6B8E23]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alternances</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.alternance || 0}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stages</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.stage || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Candidatures</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.candidatures || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une offre..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type d'offre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResetFilters}>
                Réinitialiser
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingOffre(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410]">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle offre
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  {/* Votre formulaire existant */}
                  <DialogHeader>
                    <DialogTitle>
                      {editingOffre ? 'Modifier l\'offre' : 'Nouvelle offre alternance/stage'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingOffre 
                        ? 'Modifiez les informations de votre offre'
                        : 'Créez une nouvelle offre d\'alternance ou de stage'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    {/* ... votre formulaire existant ... */}
                    <div className="grid gap-4 py-4">
                      {/* Formulaire inchangé */}
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingOffre(null);
                          resetForm();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-[#556B2F] hover:bg-[#6B8E23]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingOffre ? 'Mettre à jour' : 'Publier'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offres Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des offres d'alternance et stages</CardTitle>
          <CardDescription>
            {offres.length} offre{offres.length !== 1 ? 's' : ''} trouvée{offres.length !== 1 ? 's' : ''}
            {pagination.total > 0 && ` (${pagination.total} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#556B2F] mb-4" />
              <p>Chargement des offres...</p>
            </div>
          ) : offres.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune offre trouvée</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                  ? "Aucune offre ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore créé d'offres d'alternance ou de stages."
                }
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410]">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre première offre
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Poste</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Rémunération</TableHead>
                    <TableHead>Candidatures</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date début</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offres.map((offre) => {
                    const status = statuses.find(s => s.value === offre.status);
                    return (
                      <TableRow key={offre.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                {offre.title}
                                {offre.urgent && (
                                  <Badge className="bg-red-100 text-red-800">
                                    <Zap className="h-3 w-3 mr-1" /> Urgent
                                  </Badge>
                                )}
                              </div>
                              {offre.ecolePartenaire && (
                                <div className="text-sm text-gray-500">
                                  {offre.ecolePartenaire}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{offre.type}</Badge>
                        </TableCell>
                        <TableCell>{offre.niveauEtude}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {offre.duree}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {offre.remuneration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <Button
                              variant="link"
                              className="h-6 px-2 text-blue-600 hover:text-blue-800"
                              onClick={() => openCandidaturesModal(offre)}
                            >
                              {offre.candidatures_count || 0}
                            </Button>
                            <span className="text-xs text-gray-500">({offre.vues || 0} vues)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={status?.color}>
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {offre.dateDebut ? new Date(offre.dateDebut).toLocaleDateString() : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(offre)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openCandidaturesModal(offre)}>
                                <Users className="h-4 w-4 mr-2" />
                                Voir candidatures ({offre.candidatures_count || 0})
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(offre.id, offre.status === 'active' ? 'archived' : 'active')}
                              >
                                {offre.status === 'active' ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Archiver
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activer
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(offre.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </CardContent>
      </Card>

      {/* MODAL DES CANDIDATURES */}
      <Dialog open={candidaturesModalOpen} onOpenChange={setCandidaturesModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Candidatures pour : {selectedOffre?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedOffre?.type} • {selectedOffre?.niveauEtude} • {candidatureStats.total} candidature{candidatureStats.total !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>

          {/* Statistiques */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-[#556B2F]">{candidatureStats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{candidatureStats.pending}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Acceptées</p>
                  <p className="text-2xl font-bold text-green-600">{candidatureStats.accepted}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Refusées</p>
                  <p className="text-2xl font-bold text-red-600">{candidatureStats.rejected}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {loadingCandidatures ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Chargement des candidatures...</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">Toutes ({candidatureStats.total})</TabsTrigger>
                <TabsTrigger value="pending">En attente ({candidatureStats.pending})</TabsTrigger>
                <TabsTrigger value="accepted">Acceptées ({candidatureStats.accepted})</TabsTrigger>
                <TabsTrigger value="rejected">Refusées ({candidatureStats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <CandidaturesTable 
                  candidatures={candidatures}
                  onUpdateStatus={updateCandidatureStatus}
                  onDownloadCV={downloadCV}
                  onDelete={deleteCandidature}
                  onViewDetail={handleViewCandidatureDetail}
                  showDetail={showCandidatureDetail}
                  selectedCandidature={selectedCandidature}
                  onBackToList={() => {
                    setShowCandidatureDetail(false);
                    setSelectedCandidature(null);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="mt-4">
                <CandidaturesTable 
                  candidatures={candidatures.filter(c => c.status === 'en_attente' || c.status === 'pending')}
                  onUpdateStatus={updateCandidatureStatus}
                  onDownloadCV={downloadCV}
                  onDelete={deleteCandidature}
                  onViewDetail={handleViewCandidatureDetail}
                  showDetail={showCandidatureDetail}
                  selectedCandidature={selectedCandidature}
                  onBackToList={() => {
                    setShowCandidatureDetail(false);
                    setSelectedCandidature(null);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="accepted" className="mt-4">
                <CandidaturesTable 
                  candidatures={candidatures.filter(c => c.status === 'acceptée' || c.status === 'accepted')}
                  onUpdateStatus={updateCandidatureStatus}
                  onDownloadCV={downloadCV}
                  onDelete={deleteCandidature}
                  onViewDetail={handleViewCandidatureDetail}
                  showDetail={showCandidatureDetail}
                  selectedCandidature={selectedCandidature}
                  onBackToList={() => {
                    setShowCandidatureDetail(false);
                    setSelectedCandidature(null);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-4">
                <CandidaturesTable 
                  candidatures={candidatures.filter(c => c.status === 'refusée' || c.status === 'rejected')}
                  onUpdateStatus={updateCandidatureStatus}
                  onDownloadCV={downloadCV}
                  onDelete={deleteCandidature}
                  onViewDetail={handleViewCandidatureDetail}
                  showDetail={showCandidatureDetail}
                  selectedCandidature={selectedCandidature}
                  onBackToList={() => {
                    setShowCandidatureDetail(false);
                    setSelectedCandidature(null);
                  }}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant pour afficher le tableau des candidatures
function CandidaturesTable({ 
  candidatures, 
  onUpdateStatus, 
  onDownloadCV, 
  onDelete, 
  onViewDetail,
  showDetail,
  selectedCandidature,
  onBackToList 
}) {
  if (candidatures.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Aucune candidature trouvée</p>
      </div>
    );
  }

  if (showDetail && selectedCandidature) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={onBackToList}
          className="mb-2"
        >
          <ChevronUp className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{selectedCandidature.nomComplet}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4" />
                  {selectedCandidature.email}
                  {selectedCandidature.telephone && (
                    <>
                      <span className="mx-2">•</span>
                      <Phone className="h-4 w-4" />
                      {selectedCandidature.telephone}
                    </>
                  )}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedCandidature.status}
                  onValueChange={(value) => onUpdateStatus(selectedCandidature.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {candidatureStatuses.map((statut) => (
                      <SelectItem key={statut.value} value={statut.value}>
                        {statut.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(selectedCandidature.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Informations du candidat</h4>
                  <div className="space-y-2 text-sm">
                    {selectedCandidature.niveauEtude && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Niveau d'étude :</span>
                        <span className="font-medium">{selectedCandidature.niveauEtude}</span>
                      </div>
                    )}
                    {selectedCandidature.ecole && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Établissement :</span>
                        <span className="font-medium">{selectedCandidature.ecole}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de candidature :</span>
                      <span className="font-medium">
                        {selectedCandidature.createdAt ? new Date(selectedCandidature.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Documents</h4>
                  <div className="space-y-2">
                    {selectedCandidature.cvPath ? (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => onDownloadCV(selectedCandidature.id, `CV_${selectedCandidature.nom}_${selectedCandidature.prenom}.pdf`, selectedCandidature.cvPath)}
                      >
                        <File className="h-4 w-4 mr-2" />
                        Télécharger le CV
                      </Button>
                    ) : (
                      <p className="text-gray-500 text-sm">Aucun CV disponible</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Lettre de motivation</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-sm whitespace-pre-line">
                    {selectedCandidature.motivation || "Aucune lettre de motivation fournie."}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => window.open(`mailto:${selectedCandidature.email}`, '_blank')}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contacter par email
              </Button>
              {selectedCandidature.telephone && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${selectedCandidature.telephone}`)}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidat</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date candidature</TableHead>
            <TableHead>Motivation</TableHead>
            <TableHead>CV</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidatures.map((candidature) => {
            const status = candidatureStatuses.find(s => s.value === candidature.status);
            
            return (
              <TableRow key={candidature.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div>{candidature.nomComplet}</div>
                      {candidature.niveauEtude && (
                        <div className="text-xs text-gray-500">
                          {candidature.niveauEtude}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="text-sm">{candidature.email}</span>
                    </div>
                    {candidature.telephone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{candidature.telephone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    <span className="text-sm">
                      {candidature.createdAt ? new Date(candidature.createdAt).toLocaleDateString('fr-FR') : '-'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    {candidature.motivation ? (
                      <div 
                        className="text-sm truncate cursor-help" 
                        title={candidature.motivation}
                      >
                        {candidature.motivation.length > 50 
                          ? `${candidature.motivation.substring(0, 50)}...` 
                          : candidature.motivation}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Aucune motivation</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {candidature.cvPath ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownloadCV(candidature.id, `CV_${candidature.nom}_${candidature.prenom}.pdf`, candidature.cvPath)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">Aucun CV</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={status?.color || 'bg-gray-100 text-gray-800'}>
                    {status?.label || candidature.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      
                      <DropdownMenuItem onClick={() => onViewDetail(candidature)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Boutons pour changer le statut */}
                      {candidature.status !== 'acceptée' && candidature.status !== 'accepted' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(candidature.id, 'acceptée')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Accepter
                        </DropdownMenuItem>
                      )}
                      
                      {candidature.status !== 'refusée' && candidature.status !== 'rejected' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(candidature.id, 'refusée')}
                        >
                          <XCircle className="h-4 w-4 mr-2 text-red-600" />
                          Refuser
                        </DropdownMenuItem>
                      )}
                      
                      {candidature.status !== 'en_attente' && candidature.status !== 'pending' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(candidature.id, 'en_attente')}
                        >
                          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                          Remettre en attente
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      {/* Bouton Supprimer */}
                      <DropdownMenuItem 
                        onClick={() => onDelete(candidature.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}