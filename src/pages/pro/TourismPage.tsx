import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Users,
  Star,
  Heart,
  Bed,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Dumbbell,
  Tv,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye,
  PlusCircle,
  Building,
  Bath,
  Square,
  TrendingUp,
  Home,
  Upload,
  Trash,
  Landmark,
  Camera,
  Clock,
  Globe,
  Plane,
  Hotel,
  Mountain,
  ChevronDown,
  Calendar,
  Clock3,
  RefreshCw,
  TreePine,
  Waves,
} from "lucide-react";
import { toast } from "sonner";
import { tourismeAPI } from "../../lib/api";
import { useAuth } from "@/hooks/useAuth";
import AjoutVolModal from "../../components/components/AjoutVol";
import AjoutActivitesModal from "@/components/components/AjoutActivites";
import AjoutNaturePatrimoineModal from "./AjoutNaturePatrimoine"; // Nouveau
import { api } from "@/lib/axios";
import AdminModal from "./AdminModal";
import DetailModal from "./DetailModal";
import AirlineModal from "./AirlineModal";
import NatureDetailModal from "./NatureDetailModal"; // Nouveau

// Composants importés
import ListingCard from "./ListingCard";
import FlightCard from "./FlightCard";
import ActivityCard from "./ActivityCard";
import ActivityDetailModal from "./ActivityDetailModal";
import AdminInterface from "./AdminInterface";
import NaturePatrimoineCard from "./NaturePatrimoineCard"; // Nouveau

// Constantes de couleur basées sur votre palette
const COLORS = {
  logo: "#556B2F",
  primary: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  smallText: "#000000",
};

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

// Catégories de lieux touristiques
const touristicCategories = [
  { id: "monument", label: "Monument", icon: Landmark },
  { id: "museum", label: "Musée", icon: Building },
  { id: "park", label: "Parc/Jardin", icon: null },
  { id: "beach", label: "Plage", icon: null },
  { id: "mountain", label: "Montagne", icon: Mountain },
  { id: "religious", label: "Site religieux", icon: null },
  { id: "historical", label: "Site historique", icon: Landmark },
  { id: "cultural", label: "Site culturel", icon: Camera },
  { id: "natural", label: "Site naturel", icon: null },
];

// Options pour le dropdown de type de contenu
const contentTypeOptions = [
  {
    id: "accommodations",
    label: "Hébergements",
    icon: Hotel,
    description: "Gérer vos hébergements et propriétés",
  },
  {
    id: "touristic_places",
    label: "Lieux Touristiques",
    icon: Landmark,
    description: "Gérer vos lieux touristiques",
  },
  {
    id: "flights",
    label: "Services de Vol",
    icon: Plane,
    description: "Gérer vos vols et compagnies aériennes",
  },
  {
    id: "activities",
    label: "Activités et Loisirs",
    icon: Mountain,
    description: "Gérer vos activités et loisirs",
  },
  {
    id: "nature_patrimoine",
    label: "Nature & Patrimoine",
    icon: TreePine,
    description: "Gérer les sites naturels et patrimoniaux",
  },
];

// Types
interface Listing {
  id: string;
  title: string;
  city: string;
  price: number;
  rating: number;
  reviewCount: number;
  type: string;
  category: string;
  featured: boolean;
  available: boolean;
  instantBook?: boolean;
  isTouristicPlace: boolean;
  images: string[];
  amenities: string[];
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  entranceFee?: string;
  openingHours?: string;
}

interface Flight {
  id: string;
  compagnie: string;
  numeroVol: string;
  departVille: string;
  arriveeVille: string;
  departDateHeure: string;
  arriveeDateHeure: string;
  duree: string;
  escales: number;
  classe: 'economy' | 'premium' | 'business' | 'first';
  prix: number;
  services: string[];
  image?: string;
  availableSeats?: number;
  nbrPersonne?: number;
}

interface Activity {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  location?: string;
  price: number;
  duration?: string;
  capacity?: number;
  category?: string;
  image?: string;
  included?: string[];
  requirements?: string;
  isActive?: boolean;
  color?: string;
  icon?: string;
}

interface NaturePatrimoine {
  id: string;
  title: string;
  type: string;
  category: string;
  location: string;
  description: string;
  images: string[];
  altitude?: string;
  year?: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  available?: boolean;
}

interface Stats {
  totalListings?: number;
  averageRating?: number;
  availableListings?: number;
  totalBookings?: number;
}

