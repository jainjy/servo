import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Car,
  Truck,
  Bike,
  Bus,
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
  Loader2,
  Battery,
  Weight,
  Gauge,
  Monitor,
} from "lucide-react";
import { vehiculesApi } from "@/lib/api/vehicules";
import { LocationPickerModal } from "@/components/location-picker-modal";
import { BusRoutesView } from "@/components/BusRoutesView";
import { Button } from "@/components/ui/button";
import TourismNavigation from "@/components/TourismNavigation";
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
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [selectedType, setSelectedType] = useState("tous");
  const [selectedTransmission, setSelectedTransmission] = useState("tous");
  const [selectedFuel, setSelectedFuel] = useState("tous");
  const [priceRange, setPriceRange] = useState([10, 200]);
  const [selectedCity, setSelectedCity] = useState("tous");
  const [savedVehicules, setSavedVehicules] = useState([]);
  const [activeTab, setActiveTab] = useState("tous");
  const [sortBy, setSortBy] = useState("pertinence");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [showLocationPickerPickup, setShowLocationPickerPickup] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPickerReturn, setShowLocationPickerReturn] =
    useState(false);
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

  // Catégories basées sur votre modèle
  const categories = [
    {
      id: "tous",
      label: "Tous les véhicules",
      icon: Car,
      description: "Toutes catégories",
    },
    {
      id: "voiture",
      label: "Voitures",
      icon: Car,
      description: "Tous types de voitures",
    },
    {
      id: "camion",
      label: "Camions & Utilitaires",
      icon: Truck,
      description: "Transport de marchandises",
    },
    {
      id: "moto",
      label: "Motos",
      icon: Monitor,
      description: "Roadsters, trails, sportives",
    },
    {
      id: "velo",
      label: "Vélos",
      icon: Bike,
      description: "VTT, VTC, électriques",
    },
  ];

  // Types de véhicules par catégorie
  const typesParCategorie = {
    voiture: [
      { id: "economique", label: "Économique" },
      { id: "compacte", label: "Compacte" },
      { id: "berline", label: "Berline" },
      { id: "suv", label: "SUV & 4x4" },
      { id: "luxe", label: "Luxe & Premium" },
    ],
    camion: [
      { id: "utilitaire", label: "Utilitaire" },
      { id: "pick-up", label: "Pick-up" },
      { id: "camionnette", label: "Camionnette" },
    ],
    moto: [
      { id: "roadster", label: "Roadster" },
      { id: "trail", label: "Trail" },
      { id: "sportive", label: "Sportive" },
      { id: "custom", label: "Custom" },
      { id: "scooter", label: "Scooter" },
    ],
    velo: [
      { id: "VTT", label: "VTT" },
      { id: "VTC", label: "VTC" },
      { id: "route", label: "Route" },
      { id: "electrique", label: "Électrique" },
      { id: "ville", label: "Ville" },
    ],
  };

  const transmissions = [
    { id: "manuelle", label: "Manuelle", icon: Cog },
    { id: "automatique", label: "Automatique", icon: Cog },
    { id: "semi_automatique", label: "Semi-automatique", icon: Cog },
  ];

  const carburants = [
    { id: "essence", label: "Essence", icon: Fuel },
    { id: "diesel", label: "Diesel", icon: Fuel },
    { id: "electrique", label: "Électrique", icon: Zap },
    { id: "hybride", label: "Hybride", icon: Battery },
    { id: "gpl", label: "GPL", icon: Fuel },
  ];

  const extras = [
    { id: "gps", label: "GPS", price: 5, icon: Navigation },
    { id: "siège-bébé", label: "Siège bébé", price: 8, icon: Users },
    { id: "wifi", label: "WiFi mobile", price: 10, icon: Wifi },
    { id: "climatisation", label: "Climatisation", price: 0, icon: Snowflake },
    { id: "casque", label: "Casque", price: 5, icon: Shield },
    { id: "antivol", label: "Antivol", price: 3, icon: ShieldCheck },
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

  // Image par défaut par catégorie
  const getDefaultImage = (categorie, typeVehicule) => {
    const defaultImages = {
      voiture: {
        suv: "https://images.unsplash.com/photo-1563720223486-7a472e5c7b52?w=800&auto=format&fit=crop",
        economique:
          "https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=800&auto=format&fit=crop",
        compacte:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
        berline:
          "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop",
        luxe: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop",
        default:
          "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop",
      },
      camion: {
        utilitaire:
          "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&auto=format&fit=crop",
        "pick-up":
          "https://images.unsplash.com/photo-1566474591191-8a583d6af81b?w=800&auto=format&fit=crop",
        default:
          "https://images.unsplash.com/photo-1566474591191-8a583d6af81b?w=800&auto=format&fit=crop",
      },
      moto: {
        roadster:
          "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop",
        trail:
          "https://images.unsplash.com/photo-1527847263472-aa5338d178b8?w=800&auto=format&fit=crop",
        sportive:
          "https://images.unsplash.com/photo-1620748690536-eba2d67a10e6?w=800&auto=format&fit=crop",
        default:
          "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop",
      },
      velo: {
        VTT: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&auto=format&fit=crop",
        VTC: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop",
        route:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop",
        electrique:
          "https://images.unsplash.com/photo-1598335624134-5bceb5de202d?w=800&auto=format&fit=crop",
        default:
          "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&auto=format&fit=crop",
      },
    };

    return (
      defaultImages[categorie]?.[typeVehicule] ||
      defaultImages[categorie]?.default ||
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop"
    );
  };

  useEffect(() => {
    fetchVehicules();
    fetchStats();
    fetchVilles();
  }, []);

  useEffect(() => {
    fetchVehicules();
  }, [
    selectedCategory,
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
        categorie: selectedCategory !== "tous" ? selectedCategory : undefined,
        typeVehicule: selectedType !== "tous" ? selectedType : undefined,
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
      const response = await vehiculesApi.getVehicules({ limit: 100 });
      const vehiculesData = response.data.data || [];

      const villeCounts = {};
      vehiculesData.forEach((vehicule) => {
        if (vehicule.ville) {
          villeCounts[vehicule.ville] = (villeCounts[vehicule.ville] || 0) + 1;
        }
      });

      const villesList = Object.entries(villeCounts).map(([ville, count]) => ({
        id: ville.toLowerCase().replace(/\s+/g, "-"),
        label: ville,
        count,
      }));

      setVilles(villesList);
    } catch (error) {
      console.error("Erreur chargement villes:", error);
      setVilles([
        { id: "saint-denis", label: "Saint-Denis", count: 0 },
        { id: "saint-pierre", label: "Saint-Pierre", count: 0 },
        { id: "saint-paul", label: "Saint-Paul", count: 0 },
        { id: "le-tampon", label: "Le Tampon", count: 0 },
        { id: "saint-leu", label: "Saint-Leu", count: 0 },
        { id: "cilaos", label: "Cilaos", count: 0 },
      ]);
    }
  };

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

  const filteredVehicules = sortVehicules(
    vehicules.filter((vehicule) => {
      const matchesSearch =
        vehicule.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicule.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicule.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        vehicule.typeVehicule?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "tous" || vehicule.categorie === selectedCategory;

      const matchesType =
        selectedType === "tous" || vehicule.typeVehicule === selectedType;

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
        matchesCategory &&
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

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !reservationForm.nom ||
      !reservationForm.email ||
      !reservationForm.telephone
    ) {
      toast.error("Veuillez remplir les informations obligatoires");
      setIsSubmitting(false);
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error("Veuillez sélectionner les dates de location");
      setIsSubmitting(false);
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
      setSelectedVehicule(null);
    } catch (error) {
      console.error("Erreur création réservation:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la réservation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      fetchVehicules();
      toast.info(`Recherche de "${searchTerm}" en cours...`);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("tous");
    setSelectedType("tous");
    setSelectedTransmission("tous");
    setSelectedFuel("tous");
    setSelectedCity("tous");
    setPriceRange([10, 200]);
    setSearchTerm("");
    setActiveTab("tous");
    fetchVehicules();
    toast.success("Filtres réinitialisés");
  };

  const calculateDuration = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getVehicleImage = (vehicule) => {
    if (vehicule.images && vehicule.images.length > 0) {
      return vehicule.images[0];
    }
    return getDefaultImage(vehicule.categorie, vehicule.typeVehicule);
  };

  const renderVehicleSpecifics = (vehicule) => {
    const specifics = [];

    // Caractéristiques communes
    if (vehicule.annee) specifics.push(`${vehicule.annee}`);
    if (vehicule.places) specifics.push(`${vehicule.places} places`);
    if (vehicule.portes) specifics.push(`${vehicule.portes} portes`);

    // Spécifiques par catégorie
    if (vehicule.categorie === "moto" && vehicule.cylindree) {
      specifics.push(`${vehicule.cylindree}cc`);
    }

    if (vehicule.categorie === "velo") {
      if (vehicule.typeVelo) specifics.push(vehicule.typeVelo);
      if (vehicule.assistanceElec) specifics.push("Assistance électrique");
      if (vehicule.poids) specifics.push(`${vehicule.poids}kg`);
    }

    if (vehicule.carburant) specifics.push(vehicule.carburant);
    if (vehicule.transmission) specifics.push(vehicule.transmission);

    return specifics;
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] opacity-50"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Location de Véhicules à La Réunion
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Voitures • Camions • Motos • Vélos • Livraison sur toute l'île
            </p>
          </div>
          <TourismNavigation page="sejour" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="location" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="location" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Location de Véhicules
              </TabsTrigger>
              <TabsTrigger value="bus" className="flex items-center gap-2">
                <Bus className="h-4 w-4" />
                Réseaux de Bus
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="location" className="mt-0">
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
                    {/* Catégorie de véhicule */}
                    <div>
                      <h3 className="font-semibold mb-3 text-[#8B4513]">
                        Catégorie
                      </h3>
                      <div className="space-y-2">
                        {categories.map((category) => {
                          const CategoryIcon = category.icon;
                          return (
                            <div
                              key={category.id}
                              className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer"
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedCategory === category.id}
                                  onCheckedChange={() =>
                                    setSelectedCategory(category.id)
                                  }
                                />
                                <span className="flex items-center gap-2 text-sm">
                                  <CategoryIcon className="h-4 w-4" />
                                  {category.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Type de véhicule (dynamique selon la catégorie) */}
                    {selectedCategory !== "tous" &&
                      typesParCategorie[selectedCategory] && (
                        <>
                          <Separator className="bg-[#D3D3D3]" />
                          <div>
                            <h3 className="font-semibold mb-3 text-[#8B4513]">
                              Type
                            </h3>
                            <div className="space-y-2">
                              <div
                                className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                                onClick={() => setSelectedType("tous")}
                              >
                                <Checkbox
                                  checked={selectedType === "tous"}
                                  onCheckedChange={() =>
                                    setSelectedType("tous")
                                  }
                                />
                                <span className="text-sm">Tous les types</span>
                              </div>
                              {typesParCategorie[selectedCategory].map(
                                (type) => (
                                  <div
                                    key={type.id}
                                    className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                                    onClick={() => setSelectedType(type.id)}
                                  >
                                    <Checkbox
                                      checked={selectedType === type.id}
                                      onCheckedChange={() =>
                                        setSelectedType(type.id)
                                      }
                                    />
                                    <span className="text-sm">
                                      {type.label}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </>
                      )}

                    <Separator className="bg-[#D3D3D3]" />

                    {/* Transmission (uniquement pour voitures et camions) */}
                    {["voiture", "camion", "moto"].includes(
                      selectedCategory
                    ) && (
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
                    )}

                    {/* Carburant (uniquement pour véhicules motorisés) */}
                    {selectedCategory !== "velo" && (
                      <div>
                        <h3 className="font-semibold mb-3 text-[#8B4513]">
                          Type de carburant
                        </h3>
                        <Select
                          value={selectedFuel}
                          onValueChange={setSelectedFuel}
                        >
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
                    )}

                    {/* Prix par jour */}
                    <div>
                      <h3 className="font-semibold mb-3 text-[#8B4513]">
                        Prix par jour : {priceRange[0]}€ - {priceRange[1]}€
                      </h3>
                      <div className="space-y-2 px-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>10€</span>
                          <span>100€</span>
                          <span>200€</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          step="5"
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([
                              parseInt(e.target.value),
                              priceRange[1],
                            ])
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#556B2F]"
                        />
                        <input
                          type="range"
                          min="10"
                          max="200"
                          step="5"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              parseInt(e.target.value),
                            ])
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
                      <Select
                        value={selectedCity}
                        onValueChange={setSelectedCity}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes villes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tous">
                            Toutes les villes
                          </SelectItem>
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
                          <h4 className="font-medium text-sm">
                            Assurance incluse
                          </h4>
                          <p className="text-xs text-gray-600">
                            Protection complète
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-[#6B8E23] mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">
                            Livraison gratuite
                          </h4>
                          <p className="text-xs text-gray-600">
                            Dans toute l'île
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">
                            Véhicules vérifiés
                          </h4>
                          <p className="text-xs text-gray-600">
                            Entretien régulier
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
                        <SelectItem value="prix-dec">
                          Prix décroissant
                        </SelectItem>
                        <SelectItem value="note">Meilleures notes</SelectItem>
                        <SelectItem value="marque">Marque (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Véhicules */}
                <div className="space-y-4">
                  {loading ? (
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
                                <Badge className="absolute top-2 left-2 bg-[#556B2F] text-white">
                                  {getCategoryIcon(vehicule.categorie)}
                                  <span className="ml-1 capitalize">
                                    {vehicule.categorie}
                                  </span>
                                </Badge>
                                {vehicule.carburant === "electrique" && (
                                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Électrique
                                  </Badge>
                                )}
                                {vehicule.categorie === "velo" &&
                                  vehicule.assistanceElec && (
                                    <Badge className="absolute bottom-2 left-2 bg-blue-500 text-white">
                                      <Battery className="h-3 w-3 mr-1" />
                                      Assistance
                                    </Badge>
                                  )}
                              </div>

                              {/* Détails véhicule */}
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <Badge
                                        variant="outline"
                                        className="border-[#8B4513] text-[#8B4513]"
                                      >
                                        {vehicule.typeVehicule}
                                      </Badge>
                                      {vehicule.transmission && (
                                        <Badge variant="outline">
                                          {vehicule.transmission}
                                        </Badge>
                                      )}
                                      {vehicule.carburant &&
                                        vehicule.carburant !== "electrique" && (
                                          <Badge variant="outline">
                                            {vehicule.carburant}
                                          </Badge>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                      {vehicule.marque} {vehicule.modele}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                      <MapPin className="h-4 w-4" />
                                      <span>{vehicule.ville}</span>
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-semibold">
                                        {vehicule.rating?.toFixed(1) || "0.0"}
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
                                    {vehicule.prixSemaine && (
                                      <p className="text-sm text-gray-500">
                                        {formatPrice(vehicule.prixSemaine)} la
                                        semaine
                                      </p>
                                    )}
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
                                  {renderVehicleSpecifics(vehicule).map(
                                    (spec, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                          <span className="text-xs text-gray-600">
                                            ✓
                                          </span>
                                        </div>
                                        <span className="text-sm">{spec}</span>
                                      </div>
                                    )
                                  )}
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">
                                      {vehicule.prestataire?.companyName ||
                                        "Professionnel OLIPLUS"}{" "}
                                      •{vehicule.prestataire?.rating || 4.5}★
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
                                                {selectedVehicule.categorie}
                                                {selectedVehicule.carburant &&
                                                  ` • ${selectedVehicule.carburant}`}
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
                                                  Caractéristiques
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                  <div className="bg-gray-50 p-3 rounded">
                                                    <p className="text-sm text-gray-600">
                                                      Catégorie
                                                    </p>
                                                    <p className="font-semibold capitalize">
                                                      {
                                                        selectedVehicule.categorie
                                                      }
                                                    </p>
                                                  </div>
                                                  <div className="bg-gray-50 p-3 rounded">
                                                    <p className="text-sm text-gray-600">
                                                      Type
                                                    </p>
                                                    <p className="font-semibold">
                                                      {
                                                        selectedVehicule.typeVehicule
                                                      }
                                                    </p>
                                                  </div>
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
                                                      Marque
                                                    </p>
                                                    <p className="font-semibold">
                                                      {selectedVehicule.marque}
                                                    </p>
                                                  </div>
                                                  {selectedVehicule.carburant && (
                                                    <div className="bg-gray-50 p-3 rounded">
                                                      <p className="text-sm text-gray-600">
                                                        Carburant
                                                      </p>
                                                      <p className="font-semibold">
                                                        {
                                                          selectedVehicule.carburant
                                                        }
                                                      </p>
                                                    </div>
                                                  )}
                                                  {selectedVehicule.transmission && (
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
                                                  )}
                                                  {selectedVehicule.cylindree && (
                                                    <div className="bg-gray-50 p-3 rounded">
                                                      <p className="text-sm text-gray-600">
                                                        Cylindrée
                                                      </p>
                                                      <p className="font-semibold">
                                                        {
                                                          selectedVehicule.cylindree
                                                        }
                                                        cc
                                                      </p>
                                                    </div>
                                                  )}
                                                  {selectedVehicule.poids && (
                                                    <div className="bg-gray-50 p-3 rounded">
                                                      <p className="text-sm text-gray-600">
                                                        Poids
                                                      </p>
                                                      <p className="font-semibold">
                                                        {selectedVehicule.poids}
                                                        kg
                                                      </p>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              <div>
                                                <h4 className="font-semibold text-[#8B4513] mb-2">
                                                  Conditions de location
                                                </h4>
                                                <div className="bg-yellow-50 p-4 rounded-lg">
                                                  <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                      <span>Caution:</span>
                                                      <span className="font-semibold">
                                                        {formatPrice(
                                                          selectedVehicule.caution ||
                                                            0
                                                        )}
                                                      </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                      <span>Disponible:</span>
                                                      <span className="font-semibold">
                                                        {selectedVehicule.disponible
                                                          ? "Oui"
                                                          : "Non"}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <Button
                                                className="w-full bg-[#8B4513] hover:bg-[#6B3410]"
                                                onClick={() =>
                                                  handleReserve(
                                                    selectedVehicule
                                                  )
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
                                      className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
                                      onClick={() => {
                                        setSelectedVehicule(vehicule);
                                        setShowReservation(true);
                                      }}
                                    >
                                      Réserver
                                    </Button>
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
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bus" className="mt-0">
            <BusRoutesView />
          </TabsContent>
        </Tabs>
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

      {/* Reservation Dialog */}
      <Dialog open={showReservation} onOpenChange={setShowReservation}>
        <DialogContent className="max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-4 sm:p-6">
          {selectedVehicule && (
            <>
              <DialogHeader className="sticky top-4 bg-white z-10 mb-2 rounded p-2">
                <DialogTitle>
                  Réserver : {selectedVehicule.marque} {selectedVehicule.modele}
                </DialogTitle>
                <div className="text-sm text-gray-600">
                  {calculateDuration()} jour
                  {calculateDuration() > 1 ? "s" : ""} • Total :{" "}
                  {formatPrice(selectedVehicule.prixJour * calculateDuration())}
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
                      <Label className="text-sm">Date de prise en charge</Label>
                      <Input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Date de retour</Label>
                      <Input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={pickupDate}
                        required
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Lieux */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#8B4513] text-sm">
                      Lieux de location
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Prise en charge</Label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-1 text-sm h-9"
                          onClick={() => setShowLocationPickerPickup(true)}
                        >
                          <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {pickupLocation.address || "Sélectionner"}
                          </span>
                        </Button>
                      </div>
                      <div>
                        <Label className="text-sm">Retour</Label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-1 text-sm h-9"
                          onClick={() => setShowLocationPickerReturn(true)}
                        >
                          <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {returnLocation.address || "Sélectionner"}
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
                          value={reservationForm.nom}
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
                          value={reservationForm.email}
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
                          value={reservationForm.telephone}
                          onChange={(e) =>
                            setReservationForm({
                              ...reservationForm,
                              telephone: e.target.value,
                            })
                          }
                          required
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">N° permis</Label>
                        <Input
                          value={reservationForm.permis}
                          onChange={(e) =>
                            setReservationForm({
                              ...reservationForm,
                              permis: e.target.value,
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
                        const ExtraIcon = extra.icon;
                        const isSelected = reservationForm.extras.includes(
                          extra.id
                        );
                        const extraTotal = extra.price * calculateDuration();

                        // Filtrer les extras par catégorie
                        const isForThisVehicle =
                          (selectedVehicule.categorie === "velo" &&
                            ["casque", "antivol"].includes(extra.id)) ||
                          (selectedVehicule.categorie !== "velo" &&
                            !["casque", "antivol"].includes(extra.id)) ||
                          extra.id === "assurance-tous-risques" ||
                          extra.id === "conduite-additionnelle";

                        if (!isForThisVehicle) return null;

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
                                  extras: reservationForm.extras.filter(
                                    (id) => id !== extra.id
                                  ),
                                });
                              } else {
                                setReservationForm({
                                  ...reservationForm,
                                  extras: [...reservationForm.extras, extra.id],
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
                                <p className="font-medium">{extra.label}</p>
                              </div>
                            </div>
                            <div className="text-right text-xs">
                              <p className="font-semibold">
                                {formatPrice(extraTotal)}
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
                        <span>Location ({calculateDuration()} jours)</span>
                        <span className="font-semibold">
                          {formatPrice(
                            selectedVehicule.prixJour * calculateDuration()
                          )}
                        </span>
                      </div>
                      {reservationForm.extras.map((extraId) => {
                        const extra = extras.find((e) => e.id === extraId);
                        const extraTotal = extra
                          ? extra.price * calculateDuration()
                          : 0;
                        return (
                          <div key={extraId} className="flex justify-between">
                            <span className="truncate">{extra?.label}</span>
                            <span className="flex-shrink-0 ml-2">
                              +{formatPrice(extraTotal)}
                            </span>
                          </div>
                        );
                      })}
                      <Separator className="my-1" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-[#8B4513]">
                          {formatPrice(
                            selectedVehicule.prixJour * calculateDuration() +
                              reservationForm.extras.reduce(
                                (total, extraId) => {
                                  const extra = extras.find(
                                    (e) => e.id === extraId
                                  );
                                  return (
                                    total +
                                    (extra
                                      ? extra.price * calculateDuration()
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
                    onClick={() => setShowReservation(false)}
                    className="text-sm"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#556B2F] hover:bg-[#6B8E23] text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirmer
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

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
