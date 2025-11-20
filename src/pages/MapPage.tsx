import React, { useEffect, useState, useCallback } from "react";
import { Users, Home, MapPin, Search, X, Loader } from "lucide-react";
import GenericMap from "../components/GenericMap";
import PointDetailsModal from "../components/PointDetailsModal";
import { MapPoint } from "../types/map";
import { MapService } from "../services/mapService";
import { useNavigate } from "react-router-dom";

const MapPage: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
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
    setSelectedPoint(point);
  };

  const handleCloseModal = () => {
    setSelectedPoint(null);
  };

  const handleViewDetails = (point: MapPoint) => {
    handleCloseModal();

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

    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setGeoLoading(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        setError("Impossible d'obtenir votre position");
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleCenterToUserLocation = () => {
    if (!userLocation) {
      setError("Votre position n'est pas disponible. Cliquez sur 'Ma position' d'abord.");
      return;
    }
    // Événement personnalisé pour centrer la carte
    window.dispatchEvent(new CustomEvent('centerMap', { detail: { location: userLocation } }));
  };

  const handleCenterToReunion = () => {
    // Centrer sur la Réunion avec les bonnes coordonnées
    window.dispatchEvent(new CustomEvent('centerMap', { 
      detail: { 
        location: [-21.1351, 55.2471],
        zoom: 10
      } 
    }));
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
          <Loader className="h-12 w-12 border-b-2 border-blue-600 mx-auto animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-bold flex items-center gap-2">
          <X className="h-5 w-5" /> Erreur
        </h3>
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
    <div className="px-4 pt-20">
      {/* En-tête avec statistiques */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Carte des partenaires et propriétés
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Users className="w-3 h-3 text-blue-500 mr-2" />
            Partenaires: {points.filter((p) => p.type === "user").length}
          </div>
          <div className="flex items-center">
            <Home className="w-3 h-3 text-green-500 mr-2" />
            Propriétés: {points.filter((p) => p.type === "property").length}
          </div>
          <div className="flex items-center">
            <MapPin className="w-3 h-3 text-red-500 mr-2" />
            Affichés: {filteredPoints.length} points
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville, adresse, métier..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {filters.searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Boutons de filtre */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange("users")}
                className={`flex-1 min-w-[120px] sm:flex-none px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  filters.users
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Partenaires</span>
                <span className="sm:hidden text-xs">Partenaires</span>
              </button>
              <button
                onClick={() => handleFilterChange("properties")}
                className={`flex-1 min-w-[120px] sm:flex-none px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  filters.properties
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Propriétés</span>
                <span className="sm:hidden text-xs">Propriétés</span>
              </button>
              <button
                onClick={handleGetUserLocation}
                disabled={geoLoading}
                className="flex-1 min-w-[120px] sm:flex-none px-4 py-2 bg-purple-500 text-white rounded-lg border border-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {geoLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline text-sm">Localisation...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">Ma position</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCenterToUserLocation}
                disabled={!userLocation}
                className="px-3 py-2 sm:px-4 bg-indigo-500 text-white rounded-lg border border-indigo-500 hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Centrer sur votre position"
              >
                <MapPin className="h-4 w-4" />
              </button>
              <button
                onClick={handleCenterToReunion}
                className="px-3 py-2 sm:px-4 bg-orange-500 text-white rounded-lg border border-orange-500 hover:bg-orange-600 transition-colors text-sm sm:text-base"
                title="Centrer sur la Réunion"
              >
                🏝️
                <span className="hidden sm:inline ml-1">Réunion</span>
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
      />

      {/* Modal des détails */}
      <PointDetailsModal
        point={selectedPoint}
        onClose={handleCloseModal}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default MapPage;
