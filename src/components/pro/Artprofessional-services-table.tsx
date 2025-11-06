import { useState, useEffect } from "react";
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
import React from "react";

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

const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/oeuvre", {
        params: searchQuery ? { search: searchQuery } : {},
      });
      setServices(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch à chaque changement de searchQuery
  useEffect(() => {
    fetchServices();
  }, [searchQuery]);

  if (loading) return <p>Chargement...</p>;
  if (services.length === 0) return <p>Aucun service trouvé.</p>;

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-8">
  {services.map((service) => (
    // Utilisez un fragment React (<>...</>) pour contenir la Card ET le Modal pour ce service
    <React.Fragment key={service.id}>
      <Card
        // Changement 1: Carte plus foncée, bord plus doux, ombre plus profonde et moderne
        className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col transform hover:scale-[1.02] border border-gray-100"
      >
        {/* Image principale réduite */}
        {service.images?.length > 0 && (
          // Changement 2: Image plus haute (h-40), masque d'ombre subtil au bas de l'image
          <div className="relative h-40 w-full overflow-hidden">
            <img
              src={service.images[0]}
              alt={service.libelle}
              // Changement 3: Transition plus douce
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Badge catégorie - Plus discret et contrasté */}
            {service.category?.name && (
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg ring-1 ring-gray-200">
                {service.category.name}
              </span>
            )}
          </div>
        )}

        {/* Contenu */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div className="mb-4">
            {/* Changement 4: Typographie plus grande et plus audacieuse */}
            <h3 className="text-m font-extraregular text-gray-900 mb-1 line-clamp-1">
              {service.libelle}
            </h3>
            {/* Description : Couleurs de texte plus douces */}
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {service.description || "Aucune description disponible"}
            </p>

            {/* Indicateurs : Rendu plus élégant (Puces/Chips) */}
            <div className="flex flex-wrap gap-2 text-sm">
              {service.price !== undefined && (
                <span className="bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="text-lg">💰</span> {service.price.toLocaleString()} £
                </span>
              )}
              {service.duration !== undefined && (
                <span className="bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="text-lg">⏱</span> {service.duration} min
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
            {/* Badge Actif : Plus visible et moderne */}
            <span
              className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
            >
              ✅ Actif
            </span>


            <button
              onClick={() => {
                // Cette logique est correcte pour ouvrir le modal
                setSelectedService(service);
                setShowModal(true);
              }}
              // Changement 5: Bouton élégant, couleur accentuée, interaction subtile
              className="text-sm font-semibold px-4 py-2 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              ✏️ Modifier
            </button>
          </div>
        </div>
      </Card>

      {/* Rendu du Modal - Positionnement clé ! */}
      {/* On vérifie si showModal est vrai ET si le service sélectionné est CELUI de cette itération. */}
      {showModal && selectedService?.id === service.id && (
        <ProOeuvreModal
          service={selectedService}
          onClose={() => setShowModal(false)}
          token={""}
        />
      )}
    </React.Fragment> // Fin du Fragment React
  ))}
</div>


  );
}
