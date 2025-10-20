import { useState } from "react"
import { VendorsTable } from "@/components/admin/vendors/vendors-table"
import { VendorsStats } from "@/components/admin/vendors/vendors-stats"
import { VendorModal } from "@/components/admin/vendors/vendor-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function VendorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Prestataires</h1>
          <p className="text-muted-foreground">Gérer tous les prestataires de services</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau prestataire
        </Button>
      </div>

      <VendorsStats />
      <VendorsTable />

      <VendorModal open={isModalOpen} onOpenChange={setIsModalOpen} mode="create" />
    </div>
  )
}