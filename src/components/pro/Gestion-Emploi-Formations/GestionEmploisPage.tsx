import { useState, useEffect, useCallback } from "react";
import { useEmploi } from "@/hooks/useEmploi";
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
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  Loader2,
  Home,
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

export default function GestionEmploisPage() {
  const {
    emplois,
    isLoading,
    error,
    stats,
    pagination,
    fetchEmplois,
    fetchStats,
    createEmploi,
    updateEmploi,
    deleteEmploi,
    updateStatus,
    exportCSV,
    changePage
  } = useEmploi();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [secteurFilter, setSecteurFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmploi, setEditingEmploi] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Après les autres états existants
const [candidaturesModalOpen, setCandidaturesModalOpen] = useState(false);
const [selectedEmploi, setSelectedEmploi] = useState(null);
const [candidatures, setCandidatures] = useState([]);
const [loadingCandidatures, setLoadingCandidatures] = useState(false);
const [candidatureStats, setCandidatureStats] = useState({
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0
});

// Mettez à jour candidatureStatuses pour correspondre à votre BD
const candidatureStatuses = [
  { value: "en_attente", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "pending", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "acceptée", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "accepted", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "refusée", label: "Refusée", color: "bg-red-100 text-red-800" },
  { value: "rejected", label: "Refusée", color: "bg-red-100 text-red-800" },
];

// Fonction pour ouvrir le modal des candidatures
const openCandidaturesModal = async (emploi) => {
  setSelectedEmploi(emploi);
  setCandidaturesModalOpen(true);
  setLoadingCandidatures(true);
  
  try {
    const token = localStorage.getItem('auth-token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('jwt-token');
    
    // console.log('🔑 Token pour candidatures emploi:', token ? 'Présent' : 'Absent');
    // console.log(`📤 Récupération candidatures pour emploi ID: ${emploi.id}`);
    
    if (!token) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      return;
    }
    
    // Utiliser l'API réelle pour récupérer les candidatures
    const response = await axios.get(
      `${API_URL}/candidatures/emplois/${emploi.id}`,
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
        toast.info('Aucune candidature pour cette offre');
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
            status: candidature.statut || 'en_attente',
            createdAt: candidature.appliedAt || candidature.createdAt,
            dateNaissance: null,
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
    console.error('❌ Erreur chargement candidatures emploi:', error);
    
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
    
    // Vérifier si c'est un ID mocké (comme 100, 101)
    // Ces IDs viennent de vos données mockées et n'existent pas en BD
    const isMockId = candidatureId === 100 || candidatureId === 101 || candidatureId === 999;
    
    if (isMockId) {
      // console.log('🔄 Mise à jour locale (ID mocké):', candidatureId, newStatus);
      
      // Mettre à jour localement seulement pour les IDs mockés
      setCandidatures(prev => 
        prev.map(candidature => 
          candidature.id === candidatureId 
            ? { 
                ...candidature, 
                status: newStatus,
                statut: newStatus // Pour la compatibilité
              }
            : candidature
        )
      );
      
      toast.success('Statut mis à jour (mode démo)');

        // AJOUTEZ CES LIGNES :
  // Recharger les stats globales
  await fetchStats();
  
  // Recharger la liste des emplois
  await fetchEmplois({
    search: debouncedSearch,
    status: statusFilter,
    type: typeFilter,
    secteur: secteurFilter,
    page: pagination.page
  });
      
      // Recalculer les stats
      const updatedCandidatures = candidatures.map(c => 
        c.id === candidatureId 
          ? { ...c, status: newStatus, statut: newStatus }
          : c
      );
      
      const stats = {
        total: updatedCandidatures.length,
        pending: updatedCandidatures.filter(c => 
          c.status === 'en_attente' || c.status === 'pending' || c.statut === 'en_attente'
        ).length,
        accepted: updatedCandidatures.filter(c => 
          c.status === 'acceptée' || c.status === 'accepted' || c.statut === 'acceptée'
        ).length,
        rejected: updatedCandidatures.filter(c => 
          c.status === 'refusée' || c.status === 'rejected' || c.statut === 'refusée'
        ).length
      };
      setCandidatureStats(stats);
      
      return; // Ne pas appeler l'API pour les IDs mockés
    }
    
    // Pour les vrais IDs, appeler l'API
    let statusToSend = newStatus;
    
    // Convertir si nécessaire
    if (newStatus === 'acceptée') statusToSend = 'acceptée';
    else if (newStatus === 'accepted') statusToSend = 'acceptée';
    else if (newStatus === 'refusée') statusToSend = 'refusée';
    else if (newStatus === 'rejected') statusToSend = 'refusée';
    else if (newStatus === 'en_attente') statusToSend = 'en_attente';
    else if (newStatus === 'pending') statusToSend = 'en_attente';
    
    // console.log('📤 Mise à jour statut candidature:', {
    //   candidatureId,
    //   newStatus,
    //   sending: statusToSend,
    //   isMockId: false
    // });
    
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
            ? { 
                ...candidature, 
                status: statusToSend,
                statut: statusToSend
              }
            : candidature
        )
      );
      
      toast.success('Statut mis à jour avec succès');
      
      // Recalculer les stats
      const updatedCandidatures = candidatures.map(c => 
        c.id === candidatureId 
          ? { ...c, status: statusToSend, statut: statusToSend }
          : c
      );
      
      const stats = {
        total: updatedCandidatures.length,
        pending: updatedCandidatures.filter(c => 
          c.status === 'en_attente' || c.status === 'pending' || c.statut === 'en_attente'
        ).length,
        accepted: updatedCandidatures.filter(c => 
          c.status === 'acceptée' || c.status === 'accepted' || c.statut === 'acceptée'
        ).length,
        rejected: updatedCandidatures.filter(c => 
          c.status === 'refusée' || c.status === 'rejected' || c.statut === 'refusée'
        ).length
      };
      setCandidatureStats(stats);
    }
    
  } catch (error) {
    console.error('❌ Erreur mise à jour statut candidature:', error);
    console.error('Détails:', error.response?.data);
    
    // Si c'est une erreur 404, c'est probablement un ID mocké
    if (error.response?.status === 404) {
      // console.log('⚠️ ID probablement mocké, mise à jour locale');
      
      // Mettre à jour localement quand même
      setCandidatures(prev => 
        prev.map(candidature => 
          candidature.id === candidatureId 
            ? { 
                ...candidature, 
                status: newStatus,
                statut: newStatus
              }
            : candidature
        )
      );
      
      toast.success('Statut mis à jour (données locales)');
    } else {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  }
};

