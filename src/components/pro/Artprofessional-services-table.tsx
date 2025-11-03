import { useState, useEffect } from "react";
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
} from "lucide-react";
import api from "@/lib/api";
import OeuvreModal from "./Pro-oeuvre-modal";

interface Service {
  id: number;
  libelle: string;
  description?: string;
  images: string[];
  price?: number;
  duration?: number;
  categoryId?: number;
  category?: { id: number; name: string };
  metiers: Array<{ id: number; libelle: string }>;
  users: Array<{ id: string; name: string }>;
  demandes: Array<any>;
  Review: Array<any>;
  Appointment: Array<any>;
}

interface ProfessionalServicesTableProps {
  searchQuery: string;
  onServiceUpdated: () => void;
}

export function ArtProfessionalServicesTable({
  searchQuery,
  onServiceUpdated,
}: ProfessionalServicesTableProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/oeuvre");
      setServices(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-border bg-card p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </div>
              <div className="h-8 bg-muted rounded w-24"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Aucun service trouvé
        </h3>
        <p className="text-muted-foreground mb-6">
          Aucun service ne correspond à votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card
          key={service.id}
          className="border-border bg-card p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {service.libelle}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {service.description || "Aucune description disponible"}
                  </p>
                  {service.price !== undefined && (
                    <p className="text-sm text-foreground mt-1">
                      Prix : {service.price.toLocaleString()} Ar
                    </p>
                  )}
                  {service.duration !== undefined && (
                    <p className="text-sm text-foreground mt-1">
                      Durée : {service.duration} min
                    </p>
                  )}
                  {service.category?.name && (
                    <p className="text-sm text-foreground mt-1">
                      Catégorie : {service.category.name}
                    </p>
                  )}
                </div>

                <Badge
                  variant="secondary"
                  className="bg-success/20 text-success whitespace-nowrap"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Actif
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Modal global pour le composant */}
      {showModal && <OeuvreModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
    