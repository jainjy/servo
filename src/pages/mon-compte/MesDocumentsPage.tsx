import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Upload,
  FileText,
  Download,
  Eye,
  Trash2,
  Calendar,
  AlertTriangle,
  BarChart3,
  Edit,
  Filter,
  X,
  CheckCircle,
  Clock,
  File,
  Users,
  Building,
  Shield,
  MoreVertical,
  Grid,
  List,
  ChevronDown,
  ExternalLink,
  Loader2,
  Plus,
  FolderPlus,
  FileUp,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import api from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface Document {
  id: string;
  nom: string;
  type: string;
  categorie: string;
  description?: string;
  dateExpiration?: string;
  dateUpload: string;
  statut: string;
  taille: string;
  format: string;
  url: string;
  cheminFichier: string;
  tags: string[];
}

interface DocumentStats {
  total: number;
  parStatut: {
    VALIDE: number;
    EXPIRÉ: number;
    EN_ATTENTE: number;
  };
  parCategorie: { [key: string]: number };
  prochainExpiration: Document | null;
}

const MesDocumentsPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [uploading, setUploading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("dateDesc");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Filtres avancés
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/client/documents/mes-documents");
      console.log(response.data.data);
      if (response.data) {
        const data = await response.data;
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(
        "/client/documents/stats/mes-statistiques"
      );
      if (response.data) {
        const data = await response.data;
        setStats(data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("Fichiers sélectionnés:", files);

    if (!files || files.length === 0) {
      console.log("Aucun fichier sélectionné");
      return;
    }

    setSelectedFiles(Array.from(files));
    setIsUploadModalOpen(true);
  };

  const handleUpload = async (formData: FormData) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const response = await api.post(
        "/client/documents/upload-multiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );

      if (response.data && response.data.success) {
        await fetchDocuments();
        await fetchStats();
        setIsUploadModalOpen(false);
        setSelectedFiles([]);
        setUploadProgress(0);

        alert(
          `${
            response.data.results?.length || 1
          } document(s) uploadé(s) avec succès!`
        );
      } else {
        const errorData = response.data;
        alert(
          `Erreur lors de l'upload: ${errorData?.error || "Erreur inconnue"}`
        );
      }
    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);

      if (error.response?.data?.error) {
        alert(`Erreur lors de l'upload: ${error.response.data.error}`);
      } else {
        alert("Une erreur est survenue lors de l'upload des documents");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = async (documentId: string, updates: Partial<Document>) => {
    try {
      const response = await api.put(
        `/client/documents/${documentId}`,
        updates
      );

      if (response.data && response.data.success) {
        await fetchDocuments();
        setIsEditModalOpen(false);
        setEditingDocument(null);
        alert("Document modifié avec succès!");
      } else {
        const errorData = response.data;
        alert(
          `Erreur lors de la modification: ${
            errorData?.error || "Erreur inconnue"
          }`
        );
      }
    } catch (error: any) {
      console.error("Erreur lors de la modification:", error);

      if (error.response?.data?.error) {
        alert(`Erreur lors de la modification: ${error.response.data.error}`);
      } else {
        alert("Une erreur est survenue lors de la modification du document");
      }
    }
  };

  // Téléchargement direct avec optimisation
  const downloadDocument = async (document: Document) => {
    if (downloadingId === document.id) return;
    
    setDownloadingId(document.id);
    
    try {
      // Créer un lien caché pour forcer le téléchargement
      const link = document.createElement('a');
      link.href = document.url;
      
      // Ajouter timestamp pour éviter le cache
      const timestamp = new Date().getTime();
      const separator = document.url.includes('?') ? '&' : '?';
      link.href = `${document.url}${separator}_=${timestamp}&download=true`;
      
      // Configurer pour téléchargement
      link.download = `${document.nom}.${document.format.toLowerCase()}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      
      // Simuler le clic
      link.click();
      
      // Attendre un peu avant de nettoyer
      setTimeout(() => {
        document.body.removeChild(link);
        setDownloadingId(null);
      }, 1000);
      
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      
      // Fallback: ouvrir dans un nouvel onglet
      window.open(document.url, '_blank');
      setDownloadingId(null);
    }
  };

  const viewDocument = (documentUrl: string) => {
    window.open(documentUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      return;
    }

    try {
      const response = await api.delete(`/client/documents/${documentId}`);

      if (response.data) {
        await fetchDocuments();
        await fetchStats();
        alert("Document supprimé avec succès!");
      } else {
        const errorData = await response.data;
        alert(`Erreur lors de la suppression: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression du document");
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "VALIDE":
        return "bg-[#6B8E23]/10 text-[#556B2F] border-[#6B8E23]"; // primary-dark bg, logo text
      case "EXPIRÉ":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "EN_ATTENTE":
        return "bg-yellow-400/10 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case "identite":
        return "bg-[#556B2F]/10 text-[#556B2F] border-[#556B2F]"; // logo
      case "financier":
        return "bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]"; // primary-dark
      case "immobilier":
        return "bg-[#8B4513]/10 text-[#8B4513] border-[#8B4513]"; // secondary-text
      case "juridique":
        return "bg-[#D3D3D3]/10 text-[#556B2F] border-[#D3D3D3]"; // separator
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "VALIDE":
        return <CheckCircle className="h-4 w-4" />;
      case "EXPIRÉ":
        return <AlertTriangle className="h-4 w-4" />;
      case "EN_ATTENTE":
        return <Clock className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (categorie: string) => {
    switch (categorie) {
      case "identite":
        return <Users className="h-4 w-4" />;
      case "financier":
        return <Building className="h-4 w-4" />;
      case "immobilier":
        return <Building className="h-4 w-4" />;
      case "juridique":
        return <Shield className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getFileIcon = (format: string) => {
    const ext = format.toLowerCase();
    if (ext.includes('pdf')) return "📄";
    if (['doc', 'docx'].includes(ext)) return "📝";
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return "🖼️";
    if (['xls', 'xlsx'].includes(ext)) return "📊";
    return "📎";
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "tous" || doc.categorie === selectedCategory;

    const matchesStatus =
      selectedStatus === "tous" || doc.statut === selectedStatus;

    const matchesDateRange = () => {
      if (!dateRange.start && !dateRange.end) return true;

      const docDate = new Date(doc.dateUpload);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      if (startDate && endDate) {
        return docDate >= startDate && docDate <= endDate;
      } else if (startDate) {
        return docDate >= startDate;
      } else if (endDate) {
        return docDate <= endDate;
      }
      return true;
    };

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => doc.tags.includes(tag));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesDateRange() &&
      matchesTags
    );
  });

  // Trier les documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "dateAsc":
        return new Date(a.dateUpload).getTime() - new Date(b.dateUpload).getTime();
      case "dateDesc":
        return new Date(b.dateUpload).getTime() - new Date(a.dateUpload).getTime();
      case "nameAsc":
        return a.nom.localeCompare(b.nom);
      case "nameDesc":
        return b.nom.localeCompare(a.nom);
      default:
        return 0;
    }
  });

  const categories = [
    "tous",
    ...Array.from(new Set(documents.map((doc) => doc.categorie))),
  ];
  const statuses = ["tous", "VALIDE", "EXPIRÉ", "EN_ATTENTE"];
  const allTags = Array.from(new Set(documents.flatMap((doc) => doc.tags)));

  const expiringSoonDocuments = documents.filter((doc) => {
    if (!doc.dateExpiration) return false;
    const expirationDate = new Date(doc.dateExpiration);
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expirationDate <= in30Days && expirationDate > new Date();
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("tous");
    setSelectedStatus("tous");
    setDateRange({ start: "", end: "" });
    setSelectedTags([]);
    setShowAdvancedFilters(false);
  };

  const formatFileSize = (bytes: string) => {
    const numBytes = parseFloat(bytes);
    if (numBytes < 1024) return numBytes + " B";
    if (numBytes < 1048576) return (numBytes / 1024).toFixed(1) + " KB";
    return (numBytes / 1048576).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23] mx-auto mb-4"></div>
            <p className="text-[#556B2F]">Chargement de vos documents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20 bg-[#FFFFFF]">
      {/* En-tête */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start md:items-center mb-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[#556B2F]">Mes Documents</h1>
            <p className="text-[#8B4513]">
              Gérez tous vos documents personnels stockés en sécurité
            </p>
          </div>
          <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_auto] gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="hidden  md:grid grid-cols-2 border-[#D3D3D3] text-[#556B2F]"
            >
              {viewMode === "grid" ? (
                <>
                  <List className="h-4 w-4 mr-2" />
                  Liste
                </>
              ) : (
                <>
                  <Grid className="h-4 w-4 mr-2" />
                  Grille
                </>
              )}
            </Button>
            <Button
              asChild
              disabled={uploading}
              className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Upload..." : "Ajouter des documents"}
              </label>
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xls,.xlsx"
            />
          </div>
        </div>
        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#FFFFFF] border-[#D3D3D3]">
              <CardContent className="p-4">
                <div className="grid grid-cols-[1fr_auto] items-center">
                  <div>
                    <p className="text-sm font-medium text-[#556B2F]">Total</p>
                    <p className="text-2xl font-bold text-[#6B8E23]">{stats.total}</p>
                  </div>
                  <div className="p-2 bg-[#556B2F]/20 rounded-lg">
                    <FileText className="h-6 w-6 text-[#556B2F]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#FFFFFF] border-[#D3D3D3]">
              <CardContent className="p-4">
                <div className="grid grid-cols-[1fr_auto] items-center">
                  <div>
                    <p className="text-sm font-medium text-[#6B8E23]">Valides</p>
                    <p className="text-2xl font-bold text-[#556B2F]">{stats.parStatut.VALIDE}</p>
                  </div>
                  <div className="p-2 bg-[#6B8E23]/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-[#6B8E23]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#FFFFFF] border-[#D3D3D3]">
              <CardContent className="p-4">
                <div className="grid grid-cols-[1fr_auto] items-center">
                  <div>
                    <p className="text-sm font-medium text-red-700">Expirés</p>
                    <p className="text-2xl font-bold text-red-900">{stats.parStatut.EXPIRÉ}</p>
                  </div>
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#FFFFFF] border-[#D3D3D3]">
              <CardContent className="p-4">
                <div className="grid grid-cols-[1fr_auto] items-center">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">En attente</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats.parStatut.EN_ATTENTE}</p>
                  </div>
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {/* Barre de recherche et filtres */}
      <Card className="mb-8 shadow-sm border-[#D3D3D3] bg-[#FFFFFF]">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Première ligne : Recherche et tri */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] h-4 w-4" />
                <Input
                  placeholder="Rechercher un document, une description ou un tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#FFFFFF] text-[#556B2F] border-[#D3D3D3]"
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full border-[#D3D3D3] text-[#556B2F]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateDesc">Plus récent</SelectItem>
                    <SelectItem value="dateAsc">Plus ancien</SelectItem>
                    <SelectItem value="nameAsc">Nom (A-Z)</SelectItem>
                    <SelectItem value="nameDesc">Nom (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="shrink-0 border-[#D3D3D3] text-[#556B2F]"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Filtres rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr] gap-2 items-center">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full border-[#D3D3D3] text-[#556B2F]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "tous" ? "Toutes catégories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-full border-[#D3D3D3] text-[#556B2F]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "tous" ? "Tous statuts" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchTerm ||
                selectedCategory !== "tous" ||
                selectedStatus !== "tous" ||
                showAdvancedFilters ||
                dateRange.start ||
                dateRange.end ||
                selectedTags.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#8B4513] hover:text-[#556B2F] justify-self-start"
                >
                  <X className="h-4 w-4 mr-1" />
                  Effacer les filtres
                </Button>
              )}
            </div>
            {/* Filtres avancés */}
            {showAdvancedFilters && (
              <div className="p-4 bg-[#FFFFFF] rounded-lg border border-[#D3D3D3]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-start" className="text-sm font-medium">
                      Date de début
                    </Label>
                    <Input
                      id="date-start"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-end" className="text-sm font-medium">
                      Date de fin
                    </Label>
                    <Input
                      id="date-end"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange((prev) => ({ ...prev, end: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tags</Label>
                    <Select
                      onValueChange={(value) => {
                        if (!selectedTags.includes(value)) {
                          setSelectedTags([...selectedTags, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ajouter un tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {allTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                            onClick={() =>
                              setSelectedTags(
                                selectedTags.filter((t) => t !== tag)
                              )
                            }
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Onglets */}
      <Tabs defaultValue="tous" className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-center">
          <TabsList className="w-full sm:w-auto bg-[#FFFFFF] border-[#D3D3D3]">
            <TabsTrigger value="tous" className="flex-1 sm:flex-none">
              Tous ({filteredDocuments.length})
            </TabsTrigger>
            <TabsTrigger value="expirant" className="flex-1 sm:flex-none">
              <AlertTriangle className="h-4 w-4 mr-2 hidden sm:inline" />
              Expirant ({expiringSoonDocuments.length})
            </TabsTrigger>
            <TabsTrigger value="statistiques" className="flex-1 sm:flex-none">
              <BarChart3 className="h-4 w-4 mr-2 hidden sm:inline" />
              Stats
            </TabsTrigger>
          </TabsList>
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center text-sm text-[#556B2F]">
            <FileText className="h-4 w-4" />
            <span>{sortedDocuments.length} document{sortedDocuments.length !== 1 ? 's' : ''} trouvé{sortedDocuments.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {/* Tous les documents */}
        <TabsContent value="tous" className="space-y-4">
          {sortedDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="grid place-items-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun document trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ||
                  selectedCategory !== "tous" ||
                  selectedStatus !== "tous"
                    ? "Aucun document ne correspond à vos critères de recherche."
                    : "Commencez par ajouter votre premier document."}
                </p>
                {!searchTerm &&
                  selectedCategory === "tous" &&
                  selectedStatus === "tous" && (
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Ajouter un document
                      </label>
                    </Button>
                  )}
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedDocuments.map((document) => (
                <DocumentCardGrid
                  key={document.id}
                  document={document}
                  onView={() => viewDocument(document.url)}
                  onDownload={() => downloadDocument(document)}
                  onDelete={() => deleteDocument(document.id)}
                  onEdit={() => {
                    setEditingDocument(document);
                    setIsEditModalOpen(true);
                  }}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                  getStatusIcon={getStatusIcon}
                  getCategoryIcon={getCategoryIcon}
                  getFileIcon={() => getFileIcon(document.format)}
                  formatFileSize={() => formatFileSize(document.taille)}
                  isDownloading={downloadingId === document.id}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedDocuments.map((document) => (
                <DocumentCardList
                  key={document.id}
                  document={document}
                  onView={() => viewDocument(document.url)}
                  onDownload={() => downloadDocument(document)}
                  onDelete={() => deleteDocument(document.id)}
                  onEdit={() => {
                    setEditingDocument(document);
                    setIsEditModalOpen(true);
                  }}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                  getStatusIcon={getStatusIcon}
                  getCategoryIcon={getCategoryIcon}
                  getFileIcon={() => getFileIcon(document.format)}
                  formatFileSize={() => formatFileSize(document.taille)}
                  isDownloading={downloadingId === document.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
        {/* Documents expirant bientôt */}
        <TabsContent value="expirant" className="space-y-4">
          {expiringSoonDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="grid place-items-center w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full">
                  <Calendar className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun document n'expire bientôt
                </h3>
                <p className="text-gray-600">
                  Tous vos documents sont à jour ou n'ont pas de date d'expiration.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {expiringSoonDocuments.map((document) => (
                <DocumentCardList
                  key={document.id}
                  document={document}
                  onView={() => viewDocument(document.url)}
                  onDownload={() => downloadDocument(document)}
                  onDelete={() => deleteDocument(document.id)}
                  onEdit={() => {
                    setEditingDocument(document);
                    setIsEditModalOpen(true);
                  }}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                  getStatusIcon={getStatusIcon}
                  getCategoryIcon={getCategoryIcon}
                  getFileIcon={() => getFileIcon(document.format)}
                  formatFileSize={() => formatFileSize(document.taille)}
                  isDownloading={downloadingId === document.id}
                  highlightExpiring={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
        {/* Statistiques */}
        <TabsContent value="statistiques">
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6 pb-3 border-b">
                    Répartition par catégorie
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(stats.parCategorie).map(
                      ([categorie, count]) => (
                        <div
                          key={categorie}
                          className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getCategoryIcon(categorie)}
                          </div>
                          <span className="font-medium capitalize">{categorie}</span>
                          <div className="grid grid-cols-[auto_auto] items-center gap-3">
                            <span className="text-2xl font-bold">{count}</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500"
                                style={{ width: `${(count / stats.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6 pb-3 border-b">
                    Prochain document à expirer
                  </h3>
                  {stats.prochainExpiration ? (
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                      <div className="grid grid-cols-[auto_1fr] gap-3 mb-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-lg">
                            {stats.prochainExpiration.nom}
                          </p>
                          <p className="text-sm text-gray-600">
                            {stats.prochainExpiration.description}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="grid grid-cols-[1fr_auto] items-center text-sm">
                          <span className="text-gray-600">Date d'expiration:</span>
                          <span className="font-medium">
                            {format(
                              new Date(stats.prochainExpiration.dateExpiration!),
                              "dd MMMM yyyy",
                              { locale: fr }
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-[1fr_auto] items-center text-sm">
                          <span className="text-gray-600">Statut:</span>
                          <Badge
                            className={getStatusColor(
                              stats.prochainExpiration.statut
                            )}
                          >
                            {stats.prochainExpiration.statut}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Aucun document avec date d'expiration
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Modals */}
      <UploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        selectedFiles={selectedFiles}
        onUpload={handleUpload}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />
      <EditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        document={editingDocument}
        onSave={handleEdit}
      />
    </div>
  );
};

// Modal d'Upload avec Grid
const UploadModal = ({
  open,
  onOpenChange,
  selectedFiles,
  onUpload,
  uploading,
  uploadProgress,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: File[];
  onUpload: (formData: FormData) => Promise<void>;
  uploading: boolean;
  uploadProgress: number;
}) => {
  const [formData, setFormData] = useState({
    type: "document_client",
    categorie: "general",
    description: "",
    dateExpiration: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Veuillez sélectionner au moins un fichier");
      return;
    }

    const uploadFormData = new FormData();
    
    selectedFiles.forEach((file) => {
      uploadFormData.append("files", file);
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (value) uploadFormData.append(key, value);
    });

    await onUpload(uploadFormData);
  };

  useEffect(() => {
    if (!open) {
      setFormData({
        type: "document_client",
        categorie: "general",
        description: "",
        dateExpiration: "",
        tags: "",
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="
        max-w-[95vw] 
        sm:max-w-lg 
        md:max-w-xl 
        lg:max-w-2xl 
        max-h-[90vh] 
        overflow-y-auto
        p-4 
        sm:p-6
      ">
        <DialogHeader className="space-y-1">
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <FileUp className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold">Ajouter des documents</DialogTitle>
          </div>
          <p className="text-sm text-gray-600">
            Téléversez vos fichiers et ajoutez des métadonnées
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Fichiers sélectionnés */}
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto] items-center">
              <Label className="text-sm font-medium">
                Fichiers sélectionnés ({selectedFiles.length})
              </Label>
              {selectedFiles.length > 0 && (
                <span className="text-xs text-gray-500">
                  {selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024 > 1 
                    ? `${(selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB` 
                    : `${(selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(2)} KB`
                  }
                </span>
              )}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50/50 hover:border-blue-400 transition-colors duration-200">
              {selectedFiles.length === 0 ? (
                <div className="grid place-items-center py-6 sm:py-8">
                  <div className="grid place-items-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Aucun fichier sélectionné</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Glissez-déposez ou cliquez pour sélectionner
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 sm:max-h-56 overflow-y-auto pr-1 sm:pr-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs hidden sm:inline-flex"
                      >
                        {file.type.split('/')[1]?.toUpperCase() || "FILE"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Barre de progression */}
          {uploading && (
            <div className="space-y-1 sm:space-y-2">
              <div className="grid grid-cols-[1fr_auto] items-center text-xs sm:text-sm">
                <span className="text-gray-600">Upload en cours...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1.5 sm:h-2" />
            </div>
          )}

          {/* Métadonnées - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="type" className="text-xs sm:text-sm font-medium">
                Type de document
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="document_client" className="text-xs sm:text-sm">
                    Document Client
                  </SelectItem>
                  <SelectItem value="identite" className="text-xs sm:text-sm">
                    Identité
                  </SelectItem>
                  <SelectItem value="professionnel" className="text-xs sm:text-sm">
                    Professionnel
                  </SelectItem>
                  <SelectItem value="fiscal" className="text-xs sm:text-sm">
                    Fiscal
                  </SelectItem>
                  <SelectItem value="bancaire" className="text-xs sm:text-sm">
                    Bancaire
                  </SelectItem>
                  <SelectItem value="immobilier" className="text-xs sm:text-sm">
                    Immobilier
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="categorie" className="text-xs sm:text-sm font-medium">
                Catégorie
              </Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categorie: value }))
                }
              >
                <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="general" className="text-xs sm:text-sm">
                    Général
                  </SelectItem>
                  <SelectItem value="identite" className="text-xs sm:text-sm">
                    Identité
                  </SelectItem>
                  <SelectItem value="financier" className="text-xs sm:text-sm">
                    Financier
                  </SelectItem>
                  <SelectItem value="immobilier" className="text-xs sm:text-sm">
                    Immobilier
                  </SelectItem>
                  <SelectItem value="juridique" className="text-xs sm:text-sm">
                    Juridique
                  </SelectItem>
                  <SelectItem value="medical" className="text-xs sm:text-sm">
                    Médical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Description du document..."
              rows={2}
              className="resize-none text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
            />
          </div>

          {/* Date et Tags - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="dateExpiration" className="text-xs sm:text-sm font-medium">
                Date d'expiration
                <span className="text-gray-500 font-normal ml-1">(optionnel)</span>
              </Label>
              <Input
                id="dateExpiration"
                type="date"
                value={formData.dateExpiration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateExpiration: e.target.value,
                  }))
                }
                className="h-9 sm:h-10 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="tags" className="text-xs sm:text-sm font-medium">
                Tags
                <span className="text-gray-500 font-normal ml-1">(optionnel)</span>
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="tag1, tag2, tag3"
                className="h-9 sm:h-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Boutons - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 sm:pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
              className="h-9 sm:h-10 text-xs sm:text-sm order-2 sm:order-1"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || selectedFiles.length === 0}
              className="h-9 sm:h-10 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 order-1 sm:order-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                  <span>Upload en cours...</span>
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span>
                    Uploader {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Modal d'Édition avec Grid
const EditModal = ({
  open,
  onOpenChange,
  document,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onSave: (documentId: string, updates: Partial<Document>) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    categorie: "",
    dateExpiration: "",
    statut: "",
    tags: "",
  });

  useEffect(() => {
    if (document) {
      setFormData({
        nom: document.nom,
        description: document.description || "",
        categorie: document.categorie,
        dateExpiration: document.dateExpiration
          ? document.dateExpiration.split("T")[0]
          : "",
        statut: document.statut,
        tags: document.tags.join(", "),
      });
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    const updates: Partial<Document> = {
      nom: formData.nom,
      description: formData.description,
      categorie: formData.categorie,
      dateExpiration: formData.dateExpiration || undefined,
      statut: formData.statut,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    await onSave(document.id, updates);
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="
        max-w-[95vw] 
        sm:max-w-lg 
        md:max-w-xl 
        lg:max-w-2xl 
        max-h-[90vh] 
        overflow-y-auto
        p-4 
        sm:p-6
      ">
        <DialogHeader className="space-y-1">
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold">Modifier le document</DialogTitle>
          </div>
          <p className="text-sm text-gray-600">
            Mettez à jour les informations du document
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Nom du document */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="edit-nom" className="text-xs sm:text-sm font-medium">
              Nom du document
            </Label>
            <Input
              id="edit-nom"
              value={formData.nom}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nom: e.target.value }))
              }
              required
              className="h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="edit-description" className="text-xs sm:text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="resize-none text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
              rows={2}
            />
          </div>

          {/* Catégorie et Statut - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="edit-categorie" className="text-xs sm:text-sm font-medium">
                Catégorie
              </Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categorie: value }))
                }
              >
                <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="general" className="text-xs sm:text-sm">
                    Général
                  </SelectItem>
                  <SelectItem value="identite" className="text-xs sm:text-sm">
                    Identité
                  </SelectItem>
                  <SelectItem value="financier" className="text-xs sm:text-sm">
                    Financier
                  </SelectItem>
                  <SelectItem value="immobilier" className="text-xs sm:text-sm">
                    Immobilier
                  </SelectItem>
                  <SelectItem value="juridique" className="text-xs sm:text-sm">
                    Juridique
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="edit-statut" className="text-xs sm:text-sm font-medium">
                Statut
              </Label>
              <Select
                value={formData.statut}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, statut: value }))
                }
              >
                <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VALIDE" className="text-xs sm:text-sm">
                    Valide
                  </SelectItem>
                  <SelectItem value="EXPIRÉ" className="text-xs sm:text-sm">
                    Expiré
                  </SelectItem>
                  <SelectItem value="EN_ATTENTE" className="text-xs sm:text-sm">
                    En attente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date d'expiration */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="edit-dateExpiration" className="text-xs sm:text-sm font-medium">
              Date d'expiration
            </Label>
            <Input
              id="edit-dateExpiration"
              type="date"
              value={formData.dateExpiration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dateExpiration: e.target.value,
                }))
              }
              className="h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="edit-tags" className="text-xs sm:text-sm font-medium">
              Tags (séparés par des virgules)
            </Label>
            <Input
              id="edit-tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="tag1, tag2, tag3"
              className="h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Boutons - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 sm:pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 sm:h-10 text-xs sm:text-sm order-2 sm:order-1"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="h-9 sm:h-10 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 order-1 sm:order-2"
            >
              Sauvegarder les modifications
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Carte Document en mode Grille avec Grid
const DocumentCardGrid = ({
  document,
  onView,
  onDownload,
  onDelete,
  onEdit,
  getStatusColor,
  getCategoryColor,
  getStatusIcon,
  getCategoryIcon,
  getFileIcon,
  formatFileSize,
  isDownloading,
}: {
  document: Document;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onEdit: () => void;
  getStatusColor: (statut: string) => string;
  getCategoryColor: (categorie: string) => string;
  getStatusIcon: (statut: string) => React.ReactNode;
  getCategoryIcon: (categorie: string) => React.ReactNode;
  getFileIcon: () => string;
  formatFileSize: () => string;
  isDownloading: boolean;
}) => {
  const [showActions, setShowActions] = useState(false);
  const isExpired = document.statut === "EXPIRÉ";
  const isExpiringSoon = document.dateExpiration &&
    new Date(document.dateExpiration) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden">
      <CardContent className="p-4 sm:p-5 grid gap-3 sm:gap-4">
        {/* En-tête avec icône et actions */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3">
          <div className="text-xl sm:text-2xl">{getFileIcon()}</div>
          <div>
            <Badge
              className={`${getStatusColor(
                document.statut
              )} text-xs sm:text-sm`}
            >
              <span className="grid grid-cols-[auto_1fr] items-center gap-1">
                {getStatusIcon(document.statut)}
                <span className="hidden sm:inline">{document.statut}</span>
                <span className="sm:hidden">{document.statut.slice(0, 3)}</span>
              </span>
            </Badge>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 top-8 z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowActions(false);
                    }}
                    className="grid grid-cols-[auto_1fr] items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 text-left"
                  >
                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      onView();
                      setShowActions(false);
                    }}
                    className="grid grid-cols-[auto_1fr] items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 text-left"
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Visualiser
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowActions(false);
                    }}
                    className="grid grid-cols-[auto_1fr] items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm hover:bg-red-50 text-red-600 text-left"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Nom du document */}
        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 hover:text-blue-600 transition-colors">
          {document.nom}
        </h3>

        {/* Description */}
        {document.description && (
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
            {document.description}
          </p>
        )}

        {/* Métadonnées */}
        <div className="grid gap-2 sm:gap-3">
          <div className="grid grid-cols-[auto_auto] gap-1 sm:gap-2">
            <Badge
              variant="outline"
              className={`${getCategoryColor(
                document.categorie
              )} text-xs sm:text-sm`}
            >
              <span className="grid grid-cols-[auto_1fr] items-center gap-1">
                {getCategoryIcon(document.categorie)}
                <span className="hidden sm:inline">{document.categorie}</span>
                <span className="sm:hidden">
                  {document.categorie.slice(0, 3)}
                </span>
              </span>
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs hidden sm:inline-flex"
            >
              {document.format.toUpperCase().slice(0, 3)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
            <div className="text-gray-600">Taille:</div>
            <div className="font-medium truncate">{formatFileSize()}</div>

            <div className="text-gray-600">Ajouté:</div>
            <div className="font-medium">
              {format(new Date(document.dateUpload), "dd/MM/yy")}
            </div>
          </div>

          {document.dateExpiration && (
            <div
              className={`grid grid-cols-[auto_1fr] items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                isExpired
                  ? "text-red-600"
                  : isExpiringSoon
                  ? "text-amber-600"
                  : "text-gray-600"
              }`}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>
                Expire le{" "}
                {format(new Date(document.dateExpiration), "dd/MM/yy")}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {document.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full truncate"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-1.5 py-0.5 sm:px-2 sm:py-1">
                +{document.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="grid grid-cols-[1fr_auto] gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t">
          <Button
            variant="default"
            size="sm"
            className="h-8 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-[#556B2F] to-[#556F1F] hover:bg-[#6B8E23]"
            onClick={onDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <div className="grid place-items-center">
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              </div>
            ) : (
              <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Télécharger</span>
                <span className="sm:hidden">DL</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 grid place-items-center"
            onClick={onView}
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Carte Document en mode Liste avec Grid
const DocumentCardList = ({
  document,
  onView,
  onDownload,
  onDelete,
  onEdit,
  getStatusColor,
  getCategoryColor,
  getStatusIcon,
  getCategoryIcon,
  getFileIcon,
  formatFileSize,
  isDownloading,
  highlightExpiring = false,
}: {
  document: Document;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onEdit: () => void;
  getStatusColor: (statut: string) => string;
  getCategoryColor: (categorie: string) => string;
  getStatusIcon: (statut: string) => React.ReactNode;
  getCategoryIcon: (categorie: string) => React.ReactNode;
  getFileIcon: () => string;
  formatFileSize: () => string;
  isDownloading: boolean;
  highlightExpiring?: boolean;
}) => {
  const [showMobileActions, setShowMobileActions] = useState(false);
  const isExpired = document.statut === "EXPIRÉ";
  const isExpiringSoon = document.dateExpiration &&
    new Date(document.dateExpiration) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card
      className={`group hover:shadow-md transition-all duration-200 border-l-4 ${
        highlightExpiring && isExpiringSoon && !isExpired
          ? "border-l-amber-500"
          : isExpired
          ? "border-l-red-500"
          : "border-l-gray-200"
      } hover:border-l-blue-500`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-3 sm:gap-4">
          {/* Partie gauche : Icône */}
          <div
            className={`p-2 sm:p-3 rounded-lg ${
              isExpired
                ? "bg-red-100"
                : highlightExpiring && isExpiringSoon
                ? "bg-amber-100"
                : "bg-blue-100"
            } grid place-items-center`}
          >
            <div className="text-lg sm:text-xl">{getFileIcon()}</div>
          </div>

          {/* Partie centrale : Informations */}
          <div className="grid gap-1.5 sm:gap-2">
            <div className="grid gap-0.5 sm:gap-1">
              <h3 className="font-semibold text-base sm:text-lg truncate hover:text-blue-600">
                {document.nom}
              </h3>

              {document.description && (
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-1">
                  {document.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-[auto_auto] sm:grid-cols-[auto_auto_auto] gap-1.5 sm:gap-2 items-center">
              <Badge
                className={`${getStatusColor(
                  document.statut
                )} text-xs sm:text-sm`}
              >
                <span className="grid grid-cols-[auto_1fr] items-center gap-1">
                  {getStatusIcon(document.statut)}
                  <span className="hidden sm:inline">{document.statut}</span>
                  <span className="sm:hidden">
                    {document.statut.slice(0, 3)}
                  </span>
                </span>
              </Badge>

              <Badge
                variant="outline"
                className={`${getCategoryColor(
                  document.categorie
                )} text-xs sm:text-sm`}
              >
                <span className="grid grid-cols-[auto_1fr] items-center gap-1">
                  {getCategoryIcon(document.categorie)}
                  <span className="hidden sm:inline">{document.categorie}</span>
                  <span className="sm:hidden">
                    {document.categorie.slice(0, 3)}
                  </span>
                </span>
              </Badge>

              <Badge
                variant="secondary"
                className="text-xs hidden sm:inline-flex"
              >
                {document.format.toUpperCase()}
              </Badge>
            </div>

            {/* Métadonnées */}
            <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_auto] gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span className="grid grid-cols-[auto_1fr] items-center gap-1">
                <FileText className="h-3 w-3" />
                {formatFileSize()}
              </span>
              <span className="hidden sm:inline">
                Ajouté le {format(new Date(document.dateUpload), "dd/MM/yyyy")}
              </span>
              <span className="sm:hidden">
                {format(new Date(document.dateUpload), "dd/MM/yy")}
              </span>
              {document.dateExpiration && (
                <span
                  className={`grid grid-cols-[auto_1fr] items-center gap-1 ${
                    isExpired
                      ? "text-red-600"
                      : isExpiringSoon
                      ? "text-amber-600"
                      : "text-gray-600"
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    Expire le{" "}
                    {format(new Date(document.dateExpiration), "dd/MM/yyyy")}
                  </span>
                  <span className="sm:hidden">
                    {format(new Date(document.dateExpiration), "dd/MM/yy")}
                  </span>
                </span>
              )}
            </div>

            {/* Tags */}
            {document.tags.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-1">
                {document.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full truncate"
                  >
                    {tag}
                  </span>
                ))}
                {document.tags.length > 2 && (
                  <span className="text-xs text-gray-500 px-1.5 py-0.5 sm:px-2 sm:py-1">
                    +{document.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Partie droite : Actions */}
          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-1 gap-1.5 sm:gap-2 items-center">
            {/* Bouton Télécharger */}
            <Button
              variant="default"
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm bg-gradient-to-r bg-[#556B2F] hover:bg-[#6B8E23]"
              onClick={onDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="grid place-items-center">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Télécharger</span>
                  <span className="sm:hidden">DL</span>
                </>
              )}
            </Button>

            {/* Actions supplémentaires sur mobile */}
            <div className="sm:hidden relative">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 grid place-items-center"
                onClick={() => setShowMobileActions(!showMobileActions)}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>

              {showMobileActions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMobileActions(false)}
                  />
                  <div className="absolute right-0 top-10 z-50 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <button
                      onClick={() => {
                        onEdit();
                        setShowMobileActions(false);
                      }}
                      className="grid grid-cols-[auto_1fr] items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100 text-left"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        onView();
                        setShowMobileActions(false);
                      }}
                      className="grid grid-cols-[auto_1fr] items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100 text-left"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Visualiser
                    </button>
                    <button
                      onClick={() => {
                        onDelete();
                        setShowMobileActions(false);
                      }}
                      className="grid grid-cols-[auto_1fr] items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 text-red-600 text-left"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Actions sur desktop */}
            <div className="hidden sm:grid grid-cols-3 gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={onView}
                className="h-9 w-9 grid place-items-center"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onEdit}
                className="h-9 w-9 grid place-items-center"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onDelete}
                className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 grid place-items-center"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MesDocumentsPage;