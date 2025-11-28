import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { toast } from "react-toastify";
import { financementAPI } from "@/lib/api";

const FinancementServicesPro = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const queryClient = useQueryClient();

  // Récupérer les partenaires de l'utilisateur
  const { data: partenaires, isLoading: isLoadingPartenaires } = useQuery({
    queryKey: ["mes-partenaires-financement"],
    queryFn: async () => {
      const response = await financementAPI.getPartenaires();
      return response.data;
    },
  });

  // Récupérer les services financiers
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["mes-services-financiers"],
    queryFn: async () => {
      const response = await financementAPI.getServicesFinanciers();
      return response.data;
    },
  });

  // Mutation pour créer un service
  const createMutation = useMutation({
    mutationFn: (data) => financementAPI.createServiceFinancier(data),
    onSuccess: () => {
      toast.success("Service financier créé avec succès");
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries(["mes-services-financiers"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Erreur lors de la création");
    },
  });

  // Mutation pour mettre à jour un service
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      financementAPI.updateServiceFinancier(id, data),
    onSuccess: () => {
      toast.success("Service financier mis à jour avec succès");
      setIsEditDialogOpen(false);
      setSelectedService(null);
      queryClient.invalidateQueries(["mes-services-financiers"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Erreur lors de la mise à jour"
      );
    },
  });

  // Mutation pour supprimer un service
  const deleteMutation = useMutation({
    mutationFn: (id) => financementAPI.deleteServiceFinancier(id),
    onSuccess: () => {
      toast.success("Service financier supprimé avec succès");
      queryClient.invalidateQueries(["mes-services-financiers"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression"
      );
    },
  });

  const services = servicesData || [];
  const filteredServices = services.filter(
    (service) =>
      service.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "all" || service.type === selectedType)
  );

  const serviceTypes = [
    "pret_immobilier",
    "pret_travaux",
    "rachat_credit",
    "assurance_emprunteur",
    "credit_consommation",
    "leasing",
    "affacturage",
  ];

  const categories = ["particulier", "professionnel", "entreprise"];

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data) => {
    updateMutation.mutate({ id: selectedService.id, data });
  };

  const handleDelete = (service) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le service "${service.nom}" ?`
      )
    ) {
      deleteMutation.mutate(service.id);
    }
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

  const getStatusBadge = (service) => {
    if (!service.isActive) {
      return <Badge variant="destructive">Inactif</Badge>;
    }
    return <Badge variant="success">Actif</Badge>;
  };

  if (isLoadingServices || isLoadingPartenaires) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          Chargement des services financiers...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Services Financiers</h1>
          <p className="text-muted-foreground">
            Gérez vos services financiers et produits de crédit
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un service financier</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau service financier à votre catalogue
              </DialogDescription>
            </DialogHeader>
            <ServiceForm
              partenaires={partenaires || []}
              onSubmit={handleCreate}
              isLoading={createMutation.isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type">Type de service</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des services */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Services Financiers</CardTitle>
          <CardDescription>
            {filteredServices.length} service(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Partenaire</TableHead>
                <TableHead>Taux</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.nom}</TableCell>
                  <TableCell>{getTypeLabel(service.type)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.categorie}</Badge>
                  </TableCell>
                  <TableCell>{service.partenaire.nom}</TableCell>
                  <TableCell>
                    {service.taux ? `${service.taux}%` : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(service)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedService(service);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service)}
                        disabled={deleteMutation.isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredServices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun service financier trouvé
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le service financier</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre service financier
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <ServiceForm
              service={selectedService}
              partenaires={partenaires || []}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composant formulaire de service
const ServiceForm = ({ service, partenaires, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    nom: service?.nom || "",
    description: service?.description || "",
    type: service?.type || "pret_immobilier",
    categorie: service?.categorie || "particulier",
    partenaireId: service?.partenaireId?.toString() || "",
    conditions: service?.conditions || "",
    avantages: service?.avantages || [],
    taux: service?.taux || "",
    dureeMin: service?.dureeMin || "",
    dureeMax: service?.dureeMax || "",
    montantMin: service?.montantMin || "",
    montantMax: service?.montantMax || "",
    fraisDossier: service?.fraisDossier || "",
    assuranceObligatoire: service?.assuranceObligatoire || false,
    documentsRequises: service?.documentsRequises || [],
    delaiTraitement: service?.delaiTraitement || "",
    ordreAffichage: service?.ordreAffichage || 0,
  });

  const [newAvantage, setNewAvantage] = useState("");
  const [newDocument, setNewDocument] = useState("");

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

  const handleAddDocument = () => {
    if (
      newDocument.trim() &&
      !formData.documentsRequises.includes(newDocument.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        documentsRequises: [...prev.documentsRequises, newDocument.trim()],
      }));
      setNewDocument("");
    }
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documentsRequises: prev.documentsRequises.filter((_, i) => i !== index),
    }));
  };

  const serviceTypes = [
    { value: "pret_immobilier", label: "Prêt immobilier" },
    { value: "pret_travaux", label: "Prêt travaux" },
    { value: "rachat_credit", label: "Rachat de crédit" },
    { value: "assurance_emprunteur", label: "Assurance emprunteur" },
    { value: "credit_consommation", label: "Crédit consommation" },
    { value: "leasing", label: "Leasing" },
    { value: "affacturage", label: "Affacturage" },
  ];

  const categories = [
    { value: "particulier", label: "Particulier" },
    { value: "professionnel", label: "Professionnel" },
    { value: "entreprise", label: "Entreprise" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom du service *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nom: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partenaireId">Partenaire *</Label>
          <Select
            value={formData.partenaireId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, partenaireId: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un partenaire" />
            </SelectTrigger>
            <SelectContent>
              {partenaires && partenaires.length > 0 ? (
                partenaires.map((partenaire) => (
                  <SelectItem
                    key={partenaire.id}
                    value={partenaire.id.toString()}
                  >
                    {partenaire.nom}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">
                  Aucun partenaire disponible
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type de service *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categorie">Catégorie *</Label>
          <Select
            value={formData.categorie}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, categorie: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taux">Taux d'intérêt (%)</Label>
          <Input
            id="taux"
            type="number"
            step="0.01"
            value={formData.taux}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, taux: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fraisDossier">Frais de dossier (€)</Label>
          <Input
            id="fraisDossier"
            type="number"
            step="0.01"
            value={formData.fraisDossier}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fraisDossier: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dureeMin">Durée min (mois)</Label>
          <Input
            id="dureeMin"
            type="number"
            value={formData.dureeMin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dureeMin: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dureeMax">Durée max (mois)</Label>
          <Input
            id="dureeMax"
            type="number"
            value={formData.dureeMax}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dureeMax: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="montantMin">Montant min (€)</Label>
          <Input
            id="montantMin"
            type="number"
            step="0.01"
            value={formData.montantMin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, montantMin: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="montantMax">Montant max (€)</Label>
          <Input
            id="montantMax"
            type="number"
            step="0.01"
            value={formData.montantMax}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, montantMax: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="delaiTraitement">Délai de traitement</Label>
        <Input
          id="delaiTraitement"
          value={formData.delaiTraitement}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              delaiTraitement: e.target.value,
            }))
          }
          placeholder="ex: 48h, 1 semaine"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditions">Conditions particulières</Label>
        <Textarea
          id="conditions"
          value={formData.conditions}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, conditions: e.target.value }))
          }
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="assuranceObligatoire"
          checked={formData.assuranceObligatoire}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, assuranceObligatoire: checked }))
          }
        />
        <Label htmlFor="assuranceObligatoire">Assurance obligatoire</Label>
      </div>

      <div className="space-y-2">
        <Label>Avantages</Label>
        <div className="flex gap-2">
          <Input
            value={newAvantage}
            onChange={(e) => setNewAvantage(e.target.value)}
            placeholder="Ajouter un avantage"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddAvantage())
            }
          />
          <Button type="button" onClick={handleAddAvantage}>
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.avantages.map((avantage, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {avantage}
              <button
                type="button"
                onClick={() => handleRemoveAvantage(index)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Documents requis</Label>
        <div className="flex gap-2">
          <Input
            value={newDocument}
            onChange={(e) => setNewDocument(e.target.value)}
            placeholder="Ajouter un document requis"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddDocument())
            }
          />
          <Button type="button" onClick={handleAddDocument}>
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.documentsRequises.map((doc, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-1"
            >
              {doc}
              <button
                type="button"
                onClick={() => handleRemoveDocument(index)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ordreAffichage">Ordre d'affichage</Label>
        <Input
          id="ordreAffichage"
          type="number"
          value={formData.ordreAffichage}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              ordreAffichage: parseInt(e.target.value) || 0,
            }))
          }
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            service
              ? setIsEditDialogOpen?.(false)
              : setIsCreateDialogOpen?.(false)
          }
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : service ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default FinancementServicesPro;
