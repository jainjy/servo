import React, { useEffect, useState, useCallback } from "react";
import GenericMap from "../components/GenericMap";
import { MapPoint } from "../types/map";
import { MapService } from "../services/mapService";
import { useNavigate } from "react-router-dom";

const MapPage: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    users: true,
    properties: true,
    searchTerm: "",
  });
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setLoading(true);
        const allPoints = await MapService.getAllMapPoints();
        setPoints(allPoints);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        console.error("Erreur chargement carte:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  // Filtrer les points selon les critères
  useEffect(() => {
    let filtered = points;

    if (!filters.users && !filters.properties) {
      filtered = [];
    } else if (!filters.users || !filters.properties) {
      filtered = points.filter(
        (point) =>
          (filters.users && point.type === "user") ||
          (filters.properties && point.type === "property")
      );
    }

    // Filtre de recherche
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (point) =>
          point.name
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          point.city
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          point.address
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          (point.type === "user" &&
            point.metiers?.some((metier) =>
              metier.toLowerCase().includes(filters.searchTerm.toLowerCase())
            )) ||
          (point.type === "user" &&
            point.services?.some((service) =>
              service.name
                ?.toLowerCase()
                .includes(filters.searchTerm.toLowerCase())
            ))
      );
    }

    setFilteredPoints(filtered);
  }, [points, filters]);

  const handlePointClick = (point: MapPoint) => {
    console.log("Point cliqué:", point);

    // Navigation vers les détails selon le type
    if (point.type === "property") {
      navigate(`/immobilier/${point.id}`);
    } else if (point.type === "user") {
      navigate(`/professional/${point.id}`);
    }
  };

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLoading(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        setError("Impossible d'obtenir votre position");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleFilterChange = (filterType: keyof typeof filters) => {
    if (filterType === "users" || filterType === "properties") {
      setFilters((prev) => ({
        ...prev,
        [filterType]: !prev[filterType],
      }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: "",
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-bold">❌ Erreur</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête avec statistiques */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Carte des utilisateurs et propriétés
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Utilisateurs: {points.filter((p) => p.type === "user").length}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Propriétés: {points.filter((p) => p.type === "property").length}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            Affichés: {filteredPoints.length} points
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher par nom, ville, adresse, métier..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {filters.searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Boutons de filtre */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("users")}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filters.users
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                👥 Professionnels
              </button>
              <button
                onClick={() => handleFilterChange("properties")}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filters.properties
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                🏠 Propriétés
              </button>
              <button
                onClick={handleGetUserLocation}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg border border-purple-500 hover:bg-purple-600 transition-colors"
              >
                📍 Ma position
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <GenericMap
        points={filteredPoints}
        userLocation={userLocation}
        height="600px"
        className="rounded-lg shadow-lg border"
        onPointClick={handlePointClick}
        showRouting={true}
      />
    </div>
  );
};

export default MapPage;
