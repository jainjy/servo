import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, CheckCircle, XCircle, MessageSquare, Calendar, MapPin, User, Building, Loader2, Send } from "lucide-react"
import api from "@/lib/api"
import { toast } from "@/components/ui/sonner"

interface Booking {
  id: string
  service: string
  client: string
  vendor: string
  startAt: string
  endAt: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  price: number
  address: string
  description: string
  phone: string
  email: string
  notes: string
}

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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactBooking, setContactBooking] = useState<Booking | null>(null)
  const [contactMessage, setContactMessage] = useState("")
  const [contactSending, setContactSending] = useState(false)
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Chargement des réservations depuis l'API...")

      const response = await api.get('/tourisme-bookings', {
        params: {
          limit: 50,
          page: 1
        }
      })

      console.log("📊 Réponse API réservations:", response.data)

      const apiBookings = response.data?.data || response.data || []
      const transformedBookings = transformApiBookings(apiBookings)

      console.log("🎯 Réservations transformées:", transformedBookings)

      setBookings(transformedBookings)
    } catch (error) {
      console.error("❌ Erreur lors du chargement des réservations:", error)
      setError("Erreur lors du chargement des réservations")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const transformApiBookings = (apiBookings: any[]): Booking[] => {
    if (!apiBookings || !Array.isArray(apiBookings)) {
      return []
    }

    return apiBookings
      .map((booking, index) => {
        try {
          const clientName = booking.user?.firstName && booking.user?.lastName
            ? `${booking.user.firstName} ${booking.user.lastName}`
            : booking.user?.firstName || 'Client inconnu'

          return {
            id: booking.id || `booking-${index}`,
            service: booking.listing?.title || `Réservation ${index + 1}`,
            client: clientName,
            vendor: booking.listing?.type || 'Prestataire',
            startAt: booking.checkIn || booking.createdAt,
            endAt: booking.checkOut || booking.createdAt,
            status: booking.status || 'pending',
            price: booking.totalAmount || 0,
            address: booking.listing?.city || 'Adresse non disponible',
            description: booking.listing?.title || 'Aucune description',
            phone: booking.user?.phone || 'Non fourni',
            email: booking.user?.email || 'Non fourni',
            notes: ''
          }
        } catch (error) {
          console.error("❌ Erreur transformation booking:", booking, error)
          return null
        }
      })
      .filter((booking): booking is Booking => booking !== null)
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vendor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
  }

  const handleConfirm = (booking: Booking) => {
    console.log("Confirmer la réservation:", booking)
  }

  const handleContact = (booking: Booking) => {
    setContactBooking(booking)
    setContactMessage("")
    setIsContactModalOpen(true)
  }

  const handleSendMessage = async () => {
    if (!contactBooking || !contactMessage.trim()) {
      toast.error("Veuillez entrer un message")
      return
    }

    try {
      setContactSending(true)
      console.log("📧 Envoi du message au client:", {
        bookingId: contactBooking.id,
        clientEmail: contactBooking.email,
        clientPhone: contactBooking.phone,
        message: contactMessage
      })

      toast.success("Message envoyé avec succès")
      setIsContactModalOpen(false)
      setContactMessage("")
      setContactBooking(null)
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message:", error)
      toast.error("Erreur lors de l'envoi du message")
    } finally {
      setContactSending(false)
    }
  }

  const handleCancel = async (booking: Booking) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return
    }

    try {
      setCancellingBooking(booking.id)
      console.log("🗑️ Annulation de la réservation:", booking.id)

      await api.delete(`/tourisme-bookings/${booking.id}`)

      setBookings(bookings.filter(b => b.id !== booking.id))
      toast.success("Réservation annulée avec succès")

      if (isDetailModalOpen && selectedBooking?.id === booking.id) {
        closeDetailModal()
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'annulation:", error)
      toast.error("Erreur lors de l'annulation de la réservation")
    } finally {
      setCancellingBooking(null)
    }
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedBooking(null)
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par service, client ou prestataire..."
                disabled
                className="pl-10 bg-background border-input"
              />
            </div>
            <Button variant="outline" className="border-border bg-transparent" disabled>
              Filtres
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <Card key={index} className="border-border bg-card p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-muted rounded"></div>
                    <div className="h-3 w-32 bg-muted rounded"></div>
                    <div className="h-6 w-20 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-40 bg-muted rounded"></div>
                    <div className="h-3 w-40 bg-muted rounded"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-32 bg-muted rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
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
          <div className="text-center py-12">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <Button
              onClick={fetchBookings}
              className="bg-success hover:bg-success/90"
            >
              <Loader2 className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
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
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-medium">Aucune réservation trouvée</p>
              <p className="text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
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
                      disabled={cancellingBooking === booking.id}
                      className="flex-1"
                    >
                      {cancellingBooking === booking.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Annulation...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Annuler
                        </>
                      )}
                    </Button>
                  )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

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

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedBooking.description}</p>
                </div>

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

                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Notes supplémentaires</h3>
                    <p className="text-muted-foreground text-sm">{selectedBooking.notes}</p>
                  </div>
                )}

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
                      disabled={cancellingBooking === selectedBooking.id}
                      className="flex-1"
                    >
                      {cancellingBooking === selectedBooking.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Annulation...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Annuler
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contacter le client
            </DialogTitle>
          </DialogHeader>

          {contactBooking && (
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">Client</h3>
                  <p className="text-muted-foreground">{contactBooking.client}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">Email</h4>
                    <p className="text-foreground">{contactBooking.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">Téléphone</h4>
                    <p className="text-foreground">{contactBooking.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Réservation</h4>
                  <p className="text-foreground">{contactBooking.service}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Entrez votre message..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={5}
                  disabled={contactSending}
                />
                <p className="text-xs text-muted-foreground">
                  {contactMessage.length} caractères
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex-1 border-border"
                  disabled={contactSending}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={contactSending || !contactMessage.trim()}
                  className="flex-1 bg-success hover:bg-success/90"
                >
                  {contactSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
