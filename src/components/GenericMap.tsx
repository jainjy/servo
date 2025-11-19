import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GenericMapProps } from '../types/map';
import { initializeLeaflet, createCustomIcon, defaultMapConfig } from '../utilis/leafletConfig';

const GenericMap: React.FC<GenericMapProps> = ({ 
  points, 
  center = defaultMapConfig.center, 
  zoom = defaultMapConfig.zoom,
  height = "500px",
  className = "",
  onPointClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Initialiser Leaflet une seule fois
    initializeLeaflet();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialiser la carte
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Nettoyer à la destruction
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current || !points.length) return;

    const map = mapInstanceRef.current;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => marker.removeFrom(map));
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs
    points.forEach((point) => {
      if (point.latitude && point.longitude) {
        const icon = createCustomIcon(point.type);
        
        const marker = L.marker([point.latitude, point.longitude], { icon })
          .addTo(map)
          .bindPopup(point.popupContent);

        // Gestion du clic sur le marqueur
        marker.on('click', () => {
          if (onPointClick) {
            onPointClick(point);
          }
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
    <div 
      ref={mapRef} 
      className={`w-full ${className}`}
      style={{ height }}
    />
  );
};

export default GenericMap;