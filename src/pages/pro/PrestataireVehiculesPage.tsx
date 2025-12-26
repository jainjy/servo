import React, { useState, useEffect } from "react";
import {
  Plus,
  Car,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageCircle,
  Download,
  BarChart3,
  Settings,
  Upload,
  MapPin,
  Fuel,
  Cog,
  Shield,
  Star,
  ChevronRight,
  RefreshCw,
  MoreVertical,
  X,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  FileText,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { vehiculesApi } from "@/lib/api/vehicules";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PdfImage,
} from "@react-pdf/renderer";

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#8B4513",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontSize: 10,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
});

// Composant Document PDF
const ContractDocument = ({ reservation }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* En-tête */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>CONTRAT DE LOCATION</Text>
          <Text style={styles.subtitle}>Réf: {reservation.id}</Text>
          <Text style={styles.subtitle}>
            Date: {format(new Date(), "dd/MM/yyyy")}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#556B2F" }}>
            OLIPLUS
          </Text>
        </View>
      </View>

      {/* Informations Prestataire & Client */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: "48%",
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
            LOUEUR (Prestataire)
          </Text>
          <Text style={styles.value}>
            {reservation.prestataire?.companyName || "Société Partenaire"}
          </Text>
          <Text style={styles.value}>{reservation.prestataire?.email}</Text>
          <Text style={styles.value}>{reservation.prestataire?.phone}</Text>
          <Text style={styles.value}>
            {reservation.prestataire?.address || "Adresse non renseignée"}
          </Text>
        </View>
        <View
          style={{
            width: "48%",
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
            LOCATAIRE (Client)
          </Text>
          <Text style={styles.value}>
            {reservation.nomClient ||
              `${reservation.client?.firstName} ${reservation.client?.lastName}`}
          </Text>
          <Text style={styles.value}>{reservation.emailClient}</Text>
          <Text style={styles.value}>{reservation.telephoneClient}</Text>
          <Text style={styles.value}>
            Permis: {reservation.numeroPermis || "Non renseigné"}
          </Text>
        </View>
      </View>

      {/* Véhicule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VÉHICULE LOUÉ</Text>
        {/* Catégorie */}
        <View style={styles.row}>
          <Text style={styles.label}>Catégorie :</Text>
          <Text style={styles.value}>
            {reservation.vehicule.categorie?.toUpperCase() || "VOITURE"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type :</Text>
          <Text style={styles.value}>{reservation.vehicule.typeVehicule}</Text>
        </View>

        {/* Spécificités selon la catégorie */}
        {reservation.vehicule.categorie === "moto" &&
          reservation.vehicule.cylindree && (
            <View style={styles.row}>
              <Text style={styles.label}>Cylindrée :</Text>
              <Text style={styles.value}>
                {reservation.vehicule.cylindree} cm³
              </Text>
            </View>
          )}

        {reservation.vehicule.categorie === "velo" && (
          <View style={styles.row}>
            <Text style={styles.label}>Type vélo :</Text>
            <Text style={styles.value}>
              {reservation.vehicule.typeVelo}
              {reservation.vehicule.assistanceElec ? " (Électrique)" : ""}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Marque / Modèle :</Text>
          <Text style={styles.value}>
            {reservation.vehicule.marque} {reservation.vehicule.modele}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Immatriculation :</Text>
          <Text style={styles.value}>
            {reservation.vehicule.immatriculation || "Non assignée"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Carburant :</Text>
          <Text style={styles.value}>{reservation.vehicule.carburant}</Text>
        </View>
      </View>

      {/* Détails Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DÉTAILS DE LA LOCATION</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Départ :</Text>
          <Text style={styles.value}>
            {format(new Date(reservation.datePrise), "dd/MM/yyyy HH:mm")} à{" "}
            {reservation.lieuPrise}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Retour :</Text>
          <Text style={styles.value}>
            {format(new Date(reservation.dateRetour), "dd/MM/yyyy HH:mm")} à{" "}
            {reservation.lieuRetour}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kilométrage :</Text>
          <Text style={styles.value}>
            {reservation.kilometrageOption || "Standard"}
          </Text>
        </View>
      </View>

      {/* Financier */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMATIONS FINANCIÈRES</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Montant Total :</Text>
          <Text style={{ ...styles.value, fontWeight: "bold" }}>
            {reservation.totalTTC?.toFixed(2)} €
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Caution (bloquée) :</Text>
          <Text style={styles.value}>
            {reservation.cautionBloquee || reservation.vehicule.caution || 0} €
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Statut Paiement :</Text>
          <Text style={styles.value}>{reservation.statutPaiement}</Text>
        </View>
      </View>

      {/* Signatures */}
      <View
        style={{
          marginTop: 30,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "40%", borderTopWidth: 1, paddingTop: 5 }}>
          <Text style={{ fontSize: 10, textAlign: "center" }}>
            Signature du Loueur
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: "center",
              color: "#999",
              marginTop: 30,
            }}
          >
            (Cachet et signature)
          </Text>
        </View>
        <View style={{ width: "40%", borderTopWidth: 1, paddingTop: 5 }}>
          <Text style={{ fontSize: 10, textAlign: "center" }}>
            Signature du Locataire
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: "center",
              color: "#999",
              marginTop: 30,
            }}
          >
            ("Lu et approuvé")
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Ce document est généré automatiquement par la plateforme OLIPLUS.
        Conditions générales de location applicables.
      </Text>
    </Page>
  </Document>
);

const PrestataireVehiculesPage = () => {
  const [vehicules, setVehicules] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicules");
  const [showAddVehicule, setShowAddVehicule] = useState(false);
  const [showEditVehicule, setShowEditVehicule] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const { user } = useAuth();

  // Formulaire de confirmation de paiement
  const [paymentForm, setPaymentForm] = useState({
    montant: 0,
    methode: "virement",
    dateReceived: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  });

  // Formulaire véhicule avec les nouvelles catégories
  const [vehiculeForm, setVehiculeForm] = useState({
    // Champs existants
    marque: "",
    modele: "",
    annee: new Date().getFullYear(),
    immatriculation: "",
    couleur: "",
    puissance: "",

    // NOUVEAUX CHAMPS CATÉGORIE
    categorie: "voiture", // Par défaut
    typeVehicule: "economique",

    // Champs spécifiques moto/vélo
    cylindree: "",
    typeVelo: "vtt",
    assistanceElec: false,
    poids: "",

    // Champs existants
    carburant: "essence",
    transmission: "manuelle",
    places: 5,
    portes: 5,
    volumeCoffre: "",
    ville: "",
    adresse: "",
    latitude: "",
    longitude: "",
    prixJour: 50,
    prixSemaine: 300,
    prixMois: 1000,
    kilometrageInclus: "300 km/jour",
    caution: 500,
    description: "",
    agence: user?.companyName || user?.commercialName || "",
    conditionsLocation: "",
    disponible: true,
  });

  const [stats, setStats] = useState({
    totalVehicules: 0,
    disponibles: 0,
    totalReservations: 0,
    revenuTotal: 0,
    tauxOccupation: 0,
    reservationsMois: 0,
    revenuMois: 0,
    clientsActifs: 0,
    statsParCategorie: {},
  });

  // Types et options
  const categoriesVehicules = [
    { id: "voiture", label: "Voiture", icon: Car },
    { id: "camion", label: "Camion", icon: Package },
    { id: "moto", label: "Moto", icon: Car },
    { id: "velo", label: "Vélo", icon: Car },
  ];

  // Types de véhicules selon la catégorie
  const typesVehicules = [
    { id: "economique", label: "Économique", icon: Car, categorie: "voiture" },
    { id: "compacte", label: "Compacte", icon: Car, categorie: "voiture" },
    { id: "berline", label: "Berline", icon: Car, categorie: "voiture" },
    { id: "suv", label: "SUV & 4x4", icon: Car, categorie: "voiture" },
    { id: "luxe", label: "Luxe & Premium", icon: Car, categorie: "voiture" },
    {
      id: "utilitaire",
      label: "Utilitaire",
      icon: Package,
      categorie: "voiture",
    },
    { id: "minibus", label: "Minibus", icon: Users, categorie: "voiture" },
  ];

  const typesCamion = [
    { id: "camionnette", label: "Camionnette", icon: Package },
    { id: "camion", label: "Camion", icon: Package },
    { id: "poids_lourd", label: "Poids lourd", icon: Package },
  ];

  const typesMoto = [
    { id: "sportive", label: "Sportive", icon: Car },
    { id: "routiere", label: "Routière", icon: Car },
    { id: "custom", label: "Custom", icon: Car },
    { id: "trail", label: "Trail", icon: Car },
    { id: "scooter", label: "Scooter", icon: Car },
  ];

  const typesVelo = [
    { id: "vtt", label: "VTT", icon: Car },
    { id: "vtc", label: "VTC", icon: Car },
    { id: "route", label: "Route", icon: Car },
    { id: "electrique", label: "Électrique", icon: Car },
    { id: "ville", label: "Ville", icon: Car },
  ];

  const carburants = [
    { id: "essence", label: "Essence", icon: Fuel },
    { id: "diesel", label: "Diesel", icon: Fuel },
    { id: "electrique", label: "Électrique", icon: Fuel },
    { id: "hybride", label: "Hybride", icon: Fuel },
    { id: "gpl", label: "GPL", icon: Fuel },
  ];

  const transmissions = [
    { id: "manuelle", label: "Manuelle", icon: Cog },
    { id: "automatique", label: "Automatique", icon: Cog },
    { id: "semi_automatique", label: "Semi-automatique", icon: Cog },
  ];

  const villes = [
    "Saint-Denis",
    "Saint-Pierre",
    "Saint-Paul",
    "Le Tampon",
    "Saint-Louis",
    "Saint-Joseph",
    "Sainte-Marie",
    "Sainte-Suzanne",
  ];

  const statusConfig = {
    en_attente: {
      label: "En attente",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    confirmee: {
      label: "Confirmée",
      color: "bg-blue-100 text-blue-800",
      icon: CheckCircle,
    },
    en_cours: {
      label: "En cours",
      color: "bg-purple-100 text-purple-800",
      icon: Car,
    },
    terminee: {
      label: "Terminée",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    annulee: {
      label: "Annulée",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  };

  // Fonction pour obtenir les types selon la catégorie
  const getTypesByCategorie = (categorie) => {
    switch (categorie) {
      case "voiture":
        return typesVehicules;
      case "camion":
        return typesCamion;
      case "moto":
        return typesMoto;
      case "velo":
        return typesVelo;
      default:
        return typesVehicules;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Récupérer les véhicules du prestataire
      const vehiculesResponse = await vehiculesApi.getVehiculesByPrestataire(
        user.id
      );
      setVehicules(vehiculesResponse.data.data || []);
      console.log("Véhicules récupérés:", vehiculesResponse.data.data);

      // Récupérer les réservations
      const reservationsResponse = await vehiculesApi.getMesReservations();
      const prestataireReservations = reservationsResponse.data.data.filter(
        (r) => r.prestataireId === user.id
      );
      setReservations(prestataireReservations);

      // Calculer les statistiques
      calculateStats(
        vehiculesResponse.data.data || [],
        prestataireReservations
      );

      toast.success("Données mises à jour");
    } catch (error) {
      console.error("Erreur chargement données:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (vehiculesList, reservationsList) => {
    const totalVehicules = vehiculesList.length;
    const disponibles = vehiculesList.filter((v) => v.disponible).length;
    const totalReservations = reservationsList.length;
    const revenuTotal = reservationsList.reduce(
      (sum, r) => sum + (r.totalTTC || 0),
      0
    );
    const reservationsMois = reservationsList.filter(
      (r) => new Date(r.createdAt).getMonth() === new Date().getMonth()
    ).length;
    const revenuMois = reservationsList
      .filter((r) => new Date(r.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, r) => sum + (r.totalTTC || 0), 0);

    // Clients uniques
    const clientsUniques = [...new Set(reservationsList.map((r) => r.clientId))]
      .length;

    // Taux d'occupation approximatif
    const tauxOccupation =
      totalVehicules > 0
        ? (reservationsList.filter((r) =>
            ["en_cours", "confirmee"].includes(r.statut)
          ).length /
            totalVehicules) *
          100
        : 0;

    // Statistiques par catégorie
    const statsParCategorie = vehiculesList.reduce((acc, vehicule) => {
      const categorie = vehicule.categorie || "voiture";
      if (!acc[categorie]) {
        acc[categorie] = 0;
      }
      acc[categorie]++;
      return acc;
    }, {});

    setStats({
      totalVehicules,
      disponibles,
      totalReservations,
      revenuTotal,
      tauxOccupation: Math.round(tauxOccupation),
      reservationsMois,
      revenuMois,
      clientsActifs: clientsUniques,
      statsParCategorie,
    });
  };

  const handleAddVehicule = async () => {
    try {
      // Validation des champs obligatoires
      if (
        !vehiculeForm.marque ||
        !vehiculeForm.modele ||
        !vehiculeForm.ville ||
        !vehiculeForm.prixJour
      ) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      // Validation de l'immatriculation (sauf pour les vélos)
      if (vehiculeForm.categorie !== "velo" && !vehiculeForm.immatriculation) {
        toast.error("Veuillez saisir l'immatriculation");
        return;
      }

      // Validation des images
      if (newImages.length === 0) {
        toast.error("Veuillez ajouter au moins une image du véhicule");
        return;
      }

      setIsSubmitting(true);
      setUploadingImages(true);

      // Créer FormData pour l'envoi des fichiers
      const formData = new FormData();

      // Ajouter les champs texte
      Object.keys(vehiculeForm).forEach((key) => {
        if (key !== "assistanceElec") {
          formData.append(key, vehiculeForm[key]);
        }
      });

      // Gérer le champ boolean séparément
      formData.append(
        "assistanceElec",
        vehiculeForm.assistanceElec ? "true" : "false"
      );

      // Ajouter les images
      newImages.forEach((file, index) => {
        formData.append("images", file);
      });

      // Afficher la progression
      toast.loading("Ajout du véhicule en cours...", {
        id: "add-vehicule",
      });

      const response = await vehiculesApi.createVehicule(formData);

      toast.success("Véhicule ajouté avec succès !", {
        id: "add-vehicule",
      });

      setShowAddVehicule(false);
      resetVehiculeForm();
      fetchData();
    } catch (error) {
      console.error("Erreur ajout véhicule:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de l'ajout du véhicule",
        {
          id: "add-vehicule",
        }
      );
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  const handleUpdateVehicule = async () => {
    if (!selectedVehicule) return;

    try {
      setIsSubmitting(true);
      setUploadingImages(true);

      // Validation de l'immatriculation (sauf pour les vélos)
      if (vehiculeForm.categorie !== "velo" && !vehiculeForm.immatriculation) {
        toast.error("Veuillez saisir l'immatriculation");
        return;
      }

      // Créer FormData pour l'envoi des fichiers
      const formData = new FormData();

      // Ajouter les champs texte
      Object.keys(vehiculeForm).forEach((key) => {
        if (key !== "assistanceElec") {
          formData.append(key, vehiculeForm[key]);
        }
      });

      // Gérer le champ boolean séparément
      formData.append(
        "assistanceElec",
        vehiculeForm.assistanceElec ? "true" : "false"
      );

      // Ajouter les images existantes (URLs)
      if (existingImages && existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Ajouter les nouvelles images
      newImages.forEach((file, index) => {
        formData.append("images", file);
      });

      toast.loading("Mise à jour du véhicule en cours...", {
        id: "update-vehicule",
      });

      const response = await vehiculesApi.updateVehicule(
        selectedVehicule.id,
        formData
      );

      toast.success("Véhicule mis à jour avec succès !", {
        id: "update-vehicule",
      });

      setShowEditVehicule(false);
      resetVehiculeForm();
      fetchData();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast.error(
        error.response?.data?.error ||
          "Erreur lors de la mise à jour du véhicule",
        {
          id: "update-vehicule",
        }
      );
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  const handleDeleteVehicule = async (vehiculeId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      toast.loading("Suppression en cours...", {
        id: "delete-vehicule",
      });

      await vehiculesApi.deleteVehicule(vehiculeId);

      toast.success("Véhicule supprimé avec succès", {
        id: "delete-vehicule",
      });

      fetchData();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression",
        {
          id: "delete-vehicule",
        }
      );
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      toast.loading("Suppression en cours...", {
        id: "delete-reservation",
      });

      await vehiculesApi.deleteReservation(reservationId);

      toast.success("Réservation supprimée avec succès", {
        id: "delete-reservation",
      });

      fetchData();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression",
        {
          id: "delete-reservation",
        }
      );
    }
  };

  const handleDownloadContract = async (reservation) => {
    const toastId = toast.loading("Génération du contrat PDF...");
    try {
      // Générer le blob PDF
      const blob = await pdf(
        <ContractDocument reservation={reservation} />
      ).toBlob();

      // Créer une URL et déclencher le téléchargement
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Contrat_Location_${reservation.id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Contrat téléchargé avec succès", { id: toastId });
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      toast.error("Erreur lors de la génération du contrat", { id: toastId });
    }
  };

  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      toast.loading("Mise à jour du statut...", {
        id: "update-status",
      });

      await vehiculesApi.updateReservationStatus(reservationId, {
        statut: newStatus,
      });

      toast.success("Statut mis à jour avec succès", {
        id: "update-status",
      });

      fetchData();
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      toast.error("Erreur lors de la mise à jour", {
        id: "update-status",
      });
    }
  };

  const resetVehiculeForm = () => {
    setVehiculeForm({
      marque: "",
      modele: "",
      annee: new Date().getFullYear(),
      immatriculation: "",
      couleur: "",
      puissance: "",
      categorie: "voiture",
      typeVehicule: "economique",
      cylindree: "",
      typeVelo: "vtt",
      assistanceElec: false,
      poids: "",
      carburant: "essence",
      transmission: "manuelle",
      places: 5,
      portes: 5,
      volumeCoffre: "",
      ville: "",
      adresse: "",
      latitude: "",
      longitude: "",
      prixJour: 50,
      prixSemaine: 300,
      prixMois: 1000,
      kilometrageInclus: "300 km/jour",
      caution: 500,
      description: "",
      agence: user?.companyName || user?.commercialName || "",
      conditionsLocation: "",
      disponible: true,
    });
    setNewImages([]);
    setExistingImages([]);
  };

  const openEditVehicule = (vehicule) => {
    setSelectedVehicule(vehicule);
    setVehiculeForm({
      marque: vehicule.marque,
      modele: vehicule.modele,
      annee: vehicule.annee,
      immatriculation: vehicule.immatriculation,
      couleur: vehicule.couleur,
      puissance: vehicule.puissance || "",
      categorie: vehicule.categorie || "voiture",
      typeVehicule: vehicule.typeVehicule || "economique",
      cylindree: vehicule.cylindree || "",
      typeVelo: vehicule.typeVelo || "vtt",
      assistanceElec: vehicule.assistanceElec || false,
      poids: vehicule.poids || "",
      carburant: vehicule.carburant,
      transmission: vehicule.transmission,
      places: vehicule.places || 5,
      portes: vehicule.portes || 5,
      volumeCoffre: vehicule.volumeCoffre || "",
      ville: vehicule.ville,
      adresse: vehicule.adresse || "",
      latitude: vehicule.latitude || "",
      longitude: vehicule.longitude || "",
      prixJour: vehicule.prixJour,
      prixSemaine: vehicule.prixSemaine || 300,
      prixMois: vehicule.prixMois || 1000,
      kilometrageInclus: vehicule.kilometrageInclus || "300 km/jour",
      caution: vehicule.caution,
      description: vehicule.description || "",
      agence:
        vehicule.agence || user?.companyName || user?.commercialName || "",
      conditionsLocation: vehicule.conditionsLocation || "",
      disponible: vehicule.disponible ?? true,
    });

    setExistingImages(vehicule.images || []);
    setNewImages([]);
    setShowEditVehicule(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validation des fichiers
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB max
        toast.error(`${file.name} dépasse la taille maximale de 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image valide`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Limiter à 10 images max
    const totalImages =
      existingImages.length + newImages.length + validFiles.length;
    if (totalImages > 10) {
      toast.error("Maximum 10 images autorisées");
      return;
    }

    setNewImages((prev) => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} image(s) ajoutée(s)`);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.vehicule?.marque
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.vehicule?.modele
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.client?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.client?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "tous" || reservation.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredVehicules = vehicules.filter(
    (vehicule) =>
      vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.immatriculation
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      vehicule.categorie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.typeVehicule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderImagePreview = (image, index, isNew = false) => {
    const src = isNew ? URL.createObjectURL(image) : image;

    return (
      <div key={index} className="relative group">
        <img
          src={src}
          alt={`Prévisualisation ${index + 1}`}
          className="h-24 w-full object-cover rounded-lg border"
        />
        <button
          type="button"
          onClick={() =>
            isNew ? removeNewImage(index) : removeExistingImage(index)
          }
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        {isNew && (
          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Nouveau
          </div>
        )}
      </div>
    );
  };

  const handleConfirmPayment = async () => {
    try {
      if (!selectedReservation) return;

      // Validation
      if (!paymentForm.montant || paymentForm.montant <= 0) {
        toast.error("Veuillez entrer un montant valide");
        return;
      }

      if (!paymentForm.reference) {
        toast.error("Veuillez entrer une référence de paiement");
        return;
      }

      setIsSubmitting(true);

      await vehiculesApi.confirmPayment(selectedReservation.id, {
        montant: parseFloat(paymentForm.montant),
        methode: paymentForm.methode,
        dateReceived: new Date(paymentForm.dateReceived),
        reference: paymentForm.reference,
        notes: paymentForm.notes,
      });

      toast.success("Paiement confirmé avec succès");
      setShowPaymentConfirmation(false);
      resetPaymentForm();
      fetchData();
    } catch (error) {
      console.error("Erreur confirmation paiement:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la confirmation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      montant: selectedReservation?.totalTTC || 0,
      methode: "virement",
      dateReceived: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    });
  };

  const openPaymentConfirmation = (reservation) => {
    setSelectedReservation(reservation);
    setPaymentForm({
      montant: reservation.totalTTC || 0,
      methode: "virement",
      dateReceived: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    });
    setShowPaymentConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des véhicules et réservations
            </h1>
            <p className="text-gray-600">
              Gérez votre flotte de véhicules et suivez vos réservations
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Actualiser
            </Button>

            <Button onClick={() => setShowStats(true)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistiques
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Véhicules actifs</p>
                  <p className="text-2xl font-bold">{stats.totalVehicules}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <span
                      className={`font-medium ${
                        stats.disponibles > 0
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {stats.disponibles} disponibles
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {stats.totalVehicules - stats.disponibles} indisponibles
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Car className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Réservations totales</p>
                  <p className="text-2xl font-bold">
                    {stats.totalReservations}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-medium text-blue-600">
                      {stats.reservationsMois} ce mois
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenu total</p>
                  <p className="text-2xl font-bold">
                    {stats.revenuTotal.toFixed(0)}€
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-medium text-green-600">
                      {stats.revenuMois.toFixed(0)}€ ce mois
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Taux d'occupation</p>
                  <p className="text-2xl font-bold">{stats.tauxOccupation}%</p>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-medium text-orange-600">
                      {stats.clientsActifs} clients actifs
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicateur de chargement principal */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">
                  Chargement des données...
                </p>
                <Progress value={50} className="h-1 mt-1" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="vehicules"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
            >
              <Car className="h-4 w-4 mr-2" />
              Véhicules ({vehicules.length})
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Réservations ({reservations.length})
            </TabsTrigger>
          </TabsList>

          {/* Onglet Véhicules */}
          <TabsContent value="vehicules" className="space-y-4">
            {/* Barre d'actions */}
            <Card className="shadow-sm border">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un véhicule par marque, modèle, catégorie ou type..."
                      className="pl-10 bg-gray-50 border-gray-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={() => {
                      resetVehiculeForm();
                      setShowAddVehicule(true);
                    }}
                    className="bg-[#8B4513] hover:bg-[#6B3410]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un véhicule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des véhicules */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse border">
                    <CardContent className="pt-6">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredVehicules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicules.map((vehicule) => (
                  <Card
                    key={vehicule.id}
                    className="hover:shadow-lg transition-all duration-300 border hover:border-gray-300"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {vehicule.marque} {vehicule.modele}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{vehicule.annee}</span>
                            <span className="text-gray-400">•</span>
                            <span className="capitalize">
                              {vehicule.categorie}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="capitalize">
                              {vehicule.carburant}
                            </span>
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openEditVehicule(vehicule)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSelectedVehicule(vehicule)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteVehicule(vehicule.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="h-48 mb-4 rounded-lg overflow-hidden">
                        {vehicule.images && vehicule.images.length > 0 ? (
                          <img
                            src={vehicule.images[0]}
                            alt={vehicule.marque}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                vehicule.disponible ? "default" : "destructive"
                              }
                              className="font-medium"
                            >
                              {vehicule.disponible
                                ? "Disponible"
                                : "Indisponible"}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {vehicule.typeVehicule}
                            </Badge>
                          </div>
                          <div className="text-xl font-bold text-[#8B4513]">
                            {vehicule.prixJour}€
                            <span className="text-sm font-normal">/jour</span>
                          </div>
                        </div>

                        {/* Spécificités selon la catégorie */}
                        {vehicule.categorie === "moto" &&
                          vehicule.cylindree && (
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Cog className="h-4 w-4" />
                              <span>Cylindrée: {vehicule.cylindree} cm³</span>
                            </div>
                          )}

                        {vehicule.categorie === "velo" && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <span>Type: {vehicule.typeVelo}</span>
                            {vehicule.assistanceElec && (
                              <Badge variant="outline" className="text-xs">
                                Électrique
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{vehicule.ville}</span>
                          </div>
                          {(vehicule.categorie === "voiture" ||
                            vehicule.categorie === "camion") && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Fuel className="h-4 w-4" />
                              <span className="capitalize">
                                {vehicule.carburant}
                              </span>
                            </div>
                          )}
                          {(vehicule.categorie === "voiture" ||
                            vehicule.categorie === "camion") && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Cog className="h-4 w-4" />
                              <span className="capitalize">
                                {vehicule.transmission}
                              </span>
                            </div>
                          )}
                          {vehicule.categorie === "voiture" && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>{vehicule.places} places</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {vehicule.rating?.toFixed(1) || "N/A"}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({vehicule.nombreAvis || 0} avis)
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicule.nombreReservations || 0} location(s)
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t pt-4">
                      <Button
                        className="w-full"
                        onClick={() => openEditVehicule(vehicule)}
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier ce véhicule
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="pt-12 pb-12 text-center">
                  <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {searchTerm
                      ? "Aucun véhicule trouvé"
                      : "Aucun véhicule enregistré"}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm
                      ? "Aucun véhicule ne correspond à votre recherche. Essayez d'autres termes."
                      : "Commencez par ajouter votre premier véhicule à louer sur la plateforme."}
                  </p>
                  <Button
                    onClick={() => setShowAddVehicule(true)}
                    className="bg-[#8B4513] hover:bg-[#6B3410]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre premier véhicule
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Réservations */}
          <TabsContent value="reservations" className="space-y-4">
            {/* Filtres réservations */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher une réservation..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={fetchData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cartes des réservations */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse border">
                    <CardContent className="pt-6">
                      <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredReservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReservations.map((reservation) => {
                  const StatusConfig = statusConfig[reservation.statut];
                  const StatusIcon = StatusConfig?.icon || AlertCircle;

                  return (
                    <Card
                      key={reservation.id}
                      className="hover:shadow-lg transition-all duration-300 border hover:border-gray-300 flex flex-col"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              Réservation #{reservation.id.slice(0, 8)}
                            </CardTitle>
                            <CardDescription>
                              {format(
                                new Date(reservation.datePrise),
                                "dd MMM yyyy",
                                { locale: fr }
                              )}
                            </CardDescription>
                          </div>
                          <Badge className={StatusConfig?.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {StatusConfig?.label}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-4">
                        {/* Véhicule */}
                        <div className="border-b pb-3">
                          <p className="text-xs text-gray-500 mb-2">Véhicule</p>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  reservation.vehicule?.images?.[0] ||
                                  "https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=100&auto=format&fit=crop"
                                }
                                alt="véhicule"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">
                                {reservation.vehicule?.marque}{" "}
                                {reservation.vehicule?.modele}
                              </div>
                              <div className="text-xs text-gray-500">
                                {reservation.vehicule?.annee}
                              </div>
                              <div className="text-xs text-gray-500">
                                {reservation.vehicule?.categorie} •{" "}
                                {reservation.vehicule?.typeVehicule}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Client */}
                        <div className="border-b pb-3">
                          <p className="text-xs text-gray-500 mb-2">Client</p>
                          <div className="font-semibold text-sm">
                            {reservation.client?.firstName}{" "}
                            {reservation.client?.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {reservation.client?.email}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="border-b pb-3">
                          <p className="text-xs text-gray-500 mb-2">Période</p>
                          <div className="text-sm">
                            <div className="font-medium">
                              {format(
                                new Date(reservation.datePrise),
                                "dd/MM/yy"
                              )}{" "}
                              →{" "}
                              {format(
                                new Date(reservation.dateRetour),
                                "dd/MM/yy"
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.ceil(
                                (new Date(reservation.dateRetour) -
                                  new Date(reservation.datePrise)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              jour(s)
                            </div>
                          </div>
                        </div>

                        {/* Montant */}
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Montant</p>
                          <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold text-[#8B4513]">
                              {reservation.totalTTC?.toFixed(2)}€
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {reservation.statutPaiement}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="border-t pt-4 flex gap-2 flex-col">
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowReservationDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                          <Button
                            className="flex-1"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadContract(reservation)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Contrat
                          </Button>
                          {reservation.statutPaiement !== "paye" && (
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                              onClick={() =>
                                openPaymentConfirmation(reservation)
                              }
                              title="Confirmer manuellement que le paiement a été reçu"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmer paiement
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>

                              {["en_attente", "confirmee", "en_cours"].includes(
                                reservation.statut
                              ) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>
                                    Changer statut
                                  </DropdownMenuLabel>
                                  {reservation.statut === "en_attente" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateReservationStatus(
                                          reservation.id,
                                          "confirmee"
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                      Confirmer
                                    </DropdownMenuItem>
                                  )}
                                  {reservation.statut === "confirmee" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateReservationStatus(
                                          reservation.id,
                                          "en_cours"
                                        )
                                      }
                                    >
                                      <Car className="h-4 w-4 mr-2 text-purple-600" />
                                      Débuter location
                                    </DropdownMenuItem>
                                  )}
                                  {reservation.statut === "en_cours" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateReservationStatus(
                                          reservation.id,
                                          "terminee"
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                      Terminer location
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateReservationStatus(
                                        reservation.id,
                                        "annulee"
                                      )
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Annuler
                                  </DropdownMenuItem>
                                </>
                              )}

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteReservation(reservation.id)
                                }
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="pt-12 pb-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Aucune réservation trouvée
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== "tous"
                      ? "Aucune réservation ne correspond à vos critères"
                      : "Vous n'avez pas encore de réservations"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Ajout véhicule */}
      <Dialog open={showAddVehicule} onOpenChange={setShowAddVehicule}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Ajouter un nouveau véhicule
            </DialogTitle>
            <DialogDescription>
              Remplissez tous les champs obligatoires pour ajouter un véhicule à
              votre flotte
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Section Catégorie */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                <Car className="h-5 w-5" />
                Catégorie et type
              </h3>
              <p className="text-sm text-blue-600">
                Champs marqués d'un * sont obligatoires
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Catégorie *</Label>
                <Select
                  value={vehiculeForm.categorie}
                  onValueChange={(value) => {
                    setVehiculeForm({
                      ...vehiculeForm,
                      categorie: value,
                      typeVehicule:
                        value === "voiture"
                          ? "economique"
                          : value === "moto"
                          ? "sportive"
                          : value === "velo"
                          ? "vtt"
                          : "camionnette",
                    });
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesVehicules.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type *</Label>
                <Select
                  value={vehiculeForm.typeVehicule}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, typeVehicule: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getTypesByCategorie(vehiculeForm.categorie).map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Champs spécifiques moto */}
            {vehiculeForm.categorie === "moto" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cylindree">Cylindrée (cm³)</Label>
                  <Input
                    id="cylindree"
                    type="number"
                    value={vehiculeForm.cylindree}
                    onChange={(e) =>
                      setVehiculeForm({
                        ...vehiculeForm,
                        cylindree: e.target.value,
                      })
                    }
                    placeholder="Ex: 600, 1000..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Champs spécifiques vélo */}
            {vehiculeForm.categorie === "velo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typeVelo">Type de vélo</Label>
                  <Select
                    value={vehiculeForm.typeVelo}
                    onValueChange={(value) =>
                      setVehiculeForm({ ...vehiculeForm, typeVelo: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typesVelo.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="poids">Poids (kg)</Label>
                  <Input
                    id="poids"
                    type="number"
                    step="0.1"
                    value={vehiculeForm.poids}
                    onChange={(e) =>
                      setVehiculeForm({
                        ...vehiculeForm,
                        poids: e.target.value,
                      })
                    }
                    placeholder="Ex: 12.5"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="assistanceElec"
                    checked={vehiculeForm.assistanceElec}
                    onCheckedChange={(checked) =>
                      setVehiculeForm({
                        ...vehiculeForm,
                        assistanceElec: checked,
                      })
                    }
                  />
                  <Label htmlFor="assistanceElec">Assistance électrique</Label>
                </div>
              </div>
            )}

            {/* Champs pour voitures et camions */}
            {(vehiculeForm.categorie === "voiture" ||
              vehiculeForm.categorie === "camion") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="places">Nombre de places</Label>
                  <Input
                    id="places"
                    type="number"
                    value={vehiculeForm.places}
                    onChange={(e) =>
                      setVehiculeForm({
                        ...vehiculeForm,
                        places: parseInt(e.target.value) || 5,
                      })
                    }
                    min="1"
                    className="mt-1"
                  />
                </div>
                {vehiculeForm.categorie === "voiture" && (
                  <div>
                    <Label htmlFor="portes">Nombre de portes</Label>
                    <Input
                      id="portes"
                      type="number"
                      value={vehiculeForm.portes}
                      onChange={(e) =>
                        setVehiculeForm({
                          ...vehiculeForm,
                          portes: parseInt(e.target.value) || 5,
                        })
                      }
                      min="1"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Section Informations générales */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <Car className="h-5 w-5" />
                Informations générales
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marque" className="required">
                  Marque *
                </Label>
                <Input
                  id="marque"
                  value={vehiculeForm.marque}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, marque: e.target.value })
                  }
                  placeholder="Ex: Toyota, Renault, Peugeot..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="modele" className="required">
                  Modèle *
                </Label>
                <Input
                  id="modele"
                  value={vehiculeForm.modele}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, modele: e.target.value })
                  }
                  placeholder="Ex: Yaris, Clio, 3008..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="immatriculation" className="required">
                  Immatriculation {vehiculeForm.categorie !== "velo" && "*"}
                </Label>
                <Input
                  id="immatriculation"
                  value={vehiculeForm.immatriculation}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      immatriculation: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Ex: AB-123-CD"
                  className="mt-1 uppercase"
                />
                {vehiculeForm.categorie !== "velo" ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Format: XX-123-XX
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Optionnel pour les vélos
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="annee">Année</Label>
                <Input
                  id="annee"
                  type="number"
                  value={vehiculeForm.annee}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      annee:
                        parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Caractéristiques techniques pour voitures et camions */}
            {(vehiculeForm.categorie === "voiture" ||
              vehiculeForm.categorie === "camion") && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                    <Cog className="h-5 w-5" />
                    Caractéristiques techniques
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Carburant</Label>
                    <Select
                      value={vehiculeForm.carburant}
                      onValueChange={(value) =>
                        setVehiculeForm({ ...vehiculeForm, carburant: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {carburants.map((carburant) => (
                          <SelectItem key={carburant.id} value={carburant.id}>
                            {carburant.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {vehiculeForm.categorie === "voiture" && (
                    <div>
                      <Label>Transmission</Label>
                      <Select
                        value={vehiculeForm.transmission}
                        onValueChange={(value) =>
                          setVehiculeForm({
                            ...vehiculeForm,
                            transmission: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {transmissions.map((trans) => (
                            <SelectItem key={trans.id} value={trans.id}>
                              {trans.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="volumeCoffre">Volume du coffre (L)</Label>
                    <Input
                      id="volumeCoffre"
                      value={vehiculeForm.volumeCoffre}
                      onChange={(e) =>
                        setVehiculeForm({
                          ...vehiculeForm,
                          volumeCoffre: e.target.value,
                        })
                      }
                      placeholder="Ex: 450"
                      className="mt-1"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Section Localisation et prix */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5" />
                Localisation et prix
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ville" className="required">
                  Ville *
                </Label>
                <Select
                  value={vehiculeForm.ville}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, ville: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {villes.map((ville) => (
                      <SelectItem key={ville} value={ville}>
                        {ville}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prixJour" className="required">
                  Prix par jour (€) *
                </Label>
                <Input
                  id="prixJour"
                  type="number"
                  value={vehiculeForm.prixJour}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      prixJour: parseFloat(e.target.value) || 50,
                    })
                  }
                  min="10"
                  step="5"
                  className="mt-1"
                />
                <div className="flex gap-2 mt-2">
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Semaine: {vehiculeForm.prixJour * 7 * 0.85}€
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Mois: {vehiculeForm.prixJour * 30 * 0.75}€
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={vehiculeForm.adresse}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      adresse: e.target.value,
                    })
                  }
                  placeholder="Adresse complète"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="caution">Caution (€)</Label>
                <Input
                  id="caution"
                  type="number"
                  value={vehiculeForm.caution}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      caution: parseFloat(e.target.value) || 500,
                    })
                  }
                  min="0"
                  step="50"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description du véhicule</Label>
              <Textarea
                id="description"
                value={vehiculeForm.description}
                onChange={(e) =>
                  setVehiculeForm({
                    ...vehiculeForm,
                    description: e.target.value,
                  })
                }
                placeholder="Décrivez votre véhicule, ses équipements, ses avantages, son état..."
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Une bonne description augmente vos chances de location
              </p>
            </div>

            {/* Section Images */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 flex items-center gap-2 mb-2">
                <ImageIcon className="h-5 w-5" />
                Images du véhicule
              </h3>
              <p className="text-sm text-purple-600">
                Ajoutez au moins une image claire et de qualité (max 10 images,
                5MB par image)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImages ? (
                      <Loader2 className="h-8 w-8 text-gray-400 mb-2 animate-spin" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">
                        Cliquez pour télécharger
                      </span>{" "}
                      ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG jusqu'à 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImages || newImages.length >= 10}
                  />
                </label>
              </div>

              {/* Avertissement si aucune image */}
              {newImages.length === 0 && existingImages.length === 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Aucune image sélectionnée
                      </p>
                      <p className="text-xs text-yellow-700">
                        Les véhicules avec des images ont 3 fois plus de chances
                        d'être loués.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Images existantes */}
              {existingImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Images existantes
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((img, index) =>
                      renderImagePreview(img, index, false)
                    )}
                  </div>
                </div>
              )}

              {/* Nouvelles images */}
              {newImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Nouvelles images ({newImages.length}/10)
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {newImages.map((img, index) =>
                      renderImagePreview(img, index, true)
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAddVehicule(false)}
              disabled={isSubmitting}
              className="border-gray-300"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddVehicule}
              disabled={isSubmitting || newImages.length === 0}
              className="bg-[#8B4513] hover:bg-[#6B3410]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le véhicule
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Modification véhicule */}
      <Dialog open={showEditVehicule} onOpenChange={setShowEditVehicule}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Modifier le véhicule</DialogTitle>
            <DialogDescription>
              {selectedVehicule?.marque} {selectedVehicule?.modele}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Section Catégorie */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                <Car className="h-5 w-5" />
                Catégorie et type
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Catégorie *</Label>
                <Select
                  value={vehiculeForm.categorie}
                  onValueChange={(value) => {
                    setVehiculeForm({
                      ...vehiculeForm,
                      categorie: value,
                      typeVehicule:
                        value === "voiture"
                          ? "economique"
                          : value === "moto"
                          ? "sportive"
                          : value === "velo"
                          ? "vtt"
                          : "camionnette",
                    });
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesVehicules.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type *</Label>
                <Select
                  value={vehiculeForm.typeVehicule}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, typeVehicule: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getTypesByCategorie(vehiculeForm.categorie).map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Champs spécifiques moto */}
            {vehiculeForm.categorie === "moto" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cylindree">Cylindrée (cm³)</Label>
                  <Input
                    id="edit-cylindree"
                    type="number"
                    value={vehiculeForm.cylindree}
                    onChange={(e) =>
                      setVehiculeForm({
                        ...vehiculeForm,
                        cylindree: e.target.value,
                      })
                    }
                    placeholder="Ex: 600, 1000..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Champs spécifiques vélo */}
            {vehiculeForm.categorie === "velo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-typeVelo">Type de vélo</Label>
                  <Select
                    value={vehiculeForm.typeVelo}
                    onValueChange={(value) =>
                      setVehiculeForm({ ...vehiculeForm, typeVelo: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typesVelo.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-poids">Poids (kg)</Label>
                  <Input
                    id="edit-poids"
                    type="number"
                    step="0.1"
                    value={vehiculeForm.poids}
                    onChange={(e) =>
                      setVehiculeForm({
                        ...vehiculeForm,
                        poids: e.target.value,
                      })
                    }
                    placeholder="Ex: 12.5"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-assistanceElec"
                    checked={vehiculeForm.assistanceElec}
                    onCheckedChange={(checked) =>
                      setVehiculeForm({
                        ...vehiculeForm,
                        assistanceElec: checked,
                      })
                    }
                  />
                  <Label htmlFor="edit-assistanceElec">
                    Assistance électrique
                  </Label>
                </div>
              </div>
            )}

            {/* Champs pour voitures et camions */}
            {(vehiculeForm.categorie === "voiture" ||
              vehiculeForm.categorie === "camion") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-places">Nombre de places</Label>
                  <Input
                    id="edit-places"
                    type="number"
                    value={vehiculeForm.places}
                    onChange={(e) =>
                      setVehiculeForm({
                        ...vehiculeForm,
                        places: parseInt(e.target.value) || 5,
                      })
                    }
                    min="1"
                    className="mt-1"
                  />
                </div>
                {vehiculeForm.categorie === "voiture" && (
                  <div>
                    <Label htmlFor="edit-portes">Nombre de portes</Label>
                    <Input
                      id="edit-portes"
                      type="number"
                      value={vehiculeForm.portes}
                      onChange={(e) =>
                        setVehiculeForm({
                          ...vehiculeForm,
                          portes: parseInt(e.target.value) || 5,
                        })
                      }
                      min="1"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Section Informations générales */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <Car className="h-5 w-5" />
                Informations générales
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-marque" className="required">
                  Marque *
                </Label>
                <Input
                  id="edit-marque"
                  value={vehiculeForm.marque}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, marque: e.target.value })
                  }
                  placeholder="Ex: Toyota, Renault, Peugeot..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-modele" className="required">
                  Modèle *
                </Label>
                <Input
                  id="edit-modele"
                  value={vehiculeForm.modele}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, modele: e.target.value })
                  }
                  placeholder="Ex: Yaris, Clio, 3008..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-immatriculation" className="required">
                  Immatriculation {vehiculeForm.categorie !== "velo" && "*"}
                </Label>
                <Input
                  id="edit-immatriculation"
                  value={vehiculeForm.immatriculation}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      immatriculation: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Ex: AB-123-CD"
                  className="mt-1 uppercase"
                />
                {vehiculeForm.categorie !== "velo" ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Format: XX-123-XX
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Optionnel pour les vélos
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-annee">Année</Label>
                <Input
                  id="edit-annee"
                  type="number"
                  value={vehiculeForm.annee}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      annee:
                        parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-couleur">Couleur</Label>
                <Input
                  id="edit-couleur"
                  value={vehiculeForm.couleur}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      couleur: e.target.value,
                    })
                  }
                  placeholder="Ex: Noir, Blanc, Bleu..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-puissance">Puissance (ch)</Label>
                <Input
                  id="edit-puissance"
                  type="number"
                  value={vehiculeForm.puissance}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      puissance: e.target.value,
                    })
                  }
                  placeholder="Ex: 110"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Caractéristiques techniques pour voitures et camions */}
            {(vehiculeForm.categorie === "voiture" ||
              vehiculeForm.categorie === "camion") && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                    <Cog className="h-5 w-5" />
                    Caractéristiques techniques
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Carburant</Label>
                    <Select
                      value={vehiculeForm.carburant}
                      onValueChange={(value) =>
                        setVehiculeForm({ ...vehiculeForm, carburant: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {carburants.map((carburant) => (
                          <SelectItem key={carburant.id} value={carburant.id}>
                            {carburant.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {vehiculeForm.categorie === "voiture" && (
                    <div>
                      <Label>Transmission</Label>
                      <Select
                        value={vehiculeForm.transmission}
                        onValueChange={(value) =>
                          setVehiculeForm({
                            ...vehiculeForm,
                            transmission: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {transmissions.map((trans) => (
                            <SelectItem key={trans.id} value={trans.id}>
                              {trans.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="edit-volumeCoffre">
                      Volume du coffre (L)
                    </Label>
                    <Input
                      id="edit-volumeCoffre"
                      value={vehiculeForm.volumeCoffre}
                      onChange={(e) =>
                        setVehiculeForm({
                          ...vehiculeForm,
                          volumeCoffre: e.target.value,
                        })
                      }
                      placeholder="Ex: 450"
                      className="mt-1"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Section Localisation et prix */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5" />
                Localisation et prix
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-ville" className="required">
                  Ville *
                </Label>
                <Select
                  value={vehiculeForm.ville}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, ville: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {villes.map((ville) => (
                      <SelectItem key={ville} value={ville}>
                        {ville}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-adresse">Adresse</Label>
                <Input
                  id="edit-adresse"
                  value={vehiculeForm.adresse}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      adresse: e.target.value,
                    })
                  }
                  placeholder="Adresse complète"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input
                  id="edit-latitude"
                  value={vehiculeForm.latitude}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      latitude: e.target.value,
                    })
                  }
                  placeholder="Ex: -21.1234"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input
                  id="edit-longitude"
                  value={vehiculeForm.longitude}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      longitude: e.target.value,
                    })
                  }
                  placeholder="Ex: 55.5678"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-prixJour" className="required">
                  Prix par jour (€) *
                </Label>
                <Input
                  id="edit-prixJour"
                  type="number"
                  value={vehiculeForm.prixJour}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      prixJour: parseFloat(e.target.value) || 50,
                    })
                  }
                  min="10"
                  step="5"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-prixSemaine">Prix semaine (€)</Label>
                <Input
                  id="edit-prixSemaine"
                  type="number"
                  value={vehiculeForm.prixSemaine}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      prixSemaine: parseFloat(e.target.value) || 300,
                    })
                  }
                  min="10"
                  step="5"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-prixMois">Prix mois (€)</Label>
                <Input
                  id="edit-prixMois"
                  type="number"
                  value={vehiculeForm.prixMois}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      prixMois: parseFloat(e.target.value) || 1000,
                    })
                  }
                  min="10"
                  step="5"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-kilometrageInclus">
                  Kilométrage inclus
                </Label>
                <Input
                  id="edit-kilometrageInclus"
                  value={vehiculeForm.kilometrageInclus}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      kilometrageInclus: e.target.value,
                    })
                  }
                  placeholder="Ex: 300 km/jour"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-caution">Caution (€)</Label>
                <Input
                  id="edit-caution"
                  type="number"
                  value={vehiculeForm.caution}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      caution: parseFloat(e.target.value) || 500,
                    })
                  }
                  min="0"
                  step="50"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-agence">Agence</Label>
                <Input
                  id="edit-agence"
                  value={vehiculeForm.agence}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, agence: e.target.value })
                  }
                  placeholder="Nom de l'agence"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description du véhicule</Label>
              <Textarea
                id="edit-description"
                value={vehiculeForm.description}
                onChange={(e) =>
                  setVehiculeForm({
                    ...vehiculeForm,
                    description: e.target.value,
                  })
                }
                placeholder="Décrivez votre véhicule, ses équipements, ses avantages, son état..."
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Une bonne description augmente vos chances de location
              </p>
            </div>

            <div>
              <Label htmlFor="edit-conditionsLocation">
                Conditions de location
              </Label>
              <Textarea
                id="edit-conditionsLocation"
                value={vehiculeForm.conditionsLocation}
                onChange={(e) =>
                  setVehiculeForm({
                    ...vehiculeForm,
                    conditionsLocation: e.target.value,
                  })
                }
                placeholder="Définissez vos conditions de location..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-disponible"
                checked={vehiculeForm.disponible}
                onCheckedChange={(checked) =>
                  setVehiculeForm({
                    ...vehiculeForm,
                    disponible: checked,
                  })
                }
              />
              <Label htmlFor="edit-disponible">Véhicule disponible</Label>
            </div>

            {/* Section Images */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 flex items-center gap-2 mb-2">
                <ImageIcon className="h-5 w-5" />
                Images du véhicule
              </h3>
              <p className="text-sm text-purple-600">
                Vous pouvez ajouter de nouvelles images ou supprimer les
                existantes
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImages ? (
                      <Loader2 className="h-8 w-8 text-gray-400 mb-2 animate-spin" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Ajouter des images</span>{" "}
                      (max 10 au total)
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG jusqu'à 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={
                      uploadingImages ||
                      existingImages.length + newImages.length >= 10
                    }
                  />
                </label>
              </div>

              {/* Images existantes */}
              {existingImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Images existantes ({existingImages.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((img, index) =>
                      renderImagePreview(img, index, false)
                    )}
                  </div>
                </div>
              )}

              {/* Nouvelles images */}
              {newImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Nouvelles images à ajouter ({newImages.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {newImages.map((img, index) =>
                      renderImagePreview(img, index, true)
                    )}
                  </div>
                </div>
              )}

              {/* Total images */}
              <div className="mt-4 text-sm text-gray-600">
                Total: {existingImages.length + newImages.length}/10 images
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowEditVehicule(false)}
              disabled={isSubmitting}
              className="border-gray-300"
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpdateVehicule}
              disabled={isSubmitting}
              className="bg-[#8B4513] hover:bg-[#6B3410]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Mettre à jour le véhicule
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Statistiques détaillées */}
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Statistiques détaillées</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {stats.totalVehicules}
                    </div>
                    <p className="text-sm text-gray-500">Véhicules</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {stats.disponibles}
                    </div>
                    <p className="text-sm text-gray-500">Disponibles</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {stats.totalReservations}
                    </div>
                    <p className="text-sm text-gray-500">
                      Réservations totales
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {stats.revenuTotal.toFixed(0)}€
                    </div>
                    <p className="text-sm text-gray-500">Revenu total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.statsParCategorie).map(
                      ([categorie, count]) => {
                        const categorieInfo = categoriesVehicules.find(
                          (c) => c.id === categorie
                        ) || { label: categorie };
                        const percentage =
                          stats.totalVehicules > 0
                            ? (count / stats.totalVehicules) * 100
                            : 0;

                        return (
                          <div
                            key={categorie}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {categorieInfo.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Réservations par statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(statusConfig).map(([key, config]) => {
                      const count = reservations.filter(
                        (r) => r.statut === key
                      ).length;
                      const percentage =
                        reservations.length > 0
                          ? (count / reservations.length) * 100
                          : 0;

                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            <span className="text-sm">{config.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: config.color
                                    .split(" ")[0]
                                    .replace("bg-", ""),
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.reservationsMois}
                      </div>
                      <p className="text-sm text-gray-500">
                        Réservations ce mois
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.revenuMois.toFixed(0)}€
                      </div>
                      <p className="text-sm text-gray-500">Revenu ce mois</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.tauxOccupation}%
                      </div>
                      <p className="text-sm text-gray-500">Taux d'occupation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStats(false)}>
              Fermer
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exporter les statistiques
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Détails Réservation */}
      <Dialog
        open={showReservationDetails}
        onOpenChange={setShowReservationDetails}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
            <DialogDescription>
              Réservation #{selectedReservation?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              {/* Statut */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Statut actuel</p>
                  <p className="font-semibold">
                    {statusConfig[selectedReservation.statut]?.label}
                  </p>
                </div>
                <Badge
                  className={statusConfig[selectedReservation.statut]?.color}
                >
                  {statusConfig[selectedReservation.statut]?.label}
                </Badge>
              </div>

              {/* Véhicule */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">Véhicule</h3>
                <div className="flex gap-4">
                  <div className="h-24 w-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        selectedReservation.vehicule?.images?.[0] ||
                        "https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=200&auto=format&fit=crop"
                      }
                      alt="véhicule"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {selectedReservation.vehicule?.marque}{" "}
                      {selectedReservation.vehicule?.modele}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedReservation.vehicule?.annee} •{" "}
                      {selectedReservation.vehicule?.immatriculation ||
                        "Non assignée"}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedReservation.vehicule?.categorie?.toUpperCase()} •{" "}
                      {selectedReservation.vehicule?.typeVehicule}
                    </p>
                    {selectedReservation.vehicule?.categorie === "moto" &&
                      selectedReservation.vehicule?.cylindree && (
                        <p className="text-sm text-gray-600">
                          Cylindrée: {selectedReservation.vehicule.cylindree}{" "}
                          cm³
                        </p>
                      )}
                    {selectedReservation.vehicule?.categorie === "velo" && (
                      <p className="text-sm text-gray-600">
                        Type: {selectedReservation.vehicule.typeVelo}
                        {selectedReservation.vehicule.assistanceElec
                          ? " (Électrique)"
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Client */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">Client</h3>
                <div className="space-y-2">
                  <p className="font-medium">
                    {selectedReservation.client?.firstName}{" "}
                    {selectedReservation.client?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Email: {selectedReservation.client?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Téléphone: {selectedReservation.client?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Dates et durée */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">Période de location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date de prise</p>
                    <p className="font-medium">
                      {format(
                        new Date(selectedReservation.datePrise),
                        "dd MMMM yyyy",
                        { locale: fr }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date de retour</p>
                    <p className="font-medium">
                      {format(
                        new Date(selectedReservation.dateRetour),
                        "dd MMMM yyyy",
                        { locale: fr }
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Durée:{" "}
                    {Math.ceil(
                      (new Date(selectedReservation.dateRetour) -
                        new Date(selectedReservation.datePrise)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    jour(s)
                  </p>
                </div>
              </div>

              {/* Tarification */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">Tarification</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix par jour</span>
                    <span className="font-medium">
                      {selectedReservation.vehicule?.prixJour}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre de jours</span>
                    <span className="font-medium">
                      {Math.ceil(
                        (new Date(selectedReservation.dateRetour) -
                          new Date(selectedReservation.datePrise)) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total HT</span>
                    <span className="font-medium">
                      {selectedReservation.totalHT?.toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA</span>
                    <span className="font-medium">
                      {(
                        selectedReservation.totalTTC -
                        selectedReservation.totalHT
                      ).toFixed(2)}
                      €
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total TTC</span>
                    <span className="font-bold text-[#8B4513]">
                      {selectedReservation.totalTTC?.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">Paiement</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Statut du paiement</span>
                  <Badge
                    variant={
                      selectedReservation.statutPaiement === "payé"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedReservation.statutPaiement}
                  </Badge>
                </div>
              </div>

              {/* Notes */}
              {selectedReservation.notes && (
                <div>
                  <h3 className="font-semibold mb-3">Notes</h3>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {selectedReservation.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowReservationDetails(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmation de paiement */}
      <Dialog
        open={showPaymentConfirmation}
        onOpenChange={setShowPaymentConfirmation}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirmer le paiement</DialogTitle>
            <DialogDescription>
              Réservation #{selectedReservation?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              {/* Résumé de la réservation */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Véhicule:</span>
                      <span className="font-semibold">
                        {selectedReservation.vehicule?.marque}{" "}
                        {selectedReservation.vehicule?.modele}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-semibold">
                        {selectedReservation.client?.firstName}{" "}
                        {selectedReservation.client?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-gray-600 font-medium">
                        Total à payer:
                      </span>
                      <span className="text-2xl font-bold text-[#8B4513]">
                        {selectedReservation.totalTTC?.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulaire de confirmation */}
              <div className="space-y-4">
                {/* Montant */}
                <div>
                  <Label htmlFor="montant" className="required">
                    Montant reçu (€) *
                  </Label>
                  <Input
                    id="montant"
                    type="number"
                    value={paymentForm.montant}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        montant: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                    min="0"
                    className="mt-1"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Montant total de la réservation:{" "}
                    {selectedReservation.totalTTC?.toFixed(2)}€
                  </p>
                </div>

                {/* Méthode de paiement */}
                <div>
                  <Label htmlFor="methode">Méthode de paiement *</Label>
                  <Select
                    value={paymentForm.methode}
                    onValueChange={(value) =>
                      setPaymentForm({ ...paymentForm, methode: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virement">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Virement bancaire
                        </div>
                      </SelectItem>
                      <SelectItem value="cheque">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Chèque
                        </div>
                      </SelectItem>
                      <SelectItem value="especes">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Espèces
                        </div>
                      </SelectItem>
                      <SelectItem value="carte">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Carte bancaire
                        </div>
                      </SelectItem>
                      <SelectItem value="paypal">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          PayPal
                        </div>
                      </SelectItem>
                      <SelectItem value="autre">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Autre
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date de réception */}
                <div>
                  <Label htmlFor="dateReceived" className="required">
                    Date de réception du paiement *
                  </Label>
                  <Input
                    id="dateReceived"
                    type="date"
                    value={paymentForm.dateReceived}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        dateReceived: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Référence de paiement */}
                <div>
                  <Label htmlFor="reference" className="required">
                    Référence de paiement *
                  </Label>
                  <Input
                    id="reference"
                    value={paymentForm.reference}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        reference: e.target.value,
                      })
                    }
                    placeholder="Ex: Ref.12345, N°de chèque, IBAN..."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Numéro de transaction, IBAN, numéro de chèque, etc.
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes additionnelles</Label>
                  <Textarea
                    id="notes"
                    value={paymentForm.notes}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Notes internes sur ce paiement..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Avertissement */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Confirmation de paiement
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Assurez-vous que le paiement a bien été reçu avant de
                        confirmer. Cette action marque le paiement comme
                        complété.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowPaymentConfirmation(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirmation en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer le paiement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Styles CSS pour les champs obligatoires */}
      <style jsx>{`
        .required::after {
          content: " *";
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default PrestataireVehiculesPage;
