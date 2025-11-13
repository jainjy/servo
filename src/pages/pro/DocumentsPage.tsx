// pages/documents.jsx
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Award,
  FileCheck,
  Archive,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Save,
  Users,
  Building,
  Calendar,
  Home,
  Receipt,
  FileSignature,
  Banknote,
} from "lucide-react";
import {
  documentService,
  TYPES_DOCUMENTS,
  STATUT_DOCUMENT,
  CATEGORIES_IMMOBILIER,
} from "@/services/documentService";

// Composant Modal
const Modal = ({ isOpen, onClose, children, title, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn ${sizeClasses[size]}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold" style={{ color: "#0A0A0A" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:rotate-90"
            style={{ color: "#5A6470" }}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Composant Modal Upload Document
const ModalUploadDocument = ({
  isOpen,
  onClose,
  onUpload,
  typeDocument = "GENERAL",
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    type: "ASSURANCE",
    categorie: "REVENU_FONCIER",
    dateExpiration: "",
    fichier: null,
    description: "",
    tags: [],
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (typeDocument === "IMMOBILIER") {
      setFormData((prev) => ({ ...prev, type: "IMMOBILIER" }));
    }
  }, [typeDocument]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, fichier: file }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.fichier || !formData.nom) return;

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("fichier", formData.fichier);
      uploadFormData.append("nom", formData.nom);
      uploadFormData.append("type", formData.type);
      uploadFormData.append("description", formData.description);

      if (formData.dateExpiration) {
        uploadFormData.append("dateExpiration", formData.dateExpiration);
      }

      if (formData.type === "IMMOBILIER") {
        uploadFormData.append("categorie", formData.categorie);
      }

      if (formData.tags.length > 0) {
        uploadFormData.append("tags", JSON.stringify(formData.tags));
      }

      const nouveauDocument = await documentService.uploadDocument(
        uploadFormData
      );

      onUpload(nouveauDocument);
      setIsUploading(false);
      setUploadProgress(0);
      onClose();

      // Reset form
      setFormData({
        nom: "",
        type: typeDocument === "IMMOBILIER" ? "IMMOBILIER" : "ASSURANCE",
        categorie: "REVENU_FONCIER",
        dateExpiration: "",
        fichier: null,
        description: "",
        tags: [],
      });
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        typeDocument === "IMMOBILIER"
          ? "Uploader un document immobilier"
          : "Uploader un document"
      }
    >
      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <Label className="block mb-2">Nom du document *</Label>
          <Input
            required
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder={
              typeDocument === "IMMOBILIER"
                ? "Ex: Bail Location Appartement T2 République"
                : "Ex: Assurance RC Pro 2024"
            }
          />
        </div>

        <div>
          <Label className="block mb-2">Description (optionnel)</Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description du document..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block mb-2">Type de document</Label>
            <select
              className="w-full p-3 border rounded-lg"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              {Object.entries(TYPES_DOCUMENTS).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {formData.type === "IMMOBILIER" && (
            <div>
              <Label className="block mb-2">Catégorie immobilière</Label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.categorie}
                onChange={(e) =>
                  setFormData({ ...formData, categorie: e.target.value })
                }
              >
                {Object.entries(CATEGORIES_IMMOBILIER).map(
                  ([key, categorie]) => (
                    <option key={key} value={key}>
                      {categorie.label}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <div>
            <Label className="block mb-2">Date d'expiration (optionnel)</Label>
            <Input
              type="date"
              value={formData.dateExpiration}
              onChange={(e) =>
                setFormData({ ...formData, dateExpiration: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label className="block mb-2">Fichier *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="mx-auto mb-3 text-gray-400" size={48} />
              <div
                className="text-lg font-semibold"
                style={{ color: "#0A0A0A" }}
              >
                Choisir un fichier
              </div>
              <div className="text-sm mt-1" style={{ color: "#5A6470" }}>
                PDF, DOC, DOCX, JPG, PNG (max. 10MB)
              </div>
            </label>
            {formData.fichier && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="inline text-green-600 mr-2" size={16} />
                <span className="font-medium">{formData.fichier.name}</span>
              </div>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Label>Upload en cours...</Label>
            <Progress value={uploadProgress} className="w-full" />
            <div className="text-right text-sm" style={{ color: "#5A6470" }}>
              {uploadProgress}%
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={!formData.fichier || !formData.nom || isUploading}
            style={{ backgroundColor: "#0052FF", color: "white" }}
          >
            <Upload className="mr-2" size={16} />
            Uploader le document
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Composant Modal Éditeur Contrat
const ModalEditeurContrat = ({ isOpen, onClose, contrat, onSave }) => {
  const [contenu, setContenu] = useState("");
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (contrat) {
      setContenu(contrat.contenu);
      setNom(contrat.nom);
      setDescription(contrat.description);
    } else {
      setContenu("");
      setNom("");
      setDescription("");
    }
  }, [contrat]);

  const handleSave = async () => {
    try {
      const variables = extraireVariables(contenu);
      const contratModifie = {
        nom,
        description,
        contenu,
        variables,
      };

      if (contrat?.id) {
        contratModifie.id = contrat.id;
      }

      const savedContrat = await documentService.saveContratType(
        contratModifie
      );
      onSave(savedContrat);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du contrat:", error);
    }
  };

  const extraireVariables = (texte) => {
    const regex = /\[(.*?)\]/g;
    const variables = [];
    let match;
    while ((match = regex.exec(texte)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  const variables = extraireVariables(contenu);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contrat ? "Modifier le contrat" : "Nouveau contrat type"}
      size="xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block mb-2">Nom du contrat *</Label>
            <Input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Mandat Exclusif de Vente"
            />
          </div>
          <div>
            <Label className="block mb-2">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du contrat..."
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Contenu du contrat *</Label>
            <Badge variant="outline">
              {variables.length} variable(s) détectée(s)
            </Badge>
          </div>
          <Textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            rows={20}
            placeholder="Saisissez le contenu de votre contrat...
Utilisez [NOM_VARIABLE] pour les parties variables..."
            className="font-mono text-sm"
          />
          <div className="mt-2 text-sm" style={{ color: "#5A6470" }}>
            Astuce : Entourez les variables avec des crochets [EXEMPLE]
          </div>
        </div>

        {variables.length > 0 && (
          <div>
            <Label className="block mb-2">Variables détectées</Label>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable, index) => (
                <Badge key={index} variant="secondary">
                  [{variable}]
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={!nom || !contenu}
            style={{ backgroundColor: "#0052FF", color: "white" }}
          >
            <Save className="mr-2" size={16} />
            Sauvegarder le contrat
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [archives, setArchives] = useState([]);
  const [documentsImmobiliersList, setDocumentsImmobiliersList] = useState([]);
  const [filtres, setFiltres] = useState({
    recherche: "",
    type: "",
    statut: "",
  });
  const [filtresImmobilier, setFiltresImmobilier] = useState({
    recherche: "",
    categorie: "",
  });
  const [ongletActif, setOngletActif] = useState("documents");
  const [showModalUpload, setShowModalUpload] = useState(false);
  const [showModalUploadImmobilier, setShowModalUploadImmobilier] =
    useState(false);
  const [showModalEditeur, setShowModalEditeur] = useState(false);
  const [contratSelectionne, setContratSelectionne] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    expirant: 0,
    expire: 0,
    contrats: 0,
    immobilier: 0,
  });

  // Charger les données initiales
  useEffect(() => {
    chargerDonnees();
  }, []);

  // Dans le composant DocumentsPage, modifiez chargerDonnees()
  const chargerDonnees = async () => {
    try {
      setLoading(true);

      const [documentsData, contratsData, archivesData, statsData] =
        await Promise.all([
          documentService.getDocuments(),
          documentService.getContratsTypes(),
          documentService.getArchivesSignes(),
          documentService.getStats(),
        ]);

      setDocuments(documentsData || []);
      setContrats(contratsData || []);
      setArchives(archivesData || []);
      setStats(
        statsData || {
          total: 0,
          expirant: 0,
          expire: 0,
          contrats: 0,
          immobilier: 0,
        }
      );

      // Filtrer les documents immobiliers
      const docsImmobiliers = (documentsData || []).filter(
        (doc) => doc.type === "IMMOBILIER"
      );
      setDocumentsImmobiliersList(docsImmobiliers);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      // Initialiser avec des tableaux vides en cas d'erreur
      setDocuments([]);
      setContrats([]);
      setArchives([]);
      setDocumentsImmobiliersList([]);
      setStats({
        total: 0,
        expirant: 0,
        expire: 0,
        contrats: 0,
        immobilier: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les documents
  const documentsFiltres = documents.filter((doc) => {
    const matchRecherche =
      !filtres.recherche ||
      doc.nom.toLowerCase().includes(filtres.recherche.toLowerCase());
    const matchType = !filtres.type || doc.type === filtres.type;
    const matchStatut = !filtres.statut || doc.statut === filtres.statut;

    return matchRecherche && matchType && matchStatut;
  });

  // Filtrer les documents immobiliers
  const documentsImmobiliersFiltres = documentsImmobiliersList.filter((doc) => {
    const matchRecherche =
      !filtresImmobilier.recherche ||
      doc.nom.toLowerCase().includes(filtresImmobilier.recherche.toLowerCase());
    const matchCategorie =
      !filtresImmobilier.categorie ||
      doc.categorie === filtresImmobilier.categorie;

    return matchRecherche && matchCategorie;
  });

  // Gestion des documents
  const uploadDocument = (nouveauDocument) => {
    setDocuments([nouveauDocument, ...documents]);
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
    }));
  };

  const uploadDocumentImmobilier = (nouveauDocument) => {
    setDocumentsImmobiliersList([nouveauDocument, ...documentsImmobiliersList]);
    setDocuments([nouveauDocument, ...documents]);
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      immobilier: prev.immobilier + 1,
    }));
  };

  const supprimerDocument = async (id) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const supprimerDocumentImmobilier = async (id) => {
    try {
      await documentService.deleteDocument(id);
      setDocumentsImmobiliersList(
        documentsImmobiliersList.filter((doc) => doc.id !== id)
      );
      setDocuments(documents.filter((doc) => doc.id !== id));
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        immobilier: prev.immobilier - 1,
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const telechargerDocument = async (document) => {
    try {
      // Pour Supabase, on peut soit:
      // 1. Ouvrir directement l'URL dans un nouvel onglet
      window.open(document.url, "_blank");

      // Ou 2. Télécharger via une requête API si besoin d'authentification
      // const response = await documentService.downloadDocument(document.id);
      // const downloadUrl = response.downloadUrl;

      // Créer un lien de téléchargement
      const link = document.createElement("a");
      link.href = document.url;
      link.download = document.nom + "." + document.format.toLowerCase();
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      // Fallback: ouvrir l'URL directement
      window.open(document.url, "_blank");
    }
  };

  // Gestion des contrats
  const sauvegarderContrat = (contrat) => {
    if (contrat.id && contrats.find((c) => c.id === contrat.id)) {
      setContrats(contrats.map((c) => (c.id === contrat.id ? contrat : c)));
    } else {
      setContrats([...contrats, contrat]);
      setStats((prev) => ({
        ...prev,
        contrats: prev.contrats + 1,
      }));
    }
  };

  const supprimerContrat = async (id) => {
    try {
      await documentService.deleteContratType(id);
      setContrats(contrats.filter((c) => c.id !== id));
      setStats((prev) => ({
        ...prev,
        contrats: prev.contrats - 1,
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression du contrat:", error);
    }
  };

  const dupliquerContrat = (contrat) => {
    const nouveauContrat = {
      ...contrat,
      id: null,
      nom: `${contrat.nom} (Copie)`,
      utilise: 0,
    };
    setContrats([...contrats, nouveauContrat]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: "#0A0A0A" }}>
                Documents & Légal
              </h1>
              <p className="text-lg" style={{ color: "#5A6470" }}>
                Gérez vos documents professionnels et contrats types
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-3">
            <Button
              variant="outline"
              onClick={() => setShowModalUploadImmobilier(true)}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <Home className="mr-2" size={16} />
              Document Immobilier
            </Button>
            <Button
              style={{ backgroundColor: "#0052FF", color: "white" }}
              onClick={() => setShowModalUpload(true)}
            >
              <Upload className="mr-2" size={16} />
              Uploader un document
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {stats.total}
                </div>
                <div style={{ color: "#5A6470" }}>Documents</div>
              </div>
              <FileText className="text-blue-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {stats.expirant}
                </div>
                <div style={{ color: "#5A6470" }}>Expirant bientôt</div>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {stats.expire}
                </div>
                <div style={{ color: "#5A6470" }}>Expirés</div>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {stats.contrats}
                </div>
                <div style={{ color: "#5A6470" }}>Contrats types</div>
              </div>
              <FileCheck className="text-green-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600 mb-2">
                  {stats.immobilier}
                </div>
                <div style={{ color: "#5A6470" }}>Documents immobiliers</div>
              </div>
              <Home className="text-indigo-600" size={24} />
            </div>
          </Card>
        </div>

        {/* Navigation par onglets */}
        <Card className="mb-8">
          <div className="border-b">
            <div className="flex flex-wrap -mb-px">
              {[
                { id: "documents", label: "Documents", icon: FileText },
                { id: "contrats", label: "Contrats Types", icon: FileCheck },
                {
                  id: "immobilier",
                  label: "Documents Immobiliers",
                  icon: Home,
                },
                { id: "cgv", label: "CGV/CGU", icon: Shield },
                { id: "archives", label: "Archives Signés", icon: Archive },
              ].map((onglet) => {
                const Icon = onglet.icon;
                return (
                  <button
                    key={onglet.id}
                    className={`flex items-center gap-2 p-4 border-b-2 font-medium text-sm ${
                      ongletActif === onglet.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setOngletActif(onglet.id)}
                  >
                    <Icon size={16} />
                    {onglet.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {/* Onglet Documents */}
          {ongletActif === "documents" && (
            <>
              {/* Barre de filtres */}
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Input
                      placeholder="Rechercher un document..."
                      className="pl-10"
                      value={filtres.recherche}
                      onChange={(e) =>
                        setFiltres({ ...filtres, recherche: e.target.value })
                      }
                    />
                  </div>

                  <select
                    className="p-2 border rounded-lg"
                    value={filtres.type}
                    onChange={(e) =>
                      setFiltres({ ...filtres, type: e.target.value })
                    }
                  >
                    <option value="">Tous les types</option>
                    {Object.entries(TYPES_DOCUMENTS).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className="p-2 border rounded-lg"
                    value={filtres.statut}
                    onChange={(e) =>
                      setFiltres({ ...filtres, statut: e.target.value })
                    }
                  >
                    <option value="">Tous les statuts</option>
                    {Object.entries(STATUT_DOCUMENT).map(([key, statut]) => (
                      <option key={key} value={key}>
                        {statut.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              {/* Liste des documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentsFiltres.map((document) => {
                  const TypeIcon =
                    TYPES_DOCUMENTS[document.type]?.icon || FileText;
                  return (
                    <Card
                      key={document.id}
                      className="p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              TYPES_DOCUMENTS[document.type]?.color
                            }`}
                          >
                            <TypeIcon size={20} />
                          </div>
                          <div>
                            <Badge
                              className={STATUT_DOCUMENT[document.statut].color}
                            >
                              {STATUT_DOCUMENT[document.statut].label}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => telechargerDocument(document)}
                          >
                            <Download size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => supprimerDocument(document.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      <h3
                        className="font-semibold mb-2 line-clamp-2"
                        style={{ color: "#0A0A0A" }}
                      >
                        {document.nom}
                      </h3>

                      {document.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {document.description}
                        </p>
                      )}

                      <div
                        className="space-y-2 text-sm"
                        style={{ color: "#5A6470" }}
                      >
                        <div className="flex justify-between">
                          <span>Uploadé le:</span>
                          <span>
                            {new Date(document.dateUpload).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                        {document.dateExpiration && (
                          <div className="flex justify-between">
                            <span>Expire le:</span>
                            <span
                              className={
                                document.statut === "EXPIRE"
                                  ? "text-red-600 font-semibold"
                                  : document.statut === "EXPIRANT"
                                  ? "text-yellow-600 font-semibold"
                                  : ""
                              }
                            >
                              {new Date(
                                document.dateExpiration
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>
                            {document.format} • {document.taille}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {document.tags &&
                          document.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {documentsFiltres.length === 0 && (
                <Card className="p-12 text-center">
                  <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "#0A0A0A" }}
                  >
                    Aucun document trouvé
                  </h3>
                  <p style={{ color: "#5A6470" }}>
                    {filtres.recherche || filtres.type || filtres.statut
                      ? "Essayez de modifier vos critères de recherche"
                      : "Commencez par uploader votre premier document"}
                  </p>
                </Card>
              )}
            </>
          )}

          {/* Onglet Documents Immobiliers */}
          {ongletActif === "immobilier" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "#0A0A0A" }}
                  >
                    Documents Immobiliers
                  </h2>
                  <p style={{ color: "#5A6470" }}>
                    Gérez vos revenus fonciers, baux de location, quittances de
                    loyer et autres documents immobiliers
                  </p>
                </div>
                <Button
                  onClick={() => setShowModalUploadImmobilier(true)}
                  style={{ backgroundColor: "#0052FF", color: "white" }}
                >
                  <Upload className="mr-2" size={16} />
                  Uploader un document
                </Button>
              </div>

              {/* Barre de filtres immobiliers */}
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Input
                      placeholder="Rechercher un document immobilier..."
                      className="pl-10"
                      value={filtresImmobilier.recherche}
                      onChange={(e) =>
                        setFiltresImmobilier({
                          ...filtresImmobilier,
                          recherche: e.target.value,
                        })
                      }
                    />
                  </div>

                  <select
                    className="p-2 border rounded-lg"
                    value={filtresImmobilier.categorie}
                    onChange={(e) =>
                      setFiltresImmobilier({
                        ...filtresImmobilier,
                        categorie: e.target.value,
                      })
                    }
                  >
                    <option value="">Toutes les catégories</option>
                    {Object.entries(CATEGORIES_IMMOBILIER).map(
                      ([key, categorie]) => (
                        <option key={key} value={key}>
                          {categorie.label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </Card>

              {/* Statistiques rapides immobilières */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(CATEGORIES_IMMOBILIER).map(
                  ([key, categorie]) => {
                    const count = documentsImmobiliersList.filter(
                      (doc) => doc.categorie === key
                    ).length;
                    const Icon = categorie.icon;
                    return (
                      <Card key={key} className="p-4 text-center">
                        <div
                          className={`p-2 rounded-lg ${categorie.color} w-12 h-12 mx-auto mb-2 flex items-center justify-center`}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="text-lg font-bold">{count}</div>
                        <div className="text-xs" style={{ color: "#5A6470" }}>
                          {categorie.label}
                        </div>
                      </Card>
                    );
                  }
                )}
              </div>

              {/* Liste des documents immobiliers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentsImmobiliersFiltres.map((document) => {
                  const CategorieIcon =
                    CATEGORIES_IMMOBILIER[document.categorie]?.icon || FileText;
                  const categorie = CATEGORIES_IMMOBILIER[document.categorie];
                  return (
                    <Card
                      key={document.id}
                      className="p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${categorie?.color}`}>
                            <CategorieIcon size={20} />
                          </div>
                          <div>
                            <Badge className={categorie?.color}>
                              {categorie?.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => telechargerDocument(document)}
                          >
                            <Download size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              supprimerDocumentImmobilier(document.id)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      <h3
                        className="font-semibold mb-2 line-clamp-2"
                        style={{ color: "#0A0A0A" }}
                      >
                        {document.nom}
                      </h3>

                      {document.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {document.description}
                        </p>
                      )}

                      <div
                        className="space-y-2 text-sm"
                        style={{ color: "#5A6470" }}
                      >
                        <div className="flex justify-between">
                          <span>Uploadé le:</span>
                          <span>
                            {new Date(document.dateUpload).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                        {document.dateExpiration && (
                          <div className="flex justify-between">
                            <span>Expire le:</span>
                            <span
                              className={
                                document.statut === "EXPIRE"
                                  ? "text-red-600 font-semibold"
                                  : document.statut === "EXPIRANT"
                                  ? "text-yellow-600 font-semibold"
                                  : ""
                              }
                            >
                              {new Date(
                                document.dateExpiration
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>
                            {document.format} • {document.taille}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {document.tags &&
                          document.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {documentsImmobiliersFiltres.length === 0 && (
                <Card className="p-12 text-center">
                  <Home className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "#0A0A0A" }}
                  >
                    Aucun document immobilier trouvé
                  </h3>
                  <p style={{ color: "#5A6470" }}>
                    {filtresImmobilier.recherche || filtresImmobilier.categorie
                      ? "Essayez de modifier vos critères de recherche"
                      : "Commencez par uploader votre premier document immobilier"}
                  </p>
                </Card>
              )}
            </>
          )}

          {/* Onglet Contrats Types */}
          {ongletActif === "contrats" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: "#0A0A0A" }}>
                  Contrats Types Modifiables
                </h2>
                <Button
                  onClick={() => {
                    setContratSelectionne(null);
                    setShowModalEditeur(true);
                  }}
                  style={{ backgroundColor: "#0052FF", color: "white" }}
                >
                  <Plus className="mr-2" size={16} />
                  Nouveau contrat
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contrats.map((contrat) => (
                  <Card
                    key={contrat.id}
                    className="p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline">
                        {contrat.variables.length} variables
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setContratSelectionne(contrat);
                            setShowModalEditeur(true);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dupliquerContrat(contrat)}
                        >
                          <FileText size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => supprimerContrat(contrat.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <h3
                      className="font-semibold mb-2"
                      style={{ color: "#0A0A0A" }}
                    >
                      {contrat.nom}
                    </h3>

                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: "#5A6470" }}
                    >
                      {contrat.description}
                    </p>

                    <div
                      className="space-y-2 text-sm"
                      style={{ color: "#5A6470" }}
                    >
                      <div className="flex justify-between">
                        <span>Utilisé:</span>
                        <span className="font-semibold">
                          {contrat.utilise} fois
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dernière modification:</span>
                        <span>
                          {new Date(
                            contrat.derniereModification
                          ).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" variant="outline">
                      <Download className="mr-2" size={16} />
                      Télécharger le modèle
                    </Button>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Onglet Archives */}
          {ongletActif === "archives" && (
            <>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "#0A0A0A" }}
              >
                Archives des Documents Signés
              </h2>

              <div className="space-y-4">
                {archives.map((archive) => (
                  <Card
                    key={archive.id}
                    className="p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            TYPES_DOCUMENTS[archive.type]?.color
                          }`}
                        >
                          <FileText size={20} />
                        </div>
                        <div>
                          <Badge className="bg-green-100 text-green-800">
                            {archive.statut}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye size={16} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>

                    <h3
                      className="font-semibold mb-3"
                      style={{ color: "#0A0A0A" }}
                    >
                      {archive.nom}
                    </h3>

                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                      style={{ color: "#5A6470" }}
                    >
                      <div>
                        <div className="font-medium mb-1">Parties:</div>
                        <div>{archive.parties.join(", ")}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Bien:</div>
                        <div>{archive.bien}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">
                          Date de signature:
                        </div>
                        <div>
                          {new Date(archive.dateSignature).toLocaleDateString(
                            "fr-FR"
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Référence:</div>
                        <div>{archive.reference}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modales */}
      <ModalUploadDocument
        isOpen={showModalUpload}
        onClose={() => setShowModalUpload(false)}
        onUpload={uploadDocument}
      />

      <ModalUploadDocument
        isOpen={showModalUploadImmobilier}
        onClose={() => setShowModalUploadImmobilier(false)}
        onUpload={uploadDocumentImmobilier}
        typeDocument="IMMOBILIER"
      />

      <ModalEditeurContrat
        isOpen={showModalEditeur}
        onClose={() => {
          setShowModalEditeur(false);
          setContratSelectionne(null);
        }}
        contrat={contratSelectionne}
        onSave={sauvegarderContrat}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DocumentsPage;
