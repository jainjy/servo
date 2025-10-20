import { useState } from "react"
import { TourismStats } from "@/components/admin/tourism/tourism-stats"
import { TourismTable } from "@/components/admin/tourism/tourism-table"
import { TourismModal } from "@/components/admin/tourism/tourism-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TourismPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tourisme & Expériences</h1>
          <p className="text-muted-foreground mt-1">Gérez les activités touristiques, visites et expériences locales</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle expérience
        </Button>
      </div>

      <TourismStats />
      <TourismTable />

      <TourismModal open={isModalOpen} onOpenChange={setIsModalOpen} mode="create" />
    </div>
  )
}