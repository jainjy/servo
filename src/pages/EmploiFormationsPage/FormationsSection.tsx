import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  Users,
  Award,
  BookOpen,
  MapPin,
  ChevronRight,
  Star,
  Calendar,
  Zap,
  RotateCw,
  GraduationCap,
  Download,
  Mail,
  Heart,
  Share2,
  Eye,
  FileText,
  X,
  CheckCircle,
  ExternalLink,
  Upload,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; // Importez useAuth

const FormationsSection = ({
  loading,
  savedItems,
  appliedItems,
  toggleSavedItem,
  handleApply,
  handleShare,
  handleDownloadGuide,
  handleFileUpload,
  cvFile,
  setCvFile,
  setLoading,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Utilisez le hook useAuth
  
  const [formations, setFormations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [selectedFormat, setSelectedFormat] = useState("tous");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedOrganismes, setSelectedOrganismes] = useState([]);
  const [sortBy, setSortBy] = useState("pertinence");
  const [activeTab, setActiveTab] = useState("toutes");
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const categories = [
    { id: "informatique", label: "Informatique & Numérique", count: 45 },
    { id: "management", label: "Management & Leadership", count: 32 },
    { id: "commerce", label: "Commerce & Marketing", count: 28 },
    { id: "batiment", label: "Bâtiment & Construction", count: 36 },
    { id: "sante", label: "Santé & Bien-être", count: 24 },
    { id: "comptabilite", label: "Comptabilité & Finance", count: 19 },
    { id: "langues", label: "Langues étrangères", count: 15 },
    { id: "artisanat", label: "Artisanat & Métiers", count: 22 },
  ];

  const formats = [
    { id: "presentiel", label: "Présentiel", icon: Users },
    { id: "distanciel", label: "100% en ligne", icon: BookOpen },
    { id: "hybride", label: "Hybride", icon: RotateCw },
    { id: "alternance", label: "Alternance", icon: GraduationCap },
  ];

  const formationsList = [
    {
      id: 1,
      title: "Développeur Web Full Stack",
      organisme: "OpenClassrooms",
      category: "informatique",
      format: "distanciel",
      duration: "6 mois",
      participants: "25 places",
      price: 2990,
      rating: 4.8,
      reviews: 124,
      location: "100% en ligne",
      certification: "RNCP niveau 6",
      description:
        "Formation complète pour devenir développeur full stack avec projets concrets",
      features: [
        "Projets tutorés",
        "Certification reconnue",
        "Suivi personnalisé",
      ],
      startDate: "15/01/2024",
      financed: true,
      certified: true,
      details: {
        prerequisites: "Bonne maîtrise de l'ordinateur, logique algorithmique",
        program: [
          "HTML/CSS avancé",
          "JavaScript moderne",
          "React & Node.js",
          "Bases de données",
          "DevOps & déploiement",
        ],
        methodology: "Projets pratiques, mentorat individuel, communauté active",
        financingOptions: ["CPF", "Pôle Emploi", "Entreprise", "Personnel"],
      },
    },
    {
      id: 2,
      title: "Gestion de Projet Agile",
      organisme: "CNAM",
      category: "management",
      format: "hybride",
      duration: "3 mois",
      participants: "18 places",
      price: 1850,
      rating: 4.6,
      reviews: 89,
      location: "Paris + Distanciel",
      certification: "Certificat CNAM",
      description: "Maîtrisez les méthodologies Agile et Scrum",
      features: [
        "Cas réels d'entreprise",
        "Certification PMI",
        "Ateliers pratiques",
      ],
      startDate: "20/02/2024",
      financed: true,
      certified: true,
    },
    {
      id: 3,
      title: "CAP Électricien",
      organisme: "AFPA",
      category: "batiment",
      format: "presentiel",
      duration: "12 mois",
      participants: "15 places",
      price: 4500,
      rating: 4.9,
      reviews: 156,
      location: "Lyon",
      certification: "Diplôme d'État",
      description: "Formation complète avec stages en entreprise",
      features: ["Matériel fourni", "Stages garantis", "Aide à l'emploi"],
      startDate: "10/01/2024",
      financed: true,
      certified: true,
    },
    {
      id: 4,
      title: "Marketing Digital Avancé",
      organisme: "Coursera",
      category: "commerce",
      format: "distanciel",
      duration: "4 mois",
      participants: "Illimité",
      price: 790,
      rating: 4.7,
      reviews: 234,
      location: "100% en ligne",
      certification: "Google Certificat",
      description: "Spécialisation en marketing digital et analytics",
      features: [
        "Certification Google",
        "Accès à vie",
        "Réseau professionnel",
      ],
      startDate: "Démarrage immédiat",
      financed: false,
      certified: true,
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFormations(formationsList);
      setLoading(false);
    }, 1000);
  }, []);

  // Vérifier si on doit ouvrir un dialogue après le retour du login
  useEffect(() => {
    const checkForPendingAction = () => {
      // Vérifier si l'utilisateur vient de se connecter et a une action en attente
      const pendingAction = sessionStorage.getItem('pendingFormationAction');
      const formationId = sessionStorage.getItem('selectedFormationId');
      
      if (pendingAction === 'inscription' && formationId && isAuthenticated) {
        // Trouver la formation correspondante
        const formationToOpen = formationsList.find(f => f.id.toString() === formationId);
        if (formationToOpen) {
          // Ouvrir le dialogue
          setSelectedFormation(formationToOpen);
          setIsContactDialogOpen(true);
          
          // Afficher un message de bienvenue
          toast.success("Bienvenue ! Vous pouvez maintenant vous inscrire à la formation.");
        }
        
        // Nettoyer le sessionStorage
        sessionStorage.removeItem('pendingFormationAction');
        sessionStorage.removeItem('selectedFormationId');
      }
    };

    // Vérifier immédiatement au chargement
    checkForPendingAction();

    // Écouter les changements de sessionStorage (pour gérer les onglets multiples)
    const handleStorageChange = (e) => {
      if (e.key === 'pendingFormationAction' || e.key === 'selectedFormationId') {
        checkForPendingAction();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]); // Dépendre de isAuthenticated

  const filteredFormations = formations.filter((formation) => {
    const matchesSearch =
      formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "tous" || formation.category === selectedCategory;
    const matchesFormat =
      selectedFormat === "tous" || formation.format === selectedFormat;
    const matchesPrice =
      formation.price >= priceRange[0] && formation.price <= priceRange[1];

    const matchesTab =
      activeTab === "toutes" ||
      (activeTab === "certifiantes" && formation.certified) ||
      (activeTab === "financees" && formation.financed) ||
      (activeTab === "alternance" && formation.format === "alternance");

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFormat &&
      matchesPrice &&
      matchesTab
    );
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      toast.info(`Recherche de formations pour "${searchTerm}"`);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("tous");
    setSelectedFormat("tous");
    setSelectedOrganismes([]);
    setPriceRange([0, 5000]);
    setSearchTerm("");
    setSortBy("pertinence");
    setActiveTab("toutes");
    toast.success("Filtres réinitialisés");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    toast.success(
      "Votre demande a été envoyée ! Un conseiller vous contactera sous 24h."
    );
    setContactForm({ name: "", email: "", phone: "", message: "" });
    setIsContactDialogOpen(false);
  };

  const handleDownloadCatalog = () => {
    toast.info("Téléchargement du catalogue en cours...");
    setTimeout(() => {
      toast.success("Catalogue téléchargé avec succès !");
    }, 1500);
  };

  const handleInscription = (formation) => {
    // Vérifier si l'utilisateur est connecté en utilisant useAuth
    console.log("Auth status:", { isAuthenticated, user }); // Debug
    
    if (!isAuthenticated) {
      // Stocker les informations dans sessionStorage pour récupération après login
      sessionStorage.setItem('pendingFormationAction', 'inscription');
      sessionStorage.setItem('selectedFormationId', formation.id.toString());
      sessionStorage.setItem('formationTitle', formation.title);
      
      // Stocker aussi l'URL actuelle pour le retour
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      // Rediriger vers login
      navigate("/login");
      return;
    }

    // Si connecté, ouvrir directement le formulaire
    console.log("User is authenticated, opening dialog for formation:", formation.title);
    setSelectedFormation(formation);
    setIsContactDialogOpen(true);
  };

  const statsData = [
    { label: "Formations disponibles", value: "527", icon: BookOpen },
    { label: "Organismes partenaires", value: "86", icon: Users },
    { label: "Certifications reconnues", value: "312", icon: Award },
    { label: "Taux de réussite", value: "94%", icon: Star },
  ];

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher une formation, un organisme, une compétence..."
            className="pl-12 py-7 text-lg rounded-xl border-0 shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            className="absolute right-2 top-2 bg-[#8B4513] hover:bg-[#6B3410] text-white px-6"
            onClick={handleSearch}
          >
            Rechercher
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-[#D3D3D3]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Catégories */}
              <div>
                <h3 className="font-semibold mb-3 text-[#8B4513]">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedCategory === cat.id}
                          onCheckedChange={() => setSelectedCategory(cat.id)}
                        />
                        <span className="text-sm">{cat.label}</span>
                      </div>
                      <Badge variant="outline">{cat.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#D3D3D3]" />

              {/* Format */}
              <div>
                <h3 className="font-semibold mb-3 text-[#8B4513]">Format</h3>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les formats</SelectItem>
                    {formats.map((format) => {
                      const FormatIcon = format.icon;
                      return (
                        <SelectItem key={format.id} value={format.id}>
                          <span className="flex items-center gap-2">
                            <FormatIcon className="h-4 w-4" />
                            {format.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Prix */}
              <div>
                <h3 className="font-semibold mb-3 text-[#8B4513]">
                  Prix maximum : {priceRange[1]}€
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#556B2F]"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0€</span>
                  <span>2500€</span>
                  <span>5000€</span>
                </div>
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

          {/* Quick Actions */}
          <Card className="mt-4 border-[#D3D3D3]">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 text-[#8B4513]">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F] hover:text-white"
                  onClick={handleDownloadCatalog}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le catalogue
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Demande de conseil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <Card
                  key={index}
                  className="border-[#D3D3D3] hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-[#556B2F]">
                          {stat.value}
                        </p>
                      </div>
                      <StatIcon className="h-8 w-8 text-[#6B8E23]" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabs et tri */}
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <TabsList className="grid grid-cols-4 max-w-md">
                  <TabsTrigger value="toutes">Toutes</TabsTrigger>
                  <TabsTrigger value="certifiantes">Certifiantes</TabsTrigger>
                  <TabsTrigger value="financees">Financées</TabsTrigger>
                  <TabsTrigger value="alternance">Alternance</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {filteredFormations.length} formation
                    {filteredFormations.length > 1 ? "s" : ""} trouvée
                    {filteredFormations.length > 1 ? "s" : ""}
                  </span>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value={activeTab} className="space-y-6">
                {/* Formations List */}
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="border-[#D3D3D3]">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <Skeleton className="h-48 w-full md:w-48 rounded-lg" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : filteredFormations.length > 0 ? (
                    filteredFormations.map((formation) => (
                      <Card
                        key={formation.id}
                        className="border-[#D3D3D3] hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Formation Image/Logo */}
                            <div className="relative w-full md:w-48 h-48 bg-gradient-to-br from-[#556B2F] to-[#6B8E23] rounded-lg flex items-center justify-center">
                              <BookOpen className="h-16 w-16 text-white" />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white"
                                onClick={() =>
                                  toggleSavedItem(formation.id, "formations")
                                }
                              >
                                <Star
                                  className={`h-4 w-4 ${
                                    savedItems.includes(
                                      `formations-${formation.id}`
                                    )
                                      ? "fill-yellow-400 text-yellow-400"
                                      : ""
                                  }`}
                                />
                              </Button>
                            </div>

                            {/* Formation Details */}
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-[#556B2F] hover:bg-[#6B8E23] text-white">
                                      {formation.category
                                        .charAt(0)
                                        .toUpperCase() +
                                        formation.category.slice(1)}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-[#8B4513] text-[#8B4513]"
                                    >
                                      {
                                        formats.find(
                                          (f) => f.id === formation.format
                                        )?.label
                                      }
                                    </Badge>
                                    {formation.certified && (
                                      <Badge className="bg-green-100 text-green-800 border-green-200">
                                        Certifiée
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {formation.title}
                                  </h3>
                                  <p className="text-gray-600 mb-3">
                                    {formation.organisme}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-[#8B4513] mb-1">
                                    {formation.price === 0
                                      ? "Gratuit"
                                      : `${formation.price}€`}
                                  </div>
                                  <div className="flex items-center justify-end gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                      {formation.rating}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                      ({formation.reviews} avis)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-4">
                                {formation.description}
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {formation.duration}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {formation.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    {formation.participants}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    Début : {formation.startDate}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {formation.features.map((feature, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-gray-100"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Award className="h-4 w-4 text-[#6B8E23]" />
                                  <span className="text-sm font-medium">
                                    {formation.certification}
                                  </span>
                                </div>
                                <div className="flex gap-3">
                                  <Sheet>
                                    <SheetTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F] hover:text-white"
                                        onClick={() =>
                                          setSelectedFormation(formation)
                                        }
                                      >
                                        Détails
                                      </Button>
                                    </SheetTrigger>
                                    <SheetContent className="sm:max-w-xl overflow-y-auto">
                                      <SheetHeader>
                                        <SheetTitle>
                                          {formation.title}
                                        </SheetTitle>
                                        <SheetDescription>
                                          {formation.organisme} •{" "}
                                          {formation.location}
                                        </SheetDescription>
                                      </SheetHeader>
                                      <div className="mt-6 space-y-6">
                                        <div>
                                          <h4 className="font-semibold text-[#8B4513] mb-2">
                                            Description
                                          </h4>
                                          <p className="text-gray-700">
                                            {formation.description}
                                          </p>
                                        </div>
                                        {formation.details && (
                                          <>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Programme
                                              </h4>
                                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                                {formation.details.program?.map(
                                                  (item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Financements
                                              </h4>
                                              <div className="flex flex-wrap gap-2">
                                                {formation.details.financingOptions?.map(
                                                  (option, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      variant="outline"
                                                      className="bg-gray-50"
                                                    >
                                                      {option}
                                                    </Badge>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </SheetContent>
                                  </Sheet>
                                  <Button
                                    className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
                                    onClick={() => handleInscription(formation)}
                                  >
                                    S'inscrire
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-[#D3D3D3]">
                      <CardContent className="pt-12 pb-12 text-center">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Aucune formation ne correspond à vos critères
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Essayez de modifier vos filtres ou votre recherche
                        </p>
                        <Button variant="outline" onClick={handleResetFilters}>
                          Voir toutes les formations
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialog de contact */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedFormation
                ? `Demande d'information : ${selectedFormation.title}`
                : "Demande d'information sur les formations"}
            </DialogTitle>
            <DialogDescription>
              Un conseiller vous recontactera sous 24h pour répondre à vos
              questions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      message: e.target.value,
                    })
                  }
                  placeholder="Décrivez votre projet de formation..."
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#556B2F] hover:bg-[#6B8E23]"
              >
                Envoyer la demande
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormationsSection;