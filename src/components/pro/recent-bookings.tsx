// components/pro/recent-bookings.tsx
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react"

const bookings = [
  {
    id: 1,
    client: "Marie Dubois",
    service: "Nettoyage complet",
    date: "Aujourd'hui, 14:00",
    status: "confirmed",
    amount: "85€",
    duration: "2h",
  },
  {
    id: 2,
    client: "Jean Martin",
    service: "Réparation plomberie",
    date: "Demain, 09:30",
    status: "pending",
    amount: "120€",
    duration: "1h30",
  },
  {
    id: 3,
    client: "Sophie Laurent",
    service: "Montage meuble",
    date: "12 Fév, 15:00",
    status: "confirmed",
    amount: "65€",
    duration: "1h",
  },
  {
    id: 4,
    client: "Pierre Durand",
    service: "Peinture salon",
    date: "13 Fév, 10:00",
    status: "cancelled",
    amount: "350€",
    duration: "4h",
  },
]

const statusConfig = {
  confirmed: {
    label: "Confirmé",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock
  },
  cancelled: {
    label: "Annulé",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle
  },
}

export function RecentBookings() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Réservations récentes</h3>
          <p className="text-sm text-muted-foreground">4 réservations cette semaine</p>
        </div>
        <Button variant="outline" size="sm">
          Voir tout
        </Button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const StatusIcon = statusConfig[booking.status as keyof typeof statusConfig].icon

          return (
            <div key={booking.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
                    {booking.client
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                    <span className="font-medium text-foreground text-sm sm:text-base truncate">{booking.client}</span>
                    <Badge
                      variant="secondary"
                      className={`${statusConfig[booking.status as keyof typeof statusConfig].color} text-xs w-fit`}
                    >
                      <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      {statusConfig[booking.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{booking.service}</p>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="whitespace-nowrap">{booking.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap">{booking.duration}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-medium text-foreground whitespace-nowrap">{booking.amount}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                {booking.status === 'pending' && (
                  <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                    Confirmer
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}