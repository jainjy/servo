import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Eye, Plus, Edit, Trash2, Users } from "lucide-react";
import { toast } from "react-toastify";
import { financementAPI } from "@/lib/api";

const FinancementServicesAdmin = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [filters, setFilters] = useState({
    search: "",
    partenaireId: "all",
    type: "all",
    isActive: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const queryClient = useQueryClient();

  // Récupérer les services financiers
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["admin-services-financiers", filters, pagination],
    queryFn: async () => {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await financementAPI.getAllServicesFinanciers(params);
      return response.data;
    },
  });

  // Récupérer les partenaires
  const { data: partenaires } = useQuery({
    queryKey: ["partenaires-financement"],
    queryFn: async () => {
      const response = await financementAPI.getPartenaires();
      return response.data;
    },
  });

  // Récupérer les professionnels
  const { data: professionals } = useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const response = await financementAPI.getProfessionals();
      return response.data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      financementAPI.toggleServiceStatus(id, isActive),
    onSuccess: () => {
      toast.success("Statut du service mis à jour");
      queryClient.invalidateQueries(["admin-services-financiers"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Erreur lors de la mise à jour"
      );
    },
  });

  const services = servicesData?.services || [];
  const paginationInfo = servicesData?.pagination;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleToggleStatus = (service) => {
    toggleStatusMutation.mutate({
      id: service.id,
      isActive: !service.isActive,
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      pret_immobilier: "Prêt immobilier",
      pret_travaux: "Prêt travaux",
      rachat_credit: "Rachat de crédit",
      assurance_emprunteur: "Assurance emprunteur",
      credit_consommation: "Crédit consommation",
      leasing: "Leasing",
      affacturage: "Affacturage",
    };
    return labels[type] || type;
  };

  const serviceTypes = [
    "pret_immobilier",
    "pret_travaux",
    "rachat_credit",
    "assurance_emprunteur",
    "credit_consommation",
    "leasing",
    "affacturage",
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent">
          Financement - Administration
        </h1>
        <p className="">
          Gestion complète des services financiers et partenaires
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 border-[#D3D3D3]">
          <TabsTrigger 
            value="services" 
            className="data-[state=active]:bg-[#556B2F]  text-[#8B4513]"
          >
            Services Financiers
          </TabsTrigger>
          <TabsTrigger 
            value="partenaires" 
            className="data-[state=active]:bg-[#556B2F]  text-[#8B4513]"
          >
            Partenaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {/* Filtres pour les services */}
          <Card className="border-[#D3D3D3]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <Filter className="w-5 h-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-[#8B4513]">Recherche</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#8B4513]" />
                    <Input
                      id="search"
                      placeholder="Nom du service..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="pl-8 border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513] placeholder:text-[#8B4513]/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partenaire" className="text-[#8B4513]">Partenaire</Label>
                  <Select
                    value={filters.partenaireId}
                    onValueChange={(value) =>
                      handleFilterChange("partenaireId", value)
                    }
                  >
                    <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                      <SelectValue placeholder="Tous les partenaires" className="text-[#8B4513]" />
                    </SelectTrigger>
                    <SelectContent className="border-[#D3D3D3]">
                      <SelectItem value="all" className="text-[#8B4513]">Tous les partenaires</SelectItem>
                      {partenaires && partenaires.length > 0 ? (
                        partenaires.map((partenaire) => (
                          <SelectItem
                            key={partenaire.id}
                            value={partenaire.id.toString()}
                            className="text-[#8B4513]"
                          >
                            {partenaire.nom}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled className="text-[#8B4513]">
                          Aucun partenaire
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-[#8B4513]">Type de service</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                      <SelectValue placeholder="Tous les types" className="text-[#8B4513]" />
                    </SelectTrigger>
                    <SelectContent className="border-[#D3D3D3]">
                      <SelectItem value="all" className="text-[#8B4513]">Tous les types</SelectItem>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-[#8B4513]">
                          {getTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[#8B4513]">Statut</Label>
                  <Select
                    value={filters.isActive}
                    onValueChange={(value) =>
                      handleFilterChange("isActive", value)
                    }
                  >
                    <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                      <SelectValue placeholder="Tous les statuts" className="text-[#8B4513]" />
                    </SelectTrigger>
                    <SelectContent className="border-[#D3D3D3]">
                      <SelectItem value="all" className="text-[#8B4513]">Tous les statuts</SelectItem>
                      <SelectItem value="true" className="text-[#8B4513]">Actif</SelectItem>
                      <SelectItem value="false" className="text-[#8B4513]">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grille des services en cartes */}
          <div className="space-y-4">
            <Card className="border-[#D3D3D3]">
              <CardHeader>
                <CardTitle className="text-[#8B4513]">Services Financiers</CardTitle>
                <CardDescription className="">
                  {paginationInfo?.totalItems || 0} service(s) au total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 && !isLoadingServices ? (
                  <div className="text-center py-12 text-[#8B4513]">
                    Aucun service financier trouvé
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onToggleStatus={handleToggleStatus}
                          isLoading={toggleStatusMutation.isLoading}
                          getTypeLabel={getTypeLabel}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {paginationInfo && paginationInfo.totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                        <div className="text-sm ">
                          Page {paginationInfo.currentPage} sur{" "}
                          {paginationInfo.totalPages}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={paginationInfo.currentPage === 1}
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                page: prev.page - 1,
                              }))
                            }
                            className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
                          >
                            Précédent
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              paginationInfo.currentPage === paginationInfo.totalPages
                            }
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                              }))
                            }
                            className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
                          >
                            Suivant
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partenaires">
          <GestionPartenaires
            partenaires={partenaires}
            professionals={professionals}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Composant carte pour un service
const ServiceCard = ({ service, onToggleStatus, isLoading, getTypeLabel }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-[#D3D3D3]">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 ">
              {service.nom}
            </CardTitle>
            <CardDescription className="mt-1 text-[#8B4513]/80">
              {service.partenaire.nom}
            </CardDescription>
          </div>
          <Badge 
            variant={service.isActive ? "default" : "secondary"} 
            className={service.isActive ? "bg-[#556B2F] hover:bg-[#6B8E23]" : ""}
          >
            {service.isActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#8B4513] mb-1">Type</p>
            <Badge variant="outline" className="border-[#D3D3D3] text-[#8B4513]">
              {getTypeLabel(service.type)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-[#8B4513] mb-1">Catégorie</p>
              <Badge variant="secondary" className="text-xs bg-[#6B8E23]/10 text-[#8B4513]">
                {service.categorie}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-[#8B4513] mb-1">Taux</p>
              <p className="font-semibold text-[#8B4513]">
                {service.taux ? `${service.taux}%` : "-"}
              </p>
            </div>
          </div>

          {service.partenaire.user && (
            <div>
              <p className="text-xs text-[#8B4513] mb-1">Propriétaire</p>
              <div className="text-sm">
                <p className="font-medium text-[#8B4513]">{service.partenaire.user.companyName}</p>
                <p className="text-[#8B4513]/80 text-xs">
                  {service.partenaire.user.firstName}{" "}
                  {service.partenaire.user.lastName}
                </p>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[#D3D3D3]">
            <Badge
              variant={
                service.FinancementDemande?.length > 0
                  ? "default"
                  : "outline"
              }
              className={`text-xs ${service.FinancementDemande?.length > 0 ? 'bg-[#556B2F] hover:bg-[#6B8E23]' : 'border-[#D3D3D3] '}`}
            >
              {service.FinancementDemande?.length || 0} demande(s)
            </Badge>
          </div>
        </div>
      </CardContent>
      <div className="border-t border-[#D3D3D3] p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={service.isActive}
              onCheckedChange={() => onToggleStatus(service)}
              disabled={isLoading}
              className="data-[state=checked]:bg-[#556B2F]"
            />
            <span className="text-sm font-medium text-[#8B4513]">
              {service.isActive ? "Actif" : "Inactif"}
            </span>
          </div>
          <Button variant="outline" size="sm" className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Composant pour la gestion des partenaires
const GestionPartenaires = ({ partenaires, professionals }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => financementAPI.createPartenaire(data),
    onSuccess: () => {
      toast.success("Partenaire créé avec succès");
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries(["partenaires-financement"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Erreur lors de la création");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => financementAPI.deletePartenaire(id),
    onSuccess: () => {
      toast.success("Partenaire supprimé avec succès");
      queryClient.invalidateQueries(["partenaires-financement"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression"
      );
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  const handleDelete = (partenaire) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le partenaire "${partenaire.nom}" ?`
      )
    ) {
      deleteMutation.mutate(partenaire.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#D3D3D3]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-[#8B4513]">Gestion des Partenaires</CardTitle>
              <CardDescription className="">
                Créez et gérez les partenaires de financement
              </CardDescription>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#556B2F] hover:bg-[#6B8E23] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Partenaire
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#D3D3D3]">
                <DialogHeader>
                  <DialogTitle className="text-[#8B4513]">Créer un partenaire</DialogTitle>
                  <DialogDescription className="text-[#8B4513]/80">
                    Ajoutez un nouveau partenaire de financement
                  </DialogDescription>
                </DialogHeader>
                <PartenaireForm
                  professionals={professionals || []}
                  onSubmit={handleCreate}
                  isLoading={createMutation.isLoading}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {partenaires && partenaires.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partenaires.map((partenaire) => (
                <PartenaireCard
                  key={partenaire.id}
                  partenaire={partenaire}
                  onDelete={handleDelete}
                  isLoading={deleteMutation.isLoading}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#8B4513]">
              Aucun partenaire trouvé
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant carte pour un partenaire
const PartenaireCard = ({ partenaire, onDelete, isLoading }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-[#D3D3D3]">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 text-[#8B4513]">
              {partenaire.nom}
            </CardTitle>
          </div>
          <Badge variant="outline" className="border-[#D3D3D3] text-[#8B4513]">{partenaire.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          {partenaire.user && (
            <div>
              <p className="text-xs text-[#8B4513] mb-1">Propriétaire</p>
              <div className="text-sm">
                <p className="font-medium text-[#8B4513]">{partenaire.user.companyName}</p>
                <p className="text-[#8B4513]/80 text-xs">
                  {partenaire.user.firstName} {partenaire.user.lastName}
                </p>
              </div>
            </div>
          )}

          {!partenaire.user && (
            <div>
              <p className="text-xs text-[#8B4513] mb-1">Propriétaire</p>
              <Badge variant="outline" className="text-xs border-[#D3D3D3] text-[#8B4513]">
                Non assigné
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-[#8B4513] mb-1">Services</p>
              <Badge variant="secondary" className="text-xs bg-[#6B8E23]/10 text-[#8B4513]">
                {partenaire.ServiceFinancier?.length || 0}
              </Badge>
            </div>
          </div>

          <div className="pt-2 border-t border-[#D3D3D3] space-y-2">
            <p className="text-xs text-[#8B4513] mb-1">Contact</p>
            <div className="text-sm space-y-1">
              {partenaire.email && (
                <p className="break-all text-xs text-[#8B4513]">{partenaire.email}</p>
              )}
              {partenaire.phone && (
                <p className="text-xs text-[#8B4513]">{partenaire.phone}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <div className="border-t border-[#D3D3D3] p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]">
            <Edit className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Modifier</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(partenaire)}
            disabled={isLoading}
            className="flex-1 border-[#D3D3D3] text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Supprimer</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Formulaire pour créer un partenaire
const PartenaireForm = ({ professionals, onSubmit, isLoading, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    type: "banque",
    avantages: [],
    icon: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    conditions: "",
    tauxMin: "",
    tauxMax: "",
    dureeMin: "",
    dureeMax: "",
    montantMin: "",
    montantMax: "",
    userId: "",
  });

  const [newAvantage, setNewAvantage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddAvantage = () => {
    if (
      newAvantage.trim() &&
      !formData.avantages.includes(newAvantage.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        avantages: [...prev.avantages, newAvantage.trim()],
      }));
      setNewAvantage("");
    }
  };

  const handleRemoveAvantage = (index) => {
    setFormData((prev) => ({
      ...prev,
      avantages: prev.avantages.filter((_, i) => i !== index),
    }));
  };

  const typesPartenaire = [
    { value: "banque", label: "Banque" },
    { value: "organisme_credit", label: "Organisme de crédit" },
    { value: "fintech", label: "Fintech" },
    { value: "assurance", label: "Assurance" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom" className="text-[#8B4513]">Nom du partenaire *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nom: e.target.value }))
            }
            required
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-[#8B4513]">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
            required
          >
            <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
              <SelectValue className="text-[#8B4513]" />
            </SelectTrigger>
            <SelectContent className="border-[#D3D3D3]">
              {typesPartenaire.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-[#8B4513]">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userId" className="text-[#8B4513]">Assigner à un professionnel</Label>
          <Select
            value={formData.userId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, userId: value }))
            }
          >
            <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
              <SelectValue placeholder="Sélectionner un professionnel" className="text-[#8B4513]" />
            </SelectTrigger>
            <SelectContent className="border-[#D3D3D3]">
              <SelectItem value="" className="text-[#8B4513]">Non assigné</SelectItem>
              {professionals && professionals.length > 0 ? (
                professionals.map((pro) => (
                  <SelectItem key={pro.id} value={pro.id} className="text-[#8B4513]">
                    {pro.companyName} - {pro.firstName} {pro.lastName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-pro" disabled className="text-[#8B4513]">
                  Aucun professionnel disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon" className="text-[#8B4513]">Icône</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, icon: e.target.value }))
            }
            placeholder="URL de l'icône"
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-[#8B4513]">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[#8B4513]">Avantages</Label>
        <div className="flex gap-2">
          <Input
            value={newAvantage}
            onChange={(e) => setNewAvantage(e.target.value)}
            placeholder="Ajouter un avantage"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddAvantage())
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
          <Button type="button" onClick={handleAddAvantage} className="bg-[#556B2F] hover:bg-[#6B8E23] text-white">
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.avantages.map((avantage, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 bg-[#6B8E23]/10 text-[#8B4513]"
            >
              {avantage}
              <button
                type="button"
                onClick={() => handleRemoveAvantage(index)}
                className="text-xs text-[#8B4513]/80 hover:text-[#8B4513]"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website" className="text-[#8B4513]">Site web</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, website: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#8B4513]">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#8B4513]">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-[#8B4513]">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tauxMin" className="text-[#8B4513]">Taux minimum (%)</Label>
          <Input
            id="tauxMin"
            type="number"
            step="0.01"
            min="0"
            value={formData.tauxMin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tauxMin: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tauxMax" className="text-[#8B4513]">Taux maximum (%)</Label>
          <Input
            id="tauxMax"
            type="number"
            step="0.01"
            min="0"
            value={formData.tauxMax}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tauxMax: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dureeMin" className="text-[#8B4513]">Durée min (mois)</Label>
          <Input
            id="dureeMin"
            type="number"
            min="0"
            value={formData.dureeMin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dureeMin: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dureeMax" className="text-[#8B4513]">Durée max (mois)</Label>
          <Input
            id="dureeMax"
            type="number"
            min="0"
            value={formData.dureeMax}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dureeMax: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="montantMin" className="text-[#8B4513]">Montant min (€)</Label>
          <Input
            id="montantMin"
            type="number"
            step="0.01"
            min="0"
            value={formData.montantMin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, montantMin: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="montantMax" className="text-[#8B4513]">Montant max (€)</Label>
          <Input
            id="montantMax"
            type="number"
            step="0.01"
            min="0"
            value={formData.montantMax}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, montantMax: e.target.value }))
            }
            className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditions" className="text-[#8B4513]">Conditions particulières</Label>
        <Textarea
          id="conditions"
          value={formData.conditions}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, conditions: e.target.value }))
          }
          rows={2}
          className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
        >
          {isLoading ? "Création..." : "Créer le partenaire"}
        </Button>
      </div>
    </form>
  );
};

export default FinancementServicesAdmin;