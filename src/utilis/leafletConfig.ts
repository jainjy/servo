import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solution robuste pour les icônes Leaflet dans React
export const initializeLeaflet = () => {
  // Vérifier si les icônes sont déjà corrigées
  if (typeof (L.Icon.Default.prototype as any)._getIconUrl === 'undefined') {
    return; // Déjà initialisé
  }

  // Corriger les chemins des icônes par défaut
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Icônes personnalisées avec meilleur contraste
export const createCustomIcon = (type: 'user' | 'property' | 'default' = 'default') => {
  const iconColors = {
    user: 'blue',        // ROUGE pour les utilisateurs (meilleure visibilité)
    property: 'green',  //  VERT pour les propriétés  
    default: 'orange'   //  ORANGE par défaut
  };

  const color = iconColors[type];

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Configuration de la carte par défaut
export const defaultMapConfig = {
  center: [-18.8792, 47.5079] as [number, number], // Centre sur Antananarivo
  zoom: 10,
  minZoom: 3,
  maxZoom: 18
};