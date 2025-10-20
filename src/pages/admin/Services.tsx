import { useState } from "react"
import { ServicesTable } from "@/components/admin/services/services-table"
import { ServicesStats } from "@/components/admin/services/services-stats"
import { ServiceModal } from "@/components/admin/services/service-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleServiceUpdated = () => {
    setRefreshKey(prev => prev + 1) // Force le rechargement des composants
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Services</h1>
          <p className="text-muted-foreground">Gérer tous les services disponibles</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau service
        </Button>
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
  )
}