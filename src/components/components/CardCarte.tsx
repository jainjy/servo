import {
  Globe2,
  Lightbulb,
  Map,
  Plane,
  Radar,
  Route,
  ShieldCheck,
  SignalHigh,
  Star,
  Users,
  Home,
  MapPin,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapService } from "../../services/mapService";
import { MapPoint } from "../../types/map";

// Thème de couleurs
const colors = {
  logo: "#556B2F",
  "primary-dark": "#6B8E23",
  "light-bg": "#FFFFFF",
  separator: "#D3D3D3",
  "secondary-text": "#8B4513",
  "accent-light": "#98FB98",
  "accent-warm": "#DEB887",
  "neutral-dark": "#2F4F4F",
  "hover-primary": "#7BA05B",
  "hover-secondary": "#A0522D",
  "neutral-light": "#F5F5F5",
  success: "#556B2F",
  warning: "#8B4513",
  "partner-marker": "#FF0000", // Rouge pour partenaires
  "property-marker": "#0000FF", // Bleu pour propriétés
};

// Création d'icônes avec MapPin de Lucide React
const createMapPinIcon = (color: string, size: number = 30) => {
  return divIcon({
    html: `
      <div style="position: relative;">
        <svg width="${size}" height="${size * 1.33}" viewBox="0 0 24 32" fill="${color}" stroke="white" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [size, size * 1.33],
    iconAnchor: [size / 2, size * 1.33],
    popupAnchor: [0, -size * 1.33 + 10],
    className: 'custom-map-pin'
  });
};

const CardCarte: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [center] = useState<[number, number]>([-21.1351, 55.2471]); // Centre Réunion
  const [zoom] = useState<number>(10);
  const [isMapReady, setIsMapReady] = useState(false);

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
        console.error("Erreur chargement carte CardCarte:", err);
        setPoints([]);
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  const partnerPoints = points.filter(p => p.type === "user");
  const propertyPoints = points.filter(p => p.type === "property");

  if (loading) {
    return (
      <div className="w-full px-3 lg:px-12 py-8 flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F]"></div>
          <p className="mt-4 text-[#556B2F]">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full px-3 lg:px-12 py-8"
      style={{ backgroundColor: colors["light-bg"] }}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)] items-stretch">
        {/* Colonne gauche – contenu */}
        <div
          className="bg-white/90 backdrop-blur-sm border rounded-3xl shadow-sm px-8 py-2 lg:py-10 flex flex-col justify-between"
          style={{
            borderColor: colors["separator"],
            backgroundColor: `${colors["light-bg"]}E6`,
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 flex items-center gap-2"
              style={{ color: colors["secondary-text"] }}
            >
              <Plane
                className="w-3.5 h-3.5"
                style={{ color: colors["secondary-text"] }}
              />
              Réseau de partenaires
            </p>
            <h2
              className="text-lg lg:text-4xl font-semibold mb-4 leading-snug flex items-center gap-2"
              style={{ color: colors["neutral-dark"] }}
            >
              <Map
                className="w-6 h-6"
                style={{ color: colors["primary-dark"] }}
              />
              Carte des partenaires et propriétés
            </h2>
            <p
              className="text-sm inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: colors["primary-dark"],
                color: colors["light-bg"],
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                  style={{ backgroundColor: colors["accent-light"] }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: colors["accent-light"] }}
                />
              </span>
              <Star
                className="w-3 h-3"
                style={{ color: colors["accent-warm"] }}
              />
              {points.length} points actifs
            </p>
          </div>

          {/* Texte principal */}
          <div className="space-y-4 mb-8">
            <p
              className="text-sm leading-relaxed flex items-start gap-2"
              style={{ color: colors["neutral-dark"] }}
            >
              <Lightbulb
                className="mt-0.5 w-4 h-4"
                style={{ color: colors["accent-warm"] }}
              />
              <span>
                Visualisez instantanément l'implantation de vos {partnerPoints.length} partenaires et
                de vos {propertyPoints.length} propriétés sur une carte unifiée, pensée pour les
                décisions rapides et la collaboration entre équipes.
              </span>
            </p>
            <div
              className="border rounded-2xl px-4 py-3 flex items-start gap-2"
              style={{
                borderColor: colors["separator"],
                backgroundColor: colors["neutral-light"],
              }}
            >
              <ShieldCheck
                className="mt-0.5 w-4 h-4"
                style={{ color: colors["primary-dark"] }}
              />
              <p
                className="text-xs font-medium"
                style={{ color: colors["neutral-dark"] }}
              >
                Une vue consolidée pour piloter vos partenariats, suivre votre
                portefeuille et identifier de nouvelles opportunités en quelques
                clics.
              </p>
            </div>
          </div>

          {/* Points clés */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
            <div className="space-y-1">
              <p
                className="font-medium flex items-center gap-2"
                style={{ color: colors["neutral-dark"] }}
              >
                <ShieldCheck
                  className="w-4 h-4"
                  style={{ color: colors["primary-dark"] }}
                />
                Partenaires certifiés
              </p>
              <p
                className="text-xs"
                style={{ color: colors["secondary-text"] }}
              >
                {partnerPoints.length} professionnels validés dans votre réseau.
              </p>
            </div>
            <div className="space-y-1">
              <p
                className="font-medium flex items-center gap-2"
                style={{ color: colors["neutral-dark"] }}
              >
                <Star
                  className="w-4 h-4"
                  style={{ color: colors["accent-warm"] }}
                />
                Propriétés disponibles
              </p>
              <p
                className="text-xs"
                style={{ color: colors["secondary-text"] }}
              >
                {propertyPoints.length} biens immobiliers à disposition.
              </p>
            </div>
            <div className="space-y-1">
              <p
                className="font-medium flex items-center gap-2"
                style={{ color: colors["neutral-dark"] }}
              >
                <SignalHigh
                  className="w-4 h-4"
                  style={{ color: colors["primary-dark"] }}
                />
                Suivi qualité
              </p>
              <p
                className="text-xs"
                style={{ color: colors["secondary-text"] }}
              >
                Indicateurs de performance et historique des collaborations.
              </p>
            </div>
            <div className="space-y-1">
              <p
                className="font-medium flex items-center gap-2"
                style={{ color: colors["neutral-dark"] }}
              >
                <Globe2
                  className="w-4 h-4"
                  style={{ color: colors["primary-dark"] }}
                />
                Vision territoriale
              </p>
              <p
                className="text-xs"
                style={{ color: colors["secondary-text"] }}
              >
                Répartition géographique sur toute l'île de la Réunion.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => (window.location.href = "/carte")}
              className="inline-flex items-center gap-2 rounded-full text-sm font-medium px-5 py-3 shadow-sm transition-colors"
              style={{
                backgroundColor: colors["primary-dark"],
                color: colors["light-bg"],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors["hover-primary"];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors["primary-dark"];
              }}
            >
              Explorer la carte complète
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Colonne droite – Carte interactive */}
        <div
          className="relative rounded-3xl overflow-hidden h-[600px]"
          style={{ backgroundColor: colors["neutral-dark"] }}
        >
          {isMapReady && points.length > 0 ? (
            <MapContainer
              center={center}
              zoom={zoom}
              className="h-full w-full rounded-3xl"
              style={{ background: colors["neutral-dark"] }}
              scrollWheelZoom={true}
            >
              {/* Tuile de la carte */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Pins rouges pour les partenaires */}
              {partnerPoints.map((point) => (
                <Marker
                  key={`partner-${point.id}`}
                  position={[point.latitude, point.longitude]}
                  icon={createMapPinIcon(colors["partner-marker"], 28)}
                >
                  <Popup>
                    <div className="p-2 max-w-xs">
                      <h3 className="font-bold text-red-600 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {point.name}
                      </h3>
                      <p className="text-sm mt-1 text-gray-600">
                        {point.city} {point.address ? `- ${point.address}` : ''}
                      </p>
                      {point.metiers && point.metiers.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Métiers:</span> {point.metiers.join(", ")}
                        </p>
                      )}
                      {point.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {point.description}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Pins bleus pour les propriétés */}
              {propertyPoints.map((point) => (
                <Marker
                  key={`property-${point.id}`}
                  position={[point.latitude, point.longitude]}
                  icon={createMapPinIcon(colors["property-marker"], 28)}
                >
                  <Popup>
                    <div className="p-2 max-w-xs">
                      <h3 className="font-bold text-blue-600 flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        {point.name}
                      </h3>
                      <p className="text-sm mt-1 text-gray-600">
                        {point.city} {point.address ? `- ${point.address}` : ''}
                      </p>
                      {point.typeProperty && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Type:</span> {point.typeProperty}
                        </p>
                      )}
                      {point.price && (
                        <p className="text-xs font-medium text-green-600 mt-1">
                          {point.price} €
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-3xl">
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune donnée disponible</p>
                {!loading && (
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-[#556B2F] text-white rounded hover:bg-[#6B8E23] transition-colors"
                  >
                    Réessayer
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Légende */}
          <div className="absolute bottom-4 left-4 z-40">
            <div
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border"
              style={{
                borderColor: colors["separator"],
                backgroundColor: `${colors["light-bg"]}E6`,
              }}
            >
              <h4 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: colors["neutral-dark"] }}>
                <MapPin className="w-4 h-4" style={{ color: colors["primary-dark"] }} />
                Légende
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <MapPin 
                      size={24} 
                      fill={colors["partner-marker"]} 
                      color="white" 
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-medium" style={{ color: colors["neutral-dark"] }}>
                      Partenaires ({partnerPoints.length})
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Professionnels du réseau</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <MapPin 
                      size={24} 
                      fill={colors["property-marker"]} 
                      color="white" 
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-medium" style={{ color: colors["neutral-dark"] }}>
                      Propriétés ({propertyPoints.length})
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Biens immobiliers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques en haut à droite */}
          <div className="absolute top-4 right-4 z-40">
            <div
              className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border"
              style={{
                borderColor: colors["separator"],
                backgroundColor: `${colors["light-bg"]}E6`,
              }}
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MapPin size={14} fill={colors["partner-marker"]} color="white" />
                    <span className="text-xs font-bold" style={{ color: colors["partner-marker"] }}>
                      {partnerPoints.length}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: colors["neutral-dark"] }}>Partenaires</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MapPin size={14} fill={colors["property-marker"]} color="white" />
                    <span className="text-xs font-bold" style={{ color: colors["property-marker"] }}>
                      {propertyPoints.length}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: colors["neutral-dark"] }}>Propriétés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badge en bas à droite */}
          <div className="absolute bottom-4 right-4 z-40">
            <div className="relative">
              <div className="relative flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                    style={{ backgroundColor: colors["primary-dark"] }}
                  />
                  <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colors["primary-dark"] }}
                  />
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: colors["light-bg"] }}
                >
                  <SignalHigh
                    className="w-3.5 h-3.5 inline mr-1"
                    style={{ color: colors["primary-dark"] }}
                  />
                  {points.length} points actifs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCarte;