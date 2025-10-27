import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, CheckCircle, XCircle, MessageSquare, Calendar, MapPin, User, Building } from "lucide-react"

const bookings = [
  {
    id: "1",
    service: "Nettoyage complet",
    client: "Marie Dubois",
    vendor: "CleanPro Services",
    startAt: "2024-03-15T10:00:00",
    endAt: "2024-03-15T14:00:00",
    status: "confirmed",
    price: 120,
    address: "15 rue de la Paix, Paris",
    description: "Nettoyage complet de l'appartement incluant salle de bain, cuisine et pièces de vie.",
    phone: "+33 1 23 45 67 89",
    email: "marie.dubois@email.com",
    notes: "Le client a des animaux domestiques."
  },
  {
    id: "2",
    service: "Plomberie - Réparation fuite",
    client: "Jean Martin",
    vendor: "Plomberie Express",
    startAt: "2024-03-16T09:00:00",
    endAt: "2024-03-16T11:00:00",
    status: "pending",
    price: 180,
    address: "42 avenue Victor Hugo, Lyon",
    description: "Réparation d'une fuite sous l'évier de la cuisine.",
    phone: "+33 4 56 78 90 12",
    email: "jean.martin@email.com",
    notes: "Accès par le code 1234 à l'entrée."
  },
  {
    id: "3",
    service: "Déménagement",
    client: "Sophie Laurent",
    vendor: "Déménageurs Pro",
    startAt: "2024-03-18T08:00:00",
    endAt: "2024-03-18T18:00:00",
    status: "confirmed",
    price: 450,
    address: "8 boulevard Gambetta, Marseille",
    description: "Déménagement complet d'un appartement 3 pièces.",
    phone: "+33 6 12 34 56 78",
    email: "sophie.laurent@email.com",
    notes: "Meubles à démonter sur place."
  },
  {
    id: "4",
    service: "Électricité - Installation",
    client: "Pierre Durand",
    vendor: "Électro Services",
    startAt: "2024-03-20T14:00:00",
    endAt: "2024-03-20T17:00:00",
    status: "cancelled",
    price: 200,
    address: "23 rue Nationale, Bordeaux",
    description: "Installation de prises électriques supplémentaires dans le salon.",
    phone: "+33 5 67 89 01 23",
    email: "pierre.durand@email.com",
    notes: "Annulé à la demande du client."
  },
]

const statusColors = {
  confirmed: "bg-success/20 text-success",
  pending: "bg-warning/20 text-warning",
  cancelled: "bg-destructive/20 text-destructive",
  completed: "bg-chart-1/20 text-blue-500",
}

const statusLabels = {
  confirmed: "Confirmée",
  pending: "En attente",
  cancelled: "Annulée",
  completed: "Terminée",
}

export function BookingsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vendor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (booking: (typeof bookings)[0]) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
  }

  const handleConfirm = (booking: (typeof bookings)[0]) => {
    console.log("Confirmer la réservation:", booking)
    // Implémentez la logique de confirmation ici
  }

  const handleContact = (booking: (typeof bookings)[0]) => {
    console.log("Contacter:", booking)
    // Implémentez la logique de contact ici
  }

  const handleCancel = (booking: (typeof bookings)[0]) => {
    console.log("Annuler la réservation:", booking)
    // Implémentez la logique d'annulation ici
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedBooking(null)
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
                placeholder="Rechercher par service, client ou prestataire..."
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
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                      {booking.service}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{booking.address}</p>
                    <Badge 
                      variant="secondary" 
                      className={statusColors[booking.status as keyof typeof statusColors]}
                    >
                      {statusLabels[booking.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg text-foreground">
                      {booking.price} €
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span className="font-medium text-foreground">{booking.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prestataire:</span>
                      <span className="font-medium text-foreground">{booking.vendor}</span>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="font-medium text-foreground">
                      {new Date(booking.startAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(booking.startAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(booking.endAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(booking)}
                    className="flex-1 border-border hover:bg-accent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Détails
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContact(booking)}
                    className="flex-1 border-border hover:bg-accent"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                </div>

                <div className="flex gap-2 mt-2">
                  {booking.status === "pending" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleConfirm(booking)}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmer
                    </Button>
                  )}
                  
                  {booking.status !== "cancelled" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(booking)}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Modal de détails */}
      <Dialog open={isDetailModalOpen} onOpenChange={closeDetailModal}>
        <DialogContent className="max-w-2xl bg-card border-border">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Détails de la réservation
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* En-tête avec service et statut */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedBooking.service}</h2>
                    <Badge 
                      variant="secondary" 
                      className={`mt-2 ${statusColors[selectedBooking.status as keyof typeof statusColors]}`}
                    >
                      {statusLabels[selectedBooking.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{selectedBooking.price} €</span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedBooking.description}</p>
                </div>

                {/* Informations de contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Client
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Nom:</span>
                        <p className="font-medium text-foreground">{selectedBooking.client}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Téléphone:</span>
                        <p className="font-medium text-foreground">{selectedBooking.phone}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium text-foreground">{selectedBooking.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Prestataire
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Entreprise:</span>
                        <p className="font-medium text-foreground">{selectedBooking.vendor}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adresse et horaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adresse
                    </h3>
                    <p className="text-muted-foreground text-sm">{selectedBooking.address}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Horaires
                    </h3>
                    <div className="text-sm space-y-1">
                      <div className="font-medium text-foreground">
                        {new Date(selectedBooking.startAt).toLocaleDateString("fr-FR", {
                          weekday: 'long',
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-muted-foreground">
                        De {new Date(selectedBooking.startAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} à {new Date(selectedBooking.endAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Notes supplémentaires</h3>
                    <p className="text-muted-foreground text-sm">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => handleContact(selectedBooking)}
                    className="flex-1 border-border hover:bg-accent"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                  
                  {selectedBooking.status === "pending" && (
                    <Button
                      variant="default"
                      onClick={() => handleConfirm(selectedBooking)}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmer
                    </Button>
                  )}
                  
                  {selectedBooking.status !== "cancelled" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancel(selectedBooking)}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}