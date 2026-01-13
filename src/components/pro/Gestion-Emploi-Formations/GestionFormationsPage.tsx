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

// Mettez à jour candidatureStatuses pour correspondre à votre BD
const candidatureStatuses = [
  { value: "en_attente", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "pending", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "acceptée", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "accepted", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "refusée", label: "Refusée", color: "bg-red-100 text-red-800" },
  { value: "rejected", label: "Refusée", color: "bg-red-100 text-red-800" },
];

export default function GestionFormationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

    const [pageLoading, setPageLoading] = useState(true);
  
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
 // Dans GestionFormationsPage.js ou useFormation.js
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth-token') || 
                localStorage.getItem('token') || 
                localStorage.getItem('jwt-token');

  
  if (!token) {
    console.error('Token non trouvé');
    throw new Error('Session expirée. Veuillez vous reconnecter.');
  }
  
  // Retourner un objet avec les headers corrects
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};



// Testez quel token fonctionne
const tokens = [
  localStorage.getItem('auth-token'),
  localStorage.getItem('token'),
  localStorage.getItem('jwt-token')
];

for (const token of tokens) {
  if (token) {
    // console.log(`\n🧪 Test avec token: ${token.substring(0, 20)}...`);
    
    // Vérifiez le format
    if (token.startsWith('real-jwt-token-')) {
      // console.log('✅ Format correct!');
    }
  }
}

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
   // Load data on mount - UN SEUL CHARGEMENT
  useEffect(() => {
    const loadInitialData = async () => {
      // Si pas encore connecté, attendre
      if (authLoading) return;
      
      // Si pas d'utilisateur, rediriger
      if (!user) {
        navigate('/login');
        return;
      }

      // Si pas le bon rôle, rediriger
      if (user.role !== 'professional' && user.role !== 'admin') {
        navigate('/unauthorized');
        return;
      }

      try {
        setPageLoading(true);
        
        // Vérifier le token
        const token = localStorage.getItem('auth-token') || 
                      localStorage.getItem('token') || 
                      localStorage.getItem('jwt-token');
        
        if (!token) {
          setApiError('Veuillez vous connecter');
          navigate('/login');
          return;
        }
        
        // console.log('🚀 Début du chargement des données...');
        
        // Charger les stats ET les formations en parallèle
        await Promise.all([
          fetchStats(),
          fetchFormations({
            search: debouncedSearch,
            status: statusFilter,
            category: categoryFilter,
            page: 1
          })
        ]);
        
        // console.log('✅ Données chargées avec succès');
        setDataLoaded(true);
        setApiError("");
        
      } catch (err) {
        console.error("❌ Erreur lors du chargement:", err);
        setApiError(err.message || "Erreur lors du chargement des données");
        
        if (err.message.includes('authentification') || err.message.includes('Session')) {
          setTimeout(() => navigate('/login'), 1500);
        }
      } finally {
        setPageLoading(false);
      }
    };

    loadInitialData();
  }, [authLoading, user, navigate]); // Seulement ces dépendances
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
// Fonction pour ouvrir le modal des candidatures
// Fonction pour ouvrir le modal des candidatures
const openCandidaturesModal = async (formation) => {
  setSelectedFormation(formation);
  setCandidaturesModalOpen(true);
  setLoadingCandidatures(true);
  
  try {
    const token = localStorage.getItem('auth-token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('jwt-token');
    
  
    if (!token) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
      return;
    }
    
    // Utiliser l'API réelle pour récupérer les candidatures
    const response = await axios.get(
      `${API_URL}/candidatures/formations/${formation.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    

    
    if (response.data.success) {
      const apiCandidatures = response.data.data || [];
      

      
      if (apiCandidatures.length === 0) {
        toast.info('Aucune candidature pour cette formation');
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
            telephone: candidature.telephoneCandidat || '',
            motivation: candidature.messageMotivation || '',
            cvPath: candidature.cvUrl || null,
            lettreMotivationUrl: candidature.lettreMotivationUrl || null,
            status: candidature.statut || 'en_attente', // Note: votre BD utilise 'statut' avec un 't'
            createdAt: candidature.appliedAt || candidature.createdAt,
            dateNaissance: null,
            // Autres champs possibles
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
        
        // console.log('📈 Stats calculées:', stats);
      }
    }
  } catch (error) {
    console.error('❌ Erreur chargement candidatures:', error);
    console.error('❌ Détails erreur:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 404) {
      toast.info('Aucune candidature trouvée pour cette formation');
      setCandidatures([]);
    } else if (error.response?.status === 401) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
    } else {
      toast.error(`Erreur ${error.response?.status || ''}: ${error.response?.data?.error || 'Erreur serveur'}`);
    }
  } finally {
    setLoadingCandidatures(false);
  }
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
    const token = localStorage.getItem('auth-token');
    
    // Assurez-vous d'envoyer le bon format de statut
    let statusToSend = newStatus;
    
    // Convertir si nécessaire
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
      // Mettre à jour localement
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
    console.error('Détails:', error.response?.data);
    toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
  }
};

 // Fonction pour télécharger un CV - VERSION CORRIGÉE
 const downloadCV = async (candidatureId, fileName, cvUrl) => {
   try {
    //  console.log('📥 Téléchargement CV - URL originale:', cvUrl);
     
     if (!cvUrl) {
       toast.error('Aucun CV disponible pour ce candidat');
       return;
     }
     
     // Détecter le type d'URL
     const isBlobUrl = cvUrl.startsWith('blob:');
     const isDataUrl = cvUrl.startsWith('data:');
     const isHttpUrl = cvUrl.startsWith('http://') || cvUrl.startsWith('https://');
     const isRelativeUrl = cvUrl.startsWith('/');
     
   
     
     let finalUrl = cvUrl;
     let shouldOpenInNewTab = false;
     
     // Traitement selon le type d'URL
     if (isBlobUrl) {
       // URL Blob : utiliser directement
      //  console.log('📄 Utilisation URL Blob');
       shouldOpenInNewTab = true;
       // Pour les URLs Blob, on ne peut pas ajouter de query params
       // On utilise l'URL telle quelle
     }
     else if (isDataUrl) {
       // URL Data (base64) : convertir en blob
      //  console.log('📄 Utilisation URL Data (base64)');
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
      //  console.log('📄 Utilisation URL HTTP complète');
       const separator = finalUrl.includes('?') ? '&' : '?';
       finalUrl = `${finalUrl}${separator}t=${Date.now()}`;
       shouldOpenInNewTab = true;
     }
     else if (isRelativeUrl) {
       // URL relative : ajouter la base du serveur
      //  console.log('📄 Utilisation URL relative');
       // Nettoyer le chemin (enlever le /api/ s'il est déjà présent)
       let cleanPath = cvUrl;
       if (cvUrl.startsWith('/api/')) {
         cleanPath = cvUrl.substring(5); // Enlever '/api/'
       }
       finalUrl = `${API_URL}/${cleanPath}?t=${Date.now()}`;
     }
     else {
       // Autre cas : traiter comme un chemin de fichier
      //  console.log('📄 Traitement comme chemin de fichier');
       finalUrl = `${API_URL}/${cvUrl}?t=${Date.now()}`;
     }
     
    //  console.log('🔗 URL finale pour téléchargement:', finalUrl);
     
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

  // Fonction pour supprimer une candidature
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
      if (selectedFormation) {
        await openCandidaturesModal(selectedFormation); // CHANGEZ CETTE LIGNE
      }
    }
  } catch (error) {
    console.error('❌ Erreur suppression candidature:', error);
    toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
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
    
    // console.log('🔍 DEBUG - Données du formulaire:', formData);
    
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
      
      // console.log('📤 DEBUG - Données formatées pour API:', apiData);
      
      if (editingFormation) {
        // console.log(`🔄 Mise à jour formation ${editingFormation.id}`);
        await updateFormation(editingFormation.id, apiData);
        toast.success("Formation mise à jour avec succès");
      } else {
        // console.log('🆕 Création nouvelle formation');
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
                                  Voir candidatures 
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
            {/* <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">Toutes ({candidatureStats.total})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({candidatureStats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({candidatureStats.accepted})</TabsTrigger>
              <TabsTrigger value="rejected">Refusées ({candidatureStats.rejected})</TabsTrigger>
            </TabsList> */}

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
                    candidatures={candidatures.filter(c => c.status === 'pending')}
                    onUpdateStatus={updateCandidatureStatus}
                    onDownloadCV={downloadCV}
                    onDelete={deleteCandidature}
                  />
                </TabsContent>
                
                <TabsContent value="accepted" className="mt-4">
                  <CandidaturesTable 
                    candidatures={candidatures.filter(c => c.status === 'accepted')}
                    onUpdateStatus={updateCandidatureStatus}
                    onDownloadCV={downloadCV}
                    onDelete={deleteCandidature}
                  />
                </TabsContent>
                
                <TabsContent value="rejected" className="mt-4">
                  <CandidaturesTable 
                    candidatures={candidatures.filter(c => c.status === 'rejected')}
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

// Composant pour afficher le tableau des candidatures
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