

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TourismModal } from "./tourism-modal"
import { Search, Filter, Eye, Edit, Trash2, MapPin, Star, Users, Clock } from "lucide-react"

const experiences = [
  {
    id: "TOU001",
    title: "Visite Guidée Centre Historique",
    name: "Visite Guidée Centre Historique",
    type: "visit",
    category: "Visite Culturelle",
    location: "Paris 4ème",
    provider: "Paris Tours",
    price: "35",
    duration: "2h",
    capacity: "15",
    bookings: 234,
    rating: 4.8,
    status: "active",
  },
  {
    id: "TOU002",
    title: "Dégustation Vins & Fromages",
    name: "Dégustation Vins & Fromages",
    type: "activity",
    category: "Gastronomie",
    location: "Lyon",
    provider: "Saveurs Lyonnaises",
    price: "65",
    duration: "3h",
    capacity: "12",
    bookings: 156,
    rating: 4.9,
    status: "active",
  },
  {
    id: "TOU003",
    title: "Randonnée Mont Blanc",
    name: "Randonnée Mont Blanc",
    type: "tour",
    category: "Nature & Sport",
    location: "Chamonix",
    provider: "Alpes Aventure",
    price: "120",
    duration: "1 jour",
    capacity: "8",
    bookings: 89,
    rating: 4.7,
    status: "active",
  },
  {
    id: "TOU004",
    title: "Atelier Pâtisserie Française",
    name: "Atelier Pâtisserie Française",
    type: "event",
    category: "Atelier",
    location: "Paris 11ème",
    provider: "École Gourmande",
    price: "85",
    duration: "4h",
    capacity: "10",
    bookings: 178,
    rating: 4.9,
    status: "active",
  },
  {
    id: "TOU005",
    title: "Croisière Seine au Coucher du Soleil",
    name: "Croisière Seine au Coucher du Soleil",
    type: "visit",
    category: "Croisière",
    location: "Paris",
    provider: "Bateaux Parisiens",
    price: "45",
    duration: "1h30",
    capacity: "50",
    bookings: 567,
    rating: 4.6,
    status: "active",
  },
]

export function TourismTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<(typeof experiences)[0] | undefined>()

  const handleEdit = (experience: (typeof experiences)[0]) => {
    setSelectedExperience(experience)
    setEditModalOpen(true)
  }

  const handleView = (experience: (typeof experiences)[0]) => {
    console.log("Voir l'expérience:", experience)
    // Implémentez la logique de visualisation ici
  }

  const handleDelete = (experience: (typeof experiences)[0]) => {
    console.log("Supprimer l'expérience:", experience)
    // Implémentez la logique de suppression ici
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

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

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
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(experience)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(experience)}
                className="w-full mt-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      <TourismModal open={editModalOpen} onOpenChange={setEditModalOpen} experience={selectedExperience} mode="edit" />
    </>
  )
}