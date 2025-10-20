import { Card } from "@/components/ui/card"
import { Package, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"

export function ProductsStats() {
  const stats = [
    {
      label: "Produits Actifs",
      value: "2,847",
      change: "+12.5%",
      icon: Package,
      trend: "up" as const,
    },
    {
      label: "Commandes (30j)",
      value: "1,234",
      change: "+8.2%",
      icon: ShoppingCart,
      trend: "up" as const,
    },
    {
      label: "Revenus (30j)",
      value: "€45,678",
      change: "+15.3%",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      label: "Taux de Conversion",
      value: "3.2%",
      change: "+0.5%",
      icon: TrendingUp,
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
