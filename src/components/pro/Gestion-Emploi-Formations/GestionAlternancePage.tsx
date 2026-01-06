// GestionAlternancePage.js - CORRECTIONS IMPORTANTES
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
} from "lucide-react";
// Ajoutez ces imports en plus des existants
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  User,
  CalendarDays,
} from "lucide-react";
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Ajoutez après vos statuts existants
const candidatureStatuses = [
  { value: "en_attente", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "pending", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "acceptée", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "accepted", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "refusée", label: "Refusée", color: "bg-red-100 text-red-800" },
  { value: "rejected", label: "Refusée", color: "bg-red-100 text-red-800" },
];

// Composant pour afficher le tableau des candidatures
function CandidaturesTable({ candidatures, onUpdateStatus, onDownloadCV, onDelete }) {
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
            
            return (
              <TableRow key={candidature.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div>{candidature.prenom} {candidature.nom}</div>
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

export default function GestionAlternancePage() {
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
    changePage,  
    checkAuthStatus, // <-- AJOUTEZ CELUI-CI
  isAuthenticated, // <-- AJOUTEZ CELUI-CI SI BESOIN
  user, // <-- AJOUTEZ CELUI-CI SI BESOIN
  authLoading // <-- AJOUTEZ CELUI-CI SI BESOIN
  } = useAlternance();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffre, setEditingOffre] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Form state - CORRECTION: Ajouter le niveauFilter
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

  // Après vos autres états
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
        niveau: 'all', // Ajouter si vous avez un filtre niveau
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
    console.log(`📤 Tentative pour offre ID: ${offre.id}`);
    
    if (!token) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      setLoadingCandidatures(false);
      return;
    }
    
    console.log('🔄 Appel API vers:', `${API_URL}/alternance/${offre.id}/candidatures`);
    
    // Utilisez la route qui fonctionne
    const response = await axios.get(
      `${API_URL}/alternance/${offre.id}/candidatures`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Réponse API:', response.data);
    console.log('Structure de la réponse:', {
      keys: Object.keys(response.data),
      hasData: 'data' in response.data,
      dataType: typeof response.data.data,
      isArray: Array.isArray(response.data.data)
    });
    
    // GESTION DES DIFFÉRENTS FORMATS DE RÉPONSE
    let apiCandidatures = [];
    
    if (response.data.success) {
      // Format 1: response.data.data (le plus courant)
      if (response.data.data && Array.isArray(response.data.data)) {
        apiCandidatures = response.data.data;
      }
      // Format 2: response.data.candidatures
      else if (response.data.candidatures && Array.isArray(response.data.candidatures)) {
        apiCandidatures = response.data.candidatures;
      }
      // Format 3: response.data (directement un tableau)
      else if (Array.isArray(response.data)) {
        apiCandidatures = response.data;
      }
      // Format 4: response.data est un objet avec propriétés
      else if (response.data.data && typeof response.data.data === 'object') {
        // Essayons d'extraire les candidatures d'un objet
        const dataObj = response.data.data;
        if (dataObj.candidatures && Array.isArray(dataObj.candidatures)) {
          apiCandidatures = dataObj.candidatures;
        } else {
          // Convertir l'objet en tableau si nécessaire
          apiCandidatures = Object.values(dataObj).filter(item => 
            item && typeof item === 'object' && (item.nomCandidat || item.email)
          );
        }
      }
    } else {
      // Si success: false mais qu'il y a des données
      console.warn('API retourne success: false mais continue le traitement');
      if (Array.isArray(response.data)) {
        apiCandidatures = response.data;
      }
    }
    
    console.log(`📝 ${apiCandidatures.length} candidatures extraites`);
    
    // Afficher un échantillon pour debugging
    if (apiCandidatures.length > 0) {
      console.log('Échantillon de candidatures:', apiCandidatures.slice(0, 2));
    } else {
      console.log('Structure complète de la réponse:', JSON.stringify(response.data, null, 2));
    }
    
    if (apiCandidatures.length === 0) {
      toast.info('Aucune candidature pour cette offre d\'alternance/stage');
      setCandidatures([]);
    } else {
      // Transformer les données de l'API
      const formattedCandidatures = apiCandidatures.map((candidature, index) => {
        // Debug: Afficher la structure de chaque candidature
        console.log(`Candidature ${index}:`, candidature);
        
        // Extraire nom et prénom
        let nom = '';
        let prenom = '';
        const nomComplet = candidature.nomCandidat || 
                          candidature.nom || 
                          (candidature.user ? `${candidature.user.prenom || ''} ${candidature.user.nom || ''}`.trim() : '');
        
        if (nomComplet && nomComplet.trim() !== '') {
          const nameParts = nomComplet.trim().split(' ');
          if (nameParts.length > 1) {
            nom = nameParts[nameParts.length - 1];
            prenom = nameParts.slice(0, -1).join(' ');
          } else {
            prenom = nameParts[0];
          }
        }
        
        // Extraire email
        const email = candidature.emailCandidat || 
                     candidature.email || 
                     (candidature.user ? candidature.user.email : '');
        
        // Extraire téléphone
        const telephone = candidature.telCandidat || 
                         candidature.telephone || 
                         (candidature.user ? candidature.user.phone : '');
        
        return {
          id: candidature.id || index,
          nom: nom,
          prenom: prenom,
          nomComplet: nomComplet,
          email: email,
          telephone: telephone,
          motivation: candidature.messageMotivation || candidature.motivation || '',
          cvPath: candidature.cvUrl || candidature.cvPath || null,
          lettreMotivationUrl: candidature.lettreMotivationUrl || null,
          status: candidature.statut || candidature.status || 'en_attente',
          createdAt: candidature.appliedAt || candidature.createdAt || new Date(),
          updatedAt: candidature.updatedAt || new Date(),
          offreId: candidature.alternanceStageId || candidature.offreId || offre.id,
          offreType: candidature.offreType || 'ALTERNANCE',
          niveauEtude: candidature.niveauEtude || '',
          ecole: candidature.ecole || ''
        };
      });
      
      console.log(`✅ ${formattedCandidatures.length} candidatures formatées`);
      
      setCandidatures(formattedCandidatures);
      
      // Calculer les statistiques
      const stats = {
        total: formattedCandidatures.length,
        pending: formattedCandidatures.filter(c => 
          c.status === 'en_attente' || c.status === 'pending'
        ).length,
        accepted: formattedCandidatures.filter(c => 
          c.status === 'acceptée' || c.status === 'accepted'
        ).length,
        rejected: formattedCandidatures.filter(c => 
          c.status === 'refusée' || c.status === 'rejected'
        ).length
      };
      setCandidatureStats(stats);
      
      console.log('📊 Statistiques calculées:', stats);
    }
    
  } catch (error) {
    console.error('❌ Erreur chargement candidatures alternance:', error);
    
    // Afficher des informations détaillées
    console.error('🔍 Détails erreur:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message
    });
    
    if (error.response?.status === 404) {
      toast.info('Aucune candidature trouvée pour cette offre');
      setCandidatures([]);
    } else {
      toast.error(`Erreur ${error.response?.status || ''}: ${error.response?.data?.error || 'Erreur serveur'}`);
    }
  } finally {
    setLoadingCandidatures(false);
  }
};

