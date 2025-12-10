// components/pro/pro-performance-charts.tsx
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import api from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

// Définition du thème
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

interface Review {
  id: string;
  rating: number;
  createdAt: string;
  listingId: string;
  comment?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

interface RatingData {
  month: string;
  rating: number;
}

export function ProPerformanceCharts() {
  const { user } = useAuth()
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [ratingData, setRatingData] = useState<RatingData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchChartData()
    }
  }, [user?.id])

  const fetchChartData = async () => {
    try {
      setLoading(true)

      // Récupérer les réservations pour les revenus
      const bookingsResponse = await api.get('/tourisme-bookings?limit=1000')
      let bookings: TourismeBooking[] = []

      if (bookingsResponse.data.success) {
        if (bookingsResponse.data.data) {
          if (Array.isArray(bookingsResponse.data.data)) {
            bookings = bookingsResponse.data.data
          } else if (bookingsResponse.data.data.bookings) {
            bookings = bookingsResponse.data.data.bookings
          }
        }
      } else if (Array.isArray(bookingsResponse.data)) {
        bookings = bookingsResponse.data
      } else if (bookingsResponse.data.bookings) {
        bookings = bookingsResponse.data.bookings
      }

      const filteredBookings = bookings.filter(booking => booking.listing.provider === user?.id)
      console.log('Bookings chargés:', filteredBookings.length, 'sur', bookings.length)

      // Récupérer les avis pour les notes
      let reviews: Review[] = []
      try {
        const reviewsResponse = await api.get('/reviews?limit=1000')
        
        if (reviewsResponse.data.success) {
          if (Array.isArray(reviewsResponse.data.data)) {
            reviews = reviewsResponse.data.data
          } else if (Array.isArray(reviewsResponse.data.reviews)) {
            reviews = reviewsResponse.data.reviews
          }
        } else if (Array.isArray(reviewsResponse.data)) {
          reviews = reviewsResponse.data
        } else if (reviewsResponse.data.reviews) {
          reviews = reviewsResponse.data.reviews
        }
      } catch (error) {
        console.log('Endpoint reviews non disponible')
        reviews = []
      }

      console.log('Reviews chargés:', reviews.length)

      // Filter reviews to only include those for the current professional's listings
      const proListingIds = new Set(filteredBookings.map(b => b.listing.id))
      const filteredReviews = reviews.filter(review => proListingIds.has(review.listingId))

      // Calcul des données de revenus pour les 7 derniers jours
      const revenueChartData = calculateRevenueData(filteredBookings)
      setRevenueData(revenueChartData)

      // Calcul des données de notation pour les 6 derniers mois
      const ratingChartData = calculateRatingData(filteredReviews, filteredBookings)
      setRatingData(ratingChartData)

    } catch (error) {
      console.error('Erreur chargement des données graphiques:', error)
      setRevenueData([])
      setRatingData([])
    } finally {
      setLoading(false)
    }
  }

  const calculateRevenueData = (bookings: TourismeBooking[]): RevenueData[] => {
    const today = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      return date
    }).reverse()

    console.log('Calcul revenue data pour', bookings.length, 'bookings')

    const result = last7Days.map(date => {
      const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
      
      const dayBookings = bookings.filter(booking => {
        try {
          const bookingDate = new Date(booking.createdAt)
          const isSameDay = bookingDate.toDateString() === date.toDateString()
          
          // Accepter tous les statuts sauf cancelled
          const isValidStatus = booking.status !== 'cancelled'
          
          return isSameDay && isValidStatus
        } catch (error) {
          console.error('Erreur date booking:', booking.id)
          return false
        }
      })

      const revenue = dayBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
      const bookingsCount = dayBookings.length

      console.log(`Date ${dateStr}: ${bookingsCount} bookings, ${revenue}€`)

      return {
        date: dateStr,
        revenue,
        bookings: bookingsCount
      }
    })

    console.log('Revenue data final:', result)
    return result
  }

  const calculateRatingData = (reviews: Review[], bookings: TourismeBooking[]): RatingData[] => {
    const today = new Date()
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      return date
    }).reverse()

    console.log('Calcul rating data - Reviews:', reviews.length, 'Bookings:', bookings.length)

    // Si pas de reviews, utiliser les ratings des listings des bookings
    let ratingsToUse: {rating: number, createdAt: string}[] = []
    
    if (reviews.length > 0) {
      ratingsToUse = reviews.map(review => ({
        rating: review.rating,
        createdAt: review.createdAt
      }))
    } else {
      // Utiliser les ratings des listings comme fallback
      ratingsToUse = bookings
        .filter(booking => booking.listing.rating && booking.listing.rating > 0)
        .map(booking => ({
          rating: booking.listing.rating!,
          createdAt: booking.createdAt
        }))
    }

    console.log('Ratings à utiliser:', ratingsToUse.length)

    const result = last6Months.map(monthDate => {
      const monthStr = monthDate.toLocaleDateString('fr-FR', { month: 'short' })
      
      const monthRatings = ratingsToUse.filter(item => {
        try {
          const itemDate = new Date(item.createdAt)
          return itemDate.getMonth() === monthDate.getMonth() &&
                 itemDate.getFullYear() === monthDate.getFullYear()
        } catch (error) {
          return false
        }
      })

      const averageRating = monthRatings.length > 0 
        ? monthRatings.reduce((sum, item) => sum + item.rating, 0) / monthRatings.length
        : 0 // 0 si vraiment pas de données

      console.log(`Mois ${monthStr}: ${monthRatings.length} ratings, moyenne: ${averageRating}`)

      return {
        month: monthStr,
        rating: Math.round(averageRating * 10) / 10
      }
    })

    console.log('Rating data final:', result)
    return result
  }

  // Données par défaut pour le loading
  const defaultRevenueData = [
    { date: "01 Jan", revenue: 0, bookings: 0 },
    { date: "08 Jan", revenue: 0, bookings: 0 },
    { date: "15 Jan", revenue: 0, bookings: 0 },
    { date: "22 Jan", revenue: 0, bookings: 0 },
    { date: "29 Jan", revenue: 0, bookings: 0 },
    { date: "05 Fév", revenue: 0, bookings: 0 },
    { date: "12 Fév", revenue: 0, bookings: 0 },
  ]

  const defaultRatingData = [
    { month: "Jan", rating: 0 },
    { month: "Fév", rating: 0 },
    { month: "Mar", rating: 0 },
    { month: "Avr", rating: 0 },
    { month: "Mai", rating: 0 },
    { month: "Jun", rating: 0 },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6" style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold" style={{ color: theme.logo }}>Revenus et réservations</h3>
            <p className="text-sm" style={{ color: theme.secondaryText }}>Évolution sur les 7 derniers jours</p>
          </div>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenus (€)",
                color: theme.logo,
              },
              bookings: {
                label: "Réservations",
                color: theme.primaryDark,
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.logo} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.logo} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.primaryDark} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.primaryDark} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.separator} />
                <XAxis dataKey="date" stroke={theme.secondaryText} fontSize={12} />
                <YAxis stroke={theme.secondaryText} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={theme.logo}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke={theme.primaryDark}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card className="p-6" style={{ backgroundColor: theme.lightBg, borderColor: theme.separator }}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold" style={{ color: theme.logo }}>Évolution de la note</h3>
            <p className="text-sm" style={{ color: theme.secondaryText }}>Moyenne sur les 6 derniers mois</p>
          </div>
          <ChartContainer
            config={{
              rating: {
                label: "Note",
                color: theme.secondaryText,
              },
            }}
            className="h-[150px] lg:w-full w-4/5"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultRatingData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.separator} />
                <XAxis dataKey="month" stroke={theme.secondaryText} fontSize={12} />
                <YAxis 
                  stroke={theme.secondaryText} 
                  fontSize={12}
                  domain={[0, 5]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="rating"
                  fill={theme.secondaryText}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    )
  }

  const hasRevenueData = revenueData.some(item => item.revenue > 0 || item.bookings > 0)
  const hasRatingData = ratingData.some(item => item.rating > 0)

  console.log('Render - Has revenue data:', hasRevenueData)
  console.log('Render - Has rating data:', hasRatingData)
  console.log('Render - Revenue data:', revenueData)
  console.log('Render - Rating data:', ratingData)

  return (
    <div className="space-y-6">
      <Card className="p-0 lg:p-6 border-none bg-transparent lg:border" style={{ 
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        ...(window.innerWidth >= 1024 && { backgroundColor: theme.lightBg, borderColor: theme.separator })
      }}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold" style={{ color: theme.logo }}>Revenus et réservations</h3>
          <p className="text-sm" style={{ color: theme.secondaryText }}>Évolution sur les 7 derniers jours</p>
        </div>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenus (€)",
              color: theme.logo,
            },
            bookings: {
              label: "Réservations",
              color: theme.primaryDark,
            },
          }}
          className="h-[200px] lg:w-full w-4/5"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hasRevenueData ? revenueData : defaultRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.logo} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.logo} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.primaryDark} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.primaryDark} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.separator} />
              <XAxis dataKey="date" stroke={theme.secondaryText} fontSize={12} />
              <YAxis stroke={theme.secondaryText} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={theme.logo}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke={theme.primaryDark}
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        {!hasRevenueData && (
          <div className="text-center mt-4" style={{ color: theme.secondaryText }}>
            Aucune donnée de revenus pour les 7 derniers jours
          </div>
        )}
      </Card>

      <Card className="p-0 lg:p-6 bg-transparent lg:border border-none" style={{ 
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        ...(window.innerWidth >= 1024 && { backgroundColor: theme.lightBg, borderColor: theme.separator })
      }}>
        <div className=" mb-4">
          <h3 className="text-lg font-semibold" style={{ color: theme.logo }}>Évolution de la note</h3>
          <p className="text-sm" style={{ color: theme.secondaryText }}>Moyenne sur les 6 derniers mois</p>
        </div>
        <ChartContainer
          config={{
            rating: {
              label: "Note",
              color: theme.secondaryText,
            },
          }}
          className="h-[150px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hasRatingData ? ratingData : defaultRatingData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.separator} />
              <XAxis dataKey="month" stroke={theme.secondaryText} fontSize={12} />
              <YAxis 
                stroke={theme.secondaryText} 
                fontSize={12}
                domain={[0, 5]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="rating"
                fill={theme.secondaryText}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        {!hasRatingData && (
          <div className="text-center mt-4" style={{ color: theme.secondaryText }}>
            Aucune donnée de notes pour les 6 derniers mois
          </div>
        )}
      </Card>
    </div>
  )
}
