import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, Trash2, MapPin, Star, Users, Clock, Loader2, X } from "lucide-react"
import api from "@/lib/api"
import { toast } from "@/components/ui/sonner"

interface Experience {
  id: string
  title: string
  name: string
  type: string
  category: string
  location: string
  provider: string
  price: string
  duration: string
  capacity: string
  bookings: number
  rating: number
  status: string
}

export function TourismTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterLocation, setFilterLocation] = useState<string>("")

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("📊 Chargement des expériences touristiques...")

      const response = await api.get('/admin/tourisme', {
        params: {
          limit: 50,
          page: 1
        }
      })

      console.log("📊 Réponse API tourisme:", response.data)

      const listings = response.data?.data || response.data || []

      const transformedExperiences = listings.map((listing: any, index: number) => ({
        id: listing.id || `TOU${String(index + 1).padStart(3, '0')}`,
        title: listing.title || '',
        name: listing.title || '',
        type: listing.type || 'tour',
        category: listing.type || 'Expérience',
        location: listing.city || 'Non spécifiée',
        provider: listing.host?.firstName && listing.host?.lastName 
          ? `${listing.host.firstName} ${listing.host.lastName}`
          : listing.hostName || 'Prestataire inconnu',
        price: listing.price ? String(listing.price) : '0',
        duration: listing.duration || '2h',
        capacity: listing.maxGuests ? String(listing.maxGuests) : '0',
        bookings: listing.bookings ? listing.bookings.length : 0,
        rating: listing.rating || 4.5,
        status: listing.available ? 'active' : 'suspended'
      }))

      console.log("🎯 Expériences transformées:", transformedExperiences)

      setExperiences(transformedExperiences)
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error)
      setError("Erreur lors du chargement des expériences")
      setExperiences([])
    } finally {
      setLoading(false)
    }
  }

  const handleView = (experience: Experience) => {
    setSelectedExperience(experience)
    setViewModalOpen(true)
  }

  const handleDelete = async (experience: Experience) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${experience.name}" ?`)) {
      return
    }

    try {
      setDeletingId(experience.id)
      console.log("🗑️ Suppression de l'expérience:", experience.id)

      await api.delete(`/admin/tourisme/${experience.id}`)

      setExperiences(experiences.filter(e => e.id !== experience.id))
      toast.success("Expérience supprimée avec succès")
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error)
      toast.error("Erreur lors de la suppression de l'expérience")
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      active: { label: "Actif", className: "bg-success/20 text-success" },
      suspended: { label: "Suspendu", className: "bg-destructive/20 text-destructive" },
      draft: { label: "Brouillon", className: "bg-muted text-muted-foreground" },
    }
    const config = variants[status] || variants.active
    return <Badge className={config.className}>{config.label}</Badge>
  }

  // Get unique values for filters
  const uniqueTypes = Array.from(new Set(experiences.map(e => e.type)))
  const uniqueLocations = Array.from(new Set(experiences.map(e => e.location)))
  const uniqueStatuses = Array.from(new Set(experiences.map(e => e.status)))

  // Apply filters
  const filteredExperiences = experiences.filter(
    (exp) => {
      const matchesSearch =
        exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = !filterType || exp.type === filterType
      const matchesStatus = !filterStatus || exp.status === filterStatus
      const matchesLocation = !filterLocation || exp.location === filterLocation

      return matchesSearch && matchesType && matchesStatus && matchesLocation
    }
  )

  const hasActiveFilters = filterType || filterStatus || filterLocation

  const clearFilters = () => {
    setFilterType("")
    setFilterStatus("")
    setFilterLocation("")
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une expérience..."
                disabled
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted rounded"></div>
                  <div className="h-3 w-20 bg-muted rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted rounded"></div>
                    <div className="h-6 w-20 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="h-3 w-32 bg-muted rounded"></div>
                <div className="h-3 w-40 bg-muted rounded"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une expérience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button onClick={fetchExperiences} className="bg-success hover:bg-success/90">
            Réessayer
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une expérience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              {hasActiveFilters && <Badge className="ml-2 bg-primary text-white">✓</Badge>}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filtrer par:</h3>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Statut</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status === 'active' ? 'Actif' : status === 'suspended' ? 'Suspendu' : 'Brouillon'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Localisation</label>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Tous les lieux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les lieux</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-medium">Aucune expérience trouvée</p>
            <p className="text-sm">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                      {experience.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">ID: {experience.id}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {experience.category}
                      </Badge>
                      {getStatusBadge(experience.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{experience.location}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Prestataire:</span>
                    <span className="text-sm font-medium text-foreground">{experience.provider}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Prix:</span>
                    <span className="text-lg font-bold text-foreground">€{experience.price}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{experience.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{experience.capacity} max</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium text-foreground">{experience.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {experience.bookings} réservations
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(experience)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(experience)}
                    disabled={deletingId === experience.id}
                  >
                    {deletingId === experience.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Détails de l'expérience
            </DialogTitle>
          </DialogHeader>

          {selectedExperience && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedExperience.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">ID: {selectedExperience.id}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline">{selectedExperience.category}</Badge>
                    {getStatusBadge(selectedExperience.status)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">€{selectedExperience.price}</p>
                  <p className="text-xs text-muted-foreground">Prix par personne</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground font-semibold">LOCALISATION</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedExperience.location}
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground font-semibold">PRESTATAIRE</p>
                  <p className="text-foreground font-medium">{selectedExperience.provider}</p>
                </div>

                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground font-semibold">DURÉE</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedExperience.duration}
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground font-semibold">CAPACITÉ</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {selectedExperience.capacity} participants max
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground font-semibold">RÉSERVATIONS</p>
                  <p className="text-2xl font-bold text-foreground">{selectedExperience.bookings}</p>
                </div>

                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground font-semibold">NOTE MOYENNE</p>
                  <p className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    {selectedExperience.rating}/5
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setViewModalOpen(false)}
                  className="flex-1 border-border"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
