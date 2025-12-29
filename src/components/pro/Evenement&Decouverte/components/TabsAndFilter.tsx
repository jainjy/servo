import React from "react";
import { Calendar, MapPin, Search } from "lucide-react";
import { ActiveTab, ViewMode, FilterStatus } from "../types";

interface TabsAndFiltersProps {
  activeTab: ActiveTab;
  viewMode: ViewMode;
  searchTerm: string;
  filterStatus: FilterStatus;
  eventsCount: number;
  discoveriesCount: number;
  onTabChange: (tab: ActiveTab) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (term: string) => void;
  onFilterChange: (status: FilterStatus) => void;
}

const TabsAndFilters: React.FC<TabsAndFiltersProps> = ({
  activeTab,
  viewMode,
  searchTerm,
  filterStatus,
  eventsCount,
  discoveriesCount,
  onTabChange,
  onViewModeChange,
  onSearchChange,
  onFilterChange,
}) => {
  const statusOptions = activeTab === "events" 
    ? [
        { value: "all", label: "Tous les statuts" },
        { value: "active", label: "Actif" },
        { value: "upcoming", label: "À venir" },
        { value: "draft", label: "Brouillon" },
        { value: "completed", label: "Terminé" },
      ]
    : [
        { value: "all", label: "Tous les statuts" },
        { value: "published", label: "Publié" },
        { value: "draft", label: "Brouillon" },
        { value: "archived", label: "Archivé" },
      ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
          {/* Onglets */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => onTabChange("events")}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === "events"
                  ? "bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar size={18} />
              Événements ({eventsCount})
            </button>
            <button
              onClick={() => onTabChange("discoveries")}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === "discoveries"
                  ? "bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MapPin size={18} />
              Découvertes ({discoveriesCount})
            </button>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3">
            {/* Barre de recherche */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par titre, description, tags..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent w-full md:w-64"
              />
            </div>

            {/* Sélecteur de statut */}
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent bg-white min-w-[180px]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Toggle de vue */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" 
                    ? "bg-white shadow text-[#6B8E23]" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Vue liste"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" 
                    ? "bg-white shadow text-[#6B8E23]" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Vue grille"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabsAndFilters;