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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, FileText, Loader2, X } from "lucide-react"
import { useState } from "react"
import api from "@/lib/api"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEmailCardOpen, setIsEmailCardOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [email, setEmail] = useState("")

  const handleOpenEmailCard = () => {
    setIsEmailCardOpen(true)
  }

  const handleCloseEmailCard = () => {
    setIsEmailCardOpen(false)
    setEmail("")
  }

  const handleGenerateReport = async () => {
    if (!email.trim()) {
      setModalMessage("Veuillez saisir une adresse email valide.")
      setIsModalOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post("/report/analyse-popularite", { // Changé en POST
        email: email.trim() // Envoi de l'email dans le body
      })
      
      if (response.status === 200) {
        setModalMessage(`Le rapport des produits a été généré et envoyé à ${email} avec succès !`)
        setIsModalOpen(true)
        handleCloseEmailCard()
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
          onClick={handleOpenEmailCard}
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

      {/* Carte pour saisir l'email */}
      {isEmailCardOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Envoyer le rapport par email
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEmailCard}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@servo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleGenerateReport()
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCloseEmailCard}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isLoading || !email.trim()}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {isLoading ? "Envoi..." : "Envoyer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Rapport envoyé 
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Veuillez vérifier votre E-mail
              </p>
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