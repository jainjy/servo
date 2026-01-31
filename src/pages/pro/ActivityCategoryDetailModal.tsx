import React from "react";
import {
  X,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";

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
}

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  user?: { role: string };
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

const ActivityCategoryDetailModal: React.FC<ActivityDetailModalProps> = ({
  isOpen,
  onClose,
  activity,
  user,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !activity) return null;

  const activityName = activity.name || activity.title || "Activité sans nom";

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#D3D3D3]">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-[#8B4513]">
              {activityName}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {activity.location && (
            <p className="flex items-center mt-2 text-[#556B2F]">
              <MapPin className="w-4 h-4 mr-1" />
              {activity.location}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {activity.image ? (
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={activity.image}
                alt={activityName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-[#556B2F] to-[#6B8E23]">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                <div className="text-center">
                  <div className="text-6xl mb-2">🎯</div>
                  <div>Activité</div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {activity.description && (
            <div>
              <h4 className="text-lg font-semibold mb-2 text-[#8B4513]">
                Description
              </h4>
              <p className="text-black">{activity.description}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activity.category && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-[#556B2F]">Catégorie</div>
                <div className="font-semibold text-black">
                  {activity.category}
                </div>
              </div>
            )}

            {activity.price > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-[#556B2F]">Prix</div>
                <div className="font-semibold text-[#6B8E23]">
                  {activity.price}€ / personne
                </div>
              </div>
            )}

            {activity.duration && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <Clock className="w-6 h-6 mb-2 text-[#6B8E23]" />
                <div className="text-sm text-[#556B2F]">Durée</div>
                <div className="font-semibold text-black">
                  {activity.duration}
                </div>
              </div>
            )}

            {activity.capacity && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <Users className="w-6 h-6 mb-2 text-[#6B8E23]" />
                <div className="text-sm text-[#556B2F]">Capacité</div>
                <div className="font-semibold text-black">
                  {activity.capacity} personnes max
                </div>
              </div>
            )}
          </div>

          {/* Included Items */}
          {activity.included && activity.included.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2 text-[#8B4513]">
                Inclus dans l'activité
              </h4>
              <div className="flex flex-wrap gap-2">
                {activity.included.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {activity.requirements && (
            <div>
              <h4 className="text-lg font-semibold mb-2 text-[#8B4513]">
                Prérequis
              </h4>
              <p className="text-black">{activity.requirements}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
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
                  className="flex-1 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 bg-[#6B8E23]"
                >
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300"
                >
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

export default ActivityCategoryDetailModal;
