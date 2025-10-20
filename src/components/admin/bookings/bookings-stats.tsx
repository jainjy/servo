import { Card } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"

const stats = [
  {
    name: "Total réservations",
    value: "1,234",
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-chart-1/10",
  },
  {
    name: "Confirmées",
    value: "892",
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    name: "En attente",
    value: "234",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    name: "Annulées",
    value: "108",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
]

export function BookingsStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
