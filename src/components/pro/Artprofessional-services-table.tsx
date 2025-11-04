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
import ProOeuvreModal from "./Pro-oeuvre-modal";

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

  const [selectedService, setSelectedService] = useState(null);


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

  function handleDelete(id: number): void {
    throw new Error("Function not implemented.");
  }

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
  {services.map((service) => (
    <Card
      key={service.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      {/* Image principale réduite */}
      {service.images?.length > 0 && (
        <div className="relative h-32 w-full overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.libelle}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {/* Badge catégorie */}
          {service.category?.name && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-[11px] font-semibold px-2 py-1 rounded-full shadow-md">
              {service.category.name}
            </span>
          )}
        </div>
      )}

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="mb-3">
          <h3 className="text-md font-semibold text-gray-800 mb-1 line-clamp-1">
            {service.libelle}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {service.description || "Aucune description disponible"}
          </p>

          <div className="flex flex-wrap gap-2 text-xs text-gray-700 mt-2">
            {service.price !== undefined && (
              <span className="flex items-center gap-1">💰 {service.price.toLocaleString()} Ar</span>
            )}
            {service.duration !== undefined && (
              <span className="flex items-center gap-1">⏱ {service.duration} min</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Actif
          </Badge>

          <button
            onClick={() => {
              setSelectedService(service);
              setShowModal(true);
            }}
            className="text-xs font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:scale-105 transition-transform duration-300"
          >
            Modifier
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedService?.id === service.id && (
        <ProOeuvreModal
          service={selectedService}
          onClose={() => setShowModal(false)}
          token={""}
        />
      )}
    </Card>
  ))}
</div>


  );
}
