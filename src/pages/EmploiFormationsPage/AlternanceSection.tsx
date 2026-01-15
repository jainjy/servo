import React, { useState, useEffect } from "react";
import { usePublicAlternance } from '@/hooks/usePublicAlternance';
import { useAuth } from '@/hooks/useAuth'; // Ajoutez cet import
import {
  Search,
  Filter,
  Award,
  MapPin,
  Building,
  Heart,
  Share2,
  Zap,
  GraduationCap,
  BookOpen,
  Code,
  TrendingUp,
  Clock,
  Calendar,
  ChevronRight,
  CheckCircle,
  Briefcase,
  Users,
  DollarSign,
  Eye,
  Check,
  Upload,
  FileText,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

const AlternanceSection = ({
  loading,
  savedItems,
  appliedItems,
  toggleSavedItem,
  handleApply,
  handleShare,
  handleDownloadGuide,
  setLoading,
  researchProgress,
  setResearchProgress,
}) => {
  // Ajoutez ce hook au début du composant
  const { isAuthenticated, user } = useAuth();
  
  // Utiliser le hook usePublicAlternance pour récupérer les données
  const { 
    offres, 
    isLoading, 
    error, 
    stats, 
    fetchOffres, 
    fetchStats,
    applyToAlternance,
    fetchOffreDetails
  } = usePublicAlternance();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("tous");
  const [selectedNiveau, setSelectedNiveau] = useState("tous");
  const [activeTab, setActiveTab] = useState("alternance");
  const [localOffres, setLocalOffres] = useState([]);
  
  // États pour le modal de candidature
  const [selectedOffreForApply, setSelectedOffreForApply] = useState(null);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [motivationLetter, setMotivationLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [lettreFile, setLettreFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Types d'offres
  const types = [
    {
      id: "tous",
      label: "Tous",
      icon: Briefcase,
      description: "Tous les types d'offres",
    },
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
    }
  ];

  // Niveaux d'étude
  const niveaux = [
    { id: "tous", label: "Tous", color: "bg-gray-100 text-gray-800" },
    { id: "BAC", label: "BAC", color: "bg-blue-100 text-blue-800" },
    { id: "BAC+2", label: "BAC+2", color: "bg-green-100 text-green-800" },
    { id: "BAC+3", label: "BAC+3", color: "bg-yellow-100 text-yellow-800" },
    { id: "BAC+4", label: "BAC+4", color: "bg-orange-100 text-orange-800" },
    { id: "BAC+5 et plus", label: "BAC+5+", color: "bg-purple-100 text-purple-800" },
  ];

  // Formater les offres pour l'affichage
  const formatOffreForDisplay = (offre) => {
    // Déterminer le type d'icône en fonction du type d'offre
    let IconComponent = Code;
    if (offre.type?.includes("Stage")) {
      IconComponent = GraduationCap;
    } else if (offre.type?.includes("Alternance")) {
      IconComponent = TrendingUp;
    }

    // Déterminer la durée formatée
    let dureeFormatted = offre.duree || "Non spécifié";
    if (offre.type?.includes("Stage")) {
      dureeFormatted = "4-6 mois";
    } else if (offre.type?.includes("Alternance")) {
      dureeFormatted = "12-24 mois";
    }

    return {
      id: offre.id,
      title: offre.title || "Sans titre",
      entreprise: offre.ecolePartenaire || "Entreprise",
      type: offre.type || "Non spécifié",
      niveau: offre.niveauEtude || "Non spécifié",
      duree: dureeFormatted,
      location: offre.location || "Non spécifié",
      date: offre.dateDebut ? new Date(offre.dateDebut).toLocaleDateString('fr-FR', { 
        month: 'long', 
        year: 'numeric' 
      }) : "Date non spécifiée",
      remuneration: offre.remuneration || "Non spécifié",
      description: offre.description || "Aucune description",
      missions: Array.isArray(offre.missions) ? offre.missions : [],
      competences: Array.isArray(offre.competences) ? offre.competences : [],
      avantages: Array.isArray(offre.avantages) ? offre.avantages : [],
      icon: IconComponent,
      urgent: offre.urgent || false,
      remote: offre.location?.toLowerCase().includes('télétravail') ? "hybride" : "présentiel",
      status: offre.status || "active",
      vues: offre.vues || 0,
      candidatures_count: offre.candidatures_count || 0,
      ecolePartenaire: offre.ecolePartenaire || "",
      rythmeAlternance: offre.rythmeAlternance || "",
      pourcentageTemps: offre.pourcentageTemps || "",
      dateLimite: offre.dateLimite
    };
  };

  // Charger les offres au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchOffres({ 
            search: '', 
            status: 'active', 
            type: 'all',
            niveau: 'all',
            page: 1,
            limit: 50
          }),
          fetchStats()
        ]);
      } catch (error) {
        console.error("Erreur chargement données alternance:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mettre à jour les offres locales quand les données changent
  useEffect(() => {
    if (offres && offres.length > 0) {
      const formattedOffres = offres.map(formatOffreForDisplay);
      setLocalOffres(formattedOffres);
    } else {
      setLocalOffres([]);
    }
  }, [offres]);

  // Filtrer les offres
  const filteredOffres = localOffres.filter((offre) => {
    const matchesSearch =
      searchTerm === "" ||
      offre.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.entreprise.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      selectedType === "tous" || 
      (selectedType === "alternance" && offre.type.includes("Alternance")) ||
      (selectedType === "stage" && offre.type.includes("Stage"));

    const matchesNiveau = 
      selectedNiveau === "tous" || 
      offre.niveau === selectedNiveau;

    const matchesTab =
      (activeTab === "alternance" && offre.type.includes("Alternance")) ||
      (activeTab === "stage" && offre.type.includes("Stage")) ||
      (activeTab === "sauvegardees" && savedItems.includes(`alternance-${offre.id}`));

    // Ne montrer que les offres actives
    const isActive = offre.status === "active";

    return matchesSearch && matchesType && matchesNiveau && matchesTab && isActive;
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      toast.info(`Recherche d'alternance/stage pour "${searchTerm}"`);
      // Recharger les données avec le terme de recherche
      fetchOffres({ 
        search: searchTerm, 
        status: 'active', 
        type: selectedType === "tous" ? "all" : selectedType,
        niveau: selectedNiveau === "tous" ? "all" : selectedNiveau,
        page: 1,
        limit: 50
      });
    }
  };

  const handleResetFilters = () => {
    setSelectedType("tous");
    setSelectedNiveau("tous");
    setSearchTerm("");
    setActiveTab("alternance");
    
    fetchOffres({ 
      search: '', 
      status: 'active', 
      type: 'all',
      niveau: 'all',
      page: 1,
      limit: 50
    });
    
    toast.success("Filtres réinitialisés");
  };

  const handleOpenEvents = () => {
    toast.info("Ouverture du calendrier des événements...");
  };

  // Gestion du fichier CV
  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
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
        url: URL.createObjectURL(file)
      });
      toast.success("CV téléchargé avec succès");
    }
  };

  // Gestion du fichier lettre de motivation
  const handleLettreFileChange = (e) => {
    const file = e.target.files[0];
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
      
      setLettreFile({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      });
      toast.success("Lettre de motivation téléchargée avec succès");
    }
  };

  // Soumettre la candidature
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!selectedOffreForApply) return;
    
    // Vérifier que l'utilisateur est connecté
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour postuler");
      return;
    }
    
    // Validation
    if (!motivationLetter.trim() && !cvFile && !lettreFile) {
      toast.error("Veuillez fournir au moins un CV ou un message de motivation");
      return;
    }

    try {
      // Préparer les données de candidature
      const applicationData = {
        motivation: motivationLetter,
        cvUrl: cvFile?.url || null,
        lettreMotivationUrl: lettreFile?.url || null,
        nomCandidat: user?.firstName + ' ' + user?.lastName || user?.name || 'Candidat',
        emailCandidat: user?.email || '',
        telephoneCandidat: user?.phone || ''
      };

      const result = await applyToAlternance(
        selectedOffreForApply.id,
        applicationData
      );

      if (result.success) {
        toast.success("Candidature envoyée avec succès !");
        
        // Réinitialiser le formulaire
        setMotivationLetter("");
        setCvFile(null);
        setLettreFile(null);
        setIsApplicationDialogOpen(false);
        setSelectedOffreForApply(null);
        
        // Mettre à jour la liste des candidatures
        if (handleApply) {
          handleApply(selectedOffreForApply.id, "alternance", selectedOffreForApply.title);
        }
        
        // Recharger les données pour mettre à jour les compteurs
        await fetchOffres({ status: "active" });
        await fetchStats();
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'envoi de la candidature");
    }
  };

  // Ouvrir le modal de candidature
  const handleOpenApplicationDialog = (offre) => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour postuler");
      return;
    }
    
    setSelectedOffreForApply(offre);
    setIsApplicationDialogOpen(true);
  };

  // Gérer le partage d'une offre
  const handleShareOffre = (offre) => {
    const shareText = `Découvrez cette offre: ${offre.title} - ${offre.entreprise} - ${offre.location}`;
    const shareUrl = `${window.location.origin}/alternance/${offre.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: offre.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  // Rendu d'un badge pour le statut
  const renderStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", color: "bg-green-100 text-green-800" },
      draft: { label: "Brouillon", color: "bg-gray-100 text-gray-800" },
      archived: { label: "Archivée", color: "bg-yellow-100 text-yellow-800" },
      filled: { label: "Pourvue", color: "bg-blue-100 text-blue-800" }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  // Statistiques dynamiques
  const statsData = [
    { 
      label: "Offres actives", 
      value: stats?.total || "0", 
      icon: Briefcase 
    },
    { 
      label: "Alternances", 
      value: stats?.alternance || "0", 
      icon: GraduationCap 
    },
    { 
      label: "Stages", 
      value: stats?.stage || "0", 
      icon: BookOpen 
    },
    { 
      label: "Total candidatures", 
      value: stats?.candidatures || "0", 
      icon: Users 
    },
  ];

  return (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="bg-white/40 border-white/60 text-[#556B2F] hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6 text-center">
                <IconComponent className="h-8 w-8 mx-auto mb-2 text-[#8B4513]" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
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
                {savedItems.filter((id) => id.startsWith("alternance-")).length}
                )
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {(isLoading || loading) ? (
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
                                  {renderStatusBadge(offre.status)}
                                  <Badge className="bg-[#556B2F] text-white">
                                    {offre.type}
                                  </Badge>
                                  <Badge
                                    className={
                                      niveaux.find(
                                        (n) => n.id === offre.niveau
                                      )?.color || "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {offre.niveau}
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
                                  <div className="flex items-center gap-1 ml-2 text-sm text-gray-500">
                                    <Eye className="h-3 w-3" />
                                    <span>{offre.vues} vues</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-[#8B4513] mb-1">
                                  {offre.remuneration}
                                </div>
                                <div className="flex items-center gap-2 justify-end mb-1">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <p className="text-sm text-gray-600">
                                    {offre.duree}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {offre.date}
                                </p>
                                <div className="flex items-center gap-1 justify-end mt-1">
                                  <Users className="h-3 w-3 text-gray-500" />
                                  <span className="text-xs text-gray-500">
                                    {offre.candidatures_count} candidatures
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-700 mb-3 line-clamp-2">
                              {offre.description}
                            </p>

                            {offre.missions.length > 0 && (
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
                                  {offre.missions.length > 3 && (
                                    <li className="text-gray-400">
                                      ... et {offre.missions.length - 3} autres
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              {offre.competences.length > 0 && (
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
                                    <Badge variant="outline" className="text-gray-500">
                                      +{offre.competences.length - 4}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
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
                                  onClick={() => handleShareOffre(offre)}
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
                                              Description de l'offre
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
                                                Rémunération
                                              </h4>
                                              <p className="text-lg font-bold">{selectedJob.remuneration}</p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Durée
                                              </h4>
                                              <p>{selectedJob.duree}</p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-[#8B4513] mb-2">
                                                Niveau d'étude
                                              </h4>
                                              <p>{selectedJob.niveau}</p>
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
                                            onClick={() => handleOpenApplicationDialog(selectedJob)}
                                            disabled={appliedItems.includes(`alternance-${selectedJob.id}`)}
                                          >
                                            {appliedItems.includes(`alternance-${selectedJob.id}`) 
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
                                  onClick={() => handleOpenApplicationDialog(offre)}
                                  disabled={isApplied}
                                >
                                  {isApplied ? (
                                    <>
                                      <Check className="h-4 w-4 mr-1" />
                                      Postulé
                                    </>
                                  ) : (
                                    "Postuler"
                                  )}
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
                      Essayez de modifier vos critères de recherche ou vérifiez plus tard
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
                  placeholder="Expliquez pourquoi vous êtes intéressé par cette alternance/stage, vos motivations et vos aspirations..."
                  className="min-h-[150px]"
                  value={motivationLetter}
                  onChange={(e) => setMotivationLetter(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="font-semibold mb-2 block">
                  CV (obligatoire) :
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">
                    Glissez-déposez votre CV ou
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("cv-upload").click()}
                  >
                    Parcourir les fichiers
                  </Button>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleCvFileChange}
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
                  setMotivationLetter("");
                  setCvFile(null);
                  setLettreFile(null);
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#556B2F] hover:bg-[#6B8E23]"
                disabled={!cvFile && !motivationLetter.trim()}
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

export default AlternanceSection;