import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Building2, CheckCircle, Clock, Archive, Eye, TrendingUp } from "lucide-react"
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
        const statsData = response.data
        
        setStats({
          total: statsData.total || 0,
          published: statsData.published || 0,
          pending: statsData.pending || 0,
          archived: statsData.archived || 0,
          totalViews: statsData.totalViews || 0,
          avgViews: statsData.avgViews || 0
        })
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
      color: "text-[#556B2F]",
      bgColor: "bg-[#556B2F]/10",
      borderColor: "border-l-[#556B2F]"
    },
    {
      name: "Publiées",
      value: stats.published.toLocaleString(),
      icon: CheckCircle,
      color: "text-[#6B8E23]",
      bgColor: "bg-[#6B8E23]/10",
      borderColor: "border-l-[#6B8E23]"
    },
    {
      name: "En attente",
      value: stats.pending.toLocaleString(),
      icon: Clock,
      color: "text-[#8B4513]",
      bgColor: "bg-[#8B4513]/10",
      borderColor: "border-l-[#8B4513]"
    },
    {
      name: "Archivées",
      value: stats.archived.toLocaleString(),
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-[#D3D3D3]/20",
      borderColor: "border-l-[#D3D3D3]"
    },
    {
      name: "Vues totales",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-[#556B2F]",
      bgColor: "bg-[#556B2F]/10",
      borderColor: "border-l-[#556B2F]"
    },
    {
      name: "Moyenne vues",
      value: stats.avgViews.toLocaleString(),
      icon: TrendingUp,
      color: "text-[#6B8E23]",
      bgColor: "bg-[#6B8E23]/10",
      borderColor: "border-l-[#6B8E23]"
    },
  ]

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsCards.map((stat) => (
        <Card 
          key={stat.name} 
          className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-transparent hover:border-l-[#6B8E23] group"
          style={{ 
            backgroundColor: '#FFFFFF0',
            borderColor: '#D3D3D3'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold mb-2" style={{ color: '#556B2F' }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: '#8B4513' }}>
                {stat.name}
              </div>
            </div>
            <div 
              className={`p-3 rounded-full ${stat.bgColor} group-hover:${stat.bgColor.replace('/10', '/20')} transition-colors`}
              style={{ border: '1px solid #D3D3D3' }}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}