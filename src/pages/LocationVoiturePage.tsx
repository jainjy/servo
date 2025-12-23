import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Car,
  Truck,
  MapPin,
  Calendar,
  Users,
  Fuel,
  Cog,
  Shield,
  Star,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  ChevronRight,
  Wifi,
  Snowflake,
  Navigation,
  CreditCard,
  ShieldCheck,
  Zap,
  DollarSign,
  Eye,
  X,
} from "lucide-react";
import { vehiculesApi } from "@/lib/api/vehicules";
import { LocationPickerModal } from "@/components/location-picker-modal";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LocationVoiturePage = () => {
  const navigate = useNavigate();
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("tous");
  const [selectedTransmission, setSelectedTransmission] = useState("tous");
  const [selectedFuel, setSelectedFuel] = useState("tous");
  const [priceRange, setPriceRange] = useState([30, 150]);
  const [selectedCity, setSelectedCity] = useState("tous");
  const [savedVehicules, setSavedVehicules] = useState([]);
  const [activeTab, setActiveTab] = useState("voitures");
  const [sortBy, setSortBy] = useState("pertinence");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [showLocationPickerPickup, setShowLocationPickerPickup] = useState(false);
  const [showLocationPickerReturn, setShowLocationPickerReturn] = useState(false);
  const [pickupLocation, setPickupLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [returnLocation, setReturnLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [reservationForm, setReservationForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    permis: "",
    assurance: false,
    kilometrage: "illimité",
    extras: [],
  });
  const [villes, setVilles] = useState([]);
  const [stats, setStats] = useState({
    totalVehicules: 0,
    disponibles: 0,
    electriques: 0,
    hybrides: 0,
    prixMoyen: 0,
  });

  // Types de véhicules basés sur votre modèle
  const typesVehicules = [
    {
      id: "economique",
      label: "Économique",
      icon: Car,
      description: "Petites voitures éco",
    },
    {
      id: "compacte",
      label: "Compacte",
      icon: Car,
      description: "Voitures citadines",
    },
    {
      id: "berline",
      label: "Berline",
      icon: Car,
      description: "Confort et espace",
    },
    {
      id: "suv",
      label: "SUV & 4x4",
      icon: Car,
      description: "Aventures et famille",
    },
    {
      id: "luxe",
      label: "Luxe & Premium",
      icon: Car,
      description: "Haut de gamme",
    },
    {
      id: "utilitaire",
      label: "Utilitaire",
      icon: Truck,
      description: "Petits utilitaires",
    },
    {
      id: "camion",
      label: "Camion",
      icon: Truck,
      description: "Grands volumes",
    },
    {
      id: "minibus",
      label: "Minibus",
      icon: Users,
      description: "Groupes et familles",
    },
  ];

  const transmissions = [
    { id: "manuelle", label: "Manuelle", icon: Cog },
    { id: "automatique", label: "Automatique", icon: Cog },
  ];

  const carburants = [
    { id: "essence", label: "Essence", icon: Fuel },
    { id: "diesel", label: "Diesel", icon: Fuel },
    { id: "electrique", label: "Électrique", icon: Zap },
    { id: "hybride", label: "Hybride", icon: Fuel },
  ];

  const extras = [
    { id: "gps", label: "GPS", price: 5, icon: Navigation },
    { id: "siège-bébé", label: "Siège bébé", price: 8, icon: Users },
    { id: "wifi", label: "WiFi mobile", price: 10, icon: Wifi },
    { id: "climatisation", label: "Climatisation", price: 0, icon: Snowflake },
    {
      id: "assurance-tous-risques",
      label: "Tous risques",
      price: 15,
      icon: ShieldCheck,
    },
    {
      id: "conduite-additionnelle",
      label: "Conducteur additionnel",
      price: 12,
      icon: Users,
    },
  ];

  useEffect(() => {
    fetchVehicules();
    fetchStats();
    fetchVilles();
  }, []);

  useEffect(() => {
    fetchVehicules();
  }, [
    selectedType,
    selectedTransmission,
    selectedFuel,
    selectedCity,
    priceRange,
    searchTerm,
    activeTab,
  ]);

  const fetchVehicules = async () => {
    setLoading(true);
    try {
      const params = {
        type: selectedType !== "tous" ? selectedType : undefined,
        transmission:
          selectedTransmission !== "tous" ? selectedTransmission : undefined,
        carburant: selectedFuel !== "tous" ? selectedFuel : undefined,
        ville: selectedCity !== "tous" ? selectedCity : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        search: searchTerm || undefined,
      };

      const response = await vehiculesApi.getVehicules(params);
      setVehicules(response.data.data || []);
    } catch (error) {
      console.error("Erreur chargement véhicules:", error);
      toast.error("Erreur lors du chargement des véhicules");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await vehiculesApi.getStats();
      setStats(response.data.data || {});
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  };

  const fetchVilles = async () => {
    try {
      // Récupérer les villes uniques depuis les véhicules
      const response = await vehiculesApi.getVehicules({ limit: 100 });
      const vehiculesData = response.data.data || [];

      // Compter les véhicules par ville
      const villeCounts = {};
      vehiculesData.forEach((vehicule) => {
        if (vehicule.ville) {
          villeCounts[vehicule.ville] = (villeCounts[vehicule.ville] || 0) + 1;
        }
      });

      // Transformer en format pour le select
      const villesList = Object.entries(villeCounts).map(([ville, count]) => ({
        id: ville.toLowerCase().replace(/\s+/g, "-"),
        label: ville,
        count,
      }));

      setVilles(villesList);
    } catch (error) {
      console.error("Erreur chargement villes:", error);
      // Villes par défaut en cas d'erreur
      setVilles([
        { id: "saint-denis", label: "Saint-Denis", count: 0 },
        { id: "saint-pierre", label: "Saint-Pierre", count: 0 },
        { id: "saint-paul", label: "Saint-Paul", count: 0 },
        { id: "le-tampon", label: "Le Tampon", count: 0 },
      ]);
    }
  };

  // Gestion du tri
  const sortVehicules = (vehiculesList, sortMethod) => {
    const sorted = [...vehiculesList];
    switch (sortMethod) {
      case "prix-croissant":
        return sorted.sort((a, b) => a.prixJour - b.prixJour);
      case "prix-dec":
        return sorted.sort((a, b) => b.prixJour - a.prixJour);
      case "note":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "marque":
        return sorted.sort((a, b) => a.marque.localeCompare(b.marque));
      default:
        return sorted;
    }
  };

  // Filtrage des véhicules
  const filteredVehicules = sortVehicules(
    vehicules.filter((vehicule) => {
      const matchesSearch =
        vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicule.description &&
          vehicule.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesType =
        selectedType === "tous" ||
        (activeTab === "voitures" &&
          ["economique", "compacte", "berline", "suv", "luxe"].includes(
            vehicule.typeVehicule
          )) ||
        (activeTab === "utilitaires" &&
          ["utilitaire", "camion", "minibus"].includes(
            vehicule.typeVehicule
          )) ||
        vehicule.typeVehicule === selectedType;

      const matchesTransmission =
        selectedTransmission === "tous" ||
        vehicule.transmission === selectedTransmission;
      const matchesFuel =
        selectedFuel === "tous" || vehicule.carburant === selectedFuel;
      const matchesCity =
        selectedCity === "tous" || vehicule.ville === selectedCity;
      const matchesPrice =
        vehicule.prixJour >= priceRange[0] &&
        vehicule.prixJour <= priceRange[1];

      return (
        matchesSearch &&
        matchesType &&
        matchesTransmission &&
        matchesFuel &&
        matchesCity &&
        matchesPrice &&
        vehicule.disponible &&
        vehicule.statut === "active"
      );
    }),
    sortBy
  );


  // Réserver un véhicule
  const handleReserve = async (vehicule) => {
    setSelectedVehicule(vehicule);

    if (pickupDate && returnDate) {
      try {
        const response = await vehiculesApi.checkDisponibilite(
          vehicule.id,
          pickupDate,
          returnDate
        );

        if (response.data.data.disponible) {
          setShowReservation(true);
          toast.info(`Réservation de ${vehicule.marque} ${vehicule.modele}`);
        } else {
          toast.error("Le véhicule n'est pas disponible pour ces dates");
        }
      } catch (error) {
        console.error("Erreur vérification disponibilité:", error);
        setShowReservation(true);
      }
    } else {
      toast.error("Veuillez sélectionner des dates de location");
    }
  };

  // Soumission de réservation
  const handleSubmitReservation = async (e) => {
    e.preventDefault();

    if (
      !reservationForm.nom ||
      !reservationForm.email ||
      !reservationForm.telephone
    ) {
      toast.error("Veuillez remplir les informations obligatoires");
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error("Veuillez sélectionner les dates de location");
      return;
    }

    try {
      const reservationData = {
        vehiculeId: selectedVehicule.id,
        datePrise: pickupDate,
        dateRetour: returnDate,
        lieuPrise: selectedVehicule.ville,
        lieuRetour: selectedVehicule.ville,
        nombreConducteurs: 1,
        kilometrageOption: reservationForm.kilometrage,
        extras: reservationForm.extras,
        nomClient: reservationForm.nom,
        emailClient: reservationForm.email,
        telephoneClient: reservationForm.telephone,
        numeroPermis: reservationForm.permis,
        adresseClient: "",
      };

      const response = await vehiculesApi.createReservation(reservationData);

      toast.success(
        `Réservation confirmée ! Un email de confirmation vous a été envoyé.`
      );

      // Réinitialisation
      setReservationForm({
        nom: "",
        email: "",
        telephone: "",
        permis: "",
        assurance: false,
        kilometrage: "illimité",
        extras: [],
      });
      setShowReservation(false);
    } catch (error) {
      console.error("Erreur création réservation:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la réservation"
      );
    }
  };

  // Recherche avec entrée
  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      fetchVehicules();
      toast.info(`Recherche de "${searchTerm}" en cours...`);
    }
  };

  // Partager un véhicule
  const handleShare = (vehicule) => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicule.marque} ${vehicule.modele}`,
        text: `Découvrez ce véhicule à louer sur OLIPLUS Réunion`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `${vehicule.marque} ${vehicule.modele} - ${window.location.href}`
      );
      toast.success("Lien copié dans le presse-papier");
    }
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedType("tous");
    setSelectedTransmission("tous");
    setSelectedFuel("tous");
    setSelectedCity("tous");
    setPriceRange([30, 150]);
    setSearchTerm("");
    fetchVehicules();
    toast.success("Filtres réinitialisés");
  };

  // Calculer la durée de location
  const calculateDuration = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  // Contacter l'agence
  const handleContactAgency = (vehicule) => {
    toast.info(
      `Ouverture de la conversation avec ${
        vehicule.agence || vehicule.prestataire?.companyName
      }`
    );
    navigate("/mon-compte/messages");
  };

  // Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Récupérer l'image du véhicule
  const getVehicleImage = (vehicule) => {
    if (vehicule.images && vehicule.images.length > 0) {
      return vehicule.images[0];
    }

    // Image par défaut basée sur le type
    const defaultImages = {
      suv: "https://images.unsplash.com/photo-1563720223486-7a472e5c7b52?w=800&auto=format&fit=crop",
      economique:
        "https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=800&auto=format&fit=crop",
      compacte:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
      berline:
        "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop",
      luxe: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop",
      utilitaire:
        "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&auto=format&fit=crop",
      camion:
        "https://images.unsplash.com/photo-1566474591191-8a583d6af81b?w=800&auto=format&fit=crop",
      electrique:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
      minibus:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
    };

    return (
      defaultImages[vehicule.typeVehicule] ||
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white mt-16">
      {/* Hero Section */}
      <div
        className="relative text-white py-16 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&auto=format&fit=crop')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] opacity-50"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Location de Voitures & Utilitaires à La Réunion
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Livraison partout sur l'île • Meilleur prix garanti
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-white text-sm mb-2 block">
                  Lieu de prise en charge
                </Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue placeholder="Choisir une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes les villes</SelectItem>
                    {villes.map((ville) => (
                      <SelectItem key={ville.id} value={ville.label}>
                        {ville.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm mb-2 block">
                  Date de prise en charge
                </Label>
                <Input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="bg-white/50"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <Label className="text-white text-sm mb-2 block">
                  Date de retour
                </Label>
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="bg-white/50"
                  min={pickupDate}
                />
              </div>

              <div className="flex items-end">
                <Button
                  className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-white py-6 text-lg"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>


        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-[#D3D3D3]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres avancés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type de véhicule */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Type de véhicule
                  </h3>
                  <div className="space-y-2">
                    {typesVehicules.map((type) => {
                      const TypeIcon = type.icon;
                      return (
                        <div
                          key={type.id}
                          className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer"
                          onClick={() => setSelectedType(type.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedType === type.id}
                              onCheckedChange={() => setSelectedType(type.id)}
                            />
                            <span className="flex items-center gap-2 text-sm">
                              <TypeIcon className="h-4 w-4" />
                              {type.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-[#D3D3D3]" />

                {/* Transmission */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Transmission
                  </h3>
                  <Select
                    value={selectedTransmission}
                    onValueChange={setSelectedTransmission}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous types</SelectItem>
                      {transmissions.map((trans) => {
                        const TransIcon = trans.icon;
                        return (
                          <SelectItem key={trans.id} value={trans.id}>
                            <span className="flex items-center gap-2">
                              <TransIcon className="h-4 w-4" />
                              {trans.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Carburant */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Type de carburant
                  </h3>
                  <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous types</SelectItem>
                      {carburants.map((fuel) => {
                        const FuelIcon = fuel.icon;
                        return (
                          <SelectItem key={fuel.id} value={fuel.id}>
                            <span className="flex items-center gap-2">
                              <FuelIcon className="h-4 w-4" />
                              {fuel.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prix par jour */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Prix par jour : {priceRange[0]}€ - {priceRange[1]}€
                  </h3>
                  <div className="space-y-2 px-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>30€</span>
                      <span>90€</span>
                      <span>150€</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="150"
                      step="5"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#556B2F]"
                    />
                    <input
                      type="range"
                      min="30"
                      max="150"
                      step="5"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6B8E23]"
                    />
                  </div>
                </div>

                {/* Ville */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Ville de location
                  </h3>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes les villes</SelectItem>
                      {villes.map((ville) => (
                        <SelectItem key={ville.id} value={ville.label}>
                          {ville.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F] hover:text-white transition-colors"
                  onClick={handleResetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>

            {/* Pourquoi nous choisir */}
            <Card className="mt-4 border-[#556B2F]">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-[#8B4513]">
                  Pourquoi choisir OLIPLUS ?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#556B2F] mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Assurance incluse</h4>
                      <p className="text-xs text-gray-600">
                        Tous risques disponibles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-[#6B8E23] mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Flexibilité horaire
                      </h4>
                      <p className="text-xs text-gray-600">
                        Prise en charge 24/7
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-[#8B4513] mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Pas de frais cachés
                      </h4>
                      <p className="text-xs text-gray-600">Prix transparents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Véhicules vérifiés
                      </h4>
                      <p className="text-xs text-gray-600">
                        Contrôle qualité rigoureux
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header avec tabs et tri */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredVehicules.length} véhicule
                  {filteredVehicules.length > 1 ? "s" : ""} disponible
                  {filteredVehicules.length > 1 ? "s" : ""}
                </h2>
                <p className="text-gray-600">
                  Durée sélectionnée : {calculateDuration()} jour
                  {calculateDuration() > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pertinence">Pertinence</SelectItem>
                    <SelectItem value="prix-croissant">
                      Prix croissant
                    </SelectItem>
                    <SelectItem value="prix-dec">Prix décroissant</SelectItem>
                    <SelectItem value="note">Meilleures notes</SelectItem>
                    <SelectItem value="marque">Marque (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="border-[#556B2F] text-[#556B2F]"
                  onClick={() => toast.info("Comparateur bientôt disponible")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Comparer
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="voitures">
                  <Car className="h-4 w-4 mr-2" />
                  Voitures
                </TabsTrigger>
                <TabsTrigger value="utilitaires">
                  <Truck className="h-4 w-4 mr-2" />
                  Utilitaires
                </TabsTrigger>
                <TabsTrigger value="luxe">
                  <Star className="h-4 w-4 mr-2" />
                  Premium
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {loading ? (
                  // Squelette de chargement
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="border-[#D3D3D3] animate-pulse">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="h-48 w-64 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredVehicules.length > 0 ? (
                  filteredVehicules.map((vehicule) => {
                    const duration = calculateDuration();
                    const totalPrice = vehicule.prixJour * duration;
                    const weeklyPrice =
                      vehicule.prixSemaine || vehicule.prixJour * 7 * 0.85; // 15% de réduction pour la semaine

                    return (
                      <Card
                        key={vehicule.id}
                        className="border-[#D3D3D3] hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Image véhicule */}
                            <div className="w-full md:w-64 h-48 relative">
                              <img
                                src={getVehicleImage(vehicule)}
                                alt={`${vehicule.marque} ${vehicule.modele}`}
                                className="w-full h-full object-cover rounded-lg"
                              />

                              {vehicule.carburant === "electrique" && (
                                <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Électrique
                                </Badge>
                              )}
                            </div>

                            {/* Détails véhicule */}
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-[#556B2F] text-white">
                                      {typesVehicules.find(
                                        (t) => t.id === vehicule.typeVehicule
                                      )?.label || vehicule.typeVehicule}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-[#8B4513] text-[#8B4513]"
                                    >
                                      {vehicule.transmission === "automatique"
                                        ? "Auto"
                                        : "Manuelle"}
                                    </Badge>
                                    <Badge variant="outline">
                                      {vehicule.carburant}
                                    </Badge>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {vehicule.marque} {vehicule.modele}
                                  </h3>
                                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{vehicule.ville}</span>
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                      {vehicule.rating.toFixed(1)}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                      ({vehicule.nombreAvis || 0} avis)
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-[#8B4513] mb-1">
                                    {formatPrice(vehicule.prixJour)}
                                    <span className="text-sm font-normal text-gray-500">
                                      /jour
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {formatPrice(weeklyPrice)} la semaine
                                  </p>
                                  <p className="text-lg font-bold text-green-600">
                                    Total : {formatPrice(totalPrice)}
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-4 line-clamp-2">
                                {vehicule.description ||
                                  "Véhicule de qualité disponible à la location."}
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {vehicule.annee}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Fuel className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {vehicule.carburant}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Cog className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {vehicule.puissance}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {vehicule.places} places
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {vehicule.kilometrageInclus}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {vehicule.caracteristiques &&
                                vehicule.caracteristiques.length > 0 ? (
                                  vehicule.caracteristiques
                                    .slice(0, 4)
                                    .map((caract, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="bg-gray-100"
                                      >
                                        {caract}
                                      </Badge>
                                    ))
                                ) : (
                                  <>
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-100"
                                    >
                                      {vehicule.places} places
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-100"
                                    >
                                      {vehicule.portes} portes
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-100"
                                    >
                                      {vehicule.transmission}
                                    </Badge>
                                  </>
                                )}
                              </div>

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium">
                                    {vehicule.agence ||
                                      vehicule.prestataire?.companyName}{" "}
                                    • {vehicule.prestataire?.rating || 4.5}★
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Sheet>
                                    <SheetTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="border-[#556B2F] text-[#556B2F]"
                                        onClick={() =>
                                          setSelectedVehicule(vehicule)
                                        }
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Détails
                                      </Button>
                                    </SheetTrigger>
                                    <SheetContent className="sm:max-w-xl overflow-y-auto">
                                      {selectedVehicule && (
                                        <>
                                          <SheetHeader>
                                            <SheetTitle>
                                              {selectedVehicule.marque}{" "}
                                              {selectedVehicule.modele}
                                            </SheetTitle>
                                            <SheetDescription>
                                              {selectedVehicule.annee} •{" "}
                                              {selectedVehicule.carburant} •{" "}
                                              {selectedVehicule.puissance}
                                            </SheetDescription>
                                          </SheetHeader>
                                          <div className="mt-6 space-y-6">
                                            <img
                                              src={getVehicleImage(
                                                selectedVehicule
                                              )}
                                              alt={`${selectedVehicule.marque} ${selectedVehicule.modele}`}
                                              className="w-full h-64 object-cover rounded-lg"
                                            />

                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Description
                                              </h4>
                                              <p className="text-gray-700">
                                                {selectedVehicule.description ||
                                                  "Véhicule de qualité disponible à la location."}
                                              </p>
                                            </div>

                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Caractéristiques techniques
                                              </h4>
                                              <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-gray-50 p-3 rounded">
                                                  <p className="text-sm text-gray-600">
                                                    Année
                                                  </p>
                                                  <p className="font-semibold">
                                                    {selectedVehicule.annee}
                                                  </p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded">
                                                  <p className="text-sm text-gray-600">
                                                    Carburant
                                                  </p>
                                                  <p className="font-semibold">
                                                    {selectedVehicule.carburant}
                                                  </p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded">
                                                  <p className="text-sm text-gray-600">
                                                    Puissance
                                                  </p>
                                                  <p className="font-semibold">
                                                    {selectedVehicule.puissance}
                                                  </p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded">
                                                  <p className="text-sm text-gray-600">
                                                    Couleur
                                                  </p>
                                                  <p className="font-semibold">
                                                    {selectedVehicule.couleur}
                                                  </p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded">
                                                  <p className="text-sm text-gray-600">
                                                    Places
                                                  </p>
                                                  <p className="font-semibold">
                                                    {selectedVehicule.places}
                                                  </p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded">
                                                  <p className="text-sm text-gray-600">
                                                    Transmission
                                                  </p>
                                                  <p className="font-semibold">
                                                    {
                                                      selectedVehicule.transmission
                                                    }
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Conditions de location
                                              </h4>
                                              <div className="bg-yellow-50 p-4 rounded-lg">
                                                <div className="space-y-2">
                                                  <div className="flex justify-between">
                                                    <span>
                                                      Kilométrage inclus:
                                                    </span>
                                                    <span className="font-semibold">
                                                      {
                                                        selectedVehicule.kilometrageInclus
                                                      }
                                                    </span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span>Caution:</span>
                                                    <span className="font-semibold">
                                                      {formatPrice(
                                                        selectedVehicule.caution
                                                      )}
                                                    </span>
                                                  </div>
                                                  {selectedVehicule.conditionsLocation && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                      {
                                                        selectedVehicule.conditionsLocation
                                                      }
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                À propos de l'agence
                                              </h4>
                                              <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                  <div>
                                                    <p className="font-semibold">
                                                      {selectedVehicule.agence ||
                                                        selectedVehicule
                                                          .prestataire
                                                          ?.companyName ||
                                                        "Professionnel OLIPLUS"}
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                      <span>
                                                        {selectedVehicule.prestataire?.rating?.toFixed(
                                                          1
                                                        ) || 4.5}
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleContactAgency(
                                                        selectedVehicule
                                                      )
                                                    }
                                                  >
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    Contacter
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>

                                            <Button
                                              className="w-full bg-[#8B4513] hover:bg-[#6B3410]"
                                              onClick={() =>
                                                handleReserve(selectedVehicule)
                                              }
                                            >
                                              Réserver maintenant
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    </SheetContent>
                                  </Sheet>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300"
                                    onClick={() => handleShare(vehicule)}
                                  >
                                    <Share2 className="h-4 w-4 mr-1" />
                                    Partager
                                  </Button>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
                                        onClick={() =>
                                          setSelectedVehicule(vehicule)
                                        }
                                      >
                                        Réserver
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-4 sm:p-6">
                                      {selectedVehicule && (
                                        <>
                                          <DialogHeader className="sticky top-0 bg-white z-10">
                                            <DialogTitle>
                                              Réserver :{" "}
                                              {selectedVehicule.marque}{" "}
                                              {selectedVehicule.modele}
                                            </DialogTitle>
                                            <div className="text-sm text-gray-600">
                                              {duration} jour
                                              {duration > 1 ? "s" : ""} • Total
                                              : {formatPrice(totalPrice)}
                                            </div>
                                          </DialogHeader>

                                          <form
                                            onSubmit={handleSubmitReservation}
                                            className="flex flex-col flex-1"
                                          >
                                            <div className="space-y-4 flex-1 py-4">
                                              {/* Dates */}
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                  <Label className="text-sm">
                                                    Date de prise en charge
                                                  </Label>
                                                  <Input
                                                    type="date"
                                                    value={pickupDate}
                                                    onChange={(e) =>
                                                      setPickupDate(
                                                        e.target.value
                                                      )
                                                    }
                                                    required
                                                    className="text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <Label className="text-sm">Date de retour</Label>
                                                  <Input
                                                    type="date"
                                                    value={returnDate}
                                                    onChange={(e) =>
                                                      setReturnDate(
                                                        e.target.value
                                                      )
                                                    }
                                                    min={pickupDate}
                                                    required
                                                    className="text-sm"
                                                  />
                                                </div>
                                              </div>

                                              {/* Lieux de prise en charge et retour */}
                                              <div className="space-y-2">
                                                <h4 className="font-semibold text-[#8B4513] text-sm">
                                                  Lieux de location
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  <div>
                                                    <Label className="text-sm">
                                                      Prise en charge
                                                    </Label>
                                                    <Button
                                                      type="button"
                                                      variant="outline"
                                                      className="w-full justify-start text-left font-normal mt-1 text-sm h-9"
                                                      onClick={() =>
                                                        setShowLocationPickerPickup(
                                                          true
                                                        )
                                                      }
                                                    >
                                                      <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                                                      <span className="truncate">
                                                        {pickupLocation.address ||
                                                          "Sélectionner"}
                                                      </span>
                                                    </Button>
                                                  </div>
                                                  <div>
                                                    <Label className="text-sm">
                                                      Retour
                                                    </Label>
                                                    <Button
                                                      type="button"
                                                      variant="outline"
                                                      className="w-full justify-start text-left font-normal mt-1 text-sm h-9"
                                                      onClick={() =>
                                                        setShowLocationPickerReturn(
                                                          true
                                                        )
                                                      }
                                                    >
                                                      <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                                                      <span className="truncate">
                                                        {returnLocation.address ||
                                                          "Sélectionner"}
                                                      </span>
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Informations personnelles */}
                                              <div className="space-y-2">
                                                <h4 className="font-semibold text-[#8B4513] text-sm">
                                                  Informations personnelles
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  <div>
                                                    <Label className="text-sm">Nom complet *</Label>
                                                    <Input
                                                      value={
                                                        reservationForm.nom
                                                      }
                                                      onChange={(e) =>
                                                        setReservationForm({
                                                          ...reservationForm,
                                                          nom: e.target.value,
                                                        })
                                                      }
                                                      required
                                                      className="text-sm"
                                                    />
                                                  </div>
                                                  <div>
                                                    <Label className="text-sm">Email *</Label>
                                                    <Input
                                                      type="email"
                                                      value={
                                                        reservationForm.email
                                                      }
                                                      onChange={(e) =>
                                                        setReservationForm({
                                                          ...reservationForm,
                                                          email: e.target.value,
                                                        })
                                                      }
                                                      required
                                                      className="text-sm"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  <div>
                                                    <Label className="text-sm">Téléphone *</Label>
                                                    <Input
                                                      type="tel"
                                                      value={
                                                        reservationForm.telephone
                                                      }
                                                      onChange={(e) =>
                                                        setReservationForm({
                                                          ...reservationForm,
                                                          telephone:
                                                            e.target.value,
                                                        })
                                                      }
                                                      required
                                                      className="text-sm"
                                                    />
                                                  </div>
                                                  <div>
                                                    <Label className="text-sm">
                                                      N° permis
                                                    </Label>
                                                    <Input
                                                      value={
                                                        reservationForm.permis
                                                      }
                                                      onChange={(e) =>
                                                        setReservationForm({
                                                          ...reservationForm,
                                                          permis:
                                                            e.target.value,
                                                        })
                                                      }
                                                      className="text-sm"
                                                    />
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Options supplémentaires */}
                                              <div className="space-y-2">
                                                <h4 className="font-semibold text-[#8B4513] text-sm">
                                                  Options supplémentaires
                                                </h4>
                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                  {extras.map((extra) => {
                                                    const ExtraIcon =
                                                      extra.icon;
                                                    const isSelected =
                                                      reservationForm.extras.includes(
                                                        extra.id
                                                      );
                                                    const extraTotal =
                                                      extra.price * duration;

                                                    return (
                                                      <div
                                                        key={extra.id}
                                                        className={`flex items-center justify-between p-2 border rounded text-sm cursor-pointer ${
                                                          isSelected
                                                            ? "border-[#556B2F] bg-[#556B2F]/5"
                                                            : "border-gray-200"
                                                        }`}
                                                        onClick={() => {
                                                          if (isSelected) {
                                                            setReservationForm({
                                                              ...reservationForm,
                                                              extras:
                                                                reservationForm.extras.filter(
                                                                  (id) =>
                                                                    id !==
                                                                    extra.id
                                                                ),
                                                            });
                                                          } else {
                                                            setReservationForm({
                                                              ...reservationForm,
                                                              extras: [
                                                                ...reservationForm.extras,
                                                                extra.id,
                                                              ],
                                                            });
                                                          }
                                                        }}
                                                      >
                                                        <div className="flex items-center gap-2">
                                                          <div
                                                            className={`p-1 rounded ${
                                                              isSelected
                                                                ? "bg-[#556B2F] text-white"
                                                                : "bg-gray-100"
                                                            }`}
                                                          >
                                                            <ExtraIcon className="h-3 w-3" />
                                                          </div>
                                                          <div>
                                                            <p className="font-medium">
                                                              {extra.label}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div className="text-right text-xs">
                                                          <p className="font-semibold">
                                                            {formatPrice(
                                                              extraTotal
                                                            )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>

                                              {/* Récapitulatif */}
                                              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                                <h4 className="font-semibold text-[#8B4513] mb-2">
                                                  Récapitulatif
                                                </h4>
                                                <div className="space-y-1 text-sm">
                                                  <div className="flex justify-between">
                                                    <span>
                                                      Location ({duration}{" "}
                                                      jours)
                                                    </span>
                                                    <span className="font-semibold">
                                                      {formatPrice(totalPrice)}
                                                    </span>
                                                  </div>
                                                  {reservationForm.extras.map(
                                                    (extraId) => {
                                                      const extra = extras.find(
                                                        (e) => e.id === extraId
                                                      );
                                                      const extraTotal = extra
                                                        ? extra.price * duration
                                                        : 0;
                                                      return (
                                                        <div
                                                          key={extraId}
                                                          className="flex justify-between"
                                                        >
                                                          <span className="truncate">
                                                            {extra?.label}
                                                          </span>
                                                          <span className="flex-shrink-0 ml-2">
                                                            +
                                                            {formatPrice(
                                                              extraTotal
                                                            )}
                                                          </span>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                  <Separator className="my-1" />
                                                  <div className="flex justify-between font-bold">
                                                    <span>Total</span>
                                                    <span className="text-[#8B4513]">
                                                      {formatPrice(
                                                        totalPrice +
                                                          reservationForm.extras.reduce(
                                                            (
                                                              total,
                                                              extraId
                                                            ) => {
                                                              const extra =
                                                                extras.find(
                                                                  (e) =>
                                                                    e.id ===
                                                                    extraId
                                                                );
                                                              return (
                                                                total +
                                                                (extra
                                                                  ? extra.price *
                                                                    duration
                                                                  : 0)
                                                              );
                                                            },
                                                            0
                                                          )
                                                      )}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <DialogFooter className="sticky bottom-0 bg-white pt-4 gap-2 flex flex-col sm:flex-row">
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                  setShowReservation(false)
                                                }
                                                className="text-sm"
                                              >
                                                Annuler
                                              </Button>
                                              <Button
                                                type="submit"
                                                className="bg-[#556B2F] hover:bg-[#6B8E23] text-sm"
                                              >
                                                <CreditCard className="h-4 w-4 mr-2" />
                                                Confirmer
                                              </Button>
                                            </DialogFooter>
                                          </form>
                                        </>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="border-[#D3D3D3]">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Aucun véhicule ne correspond à vos critères
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Essayez de modifier vos filtres ou vos dates de
                        recherche
                      </p>
                      <Button variant="outline" onClick={handleResetFilters}>
                        Voir tous les véhicules
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Location Picker Modals */}
      <LocationPickerModal
        open={showLocationPickerPickup}
        onOpenChange={setShowLocationPickerPickup}
        latitude={pickupLocation.latitude}
        longitude={pickupLocation.longitude}
        onLocationChange={(lat, lng) => {
          setPickupLocation({
            latitude: lat,
            longitude: lng,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          });
          setShowLocationPickerPickup(false);
          toast.success("Lieu de prise en charge défini");
        }}
      />

      <LocationPickerModal
        open={showLocationPickerReturn}
        onOpenChange={setShowLocationPickerReturn}
        latitude={returnLocation.latitude}
        longitude={returnLocation.longitude}
        onLocationChange={(lat, lng) => {
          setReturnLocation({
            latitude: lat,
            longitude: lng,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          });
          setShowLocationPickerReturn(false);
          toast.success("Lieu de retour défini");
        }}
      />
    </div>
  );
};

export default LocationVoiturePage;
