import React from "react";
import { Calendar, MapPin, Users, Star, Eye, Edit, Trash2, Clock, Tag, DollarSign } from "lucide-react";
import { EventItem, DiscoveryItem, ActiveTab } from "../types";
import { formatDate, getFillPercentage, getDifficultyIcon, getDifficultyColor } from "../utils";

interface ListViewProps {
  items: (EventItem | DiscoveryItem)[];
  activeTab: ActiveTab;
  onEdit: (item: EventItem | DiscoveryItem) => void;
  onDelete: (id: number) => void;
  onToggleFeatured: (id: number) => void;
}

const ListView: React.FC<ListViewProps> = ({
  items,
  activeTab,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.title}
                    </h3>
                    {item.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star size={12} className="mr-1" />
                        Vedette
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "active" ||
                        item.status === "published"
                          ? "bg-green-100 text-green-800"
                          : item.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : item.status === "completed" ||
                            item.status === "archived"
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor((item as DiscoveryItem).difficulty)}`}>
                        {getDifficultyIcon((item as DiscoveryItem).difficulty)}
                        <span className="ml-1 capitalize">{(item as DiscoveryItem).difficulty}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    {activeTab === "events" ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span className="font-medium">
                            {formatDate((item as EventItem).date)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <Clock size={16} />
                          <span>{(item as EventItem).time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>
                            {(item as EventItem).participants}/
                            {(item as EventItem).capacity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag size={16} />
                          <span>{(item as EventItem).category}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag size={16} />
                          <span>{(item as DiscoveryItem).type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>
                            {(item as DiscoveryItem).duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          <span>
                            {(item as DiscoveryItem).visits} visites
                          </span>
                        </div>
                        {(item as DiscoveryItem).price && (
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} />
                            <span>
                              {(item as DiscoveryItem).price}€/pers
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {activeTab === "discoveries" && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {(item as DiscoveryItem).tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {(item as DiscoveryItem).tags.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            +{(item as DiscoveryItem).tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Revenu et actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Revenu généré
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {(item.revenue || 0).toLocaleString("fr-FR")}€
                    </p>
                    {activeTab === "events" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Prix: {(item as EventItem).price}€/pers
                      </p>
                    )}
                    {activeTab === "discoveries" && (item as DiscoveryItem).rating > 0 && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={`${
                                i < Math.floor((item as DiscoveryItem).rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {(item as DiscoveryItem).rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {activeTab === "events" &&
                    (item as EventItem).capacity > 0 && (
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Remplissage</span>
                          <span>
                            {Math.round(
                              getFillPercentage(
                                (item as EventItem).participants,
                                (item as EventItem).capacity
                              )
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#6B8E23] h-2 rounded-full"
                            style={{
                              width: `${getFillPercentage(
                                (item as EventItem).participants,
                                (item as EventItem).capacity
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5 pt-5 border-t border-gray-100 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {activeTab === "events"
                      ? `Organisateur: ${(item as EventItem).organizer}`
                      : `Max: ${(item as DiscoveryItem).maxVisitors || "Non limité"} personnes`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onToggleFeatured(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      item.featured
                        ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Star size={14} />
                    {item.featured
                      ? "Retirer vedette"
                      : "Mettre en vedette"}
                  </button>

                  <button
                    onClick={() => onEdit(item)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100"
                  >
                    <Edit size={14} />
                    Modifier
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;