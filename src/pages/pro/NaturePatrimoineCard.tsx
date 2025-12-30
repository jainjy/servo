import { MapPin, Star, Eye, Edit, Trash2, Mountain, Waves, TreePine, Landmark, Calendar, TrendingUp, Shield } from "lucide-react";
import { useState } from "react";

interface NaturePatrimoineCardProps {
  item: {
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
  };
  onViewDetails: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const typeIcons = {
  nature: TreePine,
  patrimoine: Landmark,
  marine: Waves,
  montagne: Mountain,
  default: TreePine,
};

const typeColors = {
  nature: "bg-green-100 text-green-800 border-green-200",
  patrimoine: "bg-amber-100 text-amber-800 border-amber-200",
  marine: "bg-blue-100 text-blue-800 border-blue-200",
  montagne: "bg-purple-100 text-purple-800 border-purple-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

const categoryLabels: Record<string, string> = {
  lagon: "Lagon",
  foret: "Forêt",
  parc_naturel: "Parc Naturel",
  reserve: "Réserve",
  site_historique: "Site Historique",
  monument: "Monument",
  plage: "Plage",
  cascade: "Cascade",
  volcan: "Volcan",
};

export default function NaturePatrimoineCard({ item, onViewDetails, onEdit, onDelete }: NaturePatrimoineCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const TypeIcon = typeIcons[item.type as keyof typeof typeIcons] || typeIcons.default;
  const typeColor = typeColors[item.type as keyof typeof typeColors] || typeColors.default;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "nature": return "Nature";
      case "patrimoine": return "Patrimoine";
      case "marine": return "Marin";
      case "montagne": return "Montagne";
      default: return "Nature";
    }
  };

  const getCategoryLabel = (category: string) => {
    return categoryLabels[category] || category.replace('_', ' ');
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image section */}
      <div className="relative h-56 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <>
            <img
              src={item.images[currentImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Featured badge */}
            {item.featured && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold">EN VEDETTE</span>
                </div>
              </div>
            )}
            
            {/* Type badge */}
            <div className="absolute top-3 left-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 ${typeColor} rounded-full border backdrop-blur-sm`}>
                <TypeIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {getTypeLabel(item.type)}
                </span>
              </div>
            </div>

            {/* Image indicators */}
            {item.images && item.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white w-4"
                        : "bg-white/60 hover:bg-white/90"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <TypeIcon className="w-20 h-20 text-green-600 opacity-30 mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Aucune image</span>
            </div>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-5">
        {/* Title and rating */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
            {item.title}
          </h3>
          
          {item.rating !== undefined && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{item.rating.toFixed(1)}</span>
              {item.reviewCount && (
                <span className="text-xs text-gray-500">({item.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm truncate">{item.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {item.altitude && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <Mountain className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-xs text-gray-500">Altitude</div>
                <div className="font-semibold text-gray-900">{item.altitude}</div>
              </div>
            </div>
          )}
          
          {item.year && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-xs text-gray-500">Année</div>
                <div className="font-semibold text-gray-900">{item.year}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <div>
              <div className="text-xs text-gray-500">Catégorie</div>
              <div className="font-semibold text-gray-900">{getCategoryLabel(item.category)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
            <Shield className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-xs text-gray-500">Statut</div>
              <div className={`font-semibold ${item.available !== false ? 'text-green-600' : 'text-red-600'}`}>
                {item.available !== false ? 'Disponible' : 'Fermé'}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(item)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span className="font-medium">Voir détails</span>
          </button>

          <div className="flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 hover:scale-110 active:scale-95"
              title="Modifier"
            >
              <Edit className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => onDelete(item.id)}
              className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 hover:scale-110 active:scale-95"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}