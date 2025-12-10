import React, { useEffect, useState, useCallback } from "react";
import { Users, Home, MapPin, Search, X, Loader, TreePalm, Phone, Mail, ChevronDown } from "lucide-react";
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
  const [nearbyPoints, setNearbyPoints] = useState<MapPoint[]>([]);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction pour calculer la distance entre deux points (formule Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fonction pour trouver les points dans un rayon de 5km
  const handleSearch5km = () => {
    if (!userLocation) {
      setError("Vous devez d'abord activer votre géolocalisation");
      return;
    }

    setNearbyLoading(true);
    const [userLat, userLon] = userLocation;
    
    // Filtrer les points à proximité (5km)
    const nearby = points.filter((point) => {
      const distance = calculateDistance(userLat, userLon, point.latitude, point.longitude);
      return distance <= 5;
    }).sort((a, b) => {
      const distA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
      const distB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
      return distA - distB;
    });

    setNearbyPoints(nearby);
    setShowNearbyModal(true);
    setNearbyLoading(false);
  };

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setLoading(true);
        const allPoints = await MapService.getAllMapPoints();
        setPoints(allPoints);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement de la carte";
        setError(errorMessage);
        console.error("Erreur chargement carte:", err);
        // Afficher un message d'erreur sans bloquer l'UI
        setPoints([]);
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
      setError("La géolocalisation n'est pas supportée par votre navigateur. Vous pouvez cliquer sur '5km' pour chercher autour de la Réunion.");
      // Définir une position par défaut (centre de la Réunion)
      setUserLocation([-21.1351, 55.2471]);
      return;
    }

    setGeoLoading(true);
    setError(null);

    // Timeout avec fallback pour la Réunion
    const timeout = setTimeout(() => {
      console.warn("⚠️ Timeout de géolocalisation, utilisation des coordonnées de la Réunion");
      const reunionCoords: [number, number] = [-21.1351, 55.2471];
      setUserLocation(reunionCoords);
      setError("Impossible de déterminer votre position exacte. Recherche autour de la Réunion.");
      setGeoLoading(false);
      
      // Zoom smooth vers Réunion
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('centerMap', { 
          detail: { 
            location: reunionCoords,
            zoom: 12,
            smooth: true
          } 
        }));
      }, 300);
    }, 15000); // 15 secondes

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setGeoLoading(false);
        setError(null);
        
        // Zoom smooth vers la position avec effet de transition
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('centerMap', { 
            detail: { 
              location: [latitude, longitude],
              zoom: 16,
              smooth: true
            } 
          }));
        }, 300);
      },
      (error) => {
        clearTimeout(timeout);
        console.error("Erreur de géolocalisation:", error);
        
        // Fallback sur la Réunion
        const reunionCoords: [number, number] = [-21.1351, 55.2471];
        setUserLocation(reunionCoords);
        
        let errorMessage = "Impossible d'obtenir votre position exacte. Recherche autour de la Réunion.";
        
        // Messages d'erreur plus détaillés
        if (error.code === 1) {
          errorMessage = "Permission refusée. Recherche autour de la Réunion.";
        } else if (error.code === 2) {
          errorMessage = "Position indisponible. Vérifiez votre service de localisation. Recherche autour de la Réunion.";
        } else if (error.code === 3) {
          errorMessage = "Délai d'attente dépassé. Recherche autour de la Réunion.";
        }
        
        setError(errorMessage);
        setGeoLoading(false);
        
        // Zoom smooth vers Réunion
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('centerMap', { 
            detail: { 
              location: reunionCoords,
              zoom: 12,
              smooth: true
            } 
          }));
        }, 300);
      },
      {
        enableHighAccuracy: false,
        timeout: 12000, // Timeout avant le fallback
        maximumAge: 300000, // Accepter une position vieille de 5 minutes
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
      <div className="flex items-center justify-center h-96 mt-20">
        <div className="flex flex-col items-center">
          <img src="/loading.gif" alt="Chargement" />
          <p className="mt-4 text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 pb-5 pt-28">
      {/* En-tête avec statistiques */}
      <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
        <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-[#ffffff]/60'></div>
        <img src="https://i.pinimg.com/1200x/01/2d/ea/012dea65a1f79da54266c118fe39e07e.jpg" className='h-full object-cover w-full' alt="" />
      </div>
      <div className="mb-6">
        <h1 className="text-lg lg:text-3xl pb-8 -tracking-tighter text-center font-bold text-[#556B2F] mb-2">
          Carte des partenaires et propriétés
        </h1>
        {/* Version Desktop */}
        <div className="hidden md:grid grid-cols-2 lg:flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="bg-[#556B2F]/20 backdrop-blur-lg rounded-full px-4 py-1 border border-[#D3D3D3] shadow-lg">
            <div className="flex items-center text-[#556B2F]">
              <Users className="w-4 h-4 text-[#6B8E23] mr-3" />
              <span className="font-medium">Partenaires: </span>
              <span className="ml-2 bg-[#6B8E23]/20 px-2 py-1 text-xs rounded-lg text-[#556B2F] font-bold">
                {points.filter((p) => p.type === "user").length}
              </span>
            </div>
          </div>

          <div className="bg-[#556B2F]/20 backdrop-blur-lg rounded-full px-4 py-1 border border-[#D3D3D3] shadow-lg">
            <div className="flex items-center text-[#6B8E23]">
              <Home className="w-4 h-4 text-[#556B2F] mr-3" />
              <span className="font-medium">Propriétés: </span>
              <span className="ml-2 bg-[#556B2F]/20 px-2 text-xs py-1 rounded-lg text-[#6B8E23] font-bold">
                {points.filter((p) => p.type === "property").length}
              </span>
            </div>
          </div>

          <div className="bg-[#556B2F]/20 col-span-1 backdrop-blur-lg rounded-full px-4 py-1 border border-[#D3D3D3] shadow-lg">
            <div className="flex items-center text-[#8B4513]">
              <MapPin className="w-4 h-4 text-[#8B4513] mr-3" />
              <span className="font-medium">Affichés: </span>
              <span className="ml-2 bg-[#8B4513]/20 text-xs px-2 py-1 rounded-lg text-[#8B4513] font-bold">
                {filteredPoints.length} points
              </span>
            </div>
          </div>
        </div>

        {/* Version Mobile */}
        <div className="md:hidden flex justify-between items-center px-4 py-3">
          <div className="flex items-center text-[#556B2F] text-sm">
            <Users className="w-4 h-4 text-[#6B8E23] mr-2" />
            <span className="font-bold">{points.filter((p) => p.type === "user").length}</span>
          </div>

          <div className="flex items-center text-[#6B8E23] text-sm">
            <Home className="w-4 h-4 text-[#556B2F] mr-2" />
            <span className="font-bold">{points.filter((p) => p.type === "property").length}</span>
          </div>

          <div className="flex items-center text-[#8B4513] text-sm">
            <MapPin className="w-4 h-4 text-[#8B4513] mr-2" />
            <span className="font-bold">{filteredPoints.length}</span>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#D3D3D3] p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#556B2F] h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville, adresse, métier..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-[#D3D3D3] rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23]"
              />
              {filters.searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B4513] hover:text-[#556B2F]"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Boutons de filtre */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange("users")}
                className={`flex-1 min-w-[120px] sm:flex-none px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${filters.users
                  ? "bg-[#556B2F] text-white border-[#556B2F]"
                  : "bg-white text-[#556B2F] border-[#D3D3D3] hover:bg-[#556B2F]/10"
                  }`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Partenaires</span>
                <span className="sm:hidden text-xs">Partenaires</span>
              </button>
              <button
                onClick={() => handleFilterChange("properties")}
                className={`flex-1 min-w-[120px] sm:flex-none px-4 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${filters.properties
                  ? "bg-[#6B8E23] text-white border-[#6B8E23]"
                  : "bg-white text-[#6B8E23] border-[#D3D3D3] hover:bg-[#6B8E23]/10"
                  }`}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Propriétés</span>
                <span className="sm:hidden text-xs">Propriétés</span>
              </button>
              <button
                onClick={handleGetUserLocation}
                disabled={geoLoading}
                className="flex-1 min-w-[120px] sm:flex-none px-4 py-2 bg-[#8B4513] text-white rounded-lg border border-[#8B4513] hover:bg-[#6B8E23] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-3 py-2 sm:px-4 bg-[#556B2F] text-white rounded-lg border border-[#556B2F] hover:bg-[#6B8E23] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Centrer sur votre position"
              >
                <MapPin className="h-4 w-4" />
              </button>
              <button
                onClick={handleCenterToReunion}
                className="px-3 py-2 flex sm:px-4 bg-[#6B8E23] text-white rounded-lg border border-[#6B8E23] hover:bg-[#556B2F] transition-colors text-sm sm:text-base"
                title="Centrer sur la Réunion"
              >
                <TreePalm className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Réunion</span>
              </button>
              <button
                onClick={handleSearch5km}
                disabled={!userLocation || nearbyLoading}
                className="px-3 py-2 flex sm:px-4 bg-[#8B4513] text-white rounded-lg border border-[#8B4513] hover:bg-[#6B8E23] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                title="Chercher 5 km autour de moi"
              >
                {nearbyLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline ml-1">Recherche...</span>
                  </>
                ) : userLocation ? (
                  "5km ✓"
                ) : (
                  "5km"
                )}
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
        className="rounded-lg shadow-lg border border-[#D3D3D3]"
        onPointClick={handlePointClick}
      />

      {/* Message si erreur lors du chargement des données */}
      {error && (
        <div className="mt-4 p-4 bg-[#8B4513]/10 border border-[#8B4513] rounded-lg">
          <p className="text-[#8B4513]">
            <span className="font-bold">⚠️ Attention :</span> {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#6B8E23] transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Modal des détails */}
      <PointDetailsModal
        point={selectedPoint}
        onClose={handleCloseModal}
        onViewDetails={handleViewDetails}
      />

      {/* Modal des résultats 5km */}
      {showNearbyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#556B2F]/60">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-[#D3D3D3]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#556B2F] to-[#6B8E23] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <div>
                  <h2 className="text-white font-bold">Points à proximité (5 km)</h2>
                  <p className="text-[#D3D3D3] text-sm">{nearbyPoints.length} résultat{nearbyPoints.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setShowNearbyModal(false)}
                className="text-white hover:bg-[#556B2F]/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto">
              {nearbyPoints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <MapPin className="w-12 h-12 text-[#D3D3D3] mb-3" />
                  <p className="text-[#8B4513] text-center">Aucun point trouvé dans un rayon de 5 km</p>
                </div>
              ) : (
                <div className="divide-y divide-[#D3D3D3]">
                  {nearbyPoints.map((point, index) => {
                    const distance = calculateDistance(
                      userLocation![0],
                      userLocation![1],
                      point.latitude,
                      point.longitude
                    );
                    return (
                      <div
                        key={point.id}
                        className="p-4 hover:bg-[#556B2F]/10 transition-colors cursor-pointer"
                        onClick={() => {
                          setShowNearbyModal(false);
                          handleViewDetails(point);
                        }}
                      >
                        <div className="flex gap-4">
                          {/* Numéro de rang */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#556B2F]/10 flex items-center justify-center">
                            <span className="text-[#556B2F] font-bold text-sm">{index + 1}</span>
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-[#8B4513] truncate">{point.name}</h3>
                              <span className="flex-shrink-0 px-2 py-1 bg-[#D3D3D3] text-[#556B2F] text-xs font-semibold rounded">
                                {distance.toFixed(1)} km
                              </span>
                            </div>

                            {/* Type et ville */}
                            <div className="flex items-center gap-2 text-sm text-[#8B4513] mb-2">
                              <span className="inline-block px-2 py-1 bg-[#8B4513]/10 rounded text-xs font-medium">
                                {point.type === "user" ? "Partenaire" : "Propriété"}
                              </span>
                              {point.city && (
                                <>
                                  <span>•</span>
                                  <span>{point.city}</span>
                                </>
                              )}
                            </div>

                            {/* Description */}
                            {point.type === "user" && point.metiers && point.metiers.length > 0 && (
                              <p className="text-xs text-[#6B8E23] mb-2 line-clamp-1">
                                {point.metiers.join(", ")}
                              </p>
                            )}

                            {/* Coordonnées */}
                            <div className="flex flex-wrap gap-3 text-xs">
                              {point.type === "user" && (
                                <>
                                  {point.phone && (
                                    <a
                                      href={`tel:${point.phone}`}
                                      className="flex items-center gap-1 text-[#556B2F] hover:text-[#6B8E23]"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Phone className="w-3 h-3" />
                                      {point.phone}
                                    </a>
                                  )}
                                  {point.email && (
                                    <a
                                      href={`mailto:${point.email}`}
                                      className="flex items-center gap-1 text-[#556B2F] hover:text-[#6B8E23]"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Mail className="w-3 h-3" />
                                      {point.email}
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0 text-[#D3D3D3]">
                            <ChevronDown className="w-5 h-5 rotate-180" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#F8F8F8] px-6 py-3 border-t border-[#D3D3D3] flex items-center justify-between">
              <p className="text-xs text-[#8B4513]">
                Cliquez sur un résultat pour voir les détails
              </p>
              <button
                onClick={() => setShowNearbyModal(false)}
                className="px-4 py-2 bg-[#D3D3D3] hover:bg-[#556B2F]/10 text-[#8B4513] rounded-lg font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
