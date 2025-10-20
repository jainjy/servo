import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Users, Star } from "lucide-react"

export function TourismStats() {
  const stats = [
    {
      label: "Expériences Actives",
      value: "156",
      change: "+8.3%",
      icon: MapPin,
      trend: "up" as const,
    },
    {
      label: "Réservations (30j)",
      value: "892",
      change: "+12.7%",
      icon: Calendar,
      trend: "up" as const,
    },
    {
      label: "Participants",
      value: "2,456",
      change: "+18.5%",
      icon: Users,
      trend: "up" as const,
    },
    {
      label: "Note Moyenne",
      value: "4.7/5",
      change: "+0.2",
      icon: Star,
      trend: "up" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