// Ajoutez cette fonction dans votre composant
const refreshAllData = async () => {
  try {
    // Recharge les stats
    await fetchStats();
    
    // Recharge la liste des emplois (avec les counts mis à jour)
    await fetchEmplois({
      search: debouncedSearch,
      status: statusFilter,
      type: typeFilter,
      secteur: secteurFilter,
      page: pagination.page
    });
    
    // Recharge les candidatures dans le modal si ouvert
    if (selectedEmploi && candidaturesModalOpen) {
      await openCandidaturesModal(selectedEmploi);
    }
  } catch (error) {
    console.error('Erreur rafraîchissement données:', error);
  }
};

// Puis appelez-la après chaque modification
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
      await refreshAllData(); // <-- Utilisez cette fonction
    }
  } catch (error) {
    console.error('❌ Erreur suppression candidature:', error);
    toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
  }
};

// Fonction pour télécharger un CV - VERSION CORRIGÉE
const downloadCV = async (candidatureId, fileName, cvUrl) => {
  try {
    // console.log('📥 Téléchargement CV - URL originale:', cvUrl);
    
    if (!cvUrl) {
      toast.error('Aucun CV disponible pour ce candidat');
      return;
    }
    
    // Détecter le type d'URL
    const isBlobUrl = cvUrl.startsWith('blob:');
    const isDataUrl = cvUrl.startsWith('data:');
    const isHttpUrl = cvUrl.startsWith('http://') || cvUrl.startsWith('https://');
    const isRelativeUrl = cvUrl.startsWith('/');
    
    // console.log('🔍 Type d\'URL détecté:', {
    //   isBlobUrl,
    //   isDataUrl,
    //   isHttpUrl,
    //   isRelativeUrl,
    //   cvUrl
    // });
    
    let finalUrl = cvUrl;
    let shouldOpenInNewTab = false;
    
    // Traitement selon le type d'URL
    if (isBlobUrl) {
      // URL Blob : utiliser directement
      // console.log('📄 Utilisation URL Blob');
      shouldOpenInNewTab = true;
      // Pour les URLs Blob, on ne peut pas ajouter de query params
      // On utilise l'URL telle quelle
    }
    else if (isDataUrl) {
      // URL Data (base64) : convertir en blob
      // console.log('📄 Utilisation URL Data (base64)');
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
      // console.log('📄 Utilisation URL HTTP complète');
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl = `${finalUrl}${separator}t=${Date.now()}`;
      shouldOpenInNewTab = true;
    }
    else if (isRelativeUrl) {
      // URL relative : ajouter la base du serveur
      // console.log('📄 Utilisation URL relative');
      // Nettoyer le chemin (enlever le /api/ s'il est déjà présent)
      let cleanPath = cvUrl;
      if (cvUrl.startsWith('/api/')) {
        cleanPath = cvUrl.substring(5); // Enlever '/api/'
      }
      finalUrl = `${API_URL}/${cleanPath}?t=${Date.now()}`;
    }
    else {
      // Autre cas : traiter comme un chemin de fichier
      // console.log('📄 Traitement comme chemin de fichier');
      finalUrl = `${API_URL}/${cvUrl}?t=${Date.now()}`;
    }
    
    // console.log('🔗 URL finale pour téléchargement:', finalUrl);
    
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

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    typeContrat: "",
    secteur: "",
    experience: "",
    salaire: "",
    location: "",
    remotePossible: false,
    urgent: false,
    status: "draft",
    missions: [""],
    competences: [""],
    avantages: [""],
    datePublication: "",
    dateLimite: "",
    nombrePostes: 1,
  });

  const typesContrat = [
    "CDI",
    "CDD",
    "Intérim",
    "Freelance",
    "Alternance",
    "Stage",
  ];

  const secteurs = [
    "Informatique & Tech",
    "Bâtiment & Construction",
    "Commerce & Vente",
    "Santé & Social",
    "Administration",
    "Services",
    "Industrie",
    "Tourisme",
  ];

  const niveauxExperience = [
    "Débutant",
    "Junior (1-3 ans)",
    "Confirmé (3-7 ans)",
    "Senior (7+ ans)",
    "Expert",
  ];

  const statuses = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "archived", label: "Archivée", color: "bg-yellow-100 text-yellow-800" },
    { value: "closed", label: "Pourvue", color: "bg-blue-100 text-blue-800" },
  ];

  // Ajoutez ce useEffect pour charger les données initiales
