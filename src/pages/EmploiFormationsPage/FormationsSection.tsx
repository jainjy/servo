import React, { useState, useEffect } from "react";
import { useCandidatures } from '@/hooks/useCandidatures';
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  Users,
  Award,
  BookOpen,
  MapPin,
  Star,
  Calendar,
  GraduationCap,
  Download,
  Mail,
  ChevronRight,
  CheckCircle,
  DollarSign,
  Zap,
  Upload,
  FileText,
  X,
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
import { useAuth } from "@/hooks/useAuth";
import { usePublicFormations } from "@/hooks/usePublicFormations";
import { 
  FaLaptop, 
  FaUserTie, 
  FaChartLine, 
  FaBuilding,
  FaHeartbeat,
  FaMoneyBillAlt,
  FaGlobeAmericas,
  FaTools,
  FaBook 
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const FormationsSection = ({
  loading,
  savedItems,
  appliedItems,
  toggleSavedItem,
  handleApply,
  handleShare,
  handleDownloadGuide,
  handleFileUpload,  // Garder cette prop
  cvFile,
  setCvFile,
  setLoading,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { formations, isLoading: apiLoading, fetchFormations } = usePublicFormations();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [selectedFormat, setSelectedFormat] = useState("tous");
  const [priceRange, setPriceRange] = useState([0, 5000]);
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
  const [userCVUrl, setUserCVUrl] = useState(null); // Pour stocker le CV de la base de données

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
    { id: "présentiel", label: "Présentiel", icon: Users },
    { id: "100% en ligne", label: "100% en ligne", icon: BookOpen },
    { id: "hybride", label: "Hybride", icon: ChevronRight },
    { id: "alternance", label: "Alternance", icon: GraduationCap },
  ];

  // AJOUT: Fonction pour uploader le CV vers la base de données
  const uploadCVToDatabase = async (file) => {
    if (!isAuthenticated || !user) {
      toast.error('Veuillez vous connecter pour télécharger votre CV');
      return null;
    }

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return null;
      }

      const formData = new FormData();
      formData.append('cv', file);
      formData.append('userId', user.id);
      formData.append('fileName', file.name);

      console.log('📤 Upload CV vers base de données...');

      // Essayez plusieurs endpoints
      const endpoints = [
        `${API_URL}/user/upload-cv`,
        `${API_URL}/upload/cv`,
        `${API_URL}/cv/upload`
      ];

      let response = null;
      
      for (const endpoint of endpoints) {
        try {
          response = await axios.post(endpoint, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          if (response.data.success || response.data.url) {
            console.log('✅ CV uploadé avec succès via:', endpoint);
            break;
          }
        } catch (error) {
          console.log(`❌ Échec avec ${endpoint}:`, error.message);
          continue;
        }
      }

      if (!response) {
        throw new Error('Aucun endpoint ne fonctionne');
      }

      const cvUrl = response.data.success ? 
        response.data.data?.cvUrl : 
        response.data.url;

      if (cvUrl) {
        setUserCVUrl(cvUrl);
        toast.success('CV téléchargé avec succès !');
        return cvUrl;
      } else {
        throw new Error('Aucune URL de CV retournée');
      }

    } catch (error) {
      console.error('❌ Erreur upload CV:', error);
      toast.error('Erreur lors du téléchargement du CV');
      return null;
    }
  };

  // MODIFICATION: handleFileUpload amélioré
  const handleFileUploadEnhanced = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifications
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Format de fichier non supporté. Utilisez PDF, DOC ou DOCX');
      return;
    }

    // Upload vers la base de données
    const cvUrl = await uploadCVToDatabase(file);
    
    if (cvUrl) {
      // Stocker aussi localement pour la session
      const localUrl = URL.createObjectURL(file);
      setCvFile({
        file: file,
        url: localUrl,
        name: file.name,
        dbUrl: cvUrl  // URL de la base de données
      });
    } else {
      // Fallback: stocker localement seulement
      const localUrl = URL.createObjectURL(file);
      setCvFile({
        file: file,
        url: localUrl,
        name: file.name
      });
      toast.success('CV prêt pour la candidature');
    }
  };

  // AJOUT: Charger le CV existant de l'utilisateur
  useEffect(() => {
    if (isAuthenticated && user) {
      loadExistingCV();
    }
  }, [isAuthenticated, user]);

  const loadExistingCV = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/user/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success && response.data.data?.cvUrl) {
        setUserCVUrl(response.data.data.cvUrl);
        console.log('✅ CV existant chargé:', response.data.data.cvUrl);
      }
    } catch (error) {
      console.log('ℹ️ Aucun CV existant trouvé ou erreur de chargement');
    }
  };

  // Charger les formations
  useEffect(() => {
    const loadFormations = async () => {
      setLoading(true);
      try {
        await fetchFormations({ 
          status: "active",
          page: 1,
          limit: 50
        });
      } catch (error) {
        console.log("Erreur capturée dans FormationsSection:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFormations();
  }, [fetchFormations]);

  // Vérifier les actions en attente après connexion
  useEffect(() => {
    const checkForPendingAction = () => {
      const pendingAction = sessionStorage.getItem('pendingFormationAction');
      const formationId = sessionStorage.getItem('selectedFormationId');
      
      if (pendingAction === 'inscription' && formationId && isAuthenticated) {
        const formationToOpen = formations?.find(f => f.id.toString() === formationId);
        if (formationToOpen) {
          setSelectedFormation(formationToOpen);
          setIsContactDialogOpen(true);
          toast.success("Bienvenue ! Vous pouvez maintenant vous inscrire à la formation.");
        }
        
        sessionStorage.removeItem('pendingFormationAction');
        sessionStorage.removeItem('selectedFormationId');
        sessionStorage.removeItem('formationTitle');
      }
    };

    checkForPendingAction();

    const handleStorageChange = (e) => {
      if (e.key === 'pendingFormationAction' || e.key === 'selectedFormationId') {
        checkForPendingAction();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, formations]);

  const filteredFormations = formations?.filter((formation) => {
    const matchesSearch =
      formation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.organisme?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "tous" || formation.category === selectedCategory;
    
    const matchesFormat =
      selectedFormat === "tous" || formation.format === selectedFormat;
    
    const matchesPrice =
      formation.price >= priceRange[0] && formation.price <= priceRange[1];

    const matchesTab =
      activeTab === "toutes" ||
      (activeTab === "certifiantes" && formation.isCertified) ||
      (activeTab === "financees" && formation.isFinanced) ||
      (activeTab === "alternance" && formation.format === "alternance");

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFormat &&
      matchesPrice &&
      matchesTab &&
      formation.status === "active"
    );
  }) || [];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      toast.info(`Recherche de formations pour "${searchTerm}"`);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("tous");
    setSelectedFormat("tous");
    setPriceRange([0, 5000]);
    setSearchTerm("");
    setSortBy("pertinence");
    setActiveTab("toutes");
    toast.success("Filtres réinitialisés");
  };

  const { postuler, isLoading } = useCandidatures();

  // CORRECTION: Fonction handleApplyToFormation
  const handleApplyToFormation = async (e) => {
    e.preventDefault();
    
    if (!selectedFormation) {
      toast.error("Aucune formation sélectionnée");
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error("Vous devez être connecté pour postuler");
      navigate("/login");
      return;
    }

    // Vérification des champs requis
    if (!contactForm.message || contactForm.message.trim() === '') {
      toast.error("Veuillez rédiger un message de motivation");
      return;
    }

    try {
      // Préparer les données pour l'API
      const candidatureData = {
        messageMotivation: contactForm.message,
        cvUrl: cvFile?.dbUrl || cvFile?.url || userCVUrl, // Utiliser l'URL de la base de données si disponible
        nomCandidat: contactForm.name || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        emailCandidat: contactForm.email || user.email || '',
        telephoneCandidat: contactForm.phone || user.phone || null
      };

      // Log pour debug
      console.log('📤 Envoi candidature formation:', {
        formationId: selectedFormation.id,
        data: candidatureData
      });

      const result = await postuler(
        selectedFormation.id,
        'formation',
        selectedFormation.title,
        candidatureData
      );

      if (result.success) {
        toast.success("Votre candidature a été envoyée avec succès !");
        setIsContactDialogOpen(false);
        setContactForm({ name: "", email: "", phone: "", message: "" });
        setCvFile(null);
        
        // Mettre à jour appliedItems si nécessaire
        if (handleApply && typeof handleApply === 'function') {
          handleApply(`formations-${selectedFormation.id}`);
        }
        
        // Recharger les formations si nécessaire
        await fetchFormations({ status: "active" });
      } else {
        toast.error(result.error || "Erreur lors de l'envoi de la candidature");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la postulation:", error);
      
      if (error.message.includes("Non autorisé") || error.message.includes("connecté")) {
        toast.error("Veuillez vous connecter pour postuler");
        navigate("/login");
      } else if (error.message.includes("déjà postulé")) {
        toast.error("Vous avez déjà postulé à cette formation");
      } else {
        toast.error(error.message || "Erreur lors de l'envoi de la candidature");
      }
    }
  };

  const handleInscription = async (formation) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingFormationAction', 'inscription');
      sessionStorage.setItem('selectedFormationId', formation.id.toString());
      sessionStorage.setItem('formationTitle', formation.title);
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      navigate("/login");
      return;
    }

    // Si l'utilisateur est connecté, ouvrir le formulaire d'inscription
    setSelectedFormation(formation);
    setIsContactDialogOpen(true);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      toast.success(
        "Votre demande a été envoyée ! Un conseiller vous contactera sous 24h."
      );
      setContactForm({ name: "", email: "", phone: "", message: "" });
      setIsContactDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };

  const statsData = [
    { label: "Formations disponibles", value: formations?.length || "0", icon: BookOpen },
    { label: "Organismes partenaires", value: "86", icon: Users },
    { label: "Certifications reconnues", value: "312", icon: Award },
    { label: "Taux de réussite", value: "94%", icon: Star },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      'Informatique & Numérique': FaLaptop,
      'Management & Leadership': FaUserTie,
      'Commerce & Marketing': FaChartLine,
      'Bâtiment & Construction': FaBuilding,
      'Santé & Bien-être': FaHeartbeat,
      'Comptabilité & Finance': FaMoneyBillAlt,
      'Langues étrangères': FaGlobeAmericas,
      'Artisanat & Métiers': FaTools,
    };
    
    return icons[category] || FaBook;
  };

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
                  onClick={() => toast.info("Fonctionnalité à venir")}
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
                  {apiLoading || loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Card key={`skeleton-${i}`} className="border-[#D3D3D3]">
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
                              <div className="text-4xl">
                                {React.createElement(getCategoryIcon(formation.category), {
                                  className: "text-white",
                                  size: 40
                                })}
                              </div>
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
                                      {formation.category}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-[#8B4513] text-[#8B4513]"
                                    >
                                      {formation.format}
                                    </Badge>
                                    {formation.isCertified && (
                                      <Badge className="bg-green-100 text-green-800 border-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Certifiée
                                      </Badge>
                                    )}
                                    {formation.isFinanced && (
                                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        Financée
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {formation.title}
                                  </h3>
                                  <p className="text-gray-600 mb-3">
                                    {formation.organisme || "Organisme"}
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
                                      {formation.rating || "4.5"}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                      ({formation.reviews || 0} avis)
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
                                    {formation.currentParticipants || 0}/{formation.maxParticipants || 10} places
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-[#556B2F]" />
                                  <span className="text-sm">
                                    Début : {formation.startDate ? new Date(formation.startDate).toLocaleDateString('fr-FR') : "À définir"}
                                  </span>
                                </div>
                              </div>

                              {formation.program && formation.program.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {formation.program.slice(0, 3).map((feature, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="bg-gray-100"
                                    >
                                      {feature}
                                    </Badge>
                                  ))}
                                  {formation.program.length > 3 && (
                                    <Badge variant="outline" className="text-gray-500">
                                      +{formation.program.length - 3} autres
                                    </Badge>
                                  )}
                                </div>
                              )}

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Award className="h-4 w-4 text-[#6B8E23]" />
                                  <span className="text-sm font-medium">
                                    {formation.certification || "Certification incluse"}
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
                                          {formation.organisme || "Organisme"} •{" "}
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
                                        {formation.requirements && (
                                          <div>
                                            <h4 className="font-semibold text-[#8B4513] mb-2">
                                              Pré-requis
                                            </h4>
                                            <p className="text-gray-700">
                                              {formation.requirements}
                                            </p>
                                          </div>
                                        )}
                                        {formation.program && formation.program.length > 0 && (
                                          <div>
                                            <h4 className="font-semibold text-[#8B4513] mb-2">
                                              Programme
                                            </h4>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                              {formation.program.map(
                                                (item, idx) => (
                                                  <li key={idx}>{item}</li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                        <div>
                                          <h4 className="font-semibold text-[#8B4513] mb-2">
                                            Informations pratiques
                                          </h4>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm text-gray-600">Durée</p>
                                              <p className="font-medium">{formation.duration}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-600">Format</p>
                                              <p className="font-medium">{formation.format}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-600">Prix</p>
                                              <p className="font-medium">{formation.price}€</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-600">Statut</p>
                                              <Badge className={
                                                formation.status === 'active' ? 'bg-green-100 text-green-800' :
                                                formation.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                'bg-yellow-100 text-yellow-800'
                                              }>
                                                {formation.status === 'active' ? 'Active' : 
                                                 formation.status === 'draft' ? 'Brouillon' : 'Archivée'}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </SheetContent>
                                  </Sheet>
                                  <Button
                                    className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
                                    onClick={() => handleInscription(formation)}
                                    disabled={appliedItems.includes(`formations-${formation.id}`)}
                                  >
                                    {appliedItems.includes(`formations-${formation.id}`) 
                                      ? "Déjà inscrit" 
                                      : "S'inscrire"}
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

      {/* Dialog d'inscription */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedFormation
                ? `Inscription : ${selectedFormation.title}`
                : "Demande d'information"}
            </DialogTitle>
            <DialogDescription>
              {selectedFormation
                ? "Postulez à cette formation en remplissant le formulaire ci-dessous."
                : "Un conseiller vous recontactera sous 24h pour répondre à vos questions."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFormation ? (
            <form onSubmit={handleApplyToFormation}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Lettre de motivation *</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Pourquoi souhaitez-vous suivre cette formation ?..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cv">CV (optionnel)</Label>
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUploadEnhanced} // Utiliser la nouvelle fonction
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Formats acceptés : PDF, DOC, DOCX (max 5MB)
                  </p>
                  {cvFile && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg mt-2">
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
                  {userCVUrl && !cvFile && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg mt-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">CV déjà téléchargé dans votre profil</span>
                    </div>
                  )}
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
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Postuler"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormationsSection;