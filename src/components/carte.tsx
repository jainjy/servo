// components/carte.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, X, Home, Building, Star } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyLocation {
  id: string;
  title: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  type: string;
  price: number | null;
  status: string;
}

interface LocationPickerModalProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
  properties?: PropertyLocation[]; // Ajout des propriétés
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  open,
  onClose,
  value,
  onChange,
  onLocationSelect,
  properties = [] // Valeur par défaut
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'search'>('properties'); // Onglets
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const propertyMarkersRef = useRef<L.Marker[]>([]);

  // Filtrer les propriétés avec des coordonnées valides
  const validProperties = properties.filter(p => 
    p.latitude && p.longitude && p.address
  );

  // Coordonnées par défaut (centré sur les propriétés si disponibles)
  const getDefaultCenter = () => {
    if (validProperties.length > 0) {
      const lats = validProperties.map(p => p.latitude!);
      const lngs = validProperties.map(p => p.longitude!);
      return {
        lat: lats.reduce((a, b) => a + b) / lats.length,
        lng: lngs.reduce((a, b) => a + b) / lngs.length,
        zoom: 11
      };
    }
    return { lat: 20, lng: 0, zoom: 2 }; // Fallback monde entier
  };

  // Initialiser la carte
  useEffect(() => {
    if (!open || !mapRef.current) return;

    const defaultCenter = getDefaultCenter();
    const map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], defaultCenter.zoom);

    // Ajouter la couche de tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Gérer le clic sur la carte
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      await handleMapClick(lat, lng);
    });

    mapInstanceRef.current = map;

    // Ajouter les marqueurs des propriétés
    addPropertyMarkers();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
      propertyMarkersRef.current = [];
    };
  }, [open, properties]);

  // Ajouter les marqueurs des propriétés sur la carte
  const addPropertyMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Supprimer les anciens marqueurs
    propertyMarkersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    propertyMarkersRef.current = [];

    validProperties.forEach(property => {
      if (!property.latitude || !property.longitude) return;

      // Créer une icône personnalisée pour les propriétés
      const propertyIcon = L.divIcon({
        html: `
          <div class="property-map-marker ${property.status === 'for_sale' ? 'sale-marker' : 'rent-marker'}">
            <div class="marker-content">
              <div class="marker-price">
                ${property.price ? new Intl.NumberFormat('fr-FR').format(property.price) + '€' : ''}
              </div>
              <div class="marker-pin"></div>
            </div>
          </div>
        `,
        className: 'custom-property-marker',
        iconSize: [40, 50],
        iconAnchor: [20, 50]
      });

      const marker = L.marker([property.latitude, property.longitude], { 
        icon: propertyIcon 
      }).addTo(mapInstanceRef.current!);

      // Popup avec informations de la propriété
      marker.bindPopup(`
        <div class="property-popup-mini">
          <h4>${property.title}</h4>
          <p class="property-address">${property.address}</p>
          <p class="property-city">${property.city}</p>
          <p class="property-price"><strong>${
            property.price ? new Intl.NumberFormat('fr-FR').format(property.price) + '€' : 'Prix sur demande'
          }</strong></p>
          <button onclick="selectPropertyLocation('${property.address}', ${property.latitude}, ${property.longitude})" 
                  class="popup-select-btn">
            Sélectionner cette localisation
          </button>
        </div>
      `);

      // Gérer le clic sur le marqueur
      marker.on('click', () => {
        handlePropertySelect(property);
      });

      propertyMarkersRef.current.push(marker);
    });

    // Exposer la fonction globale pour les popups
    (window as any).selectPropertyLocation = (address: string, lat: number, lng: number) => {
      setSearchQuery(address);
      onChange(address);
      setSelectedLocation({ lat, lng, address });
      
      // Centrer la carte sur la propriété sélectionnée
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lng], 15);
        updateMarker(lat, lng);
      }
    };
  };

  // Gérer la sélection d'une propriété
  const handlePropertySelect = (property: PropertyLocation) => {
    if (!property.latitude || !property.longitude) return;

    const address = property.address || `${property.city}`;
    setSearchQuery(address);
    onChange(address);
    setSelectedLocation({ 
      lat: property.latitude, 
      lng: property.longitude, 
      address 
    });

    // Centrer la carte sur la propriété sélectionnée
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([property.latitude, property.longitude], 15);
      updateMarker(property.latitude, property.longitude);
    }
  };

  // Recherche d'adresse avec Nominatim
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Gérer le clic sur un résultat de recherche
  const handleResultClick = async (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name;

    setSearchQuery(address);
    onChange(address);
    setSelectedLocation({ lat, lng, address });
    setSearchResults([]);

    // Centrer la carte sur le résultat
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
      updateMarker(lat, lng);
    }
  };

  // Gérer le clic sur la carte
  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      let address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      
      if (data.display_name) {
        address = data.display_name;
      }
      
      setSearchQuery(address);
      onChange(address);
      setSelectedLocation({ lat, lng, address });
      updateMarker(lat, lng);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lng], 13);
      }

    } catch (error) {
      console.error('Erreur lors du reverse geocoding:', error);
      const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      setSearchQuery(address);
      onChange(address);
      setSelectedLocation({ lat, lng, address });
      updateMarker(lat, lng);
    }
  };

  // Mettre à jour le marqueur
  const updateMarker = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }
      markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
    }
  };

  // Valider la sélection
  const handleValidate = () => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
    onClose();
  };

  // Recherche lors de la frappe (avec délai)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && searchQuery !== value && activeTab === 'search') {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

  // Réinitialiser quand on ouvre la modal
  useEffect(() => {
    if (open) {
      setSearchQuery(value);
      setSearchResults([]);
      setActiveTab('properties');
    }
  }, [open, value]);

  // Obtenir l'icône selon le type de propriété
  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
      case 'villa':
      case 'maison':
        return <Home className="h-4 w-4" />;
      case 'apartment':
      case 'appartement':
        return <Building className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  // Formater le prix
  const formatPrice = (price: number | null) => {
    if (!price) return 'Prix sur demande';
    return new Intl.NumberFormat('fr-FR').format(price) + '€';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Sélectionnez une localisation sur la carte
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 min-h-0">
          {/* Panneau latéral */}
          <div className="w-96 flex flex-col border-r">
            {/* Barre d'onglets */}
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'properties' 
                    ? 'bg-slate-900 text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setActiveTab('properties')}
              >
                Nos propriétés ({validProperties.length})
              </button>
              <button
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'search' 
                    ? 'bg-slate-900 text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setActiveTab('search')}
              >
                Recherche
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une adresse..."
                  className="pl-9"
                />
              </div>
            </div>

            {/* Contenu selon l'onglet */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'properties' ? (
                <div className="p-4 space-y-3">
                  {validProperties.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune propriété avec localisation disponible</p>
                    </div>
                  ) : (
                    validProperties.map((property) => (
                      <div
                        key={property.id}
                        className="p-3 border rounded-lg hover:bg-slate-200 cursor-pointer transition-colors group"
                        onClick={() => handlePropertySelect(property)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            {getPropertyIcon(property.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-sm line-clamp-1">
                                {property.title}
                              </h4>
                              {property.status === 'for_sale' ? (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                  À vendre
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                  À louer
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                              {property.address}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                              {property.city}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-primary">
                                {formatPrice(property.price)}
                              </span>
                              <button 
                                className="text-xs text-primary hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePropertySelect(property);
                                }}
                              >
                                Sélectionner
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* Onglet Recherche */
                <div className="p-4">
                  {isSearching ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Recherche en cours...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <div className="font-medium line-clamp-1">
                                {result.display_name.split(',')[0]}
                              </div>
                              <div className="text-muted-foreground text-xs line-clamp-2">
                                {result.display_name}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucun résultat trouvé
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Recherchez une adresse</p>
                      <p className="text-xs mt-2">ou cliquez sur la carte</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Informations de localisation sélectionnée */}
            {selectedLocation && (
              <div className="p-4 border-t bg-accent/50">
                <h4 className="font-medium mb-2 text-sm">Localisation sélectionnée</h4>
                <p className="text-sm mb-2 line-clamp-2">{selectedLocation.address}</p>
                <Button 
                  onClick={handleValidate}
                  className="w-full bg-slate-900 hover:bg-slate-700"
                  size="sm"
                >
                  Valider cet emplacement
                </Button>
              </div>
            )}
          </div>

          {/* Carte */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />
          </div>
        </div>

        {/* Section masquée lorsqu'une localisation est sélectionnée */}
        {!selectedLocation && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Cliquez sur la carte ou sélectionnez une propriété
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleValidate} disabled={!selectedLocation}>
                Utiliser cette localisation
              </Button>
            </div>
          </div>
        )}

        {/* Styles CSS */}
        <style>{`
          .property-map-marker {
            text-align: center;
            cursor: pointer;
          }
          
          .sale-marker .marker-price {
            background: #dc2626;
            color: white;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            white-space: nowrap;
          }
          
          .rent-marker .marker-price {
            background: #059669;
            color: white;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            white-space: nowrap;
          }
          
          .marker-pin {
            width: 20px;
            height: 20px;
            background: currentColor;
            border: 3px solid white;
            border-radius: 50%;
            margin: 2px auto 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .sale-marker .marker-pin {
            color: #dc2626;
          }
          
          .rent-marker .marker-pin {
            color: #059669;
          }
          
          .property-popup-mini {
            min-width: 200px;
          }
          
          .property-popup-mini h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: bold;
          }
          
          .property-popup-mini .property-address {
            margin: 4px 0;
            font-size: 12px;
            color: #666;
          }
          
          .property-popup-mini .property-city {
            margin: 4px 0;
            font-size: 11px;
            color: #888;
          }
          
          .property-popup-mini .property-price {
            margin: 8px 0;
            font-size: 13px;
            color: #dc2626;
            font-weight: bold;
          }
          
          .popup-select-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            width: 100%;
            margin-top: 8px;
          }
          
          .popup-select-btn:hover {
            background: #2563eb;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPickerModal; 