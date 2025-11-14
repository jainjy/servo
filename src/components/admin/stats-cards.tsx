import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, Building2, Calendar, TrendingUp } from "lucide-react"
import api from "@/lib/api"

interface StatsData {
  activeUsers: number
  publishedListings: number
  bookings: number
  revenue: number
  userGrowth?: number
  listingGrowth?: number
  bookingGrowth?: number
  revenueGrowth?: number
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    activeUsers: 0,
    publishedListings: 0,
    bookings: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Appeler les différentes APIs pour récupérer toutes les statistiques
        const [usersStats, tourismeStats, bookingsStats, demandesStats] = await Promise.all([
          api.get('/users/stats').catch(() => ({ data: { total: 0, active: 0 } })),
          api.get('/admin/tourisme/stats').catch(() => ({ 
            data: { 
              data: {
                totalListings: 0,
                availableListings: 0,
                totalBookings: 0
              }
            } 
          })),
          api.get('/admin/bookings/stats').catch(() => ({ 
            data: { 
              data: {
                total: 0,
                revenue: 0,
                confirmed: 0,
                completed: 0
              }
            } 
          })),
          api.get('/admin/demandes/stats').catch(() => ({ 
            data: {
              total: 0,
              enCours: 0,
              validees: 0
            } 
          }))
        ])

        console.log("Données reçues des APIs:", {
          users: usersStats.data,
          tourisme: tourismeStats.data,
          bookings: bookingsStats.data,
          demandes: demandesStats.data
        })

        // Traitement des données pour les adapter à l'interface
        const processedData: StatsData = {
          // Utilisateurs actifs (depuis users/stats)
          activeUsers: usersStats.data?.active || usersStats.data?.total || 0,
          
          // Annonces publiées (depuis admin/tourisme/stats)
          publishedListings: tourismeStats.data?.data?.totalListings || 0,
          
          // Réservations (depuis admin/bookings/stats)
          bookings: bookingsStats.data?.data?.total || 0,
          
          // Revenus (depuis admin/bookings/stats)
          revenue: bookingsStats.data?.data?.revenue || 0,
          
          // Croissances (calculées ou par défaut)
          userGrowth: 0.1, // Par défaut en attendant les vraies données
          listingGrowth: 0.05,
          bookingGrowth: 0.15,
          revenueGrowth: 0.2
        }
        
        setStats(processedData)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError("Erreur lors du chargement des statistiques")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Fonction pour formater les pourcentages de croissance
  const formatGrowth = (growth: number | undefined): string => {
    if (growth === undefined || growth === null) return "+0.0%"
    
    const sign = growth >= 0 ? "+" : ""
    return `${sign}${(growth * 100).toFixed(1)}%`
  }

  // Fonction pour déterminer la couleur en fonction de la tendance
  const getTrendColor = (growth: number | undefined): string => {
    if (growth === undefined || growth === null) return "text-muted-foreground"
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  const statsCards = [
    {
      name: "Utilisateurs actifs",
      value: stats.activeUsers.toLocaleString(),
      change: formatGrowth(stats.userGrowth),
      trend: stats.userGrowth && stats.userGrowth >= 0 ? "up" : "down",
      icon: Users,
      growth: stats.userGrowth
    },
    {
      name: "Annonces publiées",
      value: stats.publishedListings.toLocaleString(),
      change: formatGrowth(stats.listingGrowth),
      trend: stats.listingGrowth && stats.listingGrowth >= 0 ? "up" : "down",
      icon: Building2,
      growth: stats.listingGrowth
    },
    {
      name: "Réservations",
      value: stats.bookings.toLocaleString(),
      change: formatGrowth(stats.bookingGrowth),
      trend: stats.bookingGrowth && stats.bookingGrowth >= 0 ? "up" : "down",
      icon: Calendar,
      growth: stats.bookingGrowth
    },
    {
      name: "Revenus (€)",
      value: `€${stats.revenue.toLocaleString()}`,
      change: formatGrowth(stats.revenueGrowth),
      trend: stats.revenueGrowth && stats.revenueGrowth >= 0 ? "up" : "down",
      icon: TrendingUp,
      growth: stats.revenueGrowth
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6 bg-card border-border">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-gray-300"></div>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="mt-4">
                <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-card border-border col-span-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Réessayer
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => (
        <Card key={stat.name} className="p-6 bg-card border-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <span className={`text-sm font-medium ${getTrendColor(stat.growth)}`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}