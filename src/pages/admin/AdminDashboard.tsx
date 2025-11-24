import { StatsCards } from "@/components/admin/stats-cards"
import { RecentActivity } from "@/components/admin/recent-activity"
import { PerformanceCharts } from "@/components/admin/performance-charts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import api from "@/lib/api"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  const handleGenerateReport = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/report/analyse-popularite")
      
      if (response.status === 200) {
        setModalMessage("Le rapport des produits a été généré et envoyé par email avec succès !")
        setIsModalOpen(true)
      } else {
        throw new Error("Erreur lors de la génération du rapport")
      }
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error)
      setModalMessage("Une erreur est survenue lors de l'envoi du rapport. Veuillez réessayer.")
      setIsModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalMessage("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme SERVO</p>
        </div>
        
        <Button 
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Mail className="h-4 w-4" />
        
            </>
          )}
          {isLoading ? "Génération..." : "Rapport par E-mail"}
        </Button>
      </div>

      {/* Modal de confirmation */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Rapport envoyé 
              <p>Veuillez vérifier votre E-mail</p>
            </DialogTitle>
            <DialogDescription className="pt-4">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={handleCloseModal}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <StatsCards />
      <PerformanceCharts />
      <RecentActivity />
    </div>
  )
}