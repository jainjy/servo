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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, FileText, Loader2, X, ChevronDown, History } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEmailCardOpen, setIsEmailCardOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [email, setEmail] = useState("")
  const [storedEmails, setStoredEmails] = useState([])
  const [loadingEmails, setLoadingEmails] = useState(false)

  // Charger les emails stockés depuis l'API
  const loadStoredEmails = async () => {
    setLoadingEmails(true)
    try {
      const response = await api.get("/report/destinations/active")
      const emails = response.data.data || []
      setStoredEmails(emails)
      
      // Sélectionner automatiquement l'email le plus récent
      if (emails.length > 0) {
        // Supposons que les emails sont déjà triés par date décroissante
        // Sinon, vous pouvez les trier : emails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        const mostRecentEmail = emails[0].email
        setEmail(mostRecentEmail)
      }
    } catch (error) {
      console.error("Erreur chargement emails stockés:", error)
      setStoredEmails([])
    } finally {
      setLoadingEmails(false)
    }
  }

  const handleOpenEmailCard = () => {
    setIsEmailCardOpen(true)
    loadStoredEmails() // Charger les emails quand on ouvre la modal
  }

  const handleCloseEmailCard = () => {
    setIsEmailCardOpen(false)
    setEmail("")
  }

  const handleEmailSelect = (selectedEmail) => {
    if (selectedEmail === "new") {
      setEmail("") // Réinitialiser pour nouvelle saisie
    } else {
      setEmail(selectedEmail)
    }
  }

  const handleGenerateReport = async () => {
    if (!email.trim()) {
      setModalMessage("Veuillez saisir ou sélectionner une adresse email valide.")
      setIsModalOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post("/report/analyse-popularite", {
        email: email.trim()
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
      setModalMessage(
        error.response?.data?.message || 
        "Une erreur est survenue lors de l'envoi du rapport. Veuillez réessayer."
      )
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
        {/* Section email avec input et dropdown */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Adresse email de destination
          </Label>
          
          <div className="flex gap-2">
            {/* Input pour email */}
            <div className="flex-1">
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
            
            {/* Dropdown simple pour emails récents */}
            <Select onValueChange={handleEmailSelect} value={email}>
              <SelectTrigger className="w-12 px-3">
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent className="w-64">
                {loadingEmails ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Chargement...</span>
                    </div>
                  </SelectItem>
                ) : storedEmails.length > 0 ? (
                  storedEmails.map((emailItem) => (
                    <SelectItem key={emailItem.id || emailItem.email} value={emailItem.email}>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="truncate">{emailItem.email}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Aucun email récent</span>
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Saisissez une adresse email ou sélectionnez parmi les emails récents
          </p>
        </div>

        {/* Info sur les emails stockés */}
        {storedEmails.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <History className="h-4 w-4" />
              <span>{storedEmails.length} email(s) disponible(s)</span>
            </div>
          </div>
        )}
        
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