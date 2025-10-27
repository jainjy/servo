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

// Types de documents
const TYPES_DOCUMENTS = {
  ASSURANCE: {
    label: "Assurance",
    color: "bg-blue-100 text-blue-800",
    icon: Shield,
  },
  DIPLOME: {
    label: "Diplôme",
    color: "bg-green-100 text-green-800",
    icon: Award,
  },
  CERTIFICATION: {
    label: "Certification",
    color: "bg-purple-100 text-purple-800",
    icon: FileCheck,
  },
  CONTRAT: {
    label: "Contrat",
    color: "bg-orange-100 text-orange-800",
    icon: FileText,
  },
  CGV: { label: "CGV/CGU", color: "bg-red-100 text-red-800", icon: Shield },
  ARCHIVE: {
    label: "Archive",
    color: "bg-gray-100 text-gray-800",
    icon: Archive,
  },
  IMMOBILIER: {
    label: "Immobilier",
    color: "bg-indigo-100 text-indigo-800",
    icon: Home,
  },
};

const STATUT_DOCUMENT = {
  VALIDE: { label: "Valide", color: "bg-green-100 text-green-800" },
  EXPIRANT: { label: "Expirant", color: "bg-yellow-100 text-yellow-800" },
  EXPIRE: { label: "Expiré", color: "bg-red-100 text-red-800" },
  EN_ATTENTE: { label: "En attente", color: "bg-blue-100 text-blue-800" },
};

// Données initiales
const documentsInitiaux = [
  {
    id: 1,
    nom: "Assurance Responsabilité Civile Professionnelle",
    type: "ASSURANCE",
    dateExpiration: "2024-12-31",
    dateUpload: "2024-01-15",
    statut: "VALIDE",
    taille: "2.4 MB",
    format: "PDF",
    url: "/documents/assurance-rcp.pdf",
    tags: ["Obligatoire", "Annuel"],
  },
  {
    id: 2,
    nom: "Diplôme Agent Immobilier",
    type: "DIPLOME",
    dateExpiration: null,
    dateUpload: "2023-06-20",
    statut: "VALIDE",
    taille: "1.8 MB",
    format: "PDF",
    url: "/documents/diplome-agent.pdf",
    tags: ["Formation", "Certifié"],
  },
  {
    id: 3,
    nom: "Certification AMF",
    type: "CERTIFICATION",
    dateExpiration: "2024-06-30",
    dateUpload: "2023-12-15",
    statut: "EXPIRANT",
    taille: "3.1 MB",
    format: "PDF",
    url: "/documents/certification-amf.pdf",
    tags: ["Réglementaire", "Annuel"],
  },
  {
    id: 4,
    nom: "Contrat de Mandat Exclusif",
    type: "CONTRAT",
    dateExpiration: null,
    dateUpload: "2024-01-10",
    statut: "VALIDE",
    taille: "1.2 MB",
    format: "DOCX",
    url: "/documents/mandat-exclusif.docx",
    tags: ["Modèle", "Vente"],
  },
  {
    id: 5,
    nom: "Conditions Générales de Vente",
    type: "CGV",
    dateExpiration: null,
    dateUpload: "2024-01-05",
    statut: "VALIDE",
    taille: "0.9 MB",
    format: "PDF",
    url: "/documents/cgv.pdf",
    tags: ["Légal", "Standard"],
  },
  {
    id: 6,
    nom: "Revenu Foncier 2023",
    type: "IMMOBILIER",
    dateExpiration: null,
    dateUpload: "2024-03-01",
    statut: "VALIDE",
    taille: "1.5 MB",
    format: "PDF",
    url: "/documents/revenu-foncier-2023.pdf",
    tags: ["Fiscal", "Annuel"],
  },
];

const contratsTypes = [
  {
    id: 1,
    nom: "Mandat Exclusif de Vente",
    description:
      "Contrat standard pour la vente exclusive d'un bien immobilier",
    contenu: `CONTRAT DE MANDAT EXCLUSIF DE VENTE

Entre les soussignés :
[PROPRIETAIRE], propriétaire du bien situé à [ADRESSE]
et
[AGENCE], agence immobilière représentée par [NOM_AGENT]

ARTICLE 1 - OBJET
Le propriétaire donne mandat exclusif à l'agence pour la vente du bien...

ARTICLE 2 - DURÉE
Le présent mandat est conclu pour une durée de [DUREE] mois...`,
    variables: [
      "PROPRIETAIRE",
      "ADRESSE",
      "AGENCE",
      "NOM_AGENT",
      "DUREE",
      "PRIX",
      "COMMISSION",
    ],
    utilise: 45,
    derniereModification: "2024-01-10",
  },
  {
    id: 2,
    nom: "Contrat de Location",
    description: "Contrat type pour la location d'un bien immobilier",
    contenu: `CONTRAT DE LOCATION D'HABITATION

Entre :
[BAILLEUR], propriétaire du logement situé à [ADRESSE]
et
[LOCATAIRE], demeurant à [ADRESSE_LOCATAIRE]

ARTICLE 1 - OBJET
Le présent contrat a pour objet la location du logement...`,
    variables: [
      "BAILLEUR",
      "ADRESSE",
      "LOCATAIRE",
      "ADRESSE_LOCATAIRE",
      "LOYER",
      "CAUTION",
      "DURÉE",
    ],
    utilise: 32,
    derniereModification: "2024-01-08",
  },
  {
    id: 3,
    nom: "Compromis de Vente",
    description: "Contrat type pour le compromis de vente immobilier",
    contenu: `COMPROMIS DE VENTE IMMOBILIÈRE

Entre :
[VENDEUR], propriétaire du bien situé à [ADRESSE]
et
[ACHETEUR], demeurant à [ADRESSE_ACHETEUR]

ARTICLE 1 - OBJET
Par le présent compromis, les parties conviennent de la vente...`,
    variables: [
      "VENDEUR",
      "ADRESSE",
      "ACHETEUR",
      "ADRESSE_ACHETEUR",
      "PRIX",
      "DATE_SIGNATURE",
      "NOTAIRE",
    ],
    utilise: 28,
    derniereModification: "2024-01-12",
  },
];

const archivesSignes = [
  {
    id: 1,
    nom: "Contrat de vente - Villa Les Roses",
    type: "CONTRAT",
    dateSignature: "2024-01-15",
    parties: ["DUPONT Martin", "LEFEBVRE Sophie"],
    bien: "45 Villa Les Roses, 92100 Boulogne",
    reference: "VENTE-2024-001",
    url: "/archives/vente-villa-roses.pdf",
    statut: "SIGNÉ",
  },
  {
    id: 2,
    nom: "Contrat location - Appartement République",
    type: "CONTRAT",
    dateSignature: "2024-01-10",
    parties: ["PETIT Julie", "MOREAU Thomas"],
    bien: "78 Avenue de la République, 75011 Paris",
    reference: "LOC-2024-015",
    url: "/archives/location-republique.pdf",
    statut: "SIGNÉ",
  },
];

// Nouveaux documents immobiliers
const documentsImmobiliers = [
  {
    id: 1,
    nom: "Revenu Foncier 2023 - Résidence Les Cèdres",
    type: "IMMOBILIER",
    dateExpiration: null,
    dateUpload: "2024-03-01",
    statut: "VALIDE",
    taille: "1.5 MB",
    format: "PDF",
    url: "/documents/immobilier/revenu-foncier-cedres-2023.pdf",
    tags: ["Fiscal", "Annuel", "Déclaration"],
    categorie: "REVENU_FONCIER",
  },
  {
    id: 2,
    nom: "Bail Location - Appartement T2 République",
    type: "IMMOBILIER",
    dateExpiration: "2025-06-30",
    dateUpload: "2024-01-15",
    statut: "VALIDE",
    taille: "2.1 MB",
    format: "PDF",
    url: "/documents/immobilier/bail-republique-t2.pdf",
    tags: ["Location", "Contrat", "Actif"],
    categorie: "BAIL_LOCATION",
  },
  {
    id: 3,
    nom: "Quittance Loyer Mars 2024 - M. Martin",
    type: "IMMOBILIER",
    dateExpiration: null,
    dateUpload: "2024-03-05",
    statut: "VALIDE",
    taille: "0.8 MB",
    format: "PDF",
    url: "/documents/immobilier/quittance-martin-mars-2024.pdf",
    tags: ["Quittance", "Loyer", "Mensuel"],
    categorie: "QUITTANCE_LOYER",
  },
  {
    id: 4,
    nom: "État des Lieux Entrée - Studio Montmartre",
    type: "IMMOBILIER",
    dateExpiration: null,
    dateUpload: "2024-02-10",
    statut: "VALIDE",
    taille: "3.2 MB",
    format: "PDF",
    url: "/documents/immobilier/etat-lieux-entree-montmartre.pdf",
    tags: ["État des lieux", "Entrée", "Photos"],
    categorie: "ETAT_LIEUX",
  },
  {
    id: 5,
    nom: "Contrat de Gestion - Immeuble Les Hauts",
    type: "IMMOBILIER",
    dateExpiration: "2026-12-31",
    dateUpload: "2024-01-20",
    statut: "VALIDE",
    taille: "4.5 MB",
    format: "PDF",
    url: "/documents/immobilier/contrat-gestion-immeuble-hauts.pdf",
    tags: ["Gestion", "Syndic", "Long terme"],
    categorie: "GESTION",
  },
];

// Catégories de documents immobiliers
const CATEGORIES_IMMOBILIER = {
  REVENU_FONCIER: {
    label: "Revenu Foncier",
    icon: Banknote,
    color: "bg-green-100 text-green-800",
  },
  BAIL_LOCATION: {
    label: "Bail de Location",
    icon: FileSignature,
    color: "bg-blue-100 text-blue-800",
  },
  QUITTANCE_LOYER: {
    label: "Quittance de Loyer",
    icon: Receipt,
    color: "bg-purple-100 text-purple-800",
  },
  ETAT_LIEUX: {
    label: "État des Lieux",
    icon: Home,
    color: "bg-orange-100 text-orange-800",
  },
  GESTION: {
    label: "Gestion Immobilière",
    icon: Building,
    color: "bg-indigo-100 text-indigo-800",
  },
  AUTRE: { label: "Autre", icon: FileText, color: "bg-gray-100 text-gray-800" },
};

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

    // Simulation upload
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const nouveauDocument = {
      id: Date.now(),
      nom: formData.nom,
      type: formData.type,
      dateExpiration: formData.dateExpiration || null,
      dateUpload: new Date().toISOString().split("T")[0],
      statut: formData.dateExpiration ? "VALIDE" : "VALIDE",
      taille: `${(formData.fichier.size / 1024 / 1024).toFixed(1)} MB`,
      format: formData.fichier.name.split(".").pop().toUpperCase(),
      url: URL.createObjectURL(formData.fichier),
      tags: ["Nouveau"],
    };

    // Ajouter la catégorie pour les documents immobiliers
    if (formData.type === "IMMOBILIER") {
      nouveauDocument.categorie = formData.categorie;
      nouveauDocument.tags = [
        CATEGORIES_IMMOBILIER[formData.categorie]?.label || "Immobilier",
      ];
    }

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
    });
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

  const handleSave = () => {
    const contratModifie = {
      id: contrat?.id || Date.now(),
      nom,
      description,
      contenu,
      variables: extraireVariables(contenu),
      utilise: contrat?.utilise || 0,
      derniereModification: new Date().toISOString().split("T")[0],
    };

    onSave(contratModifie);
    onClose();
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
  const [documents, setDocuments] = useState(documentsInitiaux);
  const [contrats, setContrats] = useState(contratsTypes);
  const [archives, setArchives] = useState(archivesSignes);
  const [documentsImmobiliersList, setDocumentsImmobiliersList] =
    useState(documentsImmobiliers);
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
  };

  const uploadDocumentImmobilier = (nouveauDocument) => {
    setDocumentsImmobiliersList([nouveauDocument, ...documentsImmobiliersList]);
  };

  const supprimerDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const supprimerDocumentImmobilier = (id) => {
    setDocumentsImmobiliersList(
      documentsImmobiliersList.filter((doc) => doc.id !== id)
    );
  };

  const telechargerDocument = (url, nom) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = nom;
    link.click();
  };

  // Gestion des contrats
  const sauvegarderContrat = (contrat) => {
    if (contrat.id && contrats.find((c) => c.id === contrat.id)) {
      setContrats(contrats.map((c) => (c.id === contrat.id ? contrat : c)));
    } else {
      setContrats([...contrats, contrat]);
    }
  };

  const supprimerContrat = (id) => {
    setContrats(contrats.filter((c) => c.id !== id));
  };

  const dupliquerContrat = (contrat) => {
    const nouveauContrat = {
      ...contrat,
      id: Date.now(),
      nom: `${contrat.nom} (Copie)`,
      utilise: 0,
    };
    setContrats([...contrats, nouveauContrat]);
  };

  // Statistiques
  const stats = {
    total: documents.length,
    expirant: documents.filter((d) => d.statut === "EXPIRANT").length,
    expire: documents.filter((d) => d.statut === "EXPIRE").length,
    contrats: contrats.length,
    immobilier: documentsImmobiliersList.length,
  };

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
                            onClick={() =>
                              telechargerDocument(document.url, document.nom)
                            }
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
                        {document.tags.map((tag, index) => (
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
                            onClick={() =>
                              telechargerDocument(document.url, document.nom)
                            }
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
                        {document.tags.map((tag, index) => (
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
