import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ServiceModal } from "./service-modal"
import { ServiceDetailsModal } from "./service-details-modal"
import { Search, Eye, Edit, Trash2, Star, Image as ImageIcon } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface Service {
  id: string
  name: string
  description: string
  category: string
  categoryId?: number
  images: string[]
  metiers: Array<{
    id: number
    libelle: string
  }>
  vendors: Array<{
    id: string
    name: string
    rating: number
    bookings: number
  }>
  status: string
}

const statusColors = {
  active: "bg-success/20 text-success",
  inactive: "bg-muted text-muted-foreground",
}

export function ServicesTable() {
  const [services, setServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | undefined>()
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewService, setViewService] = useState<Service | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.get('/services')
      setServices(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.metiers.some(metier =>
        metier.libelle.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setEditModalOpen(true)
  }

  const handleView = (service: Service) => {
    setViewService(service)
    setViewModalOpen(true)
  }

  const handleDelete = async (service: Service) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le service "${service.name}" ?`)) {
      return
    }

    try {
      await api.delete(`/services/${service.id}`)
      await fetchServices() // Recharger la liste
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression"
      );
    }
  }

  const getVendorStats = (service: Service) => {
    const totalVendors = service.vendors.length
    const avgRating = service.vendors.reduce((acc, vendor) => acc + vendor.rating, 0) / totalVendors || 0
    const totalBookings = service.vendors.reduce((acc, vendor) => acc + vendor.bookings, 0)

    return { totalVendors, avgRating, totalBookings }
  }

  if (loading) {
    return (
      <Card className="bg-card flex flex-col gap-4 border-border p-6">
        <img src="/loading.gif" alt="" className='w-24 h-24' />
        <div className="text-center text-muted-foreground">Chargement des services...</div>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, catégorie ou métier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
            <Button variant="outline" className="border-border bg-transparent">
              Filtres
            </Button>
          </div>
        </div>

        <div className="p-6">
          {filteredServices.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery ? "Aucun service trouvé pour votre recherche" : "Aucun service disponible"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const stats = getVendorStats(service)

                return (
                  <Card key={service.id} className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="border-border text-foreground text-xs">
                            {service.category || "Non catégorisé"}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={statusColors[service.status as keyof typeof statusColors]}
                          >
                            {service.status === "active" ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                      </div>
                      {service.images.length > 0 ? (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      ) : null}
                    </div>

                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Métiers:</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                          {service.metiers.slice(0, 2).map(metier => (
                            <Badge key={metier.id} variant="outline" className="text-xs">
                              {metier.libelle}
                            </Badge>
                          ))}
                          {service.metiers.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.metiers.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Prestataires:</span>
                        <span className="text-sm font-medium text-foreground">
                          {stats.totalVendors}
                        </span>
                      </div>

                      {/* <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Note moyenne:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="text-sm font-medium text-foreground">
                            {stats.avgRating.toFixed(1)}
                          </span>
                        </div>
                      </div> */}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Réservations totales:</span>
                        <span className="text-sm font-medium text-foreground">
                          {stats.totalBookings}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(service)}
                        className="flex-1 border-border hover:bg-accent"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                        className="flex-1 border-border hover:bg-accent"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(service)}
                      className="w-full mt-2"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </Card>

      <ServiceModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        service={selectedService}
        mode="edit"
        onServiceUpdated={fetchServices}
      />

      <ServiceDetailsModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        service={viewService}
      />
    </>
  )
}