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
import { useNavigate } from "react-router-dom";

const FormationsPage = () => {
  const navigate = useNavigate();
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [selectedFormat, setSelectedFormat] = useState("tous");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedOrganismes, setSelectedOrganismes] = useState([]);
  const [sortBy, setSortBy] = useState("pertinence");
  const [activeTab, setActiveTab] = useState("toutes");
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    formationId: null,
  });
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [savedFormations, setSavedFormations] = useState([]);

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

  const organismes = [
    { id: "afpa", name: "AFPA", rating: 4.5 },
    { id: "cnam", name: "CNAM", rating: 4.7 },
    { id: "greta", name: "GRETA", rating: 4.3 },
    { id: "openclassrooms", name: "OpenClassrooms", rating: 4.6 },
    { id: "coursera", name: "Coursera", rating: 4.8 },
    { id: "udemy", name: "Udemy", rating: 4.4 },
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
      details: {
        prerequisites: "Expérience en gestion de projet recommandée",
        program: [
          "Fondamentaux Agile",
          "Scrum Master",
          "Kanban",
          "Gestion d'équipe",
          "Outils de suivi",
        ],
        methodology: "Ateliers pratiques, simulations, études de cas",
        financingOptions: ["CPF", "Entreprise", "OPCO"],
      },
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
      details: {
        prerequisites: "Niveau 3ème, aptitude manuelle",
        program: [
          "Électricité générale",
          "Installations domestiques",
          "Normes et sécurité",
          "Diagnostic et dépannage",
          "Réglementation",
        ],
        methodology: "Atelier pratique, stages en entreprise, cours théoriques",
        financingOptions: ["Pôle Emploi", "Région", "Entreprise"],
      },
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
      features: ["Certification Google", "Accès à vie", "Réseau professionnel"],
      startDate: "Démarrage immédiat",
      financed: false,
      certified: true,
      details: {
        prerequisites: "Aucun prérequis, débutants acceptés",
        program: [
          "SEO avancé",
          "Publicité en ligne",
          "Analytics",
          "Content Marketing",
          "Stratégie digitale",
        ],
        methodology: "Vidéo cours, quiz, projets pratiques, certification",
        financingOptions: ["Personnel", "CPF"],
      },
    },
    {
      id: 5,
      title: "BTS Comptabilité Gestion",
      organisme: "GRETA",
      category: "comptabilite",
      format: "alternance",
      duration: "24 mois",
      participants: "20 places",
      price: 0,
      rating: 4.5,
      reviews: 67,
      location: "Marseille",
      certification: "Diplôme d'État",
      description:
        "Formation en alternance avec contrat de professionnalisation",
      features: [
        "Salaire mensuel",
        "Expérience professionnelle",
        "Diplôme reconnu",
      ],
      startDate: "01/09/2024",
      financed: true,
      certified: true,
      details: {
        prerequisites: "BAC ou équivalent",
        program: [
          "Comptabilité générale",
          "Fiscalité",
          "Gestion financière",
          "Droit des sociétés",
          "Management",
        ],
        methodology: "Alternance école/entreprise, projets concrets",
        financingOptions: ["Contrat d'alternance", "Entreprise"],
      },
    },
    {
      id: 6,
      title: "Naturopathie Fondamentale",
      organisme: "École Européenne",
      category: "sante",
      format: "hybride",
      duration: "8 mois",
      participants: "12 places",
      price: 3200,
      rating: 4.8,
      reviews: 45,
      location: "Toulouse + Online",
      certification: "Certificat professionnel",
      description: "Découvrez les bases de la naturopathie et du bien-être",
      features: [
        "Pratiques en clinique",
        "Stage d'observation",
        "Suivi nutritionnel",
      ],
      startDate: "05/03/2024",
      financed: true,
      certified: true,
      details: {
        prerequisites: "Intérêt pour la santé naturelle",
        program: [
          "Anatomie & physiologie",
          "Nutrition naturelle",
          "Phytothérapie",
          "Techniques de relaxation",
          "Éthique professionnelle",
        ],
        methodology: "Cours en présentiel, pratique clinique, e-learning",
        financingOptions: ["CPF", "Personnel", "Échelonnement"],
      },
    },
  ];

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => {
      setFormations(formationsList);
      setLoading(false);
    }, 1000);
  }, []);

  // Fonction pour trier les formations
  const sortFormations = (formationsList, sortMethod) => {
    const sorted = [...formationsList];
    switch (sortMethod) {
      case "prix-croissant":
        return sorted.sort((a, b) => a.price - b.price);
      case "prix-dec":
        return sorted.sort((a, b) => b.price - a.price);
      case "note":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "date":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.startDate.split("/").reverse().join("-"));
          const dateB = new Date(b.startDate.split("/").reverse().join("-"));
          return dateA - dateB;
        });
      default:
        return sorted;
    }
  };

  // Filtrage des formations
  const filteredFormations = sortFormations(
    formations.filter((formation) => {
      const matchesSearch =
        formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formation.organisme.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "tous" || formation.category === selectedCategory;

      const matchesFormat =
        selectedFormat === "tous" || formation.format === selectedFormat;

      const matchesPrice =
        formation.price >= priceRange[0] && formation.price <= priceRange[1];

      const matchesOrganisme =
        selectedOrganismes.length === 0 ||
        selectedOrganismes.includes(formation.organisme);

      // Filtres par onglet
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
        matchesOrganisme &&
        matchesTab
      );
    }),
    sortBy
  );

  // Gestion des favoris
  const toggleSavedFormation = (formationId) => {
    if (savedFormations.includes(formationId)) {
      setSavedFormations(savedFormations.filter((id) => id !== formationId));
      toast.success("Formation retirée des favoris");
    } else {
      setSavedFormations([...savedFormations, formationId]);
      toast.success("Formation ajoutée aux favoris");
    }
  };

  // Soumission de la demande de contact
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Simulation d'envoi
    toast.success(
      "Votre demande a été envoyée ! Un conseiller vous contactera sous 24h."
    );
    setContactForm({
      name: "",
      email: "",
      phone: "",
      message: "",
      formationId: null,
    });
    setIsContactDialogOpen(false);
  };

  // Téléchargement du catalogue
  const handleDownloadCatalog = () => {
    toast.info("Téléchargement du catalogue en cours...");
    // Simulation de téléchargement
    setTimeout(() => {
      toast.success("Catalogue téléchargé avec succès !");
    }, 1500);
  };


  // Recherche avec entrée
  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      toast.info(`Recherche de "${searchTerm}" en cours...`);
    }
  };

  // Ouverture des détails d'une formation
  const handleViewDetails = (formation) => {
    setSelectedFormation(formation);
    toast.info(`Ouverture des détails pour ${formation.title}`);
  };

  // Postuler à une formation
  const handleApply = (formation) => {
    setSelectedFormation(formation);
    setIsContactDialogOpen(true);
    toast.info(`Préparation de la candidature pour ${formation.title}`);
  };

  // Gestion du tri
  const handleSortChange = (value) => {
    setSortBy(value);
    toast.info(`Tri modifié : ${getSortLabel(value)}`);
  };

  const getSortLabel = (value) => {
    const labels = {
      pertinence: "Pertinence",
      "prix-croissant": "Prix croissant",
      "prix-dec": "Prix décroissant",
      note: "Meilleures notes",
      date: "Date de début",
    };
    return labels[value] || value;
  };

  // Réinitialisation des filtres
  const handleResetFilters = () => {
    setSelectedCategory("tous");
    setSelectedFormat("tous");
    setSelectedOrganismes([]);
    setPriceRange([0, 5000]);
    setSearchTerm("");
    setSortBy("pertinence");
    toast.success("Filtres réinitialisés");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white mt-16">
      {/* Hero Section */}
      <div
        className="relative text-white py-16 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/formation.jpg')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] opacity-75"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Formations & Développement Professionnel
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Trouvez la formation qui correspond à vos ambitions parmi +500
              programmes certifiants
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher une formation, un organisme, une compétence..."
                className="pl-12 py-7 text-lg rounded-xl border-0 shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
              />
              <Button
                className="absolute right-2 top-2 bg-[#8B4513] hover:bg-[#6B3410] text-white px-6"
                onClick={handleSearch}
              >
                Rechercher
              </Button>
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

                {/* Organismes */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Organismes
                  </h3>
                  <div className="space-y-2">
                    {organismes.map((org) => (
                      <div
                        key={org.id}
                        className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer"
                        onClick={() => {
                          const isSelected = selectedOrganismes.includes(
                            org.name
                          );
                          if (isSelected) {
                            setSelectedOrganismes(
                              selectedOrganismes.filter((o) => o !== org.name)
                            );
                          } else {
                            setSelectedOrganismes([
                              ...selectedOrganismes,
                              org.name,
                            ]);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedOrganismes.includes(org.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedOrganismes([
                                  ...selectedOrganismes,
                                  org.name,
                                ]);
                              } else {
                                setSelectedOrganismes(
                                  selectedOrganismes.filter(
                                    (o) => o !== org.name
                                  )
                                );
                              }
                            }}
                          />
                          <span className="text-sm">{org.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{org.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-[#D3D3D3] hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Formations disponibles
                      </p>
                      <p className="text-2xl font-bold text-[#556B2F]">527</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-[#6B8E23]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#D3D3D3] hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Organismes partenaires
                      </p>
                      <p className="text-2xl font-bold text-[#556B2F]">86</p>
                    </div>
                    <Users className="h-8 w-8 text-[#6B8E23]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#D3D3D3] hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Certifications reconnues
                      </p>
                      <p className="text-2xl font-bold text-[#556B2F]">312</p>
                    </div>
                    <Award className="h-8 w-8 text-[#6B8E23]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#D3D3D3] hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Taux de réussite</p>
                      <p className="text-2xl font-bold text-[#556B2F]">94%</p>
                    </div>
                    <Star className="h-8 w-8 text-[#6B8E23]" />
                  </div>
                </CardContent>
              </Card>
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
                    <Select value={sortBy} onValueChange={handleSortChange}>
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
                        <SelectItem value="date">Date de début</SelectItem>
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
                                    toggleSavedFormation(formation.id)
                                  }
                                >
                                  <Star
                                    className={`h-4 w-4 ${
                                      savedFormations.includes(formation.id)
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
                                      {formation.financed && (
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                          Financement
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
                                            handleViewDetails(formation)
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
                                          <div>
                                            <h4 className="font-semibold text-[#8B4513] mb-2">
                                              Programme
                                            </h4>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                              {formation.details?.program?.map(
                                                (item, idx) => (
                                                  <li key={idx}>{item}</li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold text-[#8B4513] mb-2">
                                              Méthodologie
                                            </h4>
                                            <p className="text-gray-700">
                                              {formation.details?.methodology}
                                            </p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold text-[#8B4513] mb-2">
                                              Financements possibles
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                              {formation.details?.financingOptions?.map(
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
                                        </div>
                                      </SheetContent>
                                    </Sheet>
                                    <Button
                                      className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
                                      onClick={() => handleApply(formation)}
                                    >
                                      Postuler
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

            {/* CTA Section */}
            <Card className="border-[#556B2F] bg-gradient-to-r from-[#556B2F]/10 to-[#6B8E23]/10">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                    Besoin d'un conseil personnalisé ?
                  </h3>
                  <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    Nos conseillers en formation vous accompagnent gratuitement
                    pour trouver le programme qui correspond à votre projet
                    professionnel et vos contraintes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
      
                    <Button
                      variant="outline"
                      className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                      onClick={() => setIsContactDialogOpen(true)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Nous contacter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      setContactForm({ ...contactForm, email: e.target.value })
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
                    setContactForm({ ...contactForm, message: e.target.value })
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
              <Button type="submit" className="bg-[#556B2F] hover:bg-[#6B8E23]">
                Envoyer la demande
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormationsPage;
