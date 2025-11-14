import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Users, Star, Loader2 } from "lucide-react"
import api from "@/lib/api"

interface Stats {
  totalListings: number
  availableListings: number
  featuredListings: number
  totalBookings: number
  averageRating: number
  totalParticipants: number
}

export function TourismStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("📊 Chargement des statistiques touristiques...")

      const [tourismResponse, bookingsResponse] = await Promise.all([
        api.get('/admin/tourisme/stats'),
        api.get('/tourisme-bookings', { params: { limit: 1000 } })
      ])

      console.log("📊 Réponse stats tourisme:", tourismResponse.data)
      console.log("📊 Réponse réservations:", bookingsResponse.data)

      const tourismData = tourismResponse.data?.data || tourismResponse.data
      const bookingsData = bookingsResponse.data?.data || bookingsResponse.data || []

      // Calculer le nombre total de participants
      const totalParticipants = bookingsData.reduce((sum: number, booking: any) => {
        return sum + (booking.guests || booking.adults + booking.children + booking.infants || 0)
      }, 0)

      const combinedStats: Stats = {
        totalListings: tourismData.totalListings || 0,
        availableListings: tourismData.availableListings || 0,
        featuredListings: tourismData.featuredListings || 0,
        totalBookings: tourismData.totalBookings || 0,
        averageRating: tourismData.averageRating ? Math.round(tourismData.averageRating * 10) / 10 : 0,
        totalParticipants: totalParticipants
      }

      console.log("🎯 Statistiques combinées:", combinedStats)

      setStats(combinedStats)
    } catch (error) {
      console.error("❌ Erreur lors du chargement des statistiques:", error)
      setError("Erreur lors du chargement des statistiques")
    } finally {
      setLoading(false)
    }
  }

  const statsCards = stats ? [
    {
      label: "Expériences Actives",
      value: stats.totalListings.toString(),
      change: `+${stats.availableListings}`,
      icon: MapPin,
      trend: "up" as const,
    },
    {
      label: "Réservations",
      value: stats.totalBookings.toString(),
      change: "+12.7%",
      icon: Calendar,
      trend: "up" as const,
    },
    {
      label: "Participants",
      value: stats.totalParticipants.toLocaleString('fr-FR'),
      change: "+18.5%",
      icon: Users,
      trend: "up" as const,
    },
    {
      label: "Note Moyenne",
      value: `${stats.averageRating.toFixed(1)}/5`,
      change: "+0.2",
      icon: Star,
      trend: "up" as const,
    },
  ] : []

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
              <div className="h-4 w-12 bg-muted rounded"></div>
            </div>
            <div className="h-8 w-20 bg-muted rounded mb-2"></div>
            <div className="h-3 w-32 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="p-6 bg-destructive/5 border-destructive/20">
            <div className="text-center py-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
