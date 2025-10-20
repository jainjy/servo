// app/pro/dashboard/page.tsx
import { ProStatsCards } from "@/components/pro/pro-stats-cards"
import { ProPerformanceCharts } from "@/components/pro/pro-performance-charts"
import { RecentBookings } from "@/components/pro/recent-bookings"
import { QuickActions } from "@/components/pro/quick-actions"

export default function ProDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      <QuickActions />
      <ProStatsCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <ProPerformanceCharts />
        <RecentBookings />
      </div>
    </div>
  )
}