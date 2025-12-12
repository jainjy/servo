import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Loader2, RefreshCw } from "lucide-react"
import api from "@/lib/api"

interface Booking {
  id: string
  service: string
  time: string
  date: string
  status: "confirmed" | "pending" | "cancelled"
  clientName?: string
  prestataireName?: string
  createdAt?: string
  bookingDate?: string
}

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusTranslations = {
  confirmed: "Confirmée",
  pending: "En attente",
  cancelled: "Annulée"
}

export function BookingsCalendar() {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUpcomingBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Chargement des réservations depuis l'API...")

      // Appel API réel - utiliser l'endpoint tourisme-bookings
      const response = await api.get('/tourisme-bookings', {
        params: {
          limit: 10,
          page: 1,
          status: 'confirmed'
        }
      })

      console.log("📊 Réponse API réservations:", response.data)

      // Transformer les données de l'API
      const apiBookings = response.data?.data || response.data || []

      const transformedBookings = transformApiBookings(apiBookings)

      console.log("🎯 Réservations transformées:", transformedBookings)

      setUpcomingBookings(transformedBookings.slice(0, 4)) // Garder seulement 4 réservations

    } catch (error) {
      console.error("❌ Erreur lors du chargement des réservations:", error)
      setError("Erreur lors du chargement des réservations")
      setUpcomingBookings([]) // Vider les réservations en cas d'erreur
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcomingBookings()
  }, [])

  // Transformer les données de l'API en format Booking
  const transformApiBookings = (apiBookings: any[]): Booking[] => {
    if (!apiBookings || !Array.isArray(apiBookings)) {
      return []
    }

    const now = new Date()

    const transformed = apiBookings
      .map((booking, index) => {
        try {
          // Déterminer le statut
          let status: Booking['status'] = 'pending'
          if (booking.status === 'confirmed') {
            status = 'confirmed'
          } else if (booking.status === 'cancelled') {
            status = 'cancelled'
          } else {
            status = 'pending'
          }

          // Utiliser la date d'arrivée (checkIn) comme date de réservation
          const checkInDate = booking.checkIn ? new Date(booking.checkIn) : new Date(booking.createdAt)
          const formattedDate = formatDate(checkInDate)
          const formattedTime = formatTime(checkInDate)

          // Construire le nom du client
          const clientName = booking.user?.firstName && booking.user?.lastName
            ? `${booking.user.firstName} ${booking.user.lastName}`
            : booking.user?.firstName || ''

          return {
            id: booking.id || `booking-${index}`,
            service: booking.listing?.title || `Réservation ${index + 1}`,
            time: formattedTime,
            date: formattedDate,
            status: status,
            clientName: clientName || undefined,
            prestataireName: undefined,
            createdAt: booking.createdAt,
            bookingDate: booking.checkIn || booking.createdAt
          }
        } catch (error) {
          console.error("❌ Erreur transformation booking:", booking, error)
          return null
        }
      })
      .filter((booking): booking is NonNullable<typeof booking> => booking !== null)
      .filter(booking => booking.status !== 'cancelled')
      // Filtrer pour afficher seulement les réservations à venir (checkIn >= aujourd'hui)
      .filter(booking => {
        try {
          const bookingDate = new Date(booking.bookingDate)
          return bookingDate >= now
        } catch {
          return true // Inclure si la date ne peut pas être parsée
        }
      })

    // Trier par date (plus proches en premier)
    return transformed.sort((a, b) => {
      try {
        const dateA = new Date(a.bookingDate || a.createdAt || '')
        const dateB = new Date(b.bookingDate || b.createdAt || '')
        return dateA.getTime() - dateB.getTime()
      } catch {
        return 0
      }
    })
  }

  // Formater la date en "15 Mar"
  const formatDate = (date: Date): string => {
    try {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      })
    } catch {
      return "Date invalide"
    }
  }

  // Formater l'heure en "10:00"
  const formatTime = (date: Date): string => {
    try {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    } catch {
      return "Heure invalide"
    }
  }

  if (loading) {
    return (
      <Card className="p-6 bg-white border-[#D3D3D3]">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#8B4513]" />
          <h3 className="text-lg font-semibold text-[#8B4513]">Prochaines réservations</h3>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="rounded-lg border border-[#D3D3D3] bg-white p-4 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-[#D3D3D3]/50 rounded"></div>
                  <div className="h-3 w-24 bg-[#D3D3D3]/50 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-[#D3D3D3]/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Chargement des réservations...
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white border-[#D3D3D3]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#8B4513]" />
          <h3 className="text-lg font-semibold text-[#8B4513]">Prochaines réservations</h3>
          {upcomingBookings.length > 0 && (
            <Badge variant="secondary" className="ml-2 bg-[#6B8E23]/10 text-[#6B8E23]">
              {upcomingBookings.length}
            </Badge>
          )}
        </div>
        
        <button 
          onClick={fetchUpcomingBookings}
          disabled={loading}
          className="p-2 hover:bg-[#6B8E23]/10 rounded-md transition-colors text-[#8B4513]"
          title="Actualiser"
        >
          <RefreshCw className={`h-4 w-4 text-[#8B4513] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error ? (
        <div className="text-center py-8">
          <div className="text-red-600 mb-3">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium text-[#8B4513]">{error}</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Impossible de charger les réservations
          </p>
          <button 
            onClick={fetchUpcomingBookings}
            disabled={loading}
            className="px-4 py-2 bg-[#556B2F] text-white rounded hover:bg-[#6B8E23] text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                Chargement...
              </>
            ) : (
              "Réessayer"
            )}
          </button>
        </div>
      ) : upcomingBookings.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="font-medium text-[#8B4513]">Aucune réservation à venir</p>
          <p className="text-sm">Les prochaines réservations apparaîtront ici</p>
          <button 
            onClick={fetchUpcomingBookings}
            disabled={loading}
            className="mt-3 px-3 py-1 text-xs bg-[#6B8E23]/10 text-[#8B4513] rounded hover:bg-[#6B8E23]/20"
          >
            Actualiser
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="rounded-lg border border-[#D3D3D3] bg-white p-4 hover:bg-[#6B8E23]/10 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#8B4513]">{booking.service}</p>
                    <p className="text-sm text-gray-600">
                      {booking.date} à {booking.time}
                    </p>
                    {booking.clientName && (
                      <p className="text-xs text-gray-600">
                        Client: {booking.clientName}
                      </p>
                    )}
                    {booking.prestataireName && (
                      <p className="text-xs text-gray-600">
                        Prestataire: {booking.prestataireName}
                      </p>
                    )}
                  </div>
                  <Badge 
                    className={`${statusColors[booking.status]} font-medium text-xs px-2 py-1`}
                  >
                    {statusTranslations[booking.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-600 text-center">
            {upcomingBookings.length} réservation(s) à venir • 
            <button 
              onClick={fetchUpcomingBookings}
              disabled={loading}
              className="ml-1 underline hover:text-[#8B4513] disabled:opacity-50"
            >
              Actualiser
            </button>
          </div>
        </>
      )}
    </Card>
  )
}