import { Card } from "@/components/ui/card"
import { Users, Building2, Calendar, TrendingUp } from "lucide-react"

const stats = [
  {
    name: "Utilisateurs actifs",
    value: "12,543",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Annonces publiées",
    value: "3,847",
    change: "+8.2%",
    trend: "up",
    icon: Building2,
  },
  {
    name: "Réservations",
    value: "1,234",
    change: "+23.1%",
    trend: "up",
    icon: Calendar,
  },
  {
    name: "Revenus (€)",
    value: "284,500",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-success">{stat.change}</span>
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
