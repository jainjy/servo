import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"
import api from "@/lib/api"

interface BookingStatsData {
  total: number
  confirmed: number
  pending: number
  cancelled: number
  completed?: number
  revenue?: number
  averageBooking?: number
}

export function BookingsStats() {
  const [stats, setStats] = useState<BookingStatsData>({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Appel à l'API des réservations
        const response = await api.get('/admin/bookings/stats')
        const data = response.data.data
        
        // console.log("Données réservations reçues:", data)

        // Adaptation des données selon la structure de votre API
        const processedData: BookingStatsData = {
          total: data.total || 0,
          confirmed: data.confirmed || 0,
          pending: data.pending || 0,
          cancelled: data.cancelled || 0,
          completed: data.completed || 0,
          revenue: data.revenue || 0,
          averageBooking: data.averageBooking || 0
        }
        
        setStats(processedData)
      } catch (error) {
        console.error("Error fetching booking stats:", error)
        setError("Erreur lors du chargement des statistiques des réservations")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    {
      name: "Total réservations",
      value: stats.total.toLocaleString(),
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-[#6B8E23]/10",
    },
    {
      name: "Confirmées",
      value: stats.confirmed.toLocaleString(),
      icon: CheckCircle,
      color: "text-[#556B2F]", // logo
      bgColor: "bg-[#556B2F]/10",
    },
    {
      name: "En attente",
      value: stats.pending.toLocaleString(),
      icon: Clock,
      color: "text-[#8B4513]", // secondary-text
      bgColor: "bg-[#8B4513]/10",
    },
    {
      name: "Annulées",
      value: stats.cancelled.toLocaleString(),
      icon: XCircle,
      color: "text-[#D3D3D3]", // separator (en texte)
      bgColor: "bg-[#D3D3D3]/10",
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6 bg-white border-[#D3D3D3]">
            <div className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-[#D3D3D3]/50"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-[#D3D3D3]/50 rounded"></div>
                  <div className="h-6 w-12 bg-[#D3D3D3]/50 rounded"></div>
                </div>
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
        <Card className="p-6 bg-white border-[#D3D3D3] col-span-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-[#556B2F] text-white rounded hover:bg-[#6B8E23]"
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
        <Card key={stat.name} className="p-6 bg-white border-[#D3D3D3] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#8B4513]">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}