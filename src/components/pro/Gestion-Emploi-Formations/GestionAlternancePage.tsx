import { useState, useEffect, useCallback } from "react";
import { useAlternance } from "@/hooks/useAlternance";
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
  GraduationCap,
  BookOpen,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Zap,
  Target,
  Loader2,
} from "lucide-react";

export default function GestionAlternancePage() {
  const {
    offres,
    isLoading,
    error,
    stats,
    pagination,
    fetchOffres,
    fetchStats,
    createOffre,
    updateOffre,
    deleteOffre,
    updateStatus,
    exportCSV,
    changePage
  } = useAlternance();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffre, setEditingOffre] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    niveauEtude: "",
    duree: "",
    remuneration: "",
    location: "",
    dateDebut: "",
    dateFin: "",
    status: "draft",
    missions: [""],
    competences: [""],
    avantages: [""],
    ecolePartenaire: "",
    rythmeAlternance: "",
    pourcentageTemps: "",
    urgent: false,
  });

  const types = [
    "Alternance (Contrat pro)",
    "Alternance (Apprentissage)",
    "Stage conventionné",
    "Stage de fin d'études",
  ];

  const niveauxEtude = [
    "BAC",
    "BAC+2",
    "BAC+3",
    "BAC+4",
    "BAC+5 et plus",
  ];

  const statuses = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "archived", label: "Archivée", color: "bg-yellow-100 text-yellow-800" },
    { value: "filled", label: "Pourvu", color: "bg-blue-100 text-blue-800" },
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
  }, [debouncedSearch, typeFilter, statusFilter]);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchOffres({
          search: debouncedSearch,
          type: typeFilter,
          status: statusFilter,
          page: 1
        }),
        fetchStats()
      ]);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleSearch = useCallback(() => {
    fetchOffres({
      search: searchTerm,
      type: typeFilter,
      status: statusFilter,
      page: 1
    });
  }, [searchTerm, typeFilter, statusFilter, fetchOffres]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const handleEdit = (offre) => {
    setEditingOffre(offre);
    setFormData({
      title: offre.title || "",
      description: offre.description || "",
      type: offre.type || "",
      niveauEtude: offre.niveauEtude || "",
      duree: offre.duree || "",
      remuneration: offre.remuneration || "",
      location: offre.location || "",
      dateDebut: offre.dateDebut ? offre.dateDebut.split('T')[0] : "",
      dateFin: offre.dateFin ? offre.dateFin.split('T')[0] : "",
      status: offre.status || "draft",
      missions: offre.missions || [""],
      competences: offre.competences || [""],
      avantages: offre.avantages || [""],
      ecolePartenaire: offre.ecolePartenaire || "",
      rythmeAlternance: offre.rythmeAlternance || "",
      pourcentageTemps: offre.pourcentageTemps || "",
      urgent: offre.urgent || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      try {
        await deleteOffre(id);
        toast.success("Offre supprimée avec succès");
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
        type: formData.type,
        niveauEtude: formData.niveauEtude,
        duree: formData.duree,
        remuneration: formData.remuneration,
        location: formData.location,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin || null,
        status: formData.status,
        missions: formData.missions.filter(m => m.trim() !== ''),
        competences: formData.competences.filter(c => c.trim() !== ''),
        avantages: formData.avantages.filter(a => a.trim() !== ''),
        ecolePartenaire: formData.ecolePartenaire,
        rythmeAlternance: formData.rythmeAlternance,
        pourcentageTemps: formData.pourcentageTemps,
        urgent: formData.urgent,
      };

      if (editingOffre) {
        await updateOffre(editingOffre.id, apiData);
        toast.success("Offre mise à jour avec succès");
      } else {
        await createOffre(apiData);
        toast.success("Offre créée avec succès");
      }
      
      setIsDialogOpen(false);
      setEditingOffre(null);
      resetForm();
      
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      niveauEtude: "",
      duree: "",
      remuneration: "",
      location: "",
      dateDebut: "",
      dateFin: "",
      status: "draft",
      missions: [""],
      competences: [""],
      avantages: [""],
      ecolePartenaire: "",
      rythmeAlternance: "",
      pourcentageTemps: "",
      urgent: false,
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
          Gestion Alternance/Stages
        </h1>
        <p className="text-gray-600">
          Gérez vos offres d'alternance et de stages pour étudiants
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
                <p className="text-sm text-gray-600">Offres total</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-[#6B8E23]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alternances</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.alternance}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stages</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.stage}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Candidatures</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.candidatures}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
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
                  placeholder="Rechercher une offre..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type d'offre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
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
                  setEditingOffre(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410]">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle offre
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingOffre ? 'Modifier l\'offre' : 'Nouvelle offre alternance/stage'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingOffre 
                        ? 'Modifiez les informations de votre offre'
                        : 'Créez une nouvelle offre d\'alternance ou de stage'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Intitulé du poste *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Type d'offre *</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({...formData, type: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              {types.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="niveauEtude">Niveau d'étude requis *</Label>
                          <Select
                            value={formData.niveauEtude}
                            onValueChange={(value) => setFormData({...formData, niveauEtude: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un niveau" />
                            </SelectTrigger>
                            <SelectContent>
                              {niveauxEtude.map((niveau) => (
                                <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duree">Durée *</Label>
                          <Input
                            id="duree"
                            value={formData.duree}
                            onChange={(e) => setFormData({...formData, duree: e.target.value})}
                            placeholder="ex: 12 mois"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="remuneration">Rémunération *</Label>
                          <Input
                            id="remuneration"
                            value={formData.remuneration}
                            onChange={(e) => setFormData({...formData, remuneration: e.target.value})}
                            placeholder="ex: 70-85% SMIC"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Lieu de travail *</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="ex: Paris (75)"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateDebut">Date de début *</Label>
                          <Input
                            id="dateDebut"
                            type="date"
                            value={formData.dateDebut}
                            onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateFin">Date de fin</Label>
                          <Input
                            id="dateFin"
                            type="date"
                            value={formData.dateFin}
                            onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description du poste *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ecolePartenaire">École/CFA partenaire</Label>
                          <Input
                            id="ecolePartenaire"
                            value={formData.ecolePartenaire}
                            onChange={(e) => setFormData({...formData, ecolePartenaire: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rythmeAlternance">Rythme alternance</Label>
                          <Input
                            id="rythmeAlternance"
                            value={formData.rythmeAlternance}
                            onChange={(e) => setFormData({...formData, rythmeAlternance: e.target.value})}
                            placeholder="ex: 3 semaines entreprise / 1 semaine école"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="missions">Missions principales</Label>
                          <Textarea
                            id="missions"
                            value={formData.missions.join('\n')}
                            onChange={(e) => setFormData({...formData, missions: e.target.value.split('\n')})}
                            rows={3}
                            placeholder="Une mission par ligne"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="competences">Compétences recherchées</Label>
                          <Textarea
                            id="competences"
                            value={formData.competences.join('\n')}
                            onChange={(e) => setFormData({...formData, competences: e.target.value.split('\n')})}
                            rows={3}
                            placeholder="Une compétence par ligne"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avantages">Avantages proposés</Label>
                        <Textarea
                          id="avantages"
                          value={formData.avantages.join('\n')}
                          onChange={(e) => setFormData({...formData, avantages: e.target.value.split('\n')})}
                          rows={2}
                          placeholder="Un avantage par ligne"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="urgent"
                            checked={formData.urgent}
                            onCheckedChange={(checked) => setFormData({...formData, urgent: checked})}
                          />
                          <Label htmlFor="urgent">Offre urgente</Label>
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
                          setEditingOffre(null);
                          resetForm();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-[#556B2F] hover:bg-[#6B8E23]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingOffre ? 'Mettre à jour' : 'Publier'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offres Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des offres d'alternance et stages</CardTitle>
          <CardDescription>
            {offres.length} offre{offres.length !== 1 ? 's' : ''} trouvée{offres.length !== 1 ? 's' : ''}
            {pagination.total > 0 && ` (${pagination.total} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#556B2F] mb-4" />
              <p>Chargement des offres...</p>
            </div>
          ) : offres.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune offre trouvée</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                  ? "Aucune offre ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore créé d'offres d'alternance ou de stages."
                }
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410]">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre première offre
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Poste</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Rémunération</TableHead>
                    <TableHead>Candidatures</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date début</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offres.map((offre) => {
                    const status = statuses.find(s => s.value === offre.status);
                    return (
                      <TableRow key={offre.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                {offre.title}
                                {offre.urgent && (
                                  <Badge className="bg-red-100 text-red-800">
                                    <Zap className="h-3 w-3 mr-1" /> Urgent
                                  </Badge>
                                )}
                              </div>
                              {offre.ecolePartenaire && (
                                <div className="text-sm text-gray-500">
                                  {offre.ecolePartenaire}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{offre.type}</Badge>
                        </TableCell>
                        <TableCell>{offre.niveauEtude}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {offre.duree}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {offre.remuneration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>{offre.candidatures_count || 0}</span>
                            <span className="text-xs text-gray-500">({offre.vues || 0} vues)</span>
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
                            {offre.dateDebut ? offre.dateDebut.split('T')[0] : '-'}
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
                              <DropdownMenuItem onClick={() => handleEdit(offre)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {/* View candidates */}}>
                                <Users className="h-4 w-4 mr-2" />
                                Voir candidatures ({offre.candidatures_count || 0})
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(offre.id, offre.status === 'active' ? 'archived' : 'active')}
                              >
                                {offre.status === 'active' ? (
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
                                onClick={() => handleDelete(offre.id)}
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