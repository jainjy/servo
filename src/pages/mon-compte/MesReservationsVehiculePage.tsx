import { useState, useEffect } from "react";
import {
  Calendar,
  Car,
  Truck,
  Bike,

  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  CreditCard,
  MessageCircle,
  Filter,
  Search,
  Star,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Trash2,
  Zap,
  Battery,
  Gauge,
  Weight,
  Users,
  Fuel,
  Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { vehiculesApi } from "@/lib/api/vehicules";
import { ItineraryModal } from "@/components/itinerary-modal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
          <Text style={styles.title}>CONTRAT DE LOCATION DE VÉHICULE</Text>
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
          {reservation.numeroPermis && (
            <Text style={styles.value}>Permis: {reservation.numeroPermis}</Text>
          )}
        </View>
      </View>

      {/* Véhicule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VÉHICULE LOUÉ</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Catégorie :</Text>
          <Text style={styles.value}>
            {reservation.vehicule.categorie?.toUpperCase() || "VOITURE"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Marque / Modèle :</Text>
          <Text style={styles.value}>
            {reservation.vehicule.marque} {reservation.vehicule.modele}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Immatriculation :</Text>
          <Text style={styles.value}>
            {reservation.vehicule.immatriculation || "Non applicable"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type :</Text>
          <Text style={styles.value}>{reservation.vehicule.typeVehicule}</Text>
        </View>
        {reservation.vehicule.cylindree && (
          <View style={styles.row}>
            <Text style={styles.label}>Cylindrée :</Text>
            <Text style={styles.value}>{reservation.vehicule.cylindree}cc</Text>
          </View>
        )}
        {reservation.vehicule.carburant && (
          <View style={styles.row}>
            <Text style={styles.label}>Carburant :</Text>
            <Text style={styles.value}>{reservation.vehicule.carburant}</Text>
          </View>
        )}
        {reservation.vehicule.transmission && (
          <View style={styles.row}>
            <Text style={styles.label}>Transmission :</Text>
            <Text style={styles.value}>
              {reservation.vehicule.transmission}
            </Text>
          </View>
        )}
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
          <Text style={styles.label}>Durée :</Text>
          <Text style={styles.value}>{reservation.nombreJours} jour(s)</Text>
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
          <Text style={styles.label}>Prix location :</Text>
          <Text style={styles.value}>
            {reservation.prixVehicule?.toFixed(2)} €
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Extras :</Text>
          <Text style={styles.value}>
            {reservation.prixExtras?.toFixed(2)} €
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Frais service :</Text>
          <Text style={styles.value}>
            {reservation.fraisService?.toFixed(2)} €
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Montant Total TTC :</Text>
          <Text style={{ ...styles.value, fontWeight: "bold" }}>
            {reservation.totalTTC?.toFixed(2)} €
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Caution :</Text>
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

const MesReservationsVehiculePage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [selectedReservationForItinerary, setSelectedReservationForItinerary] =
    useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    titre: "",
    commentaire: "",
    avantages: [],
    inconvenients: [],
    recommandation: true,
  });

  // Configuration des statuts
  const statusConfig = {
    en_attente: {
      label: "En attente",
      color: "bg-yellow-500",
      icon: Clock,
    },
    confirmee: {
      label: "Confirmée",
      color: "bg-blue-500",
      icon: CheckCircle,
    },
    en_cours: {
      label: "En cours",
      color: "bg-purple-500",
      icon: Car,
    },
    terminee: {
      label: "Terminée",
      color: "bg-green-500",
      icon: CheckCircle,
    },
    annulee: {
      label: "Annulée",
      color: "bg-red-500",
      icon: XCircle,
    },
  };

  // Catégories de véhicules
  const categories = [
    { id: "tous", label: "Toutes catégories", icon: Car },
    { id: "voiture", label: "Voitures", icon: Car },
    { id: "camion", label: "Camions", icon: Truck },
    { id: "moto", label: "Motos", icon: Bike },
    { id: "velo", label: "Vélos", icon: Bike },
  ];

  // Icônes par catégorie
  const getCategoryIcon = (categorie) => {
    switch (categorie) {
      case "voiture":
        return <Car className="h-4 w-4" />;
      case "camion":
        return <Truck className="h-4 w-4" />;
      case "moto":
        return <Bike className="h-4 w-4" />;
      case "velo":
        return <Bike className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = {
        statut: selectedStatus !== "tous" ? selectedStatus : undefined,
      };
      const response = await vehiculesApi.getMesReservations(params);
      setReservations(response.data.data || []);
    } catch (error) {
      console.error("Erreur récupération réservations:", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [selectedStatus]);

  const handleCancelReservation = async (reservationId) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")
    ) {
      return;
    }

    try {
      await vehiculesApi.updateReservationStatus(reservationId, {
        statut: "annulee",
        raisonAnnulation: "Annulé par le client",
      });

      toast.success("Réservation annulée avec succès");
      fetchReservations();
    } catch (error) {
      console.error("Erreur annulation:", error);
      toast.error("Erreur lors de l'annulation");
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedReservation) return;

    if (!reviewForm.titre || !reviewForm.commentaire) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await vehiculesApi.createAvis({
        vehiculeId: selectedReservation.vehicule.id,
        reservationId: selectedReservation.id,
        rating: reviewForm.rating,
        titre: reviewForm.titre,
        commentaire: reviewForm.commentaire,
        avantages: reviewForm.avantages,
        inconvenients: reviewForm.inconvenients,
        recommandation: reviewForm.recommandation,
        dateExperience: selectedReservation.datePrise,
      });

      toast.success("Avis publié avec succès !");
      setShowReviewModal(false);
      setReviewForm({
        rating: 5,
        titre: "",
        commentaire: "",
        avantages: [],
        inconvenients: [],
        recommandation: true,
      });
      fetchReservations();
    } catch (error) {
      console.error("Erreur publication avis:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la publication"
      );
    }
  };

  const handleDownloadContract = async (reservation) => {
    const toastId = toast.loading("Génération du contrat PDF...");
    try {
      const blob = await pdf(
        <ContractDocument reservation={reservation} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Contrat_${
        reservation.vehicule.categorie
      }_${reservation.id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Contrat téléchargé avec succès", { id: toastId });
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      toast.error("Erreur lors de la génération du contrat", { id: toastId });
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
      toast.loading("Suppression en cours...", { id: "delete-reservation" });
      await vehiculesApi.deleteReservation(reservationId);
      toast.success("Réservation supprimée avec succès", {
        id: "delete-reservation",
      });
      fetchReservations();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression",
        { id: "delete-reservation" }
      );
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.vehicule.marque
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.vehicule.modele
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.id.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "tous" ||
      reservation.vehicule.categorie === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const calculateDuration = (datePrise, dateRetour) => {
    const start = new Date(datePrise);
    const end = new Date(dateRetour);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Fonction pour rendre les caractéristiques spécifiques du véhicule
  const renderVehicleSpecs = (vehicule) => {
    const specs = [];

    if (vehicule.annee) specs.push(`${vehicule.annee}`);
    if (vehicule.places) specs.push(`${vehicule.places} places`);

    if (vehicule.categorie === "moto" && vehicule.cylindree) {
      specs.push(`${vehicule.cylindree}cc`);
    }

    if (vehicule.categorie === "velo") {
      if (vehicule.typeVelo) specs.push(vehicule.typeVelo);
      if (vehicule.assistanceElec) specs.push("Électrique");
      if (vehicule.poids) specs.push(`${vehicule.poids}kg`);
    }

    if (vehicule.carburant) specs.push(vehicule.carburant);
    if (vehicule.transmission) specs.push(vehicule.transmission);

    return specs;
  };

  // Image par défaut par catégorie
  const getVehicleImage = (vehicule) => {
    if (vehicule.images && vehicule.images.length > 0) {
      return vehicule.images[0];
    }

    const defaultImages = {
      voiture:
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&auto=format&fit=crop",
      camion:
        "https://images.unsplash.com/photo-1566474591191-8a583d6af81b?w=400&auto=format&fit=crop",
      moto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop",
      velo: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&auto=format&fit=crop",
    };

    return defaultImages[vehicule.categorie] || defaultImages.voiture;
  };

  // Calendrier
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getReservationsForDate = (date) => {
    return reservations.filter((reservation) => {
      const start = new Date(reservation.datePrise);
      const end = new Date(reservation.dateRetour);
      const checkDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      return checkDate >= start && checkDate <= end;
    });
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return days;
  };

  const calendarDays = renderCalendar();
  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes réservations de véhicules
          </h1>
          <p className="text-gray-600">
            Gérez toutes vos locations de voitures, camions, motos et vélos
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total réservations</p>
                  <p className="text-2xl font-bold">{reservations.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Voitures</p>
                  <p className="text-2xl font-bold">
                    {
                      reservations.filter(
                        (r) => r.vehicule?.categorie === "voiture"
                      ).length
                    }
                  </p>
                </div>
                <Car className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Utilitaires</p>
                  <p className="text-2xl font-bold">
                    {
                      reservations.filter(
                        (r) => r.vehicule?.categorie === "camion"
                      ).length
                    }
                  </p>
                </div>
                <Truck className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">2 roues</p>
                  <p className="text-2xl font-bold">
                    {
                      reservations.filter((r) =>
                        ["moto", "velo"].includes(r.vehicule?.categorie)
                      ).length
                    }
                  </p>
                </div>
                <Bike className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Dépensé</p>
                  <p className="text-2xl font-bold">
                    {reservations
                      .reduce((sum, r) => sum + (r.totalTTC || 0), 0)
                      .toFixed(0)}
                    €
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par véhicule, marque ou référence..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
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

                <Button variant="outline" onClick={fetchReservations}>
                  Actualiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des réservations */}
        <Tabs defaultValue="liste" className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="liste">Vue liste</TabsTrigger>
            <TabsTrigger value="calendrier">Vue calendrier</TabsTrigger>
          </TabsList>

          <TabsContent value="liste" className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="h-24 w-32 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => {
                const StatusIcon =
                  statusConfig[reservation.statut]?.icon || AlertCircle;
                const duration = calculateDuration(
                  reservation.datePrise,
                  reservation.dateRetour
                );
                const canReview =
                  reservation.statut === "terminee" &&
                  !reservation.avisVehicule?.length;
                const canCancel =
                  ["en_attente", "confirmee"].includes(reservation.statut) &&
                  new Date(reservation.datePrise) > new Date();
                const vehicleSpecs = renderVehicleSpecs(reservation.vehicule);

                return (
                  <Card
                    key={reservation.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image véhicule */}
                        <div className="w-full md:w-48 h-36 relative">
                          <img
                            src={getVehicleImage(reservation.vehicule)}
                            alt={`${reservation.vehicule.marque} ${reservation.vehicule.modele}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-[#556B2F] text-white">
                            {getCategoryIcon(reservation.vehicule.categorie)}
                            <span className="ml-1 capitalize">
                              {reservation.vehicule.categorie}
                            </span>
                          </Badge>
                          {reservation.vehicule.carburant === "electrique" && (
                            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                              <Zap className="h-3 w-3 mr-1" />
                              Électrique
                            </Badge>
                          )}
                          {reservation.vehicule.categorie === "velo" &&
                            reservation.vehicule.assistanceElec && (
                              <Badge className="absolute bottom-2 left-2 bg-blue-500 text-white">
                                <Battery className="h-3 w-3 mr-1" />
                                Assistance
                              </Badge>
                            )}
                        </div>

                        {/* Détails */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={`${
                                    statusConfig[reservation.statut]?.color
                                  } text-white`}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[reservation.statut]?.label}
                                </Badge>
                                <Badge variant="outline">
                                  Réf: {reservation.id.slice(0, 8)}
                                </Badge>
                                {reservation.vehicule.typeVehicule && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-gray-100"
                                  >
                                    {reservation.vehicule.typeVehicule}
                                  </Badge>
                                )}
                              </div>

                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {reservation.vehicule.marque}{" "}
                                {reservation.vehicule.modele}
                              </h3>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {format(
                                    new Date(reservation.datePrise),
                                    "dd MMM yyyy",
                                    { locale: fr }
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(reservation.dateRetour),
                                    "dd MMM yyyy",
                                    { locale: fr }
                                  )}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {duration} jour{duration > 1 ? "s" : ""}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {reservation.lieuPrise}
                                </span>
                              </div>

                              {/* Caractéristiques du véhicule */}
                              {vehicleSpecs.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {vehicleSpecs.map((spec, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#8B4513] mb-1">
                                {reservation.totalTTC?.toFixed(2)}€
                              </div>
                              <p className="text-sm text-gray-500">
                                Paiement: {reservation.statutPaiement}
                              </p>
                            </div>
                          </div>

                          {/* Informations agence */}
                          <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">
                                  {reservation.prestataire?.companyName ||
                                    reservation.prestataire?.commercialName ||
                                    "Professionnel OLIPLUS"}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span>{reservation.prestataire?.email}</span>
                                  {reservation.prestataire?.phone && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {reservation.prestataire.phone}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Détails
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Détails de la réservation #
                                    {reservation.id.slice(0, 8)}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-gray-500 text-sm">
                                        Catégorie
                                      </Label>
                                      <p className="font-semibold capitalize">
                                        {reservation.vehicule.categorie}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-500 text-sm">
                                        Véhicule
                                      </Label>
                                      <p className="font-semibold">
                                        {reservation.vehicule.marque}{" "}
                                        {reservation.vehicule.modele}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-500 text-sm">
                                        Type
                                      </Label>
                                      <p className="font-semibold">
                                        {reservation.vehicule.typeVehicule}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-500 text-sm">
                                        Année
                                      </Label>
                                      <p className="font-semibold">
                                        {reservation.vehicule.annee}
                                      </p>
                                    </div>
                                    {reservation.vehicule.carburant && (
                                      <div>
                                        <Label className="text-gray-500 text-sm">
                                          Carburant
                                        </Label>
                                        <p className="font-semibold">
                                          {reservation.vehicule.carburant}
                                        </p>
                                      </div>
                                    )}
                                    {reservation.vehicule.transmission && (
                                      <div>
                                        <Label className="text-gray-500 text-sm">
                                          Transmission
                                        </Label>
                                        <p className="font-semibold">
                                          {reservation.vehicule.transmission}
                                        </p>
                                      </div>
                                    )}
                                    {reservation.vehicule.cylindree && (
                                      <div>
                                        <Label className="text-gray-500 text-sm">
                                          Cylindrée
                                        </Label>
                                        <p className="font-semibold">
                                          {reservation.vehicule.cylindree}cc
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-[#8B4513] mb-3">
                                      Informations de location
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Dates
                                        </p>
                                        <p className="font-semibold">
                                          {format(
                                            new Date(reservation.datePrise),
                                            "dd/MM/yyyy HH:mm"
                                          )}{" "}
                                          -{" "}
                                          {format(
                                            new Date(reservation.dateRetour),
                                            "dd/MM/yyyy HH:mm"
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Durée
                                        </p>
                                        <p className="font-semibold">
                                          {duration} jour(s)
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Lieu de prise
                                        </p>
                                        <p className="font-semibold">
                                          {reservation.lieuPrise}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          Lieu de retour
                                        </p>
                                        <p className="font-semibold">
                                          {reservation.lieuRetour}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDownloadContract(reservation)
                              }
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Contrat
                            </Button>

                            {canReview && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedReservation(reservation);
                                  setShowReviewModal(true);
                                }}
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Laisser un avis
                              </Button>
                            )}

                            {canCancel && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() =>
                                  handleCancelReservation(reservation.id)
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Annuler
                              </Button>
                            )}

                            {["terminee", "annulee"].includes(
                              reservation.statut
                            ) && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() =>
                                  handleDeleteReservation(reservation.id)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </Button>
                            )}

                            {reservation.vehicule.categorie !== "velo" && (
                              <Button
                                size="sm"
                                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                  setSelectedReservationForItinerary(
                                    reservation
                                  );
                                  setShowItineraryModal(true);
                                }}
                              >
                                <Navigation className="h-4 w-4 mr-2" />
                                Itinéraire
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Aucune réservation trouvée
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedCategory !== "tous"
                      ? "Aucune réservation ne correspond à vos critères"
                      : "Vous n'avez pas encore de réservation de véhicule"}
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/location-voiture")}
                  >
                    Réserver un véhicule
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calendrier">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* En-tête du calendrier */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {format(currentDate, "MMMM yyyy", { locale: fr })}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={previousMonth}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentDate(new Date())}
                      >
                        Aujourd'hui
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Grille du calendrier */}
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="text-center font-semibold text-gray-600 py-2"
                      >
                        {day}
                      </div>
                    ))}

                    {calendarDays.map((day, index) => {
                      const reservationsForDay = day
                        ? getReservationsForDate(day)
                        : [];
                      const isToday =
                        day && day.toDateString() === new Date().toDateString();
                      const isCurrentMonth =
                        day && day.getMonth() === currentDate.getMonth();

                      return (
                        <div
                          key={index}
                          className={`min-h-24 p-2 rounded-lg border-2 transition-all ${
                            !day
                              ? "bg-gray-50 border-transparent"
                              : isToday
                              ? "border-blue-500 bg-blue-50"
                              : isCurrentMonth
                              ? "border-gray-200 bg-white hover:border-gray-300"
                              : "border-gray-100 bg-gray-50"
                          }`}
                        >
                          {day && (
                            <>
                              <div
                                className={`text-sm font-semibold mb-1 ${
                                  isToday
                                    ? "text-blue-600"
                                    : isCurrentMonth
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                }`}
                              >
                                {day.getDate()}
                              </div>

                              <div className="space-y-1">
                                {reservationsForDay.slice(0, 2).map((res) => (
                                  <Dialog key={res.id}>
                                    <DialogTrigger asChild>
                                      <div
                                        className={`text-xs p-1 rounded cursor-pointer truncate ${
                                          statusConfig[res.statut]?.color
                                        } text-white hover:opacity-80 transition-opacity`}
                                        title={`${res.vehicule.marque} ${res.vehicule.modele} (${res.vehicule.categorie})`}
                                      >
                                        <div className="flex items-center gap-1">
                                          {getCategoryIcon(
                                            res.vehicule.categorie
                                          )}
                                          <span className="truncate">
                                            {res.vehicule.marque}
                                          </span>
                                        </div>
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Détails de la réservation
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-gray-500 text-sm">
                                              Catégorie
                                            </Label>
                                            <p className="font-semibold capitalize">
                                              {res.vehicule.categorie}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-500 text-sm">
                                              Véhicule
                                            </Label>
                                            <p className="font-semibold">
                                              {res.vehicule.marque}{" "}
                                              {res.vehicule.modele}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-500 text-sm">
                                              Statut
                                            </Label>
                                            <Badge
                                              className={`${
                                                statusConfig[res.statut]?.color
                                              } text-white`}
                                            >
                                              {statusConfig[res.statut]?.label}
                                            </Badge>
                                          </div>
                                          <div>
                                            <Label className="text-gray-500 text-sm">
                                              Dates
                                            </Label>
                                            <p className="font-semibold text-sm">
                                              {format(
                                                new Date(res.datePrise),
                                                "dd MMM",
                                                { locale: fr }
                                              )}{" "}
                                              -{" "}
                                              {format(
                                                new Date(res.dateRetour),
                                                "dd MMM",
                                                { locale: fr }
                                              )}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-500 text-sm">
                                              Montant
                                            </Label>
                                            <p className="font-semibold text-[#8B4513]">
                                              {res.totalTTC?.toFixed(2)}€
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                ))}

                                {reservationsForDay.length > 2 && (
                                  <div className="text-xs text-gray-500 px-1">
                                    +{reservationsForDay.length - 2} autre(s)
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Légende */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3">Légende des statuts</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${config.color}`}
                          ></div>
                          <span className="text-sm text-gray-600">
                            {config.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal pour laisser un avis */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Laisser un avis pour {selectedReservation?.vehicule.marque}{" "}
              {selectedReservation?.vehicule.modele}
            </DialogTitle>
            <DialogDescription>
              Partager votre expérience avec ce{" "}
              {selectedReservation?.vehicule.categorie}
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Note générale</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      {star <= reviewForm.rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Titre de votre avis *</Label>
                <Input
                  value={reviewForm.titre}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, titre: e.target.value })
                  }
                  placeholder={`Ex: Excellent ${selectedReservation.vehicule.categorie}, prestataire sérieux`}
                />
              </div>

              <div>
                <Label>Commentaire détaillé *</Label>
                <Textarea
                  value={reviewForm.commentaire}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      commentaire: e.target.value,
                    })
                  }
                  placeholder={`Décrivez votre expérience avec ce ${selectedReservation.vehicule.categorie}...`}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Points positifs (optionnel)</Label>
                  <Textarea
                    placeholder={`Ex: ${selectedReservation.vehicule.categorie} en bon état, accueil chaleureux...`}
                    rows={3}
                    value={reviewForm.avantages.join(", ")}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        avantages: e.target.value.split(", ").filter(Boolean),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Points à améliorer (optionnel)</Label>
                  <Textarea
                    placeholder="Ex: Retard à la livraison, options manquantes..."
                    rows={3}
                    value={reviewForm.inconvenients.join(", ")}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        inconvenients: e.target.value
                          .split(", ")
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recommandation"
                  checked={reviewForm.recommandation}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      recommandation: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#556B2F] focus:ring-[#556B2F]"
                />
                <Label htmlFor="recommandation" className="text-sm">
                  Je recommande ce {selectedReservation.vehicule.categorie} et
                  ce prestataire
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  className="bg-[#556B2F] hover:bg-[#6B8E23]"
                >
                  Publier l'avis
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal pour l'itinéraire */}
      {selectedReservationForItinerary && (
        <ItineraryModal
          open={showItineraryModal}
          onOpenChange={setShowItineraryModal}
          reservationId={selectedReservationForItinerary.id}
          pickupLocation={
            selectedReservationForItinerary.coordonneesPrise
              ? JSON.parse(selectedReservationForItinerary.coordonneesPrise)
              : {
                  latitude: -20.8789,
                  longitude: 55.4481,
                  address: selectedReservationForItinerary.lieuPrise,
                }
          }
          returnLocation={
            selectedReservationForItinerary.coordonneesRetour
              ? JSON.parse(selectedReservationForItinerary.coordonneesRetour)
              : {
                  latitude: -20.8789,
                  longitude: 55.4481,
                  address: selectedReservationForItinerary.lieuRetour,
                }
          }
          existingItinerary={
            selectedReservationForItinerary.itineraire
              ? JSON.parse(selectedReservationForItinerary.itineraire)
              : undefined
          }
          onSave={async (itinerary) => {
            try {
              await vehiculesApi.updateReservationItinerary(
                selectedReservationForItinerary.id,
                { itineraire: itinerary }
              );
              fetchReservations();
            } catch (error) {
              console.error("Erreur sauvegarde itinéraire:", error);
              throw error;
            }
          }}
          isEditable={["en_attente", "confirmee"].includes(
            selectedReservationForItinerary.statut
          )}
        />
      )}
    </div>
  );
};

export default MesReservationsVehiculePage;
