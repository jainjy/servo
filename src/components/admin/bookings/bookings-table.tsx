import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, CheckCircle, XCircle, MessageSquare, Calendar, MapPin, User, Building, Loader2, Send, Filter } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

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
  confirmed: "bg-[#6B8E23]/15 text-[#556B2F] border border-[#6B8E23]/30",
  pending: "bg-[#8B4513]/15 text-[#8B4513] border border-[#8B4513]/30",
  cancelled: "bg-[#D3D3D3]/20 text-[#8B4513]/70 border border-[#D3D3D3]",
  completed: "bg-[#556B2F]/15 text-[#6B8E23] border border-[#556B2F]/30",
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
  const [confirmingBooking, setConfirmingBooking] = useState<string | null>(null)
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

  const handleConfirm = async (booking: Booking) => {
    try {
      setConfirmingBooking(booking.id)
      console.log("✅ Confirmation de la réservation:", booking.id)

      await api.put(`/tourisme-bookings/${booking.id}/status`, {
        status: 'confirmed'
      })

      setBookings(bookings.map(b =>
        b.id === booking.id ? { ...b, status: 'confirmed' } : b
      ))
      
      toast.success("Réservation confirmée avec succès")

      if (isDetailModalOpen && selectedBooking?.id === booking.id) {
        setSelectedBooking({ ...selectedBooking, status: 'confirmed' })
      }
    } catch (error) {
      console.error("❌ Erreur lors de la confirmation:", error)
      toast.error("Erreur lors de la confirmation de la réservation")
    } finally {
      setConfirmingBooking(null)
    }
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
      <Card className="bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
        <div className="p-6 border-b border-[#D3D3D3]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B4513]/60" />
              <Input
                type="search"
                placeholder="Rechercher par service, client ou prestataire..."
                disabled
                className="pl-10 bg-[#FFFFFF] border-[#D3D3D3] text-[#8B4513] placeholder:text-[#8B4513]/50"
              />
            </div>
            <Button variant="outline" className="border-[#D3D3D3] bg-transparent text-[#8B4513] hover:bg-[#6B8E23]/5" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <Card key={index} className="border border-[#D3D3D3] bg-[#FFFFFF] p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-[#D3D3D3]/50 rounded"></div>
                    <div className="h-3 w-32 bg-[#D3D3D3]/50 rounded"></div>
                    <div className="h-6 w-20 bg-[#D3D3D3]/50 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-6 w-16 bg-[#D3D3D3]/50 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-40 bg-[#D3D3D3]/50 rounded"></div>
                    <div className="h-3 w-40 bg-[#D3D3D3]/50 rounded"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-32 bg-[#D3D3D3]/50 rounded"></div>
                    <div className="h-3 w-32 bg-[#D3D3D3]/50 rounded"></div>
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
      <Card className="bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
        <div className="p-6 border-b border-[#D3D3D3]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B4513]/60" />
              <Input
                type="search"
                placeholder="Rechercher par service, client ou prestataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#FFFFFF] border-[#D3D3D3] text-[#8B4513] placeholder:text-[#8B4513]/50 focus:border-[#6B8E23] focus:ring-[#6B8E23]/20"
              />
            </div>
            <Button variant="outline" className="border-[#D3D3D3] bg-transparent text-[#8B4513] hover:bg-[#6B8E23]/5">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#8B4513]/10 flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-[#8B4513]" />
            </div>
            <p className="text-[#8B4513] font-medium mb-2">{error}</p>
            <p className="text-sm text-[#8B4513]/60 mb-4">Veuillez réessayer ultérieurement</p>
            <Button
              onClick={fetchBookings}
              className="bg-[#6B8E23] text-white hover:bg-[#556B2F]"
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
      <Card className="bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
        <div className="p-6 border-b border-[#D3D3D3]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B4513]/60" />
              <Input
                type="search"
                placeholder="Rechercher par service, client ou prestataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#FFFFFF] border-[#D3D3D3] text-[#8B4513] placeholder:text-[#8B4513]/50 focus:border-[#6B8E23] focus:ring-[#6B8E23]/20"
              />
            </div>
            <Button variant="outline" className="border-[#D3D3D3] bg-transparent text-[#8B4513] hover:bg-[#6B8E23]/5">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <div className="p-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-[#8B4513]/70">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#6B8E23]/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-[#6B8E23]" />
              </div>
              <p className="font-medium text-[#8B4513]">Aucune réservation trouvée</p>
              <p className="text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="border border-[#D3D3D3] bg-[#FFFFFF] p-6 hover:shadow-md transition-all duration-300 hover:border-[#6B8E23]/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#8B4513] line-clamp-2 mb-1 text-lg">
                        {booking.service}
                      </h3>
                      <p className="text-sm text-[#8B4513]/60 mb-2">{booking.address}</p>
                      <Badge 
                        className={`${statusColors[booking.status as keyof typeof statusColors]} font-medium text-xs px-3 py-1`}
                      >
                        {statusLabels[booking.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl text-[#8B4513]">
                        {booking.price.toLocaleString('fr-FR')} €
                      </span>
                    </div>

                    <div className="space-y-3 text-sm border-t border-[#D3D3D3]/50 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#8B4513]/70">Client:</span>
                        <span className="font-medium text-[#8B4513]">{booking.client}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8B4513]/70">Prestataire:</span>
                        <span className="font-medium text-[#8B4513]">{booking.vendor}</span>
                      </div>
                    </div>

                    <div className="text-sm space-y-2 border-t border-[#D3D3D3]/50 pt-3">
                      <div className="font-medium text-[#8B4513] bg-[#6B8E23]/5 px-3 py-1.5 rounded-lg inline-block">
                        {new Date(booking.startAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-[#8B4513]/70">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(booking.startAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(booking.endAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-[#D3D3D3]/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                      className="flex-1 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/5 hover:text-[#556B2F] hover:border-[#6B8E23]/30"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContact(booking)}
                      className="flex-1 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/5 hover:text-[#556B2F] hover:border-[#6B8E23]/30"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {booking.status === "pending" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleConfirm(booking)}
                        disabled={confirmingBooking === booking.id}
                        className="flex-1 bg-[#6B8E23] text-white hover:bg-[#556B2F]"
                      >
                        {confirmingBooking === booking.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Confirmation...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmer
                          </>
                        )}
                      </Button>
                    )}
                    
                    {booking.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(booking)}
                        disabled={cancellingBooking === booking.id}
                        className="flex-1 border-[#D3D3D3] text-[#8B4513]/70 hover:bg-[#D3D3D3]/20 hover:text-[#8B4513]"
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
        <DialogContent className="max-w-2xl bg-[#FFFFFF] border border-[#D3D3D3] shadow-lg">
          {selectedBooking && (
            <>
              <DialogHeader className="border-b border-[#D3D3D3] pb-4">
                <DialogTitle className="text-[#8B4513] flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B8E23]/10">
                    <Eye className="h-4 w-4 text-[#6B8E23]" />
                  </div>
                  <span>Détails de la réservation</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-[#8B4513]">{selectedBooking.service}</h2>
                    <Badge 
                      className={`mt-2 ${statusColors[selectedBooking.status as keyof typeof statusColors]} font-medium text-sm`}
                    >
                      {statusLabels[selectedBooking.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-[#8B4513] bg-[#6B8E23]/5 px-4 py-2 rounded-lg">
                    {selectedBooking.price.toLocaleString('fr-FR')} €
                  </span>
                </div>

                <div className="bg-[#6B8E23]/5 rounded-lg p-4">
                  <h3 className="font-semibold text-[#8B4513] mb-2">Description</h3>
                  <p className="text-[#8B4513]/70">{selectedBooking.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#8B4513] font-semibold">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B8E23]/10">
                        <User className="h-3 w-3 text-[#6B8E23]" />
                      </div>
                      <span>Client</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="border-b border-[#D3D3D3]/30 pb-2">
                        <span className="text-[#8B4513]/70">Nom:</span>
                        <p className="font-medium text-[#8B4513]">{selectedBooking.client}</p>
                      </div>
                      <div className="border-b border-[#D3D3D3]/30 pb-2">
                        <span className="text-[#8B4513]/70">Téléphone:</span>
                        <p className="font-medium text-[#8B4513]">{selectedBooking.phone}</p>
                      </div>
                      <div>
                        <span className="text-[#8B4513]/70">Email:</span>
                        <p className="font-medium text-[#8B4513]">{selectedBooking.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#8B4513] font-semibold">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B8E23]/10">
                        <Building className="h-3 w-3 text-[#6B8E23]" />
                      </div>
                      <span>Prestataire</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[#8B4513]/70">Entreprise:</span>
                        <p className="font-medium text-[#8B4513]">{selectedBooking.vendor}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#8B4513] font-semibold">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B8E23]/10">
                        <MapPin className="h-3 w-3 text-[#6B8E23]" />
                      </div>
                      <span>Adresse</span>
                    </div>
                    <p className="text-[#8B4513]/70 text-sm bg-[#6B8E23]/5 px-3 py-2 rounded-lg">{selectedBooking.address}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#8B4513] font-semibold">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B8E23]/10">
                        <Calendar className="h-3 w-3 text-[#6B8E23]" />
                      </div>
                      <span>Horaires</span>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="font-medium text-[#8B4513] bg-[#6B8E23]/5 px-3 py-2 rounded-lg">
                        {new Date(selectedBooking.startAt).toLocaleDateString("fr-FR", {
                          weekday: 'long',
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[#8B4513]/70 flex items-center gap-1">
                        <span>De</span>
                        <span className="font-medium">
                          {new Date(selectedBooking.startAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>à</span>
                        <span className="font-medium">
                          {new Date(selectedBooking.endAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#D3D3D3]">
                  <Button
                    variant="outline"
                    onClick={() => handleContact(selectedBooking)}
                    className="flex-1 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/5 hover:text-[#556B2F] hover:border-[#6B8E23]/30"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                  
                  {selectedBooking.status === "pending" && (
                    <Button
                      variant="default"
                      onClick={() => handleConfirm(selectedBooking)}
                      disabled={confirmingBooking === selectedBooking.id}
                      className="flex-1 bg-[#6B8E23] text-white hover:bg-[#556B2F]"
                    >
                      {confirmingBooking === selectedBooking.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Confirmation...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmer
                        </>
                      )}
                    </Button>
                  )}
                  
                  {selectedBooking.status !== "cancelled" && (
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(selectedBooking)}
                      disabled={cancellingBooking === selectedBooking.id}
                      className="flex-1 border-[#D3D3D3] text-[#8B4513]/70 hover:bg-[#D3D3D3]/20 hover:text-[#8B4513]"
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
        <DialogContent className="max-w-2xl bg-[#FFFFFF] border border-[#D3D3D3] shadow-lg">
          <DialogHeader className="border-b border-[#D3D3D3] pb-4">
            <DialogTitle className="text-[#8B4513] flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B8E23]/10">
                <MessageSquare className="h-4 w-4 text-[#6B8E23]" />
              </div>
              <span>Contacter le client</span>
            </DialogTitle>
          </DialogHeader>

          {contactBooking && (
            <div className="space-y-6 py-2">
              <div className="bg-[#6B8E23]/5 rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-[#8B4513] mb-1">Client</h3>
                  <p className="text-[#8B4513]/70">{contactBooking.client}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#8B4513]/70">Email</h4>
                    <p className="text-[#8B4513]">{contactBooking.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#8B4513]/70">Téléphone</h4>
                    <p className="text-[#8B4513]">{contactBooking.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#8B4513]/70">Réservation</h4>
                  <p className="text-[#8B4513]">{contactBooking.service}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#8B4513]">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Entrez votre message..."
                  className="w-full rounded-lg border border-[#D3D3D3] bg-[#FFFFFF] px-3 py-2 text-[#8B4513] placeholder:text-[#8B4513]/50 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/30 focus:border-[#6B8E23]"
                  rows={5}
                  disabled={contactSending}
                />
                <p className="text-xs text-[#8B4513]/60">
                  {contactMessage.length} caractères
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#D3D3D3]">
                <Button
                  variant="outline"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex-1 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/5"
                  disabled={contactSending}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={contactSending || !contactMessage.trim()}
                  className="flex-1 bg-[#6B8E23] text-white hover:bg-[#556B2F]"
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