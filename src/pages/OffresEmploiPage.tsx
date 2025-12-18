import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  ChevronRight,
  Star,
  Building,
  Heart,
  Share2,
  Bell,
  Code,
  Hammer,
  TrendingUp,
  Activity,
  BookOpen,
  Zap,
  Target,
  AlertCircle,
  Mail,
  Download,
  Calendar,
  Upload,
  Eye,
  X,
  CheckCircle,
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

const OffresEmploiPage = () => {
  const navigate = useNavigate();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSecteur, setSelectedSecteur] = useState("tous");
  const [selectedType, setSelectedType] = useState("tous");
  const [selectedExperience, setSelectedExperience] = useState("tous");
  const [salaryRange, setSalaryRange] = useState([30000, 80000]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [activeTab, setActiveTab] = useState("toutes");
  const [sortBy, setSortBy] = useState("pertinence");
  const [cvFile, setCvFile] = useState(null);
  const [motivationLetter, setMotivationLetter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    active: false,
    keywords: "",
    frequency: "quotidien",
  });

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
    { id: "commerce", label: "Commerce & Vente", count: 142, icon: TrendingUp },
    { id: "sante", label: "Santé & Social", count: 78, icon: Activity },
    {
      id: "finance",
      label: "Finance & Assurance",
      count: 67,
      icon: DollarSign,
    },
    { id: "industrie", label: "Industrie & Production", count: 54, icon: Zap },
    {
      id: "hotellerie",
      label: "Hôtellerie & Restauration",
      count: 45,
      icon: Briefcase,
    },
    {
      id: "education",
      label: "Éducation & Formation",
      count: 32,
      icon: BookOpen,
    },
  ];

  const typesContrat = [
    { id: "cdi", label: "CDI", color: "bg-green-100 text-green-800" },
    { id: "cdd", label: "CDD", color: "bg-blue-100 text-blue-800" },
    { id: "interim", label: "Intérim", color: "bg-purple-100 text-purple-800" },
    {
      id: "freelance",
      label: "Freelance",
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: "alternance",
      label: "Alternance",
      color: "bg-indigo-100 text-indigo-800",
    },
  ];

  const niveauxExperience = [
    { id: "junior", label: "Junior (0-2 ans)", icon: Star },
    { id: "intermediaire", label: "Intermédiaire (2-5 ans)", icon: Zap },
    { id: "senior", label: "Senior (5-10 ans)", icon: Target },
    { id: "expert", label: "Expert (+10 ans)", icon: AlertCircle },
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
      competences: ["React", "TypeScript", "Redux", "CSS/SASS", "Jest", "Git"],
      avantages: [
        "Télétravail flexible",
        "Mutuelle premium",
        "Équipement fourni",
        "Prime annuelle",
        "Formations payées",
      ],
      prerequisites: [
        "3+ ans d'expérience en développement Frontend",
        "Maîtrise de React et TypeScript",
        "Connaissance des bonnes pratiques",
        "Anglais technique",
      ],
      process: [
        "Entretien RH (30min)",
        "Test technique (2h)",
        "Entretien technique (1h30)",
        "Rencontre équipe (1h)",
      ],
      icon: Code,
      companyInfo: {
        size: "150 employés",
        sector: "SaaS",
        website: "https://techvision.com",
        description: "Startup en croissance dans l'édtech",
      },
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
        "Gestion budgétaire",
      ],
      competences: [
        "Gestion de chantier",
        "Normes BTP",
        "Autocad",
        "Management",
        "Sécurité",
        "Planification",
      ],
      avantages: [
        "Véhicule de fonction",
        "Prime résultat",
        "Formation continue",
        "Mutuelle famille",
        "Tickets restaurant",
      ],
      prerequisites: [
        "BAC+2 minimum",
        "5+ ans d'expérience",
        "Permis B",
        "Certification sécurité",
      ],
      process: [
        "Entretien RH",
        "Étude de cas",
        "Visite chantier",
        "Rencontre direction",
      ],
      icon: Hammer,
      companyInfo: {
        size: "300 employés",
        sector: "Construction",
        website: "https://batimentsmodernes.com",
        description: "Leader régional de la construction",
      },
    },
    {
      id: 3,
      title: "Commercial B2B",
      entreprise: "ProServices Group",
      secteur: "commerce",
      type: "cdd",
      experience: "junior",
      location: "Marseille (13)",
      salaire: "35-42K€ + variables",
      date: "Publiée il y a 1 jour",
      urgent: false,
      remote: "hybride",
      description:
        "Prospection et développement du portefeuille clients entreprises.",
      missions: [
        "Prospection téléphonique et physique",
        "Animation de réunions commerciales",
        "Suivi du cycle de vente",
        "Reporting commercial",
      ],
      competences: ["Vente B2B", "Prospection", "CRM", "Négociation", "Excel"],
      avantages: [
        "Commission attractive",
        "Télétravail partiel",
        "Évolutions rapides",
        "Téléphone portable",
        "Forfait déplacement",
      ],
      prerequisites: [
        "BAC+2 commerce",
        "Permis B",
        "Goût du challenge",
        "Résultats orientés",
      ],
      process: ["Entretien RH", "Simulation commerciale", "Entretien manager"],
      icon: TrendingUp,
      companyInfo: {
        size: "80 employés",
        sector: "Services aux entreprises",
        website: "https://proservices-group.com",
        description: "Croissance de 30% par an",
      },
    },
    {
      id: 4,
      title: "Infirmier(ère) Coordinateur",
      entreprise: "Santé Plus Clinique",
      secteur: "sante",
      type: "cdi",
      experience: "intermediaire",
      location: "Toulouse (31)",
      salaire: "38-45K€",
      date: "Publiée il y a 3 jours",
      urgent: true,
      remote: false,
      description:
        "Coordination des soins et encadrement d'équipe en service de chirurgie.",
      missions: [
        "Organisation des plannings de soins",
        "Encadrement des aides-soignants",
        "Gestion du matériel médical",
        "Relation avec les médecins",
      ],
      competences: [
        "IDE",
        "Coordination",
        "Gestion d'équipe",
        "Urgences",
        "Hygiène",
      ],
      avantages: [
        "Horaires fixes",
        "CPC",
        "Restaurant d'entreprise",
        "Formation continue",
        "Parking gratuit",
      ],
      prerequisites: [
        "Diplôme d'État IDE",
        "3 ans d'expérience minimum",
        "Expérience en chirurgie",
        "Capacité d'encadrement",
      ],
      process: [
        "Entretien RH",
        "Rencontre équipe médicale",
        "Visite du service",
      ],
      icon: Activity,
      companyInfo: {
        size: "200 employés",
        sector: "Santé privée",
        website: "https://santeplus-clinique.com",
        description: "Clinique privée de référence",
      },
    },
    {
      id: 5,
      title: "Analyste Financier",
      entreprise: "Capital Finance",
      secteur: "finance",
      type: "cdi",
      experience: "senior",
      location: "Nantes (44)",
      salaire: "55-75K€",
      date: "Publiée il y a 1 semaine",
      urgent: false,
      remote: "hybride",
      description:
        "Analyse financière et due diligence pour opérations de M&A.",
      missions: [
        "Modélisation financière",
        "Due diligence",
        "Préparation de rapports d'analyse",
        "Support aux négociations",
      ],
      competences: [
        "Excel avancé",
        "Modélisation financière",
        "M&A",
        "Anglais courant",
        "Bloomberg",
      ],
      avantages: [
        "Bonus annuel",
        "Intéressement",
        "Télétravail 3j/semaine",
        "Mutuelle premium",
        "Abonnement transport",
      ],
      prerequisites: [
        "Master finance",
        "5+ ans d'expérience",
        "Anglais courant",
        "Expérience M&A",
      ],
      process: [
        "Entretien RH",
        "Case study financier",
        "Entretien technique",
        "Rencontre partenaires",
      ],
      icon: DollarSign,
      companyInfo: {
        size: "120 employés",
        sector: "Finance d'entreprise",
        website: "https://capital-finance.com",
        description: "Cabinet conseil en fusion-acquisition",
      },
    },
    {
      id: 6,
      title: "Responsable Qualité",
      entreprise: "Industrie Propre",
      secteur: "industrie",
      type: "cdi",
      experience: "expert",
      location: "Strasbourg (67)",
      salaire: "60-80K€",
      date: "Publiée il y a 2 jours",
      urgent: false,
      remote: false,
      description: "Mise en place et pilotage du système qualité ISO 9001.",
      missions: [
        "Audits internes et fournisseurs",
        "Formation des équipes aux procédures",
        "Amélioration continue des processus",
        "Reporting direction",
      ],
      competences: ["ISO 9001", "Audits", "AMDEC", "Management", "Excel"],
      avantages: [
        "Voiture de fonction",
        "Tickets resto",
        "Participation",
        "Formations certifiantes",
        "Forfait mobilité",
      ],
      prerequisites: [
        "BAC+5 qualité",
        "10+ ans d'expérience",
        "Certification auditeur",
        "Expérience industrie",
      ],
      process: [
        "Entretien RH",
        "Présentation projet",
        "Entretien direction",
        "Visite site",
      ],
      icon: Zap,
      companyInfo: {
        size: "500 employés",
        sector: "Industrie manufacturière",
        website: "https://industrie-propre.com",
        description: "Leader dans l'industrie durable",
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
      case "salaire-croissant":
        return sorted.sort((a, b) => {
          const salaireA = parseInt(a.salaire.split("-")[0]);
          const salaireB = parseInt(b.salaire.split("-")[0]);
          return salaireA - salaireB;
        });
      case "salaire-dec":
        return sorted.sort((a, b) => {
          const salaireA = parseInt(a.salaire.split("-")[0]);
          const salaireB = parseInt(b.salaire.split("-")[0]);
          return salaireB - salaireA;
        });
      case "recente":
        return sorted.sort((a, b) => {
          const joursA = parseInt(a.date.match(/\d+/)[0]);
          const joursB = parseInt(b.date.match(/\d+/)[0]);
          return joursA - joursB;
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

      const matchesSecteur =
        selectedSecteur === "tous" || offre.secteur === selectedSecteur;
      const matchesType =
        selectedType === "tous" || offre.type === selectedType;
      const matchesExperience =
        selectedExperience === "tous" ||
        offre.experience === selectedExperience;

      const salaireMin = parseInt(offre.salaire.split("-")[0]) * 1000;
      const matchesSalaire =
        salaireMin >= salaryRange[0] && salaireMin <= salaryRange[1];

      const matchesUrgent = !onlyUrgent || offre.urgent;
      const matchesRemote = !onlyRemote || offre.remote;

      // Filtres par onglet
      const matchesTab =
        activeTab === "toutes" ||
        (activeTab === "urgentes" && offre.urgent) ||
        (activeTab === "remote" && offre.remote) ||
        (activeTab === "recentes" && offre.date.includes("1 jour")) ||
        (activeTab === "sauvegardees" && savedJobs.includes(offre.id));

      return (
        matchesSearch &&
        matchesSecteur &&
        matchesType &&
        matchesExperience &&
        matchesSalaire &&
        matchesUrgent &&
        matchesRemote &&
        matchesTab
      );
    }),
    sortBy
  );

  // Gestion des favoris
  const toggleSavedJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
      toast.success("Offre retirée des favoris");
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success("Offre ajoutée aux favoris");
    }
  };

  // Postuler à une offre
  const handleApply = (job) => {
    setSelectedJob(job);
    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs([...appliedJobs, job.id]);
      toast.success(`Candidature envoyée pour ${job.title}`);
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
    setSelectedJob(null);
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
  const handleShare = (job) => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Découvrez cette offre chez ${job.entreprise}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `${job.title} - ${job.entreprise} - ${window.location.href}`
      );
      toast.success("Lien copié dans le presse-papier");
    }
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedSecteur("tous");
    setSelectedType("tous");
    setSelectedExperience("tous");
    setSalaryRange([30000, 80000]);
    setOnlyUrgent(false);
    setOnlyRemote(false);
    setSearchTerm("");
    toast.success("Filtres réinitialisés");
  };

  // Gestion des alertes
  const toggleJobAlerts = () => {
    setAlertSettings({
      ...alertSettings,
      active: !alertSettings.active,
    });
    toast.success(
      alertSettings.active ? "Alertes désactivées" : "Alertes activées"
    );
  };

  // Voir détails d'une offre
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  // Télécharger guide
  const handleDownloadGuide = (type) => {
    toast.info(`Téléchargement du guide ${type}...`);
    setTimeout(() => {
      toast.success("Guide téléchargé avec succès");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white mt-16">
      {/* Hero Section */}
      <div
        className="relative text-white py-16 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/emploi.jpg')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] opacity-50"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trouvez l'emploi qui vous correspond
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              +2 345 offres d'emploi dans tous les secteurs • Recrutement direct
              et gratuit
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Métier, compétence, entreprise, ville..."
                className="pl-12 py-7 text-lg rounded-xl border-0 shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
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

                {/* Niveau d'expérience */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Expérience
                  </h3>
                  <Select
                    value={selectedExperience}
                    onValueChange={setSelectedExperience}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous niveaux</SelectItem>
                      {niveauxExperience.map((niveau) => {
                        const NiveauIcon = niveau.icon;
                        return (
                          <SelectItem key={niveau.id} value={niveau.id}>
                            <span className="flex items-center gap-2">
                              <NiveauIcon className="h-4 w-4" />
                              {niveau.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Salaire */}
                <div>
                  <h3 className="font-semibold mb-3 text-[#8B4513]">
                    Salaire annuel (min) : {salaryRange[0].toLocaleString()}€
                  </h3>
                  <div className="space-y-2 px-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>30k€</span>
                      <span>80k€</span>
                      <span>120k€</span>
                    </div>
                    <input
                      type="range"
                      min="30000"
                      max="120000"
                      step="5000"
                      value={salaryRange[0]}
                      onChange={(e) =>
                        setSalaryRange([
                          parseInt(e.target.value),
                          salaryRange[1],
                        ])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#556B2F]"
                    />
                  </div>
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

            {/* Statistiques rapides */}
            <Card className="mt-4 border-[#D3D3D3]">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-[#8B4513]">
                  Marché de l'emploi
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Offres actives
                    </span>
                    <span className="font-semibold">2 345</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Nouvelles offres (7j)
                    </span>
                    <span className="font-semibold text-green-600">+156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Télétravail possible
                    </span>
                    <span className="font-semibold">867</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Recrutement rapide
                    </span>
                    <span className="font-semibold">423</span>
                  </div>
                </div>
                <Progress value={65} className="mt-4" />
                <p className="text-xs text-gray-500 text-center mt-2">
                  65% des offres pourvues en moins de 15 jours
                </p>
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
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                    onClick={() => handleDownloadGuide("CV")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Guide CV
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#6B8E23] text-[#6B8E23] hover:bg-[#6B8E23] hover:text-white"
                    onClick={() => handleDownloadGuide("Entretien")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Guide entretien
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredOffres.length} offre
                  {filteredOffres.length > 1 ? "s" : ""} d'emploi
                </h2>
                <p className="text-gray-600">
                  Dernière mise à jour : Aujourd'hui 10:30
                </p>
              </div>
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pertinence">Pertinence</SelectItem>
                    <SelectItem value="salaire-croissant">
                      Salaire croissant
                    </SelectItem>
                    <SelectItem value="salaire-dec">
                      Salaire décroissant
                    </SelectItem>
                    <SelectItem value="recente">Plus récentes</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#556B2F] hover:bg-[#6B8E23] text-white">
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
                          variant="outline"
                          onClick={() =>
                            document.getElementById("cv-upload").click()
                          }
                        >
                          Ajouter un CV
                        </Button>
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
            </div>

            {/* Tabs */}
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
                      savedJobs.length > 0 ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  ({savedJobs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {/* Offres List */}
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
                          appliedJobs.includes(offre.id)
                            ? "border-green-500 bg-green-50/30"
                            : ""
                        }`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Logo Entreprise */}
                            <div className="flex-shrink-0">
                              <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[#556B2F] to-[#6B8E23] flex items-center justify-center text-white">
                                <OffreIcon className="h-8 w-8" />
                                {appliedJobs.includes(offre.id) && (
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
                                        {offre.remote === true
                                          ? "Télétravail"
                                          : "Hybride"}
                                      </Badge>
                                    )}
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
                                    onClick={() => toggleSavedJob(offre.id)}
                                    className={`border-gray-300 ${
                                      savedJobs.includes(offre.id)
                                        ? "text-red-500 border-red-300 bg-red-50"
                                        : ""
                                    }`}
                                  >
                                    <Heart
                                      className={`h-4 w-4 mr-1 ${
                                        savedJobs.includes(offre.id)
                                          ? "fill-red-500"
                                          : ""
                                      }`}
                                    />
                                    {savedJobs.includes(offre.id)
                                      ? "Sauvegardé"
                                      : "Sauvegarder"}
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
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Compétences requises
                                              </h4>
                                              <div className="flex flex-wrap gap-2">
                                                {selectedJob.competences.map(
                                                  (comp, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      variant="secondary"
                                                    >
                                                      {comp}
                                                    </Badge>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                À propos de l'entreprise
                                              </h4>
                                              <div className="text-sm text-gray-600 space-y-1">
                                                <p>
                                                  Secteur :{" "}
                                                  {
                                                    selectedJob.companyInfo
                                                      .sector
                                                  }
                                                </p>
                                                <p>
                                                  Taille :{" "}
                                                  {selectedJob.companyInfo.size}
                                                </p>
                                                <p>
                                                  {
                                                    selectedJob.companyInfo
                                                      .description
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                            <Button
                                              className="w-full bg-[#8B4513] hover:bg-[#6B3410]"
                                              onClick={() =>
                                                handleApply(selectedJob)
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
                                          appliedJobs.includes(offre.id)
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-[#8B4513] hover:bg-[#6B3410]"
                                        } text-white`}
                                        onClick={() => setSelectedJob(offre)}
                                      >
                                        {appliedJobs.includes(offre.id)
                                          ? "✓ Postulé"
                                          : "Postuler"}
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
                                            onClick={() => setSelectedJob(null)}
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

            {/* Newsletter et conseils */}
            <Card className="border-[#556B2F] bg-gradient-to-r from-[#556B2F]/10 to-[#6B8E23]/10 mt-8">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#8B4513] mb-4">
                    Boostez votre recherche d'emploi
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#556B2F] flex items-center justify-center mx-auto">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold">CV Optimisé</h4>
                      <p className="text-sm text-gray-600">
                        Conseils pour un CV qui attire les recruteurs
                      </p>
                      <Button
                        variant="link"
                        className="text-[#556B2F] p-0"
                        onClick={() => handleDownloadGuide("CV Optimisé")}
                      >
                        Télécharger le guide
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#6B8E23] flex items-center justify-center mx-auto">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold">Préparation entretien</h4>
                      <p className="text-sm text-gray-600">
                        Simulations et questions fréquentes
                      </p>
                      <Button
                        variant="link"
                        className="text-[#6B8E23] p-0"
                        onClick={() => handleDownloadGuide("Entretien")}
                      >
                        S'entraîner
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#8B4513] flex items-center justify-center mx-auto">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold">Négociation salariale</h4>
                      <p className="text-sm text-gray-600">
                        Guide pour discuter votre rémunération
                      </p>
                      <Button
                        variant="link"
                        className="text-[#8B4513] p-0"
                        onClick={() => handleDownloadGuide("Négociation")}
                      >
                        Découvrir les astuces
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      className="bg-[#556B2F] hover:bg-[#6B8E23] text-white px-8"
                      onClick={() =>
                        toast.info(
                          "Service d'accompagnement bientôt disponible"
                        )
                      }
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Bénéficier d'un accompagnement
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                      onClick={() =>
                        setAlertSettings({ ...alertSettings, active: true })
                      }
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      S'inscrire à la newsletter emploi
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant FileText manquant
const FileText = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default OffresEmploiPage;
