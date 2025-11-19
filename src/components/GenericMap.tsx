import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { GenericMapProps, MapPoint } from "../types/map";
import {
  initializeLeaflet,
  createCustomIcon,
  defaultMapConfig,
} from "../utilis/leafletConfig";

const GenericMap: React.FC<GenericMapProps> = ({
  points,
  userLocation,
  center = defaultMapConfig.center,
  zoom = defaultMapConfig.zoom,
  height = "500px",
  className = "",
  onPointClick,
  showRouting = false,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  useEffect(() => {
    initializeLeaflet();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Ajouter la couche de tuiles OpenStreetMap avec un style plus moderne
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Ajouter une couche de contrôle des calques
    const baseMaps = {
      OpenStreetMap: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "&copy; OpenStreetMap contributors",
        }
      ),
      Satellite: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
        }
      ),
    };

    baseMaps["OpenStreetMap"].addTo(map);
    L.control.layers(baseMaps).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // Gérer la position de l'utilisateur
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    const map = mapInstanceRef.current;

    // Supprimer l'ancien marqueur de position
    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.removeFrom(map);
    }

    // Créer un marqueur personnalisé pour la position de l'utilisateur
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `
        <div class="relative">
          <div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>
          <div class="absolute inset-0 rounded-full bg-blue-400 animate-ping"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    userLocationMarkerRef.current = L.marker(userLocation, { icon: userIcon })
      .addTo(map)
      .bindPopup("Votre position actuelle")
      .openPopup();

    // Centrer sur la position de l'utilisateur
    map.setView(userLocation, 15);
  }, [userLocation]);

  // Gérer les marqueurs des points
  useEffect(() => {
    if (!mapInstanceRef.current || !points.length) return;

    const map = mapInstanceRef.current;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => marker.removeFrom(map));
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs
    points.forEach((point) => {
      if (point.latitude && point.longitude) {
        const icon = createCustomIcon(point.type);

        const marker = L.marker([point.latitude, point.longitude], { icon })
          .addTo(map)
          .bindPopup(
            point.popupContent || `<div>${point.name || "Point sans nom"}</div>`
          );

        // Gestion du clic sur le marqueur
        marker.on("click", () => {
          setSelectedPoint(point);
          if (onPointClick) {
            onPointClick(point);
          }
        });

        // Ajouter un effet de hover avec popup simplifié
        marker.on("mouseover", function () {
          this.setPopupContent(
            `<div class="text-sm font-semibold">${point.name}</div>`
          );
          this.openPopup();
        });

        marker.on("mouseout", function () {
          this.closePopup();
        });

        markersRef.current.push(marker);
      }
    });

    // Ajuster la vue pour montrer tous les marqueurs
    if (points.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [points, onPointClick]);

  // Gérer le calcul d'itinéraire
  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !showRouting ||
      !selectedPoint ||
      !userLocation
    )
      return;

    const map = mapInstanceRef.current;

    // Supprimer l'ancien contrôle d'itinéraire
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Créer un nouvel itinéraire
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(selectedPoint.latitude!, selectedPoint.longitude!),
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      lineOptions: {
        styles: [
          { color: "#3B82F6", opacity: 0.7, weight: 5 },
          { color: "#60A5FA", opacity: 0.7, weight: 5 },
        ],
      },
      altLineOptions: {
        styles: [{ color: "#6B7280", opacity: 0.5, weight: 3 }],
      },
      createMarker: () => null, // Ne pas créer de marqueurs supplémentaires
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [selectedPoint, userLocation, showRouting]);

  const clearRoute = () => {
    if (mapInstanceRef.current && routingControlRef.current) {
      mapInstanceRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
  };

  return (
    <div className="relative">
      <div ref={mapRef} className={`w-full ${className}`} style={{ height }} />

      {/* Contrôles personnalisés */}
      {selectedPoint && userLocation && showRouting && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-64">
          <h3 className="font-bold text-lg mb-2">
            Itinéraire vers {selectedPoint.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            L'itinéraire est calculé depuis votre position actuelle
          </p>
          <button
            onClick={clearRoute}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Effacer l'itinéraire
          </button>
        </div>
      )}
    </div>
  );
};

export default GenericMap;
