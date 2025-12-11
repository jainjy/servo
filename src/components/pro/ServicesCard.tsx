import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Edit, Trash2, Star, Image as ImageIcon, Users, Calendar, Clock } from "lucide-react"
import api from "@/lib/api"
import { ServiceModalPro } from "./ServiceModalPro"

// Nouvelle palette de couleurs
const COLORS = {
  LOGO: "#556B2F",           /* Olive green - accent */
  PRIMARY_DARK: "#6B8E23",   /* Yellow-green - primary */
  LIGHT_BG: "#FFFFFF",       /* White - fond clair */
  SEPARATOR: "#D3D3D3",      /* Light gray - séparateurs */
  SECONDARY_TEXT: "#8B4513", /* Saddle brown - textes secondaires */
  TEXT_BLACK: "#000000",     /* Black - petits textes */
};

interface Service {
    id: number
    libelle: string
    description: string
    category: {
        id: number
        name: string
    }
    categoryId: number
    images: string[]
    metiers: Array<{
        metier: {
            id: number
            libelle: string
        }
    }>
    users: Array<{
        id: string
        name: string
        rating: number
        bookings: number
    }>
    status: string
    duration: number
    price: number
}

const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
}

export function ServicesCard() {
    const [services, setServices] = useState<Service[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<Service | undefined>()
    const [loading, setLoading] = useState(true)

    const fetchServices = async () => {
        try {
            const response = await api.get('/harmonie/services')
            console.log("Reponse du data : ", response.data)
            setServices(response.data)
        } catch (error) {
            console.error('Erreur lors du chargement des services:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const handleEdit = (service: Service) => {
        setSelectedService(service)
        setEditModalOpen(true)
    }

    const handleDelete = async (service: Service) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le service "${service.libelle}" ?`)) {
            return
        }

        try {
            await api.delete(`/harmonie/${service.id}`)
            await fetchServices()
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
            alert(error.response?.data?.error || 'Erreur lors de la suppression')
        }
    }

    const getVendorStats = (service: Service) => {
        const totalVendors = service.users.length
        const avgRating = service.users.reduce((acc, user) => acc + (user.rating || 0), 0) / totalVendors || 0
        const totalBookings = service.users.reduce((acc, user) => acc + (user.bookings || 0), 0)

        return { totalVendors, avgRating, totalBookings }
    }

    if (loading) {
        return (
            <Card className="p-6 flex flex-col gap-4 items-center justify-center"
                  style={{ 
                    backgroundColor: COLORS.LIGHT_BG,
                    borderColor: COLORS.SEPARATOR 
                  }}>
                <img src="/loading.gif" alt="Chargement" className='w-24 h-24'/>
                <div className="text-center" style={{ color: COLORS.SECONDARY_TEXT }}>
                  Chargement des services...
                </div>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
                const stats = getVendorStats(service)

                return (
                    <Card 
                      key={service.id} 
                      className="relative border hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                      style={{ 
                        backgroundColor: COLORS.LIGHT_BG,
                        borderColor: COLORS.SEPARATOR 
                      }}
                    >
                        {/* Top bar */}
                        <div className="absolute top-0 left-0 w-full h-1" 
                             style={{ backgroundColor: COLORS.PRIMARY_DARK }}></div>

                        <div className="relative p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 pr-4">
                                    <h3 className="font-bold text-xl mb-2 group-hover:transition-colors duration-300 line-clamp-2"
                                        style={{ color: COLORS.PRIMARY_DARK }}>
                                        {service.libelle}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge 
                                          variant="outline" 
                                          className="text-xs font-semibold"
                                          style={{ 
                                            borderColor: COLORS.LOGO,
                                            backgroundColor: `${COLORS.LOGO}20`,
                                            color: COLORS.LOGO
                                          }}
                                        >
                                            {service.category?.name || "Non catégorisé"}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className={`text-xs font-semibold ${statusColors[service.status as keyof typeof statusColors]}`}
                                        >
                                            {service.status === "active" ? "Actif" : "Inactif"}
                                        </Badge>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(stats.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="text-sm font-semibold ml-1" 
                                              style={{ color: COLORS.SECONDARY_TEXT }}>
                                            {stats.avgRating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Icon badge */}
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:transition-all duration-300"
                                     style={{ backgroundColor: COLORS.LOGO }}>
                                    <ImageIcon className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            {/* Description */}
                            {service.description && (
                                <p className="text-sm mb-5 leading-relaxed line-clamp-3"
                                   style={{ color: COLORS.TEXT_BLACK }}>
                                    {service.description}
                                </p>
                            )}

                            {/* Metiers tags */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {service.metiers?.slice(0, 2).map(metierItem => (
                                    <span 
                                      key={metierItem.metier.id} 
                                      className="px-3 py-1 rounded-full text-xs font-medium line-clamp-1"
                                      style={{ 
                                        backgroundColor: `${COLORS.SEPARATOR}50`,
                                        color: COLORS.SECONDARY_TEXT 
                                      }}
                                    >
                                        {metierItem.metier.libelle}
                                    </span>
                                ))}
                                {service.metiers?.length > 2 && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                                          style={{ 
                                            backgroundColor: `${COLORS.SEPARATOR}50`,
                                            color: COLORS.SECONDARY_TEXT 
                                          }}>
                                        +{service.metiers.length - 2} autres
                                    </span>
                                )}
                            </div>

                            {/* Section Prestataires (Users) */}
                            {service.users && service.users.length > 0 && (
                                <div className="mb-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold" 
                                              style={{ color: COLORS.PRIMARY_DARK }}>
                                            Prestataires
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded-full"
                                              style={{ 
                                                backgroundColor: `${COLORS.SEPARATOR}30`,
                                                color: COLORS.SECONDARY_TEXT 
                                              }}>
                                            {service.users.length} prestataire(s)
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {service.users.slice(0, 3).map((user, index) => (
                                            <div key={user.id} 
                                                 className="flex items-center gap-3 p-2 rounded-lg transition-colors"
                                                 style={{ 
                                                   backgroundColor: `${COLORS.SEPARATOR}20`
                                                 }}>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                                                     style={{ 
                                                       backgroundColor: COLORS.LOGO,
                                                       color: COLORS.LIGHT_BG 
                                                     }}>
                                                    {user.name?.charAt(0) || "U"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate"
                                                       style={{ color: COLORS.TEXT_BLACK }}>
                                                        {user.name || "Prestataire sans nom"}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            <span className="text-xs" 
                                                                  style={{ color: COLORS.SECONDARY_TEXT }}>
                                                                {user.rating?.toFixed(1) || "0.0"}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs" 
                                                              style={{ color: COLORS.SEPARATOR }}>•</span>
                                                        <span className="text-xs" 
                                                              style={{ color: COLORS.SECONDARY_TEXT }}>
                                                            {user.bookings || 0} réservations
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {service.users.length > 3 && (
                                            <div className="text-center">
                                                <span className="text-xs px-3 py-1 rounded-full"
                                                      style={{ 
                                                        backgroundColor: `${COLORS.SEPARATOR}30`,
                                                        color: COLORS.SECONDARY_TEXT 
                                                      }}>
                                                    +{service.users.length - 3} autres prestataires
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Message si aucun prestataire */}
                            {(!service.users || service.users.length === 0) && (
                                <div className="mb-5 p-3 rounded-lg border"
                                     style={{ 
                                       backgroundColor: `${COLORS.SECONDARY_TEXT}10`,
                                       borderColor: COLORS.SECONDARY_TEXT 
                                     }}>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" style={{ color: COLORS.SECONDARY_TEXT }} />
                                        <span className="text-sm" style={{ color: COLORS.SECONDARY_TEXT }}>
                                            Aucun prestataire associé
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="rounded-xl p-3 border"
                                     style={{ 
                                       backgroundColor: `${COLORS.PRIMARY_DARK}10`,
                                       borderColor: `${COLORS.PRIMARY_DARK}30`
                                     }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="h-4 w-4" style={{ color: COLORS.PRIMARY_DARK }} />
                                        <span className="text-xs font-medium" style={{ color: COLORS.SECONDARY_TEXT }}>
                                            Prestataires
                                        </span>
                                    </div>
                                    <span className="text-2xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
                                        {stats.totalVendors}
                                    </span>
                                </div>

                                <div className="rounded-xl p-3 border"
                                     style={{ 
                                       backgroundColor: `${COLORS.LOGO}10`,
                                       borderColor: `${COLORS.LOGO}30`
                                     }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="h-4 w-4" style={{ color: COLORS.LOGO }} />
                                        <span className="text-xs font-medium" style={{ color: COLORS.SECONDARY_TEXT }}>
                                            Réservations
                                        </span>
                                    </div>
                                    <span className="text-2xl font-bold" style={{ color: COLORS.LOGO }}>
                                        {stats.totalBookings}
                                    </span>
                                </div>
                            </div>

                            {/* Duration & Price */}
                            <div className="flex items-center justify-between mb-5 p-4 rounded-xl border"
                                 style={{ 
                                   backgroundColor: `${COLORS.SEPARATOR}20`,
                                   borderColor: COLORS.SEPARATOR 
                                 }}>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" style={{ color: COLORS.SECONDARY_TEXT }} />
                                    <div>
                                        <span className="text-xs block" style={{ color: COLORS.SECONDARY_TEXT }}>
                                            Durée
                                        </span>
                                        <span className="text-sm font-semibold" style={{ color: COLORS.TEXT_BLACK }}>
                                            {service.duration} min
                                        </span>
                                    </div>
                                </div>

                                <div className="h-8 w-px" style={{ backgroundColor: COLORS.SEPARATOR }}></div>

                                <div className="text-right">
                                    <span className="text-xs block" style={{ color: COLORS.SECONDARY_TEXT }}>
                                        Prix
                                    </span>
                                    <span className="text-2xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
                                        {service.price}€
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(service)}
                                    className="flex-1 font-semibold transition-all duration-300"
                                    style={{ 
                                      borderColor: COLORS.SEPARATOR,
                                      color: COLORS.SECONDARY_TEXT,
                                      backgroundColor: COLORS.LIGHT_BG 
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(service)}
                                    className="transition-all duration-300"
                                    style={{ 
                                      borderColor: COLORS.SEPARATOR,
                                      color: COLORS.SECONDARY_TEXT,
                                      backgroundColor: COLORS.LIGHT_BG 
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                )
            })}

            <ServiceModalPro
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                service={selectedService}
                mode="edit"
                onServiceUpdated={fetchServices}
            />
        </div>
    )
}