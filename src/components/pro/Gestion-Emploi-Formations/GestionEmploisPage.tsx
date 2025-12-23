import { useState, useEffect, useCallback } from "react";
import { useEmploi } from "@/hooks/useEmploi";
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
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  Loader2,
  Home,
} from "lucide-react";

export default function GestionEmploisPage() {
  const {
    emplois,
    isLoading,
    error,
    stats,
    pagination,
    fetchEmplois,
    fetchStats,
    createEmploi,
    updateEmploi,
    deleteEmploi,
    updateStatus,
    exportCSV,
    changePage
  } = useEmploi();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [secteurFilter, setSecteurFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmploi, setEditingEmploi] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    typeContrat: "",
    secteur: "",
    experience: "",
    salaire: "",
    location: "",
    remotePossible: false,
    urgent: false,
    status: "draft",
    missions: [""],
    competences: [""],
    avantages: [""],
    datePublication: "",
    dateLimite: "",
    nombrePostes: 1,
  });

  const typesContrat = [
    "CDI",
    "CDD",
    "Intérim",
    "Freelance",
    "Alternance",
    "Stage",
  ];

  const secteurs = [
    "Informatique & Tech",
    "Bâtiment & Construction",
    "Commerce & Vente",
    "Santé & Social",
    "Administration",
    "Services",
    "Industrie",
    "Tourisme",
  ];

  const niveauxExperience = [
    "Débutant",
    "Junior (1-3 ans)",
    "Confirmé (3-7 ans)",
    "Senior (7+ ans)",
    "Expert",
  ];

  const statuses = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "archived", label: "Archivée", color: "bg-yellow-100 text-yellow-800" },
    { value: "closed", label: "Pourvue", color: "bg-blue-100 text-blue-800" },
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
  }, [debouncedSearch, statusFilter, typeFilter, secteurFilter]);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchEmplois({
          search: debouncedSearch,
          status: statusFilter,
          type: typeFilter,
          secteur: secteurFilter,
          page: 1
        }),
        fetchStats()
      ]);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleSearch = useCallback(() => {
    fetchEmplois({
      search: searchTerm,
      status: statusFilter,
      type: typeFilter,
      secteur: secteurFilter,
      page: 1
    });
  }, [searchTerm, statusFilter, typeFilter, secteurFilter, fetchEmplois]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSecteurFilter("all");
  };

  const handleEdit = (emploi) => {
    setEditingEmploi(emploi);
    setFormData({
      title: emploi.title || "",
      description: emploi.description || "",
      typeContrat: emploi.typeContrat || "",
      secteur: emploi.secteur || "",
      experience: emploi.experience || "",
      salaire: emploi.salaire || "",
      location: emploi.location || "",
      remotePossible: emploi.remotePossible || false,
      urgent: emploi.urgent || false,
      status: emploi.status || "draft",
      missions: emploi.missions || [""],
      competences: emploi.competences || [""],
      avantages: emploi.avantages || [""],
      datePublication: emploi.datePublication ? emploi.datePublication.split('T')[0] : "",
      dateLimite: emploi.dateLimite ? emploi.dateLimite.split('T')[0] : "",
      nombrePostes: emploi.nombrePostes || 1,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      try {
        await deleteEmploi(id);
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
        typeContrat: formData.typeContrat,
        secteur: formData.secteur,
        experience: formData.experience,
        salaire: formData.salaire,
        location: formData.location,
        remotePossible: formData.remotePossible,
        urgent: formData.urgent,
        status: formData.status,
        missions: formData.missions.filter(m => m.trim() !== ''),
        competences: formData.competences.filter(c => c.trim() !== ''),
        avantages: formData.avantages.filter(a => a.trim() !== ''),
        datePublication: formData.datePublication || null,
        dateLimite: formData.dateLimite || null,
        nombrePostes: parseInt(formData.nombrePostes),
      };

      if (editingEmploi) {
        await updateEmploi(editingEmploi.id, apiData);
        toast.success("Offre mise à jour avec succès");
      } else {
        await createEmploi(apiData);
        toast.success("Offre créée avec succès");
      }
      
      setIsDialogOpen(false);
      setEditingEmploi(null);
      resetForm();
      
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      typeContrat: "",
      secteur: "",
      experience: "",
      salaire: "",
      location: "",
      remotePossible: false,
      urgent: false,
      status: "draft",
      missions: [""],
      competences: [""],
      avantages: [""],
      datePublication: "",
      dateLimite: "",
      nombrePostes: 1,
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
          Gestion des Offres d'Emploi
        </h1>
        <p className="text-gray-600">
          Publiez et gérez vos offres d'emploi, suivez les candidatures
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
                <p className="text-sm text-gray-600">Offres publiées</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-[#6B8E23]" />
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
                <p className="text-2xl font-bold text-[#556B2F]">{stats.candidatures}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold text-[#556B2F]">{stats.urgent}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
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
                  <SelectValue placeholder="Type contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {typesContrat.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={secteurFilter} onValueChange={setSecteurFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous secteurs</SelectItem>
                  {secteurs.map((secteur) => (
                    <SelectItem key={secteur} value={secteur}>{secteur}</SelectItem>
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
                  setEditingEmploi(null);
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
                      {editingEmploi ? 'Modifier l\'offre' : 'Nouvelle offre d\'emploi'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingEmploi 
                        ? 'Modifiez les informations de votre offre'
                        : 'Créez une nouvelle offre d\'emploi'
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
                          <Label htmlFor="secteur">Secteur d'activité *</Label>
                          <Select
                            value={formData.secteur}
                            onValueChange={(value) => setFormData({...formData, secteur: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un secteur" />
                            </SelectTrigger>
                            <SelectContent>
                              {secteurs.map((secteur) => (
                                <SelectItem key={secteur} value={secteur}>{secteur}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="typeContrat">Type de contrat *</Label>
                          <Select
                            value={formData.typeContrat}
                            onValueChange={(value) => setFormData({...formData, typeContrat: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              {typesContrat.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Niveau d'expérience *</Label>
                          <Select
                            value={formData.experience}
                            onValueChange={(value) => setFormData({...formData, experience: value})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un niveau" />
                            </SelectTrigger>
                            <SelectContent>
                              {niveauxExperience.map((niveau) => (
                                <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="salaire">Salaire *</Label>
                          <Input
                            id="salaire"
                            value={formData.salaire}
                            onChange={(e) => setFormData({...formData, salaire: e.target.value})}
                            placeholder="ex: 45-55K€"
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
                          <Label htmlFor="nombrePostes">Nombre de postes *</Label>
                          <Input
                            id="nombrePostes"
                            type="number"
                            value={formData.nombrePostes}
                            onChange={(e) => setFormData({...formData, nombrePostes: parseInt(e.target.value)})}
                            min="1"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateLimite">Date limite de candidature</Label>
                          <Input
                            id="dateLimite"
                            type="date"
                            value={formData.dateLimite}
                            onChange={(e) => setFormData({...formData, dateLimite: e.target.value})}
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
                          <Label htmlFor="competences">Compétences requises</Label>
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

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="remotePossible"
                            checked={formData.remotePossible}
                            onCheckedChange={(checked) => setFormData({...formData, remotePossible: checked})}
                          />
                          <Label htmlFor="remotePossible">Télétravail possible</Label>
                        </div>
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
                          setEditingEmploi(null);
                          resetForm();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-[#556B2F] hover:bg-[#6B8E23]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingEmploi ? 'Mettre à jour' : 'Publier'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emplois Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des offres d'emploi</CardTitle>
          <CardDescription>
            {emplois.length} offre{emplois.length !== 1 ? 's' : ''} trouvée{emplois.length !== 1 ? 's' : ''}
            {pagination.total > 0 && ` (${pagination.total} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#556B2F] mb-4" />
              <p>Chargement des offres...</p>
            </div>
          ) : emplois.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune offre trouvée</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || secteurFilter !== 'all'
                  ? "Aucune offre ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore créé d'offres d'emploi."
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
                    <TableHead>Secteur</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Salaire</TableHead>
                    <TableHead>Candidatures</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date limite</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emplois.map((emploi) => {
                    const status = statuses.find(s => s.value === emploi.status);
                    return (
                      <TableRow key={emploi.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                {emploi.title}
                                {emploi.urgent && (
                                  <Badge className="bg-red-100 text-red-800">
                                    <TrendingUp className="h-3 w-3 mr-1" /> Urgent
                                  </Badge>
                                )}
                              </div>
                              {emploi.remotePossible && (
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Home className="h-3 w-3" /> Télétravail possible
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{emploi.typeContrat}</Badge>
                        </TableCell>
                        <TableCell>{emploi.secteur}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {emploi.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {emploi.salaire}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>{emploi.candidatures_count || 0}</span>
                            <span className="text-xs text-gray-500">({emploi.vues || 0} vues)</span>
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
                            {emploi.dateLimite ? emploi.dateLimite.split('T')[0] : '-'}
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
                              <DropdownMenuItem onClick={() => handleEdit(emploi)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {/* View candidates */}}>
                                <Users className="h-4 w-4 mr-2" />
                                Voir candidatures ({emploi.candidatures_count || 0})
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(emploi.id, emploi.status === 'active' ? 'archived' : 'active')}
                              >
                                {emploi.status === 'active' ? (
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
                                onClick={() => handleDelete(emploi.id)}
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