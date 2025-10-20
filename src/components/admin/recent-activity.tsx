import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "Marie Dubois",
    action: "a créé une nouvelle annonce",
    target: "Appartement 3 pièces - Paris 15e",
    time: "Il y a 5 minutes",
    type: "listing",
  },
  {
    id: 2,
    user: "Jean Martin",
    action: "a effectué une réservation",
    target: "Service de nettoyage",
    time: "Il y a 12 minutes",
    type: "booking",
  },
  {
    id: 3,
    user: "Sophie Laurent",
    action: "s'est inscrit comme prestataire",
    target: "Plomberie & Chauffage",
    time: "Il y a 23 minutes",
    type: "vendor",
  },
  {
    id: 4,
    user: "Pierre Durand",
    action: "a publié un avis",
    target: "Service de déménagement",
    time: "Il y a 1 heure",
    type: "review",
  },
  {
    id: 5,
    user: "Claire Petit",
    action: "a mis à jour son profil",
    target: "Informations personnelles",
    time: "Il y a 2 heures",
    type: "profile",
  },
]

const typeColors = {
  listing: "bg-chart-1/20 text-blue-500",
  booking: "bg-chart-2/20 text-blue-600",
  vendor: "bg-chart-3/20 text-green-400",
  review: "bg-chart-4/20 text-green-500",
  profile: "bg-chart-5/20 text-gray-600",
}

export function RecentActivity() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Activité récente</h3>
        <p className="text-sm text-muted-foreground">Dernières actions sur la plateforme</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {activity.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{activity.user}</span>
                <Badge variant="secondary" className={typeColors[activity.type as keyof typeof typeColors]}>
                  {activity.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
