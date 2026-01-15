export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  
  // CORRIGÉ : Ajouter "cancelled" et enlever "upcoming" si nécessaire
  status: "draft" | "active" | "completed" | "cancelled" | "archived";
  
  participants: number;
  capacity: number;
  revenue: number;
  featured: boolean;
  organizer: string;
  price: number;
  address: string;
  city: string;
  postalCode: string;
  currency: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  duration?: string;
  subCategory?: string;
  discountPrice?: number;
  images?: string[];
  tags?: string[];
  requirements?: string;
  highlights?: string[];
  difficulty?: "easy" | "medium" | "hard";
  targetAudience?: string[];
  includes?: string[];
  notIncludes?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
  visibility?: "public" | "private" | "invite_only";
  registrationDeadline?: string;
  earlyBirdDeadline?: string;
  earlyBirdPrice?: number;
  userId?: string;
}


export interface DiscoveryItem {
  id: number;
  title: string;
  type: string;
  location: string;
  description: string;
  image: string;
  status: "published" | "draft" | "archived" | "active";
  visits: number;
  rating: number;
  revenue: number;
  featured: boolean;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  price?: number;
  organizer?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  includedServices?: string[];
  requirements?: string[];
  maxVisitors?: number;
  availableDates?: string[];
}

export interface Stats {
  totalEvents: number;
  totalDiscoveries: number;
  activeEvents: number;
  totalRevenue: number;
  upcomingEvents: number;
  avgRating: number;
  conversionRate: number;
  totalParticipants: number;
  totalVisits: number;
  popularCategory: string;
}

export type ActiveTab = "events" | "discoveries";
export type ViewMode = "list" | "grid";
// Corriger aussi FilterStatus pour correspondre
export type FilterStatus = "all" | "draft" | "active" | "completed" | "cancelled" | "archived";
