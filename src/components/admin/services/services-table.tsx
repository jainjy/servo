import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ServiceModal } from "./service-modal"
import { ServiceDetailsModal } from "./service-details-modal"
import { Search, Eye, Edit, Trash2, Star, Image as ImageIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
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

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

const statusColors = {
  active: "bg-[#6B8E23]/20 text-[#6B8E23]",
  inactive: "bg-[#D3D3D3]/20 text-gray-800",
}

export function ServicesTable() {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [displayedServices, setDisplayedServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | undefined>()
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewService, setViewService] = useState<Service | undefined>()
  const [loading, setLoading] = useState(true)
  const [loadingAll, setLoadingAll] = useState(false)
  
  // Pagination pour l'affichage
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Charger tous les services au début
  useEffect(() => {
    loadAllServices()
  }, [])

  // Mettre à jour les services affichés quand on change de page ou quand les données changent
  useEffect(() => {
    if (allServices.length > 0) {
      updateDisplayedServices()
    }
  }, [currentPage, allServices, searchQuery])

  const loadAllServices = async () => {
    try {
      setLoadingAll(true)
      let allLoadedServices: Service[] = []
      let page = 1
      let hasMore = true
      
      // Charger toutes les pages jusqu'à ce qu'il n'y ait plus de services
      while (hasMore) {
        const response = await api.get('/services', {
          params: { page, limit: 100 } // On prend le maximum à chaque requête
        })
        
        const services = response.data.data || response.data
        
        if (services.length === 0) {
          hasMore = false
          break
        }
        
        allLoadedServices = [...allLoadedServices, ...services]
        
        // Vérifier si on a chargé tous les services
        const total = response.data.pagination?.total || 0
        if (total > 0 && allLoadedServices.length >= total) {
          hasMore = false
        } else if (services.length < 100) {
          hasMore = false
        } else {
          page++
          // Petite pause pour ne pas surcharger le serveur
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      setAllServices(allLoadedServices)
      setTotalPages(Math.ceil(allLoadedServices.length / itemsPerPage))
      
      toast.success(`${allLoadedServices.length} services chargés`)
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error)
      toast.error("Erreur lors du chargement des services")
    } finally {
      setLoading(false)
      setLoadingAll(false)
    }
  }

  const updateDisplayedServices = () => {
    if (searchQuery) {
      // Si recherche, filtrer tous les services
      const filtered = allServices.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.metiers.some(metier =>
            metier.libelle.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
      setDisplayedServices(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
      setCurrentPage(1) // Retour à la première page en cas de recherche
    } else {
      // Sinon, paginer normalement
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedServices = allServices.slice(startIndex, endIndex)
      setDisplayedServices(paginatedServices)
    }
  }

  // Navigation
  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value)
    setItemsPerPage(newItemsPerPage)
    setTotalPages(Math.ceil(allServices.length / newItemsPerPage))
    setCurrentPage(1) // Retour à la première page
  }

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
      toast.success("Service supprimé avec succès")
      
      // Mettre à jour la liste locale
      const updatedServices = allServices.filter(s => s.id !== service.id)
      setAllServices(updatedServices)
      setTotalPages(Math.ceil(updatedServices.length / itemsPerPage))
      
      // Si on est sur la dernière page et qu'elle devient vide, revenir à la page précédente
      if (displayedServices.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression"
      )
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
      <Card 
        className="flex flex-col gap-4 p-6 items-center justify-center"
        style={{ 
          backgroundColor: '#FFFFFF0',
          borderColor: '#D3D3D3'
        }}
      >
        <div className="w-16 h-16 border-4 border-t-transparent border-[#6B8E23] rounded-full animate-spin"></div>
        <div className="text-center text-gray-800">
          Chargement des services...
          {loadingAll && <div className="text-sm mt-2">Chargement de tous les services...</div>}
        </div>
      </Card>
    )
  }

// ... (code précédent reste le même jusqu'au rendu)

return (
    <>
      <Card 
        className="mb-6"
        style={{ 
          backgroundColor: '#FFFFFF0',
          borderColor: '#D3D3D3'
        }}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search 
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" 
                style={{ color: '#8B4513' }}
              />
              <Input
                type="search"
                placeholder="Rechercher par nom, catégorie ou métier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  borderColor: '#D3D3D3',
                  color: '#556B2F'
                }}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-800">Afficher :</span>
                <select
                  value={itemsPerPage.toString()}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  style={{ 
                    borderColor: '#D3D3D3',
                    color: '#556B2F'
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-800">services/page</span>
              </div>
              
              <Button 
                variant="outline" 
                style={{ 
                  borderColor: '#D3D3D3',
                  color: '#6B8E23'
                }}
              >
                Filtres
              </Button>
            </div>
          </div>
          
          {/* Statistiques */}
          <div className="mt-4 text-sm text-gray-800">
            {searchQuery ? (
              <span>{displayedServices.length} service(s) trouvé(s) pour "{searchQuery}"</span>
            ) : (
              <span>
                Page {currentPage} sur {totalPages} • 
                Services {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, allServices.length)} sur {allServices.length} au total
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {displayedServices.length === 0 ? (
            <div className="text-center text-gray-800 py-8">
              {searchQuery ? "Aucun service trouvé pour votre recherche" : "Aucun service disponible"}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedServices.map((service) => {
                  const stats = getVendorStats(service)

                  return (
                    <Card 
                      key={service.id} 
                      className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-transparent hover:border-l-[#6B8E23]"
                      style={{ 
                        backgroundColor: '#FFFFFF0',
                        borderColor: '#D3D3D3'
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 
                            className="font-semibold line-clamp-2 mb-1"
                            style={{ color: '#556B2F' }}
                          >
                            {service.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: '#D3D3D3',
                                color: '#8B4513'
                              }}
                            >
                              {service.category || "Non catégorisé"}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${statusColors[service.status as keyof typeof statusColors]}`}
                            >
                              {service.status === "active" ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                        </div>
                        {service.images.length > 0 ? (
                          <div 
                            className="w-12 h-12 rounded flex items-center justify-center border"
                            style={{ 
                              backgroundColor: '#D3D3D3'/20,
                              borderColor: '#D3D3D3'
                            }}
                          >
                            <ImageIcon 
                              className="h-6 w-6" 
                              style={{ color: '#8B4513' }}
                            />
                          </div>
                        ) : null}
                      </div>

                      {service.description && (
                        <p className="text-sm text-gray-800 mb-4 line-clamp-2">
                          {service.description}
                        </p>
                      )}

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">Métiers:</span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                            {service.metiers.slice(0, 2).map(metier => (
                              <Badge 
                                key={metier.id} 
                                variant="outline" 
                                className="text-xs"
                                style={{ 
                                  borderColor: '#D3D3D3',
                                  color: '#6B8E23'
                                }}
                              >
                                {metier.libelle}
                              </Badge>
                            ))}
                            {service.metiers.length > 2 && (
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ 
                                  borderColor: '#D3D3D3',
                                  color: '#8B4513'
                                }}
                              >
                                +{service.metiers.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">Prestataires:</span>
                          <span 
                            className="text-sm font-medium"
                            style={{ color: '#556B2F' }}
                          >
                            {stats.totalVendors}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">Réservations totales:</span>
                          <span 
                            className="text-sm font-medium"
                            style={{ color: '#556B2F' }}
                          >
                            {stats.totalBookings}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap -2 mt-4 pt-4 border-t" style={{ borderColor: '#D3D3D3' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(service)}
                          className="flex-1 hover:bg-[#556B2F]/10"
                          style={{ 
                            borderColor: '#D3D3D3',
                            color: '#556B2F'
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(service)}
                          className="flex-1 hover:bg-[#6B8E23]/10"
                          style={{ 
                            borderColor: '#D3D3D3',
                            color: '#6B8E23'
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service)}
                        className="w-full mt-2 hover:bg-[#8B4513]/10"
                        style={{ 
                          borderColor: '#8B4513'/30,
                          color: '#8B4513'
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </Card>
                  )
                })}
              </div>

              {/* Navigation par boutons (seulement si pas de recherche) */}
              {!searchQuery && allServices.length > itemsPerPage && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: '#D3D3D3' }}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-800">
                      Page {currentPage} sur {totalPages} • 
                      Services {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, allServices.length)} sur {allServices.length} au total
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        style={{ 
                          borderColor: '#D3D3D3',
                          color: '#556B2F'
                        }}
                        className="hidden sm:inline-flex"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        style={{ 
                          borderColor: '#D3D3D3',
                          color: '#556B2F'
                        }}
                        className="inline-flex"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Précédent
                      </Button>
                      
                      {/* Numéros de page - visible sur desktop */}
                      <div className="hidden md:flex items-center gap-1">
                        {(() => {
                          // Calculer les pages à afficher
                          let startPage = Math.max(1, currentPage - 2)
                          let endPage = Math.min(totalPages, currentPage + 2)
                          
                          // Ajuster si on est proche du début
                          if (currentPage <= 3) {
                            endPage = Math.min(5, totalPages)
                          }
                          
                          // Ajuster si on est proche de la fin
                          if (currentPage >= totalPages - 2) {
                            startPage = Math.max(1, totalPages - 4)
                          }
                          
                          const pages = []
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(i)
                          }
                          
                          return pages.map(pageNum => (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              style={currentPage === pageNum ? {
                                backgroundColor: '#6B8E23',
                                color: 'white'
                              } : {
                                borderColor: '#D3D3D3',
                                color: '#556B2F'
                              }}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          ))
                        })()}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage >= totalPages}
                        style={{ 
                          borderColor: '#D3D3D3',
                          color: '#556B2F'
                        }}
                        className="inline-flex"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPage >= totalPages}
                        style={{ 
                          borderColor: '#D3D3D3',
                          color: '#556B2F'
                        }}
                        className="hidden sm:inline-flex"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Indicateur mobile */}
                    <div className="text-sm text-gray-800 sm:hidden">
                      {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, allServices.length)} sur {allServices.length}
                    </div>
                  </div>
                  
                  {/* Affichage simple pour mobile */}
                  <div className="flex justify-center mt-4 md:hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800">Page:</span>
                      <select
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                        style={{ 
                          borderColor: '#D3D3D3',
                          color: '#556B2F'
                        }}
                      >
                        {Array.from({ length: totalPages }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <span className="text-sm text-gray-800">sur {totalPages}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <ServiceModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        service={selectedService}
        mode="edit"
        onServiceUpdated={loadAllServices}
      />

      <ServiceDetailsModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        service={viewService}
      />
    </>
  )
}