

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react"

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

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vendor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (booking: (typeof bookings)[0]) => {
    console.log("Voir les détails:", booking)
    // Implémentez la logique de visualisation des détails ici
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

  return (
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
  )
}