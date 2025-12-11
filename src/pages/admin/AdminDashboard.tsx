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
  const [isAutoSend, setIsAutoSend] = useState(false)
  const [autoSendInterval, setAutoSendInterval] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState("")
  const [autoSendFrequency, setAutoSendFrequency] = useState("daily")
  const [customValue, setCustomValue] = useState(1)
  const [customUnit, setCustomUnit] = useState("hours")

  // Charger les emails stockés depuis l'API
  const loadStoredEmails = async () => {
    setLoadingEmails(true)
    try {
      const response = await api.get("/report/destinations/active")
      const emails = response.data.data || []
      setStoredEmails(emails)
      
      // Sélectionner automatiquement l'email le plus récent
      if (emails.length > 0) {
        const mostRecentEmail = emails[0].email
        setEmail(mostRecentEmail)
        setSelectedEmail(mostRecentEmail)
      }
    } catch (error) {
      console.error("Erreur chargement emails stockés:", error)
      setStoredEmails([])
    } finally {
      setLoadingEmails(false)
    }
  }

  // Convertir la fréquence en millisecondes
  const getIntervalFromFrequency = (frequency, value = 1, unit = "hours") => {
    switch (frequency) {
      case "custom":
        return getCustomInterval(value, unit);
      case "daily":
        return 24 * 60 * 60 * 1000; // 24 heures
      case "weekly":
        return 7 * 24 * 60 * 60 * 1000; // 7 jours
      case "monthly":
        return 30 * 24 * 60 * 60 * 1000; // 30 jours
      default:
        return 24 * 60 * 60 * 1000; // Par défaut quotidien
    }
  }

  // Convertir les valeurs personnalisées en millisecondes
  const getCustomInterval = (value, unit) => {
    const numericValue = parseInt(value) || 1;
    
    switch (unit) {
      case "minutes":
        return numericValue * 60 * 1000;
      case "hours":
        return numericValue * 60 * 60 * 1000;
      case "days":
        return numericValue * 24 * 60 * 60 * 1000;
      case "weeks":
        return numericValue * 7 * 24 * 60 * 60 * 1000;
      default:
        return numericValue * 60 * 60 * 1000;
    }
  }

  // Obtenir le texte descriptif de la fréquence
  const getFrequencyText = (frequency, value = 1, unit = "hours") => {
    switch (frequency) {
      case "custom":
        return getCustomFrequencyText(value, unit);
      case "daily":
        return "quotidiennement";
      case "weekly":
        return "hebdomadairement";
      case "monthly":
        return "mensuellement";
      default:
        return "quotidiennement";
    }
  }

  // Obtenir le texte descriptif pour les fréquences personnalisées
  const getCustomFrequencyText = (value, unit) => {
    const numericValue = parseInt(value) || 1;
    
    const units = {
      minutes: numericValue === 1 ? "minute" : "minutes",
      hours: numericValue === 1 ? "heure" : "heures",
      days: numericValue === 1 ? "jour" : "jours",
      weeks: numericValue === 1 ? "semaine" : "semaines"
    };

    return `toutes les ${numericValue} ${units[unit]}`;
  }

  // Fonction pour envoyer le rapport automatiquement
  const sendAutoReport = async () => {
    if (!email.trim() || storedEmails.length === 0) return

    try {
      const response = await api.post("/report/analyse-popularite", {
        email: email.trim()
      })
      
      if (response.status === 200) {
        console.log(`Rapport automatique envoyé à ${email} à ${new Date().toLocaleTimeString()}`)
      } else {
        throw new Error("Erreur lors de l'envoi automatique du rapport")
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi automatique du rapport:", error)
    }
  }

  // Gérer l'activation/désactivation de l'envoi automatique
  const handleAutoSendToggle = () => {
    if (!isAutoSend) {
      // Activer l'envoi automatique
      if (storedEmails.length > 0) {
        setIsAutoSend(true)
        // Envoyer immédiatement un rapport
        sendAutoReport()
        // Programmer l'envoi selon la fréquence sélectionnée
        const intervalTime = getIntervalFromFrequency(autoSendFrequency, customValue, customUnit)
        const interval = setInterval(sendAutoReport, intervalTime)
        setAutoSendInterval(interval)
        
        const frequencyText = getFrequencyText(autoSendFrequency, customValue, customUnit)
        
        setModalMessage(`Envoi automatique activé ! Le rapport sera envoyé à ${email} ${frequencyText}.`)
        setIsModalOpen(true)
      } else {
        setModalMessage("Aucun email disponible pour l'envoi automatique.")
        setIsModalOpen(true)
      }
    } else {
      // Désactiver l'envoi automatique
      setIsAutoSend(false)
      if (autoSendInterval) {
        clearInterval(autoSendInterval)
        setAutoSendInterval(null)
      }
      setModalMessage("Envoi automatique désactivé.")
      setIsModalOpen(true)
    }
  }

  // Redémarrer l'envoi automatique quand la fréquence change
  useEffect(() => {
    if (isAutoSend && autoSendInterval) {
      // Nettoyer l'ancien intervalle
      clearInterval(autoSendInterval)
      
      // Programmer le nouvel envoi
      const intervalTime = getIntervalFromFrequency(autoSendFrequency, customValue, customUnit)
      const interval = setInterval(sendAutoReport, intervalTime)
      setAutoSendInterval(interval)
    }
  }, [autoSendFrequency, customValue, customUnit])

  useEffect(() => {
    // Nettoyer l'intervalle quand le composant est démonté
    return () => {
      if (autoSendInterval) {
        clearInterval(autoSendInterval)
      }
    }
  }, [autoSendInterval])

  const handleOpenEmailCard = () => {
    setIsEmailCardOpen(true)
    loadStoredEmails() // Charger les emails quand on ouvre la modal
  }

  const handleCloseEmailCard = () => {
    setIsEmailCardOpen(false)
    setEmail("")
    setSelectedEmail("")
  }

  const handleEmailSelect = (selectedValue) => {
    setSelectedEmail(selectedValue)
    setEmail(selectedValue)
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
        
        // Recharger les emails après envoi pour mettre à jour la liste
        await loadStoredEmails()
        handleCloseEmailCard()
      } else {
        throw new Error("Erreur lors de la génération du rapport")
      }
      } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.error ||
        "Une erreur est survenue lors de l'envoi du rapport. Veuillez vérifier la configuration SMTP.";
      
      setModalMessage(errorMessage)
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
          <h1 className="text-3xl font-bold tracking-tight text-[#8B4513]">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme SERVO</p>
        </div>
        
        <Button 
          onClick={handleOpenEmailCard}
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#6B8E23]/90 text-white"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg border border-[#D3D3D3]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#6B8E23]" />
                Envoyer le rapport par email
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEmailCard}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Section email avec input et dropdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Adresse email de destination
                  </Label>
                  
                  {/* Bouton d'activation/désactivation */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#8B4513]">Automatique</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isAutoSend ? 'bg-[#6B8E23]' : 'bg-gray-300'
                      }`}
                      onClick={handleAutoSendToggle}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isAutoSend ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {/* Input pour email */}
                  <div className="flex-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@servo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-[#D3D3D3] focus:border-[#6B8E23] focus:ring-[#6B8E23]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleGenerateReport()
                        }
                      }}
                    />
                  </div>
                  
                  {/* Dropdown simple pour emails récents */}
                  <Select onValueChange={handleEmailSelect} value={selectedEmail}>
                    <SelectTrigger className="w-12 px-3 border-[#D3D3D3]">
                      <ChevronDown className="h-4 w-4 text-[#6B8E23]" />
                    </SelectTrigger>
                    <SelectContent className="w-64 border border-[#D3D3D3]">
                      {loadingEmails ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#6B8E23]" />
                            <span>Chargement...</span>
                          </div>
                        </SelectItem>
                      ) : storedEmails.length > 0 ? (
                        storedEmails.map((emailItem) => (
                          <SelectItem key={emailItem.id || emailItem.email} value={emailItem.email}>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-[#556B2F]" />
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

                {/* Sélection de fréquence - affichée seulement quand automatique est activé */}
                {isAutoSend && (
                  <div className="space-y-3 pt-2 border-t border-[#D3D3D3]">
                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="text-sm font-medium text-[#8B4513]">
                        Fréquence d'envoi automatique
                      </Label>
                      <Select 
                        value={autoSendFrequency} 
                        onValueChange={setAutoSendFrequency}
                      >
                        <SelectTrigger className="w-full border-[#D3D3D3]">
                          <SelectValue placeholder="Choisir la fréquence" />
                        </SelectTrigger>
                        <SelectContent className="border border-[#D3D3D3]">
                          <SelectItem value="custom">Personnalisée</SelectItem>
                          <SelectItem value="daily">Quotidiennement</SelectItem>
                          <SelectItem value="weekly">Hebdomadairement</SelectItem>
                          <SelectItem value="monthly">Mensuellement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Configuration de fréquence personnalisée */}
                    {autoSendFrequency === "custom" && (
                      <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="customValue" className="text-sm font-medium text-[#8B4513]">
                            Valeur
                          </Label>
                          <Input
                            id="customValue"
                            type="number"
                            min="1"
                            max="365"
                            value={customValue}
                            onChange={(e) => setCustomValue(parseInt(e.target.value) || 1)}
                            className="w-full border-[#D3D3D3]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customUnit" className="text-sm font-medium text-[#8B4513]">
                            Unité
                          </Label>
                          <Select 
                            value={customUnit} 
                            onValueChange={setCustomUnit}
                          >
                            <SelectTrigger className="w-full border-[#D3D3D3]">
                              <SelectValue placeholder="Unité" />
                            </SelectTrigger>
                            <SelectContent className="border border-[#D3D3D3]">
                              <SelectItem value="hours">Heures</SelectItem>
                              <SelectItem value="days">Jours</SelectItem>
                              <SelectItem value="weeks">Semaines</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Aperçu de la fréquence sélectionnée */}
                    {isAutoSend && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700">
                          <strong className="text-[#8B4513]">Fréquence configurée :</strong><br />
                          {autoSendFrequency === "custom" 
                            ? getCustomFrequencyText(customValue, customUnit)
                            : getFrequencyText(autoSendFrequency)
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCloseEmailCard}
                  disabled={isLoading}
                  className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isLoading || !email.trim()}
                  className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#6B8E23]/90 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {isLoading ? "Envoi..." : isAutoSend ? "Enregistrer" : "Envoyer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="border border-[#D3D3D3]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#8B4513]">
              <Mail className="h-5 w-5 text-[#6B8E23]" />
              {isAutoSend ? "Envoi automatique activé" : "Rapport envoyé"}
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {isAutoSend 
                  ? `Rapport envoyé ${getFrequencyText(autoSendFrequency, customValue, customUnit)}` 
                  : "Veuillez vérifier votre E-mail"
                }
              </p>
            </DialogTitle>
            <DialogDescription className="pt-4 text-gray-600">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleCloseModal}
              className="bg-[#6B8E23] hover:bg-[#6B8E23]/90 text-white"
            >
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