import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AvailableServicesModal } from "@/components/pro/available-services-modal";
import { CreateCustomServiceModal } from "@/components/pro/CreateCustomServiceModal";
import { ProfessionalServicesTable } from "@/components/pro/professional-services-table";
import { ProfessionalServicesStats } from "@/components/pro/professional-services-stats";

// Nouvelle palette de couleurs
const COLORS = {
  LOGO: "#556B2F",           /* Olive green - accent */
  PRIMARY_DARK: "#6B8E23",   /* Yellow-green - primary */
  LIGHT_BG: "#FFFFFF",       /* White - fond clair */
  SEPARATOR: "#D3D3D3",      /* Light gray - séparateurs */
  SECONDARY_TEXT: "#8B4513", /* Saddle brown - textes secondaires */
  TEXT_BLACK: "#000000",     /* Black - petits textes */
};

export default function ProfessionalServicesPage() {
  const [isAvailableModalOpen, setIsAvailableModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("associated");
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const handleServiceUpdated = useCallback(() => {
    setStatsRefreshKey((prev) => prev + 1);
    setTableRefreshKey((prev) => prev + 1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-lg lg:text-3xl font-bold tracking-tight" 
              style={{ color: COLORS.PRIMARY_DARK }}>
            Mes Services
          </h1>
          <p className="text-black" style={{ color: COLORS.TEXT_BLACK }}>
            Gérez les services que vous proposez
          </p>
        </div>
        <div className="grid lg:flex gap-2 mt-4 md:mt-0">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="outline"
            className="hover:bg-accent"
            style={{ 
              borderColor: COLORS.SEPARATOR,
              color: COLORS.SECONDARY_TEXT 
            }}
          >
            <Package className="mr-2 h-4 w-4" />
            Créer un service
          </Button>
          <Button
            onClick={() => setIsAvailableModalOpen(true)}
            style={{ 
              backgroundColor: COLORS.PRIMARY_DARK,
              color: COLORS.LIGHT_BG 
            }}
            className="hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Relier un service
          </Button>
        </div>
      </div>

      <ProfessionalServicesStats key={`stats-${statsRefreshKey}`} />

      <Card className="p-6" style={{ 
        backgroundColor: COLORS.LIGHT_BG,
        borderColor: COLORS.SEPARATOR 
      }}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex space-x-1 p-1 rounded-lg"
               style={{ backgroundColor: `${COLORS.SEPARATOR}30` }}>
            <Button
              variant={activeTab === "associated" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("associated")}
              className={activeTab === "associated" ? "shadow-sm" : ""}
              style={activeTab === "associated" ? { 
                backgroundColor: COLORS.LIGHT_BG,
                color: COLORS.TEXT_BLACK 
              } : {
                color: COLORS.SECONDARY_TEXT
              }}
            >
              Mes Services
            </Button>
            <Button
              variant={activeTab === "available" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("available")}
              className={activeTab === "available" ? "shadow-sm" : ""}
              style={activeTab === "available" ? { 
                backgroundColor: COLORS.LIGHT_BG,
                color: COLORS.TEXT_BLACK 
              } : {
                color: COLORS.SECONDARY_TEXT
              }}
            >
              Services Disponibles
            </Button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" 
                   style={{ color: COLORS.SECONDARY_TEXT }} />
            <Input
              type="search"
              placeholder="Rechercher un service..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              style={{ 
                backgroundColor: COLORS.LIGHT_BG,
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
            />
          </div>
        </div>

        <ProfessionalServicesTable
          key={`table-${tableRefreshKey}-${activeTab}`}
          activeTab={activeTab}
          searchQuery={searchQuery}
          onServiceUpdated={handleServiceUpdated}
        />
      </Card>

      <AvailableServicesModal
        open={isAvailableModalOpen}
        onOpenChange={setIsAvailableModalOpen}
        onServiceAssociated={handleServiceUpdated}
      />

      <CreateCustomServiceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onServiceCreated={handleServiceUpdated}
      />
    </div>
  );
}