import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Edit, Trash2, Star, Image as ImageIcon, Users, Calendar, Clock } from "lucide-react"
import api from "@/lib/api"
import { ServiceModalPro } from "./ServiceModalPro"

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
    active: "bg-success/20 text-success",
    inactive: "bg-muted text-muted-foreground",
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
            await api.delete(`/harmonie/${service.id}`) // Corrigé l'URL
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
            <Card className="bg-card border-border p-6 flex flex-col gap-4">
                <img src="/loading.gif" alt="" className='w-24 h-24'/>
                <div className="text-center text-muted-foreground">Chargement des services...</div>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
                const stats = getVendorStats(service)

                return (
                    <Card key={service.id} className="relative border-0 bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group">
                        {/* Gradient top bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                        {/* Background gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 transition-all duration-500"></div>

                        <div className="relative p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 pr-4">
                                    <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                                        {service.libelle}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
                                            {service.category?.name || "Non catégorisé"}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className={`${statusColors[service.status as keyof typeof statusColors]} text-xs font-semibold`}
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
                                        <span className="text-sm font-semibold text-slate-700 ml-1">{stats.avgRating.toFixed(1)}</span>
                                    </div>
                                </div>

                                {/* Icon badge */}
                                {service.images.length > 0 ? (
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <ImageIcon className="h-8 w-8 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <ImageIcon className="h-8 w-8 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {service.description && (
                                <p className="text-sm text-slate-600 mb-5 leading-relaxed line-clamp-3">
                                    {service.description}
                                </p>
                            )}

                            {/* Metiers tags */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {service.metiers?.slice(0, 2).map(metierItem => (
                                    <span key={metierItem.metier.id} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium hover:bg-slate-200 transition-colors line-clamp-1">
                                        {metierItem.metier.libelle}
                                    </span>
                                ))}
                                {service.metiers?.length > 2 && (
                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                        +{service.metiers.length - 2} autres
                                    </span>
                                )}
                            </div>

                            {/* Section Prestataires (Users) - AFFICHAGE DES NOMS */}
                            {service.users && service.users.length > 0 && (
                                <div className="mb-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Prestataires</span>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                            {service.users.length} prestataire(s)
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {service.users.slice(0, 3).map((user, index) => (
                                            <div key={user.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                                                    {user.name?.charAt(0) || "U"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 truncate">
                                                        {user.name || "Prestataire sans nom"}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            <span className="text-xs text-slate-600">{user.rating?.toFixed(1) || "0.0"}</span>
                                                        </div>
                                                        <span className="text-xs text-slate-500">•</span>
                                                        <span className="text-xs text-slate-600">{user.bookings || 0} réservations</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {service.users.length > 3 && (
                                            <div className="text-center">
                                                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                                    +{service.users.length - 3} autres prestataires
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Message si aucun prestataire */}
                            {(!service.users || service.users.length === 0) && (
                                <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm text-amber-700">Aucun prestataire associé</span>
                                    </div>
                                </div>
                            )}

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        <span className="text-xs text-slate-600 font-medium">Prestataires</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-800">{stats.totalVendors}</span>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                        <span className="text-xs text-slate-600 font-medium">Réservations</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-800">{stats.totalBookings}</span>
                                </div>
                            </div>

                            {/* Duration & Price */}
                            <div className="flex items-center justify-between mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-slate-600" />
                                    <div>
                                        <span className="text-xs text-slate-500 block">Durée</span>
                                        <span className="text-sm font-semibold text-slate-800">{service.duration} min</span>
                                    </div>
                                </div>

                                <div className="h-8 w-px bg-slate-200"></div>

                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block">Prix</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                                    className="flex-1 border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 font-semibold"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(service)}
                                    className="border-slate-200 hover:border-red-400 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
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