import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Eye,
  Briefcase,
  Users,
  Tag,
  CheckCircle,
  XCircle,
  PlusCircle,
  Clock,
  Edit,
  Package,
  Euro,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  metiers: Array<{
    id: number;
    libelle: string;
  }>;
  vendors: Array<{
    id: string;
    name: string;
    isCurrentUser: boolean;
  }>;
  isAssociated: boolean;
  isFromMetier: boolean;
  isCustom?: boolean;
  canEdit?: boolean;
  status: string;
  price?: number;
  duration?: number;
  tags?: string[];
  customPrice?: number;
  customDuration?: number;
  isAvailable?: boolean;
  vendorsCount?: number;
}

interface ProfessionalServicesTableProps {
  activeTab: string;
  searchQuery: string;
  onServiceUpdated: () => void;
}

export function ProfessionalServicesTable({
  activeTab,
  searchQuery,
  onServiceUpdated,
}: ProfessionalServicesTableProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [activeTab]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      let endpoint = "/professional/services";
      if (activeTab === "available") {
        endpoint = "/professional/services/available";
      }

      const response = await api.get(endpoint);
      setServices(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      toast.error("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  const handleAssociateService = useCallback(
    async (serviceId: string) => {
      try {
        setActionLoading(serviceId);

        // Mise à jour optimiste de l'interface
        setServices((prev) => prev.filter((s) => s.id !== serviceId));

        await api.post(`/professional/services/${serviceId}/associate`);
        onServiceUpdated();
        toast.success("Service associé avec succès");
      } catch (error: any) {
        console.error("Erreur lors de l'association:", error);
        toast.error(
          error.response?.data?.error || "Erreur lors de l'association"
        );
        // Rechargement en cas d'erreur uniquement
        await fetchServices();
      } finally {
        setActionLoading(null);
      }
    },
    [onServiceUpdated]
  );

  const handleDisassociateService = useCallback(
    async (serviceId: string) => {
      if (!confirm("Êtes-vous sûr de vouloir retirer ce service ?")) {
        return;
      }

      try {
        setActionLoading(serviceId);

        // Mise à jour optimiste: retirer de la liste
        setServices((prev) => prev.filter((s) => s.id !== serviceId));

        await api.delete(`/professional/services/${serviceId}/disassociate`);
        onServiceUpdated();
        toast.success("Service retiré avec succès");
      } catch (error: any) {
        console.error("Erreur lors de la désassociation:", error);
        toast.error(
          error.response?.data?.error || "Erreur lors de la désassociation"
        );
        // Rechargement en cas d'erreur uniquement
        await fetchServices();
      } finally {
        setActionLoading(null);
      }
    },
    [onServiceUpdated]
  );

  const handleDeleteCustomService = useCallback(
    async (serviceId: string) => {
      if (
        !confirm(
          "Êtes-vous sûr de vouloir supprimer définitivement ce service ? Cette action est irréversible."
        )
      ) {
        return;
      }

      try {
        setActionLoading(serviceId);

        // Mise à jour optimiste: retirer de la liste
        setServices((prev) => prev.filter((s) => s.id !== serviceId));

        await api.delete(`/professional/services/custom/${serviceId}`);
        onServiceUpdated();
        toast.success("Service supprimé avec succès");
      } catch (error: any) {
        console.error("Erreur lors de la suppression:", error);
        toast.error(
          error.response?.data?.error ||
            "Erreur lors de la suppression du service"
        );
        // Rechargement en cas d'erreur uniquement
        await fetchServices();
      } finally {
        setActionLoading(null);
      }
    },
    [onServiceUpdated]
  );

  const handleEditService = useCallback(async (serviceId: string) => {
    // Pour l'instant, on affiche un message
    // Vous pouvez implémenter une modale d'édition ici
    toast.info("Fonctionnalité d'édition à implémenter");
    console.log("Édition du service:", serviceId);
  }, []);

  const handleToggleAvailability = useCallback(
    async (serviceId: string, currentAvailability: boolean) => {
      try {
        setActionLoading(serviceId);

        // Mise à jour optimiste
        setServices((prev) =>
          prev.map((service) =>
            service.id === serviceId
              ? { ...service, isAvailable: !currentAvailability }
              : service
          )
        );

        // Ici vous devrez implémenter l'appel API pour mettre à jour la disponibilité
        // await api.patch(`/professional/services/${serviceId}/availability`, {
        //   isAvailable: !currentAvailability
        // });

        toast.success(
          `Service ${!currentAvailability ? "activé" : "désactivé"} avec succès`
        );
      } catch (error: any) {
        console.error("Erreur lors du changement de disponibilité:", error);
        toast.error("Erreur lors de la modification de la disponibilité");
        // Rechargement en cas d'erreur
        await fetchServices();
      } finally {
        setActionLoading(null);
      }
    },
    []
  );

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.metiers.some((metier) =>
        metier.libelle.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (service.tags &&
        service.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  const getServicePrice = (service: Service) => {
    return service.customPrice !== undefined
      ? service.customPrice
      : service.price;
  };

  const getServiceDuration = (service: Service) => {
    return service.customDuration !== undefined
      ? service.customDuration
      : service.duration;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-border bg-card p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                </div>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-20"></div>
                  <div className="h-6 bg-muted rounded w-24"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {activeTab === "associated"
            ? "Aucun service associé"
            : "Aucun service disponible"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {activeTab === "associated"
            ? "Commencez par ajouter des services à votre profil."
            : "Tous les services correspondant à vos métiers sont déjà associés."}
        </p>
        {activeTab === "associated" && (
          <div className="flex gap-2 justify-center">
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Créer un service
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Découvrir les services disponibles
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredServices.map((service) => (
        <Card
          key={service.id}
          className={`border-border bg-card p-6 hover:shadow-md transition-shadow ${
            !service.isAvailable ? "opacity-60" : ""
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* En-tête avec nom et badges */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {service.name}
                    </h3>
                    {!service.isAvailable && (
                      <Badge
                        variant="outline"
                        className="bg-muted text-muted-foreground"
                      >
                        Inactif
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {service.description || "Aucune description disponible"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 sm:flex-nowrap sm:flex-col">
                  {service.isCustom && (
                    <Badge
                      variant="outline"
                      className="bg-purple-500/10 text-purple-500 border-purple-200 text-xs"
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Personnalisé
                    </Badge>
                  )}

                  {activeTab === "associated" && (
                    <Badge
                      variant="secondary"
                      className={`whitespace-nowrap text-xs ${
                        service.isAvailable
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {service.isAvailable ? "Actif" : "Inactif"}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Informations prix et durée */}
              {(getServicePrice(service) || getServiceDuration(service)) && (
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {getServicePrice(service) && (
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4" />
                      <span className="font-medium text-foreground">
                        {getServicePrice(service)}€
                      </span>
                      {service.customPrice !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          (personnalisé)
                        </span>
                      )}
                    </div>
                  )}

                  {getServiceDuration(service) && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{getServiceDuration(service)} min</span>
                      {service.customDuration !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          (personnalisé)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tags personnalisés */}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {service.tags.slice(0, 4).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {service.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.tags.length - 4}
                    </Badge>
                  )}
                </div>
              )}

              {/* Métiers et catégorie */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {service.category}
                </Badge>

                {service.metiers.slice(0, 2).map((metier) => (
                  <Badge
                    key={metier.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    <Briefcase className="h-3 w-3 mr-1" />
                    {metier.libelle}
                  </Badge>
                ))}
                {service.metiers.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{service.metiers.length - 2} autres
                  </Badge>
                )}
              </div>

              {/* Statistiques et informations supplémentaires */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {activeTab === "associated"
                      ? `${service.vendors.length} prestataire(s)`
                      : `${
                          service.vendorsCount || service.vendors.length
                        } prestataire(s) actif(s)`}
                  </span>
                </div>

                {service.isFromMetier && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Recommandé par vos métiers</span>
                  </div>
                )}

                {service.isCustom && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Créé par vous</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[200px]">
              {activeTab === "associated" ? (
                <>
                  {/* Bouton pour activer/désactiver */}
                  <Button
                    variant={service.isAvailable ? "outline" : "default"}
                    size="sm"
                    onClick={() =>
                      handleToggleAvailability(
                        service.id,
                        service.isAvailable || true
                      )
                    }
                    disabled={actionLoading === service.id}
                    className={
                      service.isAvailable
                        ? "border-border hover:bg-accent"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }
                  >
                    {actionLoading === service.id ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : service.isAvailable ? (
                      <Eye className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {service.isAvailable ? "Désactiver" : "Activer"}
                  </Button>

                  {/* Bouton modifier pour les services personnalisés */}
                  {service.canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditService(service.id)}
                      className="border-border hover:bg-accent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}

                  {/* Bouton voir les demandes */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-accent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les demandes
                  </Button>

                  {/* Bouton supprimer/retirer */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      service.isCustom
                        ? handleDeleteCustomService(service.id)
                        : handleDisassociateService(service.id)
                    }
                    disabled={actionLoading === service.id}
                  >
                    {actionLoading === service.id ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    {service.isCustom ? "Supprimer" : "Retirer"}
                  </Button>
                </>
              ) : (
                // Bouton pour associer un service disponible
                <Button
                  onClick={() => handleAssociateService(service.id)}
                  disabled={actionLoading === service.id}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {actionLoading === service.id ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <PlusCircle className="h-4 w-4 mr-2" />
                  )}
                  Associer ce service
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
