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
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    initializeLeaflet();
  }, []);

  // Écouteur pour centrer la carte via événement personnalisé
  useEffect(() => {
    const handleCenterMap = (event: Event) => {
      const customEvent = event as CustomEvent<{ location: [number, number]; zoom?: number; smooth?: boolean }>;
      if (mapInstanceRef.current && customEvent.detail.location) {
        const [lat, lng] = customEvent.detail.location;
        const zoomLevel = customEvent.detail.zoom || 15;
        const smooth = customEvent.detail.smooth ?? true;
        
        // Utiliser flyTo pour un zoom smooth, sinon setView pour un changement immédiat
        if (smooth) {
          mapInstanceRef.current.flyTo([lat, lng], zoomLevel, {
            duration: 1.5, // Durée en secondes
            easeLinearity: 0.25, // Animation easing
          });
        } else {
          mapInstanceRef.current.setView([lat, lng], zoomLevel);
        }
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

    // Ajouter le bouton de localisation personnalisé
    const LocationControl = L.Control.extend({
      onAdd: (map: L.Map) => {
        const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        div.style.backgroundColor = "white";
        div.style.border = "2px solid #ccc";
        div.style.borderRadius = "4px";
        div.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        div.style.cursor = "pointer";
        div.style.padding = "0";
        
        const button = L.DomUtil.create("button", "", div);
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6; padding: 8px;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        `;
        button.style.background = "none";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.padding = "0";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.width = "36px";
        button.style.height = "36px";
        button.title = "Centrer sur ma position";
        
        button.addEventListener("click", () => {
          setIsLocating(true);
          if (!navigator.geolocation) {
            alert("Géolocalisation non supportée");
            setIsLocating(false);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              window.dispatchEvent(new CustomEvent("centerMap", {
                detail: {
                  location: [latitude, longitude],
                  zoom: 16,
                  smooth: true,
                },
              }));
              setIsLocating(false);
            },
            (error) => {
              console.error("Erreur géolocalisation:", error);
              // Fallback sur Réunion
              window.dispatchEvent(new CustomEvent("centerMap", {
                detail: {
                  location: [-21.1351, 55.2471],
                  zoom: 12,
                  smooth: true,
                },
              }));
              setIsLocating(false);
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 300000,
            }
          );
        });

        return div;
      },
    });

    new (LocationControl as any)({ position: "bottomright" }).addTo(map);

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
      // 🔥 Correction : accepter latitude|lat et longitude|lng
      const lat = point.latitude ?? point.lat;
      const lng = point.longitude ?? point.lng;

      // 🔥 Vérifier NUMÉRIQUEMENT (pas truthy)
      if (typeof lat !== "number" || typeof lng !== "number") {
        console.warn("Point ignoré (coords invalides) :", point);
        return;
      }

      const icon = createCustomIcon(point.type);

      const marker = L.marker([lat, lng], { icon })
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
