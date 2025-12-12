import { useState } from "react";
import { ServicesTable } from "@/components/admin/services/services-table";
import { ServicesStats } from "@/components/admin/services/services-stats";
import { ServiceModal } from "@/components/admin/services/service-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleServiceUpdated = () => {
    setRefreshKey((prev) => prev + 1); // Force le rechargement des composants
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#556B2F' }}>
            Services
          </h1>
          <p className="text-gray-800">
            Gérer tous les services disponibles
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/service-categories"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#6B8E23]/10 h-10 px-4 py-2 border"
            style={{ 
              borderColor: '#D3D3D3',
              color: '#6B8E23'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Les catégories
          </Link>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ 
              backgroundColor: '#6B8E23',
              color: 'white',
              borderColor: '#6B8E23'
            }}
          >
            <Plus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            Nouveau service
          </Button>
        </div>
      </div>

      <ServicesStats key={`stats-${refreshKey}`} />
      <ServicesTable key={`table-${refreshKey}`} />

      <ServiceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
        onServiceUpdated={handleServiceUpdated}
      />
    </div>
  );
}