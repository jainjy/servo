import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Building2, CheckCircle, Clock, Archive, Eye, TrendingUp } from "lucide-react"
import api from "@/lib/api"

// Palette de couleurs du thème
const colors = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFF0",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  primaryLight: "#8FBC8F",
  secondaryLight: "#A0522D",
  cardBg: "#FFFFFF",
  textPrimary: "#2C3E50",
  textSecondary: "#5D6D7E",
  success: "#27AE60",
  warning: "#F39C12",
  error: "#E74C3C",
  accentGold: "#D4AF37",
  gradient1: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)",
  gradient2: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
  gradient3: "linear-gradient(135deg, #6B8E23 0%, #27AE60 100%)",
  oliveHover: "#5D801F",
  oliveLight: "#8FBC8F20",
};

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
      iconColor: colors.primaryDark,
      bgColor: `${colors.primaryDark}20`,
      valueColor: colors.textPrimary,
      labelColor: colors.textSecondary,
      borderColor: `${colors.primaryDark}30`,
    },
    {
      name: "Publiées",
      value: stats.published.toLocaleString(),
      icon: CheckCircle,
      iconColor: colors.success,
      bgColor: `${colors.success}20`,
      valueColor: colors.textPrimary,
      labelColor: colors.textSecondary,
      borderColor: `${colors.success}30`,
    },
    {
      name: "En attente",
      value: stats.pending.toLocaleString(),
      icon: Clock,
      iconColor: colors.warning,
      bgColor: `${colors.warning}20`,
      valueColor: colors.textPrimary,
      labelColor: colors.textSecondary,
      borderColor: `${colors.warning}30`,
    },
    {
      name: "Archivées",
      value: stats.archived.toLocaleString(),
      icon: Archive,
      iconColor: colors.textSecondary,
      bgColor: `${colors.textSecondary}15`,
      valueColor: colors.textPrimary,
      labelColor: colors.textSecondary,
      borderColor: `${colors.textSecondary}25`,
    },
    {
      name: "Vues totales",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      iconColor: colors.primaryDark,
      bgColor: `${colors.primaryDark}20`,
      valueColor: colors.textPrimary,
      labelColor: colors.textSecondary,
      borderColor: `${colors.primaryDark}30`,
    },
    {
      name: "Moyenne vues",
      value: stats.avgViews.toLocaleString(),
      icon: TrendingUp,
      iconColor: colors.accentGold,
      bgColor: `${colors.accentGold}20`,
      valueColor: colors.textPrimary,
      labelColor: colors.textSecondary,
      borderColor: `${colors.accentGold}30`,
    },
  ]

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsCards.map((stat) => (
        <Card 
          key={stat.name} 
          className="p-6 hover:shadow-lg transition-shadow hover:scale-105 transition-transform duration-200"
          style={{ 
            borderColor: stat.borderColor,
            backgroundColor: colors.cardBg,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div 
                className="text-2xl font-bold mb-2"
                style={{ color: stat.valueColor }}
              >
                {stat.value}
              </div>
              <div 
                className="text-sm"
                style={{ color: stat.labelColor }}
              >
                {stat.name}
              </div>
            </div>
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon 
                className="h-6 w-6" 
                style={{ color: stat.iconColor }} 
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}