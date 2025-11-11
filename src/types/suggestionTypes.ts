//src/types/suggestionTypes.ts
export interface UserActivity {
  userId: string;
  type: "view" | "click" | "purchase";
  itemId: string;
  timestamp?: string;
}

export interface UserEvent {
  userId: string;
  type: "search" | "filter" | "scroll";
  details?: string;
  timestamp?: string;
}

export interface UserPreference {
  userId: string;
  preferences: Record<string, unknown>;
}

export interface Recommendation {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
  type: string;
  sourceType?: string;
  recommendationSource?: string;
  personalizationScore?: number;
  popularityScore?: number;
  viewCount?: number;
  similarity?: number;
}