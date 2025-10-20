

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "01 Jan", users: 4000, bookings: 2400, revenue: 2400 },
  { date: "08 Jan", users: 3000, bookings: 1398, revenue: 2210 },
  { date: "15 Jan", users: 2000, bookings: 9800, revenue: 2290 },
  { date: "22 Jan", users: 2780, bookings: 3908, revenue: 2000 },
  { date: "29 Jan", users: 1890, bookings: 4800, revenue: 2181 },
  { date: "05 Fév", users: 2390, bookings: 3800, revenue: 2500 },
  { date: "12 Fév", users: 3490, bookings: 4300, revenue: 2100 },
]

export function PerformanceCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6 bg-card border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Utilisateurs actifs</h3>
          <p className="text-sm text-muted-foreground">Évolution sur les 7 derniers jours</p>
        </div>
        <ChartContainer
          config={{
            users: {
              label: "Utilisateurs",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Réservations</h3>
          <p className="text-sm text-muted-foreground">Évolution sur les 7 derniers jours</p>
        </div>
        <ChartContainer
          config={{
            bookings: {
              label: "Réservations",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
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
                dataKey="bookings"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>
    </div>
  )
}
