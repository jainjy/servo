import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, PlusCircle, Tag, Briefcase, Users, CheckCircle } from "lucide-react"
import api from "@/lib/api"

interface Service {
  id: string
  name: string
  description: string
  category: string
  images: string[]
  metiers: Array<{
    id: number
    libelle: string
  }>
  vendorsCount: number
  isFromMetier: boolean
  status: string
}

interface AvailableServicesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceAssociated: () => void
}

export function AvailableServicesModal({ open, onOpenChange, onServiceAssociated }: AvailableServicesModalProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchAvailableServices()
    }
  }, [open])

  const fetchAvailableServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/professional/services/available')
      setServices(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des services disponibles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssociateService = async (serviceId: string) => {
    try {
      setActionLoading(serviceId)
      await api.post(`/professional/services/${serviceId}/associate`)
      onServiceAssociated()
      // Retirer le service de la liste
      setServices(prev => prev.filter(s => s.id !== serviceId))
    } catch (error: any) {
      console.error('Erreur lors de l\'association:', error)
      alert(error.response?.data?.error || 'Erreur lors de l\'association')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.metiers.some(metier => 
      metier.libelle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Services Disponibles</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajoutez de nouveaux services à votre profil professionnel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-input"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-border bg-card p-4 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Aucun service trouvé' : 'Tous les services sont associés'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Aucun service ne correspond à votre recherche.' 
                  : 'Vous avez déjà associé tous les services disponibles pour vos métiers.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredServices.map((service) => (
                <Card key={service.id} className="border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-foreground">
                        {service.name}
                      </h4>
                      
                      {service.description && (
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {service.category}
                        </Badge>
                        
                        {service.metiers.map(metier => (
                          <Badge key={metier.id} variant="secondary" className="text-xs">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {metier.libelle}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{service.vendorsCount} prestataire(s) actif(s)</span>
                        </div>
                        
                        {service.isFromMetier && (
                          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-200">
                            Recommandé
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAssociateService(service.id)}
                      disabled={actionLoading === service.id}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
                    >
                      {actionLoading === service.id ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <PlusCircle className="h-4 w-4 mr-2" />
                      )}
                      Ajouter
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}