import React from "react";
import {
  Edit,
  Trash2,
  Users,
  Star,
  Eye,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";
import { EventItem, DiscoveryItem, ActiveTab } from "../types";
import { formatDate, getDifficultyIcon, getDifficultyColor } from "../utils";

interface GridViewProps {
  items: (EventItem | DiscoveryItem)[];
  activeTab: ActiveTab;
  onEdit: (item: EventItem | DiscoveryItem) => void;
  onDelete: (id: number) => void;
  onToggleFeatured: (id: number) => void;
}

const GridView: React.FC<GridViewProps> = ({
  items,
  activeTab,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              {item.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Star size={12} />
                </span>
              )}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === "active" || item.status === "published"
                    ? "bg-green-100 text-green-800"
                    : item.status === "upcoming"
                    ? "bg-blue-100 text-blue-800"
                    : item.status === "completed" || item.status === "archived"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {item.status === "active"
                  ? "Actif"
                  : item.status === "published"
                  ? "Publié"
                  : item.status === "upcoming"
                  ? "À venir"
                  : item.status === "completed"
                  ? "Terminé"
                  : item.status === "archived"
                  ? "Archivé"
                  : "Brouillon"}
              </span>
              {activeTab === "discoveries" && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                    (item as DiscoveryItem).difficulty
                  )}`}
                >
                  {getDifficultyIcon((item as DiscoveryItem).difficulty)}
                </span>
              )}
            </div>
            {activeTab === "events" && (item as EventItem).participants > 0 && (
              <div className="absolute bottom-3 left-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-white text-xs">
                  <Users size={12} />
                  <span>
                    {(item as EventItem).participants}/
                    {(item as EventItem).capacity}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="p-5">
            <h3 className="font-bold text-gray-900 mb-2 truncate">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {item.description}
            </p>

            <div className="space-y-2 mb-6">
              {activeTab === "events" ? (
                <>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate((item as EventItem).date)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={14} className="mr-2 flex-shrink-0" />
                    <span>
                      {(item as EventItem).participants}/
                      {(item as EventItem).capacity}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-2 flex-shrink-0" />
                    <span>{(item as DiscoveryItem).duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Star size={14} className="mr-1 flex-shrink-0" />
                      <span>{(item as DiscoveryItem).rating.toFixed(1)}/5</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye size={14} className="mr-1 flex-shrink-0" />
                      <span>{(item as DiscoveryItem).visits}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tags pour les découvertes */}
            {activeTab === "discoveries" && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {(item as DiscoveryItem).tags
                    .slice(0, 3)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  {(item as DiscoveryItem).tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      +{(item as DiscoveryItem).tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Revenu</p>
                <p className="text-xl font-bold text-gray-900">
                  {(item.revenue || 0).toLocaleString("fr-FR")}€
                </p>
                {(item as DiscoveryItem).price && (
                  <p className="text-xs text-gray-500 mt-1">
                    {(item as DiscoveryItem).price}€/pers
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;
