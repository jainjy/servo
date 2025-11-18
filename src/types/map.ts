// Types de base pour la carte
export interface BaseMapPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'user' | 'property';
  popupContent: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
}

// Point utilisateur avec métiers et services
export interface UserPoint extends BaseMapPoint {
  type: 'user';
  company?: string;
  commercialName?: string;
  userType?: string;
  metiers: string[];
  services: Array<{
    name: string;
    price: number | null;
  }>;
}

// Point propriété
export interface PropertyPoint extends BaseMapPoint {
  type: 'property';
  title: string;
  price?: number;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  status?: string;
  listingType?: string;
  owner?: string;
  ownerPhone?: string;
}

// Type union pour tous les points
export type MapPoint = UserPoint | PropertyPoint;

// Props pour le composant carte
export interface GenericMapProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  onPointClick?: (point: MapPoint) => void;
}

// Réponse API
export interface MapApiResponse {
  success: boolean;
  data: MapPoint[];
  count: number;
}