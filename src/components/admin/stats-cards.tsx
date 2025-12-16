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

        // console.log("Données reçues des APIs:", {
        //   users: usersStats.data,
        //   tourisme: tourismeStats.data,
        //   bookings: bookingsStats.data,
        //   demandes: demandesStats.data
        // })

        const processedData: StatsData = {
          activeUsers: usersStats.data?.active || usersStats.data?.total || 0,
          publishedListings: tourismeStats.data?.data?.totalListings || 0,
          bookings: bookingsStats.data?.data?.total || 0,
          revenue: bookingsStats.data?.data?.revenue || 0,
          userGrowth: 0.1,
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

  const formatGrowth = (growth: number | undefined): string => {
    if (growth === undefined || growth === null) return "+0.0%"
    
    const sign = growth >= 0 ? "+" : ""
    return `${sign}${(growth * 100).toFixed(1)}%`
  }

  const getTrendColor = (growth: number | undefined): string => {
    if (growth === undefined || growth === null) return "text-[#D3D3D3]"
    return growth >= 0 ? "text-[#556B2F]" : "text-red-600"
  }

  const statsCards = [
    {
      name: "Utilisateurs actifs",
      value: stats.activeUsers.toLocaleString(),
      change: formatGrowth(stats.userGrowth),
      trend: stats.userGrowth && stats.userGrowth >= 0 ? "up" : "down",
      icon: Users,
      growth: stats.userGrowth,
      accentColor: "bg-[#556B2F]/10"
    },
    {
      name: "Annonces publiées",
      value: stats.publishedListings.toLocaleString(),
      change: formatGrowth(stats.listingGrowth),
      trend: stats.listingGrowth && stats.listingGrowth >= 0 ? "up" : "down",
      icon: Building2,
      growth: stats.listingGrowth,
      accentColor: "bg-[#6B8E23]/10"
    },
    {
      name: "Réservations",
      value: stats.bookings.toLocaleString(),
      change: formatGrowth(stats.bookingGrowth),
      trend: stats.bookingGrowth && stats.bookingGrowth >= 0 ? "up" : "down",
      icon: Calendar,
      growth: stats.bookingGrowth,
      accentColor: "bg-[#8B4513]/10"
    },
    {
      name: "Revenus (€)",
      value: `€${stats.revenue.toLocaleString()}`,
      change: formatGrowth(stats.revenueGrowth),
      trend: stats.revenueGrowth && stats.revenueGrowth >= 0 ? "up" : "down",
      icon: TrendingUp,
      growth: stats.revenueGrowth,
      accentColor: "bg-[#556B2F]/10"
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card 
            key={index} 
            className="p-6 bg-[#FFFFF0] border-[#D3D3D3] animate-pulse hover:border-[#556B2F]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-[#D3D3D3]"></div>
              <div className="h-4 w-16 bg-[#D3D3D3] rounded"></div>
            </div>
            <div className="mt-4">
              <div className="h-4 w-24 bg-[#D3D3D3] rounded mb-2"></div>
              <div className="h-6 w-16 bg-[#D3D3D3] rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-[#FFFFF0] border-[#D3D3D3] col-span-4 hover:shadow-lg transition-all">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-[#556B2F] text-white rounded-lg hover:bg-[#6B8E23] transition-colors shadow-sm hover:shadow"
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
        <Card 
          key={stat.name} 
          className="p-6 bg-[#FFFFF0] border-[#D3D3D3] hover:border-[#556B2F]/30 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.accentColor} group-hover:scale-105 transition-transform`}>
              <stat.icon className="h-6 w-6 text-[#556B2F]" />
            </div>
            <span className={`text-sm font-medium ${getTrendColor(stat.growth)}`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-[#8B4513]">{stat.name}</p>
            <p className="mt-1 text-2xl font-bold text-[#556B2F]">{stat.value}</p>
          </div>
          
          {/* Barre de progression subtile */}
          <div className="mt-3 h-1 w-full bg-[#D3D3D3] rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                stat.name === "Utilisateurs actifs" ? "bg-[#556B2F]" :
                stat.name === "Annonces publiées" ? "bg-[#6B8E23]" :
                stat.name === "Réservations" ? "bg-[#8B4513]" :
                "bg-[#556B2F]"
              } rounded-full transition-all duration-700`}
              style={{ 
                width: stat.growth ? `${Math.min(Math.abs(stat.growth) * 100, 100)}%` : "0%" 
              }}
            ></div>
          </div>
        </Card>
      ))}
    </div>
  )
}