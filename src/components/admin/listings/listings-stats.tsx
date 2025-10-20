import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Building2, Home, CheckCircle, Clock, Archive, Eye, TrendingUp } from "lucide-react"
import api from "@/lib/api"

export function ListingsStats() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    archived: 0,
    totalViews: 0,
    avgViews: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/properties/stats')
        const data = response.data
        
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    {
      name: "Total annonces",
      value: stats.total.toLocaleString(),
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Publiées",
      value: stats.published.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "En attente",
      value: stats.pending.toLocaleString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      name: "Archivées",
      value: stats.archived.toLocaleString(),
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      name: "Vues totales",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Moyenne vues",
      value: stats.avgViews.toLocaleString(),
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ]

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsCards.map((stat) => (
        <Card key={stat.name} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.name}</div>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}