import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
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
  CheckCircle
} from "lucide-react";

const CardCarte: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'partner' | 'property'>('all');
  const [center] = useState<[number, number]>([-21.1351, 55.2471]);
  const [zoom] = useState<number>(10);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // COULEURS OLIplus - Palette premium
  const COLORS = {
    primary: "#0A2F1F",
    primaryLight: "#1E4C2F",
    primarySoft: "#556B2F",
    accent: "#C6A43F",
    dark: "#1A1E24",
    medium: "#4B5565",
    light: "#9CA3AF",
    background: "#F9FAFB",
    white: "#FFFFFF",
    border: "#E5E7EB",
    hover: "#F3F4F6",
    success: "#10B981",
    warning: "#F59E0B"
  };

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

  const partnerPoints = points.filter(p => p.type === "user");
  const propertyPoints = points.filter(p => p.type === "property");
  
  const filteredPoints = filterType === 'all' 
    ? points 
    : filterType === 'partner' 
      ? partnerPoints 
      : propertyPoints;

  const createMapPinIcon = (type: string, isHovered: boolean = false, isSelected: boolean = false) => {
    let color = type === 'user' ? COLORS.primary : COLORS.primaryLight;
    const size = isSelected ? 32 : isHovered ? 28 : 24;
    
    return divIcon({
      html: `
        <div class="relative transition-all duration-300" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));">
          <svg width="${size}" height="${size * 1.25}" viewBox="0 0 24 30" fill="${color}" stroke="white" stroke-width="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-2 h-2 bg-white rounded-full"></div>
        </div>
      `,
      iconSize: [size, size * 1.25],
      iconAnchor: [size / 2, size * 1.25],
      popupAnchor: [0, -size * 1.25],
      className: 'map-marker-icon transition-all duration-300'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-100">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-100 border-t-[#0A2F1F] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#0A2F1F]/60" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 font-light">
            Chargement de la carte...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full pt-8 bg-white">
      <div className="pl-6 pr-5 ">
        {/* HEADER - Compact et professionnel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-3"
        >
          <div>
            <h2 className="ext-xl font-medium text-[#222222] tracking-tight">
              Explorez notre réseau
            </h2>
            <p className="text-xs text-[#717171]">
              {points.length} professionnels et biens à travers l'île
            </p>
          </div>
          
          <motion.a
            href="/carte"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#DDDDDD] rounded-full text-xs font-medium text-[#222222] hover:border-[#0A2F1F] transition-all shadow-sm"
          >
            <span>Voir complet</span>
            <ExternalLink className="h-3 w-3" />
          </motion.a>
        </motion.div>

        {/* GRILLE PRINCIPALE - Format compact */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* COLONNE CARTE - Largeur 2/3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative"
          >
            <div className="relative h-[350px] lg:h-[400px] rounded-xl overflow-hidden shadow-md border border-[#DDDDDD] bg-[#F7F7F7]">
              {isMapReady && points.length > 0 ? (
                <>
                  <MapContainer
                    center={center}
                    zoom={zoom}
                    className="h-full w-full"
                    scrollWheelZoom={false}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution=''
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />

                    {filteredPoints.map((point) => (
                      <Marker
                        key={`${point.type}-${point.id}`}
                        position={[point.latitude, point.longitude]}
                        icon={createMapPinIcon(
                          point.type, 
                          hoveredPoint === point.id,
                          selectedPoint?.id === point.id
                        )}
                        eventHandlers={{
                          click: () => setSelectedPoint(point),
                          mouseover: () => setHoveredPoint(point.id),
                          mouseout: () => setHoveredPoint(null),
                        }}
                      />
                    ))}
                  </MapContainer>

                  {/* Filtres - Compacts */}
                  <div className="absolute top-3 left-3 z-40 flex gap-1.5">
                    {[
                      { key: 'all', label: 'Tous', count: points.length },
                      { key: 'partner', label: 'Pros', count: partnerPoints.length },
                      { key: 'property', label: 'Biens', count: propertyPoints.length }
                    ].map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setFilterType(filter.key as any)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-medium transition-all
                          ${filterType === filter.key 
                            ? 'bg-[#222222] text-white shadow-sm' 
                            : 'bg-white/90 backdrop-blur-sm text-[#222222] hover:bg-white border border-[#DDDDDD]'
                          }
                        `}
                      >
                        <span>{filter.label}</span>
                        <span className={`ml-1 ${filterType === filter.key ? 'text-white/70' : 'text-[#717171]'}`}>
                          {filter.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Mini carte info */}
                  <AnimatePresence>
                    {selectedPoint && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-3 left-3 right-3 z-40 bg-white rounded-lg shadow-lg border border-[#DDDDDD] p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedPoint.type === 'user' ? 'bg-[#F0F3E8]' : 'bg-[#E8F0E8]'
                          }`}>
                            {selectedPoint.type === 'user' ? (
                              <Briefcase className="h-4 w-4 text-[#0A2F1F]" />
                            ) : (
                              <Home className="h-4 w-4 text-[#1E4C2F]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-medium text-[#222222] truncate">
                                {selectedPoint.name}
                              </h4>
                              <button
                                onClick={() => setSelectedPoint(null)}
                                className="text-[#717171] hover:text-[#222222] ml-2"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="text-[10px] text-[#717171]">
                              {selectedPoint.city}
                            </p>
                          </div>
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

          {/* COLONNE STATS - Compacte */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Stats principales */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F7F7F7] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-xs">
                    <Users className="w-4 h-4 text-[#0A2F1F]" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-[#222222]">
                      {partnerPoints.length}
                    </div>
                    <div className="text-[9px] text-[#717171] uppercase tracking-wider">
                      Pros
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#1E4C2F]">
                  <TrendingUp className="h-2.5 w-2.5" />
                  <span>+12%</span>
                </div>
              </div>

              <div className="bg-[#F7F7F7] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-xs">
                    <Home className="w-4 h-4 text-[#1E4C2F]" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-[#222222]">
                      {propertyPoints.length}
                    </div>
                    <div className="text-[9px] text-[#717171] uppercase tracking-wider">
                      Biens
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#1E4C2F]">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <span>4.89</span>
                </div>
              </div>
            </div>

            {/* Points forts - Version compacte */}
            <div className="bg-white rounded-xl p-4 border border-[#DDDDDD]">
              <h3 className="text-xs font-medium text-[#222222] mb-3 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#0A2F1F]" />
                Pourquoi nous choisir
              </h3>
              
              <div className="space-y-2.5">
                {[
                  { icon: Star, text: "Expertise locale", sub: "Marché réunionnais" },
                  { icon: Building2, text: "Diversité", sub: "Biens adaptés" },
                  { icon: Navigation, text: "Accessibilité", sub: "Partout sur l'île" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#F7F7F7] rounded-md flex items-center justify-center">
                      <item.icon className="h-3 w-3 text-[#0A2F1F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#222222]">{item.text}</p>
                      <p className="text-[9px] text-[#717171]">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Partenaire */}
            <a
              href="/devenir-partenaire"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-[#0A2F1F] to-[#1E4C2F] rounded-xl p-4 text-white hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Devenir partenaire</h4>
                  <p className="text-[9px] text-white/80">Rejoignez {points.length} pros</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1 text-[9px] text-white/80">
                <span>En savoir plus</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </a>
          </motion.div>
        </div>

        {/* Villes populaires - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-[#DDDDDD]"
        >
      
          
        
        </motion.div>
      </div>
    </section>
  );
};

export default CardCarte;