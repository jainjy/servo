import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"

interface Stats {
  associatedServices: number
  userMetiers: number
  availableServicesCount: number
  demandesCount: number
  totalPotentialServices: number
}

export function ProfessionalServicesStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/professional/services/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Services Actifs</CardTitle>
          <Badge variant="secondary" className="bg-success/20 text-success">
            ✓
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.associatedServices}</div>
          <p className="text-xs text-muted-foreground">Services que vous proposez</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Métiers</CardTitle>
          <Badge variant="secondary">{stats.userMetiers}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.userMetiers}</div>
          <p className="text-xs text-muted-foreground">Métiers principaux</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Services Disponibles</CardTitle>
          <Badge variant="outline">+{stats.availableServicesCount}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.availableServicesCount}</div>
          <p className="text-xs text-muted-foreground">Basés sur vos métiers</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Demandes</CardTitle>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
            {stats.demandesCount}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.demandesCount}</div>
          <p className="text-xs text-muted-foreground">Demandes reçues</p>
        </CardContent>
      </Card>
    </div>
  )
}