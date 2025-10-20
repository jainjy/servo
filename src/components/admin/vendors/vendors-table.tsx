

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VendorModal } from "./vendor-modal"
import { Search, Eye, Edit, CheckCircle, XCircle, Star, MapPin } from "lucide-react"

const vendors = [
  {
    id: "1",
    name: "Marie Dubois",
    company: "CleanPro Services",
    companyName: "CleanPro Services",
    owner: "Marie Dubois",
    email: "contact@cleanpro.fr",
    phone: "+33 1 23 45 67 89",
    category: "cleaning",
    categories: ["Nettoyage", "Entretien"],
    zones: "Paris, Île-de-France",
    coverageArea: "Paris, Île-de-France",
    rating: 4.8,
    status: "approved",
    kycStatus: "approved",
    totalBookings: 234,
  },
  {
    id: "2",
    name: "Jean Martin",
    company: "Plomberie Express",
    companyName: "Plomberie Express",
    owner: "Jean Martin",
    email: "contact@plomberie-express.fr",
    phone: "+33 4 56 78 90 12",
    category: "legal",
    categories: ["Plomberie", "Chauffage"],
    zones: "Lyon, Rhône-Alpes",
    coverageArea: "Lyon, Rhône-Alpes",
    rating: 4.6,
    status: "approved",
    kycStatus: "approved",
    totalBookings: 189,
  },
  {
    id: "3",
    name: "Sophie Laurent",
    company: "Déménageurs Pro",
    companyName: "Déménageurs Pro",
    owner: "Sophie Laurent",
    email: "contact@demenageurs-pro.fr",
    phone: "+33 6 12 34 56 78",
    category: "moving",
    categories: ["Déménagement", "Transport"],
    zones: "Marseille, PACA",
    coverageArea: "Marseille, PACA",
    rating: 4.9,
    status: "pending",
    kycStatus: "pending",
    totalBookings: 156,
  },
  {
    id: "4",
    name: "Pierre Durand",
    company: "Électro Services",
    companyName: "Électro Services",
    owner: "Pierre Durand",
    email: "contact@electro-services.fr",
    phone: "+33 5 67 89 01 23",
    category: "renovation",
    categories: ["Électricité", "Domotique"],
    zones: "Bordeaux, Aquitaine",
    coverageArea: "Bordeaux, Aquitaine",
    rating: 4.5,
    status: "rejected",
    kycStatus: "rejected",
    totalBookings: 98,
  },
]

const kycStatusColors = {
  approved: "bg-success/20 text-success",
  pending: "bg-warning/20 text-warning",
  rejected: "bg-destructive/20 text-destructive",
}

const kycStatusLabels = {
  approved: "Vérifié",
  pending: "En attente",
  rejected: "Rejeté",
}

export function VendorsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<(typeof vendors)[0] | undefined>()

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleEdit = (vendor: (typeof vendors)[0]) => {
    setSelectedVendor(vendor)
    setEditModalOpen(true)
  }

  const handleViewProfile = (vendor: (typeof vendors)[0]) => {
    console.log("Voir le profil:", vendor)
    // Implémentez la logique de visualisation du profil ici
  }

  const handleApproveKYC = (vendor: (typeof vendors)[0]) => {
    console.log("Approuver KYC:", vendor)
    // Implémentez la logique d'approbation KYC ici
  }

  const handleRejectKYC = (vendor: (typeof vendors)[0]) => {
    console.log("Rejeter KYC:", vendor)
    // Implémentez la logique de rejet KYC ici
  }

  return (
    <>
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, propriétaire ou catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
            <Button variant="outline" className="border-border bg-transparent">
              Filtres
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {vendor.companyName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{vendor.companyName}</h3>
                      <p className="text-sm text-muted-foreground">{vendor.owner}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={kycStatusColors[vendor.kycStatus as keyof typeof kycStatusColors]}
                  >
                    {kycStatusLabels[vendor.kycStatus as keyof typeof kycStatusLabels]}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm text-muted-foreground">
                    <p>{vendor.email}</p>
                    <p>{vendor.phone}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {vendor.categories.map((category) => (
                      <Badge key={category} variant="outline" className="border-border text-foreground text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.coverageArea}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium text-foreground">{vendor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {vendor.totalBookings} réservations
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(vendor)}
                    className="flex-1 border-border hover:bg-accent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vendor)}
                    className="flex-1 border-border hover:bg-accent"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApproveKYC(vendor)}
                    className="flex-1 bg-success hover:bg-success/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRejectKYC(vendor)}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <VendorModal open={editModalOpen} onOpenChange={setEditModalOpen} vendor={selectedVendor} mode="edit" />
    </>
  )
}