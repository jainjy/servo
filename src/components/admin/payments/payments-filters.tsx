import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Filter } from "lucide-react";

export interface FilterConfig {
  type: string;
  status: string;
  method: string;
  dateRange: string;
}

interface PaymentsFiltersProps {
  onFilterChange: (filters: FilterConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function PaymentsFilters({
  onFilterChange,
  isOpen,
  onToggle,
}: PaymentsFiltersProps) {
  const [filters, setFilters] = useState<FilterConfig>({
    type: "all",
    status: "all",
    method: "all",
    dateRange: "all",
  });

  const handleFilterChange = (key: keyof FilterConfig, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      type: "all",
      status: "all",
      method: "all",
      dateRange: "all",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const isActive =
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.method !== "all" ||
    filters.dateRange !== "all";

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={onToggle}>
        <Filter className="h-4 w-4 mr-2" />
        Filtres {isActive && <span className="ml-2 font-bold">●</span>}
      </Button>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres avancés
        </h3>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Filtre Type de paiement */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Type de paiement
          </label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="subscription">Abonnement</SelectItem>
              <SelectItem value="product">Produit</SelectItem>
              <SelectItem value="demande">Service/Demande</SelectItem>
              <SelectItem value="refund">Remboursement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Statut */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Statut
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Complété</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échoué</SelectItem>
              <SelectItem value="refunded">Remboursé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Méthode */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Méthode de paiement
          </label>
          <Select
            value={filters.method}
            onValueChange={(value) => handleFilterChange("method", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les méthodes</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="card">Carte bancaire</SelectItem>
              <SelectItem value="bank_transfer">Virement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Plage de dates */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Période
          </label>
          <Select
            value={filters.dateRange}
            onValueChange={(value) => handleFilterChange("dateRange", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les dates</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isActive && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </Card>
  );
}
