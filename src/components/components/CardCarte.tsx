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
  Filter
} from "lucide-react";

// Composant pour contrôler la caméra
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Composant pour les marqueurs animés
const AnimatedMarker: React.FC<{
  point: MapPoint;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}> = ({ point, isHovered, isSelected, onClick, onHover }) => {
  const COLORS = {
    primary: "#0A2F1F",
    primaryLight: "#1E4C2F",
  };

  const createMapPinIcon = (type: string, isHovered: boolean, isSelected: boolean) => {
    const color = type === 'user' ? COLORS.primary : COLORS.primaryLight;
    const size = isSelected ? 40 : isHovered ? 32 : 24;
    
    return divIcon({
      html: `
        <div class="relative transition-all duration-300 ease-out" style="transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'}; filter: drop-shadow(0 ${isSelected ? '8px' : '4px'} 12px rgba(0,0,0,0.2));">
          <svg width="${size}" height="${size * 1.25}" viewBox="0 0 24 30" fill="${color}" stroke="white" stroke-width="1.5" style="transition: all 0.3s;">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-2 h-2 bg-white rounded-full ${isSelected ? 'animate-ping' : ''}"></div>
          ${isSelected ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>' : ''}
        </div>
      `,
      iconSize: [size, size * 1.25],
      iconAnchor: [size / 2, size * 1.25],
      popupAnchor: [0, -size * 1.25],
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
        <Popup closeButton={false} className="custom-popup">
          <div className="p-2 min-w-[200px]">
            <h3 className="font-medium text-sm">{point.name}</h3>
            <p className="text-xs text-gray-500">{point.city}</p>
            <p className="text-xs mt-1">{point.description}</p>
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
  const [filterType, setFilterType] = useState<'all' | 'partner' | 'property'>('all');
  const [center] = useState<[number, number]>([-21.1351, 55.2471]);
  const [zoom, setZoom] = useState<number>(10);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [map, setMap] = useState<any>(null);

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

  const partnerPoints = useMemo(() => points.filter(p => p.type === "user"), [points]);
  const propertyPoints = useMemo(() => points.filter(p => p.type === "property"), [points]);
  
  const filteredPoints = useMemo(() => {
    let filtered = filterType === 'all' ? points : filterType === 'partner' ? partnerPoints : propertyPoints;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [points, partnerPoints, propertyPoints, filterType, searchTerm]);

  const handlePointClick = useCallback((point: MapPoint) => {
    setSelectedPoint(point);
    setCenter([point.latitude, point.longitude]);
    setZoom(14);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 1, 18));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 1, 6));
  }, []);

  const handleResetView = useCallback(() => {
    setCenter([-21.1351, 55.2471]);
    setZoom(10);
    setSelectedPoint(null);
  }, []);

  const handleFlyToLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(15);
        },
        (error) => console.error("Erreur de géolocalisation:", error)
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-100">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-100 border-t-[#0A2F1F] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#0A2F1F]/60 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 font-light">
            Chargement de la carte interactive...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full pt-8 bg-white">
      <div className="pl-6 pr-5">
        {/* HEADER avec recherche interactive */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4"
        >
          <div>
            <h2 className="text-xl font-medium text-[#222222] tracking-tight">
              Explorez notre réseau interactif
            </h2>
            <p className="text-xs text-[#717171]">
              {filteredPoints.length} points d'intérêt affichés sur {points.length} au total
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Barre de recherche */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 pl-8 text-xs border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#0A2F1F] transition-colors"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#717171]" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2.5"
                >
                  <X className="h-3.5 w-3.5 text-[#717171] hover:text-[#222222]" />
                </button>
              )}
            </div>

            {/* Bouton filtre */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-[#DDDDDD] rounded-lg hover:border-[#0A2F1F] transition-colors relative"
            >
              <Filter className="h-4 w-4 text-[#222222]" />
              {filterType !== 'all' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#0A2F1F] rounded-full"></span>
              )}
            </button>

            {/* Bouton vue complète */}
            <motion.a
              href="/carte"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#DDDDDD] rounded-lg text-xs font-medium text-[#222222] hover:border-[#0A2F1F] transition-all"
            >
              <span>Plein écran</span>
              <ExternalLink className="h-3 w-3" />
            </motion.a>
          </div>
        </motion.div>

        {/* Filtres déroulants */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-[#F7F7F7] rounded-lg p-3 flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium text-[#222222]">Filtres rapides:</span>
                {[
                  { key: 'all', label: 'Tous', icon: MapPin, count: points.length },
                  { key: 'partner', label: 'Professionnels', icon: Briefcase, count: partnerPoints.length },
                  { key: 'property', label: 'Biens', icon: Home, count: propertyPoints.length }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key as any)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all
                      ${filterType === filter.key 
                        ? 'bg-[#0A2F1F] text-white' 
                        : 'bg-white text-[#222222] hover:bg-gray-100 border border-[#DDDDDD]'
                      }
                    `}
                  >
                    <filter.icon className="h-3 w-3" />
                    <span>{filter.label}</span>
                    <span className={`text-[10px] ${filterType === filter.key ? 'text-white/70' : 'text-[#717171]'}`}>
                      ({filter.count})
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CARTE PRINCIPALE - Pleine largeur */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full"
        >
          <div className="relative h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg border border-[#DDDDDD] bg-[#F7F7F7]">
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
                  
                  <TileLayer
                    attribution=''
                    url={mapStyle === 'light' 
                      ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    }
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

                {/* Contrôles interactifs */}
                <div className="absolute top-3 left-3 z-40 flex flex-col gap-2">
                  {/* Style de carte */}
                  <button
                    onClick={() => setMapStyle(prev => prev === 'light' ? 'dark' : 'light')}
                    className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-[#DDDDDD]"
                    title="Changer le style"
                  >
                    <Layers className="h-4 w-4 text-[#222222]" />
                  </button>
                </div>

                {/* Contrôles de zoom */}
                <div className="absolute top-3 right-3 z-40 flex flex-col gap-1">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-white rounded-t-lg hover:bg-gray-50 transition-colors border border-[#DDDDDD]"
                    title="Zoom avant"
                  >
                    <ZoomIn className="h-4 w-4 text-[#222222]" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-white hover:bg-gray-50 transition-colors border-x border-[#DDDDDD]"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="h-4 w-4 text-[#222222]" />
                  </button>
                  <button
                    onClick={handleResetView}
                    className="p-2 bg-white rounded-b-lg hover:bg-gray-50 transition-colors border border-[#DDDDDD]"
                    title="Réinitialiser la vue"
                  >
                    <Compass className="h-4 w-4 text-[#222222]" />
                  </button>
                </div>

                {/* Géolocalisation */}
                <button
                  onClick={handleFlyToLocation}
                  className="absolute bottom-3 right-3 z-40 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-[#DDDDDD]"
                  title="Me localiser"
                >
                  <Navigation className="h-4 w-4 text-[#222222]" />
                </button>

                {/* Légende interactive */}
                <div className="absolute bottom-3 left-3 z-40 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 border border-[#DDDDDD]">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-[#0A2F1F] rounded-full"></div>
                      <span>Pros ({partnerPoints.length})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-[#1E4C2F] rounded-full"></div>
                      <span>Biens ({propertyPoints.length})</span>
                    </div>
                  </div>
                </div>

                {/* Infobulle au survol */}
                <AnimatePresence>
                  {hoveredPoint && !selectedPoint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg border border-[#DDDDDD] p-2"
                    >
                      <p className="text-xs font-medium">
                        {points.find(p => p.id === hoveredPoint)?.name}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Panneau d'information sélectionné */}
                <AnimatePresence>
                  {selectedPoint && (
                    <motion.div
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 300 }}
                      className="absolute top-3 right-16 z-40 w-72 bg-white rounded-lg shadow-xl border border-[#DDDDDD] overflow-hidden"
                    >
                      <div className={`p-3 ${
                        selectedPoint.type === 'user' ? 'bg-[#F0F3E8]' : 'bg-[#E8F0E8]'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              {selectedPoint.type === 'user' ? (
                                <Briefcase className="h-5 w-5 text-[#0A2F1F]" />
                              ) : (
                                <Home className="h-5 w-5 text-[#1E4C2F]" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-[#222222]">
                                {selectedPoint.name}
                              </h3>
                              <p className="text-xs text-[#717171]">
                                {selectedPoint.city}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedPoint(null)}
                            className="text-[#717171] hover:text-[#222222]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-3 space-y-2">
                        <p className="text-xs text-[#222222]">
                          {selectedPoint.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-[10px] text-[#717171]">
                          <MapPin className="h-3 w-3" />
                          <span>{selectedPoint.address}</span>
                        </div>
                        
                        {selectedPoint.type === 'user' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#0A2F1F]/10 text-[#0A2F1F] px-2 py-1 rounded-full">
                              Partenaire certifié
                            </span>
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              4.9
                            </span>
                          </div>
                        )}
                        
                        {selectedPoint.type === 'property' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#1E4C2F]/10 text-[#1E4C2F] px-2 py-1 rounded-full">
                              Disponible
                            </span>
                            <span className="text-[10px] font-medium">
                              {selectedPoint.price} €
                            </span>
                          </div>
                        )}
                        
                        <button className="w-full mt-2 px-3 py-2 bg-[#0A2F1F] text-white text-xs rounded-lg hover:bg-[#1E4C2F] transition-colors flex items-center justify-center gap-1">
                          <span>Voir les détails</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6">
                <MapPin className="w-8 h-8 text-[#DDDDDD] mb-2" />
                <p className="text-xs text-[#717171]">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Barre d'information interactive */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center justify-between bg-[#F7F7F7] rounded-lg p-3"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C6A43F]" />
              <span className="text-xs text-[#222222]">
                {filteredPoints.length} points sur la carte
              </span>
            </div>
            
            <div className="h-4 w-px bg-[#DDDDDD]"></div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#0A2F1F] rounded-full animate-pulse"></div>
                <span className="text-[10px] text-[#717171]">{partnerPoints.length} pros</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#1E4C2F] rounded-full animate-pulse"></div>
                <span className="text-[10px] text-[#717171]">{propertyPoints.length} biens</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#717171]">
              Zoom: {zoom}x
            </span>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-[10px] text-[#0A2F1F] hover:underline"
            >
              Réinitialiser
            </button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </section>
  );
};

export default CardCarte;