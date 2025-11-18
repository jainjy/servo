import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/client/documents/mes-documents");

      if (response.ok) {
        const data = await response.json();
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
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      formData.append("type", "document_client");
      formData.append("categorie", "general");

      const response = await api.post(
        "/client/documents/upload-multiple",
        formData
      );

      if (response.ok) {
        await fetchDocuments();
        await fetchStats();
        // Réinitialiser l'input file
        event.target.value = "";
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de l'upload: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Une erreur est survenue lors de l'upload des documents");
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (documentUrl: string, fileName: string) => {
    try {
      // Pour Supabase, on peut directement utiliser l'URL publique
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

      if (response.ok) {
        await fetchDocuments();
        await fetchStats();
      } else {
        const errorData = await response.json();
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
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "tous",
    ...Array.from(new Set(documents.map((doc) => doc.categorie))),
  ];

  const expiringSoonDocuments = documents.filter((doc) => {
    if (!doc.dateExpiration) return false;
    const expirationDate = new Date(doc.dateExpiration);
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expirationDate <= in30Days && expirationDate > new Date();
  });

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
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "tous" ? "Toutes catégories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
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
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xls,.xlsx"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      <Tabs defaultValue="tous" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tous">Tous les documents</TabsTrigger>
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
                  {searchTerm || selectedCategory !== "tous"
                    ? "Aucun document ne correspond à vos critères de recherche."
                    : "Commencez par ajouter votre premier document."}
                </p>
                {!searchTerm && selectedCategory === "tous" && (
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
                          { locale: fr }
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
    </div>
  );
};

// Composant Carte Document (inchangé)
const DocumentCard = ({
  document,
  onView,
  onDownload,
  onDelete,
  getStatusColor,
  getCategoryColor,
}: {
  document: Document;
  onView: (url: string) => void;
  onDownload: (url: string, fileName: string) => void;
  onDelete: (id: string) => void;
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
