import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import OeuvreModal from "@/components/pro/Pro-oeuvre-modal";
import { ArtProfessionalServicesTable } from "@/components/pro/Artprofessional-services-table";
import { ArtProfessionalServicesStats } from "@/components/pro/Artprofessional-services-stats";

export default function ArtCommerceService() {
  const [isAvailableModalOpen, setIsAvailableModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("associated"); // "associated" | "available"
  const [refreshKey, setRefreshKey] = useState(0);

  const handleServiceUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Mes ouvres d'art et commerces
          </h1>
          <p className="text-muted-foreground">
            Gérez les oeuvre que vous proposez
          </p>
        </div>
        <Button
          onClick={() => setIsAvailableModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un oeuvre
        </Button>
      </div>

      <ArtProfessionalServicesStats key={`stats-${refreshKey}`} />

      <Card className="bg-card border-border p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
  

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-input"
            />
          </div>
        </div>

        <ArtProfessionalServicesTable
          key={`table-${refreshKey}-${activeTab}`}
          searchQuery={searchQuery}
          onServiceUpdated={handleServiceUpdated}
        />
      </Card>
      {/* Modal global pour le composant */}
      {isAvailableModalOpen && (
        <OeuvreModal onClose={() => setIsAvailableModalOpen(false)} />
      )}
    </div>
  );
}
