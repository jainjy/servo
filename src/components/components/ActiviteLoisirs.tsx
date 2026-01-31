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
import UserParapentePage from "@/pages/UserParapentePage";
import ActivityBookingModal from "./ActivityBookingModal";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
  // REMOVED: availabilities relation
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

const ActivitesLoisirsFAQ: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"activites" | "parapente">(
    "activites",
  );
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
            "/activity-actions/favorites/my-favorites", // Changé d'URL
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

      setActivities(activitiesWithFavorites);
      setFilteredActivities(activitiesWithFavorites);
    } catch (err) {
      console.error("❌ Erreur chargement activités:", err);
      toast.error("Erreur lors du chargement des activités");
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
          activity.location?.toLowerCase().includes(term) ||
          activity.category?.name.toLowerCase().includes(term) ||
          activity.shortDescription?.toLowerCase().includes(term),
      );
    }

    // Filtre par catégorie
    if (activeCategory !== "all") {
      results = results.filter(
        (activity) => activity.category?.name === activeCategory,
      );
    }

    setFilteredActivities(results);
  }, [searchTerm, activeCategory, activities]);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const getCategoryCount = (name: string) => {
    if (name === "all") return activities.length;
    return activities.filter((a) => a.category?.name === name).length;
  };

  const handleBookActivity = (activity: Activity) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour réserver");
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

    try {
      // Toggle favorite
      const isCurrentlyFavorite = activities.find(
        (a) => a.id === activityId,
      )?.isFavorite;

      if (isCurrentlyFavorite) {
        await api.delete(`/activity-actions/${activityId}/favorite`); // Changé d'URL
        toast.success("Retiré des favoris");
      } else {
        await api.post(`/activity-actions/${activityId}/favorite`); // Changé d'URL
        toast.success("Ajouté aux favoris");
      }

      // Mettre à jour l'état local
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

  // Fonction pour vérifier la disponibilité
  const checkAvailability = (activity: Activity) => {
    // Dans le nouveau schéma, la disponibilité est gérée directement via les réservations
    // Vous pouvez implémenter une logique basée sur le bookingCount vs maxParticipants
    if (
      activity.maxParticipants &&
      activity.bookingCount >= activity.maxParticipants
    ) {
      return "Complet";
    }
    return "Disponible";
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

      {/* TABS */}
      <div className="flex justify-center gap-4 px-4 mb-8">
        <button
          onClick={() => setActiveTab("activites")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all border-2
            ${
              activeTab === "activites"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
        >
          Activités & Loisirs
        </button>
        <button
          onClick={() => setActiveTab("parapente")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all border-2 flex items-center gap-2
            ${
              activeTab === "parapente"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
        >
          <Mountain className="w-5 h-5" />
          Parapente
        </button>
      </div>

      {/* CONTENT */}
      {activeTab === "activites" && (
        <>
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
                {activities.length}
              </span>
            </button>

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
                <p className="mt-4 text-gray-600">
                  Chargement des activités...
                </p>
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
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-xl group"
                  >
                    {/* Image avec badges */}
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          activity.mainImage ||
                          activity.images[0] ||
                          "/placeholder-activity.jpg"
                        }
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={activity.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      {/* Badge catégorie */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-lg text-xs flex items-center gap-2 font-medium">
                        {activity.category?.icon &&
                        iconMap[activity.category.icon] ? (
                          iconMap[activity.category.icon]
                        ) : (
                          <Star className="w-3 h-3" />
                        )}
                        {activity.category?.name || "Activité"}
                      </div>
                      {/* Badge niveau */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg text-xs font-semibold">
                        {activity.level || "Tous niveaux"}
                      </div>
                      {/* Badge prix */}
                      <div className="absolute bottom-4 left-4 px-3 py-2 bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-md text-white rounded-lg text-sm font-bold">
                        {formatPrice(activity.price)}
                        {activity.price && (
                          <span className="text-xs font-normal ml-1">
                            /personne
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contenu de la carte */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          {activity.title}
                        </h3>
                        <button
                          onClick={() => handleFavorite(activity.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${activity.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                          />
                        </button>
                      </div>

                      {/* Localisation */}
                      {activity.location && (
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{activity.location}</span>
                        </div>
                      )}

                      {/* Stats rapides */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(
                            activity.duration,
                            activity.durationType,
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {activity.minParticipants}-
                          {activity.maxParticipants || 10} pers.
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {checkAvailability(activity)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {activity.shortDescription || activity.description}
                      </p>

                      {/* Highlights */}
                      {activity.highlights &&
                        activity.highlights.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              Points forts :
                            </h4>
                            <ul className="grid grid-cols-1 gap-2">
                              {activity.highlights
                                .slice(0, 3)
                                .map((highlight, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <Star className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-gray-600">
                                      {highlight}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                      {/* Note moyenne */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(activity.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {activity.rating?.toFixed(1) || "Nouveau"}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({activity.reviewCount || 0} avis)
                        </span>
                      </div>

                      {/* Section détaillée (FAQ) */}
                      {openFAQ === activity.id && (
                        <div className="mb-4 transition-all duration-300 animate-fadeIn">
                          <div className="space-y-4">
                            {/* Inclus */}
                            {activity.includedItems &&
                              activity.includedItems.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                    Inclus :
                                  </h4>
                                  <ul className="grid grid-cols-2 gap-2">
                                    {activity.includedItems.map((item, i) => (
                                      <li
                                        key={i}
                                        className="flex items-center gap-2"
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                        <span className="text-xs text-gray-600">
                                          {item}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                            {/* Professionnel */}
                            {activity.creator && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                  Votre professionnel :
                                </h4>
                                <div className="flex items-center gap-3">
                                  {activity.creator.avatar ? (
                                    <img
                                      src={activity.creator.avatar}
                                      alt="Professionnel"
                                      className="w-10 h-10 rounded-full"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-600 font-semibold">
                                        {activity.creator.firstName?.charAt(0)}
                                        {activity.creator.lastName?.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {activity.creator.firstName}{" "}
                                      {activity.creator.lastName}
                                    </p>
                                    {activity.creator.companyName && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {activity.creator.companyName}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Boutons d'action */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          onClick={() => toggleFAQ(activity.id)}
                          className="flex items-center gap-2 text-green-600 font-semibold text-sm transition hover:text-emerald-700 hover:gap-3"
                        >
                          {openFAQ === activity.id ? (
                            <>
                              Réduire <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Voir plus de détails{" "}
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleBookActivity(activity)}
                          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 hover:shadow-lg"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* PARAPENTE TAB */}
      {activeTab === "parapente" && <UserParapentePage />}

      {/* Modal de réservation */}
      {selectedActivity && (
        <ActivityBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          activity={selectedActivity}
          onBookingSuccess={() => {
            toast.success("Réservation effectuée avec succès !");
            setIsBookingModalOpen(false);
            // Recharger les activités pour mettre à jour les disponibilités
            loadActivities();
          }}
        />
      )}
    </div>
  );
};

export default ActivitesLoisirsFAQ;
