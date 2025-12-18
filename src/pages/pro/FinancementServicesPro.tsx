import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [selectedType, setSelectedType] = useState("");
  const queryClient = useQueryClient();

  // Récupérer les partenaires de l'utilisateur
  const { data: partenaires, isLoading: isLoadingPartenaires } = useQuery({
    queryKey: ["mes-partenaires-financement"],
    queryFn: async () => {
      const response = await financementAPI.getPartenairesPro();
      return response.data;
    },
  });

  // Récupérer les services financiers
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["mes-services-financiers"],
    queryFn: async () => {
      const response = await financementAPI.getServicesFinanciersPro();
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

  // Aplatir tous les services des partenaires
  const allServices =
    servicesData?.flatMap(
      (partenaire) =>
        partenaire.ServiceFinancier?.map((service) => ({
          ...service,
          partenaire: {
            id: partenaire.id,
            nom: partenaire.nom,
            icon: partenaire.icon,
          },
        })) || []
    ) || [];

  const filteredServices = allServices.filter(
    (service) =>
      service.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "" || service.type === selectedType)
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
      return <Badge style={{ backgroundColor: "#6B8E23" }}>Inactif</Badge>;
    }
    return <Badge style={{ backgroundColor: "#6B8E23" }}>Actif</Badge>;
  };

  if (isLoadingServices || isLoadingPartenaires) {
    return (
      <LoadingSpinner text="Chargement des services financiers..." />
    );
  }

  return (
    <div className="p-1 lg:p-0 space-y-6" style={{ backgroundColor: "#FFFFFF0" }}>
      <div className="grid gap-4 lg:flex justify-between items-center">
        <div>
          <h1 className="text-lg lg:text-3xl font-bold" style={{ color: "#8B4513" }}>
            Services Financiers
          </h1>
          <p className="text-muted-foreground">
            Gérez vos services financiers et produits de crédit
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "#556B2F", borderColor: "#556B2F" }}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ borderColor: "#D3D3D3" }}>
            <DialogHeader>
              <DialogTitle style={{ color: "#8B4513" }}>Créer un service financier</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau service financier à votre catalogue
              </DialogDescription>
            </DialogHeader>
            <ServiceForm
              partenaires={partenaires || []}
              onSubmit={handleCreate}
              isLoading={createMutation.isLoading}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <Card style={{ borderColor: "#D3D3D3" }}>
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
                  style={{ borderColor: "#D3D3D3" }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type">Type de service</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]" style={{ borderColor: "#D3D3D3" }}>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent style={{ borderColor: "#D3D3D3" }}>
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

      {/* Grille des services */}
      <Card style={{ borderColor: "#D3D3D3" }}>
        <CardHeader>
          <CardTitle style={{ color: "#8B4513" }}>Mes Services Financiers</CardTitle>
          <CardDescription>
            {filteredServices.length} service(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <Card key={service.id} className="flex flex-col" style={{ borderColor: "#D3D3D3" }}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg" style={{ color: "#8B4513" }}>
                          {service.nom}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {service.partenaire?.nom || "-"}
                        </CardDescription>
                      </div>
                      {getStatusBadge(service)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3 pb-3">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{getTypeLabel(service.type)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Catégorie:</span>
                        <p className="mt-1">
                          <Badge variant="outline" style={{ borderColor: "#D3D3D3" }}>
                            {service.categorie}
                          </Badge>
                        </p>
                      </div>
                      {service.taux && (
                        <div>
                          <span className="text-muted-foreground">Taux:</span>
                          <p className="font-medium">{service.taux}%</p>
                        </div>
                      )}
                      {service.montantMin && service.montantMax && (
                        <div>
                          <span className="text-muted-foreground">Montant:</span>
                          <p className="font-medium">
                            {service.montantMin}€ - {service.montantMax}€
                          </p>
                        </div>
                      )}
                      {service.dureeMin && service.dureeMax && (
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <p className="font-medium">
                            {service.dureeMin} - {service.dureeMax} mois
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <div className="border-t p-3 flex gap-2" style={{ borderColor: "#D3D3D3" }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedService(service);
                        setIsEditDialogOpen(true);
                      }}
                      style={{ borderColor: "#D3D3D3" }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(service)}
                      disabled={deleteMutation.isLoading}
                      style={{ borderColor: "#D3D3D3" }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Aucun service financier trouvé
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ borderColor: "#D3D3D3" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#8B4513" }}>Modifier le service financier</DialogTitle>
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
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedService(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composant formulaire de service
const ServiceForm = ({
  service,
  partenaires,
  onSubmit,
  isLoading,
  onCancel,
}) => {
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

    // Nettoyer les données avant envoi
    const cleanedData = {
      ...formData,
      partenaireId: formData.partenaireId,
      taux: formData.taux ? parseFloat(formData.taux) : null,
      dureeMin: formData.dureeMin ? parseInt(formData.dureeMin) : null,
      dureeMax: formData.dureeMax ? parseInt(formData.dureeMax) : null,
      montantMin: formData.montantMin ? parseFloat(formData.montantMin) : null,
      montantMax: formData.montantMax ? parseFloat(formData.montantMax) : null,
      fraisDossier: formData.fraisDossier
        ? parseFloat(formData.fraisDossier)
        : null,
      ordreAffichage: parseInt(formData.ordreAffichage) || 0,
    };

    onSubmit(cleanedData);
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
          <Label htmlFor="nom" style={{ color: "#8B4513" }}>Nom du service *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nom: e.target.value }))
            }
            required
            style={{ borderColor: "#D3D3D3" }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partenaireId" style={{ color: "#8B4513" }}>Partenaire *</Label>
          <Select
            value={formData.partenaireId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, partenaireId: value }))
            }
            required
          >
            <SelectTrigger style={{ borderColor: "#D3D3D3" }}>
              <SelectValue placeholder="Sélectionner un partenaire" />
            </SelectTrigger>
            <SelectContent style={{ borderColor: "#D3D3D3" }}>
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
                <SelectItem value="no-partner" disabled>
                  Aucun partenaire disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" style={{ color: "#8B4513" }}>Type de service *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
            required
          >
            <SelectTrigger style={{ borderColor: "#D3D3D3" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ borderColor: "#D3D3D3" }}>
              {serviceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categorie" style={{ color: "#8B4513" }}>Catégorie *</Label>
          <Select
            value={formData.categorie}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, categorie: value }))
            }
            required
          >
            <SelectTrigger style={{ borderColor: "#D3D3D3" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ borderColor: "#D3D3D3" }}>
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
        <Label htmlFor="description" style={{ color: "#8B4513" }}>Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          style={{ borderColor: "#D3D3D3" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taux" style={{ color: "#8B4513" }}>Taux d'intérêt (%)</Label>
          <Input
            id="taux"
            type="number"
            step="0.01"
            min="0"
            value={formData.taux}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, taux: e.target.value }))
            }
            style={{ borderColor: "#D3D3D3" }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fraisDossier" style={{ color: "#8B4513" }}>Frais de dossier (€)</Label>
          <Input
            id="fraisDossier"
            type="number"
            step="0.01"
            min="0"
            value={formData.fraisDossier}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fraisDossier: e.target.value }))
            }
            style={{ borderColor: "#D3D3D3" }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dureeMin" style={{ color: "#8B4513" }}>Durée min (mois)</Label>
          <Input
            id="dureeMin"
            type="number"
            min="0"
            value={formData.dureeMin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dureeMin: e.target.value }))
            }
            style={{ borderColor: "#D3D3D3" }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dureeMax" style={{ color: "#8B4513" }}>Durée max (mois)</Label>
          <Input
            id="dureeMax"
            type="number"
            min="0"
            value={formData.dureeMax}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dureeMax: e.target.value }))
            }
            style={{ borderColor: "#D3D3D3" }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="montantMin" style={{ color: "#8B4513" }}>Montant min (€)</Label>
          <Input
            id="montantMin"
            type="number"
            step="0.01"
            min="0"
            value={formData.montantMin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, montantMin: e.target.value }))
            }
            style={{ borderColor: "#D3D3D3" }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="montantMax" style={{ color: "#8B4513" }}>Montant max (€)</Label>
          <Input
            id="montantMax"
            type="number"
            step="0.01"
            min="0"
            value={formData.montantMax}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, montantMax: e.target.value }))
            }
            style={{ borderColor: "#D3D3D3" }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="delaiTraitement" style={{ color: "#8B4513" }}>Délai de traitement</Label>
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
          style={{ borderColor: "#D3D3D3" }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditions" style={{ color: "#8B4513" }}>Conditions particulières</Label>
        <Textarea
          id="conditions"
          value={formData.conditions}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, conditions: e.target.value }))
          }
          rows={2}
          style={{ borderColor: "#D3D3D3" }}
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
        <Label htmlFor="assuranceObligatoire" style={{ color: "#8B4513" }}>Assurance obligatoire</Label>
      </div>

      <div className="space-y-2">
        <Label style={{ color: "#8B4513" }}>Avantages</Label>
        <div className="flex gap-2">
          <Input
            value={newAvantage}
            onChange={(e) => setNewAvantage(e.target.value)}
            placeholder="Ajouter un avantage"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddAvantage())
            }
            style={{ borderColor: "#D3D3D3" }}
          />
          <Button type="button" onClick={handleAddAvantage} style={{ backgroundColor: "#6B8E23", borderColor: "#6B8E23" }}>
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.avantages.map((avantage, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
              style={{ backgroundColor: "#6B8E23" }}
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
        <Label style={{ color: "#8B4513" }}>Documents requis</Label>
        <div className="flex gap-2">
          <Input
            value={newDocument}
            onChange={(e) => setNewDocument(e.target.value)}
            placeholder="Ajouter un document requis"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddDocument())
            }
            style={{ borderColor: "#D3D3D3" }}
          />
          <Button type="button" onClick={handleAddDocument} style={{ backgroundColor: "#6B8E23", borderColor: "#6B8E23" }}>
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.documentsRequises.map((doc, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-1"
              style={{ borderColor: "#D3D3D3" }}
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
        <Label htmlFor="ordreAffichage" style={{ color: "#8B4513" }}>Ordre d'affichage</Label>
        <Input
          id="ordreAffichage"
          type="number"
          min="0"
          value={formData.ordreAffichage}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              ordreAffichage: parseInt(e.target.value) || 0,
            }))
          }
          style={{ borderColor: "#D3D3D3" }}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} style={{ borderColor: "#D3D3D3" }}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} style={{ backgroundColor: "#556B2F", borderColor: "#556B2F" }}>
          {isLoading ? "Enregistrement..." : service ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default FinancementServicesPro;