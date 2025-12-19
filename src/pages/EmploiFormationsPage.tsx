import React, { useState, useEffect } from "react";
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
  Users2,
  Zap,
  RotateCw,
  GraduationCap,
  Download,
  Mail,
  Phone,
  Briefcase,
  Building,
  Heart,
  Share2,
  Bell,
  Code,
  Hammer,
  TrendingUp,
  Activity,
  DollarSign,
  ShoppingCart,
  Palette,
  ExternalLink,
  Upload,
  Eye,
  FileText,
  X,
  CheckCircle,
  Target,
  AlertCircle,
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
import { Progress } from "@/components/ui/progress";
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

const EmploiFormationsPage = () => {
  const [activeSection, setActiveSection] = useState("formations");
  const [loading, setLoading] = useState(false);
  const [researchProgress, setResearchProgress] = useState(50);
  const [cvFile, setCvFile] = useState(null);
  const [motivationLetter, setMotivationLetter] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [appliedItems, setAppliedItems] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    active: false,
    keywords: "",
    frequency: "quotidien",
  });

  // Données communes
  const heroData = {
    formations: {
      title: "Formations & Développement Professionnel",
      description:
        "Trouvez la formation qui correspond à vos ambitions parmi +500 programmes certifiants",
      bgImage: "url('/formation.jpg')",
      icon: BookOpen,
    },
    emploi: {
      title: "Trouvez l'emploi qui vous correspond",
      description:
        "+2 345 offres d'emploi dans tous les secteurs • Recrutement direct et gratuit",
      bgImage: "url('/emploi.jpg')",
      icon: Briefcase,
    },
    alternance: {
      title: "Alternance & Stages",
      description:
        "Lancez votre carrière avec une expérience professionnelle concrète • +850 offres pour étudiants",
      bgImage: "url('/stage.jpg')",
      icon: GraduationCap,
    },
  };

  // Gestion du téléchargement de CV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux (max 5MB)");
        return;
      }
      if (!file.type.includes("pdf") && !file.type.includes("doc")) {
        toast.error("Format non supporté. Utilisez PDF ou DOC");
        return;
      }
      setCvFile(file);
      toast.success("CV téléchargé avec succès");
    }
  };

  // Gestion des favoris
  const toggleSavedItem = (itemId, section) => {
    const itemKey = `${section}-${itemId}`;
    if (savedItems.includes(itemKey)) {
      setSavedItems(savedItems.filter((id) => id !== itemKey));
      toast.success("Retiré des favoris");
    } else {
      setSavedItems([...savedItems, itemKey]);
      toast.success("Ajouté aux favoris");
    }
  };

  // Gestion des candidatures
  const handleApply = (itemId, section, itemTitle) => {
    const itemKey = `${section}-${itemId}`;
    if (!appliedItems.includes(itemKey)) {
      setAppliedItems([...appliedItems, itemKey]);
      setResearchProgress(Math.min(researchProgress + 25, 100));
      toast.success(`Candidature envoyée pour ${itemTitle}`);
    } else {
      toast.info("Vous avez déjà postulé");
    }
  };

  // Téléchargement de guide
  const handleDownloadGuide = (guideType) => {
    toast.info(`Téléchargement du guide ${guideType}...`);
    setTimeout(() => {
      toast.success("Guide téléchargé avec succès");
    }, 1500);
  };

  // Partage
  const handleShare = (item, section) => {
    const shareText = `Découvrez cette ${
      section === "formations" ? "formation" : "offre"
    } : ${item.title} - ${item.entreprise || item.organisme}`;

    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  // SECTION FORMATIONS
  const FormationsSection = () => {
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
          prerequisites:
            "Bonne maîtrise de l'ordinateur, logique algorithmique",
          program: [
            "HTML/CSS avancé",
            "JavaScript moderne",
            "React & Node.js",
            "Bases de données",
            "DevOps & déploiement",
          ],
          methodology:
            "Projets pratiques, mentorat individuel, communauté active",
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
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Catégories
                  </h3>
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
                  <Select
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                  >
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
                        <SelectItem value="prix-dec">
                          Prix décroissant
                        </SelectItem>
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
                                      onClick={() => {
                                        setSelectedFormation(formation);
                                        setIsContactDialogOpen(true);
                                      }}
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
                          <Button
                            variant="outline"
                            onClick={handleResetFilters}
                          >
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
        <Dialog
          open={isContactDialogOpen}
          onOpenChange={setIsContactDialogOpen}
        >
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

  // SECTION EMPLOI
  const EmploiSection = () => {
    const [offres, setOffres] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSecteur, setSelectedSecteur] = useState("tous");
    const [selectedType, setSelectedType] = useState("tous");
    const [selectedExperience, setSelectedExperience] = useState("tous");
    const [salaryRange, setSalaryRange] = useState([30000, 80000]);
    const [onlyUrgent, setOnlyUrgent] = useState(false);
    const [onlyRemote, setOnlyRemote] = useState(false);
    const [activeTab, setActiveTab] = useState("toutes");
    const [sortBy, setSortBy] = useState("pertinence");
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplicationDialogOpen, setIsApplicationDialogOpen] =
      useState(false);

    const secteurs = [
      {
        id: "informatique",
        label: "Informatique & Tech",
        count: 156,
        icon: Code,
      },
      {
        id: "batiment",
        label: "Bâtiment & Construction",
        count: 89,
        icon: Hammer,
      },
      {
        id: "commerce",
        label: "Commerce & Vente",
        count: 142,
        icon: TrendingUp,
      },
      { id: "sante", label: "Santé & Social", count: 78, icon: Activity },
    ];

    const typesContrat = [
      { id: "cdi", label: "CDI", color: "bg-green-100 text-green-800" },
      { id: "cdd", label: "CDD", color: "bg-blue-100 text-blue-800" },
      {
        id: "interim",
        label: "Intérim",
        color: "bg-purple-100 text-purple-800",
      },
      {
        id: "freelance",
        label: "Freelance",
        color: "bg-orange-100 text-orange-800",
      },
    ];

    const offresList = [
      {
        id: 1,
        title: "Développeur Frontend React",
        entreprise: "TechVision Solutions",
        secteur: "informatique",
        type: "cdi",
        experience: "intermediaire",
        location: "Paris (75)",
        salaire: "45-55K€",
        date: "Publiée il y a 2 jours",
        urgent: true,
        remote: true,
        description:
          "Nous recherchons un développeur Frontend expérimenté en React pour rejoindre notre équipe produit.",
        missions: [
          "Développer de nouvelles features en React/TypeScript",
          "Optimiser les performances frontend",
          "Collaborer avec les designers et product managers",
        ],
        competences: [
          "React",
          "TypeScript",
          "Redux",
          "CSS/SASS",
          "Jest",
          "Git",
        ],
        avantages: [
          "Télétravail flexible",
          "Mutuelle premium",
          "Équipement fourni",
          "Prime annuelle",
        ],
        icon: Code,
      },
      {
        id: 2,
        title: "Chef de Chantier BTP",
        entreprise: "Bâtiments Modernes SA",
        secteur: "batiment",
        type: "cdi",
        experience: "senior",
        location: "Lyon (69)",
        salaire: "50-65K€",
        date: "Publiée il y a 5 jours",
        urgent: true,
        remote: false,
        description:
          "Gestion complète de chantiers de construction neuve de 50 à 200 logements.",
        missions: [
          "Planification et coordination des travaux",
          "Gestion des équipes et sous-traitants",
          "Contrôle qualité et respect des délais",
        ],
        competences: [
          "Gestion de chantier",
          "Normes BTP",
          "Autocad",
          "Management",
          "Sécurité",
        ],
        avantages: [
          "Véhicule de fonction",
          "Prime résultat",
          "Formation continue",
          "Mutuelle famille",
        ],
        icon: Hammer,
      },
    ];

    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setOffres(offresList);
        setLoading(false);
      }, 1000);
    }, []);

    const filteredOffres = offres.filter((offre) => {
      const matchesSearch =
        offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSecteur =
        selectedSecteur === "tous" || offre.secteur === selectedSecteur;
      const matchesType =
        selectedType === "tous" || offre.type === selectedType;
      const matchesUrgent = !onlyUrgent || offre.urgent;
      const matchesRemote = !onlyRemote || offre.remote;

      const matchesTab =
        activeTab === "toutes" ||
        (activeTab === "urgentes" && offre.urgent) ||
        (activeTab === "remote" && offre.remote) ||
        (activeTab === "recentes" && offre.date.includes("1 jour")) ||
        (activeTab === "sauvegardees" &&
          savedItems.includes(`emploi-${offre.id}`));

      return (
        matchesSearch &&
        matchesSecteur &&
        matchesType &&
        matchesUrgent &&
        matchesRemote &&
        matchesTab
      );
    });

    const handleSearch = () => {
      if (searchTerm.trim()) {
        toast.info(`Recherche d'emploi pour "${searchTerm}"`);
      }
    };

    const handleResetFilters = () => {
      setSelectedSecteur("tous");
      setSelectedType("tous");
      setSelectedExperience("tous");
      setSalaryRange([30000, 80000]);
      setOnlyUrgent(false);
      setOnlyRemote(false);
      setSearchTerm("");
      setSortBy("pertinence");
      setActiveTab("toutes");
      toast.success("Filtres réinitialisés");
    };

    const handleSubmitApplication = (e) => {
      e.preventDefault();
      if (!cvFile && !motivationLetter.trim()) {
        toast.error(
          "Veuillez ajouter au moins un CV ou un message de motivation"
        );
        return;
      }

      toast.success("Candidature envoyée avec succès !");
      setMotivationLetter("");
      setCvFile(null);
      setIsApplicationDialogOpen(false);
    };

    const toggleJobAlerts = () => {
      setAlertSettings({
        ...alertSettings,
        active: !alertSettings.active,
      });
      toast.success(
        alertSettings.active ? "Alertes désactivées" : "Alertes activées"
      );
    };

    const statsData = [
      { label: "Offres actives", value: "2,345", icon: Briefcase },
      { label: "Nouvelles offres (7j)", value: "+156", icon: Clock },
      { label: "Télétravail possible", value: "867", icon: Users2 },
      { label: "Recrutement rapide", value: "423", icon: Zap },
    ];

    return (
      <>
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Métier, compétence, entreprise, ville..."
              className="pl-12 py-7 text-lg rounded-xl border-0 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <div className="absolute right-2 top-2 flex gap-2">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() =>
                  toast.info(
                    "Fonctionnalité de localisation bientôt disponible"
                  )
                }
              >
                <MapPin className="h-4 w-4 mr-2" />
                Localisation
              </Button>
              <Button
                className="bg-[#8B4513] hover:bg-[#6B3410] text-white px-8"
                onClick={handleSearch}
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-[#D3D3D3]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres avancés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Secteurs */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Secteurs d'activité
                  </h3>
                  <div className="space-y-2">
                    {secteurs.map((secteur) => {
                      const SecteurIcon = secteur.icon;
                      return (
                        <div
                          key={secteur.id}
                          className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer"
                          onClick={() => setSelectedSecteur(secteur.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedSecteur === secteur.id}
                              onCheckedChange={() =>
                                setSelectedSecteur(secteur.id)
                              }
                            />
                            <span className="flex items-center gap-2 text-sm">
                              <SecteurIcon className="h-4 w-4" />
                              {secteur.label}
                            </span>
                          </div>
                          <Badge variant="outline">{secteur.count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-[#D3D3D3]" />

                {/* Type de contrat */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Type de contrat
                  </h3>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les contrats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les contrats</SelectItem>
                      {typesContrat.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Options supplémentaires */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgent"
                      checked={onlyUrgent}
                      onCheckedChange={() => setOnlyUrgent(!onlyUrgent)}
                    />
                    <label htmlFor="urgent" className="text-sm cursor-pointer">
                      Offres urgentes seulement
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote"
                      checked={onlyRemote}
                      onCheckedChange={() => setOnlyRemote(!onlyRemote)}
                    />
                    <label htmlFor="remote" className="text-sm cursor-pointer">
                      Télétravail possible
                    </label>
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

            {/* Actions rapides */}
            <Card className="mt-4 border-[#D3D3D3]">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-[#8B4513]">
                  Actions rapides
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F] hover:text-white"
                    onClick={toggleJobAlerts}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {alertSettings.active
                      ? "Désactiver alertes"
                      : "Activer alertes"}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Déposer un CV
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Déposer votre CV</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <p className="text-sm text-gray-600">
                          Déposez votre CV pour être visible par nos recruteurs
                          partenaires
                        </p>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
                            Glissez-déposez votre CV ou
                          </p>
                          <Button
                            variant="outline"
                            onClick={() =>
                              document.getElementById("cv-upload").click()
                            }
                          >
                            Parcourir les fichiers
                          </Button>
                          <input
                            id="cv-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Formats acceptés : PDF, DOC, DOCX (max 5MB)
                          </p>
                        </div>
                        {cvFile && (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{cvFile.name}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setCvFile(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            className="bg-[#556B2F] hover:bg-[#6B8E23]"
                            onClick={() => {
                              if (cvFile) {
                                toast.success("CV déposé avec succès !");
                              } else {
                                toast.error("Veuillez sélectionner un fichier");
                              }
                            }}
                          >
                            Enregistrer
                          </Button>
                        </DialogFooter>
                      </div>
                    </DialogContent>
                  </Dialog>
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

            {/* Tabs et offres */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-5 max-w-lg mb-6">
                <TabsTrigger value="toutes">Toutes</TabsTrigger>
                <TabsTrigger value="urgentes">Urgentes</TabsTrigger>
                <TabsTrigger value="remote">Télétravail</TabsTrigger>
                <TabsTrigger value="recentes">Récentes</TabsTrigger>
                <TabsTrigger value="sauvegardees">
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      savedItems.filter((id) => id.startsWith("emploi-"))
                        .length > 0
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  ({savedItems.filter((id) => id.startsWith("emploi-")).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="border-[#D3D3D3] animate-pulse">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredOffres.length > 0 ? (
                  filteredOffres.map((offre) => {
                    const OffreIcon = offre.icon;
                    const isApplied = appliedItems.includes(
                      `emploi-${offre.id}`
                    );
                    const isSaved = savedItems.includes(`emploi-${offre.id}`);

                    return (
                      <Card
                        key={offre.id}
                        className={`border-[#D3D3D3] hover:shadow-lg transition-shadow duration-300 ${
                          isApplied ? "border-green-500 bg-green-50/30" : ""
                        }`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Logo Entreprise */}
                            <div className="flex-shrink-0">
                              <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[#556B2F] to-[#6B8E23] flex items-center justify-center text-white">
                                <OffreIcon className="h-8 w-8" />
                                {isApplied && (
                                  <div className="absolute -top-1 -right-1">
                                    <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Détails Offre */}
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    {offre.urgent && (
                                      <Badge className="bg-red-100 text-red-800 border-red-200">
                                        <Zap className="h-3 w-3 mr-1" />
                                        Urgent
                                      </Badge>
                                    )}
                                    <Badge
                                      className={
                                        typesContrat.find(
                                          (t) => t.id === offre.type
                                        )?.color
                                      }
                                    >
                                      {
                                        typesContrat.find(
                                          (t) => t.id === offre.type
                                        )?.label
                                      }
                                    </Badge>
                                    {offre.remote && (
                                      <Badge
                                        variant="outline"
                                        className="border-blue-300 text-blue-700"
                                      >
                                        Télétravail
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {offre.title}
                                  </h3>
                                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Building className="h-4 w-4" />
                                    <span className="font-medium">
                                      {offre.entreprise}
                                    </span>
                                    <MapPin className="h-4 w-4 ml-2" />
                                    <span>{offre.location}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-[#8B4513] mb-1">
                                    {offre.salaire}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {offre.date}
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-3 line-clamp-2">
                                {offre.description}
                              </p>

                              <div className="mb-4">
                                <h4 className="font-semibold text-[#556B2F] mb-2">
                                  Compétences recherchées :
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {offre.competences
                                    .slice(0, 4)
                                    .map((comp, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="bg-gray-100"
                                      >
                                        {comp}
                                      </Badge>
                                    ))}
                                  {offre.competences.length > 4 && (
                                    <Badge
                                      variant="outline"
                                      className="text-gray-500"
                                    >
                                      +{offre.competences.length - 4}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex flex-wrap gap-2">
                                  {offre.avantages
                                    .slice(0, 3)
                                    .map((avantage, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="border-green-200 text-green-700 bg-green-50"
                                      >
                                        {avantage}
                                      </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      toggleSavedItem(offre.id, "emploi")
                                    }
                                    className={`border-gray-300 ${
                                      isSaved
                                        ? "text-red-500 border-red-300 bg-red-50"
                                        : ""
                                    }`}
                                  >
                                    <Heart
                                      className={`h-4 w-4 mr-1 ${
                                        isSaved ? "fill-red-500" : ""
                                      }`}
                                    />
                                    {isSaved ? "Sauvegardé" : "Sauvegarder"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300"
                                    onClick={() => handleShare(offre, "emploi")}
                                  >
                                    <Share2 className="h-4 w-4 mr-1" />
                                    Partager
                                  </Button>
                                  <Sheet>
                                    <SheetTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-[#556B2F] text-[#556B2F]"
                                        onClick={() => setSelectedJob(offre)}
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Voir
                                      </Button>
                                    </SheetTrigger>
                                    <SheetContent className="sm:max-w-xl overflow-y-auto">
                                      {selectedJob && (
                                        <>
                                          <SheetHeader>
                                            <SheetTitle>
                                              {selectedJob.title}
                                            </SheetTitle>
                                            <SheetDescription>
                                              {selectedJob.entreprise} •{" "}
                                              {selectedJob.location}
                                            </SheetDescription>
                                          </SheetHeader>
                                          <div className="mt-6 space-y-6">
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Description du poste
                                              </h4>
                                              <p className="text-gray-700">
                                                {selectedJob.description}
                                              </p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Missions principales
                                              </h4>
                                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                                {selectedJob.missions.map(
                                                  (mission, idx) => (
                                                    <li key={idx}>{mission}</li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                            <Button
                                              className="w-full bg-[#8B4513] hover:bg-[#6B3410]"
                                              onClick={() => {
                                                handleApply(
                                                  selectedJob.id,
                                                  "emploi",
                                                  selectedJob.title
                                                );
                                                setSelectedJob(null);
                                              }}
                                            >
                                              Postuler maintenant
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    </SheetContent>
                                  </Sheet>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        className={`${
                                          isApplied
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-[#8B4513] hover:bg-[#6B3410]"
                                        } text-white`}
                                        onClick={() => setSelectedJob(offre)}
                                      >
                                        {isApplied ? "✓ Postulé" : "Postuler"}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Postuler à : {selectedJob?.title}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <form onSubmit={handleSubmitApplication}>
                                        <div className="space-y-4 py-4">
                                          <div>
                                            <Label
                                              htmlFor="motivation"
                                              className="font-semibold mb-2 block"
                                            >
                                              Votre message de motivation :
                                            </Label>
                                            <Textarea
                                              id="motivation"
                                              placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                                              className="min-h-[150px]"
                                              value={motivationLetter}
                                              onChange={(e) =>
                                                setMotivationLetter(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <div>
                                            <Label className="font-semibold mb-2 block">
                                              CV et documents :
                                            </Label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                              <p className="text-gray-600 mb-2">
                                                Glissez-déposez votre CV ou
                                              </p>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                  document
                                                    .getElementById(
                                                      "job-cv-upload"
                                                    )
                                                    .click()
                                                }
                                              >
                                                Parcourir les fichiers
                                              </Button>
                                              <input
                                                id="job-cv-upload"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                              />
                                              <p className="text-xs text-gray-500 mt-2">
                                                Formats acceptés : PDF, DOC,
                                                DOCX (max 5MB)
                                              </p>
                                            </div>
                                            {cvFile && (
                                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mt-2">
                                                <div className="flex items-center gap-2">
                                                  <FileText className="h-4 w-4 text-green-600" />
                                                  <span className="text-sm">
                                                    {cvFile.name}
                                                  </span>
                                                </div>
                                                <Button
                                                  type="button"
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() =>
                                                    setCvFile(null)
                                                  }
                                                >
                                                  <X className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                              setIsApplicationDialogOpen(false)
                                            }
                                          >
                                            Annuler
                                          </Button>
                                          <Button
                                            type="submit"
                                            className="bg-[#556B2F] hover:bg-[#6B8E23]"
                                            onClick={() =>
                                              handleApply(
                                                offre.id,
                                                "emploi",
                                                offre.title
                                              )
                                            }
                                          >
                                            Envoyer la candidature
                                          </Button>
                                        </DialogFooter>
                                      </form>
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
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Aucune offre ne correspond à vos critères
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Essayez d'élargir vos recherches ou créez une alerte
                        pour être informé des nouvelles offres
                      </p>
                      <Button variant="outline" onClick={handleResetFilters}>
                        Voir toutes les offres
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </>
    );
  };

  // SECTION ALTERNANCE/STAGE
  const AlternanceSection = () => {
    const [offres, setOffres] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("tous");
    const [selectedNiveau, setSelectedNiveau] = useState("tous");
    const [selectedDuree, setSelectedDuree] = useState("tous");
    const [activeTab, setActiveTab] = useState("alternance");

    const types = [
      {
        id: "alternance",
        label: "Alternance",
        icon: Zap,
        description: "Contrat pro ou apprentissage",
      },
      {
        id: "stage",
        label: "Stage",
        icon: GraduationCap,
        description: "Stage conventionné",
      },
      {
        id: "apprentissage",
        label: "Apprentissage",
        icon: BookOpen,
        description: "Contrat d'apprentissage",
      },
    ];

    const niveaux = [
      { id: "bac", label: "BAC", color: "bg-blue-100 text-blue-800" },
      { id: "bac+2", label: "BAC+2", color: "bg-green-100 text-green-800" },
      { id: "bac+3", label: "BAC+3/4", color: "bg-yellow-100 text-yellow-800" },
      { id: "bac+5", label: "BAC+5", color: "bg-purple-100 text-purple-800" },
    ];

    const offresList = [
      {
        id: 1,
        title: "Développeur Web Alternance",
        entreprise: "DigitalFuture SA",
        type: "alternance",
        niveau: "bac+3",
        duree: "12+",
        location: "Paris (75)",
        date: "Début Septembre 2024",
        remuneration: "70-85% SMIC",
        description:
          "Alternance en développement web full stack pour un BAC+3/4.",
        missions: [
          "Développement frontend React",
          "API REST avec Node.js",
          "Tests et déploiement",
          "Participation aux réunions d'équipe",
        ],
        competences: [
          "HTML/CSS",
          "JavaScript",
          "React",
          "Git",
          "TypeScript",
          "Node.js",
        ],
        avantages: [
          "Formation financée",
          "Salaire + primes",
          "Ticket resto",
          "Télétravail partiel",
        ],
        icon: Code,
        urgent: true,
        remote: "hybride",
      },
      {
        id: 2,
        title: "Stage Marketing Digital",
        entreprise: "BrandBoost Agency",
        type: "stage",
        niveau: "bac+5",
        duree: "5-6",
        location: "Lyon (69)",
        date: "Mars à Août 2024",
        remuneration: "Gratification légale",
        description:
          "Stage en marketing digital avec gestion de campagnes sociales.",
        missions: [
          "Gestion réseaux sociaux",
          "Analyse de données",
          "Création de contenus",
          "Reporting mensuel",
        ],
        competences: [
          "SEO",
          "Google Analytics",
          "Réseaux sociaux",
          "Copywriting",
          "Canva",
          "Excel",
        ],
        avantages: [
          "Indemnités",
          "Formation interne",
          "Possibilité CDI",
          "Matériel fourni",
        ],
        icon: TrendingUp,
        urgent: false,
        remote: true,
      },
    ];

    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setOffres(offresList);
        setLoading(false);
      }, 1000);
    }, []);

    const filteredOffres = offres.filter((offre) => {
      const matchesSearch =
        offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "tous" || offre.type === selectedType;
      const matchesNiveau =
        selectedNiveau === "tous" || offre.niveau === selectedNiveau;

      const matchesTab =
        (activeTab === "alternance" &&
          (offre.type === "alternance" || offre.type === "apprentissage")) ||
        (activeTab === "stage" && offre.type === "stage") ||
        (activeTab === "sauvegardees" &&
          savedItems.includes(`alternance-${offre.id}`));

      return matchesSearch && matchesType && matchesNiveau && matchesTab;
    });

    const handleSearch = () => {
      if (searchTerm.trim()) {
        toast.info(`Recherche d'alternance/stage pour "${searchTerm}"`);
      }
    };

    const handleResetFilters = () => {
      setSelectedType("tous");
      setSelectedNiveau("tous");
      setSelectedDuree("tous");
      setSearchTerm("");
      setActiveTab("alternance");
      toast.success("Filtres réinitialisés");
    };

    const handleOpenEvents = () => {
      toast.info("Ouverture du calendrier des événements...");
    };

    const statsData = [
      { label: "Offres actives", value: "856", icon: Briefcase },
      { label: "Alternances", value: "312", icon: GraduationCap },
      { label: "Taux d'embauche", value: "78%", icon: Award },
      { label: "Entreprises partenaires", value: "124", icon: Building },
    ];

    return (
      <>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/40 border-white/60 text-[#556B2F]"
            >
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher un stage, une alternance, un métier..."
              className="pl-12 py-7 text-lg rounded-xl border-0 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              className="absolute right-2 top-2 bg-[#8B4513] hover:bg-[#6B3410] text-white px-8"
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
                {/* Type */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">Type</h3>
                  <div className="space-y-3">
                    {types.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <div
                          key={type.id}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedType === type.id
                              ? "bg-[#556B2F]/10 border border-[#556B2F]"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedType(type.id)}
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              selectedType === type.id
                                ? "bg-[#556B2F] text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{type.label}</span>
                              {selectedType === type.id && (
                                <div className="w-2 h-2 rounded-full bg-[#556B2F]"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-[#D3D3D3]" />

                {/* Niveau d'étude */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Niveau d'étude
                  </h3>
                  <div className="space-y-2">
                    {niveaux.map((niveau) => (
                      <div
                        key={niveau.id}
                        className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
                        onClick={() => setSelectedNiveau(niveau.id)}
                      >
                        <Checkbox
                          checked={selectedNiveau === niveau.id}
                          onCheckedChange={() => setSelectedNiveau(niveau.id)}
                        />
                        <Badge className={niveau.color}>{niveau.label}</Badge>
                      </div>
                    ))}
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

            {/* Guide Étudiant */}
            <Card className="mt-4 border-[#556B2F]">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-[#8B4513] flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Guide étudiant
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-[#556B2F]/10"
                    onClick={() => handleDownloadGuide("CV étudiant")}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Rédiger un CV étudiant
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-[#556B2F]/10"
                    onClick={() => handleDownloadGuide("Lettre de motivation")}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Lettre de motivation type
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-[#556B2F]/10"
                    onClick={() => handleDownloadGuide("Préparation entretien")}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Préparer un entretien
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Progress Steps */}
            <Card className="mb-6 border-[#D3D3D3]">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-[#8B4513] mb-2">
                    Votre recherche en 4 étapes
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                          researchProgress >= 25
                            ? "bg-[#556B2F] text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        1
                      </div>
                      <div className="text-xs">Profil</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                          researchProgress >= 50
                            ? "bg-[#6B8E23] text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        2
                      </div>
                      <div className="text-xs">Recherche</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                          researchProgress >= 75
                            ? "bg-[#556B2F] text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        3
                      </div>
                      <div className="text-xs">Candidature</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                          researchProgress >= 100
                            ? "bg-[#6B8E23] text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        4
                      </div>
                      <div className="text-xs">Entretien</div>
                    </div>
                  </div>
                  <Progress value={researchProgress} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-2">
                    Progression : {researchProgress}% complété
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Offres List */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="alternance">Alternances</TabsTrigger>
                <TabsTrigger value="stage">Stages</TabsTrigger>
                <TabsTrigger value="sauvegardees">
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      savedItems.filter((id) => id.startsWith("alternance-"))
                        .length > 0
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  Favoris (
                  {
                    savedItems.filter((id) => id.startsWith("alternance-"))
                      .length
                  }
                  )
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="border-[#D3D3D3] animate-pulse">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredOffres.length > 0 ? (
                  filteredOffres.map((offre) => {
                    const OffreIcon = offre.icon;
                    const isApplied = appliedItems.includes(
                      `alternance-${offre.id}`
                    );
                    const isSaved = savedItems.includes(
                      `alternance-${offre.id}`
                    );

                    return (
                      <Card
                        key={offre.id}
                        className={`border-[#D3D3D3] hover:shadow-lg transition-shadow duration-300 ${
                          isApplied ? "border-green-500 bg-green-50/30" : ""
                        }`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                              <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[#556B2F] to-[#6B8E23] flex items-center justify-center text-white">
                                <OffreIcon className="h-8 w-8" />
                                {isApplied && (
                                  <div className="absolute -top-1 -right-1">
                                    <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Détails */}
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    {offre.urgent && (
                                      <Badge className="bg-red-100 text-red-800 border-red-200">
                                        <Zap className="h-3 w-3 mr-1" />
                                        Urgent
                                      </Badge>
                                    )}
                                    <Badge className="bg-[#556B2F] text-white">
                                      {
                                        types.find((t) => t.id === offre.type)
                                          ?.label
                                      }
                                    </Badge>
                                    <Badge
                                      className={
                                        niveaux.find(
                                          (n) => n.id === offre.niveau
                                        )?.color
                                      }
                                    >
                                      {
                                        niveaux.find(
                                          (n) => n.id === offre.niveau
                                        )?.label
                                      }
                                    </Badge>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {offre.title}
                                  </h3>
                                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Building className="h-4 w-4" />
                                    <span className="font-medium">
                                      {offre.entreprise}
                                    </span>
                                    <MapPin className="h-4 w-4 ml-2" />
                                    <span>{offre.location}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-[#8B4513] mb-1">
                                    {offre.remuneration}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {offre.date}
                                  </p>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-3 line-clamp-2">
                                {offre.description}
                              </p>

                              <div className="mb-4">
                                <h4 className="font-semibold text-[#556B2F] mb-2">
                                  Missions :
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {offre.missions
                                    .slice(0, 3)
                                    .map((mission, idx) => (
                                      <li key={idx}>{mission}</li>
                                    ))}
                                </ul>
                              </div>

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex flex-wrap gap-2">
                                  {offre.competences
                                    .slice(0, 4)
                                    .map((comp, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="bg-gray-100"
                                      >
                                        {comp}
                                      </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      toggleSavedItem(offre.id, "alternance")
                                    }
                                    className={`border-gray-300 ${
                                      isSaved
                                        ? "text-red-500 border-red-300 bg-red-50"
                                        : ""
                                    }`}
                                  >
                                    <Heart
                                      className={`h-4 w-4 mr-1 ${
                                        isSaved ? "fill-red-500" : ""
                                      }`}
                                    />
                                    Favoris
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300"
                                    onClick={() =>
                                      handleShare(offre, "alternance")
                                    }
                                  >
                                    <Share2 className="h-4 w-4 mr-1" />
                                    Partager
                                  </Button>
                                  <Button
                                    size="sm"
                                    className={`${
                                      isApplied
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-[#8B4513] hover:bg-[#6B3410]"
                                    } text-white`}
                                    onClick={() =>
                                      handleApply(
                                        offre.id,
                                        "alternance",
                                        offre.title
                                      )
                                    }
                                  >
                                    {isApplied ? "✓ Postulé" : "Postuler"}
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
                      <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Aucune offre ne correspond à vos critères
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Essayez de modifier vos critères de recherche
                      </p>
                      <Button variant="outline" onClick={handleResetFilters}>
                        Voir toutes les offres
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Resources Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-[#556B2F]">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">
                    Ressources étudiants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleDownloadGuide("Guide alternance")}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Guide de l'alternance</h4>
                        <p className="text-sm text-gray-500">
                          Tout savoir sur les contrats et droits
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleDownloadGuide("Calendrier 2024")}
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Calendrier 2024</h4>
                        <p className="text-sm text-gray-500">
                          Dates clés pour vos recherches
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#6B8E23] bg-gradient-to-br from-[#556B2F]/5 to-[#6B8E23]/5">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">
                    Événements à venir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#556B2F] pl-4 py-2">
                      <div className="text-sm text-gray-500">15 Mars 2024</div>
                      <h4 className="font-medium">Forum Alternance Paris</h4>
                      <p className="text-sm text-gray-600">
                        Rencontrez 50+ entreprises
                      </p>
                    </div>
                    <div className="border-l-4 border-[#6B8E23] pl-4 py-2">
                      <div className="text-sm text-gray-500">22 Mars 2024</div>
                      <h4 className="font-medium">
                        Webinar : CV étudiant parfait
                      </h4>
                      <p className="text-sm text-gray-600">
                        Conseils d'un recruteur
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                    onClick={handleOpenEvents}
                  >
                    Voir tous les événements
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white mt-16">
      {/* Hero Section */}
      <div
        className="relative text-white py-16 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: heroData[activeSection].bgImage }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] opacity-75"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
              {React.createElement(heroData[activeSection].icon, {
                className: "h-10 w-10",
              })}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {heroData[activeSection].title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {heroData[activeSection].description}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs
              value={activeSection}
              onValueChange={setActiveSection}
              className="w-full max-w-4xl"
            >
              <TabsList className="grid grid-cols-3 bg-white/20 backdrop-blur-sm">
                <TabsTrigger
                  value="formations"
                  className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Formations
                </TabsTrigger>
                <TabsTrigger
                  value="emploi"
                  className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Offres d'emploi
                </TabsTrigger>
                <TabsTrigger
                  value="alternance"
                  className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Alternance/Stages
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === "formations" && <FormationsSection />}
        {activeSection === "emploi" && <EmploiSection />}
        {activeSection === "alternance" && <AlternanceSection />}
      </div>

    </div>
  );
};

export default EmploiFormationsPage;
