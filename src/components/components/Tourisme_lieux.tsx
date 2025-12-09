import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Star,
  Calendar,
  Ticket,
  Heart,
  Camera,
  BookOpen,
  Castle,
  Church,
  Building,
  Landmark,
  GalleryVerticalEnd,
  X,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Dumbbell,
  Tv,
  CheckCircle,
  Globe,
  Phone,
  User,
  CreditCard,
  QrCode,
} from "lucide-react";
import { tourismeAPI } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import TourismNavigation from "../TourismNavigation";

// Interfaces (inchangées)
interface LieuTouristique {
  id: string;
  idUnique: string;
  title: string;
  description: string;
  type: string;
  category: string;
  city: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  available: boolean;
  featured: boolean;
  isTouristicPlace: boolean;
  openingHours: string;
  entranceFee: string;
  website: string;
  contactInfo: string;
  coordonnees: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
  maxGuests?: number;
}

interface LieuxTouristiquesProps {
  ville?: string;
  typeFiltre?: string;
}

interface ReservationData {
  placeId: string;
  visitDate: string;
  visitTime: string;
  numberOfTickets: number;
  ticketType: string;
  specialRequests?: string;
  paymentMethod: string;
}

const LieuxTouristiques: React.FC<LieuxTouristiquesProps> = () => {
  const { user, isAuthenticated } = useAuth();

  const [filtreType, setFiltreType] = useState<string>("tous");
  const [tri, setTri] = useState<string>("rating");
  const [lieuSelectionne, setLieuSelectionne] =
    useState<LieuTouristique | null>(null);
  const [loading, setLoading] = useState(true);
  const [lieux, setLieux] = useState<LieuTouristique[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData>({
    placeId: "",
    visitDate: "",
    visitTime: "",
    numberOfTickets: 1,
    ticketType: "adult",
    specialRequests: "",
    paymentMethod: "card",
  });
  const [reservationLoading, setReservationLoading] = useState(false);
  const [availability, setAvailability] = useState<any>(null);

  // === PALETTE DE COULEURS IDENTIQUE AU VOLS ===
  const colors = {
    logo: "#556B2F", // Olive green
    primaryDark: "#6B8E23", // Yellow-green
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513", // Saddle brown
  };

  const fallbackImages = {
    monument:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    museum:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    park: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    beach:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    mountain:
      "https://images.unsplash.com/photo-1464822759844-dfa37c4d70ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    religious:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    historical:
      "https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    cultural:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    natural:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    default:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  };

  const availableAmenities = [
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "breakfast", label: "Petit-déjeuner", icon: Utensils },
    { id: "gym", label: "Salle de sport", icon: Dumbbell },
    { id: "ac", label: "Climatisation", icon: Snowflake },
    { id: "tv", label: "Télévision", icon: Tv },
  ];

  const ticketTypes = [
    { value: "adult", label: "Adulte", priceMultiplier: 1 },
    { value: "child", label: "Enfant", priceMultiplier: 0.5 },
    { value: "student", label: "Étudiant", priceMultiplier: 0.7 },
    { value: "senior", label: "Senior", priceMultiplier: 0.8 },
  ];

  const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    category: string = "default"
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      fallbackImages[category as keyof typeof fallbackImages] ||
      fallbackImages.default;
    target.onerror = null;
  };

  const getSafeImageUrl = (
    imageUrl: string | undefined,
    category: string = "default"
  ): string => {
    if (!imageUrl || !imageUrl.startsWith("http")) {
      return (
        fallbackImages[category as keyof typeof fallbackImages] ||
        fallbackImages.default
      );
    }
    return imageUrl;
  };

  const loadTouristicPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tourismeAPI.getTouristicPlaces();
      if (response.data.success) {
        setLieux(
          response.data.data.map((place: any) => ({
            ...place,
            coordonnees: {
              lat: place.lat || 48.8566,
              lng: place.lng || 2.3522,
            },
            maxGuests: place.maxGuests || 50,
          }))
        );
      }
    } catch (error) {
      console.error("Erreur chargement lieux:", error);
      setError("Impossible de charger les lieux touristiques");
      setLieux(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (placeId: string, visitDate: string) => {
    try {
      const response = await tourismeAPI.checkPlaceAvailability(
        placeId,
        visitDate
      );
      if (response.data.success) setAvailability(response.data.data);
    } catch (error) {
      setAvailability(null);
    }
  };

  const handleOpenReservation = (lieu: LieuTouristique) => {
    if (!isAuthenticated || !user) {
      alert("Veuillez vous connecter pour réserver");
      window.location.href = "/login";
      return;
    }
    setLieuSelectionne(lieu);
    setReservationData({
      ...reservationData,
      placeId: lieu.id,
      visitDate: new Date().toISOString().split("T")[0],
    });
    setIsReservationOpen(true);
    checkAvailability(lieu.id, new Date().toISOString().split("T")[0]);
  };

  const handleSubmitReservation = async () => {
    if (!reservationData.visitDate || !reservationData.visitTime) {
      alert("Veuillez sélectionner une date et une heure");
      return;
    }
    if (!isAuthenticated || !user) {
      alert("Connexion requise");
      window.location.href = "/login";
      return;
    }
    setReservationLoading(true);
    try {
      const response = await tourismeAPI.createPlaceBooking(
        user.id,
        reservationData
      );
      if (response.data.success) {
        alert(
          `Réservation confirmée ! Numéro: ${response.data.data.confirmationNumber}`
        );
        setIsReservationOpen(false);
      }
    } catch (error: any) {
      alert(
        "Erreur lors de la réservation: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setReservationLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!lieuSelectionne) return 0;
    const ticket = ticketTypes.find(
      (t) => t.value === reservationData.ticketType
    );
    return (
      lieuSelectionne.price *
      (ticket?.priceMultiplier || 1) *
      reservationData.numberOfTickets
    );
  };

  const handleDateChange = (date: string) => {
    setReservationData({ ...reservationData, visitDate: date });
    if (reservationData.placeId)
      checkAvailability(reservationData.placeId, date);
  };

  const getDemoData = (): LieuTouristique[] => [
    {
      id: "1",
      idUnique: "PL1",
      title: "Château de Versailles",
      description: "Ancienne résidence des rois de France...",
      type: "touristic_place",
      category: "monument",
      city: "Versailles",
      price: 20,
      rating: 4.8,
      reviewCount: 12457,
      images: [],
      amenities: ["wifi", "parking"],
      available: true,
      featured: true,
      isTouristicPlace: true,
      openingHours: "9:00 - 18:30",
      entranceFee: "20€",
      website: "https://www.chateauversailles.fr",
      contactInfo: "+33 1 30 83 78 00",
      coordonnees: { lat: 48.8049, lng: 2.1204 },
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "2",
      idUnique: "PL2",
      title: "Musée du Louvre",
      description: "Le plus grand musée d'art du monde...",
      type: "touristic_place",
      category: "museum",
      city: "Paris",
      price: 17,
      rating: 4.9,
      reviewCount: 15632,
      images: [],
      amenities: ["wifi"],
      available: true,
      featured: true,
      isTouristicPlace: true,
      openingHours: "9:00 - 18:00",
      entranceFee: "17€",
      website: "https://www.louvre.fr",
      contactInfo: "+33 1 40 20 50 50",
      coordonnees: { lat: 48.8606, lng: 2.3376 },
      createdAt: "",
      updatedAt: "",
    },
  ];

  useEffect(() => {
    loadTouristicPlaces();
  }, []);

  const categories = [
    {
      value: "tous",
      label: "Tous les types",
      icon: <GalleryVerticalEnd className="w-4 h-4" />,
    },
    {
      value: "monument",
      label: "Monuments",
      icon: <Landmark className="w-4 h-4" />,
    },
    {
      value: "museum",
      label: "Musées",
      icon: <Building className="w-4 h-4" />,
    },
    {
      value: "park",
      label: "Parcs",
      icon: <GalleryVerticalEnd className="w-4 h-4" />,
    },
    {
      value: "religious",
      label: "Sites religieux",
      icon: <Church className="w-4 h-4" />,
    },
    {
      value: "historical",
      label: "Sites historiques",
      icon: <Castle className="w-4 h-4" />,
    },
    {
      value: "cultural",
      label: "Sites culturels",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  const tris = [
    { value: "rating", label: "Meilleures notes" },
    { value: "reviewCount", label: "Plus d'avis" },
    { value: "price", label: "Prix croissant" },
    { value: "title", label: "Ordre alphabétique" },
  ];

  const lieuxFiltres = lieux
    .filter((lieu) => filtreType === "tous" || lieu.category === filtreType)
    .sort((a, b) => {
      switch (tri) {
        case "rating":
          return b.rating - a.rating;
        case "reviewCount":
          return b.reviewCount - a.reviewCount;
        case "price":
          return a.price - b.price;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      monument: "Monument",
      museum: "Musée",
      park: "Parc",
      religious: "Site religieux",
      historical: "Site historique",
      cultural: "Site culturel",
    };
    return map[category] || category;
  };

  const renderStars = (note: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(note)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({note})</span>
    </div>
  );

  const renderAmenities = (amenities: string[]) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {amenities.slice(0, 4).map((id) => {
        const amenity = availableAmenities.find((a) => a.id === id);
        const Icon = amenity?.icon || CheckCircle;
        return (
          <div
            key={id}
            className="flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs"
          >
            <Icon className="w-3 h-3 mr-1" style={{ color: colors.logo }} />
            <span>{amenity?.label || id}</span>
          </div>
        );
      })}
      {amenities.length > 4 && (
        <div className="px-2 py-1 bg-gray-100 rounded-lg text-xs">
          +{amenities.length - 4}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.lightBg }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-4 mb-4"
            style={{ borderBottomColor: colors.logo }}
          ></div>
          <p className="text-gray-600">Chargement des lieux touristiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div
          className="relative py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white">
            <TourismNavigation />
            <h1 className="text-5xl font-bold mb-3">
              Lieux Touristiques & Culturels
            </h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Découvrez les trésors du patrimoine
            </p>
          </div>
        </div>
      </div>
      {/* Fin Hero */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filtres */}
        <div
          className="bg-white rounded-xl shadow-sm border mb-8 p-6"
          style={{ borderColor: colors.separator }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.secondaryText }}
              >
                Catégorie
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setFiltreType(cat.value)}
                    className={`flex flex-col items-center p-4 rounded-lg border transition-all ${
                      filtreType === cat.value
                        ? "border-2 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={
                      filtreType === cat.value
                        ? {
                            borderColor: colors.logo,
                            backgroundColor: colors.primaryDark + "10",
                          }
                        : {}
                    }
                  >
                    <div
                      style={{
                        color: filtreType === cat.value ? colors.logo : "#666",
                      }}
                    >
                      {cat.icon}
                    </div>
                    <span
                      className="text-sm mt-2 font-medium"
                      style={{
                        color: filtreType === cat.value ? colors.logo : "#444",
                      }}
                    >
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.secondaryText }}
              >
                Trier par
              </h3>
              <select
                value={tri}
                onChange={(e) => setTri(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 text-gray-700"
                style={{ borderColor: colors.separator }}
              >
                {tris.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p
                className="mt-3 text-sm"
                style={{ color: colors.secondaryText }}
              >
                {lieuxFiltres.length} lieu(x) trouvé(s)
              </p>
            </div>
          </div>
        </div>

        {/* Grille des lieux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {lieuxFiltres.map((lieu) => (
            <div
              key={lieu.id}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300"
              style={{ borderColor: colors.separator }}
            >
              <div className="h-56 relative overflow-hidden">
                <img
                  src={getSafeImageUrl(lieu.images[0], lieu.category)}
                  alt={lieu.title}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, lieu.category)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{lieu.title}</h3>
                  <div className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{lieu.city}</span>
                  </div>
                </div>
                <div
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium"
                  style={{ color: colors.logo }}
                >
                  {getCategoryLabel(lieu.category)}
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {lieu.description}
                </p>

                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {lieu.openingHours || "Horaires variables"}
                  </div>
                  <div className="text-right">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: colors.logo }}
                    >
                      {lieu.price === 0 ? "Gratuit" : `${lieu.price}€`}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  {renderStars(lieu.rating)}
                  <span className="text-sm text-gray-500">
                    {lieu.reviewCount.toLocaleString()} avis
                  </span>
                </div>

                {lieu.amenities.length > 0 && renderAmenities(lieu.amenities)}

                <button
                  onClick={() => handleOpenReservation(lieu)}
                  className="w-full mt-6 text-white font-bold py-4 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                  style={{ backgroundColor: colors.logo }}
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  {lieu.price === 0 ? "Réserver visite" : "Acheter billet"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Réservation */}
        {isReservationOpen && lieuSelectionne && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div
                className="p-6 border-b"
                style={{ borderColor: colors.separator }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: colors.secondaryText }}
                    >
                      Réservation de billet
                    </h2>
                    <p className="text-lg mt-1">{lieuSelectionne.title}</p>
                  </div>
                  <button
                    onClick={() => setIsReservationOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-xl p-5 flex items-center gap-4">
                  <img
                    src={getSafeImageUrl(
                      lieuSelectionne.images[0],
                      lieuSelectionne.category
                    )}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-lg">
                      {lieuSelectionne.title}
                    </h3>
                    <p className="text-gray-600">{lieuSelectionne.city}</p>
                    <p
                      className="text-2xl font-bold mt-2"
                      style={{ color: colors.logo }}
                    >
                      {lieuSelectionne.price === 0
                        ? "Gratuit"
                        : `${lieuSelectionne.price}€`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.secondaryText }}
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      value={reservationData.visitDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border rounded-lg px-4 py-3"
                      style={{ borderColor: colors.separator }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.secondaryText }}
                    >
                      Heure
                    </label>
                    <select
                      value={reservationData.visitTime}
                      onChange={(e) =>
                        setReservationData({
                          ...reservationData,
                          visitTime: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-4 py-3"
                      style={{ borderColor: colors.separator }}
                    >
                      <option value="">Choisir</option>
                      {availableTimes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.secondaryText }}
                    >
                      Type de billet
                    </label>
                    <select
                      value={reservationData.ticketType}
                      onChange={(e) =>
                        setReservationData({
                          ...reservationData,
                          ticketType: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-4 py-3"
                      style={{ borderColor: colors.separator }}
                    >
                      {ticketTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.secondaryText }}
                    >
                      Nombre
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setReservationData((d) => ({
                            ...d,
                            numberOfTickets: Math.max(1, d.numberOfTickets - 1),
                          }))
                        }
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-xl font-bold">
                        {reservationData.numberOfTickets}
                      </span>
                      <button
                        onClick={() =>
                          setReservationData((d) => ({
                            ...d,
                            numberOfTickets: d.numberOfTickets + 1,
                          }))
                        }
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4
                    className="font-bold mb-3"
                    style={{ color: colors.secondaryText }}
                  >
                    Récapitulatif
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Billets</span>
                      <span>{calculateTotalPrice().toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais</span>
                      <span>{(calculateTotalPrice() * 0.1).toFixed(2)}€</span>
                    </div>
                    <div
                      className="border-t pt-2 font-bold text-lg flex justify-between"
                      style={{ color: colors.logo }}
                    >
                      <span>Total</span>
                      <span>{(calculateTotalPrice() * 1.1).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-6 border-t flex gap-4"
                style={{ borderColor: colors.separator }}
              >
                <button
                  onClick={() => setIsReservationOpen(false)}
                  className="flex-1 py-4 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitReservation}
                  disabled={reservationLoading || !reservationData.visitTime}
                  className="flex-1 py-4 rounded-lg text-white font-bold flex items-center justify-center disabled:opacity-60"
                  style={{ backgroundColor: colors.logo }}
                >
                  {reservationLoading ? (
                    "Traitement..."
                  ) : (
                    <>Confirmer la réservation</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LieuxTouristiques;
