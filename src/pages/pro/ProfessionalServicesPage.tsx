import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AvailableServicesModal } from "@/components/pro/available-services-modal"
import { ProfessionalServicesTable } from "@/components/pro/professional-services-table"
import { ProfessionalServicesStats } from "@/components/pro/professional-services-stats"

export default function ProfessionalServicesPage() {
  const [isAvailableModalOpen, setIsAvailableModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("associated") // "associated" | "available"
  const [refreshKey, setRefreshKey] = useState(0)

  const handleServiceUpdated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mes Services</h1>
          <p className="text-muted-foreground">Gérez les services que vous proposez</p>
        </div>
        <Button 
          onClick={() => setIsAvailableModalOpen(true)} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>

      <ProfessionalServicesStats key={`stats-${refreshKey}`} />

      <Card className="bg-card border-border p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === "associated" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("associated")}
              className={activeTab === "associated" ? "bg-background shadow-sm" : ""}
            >
              Mes Services ({activeTab === "associated" ? "✓" : ""})
            </Button>
            <Button
              variant={activeTab === "available" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("available")}
              className={activeTab === "available" ? "bg-background shadow-sm" : ""}
            >
              Services Disponibles
            </Button>
          </div>
          
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

        <ProfessionalServicesTable 
          key={`table-${refreshKey}-${activeTab}`}
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
    </div>
  )
}