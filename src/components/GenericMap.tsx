import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  useEffect(() => {
    initializeLeaflet();
  }, []);

  // Écouteur pour centrer la carte via événement personnalisé
  useEffect(() => {
    const handleCenterMap = (event: Event) => {
      const customEvent = event as CustomEvent<{ location: [number, number]; zoom?: number }>;
      if (mapInstanceRef.current && customEvent.detail.location) {
        const [lat, lng] = customEvent.detail.location;
        const zoomLevel = customEvent.detail.zoom || 15;
        mapInstanceRef.current.setView([lat, lng], zoomLevel);
      }
    };

    window.addEventListener("centerMap", handleCenterMap);
    return () => {
      window.removeEventListener("centerMap", handleCenterMap);
    };
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

  return (
    <div className="relative">
      <div ref={mapRef} className={`w-full ${className}`} style={{ height }} />
    </div>
  );
};

export default GenericMap;
