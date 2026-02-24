import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mountain,
  Compass,
  Moon,
  Waves,
  Tent,
  Star,
  Search,
  Users,
  Clock,
  MapPin,
  Calendar,
  Heart,
  Trophy,
  Zap,
  TreePine,
} from "lucide-react";
import { api } from "@/lib/axios";
import TourismNavigation from "../TourismNavigation";
import AdvertisementPopup from "../AdvertisementPopup";
import ActivityBookingModal from "./ActivityBookingModal";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive: boolean;
  };
  userId: string;
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    professionalCategory?: string;
    companyName?: string;
  };
  mainImage?: string;
  images: string[];
  price?: number;
  priceType?: string;
  duration?: number;
  durationType?: string;
  level?: string;
  maxParticipants?: number;
  minParticipants: number;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  meetingPoint?: string;
  includedItems: string[];
  requirements: string[];
  highlights: string[];
  status: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  bookingCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviews?: Array<{
    rating: number;
  }>;
  _count?: {
    favorites: number;
    bookings: number;
    reviews: number;
  };
  isFavorite?: boolean;
}

interface ActivityCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: {
    activities: number;
  };
}

const iconMap: Record<string, JSX.Element> = {
  Mountain: <Mountain className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  Waves: <Waves className="w-5 h-5" />,
  Tent: <Tent className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  TreePine: <TreePine className="w-5 h-5" />,
};

// Données dynamiques pour parapente et kayak avec les IDs fournis
const staticActivities: Activity[] = [
  {
    id: "static-parapente-1",
    title: "Air Lagon Parapente",
    description: "Découvrez la Réunion vue du ciel. Des vols inoubliables au-dessus du lagon de Saint-Leu avec des moniteurs passionnés.",
    shortDescription: "Vols en parapente au-dessus du lagon",
    categoryId: "parapente-category",
    category: {
      id: "parapente-category",
      name: "parapente",
      icon: "Mountain",
      isActive: true
    },
    userId: "bf88e335-ef90-4a39-898d-561d237aaff3", // ID parapente
    creator: {
      id: "bf88e335-ef90-4a39-898d-561d237aaff3",
      firstName: "Parapente",
      lastName: "Réunion",
      companyName: "Air Lagon Parapente"
    },
    mainImage: "https://wvrxayklhpbquxsluzve.supabase.co/storage/v1/object/public/blog-images/blog-images/1768836430476-9b69z2jvyil.png",
    images: [],
    level: "Tous niveaux",
    location: "Saint-Leu",
    rating: 5.0,
    reviewCount: 0,
    viewCount: 0,
    bookingCount: 0,
    minParticipants: 1,
    includedItems: [],
    requirements: [],
    highlights: [],
    status: "active",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "static-kayak-1",
    title: "Kayak Transparent",
    description: "Voyage au rythme du lagon. Explorez les fonds marins en kayak transparent pour une expérience unique.",
    shortDescription: "Voyage au rythme du lagon",
    categoryId: "kayak-category",
    category: {
      id: "kayak-category",
      name: "kayak",
      icon: "Waves",
      isActive: true
    },
    userId: "2f448e35-d2d8-453c-8918-1e5aa92915dd", // ID kayak
    creator: {
      id: "2f448e35-d2d8-453c-8918-1e5aa92915dd",
      firstName: "Kayak",
      lastName: "Réunion",
      companyName: "Kayak Transparent"
    },
    mainImage: "/logo-kayak-transparent.png",
    images: [],
    level: "Tous niveaux",
    location: "Kayak Transparent Reunion",
    rating: 5.0,
    reviewCount: 0,
    viewCount: 0,
    bookingCount: 0,
    minParticipants: 1,
    includedItems: [],
    requirements: [],
    highlights: [],
    status: "active",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const ActivitesLoisirsFAQ: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/ActivityCategory/public");
        setCategories(res.data.data);
      } catch (err) {
        console.error("❌ Erreur chargement catégories:", err);
      }
    };
    loadCategories();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get("/activities");
      console.log("📊 Activités chargées:", res.data.data);

      // Charger les favoris de l'utilisateur connecté
      let activitiesWithFavorites = res.data.data;
      if (user) {
        try {
          const favoritesRes = await api.get(
            "/activity-actions/favorites/my-favorites",
          );
          const favoriteActivityIds = favoritesRes.data.data.map(
            (fav: Activity) => fav.id,
          );

          activitiesWithFavorites = activitiesWithFavorites.map(
            (activity: Activity) => ({
              ...activity,
              isFavorite: favoriteActivityIds.includes(activity.id),
            }),
          );
        } catch (favoriteError) {
          console.error("Erreur chargement favoris:", favoriteError);
        }
      }

      // Combiner avec les activités statiques
      const allActivities = [...activitiesWithFavorites, ...staticActivities];
      setActivities(allActivities);
      setFilteredActivities(allActivities);
    } catch (err) {
      console.error("❌ Erreur chargement activités:", err);
      toast.error("Erreur lors du chargement des activités");
      // En cas d'erreur, afficher au moins les activités statiques
      setActivities(staticActivities);
      setFilteredActivities(staticActivities);
    } finally {
      setLoading(false);
    }
  };

  // Charger les activités
  useEffect(() => {
    loadActivities();
  }, [user]);

  // Filtrer les activités
  useEffect(() => {
    let results = activities;

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (activity) =>
          activity.title.toLowerCase().includes(term) ||
          activity.description.toLowerCase().includes(term) ||
          (activity.location && activity.location.toLowerCase().includes(term)) ||
          (activity.category?.name && activity.category.name.toLowerCase().includes(term)) ||
          (activity.shortDescription && activity.shortDescription.toLowerCase().includes(term)),
      );
    }

    // Filtre par catégorie
    if (activeCategory !== "all") {
      results = results.filter(
        (activity) => activity.category?.name?.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    setFilteredActivities(results);
  }, [searchTerm, activeCategory, activities]);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const getCategoryCount = (name: string) => {
    if (name === "all") {
      return activities.length;
    }
    
    return activities.filter(
      (a) => a.category?.name?.toLowerCase() === name.toLowerCase()
    ).length;
  };

  const handleActivityClick = (activity: Activity) => {
    // Redirection vers la page du professionnel avec son ID
    navigate(`/professional/${activity.userId}`);
  };

  const handleBookActivity = (activity: Activity) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour réserver");
      return;
    }
    
    if (activity.id.startsWith('static-')) {
      toast.info("Cette activité sera bientôt disponible à la réservation en ligne");
      return;
    }
    
    setSelectedActivity(activity);
    setIsBookingModalOpen(true);
  };

  const handleFavorite = async (activityId: string) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour ajouter aux favoris");
      return;
    }

    // Vérifier si c'est une activité statique
    if (activityId.startsWith('static-')) {
      toast.info("Les activités statiques ne peuvent pas être ajoutées aux favoris pour le moment");
      return;
    }

    try {
      const activity = activities.find(a => a.id === activityId);
      const isCurrentlyFavorite = activity?.isFavorite;

      if (isCurrentlyFavorite) {
        await api.delete(`/activity-actions/${activityId}/favorite`);
        toast.success("Retiré des favoris");
      } else {
        await api.post(`/activity-actions/${activityId}/favorite`);
        toast.success("Ajouté aux favoris");
      }

      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId
            ? { ...activity, isFavorite: !isCurrentlyFavorite }
            : activity,
        ),
      );
    } catch (error) {
      console.error("Erreur favorite:", error);
      toast.error("Erreur lors de la mise à jour des favoris");
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Sur devis";
    return `${price.toFixed(2)}€`;
  };

  const formatDuration = (duration?: number, durationType?: string) => {
    if (!duration) return "Durée variable";
    if (durationType === "minutes") {
      if (duration < 60) return `${duration}min`;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (minutes === 0) return `${hours}h`;
      return `${hours}h${minutes}`;
    } else if (durationType === "hours") {
      return `${duration}h`;
    } else if (durationType === "days") {
      return `${duration} jour${duration > 1 ? "s" : ""}`;
    }
    return `${duration} min`;
  };

  const checkAvailability = (activity: Activity) => {
    if (
      activity.maxParticipants &&
      activity.bookingCount >= activity.maxParticipants
    ) {
      return "Complet";
    }
    return "Disponible";
  };

  // Rendu d'une carte d'activité
  const renderActivityCard = (activity: Activity) => {
    const isStatic = activity.id.startsWith('static-');
    
    return (
      <div
        key={activity.id}
        onClick={() => handleActivityClick(activity)}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-xl group cursor-pointer flex flex-col"
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={activity.mainImage || "/placeholder-activity.jpg"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            alt={activity.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white rounded-lg text-xs flex items-center gap-2 font-medium">
            {activity.category?.icon && iconMap[activity.category.icon] ? (
              iconMap[activity.category.icon]
            ) : (
              <Mountain className="w-3 h-3" />
            )}
            {activity.category?.name || "Activité"}
          </div>

          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50">
                <span className="text-[10px] font-bold">
                  {activity.creator?.firstName?.charAt(0) || ''}
                  {activity.creator?.lastName?.charAt(0) || ''}
                </span>
              </div>
              <span className="text-xs font-medium text-white/90">
                {activity.creator?.companyName || 'Professionnel'}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-tight">
              {activity.title}
            </h3>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold text-gray-900">
                {activity.rating?.toFixed(1) || "5.0"}
              </span>
              <span className="text-xs text-gray-500">(Expert)</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              Recommandé
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {activity.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 mb-5 border-t border-gray-100 pt-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {activity.location || "À définir"}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {activity.level || "Tous niveaux"}
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleActivityClick(activity);
            }}
            className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all bg-gray-900 text-white group-hover:bg-blue-600 shadow-md flex items-center justify-center gap-2"
          >
            Voir les profils <Trophy className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <div className="relative overflow-hidden mb-8">
        <div
          className="relative pt-20 pb-8 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/couple-together-kayaking-river.jpg")',
          }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-xl md:text-4xl font-medium uppercase drop-shadow-2xl tracking-wide mb-4">
              Activités & Loisirs
            </h1>
            <p className="my-4 text-sm max-w-3xl mx-auto leading-relaxed">
              Découvrez nos expériences touristiques immersives et aventures
              nature au cœur des paysages exceptionnels.
            </p>
            <TourismNavigation />
          </div>
        </div>
      </div>
      {/* Fin Hero */}

      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 mb-14 relative z-20">
        <div className="relative bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-1 border-2 border-gray-300 transition-all hover:shadow-2xl">
          <Search className="absolute left-5 top-5 w-6 h-6 text-green-600" />
          <input
            type="text"
            placeholder="Rechercher une activité, une randonnée, une aventure..."
            className="w-full pl-14 pr-4 py-4 text-lg rounded-2xl outline-none focus:ring-3 focus:ring-green-500/50 transition bg-white/90"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AdvertisementPopup
        position="page-explorer-decouvrir"
        showOnMobile={true}
      />

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-16">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md border-2
            ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent shadow-lg"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            } hover:scale-105 hover:shadow-lg`}
        >
          <Compass className="w-5 h-5" />
          Toutes
          <span className="px-2.5 py-1 rounded-full text-xs bg-white/20 text-white">
            {getCategoryCount("all")}
          </span>
        </button>

        {/* Catégorie Parapente */}
        <button
          onClick={() => setActiveCategory("parapente")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md border-2
            ${
              activeCategory === "parapente"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent shadow-lg"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            } hover:scale-105 hover:shadow-lg`}
        >
          <Mountain className="w-5 h-5" />
          Parapente
          <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            {getCategoryCount("parapente")}
          </span>
        </button>

        {/* Catégorie Kayak */}
        <button
          onClick={() => setActiveCategory("kayak")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md border-2
            ${
              activeCategory === "kayak"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent shadow-lg"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            } hover:scale-105 hover:shadow-lg`}
        >
          <Waves className="w-5 h-5" />
          Kayak
          <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            {getCategoryCount("kayak")}
          </span>
        </button>

        {/* Autres catégories de l'API */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm transition-all shadow-md border-2
              ${
                activeCategory === cat.name
                  ? `bg-gradient-to-r ${cat.color ? `from-[${cat.color}] to-[${cat.color}]/80` : "from-green-600 to-emerald-600"} text-white border-transparent shadow-lg`
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              } hover:scale-105 hover:shadow-lg`}
          >
            {cat.icon && iconMap[cat.icon] ? (
              iconMap[cat.icon]
            ) : (
              <Star className="w-5 h-5" />
            )}
            {cat.name}
            <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
              {getCategoryCount(cat.name)}
            </span>
          </button>
        ))}
      </div>

      {/* ACTIVITIES LIST */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Chargement des activités...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-24">
            <Search className="mx-auto w-16 h-16 text-green-600 mb-4" />
            <p className="text-xl font-bold text-gray-700">
              Aucune activité trouvée
            </p>
            <p className="text-gray-500">Essayez un autre mot-clé.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => renderActivityCard(activity))}
          </div>
        )}
      </div>

      {/* Modal de réservation */}
      {selectedActivity && (
        <ActivityBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          activity={selectedActivity}
          onBookingSuccess={() => {
            toast.success("Réservation effectuée avec succès !");
            setIsBookingModalOpen(false);
            loadActivities();
          }}
        />
      )}
    </div>
  );
};

export default ActivitesLoisirsFAQ;