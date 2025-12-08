import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Bed,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Dumbbell,
  Tv,
  Map,
  Phone,
  Mail,
  Shield,
  Clock,
  CheckCircle,
  X,
  Plus,
  Minus,
  Lightbulb,
  Navigation,
  TrendingUp,
  Zap,
  CreditCard,
  User as UserIcon,
} from "lucide-react";
import api from "../lib/api"; // Import de l'API configurée
import { useAuth } from "../hooks/useAuth"; // Import de votre hook useAuth
import { useInteractionTracking } from "../hooks/useInteractionTracking"; // Import du hook de tracking
import "../styles/animationSlider.css";

// Types basés sur le modèle de données
interface TourismListing {
  id: string;
  idUnique: string;
  idPrestataire: string;
  title: string;
  type: "hotel" | "apartment" | "villa" | "guesthouse" | "touristic_place";
  price: number;
  city: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  maxGuests: number;
  available: boolean;
  provider?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  instantBook?: boolean;
  cancellationPolicy?: string;
  featured?: boolean;
  isTouristicPlace?: boolean;
}

interface SearchFilters {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  minPrice: number;
  maxPrice: number;
  type: string[];
  rating: number;
  amenities: string[];
  instantBook: boolean;
}

interface BookingForm {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  specialRequests: string;
  paymentMethod: string;
}

interface BookingResponse {
  success: boolean;
  data: {
    id: string;
    confirmationNumber: string;
    totalAmount: number;
    status: string;
  };
  message: string;
}

