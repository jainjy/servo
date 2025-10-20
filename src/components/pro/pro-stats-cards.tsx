// components/pro/pro-stats-cards.tsx
import { Card } from "@/components/ui/card"
import { Calendar, Euro, Star, Users, Clock, TrendingUp } from "lucide-react"

const stats = [
  {
    name: "Réservations ce mois",
    value: "24",
    change: "+18%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    name: "Revenus (€)",
    value: "3,845",
    change: "+12.5%",
    trend: "up",
    icon: Euro,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Note moyenne",
    value: "4.8",
    change: "+0.2",
    trend: "up",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    name: "Clients actifs",
    value: "42",
    change: "+5",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    name: "Taux de réponse",
    value: "98%",
    change: "+3%",
    trend: "up",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    name: "Taux de conversion",
    value: "35%",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
  },
]

export function ProStatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6 bg-card border-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <span className={`text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
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