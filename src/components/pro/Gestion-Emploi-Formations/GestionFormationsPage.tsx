import { useState, useEffect, useCallback } from "react";
import { useFormation } from "@/hooks/useFormation";
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
  Upload,
  GraduationCap,
  Calendar,
  Users,
  DollarSign,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Loader2,
  Mail,
  Phone,
  FileText,
  User,
  CalendarDays,
} from "lucide-react";

import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Définir candidatureStatuses à l'extérieur du composant pour qu'il soit accessible partout
const candidatureStatuses = [
  { value: "pending", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "accepted", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Refusée", color: "bg-red-100 text-red-800" },
];

export default function GestionFormationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    formations,
    isLoading,
    error,
    stats,
    pagination,
    fetchFormations,
    fetchStats,
    createFormation,
    updateFormation,
    deleteFormation,
    updateStatus,
    exportCSV,
    changePage
  } = useFormation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [apiError, setApiError] = useState("");

  // États pour le modal des candidatures
  const [candidaturesModalOpen, setCandidaturesModalOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [loadingCandidatures, setLoadingCandidatures] = useState(false);
  const [candidatureStats, setCandidatureStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    format: "",
    duration: "",
    price: 0,
    maxParticipants: 10,
    certification: "",
    startDate: "",
    endDate: "",
    status: "draft",
    requirements: "",
    program: [""],
    location: "",
    isCertified: false,
    isFinanced: false,
    isOnline: false,
  });

  const categories = [
    "Informatique & Numérique",
    "Management & Leadership",
    "Commerce & Marketing",
    "Bâtiment & Construction",
    "Santé & Bien-être",
    "Comptabilité & Finance",
    "Langues étrangères",
    "Artisanat & Métiers",
  ];

  const formats = [
    "Présentiel",
    "100% en ligne",
    "Hybride",
    "Alternance",
  ];

  const statuses = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "archived", label: "Archivée", color: "bg-yellow-100 text-yellow-800" },
    { value: "completed", label: "Terminée", color: "bg-blue-100 text-blue-800" },
  ];

  // Fonction pour récupérer les headers d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('jwt-token');
    
    if (!token) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load data on mount and when filters change
  useEffect(() => {
    const loadDataAsync = async () => {
      if (user && !authLoading && !dataLoaded) {
        try {
          const token = localStorage.getItem('auth-token') || 
                localStorage.getItem('token') || 
                localStorage.getItem('jwt-token');
  
          console.log('🔑 Token trouvé:', token);
          if (!token) {
            setApiError('Veuillez vous connecter');
            navigate('/login');
            return;
          }
          
          // Charger les stats
          await fetchStats();
          
          // Charger les formations
          await fetchFormations({
            search: debouncedSearch,
            status: statusFilter,
            category: categoryFilter,
            page: 1
          });
          
          setDataLoaded(true);
        } catch (err) {
          console.error("Erreur initiale:", err);
          setApiError(err.message || "Erreur lors du chargement des données");
          
          // Redirection si erreur d'authentification
          if (err.message.includes('authentification') || err.message.includes('Session')) {
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        }
      }
    };

    loadDataAsync();
  }, [user, authLoading, navigate, debouncedSearch, statusFilter, categoryFilter, fetchStats, fetchFormations]);

  useEffect(() => {
    if (dataLoaded) {
      handleSearch();
    }
  }, [debouncedSearch, statusFilter, categoryFilter, dataLoaded]);

  const handleSearch = useCallback(async () => {
    try {
      await fetchFormations({
        search: debouncedSearch,
        status: statusFilter,
        category: categoryFilter,
        page: 1
      });
    } catch (err) {
      console.error("Erreur recherche:", err);
      setApiError(err.message || "Erreur lors de la recherche");
    }
  }, [debouncedSearch, statusFilter, categoryFilter, fetchFormations]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const handleEdit = (formation) => {
    setEditingFormation(formation);
    
    // Formater les dates pour l'input type="date" (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    };
    
    setFormData({
      title: formation.title || "",
      description: formation.description || "",
      category: formation.category || "",
      format: formation.format || "",
      duration: formation.duration || "",
      price: formation.price || 0,
      maxParticipants: formation.maxParticipants || 10,
      certification: formation.certification || "",
      startDate: formatDateForInput(formation.startDate),
      endDate: formatDateForInput(formation.endDate),
      status: formation.status || "draft",
      requirements: formation.requirements || "",
      program: formation.program && formation.program.length > 0 ? formation.program : [""],
      location: formation.location || "",
      isCertified: formation.isCertified || false,
      isFinanced: formation.isFinanced || false,
      isOnline: formation.isOnline || false,
    });
    setIsDialogOpen(true);
  };

  // Fonction pour ouvrir le modal des candidatures
  const openCandidaturesModal = async (formation) => {
    setSelectedFormation(formation);
    setCandidaturesModalOpen(true);
    await fetchCandidatures(formation.id);
  };

  // Fonction pour récupérer les candidatures
  const fetchCandidatures = async (formationId) => {
    setLoadingCandidatures(true);
    try {
      // Simulation de données - Remplacez par votre endpoint API réel
      const mockCandidatures = [
        {
          id: 1,
          nom: "Dupont",
          prenom: "Jean",
          email: "jean.dupont@email.com",
          telephone: "0612345678",
          motivation: "Je suis très intéressé par cette formation car elle correspond parfaitement à mes objectifs professionnels.",
          cvPath: "/cv/jean_dupont.pdf",
          status: "pending",
          createdAt: new Date().toISOString(),
          dateNaissance: "1990-05-15"
        },
        {
          id: 2,
          nom: "Martin",
          prenom: "Sophie",
          email: "sophie.martin@email.com",
          telephone: "0678912345",
          motivation: "Je recherche une formation certifiante pour évoluer dans mon entreprise.",
          cvPath: "/cv/sophie_martin.pdf",
          status: "accepted",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          dateNaissance: "1985-08-22"
        },
        {
          id: 3,
          nom: "Leroy",
          prenom: "Pierre",
          email: "pierre.leroy@email.com",
          telephone: null,
          motivation: "",
          cvPath: null,
          status: "rejected",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          dateNaissance: "1995-12-10"
        }
      ];
      
      setCandidatures(mockCandidatures);
      
      // Calculer les statistiques
      const stats = {
        total: mockCandidatures.length,
        pending: mockCandidatures.filter(c => c.status === 'pending').length,
        accepted: mockCandidatures.filter(c => c.status === 'accepted').length,
        rejected: mockCandidatures.filter(c => c.status === 'rejected').length
      };
      setCandidatureStats(stats);
      
    } catch (error) {
      console.error('Erreur chargement candidatures:', error);
      toast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoadingCandidatures(false);
    }
  };

  // Fonction pour mettre à jour le statut d'une candidature
  const updateCandidatureStatus = async (candidatureId, newStatus) => {
    try {
      // Simulation d'appel API - Remplacez par votre endpoint réel
      console.log(`Mise à jour candidature ${candidatureId} -> ${newStatus}`);
      
      // Mettre à jour localement
      setCandidatures(prev => 
        prev.map(candidature => 
          candidature.id === candidatureId 
            ? { ...candidature, status: newStatus }
            : candidature
        )
      );
      
      // Recalculer les stats
      const updatedCandidatures = candidatures.map(c => 
        c.id === candidatureId ? { ...c, status: newStatus } : c
      );
      
      const stats = {
        total: updatedCandidatures.length,
        pending: updatedCandidatures.filter(c => c.status === 'pending').length,
        accepted: updatedCandidatures.filter(c => c.status === 'accepted').length,
        rejected: updatedCandidatures.filter(c => c.status === 'rejected').length
      };
      setCandidatureStats(stats);
      
      toast.success('Statut mis à jour');
      
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Fonction pour télécharger un CV
  const downloadCV = async (candidatureId, fileName) => {
    try {
      toast.info('Téléchargement du CV...');
      // Simulation - Dans la réalité, vous feriez un appel API pour récupérer le fichier
      console.log(`Téléchargement CV pour candidature ${candidatureId}`);
      
      // Créer un fichier PDF factice pour la démonstration
      const fakePDFContent = "Ceci est un CV factice pour démonstration";
      const blob = new Blob([fakePDFContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'cv_candidat.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('CV téléchargé');
    } catch (error) {
      console.error('Erreur téléchargement CV:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      try {
        await deleteFormation(id);
        toast.success("Formation supprimée avec succès");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 DEBUG - Données du formulaire:', formData);
    
    try {
      const apiData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        format: formData.format,
        duration: formData.duration,
        price: parseFloat(formData.price) || 0,
        maxParticipants: parseInt(formData.maxParticipants) || 10,
        
        startDate: formData.startDate ? 
          new Date(formData.startDate + 'T00:00:00').toISOString() : 
          new Date().toISOString(),
        
        endDate: formData.endDate ? 
          new Date(formData.endDate + 'T23:59:59').toISOString() : 
          null,
        
        certification: formData.certification || "",
        requirements: formData.requirements || "",
        location: formData.location || "",
        
        isCertified: !!formData.isCertified,
        isFinanced: !!formData.isFinanced,
        isOnline: !!formData.isOnline,
        
        program: Array.isArray(formData.program) 
          ? formData.program.filter(item => item && item.trim() !== "")
          : [formData.program || ""].filter(item => item && item.trim() !== ""),
        
        status: formData.status || "draft"
      };
      
      console.log('📤 DEBUG - Données formatées pour API:', apiData);
      
      if (editingFormation) {
        console.log(`🔄 Mise à jour formation ${editingFormation.id}`);
        await updateFormation(editingFormation.id, apiData);
        toast.success("Formation mise à jour avec succès");
      } else {
        console.log('🆕 Création nouvelle formation');
        await createFormation(apiData);
        toast.success("Formation créée avec succès");
      }
      
      setIsDialogOpen(false);
      setEditingFormation(null);
      resetForm();
      
    } catch (error) {
      console.error('❌ Erreur handleSubmit:', error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      format: "",
      duration: "",
      price: 0,
      maxParticipants: 10,
      certification: "",
      startDate: "",
      endDate: "",
      status: "draft",
      requirements: "",
      program: [""],
      location: "",
      isCertified: false,
      isFinanced: false,
      isOnline: false,
    });
  };

  const handleExportCSV = async () => {
    try {
      toast.info("Export CSV en cours...");
      await exportCSV();
      toast.success("Export CSV terminé");
    } catch (error) {
      toast.error("Erreur lors de l'export CSV");
    }
  };

  const handleProgramChange = (index, value) => {
    const newProgram = [...formData.program];
    newProgram[index] = value;
    setFormData({ ...formData, program: newProgram });
  };

  const addProgramLine = () => {
    setFormData({ ...formData, program: [...formData.program, ""] });
  };

  const removeProgramLine = (index) => {
    const newProgram = formData.program.filter((_, i) => i !== index);
    setFormData({ ...formData, program: newProgram.length > 0 ? newProgram : [""] });
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

  // Afficher l'erreur API ou l'erreur du hook
  const displayError = apiError || error;

  if (!dataLoaded && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#556B2F] mb-4" />
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#556B2F] mb-2">
          Gestion des Formations
        </h1>
        <p className="text-gray-600">
          Gérez vos offres de formation, suivez les inscriptions et les statistiques
        </p>
      </div>

      {/* Error message */}
      {displayError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{displayError}</p>
          {displayError.includes('authentifié') && (
            <Button 
              onClick={() => navigate('/login')}
              className="mt-2"
              variant="destructive"
            >
              Se reconnecter
            </Button>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Formations</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats?.total || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-[#6B8E23]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats?.active || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Candidatures</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats?.applications || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats?.participants || 0}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une formation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
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
                  setEditingFormation(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410]">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle formation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingFormation ? 'Modifier la formation' : 'Nouvelle formation'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingFormation 
                        ? 'Modifiez les informations de votre formation'
                        : 'Créez une nouvelle offre de formation'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Titre de la formation *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Catégorie *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({...formData, category: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="format">Format *</Label>
                          <Select
                            value={formData.format}
                            onValueChange={(value) => setFormData({...formData, format: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un format" />
                            </SelectTrigger>
                            <SelectContent>
                              {formats.map((format) => (
                                <SelectItem key={format} value={format}>{format}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Durée *</Label>
                          <Input
                            id="duration"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            placeholder="Ex: 3 jours, 40h..."
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Prix (€) *</Label>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxParticipants">Nombre maximum de participants *</Label>
                          <Input
                            id="maxParticipants"
                            type="number"
                            min="1"
                            value={formData.maxParticipants}
                            onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value) || 1})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Date de début *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Date de fin (optionnel)</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Lieu / Adresse *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Adresse complète ou lien pour formation en ligne"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="requirements">Pré-requis</Label>
                        <Textarea
                          id="requirements"
                          value={formData.requirements}
                          onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                          placeholder="Compétences ou connaissances requises..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Programme de la formation</Label>
                        {formData.program.map((line, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              value={line}
                              onChange={(e) => handleProgramChange(index, e.target.value)}
                              placeholder={`Étape ${index + 1} du programme`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeProgramLine(index)}
                              disabled={formData.program.length === 1}
                            >
                              Supprimer
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addProgramLine}
                        >
                          Ajouter une ligne au programme
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="certification">Certification (optionnel)</Label>
                        <Input
                          id="certification"
                          value={formData.certification}
                          onChange={(e) => setFormData({...formData, certification: e.target.value})}
                          placeholder="Nom de la certification délivrée"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isCertified"
                            checked={formData.isCertified}
                            onCheckedChange={(checked) => setFormData({...formData, isCertified: checked})}
                          />
                          <Label htmlFor="isCertified">Formation certifiée</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isFinanced"
                            checked={formData.isFinanced}
                            onCheckedChange={(checked) => setFormData({...formData, isFinanced: checked})}
                          />
                          <Label htmlFor="isFinanced">Financement possible</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isOnline"
                            checked={formData.isOnline}
                            onCheckedChange={(checked) => setFormData({...formData, isOnline: checked})}
                          />
                          <Label htmlFor="isOnline">Formation en ligne</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Statut *</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({...formData, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingFormation(null);
                          resetForm();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-[#556B2F] hover:bg-[#6B8E23]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingFormation ? 'Mettre à jour' : 'Créer'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des formations</CardTitle>
          <CardDescription>
            {formations?.length || 0} formation{(formations?.length || 0) !== 1 ? 's' : ''} trouvée{(formations?.length || 0) !== 1 ? 's' : ''}
            {pagination?.total > 0 && ` (${pagination.total} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !dataLoaded ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#556B2F] mb-4" />
              <p>Chargement des formations...</p>
            </div>
          ) : !formations || formations.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? "Aucune formation ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore créé de formations."
                }
              </p>
              <Button 
                className="bg-[#8B4513] hover:bg-[#6B3410]"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer votre première formation
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date début</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formations.map((formation) => {
                      const status = statuses.find(s => s.value === formation.status);
                      return (
                        <TableRow key={formation.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-semibold">{formation.title}</div>
                                {formation.isCertified && (
                                  <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <Award className="h-3 w-3" /> Certifiée
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formation.category}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{formation.format}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formation.duration}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formation.price}€
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span>
                                {formation.currentParticipants || 0}/{formation.maxParticipants}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({formation.applications_count || 0} candidatures)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${status?.color || 'bg-gray-100 text-gray-800'}`}>
                              {status?.label || formation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formation.startDate ? new Date(formation.startDate).toLocaleDateString('fr-FR') : '-'}
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
                                <DropdownMenuItem onClick={() => handleEdit(formation)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openCandidaturesModal(formation)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir candidatures ({formation.applications_count || 0})
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {formation.status !== 'active' ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(formation.id, 'active')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activer
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(formation.id, 'archived')}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Archiver
                                  </DropdownMenuItem>
                                )}
                                {formation.status === 'completed' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(formation.id, 'draft')}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Remettre en brouillon
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(formation.id)}
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
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal des candidatures */}
      <Dialog open={candidaturesModalOpen} onOpenChange={setCandidaturesModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Candidatures pour : {selectedFormation?.title}
            </DialogTitle>
            <DialogDescription>
              Gérez les candidatures pour cette formation
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

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">Toutes ({candidatureStats.total})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({candidatureStats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({candidatureStats.accepted})</TabsTrigger>
              <TabsTrigger value="rejected">Refusées ({candidatureStats.rejected})</TabsTrigger>
            </TabsList>

            {loadingCandidatures ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Chargement des candidatures...</p>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="mt-4">
                  <CandidaturesTable 
                    candidatures={candidatures}
                    onUpdateStatus={updateCandidatureStatus}
                    onDownloadCV={downloadCV}
                  />
                </TabsContent>
                
                <TabsContent value="pending" className="mt-4">
                  <CandidaturesTable 
                    candidatures={candidatures.filter(c => c.status === 'pending')}
                    onUpdateStatus={updateCandidatureStatus}
                    onDownloadCV={downloadCV}
                  />
                </TabsContent>
                
                <TabsContent value="accepted" className="mt-4">
                  <CandidaturesTable 
                    candidatures={candidatures.filter(c => c.status === 'accepted')}
                    onUpdateStatus={updateCandidatureStatus}
                    onDownloadCV={downloadCV}
                  />
                </TabsContent>
                
                <TabsContent value="rejected" className="mt-4">
                  <CandidaturesTable 
                    candidatures={candidatures.filter(c => c.status === 'rejected')}
                    onUpdateStatus={updateCandidatureStatus}
                    onDownloadCV={downloadCV}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant pour afficher le tableau des candidatures
function CandidaturesTable({ candidatures, onUpdateStatus, onDownloadCV }) {
  if (candidatures.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Aucune candidature trouvée</p>
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
            const age = candidature.dateNaissance 
              ? new Date().getFullYear() - new Date(candidature.dateNaissance).getFullYear()
              : null;
            
            return (
              <TableRow key={candidature.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div>{candidature.prenom} {candidature.nom}</div>
                      {age && (
                        <div className="text-xs text-gray-500">
                          {age} ans
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
                      {new Date(candidature.createdAt).toLocaleDateString('fr-FR')}
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
                      onClick={() => onDownloadCV(candidature.id, `CV_${candidature.nom}_${candidature.prenom}.pdf`)}
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
                      <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                      {candidature.status !== 'accepted' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(candidature.id, 'accepted')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Accepter
                        </DropdownMenuItem>
                      )}
                      {candidature.status !== 'rejected' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(candidature.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-2 text-red-600" />
                          Refuser
                        </DropdownMenuItem>
                      )}
                      {candidature.status !== 'pending' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(candidature.id, 'pending')}
                        >
                          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                          Remettre en attente
                        </DropdownMenuItem>
                      )}
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