// Fonction pour mettre à jour le statut d'une candidature
const updateCandidatureStatus = async (candidatureId, newStatus) => {
  try {
    const token = localStorage.getItem('auth-token');
    
    let statusToSend = newStatus;
    if (newStatus === 'acceptée') statusToSend = 'acceptée';
    else if (newStatus === 'accepted') statusToSend = 'acceptée';
    else if (newStatus === 'refusée') statusToSend = 'refusée';
    else if (newStatus === 'rejected') statusToSend = 'refusée';
    else if (newStatus === 'en_attente') statusToSend = 'en_attente';
    else if (newStatus === 'pending') statusToSend = 'en_attente';
    
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
      setCandidatures(prev => 
        prev.map(candidature => 
          candidature.id === candidatureId 
            ? { ...candidature, status: statusToSend }
            : candidature
        )
      );
      
      toast.success('Statut mis à jour avec succès');
      
      // Recalculer les stats
      const updatedCandidatures = candidatures.map(c => 
        c.id === candidatureId ? { ...c, status: statusToSend } : c
      );
      
      const stats = {
        total: updatedCandidatures.length,
        pending: updatedCandidatures.filter(c => c.status === 'en_attente' || c.status === 'pending').length,
        accepted: updatedCandidatures.filter(c => c.status === 'acceptée' || c.status === 'accepted').length,
        rejected: updatedCandidatures.filter(c => c.status === 'refusée' || c.status === 'rejected').length
      };
      setCandidatureStats(stats);
    }
  } catch (error) {
    console.error('❌ Erreur mise à jour statut:', error);
    toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
  }
};

