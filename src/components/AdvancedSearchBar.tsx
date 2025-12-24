// components/AdvancedSearchBar.tsx
import React, { useState } from "react";
import { Search, Filter, MapPin, Calendar, ChevronDown, X, Loader2 } from "lucide-react";

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  minPrice: number | "";
  maxPrice: number | "";
  rating: number | "";
  availableDates: {
    start: string;
    end: string;
  };
  metiers: string[];
}

interface AdvancedSearchBarProps {
  onSearch: (filters: SearchFilters) => Promise<any> | void;
  categories: string[];
  metiers: string[];
  defaultFilters?: Partial<SearchFilters>;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onSearch,
  categories,
  metiers,
  defaultFilters = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    availableDates: {
      start: "",
      end: "",
    },
    metiers: [],
    ...defaultFilters,
  });

  const [selectedMetiers, setSelectedMetiers] = useState<string[]>(
    defaultFilters.metiers || []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      availableDates: {
        ...prev.availableDates,
        [name]: value,
      },
    }));
  };

  const toggleMetier = (metier: string) => {
    const newMetiers = selectedMetiers.includes(metier)
      ? selectedMetiers.filter((m) => m !== metier)
      : [...selectedMetiers, metier];

    setSelectedMetiers(newMetiers);
    setFilters((prev) => ({
      ...prev,
      metiers: newMetiers,
    }));
  };

  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSearching(true);
      await onSearch({ ...filters, metiers: selectedMetiers });
    } catch (err) {
      console.error("AdvancedSearchBar onSearch error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const resetFilters = () => {
    const resetState: SearchFilters = {
      query: "",
      category: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      availableDates: {
        start: "",
        end: "",
      },
      metiers: [],
    };
    setFilters(resetState);
    setSelectedMetiers([]);
    onSearch(resetState);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#D3D3D3] p-4">
      <form onSubmit={handleSubmit}>
        {/* Barre de recherche principale */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="query"
                value={filters.query}
                onChange={handleInputChange}
                placeholder="Que recherchez-vous ? (plombier, électricien, jardinier...)"
                disabled={isSearching}
                className={"w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent " + (isSearching ? "opacity-70 cursor-wait" : "")}
                aria-busy={isSearching}
              />
            </div>
          </div>

          <div className="flex gap-2">

            <button
              type="submit"
              disabled={isSearching}
              className={"px-6 py-3 rounded-lg transition-colors font-semibold " + (isSearching ? "bg-[#6B8E23] text-white opacity-70 cursor-wait" : "bg-[#556B2F] text-white hover:bg-[#6B8E23]")}
              aria-busy={isSearching}
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recherche...
                </span>
              ) : (
                "Rechercher"
              )}
            </button>
          </div>
        </div>

        {/* Filtres avancés (expandable) */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Localisation
                </label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleInputChange}
                  placeholder="Ville, code postal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#556B2F]"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#556B2F]"
                >
                  <option value="">Toutes catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prix (€)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#556B2F]"
                  />
                  <span className="self-center">-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>
              </div>

              {/* Note minimale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note minimale
                </label>
                <select
                  name="rating"
                  value={filters.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#556B2F]"
                >
                  <option value="">Toutes notes</option>
                  {[4, 4.5, 4.7, 4.8, 4.9, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} ⭐ et plus
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates de disponibilité */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Disponibilité
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="start"
                    value={filters.availableDates.start}
                    onChange={handleDateChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#556B2F]"
                  />
                  <input
                    type="date"
                    name="end"
                    value={filters.availableDates.end}
                    onChange={handleDateChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#556B2F]"
                  />
                </div>
              </div>

              {/* Métiers */}
              {metiers.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Métiers
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {metiers.map((metier) => (
                      <button
                        key={metier}
                        type="button"
                        onClick={() => toggleMetier(metier)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedMetiers.includes(metier)
                            ? "bg-[#556B2F] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {metier}
                        {selectedMetiers.includes(metier) && (
                          <X className="inline w-3 h-3 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions des filtres */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Réinitialiser tous les filtres
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#556B2F] text-white rounded-lg hover:bg-[#6B8E23] transition-colors font-semibold"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Badges des filtres actifs */}
        {(filters.category ||
          filters.location ||
          filters.minPrice ||
          filters.maxPrice ||
          selectedMetiers.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center gap-1 bg-[#556B2F]/10 text-[#556B2F] px-3 py-1 rounded-full text-sm">
                  Catégorie: {filters.category}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, category: "" }))
                    }
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-3 h-3" />
                  {filters.location}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, location: "" }))
                    }
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                  Prix: {filters.minPrice || "0"}€ - {filters.maxPrice || "∞"}€
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: "",
                        maxPrice: "",
                      }))
                    }
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedMetiers.map((metier) => (
                <span
                  key={metier}
                  className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {metier}
                  <button
                    type="button"
                    onClick={() => toggleMetier(metier)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedSearchBar;