export const TourismSection = () => {
  // UTILISATION DE VOTRE HOOK useAuth EXISTANT
  const {
    user: currentUser,
    isAuthenticated,
    loading: userLoading,
  } = useAuth();

  // HOOK DE TRACKING DES INTERACTIONS
  const { trackTourismInteraction } = useInteractionTracking();

  const [listings, setListings] = useState<TourismListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<TourismListing[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    adults: 2,
    children: 0,
    infants: 0,
    minPrice: 0,
    maxPrice: 100000,
    type: [],
    rating: 0,
    amenities: [],
    instantBook: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<TourismListing | null>(
    null
  );
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    listingId: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: "",
    paymentMethod: "card",
  });
  const [bookingSuccess, setBookingSuccess] = useState<BookingResponse | null>(
    null
  );
  const [availabilityError, setAvailabilityError] = useState<string>("");
  const sliderRef = useRef<HTMLDivElement>(null);

  // Amenities disponibles avec icônes
  const availableAmenities = [
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "breakfast", label: "Petit-déjeuner", icon: Utensils },
    { id: "pool", label: "Piscine", icon: null },
    { id: "spa", label: "Spa", icon: null },
    { id: "gym", label: "Salle de sport", icon: Dumbbell },
    { id: "ac", label: "Climatisation", icon: Snowflake },
    { id: "tv", label: "Télévision", icon: Tv },
    { id: "kitchen", label: "Cuisine", icon: null },
  ];

  const [popularDestinations, setPopularDestinations] = useState<
    { city: string; price: number; image: string }[]
  >([]);

  // Fonction pour réinitialiser complètement les filtres
  const resetAllFilters = () => {
    const resetFilters = {
      destination: "",
      checkIn: "",
      checkOut: "",
      guests: 2,
      adults: 2,
      children: 0,
      infants: 0,
      minPrice: 0,
      maxPrice: 100000,
      type: [],
      rating: 0,
      amenities: [],
      instantBook: false,
    };

    setFilters(resetFilters);
    console.log("🔄 Filtres complètement réinitialisés");
  };

  // Debug useEffect pour surveiller la synchronisation
  useEffect(() => {
    console.log("🔍 État actuel - Listings:", listings.length);
    console.log("🔍 État actuel - FilteredListings:", filteredListings.length);

    if (listings.length !== filteredListings.length) {
      console.warn("⚠️ INCOHÉRENCE DÉTECTÉE: listings != filteredListings");
      console.warn("Forcer la synchronisation...");
      setFilteredListings(listings);
    }
  }, [listings, filteredListings]);

  // Fonction pour analyser pourquoi les listings sont filtrés
  const analyzeFiltering = (
    listings: TourismListing[],
    currentFilters: SearchFilters
  ) => {
    console.log("🔍 ANALYSE DES FILTRES:");

    let filteredCount = 0;

    listings.forEach((listing) => {
      const matchesDestination =
        !currentFilters.destination ||
        listing.city
          .toLowerCase()
          .includes(currentFilters.destination.toLowerCase()) ||
        listing.title
          .toLowerCase()
          .includes(currentFilters.destination.toLowerCase());

      const matchesType =
        currentFilters.type.length === 0 ||
        currentFilters.type.includes(listing.type);

      const matchesRating = listing.rating >= currentFilters.rating;

      const matchesAmenities =
        currentFilters.amenities.length === 0 ||
        currentFilters.amenities.every((amenity) =>
          listing.amenities.includes(amenity)
        );

      const matchesInstantBook =
        !currentFilters.instantBook || (listing.instantBook ?? false);

      const matchesPrice =
        listing.price >= currentFilters.minPrice &&
        listing.price <= currentFilters.maxPrice;

      const isFiltered =
        !matchesDestination ||
        !matchesType ||
        !matchesRating ||
        !matchesAmenities ||
        !matchesInstantBook ||
        !matchesPrice;

      if (isFiltered) {
        filteredCount++;
        console.log(`❌ ${listing.title} est filtré car:`, {
          destination: !matchesDestination,
          type: !matchesType,
          rating:
            !matchesRating &&
            `rating=${listing.rating} < filtre=${currentFilters.rating}`,
          amenities: !matchesAmenities,
          instantBook: !matchesInstantBook,
          price:
            !matchesPrice &&
            `prix=${listing.price} hors [${currentFilters.minPrice}-${currentFilters.maxPrice}]`,
          prixListing: listing.price,
          prixMaxFiltre: currentFilters.maxPrice,
        });
      }
    });

    console.log(`📊 Total filtré: ${filteredCount}/${listings.length}`);
  };

  // TRACKING: Chargement des hébergements
  useEffect(() => {
    if (listings.length > 0) {
      listings.forEach((listing) => {
        trackTourismInteraction(listing.id, listing.title, "view", {
          type: listing.type,
          price: listing.price,
          city: listing.city,
        });
      });
    }
  }, [listings, trackTourismInteraction]);

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const response = await api.get("/tourisme");

        if (response.data.success && Array.isArray(response.data.data)) {
          const accommodationsOnly = response.data.data.filter(
            (item: any) =>
              !item.isTouristicPlace && item.type !== "touristic_place"
          );

          const grouped = accommodationsOnly.reduce(
            (acc: any, listing: any) => {
              const city = listing.city || "Inconnue";
              if (!acc[city]) {
                acc[city] = {
                  city,
                  price: listing.price,
                  image: Array.isArray(listing.images)
                    ? listing.images[0]
                    : listing.images
                    ? listing.images
                    : "https://via.placeholder.com/400x300?text=Aucune+image",
                };
              } else if (listing.price < acc[city].price) {
                acc[city].price = listing.price;
              }
              return acc;
            },
            {}
          );

          const destinationsArray = Object.values(grouped);
          const duplicated = [...destinationsArray, ...destinationsArray];
          setPopularDestinations(duplicated as any);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des destinations :", error);
      }
    };

    fetchPopularDestinations();
  }, []);

  const handleDestinationClick = (city: string) => {
    setFilters((prev) => ({
      ...prev,
      destination: city,
    }));

    const resultsSection = document.getElementById("listings-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchTourismeData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/tourisme/accommodations");

        if (response.data.success && Array.isArray(response.data.data)) {
          const listingsData = response.data.data;

          const accommodationsOnly = listingsData.filter(
            (listing: TourismListing) =>
              !listing.isTouristicPlace && listing.type !== "touristic_place"
          );

          setListings(accommodationsOnly);
          resetAllFilters();
          setFilteredListings(accommodationsOnly);

          console.log("✅ Hébergements chargés:", accommodationsOnly.length);
          console.log(
            "✅ Filtres réinitialisés - devrait montrer tous les hébergements"
          );

          const initialIndexes: { [key: string]: number } = {};
          accommodationsOnly.forEach((listing: TourismListing) => {
            initialIndexes[listing.id] = 0;
          });
          setCurrentImageIndex(initialIndexes);
        } else {
          console.error("Réponse inattendue :", response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des hébergements :", error);
        try {
          const fallbackResponse = await api.get("/tourisme");
          if (
            fallbackResponse.data.success &&
            Array.isArray(fallbackResponse.data.data)
          ) {
            const allData = fallbackResponse.data.data;
            const accommodationsOnly = allData.filter(
              (item: any) =>
                !item.isTouristicPlace && item.type !== "touristic_place"
            );
            setListings(accommodationsOnly);
            resetAllFilters();
            setFilteredListings(accommodationsOnly);
            console.log(
              "✅ Hébergements chargés (fallback):",
              accommodationsOnly.length
            );
          }
        } catch (fallbackError) {
          console.error("Erreur fallback:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTourismeData();
  }, []);

  // Filtrer les résultats
  useEffect(() => {
    let results = listings;

    console.log("🎯 DÉBUT FILTRAGE - Filtres actuels:", filters);
    console.log("🎯 Listings avant filtrage:", listings.length);

    if (filters.destination) {
      results = results.filter(
        (listing) =>
          listing.city
            .toLowerCase()
            .includes(filters.destination.toLowerCase()) ||
          listing.title
            .toLowerCase()
            .includes(filters.destination.toLowerCase())
      );
      console.log("🎯 Après filtre destination:", results.length);
    }

    if (filters.type.length > 0) {
      results = results.filter((listing) =>
        filters.type.includes(listing.type)
      );
      console.log("🎯 Après filtre type:", results.length);
    }

    if (filters.rating > 0) {
      results = results.filter((listing) => listing.rating >= filters.rating);
      console.log("🎯 Après filtre rating:", results.length);
    }

    if (filters.amenities.length > 0) {
      results = results.filter((listing) =>
        filters.amenities.every((amenity) =>
          listing.amenities.includes(amenity)
        )
      );
      console.log("🎯 Après filtre amenities:", results.length);
    }

    if (filters.instantBook) {
      results = results.filter((listing) => listing.instantBook ?? false);
      console.log("🎯 Après filtre instantBook:", results.length);
    }

    results = results.filter(
      (listing) =>
        listing.price >= filters.minPrice && listing.price <= filters.maxPrice
    );
    console.log("🎯 Après filtre prix:", results.length);

    analyzeFiltering(listings, filters);

    console.log("🔍 Filtrage appliqué:", {
      total: listings.length,
      filtrés: results.length,
      filtres: filters,
    });

    setFilteredListings(results);
  }, [filters, listings]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.get("/admin/tourisme/accommodations", {
        params: {
          destination: filters.destination,
          search: filters.destination,
          city: filters.destination,
        },
      });

      if (response.data.success) {
        const accommodationsOnly = response.data.data.filter(
          (listing: TourismListing) =>
            !listing.isTouristicPlace && listing.type !== "touristic_place"
        );
        setListings(accommodationsOnly);

        trackTourismInteraction("search", "Recherche hébergements", "search", {
          destination: filters.destination,
          guests: filters.guests,
          checkIn: filters.checkIn,
          checkOut: filters.checkOut,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      try {
        const fallbackResponse = await api.get("/tourisme", {
          params: {
            destination: filters.destination,
            search: filters.destination,
          },
        });
        if (fallbackResponse.data.success) {
          const allData = fallbackResponse.data.data;
          const accommodationsOnly = allData.filter(
            (item: any) =>
              !item.isTouristicPlace && item.type !== "touristic_place"
          );
          setListings(accommodationsOnly);
        }
      } catch (fallbackError) {
        console.error("Erreur fallback recherche:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (listing: TourismListing) => {
    await trackTourismInteraction(
      listing.id,
      listing.title,
      "booking_attempt",
      {
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        guests: filters.guests,
      }
    );

    if (!isAuthenticated) {
      alert("Veuillez vous connecter pour effectuer une réservation");
      return;
    }

    setSelectedListing(listing);
    setBookingForm((prev) => ({
      ...prev,
      listingId: listing.id,
      guests: filters.guests,
      adults: filters.adults,
      children: filters.children,
      infants: filters.infants,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
    }));

    if (filters.checkIn && filters.checkOut) {
      try {
        const availabilityResponse = await api.get(
          `/tourisme-bookings/listing/${listing.id}/availability`,
          {
            params: {
              checkIn: filters.checkIn,
              checkOut: filters.checkOut,
            },
          }
        );

        if (
          availabilityResponse.data.success &&
          !availabilityResponse.data.data.available
        ) {
          setAvailabilityError(
            "Cet hébergement n'est pas disponible pour les dates sélectionnées"
          );
          return;
        }
      } catch (error) {
        console.error("Erreur vérification disponibilité:", error);
      }
    }

    setAvailabilityError("");
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    setBookingLoading(true);
    try {
      if (!isAuthenticated || !currentUser) {
        alert("Veuillez vous connecter pour effectuer une réservation");
        setBookingLoading(false);
        return;
      }

      const bookingData = {
        listingId: bookingForm.listingId,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: bookingForm.guests,
        adults: bookingForm.adults,
        children: bookingForm.children,
        infants: bookingForm.infants,
        specialRequests: bookingForm.specialRequests,
        paymentMethod: bookingForm.paymentMethod,
      };

      const response = await api.post(
        `/tourisme-bookings/${currentUser.id}`,
        bookingData
      );

      if (response.data.success) {
        setBookingSuccess(response.data);

        if (selectedListing) {
          await trackTourismInteraction(
            selectedListing.id,
            selectedListing.title,
            "booking_confirmed",
            {
              bookingId: response.data.data.id,
              totalAmount: response.data.data.totalAmount,
            }
          );
        }

        setBookingForm({
          listingId: "",
          checkIn: "",
          checkOut: "",
          guests: 2,
          adults: 2,
          children: 0,
          infants: 0,
          specialRequests: "",
          paymentMethod: "card",
        });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      console.error("Erreur lors de la réservation :", error);
      alert(error.response?.data?.error || "Erreur lors de la réservation");
    } finally {
      setBookingLoading(false);
    }
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingSuccess(null);
    setAvailabilityError("");
  };

  const calculateTotalNights = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const checkIn = new Date(bookingForm.checkIn);
    const checkOut = new Date(bookingForm.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotalAmount = () => {
    if (!selectedListing) return 0;
    const nights = calculateTotalNights();
    const baseAmount = selectedListing.price * nights;
    const serviceFee = 15.0;
    return baseAmount + serviceFee;
  };

  const nextImage = (listingId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [listingId]: (prev[listingId] + 1) % totalImages,
    }));
  };

  const prevImage = (listingId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [listingId]: (prev[listingId] - 1 + totalImages) % totalImages,
    }));
  };

  const toggleFavorite = (listingId: string) => {
    const listing = listings.find((l) => l.id === listingId);
    if (listing) {
      const action = favorites.has(listingId)
        ? "remove_favorite"
        : "add_favorite";
      trackTourismInteraction(listingId, listing.title, action);
    }

    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  };

  const scrollSlider = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.style.animationPlayState = "paused";

    const scrollAmount = 300;
    const currentScroll = slider.scrollLeft;

    if (direction === "left") {
      slider.scrollLeft = currentScroll - scrollAmount;
    } else {
      slider.scrollLeft = currentScroll + scrollAmount;
    }

    setTimeout(() => {
      if (slider) {
        slider.style.animationPlayState = "running";
      }
    }, 3000);
  };

  const updateGuestCount = (
    type: "adults" | "children" | "infants",
    delta: number
  ) => {
    setFilters((prev) => {
      const newValues = { ...prev };
      const current = newValues[type];
      const newValue = Math.max(0, current + delta);
      const totalGuests =
        newValue +
        (type === "adults"
          ? prev.children + prev.infants
          : type === "children"
          ? prev.adults + prev.infants
          : prev.adults + prev.children);

      if (totalGuests <= 16) {
        newValues[type] = newValue;
        newValues.guests =
          newValues.adults + newValues.children + newValues.infants;
      }

      return newValues;
    });

    setBookingForm((prev) => ({
      ...prev,
      [type]: Math.max(0, (prev[type as keyof BookingForm] as number) + delta),
      guests: prev.adults + prev.children + prev.infants,
    }));
  };

  const getAmenityIcon = (amenityId: string) => {
    const amenity = availableAmenities.find((a) => a.id === amenityId);
    return amenity?.icon || CheckCircle;
  };

  return (
    <section className="min-h-screen">
      <div className="container mx-auto px-4 pt-24">
        {/* En-tête avec animation */}
        <div className="-z-10 absolute inset-0 w-full h-96 overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-t backdrop-blur-sm from-black/80 via-black/40 to-transparent z-10"></div>
          <img
            src="https://i.pinimg.com/1200x/19/f3/34/19f334c7d66cf3393f146a9bcfe911f4.jpg"
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        <div className="text-center mb-16">
          <h2
            className="md:text-5xl text-3xl font-bold mb-6 text-slate-100 tracking-wider"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Hébergements Touristiques
          </h2>
          <p
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Découvrez nos hébergements partenaires et réservez votre séjour en
            toute simplicité
          </p>
        </div>

        {/* Formulaire de recherche avec animations */}
        <div
          className="bg-[#FFFFFF] rounded-3xl shadow-lg p-8 mb-12 border border-[#D3D3D3] transition-all duration-300 hover:shadow-xl"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            <div
              className="space-y-3"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-[#556B2F]" />
                Destination
              </label>
              <input
                type="text"
                placeholder="Où allez-vous ?"
                className="w-full p-3 border border-[#D3D3D3] rounded-lg focus:ring-1 focus:ring-[#6B8E23] focus:border-[#6B8E23] transition-all duration-200"
                value={filters.destination}
                onChange={(e) =>
                  setFilters({ ...filters, destination: e.target.value })
                }
              />
            </div>

            <div
              className="space-y-3"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-[#556B2F]" />
                Dates
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="w-full p-3 border border-[#D3D3D3] rounded-lg focus:ring-1 focus:ring-[#6B8E23] focus:border-[#6B8E23] transition-all duration-200"
                  value={filters.checkIn}
                  onChange={(e) =>
                    setFilters({ ...filters, checkIn: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
                <input
                  type="date"
                  className="w-full p-3 border border-[#D3D3D3] rounded-lg focus:ring-1 focus:ring-[#6B8E23] focus:border-[#6B8E23] transition-all duration-200"
                  value={filters.checkOut}
                  onChange={(e) =>
                    setFilters({ ...filters, checkOut: e.target.value })
                  }
                  min={
                    filters.checkIn || new Date().toISOString().split("T")[0]
                  }
                />
              </div>
            </div>

            <div
              className="space-y-3"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 mr-2 text-[#556B2F]" />
                Voyageurs
              </label>
              <div
                className="w-full p-3 border border-[#D3D3D3] rounded-lg focus:ring-1 focus:ring-[#6B8E23] focus:border-[#6B8E23] transition-all duration-200 cursor-pointer hover:border-[#6B8E23]"
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">
                    {filters.guests}{" "}
                    {filters.guests === 1 ? "voyageur" : "voyageurs"}
                  </span>
                  <ChevronLeft
                    className={`w-4 h-4 transition-transform ${
                      showFilters ? "-rotate-90" : "rotate-90"
                    } text-[#556B2F]`}
                  />
                </div>
              </div>
            </div>

            <div
              className="flex items-end"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <button
                type="submit"
                className="w-full bg-[#556B2F] text-white p-3 rounded-lg font-medium flex items-center justify-center transition-all duration-200 hover:bg-[#6B8E23]"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Recherche..." : "Rechercher"}
              </button>
            </div>
          </form>

          {/* Filtres avancés dépliants */}
          {showFilters && (
            <div
              className="mt-6 p-6 bg-gray-50 rounded-xl border border-[#D3D3D3]"
              data-aos="fade-up"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Types d'hébergement */}
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-3">
                    Type d'hébergement
                  </label>
                  <div className="space-y-2">
                    {["hotel", "apartment", "villa", "guesthouse"].map(
                      (type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-[#D3D3D3] text-[#6B8E23] focus:ring-[#6B8E23]"
                            checked={filters.type.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  type: [...prev.type, type],
                                }));
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  type: prev.type.filter((t) => t !== type),
                                }));
                              }
                            }}
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {type}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Nombre de voyageurs détaillé */}
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-3">
                    Détail voyageurs
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Adultes",
                        key: "adults" as const,
                        description: "13 ans et plus",
                      },
                      {
                        label: "Enfants",
                        key: "children" as const,
                        description: "2-12 ans",
                      },
                      {
                        label: "Bébés",
                        key: "infants" as const,
                        description: "Moins de 2 ans",
                      },
                    ].map(({ label, key, description }) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="text-sm font-medium text-[#8B4513]">
                            {label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {description}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateGuestCount(key, -1)}
                            className="w-7 h-7 rounded border border-[#D3D3D3] flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-[#556B2F]" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-[#8B4513]">
                            {filters[key]}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateGuestCount(key, 1)}
                            className="w-7 h-7 rounded border border-[#D3D3D3] flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-[#556B2F]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Équipements */}
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-3">
                    Équipements
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableAmenities.map((amenity) => (
                      <label key={amenity.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-[#D3D3D3] text-[#6B8E23] focus:ring-[#6B8E23]"
                          checked={filters.amenities.includes(amenity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters((prev) => ({
                                ...prev,
                                amenities: [...prev.amenities, amenity.id],
                              }));
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                amenities: prev.amenities.filter(
                                  (a) => a !== amenity.id
                                ),
                              }));
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {amenity.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Autres filtres */}
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-3">
                    Options
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-[#D3D3D3] text-[#6B8E23] focus:ring-[#6B8E23]"
                        checked={filters.instantBook}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            instantBook: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Réservation instantanée
                      </span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-[#8B4513] mb-2">
                        Note minimum:{" "}
                        {filters.rating > 0 ? `${filters.rating}+` : "Toutes"}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={filters.rating}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            rating: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6B8E23]"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Toutes</span>
                        <span>5★</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#D3D3D3]">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[#6B8E23] hover:text-[#556B2F] font-medium transition-colors text-sm"
                >
                  Réinitialiser les filtres
                </button>

                <div className="text-sm text-[#8B4513]">
                  {filteredListings.length} hébergements trouvés
                </div>
              </div>
            </div>
          )}

          {/* Filtres rapides */}
          {!showFilters && (
            <div className="mt-6 flex items-center justify-between border-t border-[#D3D3D3] pt-6">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center text-[#556B2F] hover:text-[#6B8E23] transition-colors duration-200 text-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Plus de filtres
              </button>

              <div className="text-sm text-[#8B4513]">
                {filteredListings.length} hébergements trouvés
              </div>
            </div>
          )}
        </div>

        {/* Slider des destinations populaires */}
        <div className="relative mb-12" data-aos="fade-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#8B4513]">
              Destinations populaires
            </h3>
          </div>

          {/* Conteneur avec animation infinie */}
          <div className="relative overflow-hidden">
            <div
              ref={sliderRef}
              className="flex space-x-6 scrollbar-hide py-4"
              style={{
                animation: "infinite-scroll 40s linear infinite",
                width: "max-content",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
            >
              {popularDestinations.length > 0 ? (
                popularDestinations.map((destination, index) => (
                  <div
                    key={`${destination.city}-${index}`}
                    onClick={() => handleDestinationClick(destination.city)}
                    className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer group"
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    <div
                      className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl relative overflow-hidden"
                      style={{
                        backgroundImage: `url(${destination.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="font-bold text-lg capitalize">
                          {destination.city}
                        </h4>
                        <p className="text-xs rounded-full px-2 opacity-90 bg-white/20 backdrop-blur-sm p-1">
                          À partir de {destination.price}€
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <img src="/loading.gif" alt="" className="w-24 h-24" />
                  <p className="text-[#8B4513] italic px-4">
                    Chargement des destinations...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section des résultats avec ID pour le scroll */}
        <div id="listings-section">
          {/* Résultats avec animations améliorées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse"
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                  >
                    <div className="h-60 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-200 animate-shimmer"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              : filteredListings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group"
                    data-aos="fade-up"
                    data-aos-delay={index * 150}
                  >
                    {/* Carousel d'images */}
                    <div className="h-60 bg-gray-200 relative overflow-hidden">
                      <div
                        className="flex h-full transition-transform duration-500 ease-out"
                        style={{
                          transform: `translateX(-${
                            currentImageIndex[listing.id] * 100
                          }%)`,
                        }}
                      >
                        {listing.images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="w-full h-full flex-shrink-0"
                          >
                            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                              <img
                                src={image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Badge provider */}
                      {listing.provider && (
                        <div className="absolute top-4 left-4 bg-[#556B2F] bg-opacity-90 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                          {listing.provider.toUpperCase()}
                        </div>
                      )}

                      {/* Badge réservation instantanée */}
                      {listing.instantBook && (
                        <div className="absolute top-4 right-20 bg-[#6B8E23] text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Instant
                        </div>
                      )}

                      {/* Boutons favori et partage */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                            favorites.has(listing.id)
                              ? "bg-red-500 text-white"
                              : "bg-white bg-opacity-90 text-[#556B2F] hover:bg-red-500 hover:text-white"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.has(listing.id) ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Contrôles du carousel */}
                      {listing.images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              prevImage(listing.id, listing.images.length)
                            }
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <ChevronLeft className="w-4 h-4 text-[#556B2F]" />
                          </button>
                          <button
                            onClick={() =>
                              nextImage(listing.id, listing.images.length)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRight className="w-4 h-4 text-[#556B2F]" />
                          </button>

                          {/* Indicateurs de slide */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {listing.images.map((_, dotIndex) => (
                              <button
                                key={dotIndex}
                                onClick={() =>
                                  setCurrentImageIndex((prev) => ({
                                    ...prev,
                                    [listing.id]: dotIndex,
                                  }))
                                }
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  currentImageIndex[listing.id] === dotIndex
                                    ? "bg-[#6B8E23] scale-125"
                                    : "bg-white bg-opacity-50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-[#8B4513] text-lg line-clamp-2 group-hover:text-[#6B8E23] transition-colors duration-300">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-sm text-[#8B4513] bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {listing.rating} ({listing.reviewCount})
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-[#556B2F]" />
                        {listing.city}
                        {listing.area && ` • ${listing.area}m²`}
                        {listing.bedrooms &&
                          ` • ${listing.bedrooms} chambre${
                            listing.bedrooms > 1 ? "s" : ""
                          }`}
                        {listing.bathrooms &&
                          ` • ${listing.bathrooms} salle${
                            listing.bathrooms > 1 ? "s" : ""
                          } de bain`}
                      </p>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {listing.amenities.slice(0, 3).map((amenity) => {
                          const IconComponent = getAmenityIcon(amenity);
                          return (
                            <span
                              key={amenity}
                              className="bg-[#6B8E23] bg-opacity-10 text-[#556B2F] px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:bg-opacity-20 hover:scale-105 flex items-center"
                            >
                              <IconComponent className="w-3 h-3 mr-1" />
                              {availableAmenities.find((a) => a.id === amenity)
                                ?.label || amenity}
                            </span>
                          );
                        })}
                        {listing.amenities.length > 3 && (
                          <span className="text-gray-500 text-xs font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                            +{listing.amenities.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-[#D3D3D3]">
                        <div>
                          <span className="text-2xl font-bold text-[#8B4513]">
                            {listing.price}€
                          </span>
                          <span className="text-gray-600 text-sm"> / nuit</span>
                          {listing.cancellationPolicy && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              Politique {listing.cancellationPolicy}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleBooking(listing)}
                          disabled={!listing.available || !isAuthenticated}
                          className="bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#6B8E23] hover:to-[#556B2F] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {!isAuthenticated
                            ? "Connectez-vous"
                            : !listing.available
                            ? "Indisponible"
                            : listing.instantBook
                            ? "Réserver"
                            : "Vérifier disponibilité"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Modal de réservation */}
        {showBookingModal && selectedListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              data-aos="zoom-in"
            >
              <div className="p-6 border-b border-[#D3D3D3]">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#8B4513]">
                    {bookingSuccess
                      ? "Réservation Confirmée"
                      : "Finaliser votre réservation"}
                  </h3>
                  <button
                    onClick={closeBookingModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-[#556B2F]" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {bookingSuccess ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#6B8E23] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-[#6B8E23]" />
                    </div>
                    <h4 className="text-2xl font-bold text-[#8B4513] mb-2">
                      Réservation Confirmée !
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Votre réservation a été confirmée avec succès.
                    </p>
                    <div className="bg-[#6B8E23] bg-opacity-10 p-4 rounded-xl mb-6">
                      <div className="text-sm font-semibold text-[#556B2F] mb-2">
                        Numéro de confirmation:
                      </div>
                      <div className="text-2xl font-bold text-[#556B2F]">
                        {bookingSuccess.data.confirmationNumber}
                      </div>
                      <div className="text-sm text-[#6B8E23] mt-2">
                        Montant total: {bookingSuccess.data.totalAmount}€
                      </div>
                    </div>
                    <button
                      onClick={closeBookingModal}
                      className="w-full bg-gradient-to-r from-[#556B2F] to-[#6B8E23] text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  <>
                    {availabilityError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center text-red-800">
                          <X className="w-5 h-5 mr-2" />
                          {availabilityError}
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#8B4513] mb-2">
                        Informations du client
                      </label>
                      <div className="bg-[#6B8E23] bg-opacity-10 p-4 rounded-xl">
                        {isAuthenticated && currentUser ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-[#556B2F] mb-1">
                                Nom complet
                              </label>
                              <div className="p-2 bg-white rounded border border-[#D3D3D3] flex items-center">
                                <UserIcon className="w-4 h-4 mr-2 text-[#556B2F]" />
                                {currentUser.firstName} {currentUser.lastName}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#556B2F] mb-1">
                                Email
                              </label>
                              <div className="p-2 bg-white rounded border border-[#D3D3D3] flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-[#556B2F]" />
                                {currentUser.email}
                              </div>
                            </div>
                            {currentUser.phone && (
                              <div>
                                <label className="block text-sm font-medium text-[#556B2F] mb-1">
                                  Téléphone
                                </label>
                                <div className="p-2 bg-white rounded border border-[#D3D3D3] flex items-center">
                                  <Phone className="w-4 h-4 mr-2 text-[#556B2F]" />
                                  {currentUser.phone}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-[#8B4513]">
                            <p>
                              Veuillez vous connecter pour effectuer une
                              réservation
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#6B8E23] to-[#556B2F] rounded-xl flex-shrink-0">
                        {selectedListing.images[0] ? (
                          <img
                            src={selectedListing.images[0]}
                            alt=""
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs">
                            Image non disponible
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-[#8B4513]">
                          {selectedListing.title}
                        </h4>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-[#556B2F]" />
                          {selectedListing.city}
                        </p>
                        <div className="flex items-center text-sm text-[#8B4513] mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {selectedListing.rating} (
                          {selectedListing.reviewCount} avis)
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#8B4513] mb-2">
                          Arrivée
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border-2 border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23]"
                          value={bookingForm.checkIn}
                          onChange={(e) =>
                            setBookingForm((prev) => ({
                              ...prev,
                              checkIn: e.target.value,
                            }))
                          }
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#8B4513] mb-2">
                          Départ
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border-2 border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23]"
                          value={bookingForm.checkOut}
                          onChange={(e) =>
                            setBookingForm((prev) => ({
                              ...prev,
                              checkOut: e.target.value,
                            }))
                          }
                          min={
                            bookingForm.checkIn ||
                            new Date().toISOString().split("T")[0]
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#8B4513] mb-2">
                        Voyageurs
                      </label>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <div className="font-medium text-[#556B2F]">
                              Adultes
                            </div>
                            <div className="text-sm text-gray-500">
                              13 ans et plus
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => updateGuestCount("adults", -1)}
                              className="w-8 h-8 rounded-full border border-[#D3D3D3] flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4 text-[#556B2F]" />
                            </button>
                            <span className="w-8 text-center font-medium text-[#8B4513]">
                              {bookingForm.adults}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateGuestCount("adults", 1)}
                              className="w-8 h-8 rounded-full border border-[#D3D3D3] flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4 text-[#556B2F]" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <div className="font-medium text-[#556B2F]">
                              Enfants
                            </div>
                            <div className="text-sm text-gray-500">
                              2-12 ans
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => updateGuestCount("children", -1)}
                              className="w-8 h-8 rounded-full border border-[#D3D3D3] flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4 text-[#556B2F]" />
                            </button>
                            <span className="w-8 text-center font-medium text-[#8B4513]">
                              {bookingForm.children}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateGuestCount("children", 1)}
                              className="w-8 h-8 rounded-full border border-[#D3D3D3] flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4 text-[#556B2F]" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-[#556B2F]">
                              Bébés
                            </div>
                            <div className="text-sm text-gray-500">
                              Moins de 2 ans
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => updateGuestCount("infants", -1)}
                              className="w-8 h-8 rounded-full border border-[#D3D3D3] flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4 text-[#556B2F]" />
                            </button>
                            <span className="w-8 text-center font-medium text-[#8B4513]">
                              {bookingForm.infants}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateGuestCount("infants", 1)}
                              className="w-8 h-8 rounded-full border border-[#D3D3D3] flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4 text-[#556B2F]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#8B4513] mb-2">
                        Demandes spéciales
                      </label>
                      <textarea
                        rows={3}
                        className="w-full p-3 border-2 border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23]"
                        placeholder="Informations supplémentaires..."
                        value={bookingForm.specialRequests}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            specialRequests: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#8B4513] mb-2">
                        Méthode de paiement
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center p-4 border-2 border-[#D3D3D3] rounded-xl cursor-pointer hover:border-[#6B8E23] transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={bookingForm.paymentMethod === "card"}
                            onChange={(e) =>
                              setBookingForm((prev) => ({
                                ...prev,
                                paymentMethod: e.target.value,
                              }))
                            }
                            className="text-[#6B8E23] focus:ring-[#6B8E23]"
                          />
                          <CreditCard className="w-5 h-5 ml-2 mr-3 text-[#556B2F]" />
                          <span className="text-[#8B4513]">Carte bancaire</span>
                        </label>
                        <label className="flex items-center p-4 border-2 border-[#D3D3D3] rounded-xl cursor-pointer hover:border-[#6B8E23] transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={bookingForm.paymentMethod === "paypal"}
                            onChange={(e) =>
                              setBookingForm((prev) => ({
                                ...prev,
                                paymentMethod: e.target.value,
                              }))
                            }
                            className="text-[#6B8E23] focus:ring-[#6B8E23]"
                          />
                          <span className="text-[#8B4513]">PayPal</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-[#6B8E23] bg-opacity-10 p-4 rounded-xl mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#556B2F]">Prix par nuit</span>
                        <span className="font-semibold text-[#8B4513]">
                          {selectedListing.price}€
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#556B2F]">Nombre de nuits</span>
                        <span className="font-semibold text-[#8B4513]">
                          {calculateTotalNights()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#556B2F]">Frais de service</span>
                        <span className="font-semibold text-[#8B4513]">
                          15€
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-[#556B2F] border-opacity-20">
                        <span className="text-[#8B4513]">Total</span>
                        <span className="text-[#556B2F]">
                          {calculateTotalAmount()}€
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={closeBookingModal}
                        className="flex-1 py-4 px-6 border-2 border-[#D3D3D3] text-[#8B4513] rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={confirmBooking}
                        disabled={
                          bookingLoading ||
                          !bookingForm.checkIn ||
                          !bookingForm.checkOut ||
                          !isAuthenticated
                        }
                        className="flex-1 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] hover:from-[#6B8E23] hover:to-[#556B2F] text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bookingLoading
                          ? "Traitement..."
                          : "Confirmer la réservation"}
                      </button>
                    </div>

                    <div className="flex items-center justify-center mt-4 text-sm text-[#8B4513]">
                      <Shield className="w-4 h-4 mr-2 text-[#556B2F]" />
                      Paiement sécurisé • Annulation gratuite sous conditions
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Intégration IA - Suggestions personnalisées avec animations */}
        <div
          className="mt-16 bg-gradient-to-r from-[#6B8E23]/10 to-[#556B2F]/10 rounded-3xl shadow-2xl p-8 border border-[#6B8E23]/20"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-[#8B4513] mb-3 flex items-center justify-center">
              <Lightbulb className="w-8 h-8 mr-3 text-[#6B8E23]" />
              Suggestions intelligentes
            </h3>
            <p className="text-[#8B4513] text-lg max-w-2xl mx-auto">
              Notre IA analyse vos préférences pour des recommandations sur
              mesure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Proximité géographique",
                desc: "Prestataires dans votre zone",
                color: "primary",
                icon: Navigation,
              },
              {
                title: "Rapport qualité-prix",
                desc: "Meilleures offres selon votre budget",
                color: "primary-dark",
                icon: TrendingUp,
              },
              {
                title: "Disponibilité temps réel",
                desc: "Calendriers synchronisés instantanément",
                color: "logo",
                icon: Zap,
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 border-l-4 ${
                  feature.color === "primary"
                    ? "border-[#6B8E23]"
                    : feature.color === "primary-dark"
                    ? "border-[#556B2F]"
                    : "border-[#556B2F]"
                }`}
                data-aos="zoom-in"
                data-aos-delay={index * 200}
              >
                <feature.icon
                  className={`w-8 h-8 mb-4 ${
                    feature.color === "primary"
                      ? "text-[#6B8E23]"
                      : feature.color === "primary-dark"
                      ? "text-[#556B2F]"
                      : "text-[#556B2F]"
                  }`}
                />
                <div
                  className={`font-bold ${
                    feature.color === "primary"
                      ? "text-[#6B8E23]"
                      : feature.color === "primary-dark"
                      ? "text-[#556B2F]"
                      : "text-[#556B2F]"
                  } text-lg mb-2`}
                >
                  {feature.title}
                </div>
                <div
                  className={`${
                    feature.color === "primary"
                      ? "text-[#6B8E23]"
                      : feature.color === "primary-dark"
                      ? "text-[#556B2F]"
                      : "text-[#556B2F]"
                  }`}
                >
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS pour animations supplémentaires */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
          background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
          background-size: 200px 100%;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </section>
  );
};

export default TourismSection;
