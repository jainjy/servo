import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  Users2,
  Zap,
  MapPin,
  Building,
  Heart,
  Share2,
  Bell,
  Code,
  Hammer,
  TrendingUp,
  Activity,
  Eye,
  FileText,
  X,
  CheckCircle,
  Upload,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const EmploiSection = ({
  loading,
  savedItems,
  appliedItems,
  toggleSavedItem,
  handleApply,
  handleShare,
  handleFileUpload,
  cvFile,
  setCvFile,
  setLoading,
  motivationLetter,
  setMotivationLetter,
  alertSettings,
  setAlertSettings,
}) => {
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
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

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
    const matchesType = selectedType === "tous" || offre.type === selectedType;
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
                toast.info("Fonctionnalité de localisation bientôt disponible")
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-5 max-w-lg mb-6">
              <TabsTrigger value="toutes">Toutes</TabsTrigger>
              <TabsTrigger value="urgentes">Urgentes</TabsTrigger>
              <TabsTrigger value="remote">Télétravail</TabsTrigger>
              <TabsTrigger value="recentes">Récentes</TabsTrigger>
              <TabsTrigger value="sauvegardees">
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    savedItems.filter((id) => id.startsWith("emploi-")).length >
                    0
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
                                              setMotivationLetter(e.target.value)
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
                                              Formats acceptés : PDF, DOC, DOCX
                                              (max 5MB)
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
                                                onClick={() => setCvFile(null)}
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
                      Essayez d'élargir vos recherches ou créez une alerte pour
                      être informé des nouvelles offres
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

export default EmploiSection;