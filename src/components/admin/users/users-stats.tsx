// components/admin/users/users-stats.tsx
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, UserCheck, UserX, Building2 } from "lucide-react"
import api from "@/lib/api"

export function UsersStats() {
  const [stats, setStats] = useState([
    {
      name: "Total utilisateurs",
      value: "0",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-chart-1/10",
    },
    {
      name: "Utilisateurs actifs",
      value: "0",
      icon: UserCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      name: "Utilisateurs inactifs",
      value: "0",
      icon: UserX,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      name: "Professionnels",
      value: "0",
      icon: Building2,
      color: "text-green-400",
      bgColor: "bg-chart-3/10",
    },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/stats')
        const data = response.data
        
        setStats([
          {
            name: "Total utilisateurs",
            value: data.total.toLocaleString(),
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-chart-1/10",
          },
          {
            name: "Utilisateurs actifs",
            value: data.active.toLocaleString(),
            icon: UserCheck,
            color: "text-success",
            bgColor: "bg-success/10",
          },
          {
            name: "Utilisateurs inactifs",
            value: data.inactive.toLocaleString(),
            icon: UserX,
            color: "text-muted-foreground",
            bgColor: "bg-muted",
          },
          {
            name: "Professionnels",
            value: data.pro.toLocaleString(),
            icon: Building2,
            color: "text-green-400",
            bgColor: "bg-chart-3/10",
          },
        ])
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

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