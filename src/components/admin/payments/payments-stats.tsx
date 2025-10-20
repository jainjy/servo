import { Card } from "@/components/ui/card"
import { CreditCard, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

export function PaymentsStats() {
  const stats = [
    {
      label: "Volume Total (30j)",
      value: "€234,567",
      change: "+18.2%",
      icon: CreditCard,
      trend: "up" as const,
    },
    {
      label: "Transactions",
      value: "3,456",
      change: "+12.5%",
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      label: "Taux de Réussite",
      value: "98.7%",
      change: "+0.3%",
      icon: CheckCircle,
      trend: "up" as const,
    },
    {
      label: "En Attente",
      value: "23",
      change: "-5",
      icon: AlertCircle,
      trend: "down" as const,
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
