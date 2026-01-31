import React from "react";
import {
  X,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Edit,
  Trash2,
  Tag,
  DollarSign,
  Award,
  Calendar,
  Star,
  Shield,
} from "lucide-react";

interface ActivityCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  category?: ActivityCategory; // Changé de string à ActivityCategory
  userId: string;
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
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    professionalCategory?: string;
    companyName?: string;
  };
  reviews?: Array<{
    rating: number;
  }>;
  _count?: {
    favorites: number;
    bookings: number;
    reviews: number;
  };
}

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  user?: { role: string };
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  isOpen,
  onClose,
  activity,
  user,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !activity) return null;

  const activityName = activity.title || "Activité sans nom";
  const categoryName = activity.category?.name || "Non catégorisée";
  const categoryColor = activity.category?.color || "#6B8E23";

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      onDelete?.(activity.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onClose();
    onEdit?.(activity);
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

  const formatPrice = (price?: number, priceType?: string) => {
    if (!price) return "Sur devis";

    const suffix =
      priceType === "per_person"
        ? "/personne"
        : priceType === "per_group"
          ? "/groupe"
          : priceType === "per_hour"
            ? "/heure"
            : "";

    return `${price.toFixed(2)}€ ${suffix}`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Brouillon";
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "archived":
        return "Archivée";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case "beginner":
        return "Débutant";
      case "intermediate":
        return "Intermédiaire";
      case "advanced":
        return "Avancé";
      case "all":
        return "Tous niveaux";
      default:
        return level || "Non spécifié";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#D3D3D3]">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(activity.status)}`}
                >
                  {getStatusLabel(activity.status)}
                </span>
                {activity.featured && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                    <Star className="w-3 h-3 inline mr-1" />
                    Vedette
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-[#8B4513] mb-2">
                {activityName}
              </h3>

              <div className="flex items-center flex-wrap gap-4">
                {activity.location && (
                  <p className="flex items-center text-[#556B2F]">
                    <MapPin className="w-4 h-4 mr-1" />
                    {activity.location}
                  </p>
                )}

                {activity.category && (
                  <p className="flex items-center text-[#556B2F]">
                    <Tag className="w-4 h-4 mr-1" />
                    <span
                      className="px-2 py-0.5 rounded text-sm font-medium"
                      style={{
                        backgroundColor: `${categoryColor}20`,
                        color: categoryColor,
                      }}
                    >
                      {categoryName}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image principale */}
          {activity.mainImage ? (
            <div className="relative h-72 rounded-xl overflow-hidden">
              <img
                src={activity.mainImage}
                alt={activityName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-72 rounded-xl overflow-hidden bg-gradient-to-br from-[#556B2F] to-[#6B8E23]">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                <div className="text-center">
                  <div className="text-6xl mb-2">🎯</div>
                  <div className="text-xl">{activityName}</div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-[#8B4513]">
              Description
            </h4>
            <p className="text-gray-700 whitespace-pre-line">
              {activity.description}
            </p>

            {activity.shortDescription && (
              <p className="mt-3 text-gray-600 italic">
                {activity.shortDescription}
              </p>
            )}
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Prix */}
            {activity.price !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 mr-2 text-[#6B8E23]" />
                  <div className="text-sm text-[#556B2F]">Prix</div>
                </div>
                <div className="font-semibold text-lg text-[#8B4513]">
                  {formatPrice(activity.price, activity.priceType)}
                </div>
              </div>
            )}

            {/* Durée */}
            {activity.duration && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-[#6B8E23]" />
                  <div className="text-sm text-[#556B2F]">Durée</div>
                </div>
                <div className="font-semibold text-lg text-black">
                  {formatDuration(activity.duration, activity.durationType)}
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 mr-2 text-[#6B8E23]" />
                <div className="text-sm text-[#556B2F]">Participants</div>
              </div>
              <div className="font-semibold text-lg text-black">
                {activity.minParticipants || 1} -{" "}
                {activity.maxParticipants || "∞"} personnes
              </div>
            </div>

            {/* Niveau */}
            {activity.level && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Award className="w-5 h-5 mr-2 text-[#6B8E23]" />
                  <div className="text-sm text-[#556B2F]">Niveau</div>
                </div>
                <div className="font-semibold text-lg text-black">
                  {getLevelLabel(activity.level)}
                </div>
              </div>
            )}

            {/* Note */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 mr-2 text-[#6B8E23]" />
                <div className="text-sm text-[#556B2F]">Note moyenne</div>
              </div>
              <div className="font-semibold text-lg text-black">
                {activity.rating?.toFixed(1) || "Nouveau"} (
                {activity.reviewCount || 0} avis)
              </div>
            </div>

            {/* Créé le */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 mr-2 text-[#6B8E23]" />
                <div className="text-sm text-[#556B2F]">Créée le</div>
              </div>
              <div className="font-semibold text-sm text-black">
                {new Date(activity.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Localisation détaillée */}
          {(activity.address || activity.meetingPoint) && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#8B4513]">
                Localisation détaillée
              </h4>
              <div className="space-y-3">
                {activity.address && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-2 text-[#556B2F] mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Adresse :</div>
                      <div className="text-black">{activity.address}</div>
                    </div>
                  </div>
                )}

                {activity.meetingPoint && (
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 mr-2 text-[#556B2F] mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">
                        Point de rencontre :
                      </div>
                      <div className="text-black">{activity.meetingPoint}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Éléments inclus */}
          {activity.includedItems && activity.includedItems.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#8B4513]">
                Éléments inclus
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activity.includedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-green-50 p-3 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prérequis */}
          {activity.requirements && activity.requirements.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#8B4513]">
                Prérequis / Équipement nécessaire
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activity.requirements.map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-50 p-3 rounded-lg"
                  >
                    <Award className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Points forts */}
          {activity.highlights && activity.highlights.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#8B4513]">
                Points forts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activity.highlights.map((highlight, index) => (
                  <div key={index} className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Star className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="font-medium text-purple-800">
                        Point fort {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informations professionnel */}
          {activity.creator && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="text-lg font-semibold mb-3 text-[#8B4513]">
                Votre professionnel
              </h4>
              <div className="flex items-center">
                {activity.creator.avatar ? (
                  <img
                    src={activity.creator.avatar}
                    alt={`${activity.creator.firstName} ${activity.creator.lastName}`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#6B8E23] flex items-center justify-center text-white font-semibold mr-4">
                    {activity.creator.firstName?.charAt(0)}
                    {activity.creator.lastName?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {activity.creator.firstName} {activity.creator.lastName}
                  </div>
                  {activity.creator.companyName && (
                    <div className="text-sm text-gray-600">
                      {activity.creator.companyName}
                    </div>
                  )}
                  {activity.creator.professionalCategory && (
                    <div className="text-sm text-[#556B2F]">
                      {activity.creator.professionalCategory}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {activity.viewCount || 0}
              </div>
              <div className="text-sm text-gray-600">Vues</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {activity.bookingCount || 0}
              </div>
              <div className="text-sm text-gray-600">Réservations</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {activity._count?.favorites || 0}
              </div>
              <div className="text-sm text-gray-600">Favoris</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {activity._count?.reviews || 0}
              </div>
              <div className="text-sm text-gray-600">Avis</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 border-[#D3D3D3]"
            >
              Fermer
            </button>
            {user?.role === "professional" && (
              <>
                <button
                  onClick={handleEdit}
                  className="flex-1 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 bg-[#6B8E23] hover:bg-[#556B2F]"
                >
                  <Edit className="w-5 h-5 inline mr-2" />
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300"
                >
                  <Trash2 className="w-5 h-5 inline mr-2" />
                  Supprimer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
