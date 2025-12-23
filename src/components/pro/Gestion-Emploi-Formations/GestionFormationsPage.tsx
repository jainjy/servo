import { useState, useEffect, useCallback } from "react";
import { useFormation } from "@/hooks/useFormation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  Download,
  Upload,
  GraduationCap,
  Calendar,
  Users,
  DollarSign,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Loader2,
} from "lucide-react";

export default function GestionFormationsPage() {
  const {
    formations,
    isLoading,
    error,
    stats,
    pagination,
    fetchFormations,
    fetchStats,
    createFormation,
    updateFormation,
    deleteFormation,
    updateStatus,
    exportCSV,
    changePage
  } = useFormation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    format: "",
    duration: "",
    price: 0,
    maxParticipants: 10,
    certification: "",
    startDate: "",
    endDate: "",
    status: "draft",
    requirements: "",
    program: [""],
    location: "",
    isCertified: false,
    isFinanced: false,
    isOnline: false,
  });

  const categories = [
    "Informatique & Numérique",
    "Management & Leadership",
    "Commerce & Marketing",
    "Bâtiment & Construction",
    "Santé & Bien-être",
    "Comptabilité & Finance",
    "Langues étrangères",
    "Artisanat & Métiers",
  ];

  const formats = [
    "Présentiel",
    "100% en ligne",
    "Hybride",
    "Alternance",
  ];

  const statuses = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "archived", label: "Archivée", color: "bg-yellow-100 text-yellow-800" },
    { value: "completed", label: "Terminée", color: "bg-blue-100 text-blue-800" },
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load data on mount and when filters change
  useEffect(() => {
    loadData();
  }, [debouncedSearch, statusFilter, categoryFilter]);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchFormations({
          search: debouncedSearch,
          status: statusFilter,
          category: categoryFilter,
          page: 1
        }),
        fetchStats()
      ]);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleSearch = useCallback(() => {
    fetchFormations({
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter,
      page: 1
    });
  }, [searchTerm, statusFilter, categoryFilter, fetchFormations]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const handleEdit = (formation) => {
    setEditingFormation(formation);
    setFormData({
      title: formation.title || "",
      description: formation.description || "",
      category: formation.category || "",
      format: formation.format || "",
      duration: formation.duration || "",
      price: formation.price || 0,
      maxParticipants: formation.maxParticipants || 10,
      certification: formation.certification || "",
      startDate: formation.startDate ? formation.startDate.split('T')[0] : "",
      endDate: formation.endDate ? formation.endDate.split('T')[0] : "",
      status: formation.status || "draft",
      requirements: formation.requirements || "",
      program: formation.program || [""],
      location: formation.location || "",
      isCertified: formation.isCertified || false,
      isFinanced: formation.isFinanced || false,
      isOnline: formation.isOnline || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      try {
        await deleteFormation(id);
        toast.success("Formation supprimée avec succès");
      } catch (error) {
        toast.error(error.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Préparer les données pour l'API
      const apiData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        format: formData.format,
        duration: formData.duration,
        price: parseFloat(formData.price),
        maxParticipants: parseInt(formData.maxParticipants),
        certification: formData.certification,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        status: formData.status,
        requirements: formData.requirements,
        program: formData.program.filter(p => p.trim() !== ''),
        location: formData.location,
        isCertified: formData.isCertified,
        isFinanced: formData.isFinanced,
        isOnline: formData.isOnline
      };

      if (editingFormation) {
        await updateFormation(editingFormation.id, apiData);
        toast.success("Formation mise à jour avec succès");
      } else {
        await createFormation(apiData);
        toast.success("Formation créée avec succès");
      }
      
      setIsDialogOpen(false);
      setEditingFormation(null);
      resetForm();
      
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      format: "",
      duration: "",
      price: 0,
      maxParticipants: 10,
      certification: "",
      startDate: "",
      endDate: "",
      status: "draft",
      requirements: "",
      program: [""],
      location: "",
      isCertified: false,
      isFinanced: false,
      isOnline: false,
    });
  };

  const handleExportCSV = async () => {
    try {
      toast.info("Export CSV en cours...");
      await exportCSV();
      toast.success("Export CSV terminé");
    } catch (error) {
      toast.error("Erreur lors de l'export CSV");
    }
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => pagination.page > 1 && changePage(pagination.page - 1)}
              className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            let pageNum;
            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => changePage(pageNum)}
                  isActive={pageNum === pagination.page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => pagination.page < pagination.pages && changePage(pagination.page + 1)}
              className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#556B2F] mb-2">
          Gestion des Formations
        </h1>
        <p className="text-gray-600">
          Gérez vos offres de formation, suivez les inscriptions et les statistiques
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Formations</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-[#6B8E23]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Candidatures</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.applications}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.participants}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une formation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResetFilters}>
                Réinitialiser
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingFormation(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410]">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle formation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingFormation ? 'Modifier la formation' : 'Nouvelle formation'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingFormation 
                        ? 'Modifiez les informations de votre formation'
                        : 'Créez une nouvelle offre de formation'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Titre *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Catégorie *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({...formData, category: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="format">Format *</Label>
                          <Select
                            value={formData.format}
                            onValueChange={(value) => setFormData({...formData, format: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un format" />
                            </SelectTrigger>
                            <SelectContent>
                              {formats.map((format) => (
                                <SelectItem key={format} value={format}>{format}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Durée *</Label>
                          <Input
                            id="duration"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            placeholder="ex: 6 mois"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Prix (€) *</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxParticipants">Participants max *</Label>
                          <Input
                            id="maxParticipants"
                            type="number"
                            value={formData.maxParticipants}
                            onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                            required
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Date de début *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Lieu</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="Pour les formations présentielles"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Date de fin</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certification">Certification</Label>
                          <Input
                            id="certification"
                            value={formData.certification}
                            onChange={(e) => setFormData({...formData, certification: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="requirements">Prérequis</Label>
                        <Textarea
                          id="requirements"
                          value={formData.requirements}
                          onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="program">Programme (un point par ligne)</Label>
                        <Textarea
                          id="program"
                          value={formData.program.join('\n')}
                          onChange={(e) => setFormData({...formData, program: e.target.value.split('\n')})}
                          rows={3}
                          placeholder="Module 1: Introduction
Module 2: Développement
Module 3: Projet pratique"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isCertified"
                            checked={formData.isCertified}
                            onCheckedChange={(checked) => setFormData({...formData, isCertified: checked})}
                          />
                          <Label htmlFor="isCertified">Certifiée</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isFinanced"
                            checked={formData.isFinanced}
                            onCheckedChange={(checked) => setFormData({...formData, isFinanced: checked})}
                          />
                          <Label htmlFor="isFinanced">Financement possible</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isOnline"
                            checked={formData.isOnline}
                            onCheckedChange={(checked) => setFormData({...formData, isOnline: checked})}
                          />
                          <Label htmlFor="isOnline">En ligne</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Statut</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({...formData, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingFormation(null);
                          resetForm();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-[#556B2F] hover:bg-[#6B8E23]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingFormation ? 'Mettre à jour' : 'Créer'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des formations</CardTitle>
          <CardDescription>
            {formations.length} formation{formations.length !== 1 ? 's' : ''} trouvée{formations.length !== 1 ? 's' : ''}
            {pagination.total > 0 && ` (${pagination.total} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#556B2F] mb-4" />
              <p>Chargement des formations...</p>
            </div>
          ) : formations.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? "Aucune formation ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore créé de formations."
                }
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410]">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre première formation
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date début</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formations.map((formation) => {
                    const status = statuses.find(s => s.value === formation.status);
                    return (
                      <TableRow key={formation.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <div>
                              <div>{formation.title}</div>
                              {formation.isCertified && (
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                  <Award className="h-3 w-3" /> Certifiée
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formation.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{formation.format}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formation.duration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formation.price}€
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>
                              {formation.currentParticipants || 0}/{formation.maxParticipants}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({formation.applications_count || 0} candidatures)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={status?.color}>
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formation.startDate ? formation.startDate.split('T')[0] : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(formation)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {/* View applications */}}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir candidatures ({formation.applications_count || 0})
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(formation.id, formation.status === 'active' ? 'archived' : 'active')}
                              >
                                {formation.status === 'active' ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Archiver
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activer
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(formation.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}