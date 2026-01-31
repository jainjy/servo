import React from "react";
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  Shield,
  AlertCircle,
} from "lucide-react";

const ActivityCardAdmin = ({
  activity,
  user,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "draft":
        return "Brouillon";
      case "inactive":
        return "Inactive";
      case "archived":
        return "Archivée";
      default:
        return "Inconnu";
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image et badges */}
      <div className="relative h-48 overflow-hidden">
        {activity.mainImage ? (
          <img
            src={activity.mainImage}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center text-blue-600">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-medium">
                {activity.category?.name || "Activité"}
              </div>
            </div>
          </div>
        )}

        {/* Badges superposés */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(activity.status)}`}
          >
            {getStatusLabel(activity.status)}
          </span>

          {activity.featured && (
            <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
              <Star className="w-3 h-3 inline mr-1" />
              Vedette
            </span>
          )}
        </div>

        {/* Prix */}
        <div className="absolute bottom-2 left-2">
          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="font-bold">{activity.price || 0}€</span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          {activity.bookingCount > 0 && (
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs">
              <Calendar className="w-3 h-3 inline mr-1" />
              {activity.bookingCount}
            </div>
          )}

          {activity.rating > 0 && (
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs">
              <Star className="w-3 h-3 inline mr-1 text-yellow-500" />
              {activity.rating?.toFixed(1)}
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre et catégorie */}
        <div className="mb-3">
          <h3 className="font-bold text-lg line-clamp-1 text-gray-900 mb-1">
            {activity.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              {activity.category?.name && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {activity.category.name}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {user?.role === "professional" && (
                <>
                  <button
                    onClick={() => onEdit(activity)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-blue-50 text-blue-600"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description courte */}
        {activity.shortDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {activity.shortDescription}
          </p>
        )}

        {/* Métadonnées */}
        <div className="space-y-2 mb-4">
          {/* Localisation */}
          {activity.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{activity.location}</span>
            </div>
          )}

          {/* Durée et participants */}
          <div className="grid grid-cols-2 gap-2">
            {activity.duration && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>
                  {activity.duration} {activity.durationType}
                </span>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {activity.minParticipants || 1}-
                {activity.maxParticipants || "∞"} pers.
              </span>
            </div>
          </div>

          {/* Niveau */}
          {activity.level && activity.level !== "all" && (
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
              <span className="capitalize">{activity.level}</span>
            </div>
          )}
        </div>

        {/* Points forts (premiers) */}
        {activity.highlights && activity.highlights.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Points forts :</div>
            <div className="flex flex-wrap gap-1">
              {activity.highlights.slice(0, 2).map((highlight, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-50 text-green-700"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {highlight}
                </span>
              ))}
              {activity.highlights.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{activity.highlights.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(activity)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center text-gray-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Détails
          </button>

          {user?.role === "professional" && (
            <button
              onClick={() =>
                onToggleStatus?.(
                  activity.id,
                  activity.status === "active" ? "draft" : "active",
                )
              }
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                activity.status === "active"
                  ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                  : "bg-green-100 hover:bg-green-200 text-green-700"
              }`}
              title={
                activity.status === "active" ? "Mettre en brouillon" : "Publier"
              }
            >
              {activity.status === "active" ? (
                <>
                  <Shield className="w-4 h-4 mr-1 inline" />
                  Brouillon
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-1 inline" />
                  Publier
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCardAdmin;
