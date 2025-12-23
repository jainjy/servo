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
const PrestataireVehiculesPage = () => {
  const [vehicules, setVehicules] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicules");
  const [showAddVehicule, setShowAddVehicule] = useState(false);
  const [showEditVehicule, setShowEditVehicule] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const {user}=useAuth()

  const [vehiculeForm, setVehiculeForm] = useState({
    marque: "",
    modele: "",
    annee: new Date().getFullYear(),
    immatriculation: "",
    couleur: "",
    puissance: "",
    typeVehicule: "economique",
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
    images: [],
    equipements: {},
    caracteristiques: [],
    description: "",
    agence: "",
    conditionsLocation: "",
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
  });

  // Types et options
  const typesVehicules = [
    { id: "economique", label: "Économique", icon: Car },
    { id: "compacte", label: "Compacte", icon: Car },
    { id: "berline", label: "Berline", icon: Car },
    { id: "suv", label: "SUV & 4x4", icon: Car },
    { id: "luxe", label: "Luxe & Premium", icon: Car },
    { id: "utilitaire", label: "Utilitaire", icon: Package },
    { id: "camion", label: "Camion", icon: Package },
    { id: "minibus", label: "Minibus", icon: Users },
  ];

  const carburants = [
    { id: "essence", label: "Essence", icon: Fuel },
    { id: "diesel", label: "Diesel", icon: Fuel },
    { id: "electrique", label: "Électrique", icon: Fuel },
    { id: "hybride", label: "Hybride", icon: Fuel },
  ];

  const transmissions = [
    { id: "manuelle", label: "Manuelle", icon: Cog },
    { id: "automatique", label: "Automatique", icon: Cog },
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
      console.log("Réservations récupérées:", vehiculesResponse);

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

    setStats({
      totalVehicules,
      disponibles,
      totalReservations,
      revenuTotal,
      tauxOccupation: Math.round(tauxOccupation),
      reservationsMois,
      revenuMois,
      clientsActifs: clientsUniques,
    });
  };

  const handleAddVehicule = async () => {
    try {
      // Valider les champs requis
      if (
        !vehiculeForm.marque ||
        !vehiculeForm.modele ||
        !vehiculeForm.immatriculation
      ) {
        toast.error("Veuillez remplir les champs obligatoires");
        return;
      }

      setIsSubmitting(true);
      
      const formData = new FormData();

      // Ajouter les champs simples
      Object.keys(vehiculeForm).forEach((key) => {
        if (
          key !== "images" &&
          key !== "equipements" &&
          key !== "caracteristiques"
        ) {
          formData.append(key, vehiculeForm[key]);
        }
      });

      // Ajouter les champs complexes (JSON)
      formData.append("equipements", JSON.stringify(vehiculeForm.equipements));
      formData.append("caracteristiques", JSON.stringify(vehiculeForm.caracteristiques));

      // Ajouter les fichiers
      filesToUpload.forEach((file) => {
        formData.append("images", file);
      });

      const response = await vehiculesApi.createVehicule(formData);

      toast.success("Véhicule ajouté avec succès");
      setShowAddVehicule(false);
      resetVehiculeForm();
      fetchData();
    } catch (error) {
      console.error("Erreur ajout véhicule:", error);
      toast.error(error.response?.data?.error || "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVehicule = async () => {
    if (!selectedVehicule) return;

    try {
      setIsSubmitting(true);
      
      const formData = new FormData();

      // Ajouter les champs simples
      Object.keys(vehiculeForm).forEach((key) => {
        if (
          key !== "images" &&
          key !== "equipements" &&
          key !== "caracteristiques"
        ) {
          formData.append(key, vehiculeForm[key]);
        }
      });

      // Ajouter les champs complexes (JSON)
      formData.append("equipements", JSON.stringify(vehiculeForm.equipements));
      formData.append("caracteristiques", JSON.stringify(vehiculeForm.caracteristiques));

      // Gérer les images : envoyer seulement les URLs (strings)
      vehiculeForm.images.forEach((img) => {
        if (typeof img === 'string' && !img.startsWith("data:")) {
          formData.append("images", img);
        }
      });

      filesToUpload.forEach((file) => {
        formData.append("images", file);
      });

      await vehiculesApi.updateVehicule(selectedVehicule.id, formData);

      toast.success("Véhicule mis à jour avec succès");
      setShowEditVehicule(false);
      fetchData();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicule = async (vehiculeId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      return;
    }

    try {
      await vehiculesApi.deleteVehicule(vehiculeId);

      toast.success("Véhicule supprimé avec succès");
      fetchData();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression"
      );
    }
  };

  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      await vehiculesApi.updateReservationStatus(reservationId, {
        statut: newStatus,
      });

      toast.success("Statut mis à jour");
      fetchData();
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      toast.error("Erreur lors de la mise à jour");
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
      typeVehicule: "economique",
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
      images: [],
      equipements: {},
      caracteristiques: [],
      description: "",
      agence: "",
      conditionsLocation: "",
    });
    setFilesToUpload([]);
  };

  const openEditVehicule = (vehicule) => {
    setSelectedVehicule(vehicule);
    setVehiculeForm({
      marque: vehicule.marque,
      modele: vehicule.modele,
      annee: vehicule.annee,
      immatriculation: vehicule.immatriculation,
      couleur: vehicule.couleur,
      puissance: vehicule.puissance,
      typeVehicule: vehicule.typeVehicule,
      carburant: vehicule.carburant,
      transmission: vehicule.transmission,
      places: vehicule.places,
      portes: vehicule.portes,
      volumeCoffre: vehicule.volumeCoffre || "",
      ville: vehicule.ville,
      adresse: vehicule.adresse || "",
      latitude: vehicule.latitude || "",
      longitude: vehicule.longitude || "",
      prixJour: vehicule.prixJour,
      prixSemaine: vehicule.prixSemaine || 300,
      prixMois: vehicule.prixMois || 1000,
      kilometrageInclus: vehicule.kilometrageInclus,
      caution: vehicule.caution,
      images: vehicule.images || [],
      equipements: vehicule.equipements || {},
      caracteristiques: vehicule.caracteristiques || [],
      description: vehicule.description || "",
      agence: vehicule.agence || "",
      conditionsLocation: vehicule.conditionsLocation || "",
    });
    setShowEditVehicule(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFilesToUpload((prev) => [...prev, ...files]);
    const newImages = [...vehiculeForm.images];

    // Simuler l'upload (en production, utiliser une API de stockage)
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        setVehiculeForm({ ...vehiculeForm, images: newImages });
      };
      reader.readAsDataURL(file);
    });
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
      vehicule.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Véhicules actifs</p>
                  <p className="text-2xl font-bold">{stats.totalVehicules}</p>
                  <p className="text-xs text-green-600">
                    {stats.disponibles} disponibles
                  </p>
                </div>
                <Car className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Réservations totales</p>
                  <p className="text-2xl font-bold">
                    {stats.totalReservations}
                  </p>
                  <p className="text-xs text-blue-600">
                    {stats.reservationsMois} ce mois
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenu total</p>
                  <p className="text-2xl font-bold">
                    {stats.revenuTotal.toFixed(0)}€
                  </p>
                  <p className="text-xs text-green-600">
                    {stats.revenuMois.toFixed(0)}€ ce mois
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Taux d'occupation</p>
                  <p className="text-2xl font-bold">{stats.tauxOccupation}%</p>
                  <p className="text-xs text-gray-600">
                    {stats.clientsActifs} clients actifs
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="vehicules">
              <Car className="h-4 w-4 mr-2" />
              Véhicules ({vehicules.length})
            </TabsTrigger>
            <TabsTrigger value="reservations">
              <Calendar className="h-4 w-4 mr-2" />
              Réservations ({reservations.length})
            </TabsTrigger>
            <TabsTrigger value="disponibilites">
              <Clock className="h-4 w-4 mr-2" />
              Disponibilités
            </TabsTrigger>
            <TabsTrigger value="parametres">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Onglet Véhicules */}
          <TabsContent value="vehicules" className="space-y-4">
            {/* Barre d'actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un véhicule..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={() => {
                      resetVehiculeForm();
                      setShowAddVehicule(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un véhicule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des véhicules */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
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
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {vehicule.marque} {vehicule.modele}
                          </CardTitle>
                          <CardDescription>
                            {vehicule.annee} • {vehicule.carburant}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
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
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="h-48 mb-4">
                        <img
                          src={
                            vehicule.images?.[0] ||
                            "https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=400&auto=format&fit=crop"
                          }
                          alt={vehicule.marque}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                vehicule.disponible ? "default" : "destructive"
                              }
                            >
                              {vehicule.disponible
                                ? "Disponible"
                                : "Indisponible"}
                            </Badge>
                            <Badge variant="outline">
                              {vehicule.typeVehicule}
                            </Badge>
                          </div>
                          <div className="text-xl font-bold text-[#8B4513]">
                            {vehicule.prixJour}€
                            <span className="text-sm font-normal">/jour</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{vehicule.ville}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-gray-400" />
                            <span>{vehicule.carburant}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Cog className="h-4 w-4 text-gray-400" />
                            <span>{vehicule.transmission}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{vehicule.places} places</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {vehicule.rating || "N/A"}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({vehicule.nombreAvis || 0} avis)
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicule._count?.reservations || 0} locations
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t pt-4">
                      <Button
                        className="w-full"
                        onClick={() => openEditVehicule(vehicule)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Aucun véhicule trouvé
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? "Aucun véhicule ne correspond à votre recherche"
                      : "Vous n'avez pas encore ajouté de véhicules"}
                  </p>
                  <Button onClick={() => setShowAddVehicule(true)}>
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

            {/* Tableau des réservations */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des réservations</CardTitle>
                <CardDescription>
                  {filteredReservations.length} réservation
                  {filteredReservations.length > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Véhicule</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={7}>
                              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredReservations.length > 0 ? (
                        filteredReservations.map((reservation) => {
                          const StatusConfig = statusConfig[reservation.statut];
                          const StatusIcon = StatusConfig?.icon || AlertCircle;

                          return (
                            <TableRow key={reservation.id}>
                              <TableCell className="font-mono text-sm">
                                {reservation.id.slice(0, 8)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-12">
                                    <img
                                      src={
                                        reservation.vehicule?.images?.[0] ||
                                        "https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=100&auto=format&fit=crop"
                                      }
                                      alt="véhicule"
                                      className="h-full w-full object-cover rounded"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {reservation.vehicule?.marque}{" "}
                                      {reservation.vehicule?.modele}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {reservation.client?.firstName}{" "}
                                    {reservation.client?.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {reservation.client?.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>
                                    {format(
                                      new Date(reservation.datePrise),
                                      "dd/MM/yy"
                                    )}
                                  </div>
                                  <div className="text-gray-500">
                                    au{" "}
                                    {format(
                                      new Date(reservation.dateRetour),
                                      "dd/MM/yy"
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-[#8B4513]">
                                  {reservation.totalTTC?.toFixed(2)}€
                                </div>
                                <div className="text-xs text-gray-500">
                                  {reservation.statutPaiement}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={StatusConfig?.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {StatusConfig?.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setSelectedReservation(reservation)
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Voir détails
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageCircle className="h-4 w-4 mr-2" />
                                      Contacter
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      Contrat
                                    </DropdownMenuItem>

                                    {[
                                      "en_attente",
                                      "confirmee",
                                      "en_cours",
                                    ].includes(reservation.statut) && (
                                      <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>
                                          Changer statut
                                        </DropdownMenuLabel>
                                        {reservation.statut ===
                                          "en_attente" && (
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
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                              Aucune réservation trouvée
                            </h3>
                            <p className="text-gray-500">
                              {searchTerm || statusFilter !== "tous"
                                ? "Aucune réservation ne correspond à vos critères"
                                : "Vous n'avez pas encore de réservations"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Disponibilités */}
          <TabsContent value="disponibilites">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des disponibilités</CardTitle>
                <CardDescription>
                  Bloquer des périodes pour maintenance ou indisponibilité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Calendrier des disponibilités
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Fonctionnalité en cours de développement
                  </p>
                  <Button variant="outline">
                    Configurer les indisponibilités
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Paramètres */}
          <TabsContent value="parametres">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de location</CardTitle>
                <CardDescription>
                  Configurez vos conditions générales de location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="conditions">Conditions générales</Label>
                    <Textarea
                      id="conditions"
                      placeholder="Rédigez vos conditions de location..."
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="assurance">Conditions d'assurance</Label>
                    <Textarea
                      id="assurance"
                      placeholder="Détails sur les assurances proposées..."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-confirm" />
                    <Label htmlFor="auto-confirm">
                      Confirmation automatique des réservations
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" defaultChecked />
                    <Label htmlFor="notifications">
                      Notifications par email pour les nouvelles réservations
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Enregistrer les paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Ajout véhicule */}
      <Dialog open={showAddVehicule} onOpenChange={setShowAddVehicule}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marque">Marque *</Label>
                <Input
                  id="marque"
                  value={vehiculeForm.marque}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, marque: e.target.value })
                  }
                  placeholder="Ex: Toyota"
                />
              </div>

              <div>
                <Label htmlFor="modele">Modèle *</Label>
                <Input
                  id="modele"
                  value={vehiculeForm.modele}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, modele: e.target.value })
                  }
                  placeholder="Ex: Yaris"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="immatriculation">Immatriculation *</Label>
                <Input
                  id="immatriculation"
                  value={vehiculeForm.immatriculation}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      immatriculation: e.target.value,
                    })
                  }
                  placeholder="Ex: AB-123-CD"
                />
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
                      annee: parseInt(e.target.value),
                    })
                  }
                  min="2000"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Type de véhicule</Label>
                <Select
                  value={vehiculeForm.typeVehicule}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, typeVehicule: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typesVehicules.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Carburant</Label>
                <Select
                  value={vehiculeForm.carburant}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, carburant: value })
                  }
                >
                  <SelectTrigger>
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

              <div>
                <Label>Transmission</Label>
                <Select
                  value={vehiculeForm.transmission}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, transmission: value })
                  }
                >
                  <SelectTrigger>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ville">Ville *</Label>
                <Select
                  value={vehiculeForm.ville}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, ville: value })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="prixJour">Prix par jour (€) *</Label>
                <Input
                  id="prixJour"
                  type="number"
                  value={vehiculeForm.prixJour}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      prixJour: parseFloat(e.target.value),
                    })
                  }
                  min="10"
                  step="5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={vehiculeForm.description}
                onChange={(e) =>
                  setVehiculeForm({
                    ...vehiculeForm,
                    description: e.target.value,
                  })
                }
                placeholder="Décrivez votre véhicule, ses équipements, ses avantages..."
                rows={3}
              />
            </div>

            <div>
              <Label>Images du véhicule</Label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Cliquez pour télécharger des images
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {vehiculeForm.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {vehiculeForm.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Image ${index + 1}`}
                          className="h-24 w-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...vehiculeForm.images];
                            newImages.splice(index, 1);
                            setVehiculeForm({
                              ...vehiculeForm,
                              images: newImages,
                            });
                            
                            // Si c'est une nouvelle image (data URL), on la supprime aussi de filesToUpload
                            if (img.startsWith("data:")) {
                              const dataUrlIndex = vehiculeForm.images
                                .slice(0, index)
                                .filter((i) => i.startsWith("data:")).length;
                              const newFiles = [...filesToUpload];
                              newFiles.splice(dataUrlIndex, 1);
                              setFilesToUpload(newFiles);
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddVehicule(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAddVehicule}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  En cours...
                </>
              ) : (
                "Ajouter le véhicule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Modification véhicule */}
      <Dialog open={showEditVehicule} onOpenChange={setShowEditVehicule}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marque">Marque *</Label>
                <Input
                  id="marque"
                  value={vehiculeForm.marque}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, marque: e.target.value })
                  }
                  placeholder="Ex: Toyota"
                />
              </div>

              <div>
                <Label htmlFor="modele">Modèle *</Label>
                <Input
                  id="modele"
                  value={vehiculeForm.modele}
                  onChange={(e) =>
                    setVehiculeForm({ ...vehiculeForm, modele: e.target.value })
                  }
                  placeholder="Ex: Yaris"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="immatriculation">Immatriculation *</Label>
                <Input
                  id="immatriculation"
                  value={vehiculeForm.immatriculation}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      immatriculation: e.target.value,
                    })
                  }
                  placeholder="Ex: AB-123-CD"
                />
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
                      annee: parseInt(e.target.value),
                    })
                  }
                  min="2000"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Type de véhicule</Label>
                <Select
                  value={vehiculeForm.typeVehicule}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, typeVehicule: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typesVehicules.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Carburant</Label>
                <Select
                  value={vehiculeForm.carburant}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, carburant: value })
                  }
                >
                  <SelectTrigger>
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

              <div>
                <Label>Transmission</Label>
                <Select
                  value={vehiculeForm.transmission}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, transmission: value })
                  }
                >
                  <SelectTrigger>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ville">Ville *</Label>
                <Select
                  value={vehiculeForm.ville}
                  onValueChange={(value) =>
                    setVehiculeForm({ ...vehiculeForm, ville: value })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="prixJour">Prix par jour (€) *</Label>
                <Input
                  id="prixJour"
                  type="number"
                  value={vehiculeForm.prixJour}
                  onChange={(e) =>
                    setVehiculeForm({
                      ...vehiculeForm,
                      prixJour: parseFloat(e.target.value),
                    })
                  }
                  min="10"
                  step="5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={vehiculeForm.description}
                onChange={(e) =>
                  setVehiculeForm({
                    ...vehiculeForm,
                    description: e.target.value,
                  })
                }
                placeholder="Décrivez votre véhicule, ses équipements, ses avantages..."
                rows={3}
              />
            </div>

            <div>
              <Label>Images du véhicule</Label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Cliquez pour télécharger des images
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {vehiculeForm.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {vehiculeForm.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Image ${index + 1}`}
                          className="h-24 w-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...vehiculeForm.images];
                            newImages.splice(index, 1);
                            setVehiculeForm({
                              ...vehiculeForm,
                              images: newImages,
                            });
                            
                            if (img.startsWith("data:")) {
                              const dataUrlIndex = vehiculeForm.images
                                .slice(0, index)
                                .filter((i) => i.startsWith("data:")).length;
                              const newFiles = [...filesToUpload];
                              newFiles.splice(dataUrlIndex, 1);
                              setFilesToUpload(newFiles);
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditVehicule(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateVehicule}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  En cours...
                </>
              ) : (
                "Mettre à jour le véhicule"
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
                  <CardTitle>Répartition par type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {typesVehicules.map((type) => {
                      const count = vehicules.filter(
                        (v) => v.typeVehicule === type.id
                      ).length;
                      const percentage =
                        vehicules.length > 0
                          ? (count / vehicules.length) * 100
                          : 0;

                      return (
                        <div
                          key={type.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{type.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
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
    </div>
  );
};

export default PrestataireVehiculesPage;
