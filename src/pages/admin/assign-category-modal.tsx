// src/components/admin/services/assign-category-modal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Tag, Check, X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  _count?: {
    services: number;
  };
}

interface Service {
  id: number;
  libelle: string;
  categoryId: number | null;
  description?: string;
  _count?: {
    metiers: number;
    users: number;
  };
}

interface AssignCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  servicesWithoutCategory: Service[];
  onCategoryAssigned: () => void;
}

export function AssignCategoryModal({
  open,
  onOpenChange,
  categories,
  servicesWithoutCategory,
  onCategoryAssigned,
}: AssignCategoryModalProps) {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [bulkAssign, setBulkAssign] = useState(false);

  // Filtrer les services selon la recherche
  const filteredServices = servicesWithoutCategory.filter((service) =>
    service.libelle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Réinitialiser la sélection quand la modal s'ouvre/ferme
  useEffect(() => {
    if (open) {
      setSelectedServices([]);
      setSelectedCategory(null);
      setSearchQuery("");
      setBulkAssign(false);
    }
  }, [open]);

  const toggleServiceSelection = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const selectAllServices = () => {
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map((service) => service.id));
    }
  };

  const handleAssignCategory = async () => {
    if (!selectedCategory) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    if (selectedServices.length === 0 && !bulkAssign) {
      toast.error("Veuillez sélectionner au moins un service");
      return;
    }

    setLoading(true);

    try {
      if (bulkAssign) {
        // Assignation en masse pour tous les services sans catégorie
        await api.post("/services/bulk-assign-category", {
          categoryId: selectedCategory,
          serviceIds: servicesWithoutCategory.map((s) => s.id),
        });
        toast.success(
          `${servicesWithoutCategory.length} services assignés à la catégorie`
        );
      } else {
        // Assignation pour les services sélectionnés
        await api.post("/services/bulk-assign-category", {
          categoryId: selectedCategory,
          serviceIds: selectedServices,
        });
        toast.success(
          `${selectedServices.length} service(s) assigné(s) à la catégorie`
        );
      }

      onCategoryAssigned();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erreur lors de l'assignation:", error);
      toast.error(
        error.response?.data?.error ||
          "Erreur lors de l'assignation des catégories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSingleAssign = async (serviceId: number, categoryId: number) => {
    try {
      await api.patch(`/services/${serviceId}`, {
        categoryId: categoryId,
      });

      toast.success("Service assigné à la catégorie");
      onCategoryAssigned();
    } catch (error: any) {
      console.error("Erreur lors de l'assignation:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de l'assignation"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto border"
        style={{ 
          backgroundColor: '#FFFFFF0',
          borderColor: '#D3D3D3'
        }}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle 
            className="flex items-center gap-2"
            style={{ color: '#556B2F' }}
          >
            <Tag className="h-5 w-5" style={{ color: '#6B8E23' }} />
            Assigner des catégories aux services
          </DialogTitle>
          <DialogDescription className="text-gray-800">
            Sélectionnez une catégorie et les services à associer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode d'assignation rapide */}
          <Card 
            className="p-4 border-l-4 border-l-[#6B8E23]"
            style={{ 
              backgroundColor: '#6B8E23'/5,
              borderColor: '#6B8E23'/20
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 
                  className="font-semibold"
                  style={{ color: '#556B2F' }}
                >
                  Assignation rapide
                </h4>
                <p className="text-sm" style={{ color: '#6B8E23' }}>
                  Assigner tous les services sans catégorie à une même catégorie
                </p>
              </div>
              <Button
                variant={bulkAssign ? "default" : "outline"}
                size="sm"
                onClick={() => setBulkAssign(!bulkAssign)}
                style={{ 
                  backgroundColor: bulkAssign ? '#6B8E23' : 'transparent',
                  borderColor: bulkAssign ? '#6B8E23' : '#D3D3D3',
                  color: bulkAssign ? 'white' : '#6B8E23'
                }}
              >
                {bulkAssign ? "Activé" : "Activer"}
              </Button>
            </div>
          </Card>

          {/* Sélection de catégorie */}
          <div className="space-y-3">
            <Label className="font-medium" style={{ color: '#556B2F' }}>
              Catégorie
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedCategory === category.id
                      ? "border-[#6B8E23]"
                      : "border-[#D3D3D3] hover:bg-[#D3D3D3]/10"
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id 
                      ? '#6B8E23'/10 
                      : '#FFFFFF0',
                    color: selectedCategory === category.id 
                      ? '#6B8E23' 
                      : '#556B2F'
                  }}
                >
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm opacity-75 text-gray-800">
                    {category._count?.services || 0} service(s)
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Liste des services sans catégorie */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-medium" style={{ color: '#556B2F' }}>
                Services sans catégorie ({servicesWithoutCategory.length})
              </Label>
              {!bulkAssign && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllServices}
                  style={{ 
                    borderColor: '#D3D3D3',
                    color: '#6B8E23'
                  }}
                >
                  {selectedServices.length === filteredServices.length
                    ? "Tout désélectionner"
                    : "Tout sélectionner"}
                </Button>
              )}
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" 
                style={{ color: '#8B4513' }}
              />
              <Input
                placeholder="Rechercher un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  borderColor: '#D3D3D3',
                  color: '#556B2F'
                }}
                className="pl-10"
              />
            </div>

            {/* Liste des services */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredServices.length === 0 ? (
                <div className="text-center py-8 text-gray-800">
                  {searchQuery
                    ? "Aucun service trouvé"
                    : "Aucun service sans catégorie"}
                </div>
              ) : (
                filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedServices.includes(service.id)
                        ? "border-[#6B8E23]"
                        : "border-[#D3D3D3] hover:bg-[#D3D3D3]/10"
                    }`}
                    style={{
                      backgroundColor: selectedServices.includes(service.id)
                        ? '#6B8E23'/10
                        : '#FFFFFF0'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div 
                          className="font-medium"
                          style={{ color: '#556B2F' }}
                        >
                          {service.libelle}
                        </div>
                        {service.description && (
                          <div className="text-sm text-gray-800 mt-1">
                            {service.description}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Assignation rapide individuelle */}
                        {selectedCategory && !bulkAssign && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleSingleAssign(service.id, selectedCategory)
                            }
                            className="h-8 w-8 p-0"
                            style={{ 
                              borderColor: '#6B8E23',
                              color: '#6B8E23'
                            }}
                            title={`Assigner à ${
                              categories.find((c) => c.id === selectedCategory)
                                ?.name
                            }`}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Sélection pour assignation groupée */}
                        {!bulkAssign && (
                          <button
                            type="button"
                            onClick={() => toggleServiceSelection(service.id)}
                            className={`h-6 w-6 rounded border flex items-center justify-center transition-colors ${
                              selectedServices.includes(service.id)
                                ? "border-[#6B8E23] bg-[#6B8E23] text-white"
                                : "border-[#D3D3D3] hover:bg-[#D3D3D3]/10"
                            }`}
                          >
                            {selectedServices.includes(service.id) && (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div 
            className="flex justify-between items-center pt-4 border-t"
            style={{ borderColor: '#D3D3D3' }}
          >
            <div className="text-sm text-gray-800">
              {bulkAssign ? (
                <span>
                  Tous les services seront assignés à la catégorie sélectionnée
                </span>
              ) : (
                <span>{selectedServices.length} service(s) sélectionné(s)</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                style={{ 
                  borderColor: '#D3D3D3',
                  color: '#8B4513'
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAssignCategory}
                disabled={
                  loading ||
                  !selectedCategory ||
                  (selectedServices.length === 0 && !bulkAssign)
                }
                style={{ 
                  backgroundColor: '#6B8E23',
                  color: 'white',
                  borderColor: '#6B8E23',
                  opacity: loading || !selectedCategory || (selectedServices.length === 0 && !bulkAssign) ? 0.7 : 1
                }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Tag className="h-4 w-4 mr-2" />
                )}
                {bulkAssign
                  ? `Assigner tous les services (${servicesWithoutCategory.length})`
                  : `Assigner ${selectedServices.length} service(s)`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}