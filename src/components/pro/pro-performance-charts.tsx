// components/pro/pro-performance-charts.tsx


import { Card } from "@/components/ui/card"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { date: "01 Jan", revenue: 1200, bookings: 8 },
  { date: "08 Jan", revenue: 1800, bookings: 12 },
  { date: "15 Jan", revenue: 1500, bookings: 10 },
  { date: "22 Jan", revenue: 2200, bookings: 15 },
  { date: "29 Jan", revenue: 1900, bookings: 13 },
  { date: "05 Fév", revenue: 2800, bookings: 18 },
  { date: "12 Fév", revenue: 3200, bookings: 22 },
]

const ratingData = [
  { month: "Jan", rating: 4.5 },
  { month: "Fév", rating: 4.7 },
  { month: "Mar", rating: 4.6 },
  { month: "Avr", rating: 4.8 },
  { month: "Mai", rating: 4.9 },
  { month: "Jun", rating: 4.8 },
]

export function ProPerformanceCharts() {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Revenus et réservations</h3>
          <p className="text-sm text-muted-foreground">Évolution sur les 7 derniers jours</p>
        </div>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenus (€)",
              color: "hsl(var(--chart-1))",
            },
            bookings: {
              label: "Réservations",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Évolution de la note</h3>
          <p className="text-sm text-muted-foreground">Moyenne sur les 6 derniers mois</p>
        </div>
        <ChartContainer
          config={{
            rating: {
              label: "Note",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[150px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                domain={[4, 5]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="rating"
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>
    </div>
  )
}