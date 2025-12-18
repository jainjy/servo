import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  GraduationCap,
  Clock,
  MapPin,
  Building,
  Calendar,
  Target,
  Users,
  BookOpen,
  ChevronRight,
  Heart,
  Share2,
  Code,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Briefcase,
  Hammer,
  Activity,
  Zap,
  Palette,
  Mail,
  Download,
  Upload,
  Eye,
  FileText,
  X,
  CheckCircle,
  ExternalLink,
  Bell,
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
import { Progress } from "@/components/ui/progress";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AlternanceStagePage = () => {
  const navigate = useNavigate();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("tous");
  const [selectedDuree, setSelectedDuree] = useState("tous");
  const [selectedNiveau, setSelectedNiveau] = useState("tous");
  const [savedOffres, setSavedOffres] = useState([]);
  const [appliedOffres, setAppliedOffres] = useState([]);
  const [activeTab, setActiveTab] = useState("alternance");
  const [sortBy, setSortBy] = useState("pertinence");
  const [cvFile, setCvFile] = useState(null);
  const [motivationLetter, setMotivationLetter] = useState("");
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [researchProgress, setResearchProgress] = useState(50);

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
      id: "vdi",
      label: "Ville de l'emploi",
      icon: Building,
      description: "Programme VDI",
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
    { id: "doctorat", label: "Doctorat", color: "bg-red-100 text-red-800" },
  ];

  const durees = [
    { id: "1-2", label: "1-2 mois", icon: Clock },
    { id: "3-4", label: "3-4 mois", icon: Calendar },
    { id: "5-6", label: "5-6 mois", icon: Calendar },
    { id: "12+", label: "12+ mois", icon: Target },
  ];

  const secteurs = [
    { id: "informatique", label: "Informatique", count: 67, icon: Code },
    { id: "marketing", label: "Marketing & Com", count: 45, icon: TrendingUp },
    {
      id: "commerce",
      label: "Commerce & Vente",
      count: 38,
      icon: ShoppingCart,
    },
    { id: "finance", label: "Finance & Audit", count: 29, icon: DollarSign },
    { id: "rh", label: "Ressources Humaines", count: 22, icon: Users },
    { id: "batiment", label: "Bâtiment & TP", count: 31, icon: Hammer },
    { id: "sante", label: "Santé & Social", count: 26, icon: Activity },
    { id: "industrie", label: "Industrie", count: 34, icon: Zap },
  ];

  const offresList = [
    {
      id: 1,
      title: "Développeur Web Alternance",
      entreprise: "DigitalFuture SA",
      type: "alternance",
      niveau: "bac+3",
      duree: "12+",
      secteur: "informatique",
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
      details: {
        prerequisites: "BAC+2 en informatique, connaissance base du web",
        process: [
          "Entretien RH (30min)",
          "Test technique (1h)",
          "Entretien technique (1h)",
          "Rencontre équipe (45min)",
        ],
        companyInfo: {
          size: "80 employés",
          sector: "EdTech",
          website: "https://digitalfuture.com",
          description: "Startup innovante dans l'éducation numérique",
        },
      },
    },
    {
      id: 2,
      title: "Stage Marketing Digital",
      entreprise: "BrandBoost Agency",
      type: "stage",
      niveau: "bac+5",
      duree: "5-6",
      secteur: "marketing",
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
      details: {
        prerequisites: "Master marketing digital, anglais B2",
        process: ["Entretien RH", "Case study", "Entretien manager"],
        companyInfo: {
          size: "45 employés",
          sector: "Marketing digital",
          website: "https://brandboost-agency.com",
          description: "Agence spécialisée dans le marketing digital B2B",
        },
      },
    },
    {
      id: 3,
      title: "Apprenti Chef de Chantier",
      entreprise: "Constructions Durables",
      type: "apprentissage",
      niveau: "bac+2",
      duree: "12+",
      secteur: "batiment",
      location: "Bordeaux (33)",
      date: "Rentrée 2024",
      remuneration: "60-80% SMIC",
      description: "Apprentissage BTS Bâtiment en alternance.",
      missions: [
        "Assistance chef de chantier",
        "Lecture de plans",
        "Suivi fournisseurs",
        "Contrôle qualité",
      ],
      competences: [
        "Autocad",
        "Normes BTP",
        "Organisation",
        "Excel",
        "Sécurité",
      ],
      avantages: [
        "École payée",
        "Équipement fourni",
        "Expérience terrain",
        "Mutuelle",
      ],
      icon: Hammer,
      urgent: true,
      remote: false,
      details: {
        prerequisites: "BAC pro bâtiment, permis B",
        process: [
          "Entretien RH",
          "Test technique",
          "Visite chantier",
          "Rencontre équipe",
        ],
        companyInfo: {
          size: "150 employés",
          sector: "Construction durable",
          website: "https://constructions-durables.com",
          description: "Entreprise spécialisée dans la construction écologique",
        },
      },
    },
    {
      id: 4,
      title: "Stage Audit Financier",
      entreprise: "Global Finance Audit",
      type: "stage",
      niveau: "bac+5",
      duree: "5-6",
      secteur: "finance",
      location: "Nantes (44)",
      date: "Avril à Septembre 2024",
      remuneration: "1 200€/mois",
      description: "Stage en audit financier pour cabinet international.",
      missions: [
        "Analyses financières",
        "Contrôles internes",
        "Reporting",
        "Support aux auditeurs",
      ],
      competences: [
        "Excel avancé",
        "Comptabilité",
        "Anglais courant",
        "Analyse",
        "PowerPoint",
      ],
      avantages: [
        "Prime de fin de stage",
        "Formation certifiante",
        "Réseau",
        "Horaires flexibles",
      ],
      icon: DollarSign,
      urgent: false,
      remote: "hybride",
      details: {
        prerequisites: "Master finance/audit, anglais C1",
        process: [
          "Entretien RH",
          "Test logique",
          "Case study financier",
          "Entretien senior",
        ],
        companyInfo: {
          size: "200 employés",
          sector: "Audit financier",
          website: "https://globalfinance-audit.com",
          description: "Cabinet d'audit international présent dans 20 pays",
        },
      },
    },
    {
      id: 5,
      title: "Alternance Commercial B2B",
      entreprise: "ProSolutions Group",
      type: "alternance",
      niveau: "bac+2",
      duree: "12+",
      secteur: "commerce",
      location: "Marseille (13)",
      date: "Septembre 2024",
      remuneration: "75-90% SMIC + primes",
      description: "Licence pro commerciale en alternance.",
      missions: [
        "Prospection clients",
        "Gestion portefeuille",
        "Préparation offres",
        "Suivi clientèle",
      ],
      competences: [
        "Vente",
        "Négociation",
        "CRM",
        "Relation client",
        "PowerPoint",
      ],
      avantages: [
        "Commission",
        "Voiture",
        "Évolution rapide",
        "Formation continue",
      ],
      icon: Briefcase,
      urgent: true,
      remote: false,
      details: {
        prerequisites: "BAC+2 commerce, permis B, dynamisme",
        process: [
          "Entretien RH",
          "Simulation commerciale",
          "Entretien directeur",
        ],
        companyInfo: {
          size: "120 employés",
          sector: "Services aux entreprises",
          website: "https://prosolutions-group.com",
          description: "Leader régional dans les services B2B",
        },
      },
    },
    {
      id: 6,
      title: "Stage UX/UI Designer",
      entreprise: "DesignInnovation",
      type: "stage",
      niveau: "bac+3",
      duree: "3-4",
      secteur: "informatique",
      location: "Toulouse (31)",
      date: "Juin à Septembre 2024",
      remuneration: "1 000€/mois",
      description: "Stage en design d'interface et expérience utilisateur.",
      missions: [
        "Wireframes et prototypes",
        "Tests utilisateurs",
        "Design system",
        "Collaboration avec devs",
      ],
      competences: [
        "Figma",
        "Adobe Suite",
        "Design thinking",
        "Prototypage",
        "HTML/CSS basique",
      ],
      avantages: [
        "Matériel Apple",
        "Formation Figma",
        "Portfolio projets",
        "Télétravail flexible",
      ],
      icon: Palette,
      urgent: false,
      remote: true,
      details: {
        prerequisites: "Portfolio de projets, connaissance design tools",
        process: [
          "Entretien RH",
          "Présentation portfolio",
          "Test créatif",
          "Rencontre équipe design",
        ],
        companyInfo: {
          size: "60 employés",
          sector: "Design & Tech",
          website: "https://designinnovation.com",
          description: "Studio de design spécialisé dans l'innovation digitale",
        },
      },
    },
  ];

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => {
      setOffres(offresList);
      setLoading(false);
    }, 1000);
  }, []);

  // Gestion du tri
  const sortOffres = (offresList, sortMethod) => {
    const sorted = [...offresList];
    switch (sortMethod) {
      case "date-croissant":
        return sorted.sort((a, b) => {
          // Logique simplifiée de tri par date
          return a.id - b.id;
        });
      case "remuneration-croissant":
        return sorted.sort((a, b) => {
          const remA = parseInt(a.remuneration.split("-")[0]) || 0;
          const remB = parseInt(b.remuneration.split("-")[0]) || 0;
          return remA - remB;
        });
      case "remuneration-dec":
        return sorted.sort((a, b) => {
          const remA = parseInt(a.remuneration.split("-")[0]) || 0;
          const remB = parseInt(b.remuneration.split("-")[0]) || 0;
          return remB - remA;
        });
      default:
        return sorted;
    }
  };

  // Filtrage des offres
  const filteredOffres = sortOffres(
    offres.filter((offre) => {
      const matchesSearch =
        offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.entreprise.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "tous" || offre.type === selectedType;
      const matchesNiveau =
        selectedNiveau === "tous" || offre.niveau === selectedNiveau;
      const matchesDuree =
        selectedDuree === "tous" || offre.duree === selectedDuree;

      // Filtres par onglet
      const matchesTab =
        (activeTab === "alternance" &&
          (offre.type === "alternance" || offre.type === "apprentissage")) ||
        (activeTab === "stage" && offre.type === "stage") ||
        (activeTab === "sauvegardees" && savedOffres.includes(offre.id));

      return (
        matchesSearch &&
        matchesType &&
        matchesNiveau &&
        matchesDuree &&
        matchesTab
      );
    }),
    sortBy
  );

  // Gestion des favoris
  const toggleSavedOffre = (offreId) => {
    if (savedOffres.includes(offreId)) {
      setSavedOffres(savedOffres.filter((id) => id !== offreId));
      toast.success("Offre retirée des favoris");
    } else {
      setSavedOffres([...savedOffres, offreId]);
      toast.success("Offre ajoutée aux favoris");
    }
  };

  // Postuler à une offre
  const handleApply = (offre) => {
    setSelectedOffre(offre);
    if (!appliedOffres.includes(offre.id)) {
      setAppliedOffres([...appliedOffres, offre.id]);
      setResearchProgress(Math.min(researchProgress + 25, 100));
      toast.success(`Candidature envoyée pour ${offre.title}`);
    } else {
      toast.info("Vous avez déjà postulé à cette offre");
    }
  };

  // Soumission de candidature
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
    setSelectedOffre(null);
  };

  // Gestion upload CV
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

  // Recherche avec entrée
  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      toast.info(`Recherche de "${searchTerm}" en cours...`);
    }
  };

  // Partager une offre
  const handleShare = (offre) => {
    if (navigator.share) {
      navigator.share({
        title: offre.title,
        text: `Découvrez cette offre d'alternance/stage chez ${offre.entreprise}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `${offre.title} - ${offre.entreprise} - ${window.location.href}`
      );
      toast.success("Lien copié dans le presse-papier");
    }
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedType("tous");
    setSelectedNiveau("tous");
    setSelectedDuree("tous");
    setSearchTerm("");
    toast.success("Filtres réinitialisés");
  };

  // Télécharger guide
  const handleDownloadGuide = (guideType) => {
    toast.info(`Téléchargement du guide ${guideType}...`);
    setTimeout(() => {
      toast.success("Guide téléchargé avec succès");
    }, 1500);
  };

  // Déposer CV
  const handleUploadCV = () => {
    document.getElementById("alternance-cv-upload").click();
  };

  // Voir détails d'une offre
  const handleViewDetails = (offre) => {
    setSelectedOffre(offre);
    setShowDetails(true);
  };

  // Ouvrir rencontres écoles
  const handleOpenEvents = () => {
    toast.info("Ouverture du calendrier des événements...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white mt-16">
      {/* Hero Section */}
      <div
        className="relative text-white py-16 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/stage.jpg')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] opacity-75"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Alternance & Stages
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Lancez votre carrière avec une expérience professionnelle concrète
              • +850 offres pour étudiants
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">856</div>
                <div className="text-sm opacity-90">Offres actives</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">312</div>
                <div className="text-sm opacity-90">Alternances</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">78%</div>
                <div className="text-sm opacity-90">Taux d'embauche</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">124</div>
                <div className="text-sm opacity-90">
                  Entreprises partenaires
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher un stage, une alternance, un métier..."
                className="pl-12 py-7 text-lg rounded-xl border-0 shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
              />
              <Button
                className="absolute right-2 top-2 bg-[#8B4513] hover:bg-[#6B3410] text-white px-8"
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

                {/* Durée */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">Durée</h3>
                  <Select
                    value={selectedDuree}
                    onValueChange={setSelectedDuree}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes durées" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes durées</SelectItem>
                      {durees.map((duree) => {
                        const DureeIcon = duree.icon;
                        return (
                          <SelectItem key={duree.id} value={duree.id}>
                            <span className="flex items-center gap-2">
                              <DureeIcon className="h-4 w-4" />
                              {duree.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secteurs */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Secteurs
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {secteurs.map((secteur) => {
                      const SecteurIcon = secteur.icon;
                      return (
                        <div
                          key={secteur.id}
                          className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <SecteurIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{secteur.label}</span>
                          </div>
                          <Badge variant="outline">{secteur.count}</Badge>
                        </div>
                      );
                    })}
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
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-[#556B2F]/10"
                    onClick={() => handleDownloadGuide("Droits et indemnités")}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Droits et indemnités
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tri rapide */}
            <Card className="mt-4 border-[#D3D3D3]">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-[#8B4513]">Trier par</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pertinence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pertinence">Pertinence</SelectItem>
                    <SelectItem value="date-croissant">
                      Date de début
                    </SelectItem>
                    <SelectItem value="remuneration-croissant">
                      Rémunération croissante
                    </SelectItem>
                    <SelectItem value="remuneration-dec">
                      Rémunération décroissante
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#556B2F] hover:bg-[#6B8E23] text-white">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Déposer un CV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Déposer votre CV étudiant</DialogTitle>
                    <DialogDescription>
                      Partagez votre CV avec nos entreprises partenaires
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Glissez-déposez votre CV ou
                      </p>
                      <Button variant="outline" onClick={handleUploadCV}>
                        Parcourir les fichiers
                      </Button>
                      <input
                        id="alternance-cv-upload"
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
                        Enregistrer mon CV
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                onClick={() => handleDownloadGuide("Guide complet")}
              >
                <Target className="h-4 w-4 mr-2" />
                Conseils recherche
              </Button>
              <Button
                variant="outline"
                className="border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F] hover:text-white"
                onClick={handleOpenEvents}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendrier stages
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Rencontres écoles
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rencontres écoles & entreprises</DialogTitle>
                    <DialogDescription>
                      Prochaines dates de forums et rencontres
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="border-l-4 border-[#556B2F] pl-4 py-2">
                      <div className="text-sm text-gray-500">15 Mars 2024</div>
                      <h4 className="font-medium">Forum Alternance Paris</h4>
                      <p className="text-sm text-gray-600">
                        Rencontrez 50+ entreprises au Carreau du Temple
                      </p>
                    </div>
                    <div className="border-l-4 border-[#6B8E23] pl-4 py-2">
                      <div className="text-sm text-gray-500">22 Mars 2024</div>
                      <h4 className="font-medium">
                        Webinar : CV étudiant parfait
                      </h4>
                      <p className="text-sm text-gray-600">
                        Conseils d'un recruteur - En ligne
                      </p>
                    </div>
                    <Button className="w-full bg-[#556B2F] hover:bg-[#6B8E23]">
                      Voir tous les événements
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

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
                      savedOffres.length > 0 ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  Favoris ({savedOffres.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {/* Stats résultats */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    {filteredOffres.length} offre
                    {filteredOffres.length > 1 ? "s" : ""} trouvée
                    {filteredOffres.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Mise à jour quotidienne
                    </span>
                  </div>
                </div>

                {loading ? (
                  // Squelette de chargement
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
                    return (
                      <Card
                        key={offre.id}
                        className={`border-[#D3D3D3] hover:shadow-lg transition-shadow duration-300 ${
                          appliedOffres.includes(offre.id)
                            ? "border-green-500 bg-green-50/30"
                            : ""
                        }`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                              <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[#556B2F] to-[#6B8E23] flex items-center justify-center text-white">
                                <OffreIcon className="h-8 w-8" />
                                {appliedOffres.includes(offre.id) && (
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
                                  <h3
                                    className="text-xl font-bold text-gray-900 mb-1 hover:text-[#556B2F] cursor-pointer"
                                    onClick={() => handleViewDetails(offre)}
                                  >
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
                                  {offre.competences.length > 4 && (
                                    <Badge
                                      variant="outline"
                                      className="text-gray-500"
                                    >
                                      +{offre.competences.length - 4}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleSavedOffre(offre.id)}
                                    className={`border-gray-300 ${
                                      savedOffres.includes(offre.id)
                                        ? "text-red-500 border-red-300 bg-red-50"
                                        : ""
                                    }`}
                                  >
                                    <Heart
                                      className={`h-4 w-4 mr-1 ${
                                        savedOffres.includes(offre.id)
                                          ? "fill-red-500"
                                          : ""
                                      }`}
                                    />
                                    Favoris
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300"
                                    onClick={() => handleShare(offre)}
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
                                        onClick={() => setSelectedOffre(offre)}
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Détails
                                      </Button>
                                    </SheetTrigger>
                                    <SheetContent className="sm:max-w-xl overflow-y-auto">
                                      {selectedOffre && (
                                        <>
                                          <SheetHeader>
                                            <SheetTitle>
                                              {selectedOffre.title}
                                            </SheetTitle>
                                            <SheetDescription>
                                              {selectedOffre.entreprise} •{" "}
                                              {selectedOffre.location}
                                            </SheetDescription>
                                          </SheetHeader>
                                          <div className="mt-6 space-y-6">
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Description
                                              </h4>
                                              <p className="text-gray-700">
                                                {selectedOffre.description}
                                              </p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Missions détaillées
                                              </h4>
                                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                                {selectedOffre.missions.map(
                                                  (mission, idx) => (
                                                    <li key={idx}>{mission}</li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                À propos de l'entreprise
                                              </h4>
                                              <div className="text-sm text-gray-600 space-y-1">
                                                <p>
                                                  Secteur :{" "}
                                                  {
                                                    selectedOffre.details
                                                      .companyInfo.sector
                                                  }
                                                </p>
                                                <p>
                                                  Taille :{" "}
                                                  {
                                                    selectedOffre.details
                                                      .companyInfo.size
                                                  }
                                                </p>
                                                <p>
                                                  {
                                                    selectedOffre.details
                                                      .companyInfo.description
                                                  }
                                                </p>
                                                <a
                                                  href={
                                                    selectedOffre.details
                                                      .companyInfo.website
                                                  }
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-[#556B2F] hover:underline inline-flex items-center gap-1"
                                                >
                                                  Visiter le site
                                                  <ExternalLink className="h-3 w-3" />
                                                </a>
                                              </div>
                                            </div>
                                            <Button
                                              className="w-full bg-[#8B4513] hover:bg-[#6B3410]"
                                              onClick={() =>
                                                handleApply(selectedOffre)
                                              }
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
                                          appliedOffres.includes(offre.id)
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-[#8B4513] hover:bg-[#6B3410]"
                                        } text-white`}
                                        onClick={() => setSelectedOffre(offre)}
                                      >
                                        {appliedOffres.includes(offre.id)
                                          ? "✓ Postulé"
                                          : "Postuler"}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Postuler à : {selectedOffre?.title}
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
                                                      "alternance-application-cv"
                                                    )
                                                    .click()
                                                }
                                              >
                                                Parcourir les fichiers
                                              </Button>
                                              <input
                                                id="alternance-application-cv"
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
                                              setSelectedOffre(null)
                                            }
                                          >
                                            Annuler
                                          </Button>
                                          <Button
                                            type="submit"
                                            className="bg-[#556B2F] hover:bg-[#6B8E23]"
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
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        toast.info("Simulateur d'entretien bientôt disponible")
                      }
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Simulateur d'entretien</h4>
                        <p className="text-sm text-gray-500">
                          Préparez-vous en conditions réelles
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
                    <div className="border-l-4 border-[#8B4513] pl-4 py-2">
                      <div className="text-sm text-gray-500">5 Avril 2024</div>
                      <h4 className="font-medium">Speed-recruiting Tech</h4>
                      <p className="text-sm text-gray-600">
                        Entretiens express avec startups
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

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-[#556B2F] to-[#6B8E23] text-white">
              <CardContent className="pt-8 pb-8 text-center">
                <GraduationCap className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  Besoin d'aide pour votre recherche ?
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Nos conseillers dédiés aux étudiants vous accompagnent
                  gratuitement dans votre recherche d'alternance ou de stage.
                  Aide au CV, préparation entretien, mise en relation avec les
                  entreprises.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-white text-[#556B2F] hover:bg-gray-100 px-8"
                    onClick={() =>
                      toast.info("Service de conseil bientôt disponible")
                    }
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Prendre rendez-vous
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => handleDownloadGuide("Kit étudiant complet")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le kit étudiant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternanceStagePage;
