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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, Filter, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { financementAPI } from "@/lib/api";

const FinancementServicesAdmin = () => {
  const [filters, setFilters] = useState({
    search: "",
    partenaireId: "",
    type: "",
    isActive: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const queryClient = useQueryClient();

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ["admin-services-financiers", filters, pagination],
    queryFn: async () => {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };
      // Nettoyer les params vides
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      const response = await financementAPI.getAllServicesFinanciers(params);
      return response.data;
    },
  });

  const { data: partenaires } = useQuery({
    queryKey: ["partenaires-financement"],
    queryFn: async () => {
      const response = await financementAPI.getPartenaires();
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
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset à la page 1 lors du filtrage
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
        <h1 className="text-3xl font-bold">
          Services Financiers - Administration
        </h1>
        <p className="text-muted-foreground">
          Gestion de tous les services financiers de la plateforme
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom du service..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partenaire">Partenaire</Label>
              <Select
                value={filters.partenaireId}
                onValueChange={(value) =>
                  handleFilterChange("partenaireId", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les partenaires" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les partenaires</SelectItem>
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
                      Aucun partenaire
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de service</Label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  handleFilterChange("type", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.isActive}
                onValueChange={(value) =>
                  handleFilterChange("isActive", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="true">Actif</SelectItem>
                  <SelectItem value="false">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des services */}
      <Card>
        <CardHeader>
          <CardTitle>Services Financiers</CardTitle>
          <CardDescription>
            {paginationInfo?.totalItems || 0} service(s) au total
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
                <TableHead>Propriétaire</TableHead>
                <TableHead>Taux</TableHead>
                <TableHead>Demandes</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.nom}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(service.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{service.categorie}</Badge>
                  </TableCell>
                  <TableCell>{service.partenaire.nom}</TableCell>
                  <TableCell>
                    {service.partenaire.user ? (
                      <div className="text-sm">
                        <div>{service.partenaire.user.companyName}</div>
                        <div className="text-muted-foreground">
                          {service.partenaire.user.firstName}{" "}
                          {service.partenaire.user.lastName}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">Système</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {service.taux ? `${service.taux}%` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.FinancementDemande?.length > 0
                          ? "default"
                          : "outline"
                      }
                    >
                      {service.FinancementDemande?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={() => handleToggleStatus(service)}
                        disabled={toggleStatusMutation.isLoading}
                      />
                      <span
                        className={
                          service.isActive ? "text-green-600" : "text-red-600"
                        }
                      >
                        {service.isActive ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {services.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun service financier trouvé
            </div>
          )}

          {/* Pagination */}
          {paginationInfo && paginationInfo.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {paginationInfo.currentPage} sur{" "}
                {paginationInfo.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={paginationInfo.currentPage === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
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
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancementServicesAdmin;
