import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapService } from "../../services/mapService";
import { MapPoint } from "../../types/map";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Home,
  Star,
  Building2,
  Navigation,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Shield,
  Heart,
  ExternalLink,
  Briefcase,
  Award,
  CheckCircle,
  X,
  ZoomIn,
  ZoomOut,
  Compass,
  Layers,
  Search,
  Filter,
  Hotel,
  Landmark,
  TreePine,
  Utensils,
  Camera,
  Info,
  Satellite
} from "lucide-react";
import { useNavigate } from "react-router";

// Composant pour contrôler la caméra
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Composant pour les marqueurs - Style avec couleurs vertes sur satellite
const AnimatedMarker: React.FC<{
  point: MapPoint;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}> = ({ point, isHovered, isSelected, onClick, onHover }) => {
  // Palette de verts pour les marqueurs
  const COLORS = {
    user: "#2E7D32", // Vert foncé pour les pros
    property: "#4CAF50", // Vert moyen pour les biens
    attraction: "#81C784", // Vert clair pour les attractions
    restaurant: "#66BB6A", // Vert sauge pour les restaurants
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'user': return '🏢';
      case 'property': return '🏠';
      case 'attraction': return '🗿';
      case 'restaurant': return '🍽️';
      default: return '📍';
    }
  };

  const createMapPinIcon = (type: string, isHovered: boolean, isSelected: boolean) => {
    const color = COLORS[type as keyof typeof COLORS] || "#2E7D32";
    const size = isSelected ? 48 : isHovered ? 40 : 32;
    const icon = getIconByType(type);

    return divIcon({
      html: `
        <div class="relative transition-all duration-300 ease-out" style="transform: ${isSelected ? 'scale(1.2) translateY(-4px)' : 'scale(1)'}; filter: drop-shadow(0 ${isSelected ? '12px' : '8px'} 12px rgba(0,0,0,0.3));">
          <!-- Cercle de halo pour meilleure visibilité sur satellite -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${size + 10}px;
            height: ${size + 10}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            backdrop-filter: blur(2px);
            border: 2px solid rgba(255,255,255,0.5);
          "></div>
          
          <!-- Marqueur principal avec contour blanc épais -->
          <div style="
            background: white;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4px solid ${color};
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            position: relative;
            transition: all 0.3s;
          ">
            <span style="font-size: ${size * 0.45}px; line-height: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${icon}</span>
          </div>
          
          ${isSelected ? `
            <div style="
              position: absolute;
              bottom: -12px;
              left: 50%;
              transform: translateX(-50%);
              width: 6px;
              height: 6px;
              background: white;
              border-radius: 50%;
              box-shadow: 0 0 0 3px ${color};
              animation: pulse 1.5s infinite;
            "></div>
          ` : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
      className: `map-marker-icon transition-all duration-300 ${isHovered ? 'z-50' : 'z-40'}`,
    });
  };

  return (
    <Marker
      key={`${point.type}-${point.id}`}
      position={[point.latitude, point.longitude]}
      icon={createMapPinIcon(point.type, isHovered, isSelected)}
      eventHandlers={{
        click: onClick,
        mouseover: () => onHover(point.id),
        mouseout: () => onHover(null),
      }}
    >
      {isSelected && (
        <Popup closeButton={false} className="satellite-popup">
          <div className="p-3 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-lg shadow-sm">
                {getIconByType(point.type)}
              </div>
              <div>
                <h3 className="font-medium text-sm text-[#1B5E20]">{point.name}</h3>
                <p className="text-xs text-[#689F38] flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {point.city}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#33691E] mb-2 leading-relaxed">{point.description}</p>
            <div className="flex items-center justify-between text-[10px] text-[#8BC34A] border-t border-[#DCEDC8] pt-2">
              <span>{point.type === 'user' ? 'Professionnel local' :
                point.type === 'property' ? 'Hébergement' :
                  point.type === 'attraction' ? 'Site naturel' : 'Restaurant'}</span>
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

const CardCarte: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'user' | 'property' | 'attraction' | 'restaurant'>('all');
  const [center, setCenter] = useState<[number, number]>([-21.1351, 55.2471]);
  const [zoom, setZoom] = useState<number>(12);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [map, setMap] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMapReady(true);
  }, []);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setLoading(true);
        const allPoints = await MapService.getAllMapPoints();
        setPoints(allPoints);
      } catch (err) {
        console.error("Erreur chargement carte:", err);
        setPoints([]);
      } finally {
        setLoading(false);
      }
    };
    loadMapData();
  }, []);

  const userPoints = useMemo(() => points.filter(p => p.type === "user"), [points]);
  const propertyPoints = useMemo(() => points.filter(p => p.type === "property"), [points]);
  const attractionPoints = useMemo(() => points.filter(p => p.type === "attraction"), [points]);
  const restaurantPoints = useMemo(() => points.filter(p => p.type === "restaurant"), [points]);

  const filteredPoints = useMemo(() => {
    let filtered = points;
    if (filterType !== 'all') {
      filtered = points.filter(p => p.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [points, filterType, searchTerm]);

  const handlePointClick = useCallback((point: MapPoint) => {
    setSelectedPoint(point);
    setCenter([point.latitude, point.longitude]);
    setZoom(16);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 1, 18));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 1, 6));
  }, []);

  const handleResetView = useCallback(() => {
    setCenter([-21.1351, 55.2471]);
    setZoom(12);
    setSelectedPoint(null);
  }, []);

  const handleFlyToLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(16);
        },
        (error) => console.error("Erreur de géolocalisation:", error)
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-[#F1F8E9] to-[#E8F5E9] rounded-2xl border border-[#DCEDC8]">
          <div className="relative">
            <div className="w-16 h-16 border-3 border-[#DCEDC8] border-t-[#2E7D32] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Satellite className="w-6 h-6 text-[#2E7D32]/60 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-sm text-[#689F38] font-light">
            Chargement de la vue satellite...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-8 bg-gradient-to-b from-[#F1F8E9] to-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h2 className="text-2xl font-light text-[#1B5E20] tracking-tight flex items-center gap-2">
              <Satellite className="h-6 w-6 text-[#4CAF50]" />
              Vue Satellite - La Réunion
            </h2>
            <p className="text-sm text-[#689F38] mt-1">
              {filteredPoints.length} points d'intérêt localisés sur l'île
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Barre de recherche */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Rechercher un lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-sm bg-white border border-[#DCEDC8] rounded-xl focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]/20 transition-all placeholder-[#AED581] text-[#33691E]"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#AED581]" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-[#AED581] hover:text-[#2E7D32] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 bg-white border border-[#DCEDC8] rounded-xl hover:border-[#4CAF50] hover:shadow-md transition-all relative"
            >
              <Filter className="h-5 w-5 text-[#2E7D32]" />
              {filterType !== 'all' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Bouton vue complète */}
            <motion.a
              href="/carte"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] text-white rounded-xl text-sm font-medium hover:bg-[#1B5E20] transition-all shadow-sm"
            >
              <span>Explorer</span>
              <ExternalLink className="h-4 w-4" />
            </motion.a>
          </div>
        </motion.div>

        {/* Filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl p-4 border border-[#DCEDC8] shadow-sm">
                  <span className="text-xs font-medium text-[#689F38] mr-2">Filtrer par :</span>
                  {[
                    { key: 'all', label: 'Tous', icon: Compass, count: points.length },
                    { key: 'user', label: 'Pros', icon: Briefcase, count: userPoints.length },
                    { key: 'property', label: 'Hébergements', icon: Hotel, count: propertyPoints.length },
                    { key: 'attraction', label: 'Sites', icon: TreePine, count: attractionPoints.length },
                    { key: 'restaurant', label: 'Restaurants', icon: Utensils, count: restaurantPoints.length }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setFilterType(filter.key as any)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all
                        ${filterType === filter.key
                          ? 'bg-[#2E7D32] text-white shadow-md'
                          : 'bg-[#F1F8E9] text-[#33691E] hover:bg-[#E8F5E9] border border-[#DCEDC8]'
                        }
                      `}
                    >
                      <filter.icon className="h-4 w-4" />
                      <span>{filter.label}</span>
                      <span className={`text-xs ${filterType === filter.key ? 'text-white/80' : 'text-[#AED581]'}`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CARTE SATELLITE avec marqueurs verts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full"
        >
          <div className="relative h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-xl border border-[#DCEDC8]">
            {isMapReady && points.length > 0 ? (
              <>
                <MapContainer
                  center={center}
                  zoom={zoom}
                  className="h-full w-full"
                  scrollWheelZoom={true}
                  zoomControl={false}
                  ref={setMap}
                  preferCanvas={true}
                >
                  <MapController center={center} zoom={zoom} />

                  {/* Vue Satellite ESRI World Imagery */}
                  <TileLayer
                    attribution=''
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />

                  {/* Overlay transparent pour les noms de lieux */}
                  <TileLayer
                    attribution=''
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    opacity={0.2}
                  />

                  {filteredPoints.map((point) => (
                    <AnimatedMarker
                      key={`${point.type}-${point.id}`}
                      point={point}
                      isHovered={hoveredPoint === point.id}
                      isSelected={selectedPoint?.id === point.id}
                      onClick={() => handlePointClick(point)}
                      onHover={setHoveredPoint}
                    />
                  ))}
                </MapContainer>

                {/* Contrôles */}
                <div className="absolute top-4 right-4 z-40 flex flex-col gap-1 bg-white/90 backdrop-blur-sm rounded-xl border border-[#DCEDC8] overflow-hidden shadow-lg">
                  <button
                    onClick={handleZoomIn}
                    className="p-2.5 hover:bg-[#F1F8E9] transition-colors border-b border-[#DCEDC8]"
                    title="Zoom avant"
                  >
                    <ZoomIn className="h-5 w-5 text-[#2E7D32]" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2.5 hover:bg-[#F1F8E9] transition-colors border-b border-[#DCEDC8]"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="h-5 w-5 text-[#2E7D32]" />
                  </button>
                  <button
                    onClick={handleResetView}
                    className="p-2.5 hover:bg-[#F1F8E9] transition-colors"
                    title="Réinitialiser"
                  >
                    <Compass className="h-5 w-5 text-[#2E7D32]" />
                  </button>
                </div>

                {/* Géolocalisation */}
                <button
                  onClick={handleFlyToLocation}
                  className="absolute bottom-4 right-4 z-40 p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors border border-[#DCEDC8] shadow-lg group"
                  title="Me localiser"
                >
                  <Navigation className="h-5 w-5 text-[#2E7D32] group-hover:text-[#4CAF50] transition-colors" />
                </button>

                {/* Légende avec tons verts */}
                <div className="absolute bottom-4 left-4 z-40 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-[#DCEDC8]">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#1B5E20] mb-2">Légende</p>
                    <div className="grid gap-1.5">
                      {[
                        { color: '#2E7D32', label: 'Pros', count: userPoints.length, icon: Briefcase },
                        { color: '#4CAF50', label: 'Hébergements', count: propertyPoints.length, icon: Hotel },
                        { color: '#81C784', label: 'Sites', count: attractionPoints.length, icon: TreePine },
                        { color: '#66BB6A', label: 'Restos', count: restaurantPoints.length, icon: Utensils }
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-xs">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: item.color }}>
                            <item.icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-[#33691E]">{item.label}</span>
                          <span className="text-[#AED581] ml-auto">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panneau d'information */}
                <AnimatePresence>
                  {selectedPoint && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-96 bg-white rounded-xl shadow-2xl border border-[#DCEDC8] overflow-hidden"
                    >
                      <div className="relative h-32 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]">
                        <button
                          onClick={() => setSelectedPoint(null)}
                          className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                        <div className="absolute bottom-3 left-4 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">
                              {selectedPoint.type === 'user' ? '🏢' :
                                selectedPoint.type === 'property' ? '🏠' :
                                  selectedPoint.type === 'attraction' ? '🗿' : '🍽️'}
                            </span>
                            <h3 className="text-lg font-medium">{selectedPoint.name}</h3>
                          </div>
                          <p className="text-xs text-white/80 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {selectedPoint.city}
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-sm text-[#33691E] leading-relaxed mb-3">
                          {selectedPoint.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-[#689F38] mb-3">
                          <MapPin className="h-3 w-3" />
                          <span>{selectedPoint.address}</span>
                        </div>

                        {selectedPoint.type === 'user' && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded-lg">
                              Professionnel local
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => window.open(`/decouvrir/${selectedPoint.id}`, '_blank')}
                          className="w-full mt-2 px-4 py-3 bg-[#2E7D32] text-white text-sm rounded-xl hover:bg-[#1B5E20] transition-colors flex items-center justify-center gap-2"
                        >
                          <span>Voir les détails</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-[#F1F8E9]">
                <Satellite className="w-12 h-12 text-[#AED581] mb-3" />
                <p className="text-sm text-[#689F38]">Chargement de l'imagerie satellite...</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Barre d'information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto mt-4 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#DCEDC8]"
        >
          <span className="text-xs text-[#689F38]">
            © Esri - World Imagery • {filteredPoints.length} points d'intérêt
          </span>
          <span className="text-xs text-[#689F38]">
            Zoom: {zoom}x
          </span>
        </motion.div>
      </div>

      <style>{`
        .satellite-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          background: white;
          border: 1px solid #DCEDC8;
        }
        .satellite-popup .leaflet-popup-content {
          margin: 0;
          min-width: 220px;
        }
        .satellite-popup .leaflet-popup-tip {
          background: white;
        }
        
        @keyframes pulse {
          0% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.5); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </section>
  );
};

export default CardCarte;