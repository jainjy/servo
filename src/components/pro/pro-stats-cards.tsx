// components/pro/pro-stats-cards.tsx
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card"
import { Calendar, Euro, Star, Users, Clock, TrendingUp } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

// DÉFINITION DU THÈME PERSONNALISÉ
const theme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

interface TourismeBooking {
  id: string;
  confirmationNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  serviceFee: number;
  specialRequests: string;
  paymentMethod: string;
  stripePaymentIntent?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  listing: {
    id: string;
    title: string;
    type: string;
    city: string;
    images: string[];
    price: number;
    provider: string;
    rating?: number;
    reviewCount?: number;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface StatsData {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
  color: string;
  bgColor: string;
}

interface TrendResult {
  change: number;
  trend: "up" | "down";
}

export function ProStatsCards() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StatsData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchBookingStats()
    }
  }, [user?.id])

  const fetchBookingStats = async () => {
    try {
      setLoading(true)
      console.log('🔄 Début du chargement des statistiques pour le professionnel:', user?.id)

      const response = await api.get('/tourisme-bookings?limit=1000')
      console.log('📊 Réponse API complète:', response)

      let bookings: TourismeBooking[] = []
      let averageRating = 0
      let activeClients = 0
      let responseRate = 0

      if (response.data.success) {
        console.log('✅ API retourne success: true')

        if (response.data.data) {
          console.log('📁 Données dans response.data.data:', response.data.data)

          if (Array.isArray(response.data.data)) {
            bookings = response.data.data
            console.log(`📚 ${bookings.length} réservations chargées (structure array directe)`)
          } else if (response.data.data.bookings) {
            bookings = response.data.data.bookings
            averageRating = response.data.data.averageRating || 0
            activeClients = response.data.data.activeClients || 0
            responseRate = response.data.data.responseRate || 0
            console.log(`📚 ${bookings.length} réservations chargées (structure avec bookings)`)
          }
        }
      } else if (Array.isArray(response.data)) {
        bookings = response.data
      } else if (response.data.bookings) {
        bookings = response.data.bookings
        averageRating = response.data.averageRating || 0
        activeClients = response.data.activeClients || 0
        responseRate = response.data.responseRate || 0
      }

      const filteredBookings = bookings.filter(booking => booking.listing.provider === user?.id)
      console.log('📊 Réservations filtrées pour ce professionnel:', filteredBookings.length)

      // Recalculate stats for this professional only
      const proAverageRating = filteredBookings.length > 0
        ? filteredBookings
            .filter(b => b.listing.rating && b.listing.rating > 0)
            .reduce((sum, b) => sum + (b.listing.rating || 0), 0) /
          filteredBookings.filter(b => b.listing.rating && b.listing.rating > 0).length
        : 0

      const proActiveClients = new Set(
        filteredBookings
          .filter(b => b.user?.id)
          .map(b => b.user!.id)
      ).size

      const proResponseRate = filteredBookings.filter(b => b.specialRequests && b.specialRequests.length > 0).length > 0
        ? (filteredBookings.filter(b => b.specialRequests && b.specialRequests.length > 0).length / filteredBookings.length) * 100
        : 0

      console.log('🎯 Données finales extraites:', {
        bookingsCount: filteredBookings.length,
        averageRating: proAverageRating,
        activeClients: proActiveClients,
        responseRate: proResponseRate
      })

      calculateRealStats(filteredBookings, {
        averageRating: proAverageRating,
        activeClients: proActiveClients,
        responseRate: proResponseRate
      })
      
    } catch (error) {
      console.error('❌ Erreur chargement des statistiques:', error)
      calculateRealStats([], { averageRating: 0, activeClients: 0, responseRate: 0 })
    } finally {
      setLoading(false)
    }
  }

  const calculateRealStats = (bookings: TourismeBooking[], extraStats: { averageRating: number, activeClients: number, responseRate: number }) => {
    console.log('🧮 Calcul des statistiques avec:', {
      totalBookings: bookings.length,
      extraStats
    })

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    // Réservations ce mois
    const currentMonthBookings = bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
      } catch (error) {
        return false
      }
    })

    // Revenus (seulement les réservations confirmées et complétées)
    const confirmedAndCompleted = bookings.filter(
      b => b.status === 'confirmed' || b.status === 'completed'
    )
    const totalRevenue = confirmedAndCompleted.reduce((sum, b) => sum + b.totalAmount, 0)

    // Taux de conversion (réservations confirmées + complétées / total)
    const totalBookings = bookings.length
    const successfulBookings = confirmedAndCompleted.length
    const conversionRate = totalBookings > 0 ? (successfulBookings / totalBookings) * 100 : 0

    // Calcul des variations principales
    const monthlyGrowth = calculateMonthlyGrowth(bookings)
    const revenueGrowth = calculateRevenueGrowth(bookings)
    const conversionGrowth = calculateConversionGrowth(bookings)

    // Calcul des variations pour les stats supplémentaires basées sur les données réelles
    const ratingTrend = calculateRatingTrend(bookings, extraStats.averageRating)
    const clientsTrend = calculateClientsTrend(bookings, extraStats.activeClients)
    const responseTrend = calculateResponseTrend(bookings, extraStats.responseRate)

    const realStats: StatsData[] = [
      {
        name: "Réservations ce mois",
        value: currentMonthBookings.length.toString(),
        change: `${monthlyGrowth >= 0 ? '+' : ''}${monthlyGrowth.toFixed(1)}%`,
        trend: monthlyGrowth >= 0 ? "up" : "down",
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        name: "Revenus (€)",
        value: `€${totalRevenue.toFixed(2)}`,
        change: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
        trend: revenueGrowth >= 0 ? "up" : "down",
        icon: Euro,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        name: "Note moyenne",
        value: extraStats.averageRating > 0 ? extraStats.averageRating.toFixed(1) : "0.0",
        change: `${ratingTrend.change >= 0 ? '+' : ''}${ratingTrend.change.toFixed(1)}`,
        trend: ratingTrend.trend,
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      },
      {
        name: "Clients actifs",
        value: extraStats.activeClients > 0 ? extraStats.activeClients.toString() : "0",
        change: `${clientsTrend.change >= 0 ? '+' : ''}${clientsTrend.change}`,
        trend: clientsTrend.trend,
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      {
        name: "Taux de réponse",
        value: `${extraStats.responseRate > 0 ? extraStats.responseRate : 0}%`,
        change: `${responseTrend.change >= 0 ? '+' : ''}${responseTrend.change}%`,
        trend: responseTrend.trend,
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      {
        name: "Taux de conversion",
        value: `${conversionRate.toFixed(1)}%`,
        change: `${conversionGrowth >= 0 ? '+' : ''}${conversionGrowth.toFixed(1)}%`,
        trend: conversionGrowth >= 0 ? "up" : "down",
        icon: TrendingUp,
        color: "text-cyan-600",
        bgColor: "bg-cyan-50"
      },
    ]

    console.log('📊 Statistiques finales calculées:', realStats)
    setStats(realStats)
  }

  // Fonctions de calcul des tendances pour les stats supplémentaires
  const calculateRatingTrend = (bookings: TourismeBooking[], currentRating: number): TrendResult => {
    if (bookings.length === 0 || currentRating === 0) {
      return { change: 0, trend: "up" }
    }

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Calcul de la note moyenne du mois dernier basée sur les listings
    const lastMonthBookings = bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear
      } catch (error) {
        return false
      }
    })

    const lastMonthRatings = lastMonthBookings
      .map(booking => booking.listing.rating)
      .filter((rating): rating is number => rating !== undefined && rating > 0)

    const lastMonthRating = lastMonthRatings.length > 0
      ? lastMonthRatings.reduce((sum, rating) => sum + rating, 0) / lastMonthRatings.length
      : currentRating

    const change = currentRating - lastMonthRating
    return {
      change: Math.round(change * 10) / 10,
      trend: change >= 0 ? "up" : "down"
    }
  }

  const calculateClientsTrend = (bookings: TourismeBooking[], currentClients: number): TrendResult => {
    if (bookings.length === 0 || currentClients === 0) {
      return { change: 0, trend: "up" }
    }

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Calcul des clients uniques du mois dernier
    const lastMonthBookings = bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear
      } catch (error) {
        return false
      }
    })

    const lastMonthClients = new Set(
      lastMonthBookings
        .filter(booking => booking.user?.id)
        .map(booking => booking.user!.id)
    ).size

    const change = currentClients - lastMonthClients
    return {
      change: Math.round(change),
      trend: change >= 0 ? "up" : "down"
    }
  }

  const calculateResponseTrend = (bookings: TourismeBooking[], currentRate: number): TrendResult => {
    if (bookings.length === 0 || currentRate === 0) {
      return { change: 0, trend: "up" }
    }

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Calcul du taux de réponse du mois dernier basé sur les réservations avec réponse
    const lastMonthBookings = bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear
      } catch (error) {
        return false
      }
    })

    // Simulation: considérer qu'une réservation avec des demandes spéciales répondues a un taux de réponse positif
    const lastMonthWithSpecialRequests = lastMonthBookings.filter(booking => 
      booking.specialRequests && booking.specialRequests.length > 0
    ).length

    const lastMonthTotalWithRequests = lastMonthBookings.filter(booking => 
      booking.specialRequests !== undefined
    ).length

    const lastMonthResponseRate = lastMonthTotalWithRequests > 0 
      ? (lastMonthWithSpecialRequests / lastMonthTotalWithRequests) * 100 
      : currentRate

    const change = currentRate - lastMonthResponseRate
    return {
      change: Math.round(change),
      trend: change >= 0 ? "up" : "down"
    }
  }

  // Fonctions de calcul des tendances principales
  const calculateMonthlyGrowth = (bookings: TourismeBooking[]): number => {
    if (bookings.length === 0) return 0

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthBookings = bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
      } catch (error) {
        return false
      }
    })

    const lastMonthBookings = bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear
      } catch (error) {
        return false
      }
    })

    if (lastMonthBookings.length === 0) return currentMonthBookings.length > 0 ? 100 : 0
    
    const growth = ((currentMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100
    return Math.round(growth * 10) / 10
  }

  const calculateRevenueGrowth = (bookings: TourismeBooking[]): number => {
    if (bookings.length === 0) return 0

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthRevenue = bookings
      .filter(booking => {
        try {
          const bookingDate = new Date(booking.createdAt)
          return bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear &&
                 (booking.status === 'confirmed' || booking.status === 'completed')
        } catch (error) {
          return false
        }
      })
      .reduce((sum, b) => sum + b.totalAmount, 0)

    const lastMonthRevenue = bookings
      .filter(booking => {
        try {
          const bookingDate = new Date(booking.createdAt)
          return bookingDate.getMonth() === lastMonth && 
                 bookingDate.getFullYear() === lastMonthYear &&
                 (booking.status === 'confirmed' || booking.status === 'completed')
        } catch (error) {
          return false
        }
      })
      .reduce((sum, b) => sum + b.totalAmount, 0)

    if (lastMonthRevenue === 0) return currentMonthRevenue > 0 ? 100 : 0
    
    const growth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    return Math.round(growth * 10) / 10
  }

  const calculateConversionGrowth = (bookings: TourismeBooking[]): number => {
    if (bookings.length === 0) return 0

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthBookings = bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
      } catch (error) {
        return false
      }
    })

    const currentMonthSuccessful = currentMonthBookings.filter(
      b => b.status === 'confirmed' || b.status === 'completed'
    )

    const lastMonthBookings = bookings.filter(booking => {
      try {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear
      } catch (error) {
        return false
      }
    })

    const lastMonthSuccessful = lastMonthBookings.filter(
      b => b.status === 'confirmed' || b.status === 'completed'
    )

    const currentRate = currentMonthBookings.length > 0 ? 
      (currentMonthSuccessful.length / currentMonthBookings.length) * 100 : 0
    
    const lastRate = lastMonthBookings.length > 0 ? 
      (lastMonthSuccessful.length / lastMonthBookings.length) * 100 : 0

    if (lastRate === 0) return currentRate > 0 ? 100 : 0
    
    const growth = currentRate - lastRate
    return Math.round(growth * 10) / 10
  }

  const getDefaultStats = (): StatsData[] => [
    {
      name: "Réservations ce mois",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Revenus (€)",
      value: "€0.00",
      change: "0%",
      trend: "up",
      icon: Euro,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      name: "Note moyenne",
      value: "0.0",
      change: "0%",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      name: "Clients actifs",
      value: "0",
      change: "0",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      name: "Taux de réponse",
      value: "0%",
      change: "0%",
      trend: "up",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      name: "Taux de conversion",
      value: "0%",
      change: "0%",
      trend: "up",
      icon: TrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getDefaultStats().map((stat, index) => (
          <Card 
            key={stat.name + index} 
            className="p-6 hover:shadow-md transition-shadow"
            style={{backgroundColor: theme.lightBg,borderColor: theme.separator}}
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className={`h-12 w-12 rounded-lg`} style={{ backgroundColor: `${theme.separator}80` }}></div>
                <div className="h-4 w-12 rounded" style={{ backgroundColor: theme.separator }}></div>
              </div>
              <div className="mt-4">
                <div className="h-4 w-24 rounded mb-2" style={{ backgroundColor: theme.separator }}></div>
                <div className="h-6 w-16 rounded" style={{ backgroundColor: theme.separator }}></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card 
          key={stat.name + index} 
          className="p-6 hover:shadow-md transition-shadow"
          style={{backgroundColor: theme.lightBg,borderColor: theme.separator,transition: 'all 0.3s ease'}}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 12px ${theme.primaryDark}20`;
            e.currentTarget.style.borderColor = theme.primaryDark;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.borderColor = theme.separator;
          }}
        >
          <div className="flex items-center justify-between">
            <div 
              className={`flex h-12 w-12 items-center justify-center rounded-lg`}
              style={{ backgroundColor: `${theme.logo}15`}}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <span 
              className={`text-sm font-medium`}
              style={{ 
                color: stat.trend === 'up' ? theme.primaryDark : theme.secondaryText
              }}
            >
              {stat.change}
            </span>
          </div>
          <div className="mt-4">            <p 
              className="text-sm font-medium"
              style={{ color: theme.secondaryText }}
            >
              {stat.name}
            </p>            <p 
              className="mt-1 text-2xl font-bold"
              style={{ color: theme.logo }}
            >
              {stat.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