useEffect(() => {
  const loadInitialData = async () => {
    try {
      await Promise.all([
        fetchEmplois({
          search: '',
          status: 'all',
          type: 'all',
          secteur: 'all',
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

  // Load data on mount and when filters change
  useEffect(() => {
    loadData();
  }, [debouncedSearch, statusFilter, typeFilter, secteurFilter]);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchEmplois({
          search: debouncedSearch,
          status: statusFilter,
          type: typeFilter,
          secteur: secteurFilter,
          page: 1
        }),
        fetchStats()
      ]);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleSearch = useCallback(() => {
    fetchEmplois({
      search: searchTerm,
      status: statusFilter,
      type: typeFilter,
      secteur: secteurFilter,
      page: 1
    });
  }, [searchTerm, statusFilter, typeFilter, secteurFilter, fetchEmplois]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSecteurFilter("all");
  };

  // Corrigez la fonction handleEdit
const handleEdit = (emploi) => {
  setEditingEmploi(emploi);
  setFormData({
    title: emploi.title || "",
    description: emploi.description || "",
    typeContrat: emploi.typeContrat || "",
    secteur: emploi.secteur || "",
    experience: emploi.experience || "",
    salaire: emploi.salaire || "",
    location: emploi.location || "",
    remotePossible: emploi.remotePossible || false,
    urgent: emploi.urgent || false,
    status: emploi.status || "draft",
    missions: emploi.missions || [""],
    competences: emploi.competences || [""],
    avantages: emploi.avantages || [""],
    datePublication: emploi.datePublication ? emploi.datePublication.split('T')[0] : "",
    dateLimite: emploi.dateLimite ? emploi.dateLimite.split('T')[0] : "",
    nombrePostes: emploi.nombrePostes || 1,
  });
  setIsDialogOpen(true);
};


  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      try {
        await deleteEmploi(id);
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

// Corrigez la fonction handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Convertir les chaînes en tableaux si besoin
    const missionsArray = Array.isArray(formData.missions) ? formData.missions : 
                         (formData.missions ? [formData.missions] : []);
    const competencesArray = Array.isArray(formData.competences) ? formData.competences : 
                           (formData.competences ? [formData.competences] : []);
    const avantagesArray = Array.isArray(formData.avantages) ? formData.avantages : 
                         (formData.avantages ? [formData.avantages] : []);

    const apiData = {
      title: formData.title,
      description: formData.description,
      typeContrat: formData.typeContrat,
      secteur: formData.secteur,
      experience: formData.experience,
      salaire: formData.salaire,
      location: formData.location,
      remotePossible: formData.remotePossible,
      urgent: formData.urgent,
      status: formData.status,
      missions: missionsArray.filter(m => m && m.trim() !== ''),
      competences: competencesArray.filter(c => c && c.trim() !== ''),
      avantages: avantagesArray.filter(a => a && a.trim() !== ''),
      datePublication: formData.datePublication || null,
      dateLimite: formData.dateLimite || null,
      nombrePostes: parseInt(formData.nombrePostes),
    };

    if (editingEmploi) {
      await updateEmploi(editingEmploi.id, apiData);
      toast.success("Offre mise à jour avec succès");
    } else {
      await createEmploi(apiData);
      toast.success("Offre créée avec succès");
    }
    
    setIsDialogOpen(false);
    setEditingEmploi(null);
    resetForm();
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    toast.error(error.message || "Erreur lors de l'enregistrement");
  }
};

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      typeContrat: "",
      secteur: "",
      experience: "",
      salaire: "",
      location: "",
      remotePossible: false,
      urgent: false,
      status: "draft",
      missions: [""],
      competences: [""],
      avantages: [""],
      datePublication: "",
      dateLimite: "",
      nombrePostes: 1,
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
          Gestion des Offres d'Emploi
        </h1>
        <p className="text-gray-600">
          Publiez et gérez vos offres d'emploi, suivez les candidatures
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
                <p className="text-sm text-gray-600">Offres publiées</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-[#6B8E23]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.active}</p>
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
                <p className="text-2xl font-bold text-[#556B2F]">{stats.candidatures}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.urgent}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
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
                  <SelectValue placeholder="Type contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {typesContrat.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={secteurFilter} onValueChange={setSecteurFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous secteurs</SelectItem>
                  {secteurs.map((secteur) => (
                    <SelectItem key={secteur} value={secteur}>{secteur}</SelectItem>
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
                  setEditingEmploi(null);
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
                      {editingEmploi ? 'Modifier l\'offre' : 'Nouvelle offre d\'emploi'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingEmploi 
                        ? 'Modifiez les informations de votre offre'
                        : 'Créez une nouvelle offre d\'emploi'
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
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secteur">Secteur d'activité *</Label>
                          <Select
                            value={formData.secteur}
                            onValueChange={(value) => setFormData({...formData, secteur: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un secteur" />
                            </SelectTrigger>
                            <SelectContent>
                              {secteurs.map((secteur) => (
                                <SelectItem key={secteur} value={secteur}>{secteur}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="typeContrat">Type de contrat *</Label>
                          <Select
                            value={formData.typeContrat}
                            onValueChange={(value) => setFormData({...formData, typeContrat: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              {typesContrat.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Niveau d'expérience *</Label>
                          <Select
                            value={formData.experience}
                            onValueChange={(value) => setFormData({...formData, experience: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un niveau" />
                            </SelectTrigger>
                            <SelectContent>
                              {niveauxExperience.map((niveau) => (
                                <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="salaire">Salaire *</Label>
                          <Input
                            id="salaire"
                            value={formData.salaire}
                            onChange={(e) => setFormData({...formData, salaire: e.target.value})}
                            placeholder="ex: 45-55K€"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Lieu de travail *</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="ex: Paris (75)"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombrePostes">Nombre de postes *</Label>
                          <Input
                            id="nombrePostes"
                            type="number"
                            value={formData.nombrePostes}
                            onChange={(e) => setFormData({...formData, nombrePostes: parseInt(e.target.value)})}
                            min="1"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateLimite">Date limite de candidature</Label>
                          <Input
                            id="dateLimite"
                            type="date"
                            value={formData.dateLimite}
                            onChange={(e) => setFormData({...formData, dateLimite: e.target.value})}
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
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="missions">Missions principales</Label>
                          <Textarea
                            id="missions"
                            value={formData.missions.join('\n')}
                            onChange={(e) => setFormData({...formData, missions: e.target.value.split('\n')})}
                            rows={3}
                            placeholder="Une mission par ligne"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="competences">Compétences requises</Label>
                          <Textarea
                            id="competences"
                            value={formData.competences.join('\n')}
                            onChange={(e) => setFormData({...formData, competences: e.target.value.split('\n')})}
                            rows={3}
                            placeholder="Une compétence par ligne"
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
                          placeholder="Un avantage par ligne"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="remotePossible"
                            checked={formData.remotePossible}
                            onCheckedChange={(checked) => setFormData({...formData, remotePossible: checked})}
                          />
                          <Label htmlFor="remotePossible">Télétravail possible</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="urgent"
                            checked={formData.urgent}
                            onCheckedChange={(checked) => setFormData({...formData, urgent: checked})}
                          />
                          <Label htmlFor="urgent">Offre urgente</Label>
                        </div>
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
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingEmploi(null);
                          resetForm();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-[#556B2F] hover:bg-[#6B8E23]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingEmploi ? 'Mettre à jour' : 'Publier'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emplois Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des offres d'emploi</CardTitle>
          <CardDescription>
            {emplois.length} offre{emplois.length !== 1 ? 's' : ''} trouvée{emplois.length !== 1 ? 's' : ''}
            {pagination.total > 0 && ` (${pagination.total} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#556B2F] mb-4" />
              <p>Chargement des offres...</p>
            </div>
          ) : emplois.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune offre trouvée</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || secteurFilter !== 'all'
                  ? "Aucune offre ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore créé d'offres d'emploi."
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
                    <TableHead>Secteur</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Salaire</TableHead>
                    <TableHead>Candidatures</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date limite</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emplois.map((emploi) => {

    //                  console.log('🔍 Emploi debug:', {
    //   id: emploi.id,
    //   title: emploi.title,
    //   candidaturesCount: emploi.candidaturesCount,
    //   candidatures_count: emploi.candidatures_count,
    //   allProps: Object.keys(emploi)
    // });
                    const status = statuses.find(s => s.value === emploi.status);
                    return (
                      <TableRow key={emploi.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                {emploi.title}
                                {emploi.urgent && (
                                  <Badge className="bg-red-100 text-red-800">
                                    <TrendingUp className="h-3 w-3 mr-1" /> Urgent
                                  </Badge>
                                )}
                              </div>
                              {emploi.remotePossible && (
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Home className="h-3 w-3" /> Télétravail possible
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{emploi.typeContrat}</Badge>
                        </TableCell>
                        <TableCell>{emploi.secteur}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {emploi.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {emploi.salaire}
                          </div>
                        </TableCell>
                       <TableCell>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" />
            <span>
              {emploi.candidaturesCount || 0} candidatures
            </span>
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
                            {emploi.dateLimite ? emploi.dateLimite.split('T')[0] : '-'}
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
                              <DropdownMenuItem onClick={() => handleEdit(emploi)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
<DropdownMenuItem onClick={() => openCandidaturesModal(emploi)}>
  <Users className="h-4 w-4 mr-2" />
  Voir candidatures 
</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(emploi.id, emploi.status === 'active' ? 'archived' : 'active')}
                              >
                                {emploi.status === 'active' ? (
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
                                onClick={() => handleDelete(emploi.id)}
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

      {/* Modal des candidatures pour les offres d'emploi */}
<Dialog open={candidaturesModalOpen} onOpenChange={setCandidaturesModalOpen}>
  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>
        Candidatures pour : {selectedEmploi?.title}
      </DialogTitle>
      <DialogDescription>
        Gérez les candidatures pour cette offre d'emploi
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