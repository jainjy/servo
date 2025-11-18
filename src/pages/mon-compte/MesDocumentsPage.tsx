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
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import api from "@/lib/api";

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

  // Dans votre handleFileSelect, ajoutez un console.log
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
      const response = await api.post(
        "/client/documents/upload-multiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // CORRECTION: Utiliser response.data au lieu de response.data
      if (response.data && response.data.success) {
        await fetchDocuments();
        await fetchStats();
        setIsUploadModalOpen(false);
        setSelectedFiles([]);

        // Afficher un message de succès
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

      // Message d'erreur plus détaillé
      if (error.response?.data?.error) {
        alert(`Erreur lors de l'upload: ${error.response.data.error}`);
      } else {
        alert("Une erreur est survenue lors de l'upload des documents");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (documentId: string, updates: Partial<Document>) => {
    try {
      const response = await api.put(
        `/client/documents/${documentId}`,
        updates
      );

      // CORRECTION: Utiliser response.data au lieu de response.data
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

  const downloadDocument = async (documentUrl: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = documentUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      alert("Erreur lors du téléchargement du document");
    }
  };

  const viewDocument = (documentUrl: string) => {
    window.open(documentUrl, "_blank");
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
        return "bg-green-100 text-green-800";
      case "EXPIRÉ":
        return "bg-red-100 text-red-800";
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case "identite":
        return "bg-blue-100 text-blue-800";
      case "financier":
        return "bg-purple-100 text-purple-800";
      case "immobilier":
        return "bg-orange-100 text-orange-800";
      case "juridique":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
        <p className="text-gray-600 mt-2">
          Gérez tous vos documents personnels stockés sur Supabase
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valides</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.parStatut.VALIDE}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expirés</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.parStatut.EXPIRÉ}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    En attente
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.parStatut.EN_ATTENTE}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions et filtres */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Recherche et filtres de base */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un document..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
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
                  <SelectTrigger className="w-[180px]">
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

                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres avancés
                </Button>

                {(searchTerm ||
                  selectedCategory !== "tous" ||
                  selectedStatus !== "tous" ||
                  showAdvancedFilters) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Effacer
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <UploadModal
                  open={isUploadModalOpen}
                  onOpenChange={setIsUploadModalOpen}
                  selectedFiles={selectedFiles}
                  onUpload={handleUpload}
                  uploading={uploading}
                />

                <Button asChild disabled={uploading}>
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

            {/* Filtres avancés */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="date-start">Date de début</Label>
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
                <div>
                  <Label htmlFor="date-end">Date de fin</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Tags</Label>
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
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      <Tabs defaultValue="tous" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tous">
            Tous les documents ({filteredDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="expirant">
            Bientôt expirés ({expiringSoonDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="statistiques">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tous" className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun document trouvé
                </h3>
                <p className="text-gray-600 mb-4">
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
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onView={viewDocument}
                  onDownload={downloadDocument}
                  onDelete={deleteDocument}
                  onEdit={(doc) => {
                    setEditingDocument(doc);
                    setIsEditModalOpen(true);
                  }}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expirant" className="space-y-4">
          {expiringSoonDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun document n'expire bientôt
                </h3>
                <p className="text-gray-600">
                  Tous vos documents sont à jour ou n'ont pas de date
                  d'expiration.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {expiringSoonDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onView={viewDocument}
                  onDownload={downloadDocument}
                  onDelete={deleteDocument}
                  onEdit={(doc) => {
                    setEditingDocument(doc);
                    setIsEditModalOpen(true);
                  }}
                  getStatusColor={getStatusColor}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="statistiques">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Répartition par catégorie
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.parCategorie).map(
                      ([categorie, count]) => (
                        <div
                          key={categorie}
                          className="flex justify-between items-center"
                        >
                          <span className="capitalize">{categorie}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Prochain document à expirer
                  </h3>
                  {stats.prochainExpiration ? (
                    <div>
                      <p className="font-medium">
                        {stats.prochainExpiration.nom}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expire le:{" "}
                        {format(
                          new Date(stats.prochainExpiration.dateExpiration!),
                          "dd/MM/yyyy",
                          {
                            locale: fr,
                          }
                        )}
                      </p>
                      <Badge
                        className={getStatusColor(
                          stats.prochainExpiration.statut
                        )}
                      >
                        {stats.prochainExpiration.statut}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Aucun document avec date d'expiration
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal d'édition */}
      <EditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        document={editingDocument}
        onSave={handleEdit}
      />
    </div>
  );
};

// Composant Modal d'Upload - CORRIGÉ
const UploadModal = ({
  open,
  onOpenChange,
  selectedFiles,
  onUpload,
  uploading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: File[];
  onUpload: (formData: FormData) => Promise<void>;
  uploading: boolean;
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

    // Vérifier qu'il y a des fichiers sélectionnés
    if (selectedFiles.length === 0) {
      alert("Veuillez sélectionner au moins un fichier");
      return;
    }

    const uploadFormData = new FormData();
    
    // Ajouter les fichiers
    selectedFiles.forEach((file) => {
      uploadFormData.append("files", file);
    });

    // Ajouter les métadonnées
    Object.entries(formData).forEach(([key, value]) => {
      if (value) uploadFormData.append(key, value);
    });

    await onUpload(uploadFormData);
  };

  // Réinitialiser le formulaire quand le modal se ferme
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter des documents</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fichiers sélectionnés */}
          <div>
            <Label>Fichiers sélectionnés ({selectedFiles.length})</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  Aucun fichier sélectionné
                </p>
              ) : (
                selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Type de document */}
          <div>
            <Label htmlFor="type">Type de document</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document_client">Document Client</SelectItem>
                <SelectItem value="identite">Identité</SelectItem>
                <SelectItem value="professionnel">Professionnel</SelectItem>
                <SelectItem value="fiscal">Fiscal</SelectItem>
                <SelectItem value="bancaire">Bancaire</SelectItem>
                <SelectItem value="immobilier">Immobilier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Catégorie */}
          <div>
            <Label htmlFor="categorie">Catégorie</Label>
            <Select
              value={formData.categorie}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categorie: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="identite">Identité</SelectItem>
                <SelectItem value="financier">Financier</SelectItem>
                <SelectItem value="immobilier">Immobilier</SelectItem>
                <SelectItem value="juridique">Juridique</SelectItem>
                <SelectItem value="medical">Médical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
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
              rows={3}
            />
          </div>

          {/* Date d'expiration */}
          <div>
            <Label htmlFor="dateExpiration">Date d'expiration (optionnel)</Label>
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
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (séparés par des virgules, optionnel)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Upload en cours...
                </>
              ) : (
                `Uploader ${selectedFiles.length} document${selectedFiles.length > 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Composant Modal d'Édition
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-nom">Nom</Label>
            <Input
              id="edit-nom"
              value={formData.nom}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nom: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-categorie">Catégorie</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categorie: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Général</SelectItem>
                  <SelectItem value="identite">Identité</SelectItem>
                  <SelectItem value="financier">Financier</SelectItem>
                  <SelectItem value="immobilier">Immobilier</SelectItem>
                  <SelectItem value="juridique">Juridique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-statut">Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, statut: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VALIDE">Valide</SelectItem>
                  <SelectItem value="EXPIRÉ">Expiré</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-dateExpiration">Date d'expiration</Label>
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
            />
          </div>

          <div>
            <Label htmlFor="edit-tags">Tags (séparés par des virgules)</Label>
            <Input
              id="edit-tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Sauvegarder</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Composant Carte Document Modifié
const DocumentCard = ({
  document,
  onView,
  onDownload,
  onDelete,
  onEdit,
  getStatusColor,
  getCategoryColor,
}: {
  document: Document;
  onView: (url: string) => void;
  onDownload: (url: string, fileName: string) => void;
  onDelete: (id: string) => void;
  onEdit: (document: Document) => void;
  getStatusColor: (statut: string) => string;
  getCategoryColor: (categorie: string) => string;
}) => {
  const isExpired = document.statut === "EXPIRÉ";
  const isExpiringSoon =
    document.dateExpiration &&
    new Date(document.dateExpiration) <
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card
      className={`border-l-4 ${
        isExpired
          ? "border-l-red-500"
          : isExpiringSoon
          ? "border-l-yellow-500"
          : "border-l-green-500"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <div
              className={`p-3 rounded-lg ${
                isExpired ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              <FileText
                className={`h-6 w-6 ${
                  isExpired ? "text-red-600" : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{document.nom}</h3>
                <Badge
                  variant="secondary"
                  className={getStatusColor(document.statut)}
                >
                  {document.statut}
                </Badge>
                <Badge
                  variant="outline"
                  className={getCategoryColor(document.categorie)}
                >
                  {document.categorie}
                </Badge>
              </div>

              {document.description && (
                <p className="text-gray-600 mb-2">{document.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Taille: {document.taille}</span>
                <span>Format: {document.format}</span>
                <span>
                  Ajouté le:{" "}
                  {format(new Date(document.dateUpload), "dd/MM/yyyy", {
                    locale: fr,
                  })}
                </span>
                {document.dateExpiration && (
                  <span className={isExpired ? "text-red-600 font-medium" : ""}>
                    Expire le:{" "}
                    {format(new Date(document.dateExpiration), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </span>
                )}
              </div>

              {document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {document.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(document)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(document.url)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document.url, document.nom)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(document.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MesDocumentsPage;
