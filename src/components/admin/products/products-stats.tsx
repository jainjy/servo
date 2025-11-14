import { Card } from "@/components/ui/card"
import { Package, TrendingUp, ShoppingCart, DollarSign, Eye, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/api"

interface ProductsStatsData {
  totalProducts: number
  productsByCategory: Array<{ category: string; _count: { category: number } }>
  productsByStatus: Array<{ status: string; _count: { status: number } }>
  totals: {
    views: number
    clicks: number
    purchases: number
  }
  topViewed: Array<{
    id: string
    name: string
    viewCount: number
    price: number
  }>
  topPurchased: Array<{
    id: string
    name: string
    purchaseCount: number
    price: number
  }>
}

interface StatsResponse {
  success: boolean
  data: ProductsStatsData
}

function formatPercentage(value: number, total: number): string {
  if (!total || !value) return "0%"
  return `${((value / total) * 100).toFixed(1)}%`
}

function formatNumber(value: number): string {
  return value?.toLocaleString() || "0"
}

export function ProductsStats() {
  const [statsData, setStatsData] = useState<ProductsStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await api.get<StatsResponse>('/products/stats')
        if (response.data.success) {
          setStatsData(response.data.data)
        } else {
          setError("Erreur lors de la récupération des statistiques")
        }
      } catch (err) {
        console.error("Erreur:", err)
        setError("Impossible de charger les statistiques")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  if (!statsData) {
    return (
      <div className="text-center text-gray-500 p-4">
        Aucune donnée disponible
      </div>
    )
  }

  // Calculer les produits actifs (status = 'active')
  const activeProducts = statsData.productsByStatus.find(
    item => item.status === 'active'
  )?._count?.status || 0

  // Calculer le taux de conversion (achats / clics)
  const conversionRate = statsData.totals.clicks > 0 
    ? (statsData.totals.purchases / statsData.totals.clicks) * 100 
    : 0

  const stats = [
    {
      label: "Total Produits",
      value: formatNumber(statsData.totalProducts),
      change: "+0%",
      icon: Package,
      trend: "up" as const,
    },
    {
      label: "Produits Actifs",
      value: formatNumber(activeProducts),
      change: "+0%",
      icon: Zap,
      trend: "up" as const,
    },
    {
      label: "Achats Total",
      value: formatNumber(statsData.totals.purchases),
      change: "+0%",
      icon: ShoppingCart,
      trend: "up" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Grille principale avec 3 cartes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Sections supplémentaires pour les tops produits */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top produits les plus vus */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Top Produits les Plus Vus
          </h3>
          <div className="space-y-3">
            {statsData.topViewed.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{formatNumber(product.viewCount)} vues</p>
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {product.price?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top produits les plus achetés */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Top Produits les Plus Achetés
          </h3>
          <div className="space-y-3">
            {statsData.topPurchased.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{formatNumber(product.purchaseCount)} achats</p>
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {product.price?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Statistiques par catégorie et statut */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Produits par catégorie */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Produits par Catégorie</h3>
          <div className="space-y-3">
            {statsData.productsByCategory.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm capitalize">{item.category || 'Non catégorisé'}</span>
                <span className="text-sm font-semibold">{formatNumber(item._count?.category || 0)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Produits par statut */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Produits par Statut</h3>
          <div className="space-y-3">
            {statsData.productsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm capitalize">{item.status || 'Inconnu'}</span>
                <span className="text-sm font-semibold">{formatNumber(item._count?.status || 0)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}