// Fonction pour télécharger un CV - VERSION CORRIGÉE
const downloadCV = async (candidatureId, fileName, cvUrl) => {
  try {
    console.log('📥 Téléchargement CV - URL originale:', cvUrl);
    
    if (!cvUrl) {
      toast.error('Aucun CV disponible pour ce candidat');
      return;
    }
    
    // Détecter le type d'URL
    const isBlobUrl = cvUrl.startsWith('blob:');
    const isDataUrl = cvUrl.startsWith('data:');
    const isHttpUrl = cvUrl.startsWith('http://') || cvUrl.startsWith('https://');
    const isRelativeUrl = cvUrl.startsWith('/');
    
    console.log('🔍 Type d\'URL détecté:', {
      isBlobUrl,
      isDataUrl,
      isHttpUrl,
      isRelativeUrl,
      cvUrl
    });
    
    let finalUrl = cvUrl;
    let shouldOpenInNewTab = false;
    
    // Traitement selon le type d'URL
    if (isBlobUrl) {
      // URL Blob : utiliser directement
      console.log('📄 Utilisation URL Blob');
      shouldOpenInNewTab = true;
      // Pour les URLs Blob, on ne peut pas ajouter de query params
      // On utilise l'URL telle quelle
    }
    else if (isDataUrl) {
      // URL Data (base64) : convertir en blob
      console.log('📄 Utilisation URL Data (base64)');
      try {
        // Extraire le contenu base64
        const base64Content = cvUrl.split(',')[1];
        const mimeType = cvUrl.match(/data:(.*);base64/)?.[1] || 'application/pdf';
        
        // Convertir en blob
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        
        // Créer une URL Blob
        finalUrl = URL.createObjectURL(blob);
        shouldOpenInNewTab = true;
      } catch (error) {
        console.error('Erreur conversion base64:', error);
        throw new Error('Format de données invalide');
      }
    }
    else if (isHttpUrl) {
      // URL HTTP complète : ajouter timestamp pour éviter le cache
      console.log('📄 Utilisation URL HTTP complète');
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl = `${finalUrl}${separator}t=${Date.now()}`;
      shouldOpenInNewTab = true;
    }
    else if (isRelativeUrl) {
      // URL relative : ajouter la base du serveur
      console.log('📄 Utilisation URL relative');
      // Nettoyer le chemin (enlever le /api/ s'il est déjà présent)
      let cleanPath = cvUrl;
      if (cvUrl.startsWith('/api/')) {
        cleanPath = cvUrl.substring(5); // Enlever '/api/'
      }
      finalUrl = `${API_URL}/${cleanPath}?t=${Date.now()}`;
    }
    else {
      // Autre cas : traiter comme un chemin de fichier
      console.log('📄 Traitement comme chemin de fichier');
      finalUrl = `${API_URL}/${cvUrl}?t=${Date.now()}`;
    }
    
    console.log('🔗 URL finale pour téléchargement:', finalUrl);
    
    // Créer un nom de fichier par défaut
    const finalFileName = fileName || 'cv_candidat.pdf';
    
    // Créer un élément de lien
    const link = document.createElement('a');
    
    if (isBlobUrl || isDataUrl) {
      // Pour les URLs Blob/Data, on ne peut pas utiliser "download" facilement
      // Ouvrir dans un nouvel onglet
      link.href = finalUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Pour les PDF, ajouter un attribut pour l'ouverture
      if (finalUrl.includes('.pdf') || finalFileName.endsWith('.pdf')) {
        link.setAttribute('type', 'application/pdf');
      }
    } else {
      // Pour les URLs normales, utiliser l'attribut download
      link.href = finalUrl;
      link.download = finalFileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    
    // Ajouter des headers d'authentification si nécessaire (pour les URLs HTTP)
    if (!isBlobUrl && !isDataUrl) {
      const token = localStorage.getItem('auth-token');
      if (token) {
        // Note: Pour les liens simples, on ne peut pas ajouter des headers
        // Mais on peut passer le token dans l'URL si le backend le supporte
        const hasQuery = finalUrl.includes('?');
        link.href = `${finalUrl}${hasQuery ? '&' : '?'}token=${encodeURIComponent(token)}`;
      }
    }
    
    // Style caché
    link.style.display = 'none';
    link.style.position = 'absolute';
    link.style.left = '-9999px';
    
    // Ajouter au DOM
    document.body.appendChild(link);
    
    // Déclencher le clic
    link.click();
    
    // Nettoyer après un délai
    setTimeout(() => {
      if (link.parentNode) {
        document.body.removeChild(link);
      }
      
      // Révoquer les URLs Blob pour libérer la mémoire
      if (isBlobUrl || (isDataUrl && finalUrl.startsWith('blob:'))) {
        try {
          URL.revokeObjectURL(finalUrl);
        } catch (e) {
          console.warn('Impossible de révoquer l\'URL blob:', e);
        }
      }
    }, 100);
    
    toast.success('CV en cours de téléchargement...');
    
  } catch (error) {
    console.error('❌ Erreur téléchargement CV:', error);
    
    // Messages d'erreur spécifiques
    let errorMessage = 'Erreur lors du téléchargement du CV';
    
    if (error.message.includes('Network Error')) {
      errorMessage = 'Erreur de réseau. Vérifiez votre connexion.';
    } else if (error.message.includes('404')) {
      errorMessage = 'Fichier non trouvé sur le serveur.';
    } else if (error.message.includes('403')) {
      errorMessage = 'Accès interdit. Vérifiez vos permissions.';
    } else if (error.message.includes('Invalid')) {
      errorMessage = 'Format de fichier invalide.';
    }
    
    toast.error(errorMessage);
    
    // Fallback: ouvrir l'URL originale dans un nouvel onglet
    if (cvUrl) {
      try {
        window.open(cvUrl, '_blank');
        toast.info('Ouverture du CV dans un nouvel onglet...');
      } catch (fallbackError) {
        console.error('Fallback aussi échoué:', fallbackError);
      }
    }
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
    }
  } catch (error) {
    console.error('❌ Erreur suppression candidature:', error);
    toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
  }
};

  // Ensuite, modifiez votre handleSubmit :
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Vérifier l'authentification avant de soumettre
  console.log('🔐 Auth status before submit:', {
    checkAuthStatus: checkAuthStatus ? 'Function exists' : 'Function missing',
    isAuthenticated,
    user: user?.id,
    authLoading
  });

  // Utilisez checkAuthStatus si disponible, sinon vérifiez manuellement
  const authStatus = checkAuthStatus ? checkAuthStatus() : {
    isAuthenticated,
    hasToken: !!user?.token, // ou votre logique de token
    userId: user?.id,
    authLoading,
    isReady: isAuthenticated && !authLoading
  };
  
  console.log('📋 Auth details:', authStatus);

    // Vérifier l'authentification
  
  console.log('🔐 Auth status in handleSubmit:', authStatus);
  
  
  if (!authStatus.isReady) {
    if (authLoading) {
      toast.error('Veuillez patienter, authentification en cours...');
    } else if (!authStatus.isAuthenticated) {
      toast.error('Veuillez vous connecter pour créer/modifier une offre');
    } else if (!authStatus.hasToken) {
      toast.error('Session expirée, veuillez vous reconnecter');
    }
    return;
  }

  try {
    // Convertir les tableaux si nécessaire
    const missionsArray = Array.isArray(formData.missions) ? formData.missions : 
                         (formData.missions ? [formData.missions] : []);
    const competencesArray = Array.isArray(formData.competences) ? formData.competences : 
                           (formData.competences ? [formData.competences] : []);
    const avantagesArray = Array.isArray(formData.avantages) ? formData.avantages : 
                         (formData.avantages ? [formData.avantages] : []);

    // Préparer les données pour l'API
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

    console.log('📤 Submitting data with auth:', {
      user: user?.id,
      tokenPresent: !!user?.token,
      data: apiData
    });

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
    
    // Afficher un message d'erreur plus utile
    if (error.message.includes('Non authentifié')) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      // Vous pourriez vouloir rediriger vers la page de login ici
    } else if (error.message.includes('401')) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
    } else {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
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

 // GestionAlternancePage.js - CORRECTION des statistiques
const handleExportCSV = async () => {
  try {
    toast.info("Export CSV en cours...");
    await exportCSV();
    // Le toast de succès est géré dans la fonction exportCSV
  } catch (error) {
    console.error('Export CSV error:', error);
    
    // Afficher un message d'erreur plus spécifique
    let errorMessage = "Erreur lors de l'export CSV";
    
    if (error.message.includes('Session expirée')) {
      errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
      // Optionnel: rediriger vers la page de login
      // router.push('/login');
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

      {/* Stats Cards - CORRECTION: Utiliser stats.parType */}
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

      {/* Rest of the component remains the same as in your previous code */}
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
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Intitulé du poste *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            placeholder="ex: Développeur Web en Alternance"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type d'offre *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({...formData, type: value})}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="niveauEtude">Niveau d'étude requis *</Label>
          <Select
            value={formData.niveauEtude}
            onValueChange={(value) => setFormData({...formData, niveauEtude: value})}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              {niveauxEtude.map((niveau) => (
                <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duree">Durée *</Label>
          <Input
            id="duree"
            value={formData.duree}
            onChange={(e) => setFormData({...formData, duree: e.target.value})}
            placeholder="ex: 12 mois, 24 mois, 6 mois"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="remuneration">Rémunération *</Label>
          <Input
            id="remuneration"
            value={formData.remuneration}
            onChange={(e) => setFormData({...formData, remuneration: e.target.value})}
            placeholder="ex: 70-85% SMIC, 1200€/mois"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Lieu de travail *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="ex: Paris (75), Lyon (69), Télétravail"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateDebut">Date de début *</Label>
          <Input
            id="dateDebut"
            type="date"
            value={formData.dateDebut}
            onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateFin">Date de fin (optionnel)</Label>
          <Input
            id="dateFin"
            type="date"
            value={formData.dateFin}
            onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description du poste *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          placeholder="Décrivez les missions principales, le contexte de l'entreprise..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ecolePartenaire">École/CFA partenaire (optionnel)</Label>
          <Input
            id="ecolePartenaire"
            value={formData.ecolePartenaire}
            onChange={(e) => setFormData({...formData, ecolePartenaire: e.target.value})}
            placeholder="ex: École 42, Université Paris-Saclay"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rythmeAlternance">Rythme alternance (optionnel)</Label>
          <Input
            id="rythmeAlternance"
            value={formData.rythmeAlternance}
            onChange={(e) => setFormData({...formData, rythmeAlternance: e.target.value})}
            placeholder="ex: 3 semaines entreprise / 1 semaine école"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pourcentageTemps">% Temps entreprise</Label>
          <Select
            value={formData.pourcentageTemps}
            onValueChange={(value) => setFormData({...formData, pourcentageTemps: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60%">60%</SelectItem>
              <SelectItem value="70%">70%</SelectItem>
              <SelectItem value="80%">80%</SelectItem>
              <SelectItem value="100%">100% (stage)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="urgent"
            checked={formData.urgent}
            onCheckedChange={(checked) => setFormData({...formData, urgent: checked})}
          />
          <Label htmlFor="urgent" className="cursor-pointer">Offre urgente</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({...formData, status: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="missions">Missions principales</Label>
          <Textarea
            id="missions"
            value={formData.missions.join('\n')}
            onChange={(e) => setFormData({...formData, missions: e.target.value.split('\n')})}
            rows={3}
            placeholder="Une mission par ligne
• Développer des applications web
• Participer aux réunions d'équipe
• Rédiger de la documentation"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="competences">Compétences recherchées</Label>
          <Textarea
            id="competences"
            value={formData.competences.join('\n')}
            onChange={(e) => setFormData({...formData, competences: e.target.value.split('\n')})}
            rows={3}
            placeholder="Une compétence par ligne
• React/Next.js
• Node.js
• Git
• Base de données"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avantages">Avantages proposés</Label>
        <Textarea
          id="avantages"
          value={formData.avantages.join('\n')}
          onChange={(e) => setFormData({...formData, avantages: e.target.value.split('\n')})}
          rows={2}
          placeholder="Un avantage par ligne
• Tickets restaurant
• Mutuelle
• Télétravail possible
• Équipement fourni"
        />
      </div>
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

      {/* Modal des candidatures */}
<Dialog open={candidaturesModalOpen} onOpenChange={setCandidaturesModalOpen}>
  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>
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
              onDelete={deleteCandidature}
            />
          </TabsContent>
          
          <TabsContent value="pending" className="mt-4">
            <CandidaturesTable 
              candidatures={candidatures.filter(c => c.status === 'en_attente' || c.status === 'pending')}
              onUpdateStatus={updateCandidatureStatus}
              onDownloadCV={downloadCV}
              onDelete={deleteCandidature}
            />
          </TabsContent>
          
          <TabsContent value="accepted" className="mt-4">
            <CandidaturesTable 
              candidatures={candidatures.filter(c => c.status === 'acceptée' || c.status === 'accepted')}
              onUpdateStatus={updateCandidatureStatus}
              onDownloadCV={downloadCV}
              onDelete={deleteCandidature}
            />
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-4">
            <CandidaturesTable 
              candidatures={candidatures.filter(c => c.status === 'refusée' || c.status === 'rejected')}
              onUpdateStatus={updateCandidatureStatus}
              onDownloadCV={downloadCV}
              onDelete={deleteCandidature}
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