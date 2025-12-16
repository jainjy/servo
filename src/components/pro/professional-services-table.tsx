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
  ChevronRight,
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
    // console.log("Édition du service:", serviceId);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-border bg-card p-4 sm:p-6 animate-pulse">
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-muted rounded-lg flex-shrink-0"></div>
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-muted rounded-lg flex-shrink-0"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-muted rounded flex-1"></div>
                <div className="h-8 bg-muted rounded flex-1"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {activeTab === "associated"
            ? "Aucun service associé"
            : "Aucun service disponible"}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          {activeTab === "associated"
            ? "Commencez par ajouter des services à votre profil."
            : "Tous les services correspondant à vos métiers sont déjà associés."}
        </p>
        {activeTab === "associated" && (
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" className="w-full sm:w-auto">
              <Package className="mr-2 h-4 w-4" />
              Créer un service
            </Button>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Découvrir les services
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {filteredServices.map((service) => (
        <Card
          key={service.id}
          className={`border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-200 flex flex-col ${
            !service.isAvailable ? "opacity-60" : ""
          }`}
        >
          {/* En-tête avec images et badges */}
          <div className="p-4 sm:p-6 pb-0">
            {/* Images du service */}
            {service.images && service.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
                {service.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${service.name} ${index + 1}`}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-border flex-shrink-0"
                  />
                ))}
                {service.images.length > 4 && (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg border border-border bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                    +{service.images.length - 4}
                  </div>
                )}
              </div>
            )}

            {/* Titre et badges */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground line-clamp-2">
                    {service.name}
                  </h3>
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {service.isCustom && (
                    <Badge
                      variant="outline"
                      className="bg-purple-500/10 text-purple-500 border-purple-200 text-xs whitespace-nowrap"
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Perso.
                    </Badge>
                  )}
                  {activeTab === "associated" && (
                    <Badge
                      variant="secondary"
                      className={`whitespace-nowrap text-xs ${
                        service.isAvailable
                          ? "bg-green-500/20 text-green-700 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {service.isAvailable ? "Actif" : "Inactif"}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
                {service.description || "Aucune description disponible"}
              </p>
            </div>

            {/* Informations prix et durée */}
            {(getServicePrice(service) || getServiceDuration(service)) && (
              <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
                {getServicePrice(service) && (
                  <div className="flex items-center gap-1">
                    <Euro className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="font-medium text-foreground">
                      {getServicePrice(service)}€
                    </span>
                    {service.customPrice !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        (perso)
                      </span>
                    )}
                  </div>
                )}

                {getServiceDuration(service) && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{getServiceDuration(service)} min</span>
                    {service.customDuration !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        (perso)
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tags personnalisés */}
            {service.tags && Array.isArray(service.tags) && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {service.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    <span className="truncate">{tag}</span>
                  </Badge>
                ))}
                {service.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs"> 
                    +{service.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Métiers et catégorie */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{service.category || "N/A"}</span>
              </Badge>

              {service.metiers && Array.isArray(service.metiers) && service.metiers.slice(0, 1).map((metier) => (
                <Badge
                  key={metier.id}
                  variant="secondary"
                  className="text-xs"
                >
                  <Briefcase className="h-3 w-3 mr-1" />
                  <span className="truncate">{metier.libelle}</span>
                </Badge>
              ))}
              {service.metiers && Array.isArray(service.metiers) && service.metiers.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  +{service.metiers.length - 1}
                </Badge>
              )}
            </div>

            {/* Statistiques */}
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>
                  {activeTab === "associated"
                    ? `${service.vendors?.length || 0} prestataire(s)`
                    : `${
                        service.vendorsCount || service.vendors?.length || 0
                      } actif(s)`}
                </span>
              </div>

              {service.isFromMetier && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500" />
                  <span>Recommandé</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border px-4 sm:px-6 py-4 mt-auto space-y-2">
            {activeTab === "associated" ? (
              <>
                <div className="grid grid-cols-2 gap-2">
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
                    className="text-xs sm:text-sm"
                  >
                    {actionLoading === service.id ? (
                      <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : service.isAvailable ? (
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                    ) : (
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    <span className="hidden sm:inline">
                      {service.isAvailable ? "Désactiver" : "Activer"}
                    </span>
                    <span className="sm:hidden">
                      {service.isAvailable ? "Déact." : "Activ."}
                    </span>
                  </Button>

                  {service.canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditService(service.id)}
                      className="text-xs sm:text-sm"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      <span className="hidden sm:inline">Modifier</span>
                      <span className="sm:hidden">Mod.</span>
                    </Button>
                  )}

                  {!service.canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      <span className="hidden sm:inline">Demandes</span>
                      <span className="sm:hidden">Dem.</span>
                    </Button>
                  )}
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    service.isCustom
                      ? handleDeleteCustomService(service.id)
                      : handleDisassociateService(service.id)
                  }
                  disabled={actionLoading === service.id}
                  className="w-full text-xs sm:text-sm"
                >
                  {actionLoading === service.id ? (
                    <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {service.isCustom ? "Supprimer" : "Retirer"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleAssociateService(service.id)}
                disabled={actionLoading === service.id}
                className="w-full text-xs sm:text-sm"
              >
                {actionLoading === service.id ? (
                  <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                )}
                Associer
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
