import React from 'react';
import { MapPin, Clock, Users, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

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

interface ActivityCardProps {
  activity: Activity;
  user?: { role: string };
  onViewDetails: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  user,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const activityName = activity.name || activity.title || 'Activité sans nom';

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {activity.image ? (
          <img
            src={activity.image}
            alt={activityName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#556B2F] to-[#6B8E23]">
            <div className="text-center text-white">
              <div className="text-5xl mb-2">🎯</div>
              <div className="font-medium">Activité</div>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            activity.isActive === false
              ? 'bg-gray-100 text-gray-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {activity.isActive === false ? 'Inactive' : 'Active'}
          </span>
        </div>
        
        {/* Price Overlay */}
        {activity.price > 0 && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
              <span className="text-xl font-bold">{activity.price}€</span>
              <span className="text-sm opacity-90">/personne</span>
            </div>
          </div>
        )}
        
        {/* Category Icon */}
        {activity.icon && (
          <div className="absolute top-4 right-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: activity.color || '#6B8E23' }}
            >
              <span className="font-bold">{activity.icon.charAt(0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Category */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-xl line-clamp-1 text-[#8B4513]">
              {activityName}
            </h3>
            <div className="flex space-x-2">
              {user?.role === "professional" && (
                <>
                  <button
                    onClick={() => onEdit(activity)}
                    className="p-2 rounded-lg transition-colors bg-[#6B8E23] bg-opacity-15 text-[#6B8E23]"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="p-2 rounded-lg transition-colors bg-[#6B8E23] bg-opacity-15 text-[#6B8E23]"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {activity.category && (
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#6B8E23] bg-opacity-20 text-[#6B8E23]">
                {activity.category}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {activity.description && (
          <p className="text-sm mb-4 line-clamp-2 text-black">
            {activity.description}
          </p>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {activity.location && (
            <div className="flex items-center text-[#556B2F]">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm truncate">{activity.location}</span>
            </div>
          )}
          
          {activity.duration && (
            <div className="flex items-center text-[#556B2F]">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{activity.duration}</span>
            </div>
          )}
          
          {activity.capacity && (
            <div className="flex items-center text-[#556B2F]">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{activity.capacity} pers.</span>
            </div>
          )}
        </div>

        {/* Included Items */}
        {activity.included && activity.included.length > 0 && (
          <div className="mb-6">
            <p className="text-xs mb-2 text-[#556B2F]">Inclus :</p>
            <div className="flex flex-wrap gap-1">
              {activity.included.slice(0, 3).map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-50 text-green-700"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {item}
                </span>
              ))}
              {activity.included.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                  +{activity.included.length - 3} plus
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onViewDetails(activity)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 text-black"
          >
            <Eye className="w-4 h-4 mr-2" />
            Détails
          </button>
          
          {!user?.role && activity.price > 0 && (
            <button className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium text-sm transition-all duration-300">
              Réserver
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;