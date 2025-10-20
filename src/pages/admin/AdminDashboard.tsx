import { StatsCards } from "@/components/admin/stats-cards"
import { RecentActivity } from "@/components/admin/recent-activity"
import { PerformanceCharts } from "@/components/admin/performance-charts"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme SERVO</p>
      </div>

      <StatsCards />
      <PerformanceCharts />
      <RecentActivity />
    </div>
  )
}
