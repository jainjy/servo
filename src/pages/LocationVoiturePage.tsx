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
  const [reservationForm, setReservationForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    permis: "",
    assurance: false,
    kilometrage: "illimité",
    extras: [],
  });

  const typesVehicules = [
    {
      id: "economique",
      label: "Économique",
      icon: Car,
      description: "Petites voitures éco",
      count: 12,
    },
    {
      id: "compacte",
      label: "Compacte",
      icon: Car,
      description: "Voitures citadines",
      count: 18,
    },
    {
      id: "berline",
      label: "Berline",
      icon: Car,
      description: "Confort et espace",
      count: 15,
    },
    {
      id: "suv",
      label: "SUV & 4x4",
      icon: Car,
      description: "Aventures et famille",
      count: 22,
    },
    {
      id: "utilitaire",
      label: "Utilitaire",
      icon: Truck,
      description: "Petits utilitaires",
      count: 8,
    },
    {
      id: "camion",
      label: "Camion",
      icon: Truck,
      description: "Grands volumes",
      count: 6,
    },
    {
      id: "luxe",
      label: "Luxe & Premium",
      icon: Car,
      description: "Haut de gamme",
      count: 9,
    },
    {
      id: "minibus",
      label: "Minibus",
      icon: Users,
      description: "Groupes et familles",
      count: 5,
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

  const villes = [
    { id: "saint-denis", label: "Saint-Denis", count: 25 },
    { id: "saint-pierre", label: "Saint-Pierre", count: 18 },
    { id: "saint-paul", label: "Saint-Paul", count: 15 },
    { id: "le-tampon", label: "Le Tampon", count: 12 },
    { id: "saint-louis", label: "Saint-Louis", count: 10 },
    { id: "saint-joseph", label: "Saint-Joseph", count: 8 },
    { id: "sainte-marie", label: "Sainte-Marie", count: 7 },
    { id: "sainte-suzanne", label: "Sainte-Suzanne", count: 5 },
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

  const vehiculesList = [
    {
      id: 1,
      marque: "Toyota",
      modele: "Yaris",
      type: "economique",
      transmission: "manuelle",
      carburant: "essence",
      city: "saint-denis",
      prixJour: 35,
      prixSemaine: 210,
      rating: 4.6,
      reviews: 128,
      image:
        "https://images.unsplash.com/photo-1593941707882-a5bba5338fe2?w=800&auto=format&fit=crop",
      description:
        "Voiture économique parfaite pour la ville, consommation réduite.",
      caracteristiques: [
        "4 places",
        "Climatisation",
        "Bluetooth",
        "Airbags",
        "ABS",
      ],
      disponible: true,
      agence: "Location Réunion Auto",
      agenceRating: 4.8,
      kilometrage: "300 km/jour inclus",
      annee: 2023,
      puissance: "75ch",
      couleur: "Blanc",
      equipements: [
        "Climatisation automatique",
        "Caméra de recul",
        "Système audio Bluetooth",
        "Contrôle de stabilité",
      ],
    },
    {
      id: 2,
      marque: "Renault",
      modele: "Clio",
      type: "compacte",
      transmission: "automatique",
      carburant: "diesel",
      city: "saint-pierre",
      prixJour: 45,
      prixSemaine: 270,
      rating: 4.7,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w-800&auto=format&fit=crop",
      description:
        "Compacte spacieuse avec transmission automatique, idéale pour la famille.",
      caracteristiques: [
        "5 places",
        "Climatisation",
        "GPS",
        "Toit ouvrant",
        "Régulateur",
      ],
      disponible: true,
      agence: "Auto Loc 974",
      agenceRating: 4.5,
      kilometrage: "illimité",
      annee: 2024,
      puissance: "90ch",
      couleur: "Gris",
      equipements: [
        "Toit ouvrant panoramique",
        "Système infodivertissement",
        "Aide au stationnement",
        "Limiteur de vitesse",
      ],
    },
    {
      id: 3,
      marque: "Peugeot",
      modele: "3008",
      type: "suv",
      transmission: "automatique",
      carburant: "hybride",
      city: "saint-paul",
      prixJour: 75,
      prixSemaine: 450,
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1563720223486-7a472e5c7b52?w-800&auto=format&fit=crop",
      description:
        "SUV familial hybride, confort et espace pour vos aventures réunionnaises.",
      caracteristiques: [
        "5 places",
        "Climatisation bi-zone",
        "GPS",
        "Toit panoramique",
        "4x4",
      ],
      disponible: true,
      agence: "Premium Location",
      agenceRating: 4.9,
      kilometrage: "400 km/jour inclus",
      annee: 2023,
      puissance: "180ch",
      couleur: "Bleu",
      equipements: [
        "Système hybride",
        "Toit panoramique électrique",
        "Système audio premium",
        "Aides à la conduite",
      ],
    },
    {
      id: 4,
      marque: "Mercedes",
      modele: "Classe C",
      type: "luxe",
      transmission: "automatique",
      carburant: "essence",
      city: "saint-denis",
      prixJour: 120,
      prixSemaine: 720,
      rating: 4.8,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w-800&auto=format&fit=crop",
      description: "Berline premium avec tous les équipements haut de gamme.",
      caracteristiques: [
        "5 places",
        "Climatisation 4 zones",
        "GPS premium",
        "Cuir",
        "Assistance conduite",
      ],
      disponible: true,
      agence: "Luxe Auto Réunion",
      agenceRating: 4.7,
      kilometrage: "illimité",
      annee: 2024,
      puissance: "258ch",
      couleur: "Noir",
      equipements: [
        "Intérieur cuir",
        "Système Burmester",
        "Phares LED matriciels",
        "Pilotage automatique",
      ],
    },
    {
      id: 5,
      marque: "Renault",
      modele: "Kangoo",
      type: "utilitaire",
      transmission: "manuelle",
      carburant: "diesel",
      city: "le-tampon",
      prixJour: 55,
      prixSemaine: 330,
      rating: 4.4,
      reviews: 92,
      image:
        "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w-800&auto=format&fit=crop",
      description:
        "Utilitaire pratique pour le transport de marchandises, volume important.",
      caracteristiques: [
        "3 places",
        "Climatisation",
        "Grand volume",
        "Hayon",
        "ABS",
      ],
      disponible: true,
      agence: "Pro Location 974",
      agenceRating: 4.6,
      kilometrage: "300 km/jour inclus",
      annee: 2022,
      puissance: "95ch",
      couleur: "Blanc",
      equipements: [
        "Hayon électrique",
        "Caméra de recul",
        "Aide au chargement",
        "Grand volume (3,9m³)",
      ],
    },
    {
      id: 6,
      marque: "Ford",
      modele: "Ranger",
      type: "camion",
      transmission: "automatique",
      carburant: "diesel",
      city: "saint-louis",
      prixJour: 85,
      prixSemaine: 510,
      rating: 4.5,
      reviews: 45,
      image:
        "https://images.unsplash.com/photo-1566474591191-8a583d6af81b?w-800&auto=format&fit=crop",
      description:
        "Pick-up robuste pour travaux et transport de matériel en tout terrain.",
      caracteristiques: [
        "5 places",
        "Climatisation",
        "4x4",
        "Grande benne",
        "Treuil",
      ],
      disponible: true,
      agence: "Location Pro Réunion",
      agenceRating: 4.4,
      kilometrage: "250 km/jour inclus",
      annee: 2023,
      puissance: "213ch",
      couleur: "Gris",
      equipements: [
        "4x4 permanent",
        "Treuil électrique",
        "Protections sous caisse",
        "Benne de 1 tonne",
      ],
    },
    {
      id: 7,
      marque: "Nissan",
      modele: "Leaf",
      type: "compacte",
      transmission: "automatique",
      carburant: "electrique",
      city: "saint-pierre",
      prixJour: 60,
      prixSemaine: 360,
      rating: 4.8,
      reviews: 78,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w-800&auto=format&fit=crop",
      description:
        "Voiture électrique silencieuse et économique, parfaite pour l'île.",
      caracteristiques: [
        "5 places",
        "Climatisation",
        "Autonomie 270km",
        "Recharge rapide",
        "Écran tactile",
      ],
      disponible: true,
      agence: "Eco Location Réunion",
      agenceRating: 4.9,
      kilometrage: "illimité",
      annee: 2024,
      puissance: "150ch",
      couleur: "Bleu",
      equipements: [
        "Autonomie 270km",
        "Recharge rapide 80% en 30min",
        "Écran tactile 8 pouces",
        "Aides à la conduite",
      ],
    },
    {
      id: 8,
      marque: "Volkswagen",
      modele: "Caravelle",
      type: "minibus",
      transmission: "manuelle",
      carburant: "diesel",
      city: "saint-denis",
      prixJour: 95,
      prixSemaine: 570,
      rating: 4.7,
      reviews: 56,
      image:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w-800&auto=format&fit=crop",
      description:
        "Minibus 9 places idéal pour les groupes, familles ou équipes.",
      caracteristiques: [
        "9 places",
        "Climatisation",
        "Grand espace",
        "Sièges amovibles",
        "Toit élevé",
      ],
      disponible: true,
      agence: "Family Location",
      agenceRating: 4.7,
      kilometrage: "300 km/jour inclus",
      annee: 2023,
      puissance: "150ch",
      couleur: "Blanc",
      equipements: [
        "Sièges amovibles",
        "Climatisation double zone",
        "Portes coulissantes",
        "Grand volume",
      ],
    },
  ];

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => {
      setVehicules(vehiculesList);
      setLoading(false);
      // Dates par défaut
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      setPickupDate(today.toISOString().split("T")[0]);
      setReturnDate(nextWeek.toISOString().split("T")[0]);
    }, 1000);
  }, []);

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
        vehicule.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "tous" ||
        (activeTab === "voitures" &&
          ["economique", "compacte", "berline", "suv", "luxe"].includes(
            vehicule.type
          )) ||
        (activeTab === "utilitaires" &&
          ["utilitaire", "camion", "minibus"].includes(vehicule.type)) ||
        vehicule.type === selectedType;

      const matchesTransmission =
        selectedTransmission === "tous" ||
        vehicule.transmission === selectedTransmission;
      const matchesFuel =
        selectedFuel === "tous" || vehicule.carburant === selectedFuel;
      const matchesCity =
        selectedCity === "tous" || vehicule.city === selectedCity;
      const matchesPrice =
        vehicule.prixJour >= priceRange[0] &&
        vehicule.prixJour <= priceRange[1];

      return (
        matchesSearch &&
        matchesType &&
        matchesTransmission &&
        matchesFuel &&
        matchesCity &&
        matchesPrice
      );
    }),
    sortBy
  );

  // Gestion des favoris
  const toggleSavedVehicule = (vehiculeId) => {
    if (savedVehicules.includes(vehiculeId)) {
      setSavedVehicules(savedVehicules.filter((id) => id !== vehiculeId));
      toast.success("Véhicule retiré des favoris");
    } else {
      setSavedVehicules([...savedVehicules, vehiculeId]);
      toast.success("Véhicule ajouté aux favoris");
    }
  };

  // Réserver un véhicule
  const handleReserve = (vehicule) => {
    setSelectedVehicule(vehicule);
    setShowReservation(true);
    toast.info(`Réservation de ${vehicule.marque} ${vehicule.modele}`);
  };

  // Soumission de réservation
  const handleSubmitReservation = (e) => {
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

    // Calcul du prix total
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const basePrice = selectedVehicule.prixJour * days;
    const extrasPrice = reservationForm.extras.reduce((total, extraId) => {
      const extra = extras.find((e) => e.id === extraId);
      return total + (extra ? extra.price * days : 0);
    }, 0);
    const totalPrice = basePrice + extrasPrice;

    toast.success(
      `Réservation confirmée ! Total : ${totalPrice}€ pour ${days} jours. Un email de confirmation vous a été envoyé.`
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
  };

  // Recherche avec entrée
  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      toast.info(`Recherche de "${searchTerm}" en cours...`);
    }
  };

  // Partager un véhicule
  const handleShare = (vehicule) => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicule.marque} ${vehicule.modele}`,
        text: `Découvrez ce véhicule à louer sur SERVO Réunion`,
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
    toast.info(`Ouverture de la conversation avec ${vehicule.agence}`);
    // Redirection vers les messages
    navigate("/mon-compte/messages");
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
              Plus de 100 véhicules disponibles • Livraison partout sur l'île •
              Meilleur prix garanti
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
                      <SelectItem key={ville.id} value={ville.id}>
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
                  onClick={() => toast.info("Recherche en cours...")}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm opacity-90">Véhicules</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm opacity-90">Villes</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Assistance</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">4.8★</div>
                <div className="text-sm opacity-90">Avis clients</div>
              </CardContent>
            </Card>
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
                          <Badge variant="outline">{type.count}</Badge>
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
                        <SelectItem key={ville.id} value={ville.id}>
                          {ville.label} ({ville.count})
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
                  Pourquoi choisir SERVO ?
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
                <TabsTrigger value="favoris">
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      savedVehicules.length > 0
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  Favoris ({savedVehicules.length})
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
                    const weeklyPrice = vehicule.prixSemaine;

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
                                src={vehicule.image}
                                alt={`${vehicule.marque} ${vehicule.modele}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                onClick={() => toggleSavedVehicule(vehicule.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    savedVehicules.includes(vehicule.id)
                                      ? "fill-red-500 text-red-500"
                                      : ""
                                  }`}
                                />
                              </Button>
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
                                      {
                                        typesVehicules.find(
                                          (t) => t.id === vehicule.type
                                        )?.label
                                      }
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
                                    <span>
                                      {
                                        villes.find(
                                          (v) => v.id === vehicule.city
                                        )?.label
                                      }
                                    </span>
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                      {vehicule.rating}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                      ({vehicule.reviews} avis)
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-[#8B4513] mb-1">
                                    {vehicule.prixJour}€
                                    <span className="text-sm font-normal text-gray-500">
                                      /jour
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {weeklyPrice}€ la semaine
                                  </p>
                                  <p className="text-lg font-bold text-green-600">
                                    Total : {totalPrice}€
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-4 line-clamp-2">
                                {vehicule.description}
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
                                    {vehicule.caracteristiques[0]}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {vehicule.kilometrage}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {vehicule.caracteristiques
                                  .slice(0, 4)
                                  .map((caract, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="bg-gray-100"
                                    >
                                      {caract}
                                    </Badge>
                                  ))}
                              </div>

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium">
                                    {vehicule.agence} • {vehicule.agenceRating}★
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
                                              src={selectedVehicule.image}
                                              alt={`${selectedVehicule.marque} ${selectedVehicule.modele}`}
                                              className="w-full h-64 object-cover rounded-lg"
                                            />

                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Description
                                              </h4>
                                              <p className="text-gray-700">
                                                {selectedVehicule.description}
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
                                              </div>
                                            </div>

                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Équipements inclus
                                              </h4>
                                              <div className="flex flex-wrap gap-2">
                                                {selectedVehicule.equipements.map(
                                                  (equip, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      variant="outline"
                                                    >
                                                      {equip}
                                                    </Badge>
                                                  )
                                                )}
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
                                                      {selectedVehicule.agence}
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                      <span>
                                                        {
                                                          selectedVehicule.agenceRating
                                                        }
                                                      </span>
                                                      <span className="text-gray-500 text-sm">
                                                        (
                                                        {
                                                          selectedVehicule.reviews
                                                        }{" "}
                                                        avis)
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
                                    <DialogContent className="max-w-2xl">
                                      {selectedVehicule && (
                                        <>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Réserver :{" "}
                                              {selectedVehicule.marque}{" "}
                                              {selectedVehicule.modele}
                                            </DialogTitle>
                                            <div className="text-sm text-gray-600">
                                              {duration} jour
                                              {duration > 1 ? "s" : ""} • Total
                                              : {totalPrice}€
                                            </div>
                                          </DialogHeader>

                                          <form
                                            onSubmit={handleSubmitReservation}
                                          >
                                            <div className="space-y-6 py-4">
                                              {/* Dates */}
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <Label>
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
                                                  />
                                                </div>
                                                <div>
                                                  <Label>Date de retour</Label>
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
                                                  />
                                                </div>
                                              </div>

                                              {/* Informations personnelles */}
                                              <div className="space-y-4">
                                                <h4 className="font-semibold text-[#8B4513]">
                                                  Informations personnelles
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                  <div>
                                                    <Label>Nom complet *</Label>
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
                                                    />
                                                  </div>
                                                  <div>
                                                    <Label>Email *</Label>
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
                                                    />
                                                  </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                  <div>
                                                    <Label>Téléphone *</Label>
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
                                                    />
                                                  </div>
                                                  <div>
                                                    <Label>
                                                      Numéro de permis
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
                                                    />
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Options supplémentaires */}
                                              <div className="space-y-4">
                                                <h4 className="font-semibold text-[#8B4513]">
                                                  Options supplémentaires
                                                </h4>
                                                <div className="space-y-2">
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
                                                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
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
                                                        <div className="flex items-center gap-3">
                                                          <div
                                                            className={`p-2 rounded ${
                                                              isSelected
                                                                ? "bg-[#556B2F] text-white"
                                                                : "bg-gray-100"
                                                            }`}
                                                          >
                                                            <ExtraIcon className="h-4 w-4" />
                                                          </div>
                                                          <div>
                                                            <p className="font-medium">
                                                              {extra.label}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                              {extra.price}
                                                              €/jour
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div className="text-right">
                                                          <p className="font-semibold">
                                                            {extraTotal}€
                                                          </p>
                                                          <p className="text-sm text-gray-500">
                                                            pour {duration} jour
                                                            {duration > 1
                                                              ? "s"
                                                              : ""}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>

                                              {/* Récapitulatif */}
                                              <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-semibold text-[#8B4513] mb-3">
                                                  Récapitulatif de la location
                                                </h4>
                                                <div className="space-y-2">
                                                  <div className="flex justify-between">
                                                    <span>
                                                      Location ({duration}{" "}
                                                      jours)
                                                    </span>
                                                    <span className="font-semibold">
                                                      {totalPrice}€
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
                                                          <span>
                                                            {extra?.label}
                                                          </span>
                                                          <span>
                                                            +{extraTotal}€
                                                          </span>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                  <Separator />
                                                  <div className="flex justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span className="text-[#8B4513]">
                                                      {totalPrice +
                                                        reservationForm.extras.reduce(
                                                          (total, extraId) => {
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
                                                        )}
                                                      €
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <DialogFooter>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                  setShowReservation(false)
                                                }
                                              >
                                                Annuler
                                              </Button>
                                              <Button
                                                type="submit"
                                                className="bg-[#556B2F] hover:bg-[#6B8E23]"
                                              >
                                                <CreditCard className="h-4 w-4 mr-2" />
                                                Confirmer la réservation
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

            {/* FAQ et informations */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-[#556B2F]">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">
                    Questions fréquentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">
                        Quels documents sont nécessaires ?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Permis de conduire valide, pièce d'identité et carte
                        bancaire. Le permis doit être valide depuis au moins 1
                        an.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">
                        Y a-t-il une caution ?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Oui, une préautorisation sur carte bancaire est
                        demandée. Le montant varie selon le véhicule
                        (300-1500€).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">
                        Peut-on louer sans carte de crédit ?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Non, une carte de crédit est obligatoire pour la caution
                        et la garantie.
                      </p>
                    </div>
                    <Button variant="link" className="text-[#556B2F] p-0">
                      Voir toutes les questions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#6B8E23] bg-gradient-to-br from-[#556B2F]/5 to-[#6B8E23]/5">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">
                    Conseils location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#556B2F] pl-4 py-2">
                      <h4 className="font-medium">Vérifiez le véhicule</h4>
                      <p className="text-sm text-gray-600">
                        Inspectez le véhicule avant départ et signez l'état des
                        lieux.
                      </p>
                    </div>
                    <div className="border-l-4 border-[#6B8E23] pl-4 py-2">
                      <h4 className="font-medium">Kilométrage inclus</h4>
                      <p className="text-sm text-gray-600">
                        Vérifiez le kilométrage quotidien inclus pour éviter les
                        frais supplémentaires.
                      </p>
                    </div>
                    <div className="border-l-4 border-[#8B4513] pl-4 py-2">
                      <h4 className="font-medium">Assurance optionnelle</h4>
                      <p className="text-sm text-gray-600">
                        L'assurance tous risques réduit considérablement votre
                        franchise en cas d'accident.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationVoiturePage;
