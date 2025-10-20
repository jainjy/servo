import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Star, Image as ImageIcon } from "lucide-react"

interface ServiceDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: any
}

export function ServiceDetailsModal({ open, onOpenChange, service }: ServiceDetailsModalProps) {
  if (!service) return null

  const avgRating = service.vendors.reduce((acc: number, vendor: any) => acc + vendor.rating, 0) / service.vendors.length || 0
  const totalBookings = service.vendors.reduce((acc: number, vendor: any) => acc + vendor.bookings, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Détails du service</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images du service */}
          {service.images && service.images.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Images</h3>
              <div className="grid grid-cols-3 gap-4">
                {service.images.map((image: string, index: number) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${service.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
            <Badge variant="outline" className="mr-2">
              {service.category}
            </Badge>
            <Badge variant="secondary">
              {service.status === "active" ? "Actif" : "Inactif"}
            </Badge>
          </div>

          {service.description && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Description</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-2">Métiers associés</h3>
            <div className="flex flex-wrap gap-2">
              {service.metiers.map((metier: any) => (
                <Badge key={metier.id} variant="outline">
                  {metier.libelle}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Statistiques</h3>
            <Card className="p-4 space-y-2">
              <div className="flex justify-between">
                <span>Nombre de prestataires</span>
                <span className="font-semibold">{service.vendors.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Note moyenne</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-semibold">{avgRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Réservations totales</span>
                <span className="font-semibold">{totalBookings}</span>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}