import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Eye, 
  Briefcase, 
  Users, 
  Tag, 
  CheckCircle, 
  XCircle,
  PlusCircle,
  Clock
} from "lucide-react"
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
  vendors: Array<{
    id: string
    name: string
    isCurrentUser: boolean
  }>
  isAssociated: boolean
  isFromMetier: boolean
  status: string
  vendorsCount?: number
}

interface ProfessionalServicesTableProps {
  activeTab: string
  searchQuery: string
  onServiceUpdated: () => void
}

export function ProfessionalServicesTable({ 
  activeTab, 
  searchQuery, 
  onServiceUpdated 
}: ProfessionalServicesTableProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [activeTab])

  const fetchServices = async () => {
    try {
      setLoading(true)
      let endpoint = '/professional/services'
      if (activeTab === 'available') {
        endpoint = '/professional/services/available'
      }
      
      const response = await api.get(endpoint)
      setServices(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssociateService = async (serviceId: string) => {
    try {
      setActionLoading(serviceId)
      await api.post(`/professional/services/${serviceId}/associate`)
      onServiceUpdated()
      await fetchServices() // Recharger la liste
    } catch (error: any) {
      console.error('Erreur lors de l\'association:', error)
      alert(error.response?.data?.error || 'Erreur lors de l\'association')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDisassociateService = async (serviceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce service ?")) {
      return
    }

    try {
      setActionLoading(serviceId)
      await api.delete(`/professional/services/${serviceId}/disassociate`)
      onServiceUpdated()
      await fetchServices() // Recharger la liste
    } catch (error: any) {
      console.error('Erreur lors de la désassociation:', error)
      alert(error.response?.data?.error || 'Erreur lors de la désassociation')
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-border bg-card p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </div>
              <div className="h-8 bg-muted rounded w-24"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {activeTab === 'associated' ? 'Aucun service associé' : 'Aucun service disponible'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {activeTab === 'associated' 
            ? 'Commencez par ajouter des services à votre profil.' 
            : 'Tous les services correspondant à vos métiers sont déjà associés.'}
        </p>
        {activeTab === 'associated' && (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Découvrir les services disponibles
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredServices.map((service) => (
        <Card key={service.id} className="border-border bg-card p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {service.description || "Aucune description disponible"}
                  </p>
                </div>
                
                {activeTab === 'associated' && (
                  <Badge variant="secondary" className="bg-success/20 text-success whitespace-nowrap">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {service.category}
                </Badge>
                
                {service.metiers.slice(0, 2).map(metier => (
                  <Badge key={metier.id} variant="secondary" className="text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {metier.libelle}
                  </Badge>
                ))}
                {service.metiers.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{service.metiers.length - 2} autres
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {activeTab === 'associated' 
                      ? `${service.vendors.length} prestataire(s)` 
                      : `${service.vendorsCount} prestataire(s) actif(s)`}
                  </span>
                </div>
                
                {service.isFromMetier && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Recommandé par vos métiers</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[200px]">
              {activeTab === 'associated' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-accent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les demandes
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisassociateService(service.id)}
                    disabled={actionLoading === service.id}
                  >
                    {actionLoading === service.id ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Retirer
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleAssociateService(service.id)}
                  disabled={actionLoading === service.id}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {actionLoading === service.id ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <PlusCircle className="h-4 w-4 mr-2" />
                  )}
                  Associer ce service
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}