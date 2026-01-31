import React from 'react';
import { MapPin, Clock, Users, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

interface Category {
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

interface CategoryCardProps {
  category: Category;
  user?: { role: string };
  onViewDetails: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  user,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const categoryName = category.name || category.title || 'Catégorie sans nom';

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={categoryName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#556B2F] to-[#6B8E23]">
            <div className="text-center text-white">
              <div className="text-5xl mb-2">📂</div>
              <div className="font-medium">Catégorie</div>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            category.isActive === false
              ? 'bg-gray-100 text-gray-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {category.isActive === false ? 'Inactive' : 'Active'}
          </span>
        </div>
        
        {/* Price Overlay */}
        {category.price > 0 && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
              <span className="text-xl font-bold">{category.price}€</span>
              <span className="text-sm opacity-90">/personne</span>
            </div>
          </div>
        )}
        
        {/* Category Icon */}
        {category.icon && (
          <div className="absolute top-4 right-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: category.color || '#6B8E23' }}
            >
              <span className="font-bold">{category.icon.charAt(0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Actions */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-xl line-clamp-1 text-[#8B4513]">
              {categoryName}
            </h3>
            <div className="flex space-x-2">
              {user?.role === "professional" && (
                <>
                  <button
                    onClick={() => onEdit(category)}
                    className="p-2 rounded-lg transition-colors bg-[#6B8E23] bg-opacity-15 text-[#6B8E23] hover:bg-opacity-25"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-2 rounded-lg transition-colors bg-[#6B8E23] bg-opacity-15 text-[#6B8E23] hover:bg-opacity-25"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {category.description && (
          <p className="text-sm mb-4 line-clamp-2 text-black">
            {category.description}
          </p>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {category.location && (
            <div className="flex items-center text-[#556B2F]">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm truncate">{category.location}</span>
            </div>
          )}
          
          {category.duration && (
            <div className="flex items-center text-[#556B2F]">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{category.duration}</span>
            </div>
          )}
          
          {category.capacity && (
            <div className="flex items-center text-[#556B2F]">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{category.capacity} pers.</span>
            </div>
          )}
        </div>

        {/* Included Items */}
        {category.included && category.included.length > 0 && (
          <div className="mb-6">
            <p className="text-xs mb-2 text-[#556B2F]">Inclus :</p>
            <div className="flex flex-wrap gap-1">
              {category.included.slice(0, 3).map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-50 text-green-700"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {item}
                </span>
              ))}
              {category.included.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                  +{category.included.length - 3} plus
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onViewDetails(category)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 text-black"
          >
            <Eye className="w-4 h-4 mr-2" />
            Détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;