// Composant principal
export default function TourismPage() {
  const [contentType, setContentType] = useState("accommodations");
  const [listings, setListings] = useState<Listing[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [naturePatrimoine, setNaturePatrimoine] = useState<NaturePatrimoine[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [naturePatrimoineLoading, setNaturePatrimoineLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const { user } = useAuth();
  const [filters, setFilters] = useState({
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
    category: [],
    rating: 0,
    amenities: [],
    instantBook: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedNaturePatrimoine, setSelectedNaturePatrimoine] = useState<NaturePatrimoine | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);
  const [showNatureDetailModal, setShowNatureDetailModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingNaturePatrimoine, setEditingNaturePatrimoine] = useState<NaturePatrimoine | null>(null);
  const [bookingForm, setBookingForm] = useState({
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

  // États pour les dropdowns
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showNaturePatrimoineModal, setShowNaturePatrimoineModal] = useState(false);
  const [showAirlineModal, setShowAirlineModal] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

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
      category: [],
      rating: 0,
      amenities: [],
      instantBook: false,
    };

    setFilters(resetFilters);
  };

  // Charger les données en fonction du type de contenu
  useEffect(() => {
    if (contentType === "accommodations") {
      loadAccommodations();
    } else if (contentType === "touristic_places") {
      loadTouristicPlaces();
    } else if (contentType === "flights") {
      loadFlights();
    } else if (contentType === "activities") {
      loadActivities();
    } else if (contentType === "nature_patrimoine") {
      loadNaturePatrimoine();
    }
    loadStats();
  }, [contentType]);

  const loadAccommodations = async () => {
    try {
      setLoading(true);
      const response = await tourismeAPI.getAccommodations();
      
      if (response.data.success) {
        const listingsData = response.data.data;
        setListings(listingsData);
        setFilteredListings(listingsData);

        const initialIndexes: Record<string, number> = {};
        listingsData.forEach((listing: Listing) => {
          initialIndexes[listing.id] = 0;
        });
        setCurrentImageIndex(initialIndexes);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des hébergements:", error);
      toast.error("Erreur lors du chargement des hébergements");
    } finally {
      setLoading(false);
    }
  };

  const loadTouristicPlaces = async () => {
    try {
      setLoading(true);
      const response = await tourismeAPI.getTouristicPlaces();

      if (response.data.success) {
        const placesData = response.data.data;
        setListings(placesData);
        setFilteredListings(placesData);

        const initialIndexes: Record<string, number> = {};
        placesData.forEach((place: Listing) => {
          initialIndexes[place.id] = 0;
        });
        setCurrentImageIndex(initialIndexes);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des lieux touristiques:", error);
      toast.error("Erreur lors du chargement des lieux touristiques");
    } finally {
      setLoading(false);
    }
  };

  const loadFlights = async () => {
    try {
      setFlightsLoading(true);
      const response = await tourismeAPI.getFlights();

      if (response.data.success) {
        const flightsData = response.data.data;
        setFlights(flightsData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des vols:", error);
      toast.error("Erreur lors du chargement des vols");
    } finally {
      setFlightsLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await api.get('/ActivityCategory');

      if (response.data.success) {
        setActivities(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error);
      if (error.response) {
        console.error("Détails de l'erreur:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      toast.error("Erreur lors du chargement des activités");
    } finally {
      setActivitiesLoading(false);
    }
  };

// Dans TourismPage.jsx, remplacez la fonction loadNaturePatrimoine par :
 
const loadNaturePatrimoine = async () => {
  try {
    setNaturePatrimoineLoading(true);
    
 
    const response = await tourismeAPI.getNaturePatrimoine();
    
  
    // Vérifier la structure de la réponse
    if (!response.data) {
      console.error("Aucune donnée dans la réponse");
      toast.error("Aucune donnée reçue du serveur");
      setNaturePatrimoine([]);
      return;
    }
    
    if (response.data.success) {
      const data = response.data.data;
    
      // Vérifier si c'est un tableau
      if (Array.isArray(data)) {
        // Transformer les données
        const patrimoineData = data.map(item => ({
          id: item.id || item._id || Date.now().toString(),
          title: item.title || item.name || item.nom || "Sans titre",
          type: item.type || "nature",
          category: item.category || "site_naturel",
          location: item.location || item.city || item.ville || item.adresse || "Localisation inconnue",
          description: item.description || item.desc || "Aucune description",
          images: item.images || (item.image ? [item.image] : []),
          altitude: item.altitude,
          year: item.year,
          rating: item.rating || 0,
          reviewCount: item.reviewCount || 0,
          featured: item.featured || false,
          available: item.available !== false,
          userId: item.userId,
          user: item.user,
          // Ajouter d'autres champs si nécessaire
          ...item
        }));
     
        setNaturePatrimoine(patrimoineData);
      } else {
        // Si ce n'est pas un tableau, créer un tableau avec l'objet unique
      
        const item = data;
        const patrimoineData = [{
          id: item.id || item._id || Date.now().toString(),
          title: item.title || item.name || item.nom || "Sans titre",
          type: item.type || "nature",
          category: item.category || "site_naturel",
          location: item.location || item.city || item.ville || item.adresse || "Localisation inconnue",
          description: item.description || item.desc || "Aucune description",
          images: item.images || (item.image ? [item.image] : []),
          altitude: item.altitude,
          year: item.year,
          rating: item.rating || 0,
          reviewCount: item.reviewCount || 0,
          featured: item.featured || false,
          available: item.available !== false,
          userId: item.userId,
          user: item.user,
          ...item
        }];
        
        setNaturePatrimoine(patrimoineData);
      }
    } else {
      console.error("API a retourné success: false", response.data);
      toast.error(response.data.message || "Erreur lors du chargement des données");
      setNaturePatrimoine([]);
    }
  } catch (error) {
    console.error("Erreur complète lors du chargement des sites naturels:", error);
    
    // Afficher plus de détails
    if (error.response) {
      console.error("Status de l'erreur:", error.response.status);
      console.error("Données de l'erreur:", error.response.data);
      console.error("URL de la requête:", error.response.config?.url);
      
      if (error.response.status === 404) {
        toast.error("Route API non trouvée. Vérifiez l'URL.");
      } else if (error.response.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
      } else if (error.response.status === 403) {
        toast.error("Accès refusé. Vous n'avez pas les permissions nécessaires.");
      } else {
        toast.error(`Erreur serveur (${error.response.status}): ${error.response.data?.message || 'Erreur inconnue'}`);
      }
    } else if (error.request) {
      console.error("Pas de réponse du serveur:", error.request);
      toast.error("Serveur inaccessible. Vérifiez votre connexion internet.");
    } else {
      console.error("Erreur de configuration:", error.message);
      toast.error(`Erreur: ${error.message}`);
    }
    
    // Initialiser avec un tableau vide pour éviter les erreurs
    setNaturePatrimoine([]);
  } finally {
    setNaturePatrimoineLoading(false);
  }
};

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await tourismeAPI.getStats({
        contentType: contentType === "flights" || contentType === "activities" || contentType === "nature_patrimoine" ? null : contentType,
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Filtrer les résultats (pour hébergements et lieux touristiques)
  useEffect(() => {
    if (contentType === "flights" || contentType === "activities" || contentType === "nature_patrimoine") return;

    let results = listings;

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
    }

    if (contentType === "accommodations" && filters.type.length > 0) {
      results = results.filter((listing) =>
        filters.type.includes(listing.type)
      );
    }

    if (contentType === "touristic_places" && filters.category.length > 0) {
      results = results.filter((listing) =>
        filters.category.includes(listing.category)
      );
    }

    if (filters.rating > 0) {
      results = results.filter((listing) => listing.rating >= filters.rating);
    }

    if (filters.amenities.length > 0) {
      results = results.filter((listing) =>
        filters.amenities.every((amenity) =>
          listing.amenities.includes(amenity)
        )
      );
    }

    if (filters.instantBook) {
      results = results.filter((listing) => listing.instantBook);
    }

    results = results.filter(
      (listing) =>
        listing.price >= filters.minPrice && listing.price <= filters.maxPrice
    );

    setFilteredListings(results);
  }, [filters, listings, contentType]);

  // Fonction pour obtenir l'icône du type
  const getTypeIcon = (type: string, isTouristicPlace: boolean, category?: string) => {
    if (isTouristicPlace) {
      const categoryObj = touristicCategories.find(
        (cat) => cat.id === category
      );
      return categoryObj?.icon || Landmark;
    }

    switch (type) {
      case "hotel":
        return Building;
      case "apartment":
        return Home;
      case "villa":
        return Home;
      case "guesthouse":
        return Home;
      default:
        return Building;
    }
  };

  // Fonction pour supprimer une activité
  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      return;
    }

    try {
      const response = await api.delete(`/ActivityCategory/${id}`);
      
      if (response.data.success) {
        toast.success("Activité supprimée avec succès");
        
        setActivities(prev => prev.filter(activity => activity.id !== id));
        
        if (selectedActivity?.id === id) {
          setSelectedActivity(null);
          setShowActivityDetailModal(false);
        }
      }
    } catch (error: any) {
      console.error("❌ Erreur suppression activité:", error);
      toast.error(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  // Fonction pour éditer une activité
  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowActivitiesModal(true);
  };

  // Fonction pour voir les détails d'une activité
  const handleViewActivityDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowActivityDetailModal(true);
  };

  // Fonction pour supprimer un site nature/patrimoine
  const handleDeleteNaturePatrimoine = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) {
      return;
    }

    try {
      const response = await tourismeAPI.deleteNaturePatrimoine(id);
      
      if (response.data.success) {
        toast.success("Site supprimé avec succès");
        setNaturePatrimoine(prev => prev.filter(item => item.id !== id));
        
        if (selectedNaturePatrimoine?.id === id) {
          setSelectedNaturePatrimoine(null);
          setShowNatureDetailModal(false);
        }
      }
    } catch (error: any) {
      console.error("❌ Erreur suppression site:", error);
      toast.error(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  // Fonction pour éditer un site nature/patrimoine
  const handleEditNaturePatrimoine = (item: NaturePatrimoine) => {
    setEditingNaturePatrimoine(item);
    setShowNaturePatrimoineModal(true);
  };

  // Fonction pour voir les détails d'un site nature/patrimoine
  const handleViewNatureDetails = (item: NaturePatrimoine) => {
    setSelectedNaturePatrimoine(item);
    setShowNatureDetailModal(true);
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      return;
    }

    try {
      await tourismeAPI.deleteListing(id);
      toast.success(
        contentType === "touristic_places"
          ? "Lieu touristique supprimé avec succès"
          : "Hébergement supprimé avec succès"
      );

      setListings((prev) => {
        const updated = prev.filter((listing) => listing.id !== id);
        return updated;
      });

      resetAllFilters();
      await loadStats();
    } catch (error: any) {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Erreur lors de la suppression");
      console.error("❌ Erreur suppression:", error);
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      const response = await tourismeAPI.toggleAvailability(id);

      if (response.data.success) {
        setListings((prev) =>
          prev.map((listing) =>
            listing.id === id ? response.data.data : listing
          )
        );

        setFilteredListings((prev) =>
          prev.map((listing) =>
            listing.id === id ? response.data.data : listing
          )
        );

        toast.success(response.data.message);
        await loadStats();
      }
    } catch (error: any) {
      console.error("❌ Erreur bascule disponibilité:", error);
      toast.error(
        error.response?.data?.error ||
        "Erreur lors du changement de disponibilité"
      );
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await tourismeAPI.toggleFeatured(id);

      if (response.data.success) {
        setListings((prev) =>
          prev.map((listing) =>
            listing.id === id ? response.data.data : listing
          )
        );

        setFilteredListings((prev) =>
          prev.map((listing) =>
            listing.id === id ? response.data.data : listing
          )
        );

        toast.success(response.data.message);
        await loadStats();
      }
    } catch (error: any) {
      console.error("❌ Erreur bascule vedette:", error);
      toast.error(
        error.response?.data?.error ||
        "Erreur lors du changement de statut vedette"
      );
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        toast.success("Retiré des favoris");
      } else {
        newFavorites.add(id);
        toast.success("Ajouté aux favoris");
      }
      return newFavorites;
    });
  };

  const openEditModal = (listing: Listing) => {
    setEditingListing(listing);
    setShowAdminModal(true);
  };

  const openDetailModal = (listing: Listing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
  };

  const handleAdminSubmit = async (formData: any) => {
    try {
      setShowAdminModal(false);
      setEditingListing(null);
      resetAllFilters();

      if (formData.isTouristicPlace) {
        await loadTouristicPlaces();
      } else {
        await loadAccommodations();
      }
      await loadStats();
    } catch (error: any) {
      console.error("❌ Erreur opération:", error);
      toast.error(error.response?.data?.error || "Erreur lors de l'opération");
    }
  };

  const handleCloseAdminModal = () => {
    setShowAdminModal(false);
    setEditingListing(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedListing(null);
  };

  const handleCloseActivityDetailModal = () => {
    setShowActivityDetailModal(false);
    setSelectedActivity(null);
  };

  const handleCloseNatureDetailModal = () => {
    setShowNatureDetailModal(false);
    setSelectedNaturePatrimoine(null);
  };

  // Fonctions de rendu pour AdminInterface
  const renderListingCards = () => {
    return filteredListings.map((listing) => (
      <ListingCard
        key={listing.id}
        listing={listing}
        user={user}
        isFavorite={favorites.has(listing.id)}
        onToggleFavorite={toggleFavorite}
        onToggleAvailability={toggleAvailability}
        onToggleFeatured={toggleFeatured}
        onOpenDetailModal={openDetailModal}
        onOpenEditModal={openEditModal}
        onDeleteListing={handleDeleteListing}
        getTypeIcon={getTypeIcon}
        availableAmenities={availableAmenities}
      />
    ));
  };

  const renderFlightCards = () => {
    return flights.map((flight) => (
      <FlightCard
        key={flight.id}
        flight={flight}
        user={user}
      />
    ));
  };

  const renderActivityCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            user={user}
            onViewDetails={handleViewActivityDetails}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
          />
        ))}
      </div>
    );
  };

  const renderNaturePatrimoineCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {naturePatrimoine.map((item) => (
          <NaturePatrimoineCard
            key={item.id}
            item={item}
            onViewDetails={handleViewNatureDetails}
            onEdit={handleEditNaturePatrimoine}
            onDelete={handleDeleteNaturePatrimoine}
          />
        ))}
      </div>
    );
  };

  const handleContentTypeChange = (type: string) => {
    setContentType(type);
  };

  const handleAddClick = () => {
    if (contentType === "accommodations") {
      setEditingListing(null);
      setShowAdminModal(true);
    } else if (contentType === "touristic_places") {
      setEditingListing(null);
      setShowAdminModal(true);
    } else if (contentType === "flights") {
      setShowFlightModal(true);
    } else if (contentType === "activities") {
      setEditingActivity(null);
      setShowActivitiesModal(true);
    } else if (contentType === "nature_patrimoine") {
      setEditingNaturePatrimoine(null);
      setShowNaturePatrimoineModal(true);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.lightBg }}>
      <div className="container mx-auto px-4 lg:p-0 py-4">
        <AdminInterface
          contentType={contentType}
          contentTypeOptions={contentTypeOptions}
          stats={stats}
          flights={flights}
          activities={activities}
          naturePatrimoine={naturePatrimoine} // ← Doit être présent
          listings={listings}
          filteredListings={filteredListings}
          loading={loading}
          flightsLoading={flightsLoading}
          activitiesLoading={activitiesLoading}
          naturePatrimoineLoading={naturePatrimoineLoading} // ← Doit être présent
          user={user}
          onContentTypeChange={handleContentTypeChange}
          onAddClick={handleAddClick}
          onRefreshActivities={loadActivities}
          renderListingCards={renderListingCards}
          renderFlightCards={renderFlightCards}
          renderActivityCards={renderActivityCards}
          renderNaturePatrimoineCards={renderNaturePatrimoineCards} // ← Doit être présent
        />
      </div>

      {/* Modals */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={handleCloseAdminModal}
        onSubmit={handleAdminSubmit}
        editingListing={editingListing}
        contentType={contentType}
      />

      <DetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        selectedListing={selectedListing}
      />

      <ActivityDetailModal
        isOpen={showActivityDetailModal}
        onClose={handleCloseActivityDetailModal}
        activity={selectedActivity}
        user={user}
        onEdit={handleEditActivity}
        onDelete={handleDeleteActivity}
      />

      {showFlightModal && (
        <AjoutVolModal
          isOpen={showFlightModal}
          onClose={() => setShowFlightModal(false)}
          onSubmit={(flightData) => {
            toast.success("Vol ajouté avec succès");
            setShowFlightModal(false);
            loadFlights();
          }}
        />
      )}

      {showActivitiesModal && (
        <AjoutActivitesModal
          isOpen={showActivitiesModal}
          onClose={() => setShowActivitiesModal(false)}
          editingActivity={editingActivity}
          onSubmit={(activitesData) => {
            toast.success(editingActivity ? "Activité modifiée avec succès" : "Activité ajoutée avec succès");
            setShowActivitiesModal(false);
            setEditingActivity(null);
            loadActivities();
          }}
        />
      )}

      {showNaturePatrimoineModal && (
        <AjoutNaturePatrimoineModal
          isOpen={showNaturePatrimoineModal}
          onClose={() => setShowNaturePatrimoineModal(false)}
          editingItem={editingNaturePatrimoine}
          onSubmit={(data) => {
            toast.success(editingNaturePatrimoine ? "Site modifié avec succès" : "Site ajouté avec succès");
            setShowNaturePatrimoineModal(false);
            setEditingNaturePatrimoine(null);
            loadNaturePatrimoine();
            // refreshSites();
          }}
        />
      )}

      {showNatureDetailModal && selectedNaturePatrimoine && (
        <NatureDetailModal
          isOpen={showNatureDetailModal}
          onClose={handleCloseNatureDetailModal}
          item={selectedNaturePatrimoine}
          onEdit={handleEditNaturePatrimoine}
          onDelete={handleDeleteNaturePatrimoine}
        />
      )}

      <AirlineModal
        isOpen={showAirlineModal}
        onClose={() => setShowAirlineModal(false)}
      />
    </div>
  );
}