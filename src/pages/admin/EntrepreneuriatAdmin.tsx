// pages/admin/EntrepreneuriatAdmin.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlayCircle,
  FileText,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Download,
  Users,
  Clock,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  BarChart3,
  User,
  Building,
  Briefcase,
  CheckCircle,
  XCircle,
  MoreVertical,
  Upload,
  Link,
  Tag,
  Copy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import EntrepreneuriatService from "@/services/entrepreneuriatService";
import UploadService from "@/services/uploadService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Interview {
  id: string;
  title: string;
  slug: string;
  description: string;
  guest: string;
  role: string;
  company: string;
  duration: string;
  date: string;
  tags: string[];
  category: string;
  imageUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  views: number;
  listens: number;
  shares: number;
  likes: number;
  createdAt: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "template" | "tool" | "checklist";
  category: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  downloads: number;
  isFree: boolean;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  format: "webinar" | "workshop" | "networking" | "conference";
  date: string;
  time: string;
  duration?: string;
  speakers: string[];
  registered: number;
  maxParticipants?: number;
  isRegistrationOpen: boolean;
  location?: string;
  onlineLink?: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
  createdAt: string;
}

interface Stats {
  totalInterviews: number;
  totalResources: number;
  totalEvents: number;
  totalDownloads: number;
  recentInteractions: Array<{
    id: string;
    action: string;
    createdAt: string;
    interview?: {
      title: string;
    };
    user?: {
      email: string;
    };
  }>;
}

const EntrepreneuriatAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("interviews");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  // Données
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Modals
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Form states
  const [interviewForm, setInterviewForm] = useState({
    title: "",
    slug: "",
    description: "",
    guest: "",
    role: "",
    company: "",
    duration: "",
    date: format(new Date(), "yyyy-MM-dd"),
    tags: [] as string[],
    category: "jeunes",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    status: "draft" as "draft" | "published" | "archived",
    isFeatured: false,
  });

  // File selection states
  const [selectedInterviewFile, setSelectedInterviewFile] = useState<File | null>(null);
  const [selectedResourceFile, setSelectedResourceFile] = useState<File | null>(null);

  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    type: "guide" as "guide" | "template" | "tool" | "checklist",
    category: "financement",
    fileUrl: "",
    isFree: true,
    status: "draft" as "draft" | "published" | "archived",
    isFeatured: false,
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    format: "webinar" as "webinar" | "workshop" | "networking" | "conference",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "18:30",
    duration: "2h",
    speakers: [] as string[],
    maxParticipants: 100,
    isRegistrationOpen: true,
    location: "",
    onlineLink: "",
    status: "upcoming" as "upcoming" | "live" | "completed" | "cancelled",
  });

  // Upload states
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (activeTab === "interviews") {
        const response = await EntrepreneuriatService.getInterviews({});
        setInterviews(response.data);
        console.log(response.data);
      } else if (activeTab === "resources") {
        const response = await EntrepreneuriatService.getResources({});
        setResources(response.data);
      } else if (activeTab === "events") {
        const response = await EntrepreneuriatService.getEvents({});
        setEvents(response.data);
      }

      // Charger les statistiques
      const statsResponse = await EntrepreneuriatService.getStats();
      
      // Mapper correctement les données - vérifier si c'est nested dans .data
      if (statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        setStats(statsResponse);
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Gestion des interviews
  const handleCreateInterview = async () => {
    try {
      setIsSubmitting(true);
      let imageUrl = interviewForm.imageUrl;

      if (selectedInterviewFile) {
        try {
          const result = await UploadService.uploadInterviewImage(selectedInterviewFile);
          if (result.data && result.data.url) {
            imageUrl = result.data.url;
          } else {
            throw new Error("URL d'upload invalide");
          }
        } catch (uploadError) {
          console.error("Erreur upload image interview:", uploadError);
          toast({
            title: "Erreur upload",
            description: "L'image n'a pas pu être uploadée correctement",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // ✅ CORRECTION: Convertir la date au format ISO-8601
      const interviewData = {
        ...interviewForm,
        imageUrl,
        date: new Date(interviewForm.date).toISOString(), // Convertir en DateTime ISO
      };

      await EntrepreneuriatService.createInterview(interviewData);
      toast({
        title: "Succès",
        description: "Interview créée avec succès",
      });
      setShowInterviewModal(false);
      resetInterviewForm();
      loadData();
    } catch (error) {
      console.error("Erreur création interview:", error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de créer l'interview",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateInterview = async () => {
    try {
      setIsSubmitting(true);
      let imageUrl = interviewForm.imageUrl;

      if (selectedInterviewFile) {
        try {
          const result = await UploadService.uploadInterviewImage(selectedInterviewFile);
          if (result.data && result.data.url) {
            imageUrl = result.data.url;
          } else {
            throw new Error("URL d'upload invalide");
          }
        } catch (uploadError) {
          console.error("Erreur upload image interview:", uploadError);
          toast({
            title: "Erreur upload",
            description: "L'image n'a pas pu être uploadée correctement",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // ✅ CORRECTION: Convertir la date au format ISO-8601
      const interviewData = {
        ...interviewForm,
        imageUrl,
        date: new Date(interviewForm.date).toISOString(), // Convertir en DateTime ISO
      };

      await EntrepreneuriatService.updateInterview(selectedItem.id, interviewData);
      toast({
        title: "Succès",
        description: "Interview mise à jour avec succès",
      });
      setShowInterviewModal(false);
      resetInterviewForm();
      loadData();
    } catch (error) {
      console.error("Erreur mise à jour interview:", error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de mettre à jour l'interview",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInterview = async () => {
    try {
      await EntrepreneuriatService.deleteInterview(selectedItem.id);
      toast({
        title: "Succès",
        description: "Interview supprimée avec succès",
      });
      setShowDeleteModal(false);
      loadData();
    } catch (error) {
      console.error("Erreur suppression interview:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'interview",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async () => {
    try {
      await EntrepreneuriatService.deleteResource(selectedItem.id);
      toast({
        title: "Succès",
        description: "Ressource supprimée avec succès",
      });
      setShowDeleteModal(false);
      loadData();
    } catch (error) {
      console.error("Erreur suppression ressource:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la ressource",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await EntrepreneuriatService.deleteEvent(selectedItem.id);
      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
      });
      setShowDeleteModal(false);
      loadData();
    } catch (error) {
      console.error("Erreur suppression événement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (interview: Interview) => {
    try {
      await EntrepreneuriatService.updateInterview(interview.id, {
        isFeatured: !interview.isFeatured,
      });
      toast({
        title: "Succès",
        description: interview.isFeatured
          ? "Interview retirée des favoris"
          : "Interview mise en avant",
      });
      loadData();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
    }
  };

  const handleToggleStatus = async (interview: Interview) => {
    const newStatus = interview.status === "published" ? "draft" : "published";
    try {
      await EntrepreneuriatService.updateInterview(interview.id, {
        status: newStatus,
      });
      toast({
        title: "Succès",
        description: `Interview ${
          newStatus === "published" ? "publiée" : "désactivée"
        }`,
      });
      loadData();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
    }
  };

  const resetInterviewForm = () => {
    setInterviewForm({
      title: "",
      slug: "",
      description: "",
      guest: "",
      role: "",
      company: "",
      duration: "",
      date: format(new Date(), "yyyy-MM-dd"),
      tags: [],
      category: "jeunes",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      status: "draft",
      isFeatured: false,
    });
    setSelectedInterviewFile(null);
    setPreviewImage("");
  };

  const openEditInterview = (interview: Interview) => {
    setSelectedItem(interview);
    setInterviewForm({
      title: interview.title,
      slug: interview.slug,
      description: interview.description,
      guest: interview.guest,
      role: interview.role,
      company: interview.company,
      duration: interview.duration,
      date: format(new Date(interview.date), "yyyy-MM-dd"),
      tags: interview.tags,
      category: interview.category,
      imageUrl: interview.imageUrl,
      videoUrl: interview.videoUrl || "",
      audioUrl: interview.audioUrl || "",
      status: interview.status,
      isFeatured: interview.isFeatured,
    });
    setPreviewImage(interview.imageUrl);
    setSelectedInterviewFile(null);
    setModalMode("edit");
    setShowInterviewModal(true);
  };

  // Filtrage des données
  const filteredInterviews = interviews.filter((interview) => {
    if (
      searchTerm &&
      !interview.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !interview.guest.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "all" && interview.status !== statusFilter) {
      return false;
    }
    if (categoryFilter !== "all" && interview.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const filteredResources = resources.filter((resource) => {
    if (
      searchTerm &&
      !resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "all" && resource.status !== statusFilter) {
      return false;
    }
    if (categoryFilter !== "all" && resource.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const filteredEvents = events.filter((event) => {
    if (
      searchTerm &&
      !event.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "all" && event.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Gestion de la sélection d'image interview
  const handleInterviewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedInterviewFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Gestion de la sélection de fichier ressource
  const handleResourceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedResourceFile(file);
  };

  const resetResourceForm = () => {
    setResourceForm({
      title: "",
      description: "",
      type: "guide",
      category: "financement",
      fileUrl: "",
      isFree: true,
      status: "draft",
      isFeatured: false,
    });
    setSelectedResourceFile(null);
  };

  const handleCreateResource = async () => {
    try {
      setIsSubmitting(true);
      let fileUrl = resourceForm.fileUrl;

      if (selectedResourceFile) {
        const result = await UploadService.uploadResourceFile(selectedResourceFile);
        fileUrl = result.data.url;
      }

      await EntrepreneuriatService.createResource({ ...resourceForm, fileUrl });
      toast({ title: "Succès", description: "Ressource créée avec succès" });
      setShowResourceModal(false);
      resetResourceForm();
      loadData();
    } catch (error) {
      console.error("Erreur création ressource:", error);
      toast({ title: "Erreur", description: "Impossible de créer la ressource", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateResource = async () => {
    try {
      setIsSubmitting(true);
      let fileUrl = resourceForm.fileUrl;

      if (selectedResourceFile) {
        const result = await UploadService.uploadResourceFile(selectedResourceFile);
        fileUrl = result.data.url;
      }

      await EntrepreneuriatService.updateResource(selectedItem.id, { ...resourceForm, fileUrl });
      toast({ title: "Succès", description: "Ressource mise à jour avec succès" });
      setShowResourceModal(false);
      resetResourceForm();
      loadData();
    } catch (error) {
      console.error("Erreur mise à jour ressource:", error);
      toast({ title: "Erreur", description: "Impossible de mettre à jour la ressource", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      format: "webinar",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "18:30",
      duration: "2h",
      speakers: [],
      maxParticipants: 100,
      isRegistrationOpen: true,
      location: "",
      onlineLink: "",
      status: "upcoming",
    });
  };

  const handleCreateEvent = async () => {
    try {
      setIsSubmitting(true);

      // ✅ CORRECTION: Convertir la date au format ISO-8601
      const eventData = {
        ...eventForm,
        date: new Date(eventForm.date).toISOString(), // Convertir en DateTime ISO
      };

      await EntrepreneuriatService.createEvent(eventData);
      toast({ title: "Succès", description: "Événement créé avec succès" });
      setShowEventModal(false);
      resetEventForm();
      loadData();
    } catch (error) {
      console.error("Erreur création événement:", error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de créer l'événement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      setIsSubmitting(true);

      // ✅ CORRECTION: Convertir la date au format ISO-8601
      const eventData = {
        ...eventForm,
        date: new Date(eventForm.date).toISOString(), // Convertir en DateTime ISO
      };

      await EntrepreneuriatService.updateEvent(selectedItem.id, eventData);
      toast({ title: "Succès", description: "Événement mis à jour avec succès" });
      setShowEventModal(false);
      resetEventForm();
      loadData();
    } catch (error) {
      console.error("Erreur mise à jour événement:", error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de mettre à jour l'événement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#556B2F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Administration Entrepreneuriat
              </h1>
              <p className="text-gray-600">
                Gérez les interviews, ressources et événements
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
            >
              Retour au dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Statistiques */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Interviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalInterviews || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <PlayCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Ressources
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalResources || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Événements
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalEvents || 0}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Téléchargements
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalDownloads || 0}
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Download className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="jeunes">Jeunes</SelectItem>
                <SelectItem value="experimentes">Expérimentés</SelectItem>
                <SelectItem value="politiques">Politiques</SelectItem>
                <SelectItem value="success">Success stories</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Tabs et contenu */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Contenu Entrepreneuriat</CardTitle>
                <CardDescription>
                  Gérez tout le contenu de la section entrepreneuriat
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  if (activeTab === "interviews") {
                    setModalMode("create");
                    setShowInterviewModal(true);
                  } else if (activeTab === "resources") {
                    setModalMode("create");
                    setShowResourceModal(true);
                  } else if (activeTab === "events") {
                    setModalMode("create");
                    setShowEventModal(true);
                  }
                }}
                className="bg-[#556B2F] hover:bg-[#556B2F]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="interviews">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Interviews ({interviews.length})
                </TabsTrigger>
                <TabsTrigger value="resources">
                  <FileText className="w-4 h-4 mr-2" />
                  Ressources ({resources.length})
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="w-4 h-4 mr-2" />
                  Événements ({events.length})
                </TabsTrigger>
              </TabsList>

              {/* Interviews Tab */}
              <TabsContent value="interviews" className="space-y-4">
                {filteredInterviews.length === 0 ? (
                  <div className="text-center py-12">
                    <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Aucune interview trouvée
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      categoryFilter !== "all"
                        ? "Aucun résultat pour les filtres sélectionnés"
                        : "Commencez par créer votre première interview"}
                    </p>
                    <Button
                      onClick={() => {
                        setModalMode("create");
                        setShowInterviewModal(true);
                      }}
                      className="bg-[#556B2F] hover:bg-[#556B2F]/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une interview
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInterviews.map((interview) => (
                      <Card key={interview.id} className="flex flex-col">
                        <CardContent className="pt-4 pb-0 flex-1">
                          <div className="flex gap-3 mb-4">
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              {interview.imageUrl && (
                                <img
                                  src={interview.imageUrl}
                                  alt={interview.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm line-clamp-2">
                                {interview.title}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {interview.duration}
                              </p>
                            </div>
                            {interview.isFeatured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500">Invité</p>
                              <p className="font-medium text-sm">
                                {interview.guest}
                              </p>
                              <p className="text-xs text-gray-500">
                                {interview.company}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  interview.category === "jeunes"
                                    ? "border-blue-500 text-blue-500"
                                    : interview.category === "experimentes"
                                    ? "border-green-500 text-green-500"
                                    : interview.category === "politiques"
                                    ? "border-purple-500 text-purple-500"
                                    : "border-amber-500 text-amber-500"
                                }
                              >
                                {interview.category === "jeunes" && "Jeunes"}
                                {interview.category === "experimentes" &&
                                  "Expérimentés"}
                                {interview.category === "politiques" &&
                                  "Politiques"}
                                {interview.category === "success" &&
                                  "Success story"}
                              </Badge>

                              <Badge
                                variant={
                                  interview.status === "published"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  interview.status === "published"
                                    ? "bg-green-100 text-green-800 border-0"
                                    : interview.status === "draft"
                                    ? "bg-yellow-100 text-yellow-800 border-0"
                                    : "bg-gray-100 text-gray-800 border-0"
                                }
                              >
                                {interview.status === "published" && "Publié"}
                                {interview.status === "draft" && "Brouillon"}
                                {interview.status === "archived" && "Archivé"}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600 pt-2">
                              <Eye className="w-3 h-3" />
                              <span>{interview.views} vues</span>
                              <span className="text-gray-400">•</span>
                              <span>
                                {format(
                                  new Date(interview.createdAt),
                                  "dd MMM yyyy",
                                  { locale: fr }
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>

                        <div className="pt-4 px-4 pb-4 border-t">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full">
                                <MoreVertical className="w-4 h-4 mr-2" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/entrepreneuriat/interview/${interview.slug}`
                                  )
                                }
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditInterview(interview)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Éditer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggleFeatured(interview)
                                }
                              >
                                {interview.isFeatured ? (
                                  <>
                                    <StarOff className="w-4 h-4 mr-2" />
                                    Retirer des favoris
                                  </>
                                ) : (
                                  <>
                                    <Star className="w-4 h-4 mr-2" />
                                    Mettre en avant
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggleStatus(interview)
                                }
                              >
                                {interview.status === "published" ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Désactiver
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Publier
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(interview);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-4">
                {filteredResources.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Aucune ressource trouvée
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      categoryFilter !== "all"
                        ? "Aucun résultat pour les filtres sélectionnés"
                        : "Commencez par créer votre première ressource"}
                    </p>
                    <Button
                      onClick={() => {
                        setModalMode("create");
                        setShowResourceModal(true);
                      }}
                      className="bg-[#556B2F] hover:bg-[#556B2F]/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une ressource
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map((resource) => (
                      <Card key={resource.id} className="flex flex-col">
                        <CardContent className="pt-4 pb-0 flex-1">
                          <div className="mb-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                                {resource.title}
                              </h3>
                              {resource.isFeatured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {resource.description}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  resource.type === "guide"
                                    ? "border-blue-500 text-blue-500"
                                    : resource.type === "template"
                                    ? "border-green-500 text-green-500"
                                    : resource.type === "tool"
                                    ? "border-purple-500 text-purple-500"
                                    : "border-amber-500 text-amber-500"
                                }
                              >
                                {resource.type === "guide" && "Guide"}
                                {resource.type === "template" && "Template"}
                                {resource.type === "tool" && "Outil"}
                                {resource.type === "checklist" && "Checklist"}
                              </Badge>

                              <Badge variant="secondary" className="text-xs">
                                {resource.category}
                              </Badge>

                              {resource.isFree ? (
                                <Badge className="bg-green-100 text-green-800 border-0">
                                  Gratuit
                                </Badge>
                              ) : (
                                <Badge variant="outline">Payant</Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Download className="w-3 h-3" />
                              <span>{resource.downloads} téléchargements</span>
                            </div>

                            <div className="text-xs text-gray-500">
                              {format(
                                new Date(resource.createdAt),
                                "dd MMM yyyy",
                                { locale: fr }
                              )}
                            </div>

                            <div
                              className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                                resource.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : resource.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                              <span>
                                {resource.status === "published" && "Publié"}
                                {resource.status === "draft" && "Brouillon"}
                                {resource.status === "archived" && "Archivé"}
                              </span>
                            </div>
                          </div>
                        </CardContent>

                        <div className="pt-4 px-4 pb-4 border-t">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full">
                                <MoreVertical className="w-4 h-4 mr-2" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={async () => {
                                  try {
                                    const downloadData =
                                      await EntrepreneuriatService.downloadResource(
                                        resource.id
                                      );
                                    const link =
                                      document.createElement("a");
                                    link.href =
                                      downloadData.data.downloadUrl;
                                    link.download =
                                      downloadData.data.fileName;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  } catch (error) {
                                    console.error(
                                      "Erreur téléchargement:",
                                      error
                                    );
                                  }
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(resource);
                                  setResourceForm({
                                    title: resource.title,
                                    description: resource.description,
                                    type: resource.type,
                                    category: resource.category,
                                    fileUrl: resource.fileUrl,
                                    isFree: resource.isFree,
                                    status: resource.status,
                                    isFeatured: resource.isFeatured,
                                  });
                                  setModalMode("edit");
                                  setShowResourceModal(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Éditer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(resource);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Aucun événement trouvé
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || statusFilter !== "all"
                        ? "Aucun résultat pour les filtres sélectionnés"
                        : "Commencez par créer votre premier événement"}
                    </p>
                    <Button
                      onClick={() => {
                        setModalMode("create");
                        setShowEventModal(true);
                      }}
                      className="bg-[#556B2F] hover:bg-[#556B2F]/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un événement
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredEvents.map((event) => (
                      <Card key={event.id} className="flex flex-col">
                        <CardContent className="pt-4 pb-0 flex-1">
                          <div className="mb-4">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                              {event.title}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {event.description}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  event.format === "webinar"
                                    ? "border-blue-500 text-blue-500"
                                    : event.format === "workshop"
                                    ? "border-green-500 text-green-500"
                                    : event.format === "networking"
                                    ? "border-purple-500 text-purple-500"
                                    : "border-amber-500 text-amber-500"
                                }
                              >
                                {event.format === "webinar" && "Webinaire"}
                                {event.format === "workshop" && "Atelier"}
                                {event.format === "networking" && "Networking"}
                                {event.format === "conference" && "Conférence"}
                              </Badge>

                              {event.isRegistrationOpen ? (
                                <Badge className="bg-green-100 text-green-800 border-0">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Ouvertes
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-gray-600"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Fermées
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-gray-500">Date & Heure</p>
                                <p className="font-medium">
                                  {format(
                                    new Date(event.date),
                                    "dd MMM",
                                    { locale: fr }
                                  )}
                                </p>
                                <p className="text-gray-600">{event.time}</p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-gray-500">Participants</p>
                                <p className="font-medium flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {event.registered}
                                  {event.maxParticipants &&
                                    `/${event.maxParticipants}`}
                                </p>
                              </div>
                            </div>

                            {event.speakers && event.speakers.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Intervenants
                                </p>
                                <p className="text-xs font-medium">
                                  {event.speakers.join(", ")}
                                </p>
                              </div>
                            )}

                            <div
                              className={`flex items-center gap-2 px-2 py-1 rounded text-xs w-fit ${
                                event.status === "upcoming"
                                  ? "bg-blue-100 text-blue-800"
                                  : event.status === "live"
                                  ? "bg-green-100 text-green-800"
                                  : event.status === "completed"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                              <span>
                                {event.status === "upcoming" && "À venir"}
                                {event.status === "live" && "En direct"}
                                {event.status === "completed" && "Terminé"}
                                {event.status === "cancelled" && "Annulé"}
                              </span>
                            </div>
                          </div>
                        </CardContent>

                        <div className="pt-4 px-4 pb-4 border-t">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full">
                                <MoreVertical className="w-4 h-4 mr-2" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    event.onlineLink || "#",
                                    "_blank"
                                  )
                                }
                              >
                                <Link className="w-4 h-4 mr-2" />
                                Voir le lien
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(event);
                                  setEventForm({
                                    title: event.title,
                                    description: event.description,
                                    format: event.format,
                                    date: format(
                                      new Date(event.date),
                                      "yyyy-MM-dd"
                                    ),
                                    time: event.time,
                                    duration: event.duration || "2h",
                                    speakers: event.speakers,
                                    maxParticipants:
                                      event.maxParticipants || 100,
                                    isRegistrationOpen:
                                      event.isRegistrationOpen,
                                    location: event.location || "",
                                    onlineLink: event.onlineLink || "",
                                    status: event.status,
                                  });
                                  setModalMode("edit");
                                  setShowEventModal(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Éditer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async () => {
                                  try {
                                    await EntrepreneuriatService.registerToEvent(
                                      event.id
                                    );
                                    toast({
                                      title: "Succès",
                                      description:
                                        "Inscription enregistrée (test admin)",
                                    });
                                    loadData();
                                  } catch (error) {
                                    console.error(
                                      "Erreur inscription:",
                                      error
                                    );
                                  }
                                }}
                              >
                                <Users className="w-4 h-4 mr-2" />
                                Tester l'inscription
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(event);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Analytics */}
        {stats?.recentInteractions && stats.recentInteractions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Interactions récentes</CardTitle>
              <CardDescription>
                Dernières interactions des utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentInteractions.slice(0, 10).map((interaction) => (
                  <div
                    key={interaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded">
                        {interaction.action === "view" && (
                          <Eye className="w-4 h-4 text-blue-600" />
                        )}
                        {interaction.action === "listen" && (
                          <PlayCircle className="w-4 h-4 text-green-600" />
                        )}
                        {interaction.action === "like" && (
                          <Star className="w-4 h-4 text-yellow-600" />
                        )}
                        {interaction.action === "share" && (
                          <Share2 className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {interaction.action === "view" && "Vue"}
                          {interaction.action === "listen" && "Écoute"}
                          {interaction.action === "like" && "Like"}
                          {interaction.action === "share" && "Partage"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {interaction.interview?.title}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {interaction.user?.email || "Visiteur anonyme"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(
                          new Date(interaction.createdAt),
                          "dd MMM HH:mm",
                          {
                            locale: fr,
                          }
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal Interview */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create"
                ? "Créer une interview"
                : "Éditer l'interview"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de l'interview
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={interviewForm.title}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="Titre de l'interview"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={interviewForm.slug}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, slug: e.target.value })
                  }
                  placeholder="url-de-l-interview"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={interviewForm.description}
                onChange={(e) =>
                  setInterviewForm({
                    ...interviewForm,
                    description: e.target.value,
                  })
                }
                placeholder="Description courte"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest">Invité *</Label>
                <Input
                  id="guest"
                  value={interviewForm.guest}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      guest: e.target.value,
                    })
                  }
                  placeholder="Nom de l'invité"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Input
                  id="role"
                  value={interviewForm.role}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, role: e.target.value })
                  }
                  placeholder="Rôle/Fonction"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise *</Label>
                <Input
                  id="company"
                  value={interviewForm.company}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      company: e.target.value,
                    })
                  }
                  placeholder="Nom de l'entreprise"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durée *</Label>
                <Input
                  id="duration"
                  value={interviewForm.duration}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      duration: e.target.value,
                    })
                  }
                  placeholder="ex: 45 min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={interviewForm.category}
                  onValueChange={(value) =>
                    setInterviewForm({ ...interviewForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jeunes">Jeunes entrepreneurs</SelectItem>
                    <SelectItem value="experimentes">
                      Patrons expérimentés
                    </SelectItem>
                    <SelectItem value="politiques">Politiques</SelectItem>
                    <SelectItem value="success">Success stories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l'image *</Label>
              <Input
                id="imageUrl"
                value={interviewForm.imageUrl}
                onChange={(e) =>
                  setInterviewForm({
                    ...interviewForm,
                    imageUrl: e.target.value,
                  })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL vidéo (optionnel)</Label>
                <Input
                  id="videoUrl"
                  value={interviewForm.videoUrl}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      videoUrl: e.target.value,
                    })
                  }
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audioUrl">URL audio (optionnel)</Label>
                <Input
                  id="audioUrl"
                  value={interviewForm.audioUrl}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      audioUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                value={interviewForm.tags.join(", ")}
                onChange={(e) =>
                  setInterviewForm({
                    ...interviewForm,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0),
                  })
                }
                placeholder="startup, tech, croissance"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={interviewForm.status}
                  onValueChange={(value: any) =>
                    setInterviewForm({ ...interviewForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date de publication</Label>
                <Input
                  id="date"
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={interviewForm.isFeatured}
                onCheckedChange={(checked) =>
                  setInterviewForm({ ...interviewForm, isFeatured: checked })
                }
              />
              <Label htmlFor="isFeatured">Mettre en avant</Label>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image de l'interview *</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {selectedInterviewFile ? (
                          <p className="text-sm text-green-600 font-medium">{selectedInterviewFile.name}</p>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Cliquez pour uploader</p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleInterviewImageSelect}
                      />
                    </label>
                  </div>
                </div>
                {previewImage && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInterviewModal(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={
                modalMode === "create"
                  ? handleCreateInterview
                  : handleUpdateInterview
              }
              disabled={isSubmitting}
              className="bg-[#556B2F] hover:bg-[#556B2F]/90"
            >
              {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>}
              {modalMode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Resource */}
      <Dialog open={showResourceModal} onOpenChange={setShowResourceModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create"
                ? "Créer une ressource"
                : "Éditer la ressource"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resource-title">Titre *</Label>
              <Input
                id="resource-title"
                value={resourceForm.title}
                onChange={(e) =>
                  setResourceForm({ ...resourceForm, title: e.target.value })
                }
                placeholder="Titre de la ressource"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-description">Description *</Label>
              <Textarea
                id="resource-description"
                value={resourceForm.description}
                onChange={(e) =>
                  setResourceForm({
                    ...resourceForm,
                    description: e.target.value,
                  })
                }
                placeholder="Description de la ressource"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resource-type">Type *</Label>
                <Select
                  value={resourceForm.type}
                  onValueChange={(value: any) =>
                    setResourceForm({ ...resourceForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="tool">Outil</SelectItem>
                    <SelectItem value="checklist">Checklist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-category">Catégorie *</Label>
                <Input
                  id="resource-category"
                  value={resourceForm.category}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      category: e.target.value,
                    })
                  }
                  placeholder="ex: financement, marketing"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-fileUrl">URL du fichier *</Label>
              <Input
                id="resource-fileUrl"
                value={resourceForm.fileUrl}
                onChange={(e) =>
                  setResourceForm({ ...resourceForm, fileUrl: e.target.value })
                }
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="resource-isFree"
                  checked={resourceForm.isFree}
                  onCheckedChange={(checked) =>
                    setResourceForm({ ...resourceForm, isFree: checked })
                  }
                />
                <Label htmlFor="resource-isFree">Ressource gratuite</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-status">Statut</Label>
                <Select
                  value={resourceForm.status}
                  onValueChange={(value: any) =>
                    setResourceForm({ ...resourceForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="resource-isFeatured"
                checked={resourceForm.isFeatured}
                onCheckedChange={(checked) =>
                  setResourceForm({ ...resourceForm, isFeatured: checked })
                }
              />
              <Label htmlFor="resource-isFeatured">Mettre en avant</Label>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Fichier de la ressource *</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {selectedResourceFile ? (
                      <>
                        <FileText className="w-6 h-6 text-green-500 mb-2" />
                        <p className="text-sm text-green-600">{selectedResourceFile.name}</p>
                      </>
                    ) : resourceForm.fileUrl ? (
                      <>
                        <FileText className="w-6 h-6 text-green-500 mb-2" />
                        <p className="text-sm text-green-600">Fichier actuel présent</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Cliquez pour uploader</p>
                        <p className="text-xs text-gray-500">PDF, DOC, XLS, etc</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleResourceFileSelect}
                  />
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResourceModal(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={modalMode === "create" ? handleCreateResource : handleUpdateResource}
              disabled={isSubmitting}
              className="bg-[#556B2F] hover:bg-[#556B2F]/90"
            >
              {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>}
              {modalMode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Event */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create"
                ? "Créer un événement"
                : "Éditer l'événement"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Titre *</Label>
              <Input
                id="event-title"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                placeholder="Titre de l'événement"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description *</Label>
              <Textarea
                id="event-description"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                placeholder="Description de l'événement"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-format">Format *</Label>
                <Select
                  value={eventForm.format}
                  onValueChange={(value: any) =>
                    setEventForm({ ...eventForm, format: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webinar">Webinaire</SelectItem>
                    <SelectItem value="workshop">Atelier</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="conference">Conférence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-status">Statut</Label>
                <Select
                  value={eventForm.status}
                  onValueChange={(value: any) =>
                    setEventForm({ ...eventForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">À venir</SelectItem>
                    <SelectItem value="live">En direct</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date *</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Heure *</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-duration">Durée</Label>
                <Input
                  id="event-duration"
                  value={eventForm.duration}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, duration: e.target.value })
                  }
                  placeholder="ex: 2h"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-maxParticipants">Participants max</Label>
                <Input
                  id="event-maxParticipants"
                  type="number"
                  value={eventForm.maxParticipants}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      maxParticipants: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-speakers">
                Intervenants (séparés par des virgules)
              </Label>
              <Input
                id="event-speakers"
                value={eventForm.speakers.join(", ")}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    speakers: e.target.value
                      .split(",")
                      .map((speaker) => speaker.trim())
                      .filter((speaker) => speaker.length > 0),
                  })
                }
                placeholder="Nom 1, Nom 2, ..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-location">Lieu (optionnel)</Label>
                <Input
                  id="event-location"
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, location: e.target.value })
                  }
                  placeholder="Adresse physique"
                />
              </div>
                           <div className="space-y-2">
                <Label htmlFor="event-onlineLink">
                  Lien en ligne (optionnel)
                </Label>
                <Input
                  id="event-onlineLink"
                  value={eventForm.onlineLink}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, onlineLink: e.target.value })
                  }
                  placeholder="https://meet.google.com/..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="event-isRegistrationOpen"
                checked={eventForm.isRegistrationOpen}
                onCheckedChange={(checked) =>
                  setEventForm({ ...eventForm, isRegistrationOpen: checked })
                }
              />
              <Label htmlFor="event-isRegistrationOpen">
                Inscriptions ouvertes
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventModal(false)}>
              Annuler
            </Button>
            <Button 
              
              onClick={modalMode === "create" ? handleCreateEvent : handleUpdateEvent}
              disabled={isSubmitting}
              className="bg-[#556B2F] hover:bg-[#556B2F]/90"
            >
              {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>}
              {modalMode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Delete Confirmation */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedItem?.title}" ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (activeTab === "interviews") {
                  handleDeleteInterview();
                } else if (activeTab === "resources") {
                  handleDeleteResource();
                } else if (activeTab === "events") {
                  handleDeleteEvent();
                }
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EntrepreneuriatAdmin;
