

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

const upcomingBookings = [
  {
    id: "1",
    service: "Nettoyage",
    time: "10:00",
    date: "15 Mar",
    status: "confirmed",
  },
  {
    id: "2",
    service: "Plomberie",
    time: "09:00",
    date: "16 Mar",
    status: "pending",
  },
  {
    id: "3",
    service: "Déménagement",
    time: "08:00",
    date: "18 Mar",
    status: "confirmed",
  },
  {
    id: "4",
    service: "Électricité",
    time: "14:00",
    date: "20 Mar",
    status: "confirmed",
  },
]

const statusColors = {
  confirmed: "bg-success/20 text-success",
  pending: "bg-warning/20 text-warning",
}

export function BookingsCalendar() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Prochaines réservations</h3>
      </div>

      <div className="space-y-3">
        {upcomingBookings.map((booking) => (
          <div key={booking.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{booking.service}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.date} à {booking.time}
                </p>
              </div>
              <Badge variant="secondary" className={statusColors[booking.status as keyof typeof statusColors]}>
                {booking.status === "confirmed" ? "Confirmée" : "En attente"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
