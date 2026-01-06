import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
import { usePublicEmploi } from "@/hooks/usePublicEmploi";

const EmploiSection = ({
  loading,
  savedItems,
  appliedItems,
  toggleSavedItem,
  handleApply,
  handleShare,
  // Supprimer handleFileUpload des props puisqu'il n'est pas fourni
  // handleFileUpload,
  cvFile,
  setCvFile,
  setLoading,
  motivationLetter,
  setMotivationLetter,
  alertSettings,
  setAlertSettings,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Utiliser le hook pour les emplois publics
  const { 
    emplois, 
    isLoading: apiLoading, 
    stats, 
    fetchEmplois,
    fetchStats,
    applyToEmploi,
    fetchEmploiDetails
  } = usePublicEmploi();

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
  const [selectedOffreForApply, setSelectedOffreForApply] = useState(null);

  // ✅ CORRECTION : Définition de typesContrat (doit être avant son utilisation)
  const typesContrat = [
    { id: "CDI", label: "CDI", color: "bg-green-100 text-green-800" },
    { id: "CDD", label: "CDD", color: "bg-blue-100 text-blue-800" },
    { id: "Intérim", label: "Intérim", color: "bg-purple-100 text-purple-800" },
    { id: "Freelance", label: "Freelance", color: "bg-orange-100 text-orange-800" },
    { id: "Alternance", label: "Alternance", color: "bg-yellow-100 text-yellow-800" },
    { id: "Stage", label: "Stage", color: "bg-pink-100 text-pink-800" },
  ];

  // CORRECTION : Ajouter la même fonction de gestion de fichier que dans AlternanceSection
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 5MB");
        return;
      }
      
      // Vérifier l'extension
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error("Format de fichier non supporté. Utilisez PDF, DOC ou DOCX");
        return;
      }
      
      setCvFile({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file) // Crée une URL locale pour le fichier
      });
      toast.success("CV téléchargé avec succès");
    }
  };

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchEmplois({
            search: "",
            status: "active",
            type: "all",
            secteur: "all",
            page: 1
          }),
          fetchStats()
        ]);
      } catch (error) {
        console.log("Erreur capturée dans EmploiSection:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Formater les offres à partir des données API
  useEffect(() => {
    if (emplois && Array.isArray(emplois)) {
      const formattedOffres = emplois
        .filter(emploi => emploi.status === 'active')
        .map(emploi => ({
          id: emploi.id,
          title: emploi.title,
          entreprise: emploi.entreprise || "Entreprise non spécifiée",
          secteur: emploi.secteur,
          type: emploi.typeContrat,
          experience: emploi.experience,
          location: emploi.location,
          salaire: emploi.salaire,
          date: emploi.datePublication 
            ? `Publiée il y a ${calculateDaysAgo(emploi.datePublication)}`
            : "Date non spécifiée",
          urgent: emploi.urgent || false,
          remote: emploi.remotePossible || false,
          description: emploi.description,
          missions: Array.isArray(emploi.missions) ? emploi.missions : [],
          competences: Array.isArray(emploi.competences) ? emploi.competences : [],
          avantages: Array.isArray(emploi.avantages) ? emploi.avantages : [],
          icon: getIconBySecteur(emploi.secteur),
          candidatures_count: emploi.candidaturesCount || 0,
          vues: emploi.vues || 0,
          dateLimite: emploi.dateLimite,
          nombrePostes: emploi.nombrePostes || 1,
          status: emploi.status,
          organisme: emploi.organisme || emploi.entreprise
        }));
      setOffres(formattedOffres);
    }
  }, [emplois]);

  // Vérifier les actions en attente après connexion
  useEffect(() => {
    const checkForPendingAction = () => {
      const pendingAction = sessionStorage.getItem('pendingEmploiAction');
      const emploiId = sessionStorage.getItem('selectedEmploiId');
      
      if (pendingAction === 'apply' && emploiId && isAuthenticated) {
        const emploiToOpen = emplois?.find(e => e.id.toString() === emploiId);
        if (emploiToOpen) {
          setSelectedOffreForApply(emploiToOpen);
          setIsApplicationDialogOpen(true);
          toast.success("Bienvenue ! Vous pouvez maintenant postuler à l'offre.");
        }
        
        sessionStorage.removeItem('pendingEmploiAction');
        sessionStorage.removeItem('selectedEmploiId');
        sessionStorage.removeItem('emploiTitle');
      }
    };

    checkForPendingAction();

    const handleStorageChange = (e) => {
      if (e.key === 'pendingEmploiAction' || e.key === 'selectedEmploiId') {
        checkForPendingAction();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, emplois]);

  const calculateDaysAgo = (dateString) => {
    if (!dateString) return "quelques jours";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 jour";
    if (diffDays === 0) return "aujourd'hui";
    return `${diffDays} jours`;
  };

  const getIconBySecteur = (secteur) => {
    switch(secteur) {
      case "Informatique & Tech":
        return Code;
      case "Bâtiment & Construction":
        return Hammer;
      case "Commerce & Vente":
        return TrendingUp;
      case "Santé & Social":
        return Activity;
      default:
        return Briefcase;
    }
  };

  const filteredOffres = offres.filter((offre) => {
    const matchesSearch =
      searchTerm === "" ||
      offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.entreprise.toLowerCase().includes(searchTerm.toLowerCase());

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
      (activeTab === "sauvegardees" && savedItems.includes(`emploi-${offre.id}`));

    return (
      matchesSearch &&
      matchesSecteur &&
      matchesType &&
      matchesUrgent &&
      matchesRemote &&
      matchesTab
    );
  });

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        await fetchEmplois({
          search: searchTerm,
          status: "active",
          type: selectedType !== "tous" ? selectedType : "all",
          secteur: selectedSecteur !== "tous" ? selectedSecteur : "all",
          page: 1
        });
        toast.info(`Recherche d'emploi pour "${searchTerm}"`);
      } catch (error) {
        toast.error("Erreur lors de la recherche");
      } finally {
        setLoading(false);
      }
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
    
    setLoading(true);
    fetchEmplois({
      search: "",
      status: "active",
      type: "all",
      secteur: "all",
      page: 1
    }).finally(() => setLoading(false));
    
    toast.success("Filtres réinitialisés");
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!selectedOffreForApply) return;
    
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingEmploiAction', 'apply');
      sessionStorage.setItem('selectedEmploiId', selectedOffreForApply.id.toString());
      sessionStorage.setItem('emploiTitle', selectedOffreForApply.title);
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      navigate("/login");
      return;
    }
    
    if (!cvFile && !motivationLetter.trim()) {
      toast.error("Veuillez ajouter au moins un CV ou un message de motivation");
      return;
    }

    try {
      const result = await applyToEmploi(selectedOffreForApply.id, {
        motivation: motivationLetter,
        cvUrl: cvFile?.url,
        nomCandidat: user?.name || user?.firstName + ' ' + user?.lastName,
        emailCandidat: user?.email,
        telephoneCandidat: user?.phone
      });

      if (result.success) {
        toast.success("Candidature envoyée avec succès !");
        setMotivationLetter("");
        setCvFile(null);
        setIsApplicationDialogOpen(false);
        setSelectedOffreForApply(null);
        
        // Mettre à jour la liste des candidatures
        if (handleApply) {
          handleApply(selectedOffreForApply.id, "emploi", selectedOffreForApply.title);
        }
        
        // Recharger les données pour mettre à jour les compteurs
        await fetchEmplois({ status: "active" });
        await fetchStats();
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'envoi de la candidature");
    }
  };

  const handleInscription = (offre) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingEmploiAction', 'apply');
      sessionStorage.setItem('selectedEmploiId', offre.id.toString());
      sessionStorage.setItem('emploiTitle', offre.title);
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      navigate("/login");
      return;
    }

    // Si l'utilisateur est connecté, ouvrir le formulaire de candidature
    setSelectedOffreForApply(offre);
    setIsApplicationDialogOpen(true);
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
    { 
      label: "Offres actives", 
      value: stats?.total || "0", 
      icon: Briefcase 
    },
    { 
      label: "Nouvelles offres (7j)", 
      value: "+" + (stats?.nouvellesSemaine || "0"), 
      icon: Clock 
    },
    { 
      label: "Télétravail possible", 
      value: stats?.remotePossible || "0", 
      icon: Users2 
    },
    { 
      label: "Urgentes", 
      value: stats?.urgent || "0", 
      icon: Zap 
    },
  ];

  // Dynamiser les secteurs à partir des statistiques
  const secteurs = [
    {
      id: "Informatique & Tech",
      label: "Informatique & Tech",
      count: stats?.parSecteur?.["Informatique & Tech"] || 0,
      icon: Code,
    },
    {
      id: "Bâtiment & Construction",
      label: "Bâtiment & Construction",
      count: stats?.parSecteur?.["Bâtiment & Construction"] || 0,
      icon: Hammer,
    },
    {
      id: "Commerce & Vente",
      label: "Commerce & Vente",
      count: stats?.parSecteur?.["Commerce & Vente"] || 0,
      icon: TrendingUp,
    },
    {
      id: "Santé & Social",
      label: "Santé & Social",
      count: stats?.parSecteur?.["Santé & Social"] || 0,
      icon: Activity,
    },
    // Ajouter d'autres secteurs dynamiquement si présents dans les stats
    ...Object.entries(stats?.parSecteur || {})
      .filter(([key]) => !["Informatique & Tech", "Bâtiment & Construction", "Commerce & Vente", "Santé & Social"].includes(key))
      .map(([key, count]) => ({
        id: key,
        label: key,
        count: count,
        icon: Briefcase,
      }))
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
              disabled={apiLoading}
            >
              {apiLoading ? "Recherche..." : "Rechercher"}
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
                disabled={apiLoading}
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
                        Déposez votre CV pour être visible par nos recruteurs partenaires
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
                          // CORRECTION: Utiliser handleFileUpload défini localement
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
              {apiLoading || loading ? (
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
                                      )?.color || "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {offre.type}
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

                            {offre.competences && offre.competences.length > 0 && (
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
                            )}

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex flex-wrap gap-2">
                                {offre.avantages && offre.avantages.slice(0, 3).map((avantage, idx) => (
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
                                          {selectedJob.missions && selectedJob.missions.length > 0 && (
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
                                          )}
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Salaire
                                              </h4>
                                              <p className="text-lg font-bold">{selectedJob.salaire}</p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Type de contrat
                                              </h4>
                                              <p>{selectedJob.type}</p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Expérience
                                              </h4>
                                              <p>{selectedJob.experience}</p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Date limite
                                              </h4>
                                              <p>{selectedJob.dateLimite ? new Date(selectedJob.dateLimite).toLocaleDateString() : "Non spécifiée"}</p>
                                            </div>
                                          </div>
                                          <Button
                                            className="w-full bg-[#8B4513] hover:bg-[#6B3410]"
                                            onClick={() => handleInscription(selectedJob)}
                                            disabled={appliedItems.includes(`emploi-${selectedJob.id}`)}
                                          >
                                            {appliedItems.includes(`emploi-${selectedJob.id}`) 
                                              ? "✓ Déjà postulé" 
                                              : "Postuler maintenant"}
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </SheetContent>
                                </Sheet>
                                <Button
                                  size="sm"
                                  className={`${
                                    isApplied
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-[#8B4513] hover:bg-[#6B3410]"
                                  } text-white`}
                                  onClick={() => handleInscription(offre)}
                                  disabled={isApplied}
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

      {/* Dialog de candidature */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedOffreForApply
                ? `Postuler à : ${selectedOffreForApply.title}`
                : "Postuler"}
            </DialogTitle>
            <DialogDescription>
              {selectedOffreForApply
                ? `Postulez à cette offre en remplissant le formulaire ci-dessous.`
                : "Remplissez le formulaire de candidature."}
            </DialogDescription>
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
                    // CORRECTION: Utiliser handleFileUpload défini localement
                    onChange={handleFileUpload}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Formats acceptés : PDF, DOC, DOCX (max 5MB)
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
                onClick={() => {
                  setIsApplicationDialogOpen(false);
                  setSelectedOffreForApply(null);
                }}
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
    </>
  );
};

export default EmploiSection;