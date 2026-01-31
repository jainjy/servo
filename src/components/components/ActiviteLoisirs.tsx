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
  Share2,
} from "lucide-react";
import { api } from "@/lib/axios";
import TourismNavigation from "../TourismNavigation";
import AdvertisementPopup from "../AdvertisementPopup";
import Allpub from "../Allpub";
import ParapentePage from "../pro/ParapentePage";
import UserParapentePage from "@/pages/UserParapentePage";
import ActivityBookingModal from "./ActivityBookingModal.tsx";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Activity {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  icon?: string;
  image: string;
  price?: number;
  duration: string;
  level: string;
  maxParticipants: number;
  minParticipants: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  meetingPoint?: string;
  included: string[];
  requirements: string[];
  highlights: string[];
  status: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  guideId: string;
  guide?: {
    id: string;
    user?: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    rating: number;
    experience: number;
    languages: string[];
  };
  availability?: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    slots: number;
    bookedSlots: number;
    price?: number;
    status: string;
  }>;
  media?: Array<{
    id: string;
    url: string;
    type: string;
    caption?: string;
  }>;
  faqs?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  _count?: {
    favorites: number;
    bookings: number;
    reviews: number;
  };
  isFavorite?: boolean;
}

interface ActivityCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  stats?: {
    participants: string;
    duration: string;
    level: string;
  };
  features?: string[];
  highlight?: string;
}

// Couleurs du Thème
const THEME_COLORS = {
  logo: "#556B2F" /* logo / accent - Olive green */,
  "primary-dark": "#6B8E23" /* Sruvol / fonds légers - Yellow-green */,
  "light-bg": "#FFFFFF" /* fond de page / bloc texte - White */,
  separator: "#D3D3D3" /* séparateurs / bordures, UI - Light gray */,
  "secondary-text":
    "#8B4513" /* touche premium / titres secondaires - Saddle brown */,
};

const iconMap: Record<string, JSX.Element> = {
  Mountain: <Mountain className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  Waves: <Waves className="w-5 h-5" />,
  Tent: <Tent className="w-5 h-5" />,
};

const ActivitesLoisirsFAQ: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"activites" | "parapente">("activites");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
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

  // Charger les activités
  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      try {
        const res = await api.get("/activities");
        console.log("📊 Activités chargées:", res.data.data);
        setActivities(res.data.data);
        setFilteredActivities(res.data.data);
      } catch (err) {
        console.error("❌ Erreur chargement activités:", err);
        toast.error("Erreur lors du chargement des activités");
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  // Filtrer les activités
  useEffect(() => {
    let results = activities;

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter((activity) =>
        activity.title.toLowerCase().includes(term) ||
        activity.description.toLowerCase().includes(term) ||
        activity.location?.toLowerCase().includes(term) ||
        activity.category?.name.toLowerCase().includes(term)
      );
    }

    // Filtre par catégorie
    if (activeCategory !== "all") {
      results = results.filter((activity) =>
        activity.category?.name === activeCategory
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
      const isCurrentlyFavorite = activities.find(a => a.id === activityId)?.isFavorite;
      
      if (isCurrentlyFavorite) {
        await api.delete(`/activities/${activityId}/favorite`);
        toast.success("Retiré des favoris");
      } else {
        await api.post(`/activities/${activityId}/favorite`);
        toast.success("Ajouté aux favoris");
      }

      // Mettre à jour l'état local
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, isFavorite: !isCurrentlyFavorite }
          : activity
      ));
    } catch (error) {
      console.error("Erreur favorite:", error);
      toast.error("Erreur lors de la mise à jour des favoris");
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Sur devis";
    return `${price.toFixed(2)}€`;
  };

  const getNextAvailableDate = (activity: Activity) => {
    if (!activity.availability || activity.availability.length === 0) {
      return "Pas de disponibilité";
    }
    
    const nextDate = activity.availability
      .filter(avail => avail.status === "available" && avail.slots > avail.bookedSlots)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    if (!nextDate) return "Complet";
    
    const date = new Date(nextDate.date);
    return date.toLocaleDateString("fr-FR", {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Couleurs de dégradé par défaut (si cat.color n'est pas défini)
  const defaultGradient = `from-[${THEME_COLORS["primary-dark"]}] to-[${THEME_COLORS.logo}]`;
  // Couleur d'accent principale
  const accentColor = THEME_COLORS.logo;
  // Couleur d'accent secondaire (texte premium/titre)
  const secondaryAccentColor = THEME_COLORS["secondary-text"];
  // Couleur d'arrière-plan clair
  const lightBg = THEME_COLORS["light-bg"];
  // Couleur de bordure/séparateur
  const separatorColor = THEME_COLORS.separator;

  return (
    <div className={`min-h-screen bg-[${lightBg}] text-gray-900`}>
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
        <div
          className={`relative bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-1 border-2 border-[${separatorColor}] transition-all hover:shadow-2xl`}
        >
          <Search
            className={`absolute left-5 top-5 w-6 h-6 text-[${accentColor}]`}
          />
          <input
            type="text"
            placeholder="Rechercher une activité, une randonnée, une aventure..."
            className={`w-full pl-14 pr-4 py-4 text-lg rounded-2xl outline-none focus:ring-3 focus:ring-[${accentColor}]/50 transition bg-white/90`}
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
                ? `bg-gradient-to-r ${defaultGradient} text-white border-transparent`
                : `bg-white text-gray-800 border-[${separatorColor}] hover:bg-gray-50`
            }`}
        >
          Activités & Loisirs
        </button>
        <button
          onClick={() => setActiveTab("parapente")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all border-2 flex items-center gap-2
            ${
              activeTab === "parapente"
                ? `bg-gradient-to-r ${defaultGradient} text-white border-transparent`
                : `bg-white text-gray-800 border-[${separatorColor}] hover:bg-gray-50`
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
                    ? `bg-gradient-to-r ${defaultGradient} text-white border-transparent shadow-lg`
                    : `bg-white text-gray-800 border-[${separatorColor}] hover:bg-gray-50`
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
                      ? `bg-gradient-to-r ${cat.color || defaultGradient} text-white border-transparent shadow-lg`
                      : `bg-white text-gray-800 border-[${separatorColor}] hover:bg-gray-50`
                  } hover:scale-105 hover:shadow-lg`}
              >
                {iconMap[cat.icon] ?? <Star className="w-5 h-5" />}
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[${accentColor}]"></div>
                <p className="mt-4 text-gray-600">
                  Chargement des activités...
                </p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-24">
                <Search
                  className={`mx-auto w-16 h-16 text-[${accentColor}] mb-4`}
                />
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
                    className={`bg-white rounded-2xl shadow-lg border border-[${separatorColor}] overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-xl group`}
                  >
                    {/* Image avec badges */}
                    <div className="relative overflow-hidden">
                      <img
                        src={activity.image}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={activity.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      {/* Badge catégorie */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-lg text-xs flex items-center gap-2 font-medium">
                        {(activity.category?.icon &&
                          iconMap[activity.category.icon]) ?? (
                          <Star className="w-3 h-3" />
                        )}
                        {activity.category?.name || "Activité"}
                      </div>
                      {/* Badge niveau */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg text-xs font-semibold">
                        {activity.level}
                      </div>
                      {/* Badge prix */}
                      
                      <div
                        className={`absolute bottom-4 left-4 px-3 py-2 bg-gradient-to-r from-[${accentColor}]/90 to-[${THEME_COLORS["primary-dark"]}]/90 backdrop-blur-md text-white rounded-lg text-sm font-bold`}
                      >
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
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[${accentColor}] transition-colors">
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
                          {activity.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {activity.minParticipants}-{activity.maxParticipants}{" "}
                          pers.
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {getNextAvailableDate(activity)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {activity.description}
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
                                    <Star
                                      className={`w-4 h-4 text-[${accentColor}] mt-0.5 flex-shrink-0`}
                                    />
                                    <span className="text-xs text-gray-600">
                                      {highlight}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                      {/* Section détaillée (FAQ) */}
                      {openFAQ === activity.id && (
                        <div className="mb-4 transition-all duration-300 animate-fadeIn">
                          <div className="space-y-4">
                            {/* Inclus */}
                            {activity.included &&
                              activity.included.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                    Inclus :
                                  </h4>
                                  <ul className="grid grid-cols-2 gap-2">
                                    {activity.included.map((item, i) => (
                                      <li
                                        key={i}
                                        className="flex items-center gap-2"
                                      >
                                        <div
                                          className={`w-1.5 h-1.5 rounded-full bg-[${accentColor}]`}
                                        ></div>
                                        <span className="text-xs text-gray-600">
                                          {item}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                            {/* Guide */}
                            {activity.guide && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                  Votre guide :
                                </h4>
                                <div className="flex items-center gap-3">
                                  {activity.guide.user?.avatar ? (
                                    <img
                                      src={activity.guide.user.avatar}
                                      alt="Guide"
                                      className="w-10 h-10 rounded-full"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-600 font-semibold">
                                        {activity.guide.user?.firstName?.charAt(
                                          0,
                                        )}
                                        {activity.guide.user?.lastName?.charAt(
                                          0,
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {activity.guide.user?.firstName}{" "}
                                      {activity.guide.user?.lastName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-gray-600 ml-1">
                                          {activity.guide.rating.toFixed(1)}
                                        </span>
                                      </div>
                                      {activity.guide.experience && (
                                        <span className="text-xs text-gray-500">
                                          • {activity.guide.experience} ans
                                          d'expérience
                                        </span>
                                      )}
                                    </div>
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
                          className={`flex items-center gap-2 text-[${accentColor}] font-semibold text-sm transition hover:text-[${THEME_COLORS["primary-dark"]}] hover:gap-3`}
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
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r ${defaultGradient} text-white hover:opacity-90 hover:shadow-lg`}
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
          }}
        />
      )}
    </div>
  );
};

export default ActivitesLoisirsFAQ;