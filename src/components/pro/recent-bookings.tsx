// components/pro/recent-bookings.tsx
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, MessageSquare, Eye, RefreshCw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import api from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

// Définition du thème
const theme = {
  logo: "#556B2F",           
  primaryDark: "#6B8E23",   
  lightBg: "#FFFFFF",       
  separator: "#D3D3D3",     
  secondaryText: "#8B4513", 
};

// Types pour nos données basés sur AdminBookings
interface TourismeBooking {
  id: string;
  confirmationNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  serviceFee: number;
  specialRequests: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  listing: {
    id: string;
    title: string;
    type: string;
    city: string;
    images: string[];
    price: number;
    provider: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

// Fonction pour récupérer les réservations depuis l'API
async function fetchRecentBookings(providerId?: string): Promise<TourismeBooking[]> {
  const response = await api.get('/tourisme-bookings?limit=10&sort=createdAt&order=desc')
  if (response.data.success) {
    let bookings = response.data.data
    if (providerId) {
      bookings = bookings.filter((booking: TourismeBooking) => booking.listing.provider === providerId)
    }
    return bookings
  }
  throw new Error('Erreur lors de la récupération des réservations')
}

// Fonction pour confirmer une réservation
async function confirmBooking(bookingId: string): Promise<void> {
  const response = await api.put(`/tourisme-bookings/${bookingId}/status`, { 
    status: 'confirmed' 
  })
  if (!response.data.success) {
    throw new Error('Erreur lors de la confirmation de la réservation')
  }
}

// Fonction pour annuler une réservation
async function cancelBooking(bookingId: string): Promise<void> {
  const response = await api.put(`/tourisme-bookings/${bookingId}/status`, { 
    status: 'cancelled' 
  })
  if (!response.data.success) {
    throw new Error('Erreur lors de l\'annulation de la réservation')
  }
}

// Fonction pour envoyer un message
async function sendMessage(bookingId: string): Promise<void> {
  const response = await api.post(`/tourisme-bookings/${bookingId}/reminder`)
  if (!response.data.success) {
    throw new Error('Erreur lors de l\'envoi du message')
  }
}

const statusConfig = {
  confirmed: {
    label: "Confirmé",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock
  },
  cancelled: {
    label: "Annulé",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle
  },
  completed: {
    label: "Terminé",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle
  }
}

export function RecentBookings() {
  const { user } = useAuth()

  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['recentBookings', user?.id],
    queryFn: () => fetchRecentBookings(user?.id),
    refetchInterval: 30000, // Rafraîchissement automatique toutes les 30 secondes
    enabled: !!user?.id,
  })

  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleConfirmBooking = async (bookingId: string) => {
    setActionLoading(`confirm-${bookingId}`)
    try {
      await confirmBooking(bookingId)
      await refetch()
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    setActionLoading(`cancel-${bookingId}`)
    try {
      await cancelBooking(bookingId)
      await refetch()
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSendMessage = async (bookingId: string) => {
    setActionLoading(`message-${bookingId}`)
    try {
      await sendMessage(bookingId)
      // Optionnel: Afficher un toast de succès
      console.log('Message envoyé avec succès')
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRefresh = async () => {
    setActionLoading('refresh')
    try {
      await refetch()
    } finally {
      setActionLoading(null)
    }
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  // Calculer la durée du séjour
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const timeDiff = end.getTime() - start.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  // Statistiques calculées en temps réel
  const confirmedCount = bookings?.filter(b => b.status === 'confirmed').length || 0
  const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0
  const totalThisWeek = bookings?.length || 0

  if (isLoading) {
    return (
      <Card className="p-6" style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: theme.logo }}>Réservations récentes</h3>
            <p className="text-sm" style={{ color: theme.secondaryText }}>Chargement...</p>
          </div>
          <Button variant="outline" size="sm" disabled style={{ borderColor: theme.separator }}>
            Voir tous
          </Button>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-4 animate-pulse" 
              style={{ borderColor: theme.separator, backgroundColor: theme.lightBg }}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full" style={{ backgroundColor: theme.separator }}></div>
                <div className="space-y-2">
                  <div className="h-4 rounded w-24" style={{ backgroundColor: theme.separator }}></div>
                  <div className="h-3 rounded w-32" style={{ backgroundColor: theme.separator }}></div>
                  <div className="h-3 rounded w-40" style={{ backgroundColor: theme.separator }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6" style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
        <div className="text-center" style={{ color: "#ef4444" }}>
          <p>Erreur lors du chargement des réservations</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-2" style={{ borderColor: theme.separator }}>
            Réessayer
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6" style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: theme.logo }}>Réservations récentes</h3>
          <p className="text-sm" style={{ color: theme.secondaryText }}>
            {totalThisWeek} réservations • 
            <span style={{ color: "#16a34a", marginLeft: '4px' }}>{confirmedCount} confirmées</span> • 
            <span style={{ color: "#ca8a04", marginLeft: '4px' }}>{pendingCount} en attente</span>
          </p>
        </div>
        <div className=" flex  items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={actionLoading === 'refresh'}
            style={{ borderColor: theme.separator }}
          >
            <RefreshCw className={`h-4 w-4 ${actionLoading === 'refresh' ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" style={{ borderColor: theme.separator }}>
            Voir tous
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => {
            const StatusIcon = statusConfig[booking.status]?.icon || Clock
            const initials = booking.user 
              ? `${booking.user.firstName?.[0] || ''}${booking.user.lastName?.[0] || ''}`.toUpperCase()
              : 'CL'
            
            const nights = calculateNights(booking.checkIn, booking.checkOut)
            const displayDate = formatDate(booking.createdAt)
            
            return (
              <div key={booking.id} className="flex items-center justify-between rounded-lg border p-4 transition-colors" 
                style={{ 
                  borderColor: theme.separator,
                  backgroundColor: theme.lightBg
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.primaryDark}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.lightBg;
                }}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 border flex-shrink-0" style={{ borderColor: theme.separator }}>
                    <AvatarFallback className="font-semibold" style={{ 
                      backgroundColor: `${theme.primaryDark}10`,
                      color: theme.primaryDark
                    }}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate" style={{ color: theme.logo }}>
                        {booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Client non connecté'}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`${statusConfig[booking.status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'} text-xs border flex-shrink-0`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[booking.status]?.label || booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm truncate" style={{ color: theme.secondaryText }}>
                      {booking.listing.title} • {nights} nuit(s)
                    </p>
                    <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: theme.secondaryText }}>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {displayDate}
                      </span>
                      <span>•</span>
                      <span>{booking.listing.city}</span>
                      <span>•</span>
                      <span className="font-medium" style={{ color: theme.logo }}>{booking.totalAmount}€</span>
                    </div>
                    {booking.paymentStatus !== 'paid' && (
                      <div className="text-xs font-medium mt-1" style={{ color: "#ca8a04" }}>
                        Paiement: {booking.paymentStatus}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleSendMessage(booking.id)}
                    disabled={actionLoading === `message-${booking.id}`}
                    style={{ 
                      color: theme.secondaryText,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3b82f610";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => console.log('Voir détails', booking.id)}
                    style={{ 
                      color: theme.secondaryText,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.separator}80`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {booking.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleConfirmBooking(booking.id)}
                      disabled={actionLoading === `confirm-${booking.id}`}
                      style={{ 
                        backgroundColor: "#16a34a",
                        color: "white"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#15803d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#16a34a";
                      }}
                    >
                      {actionLoading === `confirm-${booking.id}` ? "..." : "Confirmer"}
                    </Button>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={actionLoading === `cancel-${booking.id}`}
                      style={{ 
                        borderColor: theme.separator,
                        color: theme.secondaryText
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.separator}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {actionLoading === `cancel-${booking.id}` ? "..." : "Annuler"}
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8" style={{ color: theme.secondaryText }}>
            <p>Aucune réservation récente</p>
            <Button variant="outline" onClick={() => refetch()} className="mt-2" style={{ borderColor: theme.separator }}>
              Rafraîchir
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
