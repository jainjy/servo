// components/location-picker-modal.tsx
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, X, Navigation, Satellite } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Position par défaut : La Réunion (Saint-Denis)
const DEFAULT_POSITION: [number, number] = [-20.8789, 55.4481];

interface LocationPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

function MapEvents({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
    },
  });
  return null;
}

export function LocationPickerModal({
  open,
  onOpenChange,
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerModalProps) {
  const [map, setMap] = useState<any>(null);
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [tileLayer, setTileLayer] = useState<"standard" | "satellite">("standard");

  const markerRef = useRef<L.Marker | null>(null);

  // Initialiser la position
  useEffect(() => {
    if (latitude && longitude) {
      setSelectedPosition([latitude, longitude]);
    } else {
      setSelectedPosition(DEFAULT_POSITION);
    }
  }, [latitude, longitude, open]);

  // Recentrer la carte quand la modal s'ouvre ou la position change
  useEffect(() => {
    if (map && selectedPosition && open) {
      map.setView(selectedPosition, 15);
      updateMarker(selectedPosition[0], selectedPosition[1]);
    }
  }, [map, selectedPosition, open]);

  const handleMapClick = (lat: number, lng: number) => {
    const newPosition: [number, number] = [lat, lng];
    setSelectedPosition(newPosition);
    updateMarker(lat, lng);

    // Reverse geocoding pour obtenir l'adresse
    fetchAddressFromCoordinates(lat, lng);
  };

  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data.display_name) {
        setSearchQuery(data.display_name);
      } else {
        setSearchQuery(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error("Erreur reverse geocoding:", error);
      setSearchQuery(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
    }
  };

  const updateMarker = (lat: number, lng: number) => {
    if (map && markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    if (map) {
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          const newPosition: [number, number] = [lat, lng];
          setSelectedPosition(newPosition);
          if (map) {
            map.setView(newPosition, 15);
            updateMarker(lat, lng);
            fetchAddressFromCoordinates(lat, lng);
          }
        },
        (error) => {
          console.warn("Erreur de géolocalisation:", error);
          setSelectedPosition(DEFAULT_POSITION);
          if (map) {
            map.setView(DEFAULT_POSITION, 10);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ];
        setSelectedPosition(newPosition);
        if (map) {
          map.setView(newPosition, 15);
          updateMarker(newPosition[0], newPosition[1]);
        }
      }
    } catch (error) {
      console.error("Erreur de recherche:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const newPosition: [number, number] = [lat, lng];

    setSearchQuery(result.display_name);
    setSelectedPosition(newPosition);
    setSearchResults([]);
    setShowSearchResults(false);

    if (map) {
      map.setView(newPosition, 15);
      updateMarker(lat, lng);
    }
  };

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationChange(selectedPosition[0], selectedPosition[1]);
      onOpenChange(false);
    }
  };

  const handleResetToReunion = () => {
    setSelectedPosition(DEFAULT_POSITION);
    setSearchQuery("");
    setShowSearchResults(false);
    if (map) {
      map.setView(DEFAULT_POSITION, 10);
      updateMarker(DEFAULT_POSITION[0], DEFAULT_POSITION[1]);
    }
  };

  const handleClose = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    onOpenChange(false);
  };

  const toggleTileLayer = (layer: "standard" | "satellite") => {
    setTileLayer(layer);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] p-0 gap-0 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-gray-900">
                Sélectionnez votre position
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Cliquez sur la carte pour définir votre position précise
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Contenu principal avec scroll */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Barre de recherche et actions */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 shrink-0">
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une adresse, une ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-10 bg-white border-gray-300"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-4 shrink-0"
              >
                {isSearching ? "..." : "Rechercher"}
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleUseCurrentLocation}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 text-sm"
              >
                <Navigation className="h-4 w-4" />
                Ma position
              </Button>
              <Button
                onClick={handleResetToReunion}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 text-sm"
              >
                <MapPin className="h-4 w-4" />
                La Réunion
              </Button>
              <Button
                onClick={() => toggleTileLayer("standard")}
                variant={tileLayer === "standard" ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2 text-sm"
              >
                Carte
              </Button>
              <Button
                onClick={() => toggleTileLayer("satellite")}
                variant={tileLayer === "satellite" ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2 text-sm"
              >
                <Satellite className="h-4 w-4" />
                Satellite
              </Button>
            </div>
          </div>

          {/* Conteneur principal pour carte et résultats */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            {/* Panneau des résultats de recherche - conditionnel sur mobile */}
            {showSearchResults && (
              <div className="w-full md:w-80 flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-white flex-shrink-0 md:flex">
                <div className="p-4 border-b border-gray-200 md:hidden flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Résultats</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearchResults(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">
                    {isSearching ? (
                      <div className="text-center py-4 text-gray-500">
                        Recherche en cours...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((result, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleResultClick(result)}
                          >
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <div className="font-medium line-clamp-1">
                                  {result.display_name.split(",")[0]}
                                </div>
                                <div className="text-gray-600 text-xs line-clamp-2">
                                  {result.display_name}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Aucun résultat trouvé
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Carte - Prend tout l'espace disponible */}
            <div
              className={`flex-1 min-h-[300px] relative ${
                showSearchResults ? "hidden md:block" : "block"
              }`}
            >
              <MapContainer
                center={selectedPosition}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                ref={setMap}
                className="z-0"
              >
                {tileLayer === "standard" ? (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                ) : (
                  <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                )}
                <MapEvents onLocationChange={handleMapClick} />
                {selectedPosition && <Marker position={selectedPosition} />}
              </MapContainer>

              {/* Bouton pour afficher les résultats sur mobile */}
              {searchResults.length > 0 && !showSearchResults && (
                <Button
                  onClick={() => setShowSearchResults(true)}
                  className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-md md:hidden z-[1000]"
                >
                  Voir les résultats ({searchResults.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer toujours visible */}
        <div className="p-4 border-t border-gray-200 bg-white shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="space-y-1 flex-1">
              {selectedPosition && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Position : </span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs border">
                    {selectedPosition[0].toFixed(6)},{" "}
                    {selectedPosition[1].toFixed(6)}
                  </code>
                </div>
              )}
              <div className="text-xs text-gray-500">
                💡 Cliquez sur la carte pour définir la position précise
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50 px-6"
              >
                Annuler
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedPosition}
                className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6"
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
