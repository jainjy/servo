export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  status: "active" | "upcoming" | "draft" | "completed" | "archived",
  participants: number;
  capacity: number;
  revenue: number;
  featured: boolean;
  organizer: string;
  price: number;
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
export type FilterStatus = "all" | "active" | "upcoming" | "draft" | "published" | "completed" | "archived";